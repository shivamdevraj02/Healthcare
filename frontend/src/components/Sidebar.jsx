import { NavLink } from "react-router-dom";
import { 
  Home, 
  Heart, 
  ShieldAlert, 
  Stethoscope, 
  FileText, 
  Bell, 
  User, 
  Settings,
  X,
  Users,
  CalendarDays,
  BarChart3
} from "lucide-react";

export default function Sidebar({ title, items, isOpen, onClose }) {
  const renderIcon = (label) => {
    switch (label) {
      case "Home":
      case "Dashboard": 
        return <Home className="w-4 h-4" />;
      case "Maintain Health": 
        return <Heart className="w-4 h-4" />;
      case "Prevent Disease": 
        return <ShieldAlert className="w-4 h-4" />;
      case "Treat Disease":
      case "Manage Doctors": 
        return <Stethoscope className="w-4 h-4" />;
      case "Health Records":
      case "Patient Records": 
        return <FileText className="w-4 h-4" />;
      case "Notifications": 
        return <Bell className="w-4 h-4" />;
      case "Profile": 
        return <User className="w-4 h-4" />;
      case "Settings": 
        return <Settings className="w-4 h-4" />;
      case "Manage Users": 
        return <Users className="w-4 h-4" />;
      case "Appointments": 
        return <CalendarDays className="w-4 h-4" />;
      case "Reports & Analytics": 
        return <BarChart3 className="w-4 h-4" />;
      default: 
        return null;
    }
  };

  const navContent = (
    <>
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-brand-600 tracking-tight">SwasthSetu</span>
          <p className="text-xs font-medium text-slate-400 mt-0.5">{title}</p>
        </div>
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((group, idx) => (
          <div key={idx} className="mb-3">
            {group.heading && (
              <p className="text-[10px] font-bold uppercase text-slate-400 px-3 mb-1.5 tracking-wider">
                {group.heading}
              </p>
            )}
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand-50 text-brand-700 border border-brand-100 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {renderIcon(link.label)}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 min-h-screen hidden md:flex flex-col shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay & Smooth Sliding Sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden flex pointer-events-none ${isOpen ? "pointer-events-auto" : ""}`}>
        {/* Background Overlay Fade */}
        <div 
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />

        {/* Sliding Sidebar Drawer */}
        <aside 
          className={`relative w-64 max-w-[80vw] bg-white min-h-screen flex flex-col z-10 shadow-2xl transition-transform duration-300 ease-in-out transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {navContent}
        </aside>
      </div>
    </>
  );
}