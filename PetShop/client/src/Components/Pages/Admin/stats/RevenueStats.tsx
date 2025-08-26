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


const COLORS = [
  "#1976d2", "#388e3c", "#f57c00", "#d32f2f",
  "#7b1fa2", "#0288d1", "#c2185b", "#512da8",
  "#00796b", "#ffa000", "#5d4037", "#455a64"
];

const RevenueStats = ({ stats, loading }: { stats?: RevenueResponse; loading: boolean }) => {
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
              <Line type="monotone" dataKey="revenue" stroke="#1976d2" name="Revenue" />
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
              <Area type="monotone" dataKey="revenue" stroke="#1976d2" fill="#90caf9" name="Revenue" />
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
                dataKey="revenue"
                nameKey="month"
                outerRadius={120}
                label
              >
                {stats.data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
              <Bar dataKey="revenue" fill="#1976d2" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Revenue by Month</Typography>
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

export default RevenueStats;
