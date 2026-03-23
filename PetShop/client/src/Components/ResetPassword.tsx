import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
// import axios from 'axios';
import APIs, { endpoints } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state || null;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { showNotification } = useNotification()
  const {t} = useTranslation()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otpDigits];
      updatedOtp[index] = value;
      setOtpDigits(updatedOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleValidatePassWord = (passWord: string) => {
    // at least 8 chars, 1 upper, 1 lower, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(passWord);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
   
    setLoading(true);

    const OTP = otpDigits.join('');

    if (confirmNewPassword !== newPassword) {
      showNotification('Passwords do not match.', 'warning');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
     
      showNotification('Password must be at least 8 characters.', "warning");
      setLoading(false);
      return;
    }

    if (!handleValidatePassWord(newPassword)) {
      showNotification('Password must be at least 8 chars, 1 upper, 1 lower, 1 number', "warning");
      setLoading(false);
      return;
    }

    try {
      const res = await APIs.put(endpoints.resetPassword, {
        email,
        otp: OTP,
        newPassword,
      });

      if (res.status === 200) {
        showNotification(t(`${res.data.message}`), 'success');
        handleRedirectToLogin()
        
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Something went wrong', "warning");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };
  
  const handleRedirectToLogin = () => {
    const ref = searchParams.get('ref')
    navigate(`${ref}`);
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--pet-bg)', p: 3 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff', position: 'relative' }}>
          
          <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723', mb: 1, textAlign: 'center' }}>
            {t("Reset Password")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            {t("Enter your new password and the 6-digit OTP sent to your email.")}
          </Typography>
          
          <Box component="form" onSubmit={handleResetPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label={t("New Password")}
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
    
            <TextField
              label={t("Confirm New Password")}
              type="password"
              fullWidth
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
    
            <Box mt={1} mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="700" color="#3e2723">
                  {t("OTP Code")}
                </Typography>
                <Typography variant="body2" fontWeight="600" color={timeLeft <= 60 ? 'error' : 'secondary'}>
                  {t("Expires in")}: {formatTime(timeLeft)}
                </Typography>
              </Box>
              
              <Grid container spacing={1.5} justifyContent="center">
                {otpDigits.map((digit, index) => (
                  <Grid item key={index}>
                    <TextField
                      inputRef={(el) => (inputRefs.current[index] = el!)}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          fontSize: "24px",
                          fontWeight: "800",
                          width: "40px",
                          height: "40px",
                          padding: "10px",
                          color: '#ff9800'
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
    
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || timeLeft === 0 || otpDigits.join('').length !== 6}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
            >
              {timeLeft === 0 ? t("OTP Expired") : t("Reset Password")}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
