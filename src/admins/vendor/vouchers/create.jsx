import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart } from "@mui/x-charts";
import { Edit, Delete, AccountBalance, CreditCard, Money, Payments } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const VoucherPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [voucherType, setVoucherType] = useState("credit");
  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    accountName: "",
    particular: "",
    warehouse: "",
    mode: "",
    chequeNo: "",
    amount: "",
  });

  const handleVoucherTypeChange = (_, newType) => {
    if (newType) setVoucherType(newType);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (Object.values(formData).some((field) => field === "")) {
      alert("Please fill in all fields");
      return;
    }

    setRows([
      ...rows,
      { id: rows.length + 1, ...formData, type: voucherType },
    ]);
    setFormData({
      date: "",
      accountName: "",
      particular: "",
      warehouse: "",
      mode: "",
      chequeNo: "",
      amount: "",
    });
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "accountName", headerName: "Account Name", flex: 1 },
    { field: "particular", headerName: "Particular", flex: 1 },
    { field: "warehouse", headerName: "Warehouse", flex: 1 },
    {
      field: "mode",
      headerName: "Mode",
      flex: 1,
      renderCell: (params) => {
        const modeIcons = {
          Cash: <Money color="success" />,
          "Bank Transfer": <AccountBalance color="primary" />,
          Cheque: <CreditCard color="warning" />,
          "Mobile Money": <Payments color="secondary" />,
        };
        return (
          <Box display="flex" alignItems="center" gap={1}>
            {modeIcons[params.value]} {params.value}
          </Box>
        );
      },
    },
    { field: "chequeNo", headerName: "Cheque No.", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "type",
      headerName: "Create Voucher",
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.value === "credit" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value.toUpperCase()}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary">
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="bold">
        Voucher Page
      </Typography>
      <ToggleButtonGroup
        value={voucherType}
        exclusive
        onChange={handleVoucherTypeChange}
        sx={{ mt: 2 }}
      >
        <ToggleButton value="credit" sx={{ fontWeight: "bold" }}>
          Credit Voucher
        </ToggleButton>
        <ToggleButton value="debit" sx={{ fontWeight: "bold" }}>
          Debit Voucher
        </ToggleButton>
      </ToggleButtonGroup>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        mt={3}
        sx={{ backgroundColor: colors.primary[400], p: 3, borderRadius: 2 }}
      >
        <Box display="flex" justifyContent="space-between" gap={2}>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Warehouse"
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Mode</InputLabel>
            <Select name="mode" value={formData.mode} onChange={handleChange}>
              <MenuItem value="Cash">
                <Money color="success" /> Cash
              </MenuItem>
              <MenuItem value="Bank Transfer">
                <AccountBalance color="primary" /> Bank Transfer
              </MenuItem>
              <MenuItem value="Cheque">
                <CreditCard color="warning" /> Cheque
              </MenuItem>
              <MenuItem value="Mobile Money">
                <Payments color="secondary" /> Mobile Money
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box display="flex" justifyContent="space-between" gap={2}>
          <TextField
            label="Account Name"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Particular"
            name="particular"
            value={formData.particular}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        <TextField
          label="Cheque No."
          name="chequeNo"
          value={formData.chequeNo}
          onChange={handleChange}
          fullWidth
        />
        
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create {voucherType.charAt(0).toUpperCase() + voucherType.slice(1)}
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Box
          height="50vh"
          width="60%"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        >
          <DataGrid rows={rows} columns={columns} />
        </Box>

        {/* Pie Chart */}
        <Box width="35%" height="50vh">
          <PieChart
            series={[
              {
                data: [
                  { id: 1, value: rows.filter((r) => r.type === "credit").length, label: "Credit" },
                  { id: 2, value: rows.filter((r) => r.type === "debit").length, label: "Debit" },
                ],
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherPage;
