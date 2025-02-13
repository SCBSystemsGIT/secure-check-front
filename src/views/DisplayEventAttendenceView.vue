<script>
import myService from "@/services/useEventsAttendenceList"; // Adjust the path based on your project structure
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "DisplayEventAttendence",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb-systems-africa");
    const eventAttendence = ref([]); // Flattened list of all visitors
    const message = ref("");
    const error = ref(null);

    // Function to fetch and process event data
    const fetchEventData = async () => {
      try {
        const response = await myService.fetchData(); // Fetch the data from the service
        console.log("Fetched Response:", response);

        // Map visitors to include event details
        const eventDataWithVisitors = response.flatMap((item) =>
          item.visitors.map((visitor) => ({
            ...visitor,
            eventName: item.event.name,
            eventLocation: item.event.location,
            eventCreatedAt: item.event.created_at,
          }))
        );

        eventAttendence.value = eventDataWithVisitors;

        message.value = "Data fetched successfully!"; // Set a success message
      } catch (err) {
        error.value = "Failed to fetch data."; // Set an error message if the fetch fails
        console.error(err);
      }
    };

    // Navigate to the Menu page
    const goToMenu = () => {
      router.push({
        name: "Menu",
        params: {
          domain: domain.value,
        },
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
    };
  },
};
</script>

<template>
  <div class="container">
    <!-- Back Button and Header -->
    <div class="d-flex justify-content-center align-items-center">
      <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
        <button class="back" @click="goToMenu()">Retour</button>
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
          <tr v-for="log in eventAttendence" :key="log.id">
            <td>{{ log.id }}</td>
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
</template>
