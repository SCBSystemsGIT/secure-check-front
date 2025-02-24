<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useCreateVisitor } from "@/services/useCreateVisitor";
import { useUserStore } from "@/stores/useUserStore";
import { useUserInfo } from "@/services/useUserInfo";
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from "vue-router";
import { useVisitRequest } from "@/services/useVisitRequest";
import { useEvent } from "@/services/useEvent";
import { useCompanies } from "@/services/useCompanies";
// import { useCompanies } from "@/services/useCompanies";

const currentRole = ref();
const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value?.roles[0];

const { userInfo, fetchUserInfo } = useUserInfo();
const { createVisitor, statusCode, visitorId } = useCreateVisitor();
const { createVisitRequest, requestId, statusCodeReq } = useVisitRequest();
const { showCompany, company } = useCompanies();

const { showEvent, event } = useEvent();
const userStore = useUserStore();
const isAuthenticated = userStore.isAuthenticated();

const router = useRouter();
const route = useRoute();

const visitor = ref({
  user_id: userInfo?.value?.id,
  evenements_id: event?.value?.id ?? null,
  company_id: company?.value?.id ?? null,
  firstname: "",
  lastname: "",
  email: "",
  contact: "",
  address: "",
  id_number: "",
  organisation_name: "",
  visitor_type: "",
  country: "",
  state: "",
  city: "",
  zipcode: "",
  request_date: "",
  request_time: "",
});

const visitRequest = ref({
  user_id: userInfo?.value?.id,
  visitor_id: "",
  host: "",
  reason: "",
});

const errorMessage = ref("");
const loading = ref(false);

const submitForm = async () => {
  visitor.value.user_id = userInfo?.value?.id;

  try {
    visitor.value.evenements_id = event?.value?.id;
    visitor.value.company_id = company?.value?.id;
    await createVisitor(visitor.value);

    visitRequest.value.visitor_id = visitorId.value;
    visitRequest.value.user_id = userInfo?.value?.id;
    visitRequest.value.user_id = userInfo?.value?.id;

    await createVisitRequest(visitRequest.value);
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

const domain = ref(route.params.domain || "scb");
const title = ref("");

onBeforeMount(async () => {
  if (route.params.slug) {
    await showEvent(route.params.slug);
    title.value = event.value.name;
  }

  if (domain.value) {
    await showCompany(domain.value);

    router.push({
      name: "CreateVisitor",
      params: {
        domain: domain.value,
      },
    });
  }

  await fetchUserInfo();
});

// Watcher pour réagir aux changements du statusCode
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 201:
      if (isAuthenticated) {
        toast.success("Visiteur créé avec succès.");

        if (userStore.isEmployee(currentRole.value)) {
          // setTimeout(() => {
          //   router.push("/menu");
          // }, 1500);
        } else {
          // if (requestId?.value) {
          //   setTimeout((requestId) => {
          //     router.push("/waiting-validation/" + requestId.value);
          //   }, 1500);
          // } else {
          //   console.error("requestId est null ou undefined.");
          // }
        }
      } else {
        toast.success("Demande créé avec succès.");
        // alert(201)

        setTimeout(() => {
          router.push({
            name: "RequestMeeting",
            params: {
              domain: domain.value,
              id: requestId.value,
            },
          });
        }, 2000);
      }

      break;
    case 200:
      if (isAuthenticated) {
        toast.success("Visiteur créé avec succès.");
        // Si connecter en temps que isEmployee
        if (userStore.isEmployee(currentRole.value)) {
          setTimeout(() => {
            router.push({
              name: "WaitingValidation",
              params: {
                domain: domain,
                id: requestId.value,
              },
            });
          }, 1500);
        } else {
          toast.success("Visiteur créé avec succès.");

          router.push({
            name: "Menu",
            params: {
              domain: domain,
            },
          });
        }
      } else {
        toast.success("Demande créé avec succès.");
        alert(200);

        setTimeout(() => {
          router.push({
            name: "RequestMeeting",
            params: {
              domain: domain.value,
              id: requestId.value,
            },
          });
        }, 1500);
      }
      break;
    case 400:
      toast.info("La requête est mal formée.");
      break;
    case 401:
      toast.info("Vous devez être authentifié.");

      setTimeout(() => {
        router.push({
          name: "RequestMeeting",
          params: {
            domain: domain,
            id: requestId.value,
          },
        });
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

watch(statusCodeReq, (newStatusReq) => {
  switch (newStatusReq) {
    case 201:
      if (requestId?.value) {
        setTimeout(() => {
          router.push({
            name: "WaitingValidation",
            params: {
              domain: domain.value,
              id: requestId.value,
            },
          });
        }, 1500);
      } else {
        console.error("requestId est null ou undefined.");
      }
      break;

    default:
      break;
  }
});
</script>

<template>
  <section class="request-meeting">
    <div class="background-gradi">
      <section class="request-meeting meeting-form">
        <div class="row align-items-center">
          <div class="col col-12 col-md-12 col-sm-12">
            <div
              class="d-flex justify-content-start align-items-center gap-5 mb-3"
            >
              <button
                class="back"
                @click="router.push(`/${domain}/request-meeting`)"
              >
                Retour
              </button>

              <h3 class="text-center" v-if="company">
                {{ company.name }}
              </h3>
            </div>

            <h3 class="text-center pb-3" v-if="title">
              {{ title }}
            </h3>

            <form @submit.prevent="submitForm">
              <!-- <div  v-if="userStore.isAuthenticated()">
                <label for="visitor_type">Type de visiteur</label><br />
                <select
                  name="visitor_type"
                  id="visitor_type"
                  class="form-control"
                  v-model="visitor.visitor_type"
                >
                  <option value="2">Temporaire</option>
                  <option value="1">
                    Permanent
                  </option>
                </select>
              </div> -->

              <div>
                <label for="firstname">Prénom</label><br />
                <input
                  type="text"
                  id="firstname"
                  v-model="visitor.firstname"
                  required
                /><br />
              </div>

              <div>
                <label for="lastname">Nom</label><br />
                <input
                  type="text"
                  id="lastname"
                  v-model="visitor.lastname"
                  required
                /><br />
              </div>

              <div>
                <label for="id_number">Numéro de pièce d’identité</label><br />
                <input
                  type="text"
                  id="id_number"
                  v-model="visitor.id_number"
                  required
                /><br />
              </div>

              <div>
                <label for="file"> Pièce d’identité</label><br />
                <input type="file" id="file" @change="uploadFile" /><br />
              </div>

              <div>
                <label for="address">Adresse</label><br />
                <input
                  type="text"
                  id="address"
                  v-model="visitor.address"
                  required
                /><br />
              </div>

              <div>
                <label for="city">Ville</label><br />
                <input
                  type="text"
                  id="city"
                  v-model="visitor.city"
                  required
                /><br />
              </div>

              <div>
                <label for="state">Région/État</label><br />
                <input
                  type="text"
                  id="state"
                  v-model="visitor.state"
                  required
                /><br />
              </div>

              <div>
                <label for="country">Pays</label><br />
                <select
                  id="country"
                  v-model="visitor.country"
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
                <label for="zipcode">Code Postale</label><br />
                <input
                  type="text"
                  id="zipcode"
                  v-model="visitor.zipcode"
                  required
                /><br />
              </div>

              <div>
                <label for="organisation_name">Employeur</label><br />
                <input
                  type="text"
                  id="organisation_name"
                  v-model="visitor.organisation_name"
                  required
                /><br />
              </div>

              <div>
                <label for="request_date">Meeting Date</label><br />
                <input
                  type="date"
                  id="request_date"
                  v-model="visitor.request_date"
                  required
                /><br />
              </div>

              <div>
                <label for="request_time">Meeting Time</label><br />
                <input
                  type="time"
                  id="request_time"
                  v-model="visitor.request_time"
                  required
                /><br />
              </div>

              <div>
                <label for="h-name">Nom d’hôte</label><br />
                <input
                  type="text"
                  id="h-name"
                  name="h-name"
                  v-model="visitRequest.host"
                /><br />
              </div>

              <div>
                <label for="reason">Reason</label><br />
                <input
                  type="text"
                  id="reason"
                  name="reason"
                  v-model="visitRequest.reason"
                /><br />
              </div>

              <div>
                <label for="email">Email</label><br />
                <input
                  type="email"
                  id="email"
                  v-model="visitor.email"
                  required
                /><br />
              </div>


              <div>
                <label for="contact">Contact</label><br />
                <input
                  type="text"
                  id="contact"
                  v-model="visitor.contact"
                  required
                /><br />
              </div>


              <div class="submit-button">
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

<style>
.back {
  border-radius: 10px;
  padding: 0.4rem;
  background-color: #fff;
  background: #0097b9;
  color: #ffffff;
  padding-left: 10px;
  padding-right: 10px;
  border-color: #0097b9;
  margin-left: 4px;
}
</style>
