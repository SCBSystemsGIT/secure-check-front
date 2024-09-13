<script setup>
import { useLogin } from "@/services/login";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
const { login, username, password, statusCode } = useLogin();

const router = useRouter();

watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
      toast.success("Connexion réussie.");
      setTimeout(() => {
        router.push("/menu");
      }, 1500);
      break;
    case 201:
      toast.success("Created - Utilisateur connecté avec succès.");
      break;
    case 400:
      toast.error("Bad Request - La requête est mal formée.");
      break;
    case 401:
      toast.error("Unauthorized - Identifiants incorrects.");
      break;
    case 403:
      toast.error("Forbidden - Accès refusé.");
      break;
    case 404:
      toast.error("Not Found - La ressource demandée n'existe pas.");
      break;
    case 500:
      toast.error("Internal Server Error - Une erreur interne est survenue.");
      break;
    default:
      toast.info(`Erreur inconnue - Code : ${newStatus}`);
  }
});
</script>

<template>
  <section class="background-gradi login-meeting">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo">
            <a href="#"
              ><img
                src="@/assets/secure-check-logo.png"
                class=""
                alt="secure-check-logo"
            /></a>
          </div>
          <form action="">
            <div>
              <label for="client-email">Email</label>
              <input
                type="email"
                id="client-email"
                name="client-email"
                v-model="username"
              /><br />
            </div>
            <div>
              <label for="pwd">Password</label>
              <input type="password" id="pwd" name="pwd" v-model="password" />
            </div>
            <div class="submit-button">
              <input type="submit" value="Submit" @click.prevent="login" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
