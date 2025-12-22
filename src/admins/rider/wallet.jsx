"use client"

import { useState, useEffect, useRef } from "react"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

const Wallet = () => {
  const [currentView, setCurrentView] = useState("dashboard")
  const [withdrawalStep, setWithdrawalStep] = useState('method')
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    method: 'mtn',
    fee: 0,
    netAmount: 0,
    phoneNumber: '0789 009 765',
    accountName: 'Sengendo Mark',
    autoWithdrawal: true,
    processingTime: 'Instant (0-3 minutes)'
  })
  const [ledgerFilter, setLedgerFilter] = useState('all')
  const [disputesFilter, setDisputesFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState("")
  const [showQR, setShowQR] = useState(false)
  const [showWithdrawalSuccess, setShowWithdrawalSuccess] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  
  const receiptRef = useRef(null)

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
  })

  // Ledger Data
  const [transactions] = useState([
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
  ])

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
  ])

  // Disputes Data
  const [disputes] = useState([
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
  ])

  // Settlement Data
  const [settlements] = useState([
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
  ])

  // Handle body scrolling when modals are open
  useEffect(() => {
    if (showQR || showWithdrawalSuccess || showReceipt) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [showQR, showWithdrawalSuccess, showReceipt])

  const handleWithdrawalMethodSelect = (method) => {
    let fee = 0
    let processingTime = 'Instant (0-5 minutes)'
    
    switch(method) {
      case 'mtn':
      case 'airtel':
        fee = 0
        processingTime = 'Instant (0-3 minutes)'
        break
      case 'bank':
        fee = 2000
        processingTime = '1-24 hours'
        break
      case 'agent':
        fee = 500
        processingTime = 'Instant'
        break
    }
    
    setWithdrawalData({
      ...withdrawalData,
      method,
      fee,
      processingTime
    })
  }

  const handleAmountChange = (amount) => {
    const numericAmount = parseFloat(amount) || 0
    const netAmount = numericAmount - withdrawalData.fee
    
    setWithdrawalData({
      ...withdrawalData,
      amount: amount,
      netAmount: netAmount > 0 ? netAmount : 0
    })
  }

  const handleWithdrawalSubmit = (e) => {
    e.preventDefault()
    
    if (withdrawalStep === 'method') {
      setWithdrawalStep('amount')
    } else if (withdrawalStep === 'amount') {
      setWithdrawalStep('confirm')
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
      }
      
      setWithdrawals([newWithdrawal, ...withdrawals])
      
      // Update wallet balance
      setWalletData({
        ...walletData,
        available: walletData.available - newWithdrawal.amount,
        totalBalance: walletData.totalBalance - newWithdrawal.amount
      })
      
      // Generate receipt
      const receipt = {
        id: newWithdrawal.reference,
        amount: newWithdrawal.amount,
        method: newWithdrawal.method,
        fee: withdrawalData.fee,
        netAmount: withdrawalData.netAmount,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        accountName: withdrawalData.accountName,
        phoneNumber: withdrawalData.phoneNumber,
        processingTime: withdrawalData.processingTime
      }
      
      setReceiptData(receipt)
      setWithdrawalStep('success')
      setShowWithdrawalSuccess(true)
    }
  }

  const resetWithdrawal = () => {
    setWithdrawalStep('method')
    setWithdrawalData({
      amount: '',
      method: 'mtn',
      fee: 0,
      netAmount: 0,
      phoneNumber: '0789 009 765',
      accountName: 'Sengendo Mark',
      autoWithdrawal: true,
      processingTime: 'Instant (0-3 minutes)'
    })
    setShowWithdrawalSuccess(false)
  }

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'resolved':
        return 'status-badge success'
      case 'pending':
        return 'status-badge pending'
      case 'failed':
        return 'status-badge failed'
      default:
        return 'status-badge'
    }
  }

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'trip-earnings': return '🚗'
      case 'delivery-earnings': return '📦'
      case 'commission': return '📊'
      case 'withdrawal': return '💰'
      case 'bonus': return '🎁'
      case 'penalty': return '⚠️'
      case 'settlement': return '🏦'
      default: return '📝'
    }
  }

  const getMethodIcon = (method) => {
    switch(method.toLowerCase()) {
      case 'mtn momo': return '📱'
      case 'airtel money': return '📲'
      case 'bank account': return '🏦'
      case 'enfuna agent': return '👤'
      default: return '💳'
    }
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (ledgerFilter === 'all') return true
    if (ledgerFilter === 'earnings') return transaction.isPositive
    if (ledgerFilter === 'deductions') return !transaction.isPositive && transaction.type !== 'withdrawal'
    if (ledgerFilter === 'withdrawals') return transaction.type === 'withdrawal'
    if (ledgerFilter === 'settlements') return transaction.type === 'settlement'
    return true
  })

  // Filter disputes
  const filteredDisputes = disputes.filter(dispute => {
    if (disputesFilter === 'all') return true
    if (disputesFilter === 'pending') return dispute.status === 'pending'
    if (disputesFilter === 'resolved') return dispute.status === 'resolved'
    return true
  })

  // Filter settlements
  const filteredSettlements = settlements.filter(settlement => {
    if (!searchQuery) return true
    return settlement.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
           settlement.batch.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Export functionality
  const exportToPDF = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = canvas.height * imgWidth / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`withdrawal-receipt-${receiptData?.id}.pdf`)
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTransactions)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions")
    XLSX.writeFile(workbook, `wallet-transactions-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportSettlementsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSettlements)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Settlements")
    XLSX.writeFile(workbook, `settlements-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTransactions)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wallet-transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Share functionality
  const shareReceipt = async () => {
    if (receiptRef.current && navigator.share) {
      try {
        const canvas = await html2canvas(receiptRef.current)
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `withdrawal-${receiptData.id}.png`, { type: 'image/png' })
          
          await navigator.share({
            files: [file],
            title: 'Withdrawal Receipt',
            text: `Receipt for withdrawal ${receiptData.id} - Amount: UGX ${receiptData.amount.toLocaleString()}`
          })
        })
      } catch (err) {
        console.error('Error sharing:', err)
        alert('Sharing failed. You can download the PDF instead.')
      }
    } else {
      exportToPDF()
    }
  }

  const renderDashboard = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">WALLET DASHBOARD</h1>
            <p className="expense-subtitle">Manage your earnings and withdrawals</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Wallet</span>
            <div className="expense-user-badge" style={{ background: '#10b981' }}>💳</div>
          </div>
        </div>
      </header>

      {/* Total Balance Card */}
      <div className="compact-section" style={{ margin: '0 0.75rem 1rem', background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', color: 'white', textAlign: 'center' }}>
        <h2 className="compact-section-title" style={{ color: 'white', fontSize: '1rem' }}>Total Wallet Balance</h2>
        <div className="compact-stat-value" style={{ fontSize: '2.5rem', color: 'white' }}>
          UGX {walletData.totalBalance.toLocaleString()}
        </div>
      </div>

      {/* Balance Breakdown */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Available</span>
            <span className="compact-stat-change positive">+12.5%</span>
          </div>
          <div className="compact-stat-value">
            UGX {walletData.available.toLocaleString()}
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Pending</span>
            <span className="compact-stat-change positive">↑ +20.5%</span>
          </div>
          <div className="compact-stat-value">
            UGX {walletData.pending.toLocaleString()}
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Held</span>
            <span className="compact-stat-change negative">↓ -2.5%</span>
          </div>
          <div className="compact-stat-value">
            UGX {walletData.held.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Compact Action Bar */}
      <div className="compact-action-bar">
        <button 
          className="compact-btn btn-primary" 
          onClick={() => {
            setCurrentView("withdraw")
            setWithdrawalStep("method")
          }}
        >
          Withdraw Money
        </button>
        <button 
          className="compact-btn btn-secondary" 
          onClick={() => setCurrentView("ledger")}
        >
          View Ledger
        </button>
        <button 
          className="compact-btn btn-secondary" 
          onClick={() => setCurrentView("settlements")}
        >
          Settlements
        </button>
        <button 
          className="compact-btn btn-secondary" 
          onClick={() => setCurrentView("disputes")}
        >
          Disputes
        </button>
      </div>

      {/* Today's Stats */}
      <div className="compact-content-grid">
        {/* Today's Earnings */}
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Today's Earnings</h2>
            <p className="compact-section-subtitle">Your earnings for today</p>
          </div>

          <div className="compact-stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
            <div className="compact-stat-header">
              <span className="compact-stat-label" style={{ color: 'white' }}>Amount</span>
            </div>
            <div className="compact-stat-value" style={{ fontSize: '1.5rem', color: 'white' }}>
              UGX {walletData.todayEarnings.toLocaleString()}
            </div>
            <div className="compact-stat-change positive" style={{ color: '#d1fae5' }}>
              +12 from yesterday
            </div>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Pending Payouts</h2>
            <p className="compact-section-subtitle">Processing payments</p>
          </div>

          <div className="compact-stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
            <div className="compact-stat-header">
              <span className="compact-stat-label" style={{ color: 'white' }}>Amount</span>
            </div>
            <div className="compact-stat-value" style={{ fontSize: '1.5rem', color: 'white' }}>
              UGX {walletData.pendingPayouts.toLocaleString()}
            </div>
            <div className="compact-stat-change" style={{ color: '#fef3c7' }}>
              2 Processing in 2 days
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="compact-table-section" style={{ margin: '0 0.75rem 1rem' }}>
        <div className="compact-section-header">
          <h2 className="compact-section-title">Recent Transactions</h2>
          <p className="compact-section-subtitle">Your latest wallet activities</p>
        </div>

        <div className="compact-table-wrapper">
          <table className="compact-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reference</th>
                <th>Time</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 4).map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>{getTransactionIcon(transaction.type)}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>{transaction.title}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.65rem', color: '#64748b' }}>{transaction.reference}</td>
                  <td style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{transaction.time}</td>
                  <td>
                    <span className={`compact-status ${transaction.isPositive ? 'completed' : 'cancelled'}`}>
                      {transaction.isPositive ? '+' : '-'} UGX {transaction.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="compact-content-grid">
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Quick Actions</h2>
            <p className="compact-section-subtitle">Manage your wallet</p>
          </div>

          <div className="compact-breakdown-list">
            <button 
              className="compact-stat-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setCurrentView("withdraw")
                setWithdrawalStep("method")
              }}
            >
              <div className="compact-stat-info">
                <span className="compact-stat-name">Withdraw Funds</span>
                <span className="compact-stat-value">💸</span>
              </div>
            </button>
            
            <button 
              className="compact-stat-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentView("ledger")}
            >
              <div className="compact-stat-info">
                <span className="compact-stat-name">View Full Ledger</span>
                <span className="compact-stat-value">📊</span>
              </div>
            </button>
            
            <button 
              className="compact-stat-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentView("settlements")}
            >
              <div className="compact-stat-info">
                <span className="compact-stat-name">Settlement Report</span>
                <span className="compact-stat-value">🏦</span>
              </div>
            </button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="compact-breakdown-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Financial Overview</h2>
            <p className="compact-section-subtitle">This month's summary</p>
          </div>

          <div className="compact-breakdown-list">
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Total Inflow</span>
                <span className="compact-stat-value" style={{ color: '#10b981' }}>UGX {walletData.totalInflow.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Total Outflow</span>
                <span className="compact-stat-value" style={{ color: '#ef4444' }}>UGX {walletData.totalOutflow.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="compact-stat-item">
              <div className="compact-stat-info">
                <span className="compact-stat-name">Net Balance</span>
                <span className="compact-stat-value" style={{ color: '#3b82f6' }}>UGX {walletData.netBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWithdraw = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">WITHDRAW FUNDS</h1>
            <p className="expense-subtitle">Withdraw your earnings instantly</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Withdraw</span>
            <div className="expense-user-badge" style={{ background: '#f59e0b' }}>💰</div>
          </div>
        </div>
      </header>

      {/* Balance Summary */}
      <div className="compact-section" style={{ margin: '0 0.75rem 1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', color: 'white', textAlign: 'center' }}>
        <h2 className="compact-section-title" style={{ color: 'white', fontSize: '1rem' }}>Available Balance</h2>
        <div className="compact-stat-value" style={{ fontSize: '2.5rem', color: 'white' }}>
          UGX {walletData.available.toLocaleString()}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#dbeafe' }}>Available for withdrawal</p>
      </div>

      {/* Withdrawal Steps */}
      {withdrawalStep === 'method' && (
        <>
          <div className="compact-content-grid">
            <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
              <div className="compact-section-header">
                <h2 className="compact-section-title">Select Withdrawal Method</h2>
                <p className="compact-section-subtitle">Choose your preferred payout method</p>
              </div>

              <div className="compact-modal-content">
                <div className="compact-category-grid">
                  <button
                    type="button"
                    className={`compact-category-btn ${withdrawalData.method === 'mtn' ? 'selected' : ''}`}
                    onClick={() => handleWithdrawalMethodSelect('mtn')}
                  >
                    <div style={{ fontSize: '1.5rem' }}>📱</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>MTN MoMo</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Instant transfer</div>
                  </button>
                  <button
                    type="button"
                    className={`compact-category-btn ${withdrawalData.method === 'airtel' ? 'selected' : ''}`}
                    onClick={() => handleWithdrawalMethodSelect('airtel')}
                  >
                    <div style={{ fontSize: '1.5rem' }}>📲</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Airtel Money</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Instant transfer</div>
                  </button>
                  <button
                    type="button"
                    className={`compact-category-btn ${withdrawalData.method === 'bank' ? 'selected' : ''}`}
                    onClick={() => handleWithdrawalMethodSelect('bank')}
                  >
                    <div style={{ fontSize: '1.5rem' }}>🏦</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Bank Account</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Secure Transfer</div>
                  </button>
                  <button
                    type="button"
                    className={`compact-category-btn ${withdrawalData.method === 'agent' ? 'selected' : ''}`}
                    onClick={() => handleWithdrawalMethodSelect('agent')}
                  >
                    <div style={{ fontSize: '1.5rem' }}>👤</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Agent Payout</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Immediate Pickup</div>
                  </button>
                </div>
              </div>

              <div className="compact-modal-actions">
                <button 
                  className="compact-modal-btn btn-secondary" 
                  onClick={() => setCurrentView("dashboard")}
                >
                  Cancel
                </button>
                <button 
                  className="compact-modal-btn btn-primary"
                  onClick={handleWithdrawalSubmit}
                >
                  Continue to Amount
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {withdrawalStep === 'amount' && (
        <>
          <div className="compact-content-grid">
            <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
              <div className="compact-section-header">
                <h2 className="compact-section-title">Enter Withdrawal Amount</h2>
                <p className="compact-section-subtitle">Enter the amount you want to withdraw</p>
              </div>

              <div className="compact-modal-content">
                <div className="compact-form-group">
                  <label className="compact-form-label">Amount (UGX)</label>
                  <input
                    type="number"
                    className="compact-form-input"
                    value={withdrawalData.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    min="0"
                    max={walletData.available}
                  />
                  <p className="compact-form-hint">Available: UGX {walletData.available.toLocaleString()}</p>
                </div>

                <div className="compact-form-group">
                  <label className="compact-form-label">Withdrawal Type</label>
                  <div className="compact-form-radio-group">
                    <label className="compact-form-radio">
                      <input
                        type="radio"
                        name="withdrawalType"
                        checked={withdrawalData.autoWithdrawal}
                        onChange={() => setWithdrawalData({...withdrawalData, autoWithdrawal: true})}
                      />
                      <span>Auto Withdrawal (No Fee)</span>
                    </label>
                    <label className="compact-form-radio">
                      <input
                        type="radio"
                        name="withdrawalType"
                        checked={!withdrawalData.autoWithdrawal}
                        onChange={() => setWithdrawalData({...withdrawalData, autoWithdrawal: false})}
                      />
                      <span>Instant Withdrawal (Fee: UGX {withdrawalData.fee})</span>
                    </label>
                  </div>
                </div>

                <div className="compact-fee-summary">
                  <div className="compact-fee-row">
                    <span>Amount:</span>
                    <span>UGX {(parseFloat(withdrawalData.amount) || 0).toLocaleString()}</span>
                  </div>
                  <div className="compact-fee-row">
                    <span>Fee:</span>
                    <span>UGX {withdrawalData.fee.toLocaleString()}</span>
                  </div>
                  <div className="compact-fee-row total">
                    <span>You'll Receive:</span>
                    <span>UGX {withdrawalData.netAmount.toLocaleString()}</span>
                  </div>
                  <div className="compact-fee-row">
                    <span>Processing Time:</span>
                    <span>{withdrawalData.processingTime}</span>
                  </div>
                </div>

                <div className="compact-form-group">
                  <label className="compact-form-label">Destination Details</label>
                  <div className="compact-destination-info">
                    <div>
                      <span className="compact-detail-label">Phone Number:</span>
                      <span className="compact-detail-value">{withdrawalData.phoneNumber}</span>
                    </div>
                    <div>
                      <span className="compact-detail-label">Account Name:</span>
                      <span className="compact-detail-value">{withdrawalData.accountName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="compact-modal-actions">
                <button 
                  className="compact-modal-btn btn-secondary" 
                  onClick={() => setWithdrawalStep('method')}
                >
                  Back
                </button>
                <button 
                  className="compact-modal-btn btn-primary"
                  onClick={handleWithdrawalSubmit}
                  disabled={!withdrawalData.amount || parseFloat(withdrawalData.amount) > walletData.available}
                >
                  Continue to Confirmation
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {withdrawalStep === 'confirm' && (
        <>
          <div className="compact-content-grid">
            <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
              <div className="compact-section-header">
                <h2 className="compact-section-title">Confirm Withdrawal</h2>
                <p className="compact-section-subtitle">Review details before confirming</p>
              </div>

              <div className="compact-modal-content">
                <div className="compact-confirmation-card">
                  <div className="compact-confirmation-row">
                    <span>Method:</span>
                    <span style={{ fontWeight: '600' }}>
                      {withdrawalData.method === 'mtn' ? 'MTN MoMo' : 
                       withdrawalData.method === 'airtel' ? 'Airtel Money' :
                       withdrawalData.method === 'bank' ? 'Bank Account' : 'Agent Payout'}
                    </span>
                  </div>
                  <div className="compact-confirmation-row">
                    <span>Amount:</span>
                    <span style={{ fontWeight: '600' }}>UGX {(parseFloat(withdrawalData.amount) || 0).toLocaleString()}</span>
                  </div>
                  <div className="compact-confirmation-row">
                    <span>Fee:</span>
                    <span>UGX {withdrawalData.fee.toLocaleString()}</span>
                  </div>
                  <div className="compact-confirmation-row total">
                    <span>Net Amount:</span>
                    <span style={{ fontWeight: '700', color: '#059669' }}>UGX {withdrawalData.netAmount.toLocaleString()}</span>
                  </div>
                  <div className="compact-confirmation-row">
                    <span>Processing Time:</span>
                    <span>{withdrawalData.processingTime}</span>
                  </div>
                  <div className="compact-confirmation-row">
                    <span>Destination:</span>
                    <span>{withdrawalData.phoneNumber} ({withdrawalData.accountName})</span>
                  </div>
                </div>

                <div className="compact-form-group">
                  <label className="compact-form-label">Reference Code</label>
                  <div className="compact-reference-code">WD-{Date.now().toString().slice(-8)}</div>
                </div>
              </div>

              <div className="compact-modal-actions">
                <button 
                  className="compact-modal-btn btn-secondary" 
                  onClick={() => setWithdrawalStep('amount')}
                >
                  Back
                </button>
                <button 
                  className="compact-modal-btn btn-primary"
                  onClick={handleWithdrawalSubmit}
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Withdrawal History */}
      <div className="compact-table-section" style={{ margin: '0 0.75rem 1rem' }}>
        <div className="compact-section-header">
          <h2 className="compact-section-title">Recent Withdrawals</h2>
          <p className="compact-section-subtitle">Your recent withdrawal history</p>
        </div>

        <div className="compact-table-wrapper">
          <table className="compact-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Amount</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.slice(0, 3).map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>{getMethodIcon(withdrawal.method)}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>{withdrawal.method}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.7rem', fontWeight: '600' }}>UGX {withdrawal.amount.toLocaleString()}</td>
                  <td style={{ fontSize: '0.65rem', color: '#64748b' }}>{withdrawal.reference}</td>
                  <td>
                    <span className={`compact-status ${withdrawal.status}`}>
                      {withdrawal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderLedger = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">LEDGER STATEMENTS</h1>
            <p className="expense-subtitle">View all your wallet transactions</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Ledger</span>
            <div className="expense-user-badge" style={{ background: '#8b5cf6' }}>📊</div>
          </div>
        </div>
      </header>

      {/* Total Balance */}
      <div className="compact-section" style={{ margin: '0 0.75rem 1rem', background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', color: 'white', textAlign: 'center' }}>
        <h2 className="compact-section-title" style={{ color: 'white', fontSize: '1rem' }}>Total Wallet Balance</h2>
        <div className="compact-stat-value" style={{ fontSize: '2.5rem', color: 'white' }}>
          UGX {walletData.totalBalance.toLocaleString()}
        </div>
      </div>

      {/* Balance Breakdown */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Available</span>
          </div>
          <div className="compact-stat-value">
            UGX {walletData.available.toLocaleString()}
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Pending</span>
          </div>
          <div className="compact-stat-value">
            UGX {walletData.pending.toLocaleString()}
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Held</span>
          </div>
          <div className="compact-stat-value">
            UGX {walletData.held.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="compact-action-bar">
        <button 
          className={`compact-btn ${ledgerFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setLedgerFilter('all')}
        >
          All
        </button>
        <button 
          className={`compact-btn ${ledgerFilter === 'earnings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setLedgerFilter('earnings')}
        >
          Earnings
        </button>
        <button 
          className={`compact-btn ${ledgerFilter === 'deductions' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setLedgerFilter('deductions')}
        >
          Deductions
        </button>
        <button 
          className={`compact-btn ${ledgerFilter === 'withdrawals' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setLedgerFilter('withdrawals')}
        >
          Withdrawals
        </button>
      </div>

      {/* Transaction Count */}
      <div style={{ padding: '0 0.75rem', marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {filteredTransactions.length} transactions found
        </p>
      </div>

      {/* Transactions List */}
      <div className="compact-content-grid">
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">All Transactions</h2>
            <p className="compact-section-subtitle">Complete transaction history</p>
          </div>

          <div className="compact-table-wrapper">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Time</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem' }}>{getTransactionIcon(transaction.type)}</span>
                        <span style={{ fontSize: '0.65rem' }}>{transaction.type.replace('-', ' ')}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.7rem', fontWeight: '600' }}>{transaction.title}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{transaction.reference}</div>
                    </td>
                    <td style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{transaction.time}</td>
                    <td>
                      <span className={`compact-status ${transaction.isPositive ? 'completed' : 'cancelled'}`}>
                        {transaction.isPositive ? '+' : '-'} UGX {transaction.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="compact-modal-actions">
            <button 
              className="compact-modal-btn btn-secondary"
              onClick={() => setCurrentView("dashboard")}
            >
              Back to Dashboard
            </button>
            <button 
              className="compact-modal-btn btn-secondary"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
            <button 
              className="compact-modal-btn btn-primary"
              onClick={() => setCurrentView("settlements")}
            >
              View Settlements
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettlements = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">SETTLEMENTS</h1>
            <p className="expense-subtitle">View and manage settlement reports</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Settlements</span>
            <div className="expense-user-badge" style={{ background: '#8b5cf6' }}>🏦</div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div style={{ padding: '0 0.75rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search settlements..."
          className="compact-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Next Cycle */}
      <div className="compact-section" style={{ margin: '0 0.75rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', textAlign: 'center' }}>
        <h2 className="compact-section-title" style={{ color: '#92400e' }}>Next Settlement Cycle</h2>
        <div className="compact-stat-value" style={{ fontSize: '1.5rem', color: '#92400e' }}>
          Today 10:00 PM
        </div>
        <p style={{ fontSize: '0.75rem', color: '#d97706' }}>Auto Settlement • UGX 34,000 pending</p>
      </div>

      {/* Settlement Stats */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Settled</span>
          </div>
          <div className="compact-stat-value">
            1,280,000
          </div>
          <div className="compact-stat-change" style={{ fontSize: '0.65rem' }}>Last 30 days</div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Pending</span>
          </div>
          <div className="compact-stat-value">
            UGX 20,000
          </div>
          <div className="compact-stat-change" style={{ fontSize: '0.65rem' }}>Next Settlement</div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Deductions</span>
          </div>
          <div className="compact-stat-value">
            UGX 12,000
          </div>
          <div className="compact-stat-change" style={{ fontSize: '0.65rem' }}>Applied</div>
        </div>
      </div>

      {/* Settlement Details */}
      <div className="compact-content-grid">
        {/* Pending Settlement */}
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Pending Settlement</h2>
            <p className="compact-section-subtitle">Today, 10:00 PM</p>
          </div>

          <div className="compact-delivery-details">
            <div className="compact-detail-row">
              <span className="compact-detail-label">Amount</span>
              <span className="compact-detail-value">UGX 34,000</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Includes</span>
              <span className="compact-detail-value">3 Trips, 1 Delivery</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Batch ID</span>
              <span className="compact-detail-value">STL-99221</span>
            </div>
          </div>
        </div>

        {/* Auto Deductions */}
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Auto Deductions</h2>
            <p className="compact-section-subtitle">Applied this cycle</p>
          </div>

          <div className="compact-delivery-details">
            <div className="compact-detail-row">
              <span className="compact-detail-label">Commission Fees</span>
              <span className="compact-detail-value">UGX 8,500</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Penalty Fees</span>
              <span className="compact-detail-value">UGX 2,000</span>
            </div>
            <div className="compact-detail-row">
              <span className="compact-detail-label">Adjustment</span>
              <span className="compact-detail-value">UGX 2,000</span>
            </div>
            <div className="compact-detail-row total">
              <span className="compact-detail-label">Total</span>
              <span className="compact-detail-value">UGX 12,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settlement History */}
      <div className="compact-table-section" style={{ margin: '0 0.75rem 1rem' }}>
        <div className="compact-section-header">
          <h2 className="compact-section-title">Settlement History</h2>
          <p className="compact-section-subtitle">Past settlement records</p>
        </div>

        <div className="compact-table-wrapper">
          <table className="compact-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Deductions</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSettlements.map((settlement) => (
                <tr key={settlement.id}>
                  <td style={{ fontSize: '0.7rem', fontWeight: '600' }}>UGX {settlement.amount.toLocaleString()}</td>
                  <td style={{ fontSize: '0.65rem', color: '#64748b' }}>UGX {settlement.deductions.toLocaleString()}</td>
                  <td style={{ fontSize: '0.65rem' }}>{settlement.type}</td>
                  <td>
                    <span className={`compact-status ${settlement.status}`}>
                      {settlement.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="compact-modal-actions" style={{ padding: '0 0.75rem' }}>
        <button 
          className="compact-modal-btn btn-secondary"
          onClick={() => setCurrentView("dashboard")}
        >
          Back to Dashboard
        </button>
        <button 
          className="compact-modal-btn btn-primary"
          onClick={exportSettlementsToExcel}
        >
          Export Settlements
        </button>
      </div>
    </div>
  )

  const renderDisputes = () => (
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">DISPUTED TRANSACTIONS</h1>
            <p className="expense-subtitle">Manage and track all held amounts</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Disputes</span>
            <div className="expense-user-badge" style={{ background: '#ef4444' }}>⚠️</div>
          </div>
        </div>
      </header>

      {/* Dispute Stats */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Total Held</span>
          </div>
          <div className="compact-stat-value">
            UGX 12,400
          </div>
          <div className="compact-stat-change" style={{ fontSize: '0.65rem' }}>4 disputes</div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Pending Review</span>
          </div>
          <div className="compact-stat-value">
            UGX 5,400
          </div>
          <div className="compact-stat-change" style={{ fontSize: '0.65rem' }}>2 active disputes</div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Resolved</span>
          </div>
          <div className="compact-stat-value">
            2
          </div>
          <div className="compact-stat-change" style={{ fontSize: '0.65rem' }}>This month</div>
        </div>
      </div>

      {/* Filters */}
      <div className="compact-action-bar">
        <button 
          className={`compact-btn ${disputesFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setDisputesFilter('all')}
        >
          All
        </button>
        <button 
          className={`compact-btn ${disputesFilter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setDisputesFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`compact-btn ${disputesFilter === 'resolved' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setDisputesFilter('resolved')}
        >
          Resolved
        </button>
      </div>

      {/* Dispute Count */}
      <div style={{ padding: '0 0.75rem', marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {filteredDisputes.length} disputes found
        </p>
      </div>

      {/* Disputes List */}
      <div className="compact-content-grid">
        <div className="compact-table-section" style={{ gridColumn: 'span 2' }}>
          <div className="compact-section-header">
            <h2 className="compact-section-title">All Disputes</h2>
            <p className="compact-section-subtitle">Review and manage transaction disputes</p>
          </div>

          <div className="compact-table-wrapper">
            <div className="compact-disputes-list">
              {filteredDisputes.map((dispute) => (
                <div key={dispute.id} className="compact-dispute-card">
                  <div className="compact-dispute-header">
                    <h3 style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>{dispute.title}</h3>
                    <p style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.5rem' }}>{dispute.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`compact-status ${dispute.status}`}>
                        {dispute.status}
                      </span>
                      {dispute.amount > 0 && (
                        <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#dc2626' }}>
                          -UGX {dispute.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="compact-delivery-details" style={{ marginTop: '0.5rem' }}>
                    <div className="compact-detail-row">
                      <span className="compact-detail-label">Dispute ID</span>
                      <span className="compact-detail-value">{dispute.disputeId}</span>
                    </div>
                    <div className="compact-detail-row">
                      <span className="compact-detail-label">Opened</span>
                      <span className="compact-detail-value">{dispute.opened}</span>
                    </div>
                    <div className="compact-detail-row">
                      <span className="compact-detail-label">Reason</span>
                      <span className="compact-detail-value">{dispute.reason}</span>
                    </div>
                    {dispute.details && (
                      <div className="compact-detail-row">
                        <span className="compact-detail-label">Details</span>
                        <span className="compact-detail-value">{dispute.details}</span>
                      </div>
                    )}
                    {dispute.resolution && (
                      <div className="compact-detail-row">
                        <span className="compact-detail-label">Resolution</span>
                        <span className="compact-detail-value" style={{ color: '#059669' }}>{dispute.resolution}</span>
                      </div>
                    )}
                  </div>

                  {dispute.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button className="compact-btn btn-secondary" style={{ flex: 1, fontSize: '0.7rem', padding: '0.375rem' }}>
                        Contact Support
                      </button>
                      <button className="compact-btn btn-primary" style={{ flex: 1, fontSize: '0.7rem', padding: '0.375rem' }}>
                        Upload Proof
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="compact-modal-actions">
            <button 
              className="compact-modal-btn btn-secondary"
              onClick={() => setCurrentView("dashboard")}
            >
              Back to Dashboard
            </button>
            <button 
              className="compact-modal-btn btn-primary"
              onClick={() => setCurrentView("ledger")}
            >
              View Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // QR Code Modal
  const renderQRModal = () => (
    <div className={`compact-modal-overlay ${showQR ? "active" : ""}`}>
      <div className="compact-modal">
        <div className="compact-modal-header">
          <h2>SCAN QR CODE</h2>
          <button 
            className="compact-modal-close"
            onClick={() => setShowQR(false)}
          >
            ×
          </button>
        </div>

        <div className="compact-modal-content" style={{ textAlign: 'center' }}>
          <div className="compact-qr-display">
            <div className="compact-qr-placeholder">
              [QR Code Display]
            </div>
            <div className="compact-qr-instruction">
              Scan this QR code with your mobile money app to complete payment
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
            Amount: UGX {withdrawalData.amount.toLocaleString()}
          </div>
        </div>

        <div className="compact-modal-actions">
          <button 
            className="compact-modal-btn btn-secondary"
            onClick={() => setShowQR(false)}
          >
            Cancel
          </button>
          <button 
            className="compact-modal-btn btn-primary"
            onClick={() => {
              setShowQR(false)
              setWithdrawalStep('confirm')
            }}
          >
            Payment Completed
          </button>
        </div>
      </div>
    </div>
  )

  // Withdrawal Success Modal
  const renderWithdrawalSuccess = () => (
    <div className={`compact-modal-overlay ${showWithdrawalSuccess ? "active" : ""}`}>
      <div className="compact-modal">
        <div className="compact-modal-header">
          <h2>WITHDRAWAL SUCCESSFUL</h2>
          <button 
            className="compact-modal-close"
            onClick={() => {
              setShowWithdrawalSuccess(false)
              setShowReceipt(true)
            }}
          >
            ×
          </button>
        </div>

        <div className="compact-modal-content" style={{ textAlign: 'center' }}>
          <div className="success-icon" style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}>✓</div>
          <h3>Withdrawal Processed</h3>
          <div className="compact-stat-value" style={{ fontSize: '2rem', margin: '1rem 0' }}>
            UGX {(parseFloat(withdrawalData.amount) || 0).toLocaleString()}
          </div>
          <p>Your withdrawal to {withdrawalData.method === 'mtn' ? 'MTN MoMo' : 
                               withdrawalData.method === 'airtel' ? 'Airtel Money' :
                               withdrawalData.method === 'bank' ? 'Bank Account' : 'Agent Payout'} has been initiated.</p>
          <div className="compact-split-summary">
            <div>Fee: UGX {withdrawalData.fee.toLocaleString()}</div>
            <div>Net Amount: UGX {withdrawalData.netAmount.toLocaleString()}</div>
            <div>Processing Time: {withdrawalData.processingTime}</div>
          </div>
        </div>

        <div className="compact-modal-actions">
          <button 
            className="compact-modal-btn btn-secondary"
            onClick={() => {
              setShowWithdrawalSuccess(false)
              resetWithdrawal()
              setCurrentView("dashboard")
            }}
          >
            Back to Dashboard
          </button>
          <button 
            className="compact-modal-btn btn-primary"
            onClick={() => {
              setShowWithdrawalSuccess(false)
              setShowReceipt(true)
            }}
          >
            View Receipt
          </button>
        </div>
      </div>
    </div>
  )

  // Receipt Display
  const renderReceipt = () => (
    <div className="compact-modal-overlay active">
      <div className="compact-modal">
        <div className="compact-modal-header">
          <h2>WITHDRAWAL RECEIPT</h2>
          <button 
            className="compact-modal-close"
            onClick={() => {
              setShowReceipt(false)
              resetWithdrawal()
              setCurrentView("dashboard")
            }}
          >
            ×
          </button>
        </div>

        <div className="compact-modal-content">
          <div ref={receiptRef} style={{ textAlign: 'left', padding: '1rem', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '1rem' }}>Withdrawal Receipt</h2>
            
            <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Receipt ID:</span>
                <span>{receiptData?.id || `WD-${Date.now().toString().slice(-8)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Date:</span>
                <span>{receiptData?.date} {receiptData?.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>Method:</span>
                <span>{withdrawalData.method === 'mtn' ? 'MTN MoMo' : 
                       withdrawalData.method === 'airtel' ? 'Airtel Money' :
                       withdrawalData.method === 'bank' ? 'Bank Account' : 'Agent Payout'}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Transaction Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Withdrawal Amount:</span>
                <span>UGX {(parseFloat(withdrawalData.amount) || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Processing Fee:</span>
                <span>UGX {withdrawalData.fee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Net Amount:</span>
                <span>UGX {withdrawalData.netAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Processing Time:</span>
                <span>{withdrawalData.processingTime}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Destination Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Phone Number:</span>
                <span>{withdrawalData.phoneNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Account Name:</span>
                <span>{withdrawalData.accountName}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Status:</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>Processing</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed #cbd5e1' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Thank you for using our wallet service!</p>
            </div>
          </div>
        </div>

        <div className="compact-modal-actions">
          <button 
            className="compact-modal-btn btn-secondary"
            onClick={exportToPDF}
          >
            Save as PDF
          </button>
          <button 
            className="compact-modal-btn btn-secondary"
            onClick={shareReceipt}
          >
            Share Receipt
          </button>
          <button 
            className="compact-modal-btn btn-primary"
            onClick={() => {
              setShowReceipt(false)
              resetWithdrawal()
              setCurrentView("dashboard")
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {currentView === "dashboard" && renderDashboard()}
      {currentView === "withdraw" && renderWithdraw()}
      {currentView === "ledger" && renderLedger()}
      {currentView === "settlements" && renderSettlements()}
      {currentView === "disputes" && renderDisputes()}
      
      {/* Modals */}
      {showQR && renderQRModal()}
      {showWithdrawalSuccess && renderWithdrawalSuccess()}
      {showReceipt && renderReceipt()}
      
      <style jsx>{`
        /* Wallet Specific Styles */
        .compact-stat-card {
          background: white;
          border-radius: 6px;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          text-align: left;
          position: relative;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .stat-blue {
          border-left: 4px solid #3b82f6;
        }

        .stat-green {
          border-left: 4px solid #10b981;
        }

        .stat-yellow {
          border-left: 4px solid #f59e0b;
        }

        .stat-purple {
          border-left: 4px solid #8b5cf6;
        }

        .compact-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .compact-stat-label {
          font-size: 0.65rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .compact-stat-change {
          font-size: 0.6rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 10px;
        }

        .compact-stat-change.positive {
          background: #d1fae5;
          color: #059669;
        }

        .compact-stat-change.negative {
          background: #fee2e2;
          color: #dc2626;
        }

        .compact-stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .compact-stat-currency {
          font-size: 0.75rem;
          color: #64748b;
          margin-left: 0.125rem;
        }

        .compact-section {
          background: white;
          border-radius: 6px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          text-align: center;
        }

        .compact-section-title {
          font-size: 1rem;
          color: #1e293b;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .compact-section-subtitle {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .compact-content-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin: 0 0.75rem 1rem;
        }

        .compact-table-section {
          background: white;
          border-radius: 6px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
        }

        .compact-table-section .compact-section-header {
          margin-bottom: 1rem;
        }

        .compact-table-wrapper {
          overflow-x: auto;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .compact-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.7rem;
        }

        .compact-table th {
          background: #f8fafc;
          padding: 0.5rem;
          text-align: left;
          font-weight: 600;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .compact-table td {
          padding: 0.5rem;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .compact-table tbody tr:hover {
          background: #f8fafc;
        }

        .compact-status {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .compact-status.completed,
        .compact-status.success,
        .compact-status.resolved {
          background: #d1fae5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .compact-status.pending {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .compact-status.cancelled,
        .compact-status.failed {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .compact-breakdown-section {
          background: white;
          border-radius: 6px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
        }

        .compact-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .compact-stat-item {
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          text-align: left;
          transition: all 0.2s;
        }

        .compact-stat-item:hover {
          background: #eff6ff;
          border-color: #dbeafe;
          transform: translateY(-1px);
        }

        .compact-stat-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .compact-delivery-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .compact-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          font-size: 0.7rem;
        }

        .compact-detail-row.total {
          background: #eff6ff;
          border-color: #dbeafe;
          font-weight: 600;
        }

        .compact-detail-label {
          color: #64748b;
          font-weight: 500;
        }

        .compact-detail-value {
          color: #1e293b;
          font-weight: 600;
          text-align: right;
        }

        /* Withdrawal Specific */
        .compact-form-radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .compact-form-radio {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .compact-form-radio input {
          width: 1rem;
          height: 1rem;
        }

        .compact-fee-summary {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          margin: 1rem 0;
        }

        .compact-fee-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.375rem 0;
          font-size: 0.75rem;
        }

        .compact-fee-row.total {
          border-top: 1px dashed #cbd5e1;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          font-weight: 700;
          color: #1e40af;
        }

        .compact-destination-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .compact-confirmation-card {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          margin-bottom: 1rem;
        }

        .compact-confirmation-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          font-size: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .compact-confirmation-row:last-child {
          border-bottom: none;
        }

        .compact-reference-code {
          background: #1e293b;
          color: white;
          padding: 0.75rem;
          border-radius: 4px;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          letter-spacing: 1px;
          margin: 0.5rem 0;
        }

        /* Disputes Specific */
        .compact-disputes-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .compact-dispute-card {
          background: white;
          border-radius: 6px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .compact-dispute-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .compact-dispute-header {
          margin-bottom: 0.75rem;
        }

        /* Modal Styles */
        .compact-modal-overlay {
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
          padding: 1rem;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
        }

        .compact-modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .compact-modal {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .compact-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          position: relative;
        }

        .compact-modal-header h2 {
          font-size: 1.25rem;
          color: #1e293b;
          font-weight: 700;
          margin: 0;
        }

        .compact-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .compact-modal-close:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .compact-modal-content {
          padding: 1.5rem;
        }

        .compact-modal-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 0 0 8px 8px;
        }

        .compact-modal-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
          border: none;
        }

        .compact-modal-btn.btn-primary {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          box-shadow: 0 1px 3px rgba(30, 64, 175, 0.1);
        }

        .compact-modal-btn.btn-primary:hover {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(30, 64, 175, 0.15);
        }

        .compact-modal-btn.btn-secondary {
          background: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .compact-modal-btn.btn-secondary:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .compact-qr-display {
          text-align: center;
          margin: 1rem 0;
        }

        .compact-qr-placeholder {
          width: 200px;
          height: 200px;
          margin: 0 auto 1rem;
          background: linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 25%, #e5e7eb 50%, #f3f4f6 50%, #f3f4f6 75%, #e5e7eb 75%);
          background-size: 20px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 0.875rem;
          border: 2px dashed #d1d5db;
        }

        .compact-qr-instruction {
          font-size: 0.875rem;
          color: #475569;
          margin-top: 0.5rem;
          line-height: 1.5;
        }

        .compact-split-summary {
          background: #f0f9ff;
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
          font-size: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .compact-content-grid {
            grid-template-columns: 1fr;
          }
          
          .compact-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .compact-action-bar {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .compact-stats-grid {
            grid-template-columns: 1fr;
          }
          
          .compact-table {
            font-size: 0.65rem;
          }
          
          .compact-modal {
            padding: 0;
          }
          
          .compact-modal-header {
            padding: 1rem;
          }
          
          .compact-modal-content {
            padding: 1rem;
          }
          
          .compact-modal-actions {
            padding: 1rem;
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
}

export default Wallet