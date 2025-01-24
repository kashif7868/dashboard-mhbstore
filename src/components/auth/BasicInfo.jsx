import React from "react";
import "../../assets/css/MyAccount/basicInfo.css";
import { useAuth } from "../../context/authContext"; // Import useAuth to get user data

const BasicInfo = () => {
  const { user } = useAuth(); // Get user data from context

  // Fallback to default user data if not available
  const userInfo = user || {
    fullName: "John Doe", // Default name
    email: "johndoe@example.com", // Default email
    image: "", // Default image (empty in this case)
  };

  return (
    <div className="basic-info-container">
      <div className="profile-image-container">
        <div className="info-profile-avatar">
          {/* If image exists, show the image; else show initials */}
          {userInfo.image ? (
            <img
              src={`http://localhost:8000/${userInfo.image}`} // Use the uploaded image
              alt={userInfo.fullName || "User"}
              className="profile-image"
            />
          ) : (
            userInfo.fullName.charAt(0) // Show initials (first letter of full name) if no image
          )}
        </div>
      </div>
      <div className="user-details">
        <h2 className="user-name">{userInfo.fullName}</h2>{" "}
        {/* Show full name */}
        <p className="user-email">
          <strong>Email:</strong> {userInfo.email}
        </p>{" "}
        {/* Show email */}
      </div>
    </div>
  );
};

export default BasicInfo;
