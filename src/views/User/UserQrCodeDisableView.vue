<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCreateQR } from "@/services/useCreateQR";
import { toast } from "vue3-toastify";

const userQrReq = ref({
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  contact: "",
  dateExp: "",
});

const errorMessage = ref("");
const { statusCode, getUserQrById, updateUserQr } = useCreateQR();
const router = useRouter();
const route = useRoute();

onBeforeMount(async () => {
  if (route.params.id) {
    const response = await getUserQrById(route.params.id);

    console.log('dfkjsdfnjkdsfndjkgnfdjgfdgfdg',response);
    if (response) {
      userQrReq.value = response;
    } else {
      errorMessage.value = "QR User not found.";
    }
  }
});

// Watch for API response status
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
      toast.success("QR User updated successfully.");
      setTimeout(() => {
        router.push("/");
      }, 1500);
      break;
    case 400:
      toast.info("Bad request.");
      break;
    case 401:
      toast.info("Unauthorized. Please log in.");
      setTimeout(() => {
        router.push("/");
      }, 1500);
      break;
    case 403:
      toast.info("You do not have permission.");
      break;
    case 404:
      toast.info("User not found.");
      break;
    case 500:
      toast.info("Internal server error.");
      break;
    default:
      toast.info(`Error: ${newStatus}`);
  }
});

// Submit only the expiration date update
const submitForm = async () => {
  try {
    await updateUserQr({ dateExp: userQrReq.value.dateExp }, userQrReq.value.id);
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }
};

// Navigate back to the menu
// const goToMenu = () => {
//   router.push({ name: "Menu", params: { domain: route.params.domain } });
// };
</script>

<template>
  <section class="request-meeting">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
            <div class="left-back">
              <router-link :to="{ name: 'Menu' }">
                <img src="@/assets/back-arrow-table.png" alt="back-arrow" />
              </router-link>
            </div>
        </div>
      </div>
    </div>
    <div class="background-gradi">
      <section class="request-meeting meeting-form">
        <div class="row align-items-center">
          <div class="col col-12 col-md-12 col-sm-12">
            <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
              <!-- <button class="back" @click="goToMenu">Back</button> -->
              <h3>Update Expiration Date</h3>
            </div>

            <form @submit.prevent="submitForm">
              <!-- Read-Only Fields -->
              <div>
                <label for="firstname">First Name</label>
                <input type="text" id="firstname" v-model="userQrReq.firstname" readonly />
              </div>

              <div>
                <label for="lastname">Last Name</label>
                <input type="text" id="lastname" v-model="userQrReq.lastname" readonly />
              </div>

              <div>
                <label for="email">Email</label>
                <input type="email" id="email" v-model="userQrReq.email" readonly />
              </div>

              <!-- Editable Expiration Date Field -->
              <div>
                <label for="dateExp">Expiration Date</label>
                <input type="date" id="dateExp" v-model="userQrReq.dateExp" class="input_style" required />
              </div>

              <div class="event_button submit-button">
                <input type="submit" value="Update" />
              </div>

              <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.error {
  color: red;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #f9f9f9;
}
input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}
.submit-button {
  margin-top: 10px;
}
</style>
