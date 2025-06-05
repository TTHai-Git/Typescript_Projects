// import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import '../Assets/CSS/ListOrders.css';
import formatDate from '../Convert/formatDate ';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Order from '../Interface/Orders';
import { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Autocomplete, Box, Button, InputAdornment, TextField } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import SortIcon from '@mui/icons-material/Sort';

const ListOrders = () => {
  const user = useSelector((state: RootState)=> state.auth.user)
  const { user_id } = useParams()
  const { page } = useParams<{ page?: string }>(); // Get page number from URL
  const [orders, setOrders] = useState<Order[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('Oldest')
  const [loading, setLoading] = useState(false)
  let [count] = useState<number>(1)
  const navigate = useNavigate()
  const location = useLocation()

  const options = [
    { label: 'Increasing By Price', id: 'price_asc' },
    { label: 'Decrease By Price', id: 'price_desc' },
    { label: 'Latest', id: 'latest' },
    { label: 'Oldest', id: 'oldest' },
  ];

  const getListOrders = async () => {
    setLoading(true)
    try {
      // const response = await axios.get(`/v1/orders/${user_id}/${current}`)
      const query = new URLSearchParams()
      if (sortBy) query.append('sort', sortBy)
      query.append('page', currentPage.toString())
      const response = await authApi.get(`${endpoints['getOrdersOfCustomer'](user_id)}?${query.toString()}`)
      // console.log(response.data)
      if (response.status === 200) {
        // console.log(response.data.orders)
        setOrders(response.data.orders)
        // console.log(orders)
        setPages(response.data.pages)
        setTotal(response.data.total)
      } else {
        console.log(response.data.message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const newSortBy = searchParams.get('sort') || '';
    setSortBy(newSortBy)
    getListOrders()
  }, [searchParams.toString()])

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= pages) {
      const params: any = {page: newPage.toString()}
      if(sortBy) params.sort = sortBy.toString()
      setSearchParams(params)
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">List Orders</h1>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
         <Autocomplete
            disablePortal
            options={options}
            value={options.find((opt) => opt.id.toString() === sortBy) || null}
            onChange={(event, newValue) => {
              const selectedSort = newValue?.id.toString() || '';
              setSortBy(selectedSort);
              setSearchParams({
                page: '1',
                
                sort: selectedSort,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sort By"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SortIcon color="secondary" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            sx={{
              width: 300,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 2,
            }}
          /> 
      </Box>
      

      {loading ? (
        <p className="loading">🔄 Loading order details...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Created Date</th>
              <th className="border px-4 py-2">Updated Date</th>
              <th className="border px-4 py-2">Check Order Details</th>
              <th className="border px-4 py-2">Check Payment</th>
              <th className="border px-4 py-2">Check Shipment</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId} className="text-center">
                   <td className="border px-4 py-2">{count++}</td>
                  <td className="border px-4 py-2">{order.orderId}</td>
                  <td className="border px-4 py-2">${order.totalPrice}</td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2">
                  {formatDate(order.createdAt)}
                  </td>
                  <td className="border px-4 py-2">
                  {formatDate(order.createdAt)}
                  </td>
                  <td className="border px-4 py-2">
                    <button className="btn btn-primary" onClick={() => navigate(`/userinfo/${user_id}/orders/${order.orderId}/orderDetails?page=1`, {state: {
                      from : location.pathname + location.search
                    }})} ><RemoveRedEyeIcon/> View </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button className="btn btn-primary" onClick={() => navigate(`/userinfo/${user_id}/orders/${order.orderId}/paymentInfo`, {state: {
                      from : location.pathname + location.search
                    }})} ><RemoveRedEyeIcon/> View </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button className="btn btn-primary" onClick={() => navigate(`/userinfo/${user_id}/orders/${order.orderId}/shipmentInfo`, {state: {
                      from : location.pathname + location.search
                    }})} ><RemoveRedEyeIcon/> View </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border px-4 py-2 text-center">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
      )}
      <h2 className="count">Total Orders: {total}</h2>
      <div className="pagination">
        <button className="page-btn" onClick={() => changePage(1)} disabled={currentPage === 1}>
          First
        </button>
        <button className="page-btn" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="current-page">
          Page {currentPage} of {pages}
        </span>
        <button className="page-btn" onClick={() => changePage(currentPage + 1)} disabled={currentPage === pages}>
          Next
        </button>
        <button className="page-btn" onClick={() => changePage(pages)} disabled={currentPage === pages}>
          Last
        </button>
      </div>
    </div>
  )
}

export default ListOrders
