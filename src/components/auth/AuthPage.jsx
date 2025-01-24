import React, { useState } from "react";
import "../../assets/css/authpage.css";
import { FaUser, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useAuth } from "../../context/authContext"; // Import useAuth from the context
import mhbLogo from "../../assets/images/logo.png";

const AuthPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Default to Sign In view
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(""); // For form validation errors
  const [message, setMessage] = useState(""); // State for success message
  const [forgotPassword, setForgotPassword] = useState(false); // For managing forgotten password
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me checkbox
  const { signUp, login, forgotPassword: forgotPasswordAction } = useAuth(); // Destructure the authentication methods

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (isSignUp && !fullName) {
      setError("Full name is required");
      return;
    }

    setError(""); // Clear any previous errors

    const userData = { fullName, email, password, rememberMe }; // Add rememberMe state

    if (isSignUp) {
      await signUp(userData); // Call the signUp method from AuthContext
    } else {
      await login(userData); // Call the login method from AuthContext
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setError("");
    try {
      await forgotPasswordAction(email); // Use forgotPasswordAction here
      setMessage("Please check your email for the password reset link.");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleForgotPassword = () => {
    setForgotPassword(true); // Show the "Forgot Password" form
  };

  const handleBackToSignIn = () => {
    setForgotPassword(false); // Go back to the sign-in page
    setEmail(""); // Clear email input for sign-in page
  };

  return (
    <div className="auth-container-main-wrapper">
      <div className="auth-container">
        <div className="auth-left-container">
          <div className="auth-logo-container">
            <img src={mhbLogo} alt="MHBStore Logo" className="auth-logo" />
          </div>
          <div className="dashboard-content-container">
            <h2>Welcome to the Dashboard</h2>
            <p>Your personalized dashboard for managing settings and more.</p>
          </div>
        </div>
        <div className="auth-right-container">
          <h1 className="auth-title">
            {isSignUp
              ? "Sign Up"
              : forgotPassword
              ? "Reset Password"
              : "Sign In"}
          </h1>
          {error && <div className="auth-error">{error}</div>}{" "}
          {/* Display errors */}
          {message && <div className="auth-message">{message}</div>}{" "}
          {/* Display success message */}
          <form
            onSubmit={forgotPassword ? handleResetPassword : handleSubmit} // Replace isForgotPassword with forgotPassword
            className="auth-form"
          >
            {/* Full name field for Sign Up */}
            {isSignUp && (
              <div className="auth-form-group">
                <FaUser className="auth-icon" />
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder=" "
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="auth-input"
                />
                <label htmlFor="fullName" className="auth-label">
                  Full Name
                </label>
              </div>
            )}

            {/* Email field */}
            <div className="auth-form-group">
              <FaUser className="auth-icon" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <label htmlFor="email" className="auth-label">
                Email
              </label>
            </div>
            {/* Password field */}
            {!forgotPassword && ( // Replace isForgotPassword with forgotPassword
              <div className="auth-form-group password-field">
                <FaLock className="auth-icon" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                />
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <div
                  className="auth-password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            )}

            {/* Submit button */}
            <button type="submit" className="auth-btn">
              {isSignUp
                ? "Sign Up"
                : forgotPassword
                ? "Send Email to Reset Password"
                : "Sign In"}
            </button>
            <div className="auth-checkbox-group">
              {!forgotPassword && !isSignUp && (
                <div className="auth-form-group remember-me-group">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="auth-checkbox"
                  />
                  <label htmlFor="rememberMe" className=" remember-me-label">
                    Remember Me
                  </label>
                </div>
              )}
              {!forgotPassword &&
                !isSignUp && ( // Replace isForgotPassword with forgotPassword
                  <div className="auth-forgot-password">
                    <p onClick={handleForgotPassword} className="auth-toggle">
                      Forgot Password?
                    </p>
                  </div>
                )}
            </div>
            {/* Forgot Password link */}

            {/* Back to Sign In link (for Reset Password page) */}
            {forgotPassword && ( // Replace isForgotPassword with forgotPassword
              <div className="auth-switch">
                <p onClick={handleBackToSignIn} className="auth-toggle">
                  Back to Sign In
                </p>
              </div>
            )}

            {/* Switch between Sign Up and Sign In */}
            {!forgotPassword && ( // Replace isForgotPassword with forgotPassword
              <div className="auth-switch">
                <p
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="auth-toggle"
                >
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
