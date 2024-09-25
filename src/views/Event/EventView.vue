<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useCompanies } from "@/services/useCompanies";
import { useEvent } from "@/services/useEvent";
import { useDepartement } from "@/services/useDepartement";
import { useGlobalStore } from "@/stores/globalStore";

const { fetchCompanies, showCompany, errorMessage, companies, company } =
  useCompanies();
const { createEvent, statusCode } = useEvent();
const { departements, fetchDepartements } = useDepartement();
const { publicDir } = useGlobalStore();

const userStore = useUserStore();
const isAuthenticated = userStore.isAuthenticated();

const router = useRouter();
const loading = ref(false);

const onChangeCompany = async (id) => {
  await showCompany(id);
  console.log({ company });
};

const event = ref({
  company_id: "",
  name: "",
  location: "",
  date_event: "",
  time_event: "",
  departement_id: "",
});

const submitForm = async () => {
  try {
    await createEvent(event.value);
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

onBeforeMount(async () => {
  await fetchCompanies();
  await fetchDepartements();

  if (!isAuthenticated) {
    toast.info("L'utilisateur doit être connecté");

    setTimeout(() => {
      router.push("/");
    }, 1500);
  }
});

// watch(event.value.company_id, async (newId) => {
//   await showCompany(newId);
//   console.log({ company });
// });

watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 201:
      toast.success("Evénements ajouté");

      setTimeout(() => {
        router.push("/menu");
      }, 1500);

      break;
    case 200:
      toast.success("Evénements ajouté");

      setTimeout(() => {
        router.push("/menu");
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
              <div
                class="d-flex justify-content-start mb-4 gap-3 align-items-center"
              >
                <button class="back" @click="router.push('/menu')">
                  Retour
                </button>
                <h3 class="mt-3">Création Évènement</h3>
              </div>
            </div>

            <div class="d-flex justify-content-center" v-if="company?.logo">
              <!-- {{ company }} -->
              <!-- {{ `${publicDir}/logo/${company?.logo}` }} -->

              <img
                :src="`${publicDir}/logo/${company?.logo}`"
                height="100"
                width="100"
              />
            </div>

            <form @submit.prevent="submitForm">

              <div>
                <label for="company_id">Entreprise</label><br />

                <select
                  class="form-control"
                  id="company_id"
                  v-model.lazy="event.company_id"
                  @change="onChangeCompany(event.company_id)"
                >
                  <option
                    v-for="(company, index) in companies"
                    :key="index"
                    :value="company.id"
                  >
                    {{ company.name }}
                  </option>
                </select>
              </div>

              <div>
                <label for="name">Nom de l'événement</label><br />
                <input
                  type="text"
                  id="name"
                  v-model="event.name"
                  value="Diner Gala SIKIHHK"
                  required
                /><br />
              </div>

              <div>
                <label for="location">Lieu de l'événement</label><br />
                <input
                  type="text"
                  id="location"
                  v-model="event.location"
                  value="Palace hotel"
                  required
                /><br />
              </div>

              <div>
                <label for="date_event">Date de l'événement</label><br />
                <input
                  type="date"
                  id="date_event"
                  v-model="event.date_event"
                  value="2024-10-08"
                  required
                /><br />
              </div>

              <div>
                <label for="time_event">Heure de l'événement</label><br />
                <input
                  type="time"
                  id="time_event"
                  v-model="event.time_event"
                  value="14:30"
                  required
                /><br />
              </div>

              <div>
                <label for="departement_id">Département</label><br />
                <select
                  class="form-control"
                  id="company_id"
                  v-model="event.departement_id"
                >
                  <option
                    v-for="(departement, index) in departements"
                    :key="index"
                    :value="departement.id"
                  >
                    {{ departement.name }}
                  </option>
                </select>
              </div>

              <div class="submit-button">
                <input type="submit" value="Soumettre" :disabled="loading" />
              </div>

              <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
              
            </form>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
