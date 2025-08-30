import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8000/api/accounts';

  // Vérifier le token au chargement
  useEffect(() => {
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/current-user/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token invalide
        logout();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token: newToken, user: userData } = data;
        
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('auth_token', newToken);
        
        toast.success('Connexion réussie !');
        return { success: true };
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Erreur de connexion';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast.error('Erreur de connexion');
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const { token: newToken, user: newUser } = data;
        
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('auth_token', newToken);
        
        toast.success('Compte créé avec succès !');
        return { success: true };
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Erreur lors de l\'inscription';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error('Erreur lors de l\'inscription');
      return { success: false, error: 'Erreur lors de l\'inscription' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // Appeler l'API de déconnexion
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le state local
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      toast.success('Déconnexion réussie');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUser(prev => ({ ...prev, profile: updatedProfile }));
        toast.success('Profil mis à jour !');
        return { success: true };
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la mise à jour');
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};









