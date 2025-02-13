<script setup>
import { useCreateQR } from "@/services/useCreateQR";
import { useGlobalStore } from "@/stores/globalStore";
import { useCompanies } from "@/services/useCompanies";
import { watch } from "vue";
import { onBeforeMount /*ref*/ } from "vue";
import { EventBus } from "@/utils/eventBus";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";

const { showCompany, company } = useCompanies();
const company_slug = ref(localStorage.getItem("currentCompany"));
const route = useRoute();
const router = useRouter();
const isSuccess = ref(false);
const {publicDir} = useGlobalStore();
const email = ref();
const type = ref();
const firstname = ref();    
const lastname = ref();  
const contact = ref(); 
const uidn = ref();   
const { createQR, statusCode,qrResponse} = useCreateQR();

const domain = ref(route.params.domain || "scb-systems-africa");
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
      name: "CreateQRCode",
      params: {
        domain: domain.value,
      },
    });
  }
});

const submit = async () => {
  await createQR(email.value, type.value , firstname.value , lastname.value , contact.value);
};

watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
      toast.success(" QRCode a créé avec succès.");
      statusCode.value = 200;
      isSuccess.value = true;
      console.log({qrResponse})
      uidn.value = qrResponse.value.data.uidn;
      break;
    case 201:
      toast.success("QRCode a créé avec succès.");
      statusCode.value = 201;
      console.log({qrResponse})
      uidn.value = qrResponse.value.data.uidn;

      // setTimeout(() => {
      //   router.push({
      //     name: "Menu",
      //     params: {
      //       domain: domain.value ?? localStorage.getItem("currentCompany"),
      //     },
      //   });
      // }, 1400);
    
      break;
    case 400:
      toast.info("Bad Request - La requête est mal formée.");
      break;
    case 401:
      toast.info("Unauthorized - Vous devez être authentifié.");
      break;
    case 403:
      toast.info("Forbidden - Vous n'avez pas la permission.");
      break;
    case 404:
      toast.info("L'utilisateur n'existe pas");
      statusCode.value = null;
      break;
    case 500:
      toast.info("Internal Server Error - Une erreur interne est survenue.");
      break;
    default:
    // toast.info(`Erreur inconnue - Code : ${newStatus}`);
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
      <div class="row align-items-center mt-3">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo" v-if="!isSuccess">
            <router-link to="/">
              <img
                class="logo logo123"
                :src="`${publicDir}/logo/${company?.logo}`"
                :alt="company?.logo"
            /></router-link>
          </div>
          <div data-v-74f17804="" style="margin-top: 30px;" class="d-flex justify-content-center align-items-center">
            <div data-v-74f17804="" class="d-flex justify-content-start mb-4 gap-3 align-items-center">
              <button class="back" @click="goToMenu"> Retour </button>
              <h3 data-v-74f17804="" class="text-center"> Création QRCode </h3>
            </div>
          </div>

          <div class="popup-logo">
            <router-link to="/" v-if="isSuccess">
              <img
                :src="`${publicDir}/qrcode-user/qrcode-${uidn}.png`"
                class=""
                alt="qr"
              />
            </router-link>

            <form @submit.prevent="submit" class="mt-5">

              <div>
                <label for="firstname">First Name </label><br />
                <input
                  type="text"
                  id="firstname"
                  v-model="firstname"
                  class="input_style"
                /><br />
              </div>

              <div>
                <label for="lastname">last Name </label><br />
                <input
                  type="text"
                  id="lastname"
                  v-model="lastname"
                  class="input_style"
                /><br />
              </div>

              <div>
                <label for="contact">Contact</label><br />
                <input
                  type="text"
                  id="contact"
                  v-model="contact"
                  class="input_style"
                /><br />
              </div>

              <div>
                <label for="contact">Email</label><br />
                <input
                  type="text"
                  id="contact"
                  v-model="email"
                  class="input_style"
                /><br />
              </div>

              <div>
                <label for="type_qr">Type de QR</label><br />
                <select
                  v-model="type"
                  id="type_qr"
                  name="type_qr"
                  class="input_style"
                >
                  <option value="permanent">Permanent</option>
                  <option value="temporaire">Temporaire</option></select
                ><br />
              </div>
              
              <div style="margin-top:40px;">
                <div class="submit-button">
                  <input type="submit" value="Soumettre" :disabled="loading" />
                </div>
              </div>

            </form> 

            <div
              class="request-btn"
              @click="goToMenu()"
              v-if="isAuthenticated"
              role="button"
            >
              <a>Menu </a>
            </div>

            <div v-if="isSuccess" style="margin-top:40px;">
              <h3>Le QRCode a été envoyé par e-mail, Merci</h3>
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

.submit-button input {
  background: #0097b9;
  color: #ffffff;
  border-radius: 10px;
  padding: 10px 60px !important;
  font-weight: 600;
  margin: 0 auto;
  font-size: 20px;
  border: 0 !important;
  height: auto;
  width: 100%;
}

.input_style {
  float: left;
  width: 100%;
  font-size: 16px;
  color: #000000;
  font-weight: 500;
  font-family: "Futura Std";
  height: 40px;
  border-radius: 5px;
  border: 1px solid #000000 !important;
  outline: none;
  padding: 4px 10px;
}
</style>
