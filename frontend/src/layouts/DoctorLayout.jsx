import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const items = [
  {
    links: [
      { to: "/doctor", label: "Dashboard", end: true },
      { to: "/doctor/appointments", label: "Appointments" },
      { to: "/doctor/consultation", label: "Video Consultation" },
      { to: "/doctor/patients", label: "Patient Records" },
      { to: "/doctor/prescription", label: "Write Prescription" },
      { to: "/doctor/availability", label: "Availability" },
      { to: "/doctor/profile", label: "Profile" },
    ],
  },
];

export default function DoctorLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar
        title="Doctor Dashboard"
        items={items}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar
          title="Doctor Dashboard"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
        <footer className="bg-white border-t border-slate-200/80 px-6 py-4 mt-auto text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700">SwasthSetu Patient Portal</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>&copy; {new Date().getFullYear()} SwasthSetu</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}