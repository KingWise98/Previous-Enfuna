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
  Tabs,
  Tab,
  Select,
  MenuItem,
  TextField,
  Button,
  useTheme,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';

// Exchange rates (example rates - in a real app, you'd fetch these from an API)
const exchangeRates = {
  UGX: 1,
  USD: 0.00027,
  EUR: 0.00025,
  GBP: 0.00021,
  JPY: 0.042
};

// Sample data for the cash flow statement
const cashFlowData = {
  operatingActivities: [
    { id: 1, item: 'Net Income', currentPeriod: 1250000, previousPeriod: 980000, variance: 270000, variancePct: 27.55 },
    { id: 2, item: 'Depreciation & Amortization', currentPeriod: 450000, previousPeriod: 420000, variance: 30000, variancePct: 7.14 },
    { id: 3, item: 'Accounts Receivable', currentPeriod: -180000, previousPeriod: -150000, variance: -30000, variancePct: -20.00 },
    { id: 4, item: 'Inventory', currentPeriod: -220000, previousPeriod: -180000, variance: -40000, variancePct: -22.22 },
    { id: 5, item: 'Accounts Payable', currentPeriod: 350000, previousPeriod: 310000, variance: 40000, variancePct: 12.90 },
    { id: 6, item: 'Other Working Capital', currentPeriod: -80000, previousPeriod: -60000, variance: -20000, variancePct: -33.33 },
    { id: 7, item: 'Taxes Paid', currentPeriod: -320000, previousPeriod: -280000, variance: -40000, variancePct: -14.29 },
    { id: 8, item: 'Interest Paid', currentPeriod: -150000, previousPeriod: -120000, variance: -30000, variancePct: -25.00 },
  ],
  investingActivities: [
    { id: 1, item: 'Capital Expenditures', currentPeriod: -750000, previousPeriod: -600000, variance: -150000, variancePct: -25.00 },
    { id: 2, item: 'Acquisitions', currentPeriod: -250000, previousPeriod: 0, variance: -250000, variancePct: 0 },
    { id: 3, item: 'Purchases of Investments', currentPeriod: -500000, previousPeriod: -400000, variance: -100000, variancePct: -25.00 },
    { id: 4, item: 'Sales of Investments', currentPeriod: 300000, previousPeriod: 250000, variance: 50000, variancePct: 20.00 },
    { id: 5, item: 'Other Investing Activities', currentPeriod: -50000, previousPeriod: -30000, variance: -20000, variancePct: -66.67 },
  ],
  financingActivities: [
    { id: 1, item: 'Debt Issued', currentPeriod: 1000000, previousPeriod: 800000, variance: 200000, variancePct: 25.00 },
    { id: 2, item: 'Debt Repayment', currentPeriod: -400000, previousPeriod: -350000, variance: -50000, variancePct: -14.29 },
    { id: 3, item: 'Common Stock Issued', currentPeriod: 200000, previousPeriod: 150000, variance: 50000, variancePct: 33.33 },
    { id: 4, item: 'Dividends Paid', currentPeriod: -300000, previousPeriod: -250000, variance: -50000, variancePct: -20.00 },
    { id: 5, item: 'Other Financing Activities', currentPeriod: -100000, previousPeriod: -80000, variance: -20000, variancePct: -25.00 },
  ],
  summary: {
    operating: 420000,
    investing: -1250000,
    financing: 400000,
    netChange: -430000,
    beginningCash: 2500000,
    endingCash: 2070000
  }
};

// Chart data
const cashFlowTrendData = [
  { name: 'Jan', operating: 120, investing: -80, financing: 60 },
  { name: 'Feb', operating: 150, investing: -90, financing: 70 },
  { name: 'Mar', operating: 180, investing: -100, financing: 80 },
  { name: 'Apr', operating: 200, investing: -120, financing: 90 },
  { name: 'May', operating: 220, investing: -150, financing: 100 },
  { name: 'Jun', operating: 250, investing: -180, financing: 110 },
  { name: 'Jul', operating: 280, investing: -200, financing: 120 },
  { name: 'Aug', operating: 300, investing: -220, financing: 130 },
  { name: 'Sep', operating: 320, investing: -250, financing: 140 },
  { name: 'Oct', operating: 350, investing: -280, financing: 150 },
  { name: 'Nov', operating: 380, investing: -300, financing: 160 },
  { name: 'Dec', operating: 420, investing: -320, financing: 170 },
];

const cashFlowDistributionData = [
  { name: 'Operating', value: 420 },
  { name: 'Investing', value: -1250 },
  { name: 'Financing', value: 400 },
];

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

const CashFlowStatement = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [timePeriod, setTimePeriod] = useState('Q2 2024');
  const [currency, setCurrency] = useState('UGX');
  const [viewMode, setViewMode] = useState('detailed');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const convertCurrency = (value) => {
    return value * exchangeRates[currency];
  };

  const formatCurrency = (value) => {
    const convertedValue = convertCurrency(value);
    
    const currencyOptions = {
      UGX: {
        style: 'currency',
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      USD: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      EUR: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      GBP: {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      JPY: {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    };

    return new Intl.NumberFormat('en-US', currencyOptions[currency]).format(convertedValue);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value / 100);
  };

  const renderVariance = (value, percentage) => {
    const isPositive = value >= 0;
    return (
      <Box display="flex" alignItems="center" color={isPositive ? theme.palette.success.main : theme.palette.error.main}>
        {isPositive ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        <Typography variant="body2">
          {formatCurrency(Math.abs(value))} ({isPositive ? '+' : ''}{formatPercentage(percentage)})
        </Typography>
      </Box>
    );
  };

  const renderActivityRow = (row) => {
    return (
      <TableRow key={row.id}>
        <TableCell sx={{ pl: 4 }}>{row.item}</TableCell>
        <TableCell align="right">{formatCurrency(row.currentPeriod)}</TableCell>
        <TableCell align="right">{formatCurrency(row.previousPeriod)}</TableCell>
        <TableCell align="right">
          {renderVariance(row.variance, row.variancePct)}
        </TableCell>
      </TableRow>
    );
  };

  const renderSummaryCard = (title, value, icon, color) => {
    const isPositive = value >= 0;
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark`, width: 40, height: 40 }}>
              {icon}
            </Avatar>
          </Box>
          <Typography variant="h5" component="div" color={isPositive ? 'success.main' : 'error.main'}>
            {formatCurrency(value)}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            {isPositive ? (
              <TrendingUpIcon fontSize="small" color="success" />
            ) : (
              <TrendingDownIcon fontSize="small" color="error" />
            )}
            <Typography variant="caption" ml={0.5} color={isPositive ? 'success.main' : 'error.main'}>
              {isPositive ? 'Positive' : 'Negative'} cash flow
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Convert chart data based on selected currency
  const getConvertedChartData = () => {
    return cashFlowTrendData.map(item => ({
      ...item,
      operating: convertCurrency(item.operating * 1000),
      investing: convertCurrency(item.investing * 1000),
      financing: convertCurrency(item.financing * 1000)
    }));
  };

  const getConvertedDistributionData = () => {
    return cashFlowDistributionData.map(item => ({
      ...item,
      value: convertCurrency(item.value * 1000)
    }));
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Cash Flow Statement
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Comprehensive view of cash inflows and outflows
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
            startAdornment={<CalendarIcon color="action" sx={{ mr: 1 }} />}
          >
            <MenuItem value="Q1 2024">Q1 2024</MenuItem>
            <MenuItem value="Q2 2024">Q2 2024</MenuItem>
            <MenuItem value="Q3 2024">Q3 2024</MenuItem>
            <MenuItem value="Q4 2024">Q4 2024</MenuItem>
            <MenuItem value="FY 2024">FY 2024</MenuItem>
          </Select>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            size="small"
            sx={{ minWidth: 90 }}
          >
            <MenuItem value="UGX">UGX</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
            <MenuItem value="JPY">JPY</MenuItem>
          </Select>
          <Box display="flex">
            <IconButton>
              <DownloadIcon />
            </IconButton>
            <IconButton>
              <PrintIcon />
            </IconButton>
            <IconButton>
              <EmailIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          {renderSummaryCard(
            'Net Cash from Operations',
            cashFlowData.summary.operating,
            <AccountBalanceIcon />,
            'success'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderSummaryCard(
            'Net Cash from Investing',
            cashFlowData.summary.investing,
            <ShowChartIcon />,
            'error'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderSummaryCard(
            'Net Cash from Financing',
            cashFlowData.summary.financing,
            <AttachMoneyIcon />,
            'info'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="textSecondary" gutterBottom>
                  Net Change in Cash
                </Typography>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark', width: 40, height: 40 }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
              <Typography variant="h5" component="div" color={cashFlowData.summary.netChange >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(cashFlowData.summary.netChange)}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="caption">
                  Beginning: {formatCurrency(cashFlowData.summary.beginningCash)}
                </Typography>
                <Typography variant="caption">
                  Ending: {formatCurrency(cashFlowData.summary.endingCash)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Cash Flow Trend (Last 12 Months)
                </Typography>
                <Box display="flex" alignItems="center">
                  <Chip label="Operating" size="small" sx={{ bgcolor: '#0088FE10', color: '#0088FE', mr: 1 }} />
                  <Chip label="Investing" size="small" sx={{ bgcolor: '#FF804210', color: '#FF8042', mr: 1 }} />
                  <Chip label="Financing" size="small" sx={{ bgcolor: '#00C49F10', color: '#00C49F' }} />
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getConvertedChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="operating" stroke="#0088FE" strokeWidth={2} name="Operating" />
                  <Line type="monotone" dataKey="investing" stroke="#FF8042" strokeWidth={2} name="Investing" />
                  <Line type="monotone" dataKey="financing" stroke="#00C49F" strokeWidth={2} name="Financing" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Cash Flow Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getConvertedDistributionData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {cashFlowDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Cash Flow Statement */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Detailed Cash Flow Statement
            </Typography>
            <Box display="flex" alignItems="center">
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ minHeight: 36 }}>
                <Tab label="Operating" sx={{ minHeight: 36, py: 0 }} />
                <Tab label="Investing" sx={{ minHeight: 36, py: 0 }} />
                <Tab label="Financing" sx={{ minHeight: 36, py: 0 }} />
              </Tabs>
              <Tooltip title="View options">
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {activeTab === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box display="flex" alignItems="center">
                        <Typography fontWeight="bold">Cash Flows from Operating Activities</Typography>
                        <Tooltip title="Cash generated from core business operations">
                          <InfoIcon color="action" fontSize="small" sx={{ ml: 1 }} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Current Period</TableCell>
                    <TableCell align="right">Previous Period</TableCell>
                    <TableCell align="right">Variance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cashFlowData.operatingActivities.map(renderActivityRow)}
                  <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Net Cash Provided by Operating Activities</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(cashFlowData.summary.operating)}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box display="flex" alignItems="center">
                        <Typography fontWeight="bold">Cash Flows from Investing Activities</Typography>
                        <Tooltip title="Cash used for investments in capital assets and securities">
                          <InfoIcon color="action" fontSize="small" sx={{ ml: 1 }} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Current Period</TableCell>
                    <TableCell align="right">Previous Period</TableCell>
                    <TableCell align="right">Variance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cashFlowData.investingActivities.map(renderActivityRow)}
                  <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Net Cash Used in Investing Activities</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(cashFlowData.summary.investing)}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 2 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box display="flex" alignItems="center">
                        <Typography fontWeight="bold">Cash Flows from Financing Activities</Typography>
                        <Tooltip title="Cash from issuing/paying debt and equity transactions">
                          <InfoIcon color="action" fontSize="small" sx={{ ml: 1 }} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Current Period</TableCell>
                    <TableCell align="right">Previous Period</TableCell>
                    <TableCell align="right">Variance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cashFlowData.financingActivities.map(renderActivityRow)}
                  <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Net Cash Provided by Financing Activities</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(cashFlowData.summary.financing)}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Cash Flow Summary */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Cash Flow Summary
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Net Cash from Operating Activities</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                        {formatCurrency(cashFlowData.summary.operating)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Net Cash from Investing Activities</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                        {formatCurrency(cashFlowData.summary.investing)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Net Cash from Financing Activities</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                        {formatCurrency(cashFlowData.summary.financing)}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ '& td': { borderBottom: 'none' } }}>
                      <TableCell sx={{ fontWeight: 'bold', pt: 2 }}>Net Change in Cash</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', pt: 2, 
                        color: cashFlowData.summary.netChange >= 0 ? theme.palette.success.main : theme.palette.error.main 
                      }}>
                        {formatCurrency(cashFlowData.summary.netChange)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Beginning Cash Balance</TableCell>
                      <TableCell align="right">{formatCurrency(cashFlowData.summary.beginningCash)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ending Cash Balance</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(cashFlowData.summary.endingCash)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Cash Flow Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Operating', value: cashFlowData.summary.operating },
                    { name: 'Investing', value: cashFlowData.summary.investing },
                    { name: 'Financing', value: cashFlowData.summary.financing },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <ChartTooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="value" name="Cash Flow" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Analysis:</strong> {cashFlowData.summary.netChange >= 0 ? 
                    'Positive net cash flow indicates healthy liquidity position.' : 
                    'Negative net cash flow requires attention to working capital management.'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notes Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Notes to Cash Flow Statement
          </Typography>
          <Typography variant="body2" paragraph>
            1. <strong>Operating Activities:</strong> Cash flows from core business operations include adjustments for non-cash items and changes in working capital.
          </Typography>
          <Typography variant="body2" paragraph>
            2. <strong>Investing Activities:</strong> Includes capital expenditures, acquisitions, and purchases/sales of investments.
          </Typography>
          <Typography variant="body2" paragraph>
            3. <strong>Financing Activities:</strong> Comprises proceeds from debt/equity issuance, repayments, and dividend payments.
          </Typography>
          <Typography variant="body2" paragraph>
            4. All amounts are presented in {currency} and rounded to the nearest thousand.
          </Typography>
          <Typography variant="body2">
            5. The statement has been prepared in accordance with {currency === 'UGX' ? 'GAAP' : 'IFRS'} standards.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CashFlowStatement;