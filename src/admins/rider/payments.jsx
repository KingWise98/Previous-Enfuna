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

  // Stats data - simplified for compact display
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
    { label: "Success Rate", value: "98.2%", change: "+20.5%", trend: "up", icon: CheckCircle, color: "purple" },
  ]

  const paymentMethodsData = [
    { name: "MTN MoMo", percentage: 82, transactions: "1240", color: "payment-mtn" },
    { name: "Airtel Money", percentage: 2, transactions: "10", color: "payment-airtel" },
    { name: "Cash", percentage: 50, transactions: "460", color: "payment-cash" },
    { name: "QR Code", percentage: 12, transactions: "60", color: "payment-qr" },
    { name: "Split Payment", percentage: 12, transactions: "60", color: "payment-split" },
    { name: "Card Payment", percentage: 1, transactions: "2", color: "payment-card" },
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
      date: "03-12-2025",
      txnId: "QT6730000",
      amount: "2,500",
      method: "Cash",
      status: "Completed",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730000",
      amount: "2,500",
      method: "MTN MoMO",
      status: "Completed",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730000",
      amount: "2,500",
      method: "QR Code",
      status: "Failed",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730000",
      amount: "2,500",
      method: "MTN MoMo",
      status: "Completed",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730000",
      amount: "2,500",
      method: "Airtel Money",
      status: "Pending",
    },
    {
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730000",
      amount: "2,500",
      method: "Cash",
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
    { day: "Sun", failed: 200, completed: 650 },
    { day: "Mon", failed: 300, completed: 250 },
    { day: "Tue", failed: 200, completed: 500 },
    { day: "Wed", failed: 180, completed: 700 },
    { day: "Thu", failed: 250, completed: 680 },
    { day: "Fri", failed: 220, completed: 580 },
  ]

  // Render functions for each view
  const renderDashboard = () => (
    <div className="payments-container">
      <header className="payments-header">
        <div className="payments-header-content">
          <div className="payments-header-left">
            <div>
              <h1 className="payments-title">PAYMENT DASHBOARD</h1>
              <p className="payments-subtitle">Real-Time payment overview</p>
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
        {/* Compact Stats Grid - All on one line */}
        <div className="compact-stats-grid">
          {dashboardStats.map((stat, index) => (
            <div key={index} className={`compact-stat-card compact-stat-${stat.color}`}>
              <div className="compact-stat-icon">
                <stat.icon className="icon" />
              </div>
              <div className="compact-stat-content">
                <span className="compact-stat-label">{stat.label}</span>
                <div className="compact-stat-value">
                  {stat.value}
                  {stat.currency && <span className="compact-stat-currency">{stat.currency}</span>}
                </div>
                <div className={`compact-stat-change ${stat.trend}`}>{stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Action Buttons */}
        <div className="compact-action-buttons">
          <button className="btn btn-compact btn-blue" onClick={() => setCurrentView("pending")}>
            Pending Payments
          </button>
          <button className="btn btn-compact btn-yellow">Receive Money</button>
          <button className="btn btn-compact btn-dark" onClick={() => setCurrentView("disputes")}>
            File Dispute
          </button>
          <button className="btn btn-compact btn-navy" onClick={() => setCurrentView("analytics")}>
            Analytics
          </button>
        </div>

        {/* Payment Methods & Recent Transactions - Compact */}
        <div className="compact-content-grid">
          <div className="compact-card">
            <div className="compact-card-header">
              <h2 className="compact-card-title">Payment Methods</h2>
              <p className="compact-card-subtitle">Today's Breakdown</p>
            </div>
            <div className="compact-payment-methods">
              {paymentMethodsData.map((method, index) => (
                <div key={index} className="compact-payment-method">
                  <div className="compact-payment-header">
                    <span className="compact-payment-name">{method.name}</span>
                    <span className="compact-payment-percentage">{method.percentage}%</span>
                  </div>
                  <div className="compact-progress-bar">
                    <div className={`compact-progress-fill ${method.color}`} style={{ width: `${method.percentage}%` }}></div>
                  </div>
                  <span className="compact-payment-transactions">{method.transactions} txn</span>
                </div>
              ))}
            </div>
          </div>

          <div className="compact-card">
            <div className="compact-card-header">
              <h2 className="compact-card-title">Recent Transactions</h2>
              <p className="compact-card-subtitle">Latest Payments</p>
            </div>
            <div className="compact-transactions">
              {recentTransactionsData.map((transaction, index) => (
                <div key={index} className="compact-transaction">
                  <div className="compact-transaction-info">
                    <div className="compact-transaction-type">{transaction.type}</div>
                    <div className="compact-transaction-method">{transaction.method}</div>
                    <div className="compact-transaction-time">{transaction.time}</div>
                  </div>
                  <div className="compact-transaction-right">
                    <span className="compact-transaction-amount">UGX {transaction.amount}</span>
                    <span className={`compact-status status-${transaction.status.toLowerCase()}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-compact btn-blue btn-full" onClick={() => setCurrentView("history")}>
              View All
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
              <p className="payments-subtitle">Real-time performance</p>
            </div>
          </div>
          <div className="payments-header-right">
            <div className="compact-user-badge">
              <span className="user-name">Moses. K</span>
              <div className="user-avatar">MK</div>
            </div>
          </div>
        </div>
      </header>

      <main className="payments-main">
        {/* Time Period Tabs */}
        <div className="compact-tab-buttons">
          <button className={`compact-tab-btn ${activeTab === "daily" ? "active" : ""}`} onClick={() => setActiveTab("daily")}>
            Daily
          </button>
          <button
            className={`compact-tab-btn ${activeTab === "weekly" ? "active" : ""}`}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly
          </button>
          <button
            className={`compact-tab-btn ${activeTab === "monthly" ? "active" : ""}`}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="compact-analytics-cards">
          {analyticsCards.map((card, index) => (
            <div key={index} className="compact-analytics-card">
              <div className="compact-analytics-header">
                <span className="compact-analytics-label">{card.label}</span>
                <span className={`compact-analytics-change ${card.trend === "up" ? "positive" : "negative"}`}>
                  {card.trend === "up" ? <TrendingUp className="trend-icon" /> : <TrendingDown className="trend-icon" />}
                  {card.change}
                </span>
              </div>
              <div className="compact-analytics-amount">{card.amount}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="compact-content-grid">
          <div className="compact-card">
            <div className="compact-card-header">
              <h2 className="compact-card-title">Payment Summary</h2>
              <p className="compact-card-subtitle">Completed vs Failed</p>
            </div>
            <div className="compact-chart-container">
              {chartData.map((data, index) => (
                <div key={index} className="compact-chart-bar-group">
                  <div className="compact-chart-bars">
                    <div
                      className="compact-chart-bar completed"
                      style={{ height: `${(data.completed / 700) * 100}px` }}
                    ></div>
                    <div
                      className="compact-chart-bar failed"
                      style={{ height: `${(data.failed / 700) * 100}px` }}
                    ></div>
                  </div>
                  <span className="compact-chart-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="compact-card">
            <div className="compact-card-header">
              <h2 className="compact-card-title">Payment Methods</h2>
              <p className="compact-card-subtitle">Usage Today</p>
            </div>
            <div className="compact-payment-methods">
              {paymentMethodsData.slice(0, 4).map((method, index) => (
                <div key={index} className="compact-payment-method">
                  <div className="compact-payment-header">
                    <span className="compact-payment-name">{method.name}</span>
                    <span className="compact-payment-percentage">{method.percentage}%</span>
                  </div>
                  <div className="compact-progress-bar">
                    <div className={`compact-progress-fill ${method.color}`} style={{ width: `${method.percentage}%` }}></div>
                  </div>
                  <span className="compact-payment-transactions">{method.transactions} txn</span>
                </div>
              ))}
            </div>
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
              <p className="payments-subtitle">Track and Manage</p>
            </div>
          </div>
          <button className="btn btn-compact btn-light" onClick={() => setCurrentView("dashboard")}>
            Back
          </button>
        </div>
      </header>

      <main className="payments-main">
        {/* Compact Stats */}
        <div className="compact-pending-stats">
          <div className="compact-stat-card">
            <div className="compact-stat-label">Pending</div>
            <div className="compact-stat-value">5</div>
            <div className="compact-stat-detail">payments</div>
          </div>
          <div className="compact-stat-card">
            <div className="compact-stat-label">Amount</div>
            <div className="compact-stat-value">96,000</div>
            <div className="compact-stat-detail">UGX</div>
          </div>
          <div className="compact-stat-card">
            <div className="compact-stat-label">Avg Time</div>
            <div className="compact-stat-value">2h 25m</div>
            <div className="compact-stat-detail">to complete</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="compact-card">
          <div className="compact-search-filter">
            <div className="compact-search-input">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="compact-filter-buttons">
              <button
                className={`compact-filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
                className={`compact-filter-btn ${activeFilter === "pending" ? "active" : ""}`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`compact-filter-btn ${activeFilter === "processing" ? "active" : ""}`}
                onClick={() => setActiveFilter("processing")}
              >
                Processing
              </button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="compact-payments-list">
          {pendingPaymentsData.map((payment, index) => (
            <div key={index} className="compact-payment-card">
              <div className="compact-payment-info">
                <div className="compact-payment-left">
                  <div className="compact-payment-type">{payment.type}</div>
                  <div className="compact-payment-method">{payment.method}</div>
                  <div className="compact-payment-ref">Ref: {payment.ref}</div>
                </div>
                <div className="compact-payment-right">
                  <div className="compact-payment-amount">UGX {payment.amount}</div>
                  <div className="compact-payment-time">{payment.time}</div>
                  <span className={`compact-status status-${payment.statusColor}`}>{payment.status}</span>
                </div>
              </div>
              <div className="compact-payment-actions">
                <button className="btn btn-compact btn-outline">Details</button>
                <button className="btn btn-compact btn-blue">
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
              <h1 className="payments-title">Disputes</h1>
              <p className="payments-subtitle">File and Track</p>
            </div>
          </div>
          <button className="btn btn-compact btn-light" onClick={() => setCurrentView("dashboard")}>
            Back
          </button>
        </div>
      </header>

      <main className="payments-main">
        {/* Tabs */}
        <div className="compact-tab-buttons">
          <button className={`compact-tab-btn ${disputeTab === "file" ? "active" : ""}`} onClick={() => setDisputeTab("file")}>
            File
          </button>
          <button
            className={`compact-tab-btn ${disputeTab === "track" ? "active" : ""}`}
            onClick={() => setDisputeTab("track")}
          >
            Track
          </button>
        </div>

        {disputeTab === "file" ? (
          <div className="compact-card">
            <div className="compact-dispute-header">
              <h2 className="compact-dispute-title">File a Dispute</h2>
              <p className="compact-dispute-subtitle">Report transaction issue</p>
            </div>

            <div className="compact-form">
              <div className="compact-form-group">
                <select
                  className="compact-form-select"
                  value={selectedTransaction}
                  onChange={(e) => setSelectedTransaction(e.target.value)}
                >
                  <option value="">Select transaction</option>
                  <option value="txn1">TXN-9000900 - UGX 67,000</option>
                  <option value="txn2">TXN-9000901 - UGX 2,000</option>
                </select>
              </div>

              <div className="compact-form-group">
                <select
                  className="compact-form-select"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                >
                  <option value="">Select reason</option>
                  <option value="amount">Amount Incorrect</option>
                  <option value="duplicate">Duplicate Charge</option>
                  <option value="unauthorized">Unauthorized</option>
                </select>
              </div>

              <div className="compact-upload">
                <Upload className="upload-icon" />
                <p className="upload-text">Upload Evidence</p>
                <p className="upload-subtext">Max 10MB</p>
              </div>

              <div className="compact-form-actions">
                <button className="btn btn-compact btn-outline">Cancel</button>
                <button className="btn btn-compact btn-blue">Submit</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="compact-dispute-header">
              <h2 className="compact-dispute-title">Track Disputes</h2>
              <p className="compact-dispute-subtitle">Monitor ongoing issues</p>
            </div>

            <div className="compact-disputes-list">
              {disputesData.map((dispute, index) => (
                <div key={index} className="compact-dispute-card">
                  <div className="compact-dispute-info">
                    <div className="compact-dispute-id">{dispute.id}</div>
                    <div className="compact-dispute-reason">{dispute.reason}</div>
                    <div className="compact-dispute-filed">Filed: {dispute.filed}</div>
                  </div>
                  <span className={`compact-status status-${dispute.statusColor}`}>{dispute.status}</span>
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
              <p className="payments-subtitle">View all transactions</p>
            </div>
          </div>
          <div className="compact-user-badge">
            <span className="user-name">Moses. K</span>
            <div className="user-avatar">MK</div>
          </div>
        </div>
      </header>

      <main className="payments-main">
        {/* Search & Filters */}
        <div className="compact-card">
          <div className="compact-search-filter">
            <div className="compact-search-input">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="compact-filter-buttons">
              <button
                className={`compact-filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
                className={`compact-filter-btn ${activeFilter === "pending" ? "active" : ""}`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`compact-filter-btn ${activeFilter === "completed" ? "active" : ""}`}
                onClick={() => setActiveFilter("completed")}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="compact-history-list">
          {paymentsHistoryData.map((payment, index) => (
            <div key={index} className="compact-history-card">
              <div className="compact-history-info">
                <div className="compact-history-left">
                  <div className="compact-history-description">{payment.description}</div>
                  <div className="compact-history-date">{payment.date}</div>
                  <div className="compact-history-txn">{payment.txnId}</div>
                </div>
                <div className="compact-history-right">
                  <div className="compact-history-amount">UGX {payment.amount}</div>
                  <div className="compact-history-method">{payment.method}</div>
                  <span className={`compact-status status-${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
              <button className="btn btn-compact btn-outline">Details</button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="compact-pagination">
          <span className="pagination-info">Showing 6 payments</span>
          <div className="pagination-buttons">
            <button className="btn btn-compact btn-outline">
              <ChevronLeft />
              Prev
            </button>
            <button className="btn btn-compact btn-outline">
              Next
              <ChevronRight />
            </button>
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