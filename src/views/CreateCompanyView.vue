<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { useUserInfo } from "@/services/useUserInfo";
import { toast } from "vue3-toastify";
import { /*useRoute,*/ useRoute, useRouter } from "vue-router";
import { useCompanies } from "@/services/useCompanies";

const currentRole = ref();
const roles = ref();

roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value?.roles[0];

const { userInfo, fetchUserInfo } = useUserInfo();
const { postCompany, showCompany, company, statusCode } = useCompanies();

const userStore = useUserStore();
const isAuthenticated = userStore.isAuthenticated();

const router = useRouter();
// const route = useRoute();
const fileName = ref();
const errorMessage = ref("");

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
  state: "",
  title: "",
  address: "",
  zipcode: "",
});

const onFileChange = (event) => {
  const selectedFile = event.target.files[0];
  // console.log(selectedFile);
  if (selectedFile) {
    companyReq.value.logo = selectedFile;
    // pdfUrl.value = URL.createObjectURL(selectedFile);
    fileName.value = selectedFile.name;
    // this.isValidFile = true;
    // this.errorMessage = '';
  } else {
    // this.isValidFile = false;
    errorMessage.value = "Veuillez selectionnez un fichier valide";
  }
};

const loading = ref(false);
const submitForm = async () => {
  try {
    await postCompany(companyReq.value);
    console.log(company);
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

// Watcher pour réagir aux changements du statusCode
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 201:
      toast.success("Entreprise créé avec succès.");
      setTimeout(() => {
        router.push({
          name: "Menu",
          params: {
            domain: domain.value,
          },
        });
      }, 1500);

      break;
    case 200:
      toast.success("Entreprise créé avec succès.");
      setTimeout(() => {
        // router.push("/");
        router.push({
          name: "Menu",
          params: {
            domain: domain.value,
          },
        });
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

const route = useRoute();
const domain = ref(route.params.domain || "scb-systems-africa");
const goToMenu = () => {
  router.push({
    name: "Menu",
    params: {
      domain: domain.value,
    },
  });
};

onBeforeMount(async () => {
    if (route?.params?.company_edit) {
    showCompany(route.params.slug);
    // companyReq.value = company.value;
  }

  await fetchUserInfo();
  console.log({ userInfo });
});
</script>

<template>
  <section class="request-meeting">
    <div class="background-gradi">
      <section class="request-meeting meeting-form">
        <div class="row align-items-center">
          <div class="col col-12 col-md-12 col-sm-12">
            <div
              class="d-flex justify-content-start mb-4 gap-3 align-items-center"
            >
              <button class="back" @click="goToMenu">Retour</button>
              <h3>Création Entreprise</h3>
            </div>

            <form @submit.prevent="submitForm" enctype="multipart/form-data">
              <div>
                <label for="logo">Logo</label><br />
                <input
                  type="file"
                  id="logo"
                  @change="onFileChange"
                  required
                  :class="{ error: errorMessage }"
                /><br />
              </div>

              <!-- <p>
                {{ fileName }}
              </p> -->

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
                <label for="id_number">Numéro d’identification</label><br />
                <input
                  type="text"
                  id="id_number"
                  v-model="companyReq.id_number"
                  required
                /><br />
              </div>
              <div>
                <label for="number_of_employee">Nombre d’employés</label><br />
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
                <label for="address">Adresse</label><br />
                <input
                  type="text"
                  id="address"
                  v-model="companyReq.address"
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
                <label for="state">Région/État</label><br />
                <input
                  type="text"
                  id="state"
                  v-model="companyReq.state"
                  required
                /><br />
              </div>

              <div>
                <label for="country">Country</label><br />
                <select
                  id="country"
                  v-model="companyReq.country"
                  class="input_style"
                  required
                >
                  <option value="" disabled>Select a country</option>
                  <option value="Côte d’ivoire">Côte d’ivoire</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cabo Verde">Cabo Verde</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Central African Republic">Central African Republic</option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czechia (Czech Republic)">Czechia (Czech Republic)</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Eswatini (fmr. Swaziland)">Eswatini (fmr. Swaziland)</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Greece">Greece</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Holy See">Holy See</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Korea (North)">Korea (North)</option>
                  <option value="Korea (South)">Korea (South)</option>
                  <option value="Kosovo">Kosovo</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesia">Micronesia</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar (Burma)">Myanmar (Burma)</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="North Macedonia">North Macedonia</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestine State">Palestine State</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Romania">Romania</option>
                  <option value="Russia">Russia</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="South Sudan">South Sudan</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syria">Syria</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Timor-Leste">Timor-Leste</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States of America">United States of America</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select><br />
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
                <label for="point_contact">Point of Contact</label><br />
                <input
                  type="text"
                  id="point_contact"
                  v-model="companyReq.point_contact"
                  required
                /><br />
              </div>

              <div>
                <label for="title">Titre</label><br />
                <input
                  type="text"
                  id="title"
                  v-model="companyReq.title"
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

              <div class="submit-button" v-if="isAuthenticated">
                <input type="submit" value="Soumettre" :disabled="loading" />
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
  float: left;
  width: 100%;
  font-size: 16px;
  color: #000000;
  font-weight: 500;
  font-family: "Futura Std";
  height: 40px;
  border-radius: 5px;
  border: 1px solid #000000 !important;
  outline: none;
  padding: 4px 10px;
}
</style>
