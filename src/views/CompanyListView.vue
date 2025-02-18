<script>
import apiClient from "@/plugins/axios";
import myService from "@/services/useCompanyList";
import { ref, computed, onMounted ,onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGlobalStore } from "@/stores/globalStore";
import { toast } from "vue3-toastify";
import { useUserStore } from "@/stores/useUserStore";
import { useCompanies } from "@/services/useCompanies";


export default {
  name: "CompanyListView",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb");
    const companyList = ref([]);
    const message = ref("");
    const urlParamsval = ref(""); // Store the URL parameter
    const error = ref(null);
    const { publicDir } = useGlobalStore();
    const userStore = useUserStore();
    const roles = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
    const currentRole = ref(roles?.value?.roles ? roles.value.roles[0] : "");
    const { showCompany, company } = useCompanies();


    console.log('roles',roles)
    console.log('currentRole',currentRole)

    // Form-related states
    const formData = ref({
      id: "", // Form's ID field
      name: "", // Form's name field
      description: "", // Form's description field
    });
    const file = ref(null); // File input state

    // Function to fetch event data
    const fetchEventData = async () => {
      try {
        const response = await myService.fetchData(); // Fetch the data from the service
        console.log("Fetched Response:", response);
        companyList.value = response.data; // Store the fetched logs in the ref
        message.value = "Data fetched successfully!"; // Set a success message

        // Extract 'compid' from the URL
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(new URL(currentUrl).search);
        if (urlParams.has("compid")) {
          urlParamsval.value = urlParams.get("compid");
        }
      } catch (err) {
        error.value = "Failed to fetch data."; // Set an error message if the fetch fails
        console.error(err);
      }
    };

    // Computed property to filter company list based on urlParamsval
    const filteredCompanyList = computed(() => {
      return companyList.value.filter((log) => log.id == urlParamsval.value);
    });

    const showCompanyQR = (slug) => {
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
      // const lien = `${host}/${dataLink}`;
      const lien = `https://${host}/${dataLink}`;
      navigator.clipboard.writeText(lien)
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

    const goToMenu = () => {
      router.push({
        name: "Menu",
        params: {
          domain: domain.value,
        },
      });
    };

    // File input handler
    const handleFileUpload = (event) => {
    file.value = event.target.files[0]; // Capture the selected file
    console.log("Selected file:", file.value);
};


    // Syncing formData with log data using computed property
    const syncedName = computed({
      get: () => formData.value.name, // Get the name from formData
      set: (newValue) => {
        formData.value.name = newValue; // Update formData.name
        const selectedLog = filteredCompanyList.value[0]; // Assuming there's one selected log
        if (selectedLog) selectedLog.name = newValue; // Sync with selected log
      },
    });

    const syncedDescription = computed({
      get: () => formData.value.description,
      set: (newValue) => {
        formData.value.description = newValue;
        const selectedLog = filteredCompanyList.value[0]; // Assuming there's one selected log
        if (selectedLog) selectedLog.description = newValue; // Sync with selected log
      },
    });

    // Submit form method

    const submitForm = async () => {
    try {
        if (!urlParamsval.value) {
            console.error("ID is required for updating the record.");
            return;
        }
        console.log("Form data being sent:", formData.value);
        console.log("File being sent:", file.value);

        // Prepare form data to be sent in the PUT request
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.value.name); // Directly append without encoding
        formDataToSend.append("description", formData.value.description); // Directly append without encoding
        formDataToSend.append("slug", filteredCompanyList.value[0]?.slug || "default-slug"); // Use default value for slug if empty
        if (file.value) {
            formDataToSend.append("logo", file.value);
        }

        // Debug form data
        for (const pair of formDataToSend.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        // Send PUT request to update the company data
        const response = await apiClient.put(`/company/${urlParamsval.value}`, formDataToSend, {
            headers: {
                //"Content-Type": "multipart/form-data", 
            },
        });

        console.log("Form submitted successfully:", response.data);
        message.value = "Form submitted successfully!";
    } catch (err) {
        error.value = "Failed to submit form.";
        console.error("Error submitting form:", err.response ? err.response.data : err);
    }
};



    // Fetch event data when the component is mounted
    onMounted(async() => {
      
      fetchEventData();
    });
    onBeforeMount(async () => {
      if (userStore.isSupervisor(currentRole?.value)) {
          await showCompany(roles?.value?.company);
        } 
      });
    return {
      domain,
      companyList,
      urlParamsval,
      message,
      error,
      goToMenu,
      publicDir,
      copyContent,
      showCompanyQR,
      filteredCompanyList, // Return the computed property
      formData, // Bind form data
      file, // Bind file input
      handleFileUpload, // Handle file input
      submitForm, // Submit the form
      syncedName, // Use this for v-model in template
      syncedDescription, // Use this for v-model in template
      userStore,
      currentRole,
      showCompany,
      company
    };
  },
};
</script>


<template>
  <div class="container">
    <div class="d-flex justify-content-center align-items-center">
      <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
        <button class="back" @click="goToMenu()">Retour</button>
        <h3 class="mt-3" v-if="route?.params?.slug">Liste Participants</h3>
        <h3 class="mt-3" v-else>Lista de Entreprise </h3>
      </div>
    </div>

    <div v-if="urlParamsval">
      <div v-if="filteredCompanyList.length">
        <div v-for="log in filteredCompanyList" :key="log.id">
          <section class="request-meeting">
            <div class="background-gradi">
              <section class="request-meeting meeting-form">
                <div class="row align-items-center">
                  <div class="col col-12 col-md-12 col-sm-12">
                    <form @submit.prevent="submitForm()" enctype="multipart/form-data">
                      <div>
                        <label for="logo">Logo</label>
                        <br />
                        <input type="file" id="logo" @change="handleFileUpload" />
                        <br />
                      </div>

                      <div>
                        <label for="name">Nom</label>
                        <br />
                        <input type="text" id="name" v-model="formData.name" required />
                        <br />
                      </div>

                      <div>
                        <label for="description">Description</label>
                        <br />
                        <input type="text" id="description" v-model="formData.description" required />
                        <br />
                      </div>

                      <div class="submit-button">
                        <input type="submit" value="Soumettre" />
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div v-if="company">
      <div class="company-details">
        <table class="mdc-data-table__table">
          <thead>
            <tr class="mdc-data-table__header-row">
              <th class="mdc-data-table__header-cell">ID</th>
              <th class="mdc-data-table__header-cell">Nom de l'entreprise</th>
              <th class="mdc-data-table__header-cell">Limace</th>
              <th class="mdc-data-table__header-cell">Lien</th>
              <th class="mdc-data-table__header-cell">QRCode</th>
              <th class="mdc-data-table__header-cell">Logo</th>
              <th class="mdc-data-table__header-cell">Employees</th>
              <th class="mdc-data-table__header-cell" 
                  v-if="userStore.isSuperAdmin(currentRole) ||
                  userStore.isSecureCheck(currentRole)">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            <tr :key="company.id" class="mdc-data-table__row">
              <td class="mdc-data-table__cell">{{ company.id }}</td>
            <td class="mdc-data-table__cell">{{ company.name }}</td>
            <td class="mdc-data-table__cell">{{ company.slug }}</td>
            <td class="mdc-data-table__cell">
              <i
                class="material-icons"
                @click="copyContent(company.slug)"
                role="button"
              >
                content_copy
              </i>
            </td>
            <td class="mdc-data-table__cell">
              <img
                role="button"
                @click="showCompanyQR(company?.slug)"
                width="100px"
                height="100px"
                :src="`${publicDir}/qrcode-company/qrcode-${company?.slug}.png`"
                alt="No img"
              />
            </td>
            <td>
              <img
                :src="`${publicDir}/logo/${company?.logo}`"
                height="75"
                width="75"
                style="margin-top: 20px; margin-bottom: 20px"
                :alt="company.logo"
              />
            </td>
            <td>
              <router-link :to="{ name: 'EmployeeListView', params: { slug: company.slug } }">View</router-link>
            </td>
            <td class="mdc-data-table__cell" v-if="
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                ">
              <!-- Navigate to the edit page with the company ID as a parameter -->
              <router-link :to="{ name: 'EditCreateCompany', params: { company_edit: company.id } }">Edit</router-link>
            </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="d-flex justify-content-center py-3 table_compdata">
      <table v-if="companyList.length" class="mdc-data-table__table">
        <thead>
          <tr class="mdc-data-table__header-row">
            <th class="mdc-data-table__header-cell">ID</th>
            <th class="mdc-data-table__header-cell">Nom de l'entreprise</th>
            <th class="mdc-data-table__header-cell">Limace</th>
            <th class="mdc-data-table__header-cell">Lien</th>
            <th class="mdc-data-table__header-cell">QRCode</th>
            <th class="mdc-data-table__header-cell">Logo</th>
            <th class="mdc-data-table__header-cell">Employees</th>
            <th class="mdc-data-table__header-cell" 
            v-if="
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isSecureCheck(currentRole) ||
                  userStore.isSupervisor(currentRole)
                "
            >Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in companyList" :key="log.id" class="mdc-data-table__row">
            <td class="mdc-data-table__cell">{{ log.id }}</td>
            <td class="mdc-data-table__cell">{{ log.name }}</td>
            <td class="mdc-data-table__cell">{{ log.slug }}</td>
            <td class="mdc-data-table__cell">
              <i
                class="material-icons"
                @click="copyContent(log.slug)"
                role="button"
              >
                content_copy
              </i>
            </td>
            <td class="mdc-data-table__cell">
              <img
                role="button"
                @click="showCompanyQR(log?.slug)"
                width="100px"
                height="100px"
                :src="`${publicDir}/qrcode-company/qrcode-${log.slug}.png`"
                alt="No img"
              />
            </td>
            <td>
              <img
                :src="`${publicDir}/logo/${log?.logo}`"
                height="75"
                width="75"
                style="margin-top: 20px; margin-bottom: 20px"
                :alt="log.logo"
              />
            </td>
            <td>
              <router-link :to="{ name: 'EmployeeListView', params: { slug: log.slug } }">View</router-link>
            </td>
            <td class="mdc-data-table__cell" v-if="
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isAdmin(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                ">
              <!-- Navigate to the edit page with the company ID as a parameter -->
              <router-link :to="{ name: 'EditCreateCompany', params: { company_edit: log.id } }">Edit</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

