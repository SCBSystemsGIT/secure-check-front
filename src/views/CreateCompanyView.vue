<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { useUserInfo } from "@/services/useUserInfo";
import { toast } from "vue3-toastify";
import { /*useRoute,*/ useRouter } from "vue-router";
import { useCompanies } from "@/services/useCompanies";

const currentRole = ref();
const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value?.roles[0];

const { userInfo, fetchUserInfo } = useUserInfo();
const { postCompany, company, statusCode } = useCompanies();

const userStore = useUserStore();
const isAuthenticated = userStore.isAuthenticated();

const router = useRouter();
// const route = useRoute();

const companyReq = ref({
  name: "",
  description: "",
});

const errorMessage = ref("");
const loading = ref(false);

const submitForm = async () => {
  try {
    await postCompany(companyReq.value);
    console.log(company);
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

onBeforeMount(async () => {
  //   if (route.params.slug) {
  //     await showEvent(route.params.slug);
  //     title.value = event.value.name;
  //   }

  await fetchUserInfo();
  console.log({ userInfo });
});

// Watcher pour réagir aux changements du statusCode
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 201:
      toast.success("Entreprise créé avec succès.");
      setTimeout(() => {
        router.push("/menu");
      }, 1500);

      break;
    case 200:
      toast.success("Entreprise créé avec succès.");
      setTimeout(() => {
        router.push("/menu");
      }, 1500);

      break;
    case 400:
      toast.info("La requête est mal formée.");
      break;
    case 401:
      toast.info("Vous devez être authentifié.");

      setTimeout(() => {
        router.push("/");
      }, 1500);

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
            <form @submit.prevent="submitForm">
              <div>
                <label for="lastname">Nom</label><br />
                <input
                  type="text"
                  id="lastname"
                  v-model="companyReq.name"
                  required
                /><br />
              </div>

              <div>
                <label for="email">Description </label><br />
                <input
                  type="email"
                  id="email"
                  v-model="companyReq.description"
                  required
                /><br />
              </div>

              <div class="submit-button" v-if="isAuthenticated">
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
