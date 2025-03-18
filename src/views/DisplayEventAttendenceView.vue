<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
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

    return {
      domain,
      eventAttendence,
      message,
      error,
      goToMenu,
      isAdmin,
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
</style>
