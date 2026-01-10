"use client";

import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://127.0.0.1:8000/api/rider-disputes/";

const Support = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [liveChatMessages, setLiveChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ticketForm, setTicketForm] = useState({
    category: 'trip',
    title: '',
    description: '',
    attachments: [],
  });
  const [allDisputes, setAllDisputes] = useState([]);
  const [disputesOverview, setDisputesOverview] = useState(null);
  const [disputesSummary, setDisputesSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchDisputesData();
  }, []);

  const fetchDisputesData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDisputes(),
        fetchDisputesOverview(),
        fetchDisputesSummary()
      ]);
    } catch (error) {
      console.error('Error fetching disputes data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}list_disputes`);
      if (!response.ok) throw new Error('Failed to fetch disputes');
      const data = await response.json();
      setAllDisputes(data.disputes || data || []);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    }
  };

  const fetchDisputesOverview = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}over_view`);
      if (!response.ok) throw new Error('Failed to fetch disputes overview');
      const data = await response.json();
      setDisputesOverview(data);
    } catch (error) {
      console.error('Error fetching disputes overview:', error);
    }
  };

  const fetchDisputesSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}disputes_summary`);
      if (!response.ok) throw new Error('Failed to fetch disputes summary');
      const data = await response.json();
      setDisputesSummary(data);
    } catch (error) {
      console.error('Error fetching disputes summary:', error);
    }
  };

  const createTicket = async (ticketData) => {
    try {
      setSubmittingTicket(true);
      const formData = new FormData();
      
      formData.append('category', ticketData.category);
      formData.append('title', ticketData.title);
      formData.append('description', ticketData.description);
      
      if (ticketData.attachments && ticketData.attachments.length > 0) {
        ticketData.attachments.forEach((file, index) => {
          formData.append(`attachments`, file);
        });
      }

      const response = await fetch(`${API_BASE_URL}create_tickets`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to create ticket');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setSendingMessage(true);
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setLiveChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simulate API call to send message
      // In a real app, you would make an API call here
      setTimeout(() => {
        const supportReply = {
          id: Date.now() + 1,
          sender: 'support',
          text: 'Thanks for your message. Our support team will review your concern and get back to you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setLiveChatMessages(prev => [...prev, supportReply]);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type.split('/')[1] || 'file'
    }));
    setTicketForm({ ...ticketForm, attachments: [...ticketForm.attachments, ...newAttachments] });
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const ticketData = {
        category: ticketForm.category,
        title: ticketForm.title,
        description: ticketForm.description,
        attachments: ticketForm.attachments.map(att => att.file)
      };

      await createTicket(ticketData);
      
      // Refresh data
      fetchDisputesData();
      
      // Reset form
      setTicketForm({
        category: 'trip',
        title: '',
        description: '',
        attachments: [],
      });
      
      alert('Ticket submitted successfully!');
      setActiveTab('disputes');
    } catch (error) {
      alert('Failed to submit ticket. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'completed':
      case 'closed':
        return '#10b981';
      case 'in progress':
      case 'pending':
      case 'processing':
        return '#f59e0b';
      case 'open':
      case 'new':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return '#6b7280';
    switch (category.toLowerCase()) {
      case 'trip':
      case 'ride':
        return '#3b82f6';
      case 'delivery':
      case 'package':
        return '#8b5cf6';
      case 'payment':
      case 'billing':
        return '#10b981';
      case 'wallet':
      case 'account':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate stats from API data
  const disputeStats = disputesSummary || {
    total: allDisputes.length,
    active: allDisputes.filter(d => d.status && d.status.toLowerCase() !== 'resolved' && d.status.toLowerCase() !== 'closed').length,
    resolved: allDisputes.filter(d => d.status && (d.status.toLowerCase() === 'resolved' || d.status.toLowerCase() === 'closed')).length,
    trip: allDisputes.filter(d => d.category && d.category.toLowerCase() === 'trip').length,
    delivery: allDisputes.filter(d => d.category && d.category.toLowerCase() === 'delivery').length,
    payment: allDisputes.filter(d => d.category && d.category.toLowerCase() === 'payment').length,
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #002AFE',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <div style={{ color: '#666', fontSize: '16px' }}>Loading support data...</div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
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
                <div style={{ fontSize: '32px', fontWeight: '700' }}>{disputeStats.total || 0}</div>
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
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>{disputeStats.active || 0}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  {disputeStats.total ? ((disputeStats.active / disputeStats.total) * 100).toFixed(0) : 0}% of total
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
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>{disputeStats.resolved || 0}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  {disputeStats.total ? ((disputeStats.resolved / disputeStats.total) * 100).toFixed(0) : 0}% resolution rate
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
                    {/* Support Overview */}
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
                          const count = allDisputes.filter(d => 
                            d.category && d.category.toLowerCase() === item.type
                          ).length;
                          const activeCount = allDisputes.filter(d => 
                            d.category && d.category.toLowerCase() === item.type && 
                            d.status && d.status.toLowerCase() !== 'resolved' && d.status.toLowerCase() !== 'closed'
                          ).length;
                          
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

                    {/* Recent Disputes */}
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
                        {recentDisputes.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                            No disputes found
                          </div>
                        ) : (
                          recentDisputes.map(dispute => (
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
                                      {(dispute.category || 'other').toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                                      {dispute.ticket_id || dispute.id}
                                    </span>
                                  </div>
                                  <div style={{ 
                                    fontWeight: '600', 
                                    color: '#111827',
                                    marginBottom: '4px',
                                    fontSize: '14px'
                                  }}>
                                    {dispute.title || 'No title'}
                                  </div>
                                  <div style={{ 
                                    fontSize: '12px', 
                                    color: '#6b7280',
                                    lineHeight: '1.4',
                                    marginBottom: '8px'
                                  }}>
                                    {dispute.description?.substring(0, 100) || 'No description'}...
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
                                  {dispute.status || 'Unknown'}
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
                                  Created: <span style={{ color: '#111827', fontWeight: '500' }}>
                                    {formatDate(dispute.created_at)}
                                  </span>
                                </div>
                                <div>
                                  Updated: <span style={{ color: '#111827', fontWeight: '500' }}>
                                    {formatDate(dispute.updated_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
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
                            background: disputeStats.total ? 
                              `conic-gradient(#10b981 ${(disputeStats.resolved / disputeStats.total) * 100}%, #e5e7eb 0)` :
                              `conic-gradient(#e5e7eb 100%)`,
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
                              {disputeStats.total ? ((disputeStats.resolved / disputeStats.total) * 100).toFixed(0) : 0}%
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                              {disputeStats.resolved || 0}
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
                              {disputesOverview?.avg_resolution_time || '2.4 days'}
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
                  
                  {/* Search and Filter */}
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

                  {/* Disputes List */}
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
                      {allDisputes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                          No disputes found
                        </div>
                      ) : (
                        allDisputes.map(dispute => (
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
                                {dispute.title || 'No title'}
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: '#6b7280',
                                marginBottom: '8px',
                                lineHeight: '1.4'
                              }}>
                                {dispute.description?.substring(0, 150) || 'No description'}...
                              </div>
                              <div style={{ fontSize: '11px', color: '#0033cc', fontWeight: '500' }}>
                                {dispute.ticket_id || dispute.id}
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
                                {dispute.category || 'other'}
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
                                {dispute.status || 'Unknown'}
                              </span>
                            </div>
                            
                            <div>
                              <div style={{ fontSize: '12px', color: '#111827', fontWeight: '500' }}>
                                {formatDate(dispute.created_at)}
                              </div>
                              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                                {formatTime(dispute.created_at)}
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
                        ))
                      )}
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

                  {/* Chat Messages */}
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
                    {liveChatMessages.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        No messages yet. Start a conversation!
                      </div>
                    ) : (
                      liveChatMessages.map(message => (
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
                            {message.text}
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
                      ))
                    )}
                  </div>

                  {/* Message Input */}
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
                      disabled={sendingMessage}
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                      style={{
                        padding: '0 24px',
                        height: '100%',
                        background: sendingMessage ? '#93c5fd' : '#3b82f6',
                        border: 'none',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: sendingMessage ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                        ':hover': {
                          background: sendingMessage ? '#93c5fd' : '#2563eb'
                        }
                      }}
                    >
                      {sendingMessage ? 'Sending...' : 'Send'}
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
                    {/* Category Selection */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                        Select Issue Type *
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
                          { type: 'other', label: 'Other', icon: '❓', color: '#f59e0b' }
                        ].map((item) => (
                          <button
                            key={item.type}
                            type="button"
                            style={{
                              cursor: 'pointer',
                              textAlign: 'center',
                              padding: '20px 12px',
                              borderRadius: '8px',
                              border: `2px solid ${ticketForm.category === item.type ? item.color : '#e5e7eb'}`,
                              background: ticketForm.category === item.type ? `${item.color}10` : 'white',
                              transition: 'all 0.2s',
                              ':hover': {
                                borderColor: item.color,
                                background: `${item.color}10`
                              }
                            }}
                            onClick={() => setTicketForm({...ticketForm, category: item.type})}
                          >
                            <div style={{ 
                              fontSize: '24px', 
                              marginBottom: '8px',
                              color: ticketForm.category === item.type ? item.color : '#6b7280'
                            }}>
                              {item.icon}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              fontWeight: '500',
                              color: ticketForm.category === item.type ? item.color : '#374151'
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
                        Title *
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
                        Description *
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
                        Attachments (Optional)
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
                          disabled={submittingTicket}
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
                        disabled={submittingTicket}
                        style={{
                          flex: 1,
                          padding: '12px 24px',
                          background: submittingTicket ? '#93c5fd' : '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: submittingTicket ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          ':hover': {
                            background: submittingTicket ? '#93c5fd' : '#2563eb'
                          }
                        }}
                      >
                        {submittingTicket ? 'Submitting...' : 'Submit Ticket'}
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
                      {allDisputes.filter(d => d.status && d.status.toLowerCase() === 'open').length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>In Progress</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#f59e0b' }}>
                      {allDisputes.filter(d => d.status && d.status.toLowerCase() === 'in progress').length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Awaiting Reply</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6' }}>
                      {allDisputes.filter(d => d.status && d.status.toLowerCase() === 'pending').length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Resolved Today</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>
                      {allDisputes.filter(d => 
                        d.status && d.status.toLowerCase() === 'resolved' && 
                        d.updated_at && new Date(d.updated_at).toDateString() === new Date().toDateString()
                      ).length}
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
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                      {disputesOverview?.avg_response_time || '4.2 hours'}
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average Resolution</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                      {disputesOverview?.avg_resolution_time || '2.4 days'}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                    Based on last 30 days performance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
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