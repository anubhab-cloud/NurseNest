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
import { useAuth, api } from '../../context/AuthContext';
import NurseNestLogo from '../../components/brand/NurseNestLogo';
import AgoraVideoCall from '../../components/AgoraVideoCall';


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

// (aiResponses removed — now powered by real Gemini AI via /api/v1/ai/chat)


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
  const [sosSent, setSosSent]       = useState(false);
  const [realBookings, setRealBookings]       = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [useDemoData, setUseDemoData]         = useState(false);
  const [trackingProgress, setTrackingProgress] = useState(62);
  const [payments, setPayments]               = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentsFetched, setPaymentsFetched] = useState(false);

  // Health records & Medicine state
  const [dbHealthRecords, setDbHealthRecords] = useState<any[]>([]);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [healthRecordsFetched, setHealthRecordsFetched] = useState(false);
  const [showAddVitals, setShowAddVitals] = useState(false);
  const [newVitals, setNewVitals] = useState({ bp: '120/80', hr: 72, spo2: 98, temp: 36.6, weight: 68 });

  const [dbMedicines, setDbMedicines] = useState<any[]>([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [medicinesFetched, setMedicinesFetched] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '1 tablet', time: '8:00 AM', type: 'General' });

  // Video call state
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [activeCallBookingId, setActiveCallBookingId] = useState<string>('demo');

  // UI state & refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [medicineTaken, setMedicineTaken] = useState<Record<number, boolean>>({});


  useEffect(() => {
    api.get('/bookings/my')
      .then(r => {
        if (r.data?.data?.bookings) {
          setRealBookings(r.data.data.bookings);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingBookings(false));
  }, []);

  // Fetch payments when payments tab is first opened
  useEffect(() => {
    if (active === 'payments' && !paymentsFetched) {
      setLoadingPayments(true);
      api.get('/payments/history')
        .then(r => {
          if (r.data?.data?.payments) setPayments(r.data.data.payments);
        })
        .catch(() => {})
        .finally(() => { setLoadingPayments(false); setPaymentsFetched(true); });
    }
  }, [active, paymentsFetched]);

  // Fetch health records when health tab is opened
  useEffect(() => {
    if (active === 'health' && !healthRecordsFetched) {
      setLoadingHealthRecords(true);
      api.get('/health/records')
        .then(r => {
          if (r.data?.data?.records) setDbHealthRecords(r.data.data.records);
        })
        .catch(() => {})
        .finally(() => { setLoadingHealthRecords(false); setHealthRecordsFetched(true); });
    }
  }, [active, healthRecordsFetched]);

  // Fetch medicines when medicines tab is opened
  useEffect(() => {
    if (active === 'medicines' && !medicinesFetched) {
      setLoadingMedicines(true);
      api.get('/medicines')
        .then(r => {
          if (r.data?.data?.medicines) setDbMedicines(r.data.data.medicines);
        })
        .catch(() => {})
        .finally(() => { setLoadingMedicines(false); setMedicinesFetched(true); });
    }
  }, [active, medicinesFetched]);

  useEffect(() => {
    if (active === 'tracking') {
      const t = setInterval(() => setTrackingProgress(p => Math.min(p + 1, 95)), 3000);
      return () => clearInterval(t);
    }
  }, [active]);

  // Close sidebar on route tab change (mobile)
  useEffect(() => { setSideOpen(false); }, [active]);

  // Lock scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = sideOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sideOpen]);

  // Auto scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

  // SOS countdown + dispatch
  useEffect(() => {
    if (!sosActive) return;
    if (sosTimer === 0) {
      setSosActive(false);
      setSosTimer(5);
      // Dispatch real SOS alert to backend
      api.post('/bookings/sos', {
        location: 'Patient home address',
        timestamp: new Date().toISOString(),
      }).catch(() => {});
      setSosSent(true);
      setTimeout(() => setSosSent(false), 8000);
      return;
    }
    const t = setTimeout(() => setSosTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sosActive, sosTimer]);

  const sendAI = async () => {
    const q = aiInput.trim();
    if (!q || aiLoading) return;
    setAiMessages(m => [...m, { role: 'user', text: q }]);
    setAiInput('');
    setAiLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: q });
      const reply = res.data?.data?.reply || 'Sorry, I could not generate a response. Please try again.';
      setAiMessages(m => [...m, { role: 'bot', text: reply }]);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'AI service is temporarily unavailable. Please try again in a moment.';
      setAiMessages(m => [...m, { role: 'bot', text: `⚠️ ${errMsg}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  const clearAIChat = async () => {
    try {
      await api.delete('/ai/chat/clear');
    } catch { /* silently ignore */ }
    setAiMessages([{ role: 'bot', text: "Hi! I'm your NurseNest AI Health Assistant powered by Google Gemini. How can I help you today? 👋" }]);
  };

  const navTo = (key: string) => { setActive(key); setSideOpen(false); };

  // ─── Sidebar ──────────────────────────────────────────────────────────────────
  const renderSidebar = () => (
    <aside className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center" style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <NurseNestLogo size={32} />
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
  const renderOverview = () => {
    const isNewUser = realBookings.length === 0 && !useDemoData;
    const activeAppointments = isNewUser ? [] : appointments;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        {/* Header */}
        <motion.div variants={fade} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">{greeting}, {user?.firstName}! 👋</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {isNewUser ? "Welcome to HomeCare+! Your account is verified and ready." : "Here's your health overview for today."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setUseDemoData(v => !v)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {useDemoData ? '📋 View My Real Account' : '👁️ Preview Demo Data'}
            </button>
            <Link to="/booking" className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <Plus className="w-4 h-4" /> Book Service
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fade} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total Bookings', value: isNewUser ? '0' : '12', icon: Calendar, color: 'bg-blue-50 text-blue-600', trend: isNewUser ? 'Account active' : '+2 this month' },
            { label: 'Next Visit', value: isNewUser ? 'None' : 'Today 9AM', icon: Clock, color: 'bg-green-50 text-green-600', trend: isNewUser ? 'Book anytime' : 'Dr. Priya Nair' },
            { label: 'Health Score', value: isNewUser ? '100/100' : '92/100', icon: Activity, color: 'bg-teal-50 text-teal-600', trend: isNewUser ? 'Account setup' : '↑ 3pts this week' },
            { label: 'Welcome Points', value: isNewUser ? '100 pts' : '450 pts', icon: Star, color: 'bg-purple-50 text-purple-600', trend: 'Welcome bonus' },
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

        {/* Next appointment banner or New user welcome banner */}
        {isNewUser ? (
          <motion.div variants={fade} className="bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  New Account Ready
                </div>
                <h2 className="text-xl font-bold font-display">Schedule Your First Home Care Visit</h2>
                <p className="text-blue-100 text-sm max-w-xl mt-1">
                  Connect with certified ICU nurses, elder care specialists, or physiotherapists directly at your doorstep.
                </p>
              </div>
              <Link 
                to="/booking"
                className="bg-white text-blue-700 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-md hover:bg-blue-50 transition-colors shrink-0"
              >
                Book Free Consultation
              </Link>
            </div>
          </motion.div>
        ) : (
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
        )}

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
};

  // ─── Appointments ─────────────────────────────────────────────────────────────
  const renderAppointments = () => {
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const formatTime = (t: string) => t || '';
    const getNurseInitials = (b: any) => {
      const n = b.nurseId;
      if (n?.firstName) return `${n.firstName[0]}${n.lastName?.[0] || ''}`;
      return 'N';
    };
    const getNurseName = (b: any) => {
      const n = b.nurseId;
      if (n?.firstName) return `${n.firstName} ${n.lastName || ''}`;
      return 'Nurse (Pending Assignment)';
    };

    return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade} className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">My Appointments</h1>
        <Link to="/booking" className="btn-primary text-sm py-2.5 px-4 flex items-center gap-1.5" style={{ minHeight: 'unset', minWidth: 'unset' }}>
          <Plus className="w-4 h-4" /> Book New
        </Link>
      </motion.div>

      {loadingBookings ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : realBookings.length === 0 ? (
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 font-display mb-2">No Appointments Yet</h3>
          <p className="text-sm text-gray-400 mb-5">Book your first home care session to get started.</p>
          <Link to="/booking" className="btn-primary text-sm py-2.5 px-6" style={{ minHeight: 'unset', minWidth: 'unset' }}>Book a Caregiver</Link>
        </motion.div>
      ) : (
        realBookings.map((b, i) => (
          <motion.div key={b._id} variants={fade} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-teal-100 rounded-2xl flex items-center justify-center text-lg font-bold text-primary-700 flex-shrink-0">{getNurseInitials(b)}</div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 font-display">{b.serviceType}</h3>
                    <span className={`badge ${statusStyle[b.status] || 'bg-gray-100 text-gray-600'} capitalize`}>{b.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{getNurseName(b)}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(b.scheduledDate)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(b.startTime)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900">₹{b.billing?.totalAmount?.toFixed(0) || '—'}</span>
                {(b.status === 'confirmed' || b.status === 'in-progress') && (
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
                {b.status === 'pending' && !b.billing?.isPaid && (
                  <Link to="/booking" className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-green-100 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                  </Link>
                )}
              </div>
            </div>
            {b.location?.address && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>{b.location.address}</span>
              </div>
            )}
          </motion.div>
        ))
      )}
    </motion.div>
    );
  };

  // ─── Live Tracking ────────────────────────────────────────────────────────────
  const renderLiveTracking = () => (
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
              <motion.div animate={{ width: `${trackingProgress}%` }} transition={{ duration: 1 }} className="bg-gradient-to-r from-primary-500 to-teal-500 h-2 rounded-full" />
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

  // ─── Health Records ───────────────────────────────────────────────────────────
  const renderHealthRecords = () => {
    const recordsToDisplay = dbHealthRecords.length > 0 ? dbHealthRecords : healthRecords;

    const handleAddVitals = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await api.post('/health/records', { vitals: newVitals, nurseName: 'Self-Reported' });
        if (res.data?.data?.record) {
          setDbHealthRecords(prev => [res.data.data.record, ...prev]);
        }
        setShowAddVitals(false);
      } catch (err) {
        console.error('Failed to add vitals:', err);
      }
    };

    return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade} className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Health Records</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowAddVitals(!showAddVitals)} className="btn-primary text-sm py-2 px-3 flex items-center gap-1.5" style={{ minHeight: 'unset', minWidth: 'unset' }}>
            <Plus className="w-4 h-4" /> Log Vitals
          </button>
          <button className="flex items-center gap-1.5 text-primary-600 text-sm font-semibold border border-primary-200 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors" style={{ minHeight: 'unset', minWidth: 'unset' }}>
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </motion.div>

      {/* Add Vitals Form */}
      {showAddVitals && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleAddVitals}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900 font-display">Record Current Vitals</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">BP (mmHg)</label>
              <input value={newVitals.bp} onChange={e => setNewVitals({ ...newVitals, bp: e.target.value })} className="input-field text-sm py-2" placeholder="120/80" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">HR (bpm)</label>
              <input type="number" value={newVitals.hr} onChange={e => setNewVitals({ ...newVitals, hr: Number(e.target.value) })} className="input-field text-sm py-2" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">SpO2 (%)</label>
              <input type="number" value={newVitals.spo2} onChange={e => setNewVitals({ ...newVitals, spo2: Number(e.target.value) })} className="input-field text-sm py-2" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Temp (°C)</label>
              <input type="number" step="0.1" value={newVitals.temp} onChange={e => setNewVitals({ ...newVitals, temp: Number(e.target.value) })} className="input-field text-sm py-2" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Weight (kg)</label>
              <input type="number" step="0.5" value={newVitals.weight} onChange={e => setNewVitals({ ...newVitals, weight: Number(e.target.value) })} className="input-field text-sm py-2" required />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddVitals(false)} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" className="btn-primary text-xs py-2 px-4">Save Vitals</button>
          </div>
        </motion.form>
      )}

      {/* Vitals chart */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 font-display mb-4">Vitals Trend</h3>
        <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs text-gray-400 font-medium">
          {recordsToDisplay.slice(0, 4).map((r, idx) => (
            <div key={idx}>{r.date || (r.recordedAt ? new Date(r.recordedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Today')}</div>
          ))}
        </div>
        {[
          { label: 'Heart Rate (bpm)', getVal: (r: any) => r.vitals?.hr || r.hr || 72, color: 'bg-red-400', max: 120 },
          { label: 'SpO2 (%)', getVal: (r: any) => r.vitals?.spo2 || r.spo2 || 98, color: 'bg-blue-400', max: 100 },
        ].map(metric => (
          <div key={metric.label} className="mb-4">
            <p className="text-xs text-gray-500 mb-2">{metric.label}</p>
            <div className="grid grid-cols-4 gap-2">
              {recordsToDisplay.slice(0, 4).map((r, idx) => {
                const val = metric.getVal(r);
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-gray-900">{val}</span>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`${metric.color} h-2 rounded-full`} style={{ width: `${Math.min(100, (val / metric.max) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
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
              {['Date', 'BP', 'HR', 'SpO2', 'Temp', 'Nurse/Provider'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {recordsToDisplay.map((r, idx) => {
                const dateStr = r.date || (r.recordedAt ? new Date(r.recordedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Today');
                const bp = r.vitals?.bp || r.bp || '120/80';
                const hr = r.vitals?.hr || r.hr || 72;
                const spo2 = r.vitals?.spo2 || r.spo2 || 98;
                const temp = r.vitals?.temp || r.temp || 36.6;
                const nurse = r.nurseName || r.nurse || 'Care Team';

                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{dateStr}</td>
                    <td className="px-4 py-3 text-gray-700">{bp}</td>
                    <td className="px-4 py-3 text-gray-700">{hr} bpm</td>
                    <td className="px-4 py-3"><span className={`badge ${spo2 >= 97 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{spo2}%</span></td>
                    <td className="px-4 py-3 text-gray-700">{temp}°C</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{nurse}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
    );
  };

  // ─── Medicine Reminders ───────────────────────────────────────────────────────
  const renderMedicineReminders = () => {
    const listToDisplay = dbMedicines.length > 0 ? dbMedicines : medicines;

    const toggleMed = async (med: any, index: number) => {
      if (med._id) {
        try {
          const res = await api.patch(`/medicines/${med._id}/toggle`);
          if (res.data?.data?.medicine) {
            setDbMedicines(prev => prev.map(m => m._id === med._id ? res.data.data.medicine : m));
          }
        } catch (err) { console.error('Toggle error:', err); }
      } else {
        const n = { ...medicineTaken, [index]: !medicineTaken[index] };
        setMedicineTaken(n);
      }
    };

    const handleAddMed = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMed.name) return;
      try {
        const res = await api.post('/medicines', newMed);
        if (res.data?.data?.medicine) {
          setDbMedicines(prev => [res.data.data.medicine, ...prev]);
        }
        setShowAddMed(false);
        setNewMed({ name: '', dosage: '1 tablet', time: '8:00 AM', type: 'General' });
      } catch (err) {
        console.error('Failed to add medicine:', err);
      }
    };

    const takenCount = listToDisplay.filter((m, i) => m._id ? m.taken : medicineTaken[i]).length;
    const pct = listToDisplay.length > 0 ? Math.round((takenCount / listToDisplay.length) * 100) : 0;

    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
        <motion.div variants={fade} className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Medicine Reminders</h1>
          <button onClick={() => setShowAddMed(!showAddMed)} className="flex items-center gap-1.5 btn-primary text-sm py-2.5 px-4" style={{ minHeight: 'unset', minWidth: 'unset' }}>
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </motion.div>

        {/* Add Medicine Form */}
        {showAddMed && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleAddMed}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-900 font-display">New Medicine Reminder</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1">Medicine Name</label>
                <input value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} className="input-field text-sm py-2" placeholder="e.g. Paracetamol" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1">Dosage</label>
                <input value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} className="input-field text-sm py-2" placeholder="e.g. 500mg / 1 tab" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1">Schedule Time</label>
                <input value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })} className="input-field text-sm py-2" placeholder="e.g. 9:00 AM" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1">Category</label>
                <select value={newMed.type} onChange={e => setNewMed({ ...newMed, type: e.target.value })} className="input-field text-sm py-2">
                  <option value="General">General</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Blood Pressure">Blood Pressure</option>
                  <option value="Supplement">Supplement</option>
                  <option value="Painkiller">Painkiller</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddMed(false)} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button type="submit" className="btn-primary text-xs py-2 px-4">Add Reminder</button>
            </div>
          </motion.form>
        )}

        {/* Progress */}
        <motion.div variants={fade} className="bg-gradient-to-r from-teal-600 to-primary-600 rounded-3xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-teal-100 text-sm">Today's Progress</p><p className="text-2xl font-bold font-display">{takenCount} / {listToDisplay.length} taken</p></div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${(pct / 100) * 88} 88`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-bold">{pct}%</span>
            </div>
          </div>
        </motion.div>
        {/* List */}
        <div className="space-y-3">
          {listToDisplay.map((m, i) => {
            const isTaken = m._id ? m.taken : medicineTaken[i];
            const pillColor = m.color || 'bg-blue-100 text-blue-700';

            return (
              <motion.div key={m._id || i} variants={fade} transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 transition-all ${isTaken ? 'border-green-200 bg-green-50/50' : 'border-gray-100'}`}>
                <div className={`w-11 h-11 rounded-2xl ${pillColor} flex items-center justify-center flex-shrink-0`}>
                  <Pill className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{m.name} <span className="text-xs text-gray-400 font-normal">({m.dosage || '1 tab'})</span></p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{m.time}</span>
                    <span className={`badge ${pillColor} text-[10px] px-2 py-0.5`}>{m.type}</span>
                  </div>
                </div>
                <button onClick={() => toggleMed(m, i)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all font-bold text-sm ${isTaken ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                  style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  {isTaken ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // ─── Video Consultations ──────────────────────────────────────────────────────
  const renderVideoConsultations = () => (
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
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <AgoraVideoCall bookingId={activeCallBookingId} onEndCall={() => setVideoCallActive(false)} />
        </motion.div>
      )}
    </motion.div>
  );

  // ─── Family Monitoring ────────────────────────────────────────────────────────
  const renderFamilyMonitoring = () => (
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
  const renderAIAssistant = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4 h-full flex flex-col">
      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">AI Health Assistant</h1>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block" />
            Powered by Google Gemini 1.5 Flash
          </p>
        </div>
        <button onClick={clearAIChat}
          className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          style={{ minHeight: 'unset', minWidth: 'unset' }}>
          Clear Chat
        </button>
      </motion.div>
      <motion.div variants={fade} className="flex gap-2 flex-wrap">
        {['I have a headache', 'Check my symptoms', 'Medicine side effects', 'Post-surgery care tips'].map(s => (
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
          <div className="flex-1">
            <p className="font-bold text-white text-sm">NurseNest AI</p>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" /><span className="text-primary-100 text-xs">Gemini · Always available</span></div>
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
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-2 items-center">
                {[0, 0.2, 0.4].map(d => <motion.div key={d} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} className="w-2 h-2 bg-primary-400 rounded-full" />)}
                <span className="text-xs text-gray-400 ml-1">Gemini is thinking...</span>
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
  const renderEmergencySOS = () => (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade}><h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Emergency SOS</h1></motion.div>
      {sosSent && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800 text-sm">SOS Alert Sent!</p>
            <p className="text-xs text-green-600">Our team has been notified. A caregiver will be dispatched shortly. Stay calm.</p>
          </div>
        </motion.div>
      )}
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
  const renderPaymentsInvoices = () => {
    const totalSpent   = payments.filter(p => p.status === 'succeeded').reduce((s, p) => s + p.amount, 0);
    const thisMonth    = payments.filter(p => {
      if (p.status !== 'succeeded' || !p.paidAt) return false;
      const d = new Date(p.paidAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
    const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const getServiceName = (p: any) => p.bookingId?.serviceType || 'Healthcare Service';

    return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
      <motion.div variants={fade}>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Payments & Invoices</h1>
      </motion.div>

      {/* Summary cards — real computed values */}
      <motion.div variants={fade} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Spent',  value: `₹${totalSpent.toFixed(0)}`,  icon: CreditCard,  color: 'bg-blue-50 text-blue-600' },
          { label: 'This Month',   value: `₹${thisMonth.toFixed(0)}`,   icon: TrendingUp,  color: 'bg-green-50 text-green-600' },
          { label: 'Pending',      value: `₹${pending.toFixed(0)}`,     icon: Clock,       color: 'bg-yellow-50 text-yellow-600' },
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

      {/* Invoices list — real data */}
      <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 font-display">Transaction History</h3>
        </div>
        {loadingPayments ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center">
            <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No payment history yet. Your transactions will appear here after your first booking.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {payments.map((p, i) => (
              <div key={i} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{getServiceName(p)}</p>
                    <p className="text-xs text-gray-500">{p.paidAt ? fmtDate(p.paidAt) : fmtDate(p.createdAt)} · #{p._id?.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-bold text-gray-900">₹{p.amount?.toFixed(0)}</span>
                  <span className={`badge capitalize ${
                    p.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                    p.status === 'pending'   ? 'bg-yellow-100 text-yellow-700' :
                    p.status === 'failed'    ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{p.status === 'succeeded' ? 'Paid' : p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
    );
  };

  // ─── Settings ─────────────────────────────────────────────────────────────────
  const renderSettingsPanel = () => {
    const [notifs, setNotifs] = useState({ appointments: true, medicines: true, tracking: true, promotions: false });
    const [profile, setProfile] = useState({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: (user as any)?.phone || '',
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Password change state
    const [showChangePass, setShowChangePass] = useState(false);
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPass, setChangingPass] = useState(false);
    const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Deactivation state
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [deactivating, setDeactivating] = useState(false);

    const handleSaveProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setSavingProfile(true);
      setProfileMsg(null);
      try {
        const res = await api.put('/auth/profile', {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
        });
        setProfileMsg({ type: 'success', text: res.data?.message || 'Profile updated successfully!' });
      } catch (err: any) {
        setProfileMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to update profile' });
      } finally {
        setSavingProfile(false);
      }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (passData.newPassword !== passData.confirmPassword) {
        setPassMsg({ type: 'error', text: 'New passwords do not match' });
        return;
      }
      setChangingPass(true);
      setPassMsg(null);
      try {
        const res = await api.post('/auth/change-password', {
          currentPassword: passData.currentPassword,
          newPassword: passData.newPassword,
        });
        setPassMsg({ type: 'success', text: res.data?.message || 'Password changed successfully!' });
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowChangePass(false), 2000);
      } catch (err: any) {
        setPassMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to change password' });
      } finally {
        setChangingPass(false);
      }
    };

    const handleDeactivate = async () => {
      setDeactivating(true);
      try {
        await api.post('/auth/deactivate');
        logout();
      } catch (err) {
        console.error('Deactivation failed:', err);
        setDeactivating(false);
      }
    };

    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
        <motion.div variants={fade}><h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Settings</h1></motion.div>

        {/* Profile */}
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 font-display mb-4">Profile Information</h3>

          {profileMsg && (
            <div className={`p-3.5 rounded-2xl mb-4 text-xs font-semibold ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {profileMsg.text}
            </div>
          )}

          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name</label>
                <input
                  className="input-field text-sm py-2.5"
                  value={profile.firstName}
                  onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name</label>
                <input
                  className="input-field text-sm py-2.5"
                  value={profile.lastName}
                  onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email (Account ID)</label>
                <input
                  className="input-field text-sm py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                  value={profile.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                <input
                  className="input-field text-sm py-2.5"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary mt-4 py-2.5 px-6 text-sm flex items-center gap-2"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
            >
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>

        {/* Change Password Form / Modal */}
        <motion.div variants={fade} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 font-display">Security & Password</h3>
              <p className="text-xs text-gray-500 mt-0.5">Manage your account security and password</p>
            </div>
            <button
              onClick={() => setShowChangePass(!showChangePass)}
              className="text-xs font-semibold text-primary-600 border border-primary-200 px-3 py-1.5 rounded-xl hover:bg-primary-50 transition-colors"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
            >
              {showChangePass ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showChangePass && (
            <form onSubmit={handleChangePassword} className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              {passMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${passMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {passMsg.text}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passData.currentPassword}
                  onChange={e => setPassData(p => ({ ...p, currentPassword: e.target.value }))}
                  className="input-field text-sm py-2"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passData.newPassword}
                    onChange={e => setPassData(p => ({ ...p, newPassword: e.target.value }))}
                    className="input-field text-sm py-2"
                    minLength={8}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passData.confirmPassword}
                    onChange={e => setPassData(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="input-field text-sm py-2"
                    minLength={8}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={changingPass}
                className="btn-primary text-xs py-2 px-5"
                style={{ minHeight: 'unset', minWidth: 'unset' }}
              >
                {changingPass ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
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

        {/* Danger zone */}
        <motion.div variants={fade} className="bg-red-50 border border-red-200 rounded-3xl p-5">
          <h3 className="font-bold text-red-700 font-display mb-2">Danger Zone</h3>
          <p className="text-xs text-red-600 mb-4">Deactivating your account will suspend your bookings and active caregiver plans.</p>

          {!showDeactivateConfirm ? (
            <button
              onClick={() => setShowDeactivateConfirm(true)}
              className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
              style={{ minHeight: 'unset', minWidth: 'unset' }}
            >
              Deactivate Account
            </button>
          ) : (
            <div className="bg-white rounded-2xl p-4 border border-red-200 space-y-3">
              <p className="text-xs font-bold text-red-700">Are you sure you want to deactivate your account?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeactivate}
                  disabled={deactivating}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700"
                >
                  {deactivating ? 'Deactivating...' : 'Yes, Deactivate'}
                </button>
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  };


  // ─── Section renderer ─────────────────────────────────────────────────────────
  const renderSection = () => {
    switch (active) {
      case 'overview':     return renderOverview();
      case 'appointments': return renderAppointments();
      case 'tracking':     return renderLiveTracking();
      case 'health':       return renderHealthRecords();
      case 'medicines':    return renderMedicineReminders();
      case 'video':        return renderVideoConsultations();
      case 'family':       return renderFamilyMonitoring();
      case 'ai':           return renderAIAssistant();
      case 'sos':          return renderEmergencySOS();
      case 'payments':     return renderPaymentsInvoices();
      case 'settings':     return renderSettingsPanel();
      default:             return renderOverview();
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
        {renderSidebar()}
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
              {renderSidebar()}
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
