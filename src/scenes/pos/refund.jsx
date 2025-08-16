import React, { useState, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Tooltip,
  useTheme,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  AddCircle,
  Cancel,
  CheckCircle,
  Close,
  Search,
  Refresh,
  Receipt,
  AssignmentReturn,
  Edit,
  Delete
} from '@mui/icons-material';

const RefundsAndReturnsPage = () => {
  const theme = useTheme();
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [refundRequests, setRefundRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newRequest, setNewRequest] = useState({
    orderId: '',
    customerName: '',
    amount: '',
    reason: '',
    status: 'Pending',
  });

  // Fetch refund requests from API
  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/refund-requests');
        // const data = await response.json();
        // setRefundRequests(data);
        
        // For now, initialize with empty array
        setRefundRequests([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching refund requests:', error);
        setIsLoading(false);
      }
    };

    fetchRefundRequests();
  }, []);

  const handleOpenRequestDialog = () => {
    setOpenRequestDialog(true);
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
    setNewRequest({
      orderId: '',
      customerName: '',
      amount: '',
      reason: '',
      status: 'Pending',
    });
  };

  const handleNewRequestChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddNewRequest = async () => {
    try {
      // TODO: Implement API call to add refund request
      // const response = await fetch('/api/refund-requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newRequest)
      // });
      // const createdRequest = await response.json();
      // setRefundRequests([...refundRequests, createdRequest]);
      
      // Temporary local state update
      const newRequestWithId = {
        ...newRequest,
        id: Date.now(),
        amount: `${newRequest.amount} UGX`
      };
      setRefundRequests([...refundRequests, newRequestWithId]);
      
      handleCloseRequestDialog();
    } catch (error) {
      console.error('Error adding refund request:', error);
    }
  };

  const handleEditRequest = (id) => {
    const requestToEdit = refundRequests.find(request => request.id === id);
    if (requestToEdit) {
      setNewRequest({
        ...requestToEdit,
        amount: requestToEdit.amount.replace(' UGX', '')
      });
      setOpenRequestDialog(true);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      // TODO: Implement API call to delete refund request
      // await fetch(`/api/refund-requests/${id}`, { method: 'DELETE' });
      setRefundRequests(refundRequests.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error deleting refund request:', error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // TODO: Implement API call to update status
      // await fetch(`/api/refund-requests/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      setRefundRequests(refundRequests.map(request =>
        request.id === id ? { ...request, status: newStatus } : request
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredRequests = refundRequests.filter(request =>
    request.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return theme.palette.success.main;
      case 'Pending':
        return theme.palette.warning.main;
      case 'Rejected':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const pendingRequests = refundRequests.filter(req => req.status === 'Pending').length;
  const completedRequests = refundRequests.filter(req => req.status === 'Completed').length;

  return (
    <Box p={3}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Refunds & Returns
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage customer refund and return requests
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
            onClick={handleOpenRequestDialog}
          >
            New Request
          </Button>
        </Box>
      </Box>

      {/* Search and Stats */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search requests..."
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
          <Card sx={{ minWidth: 180 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Pending
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {pendingRequests}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 180 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Completed
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {completedRequests}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Requests Table */}
      {isLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Chip label={request.orderId} color="primary" />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="500">{request.customerName}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="500">
                          {request.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={request.reason}>
                          <Typography sx={{ 
                            maxWidth: 200, 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                          }}>
                            {request.reason}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusColor(request.status),
                            color: theme.palette.getContrastText(getStatusColor(request.status))
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          {request.status === 'Pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton 
                                  color="success" 
                                  onClick={() => handleUpdateStatus(request.id, 'Completed')}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton 
                                  color="error" 
                                  onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title="Edit">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleEditRequest(request.id)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteRequest(request.id)}
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
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="subtitle1">
                        {refundRequests.length === 0 ? 'No refund requests found' : 'No matching requests found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add/Edit Request Dialog */}
      <Dialog 
        open={openRequestDialog} 
        onClose={handleCloseRequestDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {newRequest.id ? 'Edit Refund Request' : 'New Refund Request'}
            </Typography>
            <IconButton onClick={handleCloseRequestDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Order ID"
                fullWidth
                value={newRequest.orderId}
                onChange={handleNewRequestChange}
                name="orderId"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Receipt />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Name"
                fullWidth
                value={newRequest.customerName}
                onChange={handleNewRequestChange}
                name="customerName"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount (UGX)"
                type="number"
                fullWidth
                value={newRequest.amount}
                onChange={handleNewRequestChange}
                name="amount"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">UGX</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={newRequest.status}
                  onChange={handleNewRequestChange}
                  name="status"
                  required
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason"
                fullWidth
                value={newRequest.reason}
                onChange={handleNewRequestChange}
                name="reason"
                required
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentReturn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={handleCloseRequestDialog} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewRequest} 
            variant="contained"
            color="primary"
            disabled={!newRequest.orderId || !newRequest.customerName || !newRequest.amount || !newRequest.reason}
          >
            {newRequest.id ? 'Update Request' : 'Add Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RefundsAndReturnsPage;