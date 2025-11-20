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
  Divider,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  InputAdornment
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
  Description,
  Add,
  CloudUpload,
  Draw
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
    deliveryFee: ''
  });

  const [proofOptions, setProofOptions] = useState({
    uploadPhoto: false,
    uploadSignature: false
  });

  const [todayStats, setTodayStats] = useState({
    deliveries: 0,
    earnings: 0,
    expenses: 0
  });

  const [deliveryHistory, setDeliveryHistory] = useState([
    {
      id: 1,
      pickup: 'Kollo',
      dropoff: 'Ntinda',
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
    }
  ]);

  const popularLocations = [
    'Kollo',
    'Ntinda', 
    'Garden City Mall',
    'Makerere University',
    'Nakasero Market',
    'Kololo Heights',
    'Industrial Area',
    'Bugolobi'
  ];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field) => (event) => {
    setDeliveryForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleProofOptionChange = (option) => (event) => {
    setProofOptions(prev => ({
      ...prev,
      [option]: event.target.checked
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
      customer: 'Customer',
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      proofOptions: { ...proofOptions }
    };

    setActiveDelivery(newDelivery);
    setShowNewDeliveryDialog(false);
    
    // Reset form
    setDeliveryForm({
      pickupLocation: '',
      dropoffLocation: '',
      deliveryFee: ''
    });

    setProofOptions({
      uploadPhoto: false,
      uploadSignature: false
    });

    showSnackbar('Delivery started!');
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
    
    // Update today's stats
    setTodayStats(prev => ({
      deliveries: prev.deliveries + 1,
      earnings: prev.earnings + activeDelivery.fee,
      expenses: prev.expenses
    }));

    setActiveDelivery(null);
    setShowProofDialog(true);
    showSnackbar('Delivery completed!');
  };

  const handleTakeProofPhoto = () => {
    showSnackbar('Proof captured successfully!');
    setShowProofDialog(false);
  };

  const handleCancelDelivery = () => {
    setActiveDelivery(null);
    showSnackbar('Delivery cancelled');
  };

  // Active Delivery Screen
  if (activeDelivery) {
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
              Deliveries
            </Typography>
            <Chip 
              label="Active Delivery" 
              sx={{ 
                backgroundColor: '#FFEC01', 
                color: '#000',
                fontWeight: 'bold'
              }}
            />
          </Toolbar>
        </AppBar>

        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Grid container spacing={3}>
            {/* Delivery Details */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                    Delivery Details
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ color: '#0025DD', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Pickup Location
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {activeDelivery.pickup}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOff sx={{ color: '#0025DD', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Drop-off Location
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
                      <Typography variant="h5" color="#0025DD" fontWeight="bold">
                        UGX {activeDelivery.fee.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip 
                        label="In Progress" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#FFEC01', 
                          color: '#000',
                          fontWeight: 'bold'
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Proof Requirements */}
                  {(activeDelivery.proofOptions?.uploadPhoto || activeDelivery.proofOptions?.uploadSignature) && (
                    <Paper sx={{ p: 2, mt: 2, backgroundColor: '#0025DD10' }}>
                      <Typography variant="body2" fontWeight="bold" color="#0025DD" gutterBottom>
                        Proof Required:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {activeDelivery.proofOptions.uploadPhoto && (
                          <Chip 
                            icon={<CameraAlt />}
                            label="Photo" 
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                          />
                        )}
                        {activeDelivery.proofOptions.uploadSignature && (
                          <Chip 
                            icon={<Draw />}
                            label="Signature" 
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                          />
                        )}
                      </Box>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ border: `2px solid #0025DD` }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                    Delivery Actions
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#0025DD',
                        '&:hover': {
                          backgroundColor: '#001FB8'
                        }
                      }}
                      size="large"
                      startIcon={<CheckCircle />}
                      onClick={handleCompleteDelivery}
                      fullWidth
                    >
                      Mark As Delivered
                    </Button>
                    
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: '#0025DD',
                        color: '#0025DD'
                      }}
                      size="large"
                      startIcon={<CameraAlt />}
                      onClick={() => setShowProofDialog(true)}
                      fullWidth
                    >
                      Take Proof
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: '#FF4444',
                        color: '#FF4444'
                      }}
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

              {/* Quick Stats */}
              <Card sx={{ mt: 2, border: `1px solid #0025DD20` }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                    Today's Summary
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Deliveries</TableCell>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#0025DD' }}>
                            {todayStats.deliveries}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Earnings</TableCell>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#0025DD' }}>
                            UGX {todayStats.earnings.toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Expenses</TableCell>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#FF4444' }}>
                            UGX {todayStats.expenses.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
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
            Deliveries
          </Typography>
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
            onClick={() => setShowNewDeliveryDialog(true)}
          >
            New Delivery
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Today's Stats & Quick Start */}
          <Grid item xs={12} md={8}>
            {/* Today's Stats Card */}
            <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                  TODAY
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>
                          Deliveries
                        </TableCell>
                        <TableCell sx={{ border: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>
                          Earnings
                        </TableCell>
                        <TableCell sx={{ border: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>
                          Expenses
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#0025DD' }}>
                          {todayStats.deliveries}
                        </TableCell>
                        <TableCell sx={{ border: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#0025DD' }}>
                          UGX {todayStats.earnings.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ border: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#FF4444' }}>
                          UGX {todayStats.expenses.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Quick Start Card */}
            <Card sx={{ border: `2px dashed #0025DD`, backgroundColor: '#0025DD05' }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <DeliveryDining sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom color="#0025DD">
                  Ready for a New Delivery?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Start a new delivery and earn money
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
                  onClick={() => setShowNewDeliveryDialog(true)}
                >
                  New Delivery
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Recent Deliveries */}
          <Grid item xs={12} md={4}>
            <Card sx={{ border: `1px solid #0025DD20` }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
                  Recent Deliveries
                </Typography>
                
                {deliveryHistory.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <DeliveryDining sx={{ fontSize: 40, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No deliveries yet
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {deliveryHistory.map((delivery, index) => (
                      <ListItem 
                        key={delivery.id} 
                        divider={index < deliveryHistory.length - 1}
                        sx={{ px: 0 }}
                      >
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: '#0025DD20', color: '#0025DD' }}>
                            <DeliveryDining />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body2" fontWeight="500">
                                {delivery.pickup} → {delivery.dropoff}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {delivery.time} • UGX {delivery.fee.toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* New Delivery Dialog */}
      <Dialog 
        open={showNewDeliveryDialog} 
        onClose={() => setShowNewDeliveryDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">New Delivery</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD">
                Pickup Location
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter pickup location"
                value={deliveryForm.pickupLocation}
                onChange={handleInputChange('pickupLocation')}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: '#0025DD' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD">
                Drop-off Location
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter drop-off location"
                value={deliveryForm.dropoffLocation}
                onChange={handleInputChange('dropoffLocation')}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOff sx={{ color: '#0025DD' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD">
                Delivery Fee
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter fee"
                type="number"
                value={deliveryForm.deliveryFee}
                onChange={handleInputChange('deliveryFee')}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: '#0025DD' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD">
                Proof Requirements
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={proofOptions.uploadPhoto}
                    onChange={handleProofOptionChange('uploadPhoto')}
                    sx={{ color: '#0025DD' }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUpload />
                    <Typography>Upload Photo</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={proofOptions.uploadSignature}
                    onChange={handleProofOptionChange('uploadSignature')}
                    sx={{ color: '#0025DD' }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Draw />
                    <Typography>Upload Signature</Typography>
                  </Box>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: '#0025DD10', border: '1px solid #0025DD20' }}>
                <Typography variant="body2" fontWeight="bold" color="#0025DD">
                  Parcel Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Standard package delivery service
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowNewDeliveryDialog(false)}
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
            onClick={handleStartDelivery}
            disabled={!deliveryForm.pickupLocation || !deliveryForm.dropoffLocation || !deliveryForm.deliveryFee}
          >
            Save Delivery
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
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Delivery Proof</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CameraAlt sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Take Proof Photo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Capture proof of delivery
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
              border: '2px dashed #0025DD'
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
            sx={{
              backgroundColor: '#0025DD'
            }}
            startIcon={<CameraAlt />}
            onClick={handleTakeProofPhoto}
            size="large"
          >
            Capture Proof
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

export default SimpleDeliveryPage;