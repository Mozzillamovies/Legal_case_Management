import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCog,
  FaUser,
  FaBell,
  FaTrash,
  FaMoon,
  FaSun,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSave,
} from "react-icons/fa";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    language: "english",
    emailNotifications: true,
  });
  const navigate = useNavigate();

  // Load dark mode and user data
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser(storedUser);
    setFormData({
      name: storedUser.name || "",
      email: storedUser.email || "",
      phone: storedUser.phone || "",
      language: storedUser.language || "english",
      emailNotifications: storedUser.emailNotifications !== false,
    });
  }, []);

  // Toggle dark mode (syncs across all pages)
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('darkModeChange', { detail: newDarkMode }));
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save changes
  const handleSaveChanges = async () => {
    setLoading(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("darkMode");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900"
      } min-h-screen transition-all duration-500`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          darkMode
            ? "bg-gray-900/95 border-gray-700/50 shadow-2xl"
            : "bg-white/95 border-gray-200/50 shadow-2xl"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaCog className="text-3xl text-blue-500 animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-sm text-gray-500">Customize your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="space-y-8">

          {/* Preferences Section */}
          <SettingsSection
            icon={<FaCog className="text-purple-500" />}
            title="Preferences"
            description="Customize your app experience"
            darkMode={darkMode}
          >
            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-102 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    {darkMode ? <FaMoon className="text-yellow-400 text-lg" /> : <FaSun className="text-gray-600 text-lg" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Dark Mode</h4>
                    <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  darkMode={darkMode}
                />
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-102 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <FaGlobe className="text-green-500 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Language</h4>
                    <p className="text-sm text-gray-500">Choose your preferred language</p>
                  </div>
                </div>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <option value="english">English</option>
                  <option value="malayalam">Malayalam</option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* Notifications Section */}
          <SettingsSection
            icon={<FaBell className="text-orange-500" />}
            title="Notifications"
            description="Manage your notification preferences"
            darkMode={darkMode}
          >
            <div className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-102 hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <FaEnvelope className="text-blue-500 text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive updates and alerts via email</p>
                </div>
              </div>
              <ToggleSwitch
                checked={formData.emailNotifications}
                onChange={(checked) => handleInputChange("emailNotifications", checked)}
                darkMode={darkMode}
              />
            </div>
          </SettingsSection>

          {/* Account Control Section */}
          <SettingsSection
            icon={<FaExclamationTriangle className="text-red-500" />}
            title="Account Control"
            description="Manage your account settings"
            darkMode={darkMode}
          >
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border transition-all duration-300 ${
                darkMode 
                  ? "bg-red-900/20 border-red-800/50 hover:bg-red-900/30" 
                  : "bg-red-50 border-red-200 hover:bg-red-100/50"
              }`}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <FaExclamationTriangle className="text-red-500 text-lg" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-600 dark:text-red-400 text-lg mb-2">
                      Delete Account
                    </h4>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
                      This action cannot be undone. All your data, cases, and files will be permanently deleted.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <FaTrash />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Save Changes Button */}
          <div className="flex justify-center pt-8">
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] justify-center ${
                loading ? "animate-pulse" : ""
              } ${saveSuccess ? "from-green-500 to-emerald-600" : ""}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : saveSuccess ? (
                <>
                  <FaCheck />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl shadow-2xl border ${
            darkMode 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Delete Account</h3>
                <p className="text-gray-500">
                  Are you absolutely sure? This action cannot be undone and will permanently delete all your data.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Settings Section Component
function SettingsSection({ icon, title, description, children, darkMode }) {
  return (
    <div
      className={`p-8 rounded-3xl shadow-xl backdrop-blur-lg border transition-all duration-300 hover:shadow-2xl ${
        darkMode 
          ? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70" 
          : "bg-white/70 border-gray-200/50 hover:bg-white/90"
      }`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      <div className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {children}
      </div>
    </div>
  );
}

// Form Field Component
function FormField({ label, icon, value, onChange, placeholder, type = "text", darkMode, fullWidth = false }) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            darkMode
              ? "bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-400"
              : "bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ checked, onChange, darkMode }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        checked 
          ? "bg-blue-500 shadow-lg shadow-blue-500/25" 
          : darkMode 
          ? "bg-gray-700" 
          : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 top-1 ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {checked ? (
            <FaCheck className="text-blue-500 text-xs" />
          ) : (
            <FaTimes className="text-gray-400 text-xs" />
          )}
        </div>
      </div>
    </button>
  );
}