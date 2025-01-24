import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { fetchAllOrders, deleteOrder, updateOrderStatus } from "../../app/reducers/orderSlice"; 
import DataTable from "react-data-table-component";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { useNavigate } from "react-router-dom"; 
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; 

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { orders, status } = useSelector((state) => state.order); 
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, status]);

  const handleDelete = (orderId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this order?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(deleteOrder(orderId))  // Ensure correct order ID is passed
              .then(() => toast.success("Order deleted successfully"))
              .catch((err) =>
                toast.error("Failed to delete order: " + err.message)
              );
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleView = (orderId) => {
    navigate(`/order-details/${orderId}`); 
  };

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }))
      .then(() => toast.success("Order status updated"))
      .catch((err) => toast.error("Failed to update status: " + err.message));
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.userDetails.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "#28a745"; // Green
      case "Shipped":
        return "#007bff"; // Blue
      case "Cancelled":
        return "#dc3545"; // Red
      case "Completed":
        return "#6c757d"; // Grey
      default:
        return "#17a2b8"; // Pending: Light Blue
    }
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.orderId,
      sortable: true,
    },
    {
      name: "Product Code",
      selector: (row) => row.cart[0]?.productCode,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.userDetails.name,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.userDetails.address,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.cart[0]?.price,
      sortable: true,
    },
    {
      name: "Product Images",
      cell: (row) => (
        <div>
          {row.cart && row.cart[0]?.images && row.cart[0]?.images.length > 0 ? (
            <img
              src={`https://api.mhbstore.com/${row.cart[0].images[0]}`}
              alt="Product"
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          ) : (
            <span>No product images available</span>
          )}
        </div>
      ),
    },
    {
      name: "Order Status",
      cell: (row) => (
        <FormControl variant="outlined" size="small" sx={{ width: 150 }}>
          <InputLabel>Order Status</InputLabel>
          <Select
            value={row.status || "Pending"} 
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            label="Order Status"
          >
            {["Pending", "Confirmed", "Shipped", "Cancelled", "Completed"].map((status) => (
              <MenuItem
                key={status}
                value={status}
                style={{ backgroundColor: getStatusColor(status) }}
              >
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <AiOutlineEye
            onClick={() => handleView(row.orderId)} 
            style={{ marginRight: 10, cursor: "pointer" }}
          />
          <AiFillDelete
            onClick={() => handleDelete(row.orderId)}  // Use orderId instead of _id
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  const data = filteredOrders.map((order) => ({
    ...order,
    grandTotal: order.grandTotal,
  }));

  return (
    <div className="list-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" /> Order List
        </div>
      </div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "20px",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          marginBottom={2}
        >
          <Typography variant="body1">
            Showing {data.length} record(s)
          </Typography>

          <TextField
            label="Search Orders"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "4px",
              "& .MuiOutlinedInput-root": {
                color: "#000",
                borderColor: "#000",
              },
              "& .MuiInputLabel-root": {
                color: "#000",
              },
            }}
          />
        </Box>

        <Box width="100%" maxWidth="1200px">
          <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            responsive
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: "#f5f5f5",
                  color: "#000",
                },
              },
              cells: {
                style: {
                  color: "#000",
                },
              },
            }}
          />
        </Box>

        <ToastContainer />
      </Box>
    </div>
  );
};

export default Orders;
