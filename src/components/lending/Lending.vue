<template>
  <div class="ui twelve wide column">
    <form
      class="ui form"
      @submit.prevent="saveLending()"
    >
      <div class="ui dividing header">Incluir Prestamo</div>

      <div class="ten wide required field">
        <label for="">Fecha</label>
        <div
          class="field"
          :class="{error: errors.has('fechaPrestamo')}"
        >
          <el-date-picker
            name="fechaPrestamo"
            v-model="lending.date"
            format="dd/MM/yyyy"
            value-format="yyyy-MM-dd"
            type="date"
            v-validate="'required'"
          ></el-date-picker>
          <span
            class="info-error"
            v-show="errors.has('fechaPrestamo')"
          >{{errors.first('fechaPrestamo')}}</span>
        </div>
      </div>

      <div class="six wide required field">
        <label for="">Seleccionar Funcionario</label>
        <div
          class="field"
          :class="{error: errors.has('employee')}"
        >
          <select
            name="employee"
            v-model="employeeSelected"
            class="ui fluid search selection dropdown"
            v-validate="'required'"
          >
            <option
              disabled
              value=""
            >Seleccionar Funcionario..</option>
            <option
              v-for="employee in employees"
              :key="employee._id"
              v-bind:value="employee._id"
            >{{employee.name}}</option>
          </select>
          <span
            class="info-error"
            v-show="errors.has('employee')"
          >{{errors.first('employee')}}</span>

        </div>

      </div>

      <div class="fifteen wide field">
        <div class="two fields">
          <div class="sixteen wide field">
            <div class="required field">
              <label for="">Monto del Prestamo</label>
            </div>

            <div class="two fields">

              <div
                class="five wide field"
                :class="{error: errors.has('amount')}"
              >
                <div class="ui input">
                  <input
                    name="amount"
                    data-vv-as="monto"
                    v-model.lazy="lending.amount"
                    v-money="money"
                    v-validate="'required|validar_monto'"
                  >
                </div>
                <span
                  class="info-error"
                  v-show="errors.has('amount')"
                >{{errors.first('amount')}}</span>
              </div>

              <div class="two wide field">
                <div class="ui disabled input field">
                  <input
                    type="text"
                    v-model="lending.coin"
                  >
                </div>
              </div>

            </div>

            <div class="two fields">
              <div class="five wide required field">
                <label for="">Iniciar Pago en</label>
                <div
                  class="field"
                  :class="{error: errors.has('mesPagos')}"
                >
                  <el-date-picker
                    name="mesPagos"
                    data-vv-as="mes"
                    v-model="lending.startMonth"
                    value-format="yyyy-MM-dd"
                    type="month"
                    placeholder="Seleccionar mes"
                    v-validate="'required'"
                  >
                  </el-date-picker>
                </div>
                <span
                  class="info-error"
                  v-show="errors.has('mesPagos')"
                >{{errors.first('mesPagos')}}</span>

              </div>
              <div class="five wide required field">
                <label for="">Fraccion de Cuotas</label>
                <div class="inline fields">
                  <div class="field">
                    <div
                      class="field"
                      :class="{error: errors.has('installmentNumber')}"
                    >
                      <el-input-number
                        name="installmentNumber"
                        v-model="lending.installmentNumber"
                        @change="handleChange"
                        :min="1"
                        data-vv-as="cuotas"
                        v-validate="'required'"
                      ></el-input-number>
                    </div>
                    <span
                      class="info-error"
                      v-show="errors.has('installmentNumber')"
                    >{{errors.first('installmentNumber')}}</span>
                  </div>
                  <div
                    class="circular ui icon button"
                    @click="generateInstallments(lending.installmentNumber)"
                  >
                    <i class="undo icon"></i>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div class="field">
            <div class="ui card">
              <div class="content">
                <div class="header">Cuotas Generadas</div>
              </div>
              <div class="content">
                <div class="ui divided items">
                  <div class="item">
                    <div class="middle aligned content">
                      <h5> Vencimiento</h5>
                    </div>
                    <div class="middle aligned content">
                      <h5>amount</h5>
                    </div>
                    <div class="middle aligned content">
                      <h5>Estado</h5>
                    </div>
                  </div>

                  <div
                    class="item"
                    :key="installment.dueDate"
                    v-for="installment in lending.installments"
                  >
                    <div class="middle aligned content">
                      <p>{{moment.utc(installment.dueDate).format("L")}}</p>
                    </div>
                    <div class="middle aligned content">
                      <p>{{installment.amount.toLocaleString()}}-{{installment.coin}}</p>
                    </div>

                    <div class="middle aligned content">
                      <div class="ui orange horizontal label">{{installment.state}}</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div class="field">
        <button
          class="ui teal button"
          :class="{disabled: errors.any()}"
        >Guardar</button>
        <div
          class="ui button"
          @click="cancel()"
        >Cancelar</div>
      </div>

    </form>

  </div>
</template>

<script>
import moment from "moment";
import { VMoney } from "v-money";
import { Validator } from "vee-validate";

export default {
  name: "lending",
  data() {
    return {
      lending: {
        id: null,
        date: moment(new Date()).format("YYYY-MM-DD"),
        employee: null,
        employeeName: null,
        coin: null,
        amount: null,
        startMonth: null,
        installments: []
      },
      maxInstallment: null,
      disabledInput: true,
      employeeSelected: null,
      employees: [],
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
    handleChange(value) {
      this.generateInstallments(value);
    },
    generateInstallments(value) {
      this.lending.installments.length = 0;
      console.log("Al editar", this.lending.installments);

      if (
        parseInt(this.lending.amount.split(".").join("")) > 0 &&
        this.lending.startMonth
      ) {
        var i = 0;
        do {
          var installment = {};

          installment.amount =
            parseInt(this.lending.amount.split(".").join("")) / value;
          installment.coin = this.lending.coin;
          installment.state = "pendiente";

          installment.dueDate = moment(this.lending.startMonth)
            .add(i, "months")
            .utcOffset(-4)
            .format();

          this.lending.installments.push(installment);
          i++;
        } while (i < value);
      } else {
      }
    },
    findEmployee(id) {
      var employee = this.employees.find(item =>
        item._id === id ? item : null
      );
      return employee.name;
    },
    getLending() {
      if (this.$route.params.id) {
        this.$http
          .get(`/lendings/edit/${this.$route.params.id}`)
          .then(response => {
            this.lending.id = response.data._id;
            this.lending.date = response.data.date;
            this.lending.amount = response.data.amount;
            this.lending.coin = response.data.coin;
            this.lending.installmentNumber = response.data.installmentNumber;
            this.lending.startMonth = response.data.startMonth;
            this.lending.installments = response.data.installments;
            $(this.$el)
              .find(".ui.fluid.search.selection.dropdown")
              .dropdown("refresh")
              .dropdown("set selected", response.data.employee);

            // $(this.$el)
            //   .find("#coinSelector")
            //   .dropdown("refresh")
            //   .dropdown("set selected", response.data.coin);
          });
      }
    },
    saveLending() {
      this.$validator.validateAll().then(() => {
        if (this.$route.params.id) {
          this.lending.employee = this.employeeSelected;
          this.lending.employeeName = this.findEmployee(this.employeeSelected);

          this.$http
            .put(`/lendings/update/${this.$route.params.id}`, this.lending)
            .then(response => {
              this.success();
              this.cancel();
              console.log(response);
            })
            .catch(err => {
              // if (err.response.data.errors.amount.$isValidatorError) {
              //   this.errors.add(
              //     "amount",
              //     err.response.data.errors.amount.message
              //   );
              // }
              this.fail();
            });
        } else {
          this.lending.employee = this.employeeSelected;

          if (this.employeeSelected) {
            this.lending.employeeName = this.findEmployee(
              this.employeeSelected
            );
          }

          this.$http
            .post(`/lendings/add`, this.lending)
            .then(response => {
              this.success();
              this.cancel();
              console.log(response);
            })
            .catch(err => {
              // if (err.response.data.errors.amount.$isValidatorError) {
              //   this.errors.add(
              //     "amount",
              //     err.response.data.errors.amount.message
              //   );
              // }
              this.fail();
            });
        }
      });
    },
    cancel() {
      this.$router.push({ name: "lendingList" });
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
    this.getLending();
    Validator.extend("validar_mes", {
      getMessage: field => `El ${field} deber ser siguiente al mes actual`,
      validate: function(value, lending) {
        console.log(lending);
        if (lending[0].lending.id) {
          return true;
        }
        return moment(value).isAfter(lending[0].date, "month");
      }
    });
  },
  watch: {
    $route: "getLending",
    // "lending.amount": function(value) {
    //   if (value > 0) {
    //     this.errors.remove("amount");
    //   }
    // },
    employeeSelected: function() {
      this.employees.find(employee => {
        if (employee._id === this.employeeSelected) {
          this.lending.coin = employee.coin;
        }
      });
    }
    // "prestamo.amount": function(valor) {
    //   console.log(typeof valor);
    //   var test = parseInt(valor.split(".").join(""));
    //   console.log(test);
    //   return (this.maxInstallment = 10);
    // }
  },
  directives: { money: VMoney }
};
</script>

<style>
</style>


