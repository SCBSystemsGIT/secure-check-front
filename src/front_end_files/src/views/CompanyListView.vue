<script>
import myService from "@/services/useCompanyList"; // Adjust the path based on your project structure
import { useGlobalStore } from "@/stores/globalStore";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export default {
  name: "CompanyListView",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb");
    const companyList = ref([]);
    const message = ref("");
    const error = ref(null);
    const { publicDir } = useGlobalStore();
    
    // Function to fetch event data
    const fetchEventData = async () => {
      try {
        const response = await myService.fetchData(); // Fetch the data from the service
        console.log('Fetched Response:', response);
        companyList.value = response.data; // Store the fetched logs in the ref
        message.value = "Data fetched successfully!"; // Set a success message
      } catch (err) {
        error.value = "Failed to fetch data."; // Set an error message if the fetch fails
        console.error(err);
      }
    };

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
      showCompanyQR
    };
  },
};
</script>


<template>
  <div class="container">
    <!-- Back Button and Header -->
    <div class="d-flex justify-content-center align-items-center">
      <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
        <button class="back" @click="goToMenu()">Retour</button>
        <h3 class="mt-3" v-if="route?.params?.slug">Liste Participants</h3>
        <h3 class="mt-3" v-else>Lista de Entreprise </h3>
      </div>
    </div>

    <!-- Event Name Display -->
    <div class="text-center">
      <h4 v-if="route?.params?.slug">Evenements : {{ event?.name }}</h4>
    </div>

    <!-- Visitor Logs Table -->
    <div class="d-flex justify-content-center py-3">
      <table v-if="companyList.length" class="mdc-data-table__table">
		<thead>
			<tr class="mdc-data-table__header-row">
				<th class="mdc-data-table__header-cell" role="columnheader" aria-sort="none"><div class="mdc-data-table__header-cell-wrapper">ID</div></th>
				<th class="mdc-data-table__header-cell" role="columnheader" aria-sort="none"><div class="mdc-data-table__header-cell-wrapper">Nom de l'entreprise</div></th>
				<th class="mdc-data-table__header-cell" role="columnheader" aria-sort="none"><div class="mdc-data-table__header-cell-wrapper">Description</div></th>
				<th class="mdc-data-table__header-cell" role="columnheader" aria-sort="none"><div class="mdc-data-table__header-cell-wrapper">
          Limace</div></th>
        <th class="mdc-data-table__header-cell" role="columnheader" aria-sort="none"><div class="mdc-data-table__header-cell-wrapper">Lien</div></th>
				<th class="mdc-data-table__header-cell" role="columnheader" aria-sort="none"><div class="mdc-data-table__header-cell-wrapper">QRCode</div></th>
        <th class="mdc-data-table__header-cell" role="columnheader" aria-sort="none"><div class="mdc-data-table__header-cell-wrapper">Logo</div></th>
			</tr>
		</thead>
        <tbody>
          <tr v-for="log in companyList" :key="log.id" class="mdc-data-table__row">
            <td class="mdc-data-table__cell">{{ log.id }}</td>
            <td class="mdc-data-table__cell">{{ log.name }}</td>
            <td class="mdc-data-table__cell">{{ log.description }}</td>
            <td class="mdc-data-table__cell">{{ log.slug }}</td>
            <td class="mdc-data-table__cell"> 
              <i data-v-74f17804="" class="material-icons" aria-hidden="true" role="button" 
                @click="copyContent(log.slug)"> content_copy</i>
            </td>
            <td class="mdc-data-table__cell"><img role="button" @click="showCompanyQR(log?.slug)" width="100px" height="100px" class="logo_qr" :src="`${publicDir}/qrcode-company/qrcode-${log.slug}.png`" 
              :alt="`No img`"/></td>
            <td> <img :src="`${publicDir}/logo/${log?.logo}`" class="" height="75" width="75"
                style="margin-top: 20px; margin-bottom: 20px" :alt="log.logo"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
