import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { authApi, endpoints } from '../Config/APIs'
import { Box, Button } from '@mui/material'
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
    <h1 className="text-xl font-bold mb-4">{t("Payment Information")}</h1>

    {loading ? (
      <p className="loading">🔄 {t("Loading payment info...")}</p>
    ) : error ? (
      <div className="text-red-600 bg-red-100 border border-red-300 p-4 rounded">
        ⚠️ {errorMessage}
      </div>
    ) : paymentInfo ? (
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">{t("Payment ID")}</th>
            <th className="border px-4 py-2">{t("Method")}</th>
            <th className="border px-4 py-2">{t("Provider")}</th>
            <th className="border px-4 py-2">{t("Status")}</th>
            <th className="border px-4 py-2">{t("Created Date")}</th>
            <th className="border px-4 py-2">{t("Updated Date")}</th>
            <th className="border px-4 py-2">{t("Check Payment Details")}</th>
          </tr>
        </thead>
        <tbody>
          <tr key={paymentInfo._id} className="text-center">
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">{paymentInfo._id}</td>
            <td className="border px-4 py-2">{paymentInfo.method}</td>
            <td className="border px-4 py-2">{paymentInfo.provider}</td>
            <td className="border px-4 py-2">{t(`${paymentInfo.status}`)}</td>
            <td className="border px-4 py-2">
              {paymentInfo.createdAt ? formatDate(paymentInfo.createdAt) : "N/A"}
            </td>
            <td className="border px-4 py-2">
              {paymentInfo.updatedAt ? formatDate(paymentInfo.updatedAt) : "N/A"}
            </td>
            <td className="border px-4 py-2">
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/userinfo/${user_id}/orders/${order_id}/paymentInfo/:payment_id/details`)
                }
              >
                <RemoveRedEyeIcon /> {t("View")}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      <p className="text-gray-500">{t("No payment information available.")}</p>
    )}
  </div>
);

}

export default PaymentInfomation
