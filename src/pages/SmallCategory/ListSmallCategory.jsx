import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllSmallCategories,
  deleteSmallCategory,
} from "../../app/reducers/smallCategorySlice";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";  // Importing React Icon for search
import "../../assets/css/smallCategory/smallCategoryList.css";  // Import the CSS file

const ListSmallCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { smallCategories, loading, error } = useSelector(
    (state) => state.smallCategory
  );

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchAllSmallCategories());
  }, [dispatch]);

  const filteredData = smallCategories.filter((item) => {
    const searchLower = searchText.toLowerCase();
    return (
      item.categoryName.toLowerCase().includes(searchLower) ||
      item.sub_categoryName.toLowerCase().includes(searchLower) ||
      item.small_categoryNames.some((name) =>
        name.toLowerCase().includes(searchLower)
      ) ||
      new Date(item.createdAt)
        .toLocaleString()
        .toLowerCase()
        .includes(searchLower)
    );
  });

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this small category?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const result = await dispatch(deleteSmallCategory(id));
            if (!result.error) {
              toast.success("Small category deleted successfully!");
            } else {
              toast.error("Failed to delete small category!");
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const columns = [
    {
      name: "Sr. No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Sub Category Name",
      selector: (row) => row.sub_categoryName,
      sortable: true,
    },
    {
      name: "Small Categories",
      selector: (row) => {
        if (Array.isArray(row.small_categoryNames)) {
          return row.small_categoryNames.join(", ");
        } else {
          return row.small_categoryNames || "";
        }
      },
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="edit-button"
            onClick={() => toast.info("Edit functionality not implemented")}
          >
            <AiFillEdit />
          </button>
          <button
            className="delete-button"
            onClick={() => handleDelete(row._id)}
          >
            <AiFillDelete />
          </button>
        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <div className="list-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" /> Small Category List
        </div>
      </div>

      <div className="page-header">
        <div className="info">
          <p>{`Showing ${filteredData.length} of ${smallCategories.length} records`}</p>
        </div>
        <div className="search-box">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button
            className="add-button"
            onClick={() => navigate("/add-small-category")}
          >
            <FiPlus /> Add New
          </button>
        </div>
      </div>

      <div className="toast-container">
        <ToastContainer />
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          progressPending={loading}
          highlightOnHover
          pointerOnHover
          responsive
          defaultSortFieldId="srNo"
          className="data-table"
        />
      )}

      {error && <p className="error-text">Error: {error}</p>}
    </div>
  );
};

export default ListSmallCategory;
