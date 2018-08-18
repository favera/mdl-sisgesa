<template>
  <div class="ui twelve wide column">

    <div class="ui longer modal">
      <div class="header"> Archivo Seleccionado </div>
      <div class="scrolling content">
        <table class="ui celled  padded table">
          <thead>
            <tr>
              <th>Funcionario</th>
              <th>Fecha</th>
              <th>Marcacion Entrada</th>
              <th>Marcacion Salida</th>
            </tr>

          </thead>
          <tbody>
            <tr v-for="att in attendanceModal" :key="att.id">
              <td>{{att.employeeName}}</td>
              <td>{{moment(att.date).format("L")}}</td>
              <td>{{(att.entryTime || "--") + " hs"}}</td>
              <td>{{(att.exitTime || "--") + " hs"}}</td>
            </tr>
            <tr v-show="warningMessage">
              <td colspan="4">
                <div class="ui yellow message">
                  <h4>Los datos de la planilla actualmente ya existen en el sistema. Por favor, verifique los datos</h4>
                </div>
              </td>

            </tr>
          </tbody>
        </table>

      </div>
      <div class="actions">

        <button class="ui positive teal button" v-show="!warningMessage" @click="saveAttendance">Aceptar</button>
        <div class="ui deny button" @click="cancelFile">Cancelar</div>

      </div>
    </div>

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Asistencia</h4>

      <div class="two fields">

        <div class="fifteen wide field">

          <div class="inline fields">

            <div class="ten wide field">

              <div class="ui icon input">
                <input type="text" placeholder="Buscar por nombre" @keydown="searchAttendance" v-model="query.parameter">
                <!-- <i class="search icon" v-if="parameterAvanzada"></i> -->
                <!-- <i @click="searchAttendance" class="inverted teal circular search link icon" v-else></i> -->

              </div>
              <button class="ui circular teal icon button" @click="searchAttendance">
                <i class="search icon"></i>
              </button>

            </div>

          </div>

        </div>

        <div class="field">

          <div class="ui right floated main menu">

            <a class="icon item">
              <vue-xlsx-table @on-select-file="handleSelectedFile">

                <span data-tooltip="Subir archivo de asistencia">
                  <i class="upload icon"></i>
                </span>

              </vue-xlsx-table>
            </a>

            <a class="icon item" @click="addAttendance">
              <span data-tooltip="Crear Asistencia Manualmente">
                <i class="plus icon"></i>
              </span>
            </a>

            <a class="icon item" @click="advancedSearch = !advancedSearch">
              <span data-tooltip="Habilitar busqueda avanzada">
                <i class="find icon"></i>
              </span>
            </a>

            <router-link :to="{name: 'AttendanceReport'}" target="_blank">
              <a class="icon item">
                <span data-tooltip="imprimir informe">
                  <i class="print icon"></i>
                </span>
              </a>
            </router-link>

          </div>

        </div>

      </div>

      <div class="fields" v-show="advancedSearch">
        <div class="field">
          <label for="">Rango de Fechas:</label>
          <div class="inline fields">
            <div class="field">
              <el-date-picker type="date" placeholder="Fecha inicio" format="dd/MM/yyyy" v-model="query.startDate">
              </el-date-picker>
            </div>

            <div class="field">
              <el-date-picker type="date" placeholder="Fecha fin" format="dd/MM/yyyy" v-model="query.endDate">
              </el-date-picker>
            </div>

            <div class="field" style="margin-left: 30px">
              <label for="">Estado:</label>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="todos" v-model="query.status">
                <label>Todos</label>
              </div>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="ausentes" v-model="query.status">
                <label>Ausentes</label>
              </div>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="incompletos" v-model="query.status">
                <label>Incompletos</label>
              </div>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="vacaciones" v-model="query.status">
                <label>Vacaciones</label>
              </div>
            </div>

            <div class="field" style="margin-left: 20px">
              <button @click="searchAttendance" class="ui circular teal icon button">
                <i class="search icon"></i>
              </button>

            </div>

          </div>

        </div>

      </div>

      <div class="field">

        <table class="ui teal celled table">
          <thead>
            <tr>
              <th>Funcionario</th>
              <th>Fecha</th>
              <th>M. Entrada</th>
              <th>M. Salida</th>
              <th>Horas Trabajadas</th>
              <th>Horas Faltantes</th>
              <th>Banco de Horas</th>
              <th>Observacion</th>
              <th class="center aligned">Opciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(attendance, index) in attendances" :key="attendance._id" v-bind:class="{negative: attendance.status.absence, positive: attendance.status.vacations, warning: attendance.status.incomplete}">
              <td>{{attendance.employeeName}}</td>
              <td>{{moment(attendance.date).format("L")}}</td>
              <td>{{(attendance.entryTime || "--") + " hs"}}</td>
              <td>{{(attendance.exitTime || "--") + " hs"}}</td>
              <td>{{(attendance.workedHours || "--") + " hs"}}</td>
              <td>{{(attendance.delay || "--") + " hs"}}</td>
              <td>{{(attendance.extraHours || "--") + " hs"}}</td>
              <td>{{attendance.remark || "--"}}</td>

              <td class="center aligned">
                <i @click="savePaginationNumber(attendance._id)" class="edit row link icon"></i>
                <i @click="deleteAttendance(attendance._id, index)" class="trash link icon"></i>

              </td>
            </tr>

          </tbody>

          <tfoot>
            <tr v-show="showMessage">
              <th colspan="9">
                <div class="ui icon info message">
                  <i class="close icon"></i>
                  <i class="meh outline icon"></i>
                  <div class="header">
                    No existen registros con la busqueda esperada o aun no existe movimiento para el mes
                  </div>

                </div>
              </th>
            </tr>

            <tr v-if="pageOne.totalItems > 10">
              <th colspan="9">
                <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
                </app-pagination>
              </th>
            </tr>
          </tfoot>
        </table>

      </div>

    </div>

  </div>
</template>

<script>
import moment from "moment";
import Pagination from ".././shared/Pagination.vue";

export default {
  name: "asistenciaList",
  data() {
    return {
      advancedSearch: false,
      holidaysPerYear: [],
      showMessage: false,
      query: {
        status: "todos",
        startDate: null,
        endDate: null,
        parameter: null
      },
      attendanceModal: [],
      validateAttendance: [],
      attendancesToSend: [],
      attendances: [],
      attendanceSheet: [],
      absence: false,
      modal: null,
      isSaturday: null,
      // marcacion: {
      //   fecha: null,
      //   entryTime: null,
      //   exitTime: null,
      //   workedHours: null,
      //   delay: null,
      //   extraHours: null,
      //   remark: null,
      //   status: {}
      // },
      employees: [],
      // sabados: [],
      absences: [],
      warningMessage: false,
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };
  },
  components: {
    appPagination: Pagination
  },
  methods: {
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.queryData();
    },
    savePaginationNumber(attId) {
      var page = {};
      page.itemsPerPage = this.pageOne.itemsPerPage;
      page.currentPage = this.pageOne.currentPage;
      page.totalItems = this.pageOne.totalItems;
      localStorage.setItem("page", JSON.stringify(page));

      this.$router.push({
        name: "editAttendance",
        params: { id: attId }
      });
    },
    searchAttendance(e) {
      if (e && e.keyEvent === 13) {
        this.queryData(true);
        return;
      } else {
        this.queryData(true);
      }
    },
    queryData(pageReset) {
      if (pageReset) {
        this.pageOne.currentPage = 1;
      }

      if (!this.query.startDate && !this.query.endDate) {
        this.query.startDate = moment()
          .startOf("month")
          .format();
        this.query.endDate = moment()
          .endOf("month")
          .format();
      }

      if (!this.query.startDate && this.query.endDate) {
        this.query.startDate = moment()
          .startOf("month")
          .format();
      }

      if (this.query.startDate && !this.query.endDate) {
        this.query.endDate = moment()
          .endOf("month")
          .format();
      }

      if (this.query.status === "todos") {
        this.$http
          .get(
            `/attendances/query-data?page=${this.pageOne.currentPage}&limit=${
              this.pageOne.itemsPerPage
            }&startDate=${this.query.startDate}&endDate=${
              this.query.endDate
            }&parameter=${this.query.parameter}&status=${this.query.status}`
          )
          .then(response => {
            if (response.data.docs.length === 0) {
              this.attendances.length = 0;
              this.showMessage = true;
            } else {
              this.showMessage = false;
              this.attendances = response.data.docs;
              this.pageOne.totalItems = response.data.total;
            }
          });
      } else {
        this.$http
          .get(
            `/attendances/query-data?page=${this.pageOne.currentPage}&limit=${
              this.pageOne.itemsPerPage
            }&startDate=${this.query.startDate}&endDate=${
              this.query.endDate
            }&status=${this.query.status}&parameter=${this.query.parameter}`
          )
          .then(response => {
            if (response.data.docs.length === 0) {
              this.attendances.length = 0;
              this.showMessage = true;
            } else {
              this.showMessage = false;
              this.attendances = response.data.docs;
              this.pageOne.totalItems = response.data.total;
            }
          });
      }
    },
    getEmployees() {
      this.$http.get(`/employees/full-list`).then(response => {
        this.employees = response.data;
      });
    },
    cancelFile() {
      this.attendanceModal.length = 0;
    },
    openModal() {
      this.modal
        .modal("setting", { observeChanges: true })
        .modal("show")
        .modal("refresh");
    },
    //retorna las horas que trabajo en el dia (horaSalida - horaEntrada)
    handleWorkedHours(entryTime, exitTime) {
      var result = moment("00:00", "hh:mm").format("00:00");
      if (entryTime !== null && exitTime !== null) {
        result =
          moment.duration(exitTime, "HH:mm").asMinutes() -
          moment.duration(entryTime, "HH:mm").asMinutes();
        console.log("Horas trabajadas " + result);
        return moment.utc(result * 1000 * 60).format("HH:mm");
      }
      console.log("Horas trabajadas " + result);
      return result;
    },
    //verifica que la fecha pasada se encuentra en el array de holidays anuales y retorna el indice
    returnHoliday(date) {
      return this.holidaysPerYear.findIndex(holiday => {
        console.log(
          "Fecha Recibida en returnHoliday",
          date,
          holiday.holidayDate
        );
        return moment(holiday.holidayDate).isSame(date);
      });
    },
    //retorna el valor en horas de horas extras para el banco de horas
    calculateExtraHour(entryTime, exitTime, employeeId, date) {
      var saturdayHalfTime,
        workingHours,
        employee,
        workedHours,
        extraHours,
        formatDate,
        holiday;
      //verifica que la fecha pasada es o no un feriado
      holiday = this.returnHoliday(date);
      //formato a Objeto fecha para poder usar el metodo getDay
      formatDate = new Date(date);
      //retorna los datos del empleado
      employee = this.employees.find(employee => {
        if (employee._id === employeeId) {
          return employee;
        }
        return null;
      });
      //si el empleado existe, obtener las horas que debe trabajar y si tiene permiso de sabado medio tiempo
      if (employee) {
        saturdayHalfTime = employee.halfTime;
        workingHours = employee.workingHours;
      }

      //si la fecha es dia sabado, (verificar que funcione) es true, si el dia es sabado
      if (formatDate.getDay() === 6) {
        //si el funcionario tiene habilitado sabado medio tiempo
        if (saturdayHalfTime) {
          workedHours = this.handleWorkedHours(entryTime, exitTime);

          console.log("Resultado Horas Trabajadas", workedHours);

          if (!workedHours.localeCompare("00:00")) {
            console.log("ENTRO al COMPARE");
            return null;
          }
          extraHours = moment.duration(workedHours, "HH:mm").asMinutes() - 300;
          console.log("Resultado Horas Extras", extraHours);
          if (extraHours > 0) {
            return this.handleNegative(extraHours);
          }
          return null;

          //else del no tiene sabado habilitado
        } else {
          workedHours = this.handleWorkedHours(entryTime, exitTime);

          console.log("Resultado Horas Trabajadas", workedHours);

          if (!workedHours.localeCompare("00:00")) {
            return null;
          }

          console.log("Carga Laboral", workingHours);

          extraHours =
            moment.duration(workedHours, "HH:mm").asMinutes() -
            moment.duration(workingHours, "HH:mm").asMinutes();
          console.log(moment.duration(workingHours, "HH:mm").asMinutes());
          console.log("Resultado Horas Extras", extraHours);

          if (extraHours > 0) {
            return this.handleNegative(extraHours);
          }

          return null;
        }
        //else del verificar si es dia sabado
      } else {
        if (formatDate.getDay() === 0 || holiday !== -1) {
          extraHours = this.handleWorkedHours(entryTime, exitTime);
          console.log(extraHours);
          return extraHours;
        } else {
          workedHours = this.handleWorkedHours(entryTime, exitTime);

          console.log("Resultado Horas Trabajadas", workedHours);

          if (!workedHours.localeCompare("00:00")) {
            return null;
          }
          extraHours =
            moment.duration(workedHours, "HH:mm").asMinutes() -
            moment.duration(workingHours, "HH:mm").asMinutes();

          console.log("Resultado Horas Extras", extraHours);

          if (extraHours > 0) {
            return this.handleNegative(extraHours);
          }

          return null;
        }
      }
    },
    //Retorna el valor en horas de las horas faltantes del funcionario
    calculateDelay(entryTime, exitTime, employeeId, date) {
      var saturdayHalfTime,
        workingHours,
        employee,
        workedHours,
        result,
        extraHours,
        formatDate,
        holiday;

      holiday = this.returnHoliday(date);
      formatDate = new Date(date);

      employee = this.employees.find(employee => {
        if (employee._id === employeeId) {
          return employee;
        }
        return null;
      });

      if (employee) {
        saturdayHalfTime = employee.halfTime;
        workingHours = employee.workingHours;
      }
      //si es dia sabado verificar si funcionario posee medio tiempo
      if (formatDate.getDay() === 6) {
        if (saturdayHalfTime) {
          //calcula las horas trabajadas en formato HH:mm trabajados ese dia
          workedHours = this.handleWorkedHours(entryTime, exitTime);
          //cuando el valor es
          if (!workedHours.localeCompare("00:00")) {
            return "-" + moment.utc(300 * 1000 * 60).format("HH:mm");
          }
          //convierte las hora trabajadas HH:MM en minutos y descuenta 300 lo que vendria a ser la mitad de la jornada
          result = moment.duration(workedHours, "HH:mm").asMinutes() - 300;
          //si resultado es menor a cero es un retraso.
          if (result < 0) {
            return this.handleNegative(result);
          }
          //si no es un retraso retorna null
          return null;
        } else {
          workedHours = this.handleWorkedHours(entryTime, exitTime);

          if (!workedHours.localeCompare("00:00")) {
            return "-" + workingHours;
          }
          extraHours =
            moment.duration(workedHours, "HH:mm").asMinutes() -
            moment.duration(workingHours, "HH:mm").asMinutes();

          if (extraHours < 0) {
            return this.handleNegative(extraHours);
          }

          return null;
        }
      } else {
        if (formatDate.getDay() === 0 || holiday !== -1) {
          extraHours = null;

          return extraHours;
        } else {
          var workedHours = this.handleWorkedHours(entryTime, exitTime);

          if (!workedHours.localeCompare("00:00")) {
            return "-" + workingHours;
          }
          var extraHours =
            moment.duration(workedHours, "HH:mm").asMinutes() -
            moment.duration(workingHours, "HH:mm").asMinutes();

          if (extraHours < 0) {
            return this.handleNegative(extraHours);
          }

          return null;
        }
      }
    },
    //verifica si es domingo o no para insertar texto en observacion
    handleRemark(date) {
      var isSunday = new Date(date);
      var holiday = this.returnHoliday(new Date(date));
      if (isSunday.getDay() === 0) {
        return "Hora Extra Domingo";
      }

      if (holiday !== -1) {
        return "Hora Extra por Dia Feriado";
      }

      return "";
    },

    addAttendance() {
      this.$router.push({ name: "includeAttendance" });
    },
    deleteAttendance(attendanceId, index) {
      this.$confirm(
        "Este registro sera eliminado permanentemente. Continuar?",
        "Alerta",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.$http
            .delete(`/attendances/delete/${attendanceId}`)
            .then(response => {
              if (response.status === 200) {
                this.attendances.splice(index, 1);
                this.$message({
                  type: "success",
                  message: "Registro Eliminado exitosamente"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso cancelado"
          });
        });
    },
    //obtiene los feriados del año actual
    getHolidays() {
      var firstDayYear = moment()
        .startOf("year")
        .format();
      var lastDayYear = moment()
        .endOf("year")
        .format();
      this.$http
        .get(
          `/events/holidays?startDate=${firstDayYear}&endDate=${lastDayYear}`
        )
        .then(response => {
          this.holidaysPerYear = response.data;
        });
    },
    //metodo que recibe el archivo excel
    handleSelectedFile(convertedData) {
      this.attendanceModal.length = 0;
      this.validateAttendance.length = 0;
      //Pasamos los datos del archivo excel a attendanceSheet, para verificar luego si dentro de este archivo hay datos que ya fueron cargados
      this.attendanceSheet = convertedData.body;
      //se asigna la primera fecha del archivo a la variable fecha
      var firstDate = moment(
        this.attendanceSheet[0].Horario,
        "DD/MM/YYYY"
      ).format();
      console.log("Fecha Format", firstDate);
      //Trae las asistencias del parametro fecha
      this.$http
        .get(`/attendances/full-list?fechaPlanilla=${firstDate}`)
        .then(response => {
          response.data.length = 0;
          console.log("Response Length", response.data.length);
          if (response.data.length > 0) {
            var attendanceOfDate = response.data;
            // console.log(JSON.stringify(attendanceOfDate));

            this.attendanceSheet.forEach(attSheet => {
              var attExist = attendanceOfDate.findIndex(attOfDate => {
                return attOfDate.employee.acnro === attSheet["AC-No."];
              });

              //inserta en validar planilla si no existe aun un registro con esa fecha y ese funcionario
              if (attExist === -1) {
                this.validateAttendance.push(attSheet);
              }
            });
            //si todos los datos de la planilla subida son repetidos muestra mensaje de alerta
            if (!this.validateAttendance.length) {
              this.warningMessage = true;
            }
          } else {
            this.validateAttendance = convertedData.body;
          }

          this.employees.forEach(employee => {
            console.log("Funcionario", employee.acnro);
            this.validateData(
              employee.acnro,
              employee._id,
              employee.name,
              employee.workingHours
            );
          });
          this.openModal();

          // this.isSaturday = this.getSaturday(this.attendanceModal[0].date);
        });
    },
    //recibe datos de funcionarios desde el foreach de funcionarios
    validateData(acnro, employeeId, employeeName, workingHours) {
      var attModal = {
        date: "",
        employeeId: null,
        employeeName: "",
        extraHours: "",
        entryTime: null,
        exitTime: null,
        timeRecords: []
      };

      console.log("attendanceSheet", JSON.stringify(this.attendanceSheet));
      //iteracion sobre el array de objetos de validateAttendance, attendanceSheet contiene datos del archivo excel, en bruto
      for (let item of this.validateAttendance) {
        //Compara si el acnro dado por el foreach de funcionario es igual al item del for de los datos del excel
        if (acnro === item["AC-No."]) {
          attModal.employeeId = employeeId;
          attModal.employeeName = employeeName;
          attModal.date = moment(item.Horario, "DD/MM/YYYY").format();
          attModal.extraHours = moment
            .duration(workingHours, "HH:mm")
            .asMinutes();
          //Se guardan todos los horarios del funcionario encontrados en la planilla en un array
          attModal.timeRecords.push(
            moment(item.Horario, "DD/MM/YYYY HH:mm a").format("LT")
          );
        }
      }
      //despues de recorrer todos los datos de la planilla, se verifica attModal, se tiene que validar los timeRecords
      if (attModal.employeeId !== null) {
        console.log("####Marcaciones####" + attModal.timeRecords);
        //si tiene solo una marcacion
        if (attModal.timeRecords.length == 1) {
          //se carga el unico registro de horario en la variable time
          var time = attModal.timeRecords[0];

          //verifica si la unica marcacion que posee es una entrada o salida
          if (
            moment.duration(time, "HH:mm").asMinutes() <
            moment.duration("10:30", "HH:mm").asMinutes()
          ) {
            attModal.entryTime = attModal.timeRecords[0];
            //hace push al array del Modal del registro como marcacion entrada
            this.attendanceModal.push(attModal);
          } else {
            attModal.exitTime = attModal.timeRecords[0];
            //hace push al array del modal del registro como marcacion salida
            this.attendanceModal.push(attModal);
          }
        } else {
          //Cuando el array attModal.timeRecords tiene mas de un elemento se coloca la primera marcacion como entrada
          //y la ultima marcacion como salida sin verificar horario.
          //lastIndex es el ultimo indice del array
          var lastIndex = attModal.timeRecords.length - 1;
          attModal.entryTime = attModal.timeRecords[0];
          attModal.exitTime = attModal.timeRecords[lastIndex];
          this.attendanceModal.push(attModal);
        }
      }
    },
    //maneja los valores negativos resultante de las horas extras
    handleNegative(mins) {
      var h, m;
      if (mins >= 24 * 60) {
        throw new RangeError(
          "Valid input should be greater than or equal to 0 and less than 1440."
        );
      }
      if (mins < 0) {
        mins = mins * -1;
        h = Math.floor(mins / 60);
        m = mins % 60;
        return (
          "-" +
          moment
            .utc()
            .hours(h)
            .minutes(m)
            .format("HH:mm")
        );
      } else {
        h = Math.floor(mins / 60);
        m = mins % 60;
        return moment
          .utc()
          .hours(h)
          .minutes(m)
          .format("HH:mm");
      }
    },
    //Obtenien los sabados del mes
    // getSabados(attDate) {
    //   //var fecha = moment(fec, "DD/MM/YYYY").toDate();
    //   var fecha = new Date(attDate);
    //   console.log(fecha);
    //   var month = fecha.getMonth();

    //   fecha.setDate(1);

    //   // Get the first Saturday in the month
    //   while (fecha.getDay() !== 6) {
    //     fecha.setDate(fecha.getDate() + 1);
    //   }

    //   // Get all the other Saturday in the month
    //   while (fecha.getMonth() === month) {
    //     this.sabados.push(new Date(fecha.getTime()));
    //     fecha.setDate(fecha.getDate() + 7);
    //   }

    //   //return sabados;
    // },
    //cambie de metodo por el getDay()
    // getSaturday(attDate) {
    //   var formatAttDate = new Date(attDate);

    //   var formatAttDate = this.sabados.findIndex(element => {
    //     console.log(findFecha);
    //     console.log(fechaSabado);
    //     return findFecha.getTime() === element.getTime();
    //   });
    //   console.log("INDICE SABADO", fechaSabado);
    //   return fechaSabado;
    // },
    handleStatus(entryTime, exitTime) {
      if (entryTime == null || exitTime == null) {
        return {
          absence: false,
          incomplete: true,
          vacations: false
        };
      } else {
        return {
          absence: false,
          incomplete: false,
          vacations: false
        };
      }
    },
    saveAttendance() {
      this.absences.length = 0;
      this.attendanceModal.forEach(attModal => {
        var attSend = {};

        attSend.date = attModal.date;
        attSend.employee = attModal.employeeId;
        attSend.employeeName = attModal.employeeName;
        attSend.entryTime = attModal.entryTime;
        attSend.exitTime = attModal.exitTime;
        //calculo de Horas trabajadas
        attSend.workedHours = this.handleWorkedHours(
          attModal.entryTime,
          attModal.exitTime
        );

        attSend.extraHours = this.calculateExtraHour(
          attModal.entryTime,
          attModal.exitTime,
          attModal.employeeId,
          attModal.date
        );

        attSend.delay = this.calculateDelay(
          attModal.entryTime,
          attModal.exitTime,
          attModal.employeeId,
          attModal.date
        );

        attSend.remark = this.handleRemark(attModal.date);
        attSend.status = this.handleStatus(
          attModal.entryTime,
          attModal.exitTime
        );

        this.attendancesToSend.push(attSend);
      });

      this.validateVacationsAndAbsences();
    },
    async validateVacationsAndAbsences() {
      var attDate = new Date(this.attendanceModal[0].date);
      var holiday = this.returnHoliday(attDate);
      //si no es domingo verificar si esta de vacaciones o ausente
      if (attDate.getDay() !== 0 && holiday === -1) {
        //nuevo loop por funcionario para poder verificar si tiene marcaciones en datos marcaciones
        for (let employee of this.employees) {
          var absenceIndex = this.attendanceModal.findIndex(item => {
            return employee._id === item.employeeId;
          });
          if (absenceIndex === -1) {
            var attendance = {};
            attendance.status = {};
            var getVacations, attDateFormat, isVacationDate;
            // debugger;
            getVacations = await this.$http.get(
              `/events/employee-vacation/${employee._id}`
            );
            console.log("Resultado await", getVacations);
            // debugger;
            if (getVacations.data.length > 0) {
              attDateFormat = moment(this.attendanceModal[0].date).format();
              isVacationDate = getVacations.data.find(event => {
                return moment(attDateFormat).isBetween(
                  event.startDate,
                  event.endDate,
                  null,
                  "[]"
                );
              });
            }

            if (isVacationDate) {
              attendance.date = this.attendanceModal[0].date;
              attendance.employee = employee._id;
              attendance.employeeName = employee.name;
              attendance.entryTime = null;
              attendance.exitTime = null;
              attendance.workedHours = null;
              attendance.extraHours = null;
              attendance.delay = null;
              attendance.remark = "Vacaciones";
              attendance.status.absence = false;
              attendance.status.incomplete = false;
              attendance.status.vacations = true;
              console.log("Persona de vacaciones", JSON.stringify(attendance));
              this.absences.push(attendance);
              console.log(JSON.stringify(this.absences));
            } else {
              //si no cumplio condiciones anteriores, es una ausencia.
              attendance.date = this.attendanceModal[0].date;
              attendance.employee = employee._id;
              attendance.employeeName = employee.name;
              attendance.entryTime = null;
              attendance.exitTime = null;
              attendance.workedHours = null;
              attendance.extraHours = null;
              attendance.delay = null;
              attendance.remark = "Ausencia";
              attendance.status.absence = true;
              attendance.status.incomplete = false;
              attendance.status.vacations = false;

              this.absences.push(attendance);
            }

            isVacationDate = null;
          }
        }
      }
      console.log("Array Ausencias", JSON.stringify(this.absences));
      console.log("Array Marcaciones", JSON.stringify(this.attendancesToSend));
      if (this.absences.length > 0) {
        this.attendancesToSend = this.absences.concat(this.attendancesToSend);
      }

      console.log(
        "Despues de concatenar",
        JSON.stringify(this.attendancesToSend)
      );

      this.$http
        .post(`/attendances/add-data`, this.attendancesToSend)
        .then(response => {
          this.$message({
            type: "success",
            message: "Registro insertado exitosamente"
          });
          this.attendancesToSend.length = 0;
          this.queryData();
          console.log(response);
        });
    }
  },
  created() {
    this.queryData();
    this.getEmployees();
    this.getHolidays();
  },
  mounted() {
    this.modal = $(this.$el).find(".ui.longer.modal");
    $(this.$el)
      .find(".ui.dropdown")
      .dropdown();
  }
};
</script>

<style>
.xlsx-button {
  background-color: transparent;
  border: none;
  padding: 0;
  color: rgba(0, 0, 0, 0.87) !important;
}

.not-active {
  pointer-events: none;
  cursor: default;
}
.el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}
.ui.longer.modal {
  height: 700px;
}
</style>