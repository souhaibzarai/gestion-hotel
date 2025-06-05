
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'receptionist';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('hotelmanager_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This would be an API call in a real application
      // For now, let's simulate a successful login with mock data
      if (email === 'admin@hotel.com' && password === 'admin') {
        const mockUser = {
          id: 1,
          name: 'Admin User',
          email: 'admin@hotel.com',
          role: 'admin' as const
        };
        setUser(mockUser);
        localStorage.setItem('hotelmanager_user', JSON.stringify(mockUser));
        toast.success('Connexion réussie!');
        navigate('/dashboard');
      } else if (email === 'receptionist@hotel.com' && password === 'reception') {
        const mockUser = {
          id: 2,
          name: 'Receptionist User',
          email: 'receptionist@hotel.com',
          role: 'receptionist' as const
        };
        setUser(mockUser);
        localStorage.setItem('hotelmanager_user', JSON.stringify(mockUser));
        toast.success('Connexion réussie!');
        navigate('/dashboard');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Une erreur est survenue durant la connexion');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hotelmanager_user');
    toast.info('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
