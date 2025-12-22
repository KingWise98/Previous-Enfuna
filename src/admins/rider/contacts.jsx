"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Add,
  Edit,
  Delete,
  Phone,
  Email,
  LocationOn,
  Person,
  Business,
  FilterList,
  Refresh,
  Close,
  CheckCircle,
  Star,
  Loyalty,
  CameraAlt,
  ArrowBack,
  MoreVert,
  Visibility
} from '@mui/icons-material';

const ContactsPage = () => {
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockContacts = [
      {
        id: 1,
        name: "Peter Kure",
        type: "customer",
        phone: "+256 712 345 678",
        email: "kure@email.com",
        location: "Kampala, Uganda",
        business: "Kure's Car Wash",
        loyaltyPoints: 1250,
        lastPurchase: "2024-01-15",
        totalSpent: 450000,
        status: "vip",
        avatar: ""
      },
      {
        id: 2,
        name: "Sarah Johnson",
        type: "supplier",
        phone: "+256 701 234 567",
        email: "sarah@supply.com",
        location: "Entebbe, Uganda",
        business: "Auto Parts Ltd",
        loyaltyPoints: 0,
        lastPurchase: null,
        totalSpent: 0,
        status: "active",
        avatar: ""
      },
      {
        id: 3,
        name: "James Opio",
        type: "employee",
        phone: "+256 777 888 999",
        email: "james@company.com",
        location: "Kampala, Uganda",
        business: "",
        loyaltyPoints: 0,
        lastPurchase: null,
        totalSpent: 0,
        status: "active",
        avatar: ""
      },
      {
        id: 4,
        name: "Maria Nakato",
        type: "customer",
        phone: "+256 755 123 456",
        email: "maria@email.com",
        location: "Jinja, Uganda",
        business: "Nakato's Restaurant",
        loyaltyPoints: 850,
        lastPurchase: "2024-01-10",
        totalSpent: 280000,
        status: "active",
        avatar: ""
      },
    ];

    setContacts(mockContacts);
    setIsLoading(false);
  }, []);

  // Handle file selection for profile picture
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter contacts based on search and filter criteria
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.business && contact.business.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
      (filter === 'customer' && contact.type === 'customer') ||
      (filter === 'supplier' && contact.type === 'supplier') ||
      (filter === 'employee' && contact.type === 'employee') ||
      (filter === 'vip' && contact.status === 'vip') ||
      (filter === 'inactive' && contact.status === 'inactive');
    
    return matchesSearch && matchesFilter;
  });

  const handleOpenAddDialog = () => {
    setCurrentContact({
      id: contacts.length + 1,
      name: "",
      type: "customer",
      phone: "",
      email: "",
      location: "",
      business: "",
      loyaltyPoints: 0,
      lastPurchase: null,
      totalSpent: 0,
      status: "active",
      avatar: ""
    });
    setPreviewImage(null);
    setSelectedFile(null);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (contact) => {
    setCurrentContact(contact);
    setPreviewImage(contact.avatar || null);
    setSelectedFile(null);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (contact) => {
    setCurrentContact(contact);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleSaveContact = async () => {
    try {
      let avatarUrl = currentContact.avatar;
      
      // Upload new profile picture if selected
      if (selectedFile) {
        avatarUrl = previewImage;
      }

      const contactToSave = {
        ...currentContact,
        avatar: avatarUrl
      };

      if (currentContact.id > contacts.length) {
        // Add new contact
        setContacts([...contacts, contactToSave]);
      } else {
        // Update existing contact
        setContacts(contacts.map(contact => 
          contact.id === contactToSave.id ? contactToSave : contact
        ));
      }
      setOpenDialog(false);
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const formatCurrency = (amount) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'customer': return '#3b82f6';
      case 'supplier': return '#f59e0b';
      case 'employee': return '#10b981';
      default: return '#64748b';
    }
  };

  const getTypeBackgroundColor = (type) => {
    switch (type) {
      case 'customer': return '#dbeafe';
      case 'supplier': return '#fef3c7';
      case 'employee': return '#d1fae5';
      default: return '#f1f5f9';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'vip': return '#f59e0b';
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      default: return '#64748b';
    }
  };

  const toggleActionMenu = (id) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  return (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">CONTACTS MANAGEMENT</h1>
            <p className="expense-subtitle">Manage your customers, suppliers, and employees</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Admin User</span>
            <div className="expense-user-badge">AU</div>
          </div>
        </div>
      </header>

      {/* Compact Stats Grid */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Contacts</span>
            <span className="compact-stat-change positive">+4</span>
          </div>
          <div className="compact-stat-value">
            {contacts.length}
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">VIP Customers</span>
            <span className="compact-stat-change positive">+1</span>
          </div>
          <div className="compact-stat-value">
            {contacts.filter(c => c.status === 'vip').length}
          </div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Active</span>
            <span className="compact-stat-change positive">+3</span>
          </div>
          <div className="compact-stat-value">
            {contacts.filter(c => c.status === 'active').length}
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Customers</span>
            <span className="compact-stat-change positive">+2</span>
          </div>
          <div className="compact-stat-value">
            {contacts.filter(c => c.type === 'customer').length}
          </div>
        </div>
      </div>

      {/* Compact Action Bar */}
      <div className="compact-action-bar">
        <button className="compact-btn btn-primary" onClick={handleOpenAddDialog}>
          <Add style={{ fontSize: '0.7rem', marginRight: '0.25rem' }} />
          Add Contact
        </button>
        <button className="compact-btn btn-secondary">
          Import Contacts
        </button>
        <button className="compact-btn btn-secondary">
          Export
        </button>
      </div>

      {/* Compact Content Grid */}
      <div className="compact-content-grid">
        {/* Compact Table Section */}
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">All Contacts</h2>
            <div className="compact-filters">
              <input
                type="text"
                placeholder="Search contacts..."
                className="compact-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="compact-filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Contacts</option>
                <option value="customer">Customers</option>
                <option value="supplier">Suppliers</option>
                <option value="employee">Employees</option>
                <option value="vip">VIP</option>
                <option value="inactive">Inactive</option>
              </select>
              <button 
                className="compact-btn btn-secondary"
                style={{ minWidth: 'auto', padding: '0.375rem' }}
                onClick={() => { setSearchTerm(''); setFilter('all'); }}
              >
                <Refresh style={{ fontSize: '0.7rem' }} />
              </button>
            </div>
          </div>

          <div className="compact-table-wrapper">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Contact Info</th>
                  <th>Business</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>
                      <div className="compact-contact-cell">
                        <div className="compact-contact-avatar" style={{ 
                          backgroundColor: getTypeColor(contact.type),
                          color: 'white',
                          fontSize: '0.7rem'
                        }}>
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <div className="compact-contact-name">{contact.name}</div>
                          {contact.type === 'customer' && (
                            <div className="compact-loyalty-points">
                              <Loyalty style={{ fontSize: '0.6rem', marginRight: '0.125rem' }} />
                              {contact.loyaltyPoints} pts
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="compact-type-badge"
                        style={{
                          backgroundColor: getTypeBackgroundColor(contact.type),
                          color: getTypeColor(contact.type),
                          borderColor: getTypeColor(contact.type)
                        }}
                      >
                        {contact.type}
                      </span>
                    </td>
                    <td>
                      <div className="compact-contact-info">
                        <div className="compact-contact-phone">
                          <Phone style={{ fontSize: '0.7rem', marginRight: '0.25rem' }} />
                          {contact.phone}
                        </div>
                        <div className="compact-contact-email">
                          <Email style={{ fontSize: '0.7rem', marginRight: '0.25rem' }} />
                          {contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="compact-business">
                      {contact.business || '-'}
                    </td>
                    <td>
                      <span 
                        className={`compact-status-badge ${contact.status}`}
                        style={{
                          backgroundColor: contact.status === 'vip' ? '#fef3c7' : 
                                         contact.status === 'active' ? '#d1fae5' :
                                         contact.status === 'inactive' ? '#fee2e2' : '#f1f5f9',
                          color: getStatusColor(contact.status)
                        }}
                      >
                        {contact.status === 'vip' ? 'VIP' : contact.status}
                      </span>
                    </td>
                    <td>
                      <div className="compact-action-buttons">
                        <button 
                          className="compact-action-btn view"
                          onClick={() => handleOpenViewDialog(contact)}
                        >
                          <Visibility style={{ fontSize: '0.7rem' }} />
                        </button>
                        <button 
                          className="compact-action-btn edit"
                          onClick={() => handleOpenEditDialog(contact)}
                        >
                          <Edit style={{ fontSize: '0.7rem' }} />
                        </button>
                        <button 
                          className="compact-action-btn delete"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Delete style={{ fontSize: '0.7rem' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compact Contact Details Sidebar */}
        <div className="compact-breakdown-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Quick Stats</h2>
            <p className="compact-section-subtitle">Contact Overview</p>
          </div>

          <div className="compact-breakdown-list">
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Total Contacts</span>
                <span className="compact-stat-value">{contacts.length}</span>
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Customers</span>
                <span className="compact-stat-value">{contacts.filter(c => c.type === 'customer').length}</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: `${(contacts.filter(c => c.type === 'customer').length / contacts.length) * 100}%`,
                    backgroundColor: '#3b82f6'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Suppliers</span>
                <span className="compact-stat-value">{contacts.filter(c => c.type === 'supplier').length}</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: `${(contacts.filter(c => c.type === 'supplier').length / contacts.length) * 100}%`,
                    backgroundColor: '#f59e0b'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Employees</span>
                <span className="compact-stat-value">{contacts.filter(c => c.type === 'employee').length}</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: `${(contacts.filter(c => c.type === 'employee').length / contacts.length) * 100}%`,
                    backgroundColor: '#10b981'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">VIP Members</span>
                <span className="compact-stat-value">{contacts.filter(c => c.status === 'vip').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      {openDialog && currentContact && (
        <div className="compact-modal-overlay">
          <div className="compact-modal">
            {/* Modal Header */}
            <div className="compact-modal-header">
              <h2>
                {editMode ? (currentContact.id > contacts.length ? 'ADD CONTACT' : 'EDIT CONTACT') : 'CONTACT DETAILS'}
              </h2>
              <div className="compact-modal-steps">
                <span className="compact-step active">1</span>
                <span className="compact-step-divider"></span>
                <span className={`compact-step ${editMode ? "active" : ""}`}>2</span>
                <span className="compact-step-divider"></span>
                <span className="compact-step">3</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="compact-modal-content">
              <div className="compact-step-content">
                {/* Profile Picture Section */}
                <div className="compact-form-group" style={{ textAlign: 'center' }}>
                  <div className="compact-upload-area" style={{ border: 'none', padding: '0' }}>
                    <div className="compact-contact-avatar-large" style={{ 
                      backgroundColor: getTypeColor(currentContact.type),
                      color: 'white',
                      fontSize: '1.5rem',
                      margin: '0 auto 1rem'
                    }}>
                      {currentContact.name?.charAt(0) || '?'}
                    </div>
                    {editMode && (
                      <>
                        <input
                          accept="image/*"
                          id="contact-avatar-upload"
                          className="compact-file-input"
                          type="file"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="contact-avatar-upload" className="compact-upload-label" style={{ cursor: 'pointer' }}>
                          <div className="compact-upload-icon">
                            <CameraAlt />
                          </div>
                          <div className="compact-upload-text">Change Photo</div>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div className="compact-form-row">
                  <div className="compact-form-group">
                    <label className="compact-form-label">Full Name</label>
                    <input
                      type="text"
                      className="compact-form-input"
                      value={currentContact.name || ''}
                      onChange={(e) => setCurrentContact({...currentContact, name: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="compact-form-group">
                    <label className="compact-form-label">Contact Type</label>
                    <select
                      className="compact-form-input"
                      value={currentContact.type || 'customer'}
                      onChange={(e) => setCurrentContact({...currentContact, type: e.target.value})}
                      disabled={!editMode}
                    >
                      <option value="customer">Customer</option>
                      <option value="supplier">Supplier</option>
                      <option value="employee">Employee</option>
                    </select>
                  </div>
                </div>

                <div className="compact-form-row">
                  <div className="compact-form-group">
                    <label className="compact-form-label">Phone Number</label>
                    <div className="compact-input-with-icon">
                      <Phone style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#64748b' }} />
                      <input
                        type="text"
                        className="compact-form-input"
                        style={{ paddingLeft: '2rem' }}
                        value={currentContact.phone || ''}
                        onChange={(e) => setCurrentContact({...currentContact, phone: e.target.value})}
                        disabled={!editMode}
                        placeholder="+256 XXX XXX XXX"
                      />
                    </div>
                  </div>
                  <div className="compact-form-group">
                    <label className="compact-form-label">Email</label>
                    <div className="compact-input-with-icon">
                      <Email style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#64748b' }} />
                      <input
                        type="email"
                        className="compact-form-input"
                        style={{ paddingLeft: '2rem' }}
                        value={currentContact.email || ''}
                        onChange={(e) => setCurrentContact({...currentContact, email: e.target.value})}
                        disabled={!editMode}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="compact-form-group">
                  <label className="compact-form-label">Location</label>
                  <div className="compact-input-with-icon">
                    <LocationOn style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#64748b' }} />
                    <input
                      type="text"
                      className="compact-form-input"
                      style={{ paddingLeft: '2rem' }}
                      value={currentContact.location || ''}
                      onChange={(e) => setCurrentContact({...currentContact, location: e.target.value})}
                      disabled={!editMode}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="compact-form-group">
                  <label className="compact-form-label">Business Name</label>
                  <div className="compact-input-with-icon">
                    <Business style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#64748b' }} />
                    <input
                      type="text"
                      className="compact-form-input"
                      style={{ paddingLeft: '2rem' }}
                      value={currentContact.business || ''}
                      onChange={(e) => setCurrentContact({...currentContact, business: e.target.value})}
                      disabled={!editMode}
                      placeholder="Business name (optional)"
                    />
                  </div>
                </div>

                {currentContact.type === 'customer' && (
                  <>
                    <div className="compact-form-row">
                      <div className="compact-form-group">
                        <label className="compact-form-label">Loyalty Points</label>
                        <div className="compact-input-with-icon">
                          <Loyalty style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#64748b' }} />
                          <input
                            type="number"
                            className="compact-form-input"
                            style={{ paddingLeft: '2rem' }}
                            value={currentContact.loyaltyPoints || 0}
                            onChange={(e) => setCurrentContact({...currentContact, loyaltyPoints: parseInt(e.target.value) || 0})}
                            disabled={!editMode}
                          />
                        </div>
                      </div>
                      <div className="compact-form-group">
                        <label className="compact-form-label">Status</label>
                        <select
                          className="compact-form-input"
                          value={currentContact.status || 'active'}
                          onChange={(e) => setCurrentContact({...currentContact, status: e.target.value})}
                          disabled={!editMode}
                        >
                          <option value="active">Active</option>
                          <option value="vip">VIP</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {!editMode && currentContact.type === 'customer' && currentContact.totalSpent > 0 && (
                  <div className="compact-review-card">
                    <div className="compact-review-row">
                      <div className="compact-review-group">
                        <span className="compact-review-label">Total Spent</span>
                        <span className="compact-review-value" style={{ color: '#10b981' }}>
                          {formatCurrency(currentContact.totalSpent)}
                        </span>
                      </div>
                      <div className="compact-review-group">
                        <span className="compact-review-label">Loyalty Points</span>
                        <span className="compact-review-value">{currentContact.loyaltyPoints} pts</span>
                      </div>
                    </div>
                    <div className="compact-review-row">
                      <div className="compact-review-group">
                        <span className="compact-review-label">Last Purchase</span>
                        <span className="compact-review-value">{currentContact.lastPurchase}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="compact-modal-actions">
              {editMode ? (
                <>
                  <button className="compact-modal-btn btn-secondary" onClick={handleCloseDialog}>
                    Cancel
                  </button>
                  <button className="compact-modal-btn btn-primary" onClick={handleSaveContact}>
                    Save Contact
                  </button>
                </>
              ) : (
                <>
                  <button className="compact-modal-btn btn-secondary" onClick={handleCloseDialog}>
                    Close
                  </button>
                  <button className="compact-modal-btn btn-primary" onClick={() => handleOpenEditDialog(currentContact)}>
                    Edit Contact
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Additional CSS for Contacts specific styles */
        .compact-contact-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .compact-contact-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }
        
        .compact-contact-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        
        .compact-contact-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.7rem;
        }
        
        .compact-loyalty-points {
          font-size: 0.6rem;
          color: #64748b;
          display: flex;
          align-items: center;
          margin-top: 0.125rem;
        }
        
        .compact-type-badge {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          border: 1px solid;
          text-transform: capitalize;
        }
        
        .compact-contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        
        .compact-contact-phone,
        .compact-contact-email {
          display: flex;
          align-items: center;
          font-size: 0.7rem;
          color: #475569;
        }
        
        .compact-business {
          font-size: 0.7rem;
          color: #475569;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .compact-status-badge {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .compact-stat-item {
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
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
        
        .compact-input-with-icon {
          position: relative;
        }
        
        .compact-action-btn.edit {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .compact-action-btn.view {
          background: #f0f9ff;
          color: #0ea5e9;
        }
        
        .compact-action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default ContactsPage;