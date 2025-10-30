// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import '../Assets/CSS/ListOrderDetails.css';
import OrderDetails from '../Interface/OrderDetails';
import { authApi, endpoints } from '../Config/APIs';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

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
  <div className="container">
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
    <h1 className="title">🐶 {t("Detailed List Of Orders")}</h1>      

    {loading ? (
      <p className="loading">🔄 {t("Loading order details...")}</p>
    ) : orderDetails.length > 0 ? (
      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("Image")}</th>
              <th>{t("Product")}</th>
              <th>{t("Category")}</th>
              <th>{t("Brand")}</th>
              <th>{t("Vendor")}</th>
              <th>{t("Description")}</th>
              <th>{t("Quantity")}</th>
              <th>{t("Price")}</th>
              <th>{t("Note")}</th>
              <th>{t("Total Price")}</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((orderdetail) => (
              <tr key={orderdetail.product._id}>
                <td>{numericalOrder++}</td>
                <td>
                  <img
                    src={orderdetail.product.imageUrl}
                    alt={orderdetail.product.name}
                    className="dog-image"
                  />
                </td>
                <td>{orderdetail.product.name}</td>
                <td>{t(`${orderdetail.product.category.name}`)}</td>
                <td>{t(`${orderdetail.product.brand.name}`)}</td>
                <td>{t(`${orderdetail.product.vendor.name}`)}</td>

                <td>{orderdetail.product.description}</td>
                <td>{orderdetail.quantity}</td>
                <td>
                  {orderdetail.product.price.toLocaleString()} VND
                </td>
                <td>
                  {orderdetail.note?.split(" - ").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </td>
                <td className="total-price">${orderdetail.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="no-data">❌ {t("No order details found.")}</p>
    )}

    <h2 className="count">
      {t("Total Number of Products on Page")} {currentPage}{" "}
      {t("Currently in Order is")} {orderDetails.length}
    </h2>
    <h2 className="count">
      {t("Total Number of Products in Order Is")} {total}
    </h2>

    {/* Pagination */}
    <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
      <Button onClick={() => changePage(1)} disabled={currentPage === 1}>{t("First")}</Button>
      <Button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>{t("Previous")}</Button>
      <Typography variant="body1">Page {currentPage} of {pages}</Typography>
      <Button onClick={() => changePage(currentPage + 1)} disabled={currentPage === pages}>{t("Next")}</Button>
      <Button onClick={() => changePage(pages)} disabled={currentPage === pages}>{t("Last")}</Button>
    </Stack>

    <h2 className="count">
      {t("Total Number of Pages Is")} {pages}
    </h2>
  </div>
);

};

export default ListOrderDetails;
