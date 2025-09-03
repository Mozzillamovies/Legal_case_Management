import React, { useEffect, useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CompactLegalAuthUI from "./auth/signup";
import Home from "./pages/Home";
import AddCase from "./pages/Add_case";
import Cases from "./pages/Cases";
import Notification from "./pages/Notification";
import SettingsPage from "./components/Settings";
import Profile from "./components/Profile";


// ---------- THEME CONTEXT ----------
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark"); // Tailwind global dark
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ---------- AUTH CHECK ----------
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ---------- MAIN APP ----------
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Routes>
      {/* Default route */}
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

      {/* Protected Pages */}
      <Route
        path="/home"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-case"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AddCase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Cases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Notification />
          </ProtectedRoute>
        }
      />

      {/* Settings (public or protected as you prefer) */}
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<Profile />} />

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
