import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaQuestionCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaCog,
  FaQuestionCircle as FaFAQ,
  FaComments,
  FaExclamationTriangle,
  FaBook,
  FaChevronRight,
} from "react-icons/fa";

export default function HelpSupportFooter({ darkMode }) {
  const navigate = useNavigate();

  const contactInfo = {
    phone: "+91 484 123 4567",
    email: "support@casemanager.com",
    address: "Legal District, Kakkanad, Kochi, Kerala 682037"
  };

  const quickLinks = [
    { name: "Profile", icon: <FaUser />, path: "/profile" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
    { name: "FAQs", icon: <FaFAQ />, path: "/faqs" }
  ];

  const supportOptions = [
    { name: "Live Chat", icon: <FaComments />, action: () => alert("Live chat feature coming soon!") },
    { name: "Report Issue", icon: <FaExclamationTriangle />, action: () => alert("Issue reporting feature coming soon!") },
    { name: "Documentation", icon: <FaBook />, action: () => window.open("https://docs.casemanager.com", "_blank") }
  ];

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <footer
    id="help-support"
    className={`mx-8 mb-10 rounded-3xl shadow-2xl backdrop-blur-lg border transition-all duration-300 relative z-10 overflow-hidden ${
        darkMode 
        ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70" 
        : "bg-white/70 border-gray-200 hover:bg-white/90"
    }`}
    >

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
            <FaQuestionCircle className="text-blue-500 text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Help & Support
            </h3>
            <p className="text-gray-500 text-sm">We're here to help you succeed</p>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t mb-8 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Us Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className={`w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full`}></div>
              Contact Us
            </h4>
            <div className="space-y-4">
              <ContactItem
                icon={<FaPhone />}
                label="Phone"
                value={contactInfo.phone}
                href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                darkMode={darkMode}
              />
              <ContactItem
                icon={<FaEnvelope />}
                label="Email"
                value={contactInfo.email}
                href={`mailto:${contactInfo.email}`}
                darkMode={darkMode}
              />
              <ContactItem
                icon={<FaMapMarkerAlt />}
                label="Office"
                value={contactInfo.address}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className={`w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full`}></div>
              Quick Links
            </h4>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <LinkItem
                  key={index}
                  icon={link.icon}
                  name={link.name}
                  onClick={() => handleLinkClick(link.path)}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>

          {/* Support Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className={`w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full`}></div>
              Support
            </h4>
            <div className="space-y-3">
              {supportOptions.map((option, index) => (
                <LinkItem
                  key={index}
                  icon={option.icon}
                  name={option.name}
                  onClick={option.action}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 CaseManager. All rights reserved.
            </p>
            <div className="flex justify-center items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Contact Item Component
function ContactItem({ icon, label, value, href, darkMode }) {
  const content = (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-102 group ${
      darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/50'
    } ${href ? 'cursor-pointer' : ''}`}>
      <div className={`p-2 rounded-lg flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-blue-500">{icon}</div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <p className={`text-sm font-medium break-words ${href ? 'group-hover:text-blue-500 transition-colors' : ''}`}>
          {value}
        </p>
      </div>
      {href && (
        <FaChevronRight className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      )}
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
}

// Link Item Component
function LinkItem({ icon, name, onClick, darkMode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-102 group text-left ${
        darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/50'
      }`}
    >
      <div className={`p-2 rounded-lg flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-indigo-500">{icon}</div>
      </div>
      <span className="text-sm font-medium group-hover:text-blue-500 transition-colors flex-1">
        {name}
      </span>
      <FaChevronRight className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
    </button>
  );
}   