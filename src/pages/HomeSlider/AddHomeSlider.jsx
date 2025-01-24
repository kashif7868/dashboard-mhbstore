import React, { useState } from "react";
import "../../assets/css/home-slider/addHomeSlider.css";
import { useDispatch } from "react-redux";
import { createSliderAsync } from "../../app/reducers/sliderSlice"; // Import the createSliderAsync action
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { FaRegImages } from "react-icons/fa";
import { MdOutlinePublish } from "react-icons/md"; // Make sure to import this icon

const AddHomeSlider = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);  // For image preview
  const [altText, setAltText] = useState("");
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file)); // Set the preview URL
    }
  };

  const handleAltTextChange = (e) => {
    setAltText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !altText) {
      setError("Image and Alt text are required");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("altText", altText);

    try {
      await dispatch(createSliderAsync(formData)); // Dispatch the action to create the slider
      setImage(null); // Reset form fields after successful submission
      setAltText("");
      setImageUrl(null); // Clear image preview
      toast.success("Slider added successfully!"); // Success toast
    } catch (err) {
      setError("Failed to add slider");
      toast.error("Failed to add slider!"); // Error toast
    }
  };

  return (
    <div className="add-home-slider-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link> &gt; Home Slide &gt; Add Home Slide
        </div>
      </div>
      <ToastContainer autoClose={800} />
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="home-slider-container">
        <div className="slider-card">
          <h1 className="slider-title">Add New Home Slider</h1>
          <form onSubmit={handleSubmit} className="slider-form">
            {/* Image Upload Section */}
            <div className="form-group">
              <label htmlFor="sliderImage" className="upload-label">
                <FaRegImages className="upload-icon" /> Choose Image
              </label>
              <input
                type="file"
                id="sliderImage"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imageUrl && (
                <div className="image-preview-container">
                  <img
                    src={imageUrl}
                    alt="Slider Preview"
                    className="image-preview"
                  />
                </div>
              )}
            </div>

            {/* Alt Text Input Section */}
            <div className="form-group">
              <input
                type="text"
                name="sliderTitle"
                placeholder=" "
                id="sliderTitle"
                value={altText}
                onChange={handleAltTextChange}
                className="form-control"
                required
              />
              <label htmlFor="sliderTitle" className="form-label">
                Alt Text
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              <MdOutlinePublish className="publish-icon" /> Publish Slider
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHomeSlider;
