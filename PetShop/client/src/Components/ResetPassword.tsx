import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
// import axios from 'axios';
import APIs, { endpoints } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state || null;
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    setIsLoading(true);

    const OTP = otpDigits.join('');

    if (confirmNewPassword !== newPassword) {
      setIsError(true);
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setIsError(true);
      setErrorMessage('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      // const res = await axios.put('/v1/users/reset-password', {
      //   email,
      //   otp: OTP,
      //   newPassword,
      // });
      const res = await APIs.put(endpoints.resetPassword, {
        email,
        otp: OTP,
        newPassword,
      });

      if (res.status === 200) {
        showNotification(t(`${res.data.message}`), 'success');
        navigate('/login');
      }
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
  <Container maxWidth="sm">
    <Box mt={8} p={4} boxShadow={3} borderRadius={3} bgcolor="background.paper">
      <Typography variant="h4" gutterBottom color="primary">
        {t("Reset Password")}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t("Enter your new password and the 6-digit OTP sent to your email.")}
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleResetPassword}>
        <TextField
          label={t("New Password")}
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <TextField
          label={t("Confirm New Password")}
          type="password"
          fullWidth
          margin="normal"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />

        <Box mt={3} mb={1}>
          <Typography variant="subtitle1" gutterBottom>
            {t("OTP Code")} <span style={{ float: 'right' }}>{t("Expires in")}: {formatTime(timeLeft)}</span>
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            {otpDigits.map((digit, index) => (
              <Grid item key={index}>
                <TextField
                  inputRef={(el) => (inputRefs.current[index] = el!)}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '20px' },
                  }}
                  sx={{ width: 48 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={4}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading || timeLeft === 0}
            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {timeLeft === 0 ? t("OTP Expired") : t("Reset Password")}
          </Button>
        </Box>
      </form>
    </Box>
  </Container>
);

};

export default ResetPassword;
