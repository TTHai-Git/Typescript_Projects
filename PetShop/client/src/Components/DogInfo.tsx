import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Grid, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PetsIcon from '@mui/icons-material/Pets';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Button } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../Context/Cart';
import { Dog, DogsCart } from '../Interface/Dogs';
import NumberInput from './Customs/NumberInput';

interface DogDetails extends Dog {
    createdAt: string;
    updatedAt: string;
}



const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
}));

const DogInfo: React.FC = () => {
    const { addToCart } = useCart();
    const { dog_id, page } = useParams<{ dog_id: string; page: string }>();
    const [dog, setDog] = React.useState<DogDetails | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [quantity, setQuantity] = React.useState<number>(1)

    const handleAddToCart = (dog: DogsCart, quantity: number) => {
        addToCart(dog, quantity);
      };

    React.useEffect(() => {
        const fetchDog = async () => {
            try {
                const response = await axios.get(`/v1/dogs/${page}/dog/${dog_id}/info`);
                setDog(response.data);
            } catch (error) {
                console.error('Error fetching dog:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDog();
    }, [dog_id, page]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!dog) {
        return <Typography variant="h6" textAlign="center">Dog not found.</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Item>
                        <img src={dog.imageUrl} alt={dog.name} style={{ width: '100%', borderRadius: '8px' }} />
                    </Item>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Item>
                        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <PetsIcon sx={{ mr: 1 }} /> NickName: {dog.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PetsIcon sx={{ mr: 1 }} /> Breed: {dog.breed}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                             Price: {dog.price} <AttachMoneyIcon sx={{ mr: 1 }} />
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, textAlign: 'left' }}>Description: {dog.description}</Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon sx={{ mr: 1 }} /> Porn: {new Date(dog.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon sx={{ mr: 1 }} /> Adopt: {new Date(dog.updatedAt).toLocaleString()}
                        </Typography>
                        <NumberInput min={0}  defaultValue={1} onChange={(value) => setQuantity(value) }/>
                        <button className="add-to-cart-btn" onClick={() => handleAddToCart(dog, quantity)}>
                        <AddShoppingCartIcon/> Add to Cart
                        </button>
                    </Item>
                </Grid>

            </Grid>
        </Box>
    );
};

export default DogInfo;
