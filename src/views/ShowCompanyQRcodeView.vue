<script>
// Import necessary services and libraries
import myService from "@/services/useSingleCompany"; // Adjust the path based on your project structure
import { useGlobalStore } from "@/stores/globalStore";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export default {
  name: "ShowCompanyQRcode",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb");
    const companyList = ref([]); // Initialize companyList as an empty array
    const message = ref("");
    const error = ref(null);
    const { publicDir } = useGlobalStore();

    // Function to fetch event data
    const fetchEventData = async () => {
      try {
        const response = await myService.fetchData(); // Fetch the data from the service
        console.log("Fetched Response:", response.data); // Log the entire response to inspect its structure

        // Check if the response data is an object and push it into companyList array
        if (response.data && response.data.id) {
          companyList.value = [response.data]; // Wrap the single object in an array
          console.log("companyList:", companyList.value); // Verify companyList is populated correctly
          message.value = "Data fetched successfully!";
        } else {
          throw new Error("Expected data not found");
        }
      } catch (err) {
        error.value = "Failed to fetch data."; // Set an error message if the fetch fails
        console.error(err);
      }
    };

    // Function to show Company QR
    const showCompanyQR = (slug) => {
      console.log({
        domain: domain.value,
        slug: slug,
      });

      router.push({
        name: "ShowCompanyQRcode",
        params: {
          domain: domain.value,
          slug: slug,
        },
      });
    };

    // Function to copy content
    const copyContent = (dataLink) => {
      const copied = ref(false);
      const host = process.env.FRONT_URL ?? window.location.host;
      const lien = `${host}/${dataLink}`;

      navigator.clipboard
        .writeText(lien)
        .then(() => {
          copied.value = true;
          toast.info("Texte Copié");
          setTimeout(() => {
            copied.value = false;
          }, 2000);
        })
        .catch((err) => {
          console.error("Échec de la copie : ", err);
        });
    };

    // Function to navigate to Menu page
    const goToMenu = () => {
      router.push({
        name: "Menu",
        params: {
          domain: domain.value,
        },
      });
    };

    // Fetch event data when the component is mounted
    onMounted(() => {
      fetchEventData();
    });

    return {
      domain,
      companyList,
      message,
      error,
      goToMenu,
      publicDir,
      copyContent,
      showCompanyQR,
    };
  },
};
</script>

<template>
  <section class="scanner-area scanner-area-new">
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
    <div class="container">
      <div data-v-3f0f1f51="" class="row align-items-center">
        <div
          data-v-3f0f1f51=""
          class="col col-12 col-md-12 col-sm-12 scanner-bg-black"
        >
        
          <div data-v-3f0f1f51="" class="popup-logo">
            <div
              class="scanner-texts"
              v-for="(company, index) in companyList"
              :key="index"
            >
              <div data-v-3f0f1f51="">
                <b data-v-3f0f1f51=""> Nom de l'entreprise</b>
                <h3 data-v-3f0f1f51="" class="event-title">
                  {{ company.name }}
                </h3>
              </div>
              <div data-v-3f0f1f51="">
                <b data-v-3f0f1f51=""> Limace </b>
                <h3 data-v-3f0f1f51="" class="event-title">
                  {{ company.slug }}
                </h3>
              </div>
              <div data-v-3f0f1f51="">
                <b data-v-3f0f1f51=""> Lien </b>
                <h3 data-v-3f0f1f51="" class="event-title">
                  https://www.securecheck.info/{{ company.slug }}
                </h3>
              </div>
            </div>
            <div
              class="scanner-image"
              v-for="(company, index) in companyList"
              :key="index"
            >
              <a data-v-3f0f1f51="" href="/diner-aka" class="">
                <img
                  role="button"
                  @click="showCompanyQR(log?.slug)"
                  :src="`${publicDir}/qrcode-company/qrcode-${company.slug}.png`"
                  :alt="`No img`"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
