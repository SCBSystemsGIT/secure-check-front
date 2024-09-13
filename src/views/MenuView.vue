<script setup>
import { useNavigation } from "@/composables/useNavigation";
const { goToRoute } = useNavigation();
</script>

<template>
  <section class="background-gradi request-meeting">
    <!-- <div class="container"> -->
    <!-- <div class="row align-items-center"> -->
    <!-- <div class="col col-12 col-md-12 col-sm-12"> -->
    <!-- <div class="row align-items-end_"> -->

    <!-- <div class="d-flex flex-column mt-3"> -->

    <div class="d-flex justify-content-center align-items-center vh-100 gap-2">
      <div class="col-md-4 col-xl-3" @click="goToRoute('/meeting')">
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h2 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>Visite</span>
            </h2>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-xl-3" @click="goToRoute('/meeting')">
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h2 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>QRCode</span>
            </h2>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-xl-3" @click="goToRoute('/meeting')">
        <div class="card bg-c-green order-card py-5">
          <div class="card-block">
            <h2 class="text-center">
              <i class="fa fa-rocket f-left"></i><span>Manuel</span>
            </h2>
          </div>
        </div>
      </div>
    </div>

    <!-- </div> -->
    <!-- </div> -->

    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
  </section>
</template>
