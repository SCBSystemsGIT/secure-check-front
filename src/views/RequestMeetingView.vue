<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";

const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));

const userStore = useUserStore();
const currentRole = ref();
currentRole.value = roles.value.roles[0];
onMounted(() => {
  console.log(roles.value.roles[0]);
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
            <router-link to="/meeting">Request-meeting</router-link>
          </div>

          <div class="request-btn" v-if="userStore.isAdmin(currentRole)">
            <router-link to="/menu">Menu</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
