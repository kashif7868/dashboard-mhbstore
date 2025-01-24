import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeDashboard from "./pages/HomeDashboard";
import Dashboard from "./pages/Dashboard";
import Auth from "./components/auth/AuthPage";
import { ThemeProvider } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import AllPages from "./components/AllPages"; // Import AllPages
import { AuthProvider } from "./context/authContext"; // Import AuthProvider

const App = () => {
  return (
    <ThemeProvider>
      {/* Wrap Router around everything including AuthProvider */}
      <Router>
        <AuthProvider> {/* Move AuthProvider inside Router */}
          <Routes>
            <Route path="/auth" element={<Auth />} />

            {/* Protected Dashboard Route */}
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />}>
              <Route index element={<HomeDashboard />} />

              {/* Catch-all Route for AllPages */}
              <Route path="/*" element={<AllPages />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
