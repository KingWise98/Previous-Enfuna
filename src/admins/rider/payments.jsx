import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Divider,
  LinearProgress
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
  AttachMoney,
  ArrowBack
} from '@mui/icons-material';

const SimplePaymentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
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
      color: '#0025DD',
      action: () => setShowQRDialog(true)
    },
    {
      title: 'Mobile Money',
      description: 'Send payment request',
      icon: <Smartphone sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: '#FFEC01',
      textColor: '#000',
      action: () => setShowMobileDialog(true)
    },
    {
      title: 'Cash Payment',
      description: 'Record cash received',
      icon: <LocalAtm sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: '#10B981',
      action: () => setShowCashDialog(true)
    },
    {
      title: 'Request Payment',
      description: 'Any payment method',
      icon: <Payment sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: '#4ECDC4',
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
      case 'cash': return '#FFEC01';
      case 'mobile': return '#0025DD';
      case 'qr': return '#10B981';
      default: return '#4ECDC4';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? <CheckCircle sx={{ color: '#10B981' }} /> : <Schedule sx={{ color: '#FFEC01' }} />;
  };

  // Financial Summary Cards for Top Section
  const FinancialSummary = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Total Balance */}
      <Grid item xs={12} sm={6} lg={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 37, 221, 0.2)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <AccountBalanceWallet sx={{ fontSize: 40, opacity: 0.8 }} />
              <TrendingUp sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              UGX {paymentData.wallet.balance.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Balance
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="caption">
                Available: UGX {paymentData.wallet.available.toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Today's Earnings */}
      <Grid item xs={12} sm={6} lg={3}>
        <Card sx={{ 
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Receipt sx={{ fontSize: 40, color: '#0025DD' }} />
              <TrendingUp sx={{ fontSize: 20, color: '#10B981' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="#0025DD" sx={{ mb: 1 }}>
              UGX {paymentData.earnings.today.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Today's Earnings
            </Typography>
            <Typography variant="caption" color="#10B981" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {paymentData.recentPayments.filter(p => p.status === 'completed').length} payments
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* This Week */}
      <Grid item xs={12} sm={6} lg={3}>
        <Card sx={{ 
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <TrendingUp sx={{ fontSize: 40, color: '#10B981' }} />
              <TrendingUp sx={{ fontSize: 20, color: '#10B981' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="#10B981" sx={{ mb: 1 }}>
              UGX {paymentData.earnings.week.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This Week
            </Typography>
            <Typography variant="caption" color="#10B981" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              +12.5% from last week
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending */}
      <Grid item xs={12} sm={6} lg={3}>
        <Card sx={{ 
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Schedule sx={{ fontSize: 40, color: '#FFEC01' }} />
              <TrendingUp sx={{ fontSize: 20, color: '#FFEC01' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="#FFEC01" sx={{ mb: 1 }}>
              UGX {paymentData.wallet.pending.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
            <Typography variant="caption" color="#FFEC01" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {paymentData.recentPayments.filter(p => p.status === 'pending').length} payments
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      pb: 3
    }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#0025DD',
          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ color: 'white', mr: 2 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Payments
          </Typography>
          <Chip 
            label="Active Driver" 
            sx={{ 
              backgroundColor: '#FFEC01', 
              color: '#000',
              fontWeight: 'bold'
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Financial Summary Cards */}
        <FinancialSummary />

        {/* Quick Payment Actions */}
        <Card sx={{ 
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              Receive Payments
            </Typography>
            <Grid container spacing={2}>
              {paymentMethods.map((method, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      textAlign: 'center',
                      p: 2,
                      backgroundColor: method.color,
                      color: method.textColor || 'white',
                      borderRadius: 2,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={method.action}
                  >
                    <Box sx={{ mb: 1 }}>
                      {method.icon}
                    </Box>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      {method.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {method.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="#0025DD">
                Recent Payments
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={handleExport}
                  sx={{ color: '#0025DD' }}
                >
                  <Download />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={handleShare}
                  sx={{ color: '#0025DD' }}
                >
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <List>
              {paymentData.recentPayments.map((payment, index) => (
                <ListItem 
                  key={payment.id} 
                  divider={index < paymentData.recentPayments.length - 1}
                  sx={{ px: 0 }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ backgroundColor: `${getMethodColor(payment.method)}20` }}>
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
                          <Typography variant="body1" fontWeight="bold" color="#10B981">
                            UGX {payment.amount.toLocaleString()}
                          </Typography>
                          <Chip 
                            icon={getStatusIcon(payment.status)}
                            label={payment.status}
                            size="small"
                            sx={{ 
                              backgroundColor: payment.status === 'completed' ? '#10B98120' : '#FFEC01',
                              color: payment.status === 'completed' ? '#10B981' : '#000',
                              mt: 0.5
                            }}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Quick Summary */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#0025DD10', borderRadius: 2 }}>
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h6" color="#0025DD" fontWeight="bold">
                    {paymentData.recentPayments.length}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="h6" color="#10B981" fontWeight="bold">
                    {paymentData.recentPayments.filter(p => p.status === 'completed').length}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h6" color="#FFEC01" fontWeight="bold">
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
              sx={{
                backgroundColor: '#0025DD',
                '&:hover': {
                  backgroundColor: '#001FB8'
                }
              }}
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
              sx={{
                borderColor: '#0025DD',
                color: '#0025DD'
              }}
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
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">Your Payment QR Code</Typography>
            <IconButton onClick={() => setShowQRDialog(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box 
            sx={{ 
              width: 200, 
              height: 200, 
              bgcolor: '#0025DD10', 
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              border: '2px dashed #0025DD'
            }}
          >
            <QrCode sx={{ fontSize: 100, color: '#0025DD' }} />
          </Box>
          <Typography variant="body1" gutterBottom fontWeight="bold">
            Show this QR code to your customer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            They can scan it to pay any amount
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="outlined"
            sx={{
              borderColor: '#0025DD',
              color: '#0025DD'
            }}
            onClick={() => setShowQRDialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* General Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Request Payment</Typography>
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
          <Button 
            onClick={() => setShowPaymentDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD',
              '&:hover': {
                backgroundColor: '#001FB8'
              }
            }}
            onClick={handleRequestPayment}
          >
            Request Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Money Dialog */}
      <Dialog open={showMobileDialog} onClose={() => setShowMobileDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Mobile Money Payment</Typography>
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
          <Button 
            onClick={() => setShowMobileDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD',
              '&:hover': {
                backgroundColor: '#001FB8'
              }
            }}
            onClick={handleMobilePayment}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cash Payment Dialog */}
      <Dialog open={showCashDialog} onClose={() => setShowCashDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Record Cash Payment</Typography>
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
          <Button 
            onClick={() => setShowCashDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD',
              '&:hover': {
                backgroundColor: '#001FB8'
              }
            }}
            onClick={handleCashPayment}
          >
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
          sx={{
            backgroundColor: snackbar.severity === 'success' ? '#0025DD' : undefined,
            color: 'white'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SimplePaymentsPage;