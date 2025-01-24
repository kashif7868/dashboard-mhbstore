import React, { useState, useEffect } from "react";
import "../../assets/css/MyAccount/myAccount.css";
import BasicInfo from "./BasicInfo";
import EditProfile from "./EditProfile";
import OrderHistory from "./OrderHistory";
import { useAuth } from "../../context/authContext";

const MyAccount = () => {
  const [activeMenu, setActiveMenu] = useState("basic-info");
  const { user, getUserById } = useAuth();

  useEffect(() => {
    if (!user) {
      getUserById("666444c95ee9820444ba305c"); // Fetch user data using the provided ID
    }
  }, [getUserById, user]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className="account-container">
      <div className="sidebar">
        <ul className="menu-list">
          <li
            className={`menu-item ${activeMenu === "basic-info" ? "active" : ""}`}
            onClick={() => handleMenuClick("basic-info")}
          >
            Basic Information
          </li>
          <li
            className={`menu-item ${activeMenu === "edit-profile" ? "active" : ""}`}
            onClick={() => handleMenuClick("edit-profile")}
          >
            Profile Edit
          </li>
          <li
            className={`menu-item ${activeMenu === "order-history" ? "active" : ""}`}
            onClick={() => handleMenuClick("order-history")}
          >
            Order History
          </li>
        </ul>
      </div>
      <div className="content-area">
        <div className="user-info-container">
          {activeMenu === "basic-info" && <BasicInfo user={user} />}
          {activeMenu === "edit-profile" && <EditProfile user={user} />}
          {activeMenu === "order-history" && <OrderHistory userId={user?.id} />}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
