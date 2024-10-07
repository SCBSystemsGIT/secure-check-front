<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/globalStore";
import { useEvent } from "@/services/useEvent";
import { useDate } from "@/composables/useDate";

const userStore = useUserStore();
const route = useRoute();
const { showEvent, event } = useEvent();

const { publicDir } = useGlobalStore();
const router = useRouter();
const goToMenu = () => {
  router.push({
    name: "Menu",
    params: {
      domain: domain.value,
      id: route.params.id,
    },
  });
};

const { formatDate, formatTime } = useDate();
const isAuthenticated = userStore.isAuthenticated();
const domain = ref(route.params.domain || "scb");
onMounted(() => {
  // alert(route.params.slug)

  showEvent(route.params.slug);

  if (domain.value) {
    router.push({
      name: "ShowEventQRcode",
      params: {
        domain: domain.value,
        slug: route.params.slug,
      },
    });
  }
});
</script>

<template>
  <section class="background-gradi request-meeting">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo">

          <h2>
            INFORMATION SUR L'ÉVÈNEMENT 
          </h2>

            <router-link to="/">
              <img
                :src="`${publicDir}/qrcode-link/qrcode-${route.params.slug}.png`"
                :class="route.params.slug"
                :alt="route.params.slug"
              />
            </router-link>

            <div class="text-center py-2">
              <h3>Entreprise : {{ domain }}</h3>
            </div>

            <div class="text-center py-2">
              <h3>Nom : {{ event?.name }}</h3>
              <h3>Lieu : {{ event?.location }}</h3>
              <h3>Date : {{ formatDate(event?.date_event) }}</h3>
              <h3>Heure : {{ formatTime(event?.time_event) }}</h3>
            </div>

            <div
              class="request-btn"
              @click="goToMenu()"
              v-if="isAuthenticated"
              role="button"
            >
              <a>Menu </a>
            </div>

            <div v-else>
              <h3>Votre QRCode a été envoyé par e-mail, Merci</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.request-btn-cannel {
  margin: 10px auto 0px auto;
  display: inline-block;
  text-align: center;
  width: 100%;
}
.request-btn-cannel a {
  background: #b92b00;
  color: #ffffff;
  border-radius: 10px;
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}

.request-btn a {
  /*background: #b92b00;*/
  color: #ffffff;
  border-radius: 10px;
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}

.request-btn-cannel a:hover {
  background: #000000;
  color: #ffffff;
}
</style>
