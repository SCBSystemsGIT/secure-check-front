<script setup>
import { onMounted, onBeforeMount, ref, watch } from "vue";

import { useUserStore } from "@/stores/useUserStore";
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from "vue-router";
import { useCompanies } from "@/services/useCompanies";
import { useEvent } from "@/services/useEvent";
import { useGlobalStore } from "@/stores/globalStore";

const { company } = useGlobalStore();
const { showCompany, companies, fetchCompanies } = useCompanies();
const { createEvent, statusCode } = useEvent();
const { publicDir } = useGlobalStore();
const userStore = useUserStore();

const errorMessage = ref("");
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const isAuthenticated = userStore.isAuthenticated();

const domain = ref(route.params.domain || "scb-systems-africa");

// Retrieve user info
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const currentRole = ref(userInfo?.roles?.[0] || "");
const userCompanyId = ref(userInfo?.company_id || "");
const userCompanyName = ref(userInfo?.company || "");

// Initialize event object
const event = ref({
  company_id:
    currentRole.value === "ROLE_SUPERVISOR" ? userCompanyId.value : "",
  name: "",
  location: "",
  date_event: "",
  time_event: "",
  departement_id: 1,
});

// Ensure the correct `company_id` is assigned when role is ROLE_SUPERVISOR
watch(userCompanyId, (newVal) => {
  if (currentRole.value === "ROLE_SUPERVISOR") {
    event.value.company_id = newVal;
  }
});

// Fetch company data on mount
onMounted(async () => {
  await fetchCompanies();
});

// Load company info on before mount
onBeforeMount(async () => {
  try {
    let company_slug = localStorage.getItem("currentCompany") ?? domain?.value;
    if (company_slug) {
      await showCompany(company_slug);
    }

    if (!isAuthenticated) {
      toast.info("L'utilisateur doit être connecté");
      setTimeout(() => {
        router.push({
          name: "RequestMeeting",
          params: { domain: domain?.value },
        });
      }, 1500);
    }
  } catch (error) {
    console.error("Error during onBeforeMount:", error);
    toast.error("Erreur lors du chargement des données.");
  }
});

// Form submission
const submitForm = async () => {
  loading.value = true;
  try {
    await createEvent(event.value);
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

// Watch API response status
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
    case 201:
      toast.success("Événement ajouté");
      setTimeout(() => {
        router.push({ name: "Menu", params: { domain: domain.value } });
      }, 1500);
      break;
    case 400:
      toast.info("La requête est mal formée.");
      break;
    case 401:
      toast.info("Vous devez être authentifié.");
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
            <div class="d-flex justify-content-center align-items-center">
              <div
                class="d-flex justify-content-start mb-4 gap-3 align-items-center"
              >
                <!-- <button class="back" @click="router.push({ name: 'Menu', params: { domain } })">
                  Retour
                </button> -->
                <h3 class="mt-3">Création Événement</h3>
              </div>
            </div>

            <!-- Company Logo -->
            <div class="d-flex justify-content-center" v-if="company?.logo">
              <img
                :src="`${publicDir}/logo/${company?.logo}`"
                height="100"
                width="100"
              />
            </div>

            <form @submit.prevent="submitForm">
              <!-- Company Selection -->
              <div>
                <label for="company_id">Entreprise</label>
                <input
                  v-if="currentRole === 'ROLE_SUPERVISOR'"
                  disabled
                  type="text"
                  id="company_name"
                  v-model="userCompanyName"
                  required
                />
                <input
                  v-if="currentRole === 'ROLE_SUPERVISOR'"
                  type="hidden"
                  id="company_id"
                  name="company_id"
                  v-model="event.company_id"
                />
                <select
                  v-if="currentRole !== 'ROLE_SUPERVISOR'"
                  id="company_id"
                  v-model="event.company_id"
                  class="form-control"
                >
                  <option
                    v-for="company in companies"
                    :key="company.id"
                    :value="company.id"
                  >
                    {{ company.name }}
                  </option>
                </select>
              </div>

              <!-- Event Name -->
              <div>
                <label for="name">Nom de l'événement</label>
                <input
                  type="text"
                  id="name"
                  v-model="event.name"
                  placeholder="Diner Gala SIKIHHK"
                  required
                />
              </div>

              <!-- Event Location -->
              <div>
                <label for="location">Lieu de l'événement</label>
                <input
                  type="text"
                  id="location"
                  v-model="event.location"
                  placeholder="SOCOCE"
                  required
                />
              </div>

              <!-- Address -->
              <div>
                <label for="address_name">Adresse</label>
                <input
                  type="text"
                  id="address_name"
                  v-model="event.address_name"
                  placeholder="Marcory"
                  required
                />
              </div>

              <div>
                <label for="">Ville  </label>
                <input
                  type="text"
                  id="city"
                  v-model="event.city"
                  @focus="inputFocused = 'city'"
                  @blur="inputFocused = ''"
                />
              </div>

              <div >
                    <label for="">Pays </label>
                    <select
                      id="country"
                      v-model="event.country"
                      class="form-select"
                      aria-label="Default select example"
                      @focus="inputFocused = 'country'"
                      @blur="inputFocused = ''"
                    >
                      <option value="" disabled selected>
                        Sélectionner un pays
                      </option>
                      <option value="Côte d’ivoire">Côte d'ivoire</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albania">Albania</option>
                      <option value="Algeria">Algeria</option>
                      <option value="Andorra">Andorra</option>
                      <option value="Angola">Angola</option>
                      <option value="Antigua and Barbuda">
                        Antigua and Barbuda
                      </option>
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
                      <option value="Bosnia and Herzegovina">
                        Bosnia and Herzegovina
                      </option>
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
                      <option value="Central African Republic">
                        Central African Republic
                      </option>
                      <option value="Chad">Chad</option>
                      <option value="Chile">Chile</option>
                      <option value="China">China</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Comoros">Comoros</option>
                      <option value="Congo (Congo-Brazzaville)">
                        Congo (Congo-Brazzaville)
                      </option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Croatia">Croatia</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Czechia (Czech Republic)">
                        Czechia (Czech Republic)
                      </option>
                      <option value="Denmark">Denmark</option>
                      <option value="Djibouti">Djibouti</option>
                      <option value="Dominica">Dominica</option>
                      <option value="Dominican Republic">
                        Dominican Republic
                      </option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="Egypt">Egypt</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="Equatorial Guinea">
                        Equatorial Guinea
                      </option>
                      <option value="Eritrea">Eritrea</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Eswatini (fmr. Swaziland)">
                        Eswatini (fmr. Swaziland)
                      </option>
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
                      <option value="Saint Kitts and Nevis">
                        Saint Kitts and Nevis
                      </option>
                      <option value="Saint Lucia">Saint Lucia</option>
                      <option value="Saint Vincent and the Grenadines">
                        Saint Vincent and the Grenadines
                      </option>
                      <option value="Samoa">Samoa</option>
                      <option value="San Marino">San Marino</option>
                      <option value="Sao Tome and Principe">
                        Sao Tome and Principe
                      </option>
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
                      <option value="Trinidad and Tobago">
                        Trinidad and Tobago
                      </option>
                      <option value="Tunisia">Tunisia</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Turkmenistan">Turkmenistan</option>
                      <option value="Tuvalu">Tuvalu</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="United Arab Emirates">
                        United Arab Emirates
                      </option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States of America">
                        United States of America
                      </option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Vanuatu">Vanuatu</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Yemen">Yemen</option>
                      <option value="Zambia">Zambia</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                  </div>

                  <div >
                    <label for=""
                      >Region / Etat  </label
                    >
                    <input
                      type="text"
                      id="state"
                      v-model="event.state"
                      @focus="inputFocused = 'state'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div >
                    <label for=""
                      >Code postale  </label
                    >
                    <input
                      type="text"
                      id="zipcode"
                      v-model="event.zipcode"
                      @focus="inputFocused = 'zipcode'"
                      @blur="inputFocused = ''"
                    />
                  </div>

              <!-- Event Date -->
              <div>
                <label for="date_event">Date de l'événement</label>
                <input
                  type="date"
                  id="date_event"
                  v-model="event.date_event"
                  required
                />
              </div>

              <!-- Event Time -->
              <div>
                <label for="time_event">Heure de l'événement</label>
                <input
                  type="time"
                  id="time_event"
                  v-model="event.time_event"
                  required
                />
              </div>

              <!-- Submit Button -->
              <div class="event_button">
                <input type="submit" value="Soumettre" :disabled="loading" />
              </div>

              <!-- Error Message -->
              <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
