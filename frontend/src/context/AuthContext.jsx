import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

// Create the actual Context object — think of it as a "channel"
// that components can tune into to get auth data
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first app load, check if there's already a saved token from a previous session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }

  async function register(name, email, password, role) {
    const response = await axiosInstance.post('/auth/register', { name, email, password, role });
    return response.data;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isManager: user?.role === 'manager',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// A custom hook so other components can easily access this context
export function useAuth() {
  return useContext(AuthContext);
}