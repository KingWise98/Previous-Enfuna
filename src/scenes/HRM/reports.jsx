import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  CardContent,
  Button,
  Paper,
  Avatar,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Pie,
  Bar,
  Line,
  Doughnut,
} from "react-chartjs-2";
import {
  GetApp as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Groups as TeamIcon,
  Work as WorkIcon,
  AccessTime as TimeIcon,
  Equalizer as StatsIcon,
} from "@mui/icons-material";
import "chart.js/auto";
import { faker } from "@faker-js/faker";

// Generate realistic dummy data
const generateEmployees = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    role: faker.person.jobTitle(),
    department: faker.helpers.arrayElement(["IT", "HR", "Finance", "Marketing", "Sales"]),
    country: faker.location.countryCode(),
    salary: faker.number.int({ min: 30000, max: 120000 }),
    rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
    status: faker.helpers.arrayElement(["Active", "On Leave", "Terminated"]),
    joinDate: faker.date.past({ years: 3 }).toISOString().split('T')[0],
    avatar: faker.image.avatar(),
  }));
};

const generateMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map(month => faker.number.int({ min: 5, max: 50 }));
};

const employees = generateEmployees(50);
const topEmployees = employees
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4)
  .map(emp => ({
    ...emp,
    rating: `⭐ ${emp.rating.toFixed(1)}`
  }));

const employeeOfTheMonth = {
  ...employees[0],
  rating: "⭐ 5.0",
  achievement: "Exceeded Q2 sales targets by 35%",
};

const hrMetrics = {
  payrollBreakdown: {
    labels: ["Salaries", "Bonuses", "Overtime", "Benefits", "Taxes"],
    data: [400000, 70000, 20000, 50000, 30000],
    colors: ["#7E57C2", "#FF7043", "#29B6F6", "#66BB6A", "#EF5350"]
  },
  genderDiversity: {
    labels: ["Male", "Female", "Other"],
    data: [60, 37, 3],
    colors: ["#42A5F5", "#F06292", "#26A69A"]
  },
  departmentDistribution: {
    labels: ["IT", "HR", "Finance", "Marketing", "Sales", "Operations"],
    data: [30, 15, 20, 15, 15, 5],
    colors: ["#FFA726", "#AB47BC", "#29B6F6", "#66BB6A", "#FF7043", "#8D6E63"]
  },
  turnoverRate: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: generateMonthlyData(),
    color: "#FFCA28"
  },
  absenteeismRate: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: generateMonthlyData(),
    color: "#FF5722"
  },
  overtimeHours: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: generateMonthlyData().map(x => x * 2),
    color: "#42A5F5"
  },
  satisfaction: {
    labels: ["Satisfied", "Neutral", "Dissatisfied"],
    data: [65, 25, 10],
    colors: ["#66BB6A", "#FFCA28", "#EF5350"]
  },
  leaveTrends: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: generateMonthlyData(),
    color: "#AB47BC"
  },
  recruitment: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: generateMonthlyData(),
    color: "#26C6DA"
  },
  trainingHours: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: generateMonthlyData().map(x => x * 10),
    color: "#8D6E63"
  }
};

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("last12months");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#2c3e50" }}>
          Employee Management Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Chip
            avatar={<Avatar src={faker.image.avatar()} />}
            label="Admin"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#3f51b5",
            },
          }}
        >
          <Tab label="Overview" value="overview" icon={<StatsIcon />} />
          <Tab label="Employee Directory" value="directory" icon={<PersonIcon />} />
          <Tab label="Payroll" value="payroll" icon={<MoneyIcon />} />
          <Tab label="Attendance" value="attendance" icon={<TimeIcon />} />
          <Tab label="Performance" value="performance" icon={<StarIcon />} />
          <Tab label="Recruitment" value="recruitment" icon={<TeamIcon />} />
          <Tab label="Training" value="training" icon={<WorkIcon />} />
        </Tabs>
      </Paper>

      {/* Time Range Filter */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="last7days">Last 7 Days</MenuItem>
            <MenuItem value="last30days">Last 30 Days</MenuItem>
            <MenuItem value="last3months">Last 3 Months</MenuItem>
            <MenuItem value="last6months">Last 6 Months</MenuItem>
            <MenuItem value="last12months">Last 12 Months</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ textTransform: "none" }}
          >
            Filters
          </Button>
          <TextField
            size="small"
            placeholder="Search employees..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      </Box>

      {/* Dashboard Content */}
      {activeTab === "overview" && (
        <>
          {/* Key Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[
              {
                title: "Total Employees",
                value: employees.length,
                change: "+12%",
                icon: <PersonIcon fontSize="large" />,
                color: "#3f51b5",
              },
              {
                title: "Active Employees",
                value: employees.filter(e => e.status === "Active").length,
                change: "+5%",
                icon: <TeamIcon fontSize="large" />,
                color: "#4caf50",
              },
             {
  title: "Monthly Payroll",
  value: `$${(employees.reduce((sum, emp) => sum + emp.salary, 0) / 12).toLocaleString()}`,
  change: "-2%",
  icon: <MoneyIcon fontSize="large" />,
  color: "#ff9800",
},
              {
                title: "Avg. Satisfaction",
                  value: `$${(employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length, 0).toFixed(1)}`,
                change: "+0.5",
                icon: <StarIcon fontSize="large" />,
                color: "#e91e63",
              },
            ].map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ p: 3, height: "100%", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        {metric.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                        {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                      </Typography>
                      <Chip
                        label={metric.change}
                        size="small"
                        sx={{
                          mt: 1,
                          backgroundColor: metric.change.startsWith("+") ? "#e8f5e9" : "#ffebee",
                          color: metric.change.startsWith("+") ? "#2e7d32" : "#c62828",
                        }}
                      />
                    </Box>
                    <Avatar sx={{ backgroundColor: `${metric.color}20`, color: metric.color }}>
                      {metric.icon}
                    </Avatar>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Top Employees & Employee of the Month */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Top Performing Employees
                </Typography>
                <Grid container spacing={2}>
                  {topEmployees.map((employee, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={employee.avatar} />
                        <Box>
                          <Typography fontWeight="bold">{employee.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {employee.role} • {employee.department}
                          </Typography>
                          <Typography variant="body2">{employee.rating}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, borderRadius: 2, height: "100%", backgroundColor: "#fff8e1" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <TrophyIcon sx={{ fontSize: 60, color: "#ffc107", mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Employee of the Month
                  </Typography>
                  <Avatar src={employeeOfTheMonth.avatar} sx={{ width: 80, height: 80, mt: 2, mb: 2 }} />
                  <Typography fontWeight="bold">{employeeOfTheMonth.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {employeeOfTheMonth.role} • {employeeOfTheMonth.department}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>{employeeOfTheMonth.rating}</Typography>
                  <Typography variant="body2" fontStyle="italic" sx={{ color: "#ff6d00" }}>
                    "{employeeOfTheMonth.achievement}"
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            HR Analytics
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: "Payroll Breakdown",
                chart: (
                  <Doughnut
                    data={{
                      labels: hrMetrics.payrollBreakdown.labels,
                      datasets: [
                        {
                          data: hrMetrics.payrollBreakdown.data,
                          backgroundColor: hrMetrics.payrollBreakdown.colors,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: { position: "right" },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return ` ${context.label}: $${context.raw.toLocaleString()}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                ),
              },
              {
                title: "Department Distribution",
                chart: (
                  <Pie
                    data={{
                      labels: hrMetrics.departmentDistribution.labels,
                      datasets: [
                        {
                          data: hrMetrics.departmentDistribution.data,
                          backgroundColor: hrMetrics.departmentDistribution.colors,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: { position: "right" },
                      },
                    }}
                  />
                ),
              },
              {
                title: "Employee Turnover Rate",
                chart: (
                  <Line
                    data={{
                      labels: hrMetrics.turnoverRate.labels,
                      datasets: [
                        {
                          label: "Turnover Rate (%)",
                          data: hrMetrics.turnoverRate.data,
                          borderColor: hrMetrics.turnoverRate.color,
                          backgroundColor: `${hrMetrics.turnoverRate.color}20`,
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                ),
              },
              {
                title: "Overtime Hours Trend",
                chart: (
                  <Bar
                    data={{
                      labels: hrMetrics.overtimeHours.labels,
                      datasets: [
                        {
                          label: "Overtime Hours",
                          data: hrMetrics.overtimeHours.data,
                          backgroundColor: hrMetrics.overtimeHours.color,
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                ),
              },
              {
                title: "Employee Satisfaction",
                chart: (
                  <Pie
                    data={{
                      labels: hrMetrics.satisfaction.labels,
                      datasets: [
                        {
                          data: hrMetrics.satisfaction.data,
                          backgroundColor: hrMetrics.satisfaction.colors,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: { position: "right" },
                      },
                    }}
                  />
                ),
              },
              {
                title: "Recruitment Pipeline",
                chart: (
                  <Line
                    data={{
                      labels: hrMetrics.recruitment.labels,
                      datasets: [
                        {
                          label: "New Hires",
                          data: hrMetrics.recruitment.data,
                          borderColor: hrMetrics.recruitment.color,
                          backgroundColor: `${hrMetrics.recruitment.color}20`,
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                  />
                ),
              },
            ].map((item, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ height: 300 }}>{item.chart}</Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === "directory" && (
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Employee Directory
          </Typography>
          <Grid container spacing={3}>
            {filteredEmployees.map((employee) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
                <Card sx={{ p: 2, borderRadius: 2, height: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Avatar src={employee.avatar} sx={{ width: 80, height: 80, mb: 2 }} />
                    <Typography fontWeight="bold">{employee.name}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {employee.role}
                    </Typography>
                    <Chip
                      label={employee.department}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StarIcon sx={{ color: "#ffc107", fontSize: 18 }} />
                      <Typography>{employee.rating.toFixed(1)}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      Joined: {employee.joinDate}
                    </Typography>
                    <Chip
                      label={employee.status}
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor:
                          employee.status === "Active" ? "#e8f5e9" :
                          employee.status === "On Leave" ? "#e3f2fd" : "#ffebee",
                        color:
                          employee.status === "Active" ? "#2e7d32" :
                          employee.status === "On Leave" ? "#1565c0" : "#c62828",
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {/* Export Options */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<ExcelIcon />}
          sx={{ textTransform: "none" }}
        >
          Export to Excel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<PdfIcon />}
          sx={{ textTransform: "none" }}
        >
          Export to PDF
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{ textTransform: "none" }}
        >
          Download Reports
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;