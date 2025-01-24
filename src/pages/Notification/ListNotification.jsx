import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotifications, deleteNotification, updateNotification } from "../../app/reducers/notificationSlice"; // Added updateNotification action
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import SearchIcon from "@mui/icons-material/Search";
import { Typography, TextField, Grid, Box } from "@mui/material";

const ListNotification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { notifications, status, error } = useSelector(
    (state) => state.notification
  );
  const [statusColor, setStatusColor] = useState({}); // To track status colors
  const [searchText, setSearchText] = useState(""); // For search functionality

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  // Filter notifications based on search text
  const filteredData = notifications?.filter(
    (notif) =>
      notif?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      notif?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      notif?.message?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle changing the status and color when clicked
  const handleStatusClick = (id, currentStatus) => {
    // Check if the notifications array is valid and contains the notification with the given id
    const notification = notifications?.find((notif) => notif?._id === id);
    if (!notification) {
      return; // If notification is not found, exit early
    }

    const newStatus = currentStatus === "Unread" ? "Read" : "Unread"; // Toggle between Unread and Read
    const newColor = newStatus === "Unread" ? "blue" : "green"; // Set color to blue for Unread and green for Read

    // Update the color state for the status
    setStatusColor((prevState) => ({
      ...prevState,
      [id]: newColor,
    }));

    // Dispatch action to update the status in the store
    dispatch(updateNotification({ id, updateData: { status: newStatus } }));
  };

  // Handle Delete action
  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to delete this notification?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(deleteNotification(id)); // Dispatch deleteNotification action
            toast.success("Notification deleted successfully!");
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  // Handle Edit action (navigate to edit page)
  const handleEdit = (id) => {
    navigate(`/edit-notification/${id}`); // Navigate to edit page with the notification ID
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1, // Display the row number
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Message",
      selector: (row) => row.message,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          style={{
            color:
              statusColor[row._id] ||
              (row.status === "Unread" ? "blue" : "green"), // Set color dynamically
            cursor: "pointer",
          }}
          onClick={() => handleStatusClick(row._id, row.status)} // Pass the current status for toggling
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <AiFillEdit
            onClick={() => handleEdit(row._id)}
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
          <AiFillDelete
            onClick={() => handleDelete(row._id)}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
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
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff", // Background color
          color: "#000", // Text color
          padding: "20px", // Optional padding
          borderRadius: "8px", // Optional border radius
        }}
      >
        {status === "loading" ? (
          <p>Loading notifications...</p>
        ) : status === "failed" ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginBottom: "20px" }}
            >
              {/* Left: Showing records */}
              <Grid item xs={6}>
                <Typography variant="body1">{`Showing ${filteredData.length} of ${notifications.length} records`}</Typography>
              </Grid>
              {/* Right: Search field */}
              <Grid
                item
                xs={6}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>

            <DataTable
              title="Notifications"
              columns={columns}
              data={filteredData}
              pagination
            />
          </div>
        )}
      </Box>
    </div>
  );
};

export default ListNotification;
