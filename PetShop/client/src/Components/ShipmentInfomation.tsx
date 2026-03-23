import React, { useEffect, useState } from 'react'
import Shipment from '../Interface/Shipment';
import { useNavigate, useParams } from 'react-router';
import { authApi, endpoints } from '../Config/APIs';
import formatDate from '../Convert/formatDate';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

 const ShipmentInfomation = () => {
  const { order_id } = useParams();
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [shipmentInfo, setShipmentInfo] = useState<Shipment>()
  const {t} = useTranslation()

  const getShipmentOfOrder = async () => {
    try {
      // console.log("order_id: ", order_id)
      setLoading(true)
      const res = await authApi.get(endpoints.getShipmentOfOrder(order_id))
      if (res.status === 200) {
        setShipmentInfo(res.data)
        // console.log("shipmentInfo: ", shipmentInfo)
      }
      else {
        setError(true)
        setErrorMessage(t(`${res.data.message}`))
      }
      
    } catch (error: any) {
      setError(true)
      setErrorMessage(t(error.response?.data?.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getShipmentOfOrder()
  }, [])

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
        {t("Shipment Information")}
      </Typography>

      {loading ? (
        <Typography sx={{ color: '#ff9800', fontWeight: 'bold' }}>🔄 {t("Loading shipment info...")}</Typography>
      ) : error ? (
        <Box sx={{ color: '#d32f2f', bgcolor: '#ffebee', p: 2, borderRadius: '16px', fontWeight: 'bold' }}>
          ⚠️ {errorMessage || t("Failed to load shipment information.")}
        </Box>
      ) : shipmentInfo ? (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fffbf7' }}>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Shipment ID")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Method")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Buyer Name")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Buyer Phone")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Buyer Address")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Shipment Fee")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Created Date")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#ff9800', borderBottom: '2px solid #ffe8cc' }}>{t("Updated Date")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#fdfbf7' } }}>
                <TableCell>1</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3e2723' }}>{shipmentInfo._id}</TableCell>
                <TableCell>
                  <Chip label={t(shipmentInfo.method)} sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 700 }} />
                </TableCell>
                <TableCell>{shipmentInfo.buyerName}</TableCell>
                <TableCell>{shipmentInfo.buyerPhone}</TableCell>
                <TableCell>{shipmentInfo.buyerAddress}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#4caf50' }}>{shipmentInfo.fee.toLocaleString()} VND</TableCell>
                <TableCell>{shipmentInfo.createdAt ? formatDate(shipmentInfo.createdAt) : t("N/A")}</TableCell>
                <TableCell>{shipmentInfo.updatedAt ? formatDate(shipmentInfo.updatedAt) : t("N/A")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="text.secondary">{t("No shipment information available.")}</Typography>
      )}
    </Box>
  );


}
export default ShipmentInfomation
