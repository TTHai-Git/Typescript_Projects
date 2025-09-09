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

const Home = () => {
  const navigate = useNavigate();

  // Mock data for categories/features
  const categories = [
    {
      title: "Adopt a Dog",
      description: "Find your perfect furry companion from our certified breeders.",
      image: `${process.env.PUBLIC_URL}/images/DogsShop.jpg`,
      link: "/products?page=1&category=dogs",
    },
    {
      title: "Dog Food & Treats",
      description: "Premium nutrition and delicious snacks for your best friend.",
      image: `${process.env.PUBLIC_URL}/images/DogsShop_2.jpg`,
      link: "/products?page=1&category=food",
    },
    {
      title: "Accessories & Toys",
      description: "Everything from collars to fun toys to keep your dog happy.",
      image: `${process.env.PUBLIC_URL}/images/DogsShop_3.jpg`,
      link: "/products?page=1&category=accessories",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 12,
          textAlign: "center",
          bgcolor: "linear-gradient(135deg, #fff5e6 0%, #ffe0cc 100%)",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#2c2c2c" }}
          >
            Welcome to Dog Shop 🐾
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            Adopt, care, and shop for everything your furry best friend needs.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(`/products?page=1`)}
            sx={{
              bgcolor: "#d67d36",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: "30px",
              "&:hover": { bgcolor: "#c5672d" },
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Explore Our Categories
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mb={6}
        >
          Whether you’re adopting or shopping for essentials, we’ve got you
          covered.
        </Typography>
        <Grid container spacing={4}>
          {categories.map((cat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => navigate(cat.link)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  borderRadius: "16px",
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={cat.image}
                  alt={cat.title}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {cat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Highlight Section */}
      <Box sx={{ bgcolor: "#fdf6f0", py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <img
                src={`${process.env.PUBLIC_URL}/images/DogsShop_highlight.jpg`}
                alt="Happy Dog"
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Why Choose Dog Shop?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                ✅ Certified Breeders & Healthy Dogs
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                ✅ Premium Products & Nutrition
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                ✅ Expert Guidance & 24/7 Support
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(`/products?page=1`)}
                sx={{
                  bgcolor: "#d67d36",
                  mt: 3,
                  px: 4,
                  borderRadius: "30px",
                  "&:hover": { bgcolor: "#c5672d" },
                }}
              >
                Discover More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 10, bgcolor: "#ffefe1", textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to Meet Your New Best Friend?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
        >
          Browse our wide selection of adorable dogs, premium food, and fun
          accessories to make your pup’s life amazing.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(`/products?page=1`)}
          sx={{
            bgcolor: "#d67d36",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: "30px",
            "&:hover": { bgcolor: "#c5672d" },
          }}
        >
          View Products
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
