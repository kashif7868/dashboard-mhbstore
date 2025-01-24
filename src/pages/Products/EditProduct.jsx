import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { LuImagePlus } from "react-icons/lu"; // Import the image plus icon from 'react-icons'
import { Delete } from "@mui/icons-material";
import ReactQuill from "react-quill"; // Import React Quill for rich text editor
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling the editor
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link
import { IoIosArrowForward } from "react-icons/io"; // Import IoIosArrowForward
import { getProductById, updateProduct } from "../../app/reducers/productSlice";

const EditProduct = ({ productId }) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.currentProduct);
  const status = useSelector((state) => state.product.status);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [ratings, setRatings] = useState(0);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    // Fetch product data when the component mounts
    if (status === "idle") {
      dispatch(getProductById(productId)); // Dispatch to fetch the product by ID
    }
  }, [dispatch, productId, status]);

  useEffect(() => {
    if (product) {
      // Populate the form fields with the fetched product data
      setProductName(product.productName || "");
      setProductCode(product.productCode || "");
      setDescription(product.description || "");
      setImages(product.images || []);
      setRatings(product.ratings || 0);
      setPrice(product.price || 0);
      setDiscount(product.discount || null);
    }
  }, [product]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = [...images];
      Array.from(files).forEach((file) => {
        newImages.push(URL.createObjectURL(file));
      });
      setImages(newImages);
    }
  };

  const handleDeleteImage = (image) => {
    setImages(images.filter((img) => img !== image));
  };

  const handleSave = () => {
    const updatedProduct = {
      id: productId,
      productName,
      productCode,
      description,
      images,
      ratings,
      price,
      discount,
    };
    dispatch(updateProduct({ productId, productData: updatedProduct })); // Dispatch to update the product data
  };

  if (loading) {
    return <Typography>Loading...</Typography>; // Show loading state
  }

  if (error) {
    return <Typography>Error: {error}</Typography>; // Show error message
  }

  return (
    <div className="list-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" /> Edit Product
        </div>
      </div>
      <Box sx={{ padding: 1.3 }}>
        <Paper sx={{ padding: 3 }}>
          <Grid container spacing={3}>
            {/* Left Side: Basic Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Basic Information</Typography>

              {/* Product Name */}
              <TextField
                fullWidth
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              {/* Product Code */}
              <TextField
                fullWidth
                label="Product Code"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              {/* Product Rating */}
              <TextField
                fullWidth
                label="Product Rating"
                type="number"
                value={ratings}
                onChange={(e) => setRatings(Number(e.target.value))}
                sx={{ marginBottom: 2 }}
              />

              {/* Price */}
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                sx={{ marginBottom: 2 }}
              />

              {/* Discount */}
              <TextField
                fullWidth
                label="Discount"
                type="number"
                value={discount || ""}
                onChange={(e) => setDiscount(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              {/* Description - React Quill Editor */}
              <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                Description
              </Typography>
              <ReactQuill
                value={description}
                onChange={setDescription}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline"],
                    ["link"],
                    [{ align: [] }],
                    ["image"],
                  ],
                }}
                style={{ height: "150px", marginBottom: "20px" }}
              />
            </Grid>

            {/* Right Side: Product Images */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Product Images</Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  border: "2px dashed #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  accept="image/*"
                  id="product-images"
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="product-images"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <LuImagePlus style={{ fontSize: "2rem", color: "#555" }} />
                  <Typography variant="body2" color="textSecondary">
                    Drop your images here, or browse
                  </Typography>
                </label>
              </Box>

              {/* Displaying uploaded images */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                {images.map((image, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <img
                      src={image}
                      alt={`Product ${index}`}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <IconButton
                      onClick={() => handleDeleteImage(image)}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "white",
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Save Button */}
          <Box
            sx={{ marginTop: 3, display: "flex", justifyContent: "flex-end" }}
          >
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Product
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default EditProduct;
