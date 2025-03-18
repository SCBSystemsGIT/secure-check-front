<script setup>
import { useUpdateRequest } from "@/services/useUpdateRequest";
import { useCompanies } from "@/services/useCompanies";
import { useUserStore } from "@/stores/useUserStore";
import { ref, watchEffect, onMounted, onBeforeMount } from "vue";
import { EventBus } from "@/utils/eventBus";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useGlobalStore } from "@/stores/globalStore";
import html2canvas from "html2canvas";
// import { useDate } from "@/composables/useDate";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const isSuccess = ref(false);
const request = ref({ status: "", confirmed: "" });
const visitorAddress = ref(null);
const { publicDir } = useGlobalStore();
const { showCompany, company } = useCompanies();
const company_slug = ref(localStorage.getItem("currentCompany") || "");
const { isLoading, uidn, updateRequest } = useUpdateRequest();
const domain = ref(route.params.domain || "scb");
const capture = ref(null);
const image = ref(null);
const isAuthenticated = userStore.isAuthenticated();
const visitorRequestDate = ref(null);
const visitorRequestTime = ref(null);
const visitorOrganisationName = ref(null);
const visitorCity = ref(null);
const visitorState = ref(null);
const visitorZipCode = ref(null);
const visitorCountry = ref(null);

// const { formatDate } = useDate();
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).replace('.', ''); // Removes period if needed
};


onMounted(() => {
  if (domain.value) {
    router.push({ name: "WaitingValidation", params: { domain: domain.value } });
  }
  if (history.state.address) {
    visitorAddress.value = history.state.address;
    console.log("Visitor Address Set:", visitorAddress.value);
  }
  if (history.state.request_date) {
    visitorRequestDate.value = history.state.request_date;
    console.log("Visitor request date :", visitorRequestDate.value);
  }
  if (history.state.request_time) {
    visitorRequestTime.value = history.state.request_time;
    console.log("Visitor Request Time:", visitorRequestTime.value);
  }
  if (history.state.organisationName) {
    visitorOrganisationName.value = history.state.organisationName;
    console.log("Visitor Organisation Name:", visitorOrganisationName.value);
  }
  if (history.state.city) {
    visitorCity.value = history.state.city;
    console.log("Visitor city :", visitorCity.value);
  }
  if (history.state.state) {
    visitorState.value = history.state.state;
    console.log("Visitor state:", visitorState.value);
  }
  if (history.state.zipcode) {
    visitorZipCode.value = history.state.zipcode;
    console.log("Visitor zipcode:", visitorZipCode.value);
  }
  if (history.state.country) {
    visitorCountry.value = history.state.country;
    console.log("Visitor country:", visitorCountry.value);
  }
});

onBeforeMount(async () => {
  if (window.location.pathname !== "/sign-in" && company_slug.value) {
    await showCompany(company_slug.value);
  }
});

const submitForm = async (state) => {
  request.value.status = state;
  request.value.confirmed = state;
  try {
    await updateRequest(route.params.id, request.value);
    toast.success("Mise à jour effectuée");
    isSuccess.value = true;
  } catch (err) {
    console.error("Failed to update request:", err);
  }
};

const goToMenu = () => {
  router.push({ name: "Menu", params: { domain: domain.value, id: route.params.id } });
};

const captureDiv = () => {
  if (!capture.value) return;

  // Select the elements to hide
  const buttonsToHide = document.querySelectorAll(".visitor_button");

  // Hide the buttons
  buttonsToHide.forEach(button => (button.style.display = "none"));

  html2canvas(capture.value, { useCORS: true, allowTaint: true }).then((canvas) => {
    // Restore the buttons
    buttonsToHide.forEach(button => (button.style.display = "flex"));

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

watchEffect(async () => {
  if (localStorage.getItem("currentCompany") || EventBus["company_slug"]) {
    await showCompany(localStorage.getItem("currentCompany") ?? EventBus["company_slug"]);
  }
  if (route.state?.address) {
    visitorAddress.value = route.state.address;
    console.log("Updated Visitor Address:", visitorAddress.value);
  }
  if (route.state?.request_date) {
    visitorRequestDate.value = route.state.request_date;
    console.log("Updated Visitor Address:", visitorRequestDate.value);
  }
  if (route.state?.request_time) {
    visitorRequestTime.value = route.state.request_time;
    console.log("Updated Visitor Address:", visitorRequestTime.value);
  }
  if (route.state?.organisationName) {
    visitorOrganisationName.value = route.state.organisationName;
    console.log("Updated Visitor Address:", visitorOrganisationName.value);
  }
  if (route.state?.city) {
    visitorCity.value = route.state.city;
    console.log("Updated Visitor state:", visitorCity.value);
  }
  if (route.state?.state) {
    visitorState.value = route.state.state;
    console.log("Updated Visitor state:", visitorState.value);
  }
  if (route.state?.zipcode) {
    visitorZipCode.value = route.state.zipcode;
    console.log("Updated Visitor state:", visitorZipCode.value);
  }
  if (route.state?.country) {
    visitorCountry.value = route.state.country;
    console.log("Updated Visitor state:", visitorCountry.value);
  }
});
</script>


<template>
  <section class="background-gradi request-meeting test12333 visitor_del">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo with_scan_cls" v-if="isSuccess" ref="capture">
           <div class="company_logo">
            <router-link :to="{ name: 'RequestMeeting', params: { domain: domain } }">
              <img
                class="logo logo12333"
                :src="`${publicDir}/logo/${company?.logo}`"
                :alt="company?.logo"
              />
            </router-link>
            <div class="visitor_date_time">
              <h4 v-if="visitorRequestTime !== 'No Address Provided'" class="mt-2">
                 {{ visitorRequestTime }}
              </h4>
              <h4 v-if="visitorRequestDate !== 'No Address Provided'" class="mt-2">
                {{ formatDate(visitorRequestDate) }}
              </h4>
            </div>
          
           </div>
           
            <div class = "visitor_details" >
             
              <h4 v-if="visitorAddress !== 'No Address Provided'" class="mt-2">
                Address:
              </h4>
              <h4 v-if="visitorAddress !== 'No Address Provided'" class="mt-3">
                {{ visitorAddress }}, <br>{{visitorCity}},{{ visitorState }} {{ visitorZipCode }},{{ visitorCountry }}
              </h4>
              <h4 v-if="visitorOrganisationName !== 'No Address Provided'" class="mt-2">
                Organisation Name: 
              </h4>
              <h4 v-if="visitorOrganisationName !== 'No Address Provided'" class="mt-3">
                 {{ visitorOrganisationName }}
              </h4>
            </div>
            
            <router-link to="/">
              <img :src="`${publicDir}/qrcode/qrcode-${uidn}.png`" class="" alt="secure-check-logo" />
            </router-link>

            <div class="text-center py-2">
              <h3>{{ uidn }}</h3>
            </div>
            <div class="visitor_button">
              <div class="request-btn menu-button" @click="goToMenu()" v-if="isAuthenticated" role="button">
              <a>Menu</a>
            </div>
            <div class="request-btn capture-button" @click="captureDiv" v-if="isAuthenticated" role="button">
              <a>Capture</a>
            </div>

            <div v-else>
              <h3>Votre QRCode a été envoyé par e-mail, Merci</h3>
            </div>
            </div>
           
          </div>

          <div v-if="!isSuccess">
            <div class="d-flex justify-content-center align-items-center">
              <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
                <a class="back" :href="`/${company_slug}/list-qrcode`">Retour</a>
                <h3 style="display:block ruby" class="text-center py-3">
                  En attente de la confirmation de l'hôte...
                </h3>
              </div>
            </div>
            <div class="request-btn" @click.prevent="submitForm(1)" v-if="!isLoading">
              <a>Valider</a>
            </div>

            <div class="text-center" v-else>
              <h3>Chargement...</h3>
            </div>

            <div class="request-btn-cannel" @click.prevent="submitForm(0)">
              <a>Annuler</a>
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
 
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}

.request-btn a {
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
  background: #37bbf0 !important;
  position: unset !important;
  transform: unset !important;
  padding: 40px 20px !important;
  border-radius: 15px;
}
.popup-logo.with_scan_cls img {
  border-radius: 12px;
  margin-top: 20px;
}
</style>
