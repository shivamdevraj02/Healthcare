import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";

export default function Prescription() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [form, setForm] = useState({ patient: "", diagnosis: "", notes: "" });
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [msg, setMsg] = useState("");

  const load = () => {
    api.get("/doctor/patients").then((res) => setPatients(res.data));
    api.get("/doctor/prescriptions").then((res) => setPrescriptions(res.data));
  };
  useEffect(() => { load(); }, []);

  const updateMed = (i, field, val) => {
    const copy = [...medicines];
    copy[i][field] = val;
    setMedicines(copy);
  };

  const addMedRow = () => setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.patient) return;
    await api.post("/doctor/prescriptions", { ...form, medicines });
    setMsg("Prescription created!");
    setForm({ patient: "", diagnosis: "", notes: "" });
    setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
    load();
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Write Prescription">
        <form onSubmit={submit} className="space-y-3">
          <select className="input" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })}>
            <option value="">Select patient</option>
            {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input className="input" placeholder="Diagnosis" value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />

          {medicines.map((m, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="Medicine name" value={m.name} onChange={(e) => updateMed(i, "name", e.target.value)} />
              <input className="input" placeholder="Dosage" value={m.dosage} onChange={(e) => updateMed(i, "dosage", e.target.value)} />
              <input className="input" placeholder="Frequency" value={m.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} />
              <input className="input" placeholder="Duration" value={m.duration} onChange={(e) => updateMed(i, "duration", e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={addMedRow} className="btn-outline text-sm">+ Add medicine</button>

          <textarea className="input" placeholder="Additional notes" value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <button className="btn-primary w-full">Save Prescription</button>
          {msg && <p className="text-brand-600 text-sm text-center">{msg}</p>}
        </form>
      </Card>

      <Card title="Recent Prescriptions">
        <ul className="divide-y divide-slate-100">
          {prescriptions.map((p) => (
            <li key={p._id} className="py-2 text-sm">
              <p className="font-medium">{p.patient?.name} — {new Date(p.date).toLocaleDateString()}</p>
              <p className="text-slate-500">{p.diagnosis}</p>
            </li>
          ))}
          {!prescriptions.length && <p className="text-slate-400 text-sm">No prescriptions yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
