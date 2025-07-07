<script setup>
import { useCompanies } from "@/services/useCompanies";
import { useGlobalStore } from "@/stores/globalStore";
import { useUserStore } from "@/stores/useUserStore";
import { EventBus } from "@/utils/eventBus";
import { watch } from "vue";
import { onMounted } from "vue";
// import { onMounted } from "vue";
import { ref } from "vue";
// import { ref } from "vue";
import { onBeforeMount /*ref*/ } from "vue";
import { useRoute } from "vue-router";
const userStore = useUserStore();
const route = useRoute();

const logout = () => {
  userStore.logout();
};

const isAuthenticated = userStore.isAuthenticated();
const { publicDir } = useGlobalStore();
console.log("Public Directory:", publicDir);
const { showCompany, company } = useCompanies();
const company_slug = ref(localStorage.getItem("currentCompany"));


const path = window.location.pathname; 
const pathParts = path.split('/'); 
const company_event_slug = pathParts[2]; 
console.log("Company Slug:", company_event_slug);

onBeforeMount(async () => {
  if (window.location.pathname !== "/sign-in") {
    // Extract the slug from the path
    const pathParts = window.location.pathname.split("/");
    const company_event_slug = pathParts[1]; // Adjusted to get it reliably from the path
    console.log("Company Event Slug:", company_event_slug);

    const savedSlug = localStorage.getItem("currentCompany");

    // Set the slug to the ref (only if not already saved)
    company_slug.value = savedSlug || company_event_slug || "";

    // Load the company
    if (company_slug.value) {
      await showCompany(company_slug.value);
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

const roles = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
const currentRole = ref(roles?.value?.roles ? roles.value.roles[0] : "");

onMounted(() => {
  // alert(currentRole.value);
});
</script>

<template>
  <section class="top-bar-navbar">
      <div class="container">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <a
              class="navbar-brand"
              v-if="!route.params.domain || route.params.domain === 'null'"
              href="/"
            >
              <img
                id="logoif"
                src="@/assets/secure-check-logo.png"
                class=""
                alt="secure-check-logo"
              />
            </a>
            <a
              class="navbar-brand"
              v-else
              :href="`/${route.params.domain}`"
            >
              <img
                :src="`${publicDir}/logo/${company?.logo}`"
                :alt="route.params.domain"
              />
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a 
                    @click="logout"
                    v-if="isAuthenticated"
                    class="nav-link active"
                    role="button"
                  >
                    Se déconnecter
                  </a>
                  <router-link
                    v-else-if="route.name !== 'Login'"
                    to="/sign-in"
                    class="nav-link active"
                  >
                    Se connecter
                  </router-link>
                  <router-link
                    v-else
                    to="/request-meeting"
                    class="nav-link"
                  >
                    Visite
                  </router-link>
                </li>

                <li class="nav-item" v-if="userStore.isManager(currentRole) || userStore.isSupervisor(currentRole)">
                  <router-link
      :to="`/${company?.slug || company_slug || 'scb-systems-africa'}/edit-company/${company?.slug || company_slug || 'scb-systems-africa'}`"
      class="nav-link"
    >
                    Modifier entreprise
                  </router-link>
                </li>
              </ul>

            </div>
          </div>
        </nav>
      </div>
    </section>

    <!-- <section class="secure-datatable-heading-back">
      <div class="container">
        <div class="row align-items-center">
          <div class="col col-12 col-md-12 col-sm-12">
            <div class="left-back"><a href="#"><img src="@/assets/back-arrow-table.png" class="" alt="back-arrow" /></a></div>
              <div class="center-heading"></div>
              <div class="right-hide"></div>
            </div>
          </div>
      </div>
    </section> -->
</template>

<style>
.logo {
  width: 100%;
  max-width: 210px;
  max-height: 180px;
}

.top-bar-right a.login-button {
  background: #0097b9;
  color: #ffffff;
  border-radius: 99px;
  padding: 12px 25px;
  font-weight: 600;
  margin-left: 20px;
}
</style>
