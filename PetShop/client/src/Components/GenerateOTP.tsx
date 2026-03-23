import React, {useState } from 'react'
import { useNavigate } from 'react-router'
import APIs, { endpoints } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const GenerateOTP = () => {
    const [email, setEmail] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const { showNotification } = useNotification()
    const [searchParams] = useSearchParams()
    const { t } = useTranslation();
    const handleGenerateOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await APIs.post(endpoints.generateOTP, {
              email
           })
            console.log(res.data)
            if (res.status === 200) {
              showNotification(t(`${res.data.message}`), "success")
              handleNavigateToResetPassword()
              setLoading(false)
            }
            
        } catch (error:any) {
          
          showNotification(error.response?.data?.message || 'Something went wrong', "error");
            
        } finally {
          setLoading(false)
        }
    }

    const handleNavigateToResetPassword = () => {
      const ref = searchParams.get('ref')
      navigate(`/reset-password?ref=${ref}`, {state: email})
    }
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--pet-bg)', p: 3 }}>
      {loading && <Box className="loading-spinner"></Box>}
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff', textAlign: 'center', position: 'relative' }}>
          
          <IconButton onClick={() => navigate(`${searchParams.get('ref')}`)} sx={{ position: 'absolute', top: 24, left: 24, color: '#ff9800', bgcolor: '#fff3e0', '&:hover': { bgcolor: '#ffe0b2' } }}>
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 4 }}>
            <Box sx={{ bgcolor: '#fff3e0', p: 2, borderRadius: '50%' }}>
              <MailOutlineIcon sx={{ fontSize: 40, color: '#ff9800' }} />
            </Box>
          </Box>
          
          <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723', mb: 1 }}>{t("Forgot Password?")}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{t("Please enter the email for your account")}</Typography>
          
          <Box component="form" onSubmit={handleGenerateOTP} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              id="email"
              type="email"
              label={t("Email")}
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
            >
              {t("Find Account")}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );

}

export default GenerateOTP
