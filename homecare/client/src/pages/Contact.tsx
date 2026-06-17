import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <div className="pt-20">
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mb-4">
            Get in <span className="gradient-text">Touch</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-subtitle mx-auto">
            We're here to help 24/7. Reach out for bookings, queries, or emergencies.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold font-display text-gray-900 mb-8">Contact Information</h2>
            <div className="space-y-5 mb-10">
              {[
                { icon: Phone, label: 'Toll-Free Helpline', value: '1800-000-0000', sub: 'Available 24/7, 365 days', color: 'bg-blue-100 text-blue-600' },
                { icon: Phone, label: 'Emergency Hotline', value: '+91 98765 43200', sub: 'For urgent medical assistance', color: 'bg-red-100 text-red-600' },
                { icon: Mail, label: 'Email Support', value: 'care@homecareplus.in', sub: 'Response within 2 hours', color: 'bg-green-100 text-green-600' },
                { icon: MessageSquare, label: 'WhatsApp', value: '+91 98765 43210', sub: 'Quick chat support', color: 'bg-teal-100 text-teal-600' },
                { icon: MapPin, label: 'Head Office', value: 'Bengaluru, Karnataka', sub: 'MG Road, Bengaluru - 560001', color: 'bg-purple-100 text-purple-600' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center flex-shrink-0`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{c.label}</p>
                    <p className="font-bold text-gray-900">{c.value}</p>
                    <p className="text-sm text-gray-500">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <h3 className="font-bold text-red-700">Emergency Hotline</h3>
              </div>
              <p className="text-red-600 text-3xl font-bold font-display">1800-911-1234</p>
              <p className="text-red-500 text-sm mt-1">30-minute response guarantee</p>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-500">We'll get back to you within 2 hours.</p>
              </motion.div>
            ) : (
              <div className="bg-white rounded-3xl shadow-premium border border-gray-100 p-8">
                <h2 className="text-xl font-bold font-display text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                      <input className="input-field" placeholder="John Doe" value={form.name} onChange={e => update('name', e.target.value)} required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <input className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <select className="input-field" value={form.subject} onChange={e => update('subject', e.target.value)} required>
                      <option value="">Select a topic...</option>
                      <option>Book a Service</option>
                      <option>Pricing Query</option>
                      <option>Technical Support</option>
                      <option>Billing</option>
                      <option>Emergency</option>
                      <option>Other</option>
                    </select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea className="input-field resize-none" rows={4} placeholder="How can we help you?" value={form.message} onChange={e => update('message', e.target.value)} required /></div>
                  <button type="submit" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                    Send Message <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
