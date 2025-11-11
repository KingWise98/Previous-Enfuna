import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Chip, Tabs, Tab, IconButton, Tooltip,
  Collapse, Accordion, AccordionSummary, AccordionDetails, CircularProgress, useTheme
} from '@mui/material';
import {
  Search, FilterList, Refresh, DateRange, Download, PictureAsPdf, GridOn,
  Print, AccountBalance, ShowChart, PieChart as PieChartIcon, ExpandMore,KeyboardArrowUp,ArrowDropUp,
  Add, Edit, Check, Close, Visibility, VisibilityOff,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample Trial Balance Data
const trialBalanceData = {
  asOfDate: '2023-12-31',
  accounts: [
    { 
      id: 101, number: '1001', name: 'Cash', type: 'debit',
      balance: 1500000, lastPeriod: 1200000, adjustments: [],
      subAccounts: [
        { id: 1011, name: 'Petty Cash', balance: 50000 },
        { id: 1012, name: 'Main Account', balance: 1450000 }
      ]
    },
    { id: 102, number: '1002', name: 'Accounts Receivable', type: 'debit', balance: 750000, lastPeriod: 600000, adjustments: [] },
    { id: 103, number: '2001', name: 'Accounts Payable', type: 'credit', balance: 450000, lastPeriod: 300000, adjustments: [] },
    { id: 104, number: '3001', name: 'Sales Revenue', type: 'credit', balance: 2500000, lastPeriod: 1800000, adjustments: [] },
    { id: 105, number: '4001', name: 'Cost of Goods Sold', type: 'debit', balance: 1200000, lastPeriod: 900000, adjustments: [] },
    { id: 106, number: '5001', name: 'Office Expenses', type: 'debit', balance: 300000, lastPeriod: 250000, adjustments: [] },
  ]
};

// Helper functions
const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'UGX' }).format(amount);
const formatPercentage = (value, total) => `${((value / total) * 100).toFixed(1)}%`;

const TrialBalancePage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newAdjustment, setNewAdjustment] = useState({ date: '', account: '', description: '', debit: 0, credit: 0 });

  // Calculations
  const totalDebits = trialBalanceData.accounts.reduce((sum, acc) => acc.type === 'debit' ? sum + acc.balance : sum, 0);
  const totalCredits = trialBalanceData.accounts.reduce((sum, acc) => acc.type === 'credit' ? sum + acc.balance : sum, 0);
  const adjustedDebits = totalDebits + adjustments.reduce((sum, adj) => sum + adj.debit, 0);
  const adjustedCredits = totalCredits + adjustments.reduce((sum, adj) => sum + adj.credit, 0);

  const chartData = [
    { name: 'Debits', value: totalDebits },
    { name: 'Credits', value: totalCredits }
  ];

  const accountTypesData = [
    { name: 'Assets', value: trialBalanceData.accounts.filter(a => a.type === 'debit' && a.number.startsWith('1')).reduce((s,a) => s + a.balance, 0) },
    { name: 'Liabilities', value: trialBalanceData.accounts.filter(a => a.type === 'credit' && a.number.startsWith('2')).reduce((s,a) => s + a.balance, 0) },
    { name: 'Equity', value: trialBalanceData.accounts.filter(a => a.type === 'credit' && a.number.startsWith('3')).reduce((s,a) => s + a.balance, 0) },
    { name: 'Revenue', value: trialBalanceData.accounts.filter(a => a.type === 'credit' && a.number.startsWith('4')).reduce((s,a) => s + a.balance, 0) },
    { name: 'Expenses', value: trialBalanceData.accounts.filter(a => a.type === 'debit' && a.number.startsWith('5')).reduce((s,a) => s + a.balance, 0) },
  ];

  // Handlers
  const toggleExpand = (accountId) => {
    setExpanded(prev => prev.includes(accountId) ? prev.filter(id => id !== accountId) : [...prev, accountId]);
  };

  const handleAddAdjustment = () => {
    setAdjustments([...adjustments, { ...newAdjustment, id: Date.now() }]);
    setNewAdjustment({ date: '', account: '', description: '', debit: 0, credit: 0 });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Trial Balance</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<GridOn />}>Export Excel</Button>
          <Button variant="outlined" startIcon={<PictureAsPdf />}>Export PDF</Button>
          <Button variant="outlined" startIcon={<Print />}>Print</Button>
        </Box>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Search Accounts" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <Search /> }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select value="current" startAdornment={<DateRange />}>
                  <MenuItem value="current">Current Period</MenuItem>
                  <MenuItem value="previous">Previous Period</MenuItem>
                  <MenuItem value="ytd">Year-to-Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button fullWidth variant="contained" startIcon={<FilterList />}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Standard View" icon={<AccountBalance />} />
        <Tab label="Adjusted Entries" icon={<Edit />} />
        <Tab label="Visual Analysis" icon={<PieChartIcon />} />
      </Tabs>

      {/* Standard View */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Account #</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell width={50} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trialBalanceData.accounts.map(account => (
                    <React.Fragment key={account.id}>
                      <TableRow>
                        <TableCell>{account.number}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {account.subAccounts?.length > 0 && (
                              <IconButton size="small" onClick={() => toggleExpand(account.id)}>
                                {expanded.includes(account.id) ? <ArrowDropUp  /> : <ExpandMore />}
                              </IconButton>
                            )}
                            {account.name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {account.type === 'debit' && formatCurrency(account.balance)}
                        </TableCell>
                        <TableCell align="right">
                          {account.type === 'credit' && formatCurrency(account.balance)}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => setHidden([...hidden, account.id])}>
                            <VisibilityOff fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {expanded.includes(account.id) && account.subAccounts?.map(sub => (
                        <TableRow key={sub.id} sx={{ backgroundColor: '#f9f9f9' }}>
                          <TableCell />
                          <TableCell sx={{ pl: 6 }}>{sub.name}</TableCell>
                          <TableCell align="right">{formatCurrency(sub.balance)}</TableCell>
                          <TableCell align="right"></TableCell>
                          <TableCell />
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                  <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableCell colSpan={2}><Typography fontWeight="bold">Totals</Typography></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalDebits)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalCredits)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {totalDebits !== totalCredits && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'error.light', color: 'white', borderRadius: 1 }}>
                <Typography>Unbalanced Trial Balance! Difference: {formatCurrency(Math.abs(totalDebits - totalCredits))}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Adjusted Entries */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Adjusting Journal Entries</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth type="date" label="Date" value={newAdjustment.date}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, date: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Account" value={newAdjustment.account}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, account: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Debit" type="number" value={newAdjustment.debit}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, debit: +e.target.value })} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Credit" type="number" value={newAdjustment.credit}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, credit: +e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Description" value={newAdjustment.description}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, description: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" startIcon={<Add />} onClick={handleAddAdjustment}>
                    Add Adjustment
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Account</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adjustments.map(adj => (
                    <TableRow key={adj.id}>
                      <TableCell>{adj.date}</TableCell>
                      <TableCell>{adj.account}</TableCell>
                      <TableCell>{adj.description}</TableCell>
                      <TableCell align="right">{formatCurrency(adj.debit)}</TableCell>
                      <TableCell align="right">{formatCurrency(adj.credit)}</TableCell>
                      <TableCell>
                        <IconButton size="small"><Edit /></IconButton>
                        <IconButton size="small"><Close /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6">
                Adjusted Totals: Debit {formatCurrency(adjustedDebits)} | Credit {formatCurrency(adjustedCredits)}
              </Typography>
              <KeyboardArrowUp 
                variant="determinate" 
                value={Math.abs(adjustedDebits - adjustedCredits)/Math.max(adjustedDebits, adjustedCredits)*100} 
                color={adjustedDebits === adjustedCredits ? 'success' : 'error'}
                sx={{ height: 8, mt: 1 }}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Visual Analysis */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Debit/Credit Balance</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {chartData.map((_, i) => <Cell key={i} fill={[theme.palette.primary.main, theme.palette.secondary.main][i]} />)}
                    </Pie>
                    <RechartsTooltip formatter={formatCurrency} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">Account Type Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={accountTypesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={v => formatCurrency(v).replace('$', '')} />
                    <RechartsTooltip formatter={formatCurrency} />
                    <Bar dataKey="value" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TrialBalancePage;