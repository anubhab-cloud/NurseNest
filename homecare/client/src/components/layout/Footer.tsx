import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pb-20 lg:pb-0">
      {/* Top CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white font-display">Get Professional Care at Home Today</h3>
            <p className="text-primary-100 mt-1">Book in minutes. Available 24/7. No hidden charges.</p>
          </div>
          <Link to="/booking" className="bg-white text-primary-600 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all shadow-lg whitespace-nowrap">
            Book Free Consultation
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">HomeCare<span className="text-primary-400">+</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India's most trusted home healthcare platform. Connecting patients with certified caregivers since 2020.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-gray-400"><Phone className="w-4 h-4 text-primary-400" /><span>1800-000-0000 (Toll Free)</span></div>
              <div className="flex items-center gap-2 text-gray-400"><Mail className="w-4 h-4 text-primary-400" /><span>care@homecareplus.in</span></div>
              <div className="flex items-center gap-2 text-gray-400"><MapPin className="w-4 h-4 text-primary-400" /><span>Bengaluru, Karnataka, India</span></div>
            </div>
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Services', links: ['Elder Care', 'Nursing Care', 'Physiotherapy', 'Doctor Consultation', 'Post-Surgery Care', 'Mother & Baby Care'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press', 'Partners', 'Affiliates'] },
            { title: 'Support', links: ['Help Center', 'Book Service', 'Track Booking', 'Pricing', 'Contact Us', 'Emergency'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay Updated</h4>
              <p className="text-gray-400 text-sm">Get health tips and exclusive offers in your inbox.</p>
            </div>
            {subscribed ? (
              <div className="text-teal-400 font-medium text-sm">✓ You're subscribed! Thank you.</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required
                  className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-primary-500 w-64" />
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} HomeCare+ Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map(l => (
              <a key={l} href="#" className="hover:text-gray-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
