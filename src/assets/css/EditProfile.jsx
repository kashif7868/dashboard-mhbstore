import React, { useEffect, useState } from "react";
import "../../assets/css/MyAccount/editProfile.css";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../context/authContext"; // Correct import of useAuth context
import Swal from 'sweetalert2'; // Import SweetAlert2 for displaying alerts

const EditProfile = () => {
  const { user, updateProfile } = useAuth(); // Using updateProfile from context

  // Local state for form fields
  const [userInfo, setUserInfo] = useState({
    image: "", // To store the new image (as a file object)
    fullName: "", 
    email: "",
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        image: user.image || "", // Assuming user.image contains the image path or null
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image file change (for profile picture)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserInfo((prevState) => ({
        ...prevState,
        image: file, // Set the file as the new image
      }));
    }
  };

  // Handle form submission (dispatch update action)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure userId is available before making the API call
    if (!user?.id) {
      return; // Do not submit if the userId is not available
    }

    // Prepare form data to be sent to backend, including the image as a file
    const formData = new FormData();
    formData.append("image", userInfo.image);
    formData.append("fullName", userInfo.fullName);
    formData.append("email", userInfo.email);

    // Use updateProfile from context to update user data
    try {
      await updateProfile(user.id, formData); // No need to assign it to updatedUser
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: `Your profile has been updated successfully!`,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-edit-wrapper">
      <h1 className="profile-edit-heading">Update Your Profile</h1>
      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-group image-upload-group">
          <div className="image-upload-container">
            {/* If userInfo.image is a file, show the image, otherwise show initials */}
            {userInfo.image && typeof userInfo.image === 'object' ? (
              <img
                src={URL.createObjectURL(userInfo.image)} // Preview the uploaded file
                alt={userInfo.fullName || "User"}
                className="profile-image-preview"
              />
            ) : (
              // Show initials if no image is uploaded
              <div className="edit-profile-avatar">
                {user?.fullName ? user.fullName.charAt(0) : "U"}
              </div>
            )}
            <input
              type="file"
              id="profileImage"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="image-file-input"
            />
          </div>
          <label htmlFor="profileImage" className="form-label image-upload-label">
            Change Profile Picture
          </label>
        </div>

        <div className="edited-profile-form-group">
          <FaUser className="edit-input-icon" />
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder=""
            value={userInfo.fullName}
            onChange={handleChange}
            required
            className="edit-input-field"
          />
          <label htmlFor="fullName" className="form-label-name">
            Full Name
          </label>
        </div>

        <div className="edited-profile-form-group">
          <FaEnvelope className="edit-input-icon" />
          <input
            type="email"
            name="email"
            id="email"
            placeholder=""
            value={userInfo.email}
            onChange={handleChange}
            required
            className="edit-input-field"
          />
          <label htmlFor="email" className="form-label-email">
            Email Address
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
