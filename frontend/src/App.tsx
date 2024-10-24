import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Auth from './pages/Login';
import { Skeleton } from './components/Skeleton';
import Home from './pages/Home';
import { UserProvider } from '@/hooks/useUser';
import Course from './pages/Course';
import AdminCourseCard from './pages/AdminHome';
import CoursePage from './pages/CourseDetail';
import AdminCourseDetail from './pages/AdminCourseDetail';
import AdminFolderDetail from './pages/AdminFolderDetail';
import LearningDashboard from './pages/Profile';
import { RecoilRoot } from 'recoil';
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/toast"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: 'USER' | 'TUTOR' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('Users')
          .select('role')
          .eq('supabaseId', user.id)
          .single();

        if (!error && data) {
          setUserRole(data.role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (!isAuthenticated || (role === 'TUTOR' && userRole !== 'TUTOR') || (role === 'USER' && userRole !== 'USER')) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the correct role, render the protected route
  return <>{children}</>;
};

const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('Users')
          .select('role')
          .eq('supabaseId', user.id)
          .single();

        if (!error && data) {
          setUserRole(data.role);
          setIsAuthenticated(true);

          // Redirect based on role
          if (data.role === 'TUTOR') {
            navigate('/admin/home', { replace: true });
          } else if (data.role === 'USER') {
            navigate('/home', { replace: true });
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [navigate, userRole]);

  return isAuthenticated === null ? (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  ) : (
    <Auth />
  );
};

export default function App() {
  return (


    <ToastProvider>
      <UserProvider>
        <RecoilRoot>
          <Router>
            <Routes>
              {/* Public route */}
              <Route path="/" element={<AuthWrapper />} />

              {/* Protected routes for USER */}
              <Route element={<ProtectedRoute role="USER"><Outlet /></ProtectedRoute>}>
                <Route path="/home" element={<Home />} />
                <Route path="/course/:courseName/:courseId" element={<Course />} />
                <Route path="/profile" element={<LearningDashboard />} />
                <Route path="/course/:courseId/detail" element={<CoursePage />} />
              </Route>

              {/* Protected routes for TUTOR */}
              <Route element={<ProtectedRoute role="TUTOR"><Outlet /></ProtectedRoute>}>
                <Route path="/admin/home" element={<AdminCourseCard />} />
                <Route path="/admin/course/:courseName/:courseId" element={<AdminCourseDetail />} />
                <Route path="/admin/course/:courseId/folder/:folderId" element={<AdminFolderDetail />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster/>
          </Router>
        </RecoilRoot>
      </UserProvider>
    </ToastProvider>
  
  );
}
