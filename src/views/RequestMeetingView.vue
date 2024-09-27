<script setup>
// import { useGlobalStore } from "@/stores/globalStore";
import { useUserStore } from "@/stores/useUserStore";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const roles = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
const userStore = useUserStore();
const currentRole = ref(roles?.value?.roles ? roles.value.roles[0] : "");

const route = useRoute();
const router = useRouter();

const domain = ref();
onBeforeMount(() => {
  domain.value = route.params.domain || "scb";
  localStorage.setItem("currentCompany", domain.value);

  if (domain.value) {
    router.push({
      name: "RequestMeeting",
      params: {
        domain: domain.value,
      },
    });
  }

  // Stocker les rôles dans le localStorage pour une utilisation ultérieure
  localStorage.setItem(
    "roles_list",
    JSON.stringify([
      "ROLE_USER",
      "ROLE_EMPLOYEE",
      "ROLE_SUPERVISOR",
      "ROLE_ADMIN",
      "ROLE_SUPER_ADMIN",
    ])
  );
});
</script>

<template>
  <section class="background-gradi request-meeting">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo">
            <router-link to="/"
              ><img
                src="@/assets/secure-check-logo.png"
                alt="secure-check-logo"
            /></router-link>
          </div>
          <div class="request-btn">
            <router-link
              :to="{ name: 'CreateVisitor', params: { domain: domain } }"
              >Request-meeting</router-link
            >
          </div>

          <div
            class="request-btn"
            v-if="
              userStore.isAdmin(currentRole.value) ||
              userStore.isEmployee(currentRole.value)
            "
          >
            <router-link :to="{ name: 'Menu', params: { domain: domain } }"
              >Menu</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
