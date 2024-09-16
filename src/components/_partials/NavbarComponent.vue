<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { useRoute } from "vue-router";
const userStore = useUserStore();
const route = useRoute();

const logout = () => {
  userStore.logout();
};

const isAuthenticated = userStore.isAuthenticated();
const roles = userStore.roles;

</script>

<template>
  <section class="top-bar">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-6 col-md-6 top-bar-left">
          <div>
            <router-link to="/"
              ><img
                src="@/assets/secure-check-logo.png"
                class=""
                alt="secure-check-logo"
            /></router-link>
          </div>
        </div>
        <div class="col col-6 col-md-6 top-bar-right">
          <div class="account-login-button">
            <p v-show="false">
              {{ roles }}
            </p>

            <!-- <p>
              {{ isAuthenticated }}
            </p> -->

            <a @click="logout" class="login-button" v-if="isAuthenticated" role="button">
              Logout
            </a>

            <router-link
              v-else-if="route.name != 'Login'"
              to="/sign-in"
              class="login-button"
            >
              Login In
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
