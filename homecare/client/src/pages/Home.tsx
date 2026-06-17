"use client";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, Star, Shield, CheckCircle, Phone, ChevronDown, ChevronUp,
  Heart, Activity, UserCheck, Zap, Award, DollarSign, Headphones,
  Clock, Calendar, TrendingUp, Navigation, MessageSquare
} from 'lucide-react';

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
      <section className="relative min-h-[100dvh] flex items-center pt-16 pb-24 sm:pb-16 bg-animated overflow-hidden">
        {/* Blob accents */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, #BAD9FF 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #99F4E8 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="container relative z-10">
          <div className="grid-12 items-center">
            {/* Left — 6 cols */}
            <motion.div className="col-span-12 lg:col-span-6"
              initial="hidden" animate="visible" variants={stagger}>
              {/* Eyebrow */}
              <motion.div variants={fadeUp} {...dur}
                className="inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-full mb-8"
                style={{ boxShadow: 'var(--shadow-1)' }}>
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse-dot" />
                <span className="text-xs font-semibold text-gray-600">Rated #1 Home Healthcare Platform 2024</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp} {...dur} className="mb-6 text-balance">
                Professional Care,{' '}
                <span className="text-gradient">Right at Your Home</span>
              </motion.h1>

              {/* Body */}
              <motion.p variants={fadeUp} {...dur} className="text-body mb-8 max-w-[480px]">
                Connect with <strong className="font-semibold text-gray-900">500+ certified caregivers</strong> for elder
                care, nursing, physiotherapy, and more. Available 24/7. Confirmed in minutes.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} {...dur} className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link to="/booking" className="btn btn-primary btn-lg">
                  Book Free Consultation <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/services" className="btn btn-secondary btn-lg">
                  Explore Services
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} {...dur} className="flex flex-wrap gap-3">
                {[
                  { icon: Shield,       text: 'Background Verified' },
                  { icon: CheckCircle,  text: 'ISO Certified'       },
                  { icon: Star,         text: '4.9 / 5 Rating'       },
                ].map(b => (
                  <div key={b.text}
                    className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-2 rounded-lg"
                    style={{ boxShadow: 'var(--shadow-1)' }}>
                    <b.icon className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-700">{b.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — 5 cols offset 1 */}
            <motion.div className="col-span-12 lg:col-span-5 lg:col-start-8 hidden lg:block"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <div className="relative h-[480px]">
                {/* Main card */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-0 top-8 card" style={{ boxShadow: 'var(--shadow-3)' }}>
                  <div className="card-body">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="icon-box-xl" style={{ background: 'linear-gradient(135deg,#1D77F2,#14B8A4)' }}>
                        <span className="text-2xl">👨‍⚕️</span>
                      </div>
                      <div>
                        <h4 className="text-gray-900">Dr. Priya Nair</h4>
                        <p className="text-muted mt-0.5">Senior Home Nurse · 8 yrs exp</p>
                        <div className="flex gap-0.5 mt-1.5">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-6">
                      {['Elder Care', 'IV Therapy', 'Wound Care'].map(s => (
                        <span key={s} className="badge badge-blue">{s}</span>
                      ))}
                    </div>
                    <Link to="/booking" className="btn btn-primary w-full justify-center">
                      Book Now — ₹499/hr
                    </Link>
                  </div>
                </motion.div>

                {/* Arrival badge */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -left-6 bottom-32 card px-4 py-3 flex items-center gap-3"
                  style={{ width: '200px', boxShadow: 'var(--shadow-2)' }}>
                  <div className="icon-box-md" style={{ background: '#ECFDF5' }}>
                    <Navigation className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-micro">Caregiver Arriving</p>
                    <p className="font-bold text-gray-900 text-sm">In 28 minutes</p>
                  </div>
                </motion.div>

                {/* Growth badge */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -right-4 bottom-16 card px-4 py-3 flex items-center gap-3"
                  style={{ width: '196px', boxShadow: 'var(--shadow-2)' }}>
                  <div className="icon-box-md" style={{ background: '#E0EFFF' }}>
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-micro">Monthly Visits</p>
                    <p className="font-bold text-gray-900 text-sm">+12,400 this month</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-gray-400">
          <span className="text-micro">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ══ STATS BAR ══════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1D77F2 0%, #14B8A4 100%)' }}>
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-4xl font-extrabold font-display text-white mb-1 tracking-tight">
                  <Counter end={s.end} suffix={s.suffix} />
                </p>
                <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ═══════════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">What We Offer</span>
            <h2>Our <span className="text-gradient">Healthcare Services</span></h2>
            <p>Comprehensive home healthcare delivered by certified professionals.</p>
          </div>

          {/* Desktop grid */}
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

          {/* Mobile horizontal snap */}
          <div className="snap-x sm:hidden pb-4 -mx-6 px-6">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="snap-start card" style={{ width: '260px' }}>
                <div className="card-body">
                  <div className="icon-box-xl mb-4" style={{ background: '#F5F5F5', fontSize: '24px' }}>{s.emoji}</div>
                  <span className="eyebrow mb-2 block">{s.category}</span>
                  <h4 className="text-gray-900 mb-2">{s.title}</h4>
                  <p className="text-muted truncate-3 text-xs">{s.desc}</p>
                </div>
                <div className="card-footer">
                  <Link to="/services" className="flex items-center gap-1 text-xs font-semibold text-blue-600" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
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
