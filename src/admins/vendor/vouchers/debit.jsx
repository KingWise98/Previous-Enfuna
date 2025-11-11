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
  Add,
  Delete,
  Edit,
  Search,
  Close,
  Refresh,
  FileDownload,
  PictureAsPdf,
  Receipt,
  AccountBalance,
  Payment,
  LocalAtm
} from '@mui/icons-material';
import Header from "../../components/Header";
import * as XLSX from 'xlsx';

const DebitVoucher = () => {
  const theme = useTheme();
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  
  const [newVoucher, setNewVoucher] = useState({
    date: new Date().toISOString().split('T')[0],
    accountName: '',
    particular: '',
    warehouse: '',
    mode: 'Cash',
    chequeNo: '',
    amount: '',
  });

  // Payment modes
  const paymentModes = ['Cash', 'Bank Transfer', 'Mobile Money', 'Cheque', 'Other'];

  // Fetch debit vouchers from API
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/debit-vouchers');
        // const data = await response.json();
        // setVouchers(data);
        
        // Initialize with empty array
        setVouchers([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching debit vouchers:', error);
        setIsLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // Filter vouchers based on search term
  const filteredVouchers = vouchers.filter(voucher =>
    voucher.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.particular.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.chequeNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create new voucher
  const handleCreateVoucher = async () => {
    try {
      // TODO: Implement API call to create voucher
      /*
      const response = await fetch('/api/debit-vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVoucher)
      });
      const createdVoucher = await response.json();
      setVouchers([...vouchers, createdVoucher]);
      */
      
      // Temporary local state update
      const createdVoucher = {
        ...newVoucher,
        id: vouchers.length + 1,
        amount: parseFloat(newVoucher.amount)
      };
      setVouchers([...vouchers, createdVoucher]);
      
      setNewVoucher({
        date: new Date().toISOString().split('T')[0],
        accountName: '',
        particular: '',
        warehouse: '',
        mode: 'Cash',
        chequeNo: '',
        amount: '',
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating debit voucher:', error);
    }
  };

  // Handle delete voucher
  const handleDeleteVoucher = async (id) => {
    try {
      // TODO: Implement API call to delete voucher
      // await fetch(`/api/debit-vouchers/${id}`, { method: 'DELETE' });
      setVouchers(vouchers.filter(voucher => voucher.id !== id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting debit voucher:', error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher({ ...newVoucher, [name]: value });
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vouchers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Debit Vouchers");
    XLSX.writeFile(wb, "debit_vouchers.xlsx");
  };

  return (
    <Box p={3}>
      {/* Page Header */}
      <Header title="DEBIT VOUCHER" subtitle="Manage your debit transactions" />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Debit Voucher Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Record and track all debit transactions
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
            New Voucher
          </Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search vouchers..."
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
            startIcon={<FileDownload />}
            onClick={exportToExcel}
            sx={{ mr: 2 }}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdf />}
            onClick={() => window.print()}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

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
                  <TableCell sx={{ fontWeight: 'bold' }}>Particular</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mode</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cheque No.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVouchers.length > 0 ? (
                  filteredVouchers.map((voucher) => (
                    <TableRow key={voucher.id} hover>
                      <TableCell>{voucher.date}</TableCell>
                      <TableCell>
                        <Typography fontWeight="500">{voucher.accountName}</Typography>
                      </TableCell>
                      <TableCell>{voucher.particular}</TableCell>
                      <TableCell>{voucher.warehouse}</TableCell>
                      <TableCell>
                        <Chip
                          label={voucher.mode}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>{voucher.chequeNo}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">
                          UGX{voucher.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => {
                              setVoucherToDelete(voucher);
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
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="subtitle1">
                        {vouchers.length === 0 ? 'No debit vouchers found' : 'No matching vouchers found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* New Voucher Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">New Debit Voucher</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
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
                value={newVoucher.date}
                onChange={handleInputChange}
                name="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={newVoucher.mode}
                  onChange={handleInputChange}
                  name="mode"
                  label="Payment Mode"
                >
                  {paymentModes.map(mode => (
                    <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Account Name"
                fullWidth
                value={newVoucher.accountName}
                onChange={handleInputChange}
                name="accountName"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Particular"
                fullWidth
                value={newVoucher.particular}
                onChange={handleInputChange}
                name="particular"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Warehouse"
                fullWidth
                value={newVoucher.warehouse}
                onChange={handleInputChange}
                name="warehouse"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cheque No."
                fullWidth
                value={newVoucher.chequeNo}
                onChange={handleInputChange}
                name="chequeNo"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={newVoucher.amount}
                onChange={handleInputChange}
                name="amount"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                }}
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
            onClick={handleCreateVoucher} 
            variant="contained"
            color="primary"
            disabled={!newVoucher.accountName || !newVoucher.particular || !newVoucher.amount}
          >
            Create Voucher
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
            Are you sure you want to delete the debit voucher for {voucherToDelete?.accountName}?
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Particular: {voucherToDelete?.particular} | Amount: UGX{voucherToDelete?.amount?.toFixed(2)}
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
            onClick={() => handleDeleteVoucher(voucherToDelete?.id)} 
            variant="contained"
            color="error"
          >
            Delete Voucher
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DebitVoucher;