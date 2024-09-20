<script setup>
// import { useNavigation } from "@/composables/useNavigation";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";
// const { goToRoute } = useNavigation();

const userStore = useUserStore();
const currentRole = ref();

const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value.roles[0];
onMounted(() => {
  console.log(roles.value.roles[0]);
});

// const { isAdmin, isSuperAdmin, isSupervisor, isEmployee, isUser } = useUserStore();
</script>

<template>
  <!-- <section class="background-gradi request-meeting">
    <div
      class="d-flex justify-content-center align-items-center vh-100 gap-2 mx-5 px-3"
    >
      <div class="col-md-4 col-xl-3" @click="goToRoute('/meeting')">
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h4 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>Visite</span>
            </h4>
          </div>
        </div>
      </div>

      <div
        class="menu-item col-md-4 col-xl-3"
        @click="goToRoute('/list-qrcode')"
      >
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h4 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>QRCode</span>
            </h4>
          </div>
        </div>
      </div>

      <div
        class="menu-item col-md-4 col-xl-3"
        @click="goToRoute('/list-manuel')"
      >
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h4 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>Manuel</span>
            </h4>
          </div>
        </div>
      </div>

      <div
        class="menu-item col-md-4 col-xl-3"
        @click="goToRoute('/create-user')"
        v-if="userStore.isAdmin(currentRole)"
      >
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h4 class="text-center">
              <i class="fa fa-rocket f-left"></i
              ><span>Création d'Utilisateur</span>
            </h4>
          </div>
        </div>
      </div>

      <div
        class="menu-item col-md-4 col-xl-3"
        @click="goToRoute('/list-users')"
        v-if="userStore.isAdmin(currentRole)"
      >
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h4 class="text-center">
              <i class="fa fa-rocket f-left"></i
              ><span>Liste d'Utilisateur</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  </section> -->

  <section class="background-gradi selectcheckintype">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo">
            <a href="#"
              ><img
                src="@/assets/secure-check-logo.png"
                class=""
                alt="secure-check-logo"
            /></a>
          </div>
          <div class="selectcheck-all">
            <h5><span>Veuillez sélectionner </span></h5>
            <div class="selectcheckintype-btns">
              <router-link to="/meeting">Meetings</router-link>
              <router-link to="/list-qrcode">QR-Code</router-link>
              <router-link to="/list-manuel">Manual Code</router-link>
              <router-link to="/create-event" class="mt-2"
                >Créer Event</router-link
              >
              <router-link to="/list-events" class="mt-2"
                >Liste Event</router-link
              >
              <router-link
                to="/list-users"
                class="mt-2"
                v-if="userStore.isAdmin(currentRole)"
                >Liste Utilisateurs</router-link
              >
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
