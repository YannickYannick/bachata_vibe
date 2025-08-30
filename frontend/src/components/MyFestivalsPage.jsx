import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MyFestivalsPage = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [created, setCreated] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/festivals/festivals/my_festivals/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCreated(data.created || []);
          setEnrolled(data.enrolled || []);
        } else {
          console.error('Erreur lors de la récupération des festivals');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des festivals:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, token]);

  const Section = ({ title, items }) => (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      {items.length === 0 ? (
        <div className="text-gray-600 text-sm bg-white border rounded-xl p-4">
          Aucun festival
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{f.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {f.city} • {f.base_price}{f.currency || '€'}
                </div>
              </div>
              <Link 
                to={`/festivals/${f.id}`} 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ouvrir
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  // Si pas authentifié, afficher le message de connexion
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes festivals</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Connexion requise
            </h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour voir vos festivals et suivre votre progression.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Se connecter
              </Link>
              
              <Link 
                to="/register"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes festivals</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de vos festivals...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes festivals</h1>
        
        <Section title="Festivals auxquels je suis inscrit(e)" items={enrolled} />
        <Section title="Festivals que j'ai créés" items={created} />
      </div>
    </div>
  );
};

export default MyFestivalsPage;
