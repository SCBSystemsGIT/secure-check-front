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
      let fetchResult = userStore.fetchUserInfo();

      console.log({ fetchResult: fetchResult });

      // localStorage.setItem(
      //   "roles",
      //   JSON.stringify([
      //     "ROLE_USER",
      //     "ROLE_EMPLOYEE",
      //     "ROLE_SUPERVISOR",
      //     "ROLE_ADMIN",
      //     "ROLE_SUPER_ADMIN",
      //   ])
      // );

      return response.data;
    } catch (error) {
      errorMessage.value =
        "Login failed: " + (error.response?.data?.message || "Unknown error");
      statusCode.value = error.response.status;
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    username,
    password,
    loading,
    errorMessage,
    statusCode,
    login,
  };
}
