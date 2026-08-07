import { useState } from "react";
import Card from "../../components/Card";

export default function Settings() {
  const [notifPref, setNotifPref] = useState(true);
  const [emailPref, setEmailPref] = useState(true);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <Card title="Notification Preferences">
        <label className="flex items-center justify-between py-2 text-sm">
          <span>Push notifications for appointments & reminders</span>
          <input type="checkbox" checked={notifPref} onChange={(e) => setNotifPref(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between py-2 text-sm">
          <span>Email updates</span>
          <input type="checkbox" checked={emailPref} onChange={(e) => setEmailPref(e.target.checked)} />
        </label>
      </Card>
      <Card title="Account">
        <p className="text-sm text-slate-500">To change your password or delete your account, contact support@swasthsetu.app</p>
      </Card>
    </div>
  );
}
