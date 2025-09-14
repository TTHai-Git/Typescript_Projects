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
    <Box sx={{ bgcolor: '#f8f8f8', color: '#333', mt: 6, pt: 6, fontSize: 14 }}>
      <Container maxWidth="lg">
        {/* Top Features */}
        <Grid container spacing={2} sx={{ textAlign: 'center', mb: 4 }}>
          {[
            { icon: <LocalShippingIcon color="error" />, title: t("SHIPPING POLICY"), desc: t("Receive goods and pay at home") },
            { icon: <AutorenewIcon color="error" />, title: t("EASY RETURNS"), desc: t("1 to 1 exchange within 7 days") },
            { icon: <AttachMoneyIcon color="error" />, title: t("ALWAYS THE BEST PRICE"), desc: t("Reasonable price, many great deals") },
            { icon: <SupportAgentIcon color="error" />, title: t("DEDICATED SUPPORT"), desc: t("Consulting and answering all questions") }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box>
                {item.icon}
                <Typography fontWeight="bold" mt={1}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Main Footer Sections */}
        <Grid container spacing={4}>
          {/* About */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid red', mb: 1 }}>{t("ABOUT DOGSHOP")}</Typography>
            <Link href="#" color="inherit" underline="hover" display="block">{t("About us")}</Link>
            <Link href="#" color="inherit" underline="hover" display="block">{t("Shopping guide")}</Link>
            <Link href="#" color="inherit" underline="hover" display="block">{t("Careers")}</Link>
            <Box sx={{ mt: 1 }}>
              <IconButton><FacebookIcon color="primary" /></IconButton>
              <IconButton><YouTubeIcon color="error" /></IconButton>
              <IconButton><TikTokIcon sx={{ color: '#000' }} /></IconButton>
              <IconButton><GoogleIcon sx={{ color: '#db4437' }} /></IconButton>
            </Box>
          </Grid>

          {/* Policies */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid red', mb: 1 }}>{t("GENERAL POLICIES")}</Typography>
            {[
              "Privacy Policy", "Delivery & Inspection Policy", "Installment Policy",
              "Payment Policy", "Complaint Resolution Policy", "Personal Data Protection Policy",
              "Warranty Policy", "Return & Exchange Policy"
            ].map((text, idx) => (
              <Link href="#" color="inherit" underline="hover" display="block" key={idx}>{t(text)}</Link>
            ))}
          </Grid>

          {/* Promotions */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid red', mb: 1 }}>{t("PROMOTION INFO")}</Typography>
            <Link href="#" color="inherit" underline="hover" display="block">{t("All promotions")}</Link>
          </Grid>

          {/* Customer Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid red', mb: 1 }}>{t("CUSTOMER SUPPORT")}</Typography>
            {[
              "Customer service hotline, feedback",
              "PET room installation",
              "Toys House equipment",
              "Warranty lookup"
            ].map((text, idx) => (
              <Link href="#" color="inherit" underline="hover" display="block" key={idx}>{t(text)}</Link>
            ))}
          </Grid>
        </Grid>

        {/* Bottom Text */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #ddd', textAlign: 'center' }}>
          <Typography variant="caption" display="block" sx={{ color: '#888' }}>
            © {t("DOGSHOP Co., Ltd | Tax Code: 1234567890 - 30/04/2025 - Department of Planning and Investment HCMC | Headquarters: Binh Thanh District, HCMC | Hotline: 9876543210 | Email: 2151050112hai@ou.edu.vn")}
          </Typography>
        </Box>
      </Container>
    </Box>

  );
};
