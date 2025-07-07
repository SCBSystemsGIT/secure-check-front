<script>
import myService from "@/services/visitorcode";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGlobalStore } from "@/stores/globalStore";

export default {
  name: "DisplayCodeView",
  setup() {
    const { publicDir } = useGlobalStore();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb");
    const visitorLogs = ref([]);
    const message = ref("");
    const error = ref(null);
    
    // Image Modal
    const selectedImage = ref(null);

    const openImageModal = (imagePath) => {
      selectedImage.value = imagePath;
    };

    const closeImageModal = () => {
      selectedImage.value = null;
    };

    const userInfo = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
    const roles = ref(userInfo.value?.roles || []);
    const isAdmin = ref(roles.value.includes("ROLE_ADMIN"));

    const fetchEventData = async () => {
      try {
        let response;
        if (isAdmin.value) {
          response = await myService.fetchData();
        } else {
          response = await myService.fetchVisitorLogCom(domain.value);
        }
        visitorLogs.value = response;
        message.value = "Data fetched successfully!";
      } catch (err) {
        error.value = "Failed to fetch data.";
        console.error(err);
      }
    };

    onMounted(() => {
      fetchEventData();
    });

    return {
      domain,
      visitorLogs,
      message,
      error,
      publicDir,
      isAdmin,
      selectedImage,
      openImageModal,
      closeImageModal,
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

  <div class="event_container">
    <div class="container">
      <div class="d-flex justify-content-center align-items-center">
        <h3 class="mt-3">Liste Check in</h3>
      </div>

      <div class="d-flex justify-content-center py-3">
        <table v-if="visitorLogs.length" class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Visitor Name</th>
              <th>Visitor Email</th>
              <th>Image</th>
              <th>Created At</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in visitorLogs" :key="log.id">
              <td>{{ index + 1 }}</td>
              <td>{{ log.visitor_name }} {{ log.visitor_lastname }}</td>
              <td>{{ log.visitor_email }}</td>
              <td>
                <img
                  :src="`${publicDir}/request_image/${log.image}`"
                  height="75"
                  width="75"
                  class="clickable-image"
                  @click="openImageModal(`${publicDir}/request_image/${log.image}`)"
                  alt="No img"
                />
              </td>
              <td>{{ log.created_at }}</td>
              <td>{{ log.check_in_time }}</td>
              <td>{{ log.check_out_time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Full Image Modal -->
      <div v-if="selectedImage" class="modal-overlay" @click="closeImageModal">
        <button class="close-button" @click="closeImageModal">&times;</button>
        <div class="modal-content" @click.stop>
          <img :src="selectedImage" alt="Full Image" class="full-image" />
        </div>
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