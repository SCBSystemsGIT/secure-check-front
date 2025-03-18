<script setup>
import { onMounted, ref } from "vue";
import { useUserList } from "@/services/useUserList";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css"; // Ensure this is imported

const { fetchUsers, fetchUsersComp, deleteUser, users, loading, error } = useUserList();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const route = useRoute();
const domain = ref(route.params.domain || "scb");

const roles = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
const userStore = useUserStore();
const currentRole = ref(roles?.value?.roles ? roles.value.roles[0] : "");

// Fetch users on component mount
onMounted(async () => {
  if (!userStore.isAdmin(currentRole.value)) {
    await fetchUsersComp(domain.value);
  } else {
    await fetchUsers();
  }
});

// Optimized Delete Function using toast.promise
const handleDelete = async (userId, userName) => {
  const isConfirmed = confirm(`Are you sure you want to delete ${userName}?`);
  if (!isConfirmed) return;

  await toast.promise(
    deleteUser(userId), // Async delete function
    {
      pending: `Deleting ${userName}...`,
      success: `User ${userName} deleted successfully!`,
      error: `Failed to delete ${userName}.`,
    },
    {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000, // Auto close after 3 seconds
      closeButton: true,
    }
  );
};
</script>

<template>
  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12">
          <div class="left-back">
            <router-link :to="{ name: 'Menu' }">
              <img src="@/assets/back-arrow-table.png" alt="back-arrow" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="d-flex justify-content-center align-items-center">
      <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
        <h3 class="text-center">Liste des Utilisateurs</h3>
      </div>
    </div>

    <div v-if="loading" class="text-center">Chargement des utilisateurs...</div>
    <div v-if="error" class="text-center text-danger">{{ error }}</div>

    <div v-if="users.length" class="table_compdata">
      <table class="mdc-data-table__table">
        <thead>
          <tr class="mdc-data-table__header-row">
            <th class="mdc-data-table__header-cell">ID</th>
            <th class="mdc-data-table__header-cell">Nom</th>
            <th class="mdc-data-table__header-cell">Email</th>
            <th class="mdc-data-table__header-cell">Date de Création</th>
            <th class="mdc-data-table__header-cell"
                v-if="userStore.isAdmin(currentRole)">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id" class="mdc-data-table__row">
            <td>{{ index + 1 }}</td>
            <td class="mdc-data-table__cell">{{ user.name }}</td>
            <td class="mdc-data-table__cell">{{ user.email }}</td>
            <td class="mdc-data-table__cell">{{ formatDate(user.create_at) }}</td>
            <td class="mdc-data-table__cell"
                v-if="userStore.isSuperAdmin(currentRole) || userStore.isSecureCheck(currentRole)">
              <router-link :to="{ name: 'EditUser', params: { user_id: user.id } }">Edit</router-link>
            </td>
            <td class="mdc-data-table__cell" v-if="userStore.isAdmin(currentRole)">
              <button @click="handleDelete(user.id, user.name)" class="btn">
                <img src="@/assets/delete-icon.png" alt="delete" width="30" height="30"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
