import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index.js";
import "@/assets/style.css"; // Importer le fichier CSS globalement
import "@/assets/dataTables.css"; // Importer le fichier CSS globalement
import "vue3-toastify/dist/index.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persist';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import DataTable from 'datatables.net-vue3'
import DataTablesLib from 'datatables.net';

DataTable.use(DataTablesLib);

const app = createApp(App);
app.use(router);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.mount("#app");
