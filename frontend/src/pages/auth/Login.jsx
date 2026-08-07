import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Phone,
  MapPin,
  Loader2
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user?.role === "doctor") {
        navigate("/doctor");
      } else if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/patient");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check credentials.");
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
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-brand-600 bg-brand-50"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-all"
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

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-brand-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-brand-100/90 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-600 via-teal-500 to-accent-500" />
          
          <div className="p-6 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 items-center justify-center mb-2 shadow-2xs border border-brand-100">
                <ShieldCheck className="w-7 h-7" />
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-600 text-base sm:text-lg">
                Sign in to manage your consultations and medical workspace.
              </p>
            </div>

            {/* Success Message Banner */}
            {successMsg && !error && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error Message Banner */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm sm:text-base font-bold text-slate-800 block">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-brand-600 hover:bg-brand-700 text-white text-base sm:text-lg font-bold rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-base text-slate-600 font-medium pt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-brand-600 font-extrabold hover:underline">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="w-5 h-5 text-brand-400" />
              <span className="text-lg font-black text-white">SwasthSetu</span>
            </div>
            <p className="text-slate-400">
              Connecting patients and doctors through smart digital care.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">Quick Links</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link to="/" className="hover:text-white">Home Page</Link></li>
              <li><Link to="/register" className="hover:text-white">Register Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">Support</h4>
            <ul className="space-y-1 text-slate-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /> support@swasthsetu.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /> +91 98765 43210</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SwasthSetu Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}