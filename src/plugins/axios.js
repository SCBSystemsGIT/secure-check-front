// apiClient.js
import axios from 'axios';
import router from '@/router'; // Assurez-vous que ceci pointe vers ton router Vue

// Créez une instance Axios
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes (ajout du token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponses (détection token expiré)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (
      response &&
      response.status === 401 &&
      response.data?.message === 'Votre Token a expiré, veuillez le renouveler.'
    ) {
      // Supprimer les données locales
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');

      // Rediriger vers la page de login
      router.push({ name: 'Login' }); // ⚠️ Remplace par le vrai nom de ta route
    }

    return Promise.reject(error);
  }
);

export default apiClient;
