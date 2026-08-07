import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../services/api";
import { Bell, LogOut, ShieldCheck, CheckCheck, Trash2, X, Menu } from "lucide-react";

export default function Topbar({ title, onOpenMobileMenu }) {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [clearingIds, setClearingIds] = useState([]); // Track deleting item IDs for smooth animation
  const popupRef = useRef(null);

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

  useEffect(() => {
    loadNotifications();
    if (!socket) return;
    const handleNewNotification = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };
    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  // Clear single notification with animation
  const clearSingleNotification = async (id, isRead) => {
    if (clearingIds.includes(id)) return;
    setClearingIds((prev) => [...prev, id]);

    // Wait 250ms for slide-out animation to complete
    setTimeout(async () => {
      try {
        await api.delete(`/notifications/${id}`).catch(() => {});
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        if (!isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error("Failed to delete notification:", err);
      } finally {
        setClearingIds((prev) => prev.filter((item) => item !== id));
      }
    }, 250);
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!notifications.length || isClearingAll) return;
    setIsClearingAll(true);

    setTimeout(async () => {
      try {
        await api.delete("/notifications/clear-all").catch(() => {});
        setNotifications([]);
        setUnreadCount(0);
      } catch (err) {
        console.error("Failed to clear notifications:", err);
      } finally {
        setIsClearingAll(false);
      }
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("ss_token");
    localStorage.removeItem("ss_user");
    window.location.replace("/");
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <h1 className="text-base sm:text-lg font-bold text-slate-800">
          {title}
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active Session
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 relative" ref={popupRef}>
        {/* Notification Bell Button */}
        <button
          type="button"
          onClick={() => setShowNotifications((prev) => !prev)}
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
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-top-2">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {/* Action Buttons: Read All & Clear All */}
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                    title="Clear All Notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length > 0 ? (
                <div
                  className={`divide-y divide-slate-100 transition-all duration-300 ease-out transform ${
                    isClearingAll
                      ? "opacity-0 -translate-x-4 scale-95"
                      : "opacity-100 translate-x-0 scale-100"
                  }`}
                >
                  {notifications.slice(0, 10).map((n) => {
                    const isItemClearing = clearingIds.includes(n._id);
                    return (
                      <div
                        key={n._id}
                        className={`p-3.5 text-xs flex items-center justify-between gap-3 transition-all duration-200 group ${
                          !n.read ? "bg-brand-50/40 font-medium" : "text-slate-600"
                        } ${
                          isItemClearing
                            ? "opacity-0 translate-x-6 scale-95 max-h-0 py-0 overflow-hidden"
                            : "opacity-100 translate-x-0 max-h-24"
                        }`}
                      >
                        <div className="flex-1 pr-1">
                          <p className="text-slate-800 leading-snug">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Single Notification Clear Button */}
                        <button
                          type="button"
                          onClick={() => clearSingleNotification(n._id, n.read)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-70 group-hover:opacity-100 shrink-0"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No notifications available.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

        <div
          onClick={() => {
            if (user?.role === "patient") navigate("/patient/profile");
            else if (user?.role === "doctor") navigate("/doctor/profile");
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-brand-600 transition-colors">
            {user?.name?.[0]?.toUpperCase() || "U"}
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

        <button
          type="button"
          onClick={handleLogout}
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