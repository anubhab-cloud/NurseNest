import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, Calendar, MapPin, FileText, Pill, Video,
  Users, Bot, Zap, CreditCard, Settings, Plus, Bell,
  LogOut, Activity, Clock, CheckCircle, AlertCircle,
  ChevronRight, Phone, Star, Send, Mic, X, Menu,
  TrendingUp, Shield, Download, RefreshCw, Navigation,
  MessageSquare, User, Home, Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const appointments = [
  { id: 1, service: 'Elder Care', caregiver: 'Dr. Priya Nair', avatar: 'PN', date: 'Today', time: '9:00 AM', status: 'confirmed', amount: '₹499', rating: 4.9, eta: '28 min' },
  { id: 2, service: 'Physiotherapy', caregiver: 'Mr. Rajan Pillai', avatar: 'RP', date: 'Jun 22', time: '11:00 AM', status: 'pending', amount: '₹799', rating: 4.8, eta: null },
  { id: 3, service: 'Nursing Care', caregiver: 'Ms. Anita Sharma', avatar: 'AS', date: 'Jun 15', time: '10:00 AM', status: 'completed', amount: '₹699', rating: 4.7, eta: null },
  { id: 4, service: 'Doctor Consultation', caregiver: 'Dr. Suresh Kumar', avatar: 'SK', date: 'Jun 10', time: '3:00 PM', status: 'completed', amount: '₹399', rating: 5.0, eta: null },
];

const healthRecords = [
  { date: 'Jun 17', bp: '120/80', hr: 72, spo2: 98, temp: 36.6, weight: 68, nurse: 'Dr. Priya Nair' },
  { date: 'Jun 14', bp: '122/82', hr: 74, spo2: 97, temp: 36.8, weight: 68.2, nurse: 'Ms. Anita Sharma' },
  { date: 'Jun 10', bp: '118/78', hr: 70, spo2: 99, temp: 36.5, weight: 67.8, nurse: 'Dr. Priya Nair' },
  { date: 'Jun 7', bp: '125/85', hr: 76, spo2: 96, temp: 37.0, weight: 68.5, nurse: 'Mr. Rajan Pillai' },
];

const medicines = [
  { name: 'Metformin 500mg', time: '8:00 AM', taken: true, type: 'Diabetes', color: 'bg-blue-100 text-blue-700' },
  { name: 'Amlodipine 5mg', time: '8:00 AM', taken: true, type: 'Blood Pressure', color: 'bg-green-100 text-green-700' },
  { name: 'Vitamin D3', time: '12:00 PM', taken: false, type: 'Supplement', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Atorvastatin 10mg', time: '9:00 PM', taken: false, type: 'Cholesterol', color: 'bg-purple-100 text-purple-700' },
  { name: 'Aspirin 75mg', time: '9:00 PM', taken: false, type: 'Blood Thinner', color: 'bg-red-100 text-red-700' },
];

const invoices = [
  { id: 'HC10234', date: 'Jun 17', service: 'Elder Care', amount: '₹499', status: 'paid' },
  { id: 'HC10198', date: 'Jun 10', service: 'Nursing Care', amount: '₹699', status: 'paid' },
  { id: 'HC10156', date: 'Jun 5', service: 'Physiotherapy', amount: '₹799', status: 'pending' },
  { id: 'HC10112', date: 'May 28', service: 'Doctor Consultation', amount: '₹399', status: 'paid' },
];

const familyMembers = [
  { name: 'Ramesh Kumar', relation: 'Father', age: 68, condition: 'Diabetes, Hypertension', lastVisit: 'Jun 17', status: 'stable', avatar: 'RK' },
  { name: 'Sunita Kumar', relation: 'Mother', age: 65, condition: 'Arthritis', lastVisit: 'Jun 10', status: 'stable', avatar: 'SK' },
  { name: 'Arjun Kumar', relation: 'Son', age: 8, condition: 'Healthy', lastVisit: 'May 20', status: 'good', avatar: 'AK' },
];

const statusStyle: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  stable: 'bg-blue-100 text-blue-700',
  good: 'bg-green-100 text-green-700',
};

const aiResponses: Record<string, string> = {
  'headache':     "Headaches can have many causes. Stay hydrated and rest. If it persists over 2 days or is severe, I recommend a doctor consultation. Should I book one for you? 💊",
  'fever':        "A temperature above 38°C (100.4°F) is a fever. Stay hydrated, rest, and take paracetamol if needed. If above 39°C or lasting more than 3 days, please see a doctor. Shall I book an emergency home visit? 🌡️",
  'bp':           "Your last recorded BP was 120/80 mmHg (Jun 17) — that's in the normal range! ✅ Remember to take your Amlodipine at 8 AM. Regular monitoring is key.",
  'medicines':    "You have 3 medicines due today: ✅ Metformin & Amlodipine taken this morning. ⏰ Vitamin D3 at 12 PM and Atorvastatin + Aspirin at 9 PM are pending.",
  'appointment':  "Your next appointment is Today at 9:00 AM — Dr. Priya Nair for Elder Care. She's 28 minutes away! 📍 I'll notify you when she's 10 minutes out.",
  'default':      "I'm your AI Health Assistant! I can help you with:\n• Medicine reminders 💊\n• Health record summaries 📋\n• Appointment info 📅\n• Symptom guidance 🩺\n\nWhat would you like to know?",
};

// ─── Sidebar nav items ─────────────────────────────────────────────────────────
const navItems = [
  { icon: Home,        label: 'Overview',              key: 'overview' },
  { icon: Calendar,    label: 'Appointments',           key: 'appointments' },
  { icon: MapPin,      label: 'Live Tracking',          key: 'tracking' },
  { icon: Activity,    label: 'Health Records',         key: 'health' },
  { icon: Pill,        label: 'Medicine Reminders',     key: 'medicines' },
  { icon: Video,       label: 'Video Consultations',    key: 'video' },
  { icon: Users,       label: 'Family Monitoring',      key: 'family' },
  { icon: Bot,         label: 'AI Health Assistant',    key: 'ai' },
  { icon: Zap,         label: 'Emergency SOS',          key: 'sos' },
  { icon: CreditCard,  label: 'Payments & Invoices',    key: 'payments' },
  { icon: Settings,    label: 'Settings',               key: 'settings' },
];

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } } as const;
const stagger = { visible: { transition: { staggerChildren: 0.07 } } } as const;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive]         = useState('overview');
  const [sideOpen, setSideOpen]     = useState(false);
  const [aiInput, setAiInput]       = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: "Hi! I'm your AI Health Assistant. How can I help you today? 👋" },
  ]);
  const [aiLoading, setAiLoading]   = useState(false);
  const [sosActive, setSosActive]   = useState(false);
  const [sosTimer, setSosTimer]     = useState(5);
  const [medicineTaken, setMedicineTaken] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [videoCallActive, setVideoCallActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Close sidebar on route tab change (mobile)
  useEffect(() => { setSideOpen(false); }, [active]);

  // Lock scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = sideOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sideOpen]);

  // Auto scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

  // SOS countdown
  useEffect(() => {
    if (!sosActive) return;
    if (sosTimer === 0) { setSosActive(false); setSosTimer(5); return; }
    const t = setTimeout(() => setSosTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sosActive, sosTimer]);

  const sendAI = () => {
    const q = aiInput.trim(); if (!q) return;
    setAiMessages(m => [...m, { role: 'user', text: q }]);
    setAiInput(''); setAiLoading(true);
    setTimeout(() => {
      const key = Object.keys(aiResponses).find(k => q.toLowerCase().includes(k)) || 'default';
      setAiMessages(m => [...m, { role: 'bot', text: aiResponses[key] }]);
      setAiLoading(false);
    }, 900);
  };

  const navTo = (key: string) => { setActive(key); setSideOpen(false); };

  // ─── Sidebar ──────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold font-display text-gray-900">HomeCare<span className="text-primary-600">+</span></span>
        </Link>
        <button onClick={() => setSideOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* User card */}
      <div className="mx-4 mt-4 mb-3 bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-600 font-semibold">Active Plan: Standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto pb-4">
        {navItems.map(item => (
          <button key={item.key} onClick={() => navTo(item.key)}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all mb-0.5
              ${active === item.key
                ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            style={{ minHeight: 'unset', minWidth: 'unset' }}
          >
            <item.icon className={`w-4 h-4 flex-shrink-0 ${active === item.key ? 'text-white' : 'text-gray-400'}`} />
            <span>{item.label}</span>
            {item.key === 'sos' && (
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <Home className="w-4 h-4" /> Back to Website
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
          style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );

  // ─── Overview ────────────────────────────────────────────────────────────────
  const Overview = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fade} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">{greeting}, {user?.firstName}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your health overview for today.</p>
        </div>
        <Link to="/booking" className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm" style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <Plus className="w-4 h-4" /> Book Service
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fade} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Bookings', value: '12', icon: Calendar, color: 'bg-blue-50 text-blue-600', trend: '+2 this month' },
          { label: 'Next Visit', value: 'Today 9AM', icon: Clock, color: 'bg-green-50 text-green-600', trend: 'Dr. Priya Nair' },
          { label: 'Health Score', value: '92/100', icon: Activity, color: 'bg-teal-50 text-teal-600', trend: '↑ 3pts this week' },
          { label: 'Loyalty Points', value: '450 pts', icon: Star, color: 'bg-purple-50 text-purple-600', trend: '₹45 cashback' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-display text-gray-900 leading-tight">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-gray-400 mt-1">{s.trend}</div>
          </div>
        ))}
      </motion.div>

      {/* Next appointment banner */}
      <motion.div variants={fade} className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-3xl p-5 sm:p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">👨‍⚕️</div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span className="text-primary-100 text-xs font-semibold uppercase tracking-wide">Next Appointment — TODAY</span>
              </div>
              <p className="font-bold text-white text-lg font-display">Dr. Priya Nair · Elder Care</p>
              <p className="text-primary-100 text-sm">9:00 AM · Arriving in 28 mins</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navTo('tracking')} className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Navigation className="w-3.5 h-3.5" /> Track
            </button>
            <button className="bg-white text-primary-700 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-1.5" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Phone className="w-3.5 h-3.5" /> Call
            </button>
          </div>
        </div>
      </motion.div>

      {/* Medicine & Recent rows */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Today's medicines */}
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 font-display">Today's Medicines</h3>
            <button onClick={() => navTo('medicines')} className="text-primary-600 text-xs font-semibold hover:underline" style={{ minHeight: 'unset', minWidth: 'unset' }}>View All</button>
          </div>
          <div className="space-y-2.5">
            {medicines.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${m.color} flex items-center justify-center flex-shrink-0`}>
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.time}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${medicineTaken[i] ?? !m.taken ? 'bg-gray-100' : 'bg-green-100'}`}>
                  {(medicineTaken[i] !== undefined ? medicineTaken[i] : m.taken)
                    ? <CheckCircle className="w-4 h-4 text-green-600" />
                    : <Clock className="w-3.5 h-3.5 text-gray-400" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Latest vitals */}
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 font-display">Latest Vitals</h3>
            <button onClick={() => navTo('health')} className="text-primary-600 text-xs font-semibold hover:underline" style={{ minHeight: 'unset', minWidth: 'unset' }}>View All</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: '❤️', status: 'Normal' },
              { label: 'Heart Rate', value: '72', unit: 'bpm', icon: '💓', status: 'Normal' },
              { label: 'SpO2', value: '98', unit: '%', icon: '🫁', status: 'Normal' },
              { label: 'Temperature', value: '36.6', unit: '°C', icon: '🌡️', status: 'Normal' },
            ].map(v => (
              <div key={v.label} className="bg-gray-50 rounded-2xl p-3">
                <div className="text-lg mb-1">{v.icon}</div>
                <div className="text-base font-bold text-gray-900">{v.value} <span className="text-xs text-gray-400 font-normal">{v.unit}</span></div>
                <div className="text-[10px] text-gray-500">{v.label}</div>
                <div className="text-[10px] text-green-600 font-semibold mt-0.5">{v.status}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent bookings */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 font-display">Recent Appointments</h3>
          <button onClick={() => navTo('appointments')} className="text-primary-600 text-xs font-semibold hover:underline" style={{ minHeight: 'unset', minWidth: 'unset' }}>View All</button>
        </div>
        <div className="divide-y divide-gray-50">
          {appointments.slice(0, 3).map(b => (
            <div key={b.id} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-teal-100 rounded-xl flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">{b.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{b.service}</p>
                  <p className="text-xs text-gray-400">{b.caregiver} · {b.date} {b.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`badge ${statusStyle[b.status]} capitalize`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // ─── Appointments ─────────────────────────────────────────────────────────────
  const Appointments = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade} className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Upcoming Appointments</h1>
        <Link to="/booking" className="btn-primary text-sm py-2.5 px-4 flex items-center gap-1.5" style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <Plus className="w-4 h-4" /> Book New
        </Link>
      </motion.div>
      {appointments.map((b, i) => (
        <motion.div key={b.id} variants={fade} transition={{ delay: i * 0.06 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-teal-100 rounded-2xl flex items-center justify-center text-lg font-bold text-primary-700 flex-shrink-0">{b.avatar}</div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 font-display">{b.service}</h3>
                  <span className={`badge ${statusStyle[b.status]} capitalize`}>{b.status}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{b.caregiver}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.time}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{b.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900">{b.amount}</span>
              {b.status === 'confirmed' && (
                <>
                  <button onClick={() => navTo('tracking')} className="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-primary-100 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                    <Navigation className="w-3.5 h-3.5" /> Track
                  </button>
                  <button onClick={() => navTo('video')} className="flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-teal-100 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                    <Video className="w-3.5 h-3.5" /> Video Call
                  </button>
                </>
              )}
              {b.status === 'completed' && (
                <button className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-2 rounded-xl" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <Star className="w-3.5 h-3.5" /> Rate
                </button>
              )}
            </div>
          </div>
          {b.eta && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-600 font-semibold">Caregiver is on the way — arrives in {b.eta}</span>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );

  // ─── Live Tracking ────────────────────────────────────────────────────────────
  const LiveTracking = () => {
    const [progress, setProgress] = useState(62);
    useEffect(() => { const t = setInterval(() => setProgress(p => Math.min(p + 1, 95)), 3000); return () => clearInterval(t); }, []);
    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
        <motion.div variants={fade}><h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Live Caregiver Tracking</h1></motion.div>
        {/* Map placeholder */}
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center">
            {/* Simulated map */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#e2e8f0 0,#e2e8f0 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#e2e8f0 0,#e2e8f0 1px,transparent 0,transparent 50%)', backgroundSize: '32px 32px' }} />
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              <path d="M 60 240 Q 140 200 180 160 Q 220 120 260 100 Q 300 80 340 60" stroke="#3897f4" strokeWidth="3" fill="none" strokeDasharray="8 4" opacity="0.7" />
              {/* Start dot */}
              <circle cx="60" cy="240" r="8" fill="#22c55e" />
              <circle cx="60" cy="240" r="14" fill="#22c55e" opacity="0.2" />
              {/* Caregiver dot (animated position) */}
              <circle cx="200" cy="148" r="10" fill="#3897f4" />
              <circle cx="200" cy="148" r="20" fill="#3897f4" opacity="0.2" />
              {/* Destination */}
              <circle cx="340" cy="60" r="8" fill="#f43f5e" />
              <circle cx="340" cy="60" r="14" fill="#f43f5e" opacity="0.2" />
            </svg>
            {/* Labels */}
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-md px-3 py-2 text-xs font-semibold text-green-700 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full" /> Dr. Priya Nair
            </div>
            <div className="absolute top-6 right-6 bg-white rounded-xl shadow-md px-3 py-2 text-xs font-semibold text-red-600 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Your Home
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900">Dr. Priya Nair is on the way</p>
                <p className="text-sm text-gray-500">Elder Care · Started 12 mins ago</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-display text-primary-600">28 min</p>
                <p className="text-xs text-gray-400">ETA 9:28 AM</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 1 }} className="bg-gradient-to-r from-primary-500 to-teal-500 h-2 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[['Distance', '3.2 km'], ['Speed', '28 km/h'], ['Route', 'Optimal']].map(([l, v]) => (
                <div key={l} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="font-bold text-gray-900 text-sm">{v}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-primary-50 text-primary-700 py-3 rounded-xl text-sm font-semibold hover:bg-primary-100 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                <Phone className="w-4 h-4" /> Call Caregiver
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-teal-50 text-teal-700 py-3 rounded-xl text-sm font-semibold hover:bg-teal-100 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                <MessageSquare className="w-4 h-4" /> Message
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ─── Health Records ───────────────────────────────────────────────────────────
  const HealthRecords = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade} className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Health Records</h1>
        <button className="flex items-center gap-1.5 text-primary-600 text-sm font-semibold border border-primary-200 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </motion.div>
      {/* Vitals chart */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 font-display mb-4">Vitals Trend (Last 4 Visits)</h3>
        <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs text-gray-400 font-medium">
          {healthRecords.map(r => <div key={r.date}>{r.date}</div>)}
        </div>
        {[
          { label: 'Heart Rate (bpm)', key: 'hr' as const, color: 'bg-red-400', max: 100 },
          { label: 'SpO2 (%)', key: 'spo2' as const, color: 'bg-blue-400', max: 100 },
        ].map(metric => (
          <div key={metric.label} className="mb-4">
            <p className="text-xs text-gray-500 mb-2">{metric.label}</p>
            <div className="grid grid-cols-4 gap-2">
              {healthRecords.map(r => (
                <div key={r.date} className="flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-gray-900">{r[metric.key]}</span>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${metric.color} h-2 rounded-full`} style={{ width: `${(r[metric.key] / metric.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
      {/* Records table */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100"><h3 className="font-bold text-gray-900 font-display">Recorded Vitals</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              {['Date', 'BP', 'HR', 'SpO2', 'Temp', 'Nurse'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {healthRecords.map(r => (
                <tr key={r.date} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.date}</td>
                  <td className="px-4 py-3 text-gray-700">{r.bp}</td>
                  <td className="px-4 py-3 text-gray-700">{r.hr} bpm</td>
                  <td className="px-4 py-3"><span className={`badge ${r.spo2 >= 97 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.spo2}%</span></td>
                  <td className="px-4 py-3 text-gray-700">{r.temp}°C</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.nurse.split(' ')[0]} {r.nurse.split(' ')[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );

  // ─── Medicine Reminders ───────────────────────────────────────────────────────
  const MedicineReminders = () => {
    const [taken, setTaken] = useState<Record<number, boolean>>(medicineTaken);
    const toggle = (i: number) => { const n = { ...taken, [i]: !taken[i] }; setTaken(n); setMedicineTaken(n); };
    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
        <motion.div variants={fade} className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Medicine Reminders</h1>
          <button className="flex items-center gap-1.5 btn-primary text-sm py-2.5 px-4" style={{ minHeight: 'unset', minWidth: 'unset' }}>
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </motion.div>
        {/* Progress */}
        <motion.div variants={fade} className="bg-gradient-to-r from-teal-600 to-primary-600 rounded-3xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-teal-100 text-sm">Today's Progress</p><p className="text-2xl font-bold font-display">{Object.values(taken).filter(Boolean).length} / {medicines.length} taken</p></div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${(Object.values(taken).filter(Boolean).length / medicines.length) * 88} 88`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-bold">{Math.round((Object.values(taken).filter(Boolean).length / medicines.length) * 100)}%</span>
            </div>
          </div>
        </motion.div>
        {/* List */}
        <div className="space-y-3">
          {medicines.map((m, i) => (
            <motion.div key={i} variants={fade} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 transition-all ${taken[i] ? 'border-green-200 bg-green-50/50' : 'border-gray-100'}`}>
              <div className={`w-11 h-11 rounded-2xl ${m.color} flex items-center justify-center flex-shrink-0`}>
                <Pill className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{m.time}</span>
                  <span className={`badge ${m.color} text-[10px] px-2 py-0.5`}>{m.type}</span>
                </div>
              </div>
              <button onClick={() => toggle(i)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all font-bold text-sm ${taken[i] ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                style={{ minHeight: 'unset', minWidth: 'unset' }}>
                {taken[i] ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // ─── Video Consultations ──────────────────────────────────────────────────────
  const VideoConsultations = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade}><h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Video Consultations</h1></motion.div>
      {!videoCallActive ? (
        <>
          <motion.div variants={fade} className="bg-gradient-to-br from-primary-600 to-teal-600 rounded-3xl p-6 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold font-display mb-2">Start a Video Call</h2>
            <p className="text-primary-100 text-sm mb-5">Connect with your caregiver or consult a doctor instantly.</p>
            <button onClick={() => setVideoCallActive(true)} className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-primary-50 transition-colors shadow-lg" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              Start Call Now
            </button>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Dr. Priya Nair', role: 'Home Nurse', avatar: 'PN', status: 'Available', tag: 'Your Caregiver' },
              { name: 'Dr. Suresh Kumar', role: 'General Physician', avatar: 'SK', status: 'Available', tag: 'On Demand' },
              { name: 'Dr. Anjali Singh', role: 'Physiotherapist', avatar: 'AS', status: 'Busy', tag: 'Specialist' },
              { name: 'Dr. Ramesh Gupta', role: 'Cardiologist', avatar: 'RG', status: 'Available', tag: 'Specialist' },
            ].map((d, i) => (
              <motion.div key={i} variants={fade} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-teal-100 rounded-full flex items-center justify-center font-bold text-primary-700 flex-shrink-0">{d.avatar}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.role}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${d.status === 'Available' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-500">{d.status}</span>
                  </div>
                </div>
                <button onClick={() => setVideoCallActive(true)} disabled={d.status !== 'Available'}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${d.status === 'Available' ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <Video className="w-3.5 h-3.5" /> Call
                </button>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-3xl overflow-hidden">
          {/* Video area */}
          <div className="relative h-64 sm:h-80 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 animate-pulse-slow">PN</div>
              <p className="font-semibold">Dr. Priya Nair</p>
              <p className="text-gray-400 text-sm">00:03:24</p>
            </div>
            {/* Self preview */}
            <div className="absolute bottom-4 right-4 w-20 h-28 bg-gray-700 rounded-xl flex items-center justify-center border-2 border-gray-600">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          {/* Controls */}
          <div className="p-5 flex items-center justify-center gap-4">
            {[
              { icon: Mic, label: 'Mute', color: 'bg-gray-700 text-white' },
              { icon: Video, label: 'Camera', color: 'bg-gray-700 text-white' },
              { icon: MessageSquare, label: 'Chat', color: 'bg-gray-700 text-white' },
              { icon: Phone, label: 'End', color: 'bg-red-500 text-white', action: () => setVideoCallActive(false) },
            ].map((c, i) => (
              <button key={i} onClick={c.action}
                className={`w-12 h-12 rounded-full ${c.color} flex items-center justify-center hover:opacity-90 transition-opacity`}
                style={{ minHeight: 'unset', minWidth: 'unset' }}>
                <c.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // ─── Family Monitoring ────────────────────────────────────────────────────────
  const FamilyMonitoring = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade} className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Family Monitoring</h1>
        <button className="btn-primary text-sm py-2.5 px-4 flex items-center gap-1.5" style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </motion.div>
      {familyMembers.map((m, i) => (
        <motion.div key={i} variants={fade} transition={{ delay: i * 0.07 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-teal-100 rounded-2xl flex items-center justify-center font-bold text-primary-700 text-lg flex-shrink-0">{m.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900 font-display">{m.name}</h3>
                <span className="badge bg-gray-100 text-gray-600">{m.relation}</span>
                <span className={`badge ${statusStyle[m.status]}`}>{m.status}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Age {m.age} · {m.condition}</p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />Last visit: {m.lastVisit}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
            {[{ v: '120/80', l: 'Blood Pressure' }, { v: '72 bpm', l: 'Heart Rate' }, { v: '98%', l: 'SpO2' }].map(v => (
              <div key={v.l} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="font-bold text-gray-900 text-sm">{v.v}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{v.l}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-primary-100 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Calendar className="w-3.5 h-3.5" /> Book Care
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Activity className="w-3.5 h-3.5" /> View Records
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // ─── AI Health Assistant ──────────────────────────────────────────────────────
  const AIAssistant = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4 h-full flex flex-col">
      <motion.div variants={fade}><h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">AI Health Assistant</h1></motion.div>
      <motion.div variants={fade} className="flex gap-2 flex-wrap">
        {['What are my medicines?', 'Show my BP', 'Next appointment', 'I have a fever'].map(s => (
          <button key={s} onClick={() => { setAiInput(s); setTimeout(() => sendAI(), 100); }}
            className="bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-primary-100 transition-colors border border-primary-200"
            style={{ minHeight: 'unset', minWidth: 'unset' }}>
            {s}
          </button>
        ))}
      </motion.div>
      {/* Chat window */}
      <motion.div variants={fade} className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden" style={{ minHeight: '400px', maxHeight: '520px' }}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-primary-600 to-teal-600">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
          <div>
            <p className="font-bold text-white text-sm">HomeCare AI</p>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" /><span className="text-primary-100 text-xs">Always available</span></div>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {aiMessages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5 items-center">
                {[0, 0.2, 0.4].map(d => <motion.div key={d} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} className="w-2 h-2 bg-gray-400 rounded-full" />)}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {/* Input */}
        <div className="p-3 border-t border-gray-100">
          <form onSubmit={e => { e.preventDefault(); sendAI(); }} className="flex gap-2">
            <input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask about your health..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              style={{ fontSize: '16px', minHeight: 'unset' }} />
            <button type="submit" className="w-11 h-11 bg-primary-600 rounded-2xl flex items-center justify-center hover:bg-primary-700 transition-colors flex-shrink-0" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );

  // ─── Emergency SOS ────────────────────────────────────────────────────────────
  const EmergencySOS = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade}><h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Emergency SOS</h1></motion.div>
      {/* Main SOS button */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-gray-500 text-sm mb-6">Press and hold the button to trigger emergency services. A caregiver will be dispatched within <strong className="text-red-600">30 minutes</strong>.</p>
        <div className="relative mx-auto w-44 h-44 mb-6">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-40" />
          <div className="absolute inset-3 bg-red-200 rounded-full animate-pulse opacity-60" />
          <button
            onTouchStart={() => { setSosActive(true); setSosTimer(5); }}
            onMouseDown={() => { setSosActive(true); setSosTimer(5); }}
            onTouchEnd={() => { if (sosTimer > 0) setSosActive(false); }}
            onMouseUp={() => { if (sosTimer > 0) setSosActive(false); }}
            className={`absolute inset-6 rounded-full flex flex-col items-center justify-center font-bold text-white shadow-2xl transition-all select-none
              ${sosActive ? 'bg-red-700 scale-95' : 'bg-red-500 hover:bg-red-600'}`}
            style={{ minHeight: 'unset', minWidth: 'unset' }}
          >
            <Zap className="w-10 h-10 mb-1" />
            <span className="text-lg">{sosActive ? sosTimer : 'SOS'}</span>
            <span className="text-xs opacity-80">{sosActive ? 'Hold...' : 'Press & Hold'}</span>
          </button>
        </div>
        <p className="text-xs text-gray-400">Your location will be shared automatically with emergency responders.</p>
      </motion.div>
      {/* Emergency contacts */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100"><h3 className="font-bold text-gray-900 font-display">Emergency Contacts</h3></div>
        <div className="divide-y divide-gray-50">
          {[
            { name: 'HomeCare+ Emergency', phone: '1800-911-1234', type: 'Primary', color: 'bg-red-100 text-red-600' },
            { name: 'Priya Kumar (Wife)', phone: '+91 98765 00001', type: 'Family', color: 'bg-blue-100 text-blue-600' },
            { name: 'Dr. Suresh (Family Doc)', phone: '+91 98765 00002', type: 'Doctor', color: 'bg-green-100 text-green-600' },
            { name: 'Apollo Hospital', phone: '080-2222-1111', type: 'Hospital', color: 'bg-purple-100 text-purple-600' },
          ].map((c, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.phone}</p>
                </div>
              </div>
              <span className={`badge ${c.color}`}>{c.type}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // ─── Payments & Invoices ──────────────────────────────────────────────────────
  const PaymentsInvoices = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade}>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Payments & Invoices</h1>
      </motion.div>

      {/* Summary cards */}
      <motion.div variants={fade} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Spent', value: '₹12,450', icon: CreditCard, color: 'bg-blue-50 text-blue-600' },
          { label: 'This Month', value: '₹1,899', icon: TrendingUp, color: 'bg-green-50 text-green-600' },
          { label: 'Pending', value: '₹799', icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold font-display text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Invoices list */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 font-display">Invoices</h3>
          <button className="flex items-center gap-1.5 text-primary-600 text-xs font-semibold" style={{ minHeight: 'unset', minWidth: 'unset' }}>
            <Download className="w-3.5 h-3.5" /> Export All
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {invoices.map((inv, i) => (
            <div key={i} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">#{inv.id}</p>
                  <p className="text-xs text-gray-500">{inv.service} · {inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-bold text-gray-900">{inv.amount}</span>
                <span className={`badge ${statusStyle[inv.status]} capitalize`}>{inv.status}</span>
                <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment methods */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 font-display">Payment Methods</h3>
          <button className="text-primary-600 text-xs font-semibold" style={{ minHeight: 'unset', minWidth: 'unset' }}>+ Add New</button>
        </div>
        <div className="space-y-3">
          {[
            { type: 'Visa', last4: '4242', expiry: '12/27', color: 'from-blue-600 to-blue-700', default: true },
            { type: 'UPI', last4: 'ramesh@okaxis', expiry: '', color: 'from-green-600 to-teal-600', default: false },
          ].map((card, i) => (
            <div key={i} className={`bg-gradient-to-r ${card.color} rounded-2xl p-4 text-white flex items-center justify-between`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{card.type}</span>
                  {card.default && <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">Default</span>}
                </div>
                <p className="text-white/80 text-xs">{card.last4} {card.expiry && `· ${card.expiry}`}</p>
              </div>
              <CreditCard className="w-8 h-8 text-white/60" />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // ─── Settings ─────────────────────────────────────────────────────────────────
  const SettingsPanel = () => {
    const [notifs, setNotifs] = useState({ appointments: true, medicines: true, tracking: true, promotions: false });
    const [profile, setProfile] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', phone: '' });
    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
        <motion.div variants={fade}><h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Settings</h1></motion.div>

        {/* Profile */}
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 font-display mb-4">Profile Information</h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <button className="text-primary-600 text-xs font-semibold mt-1 hover:underline" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                Change Photo
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'First Name', key: 'firstName' },
              { label: 'Last Name', key: 'lastName' },
              { label: 'Email', key: 'email' },
              { label: 'Phone', key: 'phone' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                <input
                  className="input-field text-sm py-2.5"
                  value={(profile as any)[f.key]}
                  onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.label}
                  style={{ fontSize: '16px' }}
                />
              </div>
            ))}
          </div>
          <button className="btn-primary mt-4 py-2.5 px-6 text-sm" style={{ minHeight: 'unset', minWidth: 'unset' }}>
            Save Changes
          </button>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 font-display mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'appointments', label: 'Appointment Reminders', desc: 'Get notified 1 hour before each visit' },
              { key: 'medicines', label: 'Medicine Reminders', desc: 'Daily medication alerts at scheduled times' },
              { key: 'tracking', label: 'Live Tracking Alerts', desc: 'When caregiver is 10 minutes away' },
              { key: 'promotions', label: 'Offers & Promotions', desc: 'Deals, discounts, and loyalty rewards' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${(notifs as any)[item.key] ? 'bg-primary-600' : 'bg-gray-200'}`}
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${(notifs as any)[item.key] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 font-display mb-4">Security</h3>
          <div className="space-y-3">
            {[
              { label: 'Change Password', icon: Shield, color: 'text-blue-600 bg-blue-50' },
              { label: 'Two-Factor Authentication', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
              { label: 'Active Sessions', icon: Activity, color: 'text-purple-600 bg-purple-50' },
            ].map(item => (
              <button key={item.label} className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors text-left"
                style={{ minHeight: 'unset', minWidth: 'unset' }}>
                <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-800 flex-1">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={fade} className="bg-red-50 border border-red-200 rounded-3xl p-5">
          <h3 className="font-bold text-red-700 font-display mb-3">Danger Zone</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 rounded-xl hover:bg-red-100 transition-colors text-sm text-red-600 font-medium" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              Deactivate Account
            </button>
            <button className="w-full text-left p-3 rounded-xl hover:bg-red-100 transition-colors text-sm text-red-600 font-medium" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              Delete Account & Data
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ─── Section renderer ─────────────────────────────────────────────────────────
  const renderSection = () => {
    switch (active) {
      case 'overview':     return <Overview />;
      case 'appointments': return <Appointments />;
      case 'tracking':     return <LiveTracking />;
      case 'health':       return <HealthRecords />;
      case 'medicines':    return <MedicineReminders />;
      case 'video':        return <VideoConsultations />;
      case 'family':       return <FamilyMonitoring />;
      case 'ai':           return <AIAssistant />;
      case 'sos':          return <EmergencySOS />;
      case 'payments':     return <PaymentsInvoices />;
      case 'settings':     return <SettingsPanel />;
      default:             return <Overview />;
    }
  };

  // ─── Mobile bottom tab bar ─────────────────────────────────────────────────────
  const mobileTabItems = [
    { icon: Home,     label: 'Home',       key: 'overview' },
    { icon: Calendar, label: 'Bookings',   key: 'appointments' },
    { icon: Activity, label: 'Health',     key: 'health' },
    { icon: Bot,      label: 'AI',         key: 'ai' },
    { icon: Menu,     label: 'More',       key: '__menu' },
  ];

  // ─── Root render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Desktop sidebar (fixed) ── */}
      <div className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 border-r border-gray-100 shadow-sm z-30">
        <Sidebar />
      </div>

      {/* ── Mobile drawer overlay ── */}
      <AnimatePresence>
        {sideOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSideOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 lg:hidden shadow-2xl border-r border-gray-100">
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{navItems.find(n => n.key === active)?.label || 'Dashboard'}</p>
              <p className="text-xs text-gray-400 hidden sm:block">HomeCare+ Patient Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {/* SOS quick button */}
            <button onClick={() => navTo('sos')} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:block">SOS</span>
            </button>
            {/* Avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around px-2 pt-1.5 pb-1">
          {mobileTabItems.map(tab => {
            if (tab.key === '__menu') return (
              <button key="menu" onClick={() => setSideOpen(true)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5"
                style={{ minHeight: 'unset', minWidth: 'unset' }}>
                <Menu className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] font-semibold text-gray-400">More</span>
              </button>
            );
            const isActive = active === tab.key;
            return (
              <button key={tab.key} onClick={() => navTo(tab.key)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative"
                style={{ minHeight: 'unset', minWidth: 'unset' }}>
                {isActive && (
                  <motion.div layoutId="bottomTabIndicator"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary-600 rounded-full" />
                )}
                <tab.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
