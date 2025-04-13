import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../Context/Cart';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useState } from 'react';

export const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, checkOutFromCart, caculateTotalOfCart } = useCart();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  let [numericalOrder, setNumericalOrder] = useState<number>(1)
  const navigate = useNavigate();

  const handleMakeOrder = async () => {
    setLoading(true);
    try {
      const res_1 = await axios.post('/v1/orders', {
        user: user?._id,
        totalPrice: caculateTotalOfCart()
      });
      const data: any[] = cartItems.map(cartItem => ({
        order: res_1.data._id,
        product: cartItem._id,
        quantity: cartItem.quantity,
        price: cartItem.price,
        note: cartItem.note,
      }));
      if (res_1.status === 201) {
        const res_2 = await axios.post('/v1/orderDetails', { data });
        if (res_2.status === 201) checkOutFromCart();
      }
    } catch {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      {cartItems.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Your cart is empty
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>#</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map(item => (
                  <TableRow key={item._id}>
                    <TableCell>
                      {numericalOrder++}
                    </TableCell>
                    <TableCell>
                      <img src={item.imageUrl} alt={item.name} width="60" style={{ borderRadius: 8 }} />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      {item.note?.split(' - ').map((line, index) => (
                      <div key={index}>{line}</div>
                      ))}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${Number(item.quantity) * Number(item.price)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Increase Quantity">
                        <IconButton color="primary" onClick={() => increaseQuantity(item._id)}>
                          <Add />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Decrease Quantity">
                        <IconButton color="warning" onClick={() => decreaseQuantity(item._id)}>
                          <Remove />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Item">
                        <IconButton color="error" onClick={() => removeFromCart(item._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Total: ${caculateTotalOfCart().toFixed(2)}
            </Typography>

            {user?.isAuthenticated ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleMakeOrder}
                disabled={loading}
              >
                Checkout
              </Button>
            ) : (
              <Box>
                <Typography>Please login to pay!</Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login', {state:  "/checkout"} )}
                >
                  Go To Login
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
