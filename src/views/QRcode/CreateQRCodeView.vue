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
import html2canvas from "html2canvas";

// const { showCompany, company } = useCompanies();
// const { showCompany , companies ,fetchCompanies  , company} = useCompanies();
const { showCompany , companies ,fetchCompanies 

 } = useCompanies();
const company_slug = ref(localStorage.getItem("currentCompany"));
const route = useRoute();
const router = useRouter();
const isSuccess = ref(false);
const { publicDir } = useGlobalStore();
const email = ref();
const type = ref();
const firstname = ref();
const lastname = ref();
const contact = ref();
const title = ref();
const dateExp = ref();
const company_id = ref();
const uidn = ref();
const capture = ref(null);
const image = ref(null);
const { createQR, statusCode, qrResponse } = useCreateQR();

const domain = ref(route.params.domain || "scb");
// const goToMenu = () => {
//   router.push({
//     name: "Menu",
//     params: {
//       domain: domain.value,
//     },
//   });
// };

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

onMounted(async () => {
  //await fetchDepartements();
  await fetchCompanies();
});

const selectedCompany = ref(null);

// Watch for changes in company_id and fetch company details
watch(company_id, async (newId) => {
  if (newId && isSuccess.value) {
    try {
      // Find the selected company from companies array
      selectedCompany.value = companies.value.find(comp => comp.id === newId);
    } catch (error) {
      console.error('Error getting company details:', error);
    }
  }
});

const userDocument = ref(null);
const fileName = ref('');

const handleDocumentUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    userDocument.value = file;
    fileName.value = file.name;
  }
};

// Modify your submit function to include the document
const submit = async () => {
  try {
    await createQR(
      email.value,
      type.value,
      firstname.value,
      lastname.value,
      contact.value,
      title.value,
      dateExp.value,
      company_id.value,
      userDocument.value // Pass the user document
    );
    
    // Set selected company after successful submission
    if (company_id.value) {
      selectedCompany.value = companies.value.find(comp => comp.id === company_id.value);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error('Error creating QR code');
  }
};

watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
      toast.success(" QRCode a créé avec succès.");
      statusCode.value = 200;
      isSuccess.value = true;
      console.log( "qrresponse",qrResponse.value );
      uidn.value = qrResponse.value.data.uidn;
      break;
    case 201:
      toast.success("QRCode a créé avec succès.");
      statusCode.value = 201;
      console.log({ qrResponse });
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

const captureDiv = () => {
  if (!capture.value) return;

  // Hide buttons before capture
  const buttonsToHide = document.querySelectorAll(".visitor_button, .capture-button");
  buttonsToHide.forEach((button) => (button.style.display = "none"));

  html2canvas(capture.value, { useCORS: true, allowTaint: true }).then((canvas) => {
    // Restore buttons after capture
    buttonsToHide.forEach((button) => (button.style.display = "flex"));

    const imageData = canvas.toDataURL("image/png");
    image.value = imageData;

    const link = document.createElement("a");
    link.href = imageData;
    link.download = `meeting-${domain.value}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
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
  <section class="background-gradi request-meeting qr_form meeting-form">
    <div class="container">
      <div class="row align-items-center mt-3">
        <div class="col col-12 col-md-12 col-sm-12 qr_form_main">
          <div v-if="!isSuccess">
            <div class="box12" style="display: flex">
              <!-- <button @click="goToMenu" class="back">Retour</button> -->
              <h3 class="text-center">Création QRCode</h3>
            </div>

            <form @submit.prevent="submit" class="mt-5">
              <div>
                <label for="firstname">First Name </label>
                <input
                  type="text"
                  id="firstname"
                  v-model="firstname"
                  class="input_style"
                />
              </div>

              <div>
                <label for="lastname">Last Name </label>
                <input
                  type="text"
                  id="lastname"
                  v-model="lastname"
                  class="input_style"
                />
              </div>

              <div>
                <label for="contact">Contact</label>
                <input
                  type="text"
                  id="contact"
                  v-model="contact"
                  class="input_style"
                />
              </div>

              <div>
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="input_style"
                />
              </div>

              <div>
                <label for="title">Title</label>
                <input
                  type="text"
                  id="title"
                  v-model="title"
                  class="input_style"
                />
              </div>

              <div>
                <label for="type_qr">QR Type</label>
                <select v-model="type" id="type_qr" class="input_style">
                  <option value="permanent">Permanent</option>
                  <option value="temporaire">Temporaire</option>
                </select>
              </div>

              <div>
                <label for="dateExp"> Expiration Date </label>
                <input
                  type="date"
                  id="dateExp"
                  v-model="dateExp"
                  class="input_style"
                />
              </div>

              <div>
                <label for=""
                  >Entreprise</label
                >
                <select
                  id="role"
                  v-model="company_id"
                  class="form-select"
                  aria-label="Default select example"
                >
                  <option value="" disabled selected>
                    Sélectionner une Entreprise
                  </option>
                  <option
                    v-for="company in companies"
                    :key="company?.id"
                    :value="company?.id"
                  >
                    {{ company?.name }}
                  </option>
                </select>
              </div>

              <div>
                <label for="user_document">User Document</label>
                <input
                  type="file"
                  id="user_document"
                  @change="handleDocumentUpload"
                  accept=".pdf,.doc,.docx,image/*"
                  class="input_style"
                />
                <small v-if="fileName" class="file-name">Selected file: {{ fileName }}</small>
              </div>

              <div class="bt_bottom event_button_new" style="margin-top: 40px">
                <div class="submit-button">
                  <input type="submit" value="Soumettre" :disabled="loading" />
                </div>
              </div>
            </form>
          </div>

          <!-- Show QR Code and User Details After Submission -->
          <div v-if="isSuccess" class="text-center create-qr_section" ref="capture">
            <div class="scanner-logo-image">
              <div class="scanner-left">
                <img 
                  v-if="selectedCompany?.logo"
                  class="card_logologo12333"
                  :src="`${publicDir}/logo/${selectedCompany.logo}`"
                  :alt="selectedCompany.name"
                  width="50"
                  height="50"
                />
              </div>
              <div class="scanner-right">
              </div>
            </div>
            <div class="user-details">
              <!-- <p><strong>Company:</strong> {{ selectedCompany?.name }}</p> -->
              <p><strong>Name:</strong> {{ firstname }} {{ lastname }}</p>
              <p><strong>Email:</strong> {{ email }}</p>
              <p><strong>Contact:</strong> {{ contact }}</p>
              <p><strong>Title:</strong> {{ title }}</p>
            </div>
            <img
              :src="`${publicDir}/qrcode-user/qrcode-${uidn}.png`"
              alt="QR Code"
            />
            <h3>{{ uidn }}</h3>
          </div>
          <div v-if="isSuccess" class="user_Qr_code" @click="captureDiv" role="button">
              <a href="">Capture</a>
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
  transform: unset !important;
  max-width: 700px !important;
}
.qr_form_main h3.text-center {
  margin-left: 20px;
  margin-bottom: 0;
}
.qr_form_main form.mt-5 {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}
.qr_form_main form.mt-5 > div {
  text-align: left;
  width: 48%;
}
.qr_form {
  margin: 20px 0px 40px 0px;
}
.create-qr_section {
  margin: 20px auto 30px auto;
  max-width: 450px;
  background: #000000 !important;
  padding: 45px 35px;
  color: #ffffff;
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
  border-radius: 12px;
  margin-top: 0px;
  max-width: 200px;
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
section.request-meeting.meeting-form .align-items-center h3 {
  font-size: 24px;
  margin-top: 10px;
}
.user_Qr_code {
    text-align: center;
    display: inline-block;
    width: 100%;
}
.user_Qr_code a {
    background: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    border-radius: 10px;
    padding: 20px 100px;
    font-weight: 600;
    font-size: 20px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none;
}
@media (max-width: 680px) {
  .create-qr_section img {
    max-width: 100% !important;
  }
  .qr_form_main {
    padding: 0 !important;
  }

}

.scanner-logo-image {
  display: flex;
  align-items: center;
  justify-content: space-between; /* keeps left and right areas separated */
}

.scanner-left {
  flex: 0 0 auto; /* ensure it stays on the left */
}

.scanner-right {
  flex: 1; /* this will take the remaining space */
}

.card_logologo12333 {
  width: 100px;
  height: 100%;
  border-radius: none !important; 
}

.file-name {
  display: block;
  margin-top: 5px;
  font-size: 0.875rem;
  color: #666;
}

input[type="file"].input_style {
  padding: 8px;
}

</style>
