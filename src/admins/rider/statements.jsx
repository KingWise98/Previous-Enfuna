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
        { name: 'Owner Capital', amount: 500000, color: '#6366f6' },
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

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
    
    setShowAddModal(false);
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
    
    setShowScheduleModal(false);
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 1000000) {
      return `USh ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `USh ${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `status-badge ${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      z-index: 1000;
      animation: slideUp 0.3s ease-out;
    `;
    
    if (type === 'success') {
      toast.style.background = '#e8f5e9';
      toast.style.color = '#2e7d32';
      toast.style.border = '1px solid #a5d6a7';
    } else if (type === 'warning') {
      toast.style.background = '#fff9c4';
      toast.style.color = '#f59e0b';
      toast.style.border = '1px solid #fde047';
    }
    
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const getCategoryBackgroundColor = (category) => {
    const colors = {
      'Fuel': '#ffebee',
      'Maintenance': '#e8f5e9',
      'Fees': '#f3e5f5',
      'Parts': '#fff9c4',
      'Savings': '#e3f2fd',
      'Other': '#f5f5f5'
    };
    return colors[category] || '#f5f5f5';
  };

  return (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Financial Reports</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeView === 'pl' ? 'active' : ''}`}
          onClick={() => setActiveView('pl')}
        >
          <BarChart3 size={14} style={{ marginRight: '4px' }} />
          P&L
        </button>
        <button 
          className={`tab-btn ${activeView === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveView('expenses')}
        >
          <CreditCard size={14} style={{ marginRight: '4px' }} />
          Expenses
        </button>
        <button 
          className={`tab-btn ${activeView === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveView('wallet')}
        >
          <Wallet size={14} style={{ marginRight: '4px' }} />
          Wallet
        </button>
        <button 
          className={`tab-btn ${activeView === 'cashflow' ? 'active' : ''}`}
          onClick={() => setActiveView('cashflow')}
        >
          <Activity size={14} style={{ marginRight: '4px' }} />
          Cashflow
        </button>
        {/* Comment out the bookkeeping tab
        <button 
          className={`tab-btn ${activeView === 'bookkeeping' ? 'active' : ''}`}
          onClick={() => setActiveView('bookkeeping')}
        >
          <FileCheck size={14} style={{ marginRight: '4px' }} />
          Bookkeeping
        </button>
        */}
        <button 
          className={`tab-btn ${activeView === 'balance' ? 'active' : ''}`}
          onClick={() => setActiveView('balance')}
        >
          <Calculator size={14} style={{ marginRight: '4px' }} />
          Balance Sheet
        </button>
        <button 
          className={`tab-btn ${activeView === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveView('performance')}
        >
          <Target size={14} style={{ marginRight: '4px' }} />
          Performance
        </button>
        <button 
          className={`tab-btn ${activeView === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveView('trends')}
        >
          <TrendUp size={14} style={{ marginRight: '4px' }} />
          Trends
        </button>
      </div>

      <div className="tab-content">
        {/* Stats Grid - Fixed with compact currency */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
              {formatCompactCurrency(42800000)}
            </p>
            <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px', whiteSpace: 'nowrap' }}>
              <TrendUp size={10} style={{ marginRight: '2px' }} />
              +12.5% YoY
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Expenses</div>
            <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
              {formatCompactCurrency(24300000)}
            </p>
            <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px', whiteSpace: 'nowrap' }}>
              <TrendDown size={10} style={{ marginRight: '2px' }} />
              -8.2% YoY
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Net Profit</div>
            <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
              {formatCompactCurrency(18500000)}
            </p>
            <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px', whiteSpace: 'nowrap' }}>
              <TrendUp size={10} style={{ marginRight: '2px' }} />
              +18.2% YoY
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Profit Margin</div>
            <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>43.2%</p>
            <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px', whiteSpace: 'nowrap' }}>
              <TrendUp size={10} style={{ marginRight: '2px' }} />
              +5.1% improvement
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Wallet Balance</div>
            <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
              {formatCompactCurrency(3500000)}
            </p>
            <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px', whiteSpace: 'nowrap' }}>
              <TrendUp size={10} style={{ marginRight: '2px' }} />
              +12.8% this month
            </div>
          </div>
        </div>

        {/* Export Controls */}
        <div className="commission-overview" style={{ marginBottom: '20px' }}>
          <div className="section-title">Export & Reporting</div>
          <div style={{ padding: '16px' }}>
            <div className="share-input-group" style={{ marginBottom: '12px', flexWrap: 'wrap' }}>
              <select 
                className="share-input"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                style={{ minWidth: '120px', flex: '1' }}
              >
                <option value="pdf">PDF Format</option>
                <option value="excel">Excel Format</option>
                <option value="csv">CSV Format</option>
              </select>
              <button 
                className="share-btn"
                onClick={() => handleExport(exportFormat)}
                disabled={loading}
                style={{ flex: '1', minWidth: '120px' }}
              >
                <Download size={14} style={{ marginRight: '4px' }} />
                {loading ? 'Exporting...' : 'Export Report'}
              </button>
              <button 
                className="share-btn"
                onClick={handleExportFiltered}
                disabled={loading}
                style={{ 
                  background: '#f5f5f5', 
                  color: '#0033cc', 
                  border: '1px solid #0033cc',
                  flex: '1',
                  minWidth: '120px'
                }}
              >
                <Filter size={14} style={{ marginRight: '4px' }} />
                Export Filtered
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'pl' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Profit & Loss Statement</div>
              <div style={{ padding: '16px' }}>
                {/* Period Tabs */}
                <div className="tab-navigation" style={{ background: 'transparent', padding: '0', marginBottom: '16px', overflowX: 'auto' }}>
                  <div style={{ display: 'flex', gap: '8px', minWidth: 'min-content' }}>
                    <button 
                      className={`tab-btn ${activePLView === 'daily' ? 'active' : ''}`}
                      onClick={() => setActivePLView('daily')}
                    >
                      Daily
                    </button>
                    <button 
                      className={`tab-btn ${activePLView === 'weekly' ? 'active' : ''}`}
                      onClick={() => setActivePLView('weekly')}
                    >
                      Weekly
                    </button>
                    <button 
                      className={`tab-btn ${activePLView === 'monthly' ? 'active' : ''}`}
                      onClick={() => setActivePLView('monthly')}
                    >
                      Monthly
                    </button>
                    <button 
                      className={`tab-btn ${activePLView === 'annual' ? 'active' : ''}`}
                      onClick={() => setActivePLView('annual')}
                    >
                      Annual
                    </button>
                  </div>
                </div>

                {/* P&L Cards */}
                <div className="commission-grid">
                  <div className="commission-card revenue" style={{ background: '#e8f5e9', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Revenue</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(financialDataService.getPLData(activePLView).income)}
                    </p>
                  </div>
                  <div className="commission-card today" style={{ background: '#ffebee', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Expenses</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(financialDataService.getPLData(activePLView).expenses)}
                    </p>
                  </div>
                  <div className="commission-card weekly" style={{ background: '#e3f2fd', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Net Profit</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(financialDataService.getPLData(activePLView).net)}
                    </p>
                  </div>
                  <div className="commission-card lifetime" style={{ background: '#fff9c4', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Profit Margin</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {financialDataService.getPLData(activePLView).margin}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="alerts-section">
              <div className="referral-alerts">
                <div className="alerts-title">Recent Transactions</div>
                {financialDataService.getPLData(activePLView).transactions.slice(0, 6).map((tx, index) => (
                  <div key={tx.id || index} className="alert-item">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="alert-type" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tx.type || 'Transaction'} • {tx.category || tx.day || tx.week || tx.quarter}
                      </div>
                      <p className="alert-message" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tx.time || tx.day || tx.week || tx.quarter}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ 
                        color: (tx.type === 'Revenue' || tx.profit) ? '#2e7d32' : '#c62828',
                        fontWeight: '600',
                        fontSize: '12px',
                        whiteSpace: 'nowrap'
                      }}>
                        {(tx.type === 'Revenue' || tx.profit) ? '+' : '-'}
                        {formatCompactCurrency(tx.amount || tx.income || tx.revenue || tx.profit || 0)}
                      </span>
                      <span className="status-badge" style={{ 
                        background: (tx.type === 'Revenue' || tx.profit) ? '#e8f5e9' : '#ffebee',
                        color: (tx.type === 'Revenue' || tx.profit) ? '#2e7d32' : '#c62828',
                        border: `1px solid ${(tx.type === 'Revenue' || tx.profit) ? '#a5d6a7' : '#ffcdd2'}`,
                        padding: '2px 8px',
                        whiteSpace: 'nowrap'
                      }}>
                        {tx.type || 'Completed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="milestone-section">
                <div className="alerts-title">Performance Summary</div>
                <div className="milestone-card">
                  <div className="milestone-title">Current Period</div>
                  <div className="milestone-text" style={{ fontSize: '11px' }}>
                    {activePLView.charAt(0).toUpperCase() + activePLView.slice(1)} performance shows 
                    strong revenue growth with controlled expenses.
                  </div>
                  <div className="milestone-time">Updated just now</div>
                </div>
                <div className="milestone-card">
                  <div className="milestone-title">Key Metric</div>
                  <div className="milestone-text" style={{ fontSize: '11px' }}>
                    Profit margin at {financialDataService.getPLData(activePLView).margin}%, 
                    showing {financialDataService.getPLData(activePLView).margin > 50 ? 'excellent' : 'good'} 
                    operational efficiency.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'expenses' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Expense Management</div>
              <div style={{ padding: '16px' }}>
                {/* Search and Filter */}
                <div className="promo-input-section" style={{ marginBottom: '16px' }}>
                  <div className="share-input-group" style={{ flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      className="share-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ minWidth: '150px', flex: '1' }}
                    />
                    <select
                      className="share-input"
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      style={{ minWidth: '120px', flex: '1' }}
                    >
                      <option value="">All Categories</option>
                      <option value="Fuel">Fuel</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Fees">Fees</option>
                      <option value="Parts">Parts</option>
                      <option value="Savings">Savings</option>
                    </select>
                    <select
                      className="share-input"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      style={{ minWidth: '120px', flex: '1' }}
                    >
                      <option value="">All Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <button 
                      className="share-btn"
                      onClick={() => setShowAddModal(true)}
                      style={{ minWidth: '120px' }}
                    >
                      <Plus size={14} style={{ marginRight: '4px' }} />
                      Add Expense
                    </button>
                  </div>
                </div>

                {/* Expense Summary */}
                <div className="stats-grid" style={{ marginTop: '16px' }}>
                  <div className="stat-card">
                    <div className="stat-label">Total Expenses</div>
                    <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                      {formatCompactCurrency(getFilteredExpenses().reduce((sum, exp) => sum + exp.amount, 0))}
                    </p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Transactions</div>
                    <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>{getFilteredExpenses().length}</p>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Avg. per Day</div>
                    <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                      {formatCompactCurrency(Math.round(getFilteredExpenses().reduce((sum, exp) => sum + exp.amount, 0) / 30))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="alerts-section">
              <div className="referral-alerts" style={{ gridColumn: '1 / -1' }}>
                <div className="alerts-title">Expense Ledger</div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {getFilteredExpenses().map((expense) => (
                    <div key={expense.id} className="alert-item">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '6px',
                            background: getCategoryBackgroundColor(expense.category),
                            color: expense.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            fontSize: '12px',
                            flexShrink: 0
                          }}>
                            {expense.vendor.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 className="alert-type" style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {expense.vendor}
                            </h4>
                            <p className="alert-message" style={{ margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {expense.date} • {expense.category}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <span style={{ 
                          color: '#0033cc',
                          fontWeight: '600',
                          fontSize: '14px',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatCompactCurrency(expense.amount)}
                        </span>
                        <span className="status-badge" style={{ 
                          background: expense.status === 'Paid' ? '#e8f5e9' : '#fff9c4',
                          color: expense.status === 'Paid' ? '#2e7d32' : '#f59e0b',
                          border: expense.status === 'Paid' ? '1px solid #a5d6a7' : '1px solid #fde047',
                          padding: '4px 8px',
                          whiteSpace: 'nowrap'
                        }}>
                          {expense.status}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            className="share-btn"
                            onClick={() => handleEditExpense(expense)}
                            style={{ 
                              padding: '4px 8px',
                              fontSize: '11px',
                              background: '#e3f2fd',
                              flexShrink: 0
                            }}
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            className="share-btn"
                            onClick={() => handleDeleteExpense(expense.id)}
                            style={{ 
                              padding: '4px 8px',
                              fontSize: '11px',
                              background: '#ffebee',
                              color: '#c62828',
                              flexShrink: 0
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {getFilteredExpenses().length === 0 && (
                    <div style={{ 
                      padding: '40px 20px', 
                      textAlign: 'center', 
                      color: '#666',
                      fontSize: '12px'
                    }}>
                      No expenses found. Try adjusting your filters or add a new expense.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'wallet' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Wallet Statement</div>
              <div style={{ padding: '16px' }}>
                {/* Wallet Summary */}
                <div className="commission-grid">
                  <div className="commission-card revenue" style={{ background: '#e3f2fd', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Current Balance</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(3500000)}
                    </p>
                  </div>
                  <div className="commission-card today" style={{ background: '#e8f5e9', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">This Month</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      +{formatCompactCurrency(850000)}
                    </p>
                  </div>
                  <div className="commission-card weekly" style={{ background: '#f5f5f5', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Deposits</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(4500000)}
                    </p>
                  </div>
                  <div className="commission-card lifetime" style={{ background: '#fff9c4', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Withdrawals</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(1000000)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Transactions */}
            <div className="alerts-section">
              <div className="referral-alerts" style={{ gridColumn: '1 / -1' }}>
                <div className="alerts-title">Recent Transactions</div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {walletTransactions.map((tx) => (
                    <div key={tx.id} className="alert-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '6px',
                          background: tx.amount > 0 ? '#e8f5e9' : '#ffebee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          flexShrink: 0
                        }}>
                          {tx.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 className="alert-type" style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tx.description}
                          </h4>
                          <p className="alert-message" style={{ margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tx.date} • {tx.type}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <span style={{ 
                          color: tx.amount > 0 ? '#2e7d32' : '#c62828',
                          fontWeight: '600',
                          fontSize: '14px',
                          whiteSpace: 'nowrap'
                        }}>
                          {tx.amount > 0 ? '+' : ''}{formatCompactCurrency(tx.amount)}
                        </span>
                        <span style={{ 
                          color: '#666',
                          fontSize: '11px',
                          fontWeight: '500',
                          whiteSpace: 'nowrap'
                        }}>
                          Balance: {formatCompactCurrency(tx.balance)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'cashflow' && cashflowData && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Cashflow Analysis</div>
              <div style={{ padding: '16px' }}>
                {/* Cashflow Summary */}
                <div className="commission-grid">
                  <div className="commission-card revenue" style={{ background: '#e8f5e9', borderColor: '#a5d6a7', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Inflow</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(cashflowData.inflow)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px' }}>
                      <TrendUp size={10} style={{ marginRight: '2px' }} />
                      {cashflowData.inflowChange}
                    </div>
                  </div>
                  <div className="commission-card today" style={{ background: '#ffebee', borderColor: '#ffcdd2', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Outflow</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(cashflowData.outflow)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#c62828', marginTop: '4px' }}>
                      <TrendDown size={10} style={{ marginRight: '2px' }} />
                      {cashflowData.outflowChange}
                    </div>
                  </div>
                  <div className="commission-card weekly" style={{ background: '#e3f2fd', borderColor: '#bbdefb', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Net Cashflow</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(cashflowData.net)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                      {cashflowData.net >= 0 ? 'Positive' : 'Negative'} Cashflow
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Cashflow Chart */}
            <div className="alerts-section">
              <div className="referral-alerts">
                <div className="alerts-title">Monthly Cashflow Trend</div>
                <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '150px', marginBottom: '20px' }}>
                    {cashflowData.monthly.map((month, index) => (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px' }}>
                          <div 
                            style={{ 
                              width: '12px', 
                              height: `${(month.inflow / 700000) * 80}px`,
                              background: '#2e7d32',
                              borderRadius: '2px 2px 0 0'
                            }}
                            title={`Inflow: ${formatCurrency(month.inflow)}`}
                          />
                          <div 
                            style={{ 
                              width: '12px', 
                              height: `${(month.outflow / 700000) * 80}px`,
                              background: '#c62828',
                              borderRadius: '2px 2px 0 0'
                            }}
                            title={`Outflow: ${formatCurrency(month.outflow)}`}
                          />
                        </div>
                        <div style={{ fontSize: '10px', color: '#666', fontWeight: '500' }}>{month.month}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#2e7d32', borderRadius: '1px' }}></div>
                      <span>Inflow</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#c62828', borderRadius: '1px' }}></div>
                      <span>Outflow</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="milestone-section">
                <div className="alerts-title">Cashflow Categories</div>
                {cashflowData.categories.map((category, index) => (
                  <div key={index} className="milestone-card">
                    <div className="milestone-title">{category.name}</div>
                    <div className="milestone-text">
                      Amount: {formatCompactCurrency(category.amount)}
                    </div>
                    <div className="milestone-text">
                      Net Earnings: {formatCompactCurrency(category.netEarnings)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comment out the bookkeeping view section
        {activeView === 'bookkeeping' && bookkeepingData && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Bookkeeping & Reconciliation</div>
              <div style={{ padding: '16px' }}>
                <div className="commission-grid">
                  <div className="commission-card revenue" style={{ background: '#e3f2fd', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Outstanding Invoices</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {bookkeepingData.outstandingInvoices.count}
                    </p>
                    <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                      Value: {formatCompactCurrency(bookkeepingData.outstandingInvoices.value)}
                    </div>
                  </div>
                  <div className="commission-card today" style={{ background: '#fff9c4', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Pending Expenses</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {bookkeepingData.pendingExpenses.count}
                    </p>
                    <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '4px' }}>
                      {bookkeepingData.pendingExpenses.description}
                    </div>
                  </div>
                  <div className="commission-card weekly" style={{ background: '#e8f5e9', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Reconciliation</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {bookkeepingData.reconciliationStatus.percentage}%
                    </p>
                    <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px' }}>
                      {bookkeepingData.reconciliationStatus.label}
                    </div>
                  </div>
                  <div className="commission-card lifetime" style={{ background: '#f5f5f5', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Overall Progress</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {bookkeepingData.bookkeepingStatus.overall}%
                    </p>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                      Bookkeeping tasks
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="alerts-section">
              <div className="referral-alerts" style={{ gridColumn: '1 / -1' }}>
                <div className="alerts-title">Task Progress</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bookkeepingData.bookkeepingStatus.tasks.map((task) => (
                    <div key={task.id} style={{ 
                      padding: '12px',
                      background: '#f8f9fa',
                      borderRadius: '6px',
                      borderLeft: `3px solid ${task.color}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>{task.name}</span>
                        <span style={{ fontSize: '11px', color: '#666' }}>
                          {task.completed}/{task.total}
                        </span>
                      </div>
                      <div style={{ height: '4px', background: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%',
                            width: `${(task.completed / task.total) * 100}%`,
                            background: task.color,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <span className="status-badge" style={{ 
                          background: task.status === 'completed' ? '#e8f5e9' : 
                                    task.status === 'in-progress' ? '#fff9c4' : '#ffebee',
                          color: task.status === 'completed' ? '#2e7d32' : 
                                task.status === 'in-progress' ? '#f59e0b' : '#c62828',
                          border: task.status === 'completed' ? '1px solid #a5d6a7' : 
                                 task.status === 'in-progress' ? '1px solid #fde047' : '1px solid #ffcdd2',
                          padding: '2px 8px',
                          fontSize: '10px'
                        }}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        */}

        {activeView === 'balance' && balanceSheet && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Balance Sheet</div>
              <div style={{ padding: '16px' }}>
                {/* Balance Summary */}
                <div className="commission-grid">
                  <div className="commission-card revenue" style={{ background: '#e8f5e9', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Assets</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(balanceSheet.assets.amount)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px' }}>
                      <TrendUp size={10} style={{ marginRight: '2px' }} />
                      {balanceSheet.assets.change}
                    </div>
                  </div>
                  <div className="commission-card today" style={{ background: '#ffebee', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Liabilities</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(balanceSheet.liabilities.amount)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#c62828', marginTop: '4px' }}>
                      <TrendDown size={10} style={{ marginRight: '2px' }} />
                      {balanceSheet.liabilities.change}
                    </div>
                  </div>
                  <div className="commission-card weekly" style={{ background: '#e3f2fd', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Equity</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(balanceSheet.equity.amount)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                      <TrendUp size={10} style={{ marginRight: '2px' }} />
                      {balanceSheet.equity.change}
                    </div>
                  </div>
                  <div className="commission-card lifetime" style={{ background: '#fff9c4', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Net Worth</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(balanceSheet.netWorth)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '4px' }}>
                      Assets - Liabilities
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Sections */}
            <div className="alerts-section">
              <div className="referral-alerts">
                <div className="alerts-title">Assets Breakdown</div>
                {balanceSheet.assets.breakdown.map((item, index) => (
                  <div key={index} className="alert-item">
                    <div className="alert-type" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      color: '#0033cc',
                      fontWeight: '600',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatCompactCurrency(item.amount)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="milestone-section">
                <div className="alerts-title">Liabilities & Equity</div>
                <div className="milestone-card">
                  <div className="milestone-title">Liabilities</div>
                  {balanceSheet.liabilities.breakdown.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '12px'
                    }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </span>
                      <span style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                        {formatCompactCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="milestone-card">
                  <div className="milestone-title">Equity</div>
                  {balanceSheet.equity.breakdown.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '12px'
                    }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </span>
                      <span style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                        {formatCompactCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'performance' && performanceData && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Performance Analytics</div>
              <div style={{ padding: '16px' }}>
                {/* Performance Tabs */}
                <div className="tab-navigation" style={{ background: 'transparent', padding: '0', marginBottom: '16px', overflowX: 'auto' }}>
                  <div style={{ display: 'flex', gap: '8px', minWidth: 'min-content' }}>
                    <button 
                      className={`tab-btn ${performanceView === 'monthly' ? 'active' : ''}`}
                      onClick={() => setPerformanceView('monthly')}
                    >
                      Monthly
                    </button>
                    <button 
                      className={`tab-btn ${performanceView === 'quarterly' ? 'active' : ''}`}
                      onClick={() => setPerformanceView('quarterly')}
                    >
                      Quarterly
                    </button>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="commission-grid">
                  <div className="commission-card revenue" style={{ background: '#e3f2fd', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Earnings</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(performanceData[`${performanceView}View`].totalEarnings)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px' }}>
                      <TrendUp size={10} style={{ marginRight: '2px' }} />
                      {performanceData[`${performanceView}View`].earningsGrowth}
                    </div>
                  </div>
                  <div className="commission-card today" style={{ background: '#ffebee', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Total Expenses</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(performanceData[`${performanceView}View`].totalExpenses)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                      {performanceData[`${performanceView}View`].expensesRatio} of earnings
                    </div>
                  </div>
                  <div className="commission-card weekly" style={{ background: '#e8f5e9', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Net Income</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {formatCompactCurrency(performanceData[`${performanceView}View`].netIncome)}
                    </p>
                    <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px' }}>
                      <TrendUp size={10} style={{ marginRight: '2px' }} />
                      {performanceData[`${performanceView}View`].netIncomeGrowth}
                    </div>
                  </div>
                  <div className="commission-card lifetime" style={{ background: '#fff9c4', padding: '16px', minHeight: '100px' }}>
                    <div className="commission-label">Profit Margin</div>
                    <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                      {performanceData[`${performanceView}View`].profitMargin}%
                    </p>
                    <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '4px' }}>
                      Operating efficiency
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="alerts-section">
              <div className="referral-alerts">
                <div className="alerts-title">Quarterly Performance</div>
                <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '150px', marginBottom: '20px' }}>
                    {performanceData.performanceChart.labels.map((label, index) => (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px' }}>
                          <div 
                            style={{ 
                              width: '12px', 
                              height: `${(performanceData.performanceChart.earnings[index] / 15000000) * 80}px`,
                              background: '#6366f1',
                              borderRadius: '2px 2px 0 0'
                            }}
                            title={`Earnings: ${formatCompactCurrency(performanceData.performanceChart.earnings[index])}`}
                          />
                          <div 
                            style={{ 
                              width: '12px', 
                              height: `${(performanceData.performanceChart.netEarnings[index] / 15000000) * 80}px`,
                              background: '#06D6A0',
                              borderRadius: '2px 2px 0 0'
                            }}
                            title={`Net: ${formatCompactCurrency(performanceData.performanceChart.netEarnings[index])}`}
                          />
                        </div>
                        <div style={{ fontSize: '10px', color: '#666', fontWeight: '500' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#6366f1', borderRadius: '1px' }}></div>
                      <span>Earnings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#06D6A0', borderRadius: '1px' }}></div>
                      <span>Net Earnings</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="milestone-section">
                <div className="alerts-title">Key Metrics</div>
                <div className="milestone-card">
                  <div className="milestone-title">Best Month</div>
                  <div className="milestone-text">
                    {performanceData.yearHighlights.bestMonth.month}
                  </div>
                  <div className="milestone-text">
                    Earnings: {formatCompactCurrency(performanceData.yearHighlights.bestMonth.earnings)}
                  </div>
                  <div className="milestone-text">
                    Net Income: {formatCompactCurrency(performanceData.yearHighlights.bestMonth.netIncome)}
                  </div>
                </div>
                <div className="milestone-card">
                  <div className="milestone-title">Metrics</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: '#666' }}>Operating Margin</div>
                      <div style={{ fontWeight: '500' }}>{performanceData.yearHighlights.keyMetrics.operatingMargin}</div>
                    </div>
                    <div>
                      <div style={{ color: '#666' }}>Earnings Growth</div>
                      <div style={{ fontWeight: '500', color: '#2e7d32' }}>
                        {performanceData.yearHighlights.keyMetrics.earningsGrowthYoY}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#666' }}>Expense Ratio</div>
                      <div style={{ fontWeight: '500' }}>{performanceData.yearHighlights.keyMetrics.expenseRatio}</div>
                    </div>
                    <div>
                      <div style={{ color: '#666' }}>Avg Monthly</div>
                      <div style={{ fontWeight: '500' }}>
                        {formatCompactCurrency(performanceData.yearHighlights.keyMetrics.monthlyEarningsAvg)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'trends' && trendsData && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Financial Trends</div>
              <div style={{ padding: '16px' }}>
                {/* Trends Tabs */}
                <div className="tab-navigation" style={{ background: 'transparent', padding: '0', marginBottom: '16px', overflowX: 'auto' }}>
                  <div style={{ display: 'flex', gap: '8px', minWidth: 'min-content' }}>
                    <button 
                      className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
                      onClick={() => setActiveTab('trends')}
                    >
                      Monthly Trends
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'annual' ? 'active' : ''}`}
                      onClick={() => setActiveTab('annual')}
                    >
                      Annual Trends
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'growth' ? 'active' : ''}`}
                      onClick={() => setActiveTab('growth')}
                    >
                      Growth Metrics
                    </button>
                  </div>
                </div>

                {activeTab === 'trends' && (
                  <div className="stats-grid">
                    {trendsData.monthlyTrends.slice(0, 6).map((trend, index) => (
                      <div key={index} className="stat-card">
                        <div className="stat-label">{trend.month}</div>
                        <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                          {formatCompactCurrency(trend.earnings)}
                        </p>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          fontSize: '10px',
                          marginTop: '4px'
                        }}>
                          <span style={{ 
                            color: trend.growth.includes('+') ? '#2e7d32' : '#c62828'
                          }}>
                            {trend.growth}
                          </span>
                          <span style={{ color: '#666' }}>
                            {trend.margin}% margin
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'annual' && (
                  <div className="commission-grid">
                    {trendsData.annualTrends.map((trend, index) => (
                      <div key={index} className="commission-card" style={{ 
                        background: index % 2 === 0 ? '#e3f2fd' : '#e8f5e9',
                        padding: '16px',
                        minHeight: '100px'
                      }}>
                        <div className="commission-label">{trend.year}</div>
                        <p className="commission-amount" style={{ fontSize: '18px', lineHeight: '1.2', margin: '8px 0' }}>
                          {formatCompactCurrency(trend.earnings)}
                        </p>
                        <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                          Profit Margin: {trend.margin}%
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: trend.growth > '60%' ? '#2e7d32' : '#f59e0b',
                          marginTop: '4px'
                        }}>
                          Growth: {trend.growth}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'growth' && (
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-label">CAGR</div>
                      <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                        {trendsData.growthMetrics.cagr}
                      </p>
                      <div style={{ fontSize: '10px', color: '#2e7d32', marginTop: '4px' }}>
                        <TrendUp size={10} style={{ marginRight: '2px' }} />
                        Compound Annual Growth Rate
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Projection 2025</div>
                      <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                        {formatCompactCurrency(trendsData.growthMetrics.projection2025)}
                      </p>
                      <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                        Projected earnings
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Avg Margin</div>
                      <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>
                        {trendsData.growthMetrics.consistentMargin}
                      </p>
                      <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '4px' }}>
                        Consistent performance
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trends Visualization */}
            <div className="alerts-section">
              <div className="referral-alerts" style={{ gridColumn: '1 / -1' }}>
                <div className="alerts-title">Trend Analysis</div>
                <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>Growth Trend</div>
                      <div style={{ fontSize: '10px', color: '#666' }}>Last 6 months</div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#2e7d32' }}>
                      <TrendUp size={10} style={{ marginRight: '4px' }} />
                      +8.3% average growth
                    </div>
                  </div>
                  <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                    {trendsData.monthlyTrends.slice(0, 6).map((trend, index) => (
                      <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div 
                          style={{ 
                            width: '100%',
                            height: `${(trend.earnings / 5000000) * 60}px`,
                            background: trend.growth.includes('+') ? '#06D6A0' : '#ef4444',
                            borderRadius: '2px 2px 0 0',
                            transition: 'height 0.3s ease'
                          }}
                        />
                        <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>
                          {trend.month.substring(0, 3)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'activity' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="commission-overview">
              <div className="section-title">Recent Activity</div>
              <div style={{ padding: '16px' }}>
                {/* Activity Summary */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Today</div>
                    <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>2</p>
                    <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                      Activities
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">This Week</div>
                    <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>12</p>
                    <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                      Total activities
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">System</div>
                    <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>8</p>
                    <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                      Automated tasks
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Manual</div>
                    <p className="stat-value" style={{ fontSize: '20px', lineHeight: '1.2' }}>4</p>
                    <div style={{ fontSize: '10px', color: '#0033cc', marginTop: '4px' }}>
                      User actions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="alerts-section">
              <div className="referral-alerts" style={{ gridColumn: '1 / -1' }}>
                <div className="alerts-title">Activity Timeline</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                  {recentActivity.map((activity) => (
                    <div key={activity.id} style={{ 
                      padding: '12px',
                      background: '#f8f9fa',
                      borderRadius: '6px',
                      borderLeft: `3px solid ${activity.color}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '12px',
                        background: activity.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {activity.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>
                            {activity.action}
                          </div>
                          <div style={{ fontSize: '9px', color: '#666', whiteSpace: 'nowrap' }}>
                            {activity.time}
                          </div>
                        </div>
                        <div style={{ fontSize: '10px', color: '#666' }}>
                          By {activity.user}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Schedule Section */}
      <div className="commission-overview" style={{ marginTop: '20px' }}>
        <div className="section-title">Scheduled Exports</div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Automated report generation schedules
            </span>
            <button 
              className="share-btn"
              onClick={() => setShowScheduleModal(true)}
              style={{ minWidth: '120px' }}
            >
              <Plus size={14} style={{ marginRight: '4px' }} />
              Schedule Export
            </button>
          </div>

          {scheduledExports.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scheduledExports.map((schedule) => (
                <div key={schedule.id} style={{ 
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '4px',
                        background: schedule.active ? '#06D6A0' : '#6b7280'
                      }} />
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>
                        {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} {schedule.reportType.toUpperCase()} Report
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#666' }}>
                      Format: {schedule.format.toUpperCase()} • Time: {schedule.time}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button 
                      className="share-btn"
                      onClick={() => toggleSchedule(schedule.id)}
                      style={{ 
                        padding: '4px 8px',
                        fontSize: '11px',
                        background: schedule.active ? '#e8f5e9' : '#f5f5f5',
                        color: schedule.active ? '#2e7d32' : '#666'
                      }}
                    >
                      {schedule.active ? 'Active' : 'Inactive'}
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      style={{ 
                        padding: '4px 8px',
                        fontSize: '11px',
                        background: '#ffebee',
                        color: '#c62828'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              color: '#666',
              fontSize: '12px'
            }}>
              No scheduled exports. Click "Schedule Export" to set up automated reports.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Add New Expense</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Vendor Name *
                </label>
                <input
                  type="text"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                  className="share-input"
                  placeholder="Enter vendor name"
                />
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Amount (USh) *
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="share-input"
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="share-input"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Fees">Fees</option>
                  <option value="Parts">Parts</option>
                  <option value="Savings">Savings</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="share-input"
                />
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Description
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="share-input"
                  placeholder="Optional description"
                  rows="3"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                onClick={handleAddExpense}
                className="share-btn"
                style={{ flex: 1 }}
              >
                <Save size={14} style={{ marginRight: '4px' }} />
                Save Expense
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ 
                  flex: 1,
                  padding: '10px 16px',
                  background: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#666'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Schedule Export</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Frequency *
                </label>
                <select
                  value={scheduleConfig.frequency}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, frequency: e.target.value})}
                  className="share-input"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Report Type
                </label>
                <select
                  value={scheduleConfig.reportType}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, reportType: e.target.value})}
                  className="share-input"
                >
                  <option value="pl">Profit & Loss</option>
                  <option value="expenses">Expenses</option>
                  <option value="cashflow">Cashflow</option>
                  <option value="balance">Balance Sheet</option>
                  <option value="performance">Performance</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Export Format
                </label>
                <select
                  value={scheduleConfig.format}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, format: e.target.value})}
                  className="share-input"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#333', marginBottom: '4px', display: 'block' }}>
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleConfig.time}
                  onChange={(e) => setScheduleConfig({...scheduleConfig, time: e.target.value})}
                  className="share-input"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                onClick={handleScheduleExport}
                className="share-btn"
                style={{ flex: 1 }}
              >
                <Calendar size={14} style={{ marginRight: '4px' }} />
                Schedule Export
              </button>
              <button 
                onClick={() => setShowScheduleModal(false)}
                style={{ 
                  flex: 1,
                  padding: '10px 16px',
                  background: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#666'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <div style={{
            background: 'white',
            height: '100%',
            width: '280px',
            padding: '20px',
            overflowY: 'auto',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Financial Reports</h3>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'pl', label: 'P&L Statement', icon: <BarChart3 size={16} /> },
                { id: 'expenses', label: 'Expenses', icon: <CreditCard size={16} /> },
                { id: 'wallet', label: 'Wallet', icon: <Wallet size={16} /> },
                { id: 'cashflow', label: 'Cashflow', icon: <Activity size={16} /> },
                // Comment out bookkeeping from mobile menu
                // { id: 'bookkeeping', label: 'Bookkeeping', icon: <FileCheck size={16} /> },
                { id: 'balance', label: 'Balance Sheet', icon: <Calculator size={16} /> },
                { id: 'performance', label: 'Performance', icon: <Target size={16} /> },
                { id: 'trends', label: 'Trends', icon: <TrendUp size={16} /> },
                { id: 'activity', label: 'Activity', icon: <History size={16} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: activeView === item.id ? '#e3f2fd' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: activeView === item.id ? '#0033cc' : '#333',
                    width: '100%'
                  }}
                >
                  <span style={{ color: activeView === item.id ? '#0033cc' : '#666' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 100,
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        display: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <Menu size={20} />
          </button>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Financial Reports</h3>
          <div style={{ width: '40px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Statements;