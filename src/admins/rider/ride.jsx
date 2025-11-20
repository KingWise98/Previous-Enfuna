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
  Select
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
  Map
} from '@mui/icons-material';

const RidePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTrip, setActiveTrip] = useState(null);
  const [showNewTripDialog, setShowNewTripDialog] = useState(false);
  const [showEndTripDialog, setShowEndTripDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tripTime, setTripTime] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const [tripForm, setTripForm] = useState({
    destination: '',
    fare: '',
    paymentMethod: 'cash'
  });

  const [tripHistory, setTripHistory] = useState([
    {
      id: 1,
      destination: 'Garden City Mall',
      fare: 15000,
      paymentMethod: 'cash',
      status: 'completed',
      duration: '25 min',
      distance: '8.2 km',
      startTime: '2:30 PM',
      endTime: '2:55 PM',
      date: 'Today'
    },
    {
      id: 2,
      destination: 'Makerere University',
      fare: 12000,
      paymentMethod: 'mobile',
      status: 'completed',
      duration: '20 min',
      distance: '6.5 km',
      startTime: '11:15 AM',
      endTime: '11:35 AM',
      date: 'Today'
    },
    {
      id: 3,
      destination: 'Entebbe Airport',
      fare: 45000,
      paymentMethod: 'card',
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
    { name: 'Garden City Mall', area: 'Kampala', emoji: '🛍️' },
    { name: 'Acacia Mall', area: 'Kisementi', emoji: '🏬' },
    { name: 'Makerere University', area: 'Makerere', emoji: '🎓' },
    { name: 'Mulago Hospital', area: 'Mulago', emoji: '🏥' },
    { name: 'Entebbe Airport', area: 'Entebbe', emoji: '✈️' },
    { name: 'Nakasero Market', area: 'Nakasero', emoji: '🥦' },
    { name: 'Uganda Museum', area: 'Kamwokya', emoji: '🏛️' },
    { name: 'Oasis Mall', area: 'Kampala', emoji: '🛒' },
    { name: 'Kabaka\'s Palace', area: 'Mengo', emoji: '👑' },
    { name: 'Jinja Town', area: 'Jinja', emoji: '🌊' }
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTrip = () => {
    if (!tripForm.destination || !tripForm.fare) {
      showSnackbar('Please select destination and enter fare', 'error');
      return;
    }

    const selectedDestination = popularDestinations.find(dest => dest.name === tripForm.destination);

    const newTrip = {
      id: Date.now(),
      destination: tripForm.destination,
      area: selectedDestination?.area,
      emoji: selectedDestination?.emoji,
      fare: parseInt(tripForm.fare),
      paymentMethod: tripForm.paymentMethod,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startTimestamp: new Date(),
      status: 'active'
    };

    setActiveTrip(newTrip);
    setShowNewTripDialog(false);
    setTripTime(0);
    
    // Reset form
    setTripForm({
      destination: '',
      fare: '',
      paymentMethod: 'cash'
    });

    showSnackbar('Trip started! Ride safely.');
  };

  const handleEndTrip = () => {
    if (!activeTrip) return;

    const tripDuration = formatTime(tripTime);
    const distance = calculateDistance(); // Simulated distance calculation

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

    setTripHistory(prev => [completedTrip, ...prev]);
    setActiveTrip(null);
    setShowEndTripDialog(false);
    showSnackbar(`Trip completed! You earned UGX ${earnings.toLocaleString()}`);
  };

  const calculateDistance = () => {
    // Simulate distance calculation based on time
    return (tripTime / 60) * 0.8; // Assume average speed of 48 km/h
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'cash': return <AttachMoney />;
      case 'card': return <CreditCard />;
      case 'mobile': return <Smartphone />;
      default: return <AttachMoney />;
    }
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'mobile': return 'Mobile Money';
      default: return 'Cash';
    }
  };

  // Active Trip Screen
  if (activeTrip) {
    return (
      <Box sx={{ p: isMobile ? 2 : 3, minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            🚗 Active Trip
          </Typography>
          <Chip 
            icon={<DirectionsCar />} 
            label="Trip in Progress" 
            color="success" 
            variant="filled"
          />
        </Box>

        <Grid container spacing={3}>
          {/* Trip Details */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Trip Details
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <LocationOn />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Destination
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {activeTrip.destination} {activeTrip.emoji}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activeTrip.area}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Real-time Stats */}
                <Grid container spacing={3} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                      <AccessTime color="primary" sx={{ mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        {formatTime(tripTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Trip Time
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.50' }}>
                      <Speed color="secondary" sx={{ mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        {calculateDistance().toFixed(1)} km
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Distance
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                      <AccountBalanceWallet color="success" sx={{ mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        UGX {earnings.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current Earnings
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Base Fare
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      UGX {activeTrip.fare.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPaymentIcon(activeTrip.paymentMethod)}
                      <Typography variant="body1" fontWeight="bold">
                        {getPaymentLabel(activeTrip.paymentMethod)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Started
                    </Typography>
                    <Typography variant="body2">
                      {activeTrip.startTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip label="In Progress" size="small" color="warning" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Actions & Live Updates */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Trip Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CheckCircle />}
                    onClick={() => setShowEndTripDialog(true)}
                    fullWidth
                  >
                    End Trip
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<Map />}
                    onClick={() => showSnackbar('Navigation started')}
                    fullWidth
                  >
                    Start Navigation
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<Close />}
                    onClick={() => {
                      setActiveTrip(null);
                      showSnackbar('Trip cancelled');
                    }}
                    fullWidth
                  >
                    Cancel Trip
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Live Updates */}
            <Card sx={{ mt: 2 }} elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Live Updates
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Time Elapsed"
                      secondary={formatTime(tripTime)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Distance Covered"
                      secondary={`${calculateDistance().toFixed(1)} km`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Earnings"
                      secondary={`UGX ${earnings.toLocaleString()}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Avg. Speed"
                      secondary="48 km/h"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* End Trip Dialog */}
        <Dialog 
          open={showEndTripDialog} 
          onClose={() => setShowEndTripDialog(false)} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">End Trip</Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Complete Trip to {activeTrip?.destination}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Trip Summary:
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatTime(tripTime)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Distance
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {calculateDistance().toFixed(1)} km
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    UGX {earnings.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEndTripDialog(false)}>Continue Trip</Button>
            <Button 
              variant="contained" 
              color="success"
              onClick={handleEndTrip}
              startIcon={<CheckCircle />}
            >
              Confirm End Trip
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Main Ride Page
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
              Ride 🏍️
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: isMobile ? 'center' : 'left' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold" 
            gutterBottom
            color="primary"
          >
            Ride & Earn
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start trips and track your earnings in real-time
          </Typography>
        </Box>

        {/* Quick Start Card */}
        <Card sx={{ mb: 4, backgroundColor: 'primary.50', border: '2px dashed', borderColor: 'primary.main' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <DirectionsCar sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ready to Ride?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start a new trip and begin earning
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => setShowNewTripDialog(true)}
              sx={{ px: 4 }}
            >
              Start New Trip
            </Button>
          </CardContent>
        </Card>

        {/* Trip History */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Trips
            </Typography>
            
            {tripHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <DirectionsCar sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No trips yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start your first trip to see history here
                </Typography>
              </Box>
            ) : (
              <List>
                {tripHistory.map((trip, index) => (
                  <ListItem 
                    key={trip.id} 
                    divider={index < tripHistory.length - 1}
                    sx={{ px: isMobile ? 0 : 2 }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.100' }}>
                        <DirectionsCar color="primary" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight="500">
                              {trip.destination} {trip.emoji}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {trip.distance} • {trip.duration} • {trip.startTime}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', ml: 2 }}>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              UGX {trip.fare.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={trip.status}
                                size="small"
                                color={trip.status === 'completed' ? 'success' : 'warning'}
                              />
                              {getPaymentIcon(trip.paymentMethod)}
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* New Trip Dialog */}
      <Dialog 
        open={showNewTripDialog} 
        onClose={() => setShowNewTripDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6">New Trip</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Destination Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Select Destination
                </Typography>
                <Select
                  value={tripForm.destination}
                  onChange={handleInputChange('destination')}
                  displayEmpty
                  startAdornment={<LocationOn color="action" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="">
                    <em>Choose a destination...</em>
                  </MenuItem>
                  {popularDestinations.map((dest) => (
                    <MenuItem key={dest.name} value={dest.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{dest.emoji}</Typography>
                        <Box>
                          <Typography variant="body1">{dest.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dest.area}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fare Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trip Fare (UGX)"
                type="number"
                value={tripForm.fare}
                onChange={handleInputChange('fare')}
                placeholder="0"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Payment Method
              </Typography>
              <RadioGroup
                value={tripForm.paymentMethod}
                onChange={handleInputChange('paymentMethod')}
                row
                sx={{ justifyContent: 'space-around' }}
              >
                <FormControlLabel 
                  value="cash" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney />
                      <Typography>Cash</Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="card" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCard />
                      <Typography>Card</Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="mobile" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Smartphone />
                      <Typography>Mobile</Typography>
                    </Box>
                  } 
                />
              </RadioGroup>
            </Grid>

            {/* Estimated Info */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Estimated trip: 15-25 min • ~6-8 km
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Typical fare: UGX 10,000 - 15,000
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewTripDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleStartTrip}
            startIcon={<PlayArrow />}
            disabled={!tripForm.destination || !tripForm.fare}
          >
            Start Trip
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

export default RidePage;