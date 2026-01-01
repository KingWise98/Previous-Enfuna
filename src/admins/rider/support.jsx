"use client";

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
      title: 'Payment not processed',
      description: 'Payment for order #1234 was declined but amount was deducted',
      status: 'Resolved',
      created: '2025-12-10',
      updated: '2025-12-12',
      type: 'DSP-003',
      category: 'payment'
    },
    {
      id: 4,
      title: 'Overcharged for trip',
      description: 'Charged $25 instead of estimated $18',
      status: 'Open',
      created: '2025-12-14',
      updated: '2025-12-14',
      type: 'DSP-004',
      category: 'trip'
    },
    {
      id: 5,
      title: 'Rider was late',
      description: 'Rider arrived 25 minutes later than scheduled',
      status: 'In Progress',
      created: '2025-12-14',
      updated: '2025-12-15',
      type: 'DSP-005',
      category: 'trip'
    },
    {
      id: 6,
      title: 'Package damaged',
      description: 'Received package with visible damage',
      status: 'Open',
      created: '2025-12-15',
      updated: '2025-12-15',
      type: 'DSP-006',
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return '#10b981';
      case 'in progress': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'trip': return '#3b82f6';
      case 'delivery': return '#8b5cf6';
      case 'payment': return '#10b981';
      case 'wallet': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const disputeStats = {
    total: allDisputes.length,
    active: allDisputes.filter(d => d.status !== 'Resolved').length,
    resolved: allDisputes.filter(d => d.status === 'Resolved').length,
    trip: allDisputes.filter(d => d.category === 'trip').length,
    delivery: allDisputes.filter(d => d.category === 'delivery').length,
    payment: allDisputes.filter(d => d.category === 'payment').length,
  };

  const recentDisputes = allDisputes.slice(0, 5);

  return (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="dashboard-title">SUPPORT AND DISPUTES</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              Manage customer support tickets and dispute resolutions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="share-btn" 
              style={{ background: '#f0f4ff', color: '#0033cc' }}
              onClick={() => setActiveTab('ticket')}
            >
              <span style={{ marginRight: '6px' }}>+</span> New Ticket
            </button>
            <button 
              className="share-btn" 
              onClick={() => setActiveTab('chat')}
            >
              <span style={{ marginRight: '6px' }}>💬</span> Live Chat
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats - Moved to top, improved design */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '8px' }}>Total Disputes</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{disputeStats.total}</div>
            <div style={{ fontSize: '12px', opacity: '0.8', marginTop: '4px' }}>This month</div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            📊
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Active</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>{disputeStats.active}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              {((disputeStats.active / disputeStats.total) * 100).toFixed(0)}% of total
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#ef4444'
          }}>
            ⚠️
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Resolved</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>{disputeStats.resolved}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              {((disputeStats.resolved / disputeStats.total) * 100).toFixed(0)}% resolution rate
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#10b981'
          }}>
            ✅
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Avg Response</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>4.2h</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Typically within 4 hours</div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#3b82f6'
          }}>
            ⏱️
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '24px' }}>
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📋 Overview
        </button>
        <button className={`tab-btn ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => setActiveTab('disputes')}>
          📄 All Disputes
        </button>
        <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          💬 Live Chat
        </button>
        <button className={`tab-btn ${activeTab === 'ticket' ? 'active' : ''}`} onClick={() => setActiveTab('ticket')}>
          📝 Submit Ticket
        </button>
      </div>

      {/* Main Content Area */}
      <div className="alerts-section" style={{ gap: '24px' }}>
        {/* Left Panel - Main Content */}
        <div className="referral-alerts" style={{ gridColumn: 'span 2' }}>
          {activeTab === 'overview' && (
            <div className="support-overview">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '24px',
                marginBottom: '24px'
              }}>
                {/* Support Overview - Improved UI */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>📊</span> Support Overview
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { type: 'trip', label: 'Trip Disputes', icon: '🚗', color: '#3b82f6' },
                      { type: 'delivery', label: 'Delivery Issues', icon: '📦', color: '#8b5cf6' },
                      { type: 'payment', label: 'Payment Issues', icon: '💳', color: '#10b981' },
                      { type: 'other', label: 'Other Issues', icon: '❓', color: '#6b7280' }
                    ].map((item) => {
                      const count = item.type === 'other' 
                        ? disputeStats.total - (disputeStats.trip + disputeStats.delivery + disputeStats.payment)
                        : disputeStats[item.type] || 0;
                      const activeCount = allDisputes.filter(d => d.category === item.type && d.status !== 'Resolved').length;
                      
                      return (
                        <div key={item.type} style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          borderRadius: '8px',
                          background: '#f9fafb',
                          transition: 'all 0.2s'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              background: `${item.color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              color: item.color
                            }}>
                              {item.icon}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', color: '#111827' }}>{item.label}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                {activeCount} active • {count} total
                              </div>
                            </div>
                          </div>
                          <div style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: `${item.color}15`,
                            color: item.color,
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Disputes - Improved UI */}
                <div style={{ 
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#111827',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>📋</span> Recent Disputes
                    </h3>
                    <button 
                      className="share-btn" 
                      style={{ 
                        fontSize: '12px', 
                        padding: '6px 12px',
                        background: '#f0f4ff',
                        color: '#0033cc'
                      }}
                      onClick={() => setActiveTab('disputes')}
                    >
                      View All
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentDisputes.map(dispute => (
                      <div key={dispute.id} style={{ 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        ':hover': {
                          borderColor: '#3b82f6',
                          boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
                        }
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <div style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: `${getCategoryColor(dispute.category)}15`,
                                color: getCategoryColor(dispute.category),
                                fontSize: '10px',
                                fontWeight: '500'
                              }}>
                                {dispute.category.toUpperCase()}
                              </div>
                              <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                                {dispute.type}
                              </span>
                            </div>
                            <div style={{ 
                              fontWeight: '600', 
                              color: '#111827',
                              marginBottom: '4px',
                              fontSize: '14px'
                            }}>
                              {dispute.title}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#6b7280',
                              lineHeight: '1.4',
                              marginBottom: '8px'
                            }}>
                              {dispute.description}
                            </div>
                          </div>
                          <div style={{ 
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            background: `${getStatusColor(dispute.status)}15`,
                            color: getStatusColor(dispute.status),
                            fontSize: '11px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}>
                            {dispute.status}
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '11px',
                          color: '#9ca3af',
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid #f3f4f6'
                        }}>
                          <div>
                            Created: <span style={{ color: '#111827', fontWeight: '500' }}>{dispute.created}</span>
                          </div>
                          <div>
                            Updated: <span style={{ color: '#111827', fontWeight: '500' }}>{dispute.updated}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats at bottom of overview */}
              <div style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📈</span> Performance Metrics
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Resolution Rate</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%',
                        background: `conic-gradient(#10b981 ${(disputeStats.resolved / disputeStats.total) * 100}%, #e5e7eb 0)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#10b981'
                        }}>
                          {((disputeStats.resolved / disputeStats.total) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                          {disputeStats.resolved}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Resolved disputes</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Avg. Resolution Time</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%',
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        color: '#3b82f6'
                      }}>
                        ⏱️
                      </div>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                          2.4 days
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Average time to resolve</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="all-disputes">
              <div className="alerts-title" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>All Disputes</h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                      Manage and track all customer disputes
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="share-btn"
                      onClick={() => setActiveTab('ticket')}
                      style={{ background: '#f0f4ff', color: '#0033cc' }}
                    >
                      <span style={{ marginRight: '6px' }}>+</span> New Ticket
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Search and Filter - Improved */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto auto',
                gap: '12px', 
                marginBottom: '24px',
                alignItems: 'center'
              }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search disputes by title, ID, or description..."
                    className="share-input"
                    style={{ 
                      paddingLeft: '40px',
                      width: '100%',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}>
                    🔍
                  </span>
                </div>
                
                <select className="filter-btn" style={{ 
                  width: 'auto',
                  padding: '10px 16px',
                  background: 'white',
                  border: '1px solid #e5e7eb'
                }}>
                  <option>All Categories</option>
                  <option>Trip</option>
                  <option>Delivery</option>
                  <option>Payment</option>
                </select>
                
                <select className="filter-btn" style={{ 
                  width: 'auto',
                  padding: '10px 16px',
                  background: 'white',
                  border: '1px solid #e5e7eb'
                }}>
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>

              {/* Disputes List - Improved */}
              <div style={{ 
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: '16px',
                  padding: '16px 20px',
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <div>Dispute Details</div>
                  <div>Category</div>
                  <div>Status</div>
                  <div>Created</div>
                  <div>Actions</div>
                </div>

                {/* Disputes List */}
                <div>
                  {allDisputes.map(dispute => (
                    <div key={dispute.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                      gap: '16px',
                      padding: '20px',
                      borderBottom: '1px solid #f3f4f6',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      ':hover': {
                        background: '#f9fafb'
                      }
                    }}>
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#111827',
                          marginBottom: '4px',
                          fontSize: '14px'
                        }}>
                          {dispute.title}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6b7280',
                          marginBottom: '8px',
                          lineHeight: '1.4'
                        }}>
                          {dispute.description}
                        </div>
                        <div style={{ fontSize: '11px', color: '#0033cc', fontWeight: '500' }}>
                          {dispute.type}
                        </div>
                      </div>
                      
                      <div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: `${getCategoryColor(dispute.category)}15`,
                          color: getCategoryColor(dispute.category),
                          fontSize: '11px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {dispute.category}
                        </span>
                      </div>
                      
                      <div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: `${getStatusColor(dispute.status)}15`,
                          color: getStatusColor(dispute.status),
                          fontSize: '11px',
                          fontWeight: '600',
                          display: 'inline-block'
                        }}>
                          {dispute.status}
                        </span>
                      </div>
                      
                      <div>
                        <div style={{ fontSize: '12px', color: '#111827', fontWeight: '500' }}>
                          {dispute.created}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                          {dispute.updated === dispute.created ? 'Today' : 'Updated: ' + dispute.updated}
                        </div>
                      </div>
                      
                      <div>
                        <button className="share-btn" style={{ 
                          fontSize: '11px', 
                          padding: '8px 16px',
                          background: '#f0f4ff',
                          color: '#0033cc',
                          border: 'none'
                        }}>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="live-chat" style={{ 
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="alerts-title" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>Live Support Chat</h2>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '13px', 
                      color: '#10b981',
                      marginTop: '4px'
                    }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#10b981', 
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }}></span>
                      Support Team Online • Typically responds within 4 minutes
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="share-btn" style={{ 
                      fontSize: '12px', 
                      padding: '8px 16px',
                      background: '#f0f4ff',
                      color: '#0033cc'
                    }}>
                      <span style={{ marginRight: '4px' }}>📎</span> Attach File
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages - Improved */}
              <div style={{ 
                flex: 1,
                overflowY: 'auto', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '16px',
                background: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {liveChatMessages.map(message => (
                  <div 
                    key={message.id} 
                    style={{ 
                      maxWidth: '85%',
                      alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{ 
                      background: message.sender === 'user' ? '#3b82f6' : 'white',
                      color: message.sender === 'user' ? 'white' : '#111827',
                      padding: '12px 16px',
                      borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      border: message.sender === 'support' ? '1px solid #e5e7eb' : 'none',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      boxShadow: message.sender === 'support' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : '0 2px 4px rgba(59, 130, 246, 0.2)'
                    }}>
                      {message.type === 'file' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: message.sender === 'user' ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                          }}>
                            📎
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{message.filename}</div>
                            <div style={{ 
                              fontSize: '11px', 
                              opacity: '0.7',
                              color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
                            }}>
                              PDF Document • 245 KB
                            </div>
                          </div>
                        </div>
                      ) : (
                        message.text
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#9ca3af',
                      textAlign: message.sender === 'user' ? 'right' : 'left',
                      marginTop: '4px',
                      padding: '0 8px'
                    }}>
                      {message.sender === 'support' ? 'Support Agent' : 'You'} • {message.time}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input - Improved */}
              <div style={{ 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                background: 'white'
              }}>
                <button style={{
                  padding: '0 16px',
                  height: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '16px',
                  cursor: 'pointer',
                  ':hover': {
                    color: '#3b82f6'
                  }
                }}>
                  😊
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message here..."
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    '::placeholder': {
                      color: '#9ca3af'
                    }
                  }}
                />
                <button 
                  onClick={handleSendMessage} 
                  style={{
                    padding: '0 24px',
                    height: '100%',
                    background: '#3b82f6',
                    border: 'none',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    ':hover': {
                      background: '#2563eb'
                    }
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ticket' && (
            <div className="submit-ticket" style={{ 
              background: 'white',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div className="alerts-title" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>Submit New Ticket</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  Fill out the form below to submit a new support ticket
                </p>
              </div>
              
              <form onSubmit={handleSubmitTicket} style={{ marginTop: '16px' }}>
                {/* Dispute Type Selection */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                    Select Issue Type
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px'
                  }}>
                    {[
                      { type: 'trip', label: 'Trip Issues', icon: '🚗', color: '#3b82f6' },
                      { type: 'delivery', label: 'Delivery', icon: '📦', color: '#8b5cf6' },
                      { type: 'payment', label: 'Payments', icon: '💳', color: '#10b981' },
                      { type: 'wallet', label: 'Wallet', icon: '💰', color: '#f59e0b' }
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        style={{
                          cursor: 'pointer',
                          textAlign: 'center',
                          padding: '20px 12px',
                          borderRadius: '8px',
                          border: `2px solid ${ticketForm.disputeType === item.type ? item.color : '#e5e7eb'}`,
                          background: ticketForm.disputeType === item.type ? `${item.color}10` : 'white',
                          transition: 'all 0.2s',
                          ':hover': {
                            borderColor: item.color,
                            background: `${item.color}10`
                          }
                        }}
                        onClick={() => setTicketForm({...ticketForm, disputeType: item.type})}
                      >
                        <div style={{ 
                          fontSize: '24px', 
                          marginBottom: '8px',
                          color: ticketForm.disputeType === item.type ? item.color : '#6b7280'
                        }}>
                          {item.icon}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '500',
                          color: ticketForm.disputeType === item.type ? item.color : '#374151'
                        }}>
                          {item.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title Input */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '8px',
                    display: 'block' 
                  }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                    placeholder="Brief description of your issue"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: '#f9fafb',
                      transition: 'all 0.2s',
                      ':focus': {
                        outline: 'none',
                        borderColor: '#3b82f6',
                        background: 'white',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                      }
                    }}
                  />
                </div>

                {/* Description Input */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '8px',
                    display: 'block' 
                  }}>
                    Description
                  </label>
                  <textarea
                    style={{ 
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: '#f9fafb',
                      color: '#374151',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      minHeight: '120px',
                      resize: 'vertical',
                      transition: 'all 0.2s',
                      ':focus': {
                        outline: 'none',
                        borderColor: '#3b82f6',
                        background: 'white',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                      }
                    }}
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    placeholder="Provide detailed information about your issue. Include relevant order numbers, dates, and any other important details."
                    required
                  />
                </div>

                {/* Attachments */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '8px',
                    display: 'block' 
                  }}>
                    Attachments
                  </label>
                  <div style={{ 
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '32px 20px',
                    textAlign: 'center',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                      borderColor: '#3b82f6',
                      background: '#f0f9ff'
                    }
                  }}>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      id="ticket-file-upload"
                    />
                    <label htmlFor="ticket-file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%',
                        background: '#e0f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        fontSize: '24px',
                        color: '#0284c7'
                      }}>
                        📤
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                        Upload files
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                        Click to upload or drag and drop
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        PNG, JPG, PDF up to 10MB
                      </div>
                    </label>
                  </div>
                  
                  {ticketForm.attachments.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Attached Files ({ticketForm.attachments.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {ticketForm.attachments.map((file, index) => (
                          <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            padding: '12px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '6px',
                                background: '#e0f2fe',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                color: '#0284c7'
                              }}>
                                📎
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                                  {file.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                  {file.size} • {file.type.toUpperCase()}
                                </div>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                const newAttachments = [...ticketForm.attachments];
                                newAttachments.splice(index, 1);
                                setTicketForm({...ticketForm, attachments: newAttachments});
                              }}
                              style={{ 
                                background: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                ':hover': {
                                  background: '#fecaca'
                                }
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('overview')}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      ':hover': {
                        background: '#e5e7eb'
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      ':hover': {
                        background: '#2563eb'
                      }
                    }}
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Panel - Quick Actions & Stats */}
        <div className="milestone-section" style={{ 
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          height: 'fit-content'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚡</span> Quick Actions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              className="share-btn"
              onClick={() => setActiveTab('ticket')}
              style={{
                justifyContent: 'flex-start',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                background: '#3b82f6',
                color: 'white'
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '16px' }}>+</span> New Ticket
            </button>
            <button 
              className="share-btn" 
              style={{ 
                justifyContent: 'flex-start',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                background: '#f0f4ff', 
                color: '#0033cc' 
              }}
              onClick={() => setActiveTab('chat')}
            >
              <span style={{ marginRight: '10px', fontSize: '16px' }}>💬</span> Live Chat
            </button>
            <button 
              className="share-btn" 
              style={{ 
                justifyContent: 'flex-start',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                background: '#f0f4ff', 
                color: '#0033cc' 
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '16px' }}>❓</span> View FAQ
            </button>
            <button 
              className="share-btn" 
              style={{ 
                justifyContent: 'flex-start',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                background: '#f0f4ff', 
                color: '#0033cc' 
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '16px' }}>📞</span> Contact Support
            </button>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📊</span> Current Status
            </h3>
            
            <div style={{ 
              background: '#f8fafc',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Open Tickets</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#ef4444' }}>
                  {disputeStats.active}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>In Progress</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#f59e0b' }}>
                  {allDisputes.filter(d => d.status === 'In Progress').length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Awaiting Reply</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6' }}>
                  {allDisputes.filter(d => d.status === 'Open').length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Resolved Today</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>
                  {allDisputes.filter(d => d.status === 'Resolved' && d.updated === new Date().toISOString().split('T')[0]).length}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⏱️</span> Response Times
            </h3>
            
            <div style={{ 
              background: '#f8fafc',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average Response</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>4.2 hours</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average Resolution</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>2.4 days</div>
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                Based on last 30 days performance
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }

        .share-btn {
          transition: all 0.2s ease;
        }

        .share-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .tab-btn {
          transition: all 0.2s ease;
        }

        .tab-btn:hover:not(.active) {
          background: #f3f4f6;
        }

        @media (max-width: 1200px) {
          .alerts-section {
            grid-template-columns: 1fr;
          }
          
          .referral-alerts {
            grid-column: span 1;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .support-overview > div:first-child {
            grid-template-columns: 1fr;
          }

          .all-disputes table thead {
            display: none;
          }

          .all-disputes table tr {
            display: flex;
            flexDirection: column;
            padding: 16px;
            borderBottom: 1px solid #e5e7eb;
          }

          .all-disputes table td {
            display: flex;
            justifyContent: space-between;
            padding: 8px 0;
            border: none;
          }

          .all-disputes table td::before {
            content: attr(data-label);
            fontWeight: 600;
            color: #6b7280;
            marginRight: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Support;