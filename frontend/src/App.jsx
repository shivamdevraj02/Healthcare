import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";

export default function Appointments() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get(`/admin/appointments${status ? `?status=${status}` : ""}`).then((res) => setItems(res.data));
  }, [status]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">All Appointments</h2>
        <select className="input w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Card>
        <ul className="divide-y divide-slate-100">
          {items.map((a) => (
            <li key={a._id} className="py-2 text-sm flex justify-between">
              <span>{a.patient?.name} → Dr. {a.doctor?.name}</span>
              <span className="text-slate-400">{new Date(a.date).toLocaleDateString()} · <span className="capitalize">{a.status}</span></span>
            </li>
          ))}
          {!items.length && <p className="text-slate-400 text-sm">No appointments found.</p>}
        </ul>
      </Card>
    </div>
  );
}
