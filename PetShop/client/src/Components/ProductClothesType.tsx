import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { ProductClothes } from '../Interface/Product';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Divider,
  Box,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { Favorite, ShoppingCart, ColorLens, FitnessCenter, LocalOffer, ArrowBack } from '@mui/icons-material';

const ProductClothesType = () => {
  const { product_id } = useParams();
  const location = useLocation();
  const type = location.state;
  const [loading, setLoading] = useState<boolean>(false);
  const [productClothes, setProductClothes] = useState<ProductClothes>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const navigate = useNavigate()

  const loadInfoDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/v1/products/${type}/${product_id}`);
      setProductClothes(response.data.product);
      console.log('Product Clothes: ', response.data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/products');
  };

  useEffect(() => {
    loadInfoDetailsOfProduct();
  }, []);

  const handleSizeClick = (size: string) => setSelectedSize(size);
  const handleMaterialClick = (material: string) => setSelectedMaterial(material);
  const handleColorClick = (color: string) => setSelectedColor(color);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!productClothes) {
    return <Typography variant="h6" align="center">No product details available</Typography>;
  }

  return (
    
    <Container>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} variant="outlined" color="primary">
          Back to Products
        </Button>
      </Box>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} sm={6}>
          <Card elevation={12}>
            <CardMedia
              component="img"
              image={productClothes.imageUrl}
              alt={productClothes.name}
              height="auto"
              
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} sm={6}>
          <Card elevation={12} style={{ backgroundColor: '#f9f9f9' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom color="primary">
                {productClothes.name}
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {productClothes.category.name}
              </Typography>
              <Typography variant="body1" paragraph color="textPrimary">
                {productClothes.description}
              </Typography>

              {/* Price */}
              <Typography variant="h5" color="secondary" gutterBottom>
                ${productClothes.price.toFixed(2)}
              </Typography>

              {/* Size Widget */}
              <Typography variant="h6" gutterBottom color="primary">Size</Typography>
              <Box display="flex" gap={1} mb={2}>
                {productClothes.size.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    clickable
                    color={selectedSize === size ? 'primary' : 'default'}
                    onClick={() => handleSizeClick(size)}
                    style={{
                      backgroundColor: selectedSize === size ? '#1976d2' : '#e0e0e0',
                      color: selectedSize === size ? '#fff' : '#000',
                      fontWeight: selectedSize === size ? 'bold' : 'normal',
                      transition: '0.3s ease',
                     
                    }}
                    icon={<FitnessCenter />}
                  />
                ))}
              </Box>

              {/* Material Widget */}
              <Typography variant="h6" gutterBottom color="primary">Material</Typography>
              <Box display="flex" gap={1} mb={2}>
                {productClothes.material.map((material) => (
                  <Chip
                    key={material}
                    label={material}
                    clickable
                    color={selectedMaterial === material ? 'primary' : 'default'}
                    onClick={() => handleMaterialClick(material)}
                    style={{
                      backgroundColor: selectedMaterial === material ? '#388e3c' : '#e0e0e0',
                      color: selectedMaterial === material ? '#fff' : '#000',
                      fontWeight: selectedMaterial === material ? 'bold' : 'normal',
                      transition: '0.3s ease',
                      
                    }}
                    icon={<LocalOffer />}
                  />
                ))}
              </Box>

              {/* Color Widget */}
              <Typography variant="h6" gutterBottom color="primary">Color</Typography>
              <Box display="flex" gap={1} mb={2}>
                {productClothes.color.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    clickable
                    color={selectedColor === color ? 'primary' : 'default'}
                    onClick={() => handleColorClick(color)}
                    icon={<ColorLens />}
                    style={{
                      backgroundColor: color,
                      color: selectedColor === color ? '#fff' : '#000',
                      fontWeight: selectedColor === color ? 'bold' : 'normal',
                      transition: '0.3s ease',
                      
                    }}
                  />
                ))}
              </Box>

              {/* Brand */}
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6" gutterBottom>
                Brand
              </Typography>
              <Box display="flex" alignItems="center">
                <Avatar src={productClothes.brand.logoUrl} alt={productClothes.brand.name} sx={{ marginRight: 2 }} />
                <Typography variant="body1">{productClothes.brand.name}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {productClothes.brand.description}
              </Typography>

              {/* Vendor */}
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6" gutterBottom>
                Vendor
              </Typography>
              <Typography variant="body1">{productClothes.vendor.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {productClothes.vendor.contactInfo}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {productClothes.vendor.address}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {productClothes.vendor.email} | {productClothes.vendor.phone}
              </Typography>

              {/* Add to Wishlist / Cart Button */}
              <Box mt={2}>
                <Tooltip title="Add to Wishlist">
                  <IconButton color="error">
                    <Favorite />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add to Cart">
                  <IconButton color="primary">
                    <ShoppingCart />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductClothesType;
