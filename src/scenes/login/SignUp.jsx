"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Auth.module.css"

function Auth({ onLogin }) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAccountType, setSelectedAccountType] = useState("")

  const [formValues, setFormValues] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
    accountType: "",
    usernameOrEmail: "",
    loginPassword: "",
  })

  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const handleAccountTypeSelect = (type) => {
    setSelectedAccountType(type)
    setFormValues({ ...formValues, accountType: type })
    setCurrentStep(3)
  }

  const handleCreateAccount = (e) => {
    e.preventDefault()
    const errors = {}
    if (!formValues.fullName) {
      errors.fullName = "Full name is required"
    }
    if (!formValues.phoneNumber) {
      errors.phoneNumber = "Phone number is required"
    }
    if (Object.keys(errors).length === 0) {
      setCurrentStep(4) // Go to password creation
    } else {
      setFormErrors(errors)
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    if (!formValues.password) {
      errors.password = "Password is required"
    } else if (formValues.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    if (!formValues.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = "Passwords do not match"
    }
    if (Object.keys(errors).length === 0) {
      setCurrentStep(5) // Go to OTP verification
    } else {
      setFormErrors(errors)
    }
  }

  const handleVerifyCode = (e) => {
    e.preventDefault()
    const errors = {}
    if (!formValues.otp) {
      errors.otp = "OTP code is required"
    } else if (formValues.otp.length !== 6) {
      errors.otp = "OTP must be 6 digits"
    }
    if (Object.keys(errors).length === 0) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setCurrentStep(6) // Go to welcome screen
      }, 1000)
    } else {
      setFormErrors(errors)
    }
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    if (!formValues.usernameOrEmail) {
      errors.usernameOrEmail = "Username or email is required"
    }
    if (!formValues.loginPassword) {
      errors.loginPassword = "Password is required"
    }
    if (Object.keys(errors).length === 0) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        let userRole = "normal"
        const { usernameOrEmail, loginPassword } = formValues
        if (usernameOrEmail.toLowerCase().includes("rider") && loginPassword === "password") {
          userRole = "rider"
        } else if (usernameOrEmail.toLowerCase().includes("driver") && loginPassword === "password") {
          userRole = "driver"
        } else if (usernameOrEmail.toLowerCase().includes("vendor") && loginPassword === "password") {
          userRole = "vendor"
        } else if (usernameOrEmail.toLowerCase().includes("business") && loginPassword === "password") {
          userRole = "admin"
        } else if (usernameOrEmail.toLowerCase().includes("super") && loginPassword === "password") {
          userRole = "super"
        } else {
          userRole = "rider"
        }
        onLogin(userRole)
      }, 1000)
    } else {
      setFormErrors(errors)
    }
  }

  const handleProceedToDashboard = () => {
    let userRole = "normal"
    switch (selectedAccountType) {
      case "rider":
        userRole = "rider"
        break
      case "driver":
        userRole = "driver"
        break
      case "vendor":
        userRole = "vendor"
        break
      case "business":
        userRole = "admin"

        break
        case "super":
        userRole = "super"
      default:
        userRole = "normal"
    }
    onLogin(userRole)
  }

  const getAccountTypeBackground = (type) => {
    switch (type) {
      case "rider":
      case "business":
        return "#FEF999"
      case "driver":
      case "vendor":
        return "#0125DC"
      default:
        return "#f5f5f5"
    }
  }

  const renderAccountTypeSelection = () => (
    <div className={styles.authCard}>
      <h1 className={styles.authTitle}>Choose Account Type</h1>

      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoMedium} />
      </div>

      <p className={styles.sectionSubtitle}>Select an Account to Proceed</p>

      <div className={styles.accountTypeGridContainer}>
        <div className={styles.accountTypeGrid}>
          {["rider", "driver", "vendor", "business"].map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.accountTypeButton} ${selectedAccountType === type ? styles.selected : ""}`}
              onClick={() => handleAccountTypeSelect(type)}
            >
              <div
                className={styles.accountTypeIconContainer}
                style={{ backgroundColor: getAccountTypeBackground(type) }}
              >
                <img
                  src={`/${type}.svg`}
                  alt={type}
                  className={styles.accountTypeIcon}
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "block"
                  }}
                />
                <div className={styles.fallbackIcon} style={{ display: "none" }}>
                  {type.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className={styles.accountTypeLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </button>
          ))}
        </div>

        <div className={styles.horizontalDivider}></div>
        <div className={styles.verticalDivider}></div>
      </div>

      <div className={styles.authLinks}>
        <p>
          Already have an account already?{" "}
          <button type="button" className={styles.linkButton} onClick={() => setCurrentStep(1)}>
            Login
          </button>
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(1)}>
          Back
        </button>
        <button type="button" className={styles.primaryButton} onClick={() => setCurrentStep(1)}>
          Cancel
        </button>
      </div>
    </div>
  )

  const renderLoginForm = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <h1 className={styles.authTitle}>Login to Enfuna</h1>
      <form onSubmit={handleLoginSubmit} className={styles.authForm}>
        <div className={`${styles.formGroup} ${formErrors.usernameOrEmail ? styles.error : ""}`}>
          <label htmlFor="usernameOrEmail" className={styles.inputLabel}>
            Username or Email:
          </label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            placeholder="Enter your username or email"
            value={formValues.usernameOrEmail}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.usernameOrEmail && <p className={styles.errorText}>{formErrors.usernameOrEmail}</p>}
        </div>
        <div className={`${styles.formGroup} ${formErrors.loginPassword ? styles.error : ""}`}>
          <label htmlFor="loginPassword" className={styles.inputLabel}>
            Password:
          </label>
          <input
            type="password"
            id="loginPassword"
            name="loginPassword"
            placeholder="Enter your password"
            value={formValues.loginPassword}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.loginPassword && <p className={styles.errorText}>{formErrors.loginPassword}</p>}
        </div>
        <button type="submit" className={styles.primaryButton} disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <div className={styles.authLinks}>
        <p>
          Don't have an account?{" "}
          <button type="button" className={styles.linkButton} onClick={() => setCurrentStep(2)}>
            Sign Up
          </button>
        </p>
      </div>
      <div className={styles.devHint}>
        <p>
          <strong>Demo Credentials:</strong>
        </p>
        <p>Username: rider, driver, vendor, business, super</p>
        <p>Password: password</p>
      </div>
    </div>
  )

  const renderCreateAccount = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <h1 className={styles.authTitle}>Create Enfuna Account</h1>
      <form onSubmit={handleCreateAccount} className={styles.authForm}>
        <div className={`${styles.formGroup} ${formErrors.fullName ? styles.error : ""}`}>
          <label htmlFor="fullName" className={styles.inputLabel}>
            Full Names:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={formValues.fullName}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.fullName && <p className={styles.errorText}>{formErrors.fullName}</p>}
        </div>
        <div className={`${styles.formGroup} ${formErrors.phoneNumber ? styles.error : ""}`}>
          <label htmlFor="phoneNumber" className={styles.inputLabel}>
            Phone Number:
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={formValues.phoneNumber}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.phoneNumber && <p className={styles.errorText}>{formErrors.phoneNumber}</p>}
        </div>
        <button type="submit" className={styles.primaryButton}>
          Continue to Password
        </button>
      </form>
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(2)}>
          Back
        </button>
        <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(1)}>
          Cancel
        </button>
      </div>
    </div>
  )

  const renderPasswordCreation = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <h1 className={styles.authTitle}>Enter Password</h1>
      <form onSubmit={handlePasswordSubmit} className={styles.authForm}>
        <div className={`${styles.formGroup} ${formErrors.password ? styles.error : ""}`}>
          <label htmlFor="password" className={styles.inputLabel}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formValues.password}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.password && <p className={styles.errorText}>{formErrors.password}</p>}
        </div>
        <div className={`${styles.formGroup} ${formErrors.confirmPassword ? styles.error : ""}`}>
          <label htmlFor="confirmPassword" className={styles.inputLabel}>
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.confirmPassword && <p className={styles.errorText}>{formErrors.confirmPassword}</p>}
        </div>
        <button type="submit" className={styles.primaryButton}>
          Send OTP Code
        </button>
      </form>
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(3)}>
          Back
        </button>
        <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(1)}>
          Cancel
        </button>
      </div>
    </div>
  )

  const renderOTPVerification = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <h1 className={styles.authTitle}>Enter OTP Code</h1>
      <form onSubmit={handleVerifyCode} className={styles.authForm}>
        <div className={`${styles.formGroup} ${formErrors.otp ? styles.error : ""}`}>
          <input
            type="text"
            id="otp"
            name="otp"
            placeholder="Enter 6-digit code"
            value={formValues.otp}
            onChange={handleChange}
            className={styles.inputField}
            maxLength={6}
          />
          {formErrors.otp && <p className={styles.errorText}>{formErrors.otp}</p>}
        </div>
        <button type="submit" className={styles.primaryButton} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
      </form>
      <div className={styles.authLinks}>
        <p>
          Didn't Receive Code?{" "}
          <button type="button" className={styles.linkButton}>
            Resend Code
          </button>
        </p>
      </div>
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(4)}>
          Back
        </button>
      </div>
    </div>
  )

  const renderWelcomeScreen = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>Hi {formValues.fullName || "User"}, You're in!</h1>
        <p className={styles.welcomeMessage}>Welcome to your {selectedAccountType} dashboard</p>
        <button type="button" className={styles.primaryButton} onClick={handleProceedToDashboard}>
          Proceed to Dashboard
        </button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderLoginForm()
      case 2:
        return renderAccountTypeSelection()
      case 3:
        return renderCreateAccount()
      case 4:
        return renderPasswordCreation()
      case 5:
        return renderOTPVerification()
      case 6:
        return renderWelcomeScreen()
      default:
        return renderLoginForm()
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authLayout}>
        <div className={styles.authFormContainer}>{renderCurrentStep()}</div>
      </div>
    </div>
  )
}

export default Auth