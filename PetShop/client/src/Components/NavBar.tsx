import React, { useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Avatar,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  Grow,
  Divider,
  ListItemIcon,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/Cart';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { logout } from '../features/login/authSlice';
import { authApi, endpoints } from '../Config/APIs';

export const NavBar = () => {
  const { cartItems } = useCart();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timeoutRef = useRef<number | undefined>(undefined);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  setAnchorEl(event.currentTarget);
};

  const handleMouseLeave = () => {
  timeoutRef.current = window.setTimeout(() => {
    setAnchorEl(null);
  }, 200); // delay to allow moving into the menu
}

  const open = Boolean(anchorEl);

   const handleLogOut = async () => {
      dispatch(logout());
      const res = await authApi.post(endpoints['logout'])
      if (res.status === 200) navigate('/login');
    };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="https://res.cloudinary.com/dh5jcbzly/image/upload/v1747206698/DOGSHOP/p8fsrneompfetgd4h0qh.jpg"
              alt="DOGSHOP"
              style={{ height: 48, borderRadius: 8 }}
            />
          </Link>
        </Box>

        {/* Main Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button component={Link} to="/" startIcon={<PetsIcon />} sx={{ textTransform: 'none' }}>
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
          <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ display: 'inline-block' }}
          >
            <IconButton>
              <Avatar alt={user.username} src={user?.avatar} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              TransitionComponent={Grow}
              MenuListProps={{
                onMouseEnter: () => clearTimeout(timeoutRef.current),
                onMouseLeave: handleMouseLeave,
              }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 220,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                },
              }}
            >
              <MenuItem onClick={() => navigate('/userinfo')}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="User Info" />
              </MenuItem>

              <MenuItem onClick={() => navigate(`/userinfo/${user?._id}/orders?page=1`)}>
                <ListItemIcon>
                  <AssignmentIcon fontSize="small" color="info" />
                </ListItemIcon>
                <ListItemText primary="Follow Orders" />
              </MenuItem>

              <MenuItem onClick={() => navigate(`/userinfo/${user?._id}/favoritelist?page=1`)}>
                <ListItemIcon>
                  <FavoriteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Favorites List" />
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogOut}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>

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
