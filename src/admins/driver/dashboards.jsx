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
  useTheme,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  DirectionsBike,
  Security,
  LocalAtm,
  Receipt,
  TrendingUp,
  Notifications,
  Add,
  Close,
  LocationOn,
  Schedule,
  Money,
  Speed,
  EmojiEvents,
  WifiOff,
  ExpandMore,
  Map,
  BarChart,
  History,
  Settings,
  Download,
  Upload,
  Sync,
  GpsFixed,
  Payment,
  Person
} from '@mui/icons-material';

const RiderDashboardDesktop = () => {
  const theme = useTheme();
  const [isRiding, setIsRiding] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [showRideDialog, setShowRideDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('All data synced');
  const [activeView, setActiveView] = useState('dashboard');
  const [settings, setSettings] = useState({
    autoStartRide: true,
    motionDetection: true,
    expenseReminders: true,
    sosEnabled: true
  });

  // Comprehensive mock data
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

  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    receipt: null,
    date: new Date().toISOString().split('T')[0]
  });

  const [newRide, setNewRide] = useState({
    estimatedFare: '',
    passengerDestination: '',
    passengerCount: 1,
    paymentMethod: 'cash',
    notes: ''
  });

  const expenseCategories = [
    { value: 'fuel', label: '⛽ Fuel', color: 'warning', common: true },
    { value: 'repair', label: '🔧 Repair', color: 'error', common: true },
    { value: 'airtime', label: '📞 Airtime', color: 'info', common: true },
    { value: 'maintenance', label: '🛠️ Maintenance', color: 'secondary', common: false },
    { value: 'food', label: '🍔 Food', color: 'success', common: true },
    { value: 'insurance', label: '🛡️ Insurance', color: 'primary', common: false },
    { value: 'license', label: '📄 License', color: 'info', common: false },
    { value: 'other', label: '📦 Other', color: 'default', common: false }
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

  // Simulate real-time data updates
  useEffect(() => {
    const motionInterval = setInterval(() => {
      if (!isRiding && settings.motionDetection && Math.random() > 0.7) {
        setShowAlert(true);
      }
    }, 30000);

    const dataSyncInterval = setInterval(() => {
      const online = Math.random() > 0.1;
      setIsOnline(online);
      setSyncStatus(online ? 'All data synced' : 'Offline - data will sync when online');
    }, 15000);

    return () => {
      clearInterval(motionInterval);
      clearInterval(dataSyncInterval);
    };
  }, [isRiding, settings.motionDetection]);

  const handleStartRide = () => {
    const ride = {
      id: Date.now(),
      startTime: new Date(),
      startLocation: 'Current Location',
      gpsCoordinates: { lat: 0.3476, lng: 32.5825 }, // Kampala coordinates
      ...newRide
    };
    setCurrentRide(ride);
    setShowRideDialog(true);
  };

  const handleConfirmStartRide = () => {
    setIsRiding(true);
    setShowRideDialog(false);
    // Start GPS tracking simulation
    console.log('GPS tracking started for ride:', currentRide.id);
  };

  const handleEndRide = () => {
    setShowRideDialog(true);
  };

  const handleConfirmEndRide = () => {
    const rideData = {
      ...currentRide,
      endTime: new Date(),
      finalFare: 6000, // This would come from form input
      actualDistance: '5.2km',
      duration: '18min'
    };

    setIsRiding(false);
    setCurrentRide(null);
    setShowRideDialog(false);
    
    // Update dashboard data
    setDashboardData(prev => ({
      ...prev,
      today: {
        ...prev.today,
        rides: prev.today.rides + 1,
        income: prev.today.income + 6000,
        netEarnings: prev.today.netEarnings + 6000,
        distance: prev.today.distance + 5.2
      },
      pendingSync: prev.pendingSync + 1
    }));

    // Reset ride form
    setNewRide({
      estimatedFare: '',
      passengerDestination: '',
      passengerCount: 1,
      paymentMethod: 'cash',
      notes: ''
    });

    // Ask to log expense
    setTimeout(() => {
      setShowExpenseDialog(true);
    }, 1000);
  };

  const handleLogExpense = () => {
    // Save expense logic here
    setDashboardData(prev => ({
      ...prev,
      today: {
        ...prev.today,
        expenses: prev.today.expenses + parseInt(newExpense.amount),
        netEarnings: prev.today.netEarnings - parseInt(newExpense.amount)
      },
      pendingSync: prev.pendingSync + 1
    }));

    setNewExpense({ 
      category: '', 
      amount: '', 
      description: '', 
      receipt: null,
      date: new Date().toISOString().split('T')[0]
    });
    setShowExpenseDialog(false);
  };

  const handleSOS = () => {
    // Enhanced SOS functionality
    const sosData = {
      riderId: 'RDR001',
      location: currentRide?.gpsCoordinates || { lat: 0.3476, lng: 32.5825 },
      timestamp: new Date(),
      rideInProgress: isRiding,
      currentRideId: currentRide?.id
    };
    
    alert('🚨 SOS Alert Sent!\nYour location and ride details have been shared with emergency contacts and stage leader.');
    console.log('SOS Data:', sosData);
  };

  const handleExportData = (type) => {
    // Export functionality
    alert(`Exporting ${type} data...`);
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Drivers Dashboard 🚕
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
            <Button 
              startIcon={<Sync />} 
              size="small" 
              disabled={isOnline && dashboardData.pendingSync === 0}
            >
              Sync Now
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="SOS Emergency">
            <Button
              variant="contained"
              color="error"
              startIcon={<Security />}
              onClick={handleSOS}
              sx={{ 
                bgcolor: 'error.main',
                '&:hover': { bgcolor: 'error.dark' },
                animation: 'pulse 2s infinite'
              }}
            >
              SOS
            </Button>
          </Tooltip>
          <IconButton color="primary">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Button startIcon={<Settings />} variant="outlined">
            Settings
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - Quick Actions & Stats */}
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
                    Emma Vangamoi
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Driver ID: RDR001
                  </Typography>
                  <Chip label="Gold Tier" size="small" color="warning" />
                </Box>
              </Box>
              
              {/* Ride Control */}
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  bgcolor: isRiding ? 'error.50' : 'success.50',
                  border: `2px dashed ${isRiding ? theme.palette.error.main : theme.palette.success.main}`,
                  mb: 2
                }}
              >
                <Typography variant="h6" gutterBottom color={isRiding ? 'error.main' : 'success.main'}>
                  {isRiding ? 'Ride in Progress' : 'Ready for Ride'}
                </Typography>
                {!isRiding ? (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayArrow />}
                    onClick={handleStartRide}
                    size="large"
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    Start New Drive
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Stop />}
                    onClick={handleEndRide}
                    size="large"
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    End Current Ride
                  </Button>
                )}
                <Typography variant="caption" display="block">
                  {isRiding ? 'Tap to end ride and calculate earnings' : 'Tap to start tracking your ride'}
                </Typography>
              </Paper>

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

              {/* Quick Actions */}
              <Button
                variant="outlined"
                startIcon={<Receipt />}
                fullWidth
                onClick={() => setShowExpenseDialog(true)}
                sx={{ mb: 1 }}
              >
                Log Expense
              </Button>
              <Button
                variant="outlined"
                startIcon={<History />}
                fullWidth
                onClick={() => setActiveView('history')}
              >
                Ride History
              </Button>
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

        {/* Main Content Area */}
        <Grid item xs={6}>
          {/* Earnings Overview */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Earnings Overview</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant={activeView === 'dashboard' ? 'contained' : 'outlined'}>
                    Today
                  </Button>
                  <Button size="small" variant={activeView === 'weekly' ? 'contained' : 'outlined'}>
                    This Week
                  </Button>
                  <Button size="small" variant={activeView === 'monthly' ? 'contained' : 'outlined'}>
                    This Month
                  </Button>
                </Box>
              </Box>

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
                    <Typography variant="body2" color="textSecondary">Drives</Typography>
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
                <Typography variant="h5" fontWeight="bold">Recent Drives</Typography>
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
                      <TableCell>Actions</TableCell>
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
                        <TableCell>
                          <Button size="small">Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar - Notifications & Quick Tools */}
        <Grid item xs={3}>
          {/* Notifications Panel */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.100', width: 32, height: 32 }}>
                      <EmojiEvents color="success" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Weekly Target Achieved!"
                    secondary="You've completed 52 drives this week"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'info.100', width: 32, height: 32 }}>
                      <LocalAtm color="info" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New Loan Offer"
                    secondary="You're eligible for UGX 500,000"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.100', width: 32, height: 32 }}>
                      <Receipt color="warning" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Expense Reminder"
                    secondary="Log your fuel expenses for better tracking"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

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
              <Button fullWidth startIcon={<Add />} onClick={() => setShowExpenseDialog(true)}>
                Add Expense
              </Button>
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
                    checked={settings.expenseReminders}
                    onChange={handleSettingChange('expenseReminders')}
                  />
                }
                label="Expense reminders"
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

      {/* Enhanced Ride Dialog */}
      <Dialog 
        open={showRideDialog} 
        onClose={() => setShowRideDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              {isRiding ? 'End Ride' : 'Start New Drive '}
            </Typography>
            <IconButton onClick={() => setShowRideDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {!isRiding ? (
              <>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>Ride Details</Typography>
                  <TextField
                    fullWidth
                    label="Estimated Fare (UGX)"
                    type="number"
                    margin="normal"
                    value={newRide.estimatedFare}
                    onChange={(e) => setNewRide(prev => ({ ...prev, estimatedFare: e.target.value }))}
                  />
                  <TextField
                    fullWidth
                    label="Passenger Destination"
                    margin="normal"
                    value={newRide.passengerDestination}
                    onChange={(e) => setNewRide(prev => ({ ...prev, passengerDestination: e.target.value }))}
                  />
                  <TextField
                    fullWidth
                    label="Passenger Count"
                    type="number"
                    margin="normal"
                    value={newRide.passengerCount}
                    onChange={(e) => setNewRide(prev => ({ ...prev, passengerCount: parseInt(e.target.value) }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>Additional Information</Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={newRide.paymentMethod}
                      onChange={(e) => setNewRide(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      label="Payment Method"
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="mobile">Mobile Money</MenuItem>
                      <MenuItem value="card">Card</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    margin="normal"
                    multiline
                    rows={3}
                    value={newRide.notes}
                    onChange={(e) => setNewRide(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>Ride Completion</Typography>
                  <TextField
                    fullWidth
                    label="Final Fare (UGX)"
                    type="number"
                    margin="normal"
                    defaultValue="6000"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Payment Received</InputLabel>
                    <Select defaultValue="cash" label="Payment Received">
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="mobile">Mobile Money</MenuItem>
                      <MenuItem value="card">Card</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>Ride Summary</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                    <Typography variant="body1" gutterBottom>
                      🎉 Ride Completed Successfully!
                    </Typography>
                    <Typography variant="body2">
                      Distance: 5.2km<br />
                      Duration: 18 minutes<br />
                      Estimated Earnings: UGX 6,000
                    </Typography>
                  </Paper>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Log expense for this ride"
                    sx={{ mt: 2 }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GpsFixed color="primary" />
                  <Typography variant="body2">
                    GPS: {isRiding ? 'Active tracking' : 'Ready'} • Location: Kampala, Uganda • {new Date().toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowRideDialog(false)} 
            variant="outlined"
            size="large"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={isRiding ? handleConfirmEndRide : handleConfirmStartRide}
            color={isRiding ? 'error' : 'success'}
            size="large"
            startIcon={isRiding ? <Stop /> : <PlayArrow />}
          >
            {isRiding ? 'End Drive' : 'Start Drive'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Expense Dialog */}
      <Dialog open={showExpenseDialog} onClose={() => setShowExpenseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Log New Expense</Typography>
            <IconButton onClick={() => setShowExpenseDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  {expenseCategories.map(cat => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Amount (UGX)"
                type="number"
                margin="normal"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                margin="normal"
                multiline
                rows={2}
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                margin="normal"
                value={newExpense.date}
                onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button startIcon={<Upload />} variant="outlined" component="label">
                Upload Receipt
                <input type="file" hidden accept="image/*" />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowExpenseDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleLogExpense}
            disabled={!newExpense.category || !newExpense.amount}
            startIcon={<Receipt />}
          >
            Log Expense
          </Button>
        </DialogActions>
      </Dialog>

      {/* Motion Detection Alert */}
      <Dialog open={showAlert} onClose={() => setShowAlert(false)} maxWidth="xs">
        <DialogContent>
          <Box textAlign="center" p={2}>
            <Avatar sx={{ bgcolor: 'primary.100', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <DirectionsBike color="primary" fontSize="large" />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Dving Detected! 🚕
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              We noticed you're moving. Start logging your trip to track your earnings and maintain your driver score?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" fullWidth onClick={() => setShowAlert(false)}>
                Dismiss
              </Button>
              <Button variant="contained" fullWidth onClick={handleStartRide}>
                Start Drive Logging
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RiderDashboardDesktop;