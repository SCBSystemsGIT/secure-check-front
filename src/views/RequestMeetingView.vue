<script setup>
import { useCompanies } from "@/services/useCompanies";
import { useUserStore } from "@/stores/useUserStore";
import { EventBus } from "@/utils/eventBus";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const roles = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
const userStore = useUserStore();
const isAuthenticated = userStore.isAuthenticated();
const currentRole = ref(roles?.value?.roles ? roles.value.roles[0] : "");
// const { showCompany, company } = useCompanies();
const { showCompany } = useCompanies();
const route = useRoute();
const router = useRouter();

const sendData = (params, valueAdded) => {
  console.info({ params, valueAdded });
  EventBus[params] = valueAdded;
};

const domain = ref();
onBeforeMount(async () => {
  domain.value = route.params.domain || "scb";
  sendData("company_slug", domain.value);

  localStorage.setItem("currentCompany", domain.value);
  let company_slug = localStorage.getItem("currentCompany");
  
  if (company_slug) {
    await showCompany(company_slug ?? domain.value);
  }

  if (domain.value) {
    router.push({ name: "RequestMeeting", params: { domain: domain.value } });
  }

  localStorage.setItem(
    "roles_list",
    JSON.stringify([
      "ROLE_USER",
      "ROLE_EMPLOYEE",
      "ROLE_SUPERVISOR",
      "ROLE_ADMIN",
      "ROLE_SUPER_ADMIN",
      "ROLE_SecureCheck",
    ])
  );
});
</script>

<template>
  <div class="main-page-div">
    <div class="main-page-div-inner">
      <section class="top-bar-with-logo text-center">
          <div class="container">
            <div class="row align-items-center">
                <div class="col col-12 col-md-12 logo-main">
                  <!-- <div><a href="#"><img src="@/assets/secure-logo.png" class="" alt="secure-check-logo" /></a></div> -->
                </div>
            </div>
          </div>
      </section>
      <section class="hexa-secure-logo text-center">
          <div class="container">
            <div class="row align-items-center">
                <div class="col col-12 col-md-12 col-sm-12">
                  <div><img src="@/assets/secure-check-effect-img.png" class="" alt="secure-check-effect-img" /></div>
                </div>
            </div>
          </div>
      </section>
      <section class="secure-menu-button text-center mt-3">
          <div class="container">
            <div class="row align-items-center g-0">
              <div :class="isAuthenticated && (userStore.isAdmin(currentRole) || userStore.isEmployee(currentRole)) ? 'col-6' : 'col-12'">
                  <div class="request-btn" 
                      v-if="userStore.isEmployee(currentRole) || userStore.isAdmin(currentRole) || userStore.isManager(currentRole)">
                      <router-link :to="{ name: 'CreateVisitor', params: { domain: domain } }">
                          Request-meeting
                      </router-link>
                  </div>

                  <div class="request-btn" v-else-if="userStore.isSupervisor(currentRole)"></div>
                  <div class="request-btn" v-else-if="userStore.isSecureCheck(currentRole)"></div>

                  <div class="request-btn" v-else>
                      <router-link :to="{ name: 'CreateVisitor', params: { domain: domain } }">
                          Request-meeting
                      </router-link>
                  </div>
              </div>

              <div :class="isAuthenticated && (userStore.isAdmin(currentRole) || userStore.isEmployee(currentRole)) ? 'col-6' : 'col-12'">
                  <div class="request-btn" 
                      v-if="userStore.isEmployee(currentRole) || userStore.isAdmin(currentRole) || userStore.isManager(currentRole) || userStore.isSupervisor(currentRole) || userStore.isSecureCheck(currentRole)">
                      <router-link :to="{ name: 'Menu', params: { domain: domain } }">
                          Menu
                      </router-link>
                  </div>
              </div>

            </div>
          </div>
      </section>			
    </div>
  </div>
</template>
