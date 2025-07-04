
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider initializing...');
    
    // Initialize default admin users with correct credentials
    const defaultUsers: User[] = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com', // Match the demo credentials
        role: 'admin',
        status: 'active'
      },
      {
        id: '2',
        name: 'Test User',
        email: 'user@example.com', // Match the demo credentials
        role: 'user',
        status: 'active'
      }
    ];
    
    // Always reset to ensure correct credentials
    localStorage.setItem('adminUsers', JSON.stringify(defaultUsers));
    console.log('Demo users created with correct credentials:', defaultUsers);

    // Check if user is logged in on mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Restored user from localStorage:', user);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    setIsLoading(false);
    console.log('AuthProvider initialization complete');
  }, []);

  const login = (email: string, password: string): boolean => {
    console.log('Login attempt:', { email, password });
    
    try {
      // Get users from localStorage
      const usersData = localStorage.getItem('adminUsers');
      if (!usersData) {
        console.error('No users data found in localStorage');
        return false;
      }
      
      const users = JSON.parse(usersData);
      console.log('Available users:', users);
      
      // Find user by email
      const user = users.find((u: User) => u.email === email && u.status === 'active');
      console.log('Found user:', user);
      
      if (user && (password === 'admin123' || password === 'user123')) {
        console.log('Login successful for user:', user);
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      
      console.log('Login failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out user:', currentUser);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = (): boolean => {
    const result = currentUser?.role === 'admin';
    console.log('isAdmin check:', result, 'for user:', currentUser);
    return result;
  };

  const isAuthenticated = (): boolean => {
    const result = currentUser !== null && currentUser.status === 'active';
    console.log('isAuthenticated check:', result, 'for user:', currentUser);
    return result;
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    isLoading,
  };

  console.log('AuthProvider rendering with value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
