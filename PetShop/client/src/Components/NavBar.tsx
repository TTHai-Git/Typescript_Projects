import { Link } from 'react-router-dom'
import '../Assets/CSS/NavBar.css'
import { useCart } from '../Context/Cart'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

export const NavBar = () => {
  const {cartItems} = useCart()
  const user = useSelector((state: RootState) => state.auth.user);
 
  return (
    <>
    <nav className="navbar">
        <Link to={"/"}>Home</Link>
        <Link to={"/dogs"}>Dogs Page</Link>
        <Link to={"/checkout"}>
          Checkout {cartItems.length > 0 && `(${cartItems.length})`}
        </Link>
        {user ? <><Link to={"/userinfo"} >User Account</Link></> : <><Link to={"/login"} >Login</Link></>}
        
        {!user ? <Link to={"/register"}>Register</Link> : <></>}
    </nav>
    </>
  )
}
