import React, { useState, useEffect } from "react";
import { FiSearch, FiMessageSquare } from "react-icons/fi";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Import the useAuth hook
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNotifications,
  getNotificationById,
  markNotificationsAsRead,
} from "../app/reducers/notificationSlice"; // Import the actions
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode, toggleTheme } = useTheme(); // Access darkMode and toggleTheme from the context
  const { user, logout } = useAuth();
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // Initialize with 0

  const notifications = useSelector(
    (state) => state.notification.notifications
  ); // Get notifications from the Redux store

  useEffect(() => {
    dispatch(getAllNotifications()); // Fetch all notifications when the component mounts
  }, [dispatch]);

  useEffect(() => {
    // Update notification count whenever notifications are updated
    const unreadNotifications = notifications.filter(
      (notification) => notification.status === "Unread"
    );
    setNotificationCount(unreadNotifications.length); // Set the count based on unread notifications
  }, [notifications]); // This effect will run whenever notifications are updated

  const toggleNotificationMenu = () => {
    setShowNotificationMenu(!showNotificationMenu);

    // Reset the notification count when the menu is opened
    if (!showNotificationMenu) {
      setNotificationCount(0); // Reset count when menu is opened
      dispatch(markNotificationsAsRead()); // Mark all notifications as read
    }
  };

  const handleProfileMenuToggle = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from the AuthContext
    toast.success("Successfully logged out!");
    navigate("/auth"); // Redirect after logout
  };

  const handleViewAll = () => {
    navigate("/notification-list"); // Navigate to the notification list page
  };

  const handleNotificationClick = (id) => {
    dispatch(getNotificationById(id)); // Dispatch the action to fetch the notification by ID
    navigate(`/notification/${id}`); // Navigate to a page that shows the notification details
  };

  return (
    <header className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="search-bar-notification-container">
        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search here..." />
          <FiSearch className="search-icon" />
        </div>

        {/* Action Icons */}
        <div className="icons">
          <div className="icon theme-toggle" onClick={toggleTheme}>
            {darkMode ? <IoSunnyOutline /> : <IoMoonOutline />}
          </div>
          <div className="notification-container">
            <span className="icon" onClick={toggleNotificationMenu}>
              <FiMessageSquare />
            </span>
            {/* Notification Count */}
            {notificationCount > 0 && (
              <span className="notification-count">{notificationCount}</span>
            )}
            {/* Notification Menu */}
            {showNotificationMenu && (
              <div
                className={`notification-menu ${darkMode ? "dark" : "light"}`}
              >
                <div className="notification-header">
                  <span>Notifications</span>
                </div>
                <ul className="notification-list">
                  {notifications.length === 0 ? (
                    <li>No notifications available</li>
                  ) : (
                    notifications.slice(0, 3).map((notification) => (
                      <li
                        key={notification._id}
                        className="notification-item"
                        onClick={() =>
                          handleNotificationClick(notification._id)
                        } // Handle click on a notification
                      >
                        <div className="notification-user-img-container">
                          {/* Conditional rendering: Show image if available, otherwise show first letter of name */}
                          {user?.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || "User"}
                              className="notification-user-img"
                            />
                          ) : (
                            <div className="notification-user-avatar">
                              {user?.displayName
                                ? user.displayName.charAt(0)
                                : "U"}
                            </div>
                          )}
                        </div>
                        <div className="notification-content">
                          <span className="notification-message">
                            <b>{notification.name}</b> {notification.message}
                          </span>
                          <small>
                            {new Date(notification.createdAt).toLocaleString()}
                          </small>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <div className="notification-footer">
                  <button className="view-all-btn" onClick={handleViewAll}>
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="profile-container">
        <div className="profile-info" onClick={handleProfileMenuToggle}>
          {user?.image ? (
            <img
              src={`http://localhost:8000/${user.image}`}
              alt={user.fullName || "User"}
              className="profile-image"
            />
          ) : (
            <div className="profile-avatar">
              {user?.fullName ? user.fullName.charAt(0) : "U"}
            </div>
          )}
          <span>{user?.fullName || "Guest"}</span>{" "}
          {/* Display fullName, fallback to "Guest" */}
        </div>

        {isProfileMenuOpen && (
          <ul className="profile-menu">
            <li className="profile-menu-item">
              <Link to="/my-account">
                <HiOutlineUserCircle className="profile-menu-icon" />
                My Account
              </Link>
            </li>
            <span onClick={handleLogout} className="logout-btn">
              Logout <CiLogout className="logout-icon" />
            </span>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Navbar;
