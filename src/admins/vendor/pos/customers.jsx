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

const CustomerListPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy Data with Customers from Uganda, India, Japan, Colombia, and USA
  const initialCustomers = [
    { id: 1, code: "CUST001", name: "John Mugisha", phone: "+256700123456", email: "johnm@example.com", country: "Uganda", city: "Kampala" },
    { id: 2, code: "CUST002", name: "Rajesh Kumar", phone: "+91 9876543210", email: "rajesh.kumar@example.com", country: "India", city: "New Delhi" },
    { id: 3, code: "CUST003", name: "Hiroshi Tanaka", phone: "+81 90-1234-5678", email: "hiroshi.tanaka@example.com", country: "Japan", city: "Tokyo" },
    { id: 4, code: "CUST004", name: "Sofía Rodríguez", phone: "+57 300 4567890", email: "sofia.rodriguez@example.com", country: "Colombia", city: "Bogotá" },
    { id: 5, code: "CUST005", name: "Michael Johnson", phone: "+1 555-789-4567", email: "michael.johnson@example.com", country: "USA", city: "New York" },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openModal, setOpenModal] = useState(false); // For the modal
  const [newCustomer, setNewCustomer] = useState({
    code: "",
    name: "",
    phone: "",
    email: "",
    country: "",
    city: "",
  });

  // Handle Open Action Menu
  const handleOpenMenu = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  // Handle Close Action Menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  // Handle Delete
  const handleDelete = (id) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
    handleCloseMenu();
  };

  // Handle Hide (Mock action)
  const handleHide = (id) => {
    alert(`Customer with ID ${id} is now hidden`);
    handleCloseMenu();
  };

  // Handle Edit (Mock action)
  const handleEdit = (id) => {
    alert(`Editing customer with ID ${id}`);
    handleCloseMenu();
  };

  // Handle Export to PDF (Mock Action)
  const handleDownloadPDF = () => {
    alert("Downloading customer list as PDF...");
  };

  // Handle Export to Excel (Mock Action)
  const handleDownloadExcel = () => {
    alert("Downloading customer list as Excel...");
  };

  // Handle Create Customer Form Submission
  const handleCreateCustomer = () => {
    setCustomers([
      ...customers,
      {
        id: customers.length + 1,
        code: newCustomer.code,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        country: newCustomer.country,
        city: newCustomer.city,
      },
    ]);
    setOpenModal(false); // Close modal after adding customer
    setNewCustomer({
      code: "",
      name: "",
      phone: "",
      email: "",
      country: "",
      city: "",
    }); // Reset form fields
  };

  // Table Columns
  const columns = [
    { field: "code", headerName: "Code", flex: 1 },
    { field: "name", headerName: "Customer Name", flex: 1.5 },
    { field: "phone", headerName: "Phone Number", flex: 1.2 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
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
            <MenuItem onClick={() => handleEdit(selectedCustomer?.id)}>
              <Edit sx={{ marginRight: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleHide(selectedCustomer?.id)}>
              <VisibilityOff sx={{ marginRight: 1 }} /> Hide
            </MenuItem>
            <MenuItem onClick={() => handleDelete(selectedCustomer?.id)} sx={{ color: "red" }}>
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
        Customer List
      </Typography>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button variant="contained" sx={{ backgroundColor: "purple", color: "white" }} onClick={() => setOpenModal(true)}>
          Create Customer
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

      {/* Customer Table */}
      <Box sx={{ height: "60vh" }}>
        <DataGrid
          rows={customers}
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        />
      </Box>

      {/* Modal for Creating Customer */}
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
            Create New Customer
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Code"
                value={newCustomer.code}
                onChange={(e) => setNewCustomer({ ...newCustomer, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+256</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country"
                value={newCustomer.country}
                onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                value={newCustomer.city}
                onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button fullWidth variant="contained" sx={{ backgroundColor: "purple" }} onClick={handleCreateCustomer}>
                Create Customer
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomerListPage;
