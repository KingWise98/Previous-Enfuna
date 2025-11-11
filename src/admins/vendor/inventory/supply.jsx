import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, Divider, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, LinearProgress, 
  CircularProgress, IconButton, TextField, 
  MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';
import { 
  Timeline, TimelineItem, TimelineSeparator, 
  TimelineDot, TimelineConnector, TimelineContent 
} from '@mui/lab';
import { 
  Inventory, LocalShipping, AttachMoney, 
  Receipt, Assignment, Payment, 
  FilterList, Refresh, Search, 
  Warning, CheckCircle, Error 
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for the dashboard
const supplyChainData = {
  inventoryStatus: {
    totalItems: 1245,
    lowStock: 42,
    outOfStock: 8,
    categories: [
      { name: 'Electronics', value: 35 },
      { name: 'Raw Materials', value: 25 },
      { name: 'Packaging', value: 20 },
      { name: 'Office Supplies', value: 15 },
      { name: 'Other', value: 5 },
    ]
  },
  procurementMetrics: {
    poCreated: 128,
    poPending: 24,
    poDelivered: 89,
    poLate: 15,
    avgProcessingTime: '2.4 days',
    spendByCategory: [
      { name: 'Q1', Electronics: 4000, Materials: 2400, Supplies: 2400 },
      { name: 'Q2', Electronics: 3000, Materials: 1398, Supplies: 2210 },
      { name: 'Q3', Electronics: 2000, Materials: 9800, Supplies: 2290 },
      { name: 'Q4', Electronics: 2780, Materials: 3908, Supplies: 2000 },
    ]
  },
  recentTransactions: [
    { id: 'PO-1001', supplier: 'TechGlobal Inc.', amount: '$12,450', status: 'Delivered', date: '2023-05-15' },
    { id: 'PO-1002', supplier: 'Material World', amount: '$8,720', status: 'In Transit', date: '2023-05-12' },
    { id: 'PO-1003', supplier: 'Office Solutions', amount: '$3,210', status: 'Processing', date: '2023-05-10' },
    { id: 'PO-1004', supplier: 'Packaging Plus', amount: '$5,670', status: 'Delivered', date: '2023-05-08' },
    { id: 'PO-1005', supplier: 'Global Components', amount: '$15,230', status: 'Late', date: '2023-05-05' },
  ],
  pendingApprovals: [
    { id: 'INV-2023-045', supplier: 'TechGlobal Inc.', amount: '$12,450', daysPending: 2 },
    { id: 'INV-2023-046', supplier: 'Material World', amount: '$8,720', daysPending: 1 },
  ],
  supplyChainTimeline: [
    { 
      title: 'PO Created', 
      description: 'PO-1006 for $9,870 created', 
      time: '10:30 AM', 
      date: '2023-05-16',
      icon: <Assignment color="primary" />,
      status: 'completed'
    },
    { 
      title: 'Goods Received', 
      description: 'Received shipment for PO-1001 from TechGlobal', 
      time: '9:15 AM', 
      date: '2023-05-16',
      icon: <LocalShipping color="success" />,
      status: 'completed'
    },
    { 
      title: 'Invoice Received', 
      description: 'Invoice INV-2023-045 received for PO-1001', 
      time: 'Yesterday', 
      date: '2023-05-15',
      icon: <Receipt color="info" />,
      status: 'completed'
    },
    { 
      title: 'Payment Processed', 
      description: 'Payment sent to Packaging Plus for PO-1004', 
      time: 'Yesterday', 
      date: '2023-05-15',
      icon: <Payment color="success" />,
      status: 'completed'
    },
    { 
      title: 'PO Delayed', 
      description: 'PO-1005 from Global Components delayed', 
      time: 'May 12', 
      date: '2023-05-12',
      icon: <Warning color="warning" />,
      status: 'warning'
    },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const statusIcons = {
  Delivered: <CheckCircle color="success" fontSize="small" />,
  'In Transit': <CircularProgress color="info" size={20} />,
  Processing: <CircularProgress color="primary" size={20} />,
  Late: <Warning color="warning" fontSize="small" />,
  Error: <Error color="error" fontSize="small" />
};

const SupplyChainDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTransactions = supplyChainData.recentTransactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         transaction.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Supply Chain Management Dashboard
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search PO or Supplier..."
              InputProps={{
                startAdornment: <Search sx={{ mr: 1 }} />
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="In Transit">In Transit</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="quarter">Quarter to Date</MenuItem>
                <MenuItem value="year">Year to Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
            <IconButton>
              <FilterList />
            </IconButton>
            <IconButton>
              <Refresh />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Inventory Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Inventory color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Inventory Status</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Total Items</Typography>
                <Typography variant="h4">{supplyChainData.inventoryStatus.totalItems}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Low Stock</Typography>
                <Typography variant="h4" color="warning.main">{supplyChainData.inventoryStatus.lowStock}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Out of Stock</Typography>
                <Typography variant="h4" color="error.main">{supplyChainData.inventoryStatus.outOfStock}</Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, height: 200 }}>
              <Typography variant="subtitle2" gutterBottom>Inventory by Category</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supplyChainData.inventoryStatus.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {supplyChainData.inventoryStatus.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Procurement Metrics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <LocalShipping color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Procurement Metrics</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">POs Created</Typography>
                <Typography variant="h4">{supplyChainData.procurementMetrics.poCreated}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">POs Pending</Typography>
                <Typography variant="h4" color="info.main">{supplyChainData.procurementMetrics.poPending}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">POs Delivered</Typography>
                <Typography variant="h4" color="success.main">{supplyChainData.procurementMetrics.poDelivered}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">POs Late</Typography>
                <Typography variant="h4" color="warning.main">{supplyChainData.procurementMetrics.poLate}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Avg Processing Time</Typography>
                <Typography variant="h5">{supplyChainData.procurementMetrics.avgProcessingTime}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Financial Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <AttachMoney color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Financial Summary</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300 }}>
              <Typography variant="subtitle2" gutterBottom>Spend by Category</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={supplyChainData.procurementMetrics.spendByCategory}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Electronics" stackId="a" fill="#0088FE" />
                  <Bar dataKey="Materials" stackId="a" fill="#00C49F" />
                  <Bar dataKey="Supplies" stackId="a" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Activity and Tables */}
      <Grid container spacing={3}>
        {/* Recent Transactions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Assignment color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Purchase Orders</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PO Number</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.supplier}</TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {statusIcons[row.status]}
                          <Box sx={{ ml: 1 }}>{row.status}</Box>
                        </Box>
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Timeline and Pending Approvals */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3} direction="column">
            {/* Timeline */}
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Supply Chain Timeline</Typography>
                <Divider sx={{ mb: 2 }} />
                <Timeline>
                  {supplyChainData.supplyChainTimeline.map((item, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot color={item.status === 'warning' ? 'warning' : 'primary'}>
                          {item.icon}
                        </TimelineDot>
                        {index < supplyChainData.supplyChainTimeline.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="subtitle2">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                        <Typography variant="caption" display="block">{item.time}</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Paper>
            </Grid>
            
            {/* Pending Approvals */}
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Receipt color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Pending Invoice Approvals</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Supplier</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Days</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {supplyChainData.pendingApprovals.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.supplier}</TableCell>
                          <TableCell align="right">{row.amount}</TableCell>
                          <TableCell>
                            <LinearProgress 
                              variant="determinate" 
                              value={Math.min(row.daysPending * 20, 100)} 
                              color={row.daysPending > 3 ? 'warning' : 'primary'} 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplyChainDashboard;