import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Snackbar,
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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import{ ProductFood } from '../Interface/Product';
import { useCart } from '../Context/Cart';
import formatDate from '../Convert/formatDate ';
import NumberInput from './Customs/NumberInput';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import UserComment from './UserComment';
import CommentsByProduct from './CommentsByProduct';

const ProductFoodType = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const {addToCart} = useCart()
  const {product_id } = useParams();
  const location = useLocation();
  const type = location.state || "food";
  const navigate = useNavigate();
  const [productFoods, setProductFoods] = useState<ProductFood>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const [checkFavorite, setCheckFavorite] = useState<Boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  

  const loadInfoDetailsOfProduct = async () => {
    try {
      setLoading(true);
      // const response = await axios.get(`/v1/products/${type}/${product_id}`);
      const response = await APIs.get(`${endpoints['getProductById'](type, product_id)}`);
      setProductFoods(response.data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
      loadInfoDetailsOfProduct();
      if (user) handleCheckFavorite();
    }, []);

  const handleAddToCart = (ProductFood: ProductFood, quantity: number) => {
    let note = "Ingredients: ";
  
    if (ProductFood.ingredients && ProductFood.ingredients.length > 0) {
      note += ProductFood.ingredients.join(", ");
    }
  
    note += " - RecommendedFor: ";
  
    if (ProductFood.recommendedFor && ProductFood.recommendedFor.length > 0) {
      note += ProductFood.recommendedFor.join(", ");
    }
  
    const formatted = formatDate(`${ProductFood.expirationDate}`)
    
    note += ` - ExpirationDate: ${formatted}`;
  
    ProductFood.note = note;
  
    addToCart(ProductFood, quantity);
  };

  const handleCheckFavorite = async () => {
      try {
        setLoading(true)
        const res = await authApi(user?.tokenInfo.accessToken).get(endpoints['getFavoriteProductOfUser'](product_id, user?._id))
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
        const res = await authApi(user?.tokenInfo.accessToken).post(endpoints['createOrUpdateFavorite'], {
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} variant="outlined" color="primary">
          Back to Products
        </Button>
        
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
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {productFoods.name}
            </Typography>
            {user?<Tooltip title={checkFavorite ? 'Remove Product To FavoriteList' : 'Add Product To FavoriteList'}>
                <IconButton
                  color={checkFavorite ? 'error' : 'default'}
                  onClick={() => handleAddToFavoriteList(user._id, productFoods._id)}
                >
                  <Favorite />
                </IconButton>
              </Tooltip>
              : <></> }
            <Button
              startIcon={<ShoppingCart />}
              variant="contained"
              color="success"
              onClick={() => handleAddToCart(productFoods, selectedQuantity)}
            >
              Add to Cart
            </Button>
            <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
          </Box>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {productFoods.description}
          </Typography>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                <LocalOffer sx={{ mr: 1 }} /> Price: ${productFoods.price.toFixed(2)}
              </Typography>
               <Typography variant="subtitle2" fontWeight="bold" color="primary">
                <AddShoppingCartIcon fontSize="small" /> {productFoods.totalOrder} Orders
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
                {formatDate(productFoods.expirationDate.toString())}
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
      {user?<>
        <UserComment userId={user?._id || ""} productId={productFoods._id} loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}/>
      </> : <>
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
      <Typography variant="h6" color="text.secondary" align="center" mt={4}>Please log in to leave a comment.</Typography>
        <Button
         
          variant="outlined"
          onClick={() => navigate('/login', { state: location.pathname })}
        >
          Go To Login
        </Button>
      </Box>
      </>}
      <Box sx={{
        maxWidth: '100%',
        margin: '5% 1%',
        padding: 4,
        border: '1px solid #ddd',
        borderRadius: 3,
        backgroundColor: '#f9f9f9',
        boxShadow: 2,
       
      }}>
        <CommentsByProduct productId= {productFoods._id} 
        totalRating = {productFoods.totalRating??0} 
        beforeTotalRatingRounded={productFoods.beforeTotalRatingRounded??0} loadInfoDetailsOfProduct={loadInfoDetailsOfProduct} />
      </Box>
      
    </Box>
    
    
    
  );
};

export default ProductFoodType;
