import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "./reducers/sliderSlice";
import categoryReducer from "./reducers/categorySlice";
import subCategoryReducer from "./reducers/subCategorySlice";
import smallCategoryReducer from "./reducers/smallCategorySlice";
import userListReducer from "./reducers/userListSlice";
import certificateReducer from "./reducers/productCertificateSlice";
import adsCenterReducer from "./reducers/adsCenterSlice";
import productReducer from "./reducers/productSlice";
import orderReducer from "./reducers/orderSlice";
import reportReducer from './reducers/reportSlice';
import partnerReducer from "./reducers/partnerSlice";
import notificationReducer from "./reducers/notificationSlice";
const store = configureStore({
  reducer: {
    sliders: sliderReducer,
    category: categoryReducer,
    subcategories: subCategoryReducer,
    smallCategory: smallCategoryReducer,
    users: userListReducer,
    certificates: certificateReducer,
    adsCenter: adsCenterReducer,
    product: productReducer,
    order: orderReducer,
    report: reportReducer,
    partner: partnerReducer,
    notification: notificationReducer,
  },
});

export default store;
