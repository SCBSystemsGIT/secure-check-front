// import apiClient from '@/plugins/axios';
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import axios from "axios";

export function useQrCode() {
  const status = ref(null);
  const message = ref("");
  const loading = ref(false);
  const error = ref(null);

  const router = useRouter();

  const getQrData = async (uidn, type) => {
    //type 1 manual
    loading.value = true;
    try {
      let host = "http://127.0.0.1:9999";
      const response = await axios.get(`${host}/get-qr-data/${uidn}`, {
        params: {
          type: type,
        },
      });
      status.value = response.data.status;
      message.value = response.data.message;

      if (status.value === "success") {
        console.log("Succès:", message.value);
        toast.success(message.value);
        // router.push("/");
        console.log(router);
      } else {
        console.warn("Erreur:", message.value);
      }
    } catch (err) {
      error.value = "Erreur lors de la vérification du QR code";
      console.error("API Error:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    status,
    message,
    loading,
    error,
    getQrData,
  };
}
