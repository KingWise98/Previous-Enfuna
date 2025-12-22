"use client"

import { useState, useEffect, useRef } from "react"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

export default function Trips() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [tripData, setTripData] = useState({
    pickup: "",
    destination: "",
    amount: 2000,
    startTime: null,
    duration: 0,
    distance: 0,
    stops: [],
    notes: "",
    tripType: "normal",
  })
  
  const [activeTrip, setActiveTrip] = useState(null)
  const [timer, setTimer] = useState(0)
  const [distance, setDistance] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [splitPayment, setSplitPayment] = useState({ cash: 0, digital: 0 })
  const [splitMethod, setSplitMethod] = useState("momo")
  const [showQR, setShowQR] = useState(false)
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [manualOverride, setManualOverride] = useState(false)
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const [amountDraft, setAmountDraft] = useState("")
  
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
  
  const [analyticsData, setAnalyticsData] = useState({
    daily: {
      totalTrips: 10,
      totalRevenue: 20000,
      completedTrips: 8,
      failedTrips: 2,
      revenueChange: "+12.5%",
      completedChange: "+20.5%",
      failedChange: "-2.5%",
    },
    weekly: {
      totalTrips: 45,
      totalRevenue: 85000,
      completedTrips: 38,
      failedTrips: 7,
      revenueChange: "+15.5%",
      completedChange: "+18.5%",
      failedChange: "-5.5%",
    },
    monthly: {
      totalTrips: 180,
      totalRevenue: 350000,
      completedTrips: 155,
      failedTrips: 25,
      revenueChange: "+22.5%",
      completedChange: "+25.5%",
      failedChange: "-8.5%",
    }
  })
  
  // Sample trip history data - matching your original data
  const [tripHistory] = useState([
    {
      id: "Trip-007",
      route: "Kireka - Banda",
      distance: "5.2km",
      duration: "12min",
      amount: 2000,
      paymentMethod: "Cash",
      status: "Completed",
      date: "2025-01-15",
      time: "09:30 AM",
      manualOverride: true,
    },
    {
      id: "Trip-008",
      route: "Gulu - Nakutt",
      distance: "8.7km",
      duration: "17min",
      amount: 8000,
      paymentMethod: "MTN MoMo",
      status: "Cancelled",
      date: "2025-01-15",
      time: "10:45 AM",
      manualOverride: false,
    },
    {
      id: "Trip-009",
      route: "Kampala - Banda",
      distance: "2.2km",
      duration: "14min",
      amount: 6000,
      paymentMethod: "MTN MoMo",
      status: "Completed",
      date: "2025-01-15",
      time: "11:20 AM",
      manualOverride: false,
    },
    {
      id: "Trip-010",
      route: "Kireka - Banda",
      distance: "4.5km",
      duration: "30min",
      amount: 3000,
      paymentMethod: "MTN MoMo",
      status: "Pending",
      date: "2025-01-15",
      time: "12:00 PM",
      manualOverride: false,
    },
  ])
  
  // Chart data for analytics
  const [chartData] = useState({
    tripSummary: [
      { day: "Mon", completed: 8, failed: 2 },
      { day: "Tue", completed: 10, failed: 1 },
      { day: "Wed", completed: 9, failed: 3 },
      { day: "Thu", completed: 12, failed: 0 },
      { day: "Fri", completed: 15, failed: 5 },
      { day: "Sat", completed: 11, failed: 4 },
      { day: "Sun", completed: 7, failed: 1 }
    ],
    revenueBreakdown: [
      { type: "Normal", amount: 15000, color: "#3b82f6", percentage: 40 },
      { type: "Express", amount: 10000, color: "#f59e0b", percentage: 25 },
      { type: "Group", amount: 8000, color: "#ef4444", percentage: 20 },
      { type: "Delivery", amount: 5000, color: "#10b981", percentage: 15 }
    ],
    paymentMethods: [
      { method: "Cash", trend: [120, 100, 90, 85, 80, 75, 70, 65, 60], color: "#3b82f6" },
      { method: "MTN MoMo", trend: [150, 140, 130, 125, 120, 115, 110, 105, 100], color: "#f59e0b" },
      { method: "Airtel Money", trend: [80, 85, 90, 95, 100, 105, 110, 115, 120], color: "#ef4444" },
      { method: "Visa", trend: [60, 65, 70, 75, 80, 85, 90, 95, 100], color: "#1e293b" }
    ]
  })
  
  const popularPickups = ["Mukono", "Kampala Central", "Kireka", "Banda", "Ntinda"]
  const popularDestinations = ["Kampala", "Entebbe", "Jinja", "Uganda House", "Nakasero"]
  
  const receiptRef = useRef(null)
  
  // Handle body scrolling when modals are open
  useEffect(() => {
    if (showPaymentModal || showSuccessModal || showReceipt) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [showPaymentModal, showSuccessModal, showReceipt])
  
  // Timer for active trip
  useEffect(() => {
    let interval
    if (activeTrip && currentView === "active-trip") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
        setDistance((prev) => prev + 0.01)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTrip, currentView])
  
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} min ${secs < 10 ? "0" : ""}${secs} sec`
  }
  
  const handleStartTrip = () => {
    if (!tripData.pickup || !tripData.destination) {
      alert("Please fill in pickup and destination")
      return
    }
    
    setActiveTrip({
      ...tripData,
      id: `TRP-${Date.now().toString().slice(-6)}`,
      startTime: new Date(),
    })
    setTimer(0)
    setDistance(0)
    setCurrentView("active-trip")
  }
  
  const handleEndTrip = () => {
    setCurrentView("complete-trip")
  }
  
  const handleReceiveMoney = () => {
    setPaymentAmount(activeTrip?.amount || tripData.amount)
    setShowPaymentModal(true)
  }
  
  const handleSplitPaymentUpdate = () => {
    const total = activeTrip?.amount || tripData.amount
    if (splitPayment.cash + splitPayment.digital !== total) {
      const remaining = total - splitPayment.cash
      setSplitPayment({ ...splitPayment, digital: remaining > 0 ? remaining : 0 })
    }
  }
  
  const handlePaymentContinue = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method")
      return
    }
    
    if (selectedPaymentMethod === "split" && (splitPayment.cash <= 0 || splitPayment.digital <= 0)) {
      alert("Please enter both cash and digital amounts for split payment")
      return
    }
    
    // Generate receipt
    const receipt = {
      id: activeTrip?.id || `REC-${Date.now().toString().slice(-6)}`,
      amount: paymentAmount,
      paymentMethod: selectedPaymentMethod,
      splitPayment: selectedPaymentMethod === "split" ? splitPayment : null,
      splitMethod: selectedPaymentMethod === "split" ? splitMethod : null,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      pickup: activeTrip?.pickup || tripData.pickup,
      destination: activeTrip?.destination || tripData.destination,
      tripType: activeTrip?.tripType || tripData.tripType,
      distance: distance.toFixed(1),
      duration: formatDuration(timer),
    }
    
    setReceiptData(receipt)
    setShowPaymentModal(false)
    setShowSuccessModal(true)
  }
  
  const handlePaymentSuccess = () => {
    setShowSuccessModal(false)
    setShowReceipt(true)
  }
  
  // Export functionality
  const exportToPDF = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = canvas.height * imgWidth / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`receipt-${receiptData.id}.pdf`)
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTrips)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trips")
    XLSX.writeFile(workbook, `trips-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTrips)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trips-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Share functionality
  const shareReceipt = async () => {
    if (receiptRef.current && navigator.share) {
      try {
        const canvas = await html2canvas(receiptRef.current)
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `receipt-${receiptData.id}.png`, { type: 'image/png' })
          
          await navigator.share({
            files: [file],
            title: 'Trip Receipt',
            text: `Receipt for trip ${receiptData.id} - Amount: UGX ${receiptData.amount.toLocaleString()}`
          })
        })
      } catch (err) {
        console.error('Error sharing:', err)
        alert('Sharing failed. You can download the PDF instead.')
      }
    } else {
      exportToPDF()
    }
  }
  
  const addStop = () => {
    setTripData((prev) => ({
      ...prev,
      stops: [...prev.stops, { location: "", amount: 0 }],
    }))
  }

  const removeStop = (index) => {
    setTripData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }))
  }
  
  const beginEditAmount = () => {
    setAmountDraft(String(tripData.amount ?? ""))
    setIsEditingAmount(true)
  }

  const commitAmount = () => {
    const normalized = String(amountDraft).replace(/,/g, "").trim()
    const parsed = Number(normalized)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setAmountDraft(String(tripData.amount ?? ""))
      setIsEditingAmount(false)
      return
    }
    setTripData({ ...tripData, amount: parsed })
    setIsEditingAmount(false)
  }
  
  // Filter trips
  const filteredTrips = tripHistory.filter((trip) => {
    const matchesSearch =
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || trip.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesType = filterType === "all" || true // Add type filter if needed
    const matchesPayment =
      filterPayment === "all" || trip.paymentMethod.toLowerCase() === filterPayment.toLowerCase()
    const matchesRoute = filterRoute === "all" || trip.route.toLowerCase().includes(filterRoute.toLowerCase())
    const matchesAmount = trip.amount >= minAmount && trip.amount <= maxAmount
    
    return matchesSearch && matchesStatus && matchesType && matchesPayment && matchesRoute && matchesAmount
  })
  
  const currentAnalytics = analyticsData[analyticsView]
  const maxTripValue = Math.max(...chartData.tripSummary.map(d => d.completed + d.failed))
  
  // Dashboard render function - matching Deliveries layout
  const renderDashboard = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">TRIP DASHBOARD</h1>
            <p className="expense-subtitle">Manage and track all your trips</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Rider</span>
            <div className="expense-user-badge">RK</div>
          </div>
        </div>
      </header>

      {/* Compact Stats Grid */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Trips</span>
            <span className="compact-stat-change positive">↑ +12.5%</span>
          </div>
          <div className="compact-stat-value">
            45
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Revenue</span>
            <span className="compact-stat-change positive">↑ +15.5%</span>
          </div>
          <div className="compact-stat-value">
            85,000<span className="compact-stat-currency">UGX</span>
          </div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Completed</span>
            <span className="compact-stat-change positive">↑ +18.5%</span>
          </div>
          <div className="compact-stat-value">
            38
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Failed</span>
            <span className="compact-stat-change negative">↓ -5.5%</span>
          </div>
          <div className="compact-stat-value">
            7
          </div>
        </div>
      </div>

      {/* Compact Action Bar */}
      <div className="compact-action-bar">
        <button 
          className="compact-btn btn-primary" 
          onClick={() => setCurrentView("new-trip")}
        >
          Start New Trip
        </button>
        <button 
          className="compact-btn btn-secondary" 
          onClick={handleReceiveMoney}
        >
          Receive Money
        </button>
        <button 
          className="compact-btn btn-secondary" 
          onClick={() => setCurrentView("history")}
        >
          View History
        </button>
        <button 
          className="compact-btn btn-secondary" 
          onClick={() => setCurrentView("analytics")}
        >
          View Analytics
        </button>
      </div>

      {/* Ready Section */}
      <div className="compact-section" style={{ margin: '0 0.75rem 1rem', textAlign: 'center' }}>
        <div className="delivery-icon-large" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏍️</div>
        <h2 className="compact-section-title">Ready to Ride?</h2>
        <p className="compact-section-subtitle">Start A New Trip And Start Earning</p>
        <button 
          className="compact-btn btn-primary" 
          style={{ marginTop: '0.5rem' }}
          onClick={() => setCurrentView("new-trip")}
        >
          Start New Trip →
        </button>
      </div>

      {/* Compact Content Grid */}
      <div className="compact-content-grid">
        {/* Recent Activity */}
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Recent Trip Activity</h2>
            <p className="compact-section-subtitle">Your latest trips</p>
          </div>

          <div className="compact-table-wrapper">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Route</th>
                  <th>Distance</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tripHistory.slice(0, 3).map((trip) => (
                  <tr key={trip.id}>
                    <td className="compact-trip-id">{trip.id}</td>
                    <td className="compact-route">{trip.route}</td>
                    <td className="compact-distance">{trip.distance}</td>
                    <td className="compact-amount">UGX {trip.amount.toLocaleString()}</td>
                    <td>
                      <span className={`compact-status ${trip.status.toLowerCase()}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="compact-breakdown-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Quick Stats</h2>
            <p className="compact-section-subtitle">Trip metrics</p>
          </div>

          <div className="compact-breakdown-list">
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Active Trips</span>
                <span className="compact-stat-value">2</span>
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Today's Earnings</span>
                <span className="compact-stat-value">UGX 15,000</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: '65%',
                    backgroundColor: '#f59e0b'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Success Rate</span>
                <span className="compact-stat-value">84%</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: '84%',
                    backgroundColor: '#10b981'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Avg Trip Time</span>
                <span className="compact-stat-value">18min</span>
              </div>
            </div>
          </div>

          <div className="compact-section-header" style={{ marginTop: '1rem' }}>
            <h2 className="compact-section-title">Wallet Balance</h2>
          </div>
          
          <div className="compact-wallet-balance">
            <div className="compact-wallet-amount">40,000<span className="compact-wallet-currency">UGX</span></div>
            <div className="compact-wallet-label">Available Balance</div>
          </div>
        </div>
      </div>
    </div>
  )
  
  // New Trip View
  const renderNewTrip = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">START NEW TRIP</h1>
            <p className="expense-subtitle">Create and manage new trip request</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Online</span>
            <div className="expense-user-badge" style={{ background: '#10b981' }}>🟢</div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="compact-content-grid">
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">Trip Details</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="compact-filter-select"
                value={tripData.tripType}
                onChange={(e) => setTripData({ ...tripData, tripType: e.target.value })}
              >
                <option value="normal">Normal Trip</option>
                <option value="express">Express</option>
                <option value="group">Group</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>

          <div className="compact-modal-content">
            <div className="compact-form-group">
              <label className="compact-form-label">Pickup Location *</label>
              <input
                type="text"
                className="compact-form-input"
                placeholder="Mukono"
                value={tripData.pickup}
                onChange={(e) => setTripData({ ...tripData, pickup: e.target.value })}
              />
              <div className="suggestions" style={{ marginTop: '0.5rem' }}>
                {popularPickups.map((loc) => (
                  <button
                    key={loc}
                    className="compact-suggestion-btn"
                    onClick={() => setTripData({ ...tripData, pickup: loc })}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="compact-form-group">
              <label className="compact-form-label">Destination *</label>
              <input
                type="text"
                className="compact-form-input"
                placeholder="Kampala"
                value={tripData.destination}
                onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
              />
              <div className="suggestions" style={{ marginTop: '0.5rem' }}>
                {popularDestinations.map((loc) => (
                  <button
                    key={loc}
                    className="compact-suggestion-btn"
                    onClick={() => setTripData({ ...tripData, destination: loc })}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="compact-form-group">
              <label className="compact-form-label">Trip Amount (UGX)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isEditingAmount ? (
                  <>
                    <input
                      type="text"
                      className="compact-form-input"
                      style={{ flex: 1 }}
                      value={amountDraft}
                      onChange={(e) => setAmountDraft(e.target.value)}
                      onBlur={commitAmount}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitAmount()
                        if (e.key === 'Escape') {
                          setIsEditingAmount(false)
                          setAmountDraft(String(tripData.amount ?? ""))
                        }
                      }}
                      autoFocus
                    />
                    <span className="compact-form-currency">UGX</span>
                  </>
                ) : (
                  <>
                    <div className="compact-amount-display">{tripData.amount.toLocaleString()}</div>
                    <span className="compact-form-currency">UGX</span>
                    <button 
                      className="compact-btn btn-secondary" 
                      style={{ marginLeft: 'auto' }}
                      onClick={beginEditAmount}
                    >
                      Change
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Intermediate Stops */}
            {tripData.stops.length > 0 && (
              <div className="compact-form-group">
                <label className="compact-form-label">Intermediate Stops</label>
                {tripData.stops.map((stop, index) => (
                  <div key={index} className="compact-stop-row">
                    <input
                      type="text"
                      className="compact-form-input"
                      style={{ flex: 2 }}
                      placeholder="Stop location"
                      value={stop.location}
                      onChange={(e) => {
                        const newStops = [...tripData.stops]
                        newStops[index].location = e.target.value
                        setTripData({ ...tripData, stops: newStops })
                      }}
                    />
                    <input
                      type="number"
                      className="compact-form-input"
                      style={{ flex: 1 }}
                      placeholder="Amount"
                      value={stop.amount}
                      onChange={(e) => {
                        const newStops = [...tripData.stops]
                        newStops[index].amount = Number(e.target.value)
                        setTripData({ ...tripData, stops: newStops })
                      }}
                    />
                    <button 
                      className="compact-btn btn-secondary" 
                      onClick={() => removeStop(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="compact-form-group">
              <label className="compact-form-label">Trip Notes (Optional)</label>
              <textarea
                className="compact-form-textarea"
                placeholder="Delivery instructions, Multistop info etc..."
                value={tripData.notes}
                onChange={(e) => setTripData({ ...tripData, notes: e.target.value })}
                rows="3"
              />
            </div>

            <div className="compact-modal-actions">
              <button 
                className="compact-modal-btn btn-secondary" 
                onClick={() => {
                  setCurrentView("dashboard")
                  setTripData({
                    pickup: "",
                    destination: "",
                    amount: 2000,
                    startTime: null,
                    duration: 0,
                    distance: 0,
                    stops: [],
                    notes: "",
                    tripType: "normal",
                  })
                }}
              >
                Cancel
              </button>
              <button 
                className="compact-modal-btn btn-secondary"
                onClick={handleReceiveMoney}
              >
                Receive Money
              </button>
              <button 
                className="compact-modal-btn btn-primary"
                onClick={handleStartTrip}
              >
                Start Trip
              </button>
            </div>
          </div>
        </div>
      </div>

      <button 
        className="compact-btn btn-secondary" 
        style={{ margin: '0.75rem', width: 'calc(100% - 1.5rem)' }}
        onClick={addStop}
      >
        + Add Intermediate Stop
      </button>
    </div>
  )
  
  // Active Trip View
  const renderActiveTrip = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">ACTIVE TRIP</h1>
            <p className="expense-subtitle">Trip ID: {activeTrip?.id}</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name" style={{ color: '#f59e0b' }}>In Progress</span>
            <div className="expense-user-badge" style={{ background: '#f59e0b' }}>⏳</div>
          </div>
        </div>
      </header>

      {/* Compact Stats Grid */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Elapsed Time</span>
          </div>
          <div className="compact-stat-value">
            {formatTime(timer)}
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Distance</span>
          </div>
          <div className="compact-stat-value">
            {distance.toFixed(1)}<span className="compact-stat-currency">KM</span>
          </div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Trip Price</span>
          </div>
          <div className="compact-stat-value">
            {activeTrip?.amount?.toLocaleString()}<span className="compact-stat-currency">UGX</span>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="compact-content-grid">
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">Trip Details</h2>
          </div>

          <div className="compact-delivery-details">
            <div className="compact-detail-row">
              <span className="compact-detail-label">Pickup Location</span>
              <span className="compact-detail-value">{activeTrip?.pickup}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Destination</span>
              <span className="compact-detail-value">{activeTrip?.destination}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Trip Type</span>
              <span className="compact-detail-value">{activeTrip?.tripType}</span>
            </div>
            {activeTrip?.stops?.map((stop, index) => (
              <div key={index} className="compact-detail-row">
                <span className="compact-detail-label">Stop {index + 1}</span>
                <span className="compact-detail-value">{stop.location} - UGX {stop.amount}</span>
              </div>
            ))}
            {activeTrip?.notes && (
              <div className="compact-detail-row">
                <span className="compact-detail-label">Notes</span>
                <span className="compact-detail-value">{activeTrip?.notes}</span>
              </div>
            )}
          </div>

          <div className="compact-modal-actions">
            <button 
              className="compact-modal-btn btn-secondary" 
              onClick={() => {
                setCurrentView("new-trip")
                setActiveTrip(null)
              }}
            >
              Edit Trip
            </button>
            <button 
              className="compact-modal-btn btn-primary"
              onClick={handleEndTrip}
            >
              End Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  
  // Complete Trip View
  const renderCompleteTrip = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">COMPLETE TRIP</h1>
            <p className="expense-subtitle">Trip ID: {activeTrip?.id}</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name" style={{ color: '#64748b' }}>Ended</span>
            <div className="expense-user-badge" style={{ background: '#64748b' }}>✓</div>
          </div>
        </div>
      </header>

      {/* Compact Stats Grid */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Time Taken</span>
          </div>
          <div className="compact-stat-value">
            {formatTime(timer)}
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Distance</span>
          </div>
          <div className="compact-stat-value">
            {distance.toFixed(1)}<span className="compact-stat-currency">KM</span>
          </div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Trip Price</span>
          </div>
          <div className="compact-stat-value">
            {activeTrip?.amount?.toLocaleString()}<span className="compact-stat-currency">UGX</span>
          </div>
        </div>
      </div>

      {/* Complete Trip Content */}
      <div className="compact-content-grid">
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">Trip Summary</h2>
            <p className="compact-section-subtitle">Review trip details before payment</p>
          </div>

          <div className="compact-delivery-details">
            <div className="compact-detail-row">
              <span className="compact-detail-label">From</span>
              <span className="compact-detail-value">{activeTrip?.pickup}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">To</span>
              <span className="compact-detail-value">{activeTrip?.destination}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Duration</span>
              <span className="compact-detail-value">{formatDuration(timer)}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Distance</span>
              <span className="compact-detail-value">{distance.toFixed(1)} km</span>
            </div>
          </div>

          <div className="compact-form-group" style={{ marginTop: '1rem' }}>
            <label className="compact-form-label">
              <input
                type="checkbox"
                checked={manualOverride}
                onChange={(e) => setManualOverride(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Manual Amount Override
            </label>
          </div>

          <div className="compact-modal-actions">
            <button 
              className="compact-modal-btn btn-secondary" 
              onClick={() => setCurrentView("active-trip")}
            >
              Back
            </button>
            <button 
              className="compact-modal-btn btn-primary"
              onClick={handleReceiveMoney}
            >
              Receive Money
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  
  // History View
  const renderHistory = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">TRIP HISTORY</h1>
            <p className="expense-subtitle">Manage and view all your trips</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">History View</span>
            <div className="expense-user-badge">HV</div>
          </div>
        </div>
      </header>

      {/* History Filters */}
      <div className="compact-content-grid">
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">All Trips</h2>
            <div className="compact-filters">
              <input
                type="text"
                placeholder="Search trips..."
                className="compact-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="compact-filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
              <select
                className="compact-filter-select"
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="cash">Cash</option>
                <option value="mtn momo">MTN MoMo</option>
                <option value="airtel money">Airtel Money</option>
                <option value="visa">Visa</option>
              </select>
              <button 
                className="compact-btn btn-secondary"
                style={{ minWidth: 'auto', padding: '0.375rem' }}
                onClick={() => {
                  setSearchQuery("")
                  setFilterStatus("all")
                  setFilterType("all")
                  setFilterPayment("all")
                  setFilterRoute("all")
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="compact-table-wrapper">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Route</th>
                  <th>Distance</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip.id}>
                    <td className="compact-trip-id">{trip.id}</td>
                    <td className="compact-route">{trip.route}</td>
                    <td className="compact-distance">{trip.distance}</td>
                    <td className="compact-duration">{trip.duration}</td>
                    <td className="compact-amount">UGX {trip.amount.toLocaleString()}</td>
                    <td>
                      <span className={`compact-status ${trip.status.toLowerCase()}`}>
                        {trip.status}
                      </span>
                      {trip.manualOverride && (
                        <span className="compact-manual-badge">Manual</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="compact-modal-actions">
            <button 
              className="compact-modal-btn btn-secondary"
              onClick={() => setCurrentView("dashboard")}
            >
              Back to Dashboard
            </button>
            <button 
              className="compact-modal-btn btn-secondary"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
            <button 
              className="compact-modal-btn btn-primary"
              onClick={() => setCurrentView("analytics")}
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  
  // Analytics View
  const renderAnalytics = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">TRIP ANALYTICS</h1>
            <p className="expense-subtitle">Real-time trip performance analytics</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Analytics</span>
            <div className="expense-user-badge">TA</div>
          </div>
        </div>
      </header>

      {/* Analytics Tabs */}
      <div className="compact-action-bar">
        <button 
          className={`compact-btn ${analyticsView === "daily" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setAnalyticsView("daily")}
        >
          Daily
        </button>
        <button 
          className={`compact-btn ${analyticsView === "weekly" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setAnalyticsView("weekly")}
        >
          Weekly
        </button>
        <button 
          className={`compact-btn ${analyticsView === "monthly" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setAnalyticsView("monthly")}
        >
          Monthly
        </button>
      </div>

      {/* Compact Stats Grid */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Trips</span>
            <span className="compact-stat-change positive">{currentAnalytics.revenueChange}</span>
          </div>
          <div className="compact-stat-value">
            {currentAnalytics.totalTrips}
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Revenue</span>
            <span className="compact-stat-change positive">{currentAnalytics.revenueChange}</span>
          </div>
          <div className="compact-stat-value">
            {currentAnalytics.totalRevenue.toLocaleString()}<span className="compact-stat-currency">UGX</span>
          </div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Completed</span>
            <span className="compact-stat-change positive">{currentAnalytics.completedChange}</span>
          </div>
          <div className="compact-stat-value">
            {currentAnalytics.completedTrips}
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Failed</span>
            <span className="compact-stat-change negative">{currentAnalytics.failedChange}</span>
          </div>
          <div className="compact-stat-value">
            {currentAnalytics.failedTrips}
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="compact-content-grid">
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Trip Summary</h2>
            <p className="compact-section-subtitle">Completed vs failed trips</p>
          </div>

          <div className="compact-breakdown-list">
            {chartData.tripSummary.map((data) => (
              <div key={data.day} className="compact-breakdown-item">
                <div className="compact-breakdown-info">
                  <span className="compact-breakdown-name">{data.day}</span>
                  <span className="compact-breakdown-percentage">{data.completed} completed</span>
                </div>
                <div className="compact-progress-bar">
                  <div
                    className="compact-progress-fill"
                    style={{
                      width: `${(data.completed / maxTripValue) * 100}%`,
                      backgroundColor: '#10b981'
                    }}
                  />
                  <div
                    className="compact-progress-fill"
                    style={{
                      width: `${(data.failed / maxTripValue) * 100}%`,
                      backgroundColor: '#ef4444',
                      position: 'absolute',
                      left: `${(data.completed / maxTripValue) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="compact-breakdown-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Revenue Breakdown</h2>
            <p className="compact-section-subtitle">By trip type</p>
          </div>

          <div className="compact-breakdown-list">
            {chartData.revenueBreakdown.map((item) => (
              <div key={item.type} className="compact-breakdown-item">
                <div className="compact-breakdown-info">
                  <span className="compact-breakdown-name">{item.type}</span>
                  <span className="compact-breakdown-percentage">{item.percentage}%</span>
                </div>
                <div className="compact-progress-bar">
                  <div
                    className="compact-progress-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <div className="compact-breakdown-amount">UGX {item.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        className="compact-btn btn-primary" 
        style={{ margin: '0.75rem', width: 'calc(100% - 1.5rem)' }}
        onClick={() => setCurrentView("dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  )
  
  // Enhanced Payment Modal with all options
  const renderPaymentModal = () => (
    <div className={`compact-modal-overlay ${showPaymentModal ? "active" : ""}`}>
      <div className="compact-modal">
        {/* Modal Header */}
        <div className="compact-modal-header">
          <h2>RECEIVE PAYMENT</h2>
          <div className="compact-modal-steps">
            <span className="compact-step active">1</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="compact-modal-content">
          <div className="compact-form-group">
            <label className="compact-form-label">Enter Amount (UGX)</label>
            <input
              type="number"
              className="compact-form-input"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              min="0"
            />
          </div>

          <div className="compact-form-group">
            <label className="compact-form-label">Select Payment Method</label>
            <div className="compact-category-grid">
              <button
                type="button"
                className={`compact-category-btn ${selectedPaymentMethod === "cash" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("cash")}
              >
                💵 Cash
              </button>
              <button
                type="button"
                className={`compact-category-btn ${selectedPaymentMethod === "momo" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("momo")}
              >
                <span className="payment-icon-momo">MTN</span> MoMo
              </button>
              <button
                type="button"
                className={`compact-category-btn ${selectedPaymentMethod === "airtel" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("airtel")}
              >
                <span className="payment-icon-airtel">Airtel</span> Money
              </button>
              <button
                type="button"
                className={`compact-category-btn ${selectedPaymentMethod === "visa" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("visa")}
              >
                💳 VISA
              </button>
              <button
                type="button"
                className={`compact-category-btn ${selectedPaymentMethod === "qr" ? "selected" : ""}`}
                onClick={() => {
                  setSelectedPaymentMethod("qr")
                  setShowQR(true)
                }}
              >
                ▦ QR Code
              </button>
              <button
                type="button"
                className={`compact-category-btn ${selectedPaymentMethod === "split" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("split")}
              >
                ◎◎ Split Payment
              </button>
            </div>
          </div>

          {/* Split Payment Details */}
          {selectedPaymentMethod === "split" && (
            <div className="compact-split-payment">
              <div className="compact-form-group">
                <label className="compact-form-label">Cash Amount (UGX)</label>
                <input
                  type="number"
                  className="compact-form-input"
                  value={splitPayment.cash}
                  onChange={(e) => {
                    setSplitPayment({ ...splitPayment, cash: Number(e.target.value) })
                  }}
                  onBlur={handleSplitPaymentUpdate}
                  min="0"
                  max={paymentAmount}
                />
              </div>
              
              <div className="compact-form-group">
                <label className="compact-form-label">Digital Amount (UGX)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    className="compact-form-input"
                    value={splitPayment.digital}
                    onChange={(e) => {
                      setSplitPayment({ ...splitPayment, digital: Number(e.target.value) })
                    }}
                    onBlur={handleSplitPaymentUpdate}
                    min="0"
                    max={paymentAmount}
                  />
                  <select
                    className="compact-filter-select"
                    value={splitMethod}
                    onChange={(e) => setSplitMethod(e.target.value)}
                  >
                    <option value="momo">MTN MoMo</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="visa">Visa</option>
                  </select>
                </div>
              </div>
              
              <div className="compact-total-amount">
                Total: UGX {(splitPayment.cash + splitPayment.digital).toLocaleString()}
              </div>
            </div>
          )}

          {/* QR Code Display */}
          {selectedPaymentMethod === "qr" && showQR && (
            <div className="compact-qr-display">
              <div className="compact-qr-box">
                <div className="compact-qr-placeholder">
                  [QR Code Display]
                </div>
                <div className="compact-qr-instruction">
                  Scan this QR code to complete payment
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="compact-modal-actions">
          <button 
            className="compact-modal-btn btn-secondary" 
            onClick={() => {
              setShowPaymentModal(false)
              setShowQR(false)
              setSelectedPaymentMethod("")
              setSplitPayment({ cash: 0, digital: 0 })
            }}
          >
            Cancel
          </button>
          <button 
            className="compact-modal-btn btn-primary"
            onClick={handlePaymentContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
  
  // Success Modal
  const renderSuccessModal = () => (
    <div className={`compact-modal-overlay ${showSuccessModal ? "active" : ""}`}>
      <div className="compact-modal">
        {/* Modal Header */}
        <div className="compact-modal-header">
          <h2>TRIP COMPLETE</h2>
          <div className="compact-modal-steps">
            <span className="compact-step active">1</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="compact-modal-content" style={{ textAlign: 'center' }}>
          <div className="success-icon" style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}>✓</div>
          <h3>Payment Successful</h3>
          <div className="compact-stat-value" style={{ fontSize: '2rem', margin: '1rem 0' }}>
            UGX {paymentAmount.toLocaleString()}
          </div>
          <p>Payment received via {selectedPaymentMethod === "split" ? "Split Payment" : selectedPaymentMethod}</p>
          {receiptData?.splitPayment && (
            <div className="compact-split-summary">
              <div>Cash: UGX {receiptData.splitPayment.cash.toLocaleString()}</div>
              <div>Digital ({receiptData.splitMethod}): UGX {receiptData.splitPayment.digital.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="compact-modal-actions">
          <button 
            className="compact-modal-btn btn-primary"
            onClick={handlePaymentSuccess}
          >
            View Receipt
          </button>
          <button 
            className="compact-modal-btn btn-secondary"
            onClick={() => {
              setShowSuccessModal(false)
              setCurrentView("dashboard")
              setActiveTrip(null)
              setTripData({
                pickup: "",
                destination: "",
                amount: 2000,
                startTime: null,
                duration: 0,
                distance: 0,
                stops: [],
                notes: "",
                tripType: "normal",
              })
            }}
          >
            New Trip
          </button>
        </div>
      </div>
    </div>
  )
  
  // Detailed Receipt
  const renderReceipt = () => (
    <div className="compact-modal-overlay active">
      <div className="compact-modal">
        {/* Modal Header */}
        <div className="compact-modal-header">
          <h2>TRIP RECEIPT</h2>
          <div className="compact-modal-steps">
            <span className="compact-step active">1</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="compact-modal-content">
          <div ref={receiptRef} style={{ textAlign: 'left', padding: '1rem', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '1rem' }}>Trip Receipt</h2>
            
            <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Receipt ID:</span>
                <span>{receiptData?.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Date:</span>
                <span>{receiptData?.date} {receiptData?.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>Trip Type:</span>
                <span>{receiptData?.tripType}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Trip Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>From:</span>
                <span>{receiptData?.pickup}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>To:</span>
                <span>{receiptData?.destination}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Distance:</span>
                <span>{receiptData?.distance} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Duration:</span>
                <span>{receiptData?.duration}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Payment Information</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Payment Method:</span>
                <span style={{ fontWeight: '600' }}>{receiptData?.paymentMethod === "split" ? "Split Payment" : receiptData?.paymentMethod}</span>
              </div>
              
              {receiptData?.splitPayment ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Cash Amount:</span>
                    <span>UGX {receiptData.splitPayment.cash.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Digital Amount ({receiptData.splitMethod}):</span>
                    <span>UGX {receiptData.splitPayment.digital.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingTop: '0.25rem', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: '600' }}>Total Amount:</span>
                    <span style={{ fontWeight: '600' }}>UGX {receiptData?.amount?.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600' }}>Amount:</span>
                  <span style={{ fontWeight: '600' }}>UGX {receiptData?.amount?.toLocaleString()}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>Payment Status:</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>Paid</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed #cbd5e1' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Thank you for riding with us!</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Receipt Code: TR{Date.now().toString().slice(-8)}</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="compact-modal-actions">
          <button 
            className="compact-modal-btn btn-secondary"
            onClick={exportToPDF}
          >
            Save as PDF
          </button>
          <button 
            className="compact-modal-btn btn-secondary"
            onClick={shareReceipt}
          >
            Share Receipt
          </button>
          <button 
            className="compact-modal-btn btn-primary"
            onClick={() => {
              setShowReceipt(false)
              setCurrentView("dashboard")
              setActiveTrip(null)
              setTripData({
                pickup: "",
                destination: "",
                amount: 2000,
                startTime: null,
                duration: 0,
                distance: 0,
                stops: [],
                notes: "",
                tripType: "normal",
              })
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
  
  return (
    <>
      {currentView === "dashboard" && renderDashboard()}
      {currentView === "new-trip" && renderNewTrip()}
      {currentView === "active-trip" && renderActiveTrip()}
      {currentView === "complete-trip" && renderCompleteTrip()}
      {currentView === "history" && renderHistory()}
      {currentView === "analytics" && renderAnalytics()}
      {showPaymentModal && renderPaymentModal()}
      {showSuccessModal && renderSuccessModal()}
      {showReceipt && renderReceipt()}
      
      <style jsx>{`
        /* Trip Specific Styles */
        .compact-trip-id {
          font-size: 0.7rem;
          font-weight: 600;
          color: #3b82f6;
          font-family: 'Courier New', monospace;
        }

        .compact-route {
          font-size: 0.7rem;
          color: #1e293b;
          font-weight: 500;
        }

        .compact-distance {
          font-size: 0.7rem;
          color: #475569;
          font-weight: 500;
        }

        .compact-duration {
          font-size: 0.7rem;
          color: #64748b;
        }

        .compact-manual-badge {
          display: inline-block;
          margin-left: 0.25rem;
          padding: 0.1rem 0.3rem;
          background: #fef3c7;
          color: #92400e;
          border-radius: 3px;
          font-size: 0.6rem;
          font-weight: 600;
        }

        .compact-amount-display {
          font-size: 1.2rem;
          font-weight: 700;
          color: #3b82f6;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .compact-form-currency {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
        }

        .compact-stop-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          align-items: center;
        }

        .compact-suggestion-btn {
          padding: 0.25rem 0.5rem;
          background: #f0f1ff;
          border: 1px solid #dbeafe;
          border-radius: 4px;
          color: #3b82f6;
          font-size: 0.7rem;
          cursor: pointer;
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .compact-suggestion-btn:hover {
          background: #dbeafe;
        }

        .payment-icon-momo {
          color: #f59e0b;
          font-weight: 700;
        }

        .payment-icon-airtel {
          color: #ef4444;
          font-weight: 700;
        }

        .compact-split-payment {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          margin-top: 1rem;
        }

        .compact-total-amount {
          text-align: center;
          font-weight: 700;
          color: #1e40af;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px dashed #cbd5e1;
        }

        .compact-qr-display {
          text-align: center;
          margin-top: 1rem;
        }

        .compact-qr-box {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .compact-qr-placeholder {
          width: 150px;
          height: 150px;
          margin: 0 auto 1rem;
          background: linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 25%, #e5e7eb 50%, #f3f4f6 50%, #f3f4f6 75%, #e5e7eb 75%);
          background-size: 20px 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 0.875rem;
        }

        .compact-qr-instruction {
          font-size: 0.875rem;
          color: #475569;
          margin-top: 0.5rem;
        }

        .compact-split-summary {
          background: #f0f9ff;
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 1rem;
          font-size: 0.875rem;
        }

        .compact-split-summary div {
          margin: 0.25rem 0;
        }

        /* Trip-specific status colors */
        .compact-status.completed {
          background: #d1fae5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .compact-status.cancelled {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .compact-status.pending {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .compact-content-grid > .compact-table-section {
            grid-column: span 1;
          }
          
          .compact-filters {
            flex-direction: column;
          }
          
          .compact-stop-row {
            flex-direction: column;
          }
          
          .compact-split-payment {
            padding: 0.75rem;
          }
        }
      `}</style>
    </>
  )
}