import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configuration axios avec token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/current-user/');
      setUser(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/login/', {
        username,
        password,
      });
      
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Token ${newToken}`;
      
      toast.success('Connexion réussie !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur lors de la connexion';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/register/', userData);
      
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      axios.defaults.headers.common['Authorization'] = `Token ${newToken}`;
      
      toast.success('Compte créé avec succès !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur lors de l\'inscription';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/logout/');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Déconnexion réussie');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/profile/update/', profileData);
      setUser(prevUser => ({ ...prevUser, ...response.data }));
      toast.success('Profil mis à jour avec succès !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur lors de la mise à jour du profil';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await axios.post('/api/password/change/', passwordData);
      toast.success('Mot de passe modifié avec succès !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur lors du changement de mot de passe';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.user_type === 'admin',
    isArtist: user?.user_type === 'artist',
    isParticipant: user?.user_type === 'participant',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};








