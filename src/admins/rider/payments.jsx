import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Badge,
  LinearProgress,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  AccountBalanceWallet,
  Payment,
  QrCode,
  Smartphone,
  CreditCard,
  Link,
  PhoneIphone,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
  Download,
  Receipt,
  Share,
  Notifications,
  Add,
  Refresh,
  Security,
  LocalAtm,
  History
} from '@mui/icons-material';

const PaymentDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [withdrawalDialog, setWithdrawalDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Mock data
  const [walletData, setWalletData] = useState({
    balance: 125000,
    available: 115000,
    pending: 10000,
    todayEarnings: 45000,
    weeklyEarnings: 285000,
    monthlyEarnings: 1150000
  });

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN001',
      amount: 5000,
      type: 'credit',
      method: 'qr',
      status: 'completed',
      timestamp: '2024-01-15 08:30:45',
      customer: 'Customer #1245',
      riderEarnings: 4800,
      fee: 200
    },
    {
      id: 'TXN002',
      amount: 3000,
      type: 'credit',
      method: 'mobile',
      status: 'completed',
      timestamp: '2024-01-15 09:15:20',
      customer: 'Customer #1246',
      riderEarnings: 2850,
      fee: 150
    },
    {
      id: 'TXN003',
      amount: 7000,
      type: 'credit',
      method: 'card',
      status: 'completed',
      timestamp: '2024-01-15 10:45:30',
      customer: 'Customer #1247',
      riderEarnings: 6650,
      fee: 350
    },
    {
      id: 'TXN004',
      amount: 4000,
      type: 'credit',
      method: 'link',
      status: 'pending',
      timestamp: '2024-01-15 11:30:15',
      customer: 'Customer #1248',
      riderEarnings: 3800,
      fee: 200
    },
    {
      id: 'TXN005',
      amount: 6000,
      type: 'debit',
      method: 'withdrawal',
      status: 'completed',
      timestamp: '2024-01-14 16:20:10',
      customer: 'Bank Transfer',
      riderEarnings: 6000,
      fee: 0
    }
  ]);

  const paymentMethods = [
    {
      id: 'qr',
      name: 'QR Code',
      icon: <QrCode />,
      color: 'primary',
      description: 'Customer scans your QR code to pay',
      status: 'active'
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: <Smartphone />,
      color: 'success',
      description: 'Send payment request to customer\'s phone',
      status: 'active'
    },
    {
      id: 'card',
      name: 'Card Payment',
      icon: <CreditCard />,
      color: 'secondary',
      description: 'Accept card payments via POS device',
      status: 'active'
    },
    {
      id: 'link',
      name: 'Payment Link',
      icon: <Link />,
      color: 'info',
      description: 'Share payment link via SMS/WhatsApp',
      status: 'active'
    },
    {
      id: 'ussd',
      name: 'USSD Code',
      icon: <PhoneIphone />,
      color: 'warning',
      description: 'Customer dials *165# to pay',
      status: 'inactive'
    }
  ];

  const stats = {
    today: {
      transactions: 8,
      successRate: 98,
      averageAmount: 5625
    },
    weekly: {
      transactions: 52,
      successRate: 96,
      averageAmount: 5480
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRequestPayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'mobile' && !customerPhone) {
      alert('Please enter customer phone number');
      return;
    }

    // Simulate payment processing
    const newTransaction = {
      id: `TXN${Date.now()}`,
      amount: parseInt(paymentAmount),
      type: 'credit',
      method: paymentMethod,
      status: 'pending',
      timestamp: new Date().toLocaleString(),
      customer: customerPhone ? `Customer (${customerPhone})` : 'Walk-in Customer',
      riderEarnings: parseInt(paymentAmount) * 0.96, // 4% fee
      fee: parseInt(paymentAmount) * 0.04
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setShowPaymentDialog(false);
    setPaymentAmount('');
    setCustomerPhone('');

    // Simulate payment confirmation after 3 seconds
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(txn => 
          txn.id === newTransaction.id 
            ? { ...txn, status: 'completed' }
            : txn
        )
      );
      
      // Update wallet balance
      setWalletData(prev => ({
        ...prev,
        balance: prev.balance + newTransaction.riderEarnings,
        todayEarnings: prev.todayEarnings + newTransaction.riderEarnings
      }));

      // Show success notification
      alert(`✅ Payment received! UGX ${newTransaction.riderEarnings.toLocaleString()} has been added to your wallet.`);
    }, 3000);
  };

  const handleWithdrawal = (amount) => {
    if (amount > walletData.available) {
      alert('Insufficient balance for withdrawal');
      return;
    }

    const withdrawalTransaction = {
      id: `WD${Date.now()}`,
      amount: amount,
      type: 'debit',
      method: 'withdrawal',
      status: 'pending',
      timestamp: new Date().toLocaleString(),
      customer: 'Bank Transfer',
      riderEarnings: amount,
      fee: 0
    };

    setTransactions(prev => [withdrawalTransaction, ...prev]);
    setWithdrawalDialog(false);

    // Simulate withdrawal processing
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(txn => 
          txn.id === withdrawalTransaction.id 
            ? { ...txn, status: 'completed' }
            : txn
        )
      );
      
      setWalletData(prev => ({
        ...prev,
        balance: prev.balance - amount,
        available: prev.available - amount
      }));

      alert(`✅ Withdrawal successful! UGX ${amount.toLocaleString()} will be transferred to your bank account within 24 hours.`);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'qr': return 'primary';
      case 'mobile': return 'success';
      case 'card': return 'secondary';
      case 'link': return 'info';
      case 'ussd': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Payment Dashboard 💰
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Manage payments, track earnings, and process withdrawals
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<Download />} variant="outlined">
            Export Statements
          </Button>
          <Button startIcon={<Refresh />} variant="outlined">
            Refresh
          </Button>
          <Button 
            startIcon={<Payment />} 
            variant="contained"
            onClick={() => setShowPaymentDialog(true)}
          >
            Request Payment
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - Wallet & Quick Actions */}
        <Grid item xs={3}>
          {/* Wallet Balance Card */}
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    ENFUNA Wallet
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    UGX {walletData.balance.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Available: UGX {walletData.available.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                  <AccountBalanceWallet />
                </Avatar>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Pending Clearance</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    UGX {walletData.pending.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(walletData.pending / walletData.balance) * 100} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white'
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  onClick={() => setWithdrawalDialog(true)}
                >
                  Withdraw
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  onClick={() => setShowQRDialog(true)}
                >
                  Show QR
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Payment Methods */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Methods</Typography>
              <List dense>
                {paymentMethods.map((method) => (
                  <ListItem key={method.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${method.color}.100`, width: 40, height: 40 }}>
                        {method.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={method.name}
                      secondary={method.description}
                    />
                    <Chip 
                      label={method.status} 
                      size="small"
                      color={method.status === 'active' ? 'success' : 'default'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Today's Summary */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Today's Summary</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Earnings</Typography>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  UGX {walletData.todayEarnings.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Transactions</Typography>
                <Typography variant="h6">{stats.today.transactions}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Success Rate</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.today.successRate} 
                    sx={{ flexGrow: 1, height: 6 }}
                    color="success"
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {stats.today.successRate}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={6}>
          <Card>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Recent Transactions" icon={<History />} />
              <Tab label="Payment Analytics" icon={<TrendingUp />} />
              <Tab label="Payment Methods" icon={<Payment />} />
            </Tabs>

            <CardContent sx={{ minHeight: 500 }}>
              {/* Recent Transactions */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Transaction History</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        All
                      </Button>
                      <Button size="small" variant="outlined">
                        Completed
                      </Button>
                      <Button size="small" variant="outlined">
                        Pending
                      </Button>
                    </Box>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {transaction.id}
                              </Typography>
                            </TableCell>
                            <TableCell>{transaction.customer}</TableCell>
                            <TableCell>
                              <Chip 
                                label={transaction.method.toUpperCase()} 
                                size="small"
                                color={getMethodColor(transaction.method)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography 
                                variant="body2" 
                                fontWeight="bold"
                                color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                              >
                                {transaction.type === 'credit' ? '+' : '-'} 
                                UGX {transaction.amount.toLocaleString()}
                              </Typography>
                              {transaction.fee > 0 && (
                                <Typography variant="caption" color="textSecondary">
                                  Fee: UGX {transaction.fee.toLocaleString()}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={transaction.status} 
                                size="small"
                                color={getStatusColor(transaction.status)}
                                icon={transaction.status === 'completed' ? <CheckCircle /> : <Schedule />}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(transaction.timestamp).toLocaleDateString()}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {new Date(transaction.timestamp).toLocaleTimeString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Tooltip title="View Receipt">
                                <IconButton size="small">
                                  <Receipt />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Share">
                                <IconButton size="small">
                                  <Share />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Payment Analytics */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Payment Analytics</Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                          {stats.weekly.transactions}
                        </Typography>
                        <Typography variant="body2">Weekly Transactions</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="success.main" fontWeight="bold">
                          {stats.weekly.successRate}%
                        </Typography>
                        <Typography variant="body2">Success Rate</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="warning.main" fontWeight="bold">
                          UGX {stats.weekly.averageAmount}
                        </Typography>
                        <Typography variant="body2">Average Transaction</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom>Earnings Breakdown</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="textSecondary">Today</Typography>
                        <Typography variant="h5" color="success.main">
                          UGX {walletData.todayEarnings.toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="textSecondary">This Week</Typography>
                        <Typography variant="h5" color="success.main">
                          UGX {walletData.weeklyEarnings.toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="textSecondary">This Month</Typography>
                        <Typography variant="h5" color="success.main">
                          UGX {walletData.monthlyEarnings.toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="textSecondary">Total Balance</Typography>
                        <Typography variant="h5" color="primary.main">
                          UGX {walletData.balance.toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Payment Methods */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Payment Method Settings</Typography>
                  <Grid container spacing={3}>
                    {paymentMethods.map((method) => (
                      <Grid item xs={6} key={method.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ bgcolor: `${method.color}.100` }}>
                                {method.icon}
                              </Avatar>
                              <Box>
                                <Typography variant="h6">{method.name}</Typography>
                                <Chip 
                                  label={method.status} 
                                  size="small"
                                  color={method.status === 'active' ? 'success' : 'default'}
                                />
                              </Box>
                            </Box>
                            <Typography variant="body2" color="textSecondary" paragraph>
                              {method.description}
                            </Typography>
                            <FormControlLabel
                              control={<Switch defaultChecked={method.status === 'active'} />}
                              label="Enable"
                            />
                            <Button 
                              variant="outlined" 
                              fullWidth 
                              sx={{ mt: 1 }}
                              onClick={() => {
                                setPaymentMethod(method.id);
                                setShowPaymentDialog(true);
                              }}
                            >
                              Use This Method
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar - Notifications & Quick Stats */}
        <Grid item xs={3}>
          {/* Recent Activity */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.100', width: 32, height: 32 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment Received"
                    secondary="UGX 5,000 from Customer #1245"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'info.100', width: 32, height: 32 }}>
                      <Notifications color="info" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Withdrawal Processed"
                    secondary="UGX 20,000 to your bank account"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.100', width: 32, height: 32 }}>
                      <Schedule color="warning" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment Pending"
                    secondary="UGX 4,000 from payment link"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Payment */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Payment Request</Typography>
              <TextField
                fullWidth
                label="Amount (UGX)"
                type="number"
                margin="normal"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  {paymentMethods.filter(m => m.status === 'active').map(method => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={handleRequestPayment}
                disabled={!paymentAmount}
              >
                Request Payment
              </Button>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Security Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Security color="success" />
                <Typography variant="body2">All systems secure</Typography>
              </Box>
              <Typography variant="caption" color="textSecondary">
                Last security check: Today, 08:45 AM
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Request Dialog */}
      <Dialog 
        open={showPaymentDialog} 
        onClose={() => setShowPaymentDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Request Payment</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount (UGX)"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>UGX</Typography>
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  {paymentMethods.filter(m => m.status === 'active').map(method => (
                    <MenuItem key={method.id} value={method.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {method.icon}
                        {method.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {paymentMethod === 'mobile' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g., 256712345678"
                />
              </Grid>
            )}

            {paymentMethod === 'qr' && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Show this QR code to your customer
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 200, 
                      height: 200, 
                      bgcolor: 'grey.200', 
                      mx: 'auto',
                      mt: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <QrCode sx={{ fontSize: 100, color: 'grey.600' }} />
                  </Box>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Amount: UGX {paymentAmount || '0'}
                  </Typography>
                </Box>
              </Grid>
            )}

            {paymentMethod === 'link' && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Payment Link:
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all' }}>
                    https://enfuna.pay/rider123/amount={paymentAmount}
                  </Typography>
                  <Button startIcon={<Share />} sx={{ mt: 1 }}>
                    Share Link
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleRequestPayment}
            disabled={!paymentAmount || (paymentMethod === 'mobile' && !customerPhone)}
          >
            Request Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog 
        open={showQRDialog} 
        onClose={() => setShowQRDialog(false)} 
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Payment QR Code
          </Typography>
          <Box 
            sx={{ 
              width: 250, 
              height: 250, 
              bgcolor: 'grey.200', 
              mx: 'auto',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <QrCode sx={{ fontSize: 120, color: 'grey.600' }} />
          </Box>
          <Typography variant="body2" color="textSecondary">
            Rider ID: RDR-ENF00124
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Customers can scan this code to pay any amount
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="outlined" onClick={() => setShowQRDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Download QR
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdrawal Dialog */}
      <Dialog 
        open={withdrawalDialog} 
        onClose={() => setWithdrawalDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Withdraw Funds</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            Available Balance: UGX {walletData.available.toLocaleString()}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {[10000, 50000, 100000, walletData.available].map((amount) => (
              <Button
                key={amount}
                variant="outlined"
                onClick={() => handleWithdrawal(amount)}
                disabled={amount > walletData.available}
              >
                UGX {amount.toLocaleString()}
              </Button>
            ))}
          </Box>

          <Typography variant="body2" color="textSecondary">
            Withdrawals are processed within 24 hours. A 1% processing fee applies.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setWithdrawalDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleWithdrawal(walletData.available)}
          >
            Withdraw All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentDashboard;