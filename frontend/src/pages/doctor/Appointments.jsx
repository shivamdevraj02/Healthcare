import { useEffect, useState } from "react";
import api from "../../services/api";
import { useSocket } from "../../context/SocketContext";
import {
  Calendar,
  Clock,
  Phone,
  RefreshCw,
  CheckCircle,
  XCircle,
  Video,
  MapPin,
  Search,
  FileText,
} from "lucide-react";

export default function Appointments() {
  const socket = useSocket();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const load = (showLoader = true) => {
    if (showLoader) setLoading(true);
    api
      .get("/appointments")
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Failed to load appointments:", err))
      .finally(() => {
        if (showLoader) setLoading(false);
      });
  };

  useEffect(() => {
    load(true);
    if (!socket) return;
    
    const handleAppointmentUpdate = () => {
      load(false);
    };

    socket.on("appointment_updated", handleAppointmentUpdate);

    return () => {
      socket.off("appointment_updated", handleAppointmentUpdate);
    };
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/doctor/appointments/${id}`, { status });
      load(false);
    } catch (err) {
      console.error("Failed to update appointment status:", err);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const nameMatch = item.patient?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const phoneMatch = item.patient?.phone?.includes(searchQuery);
    const reasonMatch = item.reason
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && (nameMatch || phoneMatch || reasonMatch);
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Appointments Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your patient consultation bookings, accept new requests, and
            update statuses.
          </p>
        </div>
        <button
          onClick={() => load(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brand-600" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, phone, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-white text-brand-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse space-y-3"
            >
              <div className="h-4 bg-slate-100 rounded w-1/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm border border-brand-100">
                    {a.patient?.name?.[0]?.toUpperCase() || "P"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-sm">
                        {a.patient?.name || "Patient"}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        ({a.patient?.age ? `${a.patient.age} yrs` : "Age N/A"},{" "}
                        {a.patient?.gender || "Gender N/A"})
                      </span>
                    </div>
                    {a.patient?.phone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {a.patient.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    {new Date(a.date).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    {a.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg capitalize">
                    {a.type === "video" ? (
                      <Video className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                    {a.type} Consultation
                  </span>
                </div>

                {a.reason && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic mt-2">
                    <span className="font-semibold not-italic text-slate-700">
                      Reason:
                    </span>{" "}
                    "{a.reason}"
                  </p>
                )}
              </div>

              <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold capitalize border ${getStatusBadge(a.status)}`}
                >
                  {a.status}
                </span>
                <div className="flex items-center gap-2">
                  {a.status === "pending" && (
                    <button
                      onClick={() => updateStatus(a._id, "confirmed")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Confirm
                    </button>
                  )}
                  {a.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(a._id, "completed")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </button>
                  )}
                  {["pending", "confirmed"].includes(a.status) && (
                    <button
                      onClick={() => updateStatus(a._id, "cancelled")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No appointments found
          </p>
          <p className="text-xs text-slate-400">
            No matching appointment records found for the selected filter or
            search query.
          </p>
        </div>
      )}
    </div>
  );
}
