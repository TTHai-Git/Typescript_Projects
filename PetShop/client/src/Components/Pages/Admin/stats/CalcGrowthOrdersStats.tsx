import { Card, CircularProgress, Typography, Box } from '@mui/material'
import React from 'react'
import { RevenueData, RevenueResponse } from '../Dashboard';
import { useTranslation } from 'react-i18next';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export const CalcGrowthOrdersStats = ({ stats, loading }: { stats?: RevenueResponse; loading: boolean }) => {
  // Tính tăng trưởng
  const calcGrowth = (field: keyof RevenueData): number => {
    if (!stats || !stats.data) return 0;
    const months = stats.data.filter((d) => Number(d[field]) > 0);
    if (months.length < 2) return 0;

    const last = Number(months[months.length - 1][field]);
    const prev = Number(months[months.length - 2][field]);

    if (prev === 0) return 100;
    return Number((((last - prev) / prev) * 100).toFixed(1));
  };
    const orderGrowth = calcGrowth("orders");
    const {t} = useTranslation()
    const isPositive = orderGrowth >= 0;

    return (
    <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(0,0,0,0.04)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
          {t("Total Orders")}
        </Typography>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', display: 'flex' }}>
           <ShoppingCartIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
        </Box>
      </Box>

      <Typography variant="h4" fontWeight={800} sx={{ color: '#111827', mb: 1 }}>
          {loading ? (
          <CircularProgress size={24} />
          ) : (
          stats?.data?.reduce((acc, d) => acc + Number(d.orders), 0)
          )}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: isPositive ? '#10b981' : '#ef4444', bgcolor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', px: 1, py: 0.5, borderRadius: 1.5, mr: 1 }}>
          {isPositive ? <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />}
          <Typography variant="caption" fontWeight="bold">
            {Math.abs(orderGrowth)}%
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {t("vs last month")}
        </Typography>
      </Box>
    </Card>
  )
}
