import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, X, Zap } from 'lucide-react';

const plans = [
  { name: 'Basic Care', price: { monthly: 999, yearly: 799 }, color: 'from-gray-600 to-gray-700', popular: false,
    desc: 'Perfect for occasional care needs with essential features.',
    features: ['2 Home Visits/Month', 'Basic Nursing Care', 'Chat Support', 'Digital Prescriptions', 'Basic Health Reports', null, null, null] },
  { name: 'Standard Care', price: { monthly: 2499, yearly: 1999 }, color: 'from-primary-600 to-primary-700', popular: true,
    desc: 'Most popular plan for families needing regular healthcare at home.',
    features: ['8 Home Visits/Month', 'All Nursing Services', '24/7 Chat & Phone Support', 'Digital Prescriptions', 'Detailed Health Reports', 'AI Caregiver Matching', 'Medicine Delivery', null] },
  { name: 'Premium Care', price: { monthly: 4999, yearly: 3999 }, color: 'from-teal-600 to-teal-700', popular: false,
    desc: 'Comprehensive care package for intensive and ongoing healthcare.',
    features: ['Unlimited Home Visits', 'All Services Included', 'Dedicated Care Manager', 'Priority Booking', 'Advanced Health Analytics', 'AI Caregiver Matching', 'Medicine Delivery', 'Insurance Assistance'] },
  { name: 'Enterprise', price: { monthly: 9999, yearly: 7999 }, color: 'from-purple-600 to-purple-700', popular: false,
    desc: 'For businesses, hospitals & corporates needing bulk healthcare.',
    features: ['Custom Visit Plans', 'Corporate Health Plans', 'Dedicated Account Team', 'Custom Reporting', 'API Integration', 'White-label Options', 'Bulk Billing', 'SLA Guarantees'] },
];

const comparison = [
  { feature: 'Home Visits', basic: '2/month', standard: '8/month', premium: 'Unlimited', enterprise: 'Custom' },
  { feature: 'Nursing Care', basic: 'Basic', standard: 'Full', premium: 'Full', enterprise: 'Custom' },
  { feature: 'Doctor Consult', basic: false, standard: '2/month', premium: 'Unlimited', enterprise: 'Custom' },
  { feature: '24/7 Support', basic: 'Chat Only', standard: 'Chat + Phone', premium: 'Dedicated', enterprise: 'SLA-Backed' },
  { feature: 'AI Matching', basic: false, standard: true, premium: true, enterprise: true },
  { feature: 'Health Reports', basic: 'Basic', standard: 'Detailed', premium: 'Advanced', enterprise: 'Custom' },
  { feature: 'Caregiver Manager', basic: false, standard: false, premium: true, enterprise: true },
  { feature: 'Insurance Support', basic: false, standard: false, premium: true, enterprise: true },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 gradient-bg text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-subtitle mx-auto mb-8">
            No hidden fees. No surprise charges. Choose the plan that fits your needs.
          </motion.p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-1.5 shadow-md border border-gray-100">
            <button onClick={() => setYearly(false)} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${!yearly ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${yearly ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Yearly <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl overflow-hidden ${plan.popular ? 'ring-2 ring-primary-500 shadow-2xl scale-105' : 'border border-gray-200 shadow-card'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center py-2 text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <div className={`${plan.popular ? 'pt-10' : 'pt-0'} p-6`}>
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}>
                    <span className="text-white font-bold text-sm">{plan.name[0]}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-xs mb-5 leading-relaxed">{plan.desc}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold font-display text-gray-900">₹{(yearly ? plan.price.yearly : plan.price.monthly).toLocaleString()}</span>
                    <span className="text-gray-400 text-sm">/month</span>
                    {yearly && <div className="text-green-600 text-xs font-medium mt-0.5">Save ₹{((plan.price.monthly - plan.price.yearly) * 12).toLocaleString()}/year</div>}
                  </div>

                  <Link to="/booking" className={`block w-full text-center py-3 rounded-xl font-semibold text-sm mb-6 transition-all ${plan.popular ? `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 shadow-lg` : 'border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600'}`}>
                    Get Started
                  </Link>

                  <ul className="space-y-2.5">
                    {plan.features.map((f, j) => f ? (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />{f}
                      </li>
                    ) : (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-300">
                        <X className="w-4 h-4 flex-shrink-0" />Not included
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold font-display text-center mb-12">Compare All Plans</h2>
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-5 text-gray-500 text-sm font-semibold">Features</th>
                  {plans.map(p => <th key={p.name} className={`p-5 text-sm font-bold ${p.popular ? 'text-primary-600 bg-primary-50' : 'text-gray-700'}`}>{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-5 text-sm text-gray-700 font-medium">{row.feature}</td>
                    {(['basic', 'standard', 'premium', 'enterprise'] as const).map(k => (
                      <td key={k} className={`p-5 text-center text-sm ${k === 'standard' ? 'bg-primary-50/50' : ''}`}>
                        {typeof row[k] === 'boolean' ? (
                          row[k] ? <CheckCircle className="w-5 h-5 text-teal-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                        ) : <span className="text-gray-700">{row[k]}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
