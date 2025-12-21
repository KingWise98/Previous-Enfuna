"use client"

import { useState, useEffect } from "react"
import "./trips.css"

export default function Trips() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [tripStatus, setTripStatus] = useState("idle") // idle, setup, active, ended, payment
  const [currentTrip, setCurrentTrip] = useState({
    pickup: "",
    destination: "",
    amount: 2000,
    startTime: null,
    duration: 0,
    distance: 0,
    stops: [],
    notes: "",
  })
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const [amountDraft, setAmountDraft] = useState(String(2000))
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("MTN MoMo")
  const [manualOverride, setManualOverride] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    status: "All Status",
    tripType: "Normal Trip",
    paymentMethod: "All Status",
    route: "All Routes",
  })

  // Mock data
  const [trips, setTrips] = useState([
    {
      id: "Trip-007",
      route: "Kireka - Banda",
      distance: "5.2km",
      duration: "12min",
      amount: 2000,
      paymentMethod: "Cash",
      status: "Completed",
      date: "Apr 23, 2025 9:30 AM",
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
      date: "Apr 23, 2025 10:45 AM",
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
      date: "Apr 23, 2025 11:20 AM",
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
      date: "Apr 23, 2025 12:00 PM",
      manualOverride: false,
    },
    {
      id: "Trip-011",
      route: "Kireka - Banda",
      distance: "5.2km",
      duration: "4min",
      amount: 2000,
      paymentMethod: "Cash",
      status: "Cancelled",
      date: "Apr 23, 2025 1:30 PM",
      manualOverride: false,
    },
    {
      id: "Trip-012",
      route: "Kireka - Banda",
      distance: "5.3km",
      duration: "7min",
      amount: 5000,
      paymentMethod: "Cash",
      status: "Completed",
      date: "Apr 23, 2025 2:15 PM",
      manualOverride: false,
    },
  ])

  const popularPickups = ["Mukono", "Kampala Central", "Kireka", "Banda", "Ntinda"]
  const popularDestinations = ["Kampala", "Entebbe", "Jinja", "Uganda House", "Nakasero"]

  useEffect(() => {
    let interval
    if (tripStatus === "active") {
      interval = setInterval(() => {
        setCurrentTrip((prev) => ({
          ...prev,
          duration: prev.duration + 1,
          distance: Number((prev.distance + 0.01).toFixed(2)),
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [tripStatus])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} min ${secs < 10 ? "0" : ""}${secs} sec`
  }

  const startTrip = () => {
    if (!currentTrip.pickup || !currentTrip.destination) {
      alert("Please enter pickup and destination")
      return
    }
    setCurrentTrip((prev) => ({
      ...prev,
      startTime: new Date(),
      duration: 0,
      distance: 0,
    }))
    setTripStatus("active")
  }

  const endTrip = () => {
    setTripStatus("ended")
  }

  const saveTrip = () => {
    setModalType("saved")
    setShowModal(true)
    setTimeout(() => {
      setShowModal(false)
      setTripStatus("idle")
      setCurrentView("dashboard")
    }, 3000)
  }

  const receivePayment = () => {
    setTripStatus("payment")
  }

  const completePayment = () => {
    const newTrip = {
      id: `Trip-${String(trips.length + 1).padStart(3, "0")}`,
      route: `${currentTrip.pickup} - ${currentTrip.destination}`,
      distance: `${currentTrip.distance}km`,
      duration: formatDuration(currentTrip.duration),
      amount: currentTrip.amount,
      paymentMethod: selectedPaymentMethod,
      status: "Completed",
      date: new Date().toLocaleString(),
      manualOverride: manualOverride,
    }
    setTrips([newTrip, ...trips])
    setModalType("receipt")
    setShowModal(true)
  }

  const addStop = () => {
    setCurrentTrip((prev) => ({
      ...prev,
      stops: [...prev.stops, { location: "", amount: 0 }],
    }))
  }

  const removeStop = (index) => {
    setCurrentTrip((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }))
  }

  const canSaveTrip = Boolean(currentTrip.pickup && currentTrip.destination)

  const closeSetup = () => {
    setIsEditingAmount(false)
    setTripStatus("idle")
  }

  const beginEditAmount = () => {
    setAmountDraft(String(currentTrip.amount ?? ""))
    setIsEditingAmount(true)
  }

  const commitAmount = () => {
    const normalized = String(amountDraft).replace(/,/g, "").trim()
    const parsed = Number(normalized)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setAmountDraft(String(currentTrip.amount ?? ""))
      setIsEditingAmount(false)
      return
    }
    setCurrentTrip({ ...currentTrip, amount: parsed })
    setIsEditingAmount(false)
  }

  return (
    <div className="trips-container">
      {/* Dashboard View */}
      {currentView === "dashboard" && (
        <div className="trips-dashboard">
          <div className="trips-header">
            <input type="text" placeholder="Search" className="trips-search" />
            <div className="trips-header-icons">
              <button className="icon-btn">☀️</button>
              <button className="icon-btn">🔔</button>
              <button className="icon-btn">⚙️</button>
              <button className="icon-btn">👤</button>
            </div>
          </div>

          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <button className="complete-profile-btn">Complete Profile</button>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => setTripStatus("setup")}>
                Start Trip
              </button>
              <button className="action-btn">Start Delivery</button>
              <button className="action-btn">Receive Money</button>
              <button className="action-btn">Withdraw Money</button>
              <button className="action-btn">Add Expenses</button>
            </div>
          </div>

          <div className="wallet-section">
            <div className="wallet-label">Wallet Balance</div>
            <div className="wallet-amount">
              <span className="wallet-balance">40,000</span>
              <span className="wallet-currency">UGX</span>
            </div>
            <div className="wallet-label-sub">Available Balance</div>
          </div>

          <div className="ready-ride-section">
            <div className="motorcycle-icon">🏍️</div>
            <h2 className="ready-title">Ready to Ride?</h2>
            <p className="ready-subtitle">Start A New Trip And Start Earning</p>
            <button className="start-trip-btn" onClick={() => setTripStatus("setup")}>
              START NEW TRIP →
            </button>
          </div>

          <div className="trip-history-preview">
            <div className="section-header">
              <div>
                <h2 className="section-title">Trip History</h2>
                <p className="section-subtitle">View completed trip summary</p>
              </div>
              <button className="view-detailed-btn" onClick={() => setCurrentView("history")}>
                View Detailed Trip History
              </button>
            </div>

            {trips.slice(0, 2).map((trip, index) => (
              <div key={index} className="trip-preview-card">
                <div className="trip-preview-row">
                  <div>
                    <div className="trip-label">Route</div>
                    <div className="trip-value">{trip.route}</div>
                  </div>
                  <div>
                    <div className="trip-label">Duration</div>
                    <div className="trip-value">{trip.duration}</div>
                  </div>
                  <div>
                    <div className="trip-label">Distance</div>
                    <div className="trip-value">{trip.distance}</div>
                  </div>
                </div>
                <div className="trip-preview-bottom">
                  <span className="trip-amount">{trip.amount} UGX</span>
                  <span className={`trip-payment-badge ${trip.paymentMethod.toLowerCase().replace(" ", "-")}`}>
                    {trip.paymentMethod}
                  </span>
                  {trip.manualOverride && <span className="manual-override-badge">Manual Override</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* Trip Setup */}
      {tripStatus === "setup" && (
        <div className="trip-setup-overlay" role="dialog" aria-modal="true" onClick={closeSetup}>
          <div className="trip-setup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="trip-setup-modal-header">
              <div className="trip-setup-header">New Trip</div>
              <button className="trip-setup-close" onClick={closeSetup} aria-label="Close">
                ×
              </button>
            </div>

            <div className="trip-setup-content">
              <h2 className="form-title">Trip Setup Form</h2>
              <p className="form-subtitle">Configure your trip details and start your journey</p>

              <div className="location-inputs">
                <div className="input-group">
                  <label>Enter Pickup Location</label>
                  <input
                    type="text"
                    value={currentTrip.pickup}
                    onChange={(e) => setCurrentTrip({ ...currentTrip, pickup: e.target.value })}
                    placeholder="Mukono"
                  />
                  <div className="suggestions">
                    {popularPickups.map((loc) => (
                      <button key={loc} onClick={() => setCurrentTrip({ ...currentTrip, pickup: loc })}>
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="location-divider">TO</div>

                <div className="input-group">
                  <label>Enter Destination</label>
                  <input
                    type="text"
                    value={currentTrip.destination}
                    onChange={(e) => setCurrentTrip({ ...currentTrip, destination: e.target.value })}
                    placeholder="Kampala"
                  />
                  <div className="suggestions">
                    {popularDestinations.map((loc) => (
                      <button key={loc} onClick={() => setCurrentTrip({ ...currentTrip, destination: loc })}>
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="amount-section">
                <label>Enter Amount</label>
                <div className="amount-display">
                  {isEditingAmount ? (
                    <>
                      <input
                        className="amount-input-inline"
                        type="text"
                        inputMode="numeric"
                        value={amountDraft}
                        onChange={(e) => setAmountDraft(e.target.value)}
                        onBlur={commitAmount}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitAmount()
                          if (e.key === "Escape") {
                            setIsEditingAmount(false)
                            setAmountDraft(String(currentTrip.amount ?? ""))
                          }
                        }}
                        autoFocus
                        aria-label="Trip amount"
                      />
                      <span className="amount-currency">UGX</span>
                    </>
                  ) : (
                    <>
                      <span className="amount-value">{currentTrip.amount.toLocaleString()}</span>
                      <span className="amount-currency">UGX</span>
                    </>
                  )}
                </div>
                <button
                  className="change-amount-btn"
                  onClick={() => {
                    if (isEditingAmount) {
                      commitAmount()
                      return
                    }
                    beginEditAmount()
                  }}
                >
                  {isEditingAmount ? "Save Amount" : "Change Amount"}
                </button>
              </div>

              <div className="trip-actions">
                <button className="btn-primary" onClick={startTrip}>
                  START TRIP
                </button>
                <button
                  className={`btn-secondary${canSaveTrip ? "" : " is-disabled"}`}
                  onClick={() => {
                    if (!canSaveTrip) return
                    saveTrip()
                  }}
                  disabled={!canSaveTrip}
                >
                  SAVE TRIP
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentTrip({ ...currentTrip, pickup: "", destination: "", amount: 2000 })}
                >
                  CLEAR FORM
                </button>
              </div>

              <button className="btn-cancel" onClick={closeSetup}>
                CANCEL TRIP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Trip */}
      {tripStatus === "active" && (
        <div className="active-trip">
          <div className="active-trip-header">
            <h2>Active Trip</h2>
            <span className="trip-status-badge in-progress">In Progress</span>
          </div>

          <p className="active-subtitle">Manage your rides efficiently</p>

          <div className="trip-stats">
            <div className="stat-card">
              <div className="stat-label">Duration</div>
              <div className="stat-value">{formatDuration(currentTrip.duration)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Distance</div>
              <div className="stat-value">{currentTrip.distance.toFixed(1)} km</div>
            </div>
          </div>

          <div className="trip-route">
            <div className="route-item">
              <span className="route-label">FROM:</span>
              <span className="route-value">{currentTrip.pickup}</span>
              <button className="edit-btn">EDIT</button>
            </div>
            <div className="route-item">
              <span className="route-label">TO:</span>
              <span className="route-value">{currentTrip.destination}</span>
              <button className="edit-btn">EDIT</button>
            </div>
          </div>

          <div className="intermediate-stops">
            <div className="stops-header">
              <h3>Intermediate Stops</h3>
              <button className="add-stop-btn" onClick={addStop}>
                + Add Stop
              </button>
            </div>

            {currentTrip.stops.map((stop, index) => (
              <div key={index} className="stop-inputs">
                <div className="stop-input-group">
                  <label>Enter Stop Manually</label>
                  <input
                    type="text"
                    value={stop.location}
                    onChange={(e) => {
                      const newStops = [...currentTrip.stops]
                      newStops[index].location = e.target.value
                      setCurrentTrip({ ...currentTrip, stops: newStops })
                    }}
                    placeholder="Seeta"
                  />
                </div>
                <div className="stop-input-group">
                  <label>Enter Amount Manually</label>
                  <div className="amount-input">
                    <input
                      type="number"
                      value={stop.amount}
                      onChange={(e) => {
                        const newStops = [...currentTrip.stops]
                        newStops[index].amount = Number(e.target.value)
                        setCurrentTrip({ ...currentTrip, stops: newStops })
                      }}
                    />
                    <span>UGX</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="trip-notes">
            <label>Trip Notes (Optional)</label>
            <textarea
              value={currentTrip.notes}
              onChange={(e) => setCurrentTrip({ ...currentTrip, notes: e.target.value })}
              placeholder="Delivery instructions, Multistop info etc..."
            />
          </div>

          <div className="active-trip-actions">
            {currentTrip.stops.length > 0 && (
              <button className="btn-remove" onClick={() => removeStop(currentTrip.stops.length - 1)}>
                - Remove Stop
              </button>
            )}
            <button className="btn-save">Save Changes</button>
          </div>

          <button className="btn-end-trip" onClick={endTrip}>
            End Trip
          </button>
        </div>
      )}

      {/* End Trip / Review */}
      {tripStatus === "ended" && (
        <div className="trip-review">
          <div className="review-header">
            <h2>Review and Complete Trip</h2>
            <span className="trip-ended-badge">Trip Ended</span>
          </div>

          <p className="review-subtitle">Review and finalize trip details before payment</p>

          <div className="trip-summary-box">
            <h3>Trip Summary</h3>
            <div className="summary-row">
              <span>From:</span>
              <span>{currentTrip.pickup}</span>
            </div>
            <div className="summary-row">
              <span>To:</span>
              <span>{currentTrip.destination}</span>
            </div>
            <div className="summary-row">
              <span>Duration Stop</span>
              <span>{formatDuration(currentTrip.duration)}</span>
            </div>
            <div className="summary-row">
              <span>Distance Covered</span>
              <span>{currentTrip.distance.toFixed(1)} km</span>
            </div>
          </div>

          <div className="total-amount-section">
            <h3>Total Amount</h3>
            <div className="amount-card">
              <span className="total-amount">{currentTrip.amount.toLocaleString()}</span>
              <span className="currency">UGX</span>
              <button className="edit-amount-btn">Edit</button>
            </div>
            <label className="manual-override-checkbox">
              <input type="checkbox" checked={manualOverride} onChange={(e) => setManualOverride(e.target.checked)} />
              Manual Amount Override
            </label>
          </div>

          <div className="review-actions">
            <button className="btn-secondary" onClick={saveTrip}>
              Save Trip
            </button>
            <button className="btn-primary" onClick={receivePayment}>
              Receive Money
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {tripStatus === "payment" && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-header">Receive Money</div>

            <div className="payment-content">
              <label>Enter Cash Amount</label>
              <div className="cash-amount-input">
                <input type="text" value={currentTrip.amount.toLocaleString()} readOnly />
                <span>UGX</span>
              </div>

              <label>Select Payment Method</label>
              <div className="payment-methods">
                <button
                  className={`payment-method-btn ${selectedPaymentMethod === "Cash" ? "selected" : ""}`}
                  onClick={() => setSelectedPaymentMethod("Cash")}
                >
                  <div className="payment-icon cash">CASH</div>
                </button>
                <button
                  className={`payment-method-btn ${selectedPaymentMethod === "MTN MoMo" ? "selected" : ""}`}
                  onClick={() => setSelectedPaymentMethod("MTN MoMo")}
                >
                  <img src="./assets/mtn.png" alt="MTN MoMo" className="payment-logo" />
                  {selectedPaymentMethod === "MTN MoMo" && <span className="checkmark">✓</span>}
                </button>
                <button
                  className={`payment-method-btn ${selectedPaymentMethod === "Airtel Money" ? "selected" : ""}`}
                  onClick={() => setSelectedPaymentMethod("Airtel Money")}
                >
                  <img src="./assets/airtel.png" alt="Airtel" className="payment-logo" />
                </button>
                <button
                  className={`payment-method-btn ${selectedPaymentMethod === "Visa" ? "selected" : ""}`}
                  onClick={() => setSelectedPaymentMethod("Visa")}
                >
                  <img src="./assets/visa.png" alt="Visa" className="payment-logo" />
                </button>
                <button
                  className={`payment-method-btn ${selectedPaymentMethod === "QR Code" ? "selected" : ""}`}
                  onClick={() => setSelectedPaymentMethod("QR Code")}
                >
                  <div className="payment-icon">
                    <div className="qr-code">▦</div>
                    <div className="payment-label">QR Code</div>
                  </div>
                </button>
                <button
                  className={`payment-method-btn ${selectedPaymentMethod === "Split Payment" ? "selected" : ""}`}
                  onClick={() => setSelectedPaymentMethod("Split Payment")}
                >
                  <div className="payment-icon">
                    <div className="split-icon">◎◎</div>
                    <div className="payment-label">Split Payment</div>
                  </div>
                </button>
              </div>

              <div className="payment-actions">
                <button className="btn-cancel-payment" onClick={() => setTripStatus("ended")}>
                  Cancel
                </button>
                <button className="btn-continue-payment" onClick={completePayment}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip History View */}
      {currentView === "history" && (
        <div className="trip-history-dashboard">
          <div className="history-header">
            <div>
              <h1>Trip History Dashboard</h1>
              <p>View Real-time trip analytics, all completed trips and their history details</p>
            </div>
            <div className="history-header-actions">
              <button className="export-btn">📥 Export</button>
              <button className="share-btn">🔗 Share</button>
              <button className="cloud-btn">☁️</button>
              <div className="user-badge">
                <span>Moses. K</span>
                <span className="user-initial">MK</span>
              </div>
            </div>
          </div>

          <div className="stats-cards">
            <div className="stat-card blue">
              <div className="stat-icon">🚗</div>
              <div className="stat-info">
                <div className="stat-label">Total Trips</div>
                <div className="stat-number">10</div>
                <div className="stat-change positive">+12 from yesterday</div>
              </div>
            </div>
            <div className="stat-card dark">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-label">Total Money</div>
                <div className="stat-number">
                  10,000 <span className="currency-small">UGX</span>
                </div>
                <div className="stat-change positive">+6k Up from yesterday</div>
              </div>
            </div>
            <div className="stat-card olive">
              <div className="stat-icon">✓</div>
              <div className="stat-info">
                <div className="stat-label">Completed Trips</div>
                <div className="stat-number">20</div>
                <div className="stat-change positive">+40% Up from yesterday</div>
              </div>
            </div>
            <div className="stat-card cream">
              <div className="stat-icon">⚠</div>
              <div className="stat-info">
                <div className="stat-label">Cancellation Rate</div>
                <div className="stat-number">10.2%</div>
                <div className="stat-change negative">-2% less from yesterday</div>
              </div>
            </div>
          </div>

          <div className="history-content">
            <div className="filters-sidebar">
              <h3>Search</h3>
              <input
                type="text"
                placeholder="Trip ID, Phone, Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-search"
              />

              <h3>Filters</h3>

              <div className="filter-group">
                <label>Trip status</label>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                  <option>Pending</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Trip Type</label>
                <select value={filters.tripType} onChange={(e) => setFilters({ ...filters, tripType: e.target.value })}>
                  <option>Normal Trip</option>
                  <option>Quick Trip</option>
                  <option>Delivery</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Payment Method</label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
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
                <select value={filters.route} onChange={(e) => setFilters({ ...filters, route: e.target.value })}>
                  <option>All Routes</option>
                  <option>Mukono - Kampala</option>
                  <option>Kireka - Banda</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Amount Range: UGX 0 - UGX 3,000</label>
                <input type="range" min="0" max="10000" className="range-slider" />
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <select>
                  <option>Date</option>
                  <option>Amount</option>
                  <option>Duration</option>
                </select>
                <select className="sort-order">
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>

              <button className="clear-filters-btn">Clear All Filter</button>
            </div>

            <div className="trips-table-container">
              <table className="trips-table">
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Route & Time</th>
                    <th>Distance & Time taken</th>
                    <th>Amount</th>
                    <th>Manual Over ride</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td className="trip-id">{trip.id}</td>
                      <td>
                        <div className="route-cell">{trip.route}</div>
                        <div className="date-cell">{trip.date}</div>
                      </td>
                      <td>
                        <div className="distance-cell">{trip.distance}</div>
                        <div className="duration-cell">{trip.duration}</div>
                      </td>
                      <td className="amount-cell">UGX {trip.amount.toLocaleString()}</td>
                      <td className="override-cell">{trip.manualOverride ? "YES" : "NO"}</td>
                      <td>
                        <span className={`payment-badge ${trip.paymentMethod.toLowerCase().replace(" ", "-")}`}>
                          {trip.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${trip.status.toLowerCase()}`}>{trip.status}</span>
                      </td>
                      <td>
                        <button className="action-icon-btn">👁️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <span>Showing 8 trips</span>
                <div className="pagination-btns">
                  <button>Previous</button>
                  <button>Next</button>
                </div>
              </div>
            </div>
          </div>

          <button className="back-to-dashboard-btn" onClick={() => setCurrentView("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      )}

      {/* Modals */}
      {showModal && modalType === "saved" && (
        <div className="modal-overlay">
          <div className="success-modal">
            <h2>Hello Moses!</h2>
            <div className="success-icon">✓</div>
            <p>Your trip has been saved successfully, under Pending transactions</p>
            <p className="modal-instruction">
              To retrieve saved trip and receive money,
              <br />
              Click transactions and tap pending transactions
            </p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              Okay
            </button>
          </div>
        </div>
      )}

      {showModal && modalType === "receipt" && (
        <div className="modal-overlay">
          <div className="receipt-modal">
            <div className="receipt-header">Customer Receipt</div>
            <div className="receipt-type">Normal Trip</div>

            <div className="receipt-rider">Rider: Moses K. (ID: R1022)</div>

            <div className="receipt-section">
              <h3>TRIP DETAILS</h3>
              <div className="receipt-row">
                <span>Pickup Location:</span>
                <span>{currentTrip.pickup}</span>
              </div>
              <div className="receipt-row">
                <span>Destination:</span>
                <span>{currentTrip.destination}</span>
              </div>
              <div className="receipt-row">
                <span>Start Time & Date:</span>
                <span>{new Date(currentTrip.startTime).toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span>End Time & Date:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span>Distance:</span>
                <span>{currentTrip.distance.toFixed(1)} km</span>
              </div>
              <div className="receipt-row">
                <span>Duration:</span>
                <span>{formatDuration(currentTrip.duration)}</span>
              </div>
              <div className="receipt-row">
                <span>Amount Paid:</span>
                <span>UGX {currentTrip.amount.toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span>Payment Method:</span>
                <span>{selectedPaymentMethod}</span>
              </div>
              <div className="receipt-row">
                <span>Payment Status:</span>
                <span className="paid-status">Paid</span>
              </div>
              <div className="receipt-row">
                <span>Receipt Code:</span>
                <span>NTR00XD40002</span>
              </div>
              <div className="receipt-row">
                <span>Trip ID:</span>
                <span>T20330</span>
              </div>
            </div>

            {currentTrip.notes && (
              <div className="receipt-section">
                <h3>Notes</h3>
                <p>{currentTrip.notes}</p>
              </div>
            )}

            <div className="receipt-section">
              <h3>SUPPORT</h3>
              <div className="receipt-row">
                <span>Rider Contact:</span>
                <span>+256 70xxxxxxxxx</span>
              </div>
            </div>

            <div className="receipt-actions">
              <button className="receipt-btn">Share</button>
              <button className="receipt-btn">Report Issue</button>
              <button className="receipt-btn">Download</button>
            </div>

            <button
              className="close-receipt-btn"
              onClick={() => {
                setShowModal(false)
                setTripStatus("idle")
                setCurrentView("dashboard")
                setCurrentTrip({
                  pickup: "",
                  destination: "",
                  amount: 2000,
                  startTime: null,
                  duration: 0,
                  distance: 0,
                  stops: [],
                  notes: "",
                })
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
