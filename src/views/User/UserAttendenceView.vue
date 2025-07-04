

<script>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import myService from "@/services/visitorcode";
import { useUserStore } from "@/stores/useUserStore";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useGlobalStore } from "@/stores/globalStore";

export default {
  name: "UserAttendenceView",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const domain = ref(route?.params?.domain || "scb");
    const userStore = useUserStore();
    const { publicDir } = useGlobalStore();

    const userInfo = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
    const companyId = ref(userInfo.value?.company_id || null);
    const roles = ref(userInfo.value?.roles || []);
    const currentRole = ref(roles.value.length > 0 ? roles.value[0] : null);
    const isAdmin = ref(currentRole.value === "ROLE_ADMIN");

    const allLogs = ref([]);
    const groupedLogs = ref({});
    const calendarRefs = ref({});
    const calendarInstances = ref({});
    const selectedImage = ref(null);

    const showModal = ref(false);
    const modalUser = ref(null);

    const openImageModal = (imagePath) => {
      selectedImage.value = imagePath;
    };
    const closeImageModal = () => {
      selectedImage.value = null;
    };

    const openUserLogModal = (user) => {
      modalUser.value = user;
      showModal.value = true;
    };

    const groupLogs = () => {
      const grouped = {};
      const filteredLogs = isAdmin.value
        ? allLogs.value
        : allLogs.value.filter((log) => log.company_id === companyId.value);

      filteredLogs.forEach((log) => {
        if (!grouped[log.user_id]) {
          grouped[log.user_id] = {
            user_id: log.user_id,
            user_name: log.user_name,
            user_email: log.user_email,
            user_phone: log.user_phone,
            image: log.image,
            check_logs: [],
          };
        }

        let logs = [];
        try {
          logs = typeof log.check_logs === "string"
            ? JSON.parse(log.check_logs)
            : log.check_logs;
        } catch (e) {
          console.error("Invalid JSON in check_logs", e);
        }

        logs.forEach((entry) => {
          const checkInDate = new Date(entry.check_in);
          if (!isNaN(checkInDate)) {
            const date = checkInDate.toISOString().split("T")[0];
            grouped[log.user_id].check_logs.push({
              check_in: entry.check_in ?? "N/A",
              check_out: entry.check_out ?? "",
              date: date ?? "N/A",
            });
          }
        });
      });

      groupedLogs.value = grouped;
    };

    const initCalendars = async () => {
      await nextTick();

      Object.keys(groupedLogs.value).forEach((userId) => {
        const user = groupedLogs.value[userId];
        const logsByDate = user.check_logs.reduce((acc, log) => {
          if (!acc[log.date]) acc[log.date] = [];
          acc[log.date].push({
            check_in: log.check_in ? new Date(log.check_in) : null,
            check_out: log.check_out ? new Date(log.check_out) : null,
          });
          return acc;
        }, {});

        const dateRanges = [];
        Object.keys(logsByDate).forEach((date) => {
          logsByDate[date].forEach((log) => {
            dateRanges.push([log.check_in, log.check_out]);
          });
        });

        calendarInstances.value[userId] = flatpickr(calendarRefs.value[userId], {
          mode: "range",
          enableTime: true,
          dateFormat: "Y-m-d H:i",
          defaultDate: dateRanges.flat(),
          defaultViewDate: dateRanges.length ? dateRanges[0][0] : undefined,
        });
      });
    };

    const openCalendar = (userId) => {
      calendarInstances.value[userId]?.open();
    };

    const fetchUserData = async () => {
      try {
        const response = await myService.fetchUserLog();
        allLogs.value = response;
        groupLogs();
        initCalendars();
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    const formatDate = (datetime) => {
      if (!datetime) return "N/A";
      return new Date(datetime).toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const goToMenu = () => {
      router.push({ name: "Menu", params: { domain: domain.value } });
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      groupedLogs,
      calendarRefs,
      openCalendar,
      formatDate,
      goToMenu,
      publicDir,
      openImageModal,
      closeImageModal,
      selectedImage,
      openUserLogModal,
      showModal,
      modalUser,
      userStore,
    };
  },
};
</script>




<template>
  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12">
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
    <h3 class="mt-3 mb-4 text-center">Liste Check in / Check out Participants</h3>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>User Name</th>
          <th>User Email</th>
          <th>Contact</th>
          <th>Image</th>
          <th>Date</th>
          <th>Check In/Out</th>
          <!-- <th>Check Out</th> -->
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="Object.keys(groupedLogs).length === 0">
          <td colspan="8" class="text-center">No data found</td>
        </tr>
        <tr
          v-for="(user, index) in Object.values(groupedLogs)"
          :key="user.user_id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ user.user_name }}</td>
          <td>{{ user.user_email }}</td>
          <td>{{ user.user_phone }}</td>
          <td>
            <img
              :src="`${publicDir}/user_document/${user.image}`"
              height="75"
              width="75"
              class="clickable-image"
              @click="openImageModal(`${publicDir}/user_document/${user.image}`)"
              alt="No img"
            />
          </td>

          <td>
          <img
            src="@/assets/calendar.png"
            alt="Open Calendar"
            width="24"
            style="cursor: pointer"
            @click="openCalendar(user.user_id)"
          />
          <input
            type="text"
            class="calendar-hidden-input"
            :ref="(el) => (calendarRefs[user.user_id] = el)"
            readonly
          />
        </td>

        <td>
          <a style="cursor: pointer;"  @click.prevent="openUserLogModal(user)">View</a>
        </td>
          <td>
            <router-link
              :to="{ name: 'UserQrCodeDisable', params: { id: user.user_id } }"
              >Edit</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="selectedImage" class="modal-overlay" @click="closeImageModal">
        <button class="close-button" @click="closeImageModal">&times;</button>
        <div class="modal-content" @click.stop>
          <img :src="selectedImage" alt="Full Image" class="full-image" />
        </div>
      </div>
  </div>

  <div v-if="showModal && modalUser" class="modal-overlay check-in-modal" @click.self="showModal = false">
  <div class="modal-content check-in-content" @click.stop>
    <button class="close-button" @click="showModal = false">&times;</button>
    <h4>{{ modalUser.user_name }}'s Check-In/Out Times</h4>
    <table class="table table-striped mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Check In Time</th>
          <th>Check Out Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, i) in modalUser.check_logs" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ formatDate(log.check_in) }}</td>
          <td>
            {{ log.check_out || '' && formatDate(log.check_out) || '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>



<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 10px;
  text-align: left;
  vertical-align: middle;
}
th {
  background-color: #f4f4f4;
}

.calendar-hidden-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
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

.check-in-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.check-in-content {
  background-color: #fff;
  color: #333;
  padding: 2rem;
  border-radius: 12px;
  max-width: 1130px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.modal-content h4 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: #1a1a1a;
  text-align: center;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-content li {
  margin-bottom: 0.8rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-content li::before {
  content: "🕓";
  font-size: 1.1rem;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  color: #ff3333;
}

</style>
