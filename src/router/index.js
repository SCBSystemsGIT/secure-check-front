import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/LoginView.vue";
// import Meeting from "@/views/MeetingView.vue";
// import RequestMeeting from "@/views/RequestMeetingView.vue";
import CreateUserView from "@/views/CreateUserView.vue";
import CreateVisitorView from "@/views/CreateVisitorView.vue";
import MenuView from "@/views/MenuView.vue";
import RequestMeetingView from "@/views/RequestMeetingView.vue";
import WaitingValidationView from "@/views/waitingValidationView.vue";
import ListQrCodeView from "@/views/QRcode/ListQrCodeView.vue";

const routes = [
  {
    path: "/sign-in",
    name: "Login",
    component: Login
  },
  {
    path: "/meeting",
    name: "CreateVisitor",
    component: CreateVisitorView,
  },
  {
    path: "/create-user",
    name: "CreateUser",
    component: CreateUserView,
  },
  {
    path: "/request-meeting",
    name: "RequestMeeting",
    component: RequestMeetingView,
  },
  {
    path: "/waiting-validation/:id",
    name: "waitingValidationView",
    component: WaitingValidationView,
  }, 
  {
    path: "/list-qrcode",
    name: "listQrcode",
    component: ListQrCodeView,
  },
  // {
  //   path: "/request-meeting",
  //   name: "RequestMeeting",
  //   component: RequestMeeting,
  //   alias: "/",
  // }, 
  {
    path: "/menu",
    name: "menu",
    component: MenuView
  },
];

const router = createRouter({
  history: createWebHistory(), // Utilise l'historique du navigateur
  routes, // Déclare les routes
});

export default router;
