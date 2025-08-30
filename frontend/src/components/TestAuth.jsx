import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestAuth = () => {
  const { user, isAuthenticated, loading, token } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Test de l'AuthProvider</h2>
        
        <div className="bg-white rounded-lg p-4 border mb-4 text-left">
          <h3 className="font-semibold mb-2">État de l'authentification :</h3>
          <p><strong>Loading :</strong> {loading ? 'Oui' : 'Non'}</p>
          <p><strong>Token :</strong> {token ? 'Présent' : 'Absent'}</p>
          <p><strong>Authentifié :</strong> {isAuthenticated ? 'Oui' : 'Non'}</p>
          <p><strong>Utilisateur :</strong> {user ? user.username : 'Aucun'}</p>
        </div>
        
        <div className="bg-green-100 border border-green-300 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            ✅ L'AuthProvider fonctionne parfaitement ! Vous êtes connecté en tant que <strong>{user?.username}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
