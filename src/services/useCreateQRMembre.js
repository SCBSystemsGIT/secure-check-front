// src/composables/useCreateQR.js
import { ref } from 'vue';
import apiClient from "@/plugins/axios";

export function useCreateQRMembre() {
  const qrResponse = ref(null);
  const error = ref(null);
  const statusCode = ref(null);
  const qrCodes = ref([]);

  const createQRMembre = async (email, type, firstname, lastname, contact, title, dateExp, company_id, userDocument = null) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('type', type);
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('contact', contact);
      formData.append('title', title);
      formData.append('dateExp', dateExp);
      formData.append('company_id', company_id);

      // Append user document if it exists
      if (userDocument) {
        formData.append('user_document', userDocument);
      }

      const response = await apiClient.post('/create-member', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      qrResponse.value = response.data;
      statusCode.value = response.status;
    } catch (err) {
      error.value = err.response ? err.response.data : err.message;
      statusCode.value = err.response ? err.response.status : null;
    }
  };

  const getMembreQrById = async (id) => {
    try {
      const response = await apiClient.get(`/qrusermembre/${id}`);
      //console.log('QR Membre Response:', response.data);
      return response.data;
    } catch (error) {
      statusCode.value = error.response?.status || 500;
      //console.error('Erreur API:', error);
      return null;
    }
  };

  const updateMembreQr = async (userQrData, id) => {
    try {
      const response = await apiClient.put(`/qrusermembre/${id}`, userQrData);
      statusCode.value = response.status;
    } catch (error) {
      statusCode.value = error.response?.status || 500;
    }
  };

  const loading = ref(false);
  const errorMessage = ref(null);

  const fetchQrCodeList = async () => {
    loading.value = true;
    errorMessage.value = null;
    try {
      const response = await apiClient.get("/qrmembre-list"); // Remplacez par l'URL correcte de votre API
      qrCodes.value = response.data;
    } catch (error) {
      errorMessage.value =
        "something went wrong.";
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    qrResponse,
    error,
    statusCode,
    createQRMembre,
    getMembreQrById,
    updateMembreQr,
    fetchQrCodeList,
    qrCodes
  };
}