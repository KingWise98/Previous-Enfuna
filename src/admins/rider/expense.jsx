import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  FormControlLabel,
  RadioGroup,
  Radio,
  LinearProgress,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  LocalGasStation,
  AttachMoney,
  Add,
  Delete,
  Visibility,
  Refresh,
  Share,
  CloudUpload,
  ArrowBack,
  Close,
  CheckCircle,
  Description,
  CreditCard,
  Smartphone,
  TrendingUp,
  TrendingDown,
  PieChart,
  Download,
  Search,
  FilterList,
  Receipt,
  Build,
  LocalParking,
  Restaurant,
  PhoneAndroid,
  Security,
  DirectionsCar,
  MoreHoriz,
  CalendarToday,
  AccountBalanceWallet,
  Assessment,
  PhotoCamera,
  Check,
  Clear
} from '@mui/icons-material';

const ExpensesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);
  const [receiptFile, setReceiptFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  
  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    category: 'Fuel',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'MTN MoMo',
    motorbike: 'Bajaj Boxer - UAJ 879G'
  });
  
  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    weeklyExpenses: 18000,
    weeklyExpensesChange: '+21',
    fuelExpenses: 75000,
    fuelExpensesChange: '+8.5% ↑',
    monthlyExpenses: 430000,
    monthlyExpensesChange: '+20.5% ↑',
    topCategory: 'Fuel',
    todayExpenses: 24000
  });
  
  // Expense breakdown
  const [expenseBreakdown, setExpenseBreakdown] = useState([
    { category: 'Fuel', percentage: 82, amount: 82000, color: '#0025DD' },
    { category: 'Repairs', percentage: 50, amount: 50000, color: '#FF9800' },
    { category: 'Meals', percentage: 32, amount: 32000, color: '#E91E63' },
    { category: 'Airtime', percentage: 12, amount: 12000, color: '#9C27B0' },
    { category: 'Parking', percentage: 2, amount: 2000, color: '#00C853' },
    { category: 'Insurance', percentage: 15, amount: 15000, color: '#3F51B5' },
    { category: 'Washing', percentage: 8, amount: 8000, color: '#00BCD4' },
    { category: 'Other', percentage: 5, amount: 5000, color: '#795548' }
  ]);
  
  // Expense history
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: '2025-12-05',
      time: '17:45 AM',
      category: 'Fuel',
      description: 'Petrol refill at shell',
      amount: 10000,
      hasReceipt: true,
      paymentMethod: 'Cash',
      receiptUrl: null
    },
    {
      id: 2,
      date: '2025-12-05',
      time: '08:30 AM',
      category: 'Repairs',
      description: 'Tyre replacement',
      amount: 20000,
      hasReceipt: true,
      paymentMethod: 'MTN MoMo',
      receiptUrl: null
    },
    {
      id: 3,
      date: '2025-12-05',
      time: '07:31 AM',
      category: 'Airtime',
      description: 'Mobile airtime',
      amount: 2000,
      hasReceipt: false,
      paymentMethod: 'MTN MoMo',
      receiptUrl: null
    },
    {
      id: 4,
      date: '2025-12-05',
      time: '12:31 AM',
      category: 'Fuel',
      description: 'Evening petrol',
      amount: 10000,
      hasReceipt: true,
      paymentMethod: 'Cash',
      receiptUrl: null
    },
    {
      id: 5,
      date: '2025-12-04',
      time: '14:20 PM',
      category: 'Parking',
      description: 'City parking fees',
      amount: 5000,
      hasReceipt: true,
      paymentMethod: 'Cash',
      receiptUrl: null
    },
    {
      id: 6,
      date: '2025-12-04',
      time: '11:15 AM',
      category: 'Meals',
      description: 'Lunch at restaurant',
      amount: 8000,
      hasReceipt: false,
      paymentMethod: 'MTN MoMo',
      receiptUrl: null
    }
  ]);

  const expenseCategories = [
    { id: 'fuel', label: 'Fuel', icon: <LocalGasStation />, color: '#0025DD' },
    { id: 'parking', label: 'Parking', icon: <LocalParking />, color: '#00C853' },
    { id: 'repairs', label: 'Repairs', icon: <Build />, color: '#FF9800' },
    { id: 'meals', label: 'Meals', icon: <Restaurant />, color: '#E91E63' },
    { id: 'airtime', label: 'Airtime', icon: <PhoneAndroid />, color: '#9C27B0' },
    { id: 'insurance', label: 'Insurance', icon: <Security />, color: '#3F51B5' },
    { id: 'washing', label: 'Washing Bay', icon: <DirectionsCar />, color: '#00BCD4' },
    { id: 'other', label: 'Other', icon: <MoreHoriz />, color: '#795548' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'mtn', label: 'MTN MoMo', icon: '📱' },
    { value: 'airtel', label: 'Airtel Money', icon: '📱' },
    { value: 'card', label: 'Card', icon: '💳' }
  ];

  const steps = ['Category & Amount', 'Details & Receipt', 'Review & Save'];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field) => (event) => {
    setExpenseForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCategorySelect = (category) => {
    setExpenseForm(prev => ({
      ...prev,
      category
    }));
  };

  const handleNextStep = () => {
    if (activeStep === 0 && (!expenseForm.category || !expenseForm.amount)) {
      showSnackbar('Please select category and enter amount', 'error');
      return;
    }
    if (activeStep === steps.length - 1) {
      handleSaveExpense();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSaveExpense = () => {
    const newExpense = {
      id: expenses.length + 1,
      date: expenseForm.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: expenseForm.category,
      description: expenseForm.description || 'No Description Provided',
      amount: parseInt(expenseForm.amount.replace(/,/g, '')) || 0,
      hasReceipt: !!receiptFile,
      paymentMethod: expenseForm.paymentMethod,
      receiptUrl: receiptFile ? URL.createObjectURL(receiptFile) : null
    };

    // Add to expenses
    setExpenses(prev => [newExpense, ...prev]);
    
    // Update dashboard stats
    const amount = parseInt(expenseForm.amount.replace(/,/g, '')) || 0;
    const today = new Date().toISOString().split('T')[0];
    const isToday = expenseForm.date === today;
    
    setDashboardStats(prev => ({
      ...prev,
      weeklyExpenses: prev.weeklyExpenses + amount,
      monthlyExpenses: prev.monthlyExpenses + amount,
      todayExpenses: isToday ? prev.todayExpenses + amount : prev.todayExpenses,
      fuelExpenses: expenseForm.category === 'Fuel' ? prev.fuelExpenses + amount : prev.fuelExpenses
    }));

    // Update breakdown
    const categoryBreakdown = expenseBreakdown.find(item => item.category === expenseForm.category);
    if (categoryBreakdown) {
      const newAmount = categoryBreakdown.amount + amount;
      const totalAmount = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0) + amount;
      
      // Recalculate all percentages
      const updatedBreakdown = expenseBreakdown.map(item => {
        if (item.category === expenseForm.category) {
          return {
            ...item,
            amount: newAmount,
            percentage: Math.round((newAmount / totalAmount) * 100)
          };
        }
        return {
          ...item,
          percentage: Math.round((item.amount / totalAmount) * 100)
        };
      });
      
      setExpenseBreakdown(updatedBreakdown);
    }

    // Reset form
    setExpenseForm({
      category: 'Fuel',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: 'MTN MoMo',
      motorbike: 'Bajaj Boxer - UAJ 879G'
    });
    setReceiptFile(null);
    setActiveStep(0);
    setShowNewExpenseDialog(false);
    showSnackbar('Expense saved successfully!');
  };

  const handleDeleteExpense = (id) => {
    const expenseToDelete = expenses.find(exp => exp.id === id);
    if (expenseToDelete) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      
      // Update stats
      setDashboardStats(prev => ({
        ...prev,
        weeklyExpenses: Math.max(0, prev.weeklyExpenses - expenseToDelete.amount),
        monthlyExpenses: Math.max(0, prev.monthlyExpenses - expenseToDelete.amount)
      }));
      
      showSnackbar('Expense deleted successfully!');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showSnackbar('File size exceeds 10MB limit', 'error');
        return;
      }
      setReceiptFile(file);
      showSnackbar('Receipt uploaded successfully!');
    }
  };

  const formatCurrency = (amount) => {
    return `USX ${amount.toLocaleString()}`;
  };

  const getCategoryIcon = (category) => {
    const cat = expenseCategories.find(c => c.label === category);
    return cat ? cat.icon : <MoreHoriz />;
  };

  const getCategoryColor = (category) => {
    const cat = expenseCategories.find(c => c.label === category);
    return cat ? cat.color : '#795548';
  };

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchQuery === '' || 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      expense.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Calculate today's total
  const today = new Date().toISOString().split('T')[0];
  const todayExpensesTotal = expenses
    .filter(exp => exp.date === today)
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Handle amount formatting
  const handleAmountChange = (value) => {
    // Remove non-numeric characters except commas
    const numericValue = value.replace(/[^\d,]/g, '');
    
    // Format with commas
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    setExpenseForm(prev => ({
      ...prev,
      amount: formattedValue
    }));
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Date', 'Time', 'Category', 'Description', 'Amount', 'Payment Method', 'Receipt'],
      ...expenses.map(exp => [
        exp.date,
        exp.time,
        exp.category,
        exp.description,
        exp.amount,
        exp.paymentMethod,
        exp.hasReceipt ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showSnackbar('Report exported successfully!');
  };

  const handleShareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Expenses Report',
        text: `Total Expenses: ${formatCurrency(dashboardStats.monthlyExpenses)}`,
        url: window.location.href
      }).then(() => {
        showSnackbar('Report shared successfully!');
      }).catch(error => {
        showSnackbar('Failed to share report', 'error');
      });
    } else {
      showSnackbar('Web Share API not supported', 'warning');
    }
  };

  const handleScanReceipt = () => {
    showSnackbar('Receipt scanning feature coming soon!', 'info');
  };

  const handleViewReceipt = (expense) => {
    if (expense.hasReceipt && expense.receiptUrl) {
      window.open(expense.receiptUrl, '_blank');
    } else if (expense.hasReceipt) {
      showSnackbar('Receipt preview coming soon!', 'info');
    } else {
      showSnackbar('No receipt available for this expense', 'warning');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      pb: 3
    }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#0025DD',
          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            EXPENSE DASHBOARD
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFEC01',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#E6D401'
              }
            }}
            startIcon={<Add />}
            onClick={() => setShowNewExpenseDialog(true)}
          >
            ADD NEW EXPENSE
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Overview" />
          <Tab label="Expenses" />
          <Tab label="Analytics" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Left Column - Stats & Quick Actions */}
            <Grid item xs={12} md={8}>
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ backgroundColor: '#0025DD', color: 'white' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccountBalanceWallet sx={{ mr: 1 }} />
                        <Typography variant="body2">Weekly Expenses</Typography>
                      </Box>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {formatCurrency(dashboardStats.weeklyExpenses)}
                      </Typography>
                      <Chip 
                        label={dashboardStats.weeklyExpensesChange}
                        size="small"
                        sx={{ backgroundColor: '#FFEC01', color: '#000', fontWeight: 'bold' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ border: `2px solid #00C853` }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocalGasStation sx={{ mr: 1, color: '#00C853' }} />
                        <Typography variant="body2">Fuel Expenses</Typography>
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="#00C853" gutterBottom>
                        {formatCurrency(dashboardStats.fuelExpenses)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ color: '#00C853', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" color="#00C853">
                          {dashboardStats.fuelExpensesChange}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Top Category
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ backgroundColor: '#FF980020' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Assessment sx={{ mr: 1, color: '#FF9800' }} />
                        <Typography variant="body2">Monthly Expenses</Typography>
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="#FF9800" gutterBottom>
                        {formatCurrency(dashboardStats.monthlyExpenses)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ color: '#FF9800', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" color="#FF9800">
                          {dashboardStats.monthlyExpensesChange}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ backgroundColor: '#E91E6320' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ mr: 1, color: '#E91E63' }} />
                        <Typography variant="body2">Today's Expenses</Typography>
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color="#E91E63" gutterBottom>
                        {formatCurrency(todayExpensesTotal)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {expenses.filter(exp => exp.date === today).length} expenses today
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Quick Actions */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: '#0025DD' }}
                        startIcon={<Add />}
                        onClick={() => setShowNewExpenseDialog(true)}
                      >
                        Add New Expense
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                        startIcon={<PhotoCamera />}
                        onClick={handleScanReceipt}
                      >
                        Scan Receipt
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ borderColor: '#0025DD', color: '#0025DD' }}
                        startIcon={<Download />}
                        onClick={handleExportReport}
                      >
                        Export Report
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Expense Breakdown Chart */}
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Expense Breakdown
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Usage Breakdown This Month
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                      {expenseBreakdown.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                backgroundColor: item.color,
                                borderRadius: '50%',
                                mr: 1
                              }} />
                              <Typography variant="body2">{item.category}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {item.percentage}%
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ({formatCurrency(item.amount)})
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={item.percentage} 
                            sx={{ 
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: item.color + '20',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: item.color,
                                borderRadius: 4
                              }
                            }}
                          />
                        </Box>
                      ))}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PieChart sx={{ fontSize: 200, opacity: 0.1, color: '#0025DD' }} />
                        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight="bold" color="#0025DD">
                            {formatCurrency(dashboardStats.monthlyExpenses)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Monthly
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Today's Expenses & Quick Stats */}
            <Grid item xs={12} md={4}>
              {/* Today's Expenses */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Today's Expenses
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    {expenses
                      .filter(exp => exp.date === today)
                      .slice(0, 5)
                      .map((expense, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: '#f9f9f9',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              mr: 2,
                              bgcolor: getCategoryColor(expense.category) + '20',
                              color: getCategoryColor(expense.category),
                              width: 40,
                              height: 40
                            }}
                          >
                            {getCategoryIcon(expense.category)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight="500">
                              {expense.category}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {expense.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {expense.time}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body1" fontWeight="bold" color="#0025DD">
                              USX {expense.amount.toLocaleString()}
                            </Typography>
                            <Chip 
                              size="small" 
                              icon={expense.hasReceipt ? <Check /> : <Clear />}
                              label={expense.hasReceipt ? 'Receipt' : 'No Receipt'}
                              sx={{ 
                                mt: 0.5,
                                fontSize: '0.6rem',
                                height: 20,
                                backgroundColor: expense.hasReceipt ? '#0025DD20' : '#ffebee',
                                color: expense.hasReceipt ? '#0025DD' : '#d32f2f'
                              }}
                            />
                          </Box>
                        </Box>
                    ))}
                  </Box>

                  {expenses.filter(exp => exp.date === today).length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Receipt sx={{ fontSize: 48, color: '#e0e0e0', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No expenses today
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Total Today</Typography>
                    <Typography variant="h5" fontWeight="bold" color="#0025DD">
                      USX {todayExpensesTotal.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Stats
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="#0025DD">
                          {expenses.length}
                        </Typography>
                        <Typography variant="caption">
                          Total Expenses
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="#00C853">
                          {expenses.filter(exp => exp.hasReceipt).length}
                        </Typography>
                        <Typography variant="caption">
                          With Receipts
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="#FF9800">
                          {new Set(expenses.map(exp => exp.date)).size}
                        </Typography>
                        <Typography variant="caption">
                          Days Active
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="#9C27B0">
                          {expenseCategories.length}
                        </Typography>
                        <Typography variant="caption">
                          Categories
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Expense Activity
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {expenseCategories.map(cat => (
                        <MenuItem key={cat.id} value={cat.label}>{cat.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Tooltip title="Refresh">
                    <IconButton onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export">
                    <IconButton onClick={handleExportReport}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton onClick={handleShareReport}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Receipt</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Receipt sx={{ fontSize: 48, color: '#e0e0e0', mb: 1 }} />
                          <Typography variant="body1" color="text.secondary">
                            No expenses found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((expense) => (
                        <TableRow key={expense.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">{expense.date}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {expense.time}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={getCategoryIcon(expense.category)}
                              label={expense.category}
                              size="small"
                              sx={{ 
                                backgroundColor: getCategoryColor(expense.category) + '20',
                                color: getCategoryColor(expense.category)
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title={expense.description}>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                {expense.description}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold" color="#0025DD">
                              {formatCurrency(expense.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={expense.paymentMethod}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderColor: '#0025DD',
                                color: '#0025DD'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant={expense.hasReceipt ? "contained" : "outlined"}
                              startIcon={expense.hasReceipt ? <Receipt /> : <Clear />}
                              sx={{
                                backgroundColor: expense.hasReceipt ? '#0025DD' : 'transparent',
                                color: expense.hasReceipt ? 'white' : '#d32f2f',
                                borderColor: expense.hasReceipt ? '#0025DD' : '#d32f2f'
                              }}
                              onClick={() => handleViewReceipt(expense)}
                            >
                              {expense.hasReceipt ? 'View' : 'None'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleViewReceipt(expense)}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Expense Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Detailed analysis of your spending patterns
                  </Typography>
                  
                  {/* Add analytics charts here */}
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Assessment sx={{ fontSize: 200, opacity: 0.1, color: '#0025DD' }} />
                    <Typography variant="h6" color="text.secondary" sx={{ position: 'absolute' }}>
                      Analytics charts coming soon...
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* New Expense Dialog */}
      <Dialog 
        open={showNewExpenseDialog} 
        onClose={() => {
          setShowNewExpenseDialog(false);
          setActiveStep(0);
          setReceiptFile(null);
        }} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            overflow: 'auto'
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white', py: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            ADD NEW EXPENSE
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {steps[activeStep]}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.75rem',
                        fontWeight: activeStep === index ? 'bold' : 'normal'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step 1: Category & Amount */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                What Did You Spend On
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, mb: 2 }}>
                Expense Category
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {expenseCategories.map((category) => (
                  <Grid item xs={6} sm={4} md={3} key={category.id}>
                    <Button
                      fullWidth
                      variant={expenseForm.category === category.label ? "contained" : "outlined"}
                      sx={{
                        height: '80px',
                        flexDirection: 'column',
                        borderColor: category.color,
                        color: expenseForm.category === category.label ? 'white' : category.color,
                        backgroundColor: expenseForm.category === category.label ? category.color : 'transparent',
                        '&:hover': {
                          backgroundColor: expenseForm.category === category.label ? category.color : category.color + '10'
                        }
                      }}
                      onClick={() => handleCategorySelect(category.label)}
                    >
                      <Box sx={{ mb: 1 }}>{category.icon}</Box>
                      <Typography variant="caption">{category.label}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Enter Amount
              </Typography>
              
              <TextField
                fullWidth
                value={expenseForm.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="10,000"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="h6" color="#0025DD">USX</Typography>
                    </InputAdornment>
                  ),
                  sx: { 
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }
                }}
              />

              <Typography variant="subtitle1" gutterBottom>
                Date
              </Typography>
              
              <TextField
                fullWidth
                type="date"
                value={expenseForm.date}
                onChange={handleInputChange('date')}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: '#0025DD' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}

          {/* Step 2: Details & Receipt */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Details & Report
              </Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, mb: 2 }}>
                Attach Receipt
              </Typography>

              <Paper
                sx={{
                  p: 4,
                  border: '2px dashed #0025DD',
                  textAlign: 'center',
                  backgroundColor: '#0025DD05',
                  mb: 3,
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('receipt-upload').click()}
              >
                <CloudUpload sx={{ fontSize: 48, color: '#0025DD', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drag and Drop or Click to Upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Max File Size 10MB
                </Typography>
                {receiptFile && (
                  <Chip 
                    label={receiptFile.name}
                    onDelete={() => setReceiptFile(null)}
                    sx={{ mt: 2 }}
                  />
                )}
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </Paper>

              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                Add Details (Optional)
              </Typography>

              <TextField
                fullWidth
                label="Description"
                value={expenseForm.description}
                onChange={handleInputChange('description')}
                multiline
                rows={3}
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                Motorbike Details
              </Typography>

              <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" fontWeight="bold">
                  {expenseForm.motorbike}
                </Typography>
              </Paper>

              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                Payment Method
              </Typography>

              <RadioGroup
                value={expenseForm.paymentMethod}
                onChange={handleInputChange('paymentMethod')}
                sx={{ mb: 3 }}
              >
                {paymentMethods.map((method) => (
                  <FormControlLabel 
                    key={method.value}
                    value={method.label}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5">{method.icon}</Typography>
                        <Typography>{method.label}</Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </Box>
          )}

          {/* Step 3: Review & Save */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Expense
              </Typography>

              <Paper sx={{ p: 3, mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          mr: 2,
                          bgcolor: getCategoryColor(expenseForm.category) + '20',
                          color: getCategoryColor(expenseForm.category),
                          width: 40,
                          height: 40
                        }}
                      >
                        {getCategoryIcon(expenseForm.category)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Category
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {expenseForm.category}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="#0025DD" sx={{ mt: 0.5 }}>
                      USX {expenseForm.amount}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {expenseForm.description || 'No Description Provided'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {expenseForm.date}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Time
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      10:30 AM
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {expenseForm.paymentMethod === 'Cash' && '💵'}
                      {expenseForm.paymentMethod === 'MTN MoMo' && '📱'}
                      {expenseForm.paymentMethod === 'Airtel Money' && '📱'}
                      {expenseForm.paymentMethod === 'Card' && '💳'}
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {expenseForm.paymentMethod}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {receiptFile && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Receipt
                      </Typography>
                      <Chip 
                        label={receiptFile.name}
                        icon={<Receipt />}
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button 
              onClick={activeStep > 0 ? handleBackStep : () => {
                setShowNewExpenseDialog(false);
                setActiveStep(0);
              }}
              sx={{ color: '#0025DD' }}
              startIcon={activeStep > 0 ? <ArrowBack /> : <Close />}
            >
              {activeStep > 0 ? 'Back' : 'Cancel'}
            </Button>
            
            <Button 
              variant="contained"
              sx={{
                backgroundColor: '#0025DD',
                '&:hover': {
                  backgroundColor: '#001FB8'
                }
              }}
              onClick={handleNextStep}
            >
              {activeStep === steps.length - 1 ? 'Save Expense' : 'Continue'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            backgroundColor: snackbar.severity === 'success' ? '#0025DD' : undefined,
            color: 'white'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExpensesPage;