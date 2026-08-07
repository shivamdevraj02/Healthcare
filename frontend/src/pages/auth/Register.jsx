import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  Phone,
  Stethoscope,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Menu,
  X,
  Loader2,
  CheckCircle2,
  Info
} from "lucide-react";

// Strict Regex Patterns for Input Restrictions
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/; // 10-digit Indian mobile number starting with 6-9
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    specialization: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Email Format Validation
    if (!EMAIL_REGEX.test(form.email.trim())) {
      setError("Please enter a valid email address (e.g., user@example.com).");
      return;
    }

    // 2. Mobile Number Validation
    if (form.phone && !PHONE_REGEX.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    // 3. Password Strength Validation
    if (!PASSWORD_REGEX.test(form.password)) {
      setError(
        "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol (@$!%*?&)."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        ...form,
        email: form.email.toLowerCase().trim(),
        phone: form.phone.trim(),
      });

      const successMsg =
        form.role === "doctor"
          ? response?.message || "Doctor account created! Please wait for admin approval before logging in."
          : "Account created successfully! Please sign in.";

      navigate("/login", {
        state: { message: successMsg },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50/50 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Navbar */}
      <nav className="w-full border-b border-brand-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                SwasthSetu
              </span>
              <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest hidden sm:block">
                Digital Healthcare Bridge
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 text-white shadow-md"
            >
              Get Started Free
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-brand-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-brand-100 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-xl text-base font-bold text-slate-700 bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-xl text-base font-bold bg-brand-600 text-white shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* Main Register Workspace */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-brand-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-brand-100/90 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-600 via-teal-500 to-accent-500" />

          <div className="p-6 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 items-center justify-center mb-2 shadow-2xs border border-brand-100">
                <HeartPulse className="w-7 h-7" />
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Create Your Account
              </h1>
              <p className="text-slate-600 text-base sm:text-lg">
                Join SwasthSetu in a few quick steps.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection Tabs */}
              <div>
                <label className="text-sm sm:text-base font-bold text-slate-800 mb-2 block">
                  I am registering as a
                </label>
                <div className="grid grid-cols-3 gap-2.5 p-1.5 bg-slate-100 rounded-2xl">
                  {["patient", "doctor", "admin"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold capitalize transition-all ${
                        form.role === r
                          ? "bg-white text-brand-700 shadow-sm border border-slate-200"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    required
                    placeholder="Enter your full name"
                    className="w-full text-base sm:text-lg bg-slate-50/80 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-medium"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div>
                  <label className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full text-base sm:text-lg bg-slate-50/80 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-medium"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase().trim() })}
                    />
                  </div>
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 block">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className="w-full text-base sm:text-lg bg-slate-50/80 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-medium"
                      value={form.phone}
                      onChange={(e) => {
                        // Allow only numbers
                        const digitsOnly = e.target.value.replace(/\D/g, "");
                        if (digitsOnly.length <= 10) {
                          setForm({ ...form, phone: digitsOnly });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Specialization (Only for Doctor Role) */}
              {form.role === "doctor" && (
                <div>
                  <label className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 block">
                    Medical Specialization
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      required={form.role === "doctor"}
                      placeholder="e.g. Cardiologist, General Physician"
                      className="w-full text-base sm:text-lg bg-slate-50/80 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-medium"
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Create Password */}
              <div>
                <label className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 block">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="e.g. Swasth@2026"
                    className="w-full text-base sm:text-lg bg-slate-50/80 border border-slate-200 rounded-2xl pl-11 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-medium"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 p-1 rounded-lg transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Helper Guidelines */}
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Min 8 chars with 1 uppercase, 1 lowercase, 1 number & 1 symbol (@$!%*?&).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-brand-600 hover:bg-brand-700 text-white text-base sm:text-lg font-bold rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-base text-slate-600 font-medium pt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-600 font-extrabold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SwasthSetu Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}