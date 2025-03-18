import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/LoginView.vue";
import CreateUserView from "@/views/User/CreateUserView.vue";
import CreateVisitorView from "@/views/CreateVisitorView.vue";
import MenuView from "@/views/MenuView.vue";
import RequestMeetingView from "@/views/RequestMeetingView.vue";
import WaitingValidationView from "@/views/waitingValidationView.vue";
import ListQrCodeView from "@/views/QRcode/ListQrCodeView.vue";
import QrCodeView from "@/views/QRcode/QrCodeView.vue";
import CreateQRCodeView from "@/views/QRcode/CreateQRCodeView.vue";
import ManalCheckView from "@/views/QRcode/ManalCheckView.vue";
import ListUserView from "@/views/User/ListUserView.vue";
import EventView from "@/views/Event/EventView.vue";
import EventListView from "@/views/Event/EventListView.vue";
import SuccessCheckoutView from "@/views/SuccessCheckoutView.vue";
import SuccessCheckinView from "@/views/SuccessCheckinView.vue";
import CreateCompanyView from "@/views/CreateCompanyView.vue";
import EditCompanyView from "@/views/EditCompanyView.vue";
import ShowEventQRcodeView from "@/views/Event/ShowEventQRcodeView.vue";
import CameraView from "@/views/CameraView.vue";
import DisplayVisitorCodeView from "@/views/DisplayVisitorCodeView.vue";
import CompanyListView from "@/views/CompanyListView.vue";
import DisplayEventAttendenceView from "@/views/DisplayEventAttendenceView.vue";
import ShowCompanyQRcodeView from "@/views/ShowCompanyQRcodeView.vue";
import EmployeeListView from '@/views/EmployeeListView.vue';
import SuccessUserCheckinView from "@/views/SuccessUserCheckinView.vue";
import SuccessUserCheckoutView from "@/views/SuccessUserCheckoutView.vue";
import UserAttendenceView from "@/views/User/UserAttendenceView.vue";
import RequestQrCodeView from "@/views/RequestQrCodeView.vue";
import UserQrCodeDisableView from "@/views/User/UserQrCodeDisableView.vue";

const routes = [
  {
    // path: "/:domain/sign-in",
    path: "/sign-in",
    name: "Login",
    component: Login,
    alias: ["/"],
  },
  {
    path: "/:domain/meeting",
    name: "CreateVisitor",
    component: CreateVisitorView,
  },
  {
    path: "/:domain/create-user",
    name: "CreateUser",
    component: CreateUserView,
  },
  {
    path: "/:domain/list-users",
    name: "ListUser",
    component: ListUserView,
  },
  {
    path: "/:domain/request-meeting",
    name: "RequestMeeting",
    component: RequestMeetingView,
    alias: ["/", "/:domain"],
  },
  {
    path: "/:domain",
    name: "homePage",
    component: RequestMeetingView,
  },
  {
    path: "/:domain/waiting-validation/:id",
    name: "WaitingValidation",
    component: WaitingValidationView,
  },
  {
    path: "/:domain/show-event-qrcode/:slug",
    name: "ShowEventQRcode",
    component: ShowEventQRcodeView,
  },
  {
    path: "/:domain/qr-code/:id",
    name: "QrCode",
    component: QrCodeView,
  },
  {
    path: "/:domain/list-qrcode",
    name: "ListQrcode",
    component: ListQrCodeView,
  },
  {
    path: "/:domain/list-qrcode-events/:slug",
    name: "ListQrcodeEvents",
    component: ListQrCodeView,
  },
  {
    path: "/:domain/manual-check",
    name: "ManalCheck",
    component: ManalCheckView,
  },
  {
    path: "/:domain/menu",
    name: "Menu",
    component: MenuView,
  },
  {
    path: "/:domain/create-event",
    name: "CreateEvent",
    component: EventView,
  },
  {
    path: "/company/:domain/event/:slug",
    name: "JoinEvent",
    component: CreateVisitorView,
  },
  {
    path: "/:domain/list-events",
    name: "EventList",
    component: EventListView,
  },
  {
    path: "/success-checkout/:uidn",
    name: "SuccessCheckout",
    component: SuccessCheckoutView,
  },
  {
    path: "/success-checkin/:uidn",
    name: "SuccessCheckin",
    component: SuccessCheckinView,
  },
  {
    path: "/success-user-checkin/:uidn",
    name: "SuccessUserCheckin",
    component: SuccessUserCheckinView,
  },
  {
    path: "/success-user-checkout/:uidn",
    name: "SuccessUserCheckout",
    component: SuccessUserCheckoutView,
  },

  {
    path: "/:domain/create-company",
    name: "CreateCompany",
    component: CreateCompanyView,
  },
  {
    path: "/:domain/edit-company/:company_edit",
    name: "EditCreateCompany",
    component: EditCompanyView,
  },
  {
    path: "/:domain/company-list",
    name: "CompanyList",
    component: CompanyListView,
  },
  {
    path: '/company/:slug/',
    name: 'EmployeeListView',
    component: EmployeeListView,
  },
  {
    path: "/:domain/show-company-qrcode/:slug",
    name: "ShowCompanyQRcode",
    component: ShowCompanyQRcodeView,
  },
  {
    path: "/:domain/create-qr",
    name: "CreateQRCode",
    component: CreateQRCodeView,
  },
  {
    path: "/:domain/camera",
    name: "Camera",
    component: CameraView,
  },
  {
    path: "/:domain/display-logs",
    name: "DisplayVisitorCode",
    component: DisplayVisitorCodeView,
  },
  {
    path: "/:domain/event-attendences",
    name: "DisplayEventAttendence",
    component: DisplayEventAttendenceView,
  },
  {
    path: "/:domain/user-check-ins",
    name: "UserAttendence",
    component: UserAttendenceView,
  },
  {
    path: "/company/:domain/meeting-request-qr/:uidn",
    name: "RequestQrCode",
    component: RequestQrCodeView,
  },

  {
    path: "/:domain/disable-user-qrcode/:id",
    name: "UserQrCodeDisable",
    component: UserQrCodeDisableView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
