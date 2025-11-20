import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import {
  DeliveryDining,
  LocationOn,
  LocationOff,
  AttachMoney,
  CameraAlt,
  Edit,
  CheckCircle,
  Schedule,
  PlayArrow,
  Stop,
  Close,
  Person,
  Phone,
  Description
} from '@mui/icons-material';

const SimpleDeliveryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [showNewDeliveryDialog, setShowNewDeliveryDialog] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [deliveryForm, setDeliveryForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    customerName: '',
    customerPhone: '',
    deliveryFee: '',
    specialInstructions: ''
  });

  const [deliveryHistory, setDeliveryHistory] = useState([
    {
      id: 1,
      pickup: 'Garden City Mall',
      dropoff: 'Makerere University',
      fee: 15000,
      customer: 'Sarah K.',
      status: 'completed',
      time: '2:30 PM',
      date: 'Today',
      proof: true
    },
    {
      id: 2,
      pickup: 'Nakasero Market',
      dropoff: 'Kololo Heights',
      fee: 8000,
      customer: 'John M.',
      status: 'completed',
      time: '11:15 AM',
      date: 'Today',
      proof: true
    },
    {
      id: 3,
      pickup: 'Industrial Area',
      dropoff: 'Bugolobi',
      fee: 12000,
      customer: 'Business Co.',
      status: 'completed',
      time: '9:45 AM',
      date: 'Today',
      proof: false
    }
  ]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field) => (event) => {
    setDeliveryForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleStartDelivery = () => {
    if (!deliveryForm.pickupLocation || !deliveryForm.dropoffLocation || !deliveryForm.deliveryFee) {
      showSnackbar('Please fill in pickup, drop-off locations and delivery fee', 'error');
      return;
    }

    const newDelivery = {
      id: Date.now(),
      pickup: deliveryForm.pickupLocation,
      dropoff: deliveryForm.dropoffLocation,
      fee: parseInt(deliveryForm.deliveryFee),
      customer: deliveryForm.customerName || 'Customer',
      phone: deliveryForm.customerPhone,
      instructions: deliveryForm.specialInstructions,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active'
    };

    setActiveDelivery(newDelivery);
    setShowNewDeliveryDialog(false);
    
    // Reset form
    setDeliveryForm({
      pickupLocation: '',
      dropoffLocation: '',
      customerName: '',
      customerPhone: '',
      deliveryFee: '',
      specialInstructions: ''
    });

    showSnackbar('Delivery started! Good luck with the delivery.');
  };

  const handleCompleteDelivery = () => {
    if (!activeDelivery) return;

    const completedDelivery = {
      ...activeDelivery,
      id: Date.now(),
      status: 'completed',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      proof: true
    };

    setDeliveryHistory(prev => [completedDelivery, ...prev]);
    setActiveDelivery(null);
    setShowProofDialog(true);
    showSnackbar('Delivery completed! Please take proof photo.');
  };

  const handleTakeProofPhoto = () => {
    showSnackbar('Proof photo captured successfully!');
    setShowProofDialog(false);
  };

  const handleCancelDelivery = () => {
    setActiveDelivery(null);
    showSnackbar('Delivery cancelled');
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? <CheckCircle color="success" /> : <Schedule color="warning" />;
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'success' : 'warning';
  };

  // Active Delivery Screen
  if (activeDelivery) {
    return (
      <Box sx={{ p: isMobile ? 2 : 3, minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            🚚 Active Delivery
          </Typography>
          <Chip 
            icon={<DeliveryDining />} 
            label="Delivery in Progress" 
            color="success" 
            variant="filled"
          />
        </Box>

        <Grid container spacing={3}>
          {/* Delivery Details */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Delivery Details
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pickup From
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {activeDelivery.pickup}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOff color="error" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Deliver To
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {activeDelivery.dropoff}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Fee
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      UGX {activeDelivery.fee.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Customer
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {activeDelivery.customer}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Started
                    </Typography>
                    <Typography variant="body2">
                      {activeDelivery.startTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip label="In Progress" size="small" color="warning" />
                  </Grid>
                </Grid>

                {activeDelivery.instructions && (
                  <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.50' }}>
                    <Typography variant="body2" fontWeight="bold">
                      Special Instructions:
                    </Typography>
                    <Typography variant="body2">
                      {activeDelivery.instructions}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Delivery Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CheckCircle />}
                    onClick={handleCompleteDelivery}
                    fullWidth
                  >
                    Complete Delivery
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<CameraAlt />}
                    onClick={() => setShowProofDialog(true)}
                    fullWidth
                  >
                    Take Proof Photo
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<Close />}
                    onClick={handleCancelDelivery}
                    fullWidth
                  >
                    Cancel Delivery
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card sx={{ mt: 2 }} elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Info
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Distance"
                      secondary="8.2 km"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="ETA"
                      secondary="25 minutes"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Customer Phone"
                      secondary={activeDelivery.phone || 'Not provided'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Main Delivery Page
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
              Deliveries 🚚
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
            Package Deliveries
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your delivery requests and track packages
          </Typography>
        </Box>

        {/* Big Start Button */}
        <Card sx={{ mb: 4, backgroundColor: 'primary.50', border: '2px dashed', borderColor: 'primary.main' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <DeliveryDining sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ready for a New Delivery?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start a new delivery and earn money
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => setShowNewDeliveryDialog(true)}
              sx={{ px: 4 }}
            >
              Start New Delivery
            </Button>
          </CardContent>
        </Card>

        {/* Delivery History */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Deliveries
            </Typography>
            
            {deliveryHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <DeliveryDining sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No deliveries yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start your first delivery to see history here
                </Typography>
              </Box>
            ) : (
              <List>
                {deliveryHistory.map((delivery, index) => (
                  <ListItem 
                    key={delivery.id} 
                    divider={index < deliveryHistory.length - 1}
                    sx={{ px: isMobile ? 0 : 2 }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.100' }}>
                        <DeliveryDining color="primary" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight="500">
                              {delivery.pickup} → {delivery.dropoff}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {delivery.customer} • {delivery.time}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', ml: 2 }}>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              UGX {delivery.fee.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip 
                                icon={getStatusIcon(delivery.status)}
                                label={delivery.status}
                                size="small"
                                color={getStatusColor(delivery.status)}
                              />
                              {delivery.proof && (
                                <CameraAlt color="info" fontSize="small" />
                              )}
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

      {/* New Delivery Dialog */}
      <Dialog 
        open={showNewDeliveryDialog} 
        onClose={() => setShowNewDeliveryDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6">New Delivery Request</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pickup Location"
                value={deliveryForm.pickupLocation}
                onChange={handleInputChange('pickupLocation')}
                placeholder="Where to pick up the package?"
                InputProps={{
                  startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Drop-off Location"
                value={deliveryForm.dropoffLocation}
                onChange={handleInputChange('dropoffLocation')}
                placeholder="Where to deliver the package?"
                InputProps={{
                  startAdornment: <LocationOff color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name (Optional)"
                value={deliveryForm.customerName}
                onChange={handleInputChange('customerName')}
                InputProps={{
                  startAdornment: <Person color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Phone (Optional)"
                value={deliveryForm.customerPhone}
                onChange={handleInputChange('customerPhone')}
                placeholder="256712345678"
                InputProps={{
                  startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Fee (UGX)"
                type="number"
                value={deliveryForm.deliveryFee}
                onChange={handleInputChange('deliveryFee')}
                placeholder="0"
                InputProps={{
                  startAdornment: <AttachMoney color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Instructions (Optional)"
                multiline
                rows={3}
                value={deliveryForm.specialInstructions}
                onChange={handleInputChange('specialInstructions')}
                placeholder="Any special delivery instructions..."
                InputProps={{
                  startAdornment: <Description color="action" sx={{ mr: 1, mt: -4 }} />
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewDeliveryDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleStartDelivery}
            startIcon={<PlayArrow />}
          >
            Start Delivery
          </Button>
        </DialogActions>
      </Dialog>

      {/* Proof Photo Dialog */}
      <Dialog 
        open={showProofDialog} 
        onClose={() => setShowProofDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Delivery Proof</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CameraAlt sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Take Proof Photo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Take a photo of the delivered package as proof of delivery
          </Typography>
          
          <Box 
            sx={{ 
              width: 200, 
              height: 150, 
              bgcolor: 'grey.200', 
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              border: '2px dashed grey'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Camera Preview
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            startIcon={<CameraAlt />}
            onClick={handleTakeProofPhoto}
            size="large"
          >
            Capture Photo
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

export default SimpleDeliveryPage;