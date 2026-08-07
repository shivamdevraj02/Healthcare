import { Link } from "react-router-dom";

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

export default function Landing() {
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

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <span className="inline-block bg-accent-50 text-accent-600 text-xs font-medium px-3 py-1 rounded-full mb-4">
          Trusted by patients and doctors
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold text-ink leading-tight">
          Healthcare made simple with{" "}
          <span className="text-brand-600">SwasthSetu</span>
        </h1>
        <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
          A bridge connecting patients and doctors — book appointments,
          consult, and manage your health records, all in one place.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Get started
          </Link>
          <Link to="/login" className="btn-outline px-6 py-3 text-base">
            I already have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid sm:grid-cols-3 gap-6 flex-1">
        <div className="card">
          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-3 font-semibold">
            P
          </div>
          <h3 className="font-semibold text-ink mb-2">For patients</h3>
          <p className="text-slate-600 text-sm">
            Track your health, book consultations, and access your records
            anytime.
          </p>
        </div>
        <div className="card">
          <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center mb-3 font-semibold">
            D
          </div>
          <h3 className="font-semibold text-ink mb-2">For doctors</h3>
          <p className="text-slate-600 text-sm">
            Manage appointments, consultations, and patient history with
            ease.
          </p>
        </div>
        <div className="card">
          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-3 font-semibold">
            S
          </div>
          <h3 className="font-semibold text-ink mb-2">Secure and simple</h3>
          <p className="text-slate-600 text-sm">
            Your health data stays protected, accessible only to you and your
            care team.
          </p>
        </div>
      </section>

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