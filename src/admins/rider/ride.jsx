import React, { useState, useEffect } from 'react';
import './ride.css';

// Import MUI components
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
  IconButton,
  Snackbar,
  Alert,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  MenuItem,
  Select,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Grow,
  Slide,
  Zoom,
  Tooltip,
  Badge,
  CircularProgress,
  alpha,
  InputAdornment
} from '@mui/material';

// Import MUI icons
import {
  DirectionsCar,
  LocationOn,
  AttachMoney,
  PlayArrow,
  Stop,
  Close,
  CheckCircle,
  AccountBalanceWallet,
  CreditCard,
  Smartphone,
  AccessTime,
  Speed,
  Map,
  Edit,
  Cancel,
  Route,
  Payment,
  Report,
  Refresh,
  TrendingUp,
  Notifications,
  History,
  LocalAtm,
  Receipt,
  Search,
  ArrowBack,
  ArrowForward,
  Timer,
  PriceCheck,
  Cancel as CancelIcon,
  Check as CheckIcon,
  MoreVert,
  Menu,
  ExpandMore,
  BatteryChargingFull,
  Wifi,
  SignalCellularAlt
} from '@mui/icons-material';

// Import images (you'll need to add these to your assets folder)
// Make sure these files exist in your public/assets or src/assets folder
const mtnLogo = '/assets/mtn.jpg';
const airtelLogo = '/assets/airtel.jpg';
const visaLogo = '/assets/visa.jpg';

const RidePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Trip flow states
  const [currentStep, setCurrentStep] = useState(0);
  const [showNewTripDialog, setShowNewTripDialog] = useState(false);
  const [showEndTripDialog, setShowEndTripDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [tripTime, setTripTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [notificationCount, setNotificationCount] = useState(3);

  // Trip form states
  const [tripForm, setTripForm] = useState({
    pickup: '',
    destination: '',
    pickupManual: '',
    destinationManual: '',
    selectedPickup: null,
    selectedDestination: null
  });

  // Trip cancellation
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationReasons, setShowCancellationReasons] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showTripHistory, setShowTripHistory] = useState(false);

  // Shift stats
  const [shiftActive, setShiftActive] = useState(true);
  const [shiftDuration, setShiftDuration] = useState(2040);
  const [shiftStats, setShiftStats] = useState({
    totalTrips: 8,
    momoEarnings: 52000,
    cashEarnings: 44000,
    totalEarnings: 96000,
    netEarnings: 81000,
    efficiencyScore: 87
  });

  const [tripHistory, setTripHistory] = useState([
    {
      id: 'TRIP001',
      pickup: 'Kollo',
      destination: 'Ntinda',
      fare: 15000,
      paymentMethod: 'mtn',
      status: 'completed',
      duration: '25 min',
      distance: '8.2 km',
      date: '2024-01-15',
      time: '14:30',
      customerName: 'John M.',
      customerPhone: '0781234567',
      rating: 5
    },
    {
      id: 'TRIP002',
      pickup: 'Makerere',
      destination: 'Garden City',
      fare: 12000,
      paymentMethod: 'cash',
      status: 'completed',
      duration: '20 min',
      distance: '6.5 km',
      date: '2024-01-15',
      time: '11:15',
      customerName: 'Sarah K.',
      customerPhone: '0757654321',
      rating: 4
    },
    {
      id: 'TRIP003',
      pickup: 'Entebbe',
      destination: 'Airport',
      fare: 45000,
      paymentMethod: 'airtel',
      status: 'completed',
      duration: '45 min',
      distance: '35 km',
      date: '2024-01-14',
      time: '09:00',
      customerName: 'David L.',
      customerPhone: '0709876543',
      rating: 5
    }
  ]);

  const popularDestinations = [
    { id: 1, name: 'Kollo', area: 'Kampala', type: 'pickup', popularity: 95 },
    { id: 2, name: 'Ntinda', area: 'Kampala', type: 'destination', popularity: 88 },
    { id: 3, name: 'Garden City Mall', area: 'Kampala', type: 'destination', popularity: 92 },
    { id: 4, name: 'Acacia Mall', area: 'Kisementi', type: 'destination', popularity: 85 },
    { id: 5, name: 'Makerere University', area: 'Makerere', type: 'pickup', popularity: 90 },
    { id: 6, name: 'Mulago Hospital', area: 'Mulago', type: 'destination', popularity: 82 },
    { id: 7, name: 'Entebbe Airport', area: 'Entebbe', type: 'destination', popularity: 78 },
    { id: 8, name: 'Nakasero Market', area: 'Nakasero', type: 'pickup', popularity: 80 }
  ];

  const cancellationReasons = [
    'Customer not at location',
    'Changed mind',
    'Payment issue',
    'Vehicle problem',
    'Emergency',
    'Wrong address',
    'Other'
  ];

  const tripSteps = [
    'Set Pickup',
    'Set Destination',
    'Active Trip',
    'Payment',
    'Summary'
  ];

  // Real-time timer
  useEffect(() => {
    let interval;
    if (activeTrip) {
      interval = setInterval(() => {
        setTripTime(prev => prev + 1);
      }, 1000);
    } else {
      setTripTime(0);
    }
    return () => clearInterval(interval);
  }, [activeTrip]);

  // Shift timer
  useEffect(() => {
    let interval;
    if (shiftActive) {
      interval = setInterval(() => {
        setShiftDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [shiftActive]);

  // Calculate earnings
  useEffect(() => {
    if (activeTrip) {
      const baseFare = 15000;
      const timeBonus = Math.floor(tripTime / 60) * 500;
      const distanceBonus = calculateDistance() * 1000;
      setEarnings(baseFare + timeBonus + distanceBonus);
    }
  }, [tripTime, activeTrip]);

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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatShiftTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDistance = () => {
    return (tripTime / 60) * 0.8;
  };

  // Trip flow functions
  const handleStartTripFlow = () => {
    setCurrentStep(0);
    setShowNewTripDialog(true);
  };

  const handleNextStep = () => {
    if (currentStep < tripSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSetPickup = () => {
    const pickup = tripForm.pickupManual || tripForm.selectedPickup?.name;
    if (!pickup) {
      showSnackbar('Please select or enter pickup location', 'error');
      return;
    }
    setTripForm(prev => ({ ...prev, pickup }));
    handleNextStep();
  };

  const handleSetDestination = () => {
    const destination = tripForm.destinationManual || tripForm.selectedDestination?.name;
    if (!destination) {
      showSnackbar('Please select or enter destination', 'error');
      return;
    }
    setTripForm(prev => ({ ...prev, destination }));
    
    // Start the trip
    setLoading(true);
    setTimeout(() => {
      const newTrip = {
        id: `TRIP${Date.now().toString().slice(-6)}`,
        pickup: tripForm.pickupManual || tripForm.selectedPickup?.name,
        destination: tripForm.destinationManual || tripForm.selectedDestination?.name,
        fare: 15000,
        paymentMethod: 'pending',
        status: 'active',
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        startTimestamp: new Date()
      };
      
      setActiveTrip(newTrip);
      setShowNewTripDialog(false);
      setCurrentStep(2); // Move to active trip step
      setLoading(false);
      showSnackbar('🚀 Trip started! Ride safely.', 'success');
    }, 800);
  };

  const handleEndTrip = () => {
    setLoading(true);
    setTimeout(() => {
      setShowEndTripDialog(false);
      setShowPaymentDialog(true);
      setCurrentStep(3);
      setLoading(false);
    }, 1000);
  };

  const handleProcessPayment = () => {
    setLoading(true);
    setTimeout(() => {
      const completedTrip = {
        ...activeTrip,
        id: activeTrip.id || `TRIP${Date.now().toString().slice(-6)}`,
        status: 'completed',
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: formatTime(tripTime),
        distance: `${calculateDistance().toFixed(1)} km`,
        fare: earnings,
        paymentMethod: paymentMethod,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Update stats
      const paymentKey = paymentMethod === 'mtn' || paymentMethod === 'airtel' ? 'momoEarnings' : 'cashEarnings';
      setShiftStats(prev => ({
        ...prev,
        totalTrips: prev.totalTrips + 1,
        [paymentKey]: prev[paymentKey] + earnings,
        totalEarnings: prev.totalEarnings + earnings,
        netEarnings: prev.netEarnings + earnings
      }));

      // Add to history
      setTripHistory(prev => [completedTrip, ...prev]);
      
      setShowPaymentDialog(false);
      setShowSummaryDialog(true);
      setCurrentStep(4);
      setLoading(false);
      showSnackbar(`💰 Payment received! UGX ${earnings.toLocaleString()}`, 'success');
    }, 1500);
  };

  const handleCompleteTrip = () => {
    setActiveTrip(null);
    setShowSummaryDialog(false);
    setCurrentStep(0);
    showSnackbar('✅ Trip completed successfully!', 'success');
  };

  const handleCancelTrip = () => {
    setLoading(true);
    setTimeout(() => {
      if (cancellationReason) {
        const cancelledTrip = {
          ...activeTrip,
          id: activeTrip.id || `TRIP${Date.now().toString().slice(-6)}`,
          status: 'cancelled',
          cancellationReason: cancellationReason,
          endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setTripHistory(prev => [cancelledTrip, ...prev]);
        setActiveTrip(null);
        setShowCancellationReasons(false);
        setShowCancelDialog(false);
        setCancellationReason('');
        setCurrentStep(0);
        setLoading(false);
        showSnackbar('Trip cancelled', 'info');
      }
    }, 1000);
  };

  const handleChangeFare = () => {
    const newFare = prompt('Enter new fare amount:', earnings);
    if (newFare && !isNaN(newFare)) {
      setEarnings(parseInt(newFare));
      showSnackbar('Fare updated successfully', 'success');
    }
  };

  const handleChangeDestination = () => {
    const newDestination = prompt('Enter new destination:', activeTrip?.destination);
    if (newDestination) {
      setActiveTrip(prev => ({ ...prev, destination: newDestination }));
      showSnackbar('Destination updated', 'success');
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'mtn':
        return <img src={mtnLogo} alt="MTN" style={{ width: 40, height: 40, objectFit: 'contain' }} />;
      case 'airtel':
        return <img src={airtelLogo} alt="Airtel" style={{ width: 40, height: 40, objectFit: 'contain' }} />;
      case 'visa':
        return <img src={visaLogo} alt="Visa" style={{ width: 40, height: 40, objectFit: 'contain' }} />;
      case 'cash':
        return <LocalAtm sx={{ fontSize: 40, color: '#4CAF50' }} />;
      default:
        return <Smartphone sx={{ fontSize: 40, color: '#0025DD' }} />;
    }
  };

  const filteredTripHistory = tripHistory.filter(trip => 
    trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.customerPhone?.includes(searchQuery) ||
    trip.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Set Pickup
        return (
          <Box className="fade-in">
            <Typography variant="h6" gutterBottom fontWeight="600">
              Select Pickup Location
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Or enter pickup location manually"
              value={tripForm.pickupManual}
              onChange={handleInputChange('pickupManual')}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Popular Pickup Locations
            </Typography>
            
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {popularDestinations
                .filter(dest => dest.type === 'pickup')
                .map((dest) => (
                  <Grid item xs={6} key={dest.id}>
                    <Card
                      className={`payment-method-card ${tripForm.selectedPickup?.id === dest.id ? 'selected' : ''}`}
                      onClick={() => setTripForm(prev => ({ ...prev, selectedPickup: dest, pickupManual: '' }))}
                      sx={{ cursor: 'pointer' }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography fontWeight="600">{dest.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dest.area}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        );

      case 1: // Set Destination
        return (
          <Box className="fade-in">
            <Typography variant="h6" gutterBottom fontWeight="600">
              Select Destination
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Or enter destination manually"
              value={tripForm.destinationManual}
              onChange={handleInputChange('destinationManual')}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Popular Destinations
            </Typography>
            
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {popularDestinations
                .filter(dest => dest.type === 'destination')
                .map((dest) => (
                  <Grid item xs={6} key={dest.id}>
                    <Card
                      className={`payment-method-card ${tripForm.selectedDestination?.id === dest.id ? 'selected' : ''}`}
                      onClick={() => setTripForm(prev => ({ ...prev, selectedDestination: dest, destinationManual: '' }))}
                      sx={{ cursor: 'pointer' }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography fontWeight="600">{dest.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dest.area} • {dest.popularity}% popular
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        );

      case 3: // Payment
        return (
          <Box className="fade-in">
            <Typography variant="h6" gutterBottom fontWeight="600">
              Select Payment Method
            </Typography>
            
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Amount due: <Typography component="span" fontWeight="800" color="#0025DD">
                UGX {earnings.toLocaleString()}
              </Typography>
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 3 }}>
              {['mtn', 'airtel', 'visa', 'cash'].map((method) => (
                <Grid item xs={6} key={method}>
                  <Box
                    className={`payment-icon ${paymentMethod === method ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method)}
                    sx={{ 
                      border: paymentMethod === method ? '3px solid #0025DD' : '1px solid #e0e0e0',
                      backgroundColor: paymentMethod === method ? 'rgba(0, 37, 221, 0.05)' : 'white'
                    }}
                  >
                    {getPaymentMethodIcon(method)}
                  </Box>
                  <Typography variant="caption" align="center" display="block" sx={{ mt: 1 }}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 4: // Summary
        return (
          <Box className="fade-in">
            <Typography variant="h6" gutterBottom fontWeight="600">
              Trip Summary
            </Typography>
            
            <Paper className="trip-summary-card" sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Trip ID</Typography>
                  <Typography fontWeight="600">{activeTrip?.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                  <Typography fontWeight="600">{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Duration</Typography>
                  <Typography fontWeight="600">{formatTime(tripTime)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text-secondary">Distance</Typography>
                  <Typography fontWeight="600">{calculateDistance().toFixed(1)} km</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Amount Charged</Typography>
                  <Typography variant="h5" fontWeight="800" color="#0025DD">
                    UGX {earnings.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Payment Status</Typography>
                  <Chip 
                    label="Paid" 
                    color="success" 
                    size="small" 
                    icon={<CheckCircle />}
                    sx={{ fontWeight: '600' }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="ride-container">
      {/* Header */}
      <AppBar position="sticky" className="app-header fade-in-up">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'white', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <DirectionsCar sx={{ color: '#0025DD', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: '800', color: 'white' }}>
                ENFUNA DRIVER
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<Speed />}
              label={`UBB 472Z • ${formatShiftTime(shiftDuration)}`}
              className={activeTrip ? 'glow' : ''}
              sx={{ 
                backgroundColor: '#FFEC01', 
                color: '#000',
                fontWeight: '700'
              }}
            />
            
            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'white' }}>
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {!activeTrip && (
              <Button
                variant="contained"
                className="start-trip-btn pulse"
                onClick={handleStartTripFlow}
                startIcon={<PlayArrow />}
                sx={{
                  background: 'linear-gradient(135deg, #FFEC01 0%, #FFD700 100%)',
                  color: '#000',
                  fontWeight: '800',
                  px: 3,
                  py: 1,
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(255, 236, 1, 0.3)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(255, 236, 1, 0.4)'
                  }
                }}
              >
                START TRIP
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Quick Stats */}
      <Slide direction="down" in timeout={800}>
        <Paper sx={{ 
          mx: isMobile ? 2 : 3, 
          mt: 2, 
          mb: 3, 
          p: 2, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 2px 16px rgba(0, 37, 221, 0.08)'
        }}>
          <Grid container spacing={2}>
            {[
              { label: 'Earnings', value: `UGX ${shiftStats.totalEarnings.toLocaleString()}`, icon: <TrendingUp />, color: '#0025DD' },
              { label: 'Trips', value: shiftStats.totalTrips, icon: <DirectionsCar />, color: '#4CAF50' },
              { label: 'Shift Time', value: formatShiftTime(shiftDuration), icon: <AccessTime />, color: '#9C27B0' },
              { label: 'Efficiency', value: `${shiftStats.efficiencyScore}%`, icon: <Speed />, color: '#FF9800' }
            ].map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}10`, color: stat.color }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                    <Typography variant="body1" fontWeight="700" color={stat.color}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Slide>

      {/* Main Content */}
      <Box sx={{ px: isMobile ? 2 : 3 }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* Active Trip Card */}
            {activeTrip ? (
              <Grow in timeout={600}>
                <Card className="active-trip-card">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(tripTime % 100)}%` }} />
                  </div>

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box>
                        <Typography variant="h4" fontWeight="800" color="#0025DD" gutterBottom>
                          Active Trip
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ color: '#4CAF50', fontSize: 20 }} />
                          <Typography variant="body1" color="text.secondary">
                            {activeTrip.pickup} → {activeTrip.destination}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label="LIVE" 
                        className="pulse"
                        sx={{ 
                          backgroundColor: '#FF3B30',
                          color: 'white',
                          fontWeight: '800'
                        }}
                      />
                    </Box>

                    {/* Real-time Stats */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      {[
                        { icon: <AccessTime />, label: 'Duration', value: formatTime(tripTime), color: '#0025DD' },
                        { icon: <Speed />, label: 'Distance', value: `${calculateDistance().toFixed(1)} km`, color: '#4CAF50' },
                        { icon: <AccountBalanceWallet />, label: 'Fare', value: `UGX ${earnings.toLocaleString()}`, color: '#9C27B0' },
                        { icon: <BatteryChargingFull />, label: 'Battery', value: '78%', color: '#FF9800' }
                      ].map((stat, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                          <Zoom in timeout={800 + index * 200}>
                            <Paper sx={{ 
                              p: 2, 
                              textAlign: 'center', 
                              borderRadius: 2,
                              border: `1px solid ${alpha(stat.color, 0.1)}`
                            }}>
                              <Box sx={{ color: stat.color, mb: 1 }}>
                                {stat.icon}
                              </Box>
                              <Typography variant="h5" fontWeight="800" color={stat.color}>
                                {stat.value}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {stat.label}
                              </Typography>
                            </Paper>
                          </Zoom>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Trip Actions */}
                    <Box className="fade-in-up">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="contained"
                            fullWidth
                            className="primary-btn"
                            startIcon={<Map />}
                            sx={{
                              background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
                              fontWeight: '600',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(0, 37, 221, 0.3)'
                              }
                            }}
                          >
                            Navigation
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="contained"
                            fullWidth
                            className="success-btn"
                            startIcon={<PriceCheck />}
                            onClick={handleChangeFare}
                            sx={{
                              background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                              fontWeight: '600',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
                              }
                            }}
                          >
                            Change Fare
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="outlined"
                            fullWidth
                            className="danger-btn"
                            startIcon={<Edit />}
                            onClick={handleChangeDestination}
                            sx={{
                              borderColor: '#FF3B30',
                              color: '#FF3B30',
                              fontWeight: '600',
                              '&:hover': {
                                borderColor: '#D32F2F',
                                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Change Dest.
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="outlined"
                            fullWidth
                            className="danger-btn"
                            startIcon={<Cancel />}
                            onClick={() => setShowCancelDialog(true)}
                            sx={{
                              borderColor: '#FF3B30',
                              color: '#FF3B30',
                              fontWeight: '600',
                              '&:hover': {
                                borderColor: '#D32F2F',
                                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Cancel Trip
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            className="success-btn"
                            startIcon={<CheckCircle />}
                            onClick={() => setShowEndTripDialog(true)}
                            sx={{ 
                              mt: 2,
                              background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                              fontWeight: '600',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
                              }
                            }}
                          >
                            END TRIP
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ) : (
              /* Start Trip Card */
              <Fade in timeout={800}>
                <Card 
                  className="no-trip-card" 
                  onClick={handleStartTripFlow}
                  sx={{
                    border: '2px dashed rgba(0, 37, 221, 0.3)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#0025DD',
                      boxShadow: '0 12px 40px rgba(0, 37, 221, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(0, 37, 221, 0.2) 0%, rgba(0, 31, 184, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3
                    }}>
                      <PlayArrow sx={{ fontSize: 40, color: '#0025DD' }} />
                    </Box>
                    
                    <Typography variant="h4" fontWeight="800" gutterBottom color="#0025DD">
                      Start Earning Now
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                      Begin a new trip and maximize your earnings
                    </Typography>
                    
                    <Button
                      variant="contained"
                      size="large"
                      className="start-trip-btn pulse"
                      startIcon={<PlayArrow />}
                      sx={{
                        background: 'linear-gradient(135deg, #FFEC01 0%, #FFD700 100%)',
                        color: '#000',
                        fontWeight: '800',
                        px: 5,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0, 37, 221, 0.3)'
                      }}
                    >
                      START NEW TRIP
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            )}

            {/* Trip History */}
            <Fade in timeout={1000}>
              <Card className="animated-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight="800" color="#0025DD">
                      Recent Trips
                    </Typography>
                    <Button 
                      endIcon={<History />}
                      sx={{ color: '#0025DD', fontWeight: '600' }}
                      onClick={() => setShowTripHistory(!showTripHistory)}
                    >
                      {showTripHistory ? 'Hide History' : 'View All'}
                    </Button>
                  </Box>
                  
                  {/* Search Bar */}
                  <TextField
                    fullWidth
                    placeholder="Search by trip ID, customer, phone, or route..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <List>
                    {(showTripHistory ? filteredTripHistory : filteredTripHistory.slice(0, 3)).map((trip, index) => (
                      <Slide direction="right" in timeout={600 + index * 100} key={trip.id}>
                        <ListItem className="trip-history-item">
                          <ListItemIcon>
                            <Avatar sx={{ 
                              bgcolor: trip.status === 'completed' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 59, 48, 0.2)', 
                              color: trip.status === 'completed' ? '#4CAF50' : '#FF3B30' 
                            }}>
                              {trip.status === 'completed' ? <CheckCircle /> : <CancelIcon />}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <LocationOn sx={{ color: '#4CAF50', fontSize: 16 }} />
                                    <Typography variant="body1" fontWeight="600">
                                      {trip.pickup} → {trip.destination}
                                    </Typography>
                                  </Box>
                                  <Typography variant="caption" color="text.secondary">
                                    {trip.date} • {trip.time} • {trip.duration} • {trip.distance}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    {trip.customerName} • {trip.customerPhone}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right', ml: 2 }}>
                                  <Typography variant="body1" fontWeight="800" color="#0025DD">
                                    UGX {trip.fare.toLocaleString()}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Chip 
                                      label={trip.paymentMethod.toUpperCase()}
                                      size="small"
                                      sx={{ 
                                        backgroundColor: 'rgba(0, 37, 221, 0.2)',
                                        color: '#0025DD',
                                        fontWeight: '600'
                                      }}
                                    />
                                    <Chip 
                                      label={trip.status}
                                      size="small"
                                      color={trip.status === 'completed' ? 'success' : 'error'}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      </Slide>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Earnings Card */}
            <Grow in timeout={800}>
              <Card className="animated-card stats-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight="800" color="#0025DD">
                      Earnings Dashboard
                    </Typography>
                    <TrendingUp sx={{ color: '#0025DD' }} />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Daily Goal</Typography>
                      <Typography variant="body2" fontWeight="600">UGX 100,000</Typography>
                    </Box>
                    <div className="earnings-progress">
                      <div 
                        className="earnings-progress-fill"
                        style={{ width: `${(shiftStats.totalEarnings / 100000) * 100}%` }}
                      />
                    </div>
                    <Typography variant="caption" color="text.secondary">
                      {((shiftStats.totalEarnings / 100000) * 100).toFixed(1)}% complete
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom color="text.secondary">
                      BREAKDOWN
                    </Typography>
                    {[
                      { label: 'MoMo Earnings', value: shiftStats.momoEarnings, color: '#0025DD' },
                      { label: 'Cash Earnings', value: shiftStats.cashEarnings, color: '#4CAF50' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1.5,
                        borderBottom: index < 1 ? '1px solid #e0e0e0' : 'none'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: item.color 
                          }} />
                          <Typography variant="body2">{item.label}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="600">
                          UGX {item.value.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Totals */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 37, 221, 0.08)'
                    }}>
                      <Typography variant="h6">Total Earnings</Typography>
                      <Typography variant="h5" fontWeight="800" color="#0025DD">
                        UGX {shiftStats.totalEarnings.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(76, 175, 80, 0.08)'
                    }}>
                      <Typography variant="h6">Net Earnings</Typography>
                      <Typography variant="h5" fontWeight="800" color="#4CAF50">
                        UGX {shiftStats.netEarnings.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderColor: '#0025DD',
                          color: '#0025DD',
                          fontWeight: '600'
                        }}
                        startIcon={<Receipt />}
                      >
                        Report
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        className="primary-btn"
                        startIcon={<Stop />}
                        onClick={() => {
                          setShiftActive(false);
                          showSnackbar('Shift ended', 'info');
                        }}
                        sx={{
                          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
                          fontWeight: '600'
                        }}
                      >
                        End Shift
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>

            {/* Quick Stats */}
            <Fade in timeout={1000}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Card className="animated-card">
                    <CardContent>
                      <Typography variant="h6" fontWeight="800" gutterBottom color="#0025DD">
                        Vehicle Status
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <DirectionsCar sx={{ 
                          color: '#0025DD', 
                          fontSize: 48
                        }} />
                        <Box>
                          <Typography variant="h6" fontWeight="800">
                            UBB 472Z
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Yamaha • 150cc • 2022
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Wifi sx={{ color: '#4CAF50', mb: 0.5 }} />
                            <Typography variant="caption">Connected</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <SignalCellularAlt sx={{ color: '#FF9800', mb: 0.5 }} />
                            <Typography variant="caption">Good</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <BatteryChargingFull sx={{ color: '#0025DD', mb: 0.5 }} />
                            <Typography variant="caption">78%</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card className="animated-card">
                    <CardContent>
                      <Typography variant="h6" fontWeight="800" gutterBottom color="#0025DD">
                        Quick Actions
                      </Typography>
                      <Grid container spacing={1}>
                        {[
                          { icon: <Map />, label: 'Navigation', color: '#0025DD' },
                          { icon: <Payment />, label: 'Payment', color: '#4CAF50' },
                          { icon: <Report />, label: 'Report', color: '#FF9800' },
                          { icon: <History />, label: 'History', color: '#9C27B0' }
                        ].map((action, index) => (
                          <Grid item xs={6} key={index}>
                            <Button
                              fullWidth
                              className="quick-action-btn"
                              sx={{ color: action.color }}
                            >
                              {action.icon}
                              <Typography variant="caption" sx={{ mt: 0.5 }}>
                                {action.label}
                              </Typography>
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Fade>
          </Grid>
        </Grid>
      </Box>

      {/* New Trip Flow Dialog */}
      <Dialog 
        open={showNewTripDialog} 
        onClose={() => setShowNewTripDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={Fade}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle className="dialog-header" sx={{
          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PlayArrow sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="800">New Trip</Typography>
              <Typography variant="caption">Step {currentStep + 1} of {tripSteps.length}</Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent className="dialog-content" sx={{ p: 4 }}>
          <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
            {tripSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent()}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={currentStep === 0 ? () => setShowNewTripDialog(false) : handlePreviousStep}
            sx={{ 
              color: '#666',
              fontWeight: '600'
            }}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button 
            variant="contained"
            disabled={loading}
            className="primary-btn"
            onClick={currentStep === 0 ? handleSetPickup : 
                    currentStep === 1 ? handleSetDestination : 
                    currentStep === 3 ? handleProcessPayment : 
                    handleCompleteTrip}
            sx={{
              background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
              fontWeight: '600'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 
             currentStep === 0 ? 'Next' :
             currentStep === 1 ? 'Start Trip' :
             currentStep === 3 ? 'Process Payment' :
             'Complete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* End Trip Dialog */}
      <Dialog 
        open={showEndTripDialog} 
        onClose={() => setShowEndTripDialog(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle className="dialog-header" sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="800">End Trip</Typography>
              <Typography variant="caption">Confirm trip completion</Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {loading ? (
              <Box sx={{ py: 4 }}>
                <CircularProgress size={60} sx={{ color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Processing completion...
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <CheckCircle sx={{ fontSize: 48, color: '#4CAF50' }} />
                </Box>
                
                <Typography variant="h4" fontWeight="800" gutterBottom>
                  End Trip?
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Confirm you've reached {activeTrip?.destination}
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {[
                    { label: 'Duration', value: formatTime(tripTime), icon: <AccessTime /> },
                    { label: 'Distance', value: `${calculateDistance().toFixed(1)} km`, icon: <Speed /> },
                    { label: 'Fare', value: `UGX ${earnings.toLocaleString()}`, icon: <AccountBalanceWallet /> }
                  ].map((stat, index) => (
                    <Grid item xs={4} key={index}>
                      <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(76, 175, 80, 0.08)' }}>
                        {stat.icon}
                        <Typography variant="h6" fontWeight="800" color="#4CAF50" sx={{ mt: 1 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowEndTripDialog(false)}
            disabled={loading}
            sx={{ 
              color: '#666',
              fontWeight: '600'
            }}
          >
            Continue Trip
          </Button>
          <Button 
            variant="contained"
            disabled={loading}
            className="success-btn"
            onClick={handleEndTrip}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
              fontWeight: '600'
            }}
          >
            {loading ? 'Processing...' : 'End Trip'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Trip Dialog */}
      <Dialog 
        open={showCancelDialog} 
        onClose={() => setShowCancelDialog(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #FF3B30 0%, #D32F2F 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Cancel sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="800">Cancel Trip</Typography>
              <Typography variant="caption">Select cancellation reason</Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {showCancellationReasons ? (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Why are you cancelling this trip?
              </Typography>
              <RadioGroup
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                sx={{ mt: 2 }}
              >
                {cancellationReasons.map((reason) => (
                  <FormControlLabel 
                    key={reason}
                    value={reason} 
                    control={<Radio />} 
                    label={reason} 
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Cancel sx={{ fontSize: 64, color: '#FF3B30', mb: 3 }} />
              <Typography variant="h4" fontWeight="800" gutterBottom>
                Cancel Trip?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Are you sure you want to cancel this trip?
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => {
              setShowCancelDialog(false);
              setShowCancellationReasons(false);
              setCancellationReason('');
            }}
            sx={{ color: '#666' }}
          >
            Back to Trip
          </Button>
          <Button 
            variant="contained"
            className="danger-btn"
            onClick={() => {
              if (showCancellationReasons) {
                handleCancelTrip();
              } else {
                setShowCancellationReasons(true);
              }
            }}
            disabled={showCancellationReasons && !cancellationReason}
            sx={{
              backgroundColor: '#FF3B30',
              '&:hover': {
                backgroundColor: '#D32F2F'
              }
            }}
          >
            {showCancellationReasons ? 'Confirm Cancellation' : 'Cancel Trip'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Mobile Floating Button */}
      {isMobile && !activeTrip && (
        <Zoom in timeout={400}>
          <Button
            variant="contained"
            className="floating-btn"
            onClick={handleStartTripFlow}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
              boxShadow: '0 8px 24px rgba(0, 37, 221, 0.4)',
              minWidth: 'auto',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <PlayArrow sx={{ color: 'white' }} />
          </Button>
        </Zoom>
      )}
    </Box>
  );
};

export default RidePage;