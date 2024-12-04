import apiClient from "@/plugins/axios";
import { ref } from "vue";
import { useUserStore } from "@/stores/useUserStore";

export function useLogin() {
  const username = ref("");
  const password = ref("");
  const loading = ref(false);
  const errorMessage = ref(null);
  const statusCode = ref(null);
  const userStore = useUserStore();
  const company_name = ref(null);
  const userInfo = ref(null);

  const login = async () => {
    loading.value = true;
    errorMessage.value = null;
    statusCode.value = null; // Réinitialiser le code de statut

    try {
      const response = await apiClient.post("/login_check", {
        username: username.value,
        password: password.value,
      });

      statusCode.value = response.status;

      localStorage.setItem("token", response.data.token);
      userStore.setToken(response.data.token);

      // Fetch user info after successful login
      let fetchResult = await fetchUserInfo();  // Wait for user info to be fetched
      console.log({ fetchResult });

      company_name.value = fetchResult;

      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        // This handles HTTP-related errors (e.g., 400, 500)
        errorMessage.value =
          "Login failed: " + (error.response?.data?.message || "Unknown error");
        statusCode.value = error.response.status;
      } else if (error.request) {
        // This handles errors where no response is received (e.g., network errors)
        errorMessage.value = "Login failed: Network error. Please try again.";
        statusCode.value = 0;  // Indicate no response was received
      } else {
        // This handles any other errors (e.g., bad request formation)
        errorMessage.value = "Login failed: " + error.message;
        statusCode.value = 0;
      }
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await apiClient.get("/user/info");
      userInfo.value = response.data;
      localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
      return response.data;  // Return user info for later use
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      return null;  // Return null if user info fetching fails
    }
  };

  return {
    username,
    password,
    loading,
    errorMessage,
    statusCode,
    company_name,
    userInfo,
    login,
  };
}
