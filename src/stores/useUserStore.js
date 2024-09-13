// stores/useUserStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import apiClient from "@/plugins/axios";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
const router = useRouter();

export const useUserStore = defineStore(
  "user",
  () => {
    // State
    const token = ref(localStorage.getItem("token") || null);
    const roles = ref(JSON.parse(localStorage.getItem("roles") || "[]"));
    const userInfo = ref(null);

    // Getters
    const isAuthenticated = () => !!token.value;
    const hasRole = (role) => roles.value.includes(role);

    // Actions
    const setToken = (newToken) => {
      token.value = newToken;
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    };

    const fetchRoles = async () => {
      try {
        const response = await apiClient.get("/api/user/roles");
        roles.value = response.data.roles;
        localStorage.setItem("roles", JSON.stringify(response.data.roles));
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await apiClient.get("/user/info");
        userInfo.value = response.data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    const login = async (credentials) => {
      try {
        const response = await apiClient.post("/login_check", credentials);
        setToken(response.data.token);
        await fetchRoles();
        await fetchUserInfo();
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    const logout = () => {
      token.value = null;
      userInfo.value = null;
      roles.value = [];
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      //   axios.defaults.headers.common["Authorization"] = "";
      toast.info("Déconnecté");
      router.push("/sign-in");
    };

    return {
      token,
      roles,
      isAuthenticated,
      hasRole,
      setToken,
      fetchRoles,
      login,
      logout,
      fetchUserInfo,
    };
  },
  {
    persist: true, // Activer la persistance avec localStorage
  }
);
