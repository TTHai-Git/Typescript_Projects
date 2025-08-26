import { Card, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import { RevenueData, RevenueResponse } from '../Dashboard';


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
    return (
    <Card sx={{ p: 2, textAlign: "center", borderRadius: 3, boxShadow: 4 }}>
      <Typography variant="h6">Orders</Typography>
      <Typography variant="h5" color="primary" fontWeight={600}>
          {loading ? (
          <CircularProgress size={24} />
          ) : (
          stats?.data?.reduce((acc, d) => acc + Number(d.orders), 0)
          )}
      </Typography>
      <Typography variant="body2" color={orderGrowth >= 0 ? "green" : "red"}>
          {orderGrowth >= 0 ? `▲ ${orderGrowth}%` : `▼ ${Math.abs(orderGrowth)}%`} compared to last month
      </Typography>
    </Card>
  )
}
