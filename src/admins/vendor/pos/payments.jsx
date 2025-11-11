import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Card, CardContent, Grid, Dialog, DialogTitle, 
  DialogContent, DialogActions, Snackbar, Alert, TextField, RadioGroup, 
  FormControlLabel, Radio, InputAdornment, CardMedia, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select
} from "@mui/material";
import { useLocation } from 'react-router-dom';
import { CreditCard, AccountBalance, Lock } from '@mui/icons-material';
import Receipts from './receipts';

const PaymentsPage = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [receiptData, setReceiptData] = useState(null);
  const [vatRate] = useState(0.18); // 18% VAT rate
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment method logos mapping - using public folder paths
  const paymentLogos = {
    mtn: '/assets/mtn.jpg',
    airtel: '/assets/airtel.jpg',
    lyca: '/assets/lyca.png',
    paypal: '/assets/paypal.png',
    flutterwave: '/assets/flutter.png',
    stripe: '/assets/stripe.png',
    razorpay: '/assets/razor.png',
    paystack: '/assets/pay.png',
    credit: null, // default credit card icon will be used
    bank: null    // default bank icon will be used
  };

  useEffect(() => {
    if (location.state && location.state.cartItems) {
      setCartItems(location.state.cartItems);
    }
  }, [location]);

  const calculateVAT = (amount) => {
    return amount * vatRate;
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const vatAmount = calculateVAT(totalAmount);
  const grandTotal = totalAmount + vatAmount;

  const simulatePayment = () => {
    setIsProcessing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsProcessing(false);
        resolve(true);
      }, 2000);
    });
  };

  const handleConfirmPayment = async () => {
    const success = await simulatePayment();
    
    if (success) {
      const transactionId = `TXN${Date.now()}`;
      const provider = paymentMethod === "thirdParty" 
        ? paymentDetails.thirdPartyProvider 
        : paymentDetails.provider || paymentMethod;
      
      const newTransaction = {
        id: transactionId,
        amount: totalAmount,
        vat: vatAmount,
        grandTotal: grandTotal,
        method: paymentMethod,
        provider: provider,
        date: new Date().toLocaleString(),
        items: [...cartItems],
        vatRate: vatRate,
        logo: paymentLogos[provider?.toLowerCase()] || null
      };
      
      setPaymentHistory([...paymentHistory, newTransaction]);
      setReceiptData(newTransaction);
      setOpenConfirmationDialog(false);
      setOpenSuccessDialog(true);
    } else {
      setSnackbarMessage("Payment failed. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleSuccessClose = () => {
    setOpenSuccessDialog(false);
    setSnackbarMessage("Payment successful!");
    setOpenSnackbar(true);
  };
  

  const renderPaymentMethodFields = () => {
    switch (paymentMethod) {
      case "credit":
        return (
          <Box>
            <TextField 
              fullWidth 
              label="Card Number" 
              variant="outlined" 
              margin="normal" 
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard />
                  </InputAdornment>
                ) 
              }} 
            />
            <TextField 
              fullWidth 
              label="Password" 
              type="password" 
              variant="outlined" 
              margin="normal" 
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ) 
              }} 
            />
          </Box>
        );
      case "mobile":
        return (
          <Box>
            <Select 
              fullWidth 
              value={paymentDetails.provider || ""} 
              onChange={(e) => setPaymentDetails({ ...paymentDetails, provider: e.target.value })} 
              displayEmpty
              sx={{ mt: 2 }}
            >
              <MenuItem value="">Select Mobile Provider</MenuItem>
              <MenuItem value="MTN">
                <Box display="flex" alignItems="center">
                  <img src={paymentLogos.mtn} alt="MTN" style={{ width: 24, marginRight: 8 }} />
                  MTN Mobile Money
                </Box>
              </MenuItem>
              <MenuItem value="Airtel">
                <Box display="flex" alignItems="center">
                  <img src={paymentLogos.airtel} alt="Airtel" style={{ width: 24, marginRight: 8 }} />
                  Airtel Money
                </Box>
              </MenuItem>
              <MenuItem value="Lyca">
                <Box display="flex" alignItems="center">
                  <img src={paymentLogos.lyca} alt="Lyca" style={{ width: 24, marginRight: 8 }} />
                  Lyca Mobile Money
                </Box>
              </MenuItem>
            </Select>
            <TextField fullWidth label="Mobile Number" variant="outlined" margin="normal" />
            <TextField fullWidth label="PIN" type="password" variant="outlined" margin="normal" />
          </Box>
        );
      case "bank":
        return (
          <Box>
            <TextField fullWidth label="Bank Name" variant="outlined" margin="normal" />
            <TextField 
              fullWidth 
              label="Account Number" 
              variant="outlined" 
              margin="normal" 
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance />
                  </InputAdornment>
                ) 
              }} 
            />
          </Box>
        );
      case "thirdParty":
        return (
          <Box>
            <Select 
              fullWidth 
              value={paymentDetails.thirdPartyProvider || ""} 
              onChange={(e) => setPaymentDetails({ ...paymentDetails, thirdPartyProvider: e.target.value })} 
              displayEmpty
              sx={{ mt: 2 }}
            >
              <MenuItem value="">Select Payment Gateway</MenuItem>
              <MenuItem value="PayPal">
                <Box display="flex" alignItems="center">
                  <img src={paymentLogos.paypal} alt="PayPal" style={{ width: 24, marginRight: 8 }} />
                  PayPal
                </Box>
              </MenuItem>
              <MenuItem value="Flutterwave">
                <Box display="flex" alignItems="center">
                  <img src={paymentLogos.flutterwave} alt="Flutterwave" style={{ width: 24, marginRight: 8 }} />
                  Flutterwave
                </Box>
              </MenuItem>
              <MenuItem value="Stripe">
                <Box display="flex" alignItems="center">
                  <img src={paymentLogos.stripe} alt="Stripe" style={{ width: 24, marginRight: 8 }} />
                  Stripe
                </Box>
              </MenuItem>
              <MenuItem value="Razorpay">
                <Box display="flex" alignItems="center">
                  <img src={paymentLogos.razorpay} alt="Razorpay" style={{ width: 24, marginRight: 8 }} />
                  Razorpay
                </Box>
              </MenuItem>
              <MenuItem value="Paystack">
                <Box display="flex" alignItems="center">
                  <img src={paymentLogos.paystack} alt="Paystack" style={{ width: 24, marginRight: 8 }} />
                  Paystack
                </Box>
              </MenuItem>
            </Select>
            {paymentDetails.thirdPartyProvider && (
              <Typography variant="body2" color="textSecondary" mt={1}>
                You will be redirected to {paymentDetails.thirdPartyProvider} to complete your payment
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Payment Information
      </Typography>
      
      <Grid container spacing={3}>
        {cartItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia 
                component="img" 
                image={item.image} 
                alt={item.name} 
                sx={{ height: 150, objectFit: "contain" }} 
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1">UGX {item.price.toLocaleString()}</Typography>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                <Typography variant="body1">
                  Subtotal: UGX {(item.price * item.quantity).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
        <Typography variant="h6" color="textSecondary">
          Order Summary
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography>Subtotal:</Typography>
          <Typography>UGX {totalAmount.toLocaleString()}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography>VAT ({vatRate * 100}%):</Typography>
          <Typography>UGX {vatAmount.toLocaleString()}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="h6" color="primary">Total:</Typography>
          <Typography variant="h6" color="primary">UGX {grandTotal.toLocaleString()}</Typography>
        </Box>
      </Box>

      <Typography variant="h6" color="textSecondary" mt={2}>
        Select Payment Method
      </Typography>

      <RadioGroup 
        row 
        value={paymentMethod} 
        onChange={(e) => setPaymentMethod(e.target.value)} 
        sx={{ mb: 3 }}
      >
        <FormControlLabel value="credit" control={<Radio />} label="Credit/Debit Card" />
        <FormControlLabel value="mobile" control={<Radio />} label="Mobile Money" />
        <FormControlLabel value="bank" control={<Radio />} label="Bank Transfer" />
        <FormControlLabel value="thirdParty" control={<Radio />} label="Third Party Payment" />
      </RadioGroup>

      {renderPaymentMethodFields()}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setOpenConfirmationDialog(true)} 
        sx={{ mt: 3, backgroundColor: '#4caf50' }}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Proceed to Payment (UGX ${grandTotal.toLocaleString()})`}
      </Button>

      <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          {paymentMethod === "thirdParty" && paymentDetails.thirdPartyProvider && (
            <Box display="flex" alignItems="center" mb={2}>
              <img 
                src={paymentLogos[paymentDetails.thirdPartyProvider.toLowerCase()]} 
                alt={paymentDetails.thirdPartyProvider} 
                style={{ width: 40, marginRight: 10 }} 
              />
              <Typography variant="h6">{paymentDetails.thirdPartyProvider}</Typography>
            </Box>
          )}
          {paymentMethod === "mobile" && paymentDetails.provider && (
            <Box display="flex" alignItems="center" mb={2}>
              <img 
                src={paymentLogos[paymentDetails.provider.toLowerCase()]} 
                alt={paymentDetails.provider} 
                style={{ width: 40, marginRight: 10 }} 
              />
              <Typography variant="h6">{paymentDetails.provider}</Typography>
            </Box>
          )}
          <Typography>Subtotal: UGX {totalAmount.toLocaleString()}</Typography>
          <Typography>VAT ({vatRate * 100}%): UGX {vatAmount.toLocaleString()}</Typography>
          <Typography variant="h6" mt={1}>Total Amount: UGX {grandTotal.toLocaleString()}</Typography>
          <Typography mt={2}>Do you confirm this payment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPayment} color="primary" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openSuccessDialog} 
        onClose={handleSuccessClose} 
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            Payment Successful!
          </Box>
        </DialogTitle>
        <DialogContent>
          {receiptData && (
            <Receipts 
              receiptData={receiptData} 
              onClose={handleSuccessClose} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {paymentHistory.length > 0 && (
        <>
          <Typography variant="h5" mt={4} gutterBottom>
            Payment History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Amount (UGX)</TableCell>
                  <TableCell>VAT (UGX)</TableCell>
                  <TableCell>Total (UGX)</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {paymentHistory.map((transaction) => (
    <TableRow key={transaction.id}>
      <TableCell>{transaction.id}</TableCell>
      <TableCell>{transaction.amount.toLocaleString()}</TableCell>
      <TableCell>{transaction.vat.toLocaleString()}</TableCell>
      <TableCell>{transaction.grandTotal.toLocaleString()}</TableCell>
      <TableCell>
        {transaction.method === "credit" ? "Credit/Debit Card" : 
         transaction.method === "mobile" ? transaction.provider : 
         transaction.method === "thirdParty" ? transaction.provider : 
         "Bank Transfer"}
      </TableCell>
      <TableCell>{transaction.date}</TableCell>
    </TableRow>
  ))}
</TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default PaymentsPage;