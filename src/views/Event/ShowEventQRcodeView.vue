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
const { showCompany, company } = useCompanies();

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
    const images = capture.value.querySelectorAll("img");
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

    Promise.all(promises).then(() => {
      html2canvas(capture.value, {
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          // Ignore elements with the class 'capture-button' and 'menu-button'
          return (
            element.classList.contains("capture-button") ||
            element.classList.contains("menu-button")
          );
        },
      }).then((canvas) => {
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
console.log('event---data', event);
</script>

<template>
  <section class="scanner-area scanner-area-new" >
    <div class="container">
      <div class="row align-items-center">
        <div
          class="col col-12 col-md-12 col-sm-12 scanner-bg-black"
          ref="capture"
        >
        
          <div class="scanner-logo-image">
            <div class="scanner-left">
              <router-link
                :to="{ name: 'RequestMeeting', params: { domain: domain } }"
              >
                <img
                  class="logo logo12333"
                  :src="`${publicDir}/logo/${company?.logo}`"
                  :alt="company?.logo"
                />
              </router-link>
              <!-- <img src="images/logo-e-white.png" class="" alt="logo-e-white" /> -->
            </div>
            <div class="scanner-right">
              <span>{{ formatTime(event?.time_event) }}</span> <br /><span>{{
                formatDate(event?.date_event)
              }}</span>
            </div>
          </div>
          <div class="scanner-texts">
            <h5>EVENT</h5>
            <h3>{{ event?.name }}</h3>

            <h5>WHERE</h5>
            <p>{{ event?.location }}</p>

            <h5>Address</h5>
            <p>{{ event?.addressName }},{{ event?.city }}, {{ event?.state }}{{ event?.zipcode }},{{ event?.country }}</p>
          </div>
          <div class="scanner-image">
            <router-link :to="`/${route.params.slug}`">
              <img
                :src="`${publicDir}/qrcode-link/qrcode-${route.params.slug}.png`"
                :alt="route.params.slug"
                style="border-radius: 12px; margin-top: 50px"
              />
            </router-link>
          </div>

      
        </div>
        <div class="event_qrcode_button">
            <!-- Add a class to the capture button to exclude it -->
            <div
              class="capture-button"
              style="
                background: #000;
                color: #fff;
                border-radius: 10px;
                padding: 20px 100px;
                font-weight: 600;
                font-size: 20px;
                display: inline-block;
                cursor: pointer;
                margin-right: 5px;
              "
              @click="captureDiv"
            >
              Capture
            </div>
            <div
              v-if="isAuthenticated"
              class="menu-button"
              style="
                background: #000;
                color: #fff;
                border-radius: 10px;
                padding: 20px 100px;
                font-weight: 600;
                font-size: 20px;
                display: inline-block;
                cursor: pointer;
                margin-top: 10px;
              "
              @click="goToMenu()"
            >
              Menu
            </div>
          </div>
      </div>
    </div>
  </section>
</template>
