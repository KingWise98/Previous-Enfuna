"use client"

import React, { useState, useEffect } from 'react';

// API Service Module
const groupAPI = {
  // Base URL for all endpoints
  baseURL: 'http://127.0.0.1:8000/api/rider-groups',

  // Helper function for API calls
  async fetchAPI(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  },

  // List all available groups
  async listGroups() {
    return await this.fetchAPI('/list-groups');
  },

  // Create a new group
  async createGroup(groupData) {
    return await this.fetchAPI('/create-groups', {
      method: 'POST',
      body: JSON.stringify(groupData)
    });
  },

  // Delete a group
  async deleteGroup(groupId) {
    return await this.fetchAPI(`/delete-groups/${groupId}`, {
      method: 'DELETE'
    });
  },

  // Edit a group
  async editGroup(groupId, updates) {
    return await this.fetchAPI(`/edit-group/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  // Join a group
  async joinGroup(groupId) {
    return await this.fetchAPI(`/join_group/${groupId}`, {
      method: 'POST'
    });
  },

  // Get user's joined groups
  async getJoinedGroups() {
    return await this.fetchAPI('/joined_groups');
  },

  // Get group analytics
  async getGroupAnalytics() {
    return await this.fetchAPI('/group_analytics');
  },

  // Get all owner group summary
  async getAllOwnerGroupSummary() {
    return await this.fetchAPI('/all_owner_group_summary');
  },

  // Get group updates
  async listUpdates() {
    return await this.fetchAPI('/list-updates');
  },

  // Make contribution (you'll need to create this endpoint)
  async makeContribution(groupId, amount) {
    // This is a placeholder - you'll need to create this endpoint
    return await this.fetchAPI(`/make-contribution/${groupId}`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }
};

const Groups = () => {
  const [activeTab, setActiveTab] = useState('myGroups');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedGroupForContribution, setSelectedGroupForContribution] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [createStep, setCreateStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    myGroups: false,
    availableGroups: false,
    contributions: false,
    analytics: false
  });
  
  // Data states - initialize as empty arrays
  const [myGroups, setMyGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [groupUpdates, setGroupUpdates] = useState([]);

  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'savings',
    maxMembers: 12,
    targetAmount: '',
    isPublic: true,
    contributionAmount: '',
    frequency: 'weekly',
    rules: '',
    adminFee: 0
  });

  // Stats state
  const [stats, setStats] = useState({
    activeGroups: 0,
    totalContributions: 0,
    totalMembers: 0,
    totalPool: 0
  });

  // Toast notification function
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch data based on active tab
  useEffect(() => {
    fetchDataForActiveTab();
  }, [activeTab]);

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch initial data when component mounts
  const fetchInitialData = async () => {
    try {
      // Fetch joined groups immediately
      await fetchMyGroups();
      
      // Fetch other data in background
      fetchAvailableGroups();
      fetchGroupUpdates();
      fetchAnalytics();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  // Fetch data based on active tab
  const fetchDataForActiveTab = async () => {
    switch (activeTab) {
      case 'myGroups':
        await fetchMyGroups();
        break;
      case 'allGroups':
        await fetchAvailableGroups();
        break;
      case 'contributions':
        await fetchContributions();
        break;
      case 'analytics':
        await fetchAnalytics();
        break;
    }
  };

  // Fetch user's joined groups
  const fetchMyGroups = async () => {
    setIsLoading(prev => ({ ...prev, myGroups: true }));
    try {
      const data = await groupAPI.getJoinedGroups();
      
      // IMPORTANT: Adjust this mapping based on your actual API response structure
      const formattedGroups = Array.isArray(data) ? data.map(group => ({
        id: group.id || group.group_id,
        name: group.name || group.group_name,
        description: group.description || '',
        type: group.type || 'savings',
        members: group.members || group.current_members || 0,
        maxMembers: group.max_members || group.maxMembers || 12,
        contribution: group.contribution_amount || group.contribution || 0,
        totalPool: group.total_pool || group.totalPool || 0,
        frequency: group.frequency || 'Weekly',
        progress: calculateProgress(group),
        nextContribution: group.next_contribution || '7 days',
        isOwner: group.is_owner || false
      })) : [];
      
      setMyGroups(formattedGroups);
      
      // Update stats
      updateStats(formattedGroups);
    } catch (error) {
      console.error('Error fetching joined groups:', error);
      showNotification('Failed to load your groups', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, myGroups: false }));
    }
  };

  // Calculate group progress
  const calculateProgress = (group) => {
    if (group.max_members && group.current_members) {
      return (group.current_members / group.max_members) * 100;
    }
    if (group.maxMembers && group.members) {
      return (group.members / group.maxMembers) * 100;
    }
    if (group.targetAmount && group.totalPool) {
      return (group.totalPool / group.targetAmount) * 100;
    }
    return 50; // Default
  };

  // Update stats based on groups data
  const updateStats = (groups) => {
    const newStats = {
      activeGroups: groups.length,
      totalContributions: groups.reduce((sum, group) => sum + (group.contribution || 0), 0),
      totalMembers: groups.reduce((sum, group) => sum + (group.members || 0), 0),
      totalPool: groups.reduce((sum, group) => sum + (group.totalPool || 0), 0)
    };
    setStats(newStats);
  };

  // Fetch available groups
  const fetchAvailableGroups = async () => {
    setIsLoading(prev => ({ ...prev, availableGroups: true }));
    try {
      const data = await groupAPI.listGroups();
      
      // Get joined groups to check membership
      const joinedGroups = await groupAPI.getJoinedGroups();
      const joinedGroupIds = Array.isArray(joinedGroups) ? joinedGroups.map(g => g.id || g.group_id) : [];
      
      // Format groups data
      const formattedGroups = Array.isArray(data) ? data.map(group => ({
        id: group.id || group.group_id,
        name: group.name || group.group_name,
        type: group.type || 'savings',
        description: group.description || '',
        members: group.members || group.current_members || 0,
        maxMembers: group.max_members || group.maxMembers || 12,
        contribution: group.contribution_amount || group.contribution || 0,
        frequency: group.frequency || 'Weekly',
        isMember: joinedGroupIds.includes(group.id || group.group_id),
        isPublic: group.is_public !== false,
        rules: group.rules || '',
        adminFee: group.admin_fee || 0
      })) : [];
      
      setAvailableGroups(formattedGroups);
    } catch (error) {
      console.error('Error fetching available groups:', error);
      showNotification('Failed to load available groups', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, availableGroups: false }));
    }
  };

  // Fetch contributions
  const fetchContributions = async () => {
    setIsLoading(prev => ({ ...prev, contributions: true }));
    try {
      // If you have a contributions endpoint, use it here
      // For now, we'll simulate from group data
      const myGroupsData = await groupAPI.getJoinedGroups();
      
      // Create contributions from group data
      const simulatedContributions = Array.isArray(myGroupsData) ? myGroupsData.flatMap(group => {
        const contributions = [];
        // Simulate some contributions based on group data
        if (group.contribution_amount) {
          contributions.push({
            id: `${group.id}_1`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            group: group.name || group.group_name,
            amount: group.contribution_amount,
            status: 'Completed',
            type: (group.type || 'Savings').charAt(0).toUpperCase() + (group.type || 'Savings').slice(1),
            receipt: {
              id: `REC${Date.now()}_${group.id}`,
              date: new Date().toLocaleString(),
              groupName: group.name || group.group_name,
              groupType: group.type || 'savings',
              amount: group.contribution_amount,
              reference: `CONT${Date.now()}`,
              transactionId: `TXN${Date.now()}`,
              status: 'Completed',
              memberId: 'RIDER001', // Replace with actual user ID
              memberName: 'John Doe' // Replace with actual user name
            }
          });
        }
        return contributions;
      }) : [];
      
      setContributions(simulatedContributions);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      showNotification('Failed to load contributions', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, contributions: false }));
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    setIsLoading(prev => ({ ...prev, analytics: true }));
    try {
      const data = await groupAPI.getGroupAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showNotification('Failed to load analytics', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, analytics: false }));
    }
  };

  // Fetch group updates
  const fetchGroupUpdates = async () => {
    try {
      const data = await groupAPI.listUpdates();
      setGroupUpdates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching group updates:', error);
    }
  };

  // Handle joining a group
  const handleJoinGroup = async (groupId) => {
    try {
      const result = await groupAPI.joinGroup(groupId);
      
      if (result.success || result.message) {
        // Update available groups list
        setAvailableGroups(prev => prev.map(group => 
          group.id === groupId ? { ...group, isMember: true, members: group.members + 1 } : group
        ));
        
        // Refresh my groups
        await fetchMyGroups();
        
        // Refresh available groups to update member counts
        await fetchAvailableGroups();
        
        showNotification(`Successfully joined group`);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      showNotification('Failed to join group', 'error');
    }
  };

  // Generate receipt
  const generateReceipt = (group, amount) => {
    const receiptId = `REC${Date.now()}`;
    const timestamp = new Date().toLocaleString();
    
    return {
      id: receiptId,
      date: timestamp,
      groupName: group.name,
      groupType: group.type,
      amount: amount,
      reference: `CONT${Date.now()}`,
      transactionId: `TXN${Date.now()}`,
      status: 'Completed',
      memberId: 'RIDER001', // Replace with actual user ID
      memberName: 'John Doe' // Replace with actual user name
    };
  };

  // Handle contribute button click
  const handleContribute = (group) => {
    if (!group) return;
    
    const groupData = myGroups.find(g => g.id === group.id) || availableGroups.find(g => g.id === group.id);
    if (!groupData) return;
    
    setSelectedGroupForContribution(groupData);
    setShowContributionModal(true);
  };

  // Confirm contribution
  const confirmContribution = async () => {
    if (!selectedGroupForContribution) return;

    try {
      // Call your contribution API endpoint
      // const result = await groupAPI.makeContribution(
      //   selectedGroupForContribution.id, 
      //   selectedGroupForContribution.contribution
      // );
      
      // For now, simulate successful contribution
      const receipt = generateReceipt(selectedGroupForContribution, selectedGroupForContribution.contribution);
      
      // Add to contributions history
      const newContribution = {
        id: contributions.length + 1,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        group: selectedGroupForContribution.name,
        amount: selectedGroupForContribution.contribution,
        status: 'Completed',
        type: selectedGroupForContribution.type.charAt(0).toUpperCase() + selectedGroupForContribution.type.slice(1),
        receipt: receipt
      };
      
      setContributions(prev => [newContribution, ...prev]);
      
      // Update group total pool
      setMyGroups(prev => prev.map(group => {
        if (group.id === selectedGroupForContribution.id) {
          return {
            ...group,
            totalPool: group.totalPool + group.contribution,
            nextContribution: group.frequency === 'Weekly' ? '7 days' : 
                            group.frequency === 'Monthly' ? '30 days' : '14 days'
          };
        }
        return group;
      }));
      
      // Show receipt modal
      setCurrentReceipt(receipt);
      setShowContributionModal(false);
      setShowReceipt(true);
      
      // Show success notification
      showNotification(`Contribution of UGX ${selectedGroupForContribution.contribution.toLocaleString()} successful to ${selectedGroupForContribution.name}`);
      
    } catch (error) {
      console.error('Error making contribution:', error);
      showNotification('Failed to make contribution', 'error');
    } finally {
      setSelectedGroupForContribution(null);
    }
  };

  // Handle creating a new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (createStep < 3) {
      setCreateStep(createStep + 1);
      return;
    }

    try {
      // Prepare data for API
      const groupData = {
        name: newGroup.name,
        description: newGroup.description,
        type: newGroup.type,
        max_members: parseInt(newGroup.maxMembers),
        target_amount: newGroup.targetAmount ? parseInt(newGroup.targetAmount) : null,
        is_public: newGroup.isPublic,
        contribution_amount: parseInt(newGroup.contributionAmount) || 0,
        frequency: newGroup.frequency,
        rules: newGroup.rules,
        admin_fee: parseFloat(newGroup.adminFee) || 0
      };

      const result = await groupAPI.createGroup(groupData);
      
      if (result.success || result.id) {
        // Refresh data
        await Promise.all([
          fetchMyGroups(),
          fetchAvailableGroups()
        ]);
        
        // Reset form
        setShowCreateGroup(false);
        setCreateStep(1);
        setNewGroup({
          name: '',
          description: '',
          type: 'savings',
          maxMembers: 12,
          targetAmount: '',
          isPublic: true,
          contributionAmount: '',
          frequency: 'weekly',
          rules: '',
          adminFee: 0
        });
        
        showNotification(`Group "${newGroup.name}" created successfully!`);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      showNotification('Failed to create group', 'error');
    }
  };

  // Handle view receipt
  const handleViewReceipt = (receipt) => {
    setCurrentReceipt(receipt);
    setShowReceipt(true);
  };

  // Handle download receipt
  const handleDownloadReceipt = () => {
    if (!currentReceipt) return;
    
    const receiptContent = `
      GROUP CONTRIBUTION RECEIPT
      =========================
      
      Receipt ID: ${currentReceipt.id}
      Date: ${currentReceipt.date}
      
      Group: ${currentReceipt.groupName}
      Type: ${currentReceipt.groupType}
      
      Amount: UGX ${currentReceipt.amount.toLocaleString()}
      Reference: ${currentReceipt.reference}
      Transaction ID: ${currentReceipt.transactionId}
      
      Member: ${currentReceipt.memberName}
      Member ID: ${currentReceipt.memberId}
      
      Status: ${currentReceipt.status}
      
      Thank you for your contribution!
      =========================
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${currentReceipt.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Receipt downloaded successfully');
  };

  // Filter groups based on search and filter
  const filteredGroups = availableGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = groupFilter === 'all' || 
                         (groupFilter === 'public' && group.isPublic) ||
                         (groupFilter === 'private' && !group.isPublic);
    return matchesSearch && matchesFilter;
  });

  // Helper functions for styling
  const getContributionColor = (type) => {
    switch((type || '').toLowerCase()) {
      case 'savings': return '#0033cc';
      case 'emergency': return '#c62828';
      case 'spares': return '#2e7d32';
      default: return '#666';
    }
  };

  const getGroupTypeColor = (type) => {
    switch((type || '').toLowerCase()) {
      case 'savings': return '#0033cc';
      case 'emergency': return '#c62828';
      case 'spares': return '#2e7d32';
      default: return '#666';
    }
  };

  const getGroupTypeBgColor = (type) => {
    switch((type || '').toLowerCase()) {
      case 'savings': return '#e3f2fd';
      case 'emergency': return '#ffebee';
      case 'spares': return '#e8f5e9';
      default: return '#f8f9fa';
    }
  };

  // Quick action handlers
  const handleQuickContribute = () => {
    if (myGroups.length > 0) {
      setShowContributionModal(true);
    } else {
      showNotification('No groups available for contribution', 'warning');
    }
  };

  const handleQuickWithdraw = () => {
    showNotification('Withdrawal request submitted for review');
  };

  const handleQuickInvite = () => {
    showNotification('Invitation link copied to clipboard');
  };

  const handleSelectGroupForContribution = (group) => {
    setSelectedGroupForContribution(group);
    setShowContributionModal(true);
  };

  // Loading component
  const LoadingSpinner = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '40px',
      color: '#0033cc'
    }}>
      <div>Loading...</div>
    </div>
  );

  // Empty state component
  const EmptyState = ({ message, action }) => (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px',
      background: '#f8f9fa',
      borderRadius: '8px',
      marginTop: '16px'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
      <div style={{ color: '#666', marginBottom: '16px' }}>{message}</div>
      {action && (
        <button 
          className="activate-code-btn"
          onClick={action}
        >
          Create Your First Group
        </button>
      )}
    </div>
  );

  return (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">GROUP FUNDING AND EARNINGS</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'myGroups' ? 'active' : ''}`} onClick={() => setActiveTab('myGroups')}>
          My Groups
        </button>
        <button className={`tab-btn ${activeTab === 'allGroups' ? 'active' : ''}`} onClick={() => setActiveTab('allGroups')}>
          All Groups
        </button>
        <button className={`tab-btn ${activeTab === 'contributions' ? 'active' : ''}`} onClick={() => setActiveTab('contributions')}>
          Contributions
        </button>
        <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          Analytics
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Active Groups</div>
          <p className="stat-value">{stats.activeGroups}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Pool</div>
          <p className="stat-value">UGX {stats.totalPool.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Members</div>
          <p className="stat-value">{stats.totalMembers}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="alerts-section">
        {/* Left Panel - Main Content */}
        <div className="referral-alerts" style={{ gridColumn: 'span 2' }}>
          {isLoading.myGroups && activeTab === 'myGroups' && <LoadingSpinner />}
          {isLoading.availableGroups && activeTab === 'allGroups' && <LoadingSpinner />}
          {isLoading.contributions && activeTab === 'contributions' && <LoadingSpinner />}
          {isLoading.analytics && activeTab === 'analytics' && <LoadingSpinner />}

          {activeTab === 'myGroups' && !isLoading.myGroups && (
            <div className="my-groups-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="alerts-title">My Groups</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="share-btn" 
                    style={{ background: '#f0f4ff', color: '#0033cc' }}
                    onClick={() => setActiveTab('allGroups')}
                  >
                    Join Group
                  </button>
                  <button 
                    className="share-btn" 
                    onClick={() => setShowCreateGroup(true)}
                  >
                    + Create Group
                  </button>
                </div>
              </div>

              {myGroups.length === 0 ? (
                <EmptyState 
                  message="You haven't joined any groups yet"
                  action={() => setActiveTab('allGroups')}
                />
              ) : (
                <div className="team-list">
                  {myGroups.map(group => (
                    <div key={group.id} className="team-member-card">
                      <div className="member-header">
                        <div className="member-info">
                          <div>
                            <p className="member-name">{group.name}</p>
                            <p style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{group.description}</p>
                          </div>
                          <span className="status-badge active" style={{ background: getGroupTypeColor(group.type) }}>
                            {group.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="member-stats-preview">
                          <div className="stat-preview">
                            <div className="preview-label">Members</div>
                            <div className="preview-value">{group.members}/{group.maxMembers}</div>
                          </div>
                          <div className="stat-preview">
                            <div className="preview-label">Contribution</div>
                            <div className="preview-value">UGX {group.contribution.toLocaleString()}</div>
                          </div>
                          <div className="stat-preview">
                            <div className="preview-label">Next Due</div>
                            <div className="preview-value" style={{ color: '#f59e0b' }}>{group.nextContribution}</div>
                          </div>
                        </div>
                        <button className="expand-btn">▼</button>
                      </div>
                      
                      <div className="member-details">
                        <div className="detail-row">
                          <span className="detail-label">Progress</span>
                          <div style={{ flex: 1, maxWidth: '200px' }}>
                            <div style={{ 
                              height: '6px', 
                              background: '#f0f4ff',
                              borderRadius: '3px',
                              overflow: 'hidden',
                              marginBottom: '4px'
                            }}>
                              <div style={{ 
                                width: `${group.progress}%`,
                                height: '100%',
                                background: getGroupTypeColor(group.type)
                              }}></div>
                            </div>
                            <div style={{ fontSize: '11px', color: getGroupTypeColor(group.type), textAlign: 'right' }}>
                              {group.progress.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Total Pool</span>
                          <span className="detail-value">UGX {group.totalPool.toLocaleString()}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Frequency</span>
                          <span className="detail-value">{group.frequency}</span>
                        </div>
                        
                        <div className="detail-row highlight">
                          <button 
                            className="activate-code-btn"
                            onClick={() => handleContribute(group)}
                            style={{ width: '100%' }}
                          >
                            Make Contribution
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'allGroups' && !isLoading.availableGroups && (
            <div className="all-groups-view">
              <div style={{ marginBottom: '16px' }}>
                <div className="alerts-title">Available Groups</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <input
                    type="text"
                    placeholder="Search groups..."
                    className="share-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <select 
                    className="filter-btn"
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="all">All Types</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              {availableGroups.length === 0 ? (
                <EmptyState 
                  message="No groups available to join"
                  action={() => setShowCreateGroup(true)}
                />
              ) : (
                <div className="commission-overview">
                  <div className="commission-grid">
                    {filteredGroups.map(group => (
                      <div key={group.id} className={`commission-card ${group.isMember ? 'revenue' : 'today'}`}>
                        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                          <div style={{ 
                            fontSize: '24px', 
                            marginBottom: '8px',
                            color: getGroupTypeColor(group.type)
                          }}>
                            {group.type === 'savings' ? '💰' : 
                             group.type === 'emergency' ? '🛡️' : '🔧'}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0033cc' }}>
                            {group.name}
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '8px' }}>
                          <p style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                            {group.description}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#0033cc' }}>
                            <span>Members: {group.members}/{group.maxMembers}</span>
                            <span className={`status-badge ${group.isPublic ? 'valid' : 'pending'}`}>
                              {group.isPublic ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Contribution</span>
                          <span className="detail-value">UGX {group.contribution.toLocaleString()}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Frequency</span>
                          <span className="detail-value">{group.frequency}</span>
                        </div>
                        
                        {group.isMember ? (
                          <div className="detail-row highlight">
                            <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: '500' }}>
                              ✓ Already a Member
                            </span>
                          </div>
                        ) : (
                          <button 
                            className="activate-code-btn"
                            onClick={() => handleJoinGroup(group.id)}
                            style={{ width: '100%', marginTop: '8px' }}
                          >
                            Join Group
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contributions' && !isLoading.contributions && (
            <div className="contributions-view">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="alerts-title">Contribution History</div>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#0033cc',
                  background: '#e3f2fd',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #bbdefb'
                }}>
                  Total: UGX {contributions.reduce((sum, c) => sum + (c.amount || 0), 0).toLocaleString()}
                </span>
              </div>

              {contributions.length === 0 ? (
                <EmptyState 
                  message="No contributions yet"
                  action={handleQuickContribute}
                />
              ) : (
                <div className="ledger-entry" style={{ marginBottom: '8px' }}>
                  {contributions.map(contribution => (
                    <div key={contribution.id} className="alert-item" style={{ marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div className="alert-type">{contribution.group}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', color: '#666' }}>{contribution.date}</span>
                          <span className="status-badge" style={{ 
                            background: getContributionColor(contribution.type),
                            color: 'white',
                            fontSize: '10px'
                          }}>
                            {contribution.type}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#0033cc',
                          marginBottom: '2px'
                        }}>
                          UGX {contribution.amount.toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`status-badge ${contribution.status === 'Completed' ? 'valid' : 'pending'}`}>
                            {contribution.status}
                          </span>
                          {contribution.receipt ? (
                            <button 
                              className="share-btn"
                              onClick={() => handleViewReceipt(contribution.receipt)}
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                              View Receipt
                            </button>
                          ) : (
                            <span style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && !isLoading.analytics && (
            <div className="analytics-view">
              <div className="alerts-title">Group Analytics</div>
              
              {myGroups.length === 0 ? (
                <EmptyState 
                  message="Join groups to see analytics"
                  action={() => setActiveTab('allGroups')}
                />
              ) : (
                <div className="commission-overview" style={{ marginTop: '16px' }}>
                  <div className="commission-grid">
                    {myGroups.map(group => (
                      <div key={group.id} className="commission-card revenue">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0033cc' }}>
                            {group.name}
                          </div>
                          <span style={{ 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            color: '#0033cc',
                            background: '#f0f4ff',
                            padding: '2px 8px',
                            borderRadius: '10px'
                          }}>
                            {group.progress.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ 
                            height: '6px', 
                            background: '#f0f4ff',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${group.progress}%`,
                              height: '100%',
                              background: '#0033cc'
                            }}></div>
                          </div>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Members</span>
                          <span className="detail-value">{group.members}/{group.maxMembers}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Total Pool</span>
                          <span className="detail-value">UGX {group.totalPool.toLocaleString()}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Next Due</span>
                          <span className="detail-value" style={{ color: '#f59e0b' }}>{group.nextContribution}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Frequency</span>
                          <span className="detail-value">{group.frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Quick Actions & Stats */}
        <div className="milestone-section">
          <div className="alerts-title">Quick Actions</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <button className="activate-code-btn" onClick={handleQuickContribute}>
              Make Contribution
            </button>
            <button 
              className="activate-code-btn" 
              style={{ background: '#f0f4ff', color: '#0033cc' }}
              onClick={handleQuickWithdraw}
            >
              Request Withdrawal
            </button>
            <button 
              className="activate-code-btn" 
              style={{ background: '#f0f4ff', color: '#0033cc' }}
              onClick={handleQuickInvite}
            >
              Invite Riders
            </button>
            <button 
              className="activate-code-btn" 
              style={{ background: '#fef08a', color: 'black' }}
              onClick={() => setShowCreateGroup(true)}
            >
              Create Group
            </button>
          </div>

          <div className="alerts-title">Group Benefits</div>
          
          <div style={{ marginTop: '8px' }}>
            <div className="milestone-card">
              <div className="milestone-title">Collective Security</div>
              <div className="milestone-text">
                Emergency group support and financial safety net for members
              </div>
            </div>
            
            <div className="milestone-card">
              <div className="milestone-title">Better Loan Rates</div>
              <div className="milestone-text">
                Group negotiation power for favorable terms and lower interest rates
              </div>
            </div>
            
            <div className="milestone-card">
              <div className="milestone-title">Group Rewards</div>
              <div className="milestone-text">
                Collective achievement bonuses and member incentives
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>CREATE NEW GROUP</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowCreateGroup(false);
                  setCreateStep(1);
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Step Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: createStep >= 1 ? '#0033cc' : '#f0f4ff',
                  color: createStep >= 1 ? 'white' : '#0033cc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  1
                </div>
                <div style={{ width: '40px', height: '2px', background: createStep >= 2 ? '#0033cc' : '#f0f4ff' }}></div>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: createStep >= 2 ? '#0033cc' : '#f0f4ff',
                  color: createStep >= 2 ? 'white' : '#0033cc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  2
                </div>
                <div style={{ width: '40px', height: '2px', background: createStep >= 3 ? '#0033cc' : '#f0f4ff' }}></div>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: createStep >= 3 ? '#0033cc' : '#f0f4ff',
                  color: createStep >= 3 ? 'white' : '#0033cc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  3
                </div>
              </div>

              <form onSubmit={handleCreateGroup}>
                {/* Step 1 */}
                {createStep === 1 && (
                  <div className="compact-step-content">
                    <div style={{ marginBottom: '16px' }}>
                      <div className="detail-label" style={{ marginBottom: '8px' }}>Group Name</div>
                      <input
                        type="text"
                        className="share-input"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                        placeholder="Enter group name"
                        required
                      />
                    </div>

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
                          minHeight: '80px'
                        }}
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                        placeholder="Describe the purpose of this group"
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div className="detail-label" style={{ marginBottom: '8px' }}>Group Type</div>
                      <div className="commission-grid">
                        {['savings', 'emergency', 'spares'].map(type => (
                          <button
                            key={type}
                            type="button"
                            className={`commission-card ${newGroup.type === type ? 'revenue' : 'pending'}`}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                            onClick={() => setNewGroup({...newGroup, type})}
                          >
                            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                              {type === 'savings' ? '💰' : 
                               type === 'emergency' ? '🛡️' : '🔧'}
                            </div>
                            <div className="commission-label">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <div className="detail-label" style={{ marginBottom: '8px' }}>Max Members</div>
                        <input
                          type="number"
                          className="share-input"
                          value={newGroup.maxMembers}
                          onChange={(e) => setNewGroup({...newGroup, maxMembers: e.target.value})}
                          min="2"
                          max="50"
                          required
                        />
                      </div>
                      <div>
                        <div className="detail-label" style={{ marginBottom: '8px' }}>Target Amount</div>
                        <input
                          type="number"
                          className="share-input"
                          value={newGroup.targetAmount}
                          onChange={(e) => setNewGroup({...newGroup, targetAmount: e.target.value})}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#0033cc', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={newGroup.isPublic}
                          onChange={(e) => setNewGroup({...newGroup, isPublic: e.target.checked})}
                          style={{ width: '16px', height: '16px' }}
                        />
                        Make this group public (visible to all riders)
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {createStep === 2 && (
                  <div className="compact-step-content">
                    <div style={{ marginBottom: '16px' }}>
                      <div className="detail-label" style={{ marginBottom: '8px' }}>Contribution Amount</div>
                      <input
                        type="number"
                        className="share-input"
                        value={newGroup.contributionAmount}
                        onChange={(e) => setNewGroup({...newGroup, contributionAmount: e.target.value})}
                        placeholder="Amount per contribution"
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div className="detail-label" style={{ marginBottom: '8px' }}>Contribution Frequency</div>
                      <div className="commission-grid">
                        {['weekly', 'bi-weekly', 'monthly'].map(freq => (
                          <button
                            key={freq}
                            type="button"
                            className={`commission-card ${newGroup.frequency === freq ? 'revenue' : 'pending'}`}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                            onClick={() => setNewGroup({...newGroup, frequency: freq})}
                          >
                            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                              {freq === 'weekly' ? '📅' : 
                               freq === 'bi-weekly' ? '🔄' : '📆'}
                            </div>
                            <div className="commission-label">
                              {freq.charAt(0).toUpperCase() + freq.slice(1)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div className="detail-label" style={{ marginBottom: '8px' }}>Admin Fee (%)</div>
                      <input
                        type="number"
                        className="share-input"
                        value={newGroup.adminFee}
                        onChange={(e) => setNewGroup({...newGroup, adminFee: e.target.value})}
                        placeholder="Optional admin fee"
                        min="0"
                        max="10"
                        step="0.1"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {createStep === 3 && (
                  <div className="compact-step-content">
                    <div style={{ marginBottom: '16px' }}>
                      <div className="detail-label" style={{ marginBottom: '8px' }}>Group Rules</div>
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
                          minHeight: '100px'
                        }}
                        value={newGroup.rules}
                        onChange={(e) => setNewGroup({...newGroup, rules: e.target.value})}
                        placeholder="Define rules for contributions, withdrawals, penalties, etc."
                      />
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#0033cc', marginBottom: '8px' }}>Default Rules</div>
                      <div className="alert-item" style={{ marginBottom: '4px' }}>
                        <div style={{ flex: 1 }}>
                          <div className="alert-type">Late contributions incur 5% penalty</div>
                        </div>
                        <span className="new-badge">Default</span>
                      </div>
                      <div className="alert-item" style={{ marginBottom: '4px' }}>
                        <div style={{ flex: 1 }}>
                          <div className="alert-type">Withdrawals require 24 hours notice</div>
                        </div>
                        <span className="new-badge">Default</span>
                      </div>
                      <div className="alert-item" style={{ marginBottom: '4px' }}>
                        <div style={{ flex: 1 }}>
                          <div className="alert-type">Emergency withdrawals available</div>
                        </div>
                        <span className="new-badge">Default</span>
                      </div>
                      <div className="alert-item">
                        <div style={{ flex: 1 }}>
                          <div className="alert-type">Monthly transparency reports</div>
                        </div>
                        <span className="new-badge">Default</span>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="modal-footer">
              {createStep > 1 && (
                <button 
                  className="activate-code-btn" 
                  style={{ background: '#666' }}
                  onClick={() => setCreateStep(createStep - 1)}
                >
                  Back
                </button>
              )}
              <button 
                className="activate-code-btn"
                onClick={handleCreateGroup}
              >
                {createStep === 3 ? 'Create Group' : 'Continue'}
              </button>
              <button 
                className="activate-code-btn" 
                style={{ background: '#666' }}
                onClick={() => {
                  setShowCreateGroup(false);
                  setCreateStep(1);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Selection Modal */}
      {showContributionModal && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>MAKE CONTRIBUTION</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowContributionModal(false);
                  setSelectedGroupForContribution(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {!selectedGroupForContribution ? (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div className="detail-label" style={{ marginBottom: '8px' }}>Select Group</div>
                    <div className="commission-overview">
                      <div className="commission-grid">
                        {myGroups.map(group => (
                          <div key={group.id} className="commission-card revenue">
                            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                              <div style={{ 
                                fontSize: '24px', 
                                marginBottom: '8px',
                                color: getGroupTypeColor(group.type)
                              }}>
                                {group.type === 'savings' ? '💰' : 
                                 group.type === 'emergency' ? '🛡️' : '🔧'}
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: '600', color: '#0033cc' }}>
                                {group.name}
                              </div>
                            </div>
                            
                            <div style={{ marginBottom: '8px' }}>
                              <p style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                {group.description}
                              </p>
                            </div>
                            
                            <div className="detail-row">
                              <span className="detail-label">Members</span>
                              <span className="detail-value">{group.members}/{group.maxMembers}</span>
                            </div>
                            
                            <div className="detail-row">
                              <span className="detail-label">Contribution</span>
                              <span className="detail-value">UGX {group.contribution.toLocaleString()}</span>
                            </div>
                            
                            <div className="detail-row">
                              <span className="detail-label">Next Due</span>
                              <span className="detail-value" style={{ color: '#f59e0b' }}>{group.nextContribution}</span>
                            </div>
                            
                            <button 
                              className="activate-code-btn"
                              onClick={() => setSelectedGroupForContribution(group)}
                              style={{ width: '100%', marginTop: '8px' }}
                            >
                              Select This Group
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div className="detail-label" style={{ marginBottom: '8px' }}>Confirm Contribution</div>
                    
                    <div style={{ 
                      padding: '16px', 
                      background: '#f0f4ff',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}>
                      <div className="detail-row highlight">
                        <span className="detail-label">Group</span>
                        <span className="detail-value" style={{ fontWeight: '600', color: '#0033cc' }}>
                          {selectedGroupForContribution.name}
                        </span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Type</span>
                        <span className="detail-value">{selectedGroupForContribution.type.toUpperCase()}</span>
                      </div>
                      
                      <div className="detail-row highlight">
                        <span className="detail-label">Contribution Amount</span>
                        <span className="detail-value" style={{ color: '#2e7d32', fontWeight: '700', fontSize: '18px' }}>
                          UGX {selectedGroupForContribution.contribution.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Frequency</span>
                        <span className="detail-value">{selectedGroupForContribution.frequency}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Current Pool</span>
                        <span className="detail-value">UGX {selectedGroupForContribution.totalPool?.toLocaleString() || '0'}</span>
                      </div>
                    </div>

                    <div style={{ 
                      background: '#e8f5e9', 
                      padding: '12px', 
                      borderRadius: '8px',
                      border: '1px solid #c8e6c9',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#2e7d32', marginBottom: '4px' }}>
                        💡 Important Information
                      </div>
                      <ul style={{ fontSize: '11px', color: '#666', margin: 0, paddingLeft: '16px' }}>
                        <li>This contribution will be added to the group's total pool</li>
                        <li>You will receive a receipt for this transaction</li>
                        <li>The next contribution is due in {selectedGroupForContribution.nextContribution || '7 days'}</li>
                        <li>Late contributions may incur penalties as per group rules</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selectedGroupForContribution ? (
                <>
                  <button 
                    className="activate-code-btn" 
                    style={{ background: '#666' }}
                    onClick={() => setSelectedGroupForContribution(null)}
                  >
                    Back
                  </button>
                  <button 
                    className="activate-code-btn"
                    onClick={confirmContribution}
                  >
                    Confirm Contribution
                  </button>
                  <button 
                    className="activate-code-btn" 
                    style={{ background: '#f0f4ff', color: '#0033cc' }}
                    onClick={() => {
                      setShowContributionModal(false);
                      setSelectedGroupForContribution(null);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  className="activate-code-btn" 
                  style={{ background: '#666' }}
                  onClick={() => {
                    setShowContributionModal(false);
                    setSelectedGroupForContribution(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && currentReceipt && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>CONTRIBUTION RECEIPT</h2>
              <button 
                className="modal-close"
                onClick={() => setShowReceipt(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div style={{ 
                padding: '20px', 
                background: 'white', 
                borderRadius: '8px', 
                border: '1px solid #e0e0e0',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '24px', color: '#0033cc', marginBottom: '8px' }}>✓</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#0033cc' }}>Payment Confirmed</div>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Receipt ID</span>
                  <span className="detail-value" style={{ fontFamily: 'monospace' }}>{currentReceipt.id}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{currentReceipt.date}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Group</span>
                  <span className="detail-value">{currentReceipt.groupName}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{currentReceipt.groupType}</span>
                </div>
                
                <div className="detail-row highlight">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value" style={{ color: '#2e7d32', fontWeight: '700' }}>
                    UGX {currentReceipt.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Reference</span>
                  <span className="detail-value" style={{ fontFamily: 'monospace' }}>{currentReceipt.reference}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Transaction ID</span>
                  <span className="detail-value" style={{ fontFamily: 'monospace' }}>{currentReceipt.transactionId}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Member</span>
                  <span className="detail-value">{currentReceipt.memberName}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Member ID</span>
                  <span className="detail-value">{currentReceipt.memberId}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">
                    <span className="status-badge valid">{currentReceipt.status}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="activate-code-btn" 
                style={{ background: '#666' }}
                onClick={() => setShowReceipt(false)}
              >
                Close
              </button>
              <button 
                className="activate-code-btn"
                onClick={handleDownloadReceipt}
              >
                Download Receipt
              </button>
              <button 
                className="activate-code-btn" 
                style={{ background: '#f0f4ff', color: '#0033cc' }}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'white',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 51, 204, 0.2)',
          borderLeft: '4px solid #2e7d32',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: '1001',
          animation: 'slideIn 0.3s ease',
          maxWidth: '300px'
        }}>
          <div style={{ fontSize: '20px', color: '#2e7d32' }}>✓</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#0033cc' }}>Success!</div>
            <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.3' }}>{toastMessage}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

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
          padding: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
        }

        .modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e0e0e0;
          background: #0033cc;
          color: white;
          border-radius: 8px 8px 0 0;
        }

        .modal-header h2 {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          color: white;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justifyContent: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid #e0e0e0;
          background: #f8f9fa;
          border-radius: 0 0 8px 8px;
        }

        @media (max-width: 768px) {
          .modal-footer {
            flex-direction: column;
          }
          
          .modal-header {
            padding: 12px 16px;
          }
          
          .modal-body {
            padding: 16px;
          }
          
          .modal-footer {
            padding: 12px 16px;
          }
          
          .alerts-section {
            grid-template-columns: 1fr;
          }
          
          .referral-alerts {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            max-width: 100%;
            margin: 0;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Groups;