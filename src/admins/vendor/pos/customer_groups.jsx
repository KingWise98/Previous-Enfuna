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
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MoreVert, Edit, VisibilityOff, Delete, CloudUpload, GetApp, PictureAsPdf } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const CustomerGroupsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy Data for Customer Groups
  const initialGroups = [
    { id: 1, name: "Premium Clients", description: "High value clients", customerCount: 10 },
    { id: 2, name: "Regular Clients", description: "Clients with recurring purchases", customerCount: 30 },
    { id: 3, name: "Prospects", description: "Potential customers", customerCount: 50 },
  ];

  const [groups, setGroups] = useState(initialGroups);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", customerCount: 0 });

  // Handle Open Action Menu
  const handleOpenMenu = (event, group) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  // Handle Close Action Menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  // Handle Delete
  const handleDelete = (id) => {
    setGroups(groups.filter((group) => group.id !== id));
    handleCloseMenu();
  };

  // Handle Hide (Mock action)
  const handleHide = (id) => {
    alert(`Group with ID ${id} is now hidden`);
    handleCloseMenu();
  };

  // Handle Edit (Mock action)
  const handleEdit = (id) => {
    alert(`Editing group with ID ${id}`);
    handleCloseMenu();
  };

  // Handle Export to PDF (Mock Action)
  const handleDownloadPDF = () => {
    alert("Downloading customer groups list as PDF...");
  };

  // Handle Export to Excel (Mock Action)
  const handleDownloadExcel = () => {
    alert("Downloading customer groups list as Excel...");
  };

  // Handle Create Group Form Submission
  const handleCreateGroup = () => {
    setGroups([
      ...groups,
      {
        id: groups.length + 1,
        name: newGroup.name,
        description: newGroup.description,
        customerCount: newGroup.customerCount,
      },
    ]);
    setOpenModal(false); // Close modal after adding group
    setNewGroup({ name: "", description: "", customerCount: 0 }); // Reset form fields
  };

  // Table Columns
  const columns = [
    { field: "name", headerName: "Group Name", flex: 1.5 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "customerCount", headerName: "Customer Count", flex: 1 },
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
            <MenuItem onClick={() => handleEdit(selectedGroup?.id)}>
              <Edit sx={{ marginRight: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleHide(selectedGroup?.id)}>
              <VisibilityOff sx={{ marginRight: 1 }} /> Hide
            </MenuItem>
            <MenuItem onClick={() => handleDelete(selectedGroup?.id)} sx={{ color: "red" }}>
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
        Customer Groups
      </Typography>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button variant="contained" sx={{ backgroundColor: "purple", color: "white" }} onClick={() => setOpenModal(true)}>
          Create Group
        </Button>
        <Box display="flex" gap={2}>
          <Button variant="contained" sx={{ backgroundColor: "green", color: "white" }} startIcon={<CloudUpload />}>
            Import
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "red", color: "white" }} startIcon={<PictureAsPdf />} onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "green", color: "white" }} startIcon={<GetApp />} onClick={handleDownloadExcel}>
            Download Excel
          </Button>
        </Box>
      </Box>

      {/* Customer Group Table */}
      <Box sx={{ height: "60vh" }}>
        <DataGrid
          rows={groups}
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        />
      </Box>

      {/* Modal for Creating Group */}
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
            Create New Customer Group
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Count"
                type="number"
                value={newGroup.customerCount}
                onChange={(e) => setNewGroup({ ...newGroup, customerCount: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button fullWidth variant="contained" sx={{ backgroundColor: "purple" }} onClick={handleCreateGroup}>
                Create Group
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomerGroupsPage;
