import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchCategoryById,
  updateCategory,
} from "../../app/reducers/categorySlice";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineCloudUpload, AiFillCloseCircle } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import "../../assets/css/category/editCategory.css";

const UpdateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentCategory, status, error } = useSelector(
    (state) => state.category
  );

  const [categoryName, setCategoryName] = useState("");
  const [statusCategory, setStatusCategory] = useState("published");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentCategory) {
      setCategoryName(currentCategory.categoryName);
      setStatusCategory(currentCategory.status);
      setImagePreview(
        `http://localhost:8000/${currentCategory.image
          .replace("public\\", "")
          .replace(/\\/g, "/")}`
      );
    }
  }, [currentCategory]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setCategoryImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCategory = new FormData();
    updatedCategory.append("categoryName", categoryName);
    updatedCategory.append("status", statusCategory);

    if (categoryImage) {
      updatedCategory.append("image", categoryImage);
    }

    dispatch(updateCategory({ categoryId: id, categoryData: updatedCategory }))
      .then(() => {
        toast.success("Category updated successfully!");
        navigate("/category-list");
      })
      .catch(() => {
        toast.error("Failed to update category");
      });
  };

  return (
    <div className="update-category-page">
      <ToastContainer />

      {/* Breadcrumb Section */}
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <IoIosArrowForward className="arrow-icon" />
        Edit Category
      </div>

      {/* Heading */}
      <div className="page-heading">
        <h2>Update Category</h2>
      </div>

      {/* Loading and Error States */}
      {status === "loading" ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : currentCategory ? (
        <form onSubmit={handleSubmit} className="category-form">
          <label className="input-label">Category Name</label>
          <input
            type="text"
            className="input-field"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <label className="input-label">Status</label>
          <select
            className="input-field"
            value={statusCategory}
            onChange={(e) => setStatusCategory(e.target.value)}
          >
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>

          <div className="image-upload-section">
            <label className="input-label">Upload Category Image</label>
            <div
              className="image-upload-box"
              onClick={() => document.getElementById("file-upload").click()}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Category Preview"
                    className="image-preview"
                  />
                  <AiFillCloseCircle
                    onClick={handleRemoveImage}
                    className="remove-image-icon"
                  />
                </>
              ) : (
                <>
                  <AiOutlineCloudUpload size={40} />
                  <span>Click to upload image</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="file-upload"
              style={{ display: "none" }}
            />
          </div>

          <div className="form-actions-container">
            <button
              className="cancel-category-btn"
              onClick={() => navigate("/category-list")}
              type="button"
            >
              Cancel
            </button>
            <button type="submit" className="update-category-btn">
              Update Category
            </button>
          </div>
        </form>
      ) : (
        <div>Category not found</div>
      )}
    </div>
  );
};

export default UpdateCategory;
