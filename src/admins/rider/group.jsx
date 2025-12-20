import React, { useState } from 'react';
import './group.css';

const Groups = () => {
  const [activeTab, setActiveTab] = useState('myGroups');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
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
      description: 'Weekly Savings group for motorcycle riders in central kampala',
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
      description: 'Emergency fund support for unexpected expenses',
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
      description: 'Regular savings for bike maintenance and repairs',
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
      description: 'Weekly Savings group for motorcycle riders in central kampala',
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
      description: 'Save for bike upgrades and modifications',
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
      description: 'Emergency support fund for medical and urgent needs',
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
      description: 'Monthly rent savings for rider accommodations',
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

  // Analytics data
  const analyticsData = {
    activeGroups: 3,
    totalContributions: 120000,
    totalMembers: 14,
    groupPerformance: [
      { month: 'Jan', value: 65 },
      { month: 'Feb', value: 78 },
      { month: 'Mar', value: 72 },
      { month: 'Apr', value: 85 },
      { month: 'May', value: 90 },
      { month: 'Jun', value: 88 }
    ]
  };

  const stats = {
    activeGroups: myGroups.length,
    totalContributions: myGroups.reduce((sum, group) => sum + group.totalPool, 0),
    nextContributions: myGroups.filter(g => g.nextContribution === '2 days').length
  };

  const handleJoinGroup = (groupId) => {
    setAvailableGroups(availableGroups.map(group => 
      group.id === groupId ? { ...group, isMember: true, members: group.members + 1 } : group
    ));
    
    const groupToJoin = availableGroups.find(g => g.id === groupId);
    setMyGroups([...myGroups, {
      id: myGroups.length + 1,
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
    }]);
  };

  const handleContribute = (groupId) => {
    setMyGroups(myGroups.map(group => {
      if (group.id === groupId) {
        const newTotal = group.totalPool + group.contribution;
        const newProgress = (group.members / group.maxMembers) * 100;
        
        // Add to contributions history
        const newContribution = {
          id: contributions.length + 1,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          group: group.name,
          amount: group.contribution,
          status: 'Completed',
          type: group.type.charAt(0).toUpperCase() + group.type.slice(1),
          receipt: `receipt_${Date.now()}.pdf`
        };
        
        setContributions([newContribution, ...contributions]);
        
        return {
          ...group,
          totalPool: newTotal,
          progress: newProgress
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
      const newGroupObj = {
        id: myGroups.length + 1,
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
    }
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
      case 'savings': return '#0033cc';
      case 'emergency': return '#ff4444';
      case 'spares': return '#00aa44';
      default: return '#666';
    }
  };

  return (
    <div className="groups-container">
      <header className="groups-header">
        <h1>GROUP FUNDING AND EARNINGS</h1>
        <p>Join forces with other riders to save, invest and access group benefits</p>
      </header>

      <div className="dashboard-overview">
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Active Groups</h3>
            <p className="stat-number">{stats.activeGroups}</p>
          </div>
          <div className="stat-card">
            <h3>Total Contributions</h3>
            <p className="stat-number">UGX {stats.totalContributions.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Next Contributions</h3>
            <p className="stat-number">{stats.nextContributions} days</p>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn contribute-btn">Make Contribution</button>
            <button className="action-btn withdraw-btn">Request Withdrawal</button>
            <button className="action-btn invite-btn">Invite Riders</button>
          </div>
        </div>

        <div className="benefits-section">
          <h3>Group Benefits</h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h4>Collective Security</h4>
              <p>Emergency group Support</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h4>Better Loan Rates</h4>
              <p>Group Negotiation Power</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h4>Group Rewards</h4>
              <p>Collective achievement Bonuses</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="groups-nav">
        <button 
          className={`nav-btn ${activeTab === 'myGroups' ? 'active' : ''}`}
          onClick={() => setActiveTab('myGroups')}
        >
          My Groups
        </button>
        <button 
          className={`nav-btn ${activeTab === 'allGroups' ? 'active' : ''}`}
          onClick={() => setActiveTab('allGroups')}
        >
          All Groups
        </button>
        <button 
          className={`nav-btn ${activeTab === 'contributions' ? 'active' : ''}`}
          onClick={() => setActiveTab('contributions')}
        >
          Contributions
        </button>
        <button 
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Group Analytics
        </button>
      </nav>

      <main className="groups-content">
        {activeTab === 'myGroups' && (
          <div className="my-groups-view">
            <div className="content-header">
              <h2>My Active Groups</h2>
              <div className="header-actions">
                <button className="join-group-btn" onClick={() => setActiveTab('allGroups')}>
                  Join Group
                </button>
                <button className="create-group-btn" onClick={() => setShowCreateGroup(true)}>
                  + Create Group
                </button>
              </div>
            </div>

            <div className="groups-grid">
              {myGroups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-header">
                    <div>
                      <h3>{group.name}</h3>
                      <p className="group-description">{group.description}</p>
                    </div>
                    <span className={`group-type ${group.type}`}>
                      {group.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="group-stats">
                    <div className="stat-item">
                      <span className="stat-label">Members</span>
                      <span className="stat-value">{group.members}/{group.maxMembers}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Contribution</span>
                      <span className="stat-value">UGX {group.contribution.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Pool</span>
                      <span className="stat-value">UGX {group.totalPool.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Frequency</span>
                      <span className="stat-value">{group.frequency}</span>
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Group Progress</span>
                      <span>{group.progress.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${group.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="group-actions">
                    <button 
                      className="action-btn contribute-action"
                      onClick={() => handleContribute(group.id)}
                    >
                      Contribute
                    </button>
                    <button className="action-btn view-action">
                      View Details
                    </button>
                    <button className="action-btn invite-action">
                      Invite
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-content">
              <div className="insights-section">
                <h3>Group Insights</h3>
                <div className="insight-item">
                  <span>Most Active Group</span>
                  <strong>Kampala Boda Savers</strong>
                </div>
                <div className="insight-item">
                  <span>Highest Contribution</span>
                  <strong>UGX 100,000</strong>
                </div>
                <div className="performance-chart">
                  <h4>Group Performance</h4>
                  <div className="chart-placeholder">
                    {/* Chart would go here */}
                    <div className="chart-bar" style={{ height: '80%' }}></div>
                    <div className="chart-bar" style={{ height: '60%' }}></div>
                    <div className="chart-bar" style={{ height: '90%' }}></div>
                    <div className="chart-bar" style={{ height: '75%' }}></div>
                  </div>
                </div>
              </div>

              <div className="updates-section">
                <h3>Group Updates</h3>
                <div className="update-item">
                  <div className="update-icon">👤</div>
                  <div>
                    <p><strong>New Member Joined</strong></p>
                    <p>Marita Joined Emergency Fund Circle</p>
                  </div>
                </div>
                <div className="update-item">
                  <div className="update-icon">🎯</div>
                  <div>
                    <p><strong>Group Milestone</strong></p>
                    <p>Bike Upgrade Fund reached 50% target</p>
                  </div>
                </div>
                <div className="update-item">
                  <div className="update-icon">⏰</div>
                  <div>
                    <p><strong>Contribution Due</strong></p>
                    <p>Kampala Boda Savers - 2 days left</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'allGroups' && (
          <div className="all-groups-view">
            <div className="content-header">
              <h2>Available Groups</h2>
              <div className="filters">
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${groupFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setGroupFilter('all')}
                  >
                    All Types
                  </button>
                  <button 
                    className={`filter-btn ${groupFilter === 'public' ? 'active' : ''}`}
                    onClick={() => setGroupFilter('public')}
                  >
                    Public
                  </button>
                  <button 
                    className={`filter-btn ${groupFilter === 'private' ? 'active' : ''}`}
                    onClick={() => setGroupFilter('private')}
                  >
                    Private
                  </button>
                </div>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            <div className="groups-list">
              {filteredGroups.map(group => (
                <div key={group.id} className="available-group-card">
                  <div className="group-info">
                    <div className="group-main-info">
                      <h3>{group.name}</h3>
                      <span className={`group-type-tag ${group.type}`}>
                        {group.type.toUpperCase()}
                      </span>
                      <p className="group-desc">{group.description}</p>
                    </div>
                    
                    <div className="group-details">
                      <div className="detail-item">
                        <span className="detail-label">Members</span>
                        <span className="detail-value">{group.members}/{group.maxMembers}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Contribution</span>
                        <span className="detail-value">UGX {group.contribution.toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Frequency</span>
                        <span className="detail-value">{group.frequency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="group-action">
                    {group.isMember ? (
                      <button className="already-member-btn" disabled>
                        Already Member
                      </button>
                    ) : (
                      <button 
                        className="join-group-action"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="contributions-view">
            <div className="content-header">
              <h2>Contribution History</h2>
            </div>

            <div className="contributions-table-container">
              <table className="contributions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Group</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map(contribution => (
                    <tr key={contribution.id}>
                      <td>{contribution.date}</td>
                      <td>
                        <div className="group-cell">
                          <div className="group-color-dot" style={{ backgroundColor: getContributionColor(contribution.type) }}></div>
                          {contribution.group}
                        </div>
                      </td>
                      <td className="amount-cell">UGX {contribution.amount.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${contribution.status.toLowerCase()}`}>
                          {contribution.status}
                        </span>
                      </td>
                      <td>
                        <span className="type-badge" style={{ backgroundColor: getContributionColor(contribution.type) }}>
                          {contribution.type}
                        </span>
                      </td>
                      <td>
                        {contribution.receipt ? (
                          <button className="receipt-btn">
                            Receipt
                          </button>
                        ) : (
                          <span className="no-receipt">No Receipt</span>
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
            <div className="content-header">
              <h2>Analytics</h2>
            </div>

            <div className="analytics-stats">
              <div className="analytics-stat-card">
                <h3>Active Groups</h3>
                <p className="analytics-stat-number">{analyticsData.activeGroups}</p>
              </div>
              <div className="analytics-stat-card">
                <h3>Total Contributions</h3>
                <p className="analytics-stat-number">UGX {analyticsData.totalContributions.toLocaleString()}</p>
              </div>
              <div className="analytics-stat-card">
                <h3>Total Members</h3>
                <p className="analytics-stat-number">{analyticsData.totalMembers}</p>
              </div>
            </div>

            <div className="analytics-charts">
              <div className="chart-section">
                <h3>Group Performance</h3>
                <div className="performance-metrics">
                  <div className="performance-card">
                    <div className="performance-header">
                      <h4>Kampala Boda Savers</h4>
                      <div className="performance-stats">
                        <div className="stat-item">
                          <span>Monthly Growth</span>
                          <span className="positive">+15%</span>
                        </div>
                        <div className="stat-item">
                          <span>Member Activity</span>
                          <span>92%</span>
                        </div>
                      </div>
                    </div>
                    <div className="performance-body">
                      <div className="pool-amount">UGX 400,000</div>
                      <div className="next-payout">
                        <span>Next Payout</span>
                        <strong>2025-12-31</strong>
                      </div>
                    </div>
                  </div>

                  <div className="performance-card">
                    <div className="performance-header">
                      <h4>Emergency Fund Circle</h4>
                      <div className="performance-stats">
                        <div className="stat-item">
                          <span>Monthly Growth</span>
                          <span className="positive">+8%</span>
                        </div>
                        <div className="stat-item">
                          <span>Member Activity</span>
                          <span>78%</span>
                        </div>
                      </div>
                    </div>
                    <div className="performance-body">
                      <div className="pool-amount">UGX 60,000</div>
                      <div className="next-payout">
                        <span>Next Payout</span>
                        <strong>2025-12-15</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="modal-overlay">
          <div className="create-group-modal">
            <div className="modal-header">
              <h2>Create New Group</h2>
              <button className="close-modal" onClick={() => setShowCreateGroup(false)}>
                ×
              </button>
            </div>

            <div className="creation-steps">
              <div className="step-indicator">
                <div className={`step ${createStep >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Group Details</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${createStep >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Contribution Setup</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${createStep >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">Rules and Settings</span>
                </div>
              </div>

              <form onSubmit={handleCreateGroup} className="create-group-form">
                {createStep === 1 && (
                  <div className="form-step">
                    <div className="form-group">
                      <label htmlFor="groupName">Group Name</label>
                      <input
                        type="text"
                        id="groupName"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                        placeholder="Enter group name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="groupDescription">Group Description</label>
                      <textarea
                        id="groupDescription"
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                        placeholder="Describe the purpose of this group"
                        rows="4"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Group Type</label>
                      <div className="type-buttons">
                        {['savings', 'emergency', 'spares', 'investment'].map(type => (
                          <button
                            key={type}
                            type="button"
                            className={`type-option ${newGroup.type === type ? 'selected' : ''}`}
                            onClick={() => setNewGroup({...newGroup, type})}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="maxMembers">Maximum Number of Members</label>
                        <input
                          type="number"
                          id="maxMembers"
                          value={newGroup.maxMembers}
                          onChange={(e) => setNewGroup({...newGroup, maxMembers: e.target.value})}
                          min="2"
                          max="50"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="targetAmount">Target Amount (UGX) - Optional</label>
                        <input
                          type="number"
                          id="targetAmount"
                          value={newGroup.targetAmount}
                          onChange={(e) => setNewGroup({...newGroup, targetAmount: e.target.value})}
                          placeholder="Optional target amount"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={newGroup.isPublic}
                          onChange={(e) => setNewGroup({...newGroup, isPublic: e.target.checked})}
                        />
                        <span>Public Group (Visible to all Riders)</span>
                      </label>
                    </div>
                  </div>
                )}

                {createStep === 2 && (
                  <div className="form-step">
                    <div className="form-group">
                      <label htmlFor="contributionAmount">Contribution Amount (UGX)</label>
                      <input
                        type="number"
                        id="contributionAmount"
                        value={newGroup.contributionAmount}
                        onChange={(e) => setNewGroup({...newGroup, contributionAmount: e.target.value})}
                        placeholder="Amount per contribution"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Contribution Frequency</label>
                      <div className="frequency-buttons">
                        {['weekly', 'bi-weekly', 'monthly', 'quarterly'].map(freq => (
                          <button
                            key={freq}
                            type="button"
                            className={`frequency-option ${newGroup.frequency === freq ? 'selected' : ''}`}
                            onClick={() => setNewGroup({...newGroup, frequency: freq})}
                          >
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="adminFee">Administration Fee (%) - Optional</label>
                      <input
                        type="number"
                        id="adminFee"
                        value={newGroup.adminFee}
                        onChange={(e) => setNewGroup({...newGroup, adminFee: e.target.value})}
                        placeholder="Optional admin fee percentage"
                        min="0"
                        max="10"
                        step="0.1"
                      />
                    </div>
                  </div>
                )}

                {createStep === 3 && (
                  <div className="form-step">
                    <div className="form-group">
                      <label htmlFor="groupRules">Group Rules and Guidelines</label>
                      <textarea
                        id="groupRules"
                        value={newGroup.rules}
                        onChange={(e) => setNewGroup({...newGroup, rules: e.target.value})}
                        placeholder="Define rules for contributions, withdrawals, penalties, etc."
                        rows="8"
                      />
                    </div>

                    <div className="rules-checklist">
                      <h4>Default Rules Applied</h4>
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked disabled />
                        <span>Late contributions incur 5% penalty</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked disabled />
                        <span>Withdrawals require 24 hours notice</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked disabled />
                        <span>Emergency withdrawals available</span>
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked disabled />
                        <span>Monthly transparency reports</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  {createStep > 1 && (
                    <button 
                      type="button" 
                      className="back-btn"
                      onClick={() => setCreateStep(createStep - 1)}
                    >
                      Back
                    </button>
                  )}
                  <button type="submit" className="submit-btn">
                    {createStep === 3 ? 'Create Group' : 'Continue'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowCreateGroup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;