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
import { useEffect, useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';
import { authApi, endpoints } from '../Config/APIs';

export const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, checkOutFromCart, caculateTotalOfCart } = useCart();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [qrDataURL, setqrDataURL] = useState<string>("");
  const navigate = useNavigate();

  const handleMakePayment = async (choice: string, orderId: string, totalPrice: number) => {
    console.log("Choice: ", choice)
    try {
      setLoading(true);
      if (choice === "VNPAY") {
        console.log("in")
        const response = await axios.post("/api/vnpay/create-payment-url/", {
          amount: totalPrice,
          orderId: orderId,
        });
        console.log(response)
        window.location.href = response.data.paymentUrl;
      }
      if (choice === "PAYOS") {
        try {
            const items:any = []
            for (let index = 0; index < cartItems.length; index++) {
            const item = cartItems[index];
            items.push({
              "name": item.name,
              "price": item.price,
              "quantity": item.quantity
            })
            }
            const res_2 = await axios.post('/api/payOS/create-payment-link/', {
              orderId: orderId,
              amount: totalPrice,
              items: items,
              buyerName: user?.name,
              buyerEmail: user?.email,
              buyerPhone: user?.phone,
              buyerAddress: user?.address
            })
            console.log(res_2.data)
            window.location.href = res_2.data.checkoutUrl;
          } catch (error) {
            console.log(error)

          } finally {
            setLoading(false)
          }
      }
      if (choice === "CASH") {
        await authApi.post(endpoints['createPaymentForOrder'], {
          method: "Cash",
          provider: "Manual",
          amount: totalPrice,
          status: "PAID",
          order: orderId,
        });
      }
    } catch (error) {
      console.error("Payment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateVIETQRCODE = async () => {
    try {
      setLoading(true);
      const res_1 = await axios.post("https://api.vietqr.io/v2/generate", {
        accountNo: process.env.REACT_APP_VIETQG_accountNo,
        accountName: process.env.REACT_APP_VIETQG_accountName,
        acqId: process.env.REACT_APP_VIETQG_acqId,
        amount: caculateTotalOfCart(),
        addInfo: "Payment For Order",
        format: "text",
        template: "compact2",
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.REACT_APP_VIETQG_x_client_id,
          "x-api-key": process.env.REACT_APP_VIETQG_x_api_key,
        },
      });
      if (res_1.data.code === "00") setqrDataURL(res_1.data.data.qrDataURL);
    } catch (error) {
      console.error("QR Code Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleMakeOrder = async (choice: string) => {
    setLoading(true);
    try {
      const orderRes = await authApi.post(endpoints['createOrder'], {
        user: user?._id,
        totalPrice: caculateTotalOfCart(),
        status: choice === "Cash" ? "Confirmed" : "Pending",
      });

      if (orderRes.status === 201) {
        const orderDetails = cartItems.map(item => ({
          order: orderRes.data._id,
          product: item._id,
          quantity: item.quantity,
          price: item.price,
          note: item.note,
        }));
        const res_2 = await authApi.post(endpoints['createOrderDetails'], { data: orderDetails });

        if (res_2.status === 201) {
          checkOutFromCart();
          handleMakePayment(choice, orderRes.data._id, orderRes.data.totalPrice);
        }
      }
    } catch (err) {
      console.error("Order Error:", err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (cartItems.length > 0) {
    generateVIETQRCODE();
  } else {
    setqrDataURL(""); // Clear QR when cart is empty
  }
}, [cartItems]);

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
                  <Typography variant="subtitle1">Price: ${item.price}</Typography>
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
              <Typography variant="subtitle1">Total: ${caculateTotalOfCart().toString()}</Typography>

              {user?.isAuthenticated ? (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<AttachMoneyIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => handleMakeOrder("CASH")}
                  >
                    Pay with Cash
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleMakeOrder("VNPAY")}
                  >
                    <img
                      src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
                      alt="VNPay"
                      style={{ height: 24, marginRight: 8 }}
                    />
                    Pay with VNPay
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={generateVIETQRCODE}
                  >
                    Generate QR Code
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => handleMakeOrder("PAYOS")}
                  >
                   Pay With PayOs
                  </Button>
                  {qrDataURL && (
                    <Box mt={2} display="flex" justifyContent="center">
                      <img src={qrDataURL} alt="QR Code" width="500" height="auto"  />
                    </Box>
                  )}
                </>
              ) : (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">Please login to proceed to checkout.</Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 1 }}
                    onClick={() => navigate('/login', { state: "/checkout" })}
                  >
                    Login to Checkout
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
