import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Booking from './pages/Booking';
import PatientDashboard from './pages/dashboard/PatientDashboard';

// Loading spinner
function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public layout (with Navbar + Footer)
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  useSmoothScroll();
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />

      {/* Auth pages (no navbar/footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Booking (with navbar) */}
      <Route path="/booking" element={<><Navbar /><Booking /></>} />

      {/* Protected dashboards */}
      <Route path="/dashboard/patient" element={<Protected><PatientDashboard /></Protected>} />
      <Route path="/dashboard/patient/*" element={<Protected><PatientDashboard /></Protected>} />

      {/* Fallback */}
      <Route path="*" element={
        <PublicLayout>
          <div className="min-h-screen flex flex-col items-center justify-center gradient-bg">
            <div className="text-8xl mb-6">🏥</div>
            <h1 className="text-4xl font-bold font-display text-gray-900 mb-3">Page Not Found</h1>
            <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary px-8 py-3">Go Home</a>
          </div>
        </PublicLayout>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
