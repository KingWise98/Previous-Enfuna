import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Badge,
  Tooltip,
  Fab
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
  FilterList,
  PhoneAndroid,
  AccountBalance,
  Receipt,
  Share,
  Download,
  SimCard,
  Payment,
  SwapHoriz,
  Money,
  Wifi,
  SignalCellularAlt,
  Fingerprint,
  Security
} from '@mui/icons-material';

const API_BASE_URL = "http://127.0.0.1:8000/api/riders/";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showMobileMoneyModal, setShowMobileMoneyModal] = useState(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [showSplitPaymentModal, setShowSplitPaymentModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [deliveryPeriod, setDeliveryPeriod] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // API Data States
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState(null);
  const [deliverySummary, setDeliverySummary] = useState(null);

  // History filters
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

  // Delivery form
  const [deliveryForm, setDeliveryForm] = useState({
    pickup_location: '',
    delivery_location: '',
    amount: '',
    payment_method: 'cash',
    recipient_name: '',
    recipient_phone: '',
    package_description: ''
  });

  // Payment states
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const [splitPayment, setSplitPayment] = useState({ cash: 0, digital: 0 });
  const [splitMethod, setSplitMethod] = useState("momo");
  const [showQR, setShowQR] = useState(false);
  const [activePaymentStep, setActivePaymentStep] = useState(0);
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('mtn');
  const [mobileNumber, setMobileNumber] = useState('');
  const [transactionPin, setTransactionPin] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    branch: ''
  });

  const [proofOptions, setProofOptions] = useState({
    uploadPhoto: false,
    signature: false,
    idVerification: false
  });

  const [receiptData, setReceiptData] = useState(null);

  // Fetch data from APIs
  useEffect(() => {
    fetchDeliveries();
    fetchDeliveryStats();
    fetchDeliverySummary();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}list_deliveries`);
      if (!response.ok) throw new Error('Failed to fetch deliveries');
      const data = await response.json();
      setDeliveryHistory(data.deliveries || data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      // Fallback to empty array if API fails
      setDeliveryHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}delivery_stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setDeliveryStats(data);
    } catch (error) {
      console.error('Error fetching delivery stats:', error);
    }
  };

  const fetchDeliverySummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}delivery_stats`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      setDeliverySummary(data);
    } catch (error) {
      console.error('Error fetching delivery summary:', error);
    }
  };

  const createDelivery = async (deliveryData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}create_deliveries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickup_location: deliveryData.pickup_location,
          delivery_location: deliveryData.delivery_location,
          amount: parseInt(deliveryData.amount),
          payment_method: deliveryData.payment_method,
          recipient_name: deliveryData.recipient_name,
          recipient_phone: deliveryData.recipient_phone,
          package_description: deliveryData.package_description,
          status: 'pending'
        })
      });
      
      if (!response.ok) throw new Error('Failed to create delivery');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changeDeliveryStatus = async (deliveryId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}change_delivery_status/${deliveryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to change delivery status');
      
      return await response.json();
    } catch (error) {
      console.error('Error changing delivery status:', error);
      throw error;
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDeliveryId = (d) => {
    if (d?.delivery_id) return d.delivery_id;
    if (d?.id) return `DEL-${String(d.id).padStart(6, '0')}`;
    return `DEL-${Date.now().toString().slice(-6)}`;
  };

  const getPaymentChipSx = (method) => {
    const m = (method || '').toLowerCase();
    if (m.includes('cash')) return { backgroundColor: '#E8FFF0', borderColor: '#22C55E', color: '#166534', fontWeight: 700 };
    if (m.includes('momo') || m.includes('mtn')) return { backgroundColor: '#FFF7D6', borderColor: '#F59E0B', color: '#92400E', fontWeight: 700 };
    if (m.includes('airtel')) return { backgroundColor: '#FFEBEE', borderColor: '#DC2626', color: '#991B1B', fontWeight: 700 };
    if (m.includes('split')) return { backgroundColor: '#EEF2FF', borderColor: '#6366F1', color: '#3730A3', fontWeight: 700 };
    if (m.includes('bank') || m.includes('transfer')) return { backgroundColor: '#F3E8FF', borderColor: '#9333EA', color: '#581C87', fontWeight: 700 };
    return { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB', color: '#111827', fontWeight: 700 };
  };

  const getStatusChipSx = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'complete') return { backgroundColor: '#E8FFF0', borderColor: '#22C55E', color: '#166534', fontWeight: 800 };
    if (s === 'cancelled' || s === 'canceled') return { backgroundColor: '#FFECEC', borderColor: '#EF4444', color: '#991B1B', fontWeight: 800 };
    if (s === 'pending') return { backgroundColor: '#FFF7D6', borderColor: '#F59E0B', color: '#92400E', fontWeight: 800 };
    if (s === 'active') return { backgroundColor: '#DBEAFE', borderColor: '#2563EB', color: '#1E40AF', fontWeight: 800 };
    return { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB', color: '#111827', fontWeight: 800 };
  };

  const uniqueRoutes = Array.from(
    new Set(
      (deliveryHistory || [])
        .map((d) => `${d?.pickup_location ?? d?.pickup ?? ''} - ${d?.delivery_location ?? d?.dropoff ?? ''}`.trim())
        .filter((r) => r && r !== '-')
    )
  );

  const filteredHistory = (deliveryHistory || [])
    .filter((d) => {
      const q = historySearch.trim().toLowerCase();
      if (!q) return true;
      const hay = [
        formatDeliveryId(d),
        d?.recipient_name || d?.recipientName,
        d?.recipient_phone,
        d?.pickup_location || d?.pickup,
        d?.delivery_location || d?.dropoff,
        d?.customer
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
      if (historyPayment === 'all') return true;
      return (d?.payment_method || d?.paymentMethod || '').toLowerCase() === historyPayment;
    })
    .filter((d) => {
      const fee = Number(d?.amount || d?.fee || 0);
      return fee >= historyAmountRange[0] && fee <= historyAmountRange[1];
    })
    .sort((a, b) => {
      const dir = historySortOrder === 'newest' ? -1 : 1;
      if (historySortBy === 'amount') {
        const amountA = Number(a?.amount || a?.fee || 0);
        const amountB = Number(b?.amount || b?.fee || 0);
        return (amountA - amountB) * dir;
      }
      // Sort by date (created_at)
      const dateA = new Date(a?.created_at || a?.date || 0);
      const dateB = new Date(b?.created_at || b?.date || 0);
      return (dateA - dateB) * dir;
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

  const handleStartDelivery = async () => {
    if (!deliveryForm.pickup_location || !deliveryForm.delivery_location || !deliveryForm.amount) {
      showSnackbar('Please fill in pickup, delivery locations and amount', 'error');
      return;
    }

    try {
      const newDelivery = await createDelivery(deliveryForm);
      
      setActiveDelivery({
        ...newDelivery,
        pickup: deliveryForm.pickup_location,
        dropoff: deliveryForm.delivery_location,
        fee: parseInt(deliveryForm.amount),
        paymentMethod: deliveryForm.payment_method === 'split' ? 'Split Pay' : 
                      deliveryForm.payment_method === 'momo' ? 'MTN MoMo' :
                      deliveryForm.payment_method === 'airtel' ? 'Airtel Money' :
                      deliveryForm.payment_method === 'bank' ? 'Bank Transfer' : 'Cash',
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'active',
        proofOptions: { ...proofOptions }
      });

      // Change status to active
      await changeDeliveryStatus(newDelivery.id, 'active');

      setShowNewDeliveryDialog(false);
      
      setDeliveryForm({
        pickup_location: '',
        delivery_location: '',
        amount: '',
        payment_method: 'cash',
        recipient_name: '',
        recipient_phone: '',
        package_description: ''
      });

      setProofOptions({
        uploadPhoto: false,
        signature: false,
        idVerification: false
      });

      showSnackbar('Delivery started successfully!');
    } catch (error) {
      showSnackbar('Failed to start delivery. Please try again.', 'error');
    }
  };

  const handleCompleteDelivery = () => {
    if (!activeDelivery) return;

    setPaymentAmount(activeDelivery.fee || activeDelivery.amount);
    
    // Show appropriate payment modal based on payment method
    const paymentMethod = activeDelivery.paymentMethod || activeDelivery.payment_method;
    if (paymentMethod.toLowerCase().includes('momo') || paymentMethod.toLowerCase().includes('airtel')) {
      setShowMobileMoneyModal(true);
    } else if (paymentMethod.toLowerCase().includes('bank') || paymentMethod.toLowerCase().includes('transfer')) {
      setShowBankTransferModal(true);
    } else if (paymentMethod.toLowerCase().includes('split')) {
      setShowSplitPaymentModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentContinue = async () => {
    if (!selectedPaymentMethod) {
      showSnackbar("Please select a payment method", 'error');
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Complete the delivery
      const updatedDelivery = await changeDeliveryStatus(activeDelivery.id, 'completed');

      // Generate receipt
      const receipt = {
        id: updatedDelivery.id || activeDelivery.id,
        amount: paymentAmount,
        paymentMethod: selectedPaymentMethod,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        pickup: activeDelivery.pickup || activeDelivery.pickup_location,
        delivery: activeDelivery.dropoff || activeDelivery.delivery_location,
        recipient: activeDelivery.recipient_name || 'Customer',
        transactionId: `TXN${Date.now().toString().slice(-8)}`,
        status: 'completed'
      };

      setReceiptData(receipt);
      
      // Update local state
      setDeliveryHistory(prev => [{
        ...activeDelivery,
        status: 'completed',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      }, ...prev]);

      setActiveDelivery(null);
      setShowPaymentModal(false);
      setShowSuccessModal(true);
      
      // Refresh data
      fetchDeliveries();
      fetchDeliveryStats();
      fetchDeliverySummary();

      showSnackbar('Payment received successfully!');
    } catch (error) {
      showSnackbar('Payment failed. Please try again.', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleMobileMoneyPayment = async () => {
    if (!mobileNumber || !transactionPin) {
      showSnackbar('Please enter mobile number and PIN', 'error');
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate mobile money payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedDelivery = await changeDeliveryStatus(activeDelivery.id, 'completed');

      const receipt = {
        id: updatedDelivery.id || activeDelivery.id,
        amount: paymentAmount,
        paymentMethod: `${mobileMoneyProvider.toUpperCase()} Mobile Money`,
        mobileNumber: mobileNumber,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        pickup: activeDelivery.pickup || activeDelivery.pickup_location,
        delivery: activeDelivery.dropoff || activeDelivery.delivery_location,
        recipient: activeDelivery.recipient_name || 'Customer',
        transactionId: `MM${Date.now().toString().slice(-8)}`,
        status: 'completed'
      };

      setReceiptData(receipt);
      setActiveDelivery(null);
      setShowMobileMoneyModal(false);
      setShowSuccessModal(true);
      
      // Reset mobile money form
      setMobileNumber('');
      setTransactionPin('');
      setMobileMoneyProvider('mtn');

      showSnackbar(`Payment via ${mobileMoneyProvider.toUpperCase()} Mobile Money successful!`);
    } catch (error) {
      showSnackbar('Mobile money payment failed. Please try again.', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleBankTransferPayment = async () => {
    if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName) {
      showSnackbar('Please fill in all bank details', 'error');
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate bank transfer
      await new Promise(resolve => setTimeout(resolve, 2500));

      const updatedDelivery = await changeDeliveryStatus(activeDelivery.id, 'completed');

      const receipt = {
        id: updatedDelivery.id || activeDelivery.id,
        amount: paymentAmount,
        paymentMethod: 'Bank Transfer',
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        pickup: activeDelivery.pickup || activeDelivery.pickup_location,
        delivery: activeDelivery.dropoff || activeDelivery.delivery_location,
        recipient: activeDelivery.recipient_name || 'Customer',
        transactionId: `BANK${Date.now().toString().slice(-8)}`,
        status: 'completed'
      };

      setReceiptData(receipt);
      setActiveDelivery(null);
      setShowBankTransferModal(false);
      setShowSuccessModal(true);

      showSnackbar('Bank transfer initiated successfully!');
    } catch (error) {
      showSnackbar('Bank transfer failed. Please try again.', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSplitPayment = async () => {
    if (splitPayment.cash <= 0 || splitPayment.digital <= 0) {
      showSnackbar("Please enter both cash and digital amounts", 'error');
      return;
    }

    setProcessingPayment(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1800));

      const updatedDelivery = await changeDeliveryStatus(activeDelivery.id, 'completed');

      const receipt = {
        id: updatedDelivery.id || activeDelivery.id,
        amount: paymentAmount,
        paymentMethod: 'Split Payment',
        splitDetails: {
          cash: splitPayment.cash,
          digital: splitPayment.digital,
          method: splitMethod
        },
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        pickup: activeDelivery.pickup || activeDelivery.pickup_location,
        delivery: activeDelivery.dropoff || activeDelivery.delivery_location,
        recipient: activeDelivery.recipient_name || 'Customer',
        transactionId: `SPLIT${Date.now().toString().slice(-8)}`,
        status: 'completed'
      };

      setReceiptData(receipt);
      setActiveDelivery(null);
      setShowSplitPaymentModal(false);
      setShowSuccessModal(true);

      showSnackbar('Split payment processed successfully!');
    } catch (error) {
      showSnackbar('Split payment failed. Please try again.', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleTakeProofPhoto = () => {
    showSnackbar('Proof captured successfully!');
    setShowProofDialog(false);
  };

  const handleCancelDelivery = async () => {
    try {
      await changeDeliveryStatus(activeDelivery.id, 'cancelled');
      setActiveDelivery(null);
      showSnackbar('Delivery cancelled');
    } catch (error) {
      showSnackbar('Failed to cancel delivery', 'error');
    }
  };

  const handleSplitPaymentUpdate = () => {
    const total = paymentAmount;
    if (splitPayment.cash + splitPayment.digital !== total) {
      const remaining = total - splitPayment.cash;
      setSplitPayment({ ...splitPayment, digital: remaining > 0 ? remaining : 0 });
    }
  };

  const handleExportDeliveries = () => {
    showSnackbar('Export feature coming soon!', 'info');
  };

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Delivery Receipt',
        text: `Receipt for delivery ${receiptData.id}`,
        url: window.location.href,
      });
    } else {
      showSnackbar('Web Share API not supported', 'info');
    }
  };

  const handleDownloadReceipt = () => {
    showSnackbar('Receipt downloaded successfully!', 'success');
  };

  // Calculate stats
  const todayStats = {
    deliveries: deliveryStats?.today_deliveries || 0,
    earnings: deliveryStats?.today_earnings || 0,
    expenses: deliveryStats?.today_expenses || 0
  };

  const deliveryOverview = {
    totalDeliveries: deliveryStats?.total_deliveries || 0,
    totalRevenue: deliveryStats?.total_revenue || 0,
    completedDeliveries: deliveryStats?.completed_deliveries || 0,
    failedDeliveries: deliveryStats?.failed_deliveries || 0,
    successRate: deliverySummary?.success_rate || 0,
    avgDeliveryTime: deliverySummary?.avg_delivery_time || '0min',
    activeDeliveries: deliveryStats?.active_deliveries || 0
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
              Active Delivery
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
          
          {/* Delivery Progress */}
          <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
            <CardContent>
              <Stepper activeStep={1} alternativeLabel sx={{ mb: 3 }}>
                <Step>
                  <StepLabel>Pickup</StepLabel>
                </Step>
                <Step>
                  <StepLabel>In Transit</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Delivery</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Complete</StepLabel>
                </Step>
              </Stepper>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            {/* Delivery Details */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom color="#0025DD">
                    Delivery Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <LocationOn sx={{ color: '#0025DD', mr: 1, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Pickup Location
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {activeDelivery.pickup || activeDelivery.pickup_location}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <LocationOff sx={{ color: '#0025DD', mr: 1, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Delivery Location
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {activeDelivery.dropoff || activeDelivery.delivery_location}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <AttachMoney sx={{ color: '#0025DD', mr: 1, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Amount
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="#0025DD">
                            UGX {(activeDelivery.fee || activeDelivery.amount || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Payment sx={{ color: '#0025DD', mr: 1, mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Payment Method
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {activeDelivery.paymentMethod || activeDelivery.payment_method}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {activeDelivery.recipient_name && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Recipient
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {activeDelivery.recipient_name}
                        </Typography>
                        {activeDelivery.recipient_phone && (
                          <Typography variant="caption" color="text.secondary">
                            {activeDelivery.recipient_phone}
                          </Typography>
                        )}
                      </Grid>
                    )}

                    {activeDelivery.package_description && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Package Description
                        </Typography>
                        <Typography variant="body2">
                          {activeDelivery.package_description}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {activeDelivery.proofOptions?.uploadPhoto && (
                    <Paper sx={{ p: 2, mt: 2, backgroundColor: '#0025DD10' }}>
                      <Typography variant="caption" fontWeight="bold" color="#0025DD" gutterBottom>
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
                        {activeDelivery.proofOptions.signature && (
                          <Chip 
                            icon={<Fingerprint />}
                            label="Signature" 
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                          />
                        )}
                        {activeDelivery.proofOptions.idVerification && (
                          <Chip 
                            icon={<Security />}
                            label="ID Verification" 
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

        {/* Mobile Bottom Action Bar */}
        {isMobile && (
          <Box sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid #e0e0e0',
            p: 2,
            display: 'flex',
            gap: 1,
            zIndex: 1000
          }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#0025DD',
                flex: 1
              }}
              startIcon={<CheckCircle />}
              onClick={handleCompleteDelivery}
            >
              Complete
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#0025DD',
                color: '#0025DD',
                flex: 1
              }}
              startIcon={<CameraAlt />}
              onClick={() => setShowProofDialog(true)}
            >
              Proof
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  // Main Delivery Page
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      pb: isMobile ? 8 : 3
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
              py: isMobile ? 0.5 : 1,
              '&:hover': {
                backgroundColor: '#E6D401'
              }
            }}
            startIcon={<Add />}
            onClick={() => setShowNewDeliveryDialog(true)}
          >
            {isMobile ? 'Start' : 'Start Delivery'}
          </Button>
        </Box>

        {/* Stats Overview */}
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
                {deliveryOverview.totalRevenue?.toLocaleString() || '0'}{' '}
                <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 800, ml: 0.5 }}>
                  UGX
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: isMobile ? 1.5 : 2 }}>
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
                    <Typography sx={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>
                      {deliveryOverview.totalDeliveries}
                    </Typography>
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
                      <Typography sx={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>
                        {deliveryOverview.totalRevenue?.toLocaleString() || '0'}
                      </Typography>
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
                    <Typography sx={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>
                      {deliveryOverview.completedDeliveries}
                    </Typography>
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
                    <Typography sx={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#0025DD', fontWeight: 900, lineHeight: 1.1 }}>
                      {deliveryOverview.failedDeliveries}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* Quick Actions */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: '1px solid #0025DD30',
                  '&:hover': {
                    borderColor: '#0025DD',
                    backgroundColor: '#0025DD05'
                  }
                }}
                onClick={() => setShowNewDeliveryDialog(true)}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <DeliveryDining sx={{ fontSize: 32, color: '#0025DD', mb: 1 }} />
                  <Typography variant="body2" fontWeight="bold">Start Delivery</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: '1px solid #0025DD30',
                  '&:hover': {
                    borderColor: '#0025DD',
                    backgroundColor: '#0025DD05'
                  }
                }}
                onClick={() => setShowHistoryDialog(true)}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Receipt sx={{ fontSize: 32, color: '#0025DD', mb: 1 }} />
                  <Typography variant="body2" fontWeight="bold">History</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: '1px solid #0025DD30',
                  '&:hover': {
                    borderColor: '#0025DD',
                    backgroundColor: '#0025DD05'
                  }
                }}
                onClick={() => setShowPaymentModal(true)}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Payment sx={{ fontSize: 32, color: '#0025DD', mb: 1 }} />
                  <Typography variant="body2" fontWeight="bold">Receive Payment</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: '1px solid #0025DD30',
                  '&:hover': {
                    borderColor: '#0025DD',
                    backgroundColor: '#0025DD05'
                  }
                }}
                onClick={() => setShowProofDialog(true)}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <CameraAlt sx={{ fontSize: 32, color: '#0025DD', mb: 1 }} />
                  <Typography variant="body2" fontWeight="bold">Take Proof</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3, borderColor: '#0025DD20' }} />

        {/* Recent Deliveries */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{ fontWeight: 900, color: '#0025DD', fontSize: isMobile ? '1rem' : '1.1rem' }}>Recent Deliveries</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#2D4BFF' }}>Your recent delivery activity</Typography>
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
            View All
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#0025DD' }} />
            </Box>
          ) : deliveryHistory.slice(0, isMobile ? 2 : 3).length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#F5F9FF', borderRadius: 1.5 }}>
              <DeliveryDining sx={{ fontSize: 48, color: '#0025DD', mb: 2 }} />
              <Typography sx={{ fontWeight: 800, color: '#0025DD', mb: 1 }}>No deliveries yet</Typography>
              <Typography variant="body2" color="text.secondary">Start your first delivery to see activity here</Typography>
            </Paper>
          ) : (
            deliveryHistory.slice(0, isMobile ? 2 : 3).map((d) => {
              const deliveryId = formatDeliveryId(d);
              const pickup = d?.pickup_location || d?.pickup;
              const delivery = d?.delivery_location || d?.dropoff;
              const amount = Number(d?.amount || d?.fee || 0);
              const paymentMethod = d?.payment_method || d?.paymentMethod;
              const status = d?.status || 'pending';
              const recipient = d?.recipient_name || d?.recipientName || d?.customer;

              return (
                <Paper key={d.id} sx={{ p: 2, mb: 2, backgroundColor: '#F5F9FF', borderRadius: 1.5 }}>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={4}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>
                        Delivery ID
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', color: '#0025DD', fontWeight: 900 }}>
                        {deliveryId}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#0025DD', fontWeight: 800, mt: 0.5 }}>
                        {pickup} → {delivery}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>Recipient</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#0025DD', fontWeight: 900 }}>{recipient}</Typography>
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>Amount</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, color: '#0025DD' }}>
                        UGX {amount.toLocaleString()}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>Payment</Typography>
                      <Chip 
                        label={paymentMethod || 'Cash'} 
                        size="small" 
                        sx={{ 
                          ...getPaymentChipSx(paymentMethod),
                          fontSize: '0.65rem',
                          height: '20px'
                        }} 
                      />
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#2D4BFF', fontWeight: 700 }}>Status</Typography>
                      <Chip 
                        label={status} 
                        size="small" 
                        sx={{ 
                          ...getStatusChipSx(status),
                          fontSize: '0.65rem',
                          height: '20px'
                        }} 
                      />
                    </Grid>
                  </Grid>
                </Paper>
              );
            })
          )}
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-around',
          p: 1,
          zIndex: 1000
        }}>
          <Button
            variant="text"
            sx={{ color: '#0025DD', minWidth: 'auto' }}
            onClick={() => setShowNewDeliveryDialog(true)}
          >
            <Add />
          </Button>
          <Button
            variant="text"
            sx={{ color: '#0025DD', minWidth: 'auto' }}
            onClick={() => setShowHistoryDialog(true)}
          >
            <Receipt />
          </Button>
          <Button
            variant="text"
            sx={{ color: '#0025DD', minWidth: 'auto' }}
            onClick={() => setShowPaymentModal(true)}
          >
            <Payment />
          </Button>
        </Box>
      )}

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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pickup Location"
                value={deliveryForm.pickup_location}
                onChange={handleInputChange('pickup_location')}
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
              <TextField
                fullWidth
                label="Delivery Location"
                value={deliveryForm.delivery_location}
                onChange={handleInputChange('delivery_location')}
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
              <TextField
                fullWidth
                label="Amount (UGX)"
                type="number"
                value={deliveryForm.amount}
                onChange={handleInputChange('amount')}
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
              <TextField
                fullWidth
                label="Recipient Name"
                value={deliveryForm.recipient_name}
                onChange={handleInputChange('recipient_name')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipient Phone"
                value={deliveryForm.recipient_phone}
                onChange={handleInputChange('recipient_phone')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Package Description"
                multiline
                rows={2}
                value={deliveryForm.package_description}
                onChange={handleInputChange('package_description')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  label="Payment Method"
                  value={deliveryForm.payment_method}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, payment_method: e.target.value }))}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="momo">MTN Mobile Money</MenuItem>
                  <MenuItem value="airtel">Airtel Money</MenuItem>
                  <MenuItem value="bank">Bank Transfer</MenuItem>
                  <MenuItem value="split">Split Payment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold" color="#0025DD" gutterBottom>
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
                label="Upload Photo"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={proofOptions.signature}
                    onChange={handleProofOptionChange('signature')}
                    sx={{ color: '#0025DD' }}
                  />
                }
                label="Signature"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={proofOptions.idVerification}
                    onChange={handleProofOptionChange('idVerification')}
                    sx={{ color: '#0025DD' }}
                  />
                }
                label="ID Verification"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowNewDeliveryDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            sx={{ backgroundColor: '#0025DD' }}
            onClick={handleStartDelivery}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Start Delivery'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      <Dialog 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          Receive Payment
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Amount: UGX {paymentAmount.toLocaleString()}
          </Typography>
          
          <Typography variant="body2" gutterBottom sx={{ mt: 2, mb: 2 }}>
            Select payment method:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedPaymentMethod === 'cash' ? '2px solid #0025DD' : '1px solid #e0e0e0',
                  textAlign: 'center',
                  p: 2,
                  '&:hover': { borderColor: '#0025DD' }
                }}
                onClick={() => setSelectedPaymentMethod('cash')}
              >
                <Money sx={{ fontSize: 40, color: '#0025DD', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">Cash</Typography>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedPaymentMethod === 'momo' ? '2px solid #0025DD' : '1px solid #e0e0e0',
                  textAlign: 'center',
                  p: 2,
                  '&:hover': { borderColor: '#0025DD' }
                }}
                onClick={() => setShowMobileMoneyModal(true)}
              >
                <PhoneAndroid sx={{ fontSize: 40, color: '#FF6B00', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">Mobile Money</Typography>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedPaymentMethod === 'bank' ? '2px solid #0025DD' : '1px solid #e0e0e0',
                  textAlign: 'center',
                  p: 2,
                  '&:hover': { borderColor: '#0025DD' }
                }}
                onClick={() => setShowBankTransferModal(true)}
              >
                <AccountBalance sx={{ fontSize: 40, color: '#9333EA', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">Bank Transfer</Typography>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedPaymentMethod === 'split' ? '2px solid #0025DD' : '1px solid #e0e0e0',
                  textAlign: 'center',
                  p: 2,
                  '&:hover': { borderColor: '#0025DD' }
                }}
                onClick={() => setShowSplitPaymentModal(true)}
              >
                <SwapHoriz sx={{ fontSize: 40, color: '#6366F1', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">Split Payment</Typography>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedPaymentMethod === 'qr' ? '2px solid #0025DD' : '1px solid #e0e0e0',
                  textAlign: 'center',
                  p: 2,
                  '&:hover': { borderColor: '#0025DD' }
                }}
                onClick={() => setShowQR(true)}
              >
                <QrCode sx={{ fontSize: 40, color: '#0025DD', mb: 1 }} />
                <Typography variant="body2" fontWeight="bold">QR Code</Typography>
              </Card>
            </Grid>
          </Grid>

          {showQR && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  margin: '0 auto',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  border: '2px solid #0025DD'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  QR Code Display
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Scan to pay UGX {paymentAmount.toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowPaymentModal(false)}>Cancel</Button>
          <Button 
            variant="contained"
            sx={{ backgroundColor: '#0025DD' }}
            onClick={handlePaymentContinue}
            disabled={processingPayment}
          >
            {processingPayment ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Money Payment Modal */}
      <Dialog 
        open={showMobileMoneyModal} 
        onClose={() => setShowMobileMoneyModal(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          Mobile Money Payment
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Amount: UGX {paymentAmount.toLocaleString()}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Provider</InputLabel>
            <Select
              value={mobileMoneyProvider}
              onChange={(e) => setMobileMoneyProvider(e.target.value)}
              label="Provider"
            >
              <MenuItem value="mtn">MTN Mobile Money</MenuItem>
              <MenuItem value="airtel">Airtel Money</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Transaction PIN"
            type="password"
            value={transactionPin}
            onChange={(e) => setTransactionPin(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              You will receive a confirmation message on your phone
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowMobileMoneyModal(false)}>Cancel</Button>
          <Button 
            variant="contained"
            sx={{ backgroundColor: '#0025DD' }}
            onClick={handleMobileMoneyPayment}
            disabled={processingPayment}
          >
            {processingPayment ? 'Processing...' : 'Send Payment Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bank Transfer Modal */}
      <Dialog 
        open={showBankTransferModal} 
        onClose={() => setShowBankTransferModal(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          Bank Transfer
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Amount: UGX {paymentAmount.toLocaleString()}
          </Typography>

          <TextField
            fullWidth
            label="Bank Name"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
            sx={{ mt: 2, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Account Number"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Account Name"
            value={bankDetails.accountName}
            onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Branch (Optional)"
            value={bankDetails.branch}
            onChange={(e) => setBankDetails({...bankDetails, branch: e.target.value})}
            sx={{ mb: 2 }}
          />

          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Transfer will be processed within 24 hours
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowBankTransferModal(false)}>Cancel</Button>
          <Button 
            variant="contained"
            sx={{ backgroundColor: '#0025DD' }}
            onClick={handleBankTransferPayment}
            disabled={processingPayment}
          >
            {processingPayment ? 'Processing...' : 'Initiate Transfer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Split Payment Modal */}
      <Dialog 
        open={showSplitPaymentModal} 
        onClose={() => setShowSplitPaymentModal(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          Split Payment
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Total Amount: UGX {paymentAmount.toLocaleString()}
          </Typography>

          <TextField
            fullWidth
            label="Cash Amount (UGX)"
            type="number"
            value={splitPayment.cash}
            onChange={(e) => setSplitPayment({...splitPayment, cash: Number(e.target.value)})}
            sx={{ mt: 2, mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Digital Amount (UGX)"
              type="number"
              value={splitPayment.digital}
              onChange={(e) => setSplitPayment({...splitPayment, digital: Number(e.target.value)})}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Method</InputLabel>
              <Select
                value={splitMethod}
                onChange={(e) => setSplitMethod(e.target.value)}
                label="Method"
              >
                <MenuItem value="momo">MTN MoMo</MenuItem>
                <MenuItem value="airtel">Airtel Money</MenuItem>
                <MenuItem value="bank">Bank</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Cash: UGX {splitPayment.cash.toLocaleString()}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              Digital ({splitMethod.toUpperCase()}): UGX {splitPayment.digital.toLocaleString()}
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
              Total: UGX {(splitPayment.cash + splitPayment.digital).toLocaleString()}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowSplitPaymentModal(false)}>Cancel</Button>
          <Button 
            variant="contained"
            sx={{ backgroundColor: '#0025DD' }}
            onClick={handleSplitPayment}
            disabled={processingPayment}
          >
            {processingPayment ? 'Processing...' : 'Confirm Split Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal */}
      <Dialog 
        open={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircle sx={{ fontSize: 60, color: '#22C55E', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" gutterBottom>
            UGX {receiptData?.amount?.toLocaleString() || '0'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Payment received via {receiptData?.paymentMethod}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<Receipt />}
              onClick={() => {
                setShowSuccessModal(false);
                setShowReceiptModal(true);
              }}
            >
              View Receipt
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#0025DD' }}
              onClick={() => setShowSuccessModal(false)}
            >
              Done
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog 
        open={showReceiptModal} 
        onClose={() => setShowReceiptModal(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          Delivery Receipt
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {receiptData && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="#0025DD">
                  DELIVERY RECEIPT
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Transaction ID: {receiptData.transactionId}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body2">{receiptData.date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Time</Typography>
                  <Typography variant="body2">{receiptData.time}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">From</Typography>
                  <Typography variant="body2" fontWeight="bold">{receiptData.pickup}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">To</Typography>
                  <Typography variant="body2" fontWeight="bold">{receiptData.delivery}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Recipient</Typography>
                  <Typography variant="body2">{receiptData.recipient}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                  <Typography variant="body2" fontWeight="bold">{receiptData.paymentMethod}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="bold" color="#0025DD" sx={{ textAlign: 'center' }}>
                    UGX {receiptData.amount.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Thank you for your business!
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShareReceipt}
                >
                  Share
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownloadReceipt}
                >
                  Download
                </Button>
              </Box>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowReceiptModal(false)}>Close</Button>
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
          Delivery Proof
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
            sx={{ backgroundColor: '#0025DD' }}
            startIcon={<CameraAlt />}
            onClick={handleTakeProofPhoto}
          >
            Capture Proof
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delivery History Dialog */}
      <Dialog
        open={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        fullScreen={isMobile}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Delivery History</Typography>
            <IconButton onClick={() => setShowHistoryDialog(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {/* History content would go here */}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SimpleDeliveryPage;