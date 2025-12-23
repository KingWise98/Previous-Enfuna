"use client"

import { useState } from "react"
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
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">PAYMENT DASHBOARD</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "analytics" ? "active" : ""}`} onClick={() => setCurrentView("analytics")}>
          Analytics
        </button>
        <button className={`tab-btn ${currentView === "pending" ? "active" : ""}`} onClick={() => setCurrentView("pending")}>
          Pending
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
        <button className={`tab-btn ${currentView === "history" ? "active" : ""}`} onClick={() => setCurrentView("history")}>
          History
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Collections Today</div>
          <p className="stat-value">125,000</p>
          <div style={{ fontSize: '11px', color: '#2e7d32' }}>+12.5%</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Pending Payments</div>
          <p className="stat-value">18</p>
          <div style={{ fontSize: '11px', color: '#f59e0b' }}>+2 pending</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Pending Reconciliations</div>
          <p className="stat-value">23</p>
          <div style={{ fontSize: '11px', color: '#2e7d32' }}>+20.5%</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Success Rate</div>
          <p className="stat-value">98.2%</p>
          <div style={{ fontSize: '11px', color: '#2e7d32' }}>+20.5%</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="share-btn" onClick={() => setCurrentView("pending")}>
          Pending Payments
        </button>
        <button className="share-btn" style={{ background: '#fef08a', color: 'black' }}>
          Receive Money
        </button>
        <button className="share-btn" style={{ background: '#f0f4ff', color: '#0033cc' }} onClick={() => setCurrentView("disputes")}>
          File Dispute
        </button>
        <button className="share-btn" onClick={() => setCurrentView("analytics")}>
          Analytics
        </button>
      </div>

      {/* Payment Methods & Recent Transactions */}
      <div className="alerts-section">
        {/* Payment Methods */}
        <div className="referral-alerts">
          <div className="alerts-title">Payment Methods</div>
          <div className="track-activity">
            {paymentMethodsData.map((method, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: '#0033cc' }}>{method.name}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#0033cc' }}>{method.percentage}%</div>
                </div>
                <div style={{ 
                  height: '4px', 
                  background: '#f0f4ff',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    width: `${method.percentage}%`,
                    height: '100%',
                    background: method.name === 'MTN MoMo' ? '#fef08a' : 
                               method.name === 'Airtel Money' ? '#ffebee' :
                               method.name === 'Cash' ? '#e3f2fd' :
                               method.name === 'QR Code' ? '#e8f5e9' :
                               method.name === 'Split Payment' ? '#f3e5f5' : '#f5f5f5'
                  }}></div>
                </div>
                <div style={{ fontSize: '10px', color: '#666', textAlign: 'right' }}>
                  {method.transactions} transactions
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="milestone-section">
          <div className="alerts-title">Recent Transactions</div>
          <div className="ledger-entry" style={{ marginBottom: '8px' }}>
            {recentTransactionsData.map((transaction, index) => (
              <div key={index} className="alert-item" style={{ marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div className="alert-type">{transaction.type}</div>
                  <div className="alert-message">{transaction.method}</div>
                  <div className="alert-time">{transaction.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#0033cc',
                    marginBottom: '2px'
                  }}>
                    UGX {transaction.amount}
                  </div>
                  <span className={`status-badge ${transaction.status === 'Completed' ? 'valid' : transaction.status === 'Pending' ? 'pending' : 'invalid'}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="activate-code-btn" onClick={() => setCurrentView("history")}>
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">PAYMENT ANALYTICS</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "analytics" ? "active" : ""}`} onClick={() => setCurrentView("analytics")}>
          Analytics
        </button>
        <button className={`tab-btn ${currentView === "pending" ? "active" : ""}`} onClick={() => setCurrentView("pending")}>
          Pending
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
        <button className={`tab-btn ${currentView === "history" ? "active" : ""}`} onClick={() => setCurrentView("history")}>
          History
        </button>
      </div>

      {/* Time Period Tabs */}
      <div className="tab-navigation" style={{ marginBottom: '20px' }}>
        <button className={`tab-btn ${activeTab === "daily" ? "active" : ""}`} onClick={() => setActiveTab("daily")}>
          Daily
        </button>
        <button className={`tab-btn ${activeTab === "weekly" ? "active" : ""}`} onClick={() => setActiveTab("weekly")}>
          Weekly
        </button>
        <button className={`tab-btn ${activeTab === "monthly" ? "active" : ""}`} onClick={() => setActiveTab("monthly")}>
          Monthly
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="stats-grid">
        {analyticsCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{card.label}</div>
            <p className="stat-value">{card.amount}</p>
            <div style={{ 
              fontSize: '11px', 
              color: card.trend === 'up' ? '#2e7d32' : '#c62828',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {card.trend === 'up' ? '↑' : '↓'} {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="alerts-section">
        {/* Payment Summary Chart */}
    

        {/* Payment Methods Usage */}
        <div className="milestone-section">
          <div className="alerts-title">Payment Methods Usage</div>
          <div style={{ marginTop: '12px' }}>
            {paymentMethodsData.slice(0, 4).map((method, index) => (
              <div key={index} className="milestone-card" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div className="milestone-title">{method.name}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#0033cc' }}>{method.percentage}%</div>
                </div>
                <div style={{ 
                  height: '4px', 
                  background: '#f0f4ff',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    width: `${method.percentage}%`,
                    height: '100%',
                    background: '#0033cc'
                  }}></div>
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {method.transactions} transactions today
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPending = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">PENDING PAYMENTS</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "analytics" ? "active" : ""}`} onClick={() => setCurrentView("analytics")}>
          Analytics
        </button>
        <button className={`tab-btn ${currentView === "pending" ? "active" : ""}`} onClick={() => setCurrentView("pending")}>
          Pending
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
        <button className={`tab-btn ${currentView === "history" ? "active" : ""}`} onClick={() => setCurrentView("history")}>
          History
        </button>
      </div>

      {/* Compact Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <p className="stat-value">5</p>
          <div style={{ fontSize: '11px', color: '#666' }}>payments</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Amount</div>
          <p className="stat-value">96,000</p>
          <div style={{ fontSize: '11px', color: '#666' }}>UGX</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Avg Time</div>
          <p className="stat-value">2h 25m</p>
          <div style={{ fontSize: '11px', color: '#666' }}>to complete</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="commission-overview">
        <div className="section-title">Search & Filter</div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search..."
              className="share-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
            <Search style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: '#0033cc'
            }} />
          </div>
          <div className="tab-navigation" style={{ width: 'auto' }}>
            <button 
              className={`tab-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button 
              className={`tab-btn ${activeFilter === "pending" ? "active" : ""}`}
              onClick={() => setActiveFilter("pending")}
            >
              Pending
            </button>
            <button 
              className={`tab-btn ${activeFilter === "processing" ? "active" : ""}`}
              onClick={() => setActiveFilter("processing")}
            >
              Processing
            </button>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="commission-overview">
        <div className="section-title">Pending Payments</div>
        <div className="ledger-entry" style={{ marginBottom: '8px' }}>
          {pendingPaymentsData.map((payment, index) => (
            <div key={index} className="alert-item" style={{ marginBottom: '8px', padding: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div className="alert-type">{payment.type}</div>
                  <span className={`status-badge ${payment.status === 'Pending' ? 'pending' : payment.status === 'Verifying' ? 'pending' : 'pending'}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="alert-message">{payment.method} • Ref: {payment.ref}</div>
                <div className="alert-time">{payment.time}</div>
                
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0033cc' }}>
                    UGX {payment.amount}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="share-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>
                      Details
                    </button>
                    <button className="share-btn" style={{ 
                      fontSize: '11px', 
                      padding: '6px 12px',
                      background: '#fef08a',
                      color: 'black'
                    }}>
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDisputes = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">DISPUTES</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "analytics" ? "active" : ""}`} onClick={() => setCurrentView("analytics")}>
          Analytics
        </button>
        <button className={`tab-btn ${currentView === "pending" ? "active" : ""}`} onClick={() => setCurrentView("pending")}>
          Pending
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
        <button className={`tab-btn ${currentView === "history" ? "active" : ""}`} onClick={() => setCurrentView("history")}>
          History
        </button>
      </div>

      {/* Dispute Tabs */}
      <div className="tab-navigation" style={{ marginBottom: '20px' }}>
        <button className={`tab-btn ${disputeTab === "file" ? "active" : ""}`} onClick={() => setDisputeTab("file")}>
          File
        </button>
        <button className={`tab-btn ${disputeTab === "track" ? "active" : ""}`} onClick={() => setDisputeTab("track")}>
          Track
        </button>
      </div>

      {disputeTab === "file" ? (
        <div className="payout-section">
          <div className="payout-form">
            <label className="form-label">Select Transaction</label>
            <select
              className="share-input"
              value={selectedTransaction}
              onChange={(e) => setSelectedTransaction(e.target.value)}
              style={{ marginBottom: '16px' }}
            >
              <option value="">Select transaction</option>
              <option value="txn1">TXN-9000900 - UGX 67,000</option>
              <option value="txn2">TXN-9000901 - UGX 2,000</option>
            </select>

            <label className="form-label">Select Reason</label>
            <select
              className="share-input"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              style={{ marginBottom: '16px' }}
            >
              <option value="">Select reason</option>
              <option value="amount">Amount Incorrect</option>
              <option value="duplicate">Duplicate Charge</option>
              <option value="unauthorized">Unauthorized</option>
            </select>

            <label className="form-label">Upload Evidence</label>
            <div style={{ 
              border: '2px dashed #0033cc',
              borderRadius: '6px',
              padding: '20px',
              textAlign: 'center',
              background: '#f0f4ff',
              cursor: 'pointer',
              marginBottom: '16px'
            }}>
              <Upload style={{ 
                width: '24px', 
                height: '24px', 
                color: '#0033cc', 
                margin: '0 auto 8px' 
              }} />
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#0033cc' }}>
                Upload Evidence
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                Max 10MB
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="activate-code-btn" style={{ background: '#666' }}>
                Cancel
              </button>
              <button className="activate-code-btn">
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="commission-overview">
          <div className="section-title">Track Disputes</div>
          <div className="ledger-entry" style={{ marginBottom: '8px' }}>
            {disputesData.map((dispute, index) => (
              <div key={index} className="alert-item" style={{ marginBottom: '8px', padding: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div className="alert-type">{dispute.id}</div>
                    <span className={`status-badge ${dispute.status === 'Resolved' ? 'valid' : dispute.status === 'Under Review' ? 'pending' : 'invalid'}`}>
                      {dispute.status}
                    </span>
                  </div>
                  <div className="alert-message">{dispute.reason}</div>
                  <div className="alert-time">Filed: {dispute.filed}</div>
                  {dispute.notes && (
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#666', 
                      marginTop: '4px',
                      padding: '8px',
                      background: '#f8f9fa',
                      borderRadius: '4px',
                      borderLeft: '3px solid #0033cc'
                    }}>
                      {dispute.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderHistory = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">PAYMENT HISTORY</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "analytics" ? "active" : ""}`} onClick={() => setCurrentView("analytics")}>
          Analytics
        </button>
        <button className={`tab-btn ${currentView === "pending" ? "active" : ""}`} onClick={() => setCurrentView("pending")}>
          Pending
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
        <button className={`tab-btn ${currentView === "history" ? "active" : ""}`} onClick={() => setCurrentView("history")}>
          History
        </button>
      </div>

      {/* Search & Filters */}
      <div className="commission-overview">
        <div className="section-title">Search & Filter</div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search history..."
              className="share-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
            <Search style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: '#0033cc'
            }} />
          </div>
          <div className="tab-navigation" style={{ width: 'auto' }}>
            <button 
              className={`tab-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button 
              className={`tab-btn ${activeFilter === "pending" ? "active" : ""}`}
              onClick={() => setActiveFilter("pending")}
            >
              Pending
            </button>
            <button 
              className={`tab-btn ${activeFilter === "completed" ? "active" : ""}`}
              onClick={() => setActiveFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="commission-overview">
        <div className="section-title">Payment History</div>
        <div className="ledger-entry" style={{ marginBottom: '8px' }}>
          {paymentsHistoryData.map((payment, index) => (
            <div key={index} className="alert-item" style={{ marginBottom: '8px' }}>
              <div style={{ flex: 1 }}>
                <div className="alert-type">{payment.description}</div>
                <div className="alert-message">{payment.txnId}</div>
                <div className="alert-time">{payment.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#0033cc',
                  marginBottom: '2px'
                }}>
                  UGX {payment.amount}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                  {payment.method}
                </div>
                <span className={`status-badge ${payment.status === 'Completed' ? 'valid' : payment.status === 'Pending' ? 'pending' : 'invalid'}`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '11px', color: '#666' }}>
            Showing 6 payments
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="share-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>
              <ChevronLeft style={{ width: '12px', height: '12px', marginRight: '4px' }} />
              Prev
            </button>
            <button className="share-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>
              Next
              <ChevronRight style={{ width: '12px', height: '12px', marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Main render
  return (
    <>
      <style jsx>{`
        /* Chart Styles */
        .chart-container {
          width: 100%;
        }

        .chart-bars {
          display: flex;
          gap: 8px;
          justify-content: space-around;
          align-items: flex-end;
          height: 120px;
          margin-bottom: 12px;
        }

        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex: 1;
        }

        .bar {
          width: 12px;
          border-radius: 2px 2px 0 0;
          transition: all 0.2s ease;
        }

        .bar.completed {
          background: #0033cc;
        }

        .bar.failed {
          background: #ff5252;
        }

        .bar-label {
          color: #666;
          font-size: 10px;
          font-weight: 500;
          text-align: center;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-color {
          width: 12px;
          height: 8px;
          border-radius: 2px;
        }

        .legend-color.completed {
          background: #0033cc;
        }

        .legend-color.failed {
          background: #ff5252;
        }

        .legend-text {
          color: #666;
          font-size: 11px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .alerts-section {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .chart-bars {
            gap: 4px;
            height: 100px;
          }
          
          .bar {
            width: 10px;
          }
        }
      `}</style>

      {currentView === "dashboard" && renderDashboard()}
      {currentView === "analytics" && renderAnalytics()}
      {currentView === "pending" && renderPending()}
      {currentView === "disputes" && renderDisputes()}
      {currentView === "history" && renderHistory()}
    </>
  )
}