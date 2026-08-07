import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";

export default function Consultation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");

  const joinRoom = (e) => {
    e.preventDefault();
    const trimmedRoomId = roomId.trim();

    if (!trimmedRoomId) {
      setMessage("Please enter the room ID for the consultation.");
      return;
    }

    setMessage("");
    navigate(`/room/${encodeURIComponent(trimmedRoomId)}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Video Consultation</h2>
      <Card>
        <p className="text-slate-500 text-sm mb-4">
          Logged in as: <span className="font-semibold">{user?.email || "Doctor"}</span>
        </p>

        <form onSubmit={joinRoom} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter the shared room ID"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="btn-primary w-full">Join Consultation Room</button>
          {message && <p className="text-sm text-amber-600">{message}</p>}
        </form>

        <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          Ask the patient for the same room ID and enter it here to join the live consultation.
        </div>
      </Card>
    </div>
  );
}
