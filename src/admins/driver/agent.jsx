"use client"

import { useState } from "react"
import "./agent.css"

const RiderAgent = () => {
  const [currentView, setCurrentView] = useState("welcome")
  const [activeTab, setActiveTab] = useState("referral-tools")
  const [promoCode, setPromoCode] = useState("")
  const [isValidCode, setIsValidCode] = useState(null)
  const [teamFilter, setTeamFilter] = useState("all")
  const [analyticsView, setAnalyticsView] = useState("daily")
  const [withdrawMethod, setWithdrawMethod] = useState("wallet")
  const [withdrawAmount, setWithdrawAmount] = useState("15000")
  const [expandedRider, setExpandedRider] = useState(null)

  // Sample data
  const stats = {
    ridersOnboarded: 14,
    activeToday: 12,
    teamTrips: 98,
    deliveriesToday: 21,
    todaysRevenue: 165000,
    todaysCommission: 15000,
    weeklyCommission: 75000,
    lifetimeCommissions: 1265000,
    pendingPayout: 31000,
  }

  const referralData = {
    link: "https://enfuna.com/r/ABX92",
    code: "ABX92",
    clicksToday: 34,
    signupsToday: 4,
    activatedRiders: 2,
  }

  const teamMembers = [
    {
      id: 1,
      name: "John M.",
      status: "active",
      todayTrips: 8,
      todayRevenue: 45000,
      lifetimeRevenue: 780000,
      commission: 62000,
    },
    {
      id: 2,
      name: "Peter. L",
      status: "inactive",
      todayTrips: 0,
      todayRevenue: 0,
      lifetimeRevenue: 450000,
      commission: 38000,
    },
    {
      id: 3,
      name: "Ahmed S.",
      status: "active",
      todayTrips: 12,
      todayRevenue: 68000,
      lifetimeRevenue: 920000,
      commission: 85000,
    },
    {
      id: 4,
      name: "Sarah K.",
      status: "active",
      todayTrips: 6,
      todayRevenue: 32000,
      lifetimeRevenue: 560000,
      commission: 48000,
    },
  ]

  const commissionLedger = [
    { id: 1, type: "Trip by John M.", amount: 3200, time: "10 : 12 AM", status: "completed" },
    { id: 2, type: "Delivery by Peter S.", amount: 1500, time: "10 : 12 AM", status: "completed" },
    { id: 3, type: "Activation Bonus", amount: 200, time: "Yesterday", status: "completed" },
  ]

  const payoutHistory = [
    { id: 1, amount: 45000, date: "03 NOV 2025", status: "successful" },
    { id: 2, amount: 62000, date: "21 DEC 2025", status: "failed" },
    { id: 3, amount: 38000, date: "03 AUG 2025", status: "successful" },
  ]

  const notifications = [
    { id: 1, type: "New Rider Onboarded", message: "John M Joined your team", time: "10 : 12 AM", badge: "new" },
    { id: 2, type: "Commission Earned", message: "UGX 3,200  from John M.", time: "10 : 12 AM", badge: "new" },
    {
      id: 3,
      type: "Rider Completed First Trip",
      message: "James P. completed his first trip",
      time: "Yesterday",
      badge: "",
    },
  ]

  const handleValidatePromoCode = () => {
    if (promoCode.toUpperCase() === "RIDER2025") {
      setIsValidCode(true)
    } else {
      setIsValidCode(false)
    }
  }

  const handleActivateCode = () => {
    setCurrentView("dashboard")
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const filteredTeam = teamMembers.filter((member) => {
    if (teamFilter === "all") return true
    return member.status === teamFilter
  })

  if (currentView === "welcome") {
    return (
      <div className="rider-agent-container">
        <div className="welcome-screen">
          <div className="logo-section">
            <img src="./assets/start.png" alt="Enfuna" className="enfuna-logo" />
            <p className="tagline">Get Digitized. Get Funded.</p>
          </div>

          <h1 className="welcome-title">Welcome to Rider - Agent Mode</h1>

          <button className="request-promo-btn" onClick={() => setCurrentView("activate")}>
            Request for Promo Code
          </button>

          <p className="resend-text">
            Didn't receive Code? <span className="resend-link">Resend</span>
          </p>
        </div>
      </div>
    )
  }

  if (currentView === "activate") {
    return (
      <div className="rider-agent-container">
        <div className="activate-screen">
          <h1 className="activate-title">Activate Promo Code</h1>
          <p className="activate-subtitle">Upgrade to Rider - Agent Mode</p>

          <div className="promo-input-section">
            <input
              type="text"
              className="promo-input"
              placeholder="RIDER2025"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="validate-btn" onClick={handleValidatePromoCode}>
              Validate
            </button>
          </div>

          {isValidCode !== null && (
            <div className="promo-status">
              <h3 className="status-title">Promo Code Status</h3>
              <div className={`status-badge ${isValidCode ? "valid" : "invalid"}`}>
                {isValidCode ? "✓ Valid Code" : "✗ Invalid Code"}
              </div>
            </div>
          )}

          {isValidCode && <div className="upgrade-message">Your account will be upgraded to Rider-Agent Mode</div>}

          <button className="activate-code-btn" onClick={handleActivateCode} disabled={!isValidCode}>
            Activate Code
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Rider-Agent Dashboard</h1>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "referral-tools" ? "active" : ""}`}
            onClick={() => setActiveTab("referral-tools")}
          >
            Referral Tools
          </button>
          <button
            className={`tab-btn ${activeTab === "view-team" ? "active" : ""}`}
            onClick={() => setActiveTab("view-team")}
          >
            View Team
          </button>
          <button
            className={`tab-btn ${activeTab === "commission" ? "active" : ""}`}
            onClick={() => setActiveTab("commission")}
          >
            Commission
          </button>
          <button
            className={`tab-btn ${activeTab === "payouts" ? "active" : ""}`}
            onClick={() => setActiveTab("payouts")}
          >
            Payouts
          </button>
          <button
            className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        {activeTab === "referral-tools" && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">Total Riders Onboarded</p>
                <h2 className="stat-value">{stats.ridersOnboarded}</h2>
              </div>
              <div className="stat-card">
                <p className="stat-label">Active Today</p>
                <h2 className="stat-value">{stats.activeToday}</h2>
              </div>
              <div className="stat-card">
                <p className="stat-label">Team Trips</p>
                <h2 className="stat-value">{stats.teamTrips}</h2>
              </div>
              <div className="stat-card">
                <p className="stat-label">Deliveries Today</p>
                <h2 className="stat-value">{stats.deliveriesToday}</h2>
              </div>
            </div>

            <div className="commission-overview">
              <h2 className="section-title">Commission Overview</h2>
              <div className="commission-grid">
                <div className="commission-card revenue">
                  <p className="commission-label">Today's Revenue</p>
                  <h3 className="commission-amount">UGX {stats.todaysRevenue.toLocaleString()}</h3>
                </div>
                <div className="commission-card today">
                  <p className="commission-label">Today's Commission</p>
                  <h3 className="commission-amount">UGX {stats.todaysCommission.toLocaleString()}</h3>
                </div>
                <div className="commission-card weekly">
                  <p className="commission-label">Weekly Commission</p>
                  <h3 className="commission-amount">UGX {stats.weeklyCommission.toLocaleString()}</h3>
                </div>
                <div className="commission-card lifetime">
                  <p className="commission-label">Lifetime Commissions</p>
                  <h3 className="commission-amount">UGX {stats.lifetimeCommissions.toLocaleString()}</h3>
                </div>
                <div className="commission-card pending">
                  <p className="commission-label">pending Payout</p>
                  <h3 className="commission-amount">UGX {stats.pendingPayout.toLocaleString()}</h3>
                </div>
              </div>
            </div>

            <div className="alerts-section">
              <div className="referral-alerts">
                <h3 className="alerts-title">Referral Alerts</h3>
                {notifications.map((notif) => (
                  <div key={notif.id} className="alert-item">
                    <div className="alert-content">
                      <h4 className="alert-type">{notif.type}</h4>
                      <p className="alert-message">{notif.message}</p>
                      <span className="alert-time">{notif.time}</span>
                    </div>
                    {notif.badge && <span className="new-badge">{notif.badge}</span>}
                  </div>
                ))}
              </div>

              <div className="milestone-section">
                <div className="milestone-card">
                  <h4 className="milestone-title">Milestone Achieved</h4>
                  <p className="milestone-text">You reached 100 active riders</p>
                  <span className="milestone-time">3 days ago</span>
                </div>

                <div className="milestone-card">
                  <h4 className="milestone-title">Monthly Referral Report Ready</h4>
                  <p className="milestone-text">Your December report is now available</p>
                  <span className="milestone-time">2 days ago</span>
                </div>
              </div>
            </div>

            <button className="withdraw-commission-btn">Withdraw Commission</button>

            <div className="referral-tools-section">
              <div className="share-section">
                <h3 className="share-title">Share Your Referral Link</h3>
                <div className="share-input-group">
                  <input type="text" value={referralData.link} readOnly className="share-input" />
                  <button className="share-btn" onClick={() => copyToClipboard(referralData.link)}>
                    📋 Share
                  </button>
                </div>
              </div>

              <div className="share-section">
                <h3 className="share-title">Share Your Referral Code</h3>
                <div className="share-input-group">
                  <div className="code-display">{referralData.code}</div>
                  <button className="share-btn" onClick={() => copyToClipboard(referralData.code)}>
                    📋 Share
                  </button>
                </div>
              </div>

              <div className="qr-section">
                <h3 className="qr-title">Referral QR Code</h3>
                <div className="qr-display">
                  <div className="qr-placeholder">
                    <div className="qr-icon">
                      ⊞⊡
                      <br />
                      ⊟⊠
                    </div>
                    <p className="qr-label">QR Code</p>
                  </div>
                </div>
              </div>

              <div className="track-activity">
                <h3 className="activity-title">Track Activity</h3>
                <div className="activity-stats">
                  <div className="activity-card">
                    <p className="activity-label">Clicks Today</p>
                    <h2 className="activity-value">{referralData.clicksToday}</h2>
                  </div>
                  <div className="activity-card">
                    <p className="activity-label">Signups Today</p>
                    <h2 className="activity-value">{referralData.signupsToday}</h2>
                  </div>
                  <div className="activity-card">
                    <p className="activity-label">Activated Riders</p>
                    <h2 className="activity-value">{referralData.activatedRiders}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "view-team" && (
          <div className="tab-content">
            <div className="team-header">
              <h2 className="team-title">Your Team</h2>
              <div className="team-filters">
                <button
                  className={`filter-btn ${teamFilter === "all" ? "active" : ""}`}
                  onClick={() => setTeamFilter("all")}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${teamFilter === "active" ? "active" : ""}`}
                  onClick={() => setTeamFilter("active")}
                >
                  Active
                </button>
                <button
                  className={`filter-btn ${teamFilter === "inactive" ? "active" : ""}`}
                  onClick={() => setTeamFilter("inactive")}
                >
                  Inactive
                </button>
                <button
                  className={`filter-btn ${teamFilter === "suspended" ? "active" : ""}`}
                  onClick={() => setTeamFilter("suspended")}
                >
                  Suspended
                </button>
              </div>
            </div>

            <div className="team-list">
              {filteredTeam.map((member) => (
                <div key={member.id} className="team-member-card">
                  <div
                    className="member-header"
                    onClick={() => setExpandedRider(expandedRider === member.id ? null : member.id)}
                  >
                    <div className="member-info">
                      <h3 className="member-name">Rider: {member.name}</h3>
                      <span className={`status-badge ${member.status}`}>{member.status}</span>
                    </div>
                    <div className="member-stats-preview">
                      <div className="stat-preview">
                        <span className="preview-label">Today's Trips</span>
                        <span className="preview-value">{member.todayTrips}</span>
                      </div>
                      <button className="expand-btn">{expandedRider === member.id ? "▲" : "▼"}</button>
                    </div>
                  </div>

                  {expandedRider === member.id && (
                    <div className="member-details">
                      <div className="detail-row">
                        <span className="detail-label">Today's Revenue</span>
                        <span className="detail-value">UGX {member.todayRevenue.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Lifetime Revenue</span>
                        <span className="detail-value">UGX {member.lifetimeRevenue.toLocaleString()}</span>
                      </div>
                      <div className="detail-row highlight">
                        <span className="detail-label">Your Commission</span>
                        <span className="detail-value">UGX {member.commission.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "commission" && (
          <div className="tab-content">
            <div className="commission-engine">
              <h2 className="section-title">Commission Engine</h2>

              <div className="commission-rate-card">
                <p className="rate-label">Your Commission Rate</p>
                <h2 className="rate-value">10% of Enfuna Revenue</h2>
              </div>

              <div className="tier-levels">
                <h3 className="tier-title">Tier Levels</h3>
                <div className="tiers-grid">
                  <div className="tier-card bronze">
                    <h4 className="tier-name">Bronze</h4>
                    <p className="tier-rate">5%</p>
                  </div>
                  <div className="tier-card silver">
                    <h4 className="tier-name">Silver</h4>
                    <p className="tier-rate">7%</p>
                  </div>
                  <div className="tier-card gold active-tier">
                    <h4 className="tier-name">Gold</h4>
                    <p className="tier-rate">10%</p>
                    <span className="current-badge">Current</span>
                  </div>
                  <div className="tier-card platinum">
                    <h4 className="tier-name">Platinum</h4>
                    <p className="tier-rate">12%</p>
                  </div>
                </div>
              </div>

              <div className="commission-summary-grid">
                <div className="summary-card">
                  <p className="summary-label">Daily Commission</p>
                  <h3 className="summary-value">UGX 12,400</h3>
                </div>
                <div className="summary-card">
                  <p className="summary-label">Weekly Commission</p>
                  <h3 className="summary-value">UGX 78,200</h3>
                </div>
              </div>

              <button className="withdraw-btn-large">Withdraw Commission</button>

              <div className="commission-ledger">
                <h3 className="ledger-title">Commission Ledger</h3>
                {commissionLedger.map((entry) => (
                  <div key={entry.id} className="ledger-entry">
                    <div className="entry-indicator"></div>
                    <div className="entry-info">
                      <h4 className="entry-type">{entry.type}</h4>
                      <span className="entry-time">{entry.time}</span>
                    </div>
                    <span className="entry-amount">+UGX {entry.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="status-tracking">
                <div className="tracking-header">
                  <h3 className="tracking-title">Status Tracking</h3>
                  <button className="export-btn">Export Statement</button>
                </div>
                <div className="tracking-row">
                  <span className="tracking-label">Pending</span>
                  <span className="tracking-amount">UGX 14,000</span>
                </div>
                <div className="tracking-row">
                  <span className="tracking-label">Approved</span>
                  <span className="tracking-amount">UGX 62,000</span>
                </div>
                <div className="tracking-row">
                  <span className="tracking-label">Paid</span>
                  <span className="tracking-amount">UGX 1,168,000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="tab-content">
            <div className="payout-section">
              <h2 className="section-title">Commission Payout</h2>

              <div className="balance-card">
                <p className="balance-label">Commission Balance</p>
                <h2 className="balance-amount">UGX 32,000</h2>
              </div>

              <div className="payout-form">
                <label className="form-label">Enter Amount</label>
                <input
                  type="text"
                  className="amount-input"
                  value={`UGX ${withdrawAmount}`}
                  onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ""))}
                />

                <label className="form-label">Withdraw to:</label>
                <div className="withdraw-methods">
                  <button
                    className={`method-btn ${withdrawMethod === "wallet" ? "active" : ""}`}
                    onClick={() => setWithdrawMethod("wallet")}
                  >
                    Wallet
                  </button>
                  <button
                    className={`method-btn ${withdrawMethod === "mobile" ? "active" : ""}`}
                    onClick={() => setWithdrawMethod("mobile")}
                  >
                    Mobile Money
                  </button>
                </div>

                <button className="initiate-withdrawal-btn">Initiate Withdrawal</button>
              </div>

              <div className="payout-history">
                <h3 className="history-title">Payout History</h3>
                {payoutHistory.map((payout) => (
                  <div key={payout.id} className="history-item">
                    <div className="history-info">
                      <h4 className="history-amount">UGX {payout.amount.toLocaleString()}</h4>
                      <span className="history-date">{payout.date}</span>
                    </div>
                    <span className={`history-status ${payout.status}`}>
                      {payout.status === "successful" ? "Successful" : "Failed, Retry"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="tab-content">
            <div className="analytics-section">
              <div className="analytics-header">
                <h2 className="section-title">Referral Analytics</h2>
                <div className="analytics-tabs">
                  <button
                    className={`analytics-tab ${analyticsView === "daily" ? "active" : ""}`}
                    onClick={() => setAnalyticsView("daily")}
                  >
                    Daily
                  </button>
                  <button
                    className={`analytics-tab ${analyticsView === "weekly" ? "active" : ""}`}
                    onClick={() => setAnalyticsView("weekly")}
                  >
                    Weekly
                  </button>
                  <button
                    className={`analytics-tab ${analyticsView === "monthly" ? "active" : ""}`}
                    onClick={() => setAnalyticsView("monthly")}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className="analytics-stats">
                <div className="analytics-card">
                  <p className="analytics-label">Activation Rates</p>
                  <h2 className="analytics-value">24%</h2>
                  <span className="analytics-subtext">Week average</span>
                </div>
                <div className="analytics-card">
                  <p className="analytics-label">Total Revenue This Week</p>
                  <h2 className="analytics-value">UGX 864,000</h2>
                  <span className="analytics-trend positive">+ 15% from last week</span>
                </div>
                <div className="analytics-card">
                  <p className="analytics-label">Total Revenue This Week</p>
                  <h2 className="analytics-value">UGX 3,420,000</h2>
                  <span className="analytics-subtext">All - time High</span>
                </div>
              </div>

              <div className="chart-section">
                <h3 className="chart-title">Team Revenue Trend</h3>
                <div className="chart-container">
                  <div className="chart-bars">
                    <div className="bar-group">
                      <div className="bar commission" style={{ height: "60%" }}></div>
                      <div className="bar revenue" style={{ height: "75%" }}></div>
                      <span className="bar-label">Day 1</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar commission" style={{ height: "55%" }}></div>
                      <div className="bar revenue" style={{ height: "40%" }}></div>
                      <span className="bar-label">Day 2</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar commission" style={{ height: "85%" }}></div>
                      <div className="bar revenue" style={{ height: "70%" }}></div>
                      <span className="bar-label">Day 3</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar commission" style={{ height: "25%" }}></div>
                      <div className="bar revenue" style={{ height: "80%" }}></div>
                      <span className="bar-label">Day 4</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar commission" style={{ height: "50%" }}></div>
                      <div className="bar revenue" style={{ height: "78%" }}></div>
                      <span className="bar-label">Day 5</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar commission" style={{ height: "32%" }}></div>
                      <div className="bar revenue" style={{ height: "75%" }}></div>
                      <span className="bar-label">Day 6</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color commission"></span>
                      <span className="legend-text">Commission</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color revenue"></span>
                      <span className="legend-text">Revenue</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="conversion-funnel">
                <h3 className="funnel-title">Referral Conversion Funnel</h3>
                <div className="funnel-stage">
                  <div className="funnel-bar" style={{ width: "100%" }}>
                    <span className="funnel-label">Clicks</span>
                    <span className="funnel-value">250 (100%)</span>
                  </div>
                </div>
                <div className="funnel-stage">
                  <div className="funnel-bar" style={{ width: "34%" }}>
                    <span className="funnel-label">Clicks</span>
                    <span className="funnel-value">85 (34%)</span>
                  </div>
                </div>
                <div className="funnel-stage">
                  <div className="funnel-bar" style={{ width: "49%" }}>
                    <span className="funnel-label">Signups</span>
                    <span className="funnel-value">42 (49%)</span>
                  </div>
                </div>
                <div className="funnel-stage">
                  <div className="funnel-bar" style={{ width: "90%" }}>
                    <span className="funnel-label">Activated</span>
                    <span className="funnel-value">33 (90%)</span>
                  </div>
                </div>
                <div className="funnel-stage">
                  <div className="funnel-bar" style={{ width: "92%" }}>
                    <span className="funnel-label">First Trip</span>
                    <span className="funnel-value">35 (92%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RiderAgent
