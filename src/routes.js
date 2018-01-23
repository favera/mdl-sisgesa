import Asistencia from './components/asistencia/Asistencia.vue';
import AsistenciaList from './components/asistencia/AsistenciaList.vue'
import Empleado from './components/empleado/Empleado.vue';
import EmpleadoList from './components/empleado/EmpleadoList.vue';
import Feriado from './components/feriados/Feriado.vue';
import FeriadoList from './components/feriados/FeriadoList.vue'
import Sucursal from './components/sucursal/Sucursal.vue';
import SucursalList from './components/sucursal/SucursalList.vue';
import Salario from './components/salario/Salarios.vue';
import Calendario from './components/calendario/Calendario.vue';
import CalendarioList from './components/calendario/CalendarioList.vue';
import Adelanto from './components/adelanto/Adelanto.vue';
import AdelantoList from './components/adelanto/AdelantoList.vue';

import Home from './Home.vue'

export const routes = [
    { path: '', name: 'Home', component: Home },
    { path: '/asistencias', component: AsistenciaList, name: 'listadoAsistencia' },
    { path: '/incluir-Asistencia', component: Asistencia, name: 'incluirAsistencia' },
    { path: '/editar-Asistencia/:id', component: Asistencia, name: 'editarAsistencia' },
    { path: '/funcionarios', component: EmpleadoList, name: 'listadoEmpleado', props: true },
    { path: '/incluir-funcionario', component: Empleado, name: 'incluirEmpleado' },
    { path: '/editar-funcionario/:id', component: Empleado, name: 'editarEmpleado', props: true },
    // {
    //     path: '/empleados', component: Empleado,
    //     children: [
    //         {
    //             path: 'listado',
    //             component: ListadoEmpleado,
    //             name: 'listadoEmpleado'
    //         },
    //         {
    //             path: 'empleado/:id',
    //             component: NuevoEmpleado
    //         },
    //         {
    //             path: 'nuevoempleado',
    //             component: NuevoEmpleado
    //         }
    //     ]
    // },
    { path: '/sucursales', component: SucursalList, name: 'listadoSucursal' },
    { path: '/incluir-sucursal', component: Sucursal, name: 'incluirSucursal' },
    { path: '/editar-sucursal/:id', component: Sucursal, name: 'editarSucursal' },
    { path: '/salarios', component: Salario },
    { path: '/feriados', component: FeriadoList, name: 'listadoFeriado' },
    { path: '/incluir-feriado', component: Feriado, name: 'incluirFeriado' },
    { path: '/editar-feriado/:id', component: Feriado, name: 'editarFeriado' },
    { path: '/calendario', component: CalendarioList, name: 'listadoCalendario' },
    { path: '/incluir-evento', component: Calendario, name: 'incluirEvento' },
    { path: '/editar-evento', component: Calendario, name: 'editarEvento' },
    { path: '/adelantos', component: AdelantoList, name: 'listadoAdelanto' },
    { path: '/incluir-adelanto', component: Adelanto, name: 'incluirAdelanto' },
    { path: '/editar-adelanto', component: Adelanto, name: 'editarAdelanto' }
]