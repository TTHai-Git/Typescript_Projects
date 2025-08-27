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

export interface MostPopularProduct {
  totalComments: number;
  productName: string;
  averageRating: number;
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

const MostPopularProducts = ({ data = [] }: { data?: MostPopularProduct[] }) => {
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "pie">("bar");
  const [valueKey, setValueKey] = useState<"totalComments" | "averageRating">("averageRating");

  const formatTooltip = (v: number) =>
    valueKey === "totalComments" ? `${v} items` : `${v} ⭐`;

  const renderChart = () => {
    if (!data || data.length === 0)
      return <Typography color="text.secondary">No product data available</Typography>;

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Line
                type="monotone"
                dataKey={valueKey}
                stroke="#1976d2"
                name={valueKey === "totalComments" ? "Comments" : "Ratings"}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Area
                type="monotone"
                dataKey={valueKey}
                stroke="#1976d2"
                fill="#90caf9"
                name={valueKey === "totalComments" ? "Comments" : "Ratings"}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Pie
                data={data}
                dataKey={valueKey}
                nameKey="productName"
                outerRadius={120}
                label
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Bar
                dataKey={valueKey}
                fill="#1976d2"
                name={valueKey === "totalComments" ? "Comments" : "Ratings"}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" fontWeight={555} gutterBottom>
        📊 Most Popular Products 
      </Typography>

      {/* Chart Controls */}
      <Box display="flex" gap={3} mb={3}>
        <FormControl size="small">
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={(e) =>
              setChartType(e.target.value as "bar" | "line" | "area" | "pie")
            }
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
            onChange={(e) =>
              setValueKey(e.target.value as "totalComments" | "averageRating")
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="totalComments">Total Comments (items)</MenuItem>
            <MenuItem value="averageRating">Average Rating (stars)</MenuItem>
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


export default MostPopularProducts;
