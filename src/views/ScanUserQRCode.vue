<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/plugins/axioss";

const route = useRoute();
const router = useRouter();
const uidn = route.params.uidn;

const token = ref(localStorage.getItem("token") || "");
const message = ref("");
const error = ref(null);
console.log("tokenscanner", token.value); 

// ✅ Auth check
if (!token.value) {
  alert("You must be logged in to continue.");
  router.push("/login");
}

// ✅ Call backend to validate QR
const getQrResult = async () => {
    try {
      const response = await apiClient.get(`/get-qr-user-data/${uidn}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    withCredentials: true,
  });

    if (response.data?.status === "success") {
      if (response.data.redirectUrl) {
        // If backend suggests redirect
        window.location.href = response.data.redirectUrl;
      } else {
        message.value = response.data.message;
        alert(`✅ ${response.data.message}`);
      }
    } else {
      error.value = response.data.message || "QR Invalid";
      alert(`❌ ${error.value}`);
    }
  } catch (err) {
    console.error("QR Request Error:", err);

    let errMsg = "Request failed";
    if (err?.response?.data?.error) {
      errMsg = err.response.data.error;
    } else if (err?.response?.data?.message) {
      errMsg = err.response.data.message;
    } else if (err?.message) {
      errMsg = err.message;
    }

    error.value = errMsg;
    alert(`❌ ${errMsg}`);
  }
};

onMounted(() => {
  getQrResult();
});
</script>

<template>
  <div>
    <p v-if="!message && !error">🔄 Checking QR code...</p>
    <h2 v-if="message">✅ {{ message }}</h2>
    <h2 v-if="error" style="color:red;">❌ {{ error }}</h2>
  </div>
</template>
