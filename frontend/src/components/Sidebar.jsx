import { NavLink } from "react-router-dom";
import { 
  Home, 
  Heart, 
  ShieldAlert, 
  Stethoscope, 
  FileText, 
  Bell, 
  User, 
  Settings 
} from "lucide-react";

export default function Sidebar({ title, items }) {
  const renderIcon = (label) => {
    switch (label) {
      case "Home": return <Home className="w-4 h-4" />;
      case "Maintain Health": return <Heart className="w-4 h-4" />;
      case "Prevent Disease": return <ShieldAlert className="w-4 h-4" />;
      case "Treat Disease": return <Stethoscope className="w-4 h-4" />;
      case "Health Records": return <FileText className="w-4 h-4" />;
      case "Notifications": return <Bell className="w-4 h-4" />;
      case "Profile": return <User className="w-4 h-4" />;
      case "Settings": return <Settings className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 min-h-screen hidden md:flex flex-col">
      <div className="px-6 py-5 border-b border-slate-100">
        <span className="text-xl font-bold text-brand-600 tracking-tight">SwasthSetu</span>
        <p className="text-xs font-medium text-slate-400 mt-0.5">{title}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
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
    </aside>
  );
}