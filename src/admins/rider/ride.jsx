import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Switch,
  FormGroup,
  FormControlLabel as MuiFormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  DirectionsCar,
  LocationOn,
  Search,
  AttachMoney,
  PlayArrow,
  Stop,
  Close,
  Schedule,
  CheckCircle,
  AccountBalanceWallet,
  CreditCard,
  Smartphone,
  AccessTime,
  Speed,
  Map,
  Edit,
  Cancel,
  Add,
  SwapHoriz,
  Route,
  Payment,
  Report,
  Download,
  Share,
  QrCode,
  Receipt
} from '@mui/icons-material';

const RidePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [activeTrip, setActiveTrip] = useState(null);
  const [showNewTripDialog, setShowNewTripDialog] = useState(false);
  const [showEndTripDialog, setShowEndTripDialog] = useState(false);
  const [showReviewTripDialog, setShowReviewTripDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showSaveTripDialog, setShowSaveTripDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tripTime, setTripTime] = useState(0);
  const [tripDistance, setTripDistance] = useState(0);
  const [tripAmount, setTripAmount] = useState(4000);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [walletBalance, setWalletBalance] = useState(40000);
  
  // Trip form state
  const [tripForm, setTripForm] = useState({
    pickup: 'Mukono',
    destination: 'Kampala',
    amount: '2000'
  });

  // Trip history data
  const [tripHistory, setTripHistory] = useState([
    {
      id: 'Trip-007',
      route: 'Kireka - Banda',
      date: 'April 23, 2025 13:30 AM',
      distance: '5.3 km',
      duration: '4 min 21 sec',
      amount: '2,000 usx',
      paymentMethod: 'Airtel Money',
      manualOverride: 'YES',
      status: 'Completed'
    },
    {
      id: 'Trip-008',
      route: 'Mukono - Kampala',
      date: 'April 23, 2025 09:30 AM',
      distance: '15.7 km',
      duration: '18 min 01 sec',
      amount: '4,000 usx',
      paymentMethod: 'Cash',
      manualOverride: 'YES',
      status: 'Completed'
    }
  ]);

  // Trip history dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalTrips: 10,
    totalMoney: '10,000',
    completedTrips: 20,
    cancellationRate: '10.2%'
  });

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'CASH', icon: '💵' },
    { value: 'mtn', label: 'MTN MoMo', icon: '📱' },
    { value: 'airtel', label: 'Airtel Money', icon: '📱' },
    { value: 'visa', label: 'VISA', icon: '💳' },
    { value: 'qr', label: 'QR Code', icon: '🔲' },
    { value: 'split', label: 'Split Payment', icon: '➗' }
  ];

  // Real-time trip timer
  useEffect(() => {
    let interval;
    if (activeTrip) {
      interval = setInterval(() => {
        setTripTime(prev => prev + 1);
        // Simulate distance increase
        setTripDistance(prev => prev + 0.01);
      }, 1000);
    } else {
      setTripTime(0);
      setTripDistance(0);
    }
    return () => clearInterval(interval);
  }, [activeTrip]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field) => (event) => {
    setTripForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} min ${secs.toString().padStart(2, '0')} sec`;
  };

  const handleStartTrip = () => {
    const newTrip = {
      id: Date.now(),
      pickup: tripForm.pickup,
      destination: tripForm.destination,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      status: 'active'
    };

    setActiveTrip(newTrip);
    setShowNewTripDialog(false);
    setTripTime(0);
    setTripDistance(0);
    showSnackbar('Trip started successfully!');
  };

  const handleEndTrip = () => {
    setShowEndTripDialog(false);
    setShowReviewTripDialog(true);
  };

  const handleSaveTrip = () => {
    setShowReviewTripDialog(false);
    setShowSaveTripDialog(true);
    showSnackbar('Trip saved successfully under Pending transactions');
  };

  const handleReceiveMoney = () => {
    setShowReviewTripDialog(false);
    setShowPaymentDialog(true);
  };

  const handleCompletePayment = () => {
    setShowPaymentDialog(false);
    
    // Add to trip history
    const completedTrip = {
      id: `T${Date.now().toString().slice(-6)}`,
      route: `${tripForm.pickup} - ${tripForm.destination}`,
      date: new Date().toLocaleString(),
      distance: `${tripDistance.toFixed(1)} km`,
      duration: formatTime(tripTime),
      amount: `${tripAmount.toLocaleString()} usx`,
      paymentMethod: paymentMethod === 'cash' ? 'Cash' : 
                   paymentMethod === 'mtn' ? 'MTN MoMo' :
                   paymentMethod === 'airtel' ? 'Airtel Money' : 'Cash',
      manualOverride: 'YES',
      status: 'Completed'
    };

    setTripHistory(prev => [completedTrip, ...prev]);
    
    // Update wallet balance
    setWalletBalance(prev => prev + tripAmount);
    
    // Reset active trip
    setActiveTrip(null);
    
    // Show receipt
    setShowReceiptDialog(true);
    
    showSnackbar('Payment received successfully!');
  };

  const handleCancelTrip = () => {
    setActiveTrip(null);
    setShowNewTripDialog(false);
    showSnackbar('Trip cancelled');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

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
            ENFUNA
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<AccountBalanceWallet />}
              label={`${walletBalance.toLocaleString()} usx`}
              sx={{ 
                backgroundColor: '#FFEC01', 
                color: '#000',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Trip Management */}
          <Grid item xs={12} md={8}>
            {/* Quick Actions */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ backgroundColor: '#0025DD' }}
                      onClick={() => setShowNewTripDialog(true)}
                    >
                      Start Trip
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                    >
                      Start Delivery
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                      onClick={() => setShowPaymentDialog(true)}
                    >
                      Receive Money
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Wallet Balance */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Available Balance
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#0025DD">
                  {walletBalance.toLocaleString()} usx
                </Typography>
              </CardContent>
            </Card>

            {!activeTrip ? (
              // Ready to Ride Section
              <Card sx={{ mb: 3, border: `2px dashed #0025DD` }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <DirectionsCar sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="#0025DD">
                    Ready to Ride?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Start A New Trip And Start Earning
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
                    onClick={() => setShowNewTripDialog(true)}
                  >
                    START NEW TRIP →
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Active Trip View
              <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" color="#0025DD">
                      Active Trip
                    </Typography>
                    <Chip 
                      label="In Progress" 
                      sx={{ 
                        backgroundColor: '#FFEC01', 
                        color: '#000',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          FROM:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {tripForm.pickup.toUpperCase()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          TO:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {tripForm.destination.toUpperCase()}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <AccessTime sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          {formatTime(tripTime)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Speed sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          {tripDistance.toFixed(1)} km
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Distance
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#0025DD'
                      }}
                      onClick={() => setShowEndTripDialog(true)}
                    >
                      End Trip
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: '#0025DD',
                        color: '#0025DD'
                      }}
                      onClick={() => setShowNewTripDialog(true)}
                    >
                      Edit Trip
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Trip History */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Trip History
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  View completed trip summary
                </Typography>
                
                <List>
                  {tripHistory.map((trip, index) => (
                    <ListItem 
                      key={index} 
                      divider={index < tripHistory.length - 1}
                      sx={{ px: 0 }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: '#0025DD20', color: '#0025DD' }}>
                          <DirectionsCar />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body1" fontWeight="500">
                                Route: {trip.route}
                              </Typography>
                              <Typography variant="body1" fontWeight="bold" color="#0025DD">
                                {trip.amount}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Payment: {trip.paymentMethod} • Manual Override: {trip.manualOverride}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                              <Typography variant="caption">
                                Duration: {trip.duration}
                              </Typography>
                              <Typography variant="caption">
                                Distance: {trip.distance}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Trip History Dashboard */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Trip History Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  View Real-time trip analytics, all completed trips and their history details
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD">
                        {dashboardStats.totalTrips}
                      </Typography>
                      <Typography variant="caption">
                        Total Trips
                      </Typography>
                      <Typography variant="caption" color="success.main" display="block">
                        +92 from yesterday
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD">
                        {dashboardStats.totalMoney}
                      </Typography>
                      <Typography variant="caption">
                        Total Money
                      </Typography>
                      <Typography variant="caption" color="success.main" display="block">
                        +82% top from yesterday
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD">
                        {dashboardStats.completedTrips}
                      </Typography>
                      <Typography variant="caption">
                        Completed Trips
                      </Typography>
                      <Typography variant="caption" color="success.main" display="block">
                        +40% top from yesterday
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD">
                        {dashboardStats.cancellationRate}
                      </Typography>
                      <Typography variant="caption">
                        Cancellation Rate
                      </Typography>
                      <Typography variant="caption" color="error.main" display="block">
                        -3% less from yesterday
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Filters */}
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search Trip ID, Phone, Customer..."
                    sx={{ mb: 2 }}
                  />
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Select fullWidth size="small" defaultValue="all" sx={{ mb: 1 }}>
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={6}>
                      <Select fullWidth size="small" defaultValue="normal" sx={{ mb: 1 }}>
                        <MenuItem value="normal">Normal Trip</MenuItem>
                        <MenuItem value="delivery">Delivery</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={6}>
                      <Select fullWidth size="small" defaultValue="all" sx={{ mb: 1 }}>
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="momo">MoMo</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={6}>
                      <Select fullWidth size="small" defaultValue="all" sx={{ mb: 1 }}>
                        <MenuItem value="all">All Routes</MenuItem>
                        <MenuItem value="mukono-kampala">Mukono - Kampala</MenuItem>
                        <MenuItem value="kireka-banda">Kireka - Banda</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* New Trip Dialog */}
      <Dialog 
        open={showNewTripDialog} 
        onClose={() => setShowNewTripDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">New Trip</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Trip Setup Form
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Configure your trip details and start your journey
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Enter Pickup Location"
                value={tripForm.pickup}
                onChange={handleInputChange('pickup')}
              />
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6">TO</Typography>
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Enter Destination"
                value={tripForm.destination}
                onChange={handleInputChange('destination')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enter Amount"
                value={tripForm.amount}
                onChange={handleInputChange('amount')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">usx</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button fullWidth variant="outlined">
                Change Amount
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button 
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#0025DD'
              }}
              onClick={handleStartTrip}
            >
              START TRIP
            </Button>
            <Button 
              variant="outlined"
              fullWidth
              sx={{
                borderColor: '#0025DD',
                color: '#0025DD'
              }}
              onClick={handleSaveTrip}
            >
              SAVE TRIP
            </Button>
          </Box>
          <Button 
            fullWidth
            variant="text"
            sx={{ color: '#0025DD' }}
            onClick={() => {
              setTripForm({ pickup: 'Mukono', destination: 'Kampala', amount: '2000' });
            }}
          >
            CLEAR FORM
          </Button>
          <Button 
            fullWidth
            variant="text"
            sx={{ color: 'error.main' }}
            onClick={handleCancelTrip}
          >
            CANCEL TRIP
          </Button>
        </DialogActions>
      </Dialog>

      {/* End Trip Dialog */}
      <Dialog 
        open={showEndTripDialog} 
        onClose={() => setShowEndTripDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">End Trip</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to end this trip?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowEndTripDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Continue Trip
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={handleEndTrip}
          >
            End Trip
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Trip Dialog */}
      <Dialog 
        open={showReviewTripDialog} 
        onClose={() => setShowReviewTripDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Review and Complete Trip</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Trip Ended
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Review and finalize trip details before payment
          </Typography>

          <Card sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>Trip Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">From:</Typography>
                <Typography variant="body1" fontWeight="bold">{tripForm.pickup}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">To:</Typography>
                <Typography variant="body1" fontWeight="bold">{tripForm.destination}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Duration:</Typography>
                <Typography variant="body1" fontWeight="bold">{formatTime(tripTime)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Distance:</Typography>
                <Typography variant="body1" fontWeight="bold">{tripDistance.toFixed(1)} km</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">Total Amount</Typography>
              <Typography variant="h3" fontWeight="bold" color="#0025DD">
                {tripAmount} USX
              </Typography>
              <Button startIcon={<Edit />} sx={{ mt: 1 }}>
                Manual Amount Override
              </Button>
            </Box>
          </Card>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#0025DD',
              color: '#0025DD'
            }}
            onClick={handleSaveTrip}
          >
            Save Trip
          </Button>
          <Button 
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={handleReceiveMoney}
          >
            Receive Money
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Trip Success Dialog */}
      <Dialog 
        open={showSaveTripDialog} 
        onClose={() => setShowSaveTripDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Review and Complete Trip</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Trip Ended</Typography>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Help Moses!
          </Typography>
          <Typography variant="body2" gutterBottom>
            Your trip has been saved successfully, under Pending transactions
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            To retrieve saved trip and receive money, Click transactions and tap pending transactions
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={() => setShowSaveTripDialog(false)}
          >
            Okay
          </Button>
        </DialogActions>
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
          <TextField
            fullWidth
            label="Enter Cash Amount"
            value={tripAmount}
            onChange={(e) => setTripAmount(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            Select Payment Method
          </Typography>

          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={4} key={method.value}>
                <Button
                  fullWidth
                  variant={paymentMethod === method.value ? "contained" : "outlined"}
                  sx={{
                    height: '80px',
                    flexDirection: 'column',
                    borderColor: '#0025DD',
                    color: paymentMethod === method.value ? 'white' : '#0025DD',
                    backgroundColor: paymentMethod === method.value ? '#0025DD' : 'transparent'
                  }}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <Typography variant="h4">{method.icon}</Typography>
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
            <Typography variant="h6">Normal Trip</Typography>
          </Box>

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Rider: Moses K.(ID: R1022)
            </Typography>
          </Card>

          <Typography variant="h6" gutterBottom>TRIP DETAILS</Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography variant="body2">Pickup Location:</Typography>
              <Typography variant="body1" fontWeight="bold">Mukono stage</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Destination:</Typography>
              <Typography variant="body1" fontWeight="bold">Uganda House – Kampala</Typography>
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
          </Grid>

          <Divider sx={{ my: 2 }} />

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

export default RidePage;