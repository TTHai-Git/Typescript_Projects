import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TikTokIcon from '@mui/icons-material/MusicNote';
import GoogleIcon from '@mui/icons-material/Google';

export const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#f8f8f8', color: '#333', mt: 6, pt: 6, fontSize: 14 }}>
      <Container maxWidth="lg">
        {/* Top Features */}
        <Grid container spacing={2} sx={{ textAlign: 'center', mb: 4 }}>
          {[
            { icon: <LocalShippingIcon color="error" />, title: 'CHÍNH SÁCH GIAO HÀNG', desc: 'Nhận hàng và thanh toán tại nhà' },
            { icon: <AutorenewIcon color="error" />, title: 'ĐỔI TRẢ DỄ DÀNG', desc: '1 đổi 1 trong 7 ngày' },
            { icon: <AttachMoneyIcon color="error" />, title: 'GIÁ LUÔN LUÔN RẺ NHẤT', desc: 'Giá cả hợp lý, nhiều ưu đãi tốt' },
            { icon: <SupportAgentIcon color="error" />, title: 'HỖ TRỢ NHIỆT TÌNH', desc: 'Tư vấn, giải đáp mọi thắc mắc' }
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
          {/* Giới Thiệu */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid red', mb: 1 }}>GIỚI THIỆU DOGSHOP</Typography>
            <Link href="#" color="inherit" underline="hover" display="block">Về chúng tôi</Link>
            <Link href="#" color="inherit" underline="hover" display="block">Tư vấn mua hàng</Link>
            <Link href="#" color="inherit" underline="hover" display="block">Tuyển dụng</Link>
            <Box sx={{ mt: 1 }}>
              <IconButton><FacebookIcon color="primary" /></IconButton>
              <IconButton><YouTubeIcon color="error" /></IconButton>
              <IconButton><TikTokIcon sx={{ color: '#000' }} /></IconButton>
              <IconButton><GoogleIcon sx={{ color: '#db4437' }} /></IconButton>
            </Box>
          </Grid>

          {/* Chính Sách */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid red', mb: 1 }}>CHÍNH SÁCH CHUNG</Typography>
            {[
              'Chính sách bảo mật', 'Chính sách giao nhận, kiểm hàng', 'Chính sách trả góp',
              'Chính sách thanh toán', 'Chính sách giải quyết khiếu nại', 'Chính sách bảo vệ thông tin cá nhân',
              'Chính sách bảo hành', 'Chính sách đổi - trả hàng'
            ].map((text, idx) => (
              <Link href="#" color="inherit" underline="hover" display="block" key={idx}>{text}</Link>
            ))}
          </Grid>

          {/* Thông tin khuyến mãi */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid red', mb: 1 }}>THÔNG TIN KHUYẾN MÃI</Typography>
            <Link href="#" color="inherit" underline="hover" display="block">Tổng hợp khuyến mãi</Link>
          </Grid>

          {/* Hỗ trợ khách hàng */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid red', mb: 1 }}>HỖ TRỢ KHÁCH HÀNG</Typography>
            {[
              'Tổng hợp Hotline CSKH, phản ánh',
              'Lắp đặt phòng PET',
              'Thiết bị Toys House',
              'Tra cứu bảo hành'
            ].map((text, idx) => (
              <Link href="#" color="inherit" underline="hover" display="block" key={idx}>{text}</Link>
            ))}
          </Grid>
        </Grid>

        {/* Bottom Text */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #ddd', textAlign: 'center' }}>
          <Typography variant="caption" display="block" sx={{ color: '#888' }}>
            © Công ty TNHH DOGSHOP | MST: 1234567890 - 30/04/2025 - Sở kế hoạch và đầu tư TP.HCM |
            Trụ sở chính:  Quận Bình Thạnh, TP.HCM |
            Hotline: 9876543210 | Email: 2151050112hai@ou.edu.vn
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
