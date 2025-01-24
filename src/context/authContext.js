import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch

const AuthContext = createContext();

// Utility function to safely parse JSON
const parseJSON = (data) => {
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  const [user, setUser] = useState(() =>
    parseJSON(localStorage.getItem("user"))
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [error, setError] = useState(""); // Initialize error state to handle errors

  const clearTokens = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  useEffect(() => {
    if (accessToken && !user) {
      axios
        .post("https://api.mhbstore.com/api/auth/refresh", { token: refreshToken })
        .then((response) => {
          const { user, tokens } = response.data;
          setUser(user);
          setAccessToken(tokens.access.token);
          setRefreshToken(tokens.refresh.token);

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("accessToken", tokens.access.token);
          localStorage.setItem("refreshToken", tokens.refresh.token);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          clearTokens();
        });
    }
  }, [accessToken, user, refreshToken, clearTokens]);

  const saveTokens = (tokens) => {
    setAccessToken(tokens.access.token);
    setRefreshToken(tokens.refresh.token);

    localStorage.setItem("accessToken", tokens.access.token);
    localStorage.setItem("refreshToken", tokens.refresh.token);
  };

  // SignUp API call
  const signUp = async (userData) => {
    try {
      const response = await axios.post(
        "https://api.mhbstore.com/api/auth/",
        userData
      );
      const { user, tokens } = response.data;

      setUser(user);
      saveTokens(tokens);

      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: "Signed Up",
        text: `Welcome ${user.fullName}! You have successfully signed up.`,
      });

      navigate("/"); // Redirect to dashboard after signup
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed"); // Set error message
      Swal.fire({
        icon: "error",
        title: "Signup Error",
        text: error.response?.data?.message || "Signup failed",
      });
    }
  };

  // Login API call
  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(
        "https://api.mhbstore.com/api/auth/login",
        {
          email,
          password,
        }
      );

      const { user, tokens } = response.data;

      setUser(user);
      saveTokens(tokens);

      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: "Logged In",
        text: `Welcome back ${user.fullName}! You have successfully logged in.`,
      });

      navigate("/"); // Redirect to dashboard after login
    } catch (error) {
      setError(error.response?.data?.message || "Login failed"); // Set error message
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: error.response?.data?.message || "Login failed",
      });
    }
  };

  // Logout API call
  const logout = async () => {
    try {
      await axios.post(
        "https://api.mhbstore.com/api/auth/logout",
        { refreshToken: refreshToken || "" },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      clearTokens();

      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have successfully logged out!",
      });

      navigate("/signIn"); // Redirect after logout
    } catch (error) {
      setError(error.response?.data?.message || "Logout failed"); // Set error message
      Swal.fire({
        icon: "error",
        title: "Logout Error",
        text: error.response?.data?.message || "Logout failed",
      });
    }
  };

  // Forgot Password API call
  const forgotPassword = async (email) => {
    try {
      await axios.post("https://api.mhbstore.com/api/auth/forgot-password", {
        email,
      });

      Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent",
        text: "Please check your email to reset your password.",
      });
    } catch (error) {
      setError("Failed to send reset email");
      Swal.fire({
        icon: "error",
        title: "Reset Email Error",
        text: "Failed to send reset email.",
      });
    }
  };

  // Reset Password API call
  const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
      await axios.post(
        "https://api.mhbstore.com/api/auth/reset-password",
        {
          resetPasswordToken,
          newPassword,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Password Reset Successfully",
        text: "Your password has been reset successfully.",
      });

      navigate("/signIn"); // Redirect to login after password reset
    } catch (error) {
      setError("Failed to reset password");
      Swal.fire({
        icon: "error",
        title: "Reset Password Error",
        text: "Failed to reset password.",
      });
    }
  };

  // Get user by ID
  const getUserById = async (userId) => {
    try {
      const { data } = await axios.get(
        `https://api.mhbstore.com/api/auth/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data; // Return the user data directly
    } catch (error) {
      setError("Failed to fetch user data.");
      Swal.fire({
        icon: "error",
        title: "Fetch User Error",
        text: "Failed to fetch user data.",
      });
    }
  };

  // Update user by ID
  const updateProfile = async (userId, updatedData) => {
    try {
      const { data } = await axios.patch(
        `https://api.mhbstore.com/api/auth/users/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUser(data); // Update the current user with the updated info
      Swal.fire({
        icon: "success",
        title: "User Updated",
        text: "Your user information has been updated successfully.",
      });
      return data; // Return the updated user data directly
    } catch (error) {
      setError("Failed to update user data.");
      Swal.fire({
        icon: "error",
        title: "Update User Error",
        text: "Failed to update user data.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        signUp,
        login,
        logout,
        forgotPassword,
        resetPassword,
        getUserById,
        updateProfile,
        dispatch, // Provide dispatch for actions like addSignUpBonus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
