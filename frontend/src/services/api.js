// Service API pour récupérer les données depuis Django
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  // Récupérer les statistiques globales
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des stats');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getStats:', error);
      return null;
    }
  }

  // Récupérer les cours mis en avant
  async getFeaturedCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/featured/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFeaturedCourses:', error);
      return [];
    }
  }

  // Récupérer les événements à venir
  async getUpcomingEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events/upcoming/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getUpcomingEvents:', error);
      return [];
    }
  }

  // Récupérer tous les cours
  async getAllCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getAllCourses:', error);
      return [];
    }
  }

  // Récupérer tous les événements
  async getAllEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getAllEvents:', error);
      return [];
    }
  }
}

export default new ApiService();


