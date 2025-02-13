import { ref } from "vue";
import apiClient from "@/plugins/axios";
import { useUserStore } from "@/stores/useUserStore";

export function useUserList() {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const userStore = useUserStore(); // Assuming this contains user info
  const loggedInUser = userStore.user; // Get the current logged-in user

  const filterUsers = (userList) => {
    if (loggedInUser && loggedInUser.roles.includes("ROLE_SecureCheck")) {
      // Filter out "ROLE_SUPER_ADMIN", "ROLE_ADMIN", and the logged-in user
      return userList.filter(
        (user) =>
          !user.roles.includes("ROLE_SUPER_ADMIN") &&
          !user.roles.includes("ROLE_ADMIN") &&
          user.id !== loggedInUser.id
      );
    }
    return userList;
  };

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get("/user/list");
      users.value = filterUsers(response.data); // Apply filtering
    } catch (err) {
      error.value = "Erreur lors de la récupération des utilisateurs.";
    } finally {
      loading.value = false;
    }
  };

  const fetchUsersComp = async (slug) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get("/user/list/" + slug);
      users.value = filterUsers(response.data); // Apply filtering
    } catch (err) {
      error.value = "Erreur lors de la récupération des utilisateurs.";
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchUsersComp,
  };
}
