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

  // Cours de l'utilisateur connecté (créés et inscrits)
  async getMyCourses(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/my_courses/`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
      if (response.status === 401) return { created: [], enrolled: [] };
      if (!response.ok) throw new Error('Erreur lors de la récupération de mes cours');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getMyCourses:', error);
      return { created: [], enrolled: [] };
    }
  }

  // Récupérer tous les événements
  async getAllEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events/events/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getAllEvents:', error);
      return [];
    }
  }

  // Récupérer un événement spécifique
  async getEvent(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/events/${slug}/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de l\'événement');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getEvent:', error);
      return null;
    }
  }

  // Récupérer les événements en vedette
  async getFeaturedEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events/events/featured/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements en vedette');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFeaturedEvents:', error);
      return [];
    }
  }

  // Récupérer les événements à venir
  async getUpcomingEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events/events/upcoming/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements à venir');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getUpcomingEvents:', error);
      return [];
    }
  }

  // S'inscrire à un événement
  async enrollInEvent(eventId, token, enrollmentData = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/events/${eventId}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'inscription');
      return await response.json();
    } catch (error) {
      console.error('Erreur API enrollInEvent:', error);
      throw error;
    }
  }

  // Récupérer les événements de l'utilisateur
  async getMyEvents(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/enrollments/my_events/`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
      if (response.status === 401) return { enrolled_events: [], created_events: [] };
      if (!response.ok) throw new Error('Erreur lors de la récupération de mes événements');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getMyEvents:', error);
      return { enrolled_events: [], created_events: [] };
    }
  }

  // Rechercher des événements
  async searchEvents(searchParams) {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${API_BASE_URL}/events/events/search/?${queryString}`);
      if (!response.ok) throw new Error('Erreur lors de la recherche d\'événements');
      return await response.json();
    } catch (error) {
      console.error('Erreur API searchEvents:', error);
      return [];
    }
  }
}

export default new ApiService();

// API pour la page d'accueil
export const getStats = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/courses/courses/stats/');
    if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
    return await response.json();
  } catch (error) {
    console.error('Erreur API getStats:', error);
    return {
      courses_count: 0,
      total_participants: 0,
      artists_count: 0,
      cities_count: 0
    };
  }
};

export const getFeaturedCourses = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/courses/courses/featured/');
    if (!response.ok) throw new Error('Erreur lors de la récupération des cours en vedette');
    return await response.json();
  } catch (error) {
    console.error('Erreur API getFeaturedCourses:', error);
    return [];
  }
};

export const getUpcomingEvents = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/courses/courses/upcoming_events/');
    if (!response.ok) throw new Error('Erreur lors de la récupération des événements à venir');
    return await response.json();
  } catch (error) {
    console.error('Erreur API getUpcomingEvents:', error);
    return { courses: [], festivals: [] };
  }
};



