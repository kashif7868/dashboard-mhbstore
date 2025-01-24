import React, { useState, useEffect, useRef } from "react";
import "../../assets/css/product/addProduct.css";
import { LuImagePlus } from "react-icons/lu";
import { FcRemoveImage } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/reducers/categorySlice";
import { fetchSubCategories } from "../../app/reducers/subCategorySlice";
import { fetchAllSmallCategories } from "../../app/reducers/smallCategorySlice";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill"; // Import React Quill for rich text editor
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling the editor
import { IoIosArrowForward } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import {
  TextField,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quillRef = useRef(null);
  const { categories } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.subcategories);
  const { smallCategories } = useSelector((state) => state.smallCategory);

  const [productData, setProductData] = useState({
    productName: "",
    description: "", // Using productData.description directly
    categoryName: "",
    sub_categoryName: "",
    small_categoryNames: "",
    price: "",
    oldPrice: "",
    productStock: "",
    weight: 0, // Default value is now 0
    discount: "",
    brand: "",
    isFeatured: false,
    published: false,
    size: "none",
    ratings: 0,
    productCode: "",
    productDate: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchAllSmallCategories());
  }, [dispatch]);

  const filteredSubcategories = subcategories.filter(
    (subcategory) => subcategory.categoryName === productData.categoryName
  );

  const filteredSmallCategories = smallCategories.filter(
    (smallCategory) =>
      smallCategory.sub_categoryName === productData.sub_categoryName
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target || {}; // Safe check for e.target

    if (name) {
      setProductData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleQuillChange = (value) => {
    setProductData((prevData) => ({
      ...prevData,
      description: value, // Update description directly from the Quill editor's content
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const removeImage = (index) => {
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const requiredFields = [
      "productName",
      "description",
      "categoryName",
      "sub_categoryName",
      "small_categoryNames",
      "oldPrice",
      "price",
      "productStock",
      "ratings",
      "productCode",
      "productDate",
    ];
  
    // Check if all required fields are filled
    for (let field of requiredFields) {
      if (!productData[field]) {
        toast.error(
          `Please fill the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`
        );
        return false;
      }
    }
  
    // Check if images are uploaded
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return false;
    }
  
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("description", productData.description); // This should now use productData.description
    formData.append("categoryName", productData.categoryName);
    formData.append("sub_categoryName", productData.sub_categoryName);
    formData.append("small_categoryNames", productData.small_categoryNames);
    formData.append("price", productData.price);
    formData.append("oldPrice", productData.oldPrice);
    formData.append("productStock", productData.productStock);
    formData.append("weight", productData.weight);
    formData.append("discount", productData.discount);
    formData.append("brand", productData.brand);
    formData.append("isFeatured", productData.isFeatured);
    formData.append("published", productData.published);
    formData.append("size", productData.size);
    formData.append("ratings", productData.ratings);
    formData.append("productCode", productData.productCode);
    formData.append("productDate", productData.productDate);

    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post(
        "https://api.mhbstore.com/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");

        // Reset form data
        setProductData({
          productName: "",
          description: "",
          categoryName: "",
          sub_categoryName: "",
          small_categoryNames: "",
          price: "",
          oldPrice: "",
          productStock: "",
          weight: 0,
          discount: "",
          brand: "",
          isFeatured: false,
          published: false,
          size: "none",
          ratings: 0,
          productCode: "",
          productDate: "",
          images: [],
        });
        setImagePreviews([]);
        setImages([]);

        // Redirect to product list page
        navigate("/products-list"); // Redirect to /products-list
      } else {
        toast.error("Failed to add product.");
      }
    } catch (error) {
      toast.error("Error adding product.");
    }
  };

  return (
    <div className="list-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" /> New Product
        </div>
      </div>
      <div className="product-add-container">
        <ToastContainer />
        <Grid
          container
          spacing={4}
          sx={{ backgroundColor: "#fff", color: "#000" }}
        >
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5" sx={{ margin: 0.5 }}>
                Basic Information
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary "
                sx={{ margin: 1 }}
              >
                Fill out the basic product information to get started.
              </Typography>
              <Grid container spacing={2}>
                {/* Category Field */}
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="categoryName"
                      value={productData.categoryName}
                      onChange={handleChange}
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem
                          key={category._id}
                          value={category.categoryName}
                        >
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Sub Category Field */}
                {productData.categoryName && (
                  <Grid item xs={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Sub Category</InputLabel>
                      <Select
                        name="sub_categoryName"
                        value={productData.sub_categoryName}
                        onChange={handleChange}
                        required
                      >
                        {filteredSubcategories.map((subcategory) => (
                          <MenuItem
                            key={subcategory._id}
                            value={subcategory.sub_categoryName}
                          >
                            {subcategory.sub_categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              {/* Small Category Field */}
              {productData.sub_categoryName && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Small Category</InputLabel>
                  <Select
                    name="small_categoryNames"
                    value={productData.small_categoryNames}
                    onChange={handleChange}
                    required
                  >
                    {filteredSmallCategories.map((smallCategory) => (
                      <MenuItem
                        key={smallCategory._id}
                        value={smallCategory.small_categoryNames}
                      >
                        {smallCategory.small_categoryNames}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Grid container spacing={2}>
                {/* Product Name Field */}
                <Grid item xs={6}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>

                {/* Product Code Field */}
                <Grid item xs={6}>
                  <TextField
                    label="Product Code"
                    fullWidth
                    name="productCode"
                    value={productData.productCode}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Old Price"
                    fullWidth
                    name="oldPrice"
                    type="number"
                    value={productData.oldPrice}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Price"
                    fullWidth
                    name="price"
                    type="number"
                    value={productData.price}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Discount"
                    fullWidth
                    name="discount"
                    type="number"
                    value={productData.discount}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Brand"
                    fullWidth
                    name="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Product Stock"
                    fullWidth
                    name="productStock"
                    type="number"
                    value={productData.productStock}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Weight (kg)"
                    fullWidth
                    name="weight"
                    type="number"
                    value={productData.weight}
                    onChange={handleChange}
                    required
                    margin="normal"
                    inputProps={{ min: "0", step: "0.1" }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {/* Description - React Quill Editor */}
              <Box sx={{ marginBottom: 2 }}>
                <ReactQuill
                  ref={quillRef}
                  value={productData.description}
                  onChange={handleQuillChange} // Updated to use handleQuillChange
                  modules={{
                    toolbar: [
                      [{ size: [] }],
                      [{ list: "bullet" }, { list: "ordered" }],
                      ["bold", "italic", "underline"],
                      ["justify"], // Adding a custom button for justify
                      [{ color: [] }, { background: [] }],
                      ["clean"],
                    ],
                  }}
                  style={{
                    height: "150px",
                    marginBottom: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                  placeholder="Enter description here..."
                />
              </Box>

              {/* Product Status Options (Featured and Published) */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={productData.isFeatured}
                      onChange={handleChange}
                      name="isFeatured"
                      color="primary"
                    />
                  }
                  label="Featured Product"
                  sx={{ marginBottom: 0 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={productData.published}
                      onChange={handleChange}
                      name="published"
                      color="primary"
                    />
                  }
                  label="Publish Product"
                  sx={{ marginBottom: 0 }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  ":hover": {
                    backgroundColor: "#333",
                  },
                }}
                fullWidth
              >
                Add Product
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} sx={{ padding: 3, textAlign: "start-end" }}>
            {/* Product Images Section */}
            <Typography variant="h6" gutterBottom>
              Product Image
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginBottom: 2 }}
            >
              Add or change image for the product
            </Typography>
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

            <Box display="flex" flexWrap="wrap" gap={2} sx={{ marginTop: 2 }}>
              {imagePreviews.map((preview, index) => (
                <Box
                  key={index}
                  position="relative"
                  width={120}
                  height={120}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={preview}
                    alt={`Product ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    onClick={() => removeImage(index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 1,
                      color: "#fff",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                      },
                    }}
                  >
                    <FcRemoveImage />
                  </IconButton>
                </Box>
              ))}
            </Box>

            {/* Rating and Product Date Inputs */}
            <Grid container spacing={3} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rating (0-5)"
                  type="number"
                  name="ratings"
                  value={productData.ratings}
                  onChange={handleChange}
                  inputProps={{
                    min: 0,
                    max: 5,
                    step: 0.1,
                  }}
                  required
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product Date"
                  type="date"
                  name="productDate"
                  value={productData.productDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AddProduct;
