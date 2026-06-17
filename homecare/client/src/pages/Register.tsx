import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'patient' });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await register(form); navigate('/dashboard/patient'); }
    catch (err: any) { setError(err.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-24 px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-premium p-8 border border-gray-100">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold font-display text-gray-900">HomeCare<span className="text-primary-600">+</span></span>
          </Link>

          <h1 className="text-2xl font-bold font-display text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Start receiving professional home healthcare today.</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">First Name</label>
                <input className="input-field text-sm" placeholder="John" value={form.firstName} onChange={e => update('firstName', e.target.value)} required /></div>
              <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Last Name</label>
                <input className="input-field text-sm" placeholder="Doe" value={form.lastName} onChange={e => update('lastName', e.target.value)} required /></div>
            </div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" className="input-field text-sm" placeholder="john@example.com" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
              <input className="input-field text-sm" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} required /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" className="input-field text-sm" placeholder="Min. 8 characters" value={form.password} onChange={e => update('password', e.target.value)} required minLength={8} /></div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {[['patient', 'Patient / Family'], ['nurse', 'Healthcare Pro']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => update('role', v)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.role === v ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Creating Account...' : <><ArrowRight className="w-4 h-4" />Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-3">
            By registering, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
