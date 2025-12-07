import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
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
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Tabs,
  Tab
} from '@mui/material';
import {
  DeliveryDining,
  LocationOn,
  AttachMoney,
  CameraAlt,
  Edit,
  CheckCircle,
  Schedule,
  PlayArrow,
  Stop,
  Close,
  Person,
  Phone,
  Description,
  Add,
  CloudUpload,
  Draw,
  ArrowBack,
  QrCode,
  Share,
  Download,
  Report,
  Timer,
  Speed,
  Receipt,
  History,
  TrendingUp,
  PieChart,
  AccessTime,
  CreditCard,
  Smartphone
} from '@mui/icons-material';

const DeliveryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [showNewDeliveryDialog, setShowNewDeliveryDialog] = useState(false);
  const [showCompleteDeliveryDialog, setShowCompleteDeliveryDialog] = useState(false);
  const [showReviewDeliveryDialog, setShowReviewDeliveryDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);
  const [showPaymentSuccessDialog, setShowPaymentSuccessDialog] = useState(false);
  const [showChangeNumberDialog, setShowChangeNumberDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Delivery tracking
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [recipientCode, setRecipientCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [deliveryAmount, setDeliveryAmount] = useState(3000);
  const [newNumber, setNewNumber] = useState('');
  
  // Delivery form state
  const [deliveryForm, setDeliveryForm] = useState({
    customerName: 'Sengendo Mark',
    customerPhone: '+256 079 898 898',
    packageDescription: 'Electronics, Fragile Items, etc...',
    weight: '2.5 Kg',
    deliveryType: 'Same Day Delivery',
    pickupAddress: 'Pioneer Mall, Opp. Centenary Bank, Kampala',
    dropoffAddress: 'UCU campus, Mukono',
    recipientName: 'Magazi Wise',
    recipientPhone: '+256 075 800 898',
    estimatedPrice: '3,000'
  });

  // Delivery history data
  const [deliveryHistory, setDeliveryHistory] = useState([
    {
      id: 'DEL-2847',
      customer: 'Wise',
      contact: '+256 7890 987 980',
      pickup: 'Windston Road - Downtown',
      dropoff: 'Kasangatic - Plot 234 - Nile road',
      time: '2:34 PM',
      distance: '2.3 km',
      estimatedTime: '19 minutes',
      actualTime: '19 minutes',
      amount: '3,000',
      paymentMethod: 'MTN MoMo',
      status: 'Completed',
      otpCode: '878978'
    },
    {
      id: 'DLV-762000089',
      customer: 'Wise',
      contact: '+256 787 009 890',
      pickup: 'Pioneer Mall, Opp. Centenary Bank, Kampala',
      dropoff: 'UCU campus, Mukono',
      time: '10:20 AM',
      distance: '2.2 km',
      amount: '3,000',
      package: 'Hisense TV',
      weight: '25kg',
      status: 'In Progress'
    }
  ]);

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalDeliveries: 120000,
    totalRevenue: 'UGX 120,000',
    completedDeliveries: 102,
    failedDeliveries: 18,
    revenueByType: [
      { type: 'Same-Day', value: 40, amount: 'USX 25,000' },
      { type: 'Express', value: 20, amount: 'USX 10,000' },
      { type: 'Standard', value: 20, amount: 'USX 15,000' },
      { type: 'Bulk', value: 20, amount: 'USX 5,000' }
    ],
    peakHour: '12PM',
    peakDeliveries: 48,
    slowestHour: '8AM',
    slowestDeliveries: 9,
    paymentTrends: {
      cash: { value: 60, change: '+12.5%', amount: '50,000 USX' },
      mtn: { value: 50, change: '+22.5%', amount: '40,000 USX' },
      split: { value: 30, change: '-2.5%', amount: '15,000 USX' },
      qr: { value: 20, change: '-2.5%', amount: '10,000 USX' }
    }
  });

  // Real-time delivery timer
  useEffect(() => {
    let interval;
    if (activeDelivery) {
      interval = setInterval(() => {
        setDeliveryTime(prev => prev + 1);
        setDeliveryDistance(prev => prev + 0.01);
      }, 1000);
    } else {
      setDeliveryTime(0);
      setDeliveryDistance(0);
    }
    return () => clearInterval(interval);
  }, [activeDelivery]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field) => (event) => {
    setDeliveryForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartDelivery = () => {
    const newDelivery = {
      id: `DLV-${Date.now().toString().slice(-9)}`,
      customer: deliveryForm.customerName,
      contact: deliveryForm.customerPhone,
      pickup: deliveryForm.pickupAddress,
      dropoff: deliveryForm.dropoffAddress,
      recipient: deliveryForm.recipientName,
      recipientPhone: deliveryForm.recipientPhone,
      package: deliveryForm.packageDescription,
      weight: deliveryForm.weight,
      deliveryType: deliveryForm.deliveryType,
      amount: parseInt(deliveryForm.estimatedPrice.replace(/,/g, '')),
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startDate: new Date().toLocaleDateString(),
      status: 'active'
    };

    setActiveDelivery(newDelivery);
    setShowNewDeliveryDialog(false);
    setDeliveryTime(0);
    setDeliveryDistance(0);
    showSnackbar('Delivery started successfully!');
  };

  const handleCompleteDelivery = () => {
    setShowCompleteDeliveryDialog(true);
  };

  const handleCaptureCode = () => {
    // Generate random 6-digit code
    const code = Array.from({length: 6}, () => Math.floor(Math.random() * 10)).join(' ');
    setRecipientCode(code);
    showSnackbar('Recipient code captured!');
    setShowCompleteDeliveryDialog(false);
    setShowReviewDeliveryDialog(true);
  };

  const handleSaveDelivery = () => {
    setShowReviewDeliveryDialog(false);
    setShowSaveSuccessDialog(true);
  };

  const handleReceiveMoney = () => {
    setShowReviewDeliveryDialog(false);
    setShowPaymentDialog(true);
  };

  const handleCompletePayment = () => {
    setShowPaymentDialog(false);
    setShowPaymentSuccessDialog(true);
    
    // Add to history
    const completedDelivery = {
      ...activeDelivery,
      status: 'Completed',
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      distance: `${deliveryDistance.toFixed(1)} km`,
      timeTaken: formatTime(deliveryTime),
      amount: deliveryAmount,
      paymentMethod: paymentMethod === 'cash' ? 'Cash' : 
                    paymentMethod === 'mtn' ? 'MTN MoMo' :
                    paymentMethod === 'airtel' ? 'Airtel Money' : 'Cash',
      otpCode: recipientCode.replace(/ /g, '')
    };
    
    setDeliveryHistory(prev => [completedDelivery, ...prev]);
    setActiveDelivery(null);
  };

  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccessDialog(false);
    setShowReceiptDialog(true);
  };

  const generateRecipientCode = () => {
    const code = Array.from({length: 6}, () => Math.floor(Math.random() * 10)).join(' ');
    setRecipientCode(code);
    showSnackbar('New code generated and sent!');
  };

  // Active Delivery Screen
  if (activeDelivery) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5',
        pb: 3
      }}>
        {/* Header */}
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: '#0025DD',
            background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)'
          }}
        >
          <Toolbar>
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={() => setActiveDelivery(null)}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Active Delivery
            </Typography>
            <Chip 
              label="In Progress" 
              sx={{ 
                backgroundColor: '#FFEC01', 
                color: '#000',
                fontWeight: 'bold'
              }}
            />
          </Toolbar>
        </AppBar>

        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="#0025DD">
                Delivery ID: {activeDelivery.id}
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Timer sx={{ color: '#0025DD', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">
                      {formatTime(deliveryTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Elapsed Time
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Speed sx={{ color: '#0025DD', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">
                      {deliveryDistance.toFixed(1)} KM
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Distance Covered
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <AttachMoney sx={{ color: '#0025DD', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">
                      {deliveryAmount.toLocaleString()} usx
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Price
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Delivery Details</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pickup Location
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {activeDelivery.pickup}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Recipient Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {activeDelivery.recipient}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Package
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {activeDelivery.package}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Delivery Type
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {activeDelivery.deliveryType}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Dropoff Location
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {activeDelivery.dropoff}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Recipient Contact
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {activeDelivery.recipientPhone}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Weight
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {activeDelivery.weight}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#0025DD',
                    px: 4,
                    '&:hover': {
                      backgroundColor: '#001FB8'
                    }
                  }}
                  onClick={handleCompleteDelivery}
                >
                  End Delivery
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  // Main Delivery Dashboard
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      pb: 3
    }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#0025DD',
          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Deliveries
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFEC01',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#E6D401'
              }
            }}
            startIcon={<Add />}
            onClick={() => setShowNewDeliveryDialog(true)}
          >
            New Delivery
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Analytics */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Delivery Analytics and Performance
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Real-time Delivery performance analytics
                </Typography>

                <Tabs value={0} sx={{ mb: 2 }}>
                  <Tab label="Daily" />
                  <Tab label="Weekly" />
                  <Tab label="Monthly" />
                </Tabs>

                <Grid container spacing={3}>
                  {/* Stats Cards */}
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD">
                        {analytics.totalDeliveries.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Total Deliveries
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        +12.5% ↑
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD">
                        {analytics.totalRevenue}
                      </Typography>
                      <Typography variant="body2">
                        Total Revenue
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        +2.5% ↑
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD">
                        {analytics.completedDeliveries}
                      </Typography>
                      <Typography variant="body2">
                        Completed Deliveries
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        +20.5% ↑
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD">
                        {analytics.failedDeliveries}
                      </Typography>
                      <Typography variant="body2">
                        Failed Deliveries
                      </Typography>
                      <Typography variant="caption" color="error.main">
                        -2.5% ↓
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Charts Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Revenue By Delivery Type
                    </Typography>
                    <Grid container spacing={2}>
                      {analytics.revenueByType.map((item, index) => (
                        <Grid item xs={3} key={index}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold">
                              {item.value}%
                            </Typography>
                            <Typography variant="caption">
                              {item.type}
                            </Typography>
                            <Typography variant="body2" color="#0025DD">
                              {item.amount}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Payment Trends */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Payment Method Trends
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(analytics.paymentTrends).map(([method, data]) => (
                        <Grid item xs={3} key={method}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold">
                              {data.value}
                            </Typography>
                            <Typography variant="caption">
                              {method.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" color={data.change.startsWith('+') ? 'success.main' : 'error.main'}>
                              {data.change}
                            </Typography>
                            <Typography variant="body2" color="#0025DD">
                              {data.amount}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Quick Start & Recent Deliveries */}
          <Grid item xs={12} md={4}>
            {/* Quick Start */}
            <Card sx={{ mb: 3, border: `2px dashed #0025DD` }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <DeliveryDining sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom color="#0025DD">
                  Start New Delivery
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Create and manage new delivery request
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#0025DD',
                    px: 4,
                    '&:hover': {
                      backgroundColor: '#001FB8'
                    }
                  }}
                  startIcon={<PlayArrow />}
                  onClick={() => setShowNewDeliveryDialog(true)}
                >
                  New Delivery
                </Button>
              </CardContent>
            </Card>

            {/* Recent Deliveries */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Deliveries
                </Typography>
                <List>
                  {deliveryHistory.slice(0, 3).map((delivery, index) => (
                    <ListItem 
                      key={index} 
                      divider={index < deliveryHistory.length - 1}
                      sx={{ px: 0 }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: '#0025DD20', color: '#0025DD' }}>
                          <DeliveryDining />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {delivery.pickup.split(',')[0]} → {delivery.dropoff.split(',')[0]}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {delivery.time} • {delivery.amount} {delivery.paymentMethod ? `• ${delivery.paymentMethod}` : ''}
                            </Typography>
                            <Chip 
                              label={delivery.status}
                              size="small"
                              sx={{ 
                                mt: 0.5,
                                backgroundColor: delivery.status === 'Completed' ? '#0025DD20' : '#FFEC01',
                                color: delivery.status === 'Completed' ? '#0025DD' : '#000'
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* New Delivery Dialog */}
      <Dialog 
        open={showNewDeliveryDialog} 
        onClose={() => setShowNewDeliveryDialog(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
        scroll="paper"
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Start New Delivery</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Create and manage new delivery request
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: '#FFEC01', color: '#000', mr: 2 }}>
              MK
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="bold">Moses. K</Typography>
              <Typography variant="caption" color="text.secondary">Online</Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Customer Information</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Enter Customer Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    value={deliveryForm.customerName}
                    onChange={handleInputChange('customerName')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={deliveryForm.customerPhone}
                    onChange={handleInputChange('customerPhone')}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Package Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Package Details</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Describe whats being delivered
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Package Description"
                    value={deliveryForm.packageDescription}
                    onChange={handleInputChange('packageDescription')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Weight"
                    value={deliveryForm.weight}
                    onChange={handleInputChange('weight')}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>Delivery Type</Typography>
                <RadioGroup row value={deliveryForm.deliveryType} onChange={(e) => handleInputChange('deliveryType')(e)}>
                  <FormControlLabel value="Same Day Delivery" control={<Radio />} label="Same Day" />
                  <FormControlLabel value="Express" control={<Radio />} label="Express" />
                  <FormControlLabel value="Standard" control={<Radio />} label="Standard" />
                </RadioGroup>
              </Box>
            </Grid>

            {/* Locations */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Pickup and Dropoff Locations</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Specify Pickup and Destination Addresses
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Pickup Address"
                    value={deliveryForm.pickupAddress}
                    onChange={handleInputChange('pickupAddress')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dropoff Address"
                    value={deliveryForm.dropoffAddress}
                    onChange={handleInputChange('dropoffAddress')}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Recipient Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Receipient Information</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Enter Receipient Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Receipient Name"
                    value={deliveryForm.recipientName}
                    onChange={handleInputChange('recipientName')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={deliveryForm.recipientPhone}
                    onChange={handleInputChange('recipientPhone')}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Pricing */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Delivery Pricing</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Set delivery rate
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" fontWeight="bold" color="#0025DD">
                  {deliveryForm.estimatedPrice}
                </Typography>
                <Typography variant="body1">Estimated Price</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            sx={{ color: '#0025DD' }}
            onClick={() => setShowNewDeliveryDialog(false)}
          >
            Cancel
          </Button>
          <Button 
            sx={{ color: '#0025DD' }}
          >
            + Add Multiple Delivery
          </Button>
          <Button 
            variant="outlined"
            sx={{
              borderColor: '#0025DD',
              color: '#0025DD'
            }}
          >
            Receive Money
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={handleStartDelivery}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Delivery Dialog */}
      <Dialog 
        open={showCompleteDeliveryDialog} 
        onClose={() => setShowCompleteDeliveryDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Complete Delivery</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom color="#0025DD">
            Delivery ID: {activeDelivery?.id}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body2">Time Taken</Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatTime(deliveryTime)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Distance Travelled</Typography>
              <Typography variant="h6" fontWeight="bold">
                {deliveryDistance.toFixed(1)} KM
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Total Delivery Price</Typography>
              <Typography variant="h4" fontWeight="bold" color="#0025DD">
                {deliveryAmount} uGX
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Capture Recipient Code</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This code acts as proof of receipt of package delivered
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="contained"
              sx={{ backgroundColor: '#0025DD' }}
              onClick={generateRecipientCode}
            >
              Request Code
            </Button>
            <Button 
              variant="outlined"
              sx={{ borderColor: '#0025DD', color: '#0025DD' }}
              onClick={() => setShowChangeNumberDialog(true)}
            >
              Change Receipient Number
            </Button>
          </Box>

          {recipientCode && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" letterSpacing={3} fontWeight="bold" color="#0025DD">
                {recipientCode}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Code Captured at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} am
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Delivery Notes (Optional)"
            placeholder="Add any additional Notes about delivery"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowCompleteDeliveryDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={handleCaptureCode}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Delivery Dialog */}
      <Dialog 
        open={showReviewDeliveryDialog} 
        onClose={() => setShowReviewDeliveryDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Complete Delivery</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom color="#0025DD">
            Delivery ID: {activeDelivery?.id}
          </Typography>

          <Typography variant="h6" gutterBottom>Delivery Summary</Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Pickup Location</TableCell>
                  <TableCell>{activeDelivery?.pickup}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Dropoff Location</TableCell>
                  <TableCell>{activeDelivery?.dropoff}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Recipient Name</TableCell>
                  <TableCell>{activeDelivery?.recipient}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Recipient Contact</TableCell>
                  <TableCell>{activeDelivery?.recipientPhone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Package</TableCell>
                  <TableCell>{activeDelivery?.package}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                  <TableCell>{activeDelivery?.weight}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Delivery Price</TableCell>
                  <TableCell>{deliveryAmount} UGX</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Receipient Code</TableCell>
                  <TableCell>{recipientCode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Distance Travelled</TableCell>
                  <TableCell>{deliveryDistance.toFixed(1)} km</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Time Taken</TableCell>
                  <TableCell>{formatTime(deliveryTime)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Delivery Type</TableCell>
                  <TableCell colSpan={3}>{activeDelivery?.deliveryType}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            variant="outlined"
            sx={{
              borderColor: '#0025DD',
              color: '#0025DD'
            }}
            onClick={handleSaveDelivery}
          >
            Save
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={handleReceiveMoney}
          >
            Receive Money
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Success Dialog */}
      <Dialog 
        open={showSaveSuccessDialog} 
        onClose={() => setShowSaveSuccessDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Hello Moses!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your Delivery has been saved
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="#0025DD" gutterBottom>
            successfully, under Pending payments
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            To retrieve saved delivery and receive money,
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click payments and tap pending payments
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#0025DD',
                px: 4
              }}
              onClick={() => setShowSaveSuccessDialog(false)}
            >
              Okay
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Receive Money Dialog */}
      <Dialog 
        open={showPaymentDialog} 
        onClose={() => setShowPaymentDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Receive Money</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" gutterBottom>Enter Cash Amount</Typography>
            <Typography variant="h2" fontWeight="bold" color="#0025DD">
              {deliveryAmount}
            </Typography>
            <Typography variant="h6" color="#0025DD">UGX</Typography>
          </Box>

          <Typography variant="h5" gutterBottom>Select Payment Method</Typography>
          
          <Grid container spacing={2}>
            {[
              { label: 'CASH', emoji: '💵' },
              { label: 'MOMO', emoji: '📱' },
              { label: 'airtel', emoji: '📱' },
              { label: 'VISA', emoji: '💳' },
              { label: 'QR Code', emoji: '🔲' },
              { label: 'Split Payment', emoji: '➗' }
            ].map((method, index) => (
              <Grid item xs={4} key={index}>
                <Button
                  fullWidth
                  variant={paymentMethod === method.label.toLowerCase().replace(' ', '') ? "contained" : "outlined"}
                  sx={{
                    height: '80px',
                    flexDirection: 'column',
                    borderColor: '#0025DD',
                    color: paymentMethod === method.label.toLowerCase().replace(' ', '') ? 'white' : '#0025DD',
                    backgroundColor: paymentMethod === method.label.toLowerCase().replace(' ', '') ? '#0025DD' : 'transparent'
                  }}
                  onClick={() => setPaymentMethod(method.label.toLowerCase().replace(' ', ''))}
                >
                  <Typography variant="h4">{method.emoji}</Typography>
                  <Typography variant="caption">{method.label}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowPaymentDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={handleCompletePayment}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Success Dialog */}
      <Dialog 
        open={showPaymentSuccessDialog} 
        onClose={() => setShowPaymentSuccessDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Payment Successful
          </Typography>
          <Typography variant="h2" fontWeight="bold" color="#0025DD" gutterBottom>
            UGX 10,000
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Smartphone sx={{ mr: 1, color: '#0025DD' }} />
            <Typography variant="h6">MOMo</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            From MTN
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="#0025DD" gutterBottom>
            Payment received successfully
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#0025DD',
                px: 4,
                mb: 2
              }}
              onClick={handlePaymentSuccessClose}
            >
              Done
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#0025DD',
                color: '#0025DD',
                px: 4
              }}
              onClick={() => setShowNewDeliveryDialog(true)}
            >
              Start Delivery
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Change Number Dialog */}
      <Dialog 
        open={showChangeNumberDialog} 
        onClose={() => setShowChangeNumberDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Enter New Number</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Enter New Receiptent mobile number to receive code
          </Typography>
          <TextField
            fullWidth
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="078 787 000"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowChangeNumberDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={() => {
              showSnackbar('Number updated successfully!');
              setShowChangeNumberDialog(false);
            }}
          >
            Request Code
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Receipt Dialog */}
      <Dialog 
        open={showReceiptDialog} 
        onClose={() => setShowReceiptDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="#0025DD">
              Customer Receipt
            </Typography>
            <Typography variant="h6">Delivery</Typography>
          </Box>

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Rider: Moses K. (ID: R1022)
            </Typography>
          </Card>

          <Typography variant="h6" gutterBottom>DELIVERY DETAILS</Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography variant="body2">Pickup Location:</Typography>
              <Typography variant="body1" fontWeight="bold">Mukono stage</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Destination:</Typography>
              <Typography variant="body1" fontWeight="bold">Uganda House - Kampala</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Start Time & Date:</Typography>
              <Typography variant="body1" fontWeight="bold">09:32 AM 27 Nov 2025</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">End Time & Date:</Typography>
              <Typography variant="body1" fontWeight="bold">11:33 AM 27 Nov 2025</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Distance:</Typography>
              <Typography variant="body1" fontWeight="bold">15.7 km</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Duration:</Typography>
              <Typography variant="body1" fontWeight="bold">2h 02min</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Amount Paid:</Typography>
              <Typography variant="body1" fontWeight="bold" color="#0025DD">UGX 5,000</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Payment Method:</Typography>
              <Typography variant="body1" fontWeight="bold">MTN MoMo</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Receipt Code:</Typography>
              <Typography variant="body1" fontWeight="bold">NTR00XD40002</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Receipient Code:</Typography>
              <Typography variant="body1" fontWeight="bold">45890</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Delivery ID:</Typography>
              <Typography variant="body1" fontWeight="bold">T20330</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Delivery Type:</Typography>
              <Typography variant="body1" fontWeight="bold">Same Day Delivery</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Notes</Typography>
          <Typography variant="body1" gutterBottom>
            Thanks for Delivering with Moses
          </Typography>

          <Typography variant="h6" gutterBottom>SUPPORT</Typography>
          <Typography variant="body2">
            Rider Contact: +256 70xxxxxxxxx
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" startIcon={<Share />} fullWidth>
              Share
            </Button>
            <Button variant="outlined" startIcon={<Report />} fullWidth>
              Report Issue
            </Button>
            <Button variant="outlined" startIcon={<Download />} fullWidth>
              Download
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
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

export default DeliveryPage;