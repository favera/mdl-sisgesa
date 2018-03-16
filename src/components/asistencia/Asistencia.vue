<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <div class="ui dividing header">Registrar Asistencia</div>
      <div class="five wide field">
        <label for="">Fecha:</label>
        <el-date-picker v-model="marcacion.fecha" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
        </el-date-picker>
      </div>

      <div class="two fields">
        <div class="six wide field">
          <label for="">Funcionario:</label>
          <select v-model="marcacion.funcionarioId">
            <option disabled value="">Seleccionar Empleado..</option>
            <option v-for="empleado in empleados" v-bind:value="empleado['.key']" :key="empleado['.key']" :selected="empleado['.key'] === marcacion.funcionarioId ? true : false">{{empleado.nombre}}</option>
          </select>
        </div>

      </div>

      <div class="fields">
        <div class="field">
          <label for="">Marcacion Entrada:</label>
          <el-time-picker v-model="marcacion.entrada" format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Seleccionar hora" value-format="HH:mm">
          </el-time-picker>
        </div>
        <div class="field">
          <label for="">Marcacion Salida</label>
          <el-time-picker v-model="marcacion.salida" format="HH:mm" value-format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Seleccionar hora">
          </el-time-picker>
        </div>

      </div>

      <div class="ten wide field">
        <label for="">Observacion:</label>
        <textarea name="" id="" rows="2" v-model="marcacion.observacion"></textarea>
      </div>
      <div class="ui teal button" @click="guardarMarcacion">Guardar</div>
      <div class="ui button" @click="cancelar">Cancelar</div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { url } from "./../.././config/backend";
import { db } from "./../.././config/firebase";
let asistenciasRef = db.ref("/asistencias");
let funcionariosRef = db.ref("/funcionarios");
export default {
  data() {
    return {
      marcacion: {
        fecha: null,
        funcionarioId: null,
        entrada: null,
        salida: null,
        horasTrabajadas: null,
        horasExtras: null,
        horasFaltantes: null,
        estilo: {},
        observacion: null
      },
      empleados: [],
      selPay: ""
    };
  },
  methods: {
    guardarMarcacion() {
      console.log("ID", this.$route.params.id);
      if (typeof this.$route.params.id !== "undefined") {
        console.log("id", this.$route.params.id);
        this.marcacion.horasTrabajadas = this.getHorasTrabajadas(
          this.marcacion.entrada,
          this.marcacion.salida
        );
        this.marcacion.horasFaltantes = this.getHorasFaltantes(
          this.marcacion.funcionarioId,
          this.marcacion.entrada,
          this.marcacion.salida
        );
        this.marcacion.horasExtras = this.getHorasExtras(
          this.marcacion.funcionarioId,
          this.marcacion.entrada,
          this.marcacion.salida
        );
        this.marcacion.entrada = moment
          .utc(this.marcacion.entrada)
          .local()
          .format("HH:mm");
        this.marcacion.salida = moment
          .utc(this.marcacion.salida)
          .local()
          .format("HH:mm");
        this.marcacion.estilo.ausente = false;
        this.marcacion.estilo.vacaciones = false;
        this.marcacion.estilo.incompleto = false;

        console.log(JSON.stringify(this.marcacion));

        // asistenciasRef
        //   .child(this.$route.params.id)
        //   .update(this.marcacion)
        //   .then(response => {
        //     this.success();
        //     this.cancelar();
        //     console.log(response);
        //   });

        axios
          .put(url + "/marcaciones/" + this.$route.params.id, {
            fecha: this.marcacion.fecha,
            entrada: moment(this.marcacion.entrada).format("HH:mm"),
            salida: moment(this.marcacion.salida).format("HH:mm"),
            funcionario: this.marcacion.funcionario
            /*fecha: moment(this.marcacion.fecha, "DD/MM/YYYY").format("L"),
            empleadoId: this.marcacion.empleadoId,
            entrada: moment
              .utc(this.marcacion.entrada)
              .local()
              .format("HH:mm"),
            salida: moment
              .utc(this.marcacion.salida)
              .local()
              .format("HH:mm"),
            horasTrabajadas: this.getHorasTrabajadas(
              this.marcacion.entrada,
              this.marcacion.salida
            ),
            horasExtras: this.getHorasExtras(
              this.marcacion.empleadoId,
              this.marcacion.entrada,
              this.marcacion.salida
            ),
            retraso: this.calcularRetraso(
              this.marcacion.empleadoId,
              this.marcacion.entrada,
              this.marcacion.salida
            ),
            bancoHora: this.calculoBancoHora(
              this.marcacion.empleadoId,
              this.marcacion.entrada,
              this.marcacion.salida
            ),
            isConfirmed: true,
            estilo: this.aplicarEstilo(
              this.marcacion.entrada,
              this.marcacion.salida
            )*/
          })
          .then(response => {
            console.log(response);
            this.success();
            this.cancelar();
          })
          .catch(e => console.log(e));
      } else {
        this.marcacion.fecha = moment(
          this.marcacion.fecha,
          "DD/MM/YYYY"
        ).format("L");
        console.log(this.marcacion.fecha);
        funcionariosRef
          .child(this.marcacion.funcionarioId)
          .once("value", snap => {
            console.log(snap.val().nombre);
            this.marcacion.nombreFuncionario = snap.val().nombre;
          });
        console.log(this.nombreFuncionario);
        this.marcacion.horasTrabajadas = this.getHorasTrabajadas(
          this.marcacion.entrada,
          this.marcacion.salida
        );
        this.marcacion.horasFaltantes = this.getHorasFaltantes(
          this.marcacion.funcionarioId,
          this.marcacion.entrada,
          this.marcacion.salida
        );
        this.marcacion.horasExtras = this.getHorasExtras(
          this.marcacion.funcionarioId,
          this.marcacion.entrada,
          this.marcacion.salida
        );
        this.marcacion.entrada = moment
          .utc(this.marcacion.entrada)
          .local()
          .format("HH:mm");
        this.marcacion.salida = moment
          .utc(this.marcacion.salida)
          .local()
          .format("HH:mm");
        this.marcacion.estilo.ausente = false;
        this.marcacion.estilo.vacaciones = false;
        this.marcacion.estilo.incompleto = false;

        asistenciasRef.push(this.marcacion).then(res => {
          this.success, this.cancelar(), console.log(res);
        });
        // axios
        //   .post(url + "/marcaciones", {
        //     fecha: moment(this.marcacion.fecha, "DD/MM/YYYY").format("L"),
        //     empleadoId: this.marcacion.empleadoId,
        //     entrada: moment
        //       .utc(this.marcacion.entrada)
        //       .local()
        //       .format("HH:mm"),
        //     salida: moment
        //       .utc(this.marcacion.salida)
        //       .local()
        //       .format("HH:mm"),
        //     horasTrabajadas: this.getHorasTrabajadas(
        //       this.marcacion.entrada,
        //       this.marcacion.salida
        //     ),
        //     horasExtras: this.getHorasExtras(
        //       this.marcacion.empleadoId,
        //       this.marcacion.entrada,
        //       this.marcacion.salida
        //     ),
        //     retraso: this.calcularRetraso(
        //       this.marcacion.empleadoId,
        //       this.marcacion.entrada,
        //       this.marcacion.salida
        //     ),
        //     bancoHora: this.calculoBancoHora(
        //       this.marcacion.empleadoId,
        //       this.marcacion.entrada,
        //       this.marcacion.salida
        //     ),
        //     isConfirmed: true,
        //     estilo: this.aplicarEstilo(
        //       this.marcacion.entrada,
        //       this.marcacion.salida
        //     )
        //   })
        //   .then(response => {
        //     console.log(response);
        //     this.success();
        //     this.cancelar();
        //   })
        //   .catch(e => console.log(e));
      }
    },
    obtenerSabados() {
      var d = new Date(),
        month = d.getMonth(),
        mondays = [];

      d.setDate(1);

      // Get the first Monday in the month
      while (d.getDay() !== 1) {
        d.setDate(d.getDate() + 1);
      }

      // Get all the other Mondays in the month
      while (d.getMonth() === month) {
        mondays.push(new Date(d.getTime()));
        d.setDate(d.getDate() + 7);
      }

      return mondays;
    },
    calcularRetraso(empleadoId, entrada) {
      var horaEntrada;
      var horaSalida;
      this.empleados.filter(element => {
        if (element.id === empleadoId) {
          horaEntrada = moment
            .duration(element.sucursal.horarioEntrada, "HH:mm")
            .asMinutes();
          console.log("HORARIO ENTRADA FUNCIONARIO", horaEntrada);
          horaSalida = moment
            .duration(element.sucursal.horarioSalida)
            .asMinutes();
          console.log("HORARIO SALIDA FUNCIONARIO", horaSalida);
        }
      });
      var entrada = moment
        .utc(entradautc)
        .local()
        .format("HH:mm");
      console.log("Entrada", entrada);
      var bancoHoraEntrada =
        horaEntrada - moment.duration(entrada, "HH:mm").asMinutes();

      var salida = moment
        .utc(salidautc)
        .local()
        .format("HH:mm");

      var bancoHoraSalida =
        moment.duration(salida, "HH:mm").asMinutes() - horaSalida;

      var total = 0;

      if (bancoHoraEntrada > 0) {
        total = total + bancoHoraEntrada;
      }

      if (bancoHoraSalida > 0) {
        total = total + bancoHoraSalida;
      }

      if (total === 0) {
        return null;
      } else {
        return this.handleNegative(total);
      }
    },
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
    aplicarEstilo(entrada, salida) {
      var estilo = {};
      estilo.ausente = false;
      estilo.incompleto = false;
      if (entrada == null && salida == null) {
        console.log("DESDE ESTILO " + entrada, salida);
        estilo.ausente = true;
        estilo.incompleto = false;
        return estilo;
      } else {
        if (entrada == null || salida == null) {
          console.log("DESDE ESTILO " + entrada, salida);
          estilo.ausente = false;
          estilo.incompleto = true;
          return estilo;
        }
      }
      return estilo;
    },
    getHorasFaltantes(funcionarioId, entrada, salida) {
      var cargaLaboral, horasTrabajadas, resultado;
      console.log("Horas Faltantes Entrada", entrada);
      console.log("Horas Faltantes Salida", salida);
      funcionariosRef.child(funcionarioId).once("value", snap => {
        cargaLaboral = snap.val().cargaLaboral;
      });
      horasTrabajadas = moment(salida).diff(entrada, "minutes");
      resultado =
        horasTrabajadas - moment.duration(cargaLaboral, "HH:mm").asMinutes();
      if (resultado < 0) {
        return this.convertToHours(resultado);
      } else {
        return false;
      }
    },
    getHorasTrabajadas(entrada, salida) {
      var horasTrabajadas = moment(salida).diff(entrada, "minutes");
      console.log("Horas Trabajadas", horasTrabajadas);
      console.log(this.convertToHours(horasTrabajadas));
      return this.convertToHours(horasTrabajadas);
    },
    getHorasExtras(funcionarioId, entrada, salida) {
      var cargaLaboral, horasTrabajadas, resultado;
      funcionariosRef.child(funcionarioId).once("value", snap => {
        cargaLaboral = snap.val().cargaLaboral;
      });
      horasTrabajadas = moment(salida).diff(entrada, "minutes");
      console.log("Horas Trabajadas", horasTrabajadas);
      resultado =
        horasTrabajadas - moment.duration(cargaLaboral, "HH:mm").asMinutes();
      console.log("Resultado", resultado);
      if (resultado > 0) {
        console.log(this.convertToHours(resultado));
        return this.convertToHours(resultado);
      } else {
        return false;
      }
      // var cargaLaboral;
      // this.empleados.filter(element => {
      //   if (element.id === empleadoId) {
      //     cargaLaboral = moment
      //       .duration(element.cargaLaboral, "HH:mm")
      //       .asMinutes();
      //   }
      // });

      // console.log("Resultado carga laboral" + cargaLaboral);

      // var horasTrabajadas = moment(salida).diff(entrada, "minutes");
      // console.log("Horas Trabajadas " + horasTrabajadas);

      // var result = horasTrabajadas - cargaLaboral;
      // console.log("Resultado" + result);
      // return this.convertToHours(result);
    },
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
    obtenerMarcacion() {
      axios
        .get(`${url}/asistencias/edit/${this.$route.params.id}`)
        .then(response => {
          this.marcacion.fecha = response.data.fecha;
          this.marcacion.entrada = response.data.entrada;
          this.marcacion.salida = response.data.salida;
        });
      // var offset = moment().utcOffset();
      // console.log(offset);
      // if (typeof this.$route.params.id != "undefined") {
      //   console.log(this.$route.params.id);
      //   asistenciasRef.child(this.$route.params.id).once("value", snap => {
      //     this.marcacion.fecha = snap.val().fecha;
      //     this.marcacion.funcionarioId = snap.val().funcionarioId;
      //     this.marcacion.entrada = moment(
      //       snap.val().entrada,
      //       "HH:mm"
      //     ).toISOString();
      //     this.marcacion.salida = moment(
      //       snap.val().salida,
      //       "HH:mm"
      //     ).toISOString();
      //     this.marcacion.observacion = snap.val().observacion;
      //   });
      // axios
      //   .get(url + "/marcaciones/" + this.$route.params.id)
      //   .then(response => {
      //     this.marcacion.fecha = response.data.fecha;
      //     this.marcacion.empleadoId = response.data.empleadoId;
      //     this.marcacion.entrada = moment(
      //       response.data.entrada,
      //       "HH:mm"
      //     ).toISOString();
      //     this.marcacion.salida = moment(
      //       response.data.salida,
      //       "HH:mm"
      //     ).toISOString();
      //     this.marcacion.horasTrabajadas = response.data.horasTrabajadas;
      //     this.marcacion.horasExtras = response.data.horasExtras;
      //     this.marcacion.observacion = response.data.observacion;
      //     console.log(response.data);
      //     console.log(
      //       "Fecha UTC " +
      //         moment(response.data.entrada, "HH:mm").toISOString()
      //     );
      //     console.log(
      //       "Fecha UTC offset " +
      //         moment
      //           .utc(response.data.entrada, "HH:mm")
      //           .utcOffset(offset)
      //           .format()
      //     );
      //   })
      //   .catch(e => console.log(e));
    },
    // obtenerFuncionario() {
    //   axios
    //     .get(url + "/empleados?_expand=sucursal")
    //     .then(response => {
    //       console.log(response);
    //       this.empleados = response.data;
    //     })
    //     .catch(e => console.log(e));
    // },
    obtenerFuncionarios() {
      axios.get(`${url}/funcionarios/full-list/`).then(response => {
        this.empleados = response.data;
      });
    },
    cancelar() {
      this.$router.push({ name: "listadoAsistencia" });
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
  created() {
    this.obtenerMarcacion();
    this.obtenerFuncionarios();
    //this.$bindAsArray("empleados", funcionariosRef);
  },
  watch: {
    $route: "obtenerMarcacion"
  }
};
</script>
<style>
.test-asis {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
