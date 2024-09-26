import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    baseUrl: "http://52.45.12.88/api/public/index.php/api",
    baseUrl_: "http://52.45.12.88/api/public/index.php",
    publicDir: "http://52.45.12.88//api/public",

    // baseUrl: "http://localhost:9999/api",
    // baseUrl_: "http://localhost:9999",
    // publicDir: "http://localhost:8080",
  }),
});
