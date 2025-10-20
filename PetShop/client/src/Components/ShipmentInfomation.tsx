import React, { useEffect, useState } from 'react'
import Shipment from '../Interface/Shipment';
import { useNavigate, useParams } from 'react-router';
import { authApi, endpoints } from '../Config/APIs';
import formatDate from '../Convert/formatDate';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
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
  <div className="container mx-auto p-4">
    <Button
      variant="contained"
      color="inherit"
      size="large"
      startIcon={<ArrowBack />}
      onClick={() => navigate(-1)}
      sx={{ borderRadius: 3, px: 4, textTransform: 'none', fontWeight: 'bold', boxShadow: 2 }}
    >
      {t("Go Back")}
    </Button>
    <h1 className="text-xl font-bold mb-4">{t("Shipment Information")}</h1>

    {loading ? (
      <p className="loading">🔄 {t("Loading shipment info...")}</p>
    ) : error ? (
      <div className="text-red-600 bg-red-100 border border-red-300 p-4 rounded">
        ⚠️ {errorMessage || t("Failed to load shipment information.")}
      </div>
    ) : shipmentInfo ? (
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">{t("Shipment ID")}</th>
            <th className="border px-4 py-2">{t("Method")}</th>
            <th className="border px-4 py-2">{t("Buyer Name")}</th>
            <th className="border px-4 py-2">{t("Buyer Phone")}</th>
            <th className="border px-4 py-2">{t("Buyer Address")}</th>
            <th className="border px-4 py-2">{t("Shipment Fee")}</th>
            <th className="border px-4 py-2">{t("Created Date")}</th>
            <th className="border px-4 py-2">{t("Updated Date")}</th>
          </tr>
        </thead>
        <tbody>
          <tr key={shipmentInfo._id} className="text-center">
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">{shipmentInfo._id}</td>
            <td className="border px-4 py-2">{t(shipmentInfo.method)}</td>
            <td className="border px-4 py-2">{shipmentInfo.buyerName}</td>
            <td className="border px-4 py-2">{shipmentInfo.buyerPhone}</td>
            <td className="border px-4 py-2">{shipmentInfo.buyerAddress}</td>
            <td className="border px-4 py-2">{shipmentInfo.fee.toLocaleString()} VND</td>
            <td className="border px-4 py-2">
              {shipmentInfo.createdAt ? formatDate(shipmentInfo.createdAt) : t("N/A")}
            </td>
            <td className="border px-4 py-2">
              {shipmentInfo.updatedAt ? formatDate(shipmentInfo.updatedAt) : t("N/A")}
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      <p className="text-gray-500">{t("No shipment information available.")}</p>
    )}
  </div>
);


}
export default ShipmentInfomation
