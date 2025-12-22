"use client"

import { useState, useEffect, useRef } from "react"
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
      { type: "Express", amount: 15000, color: "#f59e0b", percentage: 25 },
      { type: "Bulk", amount: 10000, color: "#ef4444", percentage: 15 },
      { type: "Standard", amount: 5000, color: "#10b981", percentage: 20 }
    ],
    paymentMethods: [
      { method: "Cash", trend: [150, 120, 80, 90, 60, 70, 50, 45, 40], color: "#3b82f6" },
      { method: "MTN MoMo", trend: [180, 160, 150, 145, 140, 135, 130, 125, 120], color: "#f59e0b" },
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
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">DELIVERY DASHBOARD</h1>
            <p className="expense-subtitle">Manage and track all your deliveries</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Delivery Rider</span>
            <div className="expense-user-badge">DR</div>
          </div>
        </div>
      </header>

      {/* Compact Stats Grid */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Deliveries</span>
            <span className="compact-stat-change positive">↑ +12.5%</span>
          </div>
          <div className="compact-stat-value">
            125
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Revenue</span>
            <span className="compact-stat-change positive">↑ +2.5%</span>
          </div>
          <div className="compact-stat-value">
            40,000<span className="compact-stat-currency">UGX</span>
          </div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Completed</span>
            <span className="compact-stat-change positive">↑ +20.5%</span>
          </div>
          <div className="compact-stat-value">
            102
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Failed</span>
            <span className="compact-stat-change negative">↓ -2.5%</span>
          </div>
          <div className="compact-stat-value">
            23
          </div>
        </div>
      </div>

      {/* Compact Action Bar */}
      <div className="compact-action-bar">
        <button 
          className="compact-btn btn-primary" 
          onClick={() => setCurrentView("new-delivery")}
        >
          Start New Delivery
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
        <h2 className="compact-section-title">Ready to Deliver?</h2>
        <p className="compact-section-subtitle">Start A New Delivery And Start Earning</p>
        <button 
          className="compact-btn btn-primary" 
          style={{ marginTop: '0.5rem' }}
          onClick={() => setCurrentView("new-delivery")}
        >
          Start New Delivery →
        </button>
      </div>

      {/* Compact Content Grid */}
      <div className="compact-content-grid">
        {/* Recent Activity */}
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Recent Delivery Activity</h2>
            <p className="compact-section-subtitle">Your latest deliveries</p>
          </div>

          <div className="compact-table-wrapper">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Distance</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveryHistory.slice(0, 3).map((delivery) => (
                  <tr key={delivery.id}>
                    <td>
                      <div className="compact-contact-cell">
                        <div className="compact-contact-name">{delivery.customerName}</div>
                        <div className="compact-contact-phone">{delivery.customerPhone}</div>
                      </div>
                    </td>
                    <td className="compact-route">{delivery.route}</td>
                    <td className="compact-distance">{delivery.distance}</td>
                    <td className="compact-amount">UGX {delivery.amount.toLocaleString()}</td>
                    <td>
                      <span className={`compact-status ${delivery.status.toLowerCase()}`}>
                        {delivery.status}
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
            <p className="compact-section-subtitle">Delivery metrics</p>
          </div>

          <div className="compact-breakdown-list">
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Active Deliveries</span>
                <span className="compact-stat-value">3</span>
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Today's Earnings</span>
                <span className="compact-stat-value">UGX 12,000</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: '75%',
                    backgroundColor: '#3b82f6'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Success Rate</span>
                <span className="compact-stat-value">92%</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: '92%',
                    backgroundColor: '#10b981'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Avg Delivery Time</span>
                <span className="compact-stat-value">25min</span>
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

  const renderNewDelivery = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">START NEW DELIVERY</h1>
            <p className="expense-subtitle">Create and manage new delivery request</p>
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
            <h2 className="compact-section-title">Delivery Details</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="compact-filter-select"
                value={deliveryData.deliveryType}
                onChange={(e) => setDeliveryData({ ...deliveryData, deliveryType: e.target.value })}
              >
                <option value="same-day">Same-Day Delivery</option>
                <option value="express">Express</option>
                <option value="bulk">Bulk</option>
                <option value="standard">Standard</option>
              </select>
            </div>
          </div>

          <div className="compact-modal-content">
            <div className="compact-form-group">
              <label className="compact-form-label">Customer Name *</label>
              <input
                type="text"
                className="compact-form-input"
                placeholder="Sengendo Mark"
                value={deliveryData.customerName}
                onChange={(e) => setDeliveryData({ ...deliveryData, customerName: e.target.value })}
              />
            </div>

            <div className="compact-form-group">
              <label className="compact-form-label">Phone Number *</label>
              <input
                type="tel"
                className="compact-form-input"
                placeholder="+256 79 898 898"
                value={deliveryData.customerPhone}
                onChange={(e) => setDeliveryData({ ...deliveryData, customerPhone: e.target.value })}
              />
            </div>

            <div className="compact-form-group">
              <label className="compact-form-label">Package Description</label>
              <input
                type="text"
                className="compact-form-input"
                placeholder="Electronics, Fragile Items, etc..."
                value={deliveryData.packageDescription}
                onChange={(e) => setDeliveryData({ ...deliveryData, packageDescription: e.target.value })}
              />
            </div>

            <div className="compact-form-row">
              <div className="compact-form-group">
                <label className="compact-form-label">Pickup Address *</label>
                <input
                  type="text"
                  className="compact-form-input"
                  placeholder="Pioneer Mall, Kampala"
                  value={deliveryData.pickupAddress}
                  onChange={(e) => setDeliveryData({ ...deliveryData, pickupAddress: e.target.value })}
                />
              </div>
              <div className="compact-form-group">
                <label className="compact-form-label">Dropoff Address *</label>
                <input
                  type="text"
                  className="compact-form-input"
                  placeholder="UCU campus, Mukono"
                  value={deliveryData.dropoffAddress}
                  onChange={(e) => setDeliveryData({ ...deliveryData, dropoffAddress: e.target.value })}
                />
              </div>
            </div>

            <div className="compact-form-row">
              <div className="compact-form-group">
                <label className="compact-form-label">Recipient Name</label>
                <input
                  type="text"
                  className="compact-form-input"
                  placeholder="Magezi Wise"
                  value={deliveryData.recipientName}
                  onChange={(e) => setDeliveryData({ ...deliveryData, recipientName: e.target.value })}
                />
              </div>
              <div className="compact-form-group">
                <label className="compact-form-label">Recipient Phone</label>
                <input
                  type="tel"
                  className="compact-form-input"
                  placeholder="+256 75 800 898"
                  value={deliveryData.recipientPhone}
                  onChange={(e) => setDeliveryData({ ...deliveryData, recipientPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="compact-form-group">
              <label className="compact-form-label">Delivery Price (UGX)</label>
              <input
                type="number"
                className="compact-form-input"
                value={deliveryData.estimatedPrice}
                onChange={(e) => setDeliveryData({ ...deliveryData, estimatedPrice: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <div className="compact-modal-actions">
            <button 
              className="compact-modal-btn btn-secondary" 
              onClick={() => setCurrentView("dashboard")}
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
              onClick={handleStartDelivery}
            >
              Start Delivery
            </button>
          </div>
        </div>
      </div>

      {/* Add Multiple Deliveries Button */}
      <button 
        className="compact-btn btn-secondary" 
        style={{ margin: '0.75rem', width: 'calc(100% - 1.5rem)' }}
        onClick={handleAddMultiple}
      >
        + Add Multiple Deliveries
      </button>
    </div>
  )

  const renderActiveDelivery = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">ACTIVE DELIVERY</h1>
            <p className="expense-subtitle">Delivery ID: {activeDelivery?.id}</p>
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
            <span className="compact-stat-label">Delivery Price</span>
          </div>
          <div className="compact-stat-value">
            {activeDelivery?.estimatedPrice?.toLocaleString()}<span className="compact-stat-currency">UGX</span>
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="compact-content-grid">
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">Delivery Details</h2>
          </div>

          <div className="compact-delivery-details">
            <div className="compact-detail-row">
              <span className="compact-detail-label">Pickup Location</span>
              <span className="compact-detail-value">{activeDelivery?.pickupAddress}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Dropoff Location</span>
              <span className="compact-detail-value">{activeDelivery?.dropoffAddress}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Recipient</span>
              <span className="compact-detail-value">{activeDelivery?.recipientName}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Recipient Contact</span>
              <span className="compact-detail-value">+256 {activeDelivery?.recipientPhone}</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Package</span>
              <span className="compact-detail-value">{activeDelivery?.packageDescription}</span>
            </div>
          </div>

          <button 
            className="compact-btn btn-primary" 
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={handleEndDelivery}
          >
            End Delivery
          </button>
        </div>
      </div>
    </div>
  )

  const renderCompleteDelivery = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">COMPLETE DELIVERY</h1>
            <p className="expense-subtitle">Delivery ID: {activeDelivery?.id}</p>
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
            <span className="compact-stat-label">Delivery Price</span>
          </div>
          <div className="compact-stat-value">
            {activeDelivery?.estimatedPrice?.toLocaleString()}<span className="compact-stat-currency">UGX</span>
          </div>
        </div>
      </div>

      {/* Complete Delivery Content */}
      <div className="compact-content-grid">
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">Capture Recipient Code</h2>
            <p className="compact-section-subtitle">This code acts as proof of receipt</p>
          </div>

          <div className="compact-code-section">
            <button 
              className="compact-btn btn-primary"
              onClick={generateRecipientCode}
            >
              Request Code
            </button>
            
            {recipientCode && (
              <div className="compact-code-display">
                <div className="compact-code-value">{recipientCode}</div>
                <div className="compact-code-time">Code Captured at {new Date().toLocaleTimeString()}</div>
              </div>
            )}
          </div>

          <div className="compact-form-group" style={{ marginTop: '1rem' }}>
            <label className="compact-form-label">Delivery Notes (Optional)</label>
            <textarea
              className="compact-form-textarea"
              placeholder="Enter delivery notes..."
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              rows="3"
            />
          </div>

          <div className="compact-modal-actions">
            <button 
              className="compact-modal-btn btn-secondary" 
              onClick={() => setCurrentView("active-delivery")}
            >
              Back
            </button>
            <button 
              className="compact-modal-btn btn-primary"
              onClick={handleReceiveMoney}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">DELIVERY HISTORY</h1>
            <p className="expense-subtitle">Manage and view all your deliveries</p>
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
            <h2 className="compact-section-title">All Deliveries</h2>
            <div className="compact-filters">
              <input
                type="text"
                placeholder="Search deliveries..."
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="same-day">Same-Day</option>
                <option value="express">Express</option>
                <option value="bulk">Bulk</option>
                <option value="standard">Standard</option>
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
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td className="compact-delivery-id">{delivery.id}</td>
                    <td>
                      <div className="compact-contact-cell">
                        <div className="compact-contact-name">{delivery.customerName}</div>
                        <div className="compact-contact-phone">{delivery.customerPhone}</div>
                      </div>
                    </td>
                    <td className="compact-route">{delivery.route}</td>
                    <td>
                      <span className="compact-type-badge">{delivery.deliveryType}</span>
                    </td>
                    <td className="compact-amount">UGX {delivery.amount.toLocaleString()}</td>
                    <td>
                      <span className={`compact-status ${delivery.status.toLowerCase()}`}>
                        {delivery.status}
                      </span>
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

  const renderAnalytics = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">DELIVERY ANALYTICS</h1>
            <p className="expense-subtitle">Real-time delivery performance analytics</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Analytics</span>
            <div className="expense-user-badge">DA</div>
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
            <span className="compact-stat-label">Total Deliveries</span>
            <span className="compact-stat-change positive">{currentAnalytics.revenueChange}</span>
          </div>
          <div className="compact-stat-value">
            {currentAnalytics.totalDeliveries}
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
            {currentAnalytics.completedDeliveries}
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Failed</span>
            <span className="compact-stat-change negative">{currentAnalytics.failedChange}</span>
          </div>
          <div className="compact-stat-value">
            {currentAnalytics.failedDeliveries}
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="compact-content-grid">
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Delivery Summary</h2>
            <p className="compact-section-subtitle">Completed vs failed deliveries</p>
          </div>

          <div className="compact-breakdown-list">
            {chartData.deliverySummary.map((data, i) => (
              <div key={data.day} className="compact-breakdown-item">
                <div className="compact-breakdown-info">
                  <span className="compact-breakdown-name">{data.day}</span>
                  <span className="compact-breakdown-percentage">{data.completed} completed</span>
                </div>
                <div className="compact-progress-bar">
                  <div
                    className="compact-progress-fill"
                    style={{
                      width: `${(data.completed / maxDeliveryValue) * 100}%`,
                      backgroundColor: '#10b981'
                    }}
                  />
                  <div
                    className="compact-progress-fill"
                    style={{
                      width: `${(data.failed / maxDeliveryValue) * 100}%`,
                      backgroundColor: '#ef4444',
                      position: 'absolute',
                      left: `${(data.completed / maxDeliveryValue) * 100}%`
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
            <p className="compact-section-subtitle">By delivery type</p>
          </div>

          <div className="compact-breakdown-list">
            {chartData.revenueBreakdown.map((item, i) => (
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

  // Payment modal with all options and images
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
                MTN MoMo
              </button>
              <button
                type="button"
                className={`compact-category-btn ${selectedPaymentMethod === "airtel" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("airtel")}
              >
                Airtel Money
              </button>
              <button
                type="button"
                className={`compact-category-btn ${selectedPaymentMethod === "visa" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentMethod("visa")}
              >
                VISA
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="compact-modal-actions">
          <button 
            className="compact-modal-btn btn-secondary" 
            onClick={() => setShowPaymentModal(false)}
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

  // Multiple delivery modal
  const renderMultipleDeliveryModal = () => (
    <div className={`compact-modal-overlay ${showMultipleDelivery ? "active" : ""}`}>
      <div className="compact-modal">
        {/* Modal Header */}
        <div className="compact-modal-header">
          <h2>ADD MULTIPLE DELIVERIES</h2>
          <div className="compact-modal-steps">
            <span className="compact-step active">1</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="compact-modal-content">
          <div className="compact-form-group">
            <label className="compact-form-label">Upload Delivery File</label>
            <div className="compact-upload-area">
              <input
                type="file"
                id="multiple-file-upload"
                className="compact-file-input"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
              <label htmlFor="multiple-file-upload" className="compact-upload-label">
                <div className="compact-upload-icon">📁</div>
                <div className="compact-upload-text">Click to upload or drag and drop</div>
                <div className="compact-upload-subtext">CSV or Excel files only</div>
              </label>
            </div>
          </div>

          {uploadedFile && (
            <div className="compact-attachments-list">
              <div className="compact-attachment-item">
                <span className="compact-attachment-name">{uploadedFile.name}</span>
                <span className="compact-attachment-size">({Math.round(uploadedFile.size / 1024)} KB)</span>
                <button 
                  className="compact-action-btn delete"
                  onClick={removeUploadedFile}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="compact-modal-actions">
          <button 
            className="compact-modal-btn btn-secondary" 
            onClick={() => {
              setShowMultipleDelivery(false)
              setUploadedFile(null)
            }}
          >
            Cancel
          </button>
          <button 
            className="compact-modal-btn btn-primary"
            onClick={processMultipleDeliveries}
            disabled={!uploadedFile}
          >
            Process Deliveries
          </button>
        </div>
      </div>
    </div>
  )

  // Success modal with receipt
  const renderSuccessModal = () => (
    <div className={`compact-modal-overlay ${showSuccessModal ? "active" : ""}`}>
      <div className="compact-modal">
        {/* Modal Header */}
        <div className="compact-modal-header">
          <h2>DELIVERY COMPLETE</h2>
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
          <p>Payment received via {selectedPaymentMethod}</p>
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
              setActiveDelivery(null)
            }}
          >
            New Delivery
          </button>
        </div>
      </div>
    </div>
  )

  // Receipt display
  const renderReceipt = () => (
    <div className="compact-modal-overlay active">
      <div className="compact-modal">
        {/* Modal Header */}
        <div className="compact-modal-header">
          <h2>DELIVERY RECEIPT</h2>
          <div className="compact-modal-steps">
            <span className="compact-step active">1</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="compact-modal-content">
          <div ref={receiptRef} style={{ textAlign: 'left', padding: '1rem', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
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
        /* Delivery Specific Styles */
        .compact-contact-cell {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .compact-contact-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.7rem;
        }

        .compact-contact-phone {
          color: #64748b;
          font-size: 0.65rem;
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

        .compact-status {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
        }

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

        .compact-stat-item {
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          margin-bottom: 0.5rem;
        }

        .compact-stat-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .compact-stat-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.7rem;
        }

        .compact-stat-value {
          font-weight: 700;
          color: #3b82f6;
          font-size: 0.75rem;
        }

        .compact-wallet-balance {
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, #fde047 0%, #fbbf24 100%);
          border-radius: 4px;
          border: 1px solid #fde68a;
        }

        .compact-wallet-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .compact-wallet-currency {
          font-size: 1rem;
          color: #475569;
          margin-left: 0.25rem;
        }

        .compact-wallet-label {
          font-size: 0.7rem;
          color: #475569;
          margin-top: 0.25rem;
        }

        .compact-type-badge {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #dbeafe;
        }

        .compact-delivery-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .compact-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: white;
          border-radius: 3px;
          border: 1px solid #e2e8f0;
        }

        .compact-detail-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 600;
        }

        .compact-detail-value {
          font-size: 0.7rem;
          color: #1e293b;
          font-weight: 500;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        .compact-code-section {
          text-align: center;
          padding: 1rem;
          background: #fffbeb;
          border-radius: 4px;
          border: 1px solid #fde68a;
        }

        .compact-code-display {
          margin-top: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 4px;
          border: 1px solid #dbeafe;
        }

        .compact-code-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e40af;
          letter-spacing: 0.5rem;
          margin-bottom: 0.5rem;
          font-family: 'Courier New', monospace;
          background: white;
          padding: 0.5rem;
          border-radius: 4px;
          border: 2px dashed #93c5fd;
        }

        .compact-code-time {
          font-size: 0.7rem;
          color: #64748b;
        }

        .compact-delivery-id {
          font-size: 0.7rem;
          font-weight: 600;
          color: #3b82f6;
          font-family: 'Courier New', monospace;
        }

        .compact-breakdown-amount {
          font-size: 0.7rem;
          color: #1e40af;
          font-weight: 600;
          text-align: right;
          margin-top: 0.25rem;
        }

        .compact-section {
          background: white;
          border-radius: 6px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          text-align: center;
        }

        .success-icon {
          font-size: 3rem;
          color: #10b981;
          margin-bottom: 1rem;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .compact-content-grid > .compact-table-section {
            grid-column: span 1;
          }
          
          .compact-filters {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
}

export default Deliveries