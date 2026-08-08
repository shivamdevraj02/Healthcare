import { useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    specialization: user?.specialization || "",
    qualification: user?.qualification || "",
    experienceYears: user?.experienceYears || 0,
    consultationFee: user?.consultationFee || 500,
  });
  const [msg, setMsg] = useState("");

  const save = async (e) => {
    e.preventDefault();
    await api.put("/doctor/profile", form);
    setMsg("Profile updated!");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Profile</h2>
      <Card>
        <form onSubmit={save} className="space-y-3 max-w-md">
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Phone</label>
            <input className="input mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Specialization</label>
            <input className="input mt-1" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Qualification</label>
            <input className="input mt-1" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Years of experience</label>
            <input type="number" className="input mt-1" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Consultation Fee (₹)</label>
            <input type="number" className="input mt-1" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} placeholder="Enter your fee" />
          </div>
          <button className="btn-primary">Save Changes</button>
          {msg && <p className="text-brand-600 text-sm">{msg}</p>}
        </form>
      </Card>
    </div>
  );
}