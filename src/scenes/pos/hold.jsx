import React, { useState } from "react";
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
} from "@mui/material";
import { AddCircle, Cancel, CheckCircle } from "@mui/icons-material";

// Dummy order data
const ordersData = [
  { id: 1, orderNumber: "ORD001", customer: "Emma Epayi", contact: "0701234567",email: "emma@gmail.com", orderDate: "3/05/25", status: "Hold", amount: 5000, orderType: "Delivery", quantity: 3, deliveryTime: "30 mins" },
  { id: 2, orderNumber: "ORD002", customer: "Nalwoga Peace", contact: "0782345678",email: "nalwoga@gmail.com", orderDate: "3/05/25", status: "Hold", amount: 3200, orderType: "Takeout", quantity: 5, deliveryTime: "15 mins" },
  { id: 3, orderNumber: "ORD003", customer: "Akinyi Joan", contact: "0755436789",email: "akinyi@gmail.com", orderDate: "3/05/25", status: "Ready for Delivery", amount: 4500, orderType: "Delivery", quantity: 2, deliveryTime: "45 mins" },
  { id: 4, orderNumber: "ORD004", customer: "Ssebuufu George", contact: "0709876543",email: "ssebu@gmail.com", orderDate: "3/05/25", status: "Delivered", amount: 2800, orderType: "Takeout", quantity: 4, deliveryTime: "20 mins" },
  { id: 5, orderNumber: "ORD005", customer: "Kato Samuel", contact: "0771122334",email: "kato@gmail.com", orderDate: "3/05/25", status: "On its Way", amount: 6000, orderType: "Delivery", quantity: 6, deliveryTime: "35 mins" },
];

const HoldOrdersPage = () => {
  const [orders, setOrders] = useState(ordersData);
  const [openDialog, setOpenDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    orderDate: "",
    amount: "",
    status: "Hold",
    orderType: "Delivery",
    quantity: 1,
    deliveryTime: "",
  });
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  const handleOrderStatusChange = (event) => {
    setOrderStatusFilter(event.target.value);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleCancelOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleNewOrderChange = (event) => {
    setNewOrder({ ...newOrder, [event.target.name]: event.target.value });
  };

  const handleAddNewOrder = () => {
    if (newOrder.customer && newOrder.amount) {
      setOrders([
        ...orders,
        {
          id: orders.length + 1,
          orderNumber: `ORD00${orders.length + 1}`,
          customer: newOrder.customer,
          contact: newOrder.contact,
          email: newOrder.email,
          orderDate: newOrder.orderDate || new Date().toISOString().split("T")[0],
          amount: Number(newOrder.amount),
          orderType: newOrder.orderType,
          quantity: Number(newOrder.quantity),
          deliveryTime: newOrder.deliveryTime,
          status: newOrder.status,
        },
      ]);
      setOpenDialog(false);
      setNewOrder({
        customer: "",
        orderDate: "",
        amount: "",
        status: "Hold",
        orderType: "Delivery",
        quantity: 1,
        deliveryTime: "",
      });
    }
  };

  const filteredOrders = orders.filter(
    (order) => orderStatusFilter === "All" || order.status === orderStatusFilter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Hold":
        return "orange";
      case "Ready for Delivery":
      case "Ready for Pick Up":
        return "blue";
      case "On its Way":
        return "purple";
      case "Delivered":
        return "green";
      default:
        return "black";
    }
  };

  return (
    <Box p={3}>
      {/* Page Title */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Order Management</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "purple",
            "&:hover": {
              backgroundColor: "darkviolet",
            },
          }}
          startIcon={<AddCircle />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Order
        </Button>
      </Box>

      {/* Order Status Filter */}
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select
          value={orderStatusFilter}
          onChange={handleOrderStatusChange}
          label="Status Filter"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Hold">Hold</MenuItem>
          <MenuItem value="Ready for Delivery">Ready for Delivery</MenuItem>
          <MenuItem value="Ready for Pick Up">Ready for Pick Up</MenuItem>
          <MenuItem value="On its Way">On its Way</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
        </Select>
      </FormControl>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 850 }} aria-label="Hold Orders Table">
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Amount (UGX)</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Estimated Delivery Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.contact}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.amount.toLocaleString()}</TableCell>
                <TableCell>{order.orderType}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.deliveryTime}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: getStatusColor(order.status),
                      fontWeight: "bold",
                    }}
                  >
                    {order.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.status !== "Delivered" && (
                    <>
                      <IconButton
                        color="success"
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
                      <IconButton
                        color="error"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <Cancel />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Order Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Customer Name"
            fullWidth
            value={newOrder.customer}
            onChange={handleNewOrderChange}
            name="customer"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Customer Contact"
            fullWidth
            value={newOrder.contact}
            onChange={handleNewOrderChange}
            name="contact"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Customer Email"
            fullWidth
            value={newOrder.email}
            onChange={handleNewOrderChange}
            name="email"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Amount (UGX)"
            type="number"
            fullWidth
            value={newOrder.amount}
            onChange={handleNewOrderChange}
            name="amount"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Order Date"
            type="date"
            fullWidth
            value={newOrder.orderDate}
            onChange={handleNewOrderChange}
            name="orderDate"
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
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
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={newOrder.quantity}
            onChange={handleNewOrderChange}
            name="quantity"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Estimated Delivery Time"
            fullWidth
            value={newOrder.deliveryTime}
            onChange={handleNewOrderChange}
            name="deliveryTime"
            sx={{ mb: 2 }}
          />
          {/* Status Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNewOrder} color="primary">
            Add Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HoldOrdersPage;