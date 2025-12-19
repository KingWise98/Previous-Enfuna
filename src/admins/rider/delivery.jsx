"use client"

import { useState, useEffect } from "react"
import "./d.css"

const Deliveries = () => {
  const [currentView, setCurrentView] = useState("dashboard")
  const [deliveryData, setDeliveryData] = useState({
    customerName: "",
    customerPhone: "",
    packageDescription: "",
    packageWeight: "",
    deliveryType: "same-day",
    pickupAddress: "",
    dropoffAddress: "",
    recipientName: "",
    recipientPhone: "",
    estimatedPrice: 3000,
  })

  const [activeDelivery, setActiveDelivery] = useState(null)
  const [timer, setTimer] = useState(0)
  const [distance, setDistance] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [recipientCode, setRecipientCode] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // History filters
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterPayment, setFilterPayment] = useState("all")
  const [filterRoute, setFilterRoute] = useState("all")
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(15000)
  const [sortBy, setSortBy] = useState("date")
  const [currentPage, setCurrentPage] = useState(1)
  const [analyticsView, setAnalyticsView] = useState("daily")

  // Sample delivery history data
  const [deliveryHistory] = useState([
    {
      id: "DEL-007",
      customerName: "James",
      customerPhone: "0789 898 898",
      route: "Kireka - Banda",
      deliveryType: "Same-Day Delivery",
      distance: "5.2km",
      duration: "12min",
      amount: 2000,
      paymentMethod: "Cash",
      status: "Completed",
      date: "2025-01-15",
      time: "09:30 AM",
    },
    {
      id: "DEL-008",
      customerName: "Peter",
      customerPhone: "0787 009 890",
      route: "Gulu - Nabuti",
      deliveryType: "Same-Day Delivery",
      distance: "8.7km",
      duration: "12min",
      amount: 8000,
      paymentMethod: "Cash",
      status: "Cancelled",
      date: "2025-01-15",
      time: "10:15 AM",
    },
    {
      id: "DEL-009",
      customerName: "Wise",
      customerPhone: "0787 009 890",
      route: "Kireka - Banda",
      deliveryType: "Express",
      distance: "4.5km",
      duration: "30min",
      amount: 3000,
      paymentMethod: "MTN MoMo",
      status: "Completed",
      date: "2025-01-15",
      time: "11:00 AM",
    },
    {
      id: "DEL-010",
      customerName: "Alex",
      customerPhone: "0789 009 890",
      route: "Kampala - Banda",
      deliveryType: "Same-Day Delivery",
      distance: "2.2km",
      duration: "14min",
      amount: 5000,
      paymentMethod: "MTN MoMo",
      status: "Completed",
      date: "2025-01-15",
      time: "02:45 PM",
    },
  ])

  // Analytics data
  const analyticsData = {
    totalDeliveries: 125,
    totalRevenue: 120000,
    completedDeliveries: 102,
    failedDeliveries: 23,
    revenueChange: "+2.5%",
    completedChange: "+20.5%",
    failedChange: "-2.5%",
  }

  // Timer for active delivery
  useEffect(() => {
    let interval
    if (activeDelivery && currentView === "active-delivery") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
        setDistance((prev) => prev + 0.01)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeDelivery, currentView])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const handleStartDelivery = () => {
    if (!deliveryData.customerName || !deliveryData.pickupAddress || !deliveryData.dropoffAddress) {
      alert("Please fill in all required fields")
      return
    }

    setActiveDelivery({
      ...deliveryData,
      id: `DLV-${Date.now()}`,
      startTime: new Date(),
    })
    setTimer(0)
    setDistance(0)
    setCurrentView("active-delivery")
  }

  const handleEndDelivery = () => {
    setCurrentView("complete-delivery")
  }

  const handleReceiveMoney = () => {
    setPaymentAmount(activeDelivery?.estimatedPrice || deliveryData.estimatedPrice)
    setShowPaymentModal(true)
  }

  const handlePaymentContinue = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method")
      return
    }
    setShowPaymentModal(false)
    setShowSuccessModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowSuccessModal(false)
    setCurrentView("dashboard")
    // Reset state
    setActiveDelivery(null)
    setTimer(0)
    setDistance(0)
    setDeliveryData({
      customerName: "",
      customerPhone: "",
      packageDescription: "",
      packageWeight: "",
      deliveryType: "same-day",
      pickupAddress: "",
      dropoffAddress: "",
      recipientName: "",
      recipientPhone: "",
      estimatedPrice: 3000,
    })
  }

  const generateRecipientCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setRecipientCode(code)
  }

  // Filter deliveries
  const filteredDeliveries = deliveryHistory.filter((delivery) => {
    const matchesSearch =
      delivery.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customerPhone.includes(searchQuery) ||
      delivery.route.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || delivery.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesType = filterType === "all" || delivery.deliveryType.toLowerCase().includes(filterType.toLowerCase())
    const matchesPayment =
      filterPayment === "all" || delivery.paymentMethod.toLowerCase() === filterPayment.toLowerCase()
    const matchesRoute = filterRoute === "all" || delivery.route.toLowerCase().includes(filterRoute.toLowerCase())
    const matchesAmount = delivery.amount >= minAmount && delivery.amount <= maxAmount

    return matchesSearch && matchesStatus && matchesType && matchesPayment && matchesRoute && matchesAmount
  })

  const renderDashboard = () => (
    <div className="deliveries-dashboard">
      <div className="deliveries-header">
        <div>
          <h1>Delivery Dashboard</h1>
          <p>Manage and track all your deliveries</p>
        </div>
        <button className="btn-analytics" onClick={() => setCurrentView("analytics")}>
          View Analytics and Performance
        </button>
      </div>

      <div className="quick-actions-delivery">
        <button className="btn-primary-delivery" onClick={() => setCurrentView("new-delivery")}>
          Start New Delivery
        </button>
        <button className="btn-secondary-delivery">Receive Money</button>
        <button className="btn-secondary-delivery">View Analytics</button>
      </div>

      <div className="wallet-balance-delivery">
        <div>
          <span className="balance-label">Wallet Balance</span>
          <span className="balance-sublabel">Available Balance</span>
        </div>
        <div className="balance-amount">
          40,000 <span>UGX</span>
        </div>
      </div>

      <div className="time-filter-tabs">
        <button className="tab-btn active">Daily</button>
        <button className="tab-btn">Weekly</button>
        <button className="tab-btn">Monthly</button>
      </div>

      <div className="stats-grid-delivery">
        <div className="stat-card-delivery">
          <div className="stat-icon">🚚</div>
          <div className="stat-info">
            <span className="stat-label">Total Deliveries</span>
            <span className="stat-value">125</span>
            <span className="stat-change positive">+12.5%</span>
          </div>
        </div>
        <div className="stat-card-delivery dark">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">
              40,000 <small>UGX</small>
            </span>
            <span className="stat-change positive">+2.5%</span>
          </div>
        </div>
        <div className="stat-card-delivery green">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <span className="stat-label">Completed Deliveries</span>
            <span className="stat-value">102</span>
            <span className="stat-change positive">+20.5%</span>
          </div>
        </div>
        <div className="stat-card-delivery warning">
          <div className="stat-icon">⚠</div>
          <div className="stat-info">
            <span className="stat-label">Failed Deliveries</span>
            <span className="stat-value">23</span>
            <span className="stat-change negative">-2.5%</span>
          </div>
        </div>
      </div>

      <div className="ready-section">
        <div className="delivery-icon-large">🏍️</div>
        <h2>Ready to Deliver?</h2>
        <p>Start A New Delivery And Start Earning</p>
        <button className="btn-start-delivery" onClick={() => setCurrentView("new-delivery")}>
          Start New Delivery →
        </button>
      </div>

      <div className="delivery-activity">
        <div className="activity-header">
          <div>
            <h3>Delivery Activity</h3>
            <p>View Delivery summary</p>
          </div>
          <button className="btn-view-history" onClick={() => setCurrentView("history")}>
            View Delivery History
          </button>
        </div>

        <div className="activity-list">
          {deliveryHistory.slice(0, 3).map((delivery) => (
            <div key={delivery.id} className="activity-item">
              <div className="activity-route">
                <span className="route-label">Route(Pickup & Destination)</span>
                <span className="route-value">{delivery.route}</span>
              </div>
              <div className="activity-recipient">
                <span className="recipient-label">Recipient</span>
                <span className="recipient-value">{delivery.customerName}</span>
                <span className="recipient-phone">{delivery.customerPhone}</span>
              </div>
              <div className="activity-description">
                <span className="desc-label">Description</span>
                <span className="desc-value">Package Delivered To Recipient</span>
                <span className="desc-date">
                  {delivery.date} {delivery.time}
                </span>
              </div>
              <div className="activity-status">
                <span className="status-label">Status</span>
                <span className={`status-badge status-${delivery.status.toLowerCase()}`}>{delivery.status}</span>
              </div>
              <div className="activity-distance">
                <span className="distance-label">Distance</span>
                <span className="distance-value">{delivery.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderNewDelivery = () => (
    <div className="new-delivery-form">
      <div className="form-header-delivery">
        <h1>Start New Delivery 🟢</h1>
        <p>Create and manage new delivery request</p>
        <span className="status-badge-online">Online</span>
      </div>

      <div className="form-grid-delivery">
        <div className="form-section">
          <div className="section-header-delivery">
            <span className="section-icon">👤</span>
            <div>
              <h3>Customer Information</h3>
              <p>Enter Customer Details</p>
            </div>
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              placeholder="Sengendo Mark"
              value={deliveryData.customerName}
              onChange={(e) => setDeliveryData({ ...deliveryData, customerName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="phone-input">
              <span className="phone-prefix">+256</span>
              <input
                type="tel"
                placeholder="079 898 898"
                value={deliveryData.customerPhone}
                onChange={(e) => setDeliveryData({ ...deliveryData, customerPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header-delivery">
            <span className="section-icon">📦</span>
            <div>
              <h3>Package Details</h3>
              <p>Describe whats being delivered</p>
            </div>
            <select
              className="delivery-type-select"
              value={deliveryData.deliveryType}
              onChange={(e) => setDeliveryData({ ...deliveryData, deliveryType: e.target.value })}
            >
              <option value="same-day">Same-Day Delivery</option>
              <option value="express">Express</option>
              <option value="bulk">Bulk</option>
              <option value="standard">Standard</option>
            </select>
          </div>
          <div className="form-group">
            <label>Package Description</label>
            <input
              type="text"
              placeholder="Electronics, Fragile Items, etc..."
              value={deliveryData.packageDescription}
              onChange={(e) => setDeliveryData({ ...deliveryData, packageDescription: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Weight</label>
            <input
              type="text"
              placeholder="2.5 Kg"
              value={deliveryData.packageWeight}
              onChange={(e) => setDeliveryData({ ...deliveryData, packageWeight: e.target.value })}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header-delivery">
            <span className="section-icon">🚚</span>
            <div>
              <h3>Pickup and Dropoff Locations</h3>
              <p>Specify Pickup and Destination Addresses</p>
            </div>
          </div>
          <div className="form-group">
            <label>Pickup Address</label>
            <input
              type="text"
              placeholder="Pioneer Mall, Opp. Centenary Bank, Kampala"
              value={deliveryData.pickupAddress}
              onChange={(e) => setDeliveryData({ ...deliveryData, pickupAddress: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Dropoff Address</label>
            <input
              type="text"
              placeholder="UCU campus, Mukono"
              value={deliveryData.dropoffAddress}
              onChange={(e) => setDeliveryData({ ...deliveryData, dropoffAddress: e.target.value })}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header-delivery">
            <span className="section-icon">👤</span>
            <div>
              <h3>Receipient Information</h3>
              <p>Enter Receipient Details</p>
            </div>
          </div>
          <div className="form-group">
            <label>Receipient Name</label>
            <input
              type="text"
              placeholder="Magezi Wise"
              value={deliveryData.recipientName}
              onChange={(e) => setDeliveryData({ ...deliveryData, recipientName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="phone-input">
              <span className="phone-prefix">+256</span>
              <input
                type="tel"
                placeholder="075 800 898"
                value={deliveryData.recipientPhone}
                onChange={(e) => setDeliveryData({ ...deliveryData, recipientPhone: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-section-delivery">
        <div className="pricing-icon">💰</div>
        <div>
          <h3>Delivery Pricing</h3>
          <p>Set delivery rate</p>
        </div>
        <div className="pricing-display">
          <span className="price-label">Estimated Price</span>
          <span className="price-value">
            {deliveryData.estimatedPrice.toLocaleString()} <small>UGX</small>
          </span>
        </div>
      </div>

      <button className="btn-add-multiple">+ Add Multiple Delivery</button>

      <div className="form-actions-delivery">
        <button className="btn-cancel-delivery" onClick={() => setCurrentView("dashboard")}>
          Cancel
        </button>
        <button className="btn-receive-delivery" onClick={handleReceiveMoney}>
          Receive Money
        </button>
        <button className="btn-start-delivery-action" onClick={handleStartDelivery}>
          Start
        </button>
      </div>
    </div>
  )

  const renderActiveDelivery = () => (
    <div className="active-delivery-screen">
      <div className="active-delivery-header">
        <div>
          <h1>Active Delivery 🟢</h1>
          <p className="delivery-id">Delivery ID: {activeDelivery?.id}</p>
        </div>
        <span className="status-badge-progress">In Progress</span>
      </div>

      <div className="delivery-metrics">
        <div className="metric-card">
          <span className="metric-label">Elapsed Time</span>
          <span className="metric-value-large">{formatTime(timer)}</span>
          <span className="metric-sublabel">Time to deliver</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Distance</span>
          <span className="metric-value-large">
            {distance.toFixed(1)} <small>KM</small>
          </span>
          <span className="metric-sublabel">Distance Covered</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Delivery Price</span>
          <span className="metric-value-large">
            {activeDelivery?.estimatedPrice.toLocaleString()} <small>UGX</small>
          </span>
        </div>
      </div>

      <div className="delivery-details-section">
        <h3 className="section-title-yellow">Delivery Details</h3>

        <div className="details-grid">
          <div className="detail-row">
            <span className="detail-label">Pickup Location</span>
            <span className="detail-value">{activeDelivery?.pickupAddress}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Dropoff Location</span>
            <span className="detail-value">{activeDelivery?.dropoffAddress}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Recipient Name</span>
            <span className="detail-value">{activeDelivery?.recipientName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Recipient Contact</span>
            <span className="detail-value">+256 {activeDelivery?.recipientPhone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Package</span>
            <span className="detail-value">{activeDelivery?.packageDescription}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Weight</span>
            <span className="detail-value">{activeDelivery?.packageWeight}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Delivery Type</span>
            <span className="detail-value">{activeDelivery?.deliveryType}</span>
          </div>
        </div>
      </div>

      <button className="btn-end-delivery" onClick={handleEndDelivery}>
        End Delivery
      </button>
    </div>
  )

  const renderCompleteDelivery = () => (
    <div className="complete-delivery-screen">
      <div className="complete-header">
        <h1>Complete Delivery</h1>
        <p>Delivery ID: {activeDelivery?.id}</p>
        <span className="status-badge-ended">Ended</span>
      </div>

      <div className="complete-metrics">
        <div className="complete-metric">
          <span className="complete-metric-label">Timestamp Taken</span>
          <span className="complete-metric-value">{formatTime(timer)}</span>
        </div>
        <div className="complete-metric">
          <span className="complete-metric-label">Distance Travelled</span>
          <span className="complete-metric-value">{distance.toFixed(1)} KM</span>
        </div>
        <div className="complete-metric">
          <span className="complete-metric-label">Total Delivery Price</span>
          <span className="complete-metric-value">{activeDelivery?.estimatedPrice.toLocaleString()} UGX</span>
        </div>
      </div>

      <div className="capture-code-section">
        <h3 className="section-title-yellow">Capture Recipient Code</h3>
        <p>This code acts as proof of receipt of package delivered</p>

        <div className="code-actions">
          <button className="btn-request-code" onClick={generateRecipientCode}>
            Request Code
          </button>
          {recipientCode && (
            <div className="code-display">
              <span className="code-value">{recipientCode}</span>
              <span className="code-time">Code Captured at {new Date().toLocaleTimeString()}</span>
            </div>
          )}
          <button className="btn-change-number">Change Receipient Number</button>
        </div>
      </div>

      <div className="delivery-notes-section">
        <h3>Delivery Notes (Optional)</h3>
        <p>Add any additional Notes about delivery</p>
        <textarea
          placeholder="Enter delivery notes..."
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
        />
      </div>

      <div className="complete-actions">
        <button className="btn-cancel-delivery" onClick={() => setCurrentView("active-delivery")}>
          Cancel
        </button>
        <button className="btn-continue-delivery" onClick={handleReceiveMoney}>
          Continue
        </button>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="delivery-history-screen">
      <div className="history-header">
        <div>
          <h1>Delivery History</h1>
          <p>Manage and view all your deliveries</p>
        </div>
        <div className="history-header-actions">
          <button className="btn-export">📥 Export</button>
          <button className="btn-share">🔗 Share</button>
          <button className="btn-analytics" onClick={() => setCurrentView("analytics")}>
            View Analytics and Performance
          </button>
        </div>
      </div>

      <div className="history-layout">
        <aside className="history-sidebar">
          <div className="search-section">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Delivery ID, Phone, Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-history"
            />
          </div>

          <div className="filters-section">
            <h3>Filters</h3>

            <div className="filter-group">
              <label>Delivery status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Delivery Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="same-day">Same-Day Delivery</option>
                <option value="express">Express</option>
                <option value="bulk">Bulk</option>
                <option value="standard">Standard</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Payment Method</label>
              <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="mtn momo">MTN MoMo</option>
                <option value="airtel">Airtel Money</option>
                <option value="visa">Visa</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Routes</label>
              <select value={filterRoute} onChange={(e) => setFilterRoute(e.target.value)}>
                <option value="all">All Routes</option>
                <option value="kireka">Kireka - Banda</option>
                <option value="kampala">Kampala - Banda</option>
                <option value="gulu">Gulu - Nabuti</option>
              </select>
            </div>

            <div className="filter-group">
              <label>
                Amount Range: UGX {minAmount} - UGX {maxAmount.toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="15000"
                value={maxAmount}
                onChange={(e) => setMaxAmount(Number(e.target.value))}
                className="range-slider"
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="distance">Distance</option>
              </select>
              <select>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <button
              className="btn-clear-filters"
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
                setFilterType("all")
                setFilterPayment("all")
                setFilterRoute("all")
                setMinAmount(0)
                setMaxAmount(15000)
              }}
            >
              Clear All Filter
            </button>
          </div>
        </aside>

        <div className="history-content">
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Delivery ID</th>
                  <th>Customer & Contact</th>
                  <th>Route Pickup & Dropoff</th>
                  <th>Delivery Type</th>
                  <th>Distance & Duration</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>
                      <div className="delivery-id-cell">
                        <span className="id-main">{delivery.id}</span>
                        <span className="id-date">
                          {delivery.date} {delivery.time}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{delivery.customerName}</span>
                        <span className="customer-phone">{delivery.customerPhone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="route-cell">
                        <span className="route-name">{delivery.route}</span>
                        <span className="route-date">
                          {delivery.date} {delivery.time}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="delivery-type-badge">{delivery.deliveryType}</span>
                    </td>
                    <td>
                      <div className="distance-cell">
                        <span>{delivery.distance}</span>
                        <span>{delivery.duration}</span>
                      </div>
                    </td>
                    <td className="amount-cell">
                      <span className="amount-badge">UGX {delivery.amount.toLocaleString()}</span>
                      {delivery.status === "Completed" && <span className="manual-override">YES</span>}
                      {delivery.status !== "Completed" && <span className="manual-override no">NO</span>}
                    </td>
                    <td>
                      <span
                        className={`payment-badge payment-${delivery.paymentMethod.toLowerCase().replace(" ", "-")}`}
                      >
                        {delivery.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge-table status-${delivery.status.toLowerCase()}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-view-details">👁 View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>Showing {filteredDeliveries.length} deliveries</span>
            <div className="pagination-controls">
              <button disabled={currentPage === 1}>Previous</button>
              <button>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="analytics-screen">
      <div className="analytics-header">
        <div>
          <h1>Delivery Analytics and Performance</h1>
          <p>Real-time Delivery performance analytics</p>
        </div>
      </div>

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

      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div className="stat-icon-analytics">🚚</div>
          <span className="change-indicator positive">{analyticsData.revenueChange}</span>
          <div>
            <span className="stat-label-analytics">Total Deliveries</span>
            <span className="stat-value-analytics">{analyticsData.totalDeliveries}</span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon-analytics">📊</div>
          <span className="change-indicator positive">{analyticsData.revenueChange}</span>
          <div>
            <span className="stat-label-analytics">Total Revenue</span>
            <span className="stat-value-analytics">
              {analyticsData.totalRevenue.toLocaleString()} <small>UGX</small>
            </span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon-analytics">✅</div>
          <span className="change-indicator positive">{analyticsData.completedChange}</span>
          <div>
            <span className="stat-label-analytics">Completed Deliveries</span>
            <span className="stat-value-analytics">{analyticsData.completedDeliveries}</span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon-analytics">⚠️</div>
          <span className="change-indicator negative">{analyticsData.failedChange}</span>
          <div>
            <span className="stat-label-analytics">Failed Deliveries</span>
            <span className="stat-value-analytics">{analyticsData.failedDeliveries}</span>
          </div>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-card">
          <h3>Delivery Summary</h3>
          <p>Today's completed vs failed deliveries</p>
          <div className="bar-chart-placeholder">
            <div className="chart-bars">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bar-group">
                  <div className="bar bar-failed" style={{ height: `${Math.random() * 100 + 50}px` }}></div>
                  <div className="bar bar-completed" style={{ height: `${Math.random() * 150 + 100}px` }}></div>
                  <span className="bar-label">{day}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span>
                <span className="legend-color failed"></span> Failed
              </span>
              <span>
                <span className="legend-color completed"></span> Completed
              </span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Revenue By Delivery Type</h3>
          <p>Total Revenue Breakdown</p>
          <div className="pie-chart-section">
            <div className="pie-chart-placeholder">
              <svg viewBox="0 0 100 100" className="pie-chart">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#FEF08A"
                  strokeWidth="20"
                  strokeDasharray="100.53 151.32"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="20"
                  strokeDasharray="50.26 201.06"
                  strokeDashoffset="-100.53"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#0033CC"
                  strokeWidth="20"
                  strokeDasharray="50.26 201.06"
                  strokeDashoffset="-150.79"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="20"
                  strokeDasharray="50.26 201.06"
                  strokeDashoffset="-201.06"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="pie-labels">
                <span className="pie-label" style={{ top: "10%", left: "60%" }}>
                  20% Express
                </span>
                <span className="pie-label" style={{ top: "45%", right: "5%" }}>
                  20% Standard
                </span>
                <span className="pie-label" style={{ bottom: "10%", right: "20%" }}>
                  20% Bulk
                </span>
                <span className="pie-label" style={{ top: "40%", left: "5%" }}>
                  40% Same-Day
                </span>
              </div>
            </div>
            <div className="revenue-breakdown">
              <div className="revenue-item">
                <span className="revenue-type">Same-Day</span>
                <span className="revenue-amount">UGX 25,000</span>
              </div>
              <div className="revenue-item">
                <span className="revenue-type">Bulk</span>
                <span className="revenue-amount">UGX 5,000</span>
              </div>
              <div className="revenue-item">
                <span className="revenue-type">Standard</span>
                <span className="revenue-amount">UGX 15,000</span>
              </div>
              <div className="revenue-item">
                <span className="revenue-type">Express</span>
                <span className="revenue-amount">UGX 10,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-card wide">
          <h3>Peak Delivery Hours</h3>
          <p>Delivery Volume by Hour</p>
          <div className="heatmap-placeholder">
            <div className="heatmap-gradient"></div>
            <div className="heatmap-legend">
              <span>
                <span className="legend-dot morning"></span> Morning
              </span>
              <span>
                <span className="legend-dot afternoon"></span> Afternoon
              </span>
              <span>
                <span className="legend-dot evening"></span> Evening
              </span>
            </div>
            <div className="peak-stats">
              <div className="peak-stat">
                <span className="peak-label">Peak Hour</span>
                <span className="peak-value">12PM</span>
                <span className="peak-sublabel">49 Deliveries Made</span>
              </div>
              <div className="peak-stat">
                <span className="peak-label">Slowest Hour</span>
                <span className="peak-value">8AM</span>
                <span className="peak-sublabel">9 Deliveries Made</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card wide">
          <h3>Payment Method Trends</h3>
          <div className="line-chart-placeholder">
            <svg viewBox="0 0 400 200" className="line-chart">
              <polyline
                points="0,150 50,120 100,80 150,90 200,60 250,70 300,50 350,45 400,40"
                fill="none"
                stroke="#0033CC"
                strokeWidth="3"
              />
              <polyline
                points="0,180 50,160 100,150 150,145 200,140 250,135 300,130 350,125 400,120"
                fill="none"
                stroke="#FEF08A"
                strokeWidth="3"
              />
              <polyline
                points="0,190 50,185 100,175 150,165 200,160 250,155 300,150 350,145 400,140"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
              />
              <polyline
                points="0,195 50,193 100,190 150,188 200,185 250,183 300,180 350,178 400,175"
                fill="none"
                stroke="#000000"
                strokeWidth="3"
              />
            </svg>
            <div className="chart-legend">
              <span>
                <span className="legend-line cash"></span> Cash
              </span>
              <span>
                <span className="legend-line momo"></span> MTN MoMo
              </span>
              <span>
                <span className="legend-line split"></span> Split Pay
              </span>
              <span>
                <span className="legend-line qr"></span> QR Code
              </span>
            </div>
          </div>

          <div className="payment-cards-grid">
            <div className="payment-card-analytics cash-card">
              <span className="payment-card-label">Cash</span>
              <span className="payment-card-amount">
                50,000 <small>UGX</small>
              </span>
              <span className="payment-card-change positive">+12.5%</span>
            </div>
            <div className="payment-card-analytics momo-card">
              <span className="payment-card-label">MTN MoMo</span>
              <span className="payment-card-amount">
                180,000 <small>UGX</small>
              </span>
              <span className="payment-card-change positive">+22.5%</span>
            </div>
            <div className="payment-card-analytics split-card">
              <span className="payment-card-label">Split Pay</span>
              <span className="payment-card-amount">
                15,000 <small>UGX</small>
              </span>
              <span className="payment-card-change negative">-2.5%</span>
            </div>
            <div className="payment-card-analytics qr-card">
              <span className="payment-card-label">QR Code</span>
              <span className="payment-card-amount">
                40,000 <small>UGX</small>
              </span>
              <span className="payment-card-change negative">-2.5%</span>
            </div>
          </div>
        </div>
      </div>

      <button className="btn-back-to-dash" onClick={() => setCurrentView("dashboard")}>
        ← Back to Dashboard
      </button>
    </div>
  )

  const renderPaymentModal = () => (
    <div className={`payment-modal-overlay ${showPaymentModal ? "active" : ""}`}>
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>Receive Money</h2>
        </div>

        <div className="payment-modal-content">
          <div className="payment-amount-section">
            <label>Enter Cash Amount</label>
            <div className="amount-input-display">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="amount-input-large"
              />
              <span className="currency-label">UGX</span>
            </div>
          </div>

          <div className="payment-methods-section">
            <h3>Select Payment Method</h3>
            <div className="payment-methods-grid">
              <div
                className={`payment-method-option ${selectedPaymentMethod === "cash" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("cash")}
              >
                <div className="payment-method-box">CASH</div>
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "momo" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("momo")}
              >
                <img src="./assets/momo.png" alt="MTN MoMo" className="payment-logo" />
                {selectedPaymentMethod === "momo" && <span className="checkmark">✓</span>}
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "airtel" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("airtel")}
              >
                <img src="./assets/airtel.png" alt="Airtel Money" className="payment-logo" />
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "visa" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("visa")}
              >
                <img src="./assets/visa.png" alt="Visa" className="payment-logo" />
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "qr" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("qr")}
              >
                <div className="qr-code-box">
                  <div className="qr-placeholder">⊞</div>
                  <span>QR Code</span>
                </div>
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "split" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("split")}
              >
                <div className="split-payment-box">
                  <div className="split-icon">⊚⊚</div>
                  <span>Split Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-modal-actions">
          <button className="btn-cancel-payment" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </button>
          <button className="btn-continue-payment" onClick={handlePaymentContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )

  const renderSuccessModal = () => (
    <div className={`success-modal-overlay ${showSuccessModal ? "active" : ""}`}>
      <div className="success-modal">
        <h2>Delivery</h2>
        <div className="success-icon">✓</div>
        <h3>Payment Successful</h3>
        <div className="success-amount">UGX {paymentAmount.toLocaleString()}</div>
        {selectedPaymentMethod === "momo" && (
          <img src="./assets/momo.png" alt="MTN MoMo" className="success-payment-logo" />
        )}
        <p>Payment received successfully</p>
        <div className="success-actions">
          <button className="btn-done" onClick={handlePaymentSuccess}>
            Done
          </button>
          <button className="btn-start-delivery-success" onClick={handlePaymentSuccess}>
            Start Delivery
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="deliveries-container">
      {currentView === "dashboard" && renderDashboard()}
      {currentView === "new-delivery" && renderNewDelivery()}
      {currentView === "active-delivery" && renderActiveDelivery()}
      {currentView === "complete-delivery" && renderCompleteDelivery()}
      {currentView === "history" && renderHistory()}
      {currentView === "analytics" && renderAnalytics()}
      {renderPaymentModal()}
      {renderSuccessModal()}
    </div>
  )
}

export default Deliveries
