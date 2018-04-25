import Vue from "vue";
import JsonExcel from "vue-json-excel";
import VueRouter from "vue-router";
import VeeValidate from "vee-validate";
import App from "./App.vue";
import {
  DatePicker,
  TimePicker,
  TimeSelect,
  InputNumber,
  MessageBox,
  Message,
  Notification
} from "element-ui";

var VueFire = require("vuefire");
var Firebase = require("firebase");

import "../semantic/dist/semantic.css";
import "../semantic/dist/semantic.js";

//element
import lang from "element-ui/lib/locale/lang/es";
import locale from "element-ui/lib/locale";

// configure language
locale.use(lang);

/*utitlities*/
import { routes } from "./routes";
import vueXlsxTable from "vue-xlsx-table";
import moment from "moment";
import axios from "./config/vue-axios";
//import axios from "axios";

Vue.use(VueRouter);
Vue.use(VueFire);
Vue.use(vueXlsxTable, { rABS: false });
Vue.use(TimePicker);
Vue.use(TimeSelect);
Vue.use(DatePicker);
Vue.use(InputNumber);
Vue.use(VeeValidate);
Vue.component("downloadExcel", JsonExcel);

Vue.prototype.moment = moment;
moment.locale("es");
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

const router = new VueRouter({
  routes
});

new Vue({
  el: "#app",
  router: router,
  axios: axios,
  render: h => h(App)
});
