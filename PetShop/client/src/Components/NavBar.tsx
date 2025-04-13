import { Link, useNavigate } from 'react-router-dom'
import '../Assets/CSS/NavBar.css'
import { useCart } from '../Context/Cart'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Avatar, Badge } from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const NavBar = () => {
  const {cartItems} = useCart()
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();


  return (
    <>
    <nav className="navbar">
        <Link to={"/"}> <PetsIcon fontSize="large" /> Introduction </Link>
        <Link to={"/products"}><HomeIcon fontSize='large'/> Home </Link>
        <Link to={"/checkout"}>
        <Badge badgeContent={cartItems.length > 0 ? `${cartItems.length}`: 0} color="primary" >
        <ShoppingCartIcon fontSize='large'/> 
          </Badge> 
        </Link>
        {/* {user && user.isAuthenticated ? <><Link to={"/userinfo"} >Xin chào {user.username} <Avatar alt="Remy Sharp" src={user?.avatar} /></Link></> : <><Link to={"/login"} >Login</Link></>} */}
        {user && user.isAuthenticated ? <Avatar alt="Remy Sharp" src={user?.avatar} onClick={() => navigate('/userinfo')} />: <Link to={'/login'}><LoginIcon fontSize='large'/> Login </Link>}
        
        {!user ? <Link to={"/register"}><PersonAddIcon fontSize='large'/> Register </Link> : <></>}
    </nav>
    </>
  )
}
