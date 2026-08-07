import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth & Public Pages
import Landing from "./pages/auth/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoomPage from "./pages/room/index";

// Layouts
import PatientLayout from "./layouts/PatientLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import AdminLayout from "./layouts/AdminLayout";

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";
import MaintainHealth from "./pages/patient/MaintainHealth";
import PreventDisease from "./pages/patient/PreventDisease";
import TreatDisease from "./pages/patient/TreatDisease";
import PatientRecords from "./pages/patient/Records";
import PatientProfile from "./pages/patient/Profile";
import PatientSettings from "./pages/patient/Setting";
import Notifications from "./pages/patient/Notifications";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorConsultation from "./pages/doctor/Consultation";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorPrescription from "./pages/doctor/Prescription";
import DoctorAvailability from "./pages/doctor/Availability";
import DoctorProfile from "./pages/doctor/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminDoctors from "./pages/admin/Doctors";
import AdminAppointments from "./pages/admin/Appointments";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Setting";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/room/:roomId" element={<RoomPage />} />

      {/* Patient Routes */}
      <Route path="/patient" element={<ProtectedRoute roles={["patient"]}><PatientLayout /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="maintain-health" element={<MaintainHealth />} />
        <Route path="prevent-disease" element={<PreventDisease />} />
        <Route path="treat-disease" element={<TreatDisease />} />
        <Route path="records" element={<PatientRecords />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="settings" element={<PatientSettings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={<ProtectedRoute roles={["doctor"]}><DoctorLayout /></ProtectedRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="consultation" element={<DoctorConsultation />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="prescription" element={<DoctorPrescription />} />
        <Route path="availability" element={<DoctorAvailability />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}