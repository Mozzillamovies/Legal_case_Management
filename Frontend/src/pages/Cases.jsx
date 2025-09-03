import  { useEffect, useState } from "react";
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
  ChevronDown,
  Clock,
  MapPin,
  Scale,
  BookOpen,
  Edit3,
  Trash2,
  Plus,Briefcase
} from "lucide-react";

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [courtFilter, setCourtFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [hoveredCase, setHoveredCase] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [editingCase, setEditingCase] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHearingModal, setShowHearingModal] = useState(false);
  const [hearingUpdateCase, setHearingUpdateCase] = useState(null);

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

  // Calculate days between dates
  const calculateDays = (date1, date2) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get days to hearing or overdue message
  const getHearingStatus = (hearingDate) => {
    if (!hearingDate) return { days: 'N/A', message: 'No hearing date set', isOverdue: false };
    
    const today = new Date();
    const hearing = new Date(hearingDate);
    const diffTime = hearing - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        days: Math.abs(diffDays), 
        message: `${Math.abs(diffDays)} days overdue`, 
        isOverdue: true 
      };
    } else if (diffDays === 0) {
      return { days: 0, message: 'Today', isOverdue: false };
    } else {
      return { days: diffDays, message: `${diffDays} days to hearing`, isOverdue: false };
    }
  };

  const HearingUpdateModal = ({ show, caseData, onClose, onSave }) => {
    const [hearingDate, setHearingDate] = useState(
      caseData?.clientDetails?.hearingDate ? 
        new Date(caseData.clientDetails.hearingDate).toISOString().split('T')[0] : ""
    );
    const [caseStatus, setCaseStatus] = useState(caseData?.caseStatus || "");

    useEffect(() => {
      if (caseData) {
        setHearingDate(
          caseData.clientDetails?.hearingDate ? 
            new Date(caseData.clientDetails.hearingDate).toISOString().split('T')[0] : ""
        );
        setCaseStatus(caseData.caseStatus || "");
      }
    }, [caseData]);

    if (!show) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const updateData = {
          ...caseData,
          caseStatus,
          clientDetails: {
            ...caseData.clientDetails,
            hearingDate: hearingDate || null
          }
        };

        const res = await fetch(`http://localhost:5000/api/cases/${caseData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
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
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-96 space-y-4 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Update Hearing & Status</h2>
          <p className="text-gray-600 dark:text-gray-400">Case: {caseData?.subject}</p>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Next Hearing Date</label>
            <input
              type="date"
              value={hearingDate}
              onChange={(e) => setHearingDate(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Case Status</label>
            <select
              value={caseStatus}
              onChange={(e) => setCaseStatus(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    );
  };

  const EditCaseModal = ({ show, caseData, onClose, onSave }) => {
    const [formData, setFormData] = useState(caseData || {});

    // Update form state when caseData changes
    useEffect(() => {
      setFormData(caseData || {});
    }, [caseData]);

    if (!show) return null;

    const handleChange = (e) => {
      const { name, value } = e.target;
      
      // Handle nested clientDetails fields
      if (name.startsWith('clientDetails.')) {
        const field = name.replace('clientDetails.', '');
        setFormData(prev => ({
          ...prev,
          clientDetails: {
            ...prev.clientDetails,
            [field]: value
          }
        }));
      } else {
        setFormData({ ...formData, [name]: value });
      }
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
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-96 max-h-[90vh] overflow-y-auto space-y-4 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Case</h2>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <input
            type="text"
            name="district"
            placeholder="District"
            value={formData.district || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <input
            type="text"
            name="taluk"
            placeholder="Taluk"
            value={formData.taluk || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <input
            type="text"
            name="court"
            placeholder="Court"
            value={formData.court || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <select
            name="caseType"
            value={formData.caseType || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Select Case Type</option>
            <option value="Civil">Civil</option>
            <option value="Criminal">Criminal</option>
            <option value="Family">Family</option>
            <option value="Commercial">Commercial</option>
            <option value="Constitutional">Constitutional</option>
            <option value="Tax">Tax</option>
          </select>

          <select
            name="caseStatus"
            value={formData.caseStatus || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Select Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Client Details Section */}
          <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Client Details</h3>
            
            <input
              type="text"
              name="clientDetails.clientName"
              placeholder="Client Name"
              value={formData.clientDetails?.clientName || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            <input
              type="text"
              name="clientDetails.phone"
              placeholder="Phone Number"
              value={formData.clientDetails?.phone || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            <input
              type="text"
              name="clientDetails.idProofType"
              placeholder="ID Proof Type (e.g., Aadhar, PAN)"
              value={formData.clientDetails?.idProofType || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            <input
              type="text"
              name="clientDetails.idProofNumber"
              placeholder="ID Proof Number"
              value={formData.clientDetails?.idProofNumber || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            <textarea
              name="clientDetails.address"
              placeholder="Address"
              value={formData.clientDetails?.address || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            <input
              type="date"
              name="clientDetails.hearingDate"
              placeholder="Hearing Date"
              value={formData.clientDetails?.hearingDate ? new Date(formData.clientDetails.hearingDate).toISOString().split('T')[0] : ""}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  };

  const handleEditCase = (caseData, e) => {
    e.stopPropagation();
    console.log("Editing case:", caseData);
    setEditingCase(caseData);
    setShowEditModal(true);
  };

  const handleUpdateHearing = (caseData, e) => {
    e.stopPropagation();
    setHearingUpdateCase(caseData);
    setShowHearingModal(true);
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
      c.clientDetails?.clientName,
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
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Under Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Closed": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "Draft": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Submitted": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
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
    <div className="min-h-screen transition-all duration-500 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-200/30 dark:bg-blue-800/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-200/30 dark:bg-indigo-800/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              Case Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all your legal cases
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="rounded-3xl p-6 mb-8 backdrop-blur-lg border shadow-xl bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by case number, subject, client name, court, district, or case type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-wrap">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border transition-all duration-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
                className="px-4 py-2 rounded-xl border transition-all duration-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
                className="px-4 py-2 rounded-xl border transition-all duration-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="all">All Courts</option>
                {uniqueCourts.map(court => (
                  <option key={court} value={court}>{court}</option>
                ))}
              </select>
            </div>

                   {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">View:</span>
                <div className="flex rounded-xl border border-gray-300 dark:border-gray-600">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-l-xl transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-r-xl transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredCases.length}</span> of <span className="font-semibold">{cases.length}</span> cases
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
                viewMode={viewMode}
                index={index}
                hoveredCase={hoveredCase}
                setHoveredCase={setHoveredCase}
                onSelect={() => setSelectedCase(caseData)}
                onEdit={handleEditCase}
                onDelete={handleDeleteCase}
                onUpdateHearing={handleUpdateHearing}
                deleteConfirm={deleteConfirm}
                getStatusColor={getStatusColor}
                getTypeIcon={getTypeIcon}
                calculateDays={calculateDays}
                getHearingStatus={getHearingStatus}
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

      {/* Edit Case Modal */}
      <EditCaseModal
        show={showEditModal}
        caseData={editingCase}
        onClose={() => {
          setShowEditModal(false);
          setEditingCase(null);
        }}
        onSave={handleSaveEditedCase}
      />

      {/* Hearing Update Modal */}
      <HearingUpdateModal
        show={showHearingModal}
        caseData={hearingUpdateCase}
        onClose={() => {
          setShowHearingModal(false);
          setHearingUpdateCase(null);
        }}
        onSave={handleSaveEditedCase}
      />

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseModal
          case={selectedCase}
          onClose={() => setSelectedCase(null)}
          getStatusColor={getStatusColor}
          getTypeIcon={getTypeIcon}
          getHearingStatus={getHearingStatus}
          calculateDays={calculateDays}
        />
      )}
    </div>
  );
};

// Case Card Component
function CaseCard({
  caseData,
  viewMode,
  index,
  hoveredCase,
  setHoveredCase,
  onSelect,
  onEdit,
  onDelete,
  onUpdateHearing,
  deleteConfirm,
  getStatusColor,
  getTypeIcon,
  calculateDays,
  getHearingStatus,
}) {
  const isHovered = hoveredCase === index;

  // Map fields from new schema
  const title = caseData.subject || "Untitled Case";
  const description = caseData.description || "No description provided";
  const clientName = caseData.clientDetails?.clientName || "Unknown Client";
  const courtName = caseData.court || "Unknown Court";
  const district = caseData.district || "";
  const taluk = caseData.taluk || "";
  const caseType = caseData.caseType || "Other";
  const caseStatus = caseData.caseStatus || "Submitted";
  const caseDate = caseData.filedDate || caseData.createdAt || new Date();
  const caseNumber = caseData.caseNumber || "N/A";

  // Calculate days active from filed date
  const daysActive = calculateDays(caseDate, new Date());
  const hearingStatus = getHearingStatus(caseData.clientDetails?.hearingDate);

// CASE CARD COMPONENT

if (viewMode === "list") {
  return (
    <div
      onMouseEnter={() => setHoveredCase(index)}
      onMouseLeave={() => setHoveredCase(null)}
      onClick={onSelect}
      className={`p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 cursor-pointer bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 ${
        isHovered ? "transform scale-102 shadow-xl" : "hover:shadow-lg"
      }`}
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
            {/* ✅ Client name as title */}
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{clientName}</h3>
              <span className="text-sm bg-gray-500/20 dark:bg-gray-600/30 px-2 py-1 rounded-lg font-mono text-gray-700 dark:text-gray-300">
                {caseNumber}
              </span>
            </div>

            {/* ✅ Case title moved here */}
            <div className="flex items-center gap-4 text-sm opacity-70 text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {title}
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

              {/* ✅ Next Hearing Date */}
              {caseData.clientDetails?.hearingDate && (
                <span
                  className={`flex items-center gap-1 ${
                    hearingStatus.isOverdue
                      ? "text-red-600 dark:text-red-400 font-medium"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Next:{" "}
                  {new Date(
                    caseData.clientDetails.hearingDate
                  ).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Actions */}
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              caseStatus
            )}`}
          >
            {caseStatus}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onUpdateHearing(caseData, e)}
              className={`p-2 rounded-lg transition-all duration-300 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 ${
                isHovered ? "opacity-100" : "opacity-60"
              }`}
              title="Update hearing date"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => onEdit(caseData, e)}
              className={`p-2 rounded-lg transition-all duration-300 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 ${
                isHovered ? "opacity-100" : "opacity-60"
              }`}
              title="Edit case"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => onDelete(caseData._id, e)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                deleteConfirm === caseData._id
                  ? "bg-red-500 text-white"
                  : "text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
              } ${isHovered ? "opacity-100" : "opacity-60"}`}
              title={
                deleteConfirm === caseData._id
                  ? "Click again to confirm delete"
                  : "Delete case"
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <Eye
              className={`w-5 h-5 transition-all duration-300 text-gray-600 dark:text-gray-400 ${
                isHovered ? "opacity-100 transform translate-x-2" : "opacity-50"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ GRID MODE
return (
  <div
    onMouseEnter={() => setHoveredCase(index)}
    onMouseLeave={() => setHoveredCase(null)}
    onClick={onSelect}
    className={`p-6 rounded-3xl backdrop-blur-lg border transition-all duration-500 cursor-pointer group bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90 ${
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

        {/* ✅ Actions */}
        <div
          className={`flex items-center gap-1 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={(e) => onUpdateHearing(caseData, e)}
            className="p-2 rounded-lg transition-all duration-300 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900"
            title="Update hearing date"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => onEdit(caseData, e)}
            className="p-2 rounded-lg transition-all duration-300 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
            title="Edit case"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => onDelete(caseData._id, e)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              deleteConfirm === caseData._id
                ? "bg-red-500 text-white"
                : "text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
            }`}
            title={
              deleteConfirm === caseData._id
                ? "Click again to confirm delete"
                : "Delete case"
            }
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {/* ✅ Client name as primary title */}
    <div className="mb-3">
      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
        {clientName}
      </h3>
      <span className="text-sm bg-gray-500/20 dark:bg-gray-600/30 px-2 py-1 rounded-lg font-mono text-gray-700 dark:text-gray-300">
        {caseNumber}
      </span>
    </div>

    {/* ✅ Case title shown in details */}
    <p className="text-sm opacity-70 mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">{title}</p>

    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Building className="w-4 h-4 text-green-500 dark:text-green-400" />
        <span className="font-medium text-gray-900 dark:text-white">Court:</span>
        <span className="opacity-70 text-gray-600 dark:text-gray-400">{courtName}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-purple-500 dark:text-purple-400" />
        <span className="font-medium text-gray-900 dark:text-white">Location:</span>
        <span className="opacity-70 text-gray-600 dark:text-gray-400">
          {district} - {taluk}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-orange-500 dark:text-orange-400" />
        <span className="font-medium text-gray-900 dark:text-white">Filed:</span>
        <span className="opacity-70 text-gray-600 dark:text-gray-400">
          {new Date(caseDate).toLocaleDateString()}
        </span>
      </div>

      {/* ✅ Next Hearing Date */}
      {caseData.clientDetails?.hearingDate && (
        <div className="flex items-center gap-2">
          <Clock
            className={`w-4 h-4 ${
              hearingStatus.isOverdue ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"
            }`}
          />
          <span className="font-medium text-gray-900 dark:text-white">Next Hearing:</span>
          <span
            className={`opacity-70 ${
              hearingStatus.isOverdue ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {new Date(caseData.clientDetails.hearingDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm opacity-70 text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{daysActive} days active</span>
        </div>
        {caseData.clientDetails?.hearingDate && (
          <div
            className={`flex items-center gap-1 ${
              hearingStatus.isOverdue
                ? "text-red-600 dark:text-red-400 font-medium"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{hearingStatus.message}</span>
          </div>
        )}
      </div>
      <Eye
        className={`w-5 h-5 transition-all duration-300 text-gray-600 dark:text-gray-400 ${
          isHovered ? "opacity-100 transform translate-x-2" : "opacity-50"
        }`}
      />
    </div>
  </div>
);


}

// Case Modal Component
function CaseModal({ case: selectedCase, onClose, getStatusColor, getTypeIcon, getHearingStatus, calculateDays }) {
  const daysActive = calculateDays(selectedCase.filedDate || selectedCase.createdAt, new Date());
  const hearingStatus = getHearingStatus(selectedCase.clientDetails?.hearingDate);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-2xl ${getStatusColor(selectedCase.caseStatus).replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
              {getTypeIcon(selectedCase.caseType)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{selectedCase.clientDetails?.clientName || 'Unknown Client'}</h2>
              <div className="flex items-center gap-4 mb-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedCase.caseStatus)}`}>
                  {selectedCase.caseStatus}
                </span>
                <span className="text-sm opacity-70 text-gray-600 dark:text-gray-400">{selectedCase.caseType}</span>
                <span className="text-sm bg-gray-500/20 dark:bg-gray-600/30 px-3 py-1 rounded-lg font-mono text-gray-700 dark:text-gray-300">
                  {selectedCase.caseNumber}
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">{selectedCase.subject}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Description */}
          {selectedCase.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                Case Description
              </h3>
              <p className="opacity-80 leading-relaxed text-gray-700 dark:text-gray-300">{selectedCase.description}</p>
            </div>
          )}

          {/* Case Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Client Details */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Client Details</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{selectedCase.clientDetails?.clientName}</p>
                <p className="opacity-70 text-gray-600 dark:text-gray-400">{selectedCase.clientDetails?.phone}</p>
                <p className="opacity-70 text-gray-600 dark:text-gray-400">{selectedCase.clientDetails?.idProofType}: {selectedCase.clientDetails?.idProofNumber}</p>
                {selectedCase.clientDetails?.address && (
                  <p className="opacity-70 text-xs text-gray-600 dark:text-gray-400">{selectedCase.clientDetails.address}</p>
                )}
              </div>
            </div>

            {/* Court & Location */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Court & Location</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{selectedCase.court}</p>
                <p className="opacity-70 text-gray-600 dark:text-gray-400">{selectedCase.district}</p>
                <p className="opacity-70 text-gray-600 dark:text-gray-400">{selectedCase.taluk}</p>
              </div>
            </div>

            {/* Case Timeline */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                <span className="font-semibold text-gray-900 dark:text-white">Timeline</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="opacity-70 text-gray-600 dark:text-gray-400">
                  Filed: {new Date(selectedCase.filedDate || selectedCase.createdAt).toLocaleDateString()}
                </p>
                <p className="opacity-70 text-gray-600 dark:text-gray-400">
                  Updated: {new Date(selectedCase.lastUpdated || selectedCase.updatedAt).toLocaleDateString()}
                </p>
                {selectedCase.clientDetails?.hearingDate && (
                  <p className={`font-medium ${hearingStatus.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    Next Hearing: {new Date(selectedCase.clientDetails.hearingDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Client Information */}
          {selectedCase.clientDetails && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                Complete Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700">
                  <p className="font-medium text-sm mb-2 text-gray-900 dark:text-white">Contact Information</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="opacity-70 text-gray-600 dark:text-gray-400">Name:</span> <span className="text-gray-900 dark:text-white">{selectedCase.clientDetails.clientName}</span></p>
                    <p><span className="opacity-70 text-gray-600 dark:text-gray-400">Phone:</span> <span className="text-gray-900 dark:text-white">{selectedCase.clientDetails.phone}</span></p>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700">
                  <p className="font-medium text-sm mb-2 text-gray-900 dark:text-white">Identification</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="opacity-70 text-gray-600 dark:text-gray-400">ID Type:</span> <span className="text-gray-900 dark:text-white">{selectedCase.clientDetails.idProofType}</span></p>
                    <p><span className="opacity-70 text-gray-600 dark:text-gray-400">ID Number:</span> <span className="text-gray-900 dark:text-white">{selectedCase.clientDetails.idProofNumber}</span></p>
                  </div>
                </div>

                {selectedCase.clientDetails.address && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 md:col-span-2">
                    <p className="font-medium text-sm mb-2 text-gray-900 dark:text-white">Address</p>
                    <p className="text-sm opacity-70 text-gray-600 dark:text-gray-400">{selectedCase.clientDetails.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Case Status Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              Case Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{daysActive}</p>
                <p className="text-sm opacity-70 text-gray-600 dark:text-gray-400">Days Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedCase.caseStatus}</p>
                <p className="text-sm opacity-70 text-gray-600 dark:text-gray-400">Current Status</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedCase.caseType}</p>
                <p className="text-sm opacity-70 text-gray-600 dark:text-gray-400">Case Type</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${hearingStatus.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {hearingStatus.days}
                </p>
                <p className="text-sm opacity-70 text-gray-600 dark:text-gray-400">
                  {hearingStatus.isOverdue ? 'Days Overdue' : 'Days to Hearing'}
                </p>
              </div>
            </div>
            {hearingStatus.isOverdue && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                  ⚠️ Hearing date has passed! Please update the hearing schedule.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cases;