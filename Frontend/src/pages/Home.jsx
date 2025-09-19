import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileMenu from "../components/ProfileMenu";
import HelpSupportFooter from '../components/Help';

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
  FaBell,
} from "react-icons/fa";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Dynamic notification count
  const navigate = useNavigate();

  // Load dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Save dark mode to localStorage and sync
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

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

  // Fetch cases and calculate notifications
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cases");
        setCases(res.data);
        
        // Calculate notifications based on upcoming hearings
        const now = new Date();
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(now.getDate() + 2);
        
        const upcomingHearings = res.data.filter(c => {
          if (c.clientDetails?.hearingDate) {
            const hearingDate = new Date(c.clientDetails.hearingDate);
            return hearingDate >= now && hearingDate <= twoDaysFromNow;
          }
          return false;
        });
        
        setUnreadNotifications(upcomingHearings.length);
      } catch (err) {
        console.error("Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  };

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

              {/* Enhanced Notification Button */}
              <button
                onClick={() => navigate("/notifications")}
                className={`relative p-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                  darkMode
                    ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 hover:from-indigo-500/30 hover:to-purple-500/30 shadow-lg shadow-indigo-500/20 border border-indigo-500/30"
                    : "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 hover:from-blue-500/30 hover:to-indigo-500/30 shadow-lg shadow-blue-500/20 border border-blue-500/30"
                } hover:scale-110 hover:-translate-y-1`}
              >
                <div className="relative z-10">
                  <FaBell className="text-xl group-hover:animate-pulse" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </div>
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
                      <ProfileMenu user={user} setUser={setUser} darkMode={darkMode} />
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

      {/* Enhanced Welcome Banner with Court Animation */}
      <section className="px-6 py-16 text-center relative z-10 overflow-hidden">
        {/* Soft Background Animation */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-12 left-12 text-6xl animate-bounce-slow">⚖️</div>
          <div className="absolute bottom-16 right-16 text-5xl animate-float">🏛️</div>
        </div>

        <div className="relative z-10">
          <div
            className={`relative rounded-3xl p-10 shadow-xl backdrop-blur-lg border transition-all duration-500 ${
              darkMode
                ? "bg-gradient-to-br from-gray-900/80 via-indigo-900/50 to-purple-900/60 border-gray-700/50 text-white"
                : "bg-gradient-to-br from-white/90 via-blue-50/80 to-indigo-100/70 border-blue-200/50 text-gray-900"
            }`}
          >
            {/* Gavel + Title */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="text-6xl animate-gavel-swing">🔨</div>
                <div className="absolute -bottom-2 -right-3 text-2xl animate-pulse">⚖️</div>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Justice In Session
                </span>
              </h2>
            </div>

            {/* Welcome Text */}
            <div className="text-lg sm:text-xl mb-3 animate-fade-in-up">
              Welcome Back, {user?.name || "Counselor"} 👨‍⚖️
            </div>
            <p className="text-base sm:text-lg opacity-90 animate-fade-in-up delay-200 max-w-xl mx-auto leading-relaxed">
              Your legal command center is ready. Manage cases with precision and modern efficiency.
            </p>

            {/* Quote */}
            <div
              className={`mt-8 p-4 rounded-lg italic text-base sm:text-lg animate-fade-in-up delay-500 ${
                darkMode
                  ? "bg-gray-800/50 border border-gray-600/30"
                  : "bg-white/70 border border-blue-200/50"
              }`}
            >
              <span className="text-blue-500 text-xl">"</span>
              Justice delayed is justice denied
              <span className="text-blue-500 text-xl">"</span>
              <div className="text-xs mt-2 opacity-70">- William E. Gladstone</div>
            </div>

            {/* Status Dots */}
            <div className="flex justify-center mt-8 gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
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
          desc="Check updates and alerts"
          onClick={() => navigate("/notifications")}
          darkMode={darkMode}
          index={2}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          badge={unreadNotifications}
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

      <HelpSupportFooter darkMode={darkMode} />

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes courthouse-entrance {
          0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
          50% { transform: translateY(-10px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        @keyframes gavel-strike {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-15deg) translateY(-5px); }
          50% { transform: rotate(15deg) translateY(-3px); }
          75% { transform: rotate(-10deg) translateY(-2px); }
        }
        
        @keyframes justice-scale {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }
        
        @keyframes court-title {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pillar-rise {
          0% { height: 0; opacity: 0; }
          100% { height: 80px; opacity: 0.3; }
        }
        
        @keyframes pillar-rise-delayed {
          0% { height: 0; opacity: 0; }
          100% { height: 80px; opacity: 0.3; }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes sparkle-delayed {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float-document {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes float-document-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }
        
        @keyframes success-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        
        .animate-courthouse-entrance { animation: courthouse-entrance 2s ease-out; }
        .animate-gavel-strike { animation: gavel-strike 2s ease-in-out infinite; }
        .animate-justice-scale { animation: justice-scale 3s ease-in-out infinite; }
        .animate-court-title { animation: court-title 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-pillar-rise { animation: pillar-rise 1.5s ease-out; }
        .animate-pillar-rise-delayed { animation: pillar-rise-delayed 1.5s ease-out 0.3s; }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
        .animate-sparkle-delayed { animation: sparkle-delayed 2s ease-in-out infinite 0.5s; }
        .animate-float-document { animation: float-document 4s ease-in-out infinite; }
        .animate-float-document-delayed { animation: float-document-delayed 4s ease-in-out infinite 1s; }
        .animate-success-pulse { animation: success-pulse 2s ease-in-out infinite; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, darkMode, index, hoveredCard, setHoveredCard, badge }) {
  const colors = ['blue', 'green', 'purple', 'indigo'];
  const color = colors[index];
  const isHovered = hoveredCard === index;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
      className={`cursor-pointer p-8 rounded-3xl shadow-xl backdrop-blur-lg border transition-all duration-500 transform group relative ${
        darkMode 
          ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70" 
          : "bg-white/70 border-gray-200 hover:bg-white/90"
      } ${isHovered ? 'scale-105 -translate-y-2' : 'hover:scale-105 hover:-translate-y-2'}`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex flex-col items-center text-center relative">
        <div className={`text-${color}-500 text-4xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 relative`}>
          {icon}
          {badge && badge > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              {badge > 9 ? '9+' : badge}
            </div>
          )}
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