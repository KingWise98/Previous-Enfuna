import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  LinearProgress,
  ListItemText,
  Badge
} from '@mui/material';
import {
  AccountBalance,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Receipt,
  Payment,
  DateRange,
  Today,
  CalendarViewMonth,
  Refresh,
  FilterList,
  Add,
  ShowChart,
  PieChart,
  Assessment,
  AccountBalanceWallet,
  CreditCard,
  Savings,
  RequestQuote,
  MoneyOff,
  Description,
  Money,
  LocalAtm,
  Schedule,
  DoneAll,
  
  Warning,
  Error
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const FinancialDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [financialData, setFinancialData] = useState([]);
  const [accountBalances, setAccountBalances] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [invoicesOwed, setInvoicesOwed] = useState([]);
  const [billsToPay, setBillsToPay] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [chartView, setChartView] = useState('profit');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // API Integration Points
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsLoading(true);
        
        // TODO: Implement API calls for each data type
        /*
        const [
          financialRes,
          accountsRes,
          transactionsRes,
          invoicesRes,
          billsRes,
          budgetRes
        ] = await Promise.all([
          fetch(`/api/financial-data?period=${timeFilter}`),
          fetch('/api/accounts'),
          fetch('/api/transactions/recent'),
          fetch('/api/invoices/owed'),
          fetch('/api/bills/pending'),
          fetch('/api/budget')
        ]);
        
        setFinancialData(await financialRes.json());
        setAccountBalances(await accountsRes.json());
        setRecentTransactions(await transactionsRes.json());
        setInvoicesOwed(await invoicesRes.json());
        setBillsToPay(await billsRes.json());
        setBudgetData(await budgetRes.json());
        */
        
        // Initialize with empty arrays
        setFinancialData([]);
        setAccountBalances([]);
        setRecentTransactions([]);
        setInvoicesOwed([]);
        setBillsToPay([]);
        setBudgetData([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, [timeFilter]);

  // Calculate summary metrics from the data
  const calculateSummary = () => {
    if (!financialData.length) return {
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0,
      revenue: 0,
      revenueChange: 0,
      cogs: 0,
      cogsChange: 0,
      grossProfit: 0,
      grossProfitChange: 0,
      expenses: 0,
      expensesChange: 0,
      profit: 0,
      profitChange: 0,
      cashFlow: 0,
      cashFlowChange: 0,
      accountsReceivable: 0,
      accountsPayable: 0,
      totalInvoicesOwed: 0,
      totalBillsToPay: 0,
      overdueInvoices: 0,
      overdueBills: 0
    };

    const latest = financialData[financialData.length - 1] || {};
    const previous = financialData[financialData.length - 2] || {};
    
    const totalInvoicesOwed = invoicesOwed
      .filter(inv => inv.status !== 'Paid')
      .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
      
    const totalBillsToPay = billsToPay
      .filter(bill => bill.status !== 'Paid')
      .reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
    
    return {
      totalAssets: accountBalances.reduce((sum, acc) => sum + Math.max(0, acc.balance), 0),
      totalLiabilities: accountBalances.reduce((sum, acc) => sum + Math.min(0, acc.balance), 0),
      netWorth: accountBalances.reduce((sum, acc) => sum + acc.balance, 0),
      revenue: latest.revenue || 0,
      revenueChange: latest.revenue && previous.revenue 
        ? ((latest.revenue - previous.revenue) / previous.revenue * 100).toFixed(1)
        : 0,
      cogs: latest.cogs || 0,
      cogsChange: latest.cogs && previous.cogs
        ? ((latest.cogs - previous.cogs) / previous.cogs * 100).toFixed(1)
        : 0,
      grossProfit: latest.grossProfit || 0,
      grossProfitChange: latest.grossProfit && previous.grossProfit
        ? ((latest.grossProfit - previous.grossProfit) / previous.grossProfit * 100).toFixed(1)
        : 0,
      expenses: latest.expenses || 0,
      expensesChange: latest.expenses && previous.expenses
        ? ((latest.expenses - previous.expenses) / previous.expenses * 100).toFixed(1)
        : 0,
      profit: latest.profit || 0,
      profitChange: latest.profit && previous.profit
        ? ((latest.profit - previous.profit) / previous.profit * 100).toFixed(1)
        : 0,
      cashFlow: latest.cashFlow || 0,
      cashFlowChange: latest.cashFlow && previous.cashFlow
        ? ((latest.cashFlow - previous.cashFlow) / previous.cashFlow * 100).toFixed(1)
        : 0,
      accountsReceivable: latest.accountsReceivable || 0,
      accountsPayable: latest.accountsPayable || 0,
      totalInvoicesOwed,
      totalBillsToPay,
      overdueInvoices: invoicesOwed.filter(inv => inv.status === 'Overdue').length,
      overdueBills: billsToPay.filter(bill => bill.status === 'Overdue').length
    };
  };

  const summary = calculateSummary();

  // Columns for data tables
  const transactionColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'date', headerName: 'Date', width: 100 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'amount', headerName: 'Amount', width: 120,
      renderCell: (params) => (
        <Typography color={params.value >= 0 ? theme.palette.success.main : theme.palette.error.main}>
          ${Math.abs(params.value).toLocaleString()}
        </Typography>
      )
    },
    { field: 'account', headerName: 'Account', width: 120 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'Cleared' ? 'success' :
            params.value === 'Pending' ? 'warning' : 'info'
          }
        />
      )
    }
  ];

  const invoiceColumns = [
    { field: 'id', headerName: 'Invoice #', width: 100 },
    { field: 'customer', headerName: 'Customer', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 120,
      renderCell: (params) => (
        <Typography fontWeight="bold">
          ${params.value}
        </Typography>
      )
    },
    { field: 'dueDate', headerName: 'Due Date', width: 120 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'Paid' ? 'success' :
            params.value === 'Overdue' ? 'error' : 'warning'
          }
        />
      )
    },
    { field: 'daysOverdue', headerName: 'Days', width: 80,
      renderCell: (params) => (
        params.row.status === 'Overdue' ? (
          <Typography color="error">
            {params.value}d
          </Typography>
        ) : null
      )
    }
  ];

  const billsColumns = [
    { field: 'id', headerName: 'Bill #', width: 100 },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 120,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="error">
          ${params.value}
        </Typography>
      )
    },
    { field: 'dueDate', headerName: 'Due Date', width: 120 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'Paid' ? 'success' :
            params.value === 'Overdue' ? 'error' : 'warning'
          }
        />
      )
    },
    { field: 'daysUntilDue', headerName: 'Due In', width: 80,
      renderCell: (params) => (
        params.row.status === 'Pending' ? (
          <Typography color={params.value <= 7 ? 'error' : 'inherit'}>
            {params.value}d
          </Typography>
        ) : null
      )
    }
  ];

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box m="20px">
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h3" fontWeight="bold">
          Financial Management Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Overview of your company's financial health
        </Typography>
      </Box>

      {/* Time Filter */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" gap={1}>
          <Button
            variant={timeFilter === 'daily' ? 'contained' : 'outlined'}
            startIcon={<Today />}
            onClick={() => setTimeFilter('daily')}
          >
            Daily
          </Button>
          <Button
            variant={timeFilter === 'weekly' ? 'contained' : 'outlined'}
            startIcon={<DateRange />}
            onClick={() => setTimeFilter('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={timeFilter === 'monthly' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewMonth />}
            onClick={() => setTimeFilter('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={timeFilter === 'yearly' ? 'contained' : 'outlined'}
            startIcon={<DateRange />}
            onClick={() => setTimeFilter('yearly')}
          >
            Yearly
          </Button>
        </Box>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<FilterList />}>
            Filters
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Summary Cards - Top Row */}
      <Grid container spacing={3} mb={3}>
        {/* Net Worth */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalanceWallet color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="textSecondary">Net Worth</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                UGX{summary.netWorth.toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                {summary.netWorth >= 0 ? (
                  <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                ) : (
                  <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                )}
                <Typography variant="body2" color={summary.netWorth >= 0 ? '#4caf50' : '#f44336'}>
                  {summary.netWorth >= 0 ? '+' : ''}
                  {((summary.netWorth - accountBalances.reduce((sum, acc) => sum + acc.balance * 0.9, 0)) / 
                    Math.abs(accountBalances.reduce((sum, acc) => sum + acc.balance * 0.9, 0)) * 100).toFixed(1)}% from last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AttachMoney color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="textSecondary">Revenue</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                UGX{summary.revenue.toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                {summary.revenueChange >= 0 ? (
                  <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                ) : (
                  <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                )}
                <Typography variant="body2" color={summary.revenueChange >= 0 ? '#4caf50' : '#f44336'}>
                  {summary.revenueChange >= 0 ? '+' : ''}{summary.revenueChange}% from last {timeFilter}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gross Profit */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <RequestQuote color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="textSecondary">Gross Profit</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color={summary.grossProfit >= 0 ? 'inherit' : 'error'}>
                UGX{Math.abs(summary.grossProfit).toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                {summary.grossProfitChange >= 0 ? (
                  <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                ) : (
                  <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                )}
                <Typography variant="body2" color={summary.grossProfitChange >= 0 ? '#4caf50' : '#f44336'}>
                  {summary.grossProfitChange >= 0 ? '+' : ''}{summary.grossProfitChange}% from last {timeFilter}
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary">
                Margin: {(summary.grossProfit / summary.revenue * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Net Profit */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <RequestQuote color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="textSecondary">Net Profit</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color={summary.profit >= 0 ? 'inherit' : 'error'}>
                UGX{Math.abs(summary.profit).toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                {summary.profitChange >= 0 ? (
                  <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                ) : (
                  <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                )}
                <Typography variant="body2" color={summary.profitChange >= 0 ? '#4caf50' : '#f44336'}>
                  {summary.profitChange >= 0 ? '+' : ''}{summary.profitChange}% from last {timeFilter}
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary">
                Margin: {(summary.profit / summary.revenue * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Financial Trends Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Financial Trends ({timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} View)
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>View</InputLabel>
                <Select
                  value={chartView}
                  label="View"
                  onChange={(e) => setChartView(e.target.value)}
                >
                  <MenuItem value="profit">Net Profit</MenuItem>
                  <MenuItem value="grossProfit">Gross Profit</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="cogs">COGS</MenuItem>
                  <MenuItem value="expenses">Expenses</MenuItem>
                  <MenuItem value="cashFlow">Cash Flow</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box height={400}>
              {financialData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, chartView === 'cogs' ? 'COGS' : chartView.charAt(0).toUpperCase() + chartView.slice(1)]}
                    />
                    <Legend />
                    {chartView === 'profit' && (
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke={theme.palette.primary.main}
                        activeDot={{ r: 8 }}
                        name="Net Profit (UGX)"
                      />
                    )}
                    {chartView === 'grossProfit' && (
                      <Line
                        type="monotone"
                        dataKey="grossProfit"
                        stroke="#4caf50"
                        name="Gross Profit (UGX)"
                      />
                    )}
                    {chartView === 'revenue' && (
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4caf50"
                        name="Revenue (UGX)"
                      />
                    )}
                    {chartView === 'cogs' && (
                      <Line
                        type="monotone"
                        dataKey="cogs"
                        stroke="#f44336"
                        name="COGS (UGX)"
                      />
                    )}
                    {chartView === 'expenses' && (
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#f44336"
                        name="Expenses (UGX)"
                      />
                    )}
                    {chartView === 'cashFlow' && (
                      <Line
                        type="monotone"
                        dataKey="cashFlow"
                        stroke="#ff9800"
                        name="Cash Flow (UGX)"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="textSecondary">No financial data available</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Account Balances */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>Account Balances</Typography>
            {accountBalances.length > 0 ? (
              <>
                <Box mb={3}>
                  {accountBalances.map((account) => (
                    <Box key={account.name} mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                          {account.type === 'bank' && <AccountBalanceWallet color="primary" sx={{ mr: 1 }} />}
                          {account.type === 'credit' && <CreditCard color="error" sx={{ mr: 1 }} />}
                          {account.type === 'investment' && <Savings color="success" sx={{ mr: 1 }} />}
                          <Typography fontWeight="bold">{account.name}</Typography>
                        </Box>
                        <Typography color={account.balance >= 0 ? 'inherit' : 'error'}>
                          UGX{Math.abs(account.balance).toLocaleString()}
                        </Typography>
                      </Box>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Typography variant="subtitle1" mb={1}>Quick Summary</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Assets</TableCell>
                          <TableCell align="right">UGX{summary.totalAssets.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Liabilities</TableCell>
                          <TableCell align="right">(UGX{Math.abs(summary.totalLiabilities).toLocaleString()})</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Net Worth</strong></TableCell>
                          <TableCell align="right">
                            <strong>UGX{summary.netWorth.toLocaleString()}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography color="textSecondary">No account data available</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3} mt={0}>
        {/* Recent Transactions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Transactions</Typography>
              <Button 
                size="small" 
                startIcon={<Add />}
                href="/pos/new_sales"
              >
                Add Transaction
              </Button>
            </Box>
            <Box sx={{ height: 300 }}>
              {recentTransactions.length > 0 ? (
                <DataGrid
                  rows={recentTransactions}
                  columns={transactionColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="textSecondary">No recent transactions</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Invoices Owed */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Invoices Owed</Typography>
              <Button 
                size="small" 
                startIcon={<Add />}
                href="/payment"
              >
                Create Invoice
              </Button>
            </Box>
            <Box sx={{ height: 300 }}>
              {invoicesOwed.length > 0 ? (
                <DataGrid
                  rows={invoicesOwed}
                  columns={invoiceColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="textSecondary">No invoices owed</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Bills to Pay */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Bills to Pay</Typography>
              <Button 
                size="small" 
                startIcon={<Add />}
                href="/bills/manage"
              >
                Add Bill
              </Button>
            </Box>
            <Box sx={{ height: 300 }}>
              {billsToPay.length > 0 ? (
                <DataGrid
                  rows={billsToPay}
                  columns={billsColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="textSecondary">No bills to pay</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialDashboard;