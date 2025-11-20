import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  AccountBalanceWallet,
  Payment,
  QrCode,
  Smartphone,
  LocalAtm,
  Receipt,
  TrendingUp,
  Download,
  Share,
  CheckCircle,
  Schedule,
  Close,
  Phone,
  AttachMoney
} from '@mui/icons-material';

const SimplePaymentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [paymentData, setPaymentData] = useState({
    wallet: {
      balance: 285000,
      available: 275000,
      pending: 10000
    },
    earnings: {
      today: 45000,
      week: 285000,
      month: 1150000
    },
    recentPayments: [
      {
        id: 1,
        amount: 20000,
        customer: 'Customer #1234',
        method: 'cash',
        status: 'completed',
        time: '2:30 PM',
        date: 'Today'
      },
      {
        id: 2,
        amount: 60000,
        customer: 'Customer #5678',
        method: 'mobile',
        status: 'completed',
        time: '12:15 PM',
        date: 'Today'
      },
      {
        id: 3,
        amount: 15000,
        customer: 'Customer #9012',
        method: 'qr',
        status: 'completed',
        time: '10:45 AM',
        date: 'Today'
      },
      {
        id: 4,
        amount: 10000,
        customer: 'Customer #3456',
        method: 'cash',
        status: 'pending',
        time: '9:30 AM',
        date: 'Today'
      }
    ]
  });

  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [showCashDialog, setShowCashDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cashAmount, setCashAmount] = useState('');

  const paymentMethods = [
    {
      title: 'Show QR Code',
      description: 'Customer scans to pay',
      icon: <QrCode sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'primary',
      action: () => setShowQRDialog(true)
    },
    {
      title: 'Mobile Money',
      description: 'Send payment request',
      icon: <Smartphone sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'success',
      action: () => setShowMobileDialog(true)
    },
    {
      title: 'Cash Payment',
      description: 'Record cash received',
      icon: <LocalAtm sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'warning',
      action: () => setShowCashDialog(true)
    },
    {
      title: 'Request Payment',
      description: 'Any payment method',
      icon: <Payment sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'info',
      action: () => setShowPaymentDialog(true)
    }
  ];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRequestPayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      showSnackbar('Please enter a valid amount', 'error');
      return;
    }

    const newPayment = {
      id: Date.now(),
      amount: parseInt(paymentAmount),
      customer: customerPhone ? `Customer (${customerPhone})` : 'Walk-in Customer',
      method: 'mobile',
      status: 'pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    };

    // Update payments list
    setPaymentData(prev => ({
      ...prev,
      recentPayments: [newPayment, ...prev.recentPayments],
      wallet: {
        ...prev.wallet,
        pending: prev.wallet.pending + parseInt(paymentAmount)
      }
    }));

    setShowPaymentDialog(false);
    setPaymentAmount('');
    setCustomerPhone('');
    showSnackbar(`Payment request sent for UGX ${parseInt(paymentAmount).toLocaleString()}`);

    // Simulate payment completion after 3 seconds
    setTimeout(() => {
      setPaymentData(prev => ({
        ...prev,
        recentPayments: prev.recentPayments.map(payment =>
          payment.id === newPayment.id
            ? { ...payment, status: 'completed' }
            : payment
        ),
        wallet: {
          ...prev.wallet,
          balance: prev.wallet.balance + parseInt(paymentAmount),
          available: prev.wallet.available + parseInt(paymentAmount),
          pending: prev.wallet.pending - parseInt(paymentAmount),
        },
        earnings: {
          ...prev.earnings,
          today: prev.earnings.today + parseInt(paymentAmount),
          week: prev.earnings.week + parseInt(paymentAmount),
          month: prev.earnings.month + parseInt(paymentAmount)
        }
      }));
      showSnackbar(`Payment received! UGX ${parseInt(paymentAmount).toLocaleString()} added to your wallet`, 'success');
    }, 3000);
  };

  const handleMobilePayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      showSnackbar('Please enter a valid amount', 'error');
      return;
    }

    if (!customerPhone) {
      showSnackbar('Please enter customer phone number', 'error');
      return;
    }

    const newPayment = {
      id: Date.now(),
      amount: parseInt(paymentAmount),
      customer: `Customer (${customerPhone})`,
      method: 'mobile',
      status: 'pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    };

    setPaymentData(prev => ({
      ...prev,
      recentPayments: [newPayment, ...prev.recentPayments],
      wallet: {
        ...prev.wallet,
        pending: prev.wallet.pending + parseInt(paymentAmount)
      }
    }));

    setShowMobileDialog(false);
    setPaymentAmount('');
    setCustomerPhone('');
    showSnackbar(`Mobile money request sent to ${customerPhone}`);

    // Simulate payment completion
    setTimeout(() => {
      setPaymentData(prev => ({
        ...prev,
        recentPayments: prev.recentPayments.map(payment =>
          payment.id === newPayment.id
            ? { ...payment, status: 'completed' }
            : payment
        ),
        wallet: {
          ...prev.wallet,
          balance: prev.wallet.balance + parseInt(paymentAmount),
          available: prev.wallet.available + parseInt(paymentAmount),
          pending: prev.wallet.pending - parseInt(paymentAmount),
        },
        earnings: {
          ...prev.earnings,
          today: prev.earnings.today + parseInt(paymentAmount),
          week: prev.earnings.week + parseInt(paymentAmount),
          month: prev.earnings.month + parseInt(paymentAmount)
        }
      }));
      showSnackbar(`Mobile money received from ${customerPhone}`, 'success');
    }, 3000);
  };

  const handleCashPayment = () => {
    if (!cashAmount || cashAmount <= 0) {
      showSnackbar('Please enter a valid amount', 'error');
      return;
    }

    const newPayment = {
      id: Date.now(),
      amount: parseInt(cashAmount),
      customer: 'Cash Customer',
      method: 'cash',
      status: 'completed',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    };

    setPaymentData(prev => ({
      ...prev,
      recentPayments: [newPayment, ...prev.recentPayments],
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance + parseInt(cashAmount),
        available: prev.wallet.available + parseInt(cashAmount)
      },
      earnings: {
        ...prev.earnings,
        today: prev.earnings.today + parseInt(cashAmount),
        week: prev.earnings.week + parseInt(cashAmount),
        month: prev.earnings.month + parseInt(cashAmount)
      }
    }));

    setShowCashDialog(false);
    setCashAmount('');
    showSnackbar(`Cash payment of UGX ${parseInt(cashAmount).toLocaleString()} recorded`, 'success');
  };

  const handleWithdraw = () => {
    if (paymentData.wallet.available <= 0) {
      showSnackbar('No available balance to withdraw', 'error');
      return;
    }

    setPaymentData(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance - prev.wallet.available,
        available: 0
      }
    }));

    showSnackbar(`Withdrawal request for UGX ${paymentData.wallet.available.toLocaleString()} submitted!`, 'success');
  };

  const handleExport = () => {
    showSnackbar('Payment history exported successfully', 'info');
  };

  const handleShare = () => {
    showSnackbar('Payment summary shared', 'info');
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'cash': return <LocalAtm />;
      case 'mobile': return <Smartphone />;
      case 'qr': return <QrCode />;
      default: return <Payment />;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'cash': return 'warning';
      case 'mobile': return 'success';
      case 'qr': return 'primary';
      default: return 'info';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? <CheckCircle color="success" /> : <Schedule color="warning" />;
  };

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
              My Money 💰
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4, textAlign: isMobile ? 'center' : 'left' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold" 
            gutterBottom
            color="primary"
          >
            Payments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your money and track earnings
          </Typography>
        </Box>

        {/* Wallet Balance - Big and Clear */}
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <AccountBalanceWallet sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
            <Typography variant="h6" gutterBottom>
              Available Balance
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              UGX {paymentData.wallet.balance.toLocaleString()}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              Ready to withdraw: UGX {paymentData.wallet.available.toLocaleString()}
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 1, 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
              onClick={handleWithdraw}
              disabled={paymentData.wallet.available <= 0}
            >
              Withdraw Money
            </Button>
          </CardContent>
        </Card>

        {/* Quick Payment Actions */}
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Receive Payments
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {paymentMethods.map((method, index) => (
            <Grid item xs={6} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  textAlign: 'center',
                  p: 2,
                  backgroundColor: 'background.paper',
                  border: `2px solid ${theme.palette[method.color].light}`,
                  '&:hover': {
                    backgroundColor: `${method.color}.50`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={method.action}
              >
                <Box sx={{ color: `${method.color}.main`, mb: 1 }}>
                  {method.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {method.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {method.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Earnings Summary */}
        <Card sx={{ mb: 3, backgroundColor: 'success.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Your Earnings
            </Typography>
            <Grid container spacing={3} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  UGX {paymentData.earnings.today.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  UGX {paymentData.earnings.week.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Week
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  UGX {paymentData.earnings.month.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Month
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Payments
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={handleExport}>
                  <Download />
                </IconButton>
                <IconButton size="small" onClick={handleShare}>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <List>
              {paymentData.recentPayments.map((payment, index) => (
                <ListItem 
                  key={payment.id} 
                  divider={index < paymentData.recentPayments.length - 1}
                  sx={{ px: isMobile ? 0 : 2 }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: `${getMethodColor(payment.method)}.100` }}>
                      {getMethodIcon(payment.method)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="body1" fontWeight="500">
                            {payment.customer}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.time} • {payment.method.toUpperCase()}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" fontWeight="bold" color="success.main">
                            UGX {payment.amount.toLocaleString()}
                          </Typography>
                          <Chip 
                            icon={getStatusIcon(payment.status)}
                            label={payment.status}
                            size="small"
                            color={payment.status === 'completed' ? 'success' : 'warning'}
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Quick Summary */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    {paymentData.recentPayments.filter(p => p.status === 'completed').length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    {paymentData.recentPayments.filter(p => p.status === 'pending').length}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Big Action Buttons at Bottom */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<QrCode />}
              onClick={() => setShowQRDialog(true)}
              size="large"
            >
              Show QR
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Smartphone />}
              onClick={() => setShowMobileDialog(true)}
              size="large"
            >
              Mobile Money
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onClose={() => setShowQRDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Your Payment QR Code</Typography>
            <IconButton onClick={() => setShowQRDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box 
            sx={{ 
              width: 200, 
              height: 200, 
              bgcolor: 'grey.200', 
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2
            }}
          >
            <QrCode sx={{ fontSize: 100, color: 'grey.600' }} />
          </Box>
          <Typography variant="body1" gutterBottom>
            Show this QR code to your customer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            They can scan it to pay any amount
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="outlined" onClick={() => setShowQRDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* General Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Request Payment</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (UGX)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: <AttachMoney color="action" sx={{ mr: 1 }} />
            }}
          />
          <TextField
            fullWidth
            label="Customer Phone (Optional)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="256712345678"
            InputProps={{
              startAdornment: <Phone color="action" sx={{ mr: 1 }} />
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRequestPayment}>
            Request Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Money Dialog */}
      <Dialog open={showMobileDialog} onClose={() => setShowMobileDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Mobile Money Payment</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (UGX)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Customer Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="256712345678"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMobileDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleMobilePayment}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cash Payment Dialog */}
      <Dialog open={showCashDialog} onClose={() => setShowCashDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Record Cash Payment</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount Received (UGX)"
            type="number"
            value={cashAmount}
            onChange={(e) => setCashAmount(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCashDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCashPayment}>
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SimplePaymentsPage;