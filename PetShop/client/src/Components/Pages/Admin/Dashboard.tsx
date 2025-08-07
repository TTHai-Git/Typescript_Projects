import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  LocalOffer as LocalOfferIcon,
  Pets as PetsIcon,
  Category as CategoryIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Comment as CommentIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  ReceiptLong as ReceiptLongIcon,
  Payment as PaymentIcon,
  Inventory2 as Inventory2Icon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  LocalShipping as LocalShippingIcon,
  People as PeopleIcon,
  Storefront as StorefrontIcon,
  CardGiftcard as CardGiftcardIcon,
} from "@mui/icons-material";

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardItems = [
  {
    label: "Manage Brands",
    icon: <LocalOfferIcon fontSize="large" color="primary" />,
    path: "brands",
  },
  {
    label: "Manage Breeds",
    icon: <PetsIcon fontSize="large" color="primary" />,
    path: "breeds",
  },
  {
    label: "Manage Categories",
    icon: <CategoryIcon fontSize="large" color="primary" />,
    path: "categories",
  },
  {
    label: "Manage Comments",
    icon: <ChatBubbleOutlineIcon fontSize="large" color="primary" />,
    path: "comments",
  },
  {
    label: "Manage Comments Details",
    icon: <CommentIcon fontSize="large" color="primary" />,
    path: "commentDetails",
  },
  {
    label: "Manage Favorites",
    icon: <FavoriteBorderIcon fontSize="large" color="primary" />,
    path: "favorites",
  },
  {
    label: "Manage Orders",
    icon: <ShoppingCartIcon fontSize="large" color="primary" />,
    path: "orders",
  },
  {
    label: "Manage Order Details",
    icon: <ReceiptLongIcon fontSize="large" color="primary" />,
    path: "orderDetails",
  },
  {
    label: "Manage Payments",
    icon: <PaymentIcon fontSize="large" color="primary" />,
    path: "payments",
  },
  {
    label: "Manage Products",
    icon: <Inventory2Icon fontSize="large" color="primary" />,
    path: "products",
  },
  {
    label: "Manage Roles",
    icon: <AdminPanelSettingsIcon fontSize="large" color="primary" />,
    path: "roles",
  },
  {
    label: "Manage Shipments",
    icon: <LocalShippingIcon fontSize="large" color="primary" />,
    path: "shipments", // typo? maybe "shipments"
  },
  {
    label: "Manage Users",
    icon: <PeopleIcon fontSize="large" color="primary" />,
    path: "users",
  },
  {
    label: "Manage Vendors",
    icon: <StorefrontIcon fontSize="large" color="primary" />,
    path: "vendors",
  },
  {
    label: "Manage Vouchers",
    icon: <CardGiftcardIcon fontSize="large" color="primary" />,
    path: "vouchers",
  },
];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} mt={2}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                transition: "transform 0.2s ease-in-out",
                ":hover": { transform: "scale(1.05)" },
              }}
            >
              <CardActionArea onClick={() => navigate(item.path)}>
                <CardContent
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                  }}
                >
                  {item.icon}
                  <Typography variant="subtitle1" fontWeight={500} mt={1}>
                    {item.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
