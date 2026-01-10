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

const API_BASE_URL = 'http://127.0.0.1:8000/api/rider-customers';

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
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/list_contacts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API data to match our frontend structure if needed
      const formattedContacts = data.map(contact => ({
        id: contact.id || contact.pk,
        name: contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
        type: contact.type || contact.contact_type || 'customer',
        phone: contact.phone || contact.phone_number || '',
        email: contact.email || '',
        location: contact.location || contact.address || '',
        business: contact.business || contact.company_name || '',
        lastPurchase: contact.last_purchase || contact.last_order_date || null,
        totalSpent: contact.total_spent || contact.total_purchases || 0,
        status: contact.status || (contact.is_active ? 'active' : 'inactive'),
        avatar: contact.avatar || contact.profile_picture || '',
        // Include any other fields from API
        ...contact
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError(`Failed to load contacts: ${error.message}`);
      // Keep empty contacts array
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      (contact.phone && contact.phone.includes(searchTerm)) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    setError(null);
  };

  const handleOpenEditDialog = (contact) => {
    setCurrentContact({ ...contact });
    setPreviewImage(contact.avatar || null);
    setSelectedFile(null);
    setEditMode(true);
    setOpenDialog(true);
    setError(null);
  };

  const handleOpenViewDialog = (contact) => {
    setCurrentContact({ ...contact });
    setEditMode(false);
    setOpenDialog(true);
    setError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setError(null);
  };

  const handleSaveContact = async () => {
    if (!currentContact.name || !currentContact.phone) {
      setError('Name and phone are required fields');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Prepare form data for potential file upload
      const formData = new FormData();
      
      // Add contact fields
      formData.append('name', currentContact.name);
      formData.append('contact_type', currentContact.type);
      formData.append('phone_number', currentContact.phone);
      formData.append('email', currentContact.email || '');
      formData.append('address', currentContact.location || '');
      formData.append('company_name', currentContact.business || '');
      formData.append('status', currentContact.status);
      
      // Add file if selected
      if (selectedFile) {
        formData.append('avatar', selectedFile);
        formData.append('profile_picture', selectedFile);
      }

      let response;
      
      if (currentContact.id) {
        // Update existing contact
        response = await fetch(`${API_BASE_URL}/update_contacts/${currentContact.id}`, {
          method: 'PUT',
          body: formData,
          // Note: Don't set Content-Type header for FormData - browser will set it with boundary
        });
      } else {
        // Create new contact
        response = await fetch(`${API_BASE_URL}/create_contacts`, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const savedContact = await response.json();
      
      // Refresh contacts list
      await fetchContacts();
      
      setOpenDialog(false);
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving contact:', error);
      setError(`Failed to save contact: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_BASE_URL}/delete_contact/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove from local state immediately for better UX
      setContacts(contacts.filter(contact => contact.id !== id));
      
      // Optional: Refresh from server to ensure consistency
      // await fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError(`Failed to delete contact: ${error.message}`);
      // Refresh from server on error
      await fetchContacts();
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (amount) => {
    return `UGX ${amount ? amount.toLocaleString() : '0'}`;
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

  // Loading state
  if (isLoading) {
    return (
      <div className="rider-agent-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Contacts Management</h2>
        </div>
        <div className="tab-content">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <div>Loading contacts...</div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Error Display */}
        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c62828' }}
            >
              <Close style={{ fontSize: '16px' }} />
            </button>
          </div>
        )}

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
                  <option value="customer">Customers</option>
                  <option value="supplier">Suppliers</option>
                  <option value="employee">Employees</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button 
                  className="share-btn"
                  onClick={() => handleOpenAddDialog()}
                  style={{ background: '#0033cc' }}
                  disabled={isLoading}
                >
                  <Add style={{ fontSize: '14px', marginRight: '4px' }} />
                  Add Contact
                </button>
                <button 
                  className="share-btn"
                  onClick={() => { 
                    setSearchTerm(''); 
                    setFilter('all'); 
                    fetchContacts();
                  }}
                  style={{ background: '#f5f5f5', color: '#0033cc', border: '1px solid #0033cc' }}
                  disabled={isLoading}
                >
                  <Refresh style={{ fontSize: '14px' }} />
                </button>
              </div>
            </div>

            {/* Contacts Table */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredContacts.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: '#666'
                }}>
                  {contacts.length === 0 ? 'No contacts found. Add your first contact!' : 'No contacts match your search.'}
                </div>
              ) : (
                filteredContacts.map((contact) => (
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
                          {contact.name ? contact.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <h4 className="alert-type" style={{ margin: 0 }}>{contact.name || 'Unnamed Contact'}</h4>
                            <span className="status-badge" style={{
                              background: getTypeBackgroundColor(contact.type),
                              color: getTypeColor(contact.type),
                              border: `1px solid ${getTypeColor(contact.type)}`,
                              padding: '2px 8px',
                              fontSize: '10px',
                              textTransform: 'uppercase'
                            }}>
                              {contact.type || 'unknown'}
                            </span>
                            <span className="status-badge" style={{
                              background: getStatusBackgroundColor(contact.status),
                              color: getStatusColor(contact.status),
                              border: `1px solid ${getStatusColor(contact.status)}`,
                              padding: '2px 8px',
                              fontSize: '10px',
                              textTransform: 'uppercase'
                            }}>
                              {contact.status || 'active'}
                            </span>
                          </div>
                          {contact.phone && (
                            <p className="alert-message" style={{ marginBottom: '4px' }}>
                              <Phone style={{ fontSize: '12px', marginRight: '4px' }} />
                              {contact.phone}
                            </p>
                          )}
                          {contact.email && (
                            <p className="alert-message" style={{ margin: '4px 0' }}>
                              <Email style={{ fontSize: '12px', marginRight: '4px' }} />
                              {contact.email}
                            </p>
                          )}
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
                        disabled={isDeleting}
                      >
                        <Delete style={{ fontSize: '12px', marginRight: '4px' }} />
                        {isDeleting ? 'Deleting...' : ''}
                      </button>
                    </div>
                  </div>
                ))
              )}
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
                {contacts.length > 0 ? 
                  ((contacts.filter(c => c.status === 'active').length / contacts.length) * 100).toFixed(0) : 0}% of total
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
                {contacts.length > 0 ? 
                  ((contacts.filter(c => c.status === 'inactive').length / contacts.length) * 100).toFixed(0) : 0}% of total
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
                {contacts.length > 0 ? 
                  ((contacts.filter(c => c.type === 'customer').length / contacts.length) * 100).toFixed(0) : 0}% of total
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
                {contacts.length > 0 ? 
                  ((contacts.filter(c => c.type === 'supplier').length / contacts.length) * 100).toFixed(0) : 0}% of total
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
          disabled={isLoading}
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
                {editMode ? (currentContact.id ? 'Edit Contact' : 'Add Contact') : 'Contact Details'}
              </h2>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
              {/* Error Display in Modal */}
              {error && (
                <div style={{
                  background: '#ffebee',
                  color: '#c62828',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  fontSize: '12px'
                }}>
                  {error}
                </div>
              )}

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
                  {currentContact.name ? currentContact.name.charAt(0) : '?'}
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
                    <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>
                      Full Name <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="share-input"
                      value={currentContact.name || ''}
                      onChange={(e) => setCurrentContact({...currentContact, name: e.target.value})}
                      disabled={!editMode}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>
                      Contact Type <span style={{ color: '#c62828' }}>*</span>
                    </label>
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
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>
                    Phone Number <span style={{ color: '#c62828' }}>*</span>
                  </label>
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
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>
                    Email
                  </label>
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
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>
                    Location
                  </label>
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
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>
                    Business Name
                  </label>
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
                  <label className="status-title" style={{ display: 'block', marginBottom: '8px' }}>
                    Status <span style={{ color: '#c62828' }}>*</span>
                  </label>
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

                {!editMode && currentContact.totalSpent > 0 && (
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
                    {currentContact.lastPurchase && (
                      <div>
                        <div className="stat-label">Last Purchase</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>{currentContact.lastPurchase}</div>
                      </div>
                    )}
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
                disabled={isSaving}
              >
                Cancel
              </button>
              {editMode ? (
                <button 
                  className="share-btn"
                  onClick={handleSaveContact}
                  style={{ background: '#0033cc', color: 'white' }}
                  disabled={isSaving || !currentContact.name || !currentContact.phone}
                >
                  {isSaving ? 'Saving...' : 'Save Contact'}
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