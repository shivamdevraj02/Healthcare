import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const items = [
  {
    links: [
      { to: "/doctor", label: "Dashboard", icon: "🏠", end: true },
      { to: "/doctor/appointments", label: "Appointments", icon: "📅" },
      { to: "/doctor/consultation", label: "Video Consultation", icon: "🎥" },
      { to: "/doctor/patients", label: "Patient Records", icon: "🗂️" },
      { to: "/doctor/prescription", label: "Write Prescription", icon: "📝" },
      { to: "/doctor/availability", label: "Availability", icon: "🕒" },
      { to: "/doctor/profile", label: "Profile", icon: "👤" },
    ],
  },
];

export default function DoctorLayout() {
  return (
    <div className="flex">
      <Sidebar title="Doctor Dashboard" items={items} />
      <div className="flex-1 min-h-screen">
        <Topbar title="Doctor Dashboard" />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
