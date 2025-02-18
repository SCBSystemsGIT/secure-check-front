<script setup>
import { onMounted, onBeforeMount, ref, watch } from "vue";

import { useUserStore } from "@/stores/useUserStore";
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from "vue-router";
import { useCompanies } from "@/services/useCompanies";
import { useEvent } from "@/services/useEvent";
import { useGlobalStore } from "@/stores/globalStore";

const { company } = useGlobalStore();
const { showCompany, companies, fetchCompanies } = useCompanies();
const { createEvent, statusCode } = useEvent();
const { publicDir } = useGlobalStore();
const userStore = useUserStore();

const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const isAuthenticated = userStore.isAuthenticated();

const domain = ref(route.params.domain || "scb-systems-africa");

// Retrieve user info
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const currentRole = ref(userInfo?.roles?.[0] || "");
const userCompanyId = ref(userInfo?.company_id || "");
const userCompanyName = ref(userInfo?.company || "");

// Initialize event object
const event = ref({
  company_id: currentRole.value === "ROLE_SUPERVISOR" ? userCompanyId.value : "",
  name: "",
  location: "",
  date_event: "",
  time_event: "14:30",
  departement_id: 1,
});

// Ensure the correct `company_id` is assigned when role is ROLE_SUPERVISOR
watch(userCompanyId, (newVal) => {
  if (currentRole.value === "ROLE_SUPERVISOR") {
    event.value.company_id = newVal;
  }
});

// Fetch company data on mount
onMounted(async () => {
  await fetchCompanies();
});

// Load company info on before mount
onBeforeMount(async () => {
  try {
    let company_slug = localStorage.getItem("currentCompany") ?? domain?.value;
    if (company_slug) {
      await showCompany(company_slug);
    }

    if (!isAuthenticated) {
      toast.info("L'utilisateur doit être connecté");
      setTimeout(() => {
        router.push({
          name: "RequestMeeting",
          params: { domain: domain?.value },
        });
      }, 1500);
    }
  } catch (error) {
    console.error("Error during onBeforeMount:", error);
    toast.error("Erreur lors du chargement des données.");
  }
});

// Form submission
const submitForm = async () => {
  loading.value = true;
  try {
    await createEvent(event.value);
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

// Watch API response status
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
    case 201:
      toast.success("Événement ajouté");
      setTimeout(() => {
        router.push({ name: "Menu", params: { domain: domain.value } });
      }, 1500);
      break;
    case 400:
      toast.info("La requête est mal formée.");
      break;
    case 401:
      toast.info("Vous devez être authentifié.");
      break;
    case 403:
      toast.info("Vous n'avez pas la permission.");
      break;
    case 404:
      toast.info("La ressource demandée n'existe pas.");
      break;
    case 500:
      toast.info("Une erreur interne est survenue.");
      break;
    default:
      toast.info(`Code : ${newStatus}`);
  }
});
</script>

<template>
  <section class="request-meeting">
    <div class="background-gradi">
      <section class="request-meeting meeting-form">
        <div class="row align-items-center">
          <div class="col col-12 col-md-12 col-sm-12">
            <div class="d-flex justify-content-center align-items-center">
              <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
                <button class="back" @click="router.push({ name: 'Menu', params: { domain } })">
                  Retour
                </button>
                <h3 class="mt-3">Création Événement</h3>
              </div>
            </div>

            <!-- Company Logo -->
            <div class="d-flex justify-content-center" v-if="company?.logo">
              <img :src="`${publicDir}/logo/${company?.logo}`" height="100" width="100" />
            </div>

            <form @submit.prevent="submitForm">
              <!-- Company Selection -->
              <div>
                <label for="company_id">Entreprise</label><br />
                <input
                  v-if="currentRole === 'ROLE_SUPERVISOR'"
                  disabled
                  type="text"
                  id="company_name"
                  v-model="userCompanyName"
                  required
                /><br />
                <input
                  v-if="currentRole === 'ROLE_SUPERVISOR'"
                  type="hidden"
                  id="company_id"
                  name="company_id"
                  v-model="event.company_id"
                />
                <select
                  v-if="currentRole !== 'ROLE_SUPERVISOR'"
                  id="company_id"
                  v-model="event.company_id"
                  class="form-control"
                >
                  <option v-for="company in companies" :key="company.id" :value="company.id">
                    {{ company.name }}
                  </option>
                </select>
              </div>

              <!-- Event Name -->
              <div>
                <label for="name">Nom de l'événement</label><br />
                <input type="text" id="name" v-model="event.name" placeholder="Diner Gala SIKIHHK" required /><br />
              </div>

              <!-- Event Location -->
              <div>
                <label for="location">Lieu de l'événement</label><br />
                <input type="text" id="location" v-model="event.location" placeholder="SOCOCE" required /><br />
              </div>

              <!-- Address -->
              <div>
                <label for="address_name">Adresse</label><br />
                <input type="text" id="address_name" v-model="event.address_name" placeholder="Marcory" required /><br />
              </div>

              <!-- Event Date -->
              <div>
                <label for="date_event">Date de l'événement</label><br />
                <input type="date" id="date_event" v-model="event.date_event" required /><br />
              </div>

              <!-- Event Time -->
              <div>
                <label for="time_event">Heure de l'événement</label><br />
                <input type="time" id="time_event" v-model="event.time_event" required /><br />
              </div>

              <!-- Submit Button -->
              <div class="submit-button">
                <input type="submit" value="Soumettre" :disabled="loading" />
              </div>

              <!-- Error Message -->
              <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
