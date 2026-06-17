import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Star, Shield, Clock, CheckCircle, Phone, ChevronDown, ChevronUp,
  Heart, Activity, UserCheck, Zap, Award, DollarSign, Headphones,
  Users, TrendingUp, MapPin, Calendar, Play
} from 'lucide-react';

// ─── Animated Counter ──────────────────────────────────────────────────────────
function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); } else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Service Card ──────────────────────────────────────────────────────────────
const services = [
  { icon: '👴', title: 'Elder Care', desc: 'Compassionate daily assistance, medication management, and companionship for seniors.', features: ['24/7 Monitoring', 'Meal Assistance', 'Mobility Support'], color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
  { icon: '💉', title: 'Nursing Care', desc: 'Certified nurses for IV therapy, wound dressing, injections, and clinical care.', features: ['Wound Dressing', 'IV Therapy', 'Vitals Check'], color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50' },
  { icon: '🏃', title: 'Physiotherapy', desc: 'Expert physiotherapists for post-surgery recovery and rehabilitation programs.', features: ['Post-Op Recovery', 'Pain Management', 'Mobility Training'], color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
  { icon: '🩺', title: 'Doctor Consultation', desc: 'Video and in-home consultations with licensed doctors, specialists & GPs.', features: ['Video Call', 'Home Visit', 'Prescriptions'], color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  { icon: '🏥', title: 'Post-Surgery Care', desc: 'Comprehensive recovery support after surgeries with medical-grade monitoring.', features: ['Medication Mgmt', 'Dressing Change', 'Progress Reports'], color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50' },
  { icon: '👶', title: 'Mother & Baby Care', desc: 'Expert postnatal nurses for new mothers and newborn care at home.', features: ['Lactation Support', 'Baby Care', 'Mother Wellness'], color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
  { icon: '🛏️', title: 'Medical Equipment', desc: 'Rent hospital-grade equipment like ICU beds, ventilators, and wheelchairs.', features: ['ICU Beds', 'Ventilators', 'Wheelchairs'], color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
  { icon: '🚨', title: 'Emergency Visits', desc: 'Rapid-response medical professionals dispatched within 30 minutes.', features: ['30 Min Response', 'GPS Tracking', '24/7 Available'], color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
];

const stats = [
  { end: 10000, suffix: '+', label: 'Happy Patients', icon: Heart },
  { end: 500, suffix: '+', label: 'Certified Caregivers', icon: UserCheck },
  { end: 24, suffix: '/7', label: 'Support Available', icon: Headphones },
  { end: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
];

const whyUs = [
  { icon: Shield, title: 'Verified Professionals', desc: 'Every caregiver undergoes rigorous background checks, credential verification, and skills assessment.', color: 'text-blue-600 bg-blue-100' },
  { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden fees. Get upfront pricing before you book, with flexible payment options.', color: 'text-green-600 bg-green-100' },
  { icon: Zap, title: 'Fast Response', desc: 'Emergency visits within 30 minutes. Standard bookings confirmed in under 2 hours.', color: 'text-yellow-600 bg-yellow-100' },
  { icon: Clock, title: '24/7 Availability', desc: 'Round-the-clock care. Our professionals are available at any time, any day.', color: 'text-purple-600 bg-purple-100' },
  { icon: Activity, title: 'AI-Assisted Matching', desc: 'Our smart algorithm matches you with the perfect caregiver based on your specific needs.', color: 'text-teal-600 bg-teal-100' },
  { icon: Award, title: 'Secure Payments', desc: 'PCI-compliant payment gateway with invoice generation and insurance support.', color: 'text-rose-600 bg-rose-100' },
];

const steps = [
  { n: '01', title: 'Book Service', desc: 'Tell us your care requirements through our simple booking form.', icon: Calendar },
  { n: '02', title: 'Choose Professional', desc: 'Browse verified caregivers matched to your needs and budget.', icon: UserCheck },
  { n: '03', title: 'Schedule Visit', desc: 'Pick the date and time that works best for you. Instant confirmation.', icon: Clock },
  { n: '04', title: 'Receive Care', desc: 'Your caregiver arrives on time. Track the visit live on our app.', icon: Heart },
];

const testimonials = [
  { name: 'Priya Sharma', location: 'Bengaluru', rating: 5, text: "HomeCare+ has been a blessing for my father's recovery. The nurse was professional, compassionate, and incredibly skilled. I highly recommend this service.", avatar: 'PS', service: 'Post-Surgery Care' },
  { name: 'Ramesh Gupta', location: 'Mumbai', rating: 5, text: "Booked a physiotherapist for my knee surgery recovery. Within 3 weeks I was walking again! The AI matching found the perfect therapist for my condition.", avatar: 'RG', service: 'Physiotherapy' },
  { name: 'Anita Mehta', location: 'Delhi', rating: 5, text: "The elder care service for my mother is outstanding. Regular vitals tracking, medication reminders, and genuine companionship. Worth every rupee.", avatar: 'AM', service: 'Elder Care' },
  { name: 'Dr. Suresh Nair', location: 'Hyderabad', rating: 5, text: "As a doctor, I recommend HomeCare+ to all my patients who need post-discharge care. Professional, hygienic, and truly medical-grade service at home.", avatar: 'SN', service: 'Nursing Care' },
];

const faqs = [
  { q: 'How quickly can I get a caregiver at home?', a: 'For emergency services, we dispatch within 30 minutes. For scheduled bookings, we confirm and assign a caregiver within 2 hours. Same-day service is available in most cities.' },
  { q: 'Are all caregivers background verified?', a: 'Yes. Every professional on our platform undergoes a thorough background check, credential verification, and practical skills assessment before joining.' },
  { q: 'What is your cancellation policy?', a: 'Free cancellation up to 2 hours before the scheduled visit. Cancellations within 2 hours are subject to a 20% fee to compensate the caregiver for their time.' },
  { q: 'Is HomeCare+ available in my city?', a: 'We currently operate in 25+ cities across India including Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, Pune, and more. Enter your pin code during booking to check availability.' },
  { q: 'How are payments handled?', a: 'We accept all major cards, UPI, net banking, and EMI options. Payments are processed securely through our PCI-compliant gateway. Invoices are generated automatically.' },
  { q: 'Can I request the same caregiver for regular visits?', a: 'Absolutely. Once you find a caregiver you trust, you can schedule recurring visits with them directly through your dashboard.' },
];

const partners = ['Apollo', 'Fortis', 'Max Health', 'Medanta', 'Narayana', 'Star Health', 'HDFC ERGO', 'ICICI Lombard'];

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } } as const;
const stagger = { visible: { transition: { staggerChildren: 0.1 } } } as const;

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] flex items-center pt-16 pb-24 sm:pb-16 overflow-hidden animated-gradient">
        {/* Background blobs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-200/40 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-primary-100 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">🏆 Rated #1 Home Healthcare Platform 2024</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-display text-gray-900 leading-[1.1] mb-5 sm:mb-6">
              Professional Care,<br />
              <span className="gradient-text">Right at Your</span><br />
              Home
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base sm:text-lg text-gray-500 max-w-lg leading-relaxed mb-7 sm:mb-8">
              Connect with <strong className="text-gray-700">500+ certified caregivers</strong> for elder care, nursing, physiotherapy, and more. Available 24/7. Confirmed in minutes.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link to="/booking" className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-4 px-6 sm:px-8">
                Book Free Consultation <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link to="/services" className="btn-outline flex items-center justify-center gap-2 text-sm sm:text-base py-4 px-6 sm:px-8">
                Explore Services
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              {[
                { icon: Shield, text: 'Background Verified' },
                { icon: CheckCircle, text: 'ISO Certified' },
                { icon: Star, text: '4.9/5 Rating' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                  <b.icon className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-semibold text-gray-700">{b.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Floating Cards */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block">
            <div className="relative w-full h-[520px]">
              {/* Main card */}
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-8 top-8 glass rounded-3xl p-8 shadow-glass-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">👨‍⚕️</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Dr. Priya Nair</h3>
                    <p className="text-gray-500 text-sm">Senior Home Nurse • 8 yrs exp</p>
                    <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['Elder Care', 'IV Therapy', 'Wound Care'].map(s => (
                    <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-1.5 rounded-lg text-center font-medium">{s}</span>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-primary-600 to-teal-600 text-white py-3 rounded-xl font-semibold text-sm">
                  Book Now — ₹499/hr
                </button>
              </motion.div>

              {/* Floating badge 1 */}
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -left-4 bottom-24 glass rounded-2xl px-4 py-3 shadow-glass flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Caregiver Arriving</p>
                  <p className="font-bold text-gray-900 text-sm">In 28 minutes</p>
                </div>
              </motion.div>

              {/* Floating badge 2 */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-4 bottom-12 glass rounded-2xl px-4 py-3 shadow-glass flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monthly Visits</p>
                  <p className="font-bold text-gray-900 text-sm">+12,400 this month</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }} className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-bold font-display text-white mb-1">
                  <Counter end={s.end} suffix={s.suffix} />
                </div>
                <p className="text-primary-100 text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10 sm:mb-16">
            <motion.p variants={fadeUp} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">What We Offer</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">Our <span className="gradient-text">Healthcare Services</span></motion.h2>
            <motion.p variants={fadeUp} className="section-subtitle">Comprehensive home healthcare services delivered by certified professionals.</motion.p>
          </motion.div>

          {/* Mobile: horizontal snap scroll — Desktop: grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }} whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group card-premium p-5 sm:p-6 cursor-pointer">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${s.bg} rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 font-display">{s.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">{s.desc}</p>
                <ul className="space-y-1.5 mb-4 sm:mb-5">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/services" className="flex items-center gap-1.5 text-primary-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="sm:hidden snap-x-scroll pb-4 -mx-4 px-4">
            {services.map((s, i) => (
              <div key={s.title} className="snap-start w-64 shrink-0 card-premium p-5">
                <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center text-2xl mb-3`}>{s.icon}</div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5 font-display">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{s.desc}</p>
                <Link to="/services" className="flex items-center gap-1.5 text-primary-600 text-sm font-semibold">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">Simple Process</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">How It <span className="gradient-text">Works</span></motion.h2>
            <motion.p variants={fadeUp} className="section-subtitle">Get professional home care in 4 easy steps.</motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-teal-400" />

            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }} className="relative text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-teal-500 rounded-3xl flex flex-col items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  <s.icon className="w-8 h-8 text-white mb-1" />
                  <span className="text-white/80 text-xs font-bold">{s.n}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg font-display mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/booking" className="btn-primary inline-flex items-center gap-2 py-4 px-10 text-base">
              Start Booking Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">Why HomeCare+</motion.p>
              <motion.h2 variants={fadeUp} className="section-title mb-6">The Smarter Way to Get <span className="gradient-text">Home Healthcare</span></motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-lg leading-relaxed mb-8">
                We combine technology with compassion to deliver healthcare experiences that feel personal, reliable, and world-class.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                  Learn About Us <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {whyUs.map((w, i) => (
                <motion.div key={w.title} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="card-premium p-5 group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${w.color} group-hover:scale-110 transition-transform`}>
                    <w.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 font-display">{w.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-teal-400 font-semibold text-sm uppercase tracking-wider mb-3">Patient Stories</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-4">
              Real People, <span className="text-teal-400">Real Impact</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join 10,000+ families who trust HomeCare+ for their healthcare needs.
            </motion.p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }} className="glass-dark rounded-3xl p-10 text-center">
                <div className="flex gap-1 justify-center mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-200 text-xl leading-relaxed mb-8 italic">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{testimonials[activeTestimonial].name}</p>
                    <p className="text-gray-400 text-sm">{testimonials[activeTestimonial].location} • {testimonials[activeTestimonial].service}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-teal-400 w-8' : 'bg-gray-600 w-2'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-gray-400 text-sm font-medium uppercase tracking-wider mb-10">Trusted by Leading Healthcare Partners</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="px-6 py-3 bg-gray-50 rounded-xl text-gray-500 font-semibold text-sm hover:bg-primary-50 hover:text-primary-600 transition-all cursor-pointer border border-gray-100">
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APP DOWNLOAD ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">Mobile App</motion.p>
              <motion.h2 variants={fadeUp} className="section-title mb-6">
                Care at Your <span className="gradient-text">Fingertips</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-lg leading-relaxed mb-8">
                Book, track, and manage all your healthcare needs from our award-winning mobile app. Available on iOS and Android.
              </motion.p>
              <motion.div variants={fadeUp} className="flex gap-4">
                <a href="#" className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg">
                  <span className="text-2xl">🍎</span>
                  <div className="text-left leading-none">
                    <span className="text-[10px] text-gray-400 block">Download on the</span>
                    <span className="text-base font-bold">App Store</span>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg">
                  <span className="text-2xl">▶️</span>
                  <div className="text-left leading-none">
                    <span className="text-[10px] text-gray-400 block">Get it on</span>
                    <span className="text-base font-bold">Google Play</span>
                  </div>
                </a>
              </motion.div>
              <motion.div variants={fadeUp} className="flex gap-6 mt-8">
                {[['4.9', 'App Store Rating'], ['2M+', 'Downloads'], ['100K+', 'Reviews']].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-bold font-display text-gray-900">{v}</div>
                    <div className="text-xs text-gray-500">{l}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex justify-center">
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-64 h-[500px] bg-gradient-to-br from-gray-900 to-gray-700 rounded-[3rem] p-4 shadow-2xl border-4 border-gray-800">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-full" />
                <div className="h-full bg-gradient-to-br from-primary-50 to-teal-50 rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-primary-600 to-teal-600 p-5 text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-5 h-5 fill-white" />
                      <span className="font-bold text-sm">HomeCare+</span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight">Good morning,<br />Priya! 👋</h3>
                    <p className="text-primary-100 text-xs mt-1">Your next visit is tomorrow at 9 AM</p>
                  </div>
                  <div className="p-4 space-y-3 flex-1">
                    {['🏥 Book Service', '📋 My Bookings', '💊 Health Records', '🔔 Notifications'].map(item => (
                      <div key={item} className="bg-white rounded-xl p-3 shadow-sm text-xs font-medium text-gray-700 flex items-center gap-2">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      {/* Add pb-24 for bottom nav space on mobile */}
      <section className="py-16 sm:py-24 pb-28 sm:pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">FAQs</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">Frequently Asked <span className="gradient-text">Questions</span></motion.h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className={`border rounded-2xl overflow-hidden transition-all ${activeFaq === i ? 'border-primary-200 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className={`font-semibold text-sm ${activeFaq === i ? 'text-primary-700' : 'text-gray-900'}`}>{faq.q}</span>
                  {activeFaq === i ? <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
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
