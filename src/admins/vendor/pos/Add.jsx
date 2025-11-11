import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Autocomplete,
  Divider,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add,
  Remove,
  Search,
  Inventory,
  LocalShipping,
  AccountBalance,
  CheckCircle,
  ArrowBack,
  CalendarToday,
  Delete,
  Receipt,
  Print,
  Email,
  Info,
  AttachMoney
} from '@mui/icons-material';

const AddPurchasePage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [supplier, setSupplier] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [notes, setNotes] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [supplierEmail, setSupplierEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Withholding Tax State
  const [withholdingTaxEnabled, setWithholdingTaxEnabled] = useState(false);
  const [withholdingTaxRate, setWithholdingTaxRate] = useState(0.06); // 6%
  
  // Sample items data
  const [items, setItems] = useState([
    { id: 1, product: 'Fresh Tomatoes (1kg)', quantity: 0, price: 5000, total: 0 },
    { id: 2, product: 'Rice (50kg bag)', quantity: 0, price: 150000, total: 0 },
    { id: 3, product: 'Vegetable Oil (5L)', quantity: 0, price: 25000, total: 0 },
    { id: 4, product: 'Sugar (1kg)', quantity: 0, price: 3500, total: 0 },
    { id: 5, product: 'Salt (1kg)', quantity: 0, price: 2000, total: 0 }
  ]);

  // New item state
  const [newItem, setNewItem] = useState({
    product: '',
    price: 0,
    quantity: 0
  });

  // Sample suppliers
  const suppliers = [
    'Wasswa Fresh Produce',
    'Namukasa Foods Ltd',
    'Kampala Beverage Distributors',
    'Uganda Grain Millers',
    'Jinja Dairy Farm'
  ];

  const handleQuantityChange = (id, value) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const quantity = parseInt(value) || 0;
        return {
          ...item,
          quantity,
          total: quantity * item.price
        };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleAddItem = () => {
    if (newItem.product && newItem.price > 0) {
      const newItemWithId = {
        ...newItem,
        id: items.length + 1,
        total: newItem.quantity * newItem.price
      };
      setItems([...items, newItemWithId]);
      setNewItem({
        product: '',
        price: 0,
        quantity: 0
      });
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    setEmailDialogOpen(true);
  };

  const handleSendEmail = () => {
    // Here you would typically send the purchase order to the supplier's email
    console.log('Sending purchase order to:', supplierEmail);
    alert(`Purchase order sent to ${supplierEmail}`);
    setEmailDialogOpen(false);
    // Reset form or navigate away
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% VAT
  };

  const calculateWithholdingTax = () => {
    if (!withholdingTaxEnabled) return 0;
    return calculateSubtotal() * withholdingTaxRate;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const withholdingTax = calculateWithholdingTax();
    return subtotal + tax - withholdingTax;
  };

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const steps = ['Supplier & Details', 'Add Items', 'Review & Submit'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount);
  };

  const renderReceipt = () => (
    <Box sx={{ p: 3, maxWidth: 400, bgcolor: 'background.paper' }} id="purchase-receipt">
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>PURCHASE ORDER</Typography>
        <Typography variant="body2">123 Business Street, Kampala</Typography>
        <Typography variant="body2">Tel: +256 123 456 789</Typography>
        <Typography variant="body2">Tax ID: 123456789</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6" fontWeight="bold">ORDER DETAILS</Typography>
        <Typography variant="caption">{new Date().toLocaleDateString()}</Typography>
        <Typography variant="body2">PO #: PO-{Date.now().toString().slice(-6)}</Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography fontWeight="bold">Supplier:</Typography>
        <Typography>{supplier}</Typography>
        <Typography>Delivery: {deliveryDate}</Typography>
        <Typography>Terms: {paymentTerms} days</Typography>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.filter(item => item.quantity > 0).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                <TableCell align="right">{formatCurrency(item.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ textAlign: 'right' }}>
        <Typography>Subtotal: {formatCurrency(calculateSubtotal())}</Typography>
        <Typography>Tax (18%): {formatCurrency(calculateTax())}</Typography>
        {withholdingTaxEnabled && (
          <Typography>Withholding Tax (6%): -{formatCurrency(calculateWithholdingTax())}</Typography>
        )}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
          Total: {formatCurrency(calculateTotal())}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary">
            Create Purchase Order
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Add new inventory purchases
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            href="/purchases"
          >
            Back to Purchases
          </Button>
        </Box>
      </Box>

      {/* Stepper */}
      <Box mb={3}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step 1: Supplier & Details */}
      {activeStep === 0 && (
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Supplier Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={suppliers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Supplier"
                      required
                      fullWidth
                      helperText="Choose from existing suppliers or type to add new"
                    />
                  )}
                  value={supplier}
                  onChange={(event, newValue) => {
                    setSupplier(newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Delivery Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday />
                      </InputAdornment>
                    ),
                  }}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Payment Terms (days)"
                  type="number"
                  fullWidth
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  helperText="Number of days for payment"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={withholdingTaxEnabled}
                      onChange={(e) => setWithholdingTaxEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center">
                      <Typography>Apply 6% Withholding Tax</Typography>
                      <Tooltip title="Withholding tax is deducted from the total amount payable to the supplier">
                        <Info sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
                      </Tooltip>
                    </Box>
                  }
                />
                {withholdingTaxEnabled && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    6% withholding tax will be deducted from the total amount
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  multiline
                  rows={3}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes or special instructions..."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Add Items */}
      {activeStep === 1 && (
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Add Items to Purchase Order
            </Typography>
            
            {/* Add New Item Form */}
            <Box mb={3} p={2} border={1} borderRadius={2} borderColor="grey.300" bgcolor="grey.50">
              <Typography variant="h6" gutterBottom>Add New Item</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    value={newItem.product}
                    onChange={(e) => setNewItem({...newItem, product: e.target.value})}
                    placeholder="Enter product name"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Price (UGX)"
                    type="number"
                    fullWidth
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="textSecondary">
                    Total: {formatCurrency(newItem.quantity * newItem.price)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={handleAddItem}
                    disabled={!newItem.product || newItem.price <= 0}
                    startIcon={<Add />}
                  >
                    Add Item
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Search and Summary */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <TextField
                variant="outlined"
                placeholder="Search products..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 400 }}
              />
              <Chip 
                label={`${items.filter(item => item.quantity > 0).length} items selected`}
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* Items Table */}
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Unit Price (UGX)</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total (UGX)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow 
                      key={item.id}
                      sx={{ 
                        backgroundColor: item.quantity > 0 ? 'action.hover' : 'transparent',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Inventory sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography fontWeight={item.quantity > 0 ? 'bold' : 'normal'}>
                            {item.product}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          InputProps={{
                            inputProps: { min: 0 }
                          }}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          fontWeight="bold" 
                          color={item.total > 0 ? 'primary.main' : 'text.primary'}
                        >
                          {formatCurrency(item.total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveItem(item.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Quick Summary */}
            {items.filter(item => item.quantity > 0).length > 0 && (
              <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Order Preview: {formatCurrency(calculateSubtotal())} • {items.filter(item => item.quantity > 0).length} items
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {activeStep === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Order Summary
                </Typography>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Supplier</Typography>
                    <Typography>{supplier || 'Not selected'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Delivery Date</Typography>
                    <Typography>{deliveryDate || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Payment Terms</Typography>
                    <Typography>{paymentTerms} days</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Withholding Tax</Typography>
                    <Typography color={withholdingTaxEnabled ? "primary.main" : "text.secondary"}>
                      {withholdingTaxEnabled ? '6% Applied' : 'Not Applied'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Notes</Typography>
                    <Typography>{notes || 'No notes'}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="h5" gutterBottom color="primary">
                  Items
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.filter(item => item.quantity > 0).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Inventory sx={{ mr: 1, color: 'primary.main' }} />
                              {item.product}
                            </Box>
                          </TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {formatCurrency(item.total)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3, position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Order Total
                </Typography>
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatCurrency(calculateSubtotal())}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tax (18%):</Typography>
                    <Typography>{formatCurrency(calculateTax())}</Typography>
                  </Box>
                  {withholdingTaxEnabled && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Withholding Tax (6%):</Typography>
                      <Typography color="error.main">-{formatCurrency(calculateWithholdingTax())}</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary.main">
                      {formatCurrency(calculateTotal())}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<CheckCircle />}
                  onClick={handleSubmit}
                  sx={{ mb: 2 }}
                >
                  Submit Purchase Order
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Email />}
                  onClick={() => setEmailDialogOpen(true)}
                >
                  Send via Email
                </Button>
              </CardContent>
            </Card>

            {/* Receipt Preview */}
            <Card sx={{ mt: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Receipt Preview
                </Typography>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {renderReceipt()}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Navigation Buttons */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Box display="flex" gap={2}>
          {activeStep === steps.length - 1 && (
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={() => window.print()}
            >
              Print PO
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1 || (activeStep === 1 && items.filter(item => item.quantity > 0).length === 0)}
          >
            {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </Box>
      </Box>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Email sx={{ mr: 1 }} />
            Send Purchase Order
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Send the purchase order to the supplier's email address:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Supplier Email"
            type="email"
            fullWidth
            variant="outlined"
            value={supplierEmail}
            onChange={(e) => setSupplierEmail(e.target.value)}
            placeholder="supplier@company.com"
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            The purchase order will be sent as a PDF attachment
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendEmail} 
            variant="contained"
            disabled={!supplierEmail.includes('@')}
            startIcon={<Email />}
          >
            Send Purchase Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddPurchasePage;