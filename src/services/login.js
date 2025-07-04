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
  const userInfo = ref(null);

  const login = async () => {
    loading.value = true;
    errorMessage.value = null;
    statusCode.value = null;

    try {
      const response = await apiClient.post("/login_check", {
        username: username.value,
        password: password.value,
      });

      statusCode.value = response.status;
      const token = response.data.token;
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;
      userStore.setToken(token);

      // Await fetching the user info
      await fetchUserInfo();

      return response.data;
    } catch (error) {
      statusCode.value = error.response?.status || 500;
      errorMessage.value = "Login failed: " + (error.response?.data?.message || "Unknown error");
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await apiClient.get("/user/info");
      userInfo.value = response.data;
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      console.log("User info:", userInfo.value);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  return {
    username,
    password,
    loading,
    errorMessage,
    statusCode,
    userInfo,
    login,
  };
}
