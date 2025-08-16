import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Chip,
  LinearProgress,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  useTheme,
  InputLabel
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
  CheckCircle,
  Send,
  Drafts
} from "@mui/icons-material";
import Header from "../../components/Header";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ManageBill = () => {
  const theme = useTheme();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [newBill, setNewBill] = useState({
    vendor: "",
    billDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    orderNumber: "",
    status: "Draft",
    amount: "",
    description: ""
  });

  // Status options
  const statusOptions = [
    { value: "Draft", label: "Draft", icon: <Drafts /> },
    { value: "Send", label: "Send", icon: <Send /> },
    { value: "Paid", label: "Paid", icon: <CheckCircle /> }
  ];

  // Fetch bills from API
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/bills');
        // const data = await response.json();
        // setBills(data);
        
        // Initialize with empty array
        setBills([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bills:', error);
        setIsLoading(false);
        showNotification("Failed to fetch bills", "error");
      }
    };

    fetchBills();
  }, []);

  // Notification handler
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Handle create new bill
  const handleCreateBill = async () => {
    try {
      // Validate required fields
      if (!newBill.vendor || !newBill.amount) {
        showNotification("Please fill all required fields", "error");
        return;
      }

      // TODO: Implement API call to create bill
      /*
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBill)
      });
      const createdBill = await response.json();
      setBills([...bills, createdBill]);
      */
      
      // Temporary local state update
      const createdBill = {
        ...newBill,
        id: bills.length + 1,
        amount: parseFloat(newBill.amount)
      };
      setBills([...bills, createdBill]);
      
      setNewBill({
        vendor: "",
        billDate: format(new Date(), "yyyy-MM-dd"),
        dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        orderNumber: "",
        status: "Draft",
        amount: "",
        description: ""
      });
      setOpenDialog(false);
      showNotification("Bill created successfully");
    } catch (error) {
      console.error('Error creating bill:', error);
      showNotification("Failed to create bill", "error");
    }
  };

  // Handle delete bill
  const handleDeleteBill = async (id) => {
    try {
      // TODO: Implement API call to delete bill
      // await fetch(`/api/bills/${id}`, { method: 'DELETE' });
      setBills(bills.filter(bill => bill.id !== id));
      setOpenDeleteDialog(false);
      showNotification("Bill deleted successfully");
    } catch (error) {
      console.error('Error deleting bill:', error);
      showNotification("Failed to delete bill", "error");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill({ ...newBill, [name]: value });
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(bills);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");
    XLSX.writeFile(workbook, "bills.xlsx");
    showNotification("Excel exported successfully");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Bills Report", 105, 15, { align: "center" });
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 105, 25, { align: "center" });
    
    // Table
    doc.autoTable({
      startY: 35,
      head: [['Vendor', 'Bill Date', 'Due Date', 'Order #', 'Status', 'Amount']],
      body: bills.map(bill => [
        bill.vendor,
        bill.billDate,
        bill.dueDate,
        bill.orderNumber,
        bill.status,
        `UGX ${parseFloat(bill.amount || 0).toFixed(2)}`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255
      },
      margin: { top: 35 }
    });
    
    doc.save("bills.pdf");
    showNotification("PDF exported successfully");
  };

  // Filter bills based on search term
  const filteredBills = bills.filter(bill =>
    bill.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status chip
  const getStatusChip = (status) => {
    const statusMap = {
      Paid: { color: "success", icon: <CheckCircle fontSize="small" /> },
      Send: { color: "secondary", icon: <Send fontSize="small" /> },
      Draft: { color: "warning", icon: <Drafts fontSize="small" /> }
    };
    
    return (
      <Chip
        icon={statusMap[status]?.icon}
        label={status}
        color={statusMap[status]?.color || "default"}
        variant="outlined"
        size="small"
      />
    );
  };

  return (
    <Box p={3}>
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
      <Header title="MANAGE BILLS" subtitle="Track and manage your bills" />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Bill Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Record and track all vendor bills
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
            Create Bill
          </Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search bills..."
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
            color="info"
            startIcon={<Print />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Bills</Typography>
              <Typography variant="h4">{bills.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: theme.palette.success.light }}>
            <CardContent>
              <Typography variant="h6">Paid Bills</Typography>
              <Typography variant="h4">
                {bills.filter(bill => bill.status === "Paid").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: theme.palette.warning.light }}>
            <CardContent>
              <Typography variant="h6">Pending Bills</Typography>
              <Typography variant="h4">
                {bills.filter(bill => bill.status !== "Paid").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loading State */}
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vendor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bill Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <TableRow key={bill.id} hover>
                      <TableCell>
                        <Typography fontWeight="500">{bill.vendor}</Typography>
                      </TableCell>
                      <TableCell>{bill.billDate}</TableCell>
                      <TableCell>{bill.dueDate}</TableCell>
                      <TableCell>{bill.orderNumber}</TableCell>
                      <TableCell>
                        {bill.amount ? `UGX ${parseFloat(bill.amount).toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>{getStatusChip(bill.status)}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => {
                              setBillToDelete(bill);
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
                        {bills.length === 0 ? 'No bills found' : 'No matching bills found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Create Bill Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Create New Bill</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Vendor Name"
                fullWidth
                value={newBill.vendor}
                onChange={handleInputChange}
                name="vendor"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bill Date"
                type="date"
                fullWidth
                value={newBill.billDate}
                onChange={handleInputChange}
                name="billDate"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                value={newBill.dueDate}
                onChange={handleInputChange}
                name="dueDate"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Order Number"
                fullWidth
                value={newBill.orderNumber}
                onChange={handleInputChange}
                name="orderNumber"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newBill.status}
                  onChange={handleInputChange}
                  name="status"
                  label="Status"
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={newBill.amount}
                onChange={handleInputChange}
                name="amount"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newBill.description}
                onChange={handleInputChange}
                name="description"
              />
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
            onClick={handleCreateBill} 
            variant="contained"
            color="primary"
            disabled={!newBill.vendor || !newBill.amount}
          >
            Create Bill
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
            Are you sure you want to delete the bill for {billToDelete?.vendor}?
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Bill Date: {billToDelete?.billDate} | 
            Due Date: {billToDelete?.dueDate}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Amount: {billToDelete?.amount ? `UGX ${parseFloat(billToDelete?.amount).toFixed(2)}` : "N/A"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Status: {billToDelete?.status}
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
            onClick={() => handleDeleteBill(billToDelete?.id)} 
            variant="contained"
            color="error"
          >
            Delete Bill
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageBill;