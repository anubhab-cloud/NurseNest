import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('patient@homecare.app');
  const [password, setPassword] = useState('Password123!');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/dashboard/patient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Try demo: patient@homecare.app / Password123!');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-600 via-primary-700 to-teal-700 p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.5 }}
              className="absolute rounded-full bg-white/5"
              style={{ width: `${80 + i * 40}px`, height: `${80 + i * 40}px`, top: `${10 + i * 15}%`, left: `${5 + i * 12}%` }} />
          ))}
        </div>
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold font-display text-white">HomeCare<span className="text-teal-300">+</span></span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold font-display text-white mb-4 leading-tight">
            Professional Care,<br />Delivered with<br /><span className="text-teal-300">Compassion</span>
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed mb-8">
            Join 10,000+ families who trust HomeCare+ for their healthcare needs.
          </p>
          <div className="space-y-4">
            {['10,000+ Happy Patients', '500+ Verified Caregivers', '24/7 Support & Care', '4.9/5 Average Rating'].map(t => (
              <div key={t} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 bg-teal-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-300 text-xs">✓</span>
                </div>
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-200 text-xs relative z-10">
          🔒 Your data is encrypted and secure. HIPAA compliant.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-premium p-8 border border-gray-100">
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold font-display text-gray-900">HomeCare<span className="text-primary-600">+</span></span>
            </div>

            <h1 className="text-2xl font-bold font-display text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm mb-6">Sign in to access your healthcare dashboard</p>

            {/* Demo credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-700 text-xs font-semibold mb-2">🎯 Demo Credentials</p>
              <div className="space-y-1 text-xs text-blue-600">
                <p><strong>Patient:</strong> patient@homecare.app / Password123!</p>
                <p><strong>Admin:</strong> admin@homecare.app / Password123!</p>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input-field pr-12" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline font-medium">Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create Account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
