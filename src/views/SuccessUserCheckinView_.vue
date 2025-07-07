<script setup>
// import { toast } from "vue3-toastify";
import { useGlobalStore } from "@/stores/globalStore";
import {ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import myService from "@/services/visitorcode";

const { publicDir } = useGlobalStore();
const route = useRoute();
const message = ref("");
const error = ref(null);
const visitorLogs = ref([]);
const uidn = route.params.uidn;
// const route = useRoute();
// const router = useRouter();

// onMounted(() => {
//   if (route.params.uidn) {
//     toast.info("Bien joué");
//   } else {
//     router.push("/");
//   }
// });

const fetchUserLogData = async () => {
      try {
        let response;
          response = await myService.fetchUserCheckInData(uidn);
          console.log("Fetched All Visitor Logs:", response.image); 
        visitorLogs.value = response;
        message.value = "Data fetched successfully!";
      } catch (err) {
        error.value = "Failed to fetch data.";
        console.error(err);
      }
    };

    onMounted(() => {
      fetchUserLogData();
    });
</script>

<template>
  <section class="background-gradi request-meeting qr_thanks">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo text-center">
            <router-link to="/">
              <img
                src="@/assets/success-svgrepo-com.svg"
                class="success-icon"
                :alt="`${publicDir}/qrcode-user/qrcode-${uidn}.png`"
              />
            </router-link>

            <div class="text-center py-3">
              <img
                v-if="visitorLogs.image"
                :src="`${publicDir}/user_document/${visitorLogs.image}`"
                class="visitor-image"
                alt="user Check-in Image" 
              />
              <h2>🎉 Thank you for your visit!</h2>
              <p class="thank-you-message">
                Your check-in has been successfully recorded
              </p>
              <router-link to="/" class="btn-back">Return to Home</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.success-icon {
  width: 100px;
  height: auto;
}
.thank-you-message {
  font-size: 18px;
  color: #333;
  margin-top: 10px;
}
.btn-back {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background: #000;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
.btn-back:hover {
  background: #000;
}

.qr_thanks {
    height: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 30px;
}
.popup-logo.text-center .text-center.py-3 img.visitor-image {
    margin-bottom: 20px;
    width: 50%;
    height: 50%;
}

@media(max-width: 680px){
  .popup-logo.text-center .text-center.py-3 img.visitor-image {
    width: 100%;
    height: 50%;
}

}

</style>
