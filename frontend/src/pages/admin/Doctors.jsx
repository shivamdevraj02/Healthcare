import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";
import { CheckCircle2, Clock3, Trash2, UserCircle, Stethoscope } from "lucide-react";

export default function Doctors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/doctors");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (doctor) => {
    await api.put(`/admin/users/${doctor._id}`, { approvalStatus: "approved" });
    load();
  };

  const markPending = async (doctor) => {
    await api.put(`/admin/users/${doctor._id}`, { approvalStatus: "pending" });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this doctor account?")) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-600 to-accent-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-brand-50 text-sm uppercase tracking-[0.3em]">Doctor Review</p>
            <h2 className="text-2xl font-bold">Manage doctor access</h2>
            <p className="text-sm text-brand-50/90 mt-1">Approve new doctors, review pending requests, and remove accounts when needed.</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-100">Pending review</p>
            <p className="text-2xl font-semibold">{items.filter((d) => d.approvalStatus === "pending").length}</p>
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-brand-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((d) => {
                const isApproved = d.approvalStatus === "approved";
                const isPending = d.approvalStatus === "pending";

                return (
                  <tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                          <UserCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Dr. {d.name}</p>
                          <p className="text-xs text-slate-500">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{d.specialization || "General"}</td>
                    <td className="px-6 py-4 text-slate-600">{d.experienceYears || 0} Years</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                          isApproved
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : isPending
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {isApproved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                        {isApproved ? "Approved" : isPending ? "Pending" : "Rejected"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isApproved ? (
                          <button
                            onClick={() => markPending(d)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                          >
                            Pending
                          </button>
                        ) : (
                          <button
                            onClick={() => approve(d)}
                            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => remove(d._id)}
                          className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete Doctor"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && !items.length && (
            <div className="p-8 text-center text-slate-400">No doctors registered yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
}