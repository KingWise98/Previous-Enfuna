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
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Drawer,
  AppBar,
  Toolbar
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
  ArrowForward,
  BarChart,
  ReportProblem,
  FileDownload,
  Search,
  ChevronLeft,
  ChevronRight,
  QrCode,
  AccountBalanceWallet,
  CreditCard,
  Menu as MenuIcon,
  FilterList
} from '@mui/icons-material';

const SimpleDeliveryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeDelivery, setActiveDelivery] = useState(null);
  const [showNewDeliveryDialog, setShowNewDeliveryDialog] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
  const historyRowsPerPage = isMobile ? 5 : 8;

  const [deliveryForm, setDeliveryForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    deliveryFee: '',
    paymentMethod: 'cash'
  });

  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [splitPayment, setSplitPayment] = useState({ cash: 0, digital: 0 });
  const [splitMethod, setSplitMethod] = useState("momo");
  const [showQR, setShowQR] = useState(false);

  const [proofOptions, setProofOptions] = useState({
    uploadPhoto: false
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
      tags: ['Manual Override'],
      recipientName: 'JohnBosco',
      descriptionText: 'Package Delivered To Recipient',
      customer: 'JohnBosco',
      status: 'completed',
      time: '2:02 PM',
      date: '02/12/2025',
      proof: true
    },
    {
      id: 2,
      deliveryId: 'Del-008',
      pickup: 'Gulu',
      dropoff: 'Nabulu',
      fee: 2000,
      paymentMethod: 'Cash',
      tags: [],
      recipientName: 'Peter',
      descriptionText: 'Delivery Canceled',
      customer: 'Peter',
      status: 'cancelled',
      time: '2:02 PM',
      date: '02/12/2025',
      proof: false
    },
    {
      id: 3,
      deliveryId: 'Del-009',
      pickup: 'Kampala',
      dropoff: 'Bondo',
      fee: 3000,
      paymentMethod: 'MTN MoMo',
      tags: [],
      recipientName: 'Mark',
      descriptionText: 'Package Delivered To Recipient',
      customer: 'Mark',
      status: 'completed',
      time: '1:44 PM',
      date: '02/12/2025',
      proof: true
    },
    {
      id: 4,
      deliveryId: 'Del-010',
      pickup: 'Kireka',
      dropoff: 'Nonda',
      fee: 3000,
      paymentMethod: 'MTN MoMo',
      tags: [],
      recipientName: 'Wise',
      descriptionText: 'Package Delivered To Recipient',
      customer: 'Wise',
      status: 'completed',
      time: '12:30 PM',
      date: '02/12/2025',
      proof: true
    },
    {
      id: 5,
      deliveryId: 'Del-011',
      pickup: 'Kireka',
      dropoff: 'Kanda',
      fee: 2000,
      paymentMethod: 'MTN MoMo',
      tags: [],
      recipientName: 'Wise',
      descriptionText: 'Delivery Pending',
      customer: 'Wise',
      status: 'pending',
      time: '11:47 AM',
      date: '02/12/2025',
      proof: false
    },
    {
      id: 6,
      deliveryId: 'Del-012',
      pickup: 'Kireka',
      dropoff: 'Bondo',
      fee: 2000,
      paymentMethod: 'Cash',
      tags: [],
      recipientName: 'Alex',
      descriptionText: 'Delivery Canceled',
      customer: 'Alex',
      status: 'cancelled',
      time: '11:03 AM',
      date: '02/12/2025',
      proof: false
    },
    {
      id: 7,
      deliveryId: 'Del-013',
      pickup: 'Kireka',
      dropoff: 'Nonda',
      fee: 3000,
      paymentMethod: 'Cash',
      tags: [],
      recipientName: 'Null',
      descriptionText: 'Package Delivered To Recipient',
      customer: 'Null',
      status: 'completed',
      time: '10:31 AM',
      date: '02/12/2025',
      proof: true
    },
    {
      id: 8,
      deliveryId: 'Del-014',
      pickup: 'Kireka',
      dropoff: 'Nonda',
      fee: 3000,
      paymentMethod: 'Split Pay',
      tags: [],
      recipientName: 'Null',
      descriptionText: 'Package Delivered To Recipient',
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
      return true;
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
      paymentMethod: deliveryForm.paymentMethod === 'split' ? 'Split Pay' : 
                    deliveryForm.paymentMethod === 'momo' ? 'MTN MoMo' :
                    deliveryForm.paymentMethod === 'airtel' ? 'Airtel Money' :
                    deliveryForm.paymentMethod === 'qr' ? 'QR Code' : 'Cash',
      customer: 'Customer',
      recipientName: 'Recipient',
      descriptionText: 'Package Delivery',
      tags: [],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      proofOptions: { ...proofOptions }
    };

    setActiveDelivery(newDelivery);
    setShowNewDeliveryDialog(false);
    
    setDeliveryForm({
      pickupLocation: '',
      dropoffLocation: '',
      deliveryFee: '',
      paymentMethod: 'cash'
    });

    setProofOptions({
      uploadPhoto: false
    });

    showSnackbar('Delivery started!');
  };

  const handleCompleteDelivery = () => {
    if (!activeDelivery) return;

    setPaymentAmount(activeDelivery.fee);
    setShowPaymentModal(true);
  };

  const handlePaymentContinue = () => {
    if (!selectedPaymentMethod) {
      showSnackbar("Please select a payment method", 'error');
      return;
    }
    
    if (selectedPaymentMethod === "split" && (splitPayment.cash <= 0 || splitPayment.digital <= 0)) {
      showSnackbar("Please enter both cash and digital amounts for split payment", 'error');
      return;
    }

    const completedDelivery = {
      ...activeDelivery,
      id: Date.now(),
      status: 'completed',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      proof: true
    };

    setDeliveryHistory(prev => [completedDelivery, ...prev]);
    
    setTodayStats(prev => ({
      deliveries: prev.deliveries + 1,
      earnings: prev.earnings + activeDelivery.fee,
      expenses: prev.expenses
    }));

    setActiveDelivery(null);
    setShowPaymentModal(false);
    setShowProofDialog(true);
    showSnackbar('Delivery completed and payment received!');
  };

  const handleSplitPaymentUpdate = () => {
    const total = paymentAmount;
    if (splitPayment.cash + splitPayment.digital !== total) {
      const remaining = total - splitPayment.cash;
      setSplitPayment({ ...splitPayment, digital: remaining > 0 ? remaining : 0 });
    }
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
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
          <Grid container spacing={2}>
            {/* Delivery Details */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom color="#0025DD">
                    Delivery Details
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocationOn sx={{ color: '#0025DD', mr: 1, mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Pickup Location
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {activeDelivery.pickup}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocationOff sx={{ color: '#0025DD', mr: 1, mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Drop-off Location
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {activeDelivery.dropoff}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Delivery Fee
                      </Typography>
                      <Typography variant={isMobile ? "h6" : "h5"} color="#0025DD" fontWeight="bold">
                        UGX {activeDelivery.fee.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
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

                  {activeDelivery.proofOptions?.uploadPhoto && (
                    <Paper sx={{ p: 2, mt: 2, backgroundColor: '#0025DD10' }}>
                      <Typography variant="caption" fontWeight="bold" color="#0025DD" gutterBottom>
                        Proof Required:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<CameraAlt />}
                          label="Photo" 
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                        />
                      </Box>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ border: `2px solid #0025DD` }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom color="#0025DD">
                    Delivery Actions
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#0025DD',
                        '&:hover': {
                          backgroundColor: '#001FB8'
                        }
                      }}
                      size={isMobile ? "medium" : "large"}
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
                      size={isMobile ? "medium" : "large"}
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
                      size={isMobile ? "medium" : "large"}
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
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom color="#0025DD">
                    Today's Summary
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', p: 1 }}>Deliveries</TableCell>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#0025DD', p: 1 }}>
                            {todayStats.deliveries}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', p: 1 }}>Earnings</TableCell>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#0025DD', p: 1 }}>
                            UGX {todayStats.earnings.toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', p: 1 }}>Expenses</TableCell>
                          <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#FF4444', p: 1 }}>
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
      <Box sx={{ p: isMobile ? 1.5 : 3 }}>
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
              fontSize: isMobile ? '0.875rem' : '1rem',
              minWidth: isMobile ? 'auto' : '140px',
              px: isMobile ? 2 : 3,
              py: isMobile ? 0.5 : 1
            }}
            startIcon={<Add />}
            onClick={() => setShowNewDeliveryDialog(true)}
          >
            {isMobile ? 'Start' : 'Start Delivery'}
          </Button>
        </Box>

        <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ backgroundColor: '#FFF7A8', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: isMobile ? '1rem' : '1.35rem', fontWeight: 'bold', color: '#111827' }}>
              Wallet Balance
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                Available Balance
              </Typography>
              <Typography sx={{ fontSize: isMobile ? '1.2rem' : '1.6rem', fontWeight: 900, color: '#111827', lineHeight: 1.1 }}>
                40,000{' '}
                <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 800, ml: 0.5 }}>
                  UGX
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: isMobile ? 1.5 : 2 }}>
            <Divider sx={{ mb: 2, borderColor: '#0025DD20' }} />

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Button
                variant={deliveryPeriod === 'daily' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setDeliveryPeriod('daily')}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
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
                  fontSize: '0.75rem',
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
                  fontSize: '0.75rem',
                  backgroundColor: deliveryPeriod === 'monthly' ? '#0025DD' : 'transparent',
                  borderColor: '#0025DD50',
                  color: deliveryPeriod === 'monthly' ? 'white' : '#0025DD',
                  '&:hover': { backgroundColor: deliveryPeriod === 'monthly' ? '#001FB8' : '#0025DD10' }
                }}
              >
                Monthly
              </Button>
            </Box>

            <Grid container spacing={isMobile ? 1.5 : 2}>
              <Grid item xs={6} sm={6} md={3}>
                <Card sx={{ border: '1px solid #0025DD30', borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <DeliveryDining sx={{ color: '#0025DD', fontSize: isMobile ? 20 : 24 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>+12.5%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0025DD', mt: 1 }}>Total Deliveries</Typography>
                    <Typography sx={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>125</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <Card sx={{ border: '1px solid #0025DD30', borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <BarChart sx={{ color: '#111827', fontSize: isMobile ? 20 : 24 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>+2.5%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0025DD', mt: 1 }}>Total Revenue</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography sx={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>40,000</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: '#0025DD', fontWeight: 900 }}>UGX</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <Card sx={{ border: '1px solid #0025DD30', borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <CheckCircle sx={{ color: '#16a34a', fontSize: isMobile ? 20 : 24 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>+20.5%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0025DD', mt: 1 }}>Completed</Typography>
                    <Typography sx={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>102</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <Card sx={{ border: '1px solid #0025DD30', borderRadius: 2, boxShadow: 'none' }}>
                  <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <ReportProblem sx={{ color: '#dc2626', fontSize: isMobile ? 20 : 24 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700 }}>-2.5%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#0025DD', mt: 1 }}>Failed</Typography>
                    <Typography sx={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>23</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Divider sx={{ my: 3, borderColor: '#0025DD20' }} />

        <Box sx={{ textAlign: 'center', py: isMobile ? 3 : 6 }}>
          <DeliveryDining sx={{ fontSize: isMobile ? 64 : 120, color: '#2D4BFF', mb: 1 }} />
          <Typography sx={{ fontSize: isMobile ? '1.25rem' : '2rem', fontWeight: 900, color: '#2D4BFF' }}>
            Ready to Deliver?
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#6b7280', mb: 3, px: isMobile ? 2 : 0 }}>
            Start A New Delivery And Start Earning
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowNewDeliveryDialog(true)}
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#0025DD',
              px: isMobile ? 3 : 5,
              py: isMobile ? 1 : 1.4,
              borderRadius: 2,
              minWidth: isMobile ? '100%' : 360,
              fontSize: isMobile ? '0.875rem' : '1rem',
              '&:hover': { backgroundColor: '#001FB8' }
            }}
          >
            Start New Delivery
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: '#0025DD20' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: isMobile ? '1rem' : '1.1rem' }}>Delivery Activity</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#2D4BFF' }}>View Delivery summary</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setShowHistoryDialog(true)}
            sx={{
              backgroundColor: '#FFEC01',
              color: '#000',
              fontWeight: 800,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              '&:hover': { backgroundColor: '#E6D401' },
              borderRadius: 1,
              textTransform: 'none',
              px: isMobile ? 2 : 3,
              py: isMobile ? 0.5 : 0.75
            }}
          >
            View History
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {deliveryHistory.slice(0, isMobile ? 1 : 2).map((d) => (
            <Paper key={d.id} sx={{ p: 2, mb: 2, backgroundColor: '#F5F9FF', borderRadius: 1.5 }}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>
                    Route
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: '#0025DD', fontWeight: 900 }}>
                    {d.pickup} → {d.dropoff}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                    <Chip 
                      label={`${(d.fee ?? 0).toLocaleString()} UGX`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#FFEC01', 
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        height: '24px'
                      }} 
                    />
                    {d.paymentMethod && (
                      <Chip 
                        label={d.paymentMethod} 
                        size="small" 
                        variant="outlined" 
                        sx={{ 
                          borderColor: '#0025DD60',
                          fontSize: '0.7rem',
                          height: '24px'
                        }} 
                      />
                    )}
                    {(d.tags || []).map((t) => (
                      <Chip 
                        key={t} 
                        label={t} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#C7F9CC', 
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: '24px'
                        }} 
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>Recipient</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: '#0025DD', fontWeight: 900 }}>{d.recipientName || d.customer}</Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>Description</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#1f2937' }}>{d.descriptionText || ''}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#6b7280' }}>{d.date} • {d.time}</Typography>
                </Grid>

                <Grid item xs={6} md={1}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>Status</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: d.status === 'completed' ? '#16a34a' : '#dc2626' }}>
                    {d.status === 'completed' ? 'Complete' : 'Canceled'}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={1}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>Amount</Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: '#0025DD' }}>
                    UGX {(d.fee ?? 0).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={showMobileFilters && isMobile}
        onClose={() => setShowMobileFilters(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85vw',
            maxWidth: 320,
            p: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="#0025DD">
            Filters
          </Typography>
          <IconButton onClick={() => setShowMobileFilters(false)}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ overflow: 'auto', height: 'calc(100vh - 120px)' }}>
          <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 900, color: '#0025DD', mb: 1, fontSize: '0.9rem' }}>
              Search
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Delivery ID, Customer..."
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

            <Typography sx={{ fontWeight: 900, color: '#0025DD', mb: 1, fontSize: '0.9rem' }}>
              Filters
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ fontSize: '0.875rem' }}>Delivery status</InputLabel>
              <Select
                label="Delivery status"
                value={historyStatus}
                onChange={(e) => {
                  setHistoryStatus(e.target.value);
                  setHistoryPage(0);
                }}
                sx={{ fontSize: '0.875rem' }}
              >
                <MenuItem value="all" sx={{ fontSize: '0.875rem' }}>All Status</MenuItem>
                <MenuItem value="completed" sx={{ fontSize: '0.875rem' }}>Completed</MenuItem>
                <MenuItem value="cancelled" sx={{ fontSize: '0.875rem' }}>Cancelled</MenuItem>
                <MenuItem value="pending" sx={{ fontSize: '0.875rem' }}>Pending</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ fontSize: '0.875rem' }}>Payment Method</InputLabel>
              <Select
                label="Payment Method"
                value={historyPayment}
                onChange={(e) => {
                  setHistoryPayment(e.target.value);
                  setHistoryPage(0);
                }}
                sx={{ fontSize: '0.875rem' }}
              >
                <MenuItem value="all" sx={{ fontSize: '0.875rem' }}>All Methods</MenuItem>
                <MenuItem value="cash" sx={{ fontSize: '0.875rem' }}>Cash</MenuItem>
                <MenuItem value="mtn momo" sx={{ fontSize: '0.875rem' }}>MTN MoMo</MenuItem>
                <MenuItem value="split pay" sx={{ fontSize: '0.875rem' }}>Split Pay</MenuItem>
              </Select>
            </FormControl>

            <Typography sx={{ fontWeight: 800, color: '#0025DD', mb: 1, fontSize: '0.9rem' }}>
              Amount Range: UGX {historyAmountRange[0].toLocaleString()} - UGX {historyAmountRange[1].toLocaleString()}
            </Typography>
            <Slider
              value={historyAmountRange}
              onChange={(_, val) => {
                setHistoryAmountRange(val);
                setHistoryPage(0);
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `UGX ${value}`}
              min={0}
              max={3000}
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                clearHistoryFilters();
                setShowMobileFilters(false);
              }}
              sx={{
                backgroundColor: '#071A63',
                '&:hover': { backgroundColor: '#06134A' },
                fontWeight: 900,
                textTransform: 'none',
                mt: 1,
                py: 1
              }}
            >
              Clear All Filters
            </Button>
          </Paper>
        </Box>
      </Drawer>

      {/* Delivery History Dialog */}
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
              <Typography sx={{ fontSize: isMobile ? '1.1rem' : '1.7rem', fontWeight: 900, lineHeight: 1.15 }}>
                Delivery History
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', opacity: 0.85 }}>
                Manage and view all your deliveries
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {isMobile && (
                <IconButton 
                  onClick={() => setShowMobileFilters(true)}
                  sx={{ color: 'white' }}
                >
                  <FilterList />
                </IconButton>
              )}
              <Button
                variant="text"
                size="small"
                startIcon={<FileDownload sx={{ color: 'white' }} />}
                sx={{ 
                  color: 'white', 
                  textTransform: 'none', 
                  fontWeight: 700,
                  fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}
              >
                Export
              </Button>

              <Chip
                label="MK"
                size="small"
                sx={{ 
                  backgroundColor: '#FFEC01', 
                  color: '#071A63', 
                  fontWeight: 900,
                  fontSize: '0.75rem'
                }}
              />

              <IconButton 
                onClick={() => setShowHistoryDialog(false)} 
                sx={{ color: 'white' }}
                size={isMobile ? "small" : "medium"}
              >
                <Close fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ flex: 1, p: isMobile ? 1.5 : 3, overflow: 'hidden' }}>
            {!isMobile ? (
              <Grid container spacing={3} sx={{ height: '100%' }}>
                <Grid item xs={12} md={3} sx={{ height: '100%' }}>
                  <Paper sx={{ p: 2, borderRadius: 2, height: '100%', overflow: 'auto' }}>
                    <Typography sx={{ fontWeight: 900, color: '#0025DD', mb: 1 }}>
                      Search
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Delivery ID, Customer, Location..."
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
                              <TableCell sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.875rem' }}>Delivery ID</TableCell>
                              <TableCell sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.875rem' }}>Route</TableCell>
                              <TableCell sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.875rem' }}>Amount</TableCell>
                              <TableCell sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.875rem' }}>Payment</TableCell>
                              <TableCell sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.875rem' }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pagedHistory.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5}>
                                  <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Typography sx={{ fontWeight: 800, color: '#0025DD' }}>No deliveries found</Typography>
                                    <Typography variant="body2" color="text.secondary">Try adjusting your filters</Typography>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ) : (
                              pagedHistory.map((d) => {
                                const deliveryId = formatDeliveryId(d);
                                const route = `${d?.pickup ?? ''} - ${d?.dropoff ?? ''}`;
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
                                      <Typography sx={{ fontWeight: 800, color: '#0025DD', fontSize: '0.85rem' }}>{route}</Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.85rem' }}>UGX {amount.toLocaleString()}</Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Chip
                                        label={paymentMethod}
                                        variant="outlined"
                                        size="small"
                                        sx={{ ...getPaymentChipSx(paymentMethod), borderWidth: 1.5, fontSize: '0.75rem' }}
                                      />
                                    </TableCell>

                                    <TableCell>
                                      <Chip
                                        label={statusLabel}
                                        variant="outlined"
                                        size="small"
                                        sx={{ ...getStatusChipSx(statusRaw), borderWidth: 1.5, fontSize: '0.75rem' }}
                                      />
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
                        Showing {filteredHistory.length} deliveries
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<ChevronLeft sx={{ color: 'white' }} />}
                          sx={{ color: 'white', textTransform: 'none', fontWeight: 800, fontSize: '0.75rem' }}
                          disabled={historyPageSafe <= 0}
                          onClick={() => setHistoryPage((p) => Math.max(0, p - 1))}
                        >
                          Previous
                        </Button>
                        <Button
                          size="small"
                          endIcon={<ChevronRight sx={{ color: 'white' }} />}
                          sx={{ color: 'white', textTransform: 'none', fontWeight: 800, fontSize: '0.75rem' }}
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
            ) : (
              // Mobile View
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Search Bar for Mobile */}
                <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search deliveries..."
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
                    />
                    <Button
                      variant="outlined"
                      onClick={() => setShowMobileFilters(true)}
                      sx={{
                        borderColor: '#0025DD',
                        color: '#0025DD',
                        minWidth: 'auto',
                        px: 2
                      }}
                    >
                      <FilterList />
                    </Button>
                  </Box>
                </Paper>

                {/* Mobile Delivery Cards */}
                <Box sx={{ flex: 1, overflow: 'auto', pb: 2 }}>
                  {pagedHistory.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                      <Typography sx={{ fontWeight: 800, color: '#0025DD', mb: 1 }}>No deliveries found</Typography>
                      <Typography variant="body2" color="text.secondary">Try adjusting your filters</Typography>
                    </Paper>
                  ) : (
                    pagedHistory.map((d) => {
                      const deliveryId = formatDeliveryId(d);
                      const route = `${d?.pickup ?? ''} - ${d?.dropoff ?? ''}`;
                      const amount = Number(d?.fee ?? 0);
                      const paymentMethod = d?.paymentMethod || 'Cash';
                      const statusRaw = (d?.status || '').toLowerCase();
                      const statusLabel = statusRaw === 'completed' ? 'Completed' : statusRaw === 'cancelled' ? 'Cancelled' : statusRaw === 'pending' ? 'Pending' : (d?.status || '');

                      return (
                        <Paper key={d.id} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: 'white' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.9rem' }}>{deliveryId}</Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>{d?.date || ''} {d?.time ? `• ${d.time}` : ''}</Typography>
                            </Box>
                            <Chip
                              label={statusLabel}
                              size="small"
                              sx={{ 
                                ...getStatusChipSx(statusRaw), 
                                borderWidth: 1.5, 
                                fontSize: '0.65rem',
                                height: '24px'
                              }}
                            />
                          </Box>

                          <Typography sx={{ fontWeight: 800, color: '#0025DD', fontSize: '0.85rem', mb: 1 }}>
                            {route}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Box>
                              <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: '0.9rem' }}>
                                UGX {amount.toLocaleString()}
                              </Typography>
                              <Chip
                                label={paymentMethod}
                                size="small"
                                sx={{ 
                                  ...getPaymentChipSx(paymentMethod), 
                                  borderWidth: 1.5, 
                                  fontSize: '0.65rem',
                                  height: '20px',
                                  mt: 0.5
                                }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })
                  )}
                </Box>

                {/* Mobile Pagination */}
                <Paper sx={{ mt: 'auto', borderRadius: 2, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      backgroundColor: '#071A63',
                      color: 'white',
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      Page {historyPageSafe + 1} of {historyTotalPages}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{ color: 'white' }}
                        disabled={historyPageSafe <= 0}
                        onClick={() => setHistoryPage((p) => Math.max(0, p - 1))}
                      >
                        <ChevronLeft />
                      </IconButton>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                        {historyStart + 1}-{Math.min(historyEnd, filteredHistory.length)} of {filteredHistory.length}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: 'white' }}
                        disabled={historyPageSafe >= historyTotalPages - 1}
                        onClick={() => setHistoryPage((p) => Math.min(historyTotalPages - 1, p + 1))}
                      >
                        <ChevronRight />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
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
        PaperProps={{
          sx: {
            m: isMobile ? 0 : 2,
            borderRadius: isMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#0025DD', 
          color: 'white',
          py: isMobile ? 2 : 3
        }}>
          <Typography variant={isMobile ? "h6" : "h6"} fontWeight="bold">New Delivery</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                Pickup Location
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter pickup location"
                value={deliveryForm.pickupLocation}
                onChange={handleInputChange('pickupLocation')}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: '#0025DD', fontSize: isMobile ? 20 : 24 }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                Drop-off Location
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter drop-off location"
                value={deliveryForm.dropoffLocation}
                onChange={handleInputChange('dropoffLocation')}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOff sx={{ color: '#0025DD', fontSize: isMobile ? 20 : 24 }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                Delivery Fee
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter fee"
                type="number"
                value={deliveryForm.deliveryFee}
                onChange={handleInputChange('deliveryFee')}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: '#0025DD', fontSize: isMobile ? 20 : 24 }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                Payment Method
              </Typography>
              <ToggleButtonGroup
                value={deliveryForm.paymentMethod}
                exclusive
                onChange={(e, value) => {
                  if (value) setDeliveryForm(prev => ({ ...prev, paymentMethod: value }));
                }}
                fullWidth
                orientation={isMobile ? "vertical" : "horizontal"}
                sx={{ 
                  mb: 2,
                  '& .MuiToggleButtonGroup-grouped': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }
                }}
              >
                <ToggleButton value="cash" sx={{ textTransform: 'none' }}>
                  <AccountBalanceWallet sx={{ mr: 1, fontSize: isMobile ? 16 : 20 }} /> Cash
                </ToggleButton>
                <ToggleButton value="momo" sx={{ textTransform: 'none' }}>
                  <CreditCard sx={{ mr: 1, fontSize: isMobile ? 16 : 20 }} /> MoMo
                </ToggleButton>
                <ToggleButton value="airtel" sx={{ textTransform: 'none' }}>
                  <CreditCard sx={{ mr: 1, fontSize: isMobile ? 16 : 20 }} /> Airtel
                </ToggleButton>
                <ToggleButton value="qr" sx={{ textTransform: 'none' }}>
                  <QrCode sx={{ mr: 1, fontSize: isMobile ? 16 : 20 }} /> QR
                </ToggleButton>
                <ToggleButton value="split" sx={{ textTransform: 'none' }}>
                  <AccountBalanceWallet sx={{ mr: 1, fontSize: isMobile ? 16 : 20 }} /> Split
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                Proof Requirements
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={proofOptions.uploadPhoto}
                    onChange={handleProofOptionChange('uploadPhoto')}
                    sx={{ color: '#0025DD' }}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUpload fontSize={isMobile ? "small" : "medium"} />
                    <Typography fontSize={isMobile ? "0.875rem" : "1rem"}>Upload Photo</Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3, gap: isMobile ? 1 : 2 }}>
          <Button 
            onClick={() => setShowNewDeliveryDialog(false)}
            sx={{ 
              color: '#0025DD',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD',
              '&:hover': {
                backgroundColor: '#001FB8'
              },
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
            onClick={handleStartDelivery}
            disabled={!deliveryForm.pickupLocation || !deliveryForm.dropoffLocation || !deliveryForm.deliveryFee}
            fullWidth={isMobile}
          >
            Save Delivery
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      <Dialog 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: isMobile ? 0 : 2,
            borderRadius: isMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#0025DD', 
          color: 'white',
          py: isMobile ? 2 : 3
        }}>
          <Typography variant={isMobile ? "h6" : "h6"} fontWeight="bold">RECEIVE PAYMENT</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                Enter Amount (UGX)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: '#0025DD', fontSize: isMobile ? 20 : 24 }} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                Select Payment Method
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
                gap: 1 
              }}>
                {['cash', 'momo', 'airtel', 'visa', 'qr', 'split'].map((method) => (
                  <Button
                    key={method}
                    variant={selectedPaymentMethod === method ? "contained" : "outlined"}
                    onClick={() => {
                      setSelectedPaymentMethod(method)
                      if (method === "qr") setShowQR(true)
                    }}
                    sx={{
                      py: isMobile ? 1 : 1.5,
                      textTransform: 'none',
                      backgroundColor: selectedPaymentMethod === method ? '#0025DD' : 'white',
                      color: selectedPaymentMethod === method ? 'white' : '#0025DD',
                      borderColor: '#0025DD',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      '&:hover': {
                        backgroundColor: selectedPaymentMethod === method ? '#001FB8' : '#0025DD10'
                      }
                    }}
                  >
                    {method === 'cash' ? '💵 Cash' : 
                     method === 'momo' ? 'MTN MoMo' : 
                     method === 'airtel' ? 'Airtel' : 
                     method === 'visa' ? '💳 Visa' : 
                     method === 'qr' ? '▦ QR' : 
                     '◎◎ Split'}
                  </Button>
                ))}
              </Box>
            </Grid>

            {selectedPaymentMethod === "split" && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                        Cash Amount (UGX)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={splitPayment.cash}
                        onChange={(e) => {
                          setSplitPayment({ ...splitPayment, cash: Number(e.target.value) })
                        }}
                        onBlur={handleSplitPaymentUpdate}
                        min="0"
                        max={paymentAmount}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                        Digital Amount (UGX)
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={isMobile ? 8 : 8}>
                          <TextField
                            fullWidth
                            type="number"
                            value={splitPayment.digital}
                            onChange={(e) => {
                              setSplitPayment({ ...splitPayment, digital: Number(e.target.value) })
                            }}
                            onBlur={handleSplitPaymentUpdate}
                            min="0"
                            max={paymentAmount}
                            size={isMobile ? "small" : "medium"}
                          />
                        </Grid>
                        <Grid item xs={isMobile ? 4 : 4}>
                          <FormControl fullWidth>
                            <Select
                              value={splitMethod}
                              onChange={(e) => setSplitMethod(e.target.value)}
                              size={isMobile ? "small" : "small"}
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                              <MenuItem value="momo" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>MoMo</MenuItem>
                              <MenuItem value="airtel" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Airtel</MenuItem>
                              <MenuItem value="visa" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Visa</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    
                    <Grid item xs={12} sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #e0e0e0' }}>
                      <Typography variant="body1" fontWeight="bold" color="#0025DD" fontSize={isMobile ? "0.875rem" : "1rem"}>
                        Total: UGX {(splitPayment.cash + splitPayment.digital).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {selectedPaymentMethod === "qr" && showQR && (
              <Grid item xs={12}>
                <Paper sx={{ p: isMobile ? 2 : 3, textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Box
                    sx={{
                      width: isMobile ? '120px' : '150px',
                      height: isMobile ? '120px' : '150px',
                      margin: '0 auto 16px',
                      backgroundColor: 'white',
                      border: '2px solid #0025DD',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <QrCode sx={{ fontSize: isMobile ? 48 : 64, color: '#0025DD', mb: 1 }} />
                    <Typography variant="caption" color="#999" fontStyle="italic" fontSize={isMobile ? "0.7rem" : "0.75rem"}>
                      QR Code
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#666" fontSize={isMobile ? "0.75rem" : "0.875rem"}>
                    Scan this QR code to complete payment
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: isMobile ? 2 : 2, 
          borderTop: '1px solid #e0e0e0',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1 : 2
        }}>
          <Button 
            onClick={() => {
              setShowPaymentModal(false)
              setShowQR(false)
              setSelectedPaymentMethod("")
              setSplitPayment({ cash: 0, digital: 0 })
            }}
            sx={{ 
              color: '#0025DD',
              flex: 1,
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handlePaymentContinue}
            sx={{ 
              backgroundColor: '#0025DD',
              flex: 1,
              '&:hover': {
                backgroundColor: '#001FB8'
              },
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
            fullWidth={isMobile}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Proof Photo Dialog */}
      <Dialog 
        open={showProofDialog} 
        onClose={() => setShowProofDialog(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: isMobile ? 0 : 2,
            borderRadius: isMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#0025DD', 
          color: 'white',
          py: isMobile ? 2 : 3
        }}>
          <Typography variant={isMobile ? "h6" : "h6"} fontWeight="bold">Delivery Proof</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: isMobile ? 3 : 4 }}>
          <CameraAlt sx={{ fontSize: isMobile ? 48 : 60, color: '#0025DD', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"}>
            Take Proof Photo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} fontSize={isMobile ? "0.875rem" : "1rem"}>
            Capture proof of delivery
          </Typography>
          
          <Box 
            sx={{ 
              width: isMobile ? 150 : 200, 
              height: isMobile ? 120 : 150, 
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
            <Typography variant="body2" color="text.secondary" fontSize={isMobile ? "0.75rem" : "0.875rem"}>
              Camera Preview
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: isMobile ? 2 : 3 }}>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#0025DD',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
            startIcon={<CameraAlt />}
            onClick={handleTakeProofPhoto}
            size={isMobile ? "medium" : "large"}
            fullWidth={isMobile}
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
            color: 'white',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SimpleDeliveryPage;