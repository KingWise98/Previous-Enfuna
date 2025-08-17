import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Chip,
  Menu,
  LinearProgress,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Close,
  Search,
  Refresh,
  Download,
  PictureAsPdf,
  Print,
  MoreVert,
  VisibilityOff,
  CloudUpload,
  GetApp
} from "@mui/icons-material";
import Header from "../../components/Header";
import { DataGrid } from '@mui/x-data-grid'; // ✅ correct

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const CustomerListPage = () => {
  const theme = useTheme();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [newCustomer, setNewCustomer] = useState({
    code: "",
    name: "",
    phone: "",
    email: "",
    country: "",
    city: "",
    status: "Active"
  });

  // Country options
  const countries = [
    "Uganda", "India", "Japan", "Colombia", "USA",
    "Kenya", "Tanzania", "Rwanda", "South Africa", "UK"
  ];

  // Status options
  const statusOptions = ["Active", "Inactive", "Pending"];

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/customers');
        // const data = await response.json();
        // setCustomers(data);
        
        // Initialize with empty array
        setCustomers([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setIsLoading(false);
        showNotification("Failed to fetch customers", "error");
      }
    };

    fetchCustomers();
  }, []);

  // Notification handler
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Handle create new customer
  const handleCreateCustomer = async () => {
    try {
      // Validate required fields
      if (!newCustomer.name || !newCustomer.phone) {
        showNotification("Please fill all required fields", "error");
        return;
      }

      // TODO: Implement API call to create customer
      /*
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      const createdCustomer = await response.json();
      setCustomers([...customers, createdCustomer]);
      */
      
      // Temporary local state update
      const createdCustomer = {
        ...newCustomer,
        id: customers.length + 1,
        code: `CUST${String(customers.length + 1).padStart(3, '0')}`
      };
      setCustomers([...customers, createdCustomer]);
      
      setNewCustomer({
        code: "",
        name: "",
        phone: "",
        email: "",
        country: "",
        city: "",
        status: "Active"
      });
      setOpenDialog(false);
      showNotification("Customer created successfully");
    } catch (error) {
      console.error('Error creating customer:', error);
      showNotification("Failed to create customer", "error");
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async (id) => {
    try {
      // TODO: Implement API call to delete customer
      // await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      setCustomers(customers.filter(customer => customer.id !== id));
      setOpenDeleteDialog(false);
      showNotification("Customer deleted successfully");
    } catch (error) {
      console.error('Error deleting customer:', error);
      showNotification("Failed to delete customer", "error");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "customers.xlsx");
    showNotification("Excel exported successfully");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Customers Report", 105, 15, { align: "center" });
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 105, 25, { align: "center" });
    
    // Table
    doc.autoTable({
      startY: 35,
      head: [['Code', 'Name', 'Phone', 'Email', 'Country', 'City', 'Status']],
      body: customers.map(customer => [
        customer.code,
        customer.name,
        customer.phone,
        customer.email,
        customer.country,
        customer.city,
        customer.status
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255
      },
      margin: { top: 35 }
    });
    
    doc.save("customers.pdf");
    showNotification("PDF exported successfully");
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Open Action Menu
  const handleOpenMenu = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  // Handle Close Action Menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  // Handle Hide
  const handleHide = (id) => {
    try {
      // TODO: Implement API call to hide customer
      setCustomers(customers.map(customer => 
        customer.id === id ? {...customer, status: "Inactive"} : customer
      ));
      showNotification("Customer hidden successfully");
      handleCloseMenu();
    } catch (error) {
      console.error('Error hiding customer:', error);
      showNotification("Failed to hide customer", "error");
    }
  };

  // Handle Edit
  const handleEdit = (customer) => {
    setNewCustomer(customer);
    setOpenDialog(true);
    handleCloseMenu();
  };

  // Get status chip
  const getStatusChip = (status) => {
    const statusMap = {
      Active: { color: "success", label: "Active" },
      Inactive: { color: "error", label: "Inactive" },
      Pending: { color: "warning", label: "Pending" }
    };
    
    return (
      <Chip
        label={statusMap[status]?.label || status}
        color={statusMap[status]?.color || "default"}
        size="small"
      />
    );
  };

  const columns = [
    { field: "code", headerName: "Code", flex: 1 },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "phone", headerName: "Phone", flex: 1.2 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => getStatusChip(params.row.status)
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleOpenMenu(event, params.row)}>
            <MoreVert />
          </IconButton>
          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl && selectedCustomer?.id === params.row.id)} 
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => handleEdit(params.row)}>
              <Edit sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleHide(params.row.id)}>
              <VisibilityOff sx={{ mr: 1 }} /> Hide
            </MenuItem>
            <MenuItem 
              onClick={() => {
                setCustomerToDelete(params.row);
                setOpenDeleteDialog(true);
              }}
              sx={{ color: "error.main" }}
            >
              <Delete sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({...notification, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({...notification, open: false})}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Page Header */}
      <Header title="CUSTOMER LIST" subtitle="Manage your customer records" />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Customer Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Track and manage all customer information
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
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Create Customer
          </Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search customers..."
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
        <Box>
          <Button
            variant="contained"
            color="info"
            startIcon={<CloudUpload />}
            sx={{ mr: 2 }}
          >
            Import
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Download />}
            onClick={exportToExcel}
            sx={{ mr: 2 }}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdf />}
            onClick={exportToPDF}
            sx={{ mr: 2 }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<Print />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Customers</Typography>
              <Typography variant="h4">{customers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: theme.palette.success.light }}>
            <CardContent>
              <Typography variant="h6">Active</Typography>
              <Typography variant="h4">
                {customers.filter(c => c.status === "Active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: theme.palette.error.light }}>
            <CardContent>
              <Typography variant="h6">Inactive</Typography>
              <Typography variant="h4">
                {customers.filter(c => c.status === "Inactive").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: theme.palette.warning.light }}>
            <CardContent>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4">
                {customers.filter(c => c.status === "Pending").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loading State */}
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Box sx={{ height: "60vh" }}>
          <DataGrid
            rows={filteredCustomers}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            checkboxSelection
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.background.default,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
          />
        </Box>
      )}

      {/* Create/Edit Customer Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedCustomer ? "Edit Customer" : "Create New Customer"}
            </Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={newCustomer.name}
                onChange={handleInputChange}
                name="name"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={newCustomer.phone}
                onChange={handleInputChange}
                name="phone"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={newCustomer.email}
                onChange={handleInputChange}
                name="email"
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  value={newCustomer.country}
                  onChange={handleInputChange}
                  name="country"
                  label="Country"
                >
                  {countries.map(country => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                fullWidth
                value={newCustomer.city}
                onChange={handleInputChange}
                name="city"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newCustomer.status}
                  onChange={handleInputChange}
                  name="status"
                  label="Status"
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
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
            onClick={handleCreateCustomer} 
            variant="contained"
            color="primary"
            disabled={!newCustomer.name || !newCustomer.phone}
          >
            {selectedCustomer ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

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
            Are you sure you want to delete customer {customerToDelete?.name}?
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Code: {customerToDelete?.code} | Phone: {customerToDelete?.phone}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Email: {customerToDelete?.email}
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
            onClick={() => handleDeleteCustomer(customerToDelete?.id)} 
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerListPage;