import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Bell, FileText, User, MessageSquare, Plus, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../context/AuthContext';

const navItems = [
  { icon: Activity, label: 'Overview', key: 'overview' },
  { icon: Calendar, label: 'My Bookings', key: 'bookings' },
  { icon: Heart, label: 'Health Records', key: 'health' },
  { icon: Bell, label: 'Notifications', key: 'notifications' },
  { icon: FileText, label: 'Invoices', key: 'invoices' },
  { icon: User, label: 'Profile', key: 'profile' },
  { icon: MessageSquare, label: 'Chat Support', key: 'chat' },
];

const mockBookings = [
  { id: 1, service: 'Elder Care', caregiver: 'Dr. Priya Nair', date: '2026-06-20', time: '9:00 AM', status: 'confirmed', amount: '₹499' },
  { id: 2, service: 'Physiotherapy', caregiver: 'Mr. Rajan Pillai', date: '2026-06-22', time: '11:00 AM', status: 'pending', amount: '₹799' },
  { id: 3, service: 'Nursing Care', caregiver: 'Ms. Anita Sharma', date: '2026-06-15', time: '10:00 AM', status: 'completed', amount: '₹699' },
];

const statusStyle: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm fixed h-full z-20 hidden lg:flex">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold font-display text-gray-900">HomeCare<span className="text-primary-600">+</span></span>
          </Link>
        </div>

        <div className="p-4 flex-1">
          <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <p className="font-bold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => (
              <button key={item.key} onClick={() => setActive(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active === item.key ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <item.icon className="w-4 h-4" />{item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        {active === 'overview' && (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold font-display text-gray-900">Good morning, {user?.firstName}! 👋</h1>
                <p className="text-gray-500 text-sm mt-1">Here's an overview of your health journey.</p>
              </div>
              <Link to="/booking" className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
                <Plus className="w-4 h-4" /> Book Service
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Bookings', value: '12', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
                { label: 'Active Plan', value: 'Standard', icon: Heart, color: 'bg-red-100 text-red-600' },
                { label: 'Next Visit', value: 'Jun 20', icon: Clock, color: 'bg-green-100 text-green-600' },
                { label: 'Loyalty Points', value: '450 pts', icon: Activity, color: 'bg-purple-100 text-purple-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold font-display text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Recent Bookings */}
            <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 font-display">Recent Bookings</h2>
                <button onClick={() => setActive('bookings')} className="text-primary-600 text-sm font-medium hover:underline">View All</button>
              </div>
              <div className="divide-y divide-gray-50">
                {mockBookings.map(b => (
                  <div key={b.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{b.service}</p>
                        <p className="text-xs text-gray-500">{b.caregiver} • {b.date} {b.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">{b.amount}</span>
                      <span className={`badge ${statusStyle[b.status]} capitalize text-xs`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {active === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold font-display text-gray-900">My Bookings</h1>
              <Link to="/booking" className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
                <Plus className="w-4 h-4" /> New Booking
              </Link>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {mockBookings.map(b => (
                  <div key={b.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{b.service}</p>
                        <p className="text-sm text-gray-500">With {b.caregiver}</p>
                        <p className="text-xs text-gray-400 mt-0.5">📅 {b.date} at {b.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-900">{b.amount}</span>
                      <span className={`badge ${statusStyle[b.status]} capitalize px-3 py-1`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {active === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-bold font-display text-gray-900 mb-6">Notifications</h1>
            <div className="space-y-3">
              {[
                { icon: CheckCircle, color: 'text-green-500 bg-green-50', title: 'Booking Confirmed', msg: 'Your Elder Care booking for Jun 20 is confirmed.', time: '2 hours ago' },
                { icon: Bell, color: 'text-blue-500 bg-blue-50', title: 'Visit Reminder', msg: 'Dr. Priya will visit tomorrow at 9:00 AM.', time: '1 day ago' },
                { icon: AlertCircle, color: 'text-yellow-500 bg-yellow-50', title: 'Payment Due', msg: 'Invoice #HC10234 is due for payment.', time: '3 days ago' },
              ].map((n, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${n.color} flex items-center justify-center flex-shrink-0`}>
                    <n.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{n.msg}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!['overview', 'bookings', 'notifications'].includes(active) && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-bold text-gray-700 font-display">Coming Soon</h2>
            <p className="text-gray-400 text-sm mt-2">This feature is under development.</p>
          </div>
        )}
      </main>
    </div>
  );
}
