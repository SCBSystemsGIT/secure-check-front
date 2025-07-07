<script setup>
import { useRoute } from 'vue-router';
import { watchEffect, ref, onMounted } from "vue";
import { useCompanies } from "@/services/useCompanies";
import { useGlobalStore } from "@/stores/globalStore";
import { onBeforeMount /*ref*/ } from "vue";
const route = useRoute();
const domain = ref(route.params.domain || "masek");
//  const router = useRouter();

const visitorName = ref(null);
const visitorUidn = ref(null);
const visitorEmail = ref(null);
const visitorContact = ref(null);
const visitorTitle = ref(null);
const visitorCode = ref(null);
const { showCompany, company } = useCompanies();
const company_slug = ref(localStorage.getItem("currentCompany"));
const { publicDir } = useGlobalStore();


// Redirect if state is not available (e.g. user refreshed page directly)

onMounted(() => {
  if (history.state.name) {
    visitorName.value = history.state.name;
    console.log("Visitor Name:", visitorName.value);
  }

  if (history.state.email) {
    visitorEmail.value = history.state.email;
    console.log("Visitor Email Set:", visitorEmail.value);
  }
  if (history.state.contact) {
    visitorContact.value = history.state.contact;
    console.log("Visitor Contact Set:", visitorContact.value);
  }
  if (history.state.title) {
    visitorTitle.value = history.state.title;
    console.log("Visitor Title:", visitorTitle.value);
  }
  if (history.state.uidn) {
    visitorUidn.value = history.state.uidn;
    console.log("Visitor Uidn:", visitorUidn.value);
  }
  if (history.state.src) {
    visitorCode.value = history.state.src;
    console.log("Visitor code:", visitorCode.value);
  }
});

watchEffect(async () => {
  if (route.state?.name) {
    visitorName.value = route.state.name;
    console.log("visitor Name:", visitorName.value);
  }

  if (route.state?.uidn) {
    visitorUidn.value = route.state.uidn;
    console.log("Updated Visitor Uidn:", visitorUidn.value);
  }
  if (route.state?.email) {
    visitorEmail.value = route.state.email;
    console.log("Updated Visitor Email:", visitorEmail.value);
  }
  if (route.state?.contact) {
    visitorContact.value = route.state.contact;
    console.log("Updated Visitor Contact:", visitorContact.value);
  }
  if (route.state?.title) {
    visitorTitle.value = route.state.title;
    console.log("Updated Visitor Title:", visitorTitle.value);
  }
  if (route.state?.src) {
    visitorCode.value = route.state.src;
    console.log("Updated Visitor code:", visitorCode.value);
  }
 
});

onBeforeMount(async () => {
  if (window.location.pathname != "/sign-in") {
    if (company_slug.value) {
      await showCompany(company_slug.value);
    } else {
      company_slug.value = "";
    }
  }
});
// const qrDetails = {
//   src: route.state?.src || '',
//   name: route.state?.name || '',
//   uidn: route.state?.uidn || '',
//   email: route.state?.email || '',
//   contact: route.state?.contact || '',
//   title: route.state?.title || '',
// };
</script>

<template>
  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12">
          <div class="left-back">
            <router-link :to="{ name: 'QrCodeList', params: { domain: domain.value } }">
              <img src="@/assets/back-arrow-table.png" alt="back-arrow" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="card">
    <div class="popup-logo" v-if="!isSuccess">
      <router-link to="/">
        <img
          class="logo logo12333"
          :src="`${publicDir}/logo/${company?.logo}`"
          :alt="company?.logo"
      /></router-link>
    </div>
    <div class="label">Name</div>
    <div>{{ visitorName }} </div>

    <div class="label">Email</div>
    <div>{{ visitorEmail }}</div>

    <div class="label">Contact</div>
    <div>{{ visitorContact }}</div>

    <div class="label">Title</div>
    <div>{{ visitorTitle }}</div>

    <img :src="visitorCode" alt="QR Code" class="qr-code" />

    <div style="text-align: center; margin-top: 2px;">{{ visitorUidn }}</div>
  </div>
</template>

<style scoped>
.card {
  background: #000;
  color: white;
  width: 300px;
  padding: 20px;
  /* border-radius: 10px; */
  text-align: left;
  font-family: Arial, sans-serif;
  position: relative;
  margin: 0 auto;
  margin-bottom: 20px;
}

.date {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 14px;
}

.logo {
  width: 40px;
  margin-bottom: 20px;
}

.label {
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
  text-transform: uppercase;
  font-size: 12px;
}

.qr-code {
  display: block;
  margin: 20px auto 0;
  width: 160px;
  height: 160px;
  border: 4px solid white;
  border-radius: 8px;
}
</style>
