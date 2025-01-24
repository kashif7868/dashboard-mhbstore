import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { getNotificationById, toggleNotificationStatus } from "../../app/reducers/notificationSlice"; 
import { toast } from "react-toastify";
import "../../assets/css/Notification/notificationDetails.css";

const NotificationDetails = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notification = useSelector(
    (state) => state.notification.notifications.find((notif) => notif._id === id)
  );
  const status = useSelector((state) => state.notification.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getNotificationById(id)); 
  }, [id, dispatch]);

  useEffect(() => {
    if (status === "succeeded" && notification) {
      setLoading(false);
    } else if (status === "failed") {
      toast.error("Failed to load notification details.");
      setLoading(false);
    }
  }, [status, notification]);

  const handleToggleStatus = () => {
    if (notification) {
      dispatch(toggleNotificationStatus({ id: notification._id, currentStatus: notification.status }));
    }
  };

  if (loading) {
    return (
      <div className="notification-details__loading-container">
        <div className="notification-details__loader"></div>
      </div>
    );
  }

  return (
    <div className="notification-details__container">
      {/* Back Button */}
      <button 
        className="notification-details__back-button" 
        onClick={() => navigate(-1)}
      >
        &#8592; Back
      </button>

      <h2 className="notification-details__title">Notification Details</h2>

      {/* Notification Card */}
      <div className="notification-details__card">
        <div className="notification-details__item">
          <strong>Name:</strong> {notification?.name || "Unknown"}
        </div>
        <div className="notification-details__item">
          <strong>Email:</strong> {notification?.email || "Unknown"}
        </div>
        <div className="notification-details__item">
          <strong>Message:</strong> 
          <p>{notification?.message || "No message"}</p>
        </div>
        <div className="notification-details__item">
          <strong>Status:</strong> {notification?.status || "Unknown"}
        </div>
        <div className="notification-details__item">
          <strong>Created At:</strong> 
          {new Date(notification?.createdAt).toLocaleString() || "Unknown"}
        </div>
      </div>

      {/* Toggle Status Button */}
      <button 
        className="notification-details__toggle-status-button" 
        onClick={handleToggleStatus}
      >
        Mark as {notification?.status === 'Unread' ? 'Read' : 'Unread'}
      </button>

      <hr className="notification-details__divider" />

      {/* Footer Section */}
      <div className="notification-details__footer">
        <p>
          This is a detailed view of the selected notification. You can review the content, the sender, and the timestamp for more context.
        </p>
      </div>
    </div>
  );
};

export default NotificationDetails;
