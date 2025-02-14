import { useCart } from '../Context/Cart'
import '../Assets/CSS/Cart.css'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useState } from 'react'

export const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, checkOutFromCart, caculateTotalOfCart } = useCart()
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false)
  

  const handleIncreaseQuantity = (_id: string) => {
    increaseQuantity(_id)
  }

  const handleDecreaseQuantity = (_id: string) => {
    decreaseQuantity(_id)
  }

  const handleMakeOrder = async () => {
    setLoading(true)
    try {
      const res_1 = await axios.post('/v1/orders', {
        user: user?._id,
        totalPrice: caculateTotalOfCart()
      })
      const data: any[] = []
      cartItems.forEach(cartItem => {
        data.push({
          "order": res_1.data._id,
          "dog": cartItem._id,
          "quantity": cartItem.quantity,
          "price": cartItem.price
        })
      });
      if (res_1.status === 201){
        const res_2 = await axios.post('/v1/orderDetails', {
          data
        })
        if (res_2.status === 201) {
          checkOutFromCart()
        }
      }
    } catch {
      console.log("Error")
    } finally {
      setLoading(false)
    }
  }


  const navigate = useNavigate();

  return (
    <div className="cart-container">
      {loading && <div className="loading-spinner"></div>}
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <h3>Tên chó: {item.name}</h3>
                  <p>Chủng loại: {item.breed}</p>
                  <p>Mô tả: {item.description}</p>
                  <p>Đơn giá: ${item.price}</p>
                  <p>Số Lượng: {item.quantity}</p>
                  <p className="price">Thành tiền: ${Number(item.price) * Number(item.quantity)}</p>
                </div>
                <button
                  className="increase-btn"
                  onClick={() => handleIncreaseQuantity(item._id)}
                >
                  +
                </button>

                <button
                  className="decrease-btn"
                  onClick={() => handleDecreaseQuantity(item._id)}
                >
                  -
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>


              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total">
              <span>Tổng thành tiền:</span>
              {caculateTotalOfCart().valueOf() > 0 && <span>${caculateTotalOfCart().valueOf()}</span>}
            </div>
            {user?.isAuthenticated ? <>
              <button 
              className="checkout-btn"
              onClick={handleMakeOrder}
            >
              Checkout
            </button>
            </> : <>
              <div>
              <div><p>Đăng nhập để thanh toán: </p></div>
              <div>
                <button
                  className="login-btn"
                  onClick={() => navigate('/login', { state: { from: '/cart' } })}
                >
                  Đăng nhập
                </button>
              
              </div>

              </div>
              
            </>}
            
          </div>
        </>
      )}
    </div>
  )
}
