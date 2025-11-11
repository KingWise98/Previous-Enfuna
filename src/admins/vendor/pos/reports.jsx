import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Chip,
  Avatar,
  Collapse,
  Tooltip as MuiTooltip
} from '@mui/material';
import {
  Receipt,
  LocalAtm,
  People,
  Inventory,
  TrendingUp,
  Category,
  DateRange,
  Download,
  Print,
  Email,
  Search,
  FilterList,
  Refresh,
  AttachMoney,
  CreditCard,
  PhoneAndroid,
  AccountBalance,
  ExpandMore,
  ExpandLess,
  Info
} from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Payment type icons
const paymentIcons = {
  Cash: <AttachMoney />,
  'Credit Card': <CreditCard />,
  'Mobile Money': <PhoneAndroid />,
  'Bank Transfer': <AccountBalance />
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [filteredData, setFilteredData] = useState({
    salesData: [],
    productPerformance: [],
    employeePerformance: [],
    paymentTypes: [],
    totalSales: 0,
    totalTransactions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch report data from API
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        
        // TODO: Replace with actual API endpoints
        // const reportResponse = await fetch('/api/reports');
        // const reportData = await reportResponse.json();
        
        // const productsResponse = await fetch('/api/products');
        // const productsData = await productsResponse.json();
        
        // const employeesResponse = await fetch('/api/employees');
        // const employeesData = await employeesResponse.json();
        
        // const salesResponse = await fetch('/api/sales');
        // const salesData = await salesResponse.json();
        
        // Process the data similar to the generateReportData function
        // setFilteredData(processedData);
        
        // For now, initialize with empty data
        setFilteredData({
          salesData: [],
          productPerformance: [],
          employeePerformance: [],
          paymentTypes: [],
          totalSales: 0,
          totalTransactions: 0
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setIsLoading(false);
        // TODO: Add error handling (show notification to user)
      }
    };
    
    fetchReportData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const applyFilters = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Implement filtered data fetch from API
      // const response = await fetch(`/api/reports/filtered?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}&employee=${employeeFilter}&category=${categoryFilter}`);
      // const filteredData = await response.json();
      
      // setFilteredData(filteredData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error applying filters:', error);
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setDateRange('week');
    setStartDate('');
    setEndDate('');
    setEmployeeFilter('all');
    setCategoryFilter('all');
    
    // TODO: Fetch original unfiltered data
    // fetchReportData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const toggleEmployeeExpand = (employeeId) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  // Handle export functions
  const handleExportExcel = async () => {
    try {
      // TODO: Implement Excel export
      // const response = await fetch('/api/reports/export/excel');
      // Handle file download
      alert('Export to Excel functionality will be implemented');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      // TODO: Implement PDF export
      // const response = await fetch('/api/reports/export/pdf');
      // Handle file download
      alert('Export to PDF functionality will be implemented');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handlePrintReport = () => {
    // TODO: Implement print functionality
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">POS Reports Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<GridOnIcon sx={{ color: '#4CAF50' }} />}
            sx={{ color: '#4CAF50', borderColor: '#4CAF50' }}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PictureAsPdfIcon sx={{ color: '#f44336' }} />}
            sx={{ color: '#f44336', borderColor: '#f44336' }}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Print sx={{ color: '#2196F3' }} />}
            sx={{ color: '#2196F3', borderColor: '#2196F3' }}
            onClick={handlePrintReport}
          >
            Print Report
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} /> Report Filters
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            {/* Date Range Filter */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  label="Date Range"
                  startAdornment={
                    <InputAdornment position="start">
                      <DateRange />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Custom Date Range Fields */}
            {dateRange === 'custom' && (
              <>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Grid>
              </>
            )}
            
            {/* Employee Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  label="Employee"
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  {/* TODO: Populate from API data */}
                  {/* {filteredData.employeePerformance.map(employee => (
                    <MenuItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Category Filter */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {/* TODO: Populate from API data */}
                  {/* {Array.from(new Set(filteredData.productPerformance.map(p => p.category))).map(category => (
                    <MenuItem key={category} value={category.toLowerCase()}>
                      {category}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Action Buttons */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<FilterList />}
                onClick={applyFilters}
                sx={{ height: '56px' }}
                disabled={isLoading}
              >
                {isLoading ? 'Applying...' : 'Apply Filters'}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Refresh />}
                onClick={resetFilters}
                sx={{ height: '56px' }}
                disabled={isLoading}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
          
          {/* Filter Summary */}
          <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Current Filters:</strong> 
              {dateRange !== 'custom' ? ` ${dateRange}` : ` ${startDate} to ${endDate}`}
              {employeeFilter !== 'all' ? ` | Employee: ${employeeFilter}` : ''}
              {categoryFilter !== 'all' ? ` | Category: ${categoryFilter}` : ''}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography variant="h6">Loading report data...</Typography>
        </Box>
      )}

      {/* Main Reports Area */}
      {!isLoading && (
        <Card>
          <CardHeader
            title={
              <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
                <Tab label="Sales Summary" icon={<Receipt />} iconPosition="start" />
                <Tab label="Product Performance" icon={<Inventory />} iconPosition="start" />
                <Tab label="Employee Sales" icon={<People />} iconPosition="start" />
                <Tab label="Payment Methods" icon={<LocalAtm />} iconPosition="start" />
              </Tabs>
            }
            sx={{
              '.MuiCardHeader-content': {
                width: '100%'
              }
            }}
          />
          <Divider />
          <CardContent>
            {/* Sales Summary Tab */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Sales Trend
                    <MuiTooltip title="Daily sales performance over time">
                      <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                    </MuiTooltip>
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    {filteredData.salesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredData.salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === 'Sales') return [formatCurrency(value), name];
                              return [value, name];
                            }}
                          />
                          <Legend />
                          <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                          <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography>No sales data available for the selected filters</Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                {/* Other sections of Sales Summary Tab... */}
              </Grid>
            )}

            {/* Other tabs (Product Performance, Employee Sales, Payment Methods) */}
            {/* ... */}
            
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ReportsPage;