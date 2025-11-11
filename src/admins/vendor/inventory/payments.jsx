import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";

// Dummy Supplier Payment Data (Uganda Example)
const initialPayments = [
  {
    id: 1,
    paymentId: "PAY001",
    supplierName: "Uganda Coffee Co.",
    amount: 5000000,
    paymentDate: "2025-03-15",
    dueDate: "2025-04-15",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    invoiceNumber: "INV1001",
    supplierAddress: "Kampala, Uganda",
  },
  {
    id: 2,
    paymentId: "PAY002",
    supplierName: "Uganda Sugar Ltd.",
    amount: 3000000,
    paymentDate: "2025-02-20",
    dueDate: "2025-03-20",
    status: "Completed",
    paymentMethod: "Cheque",
    invoiceNumber: "INV1002",
    supplierAddress: "Jinja, Uganda",
  },
  {
    id: 3,
    paymentId: "PAY003",
    supplierName: "Uganda Tea Processing",
    amount: 7000000,
    paymentDate: "2025-01-10",
    dueDate: "2025-02-10",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    invoiceNumber: "INV1003",
    supplierAddress: "Fort Portal, Uganda",
  },
  {
    id: 4,
    paymentId: "PAY004",
    supplierName: "Uganda Textiles Ltd.",
    amount: 2000000,
    paymentDate: "2025-02-25",
    dueDate: "2025-03-25",
    status: "Completed",
    paymentMethod: "Mobile Money",
    invoiceNumber: "INV1004",
    supplierAddress: "Kampala, Uganda",
  },
];

const statusColors = {
  Pending: "orange",
  Completed: "green",
};

const SupplierPaymentsPage = () => {
  const theme = useTheme();
  const [payments, setPayments] = useState(initialPayments);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    paymentId: "",
    supplierName: "",
    amount: "",
    paymentDate: "",
    dueDate: "",
    status: "Pending",
    paymentMethod: "",
    invoiceNumber: "",
    supplierAddress: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(payments);

  // Search and Filter Logic
  const handleSearch = () => {
    setFilteredPayments(
      payments.filter((payment) => {
        const isNameMatch = payment.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
        const isStatusMatch = selectedStatus ? payment.status === selectedStatus : true;
        return isNameMatch && isStatusMatch;
      })
    );
  };

  const handleAddPayment = () => {
    setPayments([...payments, { id: payments.length + 1, ...newPayment }]);
    setOpenAddDialog(false);
    setNewPayment({
      paymentId: "",
      supplierName: "",
      amount: "",
      paymentDate: "",
      dueDate: "",
      status: "Pending",
      paymentMethod: "",
      invoiceNumber: "",
      supplierAddress: "",
    });
  };

  const columns = [
    { field: "paymentId", headerName: "Payment ID", flex: 1 },
    { field: "supplierName", headerName: "Supplier Name", flex: 1.5 },
    { field: "amount", headerName: "Amount (UGX)", flex: 1 },
    { field: "paymentDate", headerName: "Payment Date", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
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
    { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton color="secondary">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="bold">
        Supplier Payments Management
      </Typography>

      {/* Search and Filter */}
      <Box mt={2} display="flex" gap={2} justifyContent="space-between">
        <TextField
          label="Search by Supplier Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ width: "45%" }}
        />
        <FormControl fullWidth sx={{ width: "45%" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mt={3}>
        {[ 
          { label: "Total Payments", value: payments.length, color: "#E0E0E0" },
          { label: "Pending Payments", value: payments.filter((p) => p.status === "Pending").length, color: "#F2C94C" },
          { label: "Completed Payments", value: payments.filter((p) => p.status === "Completed").length, color: "#27AE60" }
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
            <Typography variant="h5" fontWeight="bold" sx={{ color: "black" }}>
              {card.value}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "black" }}>
              {card.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Add Payment Button */}
      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          sx={{ backgroundColor: "purple", color: "white" }}
          startIcon={<AddCircleIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Payment
        </Button>
      </Box>

      {/* Payment Table */}
      <Box mt={4}>
        <DataGrid rows={filteredPayments} columns={columns} pageSize={5} autoHeight />
      </Box>

      {/* Add Payment Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent>
          {[
            "paymentId", "supplierName", "amount", "paymentDate", "dueDate", "paymentMethod", "invoiceNumber", "supplierAddress"
          ].map((field) => (
            <TextField
              key={field}
              label={field.replace(/([A-Z])/g, " $1").toUpperCase()}
              fullWidth
              margin="dense"
              value={newPayment[field]}
              onChange={(e) => setNewPayment({ ...newPayment, [field]: e.target.value })}
            />
          ))}
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newPayment.status}
              onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPayment} variant="contained" color="primary">
            Add Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierPaymentsPage;
