import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, FinanceMode } from '../types';

interface RegisterData {
  name: string;
  email: string;
  pin?: string;
  mode?: FinanceMode;
  avatarColor?: string;
  avatarEmoji?: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  isAuthenticated: boolean;
  register: (data: RegisterData) => { success: boolean; message?: string };
  login: (emailOrName: string, pin?: string) => { success: boolean; message?: string };
  quickGuestLogin: (name?: string, mode?: FinanceMode) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updated: Partial<UserAccount>) => void;
  deleteAccount: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AVATAR_COLORS = [
  '#10b981', // emerald
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#14b8a6', // teal
  '#f97316', // orange
];

const AVATAR_EMOJIS = ['🚀', '💼', '⭐', '🦁', '🦊', '⚡', '💎', '🎯'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('gasti_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('gasti_currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gasti_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('gasti_currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('gasti_currentUser');
      }
    } catch (e) {
      console.error('Failed to save currentUser', e);
    }
  }, [currentUser]);

  const register = ({
    name,
    email,
    pin,
    mode = 'personal',
    avatarColor,
    avatarEmoji,
  }: RegisterData) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      return { success: false, message: 'Por favor ingresa tu nombre o apodo' };
    }

    // Check if email already exists
    const existing = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && cleanEmail !== ''
    );
    if (existing) {
      // Auto login if already exists
      const updatedUser = { ...existing, lastLoginAt: Date.now() };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === existing.id ? updatedUser : u)));
      return { success: true, message: `¡Bienvenido de nuevo, ${cleanName}!` };
    }

    const randomColor =
      avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const randomEmoji =
      avatarEmoji || AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];

    const newUser: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail || `${cleanName.toLowerCase().replace(/\s+/g, '')}@gasti.app`,
      pin: pin?.trim() || undefined,
      avatarColor: randomColor,
      avatarEmoji: randomEmoji,
      preferredMode: mode,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Also store finance mode preference
    localStorage.setItem('gasti_finance_mode', mode);

    return { success: true, message: `¡Cuenta creada con éxito! Bienvenido, ${cleanName}.` };
  };

  const login = (emailOrName: string, pin?: string) => {
    const term = emailOrName.trim().toLowerCase();
    if (!term) {
      return { success: false, message: 'Ingresa tu nombre o correo electrónico' };
    }

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === term ||
        u.name.toLowerCase() === term ||
        u.name.toLowerCase().includes(term)
    );

    if (!found) {
      return { success: false, message: 'Usuario no encontrado. Puedes registrarte fácilmente.' };
    }

    if (found.pin && pin && found.pin !== pin.trim()) {
      return { success: false, message: 'PIN incorrecto. Intenta de nuevo.' };
    }

    const updatedUser = { ...found, lastLoginAt: Date.now() };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === found.id ? updatedUser : u)));
    localStorage.setItem('gasti_finance_mode', found.preferredMode);

    return { success: true, message: `¡Hola de nuevo, ${found.name}!` };
  };

  const quickGuestLogin = (name = 'Usuario Invitado', mode: FinanceMode = 'personal') => {
    const guestUser: UserAccount = {
      id: `guest_${Date.now()}`,
      name,
      email: 'demo@gasti.app',
      avatarColor: '#10b981',
      avatarEmoji: '⚡',
      preferredMode: mode,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };

    setUsers((prev) => [guestUser, ...prev]);
    setCurrentUser(guestUser);
    localStorage.setItem('gasti_finance_mode', mode);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gasti_currentUser');
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      const updated = { ...found, lastLoginAt: Date.now() };
      setCurrentUser(updated);
      setUsers((prev) => prev.map((u) => (u.id === found.id ? updated : u)));
      localStorage.setItem('gasti_finance_mode', found.preferredMode);
    }
  };

  const updateProfile = (updated: Partial<UserAccount>) => {
    if (!currentUser) return;
    const nextUser = { ...currentUser, ...updated };
    setCurrentUser(nextUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? nextUser : u)));
  };

  const deleteAccount = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
      localStorage.removeItem('gasti_currentUser');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated: !!currentUser,
        register,
        login,
        quickGuestLogin,
        logout,
        switchUser,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
