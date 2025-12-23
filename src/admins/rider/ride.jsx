"use client"

import { useState, useEffect, useRef } from "react"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

export default function Trips() {
  const [currentView, setCurrentView] = useState("new-trip")
  const [activeTab, setActiveTab] = useState("new-trip")
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
  
  // Sample trip history data
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
      { type: "Normal", amount: 15000, color: "#002AFE", percentage: 40 },
      { type: "Express", amount: 10000, color: "#FEF132", percentage: 25 },
      { type: "Group", amount: 8000, color: "#ef4444", percentage: 20 },
      { type: "Delivery", amount: 5000, color: "#10b981", percentage: 15 }
    ],
    paymentMethods: [
      { method: "Cash", trend: [120, 100, 90, 85, 80, 75, 70, 65, 60], color: "#002AFE" },
      { method: "MTN MoMo", trend: [150, 140, 130, 125, 120, 115, 110, 105, 100], color: "#FEF132" },
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
  
  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="tab-navigation">
       <button 
        className={`tab-btn ${activeTab === "new-trip" ? "active" : ""}`}
        onClick={() => {
          setActiveTab("new-trip")
          setCurrentView("new-trip")
        }}
      >
        New Trip
      </button>
      <button 
        className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
        onClick={() => {
          setActiveTab("dashboard")
          setCurrentView("dashboard")
        }}
      >
        Dashboard
      </button>
     
      <button 
        className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
        onClick={() => {
          setActiveTab("history")
          setCurrentView("history")
        }}
      >
        History
      </button>
      
    </div>
  )
  
  // Dashboard render function
  const renderDashboard = () => (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">TRIP DASHBOARD</h1>
        </div>

        <TabNavigation />

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Trips</div>
            <h3 className="stat-value">45</h3>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <h3 className="stat-value">85,000</h3>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <h3 className="stat-value">38</h3>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <h3 className="stat-value">7</h3>
          </div>
        </div>

        {/* Commission Overview */}
        <div className="commission-overview">
          <div className="section-title">Trip Overview</div>
          <div className="commission-grid">
            <div className="commission-card revenue">
              <div className="commission-label">Today's Revenue</div>
              <h4 className="commission-amount">UGX 15,000</h4>
            </div>
            <div className="commission-card today">
              <div className="commission-label">Today's Trips</div>
              <h4 className="commission-amount">10</h4>
            </div>
            <div className="commission-card weekly">
              <div className="commission-label">Success Rate</div>
              <h4 className="commission-amount">84%</h4>
            </div>
            <div className="commission-card lifetime">
              <div className="commission-label">Avg. Time</div>
              <h4 className="commission-amount">18min</h4>
            </div>
            <div className="commission-card pending">
              <div className="commission-label">Active Trips</div>
              <h4 className="commission-amount">2</h4>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <button 
            className="activate-code-btn" 
            onClick={() => setCurrentView("new-trip")}
          >
            Start New Trip
          </button>
          <button 
            className="withdraw-commission-btn"
            onClick={handleReceiveMoney}
          >
            Receive Money
          </button>
        </div>

        {/* Recent Activity */}
        <div className="commission-engine">
          <div className="section-title">Recent Trip Activity</div>
          <div className="commission-ledger">
            {tripHistory.slice(0, 4).map((trip) => (
              <div key={trip.id} className="ledger-entry">
                <div className="entry-info">
                  <div className="entry-type">{trip.id} - {trip.route}</div>
                  <div className="entry-time">{trip.time}</div>
                </div>
                <div className="entry-amount" style={{ 
                  color: trip.status === "Completed" ? "#2e7d32" : 
                         trip.status === "Cancelled" ? "#c62828" : "#f57c00"
                }}>
                  UGX {trip.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="payout-section">
          <div className="balance-card">
            <div className="balance-label">Wallet Balance</div>
            <h2 className="balance-amount">40,000<span style={{ fontSize: '16px', marginLeft: '4px' }}>UGX</span></h2>
          </div>
          <button 
            className="withdraw-btn-large"
            onClick={() => setCurrentView("history")}
          >
            View All Trips →
          </button>
        </div>
      </div>
    </div>
  )
  
  // New Trip View
  const renderNewTrip = () => (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">START NEW TRIP</h1>
        </div>

        <TabNavigation />

        <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          <div className="activate-screen">
            <h2 className="activate-title">Start Trip</h2>
            <p className="activate-subtitle">Create and manage your trip details</p>

            <div className="promo-status">
              <div className="status-title">Trip Details</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                <span className={`status-badge ${activeTrip ? "valid" : "invalid"}`}>
                  {activeTrip ? "Active" : "Inactive"}
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  Ready to start earning
                </span>
              </div>
            </div>

            <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #bbdefb' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    className="promo-input"
                    placeholder="Mukono"
                    value={tripData.pickup}
                    onChange={(e) => setTripData({ ...tripData, pickup: e.target.value })}
                    style={{ width: '100%' }}
                  />
                  <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {popularPickups.map((loc) => (
                      <button
                        key={loc}
                        style={{
                          padding: '4px 8px',
                          background: '#f0f4ff',
                          border: '1px solid #002AFE',
                          borderRadius: '4px',
                          color: '#002AFE',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setTripData({ ...tripData, pickup: loc })}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                    Destination *
                  </label>
                  <input
                    type="text"
                    className="promo-input"
                    placeholder="Kampala"
                    value={tripData.destination}
                    onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                    style={{ width: '100%' }}
                  />
                  <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {popularDestinations.map((loc) => (
                      <button
                        key={loc}
                        style={{
                          padding: '4px 8px',
                          background: '#f0f4ff',
                          border: '1px solid #002AFE',
                          borderRadius: '4px',
                          color: '#002AFE',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setTripData({ ...tripData, destination: loc })}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                  Trip Amount (UGX)
                </label>
                <div className="promo-input-section">
                  <div style={{ flex: 1, position: 'relative' }}>
                    {isEditingAmount ? (
                      <input
                        type="text"
                        className="promo-input"
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
                    ) : (
                      <div style={{ 
                        padding: '14px',
                        fontSize: '16px',
                        color: '#002AFE',
                        border: '2px solid #002AFE',
                        borderRadius: '8px',
                        background: '#f0f4ff',
                        textAlign: 'center',
                        fontWeight: '500',
                        fontFamily: "'Poppins', monospace"
                      }}>
                        {tripData.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <button 
                    className="validate-btn"
                    onClick={beginEditAmount}
                    style={{ minWidth: '100px' }}
                  >
                    {isEditingAmount ? 'Save' : 'Change'}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                  Trip Type
                </label>
                <select
                  className="promo-input"
                  value={tripData.tripType}
                  onChange={(e) => setTripData({ ...tripData, tripType: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="normal">Normal Trip</option>
                  <option value="express">Express</option>
                  <option value="group">Group</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              {tripData.stops.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                    Intermediate Stops
                  </label>
                  {tripData.stops.map((stop, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        className="promo-input"
                        placeholder="Stop location"
                        value={stop.location}
                        onChange={(e) => {
                          const newStops = [...tripData.stops]
                          newStops[index].location = e.target.value
                          setTripData({ ...tripData, stops: newStops })
                        }}
                        style={{ flex: 2 }}
                      />
                      <input
                        type="number"
                        className="promo-input"
                        placeholder="Amount"
                        value={stop.amount}
                        onChange={(e) => {
                          const newStops = [...tripData.stops]
                          newStops[index].amount = Number(e.target.value)
                          setTripData({ ...tripData, stops: newStops })
                        }}
                        style={{ flex: 1 }}
                      />
                      <button 
                        className="validate-btn"
                        onClick={() => removeStop(index)}
                        style={{ minWidth: '80px' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                  Trip Notes (Optional)
                </label>
                <textarea
                  className="promo-input"
                  placeholder="Delivery instructions, Multistop info etc..."
                  value={tripData.notes}
                  onChange={(e) => setTripData({ ...tripData, notes: e.target.value })}
                  rows="3"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button 
                className="activate-code-btn"
                style={{ background: 'transparent', border: '1px solid #002AFE', color: '#002AFE' }}
                onClick={() => setCurrentView("dashboard")}
              >
                Cancel
              </button>
              <button 
                className="activate-code-btn"
                onClick={addStop}
              >
                + Add Stop
              </button>
              <button 
                className="activate-code-btn"
                onClick={handleStartTrip}
              >
                Start Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  // Active Trip View
  const renderActiveTrip = () => (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">ACTIVE TRIP</h1>
        </div>

        <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          <div className="activate-screen">
            <h2 className="activate-title">Trip In Progress</h2>
            <p className="activate-subtitle">Trip ID: {activeTrip?.id}</p>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Elapsed Time</div>
                <h3 className="stat-value">{formatTime(timer)}</h3>
              </div>
              <div className="stat-card">
                <div className="stat-label">Distance</div>
                <h3 className="stat-value">{distance.toFixed(1)}<span style={{ fontSize: '12px', marginLeft: '2px' }}>km</span></h3>
              </div>
              <div className="stat-card">
                <div className="stat-label">Trip Price</div>
                <h3 className="stat-value">{activeTrip?.amount?.toLocaleString()}<span style={{ fontSize: '12px', marginLeft: '2px' }}>UGX</span></h3>
              </div>
            </div>

            {/* Trip Details */}
            <div className="commission-overview">
              <div className="section-title">Trip Details</div>
              <div style={{ padding: '16px' }}>
                <div className="detail-row">
                  <span className="detail-label">Pickup Location</span>
                  <span className="detail-value">{activeTrip?.pickup}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Destination</span>
                  <span className="detail-value">{activeTrip?.destination}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trip Type</span>
                  <span className="detail-value">{activeTrip?.tripType}</span>
                </div>
                {activeTrip?.stops?.map((stop, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">Stop {index + 1}</span>
                    <span className="detail-value">{stop.location} - UGX {stop.amount}</span>
                  </div>
                ))}
                {activeTrip?.notes && (
                  <div className="detail-row">
                    <span className="detail-label">Notes</span>
                    <span className="detail-value">{activeTrip?.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                className="activate-code-btn"
                style={{ background: 'transparent', border: '1px solid #002AFE', color: '#002AFE' }}
                onClick={() => {
                  setCurrentView("new-trip")
                  setActiveTrip(null)
                }}
              >
                Edit Trip
              </button>
              <button 
                className="activate-code-btn"
                onClick={handleEndTrip}
              >
                End Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  // Complete Trip View
  const renderCompleteTrip = () => (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">COMPLETE TRIP</h1>
        </div>

        <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          <div className="activate-screen">
            <h2 className="activate-title">Trip Completed</h2>
            <p className="activate-subtitle">Trip ID: {activeTrip?.id}</p>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Time Taken</div>
                <h3 className="stat-value">{formatTime(timer)}</h3>
              </div>
              <div className="stat-card">
                <div className="stat-label">Distance</div>
                <h3 className="stat-value">{distance.toFixed(1)}<span style={{ fontSize: '12px', marginLeft: '2px' }}>km</span></h3>
              </div>
              <div className="stat-card">
                <div className="stat-label">Trip Price</div>
                <h3 className="stat-value">{activeTrip?.amount?.toLocaleString()}<span style={{ fontSize: '12px', marginLeft: '2px' }}>UGX</span></h3>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="commission-overview">
              <div className="section-title">Trip Summary</div>
              <div style={{ padding: '16px' }}>
                <div className="detail-row">
                  <span className="detail-label">From</span>
                  <span className="detail-value">{activeTrip?.pickup}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">To</span>
                  <span className="detail-value">{activeTrip?.destination}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{formatDuration(timer)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Distance</span>
                  <span className="detail-value">{distance.toFixed(1)} km</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                className="activate-code-btn"
                style={{ background: 'transparent', border: '1px solid #002AFE', color: '#002AFE' }}
                onClick={() => setCurrentView("active-trip")}
              >
                Back
              </button>
              <button 
                className="activate-code-btn"
                onClick={handleReceiveMoney}
              >
                Receive Money
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  // History View
  const renderHistory = () => (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">TRIP HISTORY</h1>
        </div>

        <TabNavigation />

        <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          {/* Filters */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
            <div className="promo-input-section">
              <input
                type="text"
                className="promo-input"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="validate-btn"
                onClick={() => {
                  setSearchQuery("")
                  setFilterStatus("all")
                  setFilterPayment("all")
                }}
              >
                Clear
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              <select
                className="filter-btn"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ 
                  padding: '6px 12px',
                  background: 'white',
                  color: '#002AFE',
                  border: '1px solid #002AFE',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
              <select
                className="filter-btn"
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                style={{ 
                  padding: '6px 12px',
                  background: 'white',
                  color: '#002AFE',
                  border: '1px solid #002AFE',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                <option value="all">All Payments</option>
                <option value="cash">Cash</option>
                <option value="mtn momo">MTN MoMo</option>
                <option value="airtel money">Airtel Money</option>
              </select>
            </div>
          </div>

          {/* Trip History Table */}
          <div className="commission-engine">
            <div className="section-title">All Trips</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f0f4ff' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Route</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Distance</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Duration</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip) => (
                    <tr key={trip.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#002AFE', fontWeight: '500' }}>{trip.id}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#1e293b' }}>{trip.route}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#475569' }}>{trip.distance}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>{trip.duration}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#002AFE', fontWeight: '600' }}>UGX {trip.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-badge ${trip.status.toLowerCase()}`}>
                          {trip.status}
                          {trip.manualOverride && " (Manual)"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button 
              className="activate-code-btn"
              style={{ background: 'transparent', border: '1px solid #002AFE', color: '#002AFE' }}
              onClick={() => setCurrentView("dashboard")}
            >
              ← Back to Dashboard
            </button>
            <button 
              className="activate-code-btn"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
            <button 
              className="activate-code-btn"
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
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">TRIP ANALYTICS</h1>
        </div>

        <TabNavigation />

        <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          {/* Analytics Tabs */}
          <div className="tab-navigation" style={{ background: '#e8eaf6', marginBottom: '20px' }}>
            <button 
              className={`tab-btn ${analyticsView === "daily" ? "active" : ""}`}
              onClick={() => setAnalyticsView("daily")}
            >
              Daily
            </button>
            <button 
              className={`tab-btn ${analyticsView === "weekly" ? "active" : ""}`}
              onClick={() => setAnalyticsView("weekly")}
            >
              Weekly
            </button>
            <button 
              className={`tab-btn ${analyticsView === "monthly" ? "active" : ""}`}
              onClick={() => setAnalyticsView("monthly")}
            >
              Monthly
            </button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Trips</div>
              <h3 className="stat-value">{currentAnalytics.totalTrips}</h3>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                <span style={{ color: '#2e7d32' }}>{currentAnalytics.revenueChange}</span> from last period
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Revenue</div>
              <h3 className="stat-value">{currentAnalytics.totalRevenue.toLocaleString()}</h3>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                <span style={{ color: '#2e7d32' }}>{currentAnalytics.revenueChange}</span> from last period
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Completed</div>
              <h3 className="stat-value">{currentAnalytics.completedTrips}</h3>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                <span style={{ color: '#2e7d32' }}>{currentAnalytics.completedChange}</span> from last period
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Failed</div>
              <h3 className="stat-value">{currentAnalytics.failedTrips}</h3>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                <span style={{ color: '#c62828' }}>{currentAnalytics.failedChange}</span> from last period
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="analytics-section">
            <div className="chart-section">
              <div className="chart-title">Trip Summary - {analyticsView === "daily" ? "This Week" : analyticsView === "weekly" ? "Last 4 Weeks" : "This Month"}</div>
              <div className="chart-container">
                <div className="chart-bars">
                  {chartData.tripSummary.map((data) => (
                    <div key={data.day} className="bar-group">
                      <div 
                        className="bar commission"
                        style={{ 
                          height: `${(data.completed / maxTripValue) * 100}%`,
                          background: '#002AFE'
                        }}
                      />
                      <div 
                        className="bar revenue"
                        style={{ 
                          height: `${(data.failed / maxTripValue) * 100}%`,
                          background: '#FEF132',
                          marginTop: '2px'
                        }}
                      />
                      <div className="bar-label">{data.day}</div>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color commission" style={{ background: '#002AFE' }} />
                    <span className="legend-text">Completed</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color revenue" style={{ background: '#FEF132' }} />
                    <span className="legend-text">Failed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="conversion-funnel" style={{ marginTop: '20px' }}>
              <div className="funnel-title">Revenue Breakdown</div>
              {chartData.revenueBreakdown.map((item) => (
                <div key={item.type} className="funnel-stage">
                  <div 
                    className="funnel-bar"
                    style={{ 
                      background: item.color,
                      width: `${item.percentage}%`
                    }}
                  >
                    <span className="funnel-label">{item.type}</span>
                    <span className="funnel-value">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="activate-code-btn" 
            style={{ marginTop: '20px' }}
            onClick={() => setCurrentView("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
  
  // Enhanced Payment Modal
  const renderPaymentModal = () => (
    <div className={`compact-modal-overlay ${showPaymentModal ? "active" : ""}`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '12px',
      animation: 'fadeIn 0.3s ease-in'
    }}>
      <div className="compact-modal" style={{
        background: 'white',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{ 
          background: '#002AFE', 
          padding: '16px 20px', 
          borderRadius: '8px 8px 0 0',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          RECEIVE PAYMENT
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
              Enter Amount (UGX)
            </label>
            <input
              type="number"
              className="promo-input"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              min="0"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
              Select Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {['cash', 'momo', 'airtel', 'visa', 'qr', 'split'].map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`filter-btn ${selectedPaymentMethod === method ? "active" : ""}`}
                  onClick={() => {
                    setSelectedPaymentMethod(method)
                    if (method === "qr") setShowQR(true)
                  }}
                  style={{ 
                    padding: '10px',
                    textAlign: 'center',
                    background: selectedPaymentMethod === method ? '#002AFE' : 'white',
                    color: selectedPaymentMethod === method ? 'white' : '#002AFE',
                    border: '1px solid #002AFE',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {method === 'cash' ? '💵 Cash' : 
                   method === 'momo' ? 'MTN MoMo' : 
                   method === 'airtel' ? 'Airtel Money' : 
                   method === 'visa' ? '💳 VISA' : 
                   method === 'qr' ? '▦ QR Code' : 
                   '◎◎ Split'}
                </button>
              ))}
            </div>
          </div>

          {/* Split Payment Details */}
          {selectedPaymentMethod === "split" && (
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                  Cash Amount (UGX)
                </label>
                <input
                  type="number"
                  className="promo-input"
                  value={splitPayment.cash}
                  onChange={(e) => {
                    setSplitPayment({ ...splitPayment, cash: Number(e.target.value) })
                  }}
                  onBlur={handleSplitPaymentUpdate}
                  min="0"
                  max={paymentAmount}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                  Digital Amount (UGX)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    className="promo-input"
                    value={splitPayment.digital}
                    onChange={(e) => {
                      setSplitPayment({ ...splitPayment, digital: Number(e.target.value) })
                    }}
                    onBlur={handleSplitPaymentUpdate}
                    min="0"
                    max={paymentAmount}
                    style={{ flex: 1 }}
                  />
                  <select
                    className="filter-btn"
                    value={splitMethod}
                    onChange={(e) => setSplitMethod(e.target.value)}
                    style={{ minWidth: '100px' }}
                  >
                    <option value="momo">MTN MoMo</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="visa">Visa</option>
                  </select>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{ color: '#002AFE', fontSize: '14px', fontWeight: '600' }}>
                  Total: UGX {(splitPayment.cash + splitPayment.digital).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* QR Code Display */}
          {selectedPaymentMethod === "qr" && showQR && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '24px', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  margin: '0 auto 16px',
                  background: 'white',
                  border: '2px solid #002AFE',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '24px', color: '#002AFE', marginBottom: '4px' }}>▦</div>
                  <div style={{ color: '#999', fontSize: '10px', fontStyle: 'italic' }}>QR Code</div>
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>
                  Scan this QR code to complete payment
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '12px'
        }}>
          <button 
            className="activate-code-btn"
            style={{ 
              background: 'transparent', 
              border: '1px solid #002AFE', 
              color: '#002AFE',
              flex: 1
            }}
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
            className="activate-code-btn"
            style={{ flex: 1 }}
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
    <div className={`compact-modal-overlay ${showSuccessModal ? "active" : ""}`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '12px',
      animation: 'fadeIn 0.3s ease-in'
    }}>
      <div className="compact-modal" style={{
        background: 'white',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '100%',
        animation: 'slideUp 0.3s ease-out',
        textAlign: 'center'
      }}>
        {/* Modal Header */}
        <div style={{ 
          background: '#002AFE', 
          padding: '16px 20px', 
          borderRadius: '8px 8px 0 0',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          TRIP COMPLETE
        </div>

        {/* Modal Content */}
        <div style={{ padding: '32px 20px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: '#e8f5e9',
            border: '2px solid #4caf50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#4caf50',
            fontSize: '24px'
          }}>
            ✓
          </div>
          <h3 style={{ color: '#002AFE', marginBottom: '12px' }}>Payment Successful</h3>
          <div style={{ 
            color: '#002AFE', 
            fontSize: '24px', 
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            UGX {paymentAmount.toLocaleString()}
          </div>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
            Payment received via {selectedPaymentMethod === "split" ? "Split Payment" : selectedPaymentMethod}
          </p>
          {receiptData?.splitPayment && (
            <div style={{ 
              background: '#e3f2fd', 
              padding: '12px', 
              borderRadius: '6px',
              marginTop: '16px',
              fontSize: '12px',
              textAlign: 'left'
            }}>
              <div>Cash: UGX {receiptData.splitPayment.cash.toLocaleString()}</div>
              <div>Digital ({receiptData.splitMethod}): UGX {receiptData.splitPayment.digital.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '12px'
        }}>
          <button 
            className="activate-code-btn"
            style={{ flex: 1 }}
            onClick={handlePaymentSuccess}
          >
            View Receipt
          </button>
          <button 
            className="activate-code-btn"
            style={{ 
              background: 'transparent', 
              border: '1px solid #002AFE', 
              color: '#002AFE',
              flex: 1
            }}
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
    <div className="compact-modal-overlay active" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '12px',
      animation: 'fadeIn 0.3s ease-in'
    }}>
      <div className="compact-modal" style={{
        background: 'white',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{ 
          background: '#002AFE', 
          padding: '16px 20px', 
          borderRadius: '8px 8px 0 0',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          TRIP RECEIPT
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px' }}>
          <div ref={receiptRef} style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ textAlign: 'center', color: '#002AFE', marginBottom: '16px', fontSize: '18px' }}>Trip Receipt</h2>
            
            <div style={{ marginBottom: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ fontWeight: '600', color: '#002AFE' }}>Receipt ID:</span>
                <span>{receiptData?.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ fontWeight: '600', color: '#002AFE' }}>Date:</span>
                <span>{receiptData?.date} {receiptData?.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: '600', color: '#002AFE' }}>Trip Type:</span>
                <span>{receiptData?.tripType}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#002AFE', fontWeight: '600' }}>Trip Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                <span>From:</span>
                <span>{receiptData?.pickup}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                <span>To:</span>
                <span>{receiptData?.destination}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                <span>Distance:</span>
                <span>{receiptData?.distance} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Duration:</span>
                <span>{receiptData?.duration}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px', borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#002AFE', fontWeight: '600' }}>Payment Information</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ fontWeight: '600' }}>Payment Method:</span>
                <span style={{ fontWeight: '600' }}>{receiptData?.paymentMethod === "split" ? "Split Payment" : receiptData?.paymentMethod}</span>
              </div>
              
              {receiptData?.splitPayment ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                    <span>Cash Amount:</span>
                    <span>UGX {receiptData.splitPayment.cash.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                    <span>Digital Amount ({receiptData.splitMethod}):</span>
                    <span>UGX {receiptData.splitPayment.digital.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingTop: '8px', borderTop: '1px solid #e0e0e0', fontSize: '12px' }}>
                    <span style={{ fontWeight: '600' }}>Total Amount:</span>
                    <span style={{ fontWeight: '600' }}>UGX {receiptData?.amount?.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                  <span style={{ fontWeight: '600' }}>Amount:</span>
                  <span style={{ fontWeight: '600' }}>UGX {receiptData?.amount?.toLocaleString()}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: '600' }}>Payment Status:</span>
                <span style={{ fontWeight: '600', color: '#4caf50' }}>Paid</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '2px dashed #e0e0e0' }}>
              <p style={{ fontSize: '12px', color: '#666' }}>Thank you for riding with us!</p>
              <p style={{ fontSize: '10px', color: '#999' }}>Receipt Code: TR{Date.now().toString().slice(-8)}</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '12px'
        }}>
          <button 
            className="activate-code-btn"
            style={{ 
              background: 'transparent', 
              border: '1px solid #002AFE', 
              color: '#002AFE',
              flex: 1
            }}
            onClick={exportToPDF}
          >
            Save as PDF
          </button>
          <button 
            className="activate-code-btn"
            style={{ 
              background: '#FEF132', 
              color: '#000',
              border: '1px solid #fde047',
              flex: 1
            }}
            onClick={shareReceipt}
          >
            Share Receipt
          </button>
          <button 
            className="activate-code-btn"
            style={{ flex: 1 }}
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
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-open {
          overflow: hidden;
        }

        /* Status badges */
        .status-badge.valid {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }

        .status-badge.invalid {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }

        .status-badge.completed {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }

        .status-badge.cancelled {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }

        .status-badge.pending {
          background: #fff3e0;
          color: #ef6c00;
          border: 1px solid #ffcc80;
        }
      `}</style>
    </>
  )
}