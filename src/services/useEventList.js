import { ref} from "vue";
import apiClient from "@/plugins/axioss";

export function useEventList() {
  const events = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get("/evenement/list");
      events.value = response.data;
      console.log();
    } catch (err) {
      error.value = "Erreur lors de la récupération des events.";
    } finally {
      loading.value = false;
    }
  };

  const fetchEventsByComp = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get("/evenement/list/" + id);
      events.value = response.data;
      console.log();
    } catch (err) {
      error.value = "Erreur lors de la récupération des utilisateurs.";
    } finally {
      loading.value = false;
    }
  };


    const deleteEvent = async (eventId) => {
      try {
        const response = await apiClient.delete(`/evenement/delete/${eventId}`);
        if (response.status === 200) {
          // Successfully deleted event, remove it from the list locally
          events.value = events.value.filter(event => event.id !== eventId);
          return {
            success: true,
            message: 'Event deleted successfully'
          };
        }
        return response;
      } catch (err) {
        console.error("Error deleting event:", err);
        return {
          success: false,
          message: err.response?.data?.message || 'Error deleting event'
        };
      }
    };
  

  // onMounted(() => {
  //   fetchEvents();
  // });

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchEventsByComp,
    deleteEvent,
  };
}
