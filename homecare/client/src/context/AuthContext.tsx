import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1', withCredentials: true });

interface User { _id: string; firstName: string; lastName: string; email: string; role: string; avatar?: string; }
interface AuthContextType {
  user: User | null; token: string | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('hc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me').then(r => setUser(r.data.data)).catch(() => { setToken(null); localStorage.removeItem('hc_token'); }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const t = data.data.accessToken;
    localStorage.setItem('hc_token', t);
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t); setUser(data.data.user);
  };

  const register = async (formData: any) => {
    const { data } = await api.post('/auth/register', formData);
    const t = data.data.accessToken;
    localStorage.setItem('hc_token', t);
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t); setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('hc_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null); setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { api };
