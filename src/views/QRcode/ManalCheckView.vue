<script setup>
import { useNavigation } from "@/composables/useNavigation";
import { useQrCode } from "@/services/useManualCheck";
import { ref } from "vue";
import { useRoute } from "vue-router";
// import { toast } from "vue3-toastify";

const route = useRoute();
const isSuccess = ref(false);
const { goToRoute } = useNavigation();
const { getQrData, status } = useQrCode();
const uidn = ref();

const submitForm = async () => {
  try {
    await getQrData(uidn.value);
    isSuccess.value = status.value == 200 ? true : false;
    // toast.success("Mise à jour éffectué");
    console.log(route);
  } catch (err) {
    console.error("Failed to update request:", err);
  }
};
</script>

<template>
  <section class="background-gradi request-meeting">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo" v-if="!isSuccess">
            <router-link to="/">
              <img
                src="@/assets/secure-check-logo.png"
                class=""
                alt="secure-check-logo"
            /></router-link>
          </div>

          <div class="popup-logo" v-if="isSuccess">
            <div class="text-center py-2">
              <h3>Bien éffectué</h3>
            </div>

            <div class="request-btn" @click="goToRoute('/')">
              <a>Accueil </a>
            </div>
          </div>

          <div v-if="!isSuccess">
            <h3 class="text-center py-3">Validation Manuelle UIDN</h3>

            <input
              type="text"
              name="uidn"
              id="uidn"
              class="uidn"
              v-model="uidn"
              placeholder="ENTREZ UUID"
            />

            <div
              class="request-btn"
              @click.prevent="submitForm()"
              v-if="!isLoading"
            >
              <a>Valider </a>
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

.uidn {
  border-radius: 10px;
  padding: 20px 100px;
  text-transform: uppercase;
}
</style>
