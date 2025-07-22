import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Menu,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PeopleIcon from "@mui/icons-material/People";
import {
  Twitter,
  Facebook,
  LinkedIn,
  Instagram,
  Public,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";

// Dummy Lead Data
const initialLeads = [
  {
    id: 1,
    createdDate: "2024-02-20",
    leadName: "John Doe",
    companyName: "Tech Innovators",
    phone: "+256 123 456 789",
    email: "john@tech.com",
    owner: "Alice Smith",
    status: "Approved",
    stage: "Active",
    source: "LinkedIn",
    score: 85,
  },
  {
    id: 2,
    createdDate: "2024-02-18",
    leadName: "Jane Doe",
    companyName: "Future Solutions",
    phone: "+256 987 654 321",
    email: "jane@future.com",
    owner: "Bob Williams",
    status: "Pending",
    stage: "Not Connected",
    source: "Website",
    score: 35,
  },
  {
    id: 3,
    createdDate: "2024-02-15",
    leadName: "Michael Scott",
    companyName: "Paper Company",
    phone: "+256 555 123 789",
    email: "michael@paper.com",
    owner: "David Johnson",
    status: "Rejected",
    stage: "Lost",
    source: "Facebook",
    score: 15,
  },
  {
    id: 4,
    createdDate: "2024-03-15",
    leadName: "Alo Florence",
    companyName: "Magic Company",
    phone: "+256 555 23 789",
    email: "alobusiness@paper.com",
    owner: "Billy Chamderlain",
    status: "Contacted",
    stage: "Closed",
    source: "Twitter",
    score: 65,
  },
  {
    id: 5,
    createdDate: "2024-03-18",
    leadName: "Sarah Connor",
    companyName: "Cyberdyne Systems",
    phone: "+256 789 456 123",
    email: "sarah@cyberdyne.com",
    owner: "Alice Smith",
    status: "Approved",
    stage: "Completed",
    source: "Instagram",
    score: 95,
  },
];

// Status Button Colors
const statusColors = {
  Approved: "green",
  Pending: "orange",
  Rejected: "red",
  Contacted: "lightblue",
};

// Stage Button Colors
const stageColors = {
  Completed: "#4caf50", // green
  Lost: "#9e9e9e", // grey
  "Not Connected": "#9c27b0", // purple
  Closed: "#f44336", // red
  Active: "#2196f3", // blue
};

// Source Icons
const sourceIcons = {
  Twitter: <Twitter />,
  Facebook: <Facebook />,
  LinkedIn: <LinkedIn />,
  Instagram: <Instagram />,
  Website: <Public />,
};

// Score Progress Colors
const getScoreColor = (score) => {
  if (score <= 20) return "#f44336"; // red
  if (score <= 79) return "#ff9800"; // orange
  return "#4caf50"; // green
};

// Summary Data
const getSummaryData = (leads) => [
  { label: "Total Leads", value: leads.length, icon: <PeopleIcon /> },
  {
    label: "Total Companies",
    value: new Set(leads.map((lead) => lead.companyName)).size,
    icon: <BusinessIcon />,
  },
  {
    label: "Approved",
    value: leads.filter((lead) => lead.status === "Approved").length,
    icon: <CheckCircleIcon />,
  },
  {
    label: "Rejected",
    value: leads.filter((lead) => lead.status === "Rejected").length,
    icon: <CancelIcon />,
  },
];

const LeadsPage = () => {
  const theme = useTheme();
  const [leads, setLeads] = useState(initialLeads);
  const [openAddLead, setOpenAddLead] = useState(false);
  const [newLead, setNewLead] = useState({
    leadName: "",
    companyName: "",
    phone: "",
    email: "",
    owner: "",
    status: "Pending",
    stage: "Active",
    source: "Website",
    score: 50,
  });

  // Menu State
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  // Handle Action Menu
  const handleMenuOpen = (event, id) => {
    setMenuAnchor(event.currentTarget);
    setSelectedLeadId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedLeadId(null);
  };

  // Handle Actions
  const handleHideLead = () => {
    console.log("Hiding Lead ID:", selectedLeadId);
    handleMenuClose();
  };

  const handleEditLead = () => {
    console.log("Editing Lead ID:", selectedLeadId);
    handleMenuClose();
  };

  const handleDeleteLead = () => {
    setLeads(leads.filter((lead) => lead.id !== selectedLeadId));
    handleMenuClose();
  };

  // Handle Adding New Lead
  const handleAddLead = () => {
    if (!newLead.leadName || !newLead.companyName || !newLead.phone || !newLead.email || !newLead.owner) {
      alert("Please fill in all required fields.");
      return;
    }

    const newEntry = {
      id: leads.length + 1,
      createdDate: new Date().toISOString().split("T")[0],
      ...newLead,
    };
    setLeads([...leads, newEntry]);
    setOpenAddLead(false);
    setNewLead({
      leadName: "",
      companyName: "",
      phone: "",
      email: "",
      owner: "",
      status: "Pending",
      stage: "Active",
      source: "Website",
      score: 50,
    });
  };

  // Table Columns
  const columns = React.useMemo(
    () => [
      { field: "createdDate", headerName: "Created Date", flex: 1 },
      { field: "leadName", headerName: "Lead Name", flex: 1.5 },
      { field: "companyName", headerName: "Company Name", flex: 1.5 },
      { field: "phone", headerName: "Phone Number", flex: 1 },
      { field: "email", headerName: "Email", flex: 1.5 },
      { field: "owner", headerName: "Owner", flex: 1 },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        editable: true,
        type: "singleSelect",
        valueOptions: ["Approved", "Pending", "Rejected", "Contacted"],
        renderCell: (params) => (
          <Button
            variant="contained"
            sx={{
              backgroundColor: statusColors[params.value],
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: statusColors[params.value] },
            }}
          >
            {params.value}
          </Button>
        ),
      },
      {
        field: "stage",
        headerName: "Stage",
        flex: 1,
        renderCell: (params) => (
          <Button
            variant="contained"
            sx={{
              backgroundColor: stageColors[params.value],
              color: "white",
              textTransform: "none",
              "&:hover": { backgroundColor: stageColors[params.value] },
            }}
          >
            {params.value}
          </Button>
        ),
      },
      {
        field: "source",
        headerName: "Source",
        flex: 1,
        renderCell: (params) => (
          <IconButton sx={{ color: theme.palette.primary.main }}>
            {sourceIcons[params.value]}
          </IconButton>
        ),
      },
      {
        field: "score",
        headerName: "Score",
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={params.value}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: getScoreColor(params.value),
                  },
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {`${params.value}%`}
            </Typography>
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.5,
        renderCell: (params) => (
          <>
            <IconButton onClick={(event) => handleMenuOpen(event, params.row.id)}>
              <MoreVertIcon />
            </IconButton>
          </>
        ),
      },
    ],
    []
  );

  return (
    <Box m="20px">
      {/* Title */}
      <Typography variant="h4" fontWeight="bold">
        Leads Management
      </Typography>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mt={3}>
        {getSummaryData(leads).map((card, index) => (
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
            }}
          >
            {card.icon}
            <Typography variant="h5" fontWeight="bold">
              {card.value}
            </Typography>
            <Typography variant="subtitle2">{card.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Add Lead Button */}
      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          sx={{ backgroundColor: "purple", color: "white" }}
          startIcon={<AddIcon />}
          onClick={() => setOpenAddLead(true)}
        >
          Add Lead
        </Button>
      </Box>

      {/* Leads Table */}
      <Box mt={4} sx={{ height: "60vh" }}>
        <DataGrid rows={leads} columns={columns} pageSize={5} />
      </Box>

      {/* Add Lead Dialog */}
      <Dialog open={openAddLead} onClose={() => setOpenAddLead(false)}>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <TextField
            label="Lead Name"
            fullWidth
            margin="dense"
            value={newLead.leadName}
            onChange={(e) => setNewLead({ ...newLead, leadName: e.target.value })}
          />
          <TextField
            label="Company Name"
            fullWidth
            margin="dense"
            value={newLead.companyName}
            onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="dense"
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
          />
          <TextField
            label="Owner"
            fullWidth
            margin="dense"
            value={newLead.owner}
            onChange={(e) => setNewLead({ ...newLead, owner: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newLead.status}
              label="Status"
              onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
            >
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Stage</InputLabel>
            <Select
              value={newLead.stage}
              label="Stage"
              onChange={(e) => setNewLead({ ...newLead, stage: e.target.value })}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
              <MenuItem value="Not Connected">Not Connected</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Source</InputLabel>
            <Select
              value={newLead.source}
              label="Source"
              onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
            >
              <MenuItem value="Twitter">Twitter</MenuItem>
              <MenuItem value="Facebook">Facebook</MenuItem>
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Instagram">Instagram</MenuItem>
              <MenuItem value="Website">Website</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Score (0-100)"
            type="number"
            fullWidth
            margin="dense"
            inputProps={{ min: 0, max: 100 }}
            value={newLead.score}
            onChange={(e) => setNewLead({ ...newLead, score: parseInt(e.target.value) || 0 })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddLead(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddLead}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleHideLead}>Hide</MenuItem>
        <MenuItem onClick={handleEditLead}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteLead}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default LeadsPage;