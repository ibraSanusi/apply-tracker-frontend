import { Bot, Settings, StickyNote, X, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Pages = {
  assistant: "assistant",
  applications: "applications",
  settings: "settings",
};

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const location = useLocation();
  const activePath = location.pathname.split("/")[1];
  const { logout } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 z-60 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out z-70 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header of Sidebar */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl text-primary tracking-tight">
                ApplyTracker
              </span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                Navigation
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-8 px-4 overflow-y-auto">
            <ul className="space-y-1.5">
              <MenuItem
                to={`/applications`}
                icon={<StickyNote size={22} />}
                label="Applications"
                active={activePath === Pages.applications}
                onClick={onClose}
              />
              <MenuItem
                to={`/assistant`}
                icon={<Bot size={22} />}
                label="AI Assistant"
                active={activePath === Pages.assistant}
                onClick={onClose}
              />
              <MenuItem
                to={`/settings`}
                icon={<Settings size={22} />}
                label="Settings"
                active={activePath === Pages.settings}
                onClick={onClose}
                disabled
              />
            </ul>
          </nav>

          {/* Footer of Sidebar */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
            <div className="px-4 py-2 text-[10px] text-slate-400 text-center">
              ApplyTracker v1.0.0 • Made with ❤️
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function MenuItem({
  to,
  icon,
  label,
  active,
  onClick,
  disabled = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <li>
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-300 cursor-not-allowed opacity-60">
          {icon}
          <span className="font-semibold text-sm">{label}</span>
          <span className="ml-auto text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 uppercase">
            Soon
          </span>
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
          active
            ? "bg-primary text-white shadow-lg shadow-primary/20"
            : "text-slate-600 hover:bg-slate-50 hover:text-primary"
        }`}
      >
        <span
          className={`transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-primary"}`}
        >
          {icon}
        </span>
        <span className="font-semibold text-sm">{label}</span>
      </Link>
    </li>
  );
}
