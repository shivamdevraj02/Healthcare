import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/Card";
import { useSocket } from "../../context/SocketContext";

export default function Notifications() {
  const socket = useSocket();
  const [items, setItems] = useState([]);

  // Notifications fetch karne ka function
  const load = () =>
    api
      .get("/notifications", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        params: { _t: Date.now() },
      })
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching notifications:", err));

  useEffect(() => {
    // Initial fetch on page load
    load();

    if (!socket) return;

    // Real-time Event Listener: Naye notification aate hi list me top par push kar dega
    const handleNewNotification = (newNotif) => {
      setItems((prev) => [newNotif, ...prev]);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  const markAll = async () => {
    try {
      await api.put("/notifications/read-all");
      load();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
        {items.some((n) => !n.read) && (
          <button onClick={markAll} className="btn-outline text-xs font-semibold py-1.5 px-3">
            Mark all read
          </button>
        )}
      </div>

      <Card>
        <ul className="divide-y divide-slate-100">
          {items.map((n) => (
            <li
              key={n._id}
              className={`py-3.5 text-sm transition-colors ${
                !n.read ? "font-semibold text-slate-900 bg-brand-50/30 px-3 -mx-3 rounded-lg" : "text-slate-600"
              }`}
            >
              <p>{n.message}</p>
              <p className="text-xs text-slate-400 mt-1 font-normal">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
          {!items.length && (
            <p className="text-slate-400 text-sm py-6 text-center">No notifications yet.</p>
          )}
        </ul>
      </Card>
    </div>
  );
}