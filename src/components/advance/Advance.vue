<template>
  <div class="ui twelve wide column">
    <form class="ui form" @submit.prevent="saveAdvance">
      <div class="ui dividing header">Incluir Adelanto</div>

      <div class="ten wide required field">
        <label for="">Fecha</label>
        <div class="field" :class="{'error': errors.has('date')}">
          <el-date-picker v-model="advance.date" format="dd/MM/yyyy" type="date" name="date" v-validate="'required'"></el-date-picker>
          <div v-show="errors.has('date')" class="info-error">{{errors.first('date')}}</div>
        </div>
      </div>

      <div class="ten wide required field">
        <label for="">Seleccionar Funcionario</label>
        <div class="field" :class="{'error': errors.has('employee')}">
          <select name="employee" v-model="employeeSelected" class="ui fluid search selection dropdown" v-validate="'required'">
            <option disabled value="">Seleccionar Funcionario..</option>
            <option v-for="employee in employees" :key="employee._id" v-bind:value="employee._id">{{employee.name}}</option>
          </select>
          <span v-show="errors.has('employee')" class="info-error">{{errors.first('employee')}}</span>
        </div>
      </div>

      <div class="ten wide field">
        <div class=" required field">
          <label for="">Tipo de Adelanto</label>
        </div>

        <div class="inline fields">
          <div class="three wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="advance.advanceType" value="quincena" @click="disabledInput = true">
              <label>Quincena</label>
            </div>
          </div>

          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="advance.advanceType" value="especificado" @click="disabledInput = false">
              <label>Especificar monto</label>
            </div>
          </div>
          <div class="four wide field" :class="{'error': errors.has('amount')}">
            <div class="ui input">
              <input type="text" v-model.lazy="advance.amount" v-money="money" name="amount" v-bind:class="{'disabled': disabledInput}" v-validate="'required|validar_monto'" data-vv-as="monto">
            </div>
            <span class="info-error" v-show="errors.has('amount')">{{errors.first('amount')}}</span>

          </div>
          <div class="two wide field">
            <div class="ui disabled input">
              <input type="text" v-model="advance.coin">
            </div>
          </div>
        </div>
      </div>

      <button class="ui teal button" :class="{disabled: errors.any()}" type="submit">Guardar</button>
      <div class="ui button" @click="cancel()">Cancelar</div>
    </form>

  </div>
</template>

<script>
import moment from "moment";
import { VMoney } from "v-money";
import { Validator } from "vee-validate";

export default {
  name: "advance",
  data() {
    return {
      advance: {
        date: new Date(),
        employee: null,
        employeeName: null,
        advanceType: "quincena",
        coin: null,
        amount: null
      },
      disabledInput: true,
      employeeSelected: null,
      setDate: new Date(),
      employees: [],
      salary: null,
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false /* doesn't work with directive */
      }
    };
  },
  methods: {
    getAdvance() {
      console.log(this.$route.params.id);

      if (this.$route.params.id) {
        this.$http
          .get(`/advances/edit/${this.$route.params.id}`)
          .then(response => {
            this.advance.date = response.data.date;
            this.advance.advanceType = response.data.advanceType;
            this.advance.amount = response.data.amount;
            this.advance.coin = response.data.coin;
            this.advance.employee = response.data.employee;
            this.disabledInput = true;
            $(this.$el)
              .find(".ui.fluid.search.selection.dropdown")
              .dropdown("refresh")
              .dropdown("set selected", response.data.employee);
          });
      }
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
    saveAdvance() {
      this.$validator.validateAll().then(() => {
        if (this.$route.params.id) {
          this.advance.employee = this.employeeSelected;
          this.advance.employeeName = this.getEmployeeName(
            this.employeeSelected
          );
          this.advance.amount = parseInt(
            this.advance.amount.split(".").join("")
          );
          this.$http
            .put(`/advances/update/${this.$route.params.id}`, this.advance)
            .then(response => {
              console.log(response);
              this.editSuccess();
              this.cancel();
            })
            .catch(e => {
              console.log(e);
              this.fail();
            });
        } else {
          this.advance.employee = this.employeeSelected;
          this.advance.employeeName = this.getEmployeeName(
            this.employeeSelected
          );
          this.advance.amount = parseInt(
            this.advance.amount.split(".").join("")
          );
          this.$http
            .post(`/advances/add`, this.advance)
            .then(response => {
              console.log(response);
              this.success();
              this.cancel();
            })
            .catch(err => {
              console.log("el error", err.response);

              this.fail();
            });
        }
      });
    },
    cancel() {
      this.$router.push({ name: "advanceList" });
    },
    success() {
      this.$notify({
        title: "Exito!",
        message: "El registro se ha creado correctamente",
        type: "success"
      });
    },
    editSuccess() {
      this.$notify({
        title: "Exito!",
        message: "El registro se ha actualizado correctamente",
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
      .find(".ui.fluid.search.selection.dropdown")
      .dropdown();
  },
  created() {
    this.getEmployees();
    this.getAdvance();
  },
  directives: { money: VMoney },
  watch: {
    $route: "getAdvance",
    employeeSelected: function() {
      var employee = this.employees.find(employee => {
        if (employee._id === this.employeeSelected) {
          this.advance.coin = employee.coin;
          if (this.advance.advanceType === "quincena") {
            this.salary = employee.salary;
            console.log(this.salary);
            this.advance.amount = Math.floor(
              employee.salary / 2
            ).toLocaleString();
          }
        }
      });
    }
  }
};
</script>

<style>
.info-error {
  color: #9f3a38;
}
</style>


