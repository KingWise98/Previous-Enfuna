import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Paper,
  Tooltip,
  useTheme,
  InputAdornment,
  Divider,
  CircularProgress,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  VisibilityOff,
  Delete,
  CloudUpload,
  GetApp,
  PictureAsPdf,
  Search,
  AddCircle,
  Close,
  CheckCircle,
  Refresh,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

const SupplierListPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    id: "",
    name: "",
    contactPerson: "",
    mobile: "",
    email: "",
    state: "",
    balance: "",
    status: "Active",
  });

  // Fetch suppliers (replace with real API)
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const res = await fetch("/api/suppliers");
        // const data = await res.json();
        // setSuppliers(data);
        
        // Simulate empty state
        setSuppliers([]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Filter suppliers by search term
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Action Menu Handlers
  const handleOpenMenu = (event, supplier) => {
    setAnchorEl(event.currentTarget);
    setSelectedSupplier(supplier);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSupplier(null);
  };

  const handleDelete = (id) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    handleCloseMenu();
  };

  const handleHide = (id) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, status: "Inactive" } : supplier
      )
    );
    handleCloseMenu();
  };

  const handleActivate = (id) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, status: "Active" } : supplier
      )
    );
    handleCloseMenu();
  };

  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
    setEditMode(true);
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleAddSupplier = () => {
    if (editMode) {
      // Update existing supplier
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === currentSupplier.id ? currentSupplier : supplier
        )
      );
    } else {
      // Add new supplier
      const newSupplierWithId = {
        ...currentSupplier,
        id: suppliers.length + 1,
      };
      setSuppliers([...suppliers, newSupplierWithId]);
    }
    setOpenDialog(false);
    setCurrentSupplier({
      id: "",
      name: "",
      contactPerson: "",
      mobile: "",
      email: "",
      state: "",
      balance: "",
      status: "Active",
    });
    setEditMode(false);
  };

  // Columns for DataGrid
  const columns = [
    {
      field: "name",
      headerName: "Supplier Name",
      flex: 1.5,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: colors.greenAccent[500] }}>
            {params.row.name.charAt(0)}
          </Avatar>
          <Typography>{params.row.name}</Typography>
        </Box>
      ),
    },
    { field: "contactPerson", headerName: "Contact Person", flex: 1.2 },
    { field: "mobile", headerName: "Mobile", flex: 1.1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "state", headerName: "State", flex: 1 },
    {
      field: "balance",
      headerName: "Balance",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight="500" color={colors.greenAccent[500]}>
          {params.row.balance}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          size="small"
          sx={{
            backgroundColor:
              params.row.status === "Active"
                ? colors.greenAccent[600]
                : colors.redAccent[600],
            color: "white",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      renderCell: (params) => (
        <>
          <Tooltip title="Actions">
            <IconButton onClick={(e) => handleOpenMenu(e, params.row)}>
              <MoreVert />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedSupplier?.id === params.row.id}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => handleEdit(params.row)}>
              <Edit sx={{ mr: 1 }} /> Edit
            </MenuItem>
            {params.row.status === "Active" ? (
              <MenuItem onClick={() => handleHide(params.row.id)}>
                <VisibilityOff sx={{ mr: 1 }} /> Deactivate
              </MenuItem>
            ) : (
              <MenuItem onClick={() => handleActivate(params.row.id)}>
                <CheckCircle sx={{ mr: 1 }} /> Activate
              </MenuItem>
            )}
            <MenuItem
              onClick={() => handleDelete(params.row.id)}
              sx={{ color: colors.redAccent[500] }}
            >
              <Delete sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Supplier Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage suppliers, contacts, and balances
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            onClick={() => {
              setOpenDialog(true);
              setEditMode(false);
            }}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      {/* Search and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search suppliers..."
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
        <Box display="flex" gap={2}>
          <Tooltip title="Import Suppliers">
            <Button variant="outlined" startIcon={<CloudUpload />}>
              Import
            </Button>
          </Tooltip>
          <Tooltip title="Export to PDF">
            <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={() => alert("PDF export")}>
              PDF
            </Button>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <Button variant="outlined" startIcon={<GetApp />} onClick={() => alert("Excel export")}>
              Excel
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Supplier Table */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ height: "65vh" }}>
          <DataGrid
            rows={filteredSuppliers}
            columns={columns}
            loading={isLoading}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
            components={{
              LoadingOverlay: () => (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress color="secondary" />
                </Box>
              ),
              NoRowsOverlay: () => (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography variant="h6" color="textSecondary">
                    {suppliers.length === 0 ? "No suppliers found" : "No matching suppliers"}
                  </Typography>
                </Box>
              ),
            }}
          />
        </Box>
      </Paper>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {editMode ? "Edit Supplier" : "Add New Supplier"}
            </Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Supplier Name"
                fullWidth
                value={currentSupplier.name}
                onChange={(e) =>
                  setCurrentSupplier({ ...currentSupplier, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Person"
                fullWidth
                value={currentSupplier.contactPerson}
                onChange={(e) =>
                  setCurrentSupplier({ ...currentSupplier, contactPerson: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile"
                fullWidth
                value={currentSupplier.mobile}
                onChange={(e) =>
                  setCurrentSupplier({ ...currentSupplier, mobile: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={currentSupplier.email}
                onChange={(e) =>
                  setCurrentSupplier({ ...currentSupplier, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State/Region"
                fullWidth
                value={currentSupplier.state}
                onChange={(e) =>
                  setCurrentSupplier({ ...currentSupplier, state: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Balance ($)"
                fullWidth
                value={currentSupplier.balance}
                onChange={(e) =>
                  setCurrentSupplier({ ...currentSupplier, balance: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSupplier}
            variant="contained"
            color="primary"
            disabled={!currentSupplier.name || !currentSupplier.contactPerson}
          >
            {editMode ? "Update Supplier" : "Save Supplier"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierListPage;