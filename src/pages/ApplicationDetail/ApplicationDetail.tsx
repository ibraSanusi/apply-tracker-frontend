import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Edit3,
  Trash2,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  Mail,
  FileText,
  ExternalLink,
  Clock,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { applicationService } from "../../services/application.service";
import type { Application } from "../../types/application.types";
import ConfirmModal from "../../components/ConfirmModal";

const MEDIUM_OPTIONS = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "Company Website",
  "Referral",
  "Other"
];

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Application>>({});

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await applicationService.getById(id);
        setApplication(response.data);
        setFormData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching application:", err);
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData) return;

    try {
      setUpdateLoading(true);
      const response = await applicationService.update(id, {
        company: formData.company,
        position: formData.position,
        email: formData.email,
        salary: formData.salary,
        medium: formData.medium,
        cv: "", // Backend might expect these strings if not using URLs yet
        cover: ""
      } as any);
      setApplication(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Error updating application:", err);
      setError("Failed to update application.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setDeleteLoading(true);
      await applicationService.delete(id);
      navigate("/applications");
    } catch (err) {
      console.error("Error deleting application:", err);
      setError("Failed to delete application.");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-500 font-medium">Loading application details...</p>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center">
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 flex flex-col items-center gap-4">
          <AlertCircle className="text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-900">Something went wrong</h2>
          <p className="text-red-700">{error}</p>
          <Link to="/applications" className="mt-4 text-blue-600 font-bold hover:underline">
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  if (!application) return null;

  const appliedDate = new Date(application.createdAt);
  const diffDays = Math.floor((new Date().getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
  const isFollowUpDue = diffDays > 0 && diffDays % 7 === 0;

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation & Actions */}
      <header className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/applications")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors group"
        >
          <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
            <ChevronLeft size={20} />
          </div>
          Back
        </button>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm"
              >
                <Edit3 size={18} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-700 hover:text-red-600 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(application);
                }}
                className="text-slate-500 hover:text-slate-900 font-bold px-4 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {updateLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 shadow-sm">
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Position</label>
                <input
                  type="text"
                  value={formData.position || ""}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Company</label>
                <input
                  type="text"
                  value={formData.company || ""}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Google"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Active
                </span>
                {isFollowUpDue && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                    Follow Up Due
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {application.position}
              </h1>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-500">
                <Building2 size={24} className="text-slate-300" />
                {application.company}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Card */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Application Details</h3>

          <div className="grid grid-cols-1 gap-6">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-2">
                    <DollarSign size={14} /> Salary (Annual)
                  </label>
                  <input
                    type="number"
                    value={formData.salary || ""}
                    onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-2">
                    <Briefcase size={14} /> Application Medium
                  </label>
                  <select
                    value={formData.medium || ""}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value="">Select an option</option>
                    {MEDIUM_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-2">
                    <Mail size={14} /> Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="HR@company.com"
                  />
                </div>
              </>
            ) : (
              <>
                <DetailItem
                  icon={<DollarSign size={20} className="text-emerald-500" />}
                  label="Salary Range"
                  value={application.salary ? `$ ${application.salary.toLocaleString()}` : "Not specified"}
                  color="bg-emerald-50"
                />
                <DetailItem
                  icon={<Briefcase size={20} className="text-blue-500" />}
                  label="Applied via"
                  value={application.medium || "Not specified"}
                  color="bg-blue-50"
                />
                <DetailItem
                  icon={<Mail size={20} className="text-purple-500" />}
                  label="Contact"
                  value={application.email || "No email provided"}
                  color="bg-purple-50"
                />
                <DetailItem
                  icon={<Calendar size={20} className="text-orange-500" />}
                  label="Applied On"
                  value={appliedDate.toLocaleDateString(undefined, { dateStyle: 'long' })}
                  color="bg-orange-50"
                />
              </>
            )}
          </div>
        </section>

        {/* Resources & Status Card */}
        <section className="space-y-8">
          {/* Status/Follow-up */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Clock size={80} />
            </div>

            <h3 className="text-lg font-bold mb-6 text-slate-300 border-b border-white/10 pb-4 flex items-center gap-2">
              <Clock size={18} /> Timeline Status
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isFollowUpDue ? 'bg-red-500' : 'bg-slate-800'} transition-colors`}>
                  {isFollowUpDue ? <AlertCircle size={24} /> : <CheckCircle2 size={24} className="text-emerald-400" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {diffDays === 0 ? 'Just Started' : `${diffDays} Days Active`}
                  </p>
                  <p className="text-white font-medium">
                    {isFollowUpDue ? "Time to follow up!" : "Application is on track"}
                  </p>
                </div>
              </div>

              {!isFollowUpDue && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Next milestone</p>
                  <p className="font-bold">Follow-up due in {7 - (diffDays % 7)} days</p>
                </div>
              )}
            </div>
          </div>

          {/* Asset Links */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-slate-400" /> Documents
            </h3>
            <div className="space-y-3">
              <AssetButton label="CV / Resume" url={application.cvUrl} />
              <AssetButton label="Cover Letter" url={application.coverUrl} />
            </div>
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
        title="Delete Application"
        message={`Are you sure you want to delete your application for ${application.position} at ${application.company}? This action cannot be undone.`}
        confirmText="Yes, delete it"
      />
    </div>
  );
}

function DetailItem({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-100 transition-all hover:bg-slate-50 group">
      <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-slate-900 font-bold">{value}</p>
      </div>
    </div>
  );
}

function AssetButton({ label, url }: { label: string, url?: string }) {
  if (!url) return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">
      <span className="font-bold text-sm">{label}</span>
      <span className="text-[10px] uppercase font-black opacity-50">Not Provided</span>
    </div>
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-2xl transition-all group"
    >
      <span className="font-bold text-sm text-slate-700 group-hover:text-blue-600">{label}</span>
      <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
    </a>
  );
}
