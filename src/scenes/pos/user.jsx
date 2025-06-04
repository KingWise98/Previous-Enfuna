import { useState, useEffect } from "react";
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

const UserPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Load roles from localStorage or use default
  const [roles, setRoles] = useState(() => {
    const savedRoles = localStorage.getItem("userRoles");
    return savedRoles ? JSON.parse(savedRoles) : DEFAULT_ROLES;
  });

  // Dummy data for users
  const initialUsers = [
    { id: 1, username: "johndoe", name: "John Doe", role: "Admin", email: "johndoe@example.com" },
    { id: 2, username: "janedoe", name: "Jane Doe", role: "Manager", email: "janedoe@example.com" },
    { id: 3, username: "bobsmith", name: "Bob Smith", role: "Cashier", email: "bobsmith@example.com" },
    { id: 4, username: "mikecashier", name: "Mike Cashier", role: "Cashier", email: "mikecashier@example.com" },
    { id: 5, username: "sarahsales", name: "Sarah Sales", role: "Sales", email: "sarahsales@example.com" },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openRoleManager, setOpenRoleManager] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    role: "Cashier",
    email: "",
  });
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [editingRole, setEditingRole] = useState(null);

  // Save roles to localStorage when they change
  useEffect(() => {
    localStorage.setItem("userRoles", JSON.stringify(roles));
  }, [roles]);

  // Handle Open Action Menu
  const handleOpenMenu = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  // Handle Close Action Menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // Handle Delete User
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    handleCloseMenu();
  };

  // Handle Edit User
  const handleEdit = (user) => {
    setSelectedUser(user);
    setNewUser({
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
    });
    setOpenUserModal(true);
    handleCloseMenu();
  };

  // Handle Create/Update User
  const handleSaveUser = () => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...newUser } : user
      ));
    } else {
      // Create new user
      setUsers([
        ...users,
        {
          id: users.length + 1,
          username: newUser.username,
          name: newUser.name,
          role: newUser.role,
          email: newUser.email,
        },
      ]);
    }
    setOpenUserModal(false);
    setNewUser({
      username: "",
      name: "",
      role: "Cashier",
      email: "",
    });
    setSelectedUser(null);
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
    const { [roleName]: _, ...remainingRoles } = roles;
    setRoles(remainingRoles);
  };

  // Check if permission is included in role
  const hasPermission = (role, permissionId) => {
    return roles[role]?.permissions?.includes(permissionId);
  };

  // Table Columns
  const columns = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "name", headerName: "Full Name", flex: 1.5 },
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
    { field: "email", headerName: "Email", flex: 1.5 },
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
        User Management
      </Typography>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            sx={{ backgroundColor: "purple", color: "white" }} 
            onClick={() => setOpenUserModal(true)}
          >
            Create User
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Security />}
            onClick={() => setOpenRoleManager(true)}
          >
            Manage Roles
          </Button>
        </Stack>
      </Box>

      {/* User Table */}
      <Box sx={{ height: "60vh" }}>
        <DataGrid
          rows={users}
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        />
      </Box>

      {/* Modal for Creating/Editing User */}
      <Modal open={openUserModal} onClose={() => setOpenUserModal(false)}>
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
            width: "400px",
          }}
        >
          <Typography variant="h6" mb={2}>
            {selectedUser ? "Edit User" : "Create New User"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role"
                select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                SelectProps={{
                  native: true,
                }}
              >
                {Object.keys(roles).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button 
                fullWidth 
                variant="contained" 
                sx={{ backgroundColor: "purple" }} 
                onClick={handleSaveUser}
              >
                {selectedUser ? "Update User" : "Create User"}
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

export default UserPage;