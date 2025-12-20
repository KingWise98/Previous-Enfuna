import React, { useState } from 'react';
import './wallet.css';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [withdrawalStep, setWithdrawalStep] = useState('method');
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    method: 'mtn',
    fee: 0,
    netAmount: 0,
    phoneNumber: '0789 009 765',
    accountName: 'Sengendo Mark',
    autoWithdrawal: true
  });
  const [ledgerFilter, setLedgerFilter] = useState('all');
  const [disputesFilter, setDisputesFilter] = useState('all');

  // Dashboard Data
  const [walletData, setWalletData] = useState({
    totalBalance: 245900,
    available: 215900,
    pending: 20000,
    held: 10000,
    todayEarnings: 20000,
    pendingPayouts: 30000,
    totalInflow: 315900,
    totalOutflow: 35000,
    netBalance: 215900
  });

  // Ledger Data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'trip-earnings',
      title: 'Trip Earnings',
      time: 'Today 10:43 AM',
      reference: 'Trip - 001',
      amount: 7000,
      isPositive: true
    },
    {
      id: 2,
      type: 'commission',
      title: 'Commission Deduction',
      time: 'Today 10:43 AM',
      reference: 'Com - 063',
      amount: 1500,
      isPositive: false
    },
    {
      id: 3,
      type: 'withdrawal',
      title: 'Withdrawal to MTN',
      time: 'Today 10:43 AM',
      reference: 'MoMo - 089600',
      amount: 5500,
      isPositive: false
    },
    {
      id: 4,
      type: 'delivery-earnings',
      title: 'Delivery Earnings',
      time: 'Today 10:43 AM',
      reference: 'TDEL - 001',
      amount: 10000,
      isPositive: true
    },
    {
      id: 5,
      type: 'bonus',
      title: 'Bonus Incentive',
      time: 'Today 10:43 AM',
      reference: 'BON - 063',
      amount: 2000,
      isPositive: true
    },
    {
      id: 6,
      type: 'penalty',
      title: 'Penalty Deductions',
      time: 'Today 10:43 AM',
      reference: 'PEN - 089600',
      amount: 2500,
      isPositive: false
    },
    {
      id: 7,
      type: 'settlement',
      title: 'Settlement Payment',
      time: 'Yesterday 10:00 PM',
      reference: 'STL - 99221',
      amount: 12500,
      isPositive: true
    }
  ]);

  // Withdrawal History
  const [withdrawals, setWithdrawals] = useState([
    {
      id: 1,
      amount: 20000,
      method: 'MTN MoMo',
      reference: 'WDL - 88322',
      status: 'pending',
      time: 'Today, 10:21 AM'
    },
    {
      id: 2,
      amount: 83000,
      method: 'Airtel Money',
      reference: 'WDL - 88322',
      status: 'success',
      time: 'Yesterday, 10:00 PM'
    },
    {
      id: 3,
      amount: 20000,
      method: 'Enfuna Agent',
      reference: 'WDL - 88322',
      status: 'failed',
      time: 'Today, 8:21 AM'
    },
    {
      id: 4,
      amount: 23000,
      method: 'Bank Account',
      reference: 'WDL - 88323',
      status: 'success',
      time: 'Today, 10:21 AM'
    }
  ]);

  // Disputes Data
  const [disputes, setDisputes] = useState([
    {
      id: 1,
      title: 'Trip Amount Under Review',
      description: 'TRIP1209. Customer Disputed fare amount',
      disputeId: 'DSP00001',
      opened: 'Today, 10:43 AM',
      reason: 'Customer disputed fare amount',
      details: 'Rider claimed fare was higher than estimated',
      status: 'pending',
      amount: 0
    },
    {
      id: 2,
      title: 'Delivery Not Completed',
      description: 'DIV988. Delivery marked incomplete by merchant',
      disputeId: 'DSP00002',
      opened: 'Yesterday, 4:43 PM',
      reason: 'Delivery marked incomplete by merchant',
      details: 'Investigated and confirmed delivery completion',
      status: 'resolved',
      resolution: 'Released to Available',
      amount: 0
    },
    {
      id: 3,
      title: 'Payment Authorization Failed',
      description: 'TRIP1205. System error during payment processing',
      disputeId: 'DSP00003',
      opened: 'Today, 9:15 AM',
      reason: 'System error during payment processing',
      status: 'resolved',
      amount: 1500
    },
    {
      id: 4,
      title: 'Trip Cancellation Issue',
      description: 'TRIP1205. Dispute over cancellation charges',
      disputeId: 'DSP00004',
      opened: 'Today, 11:30 AM',
      reason: 'Dispute over cancellation charges',
      status: 'pending',
      amount: 2300
    }
  ]);

  // Settlement Data
  const [settlements, setSettlements] = useState([
    {
      id: 1,
      amount: 12500,
      deductions: 2500,
      type: 'Commission + Adjustments',
      time: 'Yesterday, 10:00 PM',
      reference: 'MTN-TRC-88210',
      batch: 'STL - 55221',
      status: 'completed'
    },
    {
      id: 2,
      amount: 72500,
      deductions: 5000,
      type: 'Penalty Fee',
      time: '2 days ago',
      reference: 'MTN-TRC-88210',
      batch: 'STL - 55221',
      status: 'completed'
    },
    {
      id: 3,
      amount: 98000,
      deductions: 0,
      type: 'No Deductions',
      time: '3 days ago',
      reference: 'MTN-TRC-88210',
      batch: 'STL - 55221',
      status: 'completed'
    }
  ]);

  const handleWithdrawalMethodSelect = (method) => {
    let fee = 0;
    let processingTime = 'Instant (0-5 minutes)';
    
    switch(method) {
      case 'mtn':
      case 'airtel':
        fee = 0;
        processingTime = 'Instant (0-3 minutes)';
        break;
      case 'bank':
        fee = 2000;
        processingTime = '1-24 hours';
        break;
      case 'agent':
        fee = 500;
        processingTime = 'Instant';
        break;
    }
    
    setWithdrawalData({
      ...withdrawalData,
      method,
      fee,
      processingTime
    });
  };

  const handleAmountChange = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    const netAmount = numericAmount - withdrawalData.fee;
    
    setWithdrawalData({
      ...withdrawalData,
      amount: amount,
      netAmount: netAmount > 0 ? netAmount : 0
    });
  };

  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    
    if (withdrawalStep === 'method') {
      setWithdrawalStep('amount');
    } else if (withdrawalStep === 'amount') {
      setWithdrawalStep('confirm');
    } else if (withdrawalStep === 'confirm') {
      // Process withdrawal
      const newWithdrawal = {
        id: withdrawals.length + 1,
        amount: parseFloat(withdrawalData.amount),
        method: withdrawalData.method === 'mtn' ? 'MTN MoMo' : 
                withdrawalData.method === 'airtel' ? 'Airtel Money' :
                withdrawalData.method === 'bank' ? 'Bank Account' : 'Agent Payout',
        reference: `WDL - ${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'success',
        time: 'Just now'
      };
      
      setWithdrawals([newWithdrawal, ...withdrawals]);
      
      // Update wallet balance
      setWalletData({
        ...walletData,
        available: walletData.available - newWithdrawal.amount,
        totalBalance: walletData.totalBalance - newWithdrawal.amount
      });
      
      // Add to transactions
      const newTransaction = {
        id: transactions.length + 1,
        type: 'withdrawal',
        title: `Withdrawal to ${newWithdrawal.method}`,
        time: 'Just now',
        reference: newWithdrawal.reference,
        amount: newWithdrawal.amount,
        isPositive: false
      };
      
      setTransactions([newTransaction, ...transactions]);
      setWithdrawalStep('success');
    }
  };

  const resetWithdrawal = () => {
    setWithdrawalStep('method');
    setWithdrawalData({
      amount: '',
      method: 'mtn',
      fee: 0,
      netAmount: 0,
      phoneNumber: '0789 009 765',
      accountName: 'Sengendo Mark',
      autoWithdrawal: true
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (ledgerFilter === 'all') return true;
    if (ledgerFilter === 'earnings') return transaction.isPositive;
    if (ledgerFilter === 'deductions') return !transaction.isPositive && transaction.type !== 'withdrawal';
    if (ledgerFilter === 'withdrawals') return transaction.type === 'withdrawal';
    if (ledgerFilter === 'settlements') return transaction.type === 'settlement';
    return true;
  });

  const filteredDisputes = disputes.filter(dispute => {
    if (disputesFilter === 'all') return true;
    if (disputesFilter === 'pending') return dispute.status === 'pending';
    if (disputesFilter === 'resolved') return dispute.status === 'resolved';
    return true;
  });

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'resolved':
        return 'status-badge success';
      case 'pending':
        return 'status-badge pending';
      case 'failed':
        return 'status-badge failed';
      default:
        return 'status-badge';
    }
  };

  const getMethodIcon = (method) => {
    switch(method.toLowerCase()) {
      case 'mtn momo': return '📱';
      case 'airtel money': return '📲';
      case 'bank account': return '🏦';
      case 'enfuna agent': return '👤';
      default: return '💳';
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'trip-earnings': return '🚗';
      case 'delivery-earnings': return '📦';
      case 'commission': return '📊';
      case 'withdrawal': return '💰';
      case 'bonus': return '🎁';
      case 'penalty': return '⚠️';
      case 'settlement': return '🏦';
      default: return '📝';
    }
  };

  return (
    <div className="wallet-container">
      <header className="wallet-header">
        <h1>WALLET DASHBOARD</h1>
        <p>Manage your earnings and withdrawals</p>
      </header>

      <nav className="wallet-nav">
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
        <button 
          className={`nav-btn ${activeTab === 'ledger' ? 'active' : ''}`}
          onClick={() => setActiveTab('ledger')}
        >
          Ledger
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settlements' ? 'active' : ''}`}
          onClick={() => setActiveTab('settlements')}
        >
          Settlements
        </button>
        <button 
          className={`nav-btn ${activeTab === 'disputes' ? 'active' : ''}`}
          onClick={() => setActiveTab('disputes')}
        >
          Disputes
        </button>
      </nav>

      <main className="wallet-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            {/* Balance Overview */}
            <div className="balance-overview">
              <div className="total-balance-card">
                <h2>Total Wallet Balance</h2>
                <p className="total-amount">UGX {walletData.totalBalance.toLocaleString()}</p>
                <div className="balance-breakdown">
                  <div className="balance-item">
                    <span className="balance-label">Available</span>
                    <span className="balance-value">UGX {walletData.available.toLocaleString()}</span>
                  </div>
                  <div className="balance-item">
                    <span className="balance-label">Pending</span>
                    <span className="balance-value">UGX {walletData.pending.toLocaleString()}</span>
                  </div>
                  <div className="balance-item">
                    <span className="balance-label">Held</span>
                    <span className="balance-value">UGX {walletData.held.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Settlement</h3>
                    <span className="stat-time">Today 6 PM</span>
                  </div>
                  <p className="stat-amount">UGX {walletData.todayEarnings.toLocaleString()}</p>
                  <p className="stat-subtitle">#12 from yesterday</p>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Today's Earnings</h3>
                  </div>
                  <p className="stat-amount">UGX {walletData.todayEarnings.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Pending Payouts</h3>
                  </div>
                  <p className="stat-amount">UGX {walletData.pendingPayouts.toLocaleString()}</p>
                  <p className="stat-subtitle">2 Processing in 2 days</p>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Reconciliation</h3>
                  </div>
                  <button className="reconcile-btn">View Report</button>
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="financial-overview">
              <div className="overview-card">
                <h3>Total Inflow</h3>
                <p className="overview-amount">UGX {walletData.totalInflow.toLocaleString()}</p>
                <p className="overview-subtitle">Earnings this Month</p>
              </div>
              <div className="overview-card">
                <h3>Total Outflow</h3>
                <p className="overview-amount">UGX {walletData.totalOutflow.toLocaleString()}</p>
                <p className="overview-subtitle">Deductions & Withdrawals</p>
              </div>
              <div className="overview-card highlight">
                <h3>Net Balance</h3>
                <p className="overview-amount">UGX {walletData.netBalance.toLocaleString()}</p>
                <p className="overview-subtitle">Available for Withdrawal</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h3>Quick Actions</h3>
              <p className="section-subtitle">Manage your wallet with one click</p>
              <div className="action-cards">
                <button className="action-card" onClick={() => setActiveTab('withdraw')}>
                  <div className="action-icon">💰</div>
                  <h4>Withdraw</h4>
                  <p>Request instant payout</p>
                </button>
                <button className="action-card" onClick={() => setActiveTab('ledger')}>
                  <div className="action-icon">📊</div>
                  <h4>View Ledger</h4>
                  <p>See all transactions</p>
                </button>
                <div className="action-card">
                  <div className="action-icon">🔗</div>
                  <h4>Quick Links</h4>
                  <div className="quick-links">
                    <button onClick={() => setActiveTab('settlements')}>Settlements</button>
                    <button onClick={() => setActiveTab('disputes')}>Disputes</button>
                    <button>View Analytics</button>
                    <button>View Transaction History</button>
                    <button>Ledger Statements</button>
                    <button>Support</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="recent-transactions">
              <div className="section-header">
                <h3>Recent Transactions</h3>
                <button className="view-all-btn" onClick={() => setActiveTab('ledger')}>
                  View All Transactions
                </button>
              </div>
              <p className="section-subtitle">Your latest wallet activities</p>
              
              <div className="transactions-list">
                {transactions.slice(0, 3).map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="transaction-details">
                      <h4>{transaction.title}</h4>
                      <p className="transaction-time">{transaction.time}</p>
                    </div>
                    <div className={`transaction-amount ${transaction.isPositive ? 'positive' : 'negative'}`}>
                      {transaction.isPositive ? '+' : '-'} UGX {transaction.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="withdrawal-view">
            {withdrawalStep === 'method' && (
              <>
                <div className="withdrawal-header">
                  <h2>Withdrawal</h2>
                  <p>Manage your payment withdrawals and track their status</p>
                </div>

                <div className="withdrawal-stats">
                  <div className="withdrawal-stat-card">
                    <h3>Current Balance</h3>
                    <p className="stat-amount">UGX {walletData.available.toLocaleString()}</p>
                    <p className="stat-subtitle">Available for Withdrawal</p>
                  </div>
                  <div className="withdrawal-stat-card">
                    <h3>Pending</h3>
                    <p className="stat-amount">UGX {walletData.pending.toLocaleString()}</p>
                  </div>
                  <div className="withdrawal-stat-card">
                    <h3>Held</h3>
                    <p className="stat-amount">UGX {walletData.held.toLocaleString()}</p>
                  </div>
                </div>

                <div className="available-info">
                  <p>You can withdrawal upto UGX {walletData.available.toLocaleString()} from your available balance.</p>
                </div>

                <div className="withdrawal-methods">
                  <h3>Select Withdrawal Method</h3>
                  <div className="methods-grid">
                    <button 
                      className={`method-card ${withdrawalData.method === 'mtn' ? 'selected' : ''}`}
                      onClick={() => handleWithdrawalMethodSelect('mtn')}
                    >
                      <div className="method-header">
                        <div className="method-icon">📱</div>
                        <div>
                          <h4>MTN MoMo</h4>
                          <p>Instant transfer</p>
                        </div>
                      </div>
                      <div className="method-details">
                        <div className="fee-info">
                          <span>Fee:</span>
                          <span>UGX 0</span>
                        </div>
                        <div className="time-info">
                          <span>Time:</span>
                          <span>0-3 min</span>
                        </div>
                      </div>
                    </button>

                    <button 
                      className={`method-card ${withdrawalData.method === 'airtel' ? 'selected' : ''}`}
                      onClick={() => handleWithdrawalMethodSelect('airtel')}
                    >
                      <div className="method-header">
                        <div className="method-icon">📲</div>
                        <div>
                          <h4>Airtel Money</h4>
                          <p>Instant transfer</p>
                        </div>
                      </div>
                      <div className="method-details">
                        <div className="fee-info">
                          <span>Fee:</span>
                          <span>UGX 0</span>
                        </div>
                        <div className="time-info">
                          <span>Time:</span>
                          <span>0-3 min</span>
                        </div>
                      </div>
                    </button>

                    <button 
                      className={`method-card ${withdrawalData.method === 'bank' ? 'selected' : ''}`}
                      onClick={() => handleWithdrawalMethodSelect('bank')}
                    >
                      <div className="method-header">
                        <div className="method-icon">🏦</div>
                        <div>
                          <h4>Bank Account</h4>
                          <p>Secure Transfer</p>
                        </div>
                      </div>
                      <div className="method-details">
                        <div className="fee-info">
                          <span>Fee:</span>
                          <span>UGX 2,000</span>
                        </div>
                        <div className="time-info">
                          <span>Time:</span>
                          <span>1-24 hr</span>
                        </div>
                      </div>
                    </button>

                    <button 
                      className={`method-card ${withdrawalData.method === 'agent' ? 'selected' : ''}`}
                      onClick={() => handleWithdrawalMethodSelect('agent')}
                    >
                      <div className="method-header">
                        <div className="method-icon">👤</div>
                        <div>
                          <h4>Agent Payout</h4>
                          <p>Immediate Pickup</p>
                        </div>
                      </div>
                      <div className="method-details">
                        <div className="fee-info">
                          <span>Fee:</span>
                          <span>UGX 500</span>
                        </div>
                        <div className="time-info">
                          <span>Time:</span>
                          <span>Instant</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="withdrawal-actions">
                  <button className="cancel-btn" onClick={() => setActiveTab('dashboard')}>
                    Cancel
                  </button>
                  <button className="continue-btn" onClick={handleWithdrawalSubmit}>
                    Continue to Amount
                  </button>
                </div>
              </>
            )}

            {withdrawalStep === 'amount' && (
              <>
                <div className="withdrawal-header">
                  <h2>Withdrawal</h2>
                  <p>Enter amount to withdraw</p>
                </div>

                <div className="withdrawal-stats">
                  <div className="withdrawal-stat-card">
                    <h3>Current Balance</h3>
                    <p className="stat-amount">UGX {walletData.available.toLocaleString()}</p>
                    <p className="stat-subtitle">Available for Withdrawal</p>
                  </div>
                </div>

                <div className="withdrawal-form">
                  <div className="withdrawal-type">
                    <h3>Amount to Withdraw</h3>
                    <div className="type-buttons">
                      <button 
                        className={`type-btn ${withdrawalData.autoWithdrawal ? 'active' : ''}`}
                        onClick={() => setWithdrawalData({...withdrawalData, autoWithdrawal: true})}
                      >
                        Auto Withdrawal (free Charge)
                      </button>
                      <button 
                        className={`type-btn ${!withdrawalData.autoWithdrawal ? 'active' : ''}`}
                        onClick={() => setWithdrawalData({...withdrawalData, autoWithdrawal: false})}
                      >
                        Instant Withdrawal (fee Charged)
                      </button>
                    </div>
                  </div>

                  <div className="amount-input-group">
                    <label htmlFor="amount">Amount (UGX)</label>
                    <div className="amount-input-wrapper">
                      <input
                        type="number"
                        id="amount"
                        value={withdrawalData.amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        max={walletData.available}
                        className="amount-input"
                      />
                      <span className="currency">UGX</span>
                    </div>
                    <p className="available-info">Available UGX {walletData.available.toLocaleString()}</p>
                  </div>

                  <div className="fee-info-card">
                    <div className="fee-item">
                      <span>Withdrawal Fee:</span>
                      <span>UGX {withdrawalData.fee.toLocaleString()}</span>
                    </div>
                    <div className="fee-item">
                      <span>Processing Time:</span>
                      <span>{withdrawalData.processingTime || 'Instant (0-5 minutes)'}</span>
                    </div>
                    <div className="fee-item total">
                      <span>Net Amount:</span>
                      <span>UGX {withdrawalData.netAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="payout-destination">
                    <h3>Payout Destination</h3>
                    <div className="destination-details">
                      <div className="detail-item">
                        <span>MTN Number</span>
                        <strong>{withdrawalData.phoneNumber}</strong>
                      </div>
                      <div className="detail-item">
                        <span>Receiptient Name (Account Name)</span>
                        <strong>{withdrawalData.accountName}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="withdrawal-actions">
                  <button className="cancel-btn" onClick={() => setWithdrawalStep('method')}>
                    Back
                  </button>
                  <button 
                    className="continue-btn" 
                    onClick={handleWithdrawalSubmit}
                    disabled={!withdrawalData.amount || parseFloat(withdrawalData.amount) > walletData.available}
                  >
                    Continue to Confirmation
                  </button>
                </div>
              </>
            )}

            {withdrawalStep === 'confirm' && (
              <div className="confirmation-view">
                <div className="confirmation-header">
                  <h2>Confirm Withdrawal</h2>
                </div>

                <div className="confirmation-details">
                  <table className="confirmation-table">
                    <tbody>
                      <tr>
                        <td>Amount</td>
                        <td>UGX {parseFloat(withdrawalData.amount).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Fee</td>
                        <td>UGX {withdrawalData.fee.toLocaleString()}</td>
                      </tr>
                      <tr className="total-row">
                        <td>You'll Receive</td>
                        <td><strong>UGX {withdrawalData.netAmount.toLocaleString()}</strong></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="reference-info">
                    <p>Reference Code</p>
                    <p className="reference-code">WD - 924890022</p>
                  </div>

                  <div className="destination-info">
                    <p>Withdrawing to <strong>MTN MoMo</strong></p>
                    <p>Receiptient: <strong>{withdrawalData.phoneNumber} ({withdrawalData.accountName})</strong></p>
                  </div>
                </div>

                <div className="withdrawal-actions">
                  <button className="cancel-btn" onClick={() => setWithdrawalStep('amount')}>
                    Cancel
                  </button>
                  <button className="confirm-btn" onClick={handleWithdrawalSubmit}>
                    Confirm Withdrawal
                  </button>
                </div>
              </div>
            )}

            {withdrawalStep === 'success' && (
              <div className="success-view">
                <div className="success-header">
                  <h2>Withdrawal Successful</h2>
                </div>

                <div className="success-content">
                  <div className="success-amount">
                    <p>Amount Withdrawn</p>
                    <h3>UGX {parseFloat(withdrawalData.amount).toLocaleString()}</h3>
                  </div>

                  <div className="success-details">
                    <p>To MTN MoMo</p>
                    <p className="reference-code">WD - 924890022</p>
                    <p>Receiptent: <strong>{withdrawalData.phoneNumber} ({withdrawalData.accountName})</strong></p>
                  </div>

                  <div className="success-note">
                    <p>You can track your withdrawal status in your transaction history. Processing typically takes 1-24 hours depending on the method.</p>
                  </div>
                </div>

                <div className="withdrawal-actions">
                  <button className="dashboard-btn" onClick={() => {
                    resetWithdrawal();
                    setActiveTab('dashboard');
                  }}>
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}

            {withdrawalStep === 'history' && (
              <div className="withdrawal-history">
                <div className="history-header">
                  <h2>Recent Withdrawals</h2>
                </div>

                <div className="withdrawal-stats">
                  <div className="withdrawal-stat-card">
                    <h3>Total Withdrawn</h3>
                    <p className="stat-amount">+12.5%</p>
                  </div>
                  <div className="withdrawal-stat-card">
                    <h3>Pending</h3>
                    <p className="stat-amount">UGX 20,000</p>
                    <p className="stat-subtitle">1 request</p>
                  </div>
                  <div className="withdrawal-stat-card">
                    <h3>Failed</h3>
                    <p className="stat-amount">UGX 12,000</p>
                    <p className="stat-subtitle">Retry Needed</p>
                  </div>
                  <div className="withdrawal-stat-card">
                    <h3>Successful</h3>
                    <p className="stat-amount">UGX 25,000</p>
                    <p className="stat-subtitle">last 24hrs</p>
                  </div>
                </div>

                <div className="withdrawals-list">
                  {withdrawals.map(withdrawal => (
                    <div key={withdrawal.id} className="withdrawal-item">
                      <div className="withdrawal-info">
                        <div className="withdrawal-icon">
                          {getMethodIcon(withdrawal.method)}
                        </div>
                        <div className="withdrawal-details">
                          <h4>UGX {withdrawal.amount.toLocaleString()}</h4>
                          <p>{withdrawal.method}</p>
                          <p className="withdrawal-reference">{withdrawal.reference}</p>
                        </div>
                      </div>
                      <div className="withdrawal-status">
                        <span className={getStatusBadgeClass(withdrawal.status)}>
                          {withdrawal.status}
                        </span>
                        <p className="withdrawal-time">{withdrawal.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="ledger-view">
            <div className="ledger-header">
              <h2>Ledger Statements</h2>
              <p>Manage your earnings and withdrawals</p>
            </div>

            <div className="balance-summary">
              <div className="total-balance">
                <p>Total Wallet Balance</p>
                <h2>UGX {walletData.totalBalance.toLocaleString()}</h2>
              </div>
              <div className="balance-breakdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Available</th>
                      <th>Pending</th>
                      <th>Held</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>UGX {walletData.available.toLocaleString()}</strong></td>
                      <td><strong>UGX {walletData.pending.toLocaleString()}</strong></td>
                      <td><strong>UGX {walletData.held.toLocaleString()}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ledger-filters">
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${ledgerFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setLedgerFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${ledgerFilter === 'earnings' ? 'active' : ''}`}
                  onClick={() => setLedgerFilter('earnings')}
                >
                  Earnings
                </button>
                <button 
                  className={`filter-btn ${ledgerFilter === 'deductions' ? 'active' : ''}`}
                  onClick={() => setLedgerFilter('deductions')}
                >
                  Deductions
                </button>
                <button 
                  className={`filter-btn ${ledgerFilter === 'withdrawals' ? 'active' : ''}`}
                  onClick={() => setLedgerFilter('withdrawals')}
                >
                  Withdrawals
                </button>
                <button 
                  className={`filter-btn ${ledgerFilter === 'settlements' ? 'active' : ''}`}
                  onClick={() => setLedgerFilter('settlements')}
                >
                  Settlements
                </button>
              </div>
              
              <div className="search-filter">
                <select className="filter-select">
                  <option>Trip ID</option>
                  <option>Reference</option>
                  <option>Date</option>
                </select>
              </div>
            </div>

            <div className="transactions-count">
              <p>{filteredTransactions.length} transactions found</p>
            </div>

            <div className="ledger-transactions">
              {filteredTransactions.map(transaction => (
                <div key={transaction.id} className="ledger-transaction">
                  <div className="transaction-icon">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="transaction-info">
                    <h4>{transaction.title}</h4>
                    <p className="transaction-time">{transaction.time} • {transaction.reference}</p>
                  </div>
                  <div className={`transaction-amount ${transaction.isPositive ? 'positive' : 'negative'}`}>
                    {transaction.isPositive ? '+' : '-'} UGX {transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="export-actions">
              <button className="export-btn">
                EXPORT CSV
              </button>
              <button className="download-btn">
                DOWNLOAD
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settlements' && (
          <div className="settlements-view">
            <div className="settlements-header">
              <h2>Ledger Settlements</h2>
              <p>Manage your earnings and withdrawals</p>
            </div>

            <div className="settlement-overview">
              <div className="total-balance-card">
                <h2>Total Wallet Balance</h2>
                <p className="total-amount">UGX {walletData.totalBalance.toLocaleString()}</p>
                <div className="balance-breakdown-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Available</th>
                        <th>Pending</th>
                        <th>Held</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>UGX {walletData.available.toLocaleString()}</strong></td>
                        <td><strong>UGX {walletData.pending.toLocaleString()}</strong></td>
                        <td><strong>UGX {walletData.held.toLocaleString()}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="settlement-stats">
                <div className="settlement-stat">
                  <h3>Total Settled</h3>
                  <p className="stat-amount">1,280,000</p>
                  <p className="stat-subtitle">Last 30 days</p>
                </div>
                <div className="settlement-stat">
                  <h3>Pending</h3>
                  <p className="stat-amount">UGX 20,000</p>
                  <p className="stat-subtitle">Next Settlement</p>
                </div>
                <div className="settlement-stat">
                  <h3>Deductions</h3>
                  <p className="stat-amount">UGX 12,000</p>
                  <p className="stat-subtitle">Applied</p>
                </div>
              </div>
            </div>

            <div className="next-cycle">
              <div className="cycle-header">
                <h3>Next Cycle</h3>
                <span className="cycle-tag">Auto Settlement</span>
              </div>
              <p className="cycle-time">Today 10:00 PM</p>
            </div>

            <div className="settlement-details">
              <div className="settlement-card">
                <h3>Pending Settlement</h3>
                <p className="settlement-amount">UGX 34,000</p>
                <p className="settlement-subtitle">Includes 3 Quick Trips, 1 Delivery</p>
                <p className="settlement-time">Scheduled For Today, 10:00 PM</p>
              </div>

              <div className="settlement-card">
                <h3>Auto Deductions</h3>
                <div className="deductions-list">
                  <div className="deduction-item">
                    <span>Commission Fees</span>
                    <span>UGX 8,500</span>
                  </div>
                  <div className="deduction-item">
                    <span>Penalty Fees</span>
                    <span>UGX 2,000</span>
                  </div>
                  <div className="deduction-item">
                    <span>Manual Adjustment</span>
                    <span>UGX 2,000</span>
                  </div>
                </div>
                <div className="batch-info">
                  <span>BATCH ID</span>
                  <strong># STL - 99221</strong>
                </div>
                <div className="total-deductions">
                  <span>Total</span>
                  <strong>UGX 12,500</strong>
                </div>
              </div>
            </div>

            <div className="settlement-history">
              <h3>Settlement History</h3>
              <div className="history-list">
                {settlements.map(settlement => (
                  <div key={settlement.id} className="history-item">
                    <div className="history-amount">
                      <h4>UGX {settlement.amount.toLocaleString()}</h4>
                      <p className="deduction-amount">Deductions: UGX {settlement.deductions.toLocaleString()}</p>
                    </div>
                    <div className="history-details">
                      <p className="history-type">{settlement.type}</p>
                      <p className="history-time">{settlement.time}</p>
                      <p className="history-reference">Ref: {settlement.reference}</p>
                      <p className="history-batch">Batch: {settlement.batch}</p>
                    </div>
                    <div className="history-status">
                      <span className={getStatusBadgeClass(settlement.status)}>
                        {settlement.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="export-actions">
              <button className="export-btn">
                EXPORT CSV
              </button>
              <button className="download-btn">
                DOWNLOAD
              </button>
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="disputes-view">
            <div className="disputes-header">
              <h2>Disputed Transactions</h2>
              <p>Manage and track all held and disputed amounts</p>
            </div>

            <div className="disputes-stats">
              <div className="dispute-stat-card">
                <h3>Total Held Amount</h3>
                <p className="stat-amount">UGX 12,400</p>
                <p className="stat-subtitle">4 disputes</p>
              </div>
              <div className="dispute-stat-card">
                <h3>Pending Review</h3>
                <p className="stat-amount">UGX 5,400</p>
                <p className="stat-subtitle">2 active disputes</p>
              </div>
              <div className="dispute-stat-card">
                <h3>Received this month</h3>
                <p className="stat-amount">2</p>
                <p className="stat-subtitle">Disputes Cleared</p>
              </div>
            </div>

            <div className="disputes-filters">
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${disputesFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setDisputesFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${disputesFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setDisputesFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`filter-btn ${disputesFilter === 'resolved' ? 'active' : ''}`}
                  onClick={() => setDisputesFilter('resolved')}
                >
                  Resolved
                </button>
              </div>
              
              <div className="search-filter">
                <select className="filter-select">
                  <option>Date</option>
                  <option>Type</option>
                  <option>Trip ID</option>
                </select>
              </div>
            </div>

            <div className="disputes-count">
              <p>{filteredDisputes.length} Disputes found</p>
            </div>

            <div className="disputes-list">
              {filteredDisputes.map(dispute => (
                <div key={dispute.id} className="dispute-card">
                  <div className="dispute-header">
                    <div>
                      <h3>{dispute.title}</h3>
                      <p className="dispute-description">{dispute.description}</p>
                    </div>
                    <div className="dispute-amount">
                      {dispute.amount > 0 && (
                        <span className="amount-negative">-UGX {dispute.amount.toLocaleString()}</span>
                      )}
                      <span className={getStatusBadgeClass(dispute.status)}>
                        {dispute.status}
                      </span>
                    </div>
                  </div>

                  <div className="dispute-details">
                    <div className="detail-row">
                      <span className="detail-label">Dispute ID:</span>
                      <span className="detail-value">{dispute.disputeId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Opened:</span>
                      <span className="detail-value">{dispute.opened}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Reason:</span>
                      <span className="detail-value">{dispute.reason}</span>
                    </div>
                    {dispute.details && (
                      <div className="detail-row">
                        <span className="detail-label">Description:</span>
                        <span className="detail-value">{dispute.details}</span>
                      </div>
                    )}
                    {dispute.resolution && (
                      <div className="detail-row">
                        <span className="detail-label">Resolution:</span>
                        <span className="detail-value resolved">{dispute.resolution}</span>
                      </div>
                    )}
                  </div>

                  <div className="dispute-actions">
                    {dispute.status === 'pending' && (
                      <>
                        <button className="support-btn">Contact Support</button>
                        <button className="upload-btn">Upload Proof</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wallet;