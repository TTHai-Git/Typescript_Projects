import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  CartesianGrid,
  Line,
  AreaChart,
  Area,
} from "recharts";

export interface BestSellingProduct {
  totalSold: number;
  totalRevenue: number;
  productId: string;
  name: string;
  imageUrl: string;
}

const COLORS = [
  "#1976d2",
  "#388e3c",
  "#f57c00",
  "#d32f2f",
  "#7b1fa2",
  "#0288d1",
  "#c2185b",
  "#009688",
];

const BestSellingStats = ({ data = [] }: { data?: BestSellingProduct[] }) => {
  const [chartType, setChartType] = useState("bar");
  const [valueKey, setValueKey] = useState<"totalRevenue" | "totalSold">("totalRevenue");

  const renderChart = () => {
    if (!data || data.length === 0) return null;

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => (valueKey === "totalRevenue" ? `$${v}` : v)} />
              <Legend />
              <Line
                type="monotone"
                dataKey={valueKey}
                stroke="#1976d2"
                name={valueKey === "totalRevenue" ? "Revenue" : "Sold"}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => (valueKey === "totalRevenue" ? `$${v}` : v)} />
              <Legend />
              <Area
                type="monotone"
                dataKey={valueKey}
                stroke="#1976d2"
                fill="#90caf9"
                name={valueKey === "totalRevenue" ? "Revenue" : "Sold"}
              />
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
                data={data}
                dataKey={valueKey}
                nameKey="name"
                outerRadius={120}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => (valueKey === "totalRevenue" ? `$${v}` : v)} />
              <Legend />
              <Bar
                dataKey={valueKey}
                fill="#1976d2"
                name={valueKey === "totalRevenue" ? "Revenue" : "Sold"}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        📊 Best-Selling Products
      </Typography>

      {/* Chart Controls */}
      <Box display="flex" gap={3} mb={3}>
        <FormControl size="small">
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="area">Area</MenuItem>
            <MenuItem value="pie">Pie</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Value</InputLabel>
          <Select
            value={valueKey}
            label="Value"
            onChange={(e) => setValueKey(e.target.value as "totalRevenue" | "totalSold")}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="totalRevenue">Revenue ($)</MenuItem>
            <MenuItem value="totalSold">Sold (items)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Render Selected Chart */}
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>{renderChart()}</CardContent>
      </Card>
    </Box>
  );
};

export default BestSellingStats;
