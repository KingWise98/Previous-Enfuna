import React, { useEffect, useMemo, useState } from 'react';
import './trips.css';

import airtelImg from './assets/airtel.jpg';
import mtnImg from './assets/mtn.jpg';
import visaImg from './assets/visa.jpg';

const DrivePage = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
    route: 'all'
  });

  const [activeTrip, setActiveTrip] = useState(null);
  const [showNewTripDialog, setShowNewTripDialog] = useState(false);
  const [showEndTripDialog, setShowEndTripDialog] = useState(false);
  const [showCancelTripDialog, setShowCancelTripDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('momo');
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tripTime, setTripTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [shiftActive] = useState(true);
  const [shiftDuration, setShiftDuration] = useState(2040); // 34 minutes in seconds
  const [isEditingFare, setIsEditingFare] = useState(false);
  const [fareInput, setFareInput] = useState('');
  // Shift statistics
  const [shiftStats, setShiftStats] = useState({
    totalTrips: 8,
    momoEarnings: 52000,
    cashEarnings: 44000,
    fuelExpenses: 15000,
    totalEarnings: 96000,
    netEarnings: 81000
  });

  const [tripForm, setTripForm] = useState({
    pickup: 'Kollo',
    destination: 'Ntinda',
    paymentMethod: 'momo',
    vehicle: 'UBB 472Z',
    fare: 2000
  });

  const [editForm, setEditForm] = useState({
    destination: '',
    fare: '',
    paymentMethod: 'cash',
    additionalStop: '',
    cancelReason: ''
  });

  const [tripHistory, setTripHistory] = useState([
    {
      id: 1,
      pickup: 'Kollo',
      destination: 'Ntinda',
      fare: 15000,
      paymentMethod: 'momo',
      status: 'completed',
      duration: '25 min',
      distance: '8.2 km',
      startTime: '2:30 PM',
      endTime: '2:55 PM',
      date: 'Today'
    },
    {
      id: 2,
      pickup: 'Makerere',
      destination: 'Garden City',
      fare: 12000,
      paymentMethod: 'cash',
      status: 'completed',
      duration: '20 min',
      distance: '6.5 km',
      startTime: '11:15 AM',
      endTime: '11:35 AM',
      date: 'Today'
    },
    {
      id: 3,
      pickup: 'Entebbe',
      destination: 'Airport',
      fare: 45000,
      paymentMethod: 'momo',
      status: 'completed',
      duration: '45 min',
      distance: '35 km',
      startTime: '9:00 AM',
      endTime: '9:45 AM',
      date: 'Today'
    }
  ]);

  // Popular destinations in Uganda
  const popularDestinations = [
    { name: 'Kollo', area: 'Kampala', emoji: '📍' },
    { name: 'Ntinda', area: 'Kampala', emoji: '📍' },
    { name: 'Garden City Mall', area: 'Kampala', emoji: '🛍️' },
    { name: 'Acacia Mall', area: 'Kisementi', emoji: '🏬' },
    { name: 'Makerere University', area: 'Makerere', emoji: '🎓' },
    { name: 'Mulago Hospital', area: 'Mulago', emoji: '🏥' },
    { name: 'Entebbe Airport', area: 'Entebbe', emoji: '✈️' },
    { name: 'Nakasero Market', area: 'Nakasero', emoji: '🥦' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'momo', label: 'MoMo' },
    { value: 'card', label: 'Card' }
  ];

  // Real-time trip timer
  useEffect(() => {
    let interval;
    if (activeTrip) {
      interval = setInterval(() => {
        setTripTime(prev => prev + 1);
      }, 1000);
    } else {
      setTripTime(0);
    }
    return () => clearInterval(interval);
  }, [activeTrip]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('driver_trip_draft');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;
      setTripForm((p) => ({
        ...p,
        ...parsed,
        fare: Number(parsed.fare ?? p.fare) || p.fare
      }));
    } catch (_) {
      // ignore
    }
  }, []);

  // Shift timer
  useEffect(() => {
    let interval;
    if (shiftActive) {
      interval = setInterval(() => {
        setShiftDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [shiftActive]);

  // Calculate earnings based on trip time (simulated)
  useEffect(() => {
    if (activeTrip) {
      const baseFare = parseInt(activeTrip.fare) || 0;
      const timeBonus = Math.floor(tripTime / 60) * 500; // 500 UGX per minute
      setEarnings(baseFare + timeBonus);
    }
  }, [tripTime, activeTrip]);

  useEffect(() => {
    if (!showPaymentDialog) return;
    const base = activeTrip ? earnings : Number(tripForm.fare || 0);
    setReceiveAmount(Number.isFinite(base) ? base : 0);
  }, [showPaymentDialog, activeTrip, earnings, tripForm.fare]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const commitFare = () => {
    const next = Number(String(fareInput).replace(/,/g, '').trim());
    if (!Number.isFinite(next) || next < 0) {
      showSnackbar('Invalid amount', 'error');
      return;
    }
    setTripForm((p) => ({ ...p, fare: Math.round(next) }));
    setIsEditingFare(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatShiftTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const handleStartTrip = () => {
    if (!tripForm.destination) {
      showSnackbar('Please select destination', 'error');
      return;
    }

    const selectedDestination = popularDestinations.find(dest => dest.name === tripForm.destination);

    const newTrip = {
      id: Date.now(),
      pickup: tripForm.pickup,
      destination: tripForm.destination,
      area: selectedDestination?.area,
      emoji: selectedDestination?.emoji,
      fare: Number(tripForm.fare) || 0,
      paymentMethod: tripForm.paymentMethod,
      vehicle: tripForm.vehicle,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startTimestamp: new Date(),
      status: 'active',
      additionalStops: []
    };

    setActiveTrip(newTrip);
    setShowNewTripDialog(false);
    setTripTime(0);
    showSnackbar('Trip started! Drive safely.');
  };

  const handleEndTrip = () => {
    if (!activeTrip) return;

    const tripDuration = formatTime(tripTime);
    const distance = calculateDistance();

    const completedTrip = {
      ...activeTrip,
      id: Date.now(),
      status: 'completed',
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: tripDuration,
      distance: `${(distance).toFixed(1)} km`,
      fare: earnings,
      date: 'Today'
    };

    // Update shift stats
    const paymentKey = activeTrip.paymentMethod === 'momo' ? 'momoEarnings' :
                      activeTrip.paymentMethod === 'cash' ? 'cashEarnings' : 'momoEarnings';
    
    setShiftStats(prev => ({
      ...prev,
      totalTrips: prev.totalTrips + 1,
      [paymentKey]: prev[paymentKey] + earnings,
      totalEarnings: prev.totalEarnings + earnings,
      netEarnings: prev.netEarnings + earnings
    }));

    setTripHistory(prev => [completedTrip, ...prev]);
    setActiveTrip(null);
    setShowEndTripDialog(false);
    showSnackbar(`Trip completed! You earned UGX ${earnings.toLocaleString()}`);
  };

  const handleCancelTrip = () => {
    if (!activeTrip) return;

    const cancelledTrip = {
      ...activeTrip,
      id: Date.now(),
      status: 'cancelled',
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: formatTime(tripTime),
      distance: `${calculateDistance().toFixed(1)} km`,
      fare: 0,
      cancelReason: editForm.cancelReason,
      date: 'Today'
    };

    setTripHistory(prev => [cancelledTrip, ...prev]);
    setActiveTrip(null);
    setShowCancelTripDialog(false);
    setEditForm((p) => ({ ...p, cancelReason: '' }));
    showSnackbar('Trip cancelled.', 'success');
  };

  const calculateDistance = () => {
    return (tripTime / 60) * 0.8;
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'momo': return 'MoMo';
      case 'airtel': return 'Airtel Money';
      case 'visa': return 'VISA';
      case 'qr': return 'QR Code';
      case 'split': return 'Split Payment';
      default: return 'Cash';
    }
  };

  const filteredTrips = useMemo(() => {
    return tripHistory
      .filter((t) => {
        const routeStr = `${t.pickup} ${t.destination}`.toLowerCase();
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return routeStr.includes(query) || String(t.id).toLowerCase().includes(query);
      })
      .filter((t) => {
        if (filters.paymentMethod === 'all') return true;
        return t.paymentMethod === filters.paymentMethod;
      })
      .filter((t) => {
        if (filters.status === 'all') return true;
        return t.status === filters.status;
      });
  }, [tripHistory, searchQuery, filters.paymentMethod, filters.status]);

  const analytics = useMemo(() => {
    const totalTrips = filteredTrips.length;
    const completedTrips = filteredTrips.filter((t) => t.status === 'completed').length;
    const cancelledTrips = filteredTrips.filter((t) => t.status === 'cancelled').length;
    const totalMoney = filteredTrips.reduce((sum, t) => {
      if (t.status !== 'completed') return sum;
      const amount = Number(t.fare);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
    const cancellationRate = totalTrips === 0 ? 0 : (cancelledTrips / totalTrips) * 100;

    return {
      totalTrips,
      completedTrips,
      cancelledTrips,
      totalMoney,
      cancellationRate
    };
  }, [filteredTrips]);

  return (
    <div className="trips-container driver-trips-scope">
      {currentView === 'dashboard' && (
        <div className="trips-dashboard">
          <div className="trips-header">
            <input
              className="trips-search"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="trips-header-icons">
              <button className="icon-btn" type="button" onClick={() => setCurrentView('history')}>≡</button>
              <button className="icon-btn" type="button" onClick={() => setShowNewTripDialog(true)}>＋</button>
            </div>
          </div>

          <div className="quick-actions">
            <div className="section-header">
              <div>
                <h2 className="section-title">Quick Actions</h2>
              </div>
              <button className="complete-profile-btn" type="button">Complete Profile</button>
            </div>
            <div className="action-buttons">
              <button className="action-btn primary" type="button" onClick={() => setShowNewTripDialog(true)}>Start Trip</button>
              <button className="action-btn" type="button">Start Delivery</button>
              <button className="action-btn" type="button" onClick={() => setShowPaymentDialog(true)}>Receive Money</button>
              <button className="action-btn" type="button">Withdraw Money</button>
              <button className="action-btn" type="button">Add Expenses</button>
            </div>
          </div>

          {!activeTrip && (
            <div className="wallet-section">
              <div className="wallet-label">Wallet Balance</div>
              <div className="wallet-amount">
                <div className="wallet-balance">{shiftStats.netEarnings.toLocaleString()}</div>
                <div className="wallet-currency">UGX</div>
              </div>
              <div className="wallet-label-sub">Available Balance</div>
            </div>
          )}

          {activeTrip ? (
            <div className="ready-ride-section">
              <h2 className="ready-title driver">Active Trip</h2>
              <p className="ready-subtitle">{activeTrip.pickup} → {activeTrip.destination}</p>
              <p className="section-subtitle">Payment: {getPaymentLabel(activeTrip.paymentMethod)} • Vehicle: {activeTrip.vehicle}</p>
              <p className="section-subtitle">Time {formatTime(tripTime)} • Distance {calculateDistance().toFixed(1)} km • Earnings UGX {earnings.toLocaleString()}</p>
              <div className="action-buttons">
                <button className="action-btn" type="button" onClick={() => setShowEndTripDialog(true)}>End Trip</button>
                <button className="action-btn" type="button" onClick={() => setShowPaymentDialog(true)}>Receive Money</button>
                <button className="action-btn" type="button" onClick={() => setShowCancelTripDialog(true)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="ready-ride-section">
              <div className="motorcycle-icon">🚗</div>
              <h2 className="ready-title driver">Ready to Drive?</h2>
              <p className="ready-subtitle">Start a new trip and begin earning</p>
              <button className="start-trip-btn" type="button" onClick={() => setShowNewTripDialog(true)}>Start New Trip</button>
            </div>
          )}

          <div className="trip-history-preview">
            <div className="section-header">
              <div>
                <h2 className="section-title">Trip History</h2>
                <p className="section-subtitle">View completed trip summary</p>
              </div>
              <button className="view-detailed-btn" type="button" onClick={() => setCurrentView('history')}>View Detailed Trip History</button>
            </div>

            {tripHistory.slice(0, 3).map((trip) => (
              <div className="trip-preview-card" key={trip.id}>
                <div className="trip-preview-row">
                  <div>
                    <div className="trip-label">Route</div>
                    <div className="trip-value">{trip.pickup} → {trip.destination}</div>
                  </div>
                  <div>
                    <div className="trip-label">Amount</div>
                    <div className="trip-value">UGX {Number(trip.fare).toLocaleString()}</div>
                  </div>
                </div>
                <div className="trip-preview-bottom">
                  <div className="trip-amount">{trip.distance} • {trip.duration}</div>
                  <span className={`trip-payment-badge ${trip.paymentMethod === 'momo' ? 'momo' : 'cash'}`}>{getPaymentLabel(trip.paymentMethod)}</span>
                  <span className={`manual-override-badge ${trip.status === 'cancelled' ? 'cancelled' : ''}`}>{trip.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentView === 'history' && (
        <div className="trip-history-dashboard">
          <div className="history-header">
            <div>
              <h1>Trip History Dashboard</h1>
              <p>View all trips and filter by route, status and payment</p>
            </div>
            <div className="history-header-actions">
              <button className="export-btn" type="button" onClick={() => setCurrentView('dashboard')}>Back to Dashboard</button>
              <div className="user-badge">
                <div className="user-initial">D</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Driver</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{formatShiftTime(shiftDuration)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-panel">
            <div className="stats-cards">
              <div className="stat-card blue">
                <div className="stat-icon">🚗</div>
                <div className="stat-info">
                  <div className="stat-label">Total Trips</div>
                  <div className="stat-number">{analytics.totalTrips}</div>
                </div>
              </div>
              <div className="stat-card dark">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-label">Total Money</div>
                  <div className="stat-number">{analytics.totalMoney.toLocaleString()} <span className="currency-small">UGX</span></div>
                </div>
              </div>
              <div className="stat-card olive">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-label">Completed Trips</div>
                  <div className="stat-number">{analytics.completedTrips}</div>
                </div>
              </div>
              <div className="stat-card cream">
                <div className="stat-icon">✖</div>
                <div className="stat-info">
                  <div className="stat-label">Cancellation Rate</div>
                  <div className="stat-number">{analytics.cancellationRate.toFixed(1)}%</div>
                  <div className="stat-change negative">{analytics.cancelledTrips} cancelled</div>
                </div>
              </div>
            </div>
          </div>

          <div className="history-content">
            <div className="filters-sidebar">
              <h3>Filters</h3>
              <input
                className="filter-search"
                placeholder="Trip ID, Route…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="filter-group">
                <label>Status</label>
                <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Payment Method</label>
                <select value={filters.paymentMethod} onChange={(e) => setFilters((p) => ({ ...p, paymentMethod: e.target.value }))}>
                  <option value="all">All</option>
                  <option value="cash">Cash</option>
                  <option value="momo">MoMo</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <button
                className="clear-filters-btn"
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ status: 'all', paymentMethod: 'all', route: 'all' });
                }}
              >
                Clear Filters
              </button>
            </div>

            <div className="trips-table-container">
              <table className="trips-table">
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Route</th>
                    <th>Distance</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 18, textAlign: 'center' }}>No trips match the current filters.</td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip) => (
                      <tr key={trip.id}>
                        <td className="trip-id">{trip.id}</td>
                        <td>
                          <div className="route-cell">{trip.pickup} → {trip.destination}</div>
                          <div className="date-cell">{trip.date} • {trip.startTime}</div>
                        </td>
                        <td><div className="distance-cell">{trip.distance}</div></td>
                        <td><div className="duration-cell">{trip.duration}</div></td>
                        <td className="amount-cell">UGX {Number(trip.fare).toLocaleString()}</td>
                        <td><span className={`payment-badge ${trip.paymentMethod === 'momo' ? 'momo' : 'cash'}`}>{getPaymentLabel(trip.paymentMethod)}</span></td>
                        <td><span className={`status-badge ${trip.status === 'completed' ? 'completed' : 'cancelled'}`}>{trip.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="pagination">
                <div>Showing {filteredTrips.length} trips</div>
                <div className="pagination-btns">
                  <button type="button">Previous</button>
                  <button type="button">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewTripDialog && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card trip-setup-modal">
            <div className="trip-setup-titlebar">New Trip</div>
            <div className="modal-body">
              <div className="trip-setup-head">
                <div className="trip-setup-title">Trip Setup Form</div>
                <div className="trip-setup-subtitle">Configure your trip details and start your journey</div>
              </div>
              <div className="trip-setup-divider" />

              <div className="trip-setup-locations">
                <div className="trip-setup-field">
                  <label>Enter Pickup Location</label>
                  <select
                    className="trip-setup-input"
                    value={tripForm.pickup}
                    onChange={(e) => setTripForm((p) => ({ ...p, pickup: e.target.value }))}
                  >
                    {popularDestinations.map((dest) => (
                      <option key={dest.name} value={dest.name}>{dest.name}</option>
                    ))}
                  </select>
                </div>
                <div className="trip-setup-to">TO</div>
                <div className="trip-setup-field">
                  <label>Enter Destination</label>
                  <select
                    className="trip-setup-input"
                    value={tripForm.destination}
                    onChange={(e) => setTripForm((p) => ({ ...p, destination: e.target.value }))}
                  >
                    {popularDestinations.map((dest) => (
                      <option key={dest.name} value={dest.name}>{dest.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="trip-setup-amount">
                <div className="trip-setup-amount-label">Enter Amount</div>
                <div className="trip-setup-amount-box">
                  {isEditingFare ? (
                    <input
                      className="trip-setup-amount-input"
                      value={fareInput}
                      onChange={(e) => setFareInput(e.target.value)}
                      onBlur={commitFare}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitFare();
                        if (e.key === 'Escape') setIsEditingFare(false);
                      }}
                      inputMode="numeric"
                      autoFocus
                    />
                  ) : (
                    <div className="trip-setup-amount-value">{Number(tripForm.fare || 0).toLocaleString()}</div>
                  )}
                  <div className="trip-setup-amount-currency">UGX</div>
                </div>
                <button
                  type="button"
                  className="trip-setup-change-amount"
                  onClick={() => {
                    if (!isEditingFare) {
                      setFareInput(String(Number(tripForm.fare || 0)));
                      setIsEditingFare(true);
                      return;
                    }
                    commitFare();
                  }}
                >
                  Change Amount
                </button>
              </div>

              <div className="trip-setup-divider" />

              <div className="trip-setup-actions">
                <button type="button" className="trip-setup-btn primary" onClick={handleStartTrip} disabled={!tripForm.destination}>START TRIP</button>
                <button type="button" className="trip-setup-btn secondary" onClick={() => {
                  try {
                    localStorage.setItem('driver_trip_draft', JSON.stringify(tripForm));
                  } catch (_) {
                    // ignore
                  }
                  setShowNewTripDialog(false);
                  showSnackbar('Trip saved.', 'success');
                }}>SAVE TRIP</button>
                <button type="button" className="trip-setup-btn tertiary" onClick={() => {
                  try {
                    localStorage.removeItem('driver_trip_draft');
                  } catch (_) {
                    // ignore
                  }
                  setTripForm((p) => ({
                    ...p,
                    pickup: 'Kollo',
                    destination: 'Ntinda',
                    paymentMethod: 'momo',
                    vehicle: 'UBB 472Z',
                    fare: 2000
                  }));
                }}>CLEAR FORM</button>
              </div>

              <button type="button" className="trip-setup-cancel" onClick={() => setShowNewTripDialog(false)}>CANCEL TRIP</button>

              <div className="trip-setup-hidden-fields">
                <select value={tripForm.paymentMethod} onChange={(e) => setTripForm((p) => ({ ...p, paymentMethod: e.target.value }))}>
                  {paymentMethods.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <input value={tripForm.vehicle} onChange={(e) => setTripForm((p) => ({ ...p, vehicle: e.target.value }))} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showEndTripDialog && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">End Trip</div>
            <div className="modal-body">
              <div className="section-subtitle">Complete Trip to {activeTrip?.destination}</div>
              <div className="trip-preview-row" style={{ marginTop: 14 }}>
                <div>
                  <div className="trip-label">Duration</div>
                  <div className="trip-value">{formatTime(tripTime)}</div>
                </div>
                <div>
                  <div className="trip-label">Distance</div>
                  <div className="trip-value">{calculateDistance().toFixed(1)} km</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="trip-label">Total Earnings</div>
                <div className="trip-value">UGX {earnings.toLocaleString()}</div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="action-btn" onClick={() => setShowEndTripDialog(false)}>Continue Trip</button>
              <button type="button" className="action-btn" onClick={() => {
                setShowEndTripDialog(false);
                setShowPaymentDialog(true);
              }}>Receive Money</button>
              <button type="button" className="action-btn primary" onClick={handleEndTrip}>Confirm End Trip</button>
            </div>
          </div>
        </div>
      )}

      {showPaymentDialog && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card receive-money-modal">
            <div className="receive-money-header">Receive Money</div>
            <div className="modal-body">
              <div className="receive-money-section">
                <div className="receive-money-label">Enter Cash Amount</div>
                <div className="receive-money-amount">
                  <input
                    className="receive-money-amount-input"
                    value={Number(receiveAmount || 0).toLocaleString()}
                    onChange={(e) => {
                      const raw = String(e.target.value).replace(/,/g, '').trim();
                      const next = Number(raw);
                      if (!Number.isFinite(next)) {
                        setReceiveAmount(0);
                        return;
                      }
                      setReceiveAmount(next);
                    }}
                    inputMode="numeric"
                  />
                  <div className="receive-money-ugx">UGX</div>
                </div>
              </div>

              <div className="receive-money-section">
                <div className="receive-money-label">Select Payment Method</div>
                <div className="receive-money-divider" />
                <div className="receive-money-methods">
                  <button type="button" className={`pay-tile ${selectedPaymentMethod === 'cash' ? 'selected' : ''}`} onClick={() => setSelectedPaymentMethod('cash')}>
                    <div className="pay-tile-check">✓</div>
                    <div className="pay-tile-content cash">CASH</div>
                  </button>
                  <button type="button" className={`pay-tile ${selectedPaymentMethod === 'momo' ? 'selected' : ''}`} onClick={() => setSelectedPaymentMethod('momo')}>
                    <div className="pay-tile-check">✓</div>
                    <img className="pay-tile-image" src={mtnImg} alt="MoMo" />
                  </button>
                  <button type="button" className={`pay-tile ${selectedPaymentMethod === 'airtel' ? 'selected' : ''}`} onClick={() => setSelectedPaymentMethod('airtel')}>
                    <div className="pay-tile-check">✓</div>
                    <img className="pay-tile-image" src={airtelImg} alt="Airtel Money" />
                  </button>
                  <button type="button" className={`pay-tile ${selectedPaymentMethod === 'visa' ? 'selected' : ''}`} onClick={() => setSelectedPaymentMethod('visa')}>
                    <div className="pay-tile-check">✓</div>
                    <img className="pay-tile-image" src={visaImg} alt="VISA" />
                  </button>
                  <button type="button" className={`pay-tile ${selectedPaymentMethod === 'qr' ? 'selected' : ''}`} onClick={() => setSelectedPaymentMethod('qr')}>
                    <div className="pay-tile-check">✓</div>
                    <div className="pay-tile-content">
                      <div className="pay-tile-icon" aria-hidden="true">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3h8v8H3V3Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M13 3h8v8h-8V3Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M3 13h8v8H3v-8Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M13 13h4v4h-4v-4Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M17 17h4v4h-4v-4Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="pay-tile-caption">QR Code</div>
                    </div>
                  </button>
                  <button type="button" className={`pay-tile ${selectedPaymentMethod === 'split' ? 'selected' : ''}`} onClick={() => setSelectedPaymentMethod('split')}>
                    <div className="pay-tile-check">✓</div>
                    <div className="pay-tile-content">
                      <div className="pay-tile-icon" aria-hidden="true">
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="9" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                          <circle cx="15" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="pay-tile-caption">Split Payment</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="receive-money-actions">
              <button type="button" className="receive-money-btn ghost" onClick={() => setShowPaymentDialog(false)}>Cancel</button>
              <button
                type="button"
                className="receive-money-btn primary"
                onClick={() => {
                  setShowPaymentDialog(false);
                  setShowReceiptDialog(true);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceiptDialog && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">Customer Receipt</div>
            <div className="modal-body">
              <div className="trip-preview-row">
                <div>
                  <div className="trip-label">Pickup</div>
                  <div className="trip-value">{activeTrip?.pickup ?? '-'}</div>
                </div>
                <div>
                  <div className="trip-label">Destination</div>
                  <div className="trip-value">{activeTrip?.destination ?? '-'}</div>
                </div>
              </div>
              <div className="trip-preview-row" style={{ marginTop: 12 }}>
                <div>
                  <div className="trip-label">Duration</div>
                  <div className="trip-value">{formatTime(tripTime)}</div>
                </div>
                <div>
                  <div className="trip-label">Distance</div>
                  <div className="trip-value">{calculateDistance().toFixed(1)} km</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="trip-label">Amount Paid</div>
                <div className="trip-value">UGX {Number(receiveAmount || 0).toLocaleString()}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="trip-label">Payment Method</div>
                <div className="trip-value">{getPaymentLabel(selectedPaymentMethod)}</div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="action-btn" onClick={() => setShowReceiptDialog(false)}>Back</button>
              <button type="button" className="action-btn primary" onClick={() => {
                setShowReceiptDialog(false);
                if (activeTrip) handleEndTrip();
              }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showCancelTripDialog && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">Cancel Trip</div>
            <div className="modal-body">
              <div className="filter-group">
                <label>Reason</label>
                <input value={editForm.cancelReason} onChange={(e) => setEditForm((p) => ({ ...p, cancelReason: e.target.value }))} />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="action-btn" onClick={() => setShowCancelTripDialog(false)}>Back</button>
              <button type="button" className="action-btn primary" onClick={handleCancelTrip} disabled={!activeTrip}>Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

      {snackbar.open && (
        <div className="toast" role="status">
          <div className="toast-inner">
            <span>{snackbar.message}</span>
            <button type="button" className="icon-btn" onClick={() => setSnackbar((p) => ({ ...p, open: false }))}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrivePage;