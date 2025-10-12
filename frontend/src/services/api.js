// Service API pour récupérer les données depuis Django
import { getApiUrl } from '../config/api';

const API_BASE_URL = getApiUrl();

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
      const response = await fetch(`${API_BASE_URL}/courses/courses/upcoming_events/`);
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
      const response = await fetch(`${API_BASE_URL}/courses/courses/my_courses/`, {
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

  // Récupérer tous les festivals
  async getFestivals() {
    try {
      const response = await fetch(`${API_BASE_URL}/festivals/festivals/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des festivals');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFestivals:', error);
      return [];
    }
  }

  // Récupérer tous les artistes
  async getArtists() {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/artists/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des artistes');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getArtists:', error);
      return [];
    }
  }

  // Récupérer tous les trainings
  async getTrainings() {
    try {
      const response = await fetch(`${API_BASE_URL}/trainings/trainings/`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getTrainings:', error);
      throw error; // Re-throw pour que le composant puisse gérer l'erreur
    }
  }

  // Récupérer tous les cours
  async getCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/courses/`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getCourses:', error);
      throw error;
    }
  }

  // Récupérer un cours par ID
  async getCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/courses/${courseId}/`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getCourse:', error);
      throw error;
    }
  }

  // Récupérer les formations (catégories)
  async getFormations() {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/categories/`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFormations:', error);
      throw error;
    }
  }

  // Récupérer tous les événements
  async getEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events/events/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getEvents:', error);
      return [];
    }
  }

  // Récupérer les catégories d'événements
  async getEventCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/events/categories/`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des catégories d'événements");
      return await response.json();
    } catch (error) {
      console.error('Erreur API getEventCategories:', error);
      return [];
    }
  }

  // Alias pour getEvents (utilisé par EventsPage)
  async getAllEvents() {
    return this.getEvents();
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

  // Récupérer toutes les compétitions
  async getCompetitions() {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/competitions/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des compétitions');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getCompetitions:', error);
      return [];
    }
  }

  // Récupérer une compétition spécifique
  async getCompetition(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/competitions/${id}/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de la compétition');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getCompetition:', error);
      return null;
    }
  }

  // S'inscrire à une compétition
  async enrollInCompetition(competitionId, token, enrollmentData = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/competitions/${competitionId}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'inscription à la compétition');
      return await response.json();
    } catch (error) {
      console.error('Erreur API enrollInCompetition:', error);
      throw error;
    }
  }

  // Supprimer un événement
  async deleteEvent(slug, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/events/${slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de l\'événement');
      return response.ok;
    } catch (error) {
      console.error('Erreur API deleteEvent:', error);
      throw error;
    }
  }

  // Supprimer un festival
  async deleteFestival(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/festivals/festivals/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du festival');
      return response.ok;
    } catch (error) {
      console.error('Erreur API deleteFestival:', error);
      throw error;
    }
  }

  // Supprimer un artiste
  async deleteArtist(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/artists/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de l\'artiste');
      return response.ok;
    } catch (error) {
      console.error('Erreur API deleteArtist:', error);
      throw error;
    }
  }

  // Supprimer un training
  async deleteTraining(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/trainings/trainings/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du training');
      return response.ok;
    } catch (error) {
      console.error('Erreur API deleteTraining:', error);
      throw error;
    }
  }

  // Supprimer une compétition
  async deleteCompetition(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/competitions/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de la compétition');
      return response.ok;
    } catch (error) {
      console.error('Erreur API deleteCompetition:', error);
      throw error;
    }
  }

  // Récupérer les festivals de l'utilisateur
  async getMyFestivals(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/festivals/festivals/my_festivals/`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
      if (response.status === 401) return { created: [], enrolled: [] };
      if (!response.ok) throw new Error('Erreur lors de la récupération de mes festivals');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getMyFestivals:', error);
      return { created: [], enrolled: [] };
    }
  }

  // S'inscrire à un cours
  async enrollInCourse(courseId, token, enrollmentData = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/courses/${courseId}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'inscription au cours');
      return await response.json();
    } catch (error) {
      console.error('Erreur API enrollInCourse:', error);
      throw error;
    }
  }

  // S'inscrire à un festival
  async enrollInFestival(festivalId, token, enrollmentData = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/festivals/festivals/${festivalId}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'inscription au festival');
      return await response.json();
    } catch (error) {
      console.error('Erreur API enrollInFestival:', error);
      throw error;
    }
  }

  // Récupérer les articles de formation
  async getFormationArticles(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/formations/articles/?${queryString}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des articles');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFormationArticles:', error);
      return [];
    }
  }

  // Supprimer un article de formation
  async deleteFormationArticle(slug, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/articles/${slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression de l\'article');
      return response.ok;
    } catch (error) {
      console.error('Erreur API deleteFormationArticle:', error);
      throw error;
    }
  }

  // Toggle favori d'un article
  async toggleFormationFavorite(articleId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/favorites/toggle/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_id: articleId }),
      });
      if (!response.ok) throw new Error('Erreur lors du toggle du favori');
      return await response.json();
    } catch (error) {
      console.error('Erreur API toggleFormationFavorite:', error);
      throw error;
    }
  }

  // Mettre à jour le progrès d'un article
  async updateFormationProgress(articleId, progress, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/progress/update_progress/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ article_id: articleId, progress }),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du progrès');
      return await response.json();
    } catch (error) {
      console.error('Erreur API updateFormationProgress:', error);
      throw error;
    }
  }

  // Ajouter un commentaire à un article
  async addFormationComment(articleId, content, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ article_id: articleId, content }),
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout du commentaire');
      return await response.json();
    } catch (error) {
      console.error('Erreur API addFormationComment:', error);
      throw error;
    }
  }

  // Créer ou mettre à jour un événement
  async saveEvent(eventData, token, eventId = null) {
    try {
      const url = eventId 
        ? `${API_BASE_URL}/events/events/${eventId}/`
        : `${API_BASE_URL}/events/events/`;
      
      const method = eventId ? 'PUT' : 'POST';
      
      console.log('Envoi des données événement:', eventData);
      
      // Vérifier s'il y a un fichier à uploader
      const hasFile = eventData.main_image && eventData.main_image instanceof File;
      
      let headers, body;
      
      if (hasFile) {
        // Utiliser FormData pour les fichiers
        const formData = new FormData();
        
        // Ajouter tous les champs au FormData
        Object.keys(eventData).forEach(key => {
          if (eventData[key] !== null && eventData[key] !== undefined) {
            if (key === 'main_image' && eventData[key] instanceof File) {
              formData.append(key, eventData[key]);
            } else if (Array.isArray(eventData[key]) || typeof eventData[key] === 'object') {
              // Pour les champs JSON (tableaux et objets), les envoyer comme chaîne JSON
              formData.append(key, JSON.stringify(eventData[key]));
            } else {
              formData.append(key, eventData[key]);
            }
          }
        });
        
        headers = {
          'Authorization': `Token ${token}`,
        };
        body = formData;
      } else {
        // Utiliser JSON pour les données sans fichier
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        };
        body = JSON.stringify(eventData);
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body,
      });
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Impossible de parser la réponse d\'erreur:', e);
        }
        console.error('Erreur serveur:', errorData);
        const error = new Error(`Erreur ${response.status}: ${response.statusText}`);
        error.response = response;
        error.data = errorData;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API saveEvent:', error);
      throw error;
    }
  }

  // Créer ou mettre à jour un training
  async saveTraining(trainingData, token, trainingId = null) {
    try {
      const url = trainingId 
        ? `${API_BASE_URL}/trainings/trainings/${trainingId}/`
        : `${API_BASE_URL}/trainings/trainings/`;
      
      const method = trainingId ? 'PUT' : 'POST';
      
      console.log('Envoi des données training:', trainingData);
      
      // Vérifier s'il y a un fichier à uploader
      const hasFile = trainingData.main_image && trainingData.main_image instanceof File;
      
      let headers, body;
      
      if (hasFile) {
        // Utiliser FormData pour les fichiers
        const formData = new FormData();
        
        // Ajouter tous les champs au FormData
        Object.keys(trainingData).forEach(key => {
          if (trainingData[key] !== null && trainingData[key] !== undefined) {
            if (key === 'main_image' && trainingData[key] instanceof File) {
              formData.append(key, trainingData[key]);
            } else if (Array.isArray(trainingData[key]) || typeof trainingData[key] === 'object') {
              // Pour les champs JSON (tableaux et objets), les envoyer comme chaîne JSON
              formData.append(key, JSON.stringify(trainingData[key]));
            } else {
              formData.append(key, trainingData[key]);
            }
          }
        });
        
        headers = {
          'Authorization': `Token ${token}`,
        };
        body = formData;
      } else {
        // Utiliser JSON pour les données sans fichier
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        };
        body = JSON.stringify(trainingData);
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body,
      });
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Impossible de parser la réponse d\'erreur:', e);
        }
        console.error('Erreur serveur:', errorData);
        const error = new Error(`Erreur ${response.status}: ${response.statusText}`);
        error.response = response;
        error.data = errorData;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API saveTraining:', error);
      throw error;
    }
  }

  // Créer ou mettre à jour une compétition
  async saveCompetition(competitionData, token, competitionId = null) {
    try {
      const url = competitionId 
        ? `${API_BASE_URL}/competitions/competitions/${competitionId}/`
        : `${API_BASE_URL}/competitions/competitions/`;
      
      const method = competitionId ? 'PUT' : 'POST';
      
      console.log('Envoi des données competition:', competitionData);
      
      // Vérifier s'il y a un fichier à uploader
      const hasFile = competitionData.main_image && competitionData.main_image instanceof File;
      
      let headers, body;
      
      if (hasFile) {
        // Utiliser FormData pour les fichiers
        const formData = new FormData();
        
        // Ajouter tous les champs au FormData
        Object.keys(competitionData).forEach(key => {
          if (competitionData[key] !== null && competitionData[key] !== undefined) {
            if (key === 'main_image' && competitionData[key] instanceof File) {
              formData.append(key, competitionData[key]);
            } else if (Array.isArray(competitionData[key])) {
              // Convertir les tableaux en JSON
              formData.append(key, JSON.stringify(competitionData[key]));
            } else {
              formData.append(key, competitionData[key]);
            }
          }
        });
        
        headers = {
          'Authorization': `Token ${token}`,
        };
        body = formData;
      } else {
        // Utiliser JSON pour les données sans fichier
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        };
        body = JSON.stringify(competitionData);
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body,
      });
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Impossible de parser la réponse d\'erreur:', e);
        }
        console.error('Erreur serveur:', errorData);
        const error = new Error(`Erreur ${response.status}: ${response.statusText}`);
        error.response = response;
        error.data = errorData;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API saveCompetition:', error);
      throw error;
    }
  }

  // Créer ou mettre à jour un artiste
  async saveArtist(artistData, token, artistId = null) {
    try {
      const url = artistId 
        ? `${API_BASE_URL}/artists/artists/${artistId}/`
        : `${API_BASE_URL}/artists/artists/`;
      
      const method = artistId ? 'PUT' : 'POST';
      
      console.log('Envoi des données artist:', artistData);
      
      // Vérifier s'il y a un fichier à uploader
      const hasFile = (artistData.profile_image && artistData.profile_image instanceof File) || 
                     (artistData.main_image && artistData.main_image instanceof File);
      
      let headers, body;
      
      if (hasFile) {
        // Utiliser FormData pour les fichiers
        const formData = new FormData();
        
        // Ajouter tous les champs au FormData
        Object.keys(artistData).forEach(key => {
          if (artistData[key] !== null && artistData[key] !== undefined) {
            if ((key === 'profile_image' || key === 'main_image') && artistData[key] instanceof File) {
              formData.append(key, artistData[key]);
            } else if (Array.isArray(artistData[key])) {
              // Convertir les tableaux en JSON
              formData.append(key, JSON.stringify(artistData[key]));
            } else {
              formData.append(key, artistData[key]);
            }
          }
        });
        
        headers = {
          'Authorization': `Token ${token}`,
        };
        body = formData;
      } else {
        // Utiliser JSON pour les données sans fichier
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        };
        body = JSON.stringify(artistData);
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body,
      });
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Impossible de parser la réponse d\'erreur:', e);
        }
        console.error('Erreur serveur:', errorData);
        const error = new Error(`Erreur ${response.status}: ${response.statusText}`);
        error.response = response;
        error.data = errorData;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API saveArtist:', error);
      throw error;
    }
  }

  // Créer ou mettre à jour un festival
  async saveFestival(festivalData, token, festivalId = null) {
    try {
      const url = festivalId 
        ? `${API_BASE_URL}/festivals/festivals/${festivalId}/`
        : `${API_BASE_URL}/festivals/festivals/`;
      
      const method = festivalId ? 'PUT' : 'POST';
      
      console.log('Envoi des données festival:', festivalData);
      
      // Vérifier s'il y a un fichier à uploader
      const hasFile = festivalData.main_image && festivalData.main_image instanceof File;
      
      let headers, body;
      
      if (hasFile) {
        // Utiliser FormData pour les fichiers
        const formData = new FormData();
        
        // Ajouter tous les champs au FormData
        Object.keys(festivalData).forEach(key => {
          if (festivalData[key] !== null && festivalData[key] !== undefined) {
            if (key === 'main_image' && festivalData[key] instanceof File) {
              formData.append(key, festivalData[key]);
            } else if (Array.isArray(festivalData[key]) || typeof festivalData[key] === 'object') {
              // Pour les champs JSON (tableaux et objets), les envoyer comme chaîne JSON
              formData.append(key, JSON.stringify(festivalData[key]));
            } else {
              formData.append(key, festivalData[key]);
            }
          }
        });
        
        headers = {
          'Authorization': `Token ${token}`,
        };
        body = formData;
      } else {
        // Utiliser JSON pour les données sans fichier
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        };
        body = JSON.stringify(festivalData);
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body,
      });
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Impossible de parser la réponse d\'erreur:', e);
        }
        console.error('Erreur serveur:', errorData);
        const error = new Error(`Erreur ${response.status}: ${response.statusText}`);
        error.response = response;
        error.data = errorData;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API saveFestival:', error);
      throw error;
    }
  }

  // Récupérer un festival par ID
  async getFestival(festivalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/festivals/festivals/${festivalId}/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération du festival');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFestival:', error);
      throw error;
    }
  }

  // Créer ou mettre à jour un article de formation
  async saveFormationArticle(articleData, token, articleSlug = null) {
    try {
      const url = articleSlug 
        ? `${API_BASE_URL}/formations/articles/${articleSlug}/`
        : `${API_BASE_URL}/formations/articles/`;
      
      const method = articleSlug ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(articleData),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde de l\'article');
      return await response.json();
    } catch (error) {
      console.error('Erreur API saveFormationArticle:', error);
      throw error;
    }
  }

  // Récupérer un article de formation par slug
  async getFormationArticle(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/articles/${slug}/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de l\'article');
      return await response.json();
    } catch (error) {
      console.error('Erreur API getFormationArticle:', error);
      throw error;
    }
  }
}

export default new ApiService();

// API pour la page d'accueil
export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/courses/stats/`);
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
    const response = await fetch(`${API_BASE_URL}/courses/courses/featured/`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des cours en vedette');
    return await response.json();
  } catch (error) {
    console.error('Erreur API getFeaturedCourses:', error);
    return [];
  }
};

export const getUpcomingEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/courses/upcoming_events/`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des événements à venir');
    return await response.json();
  } catch (error) {
    console.error('Erreur API getUpcomingEvents:', error);
    return { courses: [], festivals: [] };
  }
};



