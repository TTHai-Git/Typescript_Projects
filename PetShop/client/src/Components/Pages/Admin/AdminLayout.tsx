import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PetsIcon from '@mui/icons-material/Pets';
import CategoryIcon from '@mui/icons-material/Category';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const drawerWidth = 260;

interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: t("Dashboard"), icon: <DashboardIcon />, path: "/admin-dashboard" },
    { label: t("Manage Brands"), icon: <LocalOfferIcon />, path: "/admin-dashboard/brands" },
    { label: t("Manage Breeds"), icon: <PetsIcon />, path: "/admin-dashboard/breeds" },
    { label: t("Manage Categories"), icon: <CategoryIcon />, path: "/admin-dashboard/categories" },
    { label: t("Manage Comments"), icon: <ChatBubbleOutlineIcon />, path: "/admin-dashboard/comments" },
    { label: t("Manage Comment Details"), icon: <CommentIcon />, path: "/admin-dashboard/commentDetails" },
    { label: t("Manage Favorites"), icon: <FavoriteBorderIcon />, path: "/admin-dashboard/favorites" },
    { label: t("Manage Orders"), icon: <ShoppingCartIcon />, path: "/admin-dashboard/orders" },
    { label: t("Manage Order Details"), icon: <ReceiptLongIcon />, path: "/admin-dashboard/orderDetails" },
    { label: t("Manage Payments"), icon: <PaymentIcon />, path: "/admin-dashboard/payments" },
    { label: t("Manage Products"), icon: <Inventory2Icon />, path: "/admin-dashboard/products" },
    { label: t("Manage Roles"), icon: <AdminPanelSettingsIcon />, path: "/admin-dashboard/roles" },
    { label: t("Manage Shipments"), icon: <LocalShippingIcon />, path: "/admin-dashboard/shipments" },
    { label: t("Manage Users"), icon: <PeopleIcon />, path: "/admin-dashboard/users" },
    { label: t("Manage Vendors"), icon: <StorefrontIcon />, path: "/admin-dashboard/vendors" },
    { label: t("Manage Vouchers"), icon: <CardGiftcardIcon />, path: "/admin-dashboard/vouchers" },
  ];

  const drawer = (
    <Box sx={{ bgcolor: '#1e1e2d', color: '#fff', height: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminPanelSettingsIcon />
          {t("DogShop Admin")}
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 2, pt: 2, pb: 4, height: 'calc(100% - 80px)', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: isActive ? '#fff' : '#a2a3b7',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '80vh', bgcolor: '#f5f8fa' }}>
      {/* App Bar for mobile */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#fff',
          color: '#333',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          display: { md: 'none' } 
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight={600}>
            {t("Dashboard")}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 0 } 
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
