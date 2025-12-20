import React, { useState } from 'react';
import './support.css';

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
      case 'resolved': return 'status-badge resolved';
      case 'in progress': return 'status-badge in-progress';
      default: return 'status-badge open';
    }
  };

  const disputeStats = {
    total: allDisputes.length,
    active: allDisputes.filter(d => d.status !== 'Resolved').length,
    resolved: allDisputes.filter(d => d.status === 'Resolved').length,
  };

  return (
    <div className="support-container">
      <header className="support-header">
        <h1>SUPPORT AND DISPUTES</h1>
        <p>Manage your tickets, track disputes and get help from our support team</p>
      </header>

      <nav className="support-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'disputes' ? 'active' : ''}`}
          onClick={() => setActiveTab('disputes')}
        >
          Disputes
        </button>
        <button 
          className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Live Chat
        </button>
        <button 
          className={`nav-btn ${activeTab === 'ticket' ? 'active' : ''}`}
          onClick={() => setActiveTab('ticket')}
        >
          Submit Ticket
        </button>
      </nav>

      <main className="support-content">
        {activeTab === 'overview' && (
          <div className="overview-container">
            <div className="disputes-overview">
              <h2>Disputes</h2>
              <div className="dispute-stats">
                <div className="stat-card">
                  <h3>Active disputes</h3>
                  <p className="stat-number">{disputeStats.active}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Disputes</h3>
                  <p className="stat-number">{disputeStats.total}</p>
                </div>
                <div className="stat-card">
                  <h3>Resolved</h3>
                  <p className="stat-number">{disputeStats.resolved}</p>
                </div>
              </div>

              <div className="dispute-categories">
                <div className="category-section">
                  <h3>Trips Disputes</h3>
                  <p>Active disputes: {allDisputes.filter(d => d.category === 'trip' && d.status !== 'Resolved').length}</p>
                </div>
                <div className="category-section">
                  <h3>Delivery Disputes</h3>
                  <p>Active disputes: {allDisputes.filter(d => d.category === 'delivery' && d.status !== 'Resolved').length}</p>
                </div>
                <div className="category-section">
                  <h3>Payment Disputes</h3>
                  <p>Active disputes: {allDisputes.filter(d => d.category === 'payment' && d.status !== 'Resolved').length}</p>
                </div>
                <div className="category-section">
                  <h3>Wallet Disputes</h3>
                  <p>Active disputes: {allDisputes.filter(d => d.category === 'wallet' && d.status !== 'Resolved').length}</p>
                </div>
              </div>
            </div>

            <div className="recent-disputes">
              <h2>Recent Disputes</h2>
              <p>Your latest support tickets and their statuses</p>
              
              <div className="dispute-cards">
                {allDisputes.slice(0, 4).map(dispute => (
                  <div key={dispute.id} className="dispute-card">
                    <div className="dispute-card-header">
                      <h4>{dispute.title}</h4>
                      <span className={getStatusBadgeClass(dispute.status)}>
                        {dispute.status}
                      </span>
                    </div>
                    <p className="dispute-description">{dispute.description}</p>
                    <div className="dispute-card-footer">
                      <span className="dispute-date">{dispute.created}</span>
                      <span className="dispute-type">{dispute.type}</span>
                    </div>
                    <div className="dispute-tags">
                      <span className="dispute-tag">Report Trip Issue</span>
                      <span className="dispute-tag">Delivery Problem</span>
                      <span className="dispute-tag">Payment Dispute</span>
                      <span className="dispute-tag">Wallet Issue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="all-disputes">
            <div className="disputes-header">
              <h2>All Disputes</h2>
              <p>Track and manage your support tickets</p>
            </div>
            
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search Disputes..." 
                className="search-input"
              />
            </div>

            <div className="disputes-list">
              {allDisputes.map(dispute => (
                <div key={dispute.id} className="dispute-item">
                  <div className="dispute-item-header">
                    <div>
                      <h3>{dispute.title}</h3>
                      <p className="dispute-subtitle">{dispute.description}</p>
                    </div>
                    <span className={getStatusBadgeClass(dispute.status)}>
                      {dispute.status}
                    </span>
                  </div>
                  
                  <div className="dispute-details">
                    <div className="detail-item">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{dispute.created}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Updated:</span>
                      <span className="detail-value">{dispute.updated}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dispute ID:</span>
                      <span className="detail-value dispute-id">{dispute.type}</span>
                    </div>
                  </div>

                  <div className="dispute-actions">
                    <button className="action-btn view-btn">View Details</button>
                    <button className="action-btn comment-btn">Add Comment</button>
                    <button className="action-btn upload-btn">Upload Document</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="live-chat">
            <div className="chat-header">
              <h2>Live Support Chat</h2>
              <p>Chat with our support team in real-time</p>
              <div className="online-indicator">
                <span className="online-dot"></span>
                <span>Online</span>
              </div>
            </div>

            <div className="chat-messages">
              {liveChatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
                >
                  <div className="message-content">
                    {message.type === 'file' ? (
                      <div className="file-message">
                        <div className="file-icon">📎</div>
                        <div>
                          <p className="file-name">{message.filename}</p>
                          <p className="file-size">PDF Document</p>
                        </div>
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                  <span className="message-time">{message.time}</span>
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your Message..."
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="send-btn">
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ticket' && (
          <div className="submit-ticket">
            <div className="ticket-header">
              <h2>Submit New Ticket</h2>
              <p>Create a new support ticket or dispute</p>
            </div>

            <form onSubmit={handleSubmitTicket} className="ticket-form">
              <div className="form-group">
                <label>Dispute Type</label>
                <div className="dispute-type-buttons">
                  <button
                    type="button"
                    className={`type-btn ${ticketForm.disputeType === 'trip' ? 'active' : ''}`}
                    onClick={() => setTicketForm({...ticketForm, disputeType: 'trip'})}
                  >
                    Trip
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${ticketForm.disputeType === 'delivery' ? 'active' : ''}`}
                    onClick={() => setTicketForm({...ticketForm, disputeType: 'delivery'})}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${ticketForm.disputeType === 'payments' ? 'active' : ''}`}
                    onClick={() => setTicketForm({...ticketForm, disputeType: 'payments'})}
                  >
                    Payments
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${ticketForm.disputeType === 'wallet' ? 'active' : ''}`}
                    onClick={() => setTicketForm({...ticketForm, disputeType: 'wallet'})}
                  >
                    Wallet
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                  placeholder="Brief Description of your issue"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                  placeholder="Provide Detailed information about your issue"
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>Attachments</label>
                <div className="file-upload-area">
                  <div className="upload-box">
                    <p>Click to upload or drag and drop</p>
                    <p className="upload-subtext">Screenshots, receipts or supporting documents</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="file-input"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-upload-btn">
                      Choose Files
                    </label>
                  </div>
                  
                  {ticketForm.attachments.length > 0 && (
                    <div className="attachments-list">
                      {ticketForm.attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                          <span className="attachment-name">{file.name}</span>
                          <span className="attachment-size">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit Ticket
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setActiveTab('overview')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Support;