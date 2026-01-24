"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Users,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  FileText,
  Camera,
  Fingerprint,
  Smartphone,
  Globe,
  Calendar,
  Edit,
  Send,
  X,
  Upload,
  AlertTriangle,
  History,
  BarChart,
  MoreVertical,
  Info,
  Lock,
  Unlock,
  Image as ImageIcon,
  FileCheck,
  Ban,
} from "lucide-react"

export default function RiderKYCPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("pending")
  const [selectedKYC, setSelectedKYC] = useState(null)
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)
  const [showApproveConfirm, setShowApproveConfirm] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showResubmissionModal, setShowResubmissionModal] = useState(false)
  const [showKYCEditor, setShowKYCEditor] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [resubmissionNotes, setResubmissionNotes] = useState("")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(true)

  // Dummy KYC Data
  const kycSubmissions = [
    {
      id: "KYC001",
      riderId: "R001",
      riderName: "John Kamau",
      phone: "+256 712 345 678",
      submissionDate: "2024-03-15 09:30",
      status: "pending",
      level: "Basic",
      documents: {
        nationalId: { name: "National ID Front", status: "verified" },
        nationalIdBack: { name: "National ID Back", status: "verified" },
        selfie: { name: "Selfie Photo", status: "pending" },
        license: { name: "Driving License", status: "pending" },
      },
      riskScore: 12,
      reviewDue: "Today",
    },
    {
      id: "KYC002",
      riderId: "R002",
      riderName: "Sarah Nakato",
      phone: "+256 713 456 789",
      submissionDate: "2024-03-14 14:20",
      status: "approved",
      level: "Enhanced",
      documents: {
        nationalId: { name: "National ID", status: "verified" },
        passport: { name: "Passport", status: "verified" },
        selfie: { name: "Selfie", status: "verified" },
        license: { name: "License", status: "verified" },
      },
      riskScore: 5,
      reviewDue: "Completed",
    },
    {
      id: "KYC003",
      riderId: "R003",
      riderName: "David Okello",
      phone: "+256 714 567 890",
      submissionDate: "2024-03-13 11:45",
      status: "rejected",
      level: "Basic",
      documents: {
        nationalId: { name: "National ID", status: "rejected" },
        selfie: { name: "Selfie", status: "pending" },
      },
      riskScore: 65,
      reviewDue: "Overdue",
      rejectionReason: "ID document blurry and unreadable",
    },
    {
      id: "KYC004",
      riderId: "R004",
      riderName: "Grace Auma",
      phone: "+256 715 678 901",
      submissionDate: "2024-03-15 16:10",
      status: "resubmission",
      level: "Basic",
      documents: {
        nationalId: { name: "National ID", status: "resubmit" },
        selfie: { name: "Selfie", status: "pending" },
      },
      riskScore: 28,
      reviewDue: "Tomorrow",
      resubmissionNotes: "Please upload clearer photo of ID",
    },
  ]

  // KYC Levels Configuration
  const kycLevels = [
    {
      level: "Basic",
      requirements: ["National ID", "Selfie Photo"],
      limits: {
        dailyTransactions: "500,000 UGX",
        weeklyTransactions: "2,000,000 UGX",
        monthlyTransactions: "5,000,000 UGX",
      },
      status: "active",
      description: "For new riders with basic verification",
    },
    {
      level: "Enhanced",
      requirements: ["National ID", "Selfie Photo", "Proof of Address", "Driving License"],
      limits: {
        dailyTransactions: "2,000,000 UGX",
        weeklyTransactions: "10,000,000 UGX",
        monthlyTransactions: "30,000,000 UGX",
      },
      status: "active",
      description: "For verified riders with complete documentation",
    },
    {
      level: "Premium",
      requirements: ["National ID", "Passport", "Proof of Address", "Driving License", "Bank Statement"],
      limits: {
        dailyTransactions: "5,000,000 UGX",
        weeklyTransactions: "25,000,000 UGX",
        monthlyTransactions: "100,000,000 UGX",
      },
      status: "inactive",
      description: "For premium riders with additional verification",
    },
  ]

  // Device/IP Match History
  const deviceHistory = [
    {
      id: "DEV001",
      deviceId: "a1b2c3d4",
      deviceType: "Android",
      deviceModel: "Samsung Galaxy A12",
      ipAddress: "197.210.76.124",
      location: "Kampala, UG",
      lastSeen: "2024-03-15 09:30",
      matches: 3,
      status: "verified",
    },
    {
      id: "DEV002",
      deviceId: "e5f6g7h8",
      deviceType: "iOS",
      deviceModel: "iPhone 12",
      ipAddress: "41.210.84.56",
      location: "Entebbe, UG",
      lastSeen: "2024-03-14 14:20",
      matches: 1,
      status: "suspicious",
    },
    {
      id: "DEV003",
      deviceId: "i9j0k1l2",
      deviceType: "Android",
      deviceModel: "Tecno Spark 7",
      ipAddress: "197.210.76.124",
      location: "Kampala, UG",
      lastSeen: "2024-03-13 11:45",
      matches: 5,
      status: "blocked",
    },
  ]

  // KYC Audit Timeline
  const auditTimeline = [
    {
      id: "AUD001",
      action: "KYC Submitted",
      actor: "System",
      timestamp: "2024-03-15 09:30",
      details: "Rider submitted KYC documents for verification",
      status: "completed",
    },
    {
      id: "AUD002",
      action: "Document Review",
      actor: "Admin User",
      timestamp: "2024-03-15 10:15",
      details: "National ID verified successfully",
      status: "completed",
    },
    {
      id: "AUD003",
      action: "Document Review",
      actor: "Admin User",
      timestamp: "2024-03-15 10:30",
      details: "Selfie photo requires resubmission - poor quality",
      status: "pending",
    },
    {
      id: "AUD004",
      action: "Resubmission Requested",
      actor: "Admin User",
      timestamp: "2024-03-15 11:00",
      details: "Requested clearer selfie photo",
      status: "completed",
    },
  ]

  // Stats
  const stats = [
    {
      label: "Pending Review",
      value: "24",
      icon: Clock,
      color: "#f59e0b",
      change: "+5",
    },
    {
      label: "Approved Today",
      value: "18",
      icon: CheckCircle,
      color: "#059669",
      change: "+3",
    },
    {
      label: "Rejected",
      value: "7",
      icon: XCircle,
      color: "#dc2626",
      change: "-2",
    },
    {
      label: "Resubmissions",
      value: "12",
      icon: RefreshCw,
      color: "#2563eb",
      change: "+4",
    },
  ]

  // Handle KYC Actions
  const handleApproveKYC = () => {
    if (selectedKYC) {
      alert(`KYC ${selectedKYC.id} approved for ${selectedKYC.riderName}`)
      setShowApproveConfirm(false)
    }
  }

  const handleRejectKYC = () => {
    if (selectedKYC && rejectReason) {
      alert(`KYC ${selectedKYC.id} rejected. Reason: ${rejectReason}`)
      setShowRejectModal(false)
      setRejectReason("")
    }
  }

  const handleRequestResubmission = () => {
    if (selectedKYC && resubmissionNotes) {
      alert(`Resubmission requested for KYC ${selectedKYC.id}. Notes: ${resubmissionNotes}`)
      setShowResubmissionModal(false)
      setResubmissionNotes("")
    }
  }

  const handleUpdateKYCLevel = (levelId, updates) => {
    alert(`KYC Level ${levelId} updated`)
    // In real app, update kycLevels state
  }

  // Render KYC Submissions List
  const renderKYCList = () => (
    <div className="kyc-management-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">RIDER KYC MANAGEMENT</h2>
        <div className="header-actions">
          <button className="action-btn primary" onClick={() => alert("Exporting KYC data...")}>
            <Download size={16} />
            Export
          </button>
          <button className="action-btn secondary" onClick={() => alert("Refreshing data...")}>
            <RefreshCw size={16} />
            Refresh
          </button>
          {isSuperAdmin && (
            <button className="action-btn outline" onClick={() => setShowKYCEditor(true)}>
              <Edit size={16} />
              Edit Levels
            </button>
          )}
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
            <div className="stat-change" style={{ color: stat.color }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-box">
          <Search size={18} color="#666" />
          <input
            type="text"
            placeholder="Search by rider name, phone, or KYC ID..."
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
            className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveFilter('rejected')}
          >
            Rejected
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'resubmission' ? 'active' : ''}`}
            onClick={() => setActiveFilter('resubmission')}
          >
            Resubmission
          </button>
          <button className="filter-btn" onClick={() => alert("Opening advanced filters...")}>
            <Filter size={14} />
            More Filters
          </button>
        </div>
      </div>

      {/* KYC Submissions List */}
      <div className="kyc-list">
        <div className="list-header">
          <div className="header-item">Rider</div>
          <div className="header-item">KYC Details</div>
          <div className="header-item">Status</div>
          <div className="header-item">Risk Score</div>
          <div className="header-item">Actions</div>
        </div>

        {kycSubmissions.map((kyc) => (
          <div key={kyc.id} className="kyc-card">
            <div className="kyc-info">
              <div className="avatar" style={{ 
                background: kyc.status === 'approved' ? '#059669' : 
                           kyc.status === 'rejected' ? '#dc2626' : 
                           kyc.status === 'pending' ? '#f59e0b' : '#2563eb'
              }}>
                {kyc.riderName.charAt(0)}
              </div>
              <div className="kyc-details">
                <div className="rider-name">{kyc.riderName}</div>
                <div className="rider-id">{kyc.riderId} • {kyc.phone}</div>
                <div className="submission-date">
                  <Calendar size={12} />
                  Submitted: {kyc.submissionDate}
                </div>
              </div>
            </div>

            <div className="kyc-details-cell">
              <div className="kyc-id">{kyc.id}</div>
              <div className="kyc-level">Level: {kyc.level}</div>
              <div className="documents-count">
                <FileText size={12} />
                {Object.keys(kyc.documents).length} documents
              </div>
            </div>

            <div className="status-cell">
              <div className={`status-badge ${kyc.status}`}>
                {kyc.status.toUpperCase()}
              </div>
              <div className="review-due">
                <Clock size={12} />
                {kyc.reviewDue}
              </div>
              {kyc.status === 'rejected' && kyc.rejectionReason && (
                <div className="rejection-reason">
                  {kyc.rejectionReason}
                </div>
              )}
            </div>

            <div className="risk-cell">
              <div className={`risk-score ${kyc.riskScore > 50 ? 'high' : kyc.riskScore > 25 ? 'medium' : 'low'}`}>
                {kyc.riskScore}
              </div>
              <div className="risk-label">
                {kyc.riskScore > 50 ? 'High Risk' : kyc.riskScore > 25 ? 'Medium Risk' : 'Low Risk'}
              </div>
            </div>

            <div className="actions-cell">
              <button 
                className="action-btn view-btn"
                onClick={() => {
                  setSelectedKYC(kyc);
                  // Navigate to review screen
                }}
                title="Review KYC"
              >
                <Eye size={16} />
              </button>
              <button 
                className="action-btn more-btn"
                onClick={() => {
                  setSelectedKYC(kyc);
                  // Show more actions
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

  // Render KYC Review Screen
  const renderKYCReview = () => (
    <div className="kyc-review-container">
      {/* Back Button */}
      <div className="back-header">
        <button className="back-btn" onClick={() => setSelectedKYC(null)}>
          ← Back to List
        </button>
        <h2 className="dashboard-title">KYC REVIEW</h2>
      </div>

      {selectedKYC && (
        <>
          {/* KYC Header */}
          <div className="kyc-review-header">
            <div className="kyc-profile">
              <div className="profile-avatar">
                {selectedKYC.riderName.charAt(0)}
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{selectedKYC.riderName}</h3>
                <div className="profile-details">
                  <div className="detail">
                    <User size={14} />
                    <span>{selectedKYC.riderId}</span>
                  </div>
                  <div className="detail">
                    <Smartphone size={14} />
                    <span>{selectedKYC.phone}</span>
                  </div>
                  <div className="detail">
                    <Calendar size={14} />
                    <span>Submitted: {selectedKYC.submissionDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="kyc-actions">
              <button 
                className="action-btn success"
                onClick={() => setShowApproveConfirm(true)}
                disabled={selectedKYC.status === 'approved'}
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button 
                className="action-btn danger"
                onClick={() => setShowRejectModal(true)}
                disabled={selectedKYC.status === 'rejected'}
              >
                <XCircle size={16} />
                Reject
              </button>
              <button 
                className="action-btn warning"
                onClick={() => setShowResubmissionModal(true)}
                disabled={selectedKYC.status === 'resubmission'}
              >
                <RefreshCw size={16} />
                Request Resubmission
              </button>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="risk-assessment">
            <h3 className="section-title">Risk Assessment</h3>
            <div className="risk-metrics">
              <div className="risk-metric">
                <div className="metric-label">Overall Risk Score</div>
                <div className={`risk-score-display ${selectedKYC.riskScore > 50 ? 'high' : selectedKYC.riskScore > 25 ? 'medium' : 'low'}`}>
                  {selectedKYC.riskScore}/100
                </div>
              </div>
              <div className="risk-metric">
                <div className="metric-label">KYC Level</div>
                <div className="level-display">{selectedKYC.level}</div>
              </div>
              <div className="risk-metric">
                <div className="metric-label">Status</div>
                <div className={`status-display ${selectedKYC.status}`}>
                  {selectedKYC.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="documents-section">
            <div className="section-header">
              <h3 className="section-title">Submitted Documents</h3>
              <button className="download-all-btn" onClick={() => alert("Downloading all documents...")}>
                <Download size={16} />
                Download All
              </button>
            </div>
            
            <div className="documents-grid">
              {Object.entries(selectedKYC.documents).map(([key, doc]) => (
                <div key={key} className="document-card">
                  <div className="document-header">
                    <div className="document-name">
                      <FileText size={16} />
                      {doc.name}
                    </div>
                    <div className={`document-status ${doc.status}`}>
                      {doc.status}
                    </div>
                  </div>
                  
                  <div className="document-preview" onClick={() => {
                    setSelectedDocument(doc);
                    setShowDocumentPreview(true);
                  }}>
                    <div className="preview-icon">
                      {key.includes('selfie') ? <Camera size={24} /> : <FileText size={24} />}
                    </div>
                    <div className="preview-text">Click to preview</div>
                  </div>

                  <div className="document-actions">
                    <button className="small-btn" onClick={() => {
                      setSelectedDocument(doc);
                      setShowDocumentPreview(true);
                    }}>
                      <Eye size={14} />
                      Preview
                    </button>
                    <button className="small-btn" onClick={() => alert(`Verifying ${doc.name}...`)}>
                      <CheckCircle size={14} />
                      Verify
                    </button>
                    <button className="small-btn outline" onClick={() => alert(`Flagging ${doc.name}...`)}>
                      <AlertCircle size={14} />
                      Flag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="additional-info">
            <div className="info-card">
              <h4 className="info-title">
                <Globe size={16} />
                Device & IP History
              </h4>
              <div className="device-list">
                {deviceHistory.slice(0, 2).map((device) => (
                  <div key={device.id} className="device-item">
                    <div className="device-info">
                      <div className="device-name">{device.deviceType} • {device.deviceModel}</div>
                      <div className="device-details">
                        <span>{device.ipAddress}</span>
                        <span>{device.location}</span>
                      </div>
                    </div>
                    <div className={`device-status ${device.status}`}>
                      {device.status}
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-more-btn" onClick={() => alert("Viewing full device history...")}>
                View Full History
              </button>
            </div>

            <div className="info-card">
              <h4 className="info-title">
                <History size={16} />
                Audit Timeline
              </h4>
              <div className="timeline">
                {auditTimeline.map((audit) => (
                  <div key={audit.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-action">{audit.action}</div>
                      <div className="timeline-details">{audit.details}</div>
                      <div className="timeline-meta">
                        <span>{audit.actor}</span>
                        <span>{audit.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )

  // Document Preview Modal
  const DocumentPreviewModal = () => (
    <div className="modal-overlay" onClick={() => setShowDocumentPreview(false)}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Document Preview</h3>
          <button className="close-modal" onClick={() => setShowDocumentPreview(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="document-preview-content">
          <div className="preview-header">
            <div className="document-info">
              <div className="document-name">
                {selectedDocument?.name || "Document Preview"}
              </div>
              <div className="document-status">
                Status: <span className={`status ${selectedDocument?.status}`}>
                  {selectedDocument?.status}
                </span>
              </div>
            </div>
            <div className="preview-actions">
              <button className="action-btn" onClick={() => alert("Rotating document...")}>
                <RefreshCw size={16} />
                Rotate
              </button>
              <button className="action-btn" onClick={() => alert("Zooming in...")}>
                <Search size={16} />
                Zoom
              </button>
              <button className="action-btn" onClick={() => alert("Downloading document...")}>
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <div className="document-viewer">
            <div className="document-image">
              {/* Simulated document image */}
              <div className="document-placeholder">
                <FileText size={64} />
                <div className="placeholder-text">Document Preview</div>
                <div className="placeholder-subtext">Simulated document view</div>
              </div>
            </div>

            <div className="document-metadata">
              <h4>Document Details</h4>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="label">Uploaded:</span>
                  <span className="value">2024-03-15 09:30</span>
                </div>
                <div className="metadata-item">
                  <span className="label">File Size:</span>
                  <span className="value">2.4 MB</span>
                </div>
                <div className="metadata-item">
                  <span className="label">Format:</span>
                  <span className="value">JPEG</span>
                </div>
                <div className="metadata-item">
                  <span className="label">Resolution:</span>
                  <span className="value">1920x1080</span>
                </div>
              </div>

              <h4>Verification Actions</h4>
              <div className="verification-actions">
                <button className="verify-btn success" onClick={() => alert("Document verified successfully")}>
                  <CheckCircle size={16} />
                  Mark as Verified
                </button>
                <button className="verify-btn danger" onClick={() => alert("Document rejected")}>
                  <XCircle size={16} />
                  Mark as Invalid
                </button>
                <button className="verify-btn warning" onClick={() => setShowResubmissionModal(true)}>
                  <RefreshCw size={16} />
                  Request Resubmission
                </button>
              </div>

              <h4>Add Notes</h4>
              <textarea 
                className="notes-textarea"
                placeholder="Add verification notes or comments..."
                rows={3}
              />
              <button className="save-notes-btn">
                <Send size={16} />
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Approve Confirmation Modal
  const ApproveConfirmationModal = () => (
    <div className="modal-overlay" onClick={() => setShowApproveConfirm(false)}>
      <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <CheckCircle size={48} color="#059669" />
          <h3 className="confirmation-title">Approve KYC</h3>
        </div>
        
        <div className="confirmation-body">
          <p className="confirmation-message">
            Are you sure you want to approve KYC for {selectedKYC?.riderName}?
            <br />
            <small>This will activate their account with {selectedKYC?.level} level limits.</small>
          </p>
        </div>

        <div className="confirmation-actions">
          <button 
            className="confirmation-btn cancel"
            onClick={() => setShowApproveConfirm(false)}
          >
            Cancel
          </button>
          <button 
            className="confirmation-btn confirm"
            onClick={handleApproveKYC}
            style={{ background: '#059669' }}
          >
            Approve KYC
          </button>
        </div>
      </div>
    </div>
  )

  // Reject Modal with Reason
  const RejectModal = () => (
    <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Reject KYC</h3>
          <button className="close-modal" onClick={() => setShowRejectModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Rejection Reason</label>
            <select 
              className="form-input"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            >
              <option value="">Select reason</option>
              <option value="document_expired">Document Expired</option>
              <option value="document_blurry">Document Blurry/Unreadable</option>
              <option value="information_mismatch">Information Mismatch</option>
              <option value="suspicious_activity">Suspicious Activity</option>
              <option value="other">Other</option>
            </select>
          </div>

          {rejectReason === 'other' && (
            <div className="form-group">
              <label className="form-label">Custom Reason</label>
              <textarea 
                className="form-textarea"
                placeholder="Please specify the rejection reason..."
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Additional Notes (Optional)</label>
            <textarea 
              className="form-textarea"
              placeholder="Add any additional notes for the rider..."
              rows={3}
            />
          </div>

          <div className="rejection-warning">
            <AlertTriangle size={16} color="#dc2626" />
            <span>This action cannot be undone. The rider will need to submit a new KYC application.</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={() => setShowRejectModal(false)}>
            Cancel
          </button>
          <button 
            className="modal-btn danger" 
            onClick={handleRejectKYC}
            disabled={!rejectReason}
          >
            Reject KYC
          </button>
        </div>
      </div>
    </div>
  )

  // Request Resubmission Modal
  const ResubmissionModal = () => (
    <div className="modal-overlay" onClick={() => setShowResubmissionModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Request Resubmission</h3>
          <button className="close-modal" onClick={() => setShowResubmissionModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Documents to Resubmit</label>
            <div className="documents-checklist">
              {selectedKYC && Object.entries(selectedKYC.documents).map(([key, doc]) => (
                <label key={key} className="checkbox-label">
                  <input type="checkbox" defaultChecked={doc.status === 'resubmit'} />
                  <span>{doc.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resubmission Notes</label>
            <textarea 
              className="form-textarea"
              placeholder="Explain what needs to be resubmitted and why..."
              rows={4}
              value={resubmissionNotes}
              onChange={(e) => setResubmissionNotes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deadline for Resubmission</label>
            <select className="form-input">
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours</option>
              <option value="168">7 days</option>
            </select>
          </div>

          <div className="resubmission-info">
            <Info size={16} color="#2563eb" />
            <span>The rider will receive a notification to resubmit the requested documents.</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={() => setShowResubmissionModal(false)}>
            Cancel
          </button>
          <button 
            className="modal-btn primary" 
            onClick={handleRequestResubmission}
            disabled={!resubmissionNotes}
          >
            <Send size={16} />
            Send Request
          </button>
        </div>
      </div>
    </div>
  )

  // KYC Level Editor (Super Admin)
  const KYCLevelEditor = () => (
    <div className="modal-overlay" onClick={() => setShowKYCEditor(false)}>
      <div className="modal-content xlarge" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">KYC Levels Editor</h3>
          <button className="close-modal" onClick={() => setShowKYCEditor(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="levels-editor">
          <div className="editor-header">
            <div className="header-info">
              <h4>Manage KYC Levels & Requirements</h4>
              <p>Configure verification levels and their transaction limits</p>
            </div>
            <button className="add-level-btn" onClick={() => alert("Adding new level...")}>
              <Edit size={16} />
              Add New Level
            </button>
          </div>

          <div className="levels-list">
            {kycLevels.map((level, index) => (
              <div key={index} className="level-editor-card">
                <div className="level-header">
                  <div className="level-title">
                    <h4>{level.level}</h4>
                    <span className={`level-status ${level.status}`}>{level.status}</span>
                  </div>
                  <div className="level-actions">
                    <button className="edit-btn" onClick={() => alert(`Editing ${level.level}...`)}>
                      <Edit size={14} />
                    </button>
                    <button className="toggle-btn" onClick={() => handleUpdateKYCLevel(level.level, { status: level.status === 'active' ? 'inactive' : 'active' })}>
                      {level.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                  </div>
                </div>

                <div className="level-description">{level.description}</div>

                <div className="level-requirements">
                  <h5>Required Documents:</h5>
                  <div className="requirements-list">
                    {level.requirements.map((req, idx) => (
                      <div key={idx} className="requirement-item">
                        <CheckCircle size={12} />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="level-limits">
                  <h5>Transaction Limits:</h5>
                  <div className="limits-grid">
                    <div className="limit-item">
                      <div className="limit-label">Daily</div>
                      <div className="limit-value">{level.limits.dailyTransactions}</div>
                    </div>
                    <div className="limit-item">
                      <div className="limit-label">Weekly</div>
                      <div className="limit-value">{level.limits.weeklyTransactions}</div>
                    </div>
                    <div className="limit-item">
                      <div className="limit-label">Monthly</div>
                      <div className="limit-value">{level.limits.monthlyTransactions}</div>
                    </div>
                  </div>
                </div>

                <div className="level-footer">
                  <button className="configure-btn" onClick={() => alert(`Configuring ${level.level}...`)}>
                    Configure
                  </button>
                  <button className="preview-btn" onClick={() => alert(`Previewing ${level.level}...`)}>
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-actions">
            <button className="footer-btn" onClick={() => alert("Exporting levels configuration...")}>
              <Download size={16} />
              Export Config
            </button>
            <button className="footer-btn" onClick={() => alert("Restoring defaults...")}>
              <RefreshCw size={16} />
              Restore Defaults
            </button>
            <button className="footer-btn primary" onClick={() => alert("Saving changes...")}>
              <CheckCircle size={16} />
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Device/IP Match History Component
  const DeviceHistoryView = () => (
    <div className="kyc-management-container">
      <div className="back-header">
        <button className="back-btn" onClick={() => setSelectedKYC(null)}>
          ← Back to KYC List
        </button>
        <h2 className="dashboard-title">DEVICE & IP MATCH HISTORY</h2>
      </div>

      <div className="device-history-container">
        <div className="section-header">
          <h3 className="section-title">Device Fingerprinting History</h3>
          <button className="action-btn primary" onClick={() => alert("Exporting device history...")}>
            <Download size={16} />
            Export Report
          </button>
        </div>

        <div className="device-list-container">
          <div className="list-header">
            <div className="header-item">Device Info</div>
            <div className="header-item">IP & Location</div>
            <div className="header-item">Activity</div>
            <div className="header-item">Status</div>
            <div className="header-item">Actions</div>
          </div>

          {deviceHistory.map((device) => (
            <div key={device.id} className="device-card">
              <div className="device-info-cell">
                <div className="device-type">
                  {device.deviceType === 'iOS' ? '📱' : '🤖'}
                  {device.deviceType}
                </div>
                <div className="device-model">{device.deviceModel}</div>
                <div className="device-id">ID: {device.deviceId}</div>
              </div>

              <div className="network-cell">
                <div className="ip-address">
                  <Globe size={12} />
                  {device.ipAddress}
                </div>
                <div className="location">{device.location}</div>
                <div className="last-seen">
                  <Clock size={12} />
                  Last seen: {device.lastSeen}
                </div>
              </div>

              <div className="activity-cell">
                <div className="matches-count">
                  <History size={12} />
                  {device.matches} matches
                </div>
                <div className="match-frequency">
                  {device.matches > 3 ? 'Frequent' : device.matches > 1 ? 'Occasional' : 'Rare'}
                </div>
              </div>

              <div className="status-cell">
                <div className={`device-status ${device.status}`}>
                  {device.status.toUpperCase()}
                </div>
                {device.status === 'suspicious' && (
                  <div className="status-note">Multiple devices detected</div>
                )}
              </div>

              <div className="actions-cell">
                <button className="action-btn" onClick={() => alert(`Viewing ${device.deviceId} details...`)}>
                  <Eye size={14} />
                </button>
                <button className="action-btn" onClick={() => alert(`Blocking ${device.deviceId}...`)}>
                  <Ban size={14} />
                </button>
                <button className="action-btn" onClick={() => alert(`Whitelisting ${device.deviceId}...`)}>
                  <CheckCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="analytics-section">
          <h3 className="section-title">Device Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-label">Total Devices</div>
              <div className="analytics-value">24</div>
              <div className="analytics-change">+3 this month</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-label">Suspicious Devices</div>
              <div className="analytics-value">5</div>
              <div className="analytics-change">21% of total</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-label">IP Addresses</div>
              <div className="analytics-value">18</div>
              <div className="analytics-change">3 shared IPs</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-label">Location Changes</div>
              <div className="analytics-value">42</div>
              <div className="analytics-change">+8 this week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // KYC Audit Timeline Component
  const KYCAuditTimeline = () => (
    <div className="kyc-management-container">
      <div className="back-header">
        <button className="back-btn" onClick={() => setSelectedKYC(null)}>
          ← Back to KYC List
        </button>
        <h2 className="dashboard-title">KYC AUDIT TIMELINE</h2>
      </div>

      <div className="audit-timeline-container">
        <div className="section-header">
          <h3 className="section-title">KYC Verification History</h3>
          <div className="header-actions">
            <button className="action-btn" onClick={() => alert("Filtering timeline...")}>
              <Filter size={16} />
              Filter
            </button>
            <button className="action-btn primary" onClick={() => alert("Exporting audit log...")}>
              <Download size={16} />
              Export Log
            </button>
          </div>
        </div>

        <div className="timeline-view">
          {auditTimeline.map((audit) => (
            <div key={audit.id} className="timeline-event">
              <div className="event-dot"></div>
              <div className="event-content">
                <div className="event-header">
                  <div className="event-title">
                    <h4>{audit.action}</h4>
                    <span className={`event-status ${audit.status}`}>{audit.status}</span>
                  </div>
                  <div className="event-time">{audit.timestamp}</div>
                </div>
                <div className="event-details">
                  <p>{audit.details}</p>
                  <div className="event-meta">
                    <span className="actor">
                      <User size={12} />
                      {audit.actor}
                    </span>
                    <span className="event-id">ID: {audit.id}</span>
                  </div>
                </div>
                <div className="event-actions">
                  <button className="small-btn" onClick={() => alert(`Viewing ${audit.id} details...`)}>
                    View Details
                  </button>
                  <button className="small-btn" onClick={() => alert(`Reverting ${audit.id}...`)}>
                    Revert Action
                  </button>
                  <button className="small-btn" onClick={() => alert(`Adding note to ${audit.id}...`)}>
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="audit-stats">
          <div className="stats-card">
            <h4>Audit Summary</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Total Actions</div>
                <div className="stat-value">156</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Manual Reviews</div>
                <div className="stat-value">89</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">System Actions</div>
                <div className="stat-value">67</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Average Time</div>
                <div className="stat-value">2.4h</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h4>Recent Activity</h4>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-action">KYC Approved</div>
                <div className="activity-time">10 mins ago</div>
              </div>
              <div className="activity-item">
                <div className="activity-action">Document Verified</div>
                <div className="activity-time">25 mins ago</div>
              </div>
              <div className="activity-item">
                <div className="activity-action">Resubmission Requested</div>
                <div className="activity-time">1 hour ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <style jsx>{`
        /* Base Container */
        .kyc-management-container,
        .kyc-review-container {
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
          color: #1e40af;
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

        .stat-change {
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
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

        /* KYC List */
        .kyc-list {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .list-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 0.5fr;
          background: #f8fafc;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .kyc-card {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 0.5fr;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
          transition: background 0.2s;
        }

        .kyc-card:hover {
          background: #f8fafc;
        }

        .kyc-info {
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

        .kyc-details {
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

        .submission-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
        }

        .kyc-details-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .kyc-id {
          font-weight: 600;
          color: #1e40af;
        }

        .kyc-level {
          font-size: 12px;
          color: #6b7280;
        }

        .documents-count {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
        }

        /* Status Badges */
        .status-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          width: fit-content;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.approved {
          background: #d1fae5;
          color: #059669;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-badge.resubmission {
          background: #dbeafe;
          color: #1e40af;
        }

        .review-due {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
        }

        .rejection-reason {
          font-size: 11px;
          color: #dc2626;
          background: #fef2f2;
          padding: 4px 8px;
          border-radius: 4px;
          margin-top: 4px;
        }

        /* Risk Score */
        .risk-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .risk-score {
          font-size: 20px;
          font-weight: 700;
          width: fit-content;
        }

        .risk-score.high {
          color: #dc2626;
        }

        .risk-score.medium {
          color: #f59e0b;
        }

        .risk-score.low {
          color: #059669;
        }

        .risk-label {
          font-size: 12px;
          color: #6b7280;
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

        /* KYC Review Header */
        .kyc-review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .kyc-profile {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .profile-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #1e40af, #60a5fa);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
        }

        .profile-name {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .profile-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .detail {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .kyc-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn.success {
          background: #059669;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        .action-btn.danger {
          background: #dc2626;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        .action-btn.warning {
          background: #f59e0b;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Risk Assessment */
        .risk-assessment {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .risk-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .risk-metric {
          text-align: center;
        }

        .metric-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .risk-score-display {
          font-size: 28px;
          font-weight: 700;
          padding: 12px;
          border-radius: 8px;
        }

        .risk-score-display.high {
          background: #fee2e2;
          color: #dc2626;
        }

        .risk-score-display.medium {
          background: #fef3c7;
          color: #92400e;
        }

        .risk-score-display.low {
          background: #d1fae5;
          color: #059669;
        }

        .level-display {
          font-size: 20px;
          font-weight: 700;
          color: #1e40af;
          padding: 12px;
          background: #eff6ff;
          border-radius: 8px;
        }

        .status-display {
          font-size: 20px;
          font-weight: 700;
          padding: 12px;
          border-radius: 8px;
          text-transform: uppercase;
        }

        .status-display.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-display.approved {
          background: #d1fae5;
          color: #059669;
        }

        .status-display.rejected {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-display.resubmission {
          background: #dbeafe;
          color: #1e40af;
        }

        /* Documents Section */
        .documents-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .download-all-btn {
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

        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .document-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }

        .document-card:hover {
          border-color: #bfdbfe;
          background: #f0f4ff;
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .document-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #374151;
        }

        .document-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .document-status.verified {
          background: #d1fae5;
          color: #059669;
        }

        .document-status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .document-status.rejected {
          background: #fee2e2;
          color: #dc2626;
        }

        .document-status.resubmit {
          background: #dbeafe;
          color: #1e40af;
        }

        .document-preview {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .document-preview:hover {
          border-color: #3b82f6;
          background: #f8fafc;
        }

        .preview-icon {
          color: #6b7280;
          margin-bottom: 8px;
        }

        .preview-text {
          font-size: 12px;
          color: #6b7280;
        }

        .document-actions {
          display: flex;
          gap: 8px;
        }

        .small-btn {
          flex: 1;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .small-btn.outline {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
        }

        /* Additional Information */
        .additional-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .info-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .info-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .device-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;
        }

        .device-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .device-info {
          flex: 1;
        }

        .device-name {
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }

        .device-details {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #6b7280;
        }

        .device-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .device-status.verified {
          background: #d1fae5;
          color: #059669;
        }

        .device-status.suspicious {
          background: #fef3c7;
          color: #92400e;
        }

        .device-status.blocked {
          background: #fee2e2;
          color: #dc2626;
        }

        .view-more-btn {
          width: 100%;
          padding: 8px;
          background: #f8fafc;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          color: #374151;
          font-size: 14px;
          cursor: pointer;
        }

        /* Timeline */
        .timeline {
          position: relative;
          padding-left: 20px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e5e7eb;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 20px;
        }

        .timeline-dot {
          position: absolute;
          left: -20px;
          top: 4px;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          border: 2px solid white;
        }

        .timeline-content {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
        }

        .timeline-action {
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }

        .timeline-details {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .timeline-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #9ca3af;
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

        /* Document Preview Modal */
        .document-preview-content {
          padding: 24px;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .document-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .preview-actions {
          display: flex;
          gap: 8px;
        }

        .document-viewer {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          min-height: 400px;
        }

        .document-image {
          background: #f8fafc;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e7eb;
        }

        .document-placeholder {
          text-align: center;
          color: #6b7280;
        }

        .placeholder-text {
          font-size: 18px;
          font-weight: 600;
          margin: 16px 0 8px;
        }

        .placeholder-subtext {
          font-size: 14px;
          color: #9ca3af;
        }

        .document-metadata {
          border-left: 1px solid #e5e7eb;
          padding-left: 24px;
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin: 16px 0;
        }

        .metadata-item {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 12px;
          color: #6b7280;
        }

        .value {
          font-weight: 500;
          color: #374151;
        }

        .verification-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 16px 0;
        }

        .verify-btn {
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .verify-btn.success {
          background: #059669;
          color: white;
        }

        .verify-btn.danger {
          background: #dc2626;
          color: white;
        }

        .verify-btn.warning {
          background: #f59e0b;
          color: white;
        }

        .notes-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          margin: 12px 0;
          resize: vertical;
        }

        .save-notes-btn {
          width: 100%;
          padding: 12px;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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

        /* Form Styles */
        .modal-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
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

        .documents-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .checkbox-label:hover {
          background: #f0f4ff;
        }

        .rejection-warning,
        .resubmission-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fef2f2;
          border-radius: 6px;
          color: #dc2626;
          margin: 16px 0;
        }

        .resubmission-info {
          background: #eff6ff;
          color: #2563eb;
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

        .modal-btn.primary {
          background: #1e40af;
          color: white;
          border: none;
        }

        .modal-btn.danger {
          background: #dc2626;
          color: white;
          border: none;
        }

        .modal-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* KYC Level Editor */
        .levels-editor {
          padding: 24px;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-info h4 {
          margin: 0 0 4px 0;
          color: #111827;
        }

        .header-info p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .add-level-btn {
          padding: 10px 16px;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .levels-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .level-editor-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s;
        }

        .level-editor-card:hover {
          border-color: #bfdbfe;
        }

        .level-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .level-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .level-title h4 {
          margin: 0;
          color: #111827;
        }

        .level-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .level-status.active {
          background: #d1fae5;
          color: #059669;
        }

        .level-status.inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .level-actions {
          display: flex;
          gap: 8px;
        }

        .edit-btn,
        .toggle-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
        }

        .level-description {
          color: #6b7280;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .level-requirements {
          margin-bottom: 16px;
        }

        .level-requirements h5 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 14px;
        }

        .requirements-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .requirement-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          font-size: 12px;
        }

        .level-limits {
          margin-bottom: 16px;
        }

        .level-limits h5 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 14px;
        }

        .limits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .limit-item {
          text-align: center;
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .limit-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .limit-value {
          font-weight: 600;
          color: #111827;
        }

        .level-footer {
          display: flex;
          gap: 8px;
        }

        .configure-btn,
        .preview-btn {
          flex: 1;
          padding: 8px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .configure-btn {
          background: #1e40af;
          color: white;
          border: none;
        }

        .preview-btn {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
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

        .footer-btn.primary {
          background: #1e40af;
          color: white;
          border: none;
        }

        /* Device History View */
        .device-history-container {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .device-list-container {
          margin-bottom: 24px;
        }

        .device-card {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 0.5fr;
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
        }

        .device-info-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .device-type {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .device-model {
          font-size: 12px;
          color: #6b7280;
        }

        .device-id {
          font-size: 11px;
          color: #9ca3af;
        }

        .network-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ip-address {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .last-seen {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
        }

        .activity-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .matches-count {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .match-frequency {
          font-size: 12px;
          color: #6b7280;
        }

        .status-note {
          font-size: 11px;
          color: #dc2626;
          margin-top: 4px;
        }

        .analytics-section {
          margin-top: 24px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .analytics-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }

        .analytics-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .analytics-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 4px;
        }

        .analytics-change {
          font-size: 12px;
          color: #059669;
        }

        /* Audit Timeline */
        .audit-timeline-container {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .timeline-view {
          margin-bottom: 24px;
        }

        .timeline-event {
          display: flex;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .event-dot {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          margin-top: 6px;
        }

        .event-content {
          flex: 1;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .event-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .event-title h4 {
          margin: 0;
          color: #111827;
        }

        .event-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .event-status.completed {
          background: #d1fae5;
          color: #059669;
        }

        .event-status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .event-time {
          color: #6b7280;
          font-size: 14px;
        }

        .event-details p {
          margin: 0 0 12px 0;
          color: #6b7280;
        }

        .event-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #9ca3af;
        }

        .actor {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .event-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .audit-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .stats-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
        }

        .stats-card h4 {
          margin: 0 0 16px 0;
          color: #111827;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #1e40af;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }

        .activity-action {
          font-weight: 500;
          color: #374151;
        }

        .activity-time {
          font-size: 12px;
          color: #6b7280;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .kyc-management-container {
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

          .kyc-card,
          .device-card {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 16px;
          }

          .kyc-review-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .kyc-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .documents-grid {
            grid-template-columns: 1fr;
          }

          .document-viewer {
            grid-template-columns: 1fr;
          }

          .additional-info {
            grid-template-columns: 1fr;
          }

          .modal-content {
            max-width: 95%;
          }

          .confirmation-actions {
            flex-direction: column;
          }

          .levels-grid {
            grid-template-columns: 1fr;
          }

          .event-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
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

          .risk-metrics {
            grid-template-columns: 1fr;
          }

          .limits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Main Content */}
      {!selectedKYC ? (
        renderKYCList()
      ) : (
        renderKYCReview()
      )}

      {/* Document Preview Modal */}
      {showDocumentPreview && <DocumentPreviewModal />}

      {/* Approve Confirmation Modal */}
      {showApproveConfirm && <ApproveConfirmationModal />}

      {/* Reject Modal */}
      {showRejectModal && <RejectModal />}

      {/* Resubmission Modal */}
      {showResubmissionModal && <ResubmissionModal />}

      {/* KYC Level Editor */}
      {showKYCEditor && <KYCLevelEditor />}
    </>
  )
}