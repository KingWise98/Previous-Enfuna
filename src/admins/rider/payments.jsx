"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Share2,
  Cloud,
  ArrowLeft,
  Upload,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Menu,
  X,
  Eye,
  Trash2,
  Copy,
  QrCode,
  Smartphone,
  CreditCard,
  Wallet,
  User,
  Phone,
  FileText,
  Smartphone as MobileIcon,
  Check,
  XCircle,
  Loader2,
  ExternalLink,
  Bell,
  Settings,
  CreditCard as VisaIcon,
  DollarSign,
  Users,
  PieChart,
  History,
  AlertTriangle,
  MessageSquare,
  Send,
  Smartphone as PhoneIcon,
  BarChart,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "lucide-react"
import axios from "axios"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
const PAYEE_PHONE_NUMBER = process.env.NEXT_PUBLIC_PAYEE_PHONE_NUMBER || "+256773595840"

// ==================== ENHANCED API SERVICE ====================

// Token management utilities
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token')
  }
  return null
}

const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token)
  }
}

const clearAuthTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const calculateRetryDelay = (attempt) => {
  const baseDelay = Math.min(1000 * Math.pow(2, attempt), 30000)
  const jitter = Math.random() * 1000
  return baseDelay + jitter
}

// Create axios instance with enhanced configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    config.headers['X-Request-Timestamp'] = Date.now().toString()
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Enhanced response interceptor with token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to server. Please check your internet connection.',
        retryable: true
      })
    }

    const { status } = error.response
    
    // Handle 401 Unauthorized - try to refresh token
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = getRefreshToken()
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          })
          
          const { access_token } = response.data
          setAuthToken(access_token)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        clearAuthTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    // Handle other errors
    if (status === 429) {
      return Promise.reject({
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please wait a moment.',
        retryable: true,
        retryAfter: error.response.headers['retry-after'] || 30
      })
    }
    
    if (status >= 500) {
      return Promise.reject({
        code: 'SERVER_ERROR',
        message: 'Server is temporarily unavailable. Please try again.',
        retryable: true
      })
    }
    
    // Return structured error
    return Promise.reject({
      code: error.response.data?.code || 'API_ERROR',
      message: error.response.data?.message || 'An error occurred',
      details: error.response.data?.errors,
      status
    })
  }
)

// Enhanced API service with retry logic
const createApiService = async (config, retries = 3) => {
  let lastError
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await apiClient({
        ...config,
        headers: {
          ...config.headers,
          'X-Attempt': attempt.toString(),
          'X-Retry-Delay': calculateRetryDelay(attempt).toString()
        }
      })
      return response.data
    } catch (error) {
      lastError = error
      
      // Don't retry non-retryable errors
      if (!error.retryable || attempt === retries) {
        throw error
      }
      
      // Wait before retry
      if (error.retryAfter) {
        await delay(error.retryAfter * 1000)
      } else {
        await delay(calculateRetryDelay(attempt))
      }
    }
  }
  
  throw lastError
}

// Fixed API endpoints - ensure consistency
const PaymentService = {
  // Generic Mobile Money
  initiatePayment: async (data) => {
    return createApiService({
      method: 'POST',
      url: '/api/mobile-money/payments/initiate/',
      data
    })
  },

  getPaymentStatus: async (referenceId) => {
    return createApiService({
      method: 'GET',
      url: `/api/mobile-money/payments/status/${referenceId}/`
    })
  },

  getPaymentHistory: async (params) => {
    return createApiService({
      method: 'GET',
      url: '/api/mobile-money/payments/history/',
      params
    })
  },

  // MTN MoMo APIs
  initiateMtnCollection: async (data) => {
    return createApiService({
      method: 'POST',
      url: '/api/mobile-money/momo/collection/',
      data
    })
  },

  getMtnTransactionStatus: async (referenceId) => {
    return createApiService({
      method: 'GET',
      url: `/api/mobile-money/momo/status/${referenceId}/`
    })
  },

  getMtnTransactions: async (params) => {
    return createApiService({
      method: 'GET',
      url: '/api/mobile-money/momo/transactions/',
      params
    })
  },

  // QR Payments
  createQrPayment: async (data) => {
    return createApiService({
      method: 'POST',
      url: '/api/mobile-money/qr/create/',
      data
    })
  },

  getQrStatus: async (referenceId) => {
    return createApiService({
      method: 'GET',
      url: `/api/mobile-money/qr/status/${referenceId}/`
    })
  },

  getQrImage: async (referenceId) => {
    return createApiService({
      method: 'GET',
      url: `/api/mobile-money/qr/image/${referenceId}/`,
      responseType: 'blob'
    })
  },

  // Payment Links
  createPaymentLink: async (data) => {
    return createApiService({
      method: 'POST',
      url: '/api/mobile-money/payment-links/create/',
      data
    })
  },

  getPaymentLinks: async () => {
    return createApiService({
      method: 'GET',
      url: '/api/mobile-money/payment-links/'
    })
  },
}

// ==================== CUSTOM HOOKS ====================

// Custom hook for payment polling
const usePaymentPolling = (referenceId, paymentMethod = 'generic', options = {}) => {
  const {
    interval = 5000,
    maxAttempts = 36,
    onSuccess,
    onError,
    onTimeout
  } = options

  const [status, setStatus] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  
  const attemptsRef = useRef(0)
  const intervalRef = useRef(null)

  const getStatus = useCallback(async () => {
    if (!referenceId) return

    try {
      let response
      
      switch (paymentMethod) {
        case 'mtn':
          response = await PaymentService.getMtnTransactionStatus(referenceId)
          break
        case 'qr':
          response = await PaymentService.getQrStatus(referenceId)
          break
        default:
          response = await PaymentService.getPaymentStatus(referenceId)
      }

      setStatus(response.status)
      setData(response)

      if (response.status === 'SUCCESS' || response.status === 'successful' || response.status === 'completed') {
        stopPolling()
        onSuccess && onSuccess(response)
      } else if (response.status === 'FAILED' || response.status === 'failed' || response.status === 'cancelled') {
        stopPolling()
        onError && onError(response)
      }
    } catch (err) {
      console.error('Polling error:', err)
      attemptsRef.current += 1
      
      if (attemptsRef.current >= maxAttempts) {
        stopPolling()
        setError({ code: 'POLLING_TIMEOUT', message: 'Payment status check timeout' })
        onTimeout && onTimeout()
      }
    }
  }, [referenceId, paymentMethod, maxAttempts, onSuccess, onError, onTimeout])

  const startPolling = useCallback(() => {
    if (!referenceId || isPolling) return

    setIsPolling(true)
    attemptsRef.current = 0
    
    getStatus()
    
    intervalRef.current = setInterval(getStatus, interval)
  }, [referenceId, isPolling, interval, getStatus])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPolling(false)
  }, [])

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  return {
    status,
    isPolling,
    error,
    data,
    startPolling,
    stopPolling
  }
}

// ==================== MAIN COMPONENT ====================

export default function PaymentsApp() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [activeTab, setActiveTab] = useState("daily")
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState("")
  const [disputeReason, setDisputeReason] = useState("")
  const [disputeTab, setDisputeTab] = useState("file")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentNotes, setPaymentNotes] = useState("")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [activePayment, setActivePayment] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [generatedQrCode, setGeneratedQrCode] = useState(null)
  const [paymentReference, setPaymentReference] = useState("")
  const [showQrModal, setShowQrModal] = useState(false)
  const [pollingInterval, setPollingInterval] = useState(null)
  const [statusMessage, setStatusMessage] = useState({ type: 'info', text: '' })
  const [ussdPrompt, setUssdPrompt] = useState("")
  const [showUssdModal, setShowUssdModal] = useState(false)
  const [receivingPhone, setReceivingPhone] = useState(PAYEE_PHONE_NUMBER)
  const [paymentLinks, setPaymentLinks] = useState([])
  const [showPaymentLinks, setShowPaymentLinks] = useState(false)
  const [mtnTransactions, setMtnTransactions] = useState([])
  const [paymentHistory, setPaymentHistory] = useState([])
  
  const { startPolling, stopPolling, isPolling: isStatusPolling } = usePaymentPolling(paymentReference, paymentMethod === 'mtn' ? 'mtn' : paymentMethod === 'qr' ? 'qr' : 'generic', {
    onSuccess: handlePaymentSuccess,
    onError: handlePaymentError,
    onTimeout: handlePaymentTimeout
  })

  const [analyticsData, setAnalyticsData] = useState({
    daily: { cash: 50000, mtn: 180000, airtel: 20000, qr: 40000 },
    weekly: { cash: 350000, mtn: 1250000, airtel: 140000, qr: 280000 },
    monthly: { cash: 1500000, mtn: 5400000, airtel: 600000, qr: 1200000 }
  })

  // Stats data
  const [dashboardStats, setDashboardStats] = useState([
    {
      label: "Total Collections Today",
      value: "125,000",
      currency: "UGX",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "blue",
    },
    { label: "Pending Payments", value: "18", change: "+2", trend: "warning", icon: Clock, color: "yellow" },
    { label: "Pending Reconciliations", value: "23", change: "+20.5%", trend: "up", icon: AlertCircle, color: "green" },
    { label: "Success Rate", value: "98.2%", change: "+20.5%", trend: "up", icon: CheckCircle, color: "purple" },
  ])

  const paymentMethodsData = [
    { id: "mtn", name: "MTN MoMo", percentage: 82, transactions: "1240", color: "payment-mtn", icon: Smartphone },
    { id: "airtel", name: "Airtel Money", percentage: 2, transactions: "10", color: "payment-airtel", icon: Smartphone },
    { id: "cash", name: "Cash", percentage: 50, transactions: "460", color: "payment-cash", icon: Wallet },
    { id: "qr", name: "QR Code", percentage: 12, transactions: "60", color: "payment-qr", icon: QrCode },
    { id: "split", name: "Split Payment", percentage: 12, transactions: "60", color: "payment-split", icon: Share2 },
    { id: "card", name: "Card Payment", percentage: 1, transactions: "2", color: "payment-card", icon: CreditCard },
  ]

  // Initialize with sample data
  const [recentTransactionsData, setRecentTransactionsData] = useState([
    { id: 1, type: "Quick Trip", method: "Cash", time: "09:30 AM", status: "Completed", amount: "2,500", date: "03-12-2025", txnId: "QT6730001" },
    { id: 2, type: "Delivery", method: "MTN MoMo", time: "09:30 AM", status: "Completed", amount: "12,000", date: "03-12-2025", txnId: "QT6730002" },
    { id: 3, type: "Quick Trip", method: "QR Code", time: "09:30 AM", status: "Failed", amount: "3,000", date: "03-12-2025", txnId: "QT6730003" },
    { id: 4, type: "Normal Trip", method: "MTN MoMo", time: "09:30 AM", status: "Pending", amount: "20,000", date: "03-12-2025", txnId: "QT6730004" },
    { id: 5, type: "Delivery", method: "Cash", time: "09:30 AM", status: "Completed", amount: "15,000", date: "03-12-2025", txnId: "QT6730005" },
  ])

  const [analyticsCards, setAnalyticsCards] = useState([
    { label: "Cash", amount: "50,000", change: "+12.5%", trend: "up" },
    { label: "MTN MoMo", amount: "180,000", change: "+22.5%", trend: "up" },
    { label: "Split Pay", amount: "15,000", change: "-2.5%", trend: "down" },
    { label: "QR Code", amount: "40,000", change: "-2.5%", trend: "down" },
  ])

  const disputesData = [
    {
      id: "TXN-9000900",
      reason: "Amount incorrect",
      filed: "12-12-2025",
      notes: "Under investigation by finance team...",
      status: "Under Review",
      statusColor: "yellow",
    },
    {
      id: "TXN-9000901",
      reason: "Amount incorrect",
      filed: "12-12-2025",
      notes: "Awaiting customer documentations",
      status: "Open",
      statusColor: "red",
    },
    {
      id: "TXN-9000902",
      reason: "Amount incorrect",
      filed: "12-12-2025",
      notes: "Under investigation by finance team...",
      status: "Under Review",
      statusColor: "yellow",
    },
    {
      id: "TXN-9000903",
      reason: "Duplicate Charge",
      filed: "12-12-2025",
      notes: "Refund Processed, dispute closed",
      status: "Resolved",
      statusColor: "green",
    },
  ]

  const [paymentsHistoryData, setPaymentsHistoryData] = useState([
    {
      id: 1,
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730001",
      amount: "2,500",
      method: "Cash",
      status: "Completed",
      customerName: "John Doe",
      customerPhone: "+256 712 345678",
      notes: "Airport trip",
      timestamp: "09:30 AM",
    },
    {
      id: 2,
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730002",
      amount: "2,500",
      method: "MTN MoMo",
      status: "Completed",
      customerName: "Jane Smith",
      customerPhone: "+256 773 987654",
      notes: "",
      timestamp: "10:15 AM",
    },
    {
      id: 3,
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730003",
      amount: "2,500",
      method: "QR Code",
      status: "Failed",
      customerName: "",
      customerPhone: "",
      notes: "Network timeout",
      timestamp: "11:45 AM",
    },
    {
      id: 4,
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730004",
      amount: "2,500",
      method: "MTN MoMo",
      status: "Completed",
      customerName: "Robert Johnson",
      customerPhone: "+256 701 112233",
      notes: "City center trip",
      timestamp: "01:20 PM",
    },
    {
      id: 5,
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730005",
      amount: "2,500",
      method: "Airtel Money",
      status: "Pending",
      customerName: "Sarah Miller",
      customerPhone: "+256 752 445566",
      notes: "",
      timestamp: "02:30 PM",
    },
    {
      id: 6,
      description: "Quick Trip",
      date: "03-12-2025",
      txnId: "QT6730006",
      amount: "2,500",
      method: "Cash",
      status: "Completed",
      customerName: "David Wilson",
      customerPhone: "",
      notes: "Evening trip",
      timestamp: "04:45 PM",
    },
  ])

  const [pendingPaymentsData, setPendingPaymentsData] = useState([
    {
      id: "T9081",
      type: "Quick Trip",
      method: "MTN MoMo",
      ref: "Mo780045",
      amount: "67,000",
      date: "03-12-2025",
      time: "10:30 AM",
      status: "Pending",
      statusColor: "yellow",
      customerName: "John Doe",
      customerPhone: "+256 712 345678",
      notes: "Airport transfer",
    },
    {
      id: "T9082",
      type: "Delivery",
      method: "MTN MoMo",
      ref: "Mo780046",
      amount: "2,000",
      date: "03-12-2025",
      time: "10:30 AM",
      status: "Verifying",
      statusColor: "purple",
      customerName: "Jane Smith",
      customerPhone: "+256 773 987654",
      notes: "Document delivery",
    },
    {
      id: "T9083",
      type: "Normal Trip",
      method: "QR Code",
      ref: "QR780045",
      amount: "7,000",
      date: "03-12-2025",
      time: "10:30 AM",
      status: "Pending",
      statusColor: "yellow",
      customerName: "",
      customerPhone: "",
      notes: "",
    },
    {
      id: "T9084",
      type: "Quick Trip",
      method: "Airtel Money",
      ref: "AA780000",
      amount: "5,000",
      date: "03-12-2025",
      time: "10:30 AM",
      status: "Processing",
      statusColor: "blue",
      customerName: "Robert Kim",
      customerPhone: "+256 701 998877",
      notes: "Hospital trip",
    },
  ])

  // ==================== UTILITY FUNCTIONS ====================

  const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Handle different formats
    if (cleaned.startsWith('256')) {
      return cleaned
    } else if (cleaned.startsWith('0')) {
      return '256' + cleaned.substring(1)
    } else if (cleaned.startsWith('+')) {
      return cleaned.substring(1)
    } else {
      return '256' + cleaned
    }
  }

  const savePendingTransaction = (transaction) => {
    if (typeof window !== 'undefined') {
      try {
        const pending = JSON.parse(localStorage.getItem('pendingTransactions') || '[]')
        pending.push({
          ...transaction,
          timestamp: new Date().toISOString()
        })
        localStorage.setItem('pendingTransactions', JSON.stringify(pending.slice(-50))) // Keep last 50
      } catch (error) {
        console.error('Failed to save pending transaction:', error)
      }
    }
  }

  const logPaymentError = (errorData) => {
    console.error('Payment Error:', errorData)
    
    if (typeof window !== 'undefined') {
      try {
        const errors = JSON.parse(localStorage.getItem('paymentErrors') || '[]')
        errors.push({
          ...errorData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
        localStorage.setItem('paymentErrors', JSON.stringify(errors.slice(-100)))
      } catch (error) {
        console.error('Failed to log payment error:', error)
      }
    }
  }

  const handleCashPayment = (amount) => {
    const cashTransaction = {
      id: Date.now(),
      description: paymentNotes || "Cash Payment",
      date: new Date().toLocaleDateString('en-GB'),
      txnId: `CASH-${Date.now().toString().slice(-6)}`,
      amount: amount.toLocaleString(),
      method: "Cash",
      status: "Completed",
      customerName: customerName || "",
      customerPhone: customerPhone || "",
      notes: paymentNotes || "",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }

    setRecentTransactionsData(prev => [cashTransaction, ...prev.slice(0, 4)])
    setPaymentsHistoryData(prev => [cashTransaction, ...prev])

    setStatusMessage({
      type: 'success',
      text: `Cash payment of UGX ${amount.toLocaleString()} received successfully!`
    })

    // Reset form
    setTimeout(() => {
      resetPaymentForm()
    }, 2000)
  }

  const resetPaymentForm = () => {
    setPaymentAmount("")
    setCustomerName("")
    setCustomerPhone("")
    setPaymentNotes("")
    setShowPaymentPopup(false)
    setShowQrModal(false)
    setShowUssdModal(false)
    setIsLoading(false)
    setStatusMessage({ type: 'info', text: '' })
    stopPolling()
  }

  // ==================== PAYMENT HANDLERS ====================

  function handlePaymentSuccess(data) {
    setStatusMessage({
      type: 'success',
      text: "Payment completed successfully!"
    })
    
    setIsLoading(false)
    
    // Refresh transactions
    loadPaymentHistory()
    loadMtnTransactions()
    
    // Close modals
    setTimeout(() => {
      resetPaymentForm()
    }, 2000)
  }

  function handlePaymentError(error) {
    setStatusMessage({
      type: 'error',
      text: `Payment failed: ${error.message || 'Unknown error'}`
    })
    setIsLoading(false)
  }

  function handlePaymentTimeout() {
    setStatusMessage({
      type: 'warning',
      text: 'Payment confirmation timeout. Please check with customer.'
    })
    setIsLoading(false)
  }

  // Handle new payment
  const handleReceivePayment = async () => {
    // Validation
    if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
      setStatusMessage({
        type: 'error',
        text: "Please enter a valid amount"
      })
      return
    }

    if (paymentMethod === 'mtn' && !customerPhone) {
      setStatusMessage({
        type: 'error',
        text: "Please enter customer phone number for MTN MoMo payment"
      })
      return
    }

    setIsLoading(true)
    setStatusMessage({
      type: 'info',
      text: "Initiating payment..."
    })

    try {
      const amount = parseFloat(paymentAmount)
      
      switch(paymentMethod) {
        case "mtn":
          const mtnData = {
            amount: amount,
            customer_msisdn: formatPhoneNumber(customerPhone),
            merchant_msisdn: formatPhoneNumber(receivingPhone),
            description: paymentNotes || "Payment received",
            external_reference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }
          
          const mtnResult = await PaymentService.initiateMtnCollection(mtnData)
          
          if (mtnResult.success) {
            savePendingTransaction({
              id: mtnResult.reference_id,
              type: 'mtn',
              amount: amount,
              data: mtnResult,
              timestamp: new Date().toISOString()
            })

            setUssdPrompt(`*165*1*${formatPhoneNumber(receivingPhone)}*${amount}*1#`)
            setPaymentReference(mtnResult.reference_id)
            setShowUssdModal(true)
            setStatusMessage({
              type: 'success',
              text: "USSD prompt sent to customer's phone. Waiting for payment confirmation..."
            })
            
            startPolling()
            
          } else {
            throw new Error(mtnResult.message || 'MTN payment initiation failed')
          }
          break
          
        case "qr":
          const qrData = {
            amount: amount,
            description: paymentNotes || "QR Payment",
            merchant_account: receivingPhone,
            customer_name: customerName,
            customer_phone: customerPhone,
            callback_url: `${window.location.origin}/api/payment-callback`
          }
          
          const qrResult = await PaymentService.createQrPayment(qrData)
          
          if (qrResult.success) {
            savePendingTransaction({
              id: qrResult.reference_id,
              type: 'qr',
              amount: amount,
              data: qrResult,
              timestamp: new Date().toISOString()
            })

            setPaymentReference(qrResult.reference_id)
            
            // Fetch QR image with error handling
            try {
              const qrBlob = await PaymentService.getQrImage(qrResult.reference_id)
              const qrImageUrl = URL.createObjectURL(qrBlob)
              setGeneratedQrCode(qrImageUrl)
            } catch (qrImageError) {
              console.warn('QR image generation failed:', qrImageError)
              // Continue without QR image - user can still use reference
            }
            
            setShowQrModal(true)
            setStatusMessage({
              type: 'success',
              text: "QR code generated. Scan to complete payment..."
            })
            
            startPolling()
            
          } else {
            throw new Error(qrResult.message || 'QR payment creation failed')
          }
          break
          
        case "airtel":
          // Similar to MTN but for Airtel
          const airtelData = {
            amount: amount,
            customer_phone: formatPhoneNumber(customerPhone),
            merchant_phone: formatPhoneNumber(receivingPhone),
            description: paymentNotes || "Airtel Money Payment",
            external_reference: `AIR-${Date.now()}`
          }
          
          const airtelResult = await PaymentService.initiatePayment(airtelData)
          
          if (airtelResult.success) {
            savePendingTransaction({
              id: airtelResult.reference_id,
              type: 'airtel',
              amount: amount,
              data: airtelResult,
              timestamp: new Date().toISOString()
            })

            setUssdPrompt(`*185*${amount}*${formatPhoneNumber(receivingPhone)}#`)
            setPaymentReference(airtelResult.reference_id)
            setShowUssdModal(true)
            setStatusMessage({
              type: 'success',
              text: "Airtel Money prompt sent. Waiting for payment confirmation..."
            })
            
            startPolling()
          } else {
            throw new Error(airtelResult.message || 'Airtel payment initiation failed')
          }
          break
          
        case "cash":
        default:
          handleCashPayment(amount)
          return
      }
      
    } catch (error) {
      console.error("Payment failed:", error)
      
      // Show user-friendly error message
      let errorMessage = 'Payment failed. Please try again.'
      
      if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your internet connection.'
      } else if (error.code === 'SERVER_ERROR') {
        errorMessage = 'Server is temporarily unavailable. Please try again in a moment.'
      } else if (error.code === 'RATE_LIMITED') {
        errorMessage = 'Too many requests. Please wait a moment before trying again.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setStatusMessage({
        type: 'error',
        text: errorMessage
      })
      
      logPaymentError({
        method: paymentMethod,
        amount: paymentAmount,
        error: error
      })
    } finally {
      if (paymentMethod === 'cash') {
        setIsLoading(false)
      }
    }
  }

  // Handle retry payment
  const handleRetryPayment = async (paymentId) => {
    setIsLoading(true)
    try {
      const payment = pendingPaymentsData.find(p => p.id === paymentId)
      if (!payment) return
      
      switch(payment.method) {
        case "MTN MoMo":
          const mtnResult = await PaymentService.initiateMtnCollection({
            amount: parseInt(payment.amount.replace(/,/g, '')),
            customer_msisdn: payment.customerPhone || customerPhone,
            merchant_msisdn: receivingPhone,
            description: payment.notes || payment.type,
            external_reference: payment.ref
          })
          
          if (mtnResult.success) {
            savePendingTransaction({
              id: mtnResult.reference_id,
              type: 'mtn_retry',
              amount: parseInt(payment.amount.replace(/,/g, '')),
              originalId: paymentId,
              data: mtnResult,
              timestamp: new Date().toISOString()
            })

            setUssdPrompt(`*165*1*${receivingPhone}*${payment.amount}*1#`)
            setPaymentReference(mtnResult.reference_id)
            setShowUssdModal(true)
            setStatusMessage({
              type: 'success',
              text: "USSD prompt sent to customer's phone. Waiting for payment confirmation..."
            })
            
            startPolling()
            
            setPendingPaymentsData(prev => 
              prev.map(p => p.id === paymentId ? {...p, status: "Processing"} : p)
            )
          }
          break
          
        case "QR Code":
          const qrResult = await PaymentService.createQrPayment({
            amount: parseInt(payment.amount.replace(/,/g, '')),
            description: payment.notes || payment.type,
            merchant_account: receivingPhone,
            callback_url: `${window.location.origin}/payment-callback`
          })
          
          if (qrResult.success) {
            savePendingTransaction({
              id: qrResult.reference_id,
              type: 'qr_retry',
              amount: parseInt(payment.amount.replace(/,/g, '')),
              originalId: paymentId,
              data: qrResult,
              timestamp: new Date().toISOString()
            })

            setPaymentReference(qrResult.reference_id)
            try {
              const qrImageUrl = await PaymentService.getQrImage(qrResult.reference_id)
              setGeneratedQrCode(qrImageUrl)
            } catch (error) {
              console.warn('QR image failed on retry:', error)
            }
            setShowQrModal(true)
            setStatusMessage({
              type: 'success',
              text: "Scan the QR code to complete payment..."
            })
            
            startPolling()
            
            setPendingPaymentsData(prev => 
              prev.map(p => p.id === paymentId ? {...p, status: "Processing"} : p)
            )
          }
          break
          
        default:
          setStatusMessage({
            type: 'info',
            text: `Retrying ${payment.method} payment...`
          })
      }
      
    } catch (error) {
      console.error("Retry failed:", error)
      setStatusMessage({
        type: 'error',
        text: `Retry failed: ${error.response?.data?.message || error.message}`
      })
      setIsLoading(false)
    }
  }

  // Create payment link
  const handleCreatePaymentLink = async () => {
    if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
      setStatusMessage({
        type: 'error',
        text: "Please enter a valid amount"
      })
      return
    }

    setIsLoading(true)
    setStatusMessage({
      type: 'info',
      text: "Creating payment link..."
    })
    
    try {
      const amount = parseFloat(paymentAmount)
      
      const linkData = {
        amount: amount,
        description: paymentNotes || "Payment Request",
        merchant_account: receivingPhone,
        customer_name: customerName,
        customer_phone: customerPhone,
        expires_in: 24,
        metadata: {
          notes: paymentNotes
        }
      }
      
      const result = await PaymentService.createPaymentLink(linkData)
      
      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: `Payment link created!`
        })
        setPaymentLinks(prev => [...prev, {
          link: result.link,
          short_code: result.short_code,
          amount: amount,
          status: 'active',
          created_at: new Date().toISOString()
        }])
        
        // Copy to clipboard
        navigator.clipboard.writeText(result.link)
        alert("Payment link copied to clipboard!")
      } else {
        setStatusMessage({
          type: 'error',
          text: `Failed to create payment link: ${result.message}`
        })
      }
    } catch (error) {
      console.error("Failed to create payment link:", error)
      setStatusMessage({
        type: 'error',
        text: `Failed: ${error.response?.data?.message || error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load data functions
  const loadPaymentHistory = async () => {
    try {
      const history = await PaymentService.getPaymentHistory({
        page: 1,
        limit: 50,
        status: 'all'
      })
      if (history && history.transactions) {
        setPaymentsHistoryData(history.transactions)
      }
    } catch (error) {
      console.error('Failed to load payment history:', error)
      setStatusMessage({
        type: 'error',
        text: 'Unable to load payment history'
      })
    }
  }

  const loadMtnTransactions = async () => {
    try {
      const transactions = await PaymentService.getMtnTransactions({
        type: 'collection',
        status: 'all',
        limit: 50
      })
      if (transactions && transactions.transactions) {
        setMtnTransactions(transactions.transactions)
      }
    } catch (error) {
      console.error('Failed to load MTN transactions:', error)
    }
  }

  const loadPaymentLinks = async () => {
    try {
      const links = await PaymentService.getPaymentLinks()
      if (links && links.links) {
        setPaymentLinks(links.links)
      }
    } catch (error) {
      console.error('Failed to load payment links:', error)
    }
  }

  // Filter transactions based on search and active filter
  useEffect(() => {
    let filtered = []
    
    switch(currentView) {
      case "history":
        filtered = paymentsHistoryData.filter((transaction) => {
          const matchesSearch = 
            searchQuery === "" ||
            transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (transaction.customerName && transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
          
          const matchesFilter = 
            activeFilter === "all" ||
            (activeFilter === "completed" && transaction.status === "Completed") ||
            (activeFilter === "pending" && transaction.status === "Pending") ||
            (activeFilter === "failed" && transaction.status === "Failed")
          
          return matchesSearch && matchesFilter
        })
        setFilteredTransactions(filtered)
        break
        
      case "pending":
        filtered = pendingPaymentsData.filter((payment) => {
          const matchesSearch = 
            searchQuery === "" ||
            payment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (payment.customerName && payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
          
          const matchesFilter = 
            activeFilter === "all" ||
            (activeFilter === "pending" && payment.status === "Pending") ||
            (activeFilter === "processing" && (payment.status === "Processing" || payment.status === "Verifying"))
          
          return matchesSearch && matchesFilter
        })
        setFilteredTransactions(filtered)
        break
        
      default:
        filtered = []
    }
  }, [searchQuery, activeFilter, currentView, paymentsHistoryData, pendingPaymentsData])

  // Load data on component mount
  useEffect(() => {
    loadPaymentHistory()
    loadMtnTransactions()
    loadPaymentLinks()
    updateAnalyticsCards()
  }, [activeTab])

  const updateAnalyticsCards = () => {
    const data = analyticsData[activeTab]
    setAnalyticsCards([
      { label: "Cash", amount: data.cash.toLocaleString(), change: "+12.5%", trend: "up" },
      { label: "MTN MoMo", amount: data.mtn.toLocaleString(), change: "+22.5%", trend: "up" },
      { label: "Split Pay", amount: "15,000", change: "-2.5%", trend: "down" },
      { label: "QR Code", amount: data.qr.toLocaleString(), change: "-2.5%", trend: "down" },
    ])
  }

  // Handle view transaction details
  const handleViewDetails = (transaction) => {
    setSelectedPayment(transaction)
    setShowTransactionDetails(true)
  }

  // ==================== RENDER FUNCTIONS ====================

  // Render Payment Popup
  const renderPaymentPopup = () => (
    <div className="payment-popup-overlay" onClick={() => !isLoading && setShowPaymentPopup(false)}>
      <div className="payment-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Receive Payment</h3>
          <button onClick={() => !isLoading && setShowPaymentPopup(false)} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>
        
        <div className="popup-content">
          <div className="form-group">
            <label>Amount Received (UGX)</label>
            <div className="amount-input-wrapper">
              <span className="currency-prefix">UGX</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                disabled={isLoading}
                className="amount-input"
                min="100"
                step="100"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Receiving Phone Number</label>
            <div className="input-with-icon">
              <PhoneIcon size={16} />
              <input
                type="tel"
                placeholder="Enter receiving phone number"
                value={receivingPhone}
                onChange={(e) => setReceivingPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="form-hint">Money will be sent to this number</div>
          </div>
          
          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-methods-grid">
              <button 
                className={`method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
                disabled={isLoading}
                type="button"
              >
                <Wallet size={20} />
                <span>Cash</span>
              </button>
              
              <button 
                className={`method-btn ${paymentMethod === 'mtn' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('mtn')}
                disabled={isLoading}
                type="button"
              >
                <Smartphone size={20} />
                <span>MTN MoMo</span>
              </button>
              
              <button 
                className={`method-btn ${paymentMethod === 'airtel' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('airtel')}
                disabled={isLoading}
                type="button"
              >
                <Smartphone size={20} />
                <span>Airtel Money</span>
              </button>
              
              <button 
                className={`method-btn ${paymentMethod === 'qr' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('qr')}
                disabled={isLoading}
                type="button"
              >
                <QrCode size={20} />
                <span>QR Code</span>
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Customer Name (Optional)</label>
            <div className="input-with-icon">
              <User size={16} />
              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Customer Phone (Optional)</label>
            <div className="input-with-icon">
              <Phone size={16} />
              <input
                type="tel"
                placeholder="Customer phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                disabled={isLoading}
                required={paymentMethod === 'mtn' || paymentMethod === 'airtel'}
              />
            </div>
            {['mtn', 'airtel'].includes(paymentMethod) && (
              <div className="form-hint required">Required for {paymentMethod === 'mtn' ? 'MTN MoMo' : 'Airtel Money'}</div>
            )}
          </div>
          
          <div className="form-group">
            <label>Notes (Optional)</label>
            <div className="input-with-icon">
              <FileText size={16} />
              <input
                type="text"
                placeholder="Payment description or notes"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="payment-summary">
            <div className="summary-row">
              <span>Amount:</span>
              <strong>UGX {paymentAmount ? parseInt(paymentAmount).toLocaleString() : "0"}</strong>
            </div>
            <div className="summary-row">
              <span>Payment Method:</span>
              <strong>{paymentMethod === 'mtn' ? 'MTN MoMo' : 
                      paymentMethod === 'airtel' ? 'Airtel Money' : 
                      paymentMethod === 'qr' ? 'QR Code' : 
                      'Cash'}</strong>
            </div>
            <div className="summary-row">
              <span>Receiving Number:</span>
              <strong>{receivingPhone}</strong>
            </div>
          </div>
          
          {statusMessage.text && (
            <div className={`status-message ${statusMessage.type === 'success' ? 'success' : statusMessage.type === 'error' ? 'error' : 'info'}`}>
              {statusMessage.text}
            </div>
          )}
          
          <div className="popup-actions">
            <button 
              className="cancel-btn"
              onClick={() => !isLoading && resetPaymentForm()}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="confirm-btn"
              onClick={handleReceivePayment}
              disabled={isLoading || !paymentAmount || (['mtn', 'airtel'].includes(paymentMethod) && !customerPhone)}
            >
              {(isLoading || isStatusPolling) ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  Processing...
                </>
              ) : (
                'Receive Payment'
              )}
            </button>
          </div>
          
          <div className="alternative-actions">
            <button 
              className="alternative-btn"
              onClick={() => {
                setShowPaymentPopup(false)
                setShowPaymentLinks(true)
              }}
              disabled={isLoading}
            >
              <Share2 size={16} />
              Create Payment Link Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Render QR Code Modal
  const renderQrModal = () => (
    <div className="payment-popup-overlay" onClick={() => !isLoading && setShowQrModal(false)}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Scan QR Code to Pay</h3>
          <button onClick={() => !isLoading && setShowQrModal(false)} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>
        
        <div className="popup-content">
          <div className="qr-container">
            {generatedQrCode ? (
              <img src={generatedQrCode} alt="Payment QR Code" className="qr-image" />
            ) : (
              <div className="qr-placeholder">
                <QrCode size={48} />
                <div>Generating QR Code...</div>
              </div>
            )}
          </div>
          
          <div className="qr-instructions">
            <h4>Instructions:</h4>
            <ol>
              <li>Open your mobile money app</li>
              <li>Tap on 'Scan QR Code'</li>
              <li>Point your camera at this QR code</li>
              <li>Confirm the payment amount and details</li>
              <li>Enter your PIN to complete payment</li>
            </ol>
          </div>
          
          <div className="payment-details">
            <div className="detail-item">
              <span>Amount:</span>
              <strong>UGX {paymentAmount ? parseInt(paymentAmount).toLocaleString() : "0"}</strong>
            </div>
            <div className="detail-item">
              <span>Reference:</span>
              <code>{paymentReference}</code>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(paymentReference)
                  alert("Reference copied!")
                }}
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          {statusMessage.text && (
            <div className={`status-message ${statusMessage.type === 'success' ? 'success' : statusMessage.type === 'error' ? 'error' : 'info'}`}>
              {statusMessage.text}
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              className="secondary-btn"
              onClick={() => {
                navigator.clipboard.writeText(paymentReference)
                alert("Reference copied to clipboard!")
              }}
            >
              <Copy size={16} />
              Copy Reference
            </button>
            <button 
              className="primary-btn"
              onClick={() => resetPaymentForm()}
              disabled={isLoading || isStatusPolling}
            >
              {(isLoading || isStatusPolling) ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  Waiting for Payment...
                </>
              ) : (
                'Done'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Render USSD Modal
  const renderUssdModal = () => (
    <div className="payment-popup-overlay" onClick={() => !isLoading && setShowUssdModal(false)}>
      <div className="ussd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>USSD Payment Prompt</h3>
          <button onClick={() => !isLoading && setShowUssdModal(false)} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>
        
        <div className="popup-content">
          <div className="ussd-prompt">
            <div className="ussd-code">
              <code>{ussdPrompt}</code>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(ussdPrompt)
                  alert("USSD code copied!")
                }}
              >
                <Copy size={14} />
              </button>
            </div>
            
            <div className="ussd-instructions">
              <h4>Instructions:</h4>
              <ol>
                <li>Dial <strong>{ussdPrompt}</strong> on your phone</li>
                <li>Or copy the code above and paste in your dialer</li>
                <li>Follow the USSD menu prompts</li>
                <li>Enter your PIN to confirm payment</li>
                <li>Wait for confirmation message</li>
              </ol>
            </div>
          </div>
          
          <div className="payment-details">
            <div className="detail-item">
              <span>Amount:</span>
              <strong>UGX {paymentAmount ? parseInt(paymentAmount).toLocaleString() : "0"}</strong>
            </div>
            <div className="detail-item">
              <span>To:</span>
              <strong>{receivingPhone}</strong>
            </div>
            <div className="detail-item">
              <span>Reference:</span>
              <code>{paymentReference}</code>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(paymentReference)
                  alert("Reference copied!")
                }}
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          {statusMessage.text && (
            <div className={`status-message ${statusMessage.type === 'success' ? 'success' : statusMessage.type === 'error' ? 'error' : 'info'}`}>
              {statusMessage.text}
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              className="secondary-btn"
              onClick={() => {
                const smsText = `Pay UGX ${paymentAmount} to ${receivingPhone} using USSD: ${ussdPrompt}`
                const smsUrl = `sms:${customerPhone}?body=${encodeURIComponent(smsText)}`
                window.location.href = smsUrl
              }}
            >
              <Send size={16} />
              Send SMS to Customer
            </button>
            <button 
              className="primary-btn"
              onClick={() => resetPaymentForm()}
              disabled={isLoading || isStatusPolling}
            >
              {(isLoading || isStatusPolling) ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  Waiting for Payment...
                </>
              ) : (
                'Done'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Render Transaction Details Popup
  const renderTransactionDetails = () => (
    <div className="payment-popup-overlay" onClick={() => setShowTransactionDetails(false)}>
      <div className="transaction-details-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Transaction Details</h3>
          <button onClick={() => setShowTransactionDetails(false)}>
            <X size={20} />
          </button>
        </div>
        
        {selectedPayment && (
          <div className="popup-content">
            <div className="transaction-header">
              <div className="transaction-amount">
                <span>UGX {selectedPayment.amount}</span>
                <span className={`status-badge ${selectedPayment.status === 'Completed' ? 'valid' : 
                                 selectedPayment.status === 'Pending' ? 'pending' : 'invalid'}`}>
                  {selectedPayment.status}
                </span>
              </div>
              <div className="transaction-method">
                {selectedPayment.method}
              </div>
            </div>
            
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Transaction ID:</span>
                <span className="detail-value">{selectedPayment.txnId || selectedPayment.ref}</span>
                <button className="copy-btn" onClick={() => {
                  navigator.clipboard.writeText(selectedPayment.txnId || selectedPayment.ref)
                  alert("Copied to clipboard!")
                }}>
                  <Copy size={14} />
                </button>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Date & Time:</span>
                <span className="detail-value">{selectedPayment.date} • {selectedPayment.time || selectedPayment.timestamp}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedPayment.type || selectedPayment.description}</span>
              </div>
              
              {selectedPayment.customerName && (
                <div className="detail-item">
                  <span className="detail-label">Customer Name:</span>
                  <span className="detail-value">{selectedPayment.customerName}</span>
                </div>
              )}
              
              {selectedPayment.customerPhone && (
                <div className="detail-item">
                  <span className="detail-label">Customer Phone:</span>
                  <span className="detail-value">{selectedPayment.customerPhone}</span>
                </div>
              )}
              
              {selectedPayment.notes && (
                <div className="detail-item full-width">
                  <span className="detail-label">Notes:</span>
                  <span className="detail-value">{selectedPayment.notes}</span>
                </div>
              )}
            </div>
            
            <div className="transaction-actions">
              {selectedPayment.status === "Failed" && (
                <button className="retry-btn" onClick={() => {
                  setShowTransactionDetails(false)
                  handleRetryPayment(selectedPayment.id)
                }}>
                  <RefreshCw size={16} />
                  Retry Payment
                </button>
              )}
              
              <button className="share-btn">
                <Share2 size={16} />
                Share Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Render Payment Links Modal
  const renderPaymentLinksModal = () => (
    <div className="payment-popup-overlay" onClick={() => setShowPaymentLinks(false)}>
      <div className="payment-links-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Payment Links</h3>
          <button onClick={() => setShowPaymentLinks(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="popup-content">
          <div className="create-link-section">
            <h4>Create New Payment Link</h4>
            <div className="link-form">
              <div className="form-group">
                <label>Amount (UGX)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  disabled={isLoading}
                  min="100"
                />
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Payment description"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <button 
                className="create-link-btn"
                onClick={handleCreatePaymentLink}
                disabled={isLoading || !paymentAmount}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="spinner" />
                    Creating...
                  </>
                ) : (
                  'Create Payment Link'
                )}
              </button>
            </div>
          </div>
          
          <div className="links-list">
            <h4>Active Payment Links</h4>
            {paymentLinks.length > 0 ? (
              paymentLinks.map((link, index) => (
                <div key={index} className="link-item">
                  <div className="link-info">
                    <div className="link-amount">UGX {link.amount?.toLocaleString()}</div>
                    <div className="link-description">{link.description}</div>
                    <div className="link-code">Code: {link.short_code}</div>
                    <div className="link-url">
                      <code>{link.link}</code>
                    </div>
                  </div>
                  <div className="link-actions">
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(link.link)
                        alert("Link copied to clipboard!")
                      }}
                    >
                      <Copy size={14} />
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Payment Request',
                            text: `Please pay UGX ${link.amount}`,
                            url: link.link,
                          })
                        }
                      }}
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-links">No payment links created yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Render Dashboard
  const renderDashboard = () => (
    <div className="rider-agent-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="dashboard-title">PAYMENT DASHBOARD</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="nav-btn"
              onClick={() => setShowPaymentLinks(true)}
              style={{ background: '#0033cc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}
            >
              <Share2 size={20} />
              Payment Links
            </button>
            <button 
              className="nav-btn primary"
              onClick={() => setShowPaymentPopup(true)}
              style={{ background: '#fef08a', color: 'black', border: '1px solid #fde047', padding: '10px 20px', borderRadius: '8px' }}
            >
              <DollarSign size={20} />
              Receive Payment
            </button>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {["dashboard", "analytics", "pending", "disputes", "history"].map((view) => (
          <button
            key={view}
            className={`tab-btn ${currentView === view ? "active" : ""}`}
            onClick={() => setCurrentView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <p className="stat-value">{stat.value}</p>
            <div style={{
              fontSize: '11px',
              color: stat.trend === 'up' ? '#2e7d32' : '#f59e0b'
            }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={() => setCurrentView("pending")}>
          Pending Payments
        </button>
        <button 
          className="action-btn highlight"
          onClick={() => setShowPaymentPopup(true)}
        >
          Receive Money
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => setCurrentView("disputes")}
        >
          File Dispute
        </button>
        <button 
          className="action-btn"
          onClick={() => setCurrentView("analytics")}
        >
          Analytics
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h3>Payment Methods</h3>
          </div>
          <div className="methods-list">
            {paymentMethodsData.map((method, index) => (
              <div key={index} className="method-item">
                <div className="method-header">
                  <div className="method-name">
                    {method.icon && <method.icon size={14} />}
                    <span>{method.name}</span>
                  </div>
                  <span className="method-percentage">{method.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
                <div className="method-stats">
                  {method.transactions} transactions
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button 
              className="view-all-btn"
              onClick={() => setCurrentView("history")}
            >
              View All
            </button>
          </div>
          <div className="transactions-list">
            {recentTransactionsData.map((transaction, index) => (
              <div 
                key={index} 
                className="transaction-item"
                onClick={() => handleViewDetails(transaction)}
              >
                <div className="transaction-info">
                  <div className="transaction-type">{transaction.type}</div>
                  <div className="transaction-meta">
                    <span className="method-badge">{transaction.method}</span>
                    <span className="transaction-time">{transaction.time}</span>
                  </div>
                </div>
                <div className="transaction-amount">
                  <div className="amount">UGX {transaction.amount}</div>
                  <span className={`status-badge ${transaction.status === 'Completed' ? 'valid' : 
                                   transaction.status === 'Pending' ? 'pending' : 'invalid'}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Render Analytics
  const renderAnalytics = () => (
    <div className="rider-agent-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="dashboard-title">PAYMENT ANALYTICS</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="nav-btn"
              onClick={() => setShowPaymentLinks(true)}
              style={{ background: '#0033cc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}
            >
              <Share2 size={20} />
              Payment Links
            </button>
            <button 
              className="nav-btn primary"
              onClick={() => setShowPaymentPopup(true)}
              style={{ background: '#fef08a', color: 'black', border: '1px solid #fde047', padding: '10px 20px', borderRadius: '8px' }}
            >
              <DollarSign size={20} />
              Receive Payment
            </button>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {["dashboard", "analytics", "pending", "disputes", "history"].map((view) => (
          <button
            key={view}
            className={`tab-btn ${currentView === view ? "active" : ""}`}
            onClick={() => setCurrentView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-navigation secondary">
        {["daily", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        {analyticsCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{card.label}</div>
            <p className="stat-value">{card.amount}</p>
            <div style={{
              fontSize: '11px',
              color: card.trend === 'up' ? '#2e7d32' : '#c62828',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {card.trend === 'up' ? <TrendingUpIcon size={12} /> : <TrendingDownIcon size={12} />} {card.change}
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-content">
        <div className="content-section">
          <div className="section-header">
            <h3>Payment Methods Usage</h3>
            <div className="time-period">{activeTab.toUpperCase()}</div>
          </div>
          <div className="methods-breakdown">
            {paymentMethodsData.slice(0, 4).map((method, index) => (
              <div key={index} className="method-breakdown-item">
                <div className="method-breakdown-header">
                  <span>{method.name}</span>
                  <span>{method.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
                <div className="method-breakdown-stats">
                  {method.transactions} transactions
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h3>Revenue Trend</h3>
          </div>
          <div className="revenue-chart">
            <div className="chart-placeholder">
              <BarChart size={48} />
              <div>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Revenue Chart</div>
              <div className="chart-summary">
                <div>Total: UGX {analyticsData[activeTab].cash + analyticsData[activeTab].mtn + analyticsData[activeTab].airtel + analyticsData[activeTab].qr}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render Pending Payments
  const renderPending = () => (
    <div className="rider-agent-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="dashboard-title">PENDING PAYMENTS</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="nav-btn"
              onClick={() => setShowPaymentLinks(true)}
              style={{ background: '#0033cc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}
            >
              <Share2 size={20} />
              Payment Links
            </button>
            <button 
              className="nav-btn primary"
              onClick={() => setShowPaymentPopup(true)}
              style={{ background: '#fef08a', color: 'black', border: '1px solid #fde047', padding: '10px 20px', borderRadius: '8px' }}
            >
              <DollarSign size={20} />
              Receive Payment
            </button>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {["dashboard", "analytics", "pending", "disputes", "history"].map((view) => (
          <button
            key={view}
            className={`tab-btn ${currentView === view ? "active" : ""}`}
            onClick={() => setCurrentView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      <div className="stats-grid compact">
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <p className="stat-value">{pendingPaymentsData.length}</p>
          <div className="stat-subtitle">payments</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Amount</div>
          <p className="stat-value">96,000</p>
          <div className="stat-subtitle">UGX</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Avg Time</div>
          <p className="stat-value">2h 25m</p>
          <div className="stat-subtitle">to complete</div>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          {["all", "pending", "processing"].map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h3>Pending Payments ({filteredTransactions.length})</h3>
        </div>
        
        <div className="payments-list">
          {filteredTransactions.map((payment, index) => (
            <div key={index} className="payment-item">
              <div className="payment-header">
                <div className="payment-type">{payment.type}</div>
                <span className={`status-badge ${payment.status === 'Pending' ? 'pending' : 
                                 payment.status === 'Verifying' ? 'pending' : 'pending'}`}>
                  {payment.status}
                </span>
              </div>
              
              <div className="payment-details">
                <div className="payment-method">
                  {payment.method} • Ref: {payment.ref}
                </div>
                <div className="payment-time">{payment.time}</div>
              </div>
              
              <div className="payment-footer">
                <div className="payment-amount">
                  UGX {payment.amount}
                </div>
                <div className="payment-actions">
                  <button 
                    className="action-btn small"
                    onClick={() => handleViewDetails(payment)}
                  >
                    Details
                  </button>
                  <button 
                    className="action-btn small highlight"
                    onClick={() => handleRetryPayment(payment.id)}
                    disabled={isLoading || isStatusPolling}
                  >
                    {(isLoading || isStatusPolling) ? "Processing..." : "Retry"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render Disputes
  const renderDisputes = () => (
    <div className="rider-agent-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="dashboard-title">DISPUTES</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="nav-btn"
              onClick={() => setShowPaymentLinks(true)}
              style={{ background: '#0033cc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}
            >
              <Share2 size={20} />
              Payment Links
            </button>
            <button 
              className="nav-btn primary"
              onClick={() => setShowPaymentPopup(true)}
              style={{ background: '#fef08a', color: 'black', border: '1px solid #fde047', padding: '10px 20px', borderRadius: '8px' }}
            >
              <DollarSign size={20} />
              Receive Payment
            </button>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {["dashboard", "analytics", "pending", "disputes", "history"].map((view) => (
          <button
            key={view}
            className={`tab-btn ${currentView === view ? "active" : ""}`}
            onClick={() => setCurrentView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-navigation secondary">
        {["file", "track"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${disputeTab === tab ? "active" : ""}`}
            onClick={() => setDisputeTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {disputeTab === "file" ? (
        <div className="dispute-form">
          <div className="form-group">
            <label>Select Transaction</label>
            <select
              className="form-select"
              value={selectedTransaction}
              onChange={(e) => setSelectedTransaction(e.target.value)}
            >
              <option value="">Select transaction</option>
              <option value="TXN-9000900">TXN-9000900 - UGX 67,000</option>
              <option value="TXN-9000901">TXN-9000901 - UGX 2,000</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Reason</label>
            <select
              className="form-select"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            >
              <option value="">Select reason</option>
              <option value="amount">Amount Incorrect</option>
              <option value="duplicate">Duplicate Charge</option>
              <option value="unauthorized">Unauthorized</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Evidence</label>
            <div className="upload-area">
              <Upload size={24} />
              <div>Upload Evidence</div>
              <div className="upload-hint">Max 10MB</div>
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn">Cancel</button>
            <button className="submit-btn">Submit Dispute</button>
          </div>
        </div>
      ) : (
        <div className="content-section">
          <div className="section-header">
            <h3>Track Disputes</h3>
          </div>
          
          <div className="disputes-list">
            {disputesData.map((dispute, index) => (
              <div key={index} className="dispute-item">
                <div className="dispute-header">
                  <div className="dispute-id">{dispute.id}</div>
                  <span className={`status-badge ${dispute.status === 'Resolved' ? 'valid' : 
                                   dispute.status === 'Under Review' ? 'pending' : 'invalid'}`}>
                    {dispute.status}
                  </span>
                </div>
                
                <div className="dispute-reason">{dispute.reason}</div>
                <div className="dispute-date">Filed: {dispute.filed}</div>
                
                {dispute.notes && (
                  <div className="dispute-notes">
                    {dispute.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Render History
  const renderHistory = () => (
    <div className="rider-agent-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="dashboard-title">PAYMENT HISTORY</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="nav-btn"
              onClick={() => setShowPaymentLinks(true)}
              style={{ background: '#0033cc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}
            >
              <Share2 size={20} />
              Payment Links
            </button>
            <button 
              className="nav-btn primary"
              onClick={() => setShowPaymentPopup(true)}
              style={{ background: '#fef08a', color: 'black', border: '1px solid #fde047', padding: '10px 20px', borderRadius: '8px' }}
            >
              <DollarSign size={20} />
              Receive Payment
            </button>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {["dashboard", "analytics", "pending", "disputes", "history"].map((view) => (
          <button
            key={view}
            className={`tab-btn ${currentView === view ? "active" : ""}`}
            onClick={() => setCurrentView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          {["all", "completed", "pending", "failed"].map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h3>Payment History ({filteredTransactions.length})</h3>
        </div>
        
        <div className="history-list">
          {filteredTransactions.map((payment, index) => (
            <div 
              key={index} 
              className="history-item"
              onClick={() => handleViewDetails(payment)}
            >
              <div className="history-info">
                <div className="history-type">{payment.description}</div>
                <div className="history-meta">
                  <span className="history-id">{payment.txnId}</span>
                  <span className="history-date">{payment.date}</span>
                </div>
              </div>
              
              <div className="history-amount">
                <div className="amount">UGX {payment.amount}</div>
                <div className="history-method">{payment.method}</div>
                <span className={`status-badge ${payment.status === 'Completed' ? 'valid' : 
                                 payment.status === 'Pending' ? 'pending' : 'invalid'}`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <div className="pagination-info">
            Showing {filteredTransactions.length} payments
          </div>
          <div className="pagination-controls">
            <button className="pagination-btn">
              <ChevronLeft size={16} />
              Prev
            </button>
            <button className="pagination-btn">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <style jsx>{`
        /* Base styles */
        .rider-agent-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-header {
          margin-bottom: 24px;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        /* Top Navigation - REMOVED as requested */
        /* .top-nav {
          background: #0033cc;
          padding: 12px 20px;
          display: flex;
          justify-content: flex-end;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        .nav-btn {
          padding: 10px 20px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .nav-btn.primary {
          background: #fef08a;
          color: black;
          border-color: #fde047;
        }

        .nav-btn.primary:hover {
          background: #fde047;
        } */

        /* Tab Navigation */
        .tab-navigation {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .tab-navigation.secondary {
          margin-bottom: 20px;
        }

        .tab-btn {
          padding: 8px 16px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          background: #e9ecef;
        }

        .tab-btn.active {
          background: #0033cc;
          color: white;
          border-color: #0033cc;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stats-grid.compact {
          grid-template-columns: repeat(3, 1fr);
        }

        .stat-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .stat-subtitle {
          font-size: 11px;
          color: #666;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 10px 20px;
          background: #f0f4ff;
          border: 1px solid #0033cc;
          border-radius: 8px;
          color: #0033cc;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 120px;
        }

        .action-btn:hover {
          background: #e3e9ff;
        }

        .action-btn.highlight {
          background: #fef08a;
          color: black;
          border-color: #fde047;
        }

        .action-btn.secondary {
          background: #f0f4ff;
          color: #0033cc;
        }

        .action-btn.small {
          padding: 6px 12px;
          font-size: 12px;
          min-width: auto;
        }

        /* Content Sections */
        .dashboard-content, .analytics-content {
          display: grid;
          gap: 24px;
        }

        .content-section {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .view-all-btn {
          font-size: 14px;
          color: #0033cc;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        /* Payment Methods */
        .methods-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .method-item {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .method-item:last-child {
          border-bottom: none;
        }

        .method-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .method-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .method-percentage {
          font-size: 14px;
          font-weight: 600;
          color: #0033cc;
        }

        .progress-bar {
          height: 4px;
          background: #f0f4ff;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-fill {
          height: 100%;
          background: #0033cc;
          border-radius: 2px;
        }

        .method-stats {
          font-size: 11px;
          color: #666;
          text-align: right;
        }

        /* Analytics Methods */
        .methods-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .method-breakdown-item {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .method-breakdown-item:last-child {
          border-bottom: none;
        }

        .method-breakdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .method-breakdown-header span {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .method-breakdown-stats {
          font-size: 11px;
          color: #666;
          text-align: right;
        }

        .time-period {
          font-size: 12px;
          color: #666;
          background: #f0f4ff;
          padding: 4px 8px;
          border-radius: 4px;
        }

        /* Revenue Chart */
        .revenue-chart {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
        }

        .chart-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #666;
        }

        .chart-summary {
          font-size: 14px;
          font-weight: 600;
          color: #0033cc;
          margin-top: 12px;
        }

        /* Transactions List */
        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .transaction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .transaction-item:hover {
          background: #e9ecef;
        }

        .transaction-info {
          flex: 1;
        }

        .transaction-type {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .transaction-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .method-badge {
          font-size: 11px;
          color: #666;
          background: #e0e0e0;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .transaction-time {
          font-size: 11px;
          color: #666;
        }

        .transaction-amount {
          text-align: right;
        }

        .amount {
          font-size: 16px;
          font-weight: 600;
          color: #0033cc;
          margin-bottom: 4px;
        }

        /* Status Badges */
        .status-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
        }

        .status-badge.valid {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.invalid {
          background: #f8d7da;
          color: #721c24;
        }

        /* Search & Filter */
        .search-filter-section {
          margin-bottom: 24px;
        }

        .search-box {
          position: relative;
          margin-bottom: 12px;
        }

        .search-box input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }

        .search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #0033cc;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .filter-tab {
          padding: 8px 16px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .filter-tab:hover {
          background: #e9ecef;
        }

        .filter-tab.active {
          background: #0033cc;
          color: white;
          border-color: #0033cc;
        }

        /* Payments List */
        .payments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .payment-item {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          transition: border-color 0.2s ease;
        }

        .payment-item:hover {
          border-color: #0033cc;
        }

        .payment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .payment-type {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .payment-details {
          margin-bottom: 12px;
        }

        .payment-method {
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }

        .payment-time {
          font-size: 11px;
          color: #999;
        }

        .payment-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .payment-amount {
          font-size: 18px;
          font-weight: 600;
          color: #0033cc;
        }

        .payment-actions {
          display: flex;
          gap: 8px;
        }

        /* History List */
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .history-item:hover {
          border-color: #0033cc;
          background: #f8f9fa;
        }

        .history-info {
          flex: 1;
        }

        .history-type {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .history-meta {
          display: flex;
          gap: 12px;
        }

        .history-id {
          font-size: 11px;
          color: #666;
        }

        .history-date {
          font-size: 11px;
          color: #999;
        }

        .history-amount {
          text-align: right;
        }

        .history-method {
          font-size: 11px;
          color: #666;
          margin: 2px 0 4px 0;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;
        }

        .pagination-info {
          font-size: 14px;
          color: #666;
        }

        .pagination-controls {
          display: flex;
          gap: 8px;
        }

        .pagination-btn {
          padding: 8px 16px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          color: #666;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover {
          background: #e9ecef;
        }

        /* Disputes */
        .dispute-form {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .upload-area {
          border: 2px dashed #0033cc;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          background: #f0f4ff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-area:hover {
          background: #e3e9ff;
        }

        .upload-area svg {
          color: #0033cc;
          margin-bottom: 8px;
        }

        .upload-hint {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .cancel-btn {
          flex: 1;
          padding: 12px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #e9ecef;
        }

        .submit-btn {
          flex: 1;
          padding: 12px;
          background: #0033cc;
          border: 1px solid #0033cc;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-btn:hover {
          background: #002299;
        }

        .disputes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dispute-item {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          transition: border-color 0.2s ease;
        }

        .dispute-item:hover {
          border-color: #0033cc;
        }

        .dispute-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .dispute-id {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .dispute-reason {
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }

        .dispute-date {
          font-size: 11px;
          color: #999;
          margin-bottom: 8px;
        }

        .dispute-notes {
          font-size: 12px;
          color: #666;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 3px solid #0033cc;
        }

        /* Payment Popup */
        .payment-popup-overlay {
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
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .payment-popup {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .transaction-details-popup {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .popup-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .popup-header button {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .popup-header button:hover {
          background: #f0f0f0;
        }

        .popup-content {
          padding: 24px;
        }

        /* Payment Form */
        .amount-input-wrapper {
          position: relative;
          margin-bottom: 24px;
        }

        .currency-prefix {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          font-weight: 500;
          color: #666;
        }

        .amount-input {
          width: 100%;
          padding: 16px 16px 16px 80px;
          font-size: 24px;
          font-weight: 600;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          text-align: right;
          transition: border-color 0.2s ease;
        }

        .amount-input:focus {
          outline: none;
          border-color: #0033cc;
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .method-btn {
          padding: 16px;
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .method-btn:hover {
          background: #e9ecef;
        }

        .method-btn.active {
          background: #0033cc;
          border-color: #0033cc;
          color: white;
        }

        .method-btn svg {
          width: 24px;
          height: 24px;
        }

        .method-btn span {
          font-size: 14px;
          font-weight: 500;
        }

        .input-with-icon {
          position: relative;
          margin-bottom: 16px;
        }

        .input-with-icon svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .input-with-icon input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: #0033cc;
        }

        .payment-summary {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .summary-row:last-child {
          margin-bottom: 0;
        }

        .summary-row span {
          font-size: 14px;
          color: #666;
        }

        .summary-row strong {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .form-hint {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .form-hint.required {
          color: #dc3545;
        }

        .alternative-actions {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .alternative-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          color: #0033cc;
          border: 1px solid #0033cc;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .alternative-btn:hover {
          background: #f0f4ff;
        }

        /* Modals */
        .qr-modal,
        .ussd-modal,
        .payment-links-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .qr-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .qr-image {
          width: 200px;
          height: 200px;
        }

        .qr-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #666;
        }

        .qr-instructions,
        .ussd-instructions {
          background: #f0f4ff;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .qr-instructions h4,
        .ussd-instructions h4 {
          margin: 0 0 12px 0;
          color: #0033cc;
        }

        .qr-instructions ol,
        .ussd-instructions ol {
          margin: 0;
          padding-left: 20px;
        }

        .qr-instructions li,
        .ussd-instructions li {
          margin-bottom: 8px;
          font-size: 14px;
          color: #333;
        }

        .ussd-prompt {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .ussd-code {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 12px;
          border-radius: 6px;
          border: 2px solid #0033cc;
          margin-bottom: 12px;
        }

        .ussd-code code {
          font-size: 18px;
          font-weight: 600;
          color: #0033cc;
          letter-spacing: 1px;
        }

        .payment-details {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .detail-item span {
          font-size: 14px;
          color: #666;
        }

        .detail-item strong {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .detail-item code {
          font-family: monospace;
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .primary-btn {
          flex: 1;
          padding: 16px;
          background: #0033cc;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s ease;
        }

        .primary-btn:hover:not(:disabled) {
          background: #002299;
        }

        .primary-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .secondary-btn {
          flex: 1;
          padding: 16px;
          background: #f8f9fa;
          color: #0033cc;
          border: 1px solid #0033cc;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .secondary-btn:hover {
          background: #e3e9ff;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .status-message {
          padding: 12px;
          border-radius: 8px;
          margin: 16px 0;
          font-size: 14px;
          text-align: center;
        }

        .status-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .status-message.info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        /* Payment Links */
        .create-link-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e0e0e0;
        }

        .create-link-section h4 {
          margin: 0 0 16px 0;
          color: #1a1a1a;
        }

        .link-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .link-form input {
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
        }

        .create-link-btn {
          padding: 12px;
          background: #0033cc;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s ease;
        }

        .create-link-btn:hover:not(:disabled) {
          background: #002299;
        }

        .create-link-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .links-list h4 {
          margin: 0 0 16px 0;
          color: #1a1a1a;
        }

        .link-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .link-info {
          flex: 1;
        }

        .link-amount {
          font-size: 18px;
          font-weight: 600;
          color: #0033cc;
          margin-bottom: 4px;
        }

        .link-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .link-code {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }

        .link-url code {
          font-family: monospace;
          font-size: 11px;
          color: #333;
          word-break: break-all;
        }

        .link-actions {
          display: flex;
          gap: 8px;
        }

        .no-links {
          text-align: center;
          padding: 40px;
          color: #666;
          background: #f8f9fa;
          border-radius: 8px;
        }

        /* Transaction Actions */
        .transaction-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .transaction-actions button {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .retry-btn {
          background: #fef08a;
          color: black;
          border: 1px solid #fde047;
        }

        .retry-btn:hover {
          background: #fde047;
        }

        .transaction-actions .share-btn {
          background: #f0f4ff;
          color: #0033cc;
          border: 1px solid #0033cc;
        }

        .transaction-actions .share-btn:hover {
          background: #e3e9ff;
        }

        /* Popup Actions */
        .popup-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .popup-actions .cancel-btn,
        .popup-actions .confirm-btn {
          flex: 1;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .popup-actions .confirm-btn {
          background: #0033cc;
          color: white;
          border: none;
        }

        .popup-actions .confirm-btn:hover:not(:disabled) {
          background: #002299;
        }

        .popup-actions .confirm-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .copy-btn {
          background: none;
          border: none;
          color: #0033cc;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .copy-btn:hover {
          background: #f0f4ff;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .rider-agent-container {
            padding: 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid.compact {
            grid-template-columns: repeat(3, 1fr);
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }

          .payment-methods-grid {
            grid-template-columns: 1fr;
          }

          .popup-actions,
          .action-buttons {
            flex-direction: column;
          }

          .transaction-actions {
            flex-direction: column;
          }

          .pagination {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .pagination-controls {
            justify-content: space-between;
          }

          .form-actions {
            flex-direction: column;
          }

          .qr-modal,
          .ussd-modal,
          .payment-links-modal {
            border-radius: 12px;
            margin: 16px;
          }

          .qr-image {
            width: 150px;
            height: 150px;
          }

          .ussd-code code {
            font-size: 16px;
          }

          .nav-actions {
            flex-direction: column;
            width: 100%;
          }

          .nav-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid.compact {
            grid-template-columns: repeat(2, 1fr);
          }

          .payment-popup,
          .transaction-details-popup {
            border-radius: 12px;
          }

          .popup-header {
            padding: 20px 20px 16px;
          }

          .popup-content {
            padding: 20px;
          }

          .amount-input {
            font-size: 20px;
            padding: 14px 14px 14px 70px;
          }

          .method-btn {
            padding: 12px;
          }

          .qr-image {
            width: 120px;
            height: 120px;
          }

          .ussd-code {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .ussd-code code {
            font-size: 14px;
          }

          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .link-item {
            flex-direction: column;
            gap: 12px;
          }

          .link-actions {
            align-self: flex-end;
          }

          .payment-footer {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .payment-actions {
            justify-content: space-between;
          }
        }

        @media (max-width: 360px) {
          .stats-grid.compact {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {showPaymentPopup && renderPaymentPopup()}
      {showQrModal && renderQrModal()}
      {showUssdModal && renderUssdModal()}
      {showTransactionDetails && renderTransactionDetails()}
      {showPaymentLinks && renderPaymentLinksModal()}

      {currentView === "dashboard" && renderDashboard()}
      {currentView === "analytics" && renderAnalytics()}
      {currentView === "pending" && renderPending()}
      {currentView === "disputes" && renderDisputes()}
      {currentView === "history" && renderHistory()}
    </>
  )
}