<script setup>
import { useNavigation } from "@/composables/useNavigation";
import { useCompanies } from "@/services/useCompanies";
// import { useGlobalStore } from "@/stores/globalStore";
import { EventBus } from "@/utils/eventBus";
import { watch } from "vue";
import { onBeforeMount /*ref*/ } from "vue";
import { useQrCode } from "@/services/useManualCheck";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
// import { toast } from "vue3-toastify";

// const { publicDir } = useGlobalStore();
// const { showCompany, company } = useCompanies();
const { showCompany } = useCompanies();

const company_slug = ref(localStorage.getItem("currentCompany"));
const route = useRoute();
const router = useRouter();
const isSuccess = ref(false);
const { goToRoute } = useNavigation();
const { getQrData, status } = useQrCode();
const uidn = ref();

const submitForm = async () => {
  try {
    await getQrData(uidn.value, 1);
    isSuccess.value = status.value == 200 ? true : false;
    // toast.success("Mise à jour éffectué");
    console.log(route);
  } catch (err) {
    console.error("Failed to update request:", err);
  }
};

const domain = ref(route.params.domain || "scb-systems-africa");
const goToMenu = () => {
  router.push({
    name: "Menu",
    params: {
      domain: domain.value
    },
  });
};

onMounted(() => {
  if (domain.value) {
    router.push({
      name: "ManalCheck",
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
  <section class="background-gradi request-meeting">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <!-- <div class="popup-logo" v-if="!isSuccess">
            <router-link to="/">
              <img
                class="logo logo12333"
                :src="`${publicDir}/logo/${company?.logo}`"
                :alt="company?.logo"
            /></router-link>
          </div> -->

          <div class="popup-logo" v-if="isSuccess">
            <div class="text-center py-2">
              <h3>Bien éffectué</h3>
            </div>

            <div class="request-btn" @click="goToRoute('/')">
              <a>Accueil </a>
            </div>
          </div>

          <div v-if="!isSuccess">
            <div class="d-flex justify-content-center align-items-center">
              <div
                class="d-flex justify-content-start mb-4 gap-3 align-items-center"
              >
                <button class="back" @click="goToMenu">
                  Retour
                </button>
                <h3 class="text-center py-3">Validation Manuelle UIDN</h3>
              </div>
            </div>

            <input
              type="text"
              name="uidn"
              id="uidn"
              class="uidn"
              v-model="uidn"
              placeholder="ENTREZ UUID"
              required
            />

            <div
              class="request-btn"
              @click.prevent="submitForm()"
              v-if="!isLoading"
            >
              <a role="button">Valider </a>
            </div>

            <div class="request-btn" @click="goToMenu()">
              <a role="button">Menu </a>
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

.uidn {
  border-radius: 10px;
  padding: 20px 100px;
  text-transform: uppercase;
}
</style>
