<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/globalStore";
import { useEvent } from "@/services/useEvent";
import { useDate } from "@/composables/useDate";
import { useCompanies } from "@/services/useCompanies";
import html2canvas from "html2canvas";

const userStore = useUserStore();
const route = useRoute();
const { showEvent, event } = useEvent();
const { company, showCompany } = useCompanies();

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

const capture = ref(null);
const image = ref(null);

const captureDiv = () => {
  if (capture.value) {
    const images = capture.value.querySelectorAll('img');
    const promises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    });

    // Capture après le chargement des images
    Promise.all(promises).then(() => {
      html2canvas(capture.value, { useCORS: true }).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        image.value = imageData;

        const link = document.createElement("a");
        link.href = imageData;
        link.download = `event-${domain.value}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  }
};



const { formatDate, formatTime } = useDate();
const isAuthenticated = userStore.isAuthenticated();
const domain = ref(route.params.domain || "scb");
onMounted(() => {
  // alert(route.params.slug)

  showEvent(route.params.slug);
  showCompany(domain.value);

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
        <div class="col col-12 col-md-12 col-sm-12 event-details event_details_main" ref="capture">
          <div class="popup-logo">
            <div>
              
            </div>
            
          

            <!-- <div class="text-center py-2">
              <h3>Nom : {{ event?.name }}</h3>
              <h3>Lieu : {{ event?.location }}</h3>
              <h3>Date : {{ formatDate(event?.date_event) }}</h3>
              <h3>Heure : {{ formatTime(event?.time_event) }}</h3>
            </div> -->
            <div class="event_datetime">
              <h3 class="event-title">{{ formatTime(event?.time_event) }}</h3>
              <h3 class="event-title">{{ formatDate(event?.date_event) }}</h3>
              
            </div>
            <div class="event-details">
              <div style="display:none;"> <b> Entreprise</b> <h3 class="event-title"> {{ company?.name }}</h3> </div>
              <div> <b> Entreprise</b>  <h3 class="event-title">{{ event?.company?.name }}</h3> </div>
              <div> <b> Event Name</b> <h3 class="event-title"> {{ event?.name }}</h3> </div>
              <div> <b> Where </b> <h3 class="event-title"> {{ event?.location }}</h3> </div>
              <div> <b> Ticket </b> <h3 class="event-title">Summit Registartion</h3> </div>
            </div>
            
            <div>
              <router-link :to="`/${route.params.slug}`">
                <img
                  :src="`${publicDir}/qrcode-link/qrcode-${route.params.slug}.png`"
                  :class="route.params.slug"
                  :alt="route.params.slug"
                />
              </router-link>
            </div>

            <img v-if="image" :src="image" alt="Captured Image" v-show="false" />

            <div class="request-btn" @click="captureDiv" role="button">
              <a>Capture </a>
            </div>

            <div
              class="request-btn"
              @click="goToMenu()"
              v-if="isAuthenticated"
              role="button"
            >
              <a>Menu </a>
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

.event-details {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  /*background-color: #f9f9f9;*/
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.event-title {
  font-size: 1.5rem;
  color: #333;
  margin: 10px 0;
}

.event-title:nth-child(even) {
  color: #007bff; /* Accent color for alternating text */
}

.event-details h3 {
  font-weight: normal;
}

.event-details h3:not(:last-child) {
  /*border-bottom: 1px solid #ddd;*/
  padding-bottom: 10px;
}

.event-details {
  animation: fadeIn 1s ease-in-out;
}

.event-details {
    background: #37bbf0 !IMPORTANT;
}
.event-details .popup-logo .event-details {
    padding: 0;
    box-shadow: none;
    max-width: 100% !IMPORTANT;
}
.event_details_main {
    position: unset !IMPORTANT;
    transform: unset !IMPORTANT;
    padding: 20px !important;
}
.event_datetime {
    text-align: right;
}
.event_datetime h3.event-title {
    color: #fff !IMPORTANT;
    font-size: 18px;
    margin: 0;
    padding-bottom: 5px !important;
}
.event_datetime h3.event-title:last-child {
    font-size: 22px !important;
    font-weight: 400;
    text-transform: capitalize;
}
.event_details_main .popup-logo .event-details div {
    text-align: left;
    color: #ffff;
    margin-bottom: 17px;
}
.event_details_main .popup-logo .event-details div b {
    font-size: 18px;
}
.event_details_main .popup-logo .event-details div h3 {
    color: #fff;
    font-size: 16px;
    margin: 0;
}
.event_details_main .popup-logo a img {
    border-radius: 12px;
    margin-top: 50px;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo_qr {
  height: 7rem !important;
  width: 8rem !important;
  margin-bottom: 22px;
}
</style>
