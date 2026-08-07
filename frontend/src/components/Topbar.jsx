import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext"; // <-- 1. Import Socket Context
import api from "../services/api";
import { Bell, LogOut, ShieldCheck, CheckCheck, X } from "lucide-react";

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const socket = useSocket(); // <-- 2. Get socket instance
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const popupRef = useRef(null);

  // Fetch initial notifications
  const loadNotifications = () => {
    api
      .get("/notifications", {
        headers: { "Cache-Control": "no-cache" },
        params: { _t: Date.now() },
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read).length);
      })
      .catch((err) => console.error("Error loading notifications:", err));
  };

  // <-- 3. Replace setInterval polling with Socket Event Listener
  useEffect(() => {
    loadNotifications();

    if (!socket) return;

    // Server se real-time new notification aate hi list aur unread count update hoga
    const handleNewNotification = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNotifications((prev) => !prev);
  };

  const markAllRead = async () => {
    try {

      await api.put("/notifications/read-all");
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-20 shadow-xs">
      {/* Title & Status */}
      <div className="flex items-center gap-3">
        <h1 className="text-base sm:text-lg font-bold text-slate-800">
          {title}
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active Session
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 relative" ref={popupRef}>
        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={toggleNotifications}
          className={`relative p-2 rounded-xl transition-colors ${
            showNotifications
              ? "bg-brand-50 text-brand-600"
              : "text-slate-500 hover:text-brand-600 hover:bg-slate-100"
          }`}
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-accent-500 ring-2 ring-white"></span>
          )}
        </button>

        {/* Notification Popup Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Read All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length > 0 ? (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n._id}
                    className={`p-3.5 text-xs transition-colors ${
                      !n.read ? "bg-brand-50/40 font-medium" : "text-slate-600"
                    }`}
                  >
                    <p className="text-slate-800">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No notifications available.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

        {/* User Info & Avatar */}
        <div
          onClick={() => navigate("/patient/profile")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-brand-600 transition-colors">
            {user?.name?.[0]?.toUpperCase() || "P"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium capitalize">
              {user?.role ? `${user.role} Account` : "Account"}
            </p>
          </div>
        </div>

        {/* Logout Action */}
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}