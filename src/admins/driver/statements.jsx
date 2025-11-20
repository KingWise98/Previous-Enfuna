import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  AccountBalanceWallet,
  ReceiptLong,
  Download,
  FilterList,
  Search,
  Visibility,
  AttachMoney,
  MoneyOff,
  TrendingUp,
  TrendingDown,
  DateRange,
  LocalAtm,
  CreditCard,
  Smartphone,
  Savings,
  Payment,
  QrCode,
  Share,
  PictureAsPdf,
  Description,
  CalendarMonth,
  BarChart,
  PieChart,
  Summarize
} from '@mui/icons-material';

const StatementsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);

  // Mock statements data
  const [statements, setStatements] = useState({
    daily: [
      {
        id: 1,
        date: '2024-01-15',
        type: 'earning',
        description: 'Trip Completion - Garden City to Makerere',
        amount: 15000,
        fee: -1500,
        netAmount: 13500,
        paymentMethod: 'cash',
        status: 'completed',
        time: '14:30',
        tripId: 'TRIP-001'
      },
      {
        id: 2,
        date: '2024-01-15',
        type: 'earning',
        description: 'Trip Completion - Nakasero to Kololo',
        amount: 8000,
        fee: -800,
        netAmount: 7200,
        paymentMethod: 'mobile',
        status: 'completed',
        time: '11:15',
        tripId: 'TRIP-002'
      },
      {
        id: 3,
        date: '2024-01-15',
        type: 'deduction',
        description: 'Platform Service Fee',
        amount: -2300,
        fee: 0,
        netAmount: -2300,
        paymentMethod: 'system',
        status: 'processed',
        time: '18:00',
        tripId: 'FEE-001'
      },
      {
        id: 4,
        date: '2024-01-15',
        type: 'earning',
        description: 'Weekly Bonus',
        amount: 5000,
        fee: 0,
        netAmount: 5000,
        paymentMethod: 'system',
        status: 'completed',
        time: '09:00',
        tripId: 'BNS-001'
      }
    ],
    weekly: [
      {
        id: 1,
        period: 'Jan 8-14, 2024',
        earnings: 785000,
        fees: -78500,
        bonuses: 25000,
        netEarnings: 731500,
        trips: 112,
        status: 'processed'
      },
      {
        id: 2,
        period: 'Jan 1-7, 2024',
        earnings: 698000,
        fees: -69800,
        bonuses: 20000,
        netEarnings: 648200,
        trips: 98,
        status: 'processed'
      }
    ],
    monthly: [
      {
        id: 1,
        period: 'December 2023',
        earnings: 3250000,
        fees: -325000,
        bonuses: 100000,
        netEarnings: 3025000,
        trips: 465,
        status: 'processed'
      },
      {
        id: 2,
        period: 'November 2023',
        earnings: 2980000,
        fees: -298000,
        bonuses: 80000,
        netEarnings: 2762000,
        trips: 432,
        status: 'processed'
      }
    ]
  });

  const [transactions, setTransactions] = useState([
    ...statements.daily,
    {
      id: 5,
      date: '2024-01-14',
      type: 'earning',
      description: 'Trip Completion - Acacia Mall to Bugolobi',
      amount: 12000,
      fee: -1200,
      netAmount: 10800,
      paymentMethod: 'card',
      status: 'completed',
      time: '16:45',
      tripId: 'TRIP-003'
    },
    {
      id: 6,
      date: '2024-01-14',
      type: 'earning',
      description: 'Airport Transfer - Entebbe to Kampala',
      amount: 45000,
      fee: -4500,
      netAmount: 40500,
      paymentMethod: 'cash',
      status: 'completed',
      time: '21:30',
      tripId: 'TRIP-004'
    },
    {
      id: 7,
      date: '2024-01-14',
      type: 'deduction',
      description: 'Fuel Advance',
      amount: -50000,
      fee: 0,
      netAmount: -50000,
      paymentMethod: 'system',
      status: 'processed',
      time: '08:15',
      tripId: 'ADV-001'
    },
    {
      id: 8,
      date: '2024-01-13',
      type: 'earning',
      description: 'Corporate Ride - Industrial Area',
      amount: 25000,
      fee: -2500,
      netAmount: 22500,
      paymentMethod: 'card',
      status: 'completed',
      time: '14:20',
      tripId: 'TRIP-005'
    }
  ]);

  const formatCurrency = (amount) => {
    return `UGX ${Math.abs(amount).toLocaleString()}`;
  };

  const getTransactionIcon = (type, paymentMethod) => {
    if (type === 'deduction') {
      return <MoneyOff color="error" />;
    }
    
    switch (paymentMethod) {
      case 'cash': return <LocalAtm color="success" />;
      case 'card': return <CreditCard color="info" />;
      case 'mobile': return <Smartphone color="secondary" />;
      default: return <AttachMoney color="success" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processed': return 'info';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    return type === 'earning' ? 'success' : 'error';
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.tripId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = filterPeriod === 'all' || 
                         (filterPeriod === 'today' && transaction.date === '2024-01-15') ||
                         (filterPeriod === 'week' && ['2024-01-15', '2024-01-14', '2024-01-13'].includes(transaction.date));
    
    return matchesSearch && matchesPeriod;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const SummaryCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center' }}>
            <AccountBalanceWallet color="primary" sx={{ mb: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              {formatCurrency(785000)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This Week's Earnings
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUp color="success" sx={{ mb: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="success.main">
              +12.5%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Growth vs Last Week
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ReceiptLong color="secondary" sx={{ mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              112
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed Trips
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center' }}>
            <MoneyOff color="error" sx={{ mb: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="error.main">
              {formatCurrency(78500)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Fees
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const TransactionTable = () => (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Transaction History
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>
            <Button startIcon={<Download />} variant="outlined">
              Export
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Fee</TableCell>
                <TableCell align="right">Net Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTransactionIcon(transaction.type, transaction.paymentMethod)}
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {transaction.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.tripId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.paymentMethod} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color={transaction.type === 'earning' ? 'success.main' : 'error.main'}
                    >
                      {transaction.type === 'earning' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {transaction.fee !== 0 ? formatCurrency(transaction.fee) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color={transaction.netAmount >= 0 ? 'success.main' : 'error.main'}
                    >
                      {transaction.netAmount >= 0 ? '+' : ''}{formatCurrency(transaction.netAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setShowTransactionDialog(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );

  const StatementCards = () => (
    <Grid container spacing={3}>
      {/* Weekly Statements */}
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DateRange sx={{ mr: 1 }} />
              Weekly Statements
            </Typography>
            <List>
              {statements.weekly.map((statement) => (
                <ListItem key={statement.id} divider>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Summarize />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={statement.period}
                    secondary={`${statement.trips} trips • Net: ${formatCurrency(statement.netEarnings)}`}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip label={statement.status} color="success" size="small" />
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <PictureAsPdf />
                      </IconButton>
                      <IconButton size="small">
                        <Download />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Monthly Statements */}
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarMonth sx={{ mr: 1 }} />
              Monthly Statements
            </Typography>
            <List>
              {statements.monthly.map((statement) => (
                <ListItem key={statement.id} divider>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <BarChart />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={statement.period}
                    secondary={`${statement.trips} trips • Net: ${formatCurrency(statement.netEarnings)}`}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip label={statement.status} color="success" size="small" />
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <PictureAsPdf />
                      </IconButton>
                      <IconButton size="small">
                        <Download />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const AnalyticsView = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Earnings Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Cash Payments</Typography>
                  <Typography variant="body2" fontWeight="bold">65%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={65} color="success" sx={{ height: 8 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Mobile Money</Typography>
                  <Typography variant="body2" fontWeight="bold">25%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={25} color="info" sx={{ height: 8 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Card Payments</Typography>
                  <Typography variant="body2" fontWeight="bold">10%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={10} color="secondary" sx={{ height: 8 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Total Earnings"
                  secondary={formatCurrency(3250000)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Total Trips"
                  secondary="597 trips"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Average per Trip"
                  secondary={formatCurrency(5440)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Success Rate"
                  secondary="98.5%"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const tabContent = [
    { label: 'Transactions', component: <TransactionTable /> },
    { label: 'Statements', component: <StatementCards /> },
    { label: 'Analytics', component: <AnalyticsView /> }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      pb: 3
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Statements & Reports 📊
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: isMobile ? 'center' : 'left' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold" 
            gutterBottom
            color="primary"
          >
            Financial Statements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your earnings, view transaction history, and download statements
          </Typography>
        </Box>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Tabs */}
        <Card elevation={3}>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { minHeight: 64 }
              }}
            >
              {tabContent.map((tab, index) => (
                <Tab 
                  key={index}
                  icon={
                    index === 0 ? <ReceiptLong /> :
                    index === 1 ? <Description /> :
                    <PieChart />
                  }
                  label={tab.label}
                />
              ))}
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabContent[activeTab].component}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Transaction Detail Dialog */}
      <Dialog 
        open={showTransactionDialog} 
        onClose={() => setShowTransactionDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        {selectedTransaction && (
          <>
            <DialogTitle>
              Transaction Details
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: selectedTransaction.type === 'earning' ? 'success.main' : 'error.main' }}>
                      {getTransactionIcon(selectedTransaction.type, selectedTransaction.paymentMethod)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {selectedTransaction.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedTransaction.tripId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {new Date(selectedTransaction.date).toLocaleDateString()} at {selectedTransaction.time}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label={selectedTransaction.status} 
                    color={getStatusColor(selectedTransaction.status)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {selectedTransaction.paymentMethod}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Chip 
                    label={selectedTransaction.type} 
                    color={getTypeColor(selectedTransaction.type)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    color={selectedTransaction.type === 'earning' ? 'success.main' : 'error.main'}
                  >
                    {selectedTransaction.type === 'earning' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Service Fee
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {formatCurrency(selectedTransaction.fee)}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Net Amount
                  </Typography>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    color={selectedTransaction.netAmount >= 0 ? 'success.main' : 'error.main'}
                  >
                    {selectedTransaction.netAmount >= 0 ? '+' : ''}{formatCurrency(selectedTransaction.netAmount)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowTransactionDialog(false)}>Close</Button>
              <Button variant="contained" startIcon={<Download />}>
                Download Receipt
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StatementsPage;