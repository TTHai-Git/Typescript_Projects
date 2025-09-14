import { useEffect, useState } from "react";
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
import APIs, { adminEndpoints } from "../../../Config/APIs";
import BestSellingStats, { BestSellingProduct } from "./stats/BestSellingStats";
import RevenueStats from "./stats/RevenueStats";
import OrdersStats from "./stats/OrdersStats";
import { CalcGrowthRevenueStats } from "./stats/CalcGrowthRevenueStats";
import { CalcGrowthOrdersStats } from "./stats/CalcGrowthOrdersStats";
import MostPopularProducts, { MostPopularProduct } from "./stats/MostPopularProducts";
import { useTranslation } from "react-i18next";

export interface RevenueData {
  index: number;
  month: string;
  revenue: number;
  orders: number;
}

export interface RevenueResponse {
  year: number;
  data: RevenueData[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stats, setStats] = useState<RevenueResponse>();
  const [statsBestSellingProducts, setStatsBestSellingProducts] = useState<BestSellingProduct[]>([])
  const [statsMostPopularProducts, setStatsMostPopularProducts] = useState<MostPopularProduct[]>([])
  const [loading, setLoading] = useState(true);

  const dashboardItems = [
    { label: t("Manage Brands"), icon: <LocalOfferIcon fontSize="large" color="primary" />, path: "brands" },
    { label: t("Manage Breeds"), icon: <PetsIcon fontSize="large" color="primary" />, path: "breeds" },
    { label: t("Manage Categories"), icon: <CategoryIcon fontSize="large" color="primary" />, path: "categories" },
    { label: t("Manage Comments"), icon: <ChatBubbleOutlineIcon fontSize="large" color="primary" />, path: "comments" },
    { label: t("Manage Comments Details"), icon: <CommentIcon fontSize="large" color="primary" />, path: "commentDetails" },
    { label: t("Manage Favorites"), icon: <FavoriteBorderIcon fontSize="large" color="primary" />, path: "favorites" },
    { label: t("Manage Orders"), icon: <ShoppingCartIcon fontSize="large" color="primary" />, path: "orders" },
    { label: t("Manage Order Details"), icon: <ReceiptLongIcon fontSize="large" color="primary" />, path: "orderDetails" },
    { label: t("Manage Payments"), icon: <PaymentIcon fontSize="large" color="primary" />, path: "payments" },
    { label: t("Manage Products"), icon: <Inventory2Icon fontSize="large" color="primary" />, path: "products" },
    { label: t("Manage Roles"), icon: <AdminPanelSettingsIcon fontSize="large" color="primary" />, path: "roles" },
    { label: t("Manage Shipments"), icon: <LocalShippingIcon fontSize="large" color="primary" />, path: "shipments" },
    { label: t("Manage Users"), icon: <PeopleIcon fontSize="large" color="primary" />, path: "users" },
    { label: t("Manage Vendors"), icon: <StorefrontIcon fontSize="large" color="primary" />, path: "vendors" },
    { label: t("Manage Vouchers"), icon: <CardGiftcardIcon fontSize="large" color="primary" />, path: "vouchers" },
  ];

  // Fetch stats
  useEffect(() => {
    const fetchStatsRevenueData = async () => {
      try {
        const res= await APIs.get(adminEndpoints["stats-revenue"]);
        setStats(res.data as RevenueResponse);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStatsBestSellingOfProductsData = async () => {
      try {
        const res = await APIs.get(adminEndpoints["stats-best-selling-products"]);
        setStatsBestSellingProducts(res.data as BestSellingProduct[]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStatsMostPopularProductsData = async () => {
      try {
        const res = await APIs.get(adminEndpoints["stats-most-popular-products"]);
        setStatsMostPopularProducts(res.data as MostPopularProduct[]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatsRevenueData();
    fetchStatsBestSellingOfProductsData();
    fetchStatsMostPopularProductsData();
  }, []);
  
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1" gutterBottom fontWeight={777}>
        {t("Admin Dashboard")}
      </Typography>
      <Typography variant="h2" gutterBottom fontWeight={666} textAlign={"center"}>
        {t("Stats")}
      </Typography>
      <Typography variant="h5" fontWeight={555} gutterBottom>
        📊 {t("Revenue And Order")}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={3}>
          <CalcGrowthRevenueStats stats={stats} loading={loading}/>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CalcGrowthOrdersStats stats={stats} loading={loading}/>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mt={4}>
        <Grid item xs={12} md={6}>
          <RevenueStats stats={stats} loading={loading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrdersStats stats={stats} loading={loading}/>
        </Grid>
      </Grid>

      {statsBestSellingProducts && <BestSellingStats data={statsBestSellingProducts} />}
      {statsMostPopularProducts && <MostPopularProducts data={statsMostPopularProducts} />}

      {/* Navigation cards */}
      <Typography variant="h2" mt={5} mb={2} fontWeight={600} textAlign={"center"}>
        {t("Management")}
      </Typography>
      <Grid container spacing={3}>
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
