"use client"

import { useState, useEffect, useRef } from "react"
import "./d.css"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

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
  const [showReceipt, setShowReceipt] = useState(false)
  const [showMultipleDelivery, setShowMultipleDelivery] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [receiptData, setReceiptData] = useState(null)

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
      totalDeliveries: 25,
      totalRevenue: 40000,
      completedDeliveries: 22,
      failedDeliveries: 3,
      revenueChange: "+2.5%",
      completedChange: "+20.5%",
      failedChange: "-2.5%",
    },
    weekly: {
      totalDeliveries: 125,
      totalRevenue: 180000,
      completedDeliveries: 102,
      failedDeliveries: 23,
      revenueChange: "+12.5%",
      completedChange: "+15.5%",
      failedChange: "-5.5%",
    },
    monthly: {
      totalDeliveries: 450,
      totalRevenue: 750000,
      completedDeliveries: 385,
      failedDeliveries: 65,
      revenueChange: "+25.5%",
      completedChange: "+30.5%",
      failedChange: "-8.5%",
    }
  })

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

  // Chart data
  const [chartData] = useState({
    deliverySummary: [
      { day: "Mon", completed: 45, failed: 12 },
      { day: "Tue", completed: 52, failed: 8 },
      { day: "Wed", completed: 48, failed: 10 },
      { day: "Thu", completed: 55, failed: 5 },
      { day: "Fri", completed: 60, failed: 15 },
      { day: "Sat", completed: 40, failed: 20 },
      { day: "Sun", completed: 35, failed: 5 }
    ],
    revenueBreakdown: [
      { type: "Same-Day", amount: 25000, color: "#3b82f6", percentage: 40 },
      { type: "Express", amount: 15000, color: "#fbbf24", percentage: 25 },
      { type: "Bulk", amount: 10000, color: "#ef4444", percentage: 15 },
      { type: "Standard", amount: 5000, color: "#10b981", percentage: 20 }
    ],
    paymentMethods: [
      { method: "Cash", trend: [150, 120, 80, 90, 60, 70, 50, 45, 40], color: "#3b82f6" },
      { method: "MTN MoMo", trend: [180, 160, 150, 145, 140, 135, 130, 125, 120], color: "#fbbf24" },
      { method: "Airtel Money", trend: [190, 185, 175, 165, 160, 155, 150, 145, 140], color: "#ef4444" },
      { method: "Visa", trend: [195, 193, 190, 188, 185, 183, 180, 178, 175], color: "#1e293b" }
    ]
  })

  const receiptRef = useRef(null)

  // Handle body scrolling when modals are open
  useEffect(() => {
    if (showPaymentModal || showSuccessModal || showReceipt || showMultipleDelivery) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [showPaymentModal, showSuccessModal, showReceipt, showMultipleDelivery])

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
      id: `DLV-${Date.now().toString().slice(-6)}`,
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
    
    // Generate receipt
    const receipt = {
      id: activeDelivery?.id || `REC-${Date.now().toString().slice(-6)}`,
      amount: paymentAmount,
      paymentMethod: selectedPaymentMethod,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      customerName: activeDelivery?.customerName || deliveryData.customerName,
      customerPhone: activeDelivery?.customerPhone || deliveryData.customerPhone,
      deliveryType: activeDelivery?.deliveryType || deliveryData.deliveryType,
      recipientCode: recipientCode,
    }
    
    setReceiptData(receipt)
    setShowPaymentModal(false)
    setShowSuccessModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowSuccessModal(false)
    setShowReceipt(true)
  }

  const generateRecipientCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setRecipientCode(code)
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
    const worksheet = XLSX.utils.json_to_sheet(filteredDeliveries)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Deliveries")
    XLSX.writeFile(workbook, `deliveries-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredDeliveries)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deliveries-${new Date().toISOString().split('T')[0]}.csv`
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
            title: 'Delivery Receipt',
            text: `Receipt for delivery ${receiptData.id} - Amount: UGX ${receiptData.amount.toLocaleString()}`
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

  // Multiple delivery functionality
  const handleAddMultiple = () => {
    setShowMultipleDelivery(true)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      
      // Preview CSV/Excel file
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheet = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheet]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        console.log("Uploaded file data:", jsonData.slice(0, 5))
      }
      reader.readAsBinaryString(file)
    }
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
  }

  const processMultipleDeliveries = () => {
    if (!uploadedFile) {
      alert("Please upload a file first")
      return
    }
    
    // Process the uploaded file
    alert(`Processing ${uploadedFile.name} with multiple deliveries...`)
    setShowMultipleDelivery(false)
    setUploadedFile(null)
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

  const currentAnalytics = analyticsData[analyticsView]

  // Find max value for bar chart scaling
  const maxDeliveryValue = Math.max(...chartData.deliverySummary.map(d => d.completed + d.failed))

  // Dashboard render function
  const renderDashboard = () => (
    <div className="deliveries-dashboard">
      <div className="deliveries-header">
        <div>
          <h1>Delivery Dashboard</h1>
          <p>Manage and track all your deliveries</p>
        </div>
        <button className="btn-analytics" onClick={() => setCurrentView("analytics")}>
          <span>📊</span> View Analytics
        </button>
      </div>

      <div className="quick-actions-delivery">
        <button className="btn-primary-delivery" onClick={() => setCurrentView("new-delivery")}>
          <span>🚚</span> Start New Delivery
        </button>
        <button className="btn-secondary-delivery" onClick={handleReceiveMoney}>
          <span>💰</span> Receive Money
        </button>
        <button className="btn-secondary-delivery" onClick={() => setCurrentView("history")}>
          <span>📋</span> View History
        </button>
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
            <span className="stat-change positive">↑ +12.5%</span>
          </div>
        </div>
        <div className="stat-card-delivery">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">
              40,000 <small>UGX</small>
            </span>
            <span className="stat-change positive">↑ +2.5%</span>
          </div>
        </div>
        <div className="stat-card-delivery">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">102</span>
            <span className="stat-change positive">↑ +20.5%</span>
          </div>
        </div>
        <div className="stat-card-delivery">
          <div className="stat-icon">⚠</div>
          <div className="stat-info">
            <span className="stat-label">Failed</span>
            <span className="stat-value">23</span>
            <span className="stat-change negative">↓ -2.5%</span>
          </div>
        </div>
      </div>

      <div className="ready-section">
        <div className="delivery-icon-large">🏍️</div>
        <h2>Ready to Deliver?</h2>
        <p>Start A New Delivery And Start Earning</p>
        <button className="btn-start-delivery" onClick={() => setCurrentView("new-delivery")}>
          <span>Start New Delivery</span> →
        </button>
      </div>

      <div className="delivery-activity">
        <div className="activity-header">
          <div>
            <h3>Delivery Activity</h3>
            <p>Recent delivery summary</p>
          </div>
          <button className="btn-view-history" onClick={() => setCurrentView("history")}>
            View Full History
          </button>
        </div>

        <div className="activity-list">
          {deliveryHistory.slice(0, 3).map((delivery) => (
            <div key={delivery.id} className="activity-item">
              <div className="activity-route">
                <span className="route-label">Route</span>
                <span className="route-value">{delivery.route}</span>
              </div>
              <div className="activity-recipient">
                <span className="recipient-label">Recipient</span>
                <span className="recipient-value">{delivery.customerName}</span>
                <span className="recipient-phone">{delivery.customerPhone}</span>
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
            <label>Customer Name *</label>
            <input
              type="text"
              placeholder="Sengendo Mark"
              value={deliveryData.customerName}
              onChange={(e) => setDeliveryData({ ...deliveryData, customerName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
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
            <label>Weight (kg)</label>
            <input
              type="text"
              placeholder="2.5"
              value={deliveryData.packageWeight}
              onChange={(e) => setDeliveryData({ ...deliveryData, packageWeight: e.target.value })}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header-delivery">
            <span className="section-icon">📍</span>
            <div>
              <h3>Pickup & Dropoff</h3>
              <p>Specify addresses</p>
            </div>
          </div>
          <div className="form-group">
            <label>Pickup Address *</label>
            <input
              type="text"
              placeholder="Pioneer Mall, Kampala"
              value={deliveryData.pickupAddress}
              onChange={(e) => setDeliveryData({ ...deliveryData, pickupAddress: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Dropoff Address *</label>
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
              <h3>Recipient Information</h3>
              <p>Enter recipient details</p>
            </div>
          </div>
          <div className="form-group">
            <label>Recipient Name</label>
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
          <span className="price-label">Estimated Price (UGX)</span>
          <div className="price-value">
            <input
              type="number"
              value={deliveryData.estimatedPrice}
              onChange={(e) => setDeliveryData({ ...deliveryData, estimatedPrice: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>
        </div>
      </div>

      <button className="btn-add-multiple" onClick={handleAddMultiple}>
        <span>+</span> Add Multiple Deliveries
      </button>

      <div className="form-actions-delivery">
        <button className="btn-cancel-delivery" onClick={() => setCurrentView("dashboard")}>
          Cancel
        </button>
        <button className="btn-receive-delivery" onClick={handleReceiveMoney}>
          Receive Money
        </button>
        <button className="btn-start-delivery-action" onClick={handleStartDelivery}>
          Start Delivery
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
            {activeDelivery?.estimatedPrice?.toLocaleString()} <small>UGX</small>
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
            <span className="detail-value">{activeDelivery?.packageWeight} kg</span>
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
          <span className="complete-metric-value">{activeDelivery?.estimatedPrice?.toLocaleString()} UGX</span>
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
          <button className="btn-change-number">Change Recipient Number</button>
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
          <div className="export-dropdown">
            <button className="btn-export">
              📥 Export
            </button>
            <div className="export-options">
              <div className="export-option" onClick={exportToPDF}>
                <span>📄</span> Export as PDF
              </div>
              <div className="export-option" onClick={exportToExcel}>
                <span>📊</span> Export as Excel
              </div>
              <div className="export-option" onClick={exportToCSV}>
                <span>📑</span> Export as CSV
              </div>
            </div>
          </div>
          <button className="btn-share" onClick={() => alert("Share functionality - would share via social media")}>
            🔗 Share
          </button>
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
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(Number(e.target.value))}
                  className="range-slider"
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{maxAmount} UGX</span>
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="distance">Distance</option>
              </select>
              <select style={{ marginTop: '0.5rem' }}>
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
                      <button className="btn-view-details" onClick={() => alert(`View details for ${delivery.id}`)}>
                        👁 View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>Showing {filteredDeliveries.length} deliveries</span>
            <div className="pagination-controls">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
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
          <p>Real-time delivery performance analytics</p>
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
          <span className="change-indicator positive">{currentAnalytics.revenueChange}</span>
          <div>
            <span className="stat-label-analytics">Total Deliveries</span>
            <span className="stat-value-analytics">{currentAnalytics.totalDeliveries}</span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon-analytics">💰</div>
          <span className="change-indicator positive">{currentAnalytics.revenueChange}</span>
          <div>
            <span className="stat-label-analytics">Total Revenue</span>
            <span className="stat-value-analytics">
              {currentAnalytics.totalRevenue.toLocaleString()} <small>UGX</small>
            </span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon-analytics">✅</div>
          <span className="change-indicator positive">{currentAnalytics.completedChange}</span>
          <div>
            <span className="stat-label-analytics">Completed</span>
            <span className="stat-value-analytics">{currentAnalytics.completedDeliveries}</span>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="stat-icon-analytics">⚠️</div>
          <span className="change-indicator negative">{currentAnalytics.failedChange}</span>
          <div>
            <span className="stat-label-analytics">Failed</span>
            <span className="stat-value-analytics">{currentAnalytics.failedDeliveries}</span>
          </div>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-card">
          <h3>Delivery Summary</h3>
          <p>Completed vs failed deliveries</p>
          <div className="bar-chart-placeholder">
            <div className="chart-bars">
              {chartData.deliverySummary.map((data, i) => (
                <div 
                  key={data.day} 
                  className="bar-group"
                  data-tooltip={`${data.day}: ${data.completed} completed, ${data.failed} failed`}
                >
                  <div 
                    className="bar bar-completed" 
                    style={{ 
                      height: `${(data.completed / maxDeliveryValue) * 150}px`,
                      background: `linear-gradient(to top, #10b981 0%, #34d399 100%)`
                    }}
                  ></div>
                  <div 
                    className="bar bar-failed" 
                    style={{ 
                      height: `${(data.failed / maxDeliveryValue) * 150}px`,
                      background: `linear-gradient(to top, #ef4444 0%, #fca5a5 100%)`
                    }}
                  ></div>
                  <span className="bar-label">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span>
                <span className="legend-color completed"></span> Completed Deliveries
              </span>
              <span>
                <span className="legend-color failed"></span> Failed Deliveries
              </span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Revenue By Delivery Type</h3>
          <p>Total revenue breakdown</p>
          <div className="pie-chart-section">
            <div className="pie-chart-placeholder">
              <svg viewBox="0 0 100 100" className="pie-chart">
                {chartData.revenueBreakdown.reduce((acc, item, index, array) => {
                  const previousPercentage = array.slice(0, index).reduce((sum, i) => sum + i.percentage, 0)
                  const circumference = 251.2 // 2 * π * 40
                  const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
                  const strokeDashoffset = `-${(previousPercentage / 100) * circumference}`
                  
                  acc.push(
                    <circle 
                      key={item.type}
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke={item.color}
                      strokeWidth="20" 
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 50 50)"
                    />
                  )
                  return acc
                }, [])}
              </svg>
              <div className="chart-center">
                <span className="chart-center-value">UGX</span>
                <span className="chart-center-label">60,000</span>
              </div>
            </div>
            <div className="revenue-breakdown">
              {chartData.revenueBreakdown.map((item, index) => (
                <div key={item.type} className="revenue-item">
                  <span className="revenue-type">{item.type}</span>
                  <span className="revenue-amount">UGX {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-card wide">
          <h3>Payment Method Trends</h3>
          <p>Payment preferences over time</p>
          <div className="line-chart-placeholder">
            <svg viewBox="0 0 400 200" className="line-chart">
              {chartData.paymentMethods.map((method, index) => {
                const points = method.trend.map((value, i) => {
                  const x = (i * 400) / (method.trend.length - 1)
                  const y = 200 - ((value / 200) * 160)
                  return `${x},${y}`
                }).join(" ")
                
                return (
                  <polyline 
                    key={method.method}
                    points={points}
                    fill="none"
                    stroke={method.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )
              })}
            </svg>
            <div className="chart-legend">
              {chartData.paymentMethods.map((method) => (
                <span key={method.method}>
                  <span className={`legend-line ${method.method.toLowerCase().replace(" ", "-")}`}></span> 
                  {method.method}
                </span>
              ))}
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
            <div className="payment-card-analytics airtel-card">
              <span className="payment-card-label">Airtel Money</span>
              <span className="payment-card-amount">
                75,000 <small>UGX</small>
              </span>
              <span className="payment-card-change positive">+8.5%</span>
            </div>
            <div className="payment-card-analytics visa-card">
              <span className="payment-card-label">Visa/Card</span>
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

  // Payment modal with all options and images
  const renderPaymentModal = () => (
    <div className={`payment-modal-overlay ${showPaymentModal ? "active" : ""}`}>
      <div className="payment-modal">
        <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
        <div className="payment-modal-header">
          <h2>Receive Payment</h2>
          <p>Select payment method and enter amount</p>
        </div>

        <div className="payment-modal-content">
          <div className="payment-amount-section">
            <label>Enter Amount (UGX)</label>
            <div className="amount-input-display">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="amount-input-large"
                min="0"
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
                <div className="payment-method-logo cash">
                  💵
                </div>
                <span className="payment-method-name">Cash</span>
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "momo" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("momo")}
              >
                <div className="payment-method-logo momo">
                  <span>MTN</span>
                </div>
                <span className="payment-method-name">MTN MoMo</span>
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "airtel" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("airtel")}
              >
                <div className="payment-method-logo airtel">
                  <span>Airtel</span>
                </div>
                <span className="payment-method-name">Airtel Money</span>
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "visa" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("visa")}
              >
                <div className="payment-method-logo visa">
                  <span>VISA</span>
                </div>
                <span className="payment-method-name">Visa</span>
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "qr" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("qr")}
              >
                <div className="payment-method-logo qr">
                  <span>QR</span>
                </div>
                <span className="payment-method-name">QR Code</span>
              </div>
              <div
                className={`payment-method-option ${selectedPaymentMethod === "split" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("split")}
              >
                <div className="payment-method-logo split">
                  🔀
                </div>
                <span className="payment-method-name">Split Pay</span>
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

  // Multiple delivery modal
  const renderMultipleDeliveryModal = () => (
    <div className={`multiple-delivery-modal-overlay ${showMultipleDelivery ? "active" : ""}`}>
      <div className="multiple-delivery-modal">
        <button className="modal-close" onClick={() => setShowMultipleDelivery(false)}>×</button>
        <div className="multiple-delivery-header">
          <h2>Add Multiple Deliveries</h2>
        </div>
        
        <div className="multiple-delivery-content">
          <div className={`upload-section ${uploadedFile ? 'active' : ''}`}>
            <div className="upload-icon">📁</div>
            <h3>Upload Delivery File</h3>
            <p>Upload CSV or Excel file containing multiple delivery information</p>
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="btn-upload">
              Choose File
            </label>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
          </div>

          {uploadedFile && (
            <div className="upload-file-info">
              <span className="file-name">{uploadedFile.name}</span>
              <span className="file-size">({Math.round(uploadedFile.size / 1024)} KB)</span>
              <button className="btn-remove-file" onClick={removeUploadedFile}>
                Remove
              </button>
            </div>
          )}

          <div className="preview-section">
            <h3>File Format Requirements</h3>
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Description</th>
                  <th>Example</th>
                  <th>Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>customerName</td>
                  <td>Customer full name</td>
                  <td>John Doe</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>customerPhone</td>
                  <td>Customer phone number</td>
                  <td>0789123456</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>packageDescription</td>
                  <td>Package details</td>
                  <td>Electronics</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>pickupAddress</td>
                  <td>Pickup location</td>
                  <td>Kampala Road</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>dropoffAddress</td>
                  <td>Delivery destination</td>
                  <td>Banda Road</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>estimatedPrice</td>
                  <td>Delivery fee (UGX)</td>
                  <td>5000</td>
                  <td>✓</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="multiple-delivery-actions">
            <button 
              className="btn-cancel-multiple" 
              onClick={() => {
                setShowMultipleDelivery(false)
                setUploadedFile(null)
              }}
            >
              Cancel
            </button>
            <button 
              className="btn-process-multiple" 
              onClick={processMultipleDeliveries}
              disabled={!uploadedFile}
            >
              Process Deliveries
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Success modal with receipt
  const renderSuccessModal = () => (
    <div className={`success-modal-overlay ${showSuccessModal ? "active" : ""}`}>
      <div className="success-modal">
        <button className="modal-close" onClick={() => setShowSuccessModal(false)}>×</button>
        <h2>Delivery Complete</h2>
        <div className="success-icon">✓</div>
        <h3>Payment Successful</h3>
        <div className="success-amount">UGX {paymentAmount.toLocaleString()}</div>
        <p>Payment received via {selectedPaymentMethod}</p>
        <div className="success-actions">
          <button className="btn-done" onClick={handlePaymentSuccess}>
            View Receipt
          </button>
          <button className="btn-start-delivery-success" onClick={() => {
            setShowSuccessModal(false)
            setCurrentView("dashboard")
            setActiveDelivery(null)
          }}>
            New Delivery
          </button>
        </div>
      </div>
    </div>
  )

  // Receipt display
  const renderReceipt = () => (
    <div className="success-modal-overlay active">
      <div className="success-modal" style={{ maxWidth: '500px' }}>
        <button className="modal-close" onClick={() => {
          setShowReceipt(false)
          setCurrentView("dashboard")
          setActiveDelivery(null)
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
        }}>×</button>
        
        <div ref={receiptRef} style={{ textAlign: 'left', padding: '1rem', background: 'white' }}>
          <h2 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '1rem' }}>Delivery Receipt</h2>
          
          <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>Receipt ID:</span>
              <span>{receiptData?.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>Date:</span>
              <span>{receiptData?.date} {receiptData?.time}</span>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Customer Details</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Name:</span>
              <span>{receiptData?.customerName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Phone:</span>
              <span>{receiptData?.customerPhone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Type:</span>
              <span>{receiptData?.deliveryType}</span>
            </div>
          </div>

          <div style={{ marginBottom: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>Payment Method:</span>
              <span style={{ fontWeight: '600' }}>{receiptData?.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>Amount:</span>
              <span style={{ fontWeight: '600' }}>UGX {receiptData?.amount?.toLocaleString()}</span>
            </div>
            {receiptData?.recipientCode && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>Recipient Code:</span>
                <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>{receiptData?.recipientCode}</span>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed #cbd5e1' }}>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Thank you for using our delivery service!</p>
          </div>
        </div>

        <div className="receipt-actions">
          <button className="btn-generate-pdf" onClick={exportToPDF}>
            <span>📄</span> Save as PDF
          </button>
          <button className="btn-share-receipt" onClick={shareReceipt}>
            <span>📤</span> Share Receipt
          </button>
          <button className="btn-done" onClick={() => {
            setShowReceipt(false)
            setCurrentView("dashboard")
            setActiveDelivery(null)
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
          }}>
            Done
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
      {renderMultipleDeliveryModal()}
      {showSuccessModal && renderSuccessModal()}
      {showReceipt && renderReceipt()}
    </div>
  )
}

export default Deliveries