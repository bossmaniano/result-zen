import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'administrator' | 'head_teacher' | 'class_teacher' | 'subject_teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (usernameOrEmail: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('eduSystem_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for stored accounts with generated credentials
      const storedAccounts = JSON.parse(localStorage.getItem('eduSystem_accounts') || '[]');
      
      // Try to find account by username or email
      const account = storedAccounts.find((acc: any) => 
        (acc.username === usernameOrEmail || acc.email === usernameOrEmail) && 
        acc.password === password && 
        acc.role === role
      );
      
      if (account) {
        // Login with stored account
        const user: User = {
          id: account.id,
          name: account.name,
          email: account.email || `${account.username}@${account.schoolId || 'system'}.edu`,
          role: account.role,
          schoolId: account.schoolId
        };
        
        setUser(user);
        localStorage.setItem('eduSystem_user', JSON.stringify(user));
        setIsLoading(false);
        return true;
      }
      
      // Fallback to mock authentication for demo purposes
      // This allows existing functionality to work while new accounts use generated credentials
      const mockUser: User = {
        id: `${role}_${Date.now()}`,
        name: role === 'administrator' ? 'System Administrator' : 
              role === 'head_teacher' ? 'Head Teacher' :
              role === 'class_teacher' ? 'Class Teacher' :
              role === 'subject_teacher' ? 'Subject Teacher' : 'Student Name',
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@demo.edu`,
        role,
        schoolId: role !== 'administrator' ? 'school_1' : undefined
      };

      setUser(mockUser);
      localStorage.setItem('eduSystem_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eduSystem_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};