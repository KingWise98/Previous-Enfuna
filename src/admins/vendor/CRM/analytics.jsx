import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Typography,
  Select,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Avatar,
  Chip,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  MonetizationOn as MonetizationOnIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";

// Enhanced Data with Social Media Sources
const recentDeals = [
  { 
    id: 1, 
    dealName: "Cloud Services", 
    stage: "Completed", 
    dealValue: 50000, 
    owner: "Alice", 
    closedDate: "2024-02-10",
    source: "LinkedIn",
    duration: "45 days",
    contacts: ["Juan Pérez", "Maria Garcia"]
  },
  { 
    id: 2, 
    dealName: "AI Integration", 
    stage: "Planned", 
    dealValue: 30000, 
    owner: "Bob", 
    closedDate: "2024-02-15",
    source: "Twitter",
    duration: "30 days",
    contacts: ["James Smith"]
  },
  { 
    id: 3, 
    dealName: "Software Upgrade", 
    stage: "Active", 
    dealValue: 40000, 
    owner: "Charlie", 
    closedDate: "2024-02-20",
    source: "Email Campaign",
    duration: "60 days",
    contacts: ["Yassine Benali", "Fatima Zahra"]
  },
  { 
    id: 4, 
    dealName: "Data Analytics", 
    stage: "Negotiation", 
    dealValue: 35000, 
    owner: "David", 
    closedDate: "2024-02-25",
    source: "Facebook",
    duration: "50 days",
    contacts: ["John Doe"]
  },
  { 
    id: 5, 
    dealName: "Cybersecurity", 
    stage: "Proposal", 
    dealValue: 45000, 
    owner: "Eve", 
    closedDate: "2024-02-28",
    source: "Instagram",
    duration: "40 days",
    contacts: ["Kato Joseph", "Sarah Johnson"]
  },
];

const recentLeads = [
  { 
    id: 1, 
    leadName: "Juan Pérez", 
    companyName: "Tech Spain", 
    stage: "Completed", 
    createdDate: "2024-02-21", 
    owner: "Carlos",
    source: "LinkedIn",
    score: 95,
    lastContact: "2024-02-25"
  },
  { 
    id: 2, 
    leadName: "James Smith", 
    companyName: "UK Solutions", 
    stage: "Lost", 
    createdDate: "2024-02-22", 
    owner: "Olivia",
    source: "Twitter",
    score: 65,
    lastContact: "2024-02-24"
  },
  { 
    id: 3, 
    leadName: "Yassine Benali", 
    companyName: "Algeria Innovations", 
    stage: "Not Connected", 
    createdDate: "2024-02-23", 
    owner: "Ahmed",
    source: "Email Campaign",
    score: 75,
    lastContact: "2024-02-23"
  },
  { 
    id: 4, 
    leadName: "John Doe", 
    companyName: "US Digital", 
    stage: "Closed", 
    createdDate: "2024-02-24", 
    owner: "Emma",
    source: "Facebook",
    score: 85,
    lastContact: "2024-02-26"
  },
  { 
    id: 5, 
    leadName: "Kato Joseph", 
    companyName: "Uganda Tech", 
    stage: "Active", 
    createdDate: "2024-02-25", 
    owner: "Joshua",
    source: "Instagram",
    score: 90,
    lastContact: "2024-02-27"
  },
];

const statusColors = {
  Completed: "#4caf50",
  Closed: "#f44336",
  Lost: "#9e9e9e",
  "Not Connected": "#673ab7",
  Active: "#2196f3",
  Planned: "#ff9800",
  Negotiation: "#ff5722",
  Proposal: "#607d8b",
};

const sourceIcons = {
  LinkedIn: <LinkedInIcon />,
  Twitter: <TwitterIcon />,
  Facebook: <FacebookIcon />,
  Instagram: <InstagramIcon />,
  "Email Campaign": <EmailIcon />,
  Organic: <PersonIcon />,
  Referral: <BusinessIcon />,
};

const recentCompanies = [
  { 
    id: 1, 
    companyName: "Tech Spain", 
    email: "contact@techspain.com", 
    phone: "+34 111 222 333", 
    createdAt: "2024-02-19",
    industry: "Technology",
    employees: 150,
    revenue: "$50M",
    socialMedia: {
      linkedin: "linkedin.com/company/techspain",
      twitter: "@techspain",
      facebook: "facebook.com/techspain"
    }
  },
  { 
    id: 2, 
    companyName: "UK Solutions", 
    email: "info@uksolutions.co.uk", 
    phone: "+44 555 666 777", 
    createdAt: "2024-02-20",
    industry: "Consulting",
    employees: 80,
    revenue: "$20M",
    socialMedia: {
      linkedin: "linkedin.com/company/uksolutions",
      twitter: "@uksolutions"
    }
  },
  { 
    id: 3, 
    companyName: "Algeria Innovations", 
    email: "hello@algeriainnov.com", 
    phone: "+213 888 999 000", 
    createdAt: "2024-02-21",
    industry: "Software",
    employees: 200,
    revenue: "$75M",
    socialMedia: {
      linkedin: "linkedin.com/company/algeriainnov",
      facebook: "facebook.com/algeriainnov"
    }
  },
  { 
    id: 4, 
    companyName: "US Digital", 
    email: "support@usdigital.com", 
    phone: "+1 123 456 7890", 
    createdAt: "2024-02-22",
    industry: "Digital Marketing",
    employees: 120,
    revenue: "$45M",
    socialMedia: {
      linkedin: "linkedin.com/company/usdigital",
      twitter: "@usdigital",
      instagram: "@usdigital"
    }
  },
  { 
    id: 5, 
    companyName: "Uganda Tech", 
    email: "info@ugandatech.ug", 
    phone: "+256 777 888 999", 
    createdAt: "2024-02-23",
    industry: "Telecom",
    employees: 300,
    revenue: "$100M",
    socialMedia: {
      linkedin: "linkedin.com/company/ugandatech",
      twitter: "@ugandatech"
    }
  },
];

const pieChartData = [
  { name: "Organic", value: 40 },
  { name: "Referral", value: 25 },
  { name: "LinkedIn", value: 15 },
  { name: "Twitter", value: 10 },
  { name: "Facebook", value: 5 },
  { name: "Instagram", value: 3 },
  { name: "Email Campaign", value: 2 },
];

const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const dealStagesData = [
  { name: "Prospect", value: 15 },
  { name: "Qualified", value: 25 },
  { name: "Proposal", value: 20 },
  { name: "Negotiation", value: 15 },
  { name: "Closed Won", value: 15 },
  { name: "Closed Lost", value: 10 },
];

const revenueData = [
  { name: "Jan", revenue: 4000, deals: 10 },
  { name: "Feb", revenue: 3000, deals: 8 },
  { name: "Mar", revenue: 5000, deals: 12 },
  { name: "Apr", revenue: 2780, deals: 7 },
  { name: "May", revenue: 1890, deals: 5 },
  { name: "Jun", revenue: 6390, deals: 15 },
];

const socialMediaData = [
  { name: "LinkedIn", leads: 45, conversions: 15 },
  { name: "Twitter", leads: 30, conversions: 10 },
  { name: "Facebook", leads: 25, conversions: 8 },
  { name: "Instagram", leads: 20, conversions: 5 },
  { name: "Other", leads: 10, conversions: 2 },
];

const AnalyticsPage = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeTab, setActiveTab] = useState("deals");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const getSourceIcon = (source) => {
    return sourceIcons[source] || <PersonIcon />;
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Analytics Dashboard
        </Typography>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="quarterly">Quarterly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(245000)}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +12% from last period
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <MonetizationOnIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Deals
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    24
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +5 from last period
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                  <TimelineIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    New Leads
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    48
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    -3 from last period
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                  <PersonIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Conversion Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    32%
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +4% from last period
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                  <BusinessIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue and Deal Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Revenue & Deals Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                  <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} fill={theme.palette.primary.light} name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="deals" stroke={theme.palette.secondary.main} name="Deals" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Deal Stages
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={dealStagesData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dealStagesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(statusColors)[index % Object.values(statusColors).length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Social Media Performance */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Social Media Performance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={socialMediaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#8884d8" name="Leads Generated" />
              <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs for Recent Deals and Leads */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Button 
          variant={activeTab === 'deals' ? 'contained' : 'text'} 
          onClick={() => setActiveTab('deals')}
          sx={{ mr: 2 }}
        >
          Recent Deals
        </Button>
        <Button 
          variant={activeTab === 'leads' ? 'contained' : 'text'} 
          onClick={() => setActiveTab('leads')}
        >
          Recent Leads
        </Button>
      </Box>

      {activeTab === 'deals' ? (
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent Deals
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Deal Name</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Contacts</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Closed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentDeals.map((deal) => (
                    <TableRow key={deal.id} hover>
                      <TableCell>{deal.dealName}</TableCell>
                      <TableCell>
                        <Chip 
                          label={deal.stage} 
                          size="small"
                          sx={{ 
                            backgroundColor: statusColors[deal.stage], 
                            color: 'white',
                            minWidth: 100
                          }}
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(deal.dealValue)}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getSourceIcon(deal.source)}
                          <Typography ml={1}>{deal.source}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{deal.owner}</TableCell>
                      <TableCell>
                        {deal.contacts.map((contact, i) => (
                          <Typography key={i} variant="body2">{contact}</Typography>
                        ))}
                      </TableCell>
                      <TableCell>{deal.duration}</TableCell>
                      <TableCell>{deal.closedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent Leads
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lead Name</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Last Contact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLeads.map((lead) => (
                    <TableRow key={lead.id} hover>
                      <TableCell>{lead.leadName}</TableCell>
                      <TableCell>{lead.companyName}</TableCell>
                      <TableCell>
                        <Chip 
                          label={lead.stage} 
                          size="small"
                          sx={{ 
                            backgroundColor: statusColors[lead.stage], 
                            color: 'white',
                            minWidth: 100
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getSourceIcon(lead.source)}
                          <Typography ml={1}>{lead.source}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box width={50} height={8} bgcolor="#e0e0e0" borderRadius={4}>
                          <Box 
                            width={`${lead.score}%`} 
                            height="100%" 
                            bgcolor={lead.score > 80 ? "#4caf50" : lead.score > 60 ? "#ff9800" : "#f44336"}
                            borderRadius={4}
                          />
                        </Box>
                        <Typography variant="caption">{lead.score}</Typography>
                      </TableCell>
                      <TableCell>{lead.owner}</TableCell>
                      <TableCell>{lead.createdDate}</TableCell>
                      <TableCell>{lead.lastContact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Recently Created Companies */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Recently Created Companies
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Industry</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Social Media</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentCompanies.map((company) => (
                  <TableRow key={company.id} hover>
                    <TableCell>{company.companyName}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.employees} employees</TableCell>
                    <TableCell>{company.revenue}</TableCell>
                    <TableCell>
                      <Typography>{company.email}</Typography>
                      <Typography variant="body2">{company.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      {company.socialMedia.linkedin && (
                        <Box display="flex" alignItems="center" mb={0.5}>
                          <LinkedInIcon fontSize="small" color="primary" />
                          <Typography variant="body2" ml={1}>LinkedIn</Typography>
                        </Box>
                      )}
                      {company.socialMedia.twitter && (
                        <Box display="flex" alignItems="center" mb={0.5}>
                          <TwitterIcon fontSize="small" color="info" />
                          <Typography variant="body2" ml={1}>Twitter</Typography>
                        </Box>
                      )}
                      {company.socialMedia.facebook && (
                        <Box display="flex" alignItems="center" mb={0.5}>
                          <FacebookIcon fontSize="small" color="primary" />
                          <Typography variant="body2" ml={1}>Facebook</Typography>
                        </Box>
                      )}
                      {company.socialMedia.instagram && (
                        <Box display="flex" alignItems="center">
                          <InstagramIcon fontSize="small" color="secondary" />
                          <Typography variant="body2" ml={1}>Instagram</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{company.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Leads by Source */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Leads by Source
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={pieChartData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Conversion by Source
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;