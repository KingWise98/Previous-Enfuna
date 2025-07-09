import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Card,
  Avatar,
  Chip,
  Badge,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  MoreVert,
  Add,
  Print,
  Download,
  Visibility,
  Edit,
  Delete,
  Receipt,
  AccessTime,
  CalendarToday,
  People,
  BarChart,
  AccountBalance,
  SyncAlt,
  QrCode,
  LocationOn,
  CameraAlt,
  DateRange,
  FilterList,
  Search,
  AttachMoney,
  MoneyOff,
  Security,
  CloudUpload,
  CloudDownload,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Sample data
const designations = ["Finance", "Developer", "HR", "Marketing", "Sales"];
const departments = ["IT", "Finance", "HR", "Operations", "Sales"];
const shiftTypes = ["Morning (8am-4pm)", "Evening (4pm-12am)", "Night (12am-8am)", "Flexible"];

const initialEmployees = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "Alice Johnson",
    email: "alice@example.com",
    phoneNumber: "+256 123 456 789",
    designation: "Finance",
    department: "Finance",
    dateJoined: "2023-06-15",
    salary: 5000,
    currency: "USD",
    status: "active",
    shift: "Morning (8am-4pm)",
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Bob Williams",
    email: "bob@example.com",
    phoneNumber: "+256 987 654 321",
    designation: "Developer",
    department: "IT",
    dateJoined: "2022-08-10",
    salary: 6500,
    currency: "USD",
    status: "active",
    shift: "Flexible",
  },
];

const initialTimeEntries = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "Alice Johnson",
    date: "2023-10-01",
    timeIn: "08:00",
    timeOut: "16:30",
    status: "Present",
    hoursWorked: 8.5,
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Bob Williams",
    date: "2023-10-01",
    timeIn: "09:15",
    timeOut: "17:45",
    status: "Late",
    hoursWorked: 8.5,
  },
];

const initialClaims = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "Alice Johnson",
    date: "2023-09-15",
    type: "Travel",
    amount: 150,
    currency: "USD",
    status: "Approved",
    description: "Client meeting transportation",
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Bob Williams",
    date: "2023-09-20",
    type: "Meal",
    amount: 75,
    currency: "USD",
    status: "Pending",
    description: "Team lunch with clients",
  },
];

const EmployeeManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState(initialEmployees);
  const [timeEntries, setTimeEntries] = useState(initialTimeEntries);
  const [claims, setClaims] = useState(initialClaims);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    phoneNumber: "",
    designation: "Finance",
    department: "IT",
    dateJoined: "",
    salary: "",
    currency: "USD",
    status: "active",
    shift: "Morning (8am-4pm)",
  });
  const [newTimeEntry, setNewTimeEntry] = useState({
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    timeIn: "08:00",
    timeOut: "17:00",
  });
  const [newClaim, setNewClaim] = useState({
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    type: "Travel",
    amount: "",
    currency: "USD",
    description: "",
  });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [qrScanOpen, setQrScanOpen] = useState(false);
  const [attendanceSettings, setAttendanceSettings] = useState({
    qrCodeCheckIn: true,
    gpsTracking: true,
    selfieVerification: false,
    autoAttendance: false,
  });

  // Tab handling
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Employee functions
  const handleAddEmployeeOpen = () => {
    setOpenDialog(true);
    setSelectedType("employee");
  };

  const handleAddEmployee = () => {
    const newEntry = {
      id: employees.length + 1,
      ...newEmployee,
      salary: Number(newEmployee.salary),
    };
    setEmployees([...employees, newEntry]);
    setNewEmployee({
      employeeId: "",
      name: "",
      email: "",
      phoneNumber: "",
      designation: "Finance",
      department: "IT",
      dateJoined: "",
      salary: "",
      currency: "USD",
      status: "active",
      shift: "Morning (8am-4pm)",
    });
    setOpenDialog(false);
  };

  // Time entry functions
  const handleAddTimeEntryOpen = () => {
    setOpenDialog(true);
    setSelectedType("timeEntry");
  };

  const handleAddTimeEntry = () => {
    const employee = employees.find(emp => emp.employeeId === newTimeEntry.employeeId);
    if (!employee) return;

    const timeIn = new Date(`2000-01-01T${newTimeEntry.timeIn}`);
    const timeOut = new Date(`2000-01-01T${newTimeEntry.timeOut}`);
    const diff = (timeOut - timeIn) / (1000 * 60 * 60); // hours
    
    let status = "Present";
    if (newTimeEntry.timeIn > "09:00") status = "Late";
    if (!newTimeEntry.timeOut) status = "Absent";

    const newEntry = {
      id: timeEntries.length + 1,
      employeeId: newTimeEntry.employeeId,
      name: employee.name,
      date: newTimeEntry.date,
      timeIn: newTimeEntry.timeIn,
      timeOut: newTimeEntry.timeOut,
      status,
      hoursWorked: diff,
    };
    
    setTimeEntries([...timeEntries, newEntry]);
    setNewTimeEntry({
      employeeId: "",
      date: new Date().toISOString().split('T')[0],
      timeIn: "08:00",
      timeOut: "17:00",
    });
    setOpenDialog(false);
  };

  // Claim functions
  const handleAddClaimOpen = () => {
    setOpenDialog(true);
    setSelectedType("claim");
  };

  const handleAddClaim = () => {
    const employee = employees.find(emp => emp.employeeId === newClaim.employeeId);
    if (!employee) return;

    const newEntry = {
      id: claims.length + 1,
      employeeId: newClaim.employeeId,
      name: employee.name,
      date: newClaim.date,
      type: newClaim.type,
      amount: Number(newClaim.amount),
      currency: newClaim.currency,
      status: "Pending",
      description: newClaim.description,
    };
    
    setClaims([...claims, newEntry]);
    setNewClaim({
      employeeId: "",
      date: new Date().toISOString().split('T')[0],
      type: "Travel",
      amount: "",
      currency: "USD",
      description: "",
    });
    setOpenDialog(false);
  };

  // Common functions
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedType(null);
  };

  const handleActionClick = (event, id, type) => {
    setMenuAnchor(event.currentTarget);
    setSelectedId(id);
    setSelectedType(type);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedId(null);
    setSelectedType(null);
  };

  const handleDelete = () => {
    if (selectedType === "employee") {
      setEmployees(employees.filter(emp => emp.id !== selectedId));
    } else if (selectedType === "timeEntry") {
      setTimeEntries(timeEntries.filter(entry => entry.id !== selectedId));
    } else if (selectedType === "claim") {
      setClaims(claims.filter(claim => claim.id !== selectedId));
    }
    handleMenuClose();
  };

  const handleGeneratePayslip = (id) => {
    alert(`Payslip generated for Employee ID: ${id}`);
  };

  const handleApproveClaim = (id) => {
    setClaims(claims.map(claim => 
      claim.id === id ? { ...claim, status: "Approved" } : claim
    ));
  };

  const handleRejectClaim = (id) => {
    setClaims(claims.map(claim => 
      claim.id === id ? { ...claim, status: "Rejected" } : claim
    ));
  };

  // Columns
  const employeeColumns = [
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1.5,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2 }}>{params.row.name.charAt(0)}</Avatar>
          <Typography>{params.row.name}</Typography>
        </Box>
      ),
    },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { 
      field: "salary", 
      headerName: "Salary", 
      flex: 1,
      valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}`,
    },
    { 
      field: "shift", 
      headerName: "Shift", 
      flex: 1,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value.includes("Flexible") ? "success" : "primary"} 
          size="small"
        />
      ),
    },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 0.8,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === "active" ? "success" : "error"} 
          size="small"
        />
      ),
    },
    {
      field: "payslip",
      headerName: "Payslip",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Receipt />}
          onClick={() => handleGeneratePayslip(params.row.employeeId)}
          fullWidth
          size="small"
        >
          Generate
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleActionClick(event, params.row.id, "employee")}>
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const timeEntryColumns = [
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "timeIn", headerName: "Time In", flex: 1 },
    { field: "timeOut", headerName: "Time Out", flex: 1 },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === "Present" ? "success" : 
            params.value === "Late" ? "warning" : "error"
          } 
          size="small"
        />
      ),
    },
    { 
      field: "hoursWorked", 
      headerName: "Hours Worked", 
      flex: 1,
      valueFormatter: (params) => `${params.value.toFixed(1)} hours`,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleActionClick(event, params.row.id, "timeEntry")}>
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const claimColumns = [
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { 
      field: "amount", 
      headerName: "Amount", 
      flex: 1,
      valueFormatter: (params) => `${params.row.currency} ${params.value.toLocaleString()}`,
    },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === "Approved" ? "success" : 
            params.value === "Pending" ? "warning" : "error"
          } 
          size="small"
        />
      ),
    },
    {
      field: "approve",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          size="small"
          disabled={params.row.status !== "Pending"}
          onClick={() => handleApproveClaim(params.row.id)}
          fullWidth
        >
          Approve
        </Button>
      ),
    },
    {
      field: "reject",
      headerName: "Reject",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          disabled={params.row.status !== "Pending"}
          onClick={() => handleRejectClaim(params.row.id)}
          fullWidth
        >
          Reject
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleActionClick(event, params.row.id, "claim")}>
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  // Stats for dashboard
  const stats = [
    { title: "Total Employees", value: employees.length, icon: <People />, color: "primary" },
    { title: "Active Today", value: timeEntries.filter(e => e.date === new Date().toISOString().split('T')[0]).length, icon: <AccessTime />, color: "success" },
    { title: "Pending Claims", value: claims.filter(c => c.status === "Pending").length, icon: <AttachMoney />, color: "warning" },
    { title: "Monthly Payroll", value: employees.reduce((sum, emp) => sum + emp.salary, 0), icon: <AccountBalance />, color: "info" },
  ];

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Employee Management System
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SyncAlt />} 
            sx={{ mr: 2 }}
            onClick={() => setQrScanOpen(true)}
          >
            Clock In/Out
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
          <Tab label="Employees" value="employees" icon={<People />} />
          <Tab label="Time Tracking" value="timeTracking" icon={<AccessTime />} />
          <Tab label="Claims" value="claims" icon={<Receipt />} />
          <Tab label="Reports" value="reports" icon={<BarChart />} />
          <Tab label="Settings" value="settings" icon={<Security />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <Box>
          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ p: 3, height: "100%" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" color="textSecondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.title.includes("Monthly Payroll") ? 
                          `$${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
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

          {/* Recent Activity */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" mb={3}>Today's Attendance</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Time In</TableCell>
                        <TableCell>Time Out</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {timeEntries
                        .filter(entry => entry.date === new Date().toISOString().split('T')[0])
                        .slice(0, 5)
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell>{entry.timeIn}</TableCell>
                            <TableCell>{entry.timeOut || "-"}</TableCell>
                            <TableCell>
                              <Chip 
                                label={entry.status} 
                                color={
                                  entry.status === "Present" ? "success" : 
                                  entry.status === "Late" ? "warning" : "error"
                                } 
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" mb={3}>Pending Claims</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {claims
                        .filter(claim => claim.status === "Pending")
                        .slice(0, 5)
                        .map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell>{claim.name}</TableCell>
                            <TableCell>{claim.type}</TableCell>
                            <TableCell>{claim.currency} {claim.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Box display="flex" gap={1}>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  color="success"
                                  onClick={() => handleApproveClaim(claim.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="error"
                                  onClick={() => handleRejectClaim(claim.id)}
                                >
                                  Reject
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === "employees" && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Employee Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddEmployeeOpen}
            >
              Add Employee
            </Button>
          </Box>
          
          <Box sx={{ height: "60vh" }}>
            <DataGrid 
              rows={employees} 
              columns={employeeColumns} 
              pageSize={5}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      )}

      {activeTab === "timeTracking" && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Time and Attendance
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddTimeEntryOpen}
              >
                Add Entry
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<QrCode />}
                onClick={() => setQrScanOpen(true)}
              >
                QR Check-In
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ height: "60vh" }}>
            <DataGrid 
              rows={timeEntries} 
              columns={timeEntryColumns} 
              pageSize={5}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      )}

      {activeTab === "claims" && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Employee Claims & Reimbursements
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddClaimOpen}
            >
              Add Claim
            </Button>
          </Box>
          
          <Box sx={{ height: "60vh" }}>
            <DataGrid 
              rows={claims} 
              columns={claimColumns} 
              pageSize={5}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      )}

      {activeTab === "reports" && (
        <Box>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Reports & Analytics
          </Typography>
          
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={3}>Generate Report</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select label="Report Type" defaultValue="attendance_summary">
                    <MenuItem value="attendance_summary">Attendance Summary</MenuItem>
                    <MenuItem value="payroll_report">Payroll Report</MenuItem>
                    <MenuItem value="claims_report">Claims Report</MenuItem>
                    <MenuItem value="employee_performance">Employee Performance</MenuItem>
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
            <Typography variant="h6" mb={3}>Attendance Trends</Typography>
            <Box height={400}>
              {/* Placeholder for chart */}
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography color="textSecondary">Attendance trend charts will appear here</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      {activeTab === "settings" && (
        <Box>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            System Settings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" mb={3}>Attendance Settings</Typography>
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendanceSettings.qrCodeCheckIn}
                        onChange={() => setAttendanceSettings({...attendanceSettings, qrCodeCheckIn: !attendanceSettings.qrCodeCheckIn})}
                      />
                    }
                    label="Enable QR Code Check-in"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendanceSettings.gpsTracking}
                        onChange={() => setAttendanceSettings({...attendanceSettings, gpsTracking: !attendanceSettings.gpsTracking})}
                      />
                    }
                    label="Enable GPS Location Tracking"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendanceSettings.selfieVerification}
                        onChange={() => setAttendanceSettings({...attendanceSettings, selfieVerification: !attendanceSettings.selfieVerification})}
                      />
                    }
                    label="Require Selfie Verification"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendanceSettings.autoAttendance}
                        onChange={() => setAttendanceSettings({...attendanceSettings, autoAttendance: !attendanceSettings.autoAttendance})}
                      />
                    }
                    label="Enable Auto Attendance"
                  />
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" mb={3}>Shift Management</Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Default Shift</InputLabel>
                  <Select label="Default Shift" defaultValue="Morning (8am-4pm)">
                    {shiftTypes.map(shift => (
                      <MenuItem key={shift} value={shift}>{shift}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" startIcon={<Add />}>
                  Add New Shift Pattern
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Action Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Add Employee Dialog */}
      <Dialog open={openDialog && selectedType === "employee"} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Employee ID"
                fullWidth
                variant="outlined"
                value={newEmployee.employeeId}
                onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                variant="outlined"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                fullWidth
                variant="outlined"
                value={newEmployee.phoneNumber}
                onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Designation</InputLabel>
                <Select
                  label="Designation"
                  value={newEmployee.designation}
                  onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
                >
                  {designations.map(designation => (
                    <MenuItem key={designation} value={designation}>{designation}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                >
                  {departments.map(department => (
                    <MenuItem key={department} value={department}>{department}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date Joined"
                  value={newEmployee.dateJoined}
                  onChange={(newValue) => setNewEmployee({ ...newEmployee, dateJoined: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Shift</InputLabel>
                <Select
                  label="Shift"
                  value={newEmployee.shift}
                  onChange={(e) => setNewEmployee({ ...newEmployee, shift: e.target.value })}
                >
                  {shiftTypes.map(shift => (
                    <MenuItem key={shift} value={shift}>{shift}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Salary"
                fullWidth
                variant="outlined"
                type="number"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  label="Currency"
                  value={newEmployee.currency}
                  onChange={(e) => setNewEmployee({ ...newEmployee, currency: e.target.value })}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="UGX">UGX</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newEmployee.status === "active"}
                    onChange={(e) => setNewEmployee({ 
                      ...newEmployee, 
                      status: e.target.checked ? "active" : "inactive" 
                    })}
                  />
                }
                label="Active Employee"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddEmployee} color="primary" variant="contained">
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Time Entry Dialog */}
      <Dialog open={openDialog && selectedType === "timeEntry"} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Time Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  label="Employee"
                  value={newTimeEntry.employeeId}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, employeeId: e.target.value })}
                >
                  {employees.map(employee => (
                    <MenuItem key={employee.id} value={employee.employeeId}>
                      {employee.name} ({employee.employeeId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={newTimeEntry.date}
                  onChange={(newValue) => setNewTimeEntry({ ...newTimeEntry, date: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Time In"
                fullWidth
                type="time"
                value={newTimeEntry.timeIn}
                onChange={(e) => setNewTimeEntry({ ...newTimeEntry, timeIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Time Out"
                fullWidth
                type="time"
                value={newTimeEntry.timeOut}
                onChange={(e) => setNewTimeEntry({ ...newTimeEntry, timeOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTimeEntry} color="primary" variant="contained">
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Claim Dialog */}
      <Dialog open={openDialog && selectedType === "claim"} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Claim</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  label="Employee"
                  value={newClaim.employeeId}
                  onChange={(e) => setNewClaim({ ...newClaim, employeeId: e.target.value })}
                >
                  {employees.map(employee => (
                    <MenuItem key={employee.id} value={employee.employeeId}>
                      {employee.name} ({employee.employeeId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={newClaim.date}
                  onChange={(newValue) => setNewClaim({ ...newClaim, date: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Claim Type</InputLabel>
                <Select
                  label="Claim Type"
                  value={newClaim.type}
                  onChange={(e) => setNewClaim({ ...newClaim, type: e.target.value })}
                >
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Meal">Meal</MenuItem>
                  <MenuItem value="Accommodation">Accommodation</MenuItem>
                  <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  label="Currency"
                  value={newClaim.currency}
                  onChange={(e) => setNewClaim({ ...newClaim, currency: e.target.value })}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="UGX">UGX</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                fullWidth
                type="number"
                value={newClaim.amount}
                onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newClaim.description}
                onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddClaim} color="primary" variant="contained">
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Scan Dialog */}
      <Dialog open={qrScanOpen} onClose={() => setQrScanOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Employee Check-In/Out</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={4}>
            <QrCode sx={{ fontSize: 200, color: "primary.main", mb: 3 }} />
            <Typography variant="h6" mb={2}>
              Scan Employee QR Code
            </Typography>
            <Typography color="textSecondary" mb={4}>
              Position the QR code within the frame to register attendance
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => {
                alert("Attendance recorded successfully!");
                setQrScanOpen(false);
              }}
            >
              Simulate Scan
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrScanOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagementSystem;