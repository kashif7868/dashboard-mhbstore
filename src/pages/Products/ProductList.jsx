import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, deleteProduct } from "../../app/reducers/productSlice";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { HiDownload } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "../../assets/css/product/productList.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId));
      dispatch(getAllProducts());
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img
          src={
            row.images?.[0] ? `http://localhost:8000/${row.images[0]}` : ""
          }
          alt={row.productName}
          className="product-image"
        />
      ),
      sortable: false,
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
      sortField: "productName",
    },
    {
      name: "Product Code",
      selector: (row) => row.productCode,
      sortable: true,
      sortField: "productCode",
    },
    {
      name: "Category",
      selector: (row) => row.categoryName,
      sortable: true,
      sortField: "categoryName",
    },
    {
      name: "Stock",
      selector: (row) => row.productStock,
      sortable: true,
      sortField: "productStock",
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      sortField: "price",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-icons">
          <Link to={`/edit-product/${row._id}`} className="action-icon">
            <AiFillEdit size={20} />
          </Link>
          <AiFillDelete
            size={20}
            onClick={() => handleDelete(row._id)}
            className="action-icon"
          />
        </div>
      ),
      sortable: false,
    },
  ];

  // Export to Excel functionality
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProducts);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "products.xlsx");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-list-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" /> Product List
        </div>
      </div>

      <div className="product-list-container">
        <div className="product-controls">
          <div className="product-info">
            Showing {filteredProducts.length} of {filteredProducts.length}{" "}
            records
          </div>

          <div className="product-actions">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="export-btn" onClick={exportToExcel}>
              <HiDownload className="download-icon" />
              Export
            </button>
            <Link to="/add-product">
              <button className="add-btn">+ Add Product</button>
            </Link>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredProducts}
          pagination
          subHeader
        />
      </div>
    </div>
  );
};

export default ProductList;
