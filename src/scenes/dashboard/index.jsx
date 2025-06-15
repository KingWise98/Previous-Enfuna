import React, { useState } from 'react';
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
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar
} from '@mui/material';
import {
  AttachMoney,
  Receipt,
  Inventory,
  Add,
  LocationOn,
  CalendarToday,
  ArrowUpward,
  ArrowDownward,
  Warning,
  CheckCircle,
  Paid,
  LocalAtm,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Store,
  People,
  CreditCard,
  Schedule
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const BusinessSnapshot = () => {
  const theme = useTheme();
  const [location, setLocation] = useState('all');
  const [startDate, setStartDate] = useState(new Date('2025-06-11'));
  const [endDate, setEndDate] = useState(new Date('2025-06-11'));

  // Mock data
  const cashFlowData = [
    { type: 'Cash In', amount: 0, trend: 'up', icon: <ArrowUpward color="success" /> },
    { type: 'Cash Out', amount: 0, trend: 'down', icon: <ArrowDownward color="error" /> }
  ];

  const invoicesData = [
    { status: 'Awaiting Payment', count: 0, amount: 0, icon: <Schedule color="info" /> },
    { status: 'Overdue', count: 0, amount: 0, icon: <Warning color="warning" /> },
    { status: 'Paid Today', count: 0, amount: 0, icon: <Paid color="success" /> }
  ];

  const billsData = [
    { status: 'Awaiting Payment', count: 0, amount: 0, icon: <Schedule color="info" /> },
    { status: 'Overdue', count: 0, amount: 0, icon: <Warning color="error" /> },
    { status: 'Paid Today', count: 0, amount: 0, icon: <Paid color="success" /> }
  ];

  const financialOverview = [
    { metric: 'Revenue', value: 0, change: '0%', trend: 'up' },
    { metric: 'Expenses', value: 0, change: '0%', trend: 'down' },
    { metric: 'Profit', value: 0, change: '0%', trend: 'up' },
    { metric: 'Cash Balance', value: 0, change: '0%', trend: 'neutral' }
  ];

  const recentActivities = [
    { type: 'Sale', description: 'POS-001', amount: 0, time: '10:30 AM', status: 'completed' },
    { type: 'Payment', description: 'INV-001', amount: 0, time: '11:45 AM', status: 'completed' },
    { type: 'Stock', description: 'Received items', amount: 0, time: '09:15 AM', status: 'pending' }
  ];

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3" fontWeight="bold">
          Business Summary
        </Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<CalendarToday />}>
            {new Date().toLocaleDateString()}
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Locations</InputLabel>
          <Select
            value={location}
            label="Locations"
            onChange={(e) => setLocation(e.target.value)}
            startAdornment={<LocationOn sx={{ color: theme.palette.text.secondary, mr: 1 }} />}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="main">Main Store</MenuItem>
            <MenuItem value="branch1">Branch 1</MenuItem>
            <MenuItem value="branch2">Branch 2</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
      </Box>

      {/* Financial Overview Cards */}
      <Grid container spacing={3} mb={3}>
        {financialOverview.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {item.metric}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h4" fontWeight="bold">
                    UGX {item.value.toLocaleString()}
                  </Typography>
                  <Chip
                    label={item.change}
                    color={
                      item.trend === 'up' ? 'success' : 
                      item.trend === 'down' ? 'error' : 'info'
                    }
                    icon={
                      item.trend === 'up' ? <TrendingUp /> :
                      item.trend === 'down' ? <TrendingDown /> : <AccountBalance />
                    }
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cash Flow Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Total Cash In and Out</Typography>
            <Box display="flex" gap={1}>
              <Button size="small" startIcon={<LocalAtm />}>Cash Report</Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount (UGX)</TableCell>
                  <TableCell align="right">Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cashFlowData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {row.icon}
                        {row.type}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{row.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      {row.trend === 'up' ? 
                        <TrendingUp color="success" /> : 
                        <TrendingDown color="error" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Invoices Owed to You</Typography>
            <Button variant="contained" startIcon={<Add />} href="/payment">New Invoice</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Amount (UGX)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoicesData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {row.icon}
                        {row.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                    <TableCell align="right">{row.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Bills You Need to Pay</Typography>
            <Button variant="contained" startIcon={<Add />} href="/inventory/product-list">New Receive Stock</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Amount (UGX)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billsData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {row.icon}
                        {row.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                    <TableCell align="right">{row.amount.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" mb={2}>Recent Activities</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip
                            size="small"
                            label={activity.type}
                            color={
                              activity.status === 'completed' ? 'success' : 
                              activity.status === 'pending' ? 'warning' : 'info'
                            }
                          />
                        </TableCell>
                        <TableCell>{activity.description}</TableCell>
                        <TableCell align="right">UGX {activity.amount}</TableCell>
                        <TableCell align="right">{activity.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" mb={2}>Quick Stats</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                          <Store />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">Active Locations</Typography>
                          <Typography variant="h6">1</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                          <People />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">Customers Today</Typography>
                          <Typography variant="h6">0</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                          <CreditCard />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">Card Payments</Typography>
                          <Typography variant="h6">0</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                          <AttachMoney />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">Cash Payments</Typography>
                          <Typography variant="h6">0</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessSnapshot;