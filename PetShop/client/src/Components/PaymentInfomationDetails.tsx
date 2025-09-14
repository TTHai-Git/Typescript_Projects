import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { PaymentDetails } from '../Interface/Payment'
import { authApi, endpoints } from '../Config/APIs'
import { Box, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const PaymentInfomationDetails = () => {
  const { payment_id } = useParams()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>()
  const [loading, setLoading] = useState<boolean>(false)
  const location = useLocation()
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
    <div className="container mx-auto p-5">
  

      <h1 className="text-xl font-bold mb-4">{t("Payment Information")}</h1>

      {loading ? (
        <p className="loading">{t("🔄 Loading payment info...")}</p>
      ) : filteredEntries.length > 0 ? (
        <table className="table-auto border border-gray-300 w-full">
                <thead>
                <tr>
                {filteredEntries.map(([key]) => (
                    <th key={key} className="border px-4 py-2 text-left bg-gray-100 whitespace-nowrap">
                    {key}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                {filteredEntries.map(([key, value]) => (
                    <td key={key} className="border px-4 py-2 break-words max-w-[200px]">
                    {value ?? '—'}
                    </td>
                ))}
                </tr>
            </tbody>
        </table>

      ) : (
        <p className="text-gray-500">{t("No payment data available.")}</p>
      )}
    </div>
  )
}

export default PaymentInfomationDetails
