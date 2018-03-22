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
          <select name="funcionarios" v-model="funcionarioSeleccionado" class="ui dropdown" id="funcionarioSelector">
            <option disabled value="">Seleccionar Funcionario..</option>
            <option v-for="funcionario in funcionarios" :key="funcionario._id" v-bind:value="funcionario._id">{{funcionario.nombre}}</option>
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
        funcionario: null,
        nombreFuncionario: null,
        entrada: null,
        salida: null,
        horasTrabajadas: null,
        horasExtras: null,
        horasFaltantes: null,
        estilo: {},
        observacion: null
      },
      funcionarioSeleccionado: null,
      funcionarios: [],
      selPay: ""
    };
  },
  methods: {
    guardarMarcacion() {
      console.log("ID", this.$route.params.id);
      if (typeof this.$route.params.id !== "undefined") {
        console.log("id", this.$route.params.id);
        this.marcacion.funcionario = this.funcionarioSeleccionado;
        this.marcacion.nombreFuncionario = this.getNombreFuncionario(
          this.funcionarioSeleccionado
        );
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

        axios
          .put(
            `${url}/asistencias/update/${this.$route.params.id}`,
            this.marcacion
          )
          .then(response => {
            console.log(response);
            this.success();
            this.cancelar();
          })
          .catch(e => console.log(e));
      } else {
        console.log(this.marcacion.fecha);
        this.marcacion.funcionario = this.funcionarioSeleccionado;
        this.marcacion.nombreFuncionario = this.getNombreFuncionario(
          this.funcionarioSeleccionado
        );
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

        axios
          .post(`${url}/asistencias/add`, this.marcacion)
          .then(response => {
            console.log(response);
            this.success();
            this.cancelar();
          })
          .catch(e => console.log(e));

        // asistenciasRef.push(this.marcacion).then(res => {
        //   this.success, this.cancelar(), console.log(res);
        // });
      }
    },
    getNombreFuncionario(id) {
      var nombre = this.funcionarios.find(funcionario => {
        if (funcionario._id === id) {
          return funcionario.nombre;
        }
      });
      return nombre;
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
      this.funcionarios.filter(element => {
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
          this.funcionarioSeleccionado = response.data.funcionario;
          $(this.$el)
            .find(".ui.dropdown")
            .dropdown("refresh")
            .dropdown("set selected", response.data.funcionario);
        });
    },

    obtenerFuncionarios() {
      axios.get(`${url}/funcionarios/full-list/`).then(response => {
        this.funcionarios = response.data;
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
  mounted() {
    $(this.$el)
      .find(".ui.dropdown")
      .dropdown();
    this.obtenerMarcacion();
    this.obtenerFuncionarios();
  },
  created() {},
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
