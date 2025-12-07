import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Chip,
  IconButton,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  TextField,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Person,
  DirectionsCar,
  AccountBalanceWallet,
  Payment,
  Receipt,
  TrendingUp,
  TrendingDown,
  Add,
  Visibility,
  Schedule,
  CheckCircle,
  Cancel,
  TripOrigin,
  LocationOn,
  LocalShipping,
  Circle,
  ArrowForward,
  ArrowUpward,
  ArrowDownward,
  CloudUpload,
  Search,
  Refresh,
  Share,
  Delete,
  AttachMoney,
  QrCode,
  Money,
  FileUpload,
  ArrowBack,
  Save,
  DirectionsRun,
  CreditCard,
  LocalAtm
} from '@mui/icons-material';

// Main Dashboard Component
const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('deliveries');
  const [timeFrame, setTimeFrame] = useState('Daily');

  const handleTabChange = (event, newTab) => {
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  const tabs = [
    { id: 'deliveries', label: 'Deliveries', icon: <LocalShipping /> },
    { id: 'start-trip', label: 'Start Trip', icon: <TripOrigin /> },
    { id: 'receive-money', label: 'Receive Money', icon: <Payment /> },
    { id: 'withdraw-money', label: 'Withdraw Money', icon: <AccountBalanceWallet /> },
    { id: 'add-expense', label: 'Add Expense', icon: <Add /> },
  ];

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
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ENFUNA Driver
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
              Quick Actions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Person />}
            sx={{
              backgroundColor: '#0025DD',
              border: '2px solid white',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#001FB8'
              }
            }}
            onClick={() => navigate('/profile')}
          >
            Complete Profile
          </Button>
          {activeTab !== 'deliveries' && (
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setActiveTab('deliveries')}
              sx={{
                ml: 2,
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Back
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Tab Navigation */}
      <Box sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0',
        px: isMobile ? 1 : 3,
        py: 1
      }}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          sx={{
            width: '100%',
            justifyContent: 'space-between',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}
        >
          {tabs.map((tab) => (
            <ToggleButton
              key={tab.id}
              value={tab.id}
              sx={{
                flex: 1,
                minWidth: isMobile ? '120px' : 'auto',
                py: 1.5,
                mx: 0.5,
                borderColor: '#e2e8f0',
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: '#0025DD',
                  color: 'white',
                  borderColor: '#0025DD',
                  '&:hover': {
                    backgroundColor: '#001FB8'
                  }
                },
                '&:not(.Mui-selected)': {
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  '&:hover': {
                    backgroundColor: '#f1f5f9'
                  }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {tab.icon}
                <Typography variant="body2" fontWeight="bold">
                  {tab.label}
                </Typography>
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {activeTab === 'deliveries' ? (
          <DeliveriesContent 
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            isMobile={isMobile}
            navigate={navigate}
          />
        ) : activeTab === 'start-trip' ? (
          <StartTripContent />
        ) : activeTab === 'receive-money' ? (
          <ReceiveMoneyContent />
        ) : activeTab === 'withdraw-money' ? (
          <WithdrawMoneyContent />
        ) : activeTab === 'add-expense' ? (
          <AddExpenseContent />
        ) : null}
      </Box>
    </Box>
  );
};

// Deliveries Content Component
const DeliveriesContent = ({ timeFrame, setTimeFrame, isMobile, navigate }) => {
  const deliveryStats = {
    walletBalance: '40,000',
    totalDeliveries: 125,
    totalRevenue: 40000,
    completedDeliveries: 102,
    failedDeliveries: 23,
    deliveryPercentageChange: {
      totalDeliveries: '+0.5%',
      totalRevenue: '+2.5%',
      completedDeliveries: '+20.5%',
      failedDeliveries: '-2.5%'
    }
  };

  const earningsSummary = {
    trips: 10, momo: 52000, cash: 44000, fuelExpenses: 15000, totalEarnings: 96000, netEarnings: 81000
  };
  
  const motorcycleInfo = { plate: 'UAJ 786X', model: 'Bajaj Boxer - Red', status: 'Active' };

  const deliveryActivities = [
    {
      id: 1, route: { pickup: 'Mukono', destination: 'Kampala' }, amount: '4,000 uGX',
      paymentMethod: 'Cash', note: 'Manual Overide', recipient: { name: 'JohnBosco', phone: '+256 7890 988 990' },
      description: 'Package Delivered To Recipient', date: '02/12/2025', time: '202 PM',
      status: 'Complete', distance: '5.3 KM', color: '#10B981', icon: <CheckCircle />
    },
    {
      id: 2, route: { pickup: 'Kyambogo', destination: 'Kololo' }, amount: '0.00 UGX',
      paymentMethod: 'MTN MoMo', recipient: { name: 'Aaron', phone: '+256 7890 988 990' },
      description: 'Delivery Canceled', date: '02/12/2025', time: '202 PM',
      status: 'Canceled', distance: '0.0 KM', color: '#FF6B6B', icon: <Cancel />
    }
  ];

  const handleTimeFrameChange = (event, newTimeFrame) => {
    if (newTimeFrame !== null) {
      setTimeFrame(newTimeFrame);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {/* Wallet Balance Section */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>Wallet Balance</Typography>
              
              <Box sx={{ mb: 3 }}>
                <ToggleButtonGroup value={timeFrame} exclusive onChange={handleTimeFrameChange} size="small"
                  sx={{ backgroundColor: '#f1f5f9', borderRadius: 1 }}>
                  <ToggleButton value="Daily" sx={{ px: 3 }}>Daily</ToggleButton>
                  <ToggleButton value="Weekly" sx={{ px: 3 }}>Weekly</ToggleButton>
                  <ToggleButton value="Monthly" sx={{ px: 3 }}>Monthly</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ p: 3, backgroundColor: '#0025DD10', borderRadius: 2, mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="#0025DD">
                  UGX {deliveryStats.walletBalance}
                </Typography>
              </Box>

              {/* Delivery Stats Grid */}
              <Grid container spacing={2}>
                {[
                  { label: 'Total Deliveries', value: deliveryStats.totalDeliveries, change: deliveryStats.deliveryPercentageChange.totalDeliveries },
                  { label: 'Total Revenue', value: deliveryStats.totalRevenue.toLocaleString(), change: deliveryStats.deliveryPercentageChange.totalRevenue },
                  { label: 'Completed Deliveries', value: deliveryStats.completedDeliveries, change: deliveryStats.deliveryPercentageChange.completedDeliveries },
                  { label: 'Failed Deliveries', value: deliveryStats.failedDeliveries, change: deliveryStats.deliveryPercentageChange.failedDeliveries, negative: true }
                ].map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" fontWeight="bold" color="#0025DD">{stat.value}</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>{stat.label}</Typography>
                      <Chip label={stat.change} size="small" icon={stat.negative ? <ArrowDownward sx={{ fontSize: 14 }} /> : <ArrowUpward sx={{ fontSize: 14 }} />}
                        sx={{ backgroundColor: stat.negative ? '#FF6B6B20' : '#10B98120', color: stat.negative ? '#FF6B6B' : '#10B981', fontSize: '0.75rem' }} />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Ready to Work Section */}
              <Box sx={{ mt: 3, p: 3, backgroundColor: '#FFEC01', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Ready to Deliver?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Start A New Delivery And Start Earning
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: '#0025DD', color: 'white', fontWeight: 'bold', px: 4, py: 1.5 }}
                  onClick={() => navigate('/rider/delivery')}>
                  Start New Delivery →
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Earnings Summary */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>Earnings Summary</Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Trips', value: earningsSummary.trips },
                  { label: 'MoMo', value: `UGX ${earningsSummary.momo.toLocaleString()}` },
                  { label: 'Cash', value: `UGX ${earningsSummary.cash.toLocaleString()}` },
                  { label: 'Fuel Expenses', value: `UGX ${earningsSummary.fuelExpenses.toLocaleString()}`, color: '#FF6B6B' }
                ].map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    <Typography variant="h6" fontWeight="bold" color={item.color || 'inherit'}>{item.value}</Typography>
                  </Grid>
                ))}
                <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Earnings</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#10B981">UGX {earningsSummary.totalEarnings.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Net Earnings</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#0025DD">UGX {earningsSummary.netEarnings.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Delivery Activity */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#0025DD">
                  Delivery Activity
                </Typography>
                <Button size="small" endIcon={<Visibility />} sx={{ color: '#0025DD' }}>
                  View Delivery summary
                </Button>
              </Box>

              <List>
                {deliveryActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="#0025DD" gutterBottom>Route(Pickup & Destination)</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: '#0025DD' }} />
                          <Typography variant="body2">{activity.route.pickup}</Typography>
                          <ArrowForward sx={{ fontSize: 16, color: '#0025DD' }} />
                          <Typography variant="body2">{activity.route.destination}</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>{activity.amount}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Chip label={activity.paymentMethod} size="small" sx={{ backgroundColor: '#0025DD10', color: '#0025DD' }} />
                          {activity.note && <Chip label={activity.note} size="small" sx={{ backgroundColor: '#FFEC01', color: '#000' }} />}
                        </Box>
                        <Typography variant="subtitle2" fontWeight="bold" color="#0025DD" gutterBottom>Receipient</Typography>
                        <Typography variant="body2" gutterBottom>{activity.recipient.name}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{activity.recipient.phone}</Typography>
                        <Typography variant="subtitle2" fontWeight="bold" color="#0025DD" gutterBottom>Description</Typography>
                        <Typography variant="body2" gutterBottom>{activity.description}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{activity.date} • {activity.time}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Chip icon={activity.icon} label={activity.status}
                            sx={{ backgroundColor: `${activity.color}20`, color: activity.color, fontWeight: 'bold' }} />
                          <Typography variant="body2" color="text.secondary">Distance {activity.distance}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < deliveryActivities.length - 1 && <Divider sx={{ my: 2 }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Motorcycle Info */}
          <Card sx={{ 
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>Motorcycle info</Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Avatar sx={{ width: 80, height: 80, backgroundColor: '#0025DD20', color: '#0025DD', fontSize: 32, fontWeight: 'bold', mb: 2, mx: 'auto' }}>
                  {motorcycleInfo.plate.substring(0, 3)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>{motorcycleInfo.plate}</Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>{motorcycleInfo.model}</Typography>
                <Chip icon={<Circle sx={{ fontSize: 10 }} />} label={motorcycleInfo.status}
                  sx={{ backgroundColor: '#10B98120', color: '#10B981', fontWeight: 'bold' }} />
              </Box>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', backgroundColor: '#0025DD10' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Need help with your deliveries?</Typography>
              <Typography variant="h6" fontWeight="bold" color="#0025DD" sx={{ mt: 1 }}>Contact Support</Typography>
              <Button variant="outlined" sx={{ mt: 2, borderColor: '#0025DD', color: '#0025DD' }}>Get Help</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

// Start Trip Content Component
const StartTripContent = () => {
  const [amount, setAmount] = useState('5,000');
  const [duration, setDuration] = useState('12:30');
  const [distance, setDistance] = useState('5.3');

  const handleStartTrip = () => {
    alert(`Trip started! Amount: UGX ${amount}, Duration: ${duration}, Distance: ${distance} KM`);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" color="#0025DD" gutterBottom align="center">
        Quick Trip
      </Typography>

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Payment Summary */}
          <Box sx={{ mb: 4, p: 3, backgroundColor: '#0025DD10', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="#0025DD" gutterBottom align="center">
              Payment Summary
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Trip</Typography>
                <Typography variant="h6" fontWeight="bold">Trip-112</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Amount</Typography>
                <Typography variant="h6" fontWeight="bold" color="#10B981">UGX {amount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                <Typography variant="h6" fontWeight="bold">Cash</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Trip Duration</Typography>
                <Typography variant="h6" fontWeight="bold">{duration}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                <Chip label="Paid" sx={{ backgroundColor: '#10B98120', color: '#10B981', fontWeight: 'bold' }} />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  startIcon={<Receipt />}
                  sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                >
                  View Receipt
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Trip Details */}
          <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
            Trip Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                  Amount (UGX)
                </Typography>
                <TextField
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                    sx: { fontSize: '1.25rem', fontWeight: 'bold' }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                  Trip Duration
                </Typography>
                <TextField
                  fullWidth
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="mins:sec"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mins</InputAdornment>,
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                  Distance (KM)
                </Typography>
                <TextField
                  fullWidth
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">KM</InputAdornment>,
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                  Payment Method
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value="cash"
                    sx={{ fontWeight: 'bold' }}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="momo">MoMo</MenuItem>
                    <MenuItem value="airtel">Airtel Money</MenuItem>
                    <MenuItem value="visa">VISA</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          {/* Trip History Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
              Trip History
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              View completed trip summary
            </Typography>

            <Card sx={{ mb: 2, border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" fontWeight="bold">Mukono → Kampala</Typography>
                    <Typography variant="body2" color="text.secondary">18 min 01 sec • 5.3 KM</Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">4,000 UGX</Typography>
                    <Chip label="Cash" size="small" sx={{ backgroundColor: '#0025DD10', color: '#0025DD' }} />
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Manual Override
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" fontWeight="bold">Kireka → Banda</Typography>
                    <Typography variant="body2" color="text.secondary">4 min 21 sec • 5.3 KM</Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">2,000 UGX</Typography>
                    <Chip label="Airtel Money" size="small" sx={{ backgroundColor: '#10B98120', color: '#10B981' }} />
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Manual Override
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Start Trip Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartTrip}
              sx={{
                backgroundColor: '#0025DD',
                color: 'white',
                fontWeight: 'bold',
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#001FB8'
                }
              }}
            >
              START NEW TRIP →
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

// Receive Money Content Component
const ReceiveMoneyContent = () => {
  const [amount, setAmount] = useState('5,000');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [splitPayment, setSplitPayment] = useState(false);

  const paymentMethods = [
    { id: 'CASH', label: 'CASH', icon: <Money /> },
    { id: 'MOMO', label: 'MOMO', icon: <AccountBalanceWallet /> },
    { id: 'AIRTEL', label: 'AIRTEL', icon: <Payment /> },
    { id: 'VISA', label: 'VISA', icon: <CreditCard /> },
    { id: 'QR', label: 'QR Code', icon: <QrCode /> }
  ];

  const handleSubmit = () => {
    alert(`Payment of UGX ${amount} received via ${paymentMethod}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" color="#0025DD" gutterBottom align="center">
        Receive Money
      </Typography>

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Trip Summary */}
          <Box sx={{ mb: 4, p: 3, backgroundColor: '#0025DD10', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="#0025DD" gutterBottom>
              Quick Trip
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Trip ID:</Typography>
                <Typography variant="body1" fontWeight="bold">Trip-112</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Time Lapse:</Typography>
                <Typography variant="body1" fontWeight="bold">5min 14s</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Amount Input */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
              Enter Cash Amount
            </Typography>
            <TextField
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                sx: { fontSize: '1.5rem', fontWeight: 'bold', height: 60 }
              }}
            />
          </Box>

          {/* Payment Methods */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
              Select Payment Method
            </Typography>
            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={4} key={method.id}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: paymentMethod === method.id ? '2px solid #0025DD' : '1px solid #e2e8f0',
                      backgroundColor: paymentMethod === method.id ? '#0025DD10' : 'white',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#0025DD10'
                      }
                    }}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    {method.icon}
                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>{method.label}</Typography>
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: splitPayment ? '2px solid #0025DD' : '1px solid #e2e8f0',
                    backgroundColor: splitPayment ? '#0025DD10' : 'white',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    mt: 2
                  }}
                  onClick={() => setSplitPayment(!splitPayment)}
                >
                  <Typography variant="body2" fontWeight="bold">Split Payment</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Action Buttons */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ py: 1.5, borderColor: '#0025DD', color: '#0025DD' }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ py: 1.5, backgroundColor: '#0025DD', color: 'white' }}
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

// Withdraw Money Content Component
const WithdrawMoneyContent = () => {
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');

  const handleSubmit = () => {
    alert(`Withdrawal request of UGX ${amount} submitted via ${withdrawalMethod}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" color="#0025DD" gutterBottom align="center">
        Withdraw Money
      </Typography>

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Wallet Balance */}
          <Box sx={{ mb: 4, p: 3, backgroundColor: '#0025DD10', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
              Available Balance
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="#0025DD">
              UGX 40,000
            </Typography>
          </Box>

          {/* Amount Input */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
              Enter Amount to Withdraw
            </Typography>
            <TextField
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              InputProps={{
                startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                sx: { fontSize: '1.5rem', fontWeight: 'bold' }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Minimum withdrawal: UGX 5,000
            </Typography>
          </Box>

          {/* Withdrawal Method */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
              Select Withdrawal Method
            </Typography>
            <RadioGroup value={withdrawalMethod} onChange={(e) => setWithdrawalMethod(e.target.value)}>
              <FormControlLabel value="bank" control={<Radio />} label="Bank Transfer" />
              <FormControlLabel value="momo" control={<Radio />} label="Mobile Money (MoMo)" />
              <FormControlLabel value="airtel" control={<Radio />} label="Airtel Money" />
              <FormControlLabel value="card" control={<Radio />} label="Card Withdrawal" />
            </RadioGroup>
          </Box>

          {/* Action Buttons */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ py: 1.5, borderColor: '#0025DD', color: '#0025DD' }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={!amount || parseFloat(amount) < 5000}
                sx={{ py: 1.5, backgroundColor: '#0025DD', color: 'white' }}
              >
                Withdraw Now
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

// Add Expense Content Component
const AddExpenseContent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [expenseData, setExpenseData] = useState({
    category: '',
    amount: '',
    date: '05-12-2025',
    description: '',
    paymentMethod: 'MTN MoMo',
    receipt: null
  });

  const expenseCategories = [
    'Fuel', 'Parking', 'Repairs', 'Meals', 'Airtime', 'Insurance', 'Washing Bay', 'Other'
  ];

  const steps = ['Category & Amount', 'Details & Receipt', 'Review & Save'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSaveExpense();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSaveExpense = () => {
    alert(`Expense saved: ${expenseData.category} - UGX ${expenseData.amount}`);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setExpenseData({ ...expenseData, receipt: file });
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
              What Did You Spend On
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                Expense Category
              </Typography>
              <Grid container spacing={2}>
                {expenseCategories.map((category) => (
                  <Grid item xs={6} sm={3} key={category}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: expenseData.category === category ? '2px solid #0025DD' : '1px solid #e2e8f0',
                        backgroundColor: expenseData.category === category ? '#0025DD10' : 'white',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#0025DD10'
                        }
                      }}
                      onClick={() => setExpenseData({ ...expenseData, category })}
                    >
                      <Typography variant="body2" fontWeight="bold">{category}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                Enter Amount
              </Typography>
              <TextField
                fullWidth
                value={expenseData.amount}
                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                placeholder="10,000"
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                  sx: { fontSize: '1.5rem', fontWeight: 'bold' }
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                Date
              </Typography>
              <TextField
                fullWidth
                value={expenseData.date}
                onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
              />
            </Box>
          </>
        );

      case 1:
        return (
          <>
            <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
              Details & Receipt
            </Typography>
            
            <Box sx={{ mb: 4, textAlign: 'center', p: 4, border: '2px dashed #0025DD', borderRadius: 2 }}>
              <CloudUpload sx={{ fontSize: 48, color: '#0025DD', mb: 2 }} />
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload">
                <Button variant="outlined" component="span" sx={{ mb: 2 }}>
                  Upload Receipt
                </Button>
              </label>
              <Typography variant="body2" color="text.secondary">
                {expenseData.receipt ? expenseData.receipt.name : 'Drag and Drop or Click to Upload'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Max File Size 10MB
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                Add Details (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Description"
                value={expenseData.description}
                onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#0025DD" gutterBottom>
                Motorbike Details
              </Typography>
              <Typography variant="body1" gutterBottom>Bajaj Boxer – UAJ 879G</Typography>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={expenseData.paymentMethod}
                  onChange={(e) => setExpenseData({ ...expenseData, paymentMethod: e.target.value })}
                  label="Payment Method"
                >
                  <MenuItem value="MTN MoMo">MTN MoMo</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Airtel Money">Airtel Money</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
              Review Expense
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Category</Typography>
                <Typography variant="body1" fontWeight="bold">{expenseData.category}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Amount</Typography>
                <Typography variant="body1" fontWeight="bold">UGX {expenseData.amount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Description</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {expenseData.description || 'No Description Provided'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                <Typography variant="body1" fontWeight="bold">{expenseData.date} 10:30 AM</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                <Typography variant="body1" fontWeight="bold">{expenseData.paymentMethod}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Receipt</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {expenseData.receipt ? 'Attached' : 'No Receipt'}
                </Typography>
              </Grid>
            </Grid>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" color="#0025DD" gutterBottom align="center">
        ADD NEW EXPENSE
      </Typography>

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}

          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ py: 1.5, borderColor: '#0025DD', color: '#0025DD' }}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === 0 && (!expenseData.category || !expenseData.amount)}
                sx={{ py: 1.5, backgroundColor: '#0025DD', color: 'white' }}
              >
                {activeStep === steps.length - 1 ? 'Save Expense' : 'Continue'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;