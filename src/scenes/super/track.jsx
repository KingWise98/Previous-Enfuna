import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Snackbar
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  DirectionsBike,
  DirectionsCar,
  Security,
  LocalAtm,
  Receipt,
  TrendingUp,
  Notifications,
  Add,
  Close,
  LocationOn,
  Schedule,
  Money,
  Speed,
  EmojiEvents,
  WifiOff,
  ExpandMore,
  Map,
  BarChart,
  History,
  Settings,
  Download,
  Upload,
  Sync,
  GpsFixed,
  Payment,
  Person,
  AdminPanelSettings,
  Warning,
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  Delete,
  Block,
  Refresh,
  FilterList,
  Search,
  Dashboard as DashboardIcon,
  Group,
  Assignment,
  Report,
  Policy,
  Gavel,
  VerifiedUser,
  LocationTracking,
  Speed as SpeedIcon,
  Timeline,
  Flag,
  LocalPolice,
  MedicalServices,
  CarRental,
  TwoWheeler
} from '@mui/icons-material';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showLegalDialog, setShowLegalDialog] = useState(false);
  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [showComplianceReport, setShowComplianceReport] = useState(false);
  const [showSystemHealth, setShowSystemHealth] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    compliance: 'all'
  });

  // Mock data for riders and drivers
  const [users, setUsers] = useState({
    riders: [
      {
        id: 'RDR001',
        name: 'David Kato',
        phone: '+256712345678',
        status: 'active',
        type: 'rider',
        vehicle: {
          type: 'motorcycle',
          plate: 'UAB 123A',
          model: 'Bajaj Boxer',
          year: 2022
        },
        compliance: {
          license: { valid: true, expiry: '2024-12-31', verified: true },
          insurance: { valid: true, expiry: '2024-06-30', verified: true },
          registration: { valid: true, expiry: '2024-12-31', verified: true },
          medical: { valid: true, expiry: '2024-09-30', verified: true }
        },
        performance: {
          rating: 4.7,
          completedRides: 245,
          cancellationRate: 2.1,
          responseTime: '2.3min'
        },
        location: { lat: 0.3476, lng: 32.5825, lastUpdate: '2024-01-15T10:30:00' },
        earnings: { today: 45000, weekly: 285000, monthly: 1150000 },
        alerts: 0,
        lastActive: '2024-01-15T10:25:00'
      },
      {
        id: 'RDR002',
        name: 'John Mugisha',
        phone: '+256712345679',
        status: 'suspended',
        type: 'rider',
        vehicle: {
          type: 'motorcycle',
          plate: 'UAB 124B',
          model: 'TVS Star',
          year: 2021
        },
        compliance: {
          license: { valid: false, expiry: '2023-11-30', verified: true },
          insurance: { valid: true, expiry: '2024-07-31', verified: true },
          registration: { valid: true, expiry: '2024-08-31', verified: true },
          medical: { valid: false, expiry: '2023-12-31', verified: true }
        },
        performance: {
          rating: 3.8,
          completedRides: 89,
          cancellationRate: 8.5,
          responseTime: '5.1min'
        },
        location: { lat: 0.3366, lng: 32.5825, lastUpdate: '2024-01-14T16:45:00' },
        earnings: { today: 0, weekly: 0, monthly: 85000 },
        alerts: 3,
        lastActive: '2024-01-14T16:45:00',
        suspensionReason: 'Expired license and medical certificate'
      }
    ],
    drivers: [
      {
        id: 'DRV001',
        name: 'Emma Vangamoi',
        phone: '+256712345680',
        status: 'active',
        type: 'driver',
        vehicle: {
          type: 'sedan',
          plate: 'UAE 456C',
          model: 'Toyota Premio',
          year: 2020,
          capacity: 4
        },
        compliance: {
          license: { valid: true, expiry: '2025-03-31', verified: true },
          insurance: { valid: true, expiry: '2024-08-31', verified: true },
          registration: { valid: true, expiry: '2024-12-31', verified: true },
          medical: { valid: true, expiry: '2024-11-30', verified: true },
          psv: { valid: true, expiry: '2024-10-31', verified: true }
        },
        performance: {
          rating: 4.9,
          completedRides: 412,
          cancellationRate: 1.2,
          responseTime: '1.8min'
        },
        location: { lat: 0.3176, lng: 32.5925, lastUpdate: '2024-01-15T10:28:00' },
        earnings: { today: 68000, weekly: 425000, monthly: 1850000 },
        alerts: 0,
        lastActive: '2024-01-15T10:28:00'
      },
      {
        id: 'DRV002',
        name: 'Sarah Nalwoga',
        phone: '+256712345681',
        status: 'under_review',
        type: 'driver',
        vehicle: {
          type: 'suv',
          plate: 'UAF 789D',
          model: 'Nissan X-Trail',
          year: 2019,
          capacity: 6
        },
        compliance: {
          license: { valid: true, expiry: '2024-09-30', verified: true },
          insurance: { valid: false, expiry: '2023-12-31', verified: true },
          registration: { valid: true, expiry: '2024-06-30', verified: true },
          medical: { valid: true, expiry: '2024-08-31', verified: true },
          psv: { valid: false, expiry: '2023-11-30', verified: true }
        },
        performance: {
          rating: 4.2,
          completedRides: 156,
          cancellationRate: 4.3,
          responseTime: '3.2min'
        },
        location: { lat: 0.3276, lng: 32.5725, lastUpdate: '2024-01-15T09:15:00' },
        earnings: { today: 12000, weekly: 85000, monthly: 420000 },
        alerts: 2,
        lastActive: '2024-01-15T09:15:00',
        reviewReason: 'Insurance and PSV license expired'
      }
    ]
  });

  const [systemStats, setSystemStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    suspendedUsers: 23,
    underReview: 15,
    totalRides: 45892,
    todayRides: 342,
    totalEarnings: 125800000,
    complianceRate: 87.5,
    avgResponseTime: '2.8min',
    sosAlerts: 2
  });

  const [legalRequirements, setLegalRequirements] = useState([
    {
      id: 1,
      category: 'license',
      name: 'Driving License',
      description: 'Valid driving license for vehicle type',
      required: true,
      validityPeriod: '1-3 years',
      gracePeriod: 30,
      penalty: 'Suspension'
    },
    {
      id: 2,
      category: 'insurance',
      name: 'Third Party Insurance',
      description: 'Minimum third party insurance coverage',
      required: true,
      validityPeriod: '1 year',
      gracePeriod: 15,
      penalty: 'Fine + Suspension'
    },
    {
      id: 3,
      category: 'registration',
      name: 'Vehicle Registration',
      description: 'Valid vehicle registration documents',
      required: true,
      validityPeriod: '1 year',
      gracePeriod: 7,
      penalty: 'Fine'
    },
    {
      id: 4,
      category: 'medical',
      name: 'Medical Certificate',
      description: 'Fitness to drive medical certificate',
      required: true,
      validityPeriod: '2 years',
      gracePeriod: 30,
      penalty: 'Suspension'
    },
    {
      id: 5,
      category: 'psv',
      name: 'PSV License',
      description: 'Public Service Vehicle license for drivers',
      required: true,
      validityPeriod: '1 year',
      gracePeriod: 15,
      penalty: 'Suspension'
    }
  ]);

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 1,
      userId: 'RDR002',
      userName: 'John Mugisha',
      type: 'compliance',
      severity: 'high',
      message: 'License and medical certificate expired',
      timestamp: '2024-01-15T08:00:00',
      status: 'pending'
    },
    {
      id: 2,
      userId: 'DRV002',
      userName: 'Sarah Nalwoga',
      type: 'compliance',
      severity: 'medium',
      message: 'Insurance and PSV license expired',
      timestamp: '2024-01-15T09:15:00',
      status: 'under_review'
    },
    {
      id: 3,
      userId: 'RDR005',
      userName: 'Mike Omondi',
      type: 'sos',
      severity: 'critical',
      message: 'SOS emergency triggered',
      timestamp: '2024-01-15T10:05:00',
      status: 'responded'
    }
  ]);

  // Filter users based on active tab, search and filters
  const getFilteredUsers = () => {
    let userList = [];
    
    // Determine which users to show based on active tab
    switch (activeTab) {
      case 0: // All Users
        userList = [...users.riders, ...users.drivers];
        break;
      case 1: // Riders
        userList = users.riders;
        break;
      case 2: // Drivers
        userList = users.drivers;
        break;
      case 3: // Compliance Issues
        userList = [...users.riders, ...users.drivers].filter(user => !isUserCompliant(user));
        break;
      default:
        userList = [...users.riders, ...users.drivers];
    }

    return userList.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      const matchesType = filters.type === 'all' || user.type === filters.type;
      const matchesCompliance = filters.compliance === 'all' || 
                               (filters.compliance === 'compliant' && isUserCompliant(user)) ||
                               (filters.compliance === 'non_compliant' && !isUserCompliant(user));
      
      return matchesSearch && matchesStatus && matchesType && matchesCompliance;
    });
  };

  const isUserCompliant = (user) => {
    return Object.values(user.compliance).every(doc => doc.valid);
  };

  const handleUserAction = (userId, action) => {
    const updatedUsers = { ...users };
    let message = '';
    
    // Find user in riders or drivers
    let user = updatedUsers.riders.find(u => u.id === userId) || 
               updatedUsers.drivers.find(u => u.id === userId);
    
    if (user) {
      switch (action) {
        case 'suspend':
          user.status = 'suspended';
          user.suspensionReason = 'Admin manual suspension';
          message = `User ${userId} suspended successfully`;
          break;
        case 'activate':
          user.status = 'active';
          user.suspensionReason = '';
          message = `User ${userId} activated successfully`;
          break;
        case 'view':
          setSelectedUser(user);
          setShowUserDetails(true);
          return;
        default:
          break;
      }
      
      setUsers(updatedUsers);
      showSnackbar(message, 'success');
    }
  };

  const handleRefreshData = () => {
    // Simulate data refresh
    showSnackbar('Data refreshed successfully', 'info');
    // In real app, this would fetch new data from API
  };

  const handleGenerateComplianceReport = () => {
    setShowComplianceReport(true);
    showSnackbar('Generating compliance report...', 'info');
  };

  const handleSystemHealthCheck = () => {
    setShowSystemHealth(true);
    showSnackbar('Running system health check...', 'info');
  };

  const handleLegalComplianceAudit = () => {
    setShowLegalDialog(true);
    showSnackbar('Starting legal compliance audit...', 'info');
  };

  const handleExportReports = () => {
    showSnackbar('Exporting reports...', 'info');
    // Simulate export process
    setTimeout(() => {
      showSnackbar('Reports exported successfully!', 'success');
    }, 2000);
  };

  const handleSOSResponse = (alert) => {
    setShowSOSAlert(true);
    showSnackbar(`Responding to SOS alert from ${alert.userName}`, 'warning');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const ComplianceStatus = ({ user }) => {
    const validDocs = Object.values(user.compliance).filter(doc => doc.valid).length;
    const totalDocs = Object.values(user.compliance).length;
    const percentage = (validDocs / totalDocs) * 100;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={percentage} 
          sx={{ width: 60 }}
          color={percentage === 100 ? 'success' : percentage > 50 ? 'warning' : 'error'}
        />
        <Typography variant="body2">
          {validDocs}/{totalDocs}
        </Typography>
      </Box>
    );
  };

  const StatusChip = ({ status }) => {
    const statusConfig = {
      active: { color: 'success', label: 'Active' },
      suspended: { color: 'error', label: 'Suspended' },
      under_review: { color: 'warning', label: 'Under Review' },
      offline: { color: 'default', label: 'Offline' }
    };

    const config = statusConfig[status] || statusConfig.offline;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const filteredUsers = getFilteredUsers();

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Rider & Driver  Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Comprehensive monitoring and compliance management for riders and drivers
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<Download />} 
            variant="outlined"
            onClick={handleExportReports}
          >
            Export Reports
          </Button>
          <Button 
            startIcon={<Policy />} 
            variant="contained"
            onClick={() => setShowLegalDialog(true)}
          >
            Legal Framework
          </Button>
        </Box>
      </Box>

      {/* System Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Group color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {systemStats.totalUsers}
              </Typography>
              <Typography variant="body2">Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {systemStats.activeUsers}
              </Typography>
              <Typography variant="body2">Active Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {systemStats.underReview}
              </Typography>
              <Typography variant="body2">Under Review</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <VerifiedUser color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {systemStats.complianceRate}%
              </Typography>
              <Typography variant="body2">Compliance Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalPolice color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {systemStats.sosAlerts}
              </Typography>
              <Typography variant="body2">SOS Alerts</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Sidebar - Quick Actions & Alerts */}
        <Grid item xs={3}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Button 
                fullWidth 
                startIcon={<Refresh />} 
                sx={{ mb: 1 }}
                onClick={handleRefreshData}
              >
                Refresh All Data
              </Button>
              <Button 
                fullWidth 
                startIcon={<Assignment />} 
                sx={{ mb: 1 }}
                onClick={handleGenerateComplianceReport}
              >
                Generate Compliance Report
              </Button>
              <Button 
                fullWidth 
                startIcon={<Report />} 
                sx={{ mb: 1 }}
                onClick={handleSystemHealthCheck}
              >
                System Health Check
              </Button>
              <Button 
                fullWidth 
                startIcon={<Gavel />}
                onClick={handleLegalComplianceAudit}
              >
                Legal Compliance Audit
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Alerts</Typography>
              <List dense>
                {recentAlerts.map((alert) => (
                  <ListItem 
                    key={alert.id}
                    sx={{ 
                      borderLeft: `4px solid ${
                        alert.severity === 'critical' ? '#f44336' :
                        alert.severity === 'high' ? '#ff9800' : '#4caf50'
                      }`,
                      mb: 1
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">
                            {alert.userName}
                          </Typography>
                          <Chip 
                            label={alert.type.toUpperCase()} 
                            size="small" 
                            color={
                              alert.severity === 'critical' ? 'error' :
                              alert.severity === 'high' ? 'warning' : 'success'
                            }
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {alert.message}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(alert.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    {alert.type === 'sos' && (
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleSOSResponse(alert)}
                      >
                        <Security />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Legal Requirements */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Legal Requirements</Typography>
              <List dense>
                {legalRequirements.map((req) => (
                  <ListItem key={req.id}>
                    <ListItemIcon>
                      <VerifiedUser color={req.required ? "primary" : "action"} />
                    </ListItemIcon>
                    <ListItemText
                      primary={req.name}
                      secondary={`Validity: ${req.validityPeriod}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={9}>
          <Card>
            <CardContent>
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab icon={<Group />} label="All Users" />
                  <Tab icon={<TwoWheeler />} label="Riders" />
                  <Tab icon={<CarRental />} label="Drivers" />
                  <Tab icon={<Warning />} label="Compliance Issues" />
                  <Tab icon={<Timeline />} label="Analytics" />
                </Tabs>
              </Box>

              {/* Search and Filters */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
                  sx={{ flexGrow: 1 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                    <MenuItem value="under_review">Under Review</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    label="Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="rider">Riders</MenuItem>
                    <MenuItem value="driver">Drivers</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>Compliance</InputLabel>
                  <Select
                    value={filters.compliance}
                    onChange={(e) => setFilters(prev => ({ ...prev, compliance: e.target.value }))}
                    label="Compliance"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="compliant">Compliant</MenuItem>
                    <MenuItem value="non_compliant">Non-Compliant</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Users Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User Details</TableCell>
                      <TableCell>Vehicle Info</TableCell>
                      <TableCell>Compliance</TableCell>
                      <TableCell>Performance</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Active</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: user.type === 'rider' ? 'primary.main' : 'secondary.main' }}>
                              {user.type === 'rider' ? <TwoWheeler /> : <CarRental />}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {user.name}
                              </Typography>
                              <Typography variant="caption" display="block">
                                {user.id}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {user.phone}
                              </Typography>
                            </Box>
                            {user.alerts > 0 && (
                              <Badge badgeContent={user.alerts} color="error">
                                <Warning color="action" />
                              </Badge>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {user.vehicle.plate}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {user.vehicle.model} ({user.vehicle.year})
                          </Typography>
                          <Chip 
                            label={user.vehicle.type} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <ComplianceStatus user={user} />
                          {!isUserCompliant(user) && (
                            <Typography variant="caption" color="error" display="block">
                              Non-compliant
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              ⭐ {user.performance.rating}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {user.performance.completedRides} rides
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={user.status} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {new Date(user.lastActive).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleUserAction(user.id, 'view')}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            {user.status === 'active' ? (
                              <Tooltip title="Suspend">
                                <IconButton 
                                  size="small" 
                                  color="warning"
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                >
                                  <Block />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Activate">
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredUsers.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="textSecondary">
                    No users found matching your criteria
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onClose={() => setShowUserDetails(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">User Details - {selectedUser?.name}</Typography>
            <IconButton onClick={() => setShowUserDetails(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, bgcolor: selectedUser.type === 'rider' ? 'primary.main' : 'secondary.main' }}>
                      {selectedUser.type === 'rider' ? <TwoWheeler /> : <CarRental />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedUser.name}</Typography>
                      <Typography variant="body2">{selectedUser.id}</Typography>
                      <Typography variant="body2">{selectedUser.phone}</Typography>
                    </Box>
                  </Box>
                  
                  <StatusChip status={selectedUser.status} />
                  {selectedUser.suspensionReason && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      {selectedUser.suspensionReason}
                    </Alert>
                  )}
                </Paper>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Vehicle Information</Typography>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">Plate Number</Typography>
                      <Typography variant="body1">{selectedUser.vehicle.plate}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">Model</Typography>
                      <Typography variant="body1">{selectedUser.vehicle.model}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">Year</Typography>
                      <Typography variant="body1">{selectedUser.vehicle.year}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">Type</Typography>
                      <Typography variant="body1">{selectedUser.vehicle.type}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>Compliance Status</Typography>
                <Paper sx={{ p: 2 }}>
                  {Object.entries(selectedUser.compliance).map(([key, doc]) => (
                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                        <Typography variant="caption">
                          Expires: {new Date(doc.expiry).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip 
                        label={doc.valid ? 'Valid' : 'Expired'} 
                        color={doc.valid ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  ))}
                </Paper>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Performance Metrics</Typography>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">Rating</Typography>
                      <Typography variant="body1">⭐ {selectedUser.performance.rating}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">Completed Rides</Typography>
                      <Typography variant="body1">{selectedUser.performance.completedRides}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">Cancellation Rate</Typography>
                      <Typography variant="body1">{selectedUser.performance.cancellationRate}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="bold">Response Time</Typography>
                      <Typography variant="body1">{selectedUser.performance.responseTime}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUserDetails(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Legal Framework Dialog */}
      <Dialog open={showLegalDialog} onClose={() => setShowLegalDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Legal Framework & Compliance Requirements</Typography>
            <IconButton onClick={() => setShowLegalDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Legal Requirements Overview</Typography>
          <List>
            {legalRequirements.map((req) => (
              <ListItem key={req.id} divider>
                <ListItemIcon>
                  <Gavel color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={req.name}
                  secondary={
                    <Box>
                      <Typography variant="body2">{req.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Chip label={`Validity: ${req.validityPeriod}`} size="small" />
                        <Chip label={`Grace: ${req.gracePeriod} days`} size="small" color="warning" />
                        <Chip label={`Penalty: ${req.penalty}`} size="small" color="error" />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              All requirements are enforced according to national transportation laws and regulations.
              Non-compliance may result in automatic suspension and legal penalties.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLegalDialog(false)}>Close</Button>
          <Button variant="contained" onClick={handleLegalComplianceAudit}>
            Run Compliance Audit
          </Button>
        </DialogActions>
      </Dialog>

      {/* SOS Alert Dialog */}
      <Dialog open={showSOSAlert} onClose={() => setShowSOSAlert(false)}>
        <DialogContent>
          <Box textAlign="center" p={2}>
            <Avatar sx={{ bgcolor: 'error.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <Security />
            </Avatar>
            <Typography variant="h5" color="error" gutterBottom>
              🚨 SOS Emergency Alert
            </Typography>
            <Typography variant="body1" paragraph>
              Immediate attention required! User has triggered an emergency SOS alert.
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Emergency Protocol Activated
              </Typography>
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => setShowSOSAlert(false)}>
                Dismiss
              </Button>
              <Button variant="contained" color="error" startIcon={<LocalPolice />}>
                Contact Emergency Services
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Compliance Report Dialog */}
      <Dialog open={showComplianceReport} onClose={() => setShowComplianceReport(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5">Compliance Report</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>System Compliance Overview</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {systemStats.complianceRate}%
                </Typography>
                <Typography variant="body2">Overall Compliance Rate</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {users.riders.length + users.drivers.length - filteredUsers.length}
                </Typography>
                <Typography variant="body2">Non-Compliant Users</Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Compliance Breakdown</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Riders Compliance"
                secondary={`${users.riders.filter(r => isUserCompliant(r)).length}/${users.riders.length} compliant`}
              />
              <LinearProgress 
                variant="determinate" 
                value={(users.riders.filter(r => isUserCompliant(r)).length / users.riders.length) * 100}
                sx={{ width: 100 }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Drivers Compliance"
                secondary={`${users.drivers.filter(d => isUserCompliant(d)).length}/${users.drivers.length} compliant`}
              />
              <LinearProgress 
                variant="determinate" 
                value={(users.drivers.filter(d => isUserCompliant(d)).length / users.drivers.length) * 100}
                sx={{ width: 100 }}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowComplianceReport(false)}>Close</Button>
          <Button variant="contained" startIcon={<Download />}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* System Health Dialog */}
      <Dialog open={showSystemHealth} onClose={() => setShowSystemHealth(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5">System Health Check</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Database Connection" secondary="Connected and responsive" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="GPS Tracking" secondary="All devices reporting" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Payment Processing" secondary="Operational" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Compliance Monitoring" secondary="Active and scanning" />
            </ListItem>
          </List>
          <Alert severity="success" sx={{ mt: 2 }}>
            All systems operational. No issues detected.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSystemHealth(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default SuperAdminDashboard;