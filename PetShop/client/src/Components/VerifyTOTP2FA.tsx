import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { authApi, endpoints, fetchCsrfToken } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { login } from '../features/login/authSlice';

export const VerifyTOTP2FA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification} = useNotification()
  const { t } = useTranslation()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [verifying, setVerifying] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  
  // Destructure the state safely
  const { _id, secretKey2FA, ref } = location.state || {};

  

   const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyTOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) return showNotification("Enter all 6 digits", "warning");
    try {
       
        setVerifying(true);
        const response = await authApi.post(endpoints['loginWith2Fa'], {
            totp: code,
            secretKey: secretKey2FA,
            userId: _id
        })
        if (response.status === 200 && response.data.isVerified2FA) {
            showNotification(t(`${response.data.message}`), "success")
            
            dispatch(login({
            ...response.data.user,
            isAuthenticated: response.data.isVerified2FA,
            }));
            
            fetchCsrfToken()

            if (ref) 
            {
              navigate(`${ref}`)
            } 
            else {
              navigate("/products")
            }

        }
        else {
            showNotification(t(`${response.data.message}`), "warning")    
        }
       
        
    } catch (error:any) {
        showNotification(t(`${error.response.data.message}`), "error")
    } finally {
       
        setVerifying(false);
    }
  }

  useEffect(() => {
    if (!location.state) {
      // Optional: redirect if accessed directly without state
      navigate("/login");
    }
  }, [location.state, navigate])

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f8f9fb", position: "relative" }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{
          position: "absolute",
          top: 30,
          left: 30,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        {t("Go Back")}
      </Button>

      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          width: { xs: "90%", sm: 400 },
          textAlign: "center",
        }}
      >

        <Typography variant="h5" fontWeight="600" mb={2}>
            Scan using your authenticator app (Google Authenticator, Microsoft Authenticator, Authy, Duo Mobile, etc.)
        </Typography>
        

        <Typography variant="subtitle1" fontWeight={600} align="left" mb={1}>
           Step 1: Enter the one-time code
        </Typography>

        <Typography variant="body2" color="text.secondary" align="left" mb={2}>
          Enter the 6-digit verification code from your authenticator app.
        </Typography>

        <Grid container spacing={1} justifyContent="center" mb={3}>
          {otp.map((digit, index) => (
            <Grid item key={index}>
              <TextField
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "20px",
                    width: "45px",
                    height: "45px",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          fullWidth
          variant="contained"
          color={"primary"}
          onClick={handleVerifyTOTP}
          disabled={verifying || otp.join("").length !== 6}
          sx={{ py: 1.2, fontWeight: 600 }}
        >
          {verifying ? (
            <CircularProgress size={24} />
          ) : (
            "Verify 2FA"
          )}
        </Button>
      </Paper>
    </Box>
  )
}
