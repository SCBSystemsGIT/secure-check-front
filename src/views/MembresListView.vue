
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/plugins/axios';
  import { useGlobalStore } from "@/stores/globalStore";
  import jsPDF from 'jspdf';
  import html2canvas from "html2canvas";
  
  export default {
    name: 'MembresListView',
    setup() {
      const route = useRoute();
      const router = useRouter();
      const { publicDir } = useGlobalStore();
      //console.log('publicDir:', publicDir);

      const capture = ref(null);
      const image = ref(null);
      const uidn = ref();

      const companyId = route.params.slug;  // Assuming companyId is passed in the route params
      const company = ref({});
      const membresList = ref([]);
      const formatRole = (role) => {
        if (Array.isArray(role) && role.length) {
          return role[0].replace('ROLE_', '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }
        return 'No Role Assigned';
      };
  
      // Fetch company details and employees
      const fetchMembres = async () => {
        try {
          const companyResponse = await apiClient.get(`/company/${companyId}`);
          company.value = companyResponse.data.data;
          //console.log("Données reçues :", company.value);

          const response = await apiClient.get(`/company/${companyId}/members`);
          membresList.value = response.data;
          //console.log("Données reçues :", membresList.value);
        } catch (err) {
          console.error('Error fetching members:', err);
        }
      };
  
      // Go back to the previous page
      const goBack = () => {
        router.go(-1); 
      };

      const showPopup = ref(false);
      const selectedMember = ref({});
      const selectedCompany = ref({});

      const openCardPopup = (membre) => {
        //console.log("Popup triggered for membre:", membre);
        selectedMember.value = membre;
        selectedCompany.value = company.value; // supposé chargé via API
        //console.log("Compagnie:", selectedCompany.value);
        showPopup.value = true;
      };

      const closePopup = () => {
        showPopup.value = false;
      };

      const captureDiv = async () => {
        if (!capture.value) return;

        // Cacher les boutons avant capture
        const buttonsToHide = document.querySelectorAll(".visitor_button, .capture-button");
        buttonsToHide.forEach((button) => (button.style.display = "none"));

        try {
          // Trouver le recto et verso à partir de la div `capture`
          const rectoEl = capture.value.querySelector('.recto');
          const versoEl = capture.value.querySelector('.verso');

          if (!rectoEl || !versoEl) {
            console.error("Éléments recto/verso non trouvés dans capture");
            return;
          }

          // Capture du RECTO
          const canvasRecto = await html2canvas(rectoEl, {
            useCORS: true,
            allowTaint: true,
          });
          const rectoData = canvasRecto.toDataURL("image/png");
          image.value = rectoData; // pour éventuel aperçu

          // Capture du VERSO
          const canvasVerso = await html2canvas(versoEl, {
            useCORS: true,
            allowTaint: true,
          });
          const versoData = canvasVerso.toDataURL("image/png");
          const uidn = selectedMember.value?.lastname ?? 'inconnu';
          //console.log("UIDN:", uidn);

          // Télécharger le recto comme image PNG
          const link = document.createElement("a");
          link.href = rectoData;
          link.download = `carte-${domain.value}-${uidn}-recto.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Générer le PDF (2 pages)
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();

          // Page 1 : recto
          const rectoProps = pdf.getImageProperties(rectoData);
          const rectoHeight = (rectoProps.height * pdfWidth) / rectoProps.width;
          pdf.addImage(rectoData, "PNG", 0, 0, pdfWidth, rectoHeight);

          // Page 2 : verso
          const versoProps = pdf.getImageProperties(versoData);
          const versoHeight = (versoProps.height * pdfWidth) / versoProps.width;
          pdf.addPage();
          pdf.addImage(versoData, "PNG", 0, 0, pdfWidth, versoHeight);

          pdf.save(`QRCode-Membre-${uidn}.pdf`);
        } catch (error) {
          console.error("Erreur lors de la capture PDF :", error);
        } finally {
          // Réafficher les boutons après
          buttonsToHide.forEach((button) => (button.style.display = "flex"));
        }
      };

      const domain = ref(route.params.domain || "scb");

      // Fetch employee data when the component is mounted
      onMounted(() => {
        fetchMembres();
      });
  
      return {
        company,
        membresList,
        formatRole,
        goBack,
        publicDir,
        openCardPopup,
        closePopup,
        showPopup,
        selectedMember,
        selectedCompany,
        captureDiv,
        capture,
        domain,
        uidn,
        image,
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
              <button class="employee_back" @click="goBack()"><img src="@/assets/back-arrow-table.png" alt="back-arrow" /></button>
            </div>
        </div>
      </div>
    </div>
  </section>
    <div class="container">
      <div class="d-flex justify-content-center align-items-center mb-4">
       
        <h3 class="mt-3">{{ company.name }} - Liste des Membres</h3>
      </div>
  
      <div v-if="membresList.length">
        <table class="mdc-data-table__table">
          <thead>
            <tr class="mdc-data-table__header-row">
              <th class="mdc-data-table__header-cell">ID</th>
              <th class="mdc-data-table__header-cell">Photo</th>
              <th class="mdc-data-table__header-cell">Nom</th>
              <th class="mdc-data-table__header-cell">Contact</th>
              <th class="mdc-data-table__header-cell">Email</th>
              <th class="mdc-data-table__header-cell">Qr Code</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="membres in membresList" :key="membres.id" class="mdc-data-table__row">
              <td class="mdc-data-table__cell">{{ membres.id }}</td>
              <td class="mdc-data-table__cell">
                <img
                  v-if="membres.user_image"
                  :src="`${publicDir}/user_document/${membres.user_image}`"
                  alt="Photo du Membre"
                  title="Photo du Membre"
                  width="50"
                  height="50"
                />
                <span v-else class="mdc-data-table__cell--placeholder">Aucune Photo</span>
              </td>
              <td class="mdc-data-table__cell">{{ membres.lastname }} {{ membres.firstname }}</td>
              <td class="mdc-data-table__cell">{{ membres.contact }}</td>
              <td class="mdc-data-table__cell">{{ membres.email }}</td>
              <td class="mdc-data-table__cell">
                <img
                  v-if="membres.code"
                  :src="`${publicDir}/${membres.code}`"
                  alt="QR Code du Membre"
                  title="QR Code du Membre"
                  width="50"
                  height="50"
                  style="cursor: pointer;"
                  @click="openCardPopup(membres)"
                />
                <span v-else class="mdc-data-table__cell--placeholder">Aucune Photo</span>
              </td>
              
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p style="text-align: center;">Aucun Membre trouvé pour cette entreprise.</p>
      </div>
    </div>


    <!-- POPUP MODAL -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <button class="close-btn" @click="closePopup">×</button>

        <div class="card-container" ref="capture">
          <!-- RECTO -->
          <div class="card recto">
            <img 
              v-if="selectedCompany?.logo"
              class="logo"
              :src="`${publicDir}/logo/${selectedCompany.logo}`"
              :alt="selectedCompany.name"
            />

            <div class="card-content">
              <div class="info">
                <div class="info-block">
                  <p class="label">Nom</p>
                  <p class="value">{{ selectedMember.firstname }} {{ selectedMember.lastname }}</p>
                </div>

                <div class="info-block">
                  <p class="label">Titre</p>
                  <p class="value">{{ selectedMember.title }}</p>
                </div>

                <div class="info-block">
                  <p class="label">Contact</p>
                  <p class="value">{{ selectedMember.contact }}</p>
                </div>
              </div>

              <div class="photo">
                <img
                  :src="`${publicDir}/user_document/${selectedMember.user_image}`"
                  alt="Photo Membre"
                  class="member-photo"
                />
              </div>
            </div>

            <img
              class="qr-code"
              :src="`${publicDir}/qrcode-user/qrcode-${selectedMember.uidn}.png`"
              alt="QR Code"
            />
          </div>

          <!-- VERSO -->
          <div class="card verso">
            <img 
              v-if="selectedCompany?.logo"
              class="logoverso"
              :src="`${publicDir}/logo/${selectedCompany.logo}`"
              :alt="selectedCompany.name"
            />
          </div>

          <!-- Bouton Capture -->
          <div class="user_Qr_code" @click="captureDiv" role="button">
            <a href="#">Capture</a>
          </div>

        </div>
      </div>
    </div>


  </template>
  
  <style scoped>
    /* Popup styles */
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .popup-content {
      background: white;
      padding: 20px;
      max-width: 800px;
      width: 90%;
      border-radius: 8px;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      background: transparent;
      border: none;
      font-size: 25px;
      cursor: pointer;
      color:#000
    }


    .left-back .employee_back {
        background: transparent;
        padding: 0 !important;
    }

    table.mdc-data-table__table {
      background: #fff;
      margin-bottom: 40px;
      width: 100%;
      table-layout: fixed;
    }

    .card-container {
      display: flex;
      gap: 30px;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      padding: 20px;
    }

    .card {
      width: 320px;
      height: 480px;
      background: linear-gradient(145deg, #004841, #0f5e57);
      border-radius: 16px;
      color: white;
      padding: 30px 20px;
      box-shadow: 0 6px 15px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .logo2 {
      width: 60px;
      height: auto;
      margin-bottom: 10px;
      margin: 0 auto 10px auto; /* centré + marge bas */
      display: block; /* requis pour centrer une image */
    }
    .logo {
      max-width: 100px;
      max-height: 60px;
      height: auto;
      width: auto;
      display: block;
      margin: 0 auto 10px auto;
      object-fit: contain;
    }

    .logoverso2 {
      width: 60px;
      height: auto;
      margin: 40px auto 0 auto;
      display: block;
    }
    .logoverso {
      max-width: 80px;
      max-height: 80px;
      height: auto;
      width: auto;
      display: block;
      margin: 40px auto 0 auto;
      object-fit: contain;
    }

    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-top: 30px;
    }

    .info {
      flex: 1;
    }

    .info-block {
      margin-bottom: 12px;
    }

    .label {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .value {
      font-size: 15px;
    }

    .photo {
      width_: 80px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 5px rgba(255,255,255,0.4);
    }

    .member-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .qr-code {
      width: 100px;
      height: 100px;
      align-self: center;
      margin-top: 20px;
    }

    .verso {
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }
    .recto {
      background-image: url('@/assets/verso.png'); /* ou '/images/recto.png' si dans public */
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .verso {
      background-image: url('@/assets/recto.png'); /* ou '/images/verso.png' si dans public */
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .user_Qr_code {
      text-align: center;
      display: inline-block;
      width: 100%;
    }
    .user_Qr_code a {
      background: rgb(0, 0, 0);
      color: rgb(255, 255, 255);
      border-radius: 10px;
      padding: 20px 100px;
      font-weight: 600;
      font-size: 20px;
      display: inline-block;
      cursor: pointer;
      text-decoration: none;
    }
    @media (max-width: 680px) {
      .create-qr_section img {
        max-width: 100% !important;
      }
      .qr_form_main {
        padding: 0 !important;
      }

    }

    .scanner-logo-image {
      display: flex;
      align-items: center;
      justify-content: space-between; /* keeps left and right areas separated */
    }

    .scanner-left {
      flex: 0 0 auto; /* ensure it stays on the left */
    }

    .scanner-right {
      flex: 1; /* this will take the remaining space */
    }

    .card_logologo12333 {
      width: 100px;
      height: 100%;
      border-radius: none !important; 
    }

    .file-name {
      display: block;
      margin-top: 5px;
      font-size: 0.875rem;
      color: #666;
    }

    input[type="file"].input_style {
      padding: 8px;
    }
  </style>
  