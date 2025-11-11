import { useState } from "react";
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
} from "@mui/material";
import { MoreVert, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const RolesPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy data for roles
  const initialRoles = [
    { id: 1, roleName: "Admin", description: "Has full access to all features" },
    { id: 2, roleName: "User", description: "Can view and interact with content" },
    { id: 3, roleName: "Moderator", description: "Can moderate content" },
    { id: 4, roleName: "Cashier", description: "Handles transactions and payments" },
    { id: 5, roleName: "Sales", description: "Handles sales and customer interactions" },
  ];

  const [roles, setRoles] = useState(initialRoles);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newRole, setNewRole] = useState({
    roleName: "",
    description: "",
  });

  // Handle Open Action Menu
  const handleOpenMenu = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  // Handle Close Action Menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  // Handle Delete Role
  const handleDelete = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
    handleCloseMenu();
  };

  // Handle Edit Role (Mock action)
  const handleEdit = (id) => {
    alert(`Editing role with ID ${id}`);
    handleCloseMenu();
  };

  // Handle Create Role Form Submission
  const handleCreateRole = () => {
    setRoles([
      ...roles,
      {
        id: roles.length + 1,
        roleName: newRole.roleName,
        description: newRole.description,
      },
    ]);
    setOpenModal(false); // Close modal after adding role
    setNewRole({
      roleName: "",
      description: "",
    }); // Reset form fields
  };

  // Table Columns
  const columns = [
    { field: "roleName", headerName: "Role Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
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
            <MenuItem onClick={() => handleEdit(selectedRole?.id)}>
              <Edit sx={{ marginRight: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleDelete(selectedRole?.id)} sx={{ color: "red" }}>
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
        Role Management
      </Typography>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button variant="contained" sx={{ backgroundColor: "purple", color: "white" }} onClick={() => setOpenModal(true)}>
          Create Role
        </Button>
      </Box>

      {/* Roles Table */}
      <Box sx={{ height: "60vh" }}>
        <DataGrid
          rows={roles}
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        />
      </Box>

      {/* Modal for Creating Role */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
            Create New Role
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Name"
                value={newRole.roleName}
                onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button fullWidth variant="contained" sx={{ backgroundColor: "purple" }} onClick={handleCreateRole}>
                Create Role
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default RolesPage;
