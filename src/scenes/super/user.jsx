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
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Badge,
  List,

  ListItem,
  ListItemText,
  Checkbox
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';

import {
  AddCircle,
  Edit,
  Delete,
  Lock,
  VerifiedUser,
  People,
  Money,
  Settings,
  Search,
  Close,
  Assessment,
  
  CheckCircle,
  Cancel,
  MoreVert,
  Security,
  Refresh
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

// Sample permissions structure
const PERMISSIONS = {
  DASHBOARD: 'view_dashboard',
  USER_MANAGEMENT: 'manage_users',
  FUNDING_MANAGEMENT: 'manage_funding',
  REPORTS: 'view_reports',
  SETTINGS: 'manage_settings',
  AUDIT_LOGS: 'view_audit_logs'
};

// Sample roles data
const DEFAULT_ROLES = [
  {
    id: 1,
    name: 'Super Admin',
    permissions: Object.values(PERMISSIONS),
    description: 'Full access to all system features'
  },
  {
    id: 2,
    name: 'Admin',
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.USER_MANAGEMENT,
      PERMISSIONS.FUNDING_MANAGEMENT,
      PERMISSIONS.REPORTS
    ],
    description: 'Can manage users and funding but not system settings'
  },
  {
    id: 3,
    name: 'Analyst',
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.REPORTS
    ],
    description: 'Can view dashboards and generate reports'
  },
  {
    id: 4,
    name: 'Support',
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.USER_MANAGEMENT
    ],
    description: 'Can assist users but not modify funding'
  }
];

const UserManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock users
  useEffect(() => {
    setIsLoading(true);
    const mockUsers = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@funderspick.com`,
      role: DEFAULT_ROLES[i % DEFAULT_ROLES.length].name,
      roleId: DEFAULT_ROLES[i % DEFAULT_ROLES.length].id,
      status: i % 5 === 0 ? 'inactive' : 'active',
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: DEFAULT_ROLES[i % DEFAULT_ROLES.length].permissions
    }));
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  const handleSaveUser = () => {
    if (selectedUser.id) {
      // Update existing user
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    } else {
      // Add new user
      setUsers([...users, { ...selectedUser, id: users.length + 1 }]);
    }
    setOpenUserDialog(false);
  };

  const handleSaveRole = () => {
    if (selectedRole.id) {
      // Update existing role
      setRoles(roles.map(r => r.id === selectedRole.id ? selectedRole : r));
      // Update users with this role
      setUsers(users.map(u => u.roleId === selectedRole.id ? { 
        ...u, 
        role: selectedRole.name,
        permissions: selectedRole.permissions 
      } : u));
    } else {
      // Add new role
      setRoles([...roles, { ...selectedRole, id: roles.length + 1 }]);
    }
    setOpenRoleDialog(false);
  };

  const handlePermissionToggle = (permission) => {
    setSelectedRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
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
      field: 'role', 
      headerName: 'Role', 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.row.role} 
          color={
            params.row.role === 'Super Admin' ? 'error' :
            params.row.role === 'Admin' ? 'warning' : 'primary'
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
          label={params.row.status}
          size="small"
          sx={{ 
            backgroundColor: params.row.status === 'active' 
              ? theme.palette.success.main 
              : theme.palette.error.main,
            color: theme.palette.getContrastText(
              params.row.status === 'active' 
                ? theme.palette.success.main 
                : theme.palette.error.main
            )
          }}
        />
      )
    },
    { 
      field: 'lastLogin', 
      headerName: 'Last Login', 
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
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
                setSelectedUser(params.row);
                setOpenUserDialog(true);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => setUsers(users.filter(u => u.id !== params.row.id))}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          User & Role Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Security />}
            onClick={() => {
              setSelectedRole({
                id: null,
                name: '',
                description: '',
                permissions: []
              });
              setOpenRoleDialog(true);
            }}
          >
            Add Role
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => {
              setSelectedUser({
                id: null,
                name: '',
                email: '',
                role: '',
                roleId: null,
                status: 'active'
              });
              setOpenUserDialog(true);
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search users..."
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

      {/* Tabs Content */}
      <Grid container spacing={3}>
        {/* Users Table */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                All Users ({users.length})
              </Typography>
              <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                  rows={users.filter(user => 
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                  )}
                  columns={userColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  checkboxSelection
                  disableSelectionOnClick
                  components={{ Toolbar: GridToolbar }}
                  loading={isLoading}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Roles List */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                System Roles ({roles.length})
              </Typography>
              <List>
                {roles.map(role => (
                  <ListItem 
                    key={role.id}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        onClick={() => {
                          setSelectedRole(role);
                          setOpenRoleDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    }
                    sx={{
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:hover': { backgroundColor: theme.palette.action.hover }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <VerifiedUser color="primary" />
                          <Typography fontWeight="500">{role.name}</Typography>
                          {role.permissions.includes(PERMISSIONS.USER_MANAGEMENT) && (
                            <Badge badgeContent={users.filter(u => u.roleId === role.id).length} color="primary" />
                          )}
                        </Box>
                      }
                      secondary={role.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Dialog */}
      <Dialog 
        open={openUserDialog} 
        onClose={() => setOpenUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedUser?.id ? 'Edit User' : 'Create New User'}
            </Typography>
            <IconButton onClick={() => setOpenUserDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={selectedUser?.name || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser?.roleId || ''}
                  onChange={(e) => {
                    const role = roles.find(r => r.id === e.target.value);
                    setSelectedUser({ 
                      ...selectedUser, 
                      roleId: e.target.value,
                      role: role?.name || ''
                    });
                  }}
                  label="Role"
                >
                  {roles.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedUser?.status || 'active'}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {selectedUser?.roleId && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Permissions for {roles.find(r => r.id === selectedUser.roleId)?.name} role:
                </Typography>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: `1px solid ${theme.palette.divider}`, 
                    borderRadius: 1 
                  }}
                >
                  {roles.find(r => r.id === selectedUser.roleId)?.permissions.map(p => (
                    <Chip 
                      key={p}
                      label={p.replace('_', ' ')}
                      size="small"
                      color="primary"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenUserDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveUser}
            variant="contained"
            color="primary"
            disabled={!selectedUser?.name || !selectedUser?.email || !selectedUser?.roleId}
          >
            {selectedUser?.id ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Dialog */}
      <Dialog 
        open={openRoleDialog} 
        onClose={() => setOpenRoleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedRole?.id ? 'Edit Role' : 'Create New Role'}
            </Typography>
            <IconButton onClick={() => setOpenRoleDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Role Name"
                fullWidth
                value={selectedRole?.name || ''}
                onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={selectedRole?.description || ''}
                onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Permissions:
              </Typography>
              <Box 
                sx={{ 
                  p: 2, 
                  border: `1px solid ${theme.palette.divider}`, 
                  borderRadius: 1,
                  maxHeight: 300,
                  overflow: 'auto'
                }}
              >
                {Object.entries(PERMISSIONS).map(([key, permission]) => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={selectedRole?.permissions?.includes(permission) || false}
                        onChange={() => handlePermissionToggle(permission)}
                        color="primary"
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        {permission === PERMISSIONS.USER_MANAGEMENT && <People sx={{ mr: 1 }} />}
                        {permission === PERMISSIONS.FUNDING_MANAGEMENT && <Money sx={{ mr: 1 }} />}
                        {permission === PERMISSIONS.SETTINGS && <Settings sx={{ mr: 1 }} />}
                        {permission === PERMISSIONS.DASHBOARD && <DashboardIcon sx={{ mr: 1 }} />}
                        {permission === PERMISSIONS.REPORTS && <Assessment sx={{ mr: 1 }} />}
                        {permission === PERMISSIONS.AUDIT_LOGS && <Lock sx={{ mr: 1 }} />}
                        <Typography>{permission.replace('_', ' ')}</Typography>
                      </Box>
                    }
                    sx={{ display: 'block', mb: 1 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          {selectedRole?.id && selectedRole.id <= 4 && (
            <Typography variant="body2" color="error" sx={{ mr: 'auto' }}>
              Note: Default roles cannot be deleted
            </Typography>
          )}
          {selectedRole?.id && selectedRole.id > 4 && (
            <Button 
              onClick={() => {
                setRoles(roles.filter(r => r.id !== selectedRole.id));
                setOpenRoleDialog(false);
              }}
              color="error"
              sx={{ mr: 'auto' }}
            >
              Delete Role
            </Button>
          )}
          <Button 
            onClick={() => setOpenRoleDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveRole}
            variant="contained"
            color="primary"
            disabled={!selectedRole?.name}
          >
            {selectedRole?.id ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;