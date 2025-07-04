<script setup>
import { useCompanies } from "@/services/useCompanies";
import { useUserStore } from "@/stores/useUserStore";
// import { useGlobalStore } from "@/stores/globalStore";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { EventBus } from "@/utils/eventBus";
import { watch } from "vue";
import { onBeforeMount /*ref*/ } from "vue";

// Utilisation du routeur pour récupérer le domaine courant
const route = useRoute();
const domain = ref(route.params.domain || "scb");

const userStore = useUserStore();
const isAuthenticated = userStore.isAuthenticated();
// const { publicDir } = useGlobalStore();
// const { showCompany, company } = useCompanies();
const { showCompany } = useCompanies();

const company_slug = ref(localStorage.getItem("currentCompany"));
const router = useRouter();
const currentRole = ref();

const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value?.roles[0];

onMounted(() => {
  console.log("Rôle actuel :", currentRole.value);
  console.log("isAuthenticated :", isAuthenticated);
  if (!isAuthenticated) {
    console.log("RequestMeeting");
    router.push({
      name: "RequestMeeting",
      params: {
        domain: domain.value,
      },
    });
  }
});

onBeforeMount(async () => {
  // Extraire l'hôte (domaine + port)
  console.log("Host:", window.location.host);
  // Extraire le chemin (path)
  console.log("Path:", window.location.pathname);

  if (window.location.pathname != "/sign-in") {
    if (company_slug.value) {
      await showCompany(company_slug.value);
    } else {
      company_slug.value = "";
    }
  }
});
console.log("isemployee",userStore.isEmployee(currentRole));
// const distantData = ref();
watch(
  () => EventBus["company_slug"],
  async (newValue) => {
    await showCompany(localStorage.getItem("currentCompany") ?? newValue);
  }
);
// const backButton = () => {
//   router.push({
//     name: "homePage",
//     params: {
//       domain: domain.value,
//     },
//   });
// };
</script>

<template>
  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
            <div class="left-back">
              <router-link :to="{ name: 'RequestMeeting' }">
                <img src="@/assets/back-arrow-table.png" alt="back-arrow" />
              </router-link>
            </div>
          <div class="center-heading"><h1>Menu de navigation</h1></div>
          <div class="right-hide"></div>
        </div>
      </div>
    </div>
  </section>

  <section 
  :class="{
    'hexa-secure-logo-bottom-super': userStore.isSupervisor(currentRole),
    'hexa-secure-logo-frontdesk': userStore.isEmployee(currentRole)
  }"
  class="hexa-secure-logo_menu hexa-secure-logo-bottom text-center"
>
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="controler-image"><img src="@/assets/Symbole_Plan_de_travail_1.png" class="" alt="secure-check-effect-img" />

          <!-- <div class="controler-image"><img src="@/assets/secure-check-effect-img.png" class="secure_check_image" alt="secure-check-effect-img" /> -->
            <ul>

              <li 
                v-if="userStore.isAdmin(currentRole) || 
                      userStore.isManager(currentRole) || 
                      userStore.isSecureCheck(currentRole)"
                :class="{ 'hidden': userStore.isSupervisor(currentRole) }"
                class="animate__animated animate__backInLeft animate__delay-3s animate__slow 3s"
              >
                <router-link 
                  :to="{ name: 'DisplayEventAttendence', params: { domain: domain } }"
                >
                  <img src="@/assets/3.png" alt="Participer à un évènement d'entreprise" title="Participer à un évènement d'entreprise"/>
                  <p>Participer à un évènement</p>
                </router-link>
              </li> 
              
              <li 
              v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isSupervisor(currentRole) ||
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isManager(currentRole) 
                "
                class_="animate__animated animate__backInRight animate__delay-8s animate__slow 8s"
              >
                <router-link 
                  :to="{ name: 'UserAttendence', params: { domain: domain } }"
                >
                  <img src="@/assets/3.png" alt="Participer à un évènement d'entreprise" title="Participer à un évènement d'entreprise"/>
                  <p> Liste de présence</p>
                </router-link>  
              </li>  

              <li 
                v-if="
                  userStore.isEmployee(currentRole) ||
                  userStore.isAdmin(currentRole) ||
                  userStore.isSupervisor(currentRole) ||
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                class_="animate__animated animate__backInLeft animate__delay-2s animate__slow	2s"
              >
                <router-link :to="{ name: 'ListQrcode', params: { domain: domain } }">
                  <img src="@/assets/2.png" alt="Demande" title="Liste des Demandes de visites" />
                  <p>Demande</p>
                </router-link>
              </li> 


              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isSupervisor(currentRole) ||
                  userStore.isManager(currentRole) ||
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                class_="animate__animated animate__backInLeft animate__delay-1s animate__slow	1s"
              >
                <router-link :to="{ name: 'EventList', params: { domain: domain } }">
                  <img src="@/assets/1.png" alt="Liste des Evènements" title="Liste des Evènements"/>
                  <p>Event list</p>
                </router-link>
              </li> 
              
              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isManager(currentRole) ||
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                :class="{ 'hidden': userStore.isSupervisor(currentRole) }"
                class_="animate__animated animate__backInRight animate__delay-6s animate__slow 6s"
              >
                <router-link :to="{ name: 'CompanyList', params: { domain: domain } }">
                  <img src="@/assets/Liste-Entreprise.png" alt="Liste Entreprise" title="Liste Entreprises"/>
                  <p>Liste Entreprise</p>
                </router-link>
              </li>

              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isSupervisor(currentRole) ||
                  userStore.isManager(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                class_="animate__animated animate__backInRight animate__delay-4s animate__slow 4s"
              >
                <router-link 
                  :to="{ name: 'CreateQRCode', params: { domain: domain } }"
                >
                  <img src="@/assets/4.png" alt="Créer QR code" title="Créer QR code"/>
                  <p>Créer QR code</p>
                </router-link>
              </li>

              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isSupervisor(currentRole) ||
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                class_="animate__animated animate__backInRight animate__delay-5s animate__slow 5s"
              >
                <router-link :to="{ name: 'ListUser', params: { domain: domain } }">
                  <img src="@/assets/5.png" alt="liste Utilisateurs" title="liste Utilisateurs"/>
                  <p>Utilisateurs</p>
                </router-link>
              </li>

              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isManager(currentRole) ||
                  userStore.isSupervisor(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                class_="animate__animated animate__backInLeft animate__delay-1s animate__slow 1s"
              >
                <router-link :to="{ name: 'CreateUser', params: { domain: domain } }">
                  <img src="@/assets/seances.png" alt="Créer un Utilisateur" title="Créer un Utilisateur"/>
                  <p>+ Utilisateurs</p>
                </router-link>
              </li>

              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isEmployee(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                :class="{ 'hidden': userStore.isSupervisor(currentRole) }"
                class_="animate__animated animate__backInLeft animate__delay-2s animate__slow 2s"
              >
                <router-link :to="{ name: 'ManalCheck', params: { domain: domain } }">
                  <img src="@/assets/code-du-manuel.png" alt="QR Code manuel" title="QR Code manuel"/>
                  <p>QR Code manuel</p>
                </router-link>
              </li>

              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isSupervisor(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                class_="animate__animated animate__backInLeft animate__delay-3s animate__slow 3s"
              >
                <router-link :to="{ name: 'CreateEvent', params: { domain: domain } }">
                  <img src="@/assets/creer-un-evenement.png" alt="Créer un évènement" title="Créer un évènement"/>
                  <p>Créer un Evènement</p>
                </router-link>
              </li>

              <li 
                v-if="
                  userStore.isAdmin(currentRole) || 
                  userStore.isManager(currentRole) || 
                  userStore.isEmployee(currentRole)
                "
                :class="{ 'hidden': userStore.isSupervisor(currentRole) }"
                class_="animate__animated animate__backInRight animate__delay-4s animate__slow 4s"
              >
                <router-link :to="{ name: 'Camera', params: { domain: domain } }">
                  <img src="@/assets/code-QR.png" alt="Scanner Code QR" title="Scanner Code QR"/>
                  <p>Scanner QR</p>
                </router-link>
              </li>

              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isManager(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                :class="{ 'hidden': userStore.isSupervisor(currentRole) }"
                class_="animate__animated animate__backInRight animate__delay-5s animate__slow 5s"
              >
                <router-link :to="{ name: 'CreateCompany', params: { domain: domain } }">
                  <img src="@/assets/entreprise.png" alt="Créer une Entreprise" title="Créer une Entreprise"/>
                  <p>+ Entreprise</p>
                </router-link>
              </li>

              <li 
                v-if="
                  userStore.isAdmin(currentRole) ||
                  userStore.isSupervisor(currentRole) ||
                  userStore.isSuperAdmin(currentRole) ||
                  userStore.isManager(currentRole) ||
                  userStore.isSecureCheck(currentRole)
                "
                class_="animate__animated animate__backInRight animate__delay-7s animate__slow 7s"
              >
                <router-link :to="{ name: 'DisplayVisitorCode', params: { domain: domain } }">
                  <img src="@/assets/seances.png" alt="Liste des visiteurs" title="Liste des visiteurs"/>
                  <p>Liste des visiteurs</p>
                </router-link>
              </li>   
              <li 
                v-if="
                 userStore.isAdmin(currentRole)||
                 userStore.isSupervisor(currentRole) ||
                 userStore.isSecureCheck(currentRole) 
                 "
                class_="animate__animated animate__backInRight animate__delay-8s animate__slow 8s"
              >
                <router-link :to="{ name: 'QrCodeList', params: { domain: domain } }">
                  <img src="@/assets/seances.png" alt="Liste des QR Codes Employés" title="Liste des QR Codes Employés"/>
                  <p>Liste QR Code</p>
                </router-link>
              </li>
              <li 
                v-if="userStore.isAdmin(currentRole) || 
                      userStore.isManager(currentRole) || 
                      userStore.isSecureCheck(currentRole)"
                :class="{ 'hidden': userStore.isSupervisor(currentRole) }"
                class_="animate__animated animate__backInLeft animate__delay-3s animate__slow 3s"
              >
                <router-link 
                  :to="{ name: 'CreateQRMembre', params: { domain: domain } }"
                >
                  <img src="@/assets/3.png" alt="Créer une carte de Membre" title="Créer une carte de Membre"/>
                  <p>Carte Membre</p>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.menu-item {
  width: 20%;
}

.selectcheckintype .col.col-12.col-md-12.col-sm-12 {
  text-align: center;
  margin: 0px auto 0px auto !important;
  max-width: 900px;
  background: #ffffff;
  padding: 80px 40px;
  border-radius: 15px;
  transform: translate(-50%, -50%);
  top: 50%;
  position: absolute;
  left: 50%;
}
section.background-gradi.selectcheckintype .col.col-12.col-md-12.col-sm-12 {
    transform: unset !important;
    position: unset !important;
}
/* .hexa-secure-logo-bottom ul li img {
    max-width: 80px;
    width: auto;
} */


</style>
