import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UserContextType {
  user: User | null;
  accessToken: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // Declare accessToken state

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession(); // Fetch session
      if (error) console.error("Error fetching session:", error);
      console.log("Fetched session: ", session);
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Only run on mount

  // Log when user or accessToken changes
  // useEffect(() => {
  //   console.log("Updated user: ", user);
  //   console.log("Updated access token: ", accessToken);
  // }, [user, accessToken]); // Watch for user and accessToken changes

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null); // Clear access token on logout
  };

  return (
    <UserContext.Provider value={{ user, accessToken, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
