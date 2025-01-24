import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  updateUser,
} from "../../app/reducers/userListSlice";
import { Link} from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Swal from "sweetalert2";
import { confirmAlert } from "react-confirm-alert";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { MdSearch } from "react-icons/md"; // Search icon
import "react-confirm-alert/src/react-confirm-alert.css";
import "../../assets/css/users/userList.css";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(fetchUsers());
      } catch (err) {
        console.error("Error fetching users:", err);
        Swal.fire({
          icon: "error",
          title: "Error Fetching Users",
          text: err.message,
        });
      }
    };

    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const handleDelete = (userId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await dispatch(deleteUser(userId));
              Swal.fire({
                icon: "success",
                title: "User Deleted",
                text: "The user has been successfully deleted.",
              });
            } catch (err) {
              Swal.fire({
                icon: "error",
                title: "Error Deleting User",
                text: err.message,
              });
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleUpdate = (userId, userData) => {
    confirmAlert({
      title: "Confirm Update",
      message: "Are you sure you want to update this user?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await dispatch(updateUser({ userId, userData }));
              Swal.fire({
                icon: "success",
                title: "User Updated",
                text: "The user has been successfully updated.",
              });
            } catch (err) {
              Swal.fire({
                icon: "error",
                title: "Error Updating User",
                text: err.message,
              });
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const renderUserPhoto = (photoPath, fullName) => {
    if (photoPath) {
      return <img src={photoPath} alt={fullName} className="user-list-photo" />;
    }
    return <div className="user-list-photo">{fullName.charAt(0)}</div>;
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Photo",
      selector: (row) => renderUserPhoto(row.photoPath, row.fullName),
      sortable: false,
      cell: (row) => renderUserPhoto(row.photoPath, row.fullName),
    },
    {
      name: "Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
            onClick={() =>
              handleUpdate(row.id, { role: "admin", photoPath: row.photoPath })
            }
            className="user-list-action-button"
          >
            <FaEdit />
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#000",
              color: "#000",
              "&:hover": {
                borderColor: "#333",
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={() => handleDelete(row.id)}
            className="user-list-action-button"
          >
            <AiOutlineDelete />
          </Button>
        </Box>
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
      <Box
        sx={{
          padding: 3,
          backgroundColor: "#fff",
          position: "relative",
        }}
        className="user-list-container"
      >
        {/* Page loader */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}
        <Typography variant="h4" gutterBottom sx={{ color: "#000" }}>
          User List
        </Typography>
        {error && <Typography color="error">{`Error: ${error}`}</Typography>}
        {!loading && (
          <>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: 2 }}
            >
              <Grid item>
                <Typography sx={{ color: "#000" }}>
                  {`Showing ${filteredUsers.length} of ${users.length} records`}
                </Typography>
              </Grid>
              <Grid item>
                <Box display="flex" alignItems="center">
                  <TextField
                    label="Search Users"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: <MdSearch />,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            <DataTable
              columns={columns}
              data={filteredUsers}
              pagination
              highlightOnHover
            />
          </>
        )}
      </Box>
    </div>
  );
};

export default UserList;
