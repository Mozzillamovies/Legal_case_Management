import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Eye, Download, Calendar, AlertCircle, CheckCircle, Clock, ChevronDown, X, FileText } from 'lucide-react';

const Alert = ({ children, type = "info" }) => {
  const color =
    type === "error" ? "bg-red-100 text-red-800 border-red-300" :
    type === "success" ? "bg-green-100 text-green-800 border-green-300" :
    "bg-blue-100 text-blue-800 border-blue-300";

  return (
    <div className={`border p-3 rounded-md ${color}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => (
  <p className="text-sm">{children}</p>
);

// Mock data for demonstration (replace with actual API call)
const mockCases = [
  {
    id: 1,
    title: "Smith vs. Johnson Contract Dispute",
    description: "Legal dispute regarding breach of contract terms and conditions in commercial agreement between parties...",
    type: "Commercial Law",
    status: "In Progress",
    priority: "High",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    documents: [
      { id: 1, name: "Contract Agreement.pdf", type: "pdf", size: "2.3 MB" },
      { id: 2, name: "Evidence Photos.zip", type: "zip", size: "15.7 MB" },
      { id: 3, name: "Witness Statements.docx", type: "docx", size: "1.2 MB" }
    ]
  },
  {
    id: 2,
    title: "Property Rights Case",
    description: "Residential property boundary dispute involving neighboring landowners and zoning regulations...",
    type: "Property Law",
    status: "Open",
    priority: "Medium",
    startDate: "2024-02-10",
    endDate: "2024-08-15",
    documents: [
      { id: 4, name: "Property Survey.pdf", type: "pdf", size: "5.1 MB" },
      { id: 5, name: "Legal Correspondence.pdf", type: "pdf", size: "890 KB" }
    ]
  },
  {
    id: 3,
    title: "Employment Termination Appeal",
    description: "Wrongful termination case involving discrimination claims and employment contract violations...",
    type: "Employment Law",
    status: "Closed",
    priority: "Low",
    startDate: "2023-11-20",
    endDate: "2024-01-30",
    documents: [
      { id: 6, name: "Employment Contract.pdf", type: "pdf", size: "1.8 MB" },
      { id: 7, name: "HR Records.xlsx", type: "xlsx", size: "3.2 MB" },
      { id: 8, name: "Settlement Agreement.pdf", type: "pdf", size: "980 KB" }
    ]
  },
  {
    id: 4,
    title: "Corporate Merger Review",
    description: "Legal review and due diligence for corporate acquisition including regulatory compliance assessment...",
    type: "Corporate Law",
    status: "In Progress",
    priority: "High",
    startDate: "2024-03-01",
    endDate: "2024-09-30",
    documents: [
      { id: 9, name: "Financial Reports.pdf", type: "pdf", size: "12.4 MB" },
      { id: 10, name: "Merger Agreement.pdf", type: "pdf", size: "4.7 MB" }
    ]
  },
  {
    id: 5,
    title: "Intellectual Property Infringement",
    description: "Patent infringement case involving technology disputes and licensing agreements between competitors...",
    type: "IP Law",
    status: "Open",
    priority: "Medium",
    startDate: "2024-01-08",
    endDate: "2024-07-20",
    documents: [
      { id: 11, name: "Patent Documentation.pdf", type: "pdf", size: "8.3 MB" },
      { id: 12, name: "Technical Analysis.docx", type: "docx", size: "2.1 MB" }
    ]
  }
];

const Cases = () => {
  // State management
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Simulate API fetch with mock data
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In real implementation, replace with:
        // const response = await fetch('http://localhost:5000/api/cases');
        // const data = await response.json();
        // setCases(data);
        
        setCases(mockCases);
      } catch (err) {
        setError('Failed to fetch cases. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Filter and search logic
  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      const matchesSearch = 
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.status.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || caseItem.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || caseItem.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [cases, searchTerm, statusFilter, priorityFilter]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-orange-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Closed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (document) => {
    // In real implementation, this would trigger actual file download
    console.log(`Downloading: ${document.name}`);
    // You could implement: window.open(`/api/documents/download/${document.id}`);
  };

  const handleView = (document) => {
    // In real implementation, this would open document viewer
    console.log(`Viewing: ${document.name}`);
    // You could implement: window.open(`/api/documents/view/${document.id}`);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Management</h1>
          <p className="text-gray-600">Manage and track all your legal cases in one place</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cases by title, type, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters */}
            <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? 'block' : 'hidden'} lg:flex`}>
              <div className="min-w-0 sm:min-w-[150px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="min-w-0 sm:min-w-[150px]">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== 'All' || priorityFilter !== 'All') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter('All')}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {priorityFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  Priority: {priorityFilter}
                  <button
                    onClick={() => setPriorityFilter('All')}
                    className="ml-1 hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCases.length} of {cases.length} cases
          </p>
        </div>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {caseItem.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {caseItem.description}
                  </p>

                  {/* Type and Status */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {caseItem.type}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(caseItem.status)}`}>
                      {getStatusIcon(caseItem.status)}
                      {caseItem.status}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {formatDate(caseItem.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>End: {formatDate(caseItem.endDate)}</span>
                    </div>
                  </div>

                  {/* Documents Count */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{caseItem.documents.length} document{caseItem.documents.length !== 1 ? 's' : ''}</span>
                    </div>
                    <button
                      onClick={() => setSelectedCase(caseItem)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Case Details */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedCase.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {selectedCase.type}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedCase.status)}`}>
                      {getStatusIcon(selectedCase.status)}
                      {selectedCase.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedCase.priority)}`}>
                      {selectedCase.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedCase.description}
                  </p>
                </div>

                {/* Case Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Start Date</h4>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedCase.startDate)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">End Date</h4>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedCase.endDate)}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents ({selectedCase.documents.length})</h3>
                  <div className="space-y-3">
                    {selectedCase.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <FileText className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">{doc.size} • {doc.type.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;