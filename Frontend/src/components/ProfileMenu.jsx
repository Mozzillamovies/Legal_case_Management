import React, { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User, HelpCircle, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

const ProfileMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const menuRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const avatarUrl = user?.profileImage
    ? user.profileImage
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || user?.email
      )}`;

  return (
    <div className="relative" ref={menuRef}>
      <img
        src={avatarUrl}
        alt="Profile"
        className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer hover:scale-105 transition"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 animate-fadeIn">
          <div className="px-3 py-2 border-b dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
          <ul className="mt-2 space-y-2">
            <li
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200"
            >
              <User size={18} /> Profile
            </li>
            <li
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200"
            >
              <Settings size={18} /> Settings
            </li>
            <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-700 dark:text-gray-200">
              <Link
                to="help-support"
                smooth={true}
                duration={600}
                className="flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle size={18} /> Help & Support
              </Link>
            </li>

            <li
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg cursor-pointer"
            >
              <LogOut size={18} /> Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
