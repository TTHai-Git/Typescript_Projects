import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import '../Assets/CSS/ListOrderDetails.css';
import OrderDetails from '../Interface/OrderDetails';
import { Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export const ListOrderDetails = () => {
  const { order_id } = useParams();
  const { user_id } = useParams()
  const { page } = useParams<{ page?: string }>(); // Get page number from URL
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const [current, setCurrent] = useState<number>(Number(page) || 1);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  let [numericalOrder, setNumericalOrder] = useState<number>(1)

  const getListOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/v1/orders/${order_id}/orderDetails/${current}`);
      
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

  const handleBack = () => {
    navigate(`/userinfo/${user_id}/orders/1`);
  };

  useEffect(() => {
    getListOrderDetails();
  }, [current]);

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= pages) {
      setCurrent(newPage); // Update state to trigger `useEffect()`
      navigate(`/userinfo/${user_id}/orders/${order_id}/orderDetails/${newPage}`);
    }
  };

  return (
    <div className="container">
      <Button startIcon={<ArrowBack />} onClick={handleBack} variant="outlined" color="primary">
        Back to Orders
      </Button>
      <h1 className="title">🐶 DANH SÁCH CHI TIẾT CỦA ĐƠN ĐẶT HÀNG</h1>      

      {loading ? (
        <p className="loading">🔄 Loading order details...</p>
      ) : orderDetails.length > 0 ? (
        <div className="table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                {/* <th>Breed</th> */}
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Note</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((orderdetail) => (
                <tr key={orderdetail.orderId}>
                  <td>{numericalOrder++}</td>
                  <td>
                    <img src={orderdetail.product.imageUrl} alt={orderdetail.product.name} className="dog-image" />
                  </td>
                  <td>{orderdetail.product.name}</td>
                  <td>{orderdetail.category.name}</td>
                  {/* <td>{order.product.breed}</td> */}
                  <td>{orderdetail.product.description}</td>
                  <td>{orderdetail.quantity}</td>
                  <td>${orderdetail.product.price}</td>
                  <td>
                    {orderdetail.note?.split(' - ').map((line, index) => (
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
        <p className="no-data">❌ No order details found.</p>
      )}
      <h2 className='count'>Tổng Số Con Chó Trong Đơn Hàng Là {orderDetails.length}</h2>
      <div className="pagination">
        <button className="page-btn" onClick={() => changePage(1)} disabled={current === 1}>
          First
        </button>
        <button className="page-btn" onClick={() => changePage(current - 1)} disabled={current === 1}>
          Previous
        </button>
        <span className="current-page">
          Page {current} of {pages}
        </span>
        <button className="page-btn" onClick={() => changePage(current + 1)} disabled={current === pages}>
          Next
        </button>
        <button className="page-btn" onClick={() => changePage(pages)} disabled={current === pages}>
          Last
        </button>
      </div>
      
    </div>
    
    
  );
};

export default ListOrderDetails;
