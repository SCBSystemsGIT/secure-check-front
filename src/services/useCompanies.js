import apiClient from "@/plugins/axios";
import { ref } from "vue";

export function useCompanies() {
  const companies = ref([]);
  const company = ref();
  const loading = ref(false);
  const errorMessage = ref(null);

  const fetchCompanies = async () => {
    loading.value = true;
    errorMessage.value = null;

    try {
      const response = await apiClient.get("/companies"); // Remplacez par l'URL correcte de votre API
      companies.value = response.data.data;
    } catch (error) {
      errorMessage.value =
        "Une erreur est survenue lors du chargement des entreprises.";
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const showCompany = async (slug) => {
    loading.value = true;
    errorMessage.value = null;

    try {
      const response = await apiClient.get(`/company/${slug}`); // Remplacez par l'URL correcte de votre API
      company.value = response.data.data;
    } catch (error) {
      errorMessage.value =
        "Une erreur est survenue lors du chargement des entreprises.";
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    companies,
    loading,
    errorMessage,
    fetchCompanies,
    showCompany,
  };
}
