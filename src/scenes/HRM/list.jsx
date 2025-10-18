import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Modal,
  Grid,
  FormControlLabel,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Stack,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  Snackbar,
  LinearProgress,
  Tooltip,
  Avatar,
  Switch,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Add,
  Security,
  Settings,
  Save,
  Cancel,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PersonAdd as PersonAddIcon,
  Refresh,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  Group,
  AdminPanelSettings,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

// ============================================================================
// API ENDPOINTS - Replace with actual backend endpoints
// ============================================================================

const API_ENDPOINTS = {
  // Employee Management APIs
  EMPLOYEES: {
    LIST: '/api/employees',
    CREATE: '/api/employees',
    UPDATE: '/api/employees/:id',
    DELETE: '/api/employees/:id',
    STATUS: '/api/employees/:id/status',
  },
  // Role Management APIs
  ROLES: {
    LIST: '/api/roles',
    CREATE: '/api/roles',
    UPDATE: '/api/roles/:id',
    DELETE: '/api/roles/:id',
    PERMISSIONS: '/api/roles/:id/permissions',
  },
  // Permission Management APIs
  PERMISSIONS: {
    LIST: '/api/permissions',
    CATEGORIES: '/api/permissions/categories',
  },
  // User Management APIs
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    UPDATE: '/api/users/:id',
    DELETE: '/api/users/:id',
    PASSWORD: '/api/users/:id/password',
  }
};

// ============================================================================
// BACKEND PERMISSION STRUCTURE - This should match your backend schema
// ============================================================================

const BACKEND_PERMISSION_CATEGORIES = {
  products: {
    label: "Product Management",
    permissions: [
      { id: "products.view", label: "View Products", description: "Can view product catalog" },
      { id: "products.create", label: "Add Products", description: "Can create new products" },
      { id: "products.update", label: "Edit Products", description: "Can modify existing products" },
      { id: "products.delete", label: "Delete Products", description: "Can remove products" },
      { id: "products.pricing", label: "Change Prices", description: "Can update product pricing" },
      { id: "products.inventory", label: "Manage Inventory", description: "Can update stock levels" },
    ],
  },
  sales: {
    label: "Sales Management",
    permissions: [
      { id: "sales.create", label: "Create Sales", description: "Can process new sales" },
      { id: "sales.view", label: "View Sales", description: "Can view sales history" },
      { id: "sales.update", label: "Edit Sales", description: "Can modify sales records" },
      { id: "sales.cancel", label: "Cancel Sales", description: "Can void/cancel sales" },
      { id: "sales.discounts", label: "Apply Discounts", description: "Can apply discounts to sales" },
      { id: "sales.refunds", label: "Process Refunds", description: "Can process refunds" },
    ],
  },
  customers: {
    label: "Customer Management",
    permissions: [
      { id: "customers.view", label: "View Customers", description: "Can view customer database" },
      { id: "customers.create", label: "Add Customers", description: "Can create new customers" },
      { id: "customers.update", label: "Edit Customers", description: "Can modify customer information" },
      { id: "customers.delete", label: "Delete Customers", description: "Can remove customers" },
    ],
  },
  purchases: {
    label: "Purchase Management",
    permissions: [
      { id: "purchases.view", label: "View Purchases", description: "Can view purchase orders" },
      { id: "purchases.create", label: "Create Purchases", description: "Can create purchase orders" },
      { id: "purchases.update", label: "Edit Purchases", description: "Can modify purchase orders" },
      { id: "purchases.approve", label: "Approve Purchases", description: "Can approve purchase orders" },
      { id: "purchases.delete", label: "Delete Purchases", description: "Can remove purchase orders" },
    ],
  },
  reports: {
    label: "Reports & Analytics",
    permissions: [
      { id: "reports.sales", label: "View Sales Reports", description: "Can access sales analytics" },
      { id: "reports.inventory", label: "View Inventory Reports", description: "Can access inventory reports" },
      { id: "reports.financial", label: "View Financial Reports", description: "Can access financial reports" },
      { id: "reports.export", label: "Export Reports", description: "Can export report data" },
    ],
  },
  system: {
    label: "System Administration",
    permissions: [
      { id: "system.users", label: "Manage Users", description: "Can manage system users" },
      { id: "system.roles", label: "Manage Roles", description: "Can manage user roles" },
      { id: "system.settings", label: "System Settings", description: "Can modify system configuration" },
      { id: "system.backup", label: "Backup & Restore", description: "Can manage data backups" },
      { id: "system.audit", label: "View Audit Logs", description: "Can access system audit trails" },
    ],
  },
};

// ============================================================================
// DEFAULT ROLES - These should be created in backend initially
// ============================================================================

const DEFAULT_ROLES = {
  super_admin: {
    id: 1,
    name: "Super Administrator",
    description: "Full system access with all permissions",
    is_system: true,
    permissions: Object.values(BACKEND_PERMISSION_CATEGORIES)
      .flatMap(category => category.permissions.map(p => p.id))
  },
  admin: {
    id: 2,
    name: "Administrator",
    description: "Full administrative access except system settings",
    is_system: true,
    permissions: Object.values(BACKEND_PERMISSION_CATEGORIES)
      .flatMap(category => category.permissions.map(p => p.id))
      .filter(p => !p.startsWith('system.'))
  },
  manager: {
    id: 3,
    name: "Manager",
    description: "Can manage products, sales, customers, and view reports",
    is_system: true,
    permissions: [
      ...BACKEND_PERMISSION_CATEGORIES.products.permissions.map(p => p.id),
      ...BACKEND_PERMISSION_CATEGORIES.sales.permissions.map(p => p.id),
      ...BACKEND_PERMISSION_CATEGORIES.customers.permissions.map(p => p.id),
      ...BACKEND_PERMISSION_CATEGORIES.reports.permissions.map(p => p.id),
    ]
  },
  cashier: {
    id: 4,
    name: "Cashier",
    description: "Can process sales and view products/customers",
    is_system: true,
    permissions: [
      "products.view",
      "sales.create",
      "sales.discounts",
      "customers.view",
      "customers.create",
    ]
  },
  inventory_clerk: {
    id: 5,
    name: "Inventory Clerk",
    description: "Can manage products and inventory",
    is_system: true,
    permissions: [
      "products.view",
      "products.create",
      "products.update",
      "products.pricing",
      "products.inventory",
      "reports.inventory",
    ]
  }
};

// ============================================================================
// INITIAL DATA - Replace with API calls
// ============================================================================

const initialEmployees = [
  {
    id: 1,
    employee_id: "EMP001",
    username: "alicej",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+256 123 456 789",
    designation: "Senior Developer",
    department: "Technology",
    position: "Frontend Lead",
    joining_date: "2024-02-15",
    status: "active",
    role_id: 1,
    role_name: "Super Administrator",
    avatar: null,
    last_login: "2024-01-15T10:30:00Z",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    employee_id: "EMP002",
    username: "williamst",
    name: "Tumuwebazi Williams",
    email: "williams@example.com",
    phone: "+256 987 654 321",
    designation: "Finance Manager",
    department: "Finance",
    position: "Head of Finance",
    joining_date: "2023-09-10",
    status: "active",
    role_id: 2,
    role_name: "Administrator",
    avatar: null,
    last_login: "2024-01-14T15:45:00Z",
    created_at: "2023-09-01T00:00:00Z",
  },
];

const statusColors = {
  active: "success",
  inactive: "warning",
  suspended: "error",
  pending: "info",
  terminated: "error",
};

const EmployeeUserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // State Management
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openRoleManager, setOpenRoleManager] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employee_id: "",
    username: "",
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    position: "",
    joining_date: "",
    status: "active",
    role_id: "",
  });
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [editingRole, setEditingRole] = useState(null);

  // Extract unique values for filters
  const allDepartments = [...new Set(employees.map(emp => emp.department))];
  const allStatuses = [...new Set(employees.map(emp => emp.status))];
  const allRoles = [...new Set(employees.map(emp => emp.role_name))];

  // ============================================================================
  // API INTEGRATION FUNCTIONS - Replace with actual API calls
  // ============================================================================

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(API_ENDPOINTS.EMPLOYEES.LIST);
      // const data = await response.json();
      // setEmployees(data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmployees(initialEmployees);
    } catch (error) {
      showSnackbar("Failed to fetch employees", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(API_ENDPOINTS.ROLES.LIST);
      // const data = await response.json();
      // setRoles(data);
      
      setRoles(DEFAULT_ROLES);
    } catch (error) {
      showSnackbar("Failed to fetch roles", "error");
    }
  };

  // Create/Update employee via API
  const saveEmployee = async (employeeData) => {
    try {
      const endpoint = employeeData.id 
        ? API_ENDPOINTS.EMPLOYEES.UPDATE.replace(':id', employeeData.id)
        : API_ENDPOINTS.EMPLOYEES.CREATE;
      
      const method = employeeData.id ? 'PUT' : 'POST';
      
      // TODO: Replace with actual API call
      // const response = await fetch(endpoint, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(employeeData),
      // });
      
      // if (response.ok) {
        showSnackbar(`Employee ${employeeData.id ? 'updated' : 'created'} successfully`, "success");
        fetchEmployees(); // Refresh list
        return true;
      // } else {
      //   throw new Error('Failed to save employee');
      // }
    } catch (error) {
      showSnackbar("Failed to save employee", "error");
      return false;
    }
  };

  // Delete employee via API
  const deleteEmployee = async (employeeId) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(API_ENDPOINTS.EMPLOYEES.DELETE.replace(':id', employeeId), {
      //   method: 'DELETE',
      // });
      
      // if (response.ok) {
        showSnackbar("Employee deleted successfully", "success");
        fetchEmployees(); // Refresh list
        return true;
      // } else {
      //   throw new Error('Failed to delete employee');
      // }
    } catch (error) {
      showSnackbar("Failed to delete employee", "error");
      return false;
    }
  };

  // Create/Update role via API
  const saveRole = async (roleData) => {
    try {
      const endpoint = roleData.id 
        ? API_ENDPOINTS.ROLES.UPDATE.replace(':id', roleData.id)
        : API_ENDPOINTS.ROLES.CREATE;
      
      const method = roleData.id ? 'PUT' : 'POST';
      
      // TODO: Replace with actual API call
      // const response = await fetch(endpoint, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(roleData),
      // });
      
      // if (response.ok) {
        showSnackbar(`Role ${roleData.id ? 'updated' : 'created'} successfully`, "success");
        fetchRoles(); // Refresh list
        return true;
      // } else {
      //   throw new Error('Failed to save role');
      // }
    } catch (error) {
      showSnackbar("Failed to save role", "error");
      return false;
    }
  };

  // Delete role via API
  const deleteRole = async (roleId) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(API_ENDPOINTS.ROLES.DELETE.replace(':id', roleId), {
      //   method: 'DELETE',
      // });
      
      // if (response.ok) {
        showSnackbar("Role deleted successfully", "success");
        fetchRoles(); // Refresh list
        return true;
      // } else {
      //   throw new Error('Failed to delete role');
      // }
    } catch (error) {
      showSnackbar("Failed to delete role", "error");
      return false;
    }
  };

  // Initialize data
  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  // Utility Functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = searchTerm === "" || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartments.length === 0 || 
      selectedDepartments.includes(employee.department);

    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(employee.status);

    const matchesRole = selectedRoles.length === 0 || 
      selectedRoles.includes(employee.role_name);

    return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
  });

  // Action Handlers
  const handleOpenMenu = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
    }
    handleCloseMenu();
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      employee_id: employee.employee_id,
      username: employee.username,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      designation: employee.designation,
      department: employee.department,
      position: employee.position,
      joining_date: employee.joining_date,
      status: employee.status,
      role_id: employee.role_id,
    });
    setOpenEmployeeModal(true);
    handleCloseMenu();
  };

  const handleSaveEmployee = async () => {
    const success = await saveEmployee({
      ...newEmployee,
      id: selectedEmployee?.id,
    });
    
    if (success) {
      setOpenEmployeeModal(false);
      setNewEmployee({
        employee_id: "",
        username: "",
        name: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        position: "",
        joining_date: "",
        status: "active",
        role_id: "",
      });
      setSelectedEmployee(null);
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setNewRole(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSaveRole = async () => {
    const roleData = {
      ...newRole,
      id: editingRole?.id,
    };
    
    const success = await saveRole(roleData);
    
    if (success) {
      setOpenRoleModal(false);
      setNewRole({
        name: "",
        description: "",
        permissions: [],
      });
      setEditingRole(null);
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setOpenRoleModal(true);
  };

  const handleDeleteRole = async (role) => {
    if (role.is_system) {
      showSnackbar("System roles cannot be deleted", "error");
      return;
    }

    // Check if any employees are using this role
    const employeesWithRole = employees.filter(emp => emp.role_id === role.id);
    if (employeesWithRole.length > 0) {
      showSnackbar(`Cannot delete this role as it is assigned to ${employeesWithRole.length} employee(s)`, "error");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      await deleteRole(role.id);
    }
  };

  // Employee Table Columns
  const employeeColumns = [
    { 
      field: "employee_id", 
      headerName: "Employee ID", 
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary[500] }}>
            {params.row.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "name", headerName: "Full Name", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { 
      field: "role_name", 
      headerName: "Role", 
      flex: 1,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color="primary" 
          variant="outlined"
          size="small"
          onClick={() => handleEditRole(roles[params.row.role_id])}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value] || "default"}
          variant="filled"
          size="small"
        />
      ),
    },
    {
      field: "last_login",
      headerName: "Last Login",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? new Date(params.value).toLocaleDateString() : 'Never'}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Tooltip title="Actions">
            <IconButton onClick={(event) => handleOpenMenu(event, params.row)} size="small">
              <MoreVert />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleEdit(params.row)}>
              <Edit sx={{ marginRight: 1 }} /> Edit Employee
            </MenuItem>
            <MenuItem onClick={() => handleEditRole(roles[params.row.role_id])}>
              <Security sx={{ marginRight: 1 }} /> Edit Role
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleDelete(params.row.id)} sx={{ color: "error.main" }}>
              <Delete sx={{ marginRight: 1 }} /> Delete Employee
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Employee & User Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchEmployees}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<Group />} label="Employees" />
        <Tab icon={<AdminPanelSettings />} label="Roles & Permissions" />
      </Tabs>

      {tabValue === 0 ? (
        <>
          {/* Search and Filters Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Search & Filters</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Search Employees"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, ID..."
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      multiple
                      value={selectedDepartments}
                      onChange={(e) => setSelectedDepartments(e.target.value)}
                      input={<OutlinedInput label="Department" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {allDepartments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      multiple
                      value={selectedStatuses}
                      onChange={(e) => setSelectedStatuses(e.target.value)}
                      input={<OutlinedInput label="Status" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip 
                              key={value} 
                              label={value} 
                              size="small"
                              color={statusColors[value]}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {allStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          <Chip 
                            label={status} 
                            size="small"
                            color={statusColors[status]}
                            sx={{ mr: 1 }}
                          />
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      multiple
                      value={selectedRoles}
                      onChange={(e) => setSelectedRoles(e.target.value)}
                      input={<OutlinedInput label="Role" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" color="primary" />
                          ))}
                        </Box>
                      )}
                    >
                      {allRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box display="flex" gap={1} height="100%" alignItems="flex-end">
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PersonAddIcon />}
                      onClick={() => setOpenEmployeeModal(true)}
                    >
                      Add Employee
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[ 
              { 
                label: "Total Employees", 
                value: filteredEmployees.length, 
                icon: <Group color="primary" />, 
                color: colors.primary[500] 
              },
              { 
                label: "Active", 
                value: filteredEmployees.filter((e) => e.status === "active").length, 
                icon: <CheckCircleIcon color="success" />, 
                color: colors.greenAccent[500] 
              },
              { 
                label: "Inactive", 
                value: filteredEmployees.filter((e) => e.status === "inactive").length, 
                icon: <CancelIcon color="warning" />, 
                color: colors.redAccent[500] 
              },
              { 
                label: "Administrators", 
                value: filteredEmployees.filter((e) => e.role_name.includes('Admin')).length, 
                icon: <AdminPanelSettings color="secondary" />, 
                color: colors.blueAccent[500] 
              },
            ].map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ backgroundColor: card.color, color: 'white' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {card.value}
                        </Typography>
                        <Typography variant="body2">
                          {card.label}
                        </Typography>
                      </Box>
                      <Box sx={{ opacity: 0.8 }}>
                        {card.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Employee Table */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Employees ({filteredEmployees.length})
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Security />}
                  onClick={() => setOpenRoleManager(true)}
                >
                  Manage Roles
                </Button>
              </Box>
              <Box sx={{ height: "60vh" }}>
                <DataGrid
                  rows={filteredEmployees}
                  columns={employeeColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  loading={loading}
                  sx={{
                    border: 0,
                    '& .MuiDataGrid-cell': {
                      borderBottom: `1px solid ${colors.grey[200]}`,
                    },
                    '& .MuiDataGrid-columnHeaders': { 
                      backgroundColor: colors.primary[50],
                      borderBottom: `2px solid ${colors.primary[200]}`,
                    },
                    '& .MuiDataGrid-footerContainer': { 
                      backgroundColor: colors.primary[50],
                      borderTop: `1px solid ${colors.grey[200]}`,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Roles Management Section */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">System Roles & Permissions</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => {
                    setEditingRole(null);
                    setNewRole({
                      name: "",
                      description: "",
                      permissions: [],
                    });
                    setOpenRoleModal(true);
                  }}
                >
                  New Role
                </Button>
              </Box>

              <Grid container spacing={2}>
                {Object.values(roles).map((role) => (
                  <Grid item xs={12} md={6} lg={4} key={role.id}>
                    <Card 
                      elevation={2}
                      sx={{ 
                        height: "100%",
                        border: role.is_system ? `2px solid ${colors.primary[500]}` : 'none'
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {role.name}
                              {role.is_system && (
                                <Chip 
                                  label="System" 
                                  size="small" 
                                  color="primary"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {role.description}
                            </Typography>
                          </Box>
                          <Box>
                            <Tooltip title="Edit Role">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditRole(role)}
                                color="primary"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {!role.is_system && (
                              <Tooltip title="Delete Role">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteRole(role)}
                                  color="error"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                        
                        <Typography variant="caption" display="block" gutterBottom fontWeight="bold">
                          Permissions ({role.permissions.length})
                        </Typography>
                        <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                          {Object.entries(BACKEND_PERMISSION_CATEGORIES).map(([category, { label, permissions }]) => {
                            const rolePermissions = permissions
                              .filter(p => role.permissions.includes(p.id))
                              .map(p => p.label);
                            
                            return rolePermissions.length > 0 ? (
                              <Box key={category} mb={1}>
                                <Typography variant="caption" fontWeight="bold" color="primary">
                                  {label}:
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  {rolePermissions.join(", ")}
                                </Typography>
                              </Box>
                            ) : null;
                          })}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modals and Dialogs */}
      {/* Employee Modal */}
      <Modal open={openEmployeeModal} onClose={() => setOpenEmployeeModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: "90%",
            maxWidth: 800,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" mb={3}>
            {selectedEmployee ? "Edit Employee" : "Create New Employee"}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={newEmployee.employee_id}
                onChange={(e) => setNewEmployee({ ...newEmployee, employee_id: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Designation"
                value={newEmployee.designation}
                onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Joining Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newEmployee.joining_date}
                onChange={(e) => setNewEmployee({ ...newEmployee, joining_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newEmployee.status}
                  onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                  label="Status"
                >
                  {allStatuses.map(status => (
                    <MenuItem key={status} value={status}>
                      <Chip 
                        label={status} 
                        size="small" 
                        color={statusColors[status]}
                        sx={{ mr: 1 }}
                      />
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newEmployee.role_id}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role_id: e.target.value })}
                  label="Role"
                >
                  {Object.values(roles).map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                onClick={handleSaveEmployee}
                disabled={!newEmployee.employee_id || !newEmployee.username || !newEmployee.name || !newEmployee.email}
              >
                {selectedEmployee ? "Update Employee" : "Create Employee"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Role Modal */}
      <Modal open={openRoleModal} onClose={() => setOpenRoleModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: "90%",
            maxWidth: 800,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" mb={3}>
            {editingRole ? "Edit Role" : "Create New Role"}
          </Typography>
          <Grid container spacing={3}>
            {!editingRole && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role Name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Permissions
              </Typography>
              <Divider />
              {Object.entries(BACKEND_PERMISSION_CATEGORIES).map(([category, { label, permissions }]) => (
                <Card key={category} sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      {label}
                    </Typography>
                    <Grid container spacing={1}>
                      {permissions.map(({ id, label, description }) => (
                        <Grid item xs={12} sm={6} md={4} key={id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={newRole.permissions.includes(id)}
                                onChange={() => handlePermissionToggle(id)}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2">{label}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {description}
                                </Typography>
                              </Box>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                onClick={handleSaveRole}
                disabled={!newRole.name}
              >
                {editingRole ? "Update Role" : "Create Role"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Role Management Dialog */}
      <Dialog 
        open={openRoleManager} 
        onClose={() => setOpenRoleManager(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Role Management</Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => {
                setEditingRole(null);
                setNewRole({
                  name: "",
                  description: "",
                  permissions: [],
                });
                setOpenRoleModal(true);
              }}
            >
              New Role
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {Object.values(roles).map((role) => (
              <Grid item xs={12} sm={6} md={4} key={role.id}>
                <Card elevation={2} sx={{ height: "100%" }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {role.name}
                          {role.is_system && (
                            <Chip 
                              label="System" 
                              size="small" 
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {role.description}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditRole(role)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        {!role.is_system && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteRole(role)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="caption" display="block" gutterBottom>
                      Permissions ({role.permissions.length})
                    </Typography>
                    <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
                      {Object.entries(BACKEND_PERMISSION_CATEGORIES).map(([category, { permissions }]) => {
                        const rolePermissions = permissions
                          .filter(p => role.permissions.includes(p.id))
                          .map(p => p.label);
                        
                        return rolePermissions.length > 0 ? (
                          <Box key={category} mb={1}>
                            <Typography variant="caption" fontWeight="bold">
                              {BACKEND_PERMISSION_CATEGORIES[category].label}:
                            </Typography>
                            <Typography variant="caption" display="block">
                              {rolePermissions.join(", ")}
                            </Typography>
                          </Box>
                        ) : null;
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleManager(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeUserManagement;