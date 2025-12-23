"use client"

import { useState } from "react"

import React from "react"

export default function ExpenseManagement() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [addExpenseStep, setAddExpenseStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  // Form state
  const [selectedCategory, setSelectedCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("05-12-2025")
  const [description, setDescription] = useState("")
  const [motorbikeDetails, setMotorbikeDetails] = useState("Bajaj Boxer - UAJ 879G")
  const [paymentMethod, setPaymentMethod] = useState("MTN MoMo")
  const [receipt, setReceipt] = useState(null)

  const expenseCategories = ["Fuel", "Parking", "Repairs", "Meals", "Airtime", "Insurance", "Washing Bay", "Other"]

  const expenseBreakdown = [
    { name: "Fuel", percentage: 82, color: "#FF0000" },
    { name: "Parking", percentage: 2, color: "#00FF00" },
    { name: "Repairs", percentage: 50, color: "#FFFF00" },
    { name: "Airtime", percentage: 12, color: "#8B4513" },
    { name: "Meals", percentage: 32, color: "#808000" },
  ]

  const expenseData = [
    {
      id: 1,
      date: "2025-12-05",
      time: "17:46",
      category: "Fuel",
      description: "Petrol refill at shell",
      amount: "10,000",
      receipt: "Yes",
    },
    {
      id: 2,
      date: "2025-12-05",
      time: "08:20",
      category: "Repairs",
      description: "Petrol refill at shell",
      amount: "20,000",
      receipt: "Yes",
    },
    {
      id: 3,
      date: "2025-12-05",
      time: "07:21",
      category: "Airtime",
      description: "Petrol refill at shell",
      amount: "2,000",
      receipt: "No",
    },
    {
      id: 4,
      date: "2025-12-05",
      time: "12:21",
      category: "Fuel",
      description: "Petrol refill at shell",
      amount: "10,000",
      receipt: "Yes",
    },
  ]

  const handleAddExpense = () => {
    setShowAddExpense(true)
    setAddExpenseStep(1)
  }

  const handleContinue = () => {
    if (addExpenseStep < 3) {
      setAddExpenseStep(addExpenseStep + 1)
    }
  }

  const handleBack = () => {
    if (addExpenseStep > 1) {
      setAddExpenseStep(addExpenseStep - 1)
    }
  }

  const handleSaveExpense = () => {
    // Save expense logic here
    setShowAddExpense(false)
    setAddExpenseStep(1)
    // Reset form
    setSelectedCategory("")
    setAmount("")
    setDescription("")
  }

  const handleCancel = () => {
    setShowAddExpense(false)
    setAddExpenseStep(1)
    // Reset form
    setSelectedCategory("")
    setAmount("")
    setDescription("")
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      setReceipt(file)
    } else {
      alert("File size must be less than 10MB")
    }
  }

  return (
    <div className="rider-agent-container">
      <div className="rider-agent-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">EXPENSE DASHBOARD</h1>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button className="tab-btn active">Dashboard</button>
          <button className="tab-btn">All Expenses</button>
          <button className="tab-btn">Reports</button>
          <button className="tab-btn">Settings</button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Today</div>
            <h3 className="stat-value">
              125,000<span style={{ fontSize: '12px', marginLeft: '2px' }}>UGX</span>
            </h3>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              <span style={{ color: '#2e7d32' }}>+12.5%</span> from yesterday
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Weekly</div>
            <h3 className="stat-value">
              18,000<span style={{ fontSize: '12px', marginLeft: '2px' }}>UGX</span>
            </h3>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              <span style={{ color: '#2e7d32' }}>+2</span> expenses
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Monthly</div>
            <h3 className="stat-value">
              430,000<span style={{ fontSize: '12px', marginLeft: '2px' }}>UGX</span>
            </h3>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              <span style={{ color: '#c62828' }}>+20.5%</span> from last month
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Fuel</div>
            <h3 className="stat-value">
              75,000<span style={{ fontSize: '12px', marginLeft: '2px' }}>UGX</span>
            </h3>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              <span style={{ color: '#c62828' }}>+8.5%</span> Top category
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <button 
            className="activate-code-btn" 
            onClick={handleAddExpense}
          >
            Add Expense
          </button>
          <button className="withdraw-commission-btn">
            Scan Receipt
          </button>
          <button className="activate-code-btn">
            Export Report
          </button>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Recent Expenses Table */}
          <div className="commission-engine">
            <div className="section-title">Recent Expenses</div>
            
            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                className="promo-input"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1 }}
              />
              <select
                className="filter-btn"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ minWidth: '120px' }}
              >
                <option value="All">All Categories</option>
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Expenses Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f0f4ff' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Date & Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Category</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Receipt</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.map((expense) => (
                    <tr key={expense.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px', fontSize: '12px' }}>
                        <div>{expense.date}</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>{expense.time}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className="status-badge" style={{ 
                          background: '#f0f4ff',
                          color: '#002AFE',
                          border: '1px solid #dbeafe'
                        }}>
                          {expense.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#002AFE', fontWeight: '600' }}>
                        UGX {expense.amount}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-badge ${expense.receipt === "Yes" ? "valid" : "invalid"}`}>
                          {expense.receipt === "Yes" ? "✓ Receipt" : "No Receipt"}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="filter-btn" style={{ fontSize: '11px', padding: '4px 8px' }}>
                            View
                          </button>
                          <button className="filter-btn" style={{ 
                            fontSize: '11px', 
                            padding: '4px 8px',
                            background: '#ffebee',
                            color: '#c62828',
                            border: '1px solid #ffcdd2'
                          }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="commission-overview">
            <div className="section-title">Expense Breakdown</div>
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Today's Usage</div>
                {expenseBreakdown.map((item, index) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#002AFE' }}>{item.name}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#002AFE' }}>{item.percentage}%</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      background: '#f0f4ff',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{ 
                          width: `${item.percentage}%`,
                          height: '100%',
                          background: item.color,
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#002AFE', marginBottom: '12px' }}>
                  Quick Stats
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Total Expenses</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#002AFE' }}>5</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Avg. per Day</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#002AFE' }}>25,000 UGX</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666' }}>With Receipt</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#002AFE' }}>75%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Most Common</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#002AFE' }}>Fuel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '12px',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'slideUp 0.3s ease-out'
            }}>
              {/* Modal Header */}
              <div style={{ 
                background: '#002AFE', 
                padding: '16px 20px', 
                borderRadius: '8px 8px 0 0',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                ADD NEW EXPENSE
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: addExpenseStep >= step ? 'white' : 'rgba(255, 255, 255, 0.3)',
                        color: addExpenseStep >= step ? '#002AFE' : 'rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div style={{
                          width: '20px',
                          height: '2px',
                          background: addExpenseStep > step ? 'white' : 'rgba(255, 255, 255, 0.3)'
                        }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '20px' }}>
                {/* Step 1: Category & Amount */}
                {addExpenseStep === 1 && (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                        Select Category
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {expenseCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                              padding: '12px',
                              border: selectedCategory === category ? '2px solid #002AFE' : '1px solid #e0e0e0',
                              background: selectedCategory === category ? '#002AFE' : 'white',
                              color: selectedCategory === category ? 'white' : '#666',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                          Amount (UGX)
                        </label>
                        <input
                          type="text"
                          className="promo-input"
                          placeholder="10,000"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                          Date
                        </label>
                        <input
                          type="text"
                          className="promo-input"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Details & Receipt */}
                {addExpenseStep === 2 && (
                  <div>
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                      <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                        Upload Receipt (Optional)
                      </label>
                      <div style={{ 
                        border: '2px dashed #002AFE', 
                        borderRadius: '8px', 
                        padding: '24px',
                        background: '#f8f9fa',
                        cursor: 'pointer'
                      }} onClick={() => document.getElementById('receipt-upload').click()}>
                        <div style={{ fontSize: '24px', color: '#002AFE', marginBottom: '8px' }}>📤</div>
                        <div style={{ color: '#002AFE', fontSize: '12px', fontWeight: '500' }}>Click to upload</div>
                        <div style={{ color: '#666', fontSize: '10px', marginTop: '4px' }}>Max 10MB • JPG, PNG, PDF</div>
                      </div>
                      <input
                        type="file"
                        id="receipt-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept="image/*,.pdf"
                      />
                      {receipt && (
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '8px', 
                          background: '#e3f2fd',
                          borderRadius: '6px',
                          border: '1px solid #bbdefb'
                        }}>
                          <div style={{ fontSize: '11px', color: '#002AFE' }}>
                            Selected: {receipt.name}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                        Details (Optional)
                      </label>
                      <textarea
                        className="promo-input"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        style={{ width: '100%', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                          Motorbike
                        </label>
                        <input
                          type="text"
                          className="promo-input"
                          value={motorbikeDetails}
                          onChange={(e) => setMotorbikeDetails(e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: '#002AFE', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                          Payment Method
                        </label>
                        <select
                          className="promo-input"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{ width: '100%' }}
                        >
                          <option>MTN MoMo</option>
                          <option>Airtel Money</option>
                          <option>Cash</option>
                          <option>Card</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {addExpenseStep === 3 && (
                  <div>
                    <div style={{ 
                      background: '#f8f9fa', 
                      padding: '16px', 
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      marginBottom: '20px'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#002AFE', marginBottom: '12px' }}>
                        Expense Summary
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Category</div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE' }}>
                            {selectedCategory || "Fuel"}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Amount</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#002AFE' }}>
                            UGX {amount || "10,000"}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Payment Method</div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE' }}>
                            {paymentMethod}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Date</div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE' }}>
                            {date}
                          </div>
                        </div>
                      </div>

                      {motorbikeDetails && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '11px', color: '#666' }}>Motorbike</div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE' }}>
                            {motorbikeDetails}
                          </div>
                        </div>
                      )}

                      {description && (
                        <div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Description</div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#002AFE' }}>
                            {description}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div style={{ 
                padding: '16px 20px', 
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: '12px'
              }}>
                {addExpenseStep < 3 ? (
                  <>
                    <button 
                      className="activate-code-btn"
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid #002AFE', 
                        color: '#002AFE',
                        flex: 1
                      }}
                      onClick={handleBack}
                      disabled={addExpenseStep === 1}
                    >
                      Back
                    </button>
                    <button 
                      className="activate-code-btn"
                      onClick={handleContinue}
                      disabled={addExpenseStep === 1 && (!selectedCategory || !amount)}
                      style={{ flex: 1 }}
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="activate-code-btn"
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid #002AFE', 
                        color: '#002AFE',
                        flex: 1
                      }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button 
                      className="activate-code-btn"
                      onClick={handleSaveExpense}
                      style={{ flex: 1 }}
                    >
                      Save Expense
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.valid {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }

        .status-badge.invalid {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }

        /* Override MUI styles */
        .rider-agent-container .MuiButton-contained {
          background: #002AFE !important;
          color: white !important;
          border-radius: 8px !important;
          font-weight: 500 !important;
          text-transform: none !important;
        }

        .rider-agent-container .MuiButton-outlined {
          background: transparent !important;
          color: #002AFE !important;
          border: 1px solid #002AFE !important;
          border-radius: 8px !important;
          font-weight: 500 !important;
          text-transform: none !important;
        }

        .yellow-button {
          background: #FEF132 !important;
          color: black !important;
          border: 1px solid #fde047 !important;
        }
      `}</style>
    </div>
  )
}