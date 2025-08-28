import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, X, Edit3, CheckCircle } from 'lucide-react';
import axios from "axios";

const AddCase = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Add Case
    court: '',
    district: '',
    caseType: '',
    subject: '',
    description: '',
    
    // Step 2: Client Details
    clientName: '',
    email: '',
    phone: '',
    address: '',
    idProofType: '',
    idProofNumber: '',
    
    // Step 3: Act & Section
    selectedAct: '',
    selectedSection: '',
    actsSections: [],
    
    // Step 4: Upload Documents
    documentType: '',
    documentTitle: '',
    documentDescription: '',
    documents: []
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Add Case', icon: '📋' },
    { id: 2, title: 'Client Details', icon: '👤' },
    { id: 3, title: 'Act & Section', icon: '📖' },
    { id: 4, title: 'Upload Documents', icon: '📎' },
    { id: 5, title: 'Review & Submit', icon: '✅' }
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

  const caseTypes = ['Civil', 'Criminal', 'Family', 'Commercial', 'Constitutional', 'Tax'];
  const idProofTypes = ['Aadhar Card', 'PAN Card', 'Passport', 'Driving License', 'Voter ID'];
  const acts = ['Indian Penal Code', 'Code of Civil Procedure', 'Indian Evidence Act', 'Contract Act', 'Companies Act'];
  const sections = ['Section 420', 'Section 498A', 'Section 138', 'Section 302', 'Section 406', 'Section 120B'];
  const documentTypes = ['Petition', 'Affidavit', 'Notice', 'Application', 'Evidence', 'Agreement'];

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        if (!formData.court) newErrors.court = 'Court is required';
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.caseType) newErrors.caseType = 'Case Type is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        break;
      case 2:
        if (!formData.clientName) newErrors.clientName = 'Client Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.idProofType) newErrors.idProofType = 'ID Proof Type is required';
        if (!formData.idProofNumber) newErrors.idProofNumber = 'ID Proof Number is required';
        break;
      case 3:
        if (formData.actsSections.length === 0) newErrors.actsSections = 'At least one Act & Section is required';
        break;
      case 4:
        if (formData.documents.length === 0) newErrors.documents = 'At least one document is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const addActSection = () => {
    if (formData.selectedAct && formData.selectedSection) {
      const newActSection = {
        id: Date.now(),
        act: formData.selectedAct,
        section: formData.selectedSection
      };
      updateFormData('actsSections', [...formData.actsSections, newActSection]);
      updateFormData('selectedAct', '');
      updateFormData('selectedSection', '');
    }
  };

  const removeActSection = (id) => {
    updateFormData('actsSections', formData.actsSections.filter(item => item.id !== id));
  };
    const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && formData.documentType && formData.documentTitle) {
      const newDocument = {
        id: Date.now(),
        type: formData.documentType,
        title: formData.documentTitle,
        description: formData.documentDescription,
        file: file,
        fileName: file.name
      };
      updateFormData('documents', [...formData.documents, newDocument]);
      updateFormData('documentType', '');
      updateFormData('documentTitle', '');
      updateFormData('documentDescription', '');
    }
  };

const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  try {
    const data = new FormData();

    // Court hierarchy
    data.append("district", formData.district);
    data.append("taluk", formData.taluk);   // ✅ new field
    data.append("court", formData.court);

    // Case info
    data.append("caseType", formData.caseType);
    data.append("subject", formData.subject);
    data.append("description", formData.description);

    // Client info
    data.append("name", formData.clientName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("idProofType", formData.idProofType);
    data.append("idProofNumber", formData.idProofNumber);

    // Acts & Sections
    data.append("actsSections", JSON.stringify(formData.actsSections));

    // Documents (if any)
    formData.documents.forEach((doc) => {
      if (doc.file) {
        data.append("documents", doc.file);   // 🔥 SAME field name for all
        data.append("docTypes[]", doc.type);
        data.append("docTitles[]", doc.title);
        data.append("docDescs[]", doc.description);
      }
    });



    const res = await axios.post("http://localhost:5000/api/cases", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Submitted:", res.data);

    // 👉 Show success screen
    setIsSubmitted(true);
    setCurrentStep(1); // reset wizard if needed

  } catch (err) {
    console.error("❌ Submission failed:", err.response?.data || err);
  }
};


if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Submitted!</h2>
          <p className="text-gray-600 mb-6">Your case has been submitted and will be reviewed shortly.</p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              setFormData({
                court: '', district: '', caseType: '', subject: '', description: '',
                clientName: '', email: '', phone: '', address: '', idProofType: '', idProofNumber: '',
                selectedAct: '', selectedSection: '', actsSections: [],
                documentType: '', documentTitle: '', documentDescription: '', documents: []
              });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Another Case
          </button>
        </div>
      </div>
    );
  }


  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 text-gray-400'
            }`}
          >
            <span className="text-sm font-semibold">{step.id}</span>
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${
              currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

const renderStep1 = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Case</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
        <select
          value={formData.district}
          onChange={(e) => {
            updateFormData('district', e.target.value);
            updateFormData('taluk', '');
            updateFormData('court', '');
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.district ? 'border-red-500' : 'border-gray-300'
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Taluk *</label>
        <select
          value={formData.taluk}
          onChange={(e) => {
            updateFormData('taluk', e.target.value);
            updateFormData('court', '');
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.taluk ? 'border-red-500' : 'border-gray-300'
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Court *</label>
        <select
          value={formData.court}
          onChange={(e) => updateFormData('court', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.court ? 'border-red-500' : 'border-gray-300'
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Case Type *</label>
        <select
          value={formData.caseType}
          onChange={(e) => updateFormData('caseType', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.caseType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Case Type</option>
          {caseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.caseType && <p className="text-red-500 text-sm mt-1">{errors.caseType}</p>}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => updateFormData('subject', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.subject ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter case subject"
        />
        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
      </div>
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
      <textarea
        value={formData.description}
        onChange={(e) => updateFormData('description', e.target.value)}
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter case description (optional)"
      />
    </div>
  </div>
);


  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => updateFormData('clientName', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.clientName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter client name"
          />
          {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof Type *</label>
          <select
            value={formData.idProofType}
            onChange={(e) => updateFormData('idProofType', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.idProofType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select ID Proof Type</option>
            {idProofTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.idProofType && <p className="text-red-500 text-sm mt-1">{errors.idProofType}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
        <textarea
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          rows={3}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter complete address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof Number *</label>
        <input
          type="text"
          value={formData.idProofNumber}
          onChange={(e) => updateFormData('idProofNumber', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.idProofNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter ID proof number"
        />
        {errors.idProofNumber && <p className="text-red-500 text-sm mt-1">{errors.idProofNumber}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Act & Section</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Act</label>
            <select
              value={formData.selectedAct}
              onChange={(e) => updateFormData('selectedAct', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Act</option>
              {acts.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              value={formData.selectedSection}
              onChange={(e) => updateFormData('selectedSection', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Section</option>
              {sections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          <button
            onClick={addActSection}
            disabled={!formData.selectedAct || !formData.selectedSection}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add Act & Section
          </button>
          
          {errors.actsSections && <p className="text-red-500 text-sm">{errors.actsSections}</p>}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Added Acts & Sections</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {formData.actsSections.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.act}</p>
                  <p className="text-sm text-gray-600">{item.section}</p>
                </div>
                <button
                  onClick={() => removeActSection(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.actsSections.length === 0 && (
              <p className="text-gray-500 text-center py-8">No acts & sections added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select
              value={formData.documentType}
              onChange={(e) => updateFormData('documentType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Document Type</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
            <input
              type="text"
              value={formData.documentTitle}
              onChange={(e) => updateFormData('documentTitle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter document title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Description</label>
            <textarea
              value={formData.documentDescription}
              onChange={(e) => updateFormData('documentDescription', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter document description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={!formData.documentType || !formData.documentTitle}
                      />
                    </label>
                  </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>
          
          {errors.documents && <p className="text-red-500 text-sm">{errors.documents}</p>}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {formData.documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{doc.title}</p>
                  <p className="text-sm text-gray-600">{doc.type}</p>
                  <p className="text-xs text-gray-500">{doc.fileName}</p>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.documents.length === 0 && (
              <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Case Details</h3>
            <button
              onClick={() => goToStep(1)}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Court:</span> {formData.court}</p>
            <p><span className="font-medium">District:</span> {formData.district}</p>
            <p><span className="font-medium">Case Type:</span> {formData.caseType}</p>
            <p><span className="font-medium">Subject:</span> {formData.subject}</p>
            {formData.description && <p><span className="font-medium">Description:</span> {formData.description}</p>}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Client Details</h3>
            <button
              onClick={() => goToStep(2)}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {formData.clientName}</p>
            <p><span className="font-medium">Email:</span> {formData.email}</p>
            <p><span className="font-medium">Phone:</span> {formData.phone}</p>
            <p><span className="font-medium">Address:</span> {formData.address}</p>
            <p><span className="font-medium">ID Proof:</span> {formData.idProofType} - {formData.idProofNumber}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Acts & Sections</h3>
            <button
              onClick={() => goToStep(3)}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {formData.actsSections.map(item => (
              <p key={item.id}><span className="font-medium">{item.act}:</span> {item.section}</p>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Documents</h3>
            <button
              onClick={() => goToStep(4)}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {formData.documents.map(doc => (
              <p key={doc.id}><span className="font-medium">{doc.type}:</span> {doc.title}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
        >
          Submit Case
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderProgressIndicator()}
          
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </button>

            {currentStep < 5 && (
              <button
                onClick={nextStep}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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