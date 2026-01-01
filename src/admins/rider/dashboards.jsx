import  { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  LinearProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  Drawer
} from '@mui/material';
import {
  DirectionsCar,
  AccountBalanceWallet,
  Payment,
  Receipt,
  Cancel,
  CheckCircle,
  Close,
  AccessTime,
  Route,
  Money,
  CreditCard,
  Print,
  Download,
  WhatsApp,
  Email,
  ArrowForward,
  QrCode,
  LocalAtm,
  AccountBalanceWalletOutlined,
  CreditCardOutlined,
  AttachMoney,
  AccountBalance,
  Schedule,
  LocationOn,
  DirectionsRun,
  CloudUpload,
  TrendingUp,
  TrendingDown,
  Add,
  Visibility,
  Refresh,
  Share,
  Delete,
  ArrowBack,
  Save,
  Phone,
  CalendarToday,
  AttachFile,
  QrCode2,
  AccountCircle,
  TripOrigin,
  LocalShipping,
  Circle,
  ArrowUpward,
  ArrowDownward,
  Search,
  MoreVert,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Edit,
  Delete as DeleteIcon,
  Directions,
  Speed,
  Stop,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Main Dashboard Component
const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('dashboard');
  const [timeFrame, setTimeFrame] = useState('Daily');
  const [activeTrip, setActiveTrip] = useState(null);
  const [timer, setTimer] = useState(0);
  const [distance, setDistance] = useState(0);
  const [showQuickTripPopup, setShowQuickTripPopup] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelTripModal, setShowCancelTripModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showActiveTripDrawer, setShowActiveTripDrawer] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [receiptData, setReceiptData] = useState(null);
  const receiptRef = useRef(null);

  // Trip data state with default values
  const [tripData, setTripData] = useState({
    pickup: 'Current Location',
    destination: 'Destination',
    amount: 5000,
    duration: '',
    distance: '',
    paymentMethod: 'cash',
    notes: '',
    customerName: '',
    customerPhone: '',
    stops: []
  });

  useEffect(() => {
    let interval;
    if (activeTrip && activeTrip.status === 'active') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        setDistance(prev => prev + 0.01);
      }, 1000);
      
      // Show active trip drawer automatically on mobile
      if (isMobile) {
        setShowActiveTripDrawer(true);
      }
    }
    return () => clearInterval(interval);
  }, [activeTrip, isMobile]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStartQuickTrip = () => {
    // Start trip immediately with default values
    const newTrip = {
      ...tripData,
      id: `QT-${Date.now().toString().slice(-6)}`,
      startTime: new Date(),
      status: 'active'
    };
    
    setActiveTrip(newTrip);
    setTimer(0);
    setDistance(0);
    setShowQuickTripPopup(false);
    
    setSnackbar({
      open: true,
      message: 'Quick Trip Started! Update details as needed.',
      severity: 'success'
    });
    
    // Show active trip drawer on mobile
    if (isMobile) {
      setShowActiveTripDrawer(true);
    }
  };

  const handleEndTrip = () => {
    // Calculate final trip details
    const completedTrip = {
      ...activeTrip,
      endTime: new Date(),
      status: 'ended',
      duration: formatTime(timer),
      distance: distance.toFixed(2)
    };
    
    setActiveTrip(completedTrip);
    setShowActiveTripDrawer(false);
    setShowPaymentModal(true);
  };

  const handleCancelTrip = (withReason = false) => {
    if (withReason && !cancelReason.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a reason for cancellation',
        severity: 'warning'
      });
      return;
    }

    const cancelledTrip = {
      ...activeTrip,
      endTime: new Date(),
      status: 'cancelled',
      duration: formatTime(timer),
      distance: distance.toFixed(2),
      cancelReason: withReason ? cancelReason : 'No reason provided'
    };

    setActiveTrip(cancelledTrip);
    setShowCancelTripModal(false);
    setShowActiveTripDrawer(false);
    setCancelReason('');
    
    // Generate cancellation receipt
    const receipt = {
      tripId: cancelledTrip.id,
      status: 'Cancelled',
      pickup: cancelledTrip.pickup,
      destination: cancelledTrip.destination || 'Trip Cancelled',
      amount: cancelledTrip.amount,
      cancelReason: cancelledTrip.cancelReason,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      duration: cancelledTrip.duration,
      distance: cancelledTrip.distance,
      riderName: 'John Doe',
      riderId: 'RD-2024-001',
      vehicle: 'Bajaj Boxer - Red (UAJ 786X)'
    };

    setReceiptData(receipt);
    setShowReceiptModal(true);
    
    setSnackbar({
      open: true,
      message: 'Trip cancelled successfully',
      severity: 'info'
    });
  };

  const handleContinueTrip = () => {
    setShowCancelTripModal(false);
    setSnackbar({
      open: true,
      message: 'Trip continued',
      severity: 'info'
    });
  };

  const handlePaymentComplete = (paymentData) => {
    const completedTrip = {
      ...activeTrip,
      ...paymentData,
      endTime: new Date(),
      status: 'completed',
      duration: formatTime(timer),
      distance: distance.toFixed(2)
    };

    setActiveTrip(completedTrip);
    setShowPaymentModal(false);
    
    // Generate receipt
    const receipt = {
      tripId: completedTrip.id,
      pickup: completedTrip.pickup,
      destination: completedTrip.destination,
      amount: completedTrip.amount,
      paymentMethod: completedTrip.paymentMethod,
      splitPayment: completedTrip.splitPayment,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      duration: completedTrip.duration,
      distance: completedTrip.distance,
      customerName: completedTrip.customerName || 'Walk-in Customer',
      customerPhone: completedTrip.customerPhone || 'N/A',
      stops: completedTrip.stops,
      notes: completedTrip.notes,
      riderName: 'John Doe',
      riderId: 'RD-2024-001',
      vehicle: 'Bajaj Boxer - Red (UAJ 786X)',
      transactionId: `TXN-${Date.now().toString().slice(-8)}`
    };

    setReceiptData(receipt);
    setShowReceiptModal(true);
    
    setSnackbar({
      open: true,
      message: 'Payment received successfully!',
      severity: 'success'
    });
  };

  const handleExportPDF = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const x = (210 - imgWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', x, 10, imgWidth, imgHeight);
      pdf.save(`receipt-${receiptData.tripId}.pdf`);
    }
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([receiptData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipt");
    XLSX.writeFile(workbook, `receipt-${receiptData.tripId}.xlsx`);
  };

  const handleShareWhatsApp = () => {
    const message = `Trip Receipt - ${receiptData.tripId}\nAmount: UGX ${receiptData.amount.toLocaleString()}\nFrom: ${receiptData.pickup}\nTo: ${receiptData.destination}\nDate: ${receiptData.date} ${receiptData.time}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCustomerReceipt = () => {
    const customerReceipt = {
      ...receiptData,
      header: 'CUSTOMER COPY',
      footer: 'Thank you for riding with us!\nFor inquiries: support@enfuna.com'
    };
    
    // Create a simple customer receipt
    const receiptText = `CUSTOMER RECEIPT
================
Trip ID: ${customerReceipt.tripId}
Date: ${customerReceipt.date} ${customerReceipt.time}

From: ${customerReceipt.pickup}
To: ${customerReceipt.destination}

Distance: ${customerReceipt.distance} km
Duration: ${customerReceipt.duration}

Amount: UGX ${customerReceipt.amount.toLocaleString()}
Payment: ${customerReceipt.paymentMethod}

${customerReceipt.footer}`;
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-receipt-${customerReceipt.tripId}.txt`;
    a.click();
    
    setSnackbar({
      open: true,
      message: 'Customer receipt downloaded',
      severity: 'success'
    });
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'deliveries', label: 'Trip History' },
    { id: 'receive-money', label: 'Receive Money' },
    { id: 'withdraw-money', label: 'Request Payout' },
    { id: 'add-expense', label: 'Add Expense' },
  ];

  return (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {currentView === 'dashboard' && 'Dashboard'}
            {currentView === 'deliveries' && 'Trip History'}
            {currentView === 'receive-money' && 'Receive Money'}
            {currentView === 'withdraw-money' && 'Request Payout'}
            {currentView === 'add-expense' && 'Add Expense'}
          </h1>
          
          {activeTrip?.status === 'active' && !isMobile && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Chip 
                icon={<AccessTime />} 
                label={`${formatTime(timer)}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip 
                icon={<Route />} 
                label={`${distance.toFixed(2)} km`}
                color="secondary"
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => setShowActiveTripDrawer(true)}
                startIcon={<DirectionsCar />}
                sx={{ 
                  bgcolor: '#4CAF50',
                  '&:hover': { bgcolor: '#388E3C' }
                }}
              >
                View Trip
              </Button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentView(tab.id);
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            className="tab-btn yellow-button"
            onClick={() => setShowQuickTripPopup(true)}
          >
            <PlayArrow sx={{ mr: 1, fontSize: 18 }} />
            Quick Trip
          </button>
        </div>

        {/* Main Content */}
        <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          {currentView === 'dashboard' && (
            <DeliveriesContent 
              activeTrip={activeTrip}
              formatTime={formatTime}
              timer={timer}
              distance={distance}
              setShowActiveTripDrawer={setShowActiveTripDrawer}
              isMobile={isMobile}
            />
          )}
          {currentView === 'deliveries' && (
            <DeliveriesHistory isMobile={isMobile} />
          )}
          {currentView === 'receive-money' && (
            <ReceiveMoneyContent 
              handlePaymentComplete={handlePaymentComplete}
              isMobile={isMobile}
            />
          )}
          {currentView === 'withdraw-money' && (
            <WithdrawMoneyContent isMobile={isMobile} />
          )}
          {currentView === 'add-expense' && (
            <AddExpenseContent isMobile={isMobile} />
          )}
        </div>
      </div>

      {/* Quick Trip Popup - SIMPLIFIED */}
      <Dialog
        open={showQuickTripPopup}
        onClose={() => setShowQuickTripPopup(false)}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { 
            borderRadius: isMobile ? 0 : '16px',
            maxHeight: isMobile ? '100vh' : 'auto'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#002AFE', 
          color: 'white',
          position: 'relative',
          py: 2
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              <PlayArrow sx={{ mr: 1, verticalAlign: 'middle' }} />
              Quick Trip
            </Typography>
            <IconButton 
              onClick={() => setShowQuickTripPopup(false)} 
              sx={{ color: 'white' }}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '2px solid #002AFE'
            }}>
              <DirectionsCar sx={{ fontSize: 32, color: '#002AFE' }} />
            </Box>
            
            <Typography variant="h6" gutterBottom color="#002AFE" fontWeight="bold">
              Start Trip Immediately
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Trip will start with default values. You can update details during the trip.
            </Typography>
          </Box>

          <Box sx={{ 
            bgcolor: '#f8f9fa', 
            p: 2, 
            borderRadius: 2,
            mb: 3,
            border: '1px solid #e0e0e0'
          }}>
            <Typography variant="subtitle2" color="#002AFE" gutterBottom>
              Default Trip Settings
            </Typography>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">From:</Typography>
                <Typography variant="body2" fontWeight="500">Current Location</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">To:</Typography>
                <Typography variant="body2" fontWeight="500">Destination</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Fare:</Typography>
                <Typography variant="body2" fontWeight="500">UGX 5,000</Typography>
              </Box>
            </Box>
          </Box>

          {!isMobile && (
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
              Click "Start Trip" to begin. Update details in the trip panel.
            </Typography>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid #e0e0e0',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1
        }}>
          <Button 
            onClick={() => setShowQuickTripPopup(false)}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ 
              borderColor: '#002AFE', 
              color: '#002AFE',
              '&:hover': {
                borderColor: '#001FD8',
                bgcolor: 'rgba(0, 42, 254, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleStartQuickTrip}
            fullWidth={isMobile}
            startIcon={<PlayArrow />}
            sx={{ 
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#388E3C' }
            }}
          >
            Start Trip Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Active Trip Drawer/Popup */}
      {activeTrip?.status === 'active' && (
        <>
          {/* Desktop - Fixed Panel */}
          {!isMobile && showActiveTripDrawer && (
            <Box sx={{
              position: 'fixed',
              top: 100,
              right: 20,
              width: 360,
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 1000,
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}>
              <ActiveTripPanel
                activeTrip={activeTrip}
                timer={timer}
                distance={distance}
                formatTime={formatTime}
                tripData={tripData}
                setTripData={setTripData}
                handleEndTrip={handleEndTrip}
                setShowCancelTripModal={setShowCancelTripModal}
                onClose={() => setShowActiveTripDrawer(false)}
                isMobile={false}
              />
            </Box>
          )}

          {/* Mobile - Bottom Sheet */}
          {isMobile && (
            <Drawer
              anchor="bottom"
              open={showActiveTripDrawer}
              onClose={() => setShowActiveTripDrawer(false)}
              PaperProps={{
                sx: {
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: '90vh'
                }
              }}
            >
              <ActiveTripPanel
                activeTrip={activeTrip}
                timer={timer}
                distance={distance}
                formatTime={formatTime}
                tripData={tripData}
                setTripData={setTripData}
                handleEndTrip={handleEndTrip}
                setShowCancelTripModal={setShowCancelTripModal}
                onClose={() => setShowActiveTripDrawer(false)}
                isMobile={true}
              />
            </Drawer>
          )}
        </>
      )}

      {/* Cancel Trip Modal */}
      <Dialog
        open={showCancelTripModal}
        onClose={() => setShowCancelTripModal(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: '#f44336', color: 'white' }}>
          Cancel Trip
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel this trip?
          </Typography>
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="#f44336">
              Reason for cancellation (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Enter reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Trip ID: {activeTrip?.id}
              <br />
              Duration: {formatTime(timer)} | Distance: {distance.toFixed(2)} km
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid #e0e0e0',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1
        }}>
          <Button 
            onClick={() => setShowCancelTripModal(false)}
            sx={{ color: '#666' }}
            fullWidth={isMobile}
          >
            Back
          </Button>
          <Button 
            onClick={() => handleCancelTrip(false)}
            variant="outlined"
            sx={{ borderColor: '#f44336', color: '#f44336' }}
            fullWidth={isMobile}
          >
            Cancel Without Reason
          </Button>
          <Button 
            onClick={() => handleCancelTrip(true)}
            variant="contained"
            sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
            fullWidth={isMobile}
          >
            Cancel With Reason
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={activeTrip?.amount || 0}
        onPaymentComplete={handlePaymentComplete}
        isMobile={isMobile}
      />

      {/* Receipt Modal - COMPACT VERSION */}
      <ReceiptModal
        open={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          setActiveTrip(null);
          // Reset trip data
          setTripData({
            pickup: 'Current Location',
            destination: 'Destination',
            amount: 5000,
            duration: '',
            distance: '',
            paymentMethod: 'cash',
            notes: '',
            customerName: '',
            customerPhone: '',
            stops: []
          });
        }}
        receiptData={receiptData}
        receiptRef={receiptRef}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onShareWhatsApp={handleShareWhatsApp}
        onCustomerReceipt={handleCustomerReceipt}
        isMobile={isMobile}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ 
          vertical: isMobile ? 'bottom' : 'bottom',
          horizontal: 'center' 
        }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

// Active Trip Panel Component
const ActiveTripPanel = ({
  activeTrip,
  timer,
  distance,
  formatTime,
  tripData,
  setTripData,
  handleEndTrip,
  setShowCancelTripModal,
  onClose,
  isMobile
}) => {
  const [showEditForm, setShowEditForm] = useState(false);
  
  const updateTripField = (field, value) => {
    const updatedTripData = { ...tripData, [field]: value };
    setTripData(updatedTripData);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#002AFE', 
        color: 'white',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsCar />
          <Typography variant="h6" fontWeight="bold">
            Active Trip
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* Timer and Distance */}
      <Box sx={{ 
        bgcolor: '#f0f4ff', 
        p: 2,
        display: 'flex',
        justifyContent: 'space-around',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <AccessTime sx={{ color: '#002AFE', fontSize: 24 }} />
          <Typography variant="h5" fontWeight="bold" color="#002AFE">
            {formatTime(timer)}
          </Typography>
          <Typography variant="caption" color="#666">
            Duration
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Route sx={{ color: '#4CAF50', fontSize: 24 }} />
          <Typography variant="h5" fontWeight="bold" color="#4CAF50">
            {distance.toFixed(2)}
            <Typography component="span" variant="body2" color="inherit"> km</Typography>
          </Typography>
          <Typography variant="caption" color="#666">
            Distance
          </Typography>
        </Box>
      </Box>

      {/* Trip Details */}
      <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold" color="#002AFE">
            Trip Details
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => setShowEditForm(!showEditForm)}
            sx={{ color: '#002AFE' }}
          >
            <Edit />
          </IconButton>
        </Box>

        {showEditForm ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Destination"
              value={tripData.destination}
              onChange={(e) => updateTripField('destination', e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Fare (UGX)"
              type="number"
              value={tripData.amount}
              onChange={(e) => updateTripField('amount', Number(e.target.value))}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
              }}
            />
            <TextField
              label="Customer Name (Optional)"
              value={tripData.customerName}
              onChange={(e) => updateTripField('customerName', e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Customer Phone (Optional)"
              value={tripData.customerPhone}
              onChange={(e) => updateTripField('customerPhone', e.target.value)}
              size="small"
              fullWidth
            />
            <Button 
              variant="outlined" 
              onClick={() => setShowEditForm(false)}
              fullWidth
              sx={{ mt: 1 }}
            >
              Save Changes
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Trip ID:</Typography>
              <Typography variant="body2" fontWeight="500">{activeTrip.id}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">From:</Typography>
              <Typography variant="body2" fontWeight="500">{tripData.pickup}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">To:</Typography>
              <Typography variant="body2" fontWeight="500">{tripData.destination}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Fare:</Typography>
              <Typography variant="body2" fontWeight="500" color="#4CAF50">
                UGX {tripData.amount.toLocaleString()}
              </Typography>
            </Box>
            {tripData.customerName && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Customer:</Typography>
                <Typography variant="body2" fontWeight="500">{tripData.customerName}</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        gap: 1,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <Button
          variant="outlined"
          onClick={() => setShowCancelTripModal(true)}
          startIcon={<Cancel />}
          fullWidth={isMobile}
          sx={{ 
            borderColor: '#f44336', 
            color: '#f44336',
            '&:hover': {
              borderColor: '#d32f2f',
              bgcolor: 'rgba(244, 67, 54, 0.04)'
            }
          }}
        >
          Cancel Trip
        </Button>
        <Button
          variant="contained"
          onClick={handleEndTrip}
          startIcon={<CheckCircle />}
          fullWidth={isMobile}
          sx={{ 
            bgcolor: '#4CAF50',
            '&:hover': { bgcolor: '#388E3C' }
          }}
        >
          End Trip
        </Button>
      </Box>
    </Box>
  );
};

// Payment Modal Component - Mobile Optimized
const PaymentModal = ({ open, onClose, amount, onPaymentComplete, isMobile }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [splitPayment, setSplitPayment] = useState({ cash: 0, digital: 0 });
  const [digitalMethod, setDigitalMethod] = useState('mtn');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (paymentMethod === 'split') {
      const cashAmount = Math.floor(amount * 0.5);
      setSplitPayment({ cash: cashAmount, digital: amount - cashAmount });
    }
  }, [amount, paymentMethod]);

  const handleSubmit = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      const paymentData = {
        amount: amount,
        paymentMethod: paymentMethod,
        splitPayment: paymentMethod === 'split' ? {
          cash: splitPayment.cash,
          digital: splitPayment.digital,
          digitalMethod: digitalMethod
        } : null
      };
      onPaymentComplete(paymentData);
    }, 1500);
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: <Money />, color: '#4CAF50' },
    { id: 'mtn', label: 'MTN', icon: <AccountBalanceWallet />, color: '#FFC107' },
    { id: 'airtel', label: 'Airtel', icon: <Payment />, color: '#E91E63' },
    { id: 'visa', label: 'Card', icon: <CreditCard />, color: '#2196F3' },
    { id: 'split', label: 'Split', icon: <AttachMoney />, color: '#9C27B0' }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { borderRadius: isMobile ? 0 : '16px' }
      }}
    >
      <div style={{ 
        background: 'linear-gradient(135deg, #002AFE 0%, #001FD8 100%)', 
        padding: isMobile ? '16px' : '20px', 
        color: 'white' 
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          Collect Payment
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          Amount: <strong>UGX {amount.toLocaleString()}</strong>
        </Typography>
      </div>

      <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
        {/* Payment Methods */}
        <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
          Select Payment Method
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: 1,
          mb: 3
        }}>
          {paymentMethods.map((method) => (
            <Button
              key={method.id}
              variant="outlined"
              onClick={() => setPaymentMethod(method.id)}
              sx={{
                border: paymentMethod === method.id ? '2px solid ' + method.color : '1px solid #e0e0e0',
                backgroundColor: paymentMethod === method.id ? method.color + '20' : 'white',
                color: paymentMethod === method.id ? method.color : '#666',
                fontWeight: '500',
                py: isMobile ? 1.5 : 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minHeight: 'auto',
                '&:hover': {
                  borderColor: method.color,
                  backgroundColor: method.color + '10'
                }
              }}
            >
              {method.icon}
              <Typography variant="caption" fontWeight="bold">{method.label}</Typography>
            </Button>
          ))}
        </Box>

        {/* Split Payment Details */}
        {paymentMethod === 'split' && (
          <Box sx={{ 
            background: '#f8f9fa', 
            p: 2, 
            borderRadius: 2,
            mb: 3,
            border: '1px solid #e0e0e0'
          }}>
            <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
              Split Payment
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="#002AFE" fontWeight="500" gutterBottom>
                  Cash (UGX)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={splitPayment.cash}
                  onChange={(e) => {
                    const cash = Number(e.target.value);
                    setSplitPayment({ cash, digital: amount - cash });
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="caption" color="#002AFE" fontWeight="500" gutterBottom>
                  Digital (UGX)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={splitPayment.digital}
                  onChange={(e) => {
                    const digital = Number(e.target.value);
                    setSplitPayment({ digital, cash: amount - digital });
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="caption" color="#002AFE" fontWeight="500" gutterBottom>
              Digital Method
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={digitalMethod}
                onChange={(e) => setDigitalMethod(e.target.value)}
                sx={{ background: 'white' }}
              >
                <MenuItem value="mtn">MTN MoMo</MenuItem>
                <MenuItem value="airtel">Airtel Money</MenuItem>
                <MenuItem value="visa">VISA Card</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ 
              textAlign: 'center', 
              mt: 2, 
              pt: 2, 
              borderTop: '1px solid #e0e0e0' 
            }}>
              <Typography variant="body2" color="#002AFE" fontWeight="600">
                Total: UGX {(splitPayment.cash + splitPayment.digital).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Payment Summary */}
        <Box sx={{ 
          background: '#e3f2fd', 
          p: 2, 
          borderRadius: 2,
          border: '1px solid #bbdefb'
        }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
            Payment Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Trip Amount:</Typography>
            <Typography variant="body2" fontWeight="bold">UGX {amount.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Payment Method:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {paymentMethod === 'cash' ? 'Cash' :
               paymentMethod === 'mtn' ? 'MTN MoMo' :
               paymentMethod === 'airtel' ? 'Airtel Money' :
               paymentMethod === 'visa' ? 'VISA Card' : 'Split Payment'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: isMobile ? 2 : 3, 
        borderTop: '1px solid #e0e0e0',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{ 
            borderColor: '#002AFE', 
            color: '#002AFE',
            '&:hover': {
              backgroundColor: 'rgba(0, 42, 254, 0.1)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isProcessing || (paymentMethod === 'split' && (splitPayment.cash + splitPayment.digital !== amount))}
          fullWidth={isMobile}
          sx={{ 
            backgroundColor: '#002AFE',
            color: 'white',
            '&:hover': {
              backgroundColor: '#001FD8'
            }
          }}
        >
          {isProcessing ? (
            <>
              <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
              Processing...
            </>
          ) : (
            'Confirm Payment'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Receipt Modal Component - COMPACT VERSION
const ReceiptModal = ({ 
  open, 
  onClose, 
  receiptData, 
  receiptRef, 
  onExportPDF, 
  onExportExcel, 
  onShareWhatsApp,
  onCustomerReceipt,
  isMobile 
}) => {
  const getPaymentMethodText = () => {
    if (!receiptData) return '';
    
    if (receiptData.paymentMethod === 'split') {
      return `Split (Cash: UGX ${receiptData.splitPayment.cash?.toLocaleString()}, ${receiptData.splitPayment.digitalMethod}: UGX ${receiptData.splitPayment.digital?.toLocaleString()})`;
    }
    
    return receiptData.paymentMethod === 'cash' ? 'Cash' :
           receiptData.paymentMethod === 'mtn' ? 'MTN MoMo' :
           receiptData.paymentMethod === 'airtel' ? 'Airtel Money' :
           receiptData.paymentMethod === 'visa' ? 'VISA Card' : receiptData.paymentMethod;
  };

  if (!receiptData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { 
          borderRadius: isMobile ? 0 : '16px',
          maxHeight: isMobile ? '100vh' : '80vh'
        }
      }}
    >
      <div style={{ 
        background: receiptData?.status === 'Cancelled' ? '#f44336' : '#002AFE', 
        padding: isMobile ? '16px' : '20px', 
        color: 'white' 
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          {receiptData?.status === 'Cancelled' ? 'Trip Cancelled' : 'Trip Receipt'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          {receiptData?.status === 'Cancelled' ? 'Trip has been cancelled' : 'Payment successful!'}
        </Typography>
      </div>

      <DialogContent sx={{ p: isMobile ? 2 : 3, overflow: 'auto' }}>
        <div ref={receiptRef} className="compact-receipt" style={{ 
          background: 'white', 
          padding: isMobile ? '16px' : '20px', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          fontSize: isMobile ? '13px' : '14px'
        }}>
          {/* Compact Header */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" color={receiptData?.status === 'Cancelled' ? '#f44336' : '#002AFE'} gutterBottom>
              {receiptData?.status === 'Cancelled' ? 'CANCELLED' : 'RECEIPT'}
            </Typography>
            <Typography variant="body2" color="#666" gutterBottom>
              Enfuna Delivery Services
            </Typography>
          </div>

          {/* Compact Details */}
          <div style={{ marginBottom: '16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="#666">Receipt No:</Typography>
              <Typography variant="body2" fontWeight="bold">{receiptData?.tripId}</Typography>
            </Box>
            
            {receiptData?.transactionId && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="#666">Transaction ID:</Typography>
                <Typography variant="body2" fontWeight="bold">{receiptData?.transactionId}</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="#666">Date & Time:</Typography>
              <Typography variant="body2">
                {receiptData?.date} {receiptData?.time}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Trip Info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
                Trip Information
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#666">From:</Typography>
                  <Typography variant="body2">{receiptData?.pickup}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#666">To:</Typography>
                  <Typography variant="body2">{receiptData?.destination}</Typography>
                </Grid>
                {receiptData?.distance && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="#666">Distance:</Typography>
                    <Typography variant="body2">{receiptData?.distance} km</Typography>
                  </Grid>
                )}
                {receiptData?.duration && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="#666">Duration:</Typography>
                    <Typography variant="body2">{receiptData?.duration}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Payment Info */}
            {receiptData?.paymentMethod && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
                  Payment
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="#666">Method:</Typography>
                    <Typography variant="body2">{getPaymentMethodText()}</Typography>
                  </Grid>
                  {receiptData?.amount && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="#666">Amount:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="#002AFE">
                        UGX {receiptData?.amount?.toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Rider Info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
                Rider Info
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#666">Rider ID:</Typography>
                  <Typography variant="body2">{receiptData?.riderId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="#666">Vehicle:</Typography>
                  <Typography variant="body2">{receiptData?.vehicle}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Cancellation Reason */}
            {receiptData?.status === 'Cancelled' && receiptData?.cancelReason && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: '#fff3e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="#e65100" gutterBottom>
                  Cancellation Reason:
                </Typography>
                <Typography variant="body2">
                  {receiptData.cancelReason}
                </Typography>
              </Box>
            )}
          </div>

          {/* Compact Footer */}
          <Divider sx={{ my: 1.5 }} />
          <div style={{ textAlign: 'center' }}>
            <Typography variant="caption" color="#666" display="block">
              Thank you for choosing Enfuna
            </Typography>
            <Typography variant="caption" color="#666">
              support@enfuna.com
            </Typography>
          </div>
        </div>
      </DialogContent>

      <DialogActions sx={{ 
        p: isMobile ? 2 : 3, 
        borderTop: '1px solid #e0e0e0',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 1,
        justifyContent: 'space-between'
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          <Button
            size={isMobile ? "small" : "medium"}
            startIcon={<Print />}
            onClick={() => window.print()}
            sx={{ color: '#002AFE' }}
          >
            Print
          </Button>
          <Button
            size={isMobile ? "small" : "medium"}
            startIcon={<Download />}
            onClick={onExportPDF}
            sx={{ color: '#002AFE' }}
          >
            PDF
          </Button>
          {receiptData?.status !== 'Cancelled' && (
            <Button
              size={isMobile ? "small" : "medium"}
              startIcon={<Receipt />}
              onClick={onCustomerReceipt}
              sx={{ color: '#4CAF50' }}
            >
              Customer
            </Button>
          )}
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {receiptData?.status !== 'Cancelled' && (
            <Button
              size={isMobile ? "small" : "medium"}
              startIcon={<WhatsApp />}
              onClick={onShareWhatsApp}
              sx={{ 
                backgroundColor: '#25D366',
                color: 'white',
                '&:hover': { backgroundColor: '#1da851' }
              }}
            >
              Share
            </Button>
          )}
          <Button
            variant="contained"
            onClick={onClose}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              backgroundColor: receiptData?.status === 'Cancelled' ? '#f44336' : '#002AFE',
              minWidth: isMobile ? '100%' : 'auto'
            }}
          >
            Done
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// Deliveries Content Component
const DeliveriesContent = ({ 
  activeTrip,
  formatTime,
  timer,
  distance,
  setShowActiveTripDrawer,
  isMobile
}) => {
  const deliveryStats = {
    walletBalance: '40,000',
    totalDeliveries: 125,
    totalRevenue: 40000,
    completedDeliveries: 102,
    failedDeliveries: 23,
  };

  const earningsSummary = {
    trips: 10, momo: 52000, cash: 44000, fuelExpenses: 15000, totalEarnings: 96000, netEarnings: 81000
  };
  
  const recentTrips = [
    {
      id: 'TRP-001',
      route: 'Mukono → Kampala',
      amount: 4000,
      paymentMethod: 'Cash',
      status: 'Completed',
      time: '2:30 PM',
      date: 'Today'
    },
    {
      id: 'TRP-002',
      route: 'Kireka → Banda',
      amount: 2000,
      paymentMethod: 'MTN MoMo',
      status: 'Completed',
      time: '1:15 PM',
      date: 'Today'
    }
  ];

  return (
    <>
      {/* Active Trip Banner for Mobile */}
      {activeTrip?.status === 'active' && isMobile && (
        <div className="active-trip-banner">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18 }} />
                Active Trip
              </Typography>
              <Typography variant="caption" display="block">
                {activeTrip.pickup} → {activeTrip.destination}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.8)">
                ID: {activeTrip.id}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h6" gutterBottom>
                UGX {activeTrip.amount.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                {formatTime(timer)} • {distance.toFixed(2)} km
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => setShowActiveTripDrawer(true)}
            fullWidth
            startIcon={<DirectionsCar />}
            sx={{ 
              bgcolor: 'white',
              color: '#002AFE',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            View Trip Details
          </Button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Wallet Balance</div>
          <h3 className="stat-value">UGX {deliveryStats.walletBalance}</h3>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Trips</div>
          <h3 className="stat-value">{deliveryStats.totalDeliveries}</h3>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <h3 className="stat-value">{deliveryStats.completedDeliveries}</h3>
        </div>
        <div className="stat-card">
          <div className="stat-label">Success Rate</div>
          <h3 className="stat-value">84%</h3>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="commission-overview">
        <div className="section-title">
          <Schedule />
          Recent Trips
        </div>
        <div className="commission-ledger">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="ledger-entry">
              <div className="entry-info">
                <div className="entry-type">{trip.route}</div>
                <div className="entry-time">{trip.date} • {trip.time}</div>
              </div>
              <div className="entry-amount">
                UGX {trip.amount.toLocaleString()}
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                  {trip.paymentMethod} • {trip.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="payout-section">
        <div className="balance-card">
          <div className="balance-label">Earnings Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>Total Earnings</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>
                UGX {earningsSummary.totalEarnings.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>Net Earnings</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>
                UGX {earningsSummary.netEarnings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Deliveries History Component
const DeliveriesHistory = ({ isMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const tripHistory = [
    {
      id: 'TRP-001',
      route: 'Mukono → Kampala',
      amount: 4000,
      paymentMethod: 'Cash',
      status: 'Completed',
      date: '2024-01-15',
      time: '2:30 PM',
      distance: '5.3 km',
      duration: '18:01',
      customerName: 'John Bosco',
      stops: 0
    },
    {
      id: 'TRP-002',
      route: 'Kireka → Banda',
      amount: 2000,
      paymentMethod: 'MTN MoMo',
      status: 'Completed',
      date: '2024-01-15',
      time: '1:15 PM',
      distance: '2.2 km',
      duration: '4:21',
      customerName: 'Aaron',
      stops: 0
    },
    {
      id: 'TRP-003',
      route: 'Gulu → Nakutt',
      amount: 8000,
      paymentMethod: 'Split (Cash + MoMo)',
      status: 'Completed',
      date: '2024-01-14',
      time: '10:45 AM',
      distance: '8.7 km',
      duration: '17:00',
      customerName: 'Sarah',
      stops: 2
    },
    {
      id: 'TRP-004',
      route: 'Kampala → Banda',
      amount: 6000,
      paymentMethod: 'Airtel Money',
      status: 'Cancelled',
      date: '2024-01-14',
      time: '11:20 AM',
      distance: '4.5 km',
      duration: '0:00',
      customerName: 'Mike',
      stops: 0
    }
  ];

  const filteredTrips = tripHistory.filter(trip => {
    const matchesSearch = 
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || trip.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="activate-screen">
      <h2 className="activate-title">Trip History</h2>
      <p className="activate-subtitle">View all your completed trips</p>

      {/* Filters */}
      <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #bbdefb' }}>
        <div className="promo-input-section">
          <input
            type="text"
            className="promo-input"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            className="validate-btn"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minWidth: '120px' }}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Trip History Table */}
      <div className="commission-engine">
        <div className="section-title">All Trips</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f4ff' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Trip ID</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Route</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => (
                <tr key={trip.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#002AFE', fontWeight: '500' }}>{trip.id}</td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>
                    <div>{trip.route}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {trip.distance} • {trip.duration} • {trip.stops} stop{trip.stops !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>{trip.customerName}</td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#002AFE', fontWeight: '600' }}>
                    UGX {trip.amount.toLocaleString()}
                    <div style={{ fontSize: '11px', color: '#666' }}>{trip.paymentMethod}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`status-badge ${trip.status.toLowerCase()}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
                    {trip.date}<br/>
                    {trip.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Receive Money Content Component
const ReceiveMoneyContent = ({ handlePaymentComplete, isMobile }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const paymentData = {
      amount: parseFloat(amount),
      paymentMethod: paymentMethod,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || 'N/A',
      notes: notes,
      pickup: 'Direct Payment',
      destination: 'Direct Payment',
      duration: 'N/A',
      distance: '0 km',
      stops: []
    };

    handlePaymentComplete(paymentData);
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: <Money /> },
    { id: 'mtn', label: 'MTN MoMo', icon: <AccountBalanceWallet /> },
    { id: 'airtel', label: 'Airtel Money', icon: <Payment /> },
    { id: 'visa', label: 'VISA Card', icon: <CreditCard /> }
  ];

  return (
    <div className="activate-screen">
      <h2 className="activate-title">Receive Money</h2>
      <p className="activate-subtitle">Record a direct payment</p>

      <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #bbdefb' }}>
        {/* Amount Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            Amount Received (UGX)
          </label>
          <div className="promo-input-section">
            <input
              type="number"
              className="promo-input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '14px', color: '#002AFE', fontWeight: '500' }}>UGX</span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            Payment Method
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className={`filter-btn ${paymentMethod === method.id ? 'active' : ''}`}
                onClick={() => setPaymentMethod(method.id)}
                style={{ 
                  padding: '12px',
                  border: paymentMethod === method.id ? '2px solid #002AFE' : '1px solid #002AFE',
                  background: paymentMethod === method.id ? '#002AFE' : 'white',
                  color: paymentMethod === method.id ? 'white' : '#002AFE',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {method.icon}
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer Information */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
              Customer Name (Optional)
            </label>
            <input
              type="text"
              className="promo-input"
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
              Customer Phone (Optional)
            </label>
            <input
              type="tel"
              className="promo-input"
              placeholder="Customer phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            Notes (Optional)
          </label>
          <textarea
            className="promo-input"
            placeholder="Payment description or notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        {/* Payment Summary */}
        <div style={{ 
          background: '#f0f4ff', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #c5cae9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#002AFE' }}>Amount:</span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#002AFE' }}>
              UGX {amount ? parseFloat(amount).toLocaleString() : '0'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: '#002AFE' }}>Payment Method:</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE' }}>
              {paymentMethod === 'cash' ? 'Cash' :
               paymentMethod === 'mtn' ? 'MTN MoMo' :
               paymentMethod === 'airtel' ? 'Airtel Money' : 'VISA Card'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
        <button 
          className="activate-code-btn"
          style={{ 
            background: 'transparent', 
            border: '1px solid #002AFE', 
            color: '#002AFE',
            flex: 1
          }}
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button 
          className="activate-code-btn"
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0}
          style={{ flex: 1 }}
        >
          Record Payment
        </button>
      </div>
    </div>
  );
};

// Withdraw Money Content Component
const WithdrawMoneyContent = ({ isMobile }) => {
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('momo');
  const [accountDetails, setAccountDetails] = useState({
    phone: '',
    accountNumber: '',
    bankName: ''
  });

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) < 5000) {
      alert('Minimum withdrawal amount is UGX 5,000');
      return;
    }

    // Simulate withdrawal request
    alert(`Withdrawal request submitted: UGX ${amount} via ${withdrawalMethod}`);
  };

  return (
    <div className="activate-screen">
      <h2 className="activate-title">Request Payout</h2>
      <p className="activate-subtitle">Request Payout of funds from your wallet</p>

      {/* Wallet Balance */}
      <div className="balance-card" style={{ marginBottom: '24px' }}>
        <div className="balance-label">Available Balance</div>
        <h2 className="balance-amount">40,000<span style={{ fontSize: '16px', marginLeft: '4px' }}>UGX</span></h2>
      </div>

      <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #bbdefb' }}>
        {/* Amount Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            Enter Amount For Payout (UGX)
          </label>
          <div className="promo-input-section">
            <input
              type="number"
              className="promo-input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '14px', color: '#002AFE', fontWeight: '500' }}>UGX</span>
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
            Minimum Payout: UGX 5,000
          </div>
        </div>

        {/* Withdrawal Method */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            Select Payout Method
          </label>
          <RadioGroup 
            value={withdrawalMethod} 
            onChange={(e) => setWithdrawalMethod(e.target.value)}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="momo"
                checked={withdrawalMethod === 'momo'}
                onChange={(e) => setWithdrawalMethod(e.target.value)}
                style={{ accentColor: '#002AFE' }}
              />
              <span>MTN MoMo</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="airtel"
                checked={withdrawalMethod === 'airtel'}
                onChange={(e) => setWithdrawalMethod(e.target.value)}
                style={{ accentColor: '#002AFE' }}
              />
              <span>Airtel Money</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="bank"
                checked={withdrawalMethod === 'bank'}
                onChange={(e) => setWithdrawalMethod(e.target.value)}
                style={{ accentColor: '#002AFE' }}
              />
              <span>Bank Transfer</span>
            </label>
          </RadioGroup>
        </div>

        {/* Account Details */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            {withdrawalMethod === 'momo' ? 'Mobile Money Number' :
             withdrawalMethod === 'airtel' ? 'Airtel Money Number' : 'Bank Account Details'}
          </label>
          {withdrawalMethod === 'bank' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                className="promo-input"
                placeholder="Bank Name"
                value={accountDetails.bankName}
                onChange={(e) => setAccountDetails({ ...accountDetails, bankName: e.target.value })}
              />
              <input
                type="text"
                className="promo-input"
                placeholder="Account Number"
                value={accountDetails.accountNumber}
                onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
              />
            </div>
          ) : (
            <input
              type="tel"
              className="promo-input"
              placeholder="Phone Number"
              value={accountDetails.phone}
              onChange={(e) => setAccountDetails({ ...accountDetails, phone: e.target.value })}
            />
          )}
        </div>

        {/* Withdrawal Summary */}
        <div style={{ 
          background: '#f0f4ff', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #c5cae9'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#002AFE', marginBottom: '12px' }}>
            Payout Summary
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#002AFE' }}>Amount:</span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#002AFE' }}>
              UGX {amount ? parseFloat(amount).toLocaleString() : '0'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#002AFE' }}>Method:</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE' }}>
              {withdrawalMethod === 'momo' ? 'MTN MoMo' :
               withdrawalMethod === 'airtel' ? 'Airtel Money' : 'Bank Transfer'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: '#002AFE' }}>Fee:</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE' }}>UGX 0 (Free)</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
        <button 
          className="activate-code-btn"
          style={{ 
            background: 'transparent', 
            border: '1px solid #002AFE', 
            color: '#002AFE',
            flex: 1
          }}
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button 
          className="activate-code-btn"
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) < 5000}
          style={{ flex: 1 }}
        >
          Request Payout
        </button>
      </div>
    </div>
  );
};

// Add Expense Content Component
const AddExpenseContent = ({ isMobile }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [expenseData, setExpenseData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'Cash',
    receipt: null,
    vehicle: 'Bajaj Boxer - Red (UAJ 786X)'
  });

  const expenseCategories = [
    'Fuel', 'Maintenance', 'Repairs', 'Parking', 'Meals', 'Airtime', 
    'Insurance', 'Washing Bay', 'Tolls', 'Other'
  ];

  const steps = ['Category & Amount', 'Details & Receipt', 'Review & Save'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSaveExpense();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSaveExpense = () => {
    // Generate receipt for expense
    const expenseReceipt = {
      id: `EXP-${Date.now().toString().slice(-6)}`,
      category: expenseData.category,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date,
      description: expenseData.description,
      paymentMethod: expenseData.paymentMethod,
      vehicle: expenseData.vehicle,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      riderName: 'John Doe',
      riderId: 'RD-2024-001'
    };

    alert(`Expense recorded: ${expenseData.category} - UGX ${expenseData.amount}\nReceipt ID: ${expenseReceipt.id}`);
    
    // Reset form
    setExpenseData({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: 'Cash',
      receipt: null,
      vehicle: 'Bajaj Boxer - Red (UAJ 786X)'
    });
    setActiveStep(0);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <div className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>Expense Details</div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                Expense Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                {expenseCategories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${expenseData.category === category ? 'active' : ''}`}
                    onClick={() => setExpenseData({ ...expenseData, category })}
                    style={{ 
                      padding: '12px',
                      border: expenseData.category === category ? '2px solid #002AFE' : '1px solid #002AFE',
                      background: expenseData.category === category ? '#002AFE' : 'white',
                      color: expenseData.category === category ? 'white' : '#002AFE',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                Amount (UGX)
              </label>
              <div className="promo-input-section">
                <input
                  type="number"
                  className="promo-input"
                  placeholder="Enter amount"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '14px', color: '#002AFE', fontWeight: '500' }}>UGX</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                Date
              </label>
              <input
                type="date"
                className="promo-input"
                value={expenseData.date}
                onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>Additional Details</div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                Description (Optional)
              </label>
              <textarea
                className="promo-input"
                placeholder="Describe the expense"
                value={expenseData.description}
                onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                rows="3"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                Payment Method
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                {['Cash', 'MTN MoMo', 'Airtel Money', 'Bank Transfer'].map((method) => (
                  <button
                    key={method}
                    className={`filter-btn ${expenseData.paymentMethod === method ? 'active' : ''}`}
                    onClick={() => setExpenseData({ ...expenseData, paymentMethod: method })}
                    style={{ 
                      padding: '12px',
                      border: expenseData.paymentMethod === method ? '2px solid #002AFE' : '1px solid #002AFE',
                      background: expenseData.paymentMethod === method ? '#002AFE' : 'white',
                      color: expenseData.paymentMethod === method ? 'white' : '#002AFE',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                Vehicle
              </label>
              <input
                type="text"
                className="promo-input"
                value={expenseData.vehicle}
                onChange={(e) => setExpenseData({ ...expenseData, vehicle: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                Upload Receipt (Optional)
              </label>
              <div style={{ 
                border: '2px dashed #002AFE', 
                borderRadius: '8px', 
                padding: '24px', 
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <CloudUpload sx={{ fontSize: 48, color: '#002AFE', mb: 2 }} />
                <Typography variant="body2" color="#002AFE" gutterBottom>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="caption" color="#666">
                  Supports JPG, PNG, PDF (Max 10MB)
                </Typography>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>Review Expense</div>
            
            <div className="commission-ledger" style={{ marginBottom: '24px' }}>
              <div className="detail-row">
                <span className="detail-label">Category</span>
                <span className="detail-value">{expenseData.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount</span>
                <span className="detail-value">UGX {expenseData.amount}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">{expenseData.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Method</span>
                <span className="detail-value">{expenseData.paymentMethod}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">{expenseData.vehicle}</span>
              </div>
              {expenseData.description && (
                <div className="detail-row">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">{expenseData.description}</span>
                </div>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="activate-screen">
      <h2 className="activate-title">Add Expense</h2>
      <p className="activate-subtitle">Record your delivery expenses</p>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #bbdefb' }}>
        {renderStepContent()}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
        <button 
          className="activate-code-btn"
          style={{ 
            background: 'transparent', 
            border: '1px solid #002AFE', 
            color: '#002AFE',
            flex: 1
          }}
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </button>
        <button 
          className="activate-code-btn"
          onClick={handleNext}
          disabled={activeStep === 0 && (!expenseData.category || !expenseData.amount)}
          style={{ flex: 1 }}
        >
          {activeStep === steps.length - 1 ? 'Save Expense & Generate Receipt' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

// Add global styles
const globalStyles = `
  .rider-agent-container {
    min-height: 100vh;
    background: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .rider-agent-dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .dashboard-header {
    background: linear-gradient(135deg, #002AFE 0%, #001FD8 100%);
    color: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dashboard-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .tab-navigation {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .tab-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    background: white;
    color: #666;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    border: 1px solid #e0e0e0;
  }

  .tab-btn:hover {
    background: #f0f4ff;
    color: #002AFE;
  }

  .tab-btn.active {
    background: #002AFE;
    color: white;
    border-color: #002AFE;
  }

  .tab-btn.yellow-button {
    background: #FEF132;
    color: black;
    border: 1px solid #fde047;
  }

  .tab-btn.yellow-button:hover {
    background: #fde047;
  }

  .tab-content {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .active-trip-banner {
    background: linear-gradient(135deg, #002AFE 0%, #001FD8 100%);
    color: white;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 24px;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
  }

  .stat-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  .stat-value {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #002AFE;
  }

  .commission-overview {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #002AFE;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .commission-ledger {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .ledger-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
  }

  .ledger-entry:last-child {
    border-bottom: none;
  }

  .entry-info {
    flex: 1;
  }

  .entry-type {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .entry-time {
    font-size: 12px;
    color: #666;
  }

  .entry-amount {
    text-align: right;
    font-weight: 600;
    color: #002AFE;
  }

  .balance-card {
    background: linear-gradient(135deg, #002AFE 0%, #001FD8 100%);
    color: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .balance-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .balance-amount {
    margin: 0;
    font-size: 32px;
    font-weight: 700;
  }

  .activate-screen {
    max-width: 800px;
    margin: 0 auto;
  }

  .activate-title {
    font-size: 24px;
    font-weight: 600;
    color: #002AFE;
    margin-bottom: 8px;
  }

  .activate-subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
  }

  .promo-input-section {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 20px;
  }

  .promo-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s ease;
  }

  .promo-input:focus {
    outline: none;
    border-color: #002AFE;
  }

  .validate-btn {
    padding: 12px 24px;
    background: #002AFE;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .validate-btn:hover {
    background: #001FD8;
  }

  .activate-code-btn {
    padding: 12px 32px;
    background: #002AFE;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .activate-code-btn:hover {
    background: #001FD8;
  }

  .withdraw-commission-btn {
    padding: 12px 32px;
    background: #FEF132;
    color: black;
    border: 1px solid #fde047;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .withdraw-commission-btn:hover {
    background: #fde047;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    color: #666;
    font-size: 14px;
  }

  .detail-value {
    font-weight: 500;
    color: #333;
    text-align: right;
  }

  .commission-engine {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .filter-btn {
    padding: 8px 16px;
    border: 1px solid #002AFE;
    background: white;
    color: #002AFE;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 12px;
  }

  .filter-btn:hover {
    background: #f0f4ff;
  }

  .filter-btn.active {
    background: #002AFE;
    color: white;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
  }

  .status-badge.completed {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .status-badge.cancelled {
    background: #ffebee;
    color: #c62828;
  }

  .payout-section {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
  }

  .back-btn {
    background: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .rider-agent-dashboard {
      padding: 12px;
    }
    
    .dashboard-header {
      padding: 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .dashboard-title {
      font-size: 20px;
    }
    
    .tab-navigation {
      gap: 4px;
      margin-bottom: 16px;
    }
    
    .tab-btn {
      padding: 10px 16px;
      font-size: 14px;
    }
    
    .tab-content {
      padding: 16px;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .stat-card {
      padding: 16px;
    }
    
    .stat-value {
      font-size: 20px;
    }
    
    .commission-overview,
    .commission-engine,
    .payout-section {
      padding: 16px;
    }
    
    .balance-card {
      padding: 20px;
    }
    
    .balance-amount {
      font-size: 24px;
    }
    
    .activate-title {
      font-size: 20px;
    }
    
    .promo-input-section {
      flex-direction: column;
      gap: 8px;
    }
    
    .promo-input {
      width: 100%;
    }
    
    .trip-controls {
      flex-direction: column;
    }
    
    .active-trip-banner {
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .tab-btn {
      padding: 8px 12px;
      font-size: 12px;
    }
    
    .active-trip-banner {
      padding: 12px;
    }
  }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = globalStyles;
  document.head.appendChild(styleElement);
}

export default DashboardPage;