import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import APIs, { authApi, endpoints } from '../../../Config/APIs'
import {
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
  Container,
  Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { login } from '../../../features/login/authSlice'

const PAYOSPaymentReturn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const orderId = queryParams.get('order')
  const id = queryParams.get('id')
  const cancel = queryParams.get('cancel')

  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [countdown, setCountdown] = useState<number>(4)

  const createPayment = async () => {
  if (cancel === "true") {
    try {
      setLoading(true)

      const checkStatus = await APIs.get(endpoints.getOrder(orderId))
      if (checkStatus.data.status !== "Pending") {
        setError(true)
        setErrorMessage("This payment has already been processed.")
        return
      }

      const res = await axios.get(`/api/payOS/get-payment-link-info/${id}`)
      const extraData = res.data.transactions[0]

      if (res.status === 200) {
        await authApi.post(endpoints.createPaymentForOrder, {
          method: "PAYOS",
          provider: "PAYOS",
          order: orderId,
          status: "FAILED",
          extraData: extraData,
        })

        await authApi.put(endpoints.updateStatusOfOrder(orderId), {
          status: "Failed",
        })

        setError(true)
        setErrorMessage('Payment failed or invalid transaction.')
      }
    } catch (error: any) {
      setError(true)
      setErrorMessage(error.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  } else {
    try {
      setLoading(true)
      const checkStatus = await APIs.get(endpoints.getOrder(orderId))
      if (checkStatus.data.status !== "Pending") {
        setError(true)
        setErrorMessage("This payment has already been processed.")
        return
      }

      const res = await axios.get(`/api/payOS/get-payment-link-info/${id}`)
      const extraData = res.data.transactions[0]

      if (res.status === 200) {
        await authApi.post(endpoints.createPaymentForOrder, {
          method: "PAYOS",
          provider: "PAYOS",
          order: orderId,
          status: "PAID",
          extraData: extraData,
        })

        await authApi.put(endpoints.updateStatusOfOrder(orderId), {
          status: "Confirmed",
        })

        setSuccess(true)
      }
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
        const res = await authApi.get(endpoints.authMe);
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
          navigate('/')
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

export default PAYOSPaymentReturn
