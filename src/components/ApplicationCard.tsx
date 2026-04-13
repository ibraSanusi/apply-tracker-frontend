import { ChevronRight, Calendar, Building2, Briefcase, DollarSign, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { Application } from "../services/applications.service";

export default function ApplicationCard({ application }: { application: Application }) {
    const appliedAt = new Date(application.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - appliedAt.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Reminder logic: every 7 days
    const isFollowUpDue = diffDays > 0 && diffDays % 7 === 0;
    const weeksSince = Math.floor(diffDays / 7);

    return (
        <article className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-300">
            {isFollowUpDue && (
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm animate-bounce">
                    FOLLOW UP DUE
                </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {application.position}
                        </h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Building2 size={14} className="text-slate-400" />
                            <span>{application.company}</span>
                        </div>
                        {application.salary && (
                            <div className="flex items-center gap-1.5">
                                <DollarSign size={14} className="text-slate-400" />
                                <span>{application.salary.toLocaleString()}</span>
                            </div>
                        )}
                        {application.medium && (
                            <div className="flex items-center gap-1.5 capitalize">
                                <Briefcase size={14} className="text-slate-400" />
                                <span>{application.medium}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Calendar size={12} />
                            <span>{appliedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Clock size={10} />
                            <span>{diffDays === 0 ? 'Applied today' : `${diffDays} days ago`}</span>
                        </div>
                    </div>

                    <Link 
                        to={`/application/${application.id}`}
                        className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </div>

            {weeksSince > 0 && !isFollowUpDue && (
                <div className="mt-4 pt-4 border-t border-dashed border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 italic">
                    <Clock size={10} />
                    <span>{weeksSince} week{weeksSince > 1 ? 's' : ''} since application. Next follow-up in {7 - (diffDays % 7)} days.</span>
                </div>
            )}
        </article>
    );
}