import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/sidebar.css";
import mhbLogo from "../assets/images/logo.png";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { TbCategory2 } from "react-icons/tb";
import { FaUserAlt, FaRegListAlt, FaHandshake } from "react-icons/fa";
import { BsTagsFill } from "react-icons/bs";
import { BiCertification } from "react-icons/bi";
import { TbShoppingCartPlus } from "react-icons/tb";
import { TbReportAnalytics } from "react-icons/tb";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [groupState, setGroupState] = useState({});
  const [activeGroup, setActiveGroup] = useState("");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setGroupState({}); // Collapse all groups when sidebar is collapsed
  };

  const toggleGroup = (group) => {
    setGroupState((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));
    setActiveGroup(group);
  };
  return (
    <div className={`sidebar-container ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo-container">
        <Link to="/">
          <img
            src={mhbLogo}
            alt="Ecommerce Logo"
            className="sidebar-logo-image"
          />
        </Link>
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          {isCollapsed ? (
            <AiOutlineMenuUnfold className="sidebar-toggle-icon-open" />
          ) : (
            <AiOutlineMenuFold className="sidebar-toggle-icon-close" />
          )}
        </div>
      </div>
      <h6 className="contant-headings">Main Home</h6>
      <div className="dashboard-container">
        <Link to="/" className="dashboard-link">
          <span className="icon">
            <MdDashboard />
          </span>
          Dashboard
        </Link>
      </div>
      <h6 className="contant-headings">All Pages</h6>
      <div className="sidebar-group">
        <div
          className={`sidebar-group-title ${
            activeGroup === "homeBannerSlides" ? "active-group" : ""
          }`}
          onClick={() => toggleGroup("homeBannerSlides")}
        >
          <span className="icon">
            <CiImageOn />
          </span>
          <span>Home Banner Slides</span>
          {groupState.homeBannerSlides ? (
            <IoIosArrowDown className="arrow-icon" />
          ) : (
            <IoIosArrowForward className="arrow-icon" />
          )}
        </div>
        {groupState.homeBannerSlides && (
          <ul className="sidebar-group-items">
            <li>
              <Link to="/add-banner-slide" className="sidebar-item">
                Add Home Banner Slide
              </Link>
            </li>
            <li>
              <Link to="/home-slides-list" className="sidebar-item">
                Home Slides List
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="sidebar-group">
        <div
          className={`sidebar-group-title ${
            activeGroup === "category" ? "active-group" : ""
          }`}
          onClick={() => toggleGroup("category")}
        >
          <span className="icon">
            <TbCategory2 />
          </span>
          <span>Category</span>
          {groupState.category ? (
            <IoIosArrowDown className="arrow-icon" />
          ) : (
            <IoIosArrowForward className="arrow-icon" />
          )}
        </div>
        {groupState.category && (
          <ul className="sidebar-group-items">
            <li>
              <Link to="/add-category" className="sidebar-item">
                Add Category
              </Link>
            </li>
            <li>
              <Link to="/category-list" className="sidebar-item">
                Category List
              </Link>
            </li>
            <li>
              <Link to="/add-sub-category-list" className="sidebar-item">
                Add Sub Category
              </Link>
            </li>
            <li>
              <Link to="/sub-category-list" className="sidebar-item">
                Sub Category List
              </Link>
            </li>
            <li>
              <Link to="/add-small-category" className="sidebar-item">
                Add Small Category
              </Link>
            </li>
            <li>
              <Link to="/small-category-list" className="sidebar-item">
                Small Category List
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="sidebar-group">
        <div
          className="sidebar-group-title"
          onClick={() => toggleGroup("products")}
        >
          <span className="icon">
            <TbShoppingCartPlus />
          </span>
          <span>Products</span>
          {groupState.products ? (
            <IoIosArrowDown className="arrow-icon" />
          ) : (
            <IoIosArrowForward className="arrow-icon" />
          )}
        </div>
        {groupState.products && (
          <ul className="sidebar-group-items">
            <li>
              <Link to="/add-products" className="sidebar-item">
                Add Products
              </Link>
            </li>
            <li>
              <Link to="/products-list" className="sidebar-item">
                Products List
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="sidebar-group">
        <div
          className="sidebar-group-title"
          onClick={() => toggleGroup("orders")}
        >
          <span className="icon">
            <FaRegListAlt />
          </span>
          <span>Orders</span>
          {groupState.orders ? (
            <IoIosArrowDown className="arrow-icon" />
          ) : (
            <IoIosArrowForward className="arrow-icon" />
          )}
        </div>
        {groupState.orders && (
          <ul className="sidebar-group-items">
            <li>
              <Link to="/order-list" className="sidebar-item">
                Order List
              </Link>
            </li>
            <li>
              <Link to="/order-tracking" className="sidebar-item">
                Order Tracking
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="sidebar-group">
        <div
          className="sidebar-group-title"
          onClick={() => toggleGroup("certificates")}
        >
          <span className="icon">
            <BiCertification />
          </span>
          <span>Product Certificates</span>
          {groupState.certificates ? (
            <IoIosArrowDown className="arrow-icon" />
          ) : (
            <IoIosArrowForward className="arrow-icon" />
          )}
        </div>
        {groupState.certificates && (
          <ul className="sidebar-group-items">
            <li>
              <Link to="/add-certificates" className="sidebar-item">
                Add Certificates
              </Link>
            </li>
            <li>
              <Link to="/list-certificates" className="sidebar-item">
                List Certificates
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="sidebar-group">
        <div
          className="sidebar-group-title"
          onClick={() => toggleGroup("users")}
        >
          <span className="icon">
            <FaUserAlt />
          </span>
          <span>Users</span>
          {groupState.users ? (
            <IoIosArrowDown className="arrow-icon" />
          ) : (
            <IoIosArrowForward className="arrow-icon" />
          )}
        </div>
        {groupState.users && (
          <ul className="sidebar-group-items">
            <li>
              <Link to="/users-list" className="sidebar-item">
                Users List
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="sidebar-group">
        <div className="sidebar-group-title" onClick={() => toggleGroup("ads")}>
          <span className="icon">
            <BsTagsFill />
          </span>
          <span>Ads & Discount Popup</span>
          {groupState.ads ? (
            <IoIosArrowDown className="arrow-icon" />
          ) : (
            <IoIosArrowForward className="arrow-icon" />
          )}
        </div>
        {groupState.ads && (
          <ul className="sidebar-group-items">
            <li>
              <Link to="/add-ads" className="sidebar-item">
                Add Ads
              </Link>
            </li>
            <li>
              <Link to="/ads-list" className="sidebar-item">
                Ads List
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="sidebar-group">
        <div
          className="sidebar-group-title"
          onClick={() => toggleGroup("partnershipData")}
        >
          <span className="icon">
            <FaHandshake />
          </span>
          <span> Partnership </span>
          {groupState.partnershipData ? (
            <IoIosArrowDown className="arrow-icon" />
          ) : (
            <IoIosArrowForward className="arrow-icon" />
          )}
        </div>
        {groupState.partnershipData && (
          <ul className="sidebar-group-items">
            <li>
              <Link to="/patners-list" className="sidebar-item">
                PartnerShip List
              </Link>
            </li>
          </ul>
        )}
      </div>

      <div className="sidebar-group">
        <Link to="/reports" className="reports-link">
          <span className="icon">
            <TbReportAnalytics />
          </span>
          <span>Reports</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
