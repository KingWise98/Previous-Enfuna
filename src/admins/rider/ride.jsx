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
  FormControlLabel as MuiFormControlLabel
} from '@mui/material';
import {
  DirectionsCar,
  LocationOn,
  LocationOff,
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
  LocalGasStation,
  AccountBalance
} from '@mui/icons-material';

const RidePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTrip, setActiveTrip] = useState(null);
  const [showNewTripDialog, setShowNewTripDialog] = useState(false);
  const [showEndTripDialog, setShowEndTripDialog] = useState(false);
  const [showEditTripDialog, setShowEditTripDialog] = useState(false);
  const [showCancelTripDialog, setShowCancelTripDialog] = useState(false);
  const [showAddDestinationDialog, setShowAddDestinationDialog] = useState(false);
  const [showEndShiftDialog, setShowEndShiftDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tripTime, setTripTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [editTab, setEditTab] = useState(0);
  const [shiftActive, setShiftActive] = useState(true);
  const [shiftDuration, setShiftDuration] = useState(2040); // 34 minutes in seconds

  // Shift statistics
  const [shiftStats, setShiftStats] = useState({
    totalTrips: 8,
    momoEarnings: 52000,
    cashEarnings: 44000,
    fuelExpenses: 15000,
    totalEarnings: 96000,
    netEarnings: 81000
  });

  const [tripForm, setTripForm] = useState({
    pickup: 'Kollo',
    destination: 'Ntinda',
    paymentMethod: 'momo',
    vehicle: 'UBB 472Z'
  });

  const [editForm, setEditForm] = useState({
    destination: '',
    fare: '',
    paymentMethod: 'cash',
    additionalStop: '',
    cancelReason: ''
  });

  const [tripHistory, setTripHistory] = useState([
    {
      id: 1,
      pickup: 'Kollo',
      destination: 'Ntinda',
      fare: 15000,
      paymentMethod: 'momo',
      status: 'completed',
      duration: '25 min',
      distance: '8.2 km',
      startTime: '2:30 PM',
      endTime: '2:55 PM',
      date: 'Today'
    },
    {
      id: 2,
      pickup: 'Makerere',
      destination: 'Garden City',
      fare: 12000,
      paymentMethod: 'cash',
      status: 'completed',
      duration: '20 min',
      distance: '6.5 km',
      startTime: '11:15 AM',
      endTime: '11:35 AM',
      date: 'Today'
    },
    {
      id: 3,
      pickup: 'Entebbe',
      destination: 'Airport',
      fare: 45000,
      paymentMethod: 'momo',
      status: 'completed',
      duration: '45 min',
      distance: '35 km',
      startTime: '9:00 AM',
      endTime: '9:45 AM',
      date: 'Today'
    }
  ]);

  // Popular destinations in Uganda
  const popularDestinations = [
    { name: 'Kollo', area: 'Kampala', emoji: '📍' },
    { name: 'Ntinda', area: 'Kampala', emoji: '📍' },
    { name: 'Garden City Mall', area: 'Kampala', emoji: '🛍️' },
    { name: 'Acacia Mall', area: 'Kisementi', emoji: '🏬' },
    { name: 'Makerere University', area: 'Makerere', emoji: '🎓' },
    { name: 'Mulago Hospital', area: 'Mulago', emoji: '🏥' },
    { name: 'Entebbe Airport', area: 'Entebbe', emoji: '✈️' },
    { name: 'Nakasero Market', area: 'Nakasero', emoji: '🥦' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: <AttachMoney /> },
    { value: 'momo', label: 'MoMo', icon: <Smartphone /> },
    { value: 'card', label: 'Card', icon: <CreditCard /> }
  ];

  // Real-time trip timer
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

  // Calculate earnings based on trip time (simulated)
  useEffect(() => {
    if (activeTrip) {
      const baseFare = parseInt(activeTrip.fare) || 0;
      const timeBonus = Math.floor(tripTime / 60) * 500; // 500 UGX per minute
      setEarnings(baseFare + timeBonus);
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

  const handleEditInputChange = (field) => (event) => {
    setEditForm(prev => ({
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
    return `${hours}h ${mins}m`;
  };

  const handleStartTrip = () => {
    if (!tripForm.destination) {
      showSnackbar('Please select destination', 'error');
      return;
    }

    const selectedDestination = popularDestinations.find(dest => dest.name === tripForm.destination);

    const newTrip = {
      id: Date.now(),
      pickup: tripForm.pickup,
      destination: tripForm.destination,
      area: selectedDestination?.area,
      emoji: selectedDestination?.emoji,
      fare: 15000, // Default fare
      paymentMethod: tripForm.paymentMethod,
      vehicle: tripForm.vehicle,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startTimestamp: new Date(),
      status: 'active',
      additionalStops: []
    };

    setActiveTrip(newTrip);
    setShowNewTripDialog(false);
    setTripTime(0);
    showSnackbar('Trip started! Ride safely.');
  };

  const handleEndTrip = () => {
    if (!activeTrip) return;

    const tripDuration = formatTime(tripTime);
    const distance = calculateDistance();

    const completedTrip = {
      ...activeTrip,
      id: Date.now(),
      status: 'completed',
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: tripDuration,
      distance: `${(distance).toFixed(1)} km`,
      fare: earnings,
      date: 'Today'
    };

    // Update shift stats
    const paymentKey = activeTrip.paymentMethod === 'momo' ? 'momoEarnings' : 
                      activeTrip.paymentMethod === 'cash' ? 'cashEarnings' : 'momoEarnings';
    
    setShiftStats(prev => ({
      ...prev,
      totalTrips: prev.totalTrips + 1,
      [paymentKey]: prev[paymentKey] + earnings,
      totalEarnings: prev.totalEarnings + earnings,
      netEarnings: prev.netEarnings + earnings
    }));

    setTripHistory(prev => [completedTrip, ...prev]);
    setActiveTrip(null);
    setShowEndTripDialog(false);
    showSnackbar(`Trip completed! You earned UGX ${earnings.toLocaleString()}`);
  };

  const handleEndShift = () => {
    setShiftActive(false);
    setShowEndShiftDialog(false);
    showSnackbar('Shift ended successfully!');
  };

  const calculateDistance = () => {
    return (tripTime / 60) * 0.8;
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'cash': return <AttachMoney />;
      case 'card': return <CreditCard />;
      case 'momo': return <Smartphone />;
      default: return <AttachMoney />;
    }
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'momo': return 'MoMo';
      default: return 'Cash';
    }
  };

  // Main Dashboard
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
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
              icon={<DirectionsCar />}
              label={`UBB 472Z • Active ${formatShiftTime(shiftDuration)}`}
              sx={{ 
                backgroundColor: '#FFEC01', 
                color: '#000',
                fontWeight: 'bold'
              }}
            />
            {!activeTrip && (
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
                onClick={() => setShowNewTripDialog(true)}
              >
                New Trip
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Trip Management */}
          <Grid item xs={12} md={8}>
            {activeTrip ? (
              // Active Trip View
              <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
                <CardContent sx={{ p: 3 }}>
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

                  {/* Trip Details */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, border: `1px solid #0025DD20` }}>
                        <Typography variant="body2" color="text.secondary">
                          Pickup
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {activeTrip.pickup}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, border: `1px solid #0025DD20` }}>
                        <Typography variant="body2" color="text.secondary">
                          Destination
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {activeTrip.destination}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, border: `1px solid #0025DD20` }}>
                        <Typography variant="body2" color="text.secondary">
                          Payment
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPaymentIcon(activeTrip.paymentMethod)}
                          <Typography variant="h6" fontWeight="bold">
                            {getPaymentLabel(activeTrip.paymentMethod)}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, border: `1px solid #0025DD20` }}>
                        <Typography variant="body2" color="text.secondary">
                          Motorcycle
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {activeTrip.vehicle}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Real-time Stats */}
                  <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                        <AccessTime sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          {formatTime(tripTime)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Trip Time
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                        <Speed sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          {calculateDistance().toFixed(1)} km
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Distance
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                        <AccountBalanceWallet sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          UGX {earnings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Earnings
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#0025DD',
                        flex: 1,
                        minWidth: '120px'
                      }}
                      startIcon={<Map />}
                    >
                      Navigation
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#FFEC01',
                        color: '#000',
                        flex: 1,
                        minWidth: '120px'
                      }}
                      startIcon={<CheckCircle />}
                      onClick={() => setShowEndTripDialog(true)}
                    >
                      End Trip
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: '#0025DD',
                        color: '#0025DD',
                        flex: 1,
                        minWidth: '120px'
                      }}
                      startIcon={<Cancel />}
                      onClick={() => setShowCancelTripDialog(true)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              // No Active Trip - Quick Start
              <Card sx={{ mb: 3, border: `2px dashed #0025DD` }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <DirectionsCar sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="#0025DD">
                    Ready to Ride?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Start a new trip and begin earning
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
                    Start New Trip
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Trip History */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                  Recent Trips
                </Typography>
                <List>
                  {tripHistory.map((trip, index) => (
                    <ListItem 
                      key={trip.id} 
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
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" fontWeight="500">
                                {trip.pickup} → {trip.destination}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {trip.distance} • {trip.duration} • {trip.startTime}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right', ml: 2 }}>
                              <Typography variant="body1" fontWeight="bold" color="#0025DD">
                                UGX {trip.fare.toLocaleString()}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip 
                                  label={trip.paymentMethod.toUpperCase()}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: trip.paymentMethod === 'momo' ? '#0025DD20' : '#FFEC01',
                                    color: trip.paymentMethod === 'momo' ? '#0025DD' : '#000'
                                  }}
                                />
                              </Box>
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

          {/* Right Column - Earnings & Shift Info */}
          <Grid item xs={12} md={4}>
            {/* Earnings Summary */}
            <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                  Earnings Summary
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Trips:</Typography>
                    <Typography variant="body2" fontWeight="bold">{shiftStats.totalTrips}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">MoMo:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      UGX {shiftStats.momoEarnings.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Cash:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      UGX {shiftStats.cashEarnings.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Fuel Expenses:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="error.main">
                      UGX {shiftStats.fuelExpenses.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Total Earnings:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">
                      UGX {shiftStats.totalEarnings.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Net Earnings:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">
                      UGX {shiftStats.netEarnings.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: '#0025DD',
                      color: '#0025DD'
                    }}
                    startIcon={<Report />}
                    onClick={() => setShowReportDialog(true)}
                  >
                    Generate Report
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#0025DD'
                    }}
                    startIcon={<Stop />}
                    onClick={() => setShowEndShiftDialog(true)}
                  >
                    End Shift
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Vehicle Info */}
            <Card sx={{ border: `1px solid #0025DD20` }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                  Motorcycle Info
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <DirectionsCar sx={{ color: '#0025DD', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      UBB 472Z
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Toyota Noah • 2020
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Status:</Typography>
                  <Chip 
                    label="Active" 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#FFEC01', 
                      color: '#000',
                      fontWeight: 'bold'
                    }}
                  />
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Pickup Location
                </Typography>
                <Select
                  value={tripForm.pickup}
                  onChange={handleInputChange('pickup')}
                  sx={{ mb: 2 }}
                >
                  {popularDestinations.map((dest) => (
                    <MenuItem key={dest.name} value={dest.name}>
                      {dest.name} {dest.emoji}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Destination
                </Typography>
                <Select
                  value={tripForm.destination}
                  onChange={handleInputChange('destination')}
                  sx={{ mb: 2 }}
                >
                  {popularDestinations.map((dest) => (
                    <MenuItem key={dest.name} value={dest.name}>
                      {dest.name} {dest.emoji}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Payment Method
              </Typography>
              <RadioGroup
                value={tripForm.paymentMethod}
                onChange={handleInputChange('paymentMethod')}
                row
                sx={{ justifyContent: 'space-between', mb: 2 }}
              >
                {paymentMethods.map((method) => (
                  <FormControlLabel 
                    key={method.value}
                    value={method.value} 
                    control={<Radio sx={{ color: '#0025DD' }} />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {method.icon}
                        <Typography>{method.label}</Typography>
                      </Box>
                    } 
                  />
                ))}
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Motorcycle
              </Typography>
              <TextField
                fullWidth
                value={tripForm.vehicle}
                onChange={handleInputChange('vehicle')}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowNewTripDialog(false)}
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
            onClick={handleStartTrip}
            disabled={!tripForm.destination}
          >
            Save Trip
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
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircle sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Complete Trip to {activeTrip?.destination}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="#0025DD">
                  {formatTime(tripTime)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Distance
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="#0025DD">
                  {calculateDistance().toFixed(1)} km
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Total Earnings
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#0025DD">
                  UGX {earnings.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
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
            Confirm End Trip
          </Button>
        </DialogActions>
      </Dialog>

      {/* End Shift Dialog */}
      <Dialog 
        open={showEndShiftDialog} 
        onClose={() => setShowEndShiftDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">End Shift</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Stop sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              End Current Shift?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Shift Duration: {formatShiftTime(shiftDuration)}
            </Typography>
            
            <Paper sx={{ p: 2, backgroundColor: '#0025DD10', mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" color="#0025DD">
                Total Earnings: UGX {shiftStats.totalEarnings.toLocaleString()}
              </Typography>
            </Paper>
            
            <Typography variant="body2" color="text.secondary">
              This will end your current shift and calculate your final earnings.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowEndShiftDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Continue Shift
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={handleEndShift}
          >
            End Shift
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

export default RidePage;