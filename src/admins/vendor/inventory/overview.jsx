import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Warning as LowStockIcon,
  Star as TopProductIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,  // <-- Add this line
  Warning as WarningIcon 
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Product data with UGX prices
const products = [
  {
    id: 1,
    name: 'Heineken Lager Beer 500ml',
    sku: 'PRD-001',
    category: 'Beverages',
    subCategory: 'Alcoholic',
    image: '/assets/Heineken.png',
    currentStock: 245,
    lowStockThreshold: 50,
    costPrice: 3500,
    sellingPrice: 4500,
    supplier: 'Uganda Breweries Ltd',
    lastRestock: '2023-10-15',
    salesLastMonth: 1200,
    status: 'In Stock'
  },
  {
    id: 2,
    name: 'Golden Penny Semovita 2kg',
    sku: 'PRD-002',
    category: 'Food',
    subCategory: 'Flour',
    image: '/assets/semo.jpeg',
    currentStock: 78,
    lowStockThreshold: 30,
    costPrice: 8500,
    sellingPrice: 10500,
    supplier: 'Flour Mills of Uganda',
    lastRestock: '2023-11-02',
    salesLastMonth: 450,
    status: 'Low Stock'
  },
  {
    id: 3,
    name: 'Tecno Spark 10',
    sku: 'PRD-003',
    category: 'Electronics',
    subCategory: 'Mobile Phones',
    image: '/assets/spark.jpeg',
    currentStock: 15,
    lowStockThreshold: 5,
    costPrice: 650000,
    sellingPrice: 799000,
    supplier: 'Tecno Mobile Uganda',
    lastRestock: '2023-11-20',
    salesLastMonth: 32,
    status: 'In Stock'
  },
  {
    id: 4,
    name: 'OMO Detergent 5kg',
    sku: 'PRD-004',
    category: 'Home Care',
    subCategory: 'Detergents',
    image: '/assets/omo.jpg',
    currentStock: 42,
    lowStockThreshold: 20,
    costPrice: 25000,
    sellingPrice: 32000,
    supplier: 'Unilever Uganda',
    lastRestock: '2023-10-28',
    salesLastMonth: 210,
    status: 'In Stock'
  },
  {
    id: 5,
    name: 'Fanta Orange 500ml',
    sku: 'PRD-005',
    category: 'Beverages',
    subCategory: 'Soft Drinks',
    image: '/assets/fanta.jpg',
    currentStock: 310,
    lowStockThreshold: 100,
    costPrice: 1800,
    sellingPrice: 2500,
    supplier: 'Coca-Cola Beverages Africa',
    lastRestock: '2023-11-15',
    salesLastMonth: 980,
    status: 'In Stock'
  }
];

// Format UGX currency
const formatUGX = (value) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0
  }).format(value);
};

// Calculate inventory metrics
const totalInventoryValue = products.reduce((sum, product) => sum + (product.currentStock * product.costPrice), 0);
const outOfStockItems = products.filter(product => product.currentStock === 0).length;
const lowStockItems = products.filter(product => product.currentStock > 0 && product.currentStock <= product.lowStockThreshold).length;
const topSellingProducts = [...products].sort((a, b) => b.salesLastMonth - a.salesLastMonth).slice(0, 3);

// Chart data
const stockDistributionData = products.map(product => ({
  name: product.name,
  value: product.currentStock
}));

const salesData = [
  { name: 'Heineken', sales: 1200 },
  { name: 'Semovita', sales: 450 },
  { name: 'Tecno Spark', sales: 32 },
  { name: 'OMO', sales: 210 },
  { name: 'Fanta', sales: 980 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const InventoryDashboard = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = ['All', ...new Set(products.map(product => product.category))];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Columns for DataGrid
  const columns = [
    { 
      field: 'image', 
      headerName: '', 
      width: 80,
      renderCell: (params) => (
        <Avatar 
          src={params.value} 
          alt="Product" 
          sx={{ width: 56, height: 56 }}
          variant="rounded"
        />
      ),
      sortable: false
    },
    { field: 'name', headerName: 'Product Name', width: 250 },
    { field: 'sku', headerName: 'SKU', width: 120 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'currentStock', 
      headerName: 'Stock', 
      width: 120,
      renderCell: (params) => (
        <Box>
          <Typography>{params.value}</Typography>
          {params.row.currentStock <= params.row.lowStockThreshold && (
            <Chip 
              label="Low Stock" 
              size="small" 
              color="warning" 
              icon={<LowStockIcon fontSize="small" />}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      )
    },
    { 
      field: 'costPrice', 
      headerName: 'Cost Price', 
      width: 150,
      valueFormatter: (params) => formatUGX(params.value)
    },
    { 
      field: 'sellingPrice', 
      headerName: 'Selling Price', 
      width: 150,
      valueFormatter: (params) => formatUGX(params.value)
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => {
        let color;
        switch(params.value) {
          case 'Low Stock': color = 'warning'; break;
          case 'Out of Stock': color = 'error'; break;
          default: color = 'success';
        }
        return <Chip label={params.value} color={color} />;
      }
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: () => (
        <Box>
          <Tooltip title="Restock">
            <IconButton size="small" color="primary">
              <ShippingIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="secondary">
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Export functions
  const exportToPDF = () => {
    // In a real app, this would generate a PDF report
    alert('PDF export functionality would be implemented here');
  };

  const exportToExcel = () => {
    // In a real app, this would generate an Excel report
    alert('Excel export functionality would be implemented here');
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Inventory Management Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Real-time overview of your inventory (Prices in UGX)
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<PdfIcon />}
            onClick={exportToPDF}
          >
            Export PDF
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<ExcelIcon />}
            onClick={exportToExcel}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {products.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.dark }}>
                  <InventoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Inventory Value
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatUGX(totalInventoryValue)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.dark }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {lowStockItems}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.dark }}>
                  <LowStockIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Out of Stock
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {outOfStockItems}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.error.light, color: theme.palette.error.dark }}>
                  <WarningIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Stock Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stockDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units`, 'Current Stock']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Monthly Sales Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Units Sold" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Products */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Top Selling Products
              </Typography>
              <Grid container spacing={2}>
                {topSellingProducts.map((product, index) => (
                  <Grid item xs={12} sm={4} key={product.id}>
                    <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={product.image} 
                        alt={product.name}
                        sx={{ width: 60, height: 60, mr: 2 }}
                        variant="rounded"
                      />
                      <Box>
                        <Typography fontWeight="bold">{product.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {product.salesLastMonth} units sold
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Revenue: {formatUGX(product.salesLastMonth * product.sellingPrice)}
                        </Typography>
                        {index === 0 && (
                          <Chip 
                            label="Top Seller" 
                            size="small" 
                            color="success" 
                            icon={<TopProductIcon fontSize="small" />}
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Inventory Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Product Inventory
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search products..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" />
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<RefreshIcon />}>
                Refresh
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredProducts}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InventoryDashboard;