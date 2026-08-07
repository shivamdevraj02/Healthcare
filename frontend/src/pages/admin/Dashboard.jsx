import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";
import { Users, UserCheck, Calendar, Clock, CheckCircle, ShieldAlert } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setData(res.data));
  }, []);

  const stats = [
    { label: "Total Patients", value: data?.totalPatients, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Doctors", value: data?.totalDoctors, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Pending Doctors", value: data?.pendingDoctors, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "All Appointments", value: data?.totalAppointments, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Completed Appts", value: data?.completedAppointments, icon: CheckCircle, color: "text-brand-600", bg: "bg-brand-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-100 bg-gradient-to-r from-slate-800 to-brand-700 p-6 text-white shadow-sm">
        <h2 className="text-2xl font-bold">Admin overview</h2>
        <p className="mt-1 text-sm text-slate-200">Monitor platform activity, physician approvals, and appointment flow from one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <Card key={i} className="flex flex-col items-center justify-center border border-slate-100 p-6 text-center transition-transform hover:-translate-y-1">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${s.bg}`}>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value ?? "--"}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}