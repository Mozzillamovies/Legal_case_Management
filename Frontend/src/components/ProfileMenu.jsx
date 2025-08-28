import React, { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear tokens / session
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

  const avatarUrl = user?.profileImage 
    ? user.profileImage 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email)}`;

  return (
    <div className="relative" ref={menuRef}>
      <img
        src={avatarUrl}
        alt="Profile"
        className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer hover:scale-105 transition"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl p-3 animate-fadeIn">
          <div className="px-3 py-2 border-b">
            <p className="font-semibold">{user?.name || "User"}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <ul className="mt-2 space-y-2">
            <li
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <User size={18} /> Profile
            </li>
            <li
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <Settings size={18} /> Settings
            </li>
            <li
              onClick={() => navigate("/help")}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <HelpCircle size={18} /> Help & Support
            </li>
            <li
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
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
