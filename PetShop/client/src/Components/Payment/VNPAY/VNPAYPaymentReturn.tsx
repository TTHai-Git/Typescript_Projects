import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import APIs, { authApi, endpoints } from '../../../Config/APIs'
import {
  Alert,
  Snackbar,
  CircularProgress,
  Box,
  Typography,
  Container,
  Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { login } from '../../../features/login/authSlice'

const PaymentReturn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const [countdown, setCountdown] = useState<number>(4)
  const navigate = useNavigate()

  const vnp_ResponseCode = query.get("vnp_ResponseCode")
  const vnp_TxnRef = query.get('vnp_TxnRef')
  const vnp_Amount = query.get('vnp_Amount')
  const vnp_BankCode = query.get('vnp_BankCode')
  const vnp_BankTranNo = query.get('vnp_BankTranNo')

  const extraData = {
    "vnp_Amount": vnp_Amount,
    "vnp_BankCode": vnp_BankCode,
    "vnp_BankTranNo": vnp_BankTranNo,
    "vnp_CardType": query.get('vnp_CardType'),
    "vnp_OrderInfo": query.get('vnp_OrderInfo'),
    "vnp_OrderType": query.get('vnp_OrderType'),
    "vnp_PayDate": query.get('vnp_PayDate'),
    "vnp_SecureHash": query.get('vnp_SecureHash'),
  }

  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const createPayment = async () => {
    if (vnp_ResponseCode === "00") {
      try {
        setLoading(true)
        const checkStatus = await APIs.get(endpoints['getOrder'](vnp_TxnRef))
        if (checkStatus.data.status !== "Pending") {
          setError(true)
          setErrorMessage("This pyament has been already been processed")
          return
        }

        await authApi.post(endpoints['createPaymentForOrder'], {
          method: "VNPay",
          provider: "VNPay",
          order: vnp_TxnRef,
          status: "PAID",
          extraData: extraData
        })
        await authApi.put(endpoints['updateStatusOfOrder'](vnp_TxnRef), {
          status: "Confirmed"
        })
        setSuccess(true)

      } catch (error: any) {
        setError(true)
        setErrorMessage(error.response?.data?.message || 'Something went wrong!')
      } finally {
        setLoading(false)
      }
    } else {
      try {
        setLoading(true)
        const checkStatus = await APIs.get(endpoints['getOrder'](vnp_TxnRef))
        if (checkStatus.data.status !== "Pending") {
          setError(true)
          setErrorMessage("This payment has already been processed.")
          return
        }
        await authApi.post(endpoints['createPaymentForOrder'], {
          method: "VNPay",
          provider: "VNPay",
          order: vnp_TxnRef,
          status: "FAILED",
          extraData: extraData
        })
        await authApi.put(endpoints['updateStatusOfOrder'](vnp_TxnRef), {
          status: "FAILED"
        })
        setError(true)
        setErrorMessage('Payment failed or invalid transaction.')
      } catch (error: any) {
        setError(true)
        setErrorMessage(error.response?.data?.message || 'Something went wrong!')
      } finally {
        setLoading(false)
      }
    }
  }

  const checkUser = async () => {
    try {
      const res = await authApi.get(endpoints['authMe']);
      dispatch(login({
        ...res.data,
        isAuthenticated: true,
      }));
    } catch (err) {
      console.log("Not logged in or token expired.");
    }
  };
    
  useEffect(() => {
    createPayment()
    checkUser()
  }, [])


  useEffect(() => {
    let timer: NodeJS.Timeout
  
    if ((success || error) && !loading) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate("/")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  
    return () => clearInterval(timer)
  }, [success, error, loading, navigate])

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      {loading ? (
        <>
          <CircularProgress />
          <Typography mt={2}>Processing your payment...</Typography>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack spacing={2} alignItems="center">
            {success ? (
              <>
                <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
                <Typography variant="h5" fontWeight="bold">
                  Payment Successful!
                </Typography>
                <Typography color="text.secondary">
                  Your transaction has been completed.
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Redirecting in {countdown} second{countdown !== 1 && 's'}...
                </Typography>
              </>
            ) : (
              <>
                <ErrorIcon color="error" sx={{ fontSize: 80 }} />
                <Typography variant="h5" fontWeight="bold">
                  Payment Failed
                </Typography>
                <Typography color="text.secondary">
                  {errorMessage}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Redirecting in {countdown} second{countdown !== 1 && 's'}...
                </Typography>
              </>
            )}
          </Stack>
        </motion.div>
      )}

      {/* Snackbar for success */}
      <Snackbar open={success} autoHideDuration={6000}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Payment was successful. Thank you!
        </Alert>
      </Snackbar>

      {/* Snackbar for error */}
      <Snackbar open={error} autoHideDuration={6000}>
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default PaymentReturn
