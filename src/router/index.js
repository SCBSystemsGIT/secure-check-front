import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/LoginView.vue";
import Meeting from "@/views/MeetingView.vue";
import RequestMeeting from "@/views/RequestMeetingView.vue";

const routes = [
  {
    path: "/sign-in",
    name: "Login",
    component: Login,
    alias:"/"
  },
  {
    path: "/meeting",
    name: "Meeting",
    component: Meeting,
  },
  {
    path: "/request-meeting",
    name: "RequestMeeting",
    component: RequestMeeting,
  },
];

const router = createRouter({
  history: createWebHistory(), // Utilise l'historique du navigateur
  routes, // Déclare les routes
});

export default router;
