<script setup>
import { useRequestsList } from "@/services/useRequestsList";
const { requests /*error*/ } = useRequestsList();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <section class="background-gradi request-meeting">
    <!-- <div class="container"> -->

    <!-- <div class="row align-items-center">
      </div> -->
    <!-- </div> -->
    <div class="container">
      <div class="text-center py-4">
        <h3>Liste des Visites</h3>
      </div>

      <!-- <div class="row align-items-center"> -->
      <div class="col col-12 col-md-12 col-sm-12">
        <table id="example" class="display" cellspacing="0" width="100%">
          <thead>
            <tr>
              <th>Visiteur</th>
              <th>Host</th>
              <!-- <th>Titre</th> -->
              <th>Statut</th>
              <th>Date Création</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="request in requests" :key="request.id">
              <td>
                {{ request.visitor.firstname }} {{ request.visitor.lastname }}
              </td>
              <td>{{ request.host }}</td>
              <!-- <td>{{ request.title ?? "---------" }}</td> -->
              <td>{{ request.confirmed ? "Confirmé" : "En attente" }}</td>
              <td>{{ formatDate(request.request_date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- </div> -->
    </div>
  </section>
</template>

<style scoped>
.request-btn-cannel {
  margin: 10px auto 0px auto;
  display: inline-block;
  text-align: center;
  width: 100%;
}

.request-btn-cannel a {
  background: #b92b00;
  color: #ffffff;
  border-radius: 10px;
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}

.request-btn a {
  /*background: #b92b00;*/
  color: #ffffff;
  border-radius: 10px;
  padding: 20px 100px;
  font-weight: 600;
  overflow: hidden;
  margin: 0 auto;
  float: left;
  width: 100%;
  font-size: 20px;
}

.request-btn-cannel a:hover {
  background: #000000;
  color: #ffffff;
}

.col {
  width: 100%;
  max-width: 80% !important;
  background: #ffffff;
  padding: 15px;
}

.request-meeting .col.col-12.col-md-12.col-sm-12 {
  text-align: center;
  margin: 0px auto 0px auto !important;
  max-width: 550px;
  background: #ffffff;
  padding: 80px 40px;
  border-radius: 15px;
  transform: translate(-50%, -50%);
  top: 50%;
  position: absolute;
  left: 50%;
}
</style>
