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
  <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, backgroundColor: 'var(--pet-bg)', minHeight: '100vh' }}>
    <Button
      variant="contained"
      startIcon={<ArrowBack />}
      onClick={() => navigate(-1)}
      sx={{
        borderRadius: "30px",
        bgcolor: '#fff',
        color: '#ff9800',
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
        textTransform: "none",
        fontWeight: "bold",
        mb: 4,
        px: 4,
        '&:hover': { bgcolor: '#fff3e0' }
      }}
    >
      {t("Go Back")}
    </Button>

    <Grid container spacing={4}>
      {/* Image */}
      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', overflow: 'hidden', bgcolor: '#fff', p: 2 }}>
          <CardMedia
            component="img"
            height="auto"
            image={productAccessory.imageUrl}
            alt={productAccessory.name}
            style={{ borderRadius: '24px', objectFit: 'cover' }}
          />
        </Card>
      </Grid>

      {/* Info */}
      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ p: { xs: 1, md: 3 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff', border: '1px solid #f0f0f0' }}>
          <CardContent>
            <Typography variant="h3" fontWeight="900" sx={{ color: '#3e2723', mb: 2 }}>
              {productAccessory.name}
            </Typography>
            <Box sx={{ bgcolor: '#fffbf7', p: 3, borderRadius: '24px', border: '1px solid #ffe8cc', mb: 3 }}>
              <Typography variant="h4" fontWeight="900" sx={{ color: '#ff9800', display: 'flex', alignItems: 'center', mb: 1 }}>
                {productAccessory.price.toLocaleString()} VND
              </Typography>
              <Box display="flex" gap={3} sx={{ color: '#555' }}>
                <Typography variant="body1" fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Inventory sx={{ mr: 1, color: '#8d6e63' }} fontSize="small" /> {t("Inventory")}: <Box component="span" sx={{ color: '#3e2723', ml: 0.5 }}>{productAccessory.stock}</Box>
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AddShoppingCartIcon sx={{ mr: 1, color: '#8d6e63' }} fontSize="small" /> {t("Orders")}: <Box component="span" sx={{ color: '#3e2723', ml: 0.5 }}>{productAccessory.totalOrder}</Box>
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, mb: 4, fontSize: '1.1rem' }}>
              {productAccessory.description}
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
              <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={() => handleAddToCart(productAccessory, selectedQuantity)}
                sx={{ py: 1.5, px: 4, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
              >
                {t("Add to Cart")}
              </Button>
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
      <UserComment userId={user._id} productId={productAccessory._id} loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}/>
    ) : (
      <Box sx={{
        maxWidth: '100%',
        margin: { xs: '2rem 0', md: '3rem 0' },
        padding: 6,
        border: '1px dashed #ccc',
        borderRadius: '32px',
        backgroundColor: '#fff',
        textAlign: 'center',
      }}>
        <Typography variant="h5" fontWeight="800" sx={{ color: '#3e2723', mb: 3 }}>
          {t("Join the Conversation")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t("Please log in to leave a comment.")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleNavigateToLogin()}
          sx={{ borderRadius: '30px', fontWeight: 'bold', px: 4, py: 1.5, bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}
        >
          {t("Go To Login")}
        </Button>
      </Box>
    )}

    <Box>
      <CommentsByProduct
        productId={productAccessory._id}
        totalRating={productAccessory.totalRating ?? 0}
        beforeTotalRatingRounded={productAccessory.beforeTotalRatingRounded ?? 0}
        loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}
      />
    </Box>
  </Box>
);

};

export default ProductAccessoryType;
