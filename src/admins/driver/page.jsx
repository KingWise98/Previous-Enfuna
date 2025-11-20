import React, { useState } from 'react';
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
  Paper,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  AccountBalanceWallet,
  Payment,
  QrCode,
  Smartphone,
  CreditCard,
  Receipt,
  Download,
  TrendingUp,
  History,
  Add,
  CheckCircle,
  LocalAtm,
  PhoneIphone,
  Star,
  Share,
  FilterList,
  Search
} from '@mui/icons-material';

const SimplePaymentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Simplified driver data
  const [driverData, setDriverData] = useState({
    wallet: {
      balance: 285000,
      available: 275000,
      pending: 10000,
      todayEarnings: 45000,
      weeklyEarnings: 285000
    },
    recentTransactions: [
      {
        id: 'TXN001',
        amount: 20000,
        type: 'credit',
        method: 'qr',
        status: 'completed',
        timestamp: '2024-01-15 14:30',
        customer: 'Walk-in Customer',
        service: 'City Trip'
      },
      {
        id: 'TXN002',
        amount: 60000,
        type: 'credit',
        method: 'mobile',
        status: 'completed',
        timestamp: '2024-01-15 12:15',
        customer: 'Customer #7890',
        service: 'Airport Drop'
      },
      {
        id: 'TXN003',
        amount: 15000,
        type: 'credit',
        method: 'card',
        status: 'completed',
        timestamp: '2024-01-15 10:45',
        customer: 'Customer #7891',
        service: 'Delivery'
      },
      {
        id: 'TXN004',
        amount: 10000,
        type: 'credit',
        method: 'cash',
        status: 'pending',
        timestamp: '2024-01-15 09:30',
        customer: 'Customer #7892',
        service: 'City Trip'
      }
    ],
    earnings: {
      today: 45000,
      week: 285000,
      month: 1150000,
      lastWeek: 254000
    }
  });

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: <LocalAtm />, color: 'success' },
    { id: 'qr', name: 'QR Code', icon: <QrCode />, color: 'primary' },
    { id: 'mobile', name: 'Mobile Money', icon: <Smartphone />, color: 'warning' },
    { id: 'card', name: 'Card', icon: <CreditCard />, color: 'secondary' }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'success' : 'warning';
  };

  const getMethodIcon = (method) => {
    return paymentMethods.find(m => m.id === method)?.icon || <Payment />;
  };

  const getMethodColor = (method) => {
    return paymentMethods.find(m => m.id === method)?.color || 'default';
  };

  const QuickStats = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <Card elevation={1}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              UGX {driverData.earnings.today.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Today
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card elevation={1}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              UGX {driverData.earnings.week.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              This Week
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card elevation={1}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" color="info.main" fontWeight="bold">
              UGX {driverData.earnings.month.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              This Month
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card elevation={1}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography 
              variant="h6" 
              color={driverData.earnings.week > driverData.earnings.lastWeek ? "success.main" : "error.main"} 
              fontWeight="bold"
            >
              {((driverData.earnings.week - driverData.earnings.lastWeek) / driverData.earnings.lastWeek * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="textSecondary">
              vs Last Week
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const WalletCard = () => (
    <Card 
      elevation={2} 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        mb: 2
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
              Available Balance
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              UGX {driverData.wallet.available.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              Total: UGX {driverData.wallet.balance.toLocaleString()}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}>
            <AccountBalanceWallet />
          </Avatar>
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
            onClick={() => setShowQRDialog(true)}
          >
            Show QR
          </Button>
          <Button 
            variant="outlined" 
            fullWidth
            sx={{ 
              borderColor: 'white', 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
            onClick={() => setShowPaymentDialog(true)}
          >
            Request Pay
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const TransactionItem = ({ transaction, showDivider = true }) => (
    <>
      <ListItem sx={{ px: isMobile ? 1 : 2 }}>
        <ListItemIcon>
          <Avatar sx={{ bgcolor: `${getMethodColor(transaction.method)}.50`, width: 40, height: 40 }}>
            {getMethodIcon(transaction.method)}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body1" fontWeight="500">
                  {transaction.service}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {transaction.customer} • {transaction.timestamp}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  UGX {transaction.amount.toLocaleString()}
                </Typography>
                <Chip 
                  label={transaction.status} 
                  size="small"
                  color={getStatusColor(transaction.status)}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          }
        />
      </ListItem>
      {showDivider && <Divider />}
    </>
  );

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 3, 
      minHeight: '100vh', 
      backgroundColor: 'background.default'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Payments & Earnings 💰
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your payments and earnings
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              startIcon={<Download />} 
              variant="outlined" 
              size={isMobile ? "small" : "medium"}
            >
              Export
            </Button>
            <Button 
              startIcon={<Share />} 
              variant="outlined" 
              size={isMobile ? "small" : "medium"}
            >
              Share
            </Button>
          </Box>
        </Box>

        <QuickStats />
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - Wallet & Quick Actions */}
        <Grid item xs={12} md={4}>
          <WalletCard />

          {/* Payment Methods */}
          <Card elevation={1} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Methods
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {paymentMethods.map((method) => (
                  <Paper
                    key={method.id}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <Avatar sx={{ bgcolor: `${method.color}.50`, color: `${method.color}.main` }}>
                      {method.icon}
                    </Avatar>
                    <Typography variant="body1" fontWeight="500">
                      {method.name}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Quick Summary */}
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                This Week
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Total Earnings" 
                    secondary={`UGX ${driverData.earnings.week.toLocaleString()}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Completed Rides" 
                    secondary={driverData.recentTransactions.filter(t => t.status === 'completed').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Pending Payments" 
                    secondary={driverData.recentTransactions.filter(t => t.status === 'pending').length}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card elevation={1}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
            >
              <Tab label="Recent Payments" />
              <Tab label="Earnings History" />
              <Tab label="Payment Methods" />
            </Tabs>

            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
              {/* Recent Payments */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                    <Typography variant="h6">
                      Recent Payments
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<FilterList />}>
                        Filter
                      </Button>
                      <Button size="small" startIcon={<Search />}>
                        Search
                      </Button>
                    </Box>
                  </Box>

                  <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {driverData.recentTransactions.map((transaction, index) => (
                      <TransactionItem 
                        key={transaction.id}
                        transaction={transaction}
                        showDivider={index < driverData.recentTransactions.length - 1}
                      />
                    ))}
                  </List>
                </Box>
              )}

              {/* Earnings History */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Earnings Overview
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          UGX {driverData.earnings.week.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This Week
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Star color="warning" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h5" color="warning.main" fontWeight="bold">
                          UGX {driverData.earnings.month.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This Month
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom>
                    Daily Breakdown (This Week)
                  </Typography>
                  <List>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <ListItem key={day} divider>
                        <ListItemText primary={day} />
                        <Typography variant="body1" fontWeight="bold">
                          UGX {(Math.random() * 50000 + 20000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Payment Methods */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Available Payment Methods
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {paymentMethods.map((method) => (
                      <Grid item xs={12} sm={6} key={method.id}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: `${method.color}.50`, 
                                color: `${method.color}.main`,
                                width: 60, 
                                height: 60,
                                mx: 'auto',
                                mb: 2
                              }}
                            >
                              {method.icon}
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                              {method.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {method.id === 'cash' && 'Accept cash payments directly'}
                              {method.id === 'qr' && 'Customer scans QR code to pay'}
                              {method.id === 'mobile' && 'Send payment request via mobile'}
                              {method.id === 'card' && 'Accept card payments'}
                            </Typography>
                            <Button 
                              variant="outlined" 
                              fullWidth
                              onClick={() => setShowPaymentDialog(true)}
                            >
                              Use {method.name}
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
      </Grid>

      {/* QR Code Dialog */}
      <Dialog 
        open={showQRDialog} 
        onClose={() => setShowQRDialog(false)} 
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Payment QR
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Customers scan to pay any amount
          </Typography>
          
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
          
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Driver ID: DRV-ENF0125
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="outlined" onClick={() => setShowQRDialog(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Share />}>
            Share
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Request Dialog */}
      <Dialog 
        open={showPaymentDialog} 
        onClose={() => setShowPaymentDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Request Payment</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Amount (UGX)"
            type="number"
            placeholder="0"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Customer Phone (Optional)"
            placeholder="256712345678"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Payment />}>
            Request Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimplePaymentsPage;