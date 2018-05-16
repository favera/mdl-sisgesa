<template>
  <div class="ui twelve wide column">
    <form class="ui form" @submit.prevent="guardarPrestamo()">
      <div class="ui dividing header">Incluir Prestamo</div>

      <div class="ten wide required field">
        <label for="">Fecha</label>
        <div class="field" :class="{error: errors.has('fechaPrestamo')}">
          <el-date-picker name="fechaPrestamo" v-model="prestamo.fecha" format="dd/MM/yyyy" type="date" v-validate="'required'"></el-date-picker>
          <span class="info-error" v-show="errors.has('fechaPrestamo')">{{errors.first('fechaPrestamo')}}</span>
        </div>
      </div>

      <div class="six wide required field">
        <label for="">Seleccionar Funcionario</label>
        <div class="field" :class="{error: errors.has('funcionario')}">
          <select name="funcionario" v-model="funcionarioSeleccionado" class="ui dropdown" v-validate="'required'">
            <option disabled value="">Seleccionar Funcionario..</option>
            <option v-for="funcionario in funcionarios" :key="funcionario._id" v-bind:value="funcionario._id">{{funcionario.nombre}}</option>
          </select>
          <span class="info-error" v-show="errors.has('funcionario')">{{errors.first('funcionario')}}</span>

        </div>

      </div>

      <div class="fifteen wide field">
        <div class="two fields">
          <div class="sixteen wide field">
            <div class="required field">
              <label for="">Monto del Prestamo</label>
            </div>

            <div class="two fields">

              <div class="five wide field" :class="{error: errors.has('monto')}">
                <div class="ui input">
                  <input name="monto" v-model.lazy="prestamo.monto" v-money="money" v-validate="'required|validar_monto'">
                </div>
                <span class="info-error" v-show="errors.has('monto')">{{errors.first('monto')}}</span>
              </div>

              <div class="five wide field" :class="{error: errors.has('moneda')}">

                <select name="moneda" v-model="prestamo.moneda" class="ui dropdown" id="monedaSelector" v-validate="'required'">
                  <option disbled value="">Seleccionar Moneda..</option>
                  <option value="Gs">Guaranies - Gs.</option>
                  <option value="Us">Dolares - Us.</option>
                  <option value="Rs">Reales - Rs.</option>
                </select>
                <span class="info-error" v-show="errors.has('moneda')">{{errors.first('moneda')}}</span>
              </div>

            </div>

            <div class="two fields">
              <div class="five wide required field">
                <label for="">Iniciar Pago en</label>
                <div class="field" :class="{error: errors.has('mesPagos')}">
                  <el-date-picker name="mesPagos" data-vv-as="mes" v-model="prestamo.inicioPago" type="month" placeholder="Seleccionar mes" v-validate="{required: true, validar_mes: {prestamo}}">
                  </el-date-picker>
                </div>
                <span class="info-error" v-show="errors.has('mesPagos')">{{errors.first('mesPagos')}}</span>

              </div>
              <div class="five wide required field">
                <label for="">Fraccion de Cuotas</label>
                <div class="inline fields">
                  <div class="field">
                    <div class="field" :class="{error: errors.has('nroCuotas')}">
                      <el-input-number name="nroCuotas" v-model="prestamo.nroCuotas" @change="handleChange" :min="1" :max="this.maxPrestamo" data-vv-as="cuotas" v-validate="'required|min_value:1'"></el-input-number>
                    </div>
                    <span class="info-error" v-show="errors.has('nroCuotas')">{{errors.first('nroCuotas')}}</span>
                  </div>
                  <div class="circular ui icon button" @click="generarCuotas(prestamo.nroCuotas)">
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
                      <h5>Monto</h5>
                    </div>
                    <div class="middle aligned content">
                      <h5>Estado</h5>
                    </div>
                  </div>

                  <div class="item" :key="cuota.vencimiento" v-for="cuota in prestamo.cuotas">
                    <div class="middle aligned content">
                      <p>{{moment(cuota.vencimiento).format("L")}}</p>
                    </div>
                    <div class="middle aligned content">
                      <p>{{cuota.monto}}-{{cuota.moneda}}</p>
                    </div>

                    <div class="middle aligned content">
                      <div class="ui orange horizontal label">{{cuota.estado}}</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div class="field">
        <button class="ui teal button">Guardar</button>
        <div class="ui button" @click="cancelar()">Cancelar</div>
      </div>

    </form>

  </div>
</template>

<script>
import moment from "moment";
import { VMoney } from "v-money";
import { Validator } from "vee-validate";

export default {
  name: "prestamo",
  data() {
    return {
      prestamo: {
        id: null,
        fecha: new Date(),
        funcionario: null,
        nombreFuncionario: null,
        moneda: null,
        monto: null,
        inicioPago: null,
        cuotas: []
      },
      maxPrestamo: null,
      disabledInput: true,
      funcionarioSeleccionado: null,
      setDate: new Date(),
      funcionarios: [],
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
    obtenerFuncionarios() {
      this.$http
        .get(`/funcionarios/full-list`)
        .then(response => {
          this.funcionarios = response.data;
        })
        .catch(e => {
          console.log(e);
          this.fail();
        });
    },
    handleChange(value) {
      // debugger;
      this.generarCuotas(value);
    },
    generarCuotas(value) {
      this.prestamo.cuotas.length = 0;
      console.log("Al editar", this.prestamo.cuotas);

      if (this.prestamo.monto && this.prestamo.inicioPago) {
        var i = 0;
        do {
          var cuota = {};

          cuota.monto = Math.floor(
            parseInt(this.prestamo.monto.split(".").join("")) / value
          ).toLocaleString();
          cuota.moneda = this.prestamo.moneda;
          cuota.estado = "pendiente";
          // debugger;
          cuota.vencimiento = moment(this.prestamo.inicioPago)
            .add(i, "months")
            .format();
          // debugger;
          console.log(cuota.vencimiento);
          console.log(JSON.stringify(cuota, undefined, 2));

          //test.push(cuota);

          // console.log(JSON.stringify(test, undefined, 2));
          this.prestamo.cuotas.push(cuota);
          i++;
        } while (i < value);
      }
    },
    findFuncionario(id) {
      var funcionario = this.funcionarios.find(
        item => (item._id === id ? item : null)
      );
      return funcionario.nombre;
    },
    obtenerPrestamo() {
      //console.log(this.$route.params.id);

      if (this.$route.params.id) {
        this.$http
          .get(`/prestamos/edit/${this.$route.params.id}`)
          .then(response => {
            this.prestamo.id = response.data._id;
            this.prestamo.fecha = response.data.fecha;
            this.prestamo.monto = response.data.monto;
            this.prestamo.moneda = response.data.moneda;
            this.prestamo.nroCuotas = response.data.nroCuotas;
            this.prestamo.inicioPago = response.data.inicioPago;
            this.prestamo.cuotas = response.data.cuotas;
            $(this.$el)
              .find(".ui.dropdown")
              .dropdown("refresh")
              .dropdown("set selected", response.data.funcionario);

            $(this.$el)
              .find("#monedaSelector")
              .dropdown("refresh")
              .dropdown("set selected", response.data.moneda);
          });
      }
    },
    guardarPrestamo() {
      console.log(this.$route.params.id);
      this.$validator.validateAll();
      if (this.$route.params.id) {
        console.log("entra aca");
        this.prestamo.funcionario = this.funcionarioSeleccionado;
        this.prestamo.nombreFuncionario = this.findFuncionario(
          this.funcionarioSeleccionado
        );

        this.$http
          .put(`/prestamos/update/${this.$route.params.id}`, this.prestamo)
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          })
          .catch(e => {
            console.log(e);
            this.fail();
          });
      } else {
        this.prestamo.funcionario = this.funcionarioSeleccionado;
        if (this.funcionarioSeleccionado) {
          this.prestamo.nombreFuncionario = this.findFuncionario(
            this.funcionarioSeleccionado
          );
        }

        this.$http
          .post(`/prestamos/add`, this.prestamo)
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          })
          .catch(e => {
            console.log(e);
            this.fail();
          });
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoPrestamo" });
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
      .find(".ui.dropdown")
      .dropdown();
  },
  created() {
    this.obtenerFuncionarios();
    this.obtenerPrestamo();
    Validator.extend("validar_monto", {
      getMessage: field => `El ${field} debe ser superior a 0`,
      validate: value => {
        return value.split(".").join("") > 0;
      }
    });
    Validator.extend("validar_mes", {
      getMessage: field => `El ${field} deber ser siguiente al mes actual`,
      validate: function(value, prestamo) {
        console.log(prestamo);
        if (prestamo[0].prestamo.id) {
          return true;
        }
        return moment(value).isAfter(new Date(), "month");
      }
    });
  },
  watch: {
    $route: "obtenerPrestamo",
    "prestamo.monto": function(valor) {
      return (this.maxPrestamo = parseInt(valor.split(".").join("")));
    }
  },
  directives: { money: VMoney }
};
</script>

<style>

</style>


