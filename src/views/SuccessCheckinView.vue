<script setup>
// import { toast } from "vue3-toastify";
import { useGlobalStore } from "@/stores/globalStore";
import {ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { useRoute } from "vue-router";
import myService from "@/services/visitorcode";
import { useUserStore } from "@/stores/useUserStore";


const { publicDir } = useGlobalStore();
const route = useRoute();
const message = ref("");
const error = ref(null);
const visitorLogs = ref([]);
const router = useRouter();
const userStore = useUserStore();
// const domain = ref(route?.params?.domain || "scb");
// const router = useRouter();

// onMounted(() => {
//   if (route.params.uidn) {
//     toast.success("Thank you! Your check-in has been successfully recorded.");
//   } else {
//     router.push("/");
//   }
// });
const domain = ref(route.params.domain || "scb");
const goToMenu = () => {
  router.push({
    name: "Menu",
    params: { domain: domain.value, id: route.params.id },
  });
};


const isAuthenticated = userStore.isAuthenticated();

  const uidn = route.params.uidn;
  console.log("dfddfgdfg",uidn);

    const fetchVisitorLogData = async () => {
      try {
        let response;
          response = await myService.fetchVisitorCheckInData(uidn);
          console.log("Fetched All Visitor Logs:", response.image); 
        visitorLogs.value = response;
        message.value = "Data fetched successfully!";
      } catch (err) {
        error.value = "Failed to fetch data.";
        console.error(err);
      }
    };

    onMounted(() => {
      fetchVisitorLogData();
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
                :alt="`${publicDir}/qrcode/qrcode-${uidn}.png`"
              />
            </router-link>

            <div class="text-center py-3">
              <img
                v-if="visitorLogs.image"
                :src="`${publicDir}/request_image/${visitorLogs.image}`"
                class="visitor-image"
                alt="Visitor Check-in Image"
              />
              <h2>🎉Thank you for your visit!</h2>
              <p class="thank-you-message">
                Your check-in has been successfully recorded. Enjoy your experience!
              </p>
              <!-- <router-link  @click="goToMenu()" class="btn-back" v-if="isAuthenticated">Return to Home</router-link> -->
              <!-- <router-link to="/menu" class="btn-back" v-if="isAuthenticated">
                Return to Home
              </router-link> -->
              <button class="btn-back" v-if="isAuthenticated" @click="goToMenu">
                Return to Home
              </button>
              <!-- <router-link :to="{ name: 'Camera', params: {  domain: domain } }" class="btn-back">Back to Scan</router-link> -->
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
}

@media(max-width: 680px){
  .popup-logo.text-center .text-center.py-3 img.visitor-image {
    width: 100%;
}

}
</style>
