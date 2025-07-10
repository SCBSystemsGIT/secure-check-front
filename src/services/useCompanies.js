import apiClient from "@/plugins/axioss";
import { ref } from "vue";
import { useRouter } from "vue-router";

export function useCompanies() {
  const companies = ref([]);
  const company = ref();
  const loading = ref(false);
  const errorMessage = ref(null);
  const statusCode = ref(null);
  const router = useRouter();

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

      if (error.status == 401) {
        router.push({
          name: "RequestMeeting",
          params: {
            domain: "scb",
          },
        });
      }
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

  const updateCompany = async (data, id) => {
    loading.value = true;
    errorMessage.value = null;
  
    try {
      // Create a new FormData object
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("id_number", data.id_number);
      formData.append("point_contact", data.point_contact);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("company_field", data.company_field);
      formData.append("country", data.country);
      formData.append("city", data.city);
      formData.append("number_of_employee", data.number_of_employee);
      formData.append("zipcode", data.zipcode);
      formData.append("logo", data.logo);
      formData.append("state", data.state);
      formData.append("title", data.title);
      // Send the FormData object
      const response = await apiClient.post(`/company/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      company.value = response.data.data;
      statusCode.value = response.status;
    } catch (error) {
      errorMessage.value =
        "Une erreur est survenue lors du chargement des entreprises.";
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  const postCompany = async (data) => {
    loading.value = true;
    errorMessage.value = null;

    try {
      // Crée un objet FormData
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("id_number", data.id_number);
      formData.append("point_contact", data.point_contact);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("company_field", data.company_field);
      formData.append("country", data.country);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("title", data.title);
      formData.append("number_of_employee", data.number_of_employee);
      formData.append("zipcode", data.zipcode);
      formData.append("logo", data.logo); // Assurez-vous que `data.logo` est un fichier (Blob)

      // Envoyer la requête POST avec formData
      const response = await apiClient.post("/company", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      company.value = response.data.data;
      statusCode.value = response.status;
    } catch (error) {
      errorMessage.value =
        "Une erreur est survenue lors de l'enregistrement de l'entreprise.";
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const deleteCompany= async (companyId) => {
    try {
      const response = await apiClient.delete(`/company/delete/${companyId}`);
      if (response.status === 200) {
        // Successfully deleted user, remove it from the list locally
        companies.value = companies.value.filter(company => company.id !== companyId);
      }
      return response; // Return the response for further handling
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err; // Propagate the error so it can be caught in the component
    }
  };

  return {
    companies,
    loading,
    errorMessage,
    fetchCompanies,
    showCompany,
    postCompany,
    updateCompany,
    statusCode,
    company,
    deleteCompany,
  };
}
