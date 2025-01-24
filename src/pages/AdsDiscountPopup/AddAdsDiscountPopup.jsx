import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAd } from "../../app/reducers/adsCenterSlice"; 
import "../../assets/css/adsCenter/addAdsDiscountPopup.css"

const AddAdsDiscountPopup = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    image: null,
    link: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  const statusOptions = ["Active", "Inactive"]; // Define status options here

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    dispatch(createAd(data)); // Dispatch the createAd action
  };

  return (
    <div className="add-ads-popup">
      <h1>Create Ads</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Link</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Ad</button>
      </form>
    </div>
  );
};

export default AddAdsDiscountPopup;
