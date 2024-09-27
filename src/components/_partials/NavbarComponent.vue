<script setup>
import { useCompanies } from "@/services/useCompanies";
import { useGlobalStore } from "@/stores/globalStore";
import { useUserStore } from "@/stores/useUserStore";
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
  let company_slug = localStorage.getItem("currentCompany");
  await showCompany(company_slug);
});
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

            <!-- src="@/assets/secure-check-logo.png" -->
            <router-link to="/" v-if="company"
              ><img
                :src="`${publicDir}/logo/${company?.logo}`"
                alt="secure-check-logo"
            /></router-link>
          </div>
        </div>
        <div class="col col-6 col-md-6 top-bar-right">
          <div class="account-login-button">
            <p v-show="false">
              {{ `${publicDir}/logo/${company?.logo}` }}
              {{ `${roles}` }}
            </p>

            <a
              @click="logout"
              class="login-button"
              v-if="isAuthenticated"
              role="button"
            >
              Se Déconnecter
            </a>

            <router-link
              v-else-if="route.name != 'Login'"
              to="/sign-in"
              class="login-button"
            >
              Se Connecter
            </router-link>

            <router-link v-else to="/request-meeting" class="login-button">
              Visite
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
