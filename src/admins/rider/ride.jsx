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
  const [tripHistory, setTripHistory] = useState([
    {
      id: "T20330",
      from: "Mukono",
      to: "Kampala",
      duration: "18 min 01 sec",
      distance: "5.3 KM",
      amount: 4000,
      paymentMethod: "Cash",
      date: "27 Nov 2025",
      status: "Paid",
    },
    {
      id: "T20329",
      from: "Kireka",
      to: "Banda",
      duration: "4 min 21 sec",
      distance: "5.3 KM",
      amount: 2000,
      paymentMethod: "Airtel Money",
      date: "27 Nov 2025",
      status: "Paid",
    },
  ])

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
    setScreen("payment")
  }

  const handlePaymentComplete = () => {
    const newTrip = {
      id: tripData.tripId,
      from: tripData.pickup,
      to: tripData.destination,
      duration: formatTime(tripData.duration),
      distance: `${tripData.distance} KM`,
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
      status: "Paid",
    }
    setTripHistory([newTrip, ...tripHistory])
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

  return (
    <div className="ride-container">
      {/* Dashboard Screen */}
      {screen === "dashboard" && (
        <div className="screen dashboard-screen fade-in">
          

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
              <button className="view-detailed-btn">View Detailed Trip History</button>
            </div>

            {tripHistory.map((trip, index) => (
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
                    <div className="value">{trip.duration}</div>
                  </div>
                  <div className="history-col">
                    <div className="label">Distance</div>
                    <div className="value">{trip.distance}</div>
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
                </div>
                <div
                  className={`payment-option ${selectedPayment === "momo" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("momo")}
                >
                  <img src="./assets/mtn.jpg" alt="MTN MoMo" className="payment-logo" />
                  {selectedPayment === "momo" && <div className="checkmark">✓</div>}
                </div>
                <div
                  className={`payment-option ${selectedPayment === "airtel" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("airtel")}
                >
                  <img src="./assets/airtel.jpg" alt="Airtel Money" className="payment-logo" />
                  {selectedPayment === "airtel" && <div className="checkmark">✓</div>}
                </div>
                <div
                  className={`payment-option ${selectedPayment === "visa" ? "selected" : ""}`}
                  onClick={() => setSelectedPayment("visa")}
                >
                  <img src="./assets/visa.jpg" alt="Visa" className="payment-logo" />
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
