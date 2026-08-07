import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";

const TABS = ["AI Symptom Checker", "Vaccination Reminder", "Medicine Reminder", "Preventive Tips"];

export default function PreventDisease() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Prevent Disease</h2>
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              tab === t ? "bg-brand-500 text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "AI Symptom Checker" && <SymptomChecker />}
      {tab === "Vaccination Reminder" && <VaccinationReminder />}
      {tab === "Medicine Reminder" && <MedicineReminder />}
      {tab === "Preventive Tips" && <PreventiveTips />}
    </div>
  );
}

function SymptomChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await api.get("/patient/symptom-check");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading symptom history:", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const check = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/patient/symptom-check", {
        symptoms: [input.trim()],
      });
      setResult(res.data);
      loadHistory();
    } catch (err) {
      console.error("Error checking symptoms:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="AI Symptom Checker 🩺">
        <p className="text-sm text-slate-500 mb-3">
          Describe your symptoms in natural language (e.g. <i>"I have had a throbbing headache, high fever, and fatigue for 2 days"</i>).
        </p>

        <form onSubmit={check} className="space-y-3 mb-4">
          <textarea
            className="input min-h-[90px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms here..."
            required
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary w-full sm:w-auto px-6"
          >
            {loading ? "Analyzing Symptoms with AI..." : "Analyze Symptoms"}
          </button>
        </form>

        {/* AI Analysis Result */}
        {result && (
          <div
            className={`rounded-2xl p-5 border transition-all ${
              result.riskLevel === "high"
                ? "bg-red-50/80 border-red-200"
                : result.riskLevel === "medium"
                ? "bg-amber-50/80 border-amber-200"
                : "bg-emerald-50/80 border-emerald-200"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Triaging Result
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                  result.riskLevel === "high"
                    ? "bg-red-200 text-red-800"
                    : result.riskLevel === "medium"
                    ? "bg-amber-200 text-amber-800"
                    : "bg-emerald-200 text-emerald-800"
                }`}
              >
                Risk Level: {result.riskLevel}
              </span>
            </div>

            {/* Possible Conditions */}
            {result.possibleConditions && result.possibleConditions.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Possible Conditions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.possibleConditions.map((cond, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-200 text-slate-800 text-xs px-3 py-1 rounded-lg font-medium shadow-2xs"
                    >
                      • {cond}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Specialist */}
            {result.specialistRecommendation && (
              <p className="text-sm font-medium text-slate-800 mb-2">
                🏥 <span className="font-semibold">Recommended Specialist:</span>{" "}
                <span className="text-brand-700">{result.specialistRecommendation}</span>
              </p>
            )}

            {/* AI Advice */}
            {result.advice && (
              <div className="text-sm text-slate-700 mb-3 bg-white/70 p-3 rounded-xl border border-slate-100">
                <p className="font-semibold text-slate-900 mb-1">Advice:</p>
                <p>{result.advice}</p>
              </div>
            )}

            {/* Precautions */}
            {result.precautions && result.precautions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase mb-1">
                  Immediate Precautions:
                </p>
                <ul className="list-disc pl-5 text-xs space-y-1 text-slate-600">
                  {result.precautions.map((prec, i) => (
                    <li key={i}>{prec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-4">
          * This AI tool provides initial symptom triaging guidance and is NOT a substitute for formal medical diagnosis.
        </p>
      </Card>

      {/* Symptom Check History */}
      <Card title="Past Symptom Assessments">
        {history.length ? (
          <ul className="divide-y divide-slate-100 text-sm">
            {history.slice(0, 5).map((h) => (
              <li key={h._id} className="py-3 flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-medium text-slate-800">
                    "{Array.isArray(h.symptoms) ? h.symptoms.join(", ") : h.symptoms}"
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Conditions: {h.possibleConditions?.join(", ") || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${
                      h.riskLevel === "high"
                        ? "bg-red-100 text-red-700"
                        : h.riskLevel === "medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {h.riskLevel} Risk
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(h.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-sm py-2">No previous symptom checks recorded.</p>
        )}
      </Card>
    </div>
  );
}
function VaccinationReminder() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ vaccineName: "", dueDate: "", dueTime: "" });

  const load = () => api.get("/patient/vaccination").then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.vaccineName || !form.dueDate) return;

    // Date aur Time ko combine karke ek proper datetime bana rahe hain
    // Agar time nahi dala to default 09:00 AM le lenge
    const time = form.dueTime || "09:00";
    const combinedDateTime = `${form.dueDate}T${time}`;

    await api.post("/patient/vaccination", {
      vaccineName: form.vaccineName,
      dueDate: combinedDateTime,
    });
    setForm({ vaccineName: "", dueDate: "", dueTime: "" });
    load();
  };

  const toggleDone = async (item) => {
    await api.put(`/patient/vaccination/${item._id}`, { completed: !item.completed });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this vaccination reminder? Its notification will also be removed.")) return;
    try {
      await api.delete(`/patient/vaccination/${id}`);
      load();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("Delete fail ho gaya: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Card title="Vaccination Reminder">
      <div className="flex gap-2 items-end mb-4 flex-wrap">
        <input className="input" placeholder="Vaccine name" value={form.vaccineName}
          onChange={(e) => setForm({ ...form, vaccineName: e.target.value })} />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Date</label>
          <input type="date" className="input" value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Time</label>
          <input type="time" className="input" value={form.dueTime}
            onChange={(e) => setForm({ ...form, dueTime: e.target.value })} />
        </div>
        <button onClick={add} className="btn-primary">Add</button>
      </div>
      <ul className="divide-y divide-slate-100">
        {items.map((v) => (
          <li key={v._id} className="py-2 flex items-center justify-between text-sm">
            <div>
              <p className={`font-medium ${v.completed ? "line-through text-slate-400" : ""}`}>{v.vaccineName}</p>
              <p className="text-slate-400">Due: {new Date(v.dueDate).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleDone(v)} className="btn-outline text-xs py-1">
                {v.completed ? "Undo" : "Mark done"}
              </button>
              <button onClick={() => remove(v._id)} className="text-red-500 text-xs">Delete</button>
            </div>
          </li>
        ))}
        {!items.length && <p className="text-slate-400 text-sm">No vaccinations added yet.</p>}
      </ul>
    </Card>
  );
}

function MedicineReminder() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ medicineName: "", dosage: "", time: "", date: "" });

  const load = () => api.get("/patient/medicine-reminder").then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.medicineName || !form.time) return;
    await api.post("/patient/medicine-reminder", {
      medicineName: form.medicineName,
      dosage: form.dosage,
      times: [form.time],
      date: form.date || null,
    });
    setForm({ medicineName: "", dosage: "", time: "", date: "" });
    load();
  };

  const toggleActive = async (item) => {
    await api.put(`/patient/medicine-reminder/${item._id}`, { active: !item.active });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this medicine reminder? Its notification will also be removed.")) return;
    try {
      await api.delete(`/patient/medicine-reminder/${id}`);
      load();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("Delete fail ho gaya: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Card title="Medicine Reminder">
      <div className="flex gap-2 items-end mb-4 flex-wrap">
        <input className="input" placeholder="Medicine name" value={form.medicineName}
          onChange={(e) => setForm({ ...form, medicineName: e.target.value })} />
        <input className="input" placeholder="Dosage (e.g. 500mg)" value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Time</label>
          <input type="time" className="input" value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Date</label>
          <input type="date" className="input" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <button onClick={add} className="btn-primary">Add</button>
      </div>
      <ul className="divide-y divide-slate-100">
        {items.map((m) => (
          <li key={m._id} className="py-2 flex items-center justify-between text-sm">
            <div>
              <p className={`font-medium ${!m.active ? "line-through text-slate-400" : ""}`}>
                💊 {m.medicineName} {m.dosage && `(${m.dosage})`}
              </p>
              <p className="text-slate-400">{m.times?.join(", ")}</p>
              {m.date && (
                <p className="text-slate-400">Date: {new Date(m.date).toLocaleDateString()}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(m)} className="btn-outline text-xs py-1">
                {m.active ? "Pause" : "Resume"}
              </button>
              <button onClick={() => remove(m._id)} className="text-red-500 text-xs">Delete</button>
            </div>
          </li>
        ))}
        {!items.length && <p className="text-slate-400 text-sm">No reminders added yet.</p>}
      </ul>
    </Card>
  );
}

function PreventiveTips() {
  const tips = [
    "Wash hands regularly with soap for at least 20 seconds.",
    "Get 7-9 hours of sleep every night to support immunity.",
    "Exercise at least 30 minutes, 5 days a week.",
    "Stay up to date with recommended vaccinations.",
    "Avoid smoking and limit alcohol consumption.",
    "Eat a balanced diet rich in fruits and vegetables.",
    "Schedule regular health check-ups even when feeling well.",
  ];
  return (
    <Card title="Preventive Tips">
      <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700">
        {tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </Card>
  );
}