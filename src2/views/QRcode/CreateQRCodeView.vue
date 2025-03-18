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

// const { showCompany, company } = useCompanies();
const { showCompany } = useCompanies();
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
const title = ref(); 
const uidn = ref();   
const { createQR, statusCode,qrResponse} = useCreateQR();

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
      name: "CreateQRCode",
      params: {
        domain: domain.value,
      },
    });
  }
});

const submit = async () => {
  await createQR(email.value, type.value , firstname.value , lastname.value , contact.value , title.value);
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
  <section class="background-gradi request-meeting qr_form">
    <div class="container">
      <div class="row align-items-center mt-3">
        <div class="col col-12 col-md-12 col-sm-12 qr_form_main">
          <div v-if="!isSuccess">
            <div class="box12" style="display: flex;">
              <button @click="goToMenu" class="back">Retour</button>
              <h3 class="text-center">Création QRCode</h3>
            </div>
           
            <form @submit.prevent="submit" class="mt-5">
              <div>
                <label for="firstname">First Name </label><br />
                <input type="text" id="firstname" v-model="firstname" class="input_style" /><br />
              </div>

              <div>
                <label for="lastname">Last Name </label><br />
                <input type="text" id="lastname" v-model="lastname" class="input_style" /><br />
              </div>

              <div>
                <label for="contact">Contact</label><br />
                <input type="text" id="contact" v-model="contact" class="input_style" /><br />
              </div>

              <div>
                <label for="email">Email</label><br />
                <input type="email" id="email" v-model="email" class="input_style" /><br />
              </div>

              <div>
                <label for="title">Title</label><br />
                <input type="text" id="title" v-model="title" class="input_style" /><br />
              </div>
              
              <div>
                <label for="type_qr">QR Type</label><br />
                <select v-model="type" id="type_qr" class="input_style">
                  <option value="permanent">Permanent</option>
                  <option value="temporaire">Temporaire</option>
                </select><br />
              </div>

              <div class="bt_bottom" style="margin-top:40px;">
                <div class="submit-button">
                  <input type="submit" value="Soumettre" :disabled="loading" />
                </div>
              </div>
            </form>
          </div>

          <!-- Show QR Code and User Details After Submission -->
          <div v-if="isSuccess" class="text-center create-qr_section">
            <div class="button_text">
              <button @click="goToMenu" class="back">Retour</button>
            </div>
          
            <div class="user-details">
              <p><strong>Name</strong> {{ firstname }} {{ lastname }}</p>
              <p><strong>Email:</strong> {{ email }}</p>
              <p><strong>Contact:</strong> {{ contact }}</p>
              <p><strong>Title:</strong> {{ title }}</p>
              <p><strong>Type de QR:</strong> {{ type }}</p>
            </div>
            <img :src="`${publicDir}/qrcode-user/qrcode-${uidn}.png`" alt="QR Code" />
            <h3>{{ uidn }}</h3>
            <h3>Le QRCode a été envoyé par e-mail, Merci</h3>
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



.qr_form_main {
    position: unset !important;
    transform: unset !IMPORTANT;
    max-width: 700px  !IMPORTANT;
}
.qr_form_main h3.text-center {
    margin-left: 20px;
    margin-bottom: 0;
}
.qr_form_main 
 form.mt-5 {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}
.qr_form_main form.mt-5 > div {text-align: left;width: 48%;}
.qr_form {
    margin: 20px 0px 40px 0px;
}
.create-qr_section {
    background: #37bbf0 !important;
    padding: 40px 20px !important;
    border-radius: 12px;
}
.create-qr_section .user-details {
    text-align: left;
    padding: 30px 0px;
}
.create-qr_section .user-details p {
    color: #ffffff;
    font-size: 18px;
}
.create-qr_section img {
    max-width: 300px !important;
    border-radius: 12px;
    margin-bottom: 15px;
}
.create-qr_section h3 {
    color: #fff;
    font-size: 20px;
    margin: 0;
}
.button_text {
    text-align: left;
}
.button_text button.back {
    background: #000;
    border: none;
}
.create-qr_section .user-details p strong {
    display: block;
}

@media(max-width: 680px){
  .create-qr_section img {
    max-width: 100% !important;
}
.qr_form_main {
    padding: 0 !important;
}
.qr_form_main form.mt-5 > div {
    width: 47% !important;
}
.qr_form_main form.mt-5 .bt_bottom {
    width: auto ! IMPORTANT;
}

}
</style>
