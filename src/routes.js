import Adelanto from "./components/adelanto/Adelanto.vue";
import AdelantoList from "./components/adelanto/AdelantoList.vue";
import Attendance from "./components/attendance/Attendance.vue";
import AttendanceList from "./components/attendance/AttendanceList.vue";
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
import Subsidiary from "./components/sucursal/Subsidiary.vue";
import SubsidiaryList from "./components/sucursal/SubsidiaryList.vue";

import Feriado from "./components/feriados/Feriado.vue";
import FeriadoList from "./components/feriados/FeriadoList.vue";





import Login from "./Login.vue";
import Dashboard from "./Dashboard.vue";

import Home from "./Home.vue";

export const routes = [
  // { path: "/", name: "Home", component: Home },
  { path: "/", name: "Login", component: Login },
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
        name: "listadoSucursal"
      },
      {
        path: "/incluir-sucursal",
        component: Subsidiary,
        name: "incluirSucursal"
      },
      {
        path: "/editar-sucursal/:id",
        component: Subsidiary,
        name: "editarSucursal"
      },
      {
        path: "/salarios",
        component: Payroll,
        name: "listadoSalarios"
      },
      {
        path: "/feriados",
        component: FeriadoList,
        name: "listadoFeriado"
      },
      {
        path: "/incluir-feriado",
        component: Feriado,
        name: "incluirFeriado"
      },
      {
        path: "/editar-feriado/:id",
        component: Feriado,
        name: "editarFeriado"
      },
      {
        path: "/calendario",
        component: EventList,
        name: "listadoEvent"
      },
      {
        path: "/incluir-evento",
        component: Event,
        name: "incluirEvento"
      },
      {
        path: "/editar-evento",
        component: Event,
        name: "editarEvento"
      },
      {
        path: "/adelantos",
        component: AdelantoList,
        name: "listadoAdelanto"
      },
      {
        path: "/incluir-adelanto",
        component: Adelanto,
        name: "incluirAdelanto"
      },
      {
        path: "/editar-adelanto",
        component: Adelanto,
        name: "editarAdelanto"
      },
      {
        path: "/prestamos",
        component: LendingList,
        name: "listadoPrestamo"
      },
      {
        path: "/incluir-prestamo",
        component: Lending,
        name: "incluirPrestamo"
      },
      {
        path: "/editar-prestamo",
        component: Lending,
        name: "editarPrestamo"
      },
      {
        path: "/detalle-planilla-salario",
        component: DetailPayment,
        name: "detallePlanilla",
        props: true
      },
      {
        path: "/resumen-salarial",
        component: SalarySummary,
        name: "resumenSalarial",
        props: true
      },
      {
        path: "/resumen-banco-hora",
        component: BankHoursSummary,
        name: "resumenBancoHora",
        props: true
      }
    ]
  }
];
