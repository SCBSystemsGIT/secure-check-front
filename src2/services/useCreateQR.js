// src/composables/useCreateQR.js
import { ref } from 'vue';
import apiClient from "@/plugins/axios";

export function useCreateQR() {
  const qrResponse = ref(null);
  const error = ref(null);
  const statusCode = ref(null);

  const createQR = async (email, type, firstname , lastname ,contact, title) => {
    try {
      const response = await apiClient.post('/create-qr', {
        email: email,
        type: type,
        firstname: firstname,
        lastname: lastname,
        contact: contact,
        title:title
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle success
      qrResponse.value = response.data;
      statusCode.value = response.status; // Capture the status code
    } catch (err) {
      // Handle error
      error.value = err.response ? err.response.data : err.message;
      statusCode.value = err.response ? err.response.status : null; // Capture the error status code
    }
  };

  return {
    qrResponse,
    error,
    statusCode, // Return statusCode for both success and error
    createQR
  };
}
