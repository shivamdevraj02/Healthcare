import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { 
  Clock, 
  Calendar, 
  Plus, 
  X, 
  CheckCircle2, 
  Sparkles,
  Save,
  Check
} from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

// Quick Presets for Doctors
const PRESET_SHIFTS = [
  { label: "Morning Shift", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"] },
  { label: "Evening Shift", slots: ["04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"] },
  { label: "Full Day Routine", slots: ["09:00 AM", "11:00 AM", "02:00 PM", "05:00 PM", "07:00 PM"] },
];

export default function Availability() {
  const { user } = useAuth();

  // Initialize Availability State
  const [schedule, setSchedule] = useState(() => {
    return DAYS.map((day) => {
      const existing = user?.availability?.find((a) => a.day === day);
      const slotsArray = existing?.slots || [];
      return {
        day,
        active: slotsArray.length > 0,
        slots: slotsArray,
        customInput: "",
      };
    });
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Toggle Day Active / Inactive
  const toggleDay = (index) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    if (!updated[index].active) {
      updated[index].slots = [];
    }
    setSchedule(updated);
  };

  // Add Single Time Slot
  const addSlot = (index) => {
    const val = schedule[index].customInput.trim();
    if (!val) return;
    const updated = [...schedule];
    if (!updated[index].slots.includes(val)) {
      updated[index].slots.push(val);
      updated[index].active = true;
    }
    updated[index].customInput = "";
    setSchedule(updated);
  };

  // Remove Slot Chip
  const removeSlot = (dayIndex, slotIndex) => {
    const updated = [...schedule];
    updated[dayIndex].slots.splice(slotIndex, 1);
    if (updated[dayIndex].slots.length === 0) {
      updated[dayIndex].active = false;
    }
    setSchedule(updated);
  };

  // Apply Quick Preset to All Active Days
  const applyPreset = (presetSlots) => {
    const updated = schedule.map((item) => {
      if (item.active) {
        return { ...item, slots: [...new Set([...item.slots, ...presetSlots])] };
      }
      return item;
    });
    setSchedule(updated);
  };

  const saveAvailability = async () => {
    setSaving(true);
    setMsg("");
    try {
      const payload = schedule
        .filter((a) => a.active && a.slots.length > 0)
        .map((a) => ({
          day: a.day,
          slots: a.slots,
        }));

      await api.put("/doctor/availability", { availability: payload });
      setMsg("Schedule updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setMsg("Failed to save schedule.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Weekly Consultation Slots</h2>
            <span className="text-[11px] font-semibold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-100">
              Live Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure your active days and consultation time slots for patient appointments.
          </p>
        </div>

        <button
          onClick={saveAvailability}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs shadow-2xs transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          {saving ? (
            <Clock className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving Changes..." : "Save Schedule"}
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {msg}
        </div>
      )}

      {/* Quick Presets Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" /> Quick Preset Templates
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_SHIFTS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.slots)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-medium text-slate-200 transition-colors"
            >
              + {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Schedule Days List */}
      <div className="space-y-4">
        {schedule.map((dayData, dayIndex) => (
          <div
            key={dayData.day}
            className={`p-5 rounded-2xl border transition-all ${
              dayData.active
                ? "bg-white border-slate-200/90 shadow-2xs"
                : "bg-slate-50/70 border-slate-200/50 opacity-75"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Day Toggle Header */}
              <div className="flex items-center gap-4 min-w-[180px]">
                {/* Switch Button */}
                <button
                  type="button"
                  onClick={() => toggleDay(dayIndex)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    dayData.active ? "bg-brand-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      dayData.active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{dayData.day}</h3>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      dayData.active ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {dayData.active ? "Available" : "Off Duty"}
                  </span>
                </div>
              </div>

              {/* Time Slots Area */}
              {dayData.active ? (
                <div className="flex-1 space-y-3">
                  {/* Slots Badge Chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    {dayData.slots.map((slot, slotIndex) => (
                      <span
                        key={slotIndex}
                        className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200/70 px-3 py-1 rounded-xl text-xs font-semibold"
                      >
                        <Clock className="w-3 h-3 text-brand-600" />
                        {slot}
                        <button
                          onClick={() => removeSlot(dayIndex, slotIndex)}
                          className="hover:text-rose-600 p-0.5 rounded-md transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {dayData.slots.length === 0 && (
                      <span className="text-xs text-slate-400 italic">
                        No slots added yet. Type below to add.
                      </span>
                    )}
                  </div>

                  {/* Add Slot Input */}
                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="e.g. 10:30 AM or 04:00 PM"
                      value={dayData.customInput}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[dayIndex].customInput = e.target.value;
                        setSchedule(updated);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSlot(dayIndex);
                        }
                      }}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => addSlot(dayIndex)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic flex-1">
                  Day marked as Off Duty. Toggle switch to enable slots.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}