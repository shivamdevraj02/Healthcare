import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import {
  Stethoscope,
  Users,
  Clock,
  CalendarCheck,
  CheckCircle,
  XCircle,
  Activity,
  ArrowRight,
  ShieldAlert,
  UserRound
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = (showLoader = true) => {
    if (showLoader) setLoading(true);
    api
      .get("/doctor/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
      .finally(() => {
        if (showLoader) setLoading(false);
      });
  };

  useEffect(() => {
    loadDashboard(true);

    if (!socket) return;

    // Real-time Event Listener: Patient side se nayi booking ya status change hotey hi Doctor Dashboard sync hoga
    const handleLiveSync = () => {
      loadDashboard(false);
    };

    socket.on("appointment_updated", handleLiveSync);

    return () => {
      socket.off("appointment_updated", handleLiveSync);
    };
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/doctor/appointments/${id}`, { status });
      loadDashboard(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Hero Welcome Banner - Doctor Edition (Slate/Indigo Theme) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-indigo-200 border border-white/10">
              <Stethoscope className="w-3.5 h-3.5 text-indigo-300" /> Provider Portal Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, Dr. <span className="text-indigo-200">{user?.name?.split(" ")[0] || "Doctor"}</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-lg">
              Manage your daily clinical schedule, review patient consultation requests, and track your practice overview from your command center.
            </p>
          </div>
          {/* Quick Action Button */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/30 rounded-xl text-indigo-200">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Practice Status</p>
              <p className="text-lg font-bold text-white mt-0.5">Accepting Patients</p>
              <button 
                onClick={() => navigate("/doctor/availability")}
                className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1 mt-1 transition-colors"
              >
                Update Availability <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        {/* Decorative Background Circles */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Patients */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Today's Patients</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-brand-600">{data?.todaysAppointments?.length ?? 0}</span>
              <span className="text-xs font-medium text-slate-400">Scheduled</span>
            </div>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Requests</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-500">{data?.pendingRequests?.length ?? 0}</span>
              <span className="text-xs font-medium text-slate-400">Requires action</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Patients */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Patients Treated</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-700">{data?.totalPatients ?? 0}</span>
              <span className="text-xs font-medium text-slate-400">Lifetime</span>
            </div>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Column: Pending Triage (Priority) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-full">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" /> Pending Consultation Requests
              </h3>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {data?.pendingRequests?.length || 0} Waiting
              </span>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-slate-50 rounded-xl w-full border border-slate-100"></div>
                <div className="h-20 bg-slate-50 rounded-xl w-full border border-slate-100"></div>
              </div>
            ) : data?.pendingRequests?.length ? (
              <ul className="space-y-3">
                {data.pendingRequests.map((a) => (
                  <li key={a._id} className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-slate-800 text-sm">
                          {a.patient?.name || "Unknown Patient"}
                        </p>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {a.patient?.age ? `${a.patient.age}Y` : "N/A"} {a.patient?.gender?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-md">
                          <CalendarCheck className="w-3.5 h-3.5 text-brand-600" /> 
                          {new Date(a.date).toLocaleDateString()} at {a.time}
                        </span>
                        <span className="capitalize px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                          {a.type} Visit
                        </span>
                      </div>
                      {a.reason && (
                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                          <span className="font-semibold not-italic text-slate-700">Reason:</span> "{a.reason}"
                        </p>
                      )}
                    </div>
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => updateStatus(a._id, "confirmed")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-brand-50 text-brand-700 hover:bg-brand-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-brand-200 hover:border-brand-500"
                      >
                        <CheckCircle className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => updateStatus(a._id, "cancelled")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-rose-200 hover:border-rose-500"
                      >
                        <XCircle className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700">You're all caught up!</p>
                <p className="text-xs text-slate-500 mt-1">No pending consultation requests at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Today's Schedule */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-full">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> Today's Schedule
              </h3>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-12 bg-slate-50 rounded-xl w-full"></div>
                <div className="h-12 bg-slate-50 rounded-xl w-full"></div>
              </div>
            ) : data?.todaysAppointments?.length ? (
              <div className="relative">
                {/* Timeline vertical line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                
                <ul className="space-y-4">
                  {data.todaysAppointments.map((a) => (
                    <li key={a._id} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white z-10 ${
                        a.status === 'completed' ? 'bg-slate-300' : 'bg-indigo-500 ring-2 ring-indigo-100'
                      }`}></div>
                      
                      <div className={`p-3 rounded-xl border ${
                        a.status === 'completed' 
                          ? 'bg-slate-50 border-slate-100 opacity-60' 
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-slate-800 truncate pr-2">
                            {a.patient?.name}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                            a.status === 'completed' 
                              ? 'bg-slate-200 text-slate-600' 
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {a.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {a.time}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{a.type}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <UserRound className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">No appointments scheduled for today.</p>
              </div>
            )}
            
            <button 
              onClick={() => navigate("/doctor/appointments")}
              className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2"
            >
              View Full Calendar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}