import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      label: "Manage Products",
      icon: <Inventory2Icon fontSize="large" color="primary" />,
      path: "products",
    },
    {
      label: "Manage Users",
      icon: <PeopleIcon fontSize="large" color="primary" />,
      path: "users",
    },
    {
      label: "Manage Categories",
      icon: <CategoryIcon fontSize="large" color="primary" />,
      path: "categories",
    },
    {
      label: "Manage Orders",
      icon: <ShoppingCartIcon fontSize="large" color="primary" />,
      path: "admin-dashboard/orders",
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
