import { ref } from "vue";
import apiClient from "@/plugins/axios";

export function useUserList() {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch user info from localStorage
  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const loggedInUser = getUserFromLocalStorage();
  console.log("Logged-in User from LocalStorage:", loggedInUser.roles);

  // const filterUsers = (userList) => {
  //   if (loggedInUser && loggedInUser.roles.includes("ROLE_SecureCheck")) {
  //     return userList.filter(
  //       (user) =>
  //         !user.roles.includes("ROLE_SUPER_ADMIN") &&
  //         !user.roles.includes("ROLE_ADMIN") &&
  //         user.id !== loggedInUser.id
  //     );
  //   }
    
  //   // return userList;
  //   console.log({ userList });
  // };

  const filterUsers = (userList) => {
    if (!userList || !Array.isArray(userList)) {
      console.error("Invalid userList provided");
      return [];
    }
  
    if (loggedInUser && loggedInUser.roles.includes("ROLE_SUPERVISOR")) {
      return userList.filter(
        (user) => 
          !user.role.includes("ROLE_ADMIN") &&  
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

  const deleteUser = async (userId) => {
    try {
      const response = await apiClient.delete(`/user/${userId}`);
      if (response.status === 200) {
        // Successfully deleted user, remove it from the list locally
        users.value = users.value.filter(user => user.id !== userId);
      }
      return response; // Return the response for further handling
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err; // Propagate the error so it can be caught in the component
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchUsersComp,
    deleteUser,
  };
}
