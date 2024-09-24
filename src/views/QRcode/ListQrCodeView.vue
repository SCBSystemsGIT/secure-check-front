<script setup>
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { useRequestsList } from "@/services/useRequestsList";
import { useRoute, useRouter } from "vue-router";
import { useEvent } from "@/services/useEvent";

const { requests, error } = useRequestsList();
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const router = useRouter();
const route = useRoute();
// Pagination variables
const currentPage = ref(1);
const itemsPerPage = ref(10);
const show = (id) => {
  router.push(`/waiting-validation/${id}`);
};

// Computed property for paginated data
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return route.params.slug
    ? filteredRequests.value.slice(start, end)
    : requests.value.slice(start, end);
});

// Calculate the total number of pages
const totalPages = computed(() =>
  Math.ceil(requests.value.length / itemsPerPage.value)
);

// Function to change page
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const { showEvent, event } = useEvent();

const filteredRequests = computed(() => {
  return requests.value.filter(
    (request) => request.visitor.evenements?.id === event.value.id
  );
});

onBeforeMount(async () => {
  requests.value = filteredRequests.value;
});

onMounted(async () => {
  console.log({ req: typeof requests.value });

  if (route?.params?.slug) {
    await showEvent(route?.params?.slug);
    console.log({ requests: requests });
    console.log({ event: event.value });
  }
});
</script>

<template>
  <div class="container">
    <div class="text-center py-4">
      <h3>Liste des demandes</h3>
      <h4 v-if="route?.params?.slug">Evenements : {{ event?.name }}</h4>
    </div>

    <div class="d-flex justify-content-center py-3">
      <ui-table
        :data="paginatedRequests"
        :thead="['Visiteur', 'Host', 'Statut', 'Date Création', 'Action']"
        :tbody="[
          {
            slot: 'visitor',
          },
          'host',
          { slot: 'confirmed' },
          {
            slot: 'request_date',
          },
          {
            slot: 'actions',
          },
        ]"
      >
        <!-- Utilisation des slots si supportés -->
        <template #visitor="{ data }">
          {{ data.visitor.firstname }}
          {{ data.visitor.lastname }}
        </template>

        <template #request_date="{ data }">
          {{ formatDate(data.request_date) }}
        </template>

        <template #confirmed="{ data }">
          {{ data.confirmed ? "Confirmé" : "En attente" }}
        </template>

        <template #actions="{ data }">
          <ui-icon @click="show(data.id)" role="button"> edit </ui-icon>
        </template>

        <!-- 
        <ui-pagination
          v-model="page"
          :total="10"
          show-total
          @update:model-value="onPage"
        ></ui-pagination>
        -->
      </ui-table>
    </div>

    <div v-if="error">{{ error }}</div>

    <!-- Pagination Control -->
    <div class="pagination mb-3">
      <button
        class="btn btn-secondary"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Précédent
      </button>
      <span v-if="!route.params.slug"
        >Page {{ currentPage }} sur {{ totalPages }}</span
      >
      <button
        class="btn btn-secondary"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  margin: 0 10px;
  padding: 5px 10px;
}
</style>
