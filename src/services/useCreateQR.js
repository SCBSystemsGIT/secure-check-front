// src/composables/useCreateQR.js
import { ref } from 'vue';
import apiClient from "@/plugins/axios";

export function useCreateQR() {
  const qrResponse = ref(null);
  const error = ref(null);
  const statusCode = ref(null);

  const createQR = async (email, type, firstname, lastname, contact, title, dateExp, company_id, userDocument = null) => {
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

      const response = await apiClient.post('/create-qr', formData, {
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

  const getUserQrById = async (id) => {
    try {
      const response = await apiClient.get(`/qruser/${id}`);
      return response.data;
    } catch (error) {
      statusCode.value = error.response?.status || 500;
      return null;
    }
  };

  const updateUserQr = async (userQrData, id) => {
    try {
      const response = await apiClient.put(`/qruser/${id}`, userQrData);
      statusCode.value = response.status;
    } catch (error) {
      statusCode.value = error.response?.status || 500;
    }
  };

  return {
    qrResponse,
    error,
    statusCode,
    createQR,
    getUserQrById,
    updateUserQr
  };
}
