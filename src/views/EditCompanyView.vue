<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompanies } from "@/services/useCompanies";
import { toast } from "vue3-toastify";

const companyReq = ref({
  name: "",
  number_of_employee: "",
  email: "",
  phone_number: "",
  id_number: "",
  point_contact: "",
  company_field: "",
  country: "",
  city: "",
  address: "",
  zipcode: "",
});

const fileName = ref();
const errorMessage = ref("");

const { showCompany, company, statusCode ,updateCompany } = useCompanies();
const router = useRouter();
const route = useRoute();

// Handle file selection for logo
const onFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    companyReq.value.logo = selectedFile;
    fileName.value = selectedFile.name;
  } else {
    errorMessage.value = "Veuillez selectionnez un fichier valide";
  }
};

// Watch for changes in statusCode and react accordingly
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
      toast.success("Entreprise mise à jour avec succès.");
      setTimeout(() => {
        router.push("/menu/company-list");
      }, 1500);
      break;
    case 400:
      toast.info("La requête est mal formée.");
      break;
    case 401:
      toast.info("Vous devez être authentifié.");
      setTimeout(() => {
        router.push("/");
      }, 1500);
      break;
    case 403:
      toast.info("Vous n'avez pas la permission.");
      break;
    case 404:
      toast.info("La ressource demandée n'existe pas.");
      break;
    case 500:
      toast.info("Une erreur interne est survenue.");
      break;
    default:
      toast.info(`Code : ${newStatus}`);
  }
});

// Fetch the company data on component mount if `company_edit` route param exists
onBeforeMount(async () => {
  if (route?.params?.company_edit) {
    await showCompany(route.params.company_edit);
    companyReq.value = company.value;  // Assuming `showCompany` populates `company`
  }
});

const submitForm = async () => {
  try {
    if (route?.params?.company_edit) {
    await updateCompany(companyReq.value,route.params.company_edit);
  }
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  }
};

// Navigate back to the menu
const goToMenu = () => {
  router.push({ name: "Menu", params: { domain: route.params.domain } });
};
</script>

<template>
  <section class="request-meeting">
    <div class="background-gradi">
      <section class="request-meeting meeting-form">
        <div class="row align-items-center">
          <div class="col col-12 col-md-12 col-sm-12">
            <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
              <button class="back" @click="goToMenu">Retour</button>
              <h3>Editer l'Entreprise</h3>
            </div>

            <form @submit.prevent="submitForm" enctype="multipart/form-data">
              <div>
                <label for="logo">Logo</label><br />
                <input
                  type="file"
                  id="logo"
                  @change="onFileChange"
                  :class="{ error: errorMessage }"
                /><br />
                <p v-if="fileName">{{ fileName }}</p>
              </div>

              <div>
                <label for="name">Nom</label><br />
                <input
                  type="text"
                  id="name"
                  v-model="companyReq.name"
                  required
                /><br />
              </div>

              <div>
                <label for="address">Address</label><br />
                <input
                  type="text"
                  id="address"
                  v-model="companyReq.address"
                  required
                /><br />
              </div>
              
              <div>
                <label for="id_number">ID Number</label><br />
                <input
                  type="text"
                  id="id_number"
                  v-model="companyReq.id_number"
                  required
                /><br />
              </div>

              <div>
                <label for="point_contact">Point of Contact</label><br />
                <input
                  type="text"
                  id="point_contact"
                  v-model="companyReq.point_contact"
                  required
                /><br />
              </div>

              <div>
                <label for="email">Email</label><br />
                <input
                  type="email"
                  id="email"
                  v-model="companyReq.email"
                  required
                /><br />
              </div>

              <div>
                <label for="phone_number">Phone number</label><br />
                <input
                  type="text"
                  id="phone_number"
                  v-model="companyReq.phone_number"
                  required
                /><br />
              </div>

              <div>
                <label for="company_field">Company Field or Industry</label><br />
                <input
                  type="text"
                  id="company_field"
                  v-model="companyReq.company_field"
                  required
                /><br />
              </div>
            
              <div>
                <label for="country">Country</label><br />
                <input
                  type="text"
                  id="country"
                  v-model="companyReq.country"
                  required
                /><br />
              </div>

              <div>
                <label for="city">City</label><br />
                <input
                  type="text"
                  id="city"
                  v-model="companyReq.city"
                  required
                /><br />
              </div>

              <div>
                <label for="number_of_employee">Number of employee</label><br />
                <select
                  v-model="companyReq.number_of_employee"
                  id="number_of_employee"
                  name="number_of_employee"
                  class="input_style"
                >
                  <option value="0-5">0-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-100">51-100</option>
                  <option value="101-1000">101-1000</option>
                  <option value="+1000">+1000</option>

                  </select
                ><br />
              </div>


              <div>
                <label for="zipcode">Zip Code </label><br />
                <input
                  type="zipcode"
                  id="zipcode"
                  v-model="companyReq.zipcode"
                  required
                /><br />
              </div>
              <div class="submit-button">
                <input type="submit" value="Soumettre" />
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
  border-color: red;
}
.input_style {
  width: 100%;
  font-size: 16px;
  color: #000;
  font-weight: 500;
  font-family: "Futura Std";
  height: 40px;
  border-radius: 5px;
  border: 1px solid #000 !important;
  outline: none;
  padding: 4px 10px;
}
</style>
