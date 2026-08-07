import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";

export default function Users() {
  const [items, setItems] = useState([]);
  const [role, setRole] = useState("");

  const load = () => api.get(`/admin/users${role ? `?role=${role}` : ""}`).then((res) => setItems(res.data));
  useEffect(() => { load(); }, [role]);

  const toggleActive = async (u) => {
    await api.put(`/admin/users/${u._id}`, { isActive: !u.isActive });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Users</h2>
        <select className="input w-40" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((u) => (
              <tr key={u._id}>
                <td className="py-2 font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-600"}`}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-right">
                  <button onClick={() => toggleActive(u)} className="btn-outline text-xs py-1 mr-2">
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => remove(u._id)} className="text-red-500 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <p className="text-slate-400 text-sm mt-2">No users found.</p>}
      </Card>
    </div>
  );
}
