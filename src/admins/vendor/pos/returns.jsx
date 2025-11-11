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
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  Refresh,
  Visibility,
  AssignmentReturn,
  CheckCircle,
  Close,
  LocalShipping,
  AccountBalance,
  ArrowBack,
  Inventory,
  Receipt
} from '@mui/icons-material';

// Sample return orders data
const returnOrders = [
  {
    id: 'PR-2023-001',
    originalPO: 'PO-2023-004',
    supplier: 'Uganda Grain Millers',
    date: '2023-06-18',
    items: 2,
    total: 1200000,
    status: 'completed',
    reason: 'Damaged goods',
    creditStatus: 'issued',
    itemsDetails: [
      { id: 1, name: 'Rice (50kg bag)', quantity: 1, price: 150000, total: 150000, reason: 'Damaged packaging', approved: true },
      { id: 2, name: 'Vegetable Oil (5L)', quantity: 2, price: 25000, total: 50000, reason: 'Leaking containers', approved: true }
    ],
    returnForm: {
      id: 'RF-2023-001',
      date: '2023-06-18',
      approvedBy: 'Manager Name',
      approvalDate: '2023-06-19'
    }
  },
  {
    id: 'PR-2023-002',
    originalPO: 'PO-2023-002',
    supplier: 'Namukasa Foods Ltd',
    date: '2023-06-12',
    items: 1,
    total: 600000,
    status: 'pending',
    reason: 'Wrong items delivered',
    creditStatus: 'pending',
    itemsDetails: [
      { id: 1, name: 'Sugar (1kg)', quantity: 50, price: 3500, total: 175000, reason: 'Wrong product delivered', approved: false }
    ],
    returnForm: {
      id: 'RF-2023-002',
      date: '2023-06-12',
      approvedBy: '',
      approvalDate: ''
    }
  },
  {
    id: 'PR-2023-003',
    originalPO: 'PO-2023-001',
    supplier: 'Wasswa Fresh Produce',
    date: '2023-06-05',
    items: 3,
    total: 900000,
    status: 'cancelled',
    reason: 'Customer error',
    creditStatus: 'none',
    itemsDetails: [
      { id: 1, name: 'Fresh Tomatoes (1kg)', quantity: 20, price: 5000, total: 100000, reason: 'Ordered by mistake', approved: false }
    ],
    returnForm: {
      id: 'RF-2023-003',
      date: '2023-06-05',
      approvedBy: '',
      approvalDate: ''
    }
  }
];

// Sample purchase orders for creating returns
const purchaseOrders = [
  {
    id: 'PO-2023-001',
    supplier: 'Wasswa Fresh Produce',
    date: '2023-06-15',
    itemsDetails: [
      { id: 1, name: 'Fresh Tomatoes (1kg)', quantity: 20, price: 5000, total: 100000 },
      { id: 2, name: 'Onions (1kg)', quantity: 15, price: 3000, total: 45000 }
    ]
  },
  {
    id: 'PO-2023-002',
    supplier: 'Namukasa Foods Ltd',
    date: '2023-06-10',
    itemsDetails: [
      { id: 1, name: 'Sugar (1kg)', quantity: 50, price: 3500, total: 175000 },
      { id: 2, name: 'Salt (1kg)', quantity: 30, price: 2000, total: 60000 }
    ]
  },
  {
    id: 'PO-2023-004',
    supplier: 'Uganda Grain Millers',
    date: '2023-05-28',
    itemsDetails: [
      { id: 1, name: 'Rice (50kg bag)', quantity: 5, price: 150000, total: 750000 },
      { id: 2, name: 'Vegetable Oil (5L)', quantity: 10, price: 25000, total: 250000 }
    ]
  }
];

const ListPurchaseReturnsPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [creditFilter, setCreditFilter] = useState('all');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogView, setDialogView] = useState('details'); // 'details', 'form', 'new'
  const [newReturn, setNewReturn] = useState({
    originalPO: '',
    supplier: '',
    reason: '',
    items: []
  });
  const [selectedItems, setSelectedItems] = useState([]);

  const filteredReturns = returnOrders.filter(returnOrder => {
    const matchesSearch = returnOrder.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnOrder.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnOrder.originalPO.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || returnOrder.status === statusFilter;
    const matchesCredit = creditFilter === 'all' || returnOrder.creditStatus === creditFilter;
    
    return matchesSearch && matchesStatus && matchesCredit;
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

  const handleViewDetails = (returnOrder, view = 'details') => {
    setSelectedReturn(returnOrder);
    setDialogView(view);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewReturn({
      originalPO: '',
      supplier: '',
      reason: '',
      items: []
    });
    setSelectedItems([]);
  };

  const handleCreateReturn = () => {
    // In a real app, this would save to the backend
    alert(`Return created successfully for PO: ${newReturn.originalPO}`);
    setOpenDialog(false);
  };

  const handleApproveReturn = () => {
    // In a real app, this would update the backend
    alert(`Return ${selectedReturn.id} approved successfully`);
    setOpenDialog(false);
  };

  const handleCancelReturn = () => {
    // In a real app, this would update the backend
    alert(`Return ${selectedReturn.id} cancelled`);
    setOpenDialog(false);
  };

  const handleItemSelection = (item) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, { ...item, returnQuantity: 1, returnReason: '' }]);
    }
  };

  const handleReturnQuantityChange = (itemId, quantity) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, returnQuantity: parseInt(quantity) || 0 } : item
    ));
  };

  const handleReturnReasonChange = (itemId, reason) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, returnReason: reason } : item
    ));
  };

  const getSelectedOrder = () => {
    return purchaseOrders.find(po => po.id === newReturn.originalPO);
  };

  const calculateReturnTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.returnQuantity), 0);
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Purchase Returns
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage returned items to suppliers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setDialogView('new');
            setOpenDialog(true);
          }}
        >
          New Return
        </Button>
      </Box>

      {/* Filters */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search returns..."
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
            <InputLabel>Credit</InputLabel>
            <Select
              value={creditFilter}
              label="Credit"
              onChange={(e) => setCreditFilter(e.target.value)}
            >
              <MenuItem value="all">All Credits</MenuItem>
              <MenuItem value="issued">Issued</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="none">None</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setCreditFilter('all');
          }}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Returns Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Return #</TableCell>
              <TableCell>Original PO</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReturns.map((returnOrder) => (
              <TableRow key={returnOrder.id}>
                <TableCell>{returnOrder.id}</TableCell>
                <TableCell>{returnOrder.originalPO}</TableCell>
                <TableCell>{returnOrder.supplier}</TableCell>
                <TableCell>{formatDate(returnOrder.date)}</TableCell>
                <TableCell>{returnOrder.items}</TableCell>
                <TableCell>{formatCurrency(returnOrder.total)}</TableCell>
                <TableCell>
                  <Chip
                    label={returnOrder.status.charAt(0).toUpperCase() + returnOrder.status.slice(1)}
                    color={
                      returnOrder.status === 'completed' ? 'success' :
                      returnOrder.status === 'pending' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={returnOrder.creditStatus.charAt(0).toUpperCase() + returnOrder.creditStatus.slice(1)}
                    color={
                      returnOrder.creditStatus === 'issued' ? 'success' :
                      returnOrder.creditStatus === 'pending' ? 'warning' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(returnOrder, 'details')}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Return Details, Form, and New Return */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {dialogView === 'details' && 'Return Order Details'}
              {dialogView === 'form' && 'Return Form'}
              {dialogView === 'new' && 'Create New Return'}
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Return Details View */}
          {selectedReturn && dialogView === 'details' && (
            <Box>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Box>
                  <Typography variant="h6">{selectedReturn.id}</Typography>
                  <Typography variant="subtitle1">Original PO: {selectedReturn.originalPO}</Typography>
                  <Typography variant="subtitle1">Supplier: {selectedReturn.supplier}</Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2">Date: {formatDate(selectedReturn.date)}</Typography>
                  <Typography variant="body2">Reason: {selectedReturn.reason}</Typography>
                </Box>
              </Box>

              {/* Status Indicators */}
              <Box display="flex" gap={2} mb={3}>
                <Chip
                  label={`Status: ${selectedReturn.status.charAt(0).toUpperCase() + selectedReturn.status.slice(1)}`}
                  color={
                    selectedReturn.status === 'completed' ? 'success' :
                    selectedReturn.status === 'pending' ? 'warning' : 'error'
                  }
                />
                <Chip
                  label={`Credit: ${selectedReturn.creditStatus.charAt(0).toUpperCase() + selectedReturn.creditStatus.slice(1)}`}
                  color={
                    selectedReturn.creditStatus === 'issued' ? 'success' :
                    selectedReturn.creditStatus === 'pending' ? 'warning' : 'default'
                  }
                />
              </Box>

              {/* Items Table */}
              <Typography variant="h6" gutterBottom>Returned Items</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Approved</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedReturn.itemsDetails.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>
                          {item.approved ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Close color="error" />
                          )}
                        </TableCell>
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
                        <TableCell align="right">{formatCurrency(selectedReturn.total)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax Refund</TableCell>
                        <TableCell align="right">{formatCurrency(selectedReturn.total * 0.05)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Total Refund</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(selectedReturn.total * 1.05)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Return Form Details */}
              {selectedReturn.returnForm && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>Return Form Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Form ID:</strong> {selectedReturn.returnForm.id}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Date:</strong> {formatDate(selectedReturn.returnForm.date)}</Typography>
                    </Grid>
                    {selectedReturn.returnForm.approvedBy && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2"><strong>Approved By:</strong> {selectedReturn.returnForm.approvedBy}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2"><strong>Approval Date:</strong> {formatDate(selectedReturn.returnForm.approvalDate)}</Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Actions */}
              <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<AssignmentReturn />}
                  onClick={() => setDialogView('form')}
                >
                  View Return Form
                </Button>
                {selectedReturn.status === 'pending' && (
                  <>
                    <Button 
                      variant="contained" 
                      color="success" 
                      startIcon={<CheckCircle />}
                      onClick={handleApproveReturn}
                    >
                      Approve Return
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      startIcon={<Close />}
                      onClick={handleCancelReturn}
                    >
                      Cancel Return
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}

          {/* Return Form View */}
          {selectedReturn && dialogView === 'form' && (
            <Box>
              <Box textAlign="center" mb={3}>
                <Typography variant="h4">RETURN FORM</Typography>
                <Typography variant="h6">{selectedReturn.returnForm.id}</Typography>
              </Box>
              
              <Grid container spacing={3} mb={3}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>From:</Typography>
                      <Typography variant="body1">Your Business Name</Typography>
                      <Typography variant="body2">Kampala, Uganda</Typography>
                      <Typography variant="body2">+256 750 654321</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>To:</Typography>
                      <Typography variant="body1">{selectedReturn.supplier}</Typography>
                      <Typography variant="body2">Kampala, Uganda</Typography>
                      <Typography variant="body2">+256 750 123456</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>Return Details</Typography>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Return ID:</strong> {selectedReturn.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Original PO:</strong> {selectedReturn.originalPO}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Date:</strong> {formatDate(selectedReturn.date)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Reason:</strong> {selectedReturn.reason}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>Items to Return</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedReturn.itemsDetails.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                        <TableCell>{item.reason}</TableCell>
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
                        <TableCell align="right">{formatCurrency(selectedReturn.total)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax Refund</TableCell>
                        <TableCell align="right">{formatCurrency(selectedReturn.total * 0.05)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Total Refund</strong></TableCell>
                        <TableCell align="right"><strong>{formatCurrency(selectedReturn.total * 1.05)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              
              <Box mt={3}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Terms:</strong> Goods must be returned within 30 days of receipt. Refunds will be issued as credit to your account.
                </Typography>
              </Box>
            </Box>
          )}

          {/* New Return View */}
          {dialogView === 'new' && (
            <Box>
              <Typography variant="h6" gutterBottom>Create New Return</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Purchase Order</InputLabel>
                    <Select
                      value={newReturn.originalPO}
                      label="Select Purchase Order"
                      onChange={(e) => {
                        const poId = e.target.value;
                        const po = purchaseOrders.find(order => order.id === poId);
                        setNewReturn({
                          ...newReturn,
                          originalPO: poId,
                          supplier: po ? po.supplier : '',
                          items: po ? po.itemsDetails : []
                        });
                      }}
                    >
                      {purchaseOrders.map(order => (
                        <MenuItem key={order.id} value={order.id}>
                          {order.id} - {order.supplier} - {formatDate(order.date)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {newReturn.originalPO && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label="Supplier"
                        fullWidth
                        value={newReturn.supplier}
                        disabled
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Return Reason"
                        multiline
                        rows={3}
                        fullWidth
                        value={newReturn.reason}
                        onChange={(e) => setNewReturn({...newReturn, reason: e.target.value})}
                        placeholder="Explain why you are returning these items..."
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Select Items to Return</Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Select</TableCell>
                              <TableCell>Item</TableCell>
                              <TableCell>Available Qty</TableCell>
                              <TableCell>Return Qty</TableCell>
                              <TableCell>Unit Price</TableCell>
                              <TableCell>Reason</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {newReturn.items.map((item) => {
                              const selectedItem = selectedItems.find(selected => selected.id === item.id);
                              return (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    <Checkbox
                                      checked={!!selectedItem}
                                      onChange={() => handleItemSelection(item)}
                                    />
                                  </TableCell>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    {selectedItem && (
                                      <TextField
                                        type="number"
                                        size="small"
                                        sx={{ width: 80 }}
                                        InputProps={{ inputProps: { min: 1, max: item.quantity } }}
                                        value={selectedItem.returnQuantity}
                                        onChange={(e) => handleReturnQuantityChange(item.id, e.target.value)}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>{formatCurrency(item.price)}</TableCell>
                                  <TableCell>
                                    {selectedItem && (
                                      <TextField
                                        size="small"
                                        sx={{ width: 150 }}
                                        value={selectedItem.returnReason}
                                        onChange={(e) => handleReturnReasonChange(item.id, e.target.value)}
                                        placeholder="Reason for return"
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    
                    {selectedItems.length > 0 && (
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                          <TableContainer component={Paper} variant="outlined" sx={{ width: 300 }}>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell><strong>Total Refund</strong></TableCell>
                                  <TableCell align="right"><strong>{formatCurrency(calculateReturnTotal())}</strong></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {dialogView === 'details' && (
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          )}
          {dialogView === 'form' && (
            <Button onClick={() => setDialogView('details')} color="primary">
              Back to Details
            </Button>
          )}
          {dialogView === 'new' && (
            <>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateReturn} 
                variant="contained" 
                disabled={!newReturn.originalPO || !newReturn.reason || selectedItems.length === 0}
              >
                Create Return
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListPurchaseReturnsPage;