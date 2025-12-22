"use client"

import React, { useState, useEffect } from 'react';
import './statements.css';
import { 
  Download, FileText, FileSpreadsheet, FileBarChart, 
  Calendar, Filter, Plus, Edit, Trash2, CheckCircle,
  TrendingUp, Wallet, PieChart, BarChart3, ChevronRight,
  Eye, Search, CreditCard, DollarSign, TrendingDown, Check,
  AlertCircle, Clock, RefreshCw, Save, ChevronDown,
  Activity, Target, BarChart2, CreditCard as CreditCardIcon,
  Calculator, History, Database, ArrowUpRight, ArrowDownRight,
  Circle, CalendarDays, DollarSign as Dollar, Briefcase, 
  TrendingUp as TrendUp, TrendingDown as TrendDown,
  MoreVertical, Settings, Bell, LineChart, Users, Shield,
  FileCheck, Zap, Layers, Home, Car, ShoppingBag,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight as ChevronRightIcon,
  Upload, Share2, Cloud, X, Menu, ArrowLeft
} from 'lucide-react';

// Enhanced Mock Data Service - Preserved all functionality
const financialDataService = {
  getPLData: (period) => {
    const data = {
      daily: {
        income: 1450000,
        expenses: 450000,
        net: 1000000,
        margin: 69.0,
        color: '#6366f1',
        icon: <Activity size={16} />,
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
        icon: <CalendarDays size={16} />,
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
        icon: <BarChart2 size={16} />,
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
        icon: <Target size={16} />,
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

  getWalletTransactions: () => [
    { id: 1, date: 'Today 2:30 PM', description: 'Mobile Money Deposit', type: 'Deposit', amount: 450000, balance: 3950000, icon: '💳' },
    { id: 2, date: 'Today 11:00 AM', description: 'Fuel Expense - Shell', type: 'Withdrawal', amount: -265000, balance: 3500000, icon: '⛽' },
    { id: 3, date: 'Yesterday 4:15 PM', description: 'Maintenance Payment', type: 'Withdrawal', amount: -165000, balance: 3765000, icon: '🔧' },
    { id: 4, date: 'Jan 14, 10:30 AM', description: 'Daily Earnings', type: 'Deposit', amount: 850000, balance: 3930000, icon: '💰' },
    { id: 5, date: 'Jan 13, 3:45 PM', description: 'Parts Purchase', type: 'Withdrawal', amount: -85000, balance: 3080000, icon: '🛠️' }
  ],

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

  getRecentActivity: () => [
    { id: 1, action: 'Reconciled Cash Account', time: 'Today, 2:30 PM', user: 'System', icon: <Database size={14} />, color: '#06D6A0' },
    { id: 2, action: 'Processed 2 expense receipts', time: 'Today, 11:31 AM', user: 'Auto Categorization', icon: <FileCheck size={14} />, color: '#6366f1' },
    { id: 3, action: 'Generated Monthly P&L report', time: 'Yesterday, 4:41 PM', user: 'Scheduled Task', icon: <BarChart2 size={14} />, color: '#f59e0b' },
    { id: 4, action: 'Updated tax calculations', time: 'Yesterday, 11:00 AM', user: 'System', icon: <Calculator size={14} />, color: '#8b5cf6' },
    { id: 5, action: 'Backed up financial data', time: 'Jan 15, 9:15 PM', user: 'Automated Backup', icon: <Shield size={14} />, color: '#3b82f6' }
  ],

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
  // State management - All original states preserved
  const [activePLView, setActivePLView] = useState('monthly');
  const [activeView, setActiveView] = useState('pl');
  const [activeTab, setActiveTab] = useState('trends');
  const [performanceView, setPerformanceView] = useState('monthly');
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize all data - Preserved functionality
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

  // CRUD Operations - Preserved all functionality
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

  // Export Functions - Preserved all functionality
  const handleExport = async (format, data = null) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let exportData = data || getCurrentViewData();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `financial-report-${timestamp}.${format}`;
    
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

  // Helper Functions - Preserved all functionality
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
    toast.className = `compact-toast compact-toast-${type}`;
    toast.innerHTML = `
      <div class="compact-toast-content">
        <span class="compact-toast-message">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('compact-show'), 10);
    setTimeout(() => {
      toast.classList.remove('compact-show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Render Functions - Compact version with all features
  const renderCompactHeader = () => (
    <div className="compact-header">
      <div className="compact-header-content">
        <div className="compact-header-left">
          <button 
            className="compact-mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="compact-title-icon">
            <FileBarChart size={20} />
          </div>
          <div>
            <h1 className="compact-title">FINANCIAL REPORTS</h1>
            <p className="compact-subtitle">Complete financial tracking and insights</p>
          </div>
        </div>
        <div className="compact-header-right">
          <div className="compact-header-actions">
            <button className="compact-btn-icon" title="Refresh" onClick={loadAllData}>
              <RefreshCw size={16} />
            </button>
            <button className="compact-btn-icon" title="Notifications">
              <Bell size={16} />
            </button>
            <button className="compact-btn-icon" title="Settings">
              <Settings size={16} />
            </button>
          </div>
          <div className="compact-user-profile">
            <span className="compact-user-name">Moses. K</span>
            <div className="compact-user-avatar">MK</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompactStats = () => (
    <div className="compact-stats-grid">
      <div className="compact-stat-card stat-blue">
        <div className="compact-stat-icon">
          <TrendUp size={16} />
        </div>
        <div className="compact-stat-content">
          <div className="compact-stat-label">Net Earnings</div>
          <div className="compact-stat-value">18.5M</div>
          <div className="compact-stat-change positive">+18.2%</div>
        </div>
      </div>

      <div className="compact-stat-card stat-green">
        <div className="compact-stat-icon">
          <DollarSign size={16} />
        </div>
        <div className="compact-stat-content">
          <div className="compact-stat-label">Revenue</div>
          <div className="compact-stat-value">42.8M</div>
          <div className="compact-stat-change positive">+12.5%</div>
        </div>
      </div>

      <div className="compact-stat-card stat-red">
        <div className="compact-stat-icon">
          <CreditCard size={16} />
        </div>
        <div className="compact-stat-content">
          <div className="compact-stat-label">Expenses</div>
          <div className="compact-stat-value">24.3M</div>
          <div className="compact-stat-change negative">-8.2%</div>
        </div>
      </div>

      <div className="compact-stat-card stat-yellow">
        <div className="compact-stat-icon">
          <Wallet size={16} />
        </div>
        <div className="compact-stat-content">
          <div className="compact-stat-label">Wallet</div>
          <div className="compact-stat-value">3.5M</div>
          <div className="compact-stat-change positive">+12.8%</div>
        </div>
      </div>
    </div>
  );

  const renderCompactNav = () => (
    <div className={`compact-nav ${mobileMenuOpen ? 'compact-mobile-open' : ''}`}>
      <div className="compact-nav-scroll">
        <button 
          className={`compact-nav-btn ${activeView === 'pl' ? 'active' : ''}`} 
          onClick={() => { setActiveView('pl'); setMobileMenuOpen(false); }}
        >
          <BarChart3 size={14} />
          <span>P&L Reports</span>
        </button>
        
        <button 
          className={`compact-nav-btn ${activeView === 'expenses' ? 'active' : ''}`} 
          onClick={() => { setActiveView('expenses'); setMobileMenuOpen(false); }}
        >
          <CreditCard size={14} />
          <span>Expenses</span>
        </button>
        
        <button 
          className={`compact-nav-btn ${activeView === 'wallet' ? 'active' : ''}`} 
          onClick={() => { setActiveView('wallet'); setMobileMenuOpen(false); }}
        >
          <Wallet size={14} />
          <span>Wallet</span>
        </button>
        
        <button 
          className={`compact-nav-btn ${activeView === 'cashflow' ? 'active' : ''}`} 
          onClick={() => { setActiveView('cashflow'); setMobileMenuOpen(false); }}
        >
          <Activity size={14} />
          <span>Cashflow</span>
        </button>
        
        <button 
          className={`compact-nav-btn ${activeView === 'bookkeeping' ? 'active' : ''}`} 
          onClick={() => { setActiveView('bookkeeping'); setMobileMenuOpen(false); }}
        >
          <FileCheck size={14} />
          <span>Bookkeeping</span>
        </button>
        
        <button 
          className={`compact-nav-btn ${activeView === 'balance' ? 'active' : ''}`} 
          onClick={() => { setActiveView('balance'); setMobileMenuOpen(false); }}
        >
          <Calculator size={14} />
          <span>Balance Sheet</span>
        </button>
        
        <button 
          className={`compact-nav-btn ${activeView === 'activity' ? 'active' : ''}`} 
          onClick={() => { setActiveView('activity'); setMobileMenuOpen(false); }}
        >
          <History size={14} />
          <span>Activity</span>
        </button>
        
        <button 
          className={`compact-nav-btn ${activeView === 'performance' ? 'active' : ''}`} 
          onClick={() => { setActiveView('performance'); setMobileMenuOpen(false); }}
        >
          <Target size={14} />
          <span>Performance</span>
        </button>
        
        <button 
          className={`compact-nav-btn ${activeView === 'trends' ? 'active' : ''}`} 
          onClick={() => { setActiveView('trends'); setMobileMenuOpen(false); }}
        >
          <TrendUp size={14} />
          <span>Trends</span>
        </button>
      </div>
    </div>
  );

  const renderPLView = () => {
    const data = financialDataService.getPLData(activePLView);
    
    return (
      <div className="compact-content-section">
        <div className="compact-section-header">
          <div className="compact-section-title">
            <h2>Profit & Loss</h2>
            <p className="compact-section-subtitle">{activePLView.charAt(0).toUpperCase() + activePLView.slice(1)} financial overview</p>
          </div>
          <div className="compact-section-actions">
            <div className="compact-period-tabs">
              <button 
                className={`compact-period-tab ${activePLView === 'daily' ? 'active' : ''}`}
                onClick={() => setActivePLView('daily')}
              >
                Daily
              </button>
              <button 
                className={`compact-period-tab ${activePLView === 'weekly' ? 'active' : ''}`}
                onClick={() => setActivePLView('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`compact-period-tab ${activePLView === 'monthly' ? 'active' : ''}`}
                onClick={() => setActivePLView('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`compact-period-tab ${activePLView === 'annual' ? 'active' : ''}`}
                onClick={() => setActivePLView('annual')}
              >
                Annual
              </button>
            </div>
          </div>
        </div>

        <div className="compact-pl-cards">
          <div className="compact-pl-card income">
            <div className="compact-pl-card-header">
              <span>Total Revenue</span>
              <div className="compact-pl-icon">
                <TrendUp size={14} />
              </div>
            </div>
            <div className="compact-pl-value">{formatCurrency(data.income)}</div>
            <div className="compact-pl-change positive">+12.5% vs target</div>
          </div>

          <div className="compact-pl-card expenses">
            <div className="compact-pl-card-header">
              <span>Total Expenses</span>
              <div className="compact-pl-icon">
                <TrendDown size={14} />
              </div>
            </div>
            <div className="compact-pl-value">{formatCurrency(data.expenses)}</div>
            <div className="compact-pl-change negative">-8.2% vs target</div>
          </div>

          <div className="compact-pl-card net highlight">
            <div className="compact-pl-card-header">
              <span>Net Profit</span>
              <div className="compact-pl-icon">
                <DollarSign size={14} />
              </div>
            </div>
            <div className="compact-pl-value">{formatCurrency(data.net)}</div>
            <div className="compact-pl-margin">Margin: {data.margin}%</div>
          </div>

          <div className="compact-pl-card performance">
            <div className="compact-pl-card-header">
              <span>Performance</span>
              <div className="compact-pl-icon">
                <BarChart3 size={14} />
              </div>
            </div>
            <div className="compact-pl-value">{data.margin}%</div>
            <div className="compact-pl-change positive">+5.1% improvement</div>
          </div>
        </div>

        <div className="compact-transactions-list">
          <div className="compact-transactions-header">
            <h3>Recent Transactions</h3>
            <button className="compact-btn btn-sm" onClick={() => handleExport(exportFormat)}>
              <Download size={12} /> Export
            </button>
          </div>
          <div className="compact-transactions">
            {data.transactions.slice(0, 6).map((tx, index) => (
              <div key={tx.id || index} className="compact-transaction">
                <div className="compact-transaction-icon">
                  {tx.type === 'Revenue' ? '💰' : '💸'}
                </div>
                <div className="compact-transaction-details">
                  <div className="compact-transaction-title">
                    {tx.type} • {tx.category || tx.day || tx.week || tx.quarter}
                  </div>
                  <div className="compact-transaction-meta">
                    {tx.time || tx.day || tx.week || tx.quarter}
                  </div>
                </div>
                <div className={`compact-transaction-amount ${tx.type === 'Revenue' || tx.profit ? 'positive' : 'negative'}`}>
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

  const renderExpenseView = () => {
    const filteredExpenses = getFilteredExpenses();
    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    return (
      <div className="compact-content-section">
        <div className="compact-section-header">
          <div className="compact-section-title">
            <h2>Expense Ledger</h2>
            <p className="compact-section-subtitle">Manage and track all business expenses</p>
          </div>
          <div className="compact-section-actions">
            <button 
              className="compact-btn btn-primary" 
              onClick={() => document.getElementById('addExpenseModal').showModal()}
            >
              <Plus size={14} /> Add Expense
            </button>
          </div>
        </div>

        <div className="compact-search-filter-bar">
          <div className="compact-search-box">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="compact-search-input"
            />
          </div>
          <div className="compact-filter-buttons">
            <select 
              value={filters.category} 
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="compact-filter-select"
            >
              <option value="">All Categories</option>
              <option value="Fuel">Fuel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Fees">Fees</option>
              <option value="Parts">Parts</option>
              <option value="Savings">Savings</option>
            </select>
            <select 
              value={filters.status} 
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="compact-filter-select"
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <button 
              className="compact-btn btn-outline" 
              onClick={() => setFilters({ category: '', dateFrom: '', dateTo: '', status: '' })}
            >
              <RefreshCw size={12} /> Clear
            </button>
          </div>
        </div>

        <div className="compact-summary-cards">
          <div className="compact-summary-card">
            <div className="compact-summary-label">Total Expenses</div>
            <div className="compact-summary-value">{formatCurrency(totalAmount)}</div>
          </div>
          <div className="compact-summary-card">
            <div className="compact-summary-label">Transactions</div>
            <div className="compact-summary-value">{filteredExpenses.length}</div>
          </div>
          <div className="compact-summary-card">
            <div className="compact-summary-label">Avg. per Day</div>
            <div className="compact-summary-value">{formatCurrency(Math.round(totalAmount / 30))}</div>
          </div>
        </div>

        <div className="compact-table-container">
          <div className="compact-table-header">
            <div className="compact-table-col">Date</div>
            <div className="compact-table-col">Vendor</div>
            <div className="compact-table-col">Category</div>
            <div className="compact-table-col">Amount</div>
            <div className="compact-table-col">Status</div>
            <div className="compact-table-col">Actions</div>
          </div>
          <div className="compact-table-body">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="compact-table-row">
                <div className="compact-table-col">
                  <div className="compact-date-cell">
                    <span className="compact-date-day">{expense.date.split(' ')[1]}</span>
                    <span className="compact-date-month">{expense.date.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="compact-table-col">
                  <div className="compact-vendor-cell">
                    <div className="compact-vendor-avatar" style={{ backgroundColor: expense.color + '20', color: expense.color }}>
                      {expense.vendor.charAt(0)}
                    </div>
                    <span className="compact-vendor-name">{expense.vendor}</span>
                  </div>
                </div>
                <div className="compact-table-col">
                  <span className="compact-category-tag" style={{ 
                    backgroundColor: expense.color + '20', 
                    color: expense.color,
                    borderColor: expense.color + '40'
                  }}>
                    {expense.category}
                  </span>
                </div>
                <div className="compact-table-col">
                  <span className="compact-amount-cell">{formatCurrency(expense.amount)}</span>
                </div>
                <div className="compact-table-col">
                  <span className={`compact-status-badge ${expense.status.toLowerCase()}`}>
                    {expense.status === 'Paid' ? <Check size={10} /> : <Clock size={10} />}
                    {expense.status}
                  </span>
                </div>
                <div className="compact-table-col">
                  <div className="compact-action-buttons">
                    <button 
                      className="compact-btn-icon" 
                      onClick={() => handleEditExpense(expense)}
                      title="Edit"
                    >
                      <Edit size={12} />
                    </button>
                    <button 
                      className="compact-btn-icon danger" 
                      onClick={() => handleDeleteExpense(expense.id)}
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredExpenses.length === 0 && (
              <div className="compact-empty-state">
                <div className="compact-empty-icon">📊</div>
                <h4>No expenses found</h4>
                <p>Try changing your filters or add a new expense</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWalletView = () => (
    <div className="compact-content-section">
      <div className="compact-section-header">
        <div className="compact-section-title">
          <h2>Wallet Statement</h2>
          <p className="compact-section-subtitle">Track all wallet transactions and balances</p>
        </div>
      </div>
      
      <div className="compact-wallet-overview">
        <div className="compact-wallet-balance-card">
          <div className="compact-wallet-icon">
            <Wallet size={20} />
          </div>
          <div>
            <div className="compact-wallet-label">Current Balance</div>
            <div className="compact-wallet-amount">{formatCurrency(3500000)}</div>
          </div>
        </div>
        <div className="compact-wallet-stats-card">
          <div className="compact-wallet-icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="compact-wallet-label">This Month</div>
            <div className="compact-wallet-amount positive">+{formatCurrency(850000)}</div>
          </div>
        </div>
      </div>

      <div className="compact-table-container">
        <div className="compact-table-header">
          <div className="compact-table-col">Date</div>
          <div className="compact-table-col">Description</div>
          <div className="compact-table-col">Type</div>
          <div className="compact-table-col">Amount</div>
          <div className="compact-table-col">Balance</div>
        </div>
        <div className="compact-table-body">
          {walletTransactions.map((tx) => (
            <div key={tx.id} className="compact-table-row">
              <div className="compact-table-col">{tx.date}</div>
              <div className="compact-table-col">{tx.description}</div>
              <div className="compact-table-col">
                <span className={`compact-badge ${tx.type === 'Deposit' ? 'success' : 'warning'}`}>
                  {tx.type}
                </span>
              </div>
              <div className="compact-table-col">
                <span className={tx.amount > 0 ? 'positive' : 'negative'}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </span>
              </div>
              <div className="compact-table-col">{formatCurrency(tx.balance)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCashflowView = () => {
    if (!cashflowData) return null;

    return (
      <div className="compact-content-section">
        <div className="compact-section-header">
          <div className="compact-section-title">
            <h2>Cashflow Analysis</h2>
            <p className="compact-section-subtitle">Track cash inflows and outflows</p>
          </div>
        </div>

        <div className="compact-cashflow-kpi">
          <div className="compact-kpi-card inflow">
            <div className="compact-kpi-header">
              <ArrowUpRight size={16} />
              <div>
                <div className="compact-kpi-label">Total Inflow</div>
                <div className="compact-kpi-period">Last 6 months</div>
              </div>
            </div>
            <div className="compact-kpi-value">{formatCurrency(cashflowData.inflow)}</div>
            <div className="compact-kpi-change positive">
              <TrendUp size={12} />
              {cashflowData.inflowChange}
            </div>
          </div>

          <div className="compact-kpi-card outflow">
            <div className="compact-kpi-header">
              <ArrowDownRight size={16} />
              <div>
                <div className="compact-kpi-label">Total Outflow</div>
                <div className="compact-kpi-period">Last 6 months</div>
              </div>
            </div>
            <div className="compact-kpi-value">{formatCurrency(cashflowData.outflow)}</div>
            <div className="compact-kpi-change negative">
              <TrendDown size={12} />
              {cashflowData.outflowChange}
            </div>
          </div>

          <div className="compact-kpi-card net">
            <div className="compact-kpi-header">
              <Dollar size={16} />
              <div>
                <div className="compact-kpi-label">Net Cashflow</div>
                <div className="compact-kpi-period">Balance</div>
              </div>
            </div>
            <div className="compact-kpi-value">{formatCurrency(cashflowData.net)}</div>
            <div className={`compact-kpi-status ${cashflowData.net >= 0 ? 'positive' : 'negative'}`}>
              {cashflowData.net >= 0 ? 'Positive Cashflow' : 'Negative Cashflow'}
            </div>
          </div>
        </div>

        <div className="compact-chart-container">
          <div className="compact-chart-header">
            <h3>Monthly Cashflow Trend</h3>
            <div className="compact-chart-legend">
              <div className="compact-legend-item">
                <span className="compact-legend-color inflow"></span>
                <span>Inflow</span>
              </div>
              <div className="compact-legend-item">
                <span className="compact-legend-color outflow"></span>
                <span>Outflow</span>
              </div>
            </div>
          </div>
          <div className="compact-bar-chart">
            {cashflowData.monthly.map((month, index) => (
              <div key={index} className="compact-bar-group">
                <div className="compact-bar-label">{month.month}</div>
                <div className="compact-bars">
                  <div 
                    className="compact-bar inflow" 
                    style={{ height: `${(month.inflow / 700000) * 60}px` }}
                    title={`Inflow: ${formatCurrency(month.inflow)}`}
                  >
                    <div className="compact-bar-value">{formatCurrency(month.inflow).replace('UGX', '')}</div>
                  </div>
                  <div 
                    className="compact-bar outflow" 
                    style={{ height: `${(month.outflow / 700000) * 60}px` }}
                    title={`Outflow: ${formatCurrency(month.outflow)}`}
                  >
                    <div className="compact-bar-value">{formatCurrency(month.outflow).replace('UGX', '')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBookkeepingView = () => {
    if (!bookkeepingData) return null;

    return (
      <div className="compact-content-section">
        <div className="compact-section-header">
          <div className="compact-section-title">
            <h2>Bookkeeping & Reconciliation</h2>
            <p className="compact-section-subtitle">Operational finance management</p>
          </div>
        </div>

        <div className="compact-op-cards">
          <div className="compact-op-card">
            <div className="compact-op-icon">
              <FileCheck size={16} />
            </div>
            <div className="compact-op-content">
              <div className="compact-op-label">Outstanding Invoices</div>
              <div className="compact-op-value">{bookkeepingData.outstandingInvoices.count}</div>
              <div className="compact-op-subtext">
                Total: {formatCurrency(bookkeepingData.outstandingInvoices.value)}
              </div>
            </div>
          </div>

          <div className="compact-op-card">
            <div className="compact-op-icon">
              <AlertCircle size={16} />
            </div>
            <div className="compact-op-content">
              <div className="compact-op-label">Pending Expenses</div>
              <div className="compact-op-value">{bookkeepingData.pendingExpenses.count}</div>
              <div className="compact-op-subtext">
                {bookkeepingData.pendingExpenses.description}
              </div>
            </div>
          </div>

          <div className="compact-op-card">
            <div className="compact-op-icon">
              <CheckCircle size={16} />
            </div>
            <div className="compact-op-content">
              <div className="compact-op-label">Reconciliation</div>
              <div className="compact-op-value">{bookkeepingData.reconciliationStatus.percentage}%</div>
              <div className="compact-op-subtext">
                {bookkeepingData.reconciliationStatus.label}
              </div>
            </div>
          </div>
        </div>

        <div className="compact-progress-panel">
          <div className="compact-progress-header">
            <h3>Bookkeeping Progress</h3>
            <div className="compact-overall-progress">
              <span className="compact-progress-label">Overall</span>
              <span className="compact-progress-value">{bookkeepingData.bookkeepingStatus.overall}%</span>
            </div>
          </div>
          
          <div className="compact-progress-bar-large">
            <div 
              className="compact-progress-fill" 
              style={{ width: `${bookkeepingData.bookkeepingStatus.overall}%` }}
            ></div>
          </div>

          <div className="compact-task-list">
            {bookkeepingData.bookkeepingStatus.tasks.map((task) => (
              <div key={task.id} className="compact-task-item">
                <div className="compact-task-info">
                  <span className="compact-task-name">{task.name}</span>
                  <span className="compact-task-count">{task.completed}/{task.total}</span>
                </div>
                <div className="compact-task-progress">
                  <div 
                    className="compact-progress-bar-small"
                    style={{ '--task-color': task.color }}
                  >
                    <div 
                      className="compact-progress-fill-small" 
                      style={{ width: `${(task.completed / task.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`compact-task-status ${task.status}`}>
                    {task.status === 'completed' && <Check size={10} />}
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

  const renderBalanceView = () => {
    if (!balanceSheet) return null;

    return (
      <div className="compact-content-section">
        <div className="compact-section-header">
          <div className="compact-section-title">
            <h2>Balance Sheet Snapshot</h2>
            <p className="compact-section-subtitle">Financial position overview</p>
          </div>
        </div>

        <div className="compact-balance-cards">
          <div className="compact-balance-card assets">
            <div className="compact-balance-header">
              <h3>Assets</h3>
              <span className="compact-balance-change positive">
                <ArrowUpRight size={12} />
                {balanceSheet.assets.change}
              </span>
            </div>
            <div className="compact-balance-amount">{formatCurrency(balanceSheet.assets.amount)}</div>
            <div className="compact-balance-type">{balanceSheet.assets.type}</div>
            
            <div className="compact-breakdown-list">
              {balanceSheet.assets.breakdown.map((item, index) => (
                <div key={index} className="compact-breakdown-item">
                  <span className="compact-breakdown-name">{item.name}</span>
                  <span className="compact-breakdown-amount">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="compact-balance-card liabilities">
            <div className="compact-balance-header">
              <h3>Liabilities</h3>
              <span className="compact-balance-change negative">
                <ArrowDownRight size={12} />
                {balanceSheet.liabilities.change}
              </span>
            </div>
            <div className="compact-balance-amount">{formatCurrency(balanceSheet.liabilities.amount)}</div>
            <div className="compact-balance-type">{balanceSheet.liabilities.type}</div>
            
            <div className="compact-breakdown-list">
              {balanceSheet.liabilities.breakdown.map((item, index) => (
                <div key={index} className="compact-breakdown-item">
                  <span className="compact-breakdown-name">{item.name}</span>
                  <span className="compact-breakdown-amount">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="compact-balance-card equity">
            <div className="compact-balance-header">
              <h3>Equity</h3>
              <span className="compact-balance-change positive">
                <ArrowUpRight size={12} />
                {balanceSheet.equity.change}
              </span>
            </div>
            <div className="compact-balance-amount">{formatCurrency(balanceSheet.equity.amount)}</div>
            <div className="compact-balance-type">{balanceSheet.equity.type}</div>
            
            <div className="compact-breakdown-list">
              {balanceSheet.equity.breakdown.map((item, index) => (
                <div key={index} className="compact-breakdown-item">
                  <span className="compact-breakdown-name">{item.name}</span>
                  <span className="compact-breakdown-amount">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="compact-net-worth-card">
          <div className="compact-net-worth-header">
            <Calculator size={16} />
            <h3>Net Worth Calculation</h3>
          </div>
          <div className="compact-calculation-formula">
            <span className="compact-formula-part">Assets</span>
            <span className="compact-formula-operator">−</span>
            <span className="compact-formula-part">Liabilities</span>
            <span className="compact-formula-operator">=</span>
            <span className="compact-formula-result">Net Worth</span>
          </div>
          <div className="compact-net-worth-amount">
            {formatCurrency(balanceSheet.netWorth)}
          </div>
        </div>
      </div>
    );
  };

  const renderActivityView = () => (
    <div className="compact-content-section">
      <div className="compact-section-header">
        <div className="compact-section-title">
          <h2>Activity Tracking</h2>
          <p className="compact-section-subtitle">System events and automation</p>
        </div>
        <button className="compact-btn btn-outline" onClick={loadAllData}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="compact-activity-feed">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="compact-activity-item">
            <div className="compact-activity-icon" style={{ color: activity.color }}>
              {activity.icon}
            </div>
            <div className="compact-activity-details">
              <div className="compact-activity-title">{activity.action}</div>
              <div className="compact-activity-meta">
                <span className="compact-activity-time">{activity.time}</span>
                <span className="compact-activity-divider">•</span>
                <span className="compact-activity-source">{activity.user}</span>
              </div>
            </div>
            <div className="compact-activity-status">
              <Clock size={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformanceView = () => {
    if (!performanceData) return null;

    return (
      <div className="compact-content-section">
        <div className="compact-section-header">
          <div className="compact-section-title">
            <h2>Performance Analytics</h2>
            <p className="compact-section-subtitle">Profitability and performance trends</p>
          </div>
          
          <div className="compact-view-toggle">
            <button 
              className={`compact-toggle-btn ${performanceView === 'monthly' ? 'active' : ''}`}
              onClick={() => setPerformanceView('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`compact-toggle-btn ${performanceView === 'quarterly' ? 'active' : ''}`}
              onClick={() => setPerformanceView('quarterly')}
            >
              Quarterly
            </button>
          </div>
        </div>

        <div className="compact-performance-kpi">
          <div className="compact-performance-card earnings">
            <div className="compact-performance-header">
              <Dollar size={16} />
              <h3>Total Earnings</h3>
            </div>
            <div className="compact-performance-value">
              {formatCurrency(performanceData[`${performanceView}View`].totalEarnings)}
            </div>
            <div className="compact-performance-change positive">
              <TrendUp size={12} />
              YoY: {performanceData[`${performanceView}View`].earningsGrowth}
            </div>
          </div>

          <div className="compact-performance-card expenses">
            <div className="compact-performance-header">
              <CreditCardIcon size={16} />
              <h3>Total Expenses</h3>
            </div>
            <div className="compact-performance-value">
              {formatCurrency(performanceData[`${performanceView}View`].totalExpenses)}
            </div>
            <div className="compact-performance-ratio">
              {performanceData[`${performanceView}View`].expensesRatio} of earnings
            </div>
          </div>

          <div className="compact-performance-card net-income">
            <div className="compact-performance-header">
              <TrendUp size={16} />
              <h3>Net Income</h3>
            </div>
            <div className="compact-performance-value">
              {formatCurrency(performanceData[`${performanceView}View`].netIncome)}
            </div>
            <div className="compact-performance-change positive">
              <TrendUp size={12} />
              {performanceData[`${performanceView}View`].netIncomeGrowth}
            </div>
          </div>

          <div className="compact-performance-card margin">
            <div className="compact-performance-header">
              <Target size={16} />
              <h3>Profit Margin</h3>
            </div>
            <div className="compact-performance-value">
              {performanceData[`${performanceView}View`].profitMargin}%
            </div>
          </div>
        </div>

        <div className="compact-year-summary">
          <h3>Year Highlights</h3>
          <div className="compact-highlights-grid">
            <div className="compact-highlight-card">
              <div className="compact-highlight-icon">
                <Calendar size={16} />
              </div>
              <div className="compact-highlight-content">
                <div className="compact-highlight-label">Best Month</div>
                <div className="compact-highlight-value">{performanceData.yearHighlights.bestMonth.month}</div>
                <div className="compact-highlight-details">
                  {formatCurrency(performanceData.yearHighlights.bestMonth.earnings)} earnings
                </div>
              </div>
            </div>

            <div className="compact-highlight-card">
              <div className="compact-highlight-icon">
                <TrendUp size={16} />
              </div>
              <div className="compact-highlight-content">
                <div className="compact-highlight-label">Best Quarter</div>
                <div className="compact-highlight-value">{performanceData.yearHighlights.bestQuarter.quarter}</div>
                <div className="compact-highlight-details">
                  {formatCurrency(performanceData.yearHighlights.bestQuarter.earnings)} earnings
                </div>
              </div>
            </div>

            <div className="compact-highlight-card">
              <div className="compact-highlight-icon">
                <Dollar size={16} />
              </div>
              <div className="compact-highlight-content">
                <div className="compact-highlight-label">Avg. Monthly</div>
                <div className="compact-highlight-value">
                  {formatCurrency(performanceData.yearHighlights.avgMonthlyEarnings)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrendsView = () => {
    if (!trendsData) return null;

    return (
      <div className="compact-content-section">
        <div className="compact-section-header">
          <div className="compact-section-title">
            <h2>Trends & Analysis</h2>
            <p className="compact-section-subtitle">Historical trends and projections</p>
          </div>
          
          <div className="compact-view-toggle">
            <button 
              className={`compact-toggle-btn ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              <TrendUp size={14} /> Trends
            </button>
            <button 
              className={`compact-toggle-btn ${activeTab === 'year-end' ? 'active' : ''}`}
              onClick={() => setActiveTab('year-end')}
            >
              <Calendar size={14} /> Year-End
            </button>
          </div>
        </div>

        {activeTab === 'trends' ? (
          <>
            <div className="compact-trends-table">
              <div className="compact-table-header">
                <div className="compact-table-col">Month</div>
                <div className="compact-table-col">Earnings</div>
                <div className="compact-table-col">Profit</div>
                <div className="compact-table-col">Margin</div>
                <div className="compact-table-col">Growth</div>
              </div>
              <div className="compact-table-body">
                {trendsData.monthlyTrends.map((month, index) => (
                  <div key={index} className="compact-table-row">
                    <div className="compact-table-col">{month.month}</div>
                    <div className="compact-table-col">{formatCurrency(month.earnings)}</div>
                    <div className="compact-table-col">{formatCurrency(month.profit)}</div>
                    <div className="compact-table-col">
                      <span className="compact-margin-badge">{month.margin}%</span>
                    </div>
                    <div className="compact-table-col">
                      <span className={`compact-growth-badge ${month.growth.includes('+') ? 'positive' : 'negative'}`}>
                        {month.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="compact-growth-metrics">
              <div className="compact-metric-card">
                <div className="compact-metric-icon">
                  <TrendUp size={20} />
                </div>
                <div className="compact-metric-content">
                  <div className="compact-metric-label">Growth Rate</div>
                  <div className="compact-metric-value">{trendsData.growthMetrics.cagr}</div>
                  <div className="compact-metric-subtitle">Annual Growth</div>
                </div>
              </div>

              <div className="compact-metric-card">
                <div className="compact-metric-icon">
                  <Target size={20} />
                </div>
                <div className="compact-metric-content">
                  <div className="compact-metric-label">2025 Projection</div>
                  <div className="compact-metric-value">{formatCurrency(trendsData.growthMetrics.projection2025)}</div>
                </div>
              </div>

              <div className="compact-metric-card">
                <div className="compact-metric-icon">
                  <Shield size={20} />
                </div>
                <div className="compact-metric-content">
                  <div className="compact-metric-label">Consistent Margin</div>
                  <div className="compact-metric-value">{trendsData.growthMetrics.consistentMargin}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="compact-year-end">
            <div className="compact-year-end-card">
              <h3>Year-End Summary</h3>
              <div className="compact-year-end-grid">
                <div className="compact-year-stat">
                  <div className="compact-stat-label">YTD Revenue</div>
                  <div className="compact-stat-value">{formatCurrency(42800000)}</div>
                  <div className="compact-stat-change positive">+12.5% vs target</div>
                </div>
                
                <div className="compact-year-stat">
                  <div className="compact-stat-label">YTD Expenses</div>
                  <div className="compact-stat-value">{formatCurrency(24300000)}</div>
                  <div className="compact-stat-change positive">-8.2% vs last year</div>
                </div>
                
                <div className="compact-year-stat">
                  <div className="compact-stat-label">YTD Net</div>
                  <div className="compact-stat-value">{formatCurrency(18500000)}</div>
                  <div className="compact-stat-change positive">+18.2% from last year</div>
                </div>
                
                <div className="compact-year-stat">
                  <div className="compact-stat-label">Operating Margin</div>
                  <div className="compact-stat-value">43.2%</div>
                  <div className="compact-stat-change positive">+5.1% improvement</div>
                </div>
              </div>
              
              <div className="compact-year-end-actions">
                <button className="compact-btn btn-primary">
                  <FileText size={14} /> Generate Report
                </button>
                <button className="compact-btn btn-outline">
                  <Calendar size={14} /> Schedule Tax
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExportControls = () => (
    <div className="compact-export-section">
      <div className="compact-export-header">
        <h3>Export & Reporting</h3>
        <div className="compact-export-format">
          <span className="compact-format-label">Format:</span>
          <div className="compact-format-tabs">
            <button 
              className={`compact-format-tab ${exportFormat === 'pdf' ? 'active' : ''}`}
              onClick={() => setExportFormat('pdf')}
            >
              <FileText size={12} /> PDF
            </button>
            <button 
              className={`compact-format-tab ${exportFormat === 'excel' ? 'active' : ''}`}
              onClick={() => setExportFormat('excel')}
            >
              <FileSpreadsheet size={12} /> Excel
            </button>
            <button 
              className={`compact-format-tab ${exportFormat === 'csv' ? 'active' : ''}`}
              onClick={() => setExportFormat('csv')}
            >
              <FileBarChart size={12} /> CSV
            </button>
          </div>
        </div>
      </div>
      
      <div className="compact-export-actions">
        <button 
          className="compact-btn btn-primary" 
          onClick={() => handleExport(exportFormat)} 
          disabled={loading}
        >
          <Download size={14} />
          {loading ? 'Exporting...' : `Export to ${exportFormat.toUpperCase()}`}
        </button>
        
        <button 
          className="compact-btn btn-outline" 
          onClick={handleExportFiltered} 
          disabled={loading}
        >
          <Filter size={14} />
          Export Filtered
        </button>
        
        <button 
          className="compact-btn btn-outline" 
          onClick={() => document.getElementById('scheduleModal').showModal()}
        >
          <Calendar size={14} />
          Schedule
        </button>
      </div>
    </div>
  );

  // Modal Components - All functionality preserved
  const renderAddExpenseModal = () => (
    <dialog id="addExpenseModal" className="compact-modal">
      <div className="compact-modal-content">
        <div className="compact-modal-header">
          <h3>Add New Expense</h3>
          <button className="compact-btn-close" onClick={() => document.getElementById('addExpenseModal').close()}>
            ×
          </button>
        </div>
        
        <div className="compact-modal-body">
          <div className="compact-form-grid">
            <div className="compact-form-group">
              <label>Date *</label>
              <input 
                type="date" 
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="compact-form-input"
              />
            </div>
            
            <div className="compact-form-group">
              <label>Vendor *</label>
              <input 
                type="text" 
                value={newExpense.vendor}
                onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                className="compact-form-input"
                placeholder="Enter vendor name"
              />
            </div>
            
            <div className="compact-form-group">
              <label>Category *</label>
              <select 
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="compact-form-select"
              >
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Fees">Transaction Fees</option>
                <option value="Parts">Parts & Accessories</option>
                <option value="Savings">Group Savings</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="compact-form-group">
              <label>Amount (UGX) *</label>
              <input 
                type="number" 
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="compact-form-input"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="compact-form-group">
              <label>Status</label>
              <select 
                value={newExpense.status}
                onChange={(e) => setNewExpense({...newExpense, status: e.target.value})}
                className="compact-form-select"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            
            <div className="compact-form-group full-width">
              <label>Description (Optional)</label>
              <textarea 
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="compact-form-textarea"
                placeholder="Add any additional details..."
                rows="2"
              />
            </div>
          </div>
        </div>
        
        <div className="compact-modal-footer">
          <button className="compact-btn btn-outline" onClick={() => document.getElementById('addExpenseModal').close()}>
            Cancel
          </button>
          <button className="compact-btn btn-primary" onClick={handleAddExpense}>
            <Save size={14} /> Save Expense
          </button>
        </div>
      </div>
    </dialog>
  );

  const renderEditExpenseModal = () => (
    editingExpense && (
      <dialog open className="compact-modal">
        <div className="compact-modal-content">
          <div className="compact-modal-header">
            <h3>Edit Expense</h3>
            <button className="compact-btn-close" onClick={() => setEditingExpense(null)}>
              ×
            </button>
          </div>
          
          <div className="compact-modal-body">
            <div className="compact-form-grid">
              <div className="compact-form-group">
                <label>Date *</label>
                <input 
                  type="date" 
                  value={editingExpense.date}
                  onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                  className="compact-form-input"
                />
              </div>
              
              <div className="compact-form-group">
                <label>Vendor *</label>
                <input 
                  type="text" 
                  value={editingExpense.vendor}
                  onChange={(e) => setEditingExpense({...editingExpense, vendor: e.target.value})}
                  className="compact-form-input"
                />
              </div>
              
              <div className="compact-form-group">
                <label>Category *</label>
                <select 
                  value={editingExpense.category}
                  onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value})}
                  className="compact-form-select"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Fees">Transaction Fees</option>
                </select>
              </div>
              
              <div className="compact-form-group">
                <label>Amount (UGX) *</label>
                <input 
                  type="number" 
                  value={editingExpense.amount}
                  onChange={(e) => setEditingExpense({...editingExpense, amount: parseInt(e.target.value)})}
                  className="compact-form-input"
                />
              </div>
              
              <div className="compact-form-group">
                <label>Status</label>
                <select 
                  value={editingExpense.status}
                  onChange={(e) => setEditingExpense({...editingExpense, status: e.target.value})}
                  className="compact-form-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="compact-modal-footer">
            <button className="compact-btn btn-outline" onClick={() => setEditingExpense(null)}>
              Cancel
            </button>
            <button className="compact-btn btn-primary" onClick={handleUpdateExpense}>
              Update Expense
            </button>
          </div>
        </div>
      </dialog>
    )
  );

  const renderScheduleModal = () => (
    <dialog id="scheduleModal" className="compact-modal">
      <div className="compact-modal-content">
        <div className="compact-modal-header">
          <h3>Schedule Automatic Export</h3>
          <button className="compact-btn-close" onClick={() => document.getElementById('scheduleModal').close()}>
            ×
          </button>
        </div>
        
        <div className="compact-modal-body">
          <div className="compact-form-grid">
            <div className="compact-form-group">
              <label>Frequency *</label>
              <select 
                value={scheduleConfig.frequency}
                onChange={(e) => setScheduleConfig({...scheduleConfig, frequency: e.target.value})}
                className="compact-form-select"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="compact-form-group">
              <label>Time *</label>
              <input 
                type="time" 
                value={scheduleConfig.time}
                onChange={(e) => setScheduleConfig({...scheduleConfig, time: e.target.value})}
                className="compact-form-input"
              />
            </div>
            
            <div className="compact-form-group">
              <label>Format *</label>
              <select 
                value={scheduleConfig.format}
                onChange={(e) => setScheduleConfig({...scheduleConfig, format: e.target.value})}
                className="compact-form-select"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            
            <div className="compact-form-group">
              <label>Report Type *</label>
              <select 
                value={scheduleConfig.reportType}
                onChange={(e) => setScheduleConfig({...scheduleConfig, reportType: e.target.value})}
                className="compact-form-select"
              >
                <option value="pl">P&L Report</option>
                <option value="expenses">Expense Ledger</option>
                <option value="cashflow">Cashflow Summary</option>
                <option value="complete">Complete Report</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="compact-modal-footer">
          <button className="compact-btn btn-outline" onClick={() => document.getElementById('scheduleModal').close()}>
            Cancel
          </button>
          <button className="compact-btn btn-primary" onClick={handleScheduleExport}>
            <Calendar size={14} /> Schedule Export
          </button>
        </div>
      </div>
    </dialog>
  );

  const renderScheduledExports = () => (
    scheduledExports.length > 0 && (
      <div className="compact-scheduled-exports">
        <h3>Scheduled Exports</h3>
        <div className="compact-schedules-list">
          {scheduledExports.map((schedule) => (
            <div key={schedule.id} className="compact-schedule-item">
              <div className="compact-schedule-info">
                <div className="compact-schedule-type">{schedule.reportType} Report</div>
                <div className="compact-schedule-details">
                  {schedule.frequency} at {schedule.time} • {schedule.format}
                </div>
              </div>
              <div className="compact-schedule-actions">
                <button 
                  className={`compact-schedule-toggle ${schedule.active ? 'active' : ''}`}
                  onClick={() => toggleSchedule(schedule.id)}
                >
                  {schedule.active ? 'Active' : 'Inactive'}
                </button>
                <button 
                  className="compact-btn-icon danger"
                  onClick={() => handleDeleteSchedule(schedule.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="compact-statements-container">
      {renderCompactHeader()}
      {renderCompactStats()}
      {renderCompactNav()}

      <div className="compact-main-content">
        {activeView === 'pl' && renderPLView()}
        {activeView === 'expenses' && renderExpenseView()}
        {activeView === 'wallet' && renderWalletView()}
        {activeView === 'cashflow' && renderCashflowView()}
        {activeView === 'bookkeeping' && renderBookkeepingView()}
        {activeView === 'balance' && renderBalanceView()}
        {activeView === 'activity' && renderActivityView()}
        {activeView === 'performance' && renderPerformanceView()}
        {activeView === 'trends' && renderTrendsView()}
      </div>

      {renderExportControls()}
      {renderScheduledExports()}

      {/* Modals */}
      {renderAddExpenseModal()}
      {renderEditExpenseModal()}
      {renderScheduleModal()}

      {/* Loading Overlay */}
      {loading && (
        <div className="compact-loading-overlay">
          <div className="compact-loading-spinner"></div>
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default Statements;