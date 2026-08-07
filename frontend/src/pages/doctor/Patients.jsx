import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";

export default function Patients() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/doctor/patients").then((res) => setItems(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Patient Records</h2>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2">Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Blood Group</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((p) => (
              <tr key={p._id}>
                <td className="py-2 font-medium">{p.name}</td>
                <td>{p.age || "-"}</td>
                <td className="capitalize">{p.gender}</td>
                <td>{p.phone || "-"}</td>
                <td>{p.bloodGroup || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <p className="text-slate-400 text-sm mt-2">No patients yet.</p>}
      </Card>
    </div>
  );
}
