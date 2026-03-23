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
  const { user, secretKey2FA, ref } = location.state || {};

  

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
        const response = await authApi.post(endpoints['verifyTOTP'], {
            totp: code,
            secretKey: secretKey2FA,
            userId: user._id,
        })
        if (response.status === 200 && response.data.isVerified2FA) {
            showNotification(t(`${response.data.message}`), "success")
            
            dispatch(login({
            ...user,
            isAuthenticated: response.data.isVerified2FA,
            }));

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
      sx={{ bgcolor: 'var(--pet-bg)', p: 3, position: "relative" }}
    >
      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{
          position: "absolute",
          top: { xs: 20, md: 40 },
          left: { xs: 20, md: 40 },
          borderRadius: "30px",
          bgcolor: '#fff',
          color: '#ff9800',
          boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
          textTransform: "none",
          fontWeight: "bold",
          '&:hover': { bgcolor: '#fff3e0' }
        }}
      >
        {t("Go Back")}
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          borderRadius: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          width: { xs: "100%", sm: 480 },
          textAlign: "center",
          bgcolor: '#fff'
        }}
      >

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723', mb: 2 }}>
              {t("Verify Authenticator")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("Enter the 6-digit verification code from your authenticator app.")}
          </Typography>
        </Box>

        <Grid container spacing={1.5} justifyContent="center" mb={4}>
          {otp.map((digit, index) => (
            <Grid item key={index}>
              <TextField
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "800",
                    width: "50px",
                    height: "50px",
                    padding: "10px",
                    color: '#ff9800'
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerifyTOTP}
          disabled={verifying || otp.join("").length !== 6}
          sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
        >
          {verifying ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("Verify 2FA")
          )}
        </Button>
      </Paper>
    </Box>
  )
}
