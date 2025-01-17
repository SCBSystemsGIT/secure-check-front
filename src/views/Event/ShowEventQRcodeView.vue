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
const {  showCompany } = useCompanies();

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

    Promise.all(promises).then(() => {
      html2canvas(capture.value, { useCORS: true ,allowTaint: true, }).then((canvas) => {
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
</script>

<template>
  <section style="">
    <div style="max-width: 700px; margin: auto; padding: 20px;">
      <div>
        <div style=" background: #37bbf0; border-radius: 10px; padding: 20px;" ref="capture">
          <div>
            <div style="display: flex; justify-content: space-between; color: #fff;">
              <h3 style="font-size: 18px; margin: 0;">{{ formatTime(event?.time_event) }}</h3>
              <h3 style="font-size: 22px; font-weight: 400; margin: 0; text-transform: capitalize;">{{ formatDate(event?.date_event) }}</h3>
            </div>
            <div style="margin: 20px 0;">
              <div style="margin-bottom: 17px; color: #fff;">
                <b style="font-size: 18px;">Entreprise</b>
                <h3 style="font-size: 16px; margin: 0;">{{ event?.company?.name }}</h3>
              </div>
              <div style="margin-bottom: 17px; color: #fff;">
                <b style="font-size: 18px;">Event Name</b>
                <h3 style="font-size: 16px; margin: 0;">{{ event?.name }}</h3>
              </div>
              <div style="margin-bottom: 17px; color: #fff;">
                <b style="font-size: 18px;">Where</b>
                <h3 style="font-size: 16px; margin: 0;">{{ event?.location }}</h3>
              </div>
              <div style="margin-bottom: 17px; color: #fff;">
                <b style="font-size: 18px;">Ticket</b>
                <h3 style="font-size: 16px; margin: 0;">Summit Registration</h3>
              </div>
            </div>
            <div style="text-align: center;">
              <router-link :to="`/${route.params.slug}`">
                <img
                  :src="`${publicDir}/qrcode-link/qrcode-${route.params.slug}.png`"
                  :alt="route.params.slug"
                  style="border-radius: 12px; margin-top: 50px;"
                />
              </router-link>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <div
                style="background: #b92b00; color: #fff; border-radius: 10px; padding: 20px 100px; font-weight: 600; font-size: 20px; display: inline-block; cursor: pointer; margin-right: 5px;"
                @click="captureDiv"
              >
                Capture
              </div>
              <div
                v-if="isAuthenticated"
                style="background: #007bff; color: #fff; border-radius: 10px; padding: 20px 100px; font-weight: 600; font-size: 20px; display: inline-block; cursor: pointer; margin-top: 10px;"
                @click="goToMenu()"
              >
                Menu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
