import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router';
// import axios from 'axios';
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
  ArrowBack,
  Inventory
} from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Product, { ProductAccessories } from '../Interface/Product';

import NumberInput from './Customs/NumberInput';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import UserComment from './UserComment';
import CommentsByProduct from './CommentsByProduct';
import { useCart } from '../Context/Cart';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../Context/Notification';

const ProductAccessoryType = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const {addToCart} = useCart();
  const { product_id } = useParams();
  const type = "accessory";
  const [loading, setLoading] = useState<boolean>(false);
  const [productAccessory, setProductAccessory] = useState<ProductAccessories>();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const [checkFavorite, setCheckFavorite] = useState<boolean>(false)
  const { showNotification } = useNotification()

  const navigate = useNavigate()
  const {t} = useTranslation()

  const loadInfoDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const response = await APIs.get(endpoints.getProductById(product_id));
      setProductAccessory(response.data.product);
      // console.log('Product Accessory: ', response.data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (ProductAccessory: Product, quantity: number) => {
    ProductAccessory.note =
    `${t("Dimensions")}: ${productAccessory?.dimensions} - ` +
    `${t("Material")}: ${productAccessory?.material} - ` +
    `${t("Usage")}: ${productAccessory?.usage}`;
    addToCart(ProductAccessory, quantity)
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
      loadInfoDetailsOfProduct()
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
      setCheckFavorite(res.data.doc)
      showNotification(`${res.data.message}`, "success")
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
      loadInfoDetailsOfProduct()
    }
  };

  const handleNavigateToLogin = () => {
    const href = window.location.pathname + window.location.search
    navigate(`/login?ref=${href}`)

  }

  useEffect(() => {
    loadInfoDetailsOfProduct();
    if (user) handleCheckFavorite();
  }, [product_id]);
  

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
    <Button
      variant="contained"
      color="inherit"
      size="large"
      startIcon={<ArrowBack />}
      onClick={() => navigate(-1)}
      sx={{ borderRadius: 3, px: 4, textTransform: 'none', fontWeight: 'bold', boxShadow: 2 }}
    >
      {t("Go Back")}
    </Button>
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
              {productAccessory.price.toLocaleString()} VND
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Inventory sx={{ mr: 1 }} /> {t("Inventory")}: {productAccessory.stock} {t("items")}
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              <AddShoppingCartIcon fontSize="small" /> {productAccessory.totalOrder} {t("Orders")}
            </Typography>

            {/* Extra Fields */}
            <Box mt={2}>
              <Typography variant="h6" gutterBottom color="primary">{t("Details")}</Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip icon={<Straighten />} label={`${t("Dimensions")}: ${productAccessory.dimensions}`} color="info" />
                <Chip icon={<Construction />} label={`${t("Material")}: ${productAccessory.material.join(', ')}`} color="success" />
                <Chip icon={<SportsEsports />} label={`${t("Usage")}: ${productAccessory.usage}`} color="warning" />
              </Box>
            </Box>

            {/* Category */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" color="primary">{t("Category")}</Typography>
            <Chip icon={<Category />} label={productAccessory.category.name} color="secondary" sx={{ mb: 1 }} />

            {/* Brand */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" color="primary">{t("Brand")}</Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={productAccessory.brand.logoUrl} alt={productAccessory.brand.name} />
              <Typography variant="body1">{productAccessory.brand.name}</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              {productAccessory.brand.description}
            </Typography>

            {/* Vendor */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" color="primary">{t("Vendor")}</Typography>
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
              
              <Tooltip title={t("Add to Cart")}>
                <IconButton color="primary" onClick={() => handleAddToCart(productAccessory, selectedQuantity)}>
                  <ShoppingCart />
                </IconButton>
              </Tooltip>
              <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
              {user && (
              <Tooltip title={checkFavorite ? t("Remove Product To FavoriteList") : t("Add Product To FavoriteList")}>
                <IconButton
                  color={checkFavorite ? 'error' : 'default'}
                  onClick={() => handleAddToFavoriteList(user._id, productAccessory._id)}
                >
                <Favorite />
                <Typography>
                  {productAccessory.countFavorite}
                </Typography>
                </IconButton>
              </Tooltip>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {user ? (
      <UserComment userId={user._id} productId={productAccessory._id} loadInfoDetailsOfProduct={loadInfoDetailsOfProduct} />
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
          onClick={() =>
            handleNavigateToLogin()
          }
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
        productId={productAccessory._id}
        totalRating={productAccessory.totalRating ?? 0}
        beforeTotalRatingRounded={productAccessory.beforeTotalRatingRounded ?? 0}
        loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}
      />
    </Box>
  </Container>
);

};

export default ProductAccessoryType;
