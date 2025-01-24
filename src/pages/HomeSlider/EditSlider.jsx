import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchSliderByIdAsync,
  updateSliderAsync,
} from "../../app/reducers/sliderSlice";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "../../assets/css/home-slider/editSlider.css";

const EditSlider = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const slider = useSelector((state) => state.sliders.currentSlider);
  const status = useSelector((state) => state.sliders.status);
  const error = useSelector((state) => state.sliders.error);

  const [altText, setAltText] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSliderByIdAsync(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (slider) {
      setAltText(slider.altText);
      setImage(slider.image);
      setImageUrl(`http://localhost:8000/${slider.image.replace(/\\/g, "/")}`);
    }
  }, [slider]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl(null);
  };

  const handleSave = () => {
    const updatedSlider = new FormData();
    updatedSlider.append("altText", altText);
    if (image) {
      updatedSlider.append("image", image);
    }

    dispatch(updateSliderAsync({ sliderId: id, updatedData: updatedSlider }))
      .unwrap()
      .then(() => {
        toast.success("Slider updated successfully!");
        navigate("/home-slides-list");
      })
      .catch((error) => {
        toast.error(error || "Failed to update slider!");
      });
  };

  return (
    <div className="edit-slider-page">
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <IoIosArrowForward className="arrow-icon" /> Slider List
        </div>
      </div>
      <div className="edit-slider-card">
        <h2>Edit Slider</h2>

        {error && <p className="error-message">{error}</p>}
        {status === "loading" && <div className="loading">Saving...</div>}

        <div className="input-group">
          <label htmlFor="altText">Alt Text</label>
          <input
            type="text"
            id="altText"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Enter alt text"
          />
        </div>

        <div className="image-upload">
          {imageUrl ? (
            <div className={`image-preview ${imageUrl ? "show-remove" : ""}`}>
              <img
                src={imageUrl}
                alt="Slider Preview"
                className="slider-image"
              />
              <button className="remove-image" onClick={handleRemoveImage}>
                Remove Image
              </button>
            </div>
          ) : (
            <div
              className="upload-box"
              onClick={() => fileInputRef.current.click()}
            >
              <AiOutlineCloudUpload size={40} />
              <p>Click to upload image</p>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="file-input"
        />

        <div className="buttons">
          <button
            className="save-button"
            onClick={handleSave}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Saving..." : "Save"}
          </button>
          <button
            className="cancel-button"
            onClick={() => navigate("/slider-list")}
          >
            Cancel
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default EditSlider;
