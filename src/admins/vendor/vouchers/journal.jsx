import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  InputAdornment,
  LinearProgress,
  Card,
  CardContent,
  Snackbar,
  Alert
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Close,
  Search,
  Refresh,
  Download,
  PictureAsPdf,
  Print
} from "@mui/icons-material";
import Header from "../../components/Header";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const JournalVoucher = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [newEntry, setNewEntry] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    accountName: "",
    debit: "",
    credit: "",
    narration: "",
  });

  // Fetch journal entries from API
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/journal-entries');
        // const data = await response.json();
        // setRows(data);
        // setIsLoading(false);
        
        // Initialize with empty array
        setRows([]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        setIsLoading(false);
        showNotification("Failed to fetch journal entries", "error");
      }
    };

    fetchEntries();
  }, []);

  // Calculate totals whenever rows change
  useEffect(() => {
    const debitTotal = rows.reduce((sum, row) => sum + parseFloat(row.debit || 0), 0);
    const creditTotal = rows.reduce((sum, row) => sum + parseFloat(row.credit || 0), 0);
    setTotalDebit(debitTotal);
    setTotalCredit(creditTotal);
  }, [rows]);

  // Notification handler
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Handle create new entry
  const handleCreateEntry = async () => {
    try {
      // Validate that either debit or credit has value
      if (!newEntry.debit && !newEntry.credit) {
        showNotification("Please enter either debit or credit amount", "error");
        return;
      }

      // TODO: Implement API call to create entry
      /*
      const response = await fetch('/api/journal-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      const createdEntry = await response.json();
      setRows([...rows, createdEntry]);
      */
      
      // Temporary local state update
      const createdEntry = {
        ...newEntry,
        id: rows.length + 1,
        debit: parseFloat(newEntry.debit || 0),
        credit: parseFloat(newEntry.credit || 0)
      };
      setRows([...rows, createdEntry]);
      
      setNewEntry({
        date: format(new Date(), "yyyy-MM-dd"),
        accountName: "",
        debit: "",
        credit: "",
        narration: "",
      });
      setOpenDialog(false);
      showNotification("Journal entry created successfully");
    } catch (error) {
      console.error("Error creating journal entry:", error);
      showNotification("Failed to create journal entry", "error");
    }
  };

  // Handle delete entry
  const handleDeleteEntry = async (id) => {
    try {
      // TODO: Implement API call to delete entry
      // await fetch(`/api/journal-entries/${id}`, { method: 'DELETE' });
      setRows(rows.filter(row => row.id !== id));
      setOpenDeleteDialog(false);
      showNotification("Journal entry deleted successfully");
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      showNotification("Failed to delete journal entry", "error");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "JournalVoucher");
    XLSX.writeFile(workbook, "journal_vouchers.xlsx");
    showNotification("Excel exported successfully");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Journal Vouchers Report", 105, 15, { align: "center" });
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 105, 25, { align: "center" });
    
    // Summary
    doc.setFontSize(12);
    doc.text(`Total Debit: UGX ${totalDebit.toFixed(2)}`, 14, 35);
    doc.text(`Total Credit: UGX ${totalCredit.toFixed(2)}`, 14, 45);
    
    // Table
    doc.autoTable({
      startY: 55,
      head: [['Date', 'Account', 'Debit', 'Credit', 'Narration']],
      body: rows.map(row => [
        row.date,
        row.accountName,
        `UGX ${parseFloat(row.debit).toFixed(2)}`,
        `UGX ${parseFloat(row.credit).toFixed(2)}`,
        row.narration
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255
      },
      margin: { top: 55 }
    });
    
    doc.save("journal_vouchers.pdf");
    showNotification("PDF exported successfully");
  };

  // Filter entries based on search term
  const filteredRows = rows.filter(row =>
    row.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.narration.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Header title="JOURNAL VOUCHER" subtitle="Manage your journal transactions" />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Journal Voucher Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Record and track all journal transactions
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
            New Entry
          </Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search entries..."
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
              <Typography variant="h6">Total Entries</Typography>
              <Typography variant="h4">{rows.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: theme.palette.success.light }}>
            <CardContent>
              <Typography variant="h6">Total Debit</Typography>
              <Typography variant="h4">UGX {totalDebit.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: theme.palette.error.light }}>
            <CardContent>
              <Typography variant="h6">Total Credit</Typography>
              <Typography variant="h4">UGX {totalCredit.toFixed(2)}</Typography>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Account Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Debit (UGX)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Credit (UGX)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Narration</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  filteredRows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Typography fontWeight="500">{row.accountName}</Typography>
                      </TableCell>
                      <TableCell>
                        {row.debit ? `UGX ${parseFloat(row.debit).toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        {row.credit ? `UGX ${parseFloat(row.credit).toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>{row.narration}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => {
                              setEntryToDelete(row);
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
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="subtitle1">
                        {rows.length === 0 ? 'No journal entries found' : 'No matching entries found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* New Entry Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">New Journal Entry</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={newEntry.date}
                onChange={handleInputChange}
                name="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Account Name"
                fullWidth
                value={newEntry.accountName}
                onChange={handleInputChange}
                name="accountName"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Debit Amount"
                type="number"
                fullWidth
                value={newEntry.debit}
                onChange={handleInputChange}
                name="debit"
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Credit Amount"
                type="number"
                fullWidth
                value={newEntry.credit}
                onChange={handleInputChange}
                name="credit"
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Narration"
                fullWidth
                multiline
                rows={3}
                value={newEntry.narration}
                onChange={handleInputChange}
                name="narration"
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
            onClick={handleCreateEntry} 
            variant="contained"
            color="primary"
            disabled={!newEntry.accountName || (!newEntry.debit && !newEntry.credit)}
          >
            Create Entry
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
            Are you sure you want to delete the journal entry for {entryToDelete?.accountName}?
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Date: {entryToDelete?.date} | 
            {entryToDelete?.debit ? ` Debit: UGX${parseFloat(entryToDelete?.debit).toFixed(2)}` : ""}
            {entryToDelete?.credit ? ` Credit: UGX${parseFloat(entryToDelete?.credit).toFixed(2)}` : ""}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Narration: {entryToDelete?.narration}
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
            onClick={() => handleDeleteEntry(entryToDelete?.id)} 
            variant="contained"
            color="error"
          >
            Delete Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JournalVoucher;