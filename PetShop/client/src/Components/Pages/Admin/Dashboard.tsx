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

  // Navigation handled by AdminLayout Sidebar

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
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: '#111827', mb: 3 }}>
        {t("Admin Overview")}
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

      {statsMostPopularProducts && <MostPopularProducts data={statsMostPopularProducts} />}
    </Box>
  );
};

export default Dashboard;
