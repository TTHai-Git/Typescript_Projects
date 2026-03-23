import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/login/authSlice';
import { AppDispatch } from '../store';
// import axios from 'axios';
import '../Assets/CSS/Login.css';
import { useNavigate } from 'react-router';
import { UserState } from '../Interface/Users';
import { Alert, Box, Button, TextField, Typography, Container, Paper, Divider } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import APIs, { endpoints, fetchCsrfToken } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isError, setIsError] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("")
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showNotification} = useNotification()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    

    try {
      const ref = searchParams.get("ref")
      const response = await APIs.post(endpoints.login, {
        username,
        password
      });
      if (response.status === 200) {
        const user:UserState = response.data;
        fetchCsrfToken()
        if (user && !user.isAuthenticated2Fa) {
          dispatch(login({
            ...user,
            isAuthenticated: true,
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
          navigate("/login/2fa-verify", {
            state: {
              user: user,
              ref: ref? ref : "",
            }
          })
        }
      }
      else {
        showNotification(t(`${response.data.message}`), 'warning')
      }
      
    } catch (error:any) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false)
    }
  };
  const handleNavigateToRegister = () => {
    const ref = window.location.pathname
    navigate(`/register?ref=${ref}`)
  }

  const handleNavigateToGenerateOTPForForgotPassword = () => {
    const ref = window.location.pathname
    navigate(`/generate-otp?ref=${ref}`)
  }

  useEffect(() => {
    // console.log(from)
  }, [isError])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--pet-bg)', p: 3 }}>
      {loading && <Box className="loading-spinner"></Box>}
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ bgcolor: '#fff3e0', p: 2, borderRadius: '50%' }}>
              <PetsIcon sx={{ fontSize: 40, color: '#ff9800' }} />
            </Box>
          </Box>
          <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723', mb: 1 }}>{t("Welcome Back")}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{t("Please login to your account")}</Typography>
          
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              id="username"
              label={t("Username/Email/Phone")}
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
            
            <TextField
              id="password"
              type="password"
              label={t("Password")}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
            
            {isError && (
              <Alert severity="error" sx={{ borderRadius: '12px', textAlign: 'left' }}>
                {errorMessage}
              </Alert>
            )}  
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography 
                component="a" 
                onClick={() =>handleNavigateToGenerateOTPForForgotPassword() }
                sx={{ cursor: 'pointer', color: '#ff9800', fontWeight: 700, fontSize: '0.95rem', '&:hover': { textDecoration: 'underline' } }}
              >
                {t("Forgot your password?")}
              </Typography>
            </Box>
            
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
            >
              {t("Login")}
            </Button>
            
            <Divider sx={{ my: 2, '&::before, &::after': { borderColor: '#ffe0b2' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>{t("Or")}</Typography>
            </Divider>
            
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleNavigateToRegister()}
              sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 800, color: '#ff9800', borderColor: '#ff9800', borderRadius: '30px', '&:hover': { bgcolor: '#fff3e0', borderColor: '#f57c00' } }}
            >
             {t("Register")}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;