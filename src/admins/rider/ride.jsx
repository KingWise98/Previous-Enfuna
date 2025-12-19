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
      id: "Trip-007",
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
      id: "Trip-007",
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
      id: "Trip-007",
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
      id: "Trip-007",
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
      id: "Trip-007",
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
      id: "Trip-007",
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
      id: "Trip-007",
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

  useEffect(() => {
    let interval
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

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
              : "Cash",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      status: "Completed",
      tripType: "Normal Trip",
      manualOverride: manualOverride ? "YES" : "NO",
      customer: "Unknown",
      phone: "+256 70xxxxxxxx",
    }
    setTripHistory([newTrip, ...tripHistory])
    setShowMobilePayment(false)
    setScreen("invoice")
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
    cancellationRate: ((tripHistory.filter((t) => t.status === "Cancelled").length / tripHistory.length) * 100).toFixed(
      1,
    ),
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

  return (
    <div className="ride-container">
      {/* Dashboard Screen */}
      {screen === "dashboard" && (
        <div className="screen dashboard-screen fade-in">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <div className="header-icons">
              <span className="icon">☀️</span>
              <span className="icon">🔔</span>
              <span className="icon">⚙️</span>
              <span className="icon">👤</span>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => setScreen("newTrip")}>
                Start Trip
              </button>
              <button className="action-btn">Start Delivery</button>
              <button className="action-btn">Receive Money</button>
              <button className="action-btn">Withdraw Money</button>
              <button className="action-btn">Add Expenses</button>
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
            <div className="scooter-icon">🛵</div>
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
              <button className="edit-btn">EDIT</button>
            </div>
            <div className="detail-row">
              <span className="detail-label">TO:</span>
              <span className="detail-value">{tripData.destination}</span>
              <button className="edit-btn">EDIT</button>
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

            {tripData.stops.length > 0 && <button className="save-changes-btn">Save Changes</button>}
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
            <div className="payment-amount-section">
              <label>Enter Cash Amount</label>
              <div className="payment-amount-display">
                <span className="amount">{tripData.amount.toLocaleString()}</span>
                <span className="currency">UGX</span>
              </div>
            </div>

            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              <div className="payment-options">
                <div
                  className={`payment-option ${selectedPayment === "cash" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("cash")}
                >
                  <div className="payment-icon cash">CASH</div>
                  {selectedPayment === "cash" && <div className="checkmark">✓</div>}
                </div>
                <div
                  className={`payment-option ${selectedPayment === "momo" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("momo")}
                >
                  <img src="./assets/mtn.png" alt="MTN MoMo" className="payment-logo" />
                  {selectedPayment === "momo" && <div className="checkmark">✓</div>}
                </div>
                <div
                  className={`payment-option ${selectedPayment === "airtel" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("airtel")}
                >
                  <img src="./assets/airtel.png" alt="Airtel Money" className="payment-logo" />
                  {selectedPayment === "airtel" && <div className="checkmark">✓</div>}
                </div>
                <div
                  className={`payment-option ${selectedPayment === "visa" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("visa")}
                >
                  <img src="./assets/visa.png" alt="Visa" className="payment-logo" />
                  {selectedPayment === "visa" && <div className="checkmark">✓</div>}
                </div>
                <div className="payment-option">
                  <div className="payment-icon qr">
                    <div className="qr-code">⊞</div>
                    <span>QR Code</span>
                  </div>
                </div>
                <div className="payment-option">
                  <div className="payment-icon split">
                    <div className="split-icon">◯◯</div>
                    <span>Split Payment</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-actions">
              <button className="btn-secondary" onClick={() => setScreen("reviewTrip")}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handlePaymentComplete}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Screen */}
      {screen === "invoice" && (
        <div className="screen invoice-screen fade-in">
          <div className="invoice-container">
            <div className="invoice-header">Customer Receipt</div>
            <div className="invoice-type">Normal Trip</div>

            <div className="rider-info">Rider: Moses K. (ID: R1022)</div>

            <div className="invoice-section">
              <div className="section-title">TRIP DETAILS</div>
              <div className="invoice-row">
                <span className="invoice-label">Pickup Location:</span>
                <span className="invoice-value">{tripData.pickup} stage</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Destination:</span>
                <span className="invoice-value">Uganda House - {tripData.destination}</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Start Time & Date:</span>
                <span className="invoice-value">
                  {tripData.startTime?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}{" "}
                  {tripData.startTime?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">End Time & Date:</span>
                <span className="invoice-value">
                  {tripData.endTime?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}{" "}
                  {tripData.endTime?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Distance:</span>
                <span className="invoice-value">{tripData.distance} km</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Duration:</span>
                <span className="invoice-value">{formatTime(tripData.duration)}</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Amount Paid:</span>
                <span className="invoice-value">UGX {tripData.amount.toLocaleString()}</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Payment Method:</span>
                <span className="invoice-value">
                  {selectedPayment === "momo"
                    ? "MTN MoMo"
                    : selectedPayment === "airtel"
                      ? "Airtel Money"
                      : selectedPayment === "visa"
                        ? "Visa"
                        : "Cash"}
                </span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Payment Status:</span>
                <span className="invoice-value status-paid">Paid</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Receipt Code:</span>
                <span className="invoice-value">NTR00XD40002</span>
              </div>
              <div className="invoice-row">
                <span className="invoice-label">Trip ID:</span>
                <span className="invoice-value">{tripData.tripId}</span>
              </div>
            </div>

            <div className="invoice-section">
              <div className="section-title">Notes</div>
              <p className="invoice-notes">Thanks for riding with Moses</p>
            </div>

            <div className="invoice-section">
              <div className="section-title">SUPPORT</div>
              <div className="invoice-row">
                <span className="invoice-label">Rider Contact:</span>
                <span className="invoice-value">+256 70xxxxxxxxx</span>
              </div>
            </div>

            <div className="invoice-actions">
              <button className="invoice-btn">Share</button>
              <button className="invoice-btn">Report Issue</button>
              <button className="invoice-btn">Download</button>
            </div>

            <button
              className="back-to-dashboard-btn"
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
          <h2>Why are you canceling?</h2>
          <p className="screen-subtitle">Help us understand your reason</p>

          <div className="cancel-reasons">
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
                className={`reason-option ${cancelReason === reason ? "selected" : ""}`}
                onClick={() => setCancelReason(reason)}
              >
                {reason}
              </div>
            ))}
          </div>

          {cancelReason === "Other" && (
            <textarea className="other-reason-input" placeholder="Please specify your reason..." />
          )}

          <div className="cancel-actions">
            <button className="btn-secondary" onClick={() => setScreen(tripData.startTime ? "activeTrip" : "newTrip")}>
              Go Back
            </button>
            <button className="btn-danger" onClick={handleCancelConfirm}>
              Confirm Cancellation
            </button>
          </div>
        </div>
      )}

      {screen === "tripHistory" && (
        <div className="screen trip-history-dashboard fade-in">
          <div className="history-dashboard-header">
            <div className="header-top">
              <button className="back-btn" onClick={() => setScreen("dashboard")}>
                ← Back
              </button>
              <h1>Trip History Dashboard</h1>
              <div className="header-actions">
                <button className="export-btn">📤 Export</button>
                <button className="share-btn">🔗 Share</button>
                <div className="user-badge">
                  <span className="user-icon">👤</span>
                  <span className="user-name">Moses K</span>
                  <span className="user-id">MK</span>
                </div>
              </div>
            </div>
            <p className="dashboard-subtitle">
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
                          <button className="action-btn-table">👁</button>
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

      {showMobilePayment && (
        <div className="modal-overlay" onClick={() => setShowMobilePayment(false)}>
          <div className="mobile-payment-modal fade-in scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-payment-header">Receive Money</div>

            <div className="mobile-payment-content">
              <div className="mobile-amount-section">
                <label>Enter Cash Amount</label>
                <div className="mobile-amount-display">
                  <span className="amount">{tripData.amount.toLocaleString()}</span>
                  <span className="currency">UGX</span>
                </div>
              </div>

              <div className="mobile-payment-methods">
                <h3>Select Payment Method</h3>
                <div className="mobile-payment-grid">
                  <div
                    className={`mobile-payment-option ${selectedPayment === "cash" ? "selected" : ""}`}
                    onClick={() => setSelectedPayment("cash")}
                  >
                    <div className="payment-icon cash">CASH</div>
                    {selectedPayment === "cash" && <div className="checkmark">✓</div>}
                  </div>
                  <div
                    className={`mobile-payment-option ${selectedPayment === "momo" ? "selected" : ""}`}
                    onClick={() => setSelectedPayment("momo")}
                  >
                    <img src="./assets/mtn.png" alt="MTN MoMo" className="payment-logo" />
                    {selectedPayment === "momo" && <div className="checkmark">✓</div>}
                    <span className="payment-label">MoMo</span>
                  </div>
                  <div
                    className={`mobile-payment-option ${selectedPayment === "airtel" ? "selected" : ""}`}
                    onClick={() => setSelectedPayment("airtel")}
                  >
                    <img src="./assets/airtel.png" alt="Airtel Money" className="payment-logo" />
                    {selectedPayment === "airtel" && <div className="checkmark">✓</div>}
                    <span className="payment-label">airtel</span>
                  </div>
                  <div
                    className={`mobile-payment-option ${selectedPayment === "visa" ? "selected" : ""}`}
                    onClick={() => setSelectedPayment("visa")}
                  >
                    <img src="./assets/visa.png" alt="Visa" className="payment-logo" />
                    {selectedPayment === "visa" && <div className="checkmark">✓</div>}
                  </div>
                  <div className="mobile-payment-option">
                    <div className="qr-code-icon">⊞</div>
                    <span className="payment-label">QR Code</span>
                  </div>
                  <div className="mobile-payment-option">
                    <div className="split-icon">◯◯</div>
                    <span className="payment-label">Split Payment</span>
                  </div>
                </div>
              </div>

              <div className="mobile-payment-actions">
                <button className="btn-secondary-mobile" onClick={() => setShowMobilePayment(false)}>
                  Cancel
                </button>
                <button className="btn-primary-mobile" onClick={handlePaymentComplete}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal fade-in scale-in" onClick={(e) => e.stopPropagation()}>
            {modalType === "saved" && (
              <>
                <h2>Hello Moses!</h2>
                <div className="success-icon">✓</div>
                <p className="modal-message">Your trip has been saved successfully, under Pending transactions</p>
                <p className="modal-sub-message">
                  To retrieve saved trip and receive money,
                  <br />
                  Click transactions and tap pending transactions
                </p>
                <button
                  className="modal-btn"
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
