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
  LinearProgress
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Search,
  Refresh,
  Close,
  CheckCircle,
  Cancel,
  Receipt,
  AccountBalance,
  Payment,
  LocalAtm
} from '@mui/icons-material';

const LedgerList = () => {
  const theme = useTheme();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    referenceNumber: '',
    ledgerType: 'Income',
    ledgerGroup: 'General',
    mode: 'Cash',
    amount: '',
  });

  // Ledger types and groups
  const ledgerTypes = ['Income', 'Expense', 'Asset', 'Liability', 'Equity'];
  const ledgerGroups = ['General', 'Sales', 'Purchases', 'Payroll', 'Taxes'];
  const paymentModes = ['Cash', 'Bank Transfer', 'Mobile Money', 'Credit Card', 'Other'];

  // Fetch ledger entries from API
  useEffect(() => {
    const fetchLedgerEntries = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/ledger-entries');
        // const data = await response.json();
        // setEntries(data);
        
        // Initialize with empty array
        setEntries([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching ledger entries:', error);
        setIsLoading(false);
      }
    };

    fetchLedgerEntries();
  }, []);

  // Filter entries based on search term
  const filteredEntries = entries.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.ledgerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create new ledger entry
  const handleCreate = async () => {
    try {
      // TODO: Implement API call to create ledger entry
      /*
      const response = await fetch('/api/ledger-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      const createdEntry = await response.json();
      setEntries([...entries, createdEntry]);
      */
      
      // Temporary local state update
      const createdEntry = {
        ...newEntry,
        id: Date.now(),
        amount: parseFloat(newEntry.amount)
      };
      setEntries([...entries, createdEntry]);
      
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        name: '',
        referenceNumber: '',
        ledgerType: 'Income',
        ledgerGroup: 'General',
        mode: 'Cash',
        amount: '',
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating ledger entry:', error);
    }
  };

  // Handle delete ledger entry
  const handleDelete = async (id) => {
    try {
      // TODO: Implement API call to delete ledger entry
      // await fetch(`/api/ledger-entries/${id}`, { method: 'DELETE' });
      setEntries(entries.filter(entry => entry.id !== id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting ledger entry:', error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  // Get color based on ledger type
  const getLedgerTypeColor = (type) => {
    switch (type) {
      case 'Income': return theme.palette.success.main;
      case 'Expense': return theme.palette.error.main;
      case 'Asset': return theme.palette.info.main;
      case 'Liability': return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Box p={3}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ledger Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            View and manage all ledger entries
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

      {/* Search */}
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search ledger entries..."
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Group</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mode</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>
                        <Typography fontWeight="500">{entry.name}</Typography>
                      </TableCell>
                      <TableCell>{entry.referenceNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={entry.ledgerType}
                          size="small"
                          sx={{ 
                            backgroundColor: getLedgerTypeColor(entry.ledgerType),
                            color: theme.palette.getContrastText(getLedgerTypeColor(entry.ledgerType))
                          }}
                        />
                      </TableCell>
                      <TableCell>{entry.ledgerGroup}</TableCell>
                      <TableCell>
                        <Chip
                          label={entry.mode}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">
                          UGX{entry.amount.toFixed(2)}
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
                              setEntryToDelete(entry);
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
                        {entries.length === 0 ? 'No ledger entries found' : 'No matching entries found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* New Ledger Entry Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">New Ledger Entry</Typography>
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
                value={newEntry.date}
                onChange={handleInputChange}
                name="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ledger Type</InputLabel>
                <Select
                  value={newEntry.ledgerType}
                  onChange={handleInputChange}
                  name="ledgerType"
                  label="Ledger Type"
                >
                  {ledgerTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={newEntry.name}
                onChange={handleInputChange}
                name="name"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Reference Number"
                fullWidth
                value={newEntry.referenceNumber}
                onChange={handleInputChange}
                name="referenceNumber"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ledger Group</InputLabel>
                <Select
                  value={newEntry.ledgerGroup}
                  onChange={handleInputChange}
                  name="ledgerGroup"
                  label="Ledger Group"
                >
                  {ledgerGroups.map(group => (
                    <MenuItem key={group} value={group}>{group}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={newEntry.mode}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={newEntry.amount}
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
            onClick={handleCreate} 
            variant="contained"
            color="primary"
            disabled={!newEntry.name || !newEntry.referenceNumber || !newEntry.amount}
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
            Are you sure you want to delete the ledger entry for {entryToDelete?.name}?
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Reference: {entryToDelete?.referenceNumber} | Amount: UGX{entryToDelete?.amount?.toFixed(2)}
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
            onClick={() => handleDelete(entryToDelete?.id)} 
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

export default LedgerList;