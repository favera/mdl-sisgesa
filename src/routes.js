import Advance from "./components/advance/Advance.vue";
import AdvanceList from "./components/advance/AdvanceList.vue";
import PrintAdvances from "./components/advance/PrintAdvances.vue";
import Attendance from "./components/attendance/Attendance.vue";
import AttendanceList from "./components/attendance/AttendanceList.vue";
import AttendanceReport from "./components/attendance/AttendanceReport.vue";
import Employee from "./components/employee/Employee.vue";
import EmployeeList from "./components/employee/EmployeeList.vue";
import Event from "./components/calendar/Event.vue";
import EventList from "./components/calendar/EventList.vue";
import Lending from "./components/lending/Lending.vue";
import LendingList from "./components/lending/LendingList.vue";
import Payroll from "./components/payroll/Payroll.vue";
import DetailPayment from "./components/payroll/DetailPayment.vue";
import SalarySummary from "./components/payroll/SalarySummary.vue";
import BankHoursSummary from "./components/payroll/BankHoursSummary.vue";
import Subsidiary from "./components/subsidiary/Subsidiary.vue";
import SubsidiaryList from "./components/subsidiary/SubsidiaryList.vue";
import UserList from "./components/user/UserList.vue";
import User from "./components/user/User.vue";
//Future feature
// import Feriado from "./components/feriados/Feriado.vue";
// import FeriadoList from "./components/feriados/FeriadoList.vue";

import Login from "./Login.vue";
import Home from "./Home.vue";

export const routes = [
  { path: "/", name: "Login", component: Login },
  {
    path: "/reporte-asistencias",
    name: "AttendanceReport",
    component: AttendanceReport
  },
  {
    path: "/dashboard",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/asistencias",
        component: AttendanceList,
        name: "attendanceList"
      },
      {
        path: "/incluir-Asistencia",
        component: Attendance,
        name: "includeAttendance"
      },
      {
        path: "/editar-Asistencia/:id",
        component: Attendance,
        name: "editAttendance"
      },
      {
        path: "/funcionarios",
        component: EmployeeList,
        name: "employeeList",
        props: true
      },
      {
        path: "/incluir-funcionario",
        component: Employee,
        name: "includeEmployee"
      },
      {
        path: "/editar-funcionario/:id",
        component: Employee,
        name: "editEmployee",
        props: true
      },
      {
        path: "/sucursales",
        component: SubsidiaryList,
        name: "subsidiaryList"
      },
      {
        path: "/incluir-sucursal",
        component: Subsidiary,
        name: "includeSubsidiary"
      },
      {
        path: "/editar-sucursal/:id",
        component: Subsidiary,
        name: "editSubsidiary"
      },
      {
        path: "/salarios",
        component: Payroll,
        name: "payrollList"
      },
      {
        path: "/calendario",
        component: EventList,
        name: "eventList"
      },
      {
        path: "/incluir-evento",
        component: Event,
        name: "includeEvent"
      },
      {
        path: "/editar-evento",
        component: Event,
        name: "editEvent"
      },
      {
        path: "/adelantos",
        component: AdvanceList,
        name: "advanceList"
      },
      {
        path: "/incluir-adelanto",
        component: Advance,
        name: "includeAdvance"
      },
      {
        path: "/editar-adelanto",
        component: Advance,
        name: "editAdvance"
      },
      {
        path: "/imprimir-adelantos",
        component: PrintAdvances,
        name: "printAdvances",
        props: true
      },
      {
        path: "/prestamos",
        component: LendingList,
        name: "lendingList"
      },
      {
        path: "/incluir-prestamo",
        component: Lending,
        name: "includeLending"
      },
      {
        path: "/editar-prestamo",
        component: Lending,
        name: "editLending"
      },
      {
        path: "/detalle-planilla-salario",
        component: DetailPayment,
        name: "paymentDetail",
        props: true
      },
      {
        path: "/resumen-salarial",
        component: SalarySummary,
        name: "salarySummary",
        props: true
      },
      {
        path: "/resumen-banco-hora",
        component: BankHoursSummary,
        name: "bankHoursSummary",
        props: true
      },
      {
        path: "/usuarios",
        component: UserList,
        name: "userList"
      },
      {
        path: "/incluir-usuario",
        component: User,
        name: "includeUser"
      }

      // {
      //   path: "/feriados",
      //   component: FeriadoList,
      //   name: "listadoFeriado"
      // },
      // {
      //   path: "/incluir-feriado",
      //   component: Feriado,
      //   name: "incluirFeriado"
      // },
      // {
      //   path: "/editar-feriado/:id",
      //   component: Feriado,
      //   name: "editarFeriado"
      // }
    ]
  }
];
