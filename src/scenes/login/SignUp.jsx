import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import companyLogo from "./enfuna.png";

function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserType, setShowUserType] = useState(false);
  const [userType, setUserType] = useState("");
  
  // Combined form values
  const initialFormValues = {
    fullName: "",
    usernameOrEmail: "",
    password: "",
    confirmPassword: "",
    userType: "",
    // Simple business fields (only show for business users)
    phoneNumber: "",
    address: "",
    // Minimal additional fields per user type
    businessName: "", // for merchant/vendor
    vehicleType: "", // for rider/driver
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // Super admin credentials
  const SUPER_ADMIN_CREDENTIALS = {
    username: "super",
    email: "admin@efuna.com",
    password: "enfuna"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleUserTypeSelect = (selectedType) => {
    setUserType(selectedType);
    setFormValues({ ...formValues, userType: selectedType });
    setFormErrors({ ...formErrors, userType: "" });
  };

  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();
    const errors = validateBasicInfo(formValues);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setShowUserType(true);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const errors = validateLogin(formValues);
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
          onLogin("super");
          return;
        }
        
        // Regular admin login
        if (usernameOrEmail.toLowerCase() === "admin" && password === "enfuna") {
          onLogin("admin");
          return;
        }

        // Vendor 
        if (usernameOrEmail.toLowerCase() === "vendor" && password === "vendor") {
          onLogin("vendor");
          return;
        }

        // Driver 
        if (usernameOrEmail.toLowerCase() === "driver" && password === "driver") {
          onLogin("driver");
          return;
        }

        // Rider 
        if (usernameOrEmail.toLowerCase() === "rider" && password === "rider") {
          onLogin("rider");
          return;
        }
        
        // Normal user login
        if (usernameOrEmail.toLowerCase() === "normal" && password === "normal") {
          onLogin("normal");
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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const errors = validateSignup(formValues);
    setFormErrors(errors);
    setIsSubmit(true);
    
    if (Object.keys(errors).length === 0) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Redirect users based on their selected user type
        const { userType } = formValues;
        
        switch (userType) {
          case "rider":
            onLogin("rider");
            break;
          case "driver":
            onLogin("driver");
            break;
          case "vendor":
            onLogin("vendor");
            break;
          case "merchant":
            onLogin("admin"); // Merchant goes to admin as specified
            break;
          default:
            onLogin("normal"); // Fallback for any unexpected user type
        }
        
      } catch (error) {
        setFormErrors({ auth: "An error occurred. Please try again." });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const validateLogin = (values) => {
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
    }

    return errors;
  };

  const validateBasicInfo = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!values.fullName) {
      errors.fullName = "Full name is required";
    }

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

    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const validateSignup = (values) => {
    const errors = {};

    if (!values.userType) {
      errors.userType = "Please select your account type";
    }

    // Required fields for all business types
    if (values.userType) {
      if (!values.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
      }
      
      if (!values.address) {
        errors.address = "Address is required";
      }

      // User type specific validations
      if ((values.userType === "merchant" || values.userType === "vendor") && !values.businessName) {
        errors.businessName = "Business name is required";
      }

      if ((values.userType === "rider" || values.userType === "driver") && !values.vehicleType) {
        errors.vehicleType = "Vehicle type is required";
      }
    }

    return errors;
  };

  const renderUserTypeSelection = () => (
    <div className={styles.userTypeSection}>
      <h3 className={styles.sectionTitle}>Select Account Type</h3>
      <p className={styles.sectionSubtitle}>Choose how you want to use our platform</p>
      <div className={styles.userTypeGrid}>
        <button
          type="button"
          className={`${styles.userTypeButton} ${userType === "merchant" ? styles.selected : ""}`}
          onClick={() => handleUserTypeSelect("merchant")}
        >
          <div className={styles.userTypeIcon}>🏪</div>
          <span className={styles.userTypeLabel}>Merchant</span>
          <span className={styles.userTypeDesc}>Sell products</span>
        </button>

        <button
          type="button"
          className={`${styles.userTypeButton} ${userType === "vendor" ? styles.selected : ""}`}
          onClick={() => handleUserTypeSelect("vendor")}
        >
          <div className={styles.userTypeIcon}>🛒</div>
          <span className={styles.userTypeLabel}>Vendor</span>
          <span className={styles.userTypeDesc}>Supply goods</span>
        </button>

        <button
          type="button"
          className={`${styles.userTypeButton} ${userType === "rider" ? styles.selected : ""}`}
          onClick={() => handleUserTypeSelect("rider")}
        >
          <div className={styles.userTypeIcon}>🚴</div>
          <span className={styles.userTypeLabel}>Rider</span>
          <span className={styles.userTypeDesc}>Package delivery</span>
        </button>

        <button
          type="button"
          className={`${styles.userTypeButton} ${userType === "driver" ? styles.selected : ""}`}
          onClick={() => handleUserTypeSelect("driver")}
        >
          <div className={styles.userTypeIcon}>🚕</div>
          <span className={styles.userTypeLabel}>Driver</span>
          <span className={styles.userTypeDesc}>Transport services</span>
        </button>
      </div>
      {formErrors.userType && (
        <p className={styles.errorText}>{formErrors.userType}</p>
      )}
    </div>
  );

  const renderAdditionalFields = () => {
    if (!userType) return null;

    return (
      <div className={styles.additionalFields}>
        <h4 className={styles.sectionTitle}>Additional Information</h4>
        
        {/* Common fields for all business users */}
        <div className={`${styles.formGroup} ${formErrors.phoneNumber ? styles.error : ""}`}>
          <label htmlFor="phoneNumber" className={styles.inputLabel}>
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Your contact number"
            value={formValues.phoneNumber}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.phoneNumber && (
            <p className={styles.errorText}>{formErrors.phoneNumber}</p>
          )}
        </div>

        <div className={`${styles.formGroup} ${formErrors.address ? styles.error : ""}`}>
          <label htmlFor="address" className={styles.inputLabel}>
            {userType === "rider" || userType === "driver" ? "Home Address" : "Business Address"} *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder={userType === "rider" || userType === "driver" ? "Your home address" : "Business address"}
            value={formValues.address}
            onChange={handleChange}
            className={styles.inputField}
          />
          {formErrors.address && (
            <p className={styles.errorText}>{formErrors.address}</p>
          )}
        </div>

        {/* Merchant/Vendor specific field */}
        {(userType === "merchant" || userType === "vendor") && (
          <div className={`${styles.formGroup} ${formErrors.businessName ? styles.error : ""}`}>
            <label htmlFor="businessName" className={styles.inputLabel}>
              Business Name *
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              placeholder="Your business name"
              value={formValues.businessName}
              onChange={handleChange}
              className={styles.inputField}
            />
            {formErrors.businessName && (
              <p className={styles.errorText}>{formErrors.businessName}</p>
            )}
          </div>
        )}

        {/* Rider/Driver specific field */}
        {(userType === "rider" || userType === "driver") && (
          <div className={`${styles.formGroup} ${formErrors.vehicleType ? styles.error : ""}`}>
            <label htmlFor="vehicleType" className={styles.inputLabel}>
              Vehicle Type *
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formValues.vehicleType}
              onChange={handleChange}
              className={styles.inputField}
            >
              <option value="">Select vehicle type</option>
              {userType === "rider" && (
                <>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="scooter">Scooter</option>
                </>
              )}
              {userType === "driver" && (
                <>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="minivan">Minivan</option>
                  <option value="bus">Bus</option>
                </>
              )}
            </select>
            {formErrors.vehicleType && (
              <p className={styles.errorText}>{formErrors.vehicleType}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderBasicInfoForm = () => (
    <form onSubmit={handleBasicInfoSubmit} className={styles.authForm}>
      <h1 className={styles.authTitle}>Create Account</h1>
      <p className={styles.authSubtitle}>
        Get started with your account
      </p>

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

      <button
        type="submit"
        className={styles.submitButton}
      >
        Continue
      </button>

      <div className={styles.authToggle}>
        Already have an account?{" "}
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => {
            setIsLogin(true);
            setFormErrors({});
            setUserType("");
            setFormValues(initialFormValues);
          }}
        >
          Sign In
        </button>
      </div>
    </form>
  );

  const renderUserTypeForm = () => (
    <form onSubmit={handleSignupSubmit} className={styles.authForm}>
      <div className={styles.formHeader}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => setShowUserType(false)}
        >
          ← Back
        </button>
        <h1 className={styles.authTitle}>Choose Account Type</h1>
      </div>
      
      {renderUserTypeSelection()}
      {renderAdditionalFields()}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className={styles.spinner}></span>
        ) : (
          "Create Account"
        )}
      </button>

      {formErrors.auth && (
        <div className={styles.authError}>
          <p>{formErrors.auth}</p>
        </div>
      )}
    </form>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className={styles.authForm}>
      <h1 className={styles.authTitle}>Welcome Back</h1>
      <p className={styles.authSubtitle}>
        Sign in to your account
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

      <div className={styles.forgotPassword}>
        <button
          type="button"
          className={styles.forgotPasswordButton}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className={styles.spinner}></span>
        ) : (
          "Sign In"
        )}
      </button>

      {formErrors.auth && (
        <div className={styles.authError}>
          <p>{formErrors.auth}</p>
        </div>
      )}

      <div className={styles.authToggle}>
        Don't have an account?{" "}
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => {
            setIsLogin(false);
            setFormErrors({});
            setUserType("");
            setFormValues(initialFormValues);
            setShowUserType(false);
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Login Passwords*/}
      {process.env.NODE_ENV === "development" && (
        <div className={styles.devHint}>
          <p>Super Admin: super / enfuna</p>
          <p>Admin: admin / enfuna</p>
          <p>Normal User: normal / normal</p>
          <p>Vendor User: vendor / vendor</p>
          <p>Driver User: driver / driver</p>
          <p>Rider User: rider / rider</p>
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

        {Object.keys(formErrors).length === 0 && isSubmit && (
          <div className={styles.successMessage}>
            {isLogin ? "Logged in successfully" : "Account created successfully"}
          </div>
        )}

        {isLogin ? renderLoginForm() : (
          showUserType ? renderUserTypeForm() : renderBasicInfoForm()
        )}
      </div>
    </div>
  );
}

export default Auth;