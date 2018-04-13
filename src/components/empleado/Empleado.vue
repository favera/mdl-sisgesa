<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <div class="ui dividing header">Registrar empleado</div>

      <div class="ten wide field">
        <label for="">Nombre del empleado:</label>
        <input type="text" v-model="empleado.nombre">
      </div>

      <div class="ten wide field">
        <label for="">AC - No (Numero Identificador):</label>
        <input type="text" v-model="empleado.acnro">
      </div>

      <div class="ten wide field">
        <label for="">Numero de Cedula:</label>
        <input type="text" v-model="empleado.nroCedula">
      </div>

      <div class="ten wide field">
        <label for="">Fecha de Ingreso</label>
        <el-date-picker v-model="empleado.fechaIngreso" placeholder="Seleccionar fecha" format="dd/MM/yyyy" value-format="dd/MM/yyyy">
        </el-date-picker>
      </div>
      <div class="ten wide field">
        <label for="">Sucursal:</label>

        <select name="funcionarios" v-model="sucursalSeleccionada" class="ui dropdown">
          <option disabled value="">Seleccionar Sucursal..</option>
          <option v-for="sucursal in sucursales" :key="sucursal._id" v-bind:value="sucursal._id">{{sucursal.nombre}}</option>
        </select>

      </div>

      <div class="ten wide field">
        <div class="three fields">
          <div class="field">
            <label>Carga laboral</label>
            <el-time-select v-model="empleado.cargaLaboral" :picker-options="{
                                                                                                                                                                                                                                                            start: '08:30',
                                                                                                                                                                                                                                                            step: '00:30',
                                                                                                                                                                                                                                                            end: '10:30'
                                                                                                                                                                                                                                                        }" placeholder="Selecccionar Horario">
            </el-time-select>
          </div>
          <div class="field">
            <label for="">Sabado medio tiempo</label>
            <div class="fields">
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" value=true v-model="empleado.medioTiempo">
                  <label>Si</label>
                </div>
              </div>

              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" value=false v-model="empleado.medioTiempo">
                  <label>No</label>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <label for="">Pago de Hora Extra:</label>
            <div class="fields">
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" value="bancoHora" v-model="empleado.tipoHoraExtra">
                  <label for="">Banco de Hora</label>
                </div>
              </div>

              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" value="efectivo" v-model="empleado.tipoHoraExtra">
                  <label for="">Efectivo</label>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div class="two fields">
        <div class="five wide field">
          <label for="">Salario Base:</label>
          <input v-model.lazy="empleado.salario" v-money="money">
        </div>
        <div class="five wide field">
          <label for="">Moneda</label>
          <select v-model="empleado.moneda" class="ui fluid dropdown monedaSelector">
            <option disbled value="">Seleccionar Moneda..</option>
            <option value="Gs">Guaranies - Gs.</option>
            <option value="Us">Dolares - Us.</option>
            <option value="Rs">Reales - Rs.</option>
          </select>
        </div>

      </div>

      <div class="ten wide field">

        <div class="field">
          <label for="">IPS sobre:</label>
        </div>

        <div class="fields">

          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" value="salario" v-model="empleado.ips">
              <label>Salario</label>
            </div>
          </div>

          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" value="salarioMinimo" v-model="empleado.ips">
              <label>Salario Minimo</label>
            </div>
          </div>

          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" value="noAplica" v-model="empleado.ips">
              <label>No aplica</label>
            </div>
          </div>

        </div>

      </div>

      <div class="ui teal button" @click="guardarEmpleado">Guardar</div>
      <div class="ui button" @click="cancelar">Cancelar</div>
    </div>
  </div>
</template>
<script>
import { VMoney } from "v-money";
import moment from "moment";

export default {
  name: "funcionario",
  data() {
    return {
      empleado: {
        nombre: "",
        acnro: "",
        nroCedula: null,
        fechaIngreso: null,
        medioTiempo: false,
        tipoHoraExtra: "bancoHora",
        cargaLaboral: "",
        salario: "",
        moneda: "",
        ips: "salario",
        sucursal: null
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false /* doesn't work with directive */
      },
      sucursalSeleccionada: null,
      sucursalkey: "",
      sucursales: []
    };
  },
  methods: {
    calcularSalarioMinuto(valor) {
      var checkValor = valor.split(".").join("");
      checkValor = parseInt(checkValor, 10);
      return checkValor / 30 / 8 / 60;
    },
    guardarEmpleado() {
      if (typeof this.$route.params.id !== "undefined") {
        this.$http
          .put(`/funcionarios/update/${this.$route.params.id}`, {
            nombre: this.empleado.nombre,
            acnro: this.empleado.acnro,
            nroCedula: this.empleado.nroCedula,
            fechaIngreso: this.empleado.fechaIngreso,
            medioTiempo: this.empleado.medioTiempo,
            tipoHoraExtra: this.empleado.tipoHoraExtra,
            cargaLaboral: this.empleado.cargaLaboral,
            salario: this.empleado.salario,
            salarioMinuto: this.calcularSalarioMinuto(this.empleado.salario),
            moneda: this.empleado.moneda,
            ips: this.empleado.ips,
            sucursal: this.sucursalSeleccionada,
            activo: true
          })
          .then(response => {
            console.log(response);
            this.success();
            this.cancelar();
          })
          .catch(e => {
            console.log(e);
            this.fail();
            this.cancelar();
          });
      } else {
        this.$http
          .post(`/funcionarios/add`, {
            nombre: this.empleado.nombre,
            acnro: this.empleado.acnro,
            nroCedula: this.empleado.nroCedula,
            fechaIngreso: this.empleado.fechaIngreso,
            medioTiempo: this.empleado.medioTiempo,
            tipoHoraExtra: this.empleado.tipoHoraExtra,
            cargaLaboral: this.empleado.cargaLaboral,
            salario: this.empleado.salario,
            salarioMinuto: this.calcularSalarioMinuto(this.empleado.salario),
            moneda: this.empleado.moneda,
            ips: this.empleado.ips,
            sucursal: this.sucursalSeleccionada,
            activo: true
          })
          .then(response => {
            console.log(response);
            this.success();
            this.cancelar();
          });
      }
    },
    obtenerEmpleado() {
      if (this.$route.params.id) {
        this.$http
          .get(`/funcionarios/edit/${this.$route.params.id}`)
          .then(response => {
            this.empleado.nombre = response.data.nombre;
            this.empleado.acnro = response.data.acnro;
            this.empleado.nroCedula = response.data.nroCedula;
            this.empleado.fechaIngreso = response.data.fechaIngreso;
            this.empleado.medioTiempo = response.data.medioTiempo;
            this.empleado.tipoHoraExtra = response.data.tipoHoraExtra;
            this.empleado.cargaLaboral = response.data.cargaLaboral;
            this.empleado.salario = response.data.salario;
            this.empleado.moneda = response.data.moneda;
            this.empleado.ips = response.data.ips;
            this.empleado.sucursal = response.data.sucursal;
            this.sucursalSeleccionada = response.data.sucursal;
            // $(this.$el)
            //   .find(".ui.dropdown")
            //   .dropdown("refresh")
            //   .dropdown("set selected", response.data.sucursal);
            $(this.$el)
              .find(".monedaSelector")
              .dropdown("refresh")
              .dropdown("set selected", response.data.moneda);
          });
      }
    },
    obtenerSucursales() {
      this.$http
        .get(`/sucursales/`)
        .then(response => {
          this.sucursales = response.data;
        })
        .catch(e => {
          console.log(e);
          this.fail();
        });
    },
    returnList() {
      this.$router.push({ name: "listadoEmpleado" });
    },
    cancelar() {
      this.$router.push({ name: "listadoEmpleado" });
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
    this.obtenerSucursales();
    this.obtenerEmpleado();
  },
  watch: {
    $route: "obtenerEmpleado",
    sucursalSeleccionada: function() {
      $(this.$el)
        .find(".ui.dropdown")
        .dropdown("refresh")
        .dropdown("set selected", this.sucursalSeleccionada);
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
