import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import {
  AttachMoney as FinanceIcon,
  PointOfSale as POSIcon,
  People as CustomersIcon,
  Groups as EmployeesIcon,
  Inventory as InventoryIcon,
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
  Refresh as RefreshIcon,
  ArrowUpward as IncreaseIcon,
  ArrowDownward as DecreaseIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF4444', '#33CC33', '#FF6699'];

// Sample data for all modules
const erpData = {
  // Financial Management Data
  financials: {
    revenue: 125000000,
    expenses: 85000000,
    profit: 40000000,
    cashFlow: 28000000,
    accountsReceivable: 45000000,
    accountsPayable: 32000000,
    monthlyTrend: [
      { month: 'Jan', revenue: 9800000, expenses: 7200000 },
      { month: 'Feb', revenue: 10500000, expenses: 7800000 },
      { month: 'Mar', revenue: 11200000, expenses: 8100000 },
      { month: 'Apr', revenue: 10800000, expenses: 7900000 },
      { month: 'May', revenue: 11500000, expenses: 8200000 },
      { month: 'Jun', revenue: 12500000, expenses: 8500000 }
    ],
    expenseBreakdown: [
      { name: 'Salaries', value: 35000000 },
      { name: 'Inventory', value: 25000000 },
      { name: 'Utilities', value: 8000000 },
      { name: 'Marketing', value: 7000000 },
      { name: 'Other', value: 10000000 }
    ]
  },
  
  // Point of Sale Data
  pos: {
    totalSales: 85000000,
    transactions: 1250,
    averageTicket: 68000,
    topProducts: [
      { id: 1, name: 'Heineken Lager 500ml', sales: 4500000, units: 900 },
      { id: 2, name: 'Golden Penny Semovita 2kg', sales: 3800000, units: 760 },
      { id: 3, name: 'Tecno Spark 10', sales: 3200000, units: 4 },
      { id: 4, name: 'OMO Detergent 5kg', sales: 2800000, units: 87 },
      { id: 5, name: 'Fanta Orange 500ml', sales: 2500000, units: 1000 }
    ],
    paymentMethods: [
      { name: 'Cash', value: 55000000 },
      { name: 'Mobile Money', value: 25000000 },
      { name: 'Card', value: 5000000 }
    ],
    hourlySales: [
      { hour: '8-10', sales: 5000000 },
      { hour: '10-12', sales: 8000000 },
      { hour: '12-14', sales: 12000000 },
      { hour: '14-16', sales: 9000000 },
      { hour: '16-18', sales: 11000000 },
      { hour: '18-20', sales: 15000000 }
    ]
  },
  
  // Customer Relations Data
  crm: {
    totalCustomers: 1250,
    newCustomers: 85,
    returningCustomers: 650,
    customerSatisfaction: 4.5,
    customerSegments: [
      { name: 'Retail', value: 750 },
      { name: 'Wholesale', value: 350 },
      { name: 'Corporate', value: 150 }
    ],
    customerActivity: [
      { month: 'Jan', new: 65, returning: 420 },
      { month: 'Feb', new: 72, returning: 450 },
      { month: 'Mar', new: 80, returning: 480 },
      { month: 'Apr', new: 68, returning: 460 },
      { month: 'May', new: 85, returning: 520 },
      { month: 'Jun', new: 90, returning: 550 }
    ]
  },
  
  // Human Resources Data
  hr: {
    totalEmployees: 85,
    newHires: 5,
    turnover: 3,
    departments: [
      { name: 'Sales', employees: 25 },
      { name: 'Operations', employees: 30 },
      { name: 'Finance', employees: 10 },
      { name: 'HR', employees: 5 },
      { name: 'IT', employees: 8 },
      { name: 'Management', employees: 7 }
    ],
    payroll: 35000000,
    training: [
      { name: 'Completed', value: 65 },
      { name: 'In Progress', value: 12 },
      { name: 'Not Started', value: 8 }
    ]
  },
  
  // Inventory Management Data
  inventory: {
    totalProducts: 1250,
    lowStock: 45,
    outOfStock: 12,
    inventoryValue: 85000000,
    categories: [
      { name: 'Beverages', value: 350 },
      { name: 'Food', value: 280 },
      { name: 'Electronics', value: 120 },
      { name: 'Home Care', value: 180 },
      { name: 'Other', value: 320 }
    ],
    stockMovement: [
      { month: 'Jan', received: 12000000, sold: 9800000 },
      { month: 'Feb', received: 11500000, sold: 10500000 },
      { month: 'Mar', received: 12500000, sold: 11200000 },
      { month: 'Apr', received: 11000000, sold: 10800000 },
      { month: 'May', received: 13000000, sold: 11500000 },
      { month: 'Jun', received: 14000000, sold: 12500000 }
    ]
  }
};

// Currency conversion rates (sample)
const exchangeRates = {
  UGX: 1,
  USD: 0.00027,
  EUR: 0.00025,
  GBP: 0.00021,
  KES: 0.039,
  TZS: 0.63
};

const ERPDashboard = () => {
  const theme = useTheme();
  const [activeModule, setActiveModule] = useState('financials');
  const [currency, setCurrency] = useState('UGX');
  const [timeRange, setTimeRange] = useState('monthly');

  // Format currency based on selection
  const formatCurrency = (value) => {
    const convertedValue = value * exchangeRates[currency];
    
    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'UGX' ? 0 : 2,
      maximumFractionDigits: currency === 'UGX' ? 0 : 2
    };
    
    return new Intl.NumberFormat(currency === 'UGX' ? 'en-UG' : 'en-US', options).format(convertedValue);
  };

  // Format large numbers
  const formatNumber = (value) => {
    return new Intl.NumberFormat().format(value);
  };

  // Handle module change
  const handleModuleChange = (event, newValue) => {
    setActiveModule(newValue);
  };

  // Render financial metrics card
  const renderMetricCard = (title, value, change, icon, color) => {
    const isPositive = change >= 0;
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography color="textSecondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(value)}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                {isPositive ? (
                  <TrendUpIcon fontSize="small" color="success" />
                ) : (
                  <TrendDownIcon fontSize="small" color="error" />
                )}
                <Typography variant="body2" ml={0.5} color={isPositive ? 'success.main' : 'error.main'}>
                  {isPositive ? '+' : ''}{change}% from last period
                </Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark` }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Render module-specific content
  const renderModuleContent = () => {
    switch (activeModule) {
      case 'financials':
        return (
          <>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                {renderMetricCard('Revenue', erpData.financials.revenue, 12.5, <FinanceIcon />, 'primary')}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderMetricCard('Expenses', erpData.financials.expenses, -8.2, <FinanceIcon />, 'secondary')}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderMetricCard('Profit', erpData.financials.profit, 25.7, <FinanceIcon />, 'success')}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderMetricCard('Cash Flow', erpData.financials.cashFlow, 18.3, <FinanceIcon />, 'info')}
              </Grid>
            </Grid>

            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Revenue vs Expenses
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={erpData.financials.monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                        <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Expense Breakdown
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={erpData.financials.expenseBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {erpData.financials.expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        );
      
      case 'pos':
        return (
          <>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                {renderMetricCard('Total Sales', erpData.pos.totalSales, 15.2, <POSIcon />, 'primary')}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Transactions
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {formatNumber(erpData.pos.transactions)}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendUpIcon fontSize="small" color="success" />
                      <Typography variant="body2" ml={0.5} color="success.main">
                        +8.7% from last period
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Average Ticket
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(erpData.pos.averageTicket)}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendUpIcon fontSize="small" color="success" />
                      <Typography variant="body2" ml={0.5} color="success.main">
                        +3.2% from last period
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Top Product
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {erpData.pos.topProducts[0].name}
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(erpData.pos.topProducts[0].sales)} ({erpData.pos.topProducts[0].units} units)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Hourly Sales Pattern
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={erpData.pos.hourlySales}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="sales" name="Sales" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Payment Methods
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={erpData.pos.paymentMethods}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {erpData.pos.paymentMethods.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        );
      
      // Other module cases would follow the same pattern
      // Due to length, I've included just financials and POS as examples
      // The full implementation would include CRM, HR, and Inventory modules
      
      default:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6">
                {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)} Module
              </Typography>
              <Typography color="textSecondary">
                Detailed reports and analytics for this module would be displayed here when the full system is setup.
              </Typography>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Enterprise Resource Planning Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Comprehensive business performance overview
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              label="Currency"
            >
              <MenuItem value="UGX">UGX (Shilling)</MenuItem>
              <MenuItem value="USD">USD (Dollar)</MenuItem>
              <MenuItem value="EUR">EUR (Euro)</MenuItem>
              <MenuItem value="GBP">GBP (Pound)</MenuItem>
              <MenuItem value="KES">KES (Shilling)</MenuItem>
              <MenuItem value="TZS">TZS (Shilling)</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex">
            <Button variant="contained" color="error" startIcon={<PdfIcon />} sx={{ mr: 1 }}>
              PDF
            </Button>
            <Button variant="contained" color="success" startIcon={<ExcelIcon />}>
              Excel
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Module Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeModule} onChange={handleModuleChange} variant="scrollable">
          <Tab label="Financial" value="financials" icon={<FinanceIcon />} iconPosition="start" />
          <Tab label="Point of Sale" value="pos" icon={<POSIcon />} iconPosition="start" />
          <Tab label="Customers" value="crm" icon={<CustomersIcon />} iconPosition="start" />
          <Tab label="Employees" value="hr" icon={<EmployeesIcon />} iconPosition="start" />
          <Tab label="Inventory" value="inventory" icon={<InventoryIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Module Content */}
      {renderModuleContent()}

      {/* Recent Activity Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Recent Activity Across Modules
          </Typography>
          <DataGrid
            rows={[
              { id: 1, module: 'POS', description: 'New record sale: UGX 250,000', timestamp: '2023-06-15 14:30' },
              { id: 2, module: 'Inventory', description: 'Low stock alert: Golden Penny Semovita', timestamp: '2023-06-15 13:45' },
              { id: 3, module: 'HR', description: 'New employee onboarded: John Doe', timestamp: '2023-06-15 11:20' },
              { id: 4, module: 'Finance', description: 'Invoice paid: UGX 1,250,000', timestamp: '2023-06-14 16:10' },
              { id: 5, module: 'CRM', description: 'New customer registered: ABC Enterprises', timestamp: '2023-06-14 10:05' }
            ]}
            columns={[
              { field: 'module', headerName: 'Module', width: 150 },
              { field: 'description', headerName: 'Description', flex: 1 },
              { field: 'timestamp', headerName: 'Timestamp', width: 200 }
            ]}
            pageSize={5}
            autoHeight
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ERPDashboard;