// src/composables/useRequestsList.js
import { ref, onMounted } from 'vue';
import apiClient from '@/plugins/axios';

export function useRequestsList() {
    const requests = ref([]);
    const error = ref(null);
    const loading = ref(false);

    const fetchRequests = async () => {
        loading.value = true;
        try {
            const response = await apiClient.get('/requests/list');
            requests.value = response.data;
        } catch (err) {
            error.value = err.response ? err.response.data : 'Error fetching data';
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchRequests();
    });

    return {
        requests,
        error,
        loading
    };
}
