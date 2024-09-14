<script setup>
import { useNavigation } from "@/composables/useNavigation";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";
const { goToRoute } = useNavigation();

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
  <section class="background-gradi request-meeting">
    <div
      class="d-flex justify-content-center align-items-center vh-100 gap-2 mx-5"
    >
      <div class="col-md-4 col-xl-3" @click="goToRoute('/meeting')">
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h2 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>Visite</span>
            </h2>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-xl-3" @click="goToRoute('/list-qrcode')">
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h2 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>QRCode</span>
            </h2>
          </div>
        </div>
      </div>

      <div class="col-md-4 col-xl-3" @click="goToRoute('/list-manuel')">
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h2 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>Manuel</span>
            </h2>
          </div>
        </div>
      </div>

      <div
        class="col-md-4 col-xl-3"
        @click="goToRoute('/create-user')"
        v-if="userStore.isAdmin(currentRole)"
      >
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h2 class="text-center">
              <i class="fa fa-rocket f-left"></i
              ><span>Création d'Utilisateur</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
