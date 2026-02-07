"use client"

import { useState, useEffect, useRef } from "react"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

const Wallet = () => {
  // KEEP ALL YOUR ORIGINAL STATE VARIABLES EXACTLY AS BEFORE
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
  
  // NEW: API loading and error states (minimal addition)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiMessage, setApiMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  
  // KEEP YOUR ORIGINAL STATIC DATA EXACTLY AS BEFORE
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

  // KEEP ALL YOUR ORIGINAL DATA ARRAYS EXACTLY AS BEFORE
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
      type: 'payout',
      title: 'Request Payout to MTN',
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

  const receiptRef = useRef(null)

  // ========== API CONFIGURATION ==========
  const API_BASE_URL = "https://funderspick-backend.onrender.com"
  
  // Helper to get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || 'test-token-123' // Replace with real token
    }
    return 'test-token-123'
  }

  // Enhanced API call function with better error handling
  const makeApiCall = async (endpoint, method = 'GET', body = null) => {
    setApiLoading(true)
    setApiMessage(null)
    setIsError(false)
    
    const token = getAuthToken()
    const headers = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const config = {
      method,
      headers,
    }
    
    if (body && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(body)
    }
    
    try {
      console.log(`API Call: ${method} ${API_BASE_URL}${endpoint}`)
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
      
      // First check if response is JSON
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || `API Error: ${response.status}`)
        }
        
        return data
      } else {
        // If not JSON, read as text to see what we got
        const text = await response.text()
        console.log('Non-JSON response (first 500 chars):', text.substring(0, 500))
        
        // Try to parse as JSON anyway (some APIs might not set content-type correctly)
        try {
          const parsed = JSON.parse(text)
          return parsed
        } catch {
          throw new Error(`Server returned HTML or invalid response. Status: ${response.status}`)
        }
      }
    } catch (error) {
      console.error('API Call Failed:', error)
      setApiMessage(`API Error: ${error.message}`)
      setIsError(true)
      throw error
    } finally {
      setApiLoading(false)
    }
  }

  // ========== API FUNCTIONS ==========

  // 1. GET /api/rider-wallets/me - Get wallet balance
  const fetchWalletBalance = async () => {
    try {
      const data = await makeApiCall('/api/rider-wallets/me')
      
      if (data && (data.data || data.balance)) {
        // Update wallet data with API response
        setWalletData(prev => ({
          ...prev,
          totalBalance: data.data?.totalBalance || data.balance?.total || data.totalBalance || prev.totalBalance,
          available: data.data?.availableBalance || data.balance?.available || data.availableBalance || prev.available,
          pending: data.data?.pendingBalance || data.balance?.pending || data.pendingBalance || prev.pending,
          held: data.data?.heldBalance || data.balance?.held || data.heldBalance || prev.held,
        }))
        
        setApiMessage('Balance updated successfully')
        setIsError(false)
      }
    } catch (error) {
      console.log('Using fallback wallet data')
      // Keep using existing data if API fails
    }
  }

  // 2. POST /api/riders/wallet/deposit - Create MoMo deposit
  const createDeposit = async (amount, phoneNumber) => {
    try {
      const payload = {
        amount: parseFloat(amount),
        phoneNumber: phoneNumber,
        currency: 'UGX'
      }
      
      const data = await makeApiCall('/api/riders/wallet/deposit', 'POST', payload)
      
      if (data && data.success) {
        setApiMessage('Deposit initiated! Check your phone to complete payment.')
        setIsError(false)
        return data.data || data
      }
      return data
    } catch (error) {
      throw error
    }
  }

  // 3. GET /api/riders/wallet/transactions/<reference_id>/status - Check transaction status
  const checkTransactionStatus = async (referenceId) => {
    try {
      const data = await makeApiCall(`/api/riders/wallet/transactions/${referenceId}/status`)
      return data
    } catch (error) {
      throw error
    }
  }

  // 4. POST /api/riders/wallet/withdraw - Create withdrawal request
  const createWithdrawal = async (withdrawalData) => {
    try {
      const payload = {
        amount: parseFloat(withdrawalData.amount),
        method: withdrawalData.method,
        phoneNumber: withdrawalData.phoneNumber,
        accountName: withdrawalData.accountName,
        fee: withdrawalData.fee,
        netAmount: withdrawalData.netAmount,
        currency: 'UGX'
      }
      
      const data = await makeApiCall('/api/riders/wallet/withdraw', 'POST', payload)
      return data
    } catch (error) {
      throw error
    }
  }

  // 5. GET /api/rider-wallets/admin/withdrawals - Get pending withdrawals (admin)
  const fetchPendingWithdrawals = async () => {
    try {
      const data = await makeApiCall('/api/rider-wallets/admin/withdrawals')
      return data
    } catch (error) {
      throw error
    }
  }

  // 6. POST /api/rider-wallets/admin/withdrawals/<id>/approve-process - Approve withdrawal (admin)
  const approveWithdrawal = async (withdrawalId) => {
    try {
      const data = await makeApiCall(`/api/rider-wallets/admin/withdrawals/${withdrawalId}/approve-process`, 'POST')
      return data
    } catch (error) {
      throw error
    }
  }

  // ========== ORIGINAL HANDLERS (with API integration) ==========

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

  // Fetch balance on component mount
  useEffect(() => {
    fetchWalletBalance()
  }, [])

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

  // MODIFIED: Now uses API for withdrawal
  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault()
    
    if (withdrawalStep === 'method') {
      setWithdrawalStep('amount')
    } else if (withdrawalStep === 'amount') {
      setWithdrawalStep('confirm')
    } else if (withdrawalStep === 'confirm') {
      // Process withdrawal via API
      try {
        // Call API to create withdrawal
        const response = await createWithdrawal(withdrawalData)
        
        if (response) {
          // Create local withdrawal record
          const newWithdrawal = {
            id: response.data?.id || withdrawals.length + 1,
            amount: parseFloat(withdrawalData.amount),
            method: withdrawalData.method === 'mtn' ? 'MTN MoMo' : 
                    withdrawalData.method === 'airtel' ? 'Airtel Money' :
                    withdrawalData.method === 'bank' ? 'Bank Account' : 'Agent Payout',
            reference: response.data?.reference || `WDL - ${Math.floor(100000 + Math.random() * 900000)}`,
            status: 'pending',
            time: 'Just now'
          }
          
          setWithdrawals([newWithdrawal, ...withdrawals])
          
          // Update wallet balance locally (or fetch fresh from API)
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
          
          // Fetch updated balance from API
          await fetchWalletBalance()
          
          setApiMessage('Withdrawal request submitted successfully!')
          setIsError(false)
        } else {
          setApiMessage('Withdrawal failed: No response from server')
          setIsError(true)
        }
      } catch (error) {
        setApiMessage(`Withdrawal failed: ${error.message}`)
        setIsError(true)
      }
    }
  }

  // NEW: Handle deposit
  const handleDeposit = async () => {
    try {
      // For demo, using a fixed amount. In real app, get from user input
      const amount = "10000"
      const response = await createDeposit(amount, withdrawalData.phoneNumber)
      
      if (response && response.reference) {
        // Start polling for transaction status
        console.log('Deposit initiated. Reference:', response.reference)
        setApiMessage(`Deposit initiated! Reference: ${response.reference}`)
        setIsError(false)
        
        // You can show QR code or instructions
        setShowQR(true)
      }
    } catch (error) {
      setApiMessage(`Deposit failed: ${error.message}`)
      setIsError(true)
    }
  }

  // KEEP ALL YOUR ORIGINAL HELPER FUNCTIONS
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
        return 'status-badge valid'
      case 'pending':
        return 'status-badge pending'
      case 'failed':
        return 'status-badge invalid'
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

  // ========== RENDER FUNCTIONS (ORIGINAL UI) ==========

  const renderDashboard = () => (
    <div className="rider-agent-container">
      {/* API Status Message (minimal addition) */}
      {apiMessage && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          background: isError ? '#fee2e2' : '#d1fae5',
          color: isError ? '#dc2626' : '#065f46',
          border: `1px solid ${isError ? '#fecaca' : '#a7f3d0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{apiMessage}</span>
          <button 
            onClick={() => setApiMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'inherit',
              padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Loading Indicator (minimal addition) */}
      {apiLoading && (
        <div style={{
          marginBottom: '16px',
          padding: '8px 12px',
          background: '#dbeafe',
          color: '#1d4ed8',
          borderRadius: '6px',
          fontSize: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div className="loading-spinner" style={{
            width: '16px',
            height: '16px',
            border: '2px solid #1d4ed8',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Connecting to server...
        </div>
      )}

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">WALLET DASHBOARD</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "withdraw" ? "active" : ""}`} onClick={() => setCurrentView("withdraw")}>
          Withdraw
        </button>
        <button className={`tab-btn ${currentView === "ledger" ? "active" : ""}`} onClick={() => setCurrentView("ledger")}>
          Ledger
        </button>
        <button className={`tab-btn ${currentView === "settlements" ? "active" : ""}`} onClick={() => setCurrentView("settlements")}>
          Settlements
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="balance-card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="balance-label">Total Wallet Balance</div>
        <div className="balance-amount">UGX {walletData.totalBalance.toLocaleString()}</div>
        <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
          <button 
            onClick={fetchWalletBalance}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Refresh Balance
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Available</div>
          <p className="stat-value">UGX {walletData.available.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <p className="stat-value">UGX {walletData.pending.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Held</div>
          <p className="stat-value">UGX {walletData.held.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Today's Earnings</div>
          <p className="stat-value">UGX {walletData.todayEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="commission-overview">
        <div className="section-title">Quick Actions</div>
        <div className="commission-grid">
          <div className="commission-card revenue" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
            setCurrentView("withdraw")
            setWithdrawalStep("method")
          }}>
            <div className="commission-label">Withdraw Funds</div>
            <p className="commission-amount">💸</p>
          </div>
          
          <div className="commission-card today" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleDeposit}>
            <div className="commission-label">Deposit Funds</div>
            <p className="commission-amount">💰</p>
          </div>
          
          <div className="commission-card weekly" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentView("settlements")}>
            <div className="commission-label">Settlements</div>
            <p className="commission-amount">🏦</p>
          </div>
          
          <div className="commission-card pending" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentView("disputes")}>
            <div className="commission-label">Disputes</div>
            <p className="commission-amount">⚠️</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="commission-overview">
        <div className="section-title">Recent Transactions</div>
        <div className="ledger-entry" style={{ marginBottom: '8px' }}>
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="alert-item" style={{ marginBottom: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>{getTransactionIcon(transaction.type)}</span>
                  <p className="alert-type" style={{ margin: 0 }}>{transaction.title}</p>
                </div>
                <p className="alert-message" style={{ margin: 0 }}>{transaction.reference}</p>
                <p className="alert-time">{transaction.time}</p>
              </div>
              <span style={{ 
                color: transaction.isPositive ? '#2e7d32' : '#c62828',
                fontWeight: '600',
                fontSize: '13px'
              }}>
                {transaction.isPositive ? '+' : '-'} UGX {transaction.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Overview */}
      <div className="commission-overview">
        <div className="section-title">Financial Overview</div>
        <div className="commission-grid">
          <div className="commission-card revenue">
            <div className="commission-label">Total Inflow</div>
            <p className="commission-amount">UGX {walletData.totalInflow.toLocaleString()}</p>
          </div>
          
          <div className="commission-card today">
            <div className="commission-label">Total Outflow</div>
            <p className="commission-amount">UGX {walletData.totalOutflow.toLocaleString()}</p>
          </div>
          
          <div className="commission-card weekly">
            <div className="commission-label">Net Balance</div>
            <p className="commission-amount">UGX {walletData.netBalance.toLocaleString()}</p>
          </div>
          
          <div className="commission-card pending">
            <div className="commission-label">Pending Payouts</div>
            <p className="commission-amount">UGX {walletData.pendingPayouts.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWithdraw = () => (
    <div className="rider-agent-container">
      {/* API Status Message */}
      {apiMessage && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          background: isError ? '#fee2e2' : '#d1fae5',
          color: isError ? '#dc2626' : '#065f46',
          border: `1px solid ${isError ? '#fecaca' : '#a7f3d0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{apiMessage}</span>
          <button 
            onClick={() => setApiMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'inherit',
              padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">WITHDRAW FUNDS</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "withdraw" ? "active" : ""}`} onClick={() => setCurrentView("withdraw")}>
          Withdraw
        </button>
        <button className={`tab-btn ${currentView === "ledger" ? "active" : ""}`} onClick={() => setCurrentView("ledger")}>
          Ledger
        </button>
        <button className={`tab-btn ${currentView === "settlements" ? "active" : ""}`} onClick={() => setCurrentView("settlements")}>
          Settlements
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
      </div>

      {/* Balance Summary */}
      <div className="balance-card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="balance-label">Available Balance</div>
        <div className="balance-amount">UGX {walletData.available.toLocaleString()}</div>
      </div>

      {/* Withdrawal Steps */}
      {withdrawalStep === 'method' && (
        <div className="commission-overview">
          <div className="section-title">Select Withdrawal Method</div>
          <div className="commission-grid">
            <button
              type="button"
              className={`commission-card ${withdrawalData.method === 'mtn' ? 'revenue' : 'pending'}`}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={() => handleWithdrawalMethodSelect('mtn')}
            >
              <div style={{ fontSize: '1.5rem' }}>📱</div>
              <div className="commission-label">MTN MoMo</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Instant transfer</div>
            </button>
            
            <button
              type="button"
              className={`commission-card ${withdrawalData.method === 'airtel' ? 'revenue' : 'pending'}`}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={() => handleWithdrawalMethodSelect('airtel')}
            >
              <div style={{ fontSize: '1.5rem' }}>📲</div>
              <div className="commission-label">Airtel Money</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Instant transfer</div>
            </button>
            
            <button
              type="button"
              className={`commission-card ${withdrawalData.method === 'bank' ? 'revenue' : 'pending'}`}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={() => handleWithdrawalMethodSelect('bank')}
            >
              <div style={{ fontSize: '1.5rem' }}>🏦</div>
              <div className="commission-label">Bank Account</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Secure Transfer</div>
            </button>
            
            <button
              type="button"
              className={`commission-card ${withdrawalData.method === 'agent' ? 'revenue' : 'pending'}`}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={() => handleWithdrawalMethodSelect('agent')}
            >
              <div style={{ fontSize: '1.5rem' }}>👤</div>
              <div className="commission-label">Agent Payout</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Immediate Pickup</div>
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button 
              className="activate-code-btn" 
              style={{ background: '#666' }}
              onClick={() => setCurrentView("dashboard")}
            >
              Cancel
            </button>
            <button 
              className="activate-code-btn"
              onClick={handleWithdrawalSubmit}
            >
              Continue to Amount
            </button>
          </div>
        </div>
      )}

      {withdrawalStep === 'amount' && (
        <div className="payout-section">
          <div className="payout-form">
            <label className="form-label">Amount (UGX)</label>
            <input
              type="number"
              className="amount-input"
              value={withdrawalData.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              min="0"
              max={walletData.available}
              style={{ textAlign: 'center' }}
            />
            <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>
              Available: UGX {walletData.available.toLocaleString()}
            </div>

            <div className="commission-overview" style={{ marginBottom: '16px' }}>
              <div className="commission-grid">
                <div className="commission-card revenue">
                  <div className="commission-label">Withdrawal Amount</div>
                  <p className="commission-amount">UGX {(parseFloat(withdrawalData.amount) || 0).toLocaleString()}</p>
                </div>
                
                <div className="commission-card today">
                  <div className="commission-label">Fee</div>
                  <p className="commission-amount">UGX {withdrawalData.fee.toLocaleString()}</p>
                </div>
                
                <div className="commission-card weekly">
                  <div className="commission-label">Net Amount</div>
                  <p className="commission-amount">UGX {withdrawalData.netAmount.toLocaleString()}</p>
                </div>
                
                <div className="commission-card pending">
                  <div className="commission-label">Processing Time</div>
                  <p className="commission-amount" style={{ fontSize: '12px' }}>{withdrawalData.processingTime}</p>
                </div>
              </div>
            </div>

            <div className="commission-overview">
              <div className="section-title">Destination Details</div>
              <div className="detail-row">
                <span className="detail-label">Phone Number</span>
                <span className="detail-value">{withdrawalData.phoneNumber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Name</span>
                <span className="detail-value">{withdrawalData.accountName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                className="activate-code-btn" 
                style={{ background: '#666' }}
                onClick={() => setWithdrawalStep('method')}
              >
                Back
              </button>
              <button 
                className="activate-code-btn"
                onClick={handleWithdrawalSubmit}
                disabled={!withdrawalData.amount || parseFloat(withdrawalData.amount) > walletData.available}
              >
                Continue to Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {withdrawalStep === 'confirm' && (
        <div className="payout-section">
          <div className="payout-form">
            <div className="commission-overview">
              <div className="section-title">Confirm Withdrawal</div>
              
              <div className="detail-row">
                <span className="detail-label">Method</span>
                <span className="detail-value" style={{ fontWeight: '600' }}>
                  {withdrawalData.method === 'mtn' ? 'MTN MoMo' : 
                   withdrawalData.method === 'airtel' ? 'Airtel Money' :
                   withdrawalData.method === 'bank' ? 'Bank Account' : 'Agent Payout'}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Amount</span>
                <span className="detail-value" style={{ fontWeight: '600' }}>
                  UGX {(parseFloat(withdrawalData.amount) || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Fee</span>
                <span className="detail-value">UGX {withdrawalData.fee.toLocaleString()}</span>
              </div>
              
              <div className="detail-row highlight">
                <span className="detail-label">Net Amount</span>
                <span className="detail-value" style={{ color: '#2e7d32', fontWeight: '700' }}>
                  UGX {withdrawalData.netAmount.toLocaleString()}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Processing Time</span>
                <span className="detail-value">{withdrawalData.processingTime}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Destination</span>
                <span className="detail-value">{withdrawalData.phoneNumber} ({withdrawalData.accountName})</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Reference Code</span>
                <span className="detail-value" style={{ fontFamily: 'monospace', color: '#0033cc' }}>
                  WD-{Date.now().toString().slice(-8)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                className="activate-code-btn" 
                style={{ background: '#666' }}
                onClick={() => setWithdrawalStep('amount')}
              >
                Back
              </button>
              <button 
                className="activate-code-btn"
                onClick={handleWithdrawalSubmit}
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Withdrawals */}
      <div className="commission-overview">
        <div className="section-title">Recent Withdrawals</div>
        <div className="ledger-entry" style={{ marginBottom: '8px' }}>
          {withdrawals.slice(0, 3).map((withdrawal) => (
            <div key={withdrawal.id} className="alert-item" style={{ marginBottom: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>{getMethodIcon(withdrawal.method)}</span>
                  <p className="alert-type" style={{ margin: 0 }}>{withdrawal.method}</p>
                </div>
                <p className="alert-message" style={{ margin: 0 }}>{withdrawal.reference}</p>
                <p className="alert-time">{withdrawal.time}</p>
              </div>
              <span className={`status-badge ${withdrawal.status === 'success' ? 'valid' : withdrawal.status === 'pending' ? 'pending' : 'invalid'}`}>
                {withdrawal.status}
              </span>
              <span style={{ 
                fontWeight: '600',
                fontSize: '13px',
                marginLeft: '12px'
              }}>
                UGX {withdrawal.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLedger = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">LEDGER STATEMENTS</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "withdraw" ? "active" : ""}`} onClick={() => setCurrentView("withdraw")}>
          Withdraw
        </button>
        <button className={`tab-btn ${currentView === "ledger" ? "active" : ""}`} onClick={() => setCurrentView("ledger")}>
          Ledger
        </button>
        <button className={`tab-btn ${currentView === "settlements" ? "active" : ""}`} onClick={() => setCurrentView("settlements")}>
          Settlements
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
      </div>

      {/* Total Balance */}
      <div className="balance-card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="balance-label">Total Wallet Balance</div>
        <div className="balance-amount">UGX {walletData.totalBalance.toLocaleString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Available</div>
          <p className="stat-value">UGX {walletData.available.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <p className="stat-value">UGX {walletData.pending.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Held</div>
          <p className="stat-value">UGX {walletData.held.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Transactions</div>
          <p className="stat-value">{filteredTransactions.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="tab-navigation" style={{ marginBottom: '20px' }}>
        <button 
          className={`tab-btn ${ledgerFilter === 'all' ? 'active' : ''}`}
          onClick={() => setLedgerFilter('all')}
        >
          All
        </button>
        <button 
          className={`tab-btn ${ledgerFilter === 'earnings' ? 'active' : ''}`}
          onClick={() => setLedgerFilter('earnings')}
        >
          Earnings
        </button>
        <button 
          className={`tab-btn ${ledgerFilter === 'deductions' ? 'active' : ''}`}
          onClick={() => setLedgerFilter('deductions')}
        >
          Deductions
        </button>
        <button 
          className={`tab-btn ${ledgerFilter === 'withdrawals' ? 'active' : ''}`}
          onClick={() => setLedgerFilter('withdrawals')}
        >
          Withdrawals
        </button>
        <button 
          className={`tab-btn ${ledgerFilter === 'settlements' ? 'active' : ''}`}
          onClick={() => setLedgerFilter('settlements')}
        >
          Settlements
        </button>
      </div>

      {/* Transaction Count */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <p style={{ fontSize: '12px', color: '#666' }}>
          {filteredTransactions.length} transactions found
        </p>
      </div>

      {/* Transactions List */}
      <div className="commission-overview">
        <div className="section-title">All Transactions</div>
        <div className="ledger-entry" style={{ marginBottom: '8px' }}>
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="alert-item" style={{ marginBottom: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>{getTransactionIcon(transaction.type)}</span>
                  <p className="alert-type" style={{ margin: 0 }}>{transaction.title}</p>
                </div>
                <p className="alert-message" style={{ margin: 0 }}>{transaction.reference}</p>
                <p className="alert-time">{transaction.time}</p>
              </div>
              <span style={{ 
                color: transaction.isPositive ? '#2e7d32' : '#c62828',
                fontWeight: '600',
                fontSize: '13px'
              }}>
                {transaction.isPositive ? '+' : '-'} UGX {transaction.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            className="activate-code-btn" 
            style={{ background: '#666' }}
            onClick={() => setCurrentView("dashboard")}
          >
            Back to Dashboard
          </button>
          <button 
            className="activate-code-btn" 
            style={{ background: '#fef08a', color: 'black' }}
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
          <button 
            className="activate-code-btn"
            onClick={() => setCurrentView("settlements")}
          >
            View Settlements
          </button>
        </div>
      </div>
    </div>
  )

  const renderSettlements = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">SETTLEMENTS</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "withdraw" ? "active" : ""}`} onClick={() => setCurrentView("withdraw")}>
          Withdraw
        </button>
        <button className={`tab-btn ${currentView === "ledger" ? "active" : ""}`} onClick={() => setCurrentView("ledger")}>
          Ledger
        </button>
        <button className={`tab-btn ${currentView === "settlements" ? "active" : ""}`} onClick={() => setCurrentView("settlements")}>
          Settlements
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search settlements..."
          className="share-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Next Cycle */}
      <div className="upgrade-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="status-badge valid" style={{ display: 'inline-block', marginBottom: '8px' }}>
          Next Settlement Cycle
        </div>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#0033cc', margin: '8px 0' }}>
          Today 10:00 PM
        </div>
        <p style={{ fontSize: '12px', color: '#0033cc', margin: 0 }}>
          Auto Settlement • UGX 34,000 pending
        </p>
      </div>

      {/* Settlement Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Settled</div>
          <p className="stat-value">1,280,000</p>
          <div style={{ fontSize: '11px', color: '#666' }}>Last 30 days</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <p className="stat-value">UGX 20,000</p>
          <div style={{ fontSize: '11px', color: '#666' }}>Next Settlement</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Deductions</div>
          <p className="stat-value">UGX 12,000</p>
          <div style={{ fontSize: '11px', color: '#666' }}>Applied</div>
        </div>
      </div>

      {/* Settlement Details */}
      <div className="commission-overview">
        <div className="section-title">Pending Settlement</div>
        <div className="detail-row">
          <span className="detail-label">Amount</span>
          <span className="detail-value">UGX 34,000</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Includes</span>
          <span className="detail-value">3 Trips, 1 Delivery</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Batch ID</span>
          <span className="detail-value">STL-99221</span>
        </div>
        <div className="detail-row highlight">
          <span className="detail-label">Scheduled Time</span>
          <span className="detail-value" style={{ color: '#2e7d32' }}>Today, 10:00 PM</span>
        </div>
      </div>

      {/* Auto Deductions */}
      <div className="commission-overview" style={{ marginTop: '20px' }}>
        <div className="section-title">Auto Deductions</div>
        <div className="detail-row">
          <span className="detail-label">Commission Fees</span>
          <span className="detail-value">UGX 8,500</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Penalty Fees</span>
          <span className="detail-value">UGX 2,000</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Adjustment</span>
          <span className="detail-value">UGX 2,000</span>
        </div>
        <div className="detail-row highlight">
          <span className="detail-label">Total Deductions</span>
          <span className="detail-value">UGX 12,500</span>
        </div>
      </div>

      {/* Settlement History */}
      <div className="commission-overview" style={{ marginTop: '20px' }}>
        <div className="section-title">Settlement History</div>
        <div className="ledger-entry" style={{ marginBottom: '8px' }}>
          {filteredSettlements.map((settlement) => (
            <div key={settlement.id} className="alert-item" style={{ marginBottom: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px' }}>
                  <p className="alert-type" style={{ margin: 0 }}>{settlement.type}</p>
                </div>
                <p className="alert-message" style={{ margin: 0 }}>Batch: {settlement.batch}</p>
                <p className="alert-time">{settlement.time}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  display: 'block',
                  fontWeight: '600',
                  fontSize: '13px',
                  color: '#0033cc'
                }}>
                  UGX {settlement.amount.toLocaleString()}
                </span>
                <span style={{ 
                  fontSize: '11px',
                  color: '#666'
                }}>
                  UGX {settlement.deductions.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            className="activate-code-btn" 
            style={{ background: '#666' }}
            onClick={() => setCurrentView("dashboard")}
          >
            Back to Dashboard
          </button>
          <button 
            className="activate-code-btn" 
            style={{ background: '#fef08a', color: 'black' }}
            onClick={exportSettlementsToExcel}
          >
            Export Settlements
          </button>
        </div>
      </div>
    </div>
  )

  const renderDisputes = () => (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">DISPUTED TRANSACTIONS</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={`tab-btn ${currentView === "dashboard" ? "active" : ""}`} onClick={() => setCurrentView("dashboard")}>
          Dashboard
        </button>
        <button className={`tab-btn ${currentView === "withdraw" ? "active" : ""}`} onClick={() => setCurrentView("withdraw")}>
          Withdraw
        </button>
        <button className={`tab-btn ${currentView === "ledger" ? "active" : ""}`} onClick={() => setCurrentView("ledger")}>
          Ledger
        </button>
        <button className={`tab-btn ${currentView === "settlements" ? "active" : ""}`} onClick={() => setCurrentView("settlements")}>
          Settlements
        </button>
        <button className={`tab-btn ${currentView === "disputes" ? "active" : ""}`} onClick={() => setCurrentView("disputes")}>
          Disputes
        </button>
      </div>

      {/* Dispute Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Held</div>
          <p className="stat-value">UGX 12,400</p>
          <div style={{ fontSize: '11px', color: '#666' }}>4 disputes</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Pending Review</div>
          <p className="stat-value">UGX 5,400</p>
          <div style={{ fontSize: '11px', color: '#666' }}>2 active disputes</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Resolved</div>
          <p className="stat-value">2</p>
          <div style={{ fontSize: '11px', color: '#666' }}>This month</div>
        </div>
      </div>

      {/* Filters */}
      <div className="tab-navigation" style={{ marginBottom: '20px' }}>
        <button 
          className={`tab-btn ${disputesFilter === 'all' ? 'active' : ''}`}
          onClick={() => setDisputesFilter('all')}
        >
          All
        </button>
        <button 
          className={`tab-btn ${disputesFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setDisputesFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`tab-btn ${disputesFilter === 'resolved' ? 'active' : ''}`}
          onClick={() => setDisputesFilter('resolved')}
        >
          Resolved
        </button>
      </div>

      {/* Dispute Count */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <p style={{ fontSize: '12px', color: '#666' }}>
          {filteredDisputes.length} disputes found
        </p>
      </div>

      {/* Disputes List */}
      <div className="commission-overview">
        <div className="section-title">All Disputes</div>
        <div className="ledger-entry" style={{ marginBottom: '8px' }}>
          {filteredDisputes.map((dispute) => (
            <div key={dispute.id} className="alert-item" style={{ marginBottom: '12px', padding: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px' }}>
                  <p className="alert-type" style={{ margin: 0, color: '#0033cc' }}>{dispute.title}</p>
                </div>
                <p className="alert-message" style={{ margin: '4px 0' }}>{dispute.description}</p>
                <p className="alert-time">{dispute.opened}</p>
                
                <div className="detail-row" style={{ marginTop: '8px', padding: '8px 0', borderTop: '1px solid #e0e0e0' }}>
                  <span className="detail-label">Dispute ID</span>
                  <span className="detail-value">{dispute.disputeId}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Reason</span>
                  <span className="detail-value">{dispute.reason}</span>
                </div>
                
                {dispute.details && (
                  <div className="detail-row">
                    <span className="detail-label">Details</span>
                    <span className="detail-value">{dispute.details}</span>
                  </div>
                )}
                
                {dispute.resolution && (
                  <div className="detail-row highlight">
                    <span className="detail-label">Resolution</span>
                    <span className="detail-value" style={{ color: '#2e7d32' }}>{dispute.resolution}</span>
                  </div>
                )}
                
                {dispute.amount > 0 && (
                  <div className="detail-row highlight">
                    <span className="detail-label">Held Amount</span>
                    <span className="detail-value" style={{ color: '#c62828' }}>
                      UGX {dispute.amount.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {dispute.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button 
                      className="activate-code-btn" 
                      style={{ 
                        background: '#f0f4ff', 
                        color: '#0033cc',
                        border: '1px solid #0033cc',
                        fontSize: '12px',
                        padding: '8px 12px'
                      }}
                    >
                      Contact Support
                    </button>
                    <button 
                      className="activate-code-btn"
                      style={{ 
                        fontSize: '12px',
                        padding: '8px 12px'
                      }}
                    >
                      Upload Proof
                    </button>
                  </div>
                )}
              </div>
              <span className={`status-badge ${dispute.status === 'resolved' ? 'valid' : 'invalid'}`}>
                {dispute.status}
              </span>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            className="activate-code-btn" 
            style={{ background: '#666' }}
            onClick={() => setCurrentView("dashboard")}
          >
            Back to Dashboard
          </button>
          <button 
            className="activate-code-btn"
            onClick={() => setCurrentView("ledger")}
          >
            View Ledger
          </button>
        </div>
      </div>
    </div>
  )

  // QR Code Modal
  const renderQRModal = () => (
    <div className={`modal-overlay ${showQR ? "active" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>SCAN QR CODE</h2>
          <button 
            className="modal-close"
            onClick={() => setShowQR(false)}
          >
            ×
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div className="qr-display">
            <div className="qr-placeholder">
              <div className="qr-icon">[QR]</div>
              <div className="qr-label">Scan to Complete Payment</div>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', fontSize: '14px', color: '#0033cc' }}>
            Amount: UGX {withdrawalData.amount.toLocaleString()}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="activate-code-btn" 
            style={{ background: '#666' }}
            onClick={() => setShowQR(false)}
          >
            Cancel
          </button>
          <button 
            className="activate-code-btn"
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
    <div className={`modal-overlay ${showWithdrawalSuccess ? "active" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>WITHDRAWAL SUCCESSFUL</h2>
          <button 
            className="modal-close"
            onClick={() => {
              setShowWithdrawalSuccess(false)
              setShowReceipt(true)
            }}
          >
            ×
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', color: '#2e7d32', marginBottom: '1rem' }}>✓</div>
          <h3>Withdrawal Processed</h3>
          <div style={{ fontSize: '2rem', fontWeight: '600', color: '#0033cc', margin: '1rem 0' }}>
            UGX {(parseFloat(withdrawalData.amount) || 0).toLocaleString()}
          </div>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Your withdrawal to {withdrawalData.method === 'mtn' ? 'MTN MoMo' : 
                               withdrawalData.method === 'airtel' ? 'Airtel Money' :
                               withdrawalData.method === 'bank' ? 'Bank Account' : 'Agent Payout'} has been initiated.
          </p>
          <div className="commission-overview" style={{ textAlign: 'left' }}>
            <div className="detail-row">
              <span className="detail-label">Fee</span>
              <span className="detail-value">UGX {withdrawalData.fee.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Net Amount</span>
              <span className="detail-value" style={{ color: '#2e7d32' }}>
                UGX {withdrawalData.netAmount.toLocaleString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Processing Time</span>
              <span className="detail-value">{withdrawalData.processingTime}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="activate-code-btn" 
            style={{ background: '#666' }}
            onClick={() => {
              setShowWithdrawalSuccess(false)
              resetWithdrawal()
              setCurrentView("dashboard")
            }}
          >
            Back to Dashboard
          </button>
          <button 
            className="activate-code-btn"
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
    <div className="modal-overlay active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>WITHDRAWAL RECEIPT</h2>
          <button 
            className="modal-close"
            onClick={() => {
              setShowReceipt(false)
              resetWithdrawal()
              setCurrentView("dashboard")
            }}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div ref={receiptRef} style={{ 
            padding: '20px', 
            background: 'white', 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <h2 style={{ textAlign: 'center', color: '#0033cc', marginBottom: '20px', fontSize: '18px' }}>Withdrawal Receipt</h2>
            
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
              <div className="detail-row">
                <span className="detail-label">Receipt ID:</span>
                <span className="detail-value">{receiptData?.id || `WD-${Date.now().toString().slice(-8)}`}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{receiptData?.date} {receiptData?.time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Method:</span>
                <span className="detail-value">
                  {withdrawalData.method === 'mtn' ? 'MTN MoMo' : 
                   withdrawalData.method === 'airtel' ? 'Airtel Money' :
                   withdrawalData.method === 'bank' ? 'Bank Account' : 'Agent Payout'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#0033cc', fontWeight: '600' }}>Transaction Details</h3>
              <div className="detail-row">
                <span className="detail-label">Withdrawal Amount:</span>
                <span className="detail-value">UGX {(parseFloat(withdrawalData.amount) || 0).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Processing Fee:</span>
                <span className="detail-value">UGX {withdrawalData.fee.toLocaleString()}</span>
              </div>
              <div className="detail-row highlight">
                <span className="detail-label">Net Amount:</span>
                <span className="detail-value" style={{ color: '#2e7d32' }}>UGX {withdrawalData.netAmount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Processing Time:</span>
                <span className="detail-value">{withdrawalData.processingTime}</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#0033cc', fontWeight: '600' }}>Destination Details</h3>
              <div className="detail-row">
                <span className="detail-label">Phone Number:</span>
                <span className="detail-value">{withdrawalData.phoneNumber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Name:</span>
                <span className="detail-value">{withdrawalData.accountName}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '2px dashed #cbd5e1', textAlign: 'center' }}>
              <span className="status-badge valid">Processing</span>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Thank you for using our wallet service!</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="activate-code-btn" 
            style={{ background: '#f0f4ff', color: '#0033cc', border: '1px solid #0033cc' }}
            onClick={exportToPDF}
          >
            Save as PDF
          </button>
          <button 
            className="activate-code-btn" 
            style={{ background: '#fef08a', color: 'black' }}
            onClick={shareReceipt}
          >
            Share Receipt
          </button>
          <button 
            className="activate-code-btn"
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
      <style jsx>{`
        /* Your original CSS styles - EXACTLY AS BEFORE */
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
          justify-content: center;
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

        .status-badge.pending {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Added for loading spinner */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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

      {currentView === "dashboard" && renderDashboard()}
      {currentView === "withdraw" && renderWithdraw()}
      {currentView === "ledger" && renderLedger()}
      {currentView === "settlements" && renderSettlements()}
      {currentView === "disputes" && renderDisputes()}
      
      {/* Modals */}
      {showQR && renderQRModal()}
      {showWithdrawalSuccess && renderWithdrawalSuccess()}
      {showReceipt && renderReceipt()}
    </>
  )
}

export default Wallet