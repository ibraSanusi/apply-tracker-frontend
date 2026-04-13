import { useEffect, useState } from "react";
import SearchInput from "../../components/SearchInput.tsx";
import ApplicationCard from "../../components/ApplicationCard.tsx";
import { applicationService } from "../../services/application.service";
import type { Application } from "../../types/application.types";
import { Loader2, AlertCircle, Plus } from "lucide-react";

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await applicationService.getAll();
        setApplications(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => 
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Applications</h1>
          <p className="text-slate-500 text-lg">
            Track your progress and manage your career journey.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all hover:shadow-md active:scale-95">
          <Plus size={20} />
          New Application
        </button>
      </header>

      <section className="bg-slate-50 p-1 rounded-2xl">
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-500 font-medium">Fetching your applications...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-red-50 rounded-2xl border border-red-100 px-6 text-center">
          <AlertCircle className="text-red-500" size={40} />
          <div className="space-y-1">
            <h3 className="text-red-900 font-bold text-lg">Something went wrong</h3>
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            Try Refreshing
          </button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Plus size={32} className="text-slate-300" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-slate-900 font-bold text-xl">No applications found</h3>
            <p className="text-slate-500">
              {searchTerm ? `No results for "${searchTerm}"` : "You haven't added any applications yet."}
            </p>
          </div>
          {!searchTerm && (
            <button className="text-blue-600 font-bold hover:underline">
              Start by adding your first one
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
