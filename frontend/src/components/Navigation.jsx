import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar,
  Users,
  Trophy,
  HeartIcon, 
  Heart, 
  Search, 
  Bell, 
  ChevronDown,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { name: 'Cours', href: '/courses', current: location.pathname.startsWith('/courses') },
    { name: 'Festivals', href: '/festivals', current: location.pathname.startsWith('/festivals') },
    { name: 'Événements', href: '/events', current: location.pathname.startsWith('/events') },
    { name: 'Formations', href: '/formations', current: location.pathname.startsWith('/formations') },
    { name: 'Trainings', href: '/trainings', current: location.pathname.startsWith('/trainings') },
    { name: 'Compétitions', href: '/competitions', current: location.pathname.startsWith('/competitions') },
    { name: 'Artistes', href: '/artists', current: location.pathname.startsWith('/artists') },
  ];

  const isActive = (href) => {
    return location.pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
    }>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 text-gray-900`}>
              BachataSite
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4 inline mr-2" />}
                {item.name}
              </Link>
            ))}
            
            {/* Lien d'administration pour les admins */}
            {user?.user_type === 'admin' && (
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:text-red-800 hover:bg-red-50 transition-colors flex items-center"
              >
                <span className="mr-2">👑</span>
                Admin
              </a>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className={`p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50`}>
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className={`p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50`}>
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={user.first_name || user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {user.first_name?.[0] || user.username?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <span className={`hidden md:block text-sm font-medium transition-colors duration-300 text-gray-700`}>
                    {user.first_name || user.username}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-purple-600">{user.user_type_display || user.user_type}</p>
                      </div>
                      
                        <Link
                          to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                        <User className="w-4 h-4 mr-3" />
                        Mon profil
                        </Link>
                        
                        <Link
                          to="/my-courses"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                        <BookOpen className="w-4 h-4 mr-3" />
                        Mes cours
                        </Link>
                        
                        <Link
                          to="/my-events"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                        <Calendar className="w-4 h-4 mr-3" />
                        Mes événements
                        </Link>
                        
                        <Link
                          to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                        <Settings className="w-4 h-4 mr-3" />
                        Paramètres
                        </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Se déconnecter
                        </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
              </svg>
            </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4"
          >
              <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.name}</span>
                </Link>
              ))}
              
                {isAuthenticated && user && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="px-3 py-2 mb-2">
                        <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                  <Link
                        to="/profile"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                    onClick={closeMobileMenu}
                  >
                        Mon profil
                  </Link>
                      
                  <Link
                        to="/my-courses"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                    onClick={closeMobileMenu}
                  >
                        Mes cours
                  </Link>
                      
                  <Link
                        to="/my-events"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                    onClick={closeMobileMenu}
                  >
                        Mes événements
                  </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800"
                      >
                        Se déconnecter
                      </button>
                </div>
                  </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;








