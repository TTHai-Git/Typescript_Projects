import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PaymentDetails } from '../Interface/Payment'
import { authApi, endpoints } from '../Config/APIs'
import { 
  Button, Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress 
} from '@mui/material'
import { ArrowBack, ReceiptLong } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const PaymentInfomationDetails = () => {
  const {payment_id } = useParams()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const {t} = useTranslation()

  // Keys you want to hide from the table
  const hiddenKeys = [
    'accountNumber',
    'counterAccountNumber',
    'virtualAccountName',
    'virtualAccountNumber',
    'counterAccountBankName',
    'vnp_SecureHash',
    'vnp_BankTranNo',
    'vnp_OrderType'
  ]

  const getPaymentDetailsOfOrder = async () => {
    try {
      setLoading(true)
      const res = await authApi.get(endpoints.getPaymentDetailsOfOrder(payment_id))
      if (res.status === 200) {
        setPaymentDetails(res.data)
      }
    } catch (error: any) {
      console.error('Error fetching payment details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (payment_id) getPaymentDetailsOfOrder()
  }, [payment_id])

  // Filtered entries
  const filteredEntries = Object.entries(paymentDetails?.extraData || {}).filter(
    ([key]) => !hiddenKeys.includes(key)
  )


  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'var(--pet-bg)', minHeight: '100vh' }}>
      <Box display="flex" alignItems="center" mb={4}>
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
            px: 4, py: 1,
            '&:hover': { bgcolor: '#fff3e0' },
            mr: 3
          }}
        >
          {t("Go Back")}
        </Button>
        <ReceiptLong sx={{ color: '#ffbd59', fontSize: 32, mr: 1 }} />
        <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723' }}>
          {t("Payment Information")}
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyItems="center" alignItems="center" py={10} justifyContent="center">
          <CircularProgress sx={{ color: '#ff9800' }} />
          <Typography variant="h6" sx={{ ml: 2, color: '#ff9800', fontWeight: 'bold' }}>
            {t("Loading payment info...")}
          </Typography>
        </Box>
      ) : filteredEntries.length > 0 ? (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', overflow: 'hidden', bgcolor: '#fff', mb: 4 }}>
            <TableContainer sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #ffe8cc' }}>
              <Table aria-label="payment details table">
                  <TableHead>
                  <TableRow sx={{ bgcolor: '#fdfbf7' }}>
                  {filteredEntries.map(([key]) => (
                      <TableCell key={key} sx={{ fontWeight: 800, color: '#8d6e63', borderBottom: '2px solid #ffe8cc', whiteSpace: 'nowrap' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </TableCell>
                  ))}
                  </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow hover sx={{ transition: 'background-color 0.2s', '&:last-child td': { border: 0 } }}>
                  {filteredEntries.map(([key, value]) => (
                      <TableCell key={key} sx={{ color: '#3e2723', fontWeight: 600, maxWidth: '200px', wordBreak: 'break-word', borderBottom: '1px solid #f0f0f0' }}>
                      {value !== undefined && value !== null && value !== '' ? (
                          <Box sx={{ bgcolor: '#fffbf7', p: 1, px: 2, borderRadius: '8px', border: '1px dashed #ffe8cc', display: 'inline-block' }}>
                              {String(value)}
                          </Box>
                      ) : (
                          <Typography variant="caption" color="text.disabled">—</Typography>
                      )}
                      </TableCell>
                  ))}
                  </TableRow>
              </TableBody>
          </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '24px', border: '1px dashed #ccc', bgcolor: '#fafafa' }}>
           <Typography variant="h6" color="text.secondary">
             ❌ {t("No payment data available.")}
           </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default PaymentInfomationDetails
