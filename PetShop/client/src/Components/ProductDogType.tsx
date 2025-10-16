import * as React from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
import PetsIcon from '@mui/icons-material/Pets';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import HeightIcon from '@mui/icons-material/Height';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CakeIcon from '@mui/icons-material/Cake';

import NumberInput from './Customs/NumberInput';
import { ProductDog } from '../Interface/Product';
import { ArrowBack, ColorLens, Favorite, FitnessCenter, Inventory } from '@mui/icons-material';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import UserComment from './UserComment';
import CommentsByProduct from './CommentsByProduct';
import { useCart } from '../Context/Cart';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';

const ProductDogType: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { addToCart } = useCart();
  const { product_id } = useParams();
  const type ="dog";
  const [dog, setDog] = React.useState<ProductDog | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedQuantity, setSelectedQuantity] = React.useState<number>(1)
  const [selectedSize, setSelectedSize] = React.useState<string>("")
  const [selectedColor] = React.useState<string>("")
  const [checkFavorite, setCheckFavorite] = React.useState<Boolean>(false)
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const {t} = useTranslation()

  const handleAddToCart = (dog: ProductDog, quantity: number) => {
    if (!selectedSize) {
    showNotification(t("Please choose size for your dog!!"), "warning");
    return;
    }

    let note = `${t("Size")}: ${selectedSize} - ${t("Age")}: ${new Date().getFullYear() - dog.age} ${t("years")} - ${t("Weight")}: ${dog.weight} Kg - ${t("Height")}: ${dog.height} cm - ${t("Breed")}: ${dog.breed.name} - ${t("Color")}: `;
    note += dog.color.join(", ");
    
    dog.note = note;
    addToCart(dog, quantity);
   
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

    const loadInfoDetailsOfProduct = async () => {
      
      try {
        setLoading(true)
        const response = await APIs.get(endpoints.getProductById(type, product_id));
        setDog(response.data.product);
      } catch (error) {
        console.error('Error fetching dog:', error);
      } finally {
        setLoading(false);
      }
    }
  React.useEffect(() => {
    loadInfoDetailsOfProduct()
    if (user) handleCheckFavorite()
  }, [product_id]);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size)
  }

  const handleNavigateToLogin = () => {
    const href = window.location.pathname + window.location.search
    navigate(`/login?ref=${href}`)

  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }


  if (!dog) {
    return (
      <Typography variant="h6" textAlign="center">
        Dog not found.
      </Typography>
    );
  }

  return (
  <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, backgroundColor: '#f9f9f9' }}>
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
      {/* Dog Image */}
      <Grid item xs={12} md={5}>
        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
          <CardMedia
            component="img"
            image={dog.imageUrl}
            alt={dog.name}
            sx={{ height: "auto", objectFit: 'cover', borderRadius: 2 }}
          />
        </Card>
      </Grid>

      {/* Dog Info */}
      <Grid item xs={12} md={7}>
        <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {dog.name}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip icon={<PetsIcon />} label={`${t("Breed")}: ${dog.breed.name}`} color="primary" />
              <Chip icon={<CakeIcon />} label={`${t("Age")}: ${new Date().getFullYear() - dog.age} ${t("years")}`} color="secondary" />
              <Chip icon={<HeightIcon />} label={`${t("Height")}: ${dog.height} cm`} />
              <Chip icon={<FitnessCenterIcon />} label={`${t("Weight")}: ${dog.weight} kg`} />
            </Stack>

            {/* Size */}
            <Typography variant="h6" gutterBottom color="primary">{t("Size")}</Typography>
            <Box display="flex" gap={1} mb={2}>
              {dog.size.map((size) => (
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

            {/* Color */}
            <Typography variant="h6" gutterBottom color="primary">{t("Color")}</Typography>
            <Box display="flex" gap={1} mb={2}>
              {dog.color.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  clickable
                  color={selectedColor === color ? 'primary' : 'default'}
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

            <Divider sx={{ my: 2 }} />

            {/* Price & Inventory */}
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoneyIcon sx={{ mr: 1 }} />
              {t("Price")}: {dog.price.toLocaleString()} VND
            </Typography>
            <Typography variant="h6" gutterBottom>
              <Inventory sx={{ mr: 1 }} /> {t("Inventory")}: {dog.stock} {t("items")}
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              <AddShoppingCartIcon fontSize="small" /> {dog.totalOrder} {t("Orders")}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {dog.description}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 0.5 }} /> {t("Born")}: {new Date(dog.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 0.5 }} /> {t("Listed")}: {new Date(dog.updatedAt).toLocaleDateString()}
              </Typography>
            </Stack>

            {/* Actions */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => handleAddToCart(dog, selectedQuantity)}
                sx={{ borderRadius: 3, px: 4, textTransform: 'none', fontWeight: 'bold', boxShadow: 2 }}
              >
                {t("Add to Cart")}
              </Button>
              {user && (
                <Tooltip title={checkFavorite ? t("Remove To FavoriteList") : t("Add To FavoriteList")}>
                  <IconButton
                    color={checkFavorite ? 'error' : 'default'}
                    onClick={() => handleAddToFavoriteList(user._id, dog._id)}
                  >
                    
                  <Favorite />
                  <Typography>
                    {dog.countFavorite}
                  </Typography>
                  </IconButton>
                  
                </Tooltip>
                
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* Comments Section */}
    {user ? (
      <UserComment userId={user._id} productId={dog._id} loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}/>
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
          onClick={() =>handleNavigateToLogin() }
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
        productId={dog._id}
        totalRating={dog.totalRating ?? 0}
        beforeTotalRatingRounded={dog.beforeTotalRatingRounded ?? 0}
        loadInfoDetailsOfProduct={loadInfoDetailsOfProduct}
      />
    </Box>
  </Box>
);

};

export default ProductDogType;
