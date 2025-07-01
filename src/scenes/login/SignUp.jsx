import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import companyLogo from "./logo.png";

function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  
  // Auth form values
  const initialAuthValues = {
    usernameOrEmail: "",
    password: "",
    confirmPassword: "",
  };
  
  // Business form values
  const initialBusinessValues = {
    businessName: "",
    natureOfBusiness: "",
    dateOfStart: "",
    businessAddress: "",
    taxIdentificationNumber: "",
    numberOfEmployees: "",
    annualRevenue: "",
    businessPhone: ""
  };

  const [formValues, setFormValues] = useState(initialAuthValues);
  const [businessFormValues, setBusinessFormValues] = useState(initialBusinessValues);
  const [formErrors, setFormErrors] = useState({});
  const [businessFormErrors, setBusinessFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // Super admin credentials (in a real app, this would be handled via secure backend authentication)
  const SUPER_ADMIN_CREDENTIALS = {
    username: "superadmin",
    email: "superadmin@funderspick.com",
    password: "FundersPick@2023"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (showBusinessForm) {
      setBusinessFormValues({ ...businessFormValues, [name]: value });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
    if (businessFormErrors[name]) {
      setBusinessFormErrors({ ...businessFormErrors, [name]: "" });
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const errors = validateAuth(formValues);
    setFormErrors(errors);
    setIsSubmit(true);
    
    if (Object.keys(errors).length === 0) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        const { usernameOrEmail, password } = formValues;
        
        // Check for super admin login
        if ((usernameOrEmail.toLowerCase() === SUPER_ADMIN_CREDENTIALS.username.toLowerCase() || 
             usernameOrEmail.toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()) && 
             password === SUPER_ADMIN_CREDENTIALS.password) {
          onLogin("superadmin");
          return;
        }
        
        // Regular admin login
        if (usernameOrEmail.toLowerCase() === "admin" && password === "funderspick") {
          onLogin("admin");
          return;
        }
        
        // Normal user login
        if (usernameOrEmail.toLowerCase() === "normal" && password === "normal") {
          onLogin("normal");
          return;
        }
        
        // If none matched
        setFormErrors({ auth: "Invalid username or password!" });
        
      } catch (error) {
        setFormErrors({ auth: "An error occurred. Please try again." });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    const errors = validateBusiness(businessFormValues);
    setBusinessFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        // Simulate API call to save business data
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Business data saved:", businessFormValues);
        
        // Complete registration and log user in as admin (since they registered a business)
        onLogin("admin");
      } catch (error) {
        setBusinessFormErrors({ submit: "Failed to save business data. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateAuth = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!values.usernameOrEmail) {
      errors.usernameOrEmail = "Email or Username is required!";
    } else if (!emailRegex.test(values.usernameOrEmail) && !usernameRegex.test(values.usernameOrEmail)) {
      errors.usernameOrEmail = "Enter a valid email or username!";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (values.password.length > 20) {
      errors.password = "Password cannot exceed 20 characters";
    }

    if (!isLogin) {
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    return errors;
  };

  const validateBusiness = (values) => {
    const errors = {};
    
    if (!values.businessName.trim()) {
      errors.businessName = "Business name is required";
    }
    
    if (!values.natureOfBusiness.trim()) {
      errors.natureOfBusiness = "Nature of business is required";
    }
    
    if (!values.dateOfStart) {
      errors.dateOfStart = "Start date is required";
    } else if (new Date(values.dateOfStart) > new Date()) {
      errors.dateOfStart = "Start date cannot be in the future";
    }
    
    if (!values.businessAddress.trim()) {
      errors.businessAddress = "Business address is required";
    }
    
    if (!values.taxIdentificationNumber.trim()) {
      errors.taxIdentificationNumber = "Tax ID is required";
    }
    
    if (!values.numberOfEmployees) {
      errors.numberOfEmployees = "Number of employees is required";
    } else if (isNaN(values.numberOfEmployees)) {
      errors.numberOfEmployees = "Must be a valid number";
    }
    
    if (!values.annualRevenue) {
      errors.annualRevenue = "Annual revenue is required";
    } else if (isNaN(values.annualRevenue)) {
      errors.annualRevenue = "Must be a valid number";
    }
    
    if (!values.businessPhone.trim()) {
      errors.businessPhone = "Business phone is required";
    }
    
    return errors;
  };

  const renderAuthForm = () => (
    <form onSubmit={handleAuthSubmit} className={styles.authForm}>
      <h1 className={styles.authTitle}>{isLogin ? "Welcome Back" : "Create Account"}</h1>
      <p className={styles.authSubtitle}>
        {isLogin ? "Sign in to your account" : "Get started with your account"}
      </p>

      <div className={`${styles.formGroup} ${formErrors.usernameOrEmail ? styles.error : ""}`}>
        <label htmlFor="usernameOrEmail" className={styles.inputLabel}>
          Email or Username
        </label>
        <input
          type="text"
          id="usernameOrEmail"
          name="usernameOrEmail"
          placeholder="Enter your email or username"
          value={formValues.usernameOrEmail}
          onChange={handleChange}
          className={styles.inputField}
        />
        {formErrors.usernameOrEmail && (
          <p className={styles.errorText}>{formErrors.usernameOrEmail}</p>
        )}
      </div>

      <div className={`${styles.formGroup} ${formErrors.password ? styles.error : ""}`}>
        <label htmlFor="password" className={styles.inputLabel}>
          Password
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

      {!isLogin && (
        <div className={`${styles.formGroup} ${formErrors.confirmPassword ? styles.error : ""}`}>
          <label htmlFor="confirmPassword" className={styles.inputLabel}>
            Confirm Password
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
      )}

      {isLogin && (
        <div className={styles.forgotPassword}>
          <button
            type="button"
            className={styles.forgotPasswordButton}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className={styles.spinner}></span>
        ) : isLogin ? (
          "Sign In"
        ) : (
          "Sign Up"
        )}
      </button>

      {formErrors.auth && (
        <div className={styles.authError}>
          <p>{formErrors.auth}</p>
        </div>
      )}

      <div className={styles.authToggle}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => {
            setIsLogin(!isLogin);
            setFormErrors({});
          }}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </div>

      {/* Super Admin Login Hint (remove in production) */}
      {process.env.NODE_ENV === "development" && isLogin && (
        <div className={styles.devHint}>
          <p>Super Admin: superadmin / FundersPick@2023</p>
          <p>Admin: admin / funderspick</p>
          <p>Normal User: normal / normal</p>
        </div>
      )}
    </form>
  );

  const renderBusinessForm = () => (
    <form onSubmit={handleBusinessSubmit} className={styles.authForm}>
      <h1 className={styles.authTitle}>Business Information</h1>
      <p className={styles.authSubtitle}>
        Please provide your business details to complete registration
      </p>

      <div className={`${styles.formGroup} ${businessFormErrors.businessName ? styles.error : ""}`}>
        <label htmlFor="businessName" className={styles.inputLabel}>
          Business Name *
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          placeholder="Your official business name"
          value={businessFormValues.businessName}
          onChange={handleChange}
          className={styles.inputField}
        />
        {businessFormErrors.businessName && (
          <p className={styles.errorText}>{businessFormErrors.businessName}</p>
        )}
      </div>

      <div className={`${styles.formGroup} ${businessFormErrors.natureOfBusiness ? styles.error : ""}`}>
        <label htmlFor="natureOfBusiness" className={styles.inputLabel}>
          Nature of Business *
        </label>
        <input
          type="text"
          id="natureOfBusiness"
          name="natureOfBusiness"
          placeholder="What does your business do?"
          value={businessFormValues.natureOfBusiness}
          onChange={handleChange}
          className={styles.inputField}
        />
        {businessFormErrors.natureOfBusiness && (
          <p className={styles.errorText}>{businessFormErrors.natureOfBusiness}</p>
        )}
      </div>

      <div className={`${styles.formGroup} ${businessFormErrors.dateOfStart ? styles.error : ""}`}>
        <label htmlFor="dateOfStart" className={styles.inputLabel}>
          Date of Business Start *
        </label>
        <input
          type="date"
          id="dateOfStart"
          name="dateOfStart"
          value={businessFormValues.dateOfStart}
          onChange={handleChange}
          className={styles.inputField}
        />
        {businessFormErrors.dateOfStart && (
          <p className={styles.errorText}>{businessFormErrors.dateOfStart}</p>
        )}
      </div>

      <div className={`${styles.formGroup} ${businessFormErrors.businessAddress ? styles.error : ""}`}>
        <label htmlFor="businessAddress" className={styles.inputLabel}>
          Business Address *
        </label>
        <input
          type="text"
          id="businessAddress"
          name="businessAddress"
          placeholder="Full business address"
          value={businessFormValues.businessAddress}
          onChange={handleChange}
          className={styles.inputField}
        />
        {businessFormErrors.businessAddress && (
          <p className={styles.errorText}>{businessFormErrors.businessAddress}</p>
        )}
      </div>

      <div className={`${styles.formGroup} ${businessFormErrors.taxIdentificationNumber ? styles.error : ""}`}>
        <label htmlFor="taxIdentificationNumber" className={styles.inputLabel}>
          Tax Identification Number *
        </label>
        <input
          type="text"
          id="taxIdentificationNumber"
          name="taxIdentificationNumber"
          placeholder="Your business tax ID"
          value={businessFormValues.taxIdentificationNumber}
          onChange={handleChange}
          className={styles.inputField}
        />
        {businessFormErrors.taxIdentificationNumber && (
          <p className={styles.errorText}>{businessFormErrors.taxIdentificationNumber}</p>
        )}
      </div>

      <div className={`${styles.formGroup} ${businessFormErrors.numberOfEmployees ? styles.error : ""}`}>
        <label htmlFor="numberOfEmployees" className={styles.inputLabel}>
          Number of Employees *
        </label>
        <input
          type="number"
          id="numberOfEmployees"
          name="numberOfEmployees"
          placeholder="Approximate number"
          value={businessFormValues.numberOfEmployees}
          onChange={handleChange}
          className={styles.inputField}
          min="0"
        />
        {businessFormErrors.numberOfEmployees && (
          <p className={styles.errorText}>{businessFormErrors.numberOfEmployees}</p>
        )}
      </div>

      <div className={`${styles.formGroup} ${businessFormErrors.annualRevenue ? styles.error : ""}`}>
        <label htmlFor="annualRevenue" className={styles.inputLabel}>
          Annual Revenue (UGX) *
        </label>
        <input
          type="number"
          id="annualRevenue"
          name="annualRevenue"
          placeholder="Estimated annual revenue"
          value={businessFormValues.annualRevenue}
          onChange={handleChange}
          className={styles.inputField}
          min="0"
          step="1000"
        />
        {businessFormErrors.annualRevenue && (
          <p className={styles.errorText}>{businessFormErrors.annualRevenue}</p>
        )}
      </div>

      <div className={`${styles.formGroup} ${businessFormErrors.businessPhone ? styles.error : ""}`}>
        <label htmlFor="businessPhone" className={styles.inputLabel}>
          Business Phone *
        </label>
        <input
          type="tel"
          id="businessPhone"
          name="businessPhone"
          placeholder="Official business phone"
          value={businessFormValues.businessPhone}
          onChange={handleChange}
          className={styles.inputField}
        />
        {businessFormErrors.businessPhone && (
          <p className={styles.errorText}>{businessFormErrors.businessPhone}</p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className={styles.spinner}></span>
        ) : (
          "Complete Registration"
        )}
      </button>

      {businessFormErrors.submit && (
        <div className={styles.authError}>
          <p>{businessFormErrors.submit}</p>
        </div>
      )}
    </form>
  );

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.logoContainer}>
          <img src={companyLogo} alt="Company Logo" className={styles.logo} />
        </div>

        {Object.keys(formErrors).length === 0 && isSubmit && !showBusinessForm && (
          <div className={styles.successMessage}>
            {isLogin ? "Logged in successfully" : "Account created successfully"}
          </div>
        )}

        {showBusinessForm ? renderBusinessForm() : renderAuthForm()}
      </div>
    </div>
  );
}

export default Auth;