import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Clock, Star } from 'lucide-react';

const SERVICES = [
  { icon: '👴', title: 'Elder Care',           cat: 'Daily Care',      price: '₹499',   unit: '/hr',      badge: 'Most Popular', c: '#E0EFFF', t: '#155DD4', r: '4.9', rv: '2.3k', dur: '4–12 hrs/day',   desc: 'Professional daily care for seniors including mobility support, medication management, and compassionate companionship.', features: ['Daily Activity Assistance','Medication Management','Companionship Support','Fall Prevention','Nutrition Assistance','Health Monitoring'] },
  { icon: '💉', title: 'Nursing Care',          cat: 'Clinical',        price: '₹699',   unit: '/visit',   badge: '', c: '#CCFBF3', t: '#0D9488', r: '4.8', rv: '1.8k', dur: '1–3 hrs/visit',  desc: 'Certified nurses for IV therapy, wound dressing, injections, catheter management, and all clinical care needs at home.', features: ['IV Line Management','Wound Dressing','Injections & Meds','Catheter Care','Vital Signs Check','Equipment Setup'] },
  { icon: '🏃', title: 'Physiotherapy',         cat: 'Rehabilitation',  price: '₹799',   unit: '/session', badge: '', c: '#ECFDF5', t: '#065F46', r: '4.9', rv: '1.2k', dur: '45–60 min',      desc: 'Expert physiotherapists for post-surgery recovery, sports injuries, chronic pain management, and neurological rehabilitation.', features: ['Post-Surgery Recovery','Pain Management','Mobility Training','Neuro Rehab','Sports Injury Care','Home Exercise Plans'] },
  { icon: '🩺', title: 'Doctor Consultation',   cat: 'Consultation',    price: '₹399',   unit: '/consult', badge: '', c: '#F3E8FF', t: '#6B21A8', r: '4.7', rv: '3.1k', dur: '20–45 min',      desc: 'Licensed doctors, specialists and GPs available via video or in-home visits for advice, diagnosis, and prescriptions.', features: ['Video & Home Consults','Specialist Referrals','Digital Prescriptions','Lab Test Orders','Follow-up Plans','Medical History'] },
  { icon: '🏥', title: 'Post-Surgery Care',     cat: 'Recovery',        price: '₹899',   unit: '/day',     badge: '', c: '#FEF2F2', t: '#991B1B', r: '4.9', rv: '890',  dur: 'Package based',  desc: 'Comprehensive in-home care following hospital discharge, ensuring safe recovery with medical-grade monitoring.', features: ['Daily Wound Assessment','Medication Scheduling','Vitals Monitoring','Physio Integration','Nutritional Guidance','Doctor Reports'] },
  { icon: '👶', title: 'Mother & Baby Care',    cat: 'Postnatal',       price: '₹599',   unit: '/visit',   badge: '', c: '#FEF9C3', t: '#854D0E', r: '4.9', rv: '654',  dur: '4–8 hrs/day',    desc: 'Expert postnatal nurses providing support for new mothers and newborn care including lactation assistance and wellness.', features: ['Lactation Support','Newborn Wellness','Bathing Assistance','Postnatal Exercise','Mother Recovery','Vaccination Reminders'] },
  { icon: '🛏️', title: 'Medical Equipment',    cat: 'Equipment',       price: '₹299',   unit: '/day',     badge: '', c: '#FFF7ED', t: '#9A3412', r: '4.6', rv: '432',  dur: 'Flexible rental', desc: 'Rent hospital-grade ICU beds, ventilators, oxygen concentrators, wheelchairs, and mobility aids with free installation.', features: ['ICU & Hospital Beds','Ventilators & Oxygen','Wheelchairs','Suction Machines','Infusion Pumps','Free Installation'] },
  { icon: '🚨', title: 'Emergency Visit',       cat: 'Emergency',       price: '₹1,499', unit: '/visit',   badge: '30 Min Response', c: '#FEF2F2', t: '#991B1B', r: '4.8', rv: '567', dur: 'As needed', desc: 'Rapid-response medical team dispatched within 30 minutes for all urgent healthcare needs at your doorstep.', features: ['30-Min Response','Live GPS Tracking','Trained Emergency Staff','Medical Kit','Hospital Liaison','24/7 Available'] },
];

export default function Services() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="section-sm bg-brand text-center">
        <div className="container">
          <span className="eyebrow block mb-4">Our Services</span>
          <h1 className="mb-4">Comprehensive Home <span className="text-gradient">Healthcare</span></h1>
          <p className="text-body max-w-[560px] mx-auto">
            From daily elder care to emergency visits — every service delivered by certified professionals.
          </p>
        </div>
      </section>

      {/* Strict 2-column card grid */}
      <section className="section bg-white">
        <div className="container">
          <div className="card-grid-2">
            {SERVICES.map((s, i) => (
              <motion.div key={s.title} className="card"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08, duration: 0.45 }}>
                <div className="h-1 rounded-t-2xl" style={{ background: s.t }} />
                <div className="card-body">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="icon-box-xl" style={{ background: s.c, fontSize: '28px' }}>{s.icon}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-gray-900">{s.title}</h3>
                          {s.badge && <span className="badge badge-blue">{s.badge}</span>}
                        </div>
                        <span className="eyebrow" style={{ color: s.t }}>{s.cat}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-2xl font-extrabold font-display" style={{ color: '#0F0F0F' }}>{s.price}</p>
                      <p className="text-micro">{s.unit}</p>
                    </div>
                  </div>
                  {/* Description */}
                  <p className="text-muted mb-6">{s.desc}</p>
                  {/* Features — strict 2-col */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                    {s.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-teal-500" />
                        <span className="text-xs" style={{ color: '#5C5C5C' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-xs" style={{ color: '#858585' }}>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.dur}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{s.r} ({s.rv})</span>
                  </div>
                </div>
                <div className="card-footer">
                  <Link to="/booking" className="btn btn-primary w-full justify-center">
                    Book Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
