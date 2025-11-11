import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  Refresh,
  Visibility,
  Receipt,
  Inventory,
  ArrowBack,
  CheckCircle,
  Close,
  LocalShipping,
  AccountBalance,
  CalendarToday,
  Edit,
  Payment,
  TrackChanges,
  Assignment,
  Store,
  LocationOn,
  AccessTime,
  CheckCircleOutline,
  Cancel
} from '@mui/icons-material';

// Sample purchase orders data with Ugandan suppliers
const purchaseOrders = [
  {
    id: 'PO-2023-001',
    supplier: 'Wasswa Fresh Produce',
    date: '2023-06-15',
    items: 8,
    total: 4500000,
    status: 'completed',
    paymentStatus: 'paid',
    deliveryStatus: 'delivered',
    dueDate: '2023-06-30',
    itemsDetails: [
      { id: 1, name: 'Fresh Tomatoes (1kg)', quantity: 20, price: 5000, total: 100000 },
      { id: 2, name: 'Rice (50kg bag)', quantity: 5, price: 150000, total: 750000 },
      { id: 3, name: 'Vegetable Oil (5L)', quantity: 10, price: 25000, total: 250000 }
    ],
    deliveryTracking: [
      { status: 'ordered', date: '2023-06-15 10:30', description: 'Order placed with supplier' },
      { status: 'confirmed', date: '2023-06-16 09:15', description: 'Supplier confirmed order' },
      { status: 'packed', date: '2023-06-18 14:20', description: 'Items packed and ready for shipment' },
      { status: 'shipped', date: '2023-06-19 11:45', description: 'Items shipped from supplier' },
      { status: 'in_transit', date: '2023-06-20 16:30', description: 'Items in transit to warehouse' },
      { status: 'delivered', date: '2023-06-22 13:15', description: 'Items delivered to warehouse' }
    ],
    payments: [
      { id: 1, date: '2023-06-25', amount: 4500000, method: 'Bank Transfer', reference: 'TRX-789456' }
    ],
    invoice: { id: 'INV-2023-001', date: '2023-06-15', dueDate: '2023-06-30' }
  },
  {
    id: 'PO-2023-002',
    supplier: 'Namukasa Foods Ltd',
    date: '2023-06-10',
    items: 5,
    total: 3200000,
    status: 'completed',
    paymentStatus: 'partial',
    deliveryStatus: 'delivered',
    dueDate: '2023-06-25',
    itemsDetails: [
      { id: 1, name: 'Sugar (1kg)', quantity: 50, price: 3500, total: 175000 },
      { id: 2, name: 'Salt (1kg)', quantity: 30, price: 2000, total: 60000 },
      { id: 3, name: 'Beans (1kg)', quantity: 40, price: 3000, total: 120000 }
    ],
    deliveryTracking: [
      { status: 'ordered', date: '2023-06-10 11:20', description: 'Order placed with supplier' },
      { status: 'confirmed', date: '2023-06-11 10:45', description: 'Supplier confirmed order' },
      { status: 'packed', date: '2023-06-13 15:30', description: 'Items packed and ready for shipment' },
      { status: 'shipped', date: '2023-06-14 12:10', description: 'Items shipped from supplier' },
      { status: 'delivered', date: '2023-06-16 14:25', description: 'Items delivered to warehouse' }
    ],
    payments: [
      { id: 1, date: '2023-06-20', amount: 2000000, method: 'Mobile Money', reference: 'MM-123456' },
      { id: 2, date: '2023-06-25', amount: 1200000, method: 'Cash', reference: 'CSH-789123' }
    ],
    invoice: { id: 'INV-2023-002', date: '2023-06-10', dueDate: '2023-06-25' }
  },
  {
    id: 'PO-2023-003',
    supplier: 'Kampala Beverage Distributors',
    date: '2023-06-05',
    items: 12,
    total: 7800000,
    status: 'pending',
    paymentStatus: 'unpaid',
    deliveryStatus: 'processing',
    dueDate: '2023-06-20',
    itemsDetails: [
      { id: 1, name: 'Soda (24 bottles)', quantity: 10, price: 45000, total: 450000 },
      { id: 2, name: 'Juice (1L)', quantity: 25, price: 8000, total: 200000 },
      { id: 3, name: 'Water (500ml)', quantity: 100, price: 1000, total: 100000 }
    ],
    deliveryTracking: [
      { status: 'ordered', date: '2023-06-05 09:45', description: 'Order placed with supplier' },
      { status: 'confirmed', date: '2023-06-06 08:30', description: 'Supplier confirmed order' },
      { status: 'packed', date: '2023-06-08 13:15', description: 'Items packed and ready for shipment' }
    ],
    payments: [],
    invoice: { id: 'INV-2023-003', date: '2023-06-05', dueDate: '2023-06-20' }
  }
];

// Sample products for editing
const products = [
  { id: 1, name: 'Fresh Tomatoes (1kg)', category: 'Vegetables', price: 5000, stock: 150, supplier: 'Wasswa Fresh Produce' },
  { id: 2, name: 'Rice (50kg bag)', category: 'Grains', price: 150000, stock: 25, supplier: 'Uganda Grain Millers' },
  { id: 3, name: 'Vegetable Oil (5L)', category: 'Cooking Oil', price: 25000, stock: 40, supplier: 'Namukasa Foods Ltd' },
  { id: 4, name: 'Sugar (1kg)', category: 'Sweeteners', price: 3500, stock: 80, supplier: 'Kampala Beverage Distributors' },
  { id: 5, name: 'Salt (1kg)', category: 'Seasonings', price: 2000, stock: 60, supplier: 'Jinja Dairy Farm' }
];

const ListPurchasesPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogView, setDialogView] = useState('details'); // 'details', 'tracking', 'invoice', 'payment', 'products'
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [paymentReference, setPaymentReference] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    const matchesDelivery = deliveryFilter === 'all' || order.deliveryStatus === deliveryFilter;
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDelivery;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (order, view = 'details') => {
    setSelectedOrder(order);
    setDialogView(view);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPaymentAmount('');
    setPaymentMethod('Bank Transfer');
    setPaymentReference('');
    setEditingProduct(null);
  };

  const handleRecordPayment = () => {
    if (selectedOrder && paymentAmount > 0) {
      // In a real app, this would update the backend
      alert(`Payment of ${formatCurrency(paymentAmount)} recorded for ${selectedOrder.id}`);
      setOpenDialog(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setDialogView('editProduct');
  };

  const handleSaveProduct = () => {
    // In a real app, this would update the backend
    alert(`Product ${editingProduct.name} updated successfully`);
    setOpenDialog(false);
  };

  const getDeliveryStep = (status) => {
    const steps = ['ordered', 'confirmed', 'packed', 'shipped', 'in_transit', 'delivered'];
    return steps.indexOf(status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered': return <Assignment color="info" />;
      case 'confirmed': return <CheckCircleOutline color="info" />;
      case 'packed': return <Inventory color="info" />;
      case 'shipped': return <LocalShipping color="warning" />;
      case 'in_transit': return <TrackChanges color="warning" />;
      case 'delivered': return <CheckCircle color="success" />;
      default: return <Cancel color="error" />;
    }
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Purchase Orders
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage your inventory purchases
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Store />}
            onClick={() => handleViewDetails(null, 'products')}
          >
            Manage Products
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            href="/pos/add"
          >
            New Purchase
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search purchases..."
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
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Payment</InputLabel>
            <Select
              value={paymentFilter}
              label="Payment"
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <MenuItem value="all">All Payments</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="partial">Partial</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Delivery</InputLabel>
            <Select
              value={deliveryFilter}
              label="Delivery"
              onChange={(e) => setDeliveryFilter(e.target.value)}
            >
              <MenuItem value="all">All Deliveries</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setPaymentFilter('all');
            setDeliveryFilter('all');
          }}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Purchases Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    color={
                      order.status === 'completed' ? 'success' :
                      order.status === 'pending' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    color={
                      order.paymentStatus === 'paid' ? 'success' :
                      order.paymentStatus === 'partial' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)}
                    color={
                      order.deliveryStatus === 'delivered' ? 'success' :
                      order.deliveryStatus === 'processing' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(order, 'details')}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Details, Tracking, Invoice, Payment, and Products */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {dialogView === 'details' && 'Purchase Order Details'}
              {dialogView === 'tracking' && 'Delivery Tracking'}
              {dialogView === 'invoice' && 'Invoice Details'}
              {dialogView === 'payment' && 'Record Payment'}
              {dialogView === 'products' && 'Manage Products'}
              {dialogView === 'editProduct' && 'Edit Product'}
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Details View */}
          {selectedOrder && dialogView === 'details' && (
            <Box>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Box>
                  <Typography variant="h6">{selectedOrder.id}</Typography>
                  <Typography variant="subtitle1">{selectedOrder.supplier}</Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2">Date: {formatDate(selectedOrder.date)}</Typography>
                  <Typography variant="body2">Due Date: {formatDate(selectedOrder.dueDate)}</Typography>
                </Box>
              </Box>

              {/* Status Indicators */}
              <Box display="flex" gap={2} mb={3}>
                <Chip
                  label={`Status: ${selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}`}
                  color={
                    selectedOrder.status === 'completed' ? 'success' :
                    selectedOrder.status === 'pending' ? 'warning' : 'error'
                  }
                />
                <Chip
                  label={`Payment: ${selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}`}
                  color={
                    selectedOrder.paymentStatus === 'paid' ? 'success' :
                    selectedOrder.paymentStatus === 'partial' ? 'warning' : 'error'
                  }
                />
                <Chip
                  label={`Delivery: ${selectedOrder.deliveryStatus.charAt(0).toUpperCase() + selectedOrder.deliveryStatus.slice(1)}`}
                  color={
                    selectedOrder.deliveryStatus === 'delivered' ? 'success' :
                    selectedOrder.deliveryStatus === 'processing' ? 'warning' : 'error'
                  }
                />
              </Box>

              {/* Items Table */}
              <Typography variant="h6" gutterBottom>Items Ordered</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.itemsDetails.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Summary */}
              <Box display="flex" justifyContent="flex-end">
                <TableContainer component={Paper} variant="outlined" sx={{ width: 300 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Subtotal</TableCell>
                        <TableCell align="right">{formatCurrency(selectedOrder.total * 0.95)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax (5%)</TableCell>
                        <TableCell align="right">{formatCurrency(selectedOrder.total * 0.05)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(selectedOrder.total)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Actions */}
              <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<Receipt />}
                  onClick={() => setDialogView('invoice')}
                >
                  View Invoice
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<LocalShipping />}
                  onClick={() => setDialogView('tracking')}
                >
                  Track Delivery
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<AccountBalance />}
                  onClick={() => setDialogView('payment')}
                >
                  Record Payment
                </Button>
                <Button variant="contained" startIcon={<CheckCircle />}>
                  Mark as Completed
                </Button>
              </Box>
            </Box>
          )}

          {/* Delivery Tracking View */}
          {selectedOrder && dialogView === 'tracking' && (
            <Box>
              <Typography variant="h6" gutterBottom>Delivery Tracking for {selectedOrder.id}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Supplier: {selectedOrder.supplier}
              </Typography>
              
              <Stepper activeStep={getDeliveryStep(selectedOrder.deliveryTracking[selectedOrder.deliveryTracking.length - 1].status)} orientation="vertical" sx={{ mt: 2 }}>
                {selectedOrder.deliveryTracking.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      icon={getStatusIcon(step.status)}
                      optional={
                        <Typography variant="caption">
                          {formatDateTime(step.date)}
                        </Typography>
                      }
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {step.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Typography>
                      <Typography variant="body2">
                        {step.description}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>Delivery Progress</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(getDeliveryStep(selectedOrder.deliveryTracking[selectedOrder.deliveryTracking.length - 1].status) / 5) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption">Order Placed</Typography>
                  <Typography variant="caption">Delivered</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Invoice View */}
          {selectedOrder && dialogView === 'invoice' && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Box>
                  <Typography variant="h4">INVOICE</Typography>
                  <Typography variant="h6">{selectedOrder.invoice.id}</Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body1">Date: {formatDate(selectedOrder.invoice.date)}</Typography>
                  <Typography variant="body1">Due Date: {formatDate(selectedOrder.invoice.dueDate)}</Typography>
                </Box>
              </Box>
              
              <Grid container spacing={3} mb={3}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>From:</Typography>
                  <Typography variant="body1">{selectedOrder.supplier}</Typography>
                  <Typography variant="body2">Kampala, Uganda</Typography>
                  <Typography variant="body2">+256 750 123456</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>To:</Typography>
                  <Typography variant="body1">Your Business Name</Typography>
                  <Typography variant="body2">Kampala, Uganda</Typography>
                  <Typography variant="body2">+256 750 654321</Typography>
                </Grid>
              </Grid>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.itemsDetails.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <TableContainer component={Paper} variant="outlined" sx={{ width: 300 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Subtotal</TableCell>
                        <TableCell align="right">{formatCurrency(selectedOrder.total * 0.95)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax (5%)</TableCell>
                        <TableCell align="right">{formatCurrency(selectedOrder.total * 0.05)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(selectedOrder.total)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              
              <Box mt={3}>
                <Typography variant="body2" color="textSecondary">
                  Payment Terms: {selectedOrder.paymentStatus === 'paid' ? 'Paid in full' : 'Due upon receipt'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Thank you for your business!
                </Typography>
              </Box>
            </Box>
          )}

          {/* Payment View */}
          {selectedOrder && dialogView === 'payment' && (
            <Box>
              <Typography variant="h6" gutterBottom>Record Payment for {selectedOrder.id}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Supplier: {selectedOrder.supplier} | Total: {formatCurrency(selectedOrder.total)}
              </Typography>
              
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    label="Payment Amount (UGX)"
                    type="number"
                    fullWidth
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      label="Payment Method"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Check">Check</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Reference Number"
                    fullWidth
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Payment Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </Grid>
              </Grid>
              
              {selectedOrder.payments.length > 0 && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>Previous Payments</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell>Reference</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>{payment.reference}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}

          {/* Products Management View */}
          {dialogView === 'products' && (
            <Box>
              <Typography variant="h6" gutterBottom>Manage Products</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Add, edit, or remove products from your inventory
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price (UGX)</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.supplier}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditProduct(product)}>
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box mt={3}>
                <Button variant="contained" startIcon={<Add />}>
                  Add New Product
                </Button>
              </Box>
            </Box>
          )}

          {/* Edit Product View */}
          {dialogView === 'editProduct' && editingProduct && (
            <Box>
              <Typography variant="h6" gutterBottom>Edit Product</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Category"
                    fullWidth
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Price (UGX)"
                    type="number"
                    fullWidth
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Stock"
                    type="number"
                    fullWidth
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Supplier</InputLabel>
                    <Select
                      value={editingProduct.supplier}
                      label="Supplier"
                      onChange={(e) => setEditingProduct({...editingProduct, supplier: e.target.value})}
                    >
                      {purchaseOrders.map(order => (
                        <MenuItem key={order.supplier} value={order.supplier}>{order.supplier}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {dialogView === 'payment' && (
            <>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleRecordPayment}
                disabled={!paymentAmount || paymentAmount <= 0}
              >
                Record Payment
              </Button>
            </>
          )}
          {dialogView === 'editProduct' && (
            <>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveProduct}>
                Save Changes
              </Button>
            </>
          )}
          {(dialogView === 'tracking' || dialogView === 'invoice' || dialogView === 'products') && (
            <Button onClick={() => setDialogView('details')}>
              Back to Details
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListPurchasesPage;