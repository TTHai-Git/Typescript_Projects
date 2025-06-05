import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Divider,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../Context/Cart';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router';
import {  useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { authApi, endpoints } from '../Config/APIs';


const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, caculateTotalOfCart } = useCart();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMakeOrder = async () => {
    setLoading(true);
    try {
      const orderRes = await authApi.post(endpoints.createOrder, {
        user: user?._id,
        totalPrice: caculateTotalOfCart(),
        status: "Pending",
      });

      if (orderRes.status === 201) {
        const orderDetails = cartItems.map(item => ({
          order: orderRes.data._id,
          product: item._id,
          quantity: item.quantity,
          price: item.price,
          note: item.note,
        }));
        const res_2 = await authApi.post(endpoints.createOrderDetails, { data: orderDetails });

        if (res_2.status === 201) {
          alert("Order placed successfully! Go to make shipement info")
          navigate("/cart/shipment", {
            state: {
              orderId: orderRes.data._id,
              totalPrice: orderRes.data.totalPrice
            }
          })
        }
      }
    } catch (err) {
      console.error("Order Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        🛒 Your Cart
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {cartItems.length === 0 ? (
        <Typography variant="h6" color="textSecondary">Your cart is empty.</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item, index) => (
              <Card key={item._id} sx={{ display: 'flex', mb: 2 }}>
                <CardMedia
                  component="img"
                  image={item.imageUrl}
                  alt={item.name}
                  sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.category.name} | {item.brand.name} | {item.vendor.name}
                  </Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {item.note?.split(' - ').map((line, i) => <div key={i}>{line}</div>)}
                  </Typography>
                  <Typography variant="subtitle1">Price: {item.price.toLocaleString()} VND</Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Tooltip title="Decrease">
                      <IconButton onClick={() => decreaseQuantity(item._id)} color="warning">
                        <Remove />
                      </IconButton>
                    </Tooltip>
                    <Typography mx={1}>{item.quantity}</Typography>
                    <Tooltip title="Increase">
                      <IconButton onClick={() => increaseQuantity(item._id)} color="primary">
                        <Add />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove">
                      <IconButton onClick={() => removeFromCart(item._id)} color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Checkout Summary */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">Order Summary</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1">Temp Total: {caculateTotalOfCart().toLocaleString()} VND</Typography>

              {user?.isAuthenticated ? (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<AttachMoneyIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => handleMakeOrder()}
                  >
                    Make Order
                  </Button>
                  
                </>
              ) : (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">Please login to proceed make order.</Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 1 }}
                    onClick={() => navigate('/login', { state: "/cart" })}
                  >
                    Login To Make Shipment Info
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
    
  );
};
export default Cart;
