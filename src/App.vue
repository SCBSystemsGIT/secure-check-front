<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { defineOptions } from "vue";
import Home from "./HomeView";
const route = useRoute();

const updateBodyClass = () => {
  const whiteBackgroundPages = ["Home", "Login", "Menu"]; // Ajoute toutes les routes qui doivent être blanches
  document.body.className = whiteBackgroundPages.includes(route.name) ? "bg-white" : "bg-gradient";
};

// Mettre à jour la classe au chargement de la page
onMounted(updateBodyClass);

// Observer les changements de route
watch(route, updateBodyClass);

defineOptions({
  name: "App",
});
</script>

<template>
  <div>
    <Home />
  </div>
</template>

<style>
.bg-white {
  background: white !important;
}

.bg-gradient {
  background: radial-gradient(circle, white 0%, gray 100%) !important;
}
</style>
