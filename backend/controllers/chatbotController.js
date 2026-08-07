// Lightweight rule-based assistant for SwasthSetu.
// No external API key required — pure keyword/intent matching.
// To upgrade to a real LLM later: replace the body of getReply() with a call
// to your provider of choice (OpenAI, Anthropic, etc.) using the same signature.
//
// IMPORTANT ORDERING NOTE: getReply() returns the FIRST matching intent, so
// order matters. Emergency detection must stay near the top so phrases like
// "chest pain" or "can't breathe" never get swallowed by a generic
// symptom-check pattern like "pain" further down the list.

const INTENTS = [
  {
    name: "self_intro",
    patterns: [
      "who are you", "who r u", "who ru", "hu r u", "hu ru", "whoru",
      "what are you", "your name", "introduce yourself",
      "aap kaun ho", "tum kaun ho", "tu kaun hai",
    ],
    reply: "I'm the SwasthSetu Assistant — your virtual health helper on this platform. I can help you book appointments, check symptoms, set medicine and vaccination reminders, find doctors, and pull up your health records. Just ask!",
  },
  {
    name: "emergency",
    patterns: [
      "emergency", "chest pain", "can't breathe", "cant breathe", "breathless",
      "severe pain", "accident", "unconscious", "fainted", "heavy bleeding",
      "not breathing", "seizure",
    ],
    reply: "This sounds urgent. Please call your local emergency number or go to the nearest hospital right away — don't wait for an appointment for this.",
  },
  {
    name: "greeting",
    patterns: ["hi", "hello", "hey", "namaste", "good morning", "good evening"],
    reply: "Hi! I'm the SwasthSetu assistant. I can help you book appointments, check symptoms, set medicine reminders, or find a doctor. What do you need?",
  },
  {
    name: "book_appointment",
    patterns: ["book appointment", "appointment", "consult doctor", "see a doctor", "book a doctor"],
    reply: "You can book an appointment from Patient Dashboard → Treat Disease → Book Appointment. Pick a doctor, date, time and reason, and it'll be sent for confirmation.",
  },
  {
    name: "symptom_fever",
    patterns: ["fever", "temperature is high", "running a temperature", "feeling hot and cold"],
    reply: "Sorry to hear you're running a fever. Keep yourself hydrated and rested, and track it in Patient Dashboard → Prevent Disease → AI Symptom Checker. If it's high (over 102°F), lasts more than a couple of days, or comes with other severe symptoms, please book an appointment or visit a doctor rather than waiting it out.",
  },
  {
    name: "symptom_cold_cough",
    patterns: ["cough", "cold", "sore throat", "runny nose", "blocked nose", "sneezing", "flu"],
    reply: "Sounds like a cold/cough — rest, warm fluids, and steam inhalation usually help. You can log it under Patient Dashboard → Prevent Disease → AI Symptom Checker. If it doesn't improve in a few days, or breathing feels difficult, please book an appointment.",
  },
  {
    name: "symptom_stomach",
    patterns: ["stomach ache", "stomach pain", "vomit", "vomiting", "nausea", "diarrhea", "loose motion", "food poisoning", "indigestion"],
    reply: "That sounds uncomfortable. Stay hydrated (ORS/water helps a lot) and note it down in Patient Dashboard → Prevent Disease → AI Symptom Checker. If there's blood, high fever alongside it, or it doesn't settle in a day, please book an appointment or seek care soon.",
  },
  {
    name: "symptom_pain_generic",
    patterns: ["headache", "body ache", "body pain", "joint pain", "back pain", "muscle pain"],
    reply: "Sorry you're dealing with that. Rest and note the details in Patient Dashboard → Prevent Disease → AI Symptom Checker. If the pain is severe, sudden, or doesn't ease up, please book an appointment so a doctor can take a look.",
  },
  {
    name: "symptom_check",
    patterns: [
      "symptom", "not feeling well", "feeling unwell", "unwell", "feeling ill",
      "i am ill", "i'm ill", "feeling sick", "i am sick", "i'm sick",
      "suffering from", "down with", "feeling weak", "feeling low",
      "feeling bad", "not okay", "not ok", "dizzy", "dizziness", "fatigue",
      "tired all the time", "weakness",
    ],
    reply: "Sorry to hear that. For a quick check, go to Patient Dashboard → Prevent Disease → AI Symptom Checker and list your symptoms separated by commas. If symptoms are severe or getting worse, please book an appointment or seek emergency care right away — I can't diagnose anything myself.",
  },
  {
    name: "medicine_reminder",
    patterns: ["medicine", "reminder", "dose", "tablet", "medication"],
    reply: "You can set up medicine reminders under Patient Dashboard → Prevent Disease → Medicine Reminder. Add the name, dosage, and times, and it'll track them for you.",
  },
  {
    name: "vaccination",
    patterns: ["vaccine", "vaccination", "immunization", "jab"],
    reply: "Vaccination reminders are under Patient Dashboard → Prevent Disease → Vaccination Reminder. You can add a vaccine name and due date and mark it done later.",
  },
  {
    name: "find_doctor",
    patterns: ["doctor", "specialist", "physician", "cardiologist", "find a doctor"],
    reply: "You can see the list of available doctors while booking an appointment (Treat Disease → Book Appointment) — it shows each doctor's specialization.",
  },
  {
    name: "records",
    patterns: ["prescription", "records", "history", "report"],
    reply: "Your prescriptions and appointment history are under Patient Dashboard → Health Records (or Treat Disease → E-Prescription).",
  },
  {
    name: "thanks",
    patterns: ["thanks", "thank you", "thik hai", "ok thanks"],
    reply: "You're welcome! Let me know if you need anything else.",
  },
];

const FALLBACK =
  "I'm not sure about that yet. Try asking about appointments, symptoms, medicine reminders, vaccinations, or doctors — or use the dashboard menu on the left.";

function getReply(message) {
  const text = (message || "").toLowerCase();
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => text.includes(p))) {
      return intent.reply;
    }
  }
  return FALLBACK;
}

// POST /api/chatbot/message  { message }
exports.sendMessage = (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "message is required" });
  }
  const reply = getReply(message);
  res.json({ reply });
};