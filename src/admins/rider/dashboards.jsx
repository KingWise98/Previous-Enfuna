import React, { useState, useEffect, useRef } from 'react';
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
  Avatar
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
  Search
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
  const [cancelReason, setCancelReason] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [receiptData, setReceiptData] = useState(null);
  const receiptRef = useRef(null);

  // Trip data state
  const [tripData, setTripData] = useState({
    pickup: 'Current Location',
    destination: '',
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
    }
    return () => clearInterval(interval);
  }, [activeTrip]);

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
      message: 'Quick Trip Started!',
      severity: 'success'
    });
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
      const canvas = await html2canvas(receiptRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
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
    // Generate customer-specific receipt
    const customerReceipt = {
      ...receiptData,
      header: 'CUSTOMER COPY',
      footer: 'Thank you for riding with us!\nFor inquiries: support@enfuna.com'
    };
    
    // You could open a new popup or download directly
    const receiptText = `
      CUSTOMER RECEIPT
      ================
      Trip ID: ${customerReceipt.tripId}
      Date: ${customerReceipt.date} ${customerReceipt.time}
      
      From: ${customerReceipt.pickup}
      To: ${customerReceipt.destination}
      
      Distance: ${customerReceipt.distance} km
      Duration: ${customerReceipt.duration}
      
      Amount: UGX ${customerReceipt.amount.toLocaleString()}
      Payment: ${customerReceipt.paymentMethod}
      
      ${customerReceipt.footer}
    `;
    
    // Download as text file
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
            {activeTrip?.status === 'active' ? 'Active Quick Trip' : 'Dashboard'}
            {currentView === 'deliveries' && 'Trip History'}
            {currentView === 'receive-money' && 'Receive Money'}
            {currentView === 'withdraw-money' && 'Request Payout'}
            {currentView === 'add-expense' && 'Add Expense'}
          </h1>
          
          {activeTrip?.status === 'active' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Chip 
                icon={<AccessTime />} 
                label={`Time: ${formatTime(timer)}`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                icon={<Route />} 
                label={`Distance: ${distance.toFixed(2)} km`}
                color="secondary"
                variant="outlined"
              />
              <Chip 
                icon={<DirectionsCar />} 
                label={`Amount: UGX ${activeTrip.amount.toLocaleString()}`}
                color="success"
                variant="outlined"
              />
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
            Quick Trip
          </button>
        </div>

        {/* Main Content */}
        <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          {currentView === 'dashboard' && (
            <DeliveriesContent 
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              isMobile={isMobile}
              navigate={navigate}
              setCurrentView={setCurrentView}
              activeTrip={activeTrip}
              formatTime={formatTime}
              timer={timer}
              distance={distance}
              handleEndTrip={handleEndTrip}
              setShowCancelTripModal={setShowCancelTripModal}
            />
          )}
          {currentView === 'deliveries' && (
            <DeliveriesHistory />
          )}
          {currentView === 'receive-money' && (
            <ReceiveMoneyContent 
              handlePaymentComplete={handlePaymentComplete}
            />
          )}
          {currentView === 'withdraw-money' && (
            <WithdrawMoneyContent />
          )}
          {currentView === 'add-expense' && (
            <AddExpenseContent />
          )}
        </div>
      </div>

      {/* Quick Trip Popup */}
      <Dialog
        open={showQuickTripPopup}
        onClose={() => setShowQuickTripPopup(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#002AFE', color: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Start Quick Trip</Typography>
            <IconButton onClick={() => setShowQuickTripPopup(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quick trips start immediately. You can update details during the trip.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="#002AFE">
              Destination
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Enter destination"
              value={tripData.destination}
              onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="#002AFE">
              Estimated Amount (UGX)
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type="number"
              value={tripData.amount}
              onChange={(e) => setTripData({ ...tripData, amount: Number(e.target.value) })}
              InputProps={{
                startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="#002AFE">
              Customer Details (Optional)
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Customer name"
              value={tripData.customerName}
              onChange={(e) => setTripData({ ...tripData, customerName: e.target.value })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Customer phone"
              value={tripData.customerPhone}
              onChange={(e) => setTripData({ ...tripData, customerPhone: e.target.value })}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => setShowQuickTripPopup(false)}
            sx={{ color: '#002AFE' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleStartQuickTrip}
            disabled={!tripData.destination.trim()}
            sx={{ bgcolor: '#002AFE', '&:hover': { bgcolor: '#001FD8' } }}
          >
            Start Trip Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Trip Modal */}
      <Dialog
        open={showCancelTripModal}
        onClose={() => setShowCancelTripModal(false)}
        maxWidth="sm"
        fullWidth
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
              Trip Details: {activeTrip?.pickup} → {activeTrip?.destination}
              <br />
              Duration: {formatTime(timer)} | Distance: {distance.toFixed(2)} km
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => setShowCancelTripModal(false)}
            sx={{ color: '#666' }}
          >
            Back
          </Button>
          <Button 
            onClick={() => handleCancelTrip(false)}
            variant="outlined"
            sx={{ borderColor: '#f44336', color: '#f44336' }}
          >
            Cancel Without Reason
          </Button>
          <Button 
            onClick={() => handleCancelTrip(true)}
            variant="contained"
            sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
          >
            Cancel With Reason
          </Button>
          <Button 
            onClick={handleContinueTrip}
            variant="contained"
            sx={{ bgcolor: '#002AFE', '&:hover': { bgcolor: '#001FD8' } }}
          >
            Continue Trip
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={activeTrip?.amount || 0}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        open={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          setActiveTrip(null);
          // Reset trip data
          setTripData({
            pickup: 'Current Location',
            destination: '',
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
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx global>{`
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
          padding: 20px;
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

        .trip-controls {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .trip-controls button {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .end-trip-btn {
          background: #4CAF50;
          color: white;
        }

        .end-trip-btn:hover {
          background: #388E3C;
        }

        .cancel-trip-btn {
          background: #f44336;
          color: white;
        }

        .cancel-trip-btn:hover {
          background: #d32f2f;
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

        /* Override MUI styles */
        .rider-agent-container .MuiCard-root {
          background: white !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 8px !important;
          box-shadow: none !important;
        }

        .rider-agent-container .MuiButton-contained {
          background: #002AFE !important;
          color: white !important;
          border-radius: 8px !important;
          font-weight: 500 !important;
          text-transform: none !important;
        }

        .rider-agent-container .MuiButton-contained:hover {
          background: #001FD8 !important;
        }

        .rider-agent-container .MuiDialog-paper {
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  );
};

// Deliveries Content Component
const DeliveriesContent = ({ 
  timeFrame, 
  setTimeFrame, 
  isMobile, 
  navigate, 
  setCurrentView,
  activeTrip,
  formatTime,
  timer,
  distance,
  handleEndTrip,
  setShowCancelTripModal
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
      {/* Active Trip Banner */}
      {activeTrip?.status === 'active' && (
        <div className="active-trip-banner">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
                Active Quick Trip
              </Typography>
              <Typography variant="body2">
                <LocationOn sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                {activeTrip.pickup} → {activeTrip.destination}
              </Typography>
              <Typography variant="caption">
                Trip ID: {activeTrip.id}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h5" gutterBottom>
                <AttachMoney sx={{ fontSize: 20, mr: 0.5, verticalAlign: 'middle' }} />
                UGX {activeTrip.amount.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                <AccessTime sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                {formatTime(timer)} • 
                <Route sx={{ fontSize: 12, mx: 0.5, verticalAlign: 'middle' }} />
                {distance.toFixed(2)} km
              </Typography>
            </Box>
          </Box>
          
          <div className="trip-controls">
            <button 
              className="cancel-trip-btn"
              onClick={() => setShowCancelTripModal(true)}
            >
              <Cancel sx={{ fontSize: 18 }} />
              Cancel Trip
            </button>
            <button 
              className="end-trip-btn"
              onClick={handleEndTrip}
            >
              <CheckCircle sx={{ fontSize: 18 }} />
              End Trip & Collect Payment
            </button>
          </div>
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

      {/* Action Buttons */}
      {!activeTrip?.status === 'active' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <button 
            className="withdraw-commission-btn" 
            onClick={() => setCurrentView('receive-money')}
          >
            Receive Money
          </button>
          <button 
            className="activate-code-btn"
            onClick={() => setCurrentView('deliveries')}
          >
            View All Trips
          </button>
        </div>
      )}

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

// Payment Modal Component
const PaymentModal = ({ open, onClose, amount, onPaymentComplete }) => {
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
    
    // Simulate payment processing
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
    { id: 'cash', label: 'Cash', icon: <Money />, description: 'Cash payment' },
    { id: 'mtn', label: 'MTN MoMo', icon: <AccountBalanceWallet />, description: 'Mobile money payment' },
    { id: 'airtel', label: 'Airtel Money', icon: <Payment />, description: 'Mobile money payment' },
    { id: 'visa', label: 'VISA Card', icon: <CreditCard />, description: 'Card payment' },
    { id: 'split', label: 'Split Payment', icon: <AttachMoney />, description: 'Combine cash & digital' }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '8px' }
      }}
    >
      <div style={{ background: '#002AFE', padding: '20px', borderRadius: '8px 8px 0 0', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">
          Collect Payment
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          Trip Amount: <strong>UGX {amount.toLocaleString()}</strong>
        </Typography>
      </div>

      <DialogContent sx={{ p: 3 }}>
        <div style={{ marginBottom: '24px' }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
            Select Payment Method
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant="outlined"
                onClick={() => setPaymentMethod(method.id)}
                sx={{
                  border: paymentMethod === method.id ? '2px solid #002AFE' : '1px solid #e0e0e0',
                  backgroundColor: paymentMethod === method.id ? '#002AFE10' : 'white',
                  color: paymentMethod === method.id ? '#002AFE' : '#666',
                  fontWeight: '500',
                  py: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  '&:hover': {
                    borderColor: '#002AFE',
                    backgroundColor: '#002AFE10'
                  }
                }}
              >
                {method.icon}
                <Typography variant="body2" fontWeight="bold">{method.label}</Typography>
                <Typography variant="caption" color="text.secondary">{method.description}</Typography>
              </Button>
            ))}
          </div>
        </div>

        {/* Split Payment Details */}
        {paymentMethod === 'split' && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: '1px solid #e0e0e0'
          }}>
            <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
              Split Payment Details
            </Typography>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <Typography variant="caption" color="#002AFE" fontWeight="500" gutterBottom>
                  Cash Amount (UGX)
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
              </div>
              
              <div>
                <Typography variant="caption" color="#002AFE" fontWeight="500" gutterBottom>
                  Digital Amount (UGX)
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
              </div>
            </div>

            <div>
              <Typography variant="caption" color="#002AFE" fontWeight="500" gutterBottom>
                Digital Payment Method
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
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '16px', 
              paddingTop: '12px', 
              borderTop: '1px solid #e0e0e0' 
            }}>
              <Typography variant="body2" color="#002AFE" fontWeight="600">
                Total: UGX {(splitPayment.cash + splitPayment.digital).toLocaleString()}
              </Typography>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div style={{ 
          background: '#e3f2fd', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #bbdefb'
        }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
            Payment Summary
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Typography variant="body2">Trip Amount:</Typography>
            <Typography variant="body2" fontWeight="bold">UGX {amount.toLocaleString()}</Typography>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Payment Method:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {paymentMethod === 'cash' ? 'Cash' :
               paymentMethod === 'mtn' ? 'MTN MoMo' :
               paymentMethod === 'airtel' ? 'Airtel Money' :
               paymentMethod === 'visa' ? 'VISA Card' : 'Split Payment'}
            </Typography>
          </div>
        </div>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button
          onClick={onClose}
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

// Receipt Modal Component
const ReceiptModal = ({ 
  open, 
  onClose, 
  receiptData, 
  receiptRef, 
  onExportPDF, 
  onExportExcel, 
  onShareWhatsApp,
  onCustomerReceipt 
}) => {
  const getPaymentMethodText = () => {
    if (!receiptData) return '';
    
    if (receiptData.paymentMethod === 'split') {
      return `Split Payment (Cash: UGX ${receiptData.splitPayment.cash?.toLocaleString()}, ${receiptData.splitPayment.digitalMethod}: UGX ${receiptData.splitPayment.digital?.toLocaleString()})`;
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '8px', maxHeight: '90vh' }
      }}
    >
      <div style={{ background: receiptData?.status === 'Cancelled' ? '#f44336' : '#002AFE', padding: '20px', borderRadius: '8px 8px 0 0', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">
          {receiptData?.status === 'Cancelled' ? 'Trip Cancelled' : 'Trip Receipt'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          {receiptData?.status === 'Cancelled' ? 'Trip has been cancelled' : 'Payment successful! Receipt generated.'}
        </Typography>
      </div>

      <DialogContent sx={{ p: 3 }}>
        <div ref={receiptRef} style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          {/* Receipt Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Typography variant="h5" fontWeight="bold" color={receiptData?.status === 'Cancelled' ? '#f44336' : '#002AFE'} gutterBottom>
              {receiptData?.status === 'Cancelled' ? 'CANCELLATION RECEIPT' : 'TRIP RECEIPT'}
            </Typography>
            <Typography variant="body2" color="#666">
              Enfuna Delivery Services
            </Typography>
            {receiptData?.header && (
              <Typography variant="subtitle2" color="#002AFE" sx={{ mt: 1 }}>
                {receiptData.header}
              </Typography>
            )}
          </div>

          {/* Receipt Details */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <Typography variant="caption" color="#666" display="block">Receipt No:</Typography>
                <Typography variant="body1" fontWeight="bold">{receiptData?.tripId}</Typography>
              </div>
              {receiptData?.transactionId && (
                <div>
                  <Typography variant="caption" color="#666" display="block">Transaction ID:</Typography>
                  <Typography variant="body1" fontWeight="bold">{receiptData?.transactionId}</Typography>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Typography variant="caption" color="#666" display="block">Date & Time:</Typography>
              <Typography variant="body1">
                {receiptData?.date} at {receiptData?.time}
              </Typography>
            </div>

            <Divider sx={{ my: 2 }} />

            {/* Trip Information */}
            <div style={{ marginBottom: '16px' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
                Trip Information
              </Typography>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <Typography variant="caption" color="#666">From:</Typography>
                  <Typography variant="body1">{receiptData?.pickup}</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="#666">To:</Typography>
                  <Typography variant="body1">{receiptData?.destination}</Typography>
                </div>
                {receiptData?.distance && (
                  <div>
                    <Typography variant="caption" color="#666">Distance:</Typography>
                    <Typography variant="body1">{receiptData?.distance} km</Typography>
                  </div>
                )}
                {receiptData?.duration && (
                  <div>
                    <Typography variant="caption" color="#666">Duration:</Typography>
                    <Typography variant="body1">{receiptData?.duration}</Typography>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            {receiptData?.customerName && (
              <div style={{ marginBottom: '16px' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
                  Customer Information
                </Typography>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <Typography variant="caption" color="#666">Name:</Typography>
                    <Typography variant="body1">{receiptData.customerName}</Typography>
                  </div>
                  {receiptData.customerPhone && (
                    <div>
                      <Typography variant="caption" color="#666">Phone:</Typography>
                      <Typography variant="body1">{receiptData.customerPhone}</Typography>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            {receiptData?.paymentMethod && (
              <div style={{ marginBottom: '16px' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
                  Payment Information
                </Typography>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <Typography variant="caption" color="#666">Payment Method:</Typography>
                    <Typography variant="body1">{getPaymentMethodText()}</Typography>
                  </div>
                  {receiptData?.amount && (
                    <div>
                      <Typography variant="caption" color="#666">Total Amount:</Typography>
                      <Typography variant="body1" fontWeight="bold" color="#002AFE">
                        UGX {receiptData?.amount?.toLocaleString()}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rider Information */}
            <div style={{ marginBottom: '16px' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="#002AFE" gutterBottom>
                Rider Information
              </Typography>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <Typography variant="caption" color="#666">Rider ID:</Typography>
                  <Typography variant="body1">{receiptData?.riderId}</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="#666">Vehicle:</Typography>
                  <Typography variant="body1">{receiptData?.vehicle}</Typography>
                </div>
              </div>
            </div>

            {/* Add cancellation reason if trip was cancelled */}
            {receiptData?.status === 'Cancelled' && receiptData?.cancelReason && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="#e65100" gutterBottom>
                  Cancellation Reason:
                </Typography>
                <Typography variant="body2">
                  {receiptData.cancelReason}
                </Typography>
              </Box>
            )}
          </div>

          {/* Footer */}
          <Divider sx={{ my: 2 }} />
          <div style={{ textAlign: 'center' }}>
            <Typography variant="caption" color="#666" display="block">
              Thank you for choosing Enfuna Delivery Services
            </Typography>
            <Typography variant="caption" color="#666">
              For inquiries: support@enfuna.com | +256 700 000 000
            </Typography>
          </div>
        </div>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            startIcon={<Print />}
            onClick={() => window.print()}
            sx={{ color: '#002AFE' }}
          >
            Print
          </Button>
          <Button
            startIcon={<Download />}
            onClick={onExportPDF}
            sx={{ color: '#002AFE' }}
          >
            Save as PDF
          </Button>
          {receiptData?.status !== 'Cancelled' && (
            <Button
              startIcon={<Receipt />}
              onClick={onCustomerReceipt}
              sx={{ color: '#4CAF50' }}
            >
              Customer Receipt
            </Button>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {receiptData?.status !== 'Cancelled' && (
            <Button
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
            sx={{ backgroundColor: receiptData?.status === 'Cancelled' ? '#f44336' : '#002AFE' }}
          >
            Done
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

// Deliveries History Component
const DeliveriesHistory = () => {
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
const ReceiveMoneyContent = ({ handlePaymentComplete }) => {
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
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

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="activate-code-btn"
          style={{ background: 'transparent', border: '1px solid #002AFE', color: '#002AFE' }}
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button 
          className="activate-code-btn"
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Record Payment
        </button>
      </div>
    </div>
  );
};

// Withdraw Money Content Component
const WithdrawMoneyContent = () => {
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

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="activate-code-btn"
          style={{ background: 'transparent', border: '1px solid #002AFE', color: '#002AFE' }}
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button 
          className="activate-code-btn"
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) < 5000}
        >
          Request Payout
        </button>
      </div>
    </div>
  );
};

// Add Expense Content Component
const AddExpenseContent = () => {
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

      <div style={{ display: 'flex', gap: '12px' }}>
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

export default DashboardPage;