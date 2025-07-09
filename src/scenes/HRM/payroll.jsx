import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem as MuiMenuItem,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Divider,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Switch,
  Badge,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  MoreVert,
  Add,
  Print,
  Download,
  Visibility,
  Edit,
  Delete,
  AttachMoney,
  MoneyOff,
  AccessTime,
  CalendarToday,
  People,
  BarChart,
  Receipt,
  AccountBalance,
  Security,
  SyncAlt,
  QrCode,
  LocationOn,
  CameraAlt,
  DateRange,
  FilterList,
  Search,
  CloudUpload,
  CloudDownload,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Mock data for demonstration
const employees = [
  { id: 1, name: "Kwame Mensah", position: "Developer", department: "IT", salary: 500000, currency: "UGX", status: "active" },
  { id: 2, name: "Rohan Patel", position: "Manager", department: "Finance", salary: 20000, currency: "INR", status: "active" },
  { id: 3, name: "John Smith", position: "Designer", department: "Creative", salary: 150, currency: "USD", status: "active" },
  { id: 4, name: "Adeola Chukwu", position: "HR", department: "Human Resources", salary: 50000, currency: "NGN", status: "active" },
];

const payrollItems = {
  Additions: [
    { id: 1, name: "Performance Bonus", amount: 500000, currency: "UGX", taxable: true },
    { id: 2, name: "Housing Allowance", amount: 20000, currency: "INR", taxable: false },
    { id: 3, name: "Transport Allowance", amount: 150, currency: "USD", taxable: true },
    { id: 4, name: "Health Bonus", amount: 50000, currency: "NGN", taxable: false },
  ],
  Overtime: [
    { id: 1, name: "Weekday Overtime", rate: 20000, currency: "UGX", per: "hour", taxable: true },
    { id: 2, name: "Weekend Overtime", rate: 1500, currency: "INR", per: "hour", taxable: true },
    { id: 3, name: "Holiday Overtime", rate: 30, currency: "USD", per: "hour", taxable: true },
    { id: 4, name: "Emergency OT", rate: 5000, currency: "NGN", per: "hour", taxable: true },
  ],
  Deductions: [
    { id: 1, name: "Tax", amount: 200000, currency: "UGX", statutory: true },
    { id: 2, name: "Loan Repayment", amount: 5000, currency: "INR", statutory: false },
    { id: 3, name: "Pension", amount: 100, currency: "USD", statutory: true },
    { id: 4, name: "Union Fees", amount: 3000, currency: "NGN", statutory: false },
  ],
};

const taxRates = {
  UGX: { incomeTax: 0.3, socialSecurity: 0.05 },
  INR: { incomeTax: 0.2, socialSecurity: 0.04 },
  USD: { incomeTax: 0.25, socialSecurity: 0.06 },
  NGN: { incomeTax: 0.15, socialSecurity: 0.03 },
};

const PayrollSystem = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data, setData] = useState(payrollItems);
  const [openForm, setOpenForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", amount: "", currency: "USD", taxable: false });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [payrollPeriod, setPayrollPeriod] = useState({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
  const [payrollStatus, setPayrollStatus] = useState("draft");
  const [payslipSettings, setPayslipSettings] = useState({
    showLogo: true,
    showEmployeeId: true,
    showBankDetails: true,
    showYTD: true,
    showBusinessAddress: true,
  });
  const [attendanceSettings, setAttendanceSettings] = useState({
    qrCodeCheckIn: true,
    gpsTracking: true,
    selfieVerification: false,
    autoAttendance: false,
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Payroll Items Management (existing functions)
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddClick = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setNewItem({ name: "", amount: "", currency: "USD", taxable: false });
  };

  const handleSaveItem = () => {
    if (!selectedCategory) return;
    const updatedData = {
      ...data,
      [selectedCategory]: [
        ...data[selectedCategory],
        { 
          id: data[selectedCategory].length + 1, 
          ...newItem,
          ...(selectedCategory === "Overtime" ? { per: "hour" } : {}),
          ...(selectedCategory === "Deductions" ? { statutory: false } : {})
        },
      ],
    };
    setData(updatedData);
    handleCloseForm();
  };

  const handleActionMenuOpen = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleDeleteItem = () => {
    if (!selectedCategory || !selectedRow) return;
    setData({
      ...data,
      [selectedCategory]: data[selectedCategory].filter((item) => item.id !== selectedRow.id),
    });
    handleActionMenuClose();
  };

  // Payroll Processing
  const calculatePayroll = () => {
    // Calculate payroll for selected employees
    const processedPayroll = selectedEmployees.map(employee => {
      const additions = data.Additions.reduce((sum, item) => sum + (item.amount || 0), 0);
      const overtime = data.Overtime.reduce((sum, item) => sum + (item.rate * 2 || 0), 0); // Assuming 2 hours overtime
      const grossPay = employee.salary + additions + overtime;
      
      const deductions = data.Deductions.reduce((sum, item) => {
        if (item.statutory) {
          return sum + item.amount;
        }
        return sum;
      }, 0);
      
      const tax = grossPay * taxRates[employee.currency].incomeTax;
      const netPay = grossPay - deductions - tax;
      
      return {
        ...employee,
        grossPay,
        deductions,
        tax,
        netPay,
        additions: additions,
        overtime: overtime,
      };
    });
    
    return processedPayroll;
  };

  const [processedPayroll, setProcessedPayroll] = useState([]);

  const runPayroll = () => {
    const results = calculatePayroll();
    setProcessedPayroll(results);
    setPayrollStatus("processed");
  };

  // Employee Selection
  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId) 
        : [...prev, employeeId]
    );
  };

  // Payslip Settings
  const handlePayslipSettingChange = (setting) => {
    setPayslipSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Attendance Settings
  const handleAttendanceSettingChange = (setting) => {
    setAttendanceSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Columns for DataGrid
  const employeeColumns = [
    { 
      field: "selection", 
      headerName: "", 
      width: 50,
      renderCell: (params) => (
        <Checkbox
          checked={selectedEmployees.includes(params.row.id)}
          onChange={() => toggleEmployeeSelection(params.row.id)}
        />
      ),
    },
    { 
      field: "name", 
      headerName: "Employee", 
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2 }}>{params.row.name.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body1">{params.row.name}</Typography>
            <Typography variant="caption">{params.row.position}</Typography>
          </Box>
        </Box>
      ),
    },
    { field: "department", headerName: "Department", flex: 1 },
    { 
      field: "salary", 
      headerName: "Base Salary", 
      flex: 1,
      renderCell: (params) => `${params.row.currency} ${params.row.salary.toLocaleString()}`,
    },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => (
        <Chip 
          label={params.row.status} 
          color={params.row.status === "active" ? "success" : "error"} 
          size="small"
        />
      ),
    },
  ];

  const payrollColumns = [
    { field: "name", headerName: "Employee", flex: 1 },
    { field: "grossPay", headerName: "Gross Pay", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
    { field: "additions", headerName: "Additions", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
    { field: "overtime", headerName: "Overtime", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
    { field: "deductions", headerName: "Deductions", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
    { field: "tax", headerName: "Tax", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
    { field: "netPay", headerName: "Net Pay", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Tooltip title="View Payslip">
            <IconButton onClick={() => console.log("View payslip", params.row)}>
              <Receipt />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton onClick={() => console.log("Download payslip", params.row)}>
              <Download />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // Dashboard Stats
  const dashboardStats = [
    { title: "Total Employees", value: employees.length, icon: <People />, color: "primary" },
    { title: "Active Payroll", value: payrollStatus === "processed" ? processedPayroll.length : 0, icon: <AttachMoney />, color: "success" },
    { title: "Pending Approvals", value: 3, icon: <AccessTime />, color: "warning" },
    { title: "Total Payroll Cost", value: processedPayroll.reduce((sum, emp) => sum + emp.grossPay, 0), icon: <AccountBalance />, color: "info" },
  ];

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Payroll Management System
        </Typography>
        <Box>
          <Button variant="contained" color="primary" startIcon={<SyncAlt />} sx={{ mr: 2 }}>
            Sync Attendance
          </Button>
          <Button variant="contained" color="success" startIcon={<CloudDownload />}>
            Export Reports
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" value="dashboard" icon={<BarChart />} />
          <Tab label="Payroll Items" value="payrollItems" icon={<Receipt />} />
          <Tab label="Run Payroll" value="runPayroll" icon={<AttachMoney />} />
          <Tab label="Employee Self-Service" value="selfService" icon={<People />} />
          <Tab label="Reports" value="reports" icon={<BarChart />} />
          <Tab label="Tax Compliance" value="tax" icon={<Security />} />
          <Tab label="Settings" value="settings" icon={<Security />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <Box>
          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            {dashboardStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ p: 3, height: "100%" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" color="textSecondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.currency ? `${stat.currency} ` : ""}{stat.value.toLocaleString()}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${stat.color}.main`, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Payroll */}
          <Card sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" mb={3}>Recent Payroll Runs</Typography>
            {processedPayroll.length > 0 ? (
              <DataGrid
                rows={processedPayroll}
                columns={payrollColumns}
                pageSize={5}
                autoHeight
                components={{ Toolbar: GridToolbar }}
              />
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="textSecondary">
                  No recent payroll runs. Process a payroll to see data here.
                </Typography>
              </Box>
            )}
          </Card>

          {/* Employee Distribution */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" mb={3}>Employee Distribution by Department</Typography>
                <Box height={300}>
                  {/* Placeholder for chart */}
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="textSecondary">Chart will appear here</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" mb={3}>Upcoming Birthdays</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Department</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Kwame Mensah</TableCell>
                        <TableCell>July 15</TableCell>
                        <TableCell>IT</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rohan Patel</TableCell>
                        <TableCell>August 2</TableCell>
                        <TableCell>Finance</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === "payrollItems" && (
        <Box>
          {/* Title */}
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Payroll Items Management
          </Typography>

          {/* Button Cards */}
          <Grid container spacing={2} mt={3}>
            {["Additions", "Overtime", "Deductions"].map((category) => (
              <Grid item xs={4} key={category}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: selectedCategory === category ? "#D1C4E9" : "#F3F4F6",
                    "&:hover": { backgroundColor: "#D1C4E9" },
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {category}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {data[category].length} items
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Add Button (Top Right) */}
          {selectedCategory && (
            <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {selectedCategory} Items
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddClick}
              >
                Add {selectedCategory}
              </Button>
            </Box>
          )}

          {/* Data Table */}
          {selectedCategory && (
            <Box mt={4} sx={{ height: "50vh" }}>
              <DataGrid 
                rows={data[selectedCategory]} 
                columns={[
                  { field: "name", headerName: "Name", flex: 1 },
                  { 
                    field: selectedCategory === "Overtime" ? "rate" : "amount", 
                    headerName: selectedCategory === "Overtime" ? "Rate" : "Amount", 
                    flex: 1,
                    valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}`,
                  },
                  ...(selectedCategory === "Overtime" ? [{ field: "per", headerName: "Per", flex: 0.5 }] : []),
                  { 
                    field: selectedCategory === "Deductions" ? "statutory" : "taxable", 
                    headerName: selectedCategory === "Deductions" ? "Statutory" : "Taxable", 
                    flex: 0.5,
                    renderCell: (params) => (
                      <Checkbox checked={params.value} disabled />
                    ),
                  },
                  {
                    field: "actions",
                    headerName: "Actions",
                    flex: 0.5,
                    renderCell: (params) => (
                      <>
                        <IconButton onClick={(event) => handleActionMenuOpen(event, params.row)}>
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={menuAnchor}
                          open={Boolean(menuAnchor)}
                          onClose={handleActionMenuClose}
                        >
                          <MuiMenuItem onClick={handleDeleteItem} sx={{ color: "red" }}>
                            <Delete sx={{ mr: 1 }} /> Delete
                          </MuiMenuItem>
                          <MuiMenuItem onClick={() => { console.log("Edit", selectedRow); handleActionMenuClose(); }}>
                            <Edit sx={{ mr: 1 }} /> Edit
                          </MuiMenuItem>
                        </Menu>
                      </>
                    ),
                  },
                ]} 
                pageSize={5}
                components={{ Toolbar: GridToolbar }}
              />
            </Box>
          )}

          {/* Add Item Form (Dialog) */}
          <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
            <DialogTitle>Add {selectedCategory}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={selectedCategory === "Overtime" ? "Rate" : "Amount"}
                    variant="outlined"
                    type="number"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={newItem.currency}
                      label="Currency"
                      onChange={(e) => setNewItem({ ...newItem, currency: e.target.value })}
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="UGX">UGX</MenuItem>
                      <MenuItem value="INR">INR</MenuItem>
                      <MenuItem value="NGN">NGN</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {selectedCategory !== "Deductions" && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newItem.taxable}
                          onChange={(e) => setNewItem({ ...newItem, taxable: e.target.checked })}
                        />
                      }
                      label="Taxable"
                    />
                  </Grid>
                )}
                {selectedCategory === "Deductions" && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newItem.statutory || false}
                          onChange={(e) => setNewItem({ ...newItem, statutory: e.target.checked })}
                        />
                      }
                      label="Statutory Deduction"
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleSaveItem} color="primary" variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {activeTab === "runPayroll" && (
        <Box>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Run Payroll
          </Typography>

          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2}>Payroll Period</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={payrollPeriod.start}
                    onChange={(newValue) => setPayrollPeriod({ ...payrollPeriod, start: newValue })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={payrollPeriod.end}
                    onChange={(newValue) => setPayrollPeriod({ ...payrollPeriod, end: newValue })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2}>Select Employees</Typography>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={employees}
                columns={employeeColumns}
                pageSize={5}
                checkboxSelection={false}
                disableSelectionOnClick
                components={{ Toolbar: GridToolbar }}
              />
            </Box>
          </Card>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={runPayroll}
              disabled={selectedEmployees.length === 0}
              startIcon={<AttachMoney />}
            >
              Process Payroll
            </Button>
          </Box>

          {processedPayroll.length > 0 && (
            <Card sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" mb={2}>Payroll Results</Typography>
              <Box sx={{ height: 400 }}>
                <DataGrid
                  rows={processedPayroll}
                  columns={payrollColumns}
                  pageSize={5}
                  components={{ Toolbar: GridToolbar }}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="outlined" sx={{ mr: 2 }} startIcon={<Print />}>
                  Print Payslips
                </Button>
                <Button variant="contained" color="success" startIcon={<Download />}>
                  Export Payroll
                </Button>
              </Box>
            </Card>
          )}
        </Box>
      )}

      {activeTab === "selfService" && (
        <Box>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Employee Self-Service Portal
          </Typography>
          
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={3}>My Payslips</Typography>
            <DataGrid
              rows={processedPayroll.filter(emp => selectedEmployees.includes(emp.id))}
              columns={[
                { field: "period", headerName: "Period", flex: 1, valueGetter: () => `${payrollPeriod.start.toLocaleDateString()} - ${payrollPeriod.end.toLocaleDateString()}` },
                { field: "grossPay", headerName: "Gross Pay", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
                { field: "netPay", headerName: "Net Pay", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
                {
                  field: "actions",
                  headerName: "Actions",
                  flex: 1,
                  renderCell: (params) => (
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => console.log("View payslip", params.row)}
                    >
                      View
                    </Button>
                  ),
                },
              ]}
              autoHeight
              pageSize={5}
            />
          </Card>
          
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>My Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Full Name" fullWidth value="Kwame Mensah" disabled />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Email" fullWidth value="kwame@example.com" disabled />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Bank Account" fullWidth value="1234567890" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Bank Name" fullWidth value="Standard Chartered" />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary">
                  Update Information
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}

      {activeTab === "reports" && (
        <Box>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Payroll Reports & Analytics
          </Typography>
          
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={3}>Generate Report</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select label="Report Type" defaultValue="payroll_summary">
                    <MenuItem value="payroll_summary">Payroll Summary</MenuItem>
                    <MenuItem value="tax_report">Tax Report</MenuItem>
                    <MenuItem value="employee_earnings">Employee Earnings</MenuItem>
                    <MenuItem value="deductions_report">Deductions Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To Date"
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" startIcon={<Search />}>
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Card>
          
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>Payroll Trends</Typography>
            <Box height={400}>
              {/* Placeholder for chart */}
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography color="textSecondary">Payroll trend charts will appear here</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      {activeTab === "tax" && (
        <Box>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Tax Compliance Center
          </Typography>
          
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={3}>Government Forms</Typography>
            <Grid container spacing={2}>
              {["SSS", "PhilHealth", "Pag-IBIG", "BIR"].map((form, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ p: 2, textAlign: "center", cursor: "pointer", "&:hover": { boxShadow: 3 } }}>
                    <Receipt sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                    <Typography variant="subtitle1">{form} Form</Typography>
                    <Typography variant="body2" color="textSecondary">For {payrollPeriod.start.toLocaleDateString()} period</Typography>
                    <Button size="small" sx={{ mt: 1 }}>Generate</Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
          
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>Tax Calculations</Typography>
            <DataGrid
              rows={processedPayroll.map(emp => ({
                ...emp,
                taxRate: taxRates[emp.currency].incomeTax * 100,
                socialSecurity: emp.grossPay * taxRates[emp.currency].socialSecurity,
              }))}
              columns={[
                { field: "name", headerName: "Employee", flex: 1 },
                { field: "grossPay", headerName: "Taxable Income", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
                { field: "taxRate", headerName: "Tax Rate", flex: 0.5, valueFormatter: (params) => `${params.value}%` },
                { field: "tax", headerName: "Income Tax", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
                { field: "socialSecurity", headerName: "Social Security", flex: 1, valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}` },
              ]}
              autoHeight
              pageSize={5}
            />
          </Card>
        </Box>
      )}

      {activeTab === "settings" && (
        <Box>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Payroll Settings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" mb={3}>Payslip Settings</Typography>
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={payslipSettings.showLogo}
                        onChange={() => handlePayslipSettingChange("showLogo")}
                      />
                    }
                    label="Show Company Logo"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={payslipSettings.showEmployeeId}
                        onChange={() => handlePayslipSettingChange("showEmployeeId")}
                      />
                    }
                    label="Show Employee ID"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={payslipSettings.showBankDetails}
                        onChange={() => handlePayslipSettingChange("showBankDetails")}
                      />
                    }
                    label="Show Bank Details"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={payslipSettings.showYTD}
                        onChange={() => handlePayslipSettingChange("showYTD")}
                      />
                    }
                    label="Show Year-to-Date Values"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={payslipSettings.showBusinessAddress}
                        onChange={() => handlePayslipSettingChange("showBusinessAddress")}
                      />
                    }
                    label="Show Business Address"
                  />
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" mb={3}>Attendance Settings</Typography>
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendanceSettings.qrCodeCheckIn}
                        onChange={() => handleAttendanceSettingChange("qrCodeCheckIn")}
                      />
                    }
                    label="Enable QR Code Check-in"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendanceSettings.gpsTracking}
                        onChange={() => handleAttendanceSettingChange("gpsTracking")}
                      />
                    }
                    label="Enable GPS Tracking"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendanceSettings.selfieVerification}
                        onChange={() => handleAttendanceSettingChange("selfieVerification")}
                      />
                    }
                    label="Require Selfie Verification"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendanceSettings.autoAttendance}
                        onChange={() => handleAttendanceSettingChange("autoAttendance")}
                      />
                    }
                    label="Enable Auto Attendance"
                  />
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" mb={3}>Payroll Cycle Settings</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Pay Cycle</InputLabel>
                      <Select defaultValue="monthly" label="Pay Cycle">
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="biweekly">Bi-weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Salary Calculation</InputLabel>
                      <Select defaultValue="working_days" label="Salary Calculation">
                        <MenuItem value="working_days">Working Days</MenuItem>
                        <MenuItem value="calendar_days">Calendar Days</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Work Week</InputLabel>
                      <Select defaultValue="mon_fri" label="Work Week">
                        <MenuItem value="mon_fri">Monday - Friday</MenuItem>
                        <MenuItem value="mon_sat">Monday - Saturday</MenuItem>
                        <MenuItem value="sun_thu">Sunday - Thursday</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default PayrollSystem;