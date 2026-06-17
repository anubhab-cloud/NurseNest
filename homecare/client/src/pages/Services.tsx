import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Clock, Star, Users } from 'lucide-react';

const services = [
  { icon: '👴', title: 'Elder Care', category: 'Daily Care', price: '₹499', unit: '/hr', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', badge: 'Most Popular',
    desc: 'Professional, compassionate daily care for senior citizens at home, including mobility support, medication management, and companionship.',
    features: ['Daily Activity Assistance', 'Medication Management', 'Companionship & Emotional Support', 'Fall Prevention', 'Nutrition & Meal Assistance', 'Regular Health Monitoring'],
    duration: '4-12 hrs/day', rating: '4.9', reviews: '2.3k' },
  { icon: '💉', title: 'Nursing Care', category: 'Clinical', price: '₹699', unit: '/visit', color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50',
    desc: 'Certified nurses for all clinical care needs at home — IV therapy, wound care, injections, catheter management, and more.',
    features: ['IV Line Insertion & Management', 'Wound Dressing & Care', 'Injections & Medications', 'Catheter & Stoma Care', 'Vital Signs Monitoring', 'Medical Equipment Setup'],
    duration: '1-3 hrs/visit', rating: '4.8', reviews: '1.8k' },
  { icon: '🏃', title: 'Physiotherapy', category: 'Rehabilitation', price: '₹799', unit: '/session', color: 'from-green-500 to-green-600', bg: 'bg-green-50',
    desc: 'Expert physiotherapists for post-surgery recovery, sports injuries, chronic pain management, and neurological rehabilitation.',
    features: ['Post-Surgery Rehabilitation', 'Pain Management Therapy', 'Mobility Training Programs', 'Neurological Rehabilitation', 'Sports Injury Recovery', 'Home Exercise Programs'],
    duration: '45-60 min', rating: '4.9', reviews: '1.2k' },
  { icon: '🩺', title: 'Doctor Consultation', category: 'Consultation', price: '₹399', unit: '/consult', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50',
    desc: 'Connect with licensed doctors, specialists, and GPs through video calls or in-home visits for medical advice and prescriptions.',
    features: ['Video & In-Home Consultations', 'Specialist Referrals', 'Digital Prescriptions', 'Lab Test Ordering', 'Follow-up Care Plans', 'Medical History Management'],
    duration: '20-45 min', rating: '4.7', reviews: '3.1k' },
  { icon: '🏥', title: 'Post-Surgery Care', category: 'Recovery', price: '₹899', unit: '/day', color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50',
    desc: 'Comprehensive in-home care package following hospital discharge, ensuring safe recovery with medical-grade monitoring.',
    features: ['Daily Wound Assessment', 'Medication Scheduling', 'Vitals Monitoring', 'Physiotherapy Integration', 'Nutritional Guidance', 'Progress Reports to Doctor'],
    duration: 'Package based', rating: '4.9', reviews: '890' },
  { icon: '👶', title: 'Mother & Baby Care', category: 'Postnatal', price: '₹599', unit: '/visit', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50',
    desc: 'Expert postnatal nurses providing support for new mothers and newborn care, including lactation assistance and baby wellness checks.',
    features: ['Lactation Support & Guidance', 'Newborn Wellness Checks', 'Bathing & Grooming Assistance', 'Postnatal Exercise Guidance', "Mother's Recovery Support", 'Vaccination Reminders'],
    duration: '4-8 hrs/day', rating: '4.9', reviews: '654' },
  { icon: '🛏️', title: 'Medical Equipment', category: 'Equipment', price: '₹299', unit: '/day', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50',
    desc: 'Rent hospital-grade medical equipment including ICU beds, ventilators, oxygen concentrators, and mobility aids.',
    features: ['ICU & Hospital Beds', 'Ventilators & Oxygen', 'Wheelchairs & Walkers', 'Suction Machines', 'Infusion Pumps', 'Free Installation & Training'],
    duration: 'Flexible rental', rating: '4.6', reviews: '432' },
  { icon: '🚨', title: 'Emergency Home Visit', category: 'Emergency', price: '₹1,499', unit: '/visit', color: 'from-red-500 to-red-600', bg: 'bg-red-50', badge: '30 Min Response',
    desc: 'Rapid-response medical team dispatched to your home within 30 minutes for urgent healthcare needs.',
    features: ['30-Minute Response Time', 'Live GPS Tracking', 'Trained Emergency Staff', 'Medical Equipment Kit', 'Hospital Liaison Service', '24/7 Availability'],
    duration: 'As needed', rating: '4.8', reviews: '567' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Services() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 gradient-bg text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Services</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-title mb-4">
            Comprehensive Home <span className="gradient-text">Healthcare Services</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-subtitle mx-auto">
            From daily elder care to emergency visits — we have every healthcare need covered with certified professionals.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.05, duration: 0.5 }}
                className="card-premium overflow-hidden group">
                <div className={`h-2 bg-gradient-to-r ${s.color}`} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${s.bg} rounded-2xl flex items-center justify-center text-3xl`}>{s.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold font-display text-gray-900">{s.title}</h3>
                          {s.badge && <span className="badge bg-primary-100 text-primary-700">{s.badge}</span>}
                        </div>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{s.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{s.price}</div>
                      <div className="text-xs text-gray-400">{s.unit}</div>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {s.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />{f}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.duration}</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{s.rating} ({s.reviews})</span>
                    </div>
                    <Link to="/booking" className={`flex items-center gap-2 bg-gradient-to-r ${s.color} text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity`}>
                      Book Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
