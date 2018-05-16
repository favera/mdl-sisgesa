<template>
  <div class="ui twelve wide column">

    <form class="ui form" @submit.prevent="guardarEmpleado()">
      <div class="ui dividing header">Registrar empleado</div>

      <div class="ten wide required field">
        <label for="">Nombre del empleado</label>
        <div class="field" :class="{error: errors.has('nombreEmpleado')}">
          <input type="text" name="nombreEmpleado" v-model="empleado.nombre" data-vv-as="nombre del empleado" v-validate="'required'">
          <span class="info-error" v-show="errors.has('nombreEmpleado')">{{errors.first('nombreEmpleado')}}</span>
        </div>
      </div>

      <div class="ten wide required field">
        <label for="">AC - No (Numero Identificador)</label>
        <div class="field" :class="{error: errors.has('acnro')}">

          <input type="text" name="acnro" v-model="empleado.acnro" data-vv-as="numero identificador" v-validate="'required'">
          <span class="info-error" v-show="errors.has('acnro')">{{errors.first('acnro')}}</span>

        </div>
      </div>

      <div class="ten wide required field">
        <label for="">Numero de Cedula</label>
        <div class="field" :class="{error: errors.has('nroCedula')}">
          <input type="text" name="nroCedula" v-model="empleado.nroCedula" data-vv-as="numero de cedula" v-validate="'required'">
          <span class="info-error" v-show="errors.has('nroCedula')">{{errors.first('nroCedula')}}</span>

        </div>
      </div>

      <div class="ten wide required field">
        <label for="">Fecha de Ingreso</label>
        <div class="field" :class="{error: errors.has('fechaIngreso')}">
          <el-date-picker name="fechaIngreso" data-vv-as="fecha de ingreso" v-model="empleado.fechaIngreso" v-validate="'required'" placeholder="Seleccionar fecha" format="dd/MM/yyyy" value-format="dd/MM/yyyy">
          </el-date-picker>
          <div class="info-error" v-show="errors.has('fechaIngreso')">{{errors.first('fechaIngreso')}}</div>
        </div>

      </div>

      <div class="ten wide required field">
        <label for="">Sucursal:</label>
        <div class="field" :class="{error: errors.has('funcionario')}">
          <select name="funcionario" v-model="sucursalSeleccionada" class="ui dropdown" v-validate="'required'">
            <option disabled value="">Seleccionar Sucursal..</option>
            <option v-for="sucursal in sucursales" :key="sucursal._id" v-bind:value="sucursal._id">{{sucursal.nombre}}</option>
          </select>
          <span class="info-error" v-show="errors.has('funcionario')">{{errors.first('funcionario')}}</span>
        </div>
      </div>

      <div class="ten wide field">
        <div class="three fields">
          <div class="required field">
            <label>Carga laboral</label>
            <div class="field" :class="{error: errors.has('cargaLaboral')}">
              <el-time-select name="cargaLaboral" data-vv-as="carga laboral" v-validate="'required'" v-model="empleado.cargaLaboral" :picker-options="{start: '08:30',step: '00:30',end: '10:30'}" placeholder="Selecccionar Horario"></el-time-select>
              <div class="info-error" v-show="errors.has('cargaLaboral')">{{errors.first('cargaLaboral')}}</div>
            </div>
          </div>
          <div class="required field">
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

          <div class="required field">
            <label for="">Pago de Hora Extra</label>
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
        <div class="five wide required field">
          <label for="">Salario Base</label>
          <div class="field" :class="{error: errors.has('salario')}">
            <input name="salario" v-validate="'validar_monto'" v-model.lazy="empleado.salario" v-money="money">
            <span class="info-error" v-show="errors.has('salario')">{{errors.first('salario')}}</span>
          </div>
        </div>
        <div class="five wide required field">
          <label for="">Moneda</label>
          <div class="field" :class="{error: errors.has('moneda')}">
            <select v-model="empleado.moneda" name="moneda" v-validate="'required'" class="ui fluid dropdown monedaSelector">
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

      <button class="ui teal button" :class="{disabled: errors.any()}">Guardar</button>
      <div class="ui button" @click="cancelar">Cancelar</div>
    </form>
  </div>
</template>
<script>
import { VMoney } from "v-money";
import moment from "moment";

export default {
  name: "empleado",
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
      this.$validator.validateAll().then(() => {
        if (this.$route.params.id) {
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
              if (e.errmsg && e.errmsg.includes("duplicate")) {
                this.errors.add(
                  "acnro",
                  "El numero identificador ingresado ya existe"
                );
              }
              this.fail();
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
