// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import '../Assets/CSS/ListOrderDetails.css';
import OrderDetails from '../Interface/OrderDetails';
import { authApi, endpoints } from '../Config/APIs';
import { useSearchParams } from 'react-router-dom';

export const ListOrderDetails = () => {

  const { order_id } = useParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()


  let [numericalOrder] = useState<number>(1)

  const getListOrderDetails = async () => {
    setLoading(true);
    try {
      // const response = await axios.get(`/v1/orders/${order_id}/orderDetails/${current}`);
      const query = new URLSearchParams()
      query.append('page', currentPage.toString())
      const response = await authApi.get(endpoints.getOrderDetails(order_id,currentPage))
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
    if (newPage > 0 && newPage <= pages) {
      const params: any = {page: newPage.toString()}
      setSearchParams(params)
    }
  };

  return (
    <div className="container">
      <h1 className="title">🐶 Detailed List Of Orders</h1>      

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
                <th>Brand</th>
                <th>Vendor</th>
      
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Note</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((orderdetail) => (
                <tr key={orderdetail.product._id}>
                  <td>{numericalOrder++}</td>
                  <td>
                    <img src={orderdetail.product.imageUrl} alt={orderdetail.product.name} className="dog-image" />
                  </td>
                  <td>{orderdetail.product.name}</td>
                  <td>{orderdetail.product.category.name}</td>
                  <td>{orderdetail.product.brand.name}</td>
                  <td>{orderdetail.product.vendor.name}</td>
                 
                  <td>{orderdetail.product.description}</td>
                  <td>{orderdetail.quantity}</td>
                  <td>${orderdetail.product.price.toLocaleString()} VND</td>
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
      <h2 className='count'>Total Number of Products on Page {currentPage} Currently in Order is {orderDetails.length}</h2>
      <h2 className='count'>Total Number of Products in Order Is {total}</h2>
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
      <h2 className='count'>Total Number of Pages Is {pages}</h2>
      
    </div>
    
    
  );
};

export default ListOrderDetails;
