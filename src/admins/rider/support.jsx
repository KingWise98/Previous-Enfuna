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
    {
      id: 3,
      title: 'Duplicate charge',
      description: 'Charged twice for the same order',
      status: 'Resolved',
      created: '2025-12-13',
      updated: '2025-12-14',
      type: 'DSP-003',
      category: 'payment'
    },
    {
      id: 4,
      title: 'Refund not received',
      description: 'Refund initiated 5 days ago but not credited',
      status: 'In Progress',
      created: '2025-12-13',
      updated: '2025-12-14',
      type: 'DSP-004',
      category: 'payment'
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
      case 'resolved': return 'status-resolved';
      case 'in progress': return 'status-in-progress';
      default: return 'status-open';
    }
  };

  const disputeStats = {
    total: allDisputes.length,
    active: allDisputes.filter(d => d.status !== 'Resolved').length,
    resolved: allDisputes.filter(d => d.status === 'Resolved').length,
  };

  return (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">SUPPORT AND DISPUTES</h1>
            <p className="expense-subtitle">Manage tickets, track disputes and get help from support team</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">User Support</span>
            <div className="expense-user-badge">US</div>
          </div>
        </div>
      </header>

      {/* Compact Stats Grid */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Disputes</span>
            <span className="compact-stat-change positive">+4</span>
          </div>
          <div className="compact-stat-value">
            {disputeStats.total}
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Active</span>
            <span className="compact-stat-change negative">+{disputeStats.active}</span>
          </div>
          <div className="compact-stat-value">
            {disputeStats.active}
          </div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Resolved</span>
            <span className="compact-stat-change positive">+{disputeStats.resolved}</span>
          </div>
          <div className="compact-stat-value">
            {disputeStats.resolved}
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Response Time</span>
            <span className="compact-stat-change positive">+2.5h</span>
          </div>
          <div className="compact-stat-value">
            4.2<span className="compact-stat-currency">HRS</span>
          </div>
        </div>
      </div>

      {/* Compact Navigation Bar */}
      <div className="compact-action-bar">
        <button 
          className={`compact-btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`compact-btn ${activeTab === 'disputes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('disputes')}
        >
          Disputes
        </button>
        <button 
          className={`compact-btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('chat')}
        >
          Live Chat
        </button>
        <button 
          className={`compact-btn ${activeTab === 'ticket' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('ticket')}
        >
          Submit Ticket
        </button>
      </div>

      {/* Main Content Area */}
      <div className="compact-content-grid">
        {/* Left Panel - Dynamic Content */}
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          {activeTab === 'overview' && (
            <div className="support-overview">
              <div className="compact-section-header">
                <h2 className="compact-section-title">Support Overview</h2>
                <p className="compact-section-subtitle">Your support metrics and recent activities</p>
              </div>

              {/* Dispute Categories */}
              <div className="compact-breakdown-list" style={{ marginBottom: '1rem' }}>
                <div className="compact-breakdown-item">
                  <div className="compact-breakdown-info">
                    <span className="compact-breakdown-name">Trip Disputes</span>
                    <span className="compact-breakdown-percentage">
                      {allDisputes.filter(d => d.category === 'trip' && d.status !== 'Resolved').length} active
                    </span>
                  </div>
                  <div className="compact-progress-bar">
                    <div
                      className="compact-progress-fill"
                      style={{
                        width: `${(allDisputes.filter(d => d.category === 'trip').length / allDisputes.length) * 100}%`,
                        backgroundColor: '#3b82f6'
                      }}
                    />
                  </div>
                </div>
                <div className="compact-breakdown-item">
                  <div className="compact-breakdown-info">
                    <span className="compact-breakdown-name">Delivery Issues</span>
                    <span className="compact-breakdown-percentage">
                      {allDisputes.filter(d => d.category === 'delivery' && d.status !== 'Resolved').length} active
                    </span>
                  </div>
                  <div className="compact-progress-bar">
                    <div
                      className="compact-progress-fill"
                      style={{
                        width: `${(allDisputes.filter(d => d.category === 'delivery').length / allDisputes.length) * 100}%`,
                        backgroundColor: '#f59e0b'
                      }}
                    />
                  </div>
                </div>
                <div className="compact-breakdown-item">
                  <div className="compact-breakdown-info">
                    <span className="compact-breakdown-name">Payment Issues</span>
                    <span className="compact-breakdown-percentage">
                      {allDisputes.filter(d => d.category === 'payment' && d.status !== 'Resolved').length} active
                    </span>
                  </div>
                  <div className="compact-progress-bar">
                    <div
                      className="compact-progress-fill"
                      style={{
                        width: `${(allDisputes.filter(d => d.category === 'payment').length / allDisputes.length) * 100}%`,
                        backgroundColor: '#10b981'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Disputes */}
              <div className="compact-table-wrapper">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Dispute</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDisputes.slice(0, 4).map(dispute => (
                      <tr key={dispute.id}>
                        <td>
                          <div className="compact-dispute-cell">
                            <div className="compact-dispute-title">{dispute.title}</div>
                            <div className="compact-dispute-desc">{dispute.description}</div>
                          </div>
                        </td>
                        <td>
                          <span className="compact-type-badge">{dispute.type}</span>
                        </td>
                        <td>
                          <span className={`compact-status ${getStatusBadgeClass(dispute.status)}`}>
                            {dispute.status}
                          </span>
                        </td>
                        <td className="compact-date">{dispute.created}</td>
                        <td>
                          <div className="compact-action-buttons">
                            <button className="compact-action-btn view">View</button>
                            <button className="compact-action-btn edit">Update</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="all-disputes">
              <div className="compact-section-header">
                <h2 className="compact-section-title">All Disputes</h2>
                <div className="compact-filters">
                  <input
                    type="text"
                    placeholder="Search disputes..."
                    className="compact-search-input"
                  />
                  <select className="compact-filter-select">
                    <option>All Status</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>

              <div className="compact-table-wrapper">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDisputes.map(dispute => (
                      <tr key={dispute.id}>
                        <td>
                          <div className="compact-dispute-cell">
                            <div className="compact-dispute-title">{dispute.title}</div>
                            <div className="compact-dispute-desc">{dispute.description}</div>
                          </div>
                        </td>
                        <td>
                          <span className="compact-type-badge">{dispute.type}</span>
                        </td>
                        <td>
                          <span className={`compact-status ${getStatusBadgeClass(dispute.status)}`}>
                            {dispute.status}
                          </span>
                        </td>
                        <td className="compact-date">{dispute.created}</td>
                        <td className="compact-date">{dispute.updated}</td>
                        <td>
                          <div className="compact-action-buttons">
                            <button className="compact-action-btn view">View</button>
                            <button className="compact-action-btn comment">Comment</button>
                            <button className="compact-action-btn upload">Upload</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="live-chat">
              <div className="compact-section-header">
                <h2 className="compact-section-title">Live Support Chat</h2>
                <div className="online-indicator">
                  <span className="online-dot"></span>
                  <span>Support Team Online</span>
                </div>
              </div>

              <div className="chat-messages-container">
                {liveChatMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`chat-message ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
                  >
                    <div className="message-content">
                      {message.type === 'file' ? (
                        <div className="file-message">
                          <div className="file-icon">📎</div>
                          <div>
                            <div className="file-name">{message.filename}</div>
                            <div className="file-size">PDF Document</div>
                          </div>
                        </div>
                      ) : (
                        <div className="message-text">{message.text}</div>
                      )}
                    </div>
                    <div className="message-time">{message.time}</div>
                  </div>
                ))}
              </div>

              <div className="chat-input-container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="chat-input"
                />
                <button onClick={handleSendMessage} className="compact-btn btn-primary">
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ticket' && (
            <div className="submit-ticket">
              <div className="compact-section-header">
                <h2 className="compact-section-title">Submit New Ticket</h2>
                <p className="compact-section-subtitle">Create a new support ticket or dispute</p>
              </div>

              <form onSubmit={handleSubmitTicket} className="ticket-form">
                <div className="compact-form-group">
                  <label className="compact-form-label">Dispute Type</label>
                  <div className="compact-type-buttons">
                    <button
                      type="button"
                      className={`compact-type-btn ${ticketForm.disputeType === 'trip' ? 'active' : ''}`}
                      onClick={() => setTicketForm({...ticketForm, disputeType: 'trip'})}
                    >
                      Trip
                    </button>
                    <button
                      type="button"
                      className={`compact-type-btn ${ticketForm.disputeType === 'delivery' ? 'active' : ''}`}
                      onClick={() => setTicketForm({...ticketForm, disputeType: 'delivery'})}
                    >
                      Delivery
                    </button>
                    <button
                      type="button"
                      className={`compact-type-btn ${ticketForm.disputeType === 'payment' ? 'active' : ''}`}
                      onClick={() => setTicketForm({...ticketForm, disputeType: 'payment'})}
                    >
                      Payments
                    </button>
                    <button
                      type="button"
                      className={`compact-type-btn ${ticketForm.disputeType === 'wallet' ? 'active' : ''}`}
                      onClick={() => setTicketForm({...ticketForm, disputeType: 'wallet'})}
                    >
                      Wallet
                    </button>
                  </div>
                </div>

                <div className="compact-form-group">
                  <label className="compact-form-label">Title</label>
                  <input
                    type="text"
                    className="compact-form-input"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="compact-form-group">
                  <label className="compact-form-label">Description</label>
                  <textarea
                    className="compact-form-textarea"
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    placeholder="Provide detailed information about your issue"
                    rows="4"
                    required
                  />
                </div>

                <div className="compact-form-group">
                  <label className="compact-form-label">Attachments</label>
                  <div className="compact-upload-area">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="compact-file-input"
                      id="ticket-file-upload"
                    />
                    <label htmlFor="ticket-file-upload" className="compact-upload-label">
                      <div className="compact-upload-icon">📤</div>
                      <div className="compact-upload-text">Click to upload or drag and drop</div>
                      <div className="compact-upload-subtext">Screenshots, receipts or supporting documents</div>
                    </label>
                  </div>
                  
                  {ticketForm.attachments.length > 0 && (
                    <div className="compact-attachments-list">
                      {ticketForm.attachments.map((file, index) => (
                        <div key={index} className="compact-attachment-item">
                          <span className="compact-attachment-name">{file.name}</span>
                          <span className="compact-attachment-size">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="compact-modal-actions">
                  <button 
                    type="button" 
                    className="compact-modal-btn btn-secondary"
                    onClick={() => setActiveTab('overview')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="compact-modal-btn btn-primary">
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Panel - Stats & Quick Actions */}
        <div className="compact-breakdown-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Quick Stats</h2>
            <p className="compact-section-subtitle">Support metrics</p>
          </div>

          <div className="compact-breakdown-list">
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Active Disputes</span>
                <span className="compact-stat-value">{disputeStats.active}</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: `${(disputeStats.active / disputeStats.total) * 100}%`,
                    backgroundColor: '#ef4444'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Resolved</span>
                <span className="compact-stat-value">{disputeStats.resolved}</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: `${(disputeStats.resolved / disputeStats.total) * 100}%`,
                    backgroundColor: '#10b981'
                  }}
                />
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Avg Response Time</span>
                <span className="compact-stat-value">4.2 hrs</span>
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Satisfaction Rate</span>
                <span className="compact-stat-value">92%</span>
              </div>
              <div className="compact-progress-bar">
                <div
                  className="compact-progress-fill"
                  style={{
                    width: '92%',
                    backgroundColor: '#f59e0b'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="compact-section-header" style={{ marginTop: '1rem' }}>
            <h2 className="compact-section-title">Quick Actions</h2>
          </div>

          <div className="compact-quick-actions">
            <button className="compact-action-btn btn-primary" onClick={() => setActiveTab('ticket')}>
              New Ticket
            </button>
            <button className="compact-action-btn btn-secondary" onClick={() => setActiveTab('chat')}>
              Live Chat
            </button>
            <button className="compact-action-btn btn-secondary">
              View FAQ
            </button>
            <button className="compact-action-btn btn-secondary">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Support Specific Styles */
        .support-overview,
        .all-disputes,
        .live-chat,
        .submit-ticket {
          height: 100%;
        }

        .compact-dispute-cell {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .compact-dispute-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.7rem;
        }

        .compact-dispute-desc {
          color: #64748b;
          font-size: 0.65rem;
          line-height: 1.2;
        }

        .compact-type-badge {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #dbeafe;
        }

        .compact-status {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .status-resolved {
          background: #d1fae5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .status-in-progress {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .status-open {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .compact-stat-item {
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          margin-bottom: 0.5rem;
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

        /* Live Chat Styles */
        .chat-messages-container {
          height: 300px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 1rem;
          background: #f8fafc;
        }

        .chat-message {
          margin-bottom: 0.75rem;
          max-width: 80%;
        }

        .user-message {
          margin-left: auto;
        }

        .user-message .message-content {
          background: #3b82f6;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 6px 6px 0 6px;
        }

        .support-message .message-content {
          background: white;
          color: #1e293b;
          padding: 0.5rem 0.75rem;
          border-radius: 6px 6px 6px 0;
          border: 1px solid #e2e8f0;
        }

        .message-text {
          font-size: 0.7rem;
          line-height: 1.2;
        }

        .message-time {
          font-size: 0.6rem;
          color: #94a3b8;
          margin-top: 0.125rem;
          text-align: right;
        }

        .user-message .message-time {
          text-align: right;
        }

        .support-message .message-time {
          text-align: left;
        }

        .file-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .file-icon {
          font-size: 1rem;
        }

        .file-name {
          font-weight: 600;
          font-size: 0.7rem;
        }

        .file-size {
          font-size: 0.6rem;
          color: #94a3b8;
        }

        .chat-input-container {
          display: flex;
          gap: 0.5rem;
        }

        .chat-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 0.7rem;
          font-family: 'Poppins', sans-serif;
        }

        /* Submit Ticket Styles */
        .compact-type-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .compact-type-btn {
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          background: white;
          color: #64748b;
          font-weight: 500;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .compact-type-btn:hover {
          border-color: #3b82f6;
          color: #1e40af;
          background: #eff6ff;
        }

        .compact-type-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .compact-attachments-list {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .compact-attachment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .compact-attachment-name {
          font-size: 0.7rem;
          color: #475569;
          font-weight: 500;
        }

        .compact-attachment-size {
          font-size: 0.65rem;
          color: #94a3b8;
        }

        /* Quick Actions */
        .compact-quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .compact-quick-actions .compact-action-btn {
          width: 100%;
          justify-content: center;
        }

        .online-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          color: #10b981;
          font-weight: 600;
        }

        .online-dot {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .compact-content-grid > .compact-table-section {
            grid-column: span 1;
          }
          
          .compact-type-buttons {
            grid-template-columns: 1fr;
          }
          
          .chat-message {
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  );
};

export default Support;