"use client"

import React, { useState, useEffect } from 'react';
import './statements.css';
import { 
  Download, FileText, FileSpreadsheet, FileBarChart, 
  Calendar, Filter, Plus, Edit, Trash2, CheckCircle,
  TrendingUp, Wallet, PieChart, BarChart3, ChevronRight,
  Eye, Search, CreditCard, DollarSign, TrendingDown, Check,
  AlertCircle, Clock, RefreshCw, Save, ChevronDown,
  Calculator, History, Database, ArrowUpRight, ArrowDownRight,
  Circle, CalendarDays, DollarSign as Dollar, Briefcase, 
  TrendingUp as TrendUp, TrendingDown as TrendDown,
  MoreVertical, Settings, Bell, LineChart, Users, Shield,
  FileCheck, Zap, Layers, Home, Car, ShoppingBag,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight as ChevronRightIcon,
  Upload, Share2, Cloud, X, Menu, ArrowLeft
} from 'lucide-react';

// Simplified Mock Data Service
const financialDataService = {
  getTrialBalance: () => ({
    date: 'Jan 31, 2025',
    accounts: [
      { id: 1, accountName: 'Service Revenue', subType: 'Operating Revenue', debit: 20000, credit: 0 },
      { id: 2, accountName: 'Cash', subType: 'Current Asset', debit: 0, credit: 50000 },
      { id: 3, accountName: 'Accounts Receivable', subType: 'Current Asset', debit: 15000, credit: 0 },
      { id: 4, accountName: 'Office Supplies', subType: 'Expense', debit: 5000, credit: 0 },
      { id: 5, accountName: 'Rent Expense', subType: 'Operating Expense', debit: 8000, credit: 0 },
      { id: 6, accountName: 'Accounts Payable', subType: 'Current Liability', debit: 0, credit: 12000 },
      { id: 7, accountName: 'Loan Payable', subType: 'Long Term Liability', debit: 0, credit: 25000 },
      { id: 8, accountName: 'Owner\'s Equity', subType: 'Equity', debit: 0, credit: 10000 }
    ],
    totals: { debit: 48000, credit: 97000 }
  }),

  getIncomeStatement: (period = 'quarterly') => {
    const data = {
      quarterly: {
        period: 'Q1 2025',
        revenue: 50000,
        operatingExpenses: 35000,
        otherIncome: 7000,
        grossProfit: 40000,
        netProfit: 22000,
        netIncome: 22000
      },
      yearly: {
        period: '2025',
        revenue: 185000,
        operatingExpenses: 120000,
        otherIncome: 15000,
        grossProfit: 150000,
        netProfit: 80000,
        netIncome: 80000
      }
    };
    return data[period];
  },

  getBalanceSheet: () => ({
    date: 'Jan 31, 2025',
    assets: {
      current: [
        { name: 'Cash', amount: 60000 },
        { name: 'Inventory', amount: 600000 },
        { name: 'Accounts Receivable', amount: 15000 }
      ],
      nonCurrent: [
        { name: 'Fixed Assets', amount: 50000 },
        { name: 'Equipment', amount: 75000 }
      ],
      totalCurrent: 675000,
      totalNonCurrent: 125000,
      total: 800000
    },
    liabilities: {
      current: [
        { name: 'Accounts Payable', amount: 5000 },
        { name: 'Withholding Tax Payable', amount: 4000 }
      ],
      longTerm: [
        { name: 'Loans Payable', amount: 4000 }
      ],
      totalCurrent: 9000,
      totalLongTerm: 4000,
      total: 13000
    },
    equity: {
      items: [
        { name: 'Owner\'s Equity', amount: 4000000 },
        { name: 'Retained Earnings', amount: 500000 }
      ],
      total: 4500000
    },
    totalLiabilitiesAndEquity: 4513000
  })
};

const Statements = () => {
  // State management
  const [activeView, setActiveView] = useState('trial-balance');
  const [incomePeriod, setIncomePeriod] = useState('quarterly');
  const [loading, setLoading] = useState(false);
  const [trialBalance, setTrialBalance] = useState(null);
  const [incomeStatement, setIncomeStatement] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');

  // Initialize data Kure at work
  useEffect(() => {
    loadAllData();
  }, [incomePeriod]);

  const loadAllData = () => {
    setLoading(true);
    setTimeout(() => {
      setTrialBalance(financialDataService.getTrialBalance());
      setIncomeStatement(financialDataService.getIncomeStatement(incomePeriod));
      setBalanceSheet(financialDataService.getBalanceSheet());
      setLoading(false);
    }, 300);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExport = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const data = {
      trialBalance,
      incomeStatement,
      balanceSheet,
      exportDate: new Date().toISOString()
    };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `financial-statements-${timestamp}.${exportFormat}`;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setLoading(false);
  };

  return (
    <div className="rider-agent-container">
      {/* Dashboard Header */}
      <div className="dashboard-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 24px'
      }}>
        <div>
          <h2 className="dashboard-title">Financial Statements</h2>
          <div style={{ fontSize: '12px', color: 'white', marginTop: '4px' }}>
            Comprehensive financial reports and analysis
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            className="share-input"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            style={{ 
              padding: '8px 12px',
              fontSize: '12px',
              minWidth: '100px'
            }}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
          <button 
            className="share-btn"
            onClick={handleExport}
            disabled={loading}
            style={{ 
              minWidth: '100px',
              background: '#0033cc',
              color: 'white'
            }}
          >
            <Download size={14} style={{ marginRight: '6px' }} />
            {loading ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* Centered Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '0 24px 16px',
        background: 'white'
      }}>
        <div className="tab-navigation" style={{ 
          maxWidth: '600px',
          width: '100%',
          justifyContent: 'center',
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '8px'
        }}>
          <button 
            className={`tab-btn ${activeView === 'trial-balance' ? 'active' : ''}`}
            onClick={() => setActiveView('trial-balance')}
            style={{ 
              flex: '1',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Calculator size={16} />
            Trial Balance
          </button>
          <button 
            className={`tab-btn ${activeView === 'income' ? 'active' : ''}`}
            onClick={() => setActiveView('income')}
            style={{ 
              flex: '1',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <TrendUp size={16} />
            Income Statement
          </button>
          <button 
            className={`tab-btn ${activeView === 'balance' ? 'active' : ''}`}
            onClick={() => setActiveView('balance')}
            style={{ 
              flex: '1',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <BarChart3 size={16} />
            Balance Sheet
          </button>
        </div>
      </div>

      <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in', padding: '0 24px' }}>
        
        {/* Trial Balance View */}
        {activeView === 'trial-balance' && trialBalance && (
          <div className="commission-overview" style={{ 
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div className="section-title" style={{ 
              padding: '20px 24px',
              background: '#f8f9fa',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    background: '#0033cc', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calculator size={18} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Trial Balance</h3>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      As of {trialBalance.date}
                    </div>
                  </div>
                </div>
                <button 
                  
                >
                  
                </button>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto', padding: '0' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                fontSize: '13px',
                minWidth: '700px'
              }}>
                <thead>
                  <tr style={{ 
                    background: '#f5f5f5', 
                    borderBottom: '2px solid #e0e0e0',
                    position: 'sticky',
                    top: 0
                  }}>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '16px 20px', 
                      fontWeight: '600',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#666'
                    }}>
                      Account Name
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '16px 20px', 
                      fontWeight: '600',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#666'
                    }}>
                      Sub Type
                    </th>
                    <th style={{ 
                      textAlign: 'right', 
                      padding: '16px 20px', 
                      fontWeight: '600',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#666'
                    }}>
                      Debit (UGX)
                    </th>
                    <th style={{ 
                      textAlign: 'right', 
                      padding: '16px 20px', 
                      fontWeight: '600',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#666'
                    }}>
                      Credit (UGX)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalance.accounts.map((account, index) => (
                    <tr 
                      key={account.id}
                      style={{ 
                        borderBottom: '1px solid #f0f0f0',
                        backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                        '&:hover': { background: '#f9f9f9' }
                      }}
                    >
                      <td style={{ 
                        padding: '14px 20px',
                        fontWeight: '500'
                      }}>
                        {account.accountName}
                      </td>
                      <td style={{ 
                        padding: '14px 20px', 
                        color: '#666',
                        fontSize: '12px'
                      }}>
                        {account.subType}
                      </td>
                      <td style={{ 
                        padding: '14px 20px', 
                        textAlign: 'right', 
                        fontWeight: account.debit > 0 ? '600' : '400',
                        fontFamily: 'monospace',
                        fontSize: '13px'
                      }}>
                        {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                      </td>
                      <td style={{ 
                        padding: '14px 20px', 
                        textAlign: 'right', 
                        fontWeight: account.credit > 0 ? '600' : '400',
                        fontFamily: 'monospace',
                        fontSize: '13px'
                      }}>
                        {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ 
                    background: '#f8f9fa', 
                    borderTop: '2px solid #e0e0e0' 
                  }}>
                    <td colSpan="2" style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Total
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right', 
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      color: '#0033cc'
                    }}>
                      {formatCurrency(trialBalance.totals.debit)}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right', 
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      color: '#0033cc'
                    }}>
                      {formatCurrency(trialBalance.totals.credit)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style={{ 
              padding: '16px 20px',
              background: '#f0f9ff',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} color="#06D6A0" />
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {trialBalance.totals.debit === trialBalance.totals.credit ? 
                    '✓ Trial Balance is balanced' : 
                    '⚠ Trial Balance needs adjustment'}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#999' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {/* Income Statement View */}
        {activeView === 'income' && incomeStatement && (
          <div className="commission-overview" style={{ 
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div className="section-title" style={{ 
              padding: '20px 24px',
              background: '#f8f9fa',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    background: '#06D6A0', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendUp size={18} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Income Statement</h3>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      {incomeStatement.period}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className={`tab-btn ${incomePeriod === 'quarterly' ? 'active' : ''}`}
                    onClick={() => setIncomePeriod('quarterly')}
                    style={{ 
                      padding: '8px 16px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid',
                      background: incomePeriod === 'quarterly' ? '#0033cc' : 'transparent',
                      color: incomePeriod === 'quarterly' ? 'white' : '#0033cc',
                      cursor: 'pointer'
                    }}
                  >
                    Quarterly
                  </button>
                  <button 
                    className={`tab-btn ${incomePeriod === 'yearly' ? 'active' : ''}`}
                    onClick={() => setIncomePeriod('yearly')}
                    style={{ 
                      padding: '8px 16px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid',
                      background: incomePeriod === 'yearly' ? '#0033cc' : 'transparent',
                      color: incomePeriod === 'yearly' ? 'white' : '#0033cc',
                      cursor: 'pointer'
                    }}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ 
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                {/* Revenue Section */}
                <div style={{ 
                  padding: '20px 24px',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '16px' 
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      fontSize: '14px',
                      color: '#2e7d32',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#2e7d32', 
                        borderRadius: '50%' 
                      }} />
                      REVENUE
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '13px', color: '#666' }}>Total Revenue</div>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      color: '#2e7d32'
                    }}>
                      {formatCurrency(incomeStatement.revenue)}
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div style={{ 
                  padding: '20px 24px',
                  borderBottom: '1px solid #e0e0e0',
                  background: '#fffaf5'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '16px' 
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      fontSize: '14px',
                      color: '#c62828',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#c62828', 
                        borderRadius: '50%' 
                      }} />
                      EXPENSES
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '13px', color: '#666' }}>Operating Expenses</div>
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: '600',
                      fontFamily: 'monospace',
                      color: '#c62828'
                    }}>
                      {formatCurrency(incomeStatement.operatingExpenses)}
                    </div>
                  </div>
                </div>

                {/* Income Summary */}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '14px',
                      color: '#0033cc',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#0033cc', 
                        borderRadius: '50%' 
                      }} />
                      SUMMARY
                    </div>
                    
                    <div style={{ 
                      display: 'grid',
                      gap: '12px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0'
                      }}>
                        <div style={{ fontSize: '13px', color: '#666' }}>Other Income</div>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          fontFamily: 'monospace'
                        }}>
                          {formatCurrency(incomeStatement.otherIncome)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: '1px dashed #e0e0e0'
                      }}>
                        <div style={{ fontSize: '13px', color: '#666' }}>Gross Profit</div>
                        <div style={{ 
                          fontSize: '15px', 
                          fontWeight: '600',
                          fontFamily: 'monospace',
                          color: '#2e7d32'
                        }}>
                          {formatCurrency(incomeStatement.grossProfit)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>Net Profit</div>
                        <div style={{ 
                          fontSize: '18px', 
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          color: incomeStatement.netProfit >= 0 ? '#2e7d32' : '#c62828'
                        }}>
                          {formatCurrency(incomeStatement.netProfit)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>Net Income</div>
                        <div style={{ 
                          fontSize: '18px', 
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          color: incomeStatement.netIncome >= 0 ? '#2e7d32' : '#c62828'
                        }}>
                          {formatCurrency(incomeStatement.netIncome)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Profit Margin Indicator */}
              <div style={{ 
                marginTop: '20px',
                padding: '16px',
                background: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bbdefb',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <TrendUp size={16} color="#0033cc" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#0033cc' }}>
                    Profit Margin: {((incomeStatement.netIncome / incomeStatement.revenue) * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                    {incomeStatement.netIncome >= 0 ? 'Profitable' : 'Loss-making'} period
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Balance Sheet View */}
        {activeView === 'balance' && balanceSheet && (
          <div className="commission-overview" style={{ 
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div className="section-title" style={{ 
              padding: '20px 24px',
              background: '#f8f9fa',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    background: '#8b5cf6', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BarChart3 size={18} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Balance Sheet</h3>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      As of {balanceSheet.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '24px'
              }}>
                
                {/* Assets Column */}
                <div style={{ 
                  background: 'white', 
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #0033cc'
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      background: '#0033cc', 
                      borderRadius: '50%' 
                    }} />
                    <h4 style={{ 
                      margin: 0, 
                      color: '#0033cc', 
                      fontWeight: '700',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      ASSETS
                    </h4>
                  </div>
                  
                  {/* Current Assets */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#666', 
                      marginBottom: '12px',
                      paddingLeft: '8px'
                    }}>
                      Current Assets
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      {balanceSheet.assets.current.map((asset, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                          borderRadius: '4px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ fontSize: '13px', color: '#444' }}>{asset.name}</span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            fontFamily: 'monospace'
                          }}>
                            {formatCurrency(asset.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#e3f2fd',
                      borderRadius: '6px',
                      border: '1px solid #bbdefb'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Total Current Assets</span>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        color: '#0033cc'
                      }}>
                        {formatCurrency(balanceSheet.assets.totalCurrent)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Non-Current Assets */}
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#666', 
                      marginBottom: '12px',
                      paddingLeft: '8px'
                    }}>
                      Non-Current Assets
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      {balanceSheet.assets.nonCurrent.map((asset, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                          borderRadius: '4px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ fontSize: '13px', color: '#444' }}>{asset.name}</span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            fontFamily: 'monospace'
                          }}>
                            {formatCurrency(asset.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#e8f5e9',
                      borderRadius: '6px',
                      border: '1px solid #a5d6a7',
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Total Non-Current Assets</span>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        color: '#2e7d32'
                      }}>
                        {formatCurrency(balanceSheet.assets.totalNonCurrent)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Total Assets */}
                  <div style={{ 
                    marginTop: '20px',
                    padding: '16px',
                    background: '#0033cc',
                    borderRadius: '8px',
                    border: '1px solid #0022aa'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        TOTAL ASSETS
                      </span>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        color: 'white'
                      }}>
                        {formatCurrency(balanceSheet.assets.total)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Liabilities & Equity Column */}
                <div style={{ 
                  background: 'white', 
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #c62828'
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      background: '#c62828', 
                      borderRadius: '50%' 
                    }} />
                    <h4 style={{ 
                      margin: 0, 
                      color: '#c62828', 
                      fontWeight: '700',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      LIABILITIES & EQUITY
                    </h4>
                  </div>
                  
                  {/* Liabilities */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#666', 
                      marginBottom: '12px',
                      paddingLeft: '8px'
                    }}>
                      Liabilities
                    </div>
                    
                    {/* Current Liabilities */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#666', 
                        marginBottom: '8px',
                        paddingLeft: '12px'
                      }}>
                        Current Liabilities
                      </div>
                      {balanceSheet.liabilities.current.map((liability, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 16px',
                          background: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                          borderRadius: '4px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ fontSize: '13px', color: '#444' }}>{liability.name}</span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            fontFamily: 'monospace'
                          }}>
                            {formatCurrency(liability.amount)}
                          </span>
                        </div>
                      ))}
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        marginTop: '8px'
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>Total Current Liabilities</span>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          color: '#c62828'
                        }}>
                          {formatCurrency(balanceSheet.liabilities.totalCurrent)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Long Term Liabilities */}
                    <div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#666', 
                        marginBottom: '8px',
                        paddingLeft: '12px'
                      }}>
                        Long Term Liabilities
                      </div>
                      {balanceSheet.liabilities.longTerm.map((liability, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 16px',
                          background: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                          borderRadius: '4px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ fontSize: '13px', color: '#444' }}>{liability.name}</span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            fontFamily: 'monospace'
                          }}>
                            {formatCurrency(liability.amount)}
                          </span>
                        </div>
                      ))}
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#ffebee',
                        borderRadius: '6px',
                        border: '1px solid #ffcdd2',
                        marginTop: '12px'
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>Total Liabilities</span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          color: '#c62828'
                        }}>
                          {formatCurrency(balanceSheet.liabilities.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Equity */}
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#666', 
                      marginBottom: '12px',
                      paddingLeft: '8px'
                    }}>
                      Equity
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      {balanceSheet.equity.items.map((item, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                          borderRadius: '4px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ fontSize: '13px', color: '#444' }}>{item.name}</span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            fontFamily: 'monospace'
                          }}>
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#fff9c4',
                      borderRadius: '6px',
                      border: '1px solid #fde047'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Total Equity</span>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        color: '#f59e0b'
                      }}>
                        {formatCurrency(balanceSheet.equity.total)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Total Liabilities & Equity */}
                  <div style={{ 
                    marginTop: '20px',
                    padding: '16px',
                    background: '#c62828',
                    borderRadius: '8px',
                    border: '1px solid #aa2222'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        TOTAL LIABILITIES & EQUITY
                      </span>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        color: 'white'
                      }}>
                        {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Balance Verification */}
              <div style={{ 
                marginTop: '24px',
                padding: '16px',
                background: balanceSheet.assets.total === balanceSheet.totalLiabilitiesAndEquity ? '#e8f5e9' : '#ffebee',
                borderRadius: '8px',
                border: `1px solid ${balanceSheet.assets.total === balanceSheet.totalLiabilitiesAndEquity ? '#a5d6a7' : '#ffcdd2'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {balanceSheet.assets.total === balanceSheet.totalLiabilitiesAndEquity ? (
                    <CheckCircle size={20} color="#2e7d32" />
                  ) : (
                    <AlertCircle size={20} color="#c62828" />
                  )}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>
                      {balanceSheet.assets.total === balanceSheet.totalLiabilitiesAndEquity ? 
                        '✓ Balance Sheet is balanced' : 
                        '⚠ Balance Sheet needs adjustment'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                      Assets: {formatCurrency(balanceSheet.assets.total)} = Liabilities & Equity: {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: balanceSheet.assets.total === balanceSheet.totalLiabilitiesAndEquity ? '#2e7d32' : '#c62828'
                }}>
                  {balanceSheet.assets.total === balanceSheet.totalLiabilitiesAndEquity ? 'Balanced' : 'Imbalanced'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div style={{ 
        padding: '16px 24px',
        marginTop: '20px',
        background: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '16px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Total Assets</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0033cc' }}>
              {balanceSheet && formatCurrency(balanceSheet.assets.total)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Net Income</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#2e7d32' }}>
              {incomeStatement && formatCurrency(incomeStatement.netIncome)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Total Equity</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b' }}>
              {balanceSheet && formatCurrency(balanceSheet.equity.total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statements;