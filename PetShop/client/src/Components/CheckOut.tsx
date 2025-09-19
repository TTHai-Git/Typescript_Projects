import React, { useEffect, useState } from 'react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useCart } from '../Context/Cart';
import { useLocation, useNavigate } from 'react-router';
import  { authApi, endpoints } from '../Config/APIs';
import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';

const CheckOut = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const location = useLocation();
    const orderId:string = location.state?.orderId || "";
    const totalPrice:number = location.state.totalPrice || 0
    const { cartItems, checkOutFromCart} = useCart();
    const [qrDataURL, setqrDataURL] = useState<string>("");
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()
    const {t} = useTranslation()
    const handleMakePayment = async (choice: string) => {
        console.log("Choice: ", choice)
        
        try {
            setLoading(true);
            if (choice === "VNPAY") {
            
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/vnpay/create-payment-url/`, {
                amount: totalPrice ,
                orderId: orderId,
            });
            console.log(response)
            window.location.href = response.data.paymentUrl;
            checkOutFromCart()
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
                const res_2 = await axios.post(`${process.env.REACT_APP_BASE_URL}/payOS/create-payment-link/`, {
                    orderId: orderId,
                    amount: totalPrice ,
                    items: items,
                    buyerName: user?.name,
                    buyerEmail: user?.email,
                    buyerPhone: user?.phone,
                    buyerAddress: user?.address
                })
                console.log(res_2.data)
                window.location.href = res_2.data.checkoutUrl;
                checkOutFromCart()
                } catch (error) {
                console.log(error)

                } finally {
                setLoading(false)
                }
            }
            if (choice === "CASH") {
            const res = await authApi.post(endpoints.createPaymentForOrder, {
                method: "Cash",
                provider: "Manual",
                amount: totalPrice,
                status: "PAID",
                order: orderId,
            });
            if  (res.status === 201) {
              showNotification(res.data.message, "success")
            }
            else {
              showNotification("Payment Failed", "error")
            }
            checkOutFromCart()
            navigate('/') 
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
            amount: totalPrice,
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

    useEffect(() => {
        console.log("Order ID:", orderId)
        console.log("Total Price:", totalPrice)
        if (cartItems.length > 0) {
        generateVIETQRCODE();
        } else {
        setqrDataURL(""); // Clear QR when cart is empty
        }
    }, []);
  return (
  <Grid item xs={12} md={4}>
    <Card elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6">{t("Order Summary")}</Typography>
      <Divider sx={{ my: 1 }} />

      <Typography variant="subtitle1">
        {t("Total")}: {totalPrice} VND
      </Typography>

      {user?.isAuthenticated ? (
        <>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<AttachMoneyIcon />}
            sx={{ mt: 2 }}
            onClick={() => handleMakePayment("CASH")}
          >
            {t("Pay with Cash")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => handleMakePayment("VNPAY")}
          >
            <img
              src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
              alt="VNPay"
              style={{ height: 24, marginRight: 8 }}
            />
            {t("Pay with VNPay")}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={generateVIETQRCODE}
          >
            {t("Generate QR Code")}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => handleMakePayment("PAYOS")}
          >
            {t("Pay with PayOs")}
          </Button>
          {qrDataURL && (
            <Box mt={2} display="flex" justifyContent="center">
              <img src={qrDataURL} alt="QR Code" width="500" height="auto" />
            </Box>
          )}
        </>
      ) : (
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            {t("Please login to proceed to checkout.")}
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ mt: 1 }}
            onClick={() => navigate('/login', { state: "/checkout" })}
          >
            {t("Login to Checkout")}
          </Button>
        </Box>
      )}
    </Card>
  </Grid>
);

}
export default CheckOut
