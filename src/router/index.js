import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/LoginView.vue";
// import Meeting from "@/views/MeetingView.vue";
// import RequestMeeting from "@/views/RequestMeetingView.vue";
import CreateUserView from "@/views/User/CreateUserView.vue";
import CreateVisitorView from "@/views/CreateVisitorView.vue";
import MenuView from "@/views/MenuView.vue";
import RequestMeetingView from "@/views/RequestMeetingView.vue";
import WaitingValidationView from "@/views/waitingValidationView.vue";
import ListQrCodeView from "@/views/QRcode/ListQrCodeView.vue";
import ManalCheckView from "@/views/QRcode/ManalCheckView.vue";
import ListUserView from "@/views/User/ListUserView.vue";
import EventView from "@/views/Event/EventView.vue";
import EventListView from "@/views/Event/EventListView.vue";
// import TestView from "@/views/TestView.vue";
import SuccessCheckoutView from "@/views/SuccessCheckoutView.vue";
import SuccessCheckinView from "@/views/SuccessCheckinView.vue";
import CreateCompanyView from "@/views/CreateCompanyView.vue";

const routes = [
  {
    path: "/sign-in",
    name: "Login",
    component: Login,
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
    path: "/list-users",
    name: "listUser",
    component: ListUserView,
  },
  {
    path: "/request-meeting",
    name: "RequestMeeting",
    component: RequestMeetingView,
    alias: "/",
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
  {
    path: "/list-qrcode-events/:slug",
    name: "listQrcodeEvent",
    component: ListQrCodeView,
  },
  {
    path: "/list-manuel",
    name: "ManalCheck",
    component: ManalCheckView,
  },
  {
    path: "/menu",
    name: "menu",
    component: MenuView,
  },
  {
    path: "/create-event",
    name: "CreateEvent",
    component: EventView,
  },
  {
    path: "/company/:company_slug/event/:slug",
    name: "JoinEvent",
    component: CreateVisitorView,
  },
  {
    path: "/list-events",
    name: "EventList",
    component: EventListView,
  },
  {
    path: "/success-checkout/:uidn",
    name: "successCheckout",
    component: SuccessCheckoutView,
  },
  {
    path: "/success-checkin/:uidn",
    name: "successCheckin",
    component: SuccessCheckinView,
  },
  {
    path: "/create-company",
    name: "createCompany",
    component: CreateCompanyView
  },
  // {
  //   path: "/test",
  //   name: "Test",
  //   component: TestView,
  // },
];

const router = createRouter({
  history: createWebHistory(), // Utilise l'historique du navigateur
  routes, // Déclare les routes
});

export default router;
