"use client"

import { useState } from "react"
import styles from "./Auth.module.css"

const API_BASE_URL = "http://127.0.0.1:8000/api"

function Auth({ onLogin }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAccountType, setSelectedAccountType] = useState("")
  const [apiError, setApiError] = useState("")
  const [otpToken, setOtpToken] = useState("")

  const [formValues, setFormValues] = useState({
    full_names: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    otp: "",
    account_type: "",
    username: "", // For login only
    login_password: "",
    // Email removed since it's not in the serializer
  })

  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
    setApiError("")
  }

  const handleAccountTypeSelect = (type) => {
    setSelectedAccountType(type)
    setFormValues({ ...formValues, account_type: type })
    setCurrentStep(3)
  }

  // Step 3: Collect basic info - FIXED: Removed email validation
  const handleCreateAccount = (e) => {
    e.preventDefault()
    const errors = {}
    
    if (!formValues.full_names) {
      errors.full_names = "Full name is required"
    }
    if (!formValues.phone_number) {
      errors.phone_number = "Phone number is required"
    } else {
      // Basic phone validation - at least 10 digits
      const phoneDigits = formValues.phone_number.replace(/\D/g, '')
      if (phoneDigits.length < 10) {
        errors.phone_number = "Please enter a valid phone number (at least 10 digits)"
      }
    }
    // Email validation removed since it's not in the serializer

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setCurrentStep(4)
  }

  // Step 4: Handle registration with password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!formValues.password) {
      errors.password = "Password is required"
    } else if (formValues.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    if (!formValues.confirm_password) {
      errors.confirm_password = "Please confirm your password"
    } else if (formValues.confirm_password !== formValues.password) {
      errors.confirm_password = "Passwords do not match"
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    setApiError("")

    try {
      // Format phone number - remove all non-numeric characters
      const formattedPhone = formValues.phone_number.replace(/\D/g, '')
      
      // Match the serializer fields exactly
      const userData = {
        phone_number: formattedPhone,
        full_names: formValues.full_names,
        password: formValues.password,
        confirm_password: formValues.confirm_password,
        is_staff: false, // Staff/super is not selectable in UI
        is_driver: selectedAccountType === "driver",
        is_rider: selectedAccountType === "rider",
        is_vendor: selectedAccountType === "vendor",
        is_bussiness: selectedAccountType === "business", // Note: 'is_bussiness' not 'is_business'
      }

      console.log("Sending registration data:", userData)

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (response.ok) {
        // Check what the API actually returns
        if (data.token || data.otp_token) {
          setOtpToken(data.token || data.otp_token)
        }
        setCurrentStep(5)
      } else {
        // Handle Django validation errors
        let errorMessage = "Registration failed"
        
        if (typeof data === 'object') {
          // If errors are in array format like {phone_number: ["error message"]}
          const errorFields = Object.keys(data)
          if (errorFields.length > 0) {
            const firstError = data[errorFields[0]]
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = `${errorFields[0]}: ${firstError[0]}`
            } else if (typeof firstError === 'string') {
              errorMessage = `${errorFields[0]}: ${firstError}`
            } else {
              errorMessage = JSON.stringify(data)
            }
          }
        } else if (typeof data === 'string') {
          errorMessage = data
        } else if (data.detail) {
          errorMessage = data.detail
        } else if (data.error) {
          errorMessage = data.error
        }
        
        setApiError(errorMessage)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setApiError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 5: Verify OTP
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!formValues.otp) {
      errors.otp = "OTP code is required"
    } else if (formValues.otp.length !== 6) {
      errors.otp = "OTP must be 6 digits"
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    setApiError("")

    try {
      // Format phone number for verification
      const formattedPhone = formValues.phone_number.replace(/\D/g, '')
      
      let verificationData = {
        phone_number: formattedPhone,
        otp: formValues.otp
      }

      // Add token if we have it
      if (otpToken) {
        verificationData.token = otpToken
      }

      console.log("Verifying OTP:", verificationData)

      const response = await fetch(`${API_BASE_URL}/auth/verify_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      })

      const data = await response.json()
      console.log("OTP verification response:", data)

      if (response.ok) {
        if (data.access_token || data.token) {
          localStorage.setItem("auth_token", data.access_token || data.token)
          console.log("Token saved to localStorage")
        }
        setCurrentStep(6)
      } else {
        setApiError(data.detail || data.error || "OTP verification failed")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      setApiError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 1: Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const errors = {}
    
    // For login, username is phone number (based on serializer)
    if (!formValues.username) {
      errors.username = "Phone number is required"
    }
    
    if (!formValues.login_password) {
      errors.login_password = "Password is required"
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsLoading(true)
    setApiError("")

    try {
      const loginIdentifier = formValues.username.replace(/\D/g, '') // Clean phone number
      
      console.log("Sending login request:", { username: loginIdentifier })

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginIdentifier,
          password: formValues.login_password
        }),
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (response.ok) {
        if (data.access_token || data.token) {
          const token = data.access_token || data.token
          localStorage.setItem("auth_token", token)
          console.log("Login token saved to localStorage")
        }
        
        // Determine role based on serializer fields
        let userRole = "rider" // default
        if (data.user) {
          const user = data.user
          if (user.is_staff) userRole = "super"
          else if (user.is_bussiness) userRole = "admin"
          else if (user.is_driver) userRole = "driver"
          else if (user.is_rider) userRole = "rider"
          else if (user.is_vendor) userRole = "vendor"
        } else if (data.account_type) {
          // Fallback to account_type if user object not available
          if (data.account_type === "super") userRole = "super"
          else if (data.account_type === "business") userRole = "admin"
          else if (data.account_type === "driver") userRole = "driver"
          else if (data.account_type === "rider") userRole = "rider"
          else if (data.account_type === "vendor") userRole = "vendor"
        }
        
        console.log("Login successful, role:", userRole)
        onLogin(userRole)
      } else {
        setApiError(data.detail || data.error || "Invalid phone number or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setApiError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProceedToDashboard = () => {
    let userRole = "rider"
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
      default:
        userRole = "rider"
    }
    console.log("Proceeding to dashboard with role:", userRole)
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

  const getAccountTypeImage = (type) => {
    // Use specific image names based on account type
    switch (type) {
      case "business":
        return "/business.png" 
      case "rider":
        return "/rider.png"  
      case "driver":
        return "/driver.png"  
      case "vendor":
        return "/vendor.png"  
      default:
        return `/${type}.svg`  
    }
  }

  const renderAccountTypeSelection = () => (
    <div className={styles.authCard}>
      <h1 className={styles.authTitle}>Choose Account Type</h1>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoMedium} />
      </div>
      <p className={styles.sectionSubtitle}>Select an Account to Proceed</p>
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
                src={getAccountTypeImage(type)}
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
            <span className={styles.accountTypeLabel}>
              {type === "business" ? "Business" : type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </button>
        ))}
      </div>
      <div className={styles.authLinks}>
        <p>
          Already have an account?{" "}
          <button type="button" className={styles.linkButton} onClick={() => setCurrentStep(1)}>
            Login
          </button>
        </p>
      </div>
      <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(1)}>
        Back
      </button>
    </div>
  )

  const renderLoginForm = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <h1 className={styles.authTitle}>Login to Enfuna</h1>
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      <form onSubmit={handleLoginSubmit} className={styles.authForm}>
        <div className={`${styles.formGroup} ${formErrors.username ? styles.error : ""}`}>
          <label htmlFor="username" className={styles.inputLabel}>
            Phone Number:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your phone number"
            value={formValues.username}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.username && <p className={styles.errorText}>{formErrors.username}</p>}
          <p className={styles.fieldHint}>Use your registered phone number</p>
        </div>
        <div className={`${styles.formGroup} ${formErrors.login_password ? styles.error : ""}`}>
          <label htmlFor="login_password" className={styles.inputLabel}>
            Password:
          </label>
          <input
            type="password"
            id="login_password"
            name="login_password"
            placeholder="Enter your password"
            value={formValues.login_password}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.login_password && <p className={styles.errorText}>{formErrors.login_password}</p>}
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
    </div>
  )

  const renderCreateAccount = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <h1 className={styles.authTitle}>Create Account</h1>
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      <form onSubmit={handleCreateAccount} className={styles.authForm}>
        <div className={`${styles.formGroup} ${formErrors.full_names ? styles.error : ""}`}>
          <label htmlFor="full_names" className={styles.inputLabel}>
            Full Names:
          </label>
          <input
            type="text"
            id="full_names"
            name="full_names"
            placeholder="Enter your full name"
            value={formValues.full_names}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.full_names && <p className={styles.errorText}>{formErrors.full_names}</p>}
        </div>
        <div className={`${styles.formGroup} ${formErrors.phone_number ? styles.error : ""}`}>
          <label htmlFor="phone_number" className={styles.inputLabel}>
            Phone Number:
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            placeholder="Enter your phone number (e.g., 0712345678)"
            value={formValues.phone_number}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.phone_number && <p className={styles.errorText}>{formErrors.phone_number}</p>}
          <p className={styles.fieldHint}>This will be your username for login</p>
        </div>
        <button type="submit" className={styles.primaryButton}>
          Continue
        </button>
      </form>
      <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(2)}>
        Back
      </button>
    </div>
  )

  const renderPasswordCreation = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <h1 className={styles.authTitle}>Create Password</h1>
      {apiError && <div className={styles.apiError}>{apiError}</div>}
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
        <div className={`${styles.formGroup} ${formErrors.confirm_password ? styles.error : ""}`}>
          <label htmlFor="confirm_password" className={styles.inputLabel}>
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            placeholder="Confirm your password"
            value={formValues.confirm_password}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.confirm_password && <p className={styles.errorText}>{formErrors.confirm_password}</p>}
        </div>
        <button type="submit" className={styles.primaryButton} disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(3)}>
        Back
      </button>
    </div>
  )

  const renderOTPVerification = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <h1 className={styles.authTitle}>Verify OTP</h1>
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      <form onSubmit={handleVerifyCode} className={styles.authForm}>
        <div className={`${styles.formGroup} ${formErrors.otp ? styles.error : ""}`}>
          <p className={styles.otpDescription}>
            Enter the 6-digit code sent to {formValues.phone_number}
          </p>
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
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <button type="button" className={styles.secondaryButton} onClick={() => setCurrentStep(4)}>
        Back
      </button>
    </div>
  )

  const renderWelcomeScreen = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogoLarge} />
      </div>
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>Welcome, {formValues.full_names}!</h1>
        <p className={styles.welcomeMessage}>
          Your {selectedAccountType === "business" ? "Business" : selectedAccountType} account is ready
        </p>
        <p className={styles.fieldHint}>
          Use your phone number ({formValues.phone_number}) to login
        </p>
        <button type="button" className={styles.primaryButton} onClick={handleProceedToDashboard}>
          Go to Dashboard
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