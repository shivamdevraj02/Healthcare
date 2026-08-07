import { useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    age: user?.age || "",
    gender: user?.gender || "other",
    bloodGroup: user?.bloodGroup || "",
  });
  const [msg, setMsg] = useState("");

  const save = async (e) => {
    e.preventDefault();
    await api.put("/patient/profile", form);
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
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm text-slate-600">Age</label>
              <input type="number" className="input mt-1" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="flex-1">
              <label className="text-sm text-slate-600">Gender</label>
              <select className="input mt-1" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Blood Group</label>
            <input className="input mt-1" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} />
          </div>
          <button className="btn-primary">Save Changes</button>
          {msg && <p className="text-brand-600 text-sm">{msg}</p>}
        </form>
      </Card>
    </div>
  );
}
