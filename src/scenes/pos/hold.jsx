import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Tooltip,
  useTheme,
  InputAdornment,
  Divider,
  Grid
} from "@mui/material";
import { 
  AddCircle, 
  Cancel, 
  CheckCircle, 
  Search,
  Refresh,
  LocalShipping,
  TakeoutDining,
  AccessTime,
  CalendarToday,
  Person,
  Phone,
  Email,
  Close
} from "@mui/icons-material";

const HoldOrdersPage = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    contact: "",
    email: "",
    orderDate: new Date().toISOString().split("T")[0],
    amount: "",
    status: "Hold",
    orderType: "Delivery",
    quantity: 1,
    deliveryTime: "30 mins",
  });
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        // setOrders(data);
        
        // For now, initialize with empty array
        setOrders([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
        // TODO: Add error handling (show notification to user)
      }
    };
    
    fetchOrders();
  }, []);

  const handleOrderStatusChange = (event) => {
    setOrderStatusFilter(event.target.value);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // TODO: Implement API call to update order status
      // await fetch(`/api/orders/${orderId}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      
      // Temporary local state update
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      // TODO: Implement API call to cancel order
      // await fetch(`/api/orders/${orderId}`, {
      //   method: 'DELETE',
      // });
      
      // Temporary local state update
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const handleNewOrderChange = (event) => {
    setNewOrder({ ...newOrder, [event.target.name]: event.target.value });
  };

  const handleAddNewOrder = async () => {
    try {
      if (newOrder.customer && newOrder.amount) {
        // TODO: Implement API call to add new order
        // const response = await fetch('/api/orders', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(newOrder),
        // });
        // const createdOrder = await response.json();
        // setOrders([...orders, createdOrder]);
        
        // Temporary local state update
        const newOrderWithId = {
          ...newOrder,
          id: orders.length + 1,
          orderNumber: `ORD${(orders.length + 1).toString().padStart(3, '0')}`,
          amount: Number(newOrder.amount),
          quantity: Number(newOrder.quantity),
        };
        setOrders([...orders, newOrderWithId]);
        
        setOpenDialog(false);
        setNewOrder({
          customer: "",
          contact: "",
          email: "",
          orderDate: new Date().toISOString().split("T")[0],
          amount: "",
          status: "Hold",
          orderType: "Delivery",
          quantity: 1,
          deliveryTime: "30 mins",
        });
      }
    } catch (error) {
      console.error('Error adding new order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderStatusFilter === "All" || order.status === orderStatusFilter;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contact.includes(searchTerm) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Hold":
        return theme.palette.warning.main;
      case "Ready for Delivery":
      case "Ready for Pick Up":
        return theme.palette.info.main;
      case "On its Way":
        return theme.palette.secondary.main;
      case "Delivered":
        return theme.palette.success.main;
      case "Cancelled":
        return theme.palette.error.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Hold":
        return <AccessTime />;
      case "Ready for Delivery":
      case "Ready for Pick Up":
        return <CheckCircle />;
      case "On its Way":
        return <LocalShipping />;
      case "Delivered":
        return <CheckCircle />;
      default:
        return null;
    }
  };

  const getOrderTypeIcon = (type) => {
    return type === "Delivery" ? <LocalShipping /> : <TakeoutDining />;
  };

  return (
    <Box p={3}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Order Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage and track all customer orders
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircle />}
          onClick={() => setOpenDialog(true)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          New Order
        </Button>
      </Box>

      {/* Filters and Search */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search orders..."
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
        
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={orderStatusFilter}
              onChange={handleOrderStatusChange}
              label="Status Filter"
            >
              <MenuItem value="All">All Orders</MenuItem>
              <MenuItem value="Hold">On Hold</MenuItem>
              <MenuItem value="Ready for Delivery">Ready for Delivery</MenuItem>
              <MenuItem value="Ready for Pick Up">Ready for Pick Up</MenuItem>
              <MenuItem value="On its Way">On its Way</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh orders">
            <IconButton onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Orders Table */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography>Loading orders...</Typography>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contact Info</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Qty</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Delivery Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography fontWeight="500">{order.orderNumber}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {order.customer.charAt(0)}
                          </Avatar>
                          <Typography>{order.customer}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Phone fontSize="small" />
                            <Typography variant="body2">{order.contact}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Email fontSize="small" />
                            <Typography variant="body2">{order.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarToday fontSize="small" />
                          <Typography>{order.orderDate}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="500">
                          UGX {order.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getOrderTypeIcon(order.orderType)}
                          label={order.orderType}
                          size="small"
                          color={order.orderType === "Delivery" ? "primary" : "secondary"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography>{order.quantity}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTime fontSize="small" />
                          <Typography>{order.deliveryTime}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status}
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusColor(order.status),
                            color: theme.palette.getContrastText(getStatusColor(order.status))
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {order.status !== "Delivered" && order.status !== "Cancelled" && (
                          <Box display="flex" gap={1}>
                            <Tooltip title="Update status">
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() => {
                                  if (order.orderType === "Delivery") {
                                    if (order.status === "Hold") {
                                      handleUpdateOrderStatus(order.id, "Ready for Delivery");
                                    } else if (order.status === "Ready for Delivery") {
                                      handleUpdateOrderStatus(order.id, "On its Way");
                                    } else {
                                      handleUpdateOrderStatus(order.id, "Delivered");
                                    }
                                  } else {
                                    if (order.status === "Hold") {
                                      handleUpdateOrderStatus(order.id, "Ready for Pick Up");
                                    } else {
                                      handleUpdateOrderStatus(order.id, "Delivered");
                                    }
                                  }
                                }}
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel order">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Typography variant="subtitle1">
                        {orders.length === 0 ? 'No orders found' : 'No matching orders found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* New Order Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Create New Order</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Customer Name"
                fullWidth
                value={newOrder.customer}
                onChange={handleNewOrderChange}
                name="customer"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Number"
                fullWidth
                value={newOrder.contact}
                onChange={handleNewOrderChange}
                name="contact"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                fullWidth
                value={newOrder.email}
                onChange={handleNewOrderChange}
                name="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Order Date"
                type="date"
                fullWidth
                value={newOrder.orderDate}
                onChange={handleNewOrderChange}
                name="orderDate"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={newOrder.orderType}
                  onChange={handleNewOrderChange}
                  label="Order Type"
                  name="orderType"
                >
                  <MenuItem value="Takeout">Takeout</MenuItem>
                  <MenuItem value="Delivery">Delivery</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount (UGX)"
                type="number"
                fullWidth
                value={newOrder.amount}
                onChange={handleNewOrderChange}
                name="amount"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      UGX
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={newOrder.quantity}
                onChange={handleNewOrderChange}
                name="quantity"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Estimated Delivery Time"
                fullWidth
                value={newOrder.deliveryTime}
                onChange={handleNewOrderChange}
                name="deliveryTime"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newOrder.status}
                  onChange={handleNewOrderChange}
                  name="status"
                  label="Status"
                >
                  <MenuItem value="Hold">Hold</MenuItem>
                  <MenuItem value="Ready for Delivery">Ready for Delivery</MenuItem>
                  <MenuItem value="Ready for Pick Up">Ready for Pick Up</MenuItem>
                  <MenuItem value="On its Way">On its Way</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewOrder} 
            variant="contained"
            color="primary"
            disabled={!newOrder.customer || !newOrder.amount}
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HoldOrdersPage;