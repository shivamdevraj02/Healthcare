import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  UserCheck,
  Stethoscope,
  ShieldCheck,
  Calendar,
  Activity,
  FileText,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  Users
} from "lucide-react";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-50/50 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Dynamic Navbar */}
      <nav className="w-full border-b border-brand-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-brand-50 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-brand-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-xl text-base font-bold text-slate-700 bg-slate-50 hover:bg-brand-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-xl text-base font-bold bg-brand-600 text-white shadow-md hover:bg-brand-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 sm:pt-20 lg:pt-28 pb-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Decorative Gradient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-100 to-accent-100 border border-brand-200/60 px-4 py-2 rounded-full shadow-2xs">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-xs sm:text-sm font-extrabold text-brand-700 tracking-wide uppercase">
                Next-Gen Healthcare Management
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              A smarter bridge for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-600 via-teal-600 to-accent-500 bg-clip-text text-transparent">
                Patients & Healthcare Providers
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
              Book consultations, access AI-assisted symptom triaging, track vitals, and manage electronic health records effortlessly in one unified workspace.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white text-base sm:text-lg font-bold rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 transition-all transform hover:-translate-y-1"
              >
                Create Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-base sm:text-lg font-bold rounded-2xl shadow-xs transition-all"
              >
                Access Dashboard
              </Link>
            </div>

            {/* Live Stats Counter Strip */}
            <div className="pt-10 sm:pt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-2xs">
                <p className="text-2xl sm:text-4xl font-black text-brand-600">10k+</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Consultations</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-2xs">
                <p className="text-2xl sm:text-4xl font-black text-brand-600">99.9%</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Platform Uptime</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-2xs">
                <p className="text-2xl sm:text-4xl font-black text-brand-600">4.9 ★</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Patient Rating</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-2xs">
                <p className="text-2xl sm:text-4xl font-black text-brand-600">24/7</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">AI Health Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars / Role Features Section */}
        <section className="py-16 sm:py-24 bg-white border-y border-brand-100/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Built for Everyone in Care
              </h2>
              <p className="text-base sm:text-xl text-slate-600">
                Tailored digital tools designed specifically for patient needs and physician workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1: Patients */}
              <div className="bg-brand-50/50 rounded-3xl p-6 sm:p-8 border border-brand-100/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">For Patients</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Book specialist appointments, run AI symptom assessments, track hydration & vitals, and maintain digital medical history.
                  </p>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm sm:text-base text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Instant Telehealth Video Rooms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Personalized AI Diet & Vitals</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Doctors */}
              <div className="bg-accent-50/30 rounded-3xl p-6 sm:p-8 border border-accent-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent-500 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">For Doctors</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Manage daily consultation rosters, review patient triage requests, configure weekly shift availability, and write E-prescriptions.
                  </p>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm sm:text-base text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Live Roster Schedule View</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Digital Patient Record Access</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Security & Platform */}
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Secure & Reliable</h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    End-to-end data privacy safeguards your sensitive health records, keeping them accessible only to authorized medical teams.
                  </p>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm sm:text-base text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Protected Record Vault</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Real-Time Socket Synchronization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Workflow Steps */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              How SwasthSetu Works
            </h2>
            <p className="text-base sm:text-xl text-slate-600">
              Get started in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-black text-xl flex items-center justify-center mx-auto border border-brand-200">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Create Profile</h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Register as a patient or doctor and set up your personalized medical account.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-black text-xl flex items-center justify-center mx-auto border border-brand-200">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Consult & Schedule</h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Book appointments based on physician availability or start video consultations.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-black text-xl flex items-center justify-center mx-auto border border-brand-200">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Track & Manage Care</h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Monitor health vitals, view prescriptions, and keep records stored safely.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </span>
              <span className="text-2xl font-black text-white tracking-tight">SwasthSetu</span>
            </div>
            <p className="text-slate-400 text-base max-w-sm leading-relaxed">
              Empowering healthcare access through digital integration, video consultations, and smart health management.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-base text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact & Support</h4>
            <ul className="space-y-2.5 text-base text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" /> support@swasthsetu.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" /> Siwan, Bihar, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} SwasthSetu Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}