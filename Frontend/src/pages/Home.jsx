import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFolderOpen,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaPlus,
  FaClock,
  FaChevronRight,
  FaUser,
} from "react-icons/fa";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
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
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${
          darkMode ? 'bg-blue-900/20' : 'bg-blue-200/30'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full ${
          darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/30'
        } blur-3xl animate-pulse delay-1000`}></div>
      </div>

      {/* Header */}
      <header
        className={`${
          darkMode 
            ? "bg-gray-800/90 backdrop-blur-lg border-gray-700" 
            : "bg-white/90 backdrop-blur-lg border-gray-200"
        } shadow-xl px-8 py-6 flex justify-between items-center border-b relative z-10`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="text-3xl animate-bounce">⚖️</div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              CaseManager
            </h1>
            <p className="text-xs text-gray-500">Legal Case Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-500 font-medium">
            {formatTime(currentTime)}
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`text-xl p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:scale-110" 
                : "bg-gray-800/20 text-gray-600 hover:bg-gray-800/30 hover:scale-110"
            }`}
          >
            {darkMode ? <FaSun className="animate-spin" /> : <FaMoon />}
          </button>
          <div className="relative group">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="rounded-full w-12 h-12 border-2 border-blue-500 hover:scale-110 transition-transform cursor-pointer"
            />
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
          >
            <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" /> 
            Logout
          </button>
        </div>
      </header>

      {/* Welcome Banner */}
      <section className="px-8 py-16 text-center relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-xl"></div>
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
      <section className="px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
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
          icon={<FaBell />}
          title="Notifications"
          desc="Check important updates"
          onClick={() => navigate("/notifications")}
          darkMode={darkMode}
          index={2}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />
        <ActionCard
          icon={<FaCog />}
          title="Settings"
          desc="Customize your preferences"
          onClick={() => navigate("/settings")}
          darkMode={darkMode}
          index={3}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />
      </section>

      {/* Recent Cases */}
      <section
        className={`mx-8 my-8 p-8 rounded-3xl shadow-2xl backdrop-blur-lg border transition-all duration-300 relative z-10 ${
          darkMode 
            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70" 
            : "bg-white/70 border-gray-200 hover:bg-white/90"
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
          <h3 className="font-bold text-2xl">Recent Cases</h3>
          <div className="ml-auto">
            <span className={`text-sm px-3 py-1 rounded-full ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {cases.length} Total
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="ml-4 text-lg animate-pulse">Loading cases...</p>
          </div>
        ) : cases.length > 0 ? (
          <div className="space-y-4">
            {cases.slice(0, 4).map((c, i) => (
              <CaseCard
                key={c._id || i}
                case={c}
                darkMode={darkMode}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📁</div>
            <p className="text-lg text-gray-500">No recent cases found</p>
          </div>
        )}
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
          <h3 className="font-bold text-2xl">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          <ActivityItem text="Case #002 closed by Sarah" darkMode={darkMode} />
          <ActivityItem text="Case #003 status changed to Pending" darkMode={darkMode} />
          <ActivityItem text="Case #001 assigned to John" darkMode={darkMode} />
        </div>
      </section>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, darkMode, index, hoveredCard, setHoveredCard }) {
  const colors = ['blue', 'green', 'purple', 'orange'];
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
            ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'][index % 4]
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