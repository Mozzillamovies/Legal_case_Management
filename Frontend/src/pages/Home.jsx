import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronRight,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Moon,
  Sun,
  Settings,
  Plus,
  Search,
  Bell
} from 'lucide-react';

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: FileText, label: 'Cases', href: '/cases' },
    { icon: Users, label: 'Notifications', href: '/notifications' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Confidential',
      description: 'Your legal data is protected with enterprise-grade security'
    },
    {
      icon: Users,
      title: 'Collaborative Workspace',
      description: 'Work seamlessly with your team on complex legal matters'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Accurate billable hour tracking and reporting tools'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-800
        transform transition-all duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-800 font-bold text-lg">📁</span>
            </div>
            <span className="font-bold text-xl text-white">CaseManager</span>
          </div>
          <button
            className="lg:hidden ml-auto p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Add New Case Button */}
        <div className="px-4 mb-6">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Case</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${item.active 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="px-4 mt-6">
          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-slate-600/50 rounded-lg">
                  {darkMode ? <Moon className="h-4 w-4 text-blue-400" /> : <Sun className="h-4 w-4 text-yellow-400" />}
                </div>
                <span className="text-slate-300 font-medium text-sm">
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`
                  relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out
                  ${darkMode ? 'bg-blue-600' : 'bg-slate-500'}
                `}
              >
                <span
                  className={`
                    inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                    ${darkMode ? 'translate-x-5' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button - Bottom */}
        <div className="absolute bottom-6 left-4 right-4">
          <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-700 transition-all duration-200">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Navbar */}
        <nav className="bg-slate-700 shadow-sm border-b border-slate-600 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Mobile menu button and search */}
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-600 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5 text-slate-300" />
                </button>
                <div className="lg:hidden flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-slate-800 font-bold text-sm">📁</span>
                  </div>
                  <span className="font-bold text-lg text-white">CaseManager</span>
                </div>

                {/* Search Bar */}
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search cases..."
                      className="block w-80 pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-600 placeholder-slate-400 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Right side - Settings and Profile */}
              <div className="flex items-center space-x-4">
                {/* Mobile Search Button */}
                <button className="md:hidden p-2 rounded-lg hover:bg-slate-600 transition-colors">
                  <Search className="h-5 w-5 text-slate-300" />
                </button>

                {/* Settings Button */}
                <button className="p-2 rounded-lg hover:bg-slate-600 transition-colors">
                  <Settings className="h-5 w-5 text-slate-300" />
                </button>

                {/* Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-600 transition-colors"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-600 py-2">
                      <a href="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                        View Profile
                      </a>
                      <a href="/settings" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                        Settings
                      </a>
                      <hr className="my-1 border-slate-600" />
                      <a href="/logout" className="block px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
                        Sign Out
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Hero Content */}
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Modern Legal
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {' '}Management
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Streamline your legal practice with our comprehensive case management system. 
                    Track cases, manage clients, and collaborate with your team efficiently.
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button className="group bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center">
                      View Cases
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-200">
                      Get Started
                    </button>
                  </div>
                </div>

                {/* Hero Visual */}
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-500">Case Dashboard</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gradient-to-r from-blue-200 to-blue-100 rounded-lg"></div>
                        <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-100 rounded-lg w-4/5"></div>
                        <div className="h-4 bg-gradient-to-r from-green-200 to-green-100 rounded-lg w-3/5"></div>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <div className="h-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg"></div>
                          <div className="h-12 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-20 blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl opacity-20 blur-xl"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose CaseManager?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Built specifically for legal professionals, our platform offers everything you need 
                  to manage your practice efficiently and securely.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Legal Practice?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of legal professionals who trust CaseManager to manage their cases, 
                clients, and workflows efficiently.
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                Start Free Trial
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;