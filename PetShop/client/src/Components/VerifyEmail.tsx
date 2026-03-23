import { useEffect, useState } from 'react';
import APIs, { endpoints } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { Box, Paper, Typography, CircularProgress, Button } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () =>{
   const [message, setMessage] = useState('');
   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
   const params = new URLSearchParams(window.location.search);
   const token = params.get('token');
   const {showNotification} = useNotification()
   const navigate = useNavigate();

   const verifyEmail = async (token:string) => {
    try {
      const response = await APIs.post(`${endpoints.verifyEmail}`, {
        token: token
      })
      if (response.status === 200) {
        setMessage(response.data.message);
        setStatus('success');
        showNotification(response.data.message, 'success')
      }

    } catch (error) {
        console.error("Verification failed:", error);
        setMessage("Verification failed or token expired.")
        setStatus('error');
    }
   }

  useEffect(() => {
    if (token) {
        verifyEmail(token)
    } else {
        setStatus('error');
        setMessage("No token provided");
    }
  }, [token]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--pet-bg)', p: 3 }}>
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff', textAlign: 'center', maxWidth: 400, width: '100%' }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ bgcolor: status === 'error' ? '#ffebee' : '#e8f5e9', p: 3, borderRadius: '50%' }}>
                    {status === 'loading' && <CircularProgress size={48} sx={{ color: '#4caf50' }} />}
                    {status === 'success' && <MarkEmailReadIcon sx={{ fontSize: 48, color: '#4caf50' }} />}
                    {status === 'error' && <ErrorOutlineIcon sx={{ fontSize: 48, color: '#f44336' }} />}
                </Box>
            </Box>

            <Typography variant="h5" fontWeight="900" sx={{ color: '#3e2723', mb: 2 }}>
                {status === 'loading' ? "Verifying..." : status === 'success' ? "Email Verified!" : "Verification Failed"}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {message || "Please wait while we verify your email address..."}
            </Typography>

            {status !== 'loading' && (
                <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate('/login')}
                    sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00' }, transition: 'all 0.2s' }}
                >
                    Return to Login
                </Button>
            )}
        </Paper>
    </Box>
  );
}
export default VerifyEmail
