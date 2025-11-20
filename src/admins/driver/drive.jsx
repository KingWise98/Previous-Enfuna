import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Badge,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';
import {
  DirectionsCar,
  LocationOn,
  Payment,
  LocalAtm,
  Smartphone,
  CreditCard,
  QrCode,
  Link,
  Phone,
  Receipt,
  Add,
  Close,
  PlayArrow,
  Stop,
  Speed,
  Schedule,
  Person,
  Money,
  LocalGasStation,
  LocalParking,
  Build,
  Restaurant,
  WifiCalling3,
  MoreHoriz,
  CameraAlt,
  CheckCircle,
  ArrowBack,
  Share,
  WhatsApp,
  Download
} from '@mui/icons-material';

const NewRidePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [rideType, setRideType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showQuickExpense, setShowQuickExpense] = useState(false);
  const [isRideActive, setIsRideActive] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Ride form state
  const [rideForm, setRideForm] = useState({
    pickup: '',
    destination: '',
    fare: '',
    passengerCount: 1,
    notes: ''
  });

  // Quick expense state
  const [expenseForm, setExpenseForm] = useState({
    type: 'fuel',
    amount: '',
    description: '',
    hasReceipt: false
  });

  // Mock data for recent locations
  const recentLocations = [
    { name: 'Entebbe Airport', type: 'airport' },
    { name: 'Kampala City Center', type: 'city' },
    { name: 'Garden City Mall', type: 'mall' },
    { name: 'Makerere University', type: 'university' },
    { name: 'Nakasero Market', type: 'market' }
  ];

  const expenseTypes = [
    { value: 'fuel', label: '⛽ Fuel', icon: <LocalGasStation />, color: 'warning' },
    { value: 'parking', label: '🅿️ Parking', icon: <LocalParking />, color: 'info' },
    { value: 'repairs', label: '🔧 Repairs', icon: <Build />, color: 'error' },
    { value: 'meals', label: '🍔 Meals', icon: <Restaurant />, color: 'success' },
    { value: 'airtime', label: '📞 Airtime', icon: <WifiCalling3 />, color: 'primary' },
    { value: 'other', label: '📦 Other', icon: <MoreHoriz />, color: 'default' }
  ];

  const paymentMethodsList = [
    { value: 'cash', label: 'Cash', icon: <LocalAtm />, color: 'success' },
    { value: 'qr', label: 'QR Code', icon: <QrCode />, color: 'primary' },
    { value: 'mtn', label: 'MTN MoMo', icon: <Smartphone />, color: 'warning' },
    { value: 'airtel', label: 'Airtel Money', icon: <Smartphone />, color: 'error' },
    { value: 'link', label: 'Payment Link', icon: <Link />, color: 'info' },
    { value: 'card', label: 'Card Tap', icon: <CreditCard />, color: 'secondary' },
    { value: 'ussd', label: 'USSD', icon: <Phone />, color: 'default' }
  ];

  const steps = [
    'Ride Details',
    'Payment Method',
    'Confirm & Start'
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStartRide = () => {
    setIsRideActive(true);
    setActiveStep(0);
  };

  const handleEndRide = () => {
    setIsRideActive(false);
    // Show completion dialog or redirect
  };

  const handleQuickExpenseSave = () => {
    // Save expense logic here
    console.log('Expense saved:', expenseForm);
    setShowQuickExpense(false);
    setExpenseForm({
      type: 'fuel',
      amount: '',
      description: '',
      hasReceipt: false
    });
  };

  const handleInputChange = (field) => (event) => {
    setRideForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleExpenseChange = (field) => (event) => {
    setExpenseForm(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  // Active Ride Screen Component
  const ActiveRideScreen = () => (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => setIsRideActive(false)}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            ACTIVE RIDE
          </Typography>
          <Chip 
            icon={<Speed />} 
            label="In Progress" 
            color="success" 
            variant="filled"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Ride Info */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Current Trip
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      From
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {rideForm.pickup}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn color="error" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      To
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {rideForm.destination}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fare
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    UGX {rideForm.fare}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Passengers
                  </Typography>
                  <Typography variant="h6" color="text.primary" fontWeight="bold">
                    {rideForm.passengerCount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Payment
                  </Typography>
                  <Chip 
                    label={paymentMethodsList.find(m => m.value === paymentMethod)?.label}
                    size="small"
                    color="primary"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Started
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => setShowQuickExpense(true)}
                  fullWidth
                >
                  Quick Expense
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Share />}
                  fullWidth
                >
                  Share Status
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Trip Stats */}
          <Card sx={{ mt: 2 }} elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trip Statistics
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Distance"
                    secondary="12.5 km"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Duration"
                    secondary="18 min"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="ETA"
                    secondary="5 min"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // New Ride Form Component
  const NewRideForm = () => (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          New Ride 🚗
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start a new ride and begin earning
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Main Form */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1: Ride Details */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Ride Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Pickup Location"
                        value={rideForm.pickup}
                        onChange={handleInputChange('pickup')}
                        InputProps={{
                          startAdornment: <LocationOn color="primary" sx={{ mr: 1 }} />
                        }}
                        placeholder="Enter pickup address"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Destination"
                        value={rideForm.destination}
                        onChange={handleInputChange('destination')}
                        InputProps={{
                          startAdornment: <LocationOn color="error" sx={{ mr: 1 }} />
                        }}
                        placeholder="Enter destination address"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fare (UGX)"
                        type="number"
                        value={rideForm.fare}
                        onChange={handleInputChange('fare')}
                        InputProps={{
                          startAdornment: <Money color="primary" sx={{ mr: 1 }} />
                        }}
                        placeholder="0"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Passengers</InputLabel>
                        <Select
                          value={rideForm.passengerCount}
                          onChange={handleInputChange('passengerCount')}
                          label="Passengers"
                        >
                          {[1, 2, 3, 4].map(num => (
                            <MenuItem key={num} value={num}>
                              {num} Passenger{num > 1 ? 's' : ''}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes (Optional)"
                        multiline
                        rows={2}
                        value={rideForm.notes}
                        onChange={handleInputChange('notes')}
                        placeholder="Any special instructions..."
                      />
                    </Grid>
                  </Grid>

                  {/* Recent Locations */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Recent Locations
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {recentLocations.map((location, index) => (
                        <Chip
                          key={index}
                          label={location.name}
                          variant="outlined"
                          onClick={() => setRideForm(prev => ({ ...prev, destination: location.name }))}
                          clickable
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Step 2: Payment Method */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>
                  
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Grid container spacing={2}>
                      {paymentMethodsList.map((method) => (
                        <Grid item xs={12} sm={6} key={method.value}>
                          <Paper
                            sx={{
                              p: 2,
                              border: paymentMethod === method.value ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                              borderColor: paymentMethod === method.value ? 'primary.main' : 'divider',
                              borderRadius: 2,
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'action.hover'
                              }
                            }}
                            onClick={() => setPaymentMethod(method.value)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Radio value={method.value} checked={paymentMethod === method.value} />
                              <Box sx={{ color: `${method.color}.main` }}>
                                {method.icon}
                              </Box>
                              <Typography variant="body1" fontWeight="medium">
                                {method.label}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>

                  {/* Payment Method Specific Fields */}
                  {paymentMethod === 'mtn' || paymentMethod === 'airtel' && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Enter {paymentMethod === 'mtn' ? 'MTN' : 'Airtel'} Mobile Number
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="07X XXX XXXX"
                        InputProps={{
                          startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {/* Step 3: Confirm & Start */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Confirm Ride Details
                  </Typography>
                  
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Pickup
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {rideForm.pickup}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Destination
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {rideForm.destination}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Fare
                          </Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            UGX {rideForm.fare}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Payment
                          </Typography>
                          <Chip 
                            label={paymentMethodsList.find(m => m.value === paymentMethod)?.label}
                            color="primary"
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="success.main">
                      ✅ Ready to start your ride! Tap the button below to begin.
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleStartRide}
                    startIcon={<PlayArrow />}
                    disabled={!rideForm.pickup || !rideForm.destination || !rideForm.fare}
                  >
                    Start Ride
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      activeStep === 0 && (!rideForm.pickup || !rideForm.destination || !rideForm.fare)
                    }
                  >
                    Next
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Quick Stats & Actions */}
        <Grid item xs={12} lg={4}>
          {/* Today's Summary */}
          <Card elevation={2} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Rides Completed" secondary="0" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Total Earnings" secondary="UGX 0" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Active Time" secondary="0h 0m" />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Expense Card */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Expense
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Record expenses without interrupting your ride
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setShowQuickExpense(true)}
                fullWidth
              >
                Add Expense
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Quick Expense Dialog
  const QuickExpenseDialog = () => (
    <Dialog 
      open={showQuickExpense} 
      onClose={() => setShowQuickExpense(false)}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            💰 Add Quick Expense
          </Typography>
          <IconButton onClick={() => setShowQuickExpense(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Record an expense without interrupting your current activity
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormLabel component="legend">Expense Type</FormLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {expenseTypes.map((type) => (
                <Chip
                  key={type.value}
                  icon={type.icon}
                  label={type.label.split(' ')[1]} // Remove emoji for label
                  onClick={() => setExpenseForm(prev => ({ ...prev, type: type.value }))}
                  color={expenseForm.type === type.value ? type.color : 'default'}
                  variant={expenseForm.type === type.value ? 'filled' : 'outlined'}
                  clickable
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount (UGX)"
              type="number"
              value={expenseForm.amount}
              onChange={handleExpenseChange('amount')}
              placeholder="0"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description (Optional)"
              value={expenseForm.description}
              onChange={handleExpenseChange('description')}
              placeholder="Brief description of this expense..."
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={expenseForm.hasReceipt}
                  onChange={handleExpenseChange('hasReceipt')}
                />
              }
              label="I have a receipt for this expense"
            />
          </Grid>

          {expenseForm.hasReceipt && (
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<CameraAlt />}
                fullWidth
              >
                Take Photo of Receipt
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setShowQuickExpense(false)}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleQuickExpenseSave}
          disabled={!expenseForm.amount}
          startIcon={<CheckCircle />}
        >
          Save Expense
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      pb: 3
    }}>
      {isRideActive ? <ActiveRideScreen /> : <NewRideForm />}
      <QuickExpenseDialog />
    </Box>
  );
};

export default NewRidePage;