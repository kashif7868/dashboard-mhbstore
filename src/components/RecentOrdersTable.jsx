import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from "../app/reducers/orderSlice";
import DataTable from "react-data-table-component";
import { Box, Typography, TextField, Grid, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Import the Search icon
import "../assets/css/recentOrdersTable.css";

const RecentOrdersTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, status } = useSelector((state) => state.order || {});
  const [searchText, setSearchText] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.userDetails?.name
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            order.cart?.[0]?.productCode
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            order.orderId?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.userDetails?.city
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, orders]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleViewAllClick = () => {
    navigate("/order-list");
  };

  const columns = [
    {
      name: "Product Images",
      selector: (row) =>
        row.cart && row.cart[0]?.images && row.cart[0]?.images.length > 0 ? (
          <img
            src={`http://localhost:8000/${row.cart[0].images[0]}`}
            alt="Product"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          <span>No product images available</span>
        ),
      width: "120px",
      center: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.userDetails?.name || "N/A",
      width: "200px",
      center: true,
    },
    {
      name: "Product Code",
      selector: (row) => row.cart[0]?.productCode || "N/A",
      width: "150px",
      center: true,
    },
    {
      name: "Order ID",
      selector: (row) => row.orderId || "N/A",
      width: "150px",
      center: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.cart?.[0]?.qty || 0,
      width: "100px",
      center: true,
    },
    {
      name: "Price (PKR)",
      selector: (row) =>
        row.cart?.[0]?.price ? row.cart[0].price.toFixed(2) : "N/A",
      width: "120px",
      center: true,
    },
    {
      name: "City",
      selector: (row) => row.userDetails?.city || "N/A",
      width: "150px",
      center: true,
    },
    {
      name: "Status",
      selector: (row) => {
        const orderStatus = row.orderStatus;
        let color;
        switch (orderStatus) {
          case "completed":
            color = "green";
            break;
          case "pending":
            color = "orange";
            break;
          case "canceled":
            color = "red";
            break;
          default:
            color = "black";
        }
        return (
          <span
            style={{
              color,
              textAlign: "center",
              display: "block",
              width: "100%",
            }}
          >
            {orderStatus || "N/A"}
          </span>
        );
      },
      width: "150px",
      center: true,
    },
  ];

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#fff",
        color: "black",
      }}
    >
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewAllClick}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            '&:hover': {
              backgroundColor: "#333",
            },
          }}
        >
          View All
        </Button>
      </Grid>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" align="center">
          Total Orders: {orders?.length || 0}
        </Typography>
        <Grid item>
          <TextField
            label="Search"
            variant="outlined"
            value={searchText}
            onChange={handleSearch}
            sx={{ width: "300px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <DataTable
        title="Recent Orders"
        columns={columns}
        data={searchText ? filteredOrders : orders}
        pagination
        responsive
        noHeader
      />
    </Box>
  );
};

export default RecentOrdersTable;
