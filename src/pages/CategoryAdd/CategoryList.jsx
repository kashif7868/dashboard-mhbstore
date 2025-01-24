import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
  updateCategoryStatus,
} from "../../app/reducers/categorySlice";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { confirmAlert } from "react-confirm-alert";
import { ToastContainer, toast } from "react-toastify";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "../../assets/css/category/categoryList.css"; // Custom CSS

const CategoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, status, error } = useSelector((state) => state.category);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = (categoryId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this category?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(deleteCategory(categoryId))
              .then(() => {
                dispatch(fetchCategories());
                toast.success("Category deleted successfully!");
              })
              .catch(() => {
                toast.error("Failed to delete category.");
              });
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleStatusToggle = (categoryId, currentStatus) => {
    const newStatus =
      currentStatus === "published" ? "unpublished" : "published";
    dispatch(updateCategoryStatus({ categoryId, status: newStatus }))
      .then(() => {
        toast.success(`Category status updated to ${newStatus}!`);
      })
      .catch(() => {
        toast.error("Failed to update category status.");
      });
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Category Image",
      selector: (row) => row.image,
      cell: (row) => (
        <div className="category-image-container">
          <img
            src={`https://api.mhbstore.com/${row.image
              .replace("public\\", "")
              .replace(/\\/g, "/")}`}
            alt={row.categoryName}
            width={50}
            className="category-image"
          />
        </div>
      ),
      sortable: false,
    },
    {
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="status-container">
          <input
            type="checkbox"
            checked={row.status === "published"}
            onChange={() => handleStatusToggle(row.id, row.status)}
          />
          <span>{row.status === "published" ? "Live" : "Hidden"}</span>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="actions-container">
          <button
            className="edit-button"
            onClick={() => navigate(`/update-category/${row.id}`)}
          >
            <AiFillEdit /> Edit
          </button>
          <button
            className="delete-button"
            onClick={() => handleDelete(row.id)}
          >
            <AiFillDelete /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="category-list-page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <IoIosArrowForward className="arrow-icon" /> Category List
      </div>

      <ToastContainer />

      <div className="category-list-container">
        <div className="header-container">
          <div className="show-record-header">
            <h6>
              {filteredCategories.length > 0
                ? `Showing ${filteredCategories.length} of ${categories.length} records`
                : "No records found"}
            </h6>
          </div>
          <div className="right-header">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name"
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="add-category-btn-container">
              <Link to="/add-category" className="add-category-link">
                <span className="add-category-btn">
                  <FiPlus /> Add Category
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="category-data-table">
          {status === "loading" ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">{`Error: ${error}`}</div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredCategories}
              pagination
              highlightOnHover
              dense
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
