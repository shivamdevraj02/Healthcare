import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";

export default function Records() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/patient/records")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Error loading records:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4 text-slate-500 text-sm">Loading health records...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Health Records</h2>

      {/* Prescriptions Section */}
      <Card title="Prescriptions from Doctors">
        {summary?.prescriptions?.length ? (
          <div className="space-y-4">
            {summary.prescriptions.map((p) => (
              <div
                key={p._id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2"
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Dr. {p.doctor?.name || "Unknown Doctor"}
                    </h4>
                    {p.doctor?.specialization && (
                      <p className="text-xs text-brand-600 font-medium">
                        {p.doctor.specialization}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(p.date || p.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {p.diagnosis && (
                  <p className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">Diagnosis:</span> {p.diagnosis}
                  </p>
                )}

                {/* Medicines List */}
                {p.medicines && p.medicines.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Prescribed Medicines
                    </p>
                    <ul className="divide-y divide-slate-200/60 text-sm bg-white rounded-lg border border-slate-100 px-3">
                      {p.medicines.map((m, i) => (
                        <li key={i} className="py-2 flex justify-between items-center flex-wrap gap-1">
                          <span className="font-medium text-slate-800">{m.name}</span>
                          <span className="text-xs text-slate-500">
                            {m.dosage && `${m.dosage}`} {m.frequency && `• ${m.frequency}`}{" "}
                            {m.duration && `• ${m.duration}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {p.notes && (
                  <p className="text-xs text-slate-500 italic mt-1">
                    Doctor's Notes: {p.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No prescriptions on file yet.</p>
        )}
      </Card>

      {/* Appointment History Section */}
      <Card title="Appointment History">
        {summary?.appointments?.length ? (
          <ul className="divide-y divide-slate-100">
            {summary.appointments.map((a) => (
              <li key={a._id} className="py-3 text-sm flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">
                    Dr. {a.doctor?.name} ({a.doctor?.specialization || "General"})
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(a.date).toLocaleDateString()} at {a.time} •{" "}
                    <span className="capitalize">{a.type} Visit</span>
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${
                    a.status === "confirmed"
                      ? "bg-brand-50 text-brand-700"
                      : a.status === "completed"
                      ? "bg-slate-100 text-slate-600"
                      : a.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-sm">No appointment history.</p>
        )}
      </Card>
    </div>
  );
}