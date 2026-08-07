import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";
export default function Reports() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/admin/reports").then((res) => setData(res.data));
  }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Reports & Analytics</h2>
      
      {/* 3-Way Financial Audit & Commission Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Financial Audit & 3-Way Distribution">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-brand-50 rounded-xl border border-brand-100">
              <span className="text-slate-600 font-medium">Total Platform Earnings (Admin Commission)</span>
              <span className="font-bold text-brand-700">₹{data?.totalAdminCommission || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium">Total Doctor Liabilities (Doctor Earnings)</span>
              <span className="font-bold text-slate-800">₹{data?.totalDoctorEarnings || 0}</span>
            </div>
          </div>
        </Card>

        <Card title="Appointments by Status">
          <ul className="space-y-2">
            {data?.appointmentsByStatus?.map((s) => (
              <li key={s._id} className="flex justify-between text-sm">
                <span className="capitalize">{s._id}</span>
                <span className="font-semibold">{s.count}</span>
              </li>
            ))}
            {!data?.appointmentsByStatus?.length && <p className="text-slate-400 text-sm">No data yet.</p>}
          </ul>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Users by Role">
          <ul className="space-y-2">
            {data?.usersByRole?.map((s) => (
              <li key={s._id} className="flex justify-between text-sm">
                <span className="capitalize">{s._id}</span>
                <span className="font-semibold">{s.count}</span>
              </li>
            ))}
            {!data?.usersByRole?.length && <p className="text-slate-400 text-sm">No data yet.</p>}
          </ul>
        </Card>

        <Card title="Appointments Over Last 6 Months">
          <ul className="space-y-1 text-sm">
            {data?.appointmentsOverTime?.map((m, i) => (
              <li key={i} className="flex justify-between">
                <span>{m._id.month}/{m._id.year}</span>
                <span className="font-semibold">{m.count}</span>
              </li>
            ))}
            {!data?.appointmentsOverTime?.length && <p className="text-slate-400 text-sm">No data yet.</p>}
          </ul>
        </Card>
      </div>
    </div>
  );
}