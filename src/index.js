import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./app/store";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <Provider store={store}>
      {/* Using StrictMode during development for identifying potential problems */}
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  );

  // Report web vitals only in production, for performance logging
  if (process.env.NODE_ENV === "production") {
    reportWebVitals(console.log);
  }
} else {
  console.error(
    "Root element not found. Ensure your index.html contains an element with id='root'."
  );
}
