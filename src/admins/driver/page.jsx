import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
  Badge,
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
  Receipt,
  Download,
  Share,
  TrendingUp,
  History,
  Add,
  CheckCircle,
  Schedule,
  Cancel,
  LocalAtm,
  PhoneIphone,
  Speed,
  Star,
  Group
} from '@mui/icons-material';

const DriverPaymentsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Driver data
  const [driverData, setDriverData] = useState({
    driverId: 'DRV-ENF0125',
    walletId: 'WALLET-DRV0125',
    fleetId: 'FLEET-TAXI001',
    wallet: {
      balance: 285000,
      available: 275000,
      pending: 10000,
      todayEarnings: 45000,
      weeklyEarnings: 285000
    },
    services: [
      {
        id: 'S1',
        name: 'City Trip',
        description: 'Within Kampala city limits',
        defaultAmount: 10000,
        shortcut: 'S1',
        color: 'primary'
      },
      {
        id: 'S2',
        name: 'Airport Drop',
        description: 'To Entebbe International Airport',
        defaultAmount: 60000,
        shortcut: 'S2',
        color: 'secondary'
      },
      {
        id: 'S3',
        name: 'Delivery',
        description: 'Goods and package delivery',
        defaultAmount: 15000,
        shortcut: 'S3',
        color: 'success'
      },
      {
        id: 'S4',
        name: 'Custom Fare',
        description: 'Enter specific amount',
        defaultAmount: 0,
        shortcut: 'S4',
        color: 'warning'
      }
    ],
    recentTransactions: [
      {
        id: 'TXN001',
        amount: 20000,
        type: 'credit',
        method: 'qr',
        status: 'completed',
        timestamp: '2024-01-15 14:30:45',
        customer: 'Walk-in Customer',
        service: 'City Trip',
        tripId: 'TRIP-45671'
      },
      {
        id: 'TXN002',
        amount: 60000,
        type: 'credit',
        method: 'mobile',
        status: 'completed',
        timestamp: '2024-01-15 12:15:20',
        customer: 'Customer #7890',
        service: 'Airport Drop',
        tripId: 'TRIP-45670'
      },
      {
        id: 'TXN003',
        amount: 15000,
        type: 'credit',
        method: 'card',
        status: 'completed',
        timestamp: '2024-01-15 10:45:30',
        customer: 'Customer #7891',
        service: 'Delivery',
        tripId: 'TRIP-45669'
      },
      {
        id: 'TXN004',
        amount: 10000,
        type: 'credit',
        method: 'link',
        status: 'pending',
        timestamp: '2024-01-15 09:30:15',
        customer: 'Customer #7892',
        service: 'City Trip',
        tripId: 'TRIP-45668'
      }
    ],
    performance: {
      totalRides: 1247,
      completedRides: 1230,
      cancellationRate: 1.4,
      averageRating: 4.7,
      weeklyTrend: '+12%'
    }
  });

  const paymentMethods = [
    {
      id: 'qr',
      name: 'QR Code',
      icon: <QrCode />,
      color: 'primary',
      description: 'Customer scans your QR code'
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: <Smartphone />,
      color: 'success',
      description: 'Send payment request to customer'
    },
    {
      id: 'card',
      name: 'Card Payment',
      icon: <CreditCard />,
      color: 'secondary',
      description: 'Accept card payments'
    },
    {
      id: 'link',
      name: 'Payment Link',
      icon: <Link />,
      color: 'info',
      description: 'Share link via SMS/WhatsApp'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setPaymentAmount(service.defaultAmount > 0 ? service.defaultAmount.toString() : '');
    setShowPaymentDialog(true);
  };

  const handleRequestPayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Create new transaction
    const newTransaction = {
      id: `TXN${Date.now()}`,
      amount: parseInt(paymentAmount),
      type: 'credit',
      method: 'mobile', // Default method
      status: 'pending',
      timestamp: new Date().toLocaleString(),
      customer: customerPhone ? `Customer (${customerPhone})` : 'Walk-in Customer',
      service: selectedService?.name || 'Custom Fare',
      tripId: `TRIP-${Date.now()}`
    };

    // Update transactions
    setDriverData(prev => ({
      ...prev,
      recentTransactions: [newTransaction, ...prev.recentTransactions],
      wallet: {
        ...prev.wallet,
        pending: prev.wallet.pending + parseInt(paymentAmount)
      }
    }));

    setShowPaymentDialog(false);
    setPaymentAmount('');
    setCustomerPhone('');
    setSelectedService(null);

    // Simulate payment confirmation
    setTimeout(() => {
      setDriverData(prev => ({
        ...prev,
        recentTransactions: prev.recentTransactions.map(txn =>
          txn.id === newTransaction.id
            ? { ...txn, status: 'completed' }
            : txn
        ),
        wallet: {
          ...prev.wallet,
          balance: prev.wallet.balance + parseInt(paymentAmount),
          available: prev.wallet.available + parseInt(paymentAmount),
          pending: prev.wallet.pending - parseInt(paymentAmount),
          todayEarnings: prev.wallet.todayEarnings + parseInt(paymentAmount)
        }
      }));

      // Show success notification
      alert(`✅ Payment received! UGX ${parseInt(paymentAmount).toLocaleString()} has been added to your wallet.`);
    }, 3000);
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
      default: return 'default';
    }
  };

  const handleWithdrawal = () => {
    const amount = driverData.wallet.available;
    if (amount <= 0) {
      alert('No available balance for withdrawal');
      return;
    }

    alert(`Withdrawal request for UGX ${amount.toLocaleString()} submitted! Funds will be processed within 24 hours.`);
    
    setDriverData(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        available: 0,
        balance: prev.wallet.balance - amount
      }
    }));
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Driver Payments 💰
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Accept payments, track earnings, and manage your wallet
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<Download />} variant="outlined">
            Export
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
        <Grid item xs={4}>
          {/* Wallet Balance Card */}
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    ENFUNA Wallet
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    UGX {driverData.wallet.balance.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Available: UGX {driverData.wallet.available.toLocaleString()}
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
                    UGX {driverData.wallet.pending.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(driverData.wallet.pending / driverData.wallet.balance) * 100} 
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
                  onClick={handleWithdrawal}
                  disabled={driverData.wallet.available <= 0}
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

          {/* Quick Services */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Services</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Tap to request payment for common services
              </Typography>
              <Grid container spacing={1}>
                {driverData.services.map((service) => (
                  <Grid item xs={6} key={service.id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' }
                      }}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Avatar sx={{ bgcolor: `${service.color}.100`, color: `${service.color}.main`, width: 40, height: 40, mx: 'auto', mb: 1 }}>
                          {service.shortcut}
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {service.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          UGX {service.defaultAmount > 0 ? service.defaultAmount.toLocaleString() : 'Custom'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Driver Performance */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Your Performance</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Rides</Typography>
                  <Typography variant="body2" fontWeight="bold">{driverData.performance.totalRides}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ mt: 0.5 }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Completed Rides</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {driverData.performance.completedRides}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(driverData.performance.completedRides / driverData.performance.totalRides) * 100} 
                  color="success"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Rating</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ color: 'gold', fontSize: 16 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {driverData.performance.averageRating}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(driverData.performance.averageRating / 5) * 100} 
                  color="warning"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Weekly Trend</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {driverData.performance.weeklyTrend}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={8}>
          <Card>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Today's Earnings" icon={<TrendingUp />} />
              <Tab label="Transaction History" icon={<History />} />
              <Tab label="Payment Methods" icon={<Payment />} />
            </Tabs>

            <CardContent sx={{ minHeight: 500 }}>
              {/* Today's Earnings */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Today's Summary</Typography>
                    <Chip 
                      label={`UGX ${driverData.wallet.todayEarnings.toLocaleString()}`} 
                      color="success" 
                      variant="filled"
                    />
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={3}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {driverData.recentTransactions.filter(t => t.status === 'completed').length}
                        </Typography>
                        <Typography variant="body2">Completed Payments</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={3}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          UGX {driverData.wallet.todayEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2">Total Earnings</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={3}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {driverData.recentTransactions.filter(t => t.status === 'pending').length}
                        </Typography>
                        <Typography variant="body2">Pending</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={3}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main" fontWeight="bold">
                          {driverData.services.length}
                        </Typography>
                        <Typography variant="body2">Active Services</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                  <List>
                    {driverData.recentTransactions.slice(0, 5).map((transaction, index) => (
                      <React.Fragment key={transaction.id}>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: `${getMethodColor(transaction.method)}.100` }}>
                              {paymentMethods.find(m => m.id === transaction.method)?.icon}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" fontWeight="500">
                                  {transaction.service}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" color="success.main">
                                  UGX {transaction.amount.toLocaleString()}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="caption">
                                  {transaction.customer} • {new Date(transaction.timestamp).toLocaleTimeString()}
                                </Typography>
                                <Chip 
                                  label={transaction.status} 
                                  size="small"
                                  color={getStatusColor(transaction.status)}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < 4 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}

              {/* Transaction History */}
              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Transaction History</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        All
                      </Button>
                      <Button size="small" variant="outlined">
                        This Week
                      </Button>
                      <Button size="small" variant="outlined">
                        This Month
                      </Button>
                    </Box>
                  </Box>

                  <List>
                    {driverData.recentTransactions.map((transaction, index) => (
                      <React.Fragment key={transaction.id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: `${getMethodColor(transaction.method)}.100` }}>
                              {paymentMethods.find(m => m.id === transaction.method)?.icon}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body1" fontWeight="500">
                                    {transaction.service}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {transaction.customer} • {transaction.tripId}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="body1" fontWeight="bold" color="success.main">
                                    UGX {transaction.amount.toLocaleString()}
                                  </Typography>
                                  <Typography variant="caption">
                                    {new Date(transaction.timestamp).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                          <Chip 
                            label={transaction.status} 
                            size="small"
                            color={getStatusColor(transaction.status)}
                            sx={{ ml: 2 }}
                          />
                        </ListItem>
                        {index < driverData.recentTransactions.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}

              {/* Payment Methods */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Payment Methods</Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    Choose how you want to accept payments from customers
                  </Typography>

                  <Grid container spacing={3}>
                    {paymentMethods.map((method) => (
                      <Grid item xs={6} key={method.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ bgcolor: `${method.color}.100`, color: `${method.color}.main` }}>
                                {method.icon}
                              </Avatar>
                              <Box>
                                <Typography variant="h6">{method.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {method.description}
                                </Typography>
                              </Box>
                            </Box>
                            <Button 
                              variant="contained" 
                              fullWidth
                              onClick={() => {
                                setSelectedService(driverData.services[3]); // Custom fare
                                setShowPaymentDialog(true);
                              }}
                            >
                              Use {method.name}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Fleet Information */}
                  <Card sx={{ mt: 3, bgcolor: 'primary.50' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Group />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">Fleet: {driverData.fleetId}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            You are part of a fleet. Commission and reporting are managed by your fleet operator.
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}
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
            {selectedService && selectedService.id !== 'S4' && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'primary.50', textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    {selectedService.name}
                  </Typography>
                  <Typography variant="body2">
                    {selectedService.description}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                    UGX {selectedService.defaultAmount.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            )}

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
              <TextField
                fullWidth
                label="Customer Phone (Optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="256712345678"
                helperText="For Mobile Money payments"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Payment Method
              </Typography>
              <Grid container spacing={1}>
                {paymentMethods.map((method) => (
                  <Grid item xs={6} key={method.id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        cursor: 'pointer',
                        borderColor: 'grey.300',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Box sx={{ fontSize: 32, color: `${method.color}.main`, mb: 1 }}>
                          {method.icon}
                        </Box>
                        <Typography variant="body2" fontWeight="500">
                          {method.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleRequestPayment}
            disabled={!paymentAmount}
            startIcon={<Payment />}
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
          <Typography variant="h5" gutterBottom>
            Your Payment QR Code
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Customers can scan this code to pay any amount
          </Typography>
          
          <Box 
            sx={{ 
              width: 250, 
              height: 250, 
              bgcolor: 'grey.200', 
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2
            }}
          >
            <QrCode sx={{ fontSize: 120, color: 'grey.600' }} />
          </Box>
          
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Driver ID: {driverData.driverId}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            pay.enfuna.com/{driverData.driverId.toLowerCase()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="outlined" onClick={() => setShowQRDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Share />}>
            Share QR
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverPaymentsPage;