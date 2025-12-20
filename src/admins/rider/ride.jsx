"use client"

import { useState, useEffect } from "react"
import "./ride.css"

const Ride = () => {
  const [screen, setScreen] = useState("dashboard")
  const [tripData, setTripData] = useState({
    pickup: "",
    destination: "",
    amount: 0,
    startTime: null,
    endTime: null,
    duration: 0,
    distance: 0,
    stops: [],
    notes: "",
    tripId: null,
  })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("momo")
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDestSuggestions, setShowDestSuggestions] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [manualOverride, setManualOverride] = useState(false)
  const [showMobilePayment, setShowMobilePayment] = useState(false)
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("")
  const [processingStep, setProcessingStep] = useState(0)
  const [splitPayment, setSplitPayment] = useState({
    cashAmount: 0,
    digitalAmount: 0,
    totalAmount: 0
  })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [isQRScanned, setIsQRScanned] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: ""
  })

  const [tripHistory, setTripHistory] = useState([
    {
      id: "Trip-007",
      from: "Kireka",
      to: "Banda",
      route: "Kireka - Banda",
      duration: "5.2km",
      time: "12min",
      amount: 2000,
      paymentMethod: "Cash",
      date: "Apr 23, 2025, 9:00 AM",
      status: "Completed",
      tripType: "Normal Trip",
      manualOverride: "YES",
      customer: "John Doe",
      phone: "+256 700000001",
    },
    {
      id: "Trip-008",
      from: "Gulu",
      to: "Nakaful",
      route: "Gulu - Nakaful",
      duration: "8.7km",
      time: "17min",
      amount: 8000,
      paymentMethod: "Cash",
      date: "Apr 23, 2025, 1:30 PM",
      status: "Cancelled",
      tripType: "Normal Trip",
      manualOverride: "NO",
      customer: "Jane Smith",
      phone: "+256 700000002",
    },
    {
      id: "Trip-009",
      from: "Kireka",
      to: "Banda",
      route: "Kireka - Banda",
      duration: "2.2km",
      time: "14min",
      amount: 6000,
      paymentMethod: "MTN MoMo",
      date: "Apr 23, 2025, 9:30 AM",
      status: "Completed",
      tripType: "Normal Trip",
      manualOverride: "YES",
      customer: "Alice Johnson",
      phone: "+256 700000003",
    },
    {
      id: "Trip-010",
      from: "Kireka",
      to: "Banda",
      route: "Kireka - Banda",
      duration: "4.5km",
      time: "30min",
      amount: 3000,
      paymentMethod: "MTN MoMo",
      date: "Apr 23, 2025, 6:00 AM",
      status: "Pending",
      tripType: "Quick Trip",
      manualOverride: "NO",
      customer: "Bob Williams",
      phone: "+256 700000004",
    },
    {
      id: "Trip-011",
      from: "Kireka",
      to: "Banda",
      route: "Kireka - Banda",
      duration: "5.3km",
      time: "21min",
      amount: 2000,
      paymentMethod: "Airtel Money",
      date: "Apr 23, 2025, 9:00 AM",
      status: "Completed",
      tripType: "Normal Trip",
      manualOverride: "NO",
      customer: "Carol Davis",
      phone: "+256 700000005",
    },
    {
      id: "Trip-012",
      from: "Kireka",
      to: "Banda",
      route: "Kireka - Banda",
      duration: "5.2km",
      time: "7min",
      amount: 8000,
      paymentMethod: "MTN MoMo",
      date: "Apr 23, 2025, 9:00 AM",
      status: "Completed",
      tripType: "Normal Trip",
      manualOverride: "NO",
      customer: "David Brown",
      phone: "+256 700000006",
    },
    {
      id: "Trip-013",
      from: "Kireka",
      to: "Banda",
      route: "Kireka - Banda",
      duration: "5.3km",
      time: "59min",
      amount: 12500,
      paymentMethod: "Cash",
      date: "Apr 23, 2025, 9:00 AM",
      status: "Completed",
      tripType: "Quick Trip",
      manualOverride: "YES",
      customer: "Eve Martinez",
      phone: "+256 700000007",
    },
    {
      id: "Trip-014",
      from: "Kireka",
      to: "Banda",
      route: "Kireka - Banda",
      duration: "5.2km",
      time: "4min",
      amount: 5000,
      paymentMethod: "Split Pay",
      date: "Apr 23, 2025, 9:00 AM",
      status: "Completed",
      tripType: "Normal Trip",
      manualOverride: "NO",
      customer: "Frank Wilson",
      phone: "+256 700000008",
    },
  ])

  const [historyFilters, setHistoryFilters] = useState({
    search: "",
    status: "All Status",
    tripType: "Normal Trip",
    paymentMethod: "All Status",
    route: "All Routes",
    dateRange: { start: "", end: "" },
    minFare: 0,
    maxFare: 3000,
    sortBy: "Date",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const popularLocations = ["Mukono", "Kampala", "Kireka", "Banda", "Ntinda", "Nakawa"]
  const paymentOptions = [
    { id: "cash", label: "CASH", icon: "💵", color: "bg-green-100 text-green-800" },
    { id: "momo", label: "MTN MoMo", icon: "📱", color: "bg-yellow-100 text-yellow-800" },
    { id: "airtel", label: "Airtel Money", icon: "📱", color: "bg-red-100 text-red-800" },
    { id: "visa", label: "Visa", icon: "💳", color: "bg-gray-800 text-white" },
    { id: "qr", label: "QR Code", icon: "⊞", color: "bg-purple-100 text-purple-800" },
    { id: "split", label: "Split Pay", icon: "◯◯", color: "bg-orange-100 text-orange-800" }
  ]

  useEffect(() => {
    let interval
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  useEffect(() => {
    if (showPaymentProcessing) {
      const steps = selectedPayment === "split" ? 5 : 4
      const stepInterval = setInterval(() => {
        setProcessingStep((prev) => {
          if (prev >= steps) {
            clearInterval(stepInterval)
            setTimeout(() => {
              handlePaymentComplete()
            }, 1000)
            return prev
          }
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(stepInterval)
    }
  }, [showPaymentProcessing, selectedPayment])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} min ${secs < 10 ? "0" : ""}${secs} sec`
  }

  const handleStartTrip = () => {
    if (!tripData.pickup || !tripData.destination || !tripData.amount) {
      alert("Please fill in all required fields")
      return
    }
    const newTripId = "T" + Math.floor(Math.random() * 90000 + 10000)
    setTripData({
      ...tripData,
      startTime: new Date(),
      tripId: newTripId,
    })
    setTimer(0)
    setIsTimerRunning(true)
    setScreen("activeTrip")
  }

  const handleEndTrip = () => {
    setIsTimerRunning(false)
    setTripData({
      ...tripData,
      endTime: new Date(),
      duration: timer,
      distance: (Math.random() * 10 + 1).toFixed(1),
    })
    setScreen("reviewTrip")
  }

  const handleReceivePayment = () => {
    if (window.innerWidth <= 768) {
      setShowMobilePayment(true)
    } else {
      setScreen("payment")
    }
  }

  const simulatePaymentProcessing = () => {
    setShowPaymentProcessing(true)
    setProcessingStep(0)
    setPaymentStatus("processing")
    
    // Reset split payment if not selected
    if (selectedPayment !== "split") {
      setSplitPayment({
        cashAmount: 0,
        digitalAmount: 0,
        totalAmount: 0
      })
    }
  }

  const handleSplitPaymentChange = (type, value) => {
    const numValue = parseInt(value) || 0
    const newSplit = { ...splitPayment }
    
    if (type === 'cash') {
      newSplit.cashAmount = numValue
    } else if (type === 'digital') {
      newSplit.digitalAmount = numValue
    }
    
    newSplit.totalAmount = newSplit.cashAmount + newSplit.digitalAmount
    setSplitPayment(newSplit)
  }

  const handleMobilePayment = () => {
    if (selectedPayment === "momo" || selectedPayment === "airtel") {
      if (!phoneNumber) {
        alert("Please enter phone number")
        return
      }
      simulatePaymentProcessing()
    } else if (selectedPayment === "split") {
      if (splitPayment.totalAmount !== tripData.amount) {
        alert(`Split amounts must equal total amount (${tripData.amount.toLocaleString()} UGX)`)
        return
      }
      simulatePaymentProcessing()
    } else if (selectedPayment === "visa") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        alert("Please enter all card details")
        return
      }
      simulatePaymentProcessing()
    } else {
      simulatePaymentProcessing()
    }
  }

  const handleQRScan = () => {
    setShowQRScanner(true)
    setIsQRScanned(false)
    
    // Simulate QR scanning
    setTimeout(() => {
      setIsQRScanned(true)
      setTimeout(() => {
        setShowQRScanner(false)
        simulatePaymentProcessing()
      }, 1000)
    }, 2000)
  }

  const getProcessingSteps = () => {
    const steps = [
      { text: "Initializing payment..." },
      { text: "Processing transaction..." },
      { text: "Verifying payment..." },
      { text: "Completing transaction..." }
    ]
    
    if (selectedPayment === "split") {
      steps.splice(1, 0, { text: "Processing split payment..." })
    }
    
    if (selectedPayment === "momo" || selectedPayment === "airtel") {
      steps[0] = { text: `Sending request to ${selectedPayment === "momo" ? "MTN MoMo" : "Airtel Money"}...` }
    }
    
    return steps
  }

  const handlePaymentComplete = () => {
    const newTrip = {
      id: tripData.tripId,
      from: tripData.pickup,
      to: tripData.destination,
      route: `${tripData.pickup} - ${tripData.destination}`,
      duration: `${tripData.distance} km`,
      time: formatTime(tripData.duration),
      amount: tripData.amount,
      paymentMethod:
        selectedPayment === "momo"
          ? "MTN MoMo"
          : selectedPayment === "airtel"
            ? "Airtel Money"
            : selectedPayment === "visa"
              ? "Visa"
              : selectedPayment === "split"
                ? "Split Pay"
                : selectedPayment === "qr"
                  ? "QR Code"
                  : "Cash",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "Completed",
      tripType: "Normal Trip",
      manualOverride: manualOverride ? "YES" : "NO",
      customer: "Unknown",
      phone: "+256 70xxxxxxxx",
    }
    setTripHistory([newTrip, ...tripHistory])
    setShowMobilePayment(false)
    setShowPaymentProcessing(false)
    setScreen("invoice")
    
    // Reset payment states
    setPhoneNumber("")
    setCardDetails({ number: "", expiry: "", cvv: "" })
    setSplitPayment({ cashAmount: 0, digitalAmount: 0, totalAmount: 0 })
  }

  const handleSaveTrip = () => {
    setModalType("saved")
    setShowModal(true)
  }

  const handleCancelTrip = () => {
    setScreen("cancelReason")
  }

  const handleCancelConfirm = () => {
    setTripData({
      pickup: "",
      destination: "",
      amount: 0,
      startTime: null,
      endTime: null,
      duration: 0,
      distance: 0,
      stops: [],
      notes: "",
      tripId: null,
    })
    setTimer(0)
    setIsTimerRunning(false)
    setScreen("dashboard")
  }

  const addIntermediateStop = () => {
    setTripData({
      ...tripData,
      stops: [...tripData.stops, { location: "", amount: 0 }],
    })
  }

  const updateStop = (index, field, value) => {
    const newStops = [...tripData.stops]
    newStops[index][field] = value
    setTripData({ ...tripData, stops: newStops })
  }

  const removeStop = (index) => {
    const newStops = tripData.stops.filter((_, i) => i !== index)
    setTripData({ ...tripData, stops: newStops })
  }

  const filteredTrips = tripHistory.filter((trip) => {
    const matchesSearch =
      trip.route.toLowerCase().includes(historyFilters.search.toLowerCase()) ||
      trip.id.toLowerCase().includes(historyFilters.search.toLowerCase()) ||
      trip.customer.toLowerCase().includes(historyFilters.search.toLowerCase()) ||
      trip.phone.includes(historyFilters.search)

    const matchesStatus = historyFilters.status === "All Status" || trip.status === historyFilters.status
    const matchesTripType = historyFilters.tripType === "Normal Trip" || trip.tripType === historyFilters.tripType
    const matchesPayment =
      historyFilters.paymentMethod === "All Status" || trip.paymentMethod === historyFilters.paymentMethod
    const matchesFare = trip.amount >= historyFilters.minFare && trip.amount <= historyFilters.maxFare

    return matchesSearch && matchesStatus && matchesTripType && matchesPayment && matchesFare
  })

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage)
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const stats = {
    total: tripHistory.length,
    totalMoney: tripHistory.reduce((sum, trip) => sum + trip.amount, 0),
    completed: tripHistory.filter((t) => t.status === "Completed").length,
    cancellationRate: ((tripHistory.filter((t) => t.status === "Cancelled").length / tripHistory.length) * 100).toFixed(1),
  }

  const clearFilters = () => {
    setHistoryFilters({
      search: "",
      status: "All Status",
      tripType: "Normal Trip",
      paymentMethod: "All Status",
      route: "All Routes",
      dateRange: { start: "", end: "" },
      minFare: 0,
      maxFare: 3000,
      sortBy: "Date",
    })
    setCurrentPage(1)
  }

  const handleEditPickup = () => {
    setShowPickupSuggestions(true)
  }

  const handleEditDestination = () => {
    setShowDestSuggestions(true)
  }

  const handleSaveChanges = () => {
    alert("Changes saved successfully!")
  }

  const handleViewTripDetails = (tripId) => {
    alert(`Viewing details for trip ${tripId}`)
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(tripHistory, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `trip-history-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleShareData = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Trip History',
        text: `Check out my ride history: ${stats.total} trips, ${stats.totalMoney.toLocaleString()} UGX total`,
        url: window.location.href,
      })
    } else {
      alert("Share feature is available on mobile devices with Web Share API support")
    }
  }

  const handleQuickAction = (action) => {
    switch(action) {
      case "delivery":
        alert("Delivery feature coming soon!")
        break
      case "receive":
        alert("Money receiving feature coming soon!")
        break
      case "withdraw":
        alert("Withdrawal feature coming soon!")
        break
      case "expenses":
        alert("Expense tracking feature coming soon!")
        break
      default:
        break
    }
  }

  const renderPaymentContent = () => {
    if (selectedPayment === "split") {
      return (
        <div className="split-payment-section fade-in">
          <h3 className="text-xl font-bold mb-2">Split Payment</h3>
          <p className="text-gray-600 mb-4">Divide payment between cash and digital</p>
          
          <div className="split-payment-inputs">
            <div className="split-payment-row">
              <div className="split-amount-input">
                <span className="text-gray-500">Cash:</span>
                <input
                  type="number"
                  value={splitPayment.cashAmount}
                  onChange={(e) => handleSplitPaymentChange('cash', e.target.value)}
                  placeholder="0"
                  className="text-right"
                />
                <span className="currency">UGX</span>
              </div>
              <span className="split-payment-plus">+</span>
              <div className="split-amount-input">
                <span className="text-gray-500">Digital:</span>
                <input
                  type="number"
                  value={splitPayment.digitalAmount}
                  onChange={(e) => handleSplitPaymentChange('digital', e.target.value)}
                  placeholder="0"
                  className="text-right"
                />
                <span className="currency">UGX</span>
              </div>
            </div>
            
            <div className="split-payment-total">
              <span>Total:</span>
              <span className="amount">{splitPayment.totalAmount.toLocaleString()} UGX</span>
            </div>
            
            {splitPayment.totalAmount !== tripData.amount && (
              <div className="text-red-500 text-sm mt-2">
                Total must equal {tripData.amount.toLocaleString()} UGX
              </div>
            )}
          </div>
          
          <div className="payment-actions flex gap-3 mt-6">
            <button className="btn-secondary flex-1" onClick={() => setScreen("reviewTrip")}>
              Cancel
            </button>
            <button 
              className="btn-primary flex-1" 
              onClick={handleMobilePayment}
              disabled={splitPayment.totalAmount !== tripData.amount}
            >
              Process Split Payment
            </button>
          </div>
        </div>
      )
    }
    
    if (selectedPayment === "momo" || selectedPayment === "airtel") {
      return (
        <div className="mobile-money-section fade-in">
          <h3 className="text-xl font-bold mb-2">{selectedPayment === "momo" ? "MTN MoMo" : "Airtel Money"} Payment</h3>
          
          <div className="form-group mb-4">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="+256 700 000 000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="amount-display-prompt bg-gray-50 p-4 rounded-lg mb-4">
            <div className="amount text-2xl font-bold">{tripData.amount.toLocaleString()}</div>
            <div className="currency text-gray-600">UGX</div>
          </div>
          
          <div className="payment-method-display bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center font-semibold mb-6">
            {selectedPayment === "momo" ? "MTN MoMo" : "Airtel Money"}
          </div>
          
          <div className="payment-actions flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setScreen("reviewTrip")}>
              Cancel
            </button>
            <button 
              className="btn-primary flex-1" 
              onClick={handleMobilePayment}
              disabled={!phoneNumber}
            >
              Request Payment
            </button>
          </div>
        </div>
      )
    }
    
    if (selectedPayment === "qr") {
      return (
        <div className="qr-payment-section fade-in">
          <h3 className="text-xl font-bold mb-2">QR Code Payment</h3>
          <p className="text-gray-600 mb-4">Scan QR code to complete payment</p>
          
          {showQRScanner ? (
            <div className="qr-scanner">
              <div className="qr-frame">
                <div className="scan-line"></div>
              </div>
              {isQRScanned && (
                <div className="text-green-500 font-semibold mt-4 text-center">
                  ✓ QR Code Scanned Successfully
                </div>
              )}
            </div>
          ) : (
            <div className="qr-display text-center">
              <div className="bg-white p-6 rounded-lg inline-block shadow-md">
                <div className="text-4xl mb-2">⊞</div>
                <div className="font-semibold">Payment QR Code</div>
                <div className="text-sm text-gray-500 mt-2">
                  Amount: {tripData.amount.toLocaleString()} UGX
                </div>
              </div>
              <button 
                className="btn-primary mt-4 w-full"
                onClick={handleQRScan}
              >
                Scan QR Code
              </button>
            </div>
          )}
          
          <div className="payment-actions mt-6">
            <button className="btn-secondary w-full" onClick={() => setScreen("reviewTrip")}>
              Cancel
            </button>
          </div>
        </div>
      )
    }
    
    if (selectedPayment === "visa") {
      return (
        <div className="card-payment-section fade-in">
          <h3 className="text-xl font-bold mb-2">Card Payment</h3>
          <p className="text-gray-600 mb-4">Enter card details to complete payment</p>
          
          <div className="card-inputs space-y-4 mb-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Card Number</label>
              <input 
                type="text" 
                placeholder="4111 1111 1111 1111" 
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700 mb-2">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 mb-2">CVV</label>
                <input 
                  type="text" 
                  placeholder="123" 
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="payment-actions flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setScreen("reviewTrip")}>
              Cancel
            </button>
            <button className="btn-primary flex-1" onClick={handleMobilePayment}>
              Process Card Payment
            </button>
          </div>
        </div>
      )
    }
    
    // Cash payment (default)
    return (
      <div className="cash-payment-section fade-in">
        <div className="payment-amount-section mb-6">
          <label className="block text-gray-700 mb-2">Enter Cash Amount Received</label>
          <div className="payment-amount-display bg-blue-50 p-6 rounded-lg">
            <span className="amount text-3xl font-bold">{tripData.amount.toLocaleString()}</span>
            <span className="currency text-xl text-blue-600 font-semibold ml-2">UGX</span>
          </div>
        </div>
        
        <div className="payment-actions flex gap-3">
          <button className="btn-secondary flex-1" onClick={() => setScreen("reviewTrip")}>
            Cancel
          </button>
          <button className="btn-primary flex-1" onClick={simulatePaymentProcessing}>
            Confirm Cash Received
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ride-container">
      {/* Dashboard Screen */}
      {screen === "dashboard" && (
        <div className="screen dashboard-screen fade-in">
          <div className="search-bar">
            <input type="text" placeholder="Search trips, customers..." />
            <div className="header-icons">
              <div className="icon">🔔</div>
              <div className="icon">⚙️</div>
              <div className="icon">👤</div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => setScreen("newTrip")}>
                <span>🚗</span>
                Start Trip
              </button>
              <button className="action-btn secondary" onClick={() => handleQuickAction("delivery")}>
                <span>📦</span>
                Start Delivery
              </button>
              <button className="action-btn secondary" onClick={() => handleQuickAction("receive")}>
                <span>💰</span>
                Receive Money
              </button>
              <button className="action-btn secondary" onClick={() => handleQuickAction("withdraw")}>
                <span>🏧</span>
                Withdraw Money
              </button>
              <button className="action-btn secondary" onClick={() => handleQuickAction("expenses")}>
                <span>📊</span>
                Add Expenses
              </button>
            </div>
          </div>

          <div className="wallet-balance">
            <div className="balance-info">
              <div className="balance-label">Wallet Balance</div>
              <div className="balance-amount">
                40,000 <span>UGX</span>
              </div>
            </div>
            <div className="available-label">Available Balance</div>
          </div>

          <div className="ready-to-ride">
            <div className="scooter-icon">🏍️</div>
            <h2>Ready to Ride?</h2>
            <p>Start A New Trip And Start Earning</p>
            <button className="start-new-trip-btn" onClick={() => setScreen("newTrip")}>
              START NEW TRIP →
            </button>
          </div>

          <div className="trip-history-section">
            <div className="history-header">
              <div>
                <h2>Trip History</h2>
                <p className="subtitle">View completed trip summary</p>
              </div>
              <button className="view-detailed-btn" onClick={() => setScreen("tripHistory")}>
                View Detailed Trip History
              </button>
            </div>

            <div className="history-grid">
              {tripHistory.slice(0, 2).map((trip, index) => (
                <div key={index} className="history-item slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="history-row">
                    <div className="history-col">
                      <div className="label">Route</div>
                      <div className="value route">
                        {trip.from}
                        <br />
                        {trip.to}
                      </div>
                    </div>
                    <div className="history-col">
                      <div className="label">Duration</div>
                      <div className="value">{trip.time}</div>
                    </div>
                    <div className="history-col">
                      <div className="label">Distance</div>
                      <div className="value">{trip.duration}</div>
                    </div>
                  </div>
                  <div className="history-footer">
                    <span className="amount-badge">{trip.amount.toLocaleString()} UGX</span>
                    <span className={`payment-badge ${trip.paymentMethod.toLowerCase().replace(" ", "-")}`}>
                      {trip.paymentMethod}
                    </span>
                    <span className="manual-badge">Manual Override</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Trip Screen */}
      {screen === "newTrip" && (
        <div className="screen new-trip-screen fade-in">
          <div className="screen-header yellow">New Trip</div>

          <div className="form-content">
            <h2 className="form-title">Trip Setup Form</h2>
            <p className="form-subtitle">Configure your trip details and start your journey</p>

            <div className="form-row">
              <div className="form-group">
                <label>Enter Pickup Location</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Mukono"
                    value={tripData.pickup}
                    onChange={(e) => setTripData({ ...tripData, pickup: e.target.value })}
                    onFocus={() => setShowPickupSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                  />
                  {showPickupSuggestions && (
                    <div className="suggestions-dropdown">
                      <div className="suggestions-header">Popular Locations</div>
                      {popularLocations.map((loc, idx) => (
                        <div
                          key={idx}
                          className="suggestion-item"
                          onClick={() => {
                            setTripData({ ...tripData, pickup: loc })
                            setShowPickupSuggestions(false)
                          }}
                        >
                          📍 {loc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-divider">TO</div>

              <div className="form-group">
                <label>Enter Destination</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Kampala"
                    value={tripData.destination}
                    onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                    onFocus={() => setShowDestSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                  />
                  {showDestSuggestions && (
                    <div className="suggestions-dropdown">
                      <div className="suggestions-header">Frequent Destinations</div>
                      {popularLocations.map((loc, idx) => (
                        <div
                          key={idx}
                          className="suggestion-item"
                          onClick={() => {
                            setTripData({ ...tripData, destination: loc })
                            setShowDestSuggestions(false)
                          }}
                        >
                          📍 {loc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="amount-section">
              <label>Enter Amount</label>
              <div className="amount-display">
                <input
                  type="number"
                  value={tripData.amount || ""}
                  onChange={(e) => setTripData({ ...tripData, amount: Number.parseInt(e.target.value) || 0 })}
                  placeholder="2,000"
                />
                <span className="currency">UGX</span>
              </div>
              <button
                className="change-amount-btn"
                onClick={() => {
                  const newAmount = prompt("Enter new amount:")
                  if (newAmount) setTripData({ ...tripData, amount: Number.parseInt(newAmount) })
                }}
              >
                Change Amount
              </button>
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleStartTrip}>
                START TRIP
              </button>
              <button className="btn-secondary" onClick={handleSaveTrip}>
                SAVE TRIP
              </button>
              <button
                className="btn-secondary"
                onClick={() => setTripData({ ...tripData, pickup: "", destination: "", amount: 0 })}
              >
                CLEAR FORM
              </button>
            </div>

            <button className="btn-danger" onClick={() => setScreen("dashboard")}>
              CANCEL TRIP
            </button>
          </div>
        </div>
      )}

      {/* Active Trip Screen */}
      {screen === "activeTrip" && (
        <div className="screen active-trip-screen fade-in">
          <div className="screen-header blue">
            Active Trip
            <span className="status-badge">In Progress</span>
          </div>

          <p className="screen-subtitle">Manage your rides efficiently</p>

          <div className="trip-metrics">
            <div className="metric-card pulse">
              <div className="metric-label">Duration</div>
              <div className="metric-value">{formatTime(timer)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Distance</div>
              <div className="metric-value">{(timer * 0.05).toFixed(1)} km</div>
            </div>
          </div>

          <div className="trip-details-card">
            <div className="detail-row">
              <span className="detail-label">FROM:</span>
              <span className="detail-value">{tripData.pickup}</span>
              <button className="edit-btn" onClick={handleEditPickup}>
                EDIT
              </button>
            </div>
            <div className="detail-row">
              <span className="detail-label">TO:</span>
              <span className="detail-value">{tripData.destination}</span>
              <button className="edit-btn" onClick={handleEditDestination}>
                EDIT
              </button>
            </div>
          </div>

          <div className="intermediate-stops-section">
            <div className="section-header">
              <span className="section-title">Intermediate Stops</span>
              <button className="add-stop-btn" onClick={addIntermediateStop}>
                + Add Stop
              </button>
            </div>

            {tripData.stops.map((stop, index) => (
              <div key={index} className="stop-item fade-in">
                <div className="stop-input-group">
                  <label>Enter Stop Manually</label>
                  <input
                    type="text"
                    placeholder="Seeta"
                    value={stop.location}
                    onChange={(e) => updateStop(index, "location", e.target.value)}
                  />
                </div>
                <div className="stop-input-group">
                  <label>Enter Amount Manually</label>
                  <div className="amount-input">
                    <input
                      type="number"
                      placeholder="2,000"
                      value={stop.amount || ""}
                      onChange={(e) => updateStop(index, "amount", Number.parseInt(e.target.value) || 0)}
                    />
                    <span className="currency">UGX</span>
                  </div>
                </div>
                <button className="remove-stop-btn" onClick={() => removeStop(index)}>
                  - Remove Stop
                </button>
              </div>
            ))}

            <div className="trip-notes">
              <label>Trip Notes (Optional)</label>
              <textarea
                placeholder="Delivery instructions, Multistop info etc..."
                value={tripData.notes}
                onChange={(e) => setTripData({ ...tripData, notes: e.target.value })}
              />
            </div>

            {tripData.stops.length > 0 && (
              <button className="save-changes-btn" onClick={handleSaveChanges}>
                Save Changes
              </button>
            )}
          </div>

          <button className="end-trip-btn" onClick={handleEndTrip}>
            End Trip
          </button>
        </div>
      )}

      {/* Review Trip Screen */}
      {screen === "reviewTrip" && (
        <div className="screen review-trip-screen fade-in">
          <div className="screen-header yellow">
            Review and Complete Trip
            <span className="status-badge ended">Trip Ended</span>
          </div>

          <p className="screen-subtitle blue">Review and finalize trip details before payment</p>

          <div className="trip-summary">
            <h2>Trip Summary</h2>
            <div className="summary-row">
              <span className="summary-label">From:</span>
              <span className="summary-value">{tripData.pickup}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">To:</span>
              <span className="summary-value">{tripData.destination}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Duration Stop</span>
              <span className="summary-value">{formatTime(tripData.duration)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Distance Covered</span>
              <span className="summary-value">{tripData.distance} km</span>
            </div>
          </div>

          <div className="total-amount-section">
            <h2>Total Amount</h2>
            <div className="amount-display-large">
              <div className="amount-value">
                {manualOverride ? (
                  <input
                    type="number"
                    value={tripData.amount}
                    onChange={(e) => setTripData({ ...tripData, amount: Number.parseInt(e.target.value) || 0 })}
                    className="amount-input-large"
                  />
                ) : (
                  tripData.amount.toLocaleString()
                )}
                <span className="currency">UGX</span>
              </div>
              <button className="edit-amount-btn" onClick={() => setManualOverride(!manualOverride)}>
                Edit
              </button>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="manualOverride"
                checked={manualOverride}
                onChange={(e) => setManualOverride(e.target.checked)}
              />
              <label htmlFor="manualOverride">Manual Amount Override</label>
            </div>
          </div>

          <div className="review-actions">
            <button className="btn-secondary" onClick={handleSaveTrip}>
              Save Trip
            </button>
            <button className="btn-primary" onClick={handleReceivePayment}>
              Receive Money
            </button>
          </div>
        </div>
      )}

      {/* Payment Screen */}
      {screen === "payment" && (
        <div className="screen payment-screen fade-in">
          <div className="screen-header blue">Receive Money</div>

          <div className="payment-content">
            <div className="payment-methods mb-6">
              <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>
              <div className="payment-options grid grid-cols-3 gap-4">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`payment-option ${selectedPayment === option.id ? "selected" : ""} ${option.color} p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105`}
                    onClick={() => setSelectedPayment(option.id)}
                  >
                    <div className="payment-icon text-2xl mb-2">{option.icon}</div>
                    <div className="payment-label text-sm font-semibold">{option.label}</div>
                    {selectedPayment === option.id && (
                      <div className="checkmark absolute top-2 right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {renderPaymentContent()}
          </div>
        </div>
      )}

      {/* Invoice Screen */}
      {screen === "invoice" && (
        <div className="screen invoice-screen fade-in">
          <div className="invoice-container bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <div className="invoice-header text-2xl font-bold text-center mb-4">Customer Receipt</div>
            <div className="invoice-type text-center bg-blue-100 text-blue-800 py-2 rounded-lg font-semibold mb-6">
              Normal Trip
            </div>

            <div className="rider-info text-center text-gray-600 mb-6">Rider: Moses K. (ID: R1022)</div>

            <div className="invoice-section mb-6">
              <div className="section-title font-bold text-lg mb-3">TRIP DETAILS</div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Pickup Location:</span>
                <span className="invoice-value">{tripData.pickup} stage</span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Destination:</span>
                <span className="invoice-value">Uganda House - {tripData.destination}</span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Start Time & Date:</span>
                <span className="invoice-value">
                  {tripData.startTime?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}{" "}
                  {tripData.startTime?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">End Time & Date:</span>
                <span className="invoice-value">
                  {tripData.endTime?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}{" "}
                  {tripData.endTime?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Distance:</span>
                <span className="invoice-value">{tripData.distance} km</span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Duration:</span>
                <span className="invoice-value">{formatTime(tripData.duration)}</span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Amount Paid:</span>
                <span className="invoice-value font-bold text-green-600">UGX {tripData.amount.toLocaleString()}</span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Payment Method:</span>
                <span className="invoice-value">
                  {selectedPayment === "momo"
                    ? "MTN MoMo"
                    : selectedPayment === "airtel"
                      ? "Airtel Money"
                      : selectedPayment === "visa"
                        ? "Visa"
                        : selectedPayment === "split"
                          ? "Split Pay"
                          : selectedPayment === "qr"
                            ? "QR Code"
                            : "Cash"}
                </span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Payment Status:</span>
                <span className="invoice-value status-paid bg-green-100 text-green-800 px-2 py-1 rounded">Paid</span>
              </div>
              <div className="invoice-row flex justify-between py-2 border-b">
                <span className="invoice-label font-semibold">Receipt Code:</span>
                <span className="invoice-value font-mono">NTR00XD40002</span>
              </div>
              <div className="invoice-row flex justify-between py-2">
                <span className="invoice-label font-semibold">Trip ID:</span>
                <span className="invoice-value font-bold">{tripData.tripId}</span>
              </div>
            </div>

            <div className="invoice-section mb-6">
              <div className="section-title font-bold text-lg mb-3">Notes</div>
              <p className="invoice-notes text-gray-600">Thanks for riding with Moses</p>
            </div>

            <div className="invoice-section mb-6">
              <div className="section-title font-bold text-lg mb-3">SUPPORT</div>
              <div className="invoice-row flex justify-between py-2">
                <span className="invoice-label font-semibold">Rider Contact:</span>
                <span className="invoice-value">+256 70xxxxxxxxx</span>
              </div>
            </div>

            <div className="invoice-actions flex gap-3 mb-6">
              <button className="invoice-btn bg-blue-100 text-blue-800 flex-1 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
                Share
              </button>
              <button className="invoice-btn bg-red-100 text-red-800 flex-1 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors">
                Report Issue
              </button>
              <button className="invoice-btn bg-green-100 text-green-800 flex-1 py-3 rounded-lg font-semibold hover:bg-green-200 transition-colors">
                Download
              </button>
            </div>

            <button
              className="back-to-dashboard-btn w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              onClick={() => {
                setScreen("dashboard")
                setTripData({
                  pickup: "",
                  destination: "",
                  amount: 0,
                  startTime: null,
                  endTime: null,
                  duration: 0,
                  distance: 0,
                  stops: [],
                  notes: "",
                  tripId: null,
                })
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Cancel Reason Screen */}
      {screen === "cancelReason" && (
        <div className="screen cancel-reason-screen fade-in">
          <div className="screen-header red">Cancel Trip</div>
          <h2 className="text-2xl font-bold mt-4">Why are you canceling?</h2>
          <p className="screen-subtitle text-gray-600 mb-8">Help us understand your reason</p>

          <div className="cancel-reasons grid grid-cols-2 gap-3 mb-6">
            {[
              "Customer not available",
              "Wrong pickup location",
              "Traffic issues",
              "Vehicle problem",
              "Customer requested",
              "Other",
            ].map((reason, idx) => (
              <div
                key={idx}
                className={`reason-option p-4 border rounded-lg cursor-pointer transition-colors ${
                  cancelReason === reason ? "bg-red-100 border-red-500" : "hover:bg-gray-50"
                }`}
                onClick={() => setCancelReason(reason)}
              >
                {reason}
              </div>
            ))}
          </div>

          {cancelReason === "Other" && (
            <textarea 
              className="other-reason-input w-full p-3 border rounded-lg mb-6" 
              placeholder="Please specify your reason..."
              rows="3"
            />
          )}

          <div className="cancel-actions flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setScreen(tripData.startTime ? "activeTrip" : "newTrip")}>
              Go Back
            </button>
            <button className="btn-danger flex-1" onClick={handleCancelConfirm}>
              Confirm Cancellation
            </button>
          </div>
        </div>
      )}

      {/* Trip History Dashboard */}
      {screen === "tripHistory" && (
        <div className="screen trip-history-dashboard fade-in">
          <div className="history-dashboard-header">
            <div className="header-top">
              <button className="back-btn" onClick={() => setScreen("dashboard")}>
                ← Back
              </button>
              <h1 className="text-3xl font-bold text-blue-800">Trip History Dashboard</h1>
              <div className="header-actions">
                <button className="export-btn" onClick={handleExportData}>
                  📤 Export
                </button>
                <button className="share-btn" onClick={handleShareData}>
                  🔗 Share
                </button>
                <div className="user-badge">
                  <span className="user-icon">👤</span>
                  <span className="user-name">Moses K</span>
                  <span className="user-id">MK</span>
                </div>
              </div>
            </div>
            <p className="dashboard-subtitle text-gray-600">
              View real-time trip analytics, all completed trips and their history details
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">🚗</div>
              <div className="stat-info">
                <div className="stat-label">Total Trips</div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-change">+12 from yesterday</div>
              </div>
            </div>
            <div className="stat-card dark">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-label">Total Money</div>
                <div className="stat-value">
                  {stats.totalMoney.toLocaleString()} <span className="stat-currency">UGX</span>
                </div>
                <div className="stat-change">+6% Up from yesterday</div>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">✓</div>
              <div className="stat-info">
                <div className="stat-label">Completed Trips</div>
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-change">+40% Up from yesterday</div>
              </div>
            </div>
            <div className="stat-card yellow">
              <div className="stat-icon">⚠</div>
              <div className="stat-info">
                <div className="stat-label">Cancellation Rate</div>
                <div className="stat-value">{stats.cancellationRate}%</div>
                <div className="stat-change">-3% less from yesterday</div>
              </div>
            </div>
          </div>

          <div className="history-content-wrapper">
            <div className="filters-sidebar">
              <div className="search-section">
                <h3>Search</h3>
                <input
                  type="text"
                  placeholder="Trip ID, Phone, Customer..."
                  value={historyFilters.search}
                  onChange={(e) => setHistoryFilters({ ...historyFilters, search: e.target.value })}
                />
              </div>

              <div className="filters-section">
                <h3>Filters</h3>

                <div className="filter-group">
                  <label>Trip status</label>
                  <select
                    value={historyFilters.status}
                    onChange={(e) => setHistoryFilters({ ...historyFilters, status: e.target.value })}
                  >
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                    <option>No-show</option>
                    <option>In-progress</option>
                    <option>Pending</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Trip Type</label>
                  <select
                    value={historyFilters.tripType}
                    onChange={(e) => setHistoryFilters({ ...historyFilters, tripType: e.target.value })}
                  >
                    <option>Normal Trip</option>
                    <option>Quick Trip</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Payment Method</label>
                  <select
                    value={historyFilters.paymentMethod}
                    onChange={(e) => setHistoryFilters({ ...historyFilters, paymentMethod: e.target.value })}
                  >
                    <option>All Status</option>
                    <option>Cash</option>
                    <option>MTN MoMo</option>
                    <option>Airtel Money</option>
                    <option>Split Pay</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Routes</label>
                  <select
                    value={historyFilters.route}
                    onChange={(e) => setHistoryFilters({ ...historyFilters, route: e.target.value })}
                  >
                    <option>All Routes</option>
                    <option>Kireka - Banda</option>
                    <option>Mukono - Kampala</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>
                    Amount Range: UGX {historyFilters.minFare} - UGX {historyFilters.maxFare}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15000"
                    value={historyFilters.maxFare}
                    onChange={(e) => setHistoryFilters({ ...historyFilters, maxFare: Number.parseInt(e.target.value) })}
                    className="fare-slider"
                  />
                </div>

                <div className="filter-group">
                  <label>Sort By</label>
                  <select
                    value={historyFilters.sortBy}
                    onChange={(e) => setHistoryFilters({ ...historyFilters, sortBy: e.target.value })}
                  >
                    <option>Date</option>
                    <option>Newest</option>
                  </select>
                </div>

                <button className="clear-filter-btn" onClick={clearFilters}>
                  Clear All Filter
                </button>
              </div>
            </div>

            <div className="trips-table-section">
              <div className="table-wrapper">
                <table className="trips-table">
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Route & Time taken</th>
                      <th>Distance & Time taken</th>
                      <th>Amount</th>
                      <th>Manual Over ride</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTrips.map((trip, index) => (
                      <tr key={index} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        <td>
                          <div className="trip-id">{trip.id}</div>
                          <div className="trip-date">{trip.date}</div>
                        </td>
                        <td>
                          <div className="route-info">
                            <div className="route">{trip.route}</div>
                            <div className="time">{trip.time}</div>
                          </div>
                        </td>
                        <td>
                          <div className="distance-info">
                            <div className="distance">{trip.duration}</div>
                            <div className="time">{trip.time}</div>
                          </div>
                        </td>
                        <td>
                          <div className="amount-cell">UGX {trip.amount.toLocaleString()}</div>
                        </td>
                        <td>
                          <span className={`override-badge ${trip.manualOverride === "YES" ? "yes" : "no"}`}>
                            {trip.manualOverride}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`payment-method-badge ${trip.paymentMethod.toLowerCase().replace(" ", "-")}`}
                          >
                            {trip.paymentMethod}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge-table ${trip.status.toLowerCase()}`}>{trip.status}</span>
                        </td>
                        <td>
                          <button 
                            className="action-btn-table bg-blue-100 text-blue-800"
                            onClick={() => handleViewTripDetails(trip.id)}
                          >
                            👁
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <div className="pagination-info">Showing {paginatedTrips.length} trips</div>
                <div className="pagination-controls">
                  <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Payment Modal */}
      {showMobilePayment && (
        <div className="modal-overlay" onClick={() => setShowMobilePayment(false)}>
          <div className="mobile-payment-modal fade-in scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-payment-header">Receive Money</div>

            <div className="mobile-payment-content">
              <div className="mobile-payment-methods mb-6">
                <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
                <div className="mobile-payment-grid">
                  {paymentOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`mobile-payment-option ${selectedPayment === option.id ? "selected" : ""}`}
                      onClick={() => setSelectedPayment(option.id)}
                    >
                      <div className="payment-icon text-2xl">{option.icon}</div>
                      {selectedPayment === option.id && <div className="checkmark">✓</div>}
                      <span className="payment-label">{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPayment === "split" && (
                <div className="split-payment-mobile mb-6">
                  <div className="split-row flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Cash Amount</label>
                      <input
                        type="number"
                        placeholder="Cash"
                        value={splitPayment.cashAmount}
                        onChange={(e) => handleSplitPaymentChange('cash', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Digital Amount</label>
                      <input
                        type="number"
                        placeholder="Digital"
                        value={splitPayment.digitalAmount}
                        onChange={(e) => handleSplitPaymentChange('digital', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="total-display bg-gray-100 p-3 rounded text-center font-semibold">
                    Total: {splitPayment.totalAmount.toLocaleString()} UGX
                  </div>
                </div>
              )}

              {selectedPayment === "momo" && (
                <div className="phone-input-mobile mb-6">
                  <label className="block text-sm mb-2">Phone Number for MTN MoMo</label>
                  <input
                    type="tel"
                    placeholder="+256 700 000 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              )}

              {selectedPayment === "airtel" && (
                <div className="phone-input-mobile mb-6">
                  <label className="block text-sm mb-2">Phone Number for Airtel Money</label>
                  <input
                    type="tel"
                    placeholder="+256 700 000 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              )}

              <div className="mobile-payment-actions">
                <button className="btn-secondary-mobile" onClick={() => setShowMobilePayment(false)}>
                  Cancel
                </button>
                <button className="btn-primary-mobile" onClick={handleMobilePayment}>
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Modal */}
      {showPaymentProcessing && (
        <div className="payment-processing">
          <div className="payment-processing-modal">
            <div className="processing-header">
              <div className="processing-spinner"></div>
              <div className="processing-title">Processing Payment</div>
            </div>
            
            <div className="processing-message text-gray-600 mb-6">
              {selectedPayment === "split" 
                ? "Processing split payment between cash and digital..." 
                : selectedPayment === "momo" 
                ? "Sending payment request to MTN MoMo..." 
                : selectedPayment === "airtel"
                ? "Sending payment request to Airtel Money..."
                : selectedPayment === "visa"
                ? "Processing card payment..."
                : selectedPayment === "qr"
                ? "Processing QR code payment..."
                : "Processing cash payment..."
              }
            </div>
            
            <div className="processing-details bg-gray-50 p-4 rounded-lg mb-6">
              <div className="payment-method-display flex items-center justify-center gap-4 mb-4">
                <div className={`payment-method-icon ${selectedPayment} w-12 h-12 rounded-full flex items-center justify-center text-xl`}>
                  {selectedPayment === "cash" && "💵"}
                  {selectedPayment === "momo" && "📱"}
                  {selectedPayment === "airtel" && "📱"}
                  {selectedPayment === "visa" && "💳"}
                  {selectedPayment === "qr" && "⊞"}
                  {selectedPayment === "split" && "◯◯"}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Payment Method</div>
                  <div className="font-semibold">
                    {selectedPayment === "momo" ? "MTN MoMo" :
                     selectedPayment === "airtel" ? "Airtel Money" :
                     selectedPayment === "visa" ? "Visa" :
                     selectedPayment === "qr" ? "QR Code" :
                     selectedPayment === "split" ? "Split Pay" : "Cash"}
                  </div>
                </div>
              </div>
              
              <div className="payment-amount text-2xl font-bold text-blue-600 text-center">
                {tripData.amount.toLocaleString()}
                <span className="text-lg ml-2">UGX</span>
              </div>
            </div>
            
            <div className="processing-steps mb-6">
              {getProcessingSteps().map((step, index) => (
                <div 
                  key={index} 
                  className={`processing-step ${index <= processingStep ? 'active' : ''} mb-2`}
                >
                  <div className="step-icon">
                    {index <= processingStep ? "✓" : index + 1}
                  </div>
                  <div className="step-text">{step.text}</div>
                </div>
              ))}
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(processingStep / (getProcessingSteps().length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal fade-in scale-in" onClick={(e) => e.stopPropagation()}>
            {modalType === "saved" && (
              <>
                <h2 className="text-2xl font-bold text-blue-800 mb-4">Hello Moses!</h2>
                <div className="success-animation">
                  <div className="success-checkmark">
                    <div className="check-icon">
                      <span className="icon-line line-tip"></span>
                      <span className="icon-line line-long"></span>
                      <div className="icon-circle"></div>
                      <div className="icon-fix"></div>
                    </div>
                  </div>
                </div>
                <p className="modal-message text-gray-600 mb-4">
                  Your trip has been saved successfully, under Pending transactions
                </p>
                <p className="modal-sub-message text-gray-500 text-sm mb-6">
                  To retrieve saved trip and receive money,
                  <br />
                  Click transactions and tap pending transactions
                </p>
                <button
                  className="modal-btn bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setShowModal(false)
                    setScreen("dashboard")
                  }}
                >
                  Okay
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Ride