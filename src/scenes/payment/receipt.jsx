import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  
  
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  Search,
  Add,
  Print,
  ArrowBack,
  Delete,
  Edit,
  Receipt,
  LocalAtm,
  CreditCard,
  AccountBalance,
  ShoppingCart,
  Refresh,
  Close,
  Person
} from '@mui/icons-material';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const SalesReceiptApp = () => {
  const theme = useTheme();
  const [receipts, setReceipts] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'preview'
  
  const [currentReceipt, setCurrentReceipt] = useState({
    id: uuidv4(),
    number: `R-${Math.floor(10000 + Math.random() * 90000)}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    customer: {
      name: '',
      email: '',
      phone: '',
    },
    items: [],
    payment: {
      method: 'credit',
      amount: 0,
      changeDue: 0,
    },
    tax: 0,
    subtotal: 0,
    total: 0,
    cashier: 'Cashier Name', // Would normally come from auth system
    notes: '',
  });

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: <LocalAtm /> },
    { id: 'credit', name: 'Credit Card', icon: <CreditCard /> },
    { id: 'debit', name: 'Debit Card', icon: <AccountBalance /> },
    { id: 'mobile', name: 'Mobile Payment', icon: <LocalAtm /> },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement API calls
        /*
        const [itemsRes, receiptsRes] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/receipts')
        ]);
        
        setItems(await itemsRes.json());
        setReceipts(await receiptsRes.json());
        */
        
        // Initialize with empty arrays
        setItems([]);
        setReceipts([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate receipt totals
  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = items.reduce((sum, item) => sum + (item.price * item.quantity * (item.taxRate || 0)), 0);
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  // Add item to receipt
  const addItemToReceipt = (item) => {
    const existingItem = currentReceipt.items.find(i => i.id === item.id);
    
    if (existingItem) {
      const updatedItems = currentReceipt.items.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      setCurrentReceipt({
        ...currentReceipt,
        items: updatedItems,
        ...calculateTotals(updatedItems),
      });
    } else {
      const newItem = { ...item, quantity: 1 };
      const updatedItems = [...currentReceipt.items, newItem];
      setCurrentReceipt({
        ...currentReceipt,
        items: updatedItems,
        ...calculateTotals(updatedItems),
      });
    }
  };

  // Remove item from receipt
  const removeItemFromReceipt = (itemId) => {
    const updatedItems = currentReceipt.items.filter(item => item.id !== itemId);
    setCurrentReceipt({
      ...currentReceipt,
      items: updatedItems,
      ...calculateTotals(updatedItems),
    });
  };

  // Update item quantity
  const updateItemQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    
    const updatedItems = currentReceipt.items.map(item =>
      item.id === itemId ? { ...item, quantity: parseInt(quantity) } : item
    );
    
    setCurrentReceipt({
      ...currentReceipt,
      items: updatedItems,
      ...calculateTotals(updatedItems),
    });
  };

  // Handle payment amount change
  const handlePaymentAmountChange = (amount) => {
    const paymentAmount = parseFloat(amount) || 0;
    const changeDue = paymentAmount - currentReceipt.total;
    
    setCurrentReceipt({
      ...currentReceipt,
      payment: {
        ...currentReceipt.payment,
        amount: paymentAmount,
        changeDue: changeDue > 0 ? changeDue : 0,
      },
    });
  };

  // Save receipt
  const saveReceipt = async () => {
    try {
      // TODO: Implement API call to save receipt
      /*
      const response = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentReceipt)
      });
      const savedReceipt = await response.json();
      setReceipts([...receipts, savedReceipt]);
      */
      
      // Temporary local state update
      const newReceipt = {
        ...currentReceipt,
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
      };
      setReceipts([...receipts, newReceipt]);
      
      resetReceipt();
      setViewMode('list');
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  // Reset receipt
  const resetReceipt = () => {
    setCurrentReceipt({
      id: uuidv4(),
      number: `R-${Math.floor(10000 + Math.random() * 90000)}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      customer: {
        name: '',
        email: '',
        phone: '',
      },
      items: [],
      payment: {
        method: 'credit',
        amount: 0,
        changeDue: 0,
      },
      tax: 0,
      subtotal: 0,
      total: 0,
      cashier: 'Cashier Name',
      notes: '',
    });
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      // TODO: Implement API call to delete receipt
      // await fetch(`/api/receipts/${receiptToDelete.id}`, { method: 'DELETE' });
      setReceipts(receipts.filter(r => r.id !== receiptToDelete.id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  // Render components based on view mode
  const renderListView = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Sales Receipts
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage and view all sales transactions
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setViewMode('form')}
            sx={{ mr: 2 }}
          >
            New Receipt
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <TextField
        variant="outlined"
        size="small"
        placeholder="Search receipts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ width: 400, mb: 3 }}
      />

      {isLoading ? (
        <LinearProgress />
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Receipt #</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receipts.length > 0 ? (
                  receipts.map(receipt => (
                    <TableRow key={receipt.id} hover>
                      <TableCell>{receipt.number}</TableCell>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell>
                        {receipt.customer.name || 'Walk-in'}
                        {receipt.customer.phone && (
                          <Typography variant="body2" color="textSecondary">
                            {receipt.customer.phone}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{receipt.items.length}</TableCell>
                      <TableCell align="right">
                        UGX{receipt.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={paymentMethods.find(m => m.id === receipt.payment.method)?.name}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Receipt />}
                            onClick={() => {
                              setCurrentReceipt(receipt);
                              setViewMode('preview');
                            }}
                          >
                            View
                          </Button>
                          <IconButton 
                            color="error" 
                            onClick={() => {
                              setReceiptToDelete(receipt);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="subtitle1">
                        {receipts.length === 0 ? 'No receipts found' : 'No matching receipts found'}
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setViewMode('form')}
                        sx={{ mt: 1 }}
                      >
                        Create your first receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );

  const renderFormView = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            New Sales Receipt
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Receipt #{currentReceipt.number}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => {
              resetReceipt();
              setViewMode('list');
            }}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Receipt />}
            onClick={() => setViewMode('preview')}
            sx={{ mr: 2 }}
            disabled={currentReceipt.items.length === 0}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<LocalAtm />}
            onClick={saveReceipt}
            disabled={currentReceipt.items.length === 0}
          >
            Complete Sale
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Customer Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Customer Name"
                    fullWidth
                    value={currentReceipt.customer.name}
                    onChange={(e) => setCurrentReceipt({
                      ...currentReceipt,
                      customer: { ...currentReceipt.customer, name: e.target.value },
                    })}
                    placeholder="Walk-in customer"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={currentReceipt.customer.email}
                    onChange={(e) => setCurrentReceipt({
                      ...currentReceipt,
                      customer: { ...currentReceipt.customer, email: e.target.value },
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    type="tel"
                    fullWidth
                    value={currentReceipt.customer.phone}
                    onChange={(e) => setCurrentReceipt({
                      ...currentReceipt,
                      customer: { ...currentReceipt.customer, phone: e.target.value },
                    })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCard /> Payment Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={currentReceipt.payment.method}
                      onChange={(e) => setCurrentReceipt({
                        ...currentReceipt,
                        payment: { ...currentReceipt.payment, method: e.target.value },
                      })}
                      label="Payment Method"
                    >
                      {paymentMethods.map(method => (
                        <MenuItem key={method.id} value={method.id}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {method.icon}
                            {method.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Amount Received"
                    type="number"
                    fullWidth
                    value={currentReceipt.payment.amount || ''}
                    onChange={(e) => handlePaymentAmountChange(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                    }}
                  />
                </Grid>
                {currentReceipt.payment.changeDue > 0 && (
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography>Change Due:</Typography>
                      <Typography variant="h6" color="success.main">
                        UGX{currentReceipt.payment.changeDue.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart /> Add Items
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '100%', mb: 2 }}
              />

              {isLoading ? (
                <LinearProgress />
              ) : (
                <Grid container spacing={2}>
                  {filteredItems.map(item => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          '&:hover': { 
                            borderColor: theme.palette.primary.main,
                            backgroundColor: theme.palette.action.hover
                          }
                        }}
                        onClick={() => addItemToReceipt(item)}
                      >
                        <Typography fontWeight="bold">{item.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{item.category}</Typography>
                        <Typography variant="h6" mt={1}>
                          UGX{item.price.toFixed(2)}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Receipt
              </Typography>
              
              {currentReceipt.items.length > 0 ? (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentReceipt.items.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">UGX{item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                size="small"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                                sx={{ width: 60 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              UGX{(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => removeItemFromReceipt(item.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box mt={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Subtotal:</Typography>
                      <Typography>UGX{currentReceipt.subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Tax:</Typography>
                      <Typography>UGX{currentReceipt.tax.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6">UGX{currentReceipt.total.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="textSecondary">No items added</Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Search and select items to add them to the receipt
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPreviewView = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => setViewMode('form')}
        >
          Back to Edit
        </Button>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Print />}
            onClick={() => window.print()}
            sx={{ mr: 2 }}
          >
            Print Receipt
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<LocalAtm />}
            onClick={saveReceipt}
          >
            Complete Sale
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">Retail Pro Solutions</Typography>
          <Typography variant="body2">123 Commerce Street, Business City</Typography>
          <Typography variant="body2">Phone: (555) 123-4567 | Email: sales@retailpro.com</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box>
            <Typography fontWeight="bold">RECEIPT #{currentReceipt.number}</Typography>
            <Typography variant="body2">Date: {currentReceipt.date}</Typography>
            <Typography variant="body2">Time: {currentReceipt.time}</Typography>
          </Box>
          <Box textAlign="right">
            <Typography fontWeight="bold">Cashier: {currentReceipt.cashier}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
          <Typography fontWeight="bold">Customer:</Typography>
          <Typography>{currentReceipt.customer.name || 'Walk-in Customer'}</Typography>
          {currentReceipt.customer.phone && (
            <Typography variant="body2">Phone: {currentReceipt.customer.phone}</Typography>
          )}
          {currentReceipt.customer.email && (
            <Typography variant="body2">Email: {currentReceipt.customer.email}</Typography>
          )}
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentReceipt.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">UGX{item.price.toFixed(2)}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">UGX{(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal:</Typography>
            <Typography>UGX{currentReceipt.subtotal.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Tax:</Typography>
            <Typography>UGX{currentReceipt.tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">UGX{currentReceipt.total.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Payment Method:</Typography>
            <Typography fontWeight="bold">
              {paymentMethods.find(m => m.id === currentReceipt.payment.method)?.name}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Amount Paid:</Typography>
            <Typography>UGX{currentReceipt.payment.amount.toFixed(2)}</Typography>
          </Box>
          {currentReceipt.payment.changeDue > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography>Change Due:</Typography>
              <Typography>UGX{currentReceipt.payment.changeDue.toFixed(2)}</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mt={2} textAlign="center">
          <Typography variant="body2" fontStyle="italic">
            Thank you for your business! Returns accepted within 30 days with receipt.
          </Typography>
          <Typography variant="body2" mt={1}>www.retailpro.com</Typography>
        </Box>
      </Paper>
    </Box>
  );

  // Delete confirmation dialog
  const renderDeleteDialog = () => (
    <Dialog 
      open={openDeleteDialog} 
      onClose={() => setOpenDeleteDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Confirm Delete</Typography>
          <IconButton onClick={() => setOpenDeleteDialog(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete receipt #{receiptToDelete?.number}?
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={2}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
        <Button 
          onClick={() => setOpenDeleteDialog(false)} 
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirmDelete} 
          variant="contained"
          color="error"
        >
          Delete Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      {viewMode === 'list' && renderListView()}
      {viewMode === 'form' && renderFormView()}
      {viewMode === 'preview' && renderPreviewView()}
      {renderDeleteDialog()}
    </>
  );
};

export default SalesReceiptApp;