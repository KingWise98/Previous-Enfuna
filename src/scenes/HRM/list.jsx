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
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

// Permission categories and options
const PERMISSION_CATEGORIES = {
  products: {
    label: "Product Management",
    permissions: [
      { id: "view_products", label: "View Products" },
      { id: "add_products", label: "Add Products" },
      { id: "edit_products", label: "Edit Products" },
      { id: "delete_products", label: "Delete Products" },
      { id: "change_prices", label: "Change Prices" },
    ],
  },
  sales: {
    label: "Sales",
    permissions: [
      { id: "create_sales", label: "Create Sales" },
      { id: "view_sales", label: "View Sales" },
      { id: "edit_sales", label: "Edit Sales" },
      { id: "cancel_sales", label: "Cancel Sales" },
      { id: "apply_discounts", label: "Apply Discounts" },
    ],
  },
  customers: {
    label: "Customer Management",
    permissions: [
      { id: "view_customers", label: "View Customers" },
      { id: "add_customers", label: "Add Customers" },
      { id: "edit_customers", label: "Edit Customers" },
      { id: "delete_customers", label: "Delete Customers" },
    ],
  },
  reports: {
    label: "Reports",
    permissions: [
      { id: "view_sales_reports", label: "View Sales Reports" },
      { id: "view_inventory_reports", label: "View Inventory Reports" },
      { id: "export_reports", label: "Export Reports" },
    ],
  },
  system: {
    label: "System",
    permissions: [
      { id: "manage_users", label: "Manage Users" },
      { id: "manage_roles", label: "Manage Roles" },
      { id: "system_settings", label: "System Settings" },
    ],
  },
};

// Default roles with permissions
const DEFAULT_ROLES = {
  Admin: {
    description: "Full system access",
    permissions: Object.values(PERMISSION_CATEGORIES)
      .flatMap(category => category.permissions.map(p => p.id))
  },
  Manager: {
    description: "Can manage products, sales, and customers",
    permissions: [
      ...PERMISSION_CATEGORIES.products.permissions.map(p => p.id),
      ...PERMISSION_CATEGORIES.sales.permissions.map(p => p.id),
      ...PERMISSION_CATEGORIES.customers.permissions.map(p => p.id),
      ...PERMISSION_CATEGORIES.reports.permissions.map(p => p.id),
    ]
  },
  Cashier: {
    description: "Can process sales and view products",
    permissions: [
      "view_products",
      "create_sales",
      "apply_discounts",
      "view_customers",
      "add_customers",
    ]
  },
  Inventory: {
    description: "Can manage products and inventory",
    permissions: [
      "view_products",
      "add_products",
      "edit_products",
      "change_prices",
      "view_inventory_reports",
    ]
  },
  Sales: {
    description: "Can manage sales and customers",
    permissions: [
      "view_products",
      "create_sales",
      "view_sales",
      "apply_discounts",
      "view_customers",
      "add_customers",
      "edit_customers",
      "view_sales_reports",
    ]
  },
  Viewer: {
    description: "Can view reports and products",
    permissions: [
      "view_products",
      "view_sales",
      "view_customers",
      "view_sales_reports",
      "view_inventory_reports",
    ]
  }
};

// Initial Employee Data with Categories and Sub-categories
const initialEmployees = [
  {
    id: 1,
    employeeId: "EMP001",
    username: "alicej",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+256 123 456 789",
    designation: "Developer",
    category: "Tech",
    subCategory: "Frontend",
    joiningDate: "2024-02-15",
    status: "Active",
    role: "Admin",
  },
  {
    id: 2,
    employeeId: "EMP002",
    username: "williamst",
    name: "Tumuwebazi Williams",
    email: "bob@example.com",
    phone: "+256 987 654 321",
    designation: "Finance",
    category: "Finance",
    subCategory: "Accounting",
    joiningDate: "2023-09-10",
    status: "Inactive",
    role: "Manager",
  },
  {
    id: 3,
    employeeId: "EMP003",
    username: "victoriaq",
    name: "Queen Victoria",
    email: "Queen@example.com",
    phone: "+256 987 654 321",
    designation: "Banking",
    category: "Finance",
    subCategory: "Loans",
    joiningDate: "2024-09-10",
    status: "Suspended",
    role: "Cashier",
  },
  {
    id: 4,
    employeeId: "EMP004",
    username: "tulemekab",
    name: "Bob Tulemeka",
    email: "bobtu@example.com",
    phone: "+256 782 654 321",
    designation: "Marketing",
    category: "Sales",
    subCategory: "Digital",
    joiningDate: "2024-09-11",
    status: "Fired",
    role: "Sales",
  },
  {
    id: 5,
    employeeId: "EMP005",
    username: "tulemekag",
    name: "Garvin Tulemeka",
    email: "bobtu@example.com",
    phone: "+256 782 654 321",
    designation: "Marketing",
    category: "Sales",
    subCategory: "Branding",
    joiningDate: "2024-09-11",
    status: "Warning",
    role: "Viewer",
  },
];

const statusColors = {
  Active: "green",
  Inactive: "blue",
  Suspended: "orange",
  Fired: "red",
  Warning: "grey",
  "New Joiner": "purple",
};

const EmployeeUserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);
  
  // Load roles from localStorage or use default
  const [roles, setRoles] = useState(() => {
    const savedRoles = localStorage.getItem("userRoles");
    return savedRoles ? JSON.parse(savedRoles) : DEFAULT_ROLES;
  });

  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openRoleManager, setOpenRoleManager] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    username: "",
    name: "",
    email: "",
    phone: "",
    designation: "",
    category: "",
    subCategory: "",
    joiningDate: "",
    status: "Active",
    role: "Cashier",
  });
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [editingRole, setEditingRole] = useState(null);

  // Extract unique categories, sub-categories, and statuses for filters
  const allCategories = [...new Set(employees.map(emp => emp.category))];
  const allSubCategories = [...new Set(employees.map(emp => emp.subCategory))];
  const allStatuses = [...new Set(employees.map(emp => emp.status))];

  // Save roles to localStorage when they change
  useEffect(() => {
    localStorage.setItem("userRoles", JSON.stringify(roles));
  }, [roles]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter((employee) => {
    // Text search across multiple fields
    const matchesSearch = searchTerm === "" || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(employee.category);

    // Sub-category filter
    const matchesSubCategory = selectedSubCategories.length === 0 || 
      selectedSubCategories.includes(employee.subCategory);

    // Status filter
    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(employee.status);

    return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
  });

  // Handle Open Action Menu
  const handleOpenMenu = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  // Handle Close Action Menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  // Handle Delete Employee
  const handleDelete = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
    handleCloseMenu();
  };

  // Handle Edit Employee
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      employeeId: employee.employeeId,
      username: employee.username,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      designation: employee.designation,
      category: employee.category,
      subCategory: employee.subCategory,
      joiningDate: employee.joiningDate,
      status: employee.status,
      role: employee.role,
    });
    setOpenEmployeeModal(true);
    handleCloseMenu();
  };

  // Handle Create/Update Employee
  const handleSaveEmployee = () => {
    if (selectedEmployee) {
      // Update existing employee
      setEmployees(employees.map(employee => 
        employee.id === selectedEmployee.id ? { ...employee, ...newEmployee } : employee
      ));
    } else {
      // Create new employee
      setEmployees([
        ...employees,
        {
          id: employees.length + 1,
          ...newEmployee,
        },
      ]);
    }
    setOpenEmployeeModal(false);
    setNewEmployee({
      employeeId: "",
      username: "",
      name: "",
      email: "",
      phone: "",
      designation: "",
      category: "",
      subCategory: "",
      joiningDate: "",
      status: "Active",
      role: "Cashier",
    });
    setSelectedEmployee(null);
  };

  // Handle Role Permission Toggle
  const handlePermissionToggle = (permissionId) => {
    setNewRole(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
  };

  // Handle Create/Update Role
  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(prev => ({
        ...prev,
        [editingRole]: { ...newRole }
      }));
    } else {
      setRoles(prev => ({
        ...prev,
        [newRole.name]: { 
          description: newRole.description,
          permissions: newRole.permissions 
        }
      }));
    }
    setOpenRoleModal(false);
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    });
    setEditingRole(null);
  };

  // Handle Edit Role
  const handleEditRole = (roleName) => {
    setEditingRole(roleName);
    setNewRole({
      name: roleName,
      description: roles[roleName].description,
      permissions: roles[roleName].permissions,
    });
    setOpenRoleModal(true);
  };

  // Handle Delete Role
  const handleDeleteRole = (roleName) => {
    // Check if any employees are using this role
    const employeesWithRole = employees.filter(emp => emp.role === roleName);
    if (employeesWithRole.length > 0) {
      alert(`Cannot delete this role as it is assigned to ${employeesWithRole.length} employee(s).`);
      return;
    }
    
    const { [roleName]: _, ...remainingRoles } = roles;
    setRoles(remainingRoles);
  };

  // Check if permission is included in role
  const hasPermission = (role, permissionId) => {
    return roles[role]?.permissions?.includes(permissionId);
  };

  // Employee Table Columns
  const employeeColumns = [
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "name", headerName: "Full Name", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "phone", headerName: "Phone Number", flex: 1.2 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "subCategory", headerName: "Sub-category", flex: 1 },
    { field: "joiningDate", headerName: "Joining Date", flex: 1 },
    { 
      field: "role", 
      headerName: "Role", 
      flex: 1,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color="primary" 
          size="small"
          onClick={() => handleEditRole(params.value)}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{
            backgroundColor: statusColors[params.value] || "grey",
            color: "white",
            textTransform: "none",
            "&:hover": { backgroundColor: statusColors[params.value] || "grey" },
          }}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleOpenMenu(event, params.row)}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleEdit(params.row)}>
              <Edit sx={{ marginRight: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleDelete(params.row.id)} sx={{ color: "red" }}>
              <Delete sx={{ marginRight: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Employee & User Management
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Employees" />
        <Tab label="Roles & Permissions" />
      </Tabs>

      {tabValue === 0 ? (
        <>
          {/* Search Filters */}
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            {/* General Search */}
            <TextField
              label="Search Employees"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Row */}
            <Box display="flex" gap={2} flexWrap="wrap">
              {/* Category Filter */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={selectedCategories}
                  onChange={(e) => setSelectedCategories(e.target.value)}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {allCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sub-category Filter */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Sub-categories</InputLabel>
                <Select
                  multiple
                  value={selectedSubCategories}
                  onChange={(e) => setSelectedSubCategories(e.target.value)}
                  input={<OutlinedInput label="Sub-categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {allSubCategories.map((subCategory) => (
                    <MenuItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status Filter */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
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
                          sx={{ 
                            backgroundColor: statusColors[value] || 'grey',
                            color: 'white'
                          }} 
                        />
                      ))}
                    </Box>
                  )}
                >
                  {allStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      <Box sx={{ 
                        width: 14, 
                        height: 14, 
                        backgroundColor: statusColors[status] || 'grey',
                        mr: 1,
                        borderRadius: '3px'
                      }} />
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Button Cards */}
          <Box display="flex" gap={2} mt={3}>
            {[ 
              { label: "Total Employees", value: filteredEmployees.length, icon: <PersonIcon />, color: "#E0E0E0" },
              { label: "Active", value: filteredEmployees.filter((e) => e.status === "Active").length, icon: <CheckCircleIcon />, color: "#E0E0E0" },
              { label: "Inactive", value: filteredEmployees.filter((e) => e.status === "Inactive").length, icon: <CancelIcon />, color: "#E0E0E0" },
              { label: "New Joiners", value: filteredEmployees.filter((e) => e.status === "New Joiner").length, icon: <PersonAddIcon />, color: "#E0E0E0" },
            ].map((card, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "#F9F6EE",
                  p: 3,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  boxShadow: "none",
                }}
              >
                <Box sx={{ color: "black" }}>{card.icon}</Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: "black" }}>
                  {card.value}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "black" }}>
                  {card.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "purple", color: "white" }}
              startIcon={<PersonAddIcon />}
              onClick={() => setOpenEmployeeModal(true)}
            >
              Add Employee
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Security />}
              onClick={() => setOpenRoleManager(true)}
            >
              Manage Roles
            </Button>
          </Box>

          {/* Employee Table */}
          <Box mt={4} sx={{ height: "60vh" }}>
            <DataGrid
              rows={filteredEmployees}
              columns={employeeColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              sx={{
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
                "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
              }}
            />
          </Box>
        </>
      ) : (
        <>
          {/* Roles Management Section */}
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              sx={{ backgroundColor: "purple", color: "white" }}
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

          <Box>
            <Grid container spacing={2}>
              {Object.entries(roles).map(([roleName, { description, permissions }]) => (
                <Grid item xs={12} sm={6} md={4} key={roleName}>
                  <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {roleName}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditRole(roleName)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        {!Object.keys(DEFAULT_ROLES).includes(roleName) && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteRole(roleName)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {description}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      Permissions:
                    </Typography>
                    <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
                      {Object.entries(PERMISSION_CATEGORIES).map(([category, { permissions: categoryPermissions }]) => {
                        const rolePermissions = categoryPermissions
                          .filter(p => permissions.includes(p.id))
                          .map(p => p.label);
                        
                        return rolePermissions.length > 0 ? (
                          <Box key={category} mb={1}>
                            <Typography variant="caption" fontWeight="bold">
                              {PERMISSION_CATEGORIES[category].label}:
                            </Typography>
                            <Typography variant="caption" display="block">
                              {rolePermissions.join(", ")}
                            </Typography>
                          </Box>
                        ) : null;
                      })}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}

      {/* Modal for Creating/Editing Employee */}
      <Modal open={openEmployeeModal} onClose={() => setOpenEmployeeModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: 24,
            width: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2}>
            {selectedEmployee ? "Edit Employee" : "Create New Employee"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={newEmployee.employeeId}
                onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                value={newEmployee.designation}
                onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={newEmployee.category}
                onChange={(e) => setNewEmployee({ ...newEmployee, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sub-category"
                value={newEmployee.subCategory}
                onChange={(e) => setNewEmployee({ ...newEmployee, subCategory: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Joining Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newEmployee.joiningDate}
                onChange={(e) => setNewEmployee({ ...newEmployee, joiningDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newEmployee.status}
                  onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                >
                  {allStatuses.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                >
                  {Object.keys(roles).map(role => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button 
                fullWidth 
                variant="contained" 
                sx={{ backgroundColor: "purple" }} 
                onClick={handleSaveEmployee}
              >
                {selectedEmployee ? "Update Employee" : "Create Employee"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Modal for Creating/Editing Role */}
      <Modal open={openRoleModal} onClose={() => setOpenRoleModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: 24,
            width: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2}>
            {editingRole ? "Edit Role" : "Create New Role"}
          </Typography>
          <Grid container spacing={2}>
            {!editingRole && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role Name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Permissions
              </Typography>
              <Divider />
              {Object.entries(PERMISSION_CATEGORIES).map(([category, { label, permissions }]) => (
                <Box key={category} mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    {label}
                  </Typography>
                  <Grid container spacing={1}>
                    {permissions.map(({ id, label }) => (
                      <Grid item xs={6} key={id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={newRole.permissions.includes(id)}
                              onChange={() => handlePermissionToggle(id)}
                            />
                          }
                          label={label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button 
                fullWidth 
                variant="contained" 
                sx={{ backgroundColor: "purple" }} 
                onClick={handleSaveRole}
                disabled={!newRole.name && !editingRole}
              >
                {editingRole ? "Update Role" : "Create Role"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Dialog for Role Management */}
      <Dialog 
        open={openRoleManager} 
        onClose={() => setOpenRoleManager(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Role Management</Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              sx={{ backgroundColor: "purple", color: "white" }}
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
            {Object.entries(roles).map(([roleName, { description, permissions }]) => (
              <Grid item xs={12} sm={6} md={4} key={roleName}>
                <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {roleName}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleEditRole(roleName)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      {!Object.keys(DEFAULT_ROLES).includes(roleName) && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteRole(roleName)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {description}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Permissions:
                  </Typography>
                  <Box sx={{ maxHeight: "150px", overflowY: "auto" }}>
                    {Object.entries(PERMISSION_CATEGORIES).map(([category, { permissions: categoryPermissions }]) => {
                      const rolePermissions = categoryPermissions
                        .filter(p => permissions.includes(p.id))
                        .map(p => p.label);
                      
                      return rolePermissions.length > 0 ? (
                        <Box key={category} mb={1}>
                          <Typography variant="caption" fontWeight="bold">
                            {PERMISSION_CATEGORIES[category].label}:
                          </Typography>
                          <Typography variant="caption" display="block">
                            {rolePermissions.join(", ")}
                          </Typography>
                        </Box>
                      ) : null;
                    })}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleManager(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeUserManagement;