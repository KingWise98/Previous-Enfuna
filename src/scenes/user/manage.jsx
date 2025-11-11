import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Button, Card, CardContent,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, MenuItem, Select, InputLabel, FormControl,
  Chip, Badge, Tooltip, Tabs, Tab, Paper, Divider, Avatar
} from '@mui/material';
import {
  SaveAlt, FilterList, PictureAsPdf, GetApp, Search, DateRange,
  Today, CalendarViewWeek, CalendarViewMonth, Star, AttachMoney,
  Receipt, LocalShipping, Cancel, CheckCircle, Refresh, MoreVert
} from '@mui/icons-material';
import {
  LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { DateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const ManageSalesPage = () => {
  // State management
  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [openDateRangePicker, setOpenDateRangePicker] = useState(false);

  // Fetch sales data from API
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/sales');
        // const data = await response.json();
        // setSalesData(data);
        // Mark & Kure
        
        // For now, initialize with empty array
        setSalesData([]);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // TODO: Add error handling (show notification to user)
      }
    };
    
    fetchSalesData();
  }, []);

  // Handle export function
  const handleExport = async (format) => {
    try {
      // TODO: Implement export functionality with backend API
      // const response = await fetch(`/api/sales/export?format=${format}`);
      // Handle file download response
      
      console.log(`Exporting data as ${format}`);
      alert(`Exporting sales data as ${format}`);
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Add error handling
    }
  };

  // Handle date range change
  const handleDateRangeChange = (newValue) => {
    setDateRange(newValue);
    if (newValue[0] && newValue[1]) {
      setTimePeriod('custom');
      setOpenDateRangePicker(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...salesData];
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }
    
    // Payment method filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(sale => sale.paymentMethod === paymentFilter);
    }
    
    // Customer filter
    if (customerFilter) {
      filtered = filtered.filter(sale => 
        sale.customer.toLowerCase().includes(customerFilter.toLowerCase())
      );
    }
    
    // Search term
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.products && sale.products.some(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    // Time period filter
    const today = new Date();
    const cutoffDate = new Date(today);
    
    switch (timePeriod) {
      case 'daily':
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        break;
      case 'weekly':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case 'monthly':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
      case 'yearly':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        break;
      case 'custom':
        if (dateRange[0] && dateRange[1]) {
          return filtered.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= dateRange[0] && saleDate <= dateRange[1];
          });
        }
        break;
      default:
        break;
    }
    
    if (timePeriod !== 'all' && timePeriod !== 'custom') {
      filtered = filtered.filter(sale => new Date(sale.date) >= cutoffDate);
    }
    
    setFilteredSales(filtered);
  }, [salesData, statusFilter, paymentFilter, customerFilter, searchTerm, timePeriod, dateRange]);

  // Calculate summary metrics
  const calculateMetrics = () => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const completedSales = filteredSales.filter(sale => sale.status === 'Completed').length;
    const pendingSales = filteredSales.filter(sale => sale.status === 'Pending').length;
    const cancelledSales = filteredSales.filter(sale => sale.status === 'Cancelled').length;
    
    const averageOrderValue = totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : 0;
    const conversionRate = totalSales > 0 ? (completedSales / totalSales * 100).toFixed(1) : 0;
    
    return {
      totalSales,
      totalRevenue,
      completedSales,
      pendingSales,
      cancelledSales,
      averageOrderValue,
      conversionRate
    };
  };
  
  const metrics = calculateMetrics();

  // Chart data preparation
  const prepareChartData = () => {
    const salesByDay = {};
    const salesByProduct = {};
    const salesByStatus = {};
    const salesByPayment = {};
    
    filteredSales.forEach(sale => {
      // Sales by day
      if (!salesByDay[sale.date]) {
        salesByDay[sale.date] = 0;
      }
      salesByDay[sale.date] += sale.total || 0;
      
      // Sales by product
      if (sale.products) {
        sale.products.forEach(product => {
          if (!salesByProduct[product.name]) {
            salesByProduct[product.name] = 0;
          }
          salesByProduct[product.name] += (product.price || 0) * (product.quantity || 0);
        });
      }
      
      // Sales by status
      if (!salesByStatus[sale.status]) {
        salesByStatus[sale.status] = 0;
      }
      salesByStatus[sale.status]++;
      
      // Sales by payment method
      if (!salesByPayment[sale.paymentMethod]) {
        salesByPayment[sale.paymentMethod] = 0;
      }
      salesByPayment[sale.paymentMethod] += sale.total || 0;
    });
    
    // Convert to array format for charts
    const dailySalesData = Object.keys(salesByDay)
      .sort()
      .map(date => ({ date, sales: salesByDay[date] }));
    
    const productSalesData = Object.keys(salesByProduct)
      .map(name => ({ name, sales: salesByProduct[name] }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    const statusData = Object.keys(salesByStatus)
      .map(status => ({ name: status, value: salesByStatus[status] }));
    
    const paymentData = Object.keys(salesByPayment)
      .map(method => ({ name: method, value: salesByPayment[method] }));
    
    return {
      dailySalesData,
      productSalesData,
      statusData,
      paymentData
    };
  };
  
  const chartData = prepareChartData();

  // Color schemes for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const STATUS_COLORS = {
    'Completed': '#4CAF50',
    'Pending': '#FFC107',
    'Cancelled': '#F44336',
    'Refunded': '#9E9E9E'
  };

  // Handlers
  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setOpenDetailsDialog(true);
  };

  // TODO: Implement order status update function
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // const response = await fetch(`/api/orders/${orderId}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      // const updatedOrder = await response.json();
      // Update local state with the updated order
      alert(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Sales
      </Typography>

      {/* Time period selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant={timePeriod === 'daily' ? 'contained' : 'outlined'}
            startIcon={<Today />}
            onClick={() => {
              setTimePeriod('daily');
              setDateRange([null, null]);
            }}
          >
            Today
          </Button>
          <Button
            variant={timePeriod === 'weekly' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewWeek />}
            onClick={() => {
              setTimePeriod('weekly');
              setDateRange([null, null]);
            }}
          >
            This Week
          </Button>
          <Button
            variant={timePeriod === 'monthly' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewMonth />}
            onClick={() => {
              setTimePeriod('monthly');
              setDateRange([null, null]);
            }}
          >
            This Month
          </Button>
          <Button
            variant={timePeriod === 'yearly' ? 'contained' : 'outlined'}
            startIcon={<DateRange />}
            onClick={() => {
              setTimePeriod('yearly');
              setDateRange([null, null]);
            }}
          >
            This Year
          </Button>
          <Button
            variant={timePeriod === 'all' ? 'contained' : 'outlined'}
            onClick={() => {
              setTimePeriod('all');
              setDateRange([null, null]);
            }}
          >
            All Time
          </Button>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Button
              variant={timePeriod === 'custom' ? 'contained' : 'outlined'}
              startIcon={<DateRange />}
              onClick={() => setOpenDateRangePicker(true)}
            >
              {dateRange[0] && dateRange[1] 
                ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                : 'Custom Range'}
            </Button>
            
            <DateRangePicker
              open={openDateRangePicker}
              onClose={() => setOpenDateRangePicker(false)}
              value={dateRange}
              onChange={handleDateRangeChange}
              renderInput={(startProps, endProps) => (
                <Box sx={{ display: 'none' }}>
                  <TextField {...startProps} />
                  <TextField {...endProps} />
                </Box>
              )}
            />
          </LocalizationProvider>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<GetApp />}
            onClick={() => handleExport('CSV')}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdf />}
            onClick={() => handleExport('PDF')}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">TOTAL SALES</Typography>
              <Typography variant="h4">{metrics.totalSales}</Typography>
              <Typography variant="caption">
                {timePeriod === 'custom' && dateRange[0] && dateRange[1] 
                  ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                  : `Last ${timePeriod}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">TOTAL REVENUE</Typography>
              <Typography variant="h4">UGX {metrics.totalRevenue.toLocaleString()}</Typography>
              <Typography variant="caption">
                {timePeriod === 'custom' && dateRange[0] && dateRange[1] 
                  ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                  : `Last ${timePeriod}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">COMPLETED</Typography>
              <Typography variant="h4">{metrics.completedSales}</Typography>
              <Typography variant="caption">{metrics.conversionRate}% conversion</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">PENDING</Typography>
              <Typography variant="h4">{metrics.pendingSales}</Typography>
              <Typography variant="caption">Needs attention</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">AVG ORDER</Typography>
              <Typography variant="h4">UGX {metrics.averageOrderValue}</Typography>
              <Typography variant="caption">Per transaction</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">CANCELLED</Typography>
              <Typography variant="h4">{metrics.cancelledSales}</Typography>
              <Typography variant="caption">Requires review</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Sales Trend" />
            <Tab label="Top Products" />
            <Tab label="Sales by Status" />
            <Tab label="Payment Methods" />
          </Tabs>
          
          {tabValue === 0 && (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales (UGX)" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.productSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#82ca9d" name="Revenue (UGX)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}
          
          {tabValue === 3 && (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.paymentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Filters and Search */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search orders..."
          InputProps={{ startAdornment: <Search /> }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Payment</InputLabel>
          <Select
            value={paymentFilter}
            label="Payment"
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <MenuItem value="all">All Methods</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Mobile Money">Mobile Money</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          variant="outlined"
          size="small"
          placeholder="Filter by customer"
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setOpenFilterDialog(true)}
        >
          Advanced Filters
        </Button>
      </Box>

      {/* Sales Table */}
      <Paper sx={{ mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.orderId}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {sale.products?.map((product, idx) => (
                            <Typography key={idx} variant="body2">
                              {product.name} (x{product.quantity})
                            </Typography>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>UGX {sale.total?.toLocaleString()}</TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                      <TableCell>
                        <Chip
                          label={sale.status}
                          size="small"
                          sx={{
                            backgroundColor: STATUS_COLORS[sale.status] || '#9E9E9E',
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewDetails(sale)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {/* TODO: Replace with actual API loading state */}
                    {salesData.length === 0 ? 'No sales data available' : 'No matching records found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredSales.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredSales.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details - {selectedSale?.orderId}</DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>{selectedSale.customer?.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="subtitle1">{selectedSale.customer}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last order: {selectedSale.date}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle2">Shipping Address</Typography>
                <Typography variant="body1" paragraph>
                  {selectedSale.shippingAddress}
                </Typography>
                
                <Typography variant="subtitle2">Payment Method</Typography>
                <Typography variant="body1" paragraph>
                  {selectedSale.paymentMethod}
                </Typography>
                
                {selectedSale.notes && (
                  <>
                    <Typography variant="subtitle2">Special Notes</Typography>
                    <Typography variant="body1" paragraph>
                      {selectedSale.notes}
                    </Typography>
                  </>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Order Items</Typography>
                <Divider sx={{ mb: 2 }} />
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSale.products?.map((product, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{product.quantity}</TableCell>
                        <TableCell align="right">UGX {product.price?.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          UGX {(product.price * product.quantity)?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1">Order Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1">
                          UGX {selectedSale.total?.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Order Status</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip
                      label={selectedSale.status}
                      size="medium"
                      sx={{
                        backgroundColor: STATUS_COLORS[selectedSale.status] || '#9E9E9E',
                        color: 'white',
                        fontSize: '1rem',
                        padding: '8px 12px'
                      }}
                    />
                    
                    {selectedSale.status === 'Pending' && (
                      <>
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small"
                          onClick={() => handleUpdateStatus(selectedSale.orderId, 'Completed')}
                        >
                          Mark as Completed
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          onClick={() => handleUpdateStatus(selectedSale.orderId, 'Cancelled')}
                        >
                          Cancel Order
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => setOpenDetailsDialog(false)}>
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Advanced Filter Dialog */}
      <Dialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Min Amount</InputLabel>
                <Select>
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="1000">UGX 1,000+</MenuItem>
                  <MenuItem value="5000">UGX 5,000+</MenuItem>
                  <MenuItem value="10000">UGX 10,000+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Max Amount</InputLabel>
                <Select>
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="5000">Up to UGX 5,000</MenuItem>
                  <MenuItem value="10000">Up to UGX 10,000</MenuItem>
                  <MenuItem value="20000">Up to UGX 20,000</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date Range"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="From"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="To"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilterDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenFilterDialog(false)}>
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSalesPage;