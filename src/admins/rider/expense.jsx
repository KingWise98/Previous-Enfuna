"use client"

import { useState } from "react"
import "./expense.css"

export default function ExpenseManagement() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [addExpenseStep, setAddExpenseStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All Categories")
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
    { name: "Packing", percentage: 2, color: "#00FF00" },
    { name: "Repairs", percentage: 50, color: "#FFFF00" },
    { name: "Airtime", percentage: 12, color: "#8B4513" },
    { name: "Meals", percentage: 32, color: "#808000" },
  ]

  const expenseData = [
    {
      id: 1,
      date: "2025-12-05",
      time: "17:46 AM",
      category: "Fuel",
      description: "Petrol refill at shell",
      amount: "UGX 10,000",
      receipt: "Yes",
    },
    {
      id: 2,
      date: "2025-12-05",
      time: "08:20 AM",
      category: "Repairs",
      description: "Petrol refill at shell",
      amount: "UGX 20,000",
      receipt: "Yes",
    },
    {
      id: 3,
      date: "2025-12-05",
      time: "07:21 AM",
      category: "Airtime",
      description: "Petrol refill at shell",
      amount: "UGX 2,000",
      receipt: "No",
    },
    {
      id: 4,
      date: "2025-12-05",
      time: "12:21 AM",
      category: "Fuel",
      description: "Petrol refill at shell",
      amount: "UGX 10,000",
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
    <div className="expense-container">
      {/* Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">EXPENSE DASHBOARD</h1>
            <p className="expense-subtitle">Track and Manage your expenses Efficiently</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Moses. K</span>
            <div className="expense-user-badge">MK</div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="expense-stats-grid">
        <div className="expense-stat-card expense-stat-card-blue">
          <div className="expense-stat-header">
            <span className="expense-stat-label">Weekly Expenses</span>
            <span className="expense-stat-change expense-stat-positive">+2</span>
          </div>
          <div className="expense-stat-value">
            18,000 <span className="expense-stat-currency">UGX</span>
          </div>
        </div>

        <div className="expense-stat-card expense-stat-card-yellow">
          <div className="expense-stat-header">
            <span className="expense-stat-label">Fuel Expenses</span>
            <span className="expense-stat-change expense-stat-negative">+8.5%</span>
          </div>
          <div className="expense-stat-value">
            75,000 <span className="expense-stat-currency">UGX</span>
          </div>
          <div className="expense-stat-badge">Top Category</div>
        </div>

        <div className="expense-stat-card expense-stat-card-green">
          <div className="expense-stat-header">
            <span className="expense-stat-label">Monthly Expenses</span>
            <span className="expense-stat-change expense-stat-negative">+20.5%</span>
          </div>
          <div className="expense-stat-value">
            430,000 <span className="expense-stat-currency">UGX</span>
          </div>
          <div className="expense-stat-subtext">Overal Monthly Expenses</div>
        </div>
      </div>

      {/* Today's Expenses Banner */}
      <div className="expense-today-banner">
        <div className="expense-today-content">
          <span className="expense-today-label">
            Today's Expenses <span className="expense-dropdown-icon">▼</span>
          </span>
          <div className="expense-today-amount">
            <span className="expense-today-currency">UGX</span>
            <span className="expense-today-value">125,000</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="expense-quick-actions">
        <h2 className="expense-section-title">Quick Actions</h2>
        <div className="expense-action-buttons">
          <button className="expense-action-btn expense-action-btn-primary" onClick={handleAddExpense}>
            Add New Expense
          </button>
          <button className="expense-action-btn expense-action-btn-secondary">Scan Receipt</button>
          <button className="expense-action-btn expense-action-btn-secondary">Export Report</button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="expense-content-grid">
        {/* Expense Activity */}
        <div className="expense-activity-section">
          <div className="expense-activity-header">
            <h2 className="expense-section-title">Expense Activity</h2>
            <button className="expense-refresh-btn">Refresh</button>
          </div>

          <div className="expense-filters">
            <input
              type="text"
              placeholder="Search Expenses"
              className="expense-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="expense-category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option>All Categories</option>
              {expenseCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="expense-action-bar">
            <button className="expense-export-btn">
              <span className="expense-icon">⬇</span> Export
            </button>
            <button className="expense-share-btn">
              <span className="expense-icon">⎋</span> Share
            </button>
          </div>

          {/* Table */}
          <div className="expense-table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenseData.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div className="expense-date-cell">
                        <div>{expense.date}</div>
                        <div className="expense-time">{expense.time}</div>
                      </div>
                    </td>
                    <td>
                      <span className="expense-category-badge">{expense.category}</span>
                    </td>
                    <td className="expense-description">{expense.description}</td>
                    <td className="expense-amount">{expense.amount}</td>
                    <td>
                      <span
                        className={`expense-receipt-status ${
                          expense.receipt === "Yes" ? "expense-receipt-yes" : "expense-receipt-no"
                        }`}
                      >
                        {expense.receipt}
                      </span>
                    </td>
                    <td>
                      <div className="expense-action-cell">
                        <button className="expense-delete-btn">Delete</button>
                        <button className="expense-view-btn">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="expense-breakdown-section">
          <h2 className="expense-section-title">Expense BreakDown</h2>
          <p className="expense-breakdown-subtitle">Usage Breakdown Today</p>

          <div className="expense-breakdown-list">
            {expenseBreakdown.map((item, index) => (
              <div key={index} className="expense-breakdown-item">
                <div className="expense-breakdown-info">
                  <span className="expense-breakdown-name">{item.name}</span>
                  <span className="expense-breakdown-percentage">{item.percentage}%</span>
                </div>
                <div className="expense-breakdown-bar-wrapper">
                  <div
                    className="expense-breakdown-bar"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                  <div
                    className="expense-breakdown-bar-bg"
                    style={{
                      backgroundColor: `${item.color}33`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="expense-modal-overlay">
          <div className="expense-modal">
            {/* Modal Header */}
            <div className={`expense-modal-header ${addExpenseStep === 3 ? "expense-modal-header-olive" : ""}`}>
              <h2>ADD NEW EXPENSE</h2>
              {addExpenseStep === 3 && <span className="expense-modal-step-label">Review & Save</span>}
              {addExpenseStep === 2 && <span className="expense-modal-step-label">Details & Receipt</span>}
              {addExpenseStep === 1 && <span className="expense-modal-step-label">Catagory & Amount</span>}
            </div>

            {/* Progress Indicator */}
            <div className="expense-progress-steps">
              <div className={`expense-progress-step ${addExpenseStep >= 1 ? "expense-progress-active" : ""}`}>
                <div className="expense-progress-circle">1</div>
                <span>Catagory & Amount</span>
              </div>
              <div className="expense-progress-line" />
              <div className={`expense-progress-step ${addExpenseStep >= 2 ? "expense-progress-active" : ""}`}>
                <div className="expense-progress-circle">2</div>
                <span>Details & Receipt</span>
              </div>
              <div className="expense-progress-line" />
              <div className={`expense-progress-step ${addExpenseStep >= 3 ? "expense-progress-active" : ""}`}>
                <div className="expense-progress-circle">3</div>
                <span>Review & Save</span>
              </div>
            </div>

            {/* Step Content */}
            <div className="expense-modal-content">
              {/* Step 1: Category & Amount */}
              {addExpenseStep === 1 && (
                <div className="expense-step-content">
                  <div className="expense-step-highlight">What Did You Spend On</div>

                  <div className="expense-form-section">
                    <h3 className="expense-form-label">Expense Catagory</h3>
                    <div className="expense-category-grid">
                      {expenseCategories.map((category) => (
                        <button
                          key={category}
                          className={`expense-category-btn ${
                            selectedCategory === category ? "expense-category-selected" : ""
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="expense-form-row">
                    <div className="expense-form-group">
                      <label className="expense-form-label">Enter Amount</label>
                      <input
                        type="text"
                        className="expense-form-input expense-amount-input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="10,000"
                      />
                    </div>
                    <div className="expense-form-group">
                      <label className="expense-form-label">Date</label>
                      <input
                        type="text"
                        className="expense-form-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Details & Receipt */}
              {addExpenseStep === 2 && (
                <div className="expense-step-content">
                  <div className="expense-step-highlight">Details & Report</div>

                  <div className="expense-form-section">
                    <h3 className="expense-form-label">Attach Receipt</h3>
                    <div className="expense-upload-area">
                      <input
                        type="file"
                        id="receipt-upload"
                        className="expense-file-input"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="receipt-upload" className="expense-upload-label">
                        <div className="expense-upload-icon">📤</div>
                        <div className="expense-upload-text">Drag and Drop or Click to Upload</div>
                        <div className="expense-upload-subtext">Max File Size 10MB</div>
                      </label>
                    </div>
                  </div>

                  <div className="expense-form-section">
                    <h3 className="expense-form-label">Add Details(Optional)</h3>
                    <textarea
                      className="expense-form-textarea"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="expense-form-row">
                    <div className="expense-form-group">
                      <label className="expense-form-label">Motorbike Details</label>
                      <input
                        type="text"
                        className="expense-form-input"
                        value={motorbikeDetails}
                        onChange={(e) => setMotorbikeDetails(e.target.value)}
                      />
                    </div>
                    <div className="expense-form-group">
                      <label className="expense-form-label">Payment Method</label>
                      <select
                        className="expense-form-input"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option>MTN MoMo</option>
                        <option>Airtel Money</option>
                        <option>Cash</option>
                        <option>Card Payment</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Save */}
              {addExpenseStep === 3 && (
                <div className="expense-step-content">
                  <div className="expense-step-highlight">Review Expense</div>

                  <div className="expense-review-card">
                    <div className="expense-review-row">
                      <div className="expense-review-group">
                        <label className="expense-review-label">Catagory</label>
                        <div className="expense-review-value">{selectedCategory || "Fuel"}</div>
                      </div>
                      <div className="expense-review-group">
                        <label className="expense-review-label">Amount</label>
                        <div className="expense-review-value">UGX {amount || "10,000"}</div>
                      </div>
                    </div>

                    <div className="expense-review-row">
                      <div className="expense-review-group">
                        <label className="expense-review-label">Description</label>
                        <div className="expense-review-value">{description || "No Description Provided"}</div>
                      </div>
                      <div className="expense-review-group">
                        <label className="expense-review-label">Payment Method</label>
                        <div className="expense-review-value">{paymentMethod}</div>
                      </div>
                    </div>

                    <div className="expense-review-row">
                      <div className="expense-review-group expense-review-full">
                        <label className="expense-review-label">Date & Time</label>
                        <div className="expense-review-value">
                          {date} <span className="expense-review-time">10:30 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="expense-modal-actions">
              {addExpenseStep < 3 ? (
                <>
                  <button className="expense-modal-btn expense-modal-btn-secondary" onClick={handleBack}>
                    Back
                  </button>
                  <button className="expense-modal-btn expense-modal-btn-primary" onClick={handleContinue}>
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <button className="expense-modal-btn expense-modal-btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="expense-modal-btn expense-modal-btn-primary" onClick={handleSaveExpense}>
                    Save Expense
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
