import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const HeartPulseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    <path d="M3.22 11H9l1.5-2.5L13 13l1.5-2.5H21.5" />
  </svg>
);

const MailIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const PhoneIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const MapPinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" />
  </svg>
);

const StethoscopeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const EyeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <path d="M2 2l20 20" />
  </svg>
);

const SpinnerIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await register(form);
      const successMsg = form.role === "doctor"
        ? response.message || "Doctor account created! Please wait for admin approval before logging in."
        : "Account created successfully! Please login.";

      navigate("/login", {
        state: { message: successMsg },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-accent-100 bg-accent-50/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center group-hover:bg-brand-600 transition-colors">
              <HeartPulseIcon size={20} />
            </span>
            <span className="text-xl font-bold text-brand-600">
              SwasthSetu
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Register form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-brand-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-brand-500 to-accent-500" />

          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <span className="inline-flex w-12 h-12 rounded-xl bg-brand-500 text-white items-center justify-center mb-3">
                <HeartPulseIcon size={24} />
              </span>
              <h1 className="text-2xl font-bold text-brand-600">Create your account</h1>
              <p className="text-slate-600 text-sm mt-1">Join SwasthSetu in a few steps</p>
            </div>

            {error && (
              <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-600">I am a</label>
                <select
                  className="input mt-1"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600">Full name</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <UserIcon size={16} />
                  </span>
                  <input
                    required
                    placeholder="Your full name"
                    className="input !pl-10"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Email</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <MailIcon size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="input !pl-10"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Phone</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <PhoneIcon size={16} />
                  </span>
                  <input
                    placeholder="+91 98765 43210"
                    className="input !pl-10"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {form.role === "doctor" && (
                <div>
                  <label className="text-sm text-slate-600">Specialization</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <StethoscopeIcon size={16} />
                    </span>
                    <input
                      placeholder="e.g. Cardiologist"
                      className="input !pl-10"
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-slate-600">Password</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <LockIcon size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="input !pl-10 !pr-10"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <SpinnerIcon />}
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-600 text-brand-100">
        <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                <HeartPulseIcon size={16} />
              </span>
              <span className="text-lg font-bold text-white">
                SwasthSetu
              </span>
            </div>
            <p className="text-brand-200 text-sm">
              A bridge connecting patients and doctors for simpler,
              accessible healthcare.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">
              Quick links
            </h4>
            <ul className="space-y-2 text-sm text-brand-200">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-brand-200">
              <li className="flex items-center gap-2">
                <MailIcon /> support@swasthsetu.com
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPinIcon /> Bihar, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-xs text-brand-300">
          © {new Date().getFullYear()} SwasthSetu. All rights reserved.
        </div>
      </footer>
    </div>
  );
}