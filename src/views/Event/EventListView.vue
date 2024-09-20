<script setup>
import { useDate } from "@/composables/useDate";
import { useEventList } from "@/services/useEventList";
import {
  ref,
  // watch
} from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const { events, loading, error } = useEventList();
const { formatDate, /*formatDateHour*/ formatTime } = useDate();


// Définitions des colonnes pour le tableau
const thead = ref([
  "ID",
  "Entreprise",
  "Nom",
  "Lieu",
  "Date",
  "Heure",
  "Département",
  "Date de Création",
  "Lien",
  "Visiteurs",
]);

// Correspondance des propriétés de l'utilisateur
const tbody = ref([
  "id",
  { slot: "company" },
  "name",
  "location",
  { slot: "date_event" },
  { slot: "time_event" },
  { slot: "departement" },
  { slot: "created_at" },
  { slot: "link" },
  { slot: "visiteurs" },
]);

// Gestion de la pagination
// const page = ref(1);
// const total = ref(0);

// const onPage = (newPage) => {
// page.value = newPage;
// Appeler une méthode pour charger les données de la page spécifique
// };

// watch(page, (newPage) => {
// Logique pour charger les données basées sur la page
// console.log("Page actuelle : ", newPage);
// });

open.value = ref(true);
const visitorsList = ref([]);
const showUserEvent = ref(false);

const showVisitors = (visitors, id) => {

  router.push('list-qrcode-events/'+id);

  // console.log(visitors);
  // showUserEvent.value = true;
  // visitorsList.value = visitors;

  // console.log({ visitorsList });
};

const router = useRouter();
const retour = () => {
  showUserEvent.value = false;
  router.push("/list-events");
};

const copyContent = (dataLink) => {
  const copied = ref(false);
  let host = process.env.FRONT_URL ?? window.location.host;
  let lien = `${host}/company/${dataLink.company.slug}/event/${dataLink.slug}`;

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
</script>

<template>
  <div class="container">
    <h3 class="text-center">Liste des Evenements</h3>

    <div v-if="showUserEvent">
      <!-- <div class="text-center"></div> -->
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
        <!-- Utilisation d'un slot personnalisé pour formater la date -->
        <template #departement="{ data }">
          {{ data.departement.name }}
        </template>

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

        <template #visiteurs="{ data }">
          <ui-icon role="button" @click="showVisitors(data.visitors, data.id)">
            groups
          </ui-icon>
        </template>
      </ui-table>
    </div>

    <div v-if="loading" class="d-flex justify-content-center">
      Chargement des évènements...
    </div>

    <div v-if="error" class="d-flex justify-content-center">
      {{ error }}
    </div>

    <!-- Pagination ajoutée ici -->
    <!-- <ui-pagination
      v-model="page"
      :total="total"
      show-total
      @update:model-value="onPage"
    ></ui-pagination> -->
  </div>
</template>

<style scoped>
a {
  /*background: #b92b00;*/
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
</style>
