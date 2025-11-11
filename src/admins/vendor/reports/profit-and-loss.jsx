import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Tabs, Tab, IconButton, Tooltip,
  Collapse, LinearProgress, CircularProgress, useTheme
} from '@mui/material';
import {
  Search, FilterList, Refresh, DateRange, Download, PictureAsPdf, GridOn,
  Print, ShowChart, PieChart as PieChartIcon, ExpandMore, ExpandLess,
  TrendingUp, TrendingDown, Info
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample P&L Data
const profitLossData = {
  period: 'Q3 2023',
  revenues: {
    main: [
      { id: 1, name: 'Product Sales', current: 2500000, previous: 2100000, details: [
        { name: 'Online Sales', amount: 1800000 },
        { name: 'Retail Sales', amount: 700000 }
      ]},
      { id: 2, name: 'Service Income', current: 500000, previous: 450000, details: []}
    ],
    other: [
      { id: 3, name: 'Interest Income', current: 30000, previous: 25000, details: []}
    ]
  },
  cogs: [
    { id: 4, name: 'Material Costs', current: 900000, previous: 750000, details: [
      { name: 'Raw Materials', amount: 600000 },
      { name: 'Packaging', amount: 300000 }
    ]},
    { id: 5, name: 'Direct Labor', current: 400000, previous: 350000, details: []}
  ],
  operatingExpenses: [
    { id: 6, name: 'Marketing', current: 200000, previous: 180000, details: []},
    { id: 7, name: 'Rent', current: 150000, previous: 150000, details: []},
    { id: 8, name: 'Salaries', current: 300000, previous: 280000, details: []}
  ],
  taxes: 150000,
  interest: 50000
};

// Calculations
const totalRevenue = profitLossData.revenues.main.reduce((s, r) => s + r.current, 0) +
                   profitLossData.revenues.other.reduce((s, r) => s + r.current, 0);
const totalCOGS = profitLossData.cogs.reduce((s, c) => s + c.current, 0);
const grossProfit = totalRevenue - totalCOGS;
const totalOpEx = profitLossData.operatingExpenses.reduce((s, e) => s + e.current, 0);
const operatingIncome = grossProfit - totalOpEx;
const netIncome = operatingIncome - profitLossData.interest - profitLossData.taxes;

// Chart Data
const revenueData = [
  { name: 'Product Sales', value: profitLossData.revenues.main[0].current },
  { name: 'Service Income', value: profitLossData.revenues.main[1].current },
  { name: 'Other Income', value: profitLossData.revenues.other[0].current }
];

const expenseData = [
  { name: 'COGS', value: totalCOGS },
  { name: 'OpEx', value: totalOpEx },
  { name: 'Taxes', value: profitLossData.taxes },
  { name: 'Interest', value: profitLossData.interest }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const formatCurrency = (amount) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'UGX' }).format(amount);

const formatPercentage = (value, total) => 
  `${((value / total) * 100).toFixed(1)}%`;

const ProfitLossPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('current');

  const toggleExpand = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const renderAccountRow = (account, level = 0) => (
    <React.Fragment key={account.id}>
      <TableRow sx={{ backgroundColor: level === 0 ? '#fff' : '#f9f9f9' }}>
        <TableCell sx={{ pl: level * 4 + 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {account.details?.length > 0 && (
              <IconButton size="small" onClick={() => toggleExpand(account.id)}>
                {expanded.includes(account.id) ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            {account.name}
          </Box>
        </TableCell>
        <TableCell align="right">
          {formatCurrency(account.current)}
        </TableCell>
        <TableCell align="right">
          {formatCurrency(account.previous)}
        </TableCell>
        <TableCell align="right" sx={{ 
          color: account.current >= account.previous ? 'success.main' : 'error.main' 
        }}>
          {formatCurrency(account.current - account.previous)}
          <Typography variant="caption" display="block">
            {formatPercentage(
              Math.abs(account.current - account.previous),
              account.previous
            )}
          </Typography>
        </TableCell>
      </TableRow>
      {expanded.includes(account.id) && account.details?.map(detail => (
        <TableRow key={detail.name} sx={{ backgroundColor: '#f9f9f9' }}>
          <TableCell sx={{ pl: (level + 1) * 4 + 2 }}>{detail.name}</TableCell>
          <TableCell align="right">{formatCurrency(detail.amount)}</TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">-</TableCell>
        </TableRow>
      ))}
    </React.Fragment>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Profit & Loss Statement</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<GridOn />}>Export</Button>
          <Button variant="outlined" startIcon={<Print />}>Print</Button>
        </Box>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Accounts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <Search /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Reporting Period</InputLabel>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  startAdornment={<DateRange />}
                >
                  <MenuItem value="current">Current Period</MenuItem>
                  <MenuItem value="previous">Previous Period</MenuItem>
                  <MenuItem value="ytd">Year-to-Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth variant="contained" startIcon={<FilterList />}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Revenue
                <Tooltip title="Sum of all revenue streams">
                  <Info sx={{ fontSize: 16, ml: 1 }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(totalRevenue)}
              </Typography>
              <LinearProgressWithLabel 
                value={(totalRevenue / (totalRevenue * 2)) * 100}
                label="Revenue Growth"
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Net Income
                <Tooltip title="Final profit after all deductions">
                  <Info sx={{ fontSize: 16, ml: 1 }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color={netIncome >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(netIncome)}
              </Typography>
              <CircularProgressWithLabel 
                value={(netIncome / totalRevenue) * 100}
                label="Profit Margin"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Operating Income
                <Tooltip title="Profit before interest and taxes">
                  <Info sx={{ fontSize: 16, ml: 1 }} />
                </Tooltip>
              </Typography>
              <Typography variant="h4" color={operatingIncome >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(operatingIncome)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {operatingIncome >= 0 ? (
                  <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                )}
                <Typography variant="body2">
                  {formatPercentage(Math.abs(operatingIncome), totalRevenue)} margin
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Standard View" icon={<ShowChart />} />
        <Tab label="Visual Analysis" icon={<PieChartIcon />} />
        <Tab label="Trends" icon={<TrendingUp />} />
      </Tabs>

      {/* Standard View */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Account</TableCell>
                    <TableCell align="right">Current Period</TableCell>
                    <TableCell align="right">Previous Period</TableCell>
                    <TableCell align="right">Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Revenue
                    </TableCell>
                  </TableRow>
                  {profitLossData.revenues.main.map(account => renderAccountRow(account))}
                  {profitLossData.revenues.other.map(account => renderAccountRow(account))}

                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Total Revenue</TableCell>
                    <TableCell align="right">{formatCurrency(totalRevenue)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(totalRevenue - (totalRevenue - (totalRevenue * 0.8)))}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>
                      +20%
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={4} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Cost of Goods Sold
                    </TableCell>
                  </TableRow>
                  {profitLossData.cogs.map(account => renderAccountRow(account))}

                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Gross Profit</TableCell>
                    <TableCell align="right">{formatCurrency(grossProfit)}</TableCell>
                    <TableCell align="right">{formatCurrency(grossProfit * 0.9)}</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>+11%</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={4} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Operating Expenses
                    </TableCell>
                  </TableRow>
                  {profitLossData.operatingExpenses.map(account => renderAccountRow(account))}

                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Operating Income</TableCell>
                    <TableCell align="right">{formatCurrency(operatingIncome)}</TableCell>
                    <TableCell align="right">{formatCurrency(operatingIncome * 0.85)}</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>+18%</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={4} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Net Income
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net Income</TableCell>
                    <TableCell align="right">{formatCurrency(netIncome)}</TableCell>
                    <TableCell align="right">{formatCurrency(netIncome * 0.8)}</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>+25%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Visual Analysis */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Revenue Composition</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={formatCurrency} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Expense Breakdown</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={v => formatCurrency(v).replace('$', '')} />
                    <RechartsTooltip formatter={formatCurrency} />
                    <Bar dataKey="value" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Trends */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Financial Trends</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={[
                  { month: 'Jan', revenue: 2100000, expenses: 1800000 },
                  { month: 'Feb', revenue: 2200000, expenses: 1750000 },
                  { month: 'Mar', revenue: 2400000, expenses: 1850000 },
                  { month: 'Apr', revenue: 2300000, expenses: 1900000 },
                  { month: 'May', revenue: 2500000, expenses: 1950000 },
                  { month: 'Jun', revenue: 2600000, expenses: 2000000 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={v => formatCurrency(v).replace('$', '')} />
                <RechartsTooltip formatter={formatCurrency} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4CAF50" />
                <Line type="monotone" dataKey="expenses" stroke="#F44336" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

// Helper Components
const CircularProgressWithLabel = ({ value }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress variant="determinate" value={value} />
    <Box sx={{
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Typography variant="caption">{`${Math.round(value)}%`}</Typography>
    </Box>
  </Box>
);

const LinearProgressWithLabel = ({ value, color = 'primary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{ width: '100%', mr: 1 }}>
      <LinearProgress variant="determinate" value={value} color={color} />
    </Box>
    <Typography variant="body2">{`${Math.round(value)}%`}</Typography>
  </Box>
);

export default ProfitLossPage;