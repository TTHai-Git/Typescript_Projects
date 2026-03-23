import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
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
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Favorite, ShoppingCart, ColorLens, FitnessCenter, LocalOffer, ArrowBack, Inventory, Category } from '@mui/icons-material';

import NumberInput from './Customs/NumberInput';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import UserComment from './UserComment';
import CommentsByProduct from './CommentsByProduct';
import { useCart } from '../Context/Cart';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../Context/Notification';

const ProductClothesType = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { addToCart } = useCart()
  const { product_id } = useParams();
  const type ="clothes";
  const [loading, setLoading] = useState<boolean>(false);
  const [productClothes, setProductClothes] = useState<ProductClothes>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const [checkFavorite, setCheckFavorite] = useState<Boolean>(false)
  const navigate = useNavigate()
  const {t} = useTranslation()
  const { showNotification } = useNotification()

  const loadInfoDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const response = await APIs.get(endpoints.getProductById(product_id));
      setProductClothes(response.data.product);
      // console.log('Product Clothes: ', response.data.product);
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

  if (!productClothes) {
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
      {/* Product Image */}
      <Grid item xs={12} sm={6}>
        <Card elevation={0} sx={{ borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', overflow: 'hidden', bgcolor: '#fff', p: 2 }}>
          <CardMedia
            component="img"
            image={productClothes.imageUrl}
            alt={productClothes.name}
            height="auto"
            style={{ borderRadius: '24px', objectFit: 'cover' }}
          />
        </Card>
      </Grid>

      {/* Product Info */}
      <Grid item xs={12} sm={6}>
        <Card elevation={0} sx={{ p: { xs: 1, md: 3 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff', border: '1px solid #f0f0f0' }}>
          <CardContent>
            <Typography variant="h3" fontWeight="900" sx={{ color: '#3e2723', mb: 2 }}>
              {productClothes.name}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontWeight: '700' }}>
              <Category sx={{ mr: 1, verticalAlign: 'middle', color: '#ffbd59' }} /> {productClothes.category.name}
            </Typography>

            <Box sx={{ bgcolor: '#fffbf7', p: 3, borderRadius: '24px', border: '1px solid #ffe8cc', mb: 3, mt: 3 }}>
              <Typography variant="h4" fontWeight="900" sx={{ color: '#ff9800', display: 'flex', alignItems: 'center', mb: 1 }}>
                {productClothes.price.toLocaleString()} VND
              </Typography>
              <Box display="flex" gap={3} flexWrap="wrap" sx={{ color: '#555' }}>
                <Typography variant="body1" fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Inventory sx={{ mr: 1, color: '#8d6e63' }} fontSize="small" /> {t("Inventory")}: <Box component="span" sx={{ color: '#3e2723', ml: 0.5 }}>{productClothes.stock}</Box>
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AddShoppingCartIcon sx={{ mr: 1, color: '#8d6e63' }} fontSize="small" /> {t("Orders")}: <Box component="span" sx={{ color: '#3e2723', ml: 0.5 }}>{productClothes.totalOrder}</Box>
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, mb: 4, fontSize: '1.1rem' }}>
              {productClothes.description}
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
            <Box display="flex" alignItems="center" mt={2} mb={2} gap={2}>
              <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={() => handleaddToCart(productClothes, selectedQuantity)}
                sx={{ py: 1.5, px: 4, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
              >
                {t("Add to Cart")}
              </Button>
              {user && (
                <Tooltip title={checkFavorite ? t("Remove Product To FavoriteList") : t("Add Product To FavoriteList")}>
                  <IconButton
                    color={checkFavorite ? 'error' : 'default'}
                    onClick={() => handleAddToFavoriteList(user._id, productClothes._id)}
                  >
                  <Favorite />
                  <Typography>{productClothes.countFavorite}</Typography>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {user ? (
      <UserComment userId={user._id} productId={productClothes._id} loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}/>
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
        productId={productClothes._id} 
        totalRating={productClothes.totalRating ?? 0}
        beforeTotalRatingRounded={productClothes.beforeTotalRatingRounded ?? 0} 
        loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}
      />
    </Box>
  </Box>
);

};

export default ProductClothesType;
