<script setup>
import { useLogin } from "@/services/login";
// import { useCompanies } from "@/services/useCompanies";
// import { useGlobalStore } from "@/stores/globalStore";
import { EventBus } from "@/utils/eventBus";
import { onMounted } from "vue";
import { watch } from "vue";
import { ref } from "vue";
// import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
const inputFocused = ref(""); // Garde en mémoire l'input qui a le focus

const { login, username, password, statusCode, company_name, userInfo } = useLogin();
const loading = ref(false); // Variable pour suivre l'état du chargement

// const router = useRouter();

watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
      toast.success("Connexion réussie.");
      // console.log(">__________>");
      console.log({ company_name });
      // console.log({ userInfo });

      setTimeout(() => {
        // router.push({
        //   name: "Menu",
        //   domain: userInfo.value.company ?? "scb",
        // });

        window.location = userInfo?.value?.company ??  "scb";
      }, 1500);
      break;
    case 201:
      toast.success("Utilisateur connecté avec succès.");
      break;
    case 400:
      toast.error("La requête est mal formée.");
      break;
    case 401:
      toast.error("Identifiants incorrects.");
      break;
    case 403:
      toast.error("  Accès refusé.");
      break;
    case 404:
      toast.error("La ressource demandée n'existe pas.");
      break;
    case 500:
      toast.error("Une erreur interne est survenue.");
      break;
    default:
      console.log(`Erreur inconnue - Code : ${newStatus}`);
  }
});

// const { publicDir } = useGlobalStore();
// const { showCompany, company } = useCompanies();
let company_slug = localStorage.getItem("currentCompany");

const sendData = (params, valueAdded) => {
  console.info({
    params: params,
    valueAdded: valueAdded,
  });
  EventBus[params] = valueAdded;
};

onMounted(async () => {
  // alert(window.location.pathname)
  if (window.location.pathname == "/sign-in") {
    if (company_slug) {
      sendData("company_slug", company_slug);
      // await showCompany(company_slug);
    } else {
      company_slug = "";
    }
  }
});

// Ajout d'une méthode pour gérer l'envoi du formulaire
/*const handleSubmit = async () => {
  loading.value = true;  // Démarre le loader
  await login();         // Effectue l'appel à la méthode login
  loading.value = false; // Arrête le loader
};*/

/*const handleSubmit = async () => {
  loading.value = true;  // Démarre le loader
  console.log("Loading started", loading.value);

  // Simulez un délai pour voir le loader
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simule un délai de 1 seconde

  await login();         // Effectue l'appel à la méthode login

  loading.value = false; // Arrête le loader
  console.log("Loading ended", loading.value);
};*/

const handleSubmit = async () => {
  
  // Vérification si le champ email est vide
  if (!username.value) {
    toast.error("L'adresse email est requise.");
    return; // Empêche la soumission du formulaire
  }

  // Vérification du format de l'email (expression régulière)
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(username.value)) {
    console.log("Email invalide:", username.value); // Vérification du contenu de l'email
    toast.error("Veuillez saisir une adresse email valide.");
    return; // Empêche la soumission du formulaire
  }

  // Vérification si le champ mot de passe est vide
  if (!password.value) {
    toast.error("Le mot de passe est requis.");
    return; // Empêche la soumission du formulaire
  }

  loading.value = true;  // Démarre le loader
  //console.log("Loading started", loading.value);

  // Simulez un délai pour voir le loader (à supprimer dans la version réelle)
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simule un délai de 1 seconde

  try {
    await login(); // Effectue l'appel à la méthode login
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    toast.error("Une erreur est survenue lors de la connexion.");
  } finally {
    loading.value = false; // Arrête le loader
    //console.log("Loading ended", loading.value);
  }
};
</script>

<template>
  <div class="login-page">
    <section class="login-div-sec">
      <div class="container login-div">
        <div class="row">
          <div class="col-md-6 col-left">
            <div class="login-card-main">
              <div class="login-card-inner">
                <div class="img-area">
                  <img src="@/assets/secure-check-effect-img.png" alt="secure-login-logo" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-right">
            <div class="detail-area">
              <div class="detail-area-inner">
                <div class="logo">
                  <h1>Login</h1>
                </div>
                <form @submit.prevent="handleSubmit">
                  <div class="form-input-box">
                    <input
                      type="email"
                      id="client-email"
                      name="client-email"
                      v-model="username"
                      @focus="inputFocused = 'username'"
                      @blur="inputFocused = ''"
                    />
                    <label :class="{ active: inputFocused === 'username' || username }">Email</label>
                  </div>

                  <div class="form-input-box">
                    <input
                      type="password"
                      id="pwd"
                      name="pwd"
                      v-model="password"
                      @focus="inputFocused = 'password'"
                      @blur="inputFocused = ''"
                    />
                    <label :class="{ active: inputFocused === 'password' || password }">Password</label>
                  </div>
                  <p><a href="#">Change Password</a></p>
                  <!-- <div class="form-input-box">
                    <input type="submit" value="Login" />
                  </div> -->

                  <div class="submit-button form-input-box">
                    <input 
                      type="submit" 
                      :value="loading ? '' : 'Soumettre'"
                      :disabled="loading" 
                    />

                    <div v-if="loading" class="loader-container">
                      <div class="loader"></div>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
  </div>
</template>

<style scoped>

.submit-button {
  display: flex;
  align-items_: center;
  justify-content_: center;
  position: relative;
}

input[type="submit"] {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #3498db; /* Couleur du bouton */
  color: white;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  position: relative;
  text-align: center; /* Centre le texte du bouton */
}

input[type="submit"]:disabled {
  background-color: #b0c4de; /* Couleur grise quand le bouton est désactivé */
  cursor: not-allowed;
}

.loader-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centrer le spinner dans le bouton */
}

.loader {
  border: 4px solid #f3f3f3; /* Light gray */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 20px;  /* Taille du spinner */
  height: 20px; /* Taille du spinner */
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-input-box {
  position: relative;
  margin-bottom: 20px;
}

.form-input-box input {
  width: 100%;
  padding: 10px 10px 5px; /* Ajout d'un padding en bas pour éviter le chevauchement */
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  background: transparent;
  position: relative;
}

.form-input-box label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #aaa;
  transition: all 0.3s ease;
  pointer-events: none;
  background: white; /* Assure que le texte ne chevauche pas */
  padding: 0 5px;
  margin-top :0 !important;
}

.form-input-box input:focus + label,
.form-input-box label.active {
  top: 13px;
  font-size: 12px;
  color: #3498db;
}
</style>






