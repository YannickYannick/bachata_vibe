import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import FestivalsPage from './pages/FestivalsPage';
import TrainingsPage from './pages/TrainingsPage';
import CarePage from './pages/CarePage';
import CompetitionsPage from './pages/CompetitionsPage';
import ArtistsPage from './pages/ArtistsPage';
import PractitionersPage from './pages/PractitionersPage';
import TheoryPage from './pages/TheoryPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Styles
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <HomePage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/courses" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CoursesPage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/festivals" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FestivalsPage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/trainings" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TrainingsPage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/care" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CarePage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/competitions" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CompetitionsPage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/artists" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArtistsPage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/practitioners" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PractitionersPage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/theory" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TheoryPage />
                      </motion.div>
                    } 
                  />
                  
                  {/* Auth Routes */}
                  <Route 
                    path="/login" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <LoginPage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/register" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RegisterPage />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProfilePage />
                      </motion.div>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </main>
            
            <Footer />
          </div>
        </Router>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;




