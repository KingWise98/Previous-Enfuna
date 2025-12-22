"use client"

import React, { useState, useEffect } from 'react';

const Groups = () => {
  const [activeTab, setActiveTab] = useState('myGroups');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [createStep, setCreateStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
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

  // Sample Data
  const [myGroups, setMyGroups] = useState([
    {
      id: 1,
      name: 'Kampala Boda Savers',
      description: 'Weekly savings for motorcycle riders',
      type: 'savings',
      members: 8,
      maxMembers: 12,
      contribution: 50000,
      totalPool: 400000,
      frequency: 'Weekly',
      progress: 68.7,
      nextContribution: '2 days'
    },
    {
      id: 2,
      name: 'Emergency Fund Circle',
      description: 'Emergency fund support',
      type: 'emergency',
      members: 7,
      maxMembers: 12,
      contribution: 30000,
      totalPool: 60000,
      frequency: 'Monthly',
      progress: 50.7,
      nextContribution: '5 days'
    },
    {
      id: 3,
      name: 'Bike Maintenance Group',
      description: 'Regular savings for bike maintenance',
      type: 'spares',
      members: 5,
      maxMembers: 10,
      contribution: 20000,
      totalPool: 120000,
      frequency: 'Bi-weekly',
      progress: 42.3,
      nextContribution: '1 week'
    }
  ]);

  const [availableGroups, setAvailableGroups] = useState([
    {
      id: 1,
      name: 'Kampala Boda Savers',
      type: 'savings',
      description: 'Weekly savings for riders',
      members: 8,
      maxMembers: 12,
      contribution: 50000,
      frequency: 'Weekly',
      isMember: true,
      isPublic: true
    },
    {
      id: 2,
      name: 'Bike Upgrade Fund',
      type: 'spares',
      description: 'Save for bike upgrades',
      members: 3,
      maxMembers: 7,
      contribution: 50000,
      frequency: 'Weekly',
      isMember: false,
      isPublic: true
    },
    {
      id: 3,
      name: 'Emergency Circle Fund',
      type: 'emergency',
      description: 'Emergency support fund',
      members: 3,
      maxMembers: 7,
      contribution: 20000,
      frequency: 'Monthly',
      isMember: true,
      isPublic: false
    },
    {
      id: 4,
      name: 'Rent Savings Group',
      type: 'savings',
      description: 'Monthly rent savings',
      members: 6,
      maxMembers: 10,
      contribution: 40000,
      frequency: 'Monthly',
      isMember: false,
      isPublic: true
    }
  ]);

  const [contributions, setContributions] = useState([
    {
      id: 1,
      date: '13-Dec-2025',
      group: 'Kampala Boda Savers',
      amount: 50000,
      status: 'Completed',
      type: 'Savings',
      receipt: 'receipt_001.pdf'
    },
    {
      id: 2,
      date: '13-Dec-2025',
      group: 'Kampala Boda Savers',
      amount: 50000,
      status: 'Completed',
      type: 'Savings',
      receipt: 'receipt_002.pdf'
    },
    {
      id: 3,
      date: '13-Dec-2025',
      group: 'Kampala Boda Savers',
      amount: 50000,
      status: 'Completed',
      type: 'Spares',
      receipt: 'receipt_003.pdf'
    },
    {
      id: 4,
      date: '13-Dec-2025',
      group: 'Kampala Boda Savers',
      amount: 50000,
      status: 'Completed',
      type: 'Emergency',
      receipt: 'receipt_004.pdf'
    },
    {
      id: 5,
      date: '10-Dec-2025',
      group: 'Emergency Fund Circle',
      amount: 30000,
      status: 'Pending',
      type: 'Emergency',
      receipt: ''
    }
  ]);

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleJoinGroup = (groupId) => {
    setAvailableGroups(availableGroups.map(group => 
      group.id === groupId ? { ...group, isMember: true, members: group.members + 1 } : group
    ));
    
    const groupToJoin = availableGroups.find(g => g.id === groupId);
    const newGroupId = Date.now();
    
    const newGroupObj = {
      id: newGroupId,
      name: groupToJoin.name,
      description: groupToJoin.description,
      type: groupToJoin.type,
      members: groupToJoin.members + 1,
      maxMembers: groupToJoin.maxMembers,
      contribution: groupToJoin.contribution,
      totalPool: groupToJoin.contribution * (groupToJoin.members + 1),
      frequency: groupToJoin.frequency,
      progress: ((groupToJoin.members + 1) / groupToJoin.maxMembers) * 100,
      nextContribution: '7 days'
    };
    
    setMyGroups([newGroupObj, ...myGroups]);
    showNotification(`Successfully joined ${groupToJoin.name}`);
  };

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
      memberId: 'RIDER001',
      memberName: 'John Doe'
    };
  };

  const handleContribute = (groupId) => {
    setMyGroups(myGroups.map(group => {
      if (group.id === groupId) {
        const newTotal = group.totalPool + group.contribution;
        const newProgress = (group.members / group.maxMembers) * 100;
        
        // Generate receipt
        const receipt = generateReceipt(group, group.contribution);
        
        // Add to contributions history
        const newContribution = {
          id: contributions.length + 1,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          group: group.name,
          amount: group.contribution,
          status: 'Completed',
          type: group.type.charAt(0).toUpperCase() + group.type.slice(1),
          receipt: receipt
        };
        
        setContributions([newContribution, ...contributions]);
        
        // Show receipt modal
        setCurrentReceipt(receipt);
        setShowReceipt(true);
        
        // Show success notification
        showNotification(`Contribution of UGX ${group.contribution.toLocaleString()} successful`);
        
        return {
          ...group,
          totalPool: newTotal,
          progress: newProgress,
          nextContribution: group.frequency === 'Weekly' ? '7 days' : 
                          group.frequency === 'Monthly' ? '30 days' : '14 days'
        };
      }
      return group;
    }));
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (createStep < 3) {
      setCreateStep(createStep + 1);
    } else {
      const newGroupId = Date.now();
      const newGroupObj = {
        id: newGroupId,
        name: newGroup.name,
        description: newGroup.description,
        type: newGroup.type,
        members: 1,
        maxMembers: parseInt(newGroup.maxMembers),
        contribution: parseInt(newGroup.contributionAmount) || 0,
        totalPool: parseInt(newGroup.contributionAmount) || 0,
        frequency: newGroup.frequency.charAt(0).toUpperCase() + newGroup.frequency.slice(1),
        progress: (1 / parseInt(newGroup.maxMembers)) * 100,
        nextContribution: '7 days'
      };
      
      setMyGroups([newGroupObj, ...myGroups]);
      
      setAvailableGroups([{
        id: availableGroups.length + 1,
        name: newGroup.name,
        type: newGroup.type,
        description: newGroup.description,
        members: 1,
        maxMembers: parseInt(newGroup.maxMembers),
        contribution: parseInt(newGroup.contributionAmount) || 0,
        frequency: newGroup.frequency,
        isMember: true,
        isPublic: newGroup.isPublic
      }, ...availableGroups]);
      
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
  };

  const handleViewReceipt = (receipt) => {
    setCurrentReceipt(receipt);
    setShowReceipt(true);
  };

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

  const filteredGroups = availableGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = groupFilter === 'all' || 
                         (groupFilter === 'public' && group.isPublic) ||
                         (groupFilter === 'private' && !group.isPublic);
    return matchesSearch && matchesFilter;
  });

  const getContributionColor = (type) => {
    switch(type.toLowerCase()) {
      case 'savings': return '#3b82f6';
      case 'emergency': return '#ef4444';
      case 'spares': return '#10b981';
      default: return '#64748b';
    }
  };

  const getGroupTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'savings': return '#3b82f6';
      case 'emergency': return '#ef4444';
      case 'spares': return '#10b981';
      default: return '#64748b';
    }
  };

  const getGroupTypeBgColor = (type) => {
    switch(type.toLowerCase()) {
      case 'savings': return '#dbeafe';
      case 'emergency': return '#fee2e2';
      case 'spares': return '#d1fae5';
      default: return '#f1f5f9';
    }
  };

  const stats = {
    activeGroups: myGroups.length,
    totalContributions: myGroups.reduce((sum, group) => sum + group.totalPool, 0),
    nextContributions: myGroups.filter(g => g.nextContribution === '2 days').length
  };

  // Quick action handlers
  const handleQuickContribute = () => {
    if (myGroups.length > 0) {
      handleContribute(myGroups[0].id);
    } else {
      showNotification('No groups available for contribution');
    }
  };

  const handleQuickWithdraw = () => {
    showNotification('Withdrawal request submitted for review');
  };

  const handleQuickInvite = () => {
    showNotification('Invitation link copied to clipboard');
  };

  return (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">GROUP FUNDING AND EARNINGS</h1>
            <p className="expense-subtitle">Join forces with other riders to save, invest and access group benefits</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Group Admin</span>
            <div className="expense-user-badge">GA</div>
          </div>
        </div>
      </header>

      {/* Compact Stats Grid */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Active Groups</span>
            <span className="compact-stat-change positive">+{stats.activeGroups}</span>
          </div>
          <div className="compact-stat-value">
            {stats.activeGroups}
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Pool</span>
            <span className="compact-stat-change positive">+{stats.totalContributions.toLocaleString()}</span>
          </div>
          <div className="compact-stat-value">
            UGX {stats.totalContributions.toLocaleString()}
          </div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Due Soon</span>
            <span className="compact-stat-change negative">+{stats.nextContributions}</span>
          </div>
          <div className="compact-stat-value">
            {stats.nextContributions}
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Members</span>
            <span className="compact-stat-change positive">+{myGroups.reduce((sum, g) => sum + g.members, 0)}</span>
          </div>
          <div className="compact-stat-value">
            {myGroups.reduce((sum, g) => sum + g.members, 0)}
          </div>
        </div>
      </div>

      {/* Compact Action Bar */}
      <div className="compact-action-bar">
        <button 
          className={`compact-btn ${activeTab === 'myGroups' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('myGroups')}
        >
          My Groups
        </button>
        <button 
          className={`compact-btn ${activeTab === 'allGroups' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('allGroups')}
        >
          All Groups
        </button>
        <button 
          className={`compact-btn ${activeTab === 'contributions' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('contributions')}
        >
          Contributions
        </button>
        <button 
          className={`compact-btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Main Content Area */}
      <div className="compact-content-grid">
        {/* Left Panel - Dynamic Content */}
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          {activeTab === 'myGroups' && (
            <div className="my-groups-view">
              <div className="compact-section-header">
                <h2 className="compact-section-title">My Groups</h2>
                <div className="compact-filters">
                  <button className="compact-btn btn-secondary" onClick={() => setActiveTab('allGroups')}>
                    Join Group
                  </button>
                  <button className="compact-btn btn-primary" onClick={() => setShowCreateGroup(true)}>
                    + Create Group
                  </button>
                </div>
              </div>

              <div className="compact-table-wrapper">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Group Name</th>
                      <th>Type</th>
                      <th>Members</th>
                      <th>Contribution</th>
                      <th>Progress</th>
                      <th>Next Due</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myGroups.map(group => (
                      <tr key={group.id}>
                        <td>
                          <div className="compact-group-cell">
                            <div className="compact-group-name">{group.name}</div>
                            <div className="compact-group-desc">{group.description}</div>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="compact-group-type"
                            style={{
                              backgroundColor: getGroupTypeBgColor(group.type),
                              color: getGroupTypeColor(group.type),
                              borderColor: getGroupTypeColor(group.type)
                            }}
                          >
                            {group.type.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="compact-members">
                            {group.members}/{group.maxMembers}
                          </div>
                        </td>
                        <td className="compact-amount">
                          UGX {group.contribution.toLocaleString()}
                        </td>
                        <td>
                          <div className="compact-progress-section">
                            <div className="compact-progress-header">
                              <span>{group.progress.toFixed(1)}%</span>
                            </div>
                            <div className="compact-progress-bar">
                              <div 
                                className="compact-progress-fill"
                                style={{ 
                                  width: `${group.progress}%`,
                                  backgroundColor: getGroupTypeColor(group.type)
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="compact-next-due">
                            <span className="due-badge">{group.nextContribution}</span>
                          </div>
                        </td>
                        <td>
                          <div className="compact-action-buttons">
                            <button 
                              className="compact-action-btn contribute"
                              onClick={() => handleContribute(group.id)}
                            >
                              Contribute
                            </button>
                            <button className="compact-action-btn view">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'allGroups' && (
            <div className="all-groups-view">
              <div className="compact-section-header">
                <h2 className="compact-section-title">Available Groups</h2>
                <div className="compact-filters">
                  <input
                    type="text"
                    placeholder="Search groups..."
                    className="compact-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select 
                    className="compact-filter-select"
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="compact-table-wrapper">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Group Name</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Members</th>
                      <th>Contribution</th>
                      <th>Frequency</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroups.map(group => (
                      <tr key={group.id}>
                        <td>
                          <div className="compact-group-cell">
                            <div className="compact-group-name">{group.name}</div>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="compact-group-type"
                            style={{
                              backgroundColor: getGroupTypeBgColor(group.type),
                              color: getGroupTypeColor(group.type),
                              borderColor: getGroupTypeColor(group.type)
                            }}
                          >
                            {group.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="compact-group-desc">{group.description}</td>
                        <td>
                          <div className="compact-members">
                            {group.members}/{group.maxMembers}
                          </div>
                        </td>
                        <td className="compact-amount">
                          UGX {group.contribution.toLocaleString()}
                        </td>
                        <td>
                          <span className="compact-frequency">{group.frequency}</span>
                        </td>
                        <td>
                          <span className={`compact-status ${group.isPublic ? 'public' : 'private'}`}>
                            {group.isPublic ? 'Public' : 'Private'}
                          </span>
                        </td>
                        <td>
                          {group.isMember ? (
                            <span className="compact-member-badge">Member</span>
                          ) : (
                            <button 
                              className="compact-action-btn join"
                              onClick={() => handleJoinGroup(group.id)}
                            >
                              Join
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'contributions' && (
            <div className="contributions-view">
              <div className="compact-section-header">
                <h2 className="compact-section-title">Contribution History</h2>
                <div className="compact-filters">
                  <span className="compact-total-amount">
                    Total: UGX {contributions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="compact-table-wrapper">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Group</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.map(contribution => (
                      <tr key={contribution.id}>
                        <td className="compact-date">{contribution.date}</td>
                        <td>
                          <div className="compact-group-cell">
                            <div className="compact-group-name">{contribution.group}</div>
                          </div>
                        </td>
                        <td className="compact-amount">
                          UGX {contribution.amount.toLocaleString()}
                        </td>
                        <td>
                          <span className={`compact-status ${contribution.status.toLowerCase()}`}>
                            {contribution.status}
                          </span>
                        </td>
                        <td>
                          <span 
                            className="compact-type-badge"
                            style={{
                              backgroundColor: getContributionColor(contribution.type),
                              color: 'white'
                            }}
                          >
                            {contribution.type}
                          </span>
                        </td>
                        <td>
                          {contribution.receipt ? (
                            <button 
                              className="compact-action-btn view"
                              onClick={() => handleViewReceipt(contribution.receipt)}
                            >
                              View
                            </button>
                          ) : (
                            <span className="compact-pending">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-view">
              <div className="compact-section-header">
                <h2 className="compact-section-title">Group Analytics</h2>
              </div>

              <div className="compact-breakdown-list">
                {myGroups.map(group => (
                  <div key={group.id} className="compact-breakdown-item">
                    <div className="compact-breakdown-info">
                      <span className="compact-breakdown-name">{group.name}</span>
                      <span className="compact-breakdown-percentage">{group.progress.toFixed(1)}%</span>
                    </div>
                    <div className="compact-progress-bar">
                      <div
                        className="compact-progress-fill"
                        style={{
                          width: `${group.progress}%`,
                          backgroundColor: getGroupTypeColor(group.type)
                        }}
                      />
                    </div>
                    <div className="compact-group-details">
                      <div className="compact-detail-row">
                        <span>Members:</span>
                        <strong>{group.members}/{group.maxMembers}</strong>
                      </div>
                      <div className="compact-detail-row">
                        <span>Pool:</span>
                        <strong>UGX {group.totalPool.toLocaleString()}</strong>
                      </div>
                      <div className="compact-detail-row">
                        <span>Next Due:</span>
                        <strong>{group.nextContribution}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Quick Actions & Stats */}
        <div className="compact-breakdown-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Quick Actions</h2>
          </div>

          <div className="compact-quick-actions">
            <button className="compact-action-btn btn-primary" onClick={handleQuickContribute}>
              Make Contribution
            </button>
            <button className="compact-action-btn btn-secondary" onClick={handleQuickWithdraw}>
              Request Withdrawal
            </button>
            <button className="compact-action-btn btn-secondary" onClick={handleQuickInvite}>
              Invite Riders
            </button>
            <button className="compact-action-btn btn-secondary" onClick={() => setShowCreateGroup(true)}>
              Create Group
            </button>
          </div>

          <div className="compact-section-header" style={{ marginTop: '1rem' }}>
            <h2 className="compact-section-title">Group Benefits</h2>
          </div>

          <div className="compact-benefits-list">
            <div className="compact-benefit-item">
              <div className="compact-benefit-icon">🛡️</div>
              <div>
                <div className="compact-benefit-title">Collective Security</div>
                <div className="compact-benefit-desc">Emergency group support and financial safety net</div>
              </div>
            </div>
            <div className="compact-benefit-item">
              <div className="compact-benefit-icon">📊</div>
              <div>
                <div className="compact-benefit-title">Better Loan Rates</div>
                <div className="compact-benefit-desc">Group negotiation power for favorable terms</div>
              </div>
            </div>
            <div className="compact-benefit-item">
              <div className="compact-benefit-icon">🏆</div>
              <div>
                <div className="compact-benefit-title">Group Rewards</div>
                <div className="compact-benefit-desc">Collective achievement bonuses and incentives</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="compact-modal-overlay">
          <div className="compact-modal">
            {/* Modal Header */}
            <div className="compact-modal-header">
              <h2>CREATE NEW GROUP</h2>
              <div className="compact-modal-steps">
                <span className={`compact-step ${createStep >= 1 ? "active" : ""}`}>1</span>
                <span className="compact-step-divider"></span>
                <span className={`compact-step ${createStep >= 2 ? "active" : ""}`}>2</span>
                <span className="compact-step-divider"></span>
                <span className={`compact-step ${createStep >= 3 ? "active" : ""}`}>3</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="compact-modal-content">
              <form onSubmit={handleCreateGroup} className="create-group-form">
                {/* Step 1 */}
                {createStep === 1 && (
                  <div className="compact-step-content">
                    <div className="compact-form-group">
                      <label className="compact-form-label">Group Name</label>
                      <input
                        type="text"
                        className="compact-form-input"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                        placeholder="Enter group name"
                        required
                      />
                    </div>

                    <div className="compact-form-group">
                      <label className="compact-form-label">Description</label>
                      <textarea
                        className="compact-form-textarea"
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                        placeholder="Describe the purpose of this group"
                        rows="3"
                        required
                      />
                    </div>

                    <div className="compact-form-group">
                      <label className="compact-form-label">Group Type</label>
                      <div className="compact-category-grid">
                        {['savings', 'emergency', 'spares'].map(type => (
                          <button
                            key={type}
                            type="button"
                            className={`compact-category-btn ${newGroup.type === type ? 'selected' : ''}`}
                            onClick={() => setNewGroup({...newGroup, type})}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="compact-form-row">
                      <div className="compact-form-group">
                        <label className="compact-form-label">Max Members</label>
                        <input
                          type="number"
                          className="compact-form-input"
                          value={newGroup.maxMembers}
                          onChange={(e) => setNewGroup({...newGroup, maxMembers: e.target.value})}
                          min="2"
                          max="50"
                          required
                        />
                      </div>
                      <div className="compact-form-group">
                        <label className="compact-form-label">Target Amount</label>
                        <input
                          type="number"
                          className="compact-form-input"
                          value={newGroup.targetAmount}
                          onChange={(e) => setNewGroup({...newGroup, targetAmount: e.target.value})}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="compact-form-group">
                      <label className="compact-checkbox-label">
                        <input
                          type="checkbox"
                          checked={newGroup.isPublic}
                          onChange={(e) => setNewGroup({...newGroup, isPublic: e.target.checked})}
                          className="compact-checkbox"
                        />
                        <span>Make this group public (visible to all riders)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {createStep === 2 && (
                  <div className="compact-step-content">
                    <div className="compact-form-group">
                      <label className="compact-form-label">Contribution Amount</label>
                      <input
                        type="number"
                        className="compact-form-input"
                        value={newGroup.contributionAmount}
                        onChange={(e) => setNewGroup({...newGroup, contributionAmount: e.target.value})}
                        placeholder="Amount per contribution"
                        required
                      />
                    </div>

                    <div className="compact-form-group">
                      <label className="compact-form-label">Contribution Frequency</label>
                      <div className="compact-category-grid">
                        {['weekly', 'bi-weekly', 'monthly'].map(freq => (
                          <button
                            key={freq}
                            type="button"
                            className={`compact-category-btn ${newGroup.frequency === freq ? 'selected' : ''}`}
                            onClick={() => setNewGroup({...newGroup, frequency: freq})}
                          >
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="compact-form-group">
                      <label className="compact-form-label">Admin Fee (%)</label>
                      <input
                        type="number"
                        className="compact-form-input"
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
                    <div className="compact-form-group">
                      <label className="compact-form-label">Group Rules</label>
                      <textarea
                        className="compact-form-textarea"
                        value={newGroup.rules}
                        onChange={(e) => setNewGroup({...newGroup, rules: e.target.value})}
                        placeholder="Define rules for contributions, withdrawals, penalties, etc."
                        rows="4"
                      />
                    </div>

                    <div className="compact-rules-list">
                      <div className="compact-rule-item">
                        <input type="checkbox" defaultChecked disabled />
                        <span>Late contributions incur 5% penalty</span>
                      </div>
                      <div className="compact-rule-item">
                        <input type="checkbox" defaultChecked disabled />
                        <span>Withdrawals require 24 hours notice</span>
                      </div>
                      <div className="compact-rule-item">
                        <input type="checkbox" defaultChecked disabled />
                        <span>Emergency withdrawals available</span>
                      </div>
                      <div className="compact-rule-item">
                        <input type="checkbox" defaultChecked disabled />
                        <span>Monthly transparency reports</span>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Actions */}
            <div className="compact-modal-actions">
              {createStep > 1 && (
                <button 
                  className="compact-modal-btn btn-secondary"
                  onClick={() => setCreateStep(createStep - 1)}
                >
                  Back
                </button>
              )}
              <button 
                className="compact-modal-btn btn-primary"
                onClick={handleCreateGroup}
              >
                {createStep === 3 ? 'Create Group' : 'Continue'}
              </button>
              <button 
                className="compact-modal-btn btn-secondary"
                onClick={() => setShowCreateGroup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && currentReceipt && (
        <div className="compact-modal-overlay">
          <div className="compact-modal">
            {/* Modal Header */}
            <div className="compact-modal-header">
              <h2>CONTRIBUTION RECEIPT</h2>
              <div className="compact-modal-steps">
                <span className="compact-step active">1</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="compact-modal-content">
              <div className="compact-review-card">
                <div className="compact-review-row">
                  <div className="compact-review-group">
                    <span className="compact-review-label">Receipt ID</span>
                    <span className="compact-review-value">{currentReceipt.id}</span>
                  </div>
                  <div className="compact-review-group">
                    <span className="compact-review-label">Date</span>
                    <span className="compact-review-value">{currentReceipt.date}</span>
                  </div>
                </div>
                <div className="compact-review-row">
                  <div className="compact-review-group">
                    <span className="compact-review-label">Group</span>
                    <span className="compact-review-value">{currentReceipt.groupName}</span>
                  </div>
                  <div className="compact-review-group">
                    <span className="compact-review-label">Type</span>
                    <span className="compact-review-value">{currentReceipt.groupType}</span>
                  </div>
                </div>
                <div className="compact-review-row">
                  <div className="compact-review-group">
                    <span className="compact-review-label">Amount</span>
                    <span className="compact-review-value" style={{ color: '#10b981', fontWeight: '700' }}>
                      UGX {currentReceipt.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="compact-review-group">
                    <span className="compact-review-label">Status</span>
                    <span className="compact-review-value" style={{ color: '#10b981' }}>
                      {currentReceipt.status}
                    </span>
                  </div>
                </div>
                <div className="compact-review-row">
                  <div className="compact-review-group">
                    <span className="compact-review-label">Reference</span>
                    <span className="compact-review-value">{currentReceipt.reference}</span>
                  </div>
                  <div className="compact-review-group">
                    <span className="compact-review-label">Transaction ID</span>
                    <span className="compact-review-value">{currentReceipt.transactionId}</span>
                  </div>
                </div>
                <div className="compact-review-row">
                  <div className="compact-review-group">
                    <span className="compact-review-label">Member</span>
                    <span className="compact-review-value">{currentReceipt.memberName}</span>
                  </div>
                  <div className="compact-review-group">
                    <span className="compact-review-label">Member ID</span>
                    <span className="compact-review-value">{currentReceipt.memberId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="compact-modal-actions">
              <button 
                className="compact-modal-btn btn-secondary"
                onClick={() => setShowReceipt(false)}
              >
                Close
              </button>
              <button 
                className="compact-modal-btn btn-primary"
                onClick={handleDownloadReceipt}
              >
                Download Receipt
              </button>
              <button className="compact-modal-btn btn-secondary">
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="compact-toast">
          <div className="compact-toast-content">
            <div className="compact-toast-icon">✅</div>
            <div>
              <div className="compact-toast-title">Success!</div>
              <div className="compact-toast-message">{toastMessage}</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Groups Specific Styles */
        .compact-group-cell {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .compact-group-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.7rem;
        }

        .compact-group-desc {
          color: #64748b;
          font-size: 0.65rem;
          line-height: 1.2;
        }

        .compact-group-type {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          border: 1px solid;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .compact-members {
          font-size: 0.7rem;
          font-weight: 600;
          color: #1e293b;
        }

        .compact-progress-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .compact-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .compact-progress-header span {
          font-size: 0.65rem;
          font-weight: 600;
          color: #3b82f6;
        }

        .compact-next-due {
          display: flex;
          justify-content: center;
        }

        .due-badge {
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .compact-action-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .compact-action-btn.contribute {
          background: #3b82f6;
          color: white;
          border: none;
          font-size: 0.65rem;
          padding: 0.25rem 0.375rem;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 500;
        }

        .compact-action-btn.view {
          background: #dbeafe;
          color: #1e40af;
          border: none;
          font-size: 0.65rem;
          padding: 0.25rem 0.375rem;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 500;
        }

        .compact-action-btn.join {
          background: #10b981;
          color: white;
          border: none;
          font-size: 0.65rem;
          padding: 0.25rem 0.375rem;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 500;
          min-width: 50px;
        }

        .compact-frequency {
          font-size: 0.7rem;
          color: #475569;
          font-weight: 500;
        }

        .compact-status {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .compact-status.public {
          background: #d1fae5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .compact-status.private {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .compact-status.completed {
          background: #d1fae5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .compact-status.pending {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .compact-member-badge {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .compact-total-amount {
          font-size: 0.7rem;
          font-weight: 600;
          color: #1e40af;
          background: #eff6ff;
          padding: 0.375rem 0.75rem;
          border-radius: 4px;
          border: 1px solid #dbeafe;
        }

        .compact-type-badge {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .compact-pending {
          font-size: 0.65rem;
          color: #94a3b8;
          font-style: italic;
        }

        /* Analytics Styles */
        .compact-group-details {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .compact-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
          font-size: 0.7rem;
        }

        .compact-detail-row:last-child {
          margin-bottom: 0;
        }

        .compact-detail-row span {
          color: #64748b;
        }

        .compact-detail-row strong {
          color: #1e293b;
          font-weight: 600;
        }

        /* Quick Actions */
        .compact-quick-actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .compact-quick-actions .compact-action-btn {
          width: 100%;
          justify-content: center;
          font-size: 0.7rem;
          padding: 0.5rem;
        }

        /* Benefits List */
        .compact-benefits-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .compact-benefit-item {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .compact-benefit-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }

        .compact-benefit-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.7rem;
          margin-bottom: 0.125rem;
        }

        .compact-benefit-desc {
          color: #64748b;
          font-size: 0.65rem;
          line-height: 1.2;
        }

        /* Create Group Form */
        .compact-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          color: #475569;
          cursor: pointer;
        }

        .compact-checkbox {
          width: 14px;
          height: 14px;
          cursor: pointer;
        }

        .compact-rules-list {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .compact-rule-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.7rem;
          color: #475569;
        }

        .compact-rule-item:last-child {
          margin-bottom: 0;
        }

        .compact-rule-item input {
          cursor: not-allowed;
        }

        /* Toast Notification */
        .compact-toast {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          background: white;
          border-radius: 4px;
          padding: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-left: 3px solid #10b981;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          z-index: 1001;
          animation: slideIn 0.3s ease;
          max-width: 300px;
        }

        .compact-toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .compact-toast-icon {
          font-size: 1rem;
          color: #10b981;
        }

        .compact-toast-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.7rem;
          margin-bottom: 0.125rem;
        }

        .compact-toast-message {
          color: #64748b;
          font-size: 0.65rem;
          line-height: 1.2;
        }

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

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .compact-content-grid > .compact-table-section {
            grid-column: span 1;
          }
          
          .compact-quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Groups;