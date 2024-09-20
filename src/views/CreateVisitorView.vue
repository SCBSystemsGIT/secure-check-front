<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useCreateVisitor } from "@/services/useCreateVisitor";
import { useUserStore } from "@/stores/useUserStore";
import { useUserInfo } from "@/services/useUserInfo";
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from "vue-router";
import { useVisitRequest } from "@/services/useVisitRequest";
import { useEvent } from "@/services/useEvent";
// import { useCompanies } from "@/services/useCompanies";

const currentRole = ref();
const roles = ref();
roles.value = JSON.parse(localStorage.getItem("userInfo"));
currentRole.value = roles.value.roles[0];

const { userInfo, fetchUserInfo } = useUserInfo();
const { createVisitor, statusCode, visitorId } = useCreateVisitor();
const { createVisitRequest, requestId } = useVisitRequest();
// const { showCompany, company } = useCompanies();

const { showEvent, event } = useEvent();

const userStore = useUserStore();
const isAuthenticated = userStore.isAuthenticated();

const router = useRouter();
const route = useRoute();

const visitor = ref({
  user_id: userInfo?.value?.id,
  evenements_id: event?.value?.id ?? null,
  firstname: "",
  lastname: "",
  email: "",
  contact: "",
  address: "",
  id_number: "",
  organisation_name: "",
  visitor_type: "",
});

const visitRequest = ref({
  user_id: userInfo?.value?.id,
  visitor_id: "",
  host: "",
});

const errorMessage = ref("");
const loading = ref(false);

const submitForm = async () => {
  visitor.value.user_id = userInfo?.value?.id;

  try {
    visitor.value.evenements_id = event?.value?.id;
    await createVisitor(visitor.value);

    visitRequest.value.visitor_id = visitorId.value;
    visitRequest.value.user_id = userInfo?.value?.id;

    await createVisitRequest(visitRequest.value);
    // Réinitialiser le formulaire ou rediriger si nécessaire
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

const title = ref("");
onBeforeMount(async () => {
  if (route.params.slug) {
    await showEvent(route.params.slug);
    title.value = event.value.name;
  }

  await fetchUserInfo();
});

// Watcher pour réagir aux changements du statusCode
watch(statusCode, (newStatus) => {
  switch (newStatus) {
    case 201:
      console.log(">------------>");
      console.log(requestId.value);

      if (isAuthenticated) {
        toast.success("Visiteur créé avec succès.");

        if (userStore.isEmployee(currentRole.value)) {
          console.log("employee");

          setTimeout(() => {
            router.push("/menu");
          }, 1500);
        } else {
          setTimeout(() => {
            router.push("/waiting-validation/" + requestId.value);
          }, 1500);
        }
      } else {
        toast.success("Demande créé avec succès.");

        setTimeout(() => {
          router.push("/");
        }, 1500);
      }

      break;
    case 200:
      if (isAuthenticated) {
        toast.success("Visiteur créé avec succès.");

        if (userStore.isEmployee(currentRole.value)) {
          console.log("employee");
          router.push("/menu");
        } else {
          setTimeout(() => {
            router.push("/waiting-validation/" + requestId.value);
          }, 1500);
        }
      } else {
        toast.success("Demande créé avec succès.");

        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
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
</script>

<template>
  <section class="request-meeting">
    <div class="background-gradi">
      <section class="request-meeting meeting-form">
        <div class="row align-items-center">
          <div class="col col-12 col-md-12 col-sm-12">
            <h3 class="text-center pb-3" v-if="title">
              {{ title }}
            </h3>

            <form @submit.prevent="submitForm">
              <div>
                <label for="visitor_type">Type de visiteur</label><br />
                <select
                  name="visitor_type"
                  id="visitor_type"
                  class="form-control"
                  v-model="visitor.visitor_type"
                >
                  <option value="1">Permanent</option>
                  <option value="2">Temporaire</option>
                </select>
              </div>

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
                <label for="email">Email</label><br />
                <input
                  type="email"
                  id="email"
                  v-model="visitor.email"
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
                <label for="organisation_name">Employeur</label><br />
                <input
                  type="text"
                  id="organisation_name"
                  v-model="visitor.organisation_name"
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
                <label for="h-name">Nom d’hôte</label><br />
                <input
                  type="text"
                  id="h-name"
                  name="h-name"
                  v-model="visitRequest.host"
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
