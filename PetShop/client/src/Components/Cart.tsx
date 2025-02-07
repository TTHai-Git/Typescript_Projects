import { useCart } from '../Context/Cart'
import '../Assets/CSS/Cart.css'

export const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, checkOutFromCart } = useCart()
  
  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

  const handleIncreaseQuantity = (id: number) => {
    increaseQuantity(id)
  }

  const handleDecreaseQuantity = (id: number) => {
    decreaseQuantity(id)
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <h3>Tên chó: {item.name}</h3>
                  <p>Chủng loại: {item.breed}</p>
                  <p>Mô tả: {item.description}</p>
                  <p>Số Lượng: {item.quantity}</p>
                  <p className="price">Thành tiền: ${Number(item.price) * Number(item.quantity)}</p>
                </div>
                <button
                  className="increase-btn"
                  onClick={() => handleIncreaseQuantity(item.id)}
                >
                  +
                </button>

                <button
                  className="decrease-btn"
                  onClick={() => handleDecreaseQuantity(item.id)}
                >
                  -
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

               

              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total">
              <span>Tổng thành tiền:</span>
              {total > 0 && <span>${total}</span>}
            </div>
            <button 
              className="checkout-btn"
              onClick={checkOutFromCart}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
