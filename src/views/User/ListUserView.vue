<script setup>
import { onMounted } from "vue";
import DataTable from "datatables.net-vue3"; // Importation de DataTables Vue 3
import { useUserList } from "@/services/useUserList";

const { fetchUsers, users } = useUserList();

onMounted(() => {

  setTimeout(() => {
    new DataTable("#userTable", {
      paging: true,
      pageLength: 10, // Par défaut, 10 entrées par page
      searching: true,
      ordering: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.20/i18n/French.json", // Exemple pour la traduction française
      },
    });
  }, 1500);

  fetchUsers();
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <div class="container mt-3">
    <h3>Liste des Utilisateurs</h3>
    <table id="userTable" class="table table-striped">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Date de création</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ formatDate(user.create_at) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
}
</style>
