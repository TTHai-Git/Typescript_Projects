// import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import '../Assets/CSS/ListOrders.css';
import formatDate from '../Convert/formatDate';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Order from '../Interface/Orders';
import { authApi, endpoints } from '../Config/APIs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Autocomplete, Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { ArrowBack, Search } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import SortIcon from '@mui/icons-material/Sort';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const ListOrders = () => {
  const user = useSelector((state: RootState)=> state.auth.user)
  const { user_id } = useParams()
  const { page } = useParams<{ page?: string }>(); // Get page number from URL
  const [orders, setOrders] = useState<Order[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
 
  const [statusOrders, setStatusOrders] = useState<string>()
  const currentPage = parseInt(searchParams.get('page') || '1')
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('Oldest')
  const [loading, setLoading] = useState(false)
  let [count] = useState<number>(1)
  const navigate = useNavigate()
  
  const {t} = useTranslation()

  const options = [
    { label: t('Increasing By Price'), id: 'price_asc' },
    { label: t('Decrease By Price'), id: 'price_desc' },
    { label: t('Latest'), id: 'latest' },
    { label: t('Oldest'), id: 'oldest' },
    { label: t("None"), id: 'none'}
  ];

  const statusOptions = [
    { label: t('Pending'), id: 'Pending' },
    { label: t('Confirmed'), id: 'Confirmed' },
    { label: t('Processing'), id: 'Processing' },
    { label: t('Shipped'), id: 'Shipped' },
    { label: t('InTransit'), id: 'InTransit' },
    { label: t('Delivered'), id: 'Delivered' },
    { label: t('Cancelled'), id: 'Cancelled' },
    { label: t('Returned'), id: 'Returned' },
    { label: t('Failed'), id: 'Failed' },
    { label: t('Refunded'), id: 'Refunded' },
    { label: t('All'), id: 'all' },
    
  ];

  const getListOrders = async () => {
    setLoading(true)
    try {
      // const response = await axios.get(`/v1/orders/${user_id}/${current}`)
      const query = new URLSearchParams(searchParams)
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
      setOrders([])
      setPages(0)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    
    const newSearch = searchParams.get('search') || '';
    const newSort   = searchParams.get('sort')   || '';
    const newStatus = searchParams.get('status') || '';

    setSearchTerm(newSearch);
    setSortBy(newSort);
    setStatusOrders(newStatus);
  }, [searchParams]);

  useEffect(() => {
    
    getListOrders();
  }, [searchParams]);


  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= pages) {
      const params: any = {page: newPage.toString()}
      if(sortBy) params.sort = sortBy.toString()
      if (statusOrders) params.status = statusOrders.toString()
      if (searchTerm) params.search = searchTerm.trim().toString()
      setSearchParams(params)
    }
  };


  return (
    <div className="container mx-auto p-4">
      <Button
        variant="contained"
        color="inherit"
        size="large"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ borderRadius: "30px", px: 4, mb: 4, textTransform: 'none', fontWeight: 'bold', boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}
      >
        {t("Go Back")}
      </Button>
      <h1 className="text-3xl font-extrabold mb-6 text-[#3e2723]">{t("List Orders")}</h1>

      
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* 🔍 Search Bar */}
        <TextField
          label={t("Search By Order ID")}
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');
            params.set('search', e.target.value.trim());
            setSearchParams(params);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // ✅ merge existing params
              const params = new URLSearchParams(searchParams);
              params.set('page', '1');
              params.set('search', searchTerm.trim());
              setSearchParams(params);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", "1");
                    if (searchTerm.trim()) params.set("search", searchTerm.trim());
                    else params.delete("search");
                    setSearchParams(params);
                  }}
                >
                <SearchIcon color="primary"  />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label={t("Clear search")}
                  onClick={() => {
                    setSearchTerm("");                         // ✅ clear the input
                    const params = new URLSearchParams(searchParams);
                    params.delete("search");                   // ✅ remove query param
                    params.set("page", "1");                   // optional: reset page
                    setSearchParams(params);
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            width: '100%',
            maxWidth: 400,
            alignSelf: 'center',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 2,
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {/* Sort */}
            <Autocomplete
              disablePortal
              options={options}
              value={options.find((opt) => opt.id.toString() === sortBy) || null}
              onChange={(event, newValue) => {
                const selectedSort = newValue?.id.toString() || "";

                const params = new URLSearchParams(searchParams);
                params.set("page", "1");
                if (selectedSort) params.set("sort", selectedSort);
                else params.delete("sort");

                setSearchParams(params);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Sort By")}
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
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 2,
              }}
            />
            {/* Filter Status Of Order */}
            <Autocomplete
              disablePortal
              options={statusOptions}
              value={statusOptions.find((opt) => opt.id.toString() === statusOrders) || null}
              onChange={(event, newValue) => {
                const selectedStatus = newValue?.id.toString() || "";

                // ✅ clone current params
                const params = new URLSearchParams(searchParams);

                // ✅ update values
                params.set("page", "1");
                if (selectedStatus) params.set("status", selectedStatus);
                else params.delete("status"); // remove if cleared

                setSearchParams(params);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Filter By Status Orders")}
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
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 2,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><Box className="loading">🔄 {t("Loading order details...")}</Box></Box>
      ) : (
        <Box sx={{ bgcolor: '#fff', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #f1f5f9', mb: 4 }}>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#fffbf7', borderBottom: '2px solid #ffe8cc' }}>
                  {["#", "Order ID", "Total Price", "Status", "Date", "Details", "Payment", "Shipment"].map((head, idx) => (
                    <th key={idx} style={{ padding: '16px', color: '#5d4037', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {t(head)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#fffcf9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '16px', color: '#64748b' }}>{count + index}</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#3e2723' }}>{order._id.substring(0, 8)}...</td>
                      <td style={{ padding: '16px', fontWeight: 800, color: '#ff9800' }}>${order.totalPrice}</td>
                      <td style={{ padding: '16px' }}>
                        <Box sx={{ display: 'inline-block', px: 2, py: 0.5, borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, bgcolor: 'rgba(255,152,0,0.1)', color: '#f57c00' }}>
                          {t(order.status)}
                        </Box>
                      </td>
                      <td style={{ padding: '16px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Button
                          variant="outlined" size="small"
                          onClick={() => navigate(`/userinfo/${user_id}/orders/${order._id}/orderDetails?page=${1}`)}
                          sx={{ textTransform: 'none', borderRadius: '20px', color: '#4caf50', borderColor: '#4caf50', '&:hover': { bgcolor: '#e8f5e9' } }}
                        >
                           {t("View")}
                        </Button>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Button
                          variant="outlined" size="small"
                          onClick={() => navigate(`/userinfo/${user_id}/orders/${order._id}/paymentInfo`)}
                          sx={{ textTransform: 'none', borderRadius: '20px', color: '#2196f3', borderColor: '#2196f3', '&:hover': { bgcolor: '#e3f2fd' } }}
                        >
                          {t("Payment")}
                        </Button>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Button
                          variant="outlined" size="small"
                          onClick={() => navigate(`/userinfo/${user_id}/orders/${order._id}/shipmentInfo`)}
                          sx={{ textTransform: 'none', borderRadius: '20px', color: '#9c27b0', borderColor: '#9c27b0', '&:hover': { bgcolor: '#f3e5f5' } }}
                        >
                          {t("Shipment")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}
                    >
                      {t("No orders available")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Box>
      )}

      {/* Footer */}
      <h2 className="count">
        {t("Total Orders")}: {total}
      </h2>
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => changePage(1)}
          disabled={currentPage === 1}
        >
          {t("First")}
        </button>
        <button
          className="page-btn"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {t("Previous")}
        </button>
        <span className="current-page">
          {t("Page")} {currentPage} {t("of")} {pages}
        </span>
        <button
          className="page-btn"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === pages}
        >
          {t("Next")}
        </button>
        <button
          className="page-btn"
          onClick={() => changePage(pages)}
          disabled={currentPage === pages}
        >
          {t("Last")}
        </button>
      </div>
    </div>
  );
}

export default ListOrders
