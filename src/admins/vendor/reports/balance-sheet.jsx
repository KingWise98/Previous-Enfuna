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
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  LinearProgress,
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
  AccountBalance,
  ShowChart,
  PieChart as PieChartIcon,
  AccountTree,
  ExpandMore,
  ExpandLess,
  Info,
  Visibility,
  VisibilityOff,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data
const balanceSheetData = {
  asOfDate: '2023-06-30',
  assets: {
    current: [
      { id: 1, name: 'Cash and Cash Equivalents', balance: 11000000, lastPeriod: 9500000, details: [
        { name: 'Petty Cash', balance: 500000 },
        { name: 'Business Checking', balance: 8500000 },
        { name: 'Savings Account', balance: 2000000 }
      ]},
      { id: 2, name: 'Accounts Receivable', balance: 4500000, lastPeriod: 3800000, details: [
        { name: 'Trade Receivables', balance: 4000000 },
        { name: 'Other Receivables', balance: 500000 }
      ]},
      { id: 3, name: 'Inventory', balance: 6800000, lastPeriod: 7200000, details: [
        { name: 'Finished Goods', balance: 3500000 },
        { name: 'Work in Progress', balance: 1800000 },
        { name: 'Raw Materials', balance: 1500000 }
      ]},
      { id: 4, name: 'Prepaid Expenses', balance: 1200000, lastPeriod: 1100000, details: []}
    ],
    fixed: [
      { id: 5, name: 'Property, Plant & Equipment', balance: 25000000, lastPeriod: 24000000, details: [
        { name: 'Land', balance: 8000000 },
        { name: 'Buildings', balance: 12000000 },
        { name: 'Equipment', balance: 5000000 }
      ]},
      { id: 6, name: 'Less: Accumulated Depreciation', balance: -8000000, lastPeriod: -7000000, details: []},
      { id: 7, name: 'Intangible Assets', balance: 5000000, lastPeriod: 5000000, details: [
        { name: 'Goodwill', balance: 3000000 },
        { name: 'Patents', balance: 2000000 }
      ]}
    ]
  },
  liabilities: {
    current: [
      { id: 8, name: 'Accounts Payable', balance: 3800000, lastPeriod: 3500000, details: []},
      { id: 9, name: 'Short-Term Loans', balance: 5000000, lastPeriod: 6000000, details: []},
      { id: 10, name: 'Accrued Expenses', balance: 1500000, lastPeriod: 1200000, details: [
        { name: 'Wages Payable', balance: 800000 },
        { name: 'Taxes Payable', balance: 400000 },
        { name: 'Other Accruals', balance: 300000 }
      ]},
      { id: 11, name: 'Unearned Revenue', balance: 1200000, lastPeriod: 1000000, details: []}
    ],
    longTerm: [
      { id: 12, name: 'Long-Term Debt', balance: 10000000, lastPeriod: 11000000, details: []},
      { id: 13, name: 'Deferred Tax Liability', balance: 2000000, lastPeriod: 2000000, details: []},
      { id: 14, name: 'Lease Obligations', balance: 3000000, lastPeriod: 3500000, details: []}
    ]
  },
  equity: [
    { id: 15, name: 'Common Stock', balance: 10000000, lastPeriod: 10000000, details: []},
    { id: 16, name: 'Retained Earnings', balance: 18200000, lastPeriod: 15000000, details: []},
    { id: 17, name: 'Treasury Stock', balance: -2000000, lastPeriod: -1500000, details: []},
    { id: 18, name: 'Other Comprehensive Income', balance: 500000, lastPeriod: 400000, details: []}
  ]
};

// Calculate totals
const totalCurrentAssets = balanceSheetData.assets.current.reduce((sum, asset) => sum + asset.balance, 0);
const totalFixedAssets = balanceSheetData.assets.fixed.reduce((sum, asset) => sum + asset.balance, 0);
const totalAssets = totalCurrentAssets + totalFixedAssets;

const totalCurrentLiabilities = balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.balance, 0);
const totalLongTermLiabilities = balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.balance, 0);
const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

const totalEquity = balanceSheetData.equity.reduce((sum, equity) => sum + equity.balance, 0);
const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

// Chart data
const assetsBreakdownData = [
  { name: 'Current Assets', value: totalCurrentAssets },
  { name: 'Fixed Assets', value: totalFixedAssets }
];

const liabilitiesBreakdownData = [
  { name: 'Current Liabilities', value: totalCurrentLiabilities },
  { name: 'Long-Term Liabilities', value: totalLongTermLiabilities }
];

const equityBreakdownData = balanceSheetData.equity.map(item => ({
  name: item.name,
  value: item.balance
}));

const financialPositionData = [
  { name: 'Assets', value: totalAssets },
  { name: 'Liabilities', value: totalLiabilities },
  { name: 'Equity', value: totalEquity }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX'
  }).format(amount);
};

const formatPercentage = (value, total) => {
  return `${((value / total) * 100).toFixed(1)}%`;
};

// Helper components
const CircularProgressWithLabel = ({ value, ...props }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress 
        variant="determinate" 
        value={value} 
        color={value > 75 ? 'success' : value > 50 ? 'warning' : 'error'}
        {...props} 
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const LinearProgressWithLabel = ({ value, label, color = 'primary', ...props }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={value} 
        color={color}
        {...props} 
      />
    </Box>
  );
};

const BalanceSheetPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('thisQuarter');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [hiddenItems, setHiddenItems] = useState([]);

  // Financial ratios
  const currentRatio = totalCurrentAssets / totalCurrentLiabilities;
  const debtToEquityRatio = totalLiabilities / totalEquity;
  const workingCapital = totalCurrentAssets - totalCurrentLiabilities;
  
  // Sample financial health scores
  const financialHealthScore = 82;
  const liquidityScore = 75;
  const solvencyScore = 65;
  const profitabilityScore = 88;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleItemExpand = (itemId) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const toggleItemVisibility = (itemId) => {
    setHiddenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const filteredAssets = {
    current: balanceSheetData.assets.current.filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    fixed: balanceSheetData.assets.fixed.filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  const filteredLiabilities = {
    current: balanceSheetData.liabilities.current.filter(liability => 
      liability.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    longTerm: balanceSheetData.liabilities.longTerm.filter(liability => 
      liability.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  const filteredEquity = balanceSheetData.equity.filter(equity => 
    equity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Balance Sheet</Typography>
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
                <InputLabel>As of Date</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="As of Date"
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
                  <MenuItem value="custom">Custom Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
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
            
            <Grid item xs={12} md={3}>
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Showing balance sheet as of: <strong>{balanceSheetData.asOfDate}</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Assets
                <Tooltip title="Sum of all assets (current and fixed)">
                  <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(totalAssets)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" color="#4caf50">
                  +8.5% from last period
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
                <Tooltip title="Sum of all liabilities (current and long-term)">
                  <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color="error.main">
                {formatCurrency(totalLiabilities)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                <Typography variant="body2" color="#f44336">
                  -4.2% from last period
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
                  +12.7% from last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Financial Position
                <Tooltip title="Assets minus Liabilities">
                  <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color={totalAssets >= totalLiabilities ? "success.main" : "error.main"}>
                {formatCurrency(totalAssets - totalLiabilities)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {totalAssets >= totalLiabilities ? (
                  <>
                    <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                    <Typography variant="body2" color="#4caf50">
                      +15.2% from last period
                    </Typography>
                  </>
                ) : (
                  <>
                    <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                    <Typography variant="body2" color="#f44336">
                      -8.5% from last period
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
            <Tab label="Standard View" icon={<AccountBalance />} iconPosition="start" />
            <Tab label="Visual Analysis" icon={<PieChartIcon />} iconPosition="start" />
            <Tab label="Trend Analysis" icon={<ShowChart />} iconPosition="start" />
            <Tab label="Detailed View" icon={<AccountTree />} iconPosition="start" />
          </Tabs>

          {/* Standard View Tab */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Standard Balance Sheet
                  <Tooltip title="Traditional balance sheet presentation following GAAP standards">
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
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Assets
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {balanceSheetData.asOfDate}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Previous Period
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Change
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* Current Assets */}
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Current Assets
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {filteredAssets.current.map((asset) => (
                      <React.Fragment key={`asset-${asset.id}`}>
                        <TableRow sx={{ 
                          backgroundColor: hiddenItems.includes(asset.id) ? '#f5f5f5' : 'inherit',
                          opacity: hiddenItems.includes(asset.id) ? 0.6 : 1
                        }}>
                          <TableCell width={50}>
                            <IconButton 
                              size="small" 
                              onClick={() => toggleItemVisibility(asset.id)}
                            >
                              {hiddenItems.includes(asset.id) ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            {asset.details.length > 0 && (
                              <IconButton 
                                size="small" 
                                onClick={() => toggleItemExpand(asset.id)}
                              >
                                {expandedItems.includes(asset.id) ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(asset.balance)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(asset.lastPeriod)}
                          </TableCell>
                          <TableCell align="right" sx={{ 
                            color: asset.balance >= asset.lastPeriod ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}>
                            {formatCurrency(asset.balance - asset.lastPeriod)}
                            {asset.balance !== asset.lastPeriod && (
                              <Typography variant="caption" display="block" sx={{
                                color: asset.balance >= asset.lastPeriod ? 'success.main' : 'error.main'
                              }}>
                                {formatPercentage(
                                  Math.abs(asset.balance - asset.lastPeriod), 
                                  asset.lastPeriod
                                )}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                        {expandedItems.includes(asset.id) && asset.details.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ p: 0 }}>
                              <Collapse in={expandedItems.includes(asset.id)} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 6, pr: 2, py: 1, backgroundColor: '#f9f9f9' }}>
                                  <Table size="small">
                                    <TableBody>
                                      {asset.details.map((detail, index) => (
                                        <TableRow key={`detail-${asset.id}-${index}`}>
                                          <TableCell>{detail.name}</TableCell>
                                          <TableCell colSpan={3}></TableCell>
                                          <TableCell align="right">
                                            {formatCurrency(detail.balance)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                    <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          Total Current Assets
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalCurrentAssets)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          balanceSheetData.assets.current.reduce((sum, asset) => sum + asset.lastPeriod, 0)
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: totalCurrentAssets >= 
                          balanceSheetData.assets.current.reduce((sum, asset) => sum + asset.lastPeriod, 0) 
                          ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(
                          totalCurrentAssets - 
                          balanceSheetData.assets.current.reduce((sum, asset) => sum + asset.lastPeriod, 0)
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {/* Fixed Assets */}
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Fixed Assets
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {filteredAssets.fixed.map((asset) => (
                      <React.Fragment key={`asset-${asset.id}`}>
                        <TableRow sx={{ 
                          backgroundColor: hiddenItems.includes(asset.id) ? '#f5f5f5' : 'inherit',
                          opacity: hiddenItems.includes(asset.id) ? 0.6 : 1
                        }}>
                          <TableCell width={50}>
                            <IconButton 
                              size="small" 
                              onClick={() => toggleItemVisibility(asset.id)}
                            >
                              {hiddenItems.includes(asset.id) ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            {asset.details.length > 0 && (
                              <IconButton 
                                size="small" 
                                onClick={() => toggleItemExpand(asset.id)}
                              >
                                {expandedItems.includes(asset.id) ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(asset.balance)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(asset.lastPeriod)}
                          </TableCell>
                          <TableCell align="right" sx={{ 
                            color: asset.balance >= asset.lastPeriod ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}>
                            {formatCurrency(asset.balance - asset.lastPeriod)}
                            {asset.balance !== asset.lastPeriod && (
                              <Typography variant="caption" display="block" sx={{
                                color: asset.balance >= asset.lastPeriod ? 'success.main' : 'error.main'
                              }}>
                                {formatPercentage(
                                  Math.abs(asset.balance - asset.lastPeriod), 
                                  asset.lastPeriod
                                )}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                        {expandedItems.includes(asset.id) && asset.details.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ p: 0 }}>
                              <Collapse in={expandedItems.includes(asset.id)} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 6, pr: 2, py: 1, backgroundColor: '#f9f9f9' }}>
                                  <Table size="small">
                                    <TableBody>
                                      {asset.details.map((detail, index) => (
                                        <TableRow key={`detail-${asset.id}-${index}`}>
                                          <TableCell>{detail.name}</TableCell>
                                          <TableCell colSpan={3}></TableCell>
                                          <TableCell align="right">
                                            {formatCurrency(detail.balance)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                    <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          Total Fixed Assets
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalFixedAssets)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          balanceSheetData.assets.fixed.reduce((sum, asset) => sum + asset.lastPeriod, 0)
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: totalFixedAssets >= 
                          balanceSheetData.assets.fixed.reduce((sum, asset) => sum + asset.lastPeriod, 0) 
                          ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(
                          totalFixedAssets - 
                          balanceSheetData.assets.fixed.reduce((sum, asset) => sum + asset.lastPeriod, 0)
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {/* Total Assets */}
                    <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          TOTAL ASSETS
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalAssets)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          balanceSheetData.assets.current.reduce((sum, asset) => sum + asset.lastPeriod, 0) +
                          balanceSheetData.assets.fixed.reduce((sum, asset) => sum + asset.lastPeriod, 0)
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: totalAssets >=
                          (balanceSheetData.assets.current.reduce((sum, asset) => sum + asset.lastPeriod, 0) +
                          balanceSheetData.assets.fixed.reduce((sum, asset) => sum + asset.lastPeriod, 0))
                          ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(
                          totalAssets -
                            (balanceSheetData.assets.current.reduce((sum, asset) => sum + asset.lastPeriod, 0) +
                            balanceSheetData.assets.fixed.reduce((sum, asset) => sum + asset.lastPeriod, 0))
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {/* Liabilities */}
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Liabilities and Equity
                        </Typography>
                      </TableCell>
                    </TableRow>
                    
                    {/* Current Liabilities */}
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Current Liabilities
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {filteredLiabilities.current.map((liability) => (
                      <React.Fragment key={`liability-${liability.id}`}>
                        <TableRow sx={{ 
                          backgroundColor: hiddenItems.includes(liability.id) ? '#f5f5f5' : 'inherit',
                          opacity: hiddenItems.includes(liability.id) ? 0.6 : 1
                        }}>
                          <TableCell width={50}>
                            <IconButton 
                              size="small" 
                              onClick={() => toggleItemVisibility(liability.id)}
                            >
                              {hiddenItems.includes(liability.id) ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            {liability.details.length > 0 && (
                              <IconButton 
                                size="small" 
                                onClick={() => toggleItemExpand(liability.id)}
                              >
                                {expandedItems.includes(liability.id) ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{liability.name}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(liability.balance)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(liability.lastPeriod)}
                          </TableCell>
                          <TableCell align="right" sx={{ 
                            color: liability.balance <= liability.lastPeriod ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}>
                            {formatCurrency(liability.balance - liability.lastPeriod)}
                            {liability.balance !== liability.lastPeriod && (
                              <Typography variant="caption" display="block" sx={{
                                color: liability.balance <= liability.lastPeriod ? 'success.main' : 'error.main'
                              }}>
                                {formatPercentage(
                                  Math.abs(liability.balance - liability.lastPeriod), 
                                  liability.lastPeriod
                                )}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                        {expandedItems.includes(liability.id) && liability.details.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ p: 0 }}>
                              <Collapse in={expandedItems.includes(liability.id)} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 6, pr: 2, py: 1, backgroundColor: '#f9f9f9' }}>
                                  <Table size="small">
                                    <TableBody>
                                      {liability.details.map((detail, index) => (
                                        <TableRow key={`detail-${liability.id}-${index}`}>
                                          <TableCell>{detail.name}</TableCell>
                                          <TableCell colSpan={3}></TableCell>
                                          <TableCell align="right">
                                            {formatCurrency(detail.balance)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                    <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          Total Current Liabilities
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalCurrentLiabilities)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0)
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: totalCurrentLiabilities <= 
                          balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0) 
                          ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(
                          totalCurrentLiabilities - 
                          balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0)
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {/* Long-Term Liabilities */}
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Long-Term Liabilities
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {filteredLiabilities.longTerm.map((liability) => (
                      <React.Fragment key={`liability-${liability.id}`}>
                        <TableRow sx={{ 
                          backgroundColor: hiddenItems.includes(liability.id) ? '#f5f5f5' : 'inherit',
                          opacity: hiddenItems.includes(liability.id) ? 0.6 : 1
                        }}>
                          <TableCell width={50}>
                            <IconButton 
                              size="small" 
                              onClick={() => toggleItemVisibility(liability.id)}
                            >
                              {hiddenItems.includes(liability.id) ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            {liability.details.length > 0 && (
                              <IconButton 
                                size="small" 
                                onClick={() => toggleItemExpand(liability.id)}
                              >
                                {expandedItems.includes(liability.id) ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{liability.name}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(liability.balance)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(liability.lastPeriod)}
                          </TableCell>
                          <TableCell align="right" sx={{ 
                            color: liability.balance <= liability.lastPeriod ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}>
                            {formatCurrency(liability.balance - liability.lastPeriod)}
                            {liability.balance !== liability.lastPeriod && (
                              <Typography variant="caption" display="block" sx={{
                                color: liability.balance <= liability.lastPeriod ? 'success.main' : 'error.main'
                              }}>
                                {formatPercentage(
                                  Math.abs(liability.balance - liability.lastPeriod), 
                                  liability.lastPeriod
                                )}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                        {expandedItems.includes(liability.id) && liability.details.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ p: 0 }}>
                              <Collapse in={expandedItems.includes(liability.id)} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 6, pr: 2, py: 1, backgroundColor: '#f9f9f9' }}>
                                  <Table size="small">
                                    <TableBody>
                                      {liability.details.map((detail, index) => (
                                        <TableRow key={`detail-${liability.id}-${index}`}>
                                          <TableCell>{detail.name}</TableCell>
                                          <TableCell colSpan={3}></TableCell>
                                          <TableCell align="right">
                                            {formatCurrency(detail.balance)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                    <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          Total Long-Term Liabilities
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalLongTermLiabilities)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0)
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: totalLongTermLiabilities <= 
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0) 
                          ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(
                          totalLongTermLiabilities - 
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0)
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {/* Total Liabilities */}
                    <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          TOTAL LIABILITIES
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalLiabilities)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0)
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: totalLiabilities <= 
                          (balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0))
                          ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(
                          totalLiabilities - 
                          (balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0))
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {/* Equity */}
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Shareholders' Equity
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {filteredEquity.map((equity) => (
                      <React.Fragment key={`equity-${equity.id}`}>
                        <TableRow sx={{ 
                          backgroundColor: hiddenItems.includes(equity.id) ? '#f5f5f5' : 'inherit',
                          opacity: hiddenItems.includes(equity.id) ? 0.6 : 1
                        }}>
                          <TableCell width={50}>
                            <IconButton 
                              size="small" 
                              onClick={() => toggleItemVisibility(equity.id)}
                            >
                              {hiddenItems.includes(equity.id) ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            {equity.details.length > 0 && (
                              <IconButton 
                                size="small" 
                                onClick={() => toggleItemExpand(equity.id)}
                              >
                                {expandedItems.includes(equity.id) ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{equity.name}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(equity.balance)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(equity.lastPeriod)}
                          </TableCell>
                          <TableCell align="right" sx={{ 
                            color: equity.balance >= equity.lastPeriod ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}>
                            {formatCurrency(equity.balance - equity.lastPeriod)}
                            {equity.balance !== equity.lastPeriod && (
                              <Typography variant="caption" display="block" sx={{
                                color: equity.balance >= equity.lastPeriod ? 'success.main' : 'error.main'
                              }}>
                                {formatPercentage(
                                  Math.abs(equity.balance - equity.lastPeriod), 
                                  equity.lastPeriod
                                )}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                        {expandedItems.includes(equity.id) && equity.details.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ p: 0 }}>
                              <Collapse in={expandedItems.includes(equity.id)} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 6, pr: 2, py: 1, backgroundColor: '#f9f9f9' }}>
                                  <Table size="small">
                                    <TableBody>
                                      {equity.details.map((detail, index) => (
                                        <TableRow key={`detail-${equity.id}-${index}`}>
                                          <TableCell>{detail.name}</TableCell>
                                          <TableCell colSpan={3}></TableCell>
                                          <TableCell align="right">
                                            {formatCurrency(detail.balance)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                    <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          Total Equity
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalEquity)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          balanceSheetData.equity.reduce((sum, equity) => sum + equity.lastPeriod, 0)
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: totalEquity >= 
                          balanceSheetData.equity.reduce((sum, equity) => sum + equity.lastPeriod, 0)
                          ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(
                          totalEquity - 
                          balanceSheetData.equity.reduce((sum, equity) => sum + equity.lastPeriod, 0)
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {/* Total Liabilities and Equity */}
                    <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">
                          TOTAL LIABILITIES AND EQUITY
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalLiabilitiesAndEquity)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.equity.reduce((sum, equity) => sum + equity.lastPeriod, 0)
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: totalLiabilitiesAndEquity >= 
                          (balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.equity.reduce((sum, equity) => sum + equity.lastPeriod, 0))
                          ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(
                          totalLiabilitiesAndEquity - 
                          (balanceSheetData.liabilities.current.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.liabilities.longTerm.reduce((sum, liability) => sum + liability.lastPeriod, 0) +
                          balanceSheetData.equity.reduce((sum, equity) => sum + equity.lastPeriod, 0))
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Visual Analysis Tab */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Visual Analysis
                  <Tooltip title="Graphical representation of balance sheet components">
                    <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  </Tooltip>
                </Typography>
                <Box>
                  <Button startIcon={<Refresh />} sx={{ mr: 1 }}>Refresh</Button>
                  <Button startIcon={<Download />}>Export</Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {/* Assets Breakdown */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" align="center" gutterBottom>
                        Assets Composition
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={assetsBreakdownData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {assetsBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Liabilities Breakdown */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" align="center" gutterBottom>
                        Liabilities Composition
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={liabilitiesBreakdownData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {liabilitiesBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Equity Breakdown */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" align="center" gutterBottom>
                        Equity Composition
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={equityBreakdownData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {equityBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Financial Position */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" align="center" gutterBottom>
                        Financial Position
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={financialPositionData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(value) => formatCurrency(value).replace('UGX', '')} />
                            <YAxis dataKey="name" type="category" />
                            <RechartsTooltip 
                              formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Amount">
                              {financialPositionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Trend Analysis Tab */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Trend Analysis
                  <Tooltip title="Historical trends of balance sheet components">
                    <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  </Tooltip>
                </Typography>
                <Box>
                  <Button startIcon={<Refresh />} sx={{ mr: 1 }}>Refresh</Button>
                  <Button startIcon={<Download />}>Export</Button>
                </Box>
              </Box>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Assets Trend
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Jan', current: 20000000, previous: 18000000 },
                          { name: 'Feb', current: 21000000, previous: 18500000 },
                          { name: 'Mar', current: 22000000, previous: 19000000 },
                          { name: 'Apr', current: 22500000, previous: 19500000 },
                          { name: 'May', current: 23000000, previous: 20000000 },
                          { name: 'Jun', current: 23500000, previous: 20500000 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('UGX', '')} />
                        <RechartsTooltip 
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend />
                        <Bar dataKey="current" fill="#4CAF50" name="Current Period" />
                        <Bar dataKey="previous" fill="#9E9E9E" name="Previous Period" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Liabilities Trend
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Jan', current: 15000000, previous: 16000000 },
                          { name: 'Feb', current: 14500000, previous: 15500000 },
                          { name: 'Mar', current: 14000000, previous: 15000000 },
                          { name: 'Apr', current: 13800000, previous: 14800000 },
                          { name: 'May', current: 13500000, previous: 14500000 },
                          { name: 'Jun', current: 13000000, previous: 14000000 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('UGX', '')} />
                        <RechartsTooltip 
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend />
                        <Bar dataKey="current" fill="#F44336" name="Current Period" />
                        <Bar dataKey="previous" fill="#9E9E9E" name="Previous Period" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Equity Trend
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                                                    { name: 'Jan', current: 5000000, previous: 4500000 },
                          { name: 'Feb', current: 5500000, previous: 4800000 },
                          { name: 'Mar', current: 6000000, previous: 5200000 },
                          { name: 'Apr', current: 6500000, previous: 5800000 },
                          { name: 'May', current: 7000000, previous: 6200000 },
                          { name: 'Jun', current: 7500000, previous: 6800000 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('UGX', '')} />
                        <RechartsTooltip 
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="current" 
                          stroke="#2196F3" 
                          strokeWidth={2}
                          name="Current Period"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="previous" 
                          stroke="#9E9E9E" 
                          strokeWidth={2}
                          name="Previous Period"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Detailed View Tab */}
          {activeTab === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Detailed View
                  <Tooltip title="Detailed breakdown of all accounts with historical comparisons">
                    <Info sx={{ fontSize: 16, ml: 1, color: 'action.active' }} />
                  </Tooltip>
                </Typography>
                <Box>
                  <Button startIcon={<Refresh />} sx={{ mr: 1 }}>Refresh</Button>
                  <Button startIcon={<Download />}>Export</Button>
                </Box>
              </Box>

              {/* Assets Section */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Assets</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Current Assets */}
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Current Assets</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {balanceSheetData.assets.current.map((asset) => (
                          <React.Fragment key={`detail-asset-${asset.id}`}>
                            <ListItem>
                              <ListItemText
                                primary={asset.name}
                                secondary={
                                  <React.Fragment>
                                    <Typography variant="body2" component="span">
                                      Current: {formatCurrency(asset.balance)}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Previous: {formatCurrency(asset.lastPeriod)}
                                    </Typography>
                                    <br />
                                    <Typography 
                                      variant="body2" 
                                      color={asset.balance >= asset.lastPeriod ? 'success.main' : 'error.main'}
                                    >
                                      Change: {formatCurrency(asset.balance - asset.lastPeriod)} (
                                      {formatPercentage(
                                        Math.abs(asset.balance - asset.lastPeriod),
                                        asset.lastPeriod
                                      )})
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                              {asset.details.length > 0 && (
                                <IconButton onClick={() => toggleItemExpand(asset.id)}>
                                  {expandedItems.includes(asset.id) ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              )}
                            </ListItem>
                            {expandedItems.includes(asset.id) && asset.details.length > 0 && (
                              <List component="div" disablePadding sx={{ pl: 4 }}>
                                {asset.details.map((detail, index) => (
                                  <ListItem key={`detail-asset-${asset.id}-${index}`}>
                                    <ListItemText
                                      primary={detail.name}
                                      secondary={formatCurrency(detail.balance)}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  {/* Fixed Assets */}
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Fixed Assets</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {balanceSheetData.assets.fixed.map((asset) => (
                          <React.Fragment key={`detail-fixed-${asset.id}`}>
                            <ListItem>
                              <ListItemText
                                primary={asset.name}
                                secondary={
                                  <React.Fragment>
                                    <Typography variant="body2" component="span">
                                      Current: {formatCurrency(asset.balance)}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Previous: {formatCurrency(asset.lastPeriod)}
                                    </Typography>
                                    <br />
                                    <Typography 
                                      variant="body2" 
                                      color={asset.balance >= asset.lastPeriod ? 'success.main' : 'error.main'}
                                    >
                                      Change: {formatCurrency(asset.balance - asset.lastPeriod)} (
                                      {formatPercentage(
                                        Math.abs(asset.balance - asset.lastPeriod),
                                        asset.lastPeriod
                                      )})
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                              {asset.details.length > 0 && (
                                <IconButton onClick={() => toggleItemExpand(asset.id)}>
                                  {expandedItems.includes(asset.id) ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              )}
                            </ListItem>
                            {expandedItems.includes(asset.id) && asset.details.length > 0 && (
                              <List component="div" disablePadding sx={{ pl: 4 }}>
                                {asset.details.map((detail, index) => (
                                  <ListItem key={`detail-fixed-${asset.id}-${index}`}>
                                    <ListItemText
                                      primary={detail.name}
                                      secondary={formatCurrency(detail.balance)}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </AccordionDetails>
              </Accordion>

              {/* Liabilities Section */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Liabilities</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Current Liabilities */}
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Current Liabilities</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {balanceSheetData.liabilities.current.map((liability) => (
                          <React.Fragment key={`detail-liability-${liability.id}`}>
                            <ListItem>
                              <ListItemText
                                primary={liability.name}
                                secondary={
                                  <React.Fragment>
                                    <Typography variant="body2" component="span">
                                      Current: {formatCurrency(liability.balance)}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Previous: {formatCurrency(liability.lastPeriod)}
                                    </Typography>
                                    <br />
                                    <Typography 
                                      variant="body2" 
                                      color={liability.balance <= liability.lastPeriod ? 'success.main' : 'error.main'}
                                    >
                                      Change: {formatCurrency(liability.balance - liability.lastPeriod)} (
                                      {formatPercentage(
                                        Math.abs(liability.balance - liability.lastPeriod),
                                        liability.lastPeriod
                                      )})
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                              {liability.details.length > 0 && (
                                <IconButton onClick={() => toggleItemExpand(liability.id)}>
                                  {expandedItems.includes(liability.id) ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              )}
                            </ListItem>
                            {expandedItems.includes(liability.id) && liability.details.length > 0 && (
                              <List component="div" disablePadding sx={{ pl: 4 }}>
                                {liability.details.map((detail, index) => (
                                  <ListItem key={`detail-liability-${liability.id}-${index}`}>
                                    <ListItemText
                                      primary={detail.name}
                                      secondary={formatCurrency(detail.balance)}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  {/* Long-Term Liabilities */}
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Long-Term Liabilities</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {balanceSheetData.liabilities.longTerm.map((liability) => (
                          <React.Fragment key={`detail-longterm-${liability.id}`}>
                            <ListItem>
                              <ListItemText
                                primary={liability.name}
                                secondary={
                                  <React.Fragment>
                                    <Typography variant="body2" component="span">
                                      Current: {formatCurrency(liability.balance)}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Previous: {formatCurrency(liability.lastPeriod)}
                                    </Typography>
                                    <br />
                                    <Typography 
                                      variant="body2" 
                                      color={liability.balance <= liability.lastPeriod ? 'success.main' : 'error.main'}
                                    >
                                      Change: {formatCurrency(liability.balance - liability.lastPeriod)} (
                                      {formatPercentage(
                                        Math.abs(liability.balance - liability.lastPeriod),
                                        liability.lastPeriod
                                      )})
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                              {liability.details.length > 0 && (
                                <IconButton onClick={() => toggleItemExpand(liability.id)}>
                                  {expandedItems.includes(liability.id) ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              )}
                            </ListItem>
                            {expandedItems.includes(liability.id) && liability.details.length > 0 && (
                              <List component="div" disablePadding sx={{ pl: 4 }}>
                                {liability.details.map((detail, index) => (
                                  <ListItem key={`detail-longterm-${liability.id}-${index}`}>
                                    <ListItemText
                                      primary={detail.name}
                                      secondary={formatCurrency(detail.balance)}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </AccordionDetails>
              </Accordion>

              {/* Equity Section */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Equity</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {balanceSheetData.equity.map((equity) => (
                      <React.Fragment key={`detail-equity-${equity.id}`}>
                        <ListItem>
                          <ListItemText
                            primary={equity.name}
                            secondary={
                              <React.Fragment>
                                <Typography variant="body2" component="span">
                                  Current: {formatCurrency(equity.balance)}
                                </Typography>
                                <br />
                                <Typography variant="body2" component="span">
                                  Previous: {formatCurrency(equity.lastPeriod)}
                                </Typography>
                                <br />
                                <Typography 
                                  variant="body2" 
                                  color={equity.balance >= equity.lastPeriod ? 'success.main' : 'error.main'}
                                >
                                  Change: {formatCurrency(equity.balance - equity.lastPeriod)} (
                                  {formatPercentage(
                                    Math.abs(equity.balance - equity.lastPeriod),
                                    equity.lastPeriod
                                  )})
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          {equity.details.length > 0 && (
                            <IconButton onClick={() => toggleItemExpand(equity.id)}>
                              {expandedItems.includes(equity.id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          )}
                        </ListItem>
                        {expandedItems.includes(equity.id) && equity.details.length > 0 && (
                          <List component="div" disablePadding sx={{ pl: 4 }}>
                            {equity.details.map((detail, index) => (
                              <ListItem key={`detail-equity-${equity.id}-${index}`}>
                                <ListItemText
                                  primary={detail.name}
                                  secondary={formatCurrency(detail.balance)}
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BalanceSheetPage;