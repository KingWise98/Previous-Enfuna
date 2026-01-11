"use client"

import { useState, useEffect } from "react"
import "./agent.css"

const BASE_URL = "http://127.0.0.1:8000/api/rider-agent/"

const RiderAgent = () => {
  const [currentView, setCurrentView] = useState("welcome")
  const [activeTab, setActiveTab] = useState("referral-tools")
  const [activationCode, setActivationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // State for API data
  const [stats, setStats] = useState({
    todayOnboardedUsers: 0,
    activeToday: 0,
    teamTrips: 0,
    todayDeliveries: 0
  })
  
  const [commissionData, setCommissionData] = useState({
    todayRevenue: 0,
    todayCommission: 0,
    weeklyCommission: 0,
    lifeCommission: 0
  })
  
  const [referralAlerts, setReferralAlerts] = useState([])
  const [commissionEngine, setCommissionEngine] = useState({
    todayComission: null,
    weeklyComission: null
  })
  
  const [teamData, setTeamData] = useState([])
  const [referralLink, setReferralLink] = useState("")
  const [trackingData, setTrackingData] = useState({
    clicksToday: 0,
    signupsToday: 0,
    activatedRiders: 0
  })

  // UI state
  const [teamFilter, setTeamFilter] = useState("all")
  const [analyticsView, setAnalyticsView] = useState("daily")
  const [withdrawMethod, setWithdrawMethod] = useState("wallet")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [expandedRider, setExpandedRider] = useState(null)

  // Fetch initial data
  useEffect(() => {
    if (currentView === "dashboard") {
      fetchDashboardData()
    }
  }, [currentView])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token")
      
      // Fetch stats summary
      const statsRes = await fetch(`${BASE_URL}agents_stats_summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      // Fetch commission overview
      const commissionRes = await fetch(`${BASE_URL}comission_overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (commissionRes.ok) {
        const commissionData = await commissionRes.json()
        setCommissionData(commissionData)
      }

      // Fetch referral alerts
      const alertsRes = await fetch(`${BASE_URL}list_referral_alerts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json()
        setReferralAlerts(alertsData)
      }

      // Fetch commission engine
      const engineRes = await fetch(`${BASE_URL}commission_engine`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (engineRes.ok) {
        const engineData = await engineRes.json()
        setCommissionEngine(engineData)
      }

      // Fetch team data
      const teamRes = await fetch(`${BASE_URL}view_referred_team`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        setTeamData(teamData)
      }

      // Fetch tracking activity
      const trackingRes = await fetch(`${BASE_URL}track_activity`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (trackingRes.ok) {
        const trackingData = await trackingRes.json()
        setTrackingData(trackingData)
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
    }
  }

  const handleRequestActivationCode = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${BASE_URL}request_agent_activation_code`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Activation code sent to: ${data.email || "your registered email"}`)
        setCurrentView("activate")
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to request activation code")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyActivationCode = async () => {
    if (!activationCode.trim()) {
      setError("Please enter activation code")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${BASE_URL}verify_agent_activation_code`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: activationCode })
      })

      if (response.ok) {
        const data = await response.json()
        // Store agent status
        localStorage.setItem("is_agent", "true")
        setCurrentView("dashboard")
        fetchDashboardData()
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Invalid activation code")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const filteredTeam = teamData.filter((member) => {
    if (teamFilter === "all") return true
    return member.status === teamFilter
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Get referral link from localStorage or generate default
  const getReferralLink = () => {
    const referralCode = localStorage.getItem("referral_code") || "YOUR_CODE"
    return `http://127.0.0.1:8000/api/rider-agent/r/${referralCode}/`
  }

  if (currentView === "welcome") {
    return (
      <div className="rider-agent-container">
        <div className="welcome-screen">
          <div className="logo-section">
            <img src="/start.png" alt="Enfuna" className="enfuna-logo" />
          </div>

          <h1 className="welcome-title">Welcome to Rider - Agent Mode</h1>

          <button 
            className="request-promo-btn" 
            onClick={handleRequestActivationCode}
            disabled={isLoading}
          >
            {isLoading ? "Requesting..." : "Request for Activation Code"}
          </button>

          {error && <div className="error-message">{error}</div>}

          <p className="resend-text">
            Didn't receive Code?{" "}
            <span 
              className="resend-link" 
              onClick={handleRequestActivationCode}
              style={{cursor: 'pointer'}}
            >
              Resend
            </span>
          </p>
        </div>
      </div>
    )
  }

  if (currentView === "activate") {
    return (
      <div className="rider-agent-container">
        <div className="activate-screen">
          <h1 className="activate-title">Activate Agent Code</h1>
          <p className="activate-subtitle">Upgrade to Rider - Agent Mode</p>

          <div className="promo-input-section">
            <input
              type="text"
              className="promo-input"
              placeholder="Enter activation code"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            className="activate-code-btn" 
            onClick={handleVerifyActivationCode}
            disabled={isLoading || !activationCode.trim()}
          >
            {isLoading ? "Verifying..." : "Activate Code"}
          </button>

          <p className="resend-text">
            Didn't receive Code?{" "}
            <span 
              className="resend-link" 
              onClick={handleRequestActivationCode}
              style={{cursor: 'pointer'}}
            >
              Resend
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Rider-Agent Dashboard</h1>
          <button 
            className="refresh-btn"
            onClick={fetchDashboardData}
          >
            ↻ Refresh
          </button>
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

        {error && <div className="error-message">{error}</div>}

        {activeTab === "referral-tools" && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">Riders Onboarded Today</p>
                <h2 className="stat-value">{stats.todayOnboardedUsers}</h2>
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
                <h2 className="stat-value">{stats.todayDeliveries}</h2>
              </div>
            </div>

            <div className="commission-overview">
              <h2 className="section-title">Commission Overview</h2>
              <div className="commission-grid">
                <div className="commission-card revenue">
                  <p className="commission-label">Today's Revenue</p>
                  <h3 className="commission-amount">UGX {commissionData.todayRevenue.toLocaleString()}</h3>
                </div>
                <div className="commission-card today">
                  <p className="commission-label">Today's Commission</p>
                  <h3 className="commission-amount">UGX {commissionData.todayCommission.toLocaleString()}</h3>
                </div>
                <div className="commission-card weekly">
                  <p className="commission-label">Weekly Commission</p>
                  <h3 className="commission-amount">UGX {commissionData.weeklyCommission.toLocaleString()}</h3>
                </div>
                <div className="commission-card lifetime">
                  <p className="commission-label">Lifetime Commissions</p>
                  <h3 className="commission-amount">UGX {commissionData.lifeCommission.toLocaleString()}</h3>
                </div>
              </div>
            </div>

            <div className="alerts-section">
              <div className="referral-alerts">
                <h3 className="alerts-title">Referral Alerts</h3>
                {referralAlerts.length > 0 ? (
                  referralAlerts.map((alert, index) => (
                    <div key={index} className="alert-item">
                      <div className="alert-content">
                        <h4 className="alert-type">{alert.type || "Notification"}</h4>
                        <p className="alert-message">{alert.message || alert.detail}</p>
                        <span className="alert-time">
                          {alert.timestamp ? formatDate(alert.timestamp) : "Recently"}
                        </span>
                      </div>
                      {alert.is_new && <span className="new-badge">new</span>}
                    </div>
                  ))
                ) : (
                  <div className="alert-item">
                    <div className="alert-content">
                      <p className="alert-message">No alerts at the moment</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="referral-tools-section">
              <div className="share-section">
                <h3 className="share-title">Share Your Referral Link</h3>
                <div className="share-input-group">
                  <input 
                    type="text" 
                    value={getReferralLink()} 
                    readOnly 
                    className="share-input" 
                  />
                  <button 
                    className="share-btn" 
                    onClick={() => copyToClipboard(getReferralLink())}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="track-activity">
                <h3 className="activity-title">Track Activity</h3>
                <div className="activity-stats">
                  <div className="activity-card">
                    <p className="activity-label">Clicks Today</p>
                    <h2 className="activity-value">{trackingData.clicksToday || 0}</h2>
                  </div>
                  <div className="activity-card">
                    <p className="activity-label">Signups Today</p>
                    <h2 className="activity-value">{trackingData.signupsToday || 0}</h2>
                  </div>
                  <div className="activity-card">
                    <p className="activity-label">Activated Riders</p>
                    <h2 className="activity-value">{trackingData.activatedRiders || 0}</h2>
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
              </div>
            </div>

            <div className="team-list">
              {teamData && teamData.length > 0 ? (
                filteredTeam.map((member, index) => (
                  <div key={index} className="team-member-card">
                    <div
                      className="member-header"
                      onClick={() => setExpandedRider(expandedRider === member.id ? null : member.id)}
                    >
                      <div className="member-info">
                        <h3 className="member-name">
                          {member.name || `Rider ${index + 1}`}
                        </h3>
                        <span className={`status-badge ${member.status || 'inactive'}`}>
                          {member.status || 'inactive'}
                        </span>
                      </div>
                      <div className="member-stats-preview">
                        <div className="stat-preview">
                          <span className="preview-label">Today's Trips</span>
                          <span className="preview-value">{member.today_trips || 0}</span>
                        </div>
                        <button className="expand-btn">
                          {expandedRider === member.id ? "▲" : "▼"}
                        </button>
                      </div>
                    </div>

                    {expandedRider === member.id && (
                      <div className="member-details">
                        <div className="detail-row">
                          <span className="detail-label">Today's Revenue</span>
                          <span className="detail-value">
                            UGX {(member.today_revenue || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Lifetime Revenue</span>
                          <span className="detail-value">
                            UGX {(member.lifetime_revenue || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="detail-row highlight">
                          <span className="detail-label">Your Commission</span>
                          <span className="detail-value">
                            UGX {(member.commission || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No team members yet. Share your referral link to start building your team!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "commission" && (
          <div className="tab-content">
            <div className="commission-engine">
              <h2 className="section-title">Commission Engine</h2>

              <div className="commission-summary-grid">
                <div className="summary-card">
                  <p className="summary-label">Daily Commission</p>
                  <h3 className="summary-value">
                    UGX {(commissionEngine.todayComission || 0).toLocaleString()}
                  </h3>
                </div>
                <div className="summary-card">
                  <p className="summary-label">Weekly Commission</p>
                  <h3 className="summary-value">
                    UGX {(commissionEngine.weeklyComission || 0).toLocaleString()}
                  </h3>
                </div>
              </div>

              <div className="commission-rate-card">
                <p className="rate-label">Your Commission Rate</p>
                <h2 className="rate-value">Based on your tier level</h2>
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
                <h2 className="balance-amount">
                  UGX {commissionData.lifeCommission.toLocaleString()}
                </h2>
              </div>

              <div className="payout-form">
                <label className="form-label">Enter Amount</label>
                <input
                  type="number"
                  className="amount-input"
                  placeholder="UGX"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
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
                  <p className="analytics-label">Team Size</p>
                  <h2 className="analytics-value">{teamData.length}</h2>
                  <span className="analytics-subtext">Total riders</span>
                </div>
                <div className="analytics-card">
                  <p className="analytics-label">Today's Revenue</p>
                  <h2 className="analytics-value">
                    UGX {commissionData.todayRevenue.toLocaleString()}
                  </h2>
                  <span className="analytics-subtext">Generated today</span>
                </div>
                <div className="analytics-card">
                  <p className="analytics-label">Total Commission</p>
                  <h2 className="analytics-value">
                    UGX {commissionData.lifeCommission.toLocaleString()}
                  </h2>
                  <span className="analytics-subtext">All-time earnings</span>
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