<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import myService from "@/services/visitorcode";
import { useUserStore } from "@/stores/useUserStore";

export default {
  name: "UserAttendenceView",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb");
    const userLogs = ref([]);
    const message = ref("");
    const error = ref(null);
    const userStore = useUserStore();

    // Fetch user info from localStorage
    const userInfo = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
    const companyId = ref(userInfo.value?.company_id || null);

    // Extract roles safely
    const roles = ref(userInfo.value?.roles || []);
    const currentRole = ref(roles.value.length > 0 ? roles.value[0] : null);
    const isAdmin = ref(currentRole.value === "ROLE_ADMIN"); // Check if user is admin

    console.log("Logged-in Company ID:", companyId.value);
    console.log("Current Role:", currentRole.value);
    console.log("Is Admin:", isAdmin.value);

    // Function to fetch user logs
    const fetchUserData = async () => {
      try {
        const response = await myService.fetchUserLog(); // Fetch the data from API
        userLogs.value = response;
        message.value = "Data fetched successfully!";
      } catch (err) {
        error.value = "Failed to fetch data.";
        console.error(err);
      }
    };

    // Computed property to filter logs
    const filteredUserLogs = computed(() => {
      return isAdmin.value ? userLogs.value : userLogs.value.filter(log => log.company_id === companyId.value);
    });

    // Function to navigate to Menu page
    const goToMenu = () => {
      router.push({
        name: "Menu",
        params: { domain: domain.value },
      });
    };

    // Fetch user logs when component mounts
    onMounted(() => {
      fetchUserData();
    });

    return {
      domain,
      userLogs,
      filteredUserLogs,
      message,
      error,
      goToMenu,
      userStore,
      companyId,
      isAdmin,
      currentRole,
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

  <div class="container user_attendence">
    <!-- Header -->
    <div class="d-flex justify-content-center align-items-center">
      <div class="d-flex justify-content-start mb-4 gap-3 align-items-center">
        <h3 class="mt-3">Lista de Check in</h3>
      </div>
    </div>

    <!-- Visitor Logs Table -->
    <div class="d-flex justify-content-center py-3">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>User Id</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!filteredUserLogs || filteredUserLogs.length === 0">
            <td colspan="6" class="text-center">Data not found</td>
          </tr>
          <tr v-else v-for="(log, index) in filteredUserLogs" :key="log.id">
            <td>{{ index + 1 }}</td>
            <!-- <td>{{ log.user_id }}</td> -->
            <td>{{ log.user_name }}</td>
            <td>{{ log.user_email }} {{ log.id }}</td>
            <td>{{ log.check_in_time }}</td>
            <td>{{ log.check_out_time }}</td>
            <td>
              <router-link :to="{ name: 'UserQrCodeDisable', params: { id: log.user_id } }">Edit</router-link>
            </td>
          </tr>
        </tbody>
      </table>
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
