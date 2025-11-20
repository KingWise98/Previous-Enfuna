import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Badge
} from '@mui/material';
import {
  Add,
  Close,
  CheckCircle,
  CameraAlt,
  Receipt,
  LocalGasStation,
  LocalParking,
  Build,
  Restaurant,
  WifiCalling3,
  MoreHoriz,
  Delete,
  Edit,
  Download,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  Category,
  AttachMoney,
  Description,
  PhotoCamera,
  QrCodeScanner,
  Search,
  FilterList,
  Refresh,
  WhatsApp,
  Email,
  Print
} from '@mui/icons-material';

const ExpensesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTab, setExpenseTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    type: 'fuel',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    hasReceipt: false,
    receiptImage: null,
    vehicle: 'default',
    paymentMethod: 'cash'
  });

  // Mock expenses data
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      type: 'fuel',
      amount: 45000,
      description: 'Petrol refill at Shell',
      date: '2024-01-15',
      time: '08:30',
      hasReceipt: true,
      vehicle: 'Toyota Premio - UBB 123A',
      status: 'verified'
    },
    {
      id: 2,
      type: 'parking',
      amount: 5000,
      description: 'City parking fees',
      date: '2024-01-15',
      time: '10:15',
      hasReceipt: false,
      vehicle: 'Toyota Premio - UBB 123A',
      status: 'pending'
    },
    {
      id: 3,
      type: 'meals',
      amount: 8000,
      description: 'Lunch and drinks',
      date: '2024-01-15',
      time: '13:00',
      hasReceipt: false,
      vehicle: 'Toyota Premio - UBB 123A',
      status: 'verified'
    },
    {
      id: 4,
      type: 'airtime',
      amount: 3000,
      description: 'Mobile data bundle',
      date: '2024-01-14',
      time: '16:45',
      hasReceipt: true,
      vehicle: 'Toyota Premio - UBB 123A',
      status: 'verified'
    },
    {
      id: 5,
      type: 'repairs',
      amount: 25000,
      description: 'Tire replacement',
      date: '2024-01-14',
      time: '11:20',
      hasReceipt: true,
      vehicle: 'Toyota Premio - UBB 123A',
      status: 'verified'
    }
  ]);

  const expenseTypes = [
    { value: 'fuel', label: 'Fuel', icon: <LocalGasStation />, color: 'warning', emoji: '⛽' },
    { value: 'parking', label: 'Parking', icon: <LocalParking />, color: 'info', emoji: '🅿️' },
    { value: 'repairs', label: 'Repairs', icon: <Build />, color: 'error', emoji: '🔧' },
    { value: 'meals', label: 'Meals', icon: <Restaurant />, color: 'success', emoji: '🍔' },
    { value: 'airtime', label: 'Airtime', icon: <WifiCalling3 />, color: 'primary', emoji: '📞' },
    { value: 'insurance', label: 'Insurance', icon: <Receipt />, color: 'secondary', emoji: '📄' },
    { value: 'cleaning', label: 'Cleaning', icon: <MoreHoriz />, color: 'default', emoji: '🧹' },
    { value: 'other', label: 'Other', icon: <MoreHoriz />, color: 'default', emoji: '📦' }
  ];

  const vehicles = [
    { value: 'default', label: 'Toyota Premio - UBB 123A' },
    { value: 'backup', label: 'Honda Fit - UBA 456B' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'mobile', label: 'Mobile Money' },
    { value: 'card', label: 'Card' },
    { value: 'bank', label: 'Bank Transfer' }
  ];

  const steps = ['Category & Amount', 'Details & Receipt', 'Review & Save'];

  // Stats calculations
  const todayExpenses = expenses.filter(exp => exp.date === new Date().toISOString().split('T')[0]);
  const weeklyExpenses = expenses.filter(exp => {
    const expenseDate = new Date(exp.date);
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    return expenseDate >= weekAgo;
  });

  const totalToday = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalWeekly = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalMonthly = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = expenseTypes.map(type => ({
    ...type,
    total: expenses.filter(exp => exp.type === type.value).reduce((sum, exp) => sum + exp.amount, 0)
  })).filter(cat => cat.total > 0);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSaveExpense = () => {
    const newExpense = {
      id: expenses.length + 1,
      ...expenseForm,
      amount: parseInt(expenseForm.amount),
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    setShowAddExpense(false);
    setActiveStep(0);
    setExpenseForm({
      type: 'fuel',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      hasReceipt: false,
      receiptImage: null,
      vehicle: 'default',
      paymentMethod: 'cash'
    });
  };

  const handleInputChange = (field) => (event) => {
    setExpenseForm(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleReceiptCapture = () => {
    // Simulate receipt capture
    setExpenseForm(prev => ({
      ...prev,
      hasReceipt: true,
      receiptImage: 'captured_receipt.jpg'
    }));
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expenseTypes.find(t => t.value === expense.type)?.label.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || expense.type === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Quick Add Expense Component
  const QuickAddExpense = () => (
    <Dialog 
      open={showAddExpense} 
      onClose={() => {
        setShowAddExpense(false);
        setActiveStep(0);
      }}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            💰 Add New Expense
          </Typography>
          <IconButton onClick={() => {
            setShowAddExpense(false);
            setActiveStep(0);
          }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Category & Amount */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              What did you spend on?
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormLabel component="legend" sx={{ mb: 2, display: 'block' }}>
                  Expense Category
                </FormLabel>
                <Grid container spacing={1}>
                  {expenseTypes.map((type) => (
                    <Grid item xs={6} sm={4} md={3} key={type.value}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: expenseForm.type === type.value ? `2px solid ${theme.palette[type.color].main}` : '1px solid',
                          borderColor: expenseForm.type === type.value ? `${type.color}.main` : 'divider',
                          backgroundColor: expenseForm.type === type.value ? `${type.color}.50` : 'background.paper',
                          '&:hover': {
                            backgroundColor: `${type.color}.50`
                          }
                        }}
                        onClick={() => setExpenseForm(prev => ({ ...prev, type: type.value }))}
                      >
                        <Typography variant="h4" sx={{ mb: 1 }}>
                          {type.emoji}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {type.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount (UGX)"
                  type="number"
                  value={expenseForm.amount}
                  onChange={handleInputChange('amount')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                  }}
                  placeholder="0"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={expenseForm.date}
                  onChange={handleInputChange('date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={expenseForm.time}
                  onChange={handleInputChange('time')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 2: Details & Receipt */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={expenseForm.description}
                  onChange={handleInputChange('description')}
                  placeholder="Brief description of this expense..."
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Vehicle</InputLabel>
                  <Select
                    value={expenseForm.vehicle}
                    onChange={handleInputChange('vehicle')}
                    label="Vehicle"
                  >
                    {vehicles.map(vehicle => (
                      <MenuItem key={vehicle.value} value={vehicle.value}>
                        {vehicle.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={expenseForm.paymentMethod}
                    onChange={handleInputChange('paymentMethod')}
                    label="Payment Method"
                  >
                    {paymentMethods.map(method => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        Receipt Capture
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={expenseForm.hasReceipt}
                            onChange={handleInputChange('hasReceipt')}
                          />
                        }
                        label="I have a receipt"
                      />
                    </Box>
                    
                    {expenseForm.hasReceipt && (
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        {expenseForm.receiptImage ? (
                          <Box>
                            <Avatar
                              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                              src="/api/placeholder/100/100"
                              variant="rounded"
                            />
                            <Typography variant="body2" color="success.main">
                              ✓ Receipt captured
                            </Typography>
                          </Box>
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<CameraAlt />}
                            onClick={handleReceiptCapture}
                            size="large"
                          >
                            Capture Receipt
                          </Button>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 3: Review & Save */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Expense
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Typography variant="h4">
                        {expenseTypes.find(t => t.value === expenseForm.type)?.emoji}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {expenseTypes.find(t => t.value === expenseForm.type)?.label}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="h5" color="error" fontWeight="bold" sx={{ mt: 1 }}>
                      UGX {parseInt(expenseForm.amount || 0).toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {expenseForm.description || 'No description provided'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {new Date(expenseForm.date).toLocaleDateString()} at {expenseForm.time}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {paymentMethods.find(m => m.value === expenseForm.paymentMethod)?.label}
                    </Typography>
                  </Grid>

                  {expenseForm.hasReceipt && (
                    <Grid item xs={12}>
                      <Chip 
                        icon={<CheckCircle />} 
                        label="Receipt Attached" 
                        color="success" 
                        variant="outlined"
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
              <Typography variant="body2" color="success.main">
                ✅ Ready to save this expense! It will be added to your daily totals.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSaveExpense}
            startIcon={<CheckCircle />}
            disabled={!expenseForm.amount}
          >
            Save Expense
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 0 && !expenseForm.amount}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      pb: 3
    }}>
      {/* Header */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Expenses 💰
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage your driving expenses
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddExpense(true)}
              size={isMobile ? "medium" : "large"}
            >
              Add Expense
            </Button>
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error" fontWeight="bold">
                    UGX {totalToday.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Expenses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning" fontWeight="bold">
                    UGX {totalWeekly.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This Week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info" fontWeight="bold">
                    UGX {totalMonthly.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Search and Filter */}
            <Card elevation={1} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <Search color="action" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        label="Category"
                      >
                        <MenuItem value="all">All Categories</MenuItem>
                        {expenseTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.emoji} {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Button startIcon={<Refresh />} variant="outlined" size="small">
                        Refresh
                      </Button>
                      <Button startIcon={<Download />} variant="outlined" size="small">
                        Export
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Expenses List */}
            <Card elevation={1}>
              <CardContent sx={{ p: 0 }}>
                {isMobile ? (
                  /* Mobile List View */
                  <List>
                    {filteredExpenses.map((expense) => (
                      <ListItem key={expense.id} divider>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: `${expenseTypes.find(t => t.value === expense.type)?.color}.50` }}>
                            {expenseTypes.find(t => t.value === expense.type)?.emoji}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {expenseTypes.find(t => t.value === expense.type)?.label}
                              </Typography>
                              <Typography variant="h6" color="error">
                                UGX {expense.amount.toLocaleString()}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {expense.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {expense.date} • {expense.time}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleDeleteExpense(expense.id)}>
                            <Delete color="error" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  /* Desktop Table View */
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell>Date & Time</TableCell>
                          <TableCell>Receipt</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredExpenses.map((expense) => (
                          <TableRow key={expense.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h5">
                                  {expenseTypes.find(t => t.value === expense.type)?.emoji}
                                </Typography>
                                <Typography variant="body2">
                                  {expenseTypes.find(t => t.value === expense.type)?.label}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {expense.description}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="bold" color="error">
                                UGX {expense.amount.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {expense.date}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {expense.time}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {expense.hasReceipt ? (
                                <Chip icon={<CheckCircle />} label="Yes" size="small" color="success" />
                              ) : (
                                <Chip label="No" size="small" variant="outlined" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small">
                                  <Edit />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDeleteExpense(expense.id)}>
                                  <Delete color="error" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {filteredExpenses.length === 0 && (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No expenses found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {expenses.length === 0 ? 'Start by adding your first expense' : 'Try adjusting your search or filters'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Expense Categories Breakdown */}
            <Card elevation={1} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Expense Breakdown
                </Typography>
                <List dense>
                  {categoryTotals.map((category) => (
                    <ListItem key={category.value} divider>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `${category.color}.50`, width: 32, height: 32 }}>
                          {category.emoji}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={category.label}
                        secondary={`UGX ${category.total.toLocaleString()}`}
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round((category.total / totalMonthly) * 100)}%
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⚡ Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CameraAlt />}
                    onClick={() => setShowAddExpense(true)}
                    fullWidth
                  >
                    Quick Add Expense
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Receipt />}
                    fullWidth
                  >
                    Scan Receipt
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    fullWidth
                  >
                    Export Report
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<WhatsApp />}
                    fullWidth
                  >
                    Share via WhatsApp
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <QuickAddExpense />
    </Box>
  );
};

export default ExpensesPage;