<script setup>
import { useCompanies } from "@/services/useCompanies";
import { useGlobalStore } from "@/stores/globalStore";
import { useUserStore } from "@/stores/useUserStore";
import { EventBus } from "@/utils/eventBus";
import { watch } from "vue";
// import { ref } from "vue";
import { onBeforeMount /*ref*/ } from "vue";
import { useRoute } from "vue-router";
const userStore = useUserStore();
const route = useRoute();

const logout = () => {
  userStore.logout();
};

const isAuthenticated = userStore.isAuthenticated();
const roles = userStore.roles;
const { publicDir } = useGlobalStore();
const { showCompany, company } = useCompanies();

onBeforeMount(async () => {
  // Extraire l'hôte (domaine + port)
  console.log("Host:", window.location.host);
  // Extraire le chemin (path)
  console.log("Path:", window.location.pathname);

  if (window.location.pathname != "/sign-in") {
    let company_slug = localStorage.getItem("currentCompany");
    if (company_slug) {
      await showCompany(company_slug);
    } else {
      company_slug = "";
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
  <section class="top-bar">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-6 col-md-6 top-bar-left">
          <div>
            <router-link to="/" v-if="route.params.domain == 'scb'"
              ><img
                src="@/assets/secure-check-logo.png"
                class=""
                alt="secure-check-logo"
            /></router-link>

            <router-link to="/" v-else>
              <img
                class="logo"
                :src="`${publicDir}/logo/${company?.logo}`"
                :alt="company?.logo"
            /></router-link>
          </div>
        </div>
        <div class="col col-6 col-md-6 top-bar-right">
          <div class="account-login-button">
            <p v-show="false">
              {{ `${roles}` }}
              {{ `${publicDir}/logo/${company?.logo}` }}
            </p>

            <!-- <h1>
              {{ distantData }}
            </h1> -->
            <a
              @click="logout"
              class="login-button"
              v-if="isAuthenticated"
              role="button"
            >
              Se Déconnecter
            </a>

            <!-- to="/sign-in" -->
            <!-- :to="`/${company_slug ?? 'scb'}/sign-in`" -->
            <router-link
              v-else-if="route.name != 'Login'"
              to="/sign-in"
              class="login-button"
            >
              Se Connecter
            </router-link>

            <!-- :to="`/${company_slug ?? 'scb'}/request-meeting`" -->
            <router-link
              v-else
              :to="`/${company_slug ?? 'scb'}/request-meeting`"
              class="login-button"
            >
              Visite
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.logo {
  width: 100%;
  max-width: 210px;
  max-height: 180px;
}
</style>
