import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Phone, User, LogOut, LayoutDashboard,
  Home, Briefcase, Info, BookOpen, Mail, Tag, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { scrollTo } from '../../hooks/useSmoothScroll';
import NurseNestLogo from '../brand/NurseNestLogo';

const navLinks = [
  { label: 'Home',     href: '/',        icon: Home },
  { label: 'Services', href: '/services', icon: Briefcase },
  { label: 'Pricing',  href: '/pricing',  icon: Tag },
  { label: 'About',    href: '/about',    icon: Info },
  { label: 'Blog',     href: '/blog',     icon: BookOpen },
  { label: 'Contact',  href: '/contact',  icon: Mail },
];

// Bottom tab bar links (mobile only — most important pages)
const bottomTabs = [
  { label: 'Home',    href: '/',        icon: Home },
  { label: 'Services',href: '/services', icon: Briefcase },
  { label: 'Book',    href: '/booking', icon: Calendar, primary: true },
  { label: 'Blog',    href: '/blog',    icon: BookOpen },
  { label: 'Account', href: '/login',   icon: User },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [userMenu, setUserMenu]     = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const menuRef   = useRef<HTMLDivElement>(null);

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* close drawer on route change */
  useEffect(() => { setDrawerOpen(false); setUserMenu(false); }, [location.pathname]);

  /* close user menu on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleLogout = () => { logout(); navigate('/'); };
  const dashPath = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'nurse' ? '/dashboard/nurse' : '/dashboard/patient';
  const isActive = (href: string) => href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      {/* ─── Top Navbar ─────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100'
            : 'bg-transparent'}`}
      >
        {/* Safe area top padding for notched phones */}
        <div style={{ paddingTop: 'env(safe-area-inset-top)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="shrink-0 flex items-center" style={{ minHeight: 'unset', minWidth: 'unset' }}>
              <NurseNestLogo size={36} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(l => (
                <Link
                  key={l.href} to={l.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(l.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right: phone + auth */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="tel:+18000000000"
                 className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                 style={{ minHeight: 'unset', minWidth: 'unset' }}>
                <Phone className="w-4 h-4" />
                <span className="font-medium">1800-000-000</span>
              </a>

              {isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenu(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
                    style={{ minHeight: 'unset', minWidth: 'unset' }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-teal-500
                                    flex items-center justify-center text-white text-xs font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.firstName}</span>
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <p className="font-semibold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role}</p>
                        </div>
                        <div className="p-2">
                          {[
                            { icon: LayoutDashboard, label: 'Dashboard', href: dashPath },
                            { icon: User, label: 'Profile', href: '/profile' },
                          ].map(item => (
                            <Link key={item.href} to={item.href} onClick={() => setUserMenu(false)}
                              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700
                                         hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                              style={{ minHeight: 'unset', minWidth: 'unset' }}>
                              <item.icon className="w-4 h-4" /> {item.label}
                            </Link>
                          ))}
                          <button onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500
                                       hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login"
                    className="text-sm font-medium text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
                    style={{ minHeight: 'unset', minWidth: 'unset' }}>
                    Sign In
                  </Link>
                  <Link to="/booking"
                    className="btn-primary text-sm py-2.5 px-5"
                    style={{ minHeight: 'unset', minWidth: 'unset' }}>
                    Book Free Consult
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawerOpen(v => !v)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100
                         active:bg-gray-200 transition-colors"
              aria-label="Open menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {drawerOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-6 h-6 text-gray-700" />
                    </motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-6 h-6 text-gray-700" />
                    </motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ─── Mobile Drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden
                         flex flex-col shadow-2xl overflow-y-auto"
              style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center" style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <NurseNestLogo size={32} />
                </Link>
                <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* User card in drawer */}
              {isAuthenticated && (
                <div className="mx-4 mt-4 bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full
                                    flex items-center justify-center text-white font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4">
                <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Navigation</p>
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    <Link to={l.href} onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3.5 rounded-xl mb-1 text-sm font-medium transition-all
                        ${isActive(l.href)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'}`}
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      <l.icon className={`w-4 h-4 ${isActive(l.href) ? 'text-primary-600' : 'text-gray-400'}`} />
                      {l.label}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && (
                  <>
                    <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">Account</p>
                    <Link to={dashPath} onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl mb-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}>
                      <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
                    </Link>
                  </>
                )}
              </nav>

              {/* Bottom CTA */}
              <div className="px-4 pb-6 pt-3 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                               border-2 border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/booking" onClick={() => setDrawerOpen(false)}
                      className="btn-primary w-full py-3.5 text-sm"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}>
                      📅 Book Free Consultation
                    </Link>
                    <Link to="/login" onClick={() => setDrawerOpen(false)}
                      className="w-full flex items-center justify-center py-3 rounded-xl border-2 border-gray-200
                                 text-gray-700 text-sm font-semibold hover:border-primary-300 transition-colors"
                      style={{ minHeight: 'unset', minWidth: 'unset' }}>
                      Sign In
                    </Link>
                  </>
                )}
                <a href="tel:+18000000000"
                   className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500"
                   style={{ minHeight: 'unset', minWidth: 'unset' }}>
                  <Phone className="w-4 h-4" /> 1800-000-000 (Toll Free)
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Bottom Tab Bar (Mobile Only) ────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl
                   border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {bottomTabs.map(tab => {
            const active = isActive(tab.href);
            const authHref = tab.href === '/login' && isAuthenticated ? dashPath : tab.href;
            return tab.primary ? (
              <Link key={tab.href} to={tab.href}
                className="flex flex-col items-center -mt-5"
                style={{ minHeight: 'unset', minWidth: 'unset' }}>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-teal-500 rounded-2xl
                                flex items-center justify-center shadow-lg shadow-primary-200 mb-1">
                  <tab.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-primary-600">{tab.label}</span>
              </Link>
            ) : (
              <Link key={tab.href} to={authHref}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
                style={{ minHeight: 'unset', minWidth: 'unset' }}>
                <tab.icon className={`w-5 h-5 transition-colors ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-primary-600' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
                {active && <div className="w-1 h-1 rounded-full bg-primary-600 absolute -bottom-0.5" />}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
