
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, enableNetwork, disableNetwork, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, AuthContextType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const ADMIN_CREDENTIALS = {
  userId: '9899654695',
  password: '7838203264'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // In your login function, make sure the user data is properly mapped
  const login = async (userId: string, password: string) => {
    setIsLoading(true);
    try {
      if (userId === ADMIN_CREDENTIALS.userId && password === ADMIN_CREDENTIALS.password) {
        setIsAdmin(true);
        setUser(null);
        localStorage.setItem('isAdmin', 'true');
        toast({
          title: "Success",
          description: "Admin login successful",
        });
        return;
      }
  
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', userId)
        .single();
  
      if (error) throw error;
      if (!data) throw new Error('User not found');
      if (data.password !== password) throw new Error('Invalid password');
  
      // Map the database response to our User type
      const mappedUser = {
        id: data.id,
        userId: data.user_id,
        password: data.password,
        accountName: data.account_name,
        accountNumber: data.account_number,
        accountType: data.account_type,
        availableBalance: Number(data.available_balance),
        bankName: data.bank_name,
        withdrawAccountNumber: data.withdraw_account_number,
        withdrawalFee: Number(data.withdrawal_fee),
        initialDeposit: Number(data.initial_deposit)
      };
  
      console.log("Logged in user data:", mappedUser);
      setUser(mappedUser);
      setIsAdmin(false);
      localStorage.setItem('userId', data.user_id);
      
      toast({
        title: "Success",
        description: "Login successful",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || 'Login failed',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  useEffect(() => {
    const checkExistingSession = async () => {
      const storedUserId = localStorage.getItem('userId');
      const storedIsAdmin = localStorage.getItem('isAdmin');
      
      if (storedIsAdmin === 'true') {
        setIsAdmin(true);
        return;
      }
      
      if (storedUserId) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('users')
            .select()
            .eq('user_id', storedUserId)
            .single();

          if (error) throw error;
          if (data) setUser(data);
          else localStorage.removeItem('userId');
        } catch (error) {
          console.error('Session restoration error:', error);
          localStorage.removeItem('userId');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkExistingSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
