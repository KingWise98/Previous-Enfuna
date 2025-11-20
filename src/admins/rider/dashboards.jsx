import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  DirectionsCar,
  Payment,
  Money,
  Receipt,
  TrendingUp,
  Security,
  Person,
  Add,
  LocalGasStation,
  Restaurant,
  Build,
  WifiCalling3,
  Menu as MenuIcon
} from '@mui/icons-material';

const SimpleRiderApp = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [riderData] = useState({
    today: {
      rides: 8,
      earnings: 33000,
      expenses: 12000
    },
    wallet: {
      balance: 285000
    }
  });

  const quickActions = [
    {
      title: 'Start Ride',
      description: 'Begin a new trip',
      icon: <DirectionsCar sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'primary',
      link: '/rider/ride'
    },
    {
      title: 'Add Expense',
      description: 'Record spending',
      icon: <Money sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'error',
      link: '/rider/expense'
    },
    {
      title: 'View Payments',
      description: 'See your earnings',
      icon: <Payment sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'success',
      link: '/rider/payments'
    },
    {
      title: 'My Earnings',
      description: 'Check balance',
      icon: <Receipt sx={{ fontSize: isMobile ? 30 : 40 }} />,
      color: 'warning',
      link: '/rider/earning'
    }
  ];

  const recentExpenses = [
    { category: 'fuel', amount: 15000, description: 'Petrol refill', time: '08:00' },
    { category: 'food', amount: 8000, description: 'Lunch', time: '13:15' },
    { category: 'airtime', amount: 5000, description: 'Mobile data', time: '10:30' }
  ];

  const recentRides = [
    { time: '08:30 AM', fare: 5000, route: 'City Center to Industrial Area' },
    { time: '09:15 AM', fare: 3000, route: 'Market to Bus Park' },
    { time: '10:45 AM', fare: 7000, route: 'Suburb to Downtown' }
  ];

  const handleQuickAction = (link) => {
    window.location.href = link;
  };

  const handleSOS = () => {
    alert('🚨 Help is on the way! Your location has been shared with emergency contacts.');
  };

  const getExpenseIcon = (category) => {
    switch (category) {
      case 'fuel': return <LocalGasStation />;
      case 'food': return <Restaurant />;
      case 'repair': return <Build />;
      default: return <WifiCalling3 />;
    }
  };

  const getExpenseColor = (category) => {
    switch (category) {
      case 'fuel': return 'warning';
      case 'food': return 'success';
      case 'repair': return 'error';
      default: return 'info';
    }
  };

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
            <IconButton edge="start" color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
              My Rider App
            </Typography>
            <IconButton color="inherit" onClick={handleSOS}>
              <Security />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4, textAlign: isMobile ? 'center' : 'left' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold" 
            gutterBottom
            color="primary"
          >
            Welcome Back! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ready to start driving today?
          </Typography>
        </Box>

        {/* Big Action Buttons */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  textAlign: 'center',
                  p: 2,
                  backgroundColor: 'background.paper',
                  border: `2px solid ${theme.palette[action.color].light}`,
                  '&:hover': {
                    backgroundColor: `${action.color}.50`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleQuickAction(action.link)}
              >
                <Box sx={{ color: `${action.color}.main`, mb: 1 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Today's Summary */}
        <Card sx={{ mb: 3, backgroundColor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Today's Summary
            </Typography>
            <Grid container spacing={3} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {riderData.today.rides}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rides
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  UGX {riderData.today.earnings.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Earned
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  UGX {riderData.today.expenses.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Spent
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Wallet Balance */}
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Balance
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              UGX {riderData.wallet.balance.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Ready for withdrawal
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Recent Rides */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Recent Rides
                </Typography>
                <List>
                  {recentRides.map((ride, index) => (
                    <ListItem key={index} divider={index < recentRides.length - 1}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.100' }}>
                          <DirectionsCar color="primary" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" fontWeight="500">
                              {ride.route}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              UGX {ride.fare.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={ride.time}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={() => handleQuickAction('/rider/ride')}
                >
                  Start New Ride
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Expenses */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Recent Expenses
                </Typography>
                <List>
                  {recentExpenses.map((expense, index) => (
                    <ListItem key={index} divider={index < recentExpenses.length - 1}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `${getExpenseColor(expense.category)}.100` }}>
                          {getExpenseIcon(expense.category)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" fontWeight="500">
                              {expense.description}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="error.main">
                              UGX {expense.amount.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={expense.time}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={() => handleQuickAction('/rider/expense')}
                >
                  Add New Expense
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Emergency Button - Always Visible */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<Security />}
            onClick={handleSOS}
            sx={{
              borderRadius: '50%',
              width: 60,
              height: 60,
              minWidth: 0,
              boxShadow: 3,
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: 6
              }
            }}
          >
            SOS
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleRiderApp;