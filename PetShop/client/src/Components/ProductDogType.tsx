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

    const loadInfoDetailsOfProduct = async () => {
      
      try {
        setLoading(true)
        const response = await APIs.get(endpoints.getProductById(product_id));
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
      {/* Dog Image */}
      <Grid item xs={12} md={5}>
        <Card elevation={0} sx={{ borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', overflow: 'hidden', bgcolor: '#fff', p: 2 }}>
          <CardMedia
            component="img"
            image={dog.imageUrl}
            alt={dog.name}
            sx={{ height: "auto", objectFit: 'cover', borderRadius: '24px' }}
          />
        </Card>
      </Grid>

      {/* Dog Info */}
      <Grid item xs={12} md={7}>
        <Card elevation={0} sx={{ p: { xs: 1, md: 3 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', bgcolor: '#fff', border: '1px solid #f0f0f0' }}>
          <CardContent>
            <Typography variant="h3" fontWeight="900" sx={{ color: '#3e2723', mb: 2 }}>
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
            <Box sx={{ bgcolor: '#fffbf7', p: 3, borderRadius: '24px', border: '1px solid #ffe8cc', mb: 3 }}>
              <Typography variant="h4" fontWeight="900" sx={{ color: '#ff9800', display: 'flex', alignItems: 'center', mb: 1 }}>
                {dog.price.toLocaleString()} VND
              </Typography>
              <Stack direction="row" spacing={3} sx={{ color: '#555' }}>
                <Typography variant="body1" fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Inventory sx={{ mr: 1, color: '#8d6e63' }} fontSize="small" /> {t("Inventory")}: <Box component="span" sx={{ color: '#3e2723', ml: 0.5 }}>{dog.stock}</Box>
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AddShoppingCartIcon sx={{ mr: 1, color: '#8d6e63' }} fontSize="small" /> {t("Orders")}: <Box component="span" sx={{ color: '#3e2723', ml: 0.5 }}>{dog.totalOrder}</Box>
                </Typography>
              </Stack>
            </Box>

            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, mb: 4, fontSize: '1.1rem' }}>
              {dog.description}
            </Typography>

            <Stack direction="row" spacing={3} alignItems="center" mb={4}>
              <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 1, color: '#ffbd59' }} /> {t("Born")}: {new Date(dog.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 1, color: '#ffbd59' }} /> {t("Listed")}: {new Date(dog.updatedAt).toLocaleDateString()}
              </Typography>
            </Stack>

            {/* Actions */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => handleAddToCart(dog, selectedQuantity)}
                sx={{ py: 1.5, px: 4, fontSize: '1.1rem', fontWeight: 800, bgcolor: '#ff9800', color: '#fff', borderRadius: '30px', boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)', '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
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
