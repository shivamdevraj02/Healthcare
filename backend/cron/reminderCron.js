const cron = require("node-cron");
const MedicineReminder = require("../models/MedicineReminder");
const Vaccination = require("../models/Vaccination");
const { createNotification } = require("../utils/notificationHelper");

function getLocalDateStr(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLocalTimeStr(d = new Date()) {
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const currentTime = getLocalTimeStr(now);
    const todayStr = getLocalDateStr(now);

    // console.log(`⏰ Cron check @ ${todayStr} ${currentTime}`);

    // ---- Medicine Reminders ----
    const activeReminders = await MedicineReminder.find({
      active: true,
      lastNotifiedDate: { $ne: todayStr },
    });

    // console.log(`Found ${activeReminders.length} active reminders to check`);

    for (const r of activeReminders) {
      // console.log(`Checking reminder "${r.medicineName}": times=${JSON.stringify(r.times)}, date=${r.date}, currentTime=${currentTime}`);

      if (r.date) {
        const reminderDateStr = getLocalDateStr(new Date(r.date));
        if (reminderDateStr !== todayStr) {
          console.log(`  -> date mismatch: ${reminderDateStr} !== ${todayStr}`);
          continue;
        }
      }

      const isTimeMatch = (r.times || []).includes(currentTime);
      if (!isTimeMatch) {
        console.log(`  -> time not matched yet`);
        continue;
      }

      const dosageText = r.dosage ? ` (${r.dosage})` : "";
      await createNotification(
        r.patient,
        "Time to take your medicine 💊",
        `It's time to take ${r.medicineName}${dosageText}`,
        "medicine",
        r._id
      );
      console.log(`  -> ✅ Notification sent for ${r.medicineName}`);

      r.lastNotifiedDate = todayStr;
      await r.save();
    }

    // ---- Vaccinations ----
    const dueVaccines = await Vaccination.find({ notified: { $ne: true } });

    // console.log(`Found ${dueVaccines.length} vaccines to check (not yet notified)`);

    for (const v of dueVaccines) {
      console.log(`Checking vaccine "${v.vaccineName}": dueDate=${v.dueDate}, now=${now}`);

      if (!v.dueDate) {
        console.log(`  -> no dueDate set, skipping`);
        continue;
      }

      const due = new Date(v.dueDate);
      if (due <= now) {
        await createNotification(
          v.patient,
          "Vaccination Due 💉",
          `${v.vaccineName} is due now`,
          "vaccination",
          v._id
        );
        console.log(`  -> ✅ Notification sent for ${v.vaccineName}`);
        v.notified = true;
        await v.save();
      } else {
        console.log(`  -> not due yet (due: ${due}, now: ${now})`);
      }
    }
  } catch (err) {
    console.error("Reminder cron error:", err.message);
  }
});