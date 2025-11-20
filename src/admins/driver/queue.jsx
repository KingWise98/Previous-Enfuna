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
  FormControlLabel as MuiFormControlLabel,
  Badge,
  LinearProgress,
  Fab
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
  AccountBalance,
  People,
  Timer,
  Notifications,
  Receipt,
  LocalParking,
  LocalCafe,
  LocalGasStation as FuelIcon,
  ExitToApp,
  ArrowUpward,
  ArrowDownward,
  QrCodeScanner,
  TrendingUp,
  TrendingDown,
  Place,
  MyLocation,
  Group,
  PersonAdd,
  Delete,
  ContentCopy,
  Share
} from '@mui/icons-material';

const QueueManagementPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeQueue, setActiveQueue] = useState(null);
  const [showCreateQueueDialog, setShowCreateQueueDialog] = useState(false);
  const [showManageQueueDialog, setShowManageQueueDialog] = useState(false);
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [queueTimer, setQueueTimer] = useState(0);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    destination: '',
    fare: '',
    paymentMethod: 'cash'
  });

  // Driver's created queues
  const [myQueues, setMyQueues] = useState([
    {
      id: 1,
      name: 'Airport Express',
      location: 'Entebbe Airport Terminal',
      destination: 'Kampala Central',
      baseFare: 15000,
      status: 'active',
      customers: [
        { id: 1, name: 'John M.', phone: '+256712345678', destination: 'Makerere', fare: 12000, position: 1, joinedAt: '10:30 AM' },
        { id: 2, name: 'Sarah K.', phone: '+256773456789', destination: 'Ntinda', fare: 10000, position: 2, joinedAt: '10:45 AM' },
        { id: 3, name: 'David L.', phone: '+256784567890', destination: 'Garden City', fare: 8000, position: 3, joinedAt: '11:00 AM' }
      ],
      maxCapacity: 10,
      vehicle: 'UBB 472Z',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'City Center Shuttle',
      location: 'Kampala Road',
      destination: 'Various Locations',
      baseFare: 8000,
      status: 'inactive',
      customers: [],
      maxCapacity: 8,
      vehicle: 'UBB 472Z',
      createdAt: '2024-01-14'
    }
  ]);

  const [queueForm, setQueueForm] = useState({
    name: '',
    location: '',
    destination: '',
    baseFare: '',
    maxCapacity: 6,
    vehicle: 'UBB 472Z'
  });

  const popularLocations = [
    { name: 'Entebbe Airport Terminal', area: 'Entebbe', emoji: '✈️' },
    { name: 'Kampala Road', area: 'Kampala Central', emoji: '🏙️' },
    { name: 'Garden City Mall', area: 'Kampala Central', emoji: '🛍️' },
    { name: 'Acacia Mall', area: 'Kisementi', emoji: '🏬' },
    { name: 'Nakumatt Oasis', area: 'Kampala', emoji: '🛒' },
    { name: 'Makerere University', area: 'Makerere', emoji: '🎓' },
    { name: 'Mulago Hospital', area: 'Mulago', emoji: '🏥' },
    { name: 'Ntinda Taxi Park', area: 'Ntinda', emoji: '🚗' }
  ];

  const popularDestinations = [
    { name: 'Kampala Central', area: 'City Center', emoji: '🏙️' },
    { name: 'Various Locations', area: 'Flexible', emoji: '🔀' },
    { name: 'Makerere', area: 'University Area', emoji: '🎓' },
    { name: 'Ntinda', area: 'Kampala', emoji: '📍' },
    { name: 'Kollo', area: 'Kampala', emoji: '📍' },
    { name: 'Entebbe Road', area: 'Highway', emoji: '🛣️' },
    { name: 'Gayaza', area: 'Wakiso', emoji: '🌄' },
    { name: 'Bweyogerere', area: 'Kira', emoji: '🏘️' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: <AttachMoney /> },
    { value: 'momo', label: 'MoMo', icon: <Smartphone /> },
    { value: 'card', label: 'Card', icon: <CreditCard /> }
  ];

  // Timer for active queue
  useEffect(() => {
    let interval;
    if (activeQueue) {
      interval = setInterval(() => {
        setQueueTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQueue]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateQueue = () => {
    if (!queueForm.name || !queueForm.location || !queueForm.destination) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    const newQueue = {
      id: Date.now(),
      name: queueForm.name,
      location: queueForm.location,
      destination: queueForm.destination,
      baseFare: parseInt(queueForm.baseFare) || 0,
      status: 'active',
      customers: [],
      maxCapacity: queueForm.maxCapacity,
      vehicle: queueForm.vehicle,
      createdAt: new Date().toLocaleDateString()
    };

    setMyQueues(prev => [newQueue, ...prev]);
    setActiveQueue(newQueue);
    setShowCreateQueueDialog(false);
    setQueueForm({
      name: '',
      location: '',
      destination: '',
      baseFare: '',
      maxCapacity: 6,
      vehicle: 'UBB 472Z'
    });
    showSnackbar('Queue created successfully!');
  };

  const handleStartQueue = (queue) => {
    setMyQueues(prev => 
      prev.map(q => 
        q.id === queue.id ? { ...q, status: 'active' } : q
      )
    );
    setActiveQueue({ ...queue, status: 'active' });
    showSnackbar(`Queue "${queue.name}" started`);
  };

  const handleStopQueue = (queue) => {
    setMyQueues(prev => 
      prev.map(q => 
        q.id === queue.id ? { ...q, status: 'inactive' } : q
      )
    );
    if (activeQueue && activeQueue.id === queue.id) {
      setActiveQueue(null);
    }
    showSnackbar(`Queue "${queue.name}" stopped`);
  };

  const handleDeleteQueue = (queue) => {
    setMyQueues(prev => prev.filter(q => q.id !== queue.id));
    if (activeQueue && activeQueue.id === queue.id) {
      setActiveQueue(null);
    }
    showSnackbar(`Queue "${queue.name}" deleted`);
  };

  const handleAddCustomer = () => {
    if (!customerForm.name || !customerForm.destination) {
      showSnackbar('Please fill customer name and destination', 'error');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      name: customerForm.name,
      phone: customerForm.phone,
      destination: customerForm.destination,
      fare: parseInt(customerForm.fare) || activeQueue.baseFare,
      paymentMethod: customerForm.paymentMethod,
      position: activeQueue.customers.length + 1,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedQueue = {
      ...activeQueue,
      customers: [...activeQueue.customers, newCustomer]
    };

    setMyQueues(prev => 
      prev.map(q => q.id === activeQueue.id ? updatedQueue : q)
    );
    setActiveQueue(updatedQueue);
    setShowAddCustomerDialog(false);
    setCustomerForm({
      name: '',
      phone: '',
      destination: '',
      fare: '',
      paymentMethod: 'cash'
    });
    showSnackbar('Customer added to queue');
  };

  const handleRemoveCustomer = (customerId) => {
    const updatedCustomers = activeQueue.customers
      .filter(customer => customer.id !== customerId)
      .map((customer, index) => ({ ...customer, position: index + 1 }));

    const updatedQueue = {
      ...activeQueue,
      customers: updatedCustomers
    };

    setMyQueues(prev => 
      prev.map(q => q.id === activeQueue.id ? updatedQueue : q)
    );
    setActiveQueue(updatedQueue);
    showSnackbar('Customer removed from queue');
  };

  const handleStartTrip = (customer) => {
    showSnackbar(`Starting trip with ${customer.name} to ${customer.destination}`);
    handleRemoveCustomer(customer.id);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'cash': return <AttachMoney />;
      case 'card': return <CreditCard />;
      case 'momo': return <Smartphone />;
      default: return <AttachMoney />;
    }
  };

  const getQueueStats = (queue) => {
    const totalEarnings = queue.customers.reduce((sum, customer) => sum + customer.fare, 0);
    return {
      totalCustomers: queue.customers.length,
      capacity: `${queue.customers.length}/${queue.maxCapacity}`,
      occupancyRate: Math.round((queue.customers.length / queue.maxCapacity) * 100),
      totalEarnings
    };
  };

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
            ENFUNA QUEUES
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<DirectionsCar />}
              label="UBB 472Z • Driver"
              sx={{ 
                backgroundColor: '#FFEC01', 
                color: '#000',
                fontWeight: 'bold'
              }}
            />
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
              onClick={() => setShowCreateQueueDialog(true)}
            >
              Create Queue
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Active Queue & Management */}
          <Grid item xs={12} lg={8}>
            {activeQueue ? (
              // Active Queue Management View
              <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#0025DD" gutterBottom>
                        {activeQueue.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<Place />}
                          label={activeQueue.location}
                          size="small"
                          sx={{ backgroundColor: '#0025DD20', color: '#0025DD' }}
                        />
                        <Chip 
                          icon={<MyLocation />}
                          label={`To: ${activeQueue.destination}`}
                          size="small"
                          sx={{ backgroundColor: '#FFEC01', color: '#000' }}
                        />
                        <Chip 
                          label={`${activeQueue.customers.length}/${activeQueue.maxCapacity} customers`}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </Box>
                    <Chip 
                      label={activeQueue.status === 'active' ? "ACTIVE" : "INACTIVE"} 
                      sx={{ 
                        backgroundColor: activeQueue.status === 'active' ? '#FFEC01' : '#666',
                        color: activeQueue.status === 'active' ? '#000' : '#fff',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  {/* Queue Stats */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                        <Group sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          {getQueueStats(activeQueue).totalCustomers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Customers
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                        <TrendingUp sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          {getQueueStats(activeQueue).occupancyRate}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Occupancy
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                        <AccountBalanceWallet sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          UGX {getQueueStats(activeQueue).totalEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Potential
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                        <Timer sx={{ color: '#0025DD', mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#0025DD">
                          {formatTime(queueTimer)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Time
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Queue Progress */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Queue Capacity
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getQueueStats(activeQueue).capacity}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getQueueStats(activeQueue).occupancyRate}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: '#0025DD20',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getQueueStats(activeQueue).occupancyRate >= 80 ? '#FF4444' : 
                                         getQueueStats(activeQueue).occupancyRate >= 50 ? '#FFEC01' : '#0025DD'
                        }
                      }}
                    />
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#0025DD',
                        flex: isMobile ? 1 : 'none'
                      }}
                      startIcon={<PersonAdd />}
                      onClick={() => setShowAddCustomerDialog(true)}
                    >
                      Add Customer
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: '#0025DD',
                        color: '#0025DD',
                        flex: isMobile ? 1 : 'none'
                      }}
                      startIcon={<Share />}
                    >
                      Share Queue
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: '#0025DD',
                        color: '#0025DD',
                        flex: isMobile ? 1 : 'none'
                      }}
                      startIcon={<ContentCopy />}
                    >
                      Copy Link
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#FF4444',
                        flex: isMobile ? 1 : 'none'
                      }}
                      startIcon={<Stop />}
                      onClick={() => handleStopQueue(activeQueue)}
                    >
                      Stop Queue
                    </Button>
                  </Box>

                  {/* Customers List */}
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                    Customers in Queue ({activeQueue.customers.length})
                  </Typography>
                  {activeQueue.customers.length > 0 ? (
                    <List>
                      {activeQueue.customers.map((customer, index) => (
                        <ListItem 
                          key={customer.id} 
                          divider={index < activeQueue.customers.length - 1}
                          sx={{ 
                            px: 0,
                            borderLeft: `4px solid #0025DD`
                          }}
                        >
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: '#0025DD', color: 'white' }}>
                              #{customer.position}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="500">
                                {customer.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  To: {customer.destination}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {customer.phone} • Joined {customer.joinedAt}
                                </Typography>
                              </Box>
                            }
                          />
                          <Box sx={{ textAlign: 'right', ml: 2, minWidth: 120 }}>
                            <Typography variant="body1" fontWeight="bold" color="#0025DD">
                              UGX {customer.fare.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, justifyContent: 'flex-end' }}>
                              {getPaymentIcon(customer.paymentMethod)}
                              <Typography variant="caption">
                                {customer.paymentMethod.toUpperCase()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                sx={{ 
                                  backgroundColor: '#0025DD',
                                  minWidth: 'auto',
                                  px: 1
                                }}
                                onClick={() => handleStartTrip(customer)}
                              >
                                Start
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  borderColor: '#FF4444',
                                  color: '#FF4444',
                                  minWidth: 'auto',
                                  px: 1
                                }}
                                onClick={() => handleRemoveCustomer(customer.id)}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#0025DD05' }}>
                      <Group sx={{ fontSize: 48, color: '#0025DD20', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No customers in queue
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add customers to start managing your queue
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={() => setShowAddCustomerDialog(true)}
                        sx={{
                          backgroundColor: '#0025DD'
                        }}
                      >
                        Add First Customer
                      </Button>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            ) : (
              // No Active Queue - Create or Select One
              <Card sx={{ mb: 3, border: `2px dashed #0025DD` }}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Group sx={{ fontSize: 80, color: '#0025DD20', mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold" gutterBottom color="#0025DD">
                    Manage Your Transport Queues
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                    Create queues for different routes and locations. Customers can join your queues and you can manage their transportation efficiently.
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
                    startIcon={<Add />}
                    onClick={() => setShowCreateQueueDialog(true)}
                  >
                    Create New Queue
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* My Queues List */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                  My Queues ({myQueues.length})
                </Typography>
                <Grid container spacing={2}>
                  {myQueues.map((queue) => (
                    <Grid item xs={12} md={6} key={queue.id}>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          border: `2px solid ${queue.status === 'active' ? '#0025DD' : '#66666630'}`,
                          backgroundColor: queue.status === 'active' ? '#0025DD08' : 'transparent',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: '#0025DD',
                            backgroundColor: '#0025DD05'
                          }
                        }}
                        onClick={() => {
                          setActiveQueue(queue);
                          setQueueTimer(0);
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {queue.name}
                          </Typography>
                          <Chip 
                            label={queue.status} 
                            size="small"
                            color={queue.status === 'active' ? 'primary' : 'default'}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          📍 {queue.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          🎯 To: {queue.destination}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="500">
                            {queue.customers.length} customers
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="#0025DD">
                            UGX {queue.baseFare.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          {queue.status === 'active' ? (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderColor: '#FF4444',
                                color: '#FF4444',
                                flex: 1
                              }}
                              startIcon={<Stop />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStopQueue(queue);
                              }}
                            >
                              Stop
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              sx={{ 
                                backgroundColor: '#0025DD',
                                flex: 1
                              }}
                              startIcon={<PlayArrow />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartQueue(queue);
                              }}
                            >
                              Start
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#FF4444',
                              color: '#FF4444'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQueue(queue);
                            }}
                          >
                            <Delete />
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Quick Stats & Actions */}
          <Grid item xs={12} lg={4}>
            {/* Quick Stats */}
            <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                  Queue Statistics
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Total Queues:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="#0025DD">
                      {myQueues.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Active Queues:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="#0025DD">
                      {myQueues.filter(q => q.status === 'active').length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Total Customers Today:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="#0025DD">
                      {myQueues.reduce((total, queue) => total + queue.customers.length, 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">Potential Earnings:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="#0025DD">
                      UGX {myQueues.reduce((total, queue) => 
                        total + queue.customers.reduce((sum, customer) => sum + customer.fare, 0), 0
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#0025DD'
                  }}
                  startIcon={<Add />}
                  onClick={() => setShowCreateQueueDialog(true)}
                >
                  Create New Queue
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ border: `1px solid #0025DD20` }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    sx={{ justifyContent: 'flex-start', mb: 1 }}
                    onClick={() => setShowAddCustomerDialog(true)}
                    disabled={!activeQueue}
                  >
                    Add Customer
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share />}
                    sx={{ justifyContent: 'flex-start', mb: 1 }}
                    disabled={!activeQueue}
                  >
                    Share Queue
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    sx={{ justifyContent: 'flex-start', mb: 1 }}
                    disabled={!activeQueue}
                  >
                    Copy Queue Link
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{ justifyContent: 'flex-start' }}
                    onClick={() => setShowManageQueueDialog(true)}
                    disabled={!activeQueue}
                  >
                    Edit Queue
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Create Queue Dialog */}
      <Dialog 
        open={showCreateQueueDialog} 
        onClose={() => setShowCreateQueueDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Create New Queue</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Queue Name"
                value={queueForm.name}
                onChange={(e) => setQueueForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Airport Express, City Shuttle"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Pickup Location
                </Typography>
                <Select
                  value={queueForm.location}
                  onChange={(e) => setQueueForm(prev => ({ ...prev, location: e.target.value }))}
                  sx={{ mb: 2 }}
                >
                  {popularLocations.map((location) => (
                    <MenuItem key={location.name} value={location.name}>
                      {location.emoji} {location.name} • {location.area}
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
                  value={queueForm.destination}
                  onChange={(e) => setQueueForm(prev => ({ ...prev, destination: e.target.value }))}
                  sx={{ mb: 2 }}
                >
                  {popularDestinations.map((dest) => (
                    <MenuItem key={dest.name} value={dest.name}>
                      {dest.emoji} {dest.name} • {dest.area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Base Fare (UGX)"
                type="number"
                value={queueForm.baseFare}
                onChange={(e) => setQueueForm(prev => ({ ...prev, baseFare: e.target.value }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Capacity"
                type="number"
                value={queueForm.maxCapacity}
                onChange={(e) => setQueueForm(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vehicle"
                value={queueForm.vehicle}
                onChange={(e) => setQueueForm(prev => ({ ...prev, vehicle: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowCreateQueueDialog(false)}
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
            onClick={handleCreateQueue}
            disabled={!queueForm.name || !queueForm.location || !queueForm.destination}
          >
            Create Queue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog 
        open={showAddCustomerDialog} 
        onClose={() => setShowAddCustomerDialog(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Add Customer to Queue</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Destination"
                value={customerForm.destination}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, destination: e.target.value }))}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fare (UGX)"
                type="number"
                value={customerForm.fare}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, fare: e.target.value }))}
                placeholder={activeQueue?.baseFare.toString()}
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Payment Method
                </Typography>
                <Select
                  value={customerForm.paymentMethod}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  sx={{ mb: 2 }}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {method.icon}
                        {method.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowAddCustomerDialog(false)}
            sx={{ color: '#0025DD' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD'
            }}
            onClick={handleAddCustomer}
            disabled={!customerForm.name || !customerForm.destination}
          >
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: '#0025DD'
          }}
          onClick={() => setShowCreateQueueDialog(true)}
        >
          <Add />
        </Fab>
      )}

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

export default QueueManagementPage;