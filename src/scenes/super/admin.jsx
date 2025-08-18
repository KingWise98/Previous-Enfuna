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
  InputAdornment,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  LinearProgress,
  Badge,
  Switch,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  FormControlLabel
} from "@mui/material";
import {
  AddCircle,
  Cancel,
  CheckCircle,
  Search,
  Refresh,
  Money,
  Close,
  CalendarToday,
  People,
  Business,
  Assessment,
  Payment,
  Security,
  Settings,
  Notifications,
  Email,
  Chat,
  VerifiedUser,
  Warning,
  Timeline,
  PieChart,
  BarChart,
  Map,
  Lock,
  CloudUpload,
  API,
  Dashboard as DashboardIcon,
  AccountCircle,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  FilterList,
  ArrowUpward,
  ArrowDownward,
  Star,
  StarBorder,
  Check,
  Clear,
  Pending,
  HourglassEmpty
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { faker } from "@faker-js/faker";

const SuperAdminDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openFundingDialog, setOpenFundingDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [users, setUsers] = useState([]);
  const [fundings, setFundings] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    totalInvestors: 0,
    totalFunding: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    platformFee: 2.5,
    minInvestment: 500,
    maxInvestment: 100000,
    autoApprovalThreshold: 80,
    kycRequired: true,
    twoFactorAuth: true,
    maintenanceMode: false
  });

  // Generate mock data
  useEffect(() => {
    setIsLoading(true);
    
    // Generate mock users
    const mockUsers = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      type: faker.helpers.arrayElement(['startup', 'sme', 'investor']),
      status: faker.helpers.arrayElement(['verified', 'pending', 'rejected', 'suspended']),
      registrationDate: faker.date.past().toISOString().split('T')[0],
      lastActive: faker.date.recent().toISOString().split('T')[0],
      location: faker.location.city() + ', Uganda',
      fundingStage: faker.helpers.arrayElement(['pre-seed', 'seed', 'series-a', 'series-b', 'growth']),
      industry: faker.helpers.arrayElement(['Fintech', 'Agritech', 'Healthtech', 'Edtech', 'E-commerce']),
      riskScore: faker.number.int({ min: 10, max: 95 }),
      documentsVerified: faker.datatype.boolean()
    }));

    // Generate mock fundings
    const mockFundings = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      startup: mockUsers.find(u => u.type === 'startup' || u.type === 'sme').name,
      investor: mockUsers.find(u => u.type === 'investor')?.name || 'Corporate Investor',
      amount: faker.number.int({ min: 1000, max: 500000 }),
      status: faker.helpers.arrayElement(['applied', 'under-review', 'due-diligence', 'approved', 'disbursed', 'rejected', 'defaulted']),
      applicationDate: faker.date.past().toISOString().split('T')[0],
      decisionDate: faker.date.recent().toISOString().split('T')[0],
      sector: faker.helpers.arrayElement(['Fintech', 'Agritech', 'Healthtech', 'Edtech', 'E-commerce']),
      riskAssessment: faker.number.int({ min: 20, max: 95 }),
      repaymentTerms: faker.helpers.arrayElement(['6 months', '12 months', '24 months', 'Equity']),
      expectedROI: faker.number.int({ min: 5, max: 40 }) + '%'
    }));

    // Generate mock stats
    const mockStats = {
      totalUsers: mockUsers.length,
      totalStartups: mockUsers.filter(u => u.type === 'startup' || u.type === 'sme').length,
      totalInvestors: mockUsers.filter(u => u.type === 'investor').length,
      totalFunding: mockFundings.reduce((sum, f) => sum + f.amount, 0),
      pendingApplications: mockFundings.filter(f => f.status === 'applied' || f.status === 'under-review').length,
      approvedApplications: mockFundings.filter(f => f.status === 'approved' || f.status === 'disbursed').length,
      rejectedApplications: mockFundings.filter(f => f.status === 'rejected').length
    };

    // Generate mock notifications
    const mockNotifications = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: faker.helpers.arrayElement([
        'New funding application received',
        'User verification required',
        'System maintenance scheduled',
        'High risk application flagged',
        'New investor registered'
      ]),
      message: faker.lorem.sentence(),
      date: faker.date.recent().toISOString().split('T')[0],
      read: false,
      priority: faker.helpers.arrayElement(['high', 'medium', 'low'])
    }));

    setUsers(mockUsers);
    setFundings(mockFundings);
    setStats(mockStats);
    setNotifications(mockNotifications);
    setIsLoading(false);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleFundingStatusChange = (fundingId, newStatus) => {
    setFundings(fundings.map(funding => 
      funding.id === fundingId ? { ...funding, status: newStatus } : funding
    ));
  };

  const handleSystemSettingChange = (name, value) => {
    setSystemSettings({ ...systemSettings, [name]: value });
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement API call to save settings
      // await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(systemSettings)
      // });
      setOpenSettingsDialog(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFundings = fundings.filter(funding =>
    funding.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funding.investor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funding.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
      case 'approved':
      case 'disbursed':
        return theme.palette.success.main;
      case 'pending':
      case 'under-review':
      case 'due-diligence':
        return theme.palette.warning.main;
      case 'rejected':
      case 'suspended':
      case 'defaulted':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const userColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 180,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
            {params.row.name.charAt(0)}
          </Avatar>
          {params.row.name}
        </Box>
      )
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.row.type} 
          color={
            params.row.type === 'investor' ? 'primary' : 
            params.row.type === 'startup' ? 'secondary' : 'default'
          }
          size="small"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
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
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'industry', headerName: 'Industry', width: 120 },
    { 
      field: 'riskScore', 
      headerName: 'Risk Score', 
      width: 130,
      renderCell: (params) => (
        <Box width="100%">
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {params.row.riskScore}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={params.row.riskScore} 
            color={
              params.row.riskScore > 70 ? 'error' : 
              params.row.riskScore > 40 ? 'warning' : 'success'
            }
          />
        </Box>
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => {
              setSelectedUser(params.row);
              setOpenUserDialog(true);
            }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.status === 'pending' && (
            <Tooltip title="Approve">
              <IconButton 
                size="small" 
                color="success"
                onClick={() => handleUserStatusChange(params.row.id, 'verified')}
              >
                <Check fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  const fundingColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'startup', headerName: 'Startup/SME', width: 180 },
    { field: 'investor', headerName: 'Investor', width: 180 },
    { 
      field: 'amount', 
      headerName: 'Amount (UGX)', 
      width: 150,
      renderCell: (params) => (
        <Typography fontWeight="500">
          {new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'UGX',
            maximumFractionDigits: 0
          }).format(params.row.amount)}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.row.status.replace('-', ' ')}
          size="small"
          sx={{ 
            backgroundColor: getStatusColor(params.row.status),
            color: theme.palette.getContrastText(getStatusColor(params.row.status))
          }}
        />
      )
    },
    { field: 'sector', headerName: 'Sector', width: 120 },
    { 
      field: 'riskAssessment', 
      headerName: 'Risk', 
      width: 120,
      renderCell: (params) => (
        <Box width="100%">
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {params.row.riskAssessment}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={params.row.riskAssessment} 
            color={
              params.row.riskAssessment > 70 ? 'error' : 
              params.row.riskAssessment > 40 ? 'warning' : 'success'
            }
          />
        </Box>
      )
    },
    { field: 'repaymentTerms', headerName: 'Terms', width: 120 },
    { field: 'expectedROI', headerName: 'ROI', width: 100 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 180,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {['applied', 'under-review'].includes(params.row.status) && (
            <>
              <Tooltip title="Approve">
                <IconButton 
                  size="small" 
                  color="success"
                  onClick={() => handleFundingStatusChange(params.row.id, 'due-diligence')}
                >
                  <Check fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleFundingStatusChange(params.row.id, 'rejected')}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          {params.row.status === 'due-diligence' && (
            <Tooltip title="Disburse Funds">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => handleFundingStatusChange(params.row.id, 'disbursed')}
              >
                <Payment fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View Details">
            <IconButton 
              size="small"
              onClick={() => {
                setSelectedFunding(params.row);
                setOpenFundingDialog(true);
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box p={3}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            FunderSpick Super Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome back, Walter Bwire • CEO • {new Date().toLocaleDateString()}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Settings />}
            onClick={() => setOpenSettingsDialog(true)}
          >
            System Settings
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
                  Total Users
                </Typography>
                <People color="primary" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {stats.totalUsers}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">
                  <Box component="span" color="success.main" mr={0.5}>
                    +12%
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
                  Startups/SMEs
                </Typography>
                <Business color="secondary" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {stats.totalStartups}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">
                  <Box component="span" color="success.main" mr={0.5}>
                    +8%
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
                  Investors
                </Typography>
                <Money color="success" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {stats.totalInvestors}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">
                  <Box component="span" color="success.main" mr={0.5}>
                    +15%
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
                  Total Funding
                </Typography>
                <Assessment color="warning" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'UGX',
                  maximumFractionDigits: 0
                }).format(stats.totalFunding)}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2">
                  <Box component="span" color="success.main" mr={0.5}>
                    +22%
                  </Box>
                  vs last quarter
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Funding Applications
                </Typography>
                <Button size="small" endIcon={<Timeline />}>
                  View Full Report
                </Button>
              </Box>
              <Box height={300} display="flex" alignItems="center" justifyContent="center">
                <PieChart fontSize="large" color="disabled" />
                <Typography color="textSecondary">Pie chart showing funding applications by status</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Sector Distribution
                </Typography>
                <Button size="small" endIcon={<BarChart />}>
                  View Full Report
                </Button>
              </Box>
              <Box height={300} display="flex" alignItems="center" justifyContent="center">
                <BarChart fontSize="large" color="disabled" />
                <Typography color="textSecondary">Bar chart showing funding by sector</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Tabs */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
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
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            sx={{ mr: 2 }}
          >
            Refresh Data
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Users Management" icon={<People />} />
        <Tab label="Funding Management" icon={<Money />} />
        <Tab label="Risk Analysis" icon={<Warning />} />
        <Tab label="Compliance" icon={<VerifiedUser />} />
      </Tabs>

      {/* Users Tab */}
      {activeTab === 0 && (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              All Users ({users.length})
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
              >
                Add User
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredUsers}
              columns={userColumns}
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

      {/* Funding Tab */}
      {activeTab === 1 && (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Funding Applications ({fundings.length})
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => {
                  setSelectedFunding(null);
                  setOpenFundingDialog(true);
                }}
              >
                New Application
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredFundings}
              columns={fundingColumns}
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

      {/* Risk Analysis Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  High Risk Applications
                </Typography>
                <List>
                  {fundings
                    .filter(f => f.riskAssessment > 70)
                    .sort((a, b) => b.riskAssessment - a.riskAssessment)
                    .slice(0, 5)
                    .map(funding => (
                      <ListItem key={funding.id} secondaryAction={
                        <Chip 
                          label={`${funding.riskAssessment}%`} 
                          color="error" 
                          size="small"
                        />
                      }>
                        <ListItemAvatar>
                          <Avatar>
                            {funding.startup.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={funding.startup}
                          secondary={`${new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: 'UGX',
                            maximumFractionDigits: 0
                          }).format(funding.amount)} • ${funding.sector}`}
                        />
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Risk Distribution
                </Typography>
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <BarChart fontSize="large" color="disabled" />
                  <Typography color="textSecondary">Risk distribution chart</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Compliance Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Compliance Dashboard
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          KYC Compliance
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {Math.round((users.filter(u => u.documentsVerified).length / users.length * 100))}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.round((users.filter(u => u.documentsVerified).length / users.length * 100))} 
                          color="success"
                          sx={{ mt: 2 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          AML Checks
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          92%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={92} 
                          color="success"
                          sx={{ mt: 2 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Regulatory Updates
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          3 New
                        </Typography>
                        <Button size="small" sx={{ mt: 1 }}>View Updates</Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* User Dialog */}
      <Dialog 
        open={openUserDialog} 
        onClose={() => setOpenUserDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">User Details</Typography>
            <IconButton onClick={() => setOpenUserDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
                    {selectedUser.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedUser.name}
                  </Typography>
                  <Typography color="textSecondary">
                    {selectedUser.email}
                  </Typography>
                  <Chip 
                    label={selectedUser.type} 
                    color={
                      selectedUser.type === 'investor' ? 'primary' : 
                      selectedUser.type === 'startup' ? 'secondary' : 'default'
                    }
                    sx={{ mt: 2 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={selectedUser.name}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={selectedUser.email}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Registration Date"
                      fullWidth
                      value={selectedUser.registrationDate}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Active"
                      fullWidth
                      value={selectedUser.lastActive}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Location"
                      fullWidth
                      value={selectedUser.location}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Industry"
                      fullWidth
                      value={selectedUser.industry}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Funding Stage"
                      fullWidth
                      value={selectedUser.fundingStage}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Risk Score"
                      fullWidth
                      value={`${selectedUser.riskScore}%`}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={selectedUser.status}
                        onChange={(e) => {
                          setSelectedUser({ ...selectedUser, status: e.target.value });
                          handleUserStatusChange(selectedUser.id, e.target.value);
                        }}
                        label="Status"
                      >
                        <MenuItem value="verified">Verified</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="suspended">Suspended</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenUserDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Close
          </Button>
          <Button 
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Funding Dialog */}
      <Dialog 
        open={openFundingDialog} 
        onClose={() => setOpenFundingDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedFunding ? 'Funding Application Details' : 'New Funding Application'}
            </Typography>
            <IconButton onClick={() => setOpenFundingDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Startup/SME</InputLabel>
                <Select
                  value={selectedFunding?.startup || ''}
                  onChange={(e) => setSelectedFunding({ 
                    ...selectedFunding, 
                    startup: e.target.value 
                  })}
                  label="Startup/SME"
                >
                  {users
                    .filter(u => u.type === 'startup' || u.type === 'sme')
                    .map(user => (
                      <MenuItem key={user.id} value={user.name}>
                        {user.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Investor</InputLabel>
                <Select
                  value={selectedFunding?.investor || ''}
                  onChange={(e) => setSelectedFunding({ 
                    ...selectedFunding, 
                    investor: e.target.value 
                  })}
                  label="Investor"
                >
                  {users
                    .filter(u => u.type === 'investor')
                    .map(user => (
                      <MenuItem key={user.id} value={user.name}>
                        {user.name}
                      </MenuItem>
                    ))}
                  <MenuItem value="Corporate Investor">Corporate Investor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount (UGX)"
                fullWidth
                type="number"
                value={selectedFunding?.amount || ''}
                onChange={(e) => setSelectedFunding({ 
                  ...selectedFunding, 
                  amount: e.target.value 
                })}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">UGX</InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sector</InputLabel>
                <Select
                  value={selectedFunding?.sector || ''}
                  onChange={(e) => setSelectedFunding({ 
                    ...selectedFunding, 
                    sector: e.target.value 
                  })}
                  label="Sector"
                >
                  <MenuItem value="Fintech">Fintech</MenuItem>
                  <MenuItem value="Agritech">Agritech</MenuItem>
                  <MenuItem value="Healthtech">Healthtech</MenuItem>
                  <MenuItem value="Edtech">Edtech</MenuItem>
                  <MenuItem value="E-commerce">E-commerce</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedFunding?.status || 'applied'}
                  onChange={(e) => setSelectedFunding({ 
                    ...selectedFunding, 
                    status: e.target.value 
                  })}
                  label="Status"
                >
                  <MenuItem value="applied">Applied</MenuItem>
                  <MenuItem value="under-review">Under Review</MenuItem>
                  <MenuItem value="due-diligence">Due Diligence</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="disbursed">Disbursed</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Repayment Terms</InputLabel>
                <Select
                  value={selectedFunding?.repaymentTerms || ''}
                  onChange={(e) => setSelectedFunding({ 
                    ...selectedFunding, 
                    repaymentTerms: e.target.value 
                  })}
                  label="Repayment Terms"
                >
                  <MenuItem value="6 months">6 months</MenuItem>
                  <MenuItem value="12 months">12 months</MenuItem>
                  <MenuItem value="24 months">24 months</MenuItem>
                  <MenuItem value="Equity">Equity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Risk Assessment Notes"
                fullWidth
                multiline
                rows={3}
                value={selectedFunding?.riskAssessmentNotes || ''}
                onChange={(e) => setSelectedFunding({ 
                  ...selectedFunding, 
                  riskAssessmentNotes: e.target.value 
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenFundingDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            color="primary"
          >
            {selectedFunding ? 'Update Application' : 'Create Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* System Settings Dialog */}
      <Dialog 
        open={openSettingsDialog} 
        onClose={() => setOpenSettingsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">System Settings</Typography>
            <IconButton onClick={() => setOpenSettingsDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Platform Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Platform Fee (%)"
                fullWidth
                value={systemSettings.platformFee}
                onChange={(e) => handleSystemSettingChange('platformFee', e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Minimum Investment (UGX)"
                fullWidth
                value={systemSettings.minInvestment}
                onChange={(e) => handleSystemSettingChange('minInvestment', e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">UGX</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Maximum Investment (UGX)"
                fullWidth
                value={systemSettings.maxInvestment}
                onChange={(e) => handleSystemSettingChange('maxInvestment', e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">UGX</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Auto Approval Threshold (%)"
                fullWidth
                value={systemSettings.autoApprovalThreshold}
                onChange={(e) => handleSystemSettingChange('autoApprovalThreshold', e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
                Security & Compliance
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.kycRequired}
                    onChange={(e) => handleSystemSettingChange('kycRequired', e.target.checked)}
                    color="primary"
                  />
                }
                label="KYC Verification Required"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.twoFactorAuth}
                    onChange={(e) => handleSystemSettingChange('twoFactorAuth', e.target.checked)}
                    color="primary"
                  />
                }
                label="Two-Factor Authentication (2FA) for Admins"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => handleSystemSettingChange('maintenanceMode', e.target.checked)}
                    color="primary"
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenSettingsDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            variant="contained"
            color="primary"
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminDashboard;