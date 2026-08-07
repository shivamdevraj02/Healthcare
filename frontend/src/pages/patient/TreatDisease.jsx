import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { Calendar, Clock, Video, MapPin, AlertCircle } from "lucide-react";

const TABS = ["Book Appointment", "Video Consultation", "E-Prescription", "Health Records"];

export default function TreatDisease() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      <h2 className="text-xl font-bold text-slate-800">Treat Disease & Consultations</h2>
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === t
                ? "bg-brand-600 text-white shadow-2xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Book Appointment" && <BookAppointment />}
      {tab === "Video Consultation" && <VideoConsultation />}
      {tab === "E-Prescription" && <EPrescription />}
      {tab === "Health Records" && <HealthRecords />}
    </div>
  );
}

function BookAppointment() {
  const socket = useSocket(); // Access global socket instance
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlotsForSelectedDate, setAvailableSlotsForSelectedDate] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dateError, setDateError] = useState("");
  const [form, setForm] = useState({ doctor: "", date: "", time: "", type: "video", reason: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const docsRes = await api.get("/patient/doctors");
      setDoctors(Array.isArray(docsRes.data) ? docsRes.data : []);

      const apptsRes = await api.get("/appointments", {
        params: { _t: Date.now() },
      });
      setAppointments(Array.isArray(apptsRes.data) ? apptsRes.data : []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Replace setInterval polling with Socket.io real-time event listener
  useEffect(() => {
    load(true);

    if (!socket) return;

    // Listen for real-time status updates emitted by backend
    const handleAppointmentUpdate = (event) => {
      if (event.type === "STATUS_CHANGED" && event.appointment) {
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === event.appointment._id ? event.appointment : a
          )
        );
      } else {
        // Fallback re-fetch for new appointments or structural changes
        load(false);
      }
    };

    socket.on("appointment_updated", handleAppointmentUpdate);

    return () => {
      socket.off("appointment_updated", handleAppointmentUpdate);
    };
  }, [socket]);

  const handleDoctorChange = (doctorId) => {
    const doc = doctors.find((d) => d._id === doctorId);
    setSelectedDoctor(doc);
    setForm({ ...form, doctor: doctorId, date: "", time: "" });
    setAvailableSlotsForSelectedDate([]);
    setDateError("");
  };

  const handleDateChange = (selectedDateStr) => {
    setDateError("");
    setForm((prev) => ({ ...prev, date: selectedDateStr, time: "" }));
    if (!selectedDoctor) return;

    const dateObj = new Date(selectedDateStr);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[dateObj.getDay()];
    const daySchedule = selectedDoctor.availability?.find(
      (a) => a.day?.toLowerCase() === dayName.toLowerCase()
    );

    if (daySchedule && daySchedule.slots && daySchedule.slots.length > 0) {
      setAvailableSlotsForSelectedDate(daySchedule.slots);
    } else {
      setAvailableSlotsForSelectedDate([]);
      setDateError(`Dr. ${selectedDoctor.name} is Off-Duty on ${dayName}s.`);
    }
  };

  const book = async (e) => {
    e.preventDefault();
    if (!form.doctor || !form.date || !form.time || dateError) return;
    setLoading(true);
    try {
      const res = await api.post("/appointments", form);
      const newAppointment = res.data;
      setMsg("Appointment requested successfully!");

      if (newAppointment) {
        const populatedAppointment = {
          ...newAppointment,
          doctor: selectedDoctor ? { name: selectedDoctor.name } : newAppointment.doctor,
        };
        setAppointments((prev) => [populatedAppointment, ...prev]);
      }

      setForm({ doctor: "", date: "", time: "", type: "video", reason: "" });
      setSelectedDoctor(null);
      setAvailableSlotsForSelectedDate([]);
      setDateError("");
      await load(false);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed: " + (err.response?.data?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
      load(false);
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Booking Form Card */}
      <Card title="Book a New Appointment">
        <form onSubmit={book} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Select Doctor</label>
            <select
              className="input text-xs"
              value={form.doctor}
              onChange={(e) => handleDoctorChange(e.target.value)}
              required
            >
              <option value="">
                {loading ? "Loading doctors..." : doctors.length ? "-- Choose Doctor --" : "No doctors registered"}
              </option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.name} {d.specialization ? `(${d.specialization})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Preferred Date</label>
              <input
                type="date"
                className="input text-xs"
                required
                disabled={!selectedDoctor}
                value={form.date}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Available Shift Slot</label>
              {availableSlotsForSelectedDate.length > 0 ? (
                <select
                  className="input text-xs font-semibold text-brand-700 bg-brand-50/50"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                >
                  <option value="">-- Choose Shift Time --</option>
                  {availableSlotsForSelectedDate.map((slot, i) => (
                    <option key={i} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  readOnly
                  disabled
                  placeholder={
                    !form.date
                      ? "Select Date First"
                      : dateError
                      ? "Doctor Off-Duty"
                      : "No Slots Available"
                  }
                  className="input text-xs bg-slate-100 text-slate-400 cursor-not-allowed"
                />
              )}
            </div>
          </div>

          {dateError && (
            <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {dateError} Please select another date.
            </p>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Consultation Type</label>
            <select
              className="input text-xs"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="video">Video Consultation</option>
              <option value="in-person">In-Person Clinic Visit</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Reason for Visit</label>
            <input
              className="input text-xs"
              placeholder="e.g. High Fever, Regular Checkup"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-xs font-bold py-2.5 disabled:opacity-50"
            disabled={!doctors.length || Boolean(dateError) || !form.time || loading}
          >
            {loading ? "Requesting..." : "Request Appointment"}
          </button>
          {msg && <p className="text-emerald-600 text-xs font-semibold text-center mt-2">{msg}</p>}
        </form>
      </Card>

      {/* Requested Appointments Display */}
      <Card title="Your Requested Appointments">
        <ul className="divide-y divide-slate-100">
          {appointments.map((a) => (
            <li key={a._id} className="py-3 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">
                  Dr. {typeof a.doctor === "object" ? a.doctor?.name : selectedDoctor?.name || "Doctor"}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${
                    a.status === "confirmed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : a.status === "pending"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {a.status}
                </span>
              </div>
              <p className="text-slate-500">
                {new Date(a.date).toLocaleDateString()} at {a.time}{" "}
                <span className="capitalize font-medium">({a.type})</span>
              </p>
              {["pending", "confirmed"].includes(a.status) && (
                <button
                  onClick={() => cancel(a._id)}
                  className="text-rose-600 text-[11px] font-semibold hover:underline mt-1"
                >
                  Cancel Request
                </button>
              )}
            </li>
          ))}
          {!appointments.length && (
            <p className="text-slate-400 text-xs py-4 text-center">No appointment requests found.</p>
          )}
        </ul>
      </Card>
    </div>
  );
}

function VideoConsultation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");

  const joinRoom = (e) => {
    e.preventDefault();
    const trimmed = roomId.trim();
    if (!trimmed) {
      setMessage("Please enter a room ID.");
      return;
    }
    navigate(`/room/${encodeURIComponent(trimmed)}`);
  };

  return (
    <Card title="Start Telehealth Consultation">
      <p className="text-xs text-slate-500 mb-4">
        Logged in as: <span className="font-semibold text-slate-800">{user?.email}</span>
      </p>
      <form onSubmit={joinRoom} className="space-y-3 max-w-md">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Room ID</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room Code provided by Doctor"
            className="input text-xs"
          />
        </div>
        <button type="submit" className="btn-primary text-xs font-bold py-2.5 w-full">
          Join Video Room
        </button>
        {message && <p className="text-xs text-amber-600">{message}</p>}
      </form>
    </Card>
  );
}

function EPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    api.get("/patient/records").then((res) => setPrescriptions(res.data.prescriptions || []));
  }, []);

  return (
    <Card title="E-Prescriptions Vault">
      <ul className="divide-y divide-slate-100">
        {prescriptions.map((p) => (
          <li key={p._id} className="py-3 text-xs space-y-1">
            <p className="font-bold text-slate-800">
              Dr. {p.doctor?.name} — {new Date(p.date).toLocaleDateString()}
            </p>
            {p.diagnosis && <p className="text-slate-600">Diagnosis: {p.diagnosis}</p>}
          </li>
        ))}
        {!prescriptions.length && <p className="text-slate-400 text-xs py-4 text-center">No prescriptions found.</p>}
      </ul>
    </Card>
  );
}

function HealthRecords() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/patient/records").then((res) => setSummary(res.data));
  }, []);

  return (
    <Card title="Clinical Records Summary">
      <p className="text-xs text-slate-500">View complete records under Health Records menu.</p>
    </Card>
  );
}