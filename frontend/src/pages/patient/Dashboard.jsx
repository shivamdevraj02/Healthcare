import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  Calendar, 
  Pill, 
  Clock, 
  Stethoscope, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  HeartPulse 
} from "lucide-react";
import PatientLayout from "../../layouts/PatientLayout";

export default function Dashboard() {
  const navigate = useNavigate();

  // Hardcoded UI Data
  const user = { name: "Ayush" };
  const data = {
    healthScore: 92,
    upcomingAppointment: {
      doctor: { name: "R. Sharma", specialization: "Cardiologist" },
      date: "2026-08-12",
      time: "10:30 AM"
    },
    activeMedicines: [
      { _id: "1", medicineName: "Lisinopril", dosage: "10mg", times: ["08:00 AM"] },
      { _id: "2", medicineName: "Atorvastatin", dosage: "20mg", times: ["09:00 PM"] }
    ],
    recentRecords: [
      { _id: "1", type: "Vitals", date: "2026-08-07T14:30:00" },
      { _id: "2", type: "Prescription", date: "2026-08-05T09:15:00" },
      { _id: "3", type: "Lab Result", date: "2026-08-01T11:45:00" }
    ]
  };

  return (
    <PatientLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        
        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-brand-600 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-brand-200 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-300" /> Patient Portal Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, <span className="text-brand-200">{user.name}</span>
              </h1>
              <p className="text-brand-100/80 text-sm max-w-lg">
                Here is your daily health intelligence summary. Manage consultations, track medications, and keep tabs on wellness goals.
              </p>
            </div>

            {/* Health Score Pill Banner */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center gap-4 min-w-[220px]">
              <div className="p-3 bg-brand-500/30 rounded-xl text-brand-200">
                <HeartPulse className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-200 uppercase tracking-wider">Health Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold">{data.healthScore}</span>
                  <span className="text-xs text-brand-200">/ 100</span>
                </div>
                <p className="text-[11px] text-emerald-300 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> Optimal Range
                </p>
              </div>
            </div>
          </div>
          {/* Decorative Background Circles */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Quick Work-Oriented Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate("/patient/treat-disease")}
            className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-brand-100/80 shadow-xs hover:border-brand-300 hover:shadow-md transition-all group text-left"
          >
            <div className="p-2.5 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Schedule</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">Book Doctor</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/patient/prevent-disease")}
            className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-brand-100/80 shadow-xs hover:border-brand-300 hover:shadow-md transition-all group text-left"
          >
            <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">AI Triage</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">Check Symptoms</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/patient/maintain-health")}
            className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-brand-100/80 shadow-xs hover:border-brand-300 hover:shadow-md transition-all group text-left"
          >
            <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Log Daily</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">Water & Vitals</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/patient/records")}
            className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-brand-100/80 shadow-xs hover:border-brand-300 hover:shadow-md transition-all group text-left"
          >
            <div className="p-2.5 bg-accent-50 rounded-xl text-accent-500 group-hover:bg-accent-500 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">EHR Vault</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">View Records</p>
            </div>
          </button>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Next Scheduled Appointment */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-brand-600" /> Next Appointment
                </h3>
                <span className="text-[11px] font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-100">
                  Live Status
                </span>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl space-y-2">
                <p className="font-bold text-slate-900 text-base">
                  Dr. {data.upcomingAppointment.doctor.name}
                </p>
                <p className="text-xs font-medium text-brand-600">
                  {data.upcomingAppointment.doctor.specialization}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {new Date(data.upcomingAppointment.date).toLocaleDateString()} at {data.upcomingAppointment.time}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/patient/treat-disease")}
              className="mt-4 text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center justify-between w-full pt-3 border-t border-slate-100"
            >
              <span>Manage Consultation Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Medicine Reminders */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
                  <Pill className="w-4 h-4 text-teal-600" /> Daily Prescription Tracker
                </h3>
                <span className="text-[11px] font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-100">
                  Active
                </span>
              </div>
              <ul className="space-y-2">
                {data.activeMedicines.map((m) => (
                  <li key={m._id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{m.medicineName}</p>
                      <p className="text-[11px] text-slate-500">
                        {m.dosage} {m.times.join(", ")}
                      </p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => navigate("/patient/prevent-disease")}
              className="mt-4 text-xs font-semibold text-slate-600 hover:text-teal-600 flex items-center justify-between w-full pt-3 border-t border-slate-100"
            >
              <span>Manage All Reminders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Health Stats Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-cyan-600" /> Key Biometrics
                </h3>
                <span className="text-[11px] font-semibold bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-full border border-cyan-100">
                  Log
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Hydration Status</span>
                  <span className="text-xs font-bold text-brand-600">Tracked Today</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Sleep Performance</span>
                  <span className="text-xs font-bold text-teal-600">Monitored</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Diet Intelligence</span>
                  <span className="text-xs font-bold text-cyan-600">AI Plan Ready</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/patient/maintain-health")}
              className="mt-4 text-xs font-semibold text-slate-600 hover:text-cyan-600 flex items-center justify-between w-full pt-3 border-t border-slate-100"
            >
              <span>Update Vitals & Health Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Health Activity Stream */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" /> Recent Activity Stream
            </h3>
            <button 
              onClick={() => navigate("/patient/records")}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View All Logs
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentRecords.map((r) => (
              <div key={r._id} className="py-3 flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  <span className="font-semibold text-slate-800 capitalize">{r.type} Record</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(r.date).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}