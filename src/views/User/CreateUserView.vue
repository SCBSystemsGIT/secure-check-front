<script setup>
import { useCreateUser } from "@/services/createUser";
import { useCompanies } from "@/services/useCompanies";
//import { useDepartement } from "@/services/useDepartement";
import { useUserStore } from "@/stores/useUserStore";
import { onBeforeMount } from "vue";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const { user, loading, errorMessage, successMessage, createUser, statusCode } =
  useCreateUser();
//const { departements, fetchDepartements } = useDepartement();
const router = useRouter();
const { companies, fetchCompanies } = useCompanies();

const users = ref({
  name: "",
  firstname: "",
  email: "",
  password: "",
  title: "",
  contact: "",
  role: "",
  company: ""
});

const fieldLabels = {
  'users.name': 'Nom',
  'users.firstname': 'Prénom(s)',
  'users.email': 'Adresse mail',
  'users.password': 'Mot de passe',
  'users.title': 'Titre', 
  'users.contact': 'Numéro de téléphone',
  'users.role': 'Rôle',
  'users.company': 'Entreprise'
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
  errorMessage.value = '';

  const requiredFields = Object.keys(fieldLabels);

  for (const field of requiredFields) {
    const fieldParts = field.split('.');
    let fieldValue = null;

    if (fieldParts.length === 2) {
      const [objectName, propertyName] = fieldParts;
      fieldValue = eval(objectName).value[propertyName];
    } else {
      fieldValue = users.value[field];
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

  // Vérification de l'email
  if (!users.value.email || !validateEmail(users.value.email)) {
    toast.error("Veuillez entrer une adresse e-mail valide.");
    return false;
  }

  // Vérification du contact (numéro de téléphone)
  if (!users.value.contact || !validateContact(users.value.contact)) {
    toast.error("Veuillez entrer un numéro de téléphone valide (8 à 15 chiffres).");
    return false;
  }

  return true;
};

//const submitForm = () => {
const submitForm = async () => {

  if (!validateForm()) {
    return;
  }

  loading.value = true;  // Démarre le loader
  //console.log("Loading started", loading.value);

  // Simulez un délai pour voir le loader (à supprimer dans la version réelle)
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simule un délai de 1 seconde

  try {
    await createUser();
  } catch (error) {
    //errorMessage.value = `Erreur: ${error.message}`;
    errorMessage.value = `Erreur: ${error.response?.data?.message || error.message || "Une erreur inconnue s'est produite."}`;
  } finally {
    loading.value = false;
  }

};

const userStore = useUserStore();
const currentRole = ref();

const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value?.roles[0];

onMounted(async () => {
  //await fetchDepartements();
  await fetchCompanies();
});
// Watcher pour réagir aux changements du statusCode
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
      toast.success("OK - Utilisateur créé avec succès.");
      toast.info(successMessage);

      router.push(localStorage.getItem("currentCompany") ?? "/scb" + "/menu");
      break;
    case 201:
      toast.success("Created - L'utilisateur a été créé avec succès.");

      setTimeout(() => {
        router.push({
          name: "Menu",
          params: {
            domain: domain.value ?? localStorage.getItem("currentCompany"),
          },
        });
      }, 1400);

      break;
    case 400:
      toast.info("Bad Request - La requête est mal formée.");
      break;
    case 401:
      toast.info("Unauthorized - Vous devez être authentifié.");
      break;
    case 403:
      toast.info("Forbidden - Vous n'avez pas la permission.");
      break;
    case 404:
      toast.info("Not Found - La ressource demandée n'existe pas.");
      break;
    case 500:
      toast.info("Internal Server Error - Une erreur interne est survenue.");
      break;
    default:
      toast.info(`Erreur inconnue - Code : ${newStatus}`);
  }
});

const route = useRoute();
const domain = ref(route.params.domain || "scb");
/*const goToMenu = () => {
  router.push({
    name: "Menu",
    params: {
      domain: domain.value,
    },
  });
};*/

// const { showCompany, company } = useCompanies();
const { showCompany } = useCompanies();

onBeforeMount(async () => {
  // Extraire l'hôte (domaine + port)
  console.log("Host:", window.location.host);
  // Extraire le chemin (path)
  console.log("Path:", window.location.pathname);

  if (window.location.pathname != "/sign-in") {
    let company_slug = localStorage.getItem("currentCompany");
    if (company_slug) {
      await showCompany(company_slug);
    } else {
      company_slug = "";
    }
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
                  <form id="multi-step-form"  @submit.prevent="submitForm">
                     <!-- Step 1 -->
                     <div class="form-step active">
                        <h2 class="text-center mb-5">
                          Créer un Utilisateur
                          <span v-if="company"> - {{ company.name }}</span>
                        </h2>

                        <div class="divide-50">
                           <label for="">Nom : <span class="required">*</span></label>
                           <input 
                            type="text"
                            id="name"
                            v-model="user.name" 
                            @focus="inputFocused = 'name'"
                            @blur="inputFocused = ''"
                          >
                        </div>

                        <div class="divide-50">
                           <label for="">Prénom(s) : <span class="required">*</span></label>
                           <input 
                            type="text"
                            id="firstname"
                            v-model="user.firstname"
                            @focus="inputFocused = 'firstname'"
                            @blur="inputFocused = ''"
                          >
                        </div>

                        <div class="divide-50">
                          <label for="" >Email : <span class="required">*</span></label>
                          <input
                            type="text"
                            id="email"
                            v-model="user.email"
                            @focus="inputFocused = 'email'"
                            @blur="inputFocused = ''"
                          />
                        </div>

                        <div class="divide-50">
                          <label for="" >Mot de passe : <span class="required">*</span></label>
                          <input
                            type="password"
                            id="password"
                            v-model="user.password"
                            @focus="inputFocused = 'password'"
                            @blur="inputFocused = ''"
                          />
                        </div>

                        <div class="divide-50">
                          <label for="" >Titre : <span class="required">*</span></label>
                          <input
                            type="text"
                            id="title"
                            v-model="user.title"
                            @focus="inputFocused = 'title'"
                            @blur="inputFocused = ''"
                          />
                        </div>

                        <div class="divide-50">
                          <label for="" >Numéro de téléphone : <span class="required">*</span></label>
                          <input
                            type="text"
                            id="contact"
                            v-model="user.contact"
                            @focus="inputFocused = 'contact'"
                            @blur="inputFocused = ''"
                          />
                        </div>

                        <div class="divide-50">
                          <label for="">Rôle : <span class="required">*</span></label>
                          <select 
                            id="role"
                            v-model="user.role" 
                            class="form-select" 
                            aria-label="Default select example"
                            @focus="inputFocused = 'role'"
                            @blur="inputFocused = ''"
                          >
                            <option value="" disabled selected>Sélectionner un Rôle</option>
                            <option
                              value="ROLE_USER"
                              v-if="
                                userStore.isAdmin(currentRole) ||
                                // userStore.isSupervisor(currentRole) ||
                                userStore.isManager(currentRole)||
                                userStore.isManager(currentRole)||
                                userStore.isSecureCheck(currentRole)
                              "
                            >
                              Employee 
                            </option>

                            <option
                              value="ROLE_EMPLOYEE"
                              v-if="
                                userStore.isAdmin(currentRole) ||
                                userStore.isSupervisor(currentRole) ||
                                userStore.isManager(currentRole)||
                                userStore.isSecureCheck(currentRole)
                              "
                            >
                              Employé (Front Desk)
                            </option>

                            <option
                              value="ROLE_SUPERVISOR"
                              v-if="
                                userStore.isAdmin(currentRole) ||
                                userStore.isManager(currentRole)||
                                userStore.isSecureCheck(currentRole)
                              "
                            >
                              Superviseur
                            </option>

                            <option
                              value="ROLE_SecureCheck"
                              v-if="
                                userStore.isAdmin(currentRole)
                                "
                              >
                                Secure Check
                            </option>

                            <option
                              value="ROLE_MANAGER"
                              v-if="userStore.isAdmin(currentRole)"
                            >
                              Manager
                            </option>

                            <option
                              value="ROLE_ADMIN"
                              v-if="userStore.isAdmin(currentRole)"
                            >
                              Admin
                            </option>

                            <option 
                              value="ROLE_SUPER_ADMIN"
                              v-if="
                                userStore.isAdmin(currentRole) ||
                                userStore.isManager(currentRole)
                                "
                            >
                              Super Admin
                            </option>
                           </select>
                        </div>

                        <div class="divide-50">
                          <label for="">Entreprise : <span class="required">*</span></label>
                          <select 
                            id="role"
                            v-model="user.company_id" 
                            class="form-select" 
                            aria-label="Default select example"
                            @focus="inputFocused = 'company_id'"
                            @blur="inputFocused = ''"
                          >
                            <option value="" disabled selected>Sélectionner une Entreprise</option>
                            <option
                              v-for="company in companies"
                              :key="company?.id"
                              :value="company?.id"
                            >
                              {{ company?.name }}
                            </option>
                           </select>
                        </div>

                        <div class="divide-50">
                          <label for="status">Statut</label>
                          <div class="form-check">
                            <input 
                              class="form-check-input" 
                              type="checkbox" 
                              id="status" 
                              v-model="user.status" 
                            />
                            <label class="form-check-label" for="status">
                              {{ user.status ? "Actif" : "Inactif" }}
                            </label>
                          </div>
                        </div>

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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
