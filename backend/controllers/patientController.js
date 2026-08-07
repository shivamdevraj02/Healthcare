const { GoogleGenAI } = require("@google/genai");
const HealthRecord = require("../models/HealthRecord");
const MedicineReminder = require("../models/MedicineReminder");
const Vaccination = require("../models/Vaccination");
const SymptomCheck = require("../models/SymptomCheck");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const User = require("../models/User");

// Initialize Gemini AI Clients
const aiDiet = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const aiSymptom = new GoogleGenAI({
  apiKey: process.env.SYMPTOM_CHECKER_GEMINI_KEY || process.env.GEMINI_API_KEY,
});

// GET /api/patient/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const patientId = req.user._id;

    const upcomingAppointment = await Appointment.findOne({
      patient: patientId,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .populate("doctor", "name specialization");

    const activeMedicines = await MedicineReminder.find({
      patient: patientId,
      active: true,
    });
    const recentRecords = await HealthRecord.find({ patient: patientId })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      healthScore: req.user.healthScore,
      upcomingAppointment,
      activeMedicines,
      recentRecords,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---- Maintain Health ----
// POST /api/patient/health-record
exports.addHealthRecord = async (req, res) => {
  try {
    const { type, data } = req.body;
    if (!["water", "sleep", "bmi", "diet", "activity"].includes(type)) {
      return res.status(400).json({ message: "Invalid record type" });
    }

    let finalData = data;

    if (type === "diet") {
      const {
        goal = "maintain",
        preference = "Vegetarian",
        currentWeight,
        targetWeight,
        height,
        activityLevel = "moderate",
        allergies = "None",
        medicalConditions = "None",
      } = data;

      const userAge = req.user?.age || 25;
      const userGender = req.user?.gender || "unspecified";

      const prompt = `You are an expert clinical nutritionist. Generate a comprehensive MONTHLY DIET PLAN for a patient with:
      - Age: ${userAge}, Gender: ${userGender}
      - Current Weight: ${currentWeight || "Not specified"} kg, Height: ${height || "Not specified"} cm
      - Goal: ${goal} weight (Target: ${targetWeight || "N/A"} kg)
      - Activity Level: ${activityLevel}
      - Dietary Preference: ${preference}
      - Allergies: ${allergies}
      - Medical Conditions: ${medicalConditions}

      Return STRICTLY a valid JSON object matching this schema:
      {
        "dailyCalorieTarget": "2000 kcal",
        "macroSplit": { "carbs": "45%", "protein": "30%", "fats": "25%" },
        "hydrationGoal": "3.0 Liters/day",
        "monthlyOverview": "Gradual metabolic reset and balanced macronutrient intake across 4 weeks.",
        "weeklyPhases": [
          { "week": 1, "focus": "Detox & Adaptation", "description": "Reduce refined sugars and increase fiber" },
          { "week": 2, "focus": "Protein Optimization", "description": "Build lean muscle mass recovery" },
          { "week": 3, "focus": "Metabolic Boost", "description": "Adjust caloric timing around activity" },
          { "week": 4, "focus": "Sustainable Maintenance", "description": "Establish long-term daily habits" }
        ],
        "dailyMealPlanTemplate": {
          "earlyMorning": "Warm lemon water + 5 soaked almonds",
          "breakfast": "Oats porridge with chia seeds & sprouts",
          "midMorningSnack": "1 bowl of seasonal fresh fruit",
          "lunch": "Brown rice/Roti, Dal, Paneer/Tofu, Salad",
          "eveningSnack": "Roasted makhana + Green tea",
          "dinner": "Soup + Grilled veggies with protein source"
        },
        "doAndDonts": {
          "dos": ["Drink 500ml water before meals", "Sleep 7-8 hours daily"],
          "donts": ["Avoid sugar after 6 PM", "Avoid fried snacks"]
        }
      }`;

      let planDetails = null;

      try {
        const response = await aiDiet.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const rawText = response.text.trim().replace(/^```json\s*|```$/g, "");
        planDetails = JSON.parse(rawText);
      } catch (aiErr) {
        console.error("AI Diet Generation Error:", aiErr);
        planDetails = {
          dailyCalorieTarget: "2000 kcal",
          macroSplit: { carbs: "50%", protein: "25%", fats: "25%" },
          hydrationGoal: "2.5 - 3.0 Liters",
          monthlyOverview: "Balanced calorie deficit/surplus roadmap.",
          weeklyPhases: [
            { week: 1, focus: "Adaptation", description: "Clean eating baseline" },
            { week: 2, focus: "Macro balance", description: "Increase protein intake" },
            { week: 3, focus: "Consistency", description: "Energy stabilization" },
            { week: 4, focus: "Maintenance", description: "Long-term sustainability" },
          ],
          dailyMealPlanTemplate: {
            earlyMorning: "Warm water + soaked almonds",
            breakfast: "High-protein oats or eggs",
            midMorningSnack: "Fresh seasonal fruit",
            lunch: "Balanced dal, rice/chapati, and salad",
            eveningSnack: "Green tea + roasted chana",
            dinner: "Light protein-rich meal with veggies",
          },
          doAndDonts: {
            dos: ["Eat slowly", "Stay hydrated"],
            donts: ["Skip meals", "Consume late night snacks"],
          },
        };
      }

      finalData = {
        goal,
        preference,
        currentWeight,
        targetWeight,
        height,
        activityLevel,
        allergies,
        medicalConditions,
        planDetails,
      };
    }

    const record = await HealthRecord.create({
      patient: req.user._id,
      type,
      data: finalData,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/patient/health-record
exports.getHealthRecords = async (req, res) => {
  try {
    const filter = { patient: req.user._id };
    if (req.query.type) filter.type = req.query.type;
    const records = await HealthRecord.find(filter)
      .sort({ date: -1 })
      .limit(60);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---- Prevent Disease ----
// POST /api/patient/symptom-check
exports.checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !symptoms.length) {
      return res
        .status(400)
        .json({ message: "Provide at least one symptom or description." });
    }

    const symptomText = Array.isArray(symptoms) ? symptoms.join(", ") : symptoms;
    const userAge = req.user?.age || "Unspecified";
    const userGender = req.user?.gender || "Unspecified";

    const prompt = `You are an AI Medical Triaging Assistant for a healthcare platform.
    Analyze the following symptoms reported by a ${userAge}-year-old ${userGender} patient:
    
    Symptoms / Description: "${symptomText}"

    Evaluate the potential clinical risk level and possible underlying conditions.
    STRICTLY return a valid JSON object matching this schema:
    {
      "riskLevel": "low" | "medium" | "high",
      "possibleConditions": ["Condition 1", "Condition 2", "Condition 3"],
      "advice": "Clear, compassionate medical advice on next steps.",
      "specialistRecommendation": "Type of doctor to consult",
      "precautions": ["Precaution 1", "Precaution 2"]
    }
    
    Important: Output ONLY raw JSON without markdown formatting.`;

    let aiResult = null;

    try {
      const response = await aiSymptom.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text.trim().replace(/^```json\s*|```$/g, "");
      aiResult = JSON.parse(rawText);
    } catch (aiErr) {
      console.error("AI Symptom Checker Error:", aiErr);
      aiResult = {
        riskLevel: "medium",
        possibleConditions: ["Symptom evaluation incomplete - please consult a doctor."],
        advice: "If symptoms persist or worsen, please schedule a consultation with a registered doctor.",
        specialistRecommendation: "General Physician",
        precautions: ["Rest and monitor symptoms closely", "Stay well hydrated"],
      };
    }

    const record = await SymptomCheck.create({
      patient: req.user._id,
      symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
      possibleConditions: aiResult.possibleConditions || [],
      riskLevel: aiResult.riskLevel || "low",
      advice: `${aiResult.advice || ""} Recommended Specialist: ${aiResult.specialistRecommendation || "General Physician"}.`,
    });

    res.status(201).json({
      _id: record._id,
      symptoms: record.symptoms,
      possibleConditions: aiResult.possibleConditions,
      riskLevel: aiResult.riskLevel,
      advice: aiResult.advice,
      specialistRecommendation: aiResult.specialistRecommendation,
      precautions: aiResult.precautions,
      createdAt: record.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/patient/symptom-check
exports.getSymptomHistory = async (req, res) => {
  try {
    const history = await SymptomCheck.find({ patient: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---- Medicine Reminders ----
exports.addMedicineReminder = async (req, res) => {
  try {
    const reminder = await MedicineReminder.create({
      ...req.body,
      patient: req.user._id,
    });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMedicineReminders = async (req, res) => {
  try {
    const reminders = await MedicineReminder.find({
      patient: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMedicineReminder = async (req, res) => {
  try {
    const reminder = await MedicineReminder.findOneAndUpdate(
      { _id: req.params.id, patient: req.user._id },
      req.body,
      { new: true }
    );
    if (!reminder) return res.status(404).json({ message: "Not found" });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMedicineReminder = async (req, res) => {
  try {
    await MedicineReminder.findOneAndDelete({
      _id: req.params.id,
      patient: req.user._id,
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---- Vaccinations ----
exports.addVaccination = async (req, res) => {
  try {
    const vaccine = await Vaccination.create({
      ...req.body,
      patient: req.user._id,
    });
    res.status(201).json(vaccine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVaccinations = async (req, res) => {
  try {
    const vaccines = await Vaccination.find({ patient: req.user._id }).sort({
      dueDate: 1,
    });
    res.json(vaccines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateVaccination = async (req, res) => {
  try {
    const vaccine = await Vaccination.findOneAndUpdate(
      { _id: req.params.id, patient: req.user._id },
      req.body,
      { new: true }
    );
    res.json(vaccine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteVaccination = async (req, res) => {
  try {
    await Vaccination.findOneAndDelete({
      _id: req.params.id,
      patient: req.user._id,
    });
    res.json({ message: "Vaccination deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---- Treat Disease ----
exports.getRecordsSummary = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate("doctor", "name specialization qualification")
      .sort({ date: -1 });

    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialization")
      .sort({ date: -1 });

    res.json({ prescriptions, appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "phone", "age", "gender", "bloodGroup", "avatar"];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteVaccination = async (req, res) => {
  try {
    const vaccine = await Vaccination.findOneAndDelete({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!vaccine) {
      return res.status(404).json({ message: "Vaccination not found" });
    }

    await Notification.deleteMany({
      user: req.user._id,
      sourceId: vaccine._id,
    });

    res.json({ message: "Vaccination deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};