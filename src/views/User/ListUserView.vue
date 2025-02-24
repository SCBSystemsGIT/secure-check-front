<script setup>
import { onMounted, ref } from "vue";
import { useUserList } from "@/services/useUserList";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { computed } from "vue";
// import { useUserStore } from "@/stores/useUserStore";

const { fetchUsers, fetchUsersComp, users, loading, error } = useUserList();
// const userStore = useUserStore();
//const router = useRouter();

/*const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};*/

// Fonction pour formater la date en "14-09-2024 à 09:05:23"
const formatDateTime = (dateString) => {
  if (!dateString) return "Non défini";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} à ${hours}:${minutes}:${seconds}`;
};

// Définitions des colonnes pour le tableau
const thead = ref(["ID", "Nom", "Prénoms", "Email", "Compagnie", "Créé le", "Action"]);

// Transforme les données pour extraire `company.name` et formater `create_at`
const formattedUsers = computed(() => {
  return users.value.map(user => ({
    ...user,
    companyName: user.company?.name || "Non défini",
    formattedCreateAt: formatDateTime(user.create_at),
  }));
});

// Correspondance des propriétés de l'utilisateur
const tbody = ref(["id", "name", "firstname", "email", "companyName", "formattedCreateAt", "actions"]);

const route = useRoute();
const domain = ref(route.params.domain || "scb");
/*const goToMenu = () => {
  router.push({
    name: "Menu",
    params: {
      domain: domain.value,
    },
  });
};*/

const roles = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
const userStore = useUserStore();
const currentRole = ref(roles?.value?.roles ? roles.value.roles[0] : "");

onMounted(async () => {
  if (!userStore.isAdmin(currentRole.value)) {
    await fetchUsersComp(domain.value);
  } else {
    await fetchUsers();
  }
});
</script>

<template>

  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
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
        <!-- <button class="back" @click="goToMenu">Retour</button> -->
        <h3 class="text-center">Liste des Utilisateurs</h3>
      </div>
    </div>

    <div class="d-flex justify-content-center py-3">
      <ui-table :data="formattedUsers" :thead="thead" :tbody="tbody">
        <!-- Slot personnalisé pour la date -->
        <template #formattedCreateAt="{ row }">
          {{ row.formattedCreateAt }}
        </template>

        <!-- Bouton Modifier -->
        <template #actions="{ row }">
          <button class="edit-btn" @click="editUser(row)">Modifier</button>
        </template>
      </ui-table>
    </div>

    <div v-if="loading">Chargement des utilisateurs...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<style scoped>
  
  .container {
    width: 100%;
    max-width: 1200px; /* Ajuste cette valeur selon la largeur souhaitée */
    margin: auto;
  }

  .ui-table {
    width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }

  .mdc-data-table__table {
    width: 100%;
    table-layout: fixed; /* Fixe la largeur de la table et répartit les colonnes intelligemment */
    border-collapse: collapse;
  }

  .mdc-data-table__header-cell,
  .mdc-data-table__cell {
    padding: 12px;
    border: 1px solid #ddd;
    word-break: break-word;
    white-space: normal;
    text-align: left;
  }

  /* Ajuste la largeur spécifique de l'ID pour qu'il prenne moins de place */
  .mdc-data-table__cell:first-child,
  .mdc-data-table__header-cell:first-child {
    width: 50px; /* Fixe une petite largeur pour l'ID */
    min-width: 50px;
    max-width: 80px; /* Évite qu'il ne prenne trop de place */
    text-align: center;
  }

  /* Les autres colonnes prennent l'espace disponible */
  .mdc-data-table__cell:not(:first-child),
  .mdc-data-table__header-cell:not(:first-child) {
    min-width: 150px;
    max-width: 400px;
  }



</style>
