import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Bell, 
  Heart,
  Calendar,
  Users,
  BookOpen,
  Trophy,
  Heart as HeartIcon,
  Settings,
  LogOut
} from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simuler un utilisateur connecté
    // En production, cela viendrait du contexte d'authentification
    setUser({
      id: 1,
      name: 'Marie Dupont',
      email: 'marie@example.com',
      userType: 'participant',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    });
  }, []);

  const navigationItems = [
    { name: 'Accueil', href: '/', icon: null },
    { name: 'Cours', href: '/courses', icon: BookOpen },
    { name: 'Festivals', href: '/festivals', icon: Calendar },
    { name: 'Trainings', href: '/trainings', icon: Users },
    { name: 'Compétitions', href: '/competitions', icon: Trophy },
    { name: 'Artistes', href: '/artists', icon: HeartIcon },
    { name: 'Théorie', href: '/theory', icon: BookOpen },
    { name: 'Soins', href: '/care', icon: Heart },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              BachataSite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-purple-600 bg-purple-50'
                    : isScrolled
                    ? 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              isScrolled 
                ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}>
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              isScrolled 
                ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}>
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                  />
                  <span className={`hidden md:block text-sm font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}>
                    {user.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-purple-600 font-medium capitalize">
                          {user.userType}
                        </p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Mon profil</span>
                        </Link>
                        
                        <Link
                          to="/my-courses"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Mes cours</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Paramètres</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 py-2">
                        <button className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                          <LogOut className="w-4 h-4" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-purple-600'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-200"
            >
              {isOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
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
              
              {!user && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 text-center text-gray-700 font-medium hover:text-purple-600 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-3 text-center bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;




