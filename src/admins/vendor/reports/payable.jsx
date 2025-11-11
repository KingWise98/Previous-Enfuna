import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Chip, MenuItem, Select, FormControl, InputLabel, 
  Grid, Checkbox, FormControlLabel, Tab, Tabs, Badge, Avatar, 
  Tooltip, IconButton, Alert, Snackbar
} from '@mui/material';
import { 
  Receipt as ReceiptIcon, CheckCircle as CheckCircleIcon, 
  Add as AddIcon, Search as SearchIcon, FilterList as FilterIcon,
  AttachMoney as CurrencyIcon, Schedule as ScheduleIcon,
  VerifiedUser as ComplianceIcon, Notifications as NotificationsIcon,
  AccountTree as GLIcon, Timeline as AgingIcon, Gavel as AuditIcon,
  LocalOffer as DiscountIcon, Assignment as POIcon, People as VendorIcon,
  Warning as WarningIcon, Compare as MatchingIcon
} from '@mui/icons-material';

import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, addDays, differenceInDays } from 'date-fns';

const statusColors = {
  pending: 'warning',
  paid: 'success',
  overdue: 'error',
  disputed: 'info',
  scheduled: 'secondary',
  partially_paid: 'primary'
};

const currencyOptions = [
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' }
];

const taxRates = [
  { name: 'VAT 18%', rate: 18 },
  { name: 'Withholding Tax 6%', rate: 6 },
  { name: 'Exempt', rate: 0 }
];

const AccountsPayable = () => {
  // State for invoices
  const [payables, setPayables] = useState([
    {
      id: 'AP-2023-001',
      vendor: 'Uganda Breweries',
      vendorId: 'V-001',
      amount: 3200000,
      paidAmount: 0,
      currency: 'UGX',
      dueDate: '2023-12-10',
      issueDate: '2023-11-25',
      status: 'pending',
      efrisInvoice: 'EFRIS-202311-654321',
      tin: 'TIN654321987',
      purchaseOrder: 'PO-2023-101',
      goodsReceived: 'GRN-2023-101',
      taxRate: 'VAT 18%',
      discountTerms: '2/10 net 30',
      approvers: ['finance@company.com'],
      approved: false,
      matched: false,
      lineItems: [
        { description: 'Beer Supply', quantity: 100, unitPrice: 32000, tax: 576000, total: 3776000 }
      ],
      paymentHistory: [],
      notes: '',
      attachments: []
    },
    {
      id: 'AP-2023-002',
      vendor: 'Mukwano Industries',
      vendorId: 'V-002',
      amount: 1750000,
      paidAmount: 1750000,
      currency: 'UGX',
      dueDate: '2023-12-05',
      issueDate: '2023-11-20',
      status: 'paid',
      efrisInvoice: 'EFRIS-202311-321654',
      tin: 'TIN321654987',
      purchaseOrder: 'PO-2023-102',
      goodsReceived: 'GRN-2023-102',
      taxRate: 'VAT 18%',
      discountTerms: '',
      approvers: ['finance@company.com'],
      approved: true,
      matched: true,
      lineItems: [
        { description: 'Cooking Oil', quantity: 50, unitPrice: 35000, tax: 315000, total: 2065000 }
      ],
      paymentHistory: [
        { date: '2023-12-01', amount: 1750000, method: 'bank_transfer', reference: 'BANK-REF-45678' }
      ],
      notes: 'Paid early to avail discount',
      attachments: ['invoice_2023-102.pdf']
    }
  ]);

  // State for vendors
  const [vendors, setVendors] = useState([
    {
      id: 'V-001',
      name: 'Uganda Breweries',
      tin: 'TIN654321987',
      contact: 'John Mwesigwa',
      email: 'accounts@ugandabreweries.com',
      phone: '+256 752 123456',
      address: 'Plot 45, Industrial Area, Kampala',
      paymentTerms: 'net 30',
      currencyPreference: 'UGX',
      bankDetails: {
        bankName: 'Stanbic Bank Uganda',
        accountName: 'Uganda Breweries Ltd',
        accountNumber: '9030012345678',
        branch: 'Kampala Road'
      }
    },
    {
      id: 'V-002',
      name: 'Mukwano Industries',
      tin: 'TIN321654987',
      contact: 'Sarah Nalwoga',
      email: 'invoices@mukwano.com',
      phone: '+256 772 987654',
      address: 'Plot 33, Namanve Industrial Park',
      paymentTerms: '2/10 net 30',
      currencyPreference: 'UGX',
      bankDetails: {
        bankName: 'Centenary Bank',
        accountName: 'Mukwano Industries',
        accountNumber: '37001234567',
        branch: 'Namanve'
      }
    }
  ]);

  // UI state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openVendorDialog, setOpenVendorDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    status: '',
    vendor: '',
    dateRange: { start: null, end: null },
    amountRange: { min: '', max: '' }
  });

  // New invoice/payment state
  const [newInvoice, setNewInvoice] = useState({
    id: '',
    vendor: '',
    vendorId: '',
    amount: 0,
    paidAmount: 0,
    currency: 'UGX',
    dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'pending',
    efrisInvoice: '',
    tin: '',
    purchaseOrder: '',
    goodsReceived: '',
    taxRate: 'VAT 18%',
    discountTerms: '',
    approvers: [],
    approved: false,
    matched: false,
    lineItems: [{ description: '', quantity: 1, unitPrice: 0, tax: 0, total: 0 }],
    paymentHistory: [],
    notes: '',
    attachments: []
  });

  const [newVendor, setNewVendor] = useState({
    id: '',
    name: '',
    tin: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'net 30',
    currencyPreference: 'UGX',
    bankDetails: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      branch: ''
    }
  });

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    method: 'bank_transfer',
    reference: '',
    currency: 'UGX',
    exchangeRate: 1,
    notes: ''
  });

  // Filtered invoices
  const filteredInvoices = payables.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.efrisInvoice.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === '' || invoice.status === filters.status;
    const matchesVendor = filters.vendor === '' || invoice.vendorId === filters.vendor;
    
    const matchesDateRange = (
      (!filters.dateRange.start || invoice.dueDate >= format(filters.dateRange.start, 'yyyy-MM-dd')) &&
      (!filters.dateRange.end || invoice.dueDate <= format(filters.dateRange.end, 'yyyy-MM-dd'))
    );
    
    const matchesAmountRange = (
      (!filters.amountRange.min || invoice.amount >= Number(filters.amountRange.min)) &&
      (!filters.amountRange.max || invoice.amount <= Number(filters.amountRange.max))
    );
    
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'pending' && invoice.status === 'pending') ||
      (activeTab === 'overdue' && invoice.status === 'overdue') ||
      (activeTab === 'scheduled' && invoice.status === 'scheduled') ||
      (activeTab === 'disputed' && invoice.status === 'disputed') ||
      (activeTab === 'unmatched' && !invoice.matched);
    
    return matchesSearch && matchesStatus && matchesVendor && matchesDateRange && matchesAmountRange && matchesTab;
  });

  // Calculate aging report
  const agingReport = () => {
    const today = new Date();
    return payables.reduce((acc, invoice) => {
      const daysOverdue = differenceInDays(today, new Date(invoice.dueDate));
      let bucket;
      
      if (invoice.status === 'paid') return acc;
      
      if (daysOverdue <= 0) bucket = 'current';
      else if (daysOverdue <= 30) bucket = '1-30';
      else if (daysOverdue <= 60) bucket = '31-60';
      else if (daysOverdue <= 90) bucket = '61-90';
      else bucket = '90+';
      
      acc[bucket] = (acc[bucket] || 0) + invoice.amount - invoice.paidAmount;
      return acc;
    }, {});
  };

  // Check for duplicate invoices
  const checkForDuplicates = (invoice) => {
    return payables.some(ap => 
      ap.efrisInvoice === invoice.efrisInvoice && ap.id !== invoice.id
    );
  };

  // Handle payment approval
  const handlePayment = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentData({
      ...paymentData,
      amount: invoice.amount - invoice.paidAmount,
      currency: invoice.currency
    });
    setOpenDialog(true);
  };

  // Approve payment
  const approvePayment = () => {
    const payment = {
      date: paymentData.date,
      amount: paymentData.amount,
      method: paymentData.method,
      reference: paymentData.reference,
      currency: paymentData.currency,
      exchangeRate: paymentData.exchangeRate
    };
    
    const updatedInvoice = {
      ...selectedInvoice,
      paymentHistory: [...selectedInvoice.paymentHistory, payment],
      paidAmount: selectedInvoice.paidAmount + paymentData.amount,
      status: (selectedInvoice.paidAmount + paymentData.amount) >= selectedInvoice.amount ? 'paid' : 'partially_paid'
    };
    
    setPayables(payables.map(item =>
      item.id === selectedInvoice.id ? updatedInvoice : item
    ));
    
    setOpenDialog(false);
    showSnackbar('Payment processed successfully', 'success');
    
    // Update GL integration would go here
  };

  // Schedule payment
  const schedulePayment = () => {
    const updatedInvoice = {
      ...selectedInvoice,
      status: 'scheduled',
      paymentHistory: [
        ...selectedInvoice.paymentHistory,
        {
          date: paymentData.date,
          amount: paymentData.amount,
          method: paymentData.method,
          reference: 'SCHEDULED-' + Math.floor(Math.random() * 10000),
          status: 'scheduled'
        }
      ]
    };
    
    setPayables(payables.map(item =>
      item.id === selectedInvoice.id ? updatedInvoice : item
    ));
    
    setOpenDialog(false);
    showSnackbar('Payment scheduled successfully', 'success');
  };

  // Add new invoice
  const handleAddInvoice = () => {
    setNewInvoice({
      ...newInvoice,
      id: '',
      vendor: '',
      vendorId: '',
      amount: 0,
      paidAmount: 0,
      dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      efrisInvoice: '',
      tin: '',
      purchaseOrder: '',
      goodsReceived: '',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, tax: 0, total: 0 }]
    });
    setOpenAddDialog(true);
  };

  // Add new vendor
  const handleAddVendor = () => {
    setNewVendor({
      id: '',
      name: '',
      tin: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      paymentTerms: 'net 30',
      currencyPreference: 'UGX',
      bankDetails: {
        bankName: '',
        accountName: '',
        accountNumber: '',
        branch: ''
      }
    });
    setOpenVendorDialog(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVendorInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setNewVendor(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value
      }
    }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle line item changes
  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...newInvoice.lineItems];
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      [field]: value
    };
    
    // Calculate tax and total if unitPrice or quantity changes
    if (field === 'unitPrice' || field === 'quantity') {
      const taxRate = taxRates.find(t => t.name === newInvoice.taxRate)?.rate || 0;
      const subtotal = updatedLineItems[index].quantity * updatedLineItems[index].unitPrice;
      const tax = subtotal * (taxRate / 100);
      
      updatedLineItems[index] = {
        ...updatedLineItems[index],
        tax: tax,
        total: subtotal + tax
      };
    }
    
    setNewInvoice(prev => ({
      ...prev,
      lineItems: updatedLineItems,
      amount: updatedLineItems.reduce((sum, item) => sum + item.total, 0)
    }));
  };

  // Add new line item
  const addLineItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { description: '', quantity: 1, unitPrice: 0, tax: 0, total: 0 }
      ]
    }));
  };

  // Remove line item
  const removeLineItem = (index) => {
    const updatedLineItems = [...newInvoice.lineItems];
    updatedLineItems.splice(index, 1);
    
    setNewInvoice(prev => ({
      ...prev,
      lineItems: updatedLineItems,
      amount: updatedLineItems.reduce((sum, item) => sum + item.total, 0)
    }));
  };

  // Submit new invoice
  const handleSubmitNewInvoice = () => {
    if (checkForDuplicates(newInvoice)) {
      showSnackbar('Duplicate EFRIS invoice detected', 'error');
      return;
    }
    
    // Auto-generate ID if not provided
    const invoiceId = newInvoice.id || `AP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Perform 3-way matching if PO and GRN are provided
    const matched = newInvoice.purchaseOrder && newInvoice.goodsReceived;
    
    const vendor = vendors.find(v => v.id === newInvoice.vendorId) || {};
    
    setPayables([...payables, {
      ...newInvoice,
      id: invoiceId,
      vendor: vendor.name || newInvoice.vendor,
      tin: vendor.tin || newInvoice.tin,
      amount: newInvoice.lineItems.reduce((sum, item) => sum + item.total, 0),
      matched,
      status: matched ? 'pending' : 'disputed'
    }]);
    
    setOpenAddDialog(false);
    showSnackbar('Invoice added successfully', 'success');
  };

  // Submit new vendor
  const handleSubmitNewVendor = () => {
    const vendorId = newVendor.id || `V-${Math.floor(1000 + Math.random() * 9000)}`;
    
    setVendors([...vendors, {
      ...newVendor,
      id: vendorId
    }]);
    
    setOpenVendorDialog(false);
    showSnackbar('Vendor added successfully', 'success');
  };

  // Perform 3-way matching
  const performMatching = (invoiceId) => {
    setPayables(payables.map(item => {
      if (item.id === invoiceId) {
        const matched = item.purchaseOrder && item.goodsReceived;
        return {
          ...item,
          matched,
          status: matched ? 'pending' : 'disputed'
        };
      }
      return item;
    }));
    
    showSnackbar('Invoice matching completed', 'success');
  };

  // Approve invoice
  const approveInvoice = (invoiceId) => {
    setPayables(payables.map(item => {
      if (item.id === invoiceId) {
        return {
          ...item,
          approved: true,
          status: item.status === 'pending' ? 'scheduled' : item.status
        };
      }
      return item;
    }));
    
    showSnackbar('Invoice approved', 'success');
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Check for overdue invoices daily
  useEffect(() => {
    const checkOverdueInvoices = () => {
      const today = new Date();
      const updatedInvoices = payables.map(invoice => {
        if (invoice.status === 'pending' && new Date(invoice.dueDate) < today) {
          return { ...invoice, status: 'overdue' };
        }
        return invoice;
      });
      
      if (JSON.stringify(updatedInvoices) !== JSON.stringify(payables)) {
        setPayables(updatedInvoices);
        // In a real app, you might want to send notifications here
      }
    };
    
    // Check immediately
    checkOverdueInvoices();
    
    // Set up daily check (simulated for this demo)
    const interval = setInterval(checkOverdueInvoices, 86400000); // 24 hours
    
    return () => clearInterval(interval);
  }, [payables]);

  // Calculate totals
  const totals = {
    pending: payables.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0),
    overdue: payables.filter(i => i.status === 'overdue').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0),
    paid: payables.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    disputed: payables.filter(i => i.status === 'disputed').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0)
  };

  const agingData = agingReport();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Accounts Payable
          <Chip 
            label={`Pending: ${totals.pending.toLocaleString()} UGX`} 
            color="warning" 
            variant="outlined" 
            sx={{ ml: 2 }} 
          />
          <Chip 
            label={`Overdue: ${totals.overdue.toLocaleString()} UGX`} 
            color="error" 
            variant="outlined" 
            sx={{ ml: 1 }} 
          />
        </Typography>

        {/* Aging Report Summary */}
        <Box mb={3} p={2} bgcolor="background.paper" borderRadius={1} boxShadow={1}>
          <Typography variant="h6" gutterBottom>
            Aging Report
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                <Typography variant="subtitle2">Current</Typography>
                <Typography variant="h6">{(agingData.current || 0).toLocaleString()} UGX</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                <Typography variant="subtitle2">1-30 Days</Typography>
                <Typography variant="h6">{(agingData['1-30'] || 0).toLocaleString()} UGX</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                <Typography variant="subtitle2">31-60 Days</Typography>
                <Typography variant="h6">{(agingData['31-60'] || 0).toLocaleString()} UGX</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'error.dark' }}>
                <Typography variant="subtitle2">61-90 Days</Typography>
                <Typography variant="h6">{(agingData['61-90'] || 0).toLocaleString()} UGX</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.700' }}>
                <Typography variant="subtitle2">90+ Days</Typography>
                <Typography variant="h6">{(agingData['90+'] || 0).toLocaleString()} UGX</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                <Typography variant="subtitle2">Total Outstanding</Typography>
                <Typography variant="h6">
                  {Object.values(agingData).reduce((sum, val) => sum + (val || 0), 0).toLocaleString()} UGX
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Toolbar with search, filters, and actions */}
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box display="flex" alignItems="center" mb={1}>
            <TextField
              size="small"
              placeholder="Search invoices..."
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
              sx={{ mr: 2, width: 300 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Tooltip title="Filters">
              <IconButton sx={{ mr: 1 }}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
            
            <FormControl size="small" sx={{ mr: 2, minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="disputed">Disputed</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ mr: 2, minWidth: 150 }}>
              <InputLabel>Vendor</InputLabel>
              <Select
                value={filters.vendor}
                label="Vendor"
                onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
              >
                <MenuItem value="">All Vendors</MenuItem>
                {vendors.map(vendor => (
                  <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box display="flex" alignItems="center" mb={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddInvoice}
              sx={{ mr: 1 }}
            >
              Add Invoice
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<VendorIcon />}
              onClick={handleAddVendor}
            >
              Add Vendor
            </Button>
          </Box>
        </Box>

        {/* Tabs for different views */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="All Invoices" value="all" />
            <Tab label={
              <Badge badgeContent={payables.filter(i => i.status === 'pending').length} color="warning">
                <Box sx={{ px: 1 }}>Pending</Box>
              </Badge>
            } value="pending" />
            <Tab label={
              <Badge badgeContent={payables.filter(i => i.status === 'overdue').length} color="error">
                <Box sx={{ px: 1 }}>Overdue</Box>
              </Badge>
            } value="overdue" />
            <Tab label={
              <Badge badgeContent={payables.filter(i => i.status === 'disputed').length} color="info">
                <Box sx={{ px: 1 }}>Disputed</Box>
              </Badge>
            } value="disputed" />
            <Tab label={
              <Badge badgeContent={payables.filter(i => !i.matched).length} color="secondary">
                <Box sx={{ px: 1 }}>Unmatched</Box>
              </Badge>
            } value="unmatched" />
          </Tabs>
        </Box>

        {/* Main table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>TIN</TableCell>
                <TableCell>Amount (UGX)</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>PO Matching</TableCell>
                <TableCell>Approval</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {invoice.status === 'overdue' && (
                        <Tooltip title="Overdue">
                          <WarningIcon color="error" sx={{ mr: 1 }} />
                        </Tooltip>
                      )}
                      {invoice.discountTerms && (
                        <Tooltip title="Early payment discount available">
                          <DiscountIcon color="secondary" sx={{ mr: 1 }} />
                        </Tooltip>
                      )}
                      {invoice.efrisInvoice && (
                        <Tooltip title="EFRIS Verified">
                          <ComplianceIcon color="success" sx={{ mr: 1 }} />
                        </Tooltip>
                      )}
                      {invoice.id}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                        {invoice.vendor.charAt(0)}
                      </Avatar>
                      {invoice.vendor}
                    </Box>
                  </TableCell>
                  <TableCell>{invoice.tin}</TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body2">
                        {invoice.currency === 'UGX' ? 'UGX' : currencyOptions.find(c => c.code === invoice.currency)?.symbol}
                        {(invoice.amount).toLocaleString()}
                      </Typography>
                      {invoice.paidAmount > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          Paid: {(invoice.paidAmount).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body2">{invoice.dueDate}</Typography>
                      {invoice.discountTerms && (
                        <Typography variant="caption" color="secondary">
                          {invoice.discountTerms}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={statusColors[invoice.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={invoice.matched ? "3-way matched with PO and GRN" : "Not matched with PO/GRN"}>
                      <Chip
                        icon={<MatchingIcon />}
                        label={invoice.matched ? "Matched" : "Unmatched"}
                        color={invoice.matched ? "success" : "error"}
                        size="small"
                        onClick={() => performMatching(invoice.id)}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {invoice.approved ? (
                      <Chip label="Approved" color="success" size="small" />
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => approveInvoice(invoice.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handlePayment(invoice)}
                        disabled={invoice.status === 'paid' || !invoice.approved}
                      >
                        Pay
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setOpenDialog(true);
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Payment Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>
            {selectedInvoice?.status === 'paid' ? 'Payment Details' : 'Process Payment'}
            <Chip 
              label={selectedInvoice?.status} 
              color={statusColors[selectedInvoice?.status] || 'default'} 
              size="small" 
              sx={{ ml: 2 }} 
            />
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>Invoice Details</Typography>
                <Box mb={2}>
                  <Typography><strong>Vendor:</strong> {selectedInvoice?.vendor}</Typography>
                  <Typography><strong>Invoice ID:</strong> {selectedInvoice?.id}</Typography>
                  <Typography><strong>EFRIS Invoice:</strong> {selectedInvoice?.efrisInvoice}</Typography>
                  <Typography><strong>TIN:</strong> {selectedInvoice?.tin}</Typography>
                  <Typography><strong>Due Date:</strong> {selectedInvoice?.dueDate}</Typography>
                  <Typography><strong>Amount Due:</strong> {selectedInvoice?.currency === 'UGX' ? 'UGX' : currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                    {(selectedInvoice?.amount || 0).toLocaleString()}
                  </Typography>
                  {selectedInvoice?.paidAmount > 0 && (
                    <Typography><strong>Amount Paid:</strong> {selectedInvoice?.currency === 'UGX' ? 'UGX' : currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                      {(selectedInvoice?.paidAmount || 0).toLocaleString()}
                    </Typography>
                  )}
                  <Typography><strong>Balance:</strong> {selectedInvoice?.currency === 'UGX' ? 'UGX' : currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                    {((selectedInvoice?.amount || 0) - (selectedInvoice?.paidAmount || 0)).toLocaleString()}
                  </Typography>
                </Box>
                
                {selectedInvoice?.purchaseOrder && (
                  <Box mb={2}>
                    <Typography variant="subtitle2">Purchase Order Matching</Typography>
                    <Typography><strong>PO Number:</strong> {selectedInvoice?.purchaseOrder}</Typography>
                    {selectedInvoice?.goodsReceived && (
                      <Typography><strong>GRN Number:</strong> {selectedInvoice?.goodsReceived}</Typography>
                    )}
                    <Chip
                      label={selectedInvoice?.matched ? "3-way matched" : "Not matched"}
                      color={selectedInvoice?.matched ? "success" : "error"}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}
                
                {selectedInvoice?.discountTerms && (
                  <Box mb={2}>
                    <Typography variant="subtitle2">Discount Terms</Typography>
                    <Typography color="secondary">{selectedInvoice?.discountTerms}</Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {selectedInvoice?.status !== 'paid' && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>Payment Information</Typography>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        name="method"
                        value={paymentData.method}
                        onChange={handlePaymentInputChange}
                        label="Payment Method"
                      >
                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                        <MenuItem value="mobile_money">Mobile Money</MenuItem>
                        <MenuItem value="cheque">Cheque</MenuItem>
                        <MenuItem value="cash">Cash</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Payment Amount"
                      name="amount"
                      type="number"
                      value={paymentData.amount}
                      onChange={handlePaymentInputChange}
                      
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {selectedInvoice?.currency === 'UGX' ? 'UGX' : 
                             currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                          </InputAdornment>
                        )
                      }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Payment Date"
                        value={new Date(paymentData.date)}
                        onChange={(newDate) => {
                          setPaymentData({
                            ...paymentData,
                            date: format(newDate, 'yyyy-MM-dd')
                          });
                        }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth margin="normal" />
                        )}
                      />
                    </LocalizationProvider>

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Reference Number"
                      name="reference"
                      value={paymentData.reference}
                      onChange={handlePaymentInputChange}
                    />

                    {selectedInvoice?.currency !== 'UGX' && (
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Exchange Rate"
                        name="exchangeRate"
                        type="number"
                        value={paymentData.exchangeRate}
                        onChange={handlePaymentInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              1 {selectedInvoice?.currency} =
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              UGX
                            </InputAdornment>
                          )
                        }}
                      />
                    )}

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Notes"
                      name="notes"
                      multiline
                      rows={3}
                      value={paymentData.notes}
                      onChange={handlePaymentInputChange}
                    />
                  </>
                )}

                {selectedInvoice?.status === 'paid' && (
                  <Box mt={2}>
                    <Typography variant="subtitle1" gutterBottom>Payment History</Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Reference</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedInvoice?.paymentHistory?.map((payment, index) => (
                            <TableRow key={index}>
                              <TableCell>{payment.date}</TableCell>
                              <TableCell>
                                {payment.currency === 'UGX' ? 'UGX' : 
                                 currencyOptions.find(c => c.code === payment.currency)?.symbol}
                                {payment.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {payment.method === 'bank_transfer' ? 'Bank Transfer' : 
                                 payment.method === 'mobile_money' ? 'Mobile Money' : 
                                 payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                              </TableCell>
                              <TableCell>{payment.reference}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            {selectedInvoice?.status !== 'paid' && (
              <>
                <Button 
                  onClick={schedulePayment}
                  startIcon={<ScheduleIcon />}
                >
                  Schedule
                </Button>
                <Button 
                  onClick={approvePayment}
                  variant="contained"
                  color="primary"
                  startIcon={<CheckCircleIcon />}
                >
                  Process Payment
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Add Invoice Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Add New Payable Invoice</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    name="vendorId"
                    value={newInvoice.vendorId}
                    onChange={(e) => {
                      const vendor = vendors.find(v => v.id === e.target.value);
                      setNewInvoice({
                        ...newInvoice,
                        vendorId: e.target.value,
                        vendor: vendor?.name || '',
                        tin: vendor?.tin || ''
                      });
                    }}
                    label="Vendor"
                  >
                    {vendors.map(vendor => (
                      <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Invoice ID"
                  name="id"
                  value={newInvoice.id}
                  onChange={handleInputChange}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="EFRIS Invoice Number"
                  name="efrisInvoice"
                  value={newInvoice.efrisInvoice}
                  onChange={handleInputChange}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="TIN"
                  name="tin"
                  value={newInvoice.tin}
                  onChange={handleInputChange}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Issue Date"
                    value={new Date(newInvoice.issueDate)}
                    onChange={(newDate) => {
                      setNewInvoice({
                        ...newInvoice,
                        issueDate: format(newDate, 'yyyy-MM-dd')
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Date"
                    value={new Date(newInvoice.dueDate)}
                    onChange={(newDate) => {
                      setNewInvoice({
                        ...newInvoice,
                        dueDate: format(newDate, 'yyyy-MM-dd')
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Currency</InputLabel>
                  <Select
                    name="currency"
                    value={newInvoice.currency}
                    onChange={handleInputChange}
                    label="Currency"
                  >
                    {currencyOptions.map(currency => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Tax Rate</InputLabel>
                  <Select
                    name="taxRate"
                    value={newInvoice.taxRate}
                    onChange={handleInputChange}
                    label="Tax Rate"
                  >
                    {taxRates.map(tax => (
                      <MenuItem key={tax.name} value={tax.name}>
                        {tax.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Purchase Order Number"
                  name="purchaseOrder"
                  value={newInvoice.purchaseOrder}
                  onChange={handleInputChange}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Goods Received Note"
                  name="goodsReceived"
                  value={newInvoice.goodsReceived}
                  onChange={handleInputChange}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Discount Terms"
                  name="discountTerms"
                  value={newInvoice.discountTerms}
                  onChange={handleInputChange}
                  placeholder="e.g. 2/10 net 30"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Line Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell width="100px">Qty</TableCell>
                        <TableCell width="150px">Unit Price</TableCell>
                        <TableCell width="150px">Tax</TableCell>
                        <TableCell width="150px">Total</TableCell>
                        <TableCell width="50px"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {newInvoice.lineItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              value={item.description}
                              onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleLineItemChange(index, 'quantity', Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleLineItemChange(index, 'unitPrice', Number(e.target.value))}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {newInvoice.currency === 'UGX' ? 'UGX' : 
                                     currencyOptions.find(c => c.code === newInvoice.currency)?.symbol}
                                  </InputAdornment>
                                )
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={item.tax}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {newInvoice.currency === 'UGX' ? 'UGX' : 
                                     currencyOptions.find(c => c.code === newInvoice.currency)?.symbol}
                                  </InputAdornment>
                                ),
                                readOnly: true
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={item.total}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {newInvoice.currency === 'UGX' ? 'UGX' : 
                                     currencyOptions.find(c => c.code === newInvoice.currency)?.symbol}
                                  </InputAdornment>
                                ),
                                readOnly: true
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => removeLineItem(index)}
                              disabled={newInvoice.lineItems.length <= 1}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={addLineItem}
                  sx={{ mt: 1 }}
                >
                  Add Line Item
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Notes"
                  name="notes"
                  multiline
                  rows={3}
                  value={newInvoice.notes}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitNewInvoice}
              variant="contained"
              color="primary"
            >
              Save Invoice
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Vendor Dialog */}
        <Dialog open={openVendorDialog} onClose={() => setOpenVendorDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add New Vendor</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Vendor Name"
                  name="name"
                  value={newVendor.name}
                  onChange={handleVendorInputChange}
                  required
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="TIN"
                  name="tin"
                  value={newVendor.tin}
                  onChange={handleVendorInputChange}
                  required
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Contact Person"
                  name="contact"
                  value={newVendor.contact}
                  onChange={handleVendorInputChange}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  type="email"
                  value={newVendor.email}
                  onChange={handleVendorInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Phone"
                  name="phone"
                  value={newVendor.phone}
                  onChange={handleVendorInputChange}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={newVendor.address}
                  onChange={handleVendorInputChange}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Payment Terms</InputLabel>
                  <Select
                    name="paymentTerms"
                    value={newVendor.paymentTerms}
                    onChange={handleVendorInputChange}
                    label="Payment Terms"
                  >
                    <MenuItem value="net 15">Net 15</MenuItem>
                    <MenuItem value="net 30">Net 30</MenuItem>
                    <MenuItem value="net 60">Net 60</MenuItem>
                    <MenuItem value="2/10 net 30">2/10 net 30</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Preferred Currency</InputLabel>
                  <Select
                    name="currencyPreference"
                    value={newVendor.currencyPreference}
                    onChange={handleVendorInputChange}
                    label="Preferred Currency"
                  >
                    {currencyOptions.map(currency => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Bank Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Bank Name"
                      name="bankName"
                      value={newVendor.bankDetails.bankName}
                      onChange={handleBankDetailsChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Account Name"
                      name="accountName"
                      value={newVendor.bankDetails.accountName}
                      onChange={handleBankDetailsChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Account Number"
                      name="accountNumber"
                      value={newVendor.bankDetails.accountNumber}
                      onChange={handleBankDetailsChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Branch"
                      name="branch"
                      value={newVendor.bankDetails.branch}
                      onChange={handleBankDetailsChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenVendorDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitNewVendor}
              variant="contained"
              color="primary"
            >
              Save Vendor
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default AccountsPayable;