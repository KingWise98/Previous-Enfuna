import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MoreVert, Edit, VisibilityOff, Delete, CloudUpload, GetApp, PictureAsPdf } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const TransferListPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy Transfer Data
  const initialTransfers = [
    { id: 1, date: "2025-02-20", refNumber: "TRF-001", fromWarehouse: "Kampala Central", toWarehouse: "Jinja Branch", totalItems: 15, grandTotal: "$2,500", status: "Completed" },
    { id: 2, date: "2025-02-21", refNumber: "TRF-002", fromWarehouse: "Mumbai Depot", toWarehouse: "Delhi Store", totalItems: 30, grandTotal: "$4,200", status: "Pending" },
    { id: 3, date: "2025-02-22", refNumber: "TRF-003", fromWarehouse: "Tokyo Main", toWarehouse: "Osaka Hub", totalItems: 25, grandTotal: "$3,800", status: "Partial" },
    { id: 4, date: "2025-02-23", refNumber: "TRF-004", fromWarehouse: "New York Warehouse", toWarehouse: "Los Angeles Store", totalItems: 50, grandTotal: "$7,500", status: "Completed" },
    { id: 5, date: "2025-02-24", refNumber: "TRF-005", fromWarehouse: "Bogotá Central", toWarehouse: "Medellín Outlet", totalItems: 10, grandTotal: "$1,500", status: "Pending" },
  ];

  const [transfers, setTransfers] = useState(initialTransfers);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  // Handle Open Action Menu
  const handleOpenMenu = (event, transfer) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransfer(transfer);
  };

  // Handle Close Action Menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTransfer(null);
  };

  // Handle Delete
  const handleDelete = (id) => {
    setTransfers(transfers.filter((transfer) => transfer.id !== id));
    handleCloseMenu();
  };

  // Handle Hide (Mock action)
  const handleHide = (id) => {
    alert(`Transfer with ID ${id} is now hidden`);
    handleCloseMenu();
  };

  // Handle Edit (Mock action)
  const handleEdit = (id) => {
    alert(`Editing transfer with ID ${id}`);
    handleCloseMenu();
  };

  // Handle Export to PDF (Mock Action)
  const handleDownloadPDF = () => {
    alert("Downloading transfer list as PDF...");
  };

  // Handle Export to Excel (Mock Action)
  const handleDownloadExcel = () => {
    alert("Downloading transfer list as Excel...");
  };

  // Function to get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Partial":
        return "orange";
      case "Pending":
        return "red";
      default:
        return "gray";
    }
  };

  // Table Columns
  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "refNumber", headerName: "Ref Number", flex: 1.2 },
    { field: "fromWarehouse", headerName: "From Warehouse", flex: 1.5 },
    { field: "toWarehouse", headerName: "To Warehouse", flex: 1.5 },
    { field: "totalItems", headerName: "Total Items", flex: 1 },
    { field: "grandTotal", headerName: "Grand Total", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip label={params.value} sx={{ backgroundColor: getStatusColor(params.value), color: "white" }} />
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
            <MenuItem onClick={() => handleEdit(selectedTransfer?.id)}>
              <Edit sx={{ marginRight: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleHide(selectedTransfer?.id)}>
              <VisibilityOff sx={{ marginRight: 1 }} /> Hide
            </MenuItem>
            <MenuItem onClick={() => handleDelete(selectedTransfer?.id)} sx={{ color: "red" }}>
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
        Transfer List
      </Typography>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button variant="contained" sx={{ backgroundColor: "purple", color: "white" }}>
          Create Transfer
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

      {/* Transfer Table */}
      <Box sx={{ height: "60vh" }}>
        <DataGrid
          rows={transfers}
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        />
      </Box>
    </Box>
  );
};

export default TransferListPage;
