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
        lastPurchase: "2024-01-15",
        totalSpent: 450000,
        status: "active",
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
      (filter === 'active' && contact.status === 'active') ||
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
      case 'customer': return '#0033cc';
      case 'supplier': return '#f59e0b';
      case 'employee': return '#10b981';
      default: return '#64748b';
    }
  };

  const getTypeBackgroundColor = (type) => {
    switch (type) {
      case 'customer': return '#e3f2fd';
      case 'supplier': return '#fff9c4';
      case 'employee': return '#d1fae5';
      default: return '#f5f5f5';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#2e7d32';
      case 'inactive': return '#c62828';
      default: return '#64748b';
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'active': return '#e8f5e9';
      case 'inactive': return '#ffebee';
      default: return '#f5f5f5';
    }
  };

  return (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Contacts Management</h2>
      </div>

      {/* Tab Navigation - Simplified */}
      <div className="tab-navigation">
        <button className="tab-btn active">
          All Contacts
        </button>
      </div>

      <div className="tab-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Contacts</div>
            <p className="stat-value">{contacts.length}</p>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active</div>
            <p className="stat-value">{contacts.filter(c => c.status === 'active').length}</p>
          </div>
          <div className="stat-card">
            <div className="stat-label">Inactive</div>
            <p className="stat-value">{contacts.filter(c => c.status === 'inactive').length}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="alerts-section">
          {/* Search and Filter Section */}
          <div className="referral-alerts">
            <div className="alerts-title">Manage Contacts</div>
            
            {/* Action Bar */}
            <div className="promo-input-section" style={{ marginBottom: '16px' }}>
              <div className="share-input-group">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="share-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="share-input"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ minWidth: '140px' }}
                >
                  <option value="all">All Contacts</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button 
                  className="share-btn"
                  onClick={() => handleOpenAddDialog()}
                  style={{ background: '#0033cc' }}
                >
                  <Add style={{ fontSize: '14px', marginRight: '4px' }} />
                  Add Contact
                </button>
                <button 
                  className="share-btn"
                  onClick={() => { setSearchTerm(''); setFilter('all'); }}
                  style={{ background: '#f5f5f5', color: '#0033cc', border: '1px solid #0033cc' }}
                >
                  <Refresh style={{ fontSize: '14px' }} />
                </button>
              </div>
            </div>

            {/* Contacts Table */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="alert-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: getTypeBackgroundColor(contact.type),
                        color: getTypeColor(contact.type),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <h4 className="alert-type" style={{ margin: 0 }}>{contact.name}</h4>
                          <span className="status-badge" style={{
                            background: getTypeBackgroundColor(contact.type),
                            color: getTypeColor(contact.type),
                            border: `1px solid ${getTypeColor(contact.type)}`,
                            padding: '2px 8px',
                            fontSize: '10px',
                            textTransform: 'uppercase'
                          }}>
                            {contact.type}
                          </span>
                          <span className="status-badge" style={{
                            background: getStatusBackgroundColor(contact.status),
                            color: getStatusColor(contact.status),
                            border: `1px solid ${getStatusColor(contact.status)}`,
                            padding: '2px 8px',
                            fontSize: '10px',
                            textTransform: 'uppercase'
                          }}>
                            {contact.status}
                          </span>
                        </div>
                        <p className="alert-message" style={{ marginBottom: '4px' }}>
                          <Phone style={{ fontSize: '12px', marginRight: '4px' }} />
                          {contact.phone}
                        </p>
                        <p className="alert-message" style={{ margin: 0 }}>
                          <Email style={{ fontSize: '12px', marginRight: '4px' }} />
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    {contact.business && (
                      <p className="alert-message" style={{ margin: '4px 0 0 0' }}>
                        <Business style={{ fontSize: '12px', marginRight: '4px' }} />
                        {contact.business}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      className="share-btn"
                      onClick={() => handleOpenViewDialog(contact)}
                      style={{ 
                        background: '#f5f5f5', 
                        color: '#0033cc',
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}
                    >
                      <Visibility style={{ fontSize: '12px', marginRight: '4px' }} />
                      View
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => handleOpenEditDialog(contact)}
                      style={{ 
                        background: '#e3f2fd', 
                        color: '#0033cc',
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}
                    >
                      <Edit style={{ fontSize: '12px', marginRight: '4px' }} />
                      Edit
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => handleDeleteContact(contact.id)}
                      style={{ 
                        background: '#ffebee', 
                        color: '#c62828',
                        padding: '6px 12px',
                        fontSize: '12px'
                      }}
                    >
                      <Delete style={{ fontSize: '12px', marginRight: '4px' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="milestone-section">
            <div className="alerts-title">Quick Stats</div>
            
            <div className="milestone-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#0033cc', fontSize: '12px', fontWeight: '500' }}>Active Contacts</span>
                <span style={{ color: '#0033cc', fontSize: '16px', fontWeight: '600' }}>
                  {contacts.filter(c => c.status === 'active').length}
                </span>
              </div>
              <div className="milestone-text" style={{ fontSize: '10px' }}>
                {((contacts.filter(c => c.status === 'active').length / contacts.length) * 100).toFixed(0)}% of total
              </div>
            </div>

            <div className="milestone-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#0033cc', fontSize: '12px', fontWeight: '500' }}>Inactive Contacts</span>
                <span style={{ color: '#0033cc', fontSize: '16px', fontWeight: '600' }}>
                  {contacts.filter(c => c.status === 'inactive').length}
                </span>
              </div>
              <div className="milestone-text" style={{ fontSize: '10px' }}>
                {((contacts.filter(c => c.status === 'inactive').length / contacts.length) * 100).toFixed(0)}% of total
              </div>
            </div>

            <div className="milestone-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#0033cc', fontSize: '12px', fontWeight: '500' }}>Customer Contacts</span>
                <span style={{ color: '#0033cc', fontSize: '16px', fontWeight: '600' }}>
                  {contacts.filter(c => c.type === 'customer').length}
                </span>
              </div>
              <div className="milestone-text" style={{ fontSize: '10px' }}>
                {((contacts.filter(c => c.type === 'customer').length / contacts.length) * 100).toFixed(0)}% of total
              </div>
            </div>

            <div className="milestone-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#0033cc', fontSize: '12px', fontWeight: '500' }}>Supplier Contacts</span>
                <span style={{ color: '#0033cc', fontSize: '16px', fontWeight: '600' }}>
                  {contacts.filter(c => c.type === 'supplier').length}
                </span>
              </div>
              <div className="milestone-text" style={{ fontSize: '10px' }}>
                {((contacts.filter(c => c.type === 'supplier').length / contacts.length) * 100).toFixed(0)}% of total
              </div>
            </div>

            <div className="milestone-card" style={{ background: '#e3f2fd', borderColor: '#bbdefb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#0033cc', fontSize: '12px', fontWeight: '500' }}>Total Contacts</span>
                <span style={{ color: '#0033cc', fontSize: '20px', fontWeight: '600' }}>
                  {contacts.length}
                </span>
              </div>
              <div className="milestone-text" style={{ fontSize: '10px' }}>
                All contact types
              </div>
            </div>
          </div>
        </div>

        {/* Add Contact Button */}
        <button 
          className="withdraw-commission-btn"
          onClick={handleOpenAddDialog}
          style={{ marginTop: '20px' }}
        >
          <Add style={{ fontSize: '14px', marginRight: '8px' }} />
          Add New Contact
        </button>
      </div>

      {/* Contact Dialog */}
      {openDialog && currentContact && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '12px',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {/* Modal Header */}
            <div className="dashboard-header" style={{ borderRadius: '8px 8px 0 0' }}>
              <h2 className="dashboard-title" style={{ fontSize: '16px' }}>
                {editMode ? (currentContact.id > contacts.length ? 'Add Contact' : 'Edit Contact') : 'Contact Details'}
              </h2>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
              {/* Profile Picture Section */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: getTypeBackgroundColor(currentContact.type),
                  color: getTypeColor(currentContact.type),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '24px',
                  margin: '0 auto 12px auto',
                  border: `2px solid ${getTypeColor(currentContact.type)}`
                }}>
                  {currentContact.name?.charAt(0) || '?'}
                </div>
                {editMode && (
                  <div>
                    <input
                      accept="image/*"
                      id="contact-avatar-upload"
                      style={{ display: 'none' }}
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="contact-avatar-upload" style={{ 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#0033cc',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      <CameraAlt style={{ fontSize: '14px' }} />
                      Change Photo
                    </label>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                    <input
                      type="text"
                      className="share-input"
                      value={currentContact.name || ''}
                      onChange={(e) => setCurrentContact({...currentContact, name: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>Contact Type</label>
                    <select
                      className="share-input"
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

                <div>
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '14px',
                      color: '#666'
                    }} />
                    <input
                      type="text"
                      className="share-input"
                      style={{ paddingLeft: '36px' }}
                      value={currentContact.phone || ''}
                      onChange={(e) => setCurrentContact({...currentContact, phone: e.target.value})}
                      disabled={!editMode}
                      placeholder="+256 XXX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Email style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '14px',
                      color: '#666'
                    }} />
                    <input
                      type="email"
                      className="share-input"
                      style={{ paddingLeft: '36px' }}
                      value={currentContact.email || ''}
                      onChange={(e) => setCurrentContact({...currentContact, email: e.target.value})}
                      disabled={!editMode}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>Location</label>
                  <div style={{ position: 'relative' }}>
                    <LocationOn style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '14px',
                      color: '#666'
                    }} />
                    <input
                      type="text"
                      className="share-input"
                      style={{ paddingLeft: '36px' }}
                      value={currentContact.location || ''}
                      onChange={(e) => setCurrentContact({...currentContact, location: e.target.value})}
                      disabled={!editMode}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>Business Name</label>
                  <div style={{ position: 'relative' }}>
                    <Business style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '14px',
                      color: '#666'
                    }} />
                    <input
                      type="text"
                      className="share-input"
                      style={{ paddingLeft: '36px' }}
                      value={currentContact.business || ''}
                      onChange={(e) => setCurrentContact({...currentContact, business: e.target.value})}
                      disabled={!editMode}
                      placeholder="Business name (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>Status</label>
                  <select
                    className="share-input"
                    value={currentContact.status || 'active'}
                    onChange={(e) => setCurrentContact({...currentContact, status: e.target.value})}
                    disabled={!editMode}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {!editMode && currentContact.type === 'customer' && currentContact.totalSpent > 0 && (
                  <div style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    marginTop: '12px'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div className="stat-label">Total Spent</div>
                      <div className="stat-value" style={{ fontSize: '16px', color: '#2e7d32' }}>
                        {formatCurrency(currentContact.totalSpent)}
                      </div>
                    </div>
                    <div>
                      <div className="stat-label">Last Purchase</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>{currentContact.lastPurchase}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ 
              padding: '16px 20px', 
              background: '#f5f5f5', 
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button 
                className="share-btn"
                onClick={handleCloseDialog}
                style={{ 
                  background: '#f5f5f5', 
                  color: '#0033cc',
                  border: '1px solid #0033cc'
                }}
              >
                Cancel
              </button>
              {editMode ? (
                <button 
                  className="share-btn"
                  onClick={handleSaveContact}
                  style={{ background: '#0033cc', color: 'white' }}
                >
                  Save Contact
                </button>
              ) : (
                <button 
                  className="share-btn"
                  onClick={() => handleOpenEditDialog(currentContact)}
                  style={{ background: '#0033cc', color: 'white' }}
                >
                  Edit Contact
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;