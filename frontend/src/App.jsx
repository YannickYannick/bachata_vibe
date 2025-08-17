import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CoursesPage from './components/CoursesPage';
import FestivalsPage from './components/FestivalsPage';
import TrainingsPage from './components/TrainingsPage';
import CompetitionsPage from './components/CompetitionsPage';
import ArtistsPage from './components/ArtistsPage';
import TheoryPage from './components/TheoryPage';
import CarePage from './components/CarePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="pt-16 lg:pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Autres routes à ajouter */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/festivals" element={<FestivalsPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
            <Route path="/competitions" element={<CompetitionsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/theory" element={<TheoryPage />} />
            <Route path="/care" element={<CarePage />} />
            <Route path="/login" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Page de connexion - En construction</h1></div>} />
            <Route path="/register" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Page d'inscription - En construction</h1></div>} />
            <Route path="/profile" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Page de profil - En construction</h1></div>} />
            <Route path="/my-courses" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Mes cours - En construction</h1></div>} />
            <Route path="/settings" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Paramètres - En construction</h1></div>} />
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
  );
}

export default App;


