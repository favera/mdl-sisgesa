<template>
  <div class="ui twelve wide column">
    <form class="ui form" @submit.prevent="saveEvent">
      <div class="ui dividing header">Incluir Evento</div>

      <div class="ten wide field">
        <div class="required field">
          <label for="">Tipo de Evento</label>
        </div>

        <div class="field" :class="{error: errors.has('tipoEvento')}">
          <select v-model="event.eventType" name="tipoEvento" v-validate="'required'" class="ui dropdown" @change="changeViewFields(event.eventType)">
            <option disbled value="">Seleccionar Evento..</option>
            <option value="feriado">Feriado</option>
            <option value="permiso maternidad">Permiso Maternidad</option>
            <option value="vacaciones">Vacaciones</option>
            <option value="dia libre">Día Libre</option>
            <option value="reposo">Reposo</option>
            <option value="consulta medica">Consulta Medica</option>
            <option value="permiso">Permiso</option>
          </select>
          <span class="info-error" v-show="errors.has('tipoEvento')">{{errors.first('tipoEvento')}}</span>
        </div>

        <!-- <div class="inline fields">
          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="event.eventType" @click="errors.items.length=0" value="vacaciones">
              <label>Vacaciones</label>
            </div>
          </div>

          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="event.eventType" @click="errors.items.length = 0" value="feriado">
              <label>Feriado</label>
            </div>
          </div>
        </div> -->
      </div>

      <div class="ten wide field" v-show="showViewStatus">
        <div class="ten wide required field">
          <label for="">Fecha del Feriado</label>
          <div class="field" :class="{error: errors.has('holidayDate')}">
            <el-date-picker name="holidayDate" v-model="event.holidayDate" format="dd/MM/yyyy" data-vv-as="fecha del feriado" v-validate="'required'" placeholder="Seleccionar fecha"></el-date-picker>
            <div class="info-error" v-show="errors.has('holidayDate')">{{this.errors.first('holidayDate')}}</div>
          </div>

        </div>

        <div class="tend wide required field">
          <label for="">Motivo del Feriado</label>
          <div class="field" :class="{error: errors.has('holidayDescription')}">
            <input type="text" name="holidayDescription" v-model="event.holidayDescription" data-vv-as="motivo del feriado" v-validate="'required'">
            <span class="info-error" v-show="errors.has('holidayDescription')">{{errors.first('holidayDescription')}}</span>
          </div>

        </div>
      </div>

      <div class="ten wide field" v-show="!showViewStatus">
        <div class="required field">
          <label for="">Seleccionar Funcionario</label>

          <div class="field" :class="{error: errors.has('employee')}">
            <select class="ui fluid search selection dropdown" name="employee" v-model="employeeSelected" data-vv-as="funcionario" v-validate="'required'">
              <option disabled value="">Seleccionar Funcionario..</option>
              <option v-for="employee in employees" :key="employee._id" v-bind:value="employee._id">{{employee.name}}</option>
            </select>
            <span class="info-error" v-show="errors.has('employee')">{{errors.first('employee')}}</span>
          </div>

        </div>

        <div class="required field">
          <label>Seleccionar fecha del Evento</label>
          <div class="inline fields">
            <label>Fecha Inicio</label>
            <div class="field" :class="{error: errors.has('startDate')}">
              <el-date-picker name="startDate" v-model="event.startDate" type="date" format="dd/MM/yyyy" v-validate="{required: true}" data-vv-as="fecha inicio" placeholder="Seleccionar Fecha"></el-date-picker>
              <div class="info-error" v-show="errors.has('startDate')">{{errors.first('startDate')}}</div>
            </div>

            <label>Fecha Fin</label>
            <div class="field" :class="{error: errors.has('endDate')}">
              <el-date-picker name="endDate" v-model="event.endDate" type="date" format="dd/MM/yyyy" data-vv-as="fecha fin" v-validate="{required:true}" placeholder="Seleccionar Fecha"></el-date-picker>
              <div class="info-error" v-show="errors.has('endDate')">{{errors.first('endDate')}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="ten wide field">
        <label>Observacion:</label>
        <div class="field">
          <textarea v-model="event.remark" rows="2"></textarea>
        </div>
      </div>

      <!-- si es vacaciones -->
      <!-- <div class="ten wide field" v-show="event.eventType ==='vacaciones'">
        <div class="required field">
          <label for="">Seleccionar Funcionario</label>

          <div class="field" :class="{error: errors.has('employee')}">
            <select class="ui fluid search selection dropdown" name="employee" v-model="employeeSelected" data-vv-as="funcionario" v-validate="'required'">
              <option disabled value="">Seleccionar Funcionario..</option>
              <option v-for="employee in employees" :key="employee._id" v-bind:value="employee._id">{{employee.name}}</option>
            </select>
            <span class="info-error" v-show="errors.has('employee')">{{errors.first('employee')}}</span>
          </div>

        </div>

        <div class="required field">
          <label>Periodo de Vacaciones</label>
          <div class="inline fields">
            <label>Fecha Inicio</label>
            <div class="field" :class="{error: errors.has('startDate')}">
              <el-date-picker name="startDate" v-model="event.startDate" type="date" format="dd/MM/yyyy" v-validate="{required: true}" data-vv-as="fecha inicio" placeholder="Seleccionar Fecha"></el-date-picker>
              <div class="info-error" v-show="errors.has('startDate')">{{errors.first('startDate')}}</div>
            </div>

            <label>Fecha Fin</label>
            <div class="field" :class="{error: errors.has('endDate')}">
              <el-date-picker name="endDate" v-model="event.endDate" type="date" format="dd/MM/yyyy" data-vv-as="fecha fin" v-validate="{required:true}" placeholder="Seleccionar Fecha"></el-date-picker>
              <div class="info-error" v-show="errors.has('endDate')">{{errors.first('endDate')}}</div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- si es feriado -->
      <!-- <div class="ten wide field" v-show="event.eventType === 'feriado'">
        <div class="ten wide required field">
          <label for="">Seleccionar Fecha del Feriado</label>
          <div class="field" :class="{error: errors.has('holidayDate')}">
            <el-date-picker name="holidayDate" v-model="event.holidayDate" format="dd/MM/yyyy" data-vv-as="fecha del feriado" v-validate="'required'" placeholder="Seleccionar fecha"></el-date-picker>
            <div class="info-error" v-show="errors.has('holidayDate')">{{this.errors.first('holidayDate')}}</div>
          </div>

        </div>

        <div class="tend wide required field">
          <label for="">Motivo del Feriado</label>
          <div class="field" :class="{error: errors.has('holidayDescription')}">
            <input type="text" name="holidayDescription" v-model="event.holidayDescription" data-vv-as="motivo del feriado" v-validate="'required'">
            <span class="info-error" v-show="errors.has('holidayDescription')">{{errors.first('holidayDescription')}}</span>
          </div>

        </div>
      </div> -->

      <div class="ten wide field">
        <button class="ui teal button">Guardar</button>
        <div class="ui button" @click="cancel()">Cancelar</div>
      </div>

    </form>

  </div>
</template>

<script>
import moment from "moment";
import { Validator } from "vee-validate";

export default {
  name: "event",
  data() {
    return {
      event: {
        eventType: "feriado",

        holidayDate: null,
        startDate: moment()
          .startOf("week")
          .format(),
        endDate: moment()
          .endOf("week")
          .format(),
        employee: null,
        employeeName: null,
        holidayDescription: null,
        remark: null
      },
      showViewStatus: true,
      employees: [],
      employeeSelected: null
    };
  },
  methods: {
    getEvent() {
      // debugger;
      if (this.$route.params.id) {
        this.$http
          .get(`/events/edit/${this.$route.params.id}`)
          .then(response => {
            this.event.eventType = response.data.eventType;

            if (response.data.eventType === "vacaciones") {
              this.event.endDate = response.data.endDate;
              this.event.startDate = response.data.startDate;
              this.event.employee = response.data.employee;
              this.employeeSelected = response.data.employee;
              $(this.$el)
                .find(".ui.fluid.search.selection.dropdown")
                .dropdown("refresh")
                .dropdown("set selected", response.data.employee);
            } else {
              this.event.holidayDate = response.data.holidayDate;
              this.event.holidayDescription = response.data.holidayDescription;
              this.event.remark = response.data.remark;
            }
          });
      }
    },
    changeViewFields(eventType) {
      if (eventType !== "feriado") {
        this.showViewStatus = false;
      } else {
        this.showViewStatus = true;
      }
    },
    saveEvent() {
      this.$validator.validateAll().then(() => {
        if (typeof this.$route.params.id !== "undefined") {
          if (this.event.eventType === "feriado") {
            this.$http
              .put(`/events/update/${this.$route.params.id}`, {
                eventType: this.event.eventType,
                holidayDate: this.event.holidayDate,
                holidayDescription: this.event.holidayDescription,
                remark: this.event.remark
              })
              .then(response => {
                this.success();
                this.cancel();
              })
              .catch(e => {
                if (e.errmsg && e.errmsg.includes("duplicate")) {
                  this.errors.add("holidayDate", "La fecha indicada ya existe");
                }
                this.fail();
              });
          } else {
            this.$http
              .put(`/events/update/${this.$route.params.id}`, {
                eventType: this.event.eventType,
                startDate: this.event.startDate,
                endDate: this.event.endDate,
                employee: this.employeeSelected,
                employeeName: this.getEmployeeName(this.employeeSelected),
                remark: this.event.remark
              })
              .then(response => {
                this.$http.put(
                  `/employees/update-vacation/${this.employeeSelected}`,
                  {
                    vacations: response.data._id
                  }
                );
                this.success();
                this.cancel();
              })
              .catch(e => {
                console.log("Respuesta", e.response.data.errors);
                this.fail();
              });
          }
        } else {
          if (this.event.eventType === "feriado") {
            this.$http
              .post(`/events/add`, {
                eventType: this.event.eventType,
                holidayDate: this.event.holidayDate,
                holidayDescription: this.event.holidayDescription,
                remark: this.event.remark
              })
              .then(response => {
                console.log(response);
                this.success();
                this.cancel();
              })
              .catch(error => {
                if (
                  error.response.data.errmsg &&
                  error.response.data.errmsg.includes("duplicate")
                ) {
                  this.errors.add("holidayDate", "La fecha indicada ya existe");
                }
                this.fail();
              });
          } else {
            this.$http
              .post(`/events/add`, {
                eventType: this.event.eventType,
                startDate: this.event.startDate,
                endDate: this.event.endDate,
                employee: this.employeeSelected,
                employeeName: this.getEmployeeName(this.employeeSelected),
                remark: this.event.remark
              })
              .then(response => {
                this.$http
                  .put(`/employees/update-vacation/${this.employeeSelected}`, {
                    vacations: response.data._id,
                    activo: true
                  })
                  .then(response => console.log(response));
                this.success();
                this.cancel();
              })
              .catch(e => {
                if (
                  e.response.data.errors &&
                  e.response.data.errors.hasOwnProperty("startDate")
                ) {
                  this.errors.add(
                    "startDate",
                    e.response.data.errors["startDate"].message
                  );
                }

                if (
                  e.response.data.errors &&
                  e.response.data.errors.hasOwnProperty("endDate")
                ) {
                  this.errors.add(
                    "endDate",
                    e.response.data.errors["endDate"].message
                  );
                }

                this.fail();
              });
          }
        }
      });
    },
    cancel() {
      this.$router.push({ name: "eventList" });
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
    },
    getEmployeeName(id) {
      var name;
      this.employees.find(employee => {
        if (employee._id === id) {
          name = employee.name;
        }
      });

      return name;
    },
    getEmployees() {
      this.$http
        .get(`/employees/full-list`)
        .then(response => {
          this.employees = response.data;
        })
        .catch(e => {
          console.log(e);
          this.fail();
        });
    }
  },
  mounted() {
    $(this.$el)
      .find(".ui.fluid.search.selection.dropdown")
      .dropdown();
  },
  updated() {
    Validator.extend("validar_fecha_before", {
      getMessage: field => `La fecha ${field} debe ser posterior a xxx`,
      validate: function(fecha, event) {
        // debugger;
        return moment(fecha).isBefore(event[0].event.endDate);
      }
    });
    Validator.extend("validar_fecha_after", {
      getMessage: field => `La fecha ${field} debe ser posterior a xxx`,
      validate: function(fecha, event) {
        // debugger;
        return moment(fecha).isAfter(event[0].event.startDate);
      }
    });
    // $(this.$el)
    //   .find(".ui.fluid.search.selection.dropdown")
    //   .dropdown();
  },
  created() {
    this.getEmployees();
    this.getEvent();
  },
  watch: {
    $route: "getEvent",
    employeeSelected: function() {
      $(this.$el)
        .find(".ui.fluid.search.selection.dropdown")
        .dropdown("refresh")
        .dropdown("set selected", this.employeeSelected);
    }
  }
};
</script>

<style>
</style>


