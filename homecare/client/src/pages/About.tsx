import { motion } from 'framer-motion';
import { Heart, Target, Eye, Award, Users, TrendingUp } from 'lucide-react';

const team = [
  { name: 'Dr. Arjun Mehta', role: 'CEO & Co-Founder', bio: 'Former AIIMS doctor with 15 years in healthcare policy.', avatar: 'AM' },
  { name: 'Priya Krishnan', role: 'COO & Co-Founder', bio: 'Healthcare operations expert from Apollo & Fortis.', avatar: 'PK' },
  { name: 'Rahul Verma', role: 'CTO', bio: 'Ex-Google engineer. Built scalable health tech products.', avatar: 'RV' },
  { name: 'Dr. Sunita Rao', role: 'Chief Medical Officer', bio: '20 years in clinical nursing and healthcare management.', avatar: 'SR' },
];

const timeline = [
  { year: '2020', event: 'Founded in Bengaluru with 10 caregivers and a mission to democratize homecare.' },
  { year: '2021', event: 'Expanded to 5 cities. Completed 10,000 home visits. Raised Series A.' },
  { year: '2022', event: 'Launched AI caregiver matching. Onboarded 200+ certified professionals.' },
  { year: '2023', event: 'Expanded to 20+ cities. 100,000+ patients served. ISO 27001 certified.' },
  { year: '2024', event: 'Launched Premium Care plans. Raised Series B funding. 500+ caregivers.' },
  { year: '2025', event: 'Pan-India presence in 50+ cities. 1M+ care hours delivered. Profitability achieved.' },
];

const values = [
  { icon: Heart, title: 'Compassion First', desc: 'Every care decision is driven by empathy and genuine concern for our patients.', color: 'bg-red-100 text-red-600' },
  { icon: Award, title: 'Excellence', desc: 'We set and maintain the highest standards in healthcare quality and professionalism.', color: 'bg-amber-100 text-amber-600' },
  { icon: Users, title: 'Trust & Transparency', desc: 'Open communication, honest pricing, and verified professionals build lasting trust.', color: 'bg-blue-100 text-blue-600' },
  { icon: TrendingUp, title: 'Innovation', desc: 'We continuously improve using technology to make healthcare more accessible.', color: 'bg-purple-100 text-purple-600' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 gradient-bg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mb-6">
            Redefining <span className="gradient-text">Home Healthcare</span> in India
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Founded in 2020 by doctors and technologists, HomeCare+ was built on a simple belief — everyone deserves access to professional, compassionate healthcare at home.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            {[
              { icon: Target, title: 'Our Mission', color: 'from-primary-500 to-primary-600',
                text: 'To make professional, affordable, and trustworthy home healthcare accessible to every family in India — regardless of geography or socioeconomic status.' },
              { icon: Eye, title: 'Our Vision', color: 'from-teal-500 to-teal-600',
                text: "To become India's most trusted healthcare-at-home platform, where every patient feels cared for, every caregiver feels valued, and every family feels safe." },
            ].map(item => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="card-premium p-8">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-display text-gray-900 mb-4">{item.title}</h2>
                <p className="text-gray-500 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 gradient-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Our Core <span className="gradient-text">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="card-premium p-6 text-center">
                <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 font-display mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Meet Our <span className="gradient-text">Leadership Team</span></h2>
            <p className="section-subtitle mx-auto">World-class healthcare and technology experts united by a shared mission.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="card-premium p-6 text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold group-hover:scale-105 transition-transform shadow-lg">
                  {t.avatar}
                </div>
                <h3 className="font-bold text-gray-900 font-display">{t.name}</h3>
                <p className="text-primary-600 text-sm font-medium mb-2">{t.role}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{t.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold font-display text-white mb-4">Our <span className="text-teal-400">Journey</span></h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-teal-500" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <motion.div key={t.year} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-8 pl-20 relative">
                  <div className="absolute left-4 top-1.5 w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {t.year.slice(-2)}
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-2xl p-5 flex-1 border border-white/10">
                    <span className="text-teal-400 font-bold text-sm">{t.year}</span>
                    <p className="text-gray-300 text-sm mt-1 leading-relaxed">{t.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
