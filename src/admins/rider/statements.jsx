import React, { useState, useEffect } from 'react';
import './statements.css';
import { 
  Download, FileText, FileSpreadsheet, FileBarChart, 
  Calendar, Filter, Plus, Edit, Trash2, CheckCircle,
  TrendingUp, Wallet, PieChart, BarChart3, ChevronRight,
  Eye, MoreVertical, Settings, Bell, Search,
  CreditCard, DollarSign, TrendingDown, Check,
  AlertCircle, Clock, RefreshCw, Save, ChevronDown,
  TrendingUp as TrendUp, TrendingDown as TrendDown,
  Activity, Target, Layers, Users, Shield,
  FileCheck, BarChart2, CreditCard as CreditCardIcon,
  Calculator, Zap, History, Database,
  ArrowUpRight, ArrowDownRight, Circle,
  LineChart, CalendarDays, DollarSign as Dollar,
  Briefcase, Home, Car, ShoppingBag
} from 'lucide-react';

// Enhanced Mock Data Service
const financialDataService = {
  // P&L Data
  getPLData: (period) => {
    const data = {
      daily: {
        income: 1450000,
        expenses: 450000,
        net: 1000000,
        margin: 69.0,
        color: '#6366f1',
        icon: <Activity size={20} />,
        transactions: Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          time: `${9 + i}:00 AM`,
          type: i % 3 === 0 ? 'Revenue' : 'Expense',
          amount: i % 3 === 0 ? 145000 : 45000,
          category: i % 3 === 0 ? 'Transport' : 'Fuel',
          status: 'Completed'
        }))
      },
      weekly: {
        income: 3450000,
        expenses: 450000,
        net: 2450000,
        margin: 71.0,
        color: '#8b5cf6',
        icon: <CalendarDays size={20} />,
        transactions: [
          { id: 1, day: 'Mon', income: 850000, expenses: 265000 },
          { id: 2, day: 'Tue', income: 920000, expenses: 310000 },
          { id: 3, day: 'Wed', income: 780000, expenses: 290000 },
          { id: 4, day: 'Thu', income: 950000, expenses: 350000 },
          { id: 5, day: 'Fri', income: 1100000, expenses: 270000 }
        ]
      },
      monthly: {
        income: 18500000,
        expenses: 7200000,
        net: 11300000,
        margin: 61.1,
        color: '#06D6A0',
        icon: <BarChart2 size={20} />,
        transactions: Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          week: `Week ${i + 1}`,
          income: 2850000 + i * 200000,
          expenses: 950000 + i * 50000,
          profit: 1900000 + i * 150000
        }))
      },
      annual: {
        income: 42800000,
        expenses: 24300000,
        net: 18500000,
        margin: 43.2,
        color: '#f59e0b',
        icon: <Target size={20} />,
        transactions: [
          { id: 1, quarter: 'Q1', revenue: 10700000, profit: 4630000 },
          { id: 2, quarter: 'Q2', revenue: 12100000, profit: 6180000 },
          { id: 3, quarter: 'Q3', revenue: 10500000, profit: 4530000 },
          { id: 4, quarter: 'Q4', revenue: 9500000, profit: 3160000 }
        ]
      }
    };
    return { ...data[period], period };
  },

  // Expense Ledger
  getExpenses: () => [
    { id: 1, date: 'Jan 15, 2025', vendor: 'Shell Petrol Station', category: 'Fuel', amount: 245000, status: 'Paid', color: '#ef4444' },
    { id: 2, date: 'Jan 15, 2025', vendor: 'Total Energies', category: 'Fuel', amount: 265000, status: 'Paid', color: '#ef4444' },
    { id: 3, date: 'Jan 15, 2025', vendor: 'MTN Mobile Money', category: 'Fees', amount: 45000, status: 'Paid', color: '#8b5cf6' },
    { id: 4, date: 'Jan 14, 2025', vendor: 'Motorcycle Garage', category: 'Maintenance', amount: 165000, status: 'Pending', color: '#06D6A0' },
    { id: 5, date: 'Jan 13, 2025', vendor: 'Stabex Kampala', category: 'Fuel', amount: 285000, status: 'Paid', color: '#ef4444' },
    { id: 6, date: 'Jan 12, 2025', vendor: 'Kampala Parts', category: 'Parts', amount: 85000, status: 'Paid', color: '#f59e0b' },
    { id: 7, date: 'Jan 11, 2025', vendor: 'Airtel Money', category: 'Fees', amount: 35000, status: 'Paid', color: '#8b5cf6' },
    { id: 8, date: 'Jan 10, 2025', vendor: 'Group Savings', category: 'Savings', amount: 20000, status: 'Paid', color: '#3b82f6' }
  ],

  // Wallet Statement
  getWalletTransactions: () => [
    { id: 1, date: 'Today 2:30 PM', description: 'Mobile Money Deposit', type: 'Deposit', amount: 450000, balance: 3950000, icon: '💳' },
    { id: 2, date: 'Today 11:00 AM', description: 'Fuel Expense - Shell', type: 'Withdrawal', amount: -265000, balance: 3500000, icon: '⛽' },
    { id: 3, date: 'Yesterday 4:15 PM', description: 'Maintenance Payment', type: 'Withdrawal', amount: -165000, balance: 3765000, icon: '🔧' },
    { id: 4, date: 'Jan 14, 10:30 AM', description: 'Daily Earnings', type: 'Deposit', amount: 850000, balance: 3930000, icon: '💰' },
    { id: 5, date: 'Jan 13, 3:45 PM', description: 'Parts Purchase', type: 'Withdrawal', amount: -85000, balance: 3080000, icon: '🛠️' }
  ],

  // Cashflow Analysis Data
  getCashflowAnalysis: () => ({
    inflow: 2265000,
    outflow: 1165000,
    net: 1100000,
    inflowChange: '+15.8%',
    outflowChange: '-15.8%',
    categories: [
      { name: 'Daily Operations', amount: 1450000, color: '#6366f1', earnings: 1850000, netEarnings: 1100000 },
      { name: 'Group Contributions', amount: 450000, color: '#06D6A0', earnings: 320000, netEarnings: 280000 },
      { name: 'Savings', amount: 365000, color: '#f59e0b', earnings: 95000, netEarnings: 85000 }
    ],
    monthly: [
      { month: 'Jan', inflow: 450000, outflow: 265000 },
      { month: 'Feb', inflow: 420000, outflow: 310000 },
      { month: 'Mar', inflow: 480000, outflow: 290000 },
      { month: 'Apr', inflow: 390000, outflow: 350000 },
      { month: 'May', inflow: 510000, outflow: 270000 },
      { month: 'Jun', inflow: 615000, outflow: 330000 }
    ]
  }),

  // Bookkeeping & Reconciliation Data
  getBookkeepingData: () => ({
    outstandingInvoices: { count: 12, value: 250000 },
    pendingExpenses: { count: 24, description: 'Awaiting categorization' },
    reconciliationStatus: { percentage: 100, label: 'All accounts reconciled' },
    bookkeepingStatus: {
      overall: 67.8,
      tasks: [
        { id: 1, name: 'Accounts Receivable', completed: 45, total: 45, status: 'completed', color: '#06D6A0' },
        { id: 2, name: 'Accounts Payable', completed: 38, total: 38, status: 'completed', color: '#06D6A0' },
        { id: 3, name: 'Invoice Processing', completed: 158, total: 180, status: 'in-progress', color: '#f59e0b' },
        { id: 4, name: 'Expense Categorization', completed: 45, total: 45, status: 'completed', color: '#06D6A0' },
        { id: 5, name: 'Bank Reconciliation', completed: 0, total: 1, status: 'pending', color: '#ef4444' }
      ]
    }
  }),

  // Balance Sheet Data
  getBalanceSheet: () => ({
    assets: { 
      amount: 892450, 
      change: '+12.2%', 
      type: 'Current + Fixed Asset',
      breakdown: [
        { name: 'Cash & Bank', amount: 350000, color: '#06D6A0' },
        { name: 'Equipment', amount: 325000, color: '#6366f1' },
        { name: 'Inventory', amount: 217450, color: '#f59e0b' }
      ]
    },
    liabilities: { 
      amount: 492450, 
      change: '-2.3%', 
      type: 'Short + Long Term',
      breakdown: [
        { name: 'Loans', amount: 300000, color: '#ef4444' },
        { name: 'Accounts Payable', amount: 192450, color: '#f59e0b' }
      ]
    },
    equity: { 
      amount: 692450, 
      change: '+22.9%', 
      type: 'Owners equity + Retained Earnings',
      breakdown: [
        { name: 'Owner Capital', amount: 500000, color: '#6366f1' },
        { name: 'Retained Earnings', amount: 192450, color: '#06D6A0' }
      ]
    },
    netWorth: 692450
  }),

  // Recent Activity Data
  getRecentActivity: () => [
    { id: 1, action: 'Reconciled Cash Account', time: 'Today, 2:30 PM', user: 'System', icon: <Database size={16} />, color: '#06D6A0' },
    { id: 2, action: 'Processed 2 expense receipts', time: 'Today, 11:31 AM', user: 'Auto Categorization', icon: <FileCheck size={16} />, color: '#6366f1' },
    { id: 3, action: 'Generated Monthly P&L report', time: 'Yesterday, 4:41 PM', user: 'Scheduled Task', icon: <BarChart2 size={16} />, color: '#f59e0b' },
    { id: 4, action: 'Updated tax calculations', time: 'Yesterday, 11:00 AM', user: 'System', icon: <Calculator size={16} />, color: '#8b5cf6' },
    { id: 5, action: 'Backed up financial data', time: 'Jan 15, 9:15 PM', user: 'Automated Backup', icon: <Shield size={16} />, color: '#3b82f6' }
  ],

  // Performance Analytics Data
  getPerformanceAnalytics: () => ({
    monthlyView: {
      totalEarnings: 4700000,
      totalExpenses: 3300000,
      netIncome: 1400000,
      profitMargin: 30.0,
      earningsGrowth: '+3.5%',
      expensesRatio: '70%',
      netIncomeGrowth: '+12.5%'
    },
    quarterlyView: {
      totalEarnings: 14200000,
      totalExpenses: 9800000,
      netIncome: 4400000,
      profitMargin: 31.0,
      earningsGrowth: '+8.2%',
      expensesRatio: '69%',
      netIncomeGrowth: '+15.3%'
    },
    performanceChart: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      earnings: [10700000, 12100000, 10500000, 9500000],
      netEarnings: [4630000, 6180000, 4530000, 3160000],
      expenses: [6070000, 5920000, 5970000, 6340000]
    },
    yearHighlights: {
      bestMonth: { month: 'December 2025', earnings: 1440000, netIncome: 980000 },
      bestQuarter: { quarter: 'Q4 2025', earnings: 1370000, growth: '+1%' },
      avgMonthlyEarnings: 393000,
      keyMetrics: {
        operatingMargin: '30.0%',
        earningsGrowthYoY: '+9.8%',
        netIncomeGrowthYoY: '+12.5%',
        expenseRatio: '70.0%',
        monthlyEarningsAvg: 393000,
        totalTrips: 2847
      }
    }
  }),

  // Trends Data
  getTrendsData: () => ({
    monthlyTrends: [
      { month: 'January', earnings: 3450000, profit: 2450000, margin: 30.0, growth: '+8.3%' },
      { month: 'February', earnings: 3450000, profit: 2450000, margin: 30.0, growth: '+8.3%' },
      { month: 'March', earnings: 3450000, profit: 2450000, margin: 30.0, growth: '+8.3%' },
      { month: 'April', earnings: 3450000, profit: 2450000, margin: 30.0, growth: '-28.3%' },
      { month: 'May', earnings: 3450000, profit: 2450000, margin: 30.0, growth: '+8.3%' },
      { month: 'June', earnings: 4020000, profit: 2814000, margin: 30.0, growth: '+8.3%' }
    ],
    annualTrends: [
      { year: '2023', earnings: 3450000, profit: 2863500, margin: 83.0, growth: '83.0%' },
      { year: '2024', earnings: 3450000, profit: 2380500, margin: 69.0, growth: '69.0%' },
      { year: '2025', earnings: 3450000, profit: 1863000, margin: 54.0, growth: '54.0%' },
      { year: '2026', earnings: 3450000, profit: 2587500, margin: 75.0, growth: '75.0%' }
    ],
    growthMetrics: {
      cagr: '15.5%',
      projection2025: 30700000,
      consistentMargin: '30.0%'
    }
  })
};

const Statements = () => {
  // State management
  const [activePLView, setActivePLView] = useState('monthly');
  const [activeView, setActiveView] = useState('pl');
  const [activeTab, setActiveTab] = useState('trends'); // trends or year-end
  const [performanceView, setPerformanceView] = useState('monthly'); // monthly or quarterly
  const [expenses, setExpenses] = useState([]);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [cashflowData, setCashflowData] = useState(null);
  const [bookkeepingData, setBookkeepingData] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    vendor: '', 
    category: 'Fuel', 
    amount: '', 
    status: 'Pending',
    description: ''
  });
  const [exportFormat, setExportFormat] = useState('pdf');
  const [scheduleConfig, setScheduleConfig] = useState({ 
    frequency: 'weekly', 
    format: 'pdf', 
    reportType: 'pl',
    time: '09:00'
  });
  const [scheduledExports, setScheduledExports] = useState([]);
  const [filters, setFilters] = useState({ category: '', dateFrom: '', dateTo: '', status: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize all data
  useEffect(() => {
    loadAllData();
    const savedExports = localStorage.getItem('scheduledExports');
    if (savedExports) {
      setScheduledExports(JSON.parse(savedExports));
    }
  }, []);

  const loadAllData = () => {
    setLoading(true);
    setTimeout(() => {
      setExpenses(financialDataService.getExpenses());
      setWalletTransactions(financialDataService.getWalletTransactions());
      setCashflowData(financialDataService.getCashflowAnalysis());
      setBookkeepingData(financialDataService.getBookkeepingData());
      setBalanceSheet(financialDataService.getBalanceSheet());
      setRecentActivity(financialDataService.getRecentActivity());
      setPerformanceData(financialDataService.getPerformanceAnalytics());
      setTrendsData(financialDataService.getTrendsData());
      setLoading(false);
    }, 500);
  };

  // CRUD Operations
  const handleAddExpense = () => {
    if (!newExpense.vendor || !newExpense.amount) {
      showToast('Please fill all required fields', 'warning');
      return;
    }
    
    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseInt(newExpense.amount),
      color: getCategoryColor(newExpense.category)
    };
    
    setExpenses([expense, ...expenses]);
    setNewExpense({ 
      date: new Date().toISOString().split('T')[0], 
      vendor: '', 
      category: 'Fuel', 
      amount: '', 
      status: 'Pending',
      description: ''
    });
    
    document.getElementById('addExpenseModal').close();
    showToast('Expense added successfully!', 'success');
  };

  const handleEditExpense = (expense) => {
    setEditingExpense({...expense});
  };

  const handleUpdateExpense = () => {
    setExpenses(expenses.map(e => e.id === editingExpense.id ? editingExpense : e));
    setEditingExpense(null);
    showToast('Expense updated successfully!', 'success');
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id));
      showToast('Expense deleted successfully!', 'warning');
    }
  };

  // Export Functions
  const handleExport = async (format, data = null) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let exportData = data || getCurrentViewData();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `financial-report-${timestamp}.${format}`;
    
    // Create and trigger download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setLoading(false);
    showToast(`${format.toUpperCase()} exported successfully!`, 'success');
  };

  const handleExportFiltered = () => {
    const filteredData = getFilteredExpenses();
    handleExport(exportFormat, filteredData);
  };

  const handleScheduleExport = () => {
    const newSchedule = {
      id: Date.now(),
      ...scheduleConfig,
      nextRun: calculateNextRun(scheduleConfig.frequency, scheduleConfig.time),
      created: new Date().toISOString(),
      active: true
    };
    
    const updatedSchedules = [...scheduledExports, newSchedule];
    setScheduledExports(updatedSchedules);
    localStorage.setItem('scheduledExports', JSON.stringify(updatedSchedules));
    
    showToast(`Export scheduled for ${scheduleConfig.frequency} at ${scheduleConfig.time}`, 'success');
  };

  const toggleSchedule = (id) => {
    const updatedSchedules = scheduledExports.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    );
    setScheduledExports(updatedSchedules);
    localStorage.setItem('scheduledExports', JSON.stringify(updatedSchedules));
  };

  const handleDeleteSchedule = (id) => {
    const updatedSchedules = scheduledExports.filter(s => s.id !== id);
    setScheduledExports(updatedSchedules);
    localStorage.setItem('scheduledExports', JSON.stringify(updatedSchedules));
    showToast('Schedule deleted', 'warning');
  };

  // Helper Functions
  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      const matchesSearch = !searchTerm || 
        expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || expense.category === filters.category;
      const matchesStatus = !filters.status || expense.status === filters.status;
      const matchesDate = (!filters.dateFrom || expense.date >= filters.dateFrom) &&
                         (!filters.dateTo || expense.date <= filters.dateTo);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  };

  const getCurrentViewData = () => {
    switch (activeView) {
      case 'expenses': return getFilteredExpenses();
      case 'wallet': return walletTransactions;
      case 'cashflow': return cashflowData;
      case 'bookkeeping': return bookkeepingData;
      case 'balance': return balanceSheet;
      case 'activity': return recentActivity;
      case 'performance': return performanceData;
      case 'trends': return trendsData;
      default: return financialDataService.getPLData(activePLView);
    }
  };

  const calculateNextRun = (frequency, time) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    now.setHours(hours, minutes, 0, 0);
    
    switch (frequency) {
      case 'daily':
        if (now <= new Date()) now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
    }
    return now.toISOString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Fuel': '#ef4444',
      'Maintenance': '#06D6A0',
      'Fees': '#8b5cf6',
      'Parts': '#f59e0b',
      'Savings': '#3b82f6',
      'Other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Render Functions
  const renderPLView = () => {
    const data = financialDataService.getPLData(activePLView);
    
    return (
      <div className="pl-view animate-fade-in">
        <div className="pl-header">
          <div className="pl-title">
            <div className="pl-icon" style={{ backgroundColor: data.color + '20', color: data.color }}>
              {data.icon}
            </div>
            <div>
              <h3>{activePLView.charAt(0).toUpperCase() + activePLView.slice(1)} Profit & Loss</h3>
              <p className="pl-subtitle">Detailed breakdown of income and expenses</p>
            </div>
          </div>
          <button className="btn btn-outline" onClick={() => handleExport(exportFormat)}>
            <Download size={14} /> Export Report
          </button>
        </div>
        
        <div className="pl-stats-grid">
          <div className="stat-card" style={{ '--card-color': '#06D6A0' }}>
            <div className="stat-header">
              <DollarSign size={18} />
              <span>Total Revenue</span>
            </div>
            <div className="stat-value">{formatCurrency(data.income)}</div>
            <div className="stat-trend positive">
              <TrendUp size={14} /> +12.5% vs target
            </div>
          </div>
          
          <div className="stat-card" style={{ '--card-color': '#ef4444' }}>
            <div className="stat-header">
              <CreditCard size={18} />
              <span>Total Expenses</span>
            </div>
            <div className="stat-value">{formatCurrency(data.expenses)}</div>
            <div className="stat-trend negative">
              <TrendDown size={14} /> -8.2% vs target
            </div>
          </div>
          
          <div className="stat-card highlight" style={{ '--card-color': '#6366f1' }}>
            <div className="stat-header">
              <TrendUp size={18} />
              <span>Net Profit</span>
            </div>
            <div className="stat-value">{formatCurrency(data.net)}</div>
            <div className="stat-margin">Margin: {data.margin}%</div>
          </div>
          
          <div className="stat-card" style={{ '--card-color': '#f59e0b' }}>
            <div className="stat-header">
              <BarChart3 size={18} />
              <span>Performance</span>
            </div>
            <div className="stat-value">{data.margin}%</div>
            <div className="stat-trend positive">
              <TrendUp size={14} /> +5.1% improvement
            </div>
          </div>
        </div>
        
        <div className="pl-transactions">
          <h4>Recent Transactions</h4>
          <div className="transactions-list">
            {data.transactions.slice(0, 6).map((tx, index) => (
              <div key={tx.id || index} className="transaction-item">
                <div className="transaction-icon">
                  {tx.type === 'Revenue' ? '💰' : '💸'}
                </div>
                <div className="transaction-details">
                  <div className="transaction-title">
                    {tx.type} • {tx.category || tx.day || tx.week || tx.quarter}
                  </div>
                  <div className="transaction-meta">
                    {tx.time || tx.day || tx.week || tx.quarter}
                  </div>
                </div>
                <div className={`transaction-amount ${tx.type === 'Revenue' || tx.profit ? 'positive' : 'negative'}`}>
                  {tx.type === 'Revenue' || tx.profit ? '+' : '-'}
                  {formatCurrency(tx.amount || tx.income || tx.revenue || tx.profit || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExpenseLedger = () => {
    const filteredExpenses = getFilteredExpenses();
    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    return (
      <div className="expense-ledger animate-fade-in">
        <div className="section-header">
          <div>
            <h3>Expense Ledger</h3>
            <p className="section-subtitle">Manage and track all business expenses</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search expenses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => document.getElementById('addExpenseModal').showModal()}>
              <Plus size={16} /> Add Expense
            </button>
          </div>
        </div>
        
        <div className="stats-summary">
          <div className="stat-badge">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="stat-badge">
            <span className="stat-label">Transactions</span>
            <span className="stat-value">{filteredExpenses.length}</span>
          </div>
          <div className="stat-badge">
            <span className="stat-label">Avg. per Day</span>
            <span className="stat-value">{formatCurrency(Math.round(totalAmount / 30))}</span>
          </div>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <select 
              value={filters.category} 
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Fuel">Fuel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Fees">Fees</option>
              <option value="Parts">Parts</option>
              <option value="Savings">Savings</option>
            </select>
          </div>
          <div className="filter-group">
            <select 
              value={filters.status} 
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="filter-group">
            <input 
              type="date" 
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="filter-input"
              placeholder="From Date"
            />
          </div>
          <div className="filter-group">
            <input 
              type="date" 
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="filter-input"
              placeholder="To Date"
            />
          </div>
          <button 
            className="btn btn-outline" 
            onClick={() => setFilters({ category: '', dateFrom: '', dateTo: '', status: '' })}
          >
            <RefreshCw size={14} /> Clear
          </button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover-row">
                  <td>
                    <div className="date-cell">
                      <span className="date-day">{expense.date.split(' ')[1]}</span>
                      <span className="date-month">{expense.date.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td>
                    <div className="vendor-cell">
                      <div className="vendor-avatar" style={{ backgroundColor: expense.color + '20', color: expense.color }}>
                        {expense.vendor.charAt(0)}
                      </div>
                      {expense.vendor}
                    </div>
                  </td>
                  <td>
                    <span className="category-tag" style={{ 
                      backgroundColor: expense.color + '20', 
                      color: expense.color,
                      borderColor: expense.color + '40'
                    }}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                  <td>
                    <span className={`status-badge ${expense.status.toLowerCase()}`}>
                      {expense.status === 'Paid' ? <Check size={12} /> : <Clock size={12} />}
                      {expense.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleEditExpense(expense)} title="Edit">
                        <Edit size={14} />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDeleteExpense(expense.id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredExpenses.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h4>No expenses found</h4>
              <p>Try changing your filters or add a new expense</p>
            </div>
          )}
        </div>

        {/* Add Expense Modal */}
        <dialog id="addExpenseModal" className="modal">
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <h3>Add New Expense</h3>
              <button className="btn-close" onClick={() => document.getElementById('addExpenseModal').close()}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Date *</label>
                  <input 
                    type="date" 
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Vendor *</label>
                  <input 
                    type="text" 
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                    className="form-input"
                    placeholder="Enter vendor name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <select 
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="form-select"
                  >
                    <option value="Fuel">Fuel</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Fees">Transaction Fees</option>
                    <option value="Parts">Parts & Accessories</option>
                    <option value="Savings">Group Savings</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Amount (UGX) *</label>
                  <input 
                    type="number" 
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="form-input"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={newExpense.status}
                    onChange={(e) => setNewExpense({...newExpense, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Description (Optional)</label>
                  <textarea 
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="form-textarea"
                    placeholder="Add any additional details..."
                    rows="2"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => document.getElementById('addExpenseModal').close()}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddExpense}>
                <Save size={16} /> Save Expense
              </button>
            </div>
          </div>
        </dialog>
        
        {/* Edit Expense Modal */}
        {editingExpense && (
          <dialog open className="modal">
            <div className="modal-content animate-slide-up">
              <div className="modal-header">
                <h3>Edit Expense</h3>
                <button className="btn-close" onClick={() => setEditingExpense(null)}>
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Date *</label>
                    <input 
                      type="date" 
                      value={editingExpense.date}
                      onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Vendor *</label>
                    <input 
                      type="text" 
                      value={editingExpense.vendor}
                      onChange={(e) => setEditingExpense({...editingExpense, vendor: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Category *</label>
                    <select 
                      value={editingExpense.category}
                      onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value})}
                      className="form-select"
                    >
                      <option value="Fuel">Fuel</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Fees">Transaction Fees</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Amount (UGX) *</label>
                    <input 
                      type="number" 
                      value={editingExpense.amount}
                      onChange={(e) => setEditingExpense({...editingExpense, amount: parseInt(e.target.value)})}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      value={editingExpense.status}
                      onChange={(e) => setEditingExpense({...editingExpense, status: e.target.value})}
                      className="form-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setEditingExpense(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdateExpense}>
                  Update Expense
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    );
  };

  const renderWalletStatement = () => {
    return (
      <div className="wallet-statement animate-fade-in">
        <div className="section-header">
          <div>
            <h3>Wallet Statement</h3>
            <p className="section-subtitle">Track all wallet transactions and balances</p>
          </div>
        </div>
        
        <div className="wallet-summary">
          <div className="summary-card">
            <Wallet size={24} />
            <div>
              <h4>Current Balance</h4>
              <div className="amount">{formatCurrency(3500000)}</div>
            </div>
          </div>
          <div className="summary-card">
            <TrendingUp size={24} />
            <div>
              <h4>This Month</h4>
              <div className="amount positive">+{formatCurrency(850000)}</div>
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {walletTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.description}</td>
                  <td>
                    <span className={`badge ${tx.type === 'Deposit' ? 'success' : 'warning'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={tx.amount > 0 ? 'positive' : 'negative'}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </td>
                  <td>{formatCurrency(tx.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCashflowAnalysis = () => {
    if (!cashflowData) return null;

    return (
      <div className="cashflow-analysis animate-fade-in">
        <div className="section-header">
          <div>
            <h3>Cashflow</h3>
            <p className="section-subtitle">Track cash inflows and outflows with detailed breakdowns</p>
          </div>
        </div>

        {/* Cashflow KPI Cards */}
        <div className="cashflow-kpi-grid">
          <div className="kpi-card inflow">
            <div className="kpi-header">
              <div className="kpi-icon">
                <ArrowUpRight size={20} />
              </div>
              <div className="kpi-title">
                <h4>Total Cash Inflow</h4>
                <span className="kpi-period">Last 6 months</span>
              </div>
            </div>
            <div className="kpi-value">{formatCurrency(cashflowData.inflow)}</div>
            <div className="kpi-change positive">
              <TrendUp size={14} />
              {cashflowData.inflowChange}
            </div>
          </div>

          <div className="kpi-card outflow">
            <div className="kpi-header">
              <div className="kpi-icon">
                <ArrowDownRight size={20} />
              </div>
              <div className="kpi-title">
                <h4>Total Cash Outflow</h4>
                <span className="kpi-period">Last 6 months</span>
              </div>
            </div>
            <div className="kpi-value">{formatCurrency(cashflowData.outflow)}</div>
            <div className="kpi-change negative">
              <TrendDown size={14} />
              {cashflowData.outflowChange}
            </div>
          </div>

          <div className="kpi-card net">
            <div className="kpi-header">
              <div className="kpi-icon">
                <Dollar size={20} />
              </div>
              <div className="kpi-title">
                <h4>Net Cashflow</h4>
                <span className="kpi-period">Balance</span>
              </div>
            </div>
            <div className="kpi-value">{formatCurrency(cashflowData.net)}</div>
            <div className={`kpi-status ${cashflowData.net >= 0 ? 'positive' : 'negative'}`}>
              {cashflowData.net >= 0 ? 'Positive Cashflow' : 'Negative Cashflow'}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Monthly Cashflow Trend */}
          <div className="chart-card">
            <div className="chart-header">
              <h4>Monthly Cashflow Trend</h4>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color inflow"></span>
                  <span>Inflow</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color outflow"></span>
                  <span>Outflow</span>
                </div>
              </div>
            </div>
            <div className="area-chart">
              <div className="chart-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid-line"></div>
                ))}
              </div>
              <div className="chart-bars">
                {cashflowData.monthly.map((month, index) => (
                  <div key={index} className="bar-group">
                    <div className="bar-label">{month.month}</div>
                    <div className="bars">
                      <div 
                        className="bar inflow" 
                        style={{ height: `${(month.inflow / 700000) * 100}%` }}
                        title={`Inflow: ${formatCurrency(month.inflow)}`}
                      >
                        <div className="bar-value">{formatCurrency(month.inflow).replace('UGX', '')}</div>
                      </div>
                      <div 
                        className="bar outflow" 
                        style={{ height: `${(month.outflow / 700000) * 100}%` }}
                        title={`Outflow: ${formatCurrency(month.outflow)}`}
                      >
                        <div className="bar-value">{formatCurrency(month.outflow).replace('UGX', '')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cashflow by Category */}
          <div className="chart-card">
            <div className="chart-header">
              <h4>Cashflow by Category</h4>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color earnings"></span>
                  <span>Earnings</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color net-earnings"></span>
                  <span>Net Earnings</span>
                </div>
              </div>
            </div>
            <div className="category-chart">
              <div className="category-grid">
                {cashflowData.categories.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-name">{category.name}</div>
                    <div className="category-bars">
                      <div 
                        className="category-bar earnings" 
                        style={{ 
                          width: `${(category.earnings / 2000000) * 100}%`,
                          backgroundColor: category.color
                        }}
                      >
                        <span className="bar-label">Earnings: {formatCurrency(category.earnings)}</span>
                      </div>
                      <div 
                        className="category-bar net-earnings" 
                        style={{ 
                          width: `${(category.netEarnings / 2000000) * 100}%`,
                          backgroundColor: category.color,
                          opacity: 0.7
                        }}
                      >
                        <span className="bar-label">Net: {formatCurrency(category.netEarnings)}</span>
                      </div>
                    </div>
                    <div className="category-total">
                      {formatCurrency(category.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookkeeping = () => {
    if (!bookkeepingData) return null;

    return (
      <div className="bookkeeping-section animate-fade-in">
        <div className="section-header">
          <div>
            <h3>Bookkeeping & Reconciliation</h3>
            <p className="section-subtitle">Operational finance management and task tracking</p>
          </div>
        </div>

        {/* Operational Status Cards */}
        <div className="operational-cards">
          <div className="op-card">
            <div className="op-icon outstanding">
              <FileCheck size={20} />
            </div>
            <div className="op-content">
              <h4>Outstanding Invoices</h4>
              <div className="op-value">{bookkeepingData.outstandingInvoices.count}</div>
              <div className="op-subtitle">
                Total: {formatCurrency(bookkeepingData.outstandingInvoices.value)}
              </div>
            </div>
          </div>

          <div className="op-card">
            <div className="op-icon pending">
              <AlertCircle size={20} />
            </div>
            <div className="op-content">
              <h4>Pending Expenses</h4>
              <div className="op-value">{bookkeepingData.pendingExpenses.count}</div>
              <div className="op-subtitle">
                {bookkeepingData.pendingExpenses.description}
              </div>
            </div>
          </div>

          <div className="op-card">
            <div className="op-icon reconciled">
              <CheckCircle size={20} />
            </div>
            <div className="op-content">
              <h4>Reconciliation Status</h4>
              <div className="op-value">{bookkeepingData.reconciliationStatus.percentage}%</div>
              <div className="op-subtitle">
                {bookkeepingData.reconciliationStatus.label}
              </div>
            </div>
          </div>
        </div>

        {/* Bookkeeping Status Panel */}
        <div className="bookkeeping-panel">
          <div className="panel-header">
            <h4>Bookkeeping Status</h4>
            <div className="overall-progress">
              <span className="progress-label">Overall Progress</span>
              <span className="progress-value">{bookkeepingData.bookkeepingStatus.overall}%</span>
            </div>
          </div>
          
          <div className="progress-bar-large">
            <div 
              className="progress-fill" 
              style={{ width: `${bookkeepingData.bookkeepingStatus.overall}%` }}
            ></div>
          </div>

          <div className="task-breakdown">
            {bookkeepingData.bookkeepingStatus.tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <span className="task-name">{task.name}</span>
                  <span className="task-count">{task.completed}/{task.total}</span>
                </div>
                <div className="task-progress">
                  <div 
                    className="progress-bar-small"
                    style={{ '--progress-color': task.color }}
                  >
                    <div 
                      className="progress-fill-small" 
                      style={{ width: `${(task.completed / task.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`task-status ${task.status}`}>
                    {task.status === 'completed' && <Check size={12} />}
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBalanceSheet = () => {
    if (!balanceSheet) return null;

    return (
      <div className="balance-sheet-section animate-fade-in">
        <div className="section-header">
          <div>
            <h3>Balance Sheet Snapshot</h3>
            <p className="section-subtitle">Financial position and net worth calculation</p>
          </div>
        </div>

        <div className="balance-cards">
          <div className="balance-card assets">
            <div className="balance-header">
              <h4>Assets</h4>
              <span className="balance-change positive">
                <ArrowUpRight size={14} />
                {balanceSheet.assets.change}
              </span>
            </div>
            <div className="balance-amount">{formatCurrency(balanceSheet.assets.amount)}</div>
            <div className="balance-type">{balanceSheet.assets.type}</div>
            
            <div className="breakdown-list">
              {balanceSheet.assets.breakdown.map((item, index) => (
                <div key={index} className="breakdown-item">
                  <span className="breakdown-name">{item.name}</span>
                  <span className="breakdown-amount">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="balance-card liabilities">
            <div className="balance-header">
              <h4>Liabilities</h4>
              <span className="balance-change negative">
                <ArrowDownRight size={14} />
                {balanceSheet.liabilities.change}
              </span>
            </div>
            <div className="balance-amount">{formatCurrency(balanceSheet.liabilities.amount)}</div>
            <div className="balance-type">{balanceSheet.liabilities.type}</div>
            
            <div className="breakdown-list">
              {balanceSheet.liabilities.breakdown.map((item, index) => (
                <div key={index} className="breakdown-item">
                  <span className="breakdown-name">{item.name}</span>
                  <span className="breakdown-amount">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="balance-card equity">
            <div className="balance-header">
              <h4>Equity</h4>
              <span className="balance-change positive">
                <ArrowUpRight size={14} />
                {balanceSheet.equity.change}
              </span>
            </div>
            <div className="balance-amount">{formatCurrency(balanceSheet.equity.amount)}</div>
            <div className="balance-type">{balanceSheet.equity.type}</div>
            
            <div className="breakdown-list">
              {balanceSheet.equity.breakdown.map((item, index) => (
                <div key={index} className="breakdown-item">
                  <span className="breakdown-name">{item.name}</span>
                  <span className="breakdown-amount">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Net Worth Calculation */}
        <div className="net-worth-card">
          <div className="net-worth-header">
            <Calculator size={20} />
            <h4>Net Worth Calculation</h4>
          </div>
          <div className="calculation-formula">
            <span className="formula-part">Assets</span>
            <span className="formula-operator">−</span>
            <span className="formula-part">Liabilities</span>
            <span className="formula-operator">=</span>
            <span className="formula-result">Net Worth</span>
          </div>
          <div className="net-worth-amount highlight">
            {formatCurrency(balanceSheet.netWorth)}
          </div>
        </div>
      </div>
    );
  };

  const renderActivityTracking = () => {
    return (
      <div className="activity-section animate-fade-in">
        <div className="section-header">
          <div>
            <h3>Activity & Automation Tracking</h3>
            <p className="section-subtitle">System-triggered events and background automation</p>
          </div>
          <button className="btn btn-outline" onClick={loadAllData}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="activity-feed">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon" style={{ color: activity.color }}>
                {activity.icon}
              </div>
              <div className="activity-details">
                <div className="activity-title">{activity.action}</div>
                <div className="activity-meta">
                  <span className="activity-time">{activity.time}</span>
                  <span className="activity-divider">•</span>
                  <span className="activity-source">{activity.user}</span>
                </div>
              </div>
              <div className="activity-status">
                <Clock size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPerformanceAnalytics = () => {
    if (!performanceData) return null;

    return (
      <div className="performance-analytics animate-fade-in">
        <div className="section-header">
          <div>
            <h3>Profitability & Performance Analytics</h3>
            <p className="section-subtitle">Deep dive into earnings, expenses, and profit trends</p>
          </div>
          
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${performanceView === 'monthly' ? 'active' : ''}`}
              onClick={() => setPerformanceView('monthly')}
            >
              Monthly Overview
            </button>
            <button 
              className={`toggle-btn ${performanceView === 'quarterly' ? 'active' : ''}`}
              onClick={() => setPerformanceView('quarterly')}
            >
              Quarterly Summary
            </button>
          </div>
        </div>

        {/* Performance KPI Cards */}
        <div className="performance-kpi-grid">
          <div className="kpi-card earnings">
            <div className="kpi-header">
              <Dollar size={18} />
              <h4>Total Earnings</h4>
            </div>
            <div className="kpi-value">
              {formatCurrency(performanceData[`${performanceView}View`].totalEarnings)}
            </div>
            <div className="kpi-growth positive">
              <TrendUp size={14} />
              YoY: {performanceData[`${performanceView}View`].earningsGrowth}
            </div>
            <div className="kpi-tag">Consistent Performance</div>
          </div>

          <div className="kpi-card expenses">
            <div className="kpi-header">
              <CreditCardIcon size={18} />
              <h4>Total Expenses</h4>
            </div>
            <div className="kpi-value">
              {formatCurrency(performanceData[`${performanceView}View`].totalExpenses)}
            </div>
            <div className="kpi-ratio">
              {performanceData[`${performanceView}View`].expensesRatio} of earnings
            </div>
          </div>

          <div className="kpi-card net-income">
            <div className="kpi-header">
              <TrendUp size={18} />
              <h4>Net Income</h4>
            </div>
            <div className="kpi-value">
              {formatCurrency(performanceData[`${performanceView}View`].netIncome)}
            </div>
            <div className="kpi-growth positive">
              <TrendUp size={14} />
              {performanceData[`${performanceView}View`].netIncomeGrowth}
            </div>
          </div>

          <div className="kpi-card margin">
            <div className="kpi-header">
              <Target size={18} />
              <h4>Profit Margin</h4>
            </div>
            <div className="kpi-value">
              {performanceData[`${performanceView}View`].profitMargin}%
            </div>
            <div className="kpi-tag">Industry Leading</div>
          </div>
        </div>

        {/* Financial Performance Chart */}
        <div className="performance-chart-card">
          <div className="chart-header">
            <h4>Financial Performance Trend</h4>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color earnings"></span>
                <span>Earnings</span>
              </div>
              <div className="legend-item">
                <span className="legend-color net-earnings"></span>
                <span>Net Earnings</span>
              </div>
              <div className="legend-item">
                <span className="legend-color expenses"></span>
                <span>Expenses</span>
              </div>
            </div>
          </div>
          
          <div className="multi-line-chart">
            <div className="chart-lines">
              {performanceData.performanceChart.labels.map((label, index) => (
                <div key={index} className="chart-point-group">
                  <div className="chart-point earnings" 
                    style={{ bottom: `${(performanceData.performanceChart.earnings[index] / 15000000) * 100}%` }}
                    title={`Earnings: ${formatCurrency(performanceData.performanceChart.earnings[index])}`}
                  ></div>
                  <div className="chart-point net-earnings" 
                    style={{ bottom: `${(performanceData.performanceChart.netEarnings[index] / 15000000) * 100}%` }}
                    title={`Net: ${formatCurrency(performanceData.performanceChart.netEarnings[index])}`}
                  ></div>
                  <div className="chart-point expenses" 
                    style={{ bottom: `${(performanceData.performanceChart.expenses[index] / 15000000) * 100}%` }}
                    title={`Expenses: ${formatCurrency(performanceData.performanceChart.expenses[index])}`}
                  ></div>
                  <div className="chart-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Year Summary & Strategic Metrics */}
        <div className="year-summary-section">
          <div className="year-highlights">
            <h4>Year Highlights</h4>
            <div className="highlights-grid">
              <div className="highlight-card">
                <div className="highlight-icon best-month">
                  <Calendar size={18} />
                </div>
                <div className="highlight-content">
                  <div className="highlight-title">Best Month</div>
                  <div className="highlight-value">{performanceData.yearHighlights.bestMonth.month}</div>
                  <div className="highlight-details">
                    {formatCurrency(performanceData.yearHighlights.bestMonth.earnings)} earnings
                  </div>
                </div>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon best-quarter">
                  <TrendUp size={18} />
                </div>
                <div className="highlight-content">
                  <div className="highlight-title">Best Quarter</div>
                  <div className="highlight-value">{performanceData.yearHighlights.bestQuarter.quarter}</div>
                  <div className="highlight-details">
                    {formatCurrency(performanceData.yearHighlights.bestQuarter.earnings)} earnings
                  </div>
                </div>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon avg-earnings">
                  <Dollar size={18} />
                </div>
                <div className="highlight-content">
                  <div className="highlight-title">Avg. Monthly Earnings</div>
                  <div className="highlight-value">
                    {formatCurrency(performanceData.yearHighlights.avgMonthlyEarnings)}
                  </div>
                  <div className="highlight-details">Consistent growth trajectory</div>
                </div>
              </div>
            </div>
          </div>

          <div className="key-metrics">
            <h4>Key Metrics</h4>
            <div className="metrics-grid">
              {Object.entries(performanceData.yearHighlights.keyMetrics).map(([key, value], index) => (
                <div key={index} className="metric-item">
                  <span className="metric-label">{key.replace(/([A-Z])/g, ' $1').replace('YoY', '(YoY)')}</span>
                  <span className="metric-value">{typeof value === 'number' ? formatCurrency(value) : value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrendsAndYearEnd = () => {
    if (!trendsData) return null;

    return (
      <div className="trends-year-end animate-fade-in">
        <div className="section-header">
          <div>
            <h3>Trends & Year-End Analysis</h3>
            <p className="section-subtitle">Historical trends and future projections</p>
          </div>
          
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              <TrendUp size={16} /> Trends
            </button>
            <button 
              className={`toggle-btn ${activeTab === 'year-end' ? 'active' : ''}`}
              onClick={() => setActiveTab('year-end')}
            >
              <Calendar size={16} /> Year-End
            </button>
          </div>
        </div>

        {activeTab === 'trends' ? (
          <>
            {/* Monthly Trends Table */}
            <div className="trends-table-card">
              <h4>Monthly Earnings & Expenses Report</h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Total Earnings</th>
                      <th>Gross Profit</th>
                      <th>Net Earnings</th>
                      <th>Margin</th>
                      <th>Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendsData.monthlyTrends.map((month, index) => (
                      <tr key={index} className="hover-row">
                        <td>{month.month}</td>
                        <td>{formatCurrency(month.earnings)}</td>
                        <td>{formatCurrency(month.profit)}</td>
                        <td>{formatCurrency(month.profit)}</td>
                        <td>
                          <span className="margin-badge">{month.margin}%</span>
                        </td>
                        <td>
                          <span className={`growth-badge ${month.growth.includes('+') ? 'positive' : 'negative'}`}>
                            {month.growth}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Annual Trends */}
            <div className="annual-trends-card">
              <h4>Annual Performance Trends</h4>
              <div className="annual-chart">
                <div className="chart-bars-horizontal">
                  {trendsData.annualTrends.map((year, index) => (
                    <div key={index} className="year-bar-group">
                      <div className="year-label">{year.year}</div>
                      <div className="year-bars">
                        <div 
                          className="year-bar earnings" 
                          style={{ width: `${(year.earnings / 5000000) * 100}%` }}
                        >
                          <span className="bar-value">Earnings: {formatCurrency(year.earnings)}</span>
                        </div>
                        <div 
                          className="year-bar net-earnings" 
                          style={{ width: `${(year.profit / 5000000) * 100}%` }}
                        >
                          <span className="bar-value">Net: {formatCurrency(year.profit)}</span>
                        </div>
                      </div>
                      <div className="year-metrics">
                        <span className="metric">Margin: {year.margin}%</span>
                        <span className="metric">Growth: {year.growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Growth Metrics */}
            <div className="growth-metrics">
              <div className="metric-card">
                <div className="metric-icon">
                  <TrendUp size={24} />
                </div>
                <div className="metric-content">
                  <div className="metric-label">5 Year Growth Rate</div>
                  <div className="metric-value">{trendsData.growthMetrics.cagr}</div>
                  <div className="metric-subtitle">Compound Annual Growth</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Target size={24} />
                </div>
                <div className="metric-content">
                  <div className="metric-label">2025 Projection</div>
                  <div className="metric-value">{formatCurrency(trendsData.growthMetrics.projection2025)}</div>
                  <div className="metric-subtitle">Expected annual earnings</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Shield size={24} />
                </div>
                <div className="metric-content">
                  <div className="metric-label">Consistent Margin</div>
                  <div className="metric-value">{trendsData.growthMetrics.consistentMargin}</div>
                  <div className="metric-subtitle">Net profit margin</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="year-end-analysis">
            <div className="year-end-card">
              <h4>Year-End Summary</h4>
              <div className="year-end-grid">
                <div className="year-stat">
                  <div className="stat-label">Year-to-Date Revenue</div>
                  <div className="stat-value">{formatCurrency(42800000)}</div>
                  <div className="stat-change positive">+12.5% vs target</div>
                </div>
                
                <div className="year-stat">
                  <div className="stat-label">Year-to-Date Expenses</div>
                  <div className="stat-value">{formatCurrency(24300000)}</div>
                  <div className="stat-change positive">-8.2% vs last year</div>
                </div>
                
                <div className="year-stat">
                  <div className="stat-label">Year-to-Date Net</div>
                  <div className="stat-value highlight">{formatCurrency(18500000)}</div>
                  <div className="stat-change positive">+18.2% from last year</div>
                </div>
                
                <div className="year-stat">
                  <div className="stat-label">Operating Margin</div>
                  <div className="stat-value">43.2%</div>
                  <div className="stat-change positive">+5.1% improvement</div>
                </div>
              </div>
              
              <div className="year-end-actions">
                <button className="btn btn-primary">
                  <FileText size={16} /> Generate Year-End Report
                </button>
                <button className="btn btn-outline">
                  <Calendar size={16} /> Schedule Tax Filing
                </button>
                <button className="btn btn-outline">
                  <TrendUp size={16} /> Compare with Previous Year
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // P&L Sub Navigation
  const renderPLSubNav = () => {
    return (
      <div className="pl-subnav">
        {['daily', 'weekly', 'monthly', 'annual'].map((period) => (
          <button
            key={period}
            className={`pl-subnav-btn ${activePLView === period ? 'active' : ''}`}
            onClick={() => setActivePLView(period)}
          >
            <span className="period-name">
              {period.charAt(0).toUpperCase() + period.slice(1)} P&L
            </span>
            <span className="period-badge">
              {period === 'daily' ? '24h' : period === 'weekly' ? '7d' : period === 'monthly' ? '30d' : '1y'}
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="statements-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-main">
          <div className="header-title">
            
            <div>
              <h1>Financials & Reports</h1>
              <p className="header-subtitle">Complete financial tracking and insights dashboard</p>
            </div>
          </div>
          
          <div className="header-info">
            <div className="info-badge">
              <Calendar size={14} />
              <span>Jan 31, 2025 – Dec, 2025</span>
            </div>
            <button className="btn btn-outline" onClick={loadAllData} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-card small">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: '#06D6A020', color: '#06D6A0' }}>
                <TrendUp size={16} />
              </div>
              <div>
                <div className="stat-label">Net Earnings (YTD)</div>
                <div className="stat-value">UGX 18.5M</div>
              </div>
            </div>
            <div className="stat-change positive">+18.2%</div>
          </div>
          
          <div className="stat-card small">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: '#6366f120', color: '#6366f1' }}>
                <Dollar size={16} />
              </div>
              <div>
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">UGX 42.8M</div>
              </div>
            </div>
            <div className="stat-change positive">+12.5%</div>
          </div>
          
          <div className="stat-card small">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                <CreditCard size={16} />
              </div>
              <div>
                <div className="stat-label">Total Expenses</div>
                <div className="stat-value">UGX 24.3M</div>
              </div>
            </div>
            <div className="stat-change negative">-8.2%</div>
          </div>
          
          <div className="stat-card small">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                <Wallet size={16} />
              </div>
              <div>
                <div className="stat-label">Wallet Balance</div>
                <div className="stat-value">UGX 3.5M</div>
              </div>
            </div>
            <div className="stat-change positive">+12.8%</div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="nav-scroll">
          <button className={`nav-btn ${activeView === 'pl' ? 'active' : ''}`} onClick={() => setActiveView('pl')}>
            <BarChart3 size={16} />
            <span>P&L Reports</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
          
          <button className={`nav-btn ${activeView === 'expenses' ? 'active' : ''}`} onClick={() => setActiveView('expenses')}>
            <CreditCard size={16} />
            <span>Expenses</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
          
          <button className={`nav-btn ${activeView === 'wallet' ? 'active' : ''}`} onClick={() => setActiveView('wallet')}>
            <Wallet size={16} />
            <span>Wallet</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
          
          <button className={`nav-btn ${activeView === 'cashflow' ? 'active' : ''}`} onClick={() => setActiveView('cashflow')}>
            <Activity size={16} />
            <span>Cashflow</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
          
          <button className={`nav-btn ${activeView === 'bookkeeping' ? 'active' : ''}`} onClick={() => setActiveView('bookkeeping')}>
            <FileCheck size={16} />
            <span>Bookkeeping</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
          
          <button className={`nav-btn ${activeView === 'balance' ? 'active' : ''}`} onClick={() => setActiveView('balance')}>
            <Calculator size={16} />
            <span>Balance Sheet</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
          
          <button className={`nav-btn ${activeView === 'activity' ? 'active' : ''}`} onClick={() => setActiveView('activity')}>
            <History size={16} />
            <span>Activity</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
          
          <button className={`nav-btn ${activeView === 'performance' ? 'active' : ''}`} onClick={() => setActiveView('performance')}>
            <Target size={16} />
            <span>Performance</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
          
          <button className={`nav-btn ${activeView === 'trends' ? 'active' : ''}`} onClick={() => setActiveView('trends')}>
            <TrendUp size={16} />
            <span>Trends</span>
            <ChevronRight size={14} className="nav-chevron" />
          </button>
        </div>
      </nav>

      {/* P&L Sub Navigation */}
      {activeView === 'pl' && renderPLSubNav()}

      {/* Export Controls */}
      <div className="export-section">
        <div className="export-header">
          <h3>Export & Reporting</h3>
          <div className="export-format">
            <span className="format-label">Format:</span>
            <div className="format-tabs">
              <button 
                className={`format-tab ${exportFormat === 'pdf' ? 'active' : ''}`}
                onClick={() => setExportFormat('pdf')}
              >
                <FileText size={14} /> PDF
              </button>
              <button 
                className={`format-tab ${exportFormat === 'excel' ? 'active' : ''}`}
                onClick={() => setExportFormat('excel')}
              >
                <FileSpreadsheet size={14} /> Excel
              </button>
              <button 
                className={`format-tab ${exportFormat === 'csv' ? 'active' : ''}`}
                onClick={() => setExportFormat('csv')}
              >
                <FileBarChart size={14} /> CSV
              </button>
            </div>
          </div>
        </div>
        
        <div className="export-actions">
          <button className="btn btn-primary" onClick={() => handleExport(exportFormat)} disabled={loading}>
            <Download size={16} />
            {loading ? 'Exporting...' : `Export to ${exportFormat.toUpperCase()}`}
          </button>
          
          <button className="btn btn-outline" onClick={handleExportFiltered} disabled={loading}>
            <Filter size={16} />
            Export Filtered View
          </button>
          
          <button className="btn btn-outline" onClick={() => document.getElementById('scheduleModal').showModal()}>
            <Calendar size={16} />
            Schedule Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {activeView === 'pl' && renderPLView()}
        {activeView === 'expenses' && renderExpenseLedger()}
        {activeView === 'wallet' && renderWalletStatement()}
        {activeView === 'cashflow' && renderCashflowAnalysis()}
        {activeView === 'bookkeeping' && renderBookkeeping()}
        {activeView === 'balance' && renderBalanceSheet()}
        {activeView === 'activity' && renderActivityTracking()}
        {activeView === 'performance' && renderPerformanceAnalytics()}
        {activeView === 'trends' && renderTrendsAndYearEnd()}
      </main>

      {/* Schedule Export Modal */}
      <dialog id="scheduleModal" className="modal">
        <div className="modal-content animate-slide-up">
          <div className="modal-header">
            <h3>Schedule Automatic Export</h3>
            <button className="btn-close" onClick={() => document.getElementById('scheduleModal').close()}>
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Frequency *</label>
                <select 
                  value={scheduleConfig.frequency}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, frequency: e.target.value})}
                  className="form-select"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Time *</label>
                <input 
                  type="time" 
                  value={scheduleConfig.time}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, time: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Format *</label>
                <select 
                  value={scheduleConfig.format}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, format: e.target.value})}
                  className="form-select"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Report Type *</label>
                <select 
                  value={scheduleConfig.reportType}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, reportType: e.target.value})}
                  className="form-select"
                >
                  <option value="pl">P&L Report</option>
                  <option value="expenses">Expense Ledger</option>
                  <option value="cashflow">Cashflow Summary</option>
                  <option value="complete">Complete Report</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => document.getElementById('scheduleModal').close()}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleScheduleExport}>
              <Calendar size={16} /> Schedule Export
            </button>
          </div>
        </div>
      </dialog>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default Statements;