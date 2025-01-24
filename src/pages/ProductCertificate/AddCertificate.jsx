import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { createCertificate } from "../../app/reducers/productCertificateSlice";
import { RiImageAddLine } from "react-icons/ri"; // Import the image icon
import "../../assets/css/product-certificate/AddCertificate.css";

const AddCertificate = () => {
  const dispatch = useDispatch();
  const [certificate, setCertificate] = useState({
    name: "",
    detail: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCertificate((prev) => ({
      ...prev,
      image: file,
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", certificate.name);
    formData.append("detail", certificate.detail);
    formData.append("image", certificate.image);

    dispatch(createCertificate(formData));
  };

  return (
    <div className="add-certificate-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link> &gt; &gt; Add Certificate
        </div>
        <div className="add-certificate-container-wrapper">
          <div className="certificate-form-container">
            <h1 className="add-certificate-title">Add Certificate</h1>
            <form className="add-certificate-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  className="form-input"
                  type="text"
                  name="name"
                  placeholder=""
                  value={certificate.name}
                  onChange={handleChange}
                  required
                />
                <label className="form-label">Name</label>
              </div>
              <div className="form-group">
                <textarea
                  className="form-input textarea"
                  name="detail"
                  value={certificate.detail}
                  onChange={handleChange}
                  required
                  placeholder=""
                />
                <label className="form-label">Detail</label>
              </div>
              <div className="form-group file-upload">
                <label className="form-label">
                  <RiImageAddLine size={24} /> Upload Image
                </label>
                <input
                  className="form-input"
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  required
                  style={{ display: "none" }} // Hide the default file input
                />
                <button
                  type="button"
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                  className="form-button choose-image-button"
                >
                  Choose Image
                </button>
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="preview-img"
                  />
                </div>
              )}
              <button className="form-button" type="submit">
                Create Certificate
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCertificate;
