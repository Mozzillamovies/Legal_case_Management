import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  FileText, 
  User, 
  Calendar, 
  Building, 
  Users, 
  X, 
  Download,
  Moon,
  Sun,
  ChevronDown,
  Clock,
  MapPin,
  Scale,
  BookOpen,
  Edit3,
  Trash2
} from "lucide-react";

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [courtFilter, setCourtFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [hoveredCase, setHoveredCase] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [editingCase, setEditingCase] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCases = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/cases", { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Handle both direct array response and {data: {cases: []}} structure
        const casesData = data.data?.cases || data.data || data;
        setCases(Array.isArray(casesData) ? casesData : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("❌ Error fetching cases:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCases();

    return () => {
      controller.abort();
    };
  }, []);

const EditCaseModal = ({ show, caseData, onClose, onSave }) => {
  const [formData, setFormData] = useState(caseData || {});

  useEffect(() => {
    setFormData(caseData || {});
  }, [caseData]);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/cases/${caseData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        onClose();
      } else {
        alert("Failed to update case");
      }
    } catch (err) {
      console.error("Error updating case:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Edit Case</h2>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="court"
          placeholder="Court"
          value={formData.court || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

// Open edit modal
const handleEditCase = (caseData, e) => {
  e.stopPropagation();
  setEditingCase(caseData);
  setShowEditModal(true);
};

// Update the case list after editing
const handleSaveEditedCase = (updatedCase) => {
  setCases((prev) =>
    prev.map((c) => (c._id === updatedCase._id ? updatedCase : c))
  );
};


  // Handle delete case
  const handleDeleteCase = async (caseId, e) => {
    e.stopPropagation(); // Prevent card click
    
    if (deleteConfirm === caseId) {
      try {
        const response = await fetch(`http://localhost:5000/api/cases/${caseId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove the case from the local state
          setCases(cases.filter(c => c._id !== caseId));
          setDeleteConfirm(null);
          alert('Case deleted successfully');
        } else {
          throw new Error('Failed to delete case');
        }
      } catch (error) {
        console.error("Error deleting case:", error);
        alert('Error deleting case. Please try again.');
      }
    } else {
      // First click - show confirmation
      setDeleteConfirm(caseId);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  // Enhanced search functionality for new schema
  const filteredCases = cases.filter((c) => {
    const matchesSearch = searchTerm === "" || [
      c.subject,
      c.clientDetails?.name,
      c.court,
      c.district,
      c.taluk,
      c.caseType,
      c.description,
      c.caseNumber
    ].some(field => 
      field && field.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === "all" || c.caseStatus === statusFilter;
    const matchesType = typeFilter === "all" || c.caseType === typeFilter;
    const matchesCourt = courtFilter === "all" || c.court === courtFilter;

    return matchesSearch && matchesStatus && matchesType && matchesCourt;
  });

  // Get unique courts for filter dropdown
  const uniqueCourts = [...new Set(cases.map(c => c.court).filter(Boolean))];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Under Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Closed": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "Draft": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "Submitted": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Commercial": return <Building className="w-4 h-4" />;
      case "Civil": return <Scale className="w-4 h-4" />;
      case "Criminal": return <User className="w-4 h-4" />;
      case "Family": return <Users className="w-4 h-4" />;
      case "Constitutional": return <BookOpen className="w-4 h-4" />;
      case "Tax": return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" 
        : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900"
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${
          darkMode ? 'bg-blue-900/20' : 'bg-blue-200/30'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full ${
          darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/30'
        } blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Case Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all your legal cases
            </p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" 
                : "bg-gray-800/20 text-gray-600 hover:bg-gray-800/30"
            } hover:scale-110`}
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        {/* Search and Filters */}
        <div className={`rounded-3xl p-6 mb-8 backdrop-blur-lg border shadow-xl ${
          darkMode 
            ? "bg-gray-800/50 border-gray-700" 
            : "bg-white/70 border-gray-200"
        }`}>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by case number, subject, client name, court, district, or case type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? "bg-gray-900/50 border-gray-600 text-gray-100 placeholder-gray-400" 
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-wrap">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-900/50 border-gray-600 text-gray-100" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-900/50 border-gray-600 text-gray-100" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Types</option>
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Family">Family</option>
                <option value="Commercial">Commercial</option>
                <option value="Constitutional">Constitutional</option>
                <option value="Tax">Tax</option>
              </select>

              {/* Court Filter */}
              <select
                value={courtFilter}
                onChange={(e) => setCourtFilter(e.target.value)}
                className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-900/50 border-gray-600 text-gray-100" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Courts</option>
                {uniqueCourts.map(court => (
                  <option key={court} value={court}>{court}</option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View:</span>
              <div className={`flex rounded-xl border ${
                darkMode ? "border-gray-600" : "border-gray-300"
              }`}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-l-xl transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-r-xl transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-blue-600">{filteredCases.length}</span> of <span className="font-semibold">{cases.length}</span> cases
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="ml-4 text-xl animate-pulse">Loading cases...</p>
          </div>
        ) : (
          /* Case Display */
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-4"
          }`}>
            {filteredCases.map((caseData, index) => (
              <CaseCard
                key={caseData._id}
                caseData={caseData}
                darkMode={darkMode}
                viewMode={viewMode}
                index={index}
                hoveredCase={hoveredCase}
                setHoveredCase={setHoveredCase}
                onSelect={() => setSelectedCase(caseData)}
                onEdit={handleEditCase}
                onDelete={handleDeleteCase}
                deleteConfirm={deleteConfirm}
                getStatusColor={getStatusColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCases.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 opacity-50">⚖️</div>
            <h3 className="text-2xl font-semibold mb-4">No cases found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseModal
          case={selectedCase}
          darkMode={darkMode}
          onClose={() => setSelectedCase(null)}
          getStatusColor={getStatusColor}
          getTypeIcon={getTypeIcon}
        />
      )}
    </div>
  );
};

// Case Card Component
function CaseCard({
  caseData,
  darkMode,
  viewMode,
  index,
  hoveredCase,
  setHoveredCase,
  onSelect,
  onEdit,
  onDelete,
  deleteConfirm,
  getStatusColor,
  getTypeIcon,
}) {
  const isHovered = hoveredCase === index;

  // Map fields from new schema
  const title = caseData.subject || "Untitled Case";
  const description = caseData.description || "No description provided";
  const clientName = caseData.clientDetails?.name || "Unknown Client";
  const courtName = caseData.court || "Unknown Court";
  const district = caseData.district || "";
  const taluk = caseData.taluk || "";
  const caseType = caseData.caseType || "Other";
  const caseStatus = caseData.caseStatus || "Submitted";
  const caseDate = caseData.filedDate || caseData.createdAt || new Date();
  const documents = caseData.documents || [];
  const caseNumber = caseData.caseNumber || "N/A";

  if (viewMode === "list") {
    return (
      <div
        onMouseEnter={() => setHoveredCase(index)}
        onMouseLeave={() => setHoveredCase(null)}
        onClick={onSelect}
        className={`p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 cursor-pointer ${
          darkMode
            ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70"
            : "bg-white/70 border-gray-200 hover:bg-white/90"
        } ${isHovered ? "transform scale-102 shadow-xl" : "hover:shadow-lg"}`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className={`p-3 rounded-2xl ${getStatusColor(caseStatus)
                .replace("text-", "bg-")
                .replace("bg-", "bg-opacity-20 text-")}`}
            >
              {getTypeIcon(caseType)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold">{title}</h3>
                <span className="text-sm bg-gray-500/20 px-2 py-1 rounded-lg font-mono">
                  {caseNumber}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm opacity-70">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {clientName}
                </span>
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {courtName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {district} - {taluk}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(caseDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                caseStatus
              )}`}
            >
              {caseStatus}
            </span>
            <div className="flex items-center gap-2">
              {/* Edit Button */}
              <button
                onClick={(e) => onEdit(caseData._id, e)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "text-blue-400 hover:bg-blue-500/20"
                    : "text-blue-600 hover:bg-blue-100"
                } ${isHovered ? "opacity-100" : "opacity-60"}`}
                title="Edit case"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              {/* Delete Button */}
              <button
                onClick={(e) => onDelete(caseData._id, e)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  deleteConfirm === caseData._id
                    ? "bg-red-500 text-white"
                    : darkMode
                    ? "text-red-400 hover:bg-red-500/20"
                    : "text-red-600 hover:bg-red-100"
                } ${isHovered ? "opacity-100" : "opacity-60"}`}
                title={deleteConfirm === caseData._id ? "Click again to confirm delete" : "Delete case"}
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Eye
                className={`w-5 h-5 transition-all duration-300 ${
                  isHovered ? "opacity-100 transform translate-x-2" : "opacity-50"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid mode
  return (
    <div
      onMouseEnter={() => setHoveredCase(index)}
      onMouseLeave={() => setHoveredCase(null)}
      onClick={onSelect}
      className={`p-6 rounded-3xl backdrop-blur-lg border transition-all duration-500 cursor-pointer group ${
        darkMode
          ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70"
          : "bg-white/70 border-gray-200 hover:bg-white/90"
      } ${
        isHovered
          ? "transform scale-105 -translate-y-2 shadow-2xl"
          : "hover:shadow-xl"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-2xl ${getStatusColor(caseStatus)
            .replace("text-", "bg-")
            .replace("bg-", "bg-opacity-20 text-")} group-hover:scale-110 transition-transform`}
        >
          {getTypeIcon(caseType)}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              caseStatus
            )}`}
          >
            {caseStatus}
          </span>
          
          {/* Action Buttons */}
          <div className={`flex items-center gap-1 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}>
            {/* Edit Button */}
            <button
              onClick={(e) => onEdit(caseData._id, e)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode
                  ? "text-blue-400 hover:bg-blue-500/20"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
              title="Edit case"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => onDelete(caseData._id, e)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                deleteConfirm === caseData._id
                  ? "bg-red-500 text-white"
                  : darkMode
                  ? "text-red-400 hover:bg-red-500/20"
                  : "text-red-600 hover:bg-red-100"
              }`}
              title={deleteConfirm === caseData._id ? "Click again to confirm delete" : "Delete case"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
          {title}
        </h3>
        <span className="text-sm bg-gray-500/20 px-2 py-1 rounded-lg font-mono">
          {caseNumber}
        </span>
      </div>

      <p className="text-sm opacity-70 mb-4 line-clamp-2">{description}</p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Client:</span>
          <span className="opacity-70">{clientName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-green-500" />
          <span className="font-medium">Court:</span>
          <span className="opacity-70">{courtName}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-500" />
          <span className="font-medium">Location:</span>
          <span className="opacity-70">{district} - {taluk}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span className="font-medium">Filed:</span>
          <span className="opacity-70">
            {new Date(caseDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm opacity-70">
          <FileText className="w-4 h-4" />
          <span>{documents.length} documents</span>
        </div>
        <Eye
          className={`w-5 h-5 transition-all duration-300 ${
            isHovered ? "opacity-100 transform translate-x-2" : "opacity-50"
          }`}
        />
      </div>
    </div>
  );
}

// Case Modal Component
function CaseModal({ case: selectedCase, darkMode, onClose, getStatusColor, getTypeIcon }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className={`rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className={`p-8 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-2xl ${getStatusColor(selectedCase.caseStatus).replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
              {getTypeIcon(selectedCase.caseType)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{selectedCase.subject}</h2>
              <div className="flex items-center gap-4 mb-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedCase.caseStatus)}`}>
                  {selectedCase.caseStatus}
                </span>
                <span className="text-sm opacity-70">{selectedCase.caseType}</span>
                <span className="text-sm bg-gray-500/20 px-3 py-1 rounded-lg font-mono">
                  {selectedCase.caseNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Description */}
          {selectedCase.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Case Description
              </h3>
              <p className="opacity-80 leading-relaxed">{selectedCase.description}</p>
            </div>
          )}

          {/* Case Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Client Details */}
            <div className={`p-4 rounded-2xl ${darkMode ? "bg-gray-700/30" : "bg-gray-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Client Details</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{selectedCase.clientDetails?.name}</p>
                <p className="opacity-70">{selectedCase.clientDetails?.email}</p>
                <p className="opacity-70">{selectedCase.clientDetails?.phone}</p>
              </div>
            </div>

            {/* Court & Location */}
            <div className={`p-4 rounded-2xl ${darkMode ? "bg-gray-700/30" : "bg-gray-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">Court & Location</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{selectedCase.court}</p>
                <p className="opacity-70">{selectedCase.district}</p>
                <p className="opacity-70">{selectedCase.taluk}</p>
              </div>
            </div>

            {/* Case Timeline */}
            <div className={`p-4 rounded-2xl ${darkMode ? "bg-gray-700/30" : "bg-gray-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Timeline</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="opacity-70">
                  Filed: {new Date(selectedCase.filedDate).toLocaleDateString()}
                </p>
                <p className="opacity-70">
                  Age: {selectedCase.caseAge || 0} days
                </p>
                <p className="opacity-70">
                  Updated: {new Date(selectedCase.lastUpdated || selectedCase.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Acts & Sections */}
          {selectedCase.actsSections?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                Acts & Sections ({selectedCase.actsSections.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCase.actsSections.map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl ${
                      darkMode ? "bg-gray-700/30" : "bg-gray-50"
                    }`}
                  >
                    <p className="font-medium text-sm">{item.act}</p>
                    <p className="text-sm opacity-70">{item.section}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Documents ({selectedCase.documents?.length || 0})
            </h3>

            {selectedCase.documents?.length > 0 ? (
              <div className="space-y-3">
                {selectedCase.documents.map((doc, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-colors hover:bg-opacity-50 ${
                      darkMode
                        ? "bg-gray-700/30 hover:bg-gray-700/50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm opacity-70">
                          {doc.type}{doc.description ? ` - ${doc.description}` : ''}
                        </p>
                        <p className="text-xs opacity-50">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                     {/* Preview (opens in browser) */}
                      <a 
                        href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${doc.filePath}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        Preview
                      </a>

                      {/* Download (forces download) */}
                      <a 
                        href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/download/${doc.fileName}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-600 text-sm"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center py-8 rounded-2xl ${
                  darkMode ? "bg-gray-700/30" : "bg-gray-50"
                }`}
              >
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="opacity-60">No documents uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cases;