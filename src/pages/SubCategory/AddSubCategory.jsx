import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { addSubCategory } from "../../app/reducers/subCategorySlice";
import { fetchCategories } from "../../app/reducers/categorySlice";
import { toast, ToastContainer } from "react-toastify";
import "../../assets/css/subcategory/addsubcategory.css";

const AddSubCategory = () => {
  const dispatch = useDispatch();

  // Fetch categories from the redux store
  const categories = useSelector((state) => state.category.categories);
  const categoryStatus = useSelector((state) => state.category.status);
  const categoryError = useSelector((state) => state.category.error);

  // Local state for managing the form fields
  const [subCategory, setSubCategory] = useState({
    categoryName: "",
    sub_categoryName: "",
  });

  const [isFormValid, setIsFormValid] = useState(true); // To enable/disable the submit button

  // Fetch categories when the component mounts
  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  // Handle the category selection change
  const handleCategoryChange = (e) => {
    setSubCategory({
      ...subCategory,
      categoryName: e.target.value,
    });
  };

  // Handle change in the input fields (general purpose)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategory({
      ...subCategory,
      [name]: value,
    });
  };

  // Validate the form before submission
  const validateForm = () => {
    const isValid = subCategory.sub_categoryName && subCategory.categoryName;
    setIsFormValid(isValid);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // Dispatch action to add subcategory
    dispatch(addSubCategory(subCategory));
    toast.success("Subcategory added successfully!");
    setSubCategory({ categoryName: "", sub_categoryName: "" }); // Reset the form
  };

  // Handle loading and error states
  if (categoryStatus === "loading") {
    return <p>Loading categories...</p>;
  }

  if (categoryError) {
    return <p>Error: {categoryError}</p>;
  }

  return (
    <div className="add-subcategory-page-container">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" />
          Add Sub Category
        </div>
      </div>
      <div className="add-subcategory-form-wrapper">
        <h2 className="add-subcategory-heading">Add Subcategory</h2>
        <form className="add-subcategory-form" onSubmit={handleSubmit}>
          <div className="add-subcategory-form-group">
            <label className="add-subcategory-label">Category Name</label>
            <select
              className="add-subcategory-select"
              name="categoryName"
              value={subCategory.categoryName}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="add-subcategory-form-group">
            <label className="add-subcategory-label">Subcategory Name</label>
            <input
              className="add-subcategory-input"
              type="text"
              name="sub_categoryName"
              value={subCategory.sub_categoryName}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="add-subcategory-submit-btn"
            type="submit"
            disabled={!isFormValid}
          >
            Add Subcategory
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AddSubCategory;
