<script setup>
import { ref, computed, onMounted } from "vue";
import { useRequestsList } from "@/services/useRequestsList";
import { useRoute, useRouter } from "vue-router";
import { useEvent } from "@/services/useEvent";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css"; // Ensure this is imported
import { useGlobalStore } from "@/stores/globalStore";

const { requests, error, fetchRequestsByComp, fetchRequests ,deleteVisitor} = useRequestsList();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { publicDir } = useGlobalStore();


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

// const goToMenu = () => {
//   router.push({ name: "Menu", params: { domain: domain.value } });
// };

// const selectedImage = ref(null);

// const openImageModal = (imagePath) => {
//   selectedImage.value = imagePath;
// };
// const closeImageModal = () => {
//       selectedImage.value = null;
//     };
const currentPage = ref(1);
const itemsPerPage = ref(10);

const roles = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
const currentRole = ref(roles?.value?.roles ? roles.value.roles[0] : "");

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const tableHeaders = computed(() => {
  const headers = [
    "Visiteur",
    "Email",
    "Contact",
    "Image",
    (event_slug !== "list-qrcode-events" ? "Host" : []),
    (event_slug !== "list-qrcode-events" ? "Reason" : []),
    (event_slug == "list-qrcode-events" ? "checkIn" : []),
    "Statut",
    "Date Création"
  ];

  if (currentRole.value !== "ROLE_SUPERVISOR" || event_slug !== "list-qrcode-events") {
    headers.push("Action");
  }
  if(currentRole.value === "ROLE_ADMIN") {
    headers.push("Delete");
  }
  return headers;
});

console.log("Path-event", window.location.pathname);
const path = window.location.pathname;
const segments = path.split("/"); 
const event_slug = segments[2]; 
console.log(event_slug);

const tableBody = computed(() => {
  const body = [
    { slot: "visitor" },
    { slot: "email" },
    { slot: "contact" },
    { slot: "image" },
    (event_slug !== "list-qrcode-events" ? "host" : []),
    (event_slug !== "list-qrcode-events" ? "reason" : []),
    { slot: "checkIn" },
    { slot: "confirmed" },
    { slot: "request_date" },
  ];

  if (currentRole.value !== "ROLE_SUPERVISOR" || event_slug === "list-qrcode-events") {
    body.push({ slot: "actions" });
  }
  if(currentRole.value === "ROLE_ADMIN"  )  {
    body.push({ slot: "delete" });
  }
  return body;
});

const goBack = () => {
  router.go(-1); 
};

const show = (id, firstname, lastname, address, request_time , request_date ,organisationName, city, state, zipcode, country ) => {

  router.push({
    name: "WaitingValidation",
    params: {
      domain: domain.value,
      id: id,
    },
    state: { 
      firstname: firstname,
      lastname: lastname,
      address: address,
      request_time: request_time,
      request_date: request_date,
      organisationName: organisationName,
      city: city,
      state: state,
      zipcode: zipcode,
      country: country,
      
     },
  });
};

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return route.params.slug
    ? filteredRequests.value.slice(start, end)
    : requests.value.slice(start, end);
});
console.log('requestid234344',paginatedRequests);
const { showEvent, event } = useEvent();
const filteredRequests = computed(() => {
  return requests.value.filter(
    (request) => request.visitor.evenements?.id === event?.value?.id
  );
});

const domain = ref(route.params.domain || "scb");
onMounted(async () => {
  if (route?.params?.slug) {
    await showEvent(route?.params?.slug);
  }

  if (!userStore.isAdmin(currentRole.value)) {
    await fetchRequestsByComp(domain.value);
    requests.value = filteredRequests.value;
    console.log("asfdf",requests.value);
  }  else {
    await fetchRequests();
    requests.value = filteredRequests.value;
    console.log("asfdf",requests.value);
  }

 
});

const handleDelete = async (visitorId, visitorName) => {
  const isConfirmed = confirm(`Are you sure you want to delete ${visitorName}?`);
  if (!isConfirmed) return;

  await toast.promise(
    deleteVisitor(visitorId), // Async delete function
    {
      pending: `Deleting ${visitorName}...`,
      success: `User ${visitorName} deleted successfully!`,
      error: `Failed to delete ${visitorName}.`,
    },
    {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      closeButton: true,
    }
  );
  
  // Refresh the page after successful deletion
  await fetchRequests();
};

const selectedImage = ref(null);

    const openImageModal = (imagePath) => {
      selectedImage.value = imagePath;
    };

    const closeImageModal = () => {
      selectedImage.value = null;
    };


</script>


<template>

  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
            <div class="left-back" v-if="event_slug !== 'list-qrcode-events'">
              <router-link :to="{ name: 'Menu' }">
                <img src="@/assets/back-arrow-table.png" alt="back-arrow" />
              </router-link>
            </div>
            <div class="left-back" v-else>
              <button class="employee_back" @click="goBack()"><img src="@/assets/back-arrow-table.png" alt="back-arrow" /></button>
            </div>
        </div>
      </div>
    </div>
  </section>

  <div class="container">
    <!-- <div class="text-center py-4">
      <h3>Liste des demandes</h3>
      <h4 v-if="route?.params?.slug">Evenements : {{ event?.name }}</h4>
    </div> -->
    <div class="d-flex justify-content-center align-items-center">
      <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
        <h3 class="mt-3" v-if="route?.params?.slug">Liste Participants</h3>

        <h3 class="mt-3" v-else>Liste des demandes</h3>
      </div>
    </div>

    <div class="text-center">
      <h4 v-if="route?.params?.slug">Evenements : {{ event?.name }}</h4>
    </div>

    <div class="d-flex justify-content-center py-3">
      <ui-table
        :data="paginatedRequests"
        :thead="tableHeaders"
        :tbody="tableBody"
      >

        <template #visitor="{ data }">
          {{ data.visitor.firstname }}
          {{ data.visitor.lastname }}
        </template>

        <template #email="{ data }">
          {{ data.visitor.email }}
        </template>

        <template #contact="{ data }">
          {{ data.visitor.contact }}
        </template>
        
        <template #image="{ data }">
          <img 
            :src="`${publicDir}/request_image/${data?.visitor?.request_image || 'default.png'}`" 
            :alt="data?.visitor?.request_image ? 'Visitor Image' : 'No Image'" 
            height="75" 
            width="75" 
            class="clickable-image"
            @click="openImageModal(`${publicDir}/request_image/${data?.visitor?.request_image}`)"
          />
        </template>
        
        <template #request_date="{ data }">
          {{ formatDate(data.request_date) }}
        </template>
        
        <template #checkIn="{ data }" v-if= "event_slug === 'list-qrcode-events'">
          {{ formatDateTime(data.visitor.checkIns[0]?.check_in_time) || 'No Check-in Data' }}
        </template>
        
        <template #confirmed="{ data }">
          {{ data.confirmed ? "Confirmé" : "En attente" }}
        </template>

        <template #actions="{ data }" v-if="currentRole !== 'ROLE_SUPERVISOR'  && event_slug !== 'list-qrcode-events'" >
          <ui-icon v-if="currentRole !== 'ROLE_SUPERVISOR'&& data.confirmed !=true && data.status !=true " role="button" @click="show(data.id, data.visitor.firstname, data.visitor.lastname, data.visitor.address , data.visitor.request_time , data.visitor.request_date , data.visitor.organisationName,data.visitor.city, data.visitor.state, data.visitor.zipcode,  data.visitor.country )"> edit </ui-icon>
        </template>

        <template #delete="{ data }" v-if="currentRole === 'ROLE_ADMIN'">
          <ui-icon role="button" @click="handleDelete(data.id , data.visitor.firstname,)">delete</ui-icon>
        </template>

        <ui-pagination
          v-if="!route?.params?.slug"
          v-model="currentPage"
          :total="requests.length"
          show-total
          @update:model-value="onPage"
        ></ui-pagination>
      </ui-table>
    </div>
    <div v-if="error">{{ error }}</div>
    <div v-if="selectedImage" class="modal-overlay" @click="closeImageModal">
      <button class="close-button" @click="closeImageModal">&times;</button>
      <div class="modal-content" @click.stop>
        <img :src="selectedImage" alt="Full Image" class="full-image" />
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  margin: 0 10px;
  padding: 5px 10px;
}
.left-back .employee_back {
    background: transparent;
    padding: 0 !important;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #00000000;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.full-image {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 5px;
}
.clickable-image {
  cursor: pointer;
  margin: 20px 0;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgb(0, 0, 0);
  color: white;
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  font-size: 30px;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99999;
}

</style>
