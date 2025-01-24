import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Swal from "sweetalert2";
import "../../assets/css/MyAccount/resetPassword.css";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const urlParams = new URLSearchParams(location.search);
  const resetPasswordToken = urlParams.get("token");

  useEffect(() => {
    if (!resetPasswordToken) {
      Swal.fire({
        icon: "error",
        title: "Invalid Token",
        text: "No reset token provided in the URL.",
      });
      navigate("/");
    }
  }, [resetPasswordToken, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    resetPassword(resetPasswordToken, newPassword);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}

          <div className="reset-password-field">
            <FaLock className="reset-password-icon" />
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder=" "
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="reset-password-input"
            />
            <label htmlFor="password" className="reset-password-label">
              New Password
            </label>
            <div
              className="reset-password-toggle"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <div className="reset-password-field">
            <FaLock className="reset-password-icon" />
            <input
              type={passwordVisible ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="reset-password-input"
            />
            <label htmlFor="confirmPassword" className="reset-password-label">
              Confirm Password
            </label>
            <div
              className="reset-password-toggle"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
