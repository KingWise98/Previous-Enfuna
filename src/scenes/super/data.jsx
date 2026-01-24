"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Users,
  User,
  Activity,
  Bike,
  Package,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Lock,
  Ban,
  Unlock,
  Download,
  RefreshCw,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Eye,
  Car,
  Hash,
  Award,
  Star,
  Battery,
  Navigation,
  Coffee,
  X,
  Send,
  Upload,
  Save,
  Printer,
  Share2,
  Bell,
  Settings,
  LogOut,
  AlertTriangle,
  Check,
} from "lucide-react"

export default function RiderManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedRider, setSelectedRider] = useState(null)
  const [showAccountActions, setShowAccountActions] = useState(false)
  const [activeView, setActiveView] = useState("list") // list, profile, history, vehicle
  const [isSuperAdmin, setIsSuperAdmin] = useState(true)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showTrackLocation, setShowTrackLocation] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationConfig, setConfirmationConfig] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  // Dummy data for demonstration
  const ridersData = [
    {
      id: "R001",
      name: "John Kamau",
      phone: "+256 712 345 678",
      email: "john.kamau@example.com",
      status: "active",
      rating: 4.8,
      totalTrips: 245,
      totalDeliveries: 120,
      earnings: "1,250,000 UGX",
      vehicleType: "Motorcycle",
      vehiclePlate: "UBA 234A",
      lastActive: "2 hours ago",
      joinDate: "2024-01-15",
      tier: "Gold",
      location: "Kampala CBD",
      isOnline: true,
      isBlacklisted: false,
      isSuspended: false,
      address: "Plot 123, Kampala Road",
      emergencyContact: "+256 712 999 888",
      licenseNumber: "DL-456789",
    },
    {
      id: "R002",
      name: "Sarah Nakato",
      phone: "+256 713 456 789",
      email: "sarah.n@example.com",
      status: "inactive",
      rating: 4.5,
      totalTrips: 180,
      totalDeliveries: 95,
      earnings: "980,000 UGX",
      vehicleType: "Bicycle",
      vehiclePlate: "N/A",
      lastActive: "5 days ago",
      joinDate: "2024-02-20",
      tier: "Silver",
      location: "Entebbe",
      isOnline: false,
      isBlacklisted: false,
      isSuspended: true,
      address: "Plot 456, Entebbe Road",
      emergencyContact: "+256 713 888 777",
      licenseNumber: "DL-123456",
    }
  ]

  const tripHistoryData = [
    {
      id: "T789001",
      riderId: "R001",
      type: "Quick Trip",
      pickup: "Kampala Road",
      dropoff: "Nakawa",
      distance: "4.2 km",
      duration: "18 min",
      fare: "3,500 UGX",
      status: "completed",
      date: "2024-03-15 09:30",
      customer: "David O.",
      rating: 5,
    },
    {
      id: "T789002",
      riderId: "R001",
      type: "Delivery",
      pickup: "Garden City",
      dropoff: "Makerere",
      distance: "5.8 km",
      duration: "25 min",
      fare: "4,200 UGX",
      status: "completed",
      date: "2024-03-15 11:15",
      customer: "Sarah M.",
      rating: 4,
    }
  ]

  const deliveryHistoryData = [
    {
      id: "D456001",
      riderId: "R001",
      type: "Food Delivery",
      merchant: "KFC Garden City",
      customer: "James K.",
      items: 3,
      distance: "3.5 km",
      fee: "2,800 UGX",
      tip: "500 UGX",
      status: "delivered",
      date: "2024-03-14 13:45",
    },
    {
      id: "D456002",
      riderId: "R001",
      type: "Package Delivery",
      merchant: "Jumia Warehouse",
      customer: "Linda P.",
      weight: "2.5 kg",
      distance: "7.2 km",
      fee: "3,500 UGX",
      tip: "1,000 UGX",
      status: "delivered",
      date: "2024-03-14 16:20",
    }
  ]

  const activitySummary = {
    today: {
      trips: 12,
      deliveries: 8,
      onlineHours: "6.5",
      earnings: "45,000 UGX",
      rating: 4.9,
    },
    weekly: {
      trips: 78,
      deliveries: 45,
      onlineHours: "42",
      earnings: "285,000 UGX",
      rating: 4.7,
    },
    monthly: {
      trips: 245,
      deliveries: 120,
      onlineHours: "168",
      earnings: "1,250,000 UGX",
      rating: 4.8,
    }
  }

  const vehicleInfo = {
    type: "Motorcycle",
    make: "TVS Star",
    model: "2022",
    plate: "UBA 234A",
    color: "Black/Red",
    insurance: "Valid until Dec 2024",
    inspection: "Last: Mar 2024",
    mileage: "12,450 km",
    status: "Active",
    documents: ["Insurance", "Registration", "Inspection"],
  }

  const stats = [
    {
      label: "Total Riders",
      value: "245",
      icon: Users,
      color: "#2563eb",
    },
    {
      label: "Active Now",
      value: "189",
      icon: Activity,
      color: "#059669",
    },
    {
      label: "New This Month",
      value: "42",
      icon: User,
      color: "#7c3aed",
    },
    {
      label: "Suspended",
      value: "8",
      icon: Ban,
      color: "#ea580c",
    },
  ]

  // Custom confirmation function
  const showCustomConfirm = (config) => {
    setConfirmationConfig(config)
    setShowConfirmation(true)
  }

  // Handle confirmation result
  const handleConfirmation = (confirmed) => {
    if (confirmed && confirmationConfig?.onConfirm) {
      confirmationConfig.onConfirm()
    }
    setShowConfirmation(false)
    setConfirmationConfig(null)
  }

  // Handle Edit Profile
  const handleEditProfile = () => {
    if (selectedRider) {
      setEditFormData({
        name: selectedRider.name,
        phone: selectedRider.phone,
        email: selectedRider.email,
        address: selectedRider.address,
        emergencyContact: selectedRider.emergencyContact,
        licenseNumber: selectedRider.licenseNumber,
      })
      setShowEditProfile(true)
    }
  }

  const handleSaveProfile = () => {
    // In a real app, you would update the backend here
    showCustomConfirm({
      title: "Save Changes",
      message: `Are you sure you want to update ${editFormData.name}'s profile?`,
      type: "info",
      onConfirm: () => {
        alert(`Profile updated successfully for ${editFormData.name}`)
        setShowEditProfile(false)
        // Update the selected rider data
        if (selectedRider) {
          setSelectedRider({
            ...selectedRider,
            ...editFormData
          })
        }
      }
    })
  }

  // Handle Account Actions
  const handleAccountAction = (action) => {
    let config = {
      title: "",
      message: "",
      type: "warning",
      onConfirm: () => {}
    }
    
    switch(action) {
      case 'suspend':
        config = {
          title: "Suspend Account",
          message: `Suspending rider: ${selectedRider?.name}. Are you sure?`,
          type: "warning",
          onConfirm: () => {
            alert(`Rider ${selectedRider?.name} has been suspended.`)
            // Update rider status in real app
          }
        }
        break;
      case 'unsuspend':
        config = {
          title: "Unsuspend Account",
          message: `Unsuspending rider: ${selectedRider?.name}. Are you sure?`,
          type: "info",
          onConfirm: () => {
            alert(`Rider ${selectedRider?.name} has been unsuspended.`)
            // Update rider status in real app
          }
        }
        break;
      case 'resetPin':
        config = {
          title: "Reset PIN",
          message: `Resetting PIN for: ${selectedRider?.name}. New PIN will be sent via SMS.`,
          type: "info",
          onConfirm: () => {
            alert(`PIN reset SMS sent to ${selectedRider?.phone}`)
          }
        }
        break;
      case 'resetPassword':
        config = {
          title: "Reset Password",
          message: `Resetting password for: ${selectedRider?.name}. Reset link will be sent to email.`,
          type: "info",
          onConfirm: () => {
            alert(`Password reset link sent to ${selectedRider?.email}`)
          }
        }
        break;
      case 'blacklist':
        config = {
          title: "Blacklist Rider",
          message: `Blacklisting rider: ${selectedRider?.name}. This action cannot be undone. Are you sure?`,
          type: "danger",
          onConfirm: () => {
            alert(`Rider ${selectedRider?.name} has been blacklisted.`)
          }
        }
        break;
      case 'unblacklist':
        config = {
          title: "Remove from Blacklist",
          message: `Removing ${selectedRider?.name} from blacklist. Are you sure?`,
          type: "info",
          onConfirm: () => {
            alert(`Rider ${selectedRider?.name} has been removed from blacklist.`)
          }
        }
        break;
      case 'merge':
        config = {
          title: "Merge Accounts",
          message: `Initiating account merge for: ${selectedRider?.name}. Select duplicate account to merge.`,
          type: "info",
          onConfirm: () => {
            alert("Account merge initiated. Please select the duplicate account.")
            // Show merge modal in real app
          }
        }
        break;
      default:
        return;
    }
    
    showCustomConfirm(config)
    setShowAccountActions(false)
  }

  // Render Functions
  const renderRiderList = () => (
    <div className="rider-management-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">RIDER MANAGEMENT</h2>
        <div className="header-actions">
          <button className="action-btn primary" onClick={() => alert("Exporting rider data...")}>
            <Download size={16} />
            Export
          </button>
          <button className="action-btn secondary" onClick={() => alert("Refreshing data...")}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: `${stat.color}15` }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-box">
          <Search size={18} color="#666" />
          <input
            type="text"
            placeholder="Search riders by name, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search">
              <XCircle size={16} />
            </button>
          )}
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'active' ? 'active' : ''}`}
            onClick={() => setActiveFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setActiveFilter('inactive')}
          >
            Inactive
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'suspended' ? 'active' : ''}`}
            onClick={() => setActiveFilter('suspended')}
          >
            Suspended
          </button>
          {isSuperAdmin && (
            <button 
              className={`filter-btn ${activeFilter === 'blacklisted' ? 'active' : ''}`}
              onClick={() => setActiveFilter('blacklisted')}
            >
              Blacklisted
            </button>
          )}
          <button className="filter-btn" onClick={() => alert("Opening advanced filters...")}>
            <Filter size={14} />
            More Filters
          </button>
        </div>
      </div>

      {/* Riders List */}
      <div className="riders-list">
        <div className="list-header">
          <div className="header-item">Rider</div>
          <div className="header-item">Status</div>
          <div className="header-item">Trips/Deliveries</div>
          <div className="header-item">Earnings</div>
          <div className="header-item">Actions</div>
        </div>

        {ridersData.map((rider) => (
          <div key={rider.id} className="rider-card">
            <div className="rider-info">
              <div className="avatar" style={{ background: rider.isOnline ? '#059669' : '#6b7280' }}>
                {rider.name.charAt(0)}
              </div>
              <div className="rider-details">
                <div className="rider-name">{rider.name}</div>
                <div className="rider-id">{rider.id}</div>
                <div className="rider-contact">
                  <Phone size={12} />
                  <span>{rider.phone}</span>
                </div>
              </div>
            </div>

            <div className="status-cell">
              <div className={`status-badge ${rider.status}`}>
                <div className="status-dot"></div>
                {rider.isOnline ? 'Online' : 'Offline'}
              </div>
              {rider.isSuspended && (
                <div className="suspended-badge">
                  <Ban size={12} />
                  Suspended
                </div>
              )}
              {rider.isBlacklisted && (
                <div className="blacklisted-badge">
                  <Shield size={12} />
                  Blacklisted
                </div>
              )}
            </div>

            <div className="metrics-cell">
              <div className="metric">
                <Bike size={14} />
                <span>{rider.totalTrips} trips</span>
              </div>
              <div className="metric">
                <Package size={14} />
                <span>{rider.totalDeliveries} deliveries</span>
              </div>
            </div>

            <div className="earnings-cell">
              <div className="earnings-amount">{rider.earnings}</div>
              <div className="tier-badge" style={{ 
                background: rider.tier === 'Gold' ? '#fef3c7' : 
                           rider.tier === 'Silver' ? '#f3f4f6' : '#e0e7ff',
                color: rider.tier === 'Gold' ? '#92400e' : 
                      rider.tier === 'Silver' ? '#374151' : '#3730a3'
              }}>
                {rider.tier}
              </div>
            </div>

            <div className="actions-cell">
              <button 
                className="action-btn view-btn"
                onClick={() => {
                  setSelectedRider(rider);
                  setActiveView('profile');
                }}
                title="View Profile"
              >
                <Eye size={16} />
              </button>
              <button 
                className="action-btn more-btn"
                onClick={() => {
                  setSelectedRider(rider);
                  setShowAccountActions(true);
                }}
                title="More Actions"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderRiderProfile = () => (
    <div className="rider-management-container">
      {/* Back Button */}
      <div className="back-header">
        <button className="back-btn" onClick={() => setActiveView('list')}>
          ← Back to List
        </button>
        <h2 className="dashboard-title">RIDER PROFILE</h2>
      </div>

      {selectedRider && (
        <>
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {selectedRider.name.charAt(0)}
              {selectedRider.isOnline && <div className="online-indicator"></div>}
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{selectedRider.name}</h3>
              <div className="profile-id">{selectedRider.id}</div>
              <div className="profile-stats">
                <div className="stat-item">
                  <Star size={14} color="#f59e0b" />
                  <span>{selectedRider.rating} Rating</span>
                </div>
                <div className="stat-item">
                  <Calendar size={14} color="#6b7280" />
                  <span>Joined {selectedRider.joinDate}</span>
                </div>
                <div className="stat-item">
                  <MapPin size={14} color="#dc2626" />
                  <span>{selectedRider.location}</span>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button 
                className="action-btn primary"
                onClick={() => setActiveView('vehicle')}
              >
                <Car size={16} />
                Vehicle
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => setActiveView('history')}
              >
                <Activity size={16} />
                History
              </button>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="activity-summary">
            <h3 className="section-title">Activity Summary</h3>
            <div className="summary-grid">
              <div className="summary-card today-card">
                <div className="summary-label">Today</div>
                <div className="summary-stats">
                  <div className="stat">
                    <Bike size={14} color="#2563eb" />
                    <span>{activitySummary.today.trips} trips</span>
                  </div>
                  <div className="stat">
                    <Package size={14} color="#7c3aed" />
                    <span>{activitySummary.today.deliveries} deliveries</span>
                  </div>
                  <div className="stat">
                    <Clock size={14} color="#059669" />
                    <span>{activitySummary.today.onlineHours}h online</span>
                  </div>
                </div>
              </div>

              <div className="summary-card weekly-card">
                <div className="summary-label">This Week</div>
                <div className="summary-stats">
                  <div className="stat">
                    <Bike size={14} color="#2563eb" />
                    <span>{activitySummary.weekly.trips} trips</span>
                  </div>
                  <div className="stat">
                    <Package size={14} color="#7c3aed" />
                    <span>{activitySummary.weekly.deliveries} deliveries</span>
                  </div>
                  <div className="stat">
                    <Award size={14} color="#f59e0b" />
                    <span>Rating: {activitySummary.weekly.rating}</span>
                  </div>
                </div>
              </div>

              <div className="summary-card earnings-card">
                <div className="summary-label">Monthly Earnings</div>
                <div className="earnings-amount">{activitySummary.monthly.earnings}</div>
                <div className="earnings-breakdown">
                  <div><Bike size={12} /> {activitySummary.monthly.trips} trips</div>
                  <div><Package size={12} /> {activitySummary.monthly.deliveries} deliveries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Status */}
          <div className="details-grid">
            <div className="detail-card">
              <h4 className="detail-title">Contact Information</h4>
              <div className="detail-item">
                <Phone size={16} color="#2563eb" />
                <span>{selectedRider.phone}</span>
              </div>
              <div className="detail-item">
                <Mail size={16} color="#dc2626" />
                <span>{selectedRider.email}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} color="#059669" />
                <span>{selectedRider.location}</span>
              </div>
            </div>

            <div className="detail-card">
              <h4 className="detail-title">Account Status</h4>
              <div className="status-details">
                <div className="status-row">
                  <span>Account Status:</span>
                  <span className={`status ${selectedRider.status}`}>
                    {selectedRider.status.toUpperCase()}
                  </span>
                </div>
                <div className="status-row">
                  <span>Online Status:</span>
                  <span className={`status ${selectedRider.isOnline ? 'online' : 'offline'}`}>
                    {selectedRider.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                <div className="status-row">
                  <span>Suspension:</span>
                  <span className={`status ${selectedRider.isSuspended ? 'suspended' : 'active'}`}>
                    {selectedRider.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                  </span>
                </div>
                {selectedRider.isBlacklisted && (
                  <div className="status-row">
                    <span>Blacklist:</span>
                    <span className="status blacklisted">
                      BLACKLISTED
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className="quick-action-btn"
              onClick={() => setShowAccountActions(true)}
            >
              <MoreVertical size={18} />
              Account Actions
            </button>
            <button 
              className="quick-action-btn"
              onClick={handleEditProfile}
            >
              <Edit size={18} />
              Edit Profile
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => setShowTrackLocation(true)}
            >
              <Navigation size={18} />
              Track Location
            </button>
          </div>
        </>
      )}
    </div>
  )

  const renderTripHistory = () => (
    <div className="rider-management-container">
      <div className="back-header">
        <button className="back-btn" onClick={() => setActiveView('profile')}>
          ← Back to Profile
        </button>
        <h2 className="dashboard-title">TRIP & DELIVERY HISTORY</h2>
      </div>

      {selectedRider && (
        <>
          {/* Tabs */}
          <div className="history-tabs">
            <button className="tab-btn active">Trip History</button>
            <button className="tab-btn">Delivery History</button>
            <button className="tab-btn">Earnings Report</button>
          </div>

          {/* Trip History */}
          <div className="history-list">
            <div className="section-header">
              <h3 className="section-title">Recent Trips</h3>
              <button className="download-btn" onClick={() => alert("Downloading trip history...")}>
                <Download size={16} />
                Export
              </button>
            </div>
            {tripHistoryData
              .filter(trip => trip.riderId === selectedRider.id)
              .map((trip) => (
                <div key={trip.id} className="history-card">
                  <div className="history-header">
                    <div className="trip-id">{trip.id}</div>
                    <div className={`trip-status ${trip.status}`}>
                      {trip.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="trip-details">
                    <div className="detail">
                      <span className="label">Type:</span>
                      <span>{trip.type}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Date:</span>
                      <span>{trip.date}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Route:</span>
                      <span>{trip.pickup} → {trip.dropoff}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Distance:</span>
                      <span>{trip.distance}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Fare:</span>
                      <span className="fare">{trip.fare}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Rating:</span>
                      <span className="rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} 
                            fill={i < trip.rating ? "#f59e0b" : "#d1d5db"} 
                            color={i < trip.rating ? "#f59e0b" : "#d1d5db"}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="trip-actions">
                    <button className="small-btn" onClick={() => alert(`Viewing details for ${trip.id}`)}>
                      View Details
                    </button>
                    <button className="small-btn outline" onClick={() => alert(`Contacting customer for ${trip.id}`)}>
                      Contact Customer
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Delivery History */}
          <div className="history-list">
            <div className="section-header">
              <h3 className="section-title">Delivery History</h3>
              <button className="download-btn" onClick={() => alert("Downloading delivery history...")}>
                <Download size={16} />
                Export
              </button>
            </div>
            {deliveryHistoryData
              .filter(delivery => delivery.riderId === selectedRider.id)
              .map((delivery) => (
                <div key={delivery.id} className="history-card">
                  <div className="history-header">
                    <div className="trip-id">{delivery.id}</div>
                    <div className={`trip-status ${delivery.status}`}>
                      {delivery.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="trip-details">
                    <div className="detail">
                      <span className="label">Type:</span>
                      <span>{delivery.type}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Merchant:</span>
                      <span>{delivery.merchant}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Customer:</span>
                      <span>{delivery.customer}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Distance:</span>
                      <span>{delivery.distance}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Total:</span>
                      <span className="fare">{delivery.fee} + {delivery.tip} tip</span>
                    </div>
                  </div>
                  <div className="trip-actions">
                    <button className="small-btn" onClick={() => alert(`Viewing details for ${delivery.id}`)}>
                      View Details
                    </button>
                    <button className="small-btn outline" onClick={() => alert(`Contacting merchant for ${delivery.id}`)}>
                      Contact Merchant
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )

  const renderVehicleInfo = () => (
    <div className="rider-management-container">
      <div className="back-header">
        <button className="back-btn" onClick={() => setActiveView('profile')}>
          ← Back to Profile
        </button>
        <h2 className="dashboard-title">VEHICLE INFORMATION</h2>
      </div>

      <div className="vehicle-info-container">
        {/* Vehicle Summary */}
        <div className="vehicle-summary">
          <div className="vehicle-icon">
            <Car size={48} color="#2563eb" />
          </div>
          <div className="vehicle-details">
            <h3 className="vehicle-title">{vehicleInfo.make} {vehicleInfo.model}</h3>
            <div className="vehicle-plate">{vehicleInfo.plate}</div>
            <div className="vehicle-type">{vehicleInfo.type} • {vehicleInfo.color}</div>
            <div className={`vehicle-status ${vehicleInfo.status.toLowerCase()}`}>
              {vehicleInfo.status}
            </div>
          </div>
        </div>

        {/* Vehicle Details Grid */}
        <div className="vehicle-details-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <Bike size={20} color="#059669" />
            </div>
            <div>
              <div className="detail-label">Mileage</div>
              <div className="detail-value">{vehicleInfo.mileage}</div>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-icon">
              <Shield size={20} color="#dc2626" />
            </div>
            <div>
              <div className="detail-label">Insurance</div>
              <div className="detail-value">{vehicleInfo.insurance}</div>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-icon">
              <CheckCircle size={20} color="#7c3aed" />
            </div>
            <div>
              <div className="detail-label">Last Inspection</div>
              <div className="detail-value">{vehicleInfo.inspection}</div>
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-icon">
              <Activity size={20} color="#f59e0b" />
            </div>
            <div>
              <div className="detail-label">Status</div>
              <div className="detail-value">{vehicleInfo.status}</div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="documents-section">
          <div className="section-header">
            <h3 className="section-title">Vehicle Documents</h3>
            <button className="upload-btn" onClick={() => alert("Upload new document")}>
              <Upload size={16} />
              Upload
            </button>
          </div>
          <div className="documents-list">
            {vehicleInfo.documents.map((doc, index) => (
              <div key={index} className="document-card">
                <div className="document-icon">
                  <Shield size={20} color="#2563eb" />
                </div>
                <div className="document-name">{doc}</div>
                <div className="document-actions">
                  <button className="view-doc-btn" onClick={() => alert(`Viewing ${doc}`)}>View</button>
                  <button className="download-doc-btn" onClick={() => alert(`Downloading ${doc}`)}>
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Actions */}
        <div className="vehicle-actions">
          <button className="action-btn primary" onClick={() => alert("Updating vehicle information...")}>
            <Edit size={16} />
            Update Information
          </button>
          <button className="action-btn secondary" onClick={() => alert("Reporting vehicle issue...")}>
            <AlertCircle size={16} />
            Report Issue
          </button>
          <button className="action-btn outline" onClick={() => alert("Downloading all documents...")}>
            <Download size={16} />
            Download All
          </button>
        </div>
      </div>
    </div>
  )

  // Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!showConfirmation || !confirmationConfig) return null

    const getIconColor = () => {
      switch(confirmationConfig.type) {
        case 'danger': return '#dc2626'
        case 'warning': return '#ea580c'
        case 'info': return '#2563eb'
        case 'success': return '#059669'
        default: return '#2563eb'
      }
    }

    const getIcon = () => {
      switch(confirmationConfig.type) {
        case 'danger': return <AlertTriangle size={48} color={getIconColor()} />
        case 'warning': return <AlertTriangle size={48} color={getIconColor()} />
        case 'info': return <AlertCircle size={48} color={getIconColor()} />
        case 'success': return <CheckCircle size={48} color={getIconColor()} />
        default: return <AlertCircle size={48} color={getIconColor()} />
      }
    }

    const getButtonColor = () => {
      switch(confirmationConfig.type) {
        case 'danger': return '#dc2626'
        case 'warning': return '#ea580c'
        case 'info': return '#2563eb'
        case 'success': return '#059669'
        default: return '#2563eb'
      }
    }

    return (
      <div className="modal-overlay" onClick={() => handleConfirmation(false)}>
        <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
          <div className="confirmation-header">
            {getIcon()}
            <h3 className="confirmation-title">{confirmationConfig.title}</h3>
          </div>
          
          <div className="confirmation-body">
            <p className="confirmation-message">{confirmationConfig.message}</p>
          </div>

          <div className="confirmation-actions">
            <button 
              className="confirmation-btn cancel"
              onClick={() => handleConfirmation(false)}
            >
              Cancel
            </button>
            <button 
              className="confirmation-btn confirm"
              onClick={() => handleConfirmation(true)}
              style={{ background: getButtonColor() }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        /* Base Container */
        .rider-management-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          background: #ffffff;
        }

        /* Header Styles */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .dashboard-title {
          color: white;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          background: white;
          padding: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .back-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .back-btn {
          background: #eff6ff;
          color: #1e40af;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #dbeafe;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          margin: 4px 0;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Search and Filters */
        .search-filters-section {
          margin-bottom: 24px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 16px;
          transition: all 0.2s;
        }

        .search-box:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          padding-left: 8px;
          color: #374151;
          background: transparent;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .clear-search {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .filter-btn.active {
          background: #1e40af;
          color: white;
          border-color: #1e40af;
        }

        /* Riders List */
        .riders-list {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .list-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1fr 0.5fr;
          background: #f8fafc;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .rider-card {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1fr 0.5fr;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
          transition: background 0.2s;
        }

        .rider-card:hover {
          background: #f8fafc;
        }

        .rider-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }

        .rider-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rider-name {
          font-weight: 600;
          color: #111827;
        }

        .rider-id {
          font-size: 12px;
          color: #6b7280;
        }

        .rider-contact {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        /* Status Badges */
        .status-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          width: fit-content;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #059669;
        }

        .status-badge.inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-badge.active .status-dot {
          background: #10b981;
        }

        .status-badge.inactive .status-dot {
          background: #9ca3af;
        }

        .suspended-badge,
        .blacklisted-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          width: fit-content;
        }

        .suspended-badge {
          background: #fed7aa;
          color: #ea580c;
        }

        .blacklisted-badge {
          background: #fecaca;
          color: #dc2626;
        }

        /* Metrics and Earnings */
        .metrics-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #4b5563;
        }

        .earnings-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .earnings-amount {
          font-weight: 600;
          color: #1e40af;
          font-size: 14px;
        }

        .tier-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          width: fit-content;
        }

        /* Action Buttons */
        .actions-cell {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn {
          background: #dbeafe;
          color: #1e40af;
        }

        .view-btn:hover {
          background: #bfdbfe;
        }

        .more-btn {
          background: #f3f4f6;
          color: #4b5563;
        }

        .more-btn:hover {
          background: #e5e7eb;
        }

        /* Profile Styles */
        .profile-header {
          display: flex;
          align-items: center;
          gap: 24px;
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #1e40af, #60a5fa);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 600;
          position: relative;
        }

        .online-indicator {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .profile-id {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .profile-stats {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4b5563;
          font-size: 14px;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn.primary {
          background: #1e40af;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          width: auto;
          height: auto;
        }

        .action-btn.primary:hover {
          background: #1e3a8a;
        }

        .action-btn.secondary {
          background: #eff6ff;
          color: #1e40af;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #bfdbfe;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          width: auto;
          height: auto;
        }

        .action-btn.secondary:hover {
          background: #dbeafe;
        }

        /* Activity Summary */
        .activity-summary {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .today-card {
          border-top: 4px solid #2563eb;
        }

        .weekly-card {
          border-top: 4px solid #7c3aed;
        }

        .summary-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .summary-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #374151;
        }

        .earnings-card {
          background: linear-gradient(135deg, #1e40af, #4f46e5);
          color: white;
          border: none;
        }

        .earnings-card .summary-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .earnings-amount {
          font-size: 24px;
          font-weight: 700;
          margin: 8px 0;
        }

        .earnings-breakdown {
          font-size: 12px;
          opacity: 0.9;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* Details Grid */
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .detail-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .detail-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .status-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .status-row:last-child {
          border-bottom: none;
        }

        .status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.online {
          background: #d1fae5;
          color: #059669;
        }

        .status.offline {
          background: #f3f4f6;
          color: #6b7280;
        }

        .status.suspended {
          background: #fed7aa;
          color: #ea580c;
        }

        .status.blacklisted {
          background: #fecaca;
          color: #dc2626;
        }

        /* Quick Actions */
        .quick-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-action-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        /* History Styles */
        .history-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
        }

        .history-tabs .tab-btn {
          padding: 10px 20px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .history-tabs .tab-btn.active {
          color: #1e40af;
          border-bottom-color: #1e40af;
        }

        .history-list {
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #eff6ff;
          color: #1e40af;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .history-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .trip-id {
          font-weight: 600;
          color: #1e40af;
        }

        .trip-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .trip-status.completed {
          background: #d1fae5;
          color: #059669;
        }

        .trip-status.delivered {
          background: #d1fae5;
          color: #059669;
        }

        .trip-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .label {
          color: #6b7280;
        }

        .fare {
          font-weight: 600;
          color: #1e40af;
        }

        .rating {
          display: flex;
          gap: 2px;
        }

        .trip-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
        }

        .small-btn {
          padding: 6px 12px;
          background: #eff6ff;
          color: #1e40af;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
        }

        .small-btn.outline {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
        }

        /* Vehicle Info */
        .vehicle-info-container {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .vehicle-summary {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .vehicle-icon {
          width: 80px;
          height: 80px;
          background: #eff6ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vehicle-details {
          flex: 1;
        }

        .vehicle-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .vehicle-plate {
          font-size: 18px;
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 4px;
        }

        .vehicle-type {
          color: #6b7280;
          margin-bottom: 8px;
        }

        .vehicle-status {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          width: fit-content;
        }

        .vehicle-status.active {
          background: #d1fae5;
          color: #059669;
        }

        .vehicle-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .detail-icon {
          width: 48px;
          height: 48px;
          background: #f8fafc;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .documents-section {
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .upload-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #eff6ff;
          color: #1e40af;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .document-card {
          display: flex;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .document-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          border: 1px solid #e5e7eb;
        }

        .document-name {
          flex: 1;
          font-weight: 500;
          color: #374151;
        }

        .document-actions {
          display: flex;
          gap: 8px;
        }

        .view-doc-btn,
        .download-doc-btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
        }

        .view-doc-btn {
          background: #eff6ff;
          color: #1e40af;
          border: none;
        }

        .download-doc-btn {
          background: white;
          border: 1px solid #d1d5db;
          color: #6b7280;
          display: flex;
          align-items: center;
        }

        .vehicle-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-btn.outline {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
        }

        /* Confirmation Modal */
        .confirmation-modal {
          max-width: 400px;
          padding: 0;
        }

        .confirmation-header {
          padding: 32px 32px 16px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .confirmation-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 16px 0 0;
        }

        .confirmation-body {
          padding: 24px 32px;
          text-align: center;
        }

        .confirmation-message {
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .confirmation-actions {
          padding: 24px 32px;
          display: flex;
          gap: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .confirmation-btn {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .confirmation-btn.cancel {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .confirmation-btn.cancel:hover {
          background: #e5e7eb;
        }

        .confirmation-btn.confirm {
          color: white;
          border: none;
        }

        .confirmation-btn.confirm:hover {
          opacity: 0.9;
        }

        /* Modals */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-height: 90vh;
          overflow-y: auto;
          width: 100%;
          max-width: 600px;
        }

        .modal-content.large {
          max-width: 800px;
        }

        .modal-content.xlarge {
          max-width: 1000px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .close-modal {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        /* Edit Profile Modal */
        .form-section {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          color: #374151;
          background: white;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .send-notification-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          padding: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .modal-btn {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .modal-btn.cancel {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .modal-btn.save {
          background: #1e40af;
          color: white;
          border: none;
        }

        /* Track Location Modal */
        .tracking-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          padding: 24px;
        }

        .map-container {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }

        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .map-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .map-title {
          font-weight: 600;
          color: #111827;
        }

        .map-status {
          font-size: 12px;
          color: #059669;
        }

        .map-controls {
          display: flex;
          gap: 8px;
        }

        .map-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: white;
          border: 1px solid #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .map-visualization {
          position: relative;
          height: 300px;
          background: #e0e7ff;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .map-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(5, 1fr);
          height: 100%;
        }

        .grid-cell {
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .rider-marker,
        .destination-marker {
          position: absolute;
          transform: translate(-50%, -50%);
        }

        .rider-marker {
          top: 60%;
          left: 30%;
        }

        .destination-marker {
          top: 30%;
          left: 70%;
        }

        .marker-icon {
          font-size: 24px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .marker-label {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .map-legend {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-dot.rider {
          background: #3b82f6;
        }

        .legend-dot.destination {
          background: #ef4444;
        }

        .legend-dot.route {
          background: #10b981;
        }

        .tracking-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .info-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .status-display {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: #d1fae5;
          border-radius: 8px;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-indicator.online {
          background: #10b981;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .info-item {
          text-align: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .info-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .modal-footer {
          padding: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .footer-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .footer-btn {
          padding: 10px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-btn.danger {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .rider-management-container {
            padding: 16px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .list-header {
            display: none;
          }

          .rider-card {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 16px;
          }

          .status-cell,
          .metrics-cell,
          .earnings-cell {
            padding-left: 52px;
          }

          .actions-cell {
            padding-left: 0;
            justify-content: flex-end;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .profile-stats {
            justify-content: center;
          }

          .profile-actions {
            width: 100%;
            justify-content: center;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            justify-content: center;
          }

          .trip-details {
            grid-template-columns: 1fr;
          }

          .vehicle-summary {
            flex-direction: column;
            text-align: center;
          }

          .vehicle-actions {
            justify-content: center;
          }

          .modal-content {
            max-width: 95%;
          }

          .tracking-container {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .footer-actions {
            flex-direction: column;
          }

          .confirmation-modal {
            max-width: 90%;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            overflow-x: auto;
            padding-bottom: 8px;
          }

          .filter-btn {
            white-space: nowrap;
          }

          .modal-content.large,
          .modal-content.xlarge {
            max-width: 95%;
          }

          .confirmation-actions {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Main Content */}
      {activeView === "list" && renderRiderList()}
      {activeView === "profile" && renderRiderProfile()}
      {activeView === "history" && renderTripHistory()}
      {activeView === "vehicle" && renderVehicleInfo()}

      {/* Confirmation Modal */}
      <ConfirmationModal />

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Rider Profile</h3>
              <button className="close-modal" onClick={() => setShowEditProfile(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="form-section">
              <h4 className="form-title">Personal Information</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    placeholder="+256 712 345 678"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    placeholder="rider@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={editFormData.emergencyContact || ''}
                    onChange={(e) => setEditFormData({...editFormData, emergencyContact: e.target.value})}
                    placeholder="+256 712 999 888"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">License Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormData.licenseNumber || ''}
                    onChange={(e) => setEditFormData({...editFormData, licenseNumber: e.target.value})}
                    placeholder="DL-123456"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-title">Account Settings</h4>
              <div className="form-group">
                <label className="form-label">Account Status</label>
                <select className="form-input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Rider Tier</label>
                <select className="form-input">
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-title">Send Notification</h4>
              <div className="form-group">
                <label className="form-label">Message to Rider</label>
                <textarea
                  className="form-textarea"
                  placeholder="Type a message to send to the rider..."
                  rows={3}
                />
              </div>
              <button className="send-notification-btn" onClick={() => alert("Notification sent!")}>
                <Send size={16} />
                Send Notification
              </button>
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowEditProfile(false)}>
                Cancel
              </button>
              <button className="modal-btn save" onClick={handleSaveProfile}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Location Modal */}
      {showTrackLocation && selectedRider && (
        <div className="modal-overlay" onClick={() => setShowTrackLocation(false)}>
          <div className="modal-content xlarge" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Live Location Tracking - {selectedRider?.name}</h3>
              <button className="close-modal" onClick={() => setShowTrackLocation(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="tracking-container">
              {/* Map Simulation */}
              <div className="map-container">
                <div className="map-header">
                  <div className="map-info">
                    <div className="map-title">Kampala CBD</div>
                    <div className="map-status">Live • Updated 2 mins ago</div>
                  </div>
                  <div className="map-controls">
                    <button className="map-btn" onClick={() => alert("Refreshing location...")}>
                      <RefreshCw size={16} />
                    </button>
                    <button className="map-btn" onClick={() => alert("Full screen map")}>
                      <Navigation size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Simplified Map Visualization */}
                <div className="map-visualization">
                  <div className="map-grid">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className="grid-cell"></div>
                    ))}
                  </div>
                  <div className="rider-marker">
                    <div className="marker-icon">🚗</div>
                    <div className="marker-label">{selectedRider?.name}</div>
                  </div>
                  <div className="destination-marker">
                    <div className="marker-icon">📍</div>
                    <div className="marker-label">Current Trip</div>
                  </div>
                </div>

                <div className="map-legend">
                  <div className="legend-item">
                    <div className="legend-dot rider"></div>
                    <span>Rider Location</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot destination"></div>
                    <span>Destination</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot route"></div>
                    <span>Route</span>
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              <div className="tracking-info">
                <div className="info-card">
                  <h4 className="info-title">Current Status</h4>
                  <div className="status-display">
                    <div className="status-indicator online"></div>
                    <span>Online & Active</span>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">Speed</div>
                      <div className="info-value">42 km/h</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Bearing</div>
                      <div className="info-value">NE 45°</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Accuracy</div>
                      <div className="info-value">± 15m</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Battery</div>
                      <div className="info-value">78%</div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h4 className="info-title">Trip Information</h4>
                  <div className="info-list">
                    <div className="info-row">
                      <span>Current Trip:</span>
                      <span>#T789003</span>
                    </div>
                    <div className="info-row">
                      <span>Started:</span>
                      <span>14:30 PM</span>
                    </div>
                    <div className="info-row">
                      <span>Duration:</span>
                      <span>18 minutes</span>
                    </div>
                    <div className="info-row">
                      <span>Distance:</span>
                      <span>4.2 km</span>
                    </div>
                    <div className="info-row">
                      <span>Estimated Arrival:</span>
                      <span>14:48 PM</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h4 className="info-title">Quick Actions</h4>
                  <div className="action-buttons">
                    <button className="action-btn primary" onClick={() => alert("Calling rider...")}>
                      <Phone size={16} />
                      Call Rider
                    </button>
                    <button className="action-btn secondary" onClick={() => alert("Sending message...")}>
                      <Send size={16} />
                      Send Message
                    </button>
                    <button className="action-btn outline" onClick={() => alert("Viewing route details...")}>
                      <Navigation size={16} />
                      View Route
                    </button>
                    <button className="action-btn outline" onClick={() => alert("Sharing location...")}>
                      <Share2 size={16} />
                      Share Location
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="footer-actions">
                <button className="footer-btn" onClick={() => alert("Printing location report...")}>
                  <Printer size={16} />
                  Print Report
                </button>
                <button className="footer-btn" onClick={() => alert("Downloading location history...")}>
                  <Download size={16} />
                  Export Data
                </button>
                <button className="footer-btn danger" onClick={() => showCustomConfirm({
                  title: "Emergency Alert",
                  message: "Send emergency alert to rider and support team?",
                  type: "danger",
                  onConfirm: () => alert("Emergency alert sent!")
                })}>
                  <AlertCircle size={16} />
                  Emergency Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Actions Modal */}
      {showAccountActions && selectedRider && (
        <div className="modal-overlay" onClick={() => setShowAccountActions(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Account Actions - {selectedRider.name}</h3>
              <button className="close-modal" onClick={() => setShowAccountActions(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="actions-list">
              {selectedRider.isSuspended ? (
                <div className="action-item" onClick={() => handleAccountAction('unsuspend')}>
                  <div className="action-icon warning">
                    <Unlock size={20} />
                  </div>
                  <div className="action-details">
                    <div className="action-name">Unsuspend Account</div>
                    <div className="action-description">Reactivate rider account and restore access</div>
                  </div>
                </div>
              ) : (
                <div className="action-item warning" onClick={() => handleAccountAction('suspend')}>
                  <div className="action-icon warning">
                    <Ban size={20} />
                  </div>
                  <div className="action-details">
                    <div className="action-name">Suspend Account</div>
                    <div className="action-description">Temporarily disable rider account</div>
                  </div>
                </div>
              )}

              <div className="action-item" onClick={() => handleAccountAction('resetPin')}>
                <div className="action-icon">
                  <Lock size={20} />
                </div>
                <div className="action-details">
                  <div className="action-name">Reset PIN</div>
                  <div className="action-description">Send new PIN via SMS</div>
                </div>
              </div>

              <div className="action-item" onClick={() => handleAccountAction('resetPassword')}>
                <div className="action-icon">
                  <Lock size={20} />
                </div>
                <div className="action-details">
                  <div className="action-name">Reset Password</div>
                  <div className="action-description">Send password reset link to email</div>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="super-admin-only">
                  <div className="super-admin-title">Super Admin Actions</div>
                  
                  {selectedRider.isBlacklisted ? (
                    <div className="action-item" onClick={() => handleAccountAction('unblacklist')}>
                      <div className="action-icon">
                        <Shield size={20} />
                      </div>
                      <div className="action-details">
                        <div className="action-name">Remove from Blacklist</div>
                        <div className="action-description">Remove rider from blacklist and restore account</div>
                      </div>
                    </div>
                  ) : (
                    <div className="action-item danger" onClick={() => handleAccountAction('blacklist')}>
                      <div className="action-icon danger">
                        <Shield size={20} />
                      </div>
                      <div className="action-details">
                        <div className="action-name">Blacklist Rider</div>
                        <div className="action-description">Permanently ban rider from the system</div>
                      </div>
                    </div>
                  )}

                  <div className="action-item" onClick={() => handleAccountAction('merge')}>
                    <div className="action-icon">
                      <Users size={20} />
                    </div>
                    <div className="action-details">
                      <div className="action-name">Merge Accounts</div>
                      <div className="action-description">Merge duplicate rider accounts</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowAccountActions(false)}>
                Cancel
              </button>
              <button className="modal-btn save" onClick={() => setShowAccountActions(false)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}