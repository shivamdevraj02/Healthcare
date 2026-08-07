import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { LayoutDashboard, Users, Stethoscope, CalendarDays, BarChart3, Settings } from "lucide-react";

const items = [
  {
    links: [
      { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, end: true },
      { to: "/admin/users", label: "Manage Users", icon: <Users className="h-4 w-4" /> },
      { to: "/admin/doctors", label: "Manage Doctors", icon: <Stethoscope className="h-4 w-4" /> },
      { to: "/admin/appointments", label: "Appointments", icon: <CalendarDays className="h-4 w-4" /> },
      { to: "/admin/reports", label: "Reports & Analytics", icon: <BarChart3 className="h-4 w-4" /> },
      { to: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar title="Admin Control Center" items={items} />
      <div className="flex-1 min-h-screen">
        <Topbar title="Admin Control Center" />
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
