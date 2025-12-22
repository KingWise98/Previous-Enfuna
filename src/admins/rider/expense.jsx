"use client"

import { useState } from "react"
import "./expense.css"

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
    { name: "Packing", percentage: 2, color: "#00FF00" },
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
    <div className="expense-container">
      {/* Compact Header */}
      <header className="expense-header">
        <div className="expense-header-content">
          <div>
            <h1 className="expense-title">EXPENSE DASHBOARD</h1>
            <p className="expense-subtitle">Track and Manage expenses</p>
          </div>
          <div className="expense-user-profile">
            <span className="expense-user-name">Moses. K</span>
            <div className="expense-user-badge">MK</div>
          </div>
        </div>
      </header>

      {/* Compact Stats Grid - All cards in one line */}
      <div className="compact-stats-grid">
        <div className="compact-stat-card stat-blue">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Weekly</span>
            <span className="compact-stat-change positive">+2</span>
          </div>
          <div className="compact-stat-value">
            18,000<span className="compact-stat-currency">UGX</span>
          </div>
        </div>

        <div className="compact-stat-card stat-yellow">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Fuel</span>
            <span className="compact-stat-change negative">+8.5%</span>
          </div>
          <div className="compact-stat-value">
            75,000<span className="compact-stat-currency">UGX</span>
          </div>
          <div className="compact-stat-badge">Top</div>
        </div>

        <div className="compact-stat-card stat-green">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Monthly</span>
            <span className="compact-stat-change negative">+20.5%</span>
          </div>
          <div className="compact-stat-value">
            430,000<span className="compact-stat-currency">UGX</span>
          </div>
        </div>

        <div className="compact-stat-card stat-purple">
          <div className="compact-stat-header">
            <span className="compact-stat-label">Today</span>
            <span className="compact-stat-change positive">+12.5%</span>
          </div>
          <div className="compact-stat-value">
            125,000<span className="compact-stat-currency">UGX</span>
          </div>
        </div>
      </div>

      {/* Compact Action Buttons */}
      <div className="compact-action-bar">
        <button className="compact-btn btn-primary" onClick={handleAddExpense}>
          Add Expense
        </button>
        <button className="compact-btn btn-secondary">Scan Receipt</button>
        <button className="compact-btn btn-secondary">Export</button>
      </div>

      {/* Compact Content Grid */}
      <div className="compact-content-grid">
        {/* Compact Table Section */}
        <div className="compact-table-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Recent Expenses</h2>
            <div className="compact-filters">
              <input
                type="text"
                placeholder="Search..."
                className="compact-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="compact-filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option>All</option>
                {expenseCategories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="compact-table-wrapper">
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenseData.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div className="compact-date-cell">
                        <div className="compact-date">{expense.date}</div>
                        <div className="compact-time">{expense.time}</div>
                      </div>
                    </td>
                    <td>
                      <span className="compact-category-badge">{expense.category}</span>
                    </td>
                    <td className="compact-amount">UGX {expense.amount}</td>
                    <td>
                      <span className={`compact-receipt ${expense.receipt === "Yes" ? "yes" : "no"}`}>
                        {expense.receipt}
                      </span>
                    </td>
                    <td>
                      <div className="compact-action-buttons">
                        <button className="compact-action-btn view">View</button>
                        <button className="compact-action-btn delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compact Breakdown Section */}
        <div className="compact-breakdown-section">
          <div className="compact-section-header">
            <h2 className="compact-section-title">Breakdown</h2>
            <p className="compact-section-subtitle">Today's usage</p>
          </div>

          <div className="compact-breakdown-list">
            {expenseBreakdown.map((item, index) => (
              <div key={index} className="compact-breakdown-item">
                <div className="compact-breakdown-info">
                  <span className="compact-breakdown-name">{item.name}</span>
                  <span className="compact-breakdown-percentage">{item.percentage}%</span>
                </div>
                <div className="compact-progress-bar">
                  <div
                    className="compact-progress-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compact Add Expense Modal */}
      {showAddExpense && (
        <div className="compact-modal-overlay">
          <div className="compact-modal">
            {/* Modal Header */}
            <div className="compact-modal-header">
              <h2>ADD EXPENSE</h2>
              <div className="compact-modal-steps">
                <span className="compact-step active">1</span>
                <span className="compact-step-divider"></span>
                <span className={`compact-step ${addExpenseStep >= 2 ? "active" : ""}`}>2</span>
                <span className="compact-step-divider"></span>
                <span className={`compact-step ${addExpenseStep >= 3 ? "active" : ""}`}>3</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="compact-modal-content">
              {/* Step 1 */}
              {addExpenseStep === 1 && (
                <div className="compact-step-content">
                  <div className="compact-form-group">
                    <label className="compact-form-label">Category</label>
                    <div className="compact-category-grid">
                      {expenseCategories.map((category) => (
                        <button
                          key={category}
                          className={`compact-category-btn ${
                            selectedCategory === category ? "selected" : ""
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="compact-form-row">
                    <div className="compact-form-group">
                      <label className="compact-form-label">Amount</label>
                      <input
                        type="text"
                        className="compact-form-input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="10,000"
                      />
                    </div>
                    <div className="compact-form-group">
                      <label className="compact-form-label">Date</label>
                      <input
                        type="text"
                        className="compact-form-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {addExpenseStep === 2 && (
                <div className="compact-step-content">
                  <div className="compact-form-group">
                    <label className="compact-form-label">Receipt</label>
                    <div className="compact-upload-area">
                      <input
                        type="file"
                        id="compact-receipt-upload"
                        className="compact-file-input"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="compact-receipt-upload" className="compact-upload-label">
                        <div className="compact-upload-icon">📤</div>
                        <div className="compact-upload-text">Upload</div>
                      </label>
                    </div>
                  </div>

                  <div className="compact-form-group">
                    <label className="compact-form-label">Details (Optional)</label>
                    <textarea
                      className="compact-form-textarea"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                    />
                  </div>

                  <div className="compact-form-row">
                    <div className="compact-form-group">
                      <label className="compact-form-label">Bike</label>
                      <input
                        type="text"
                        className="compact-form-input"
                        value={motorbikeDetails}
                        onChange={(e) => setMotorbikeDetails(e.target.value)}
                      />
                    </div>
                    <div className="compact-form-group">
                      <label className="compact-form-label">Payment</label>
                      <select
                        className="compact-form-input"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
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

              {/* Step 3 */}
              {addExpenseStep === 3 && (
                <div className="compact-step-content">
                  <div className="compact-review-card">
                    <div className="compact-review-row">
                      <div className="compact-review-group">
                        <span className="compact-review-label">Category</span>
                        <span className="compact-review-value">{selectedCategory || "Fuel"}</span>
                      </div>
                      <div className="compact-review-group">
                        <span className="compact-review-label">Amount</span>
                        <span className="compact-review-value">UGX {amount || "10,000"}</span>
                      </div>
                    </div>
                    <div className="compact-review-row">
                      <div className="compact-review-group">
                        <span className="compact-review-label">Payment</span>
                        <span className="compact-review-value">{paymentMethod}</span>
                      </div>
                      <div className="compact-review-group">
                        <span className="compact-review-label">Date</span>
                        <span className="compact-review-value">{date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="compact-modal-actions">
              {addExpenseStep < 3 ? (
                <>
                  <button className="compact-modal-btn btn-secondary" onClick={handleBack}>
                    Back
                  </button>
                  <button className="compact-modal-btn btn-primary" onClick={handleContinue}>
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <button className="compact-modal-btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="compact-modal-btn btn-primary" onClick={handleSaveExpense}>
                    Save
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