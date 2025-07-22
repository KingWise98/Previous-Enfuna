import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
  Twitter,
  Facebook,
  LinkedIn,
  Instagram,
  Public,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";

// Initial Deals Data
const initialDeals = [
  {
    id: 1,
    createdDate: "2024-02-20",
    dealName: "Software Licensing",
    stage: "Active",
    dealAmount: "$50,000",
    value: "High",
    tags: "Tech",
    expectedEndDate: "2024-06-01",
    closeDate: "2024-05-15",
    duration: "3 months",
    owner: "Alice Smith",
    phoneNumber: "+256 123 456 789",
    chances: "80%",
    status: "Open",
    source: "Twitter",
  },
  {
    id: 2,
    createdDate: "2024-02-18",
    dealName: "Infrastructure Upgrade",
    stage: "Planned",
    dealAmount: "$150,000",
    value: "Medium",
    tags: "Enterprise",
    expectedEndDate: "2024-09-10",
    closeDate: "2024-08-20",
    duration: "6 months",
    owner: "Bob Williams",
    phoneNumber: "+256 987 654 321",
    chances: "60%",
    status: "Lost",
    source: "LinkedIn",
  },
  {
    id: 3,
    createdDate: "2024-02-15",
    dealName: "Cloud Migration",
    stage: "Completed",
    dealAmount: "$200,000",
    value: "High",
    tags: "Cloud",
    expectedEndDate: "2024-03-05",
    closeDate: "2024-03-01",
    duration: "1 month",
    owner: "David Johnson",
    phoneNumber: "+256 555 123 789",
    chances: "90%",
    status: "Won",
    source: "Website",
  },
  {
    id: 4,
    createdDate: "2024-02-10",
    dealName: "Marketing Campaign",
    stage: "Negotiation",
    dealAmount: "$75,000",
    value: "Medium",
    tags: "Marketing",
    expectedEndDate: "2024-04-15",
    closeDate: "2024-04-10",
    duration: "2 months",
    owner: "Emma Davis",
    phoneNumber: "+256 789 456 123",
    chances: "70%",
    status: "Open",
    source: "Facebook",
  },
  {
    id: 5,
    createdDate: "2024-02-05",
    dealName: "Product Development",
    stage: "Proposal",
    dealAmount: "$300,000",
    value: "High",
    tags: "R&D",
    expectedEndDate: "2024-12-31",
    closeDate: "2024-12-15",
    duration: "10 months",
    owner: "Frank Wilson",
    phoneNumber: "+256 321 654 987",
    chances: "50%",
    status: "Open",
    source: "Instagram",
  },
];

// Stage Button Colors
const stageColors = {
  Completed: "#81c784", // light green
  Planned: "#ffb74d", // orange
  Active: "#64b5f6", // blue
  Negotiation: "#e57373", // red
  Proposal: "#a0a0a0", // grey
};

// Value Colors
const valueColors = {
  High: "#4caf50", // green
  Medium: "#ff9800", // orange
  Low: "#f44336", // red
};

// Source Icons
const sourceIcons = {
  Twitter: <Twitter />,
  Facebook: <Facebook />,
  LinkedIn: <LinkedIn />,
  Instagram: <Instagram />,
  Website: <Public />,
};

const statusColors = {
  Won: "green",
  Open: "orange",
  Lost: "red",
};

// Summary Data
const getSummaryData = (deals) => [
  { label: "Total Deals", value: deals.length, icon: <AttachMoneyIcon /> },
  {
    label: "Total Companies",
    value: new Set(deals.map((deal) => deal.owner)).size,
    icon: <BusinessIcon />,
  },
  {
    label: "Won Deals",
    value: deals.filter((deal) => deal.status === "Won").length,
    icon: <CheckCircleIcon />,
  },
  {
    label: "Lost Deals",
    value: deals.filter((deal) => deal.status === "Lost").length,
    icon: <CancelIcon />,
  },
];

const DealsPage = () => {
  const theme = useTheme();
  const [deals, setDeals] = useState(initialDeals);
  const [openAddDeal, setOpenAddDeal] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [newDeal, setNewDeal] = useState({
    dealName: "",
    stage: "Active",
    dealAmount: "",
    value: "Medium",
    tags: "",
    expectedEndDate: "",
    closeDate: "",
    duration: "",
    owner: "",
    phoneNumber: "",
    chances: "",
    status: "Open",
    source: "Website",
  });

  // Handle Add Deal
  const handleAddDeal = () => {
    const newEntry = {
      id: deals.length + 1,
      createdDate: new Date().toISOString().split("T")[0],
      ...newDeal,
    };
    setDeals([...deals, newEntry]);
    setOpenAddDeal(false);
    setNewDeal({
      dealName: "",
      stage: "Active",
      dealAmount: "",
      value: "Medium",
      tags: "",
      expectedEndDate: "",
      closeDate: "",
      duration: "",
      owner: "",
      phoneNumber: "",
      chances: "",
      status: "Open",
      source: "Website",
    });
  };

  // Handle Action Click (Hide, Edit, Delete)
  const handleActionClick = (event, id) => {
    setMenuAnchor(event.currentTarget);
    setSelectedDealId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedDealId(null);
  };

  const handleDeleteDeal = () => {
    setDeals(deals.filter((deal) => deal.id !== selectedDealId));
    handleMenuClose();
  };

  // Table Columns
  const columns = [
    { field: "createdDate", headerName: "Created Date", flex: 1 },
    { field: "dealName", headerName: "Deal Name", flex: 1.5 },
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
    { field: "dealAmount", headerName: "Deal Amount", flex: 1 },
    {
      field: "value",
      headerName: "Value",
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            color: valueColors[params.value],
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "tags", headerName: "Tags", flex: 1 },
    { field: "expectedEndDate", headerName: "Expected End Date", flex: 1 },
    { field: "closeDate", headerName: "Close Date", flex: 1 },
    { field: "duration", headerName: "Duration", flex: 1 },
    { field: "owner", headerName: "Owner", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "chances", headerName: "Chances", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
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
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleActionClick(event, params.row.id)}>
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      {/* Title */}
      <Typography variant="h4" fontWeight="bold">
        Deals Management
      </Typography>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mt={3}>
        {getSummaryData(deals).map((card, index) => (
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

      {/* Add Deal Button */}
      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          sx={{ backgroundColor: "purple", color: "white" }}
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDeal(true)}
        >
          Add Deal
        </Button>
      </Box>

      {/* Deals Table */}
      <Box mt={4} sx={{ height: "60vh" }}>
        <DataGrid rows={deals} columns={columns} pageSize={5} />
      </Box>

      {/* Add Deal Dialog */}
      <Dialog open={openAddDeal} onClose={() => setOpenAddDeal(false)}>
        <DialogTitle>Add New Deal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Deal Name"
            fullWidth
            value={newDeal.dealName}
            onChange={(e) => setNewDeal({ ...newDeal, dealName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Stage"
            select
            fullWidth
            value={newDeal.stage}
            onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
          >
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Negotiation">Negotiation</MenuItem>
            <MenuItem value="Proposal">Proposal</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Deal Amount"
            fullWidth
            value={newDeal.dealAmount}
            onChange={(e) => setNewDeal({ ...newDeal, dealAmount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Value"
            select
            fullWidth
            value={newDeal.value}
            onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Tags"
            fullWidth
            value={newDeal.tags}
            onChange={(e) => setNewDeal({ ...newDeal, tags: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Expected End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newDeal.expectedEndDate}
            onChange={(e) => setNewDeal({ ...newDeal, expectedEndDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Close Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newDeal.closeDate}
            onChange={(e) => setNewDeal({ ...newDeal, closeDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Duration"
            fullWidth
            value={newDeal.duration}
            onChange={(e) => setNewDeal({ ...newDeal, duration: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Owner"
            fullWidth
            value={newDeal.owner}
            onChange={(e) => setNewDeal({ ...newDeal, owner: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newDeal.phoneNumber}
            onChange={(e) => setNewDeal({ ...newDeal, phoneNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Chances"
            fullWidth
            value={newDeal.chances}
            onChange={(e) => setNewDeal({ ...newDeal, chances: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Status"
            select
            fullWidth
            value={newDeal.status}
            onChange={(e) => setNewDeal({ ...newDeal, status: e.target.value })}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Won">Won</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Source"
            select
            fullWidth
            value={newDeal.source}
            onChange={(e) => setNewDeal({ ...newDeal, source: e.target.value })}
          >
            <MenuItem value="Twitter">Twitter</MenuItem>
            <MenuItem value="Facebook">Facebook</MenuItem>
            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
            <MenuItem value="Instagram">Instagram</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDeal(false)}>Cancel</Button>
          <Button onClick={handleAddDeal} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Hide</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteDeal}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default DealsPage;