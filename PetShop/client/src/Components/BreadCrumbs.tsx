import React from "react";
import { Link, useLocation } from "react-router-dom";

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
    <nav aria-label="breadcrumb" style={{ margin: "1rem 0" }}>
      <ol
        style={{
          listStyle: "none",
          display: "flex",
          gap: "0.5rem",
          padding: 0,
          flexWrap: "wrap",
        }}
      >
        <li>
          <Link to="/">Home</Link>
          {pathnames.length > 0 && <span> / </span>}
        </li>

        {pathnames.map((segment, index) => {
          accumulatedPath += `/${segment}`;

          // If segment looks like an ID, **skip displaying it** (show nothing)
          if (isIdSegment(segment)) {
            // Just don't render anything for this breadcrumb segment
            return null;
          }

          // Show mapped name if available, else segment text
          const name = routeNameMap[segment] || segment;

          const isLast = index === pathnames.length - 1;

          return (
            <li key={accumulatedPath}>
              {isLast ? (
                <span>{name}</span>
              ) : (
                <>
                  <Link to={accumulatedPath}>{name}</Link>
                  <span> / </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
