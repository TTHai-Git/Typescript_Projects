import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
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
  Stack,
} from '@mui/material';
import {
  LocalOffer,
  Category,
  Store,
  Factory,
  CalendarMonth,
  Pets,
  Favorite,
  ArrowBack,
  ShoppingCart,
  Inventory,
} from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import{ ProductFood } from '../Interface/Product';

import formatDate from '../Convert/formatDate';
import NumberInput from './Customs/NumberInput';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import UserComment from './UserComment';
import CommentsByProduct from './CommentsByProduct';
import { useCart } from '../Context/Cart';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../Context/Notification';


const ProductFoodType = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const {addToCart} = useCart()
  const {product_id } = useParams();

  const type = "food";
  const navigate = useNavigate();
  const [productFoods, setProductFoods] = useState<ProductFood>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const [checkFavorite, setCheckFavorite] = useState<Boolean>(false)
  const {t} = useTranslation()
  const { showNotification } = useNotification()
  

  const loadInfoDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const response = await APIs.get(endpoints.getProductById(product_id));
      setProductFoods(response.data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const handleAddToCart = (ProductFood: ProductFood, quantity: number) => {
    let note = `${t("Ingredients")}: `;

    if (ProductFood.ingredients?.length) {
      note += ProductFood.ingredients.join(", ");
    }

    note += ` - ${t("RecommendedFor")}: `;
    if (ProductFood.recommendedFor?.length) {
      note += ProductFood.recommendedFor.join(", ");
    }

    const formatted = formatDate(`${ProductFood.expirationDate}`);
    note += ` - ${t("ExpirationDate")}: ${formatted}`;

    ProductFood.note = note;
    addToCart(ProductFood, quantity);
  };

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

    <Card elevation={0} sx={{ maxWidth: 1100, margin: '0 auto', p: { xs: 2, md: 4 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff', border: '1px solid #f0f0f0' }}>
      <CardMedia
        component="img"
        height="350"
        image={productFoods.imageUrl}
        alt={productFoods.name}
        sx={{ objectFit: 'contain', background: '#fff', borderRadius: '24px', mb: 3 }}
      />

      <CardContent sx={{ p: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2} flexWrap="wrap">
          <Typography variant="h3" fontWeight="900" sx={{ color: '#3e2723' }}>
            {productFoods.name}
          </Typography>
          
          <Box display="flex" gap={2} alignItems="center">
            <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
            <Button
              startIcon={<ShoppingCart />}
              variant="contained"
              onClick={() => handleAddToCart(productFoods, selectedQuantity)}
              sx={{ py: 1.5, px: 4, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
            >
              {t("Add to Cart")}
            </Button>
            {user && (
              <Tooltip title={checkFavorite ? t("Remove Product To FavoriteList") : t("Add Product To FavoriteList")}>
                <IconButton
                  color={checkFavorite ? 'error' : 'default'}
                  onClick={() => handleAddToFavoriteList(user._id, productFoods._id)}
                >
                <Favorite />
                <Typography>{productFoods.countFavorite}</Typography>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, mb: 4, fontSize: '1.1rem' }}>
          {productFoods.description}
        </Typography>

        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ bgcolor: '#fffbf7', p: 3, borderRadius: '24px', border: '1px solid #ffe8cc', mb: 3 }}>
              <Typography variant="h4" fontWeight="900" sx={{ color: '#ff9800', display: 'flex', alignItems: 'center', mb: 1 }}>
                 {productFoods.price.toLocaleString()} VND
              </Typography>
              <Stack direction="row" spacing={3} sx={{ color: '#555' }}>
                <Typography variant="body1" fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Inventory sx={{ mr: 1, color: '#8d6e63' }} fontSize="small" /> {t("Inventory")}: <Box component="span" sx={{ color: '#3e2723', ml: 0.5 }}>{productFoods.stock}</Box>
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AddShoppingCartIcon sx={{ mr: 1, color: '#8d6e63' }} fontSize="small" /> {t("Orders")}: <Box component="span" sx={{ color: '#3e2723', ml: 0.5 }}>{productFoods.totalOrder}</Box>
                </Typography>
              </Stack>
            </Box>
            
            <Typography variant="h6" gutterBottom fontWeight="700" color="text.secondary">
              <Category sx={{ mr: 1, color: '#ff9800' }} /> {t("Category")}: <Box component="span" color="#3e2723">{productFoods.category.name}</Box>
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight="700" color="text.secondary">
              <Factory sx={{ mr: 1, color: '#ff9800' }} /> {t("Brand")}: <Box component="span" color="#3e2723">{productFoods.brand.name}</Box>
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight="700" color="text.secondary">
              <Store sx={{ mr: 1, color: '#ff9800' }} /> {t("Vendor")}: <Box component="span" color="#3e2723">{productFoods.vendor.name}</Box>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              <CalendarMonth sx={{ mr: 1 }} /> {t("Expiration Date")}: {formatDate(productFoods.expirationDate.toString())}
            </Typography>

            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("Ingredients")}:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                {productFoods.ingredients.map((ing, index) => (
                  <Chip key={index} label={ing} color="success" />
                ))}
              </Box>
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("Recommended For")}:
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
                  {t("Brand Info")}: {productFoods.brand.name}
                </Typography>
                <Typography variant="body2">{productFoods.brand.description}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {t("Vendor Contact")}: {productFoods.vendor.name}
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

    {user ? (
      <UserComment userId={user._id} productId={productFoods._id} loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}/>
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
        productId={productFoods._id}
        totalRating={productFoods.totalRating ?? 0}
        beforeTotalRatingRounded={productFoods.beforeTotalRatingRounded ?? 0}
        loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}
      />
    </Box>
  </Box>
);

};

export default ProductFoodType;
