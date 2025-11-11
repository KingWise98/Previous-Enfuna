import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GetApp, DateRange, CloudUpload, PictureAsPdf } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

// Dummy Data for Stock Movement (updated for POS)
const stockData = [
  {
    id: 1,
    itemName: "Sugar",
    sales: 20,
    salesReturn: 2,
    purchases: 50,
    purchasesReturn: 3,
    production: 10,
    stockTransfer: 5,
    stockAdjust: -2,
    opening: 30,
  },
  {
    id: 2,
    itemName: "Rice",
    sales: 15,
    salesReturn: 1,
    purchases: 40,
    purchasesReturn: 2,
    production: 8,
    stockTransfer: 4,
    stockAdjust: -1,
    opening: 20,
  },
  {
    id: 3,
    itemName: "Cooking Oil",
    sales: 30,
    salesReturn: 5,
    purchases: 60,
    purchasesReturn: 4,
    production: 15,
    stockTransfer: 8,
    stockAdjust: -3,
    opening: 50,
  },
];

// Summary Card Data
const summaryData = [
  { label: "Total Items", value: 100, icon: "📦" },
  { label: "Sales", value: 200, icon: "💰" },
  { label: "Sales Return", value: 15, icon: "🔄" },
  { label: "Purchases", value: 300, icon: "🛒" },
  { label: "Purchases Return", value: 10, icon: "↩️" },
];

const StockMovementPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  const handleDownload = (format) => {
    alert(`Downloading ${format} report...`);
  };

  const columns = [
    { field: "itemName", headerName: "Item Name", flex: 1.5 },
    { field: "sales", headerName: "Sales", flex: 1 },
    { field: "salesReturn", headerName: "Sales Return", flex: 1 },
    { field: "purchases", headerName: "Purchases", flex: 1 },
    { field: "purchasesReturn", headerName: "Purchases Return", flex: 1 },
    { field: "production", headerName: "Production", flex: 1 },
    { field: "stockTransfer", headerName: "Stock Transfer", flex: 1 },
    { field: "stockAdjust", headerName: "Stock Adjust", flex: 1 },
    { field: "opening", headerName: "Opening Stock", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="bold">
        Stock Movement
      </Typography>

      {/* Filters Section */}
      <Box display="flex" gap={2} mt={3}>
        {/* Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date Range"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => (
              <Box display="flex" alignItems="center" gap={1} sx={{ backgroundColor: colors.primary[300], p: 1, borderRadius: 2 }}>
                <DateRange />
                <input {...params.inputProps} style={{ border: "none", background: "transparent", color: "white" }} />
              </Box>
            )}
          />
        </LocalizationProvider>

        {/* Category Filter */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
          </Select>
        </FormControl>

        {/* Store Filter */}
        <FormControl fullWidth>
          <InputLabel>Store</InputLabel>
          <Select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
            <MenuItem value="Branch A">Branch A</MenuItem>
            <MenuItem value="Branch B">Branch B</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mt={3}>
        {summaryData.map((card, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: theme.palette.mode === "light" ? "#F9F6EE" : colors.primary[300], // Bone White in light mode
              p: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Typography variant="h6">{card.icon}</Typography>
            <Typography variant="h5" fontWeight="bold">{card.value}</Typography>
            <Typography variant="subtitle2">{card.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="contained" color="secondary" startIcon={<CloudUpload />} onClick={() => handleDownload("Import Stock Data")}>
          Import Stock Data
        </Button>
        <Button variant="contained" color="error" startIcon={<PictureAsPdf />} onClick={() => handleDownload("PDF")}>
          Download PDF
        </Button>
        <Button variant="contained" color="success" startIcon={<GetApp />} onClick={() => handleDownload("Excel")}>
          Download Excel
        </Button>
      </Box>

      {/* Stock Movement Table */}
      <Box mt={4} sx={{ height: "60vh" }}>
        <DataGrid
          rows={stockData}
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        />
      </Box>
    </Box>
  );
};

export default StockMovementPage;
