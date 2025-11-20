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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Drawer,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Dashboard,
  DirectionsCar,
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
  Download,
  EmojiEvents,
  Add,
  Money,
  DeliveryDining,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Phone,
  Email
} from '@mui/icons-material';

const SimpleDriverApp = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [isDriving, setIsDriving] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('All data synced');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  // Comprehensive dashboard data
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
    driverScore: 78,
    pendingSync: 0,
    performance: {
      consistency: 95,
      efficiency: 88,
      customerRating: 4.7
    }
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

  // Quick Links Data
  const quickLinks = [
    {
      title: 'New Ride',
      description: 'Start a new ride',
      icon: <Add sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'primary',
      link: '/rider/ride',
      bgcolor: 'primary.50'
    },
    {
      title: 'Expenses',
      description: 'Manage your expenses',
      icon: <Money sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'error',
      link: '/rider/expense',
      bgcolor: 'error.50'
    },
    {
      title: 'Payments',
      description: 'View payment history',
      icon: <Payment sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'success',
      link: '/rider/page',
      bgcolor: 'success.50'
    },
    {
      title: 'Deliveries',
      description: 'Track deliveries',
      icon: <DeliveryDining sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'warning',
      link: '/rider/delivery',
      bgcolor: 'warning.50'
    }
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
    // Navigate to new ride page
    window.location.href = '/rider/ride';
  };

  const handleEndRide = () => {
    setIsDriving(false);
    setTimeout(() => {
      setShowPaymentDialog(true);
    }, 500);
  };

  const handlePayment = (method) => {
    const rideFare = 6000;
    
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

    setCurrentRide(null);
    setShowPaymentDialog(false);
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

  const handleQuickLinkClick = (link) => {
    window.location.href = link;
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // Responsive layout values
  const getGridLayout = () => {
    if (isMobile) {
      return { main: 12, sidebar: 12 };
    } else if (isTablet) {
      return { main: 8, sidebar: 4 };
    } else {
      return { main: 6, sidebar: 3 };
    }
  };

  const gridLayout = getGridLayout();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      pb: 3
    }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar position="static" color="primary" elevation={1}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              Driver Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleSOS}>
              <Security />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Header for Desktop */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ minWidth: isTablet ? '100%' : 'auto' }}>
              <Typography 
                variant={isTablet ? "h5" : "h4"} 
                fontWeight="bold" 
                gutterBottom
                sx={{ color: 'text.primary' }}
              >
                Driver Dashboard 🚕
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={isOnline ? <Sync /> : <WifiOff />}
                  label={isOnline ? "Online" : "Offline"} 
                  color={isOnline ? "success" : "default"}
                  variant={isOnline ? "filled" : "outlined"}
                  size={isTablet ? "small" : "medium"}
                />
                <Typography variant="body2" color="textSecondary">
                  {syncStatus} • {dashboardData.pendingSync} pending sync
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <Tooltip title="SOS Emergency">
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Security />}
                  onClick={handleSOS}
                  size={isTablet ? "small" : "medium"}
                >
                  {isTablet ? 'SOS' : 'Emergency SOS'}
                </Button>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<DirectionsCar />}
                onClick={handleStartRide}
                size={isTablet ? "small" : "medium"}
              >
                {isTablet ? 'New Ride' : 'Start New Ride'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Quick Links Section */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {quickLinks.map((link, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                    backgroundColor: 'action.hover'
                  },
                  height: '100%',
                  minHeight: isMobile ? 100 : 120
                }}
                onClick={() => handleQuickLinkClick(link.link)}
              >
                <CardContent sx={{ 
                  textAlign: 'center', 
                  p: isMobile ? 1.5 : 2,
                  '&:last-child': { pb: isMobile ? 1.5 : 2 }
                }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: link.bgcolor,
                    mb: 1
                  }}>
                    <Box sx={{ color: `${link.color}.main` }}>
                      {link.icon}
                    </Box>
                  </Box>
                  <Typography 
                    variant={isMobile ? "subtitle2" : "h6"} 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ color: 'text.primary' }}
                  >
                    {link.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="textSecondary"
                    sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
                  >
                    {link.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Dashboard Content */}
        <Grid container spacing={2}>
          {/* Left Sidebar - Profile & Quick Stats */}
          <Grid item xs={12} md={3}>
            {/* Driver Profile Card */}
            <Card sx={{ mb: 2 }} elevation={1}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ 
                    width: isMobile ? 50 : 60, 
                    height: isMobile ? 50 : 60, 
                    bgcolor: 'primary.main' 
                  }}>
                    <Person />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      fontWeight="bold"
                      sx={{ color: 'text.primary' }}
                    >
                      Emma Vangamoi
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Driver ID: DRV001
                    </Typography>
                    <Chip 
                      label="Gold Tier" 
                      size="small" 
                      color="warning" 
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
                
                {/* Quick Stats */}
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.primary' }}>
                    Today's Performance
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Paper 
                        sx={{ 
                          p: 1, 
                          textAlign: 'center',
                          backgroundColor: 'background.paper'
                        }}
                        elevation={0}
                        variant="outlined"
                      >
                        <Typography variant="h6" color="primary.main">
                          {dashboardData.today.rides}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Drives
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper 
                        sx={{ 
                          p: 1, 
                          textAlign: 'center',
                          backgroundColor: 'background.paper'
                        }}
                        elevation={0}
                        variant="outlined"
                      >
                        <Typography variant="h6" color="success.main">
                          UGX {dashboardData.today.netEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Net
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card elevation={1}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  gutterBottom
                  sx={{ color: 'text.primary' }}
                >
                  Performance Metrics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Consistency</Typography>
                    <Typography variant="body2" fontWeight="bold" color="text.primary">
                      {dashboardData.performance.consistency}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.performance.consistency} 
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Efficiency</Typography>
                    <Typography variant="body2" fontWeight="bold" color="text.primary">
                      {dashboardData.performance.efficiency}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.performance.efficiency} 
                    color="primary"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Customer Rating</Typography>
                    <Typography variant="body2" fontWeight="bold" color="text.primary">
                      {dashboardData.performance.customerRating}/5
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.performance.customerRating * 20} 
                    color="warning"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Dashboard Content */}
          <Grid item xs={12} md={6}>
            {/* Earnings Overview */}
            <Card sx={{ mb: 2 }} elevation={1}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ color: 'text.primary' }}
                >
                  Earnings Overview
                </Typography>

                <Grid container spacing={isMobile ? 1 : 2}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      bgcolor: 'primary.50',
                      height: '100%'
                    }}>
                      <LocalAtm color="primary" sx={{ fontSize: isMobile ? 30 : 40, mb: 1 }} />
                      <Typography 
                        variant={isMobile ? "h6" : "h5"} 
                        color="primary" 
                        fontWeight="bold"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        UGX {dashboardData.today.income.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">Total Income</Typography>
                      <Chip 
                        label="+12% today" 
                        size="small" 
                        color="success" 
                        sx={{ mt: 0.5 }} 
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      bgcolor: 'error.50',
                      height: '100%'
                    }}>
                      <Receipt color="error" sx={{ fontSize: isMobile ? 30 : 40, mb: 1 }} />
                      <Typography 
                        variant={isMobile ? "h6" : "h5"} 
                        color="error.main" 
                        fontWeight="bold"
                      >
                        UGX {dashboardData.today.expenses.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">Total Expenses</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      bgcolor: 'success.50',
                      height: '100%'
                    }}>
                      <TrendingUp color="success" sx={{ fontSize: isMobile ? 30 : 40, mb: 1 }} />
                      <Typography 
                        variant={isMobile ? "h6" : "h5"} 
                        color="success.main" 
                        fontWeight="bold"
                      >
                        UGX {dashboardData.today.netEarnings.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">Net Earnings</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Additional Metrics */}
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {[
                    { value: dashboardData.today.rides, label: 'Drives' },
                    { value: `${dashboardData.today.distance}km`, label: 'Distance' },
                    { value: `${dashboardData.today.activeHours}h`, label: 'Active' },
                    { value: `UGX ${dashboardData.today.avgFare}`, label: 'Avg Fare' }
                  ].map((metric, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Box textAlign="center">
                        <Typography 
                          variant={isMobile ? "body1" : "h6"} 
                          fontWeight="bold"
                          color="text.primary"
                        >
                          {metric.value}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="textSecondary"
                          sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
                        >
                          {metric.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Drives Table */}
            <Card elevation={1}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2,
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    fontWeight="bold"
                    sx={{ color: 'text.primary' }}
                  >
                    Recent Drives
                  </Typography>
                  <Button 
                    startIcon={<Download />} 
                    variant="outlined" 
                    size="small"
                  >
                    Export
                  </Button>
                </Box>
                
                <TableContainer 
                  sx={{ 
                    maxHeight: isMobile ? 300 : 400,
                    '& .MuiTableRow-root:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Table size={isMobile ? "small" : "medium"} stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                          Time
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                          Route
                        </TableCell>
                        <TableCell 
                          align="right" 
                          sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}
                        >
                          Fare
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                              Distance
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                              Payment
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentRides.map((ride) => (
                        <TableRow key={ride.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500" color="text.primary">
                              {ride.time}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={ride.route}>
                              <Typography 
                                variant="body2" 
                                noWrap 
                                sx={{ 
                                  maxWidth: isMobile ? 120 : 200,
                                  color: 'text.primary'
                                }}
                              >
                                {ride.route}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold" color="text.primary">
                              UGX {ride.fare.toLocaleString()}
                            </Typography>
                          </TableCell>
                          {!isMobile && (
                            <>
                              <TableCell color="text.primary">{ride.distance}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={ride.payment} 
                                  size="small" 
                                  color={ride.payment === 'cash' ? 'primary' : 'secondary'}
                                />
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={3}>
            {/* Notifications Panel */}
            <Card sx={{ mb: 2 }} elevation={1}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  gutterBottom
                  sx={{ color: 'text.primary' }}
                >
                  Notifications
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{ bgcolor: 'success.100', width: 32, height: 32 }}>
                        <EmojiEvents color="success" fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.primary">
                          Weekly Target Achieved!
                        </Typography>
                      }
                      secondary="You've completed 52 drives this week"
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{ bgcolor: 'info.100', width: 32, height: 32 }}>
                        <LocalAtm color="info" fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.primary">
                          New Loan Offer
                        </Typography>
                      }
                      secondary="You're eligible for UGX 500,000"
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Expense Summary */}
            <Card sx={{ mb: 2 }} elevation={1}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2 
                }}>
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{ color: 'text.primary' }}
                  >
                    Today's Expenses
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => handleQuickLinkClick('/rider/expense')}
                  >
                    View All
                  </Button>
                </Box>
                <List dense>
                  {expenseHistory.filter(exp => exp.date === '2024-01-15').map((expense) => (
                    <ListItem key={expense.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium" color="text.primary">
                            UGX {expense.amount.toLocaleString()}
                          </Typography>
                        }
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
            <Card elevation={1}>
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  gutterBottom
                  sx={{ color: 'text.primary' }}
                >
                  Drive Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoStartRide}
                      onChange={handleSettingChange('autoStartRide')}
                      size="small"
                    />
                  }
                  label="Auto-start drive"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.motionDetection}
                      onChange={handleSettingChange('motionDetection')}
                      size="small"
                    />
                  }
                  label="Motion alerts"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sosEnabled}
                      onChange={handleSettingChange('sosEnabled')}
                      size="small"
                    />
                  }
                  label="SOS feature"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
            Navigation
          </Typography>
          <Divider />
          <List>
            {quickLinks.map((link, index) => (
              <ListItem 
                key={index}
                button 
                onClick={() => {
                  handleQuickLinkClick(link.link);
                  setMobileDrawerOpen(false);
                }}
              >
                <ListItemIcon sx={{ color: `${link.color}.main` }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Payment Dialog */}
      <Dialog 
        open={showPaymentDialog} 
        onClose={() => setShowPaymentDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="text.primary">
              Complete Payment
            </Typography>
            <IconButton 
              onClick={() => setShowPaymentDialog(false)}
              size={isMobile ? "large" : "medium"}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: 'background.default' }}>
          <Typography variant="body1" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
            Drive completed! Please select your payment method:
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
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
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
                  primaryTypographyProps={{ fontWeight: 'medium', color: 'text.primary' }}
                />
                <Payment color="action" />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 2, 
          backgroundColor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Button 
            onClick={() => setShowPaymentDialog(false)}
            color="inherit"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SimpleDriverApp;