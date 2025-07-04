<script setup>
import { onBeforeMount, ref, watch, computed } from "vue";
import { useCreateVisitor } from "@/services/useCreateVisitor";
import { useUserStore } from "@/stores/useUserStore";
import { useUserInfo } from "@/services/useUserInfo";
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from "vue-router";
import { useVisitRequest } from "@/services/useVisitRequest";
import { useEvent } from "@/services/useEvent";
import { useCompanies } from "@/services/useCompanies";
// import { useCompanies } from "@/services/useCompanies";
import { onMounted } from "vue";
import $ from "jquery";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
//import moment from 'moment';

import "@/assets/style-form1.css"; // Importer le fichier CSS form

const inputFocused = ref(""); // Garde en mémoire l'input qui a le focus

// Reactive properties for data binding
const hours = ref(null);
const minutes = ref(null);
//const date = ref('');

//let datetime = "";

const dateValidation = ref("");

onMounted(() => {
  // Charger jQuery et autres bibliothèques dynamiquement
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };


  Promise.all([
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"),
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"),
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"),
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/formatter.js/0.1.5/formatter.min.js"),
    loadScript("https://unpkg.com/flatpickr"),
    loadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"),
  ])
    .then(() => {
      console.log("Tous les scripts sont chargés !");

      // Vérifier si flatpickr est bien chargé
      if (window.flatpickr) {
        console.log("Flatpickr est bien chargé !");

        // Initialiser Flatpickr sur l'input #datepicker
        flatpickr("#datepicker", {
          dateFormat: "d/m/Y", // Format de la date
          onChange: checkDate, // Votre fonction de gestion de la date
        });
      } 
    })
    .catch((error) => {
      console.error("Erreur de chargement des scripts:", error);
    });

  // Les autres initialisations de fonctions
  populateHours();
  populateMinutes();

  // jQuery event listeners (uniquement si vous en avez besoin)
  $("#datepicker").blur(() => {
    setTimeout(checkDate, 200);
  });

  $("#hours").blur(() => {
    checkHours();
  });

  $("#minutes").blur(() => {
    checkMinutes();
  });
});

// Methods for populating hours and minutes options
function populateHours() {
  const hourSelect = $("#hours");
  for (let i = 1; i < 24; i++) {
    const opt = document.createElement("option");
    opt.value = i < 10 ? `0${i}` : i;
    opt.innerHTML = i < 10 ? `0${i}` : i;
    hourSelect.append(opt);
  }
}

function populateMinutes() {
  const minuteSelect = $("#minutes");
  for (let i = 0; i < 60; i++) {
    const opt = document.createElement("option");
    opt.value = i < 10 ? `0${i}` : i;
    opt.innerHTML = i < 10 ? `0${i}` : i;
    minuteSelect.append(opt);
  }
}

// Date validation function
function checkDate() {
  let validDate = true;
  const dateString = $("#datepicker").val();

  if (!dateString) {
    validDate = false;
    $("#datepicker").addClass("error");
    $("#dateValidation").text("Date not selected");
  } else {
    // Basic format validation (DD/MM/YYYY)
    if (dateString.substr(2, 1) !== "/" || dateString.substr(5, 1) !== "/") {
      validDate = false;
    }

    if (dateString.length !== 10) {
      validDate = false;
    }
  }

  // If the date is valid
  if (validDate) {
    $("#datepicker").removeClass("error");
    dateValidation.value = "Valid Date";
  } else {
    $("#datepicker").addClass("error");
    dateValidation.value = "Invalid Date";
  }
}

// Validate time selection (hours and minutes)
function checkHours() {
  if (hours.value === "HH") {
    $("#hours").addClass("error");
  } else {
    $("#hours").removeClass("error");
  }
}

function checkMinutes() {
  if (minutes.value === "MM") {
    $("#minutes").addClass("error");
  } else {
    $("#minutes").removeClass("error");
  }
}

const currentRole = ref();
const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value?.roles[0];

const { userInfo, fetchUserInfo } = useUserInfo();
// const { createVisitor, statusCode, visitorId } = useCreateVisitor();
const {
  createVisitor,
  statusCode,
  visitorId,
  uidn,
  firstname,
  lastname,
  address,
  state,
  country,
  city,
  zipcode,
} = useCreateVisitor();
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
  datepicker: "",
  hours: null,
  minutes: null,
  // Assurez-vous que le champ 'file' est inclus
});

// Computed property pour combiner les heures et minutes
const request_time = computed(() => {
  const formattedHours = visitor.value.hours
    ? String(visitor.value.hours).padStart(2, "0")
    : "00";
  const formattedMinutes = visitor.value.minutes
    ? String(visitor.value.minutes).padStart(2, "0")
    : "00";
  return `${formattedHours}:${formattedMinutes}`;
});

const visitRequest = ref({
  user_id: userInfo?.value?.id,
  visitor_id: "",
  host: "",
  reason: "",
});

const fileName = ref();
const uploadFile = (event) => {
  const selectedFile = event.target.files[0];
  // console.log(selectedFile);
  if (selectedFile) {
    visitor.value.file = selectedFile;
    // pdfUrl.value = URL.createObjectURL(selectedFile);
    fileName.value = selectedFile.name;
    // this.isValidFile = true;
    // this.errorMessage = '';
  } else {
    // this.isValidFile = false;
    errorMessage.value = "Veuillez selectionnez un fichier valide";
  }
};

const errorMessage = ref("");
const loading = ref(false);

const fieldLabels = {
  "visitor.firstname": "Prénom",
  "visitor.lastname": "Nom",
  "visitor.id_number": "Numéro d'identification",
  "visitor.organisation_name": "Employeur",
  "visitor.email": "Adresse mail",
  "visitor.contact": "Contact",
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateContact = (contact) => {
  const contactRegex = /^\d{8,15}$/; // Accepte uniquement les chiffres entre 8 et 15 caractères
  return contactRegex.test(contact);
};

const validateForm = () => {
  errorMessage.value = "";

  const requiredFields = Object.keys(fieldLabels);

  for (const field of requiredFields) {
    const fieldParts = field.split(".");
    let fieldValue = null;

    if (fieldParts.length === 2) {
      const [objectName, propertyName] = fieldParts;
      fieldValue = eval(objectName).value[propertyName];
    } else {
      fieldValue = visitor.value[field];
    }

    if (!fieldValue) {
      const fieldLabel = fieldLabels[field];
      toast.error(`Le champ "${fieldLabel}" est requis.`);

      // Dynamically use the field name to focus the corresponding input
      /*if (this.$refs[field]) {
        this.$refs[field].focus();  // Accessing the field by its name using `this.$refs[field]`
      }*/
      return false;
    }
  }

  // Validation de la taille du fichier
  const file = visitor.value.file;
  if (file && file.size > 2 * 1024 * 1024) {
    // 2 Mo
    errorMessage.value = "La taille du fichier ne doit pas dépasser 2 Mo.";
    return false;
  }

  // Validation du format de la date (DD/MM/YYYY)
 

  // Validation des heures et minutes
 

  // Vérification de l'heure
  /*if (!hours || !minutes) {
    toast.error("Veuillez sélectionner une heure et des minutes.");
    return false;
  }*/

  // Vérification de l'email
  if (!visitor.value.email || !validateEmail(visitor.value.email)) {
    toast.error("Veuillez entrer une adresse e-mail valide.");
    return false;
  }

  // Vérification du contact (numéro de téléphone)
  if (!visitor.value.contact || !validateContact(visitor.value.contact)) {
    toast.error(
      "Veuillez entrer un numéro de téléphone valide (8 à 15 chiffres)."
    );
    return false;
  }

  return true;
};

const submitForm = async () => {
  visitor.value.user_id = userInfo?.value?.id;

  if (!validateForm()) {
    return;
  }

  loading.value = true; // Démarre le loader
  //console.log("Loading started", loading.value);

  // Simulez un délai pour voir le loader (à supprimer dans la version réelle)
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simule un délai de 1 seconde

  try {
    visitor.value.evenements_id = event?.value ? event?.value.id : null;
    visitor.value.company_id = event?.value?.companyId ?? company?.value?.id;
    visitor.value.request_time = request_time.value;
    if (event?.value) {
      visitor.value.address = event?.value?.addressName ?? null;
      visitor.value.request_date = new Date(event?.value?.date_event)
       .toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

      visitor.value.request_time = new Date(event?.value?.time_event)
        .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      visitor.value.city = event?.value?.city ?? null;
      visitor.value.state = event?.value?.state ?? null;
      visitor.value.country = event?.value?.country ?? null;
      visitor.value.zipcode = event?.value?.zipcode ?? null;
    }

    await createVisitor(visitor.value);

    visitRequest.value.visitor_id = visitorId.value;
    visitRequest.value.user_id = userInfo?.value?.id;
    if (event?.value) {
      visitRequest.value.host = event?.value?.name ?? null;
      visitRequest.value.reason = "not applicable";

    }

    await createVisitRequest(visitRequest.value);
  } catch (error) {
    //errorMessage.value = `Erreur: ${error.message}`;
    errorMessage.value = `Erreur: ${
      error.response?.data?.message ||
      error.message ||
      "Une erreur inconnue s'est produite."
    }`;
  } finally {
    loading.value = false;
  }
};

const domain = ref(route.params.domain || "scb");
const title = ref("");
const event_address = ref("");
const date_event = ref("");
const time_event = ref("");
const event_city = ref("");
const event_state = ref("");
const event_country = ref("");
const event_zipcode = ref("");
console.log({ event });

const formatDate = (dateString) => {
  if (!dateString) return ""; // Handle empty or undefined values

  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date"; // Handle invalid dates

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return ""; // Handle empty or undefined values

  const time = new Date(timeString);
  if (isNaN(time)) return "Invalid Time"; // Handle invalid time

  return time.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onBeforeMount(async () => {
  await fetchUserInfo();
  if (route.params.slug && route.params.domain) {
    await showEvent(route.params.slug);
    title.value = event?.value?.name;
    date_event.value = event?.value?.date_event;
    time_event.value = event?.value?.time_event;
    event_address.value = event?.value?.addressName;
    event_city.value = event?.value?.city;
    event_state.value = event?.value?.state;
    event_country.value = event?.value?.country;
    event_zipcode.value = event?.value?.zipcode;
    console.log("event?.value?", event.value.city);
    router.push({
      name: "JoinEvent",
      params: {
        domain: route.params.domain,
        slug: route.params.slug,
      },
    });
  } else if (domain.value) {
    await showCompany(domain.value);
    router.push({
      name: "CreateVisitor",
      params: {
        domain: domain.value,
      },
    });
  }
});


watch(statusCode, (newStatus) => {
  console.log("statusCode123 statusCode123", newStatus);
  switch (newStatus) {
    case 201:
      toast.success("Demande créée avec succès.");
      router.push({
        name: "RequestMeeting",
        params: {
          domain: domain.value,
          id: requestId.value,
        },
      });

      break;

    case 200:
      toast.success("Visiteur créé avec succès.");
      sessionStorage.setItem("visitorData", JSON.stringify({
        firstname: firstname.value,
        lastname: lastname.value,
        address: address.value,
        state: state.value,
        country: country.value,
        city: city.value,
        zipcode: zipcode.value,
        title : event?.value?.name,
        date_event : event?.value?.date_event,
        time_event : event?.value?.time_event,
        event_address : event?.value?.addressName,
        location : event?.value?.location,
        event_city: event?.value?.city,
        event_state: event?.value?.state,
        event_country: event?.value?.country,
        event_zipcode: event?.value?.zipcode,
      }));

      router.push({
        name: "RequestQrCode",
        params: {
          domain: domain.value,
          uidn: uidn.value,
        },
      });
      break;

    case 400:
      toast.info("La requête est mal formée.");
      break;

    case 401:
      toast.info("Vous devez être authentifié.");
      router.push({
        name: "RequestMeeting",
        params: {
          domain: domain.value,
          id: requestId.value,
        },
      });
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
  if (!isAuthenticated) return;
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
  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="left-back">
            <!-- <a href="#">
              <img src="@/assets/back-arrow-table.png" class="" alt="back-arrow" />
            </a> -->

            <router-link :to="{ name: 'RequestMeeting' }">
              <img src="@/assets/back-arrow-table.png" alt="back-arrow" />
            </router-link>
          </div>
          <div class="center-heading"></div>
          <div class="right-hide"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="request-meeting">
    <div class="background-gradi">
      <section class="secure-form">
        <div class="container">
          <div class="row align-items-center">
            <div class="col col-12 col-md-12 col-sm-12 scanner-form-col">
              <form id="multi-step-form" @submit.prevent="submitForm">
                <!-- Step 1 -->
                <div class="form-step active">
                  <div class="step-header">Step 1 of 5</div>
                  <h2 class="text-center mb-5">
                    Demande de rendez-vous
                    <span v-if="company"> - {{ company.name }}</span>
                  </h2>
                  <h3 class="text-center pb-3" v-if="title">
                    {{ title }}
                  </h3>

                  <div class="divide-50">
                    <label for=""
                      >Prénom(s) : <span class="required">*</span></label
                    >
                    <input
                      type="text"
                      id="firstname"
                      v-model="visitor.firstname"
                      @focus="inputFocused = 'firstname'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div class="divide-50">
                    <label for="">Nom : <span class="required">*</span></label>
                    <input
                      type="text"
                      id="lastname"
                      v-model="visitor.lastname"
                      @focus="inputFocused = 'lastname'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div class="divide-50">
                    <label for=""
                      >Numéro de pièce d’identité :
                      <span class="required">*</span></label
                    >
                    <input
                      type="text"
                      id="id_number"
                      v-model="visitor.id_number"
                      @focus="inputFocused = 'id_number'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div class="divide-50">
                    <label for=""
                      >Pièce d’identité : <span class="required">*</span></label
                    >
                    <input
                      type="file"
                      id="file"
                      @change="uploadFile"
                      @focus="inputFocused = 'file'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div class="divide-50" >
                    <label for=""
                      >Adresse : <span class="required">*</span></label
                    >
                    <input v-if="!title"
                      type="text"
                      id="address"
                      v-model="visitor.address"
                      @focus="inputFocused = 'address'"
                      @blur="inputFocused = ''"
                    />
                    <input v-else
                      type="text"
                      id="address"
                      v-model="event_address"
                      disabled
                      readonly
                    />

                  </div>
                  

                  <div class="divide-50">
                    <label for=""
                      >Ville : <span class="required">*</span></label
                    >
                    <input v-if="!title"
                      type="text"
                      id="city"
                      v-model="visitor.city"
                      @focus="inputFocused = 'city'"
                      @blur="inputFocused = ''"
                    />

                    <input v-else
                      type="text"
                      id="city"
                      v-model="event_city"
                      disabled
                      readonly
                    /> 
                  </div>

                  <div class="divide-50">
                    <label for="">Pays : <span class="required">*</span></label>
                    <select v-if="!title"
                      id="country"
                      v-model="visitor.country"
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

                    <input v-else
                      type="text"
                      id="country"
                      v-model="event_country"
                      disabled
                      readonly
                    /> 

                  </div>

                  <div class="divide-50">
                    <label for=""
                      >Region / Etat : <span class="required">*</span></label
                    >
                    <input v-if="!title"
                      type="text"
                      id="state"
                      v-model="visitor.state"
                      @focus="inputFocused = 'state'"
                      @blur="inputFocused = ''"
                    />
                    <input v-else
                      type="text"
                      id="state"
                      v-model="event_state"
                      disabled
                      readonly
                    />
                  </div>

                  <div class="divide-50">
                    <label for=""
                      >Code postale : <span class="required">*</span></label
                    >
                    <input v-if="!title"
                      type="text"
                      id="zipcode"
                      v-model="visitor.zipcode"
                      @focus="inputFocused = 'zipcode'"
                      @blur="inputFocused = ''"
                    />
                    <input v-else
                      type="text"
                      id="zipcode"
                      v-model="event_zipcode"
                      disabled
                      readonly
                    />
                  
                  </div>

                  <div class="divide-50">
                    <label for=""
                      >Employeur : <span class="required">*</span></label
                    >
                    <input
                      type="text"
                      id="organisation_name"
                      v-model="visitor.organisation_name"
                      @focus="inputFocused = 'organisation_name'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div class="divide-50" v-if="!title">
                    <label for=""
                      >Nom de l'hôte : <span class="required">*</span></label
                    >
                    <input
                      type="text"
                      id="host"
                      name="host"
                      v-model="visitRequest.host"
                      @focus="inputFocused = 'host'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div class="divide-50" v-if="!title">
                    <label for=""
                      >Raison de la visite :
                      <span class="required">*</span></label
                    >
                    <input
                      type="text"
                      id="reason"
                      name="reason"
                      v-model="visitRequest.reason"
                      @focus="inputFocused = 'reason'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div class="divide-50 custom-date" v-if="!title">
                    <label for=""
                      >Sélectionner une date :
                      <span class="required">*</span></label
                    >
                    <div id="container">
                      <input
                        type="text"
                        maxlength="10"
                        id="datepicker"
                        v-model="visitor.request_date"
                        placeholder="DD/MM/YYYY"
                        ref="datepicker"
                        @focus="inputFocused = 'request_date'"
                        @blur="inputFocused = ''"
                      />
                      <span
                        id="calendarIcon"
                        @click="openDatePicker"
                        style="
                          position: absolute;
                          right: 10px;
                          top: 50%;
                          transform: translateY(-50%);
                          cursor: pointer;
                        "
                      >
                      </span>
                    </div>
                  </div>
                  <div class="divide-50" v-else>
                    <label for="eventDate">Event Date <span class="required">*</span></label>
                    <input
                      type="text"
                      id="eventDate"
                      :value="formatDate(date_event)" 
                      disabled
                      readonly
                    />
                  </div>
                  

                  <div class="divide-50 custom-time" v-if="!title">
                    <label for="hours"
                      >Sélectionnez une heure :
                      <span class="required">*</span></label
                    >
                    <div id="container">
                      <select
                        id="hours"
                        v-model="visitor.hours"
                        @focus="inputFocused = 'hours'"
                        @blur="inputFocused = ''"
                      >
                        <option value="" disabled selected>HH</option>
                        <option v-for="hour in hours" :key="hour" :value="hour">
                          {{ hour }}
                        </option>
                      </select>
                      :
                      <select
                        id="minutes"
                        v-model="visitor.minutes"
                        @focus="inputFocused = 'minutes'"
                        @blur="inputFocused = ''"
                      >
                        <option value="" disabled selected>MM</option>
                        <option
                          v-for="minute in minutes"
                          :key="minute"
                          :value="minute"
                        >
                          {{ minute }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="divide-50" v-else>
                    <label for="state"
                      >Event Time <span class="required">*</span></label
                    >
                    <input
                      type="text"
                      id="eventTime"
                      :value="formatTime(time_event)"
                      disabled
                      readonly
                    />
                  </div>

                  <!-- <div class="divide-50 custom-time">
                          <label for="">Sélectionnez une heure : <span class="required">*</span></label>
                          <div id="container">
                            <select id="hours" v-model="hours">
                              <option value="" disabled selected>HH</option>
                              <option v-for="h in 24" :key="h" :value="h === 0 ? '00' : h < 10 ? '0' + h : h">
                                {{ h === 0 ? '00' : h < 10 ? '0' + h : h }}
                              </option>
                            </select>
                            :
                            <select id="minutes" v-model="minutes">
                              <option value="" disabled selected>MM</option>
                              <option v-for="m in 60" :key="m" :value="m === 0 ? '00' : m < 10 ? '0' + m : m">
                                {{ m === 0 ? '00' : m < 10 ? '0' + m : m }}
                              </option>
                            </select>
                          </div>
                        </div> -->

                  <div class="divide-50">
                    <label for=""
                      >Email : <span class="required">*</span></label
                    >
                    <input
                      type="text"
                      id="email"
                      v-model="visitor.email"
                      @focus="inputFocused = 'email'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <div class="divide-50">
                    <label for=""
                      >Contact : <span class="required">*</span></label
                    >
                    <input
                      type="text"
                      id="contact"
                      v-model="visitor.contact"
                      @focus="inputFocused = 'contact'"
                      @blur="inputFocused = ''"
                    />
                  </div>

                  <!-- <div class="divide-50">
                           <label for="">Check me please:</label>
                           <div class="form-check">
                              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                              <label class="form-check-label" for="flexCheckDefault">
                              Default 
                              </label>
                           </div>
                           <div class="form-check">
                              <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
                              <label class="form-check-label" for="flexCheckChecked">
                              Checked 
                              </label>
                           </div>
                        </div>
                        <div class="divide-50">
                           <label for="">Select me please:</label>
                           <div class="form-check">
                              <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                              <label class="form-check-label" for="flexRadioDefault1">
                              Default
                              </label>
                           </div>
                           <div class="form-check">
                              <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
                              <label class="form-check-label" for="flexRadioDefault2">
                              checked radio
                              </label>
                           </div>
                        </div> -->
                  <!-- Submit Button with loader -->
                  <div class="buttons">
                    <button type="submit" :disabled="loading">
                      <span v-if="loading" class="loader"></span>
                      <span v-else>Submit</span>
                    </button>
                  </div>

                  <!-- <p v-if="errorMessage" class="error">{{ errorMessage }}</p> -->
                </div>
              </form>
            </div>
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

/* Style pour l'input et l'icône du calendrier */
#container {
  position: relative;
}

#datepicker {
  padding-right: 30px;
}

#calendarIcon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

#dateValidation {
  color: red;
  font-size: 12px;
}

/* Styles pour le bouton de soumission */
.buttons {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  display: flex;
  align-items: center; /* Aligner le loader et le texte au centre verticalement */
  justify-content: center;
  position: relative;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

/* Loader styling */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-right: 10px; /* Ajouter un espace à droite du loader */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
