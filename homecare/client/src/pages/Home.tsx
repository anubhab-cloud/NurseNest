"use client";
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, Star, Shield, CheckCircle, Phone, ChevronDown, ChevronUp,
  Heart, Activity, UserCheck, Zap, Award, DollarSign, Headphones,
  Clock, Calendar, TrendingUp, Navigation, MessageSquare, Sparkles
} from 'lucide-react';

// Lazy-load the heavy 3D component
const NurseModel = lazy(() => import('../components/three/NurseModel'));

// ── Animation presets ──────────────────────────────────────────────────────
const fadeUp  = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } } as const;
const stagger = { visible: { transition: { staggerChildren: 0.08 } } } as const;
const dur     = { transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } as const;

// ── Animated counter ───────────────────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / 60;
    const t = setInterval(() => { start += step; if (start >= end) { setN(end); clearInterval(t); } else setN(Math.floor(start)); }, 16);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// ── DATA ───────────────────────────────────────────────────────────────────
const STATS = [
  { end: 10000, suffix: '+', label: 'Happy Patients',       icon: Heart     },
  { end: 500,   suffix: '+', label: 'Certified Caregivers', icon: UserCheck  },
  { end: 24,    suffix: '/7', label: 'Support Available',   icon: Headphones },
  { end: 98,    suffix: '%', label: 'Satisfaction Rate',    icon: Star       },
];

const SERVICES = [
  { emoji: '👴', title: 'Elder Care',           category: 'Daily Care',    desc: 'Compassionate daily assistance, medication management, and companionship for seniors at home.', features: ['24/7 Monitoring', 'Meal Assistance', 'Mobility Support'] },
  { emoji: '💉', title: 'Nursing Care',         category: 'Clinical',      desc: 'Certified nurses for IV therapy, wound dressing, injections, and all clinical care needs.', features: ['Wound Dressing', 'IV Therapy', 'Vitals Monitoring'] },
  { emoji: '🏃', title: 'Physiotherapy',        category: 'Rehabilitation', desc: 'Expert physiotherapists for post-surgery recovery and pain management programs.', features: ['Post-Op Recovery', 'Pain Management', 'Mobility Training'] },
  { emoji: '🩺', title: 'Doctor Consultation',  category: 'Consultation',   desc: 'Video and in-home consultations with licensed doctors, specialists and GPs.', features: ['Video & Home Visits', 'Digital Prescriptions', 'Specialist Referrals'] },
  { emoji: '🏥', title: 'Post-Surgery Care',    category: 'Recovery',      desc: 'Comprehensive in-home care following hospital discharge with medical-grade monitoring.', features: ['Daily Wound Care', 'Medication Schedule', 'Progress Reports'] },
  { emoji: '👶', title: 'Mother & Baby Care',   category: 'Postnatal',     desc: 'Expert postnatal nurses for new mothers, newborn wellness checks, and lactation support.', features: ['Lactation Support', 'Newborn Checks', 'Mother Recovery'] },
  { emoji: '🛏️', title: 'Medical Equipment',   category: 'Equipment',     desc: 'Rent hospital-grade ICU beds, ventilators, oxygen concentrators, and mobility aids.', features: ['ICU Beds', 'Ventilators', 'Free Installation'] },
  { emoji: '🚨', title: 'Emergency Visit',      category: 'Emergency',     desc: 'Rapid-response medical team dispatched within 30 minutes for urgent care needs.', features: ['30 Min Response', 'GPS Tracking', '24/7 Available'] },
];

const STEPS = [
  { n: '01', title: 'Book Service',          desc: 'Tell us your care requirements through our simple booking form.', icon: Calendar    },
  { n: '02', title: 'Choose Professional',   desc: 'Browse AI-matched caregivers verified for your exact needs.',       icon: UserCheck   },
  { n: '03', title: 'Schedule Visit',        desc: 'Pick date and time. Instant confirmation within minutes.',          icon: Clock       },
  { n: '04', title: 'Receive Care',          desc: 'Caregiver arrives on time. Track the visit live on our app.',       icon: Heart       },
];

const WHY = [
  { icon: Shield,      title: 'Verified Professionals', desc: 'Every caregiver undergoes background checks, credential verification, and skills assessment.',     color: '#E0EFFF', text: '#155DD4' },
  { icon: DollarSign,  title: 'Transparent Pricing',   desc: 'No hidden fees. Upfront pricing before you book, with flexible payment options.',                   color: '#ECFDF5', text: '#065F46' },
  { icon: Zap,         title: 'Fast Response',          desc: 'Emergency visits within 30 minutes. Standard bookings confirmed in under 2 hours.',                 color: '#FFFBEB', text: '#92400E' },
  { icon: Clock,       title: '24/7 Availability',      desc: 'Round-the-clock care. Our professionals are available at any time, any day of the year.',           color: '#F3E8FF', text: '#6B21A8' },
  { icon: Activity,    title: 'AI-Assisted Matching',   desc: 'Our algorithm matches you with the ideal caregiver based on your specific medical needs.',           color: '#CCFBF3', text: '#0D9488' },
  { icon: Award,       title: 'Secure Payments',        desc: 'PCI-compliant payment gateway with automatic invoice generation and insurance support.',             color: '#FEF2F2', text: '#991B1B' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  location: 'Bengaluru', rating: 5, service: 'Post-Surgery Care',  avatar: 'PS', text: 'HomeCare+ has been a blessing for my father\'s recovery. The nurse was professional, compassionate, and incredibly skilled. I highly recommend this service.' },
  { name: 'Ramesh Gupta',  location: 'Mumbai',    rating: 5, service: 'Physiotherapy',       avatar: 'RG', text: 'Booked a physiotherapist for my knee surgery recovery. Within 3 weeks I was walking again. The AI matching found the perfect therapist for my condition.' },
  { name: 'Anita Mehta',   location: 'Delhi',     rating: 5, service: 'Elder Care',           avatar: 'AM', text: 'The elder care service for my mother is outstanding. Regular vitals tracking, medication reminders, and genuine companionship. Worth every rupee.' },
  { name: 'Dr. Suresh Nair', location: 'Hyderabad', rating: 5, service: 'Nursing Care',      avatar: 'SN', text: 'As a doctor, I recommend HomeCare+ to all my patients needing post-discharge care. Professional, hygienic, and truly medical-grade service at home.' },
];

const FAQS = [
  { q: 'How quickly can I get a caregiver at home?',   a: 'For emergency services, we dispatch within 30 minutes. For scheduled bookings, we confirm and assign a caregiver within 2 hours. Same-day service is available in most cities.' },
  { q: 'Are all caregivers background verified?',       a: 'Yes. Every professional undergoes a thorough background check, credential verification, and practical skills assessment before joining our platform.' },
  { q: 'What is your cancellation policy?',             a: 'Free cancellation up to 2 hours before the scheduled visit. Cancellations within 2 hours are subject to a 20% fee to compensate the caregiver for their time.' },
  { q: 'Is HomeCare+ available in my city?',            a: 'We operate in 25+ cities including Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, and Pune. Enter your pin code during booking to check availability.' },
  { q: 'How are payments handled?',                     a: 'We accept all major cards, UPI, net banking, and EMI. Payments are processed through our PCI-compliant gateway with automatic invoice generation.' },
  { q: 'Can I request the same caregiver repeatedly?',  a: 'Absolutely. Once you find a caregiver you trust, you can schedule recurring visits with them directly through your patient dashboard.' },
];

const PARTNERS = ['Apollo Hospitals', 'Fortis Healthcare', 'Max Health', 'Medanta', 'Narayana Health', 'Star Health', 'HDFC ERGO', 'ICICI Lombard'];

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveT(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #EEF4FF 0%, #F0F7FF 50%, #E8F0FE 100%)', paddingTop: '108px' }}
      >
        {/* Subtle radial glows */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(191,219,254,0.5) 0%, transparent 60%)', transform: 'translate(25%, -25%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(165,180,252,0.25) 0%, transparent 60%)', transform: 'translate(-20%, 20%)' }} />

        <div className="container relative z-10 pt-8 sm:pt-12 pb-0">
          <div className="grid-12 items-center pb-10">

            {/* ── Left col — 6 cols ── */}
            <motion.div className="col-span-12 lg:col-span-6"
              initial="hidden" animate="visible" variants={stagger}>

              {/* Rating badge */}
              <motion.div variants={fadeUp} {...dur}
                className="inline-flex items-center gap-2.5 bg-white border border-blue-100 px-4 py-2 rounded-full mb-8 shadow-sm">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <span className="text-[13px] font-semibold text-slate-700">Rated #1 Home Healthcare Platform 2024</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp} {...dur}
                className="mb-6 text-balance"
                style={{ fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0F172A' }}>
                Professional Care,{' '}
                <br className="hidden sm:block" />
                Right at{' '}
                <span style={{ color: '#2563EB', fontStyle: 'italic', fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                  Your Home.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p variants={fadeUp} {...dur}
                className="mb-8 max-w-[480px]"
                style={{ fontSize: '17px', lineHeight: 1.75, color: '#475569' }}>
                Connect with{' '}
                <strong className="font-semibold text-slate-800">500+ certified caregivers</strong>{' '}
                for elder care, nursing, physiotherapy and more. Available 24/7.
                Confirmed in minutes.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} {...dur}
                className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center">
                <Link
                  to="/booking"
                  className="group inline-flex items-center justify-center gap-2.5 text-white font-bold text-[15px] px-7 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: '#2563EB', boxShadow: '0 8px 24px rgba(37,99,235,0.35)', minHeight: 'unset', minWidth: 'unset' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1D4ED8'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#2563EB'}
                >
                  Book Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-[15px] px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 shadow-sm"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                >
                  <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-600 text-xs ml-0.5">▶</span>
                  </span>
                  How It Works
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} {...dur} className="flex flex-wrap gap-3">
                {[
                  { icon: Shield, text: 'Background Verified' },
                  { icon: CheckCircle, text: 'ISO Certified' },
                  { icon: Star, text: '4.9 / 5 Rating' },
                ].map(b => (
                  <div key={b.text}
                    className="flex items-center gap-2 bg-white/80 border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm"
                    style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>
                    <b.icon className="w-4 h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
                    {b.text}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right col — 3D Model + floating cards ── */}
            <motion.div className="col-span-12 lg:col-span-5 lg:col-start-8 mt-10 lg:mt-0 flex items-center justify-center"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Soft blue glow behind model */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[320px] sm:h-[420px] rounded-full opacity-30 blur-3xl pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, #93C5FD, #818CF8)' }} />

                {/* Desktop 3D Model */}
                <div className="hidden lg:block">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-[500px]">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
                    </div>
                  }>
                    <NurseModel height={500} interactive />
                  </Suspense>
                </div>

                {/* Mobile interactive card */}
                <div className="lg:hidden bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Healthcare Status</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200/60">ACTIVE NEAR YOU</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">⚡</div>
                      <div><p className="text-[10px] text-slate-500 font-semibold uppercase">Response</p><p className="text-xs font-extrabold text-slate-900">In 28 Mins</p></div>
                    </div>
                    <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">⭐</div>
                      <div><p className="text-[10px] text-slate-500 font-semibold uppercase">Rating</p><p className="text-xs font-extrabold text-slate-900">4.9 / 5.0 (10k+)</p></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-xs">
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-600 shrink-0" /><span className="font-semibold text-slate-700">100% NABH &amp; Police Verified</span></div>
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                </div>

                {/* Floating card — Caregiver Arriving (Desktop) */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="hidden lg:flex absolute left-0 bottom-32 bg-white rounded-2xl p-4 items-center gap-3 shadow-xl border border-slate-100"
                  style={{ width: '200px' }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EFF6FF' }}>
                    <Navigation className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Caregiver Arriving</p>
                    <p className="text-2xl font-extrabold text-slate-900 leading-none">28 <span className="text-base font-bold">mins</span></p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Near You</p>
                  </div>
                </motion.div>

                {/* Floating card — Health Check (Desktop) */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  className="hidden lg:flex absolute right-0 top-20 bg-white rounded-2xl p-4 flex-col gap-1.5 shadow-xl border border-slate-100"
                  style={{ width: '192px' }}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-[11px] font-semibold text-slate-500">Health Check</span>
                  </div>
                  <p className="text-lg font-extrabold text-emerald-600">Normal</p>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p>BP: 120/80 mmHg</p>
                    <p>Pulse: 72 bpm</p>
                  </div>
                  <svg viewBox="0 0 120 30" className="w-full h-6 mt-1" fill="none">
                    <polyline
                      points="0,15 15,15 25,4 35,26 45,15 60,15 70,8 80,22 90,15 105,15 120,15"
                      stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ── Stats Row (white card strip at hero bottom) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-t-2xl border border-slate-100 border-b-0 shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100">
              {[
                { icon: Heart,      value: '10,000+',  label: 'Happy Families'       },
                { icon: UserCheck,  value: '500+',     label: 'Verified Caregivers'  },
                { icon: Calendar,   value: '50,000+',  label: 'Appointments Done'    },
                { icon: Headphones, value: '24/7',     label: 'Care Support'         },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                  className="flex items-center gap-4 px-6 py-5"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EFF6FF' }}>
                    <s.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900 leading-none">{s.value}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ SERVICES ═══════════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-header mb-8 sm:mb-16">
            <span className="eyebrow">What We Offer</span>
            <h2>Our <span className="text-gradient">Healthcare Services</span></h2>
            <p className="text-sm sm:text-base">Comprehensive home healthcare delivered by certified professionals.</p>
          </div>

          {/* Desktop & Tablet grid */}
          <div className="card-grid-4 hidden sm:grid">
            {SERVICES.map((s, i) => (
              <motion.div key={s.title} className="card"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.45 }}>
                <div className="card-body">
                  <div className="icon-box-xl mb-6" style={{ background: '#F5F5F5', fontSize: '28px' }}>
                    {s.emoji}
                  </div>
                  <span className="eyebrow mb-2 block">{s.category}</span>
                  <h4 className="text-gray-900 mb-3">{s.title}</h4>
                  <p className="text-muted truncate-3 mb-6">{s.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-footer">
                  <Link to="/services"
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:gap-2.5 transition-all"
                    style={{ minHeight: 'unset', minWidth: 'unset' }}>
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Swipe Container with Peek Preview */}
          <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4">
            {SERVICES.map((s) => (
              <div 
                key={s.title} 
                className="snap-center w-[82vw] shrink-0 bg-slate-50 border border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{s.emoji}</span>
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {s.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{s.desc}</p>
                  
                  <div className="space-y-1.5 mb-4">
                    {s.features.slice(0, 2).map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link 
                  to="/services" 
                  className="w-full flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-blue-600 text-xs font-bold py-2.5 rounded-xl shadow-xs active:bg-blue-50 transition-colors"
                >
                  Explore Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════════════════ */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Simple Process</span>
            <h2>How It <span className="text-gradient">Works</span></h2>
            <p>Get professional home care in 4 easy steps.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line — desktop */}
            <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px"
              style={{ background: 'linear-gradient(90deg,#BAD9FF,#1D77F2,#14B8A4,#99F4E8)' }} />

            {STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex flex-col items-center text-center">
                <div className="w-[104px] h-[104px] rounded-2xl flex flex-col items-center justify-center mb-6 relative z-10"
                  style={{ background: 'linear-gradient(135deg,#1D77F2,#14B8A4)', boxShadow: 'var(--shadow-2)' }}>
                  <s.icon className="w-8 h-8 text-white mb-1" />
                  <span className="text-white/70 text-xs font-bold">{s.n}</span>
                </div>
                <h4 className="text-gray-900 mb-2">{s.title}</h4>
                <p className="text-muted text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <Link to="/booking" className="btn btn-primary btn-lg">
              Start Booking Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ══════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid-12 items-center gap-16">
            {/* Left 5 cols */}
            <motion.div className="col-span-12 lg:col-span-5"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} {...dur} className="eyebrow block mb-4">Why HomeCare+</motion.span>
              <motion.h2 variants={fadeUp} {...dur} className="mb-6">
                The Smarter Way to Get <span className="text-gradient">Home Healthcare</span>
              </motion.h2>
              <motion.p variants={fadeUp} {...dur} className="text-body mb-8 max-w-[440px]">
                We combine technology with compassion to deliver healthcare experiences that feel personal, reliable, and world-class.
              </motion.p>
              <motion.div variants={fadeUp} {...dur}>
                <Link to="/about" className="btn btn-primary">Learn About Us <ArrowRight className="w-4 h-4" /></Link>
              </motion.div>
            </motion.div>

            {/* Right 7 cols — strict 2×3 grid */}
            <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHY.map((w, i) => (
                <motion.div key={w.title} className="card"
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }}>
                  <div className="card-body">
                    <div className="icon-box-lg mb-4" style={{ background: w.color }}>
                      <w.icon className="w-5 h-5" style={{ color: w.text }} />
                    </div>
                    <h5 className="text-gray-900 mb-2">{w.title}</h5>
                    <p className="text-muted text-sm">{w.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═══════════════════════════════════════════════════ */}
      <section className="section" style={{ background: '#0F0F0F' }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow" style={{ color: '#14B8A4' }}>Patient Stories</span>
            <h2 style={{ color: '#FFFFFF' }}>
              Real People, <span style={{ background: 'linear-gradient(135deg,#1D77F2,#14B8A4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Real Impact</span>
            </h2>
            <p style={{ color: '#858585' }}>Join 10,000+ families who trust HomeCare+ for their healthcare needs.</p>
          </div>

          <div className="max-w-[720px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeT}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl p-8 sm:p-10 text-center"
                style={{ background: '#1A1A1A', border: '1px solid #2B2B2B' }}>
                <div className="flex justify-center gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-lg leading-relaxed italic mb-8" style={{ color: '#D4D4D4' }}>
                  "{TESTIMONIALS[activeT].text}"
                </p>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: 'linear-gradient(135deg,#1D77F2,#14B8A4)' }}>
                    {TESTIMONIALS[activeT].avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white font-display">{TESTIMONIALS[activeT].name}</p>
                    <p className="text-sm mt-0.5" style={{ color: '#858585' }}>
                      {TESTIMONIALS[activeT].location} · {TESTIMONIALS[activeT].service}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveT(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: i === activeT ? '24px' : '6px', background: i === activeT ? '#14B8A4' : '#3D3D3D', minHeight: 'unset', minWidth: 'unset' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PARTNERS ═══════════════════════════════════════════════════════ */}
      <section className="section-sm bg-white" style={{ borderTop: '1px solid #EBEBEB', borderBottom: '1px solid #EBEBEB' }}>
        <div className="container">
          <p className="text-center text-micro uppercase tracking-widest mb-10" style={{ letterSpacing: '0.1em' }}>
            Trusted by Leading Healthcare Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PARTNERS.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="px-5 py-2.5 rounded-lg border cursor-pointer transition-all duration-150"
                style={{ background: '#FAFAFA', borderColor: '#EBEBEB', fontSize: '13px', fontWeight: 600, color: '#5C5C5C' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0F7FF'; (e.currentTarget as HTMLElement).style.color = '#1D77F2'; (e.currentTarget as HTMLElement).style.borderColor = '#BAD9FF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAFA'; (e.currentTarget as HTMLElement).style.color = '#5C5C5C'; (e.currentTarget as HTMLElement).style.borderColor = '#EBEBEB'; }}>
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ════════════════════════════════════════════════════════════ */}
      <section className="section bg-surface pb-32 sm:pb-24">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
          </div>

          <div className="max-w-[720px] mx-auto space-y-2">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden transition-all"
                style={{ border: `1px solid ${activeFaq === i ? '#BAD9FF' : '#EBEBEB'}`, background: '#FFFFFF', boxShadow: activeFaq === i ? 'var(--shadow-1)' : 'none' }}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <span className="font-semibold text-sm" style={{ color: activeFaq === i ? '#155DD4' : '#0F0F0F' }}>{faq.q}</span>
                  <div className="flex-shrink-0 ml-4">
                    {activeFaq === i
                      ? <ChevronUp className="w-4 h-4 text-blue-600" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm" style={{ color: '#5C5C5C', lineHeight: '1.7' }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
