<script setup>
import { onMounted, ref, computed } from "vue";
import { useCreateQR } from "@/services/useCreateQR";
import { useGlobalStore } from "@/stores/globalStore";
import { useRouter , useRoute } from 'vue-router';


const { fetchQrCodeList, qrCodes } = useCreateQR();
const { publicDir } = useGlobalStore();
const router = useRouter();
const route = useRoute();
const domain = ref(route.params.domain || "scb");
const selectedImage = ref({ src: null, name: null, uidn: null, email: null, contact: null, title: null });

// const openImageModal = (imagePath, fullName, uidn, email, contact, title) => {
//   selectedImage.value = {
//     src: imagePath,
//     name: fullName,
//     uidn: uidn,
//     email: email,
//     contact: contact,
//     title: title,
//   };
// };

// const closeImageModal = () => {
//   selectedImage.value = { src: null, name: null, uidn: null };
// };

const goToQrDetails = (id,firstname, lastname, uidn, email, contact, title, code) => {
  router.push({
    name: 'QrDetails',
    params: {
      domain: domain.value,
      id: id,
    },
     state: {
      src: `${publicDir}/${code}`,
      name: `${firstname} ${lastname}`,
      uidn: uidn,
      email: email,
      contact: contact,
      title: title,
    },
  });
};


const userInfo = ref(JSON.parse(localStorage.getItem("userInfo")) || {});
const companyId = ref(userInfo.value?.company_id || null);
const roles = ref(userInfo.value?.roles || []);
const currentRole = ref(roles.value.length > 0 ? roles.value[0] : null);
const isAdmin = ref(currentRole.value === "ROLE_ADMIN");

console.log("User Info:", userInfo.value);
console.log("Company ID:", companyId.value);
console.log("Roles:", roles.value);
console.log("Current Role:", currentRole.value);
console.log("Is Admin:", isAdmin.value);

// Filtered QR codes based on role and company ID
const filteredQrCodes = computed(() => {
  if (isAdmin.value) {
    return qrCodes.value; // Admin can see all users
  }
  if (currentRole.value === "ROLE_SUPERVISOR" || currentRole.value === "ROLE_SecureCheck") {
    return qrCodes.value.filter(
      (user) => String(user.company?.id) === String(companyId.value) // Access company.id for comparison
    );
  }
  return []; // Default to no users if role doesn't match
});

onMounted(() => {
  fetchQrCodeList();
});
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

  <div class="container">
    <h3 style="text-align: center;">QR User List</h3>

    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Contact</th>
          <th>Image</th>
          <th>QR Code</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredQrCodes" :key="user.id">
          <td>{{ user.firstname }} {{ user.lastname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.contact }}</td>
          <td>
            <img
              v-if="user.user_image"
              :src="`${publicDir}/user_document/${user.user_image}`"
              alt="User Image"
              width="75"
              height="75"
            />
          </td>
          <td>
            <img
              v-if="user.code"
              :src="`${publicDir}/${user.code}`"
              alt="QR Code"
              width="100"
              height="100"
              class="qr-clickable"
              @click="() => goToQrDetails(user.id, user.firstname, user.lastname, user.uidn, user.email, user.contact, user.title , user.code)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="selectedImage.src" class="modal-overlay" @click="closeImageModal">
      <button class="close-button" @click="closeImageModal">&times;</button>
      <div class="modal-content" @click.stop>
        <div style="text-align: center">
          <h5>Name : {{ selectedImage.name }}</h5>
          <h5>Email : {{ selectedImage.email }}</h5>
          <h5>Contact : {{ selectedImage.contact }}</h5>
          <h5>Title : {{ selectedImage.title }}</h5>
          <img :src="selectedImage.src" alt="Full QR Code" class="full-image" />
          <h3 style="color: #fff">{{ selectedImage.uidn }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th,
.table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.qr-clickable {
  cursor: pointer;
  border: 1px solid #aaa;
  padding: 2px;
  transition: transform 0.2s;
}
.qr-clickable:hover {
  transform: scale(1.1);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  padding: 1rem;
  background-color: black;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.full-image {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  color: #fff;
  border: none;
  cursor: pointer;
  z-index: 10000;
  transition: color 0.2s ease;
}
.close-button:hover {
  color: #e00;
}
.create-qr_section .user-details {
  text-align: left;
  padding: 30px 0px;
}
.create-qr_section .user-details p {
  color: #ffffff;
  font-size: 18px;
}
</style>