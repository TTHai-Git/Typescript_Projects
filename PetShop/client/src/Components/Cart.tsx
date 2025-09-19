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
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
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
        showNotification(orderRes.data.message, "success")
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

  const handleCaculateDiscountOfTotalOfCart = async(voucherId: string) => {
    try {
      const res = await APIs.get(endpoints["getVoucher"](voucherId))
      setSelectedVoucher(res.data)
      setDiscount(selectedVoucher?.discount? selectedVoucher.discount : 0)
      caculateTotalOfCart(discount)
    } catch (error) {
      console.log(error)
    }
  }

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
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {t("🛒 Your Cart")}
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {cartItems.length === 0 ? (
        <Typography variant="h6" color="textSecondary">{t("Your cart is empty.")}</Typography>
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
                    {t("Category")}: {t(item.category?.name)} | {t("Brand")}: {item.brand.name} | {t("Vendor")}: {item.vendor.name}
                  </Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {item.note?.split(" - ").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </Typography>
                  <Typography variant="subtitle1">{t("Price")}: {item.price.toLocaleString()} VND</Typography>
                  <Typography variant="subtitle2">{t("Stock")}: {item.stock} {t("items")}</Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Tooltip title={t("Decrease")}>
                      <IconButton onClick={() => decreaseQuantity(item._id)} color="warning">
                        <Remove />
                      </IconButton>
                    </Tooltip>
                    <Typography mx={1}>{item.quantity}</Typography>
                    <Tooltip title={t("Increase")}>
                      <IconButton onClick={() => increaseQuantity(item._id, item.stock)} color="primary">
                        <Add />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("Remove")}>
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
              <Typography variant="h6">{t("Order Summary")}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1">{t("Total Amount Temporarily Calculated")}: {caculateTotalOfCart(0).toLocaleString()} VND</Typography>
              <FormControl style={{ minWidth: 369 }}>
                <InputLabel>{t("Search Vouchers")}</InputLabel>
                <Select
                  value={selectedVoucherId}
                  onChange={(e) => setSelectedVoucherId(e.target.value as string)}
                >
                  {vouchers?.map((v) => (
                    <MenuItem key={v._id} value={v._id}>
                      {v.code} - {v.discount.toString()}% - {v.description}
                    </MenuItem>
                  ))}
                  <MenuItem value="">{t("None")}</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="subtitle1">{t("Discount Price")}: - {caculateDiscountPrice(discount, caculateTotalOfCart(0)).toLocaleString()} VND</Typography>
              <Typography variant="subtitle1">{t("Total Amount Temporarily Calculated After Using The Voucher")}: {caculateTotalOfCart(discount).toLocaleString()} VND</Typography>
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
                    {t("Make Order")}
                  </Button>
                  
                </>
              ) : (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">{t("Please login to proceed make order.")}</Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 1 }}
                    onClick={() => navigate('/login', { state: "/cart" })}
                  >
                    {t("Login To Make Shipment Info")}
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
