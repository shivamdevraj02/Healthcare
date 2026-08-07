import Card from "../../components/Card";

export default function Settings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <Card title="Platform Settings">
        <p className="text-sm text-slate-500">
          Platform-wide configuration (branding, notification templates, integrations) goes here.
          Wire this up to a Settings model/route in the backend as needed.
        </p>
      </Card>
    </div>
  );
}
