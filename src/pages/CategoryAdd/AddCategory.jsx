import React, { useState } from "react";
import "../../assets/css/category/addCategory.css";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate import
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addNewCategory } from "../../app/reducers/categorySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [isPublished, setIsPublished] = useState(true); // default to true (published)
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      toast.error("Category name is required!");
      return;
    }

    // Prepare form data for the API
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("published", isPublished); // Include the published value
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    // Dispatch the action to add a new category via Redux
    try {
      await dispatch(addNewCategory(formData)).unwrap(); // Using unwrap() to handle result and errors
      toast.success("Category added successfully!");
      
      // Reset state after successful submission
      setCategoryName("");
      setCategoryImage(null);
      setIsPublished(true); // Reset to default (published)

      // Navigate to category-list page after success
      navigate("/category-list"); // Redirect to category-list page
    } catch (error) {
      toast.error("Failed to add category!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        setCategoryImage(file);
      } else {
        toast.error("Please select a valid image file!");
      }
    }
  };

  return (
    <div className="add-category-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" />
          <span>Add Category</span>
        </div>
      </div>
      <ToastContainer autoClose={800} />
      <div className="add-category-container">
        <h2 className="category-heading">Add New Category</h2>
        <form onSubmit={handleSubmit} className="add-category-form-container">
          <div className="form-dt-container">
            <div className="name-input-group">
              <h2 className="category-title">Category Name</h2>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                required
                className="input-name"
              />
            </div>
            <div className="image-upload-group">
              <h2 className="category-title">Category Image</h2>
              <div className="category-image-upload-container">
                <label htmlFor="categoryImage" className="upload-label">
                  <input
                    type="file"
                    id="categoryImage"
                    name="categoryImage"
                    className="input-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  <span className="upload-text">
                    <FiUploadCloud className="upload-icon" />
                    Drop your images here or{" "}
                    <span style={{ color: "blue" }}>select click to browse</span>
                  </span>
                </label>
                {categoryImage && (
                  <img
                    src={URL.createObjectURL(categoryImage)}
                    alt="Category Preview"
                    className="image-preview"
                  />
                )}
              </div>
            </div>

            <div className="publish-toggle-group">
              <h2 className="category-title">Publish</h2>
              <label>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={() => setIsPublished(!isPublished)}
                />
                {isPublished ? "Published" : "Unpublished"}
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="add-category-btn">
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
