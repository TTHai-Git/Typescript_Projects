import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { authApi, endpoints } from '../Config/APIs'
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import Payment from '../Interface/Payment'
import formatDate from '../Convert/formatDate'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

const PaymentInfomation = () => {
  const [paymentInfo, setPaymentInfo] = useState<Payment>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const user = useSelector((state: RootState) => state.auth.user)
  const { user_id, order_id } = useParams();
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {t} = useTranslation()

  const getPaymentDetails = async () => {
    try {
      setLoading(true)
      const res = await authApi.get(endpoints.getPaymentOfOrder(order_id))

      if (res.status === 200) {
        if (res.data) {
          setPaymentInfo(res.data)
        } else {
          setError(true)
          setErrorMessage('No payment information found.')
        }
      }
    } catch (error: any) {
      console.error("Error: ", error)
      setError(true)
      setErrorMessage(error?.response?.data?.message || 'Failed to load payment info.')
    } finally {
      setLoading(false)
    }
  }

 
  useEffect(() => {
    getPaymentDetails()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return { bgcolor: '#e8f5e9', color: '#2e7d32' };
      case 'UNPAID': return { bgcolor: '#ffebee', color: '#d32f2f' };
      default: return { bgcolor: '#fff3e0', color: '#ed6c02' };
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'var(--pet-bg)', minHeight: '100vh' }}>
      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{
          borderRadius: "30px",
          bgcolor: '#fff',
          color: '#ff9800',
          boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
          textTransform: "none",
          fontWeight: "bold",
          mb: 4,
          '&:hover': { bgcolor: '#fff3e0' }
        }}
      >
        {t("Go Back")}
      </Button>

      <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723', mb: 4 }}>
        {t("Payment Information")}
      </Typography>

      {loading ? (
        <Typography sx={{ color: '#ff9800', fontWeight: 'bold' }}>🔄 {t("Loading payment info...")}</Typography>
      ) : error ? (
        <Box sx={{ color: '#d32f2f', bgcolor: '#ffebee', p: 2, borderRadius: '16px', fontWeight: 'bold' }}>
          ⚠️ {errorMessage || t("Failed to load payment info.")}
        </Box>
      ) : paymentInfo ? (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fffbf7' }}>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Payment ID")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Method")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Provider")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Status")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Created Date")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Updated Date")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Check Payment Details")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#fdfbf7' } }}>
                <TableCell>1</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3e2723' }}>{paymentInfo._id}</TableCell>
                <TableCell>{paymentInfo.method}</TableCell>
                <TableCell>{paymentInfo.provider}</TableCell>
                <TableCell>
                  <Chip label={t(paymentInfo.status)} sx={{ ...getStatusColor(paymentInfo.status), fontWeight: 700 }} />
                </TableCell>
                <TableCell>{paymentInfo.createdAt ? formatDate(paymentInfo.createdAt) : "N/A"}</TableCell>
                <TableCell>{paymentInfo.updatedAt ? formatDate(paymentInfo.updatedAt) : "N/A"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/userinfo/${user_id}/orders/${order_id}/paymentInfo/:payment_id/details`)}
                    sx={{ borderRadius: '30px', fontWeight: 'bold', '&:hover': { bgcolor: '#fff3e0' } }}
                    startIcon={<RemoveRedEyeIcon />}
                  >
                    {t("View")}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="text.secondary">{t("No payment information available.")}</Typography>
      )}
    </Box>
  );

}

export default PaymentInfomation
