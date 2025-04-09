import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  LocalOffer,
  Category,
  Store,
  Factory,
  CalendarMonth,
  Pets,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  ShoppingCart,
} from '@mui/icons-material';
import { ProductFood } from '../Interface/Product';

const ProductFoodType = () => {
  const {product_id } = useParams();
  const location = useLocation();
  const type = location.state
  const navigate = useNavigate();
  const [productFoods, setProductFoods] = useState<ProductFood>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const loadInfoDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/v1/products/${type}/${product_id}`);
      setProductFoods(response.data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfoDetailsOfProduct();
  }, []);

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleAddToCart = () => {
    // You can replace this with actual cart logic
    alert('Added to cart!');
  };

  const handleBack = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!productFoods) {
    return <Typography align="center">Product not found.</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} variant="outlined" color="primary">
          Back to Products
        </Button>
        <Tooltip title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}>
          <IconButton color="secondary" onClick={handleToggleFavorite}>
            {isFavorited ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
      </Box>

      <Card sx={{ maxWidth: 1000, margin: '0 auto', boxShadow: 6, borderRadius: 4 }}>
        <CardMedia
          component="img"
          height="300"
          image={productFoods.imageUrl}
          alt={productFoods.name}
          sx={{ objectFit: 'contain', background: '#f9f9f9' }}
        />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {productFoods.name}
            </Typography>
            <Button
              startIcon={<ShoppingCart />}
              variant="contained"
              color="success"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </Box>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {productFoods.description}
          </Typography>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                <LocalOffer sx={{ mr: 1 }} /> Price: ${productFoods.price}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <Category sx={{ mr: 1 }} /> Category: {productFoods.category.name}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <Factory sx={{ mr: 1 }} /> Brand: {productFoods.brand.name}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <Store sx={{ mr: 1 }} /> Vendor: {productFoods.vendor.name}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                <CalendarMonth sx={{ mr: 1 }} /> Expiration Date:{' '}
                {new Date(productFoods.expirationDate).toLocaleDateString()}
              </Typography>

              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Ingredients:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                  {productFoods.ingredients.map((ing, index) => (
                    <Chip key={index} label={ing} color="success" />
                  ))}
                </Box>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Recommended For:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                  {productFoods.recommendedFor.map((target, index) => (
                    <Chip
                      key={index}
                      icon={<Pets />}
                      label={target}
                      variant="outlined"
                      color="secondary"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={productFoods.brand.logoUrl} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Brand Info: {productFoods.brand.name}
                  </Typography>
                  <Typography variant="body2">{productFoods.brand.description}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Vendor Contact: {productFoods.vendor.name}
                </Typography>
                <Typography variant="body2">{productFoods.vendor.contactInfo}</Typography>
                <Typography variant="body2">{productFoods.vendor.email}</Typography>
                <Typography variant="body2">{productFoods.vendor.phone}</Typography>
                <Typography variant="body2">{productFoods.vendor.address}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductFoodType;
