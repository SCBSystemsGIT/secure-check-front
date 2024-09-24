import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    baseUrl: "http://52.45.12.88/api/public/index.php/api",
    publicDir: "http://52.45.12.88/api/public",
  }),
});