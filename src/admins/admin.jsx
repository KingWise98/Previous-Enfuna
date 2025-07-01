import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Divider, Tabs, Tab, 
  Card, CardContent, CardHeader, Avatar, List, ListItem, 
  ListItemText, ListItemAvatar, IconButton, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TextField, InputAdornment, MenuItem, Select, 
  FormControl, InputLabel, LinearProgress, Badge, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Stepper, Step, StepLabel
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  AccountTree as AccountTreeIcon,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  PointOfSale as PointOfSaleIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  SyncAlt as SyncAltIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const FundersPickSuperAdminDashboard = () => {
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [viewMode, setViewMode] = useState('overview');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [alertCount, setAlertCount] = useState(12);
  const [systemHealth, setSystemHealth] = useState(92);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  
  // Form states
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    cost: "",
    category: "",
    duration: "",
    rating: 0,
    available: true,
    requiresAppointment: true,
    tags: [],
    image: null,
    imagePreview: ""
  });
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    cost: "",
    category: "",
    inventory: "",
    rating: 0,
    available: true,
    tags: [],
    image: null,
    imagePreview: ""
  });
  
  const [newTag, setNewTag] = useState("");
  
  // Sample data
  const [financialData, setFinancialData] = useState({
    revenue: 1250000,
    expenses: 875000,
    profit: 375000,
    cashFlow: 420000,
    accountsReceivable: 185000,
    accountsPayable: 92000
  });
  
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@funderspick.com', role: 'Admin', lastLogin: '2023-05-15 09:45', status: 'active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@clientco.com', role: 'Client Admin', lastLogin: '2023-05-15 11:20', status: 'active' },
    { id: 3, name: 'Mike Brown', email: 'mike@vendorcorp.com', role: 'Vendor', lastLogin: '2023-05-14 14:30', status: 'active' },
    { id: 4, name: 'Lisa Wong', email: 'lisa@partner.net', role: 'Partner', lastLogin: '2023-05-13 16:15', status: 'inactive' },
    { id: 5, name: 'David Wilson', email: 'david@clientbiz.com', role: 'Client User', lastLogin: '2023-05-15 08:10', status: 'active' }
  ]);
  
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2023-05-15', amount: 1250.50, type: 'payment', status: 'completed', client: 'Client A', method: 'Credit Card' },
    { id: 2, date: '2023-05-15', amount: 875.25, type: 'refund', status: 'pending', client: 'Client B', method: 'Bank Transfer' },
    { id: 3, date: '2023-05-14', amount: 3200.00, type: 'payment', status: 'completed', client: 'Client C', method: 'Credit Card' },
    { id: 4, date: '2023-05-14', amount: 450.75, type: 'payment', status: 'failed', client: 'Client D', method: 'PayPal' },
    { id: 5, date: '2023-05-13', amount: 2100.00, type: 'payment', status: 'completed', client: 'Client E', method: 'Bank Transfer' }
  ]);
  
  const [inventory, setInventory] = useState([
    { id: 1, item: 'Product A', sku: 'PROD001', stock: 125, lowStock: 20, status: 'in stock' },
    { id: 2, item: 'Product B', sku: 'PROD002', stock: 42, lowStock: 30, status: 'low stock' },
    { id: 3, item: 'Product C', sku: 'PROD003', stock: 0, lowStock: 15, status: 'out of stock' },
    { id: 4, item: 'Product D', sku: 'PROD004', stock: 87, lowStock: 25, status: 'in stock' },
    { id: 5, item: 'Product E', sku: 'PROD005', stock: 210, lowStock: 50, status: 'in stock' }
  ]);

  // Handler functions
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpenDialog = (entity) => {
    setSelectedEntity(entity);
    setIsEditing(false);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEntity(null);
    setIsEditing(false);
    setEditingItemId(null);
  };
  
  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  const handleRefreshData = () => {
    console.log('Refreshing data...');
  };
  
  const handleDismissAlert = (id) => {
    setNotifications(notifications.filter(alert => alert.id !== id));
    setAlertCount(alertCount - 1);
  };
  
  const handleResetSystemHealth = () => {
    setSystemHealth(100);
  };
  
  const handleEditItem = (item, type) => {
    if (type === 'service') {
      setNewService({
        name: item.name,
        description: item.description,
        cost: item.cost,
        category: item.category,
        duration: item.duration,
        rating: item.rating,
        available: item.available,
        requiresAppointment: item.requiresAppointment,
        tags: item.tags || [],
        image: null,
        imagePreview: item.image || ""
      });
    } else if (type === 'product') {
      setNewProduct({
        name: item.name,
        description: item.description,
        cost: item.cost,
        category: item.category,
        inventory: item.inventory,
        rating: item.rating,
        available: item.available,
        tags: item.tags || [],
        image: null,
        imagePreview: item.image || ""
      });
    }
    setEditingItemId(item.id);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleAddTag = (type) => {
    if (newTag) {
      if (type === 'service') {
        setNewService(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      } else {
        setNewProduct(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag, type) => {
    if (type === 'service') {
      setNewService(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    }
  };

  // Dashboard sections/components
  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* System Health */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography color="textSecondary" gutterBottom>
                System Health
              </Typography>
              <IconButton size="small" onClick={handleResetSystemHealth}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <Box width="100%" mr={1}>
                <LinearProgress 
                  variant="determinate" 
                  value={systemHealth} 
                  color={systemHealth > 90 ? 'success' : systemHealth > 70 ? 'warning' : 'error'}
                />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${systemHealth}%`}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Active Users */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4" component="h2">
              142
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <ArrowUpIcon color="success" />
              <Typography variant="body2" color="textSecondary" ml={0.5}>
                12% from last month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Transactions Today */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Transactions Today
            </Typography>
            <Typography variant="h4" component="h2">
              87
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <ArrowUpIcon color="success" />
              <Typography variant="body2" color="textSecondary" ml={0.5}>
                8% from yesterday
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Alerts */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography color="textSecondary" gutterBottom>
                Alerts
              </Typography>
              <Badge badgeContent={alertCount} color="error" />
            </Box>
            <Typography variant="h4" component="h2">
              {alertCount}
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <WarningIcon color="warning" />
              <Typography variant="body2" color="textSecondary" ml={0.5}>
                {alertCount > 0 ? 'Needs attention' : 'All systems normal'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Financial Overview */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardHeader
            title="Financial Overview"
            action={
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  label="Date Range"
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="thisQuarter">This Quarter</MenuItem>
                  <MenuItem value="thisYear">This Year</MenuItem>
                </Select>
              </FormControl>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Revenue</Typography>
                  <Typography variant="h4" color="success.main">
                    ${(financialData.revenue / 1000).toFixed(1)}k
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                    <ArrowUpIcon color="success" fontSize="small" />
                    <Typography variant="body2" color="textSecondary" ml={0.5}>
                      5.2% increase
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Expenses</Typography>
                  <Typography variant="h4" color="error.main">
                    ${(financialData.expenses / 1000).toFixed(1)}k
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                    <ArrowDownIcon color="error" fontSize="small" />
                    <Typography variant="body2" color="textSecondary" ml={0.5}>
                      2.1% decrease
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Profit</Typography>
                  <Typography variant="h4" color="success.main">
                    ${(financialData.profit / 1000).toFixed(1)}k
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                    <ArrowUpIcon color="success" fontSize="small" />
                    <Typography variant="body2" color="textSecondary" ml={0.5}>
                      8.7% increase
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Cash Flow</Typography>
                  <Typography variant="h4" color={financialData.cashFlow > 0 ? "success.main" : "error.main"}>
                    ${(financialData.cashFlow / 1000).toFixed(1)}k
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                    {financialData.cashFlow > 0 ? (
                      <ArrowUpIcon color="success" fontSize="small" />
                    ) : (
                      <ArrowDownIcon color="error" fontSize="small" />
                    )}
                    <Typography variant="body2" color="textSecondary" ml={0.5}>
                      {financialData.cashFlow > 0 ? 'Positive' : 'Negative'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Recent Transactions */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardHeader
            title="Recent Transactions"
            action={
              <IconButton onClick={handleRefreshData}>
                <RefreshIcon />
              </IconButton>
            }
          />
          <CardContent>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {transactions.slice(0, 5).map((transaction) => (
                <ListItem key={transaction.id} secondaryAction={
                  <Chip 
                    label={transaction.status} 
                    size="small" 
                    color={
                      transaction.status === 'completed' ? 'success' : 
                      transaction.status === 'pending' ? 'warning' : 'error'
                    }
                  />
                }>
                  <ListItemAvatar>
                    <Avatar sx={{
                      bgcolor: transaction.type === 'payment' ? 'success.light' : 'error.light'
                    }}>
                      {transaction.type === 'payment' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${transaction.client} - $${transaction.amount}`}
                    secondary={transaction.date}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Inventory Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Inventory Status"
            subheader="Current stock levels"
          />
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell align="right">{item.stock}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={item.status} 
                          size="small" 
                          color={
                            item.status === 'in stock' ? 'success' : 
                            item.status === 'low stock' ? 'warning' : 'error'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      
      {/* User Activity */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Recent User Activity"
            action={
              <IconButton>
                <MoreIcon />
              </IconButton>
            }
          />
          <CardContent>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {users.slice(0, 5).map((user) => (
                <ListItem key={user.id}>
                  <ListItemAvatar>
                    <Avatar>
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={`Last login: ${user.lastLogin}`}
                  />
                  <Chip 
                    label={user.status} 
                    size="small" 
                    color={user.status === 'active' ? 'success' : 'default'}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  const renderFinancialManagement = () => (
    <Grid container spacing={3}>
      {/* General Ledger */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="General Ledger"
            action={
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('generalLedger')}
              >
                New Entry
              </Button>
            }
          />
          <CardContent>
            <DataGrid
              rows={[]}
              columns={[
                { field: 'date', headerName: 'Date', width: 120 },
                { field: 'account', headerName: 'Account', width: 200 },
                { field: 'description', headerName: 'Description', width: 250 },
                { field: 'debit', headerName: 'Debit', width: 120, type: 'number' },
                { field: 'credit', headerName: 'Credit', width: 120, type: 'number' },
                { field: 'balance', headerName: 'Balance', width: 120, type: 'number' }
              ]}
              components={{ Toolbar: GridToolbar }}
              autoHeight
            />
          </CardContent>
        </Card>
      </Grid>
      
      {/* Accounts Payable/Receivable */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Accounts Payable"
            subheader="Outstanding vendor invoices"
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText
                  primary="Vendor A"
                  secondary="$12,450.00 due in 15 days"
                />
                <Button size="small">Pay</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Vendor B"
                  secondary="$8,750.25 due in 30 days"
                />
                <Button size="small">Pay</Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Accounts Receivable"
            subheader="Outstanding customer invoices"
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText
                  primary="Client X"
                  secondary="$15,200.00 overdue by 5 days"
                />
                <Button size="small" color="error">Remind</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Client Y"
                  secondary="$9,875.50 due in 7 days"
                />
                <Button size="small">Notify</Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Financial Reports */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Financial Reports"
            action={
              <Box display="flex" gap={1}>
                <Button variant="outlined">Balance Sheet</Button>
                <Button variant="outlined">Income Statement</Button>
                <Button variant="outlined">Cash Flow</Button>
              </Box>
            }
          />
          <CardContent>
            <Box height={400} display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h6" color="textSecondary">
                Select a report to view
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  const renderInventoryManagement = () => (
    <Grid container spacing={3}>
      {/* Inventory Summary */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Items
            </Typography>
            <Typography variant="h4">1,245</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              In Stock
            </Typography>
            <Typography variant="h4">1,087</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Low Stock
            </Typography>
            <Typography variant="h4">42</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Out of Stock
            </Typography>
            <Typography variant="h4">16</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Inventory List */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Inventory Items"
            action={
              <Box display="flex" gap={1}>
                <TextField
                  size="small"
                  placeholder="Search inventory..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('inventoryItem')}
                >
                  Add Item
                </Button>
              </Box>
            }
          />
          <CardContent>
            <DataGrid
              rows={inventory}
              columns={[
                { field: 'item', headerName: 'Item', width: 200 },
                { field: 'sku', headerName: 'SKU', width: 150 },
                { field: 'stock', headerName: 'Stock', width: 100, type: 'number' },
                { field: 'lowStock', headerName: 'Low Stock Level', width: 150, type: 'number' },
                { 
                  field: 'status', 
                  headerName: 'Status', 
                  width: 150,
                  renderCell: (params) => (
                    <Chip 
                      label={params.value} 
                      size="small" 
                      color={
                        params.value === 'in stock' ? 'success' : 
                        params.value === 'low stock' ? 'warning' : 'error'
                      }
                    />
                  )
                },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 150,
                  renderCell: (params) => (
                    <Button 
                      size="small" 
                      onClick={() => handleEditItem(params.row, 'product')}
                    >
                      Edit
                    </Button>
                  )
                }
              ]}
              components={{ Toolbar: GridToolbar }}
              autoHeight
            />
          </CardContent>
        </Card>
      </Grid>
      
      {/* Reorder Alerts */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Reorder Alerts"
            subheader="Items that need restocking"
            action={
              <Button 
                variant="outlined" 
                startIcon={<LocalShippingIcon />}
                onClick={() => handleOpenDialog('reorder')}
              >
                Create Purchase Order
              </Button>
            }
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>Reorder Level</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Lead Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.filter(item => item.status !== 'in stock').map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.lowStock}</TableCell>
                      <TableCell>Supplier {String.fromCharCode(64 + item.id)}</TableCell>
                      <TableCell>{item.id % 2 === 0 ? '3 days' : '7 days'}</TableCell>
                      <TableCell>
                        <Button size="small">Reorder</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  const renderPaymentProcessing = () => (
    <Grid container spacing={3}>
      {/* Payment Processing Summary */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Processed Today
            </Typography>
            <Typography variant="h4">87</Typography>
            <Typography variant="body2" color="textSecondary">
              $12,450.00
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Successful
            </Typography>
            <Typography variant="h4">83</Typography>
            <Typography variant="body2" color="textSecondary">
              95.4% success rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Failed
            </Typography>
            <Typography variant="h4">4</Typography>
            <Typography variant="body2" color="textSecondary">
              $450.75
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Refunded
            </Typography>
            <Typography variant="h4">2</Typography>
            <Typography variant="body2" color="textSecondary">
              $875.25
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Payment Methods Breakdown */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Payment Methods"
            subheader="Breakdown by payment type"
          />
          <CardContent>
            <Box height={300} display="flex" justifyContent="center" alignItems="center">
              <PieChartIcon sx={{ fontSize: 100, color: 'text.disabled' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Payment Trends */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Payment Trends"
            subheader="Last 30 days"
          />
          <CardContent>
            <Box height={300} display="flex" justifyContent="center" alignItems="center">
              <ShowChartIcon sx={{ fontSize: 100, color: 'text.disabled' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Recent Transactions */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Recent Transactions"
            action={
              <Box display="flex" gap={1}>
                <FormControl size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value="all" label="Status">
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
                <Button 
                  variant="contained" 
                  startIcon={<SyncAltIcon />}
                  onClick={handleRefreshData}
                >
                  Refresh
                </Button>
              </Box>
            }
          />
          <CardContent>
            <DataGrid
              rows={transactions}
              columns={[
                { field: 'date', headerName: 'Date', width: 120 },
                { field: 'client', headerName: 'Client', width: 200 },
                { field: 'amount', headerName: 'Amount', width: 120, type: 'number' },
                { field: 'type', headerName: 'Type', width: 120 },
                { field: 'method', headerName: 'Method', width: 150 },
                { 
                  field: 'status', 
                  headerName: 'Status', 
                  width: 150,
                  renderCell: (params) => (
                    <Chip 
                      label={params.value} 
                      size="small" 
                      color={
                        params.value === 'completed' ? 'success' : 
                        params.value === 'pending' ? 'warning' : 'error'
                      }
                    />
                  )
                },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 150,
                  renderCell: () => (
                    <Button size="small">Details</Button>
                  )
                }
              ]}
              components={{ Toolbar: GridToolbar }}
              autoHeight
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  const renderHumanCapital = () => (
    <Grid container spacing={3}>
      {/* Employee Summary */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Employees
            </Typography>
            <Typography variant="h4">142</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Today
            </Typography>
            <Typography variant="h4">87</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              On Leave
            </Typography>
            <Typography variant="h4">12</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              New Hires (30d)
            </Typography>
            <Typography variant="h4">5</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Department Breakdown */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Department Breakdown"
          />
          <CardContent>
            <Box height={300} display="flex" justifyContent="center" alignItems="center">
              <BarChartIcon sx={{ fontSize: 100, color: 'text.disabled' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Attendance */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Attendance"
            subheader="Today's check-ins"
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Present"
                  secondary="87 employees"
                />
                <Chip label="62%" color="success" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Absent"
                  secondary="12 employees"
                />
                <Chip label="8%" color="error" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="On Leave"
                  secondary="8 employees"
                />
                
                <Chip label="6%" color="warning" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Employee List */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Employee Directory"
            action={
              <Box display="flex" gap={1}>
                <TextField
                  size="small"
                  placeholder="Search employees..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('employee')}
                >
                  Add Employee
                </Button>
              </Box>
            }
          />
          <CardContent>
            <DataGrid
              rows={users}
              columns={[
                { field: 'name', headerName: 'Name', width: 200 },
                { field: 'email', headerName: 'Email', width: 250 },
                { field: 'role', headerName: 'Role', width: 150 },
                { field: 'lastLogin', headerName: 'Last Login', width: 180 },
                { 
                  field: 'status', 
                  headerName: 'Status', 
                  width: 150,
                  renderCell: (params) => (
                    <Chip 
                      label={params.value} 
                      size="small" 
                      color={params.value === 'active' ? 'success' : 'default'}
                    />
                  )
                },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 150,
                  renderCell: (params) => (
                    <Button 
                      size="small" 
                      onClick={() => handleEditItem(params.row, 'employee')}
                    >
                      Manage
                    </Button>
                  )
                }
              ]}
              components={{ Toolbar: GridToolbar }}
              autoHeight
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  const renderSystemSettings = () => (
    <Grid container spacing={3}>
      {/* System Configuration */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="System Configuration"
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText
                  primary="System Version"
                  secondary="FundersPick ERP v2.4.1"
                />
                <Button size="small">Check for Updates</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Database Status"
                  secondary="Connected (MySQL 8.0)"
                />
                <Button size="small">Test Connection</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Backup Schedule"
                  secondary="Daily at 2:00 AM"
                />
                <Button size="small">Run Backup Now</Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Security Settings */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Security Settings"
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <SecurityIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Authentication"
                  secondary="Two-factor authentication enabled"
                />
                <Button size="small">Configure</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <CreditCardIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Payment Security"
                  secondary="PCI-DSS compliant"
                />
                <Button size="small">Details</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="User Permissions"
                  secondary="Role-based access control"
                />
                <Button size="small">Manage</Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Integration Status */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Integration Status"
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Sync</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Payment Gateway</TableCell>
                    <TableCell>
                      <Chip label="Connected" color="success" />
                    </TableCell>
                    <TableCell>2 minutes ago</TableCell>
                    <TableCell>Stripe API v3</TableCell>
                    <TableCell>
                      <Button size="small">Reconnect</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email Service</TableCell>
                    <TableCell>
                      <Chip label="Connected" color="success" />
                    </TableCell>
                    <TableCell>5 minutes ago</TableCell>
                    <TableCell>SendGrid API</TableCell>
                    <TableCell>
                      <Button size="small">Reconnect</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SMS Gateway</TableCell>
                    <TableCell>
                      <Chip label="Disconnected" color="error" />
                    </TableCell>
                    <TableCell>3 hours ago</TableCell>
                    <TableCell>Twilio API</TableCell>
                    <TableCell>
                      <Button size="small" color="error">Fix Connection</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  
  const renderDialogContent = () => {
    switch (selectedEntity) {
      case 'generalLedger':
        return (
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Select Account</StepLabel>
              <Box sx={{ p: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Account Type</InputLabel>
                  <Select label="Account Type">
                    <MenuItem value="asset">Asset</MenuItem>
                    <MenuItem value="liability">Liability</MenuItem>
                    <MenuItem value="equity">Equity</MenuItem>
                    <MenuItem value="revenue">Revenue</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Account</InputLabel>
                  <Select label="Account">
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="ar">Accounts Receivable</MenuItem>
                    <MenuItem value="ap">Accounts Payable</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Step>
            <Step>
              <StepLabel>Enter Details</StepLabel>
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  label="Description"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Debit Amount"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Credit Amount"
                      type="number"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Step>
            <Step>
              <StepLabel>Review and Submit</StepLabel>
              <Box sx={{ p: 2 }}>
                <Typography>Review your journal entry before submitting:</Typography>
                <Paper sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="subtitle2">Account: Cash</Typography>
                  <Typography variant="subtitle2">Description: Customer payment received</Typography>
                  <Typography variant="subtitle2">Debit: $1,250.00</Typography>
                  <Typography variant="subtitle2">Credit: $0.00</Typography>
                </Paper>
              </Box>
            </Step>
          </Stepper>
        );
      case 'inventoryItem':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name"
                margin="normal"
              />
              <TextField
                fullWidth
                label="SKU"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Stock"
                type="number"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Reorder Level"
                type="number"
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Supplier</InputLabel>
                <Select label="Supplier">
                  <MenuItem value="supplier1">Supplier A</MenuItem>
                  <MenuItem value="supplier2">Supplier B</MenuItem>
                  <MenuItem value="supplier3">Supplier C</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Item Image</Typography>
                <Button variant="outlined" sx={{ mt: 1 }}>Upload Image</Button>
              </Box>
            </Grid>
          </Grid>
        );
      case 'employee':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone"
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Department</InputLabel>
                <Select label="Department">
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                  <MenuItem value="hr">Human Resources</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select label="Role">
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="contractor">Contractor</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Profile Photo</Typography>
                <Button variant="outlined" sx={{ mt: 1 }}>Upload Photo</Button>
              </Box>
            </Grid>
          </Grid>
        );
      default:
        return <Typography>Select an entity to manage</Typography>;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box display="flex" alignItems="center">
          <BusinessIcon sx={{ fontSize: 40, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            FundersPick <Typography variant="caption">Super Admin</Typography>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton size="large">
            <Badge badgeContent={alertCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button variant="contained" startIcon={<SettingsIcon />}>
            Settings
          </Button>
          <Avatar>SA</Avatar>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Paper sx={{ 
          width: 240, 
          p: 2, 
          height: 'calc(100vh - 73px)', 
          position: 'sticky', 
          top: 73,
          borderRight: '1px solid',
          borderColor: 'divider'
        }}>
          <List>
            <ListItem button selected={tabValue === 0} onClick={(e) => handleTabChange(e, 0)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: tabValue === 0 ? 'primary.main' : 'grey.300' }}>
                  <DashboardIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Overview" />
            </ListItem>
            <ListItem button selected={tabValue === 1} onClick={(e) => handleTabChange(e, 1)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: tabValue === 1 ? 'primary.main' : 'grey.300' }}>
                  <AccountBalanceIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Financial Management" />
            </ListItem>
            <ListItem button selected={tabValue === 2} onClick={(e) => handleTabChange(e, 2)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: tabValue === 2 ? 'primary.main' : 'grey.300' }}>
                  <InventoryIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Inventory Management" />
            </ListItem>
            <ListItem button selected={tabValue === 3} onClick={(e) => handleTabChange(e, 3)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: tabValue === 3 ? 'primary.main' : 'grey.300' }}>
                  <CreditCardIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Payment Processing" />
            </ListItem>
            <ListItem button selected={tabValue === 4} onClick={(e) => handleTabChange(e, 4)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: tabValue === 4 ? 'primary.main' : 'grey.300' }}>
                  <PeopleIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Human Capital" />
            </ListItem>
            <ListItem button selected={tabValue === 5} onClick={(e) => handleTabChange(e, 5)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: tabValue === 5 ? 'primary.main' : 'grey.300' }}>
                  <SettingsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="System Settings" />
            </ListItem>
          </List>
        </Paper>
        
        {/* Content Area */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* View Mode Toggle */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant={viewMode === 'overview' ? 'contained' : 'outlined'} 
              onClick={() => handleViewModeChange('overview')}
              sx={{ mr: 1 }}
            >
              Overview
            </Button>
            <Button 
              variant={viewMode === 'detailed' ? 'contained' : 'outlined'} 
              onClick={() => handleViewModeChange('detailed')}
            >
              Detailed View
            </Button>
          </Box>
          
          {/* Tab Content */}
          {tabValue === 0 && renderOverview()}
          {tabValue === 1 && renderFinancialManagement()}
          {tabValue === 2 && renderInventoryManagement()}
          {tabValue === 3 && renderPaymentProcessing()}
          {tabValue === 4 && renderHumanCapital()}
          {tabValue === 5 && renderSystemSettings()}
        </Box>
      </Box>
      
      {/* Dialog for entity management */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedEntity === 'generalLedger' && 'New Journal Entry'}
          {selectedEntity === 'inventoryItem' && (isEditing ? 'Edit Inventory Item' : 'Add Inventory Item')}
          {selectedEntity === 'employee' && (isEditing ? 'Edit Employee' : 'Add Employee')}
        </DialogTitle>
        <DialogContent dividers>
          {renderDialogContent()}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && selectedEntity === 'generalLedger' && (
            <Button onClick={handleBackStep}>Back</Button>
          )}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {selectedEntity === 'generalLedger' ? (
            activeStep < 2 ? (
              <Button variant="contained" onClick={handleNextStep}>Next</Button>
            ) : (
              <Button variant="contained" onClick={handleCloseDialog}>Submit</Button>
            )
          ) : (
            <Button variant="contained" onClick={handleCloseDialog}>
              {isEditing ? 'Save Changes' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FundersPickSuperAdminDashboard;