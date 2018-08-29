<template>
  <div class="ui twelve wide column">
    <form class="ui form" @submit.prevent="saveAttendance">
      <div class="ui dividing header">Registrar Asistencia</div>
      <div class="five wide required field">
        <label for="">Fecha</label>
        <div class="field" :class="{error:errors.has('attDate')}">
          <el-date-picker name="attDate" data-vv-as="fecha" v-validate="'required'" v-model="attendance.date" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
          </el-date-picker>
          <div class="info-error" v-show="errors.has('attDate')">{{errors.first('attDate')}}</div>
        </div>
      </div>

      <div class="two fields">
        <div class="six wide required field">
          <label for="">Funcionario</label>
          <div class="field" :class="{error: errors.has('attEmployee')}">
            <select name="attEmployee" data-vv-as="funcionario" v-validate="'required'" v-model="employeeSelected" class="ui dropdown" id="funcionarioSelector">
              <option disabled value="">Seleccionar Funcionario..</option>
              <option v-for="employee in employees" :key="employee._id" v-bind:value="employee._id">{{employee.name}}</option>
            </select>
            <span class="info-error" v-show="errors.has('attEmployee')">{{errors.first('attEmployee')}}</span>
          </div>
        </div>
      </div>

      <div class="fields">
        <div class="required field">
          <label for="">Marcacion Entrada</label>
          <div class="field" :class="{error: errors.has('attEntry')}">
            <el-time-picker name="attEntry" data-vv-as="marcación entrada" v-validate="'required'" v-model="attendance.entryTime" value-format="HH:mm" format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Seleccionar hora">
            </el-time-picker>
            <div class="info-error" v-show="errors.has('attEntry')">{{errors.first('attEntry')}}</div>
          </div>
        </div>

        <div class="required field">
          <label for="">Marcacion Salida</label>
          <div class="field" :class="{error: errors.has('attExit')}">
            <el-time-picker name="attExit" data-vv-as="marcación salida" v-validate="'required'" v-model="attendance.exitTime" value-format="HH:mm" format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Seleccionar hora">
            </el-time-picker>
            <div class="info-error" v-show="errors.has('attExit')">{{errors.first('attExit')}}</div>
          </div>
        </div>

        <div class="required field">
          <label for="">Segundo Turno

          </label>

          <div class="field">
            <div class="inline fields">
              <div class="field">
                <el-switch v-model="attendance.secondShift" >
                </el-switch>
              </div>
              <div class="field">
                <el-time-picker v-model="attendance.delaySecondShift" value-format="HH:mm" :disabled="!attendance.secondShift" format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Ingresar retraso">
                </el-time-picker>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="ten wide field">
        <label for="">Observacion</label>
        <textarea name="" id="" rows="2" v-model="attendance.remark"></textarea>
      </div>
      <button class="ui teal button">Guardar</button>
      <div class="ui button" @click="cancel">Cancelar</div>
    </form>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "attendance",
  data() {
    return {
      attendance: {
        date: null,
        employee: null,
        employeeName: null,
        entryTime: null,
        exitTime: null,
        workedHours: null,
        extraHours: null,
        delay: null,
        status: {},
        remark: null,
        secondShift: false,
        delaySecondShift: null
      },
      employeeSelected: null,
      holidaysPerYear: [],
      employees: []
    };
  },
  methods: {
    saveAttendance() {
      this.$validator
        .validateAll()
        .then(() => {
          if (this.$route.params.id) {
            this.attendance.employee = this.employeeSelected;
            this.attendance.employeeName = this.getEmployeeName(
              this.employeeSelected
            );
            this.attendance.workedHours = this.getWorkedHours(
              this.attendance.entryTime,
              this.attendance.exitTime
            );
            this.attendance.delay = this.getDelay(
              this.attendance.employee,
              this.attendance.entryTime,
              this.attendance.exitTime,
              this.attendance.date,
              this.attendance.secondShift
            );
            this.attendance.extraHours = this.getExtraHours(
              this.attendance.employee,
              this.attendance.entryTime,
              this.attendance.exitTime,
              this.attendance.date
            );
            this.attendance.status.absent = false;
            this.attendance.status.vacation = false;
            this.attendance.status.incomplete = false;

            console.log(JSON.stringify(this.attendance));

            this.$http
              .put(
                `/attendances/update/${this.$route.params.id}`,
                this.attendance
              )
              .then(response => {
                console.log(response);
                this.success();
                this.cancel();
              })
              .catch(e => {
                console.log(e.response);
                if (e.response.data.code === 11000) {
                  this.$notify.error({
                    title: "Error",
                    message:
                      "Ya existe la marcacion que desea agregar. Por favor modifique el registro si es necesario actualizar",
                    duration: 9000
                  });
                }
              });
          } else {
            console.log(this.attendance.date);
            this.attendance.employee = this.employeeSelected;
            this.attendance.employeeName = this.getEmployeeName(
              this.employeeSelected
            );
            this.attendance.workedHours = this.getWorkedHours(
              this.attendance.entryTime,
              this.attendance.exitTime
            );
            this.attendance.delay = this.getDelay(
              this.attendance.employee,
              this.attendance.entryTime,
              this.attendance.exitTime,
              this.attendance.date,
              this.attendance.secondShift
            );
            this.attendance.extraHours = this.getExtraHours(
              this.attendance.employee,
              this.attendance.entryTime,
              this.attendance.exitTime,
              this.attendance.date
            );

            this.attendance.status.absent = false;
            this.attendance.status.vacation = false;
            this.attendance.status.incomplete = false;

            console.log(JSON.stringify(this.attendance));

            this.$http
              .post(`/attendances/add`, this.attendance)
              .then(response => {
                console.log(response);
                this.success();
                this.cancel();
              })
              .catch(e => {
                console.log(e.response);
                if (e.response.data.code === 11000) {
                  this.$notify.error({
                    title: "Error",
                    message:
                      "Ya existe la marcacion que desea agregar. Por favor modifique el registro si es necesario actualizar",
                    duration: 9000
                  });
                }
              });
          }
        })
        .catch(err => {
          this.fail();
        });
    },
    //retorna el nombre del empleado.
    getEmployeeName(id) {
      var name;
      this.employees.find(employee => {
        if (employee._id === id) {
          name = employee.name;
        }
      });
      console.log("Nombre", name);
      return name;
    },

    //verifica que la fecha pasada se encuentra en el array de feriados anuales y retorna el indice
    returnHoliday(date) {
      return this.holidaysPerYear.findIndex(feriado => {
        return moment(feriado.fechaFeriado).isSame(date);
      });
    },
    //calcula el retraso del funcionario en caso de que haya uno.
    getDelay(employeeId, attEntry, attExit, date, secondShift) {
      var workingHours,
        workedHours,
        result,
        entryTime,
        exitTime,
        verifySecondShiftDelay,
        openHours,
        closeHours;
      //si la fecha es string format a date
      // if (typeof date === "string") {
      //   date = new Date(date);
      // }
      //verifica que la fecha sea feriado
      // holiday = this.returnHoliday(date);
      entryTime = moment(attEntry, "HH:mm").format();
      exitTime = moment(attExit, "HH:mm").format();
      //retorna la carga horaria del funcionario
      this.employees.filter(employee => {
        if (employee._id === employeeId) {
          return (workingHours = employee.workingHours);
        }
      });
      // console.log(date);
      // console.log("Verificando si es Domingo", date.getDay === 0);
      //calculo basado en el horario de apertura del local, horaApertura - horaEntrada
      this.employees.filter(employee => {
        if (employee._id === employeeId) {
          openHours = moment(
            employee.subsidiary.startingTime,
            "HH:mm"
          ).format();
          closeHours = moment(employee.subsidiary.endTime, "HH:mm").format();
        }
      });
      console.log("Horario Sucursal", openHours, closeHours);
      //Anteriormente se verificaba si la fecha era domingo para no calcular retrasos, sin embargo al ser feriado o domingo igual se calcula el retraso en ese caso solo verifica si el registro tiene activo el segundo turno para poder hacer la carga del retraso manualmente.
      if (secondShift) {
        verifySecondShiftDelay = moment
          .duration(this.attendance.delaySecondShift, "HH:mm")
          .asMinutes();

        if (verifySecondShiftDelay > 0) {
          result = `-${this.attendance.delaySecondShift}`;
        } else {
          result = this.attendance.delaySecondShift;
        }

        return result;
      } else {
        //calculo basado en el horario de entrada
        result = moment(openHours).diff(entryTime, "minutes");
        if (result < 0) {
          return this.convertToHours(result);
        } else {
          return null;
        }
        //Calculo basado en la cantidad de horas que debe trabajar
        // workedHours = moment(exitTime).diff(entryTime, "minutes");
        // result =
        //   workedHours - moment.duration(workingHours, "HH:mm").asMinutes();
        // if (result < 0) {
        //   return this.convertToHours(result);
        // } else {
        //   return null;
        // }
      }
    },
    //calcula las horas trabajadas del funcionario

    getWorkedHours(attEntry, attExit) {
      var entryTime, exitTime;
      entryTime = moment(attEntry, "HH:mm").format();
      exitTime = moment(attExit, "HH:mm").format();

      // debugger;
      var workedHours = moment(exitTime).diff(entryTime, "minutes");
      console.log("Horas Trabajadas", workedHours);
      //convierte a formato HH:mm
      return this.convertToHours(workedHours);
    },
    //calcula las horas extras en caso de que cumpla los requisitos
    getExtraHours(employeeId, attEntry, attExit, date) {
      var workingHours, workedHours, result, entryTime, exitTime, holiday;

      if (typeof date === "string") {
        date = new Date(date);
      }

      holiday = this.returnHoliday(date);

      this.employees.find(employee => {
        if (employee._id === employeeId) {
          return (workingHours = employee.workingHours);
        }
      });

      entryTime = moment(attEntry, "HH:mm").format();
      exitTime = moment(attExit, "HH:mm").format();
      console.log("Verificando si es Domingo", date.getDay === 0);
      if (date.getDay() === 0 || holiday !== -1) {
        workedHours = moment(exitTime).diff(entryTime, "minutes");
        return this.convertToHours(workedHours);
      } else {
        workedHours = moment(exitTime).diff(entryTime, "minutes");
        console.log("Horas Trabajadas", workedHours);
        result =
          workedHours - moment.duration(workingHours, "HH:mm").asMinutes();
        console.log("Resultado", result);
        if (result > 0) {
          console.log(this.convertToHours(result));
          return this.convertToHours(result);
        } else {
          return null;
        }
      }
    },
    //convierte a formato HH:mm los minutos en formato number
    convertToHours(mins) {
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
    //obtiene la asistencia para la edicion
    getAttendance() {
      this.$http
        .get(`/attendances/edit/${this.$route.params.id}`)
        .then(response => {
          this.attendance.date = response.data.date;
          this.attendance.entryTime = response.data.entryTime;
          this.attendance.exitTime = response.data.exitTime;
          this.employeeSelected = response.data.employee;
          this.attendance.remark = response.data.remark;
          this.attendance.secondShift = response.data.secondShift;
          this.attendance.delaySecondShift = response.data.delay;
          $(this.$el)
            .find(".ui.dropdown")
            .dropdown("refresh")
            .dropdown("set selected", response.data.employee);
        });
    },
    //obtiene los feriados registrados en el año
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
    //obtiene el listado completo de employees
    getEmployees() {
      this.$http
        .get(`/employees/full-list/`)
        .then(response => {
          this.employees = response.data;
        })
        .catch(e => {
          console.log(e);
          this.fail();
        });
    },
    cancel() {
      this.$router.push({ name: "attendanceList" });
    },
    success() {
      this.$notify({
        title: "Exito!",
        message: "El registro se ha creado correctamente",
        type: "success"
      });
    },
    fail() {
      this.$notify.error({
        title: "Error!",
        message: "No se ha podido guardar el registro"
      });
    }
  },
  mounted() {
    $(this.$el)
      .find(".ui.dropdown")
      .dropdown();
  },
  created() {
    this.getEmployees();
    this.getAttendance();
    this.getHolidays();
  },
  watch: {
    $route: "getAttendance",
    employeeSelected: function() {
      $(this.$el)
        .find(".ui.dropdown")
        .dropdown("refresh")
        .dropdown("set selected", this.employeeSelected);
    }
  }
};
</script>
<style>
</style>
