import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import Card from "../../components/Card";
import { Activity, Utensils, Download } from "lucide-react";

const TABS = ["BMI Calculator", "Diet Planner"];

export default function MaintainHealth() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      <h2 className="text-xl font-bold text-slate-800">Maintain Health & Daily Vitals</h2>
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === t
                ? "bg-brand-600 text-white shadow-2xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "BMI Calculator" && <BMICalculator />}
      {tab === "Diet Planner" && <DietPlanner />}
    </div>
  );
}

function BMICalculator() {
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(65);
  const [result, setResult] = useState(null);

  const calculate = async () => {
    const h = heightCm / 100;
    const bmi = (weightKg / (h * h)).toFixed(1);
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";
    setResult({ bmi, category });
    await api.post("/patient/health-record", { type: "bmi", data: { heightCm, weightKg, bmi, category } });
  };

  return (
    <Card title="Clinical BMI Calculator">
      <div className="flex gap-3 items-end mb-4 flex-wrap">
        <div>
          <label className="text-xs font-semibold text-slate-700">Height (cm)</label>
          <input type="number" className="input mt-1 text-xs" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Weight (kg)</label>
          <input type="number" className="input mt-1 text-xs" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </div>
        <button onClick={calculate} className="btn-primary text-xs font-bold py-2.5">Calculate BMI</button>
      </div>
      {result && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
          <p className="text-2xl font-extrabold text-brand-700">{result.bmi}</p>
          <p className="text-xs text-slate-600 mt-0.5">Category: <span className="font-bold text-slate-800">{result.category}</span></p>
        </div>
      )}
    </Card>
  );
}

function DietPlanner() {
  const planRef = useRef(null);
  const [form, setForm] = useState({
    goal: "maintain",
    preference: "Vegetarian",
    currentWeight: "",
    targetWeight: "",
    height: "",
    activityLevel: "moderate",
    allergies: "",
    medicalConditions: "",
  });
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/patient/health-record", {
        type: "diet",
        data: form,
      });
      const payload = res.data?.data;
      const details = payload?.planDetails || payload;
      if (details) {
        setPlanData(details);
      }
    } catch (err) {
      console.error("Error generating diet plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!planRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(planRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SwasthSetu_Diet_Plan_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card title="Monthly AI Diet Planner">
      <form onSubmit={generate} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">Primary Goal</label>
            <select
              className="input text-xs mt-1"
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            >
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Muscle / Weight</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Dietary Preference</label>
            <select
              className="input text-xs mt-1"
              value={form.preference}
              onChange={(e) => setForm({ ...form, preference: e.target.value })}
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Activity Level</label>
            <select
              className="input text-xs mt-1"
              value={form.activityLevel}
              onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
            >
              <option value="sedentary">Sedentary (Little/no exercise)</option>
              <option value="light">Lightly Active (1-3 days/wk)</option>
              <option value="moderate">Moderately Active (3-5 days/wk)</option>
              <option value="heavy">Very Active (6-7 days/wk)</option>
            </select>
          </div>
        </div>

        <button disabled={loading} className="btn-primary text-xs font-bold py-2.5 px-6">
          {loading ? "Generating Monthly Plan..." : "Generate Personalized Monthly AI Diet Plan"}
        </button>
      </form>

      {planData && (
        <div ref={planRef} className="space-y-4 border-t border-slate-100 pt-4 p-4 bg-white rounded-xl">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-brand-600">SwasthSetu Health</h2>
              <p className="text-xs text-slate-500">Personalized Monthly AI Diet Plan</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              {downloading ? "Exporting PDF..." : "Download Diet Plan (PDF)"}
            </button>
          </div>
          <div className="bg-brand-50 p-4 rounded-xl text-xs space-y-1 border border-brand-100">
            <p><span className="font-bold">Daily Calories:</span> {planData.dailyCalorieTarget || "2000 kcal"}</p>
            <p><span className="font-bold">Hydration Target:</span> {planData.hydrationGoal || "3.0 L/day"}</p>
          </div>
        </div>
      )}
    </Card>
  );
}