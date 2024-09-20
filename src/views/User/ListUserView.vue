<script setup>
import { onMounted, ref } from "vue";
import { useUserList } from "@/services/useUserList";

const { fetchUsers, users, loading, error } = useUserList();

onMounted(() => {
  fetchUsers();
});

const formatDate = (dateString) => {
  const date = "hello " + new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Définitions des colonnes pour le tableau
const thead = ref(["ID", "Nom", "Email", "Role", 
// "Date de Création"
]);

// Correspondance des propriétés de l'utilisateur
const tbody = ref(["id", "name", "email", "role",
//  { slot: "create_at" }
 ]);
</script>

<template>
  <div class="container">
    <h3 class="text-center">Liste des Utilisateurs</h3>

    <div class="d-flex justify-content-center py-3">
      <ui-table :data="users" :thead="thead" :tbody="tbody">
        <!-- Utilisation d'un slot personnalisé pour formater la date -->
        <template #create_at="{ row }">
          {{ formatDate(row?.create_at) }}
        </template>
      </ui-table>
    </div>

    <div v-if="loading">Chargement des utilisateurs...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
}
</style>
