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
      { type: "Same-Day", amount: 25000, color: "#002AFE", percentage: 40 },
      { type: "Express", amount: 15000, color: "#FEF132", percentage: 25 },
      { type: "Bulk", amount: 10000, color: "#ef4444", percentage: 15 },
      { type: "Standard", amount: 5000, color: "#10b981", percentage: 20 }
    ],
    paymentMethods: [
      { method: "Cash", trend: [150, 120, 80, 90, 60, 70, 50, 45, 40], color: "#002AFE" },
      { method: "MTN MoMo", trend: [180, 160, 150, 145, 140, 135, 130, 125, 120], color: "#FEF132" },
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

  // Dashboard render function - Updated to match agent.css styling
  const renderDashboard = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Delivery Dashboard</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`}
          onClick={() => setCurrentView("dashboard")}
        >
          Dashboard
        </button>
        <button 
          className={`tab-btn ${currentView === "new-delivery" ? "active" : ""}`}
          onClick={() => setCurrentView("new-delivery")}
        >
          New Delivery
        </button>
        <button 
          className={`tab-btn ${currentView === "history" ? "active" : ""}`}
          onClick={() => setCurrentView("history")}
        >
          History
        </button>
        <button 
          className={`tab-btn ${currentView === "analytics" ? "active" : ""}`}
          onClick={() => setCurrentView("analytics")}
        >
          Analytics
        </button>
      </div>

      <div className="tab-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Deliveries</div>
            <p className="stat-value">125</p>
            <div className="stat-change positive">
              +12.5%
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <p className="stat-value">40,000 UGX</p>
            <div className="stat-change positive">
              +2.5%
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <p className="stat-value">102</p>
            <div className="stat-change positive">
              +20.5%
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <p className="stat-value">23</p>
            <div className="stat-change negative">
              -2.5%
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="commission-overview" style={{ marginBottom: '20px' }}>
          <div className="section-title">Quick Actions</div>
          <div style={{ padding: '16px' }}>
            <div className="share-input-group" style={{ gap: '12px' }}>
              <button 
                className="share-btn"
                onClick={() => setCurrentView("new-delivery")}
                style={{ flex: '1' }}
              >
                🚚 Start New Delivery
              </button>
              <button 
                className="share-btn"
                onClick={handleReceiveMoney}
                style={{ 
                  background: '#FEF132',
                  color: '#000',
                  border: '1px solid #FEF132',
                  flex: '1'
                }}
              >
                💰 Receive Money
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="alerts-section">
          <div className="referral-alerts">
            <div className="alerts-title">Recent Delivery Activity</div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {deliveryHistory.slice(0, 5).map((delivery) => (
                <div key={delivery.id} className="alert-item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="alert-type">
                      {delivery.customerName} • {delivery.deliveryType}
                    </div>
                    <p className="alert-message">
                      {delivery.route} • {delivery.distance} • {delivery.date} {delivery.time}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ 
                      color: '#002AFE',
                      fontWeight: '600',
                      fontSize: '12px',
                      whiteSpace: 'nowrap'
                    }}>
                      UGX {delivery.amount.toLocaleString()}
                    </span>
                    <span className="status-badge" style={{ 
                      background: delivery.status === 'Completed' ? '#e8f5e9' : 
                                delivery.status === 'Cancelled' ? '#ffebee' : '#fff9c4',
                      color: delivery.status === 'Completed' ? '#2e7d32' : 
                            delivery.status === 'Cancelled' ? '#c62828' : '#f59e0b',
                      border: delivery.status === 'Completed' ? '1px solid #a5d6a7' : 
                             delivery.status === 'Cancelled' ? '1px solid #ffcdd2' : '1px solid #fde047',
                      padding: '2px 8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {delivery.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="milestone-section">
            <div className="alerts-title">Quick Stats</div>
            <div className="milestone-card">
              <div className="milestone-title">Active Deliveries</div>
              <div className="milestone-text" style={{ fontSize: '24px', fontWeight: '600', color: '#002AFE' }}>
                3
              </div>
            </div>
            <div className="milestone-card">
              <div className="milestone-title">Today's Earnings</div>
              <div className="milestone-text" style={{ fontSize: '24px', fontWeight: '600', color: '#002AFE' }}>
                12,000 UGX
              </div>
            </div>
            <div className="milestone-card">
              <div className="milestone-title">Success Rate</div>
              <div className="milestone-text" style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>
                92%
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Deliver Section */}
        <div className="commission-overview">
          <div className="section-title">Ready to Deliver?</div>
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'bounce 2s infinite' }}>🏍️</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#002AFE' }}>Start A New Delivery And Start Earning</h3>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '16px' }}>
              Create a new delivery request and begin your journey
            </p>
            <button 
              className="share-btn"
              onClick={() => setCurrentView("new-delivery")}
              style={{ 
                background: '#002AFE',
                color: 'white',
                padding: '12px 24px',
                fontSize: '14px'
              }}
            >
              🚚 Start New Delivery →
            </button>
            <button 
              className="share-btn"
              onClick={handleAddMultiple}
              style={{ 
                background: 'transparent',
                color: '#002AFE',
                border: '1px solid #002AFE',
                marginTop: '8px'
              }}
            >
              📁 Add Multiple Deliveries
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // New Delivery Form - IMPROVED with the beautiful layout
  const renderNewDelivery = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Start New Delivery 🟢</h2>
        <div style={{ color: 'white', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            background: '#10b981', 
            borderRadius: '50%',
            display: 'inline-block' 
          }}></span>
          Online • Create and manage new delivery request
        </div>
      </div>

      <div className="tab-content">
        {/* Form Grid with sections like the example */}
        <div className="alerts-section" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
          {/* Customer Information Section */}
          <div className="referral-alerts">
            <div className="alerts-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#002AFE',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  👤
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px' }}>Customer Information</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>Enter Customer Details</p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  className="share-input"
                  placeholder="Sengendo Mark"
                  value={deliveryData.customerName}
                  onChange={(e) => setDeliveryData({ ...deliveryData, customerName: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Phone Number *
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ 
                    background: '#f8f9fa',
                    border: '1px solid #002AFE',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#002AFE',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    +256
                  </div>
                  <input
                    type="tel"
                    className="share-input"
                    placeholder="079 898 898"
                    value={deliveryData.customerPhone}
                    onChange={(e) => setDeliveryData({ ...deliveryData, customerPhone: e.target.value })}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Package Details Section */}
          <div className="milestone-section">
            <div className="alerts-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#FEF132',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontSize: '14px'
                  }}>
                    📦
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '14px' }}>Package Details</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>Describe what's being delivered</p>
                  </div>
                </div>
                <select
                  className="share-input"
                  value={deliveryData.deliveryType}
                  onChange={(e) => setDeliveryData({ ...deliveryData, deliveryType: e.target.value })}
                  style={{ 
                    background: '#002AFE',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '500',
                    minWidth: '120px'
                  }}
                >
                  <option value="same-day">Same-Day Delivery</option>
                  <option value="express">Express</option>
                  <option value="bulk">Bulk</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
            </div>
            
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Package Description
                </label>
                <input
                  type="text"
                  className="share-input"
                  placeholder="Electronics, Fragile Items, etc..."
                  value={deliveryData.packageDescription}
                  onChange={(e) => setDeliveryData({ ...deliveryData, packageDescription: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Weight (kg)
                </label>
                <input
                  type="text"
                  className="share-input"
                  placeholder="2.5"
                  value={deliveryData.packageWeight}
                  onChange={(e) => setDeliveryData({ ...deliveryData, packageWeight: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Pickup & Dropoff Section */}
          <div className="referral-alerts">
            <div className="alerts-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#10b981',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  📍
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px' }}>Pickup & Dropoff</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>Specify addresses</p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Pickup Address *
                </label>
                <input
                  type="text"
                  className="share-input"
                  placeholder="Pioneer Mall, Kampala"
                  value={deliveryData.pickupAddress}
                  onChange={(e) => setDeliveryData({ ...deliveryData, pickupAddress: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Dropoff Address *
                </label>
                <input
                  type="text"
                  className="share-input"
                  placeholder="UCU campus, Mukono"
                  value={deliveryData.dropoffAddress}
                  onChange={(e) => setDeliveryData({ ...deliveryData, dropoffAddress: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Recipient Information Section */}
          <div className="milestone-section">
            <div className="alerts-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#8b5cf6',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  👤
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px' }}>Recipient Information</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>Enter recipient details</p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Recipient Name
                </label>
                <input
                  type="text"
                  className="share-input"
                  placeholder="Magezi Wise"
                  value={deliveryData.recipientName}
                  onChange={(e) => setDeliveryData({ ...deliveryData, recipientName: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                  Phone Number
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ 
                    background: '#f8f9fa',
                    border: '1px solid #8b5cf6',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#8b5cf6',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    +256
                  </div>
                  <input
                    type="tel"
                    className="share-input"
                    placeholder="075 800 898"
                    value={deliveryData.recipientPhone}
                    onChange={(e) => setDeliveryData({ ...deliveryData, recipientPhone: e.target.value })}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Pricing Section - Standalone */}
        <div className="commission-overview" style={{ marginBottom: '20px' }}>
          <div className="section-title" style={{ background: '#002AFE' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#FEF132',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontSize: '20px',
                fontWeight: '600'
              }}>
                💰
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Delivery Pricing</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#ffffffaa' }}>Set delivery rate</p>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Estimated Price (UGX)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  className="share-input"
                  value={deliveryData.estimatedPrice}
                  onChange={(e) => setDeliveryData({ ...deliveryData, estimatedPrice: parseInt(e.target.value) || 0 })}
                  min="0"
                  style={{ 
                    flex: 1,
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#002AFE',
                    textAlign: 'right',
                    padding: '12px'
                  }}
                />
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#002AFE' }}>UGX</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="share-btn"
                onClick={handleAddMultiple}
                style={{ 
                  background: '#FEF132',
                  color: '#000',
                  border: '1px solid #FEF132',
                  padding: '12px 20px',
                  fontSize: '14px'
                }}
              >
                📁 Add Multiple Deliveries
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="commission-overview">
          <div className="share-input-group" style={{ gap: '12px', padding: '16px' }}>
            <button 
              className="share-btn"
              onClick={() => setCurrentView("dashboard")}
              style={{ 
                background: '#f5f5f5',
                color: '#002AFE',
                border: '1px solid #002AFE',
                flex: '1'
              }}
            >
              Cancel
            </button>
            <button 
              className="share-btn"
              onClick={handleReceiveMoney}
              style={{ 
                background: '#10b981',
                color: 'white',
                border: '1px solid #10b981',
                flex: '1'
              }}
            >
              💰 Receive Money
            </button>
            <button 
              className="share-btn"
              onClick={handleStartDelivery}
              style={{ 
                background: '#002AFE',
                color: 'white',
                flex: '1'
              }}
            >
              🚚 Start Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderActiveDelivery = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Active Delivery 🟡</h2>
        <div style={{ color: 'white', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            background: '#FEF132', 
            borderRadius: '50%',
            display: 'inline-block' 
          }}></span>
          In Progress • Delivery ID: {activeDelivery?.id}
        </div>
      </div>

      <div className="tab-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Elapsed Time</div>
            <p className="stat-value">{formatTime(timer)}</p>
            <div className="stat-change">Time to deliver</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Distance</div>
            <p className="stat-value">{distance.toFixed(1)} KM</p>
            <div className="stat-change">Distance Covered</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Delivery Price</div>
            <p className="stat-value">{activeDelivery?.estimatedPrice?.toLocaleString()} UGX</p>
          </div>
        </div>

        {/* Delivery Details Section */}
        <div className="commission-overview" style={{ marginBottom: '20px' }}>
          <div className="section-title" style={{ background: '#FEF132', color: '#000' }}>
            Delivery Details
          </div>
          <div style={{ padding: '16px' }}>
            <div className="alerts-section" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="referral-alerts">
                <div className="alert-item" style={{ borderLeft: '3px solid #002AFE' }}>
                  <div className="alert-type">Pickup Location</div>
                  <p className="alert-message" style={{ color: '#002AFE', fontWeight: '600', fontSize: '12px' }}>
                    {activeDelivery?.pickupAddress}
                  </p>
                </div>
                
                <div className="alert-item" style={{ borderLeft: '3px solid #10b981' }}>
                  <div className="alert-type">Dropoff Location</div>
                  <p className="alert-message" style={{ color: '#002AFE', fontWeight: '600', fontSize: '12px' }}>
                    {activeDelivery?.dropoffAddress}
                  </p>
                </div>
                
                <div className="alert-item" style={{ borderLeft: '3px solid #8b5cf6' }}>
                  <div className="alert-type">Recipient Name</div>
                  <p className="alert-message" style={{ color: '#002AFE', fontWeight: '600', fontSize: '12px' }}>
                    {activeDelivery?.recipientName || 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="milestone-section">
                <div className="milestone-card">
                  <div className="milestone-title">Recipient Contact</div>
                  <div className="milestone-text" style={{ fontSize: '14px', fontWeight: '600', color: '#002AFE' }}>
                    {activeDelivery?.recipientPhone ? `+256 ${activeDelivery.recipientPhone}` : 'Not specified'}
                  </div>
                </div>
                
                <div className="milestone-card">
                  <div className="milestone-title">Package</div>
                  <div className="milestone-text" style={{ fontSize: '14px', fontWeight: '600', color: '#002AFE' }}>
                    {activeDelivery?.packageDescription || 'Not specified'}
                  </div>
                </div>
                
                <div className="milestone-card">
                  <div className="milestone-title">Delivery Type</div>
                  <div className="milestone-text" style={{ fontSize: '14px', fontWeight: '600', color: '#002AFE' }}>
                    {activeDelivery?.deliveryType}
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="share-btn"
              onClick={handleEndDelivery}
              style={{ 
                width: '100%',
                marginTop: '20px',
                background: '#002AFE',
                color: 'white',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ✅ End Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCompleteDelivery = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Complete Delivery ✅</h2>
        <div style={{ color: 'white', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            background: '#10b981', 
            borderRadius: '50%',
            display: 'inline-block' 
          }}></span>
          Ended • Delivery ID: {activeDelivery?.id}
        </div>
      </div>

      <div className="tab-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Time Taken</div>
            <p className="stat-value">{formatTime(timer)}</p>
          </div>
          <div className="stat-card">
            <div className="stat-label">Distance</div>
            <p className="stat-value">{distance.toFixed(1)} KM</p>
          </div>
          <div className="stat-card">
            <div className="stat-label">Delivery Price</div>
            <p className="stat-value">{activeDelivery?.estimatedPrice?.toLocaleString()} UGX</p>
          </div>
        </div>

        {/* Capture Recipient Code Section */}
        <div className="commission-overview" style={{ marginBottom: '20px' }}>
          <div className="section-title" style={{ background: '#FEF132', color: '#000' }}>
            Capture Recipient Code
          </div>
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '16px' }}>
              This code acts as proof of receipt
            </p>
            
            <button 
              className="share-btn"
              onClick={generateRecipientCode}
              style={{ 
                background: '#002AFE',
                color: 'white',
                padding: '12px 24px',
                fontSize: '14px',
                marginBottom: '16px'
              }}
            >
              🔐 Request Code
            </button>
            
            {recipientCode && (
              <div style={{ 
                padding: '16px',
                background: '#e3f2fd',
                borderRadius: '6px',
                border: '1px solid #bbdefb',
                marginBottom: '16px'
              }}>
                <div style={{ 
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#002AFE',
                  letterSpacing: '8px',
                  marginBottom: '8px',
                  fontFamily: 'monospace',
                  background: 'white',
                  padding: '12px',
                  borderRadius: '4px',
                  border: '2px dashed #93c5fd'
                }}>
                  {recipientCode}
                </div>
                <div style={{ color: '#666', fontSize: '11px' }}>
                  Code Captured at {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#666', fontWeight: '500', marginBottom: '4px', display: 'block', textAlign: 'left' }}>
                Delivery Notes (Optional)
              </label>
              <textarea
                placeholder="Enter delivery notes..."
                className="share-input"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows="3"
                style={{ resize: 'vertical', fontFamily: 'inherit', width: '100%' }}
              />
            </div>

            <div className="share-input-group" style={{ gap: '12px' }}>
              <button 
                className="share-btn"
                onClick={() => setCurrentView("active-delivery")}
                style={{ 
                  background: '#f5f5f5',
                  color: '#002AFE',
                  border: '1px solid #002AFE',
                  flex: '1'
                }}
              >
                ← Back
              </button>
              <button 
                className="share-btn"
                onClick={handleReceiveMoney}
                style={{ 
                  background: '#002AFE',
                  color: 'white',
                  flex: '1'
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Delivery History</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`}
          onClick={() => setCurrentView("dashboard")}
        >
          Dashboard
        </button>
        <button 
          className={`tab-btn ${currentView === "new-delivery" ? "active" : ""}`}
          onClick={() => setCurrentView("new-delivery")}
        >
          New Delivery
        </button>
        <button 
          className={`tab-btn ${currentView === "history" ? "active" : ""}`}
          onClick={() => setCurrentView("history")}
        >
          History
        </button>
        <button 
          className={`tab-btn ${currentView === "analytics" ? "active" : ""}`}
          onClick={() => setCurrentView("analytics")}
        >
          Analytics
        </button>
      </div>

      <div className="tab-content">
        {/* Filters */}
        <div className="commission-overview" style={{ marginBottom: '20px' }}>
          <div className="section-title">Filters</div>
          <div style={{ padding: '16px' }}>
            <div className="promo-input-section" style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Search deliveries..."
                className="share-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: '1' }}
              />
              <select
                className="share-input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ minWidth: '120px' }}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
              <select
                className="share-input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ minWidth: '120px' }}
              >
                <option value="all">All Types</option>
                <option value="same-day">Same-Day</option>
                <option value="express">Express</option>
                <option value="bulk">Bulk</option>
                <option value="standard">Standard</option>
              </select>
            </div>
            <button 
              className="share-btn"
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
                setFilterType("all")
              }}
              style={{ 
                background: '#f5f5f5',
                color: '#002AFE',
                border: '1px solid #002AFE'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="alerts-section">
          <div className="referral-alerts" style={{ gridColumn: '1 / -1' }}>
            <div className="alerts-title">All Deliveries</div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredDeliveries.map((delivery) => (
                <div key={delivery.id} className="alert-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      background: delivery.status === 'Completed' ? '#e8f5e9' : 
                                delivery.status === 'Cancelled' ? '#ffebee' : '#fff9c4',
                      color: delivery.status === 'Completed' ? '#2e7d32' : 
                            delivery.status === 'Cancelled' ? '#c62828' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '12px',
                      flexShrink: 0,
                      border: `1px solid ${delivery.status === 'Completed' ? '#a5d6a7' : 
                              delivery.status === 'Cancelled' ? '#ffcdd2' : '#fde047'}`
                    }}>
                      {delivery.id.substring(0, 3)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 className="alert-type" style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {delivery.customerName} • {delivery.deliveryType}
                      </h4>
                      <p className="alert-message" style={{ margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {delivery.route} • {delivery.distance} • {delivery.date}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <span style={{ 
                      color: '#002AFE',
                      fontWeight: '600',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}>
                      UGX {delivery.amount.toLocaleString()}
                    </span>
                    <span className="status-badge" style={{ 
                      background: delivery.status === 'Completed' ? '#e8f5e9' : 
                                delivery.status === 'Cancelled' ? '#ffebee' : '#fff9c4',
                      color: delivery.status === 'Completed' ? '#2e7d32' : 
                            delivery.status === 'Cancelled' ? '#c62828' : '#f59e0b',
                      border: delivery.status === 'Completed' ? '1px solid #a5d6a7' : 
                             delivery.status === 'Cancelled' ? '1px solid #ffcdd2' : '1px solid #fde047',
                      padding: '4px 8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {delivery.status}
                    </span>
                  </div>
                </div>
              ))}
              {filteredDeliveries.length === 0 && (
                <div style={{ 
                  padding: '40px 20px', 
                  textAlign: 'center', 
                  color: '#666',
                  fontSize: '12px'
                }}>
                  No deliveries found. Try adjusting your filters.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="commission-overview">
          <div className="share-input-group" style={{ gap: '12px', padding: '16px' }}>
            <button 
              className="share-btn"
              onClick={() => setCurrentView("dashboard")}
              style={{ 
                background: '#f5f5f5',
                color: '#002AFE',
                border: '1px solid #002AFE',
                flex: '1'
              }}
            >
              ← Back to Dashboard
            </button>
            <button 
              className="share-btn"
              onClick={exportToExcel}
              style={{ 
                background: '#FEF132',
                color: '#000',
                border: '1px solid #FEF132',
                flex: '1'
              }}
            >
              📊 Export to Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Delivery Analytics</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
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

      <div className="tab-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Deliveries</div>
            <p className="stat-value">{currentAnalytics.totalDeliveries}</p>
            <div className={`stat-change ${currentAnalytics.revenueChange.includes('+') ? 'positive' : 'negative'}`}>
              {currentAnalytics.revenueChange}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <p className="stat-value">{currentAnalytics.totalRevenue.toLocaleString()} UGX</p>
            <div className={`stat-change ${currentAnalytics.revenueChange.includes('+') ? 'positive' : 'negative'}`}>
              {currentAnalytics.revenueChange}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <p className="stat-value">{currentAnalytics.completedDeliveries}</p>
            <div className={`stat-change ${currentAnalytics.completedChange.includes('+') ? 'positive' : 'negative'}`}>
              {currentAnalytics.completedChange}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <p className="stat-value">{currentAnalytics.failedDeliveries}</p>
            <div className={`stat-change ${currentAnalytics.failedChange.includes('+') ? 'positive' : 'negative'}`}>
              {currentAnalytics.failedChange}
            </div>
          </div>
        </div>

        <div className="alerts-section">
          <div className="referral-alerts">
            <div className="alerts-title">Delivery Summary</div>
            <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '150px', marginBottom: '20px' }}>
                {chartData.deliverySummary.map((data, i) => (
                  <div key={data.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px' }}>
                      <div 
                        style={{ 
                          width: '12px', 
                          height: `${(data.completed / maxDeliveryValue) * 80}px`,
                          background: '#002AFE',
                          borderRadius: '2px 2px 0 0'
                        }}
                        title={`Completed: ${data.completed}`}
                      />
                      <div 
                        style={{ 
                          width: '12px', 
                          height: `${(data.failed / maxDeliveryValue) * 80}px`,
                          background: '#ef4444',
                          borderRadius: '2px 2px 0 0'
                        }}
                        title={`Failed: ${data.failed}`}
                      />
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', fontWeight: '500' }}>{data.day}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#002AFE', borderRadius: '1px' }}></div>
                  <span>Completed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '1px' }}></div>
                  <span>Failed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="milestone-section">
            <div className="alerts-title">Revenue Breakdown</div>
            {chartData.revenueBreakdown.map((item, i) => (
              <div key={item.type} className="milestone-card">
                <div className="milestone-title">{item.type}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: item.color,
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#002AFE', whiteSpace: 'nowrap' }}>
                    {item.percentage}%
                  </div>
                </div>
                <div className="milestone-text">
                  UGX {item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="share-btn"
          onClick={() => setCurrentView("dashboard")}
          style={{ 
            width: '100%',
            marginTop: '20px',
            background: '#002AFE',
            color: 'white',
            padding: '12px'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )

  // Payment modal with all options and images
  const renderPaymentModal = () => (
    <div className="modal-overlay active">
      <div className="modal">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ color: '#002AFE', margin: 0 }}>RECEIVE PAYMENT</h3>
          <button 
            onClick={() => setShowPaymentModal(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px' }}>
          <div className="share-input-group" style={{ marginBottom: '16px' }}>
            <input
              type="number"
              placeholder="Enter Amount (UGX)"
              className="share-input"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              min="0"
              style={{ textAlign: 'center', fontSize: '16px', fontWeight: '600' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>Select Payment Method</div>
            <div className="share-input-group" style={{ flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                className={`share-btn ${selectedPaymentMethod === "cash" ? "active" : ""}`}
                onClick={() => setSelectedPaymentMethod("cash")}
                style={{ 
                  flex: '1',
                  minWidth: '100px',
                  background: selectedPaymentMethod === "cash" ? '#002AFE' : 'white',
                  color: selectedPaymentMethod === "cash" ? 'white' : '#002AFE',
                  border: `1px solid ${selectedPaymentMethod === "cash" ? '#002AFE' : '#002AFE'}`
                }}
              >
                💵 Cash
              </button>
              <button
                type="button"
                className={`share-btn ${selectedPaymentMethod === "momo" ? "active" : ""}`}
                onClick={() => setSelectedPaymentMethod("momo")}
                style={{ 
                  flex: '1',
                  minWidth: '100px',
                  background: selectedPaymentMethod === "momo" ? '#002AFE' : 'white',
                  color: selectedPaymentMethod === "momo" ? 'white' : '#002AFE',
                  border: `1px solid ${selectedPaymentMethod === "momo" ? '#002AFE' : '#002AFE'}`
                }}
              >
                MTN MoMo
              </button>
              <button
                type="button"
                className={`share-btn ${selectedPaymentMethod === "airtel" ? "active" : ""}`}
                onClick={() => setSelectedPaymentMethod("airtel")}
                style={{ 
                  flex: '1',
                  minWidth: '100px',
                  background: selectedPaymentMethod === "airtel" ? '#002AFE' : 'white',
                  color: selectedPaymentMethod === "airtel" ? 'white' : '#002AFE',
                  border: `1px solid ${selectedPaymentMethod === "airtel" ? '#002AFE' : '#002AFE'}`
                }}
              >
                Airtel Money
              </button>
              <button
                type="button"
                className={`share-btn ${selectedPaymentMethod === "visa" ? "active" : ""}`}
                onClick={() => setSelectedPaymentMethod("visa")}
                style={{ 
                  flex: '1',
                  minWidth: '100px',
                  background: selectedPaymentMethod === "visa" ? '#002AFE' : 'white',
                  color: selectedPaymentMethod === "visa" ? 'white' : '#002AFE',
                  border: `1px solid ${selectedPaymentMethod === "visa" ? '#002AFE' : '#002AFE'}`
                }}
              >
                VISA
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ padding: '0 20px 20px 20px' }}>
          <div className="share-input-group" style={{ gap: '12px' }}>
            <button 
              className="share-btn"
              onClick={() => setShowPaymentModal(false)}
              style={{ 
                background: '#f5f5f5',
                color: '#002AFE',
                border: '1px solid #002AFE',
                flex: '1'
              }}
            >
              Cancel
            </button>
            <button 
              className="share-btn"
              onClick={handlePaymentContinue}
              disabled={!selectedPaymentMethod}
              style={{ 
                background: selectedPaymentMethod ? '#002AFE' : '#cccccc',
                color: 'white',
                flex: '1',
                cursor: selectedPaymentMethod ? 'pointer' : 'not-allowed'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Multiple delivery modal
  const renderMultipleDeliveryModal = () => (
    <div className="modal-overlay active">
      <div className="modal">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ color: '#002AFE', margin: 0 }}>ADD MULTIPLE DELIVERIES</h3>
          <button 
            onClick={() => {
              setShowMultipleDelivery(false)
              setUploadedFile(null)
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>Upload Delivery File</div>
            <div style={{ 
              border: '2px dashed #002AFE',
              borderRadius: '8px',
              padding: '40px 20px',
              textAlign: 'center',
              background: '#f8f9fa',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                id="multiple-file-upload"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE', marginBottom: '4px' }}>
                Click to upload or drag and drop
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>CSV or Excel files only</div>
            </div>
          </div>

          {uploadedFile && (
            <div style={{ 
              padding: '12px',
              background: '#e8f5e9',
              borderRadius: '6px',
              border: '1px solid #a5d6a7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#2e7d32', marginBottom: '2px' }}>
                  {uploadedFile.name}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  {Math.round(uploadedFile.size / 1024)} KB
                </div>
              </div>
              <button 
                className="share-btn"
                onClick={removeUploadedFile}
                style={{ 
                  background: '#ffebee',
                  color: '#c62828',
                  border: '1px solid #ffcdd2',
                  padding: '4px 8px',
                  fontSize: '11px'
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ padding: '0 20px 20px 20px' }}>
          <div className="share-input-group" style={{ gap: '12px' }}>
            <button 
              className="share-btn"
              onClick={() => {
                setShowMultipleDelivery(false)
                setUploadedFile(null)
              }}
              style={{ 
                background: '#f5f5f5',
                color: '#002AFE',
                border: '1px solid #002AFE',
                flex: '1'
              }}
            >
              Cancel
            </button>
            <button 
              className="share-btn"
              onClick={processMultipleDeliveries}
              disabled={!uploadedFile}
              style={{ 
                background: uploadedFile ? '#002AFE' : '#cccccc',
                color: 'white',
                flex: '1',
                cursor: uploadedFile ? 'pointer' : 'not-allowed'
              }}
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
    <div className="modal-overlay active">
      <div className="modal">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ color: '#002AFE', margin: 0 }}>DELIVERY COMPLETE</h3>
          <button 
            onClick={() => {
              setShowSuccessModal(false)
              setCurrentView("dashboard")
              setActiveDelivery(null)
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }}>✓</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#002AFE' }}>Payment Successful</h3>
          <div style={{ fontSize: '32px', fontWeight: '600', color: '#002AFE', marginBottom: '8px' }}>
            UGX {paymentAmount.toLocaleString()}
          </div>
          <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
            Payment received via {selectedPaymentMethod}
          </p>
        </div>

        {/* Modal Actions */}
        <div style={{ padding: '0 20px 20px 20px' }}>
          <div className="share-input-group" style={{ gap: '12px' }}>
            <button 
              className="share-btn"
              onClick={handlePaymentSuccess}
              style={{ 
                background: '#002AFE',
                color: 'white',
                flex: '1'
              }}
            >
              View Receipt
            </button>
            <button 
              className="share-btn"
              onClick={() => {
                setShowSuccessModal(false)
                setCurrentView("dashboard")
                setActiveDelivery(null)
              }}
              style={{ 
                background: '#FEF132',
                color: '#000',
                border: '1px solid #FEF132',
                flex: '1'
              }}
            >
              New Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Receipt display
  const renderReceipt = () => (
    <div className="modal-overlay active">
      <div className="modal" style={{ maxWidth: '400px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ color: '#002AFE', margin: 0 }}>DELIVERY RECEIPT</h3>
          <button 
            onClick={() => {
              setShowReceipt(false)
              setCurrentView("dashboard")
              setActiveDelivery(null)
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px' }}>
          <div ref={receiptRef} style={{ 
            textAlign: 'left', 
            padding: '16px', 
            background: 'white', 
            borderRadius: '6px', 
            border: '1px solid #e0e0e0',
            fontFamily: 'Poppins, sans-serif'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              color: '#002AFE', 
              marginBottom: '16px',
              fontSize: '16px',
              fontWeight: '600'
            }}>Delivery Receipt</h2>
            
            <div style={{ marginBottom: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Receipt ID:</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#002AFE' }}>{receiptData?.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Date:</span>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{receiptData?.date} {receiptData?.time}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '12px', marginBottom: '8px', color: '#002AFE', fontWeight: '600' }}>Customer Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Name:</span>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{receiptData?.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Phone:</span>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{receiptData?.customerPhone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Delivery Type:</span>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{receiptData?.deliveryType}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px', borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>Payment Method:</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#002AFE' }}>{receiptData?.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>Amount:</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#002AFE' }}>UGX {receiptData?.amount?.toLocaleString()}</span>
              </div>
              {receiptData?.recipientCode && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>Recipient Code:</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#002AFE', fontFamily: 'monospace' }}>
                    {receiptData?.recipientCode}
                  </span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '2px dashed #cbd5e1' }}>
              <p style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>Thank you for using our delivery service!</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ padding: '0 20px 20px 20px' }}>
          <div className="share-input-group" style={{ gap: '8px' }}>
            <button 
              className="share-btn"
              onClick={exportToPDF}
              style={{ 
                background: '#f5f5f5',
                color: '#002AFE',
                border: '1px solid #002AFE',
                flex: '1',
                fontSize: '11px',
                padding: '8px'
              }}
            >
              📄 Save as PDF
            </button>
            <button 
              className="share-btn"
              onClick={shareReceipt}
              style={{ 
                background: '#FEF132',
                color: '#000',
                border: '1px solid #FEF132',
                flex: '1',
                fontSize: '11px',
                padding: '8px'
              }}
            >
              📤 Share Receipt
            </button>
            <button 
              className="share-btn"
              onClick={() => {
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
              }}
              style={{ 
                background: '#002AFE',
                color: 'white',
                flex: '1',
                fontSize: '11px',
                padding: '8px'
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="rider-agent-container">
      {currentView === "dashboard" && renderDashboard()}
      {currentView === "new-delivery" && renderNewDelivery()}
      {currentView === "active-delivery" && renderActiveDelivery()}
      {currentView === "complete-delivery" && renderCompleteDelivery()}
      {currentView === "history" && renderHistory()}
      {currentView === "analytics" && renderAnalytics()}
      {showPaymentModal && renderPaymentModal()}
      {showMultipleDelivery && renderMultipleDeliveryModal()}
      {showSuccessModal && renderSuccessModal()}
      {showReceipt && renderReceipt()}

      <style jsx>{`
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-in;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
        }

        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Animations */
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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        /* Custom styles for the new delivery form */
        .alerts-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .referral-alerts,
        .milestone-section {
          background: white;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .alerts-title {
          color: #002AFE;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
        }

        .alert-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
          border-left: 3px solid #002AFE;
        }

        .alert-item:hover {
          background: #e8eaf6;
          transform: translateX(2px);
        }

        .alert-type {
          color: #002AFE;
          font-size: 12px;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .alert-message {
          color: #666;
          font-size: 11px;
          margin: 0 0 2px 0;
          line-height: 1.3;
        }

        .milestone-card {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 8px;
          border: 1px solid #e0e0e0;
        }

        .milestone-title {
          color: #002AFE;
          font-size: 12px;
          font-weight: 600;
          margin: 0 0 6px 0;
        }

        .milestone-text {
          color: #666;
          font-size: 11px;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .stat-change {
          font-size: 10px;
          font-weight: 500;
          margin-top: 4px;
        }

        .stat-change.positive {
          color: #2e7d32;
        }

        .stat-change.negative {
          color: #c62828;
        }

        @media (max-width: 768px) {
          .alerts-section {
            grid-template-columns: 1fr;
          }
          
          .share-input-group {
            flex-direction: column;
          }
          
          .share-btn, .share-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default Deliveries