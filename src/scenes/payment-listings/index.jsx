import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  useTheme,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  Delete,
  Search,
  Refresh,
  AddCircle,
  Receipt,
  Payment as PaymentIcon,
  Cancel,
  CheckCircle,
  Close,
  Edit
} from "@mui/icons-material";

const PaymentListing = () => {
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [newPayment, setNewPayment] = useState({
    date: new Date().toISOString().split('T')[0],
    name: "",
    groupName: "",
    account: "",
    paymentType: "Cash",
    amount: "",
    status: "Pending"
  });

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/payments');
        // const data = await response.json();
        // setPayments(data);
        
        // Initialize with empty array
        setPayments([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // TODO: Implement API call to delete payment
      // await fetch(`/api/payments/${paymentToDelete.id}`, { method: 'DELETE' });
      setPayments(payments.filter(payment => payment.id !== paymentToDelete.id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const handleAddPayment = () => {
    setOpenPaymentDialog(true);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handleSubmitPayment = async () => {
    try {
      // TODO: Implement API call to add payment
      // const response = await fetch('/api/payments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPayment)
      // });
      // const createdPayment = await response.json();
      // setPayments([...payments, createdPayment]);
      
      // Temporary local state update
      const newPaymentWithId = {
        ...newPayment,
        id: payments.length + 1
      };
      setPayments([...payments, newPaymentWithId]);
      
      setOpenPaymentDialog(false);
      setNewPayment({
        date: new Date().toISOString().split('T')[0],
        name: "",
        groupName: "",
        account: "",
        paymentType: "Cash",
        amount: "",
        status: "Pending"
      });
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // TODO: Implement API call to update status
      // await fetch(`/api/payments/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      setPayments(payments.map(payment =>
        payment.id === id ? { ...payment, status: newStatus } : payment
      ));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paymentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return theme.palette.success.main;
      case 'Pending':
        return theme.palette.warning.main;
      case 'Failed':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Box p={3}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Payment Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            View and manage all payment transactions
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircle />}
            onClick={handleAddPayment}
          >
            Add Payment
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search payments..."
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
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Payments Table */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Group</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Account</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography>{payment.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="500">{payment.name}</Typography>
                    </TableCell>
                    <TableCell>{payment.groupName}</TableCell>
                    <TableCell>{payment.account}</TableCell>
                    <TableCell>
                      <Chip
                        label={payment.paymentType}
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        UGX{payment.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(payment.status),
                          color: theme.palette.getContrastText(getStatusColor(payment.status))
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {payment.status === 'Pending' ? (
                          <>
                            <Tooltip title="Approve">
                              <IconButton 
                                color="success" 
                                onClick={() => handleUpdateStatus(payment.id, 'Completed')}
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton 
                                color="error" 
                                onClick={() => handleUpdateStatus(payment.id, 'Failed')}
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : null}
                        <Tooltip title="Edit">
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteClick(payment)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1">
                      {payments.length === 0 ? 'No payments found' : 'No matching payments found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
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
            Are you sure you want to delete the payment to {paymentToDelete?.name} for UGX{paymentToDelete?.amount}?
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
            Delete Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog 
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add New Payment</Typography>
            <IconButton onClick={() => setOpenPaymentDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={newPayment.date}
                onChange={handlePaymentChange}
                name="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={newPayment.paymentType}
                  onChange={handlePaymentChange}
                  name="paymentType"
                  label="Payment Type"
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                value={newPayment.name}
                onChange={handlePaymentChange}
                name="name"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Group Name"
                fullWidth
                value={newPayment.groupName}
                onChange={handlePaymentChange}
                name="groupName"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account"
                fullWidth
                value={newPayment.account}
                onChange={handlePaymentChange}
                name="account"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount (UGX)"
                type="number"
                fullWidth
                value={newPayment.amount}
                onChange={handlePaymentChange}
                name="amount"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">UGX</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newPayment.status}
                  onChange={handlePaymentChange}
                  name="status"
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenPaymentDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitPayment} 
            variant="contained"
            color="primary"
            disabled={!newPayment.name || !newPayment.account || !newPayment.amount}
          >
            Add Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentListing;