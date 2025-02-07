import { Link } from 'react-router-dom'
import '../Assets/CSS/NavBar.css'
import { useCart } from '../Context/Cart'

export const NavBar = () => {
  const {cartItems} = useCart()
 
  return (
    <>
    <nav className="navbar">
        <Link to={"/"}>Home</Link>
        <Link to={"/dogs"}>Dogs Page</Link>
        <Link to={"/checkout"}>
          Checkout {cartItems.length > 0 && `(${cartItems.length})`}
        </Link>
    </nav>
    </>
  )
}
