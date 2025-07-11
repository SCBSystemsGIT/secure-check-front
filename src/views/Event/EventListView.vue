<script setup>
import { useDate } from "@/composables/useDate";
import { useEventList } from "@/services/useEventList";
import { useGlobalStore } from "@/stores/globalStore";
import { useUserStore } from "@/stores/useUserStore";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

// Importation des données depuis les services et composables
// const { events, loading, error, fetchEventsByComp, fetchEvents, deleteEvent } =
//   useEventList();
const { events, loading, error, fetchEventsByComp, fetchEvents } =
  useEventList();
const { formatDate, formatTime } = useDate();
const { publicDir } = useGlobalStore();


const roles = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
const userStore = useUserStore();
const currentRole = ref(roles?.value?.roles ? roles.value.roles[0] : "");

// Définitions des colonnes pour le tableau
const thead = ref([
  "ID",
  "Entreprise",
  "Nom",
  "Lieu",
  "Date",
  "Heure",
  "Date de Création",
  "Lien",
  "Participants",
  "QRCode",
  // (currentRole.value === "ROLE_ADMIN" ? "Delete" : ""),
]);

// Correspondance des propriétés de l'utilisateur
const tbody = ref([
  "id",
  { slot: "company" },
  "name",
  "location",
  { slot: "date_event" },
  { slot: "time_event" },
  { slot: "created_at" },
  { slot: "link" },
  { slot: "participants" },
  { slot: "QRCode" },
  // (currentRole.value === "ROLE_ADMIN" ? "Delete" : ""),
]);

// const open = ref(true);
const visitorsList = ref([]);
const showUserEvent = ref(false);

const router = useRouter();
const route = useRoute();
const domain = ref(route.params.domain || "scb");

const showVisitors = (slug) => {
  router.push({
    name: "ListQrcodeEvents",
    params: { domain: domain.value, slug },
  });
};

const showEventQR = (slug) => {
  console.log({
    domain: domain.value,
    slug: slug,
  });

  router.push({
    name: "ShowEventQRcode",
    params: {
      domain: domain.value,
      slug: slug,
    },
  });
};

// Fonction pour gérer le retour à la liste des événements
// const retour = () => {
//   showUserEvent.value = false;
//   router.push({ name: "ListEvents", params: { domain: domain.value } });
// };

// Fonction pour copier le lien dans le presse-papiers
const copyContent = (dataLink) => {
  const copied = ref(false);
  let host = process.env.FRONT_URL ?? window.location.host;
  // let lien = `${host}/company/${dataLink.company.slug}/event/${dataLink.slug}`;
  let lien = `https://${host}/company/${dataLink.company.slug}/event/${dataLink.slug}`;
  

  navigator.clipboard
    .writeText(lien)
    .then(() => {
      copied.value = true; // Afficher un message de confirmation
      toast.info("Texte Copié");

      // Réinitialiser le message après 2 secondes
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    })
    .catch((err) => {
      console.error("Échec de la copie : ", err);
    });
};

// const goToMenu = () => {
//   router.push({
//     name: "Menu",
//     params: {
//       domain: domain.value,
//     },
//   });
// };

// const handleDelete = async (eventId, eventName) => {
//   const isConfirmed = confirm(`Are you sure you want to delete ${eventName}?`);
//   if (!isConfirmed) return;

//   await toast.promise(
//     deleteEvent(eventId), // Async delete function
//     {
//       pending: `Deleting ${eventName}...`,
//       success: `User ${eventName} deleted successfully!`,
//       error: `Failed to delete ${eventName}.`,
//     },
//     {
//       position: toast.POSITION.TOP_CENTER,
//       autoClose: 3000,
//       closeButton: true,
//     }
//   );
  
//   // Refresh the page after successful deletion
//   await fetchEvents();
// };


onMounted(() => {
  
  if (userStore.isAdmin(currentRole.value) || userStore.isSecureCheck(currentRole.value)) {
    fetchEvents();
  } else {
    fetchEventsByComp(domain.value);
  }
  // if (!userStore.isAdmin(currentRole.value)) {
  // alert("no");
  // }

  if (domain.value) {
    router.push({
      name: "EventList",
      params: {
        domain: domain.value,
      },
    });
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
        <!-- <button class="back" @click="goToMenu()">Retour</button> -->
        <h3 class="text-center">Liste des Evenements</h3>
      </div>
    </div>

    <div v-if="showUserEvent">
      <div class="d-flex justify-content-center">
        <ui-list>
          <ui-item v-for="i in visitorsList" :key="i">
            <ui-item-text-content>{{ i.email }}</ui-item-text-content>
          </ui-item>
        </ui-list>
      </div>

      <div class="d-flex justify-content-center">
        <a class="request-btn" @click="retour" role="button"> Retour </a>
      </div>
    </div>

    <div class="d-flex justify-content-center py-3" v-if="!showUserEvent">
      <ui-table :data="events" :thead="thead" :tbody="tbody">

        <template #date_event="{ data }">
          {{ formatDate(data.date_event) }}
        </template>

        <template #time_event="{ data }">
          {{ formatTime(data.time_event) }}
        </template>

        <template #company="{ data }">
          {{ data.company.name }}
        </template>

        <template #created_at="{ data }">
          {{ formatDate(data.created_at) }}
        </template>

        <template #link="{ data }">
          <ui-icon role="button" @click="copyContent(data)">
            content_copy
          </ui-icon>
        </template>

        <template #participants="{ data }">
          <ui-icon role="button" @click="showVisitors(data.slug)">
            groups
          </ui-icon>
        </template>

        <template #QRCode="{ data }">
          <!-- <ui-icon role="button"> -->
          <!-- {{ `${publicDir}/qrcode-link/qrcode-${data.slug}.png` }}   -->
          <!-- :to="`/${domain}/show-event-qrcode/${data?.slug}`" -->

          <!-- <router-link v-if="data?.slug != ''"> -->
          <img
            v-if="data?.slug"
            role="button"
            @click="showEventQR(data?.slug)"
            :src="`${publicDir}/qrcode-link/qrcode-${data?.slug}.png`"
            class=""
            height="50"
            width="50"
            style="margin-top: 20px; margin-bottom: 20px"
            :alt="data.slug"
          />
          <!-- </router-link> -->

          <p v-else>Pas de QRcode</p>
          <!-- </ui-icon> -->
        </template>
        <!-- <template #delete="{ data }" v-if="currentRole === 'ROLE_ADMIN'">
          <ui-icon role="button" @click="handleDelete(data.id , data.departement.name)">delete</ui-icon>
        </template> -->
      </ui-table>
    </div>

    <div v-if="loading" class="d-flex justify-content-center">
      Chargement des évènements...
    </div>

    <div v-if="error" class="d-flex justify-content-center">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
a {
  color: #000;
  border-radius: 10px;
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}
button {
  margin: 0 10px;
  padding: 5px 10px;
}
</style>
