import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from '@mui/material';
import {
  DeliveryDining,
  LocationOn,
  LocationOff,
  AttachMoney,
  CameraAlt,
  CheckCircle,
  Close,
  Add,
  CloudUpload,
  Draw,
  ArrowForward,
  BarChart,
  ReportProblem,
  FileDownload,
  Share,
  NotificationsNone,
  Search,
  Visibility,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

const SimpleDeliveryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeDelivery, setActiveDelivery] = useState(null);
  const [showNewDeliveryDialog, setShowNewDeliveryDialog] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [deliveryPeriod, setDeliveryPeriod] = useState('daily');

  const [historySearch, setHistorySearch] = useState('');
  const [historyStatus, setHistoryStatus] = useState('all');
  const [historyType, setHistoryType] = useState('all');
  const [historyPayment, setHistoryPayment] = useState('all');
  const [historyRoute, setHistoryRoute] = useState('all');
  const [historyAmountRange, setHistoryAmountRange] = useState([0, 3000]);
  const [historySortBy, setHistorySortBy] = useState('date');
  const [historySortOrder, setHistorySortOrder] = useState('newest');
  const [historyPage, setHistoryPage] = useState(0);
  const historyRowsPerPage = 8;

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
      deliveryId: 'Del-007',
      pickup: 'Mukono',
      dropoff: 'Kampala',
      fee: 2000,
      paymentMethod: 'Cash',
      deliveryType: 'Same Day Delivery',
      durationMin: 12,
      tags: ['Manual Override'],
      recipientName: 'JohnBosco',
      recipientPhone: '+256 7890 988 990',
      descriptionText: 'Package Delivered To Recipient',
      distanceKm: 5.3,
      customer: 'JohnBosco',
      status: 'completed',
      time: '2:02 PM',
      date: '02/12/2025',
      proof: true
    },
    {
      id: 2,
      deliveryId: 'Del-007',
      pickup: 'Gulu',
      dropoff: 'Nabulu',
      fee: 2000,
      paymentMethod: 'Cash',
      deliveryType: 'Same Day Delivery',
      durationMin: 12,
      tags: [],
      recipientName: 'Peter',
      recipientPhone: '+256 7890 988 990',
      descriptionText: 'Delivery Canceled',
      distanceKm: 8.7,
      customer: 'Peter',
      status: 'cancelled',
      time: '2:02 PM',
      date: '02/12/2025',
      proof: false
    },
    {
      id: 3,
      deliveryId: 'Del-007',
      pickup: 'Kampala',
      dropoff: 'Bondo',
      fee: 3000,
      paymentMethod: 'MTN MoMo',
      deliveryType: 'Same Day Delivery',
      durationMin: 14,
      tags: [],
      recipientName: 'Mark',
      recipientPhone: '+256 7890 988 990',
      descriptionText: 'Package Delivered To Recipient',
      distanceKm: 2.2,
      customer: 'Mark',
      status: 'completed',
      time: '1:44 PM',
      date: '02/12/2025',
      proof: true
    },
    {
      id: 4,
      deliveryId: 'Del-007',
      pickup: 'Kireka',
      dropoff: 'Nonda',
      fee: 3000,
      paymentMethod: 'MTN MoMo',
      deliveryType: 'Express',
      durationMin: 30,
      tags: [],
      recipientName: 'Wise',
      recipientPhone: '+256 7890 988 990',
      descriptionText: 'Package Delivered To Recipient',
      distanceKm: 4.5,
      customer: 'Wise',
      status: 'completed',
      time: '12:30 PM',
      date: '02/12/2025',
      proof: true
    },
    {
      id: 5,
      deliveryId: 'Del-007',
      pickup: 'Kireka',
      dropoff: 'Kanda',
      fee: 2000,
      paymentMethod: 'MTN MoMo',
      deliveryType: 'Bulk',
      durationMin: 27,
      tags: [],
      recipientName: 'Wise',
      recipientPhone: '+256 7890 988 990',
      descriptionText: 'Delivery Pending',
      distanceKm: 12.9,
      customer: 'Wise',
      status: 'pending',
      time: '11:47 AM',
      date: '02/12/2025',
      proof: false
    },
    {
      id: 6,
      deliveryId: 'Del-007',
      pickup: 'Kireka',
      dropoff: 'Bondo',
      fee: 2000,
      paymentMethod: 'Cash',
      deliveryType: 'Same Day Delivery',
      durationMin: 47,
      tags: [],
      recipientName: 'Alex',
      recipientPhone: '+256 7890 988 990',
      descriptionText: 'Delivery Canceled',
      distanceKm: 5.3,
      customer: 'Alex',
      status: 'cancelled',
      time: '11:03 AM',
      date: '02/12/2025',
      proof: false
    },
    {
      id: 7,
      deliveryId: 'Del-007',
      pickup: 'Kireka',
      dropoff: 'Nonda',
      fee: 3000,
      paymentMethod: 'Cash',
      deliveryType: 'Express',
      durationMin: 7,
      tags: [],
      recipientName: 'Null',
      recipientPhone: '+256 7890 988 990',
      descriptionText: 'Package Delivered To Recipient',
      distanceKm: 5.3,
      customer: 'Null',
      status: 'completed',
      time: '10:31 AM',
      date: '02/12/2025',
      proof: true
    },
    {
      id: 8,
      deliveryId: 'Del-007',
      pickup: 'Kireka',
      dropoff: 'Nonda',
      fee: 3000,
      paymentMethod: 'Split Pay',
      deliveryType: 'Same Day Delivery',
      durationMin: 7,
      tags: [],
      recipientName: 'Null',
      recipientPhone: '+256 7890 988 990',
      descriptionText: 'Package Delivered To Recipient',
      distanceKm: 5.3,
      customer: 'Null',
      status: 'completed',
      time: '10:05 AM',
      date: '02/12/2025',
      proof: true
    }
  ]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDeliveryId = (d) => {
    if (d?.deliveryId) return d.deliveryId;
    const n = typeof d?.id === 'number' ? d.id : 0;
    return `Del-${String(n).slice(-3).padStart(3, '0')}`;
  };

  const getDeliveryType = (d) => {
    if (d?.deliveryType) return d.deliveryType;
    return d?.fee > 0 ? 'Same Day Delivery' : 'Express';
  };

  const getDurationMin = (d) => {
    if (typeof d?.durationMin === 'number') return d.durationMin;
    return Math.max(7, Math.min(60, Math.round(((d?.distanceKm ?? 0) * 7) + 7)));
  };

  const getPaymentChipSx = (method) => {
    const m = (method || '').toLowerCase();
    if (m.includes('cash')) return { backgroundColor: '#E8FFF0', borderColor: '#22C55E', color: '#166534', fontWeight: 700 };
    if (m.includes('momo') || m.includes('mtn')) return { backgroundColor: '#FFF7D6', borderColor: '#F59E0B', color: '#92400E', fontWeight: 700 };
    if (m.includes('split')) return { backgroundColor: '#EEF2FF', borderColor: '#6366F1', color: '#3730A3', fontWeight: 700 };
    return { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB', color: '#111827', fontWeight: 700 };
  };

  const getStatusChipSx = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'complete') return { backgroundColor: '#E8FFF0', borderColor: '#22C55E', color: '#166534', fontWeight: 800 };
    if (s === 'cancelled' || s === 'canceled') return { backgroundColor: '#FFECEC', borderColor: '#EF4444', color: '#991B1B', fontWeight: 800 };
    if (s === 'pending') return { backgroundColor: '#FFF7D6', borderColor: '#F59E0B', color: '#92400E', fontWeight: 800 };
    return { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB', color: '#111827', fontWeight: 800 };
  };

  const uniqueRoutes = Array.from(
    new Set(
      (deliveryHistory || [])
        .map((d) => `${d?.pickup ?? ''} - ${d?.dropoff ?? ''}`.trim())
        .filter((r) => r && r !== '-')
    )
  );

  const filteredHistory = (deliveryHistory || [])
    .filter((d) => {
      const q = historySearch.trim().toLowerCase();
      if (!q) return true;
      const hay = [
        formatDeliveryId(d),
        d?.recipientName,
        d?.customer,
        d?.recipientPhone,
        d?.pickup,
        d?.dropoff
      ]
        .filter(Boolean)
        .join(' | ')
        .toLowerCase();
      return hay.includes(q);
    })
    .filter((d) => {
      if (historyStatus === 'all') return true;
      return (d?.status || '').toLowerCase() === historyStatus;
    })
    .filter((d) => {
      if (historyType === 'all') return true;
      return getDeliveryType(d) === historyType;
    })
    .filter((d) => {
      if (historyPayment === 'all') return true;
      return (d?.paymentMethod || '').toLowerCase() === historyPayment;
    })
    .filter((d) => {
      if (historyRoute === 'all') return true;
      return `${d?.pickup ?? ''} - ${d?.dropoff ?? ''}` === historyRoute;
    })
    .filter((d) => {
      const fee = Number(d?.fee ?? 0);
      return fee >= historyAmountRange[0] && fee <= historyAmountRange[1];
    })
    .sort((a, b) => {
      const dir = historySortOrder === 'newest' ? -1 : 1;
      if (historySortBy === 'amount') return (Number(a?.fee ?? 0) - Number(b?.fee ?? 0)) * dir;
      if (historySortBy === 'distance') return (Number(a?.distanceKm ?? 0) - Number(b?.distanceKm ?? 0)) * dir;
      return (Number(a?.id ?? 0) - Number(b?.id ?? 0)) * dir;
    });

  const historyTotalPages = Math.max(1, Math.ceil(filteredHistory.length / historyRowsPerPage));
  const historyPageSafe = Math.min(historyPage, historyTotalPages - 1);
  const historyStart = historyPageSafe * historyRowsPerPage;
  const historyEnd = historyStart + historyRowsPerPage;
  const pagedHistory = filteredHistory.slice(historyStart, historyEnd);

  const clearHistoryFilters = () => {
    setHistorySearch('');
    setHistoryStatus('all');
    setHistoryType('all');
    setHistoryPayment('all');
    setHistoryRoute('all');
    setHistoryAmountRange([0, 3000]);
    setHistorySortBy('date');
    setHistorySortOrder('newest');
    setHistoryPage(0);
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
      recipientName: 'Recipient',
      recipientPhone: '+256 000 000 000',
      descriptionText: 'Package Delivery',
      paymentMethod: 'Cash',
      tags: [],
      distanceKm: 0,
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
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', color: '#0025DD' }}>
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
          </Box>
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
      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', color: '#0025DD' }}>
            Delivery Dashboard
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFEC01',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#E6D401' }
            }}
            startIcon={<Add />}
            onClick={() => setShowNewDeliveryDialog(true)}
          >
            Start Delivery
          </Button>
        </Box>

        <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ backgroundColor: '#FFF7A8', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Typography sx={{ fontSize: isMobile ? '1.35rem' : '1.75rem', fontWeight: 'bold', color: '#111827' }}>
              Wallet Balance
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>
                Available Balance
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '1.6rem' : '2.1rem', fontWeight: 900, color: '#111827', lineHeight: 1.1 }}>
                40,000{' '}
                <Typography component="span" sx={{ fontSize: '0.95rem', fontWeight: 800, ml: 0.5 }}>
                  UGX
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            <Divider sx={{ mb: 2, borderColor: '#0025DD20' }} />

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Button
                variant={deliveryPeriod === 'daily' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setDeliveryPeriod('daily')}
                sx={{
                  textTransform: 'none',
                  backgroundColor: deliveryPeriod === 'daily' ? '#0025DD' : 'transparent',
                  borderColor: '#0025DD50',
                  color: deliveryPeriod === 'daily' ? 'white' : '#0025DD',
                  '&:hover': { backgroundColor: deliveryPeriod === 'daily' ? '#001FB8' : '#0025DD10' }
                }}
              >
                Daily
              </Button>
              <Button
                variant={deliveryPeriod === 'weekly' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setDeliveryPeriod('weekly')}
                sx={{
                  textTransform: 'none',
                  backgroundColor: deliveryPeriod === 'weekly' ? '#0025DD' : 'transparent',
                  borderColor: '#0025DD50',
                  color: deliveryPeriod === 'weekly' ? 'white' : '#0025DD',
                  '&:hover': { backgroundColor: deliveryPeriod === 'weekly' ? '#001FB8' : '#0025DD10' }
                }}
              >
                Weekly
              </Button>
              <Button
                variant={deliveryPeriod === 'monthly' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setDeliveryPeriod('monthly')}
                sx={{
                  textTransform: 'none',
                  backgroundColor: deliveryPeriod === 'monthly' ? '#0025DD' : 'transparent',
                  borderColor: '#0025DD50',
                  color: deliveryPeriod === 'monthly' ? 'white' : '#0025DD',
                  '&:hover': { backgroundColor: deliveryPeriod === 'monthly' ? '#001FB8' : '#0025DD10' }
                }}
              >
                Monthly
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ border: '1px solid #0025DD30', borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <DeliveryDining sx={{ color: '#0025DD' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>+12.5%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.85rem', color: '#0025DD', mt: 1 }}>Total Deliveries</Typography>
                    <Typography sx={{ fontSize: '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>125</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ border: '1px solid #0025DD30', borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <BarChart sx={{ color: '#111827' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>+2.5%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.85rem', color: '#0025DD', mt: 1 }}>Total Revenue</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography sx={{ fontSize: '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>40,000</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#0025DD', fontWeight: 900 }}>UGX</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ border: '1px solid #0025DD30', borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <CheckCircle sx={{ color: '#16a34a' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>+20.5%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.85rem', color: '#0025DD', mt: 1 }}>Completed Deliveries</Typography>
                    <Typography sx={{ fontSize: '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>102</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ border: '1px solid #0025DD30', borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <ReportProblem sx={{ color: '#dc2626' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>-2.5%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.85rem', color: '#0025DD', mt: 1 }}>Failed Deliveries</Typography>
                    <Typography sx={{ fontSize: '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>23</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Divider sx={{ my: 4, borderColor: '#0025DD20' }} />

        <Box sx={{ textAlign: 'center', py: isMobile ? 4 : 6 }}>
          <DeliveryDining sx={{ fontSize: isMobile ? 88 : 120, color: '#2D4BFF', mb: 1 }} />
          <Typography sx={{ fontSize: isMobile ? '1.65rem' : '2rem', fontWeight: 900, color: '#2D4BFF' }}>
            Ready to Deliver?
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: '#6b7280', mb: 3 }}>
            Start A New Delivery And Start Earning
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowNewDeliveryDialog(true)}
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#0025DD',
              px: 5,
              py: 1.4,
              borderRadius: 2,
              minWidth: isMobile ? '100%' : 360,
              '&:hover': { backgroundColor: '#001FB8' }
            }}
          >
            Start New Delivery
          </Button>
        </Box>

        <Divider sx={{ my: 4, borderColor: '#0025DD20' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: '1.1rem' }}>Delivery Activity</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#2D4BFF' }}>View Delivery summary</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setShowHistoryDialog(true)}
            sx={{
              backgroundColor: '#FFEC01',
              color: '#000',
              fontWeight: 800,
              '&:hover': { backgroundColor: '#E6D401' },
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            View Delivery History
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {deliveryHistory.slice(0, 2).map((d) => (
            <Paper key={d.id} sx={{ p: 2, mb: 2, backgroundColor: '#F5F9FF', borderRadius: 1.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#2D4BFF', fontWeight: 700 }}>
                    Route(Pickup & Destination)
                  </Typography>
                  <Typography sx={{ color: '#0025DD', fontWeight: 900 }}>
                    {d.pickup}
                  </Typography>
                  <Typography sx={{ color: '#0025DD', fontWeight: 900 }}>
                    {d.dropoff}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Chip label={`${(d.fee ?? 0).toLocaleString()} UGX`} size="small" sx={{ backgroundColor: '#FFEC01', fontWeight: 800 }} />
                    {d.paymentMethod && (
                      <Chip label={d.paymentMethod} size="small" variant="outlined" sx={{ borderColor: '#0025DD60' }} />
                    )}
                    {(d.tags || []).map((t) => (
                      <Chip key={t} label={t} size="small" sx={{ backgroundColor: '#C7F9CC', fontWeight: 700 }} />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#2D4BFF', fontWeight: 700 }}>Recipient</Typography>
                  <Typography sx={{ color: '#0025DD', fontWeight: 900 }}>{d.recipientName || d.customer}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{d.recipientPhone || ''}</Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#2D4BFF', fontWeight: 700 }}>Description</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#1f2937' }}>{d.descriptionText || ''}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>{d.date} • {d.time}</Typography>
                </Grid>

                <Grid item xs={6} md={1}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#2D4BFF', fontWeight: 700 }}>Status</Typography>
                  <Typography sx={{ fontWeight: 900, color: d.status === 'completed' ? '#16a34a' : '#dc2626' }}>
                    {d.status === 'completed' ? 'Complete' : 'Canceled'}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={1}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#2D4BFF', fontWeight: 700 }}>Distance</Typography>
                  <Typography sx={{ fontWeight: 900, color: '#0025DD' }}>
                    {(d.distanceKm ?? 0).toFixed(1)} KM
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      </Box>

      <Dialog
        open={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        fullScreen={isMobile}
        keepMounted
        fullWidth={!isMobile}
        maxWidth={false}
        PaperProps={{
          sx: {
            m: isMobile ? 0 : 3,
            borderRadius: isMobile ? 0 : 2,
            backgroundColor: '#EEF3FF',
            ...(isMobile
              ? {}
              : {
                  width: 'calc(100% - 48px)',
                  maxWidth: 'calc(100% - 48px)',
                  height: 'calc(100vh - 48px)',
                  maxHeight: 'calc(100vh - 48px)',
                  overflow: 'hidden'
                })
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              backgroundColor: '#071A63',
              color: 'white',
              px: isMobile ? 2 : 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Box>
              <Typography sx={{ fontSize: isMobile ? '1.3rem' : '1.7rem', fontWeight: 900, lineHeight: 1.15 }}>
                Delivery History
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', opacity: 0.85 }}>
                Manage and view all your deliveries
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: '#FFF7A8',
                  color: '#111827',
                  fontWeight: 800,
                  '&:hover': { backgroundColor: '#FFEC01' },
                  textTransform: 'none'
                }}
              >
                View Analytics and Performance
              </Button>

              <Button
                variant="text"
                size="small"
                startIcon={<FileDownload sx={{ color: 'white' }} />}
                sx={{ color: 'white', textTransform: 'none', fontWeight: 700 }}
              >
                Export
              </Button>

              <Button
                variant="text"
                size="small"
                startIcon={<Share sx={{ color: 'white' }} />}
                sx={{ color: 'white', textTransform: 'none', fontWeight: 700 }}
              >
                Share
              </Button>

              <IconButton sx={{ color: 'white' }}>
                <NotificationsNone />
              </IconButton>

              <Chip
                label="MK"
                size="small"
                sx={{ backgroundColor: '#FFEC01', color: '#071A63', fontWeight: 900 }}
              />

              <IconButton onClick={() => setShowHistoryDialog(false)} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ flex: 1, p: isMobile ? 2 : 3, overflow: 'hidden' }}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid item xs={12} md={3} sx={{ height: '100%' }}>
                <Paper sx={{ p: 2, borderRadius: 2, height: '100%', overflow: 'auto' }}>
                  <Typography sx={{ fontWeight: 900, color: '#0025DD', mb: 1 }}>
                    Search
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Delivery ID, Phone, Customer..."
                    value={historySearch}
                    onChange={(e) => {
                      setHistorySearch(e.target.value);
                      setHistoryPage(0);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#0025DD' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Typography sx={{ fontWeight: 900, color: '#0025DD', mb: 1 }}>
                    Filters
                  </Typography>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Delivery status</InputLabel>
                    <Select
                      label="Delivery status"
                      value={historyStatus}
                      onChange={(e) => {
                        setHistoryStatus(e.target.value);
                        setHistoryPage(0);
                      }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Delivery Type</InputLabel>
                    <Select
                      label="Delivery Type"
                      value={historyType}
                      onChange={(e) => {
                        setHistoryType(e.target.value);
                        setHistoryPage(0);
                      }}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="Same Day Delivery">Same Day Delivery</MenuItem>
                      <MenuItem value="Express">Express</MenuItem>
                      <MenuItem value="Bulk">Bulk</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      label="Payment Method"
                      value={historyPayment}
                      onChange={(e) => {
                        setHistoryPayment(e.target.value);
                        setHistoryPage(0);
                      }}
                    >
                      <MenuItem value="all">All Methods</MenuItem>
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="mtn momo">MTN MoMo</MenuItem>
                      <MenuItem value="split pay">Split Pay</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Routes</InputLabel>
                    <Select
                      label="Routes"
                      value={historyRoute}
                      onChange={(e) => {
                        setHistoryRoute(e.target.value);
                        setHistoryPage(0);
                      }}
                    >
                      <MenuItem value="all">All Routes</MenuItem>
                      {uniqueRoutes.map((r) => (
                        <MenuItem key={r} value={r}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography sx={{ fontWeight: 800, color: '#0025DD', mb: 1 }}>
                    Amount Range: UGX {historyAmountRange[0].toLocaleString()} - UGX {historyAmountRange[1].toLocaleString()}
                  </Typography>
                  <Slider
                    value={historyAmountRange}
                    onChange={(_, val) => {
                      setHistoryAmountRange(val);
                      setHistoryPage(0);
                    }}
                    valueLabelDisplay="off"
                    min={0}
                    max={3000}
                    sx={{ mb: 2 }}
                  />

                  <Typography sx={{ fontWeight: 900, color: '#0025DD', mb: 1 }}>
                    Sort By
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Field</InputLabel>
                    <Select
                      label="Field"
                      value={historySortBy}
                      onChange={(e) => {
                        setHistorySortBy(e.target.value);
                        setHistoryPage(0);
                      }}
                    >
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="amount">Amount</MenuItem>
                      <MenuItem value="distance">Distance</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Order</InputLabel>
                    <Select
                      label="Order"
                      value={historySortOrder}
                      onChange={(e) => {
                        setHistorySortOrder(e.target.value);
                        setHistoryPage(0);
                      }}
                    >
                      <MenuItem value="newest">Newest</MenuItem>
                      <MenuItem value="oldest">Oldest</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={clearHistoryFilters}
                    sx={{
                      backgroundColor: '#071A63',
                      '&:hover': { backgroundColor: '#06134A' },
                      fontWeight: 900,
                      textTransform: 'none',
                      mt: 1
                    }}
                  >
                    Clear All Filter
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={9} sx={{ height: '100%' }}>
                <Paper sx={{ borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: 'white' }}>
                    <TableContainer>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Delivery ID</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Customer & Contact</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Route Pickup & Dropoff</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Delivery Type</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Distance & Duration</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Payment Method</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0025DD' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pagedHistory.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9}>
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                  <Typography sx={{ fontWeight: 800, color: '#0025DD' }}>No deliveries found</Typography>
                                  <Typography variant="body2" color="text.secondary">Try adjusting your filters</Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ) : (
                            pagedHistory.map((d) => {
                              const deliveryId = formatDeliveryId(d);
                              const customer = d?.recipientName || d?.customer || 'Customer';
                              const contact = d?.recipientPhone || '';
                              const route = `${d?.pickup ?? ''} - ${d?.dropoff ?? ''}`;
                              const type = getDeliveryType(d);
                              const distance = Number(d?.distanceKm ?? 0);
                              const durationMin = getDurationMin(d);
                              const amount = Number(d?.fee ?? 0);
                              const paymentMethod = d?.paymentMethod || 'Cash';
                              const statusRaw = (d?.status || '').toLowerCase();
                              const statusLabel = statusRaw === 'completed' ? 'Completed' : statusRaw === 'cancelled' ? 'Cancelled' : statusRaw === 'pending' ? 'Pending' : (d?.status || '');

                              return (
                                <TableRow key={d.id} hover>
                                  <TableCell>
                                    <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.85rem' }}>{deliveryId}</Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>{d?.date || ''} {d?.time ? `• ${d.time}` : ''}</Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontWeight: 800, color: '#111827', fontSize: '0.85rem' }}>{customer}</Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>{contact}</Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontWeight: 800, color: '#0025DD', fontSize: '0.85rem' }}>{route}</Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontSize: '0.8rem', color: '#2D4BFF', fontWeight: 700 }}>{type}</Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.85rem' }}>{distance.toFixed(1)}km</Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>{durationMin}min</Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.85rem' }}>UGX {amount.toLocaleString()}</Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Chip
                                      label={paymentMethod}
                                      variant="outlined"
                                      size="small"
                                      sx={{ ...getPaymentChipSx(paymentMethod), borderWidth: 1.5 }}
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <Chip
                                      label={statusLabel}
                                      variant="outlined"
                                      size="small"
                                      sx={{ ...getStatusChipSx(statusRaw), borderWidth: 1.5 }}
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <Button
                                      size="small"
                                      startIcon={<Visibility sx={{ fontSize: 18 }} />}
                                      sx={{ textTransform: 'none', fontWeight: 800, color: '#2D4BFF' }}
                                      onClick={() => showSnackbar(`Viewing ${deliveryId}`)}
                                    >
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: '#071A63',
                      color: 'white',
                      px: 2,
                      py: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      flexWrap: 'wrap'
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      Showing {filteredHistory.length} trips
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<ChevronLeft sx={{ color: 'white' }} />}
                        sx={{ color: 'white', textTransform: 'none', fontWeight: 800 }}
                        disabled={historyPageSafe <= 0}
                        onClick={() => setHistoryPage((p) => Math.max(0, p - 1))}
                      >
                        Previous
                      </Button>
                      <Button
                        size="small"
                        endIcon={<ChevronRight sx={{ color: 'white' }} />}
                        sx={{ color: 'white', textTransform: 'none', fontWeight: 800 }}
                        disabled={historyPageSafe >= historyTotalPages - 1}
                        onClick={() => setHistoryPage((p) => Math.min(historyTotalPages - 1, p + 1))}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Dialog>

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