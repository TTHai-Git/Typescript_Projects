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
  Snackbar,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
import PetsIcon from '@mui/icons-material/Pets';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import HeightIcon from '@mui/icons-material/Height';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CakeIcon from '@mui/icons-material/Cake';
import { useCart } from '../Context/Cart';
import NumberInput from './Customs/NumberInput';
import { ProductDog } from '../Interface/Product';
import { ArrowBack, ColorLens, Favorite, FitnessCenter } from '@mui/icons-material';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProductDogType: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { addToCart } = useCart();
  const { product_id } = useParams();
  const location = useLocation();
  const type = location.state;
  const [dog, setDog] = React.useState<ProductDog | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedQuantity, setSelectedQuantity] = React.useState<number>(1)
  const [selectedSize, setSelectedSize] = React.useState<string>("")
  const [selectedColor] = React.useState<string>("")
  const [checkFavorite, setCheckFavorite] = React.useState<Boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] =React.useState('');
  const navigate = useNavigate()
  const handleBack = () => {
    navigate('/products');
  };
 

  const handleAddToCart = (dog: ProductDog, quantity: number) => {
    if(!selectedSize){
      alert("Please choose size for your dog!!")
    }
    else {
      let note = `Size: ${selectedSize} - Age: ${new Date().getFullYear() - dog.age} years - Weight: ${dog.weight} Kg\n - Height: ${dog.height} cm - Breed: ${dog.breed.name} - Color: `
      note += dog.color.join(", ");
      dog.note = note
      addToCart(dog, quantity);
    }
   
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

    const loadDogs = async () => {
      try {
        // const response = await axios.get(`/v1/products/${type}/${product_id}`);
        const response = await APIs.get(`${endpoints['getProductById'](type, product_id)}`);
        setDog(response.data.product);
      } catch (error) {
        console.error('Error fetching dog:', error);
      } finally {
        setLoading(false);
      }
    }
  React.useEffect(() => {
    loadDogs()
    handleCheckFavorite()
  }, []);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size)
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
      <Grid container spacing={4}>
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

        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {dog.name}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip icon={<PetsIcon />} label={`Breed: ${dog.breed.name}`} color="primary" />
                <Chip icon={<CakeIcon />} label={`Age: ${new Date().getFullYear() - dog.age} years`} color="secondary" />
                <Chip icon={<HeightIcon />} label={`Height: ${dog.height} cm`} />
                <Chip icon={<FitnessCenterIcon />} label={`Weight: ${dog.weight} kg`} />
              </Stack>
              <Typography variant="h6" gutterBottom color="primary">Size</Typography>
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
              <Typography variant="h6" gutterBottom color="primary">Color</Typography>
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

              <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1 }} />
                Price: {dog.price.toFixed(2)} $
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {dog.description}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ mr: 0.5 }} /> Born: {new Date(dog.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ mr: 0.5 }} /> Listed: {new Date(dog.updatedAt).toLocaleDateString()}
                </Typography>
              </Stack>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <NumberInput min={1} defaultValue={1} onChange={(value) => setSelectedQuantity(value)} />
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => handleAddToCart(dog, selectedQuantity)}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: 2,
                  }}
                >
                  Add to Cart
                </Button>
                {user?<Tooltip title={checkFavorite ? 'Remove To FavoriteList' : 'Add To FavoriteList'}>
                  <IconButton
                    color={checkFavorite ? 'error' : 'default'}
                    onClick={() => handleAddToFavoriteList(user._id, dog._id)}
                  >
                    <Favorite />
                  </IconButton>
                </Tooltip>
                : <></> }
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDogType;
