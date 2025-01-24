import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubCategories,
  deleteSubCategory,
} from "../../app/reducers/subCategorySlice";
import { FiPlus } from "react-icons/fi";
import { FiSearch } from "react-icons/fi"; // Import search icon
import DataTable from "react-data-table-component"; // Import DataTable component
import "../../assets/css/subcategory/subcategoryList.css";
import "react-toastify/dist/ReactToastify.css";

const ListSubCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    subcategories = [],
    loading,
    error,
  } = useSelector(
    (state) =>
      state.subcategories || { subcategories: [], loading: false, error: null }
  );

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const filteredSubcategories = subcategories.filter(
    (subcategory) =>
      subcategory.sub_categoryName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      subcategory.categoryName.toLowerCase().includes(searchText.toLowerCase())
  );

  const groupedSubcategories = filteredSubcategories.reduce(
    (acc, subcategory) => {
      if (!acc[subcategory.categoryName]) {
        acc[subcategory.categoryName] = [];
      }
      acc[subcategory.categoryName].push(subcategory);
      return acc;
    },
    {}
  );

  const handleDelete = (subcategoryId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this subcategory?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await dispatch(deleteSubCategory(subcategoryId));
              toast.success("Subcategory deleted successfully!");
            } catch (err) {
              toast.error("Error deleting subcategory");
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            toast.info("Deletion canceled");
          },
        },
      ],
    });
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Subcategories",
      selector: (row) => row.sub_categoryName,
      cell: (row) => (
        <div className="subcategory-row-container">
          {groupedSubcategories[row.categoryName]?.map((subcategory, subIndex) => (
            <div key={subcategory._id} className="subcategory-row">
              <span>{subcategory.sub_categoryName}</span>
              {subIndex < groupedSubcategories[row.categoryName].length - 1 && (
                <span>, </span>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDelete(subcategory._id)}
              >
                <IoIosClose />
              </button>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="subcategory-list-page">
      <div className="breadcrumb">
        <Link to="/">Dashboard</Link>
        <IoIosArrowForward className="arrow-icon" /> Sub Category List
      </div>

      <div className="header-container">
        <ToastContainer autoClose={100} />
        <div className="show-record-header">
          <h6>
            {filteredSubcategories.length > 0
              ? `Showing ${filteredSubcategories.length} records`
              : "No records found"}
          </h6>
        </div>
        <div className="right-header">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="search-icon-btn"
              onClick={
                () => {} /* Optional: Add custom behavior on search icon click */
              }
            >
              <FiSearch />
            </button>
          </div>
          <button
            className="add-btn"
            onClick={() => navigate("/add-sub-category-list")}
          >
            <FiPlus /> Add New
          </button>
        </div>
      </div>

      <div className="subcategory-table-container">
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Loading Subcategories...</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>Error: {error}</span>
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={columns}
            data={filteredSubcategories}
            pagination
            highlightOnHover
            responsive
            striped
            noHeader
            progressPending={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ListSubCategory;
