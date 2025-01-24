import React from "react";
import { Routes, Route } from "react-router-dom";
import MyAccount from "../components/auth/MyAccount";
import ResetPasswordPage from "../components/auth/ResetPasswordPage";
import AddBannerSlide from "../pages/HomeSlider/AddHomeSlider";
import HomeSlidesList from "../pages/HomeSlider/SliderList";
import EditSlider from "../pages/HomeSlider/EditSlider";
import AddCategory from "../pages/CategoryAdd/AddCategory";
import CategoryList from "../pages/CategoryAdd/CategoryList";
import DetailsCategory from "../pages/CategoryAdd/DetailsCategory";
import UpdateCategory from "../pages/CategoryAdd/UpdateCategory";
import AddSubCategory from "../pages/SubCategory/AddSubCategory";
import ListSubCategory from "../pages/SubCategory/ListSubCategory";
import DetailsSubCategory from "../pages/SubCategory/DetailsSubcategory";
import UpdateSubcategory from "../pages/SubCategory/UpdateSubcategory";
import AddSmallCategory from "../pages/SmallCategory/AddSmallCategory";
import ListSmallCategory from "../pages/SmallCategory/ListSmallCategory";
import DetailsSmallCategory from "../pages/SmallCategory/DetailsSmallCategory";
import UpdateSmallCategory from "../pages/SmallCategory/UpdateSmallCategory";
import AddProduct from "../pages/Products/AddProduct";
import ProductsList from "../pages/Products/ProductList";
import ProductsDetails from "../pages/Products/ProductView";
import EditProduct from "../pages/Products/EditProduct";
import OrdersList from "../pages/Orders/OrdersList";
import OrderDetails from "../pages/Orders/OrderDetails ";
import OrderTracking from "../pages/Orders/OrderTracking";
import AddCertidicate from "../pages/ProductCertificate/AddCertificate";
import CertidicateList from "../pages/ProductCertificate/ListCertificate";
import UserList from "../pages/Users/UserList";
import UserDetails from "../pages/Users/UserDetails";
import UserUpdate from "../pages/Users/UserUpdate";
import AddAdsDiscountPopup from "../pages/AdsDiscountPopup/AddAdsDiscountPopup";
import AdsPopupList from "../pages/AdsDiscountPopup/AdsPopupList";
import ListNotificaton from "../pages/Notification/ListNotification";
import NotificationDetails from "../pages/Notification/NotificationDetails";
import PatnerListPage from "../pages/Patners/PatnerListPage";
import PatnerDetails from "../pages/Patners/PatnerDetailsPage";
import Reports from "../pages/Reports";
import NotFound from "../pages/NotFound";

const AllPages = () => {
  return (
    <Routes>
      <Route path="/my-account" element={<MyAccount />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* Home Slider */}
      <Route path="/add-banner-slide" element={<AddBannerSlide />} />
      <Route path="/home-slides-list" element={<HomeSlidesList />} />
      <Route path="/edit-slider/:id" element={<EditSlider />} />
      {/* Category Add Main */}
      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/category-list" element={<CategoryList />} />
      <Route path="/category-details" element={<DetailsCategory />} />
      <Route path="/update-category/:id" element={<UpdateCategory />} />
      {/* Sub CategORY Add */}
      <Route path="add-sub-category-list" element={<AddSubCategory />} />
      <Route path="sub-category-list" element={<ListSubCategory />} />
      <Route path="sub-category-details" element={<DetailsSubCategory />} />
      <Route path="update-sub-category" element={<UpdateSubcategory />} />
      {/* Small CategORY Add */}
      <Route path="/add-small-category" element={<AddSmallCategory />} />
      <Route path="/small-category-list" element={<ListSmallCategory />} />
      <Route path="/small-category-details" element={<DetailsSmallCategory />} />
      <Route path="/update-small-category" element={<UpdateSmallCategory />} />
      {/* Products*/}
      <Route path="add-products" element={<AddProduct />} />
      <Route path="products-list" element={<ProductsList />} />
      <Route path="/product/:id" element={<ProductsDetails />} />
      <Route path="/edit-product/:productId" element={<EditProduct />} />
      {/* Orders */}
      <Route path="order-list" element={<OrdersList />} />
      <Route path="order-details/:orderId" element={<OrderDetails />} />
      <Route path="order-tracking" element={<OrderTracking />} />
      {/* Certificate */}
      <Route path="add-certificates" element={<AddCertidicate />} />
      <Route path="list-certificates" element={<CertidicateList />} />
      {/* Users */}
      <Route path="users-list" element={<UserList />} />
      <Route path="user-details" element={<UserDetails />} />
      <Route path="user-update" element={<UserUpdate />} />
      {/*Ads discount Popup */}
      <Route path="add-ads" element={<AddAdsDiscountPopup />} />
      <Route path="ads-list" element={<AdsPopupList />} />
      {/* Notification */}
      <Route path="/notification-list" element={<ListNotificaton />} />
      <Route path="/notification/:id" element={<NotificationDetails />} /> 
      {/* Patners Page */} 
      <Route path="/patners-list" element={<PatnerListPage />} />
      <Route path="/partner-details/:patnerId" element={<PatnerDetails />} />
      {/*Reports */}
      <Route path="reports" element={<Reports />} />
      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllPages;
