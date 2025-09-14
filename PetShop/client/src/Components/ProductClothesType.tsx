import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
// import axios from 'axios';
import Product, { ProductClothes } from '../Interface/Product';
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
  Tooltip,
  Snackbar
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Favorite, ShoppingCart, ColorLens, FitnessCenter, LocalOffer, ArrowBack, Inventory } from '@mui/icons-material';

import NumberInput from './Customs/NumberInput';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import UserComment from './UserComment';
import CommentsByProduct from './CommentsByProduct';
import { useCart } from '../Context/Cart';
import { useTranslation } from 'react-i18next';

const ProductClothesType = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { addToCart } = useCart()
  const { product_id } = useParams();
  const location = useLocation();
  const type = "clothes";
  const [loading, setLoading] = useState<boolean>(false);
  const [productClothes, setProductClothes] = useState<ProductClothes>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const [checkFavorite, setCheckFavorite] = useState<Boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate()
  const {t} = useTranslation()

  const loadInfoDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const response = await APIs.get(endpoints.getProductById(type, product_id));
      setProductClothes(response.data.product);
      // console.log('Product Clothes: ', response.data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`${location.pathname + location.search}`);
  };

  useEffect(() => {
    loadInfoDetailsOfProduct();
    if (user) handleCheckFavorite();
  }, [product_id]);

  const handleSizeClick = (size: string) => setSelectedSize(size);
  const handleMaterialClick = (material: string) => setSelectedMaterial(material);
  const handleColorClick = (color: string) => setSelectedColor(color);

  const handleaddToCart = (ProductClothes: Product, quantity: number) => {
    ProductClothes.note = 
    `${t("Size")}: ${selectedSize} - ${t("Material")}: ${selectedMaterial} - ${t("Color")}: ${selectedColor}`;
  
    addToCart(ProductClothes, quantity);
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

   const handleCheckFavorite = async () => {
      try {
        setLoading(true)
        const res = await authApi.get(endpoints.getFavoriteProductOfUser(product_id, user?._id))
        setCheckFavorite(res.data.isFavorite)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    }
  
    const handleAddToFavoriteList = async (userId: string, productId: string) => {
      try {
        setLoading(true)
        if(checkFavorite){
          if (!window.confirm('Are you sure you want to remove this item from favorites?')) return;
        }
        const res = await authApi.post(endpoints.createOrUpdateFavorite, {
          userId: userId,
          productId: productId
        });
        setCheckFavorite(res.data.isFavorite)
        if (res.data.isFavorite === true) {
          setSnackbarMessage("Add Product To FavoriteList Success")
        }
        else {
          setSnackbarMessage("Remove Product To FavoriteList Success")
        }
        setSnackbarOpen(true)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    };

  if (!productClothes) {
    return <Typography variant="h6" align="center">No product details available</Typography>;
  }

  return (
  <Container>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      message={snackbarMessage}
    />

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
              {productClothes.price.toLocaleString()} VND
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Inventory sx={{ mr: 1 }} /> {t("Inventory")}: {productClothes.stock} {t("items")}
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              <AddShoppingCartIcon fontSize="small" /> {productClothes.totalOrder} {t("Orders")}
            </Typography>

            {/* Size Widget */}
            <Typography variant="h6" gutterBottom color="primary">{t("Size")}</Typography>
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
            <Typography variant="h6" gutterBottom color="primary">{t("Material")}</Typography>
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
            <Typography variant="h6" gutterBottom color="primary">{t("Color")}</Typography>
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
            <Typography variant="h6" gutterBottom>{t("Brand")}</Typography>
            <Box display="flex" alignItems="center">
              <Avatar src={productClothes.brand.logoUrl} alt={productClothes.brand.name} sx={{ marginRight: 2 }} />
              <Typography variant="body1">{productClothes.brand.name}</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              {productClothes.brand.description}
            </Typography>

            {/* Vendor */}
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h6" gutterBottom>{t("Vendor")}</Typography>
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
            <Box display="flex" alignItems="center" mt={2} mb={2}>
              {user && (
                <Tooltip title={checkFavorite ? t("Remove Product To FavoriteList") : t("Add Product To FavoriteList")}>
                  <IconButton
                    color={checkFavorite ? 'error' : 'default'}
                    onClick={() => handleAddToFavoriteList(user._id, productClothes._id)}
                  >
                    <Favorite />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={t("Add to Cart")}>
                <IconButton color="primary" onClick={() => handleaddToCart(productClothes, selectedQuantity)}>
                  <ShoppingCart/>
                </IconButton>
              </Tooltip>
              <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {user ? (
      <UserComment userId={user._id} productId={productClothes._id} loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}/>
    ) : (
      <Box
        sx={{
          maxWidth: '100%',
          margin: '5% 1%',
          padding: 4,
          border: '1px solid #ddd',
          borderRadius: 3,
          backgroundColor: '#f9f9f9',
          boxShadow: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary" align="center" mt={4}>
          {t("Please log in to leave a comment.")}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/login', { state: { from: location.pathname, type: type }})}
        >
          {t("Go To Login")}
        </Button>
      </Box>
    )}

    <Box
      sx={{
        maxWidth: '100%',
        margin: '5% 1%',
        padding: 4,
        border: '1px solid #ddd',
        borderRadius: 3,
        backgroundColor: '#f9f9f9',
        boxShadow: 2,
      }}
    >
      <CommentsByProduct
        productId={productClothes._id} 
        totalRating={productClothes.totalRating ?? 0}
        beforeTotalRatingRounded={productClothes.beforeTotalRatingRounded ?? 0} 
        loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}
      />
    </Box>
  </Container>
);

};

export default ProductClothesType;
