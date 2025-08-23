import React, { useState } from 'react';
import axios from "axios"; // Make sure this is imported
import { Upload, X, FileText, Image, CheckCircle, AlertCircle } from 'lucide-react';

const Add_case = () => {
  const [formData, setFormData] = useState({
    caseTitle: '',
    caseDescription: '',
    caseType: '',
    clientName: '',
    opponentName: '',
    courtName: '',
    caseDate: '',
    caseStatus: ''
  });
  
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const caseTypes = ['Civil', 'Criminal', 'Corporate', 'Family', 'Other'];
  const caseStatuses = ['Pending', 'Ongoing', 'Closed'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.caseTitle.trim()) newErrors.caseTitle = 'Case title is required';
    if (!formData.caseDescription.trim()) newErrors.caseDescription = 'Case description is required';
    if (!formData.caseType) newErrors.caseType = 'Case type is required';
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.opponentName.trim()) newErrors.opponentName = 'Opponent name is required';
    if (!formData.courtName.trim()) newErrors.courtName = 'Court name is required';
    if (!formData.caseDate) newErrors.caseDate = 'Case date is required';
    if (!formData.caseStatus) newErrors.caseStatus = 'Case status is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.includes('pdf') || file.type.includes('image');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    
    const newFiles = validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (type) => {
    return type.includes('image') ? Image : FileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    const submitData = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Append files
    files.forEach(fileObj => {
      submitData.append('documents', fileObj.file);
    });

    // Send to backend API
    const res = await axios.post(
      "http://localhost:5000/api/cases/add", // Your backend endpoint
      submitData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.status === 201) {
      showToast('Case added successfully!', 'success');

      setTimeout(() => {
        window.location.href = '/cases'; // Or use navigate('/cases') if using React Router
      }, 2000);
    } else {
      showToast(res.data.message || 'Failed to add case', 'error');
    }

  } catch (error) {
    console.error("Error adding case:", error);
    showToast('Failed to add case. Please try again.', 'error');
  } finally {
    setIsSubmitting(false);
  }
};


  const handleCancel = () => {
    // window.location.href = '/cases'; // Replace with your routing solution
     window.location.href = '/home'
    console.log('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Case</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new case entry in the system</p>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {toast.message}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Two-column grid on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Title */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Case Title *
              </label>
              <input
                type="text"
                name="caseTitle"
                value={formData.caseTitle}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.caseTitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter case title"
              />
              {errors.caseTitle && <p className="text-red-500 text-sm mt-1">{errors.caseTitle}</p>}
            </div>

            {/* Case Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Case Type *
              </label>
              <select
                name="caseType"
                value={formData.caseType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.caseType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select case type</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.caseType && <p className="text-red-500 text-sm mt-1">{errors.caseType}</p>}
            </div>

            {/* Case Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Case Status *
              </label>
              <select
                name="caseStatus"
                value={formData.caseStatus}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.caseStatus ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select status</option>
                {caseStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.caseStatus && <p className="text-red-500 text-sm mt-1">{errors.caseStatus}</p>}
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.clientName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter client name"
              />
              {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
            </div>

            {/* Opponent Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Opponent Name *
              </label>
              <input
                type="text"
                name="opponentName"
                value={formData.opponentName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.opponentName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter opponent name"
              />
              {errors.opponentName && <p className="text-red-500 text-sm mt-1">{errors.opponentName}</p>}
            </div>

            {/* Court Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Court Name *
              </label>
              <input
                type="text"
                name="courtName"
                value={formData.courtName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.courtName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter court name"
              />
              {errors.courtName && <p className="text-red-500 text-sm mt-1">{errors.courtName}</p>}
            </div>

            {/* Case Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Case Date *
              </label>
              <input
                type="date"
                name="caseDate"
                value={formData.caseDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.caseDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.caseDate && <p className="text-red-500 text-sm mt-1">{errors.caseDate}</p>}
            </div>

            {/* Case Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Case Description *
              </label>
              <textarea
                name="caseDescription"
                value={formData.caseDescription}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.caseDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the case details..."
              />
              {errors.caseDescription && <p className="text-red-500 text-sm mt-1">{errors.caseDescription}</p>}
            </div>

            {/* File Upload */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                </label>
              </div>

              {/* File Preview */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map(fileObj => {
                    const FileIcon = getFileIcon(fileObj.type);
                    return (
                      <div key={fileObj.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{fileObj.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(fileObj.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(fileObj.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Adding Case...' : 'Add Case'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_case;