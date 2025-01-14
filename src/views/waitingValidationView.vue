<script setup>
// import { useNavigation } from "@/composables/useNavigation";
import { useUpdateRequest } from "@/services/useUpdateRequest";
import { useCompanies } from "@/services/useCompanies";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";
import { EventBus } from "@/utils/eventBus";
import { watch } from "vue";
import { onBeforeMount /*ref*/ } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useGlobalStore } from "@/stores/globalStore";

const userStore = useUserStore();
const route = useRoute();
const isSuccess = ref(false);
const request = ref({
  status: "",
  confirmed: "",
});

const { publicDir } = useGlobalStore();
const { showCompany, company } = useCompanies();
const company_slug = ref(localStorage.getItem("currentCompany"));
const { isLoading, error, uidn, updateRequest } = useUpdateRequest();

const router = useRouter();
const goToMenu = () => {

  router.push({
    name: "Menu",
    params: {
      domain: domain.value,
      id: route.params.id,
    },
  });

};

const isAuthenticated = userStore.isAuthenticated();
const submitForm = async (state) => {
  request.value.status = state;
  request.value.confirmed = state;

  try {
    await updateRequest(route.params.id, request.value); // Remplacez 1 par l'ID réel de la demande
    toast.success("Mise à jour éffectué");
    isSuccess.value = true;
  } catch (err) {
    console.log(error);
    console.error("Failed to update request:", err);
  }
};

const domain = ref(route.params.domain || "scb");
onMounted(() => {
  if (domain.value) {
    router.push({
      name: "WaitingValidation",
      params: {
        domain: domain.value,
      },
    });
  }
});

onBeforeMount(async () => {
  // Extraire l'hôte (domaine + port)
  console.log("Host:", window.location.host);
  // Extraire le chemin (path)
  console.log("Path:", window.location.pathname);

  if (window.location.pathname != "/sign-in") {
    if (company_slug.value) {
      await showCompany(company_slug.value);
    } else {
      company_slug.value = "";
    }
  }
});



// const distantData = ref();
watch(
  () => EventBus["company_slug"],
  async (newValue) => {
    await showCompany(localStorage.getItem("currentCompany") ?? newValue);
  }
);
</script>

<template>
  <section class="background-gradi request-meeting test12333">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">


          <div class="popup-logo with_scan_cls" v-if="isSuccess">
            <router-link 
              :to="{ name: 'RequestMeeting', params: { domain: domain } }"
            >
            <img
                class="logo logo12333"
                :src="`${publicDir}/logo/${company?.logo}`"
                :alt="company?.logo"
            />
            </router-link>
            <router-link to="/">
              <img
                :src="`${publicDir}/qrcode/qrcode-${uidn}.png`"
                class=""
                alt="secure-check-logo"
              />
            </router-link>

            <div class="text-center py-2">
              <h3>{{ uidn }}</h3>
              <!-- <h3>QRCode Généré</h3> -->
            </div>

            <div
              class="request-btn"
              @click="goToMenu()"
              v-if="isAuthenticated"
              role="button"
            >
              <a>Menu </a>
            </div>

            <div v-else>
              <h3>Votre QRCode a été envoyé par e-mail, Merci</h3>
            </div>
          </div>

          <div v-if="!isSuccess">
            <div class="d-flex justify-content-center align-items-center">
              <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
                  <button class="back" @click="goToMenu"> Retour </button>
                  <h3 style="display:block ruby" class="text-center py-3">  En attente de la confirmation de l'hôte ... </h3>
              </div>
            </div>
            <div
              class="request-btn"
              @click.prevent="submitForm(1)"
              v-if="!isLoading"
            >
              <a>Valider </a>
            </div>

            <div class="text-center" v-else>
              <h3>Chargement .....</h3>
            </div>

            <div class="request-btn-cannel" @click.prevent="submitForm(0)">
              <a>Annuler </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.request-btn-cannel {
  margin: 10px auto 0px auto;
  display: inline-block;
  text-align: center;
  width: 100%;
}
.request-btn-cannel a {
  background: #b92b00;
  color: #ffffff;
  border-radius: 10px;
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}

.request-btn a {
  /*background: #b92b00;*/
  color: #ffffff;
  border-radius: 10px;
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}

.request-btn-cannel a:hover {
  background: #000000;
  color: #ffffff;
}
.popup-logo.with_scan_cls {
	background: #37bbf0 ! IMPORTANT;
	position: unset ! IMPORTANT;
	transform: unset ! IMPORTANT;
	padding: 40px 20px !important;
	border-radius: 15px;
}
.popup-logo.with_scan_cls img {
	border-radius: 12px;
	margin-top: 20px;
}
</style>
