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
                            <el-date-picker v-model="empleado.fechaIngreso" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
                            </el-date-picker>
                        </div>
            <div class="ten wide field">
                <label for="">Sucursal:</label>
                <select name="sucursales" v-model="sucursalkey" >
                    <option disabled value="">Seleccionar Sucursal..</option>
                    <option v-for="sucursal in sucursales" :key="sucursal['.key']" v-bind:value="sucursal['.key']" :selected="sucursal['.key'] === Object.keys(empleado.sucursalId)[0] ? true : false">{{sucursal.nombre}}</option>
                    <option value=""></option>
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
                    <select v-model="empleado.moneda" class="ui fluid dropdown" >
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
import axios from "axios";
import moment from "moment";
import { eventBus } from "./../../main";
import { url } from "./../.././config/backend";

import { db } from "./../.././config/firebase";
let sucursalesRef = db.ref("/sucursales");
let funcionariosRef = db.ref("/funcionarios");

export default {
  name: "funcionario",
  data() {
    return {
      empleado: {
        nombre: "",
        acnro: "",
        nroCedula: null,
        fechaIngreso: "",
        medioTiempo: false,
        tipoHoraExtra: "bancoHora",
        cargaLaboral: "",
        salario: "",
        moneda: "",
        ips: "salario",
        sucursalId: {}
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false /* doesn't work with directive */
      },
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
        this.empleado.fechaIngreso = moment(
          this.empleado.fechaIngreso,
          "DD/MM/YYYY"
        )
          .format("L")
          .toString();

        this.empleado.sucursalId[this.sucursalkey] = true;

        funcionariosRef
          .child(this.$route.params.id)
          .update(this.empleado)
          .then(response => {
            this.editSuccess();
            this.cancelar();
            console.log(response);
          });
      } else {
        this.empleado.fechaIngreso = moment(
          this.empleado.fechaIngreso,
          "DD/MM/YYYY"
        )
          .format("L")
          .toString();

        this.empleado.sucursalId[this.sucursalkey] = true;

        console.log("Test", this.empleado.sucursalId);

        funcionariosRef.push(this.empleado).then(res => {
          this.success();
          this.cancelar();
          console.log(res);
        });
      }
    },
    obtenerEmpleado() {
      if (typeof this.$route.params.id != "undefined") {
        console.log(funcionariosRef.child(this.$route.params.id));
        funcionariosRef.child(this.$route.params.id).once("value", snapshot => {
          console.log(snapshot.val());
          this.empleado.nombre = snapshot.val().nombre;
          this.empleado.acnro = snapshot.val().acnro;
          this.empleado.nroCedula = snapshot.val().nroCedula;
          this.empleado.fechaIngreso = snapshot.val().fechaIngreso;
          this.empleado.medioTiempo = snapshot.val().medioTiempo;
          this.empleado.tipoHoraExtra = snapshot.val().tipoHoraExtra;
          this.empleado.cargaLaboral = snapshot.val().cargaLaboral;
          this.empleado.salario = snapshot.val().salario;
          this.empleado.moneda = snapshot.val().moneda;
          this.empleado.ips = snapshot.val().ips;
          this.empleado.sucursalId = snapshot.val().sucursalId;
          this.sucursalkey = Object.keys(snapshot.val().sucursalId)[0] || "";
        });
      }
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
      .find(".ui.fluid.dropdown")
      .dropdown();
  },
  created() {
    this.obtenerEmpleado();
    this.$bindAsArray("sucursales", sucursalesRef);
  },
  watch: {
    $route: "obtenerEmpleado"
  },
  directives: { money: VMoney }
};
</script>
<style>

</style>
