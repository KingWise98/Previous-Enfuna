"use client"

import { useState } from "react"
import "./payment.css"
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Share2,
  Cloud,
  ArrowLeft,
  Upload,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Menu,
  X,
} from "lucide-react"

export default function PaymentsApp() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [activeTab, setActiveTab] = useState("daily")
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState("")
  const [disputeReason, setDisputeReason] = useState("")
  const [disputeTab, setDisputeTab] = useState("file")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Stats data
  const dashboardStats = [
    {
      label: "Total Collections Today",
      value: "125,000",
      currency: "UGX",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "blue",
    },
    { label: "Pending Payments", value: "18", change: "+2", trend: "warning", icon: Clock, color: "yellow" },
    { label: "Pending Reconciliations", value: "23", change: "+20.5%", trend: "up", icon: AlertCircle, color: "green" },
    { label: "Success Rate", value: "98.2%", change: "+20.5%", trend: "up", icon: CheckCircle, color: "green" },
  ]

  const paymentMethodsData = [
    { name: "MTN MoMo", percentage: 82, transactions: "1240 Transactions", color: "payment-mtn" },
    { name: "Airtel Money", percentage: 2, transactions: "10 Transactions", color: "payment-airtel" },
    { name: "Cash", percentage: 50, transactions: "460 Transactions", color: "payment-cash" },
    { name: "QR Code", percentage: 12, transactions: "60 Transactions", color: "payment-qr" },
    { name: "Split Payment", percentage: 12, transactions: "60 Transactions", color: "payment-split" },
    { name: "Card Payment", percentage: 1, transactions: "2 Transactions", color: "payment-card" },
  ]

  const recentTransactionsData = [
    { type: "Quick Trip", method: "Cash", time: "09:30 AM", status: "Completed", amount: "2,500" },
    { type: "Delivery", method: "MTN MoMo", time: "09:30 AM", status: "Completed", amount: "12,000" },
    { type: "Quick Trip", method: "QR Code", time: "09:30 AM", status: "Failed", amount: "3,000" },
    { type: "Normal Trip", method: "MTN MoMo", time: "09:30 AM", status: "Pending", amount: "20,000" },
    { type: "Delivery", method: "Cash", time: "09:30 AM", status: "Completed", amount: "15,000" },
  ]

  const analyticsCards = [
    { label: "Cash", amount: "50,000", change: "+12.5%", trend: "up" },
    { label: "MTN MoMo", amount: "180,000", currency: "UGX", change: "+22.5%", trend: "up" },
    { label: "Split Pay", amount: "15,000", currency: "UGX", change: "-2.5%", trend: "down" },
    { label: "QR Code", amount: "40,000", currency: "UGX", change: "-2.5%", trend: "down" },
  ]

  const conversionFunnelData = [
    { stage: "Clicks", value: 250, percentage: 100 },
    { stage: "Clicks", value: 85, percentage: 34 },
    { stage: "Signups", value: 42, percentage: 49 },
    { stage: "Activated", value: 33, percentage: 90 },
    { stage: "First Trip", value: 35, percentage: 92 },
  ]

  const disputesData = [
    {
      id: "TXN-9000900",
      reason: "Amount incorrect",
      filed: "12-12-2025",
      notes: "Under investigation by finance team...",
      status: "Under Review",
      statusColor: "yellow",
    },
    {
      id: "TXN-9000900",
      reason: "Amount incorrect",
      filed: "12-12-2025",
      notes: "Awaiting customer documentations",
      status: "Open",
      statusColor: "red",
    },
    {
      id: "TXN-9000900",
      reason: "Amount incorrect",
      filed: "12-12-2025",
      notes: "Under investigation by finance team...",
      status: "Under Review",
      statusColor: "yellow",
    },
    {
      id: "TXN-9000900",
      reason: "Duplicate Charge",
      filed: "12-12-2025",
      notes: "Refund Processed, dispute closed",
      status: "Resolved",
      statusColor: "green",
    },
  ]

  const paymentsHistoryData = [
    {
      description: "Quick Trip",
      date: "03-12-2025 09.30 AM",
      txnId: "QT6730000",
      amount: "2,500",
      method: "Cash",
      methodDate: "03-12-2025 09.30 AM",
      status: "Completed",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025 09.30 AM",
      txnId: "QT6730000",
      amount: "2,500",
      method: "MTN MoMO",
      methodDate: "03-12-2025 09.30 AM",
      status: "Completed",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025 09.30 AM",
      txnId: "QT6730000",
      amount: "2,500",
      method: "QR Code",
      methodDate: "03-12-2025 09.30 AM",
      status: "Failed",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025 09.30 AM",
      txnId: "QT6730000",
      amount: "2,500",
      method: "MTN MoMo",
      methodDate: "03-12-2025 09.30 AM",
      status: "Completed",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025 09.30 AM",
      txnId: "QT6730000",
      amount: "2,500",
      method: "Airtel Money",
      methodDate: "03-12-2025 09.30 AM",
      status: "Pending",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025 09.30 AM",
      txnId: "QT6730000",
      amount: "2,500",
      method: "Cash",
      methodDate: "03-12-2025 09.30 AM",
      status: "Completed",
    },
  ]

  const pendingPaymentsData = [
    {
      id: "T908",
      type: "Quick Trip",
      method: "MTN MoMo",
      ref: "Mo780045",
      amount: "67,000",
      date: "03-12-2025",
      time: "10:30 AM",
      status: "Pending",
      statusColor: "yellow",
    },
    {
      id: "T908",
      type: "Delivery",
      method: "MTN MoMo",
      ref: "Mo780045",
      amount: "2,000",
      date: "03-12-2025",
      time: "10:30 AM",
      status: "Verifying",
      statusColor: "purple",
    },
    {
      id: "T908",
      type: "Normal Trip",
      method: "QR Code",
      ref: "QR780045",
      amount: "7,000",
      date: "03-12-2025",
      time: "10:30 AM",
      status: "Pending",
      statusColor: "yellow",
    },
    {
      id: "T908",
      type: "Quick Trip",
      method: "Airtel Money",
      ref: "AA780000",
      amount: "5,000",
      date: "03-12-2025",
      time: "10:30 AM",
      status: "Processing",
      statusColor: "blue",
    },
  ]

  const chartData = [
    { day: "Sunday", failed: 200, completed: 650 },
    { day: "Monday", failed: 300, completed: 250 },
    { day: "Tuesday", failed: 200, completed: 500 },
    { day: "Wed", failed: 180, completed: 700 },
    { day: "Thursday", failed: 250, completed: 680 },
    { day: "Friday", failed: 220, completed: 580 },
  ]

  // Render functions for each view
  const renderDashboard = () => (
    <div className="payments-container">
      <header className="payments-header">
        <div className="payments-header-content">
          <div className="payments-header-left">
            <img src="/logo.png" alt="Enfuna" className="payments-logo" />
            <div>
              <h1 className="payments-title">PAYMENT DASHBOARD</h1>
              <p className="payments-subtitle">Real-Time payment overview and analytics</p>
            </div>
          </div>
          <div className="payments-header-right">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
            <div className="user-badge">
              <span className="user-name">Moses. K</span>
              <div className="user-avatar">MK</div>
            </div>
          </div>
        </div>
      </header>

      <main className="payments-main">
        {/* Stats Grid */}
        <div className="stats-grid">
          {dashboardStats.map((stat, index) => (
            <div key={index} className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-header">
                <span className="stat-label">{stat.label}</span>
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  <stat.icon className="icon" />
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {stat.value}
                  {stat.currency && <span className="stat-currency">{stat.currency}</span>}
                </div>
                <div className={`stat-change stat-change-${stat.trend}`}>{stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setCurrentView("pending")}>
            Pending Payments
          </button>
          <button className="btn btn-yellow">Receive Money</button>
          <button className="btn btn-dark" onClick={() => setCurrentView("disputes")}>
            File Dispute
          </button>
          <button className="btn btn-navy" onClick={() => setCurrentView("analytics")}>
            View Analytics
          </button>
        </div>

        {/* Payment Methods & Recent Transactions */}
        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Payment Methods</h2>
              <p className="card-subtitle">Usage Breakdown Today</p>
            </div>
            <div className="payment-methods">
              {paymentMethodsData.map((method, index) => (
                <div key={index} className="payment-method">
                  <div className="payment-method-header">
                    <span className="payment-method-name">{method.name}</span>
                    <span className="payment-method-percentage">{method.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${method.color}`} style={{ width: `${method.percentage}%` }}></div>
                  </div>
                  <p className="payment-method-transactions">{method.transactions}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Transactions</h2>
              <p className="card-subtitle">Latest Payment activity</p>
            </div>
            <div className="transactions-list">
              {recentTransactionsData.map((transaction, index) => (
                <div key={index} className="transaction-item">
                  <div className="transaction-info">
                    <h3 className="transaction-type">{transaction.type}</h3>
                    <p className="transaction-details">
                      {transaction.method} <span className="transaction-time">{transaction.time}</span>
                    </p>
                  </div>
                  <div className="transaction-amount">UGX {transaction.amount}</div>
                  <span className={`status-badge status-${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-full" onClick={() => setCurrentView("history")}>
              View All Transactions
            </button>
          </div>
        </div>
      </main>
    </div>
  )

  const renderAnalytics = () => (
    <div className="payments-container analytics-view">
      <header className="payments-header payments-header-blue">
        <div className="payments-header-content">
          <div className="payments-header-left">
            <button className="btn-back" onClick={() => setCurrentView("dashboard")}>
              <ArrowLeft />
            </button>
            <div>
              <h1 className="payments-title">Payment Analytics</h1>
              <p className="payments-subtitle">Real-time Payment performance analytics</p>
            </div>
          </div>
          <div className="payments-header-right">
            <button className="btn-icon">
              <Download />
            </button>
            <button className="btn-icon">
              <Share2 />
            </button>
            <button className="btn-icon">
              <Cloud />
            </button>
            <div className="user-badge">
              <span className="user-name">Moses. K</span>
              <div className="user-avatar">MK</div>
            </div>
          </div>
        </div>
      </header>

      <main className="payments-main">
        {/* Time Period Tabs */}
        <div className="tab-buttons">
          <button className={`tab-btn ${activeTab === "daily" ? "active" : ""}`} onClick={() => setActiveTab("daily")}>
            Daily
          </button>
          <button
            className={`tab-btn ${activeTab === "weekly" ? "active" : ""}`}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly
          </button>
          <button
            className={`tab-btn ${activeTab === "monthly" ? "active" : ""}`}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="analytics-cards">
          {analyticsCards.map((card, index) => (
            <div key={index} className="card analytics-card">
              <div className="analytics-card-header">
                <span className="analytics-label">{card.label}</span>
                <span className={`analytics-change ${card.trend === "up" ? "positive" : "negative"}`}>
                  {card.change}
                  {card.trend === "up" ? (
                    <TrendingUp className="trend-icon" />
                  ) : (
                    <TrendingDown className="trend-icon" />
                  )}
                </span>
              </div>
              <div className="analytics-amount">{card.amount}</div>
              {card.currency && <div className="analytics-currency">{card.currency}</div>}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Payment Summary</h2>
              <p className="card-subtitle">Today's completed Vs failed Payments</p>
            </div>
            <div className="chart-container">
              {chartData.map((data, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bars">
                    <div
                      className="chart-bar chart-bar-completed"
                      style={{ height: `${(data.completed / 700) * 200}px` }}
                    ></div>
                    <div
                      className="chart-bar chart-bar-failed"
                      style={{ height: `${(data.failed / 700) * 200}px` }}
                    ></div>
                  </div>
                  <span className="chart-label">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color legend-failed"></div>
                <span>Failed</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-completed"></div>
                <span>Completed</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Payment Methods</h2>
              <p className="card-subtitle">Payment Breakdown Today</p>
            </div>
            <div className="payment-methods">
              {paymentMethodsData.map((method, index) => (
                <div key={index} className="payment-method">
                  <div className="payment-method-header">
                    <span className="payment-method-name">{method.name}</span>
                    <span className="payment-method-percentage">{method.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${method.color}`} style={{ width: `${method.percentage}%` }}></div>
                  </div>
                  <p className="payment-method-transactions">{method.transactions}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="card">
          <h2 className="card-title">Referral Conversion Funnel</h2>
          <div className="funnel-container">
            {conversionFunnelData.map((item, index) => (
              <div key={index} className="funnel-item">
                <div className="funnel-header">
                  <span className="funnel-stage">{item.stage}</span>
                  <span className="funnel-value">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill progress-fill-blue" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )

  const renderPending = () => (
    <div className="payments-container pending-view">
      <header className="payments-header payments-header-blue">
        <div className="payments-header-content">
          <div className="payments-header-left">
            <button className="btn-back" onClick={() => setCurrentView("dashboard")}>
              <ArrowLeft />
            </button>
            <div>
              <h1 className="payments-title">Pending Payments</h1>
              <p className="payments-subtitle">Track and Manage Payments awaiting Completion</p>
            </div>
          </div>
          <button className="btn btn-light" onClick={() => setCurrentView("dashboard")}>
            Back To Dashboard
          </button>
        </div>
      </header>

      <main className="payments-main">
        {/* Stats */}
        <div className="pending-stats">
          <div className="card stat-card-border">
            <div className="stat-label">Pending Payments</div>
            <div className="stat-value">5</div>
            <div className="stat-detail">awaiting processing</div>
          </div>
          <div className="card stat-card-yellow">
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">96,000</div>
            <div className="stat-detail">in 8 transactions</div>
          </div>
          <div className="card stat-card-dark">
            <div className="stat-label">Average Time</div>
            <div className="stat-value">2h : 25m</div>
            <div className="stat-detail">to complete</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="card">
          <h2 className="card-title">Search</h2>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search By: Customer, ID, Phone number etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All (8)
              </button>
              <button
                className={`filter-btn ${activeFilter === "pending" ? "active" : ""}`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${activeFilter === "processing" ? "active" : ""}`}
                onClick={() => setActiveFilter("processing")}
              >
                Processing
              </button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="payments-list">
          {pendingPaymentsData.map((payment, index) => (
            <div key={index} className="card payment-card">
              <div className="payment-card-grid">
                <div className="payment-info-section">
                  <h3 className="payment-type">{payment.type}</h3>
                  <p className="payment-id">ID: {payment.id}</p>
                </div>
                <div className="payment-info-section">
                  <h4 className="payment-method">{payment.method}</h4>
                  <p className="payment-ref">Ref: {payment.ref}</p>
                </div>
                <div className="payment-info-section">
                  <h4 className="payment-amount">UGX: {payment.amount}</h4>
                  <p className="payment-date">
                    {payment.date} <span>{payment.time}</span>
                  </p>
                </div>
              </div>
              <div className="payment-actions">
                <span className={`status-badge status-${payment.statusColor}`}>{payment.status}</span>
                <span className="payment-time">{payment.time}</span>
                <button className="btn btn-outline">View Details</button>
                <button className="btn btn-primary">
                  <RefreshCw className="btn-icon-left" />
                  Retry
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )

  const renderDisputes = () => (
    <div className="payments-container disputes-view">
      <header className="payments-header">
        <div className="payments-header-content">
          <div className="payments-header-left">
            <button className="btn-back" onClick={() => setCurrentView("dashboard")}>
              <ArrowLeft />
            </button>
            <div>
              <h1 className="payments-title">Disputes Management</h1>
              <p className="payments-subtitle">File and Track Payment Disputes</p>
            </div>
          </div>
          <button className="btn btn-light" onClick={() => setCurrentView("dashboard")}>
            Back To Dashboard
          </button>
        </div>
      </header>

      <main className="payments-main">
        {/* Tabs */}
        <div className="tab-buttons">
          <button className={`tab-btn ${disputeTab === "file" ? "active" : ""}`} onClick={() => setDisputeTab("file")}>
            File a Dispute
          </button>
          <button
            className={`tab-btn ${disputeTab === "track" ? "active" : ""}`}
            onClick={() => setDisputeTab("track")}
          >
            Track A Dispute
          </button>
        </div>

        {disputeTab === "file" ? (
          <div className="card">
            <div className="dispute-header">
              <h2 className="dispute-title">File a Dispute</h2>
              <p className="dispute-subtitle">Report an Issue with a transaction</p>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label className="form-label">Select Transaction</label>
                <select
                  className="form-select"
                  value={selectedTransaction}
                  onChange={(e) => setSelectedTransaction(e.target.value)}
                >
                  <option value="">Select a transaction</option>
                  <option value="txn1">TXN-9000900 - UGX 67,000</option>
                  <option value="txn2">TXN-9000901 - UGX 2,000</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dispute Reason</label>
                <select
                  className="form-select"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                >
                  <option value="">Dispute a reason</option>
                  <option value="amount">Amount Incorrect</option>
                  <option value="duplicate">Duplicate Charge</option>
                  <option value="unauthorized">Unauthorized Transaction</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Attach Evidence</label>
                <div className="upload-area">
                  <Upload className="upload-icon" />
                  <p className="upload-text">Drag and Drop or Click to Upload</p>
                  <p className="upload-subtext">Max File Size 10MB</p>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-outline">Cancel</button>
                <button className="btn btn-primary">Submit Dispute</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="dispute-track-header">
              <h2 className="dispute-title">Track a Dispute</h2>
              <p className="dispute-subtitle">Track an issue with a transaction</p>
            </div>

            <div className="disputes-list">
              {disputesData.map((dispute, index) => (
                <div key={index} className="card dispute-card">
                  <div className="dispute-content">
                    <div className="dispute-info">
                      <h3 className="dispute-id">{dispute.id}</h3>
                      <p className="dispute-reason">{dispute.reason}</p>
                      <p className="dispute-filed">Filed: {dispute.filed}</p>
                      <p className="dispute-notes">
                        <strong>Admin Notes:</strong> {dispute.notes}
                      </p>
                    </div>
                    <span className={`status-badge status-${dispute.statusColor}`}>{dispute.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )

  const renderHistory = () => (
    <div className="payments-container history-view">
      <header className="payments-header payments-header-navy">
        <div className="payments-header-content">
          <div className="payments-header-left">
            <button className="btn-back" onClick={() => setCurrentView("dashboard")}>
              <ArrowLeft />
            </button>
            <div>
              <h1 className="payments-title">Payment History</h1>
              <p className="payments-subtitle">Manage and view all your deliveries</p>
            </div>
          </div>
          <div className="payments-header-right">
            <button className="btn btn-light">View Analytics</button>
            <button className="btn-icon">
              <Download />
            </button>
            <button className="btn-icon">
              <Share2 />
            </button>
            <button className="btn-icon">
              <Cloud />
            </button>
            <div className="user-badge">
              <span className="user-name">Moses. K</span>
              <div className="user-avatar">MK</div>
            </div>
          </div>
        </div>
      </header>

      <main className="payments-main">
        {/* Search & Filters */}
        <div className="card">
          <h2 className="card-title">Search History</h2>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search By: Description, ID, Status etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All (8)
              </button>
              <button
                className={`filter-btn ${activeFilter === "pending" ? "active" : ""}`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${activeFilter === "completed" ? "active" : ""}`}
                onClick={() => setActiveFilter("completed")}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="card history-table-desktop">
          <table className="history-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentsHistoryData.map((payment, index) => (
                <tr key={index}>
                  <td>
                    <div className="table-description">{payment.description}</div>
                    <div className="table-date">{payment.date}</div>
                  </td>
                  <td className="table-txn-id">{payment.txnId}</td>
                  <td className="table-amount">UGX {payment.amount}</td>
                  <td>
                    <div className="table-method">{payment.method}</div>
                    <div className="table-date">{payment.methodDate}</div>
                  </td>
                  <td>
                    <span className={`status-badge status-${payment.status.toLowerCase()}`}>{payment.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="history-cards-mobile">
          {paymentsHistoryData.map((payment, index) => (
            <div key={index} className="card history-card-mobile">
              <div className="history-card-header">
                <div>
                  <h3 className="history-card-title">{payment.description}</h3>
                  <p className="history-card-date">{payment.date}</p>
                </div>
                <span className={`status-badge status-${payment.status.toLowerCase()}`}>{payment.status}</span>
              </div>
              <div className="history-card-details">
                <div className="history-detail">
                  <span className="detail-label">Transaction ID:</span>
                  <p className="detail-value">{payment.txnId}</p>
                </div>
                <div className="history-detail">
                  <span className="detail-label">Amount:</span>
                  <p className="detail-value">UGX {payment.amount}</p>
                </div>
                <div className="history-detail history-detail-full">
                  <span className="detail-label">Payment Method:</span>
                  <p className="detail-value">{payment.method}</p>
                </div>
              </div>
              <button className="btn btn-outline btn-full">View Details</button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="card pagination-card">
          <div className="pagination">
            <span className="pagination-info">Showing 8 Payments</span>
            <div className="pagination-buttons">
              <button className="btn btn-icon-text">
                <ChevronLeft />
                Previous
              </button>
              <button className="btn btn-icon-text">
                Next
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  // Main render
  return (
    <div className="payments-app">
      {currentView === "dashboard" && renderDashboard()}
      {currentView === "analytics" && renderAnalytics()}
      {currentView === "pending" && renderPending()}
      {currentView === "disputes" && renderDisputes()}
      {currentView === "history" && renderHistory()}
    </div>
  )
}
