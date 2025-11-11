import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Button, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle, Chip, MenuItem, Select, InputLabel, 
  FormControl, Grid, Checkbox, FormControlLabel, Tabs, Tab, 
  Badge, Avatar, Tooltip, IconButton, Alert, Snackbar, 
  InputAdornment, Card, CardContent, LinearProgress, Divider
} from '@mui/material';
import { 
  QrCode as QrCodeIcon, Receipt as ReceiptIcon, Payment as PaymentIcon, 
  Add as AddIcon, Search as SearchIcon, FilterList as FilterIcon,
  AttachMoney as CurrencyIcon, Schedule as ScheduleIcon,
  VerifiedUser as ComplianceIcon, People as CustomerIcon,
  LocalOffer as DiscountIcon, Assignment as SOIcon, 
  Warning as WarningIcon, Compare as MatchingIcon,
  Notifications as ReminderIcon, AccountTree as GLIcon,
  Timeline as AgingIcon, Gavel as DisputeIcon,
  Delete as DeleteIcon, CloudUpload as UploadIcon,
  History as AuditIcon, Dashboard as DashboardIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, addDays, differenceInDays } from 'date-fns';

const statusColors = {
  unpaid: 'error',
  partially_paid: 'warning',
  paid: 'success',
  overdue: 'error',
  disputed: 'info',
  written_off: 'default'
};

const currencyOptions = [
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' }
];

const paymentMethods = [
  { code: 'cash', name: 'Cash' },
  { code: 'mobile_money', name: 'Mobile Money' },
  { code: 'bank_transfer', name: 'Bank Transfer' },
  { code: 'cheque', name: 'Cheque' },
  { code: 'credit_card', name: 'Credit Card' }
];

const AccountsReceivable = () => {
  // State for invoices
  const [receivables, setReceivables] = useState([
    {
      id: 'AR-2023-001',
      customer: 'Nakumatt Uganda',
      customerId: 'C-001',
      amount: 4500000,
      paidAmount: 0,
      currency: 'UGX',
      dueDate: '2023-12-15',
      issueDate: '2023-11-25',
      status: 'unpaid',
      efrisInvoice: 'EFRIS-202311-876543',
      tin: 'TIN987654321',
      salesOrder: 'SO-2023-101',
      taxRate: 'VAT 18%',
      discountTerms: '2/10 net 30',
      creditLimit: 10000000,
      creditUsed: 4500000,
      paymentHistory: [],
      notes: '',
      attachments: [],
      disputes: [],
      remindersSent: 0,
      lastReminderDate: null
    },
    {
      id: 'AR-2023-002',
      customer: 'Cafe Javas',
      customerId: 'C-002',
      amount: 1200000,
      paidAmount: 600000,
      currency: 'UGX',
      dueDate: '2023-12-20',
      issueDate: '2023-11-20',
      status: 'partially_paid',
      efrisInvoice: 'EFRIS-202311-123456',
      tin: 'TIN123456789',
      salesOrder: 'SO-2023-102',
      taxRate: 'VAT 18%',
      discountTerms: '',
      creditLimit: 5000000,
      creditUsed: 1200000,
      paymentHistory: [
        { date: '2023-11-25', amount: 600000, method: 'mobile_money', reference: 'MM-REF-12345' }
      ],
      notes: 'Partial payment received',
      attachments: ['receipt_2023-102.pdf'],
      disputes: [],
      remindersSent: 1,
      lastReminderDate: '2023-12-01'
    }
  ]);

  // State for customers
  const [customers, setCustomers] = useState([
    {
      id: 'C-001',
      name: 'Nakumatt Uganda',
      tin: 'TIN987654321',
      contact: 'David Kato',
      email: 'accounts@nakumatt.ug',
      phone: '+256 752 654321',
      address: 'Plot 12, Kampala Road, Kampala',
      paymentTerms: 'net 30',
      currencyPreference: 'UGX',
      creditLimit: 10000000,
      creditRating: 'A',
      bankDetails: {
        bankName: 'Stanbic Bank Uganda',
        accountName: 'Nakumatt Uganda Ltd',
        accountNumber: '9030098765432',
        branch: 'Kampala Road'
      }
    },
    {
      id: 'C-002',
      name: 'Cafe Javas',
      tin: 'TIN123456789',
      contact: 'Sarah Nalubega',
      email: 'finance@cafejavas.com',
      phone: '+256 772 123456',
      address: 'Garden City Mall, Kampala',
      paymentTerms: '2/10 net 30',
      currencyPreference: 'UGX',
      creditLimit: 5000000,
      creditRating: 'B+',
      bankDetails: {
        bankName: 'Centenary Bank',
        accountName: 'Cafe Javas Uganda',
        accountNumber: '37009876543',
        branch: 'Garden City'
      }
    }
  ]);

  // State for sales orders
  const [salesOrders, setSalesOrders] = useState([
    {
      id: 'SO-2023-101',
      customerId: 'C-001',
      date: '2023-11-20',
      amount: 4500000,
      status: 'delivered',
      items: [
        { product: 'Beverages', quantity: 100, unitPrice: 45000 }
      ]
    },
    {
      id: 'SO-2023-102',
      customerId: 'C-002',
      date: '2023-11-15',
      amount: 1200000,
      status: 'delivered',
      items: [
        { product: 'Food Items', quantity: 50, unitPrice: 24000 }
      ]
    }
  ]);

  // UI state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openDisputeDialog, setOpenDisputeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    status: '',
    customer: '',
    dateRange: { start: null, end: null },
    amountRange: { min: '', max: '' }
  });

  // New invoice/payment state
  const [newInvoice, setNewInvoice] = useState({
    id: '',
    customer: '',
    customerId: '',
    amount: 0,
    paidAmount: 0,
    currency: 'UGX',
    dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'unpaid',
    efrisInvoice: '',
    tin: '',
    salesOrder: '',
    taxRate: 'VAT 18%',
    discountTerms: '',
    creditLimit: 0,
    creditUsed: 0,
    lineItems: [{ description: '', quantity: 1, unitPrice: 0, tax: 0, total: 0 }],
    paymentHistory: [],
    notes: '',
    attachments: []
  });

  const [newCustomer, setNewCustomer] = useState({
    id: '',
    name: '',
    tin: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'net 30',
    currencyPreference: 'UGX',
    creditLimit: 0,
    creditRating: 'B',
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

  const [disputeData, setDisputeData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    reason: '',
    amount: 0,
    status: 'open',
    resolution: '',
    notes: ''
  });

  // Filtered invoices
  const filteredInvoices = receivables.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.efrisInvoice.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === '' || invoice.status === filters.status;
    const matchesCustomer = filters.customer === '' || invoice.customerId === filters.customer;
    
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
      (activeTab === 'unpaid' && invoice.status === 'unpaid') ||
      (activeTab === 'overdue' && invoice.status === 'overdue') ||
      (activeTab === 'disputed' && invoice.status === 'disputed') ||
      (activeTab === 'partially_paid' && invoice.status === 'partially_paid') ||
      (activeTab === 'unmatched' && !invoice.salesOrder);
    
    return matchesSearch && matchesStatus && matchesCustomer && matchesDateRange && matchesAmountRange && matchesTab;
  });

  // Calculate aging report
  const agingReport = () => {
    const today = new Date();
    return receivables.reduce((acc, invoice) => {
      if (invoice.status === 'paid') return acc;
      
      const daysOverdue = differenceInDays(today, new Date(invoice.dueDate));
      let bucket;
      
      if (daysOverdue <= 0) bucket = 'current';
      else if (daysOverdue <= 30) bucket = '1-30';
      else if (daysOverdue <= 60) bucket = '31-60';
      else if (daysOverdue <= 90) bucket = '61-90';
      else bucket = '90+';
      
      acc[bucket] = (acc[bucket] || 0) + (invoice.amount - invoice.paidAmount);
      return acc;
    }, {});
  };

  // Check for overdue invoices daily
  useEffect(() => {
    const checkOverdueInvoices = () => {
      const today = new Date();
      const updatedInvoices = receivables.map(invoice => {
        if (invoice.status === 'unpaid' && new Date(invoice.dueDate) < today) {
          return { ...invoice, status: 'overdue' };
        }
        return invoice;
      });
      
      if (JSON.stringify(updatedInvoices) !== JSON.stringify(receivables)) {
        setReceivables(updatedInvoices);
      }
    };
    
    checkOverdueInvoices();
    const interval = setInterval(checkOverdueInvoices, 86400000); // 24 hours
    
    return () => clearInterval(interval);
  }, [receivables]);

  // Handle payment
  const handlePayment = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentData({
      ...paymentData,
      amount: invoice.amount - invoice.paidAmount,
      currency: invoice.currency
    });
    setOpenDialog(true);
  };

  // Record payment
  const recordPayment = () => {
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
    
    // Update customer credit used
    const customer = customers.find(c => c.id === selectedInvoice.customerId);
    if (customer) {
      const updatedCustomer = {
        ...customer,
        creditUsed: customer.creditUsed - paymentData.amount
      };
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    }
    
    setReceivables(receivables.map(item =>
      item.id === selectedInvoice.id ? updatedInvoice : item
    ));
    
    setOpenDialog(false);
    showSnackbar('Payment recorded successfully', 'success');
  };

  // Send payment reminder
  const sendReminder = (invoiceId) => {
    setReceivables(receivables.map(item => {
      if (item.id === invoiceId) {
        return {
          ...item,
          remindersSent: item.remindersSent + 1,
          lastReminderDate: format(new Date(), 'yyyy-MM-dd')
        };
      }
      return item;
    }));
    
    showSnackbar('Payment reminder sent to customer', 'info');
  };

  // Add dispute
  const addDispute = () => {
    const updatedInvoice = {
      ...selectedInvoice,
      status: 'disputed',
      disputes: [...selectedInvoice.disputes, disputeData]
    };
    
    setReceivables(receivables.map(item =>
      item.id === selectedInvoice.id ? updatedInvoice : item
    ));
    
    setOpenDisputeDialog(false);
    showSnackbar('Dispute recorded successfully', 'info');
  };

  // Resolve dispute
    // Resolve dispute
    const resolveDispute = (invoiceId, disputeIndex, resolution) => {
      setReceivables(receivables.map(item => {
        if (item.id === invoiceId) {
          const updatedDisputes = [...item.disputes];
          updatedDisputes[disputeIndex] = {
            ...updatedDisputes[disputeIndex],
            status: 'resolved',
            resolution,
            resolvedDate: format(new Date(), 'yyyy-MM-dd')
          };
    
          return {
            ...item,
            disputes: updatedDisputes,
            status: item.amount === item.paidAmount ? 'paid' :
                   item.paidAmount > 0 ? 'partially_paid' : 'unpaid'
          };
        }
        return item;
      })); // ✅ Closed the parenthesis here
    
      showSnackbar('Dispute resolved successfully', 'success');
    };
    

  // Add new invoice
  const handleAddInvoice = () => {
    setNewInvoice({
      ...newInvoice,
      id: '',
      customer: '',
      customerId: '',
      amount: 0,
      paidAmount: 0,
      dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      efrisInvoice: '',
      tin: '',
      salesOrder: '',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, tax: 0, total: 0 }]
    });
    setOpenAddDialog(true);
  };

  // Add new customer
  const handleAddCustomer = () => {
    setNewCustomer({
      ...newCustomer,
      id: '',
      name: '',
      tin: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      paymentTerms: 'net 30',
      currencyPreference: 'UGX',
      creditLimit: 0,
      creditRating: 'B',
      bankDetails: {
        bankName: '',
        accountName: '',
        accountNumber: '',
        branch: ''
      }
    });
    setOpenCustomerDialog(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
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

  const handleDisputeInputChange = (e) => {
    const { name, value } = e.target;
    setDisputeData(prev => ({
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
      const taxRate = newInvoice.taxRate === 'VAT 18%' ? 18 : 
                     newInvoice.taxRate === 'Withholding Tax 6%' ? 6 : 0;
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
    // Auto-generate ID if not provided
    const invoiceId = newInvoice.id || `AR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const customer = customers.find(c => c.id === newInvoice.customerId) || {};
    
    setReceivables([...receivables, {
      ...newInvoice,
      id: invoiceId,
      customer: customer.name || newInvoice.customer,
      tin: customer.tin || newInvoice.tin,
      amount: newInvoice.lineItems.reduce((sum, item) => sum + item.total, 0),
      creditLimit: customer.creditLimit || 0,
      creditUsed: customer.creditUsed || 0
    }]);
    
    // Update customer credit used
    if (newInvoice.customerId) {
      const updatedCustomer = {
        ...customer,
        creditUsed: (customer.creditUsed || 0) + newInvoice.amount
      };
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    }
    
    setOpenAddDialog(false);
    showSnackbar('Invoice added successfully', 'success');
  };

  // Submit new customer
  const handleSubmitNewCustomer = () => {
    const customerId = newCustomer.id || `C-${Math.floor(1000 + Math.random() * 9000)}`;
    
    setCustomers([...customers, {
      ...newCustomer,
      id: customerId
    }]);
    
    setOpenCustomerDialog(false);
    showSnackbar('Customer added successfully', 'success');
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate totals
  const totals = {
    unpaid: receivables.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0),
    overdue: receivables.filter(i => i.status === 'overdue').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0),
    paid: receivables.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    disputed: receivables.filter(i => i.status === 'disputed').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0)
  };

  const agingData = agingReport();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Accounts Receivable
          <Chip 
            label={`Unpaid: ${totals.unpaid.toLocaleString()} UGX`} 
            color="error" 
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
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="partially_paid">Partially Paid</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="disputed">Disputed</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ mr: 2, minWidth: 150 }}>
              <InputLabel>Customer</InputLabel>
              <Select
                value={filters.customer}
                label="Customer"
                onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
              >
                <MenuItem value="">All Customers</MenuItem>
                {customers.map(customer => (
                  <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
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
              startIcon={<CustomerIcon />}
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </Box>
        </Box>

        {/* Tabs for different views */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="All Invoices" value="all" />
            <Tab label={
              <Badge badgeContent={receivables.filter(i => i.status === 'unpaid').length} color="error">
                <Box sx={{ px: 1 }}>Unpaid</Box>
              </Badge>
            } value="unpaid" />
            <Tab label={
              <Badge badgeContent={receivables.filter(i => i.status === 'overdue').length} color="error">
                <Box sx={{ px: 1 }}>Overdue</Box>
              </Badge>
            } value="overdue" />
            <Tab label={
              <Badge badgeContent={receivables.filter(i => i.status === 'disputed').length} color="info">
                <Box sx={{ px: 1 }}>Disputed</Box>
              </Badge>
            } value="disputed" />
            <Tab label={
              <Badge badgeContent={receivables.filter(i => !i.salesOrder).length} color="secondary">
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
                <TableCell>Customer</TableCell>
                <TableCell>TIN</TableCell>
                <TableCell>Amount (UGX)</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Credit</TableCell>
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
                        {invoice.customer.charAt(0)}
                      </Avatar>
                      {invoice.customer}
                    </Box>
                  </TableCell>
                  <TableCell>{invoice.tin}</TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body2">
                        {invoice.currency === 'UGX' ? 'UGX' : 
                         currencyOptions.find(c => c.code === invoice.currency)?.symbol}
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
                      label={invoice.status.replace('_', ' ')}
                      color={statusColors[invoice.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`Credit Limit: ${invoice.creditLimit.toLocaleString()} UGX | Used: ${invoice.creditUsed.toLocaleString()} UGX`}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(invoice.creditUsed / invoice.creditLimit) * 100} 
                        color={
                          (invoice.creditUsed / invoice.creditLimit) > 0.9 ? 'error' : 
                          (invoice.creditUsed / invoice.creditLimit) > 0.7 ? 'warning' : 'success'
                        }
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePayment(invoice)}
                        disabled={invoice.status === 'paid' || invoice.status === 'disputed'}
                      >
                        Record Payment
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
            {selectedInvoice?.status === 'paid' ? 'Payment Details' : 'Record Payment'}
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
                  <Typography><strong>Customer:</strong> {selectedInvoice?.customer}</Typography>
                  <Typography><strong>Invoice ID:</strong> {selectedInvoice?.id}</Typography>
                  <Typography><strong>EFRIS Invoice:</strong> {selectedInvoice?.efrisInvoice}</Typography>
                  <Typography><strong>TIN:</strong> {selectedInvoice?.tin}</Typography>
                  <Typography><strong>Due Date:</strong> {selectedInvoice?.dueDate}</Typography>
                  <Typography><strong>Amount Due:</strong> {selectedInvoice?.currency === 'UGX' ? 'UGX' : 
                    currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                    {(selectedInvoice?.amount || 0).toLocaleString()}
                  </Typography>
                  {selectedInvoice?.paidAmount > 0 && (
                    <Typography><strong>Amount Paid:</strong> {selectedInvoice?.currency === 'UGX' ? 'UGX' : 
                      currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                      {(selectedInvoice?.paidAmount || 0).toLocaleString()}
                    </Typography>
                  )}
                  <Typography><strong>Balance:</strong> {selectedInvoice?.currency === 'UGX' ? 'UGX' : 
                    currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                    {((selectedInvoice?.amount || 0) - (selectedInvoice?.paidAmount || 0)).toLocaleString()}
                  </Typography>
                </Box>
                
                {selectedInvoice?.salesOrder && (
                  <Box mb={2}>
                    <Typography variant="subtitle2">Sales Order</Typography>
                    <Typography><strong>SO#:</strong> {selectedInvoice?.salesOrder}</Typography>
                    <Typography><strong>Items:</strong> {
                      salesOrders.find(so => so.id === selectedInvoice?.salesOrder)?.items
                        .map(item => `${item.product} (${item.quantity})`).join(', ')
                    }</Typography>
                  </Box>
                )}
                
                {selectedInvoice?.paymentHistory?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2">Payment History</Typography>
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
                        {selectedInvoice?.paymentHistory.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              {payment.currency === 'UGX' ? 'UGX' : 
                               currencyOptions.find(c => c.code === payment.currency)?.symbol}
                              {payment.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {paymentMethods.find(m => m.code === payment.method)?.name}
                            </TableCell>
                            <TableCell>{payment.reference}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {selectedInvoice?.status !== 'paid' && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>Record Payment</Typography>
                    <Box component="form" noValidate autoComplete="off">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                              name="method"
                              value={paymentData.method}
                              label="Payment Method"
                              onChange={handlePaymentInputChange}
                            >
                              {paymentMethods.map(method => (
                                <MenuItem key={method.code} value={method.code}>
                                  {method.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Amount"
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
                              ),
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <DatePicker
                            label="Payment Date"
                            value={new Date(paymentData.date)}
                            onChange={(newValue) => {
                              setPaymentData({
                                ...paymentData,
                                date: format(newValue, 'yyyy-MM-dd')
                              });
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Reference"
                            name="reference"
                            value={paymentData.reference}
                            onChange={handlePaymentInputChange}
                          />
                        </Grid>
                        
                        {selectedInvoice?.currency !== 'UGX' && (
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
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
                                ),
                              }}
                            />
                          </Grid>
                        )}
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Notes"
                            name="notes"
                            multiline
                            rows={3}
                            value={paymentData.notes}
                            onChange={handlePaymentInputChange}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
                
                {selectedInvoice?.disputes?.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="subtitle2">Dispute History</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Reason</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Resolution</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInvoice?.disputes.map((dispute, index) => (
                          <TableRow key={index}>
                            <TableCell>{dispute.date}</TableCell>
                            <TableCell>{dispute.reason}</TableCell>
                            <TableCell>
                              {selectedInvoice?.currency === 'UGX' ? 'UGX' : 
                               currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                              {dispute.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={dispute.status}
                                color={dispute.status === 'resolved' ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{dispute.resolution || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
                
                {selectedInvoice?.status === 'disputed' && 
                  selectedInvoice?.disputes.some(d => d.status === 'open') && (
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        const openDisputeIndex = selectedInvoice.disputes.findIndex(d => d.status === 'open');
                        resolveDispute(
                          selectedInvoice.id, 
                          openDisputeIndex, 
                          prompt('Enter resolution details:')
                        );
                      }}
                    >
                      Resolve Dispute
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {selectedInvoice?.status !== 'paid' && (
              <>
                <Button 
                  onClick={() => {
                    setOpenDialog(false);
                    setOpenDisputeDialog(true);
                  }}
                  color="warning"
                >
                  Record Dispute
                </Button>
                <Button 
                  onClick={() => sendReminder(selectedInvoice.id)}
                  startIcon={<ReminderIcon />}
                >
                  Send Reminder
                </Button>
              </>
            )}
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            {selectedInvoice?.status !== 'paid' && (
              <Button 
                onClick={recordPayment} 
                variant="contained" 
                disabled={paymentData.amount <= 0}
              >
                Record Payment
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Add Invoice Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Customer</InputLabel>
                  <Select
                    name="customerId"
                    value={newInvoice.customerId}
                    label="Customer"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Select Customer</MenuItem>
                    {customers.map(customer => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Invoice ID"
                  name="id"
                  value={newInvoice.id}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="EFRIS Invoice Number"
                  name="efrisInvoice"
                  value={newInvoice.efrisInvoice}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    name="currency"
                    value={newInvoice.currency}
                    label="Currency"
                    onChange={handleInputChange}
                  >
                    {currencyOptions.map(currency => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tax Rate</InputLabel>
                  <Select
                    name="taxRate"
                    value={newInvoice.taxRate}
                    label="Tax Rate"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="VAT 18%">VAT 18%</MenuItem>
                    <MenuItem value="Withholding Tax 6%">Withholding Tax 6%</MenuItem>
                    <MenuItem value="Exempt">Exempt</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Issue Date"
                  value={new Date(newInvoice.issueDate)}
                  onChange={(newValue) => {
                    setNewInvoice({
                      ...newInvoice,
                      issueDate: format(newValue, 'yyyy-MM-dd')
                    });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                />
                
                <DatePicker
                  label="Due Date"
                  value={new Date(newInvoice.dueDate)}
                  onChange={(newValue) => {
                    setNewInvoice({
                      ...newInvoice,
                      dueDate: format(newValue, 'yyyy-MM-dd')
                    });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                />
                
                <TextField
                  fullWidth
                  label="Discount Terms"
                  name="discountTerms"
                  value={newInvoice.discountTerms}
                  onChange={handleInputChange}
                  placeholder="e.g. 2/10 net 30"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Sales Order"
                  name="salesOrder"
                  value={newInvoice.salesOrder}
                  onChange={handleInputChange}
                  select
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="">No Sales Order</MenuItem>
                  {salesOrders.map(order => (
                    <MenuItem key={order.id} value={order.id}>
                      {order.id} ({order.customerId})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Line Items</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell width="100px">Quantity</TableCell>
                      <TableCell width="150px">Unit Price</TableCell>
                      <TableCell width="100px">Tax</TableCell>
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
                              ),
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {newInvoice.currency === 'UGX' ? 'UGX' : 
                           currencyOptions.find(c => c.code === newInvoice.currency)?.symbol}
                          {item.tax.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {newInvoice.currency === 'UGX' ? 'UGX' : 
                           currencyOptions.find(c => c.code === newInvoice.currency)?.symbol}
                          {item.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {newInvoice.lineItems.length > 1 && (
                            <IconButton onClick={() => removeLineItem(index)} size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                  label="Notes"
                  name="notes"
                  multiline
                  rows={3}
                  value={newInvoice.notes}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Typography variant="h6">
                    Total: {newInvoice.currency === 'UGX' ? 'UGX' : 
                           currencyOptions.find(c => c.code === newInvoice.currency)?.symbol}
                    {newInvoice.amount.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitNewInvoice} 
              variant="contained"
              disabled={!newInvoice.customerId || newInvoice.amount <= 0}
            >
              Create Invoice
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Customer Dialog */}
        <Dialog open={openCustomerDialog} onClose={() => setOpenCustomerDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer ID"
                  name="id"
                  value={newCustomer.id}
                  onChange={handleCustomerInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Customer Name"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleCustomerInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="TIN"
                  name="tin"
                  value={newCustomer.tin}
                  onChange={handleCustomerInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Contact Person"
                  name="contact"
                  value={newCustomer.contact}
                  onChange={handleCustomerInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={handleCustomerInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleCustomerInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={newCustomer.address}
                  onChange={handleCustomerInputChange}
                  sx={{ mb: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Payment Terms</InputLabel>
                  <Select
                    name="paymentTerms"
                    value={newCustomer.paymentTerms}
                    label="Payment Terms"
                    onChange={handleCustomerInputChange}
                  >
                    <MenuItem value="net 15">net 15</MenuItem>
                    <MenuItem value="net 30">net 30</MenuItem>
                    <MenuItem value="net 60">net 60</MenuItem>
                    <MenuItem value="2/10 net 30">2/10 net 30</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Currency Preference</InputLabel>
                  <Select
                    name="currencyPreference"
                    value={newCustomer.currencyPreference}
                    label="Currency Preference"
                    onChange={handleCustomerInputChange}
                  >
                    {currencyOptions.map(currency => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Credit Limit (UGX)"
                  name="creditLimit"
                  type="number"
                  value={newCustomer.creditLimit}
                  onChange={handleCustomerInputChange}
                  sx={{ mb: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Credit Rating</InputLabel>
                  <Select
                    name="creditRating"
                    value={newCustomer.creditRating}
                    label="Credit Rating"
                    onChange={handleCustomerInputChange}
                  >
                    <MenuItem value="A">A (Excellent)</MenuItem>
                    <MenuItem value="B+">B+ (Good)</MenuItem>
                    <MenuItem value="B">B (Average)</MenuItem>
                    <MenuItem value="C">C (Poor)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Bank Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      name="bankName"
                      value={newCustomer.bankDetails.bankName}
                      onChange={handleBankDetailsChange}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Account Name"
                      name="accountName"
                      value={newCustomer.bankDetails.accountName}
                      onChange={handleBankDetailsChange}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      name="accountNumber"
                      value={newCustomer.bankDetails.accountNumber}
                      onChange={handleBankDetailsChange}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Branch"
                      name="branch"
                      value={newCustomer.bankDetails.branch}
                      onChange={handleBankDetailsChange}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCustomerDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitNewCustomer} 
              variant="contained"
              disabled={!newCustomer.name || !newCustomer.tin}
            >
              Add Customer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dispute Dialog */}
        <Dialog open={openDisputeDialog} onClose={() => setOpenDisputeDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Record Dispute</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DatePicker
                  label="Dispute Date"
                  value={new Date(disputeData.date)}
                  onChange={(newValue) => {
                    setDisputeData({
                      ...disputeData,
                      date: format(newValue, 'yyyy-MM-dd')
                    });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Dispute"
                  name="reason"
                  value={disputeData.reason}
                  onChange={handleDisputeInputChange}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Disputed Amount"
                  name="amount"
                  type="number"
                  value={disputeData.amount}
                  onChange={handleDisputeInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {selectedInvoice?.currency === 'UGX' ? 'UGX' : 
                         currencyOptions.find(c => c.code === selectedInvoice?.currency)?.symbol}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={disputeData.notes}
                  onChange={handleDisputeInputChange}
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDisputeDialog(false)}>Cancel</Button>
            <Button 
              onClick={addDispute} 
              variant="contained"
              disabled={!disputeData.reason || disputeData.amount <= 0}
            >
              Record Dispute
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default AccountsReceivable;