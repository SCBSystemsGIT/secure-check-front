<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

// Utilisation du routeur pour récupérer le domaine courant
const route = useRoute();
const domain = ref(route.params.domain || "scb");

const userStore = useUserStore();
const currentRole = ref();

const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value?.roles[0];

onMounted(() => {
  console.log("Rôle actuel :", currentRole.value);
});
</script>

<template>
  <section class="background-gradi selectcheckintype">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo">
            <router-link :to="{ name: 'RequestMeeting', params: { domain: domain } }">
              <img src="@/assets/secure-check-logo.png" class="" alt="secure-check-logo" />
            </router-link>
          </div>

          <div class="selectcheck-all">
            <h5><span>Veuillez sélectionner</span></h5>
            <div class="selectcheckintype-btns">
              <!-- Navigation avec domaine -->
              <router-link :to="{ name: 'CreateVisitor', params: { domain: domain } }">Meetings</router-link>
              <router-link :to="{ name: 'ListQrcode', params: { domain: domain } }">Demandes</router-link>
              <router-link :to="{ name: 'ManalCheck', params: { domain: domain } }">Manual Code</router-link>

              <router-link
                v-if="userStore.isAdmin(currentRole) || userStore.isSupervisor(currentRole)"
                :to="{ name: 'CreateEvent', params: { domain: domain } }"
                class="mt-2"
              >
                Créer Event
              </router-link>

              <router-link
                v-if="userStore.isAdmin(currentRole) || userStore.isSupervisor(currentRole)"
                :to="{ name: 'EventList', params: { domain: domain } }"
                class="mt-2"
              >
                Liste Event
              </router-link>

              <router-link
                v-if="userStore.isAdmin(currentRole)"
                :to="{ name: 'ListUser', params: { domain: domain } }"
                class="mt-2"
              >
                Utilisateurs
              </router-link>

              <router-link
                v-if="userStore.isAdmin(currentRole) || userStore.isManager(currentRole)"
                :to="{ name: 'CreateUser', params: { domain: domain } }"
                class="mt-2"
              >
                + Utilisateurs
              </router-link>

              <router-link
                v-if="userStore.isAdmin(currentRole) || userStore.isSupervisor(currentRole)"
                :to="{ name: 'CreateCompany', params: { domain: domain } }"
                class="mt-2"
              >
                + Entreprise
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.menu-item {
  width: 20%;
}
</style>
