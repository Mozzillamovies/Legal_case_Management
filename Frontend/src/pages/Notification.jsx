import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaArrowLeft,
  FaCheck,
  FaTrash,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaSearch,
  FaMoon,
  FaSun,
} from "react-icons/fa";

export default function Notification() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Save dark mode to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  // Fetch cases & generate notifications
  useEffect(() => {
    const fetchCasesAndGenerateNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/api/cases"); // 🔑 adjust base URL if needed
        if (!res.ok) throw new Error(`Failed to fetch cases: ${res.status}`);
        const cases = await res.json();

        // ✅ Generate notifications where hearingDate < 2 days away
        const now = new Date();
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(now.getDate() + 2);

        const generated = cases
          .filter(c => c.clientDetails?.hearingDate)
          .map(c => {
            const hearingDate = new Date(c.clientDetails.hearingDate);
            if (hearingDate >= now && hearingDate <= twoDaysFromNow) {
              return {
                id: c._id,
                type: "urgent",
                title: "Upcoming Court Hearing",
                message: `Case #${c.caseNumber} hearing on ${hearingDate.toLocaleString()}`,
                time: "Just now",
                read: false,
                category: "court",
              };
            }
            return null;
          })
          .filter(Boolean);

        setNotifications(generated);
      } catch (err) {
        console.error("❌ Error fetching cases:", err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchCasesAndGenerateNotifications();
  }, []);

  // ---------- Helpers ----------
  const getNotificationIcon = (type) => {
    switch (type) {
      case "urgent":
        return <FaExclamationTriangle className="text-red-500" />;
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "warning":
        return <FaClock className="text-yellow-500" />;
      case "error":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getNotificationBg = (type, read, darkMode) => {
    const baseClasses = read
      ? darkMode
        ? "bg-gray-800/50"
        : "bg-gray-50/50"
      : darkMode
      ? "bg-gray-700/70"
      : "bg-white";

    const borderClass = !read
      ? type === "urgent"
        ? "border-l-4 border-red-500"
        : type === "success"
        ? "border-l-4 border-green-500"
        : type === "warning"
        ? "border-l-4 border-yellow-500"
        : "border-l-4 border-blue-500"
      : "";

    return `${baseClasses} ${borderClass}`;
  };

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filteredNotifications = notifications.filter((n) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !n.read) ||
      (filter === "read" && n.read) ||
      n.category === filter;

    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

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
                <FaBell className="text-3xl text-blue-500 animate-pulse" />
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount} unread notifications
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">

            {/* Mark All as Read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-105"
              >
                <FaCheck />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`appearance-none pl-12 pr-10 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="court">Court</option>
            </select>
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-gray-500">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((n, idx) => (
              <div
                key={n.id}
                className={`p-6 rounded-xl border transition-all duration-300 hover:scale-102 cursor-pointer ${
                  getNotificationBg(n.type, n.read, darkMode)
                } ${darkMode ? "border-gray-700" : "border-gray-200"} hover:shadow-lg`}
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => markAsRead(n.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className={`font-semibold ${
                          !n.read ? "text-blue-600 dark:text-blue-400" : ""
                        }`}
                      >
                        {n.title}
                        {!n.read && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{n.time}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
