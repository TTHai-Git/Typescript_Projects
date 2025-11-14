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
  <Box sx={{ p: 4 }}>

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

    <Card sx={{ maxWidth: 1000, margin: '0 auto', boxShadow: 6, borderRadius: 4 }}>
      <CardMedia
        component="img"
        height="300"
        image={productFoods.imageUrl}
        alt={productFoods.name}
        sx={{ objectFit: 'contain', background: '#f9f9f9' }}
      />

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {productFoods.name}
          </Typography>
          <Button
            startIcon={<ShoppingCart />}
            variant="contained"
            color="success"
            onClick={() => handleAddToCart(productFoods, selectedQuantity)}
          >
            {t("Add to Cart")}
          </Button>

          <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
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

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {productFoods.description}
        </Typography>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              <LocalOffer sx={{ mr: 1 }} /> {t("Price")}: {productFoods.price.toLocaleString()} VND
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Inventory sx={{ mr: 1 }} /> {t("Inventory")}: {productFoods.stock} {t("items")}
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              <AddShoppingCartIcon fontSize="small" /> {productFoods.totalOrder} {t("Orders")}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Category sx={{ mr: 1 }} /> {t("Category")}: {productFoods.category.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Factory sx={{ mr: 1 }} /> {t("Brand")}: {productFoods.brand.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Store sx={{ mr: 1 }} /> {t("Vendor")}: {productFoods.vendor.name}
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
        margin: '5% 1%',
        padding: 4,
        border: '1px solid #ddd',
        borderRadius: 3,
        backgroundColor: '#f9f9f9',
        boxShadow: 2,
        textAlign: 'center',
      }}>
        <Typography variant="h6" color="text.secondary" align="center" mt={4}>
          {t("Please log in to leave a comment.")}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => handleNavigateToLogin()}
        >
          {t("Go To Login")}
        </Button>
      </Box>
    )}

    <Box sx={{
      maxWidth: '100%',
      margin: '5% 1%',
      padding: 4,
      border: '1px solid #ddd',
      borderRadius: 3,
      backgroundColor: '#f9f9f9',
      boxShadow: 2,
    }}>
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
