import React, { useState } from "react";
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

const SalesCommissionAgentPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy data for sales agents and commissions
  const initialAgents = [
    {
      id: 1,
      agentName: "John Doe",
      salesAmount: 5000,
      commissionPercentage: 5,
      commissionEarned: 250,
      status: "Active",
    },
    {
      id: 2,
      agentName: "Jane Smith",
      salesAmount: 7000,
      commissionPercentage: 6,
      commissionEarned: 420,
      status: "Active",
    },
    {
      id: 3,
      agentName: "Emily Johnson",
      salesAmount: 3000,
      commissionPercentage: 4,
      commissionEarned: 120,
      status: "Inactive",
    },
  ];

  const [agents, setAgents] = useState(initialAgents);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    agentName: "",
    salesAmount: "",
    commissionPercentage: "",
    status: "Active",
  });

  // Handle Open Action Menu
  const handleOpenMenu = (event, agent) => {
    setAnchorEl(event.currentTarget);
    setSelectedAgent(agent);
  };

  // Handle Close Action Menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAgent(null);
  };

  // Handle Delete Agent
  const handleDelete = (id) => {
    setAgents(agents.filter((agent) => agent.id !== id));
    handleCloseMenu();
  };

  // Handle Edit Agent (Mock action)
  const handleEdit = (id) => {
    alert(`Editing agent with ID ${id}`);
    handleCloseMenu();
  };

  // Handle Create Agent Form Submission
  const handleCreateAgent = () => {
    setAgents([
      ...agents,
      {
        id: agents.length + 1,
        agentName: newAgent.agentName,
        salesAmount: parseFloat(newAgent.salesAmount),
        commissionPercentage: parseFloat(newAgent.commissionPercentage),
        commissionEarned: (parseFloat(newAgent.salesAmount) * parseFloat(newAgent.commissionPercentage)) / 100,
        status: newAgent.status,
      },
    ]);
    setOpenModal(false); // Close modal after adding agent
    setNewAgent({
      agentName: "",
      salesAmount: "",
      commissionPercentage: "",
      status: "Active",
    }); // Reset form fields
  };

  // Table Columns
  const columns = [
    { field: "agentName", headerName: "Agent Name", flex: 1 },
    { field: "salesAmount", headerName: "Sales Amount", flex: 1 },
    { field: "commissionPercentage", headerName: "Commission %", flex: 1 },
    { field: "commissionEarned", headerName: "Commission Earned", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
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
            <MenuItem onClick={() => handleEdit(selectedAgent?.id)}>
              <Edit sx={{ marginRight: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleDelete(selectedAgent?.id)} sx={{ color: "red" }}>
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
        Sales Commission Agent Management
      </Typography>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button variant="contained" sx={{ backgroundColor: "purple", color: "white" }} onClick={() => setOpenModal(true)}>
          Add Sales Agent
        </Button>
      </Box>

      {/* Sales Agents Table */}
      <Box sx={{ height: "60vh" }}>
        <DataGrid
          rows={agents}
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        />
      </Box>

      {/* Modal for Adding Sales Agent */}
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
            Add New Sales Agent
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agent Name"
                value={newAgent.agentName}
                onChange={(e) => setNewAgent({ ...newAgent, agentName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sales Amount"
                value={newAgent.salesAmount}
                onChange={(e) => setNewAgent({ ...newAgent, salesAmount: e.target.value })}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Commission Percentage"
                value={newAgent.commissionPercentage}
                onChange={(e) => setNewAgent({ ...newAgent, commissionPercentage: e.target.value })}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Status"
                value={newAgent.status}
                onChange={(e) => setNewAgent({ ...newAgent, status: e.target.value })}
                select
                SelectProps={{
                  native: true,
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </TextField>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button fullWidth variant="contained" sx={{ backgroundColor: "purple" }} onClick={handleCreateAgent}>
                Add Agent
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default SalesCommissionAgentPage;
