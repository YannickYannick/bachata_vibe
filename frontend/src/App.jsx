import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CoursesPage from './components/CoursesPage';
import CourseDetailPage from './components/CourseDetailPage';
import FestivalsPage from './components/FestivalsPage';
import FestivalDetailPage from './components/FestivalDetailPage';
import MyFestivalsPage from './components/MyFestivalsPage';
import EventsPage from './components/EventsPage';
import EventDetailPage from './components/EventDetailPage';
import MyEventsPage from './components/MyEventsPage';
import TrainingsPage from './components/TrainingsPage';
import CompetitionsPage from './components/CompetitionsPage';
import ArtistsPage from './components/ArtistsPage';
import TheoryPage from './components/TheoryPage';
import CarePage from './components/CarePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import MyCoursesPage from './components/MyCoursesPage';
import TestAuth from './components/TestAuth';
import FestivalAdminForm from './components/admin/FestivalAdminForm';
import EventAdminForm from './components/admin/EventAdminForm';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="pt-16 lg:pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/test-auth" element={<TestAuth />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/festivals" element={<FestivalsPage />} />
              <Route path="/festivals/:id" element={<FestivalDetailPage />} />
              <Route path="/my-festivals" element={<MyFestivalsPage />} />
              {/* Routes d'administration */}
              <Route path="/admin/festivals/add" element={<FestivalAdminForm />} />
              <Route path="/admin/festivals/edit/:id" element={<FestivalAdminForm />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/my-events" element={<MyEventsPage />} />
              {/* Routes d'administration pour les événements */}
              <Route path="/admin/events/add" element={<EventAdminForm />} />
              <Route path="/admin/events/edit/:id" element={<EventAdminForm />} />
              <Route path="/trainings" element={<TrainingsPage />} />
              <Route path="/competitions" element={<CompetitionsPage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/theory" element={<TheoryPage />} />
              <Route path="/care" element={<CarePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
          
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
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


