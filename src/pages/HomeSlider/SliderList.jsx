import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSliderAsync, fetchSlidersAsync } from "../../app/reducers/sliderSlice"; // Import async actions
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { FaSearch } from "react-icons/fa"; // React icon for the search bar
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../../assets/css/home-slider/sliderList.css";
import DataTable from "react-data-table-component"; // Import DataTable from react-data-table-component

const SliderList = () => {
  const dispatch = useDispatch();
  const sliders = useSelector((state) => state.sliders.list);
  const status = useSelector((state) => state.sliders.status); // status of fetch
  const error = useSelector((state) => state.sliders.error);

  const [deletingId, setDeletingId] = useState(null); // Track which slider is being deleted
  const [searchText, setSearchText] = useState(""); // State for search input

  // Fetch sliders when the component mounts
  useEffect(() => {
    dispatch(fetchSlidersAsync());
  }, [dispatch]);

  const handleDelete = (id) => {
    // Show confirmation dialog before deletion
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this slider?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setDeletingId(id); // Track the slider being deleted
            dispatch(deleteSliderAsync(id))
              .unwrap()
              .then(() => {
                toast.success("Slider deleted successfully!"); // Show success toast
                setDeletingId(null); // Reset deleting state
              })
              .catch((error) => {
                toast.error(
                  error || "Failed to delete slider. Please try again!" // Show error toast
                );
                setDeletingId(null); // Reset deleting state
              });
          },
        },
        {
          label: "No",
          onClick: () => {
            toast.info("Slider deletion cancelled"); // Inform user about cancellation
          },
        },
      ],
    });
  };

  // Filter sliders based on search text
  const filteredSliders = sliders.filter((slider) =>
    slider.altText.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      name: "SR. No.",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Slider",
      selector: (row) => (
        <img
          src={`http://localhost:8000/${row.image.replace(/\\/g, "/")}`} // Update the image URL format
          className="slider-list__image"
          alt={row.altText} // Use altText as the alt attribute for image
          style={{ width: "100px", height: "auto" }}
        />
      ),
      sortable: true,
    },
    {
      name: "Text",
      selector: (row) => row.altText,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="slider-actions">
          <button
            className="delete-button"
            onClick={() => handleDelete(row._id)} // Use _id as identifier
            disabled={status === "loading" || deletingId === row._id}
          >
            {deletingId === row._id ? (
              <div className="spinner"></div> // Add spinner inside delete button while deleting
            ) : (
              <AiFillDelete />
            )}
            {deletingId === row._id ? "Deleting..." : "Delete"}
          </button>
          <Link to={`/edit-slider/${row._id}`} className="edit-button">
            <AiFillEdit /> Edit
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="slider-list-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" /> Slider List
        </div>
      </div>

      <div className="slider-list-container">
        <div className="header-container">
          <div className="list-slider-banner-header">
            <h6>Slider List</h6>
          </div>
          <div className="right-header">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by Text"
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="add-slider-btn-container">
              <Link to="/add-banner-slide" className="add-slider-link">
                <span className="add-slider-btn">
                  <FiPlus />
                  Add Slider
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="list-slider-banner-container">
          {status === "loading" ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredSliders}
              pagination
              highlightOnHover
              responsive
            />
          )}
        </div>
      </div>

      {/* Show error message if there's any */}
      {error && <div className="error-message">{error}</div>}

      {/* Toast container to render notifications */}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default SliderList;
