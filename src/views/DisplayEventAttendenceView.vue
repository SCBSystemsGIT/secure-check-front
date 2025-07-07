<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/globalStore";
import myService from "@/services/useEventsAttendenceList";


export default {
  name: "DisplayEventAttendence",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb");
    const eventAttendence = ref([]);
    const message = ref("");
    const error = ref(null);

    // Fetch user info from localStorage
    const userInfo = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
    const roles = ref(userInfo.value?.roles || []);
    const isAdmin = ref(roles.value.includes("ROLE_ADMIN"));

    console.log("Current User Role:", roles.value);
    console.log("Is Admin:", isAdmin.value);

    const { publicDir } = useGlobalStore();
    // Function to fetch and process event data
    const fetchEventData = async () => {
      try {
        let response = await myService.fetchData();
        console.log("Fetched Response:", response);

        const eventDataWithVisitors = response.flatMap((item) =>
          item.visitors.map((visitor) => ({
            ...visitor,
            eventName: item.event.name,
            eventLocation: item.event.location,
            eventCreatedAt: item.event.created_at,
          }))
        );

        // If admin, show all data; otherwise, filter by domain
        if (!isAdmin.value) {
          response = await myService.fetchVisitorLogCompanyEvent(domain.value);
          console.log("Fetched Company Event Data:", response);
          eventAttendence.value = response.flatMap((item) =>
            item.visitors.map((visitor) => ({
              ...visitor,
              eventName: item.event.name,
              eventLocation: item.event.location,
              eventCreatedAt: item.event.created_at,
            }))
          );
        } else {
          eventAttendence.value = eventDataWithVisitors;
        }

        message.value = "Data fetched successfully!";
      } catch (err) {
        error.value = "Failed to fetch data.";
        console.error(err);
      }
    };

    // Navigate to the Menu page
    const goToMenu = () => {
      router.push({
        name: "Menu",
        params: { domain: domain.value },
      });
    };

    // Fetch event data when the component is mounted
    onMounted(() => {
      fetchEventData();
    });
    const selectedImage = ref(null);

    const openImageModal = (imagePath) => {
      selectedImage.value = imagePath;
    };

    const closeImageModal = () => {
      selectedImage.value = null;
    };

    return {
      domain,
      eventAttendence,
      message,
      error,
      goToMenu,
      isAdmin,
      publicDir,
      openImageModal,
      closeImageModal,
      selectedImage,
    };
  },
};



</script>


<template>
  <section class="secure-datatable-heading-back">
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
  </section>
  <div class= "event_container">
  <div class="container">
    <!-- Back Button and Header -->
    <div class="d-flex justify-content-center align-items-center">
      <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
        <!-- <button class="back" @click="goToMenu()">Retour</button> -->
        <h3 class="mt-3" v-if="route?.params?.slug">Liste Participants</h3>
        <h3 class="mt-3" v-else>Lista de event attendence</h3>
      </div>
    </div>

    <!-- Event Name Display -->
    <div class="text-center">
      <h4 v-if="route?.params?.slug">Evenements : {{ event?.name }}</h4>
    </div>

    <!-- Visitor Logs Table -->
    <div class="d-flex justify-content-center py-3">
      <table v-if="eventAttendence.length" class="table table-striped">
        <thead>
          <tr>
            <th>Visitor Id</th>
            <th>Visitor Name</th>
            <th>Email</th>
            <th>Image</th>
            <th>Visitor Address</th>
            <th>Event Name</th>
            <th>Event Location</th>
            <th>Event Created At</th>
          </tr>
        </thead>
        <tbody>
            
          <tr v-for="(log, index) in eventAttendence" :key="log.id">
            <td>{{ index + 1 }}</td>
            <!-- <td>{{ log.id }}</td> -->
            <td>{{ log.firstname }}</td>
            <td>{{ log.email }}</td>
            <td>
              <img 
                :src="`${publicDir}/request_image/${log.request_image || 'default.png'}`" 
                :alt="log.request_image ? 'Visitor Image' : 'No Image'" 
                height="75" 
                width="75" 
                class="clickable-image"
                @click="openImageModal(`${publicDir}/request_image/${log.request_image}`)"
              />
            </td>
            <td>{{ log.address }}</td>
            <td>{{ log.eventName }}</td>
            <td>{{ log.eventLocation }}</td>
            <td>{{ log.eventCreatedAt }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No data available.</p>
    </div>

    <!-- Success or Error Message -->
    
  </div>
  <div v-if="selectedImage" class="modal-overlay" @click="closeImageModal">
      <button class="close-button" @click="closeImageModal">&times;</button>
      <div class="modal-content" @click.stop>
        <img :src="selectedImage" alt="Full Image" class="full-image" />
      </div>
    </div>
</div>
</template>
<style scoped >
.event_container {
    height: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
