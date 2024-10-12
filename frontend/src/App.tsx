import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet,useNavigate  } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Auth from './pages/Login';
import { Skeleton } from './components/Skeleton';
import Home from './pages/Home';
import { UserProvider } from '@/hooks/useUser';
import Course from './pages/Course';




const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>
      <Skeleton/>
      <Skeleton/>
      <Skeleton/>
      <Skeleton/>
      <Skeleton/>      
    </div>;
  }

  if (!isAuthenticated) {
  
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected route
  return <>{children}</>;
};

const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user) {
        navigate('/home', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  // if (isAuthenticated === null) {
  //   // Still checking authentication status
  //   // return <div>
  //   //   <Skeleton/>
  //   //   <Skeleton/>
  //   //   <Skeleton/>
  //   //   <Skeleton/>
  //   //   <Skeleton/> 
  //   // </div>;
  // }

  return isAuthenticated === null ? 
  <>
      <Skeleton/>
      <Skeleton/>
      <Skeleton/>
      <Skeleton/>
      <Skeleton/>  
  
  </>
  : <Auth />;
};

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<AuthWrapper />} />


          {/* Protected routes */}
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route path="/home" element={<Home />} />
            <Route path="/course" element={<Course />} />

          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}