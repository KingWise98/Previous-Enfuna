"use client"

import React, { useState } from 'react';

const Support = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [liveChatMessages, setLiveChatMessages] = useState([
    { id: 1, sender: 'user', text: 'I have an issue with my recent trip', time: '10:30 AM' },
    { id: 2, sender: 'support', text: 'Hello! How can I help you today?', time: '10:30 AM' },
    { id: 3, sender: 'support', text: 'I understand, could you please provide your trip ID?', time: '10:32 AM' },
    { id: 4, sender: 'user', text: 'Trip ID: TRP 980800', time: '10:33 AM' },
    { id: 5, sender: 'user', type: 'file', filename: 'Receipt.PDF', time: '10:33 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [ticketForm, setTicketForm] = useState({
    disputeType: 'trip',
    title: '',
    description: '',
    attachments: [],
  });
  const [allDisputes, setAllDisputes] = useState([
    {
      id: 1,
      title: 'Rider took wrong route',
      description: 'Rider took a longer route than necessary',
      status: 'In Progress',
      created: '2025-12-13',
      updated: '2025-12-15',
      type: 'DSP-001',
      category: 'trip'
    },
    {
      id: 2,
      title: 'Package not delivered',
      description: 'Order #1221 marked as delivered but not received',
      status: 'Open',
      created: '2025-12-13',
      updated: '2025-12-14',
      type: 'DSP-002',
      category: 'delivery'
    },
   
    
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: liveChatMessages.length + 1,
        sender: 'user',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLiveChatMessages([...liveChatMessages, newMsg]);
      setNewMessage('');
      
      // Simulate auto-reply after 2 seconds
      setTimeout(() => {
        const autoReply = {
          id: liveChatMessages.length + 2,
          sender: 'support',
          text: 'Thanks for your message. Our support team will review your concern.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setLiveChatMessages(prev => [...prev, autoReply]);
      }, 2000);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type.split('/')[1] || 'file'
    }));
    setTicketForm({ ...ticketForm, attachments: [...ticketForm.attachments, ...newAttachments] });
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (ticketForm.title && ticketForm.description) {
      const newDispute = {
        id: allDisputes.length + 1,
        title: ticketForm.title,
        description: ticketForm.description,
        status: 'Open',
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
        type: `DSP-${(allDisputes.length + 1).toString().padStart(3, '0')}`,
        category: ticketForm.disputeType
      };
      
      setAllDisputes([newDispute, ...allDisputes]);
      setTicketForm({
        disputeType: 'trip',
        title: '',
        description: '',
        attachments: [],
      });
      alert('Ticket submitted successfully!');
      setActiveTab('disputes');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'status-badge valid';
      case 'in progress': return 'status-badge pending';
      default: return 'status-badge invalid';
    }
  };

  const disputeStats = {
    total: allDisputes.length,
    active: allDisputes.filter(d => d.status !== 'Resolved').length,
    resolved: allDisputes.filter(d => d.status === 'Resolved').length,
  };

  return (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">SUPPORT AND DISPUTES</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab-btn ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => setActiveTab('disputes')}>
          Disputes
        </button>
        <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          Live Chat
        </button>
        <button className={`tab-btn ${activeTab === 'ticket' ? 'active' : ''}`} onClick={() => setActiveTab('ticket')}>
          Submit Ticket
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Disputes</div>
          <p className="stat-value">{disputeStats.total}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <p className="stat-value">{disputeStats.active}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Resolved</div>
          <p className="stat-value">{disputeStats.resolved}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Response Time</div>
          <p className="stat-value">4.2 HRS</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="alerts-section">
        {/* Left Panel - Main Content */}
        <div className="referral-alerts" style={{ gridColumn: 'span 2' }}>
          {activeTab === 'overview' && (
            <div className="support-overview">
              <div className="alerts-title">Support Overview</div>
              
              {/* Dispute Categories */}
              <div style={{ marginBottom: '16px' }}>
                <div className="alert-item">
                  <div style={{ flex: 1 }}>
                    <div className="alert-type">Trip Disputes</div>
                    <div className="alert-message">
                      {allDisputes.filter(d => d.category === 'trip' && d.status !== 'Resolved').length} active issues
                    </div>
                  </div>
                  <span className="new-badge">
                    {allDisputes.filter(d => d.category === 'trip').length} total
                  </span>
                </div>
                
                <div className="alert-item">
                  <div style={{ flex: 1 }}>
                    <div className="alert-type">Delivery Issues</div>
                    <div className="alert-message">
                      {allDisputes.filter(d => d.category === 'delivery' && d.status !== 'Resolved').length} active issues
                    </div>
                  </div>
                  <span className="new-badge">
                    {allDisputes.filter(d => d.category === 'delivery').length} total
                  </span>
                </div>
                
                <div className="alert-item">
                  <div style={{ flex: 1 }}>
                    <div className="alert-type">Payment Issues</div>
                    <div className="alert-message">
                      {allDisputes.filter(d => d.category === 'payment' && d.status !== 'Resolved').length} active issues
                    </div>
                  </div>
                  <span className="new-badge">
                    {allDisputes.filter(d => d.category === 'payment').length} total
                  </span>
                </div>
              </div>

              {/* Recent Disputes */}
              <div className="alerts-title">Recent Disputes</div>
              <div className="ledger-entry" style={{ marginBottom: '8px' }}>
                {allDisputes.slice(0, 4).map(dispute => (
                  <div key={dispute.id} className="alert-item" style={{ marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div className="alert-type">{dispute.title}</div>
                      <div className="alert-message">{dispute.description}</div>
                      <div className="alert-time">{dispute.created}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span className={`status-badge ${dispute.status === 'Resolved' ? 'valid' : dispute.status === 'In Progress' ? 'pending' : 'invalid'}`}>
                        {dispute.status}
                      </span>
                      <span style={{ fontSize: '11px', color: '#0033cc', fontWeight: '500' }}>
                        {dispute.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="all-disputes">
              <div className="alerts-title">All Disputes</div>
              
              {/* Search and Filter */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Search disputes..."
                  className="share-input"
                  style={{ flex: 1 }}
                />
                <select className="filter-btn" style={{ width: 'auto' }}>
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>

              {/* Disputes List */}
              <div className="ledger-entry" style={{ marginBottom: '8px' }}>
                {allDisputes.map(dispute => (
                  <div key={dispute.id} className="alert-item" style={{ marginBottom: '8px', padding: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div className="alert-type">{dispute.title}</div>
                        <span className={`status-badge ${dispute.status === 'Resolved' ? 'valid' : dispute.status === 'In Progress' ? 'pending' : 'invalid'}`}>
                          {dispute.status}
                        </span>
                      </div>
                      <div className="alert-message">{dispute.description}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#0033cc', fontWeight: '500' }}>
                          {dispute.type}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          Created: {dispute.created}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button className="share-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>
                          View Details
                        </button>
                        <button className="share-btn" style={{ 
                          fontSize: '11px', 
                          padding: '6px 12px',
                          background: '#f0f4ff',
                          color: '#0033cc'
                        }}>
                          Add Comment
                        </button>
                        <button className="share-btn" style={{ 
                          fontSize: '11px', 
                          padding: '6px 12px',
                          background: '#fef08a',
                          color: 'black'
                        }}>
                          Upload File
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="live-chat">
              <div className="alerts-title">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Live Support Chat</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#2e7d32' }}>
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      background: '#2e7d32', 
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></span>
                    Support Team Online
                  </div>
                </div>
              </div>

              <div style={{ 
                height: '300px', 
                overflowY: 'auto', 
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px',
                background: '#f8f9fa'
              }}>
                {liveChatMessages.map(message => (
                  <div 
                    key={message.id} 
                    style={{ 
                      marginBottom: '12px',
                      maxWidth: '80%',
                      marginLeft: message.sender === 'user' ? 'auto' : '0',
                    }}
                  >
                    <div style={{ 
                      background: message.sender === 'user' ? '#0033cc' : 'white',
                      color: message.sender === 'user' ? 'white' : '#0033cc',
                      padding: '8px 12px',
                      borderRadius: message.sender === 'user' ? '8px 8px 0 8px' : '8px 8px 8px 0',
                      border: message.sender === 'support' ? '1px solid #e0e0e0' : 'none',
                      fontSize: '12px',
                      lineHeight: '1.3'
                    }}>
                      {message.type === 'file' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px' }}>📎</span>
                          <div>
                            <div style={{ fontWeight: '500' }}>{message.filename}</div>
                            <div style={{ fontSize: '10px', opacity: '0.7' }}>PDF Document</div>
                          </div>
                        </div>
                      ) : (
                        message.text
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#999',
                      textAlign: message.sender === 'user' ? 'right' : 'left',
                      marginTop: '2px'
                    }}>
                      {message.time}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="share-input"
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={handleSendMessage} 
                  className="share-btn"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ticket' && (
            <div className="submit-ticket">
              <div className="alerts-title">Submit New Ticket</div>
              
              <form onSubmit={handleSubmitTicket} style={{ marginTop: '16px' }}>
                {/* Dispute Type Selection */}
                <div style={{ marginBottom: '16px' }}>
                  <div className="commission-grid">
                    <button
                      type="button"
                      className={`commission-card ${ticketForm.disputeType === 'trip' ? 'revenue' : 'pending'}`}
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => setTicketForm({...ticketForm, disputeType: 'trip'})}
                    >
                      <div style={{ fontSize: '1.5rem' }}>🚗</div>
                      <div className="commission-label">Trip</div>
                    </button>
                    
                    <button
                      type="button"
                      className={`commission-card ${ticketForm.disputeType === 'delivery' ? 'revenue' : 'pending'}`}
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => setTicketForm({...ticketForm, disputeType: 'delivery'})}
                    >
                      <div style={{ fontSize: '1.5rem' }}>📦</div>
                      <div className="commission-label">Delivery</div>
                    </button>
                    
                    <button
                      type="button"
                      className={`commission-card ${ticketForm.disputeType === 'payment' ? 'revenue' : 'pending'}`}
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => setTicketForm({...ticketForm, disputeType: 'payment'})}
                    >
                      <div style={{ fontSize: '1.5rem' }}>💳</div>
                      <div className="commission-label">Payments</div>
                    </button>
                    
                    <button
                      type="button"
                      className={`commission-card ${ticketForm.disputeType === 'wallet' ? 'revenue' : 'pending'}`}
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => setTicketForm({...ticketForm, disputeType: 'wallet'})}
                    >
                      <div style={{ fontSize: '1.5rem' }}>💰</div>
                      <div className="commission-label">Wallet</div>
                    </button>
                  </div>
                </div>

                {/* Title Input */}
                <div style={{ marginBottom: '16px' }}>
                  <div className="detail-label" style={{ marginBottom: '8px' }}>Title</div>
                  <input
                    type="text"
                    className="share-input"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                {/* Description Input */}
                <div style={{ marginBottom: '16px' }}>
                  <div className="detail-label" style={{ marginBottom: '8px' }}>Description</div>
                  <textarea
                    style={{ 
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #0033cc',
                      borderRadius: '6px',
                      background: '#f0f4ff',
                      color: '#0033cc',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '12px',
                      minHeight: '120px'
                    }}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    placeholder="Provide detailed information about your issue"
                    required
                  />
                </div>

                {/* Attachments */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="detail-label" style={{ marginBottom: '8px' }}>Attachments</div>
                  <div style={{ 
                    border: '2px dashed #0033cc',
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#f0f4ff',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      id="ticket-file-upload"
                    />
                    <label htmlFor="ticket-file-upload" style={{ cursor: 'pointer' }}>
                      <div style={{ fontSize: '24px', color: '#0033cc', marginBottom: '8px' }}>📤</div>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#0033cc' }}>
                        Click to upload or drag and drop
                      </div>
                      <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                        Screenshots, receipts or supporting documents
                      </div>
                    </label>
                  </div>
                  
                  {ticketForm.attachments.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      {ticketForm.attachments.map((file, index) => (
                        <div key={index} className="alert-item" style={{ marginBottom: '4px' }}>
                          <div style={{ flex: 1 }}>
                            <div className="alert-type">{file.name}</div>
                            <div className="alert-time">{file.size}</div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const newAttachments = [...ticketForm.attachments];
                              newAttachments.splice(index, 1);
                              setTicketForm({...ticketForm, attachments: newAttachments});
                            }}
                            style={{ 
                              background: '#ffebee',
                              color: '#c62828',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    className="activate-code-btn" 
                    style={{ background: '#666' }}
                    onClick={() => setActiveTab('overview')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="activate-code-btn">
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Panel - Stats & Quick Actions */}
        <div className="milestone-section">
          <div className="alerts-title">Quick Stats</div>
          
          <div style={{ marginBottom: '20px' }}>
            <div className="milestone-card">
              <div className="milestone-title">Active Disputes</div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#0033cc',
                margin: '8px 0'
              }}>
                {disputeStats.active}
              </div>
              <div style={{ 
                height: '4px', 
                background: '#f0f4ff',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${(disputeStats.active / disputeStats.total) * 100}%`,
                  height: '100%',
                  background: '#0033cc'
                }}></div>
              </div>
            </div>
            
            <div className="milestone-card">
              <div className="milestone-title">Resolved</div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#2e7d32',
                margin: '8px 0'
              }}>
                {disputeStats.resolved}
              </div>
              <div style={{ 
                height: '4px', 
                background: '#f0f4ff',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${(disputeStats.resolved / disputeStats.total) * 100}%`,
                  height: '100%',
                  background: '#2e7d32'
                }}></div>
              </div>
            </div>
            
            <div className="milestone-card">
              <div className="milestone-title">Avg Response Time</div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#0033cc',
                margin: '8px 0'
              }}>
                4.2 hrs
              </div>
              <div className="milestone-text">Typically responds within 4 hours</div>
            </div>
            
            <div className="milestone-card">
              <div className="milestone-title">Satisfaction Rate</div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#f59e0b',
                margin: '8px 0'
              }}>
                92%
              </div>
              <div style={{ 
                height: '4px', 
                background: '#f0f4ff',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '92%',
                  height: '100%',
                  background: '#f59e0b'
                }}></div>
              </div>
            </div>
          </div>

          <div className="alerts-title">Quick Actions</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className="share-btn"
              onClick={() => setActiveTab('ticket')}
            >
              New Ticket
            </button>
            <button 
              className="share-btn" 
              style={{ background: '#f0f4ff', color: '#0033cc' }}
              onClick={() => setActiveTab('chat')}
            >
              Live Chat
            </button>
            <button 
              className="share-btn" 
              style={{ background: '#f0f4ff', color: '#0033cc' }}
            >
              View FAQ
            </button>
            <button 
              className="share-btn" 
              style={{ background: '#f0f4ff', color: '#0033cc' }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .alerts-section {
            grid-template-columns: 1fr;
          }
          
          .referral-alerts {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Support;