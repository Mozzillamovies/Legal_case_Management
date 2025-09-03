import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit3, CheckCircle } from 'lucide-react';

const AddCase = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Add Case
    district: '',
    taluk: '',
    court: '',
    caseType: '',
    caseNumber: '',
    subject: '',
    description: '',

    // Step 2: Client Details
    clientName: '',
    phone: '',
    address: '',
    idProofType: '',
    idProofNumber: '',
    hearingDate: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Add Case', icon: '📋' },
    { id: 2, title: 'Client Details', icon: '👤' },
    { id: 3, title: 'Review & Submit', icon: '✅' }
  ];

  // Mock data for dropdowns
  const taluksByDistrict = {
    Thiruvananthapuram: ['Neyyattinkara', 'Kattakada', 'Nedumangad', 'Chirayinkeezhu', 'Varkala'],
    Kollam: ['Kollam', 'Kunnathur', 'Karunagappally', 'Pathanapuram'],
    Pathanamthitta: ['Adoor', 'Kozhencherry', 'Ranni', 'Konni', 'Mallappally'],
    Alappuzha: ['Ambalappuzha', 'Kuttanad', 'Chengannur', 'Mavelikkara'],
    Kottayam: ['Kottayam', 'Vaikom', 'Changanassery', 'Meenachil'],
    Idukki: ['Idukki', 'Devikulam', 'Peerumade', 'Udumbanchola', 'Thodupuzha'],
    Ernakulam: ['Kochi', 'Paravur', 'Muvattupuzha', 'Kunnathunad', 'Kanayannur'],
    Thrissur: ['Thrissur', 'Chalakudy', 'Kunnamkulam', 'Mukundapuram'],
    Palakkad: ['Palakkad', 'Alathur', 'Chittur', 'Mannarkkad', 'Ottappalam','Pattambi'],
    Malappuram: ['Perinthalmanna', 'Ponnani', 'Eranad', 'Tirur', 'Nilambur'],
    Kozhikode: ['Kozhikode', 'Vadakara', 'Koyilandy'],
    Wayanad: ['Vythiri', 'Sulthan Bathery', 'Mananthavady'],
    Kannur: ['Kannur', 'Thalassery', 'Payyanur', 'Iritty'],
    Kasaragod: ['Hosdurg', 'Vellarikundu', 'Kasaragod', 'Manjeshwaram'],
  };

  const courtsByTaluk = {
    Pattambi: [
      'Munsiff Magistrate Court, Pattambi',
      'Judicial First Class Magistrate Court, Pattambi',
      'Fast Track Special Court, Pattambi',
    ],
    Ottappalam: [
      'Munsiff Court, Ottappalam',
      'Judicial First Class Magistrate Court, Ottappalam',
    ],
    Palakkad: [
      'District Court, Palakkad',
      'Family Court, Palakkad',
      'Magistrate Court, Palakkad',
    ],
    Mannarkkad: [
      'Munsiff Court, Mannarkkad',
      'Judicial First Class Magistrate Court, Mannarkkad',
    ],
    Alathur: [
      'Munsiff Court, Alathur',
      'Judicial First Class Magistrate Court, Alathur',
    ],
    Chittur: [
      'Munsiff Court, Chittur',
      'Judicial First Class Magistrate Court, Chittur',
      'Additional Sub Court, Chittur',
    ],
  };

  const idProofTypes = ['Aadhar Card', 'PAN Card', 'Passport', 'Driving License', 'Voter ID'];

  // Input sanitization helper
  const sanitizeInput = (value) => {
    if (typeof value !== 'string') return value;
    return value.trim().replace(/[<>]/g, '');
  };

  const updateFormData = (field, value) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.taluk) newErrors.taluk = 'Taluk is required';
        if (!formData.court) newErrors.court = 'Court is required';
        if (!formData.caseType) newErrors.caseType = 'Case Type is required';
        if (!formData.caseNumber) newErrors.caseNumber = 'Case Number is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        break;
      case 2:
        if (!formData.clientName) newErrors.clientName = 'Client Name is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.idProofType) newErrors.idProofType = 'ID Proof Type is required';
        // Enhanced ID proof validation
        if (formData.idProofType && formData.idProofNumber) {
          const idNumber = formData.idProofNumber.replace(/\s+/g, '');
          switch (formData.idProofType) {
            case 'Aadhar Card':
              if (!/^\d{12}$/.test(idNumber)) {
                newErrors.idProofNumber = 'Aadhar number must be 12 digits';
              }
              break;
            case 'PAN Card':
              if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(idNumber.toUpperCase())) {
                newErrors.idProofNumber = 'PAN format: ABCDE1234F';
              }
              break;
            default:
              if (idNumber.length < 3) {
                newErrors.idProofNumber = 'ID proof number too short';
              }
          }
        }
        if (!formData.hearingDate) newErrors.hearingDate = 'Hearing Date is required';
        
        // Validate hearing date is not in the past
        if (formData.hearingDate) {
          const today = new Date();
          const hearingDate = new Date(formData.hearingDate);
          today.setHours(0, 0, 0, 0);
          if (hearingDate < today) {
            newErrors.hearingDate = 'Hearing date cannot be in the past';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const resetForm = () => {
    setFormData({
      district: '',
      taluk: '',
      court: '',
      caseType: '',
      caseNumber: '',
      subject: '',
      description: '',
      clientName: '',
      phone: '',
      address: '',
      idProofType: '',
      idProofNumber: '',
      hearingDate: '',
    });
    setErrors({});
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate all steps before submission
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - replace with actual API endpoint
      // Add client reference number for tracking
      const clientRefNumber = `CL${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const submitData = {
        // Add reference number
        referenceNumber: `CASE${Date.now()}`,
        clientReferenceNumber: clientRefNumber,
        
        // Court hierarchy
        district: formData.district,
        taluk: formData.taluk,
        court: formData.court,

        // Case info
        caseType: formData.caseType,
        caseNumber: formData.caseNumber,
        subject: formData.subject,
        description: formData.description || '',

        // Client info
        clientDetails: {
          clientName: formData.clientName,
          phone: formData.phone.replace(/\D/g, ''), // Store only digits
          idProofType: formData.idProofType,
          idProofNumber: formData.idProofNumber.replace(/\s+/g, ''), // Remove spaces
          address: formData.address,
          hearingDate: formData.hearingDate,
          referenceNumber: clientRefNumber
        },

        // Metadata
        submittedAt: new Date().toISOString(),
        status: 'pending',
        priority: 'normal'
      };

      // Actual API call - uncomment and modify endpoint as needed
      const response = await fetch("http://localhost:5000/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Submitted successfully:", result);
      
      // For testing without backend - comment out the above and use this:
      // console.log("Submitting case data:", submitData);
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success screen
      setIsSubmitted(true);

    } catch (err) {
      console.error("❌ Submission failed:", err);
      setErrors({ 
        submit: "Failed to submit case. Please check your connection and try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md w-full">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Successfully Submitted!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your case has been submitted and will be reviewed shortly.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-left">
            <p className="text-sm text-gray-600 dark:text-gray-300">Case Details:</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {formData.caseNumber} - {formData.subject}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Client: {formData.clientName}
            </p>
          </div>

          <button
            onClick={resetForm}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors w-full"
          >
            Add Another Case
          </button>
        </div>
      </div>
    </div>
  );
  }

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-colors ${
              currentStep >= step.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onClick={() => step.id < currentStep && goToStep(step.id)}
          >
            <span className="text-sm font-semibold">{step.id}</span>
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep >= step.id ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'
          }`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${
              currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Add Case</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">District *</label>
          <select
            value={formData.district}
            onChange={(e) => {
              updateFormData('district', e.target.value);
              updateFormData('taluk', '');
              updateFormData('court', '');
            }}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.district ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select District</option>
            {Object.keys(taluksByDistrict).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
        </div>

        {/* Taluk */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Taluk *</label>
          <select
            value={formData.taluk}
            onChange={(e) => {
              updateFormData('taluk', e.target.value);
              updateFormData('court', '');
            }}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.taluk ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={!formData.district}
          >
            <option value="">Select Taluk</option>
            {(taluksByDistrict[formData.district] || []).map((taluk) => (
              <option key={taluk} value={taluk}>
                {taluk}
              </option>
            ))}
          </select>
          {errors.taluk && <p className="text-red-500 text-sm mt-1">{errors.taluk}</p>}
        </div>

        {/* Court */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Court *</label>
          <select
            value={formData.court}
            onChange={(e) => updateFormData('court', e.target.value)}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.court ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={!formData.taluk}
          >
            <option value="">Select Court</option>
            {(courtsByTaluk[formData.taluk] || []).map((court) => (
              <option key={court} value={court}>
                {court}
              </option>
            ))}
          </select>
          {errors.court && <p className="text-red-500 text-sm mt-1">{errors.court}</p>}
        </div>

        {/* Case Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Case Type *</label>
          <input
            type="text"
            value={formData.caseType}
            onChange={(e) => updateFormData('caseType', e.target.value)}
            placeholder="e.g., Civil, Criminal, Family"
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.caseType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.caseType && <p className="text-red-500 text-sm mt-1">{errors.caseType}</p>}
        </div>

        {/* Case Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Case Number *</label>
          <input
            type="text"
            value={formData.caseNumber}
            onChange={(e) => updateFormData('caseNumber', e.target.value)}
            placeholder="e.g., CC 123/2024"
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.caseNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.caseNumber && <p className="text-red-500 text-sm mt-1">{errors.caseNumber}</p>}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => updateFormData('subject', e.target.value)}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Brief case subject"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Detailed case description (optional)"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Client Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => updateFormData('clientName', e.target.value)}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.clientName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Full name of the client"
          />
          {errors.clientName && (
            <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="10-digit mobile number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID Proof Type *
          </label>
          <select
            value={formData.idProofType}
            onChange={(e) => updateFormData('idProofType', e.target.value)}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.idProofType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select ID Proof Type</option>
            {idProofTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.idProofType && (
            <p className="text-red-500 text-sm mt-1">{errors.idProofType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID Proof Number *
          </label>
          <input
            type="text"
            value={formData.idProofNumber}
            onChange={(e) => updateFormData('idProofNumber', e.target.value)}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.idProofNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter ID proof number"
          />
          {errors.idProofNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.idProofNumber}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hearing Date *
          </label>
          <input
            type="date"
            value={formData.hearingDate}
            onChange={(e) => updateFormData('hearingDate', e.target.value)}
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.hearingDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.hearingDate && (
            <p className="text-red-500 text-sm mt-1">{errors.hearingDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address *
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          rows={3}
          className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Complete residential address"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Review & Submit</h2>
      
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-400 text-sm">{errors.submit}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Case Details</h3>
            <button
              onClick={() => goToStep(1)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors"
              title="Edit case details"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600 dark:text-gray-400">District:</span> <span className="text-gray-900 dark:text-gray-100">{formData.district}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Taluk:</span> <span className="text-gray-900 dark:text-gray-100">{formData.taluk}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Court:</span> <span className="text-gray-900 dark:text-gray-100">{formData.court}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Case Type:</span> <span className="text-gray-900 dark:text-gray-100">{formData.caseType}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Case Number:</span> <span className="text-gray-900 dark:text-gray-100">{formData.caseNumber}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Subject:</span> <span className="text-gray-900 dark:text-gray-100">{formData.subject}</span></p>
            {formData.description && <p><span className="font-medium text-gray-600 dark:text-gray-400">Description:</span> <span className="text-gray-900 dark:text-gray-100">{formData.description}</span></p>}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Client Details</h3>
            <button
              onClick={() => goToStep(2)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors"
              title="Edit client details"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Name:</span> <span className="text-gray-900 dark:text-gray-100">{formData.clientName}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span> <span className="text-gray-900 dark:text-gray-100">{formData.phone}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Address:</span> <span className="text-gray-900 dark:text-gray-100">{formData.address}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">ID Proof:</span> <span className="text-gray-900 dark:text-gray-100">{formData.idProofType} - {formData.idProofNumber}</span></p>
            <p><span className="font-medium text-gray-600 dark:text-gray-400">Hearing Date:</span> <span className="text-gray-900 dark:text-gray-100">{new Date(formData.hearingDate).toLocaleDateString()}</span></p>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Case</span>
          )}
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {renderProgressIndicator()}
          
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </button>

            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCase;