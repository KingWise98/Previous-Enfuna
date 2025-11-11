import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  IconButton,

  Collapse,
  useTheme
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  DateRange,
  Download,
  PictureAsPdf,
  GridOn,
  Print,
  Email,
  AttachMoney,
  AccountBalance,
  CreditCard,
  Receipt,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  ExpandLess,
  Info,
  Visibility,
  VisibilityOff,
  MoreVert
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data
const accountsData = [
  {
    id: 1,
    name: 'Cash on Hand',
    type: 'Asset',
    category: 'Current Assets',
    balance: 2500000,
    lastUpdated: '2025-06-15',
    status: 'active',
    details: {
      transactions: 42,
      lastTransaction: '2025-06-14',
      lastTransactionAmount: 150000
    }
  },
  {
    id: 2,
    name: 'Business Checking',
    type: 'Asset',
    category: 'Current Assets',
    balance: 8500000,
    lastUpdated: '2025-06-15',
    status: 'active',
    details: {
      transactions: 78,
      lastTransaction: '2025-06-15',
      lastTransactionAmount: -450000
    }
  },
  {
    id: 3,
    name: 'Accounts Receivable',
    type: 'Asset',
    category: 'Current Assets',
    balance: 3200000,
    lastUpdated: '2025-06-14',
    status: 'active',
    details: {
      transactions: 15,
      lastTransaction: '2025-06-13',
      lastTransactionAmount: 120000
    }
  },
  {
    id: 4,
    name: 'Inventory',
    type: 'Asset',
    category: 'Current Assets',
    balance: 5800000,
    lastUpdated: '2024-06-10',
    status: 'active',
    details: {
      transactions: 23,
      lastTransaction: '2024-06-09',
      lastTransactionAmount: 350000
    }
  },
  {
    id: 5,
    name: 'Equipment',
    type: 'Asset',
    category: 'Fixed Assets',
    balance: 12000000,
    lastUpdated: '2025-05-31',
    status: 'active',
    details: {
      transactions: 2,
      lastTransaction: '2025-03-15',
      lastTransactionAmount: 500000
    }
  },
  {
    id: 6,
    name: 'Accounts Payable',
    type: 'Liability',
    category: 'Current Liabilities',
    balance: 2800000,
    lastUpdated: '2025-06-15',
    status: 'active',
    details: {
      transactions: 31,
      lastTransaction: '2025-06-15',
      lastTransactionAmount: -180000
    }
  },
  {
    id: 7,
    name: 'Credit Card',
    type: 'Liability',
    category: 'Current Liabilities',
    balance: 950000,
    lastUpdated: '2025-06-14',
    status: 'active',
    details: {
      transactions: 28,
      lastTransaction: '2025-06-13',
      lastTransactionAmount: 75000
    }
  },
  {
    id: 8,
    name: 'Loan Payable',
    type: 'Liability',
    category: 'Long-term Liabilities',
    balance: 5000000,
    lastUpdated: '2024-06-01',
    status: 'active',
    details: {
      transactions: 1,
      lastTransaction: '2024-06-01',
      lastTransactionAmount: -250000
    }
  },
  {
    id: 9,
    name: 'Owner\'s Equity',
    type: 'Equity',
    category: 'Equity',
    balance: 15000000,
    lastUpdated: '2025-06-15',
    status: 'active',
    details: {
      transactions: 12,
      lastTransaction: '2025-06-10',
      lastTransactionAmount: 1000000
    }
  },
  {
    id: 10,
    name: 'Retained Earnings',
    type: 'Equity',
    category: 'Equity',
    balance: 7500000,
    lastUpdated: '2025-06-15',
    status: 'active',
    details: {
      transactions: 5,
      lastTransaction: '2025-06-15',
      lastTransactionAmount: 500000
    }
  }
];

// Chart data
const accountTypesData = [
  { name: 'Assets', value: accountsData.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0) },
  { name: 'Liabilities', value: accountsData.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0) },
  { name: 'Equity', value: accountsData.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0) }
];

const accountCategoriesData = [
  { name: 'Current Assets', value: accountsData.filter(a => a.category === 'Current Assets').reduce((sum, a) => sum + a.balance, 0) },
  { name: 'Fixed Assets', value: accountsData.filter(a => a.category === 'Fixed Assets').reduce((sum, a) => sum + a.balance, 0) },
  { name: 'Current Liabilities', value: accountsData.filter(a => a.category === 'Current Liabilities').reduce((sum, a) => sum + a.balance, 0) },
  { name: 'Long-term Liabilities', value: accountsData.filter(a => a.category === 'Long-term Liabilities').reduce((sum, a) => sum + a.balance, 0) },
  { name: 'Equity', value: accountsData.filter(a => a.category === 'Equity').reduce((sum, a) => sum + a.balance, 0) }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX'
  }).format(amount);
};

const AccountsBalancePage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccount, setExpandedAccount] = useState(null);
  const [hiddenAccounts, setHiddenAccounts] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleAccountExpand = (accountId) => {
    setExpandedAccount(expandedAccount === accountId ? null : accountId);
  };

  const toggleAccountVisibility = (accountId) => {
    setHiddenAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId) 
        : [...prev, accountId]
    );
  };

  const filteredAccounts = accountsData.filter(account => {
    // Apply account type filter
    if (accountTypeFilter !== 'all' && account.type !== accountTypeFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && !account.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const totalAssets = accountsData
    .filter(a => a.type === 'Asset')
    .reduce((sum, a) => sum + a.balance, 0);
  
  const totalLiabilities = accountsData
    .filter(a => a.type === 'Liability')
    .reduce((sum, a) => sum + a.balance, 0);
  
  const totalEquity = accountsData
    .filter(a => a.type === 'Equity')
    .reduce((sum, a) => sum + a.balance, 0);
  
  const netWorth = totalAssets - totalLiabilities;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Accounts Balance</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<GridOn />}
            sx={{ color: '#4CAF50', borderColor: '#4CAF50' }}
          >
            Export Excel
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PictureAsPdf />}
            sx={{ color: '#f44336', borderColor: '#f44336' }}
          >
            Export PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Print />}
            sx={{ color: '#2196F3', borderColor: '#2196F3' }}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="Date Range"
                  startAdornment={
                    <InputAdornment position="start">
                      <DateRange />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="thisQuarter">This Quarter</MenuItem>
                  <MenuItem value="thisYear">This Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                  label="Account Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Asset">Assets</MenuItem>
                  <MenuItem value="Liability">Liabilities</MenuItem>
                  <MenuItem value="Equity">Equity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Accounts"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<FilterList />}
                sx={{ height: '56px' }}
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Assets
                <Tooltip title="Sum of all asset accounts">
                  <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(totalAssets)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" color="#4caf50">
                  +5.2% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Liabilities
                <Tooltip title="Sum of all liability accounts">
                  <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color="error.main">
                {formatCurrency(totalLiabilities)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                <Typography variant="body2" color="#f44336">
                  -2.1% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Equity
                <Tooltip title="Sum of all equity accounts">
                  <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(totalEquity)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" color="#4caf50">
                  +8.7% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Net Worth
                <Tooltip title="Assets minus Liabilities">
                  <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color={netWorth >= 0 ? "success.main" : "error.main"}>
                {formatCurrency(netWorth)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {netWorth >= 0 ? (
                  <>
                    <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                    <Typography variant="body2" color="#4caf50">
                      +12.5% from last month
                    </Typography>
                  </>
                ) : (
                  <>
                    <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                    <Typography variant="body2" color="#f44336">
                      -5.8% from last month
                    </Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Account Balances" icon={<AccountBalance />} iconPosition="start" />
            <Tab label="Assets vs Liabilities" icon={<AttachMoney />} iconPosition="start" />
            <Tab label="Account Types" icon={<CreditCard />} iconPosition="start" />
            <Tab label="Balance History" icon={<TrendingUp />} iconPosition="start" />
          </Tabs>
          
          {/* Account Balances Tab */}
          {activeTab === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Account Balances
                  <Tooltip title="Detailed view of all accounts with current balances">
                    <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  </Tooltip>
                </Typography>
                <Box>
                  <Button startIcon={<Refresh />} sx={{ mr: 1 }}>Refresh</Button>
                  <Button startIcon={<Download />}>Export</Button>
                </Box>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account</TableCell>
                      <TableCell align="right">Type</TableCell>
                      <TableCell align="right">Category</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="right">Last Updated</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <React.Fragment key={account.id}>
                        <TableRow sx={{ 
                          backgroundColor: hiddenAccounts.includes(account.id) ? '#f5f5f5' : 'inherit',
                          opacity: hiddenAccounts.includes(account.id) ? 0.6 : 1
                        }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {account.type === 'Asset' && <AttachMoney color="success" sx={{ mr: 1 }} />}
                              {account.type === 'Liability' && <CreditCard color="error" sx={{ mr: 1 }} />}
                              {account.type === 'Equity' && <AccountBalance color="info" sx={{ mr: 1 }} />}
                              {account.name}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{account.type}</TableCell>
                          <TableCell align="right">{account.category}</TableCell>
                          <TableCell align="right" sx={{ 
                            fontWeight: 'bold',
                            color: account.type === 'Liability' ? 'error.main' : 'success.main'
                          }}>
                            {formatCurrency(account.balance)}
                          </TableCell>
                          <TableCell align="right">{account.lastUpdated}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={account.status} 
                              size="small" 
                              color={account.status === 'active' ? 'success' : 'error'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => toggleAccountVisibility(account.id)}>
                              {hiddenAccounts.includes(account.id) ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            <IconButton onClick={() => toggleAccountExpand(account.id)}>
                              {expandedAccount === account.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={expandedAccount === account.id} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Account Details: {account.name}
                                </Typography>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={6}>
                                    <Table size="small">
                                      <TableBody>
                                        <TableRow>
                                          <TableCell>Account Type</TableCell>
                                          <TableCell align="right">{account.type}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Category</TableCell>
                                          <TableCell align="right">{account.category}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Current Balance</TableCell>
                                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                            {formatCurrency(account.balance)}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Last Updated</TableCell>
                                          <TableCell align="right">{account.lastUpdated}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Status</TableCell>
                                          <TableCell align="right">
                                            <Chip 
                                              label={account.status} 
                                              size="small" 
                                              color={account.status === 'active' ? 'success' : 'error'}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Recent Activity
                                    </Typography>
                                    <Table size="small">
                                      <TableBody>
                                        <TableRow>
                                          <TableCell>Total Transactions</TableCell>
                                          <TableCell align="right">{account.details.transactions}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Last Transaction Date</TableCell>
                                          <TableCell align="right">{account.details.lastTransaction}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell>Last Transaction Amount</TableCell>
                                          <TableCell align="right" sx={{ 
                                            fontWeight: 'bold',
                                            color: account.details.lastTransactionAmount >= 0 
                                              ? 'success.main' 
                                              : 'error.main'
                                          }}>
                                            {formatCurrency(account.details.lastTransactionAmount)}
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                    <Button 
                                      variant="outlined" 
                                      size="small" 
                                      sx={{ mt: 2 }}
                                      startIcon={<Receipt />}
                                    >
                                      View All Transactions
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Summary Row */}
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1">
                      Total Assets: <strong>{formatCurrency(totalAssets)}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1">
                      Total Liabilities: <strong>{formatCurrency(totalLiabilities)}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1">
                      Net Worth: <strong style={{ 
                        color: netWorth >= 0 ? theme.palette.success.main : theme.palette.error.main 
                      }}>
                        {formatCurrency(netWorth)}
                      </strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
          
          {/* Assets vs Liabilities Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Assets vs Liabilities
                  <Tooltip title="Comparison of total assets and liabilities">
                    <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  </Tooltip>
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Assets', value: totalAssets },
                        { name: 'Liabilities', value: totalLiabilities },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Amount"
                        fill="#8884d8"
                      >
                        <Cell fill="#4CAF50" />
                        <Cell fill="#F44336" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Net Worth Trend
                  <Tooltip title="Historical net worth (assets minus liabilities)">
                    <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  </Tooltip>
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: 'Jan', assets: 18000000, liabilities: 7000000 },
                        { month: 'Feb', assets: 19000000, liabilities: 7500000 },
                        { month: 'Mar', assets: 20000000, liabilities: 8000000 },
                        { month: 'Apr', assets: 21000000, liabilities: 8200000 },
                        { month: 'May', assets: 22000000, liabilities: 8500000 },
                        { month: 'Jun', assets: 25000000, liabilities: 8750000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'Net Worth') {
                            return [formatCurrency(value), name];
                          }
                          return [formatCurrency(value), name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="assets" fill="#4CAF50" name="Assets" />
                      <Bar dataKey="liabilities" fill="#F44336" name="Liabilities" />
                      <Bar 
                        dataKey={(item) => item.assets - item.liabilities} 
                        fill="#2196F3" 
                        name="Net Worth"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Account Types Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Account Types Distribution
                  <Tooltip title="Breakdown of assets, liabilities, and equity">
                    <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  </Tooltip>
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accountTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {accountTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${((value / accountTypesData.reduce((sum, a) => sum + a.value, 0)) * 100).toFixed(1)}% (${formatCurrency(value)})`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Account Categories
                  <Tooltip title="Detailed breakdown by account categories">
                    <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  </Tooltip>
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accountCategoriesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {accountCategoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${((value / accountCategoriesData.reduce((sum, a) => sum + a.value, 0)) * 100).toFixed(1)}% (${formatCurrency(value)})`,
                          name
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Balance History Tab */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Balance History
                <Tooltip title="Historical balances for all accounts">
                  <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                </Tooltip>
              </Typography>
              <Box sx={{ height: 500 }}>
                <DataGrid
                  rows={[
                    { 
                      id: 1, 
                      account: 'Cash on Hand', 
                      type: 'Asset',
                      jan: 2000000, feb: 2100000, mar: 2200000, apr: 2300000, may: 2400000, jun: 2500000,
                      trend: 'up'
                    },
                    { 
                      id: 2, 
                      account: 'Business Checking', 
                      type: 'Asset',
                      jan: 7000000, feb: 7200000, mar: 7500000, apr: 7800000, may: 8200000, jun: 8500000,
                      trend: 'up'
                    },
                    { 
                      id: 3, 
                      account: 'Accounts Receivable', 
                      type: 'Asset',
                      jan: 3500000, feb: 3400000, mar: 3300000, apr: 3250000, may: 3200000, jun: 3200000,
                      trend: 'down'
                    },
                    { 
                      id: 4, 
                      account: 'Accounts Payable', 
                      type: 'Liability',
                      jan: 3000000, feb: 2900000, mar: 2950000, apr: 2850000, may: 2800000, jun: 2800000,
                      trend: 'down'
                    },
                    { 
                      id: 5, 
                      account: 'Credit Card', 
                      type: 'Liability',
                      jan: 1200000, feb: 1100000, mar: 1050000, apr: 1000000, may: 980000, jun: 950000,
                      trend: 'down'
                    },
                  ]}
                  columns={[
                    { 
                      field: 'account', 
                      headerName: 'Account', 
                      width: 200,
                      renderCell: (params) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {params.row.type === 'Asset' && <AttachMoney color="success" sx={{ mr: 1 }} />}
                          {params.row.type === 'Liability' && <CreditCard color="error" sx={{ mr: 1 }} />}
                          {params.row.account}
                        </Box>
                      )
                    },
                    { field: 'type', headerName: 'Type', width: 120 },
                    { 
                      field: 'jan', 
                      headerName: 'Jan', 
                      width: 120,
                      valueFormatter: (params) => formatCurrency(params.value)
                    },
                    { 
                      field: 'feb', 
                      headerName: 'Feb', 
                      width: 120,
                      valueFormatter: (params) => formatCurrency(params.value)
                    },
                    { 
                      field: 'mar', 
                      headerName: 'Mar', 
                      width: 120,
                      valueFormatter: (params) => formatCurrency(params.value)
                    },
                    { 
                      field: 'apr', 
                      headerName: 'Apr', 
                      width: 120,
                      valueFormatter: (params) => formatCurrency(params.value)
                    },
                    { 
                      field: 'may', 
                      headerName: 'May', 
                      width: 120,
                      valueFormatter: (params) => formatCurrency(params.value)
                    },
                    { 
                      field: 'jun', 
                      headerName: 'Jun', 
                      width: 120,
                      valueFormatter: (params) => formatCurrency(params.value)
                    },
                    { 
                      field: 'trend', 
                      headerName: 'Trend', 
                      width: 100,
                      renderCell: (params) => (
                        params.value === 'up' ? (
                          <TrendingUp color="success" />
                        ) : (
                          <TrendingDown color="error" />
                        )
                      )
                    },
                  ]}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountsBalancePage;