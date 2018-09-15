<template>
  <div class="ui twelve wide column">

    <form class="ui form" @submit.prevent="saveEmployee()">
      <div class="ui dividing header">Registrar empleado</div>

      <div class="ten wide required field">
        <label for="">Nombre del empleado</label>
        <div class="field" :class="{error: errors.has('nombreEmpleado')}">
          <input type="text" name="nombreEmpleado" v-model="employee.name" data-vv-as="nombre del empleado" v-validate="'required'">
          <span class="info-error" v-show="errors.has('nombreEmpleado')">{{errors.first('nombreEmpleado')}}</span>
        </div>
      </div>

      <div class="ten wide required field">
        <label for="">AC - No (Numero Identificador)</label>
        <div class="field" :class="{error: errors.has('acnro')}">

          <input type="text" name="acnro" v-model="employee.acnro" data-vv-as="numero identificador" v-validate="'required'">
          <span class="info-error" v-show="errors.has('acnro')">{{errors.first('acnro')}}</span>

        </div>
      </div>

      <div class="ten wide required field">
        <label for="">Numero de Cedula</label>
        <div class="field" :class="{error: errors.has('nroCedula')}">
          <input type="text" name="nroCedula" v-model="employee.identityNumber" data-vv-as="numero de cedula" v-validate="'required'">
          <span class="info-error" v-show="errors.has('nroCedula')">{{errors.first('nroCedula')}}</span>

        </div>
      </div>

      <div class="ten wide required field">
        <label for="">Fecha de Ingreso</label>
        <div class="field" :class="{error: errors.has('fechaIngreso')}">
          <el-date-picker name="fechaIngreso" data-vv-as="fecha de ingreso" v-model="employee.admissionDate" v-validate="'required'" placeholder="Seleccionar fecha" format="dd/MM/yyyy" value-format="dd/MM/yyyy">
          </el-date-picker>
          <div class="info-error" v-show="errors.has('fechaIngreso')">{{errors.first('fechaIngreso')}}</div>
        </div>

      </div>

      <div class="ten wide required field">
        <label for="">Sucursal:</label>
        <div class="field" :class="{error: errors.has('funcionario')}">
          <select name="funcionario" v-model="subsidiarySelected" class="ui dropdown" v-validate="'required'">
            <option disabled value="">Seleccionar Sucursal..</option>
            <option v-for="subsidiary in subsidiaries" :key="subsidiary._id" v-bind:value="subsidiary._id">{{subsidiary.name}}</option>
          </select>
          <span class="info-error" v-show="errors.has('funcionario')">{{errors.first('funcionario')}}</span>
        </div>
      </div>

      <div class="ten wide field">
        <div class="three fields">
          <div class="required field">
            <label>Carga laboral</label>
            <div class="field" :class="{error: errors.has('cargaLaboral')}">
              <el-time-select name="cargaLaboral" data-vv-as="carga laboral" v-validate="'required'" v-model="employee.workingHours" :picker-options="{start: '08:30',step: '00:30',end: '10:30'}" placeholder="Selecccionar Horario"></el-time-select>
              <div class="info-error" v-show="errors.has('cargaLaboral')">{{errors.first('cargaLaboral')}}</div>
            </div>
          </div>
          <div class="required field">
            <label for="">Sabado medio tiempo</label>
            <div class="fields">
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" value=true v-model="employee.halfTime">
                  <label>Si</label>
                </div>
              </div>

              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" value=false v-model="employee.halfTime">
                  <label>No</label>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="required field">
            <label for="">Pago de Hora Extra</label>
            <div class="fields">
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" value="bancoHora" v-model="employee.tipoHoraExtra">
                  <label for="">Banco de Hora</label>
                </div>
              </div>

              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" value="efectivo" v-model="employee.tipoHoraExtra">
                  <label for="">Efectivo</label>
                </div>
              </div>
            </div>

          </div> -->

        </div>
      </div>

      <div class="two fields">
        <div class="five wide required field">
          <label for="">Salario Base</label>
          <div class="field" :class="{error: errors.has('salary')}">
            <input name="salary" v-model.lazy="employee.salary" v-money="money" v-validate="'required|validar_monto'" data-vv-as="salario">
            <span class="info-error" v-show="errors.has('salary')">{{errors.first('salary')}}</span>
          </div>
        </div>
        <div class="five wide required field">
          <label for="">Moneda</label>
          <div class="field" :class="{error: errors.has('moneda')}">
            <select v-model="employee.coin" name="moneda" v-validate="'required'" class="ui fluid dropdown monedaSelector">
              <option disbled value="">Seleccionar Moneda..</option>
              <option value="Gs">Guaranies - Gs.</option>
              <option value="Us">Dolares - Us.</option>
              <option value="Rs">Reales - Rs.</option>
            </select>
            <span class="info-error" v-show="errors.has('moneda')">{{errors.first('moneda')}}</span>
          </div>

        </div>

      </div>

      <div class="ten wide field">

        <div class="required field">
          <label for="">IPS sobre</label>
        </div>

        <div class="fields">

          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" value="salario" v-model="employee.ips">
              <label>Salario</label>
            </div>
          </div>

          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" value="salarioMinimo" v-model="employee.ips">
              <label>Salario Minimo</label>
            </div>
          </div>

          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" value="noAplica" v-model="employee.ips">
              <label>No aplica</label>
            </div>
          </div>

        </div>

      </div>

      <button class="ui teal button" :class="{disabled: errors.any()}">Guardar</button>
      <div class="ui button" @click="cancel">Cancelar</div>
    </form>
  </div>
</template>
<script>
import { VMoney } from "v-money";
import moment from "moment";

export default {
  name: "employee",
  data() {
    return {
      employee: {
        name: "",
        acnro: "",
        identityNumber: null,
        admissionDate: null,
        halfTime: false,
        workingHours: "",
        salary: "",
        coin: "",
        ips: "salario",
        subsidiary: null
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false /* doesn't work with directive */
      },
      subsidiarySelected: null,
      subsidiaries: []
    };
  },
  methods: {
    calculateSalaryPerMinute(valor) {
      var checkValor = valor.split(".").join("");
      checkValor = parseInt(checkValor, 10);
      return checkValor / 30 / 8 / 60;
    },
    saveEmployee() {
      this.$validator.validateAll().then(() => {
        if (this.$route.params.id) {
          this.$http
            .put(`/employees/update/${this.$route.params.id}`, {
              name: this.employee.name,
              acnro: this.employee.acnro,
              identityNumber: this.employee.identityNumber,
              admissionDate: this.employee.admissionDate,
              halfTime: this.employee.halfTime,
              workingHours: this.employee.workingHours,
              salary: parseInt(this.employee.salary.split(".").join("")),
              salaryPerMinute: this.calculateSalaryPerMinute(
                this.employee.salary
              ),
              coin: this.employee.coin,
              ips: this.employee.ips,
              subsidiary: this.subsidiarySelected,
              active: true
            })
            .then(response => {
              console.log(response);
              this.success();
              this.cancel();
            })
            .catch(e => {
              console.log(e);
              if (e.errmsg && e.errmsg.includes("duplicate")) {
                this.errors.add(
                  "acnro",
                  "El numero identificador ingresado ya existe"
                );
              }
              if (err.response.data.errors.salary.$isValidatorError) {
                this.errors.add(
                  "salary",
                  err.response.data.errors.amount.message
                );
              }
              this.fail();
            });
        } else {
          this.$http
            .post(`/employees/add`, {
              name: this.employee.name,
              acnro: this.employee.acnro,
              identityNumber: this.employee.identityNumber,
              admissionDate: this.employee.admissionDate,
              halfTime: this.employee.halfTime,
              tipoHoraExtra: this.employee.tipoHoraExtra,
              workingHours: this.employee.workingHours,
              salary: parseInt(this.employee.salary.split(".").join("")),
              salaryPerMinute: this.calculateSalaryPerMinute(
                this.employee.salary
              ),
              coin: this.employee.coin,
              ips: this.employee.ips,
              subsidiary: this.subsidiarySelected,
              active: true
            })
            .then(response => {
              console.log(response);
              this.success();
              this.cancel();
            })
            .catch(e => {
              console.log(e);
              if (e.errmsg && e.errmsg.includes("duplicate")) {
                this.errors.add(
                  "acnro",
                  "El numero identificador ingresado ya existe"
                );
              }
              this.fail();
            });
        }
      });
    },
    getEmployee() {
      if (this.$route.params.id) {
        this.$http
          .get(`/employees/edit/${this.$route.params.id}`)
          .then(response => {
            this.employee.name = response.data.name;
            this.employee.acnro = response.data.acnro;
            this.employee.identityNumber = response.data.identityNumber;
            this.employee.admissionDate = response.data.admissionDate;
            this.employee.halfTime = response.data.halfTime;
            // this.employee.tipoHoraExtra = response.data.tipoHoraExtra;
            this.employee.workingHours = response.data.workingHours;
            this.employee.salary = response.data.salary;
            this.employee.coin = response.data.coin;
            this.employee.ips = response.data.ips;
            this.employee.subsidiary = response.data.subsidiary;
            this.subsidiarySelected = response.data.subsidiary;
            $(this.$el)
              .find(".monedaSelector")
              .dropdown("refresh")
              .dropdown("set selected", response.data.coin);
          });
      }
    },
    getSubsidiaries() {
      this.$http
        .get(`/subsidiaries/`)
        .then(response => {
          this.subsidiaries = response.data;
        })
        .catch(e => {
          console.log(e);
          this.fail();
        });
    },
    returnList() {
      this.$router.push({ name: "employeeList" });
    },
    cancel() {
      this.$router.push({ name: "employeeList" });
    },
    editSuccess() {
      this.$notify({
        title: "Exito!",
        message: "El registro se actualizo correctamente",
        type: "success"
      });
    },
    success() {
      this.$notify({
        title: "Exito! ;)",
        message: "El registro se guardo correctamente",
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
    this.getSubsidiaries();
    this.getEmployee();
  },
  watch: {
    $route: "getEmployee",
    subsidiarySelected: function() {
      $(this.$el)
        .find(".ui.dropdown")
        .dropdown("refresh")
        .dropdown("set selected", this.subsidiarySelected);
    },
    "employee.identityNumber": function(value) {
      return value.toLocaleString();
    }
  },
  directives: { money: VMoney }
};
</script>
<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
