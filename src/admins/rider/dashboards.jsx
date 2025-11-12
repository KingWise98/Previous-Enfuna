import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  LinearProgress,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Dashboard,
  DirectionsBike,
  Payment,
  Close,
  LocalAtm,
  Smartphone,
  CreditCard,
  Receipt,
  TrendingUp,
  Notifications,
  Security,
  Person,
  Sync,
  WifiOff,
  History,
  Download,
  Speed,
  EmojiEvents,
  LocationOn,
  Schedule,
  Money
} from '@mui/icons-material';

const SimpleRiderApp = () => {
  const [isRiding, setIsRiding] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [activeView, setActiveView] = useState('ride');
  const [currentRide, setCurrentRide] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('All data synced');

  // Comprehensive dashboard data from previous code
  const [dashboardData, setDashboardData] = useState({
    today: {
      rides: 8,
      income: 45000,
      expenses: 12000,
      netEarnings: 33000,
      distance: 42.5,
      activeHours: '6.2',
      avgFare: 5625
    },
    weekly: {
      rides: 52,
      income: 285000,
      expenses: 75000,
      netEarnings: 210000,
      distance: 275.3,
      trend: '+12%'
    },
    monthly: {
      rides: 210,
      income: 1150000,
      expenses: 285000,
      netEarnings: 865000,
      trend: '+8%'
    },
    riderScore: 78,
    pendingSync: 0,
    performance: {
      consistency: 95,
      efficiency: 88,
      customerRating: 4.7
    }
  });

  const [newRide, setNewRide] = useState({
    destination: '',
    passengerCount: 1,
    paymentMethod: 'cash',
    estimatedFare: ''
  });

  const [settings, setSettings] = useState({
    autoStartRide: true,
    motionDetection: true,
    expenseReminders: true,
    sosEnabled: true
  });

  // Payment methods with icons
  const paymentMethods = [
    { value: 'mtn', label: 'MTN Mobile Money', icon: <Smartphone />, color: '#FFC107' },
    { value: 'airtel', label: 'Airtel Money', icon: <Smartphone />, color: '#E91E63' },
    { value: 'cash', label: 'Cash', icon: <LocalAtm />, color: '#4CAF50' },
    { value: 'card', label: 'Credit Card', icon: <CreditCard />, color: '#2196F3' }
  ];

  const recentRides = [
    { id: 1, time: '08:30 AM', fare: 5000, distance: '5.2km', payment: 'cash', duration: '18min', route: 'City Center to Industrial Area' },
    { id: 2, time: '09:15 AM', fare: 3000, distance: '3.1km', payment: 'mobile', duration: '12min', route: 'Market to Bus Park' },
    { id: 3, time: '10:45 AM', fare: 7000, distance: '7.8km', payment: 'cash', duration: '25min', route: 'Suburb to Downtown' },
    { id: 4, time: '11:30 AM', fare: 4000, distance: '4.2km', payment: 'mobile', duration: '15min', route: 'School to Residential' },
    { id: 5, time: '02:15 PM', fare: 6000, distance: '6.1km', payment: 'cash', duration: '20min', route: 'Office to Home' }
  ];

  const expenseHistory = [
    { id: 1, category: 'fuel', amount: 15000, description: 'Petrol refill', date: '2024-01-15', time: '08:00' },
    { id: 2, category: 'airtime', amount: 5000, description: 'Mobile data', date: '2024-01-15', time: '10:30' },
    { id: 3, category: 'food', amount: 8000, description: 'Lunch and drinks', date: '2024-01-15', time: '13:15' },
    { id: 4, category: 'repair', amount: 25000, description: 'Tire replacement', date: '2024-01-14', time: '16:45' }
  ];

  const expenseCategories = [
    { value: 'fuel', label: '⛽ Fuel', color: 'warning' },
    { value: 'repair', label: '🔧 Repair', color: 'error' },
    { value: 'airtime', label: '📞 Airtime', color: 'info' },
    { value: 'food', label: '🍔 Food', color: 'success' }
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const dataSyncInterval = setInterval(() => {
      const online = Math.random() > 0.1;
      setIsOnline(online);
      setSyncStatus(online ? 'All data synced' : 'Offline - data will sync when online');
    }, 15000);

    return () => {
      clearInterval(dataSyncInterval);
    };
  }, []);

  const handleStartRide = () => {
    const ride = {
      id: Date.now(),
      startTime: new Date(),
      destination: newRide.destination,
      passengerCount: newRide.passengerCount,
      estimatedFare: newRide.estimatedFare
    };
    setCurrentRide(ride);
    setIsRiding(true);
  };

  const handleEndRide = () => {
    setIsRiding(false);
    setTimeout(() => {
      setShowPaymentDialog(true);
    }, 500);
  };

  const handlePayment = (method) => {
    const rideFare = 6000; // Example fare amount
    
    // Update dashboard data with new ride
    setDashboardData(prev => ({
      ...prev,
      today: {
        ...prev.today,
        rides: prev.today.rides + 1,
        income: prev.today.income + rideFare,
        netEarnings: prev.today.netEarnings + rideFare,
        distance: prev.today.distance + 5.2
      },
      pendingSync: prev.pendingSync + 1
    }));

    // Reset and close
    setCurrentRide(null);
    setShowPaymentDialog(false);
    setNewRide({ destination: '', passengerCount: 1, paymentMethod: 'cash', estimatedFare: '' });
  };

  const handleSOS = () => {
    alert('🚨 SOS Alert Sent!\nYour location and ride details have been shared with emergency contacts.');
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      
      {/* Header with View Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Boda Boda Rider Dashboard 🏍️
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={isOnline ? <Sync /> : <WifiOff />}
              label={isOnline ? "Online" : "Offline"} 
              color={isOnline ? "success" : "default"}
              variant={isOnline ? "filled" : "outlined"}
            />
            <Typography variant="body2" color="textSecondary">
              {syncStatus} • {dashboardData.pendingSync} pending sync
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="SOS Emergency">
            <Button
              variant="contained"
              color="error"
              startIcon={<Security />}
              onClick={handleSOS}
            >
              SOS
            </Button>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<Dashboard />}
            onClick={() => setActiveView(activeView === 'ride' ? 'dashboard' : 'ride')}
          >
            {activeView === 'ride' ? 'View Dashboard' : 'Start Ride'}
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      {activeView === 'ride' ? (
        /* Simple Ride View */
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: isRiding ? 'error.main' : 'success.main',
                    mx: 'auto',
                    mb: 2
                  }}>
                    {isRiding ? <Stop /> : <DirectionsBike />}
                  </Avatar>
                  
                  <Typography variant="h5" gutterBottom color={isRiding ? 'error.main' : 'success.main'}>
                    {isRiding ? 'Ride in Progress' : 'Ready to Ride'}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    {isRiding ? 'Tap below to end your ride' : 'Start a new ride to begin earning'}
                  </Typography>
                </Box>

                {!isRiding ? (
                  /* Ride Start Form */
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      fullWidth
                      label="Passenger Destination"
                      value={newRide.destination}
                      onChange={(e) => setNewRide(prev => ({ ...prev, destination: e.target.value }))}
                      sx={{ mb: 2 }}
                    />
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Passengers</InputLabel>
                      <Select
                        value={newRide.passengerCount}
                        onChange={(e) => setNewRide(prev => ({ ...prev, passengerCount: e.target.value }))}
                        label="Passengers"
                      >
                        <MenuItem value={1}>1 Passenger</MenuItem>
                        <MenuItem value={2}>2 Passengers</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Estimated Fare (UGX)"
                      type="number"
                      value={newRide.estimatedFare}
                      onChange={(e) => setNewRide(prev => ({ ...prev, estimatedFare: e.target.value }))}
                      sx={{ mb: 3 }}
                    />

                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrow />}
                      onClick={handleStartRide}
                      disabled={!newRide.destination}
                      fullWidth
                    >
                      Start Ride
                    </Button>
                  </Box>
                ) : (
                  /* Ride in Progress */
                  <Box sx={{ mt: 3 }}>
                    <Paper sx={{ p: 2, bgcolor: 'info.50', mb: 3 }}>
                      <Typography variant="body1" gutterBottom>
                        📍 To: {currentRide?.destination}
                      </Typography>
                      <Typography variant="body2">
                        👥 Passengers: {currentRide?.passengerCount}
                      </Typography>
                      <Typography variant="body2">
                        💰 Estimated: UGX {currentRide?.estimatedFare}
                      </Typography>
                    </Paper>

                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<Stop />}
                      onClick={handleEndRide}
                      fullWidth
                    >
                      End Ride
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        /* Detailed Dashboard View */
        <Grid container spacing={3}>
          {/* Left Sidebar - Profile & Quick Stats */}
          <Grid item xs={3}>
            {/* Rider Profile Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      David Kato
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Rider ID: RDR001
                    </Typography>
                    <Chip label="Gold Tier" size="small" color="warning" />
                  </Box>
                </Box>
                
                {/* Quick Stats */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Today's Performance</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          {dashboardData.today.rides}
                        </Typography>
                        <Typography variant="caption">Rides</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main">
                          UGX {dashboardData.today.netEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="caption">Net</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Consistency</Typography>
                    <Typography variant="body2" fontWeight="bold">{dashboardData.performance.consistency}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.performance.consistency} 
                    color="success"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Efficiency</Typography>
                    <Typography variant="body2" fontWeight="bold">{dashboardData.performance.efficiency}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.performance.efficiency} 
                    color="primary"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Customer Rating</Typography>
                    <Typography variant="body2" fontWeight="bold">{dashboardData.performance.customerRating}/5</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.performance.customerRating * 20} 
                    color="warning"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Dashboard Content */}
          <Grid item xs={6}>
            {/* Earnings Overview */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>Earnings Overview</Typography>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.50' }}>
                      <LocalAtm color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        UGX {dashboardData.today.income.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">Total Income</Typography>
                      <Chip label="+12% today" size="small" color="success" sx={{ mt: 1 }} />
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.50' }}>
                      <Receipt color="error" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="error.main" fontWeight="bold">
                        UGX {dashboardData.today.expenses.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">Total Expenses</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.50' }}>
                      <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        UGX {dashboardData.today.netEarnings.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">Net Earnings</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Additional Metrics */}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={3}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="textPrimary">
                        {dashboardData.today.rides}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">Rides</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="textPrimary">
                        {dashboardData.today.distance}km
                      </Typography>
                      <Typography variant="body2" color="textSecondary">Distance</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="textPrimary">
                        {dashboardData.today.activeHours}h
                      </Typography>
                      <Typography variant="body2" color="textSecondary">Active</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="textPrimary">
                        UGX {dashboardData.today.avgFare}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">Avg Fare</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Rides Table */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">Recent Rides</Typography>
                  <Button startIcon={<Download />} variant="outlined" size="small">
                    Export
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Route</TableCell>
                        <TableCell align="right">Fare</TableCell>
                        <TableCell>Distance</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Payment</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentRides.map((ride) => (
                        <TableRow key={ride.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {ride.time}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={ride.route}>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                {ride.route}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              UGX {ride.fare.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>{ride.distance}</TableCell>
                          <TableCell>{ride.duration}</TableCell>
                          <TableCell>
                            <Chip 
                              label={ride.payment} 
                              size="small" 
                              color={ride.payment === 'cash' ? 'primary' : 'secondary'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={3}>
            {/* Expense Summary */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Today's Expenses</Typography>
                <List dense>
                  {expenseHistory.filter(exp => exp.date === '2024-01-15').map((expense) => (
                    <ListItem key={expense.id}>
                      <ListItemText
                        primary={`UGX ${expense.amount.toLocaleString()}`}
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{expenseCategories.find(cat => cat.value === expense.category)?.label}</span>
                            <span>{expense.time}</span>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Ride Settings</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoStartRide}
                      onChange={handleSettingChange('autoStartRide')}
                    />
                  }
                  label="Auto-start ride detection"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.motionDetection}
                      onChange={handleSettingChange('motionDetection')}
                    />
                  }
                  label="Motion detection alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sosEnabled}
                      onChange={handleSettingChange('sosEnabled')}
                    />
                  }
                  label="SOS emergency feature"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Complete Payment</Typography>
            <IconButton onClick={() => setShowPaymentDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Ride completed! Please select your payment method:
          </Typography>
          
          <List>
            {paymentMethods.map((method) => (
              <ListItem 
                key={method.value}
                button 
                onClick={() => handlePayment(method.value)}
                sx={{ 
                  mb: 1, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <ListItemIcon sx={{ color: method.color }}>
                  {method.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={method.label} 
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
                <Payment color="action" />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimpleRiderApp;