import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RevenueResponse } from "../Dashboard";



const OrdersStats = ({ stats, loading }: { stats?: RevenueResponse; loading: boolean }) => {
  const [chartType, setChartType] = useState("bar");

  const renderChart = () => {
    if (!stats || !stats.data) return null;

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#1976d2" name="Order" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="orders" stroke="#1976d2" fill="#90caf9" name="Order" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={stats.data}
                dataKey="orders"
                nameKey="month"
                outerRadius={120}
                label
              >
                {stats.data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={[
                      "#1976d2", // Jan
                      "#388e3c", // Feb
                      "#f57c00", // Mar
                      "#d32f2f", // Apr
                      "#7b1fa2", // May
                      "#0288d1", // Jun
                      "#c2185b", // Jul
                      "#512da8", // Aug
                      "#00796b", // Sep
                      "#ffa000", // Oct
                      "#5d4037", // Nov
                      "#455a64", // Dec
                    ][index]}
                  />
                ))}
              </Pie>

            </PieChart>
          </ResponsiveContainer>
        );
      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#1976d2" name="Order" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Orders by Month</Typography>
        <FormControl size="small">
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="area">Area</MenuItem>
            <MenuItem value="pie">Pie</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? <CircularProgress /> : renderChart()}
    </Card>
  );
};

export default OrdersStats;
