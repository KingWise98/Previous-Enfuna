import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Account Type, 2: Create Account, 3: OTP, 4: Password, 5: Welcome
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("");
  
  // Form values
  const [formValues, setFormValues] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
    accountType: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleAccountTypeSelect = (type) => {
    setSelectedAccountType(type);
    setFormValues({ ...formValues, accountType: type });
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!formValues.fullName) {
      errors.fullName = "Full name is required";
    }
    if (!formValues.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }
    
    if (Object.keys(errors).length === 0) {
      setCurrentStep(3); // Move to OTP step
    } else {
      setFormErrors(errors);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!formValues.otp) {
      errors.otp = "OTP code is required";
    } else if (formValues.otp.length !== 6) {
      errors.otp = "OTP must be 6 digits";
    }
    
    if (Object.keys(errors).length === 0) {
      setCurrentStep(4); // Move to password step
    } else {
      setFormErrors(errors);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!formValues.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(5); // Move to welcome step
      }, 1000);
    } else {
      setFormErrors(errors);
    }
  };

  const handleProceedToDashboard = () => {
    // Determine user role based on account type
    let userRole = "normal";
    switch (selectedAccountType) {
      case "rider":
        userRole = "rider";
        break;
      case "driver":
        userRole = "driver";
        break;
      case "vendor":
        userRole = "vendor";
        break;
      case "business":
        userRole = "admin";
        break;
      default:
        userRole = "normal";
    }
    
    onLogin(userRole);
  };

  // Step 1: Choose Account Type
  const renderAccountTypeSelection = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogo} />
        <p className={styles.tagline}>Get Digitized.Get Funded.</p>
      </div>

      <h1 className={styles.authTitle}>Choose Account Type</h1>
      <p className={styles.sectionSubtitle}>Select an Account to Proceed</p>

      <div className={styles.accountTypeGrid}>
        <button
          type="button"
          className={`${styles.accountTypeButton} ${selectedAccountType === "rider" ? styles.selected : ""}`}
          onClick={() => handleAccountTypeSelect("rider")}
        >
          <img src="./Enfuna UI illustrations-08.svg" alt="Rider" className={styles.accountTypeIcon} />
          <span className={styles.accountTypeLabel}>Rider</span>
        </button>

        <button
          type="button"
          className={`${styles.accountTypeButton} ${selectedAccountType === "driver" ? styles.selected : ""}`}
          onClick={() => handleAccountTypeSelect("driver")}
        >
          <img src="./svg3" alt="Driver" className={styles.accountTypeIcon} />
          <span className={styles.accountTypeLabel}>Driver</span>
        </button>

        <button
          type="button"
          className={`${styles.accountTypeButton} ${selectedAccountType === "vendor" ? styles.selected : ""}`}
          onClick={() => handleAccountTypeSelect("vendor")}
        >
          <img src="./svg4" alt="Vendor" className={styles.accountTypeIcon} />
          <span className={styles.accountTypeLabel}>Vendor</span>
        </button>

        <button
          type="button"
          className={`${styles.accountTypeButton} ${selectedAccountType === "business" ? styles.selected : ""}`}
          onClick={() => handleAccountTypeSelect("business")}
        >
          <img src="./svg5" alt="Business" className={styles.accountTypeIcon} />
          <span className={styles.accountTypeLabel}>Business</span>
        </button>
      </div>

      <div className={styles.authLinks}>
        <p>Already have an account already? <button type="button" className={styles.linkButton}>Login</button></p>
      </div>

      <div className={styles.buttonGroup}>
        <button type="button" className={styles.secondaryButton}>Back</button>
        <button 
          type="button" 
          className={styles.primaryButton}
          onClick={() => setCurrentStep(2)}
          disabled={!selectedAccountType}
        >
          Continue
        </button>
      </div>
    </div>
  );

  // Step 2: Create Account
  const renderCreateAccount = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogo} />
        <p className={styles.tagline}>Get Digitized.Get Funded.</p>
      </div>

      <h1 className={styles.authTitle}>Create Enfuna Account</h1>

      <form onSubmit={handleSendCode} className={styles.authForm}>
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
          {formErrors.fullName && (
            <p className={styles.errorText}>{formErrors.fullName}</p>
          )}
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
          {formErrors.phoneNumber && (
            <p className={styles.errorText}>{formErrors.phoneNumber}</p>
          )}
        </div>

        <button type="submit" className={styles.primaryButton}>
          Send Code
        </button>
      </form>

      <div className={styles.buttonGroup}>
        <button 
          type="button" 
          className={styles.secondaryButton}
          onClick={() => setCurrentStep(1)}
        >
          Back
        </button>
        <button type="button" className={styles.secondaryButton}>Cancel</button>
      </div>
    </div>
  );

  // Step 3: OTP Verification
  const renderOTPVerification = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogo} />
        <p className={styles.tagline}>Get Digitized. Get Funded.</p>
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
          {formErrors.otp && (
            <p className={styles.errorText}>{formErrors.otp}</p>
          )}
        </div>

        <button type="submit" className={styles.primaryButton}>
          Verify Code
        </button>
      </form>

      <div className={styles.authLinks}>
        <p>Didn't Receive Code? <button type="button" className={styles.linkButton}>Resend Code</button></p>
      </div>
    </div>
  );

  // Step 4: Password Creation
  const renderPasswordCreation = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogo} />
        <p className={styles.tagline}>Get Digitized. Get Funded.</p>
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
          {formErrors.password && (
            <p className={styles.errorText}>{formErrors.password}</p>
          )}
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
          {formErrors.confirmPassword && (
            <p className={styles.errorText}>{formErrors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" className={styles.primaryButton} disabled={isLoading}>
          {isLoading ? "Processing..." : "Continue"}
        </button>
      </form>

      <div className={styles.authLinks}>
        <p>Already have an account? <button type="button" className={styles.linkButton}>Login</button></p>
      </div>
    </div>
  );

  // Step 5: Welcome Screen
  const renderWelcomeScreen = () => (
    <div className={styles.authCard}>
      <div className={styles.logoSection}>
        <img src="/start.png" alt="Enfuna" className={styles.brandLogo} />
        <p className={styles.tagline}>Get Digitized.Get Funded.</p>
      </div>

      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>Hi {formValues.fullName || "User"}, You're in!</h1>
        <p className={styles.welcomeMessage}>Welcome to your {selectedAccountType} dashboard</p>
        
        <button 
          type="button" 
          className={styles.primaryButton}
          onClick={handleProceedToDashboard}
        >
          Proceed to Dashboard
        </button>
      </div>
    </div>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderAccountTypeSelection();
      case 2:
        return renderCreateAccount();
      case 3:
        return renderOTPVerification();
      case 4:
        return renderPasswordCreation();
      case 5:
        return renderWelcomeScreen();
      default:
        return renderAccountTypeSelection();
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authLayout}>
        <div className={styles.authFormContainer}>
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}

export default Auth;