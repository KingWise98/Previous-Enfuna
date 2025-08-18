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
  InputAdornment,
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
  Avatar,
  Tooltip,
  useTheme,
  Divider,
  Card,
  CardContent,
  Badge,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete,
  CreditCard,
  Receipt,
  Payment,
  AttachMoney,
  CalendarToday,
  Search,
  Close,
  CheckCircle,
  Cancel,
  MoreVert,
  Refresh,
  History,
  Subscriptions,
  MoneyOff,
  Upgrade
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const BillingSubscriptionPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Mock data generation
  useEffect(() => {
    setIsLoading(true);
    
    // Generate mock subscriptions
    const mockSubscriptions = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      customer: `Business ${i + 1}`,
      customerId: `CUST-${1000 + i}`,
      plan: ['Basic', 'Pro', 'Enterprise'][Math.floor(Math.random() * 3)],
      status: ['active', 'past_due', 'canceled', 'trialing'][Math.floor(Math.random() * 4)],
      amount: [29, 99, 299][Math.floor(Math.random() * 3)],
      currency: 'USD',
      billingCycle: 'monthly',
      startDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: ['credit_card', 'bank_transfer', 'mobile_money'][Math.floor(Math.random() * 3)]
    }));

    // Generate mock transactions
    const mockTransactions = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      subscriptionId: Math.floor(Math.random() * 15) + 1,
      amount: [29, 99, 299][Math.floor(Math.random() * 3)],
      currency: 'USD',
      status: ['completed', 'pending', 'failed', 'refunded'][Math.floor(Math.random() * 4)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: ['credit_card', 'bank_transfer', 'mobile_money'][Math.floor(Math.random() * 3)],
      invoiceId: `INV-${2000 + i}`
    }));

    // Generate mock invoices
    const mockInvoices = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      subscriptionId: Math.floor(Math.random() * 15) + 1,
      number: `INV-${3000 + i}`,
      amount: [29, 99, 299][Math.floor(Math.random() * 3)],
      currency: 'USD',
      status: ['paid', 'pending', 'overdue', 'void'][Math.floor(Math.random() * 4)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      pdfUrl: '#'
    }));

    setSubscriptions(mockSubscriptions);
    setTransactions(mockTransactions);
    setInvoices(mockInvoices);
    setIsLoading(false);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubscriptionStatusChange = (id, newStatus) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    ));
  };

  const handleSaveSubscription = () => {
    if (selectedSubscription.id) {
      // Update existing subscription
      setSubscriptions(subscriptions.map(sub => 
        sub.id === selectedSubscription.id ? selectedSubscription : sub
      ));
    } else {
      // Add new subscription
      setSubscriptions([...subscriptions, { 
        ...selectedSubscription, 
        id: subscriptions.length + 1 
      }]);
    }
    setOpenSubscriptionDialog(false);
  };

  const handleProcessPayment = () => {
    const newTransaction = {
      id: transactions.length + 1,
      subscriptionId: selectedTransaction?.subscriptionId || null,
      amount: paymentAmount,
      currency: 'USD',
      status: 'completed',
      date: new Date().toISOString(),
      paymentMethod: paymentMethod,
      invoiceId: selectedTransaction?.invoiceId || null
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update subscription if payment was for a subscription
    if (selectedTransaction?.subscriptionId) {
      setSubscriptions(subscriptions.map(sub => 
        sub.id === selectedTransaction.subscriptionId 
          ? { ...sub, status: 'active' } 
          : sub
      ));
    }
    
    setOpenPaymentDialog(false);
    setPaymentAmount(0);
    setSelectedTransaction(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'paid':
        return theme.palette.success.main;
      case 'pending':
      case 'trialing':
        return theme.palette.warning.main;
      case 'past_due':
      case 'overdue':
        return theme.palette.error.main;
      case 'canceled':
      case 'failed':
      case 'void':
        return theme.palette.grey[500];
      default:
        return theme.palette.info.main;
    }
  };

  const subscriptionColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'customer', 
      headerName: 'Customer', 
      width: 180,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
            {params.row.customer.charAt(0)}
          </Avatar>
          <Box>
            <Typography>{params.row.customer}</Typography>
            <Typography variant="caption" color="textSecondary">
              {params.row.customerId}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      field: 'plan', 
      headerName: 'Plan', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.row.plan} 
          color={
            params.row.plan === 'Enterprise' ? 'primary' :
            params.row.plan === 'Pro' ? 'secondary' : 'default'
          }
          size="small"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.status.replace('_', ' ')}
          size="small"
          sx={{ 
            backgroundColor: getStatusColor(params.row.status),
            color: theme.palette.getContrastText(getStatusColor(params.row.status))
          }}
        />
      )
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 100,
      renderCell: (params) => (
        <Typography fontWeight="500">
          ${params.row.amount}
        </Typography>
      )
    },
    { 
      field: 'billingCycle', 
      headerName: 'Cycle', 
      width: 90,
      renderCell: (params) => (
        <Typography textTransform="capitalize">
          {params.row.billingCycle}
        </Typography>
      )
    },
    { 
      field: 'nextBillingDate', 
      headerName: 'Next Billing', 
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <CalendarToday fontSize="small" sx={{ mr: 1 }} />
          <Typography>
            {new Date(params.row.nextBillingDate).toLocaleDateString()}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'paymentMethod', 
      headerName: 'Payment Method', 
      width: 150,
      renderCell: (params) => (
        <Typography textTransform="capitalize">
          {params.row.paymentMethod.replace('_', ' ')}
        </Typography>
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              onClick={() => {
                setSelectedSubscription(params.row);
                setOpenSubscriptionDialog(true);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.status === 'past_due' && (
            <Tooltip title="Collect Payment">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => {
                  setSelectedTransaction({
                    subscriptionId: params.row.id,
                    amount: params.row.amount
                  });
                  setPaymentAmount(params.row.amount);
                  setOpenPaymentDialog(true);
                }}
              >
                <Payment fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  const transactionColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'subscriptionId', 
      headerName: 'Subscription', 
      width: 120,
      renderCell: (params) => (
        params.row.subscriptionId ? (
          <Chip 
            label={`#${params.row.subscriptionId}`} 
            size="small"
            color="primary"
          />
        ) : (
          <Typography color="textSecondary">Manual</Typography>
        )
      )
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 120,
      renderCell: (params) => (
        <Typography fontWeight="500">
          ${params.row.amount}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          size="small"
          sx={{ 
            backgroundColor: getStatusColor(params.row.status),
            color: theme.palette.getContrastText(getStatusColor(params.row.status))
          }}
        />
      )
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 150,
      renderCell: (params) => (
        <Typography>
          {new Date(params.row.date).toLocaleDateString()}
        </Typography>
      )
    },
    { 
      field: 'paymentMethod', 
      headerName: 'Method', 
      width: 120,
      renderCell: (params) => (
        <Typography textTransform="capitalize">
          {params.row.paymentMethod.replace('_', ' ')}
        </Typography>
      )
    },
    { 
      field: 'invoiceId', 
      headerName: 'Invoice', 
      width: 120,
      renderCell: (params) => (
        params.row.invoiceId ? (
          <Button 
            size="small" 
            startIcon={<Receipt />}
            onClick={() => window.open('#')}
          >
            View
          </Button>
        ) : (
          <Typography color="textSecondary">None</Typography>
        )
      )
    }
  ];

  const invoiceColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'number', headerName: 'Invoice #', width: 120 },
    { 
      field: 'subscriptionId', 
      headerName: 'Subscription', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={`#${params.row.subscriptionId}`} 
          size="small"
          color="primary"
        />
      )
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 120,
      renderCell: (params) => (
        <Typography fontWeight="500">
          ${params.row.amount}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          size="small"
          sx={{ 
            backgroundColor: getStatusColor(params.row.status),
            color: theme.palette.getContrastText(getStatusColor(params.row.status))
          }}
        />
      )
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => (
        <Typography>
          {new Date(params.row.date).toLocaleDateString()}
        </Typography>
      )
    },
    { 
      field: 'dueDate', 
      headerName: 'Due Date', 
      width: 120,
      renderCell: (params) => (
        <Typography>
          {new Date(params.row.dueDate).toLocaleDateString()}
        </Typography>
      )
    },
    { 
      field: 'pdfUrl', 
      headerName: 'Actions', 
      width: 120,
      renderCell: (params) => (
        <Button 
          size="small" 
          startIcon={<Receipt />}
          onClick={() => window.open('#')}
        >
          Download
        </Button>
      )
    }
  ];

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Billing & Subscriptions
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage customer subscriptions, payments, and invoices
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Payment />}
            onClick={() => {
              setSelectedTransaction(null);
              setPaymentAmount(0);
              setOpenPaymentDialog(true);
            }}
            sx={{ mr: 2 }}
          >
            Record Payment
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => {
              setSelectedSubscription({
                id: null,
                customer: '',
                customerId: '',
                plan: 'Basic',
                status: 'active',
                amount: 29,
                currency: 'USD',
                billingCycle: 'monthly',
                startDate: new Date().toISOString(),
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'credit_card'
              });
              setOpenSubscriptionDialog(true);
            }}
          >
            Add Subscription
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Active Subscriptions
                </Typography>
                <Subscriptions color="primary" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {subscriptions.filter(s => s.status === 'active').length}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">
                  <Box component="span" color="success.main" mr={0.5}>
                    +{Math.floor(Math.random() * 10)}%
                  </Box>
                  vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  MRR
                </Typography>
                <AttachMoney color="secondary" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                ${subscriptions
                  .filter(s => s.status === 'active')
                  .reduce((sum, sub) => sum + sub.amount, 0)
                  .toLocaleString()}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">
                  <Box component="span" color="success.main" mr={0.5}>
                    +{Math.floor(Math.random() * 8)}%
                  </Box>
                  vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Past Due
                </Typography>
                <MoneyOff color="error" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {subscriptions.filter(s => s.status === 'past_due').length}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">
                  <Box component="span" color={Math.random() > 0.5 ? "success.main" : "error.main"} mr={0.5}>
                    {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 5)}%
                  </Box>
                  vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography color="textSecondary" gutterBottom>
                  Avg. Revenue Per User
                </Typography>
                <Upgrade color="warning" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                ${(
                  subscriptions
                    .filter(s => s.status === 'active')
                    .reduce((sum, sub) => sum + sub.amount, 0) / 
                  (subscriptions.filter(s => s.status === 'active').length || 1)
                  .toFixed(2))}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">
                  <Box component="span" color="success.main" mr={0.5}>
                    +{Math.floor(Math.random() * 7)}%
                  </Box>
                  vs last quarter
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Subscriptions" icon={<Subscriptions />} />
        <Tab label="Transactions" icon={<CreditCard />} />
        <Tab label="Invoices" icon={<Receipt />} />
      </Tabs>

      {/* Search and Filters */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={`Search ${activeTab === 0 ? 'subscriptions' : activeTab === 1 ? 'transactions' : 'invoices'}...`}
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
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>

      {/* Subscriptions Tab */}
      {activeTab === 0 && (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={subscriptions.filter(sub => 
                sub.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              columns={subscriptionColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              loading={isLoading}
            />
          </Box>
        </Paper>
      )}

      {/* Transactions Tab */}
      {activeTab === 1 && (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={transactions.filter(txn => 
                txn.id.toString().includes(searchTerm) ||
                (txn.subscriptionId && txn.subscriptionId.toString().includes(searchTerm)) ||
                txn.amount.toString().includes(searchTerm)
              )}
              columns={transactionColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              loading={isLoading}
            />
          </Box>
        </Paper>
      )}

      {/* Invoices Tab */}
      {activeTab === 2 && (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={invoices.filter(inv => 
                inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.subscriptionId.toString().includes(searchTerm) ||
                inv.amount.toString().includes(searchTerm)
              )}
              columns={invoiceColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              loading={isLoading}
            />
          </Box>
        </Paper>
      )}

      {/* Subscription Dialog */}
      <Dialog 
        open={openSubscriptionDialog} 
        onClose={() => setOpenSubscriptionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedSubscription?.id ? 'Edit Subscription' : 'Create Subscription'}
            </Typography>
            <IconButton onClick={() => setOpenSubscriptionDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Customer Name"
                fullWidth
                value={selectedSubscription?.customer || ''}
                onChange={(e) => setSelectedSubscription({ 
                  ...selectedSubscription, 
                  customer: e.target.value 
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Customer ID"
                fullWidth
                value={selectedSubscription?.customerId || ''}
                onChange={(e) => setSelectedSubscription({ 
                  ...selectedSubscription, 
                  customerId: e.target.value 
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plan</InputLabel>
                <Select
                  value={selectedSubscription?.plan || 'Basic'}
                  onChange={(e) => {
                    const amount = 
                      e.target.value === 'Basic' ? 29 :
                      e.target.value === 'Pro' ? 99 : 299;
                    setSelectedSubscription({ 
                      ...selectedSubscription, 
                      plan: e.target.value,
                      amount: amount
                    });
                  }}
                  label="Plan"
                >
                  <MenuItem value="Basic">Basic ($29/month)</MenuItem>
                  <MenuItem value="Pro">Pro ($99/month)</MenuItem>
                  <MenuItem value="Enterprise">Enterprise ($299/month)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedSubscription?.status || 'active'}
                  onChange={(e) => setSelectedSubscription({ 
                    ...selectedSubscription, 
                    status: e.target.value 
                  })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="past_due">Past Due</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                  <MenuItem value="trialing">Trialing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Billing Cycle</InputLabel>
                <Select
                  value={selectedSubscription?.billingCycle || 'monthly'}
                  onChange={(e) => setSelectedSubscription({ 
                    ...selectedSubscription, 
                    billingCycle: e.target.value 
                  })}
                  label="Billing Cycle"
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={selectedSubscription?.paymentMethod || 'credit_card'}
                  onChange={(e) => setSelectedSubscription({ 
                    ...selectedSubscription, 
                    paymentMethod: e.target.value 
                  })}
                  label="Payment Method"
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="mobile_money">Mobile Money</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={selectedSubscription?.startDate ? 
                  selectedSubscription.startDate.split('T')[0] : 
                  new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedSubscription({ 
                  ...selectedSubscription, 
                  startDate: e.target.value 
                })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Next Billing Date"
                type="date"
                fullWidth
                value={selectedSubscription?.nextBillingDate ? 
                  selectedSubscription.nextBillingDate.split('T')[0] : 
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                onChange={(e) => setSelectedSubscription({ 
                  ...selectedSubscription, 
                  nextBillingDate: e.target.value 
                })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenSubscriptionDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSubscription}
            variant="contained"
            color="primary"
            disabled={!selectedSubscription?.customer || !selectedSubscription?.customerId}
          >
            {selectedSubscription?.id ? 'Update Subscription' : 'Create Subscription'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog 
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedTransaction ? 'Process Payment' : 'Record Manual Payment'}
            </Typography>
            <IconButton onClick={() => setOpenPaymentDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {selectedTransaction?.subscriptionId && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Payment for Subscription #{selectedTransaction.subscriptionId}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Amount"
                fullWidth
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="mobile_money">Mobile Money</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reference/Notes"
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenPaymentDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProcessPayment}
            variant="contained"
            color="primary"
            disabled={paymentAmount <= 0}
          >
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingSubscriptionPage;