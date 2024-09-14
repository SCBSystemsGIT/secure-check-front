<script setup>
import { useCreateUser } from "@/services/createUser";
import { useDepartement } from "@/services/useDepartement";
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const { user, loading, errorMessage, successMessage, createUser, statusCode } =
  useCreateUser();
const { departements, fetchDepartements } = useDepartement();
const router = useRouter();

const submitForm = () => {
  createUser();
};

onMounted(async () => {
  await fetchDepartements();
});
// Watcher pour réagir aux changements du statusCode
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 200:
      toast.success("OK - Utilisateur créé avec succès.");
      toast.info(successMessage);
      router.push("");
      break;
    case 201:
      toast.success("Created - L'utilisateur a été créé avec succès.");
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
</script>

<template>
  <div class="background-gradi">
    <section class="request-meeting meeting-form">
      <div class="container">
        <div class="row align-items-center">
          <div class="col col-12 col-md-12 col-sm-12">
            <form @submit.prevent="submitForm">
              <div>
                <label for="name">Nom</label><br />
                <input type="text" id="name" v-model="user.name" /><br />
              </div>

              <div>
                <label for="firstname">Prénom</label><br />
                <input
                  type="text"
                  id="firstname"
                  v-model="user.firstname"
                /><br />
              </div>

              <div>
                <label for="email">Email</label><br />
                <input type="email" id="email" v-model="user.email" /><br />
              </div>

              <div>
                <label for="password">Mot de passe</label><br />
                <input
                  type="password"
                  id="password"
                  v-model="user.password"
                /><br />
              </div>

              <div>
                <label for="title">Titre</label><br />
                <input type="text" id="title" v-model="user.title" /><br />
              </div>

              <div>
                <label for="contact">Numéro de téléphone</label><br />
                <input type="text" id="contact" v-model="user.contact" /><br />
              </div>

              <div>
                <label for="role">Rôle</label><br />
                <select
                  id="role"
                  v-model="user.role"
                  name="country"
                  class="form-control"
                >
                  <option value="ROLE_USER">Utilisateur</option>
                  <option value="ROLE_EMPLOYEE">Employé</option>
                  <option value="ROLE_SUPERVISOR">Superviseur</option>
                  <!-- <option value="ROLE_VISITOR">Visiteur</option> -->
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_SUPER_ADMIN">Super Admin</option></select
                ><br />
              </div>

              <div>
                <label for="department">Department</label><br />
                <select
                  v-model="user.department_id"
                  id="department"
                  name="department"
                  class="form-control"
                >
                  <option
                    v-for="departement in departements"
                    :key="departement.id"
                    :value="departement.id"
                  >
                    {{ departement.name }}
                  </option></select
                ><br />
              </div>

              <div v-show="false">
                <label for="status">Statut</label><br />
                <input type="checkbox" id="status" v-model="user.status" />
                <span v-if="user.status">Actif</span>
                <span v-else>Inactif</span><br />
              </div>

              <div class="submit-button">
                <input type="submit" value="Soumettre" :disabled="loading" />
              </div>

              <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
