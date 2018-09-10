import Vue from "vue";
import VueRouter from "vue-router";
import es from "./../node_modules/vee-validate/dist/locale/es";
import VeeValidate, { Validator } from "vee-validate";
import App from "./App.vue";
import {
    DatePicker,
    TimePicker,
    TimeSelect,
    InputNumber,
    MessageBox,
    Message,
    Notification,
    Switch,
    Dropdown,
    DropdownMenu,
    DropdownItem
} from "element-ui";

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
var pdfMake = require("pdfmake/build/pdfmake.js");
var pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

Validator.localize("es", es);

const config = {
    locale: "es"
};

Vue.use(VueRouter);
Vue.use(vueXlsxTable, { rABS: false });
Vue.use(TimePicker);
Vue.use(TimeSelect);
Vue.use(DatePicker);
Vue.use(InputNumber);
Vue.use(Switch);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(VeeValidate, config);

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

router.beforeEach((to, from, next) => {
    if (!localStorage.token && to.fullPath !== '/') {
        next({ name: 'Login' })

    } else {
        next()

    }

})

Validator.extend("validar_monto", {
    getMessage: field => `El ${field} debe ser superior a 0`,
    validate: value => {
        debugger
        return parseInt(value.split(".").join("")) > 0;
    }
});

new Vue({
    el: "#app",
    router: router,
    axios: axios,
    render: h => h(App)
});
