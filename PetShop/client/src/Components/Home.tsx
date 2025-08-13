import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
} from '@mui/material';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Premium Quality',
      description: 'All our dogs come from certified breeders and receive the best care',
      image: `${process.env.PUBLIC_URL}/images/DogsShop.jpg`,
    },
    {
      title: 'Expert Care',
      description: 'Regular veterinary checkups and proper vaccination for all our dogs',
      image: `${process.env.PUBLIC_URL}/images/DogsShop_2.jpg`,
    },
    {
      title: '24/7 Support',
      description: 'Professional guidance and support even after adoption',
      image: `${process.env.PUBLIC_URL}/images/DogsShop_3.jpg`,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#fdf6f0' }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Welcome to the Dog Shop Test CI/CD Lấn 1
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Find your perfect furry companion
        </Typography>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ py: 8, bgcolor: '#ffefe1', textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to Explore All Of Our Products For Your New Best Friends?
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Browse our selection of lovely Product waiting for their forever homes
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(`/products?page=1`)}
          sx={{ bgcolor: '#d67d36', '&:hover': { bgcolor: '#c5672d' } }}
        >
          View Our Products
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
