import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import {
  Straighten,
  Construction,
  SportsEsports,
  Favorite,
  ShoppingCart,
  Category,
  LocalShipping,
  ArrowBack
} from '@mui/icons-material';
import Product, { ProductAccessories } from '../Interface/Product';
import { useCart } from '../Context/Cart';
import NumberInput from './Customs/NumberInput';

const ProductAccessoryType = () => {
  const {addToCart} = useCart();
  const { product_id } = useParams();
  const location = useLocation();
  const type = location.state;
  const [loading, setLoading] = useState<boolean>(false);
  const [productAccessory, setProductAccessory] = useState<ProductAccessories>();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const navigate = useNavigate()

  const loadInfoDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/v1/products/${type}/${product_id}`);
      setProductAccessory(response.data.product);
      console.log('Product Accessory: ', response.data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (ProductAccessory: Product, quantity: number) => {
    ProductAccessory.note = 
    `Dimensions: ${productAccessory?.dimensions} - Material: ${productAccessory?.material} - Usage: ${productAccessory?.usage}`
    addToCart(ProductAccessory, quantity)
  }

  const handleBack = () => {
    navigate('/products');
  };


  useEffect(() => {
    loadInfoDetailsOfProduct();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!productAccessory) {
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
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Card elevation={10}>
            <CardMedia
              component="img"
              height="auto"
              image={productAccessory.imageUrl}
              alt={productAccessory.name}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={12} sx={{ backgroundColor: '#f0f4ff' }}>
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                {productAccessory.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {productAccessory.description}
              </Typography>
              <Typography variant="h5" color="secondary" gutterBottom>
                ${productAccessory.price.toFixed(2)}
              </Typography>

              {/* Extra Fields */}
              <Box mt={2}>
                <Typography variant="h6" gutterBottom color="primary">Details</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip icon={<Straighten />} label={`Dimensions: ${productAccessory.dimensions}`} color="info" />
                  <Chip icon={<Construction />} label={`Material: ${productAccessory.material.join(', ')}`} color="success" />
                  <Chip icon={<SportsEsports />} label={`Usage: ${productAccessory.usage}`} color="warning" />
                </Box>
              </Box>

              {/* Category */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" color="primary">Category</Typography>
              <Chip icon={<Category />} label={productAccessory.category.name} color="secondary" sx={{ mb: 1 }} />

              {/* Brand */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" color="primary">Brand</Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={productAccessory.brand.logoUrl} alt={productAccessory.brand.name} />
                <Typography variant="body1">{productAccessory.brand.name}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {productAccessory.brand.description}
              </Typography>

              {/* Vendor */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" color="primary">Vendor</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShipping fontSize="small" />
                <Typography variant="body1">{productAccessory.vendor.name}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {productAccessory.vendor.contactInfo}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {productAccessory.vendor.email} | {productAccessory.vendor.phone}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {productAccessory.vendor.address}
              </Typography>

              {/* Actions */}
              <Box mt={2} display="flex" alignItems="center" gap={2} mb={2}>
                <Tooltip title="Add to Wishlist">
                  <IconButton color="error">
                    <Favorite />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Add to Cart">
                  <IconButton color="primary" onClick={() => handleAddToCart(productAccessory,selectedQuantity)}>
                    <ShoppingCart />
                  </IconButton>
                </Tooltip>
                <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductAccessoryType;
