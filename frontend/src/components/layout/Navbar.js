import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">B</span>
              </div>
            <span className={`font-bold text-xl lg:text-2xl ${
              isScrolled ? 'text-gray-900' : 'text-gray-800'
            }`}>
              BachataSite
            </span>
            </Link>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/courses" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/courses') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Cours
            </Link>
            <Link 
              to="/festivals" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/festivals') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Festivals
            </Link>
            <Link 
              to="/artists" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/artists') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Artistes
            </Link>
            <Link 
              to="/trainings" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/trainings') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Entraînements
            </Link>
            <Link 
              to="/competitions" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/competitions') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Compétitions
            </Link>
            <Link 
              to="/theory" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/theory') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Théorie
            </Link>
                  <Link
              to="/care" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/care') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Soins
                  </Link>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center space-x-3">
                      <Link
                    to="/my-courses"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                      >
                    Mes cours
                      </Link>
                      <Link
                        to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      {user?.profile_picture ? (
                        <img 
                          src={user.profile_picture} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-white">
                          {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:block">{user?.first_name || user?.username}</span>
                      </Link>
                </div>
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

          {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
              </svg>
            </button>
        </div>
      </div>

      {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link 
                to="/courses" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/courses') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cours
              </Link>
              <Link 
                to="/festivals" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/festivals') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Festivals
              </Link>
              <Link 
                to="/artists" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/artists') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Artistes
              </Link>
              <Link 
                to="/trainings" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/trainings') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Entraînements
              </Link>
              <Link 
                to="/competitions" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/competitions') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Compétitions
              </Link>
              <Link 
                to="/theory" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/theory') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Théorie
              </Link>
                  <Link
                to="/care" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/care') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Soins
                  </Link>
              
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    to="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <Link 
                      to="/my-courses"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mes cours
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
                </div>
              )}
            </div>
    </nav>
  );
};

export default Navbar;










              </div>

            ) : (

              <div className="flex items-center space-x-3">

                <Link

                  to="/login"

                  className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
                >

                  Connexion

                </Link>

                <Link

                  to="/register"

                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                >

                  Inscription

                </Link>

              </div>

            )}

          </div>



          {/* Bouton menu mobile */}

          <div className="lg:hidden">
            <button

              onClick={() => setIsOpen(!isOpen)}

              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
            >

              {isOpen ? (

                <X className="w-6 h-6" />

              ) : (

                <Menu className="w-6 h-6" />

              )}

            </button>

          </div>

        </div>

      </div>



      {/* Menu mobile */}

      <AnimatePresence>

        {isOpen && (

          <motion.div

            initial={{ opacity: 0, height: 0 }}

            animate={{ opacity: 1, height: 'auto' }}

            exit={{ opacity: 0, height: 0 }}

            transition={{ duration: 0.3 }}

            className="lg:hidden bg-white border-t border-gray-200"
          >

            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => {

                const Icon = item.icon;

                return (

                  <Link

                    key={item.name}

                    to={item.href}

                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)

                        ? 'text-purple-700 bg-purple-50'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}

                  >

                    <Icon className="w-5 h-5 mr-3" />

                    {item.name}

                  </Link>

                );

              })}

              

              <hr className="my-4 border-gray-200" />
              

              {user ? (

                <div className="space-y-2">
                  <Link

                    to="/profile"

                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors duration-200"
                  >

                    <User className="w-5 h-5 mr-3" />

                    Mon Profil

                  </Link>

                  <button

                    onClick={handleLogout}

                    className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >

                    <LogOut className="w-5 h-5 mr-3" />

                    Déconnexion

                  </button>

                </div>

              ) : (

                <div className="space-y-3 pt-4">
                  <Link

                    to="/login"

                    className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  >

                    Connexion

                  </Link>

                  <Link

                    to="/register"

                    className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                  >

                    Inscription

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



export default Navbar;


















