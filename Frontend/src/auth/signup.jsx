import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Scale, Mail, Lock, User, Check, X, Moon, Sun } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const CompactLegalAuthUI = ({ mode, setIsAuthenticated }) =>{
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 8 characters';
    if (!isLogin && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    try {
      setIsLoading(true);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true); // ✅ triggers redirect in App.jsx
    } else {
      throw new Error("No token received from server");
    }
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  const InputField = ({ icon: Icon, type, placeholder, field, showToggle = false, toggleState = false, onToggle }) => (
    <div>
      <div className={`relative border-2 rounded-xl transition-all ${
        errors[field] ? 'border-red-400' : 
        formData[field] && (
          (field === 'email' && validateEmail(formData[field])) ||
          (field === 'password' && validatePassword(formData[field])) ||
          (field === 'confirmPassword' && formData.password === formData.confirmPassword) ||
          (field === 'fullName' && formData[field].trim().length > 0)
        ) ? 'border-green-400' : 
        isDarkMode ? 'border-gray-600 focus-within:border-blue-400 bg-gray-700' : 'border-gray-200 focus-within:border-blue-400'
      }`}>
        <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full pl-12 pr-${showToggle ? '12' : '4'} py-3 bg-transparent outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-400'}`}
          placeholder={placeholder}
          required={!isLogin || field !== 'fullName'}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
            {toggleState ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {errors[field] && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <X className="w-4 h-4 mr-1" />
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'} flex items-center justify-center p-4`}>
      
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-4 right-4 p-2 rounded-full shadow-lg transition-all hover:scale-110 ${isDarkMode ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-4xl mx-auto">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800 shadow-black/50' : 'bg-white shadow-gray-300/50'}`}>
          <div className="flex flex-col lg:flex-row min-h-[500px]">
            
            {/* Left Side - Branding */}
            <div className={`lg:w-1/2 p-8 text-white relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-blue-800 via-indigo-800 to-purple-800' : 'bg-gradient-to-br from-blue-900 via-blue-800 to-slate-800'}`}>
              <div className="relative z-10 h-full flex flex-col justify-center">
                {/* Logo */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl mr-4 bg-white bg-opacity-20">
                      <Scale className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">CasePro</h1>
                      <p className="text-blue-200">Your Legal Workflow Partner</p>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div>
                  <h2 className="text-3xl font-bold mb-4 leading-tight">Professional Legal Case Management</h2>
                  <p className="text-blue-100 mb-6">Streamline your legal practice with our comprehensive case management system. Secure, efficient, and designed for legal professionals.</p>
                  
                  {/* Features */}
                  <div className="space-y-2">
                    {['Secure client data management', 'Case tracking & deadlines', 'Document organization', 'Team collaboration tools'].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="bg-green-500 p-1 rounded-full mr-3">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-blue-50">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 right-8 w-20 h-20 border border-white rounded-full animate-pulse"></div>
                <div className="absolute bottom-16 left-8 w-16 h-16 border border-white rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className={`lg:w-1/2 p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Form Toggle */}
              <div className={`flex rounded-xl p-1 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  onClick={() => !isLogin && toggleMode()}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${isLogin ? isDarkMode ? 'bg-gray-600 text-white shadow-md' : 'bg-white text-blue-900 shadow-md' : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => isLogin && toggleMode()}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${!isLogin ? isDarkMode ? 'bg-gray-600 text-white shadow-md' : 'bg-white text-blue-900 shadow-md' : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Header */}
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {isLogin ? 'Sign in to your legal dashboard' : 'Join thousands of legal professionals'}
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {!isLogin && (
                  <div>
                    <div className={`relative border-2 rounded-xl transition-all ${
                      errors.fullName ? 'border-red-400' : 
                      formData.fullName && formData.fullName.trim().length > 0 ? 'border-green-400' : 
                      isDarkMode ? 'border-gray-600 focus-within:border-blue-400 bg-gray-700' : 'border-gray-200 focus-within:border-blue-400'
                    }`}>
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 bg-transparent outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-400'}`}
                        placeholder="Full Name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                )}
                
                <div>
                  <div className={`relative border-2 rounded-xl transition-all ${
                    errors.email ? 'border-red-400' : 
                    formData.email && validateEmail(formData.email) ? 'border-green-400' : 
                    isDarkMode ? 'border-gray-600 focus-within:border-blue-400 bg-gray-700' : 'border-gray-200 focus-within:border-blue-400'
                  }`}>
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-transparent outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-400'}`}
                      placeholder="Email Address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className={`relative border-2 rounded-xl transition-all ${
                    errors.password ? 'border-red-400' : 
                    formData.password && validatePassword(formData.password) ? 'border-green-400' : 
                    isDarkMode ? 'border-gray-600 focus-within:border-blue-400 bg-gray-700' : 'border-gray-200 focus-within:border-blue-400'
                  }`}>
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 bg-transparent outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-400'}`}
                      placeholder="Password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
                
                {!isLogin && (
                  <div>
                    <div className={`relative border-2 rounded-xl transition-all ${
                      errors.confirmPassword ? 'border-red-400' : 
                      formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-400' : 
                      isDarkMode ? 'border-gray-600 focus-within:border-blue-400 bg-gray-700' : 'border-gray-200 focus-within:border-blue-400'
                    }`}>
                      <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full pl-12 pr-12 py-3 bg-transparent outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-400'}`}
                        placeholder="Confirm Password"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <X className="w-4 h-4 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded mr-3 transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : isDarkMode ? 'border-gray-400' : 'border-gray-300'}`}>
                        {rememberMe && <Check className="w-3 h-3 text-white m-0.5" />}
                      </div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Remember me</span>
                    </label>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>

                {/* Terms for Signup */}
                {!isLogin && (
                  <p className={`text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    By creating an account, you agree to our{' '}
                    <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Privacy Policy</button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactLegalAuthUI;