// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import '../Assets/CSS/ListOrderDetails.css';
import OrderDetails from '../Interface/OrderDetails';
import { authApi, endpoints } from '../Config/APIs';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Button, Stack, Typography, Box, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, CircularProgress 
} from '@mui/material';
import { ArrowBack, Category, Storefront, LocalOffer, InfoOutlined } from '@mui/icons-material';

export const ListOrderDetails = () => {
  const { user_id, order_id } = useParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const {t} = useTranslation()
  let [numericalOrder] = useState<number>(1)

  const getListOrderDetails = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(searchParams)
      const response = await authApi.get(`${endpoints[`getOrderDetails`](order_id)}?${query.toString()}`)
      if (response.status === 200) {
        setOrderDetails(response.data.results);
        setPages(response.data.pages)
        setTotal(response.data.total)
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListOrderDetails();
  }, [searchParams.toString()]);

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      const params: any = {page: newPage.toString()}
      setSearchParams(params)
    }
  };

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
        <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723' }}>
          🐶 {t("Detailed List Of Orders")}
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={10}>
          <CircularProgress sx={{ color: '#ff9800' }} />
          <Typography variant="h6" sx={{ ml: 2, color: '#ff9800', fontWeight: 'bold' }}>
            {t("Loading order details...")}
          </Typography>
        </Box>
      ) : orderDetails.length > 0 ? (
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ 
            borderRadius: '24px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)', 
            border: '1px solid #f0f0f0', 
            overflow: 'hidden',
            mb: 4
          }}
        >
          <Table sx={{ minWidth: 1000 }} aria-label="order details table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#fdfbf7' }}>
                <TableCell width="50" align="center" sx={{ fontWeight: 800, color: '#555', borderBottom: '2px solid #ffe8cc' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#555', borderBottom: '2px solid #ffe8cc' }}>{t("Product")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#555', borderBottom: '2px solid #ffe8cc' }}>{t("Category")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#555', borderBottom: '2px solid #ffe8cc' }}>{t("Brand & Vendor")}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: '#555', borderBottom: '2px solid #ffe8cc' }}>{t("Quantity")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#555', borderBottom: '2px solid #ffe8cc' }}>{t("Price")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#555', borderBottom: '2px solid #ffe8cc' }}>{t("Total Price")}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#555', borderBottom: '2px solid #ffe8cc' }}>{t("Note")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails.map((orderdetail, index) => (
                <TableRow key={orderdetail.product._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s' }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#888' }}>{numericalOrder + index}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        variant="rounded" 
                        src={orderdetail.product.imageUrl || (orderdetail.product as any).images?.[0]} 
                        alt={orderdetail.product.name} 
                        sx={{ width: 64, height: 64, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#3e2723', mb: 0.5, maxWidth: 200, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {orderdetail.product.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                          <InfoOutlined sx={{ fontSize: 14, mr: 0.5 }} />
                          {orderdetail.product.description?.substring(0, 30)}...
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Category sx={{ fontSize: 16, color: '#ffbd59', mr: 1 }} />
                      <Typography variant="body2" fontWeight="600" sx={{ color: '#555' }}>
                        {t(`${orderdetail.product.category.name}`)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Typography variant="body2" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                        <LocalOffer sx={{ fontSize: 14, color: '#4caf50', mr: 0.5 }} /> {t(`${orderdetail.product.brand.name}`)}
                      </Typography>
                      <Typography variant="caption" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', color: '#888' }}>
                        <Storefront sx={{ fontSize: 14, color: '#29b6f6', mr: 0.5 }} /> {t(`${orderdetail.product.vendor.name}`)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" fontWeight="800" sx={{ color: '#3e2723' }}>
                      x{orderdetail.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="600" sx={{ color: '#888' }}>
                      {orderdetail.product.price.toLocaleString()} ₫
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="900" sx={{ color: '#ff9800' }}>
                      {orderdetail.totalPrice.toLocaleString()} ₫
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {orderdetail.note ? (
                      <Box sx={{ bgcolor: '#fffbf7', p: 1, borderRadius: '8px', border: '1px dashed #ffe8cc', fontSize: '0.8rem', color: '#555' }}>
                        {orderdetail.note?.split(" - ").map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '24px', border: '1px dashed #ccc', bgcolor: '#fafafa' }}>
           <Typography variant="h6" color="text.secondary">
             ❌ {t("No order details found.")}
           </Typography>
        </Paper>
      )}

      {orderDetails.length > 0 && (
        <Box sx={{ mt: 2, mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: '#e3f2fd', color: '#1565c0', display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3 }}>
              <Typography variant="caption" fontWeight="bold" textTransform="uppercase">{t("Products on Page")}</Typography>
              <Typography variant="h5" fontWeight="900">{orderDetails.length}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: '#fff3e0', color: '#e65100', display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3 }}>
              <Typography variant="caption" fontWeight="bold" textTransform="uppercase">{t("Total Products")}</Typography>
              <Typography variant="h5" fontWeight="900">{total}</Typography>
            </Paper>
          </Box>

          {/* Pagination */}
          {pages > 1 && (
            <Paper elevation={0} sx={{ p: 1, borderRadius: '30px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button size="small" variant="text" onClick={() => changePage(1)} disabled={currentPage === 1} sx={{ borderRadius: '20px', minWidth: 'auto', px: 2, color: '#555', fontWeight: 'bold' }}>{t("First")}</Button>
              <Button size="small" variant="contained" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} sx={{ borderRadius: '20px', bgcolor: '#f5f5f5', color: '#333', boxShadow: 'none', '&:hover': { bgcolor: '#e0e0e0', boxShadow: 'none' }, minWidth: 'auto', px: 2 }}>{t("Previous")}</Button>
              <Typography variant="body2" fontWeight="bold" sx={{ px: 2, color: '#ff9800' }}>{currentPage} / {pages}</Typography>
              <Button size="small" variant="contained" onClick={() => changePage(currentPage + 1)} disabled={currentPage === pages} sx={{ borderRadius: '20px', bgcolor: '#ff9800', color: '#fff', boxShadow: 'none', '&:hover': { bgcolor: '#f57c00', boxShadow: 'none' }, minWidth: 'auto', px: 2 }}>{t("Next")}</Button>
              <Button size="small" variant="text" onClick={() => changePage(pages)} disabled={currentPage === pages} sx={{ borderRadius: '20px', minWidth: 'auto', px: 2, color: '#555', fontWeight: 'bold' }}>{t("Last")}</Button>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );

};

export default ListOrderDetails;
