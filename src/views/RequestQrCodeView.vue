<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useCompanies } from "@/services/useCompanies";
import { useGlobalStore } from "@/stores/globalStore";
import html2canvas from "html2canvas";
import { useDate } from "@/composables/useDate";

const route = useRoute();
const { publicDir } = useGlobalStore();
const domain = ref(route.params.domain || "scb");
const uidn = ref(route.params.uidn || "");
const capture = ref(null);
const image = ref(null);
const { showCompany, company } = useCompanies();

// Event details from sessionStorage
const visitorData = ref({
  eventName: "",
  location: "",
  address: "",
  date: "",
  time: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
});
const { formatDate, formatTime } = useDate();
// Watch for route changes
watchEffect(() => {
  uidn.value = route.params.uidn || "";
});

// Load event details from sessionStorage
onMounted(() => {
  showCompany(domain.value);
  const storedData = sessionStorage.getItem("visitorData");
  if (storedData) {
    visitorData.value = JSON.parse(storedData);
  }
});

const captureDiv = () => {
  if (!capture.value) return;

  // Hide buttons before capture
  const buttonsToHide = document.querySelectorAll(".visitor_button, .capture-button");
  buttonsToHide.forEach((button) => (button.style.display = "none"));

  html2canvas(capture.value, { useCORS: true, allowTaint: true }).then((canvas) => {
    // Restore buttons after capture
    buttonsToHide.forEach((button) => (button.style.display = "flex"));

    const imageData = canvas.toDataURL("image/png");
    image.value = imageData;

    const link = document.createElement("a");
    link.href = imageData;
    link.download = `meeting-${domain.value}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

</script>

<template>
  <section class="scanner-area scanner-area-new">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12 scanner-bg-black" ref="capture">
            <div class="scanner-logo-image">
              <div class="scanner-left">
                <router-link :to="{ name: 'RequestMeeting', params: { domain: domain } }">
                <img class="card_logologo12333"
                  :src="`${publicDir}/logo/${company?.logo}`"
                  :alt="company?.logo"
                />
              </router-link>
                <!-- <img src="images/logo-e-white.png" class="" alt="logo-e-white" /> -->
              </div>
              <div class="scanner-right">
                <span>{{ formatTime(visitorData.time_event) }}</span> <br /><span>{{
                  formatDate(visitorData.date_event)
                }}</span>
              </div>
            </div>
          <div class="scanner-texts">

            <h5>Name</h5>
            <h3>{{ visitorData.firstname }} {{ visitorData.lastname }} </h3>
            
            <h5>EVENT</h5>
            <h3>{{ visitorData.title }}</h3>

            <h5>WHERE</h5>
            <p>{{ visitorData.location }}</p>

            <h5>Address</h5>
            <p>{{ visitorData.address }} {{ visitorData.city }} ,{{ visitorData.state }}{{ visitorData.zipcode }},{{ visitorData.country }}</p>
          </div>
          <div class="scanner-image">
            <router-link to="/">
                <img :src="`${publicDir}/qrcode/qrcode-${uidn}.png`" class="" alt="QR Code" />
              </router-link>
              <div class="text-center py-2">
                <h3>{{ uidn }}</h3>
              </div>
          </div>
        </div>

        <div class="request-btn capture-button" @click="captureDiv" role="button">
          <a>Capture</a>
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
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}
.request-btn a {
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
.popup-logo.with_scan_cls {
  background: #37bbf0 !important;
  position: unset !important;
  transform: unset !important;
  padding: 40px 20px !important;
  border-radius: 15px;
}
.popup-logo.with_scan_cls img {
  border-radius: 12px;
  margin-top: 20px;
}

.request-btn.capture-button {
    background: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    border-radius: 10px;
    /* padding: 20px 100px; */
    font-weight: 600;
    font-size: 20px;
    display: inline-block;
    cursor: pointer;
    margin-right: 5px;
    max-width: 25%;
    margin-bottom: 30px;
}
img.card_logologo12333 {
    max-width: 100px;
}

.scanner-content {
  padding: 10px;
}

.event-time {
  font-size: 18px;
  font-weight: bold;
}

.event-details p {
  margin: 10px 0;
}

.divider {
  border-top: 1px solid white;
  margin: 10px 0;
}

@media(max-width: 680px){
  .request-btn.capture-button {
    max-width: 80% ! IMPORTANT;
    padding: 0px 20px;
    width: 100%;
}

}

</style>
