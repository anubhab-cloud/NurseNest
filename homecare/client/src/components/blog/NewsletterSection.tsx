import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, Shield, Bell, BookOpen } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section className="py-24" style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 50%,#0F172A 100%)' }}>
      <div className="container">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)' }}>
                <Bell className="w-3.5 h-3.5" style={{ color: '#60A5FA' }} />
                <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#60A5FA' }}>Weekly Newsletter</span>
              </div>

              <h2 className="font-bold mb-4" style={{ color: '#FFFFFF', fontSize: 'clamp(28px,3.5vw,40px)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Get Weekly Healthcare Insights
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: '#94A3B8', fontSize: '17px', lineHeight: '1.75' }}>
                Expert articles, care guides, and health tips delivered every Wednesday. Written by our team of 50+ certified healthcare professionals.
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: BookOpen, text: 'Weekly articles' },
                  { icon: Shield,   text: 'No spam, ever' },
                  { icon: CheckCircle, text: 'Unsubscribe anytime' },
                ].map(t => (
                  <div key={t.text} className="flex items-center gap-2">
                    <t.icon className="w-4 h-4" style={{ color: '#14B8A6' }} />
                    <span className="text-sm font-medium" style={{ color: '#CBD5E1' }}>{t.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
                {/* Subscriber count */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex -space-x-2">
                    {['PN','RK','AS','SR'].map(a => (
                      <div key={a} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ borderColor: '#0F172A', background: 'linear-gradient(135deg,#2563EB,#14B8A6)' }}>
                        {a}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>Join 24,000+ readers</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>Healthcare professionals & families</p>
                  </div>
                </div>

                {done ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8">
                    <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: '#14B8A6' }} />
                    <p className="font-bold text-white text-lg mb-1">You're subscribed!</p>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>First issue arrives this Wednesday.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); if (email) setDone(true); }}>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#CBD5E1' }}>Email Address</label>
                    <div className="relative mb-4">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748B' }} />
                      <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 h-12 rounded-xl outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', fontSize: '15px' }} />
                    </div>
                    <button type="submit"
                      className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                      style={{ background: 'linear-gradient(135deg,#2563EB,#14B8A6)', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', minHeight: 'unset', minWidth: 'unset' }}>
                      Subscribe to Newsletter <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-center mt-3" style={{ color: '#475569' }}>
                      By subscribing, you agree to receive weekly healthcare insights. No spam.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
