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
import { AdminPanelSettings } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationList from './NotificationList';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { cartItems } = useCart();
  const {notificationItems} = useNotification()
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const timeoutRef = useRef<number | undefined>(undefined);

  // avatar dropdown state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // notifications dropdown state
  const [anchorElNotification, setAnchorElNotification] = useState<null | HTMLElement>(null);

  // avatar handlers
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setAnchorEl(null);
    }, 200);
  };

  // notification handlers
  const handleNotifEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotifLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setAnchorElNotification(null);
    }, 200);
  };

  const open = Boolean(anchorEl);
  const openNotif = Boolean(anchorElNotification);

  const handleLogOut = async () => {
    dispatch(logout());
    const res = await authApi.post(endpoints.logout);
    if (res.status === 200) navigate('/login');
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
  };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}${process.env.REACT_APP_DIR_CLOUD}v1747206698/${process.env.REACT_APP_FOLDER_CLOUD}/p8fsrneompfetgd4h0qh.jpg`}
              alt="DOGSHOP"
              style={{ height: 48, borderRadius: 8 }}
            />
          </Link>
        </Box>

        {/* Main Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button component={Link} to="/" startIcon={<PetsIcon />} sx={{ textTransform: 'none' }}>
            {t("Introduction")}
          </Button>
          <Button
            component={Link}
            to="/products"
            startIcon={<HomeIcon />}
            sx={{ textTransform: 'none' }}
          >
            {t("Home")}
          </Button>
        </Box>

        {/* Action Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Cart */}
          <IconButton component={Link} to="/cart" color="primary">
            <Badge badgeContent={cartItems.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
            {t("Cart")}
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}${process.env.REACT_APP_DIR_CLOUD}v1757477860/${process.env.REACT_APP_FOLDER_CLOUD}/Flag_of_the_United_States.svg_pc3v3s.png`}
              alt="English"
              width={28}
              style={{ cursor: "pointer", border: i18n.language === "en" ? "2px solid #1976d2" : "none" }}
              onClick={() => changeLanguage("en")}
            />
            <img
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}${process.env.REACT_APP_DIR_CLOUD}v1757477859/${process.env.REACT_APP_FOLDER_CLOUD}/Flag_of_Vietnam.svg_zgxhdt.png`}
              alt="Vietnamese"
              width={28}
              style={{ cursor: "pointer", border: i18n.language === "vi" ? "2px solid #1976d2" : "none" }}
              onClick={() => changeLanguage("vi")}
            />
          </Box>


          {user && user.isAuthenticated ? (
            <>
              {/* Notifications */}
              <Box
                onMouseEnter={handleNotifEnter}
                onMouseLeave={handleNotifLeave}
                sx={{ display: 'inline-block' }}
              >
                <IconButton color="primary">
                  <Badge badgeContent={notificationItems.filter((prevItems) => {
                    return prevItems.isRead === false
                  }).length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <Menu
                  anchorEl={anchorElNotification}
                  open={openNotif}
                  onClose={() => setAnchorElNotification(null)}
                  TransitionComponent={Grow}
                  MenuListProps={{
                    onMouseEnter: () => clearTimeout(timeoutRef.current),
                    onMouseLeave: handleNotifLeave,
                  }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      minWidth: 320,
                      maxHeight: 400,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      backgroundColor: '#fff',
                      overflowY: 'auto',
                    },
                  }}
                >
                  <NotificationList />
                </Menu>
              </Box>

              {/* User Avatar */}
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
                    <ListItemText primary={t("User Info")} />
                  </MenuItem>

                  <MenuItem onClick={() => navigate(`/userinfo/${user?._id}/orders?page=1`)}>
                    <ListItemIcon>
                      <AssignmentIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <ListItemText primary={t("Follow Orders")} />
                  </MenuItem>

                  <MenuItem onClick={() => navigate(`/userinfo/${user?._id}/favoritelist?page=1`)}>
                    <ListItemIcon>
                      <FavoriteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary={t("Favorites List")} />
                  </MenuItem>

                  <MenuItem onClick={() => navigate(`/admin-dashboard`)}>
                    <ListItemIcon>
                      <AdminPanelSettings fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary={t("Dashboard Management")}/>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleLogOut}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText primary={t("Logout")}/>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{ textTransform: 'none' }}
              >
                {t("Login")}
              </Button>
              <Button
                component={Link}
                to="/register"
                startIcon={<PersonAddIcon />}
                sx={{ textTransform: 'none' }}
              >
                {t("Register")}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar