
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Map Supabase user to App User
  const mapSupabaseUser = (sbUser: any): User => {
    const metadata = sbUser.user_metadata || {};
    return {
      id: sbUser.id,
      email: sbUser.email || '',
      name: metadata.full_name || metadata.name || sbUser.email?.split('@')[0] || 'User',
      avatar: metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(metadata.full_name || 'User')}&background=purple&color=fff`,
      bio: metadata.bio,
      location: metadata.location,
      phone: sbUser.phone,
      banner: metadata.banner,
      socialLinks: metadata.socialLinks,
      kycStatus: metadata.kycStatus || 'unverified'
    };
  };

  useEffect(() => {
    const initAuth = async () => {
      // MOCK FALLBACK: If Supabase isn't configured, check localStorage
      if (!isSupabaseConfigured) {
        try {
          const stored = localStorage.getItem('wetube_user');
          if (stored) {
            setUser(JSON.parse(stored));
          }
        } catch (e) {
          console.error("Failed to parse local user", e);
        }
        setIsLoading(false);
        return;
      }

      // SUPABASE LOGIC
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Only set up listener if configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // --- Security Features ---
  const checkLockout = () => {
    if (isLockedOut) {
      throw new Error("Account temporarily locked due to too many failed attempts. Please try again later.");
    }
  };

  const handleFailedAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    if (newAttempts >= 5) {
      setIsLockedOut(true);
      setTimeout(() => {
        setIsLockedOut(false);
        setLoginAttempts(0);
      }, 5 * 60 * 1000); // 5 minute lockout
    }
  };

  // --- Auth Methods ---

  const login = async (email: string, password: string, rememberMe: boolean) => {
    checkLockout();
    
    // MOCK FALLBACK
    if (!isSupabaseConfigured) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'mock-user-id',
        email: email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=purple&color=fff`,
        kycStatus: 'verified'
      };
      
      setUser(mockUser);
      if (rememberMe) {
        localStorage.setItem('wetube_user', JSON.stringify(mockUser));
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      handleFailedAttempt();
      throw error;
    }

    setLoginAttempts(0);
  };

  const loginWithPhone = async (phone: string) => {
    checkLockout();
    
    // MOCK FALLBACK
    if (!isSupabaseConfigured) {
       await new Promise(resolve => setTimeout(resolve, 800));
       return { error: null }; // Simulate success sending OTP
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: phone
    });
    return { error };
  };

  const verifyOtp = async (phone: string, token: string) => {
    checkLockout();
    
    // MOCK FALLBACK
    if (!isSupabaseConfigured) {
       await new Promise(resolve => setTimeout(resolve, 800));
       if (token === '123456') {
         const mockUser: User = {
            id: 'phone-user-id',
            email: '',
            name: 'Phone User',
            phone: phone,
            avatar: `https://ui-avatars.com/api/?name=Phone+User&background=purple&color=fff`,
            kycStatus: 'unverified'
         };
         setUser(mockUser);
         return { error: null };
       } else {
         return { error: { message: 'Invalid OTP (Try 123456)' } };
       }
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });
    
    if (error) {
      handleFailedAttempt();
    } else {
      setLoginAttempts(0);
    }
    return { error };
  };

  const loginWithProvider = async (provider: 'google' | 'github' | 'discord') => {
    checkLockout();
    
    if (!isSupabaseConfigured) {
       // Mock OAuth
       await new Promise(resolve => setTimeout(resolve, 1000));
       const mockUser: User = {
         id: `${provider}-user`,
         email: `user@${provider}.com`,
         name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
         avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=random&color=fff`,
         kycStatus: 'verified'
       };
       setUser(mockUser);
       localStorage.setItem('wetube_user', JSON.stringify(mockUser));
       return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const register = async (email: string, password: string, name: string) => {
    // MOCK FALLBACK
    if (!isSupabaseConfigured) {
       await new Promise(resolve => setTimeout(resolve, 1000));
       const mockUser: User = {
        id: 'new-user-id',
        email: email,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=purple&color=fff`,
        kycStatus: 'unverified'
      };
      // Auto login after register for mock
      setUser(mockUser);
      localStorage.setItem('wetube_user', JSON.stringify(mockUser));
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) throw error;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('wetube_user');
  };

  // --- Profile Management ---

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('wetube_user', JSON.stringify(updatedUser));
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.name,
        bio: data.bio,
        location: data.location,
        banner: data.banner,
        socialLinks: data.socialLinks
      }
    });

    if (error) throw error;
  };

  const submitKYC = async (document: File) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await updateProfile({ kycStatus: 'pending' });
  };

  const deleteAccount = async () => {
    if (!user) return;
    await logout();
    alert("Account deletion request submitted.");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      loginAttempts,
      isLockedOut,
      login, 
      loginWithPhone,
      verifyOtp,
      loginWithProvider,
      register, 
      logout,
      updateProfile,
      submitKYC,
      deleteAccount
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

export const useUser = () => {
  const { user } = useAuth();
  return user;
};
