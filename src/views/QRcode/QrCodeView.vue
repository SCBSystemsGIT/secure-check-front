<script setup>
// import { useQrCode } from "@/services/useManualCheck";
import { /*defineProps,*/ onMounted, ref } from "vue";
import { watch } from "vue";
import { onBeforeMount /*ref*/ } from "vue";
import { EventBus } from "@/utils/eventBus";
import { useCompanies } from "@/services/useCompanies";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const isSuccess = ref(false);
// const { getQrData, status } = useQrCode();
// const props = defineProps({
//   uidn: String,
// });

const { showCompany, company } = useCompanies();
const company_slug = ref(localStorage.getItem("currentCompany"));
const domain = ref(route.params.domain || "scb");
const goToMenu = () => {
  router.push({
    name: "Menu",
    params: {
      domain: domain.value,
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
          <div class="popup-logo" v-if="!isSuccess">
            <router-link to="/">
              <img
                class="logo logo12333"
                :src="`${publicDir}/logo/${company?.logo}`"
                :alt="company?.logo"
            /></router-link>
          </div>

          <div class="popup-logo" v-if="isSuccess">

            <router-link to="/">
              <img
                :src="`${publicDir}/qrcode/qrcode-${uidn}.png`"
                class=""
                alt="secure-check-logo"
              />
            </router-link>

            <div class="text-center py-2">
              <h3>{{ uidn }}</h3>
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
