<script>
import myService from "@/services/visitorcode"; // Adjust the path based on your project structure
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "DisplayCodeView",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb-systems-africa");
    const visitorLogs = ref([]);
    const message = ref("");
    const error = ref(null);

    // Function to fetch event data
    const fetchEventData = async () => {
      try {
        const response = await myService.fetchData(); // Fetch the data from the service
        console.log('Fetched Response:', response);
        visitorLogs.value = response; // Store the fetched logs in the ref
        message.value = "Data fetched successfully!"; // Set a success message
      } catch (err) {
        error.value = "Failed to fetch data."; // Set an error message if the fetch fails
        console.error(err);
      }
    };

    // Function to handle other service method
    // const handleOtherService = (param) => {
    //   message.value = myService.anotherServiceMethod(param);
    // };

    // Function to navigate to Menu page
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
      visitorLogs,
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
        <h3 class="mt-3" v-else>Lista de Check in</h3>
      </div>
    </div>

    <!-- Event Name Display -->
    <div class="text-center">
      <h4 v-if="route?.params?.slug">Evenements : {{ event?.name }}</h4>
    </div>

    <!-- Visitor Logs Table -->
    <div class="d-flex justify-content-center py-3">
      <table v-if="visitorLogs.length" class="table table-striped">
        <thead>
          <tr>
            <th>Visitor Id</th>
            <th>Visitor Name</th>
            <th>Visitor Email</th>
            <th>Created At</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in visitorLogs" :key="log.id">
            <td>{{ log.visitor_id }}</td>
            <td>{{ log.visitor_name }}</td>
            <td>{{ log.visitor_email }}</td>
            <td>{{ log.created_at }}</td>
            <td>{{ log.check_in_time }}</td>
            <td>{{ log.check_out_time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Success or Error Message -->
    <!-- <div v-if="message" class="alert alert-success">{{ message }}</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div> -->
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
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>
