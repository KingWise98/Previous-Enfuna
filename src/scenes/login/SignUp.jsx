import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import companyLogo from "./enfuna.png";

function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [userType, setUserType] = useState(""); // "merchant", "vendor", "rider", "customer"
  
  // Auth form values
  const initialAuthValues = {
    usernameOrEmail: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    userType: ""
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
    businessPhone: "",
    vehicleType: "", // For riders
    licensePlate: "", // For riders
    serviceArea: "", // For riders
    storeName: "", // For vendors
    productCategories: "", // For vendors
    deliveryRadius: "" // For vendors/merchants
  };

  const [formValues, setFormValues] = useState(initialAuthValues);
  const [businessFormValues, setBusinessFormValues] = useState(initialBusinessValues);
  const [formErrors, setFormErrors] = useState({});
  const [businessFormErrors, setBusinessFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // Super admin credentials (in a real app, this would be handled via secure backend authentication)
  const SUPER_ADMIN_CREDENTIALS = {
    username: "admin",
    email: "admin@efuna.com",
    password: "Enfuna@2025"
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

  const handleUserTypeSelect = (selectedType) => {
    setUserType(selectedType);
    setFormValues({ ...formValues, userType: selectedType });
    setFormErrors({ ...formErrors, userType: "" });
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
        
        const { usernameOrEmail, password, userType } = formValues;
        
        // Check for super admin login
        if ((usernameOrEmail.toLowerCase() === SUPER_ADMIN_CREDENTIALS.username.toLowerCase() || 
             usernameOrEmail.toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()) && 
             password === SUPER_ADMIN_CREDENTIALS.password) {
          onLogin("superadmin");
          return;
        }
        
        // Regular admin login
        if (usernameOrEmail.toLowerCase() === "admin" && password === "enfuna") {
          onLogin("admin");
          return;
        }
        
        // Normal user login
        if (usernameOrEmail.toLowerCase() === "normal" && password === "normal") {
          onLogin("normal");
          return;
        }

        // For sign up - show additional form for business users
        if (!isLogin && (userType === "merchant" || userType === "vendor" || userType === "rider")) {
          setShowBusinessForm(true);
          setIsLoading(false);
          return;
        }
        
        // For regular customer sign up or if none matched
        if (!isLogin) {
          // Complete customer registration
          onLogin("customer");
          return;
        }
        
        // If none matched for login
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
    const errors = validateBusiness(businessFormValues, userType);
    setBusinessFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        // Simulate API call to save business data
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Business data saved:", { ...formValues, ...businessFormValues });
        
        // Complete registration and log user in based on their type
        onLogin(userType);
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
    } else if (values.password.length < 5) {
      errors.password = "Password must be at least 5 characters";
    } else if (values.password.length > 20) {
      errors.password = "Password cannot exceed 20 characters";
    }

    if (!isLogin) {
      if (!values.fullName) {
        errors.fullName = "Full name is required";
      }

      if (!values.userType) {
        errors.userType = "Please select your account type";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    return errors;
  };

  const validateBusiness = (values, type) => {
    const errors = {};
    
    // Common fields for all business types
    if (!values.businessName.trim()) {
      errors.businessName = "Business name is required";
    }
    
    if (!values.businessAddress.trim()) {
      errors.businessAddress = "Business address is required";
    }
    
    if (!values.businessPhone.trim()) {
      errors.businessPhone = "Business phone is required";
    }

    // Merchant specific validations
    if (type === "merchant") {
      if (!values.natureOfBusiness.trim()) {
        errors.natureOfBusiness = "Nature of business is required";
      }
      
      if (!values.dateOfStart) {
        errors.dateOfStart = "Start date is required";
      } else if (new Date(values.dateOfStart) > new Date()) {
        errors.dateOfStart = "Start date cannot be in the future";
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
    }

    // Vendor specific validations
    if (type === "vendor") {
      if (!values.storeName.trim()) {
        errors.storeName = "Store name is required";
      }
      
      if (!values.productCategories.trim()) {
        errors.productCategories = "Product categories are required";
      }
      
      if (!values.deliveryRadius) {
        errors.deliveryRadius = "Delivery radius is required";
      } else if (isNaN(values.deliveryRadius)) {
        errors.deliveryRadius = "Must be a valid number";
      }
    }

    // Rider specific validations
    if (type === "rider") {
      if (!values.vehicleType.trim()) {
        errors.vehicleType = "Vehicle type is required";
      }
      
      if (!values.licensePlate.trim()) {
        errors.licensePlate = "License plate is required";
      }
      
      if (!values.serviceArea.trim()) {
        errors.serviceArea = "Service area is required";
      }
    }
    
    return errors;
  };

  const renderUserTypeSelection = () => (
    <div className={styles.userTypeSection}>
      <h3 className={styles.sectionTitle}>Select Account Type</h3>
      <div className={styles.userTypeGrid}>
        <button
          type="button"
          className={`${styles.userTypeButton} ${userType === "customer" ? styles.selected : ""}`}
          onClick={() => handleUserTypeSelect("customer")}
        >
          <div className={styles.userTypeIcon}>👤</div>
          <span className={styles.userTypeLabel}>Customer</span>
          <span className={styles.userTypeDesc}>Shop and purchase items</span>
        </button>

        <button
          type="button"
          className={`${styles.userTypeButton} ${userType === "merchant" ? styles.selected : ""}`}
          onClick={() => handleUserTypeSelect("merchant")}
        >
          <div className={styles.userTypeIcon}>🏪</div>
          <span className={styles.userTypeLabel}>Merchant</span>
          <span className={styles.userTypeDesc}>Sell products and services</span>
        </button>

        <button
          type="button"
          className={`${styles.userTypeButton} ${userType === "vendor" ? styles.selected : ""}`}
          onClick={() => handleUserTypeSelect("vendor")}
        >
          <div className={styles.userTypeIcon}>🛒</div>
          <span className={styles.userTypeLabel}>Vendor</span>
          <span className={styles.userTypeDesc}>Supply goods to merchants</span>
        </button>

        <button
          type="button"
          className={`${styles.userTypeButton} ${userType === "rider" ? styles.selected : ""}`}
          onClick={() => handleUserTypeSelect("rider")}
        >
          <div className={styles.userTypeIcon}>🚴</div>
          <span className={styles.userTypeLabel}>Rider</span>
          <span className={styles.userTypeDesc}>Delivery and logistics</span>
        </button>
      </div>
      {formErrors.userType && (
        <p className={styles.errorText}>{formErrors.userType}</p>
      )}
    </div>
  );

  const renderAuthForm = () => (
    <form onSubmit={handleAuthSubmit} className={styles.authForm}>
      <h1 className={styles.authTitle}>{isLogin ? "Welcome Back" : "Create Account"}</h1>
      <p className={styles.authSubtitle}>
        {isLogin ? "Sign in to your account" : "Get started with your account"}
      </p>

      {!isLogin && (
        <div className={`${styles.formGroup} ${formErrors.fullName ? styles.error : ""}`}>
          <label htmlFor="fullName" className={styles.inputLabel}>
            Full Name
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
      )}

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
        <>
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

          {renderUserTypeSelection()}
        </>
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
            setUserType("");
            setFormValues(initialAuthValues);
          }}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </div>

      {/* Super Admin Login Hint (remove in production) */}
      {process.env.NODE_ENV === "development" && isLogin && (
        <div className={styles.devHint}>
          <p>Super Admin: admin / Enfuna@2023</p>
          <p>Admin: admin / enfuna</p>
          <p>Normal User: normal / normal</p>
        </div>
      )}
    </form>
  );

  const renderBusinessForm = () => {
    const getFormTitle = () => {
      switch (userType) {
        case "merchant": return "Merchant Information";
        case "vendor": return "Vendor Information";
        case "rider": return "Rider Information";
        default: return "Business Information";
      }
    };

    const getFormSubtitle = () => {
      switch (userType) {
        case "merchant": return "Please provide your merchant details to complete registration";
        case "vendor": return "Please provide your vendor details to complete registration";
        case "rider": return "Please provide your rider details to complete registration";
        default: return "Please provide your business details to complete registration";
      }
    };

    return (
      <form onSubmit={handleBusinessSubmit} className={styles.authForm}>
        <h1 className={styles.authTitle}>{getFormTitle()}</h1>
        <p className={styles.authSubtitle}>{getFormSubtitle()}</p>

        {/* Common fields for all business types */}
        <div className={`${styles.formGroup} ${businessFormErrors.businessName ? styles.error : ""}`}>
          <label htmlFor="businessName" className={styles.inputLabel}>
            {userType === "rider" ? "Full Name" : "Business Name"} *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            placeholder={userType === "rider" ? "Your full name" : "Your official business name"}
            value={businessFormValues.businessName}
            onChange={handleChange}
            className={styles.inputField}
          />
          {businessFormErrors.businessName && (
            <p className={styles.errorText}>{businessFormErrors.businessName}</p>
          )}
        </div>

        <div className={`${styles.formGroup} ${businessFormErrors.businessAddress ? styles.error : ""}`}>
          <label htmlFor="businessAddress" className={styles.inputLabel}>
            {userType === "rider" ? "Home Address" : "Business Address"} *
          </label>
          <input
            type="text"
            id="businessAddress"
            name="businessAddress"
            placeholder={userType === "rider" ? "Your home address" : "Full business address"}
            value={businessFormValues.businessAddress}
            onChange={handleChange}
            className={styles.inputField}
          />
          {businessFormErrors.businessAddress && (
            <p className={styles.errorText}>{businessFormErrors.businessAddress}</p>
          )}
        </div>

        <div className={`${styles.formGroup} ${businessFormErrors.businessPhone ? styles.error : ""}`}>
          <label htmlFor="businessPhone" className={styles.inputLabel}>
            Phone Number *
          </label>
          <input
            type="tel"
            id="businessPhone"
            name="businessPhone"
            placeholder="Your contact number"
            value={businessFormValues.businessPhone}
            onChange={handleChange}
            className={styles.inputField}
          />
          {businessFormErrors.businessPhone && (
            <p className={styles.errorText}>{businessFormErrors.businessPhone}</p>
          )}
        </div>

        {/* Merchant specific fields */}
        {userType === "merchant" && (
          <>
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
          </>
        )}

        {/* Vendor specific fields */}
        {userType === "vendor" && (
          <>
            <div className={`${styles.formGroup} ${businessFormErrors.storeName ? styles.error : ""}`}>
              <label htmlFor="storeName" className={styles.inputLabel}>
                Store Name *
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                placeholder="Your store name"
                value={businessFormValues.storeName}
                onChange={handleChange}
                className={styles.inputField}
              />
              {businessFormErrors.storeName && (
                <p className={styles.errorText}>{businessFormErrors.storeName}</p>
              )}
            </div>

            <div className={`${styles.formGroup} ${businessFormErrors.productCategories ? styles.error : ""}`}>
              <label htmlFor="productCategories" className={styles.inputLabel}>
                Product Categories *
              </label>
              <input
                type="text"
                id="productCategories"
                name="productCategories"
                placeholder="e.g., Electronics, Clothing, Food"
                value={businessFormValues.productCategories}
                onChange={handleChange}
                className={styles.inputField}
              />
              {businessFormErrors.productCategories && (
                <p className={styles.errorText}>{businessFormErrors.productCategories}</p>
              )}
            </div>

            <div className={`${styles.formGroup} ${businessFormErrors.deliveryRadius ? styles.error : ""}`}>
              <label htmlFor="deliveryRadius" className={styles.inputLabel}>
                Delivery Radius (km) *
              </label>
              <input
                type="number"
                id="deliveryRadius"
                name="deliveryRadius"
                placeholder="Maximum delivery distance"
                value={businessFormValues.deliveryRadius}
                onChange={handleChange}
                className={styles.inputField}
                min="0"
              />
              {businessFormErrors.deliveryRadius && (
                <p className={styles.errorText}>{businessFormErrors.deliveryRadius}</p>
              )}
            </div>
          </>
        )}

        {/* Rider specific fields */}
        {userType === "rider" && (
          <>
            <div className={`${styles.formGroup} ${businessFormErrors.vehicleType ? styles.error : ""}`}>
              <label htmlFor="vehicleType" className={styles.inputLabel}>
                Vehicle Type *
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={businessFormValues.vehicleType}
                onChange={handleChange}
                className={styles.inputField}
              >
                <option value="">Select vehicle type</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="bicycle">Bicycle</option>
                <option value="car">Car</option>
                <option value="scooter">Scooter</option>
              </select>
              {businessFormErrors.vehicleType && (
                <p className={styles.errorText}>{businessFormErrors.vehicleType}</p>
              )}
            </div>

            <div className={`${styles.formGroup} ${businessFormErrors.licensePlate ? styles.error : ""}`}>
              <label htmlFor="licensePlate" className={styles.inputLabel}>
                License Plate *
              </label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                placeholder="Vehicle license plate"
                value={businessFormValues.licensePlate}
                onChange={handleChange}
                className={styles.inputField}
              />
              {businessFormErrors.licensePlate && (
                <p className={styles.errorText}>{businessFormErrors.licensePlate}</p>
              )}
            </div>

            <div className={`${styles.formGroup} ${businessFormErrors.serviceArea ? styles.error : ""}`}>
              <label htmlFor="serviceArea" className={styles.inputLabel}>
                Service Area *
              </label>
              <input
                type="text"
                id="serviceArea"
                name="serviceArea"
                placeholder="Areas you can deliver to"
                value={businessFormValues.serviceArea}
                onChange={handleChange}
                className={styles.inputField}
              />
              {businessFormErrors.serviceArea && (
                <p className={styles.errorText}>{businessFormErrors.serviceArea}</p>
              )}
            </div>
          </>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => setShowBusinessForm(false)}
            disabled={isLoading}
          >
            Back
          </button>
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
        </div>

        {businessFormErrors.submit && (
          <div className={styles.authError}>
            <p>{businessFormErrors.submit}</p>
          </div>
        )}
      </form>
    );
  };

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