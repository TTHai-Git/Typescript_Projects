import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Home = () => {
  console.log(`${process.env.PUBLIC_URL}`)
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Mock data for categories/features
  const categories = [
    
    {
      title: t(`Adopt A Dog`),
      description: t("Find your perfect furry companion from our certified breeders."),
      image: `${process.env.PUBLIC_URL}/images/DogsShop.jpg`,
      link: "/products?category=67f8b16808c00df1c417a843&page=1",
    },
    {
      title: t("Dog Food & Treats"),
      description: t("Premium nutrition and delicious snacks for your best friend."),
      image: `${process.env.PUBLIC_URL}/images/DogsShop_2.jpg`,
      link: "/products?category=67efb30aacc6552c10d1b3da&page=1",
    },
    {
      title: t("Clothes"),
      description: t("Everything from collars to nice clothes to keep your dog beautifu."),
      image: `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}${process.env.REACT_APP_DIR_CLOUD}v1757479958/${process.env.REACT_APP_FOLDER_CLOUD}/houndsome-homepage-banner-knits_9480144e-e48a-4b93-b69f-6811bb618103_x8ck3k.webp`,
      link: "/products?category=67efb5e3821737f5b78eec89&page=1",
    },
    {
      title: t("Accessories & Toys"),
      description: t("Everything from collars to fun toys to keep your dog happy."),
      image: `${process.env.PUBLIC_URL}/images/DogsShop_3.jpg`,
      link: "/products?category=67f0ccd1c0610fa866ee7289&page=1",
    },
  ];

  

  return (
    <Box>
      {/* Playful Hero Section */}
      <Box
        sx={{
          pt: { xs: 10, md: 15 },
          pb: { xs: 12, md: 18 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #fff9f2 0%, #ffe8cc 100%)",
        }}
      >
        {/* Decorative background paw/blubs could go here, for now using pure CSS styling */}
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h2"
            fontWeight="900"
            gutterBottom
            sx={{ 
              color: "#3e2723", 
              fontFamily: "'Nunito', sans-serif",
              fontSize: { xs: "2.5rem", md: "4rem" },
              letterSpacing: "-1px"
            }}
          >
            {t("Welcome To Dog Shop")} <br/>
            <Typography component="span" variant="h2" fontWeight="900" sx={{ color: "#ff9800", fontSize: "inherit" }}>
              🐾
            </Typography>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ mb: 5, fontSize: "1.25rem", maxWidth: "600px", mx: "auto" }}
          >
            {t("Adopt, care, and shop for everything your furry best friend needs.")}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(`/products?page=1`)}
            sx={{
              bgcolor: "#ff9800",
              color: "white",
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              fontSize: "1.2rem",
              boxShadow: "0 10px 20px rgba(255, 152, 0, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": { 
                bgcolor: "#f57c00",
                transform: "translateY(-3px)",
                boxShadow: "0 15px 25px rgba(255, 152, 0, 0.4)",
              },
            }}
          >
            {t("Explore the Shop")}
          </Button>
        </Container>
        
        {/* Soft SVG wave bottom divider */}
        <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", overflow: "hidden", lineHeight: 0 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: "block", width: "calc(100% + 1.3px)", height: "60px" }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C84.71,118.89,198.85,76.5,321.39,56.44Z" fill="#fffbf7"></path>
          </svg>
        </Box>
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ py: 10, bgcolor: "var(--pet-bg)" }}>
        <Typography
          variant="h3"
          fontWeight="800"
          gutterBottom
          textAlign="center"
          sx={{ color: '#3e2723' }}
        >
          {t("Explore Our Categories")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mb={8}
          sx={{ fontSize: "1.1rem" }}
        >
          {t("Whether you’re adopting or shopping for essentials, we’ve got you covered.")}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                onClick={() => navigate(cat.link)}
                elevation={0}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  bgcolor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  "&:hover": { 
                    transform: "translateY(-10px)",
                  },
                  "&:hover .category-img-wrapper": {
                    boxShadow: "0 20px 40px rgba(255,152,0,0.2)",
                    borderColor: "#ff9800",
                  }
                }}
              >
                <Box className="category-img-wrapper" sx={{ 
                  width: 180, 
                  height: 180, 
                  borderRadius: "50%", 
                  overflow: "hidden",
                  mb: 3,
                  border: "4px solid #fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease"
                }}>
                  <CardMedia
                    component="img"
                    height="100%"
                    image={cat.image}
                    alt={cat.title}
                    sx={{ objectFit: "cover", transition: "transform 0.5s ease", "&:hover": { transform: "scale(1.1)" } }}
                  />
                </Box>
                <CardContent sx={{ textAlign: "center", p: 0 }}>
                  <Typography variant="h6" fontWeight="800" gutterBottom sx={{ color: "#3e2723" }}>
                    {cat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                    {cat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Highlight Section */}
      <Box sx={{ bgcolor: "#fff", py: 12, borderRadius: { xs: "0", md: "60px" }, mx: { xs: 0, md: 4 }, boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                <Box sx={{ position: "absolute", top: -20, left: -20, width: 100, height: 100, bgcolor: "#ffe0b2", borderRadius: "50%", zIndex: 0 }} />
                <Box sx={{ position: "absolute", bottom: -30, right: -10, width: 150, height: 150, bgcolor: "#e8f5e9", borderRadius: "50%", zIndex: 0 }} />
                <img
                  src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}${process.env.REACT_APP_DIR_CLOUD}v1757480544/${process.env.REACT_APP_FOLDER_CLOUD}/istockphoto-1283863174-612x612_kd51xo.jpg`}
                  alt="Happy Dog"
                  style={{
                    width: "100%",
                    borderRadius: "30px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    border: "8px solid #fff",
                    position: "relative",
                    zIndex: 1
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="900" sx={{ color: '#3e2723', mb: 3 }}>
                {t("Why Choose Dog Shop?")}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {[
                  t("Certified Breeders & Healthy Dogs"),
                  t("Premium Products & Nutrition"),
                  t("Expert Guidance & 24/7 Support")
                ].map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: "#fffbf7", borderRadius: "16px", border: "1px solid #ffcc80", transition: "all 0.2s", "&:hover": { transform: "translateX(10px)", bgcolor: "#fff3e0" } }}>
                    <Typography sx={{ fontSize: "1.5rem", mr: 2 }}>🐾</Typography>
                    <Typography variant="body1" fontWeight="600" sx={{ color: "#5d4037" }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(`/products?page=1`)}
                sx={{
                  color: "#ff9800",
                  borderColor: "#ff9800",
                  borderWidth: "2px",
                  mt: 2,
                  px: 5,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": { borderWidth: "2px", bgcolor: "#fff3e0" },
                }}
              >
                {t("Discover More")}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: { xs: 10, md: 15 }, mt: 8, bgcolor: "#ff9800", textAlign: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
        {/* Soft SVG wave top divider */}
        <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", overflow: "hidden", lineHeight: 0, transform: "rotate(180deg)" }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: "block", width: "calc(100% + 1.3px)", height: "60px" }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C84.71,118.89,198.85,76.5,321.39,56.44Z" fill="#fffbf7"></path>
          </svg>
        </Box>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, mt: 4 }}>
          <Typography variant="h2" fontWeight="900" gutterBottom sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            {t("Ready to Meet Your New Best Friend?")}
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: "600px", mx: "auto", mb: 6, fontSize: "1.2rem", fontWeight: 500, opacity: 0.9 }}
          >
            {t("Browse our wide selection of adorable dogs, premium food, and fun accessories to make your pup’s life amazing.")}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(`/products?page=1`)}
            sx={{
              bgcolor: "#fff",
              color: "#f57c00",
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              fontSize: "1.2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              "&:hover": { 
                bgcolor: "#fff3e0",
                transform: "translateY(-3px)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              },
            }}
          >
            {t("View Products")}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
