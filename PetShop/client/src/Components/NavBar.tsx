import { AppBar, Toolbar, Box, IconButton, Badge, Avatar, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/Cart';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const NavBar = () => {
  const { cartItems } = useCart();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="https://res.cloudinary.com/dh5jcbzly/image/upload/v1745474748/LogoDogShop_qqjit2.jpg"
              alt="DOGSHOP"
              style={{ height: 48, borderRadius: 8 }}
            />
          </Link>
        </Box>

        {/* Main Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<PetsIcon />}
            sx={{ textTransform: 'none' }}
          >
            Introduction
          </Button>
          <Button
            component={Link}
            to="/products"
            startIcon={<HomeIcon />}
            sx={{ textTransform: 'none' }}
          >
            Home
          </Button>
        </Box>

        {/* Action Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to="/checkout" color="primary">
            <Badge badgeContent={cartItems.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
            Cart
          </IconButton>

          {user && user.isAuthenticated ? (
            <IconButton onClick={() => navigate('/userinfo')}>
              <Avatar alt={user.username} src={user?.avatar} />
            </IconButton>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                startIcon={<PersonAddIcon />}
                sx={{ textTransform: 'none' }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
