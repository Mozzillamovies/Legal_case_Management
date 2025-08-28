import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileMenu from "../components/ProfileMenu";
import {
  FaFolderOpen,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaPlus,
  FaClock,
  FaChevronRight,
  FaUser,
  FaCalendar,
} from "react-icons/fa";




export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const navigate = useNavigate();

  // Fetch logged-in user from localStorage or API
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Optionally fetch from backend if needed
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Fetch recent cases
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cases");
        setCases(res.data);
      } catch (err) {
        console.error("Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900"
      } min-h-screen transition-all duration-500 relative overflow-hidden`}
    >
      {/* Enhanced Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navbarScrolled 
            ? `${darkMode 
                ? "bg-gray-900/95 backdrop-blur-xl border-gray-700/50 shadow-2xl" 
                : "bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-2xl"} py-3`
            : `${darkMode
                ? "bg-gray-800/90 backdrop-blur-lg border-gray-700"
                : "bg-white/90 backdrop-blur-lg border-gray-200"} py-4`
        } border-b`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo & Brand */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="relative">
                  <div className={`text-3xl transition-transform duration-300 group-hover:scale-110 ${
                    navbarScrolled ? 'animate-pulse' : 'animate-bounce'
                  }`}>⚖️</div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300">
                    CaseManager
                  </h1>
                  <p className="text-xs text-gray-500 group-hover:text-indigo-500 transition-colors">
                    Legal Case Management System
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-6">
              {/* Enhanced Time & Date Display */}
              <div className={`flex flex-col items-end px-6 py-3 rounded-2xl transition-all duration-300 ${
                darkMode ? 'bg-gray-800/70 hover:bg-gray-800/90 border border-gray-700/50' : 'bg-white/80 hover:bg-white/100 border border-gray-200/50'
              } cursor-pointer group shadow-lg hover:shadow-xl backdrop-blur-lg`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                    <FaClock className="text-blue-500 animate-pulse text-lg" />
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xl font-bold group-hover:text-blue-500 transition-colors">
                      {formatTime(currentTime)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaCalendar className="text-xs" />
                      <span>{formatDate(currentTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative p-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                  darkMode
                    ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30 shadow-lg shadow-yellow-500/20 border border-yellow-500/30"
                    : "bg-gradient-to-br from-gray-800/20 to-gray-900/20 text-gray-600 hover:from-gray-800/30 hover:to-gray-900/30 shadow-lg shadow-gray-800/20 border border-gray-300/30"
                } hover:scale-110 hover:-translate-y-1`}
              >
                <div className="relative z-10">
                  {darkMode ? (
                    <FaSun className="animate-spin text-xl" />
                  ) : (
                    <FaMoon className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>

              {/* Enhanced Profile Menu */}
              <div className="relative group">
                <div className={`transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 p-1 rounded-2xl ${
                  darkMode 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 shadow-lg shadow-indigo-500/20 border border-indigo-500/30' 
                    : 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 shadow-lg shadow-blue-500/20 border border-blue-500/30'
                } backdrop-blur-lg`}>
                  <div className="relative">
                    {/* Animated ring around profile */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 animate-pulse"></div>
                    <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full p-1`}>
                      <ProfileMenu user={user} setUser={setUser} />
                    </div>
                    {/* Status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Logout Button */}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 group relative overflow-hidden backdrop-blur-lg ${
                  darkMode
                    ? "text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 border border-red-500/30"
                    : "text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/25 border border-red-500/30"
                } hover:scale-105 hover:-translate-y-1`}
              >
                <FaSignOutAlt className="group-hover:translate-x-1 group-hover:rotate-12 transition-all duration-300 text-lg" />
                <span className="hidden sm:inline font-semibold">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      {/* Welcome Banner */}
      <section className="px-8 py-16 text-center relative z-10 overflow-hidden">
        {/* Animated SVG Background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg
            className="w-full h-full animate-pulse"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="legalPattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <text
                  x="10"
                  y="60"
                  fontSize="80"
                  fontFamily="serif"
                  fill="white"
                  opacity="0.05"
                >
                  ⚖️
                </text>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#legalPattern)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl animate-wave">👋</div>
            </div>
            <h2 className="text-4xl font-bold mb-4 animate-fadeInUp">Welcome Back</h2>
            <p className="text-xl opacity-90 animate-fadeInUp delay-100">
              Manage your cases efficiently and stay up to date
            </p>
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Quick Actions */}
      <section className="px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <ActionCard
          icon={<FaPlus />}
          title="Add Case"
          desc="Create a new legal case quickly"
          onClick={() => navigate("/add-case")}
          darkMode={darkMode}
          index={0}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />
        <ActionCard
          icon={<FaFolderOpen />}
          title="View Cases"
          desc="Browse and manage all cases"
          onClick={() => navigate("/cases")}
          darkMode={darkMode}
          index={1}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />
        <ActionCard
          icon={<FaCog />}
          title="Settings"
          desc="Customize your preferences"
          onClick={() => navigate("/settings")}
          darkMode={darkMode}
          index={2}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />
      </section>

      {/* Recent Activity */}
      <section
        className={`mx-8 mb-10 p-8 rounded-3xl shadow-2xl backdrop-blur-lg border transition-all duration-300 relative z-10 ${
          darkMode 
            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70" 
            : "bg-white/70 border-gray-200 hover:bg-white/90"
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <h3 className="font-bold text-2xl">Recent Cases</h3>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading Cases</p>
        ) : cases.length > 0 ? (
          <div className="space-y-4">
            {cases
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // latest updates first
              .slice(0, 5)
              .map((c, i) => (
                <ActivityItem
                  key={c._id || i}
                  text={`Case ${c.caseNumber || ""} (${c.caseType}) → ${c.caseStatus}`}
                  darkMode={darkMode}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No recent activity found</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, darkMode, index, hoveredCard, setHoveredCard }) {
  const colors = ['blue', 'green', 'purple'];
  const color = colors[index];
  const isHovered = hoveredCard === index;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
      className={`cursor-pointer p-8 rounded-3xl shadow-xl backdrop-blur-lg border transition-all duration-500 transform group ${
        darkMode 
          ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70" 
          : "bg-white/70 border-gray-200 hover:bg-white/90"
      } ${isHovered ? 'scale-105 -translate-y-2' : 'hover:scale-105 hover:-translate-y-2'}`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex flex-col items-center text-center relative">
        <div className={`text-${color}-500 text-4xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
          {icon}
        </div>
        <h4 className="font-bold text-xl mb-2 group-hover:text-blue-500 transition-colors">
          {title}
        </h4>
        <p className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
          {desc}
        </p>
        <FaChevronRight className={`mt-4 transition-all duration-300 ${
          isHovered ? 'translate-x-2 opacity-100' : 'opacity-0'
        }`} />
      </div>
    </div>
  );
}

function CaseCard({ case: c, darkMode, index }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-6 border rounded-2xl transition-all duration-300 cursor-pointer group ${
        darkMode 
          ? "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50" 
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      } ${isHovered ? 'transform scale-102 shadow-lg' : ''}`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
            ['bg-blue-500', 'bg-green-500', 'bg-purple-500'][index % 3]
          }`}>
            {c.caseTitle?.[0] || '?'}
          </div>
          <div>
            <p className="font-semibold text-lg group-hover:text-blue-500 transition-colors">
              {c.caseTitle}
            </p>
            <div className="flex items-center gap-2 text-sm opacity-70">
              <FaUser className="text-xs" />
              <span>{c.clientName || "Unknown Client"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            c.caseStatus === 'Active' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : c.caseStatus === 'Pending'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
          }`}>
            {c.caseStatus}
          </span>
          <FaChevronRight className={`transition-all duration-300 ${
            isHovered ? 'translate-x-2 opacity-100' : 'opacity-50'
          }`} />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ text, darkMode }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-102 ${
      darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/50'
    }`}>
      <div className={`p-2 rounded-full ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <FaClock className="text-blue-500" />
      </div>
      <span className="flex-1">{text}</span>
      <span className="text-xs opacity-50">just now</span>
    </div>
  );
}