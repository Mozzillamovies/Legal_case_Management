import React, { useEffect, useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import CompactLegalAuthUI from "./auth/signup";
import Home from "./pages/Home";
import AddCase from "./pages/Add_case";
import Cases from "./pages/Cases"; // <-- Import Cases.jsx

// ---------- THEME CONTEXT ----------
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode from localStorage when app starts
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    document.body.classList.toggle("dark-mode", saved);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode);
      document.body.classList.toggle("dark-mode", newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ---------- MAIN APP ----------
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <CompactLegalAuthUI
              mode="login"
              setIsAuthenticated={setIsAuthenticated}
            />
          ) : (
            <Navigate to="/home" />
          )
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          !isAuthenticated ? (
            <CompactLegalAuthUI
              mode="signup"
              setIsAuthenticated={setIsAuthenticated}
            />
          ) : (
            <Navigate to="/home" />
          )
        }
      />

      {/* Home */}
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
      />

      {/* Add Case */}
      <Route
        path="/add-case"
        element={isAuthenticated ? <AddCase /> : <Navigate to="/login" />}
      />

      {/* Cases Page */}
      <Route
        path="/cases"
        element={isAuthenticated ? <Cases /> : <Navigate to="/login" />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// ---------- APP WRAPPER ----------
const AppWrapper = () => (
  <Router>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Router>
);

export default AppWrapper;
