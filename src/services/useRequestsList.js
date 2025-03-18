// src/composables/useRequestsList.js
import { ref } from "vue";
import apiClient from "@/plugins/axios";

export function useRequestsList() {
  const requests = ref([]);
  const error = ref(null);
  const loading = ref(false);

  const fetchRequests = async () => {
    loading.value = true;
    try {
      const response = await apiClient.get("/requests/list");
      requests.value = response.data;
    } catch (err) {
      error.value = err.response ? err.response.data : "Error fetching data";
    } finally {
      loading.value = false;
    }
  };

  const fetchRequestsByComp = async (slug) => {
    loading.value = true;
    try {
      const response = await apiClient.get("/requests/list/" + slug);
      console.log({ response: response.data });

      requests.value = response.data;
    } catch (err) {
      error.value = err.response ? err.response.data : "Error fetching data";
    } finally {
      loading.value = false;
    }
  };

  const deleteVisitor = async (visitorId) => {
    try {
      const response = await apiClient.delete(`/visitor/delete/${visitorId}`);
      if (response.status === 200) {
        // Successfully deleted visitor, remove it from the list locally
        requests.value = requests.value.filter(request => request.id !== visitorId);
      }
      return response; // Return the response for further handling
    } catch (err) {
      console.error("Error deleting visitor:", err);
      throw err; // Propagate the error so it can be caught in the component
    }
  };


//   onMounted(async() => {
//     await fetchRequests();
//   });

  return {
    requests,
    error,
    loading,
    fetchRequestsByComp,
    fetchRequests,
    deleteVisitor
  };
}
