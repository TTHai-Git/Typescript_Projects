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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper
} from '@mui/material';
import { Add, Remove, DeleteOutline, Category, Storefront, ShoppingCartCheckout } from '@mui/icons-material';
import { useCart } from '../Context/Cart';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router';
import {  useEffect, useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';
import { Voucher } from '../Interface/Voucher';


const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, caculateTotalOfCart, caculateDiscountPrice } = useCart();
  const { showNotification } = useNotification()
  const [vouchers, setVouchers] = useState<Voucher[]>()
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>("")
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>()
  const [discount, setDiscount] = useState<number>(0)
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation()
  

  const handleUpdateVoucherUsageForUser = async (voucherId: string) => {
    try {
      const res = await authApi.patch(endpoints['updateVoucherUsageForUser'](voucherId))
    } catch (error) {
      console.log(error)
    }
  }

  const handleMakeOrder = async () => {
    setLoading(true);
    try {
      const orderRes = await authApi.post(endpoints.createOrder, {
        user: user?._id,
        totalPrice: caculateTotalOfCart(discount),
        status: "Pending",
      });

      if (orderRes.status === 201) {
        showNotification(t(`${orderRes.data.message}`), "success")
        handleUpdateVoucherUsageForUser(selectedVoucherId)
        const orderDetails = cartItems.map(item => ({
          order: orderRes.data.doc._id,
          product: item._id,
          quantity: item.quantity,
          price: item.price,
          note: item.note,
        }));
        const res_2 = await authApi.post(endpoints.createOrderDetails, { data: orderDetails });

        if (res_2.status === 201) {
          showNotification(res_2.data.message, "success")
          navigate("/cart/shipment", {
            state: {
              orderId: orderRes.data.doc._id,
              totalPrice: orderRes.data.doc.totalPrice
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

  const handleGetAvailableVouchersForOrders = async (totalOfCart: Number) => {
    try {
     
      const res = await APIs.get(`${endpoints["getAvailableVouchersForOrders"]}?totalOfCart=${totalOfCart}`)
      if (res.status === 200){
        setVouchers(res.data)
      }
    } catch (error) {
      console.log("Something Went Wrong", error)
    } finally {
      
    }
  }

  const handleCaculateDiscountOfTotalOfCart = async (voucherId: string) => {
  try {
    const res = await APIs.get(endpoints["getVoucher"](voucherId));
    setSelectedVoucher(res.data);
    setDiscount(res.data?.discount ?? 0); // ✅ use API result
  } catch (error) {
    console.error(error);
  }
};


  useEffect(() => {
    handleGetAvailableVouchersForOrders(caculateTotalOfCart(0))
  }, [cartItems])

  useEffect(() => {
    if (selectedVoucherId) {
      handleCaculateDiscountOfTotalOfCart(selectedVoucherId);
    } else {
      setDiscount(0); // reset when "None"
    }
  }, [selectedVoucherId]);

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: 'var(--pet-bg)', minHeight: '100vh' }}>
      <Typography variant="h3" fontWeight="900" sx={{ color: '#3e2723', mb: 4, display: 'flex', alignItems: 'center' }}>
        🛒 {t("Your Cart")}
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress sx={{ color: '#ff9800' }} />
          <Typography variant="h6" sx={{ ml: 2, color: '#ff9800', fontWeight: 'bold' }}>{t("Processing...")}</Typography>
        </Box>
      )}

      {cartItems.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: '32px', border: '2px dashed #ffe8cc', bgcolor: '#fff' }}>
          <Typography variant="h5" fontWeight="800" sx={{ color: '#8d6e63', mb: 2 }}>{t("Your cart is empty.")}</Typography>
          <Button variant="contained" onClick={() => navigate('/products')} sx={{ borderRadius: '30px', bgcolor: '#ff9800', textTransform: 'none', fontWeight: 'bold', px: 4, py: 1.5, '&:hover': { bgcolor: '#f57c00' } }}>
            {t("Continue Shopping")}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item, index) => (
              <Card key={item._id} elevation={0} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3, borderRadius: '24px', border: '1px solid #f0f0f0', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', overflow: 'hidden', position: 'relative', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 15px 50px rgba(0,0,0,0.08)' } }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#fdfbf7' }}>
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.name}
                    sx={{ width: { xs: '100%', sm: 140 }, height: { xs: 200, sm: 140 }, objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                </Box>
                <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box pr={2}>
                      <Typography variant="h6" fontWeight="800" sx={{ color: '#3e2723', mb: 0.5, lineHeight: 1.2 }}>{item.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#8d6e63', mb: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}><Category sx={{ fontSize: 16, mr: 0.5, color: '#ffbd59' }} /> {t(item.category?.name)}</Box>
                        •
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}><Storefront sx={{ fontSize: 16, mr: 0.5, color: '#4caf50' }} /> {item.vendor.name}</Box>
                      </Typography>
                    </Box>
                    <Tooltip title={t("Remove")} arrow>
                      <IconButton onClick={() => removeFromCart(item._id)} sx={{ color: '#ff5252', bgcolor: '#ffebee', '&:hover': { bgcolor: '#ffcdd2' } }}>
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {item.note && (
                    <Box sx={{ bgcolor: '#fffbf7', p: 1.5, borderRadius: '12px', border: '1px dashed #ffe8cc', mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#555' }}>
                        {item.note?.split(" - ").map((line, i) => <div key={i}>{line}</div>)}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto" flexWrap="wrap" gap={2}>
                    <Typography variant="h5" fontWeight="900" sx={{ color: '#ff9800' }}>
                      {item.price.toLocaleString()} ₫
                    </Typography>

                    <Box display="flex" alignItems="center" sx={{ bgcolor: '#f5f5f5', borderRadius: '30px', p: 0.5, border: '1px solid #e0e0e0' }}>
                      <IconButton onClick={() => decreaseQuantity(item._id)} size="small" sx={{ color: '#555', '&:hover': { bgcolor: '#e0e0e0' } }}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography fontWeight="800" sx={{ mx: 2, minWidth: '20px', textAlign: 'center', color: '#3e2723' }}>{item.quantity}</Typography>
                      <IconButton onClick={() => increaseQuantity(item._id, item.stock)} size="small" sx={{ color: '#ff9800', '&:hover': { bgcolor: '#fff3e0' } }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Checkout Summary */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Card elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '32px', border: '1px solid #f0f0f0', boxShadow: '0 20px 60px rgba(0,0,0,0.06)', bgcolor: '#fff' }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: '#3e2723', mb: 3 }}>{t("Order Summary")}</Typography>
                
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" sx={{ color: '#888', fontWeight: 600 }}>{t("Subtotal")}</Typography>
                    <Typography variant="h6" fontWeight="800" sx={{ color: '#3e2723' }}>{caculateTotalOfCart(0).toLocaleString()} ₫</Typography>
                  </Box>

                  <FormControl fullWidth sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#fdfbf7' } }}>
                    <InputLabel id="voucher-label">{t("Available Vouchers")}</InputLabel>
                    <Select
                      labelId="voucher-label"
                      value={selectedVoucherId}
                      label={t("Available Vouchers")}
                      onChange={(e) => setSelectedVoucherId(e.target.value as string)}
                    >
                      <MenuItem value=""><em>{t("None")}</em></MenuItem>
                      {vouchers?.map((v) => (
                        <MenuItem key={v._id} value={v._id}>
                          <strong>{v.code}</strong> &nbsp;—&nbsp; {v.discount.toString()}% &nbsp;({v.description})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {discount > 0 && (
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ color: '#4caf50', bgcolor: '#e8f5e9', p: 1.5, borderRadius: '12px' }}>
                      <Typography variant="body2" fontWeight="700">{t("Discount Price")}</Typography>
                      <Typography variant="body1" fontWeight="800">- {caculateDiscountPrice(discount, caculateTotalOfCart(0)).toLocaleString()} ₫</Typography>
                    </Box>
                  )}
                </Stack>
                
                <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4, mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: '#3e2723', fontWeight: 800 }}>{t("Total Amount")}</Typography>
                  <Typography variant="h4" fontWeight="900" sx={{ color: '#ff9800' }}>
                    {caculateTotalOfCart(discount).toLocaleString()} ₫
                  </Typography>
                </Box>

                {user?.isAuthenticated ? (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartCheckout />}
                    onClick={() => handleMakeOrder()}
                    sx={{ 
                      py: 2, 
                      borderRadius: '30px', 
                      fontSize: '1.2rem', 
                      fontWeight: 900, 
                      bgcolor: '#ff9800', 
                      boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: '#f57c00', transform: 'translateY(-2px)', boxShadow: '0 12px 30px rgba(255, 152, 0, 0.5)' }
                    }}
                  >
                    {t("Proceed to Checkout")}
                  </Button>
                ) : (
                  <Box mt={2}>
                    <Typography variant="body2" sx={{ color: '#ff5252', mb: 2, textAlign: 'center', fontWeight: 600 }}>{t("Please login to proceed make order.")}</Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login', { state: "/cart" })}
                      sx={{ 
                        py: 1.5,
                        borderRadius: '30px', 
                        fontWeight: 800, 
                        color: '#ff9800', 
                        border: '2px solid #ff9800',
                        '&:hover': { bgcolor: '#fff3e0', border: '2px solid #f57c00', color: '#f57c00' }
                      }}
                    >
                      {t("Login to Checkout")}
                    </Button>
                  </Box>
                )}
              </Card>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
    
  );
};

export default Cart;
