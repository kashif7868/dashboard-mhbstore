import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/reducers/categorySlice";
import { fetchSubCategories } from "../../app/reducers/subCategorySlice";
import { createSmallCategory } from "../../app/reducers/smallCategorySlice";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/smallCategory/addSmallCategory.css";

const AddSmallCategory = () => {
  const dispatch = useDispatch();

  // States for form fields
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [smallCategoryName, setSmallCategoryName] = useState("");

  // State for storing the filtered subcategories based on selected category
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  // Loading state for categories and subcategories
  const [loading, setLoading] = useState(true);

  // Accessing categories and subcategories from Redux store
  const { categories } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.subcategories);

  // Fetch categories and subcategories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCategories());
      await dispatch(fetchSubCategories());
      setLoading(false); // Set loading to false once data is fetched
    };
    fetchData();
  }, [dispatch]);

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategoryName(selectedCategory);

    // Filter subcategories based on the selected category
    const filtered = subcategories.filter(
      (subCategory) => subCategory.categoryName === selectedCategory
    );
    setFilteredSubCategories(filtered);
    setSubCategoryName(""); // Reset the subcategory dropdown when category changes
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent
    const formData = {
      categoryName,
      sub_categoryName: subCategoryName,
      small_categoryNames: smallCategoryName,
    };

    // Dispatch the createSmallCategory action
    const actionResult = await dispatch(createSmallCategory(formData));

    // Show toast notification based on the result
    if (actionResult.error) {
      toast.error("Error adding small category: " + actionResult.error.message);
    } else {
      toast.success("Small category added successfully!");
      // Reset form after success
      setCategoryName("");
      setSubCategoryName("");
      setSmallCategoryName("");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="add-small-category-container">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" />
          Add Small Category
        </div>
      </div>
      <ToastContainer />
      <div className="add-small-category-form-container">
        <form onSubmit={handleSubmit} className="add-small-category-form">
          <h2 className="add-small-category-title">Add Small Category</h2>
          <div className="add-small-category-form-group">
            <label htmlFor="categoryName" className="add-small-category-label">
              Category:
            </label>
            <select
              value={categoryName}
              onChange={handleCategoryChange}
              required
              className="add-small-category-select"
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="add-small-category-form-group">
            <label className="add-small-category-label">
              Sub Category Name:
            </label>
            <select
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              required
              disabled={!categoryName} // Disable subcategory dropdown until a category is selected
              className="add-small-category-select"
            >
              <option value="">Select Sub Category</option>
              {filteredSubCategories?.map((subCategory) => (
                <option
                  key={subCategory._id}
                  value={subCategory.sub_categoryName}
                >
                  {subCategory.sub_categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="add-small-category-form-group">
            <label className="add-small-category-label">
              Small Category Name:
            </label>
            <input
              type="text"
              value={smallCategoryName}
              onChange={(e) => setSmallCategoryName(e.target.value)}
              required
              className="add-small-category-input"
            />
          </div>

          <button type="submit" className="add-small-category-submit-button">
            Add Small Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSmallCategory;
