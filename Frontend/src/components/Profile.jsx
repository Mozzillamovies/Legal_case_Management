import React, { useState, useEffect, useContext } from "react";
import {
  User,
  Mail,
  Calendar,
  Bell,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

// Mock ThemeContext - replace with your actual ThemeContext
const ThemeContext = React.createContext({
  isDarkMode: false,
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const { isDarkMode } = useContext(ThemeContext);

  // ---------- STATES ----------
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    createdAt: "",
    updatedAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [preferences, setPreferences] = useState(() => {
    const stored = localStorage.getItem("userPreferences");
    return (
      JSON.parse(stored) || {
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: true,
        securityAlerts: true,
      }
    );
  });

  const [editingSections, setEditingSections] = useState({
    personal: false,
    account: false,
    preferences: false,
  });

  const [personalForm, setPersonalForm] = useState({ fullName: "" });
  const [accountForm, setAccountForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ---------- HELPERS ----------
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const safeJson = async (response) => {
    try {
      return await response.json();
    } catch {
      return null;
    }
  };

  // ---------- FETCH USER DATA ----------
  useEffect(() => {
    fetchUserData();
  }, []);

const fetchUserData = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/auth/profile`, { // <-- updated
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await safeJson(response);
      if (data) {
        setUserData(data);
        setPersonalForm({ fullName: data.fullName });
        setAccountForm((prev) => ({ ...prev, email: data.email }));
      }
    } else {
      const errData = await safeJson(response);
      setError(errData?.message || `Failed to load profile (${response.status})`);
    }
  } catch (err) {
    setError("Error loading profile. Please check your backend server.");
  } finally {
    setLoading(false);
  }
};

// ---------- SAVE HANDLERS ----------
const handleSavePersonal = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, { // <-- updated
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ fullName: personalForm.fullName }),
    });

    if (response.ok) {
      const updatedData = await response.json();
      setUserData((prev) => ({ ...prev, fullName: updatedData.fullName }));
      setEditingSections((prev) => ({ ...prev, personal: false }));
      setSuccess("Personal information updated successfully");
    } else {
      const errData = await safeJson(response);
      setError(errData?.message || "Failed to update personal information");
    }
  } catch {
    setError("Error updating personal information");
  }
};

const handleSaveAccount = async () => {
  if (
    accountForm.newPassword &&
    accountForm.newPassword !== accountForm.confirmPassword
  ) {
    setError("New passwords do not match");
    return;
  }

  try {
    const updateData = { email: accountForm.email };
    if (accountForm.newPassword) {
      updateData.currentPassword = accountForm.currentPassword;
      updateData.newPassword = accountForm.newPassword;
    }

    const response = await fetch(`${API_URL}/api/auth/account`, { // <-- updated
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const updatedData = await response.json();
      setUserData((prev) => ({ ...prev, email: updatedData.email }));
      setEditingSections((prev) => ({ ...prev, account: false }));
      setAccountForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setSuccess("Account settings updated successfully");
    } else {
      const errData = await safeJson(response);
      setError(errData?.message || "Failed to update account settings");
    }
  } catch {
    setError("Error updating account settings");
  }
};

  const handleSavePreferences = () => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    setEditingSections((prev) => ({ ...prev, preferences: false }));
    setSuccess("Preferences saved successfully");
  };

  // ---------- UTIL ----------
  const handleEditSection = (section) => {
    setEditingSections((prev) => ({ ...prev, [section]: true }));
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = (section) => {
    setEditingSections((prev) => ({ ...prev, [section]: false }));
    if (section === "personal") {
      setPersonalForm({ fullName: userData.fullName });
    } else if (section === "account") {
      setAccountForm({
        email: userData.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setError("");
    setSuccess("");
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account information and settings
          </p>
        </nav>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {getInitials(userData.fullName)}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userData.fullName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                </p>
                <p className="text-gray-500 dark:text-gray-500 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Member since {formatDate(userData.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              {!editingSections.personal && (
                <button
                  onClick={() => handleEditSection('personal')}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
            
            <div className="p-6">
              {editingSections.personal ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={personalForm.fullName}
                      onChange={(e) => setPersonalForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSavePersonal}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => handleCancelEdit('personal')}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Full Name</span>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.fullName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Settings
              </h3>
              {!editingSections.account && (
                <button
                  onClick={() => handleEditSection('account')}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
            
            <div className="p-6">
              {editingSections.account ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={accountForm.email}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Change Password</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.current ? "text" : "password"}
                            value={accountForm.currentPassword}
                            onChange={(e) => setAccountForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            value={accountForm.newPassword}
                            onChange={(e) => setAccountForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            value={accountForm.confirmPassword}
                            onChange={(e) => setAccountForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSaveAccount}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => handleCancelEdit('account')}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email Address</span>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Password</span>
                    <p className="text-gray-900 dark:text-white font-medium">••••••••</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h3>
              {!editingSections.preferences && (
                <button
                  onClick={() => handleEditSection('preferences')}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
            
            <div className="p-6">
              {editingSections.preferences ? (
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional and marketing emails' },
                    { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security-related notifications' }
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{pref.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{pref.description}</p>
                      </div>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences[pref.key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences[pref.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSavePreferences}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                    <button
                      onClick={() => handleCancelEdit('preferences')}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email Notifications</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Push Notifications</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {preferences.pushNotifications ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Marketing Emails</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {preferences.marketingEmails ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Security Alerts</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {preferences.securityAlerts ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;