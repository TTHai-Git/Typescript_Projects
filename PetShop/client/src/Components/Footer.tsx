import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TikTokIcon from '@mui/icons-material/MusicNote';
import GoogleIcon from '@mui/icons-material/Google';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ bgcolor: '#3e2723', color: '#fff', mt: 8, pt: 8, pb: 4, fontSize: 14, borderRadius: '48px 48px 0 0', position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Top Features */}
        <Grid container spacing={3} sx={{ textAlign: 'center', mb: 8 }}>
          {[
            { icon: <LocalShippingIcon sx={{ fontSize: 40, color: '#ff9800' }} />, title: t("SHIPPING POLICY"), desc: t("Receive goods and pay at home") },
            { icon: <AutorenewIcon sx={{ fontSize: 40, color: '#ffbd59' }} />, title: t("EASY RETURNS"), desc: t("1 to 1 exchange within 7 days") },
            { icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#4caf50' }} />, title: t("ALWAYS THE BEST PRICE"), desc: t("Reasonable price, many great deals") },
            { icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#29b6f6' }} />, title: t("DEDICATED SUPPORT"), desc: t("Consulting and answering all questions") }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '24px', p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-5px)' } }}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', p: 2, mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography fontWeight="800" sx={{ mb: 1, letterSpacing: '0.5px' }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{item.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Main Footer Sections */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* About */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="800" variant="h6" sx={{ borderBottom: '3px solid #ff9800', mb: 3, pb: 1, display: 'inline-block' }}>{t("ABOUT DOGSHOP")}</Typography>
            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff9800', pl: 1 }, transition: 'all 0.2s', mb: 1.5, display: 'block', textDecoration: 'none' }}>{t("About us")}</Link>
            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff9800', pl: 1 }, transition: 'all 0.2s', mb: 1.5, display: 'block', textDecoration: 'none' }}>{t("Shopping guide")}</Link>
            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff9800', pl: 1 }, transition: 'all 0.2s', mb: 1.5, display: 'block', textDecoration: 'none' }}>{t("Careers")}</Link>
            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#1877F2' } }}><FacebookIcon /></IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#FF0000' } }}><YouTubeIcon /></IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#000000' } }}><TikTokIcon /></IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#db4437' } }}><GoogleIcon /></IconButton>
            </Box>
          </Grid>

          {/* Policies */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="800" variant="h6" sx={{ borderBottom: '3px solid #ff9800', mb: 3, pb: 1, display: 'inline-block' }}>{t("GENERAL POLICIES")}</Typography>
            {[
              "Privacy Policy", "Delivery & Inspection Policy", "Installment Policy",
              "Payment Policy", "Complaint Resolution Policy", "Personal Data Protection Policy",
              "Warranty Policy", "Return & Exchange Policy"
            ].map((text, idx) => (
              <Link href="#" key={idx} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff9800', pl: 1 }, transition: 'all 0.2s', mb: 1.5, display: 'block', textDecoration: 'none' }}>{t(text)}</Link>
            ))}
          </Grid>

          {/* Promotions */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="800" variant="h6" sx={{ borderBottom: '3px solid #ff9800', mb: 3, pb: 1, display: 'inline-block' }}>{t("PROMOTION INFO")}</Typography>
            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff9800', pl: 1 }, transition: 'all 0.2s', mb: 1.5, display: 'block', textDecoration: 'none' }}>{t("All promotions")}</Link>
          </Grid>

          {/* Customer Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="800" variant="h6" sx={{ borderBottom: '3px solid #ff9800', mb: 3, pb: 1, display: 'inline-block' }}>{t("CUSTOMER SUPPORT")}</Typography>
            {[
              "Customer service hotline, feedback",
              "PET room installation",
              "Toys House equipment",
              "Warranty lookup"
            ].map((text, idx) => (
              <Link href="#" key={idx} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ff9800', pl: 1 }, transition: 'all 0.2s', mb: 1.5, display: 'block', textDecoration: 'none' }}>{t(text)}</Link>
            ))}
          </Grid>
        </Grid>

        {/* Bottom Text */}
        <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
            © {t("DOGSHOP Co., Ltd | Tax Code: 1234567890 - 30/04/2025 - Department of Planning and Investment HCMC")}
            <br />
            {t("Headquarters: Binh Thanh District, HCMC | Hotline: 9876543210 | Email: 2151050112hai@ou.edu.vn")}
          </Typography>
        </Box>
      </Container>
    </Box>

  );
};
