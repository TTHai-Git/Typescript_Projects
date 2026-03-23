import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs as MUIBreadcrumbs, Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const routeNameMap: { [key: string]: string } = {
  "": "Home",
  shipment: "Shipment",
  checkout: "Checkout",
  cart: "Cart",
  shipmentInfo: "Shipment Infomation",
  login: "Login",
  "generate-otp": "Generate OTP",
  "reset-password": "Reset Password",
  register: "Register",
  userinfo: "User Infomation",
  orders: "Orders",
  orderDetails: "Order Details",
  paymentInfo: "Payment Infomation",
  favoritelist: "Favorite List",
  products: "Products",
  food: "Food",
  clothes: "Clothes",
  accessory: "Accessory",
  dog: "Dog",
  comments: "Comments",
  updateCommentForm: "Update Comment Form",
  VNPAY: "VNPAY Payment Return",
  PAYOS: "PAYOS Payment Return",
  "admin-dashboard": "Admin Dashboard"
};

function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;

  const pathnames = pathname.split("/").filter(Boolean);

  let accumulatedPath = "";

  // Helper function to detect if segment looks like an ID (UUID, numeric, etc)
  function isIdSegment(segment: string) {
    // Adjust this regex if you want
    return /^[0-9a-fA-F-]{4,}$/.test(segment);
  }

  

  return (
    <Box sx={{ margin: { xs: "1rem 1rem", md: "1.5rem 3rem" }, display: 'flex', alignItems: 'center', bgcolor: '#fffbf7', p: 1.5, borderRadius: '20px', border: '1px solid #ffe8cc', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: 'fit-content' }}>
      <MUIBreadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: '#ffbd59' }} />} aria-label="breadcrumb">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: '#ff9800', fontWeight: 800 }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        {pathnames.map((segment, index) => {
          accumulatedPath += `/${segment}`;

          if (isIdSegment(segment)) {
            return null;
          }

          const name = routeNameMap[segment] || segment;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <Typography key={accumulatedPath} color="text.primary" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#3e2723' }}>
              {name}
            </Typography>
          ) : (
            <Link key={accumulatedPath} to={accumulatedPath} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: '#8d6e63', fontWeight: 600, transition: 'all 0.2s' }}>
              {name}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
}

export default Breadcrumbs;
