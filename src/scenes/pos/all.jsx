import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  useTheme
} from '@mui/material';
import {
  ShoppingCart,
  PointOfSale,
  Receipt,
  Payment,
  TrendingUp,
  Inventory,
  People,
  DateRange,
  Today,
  CalendarViewWeek,
  CalendarViewMonth,
  Refresh,
  FilterList,
  Add
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const POSDashboard = () => {
  const theme = useTheme();
  const [timeFilter, setTimeFilter] = useState('daily');
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [chartFilter, setChartFilter] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual API calls
        // Example:
        // const salesResponse = await fetch(`/api/sales?timeFilter=${timeFilter}`);
        // const salesData = await salesResponse.json();
        // setSalesData(salesData);
        
        // const productsResponse = await fetch('/api/products/top');
        // const topProducts = await productsResponse.json();
        // setTopProducts(topProducts);
        
        // const transactionsResponse = await fetch('/api/transactions/recent');
        // const recentTransactions = await transactionsResponse.json();
        // setRecentTransactions(recentTransactions);
        
        // const inventoryResponse = await fetch('/api/inventory/alerts');
        // const inventoryAlerts = await inventoryResponse.json();
        // setInventoryAlerts(inventoryAlerts);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilter]);

  // Calculate summary metrics - replace with actual API call
  const calculateSummary = () => {
    // TODO: Replace with API call to get summary data
    // Example:
    // const response = await fetch(`/api/summary?timeFilter=${timeFilter}`);
    // return await response.json();
    
    return {
      totalSales: '0.00',
      totalPurchases: '0.00',
      purchaseDue: '0.00',
      invoiceDue: '0.00',
      expenses: '0.00'
    };
  };

  const summary = calculateSummary();

  // Columns for recent transactions table
  const transactionColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'customer', headerName: 'Customer', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'items', headerName: 'Items', width: 100 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'time', headerName: 'Time', width: 120 },
    { field: 'order', headerName: 'Order Type', width: 120 , renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === 'Completed' ? '#4caf50' :
                          params.value === 'Pending' ? '#2196f3' :
                          '#f44336',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}
        >
          {params.value}
        </Box>
      )
    },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === 'Completed' ? '#4caf50' :
                          params.value === 'Pending' ? '#2196f3' :
                          '#f44336',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}
        >
          {params.value}
        </Box>
      )
    },
    { field: 'method', headerName: 'Method', width: 130 }
  ];

  // Columns for top selling products table
  const topProductsColumns = [
    { 
      field: 'image', 
      headerName: 'Image', 
      width: 80,
      renderCell: (params) => (
        <img 
          src={params.value} 
          alt="Product" 
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '4px',
            objectFit: 'cover'
          }} 
        />
      ),
      sortable: false
    },
    { field: 'name', headerName: 'Product Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'sales', 
      headerName: 'Units Sold', 
      width: 150,
      renderCell: (params) => (
        <Typography fontWeight="bold">{params.value}</Typography>
      )
    },
    { 
      field: 'revenue', 
      headerName: 'Revenue (UGX)', 
      width: 150,
      renderCell: (params) => (
        <Typography color="success.main">UGX {params.value.toLocaleString()}</Typography>
      )
    },
    { 
      field: 'rating', 
      headerName: 'Rating', 
      width: 120,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Box sx={{ color: '#ffc107', mr: 0.5 }}>★</Box>
          <Typography>{params.value}</Typography>
        </Box>
      )
    }
  ];

  // Columns for inventory alerts table
  const inventoryAlertsColumns = [
    { 
      field: 'image', 
      headerName: 'Image', 
      width: 80,
      renderCell: (params) => (
        <img 
          src={params.value} 
          alt="Product" 
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '4px',
            objectFit: 'cover'
          }} 
        />
      ),
      sortable: false
    },
    { field: 'name', headerName: 'Product Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'currentStock', 
      headerName: 'Current Stock', 
      width: 150,
      renderCell: (params) => (
        <Typography color={params.value < params.row.threshold * 0.2 ? 'error' : 'warning.main'}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'threshold', 
      headerName: 'Threshold', 
      width: 120,
      renderCell: (params) => (
        <Typography>{params.value}</Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.row.currentStock < params.row.threshold * 0.2 ? '#f44336' : '#ff9800',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}
        >
          {params.row.currentStock < params.row.threshold * 0.2 ? 'Critical' : 'Low'}
        </Box>
      )
    },
    { 
      field: 'action', 
      headerName: 'Action', 
      width: 120,
      renderCell: (params) => (
        <Button 
          size="small" 
          variant="outlined" 
          color={params.row.currentStock < params.row.threshold * 0.2 ? 'error' : 'warning'}
          href="/pos/inventory"
        >
          Reorder
        </Button>
      ),
      sortable: false
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">Error loading dashboard: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h3" fontWeight="bold">
          Point of Sale Dashboard
        </Typography>
      </Box>

      {/* Time Filter */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" gap={1}>
          <Button
            variant={timeFilter === 'daily' ? 'contained' : 'outlined'}
            startIcon={<Today />}
            onClick={() => setTimeFilter('daily')}
          >
            Daily
          </Button>
          <Button
            variant={timeFilter === 'weekly' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewWeek />}
            onClick={() => setTimeFilter('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={timeFilter === 'monthly' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewMonth />}
            onClick={() => setTimeFilter('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={timeFilter === 'yearly' ? 'contained' : 'outlined'}
            startIcon={<DateRange />}
            onClick={() => setTimeFilter('yearly')}
          >
            Yearly
          </Button>
        </Box>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filters
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                UGX{summary.totalSales}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" color="#4caf50">
                  Loading...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Purchases
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                UGX{summary.totalPurchases}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" color="#4caf50">
                  Loading...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Purchase Due
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                UGX{summary.purchaseDue}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ color: '#f44336', mr: 1 }} />
                <Typography variant="body2" color="#f44336">
                  Loading...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Invoice Due
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                UGX{summary.invoiceDue}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" color="#4caf50">
                  Loading...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Expenses
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                UGX{summary.expenses}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ color: '#f44336', mr: 1 }} />
                <Typography variant="body2" color="#f44336">
                  Loading...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Transactions</Typography>
              <Button 
                size="small" 
                startIcon={<Add />}
                href="/pos/new_sales"
              >
                New Sale
              </Button>
            </Box>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={recentTransactions}
                columns={transactionColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </Box>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>Quick Actions</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<PointOfSale />} 
                  sx={{ mb: 1 }}
                  href="/pos/new_sales"
                >
                  New Sale
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<ShoppingCart />} 
                  sx={{ mb: 1 }}
                  href="/pos/add"
                >
                  New Order
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<Receipt />} 
                  sx={{ mb: 1 }}
                  href="/payment"
                >
                  Invoices
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<Payment />} 
                  sx={{ mb: 1 }}
                  href="/payment-listings"
                >
                  Payments
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<Inventory />}
                  href="/inventory/overview"
                >
                  Inventory
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<People />}
                  href="/pos/customers"
                >
                  Customers
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={3}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Sales Trend ({timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} View)</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>View</InputLabel>
                <Select
                  value={chartFilter}
                  label="View"
                  onChange={(e) => setChartFilter(e.target.value)}
                >
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="customers">Customers</MenuItem>
                  <MenuItem value="returns">Returns</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartFilter === 'sales' && (
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#2196f3"
                      activeDot={{ r: 8 }}
                      name="Sales ($)"
                    />
                  )}
                  {chartFilter === 'customers' && (
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="#4caf50"
                      name="Customers"
                    />
                  )}
                  {chartFilter === 'returns' && (
                    <Line
                      type="monotone"
                      dataKey="returns"
                      stroke="#f44336"
                      name="Returns ($)"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Top Selling Products</Typography>
              <Button size="small" href="/pos/products">View All</Button>
            </Box>
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={topProducts}
                columns={topProductsColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                hideFooter={topProducts.length <= 5}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Inventory Alerts */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Inventory Alerts</Typography>
              <Button size="small" href="/pos/inventory">Manage Inventory</Button>
            </Box>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={inventoryAlerts}
                columns={inventoryAlertsColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                autoHeight={inventoryAlerts.length <= 5}
                sx={{
                  '& .MuiDataGrid-cell': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              />
              {inventoryAlerts.length === 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="textSecondary">No inventory alerts at this time</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick Stats */}
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" mb={2}>Quick Stats</Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Total Products</Typography>
              <Typography fontWeight="bold">Loading...</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Low Stock Items</Typography>
              <Typography fontWeight="bold" color="warning.main">Loading...</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Out of Stock</Typography>
              <Typography fontWeight="bold" color="error.main">Loading...</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>New Products</Typography>
              <Typography fontWeight="bold" color="success.main">Loading...</Typography>
            </Box>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Recent Activity</Typography>
            <Box mb={2}>
              <Typography variant="body2">Loading activity data...</Typography>
              <Typography variant="caption" color="textSecondary">Loading...</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POSDashboard;