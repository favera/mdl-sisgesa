<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <div class="field">
        <div class="ui breadcrumb">
          <a class="section" @click="returnList">Listado de Planillas de Salario</a>
          <i class="right angle icon divider"></i>
          <a class="section" @click="returnDetail">Detalle de Planilla</a>
          <i class="right angle icon divider"></i>
          <div class=" active section">Resumen de Banco de Horas</div>

        </div>
      </div>
      <h3 class="ui dividing header">
        Resumen Banco de Horas
      </h3>

      <div class="ui basic segment">
        <div class="ui items">
          <div class="item">

            <div class="middle aligned content">
              <div class="header">
                <!-- <i class="olive circle outlined user icon"></i> -->
                {{this.nombre}}
              </div>
              <div class="meta">Funcionario</div>
            </div>
          </div>
        </div>

      </div>

      <div class="ui two cards">
        <div class="teal card">
          <div class="middle aligned content">
            <div class="header">Total de Horas Acumuladas:</div>
            <div class="ui basic segment">
              <div class="ui horizontal statistic">
                <div class="value">
                  {{getHours(this.totalBancoHoras.totalMinutes) || "00"}}
                </div>
                <div class="label">
                  horas
                </div>
                <div class="value">
                  {{getMinutes(this.totalBancoHoras.totalMinutes) || "00"}}
                </div>
                <div class="label">
                  minutos
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="blue card">
          <div class="middle aligned content">
            <div class="header">Banco de Horas acumuladas del mes:</div>
            <div class="ui basic segment">
              <div class="ui horizontal statistic">
                <div class="value">
                  {{ moment(this.resumenHoras.horaExtraHora, "HH").format("HH")}}
                </div>
                <div class="label">
                  horas
                </div>

                <div class="value">
                  {{moment(this.resumenHoras.horaExtraMinutos, "mm").format("mm")}}
                </div>
                <div class="label">
                  Minutos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <table class="ui striped table" style="margin-top: 50px;">
        <thead>
          <tr>
            <th>Fecha</th>
            <th class="center aligned">Motivo</th>
            <th class="center aligned">Horas Acumuladas</th>
            <th class="center aligned" v-show="this.showOptions">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dato, index) in historico" v-bind:key="dato._id" v-if="!dato.pagoHoraExtra">
            <td>{{moment(dato.fecha).format("DD/MM/YYYY")}}</td>
            <td class="center aligned">{{getObservacion(dato.observacion, dato.horasFaltantes)}}</td>
            <td class="center aligned">{{dato.horasFaltantes || dato.horasExtras}}</td>
            <td class="center aligned" v-show="this.showOptions">
              <span v-if="dato.bancoHora">
                <!-- <i class="undo link icon"></i> -->
              </span>
              <span v-else-if="dato.horasExtras">
                <i class="checkmark box link icon" @click="saveBankHours(dato.horasExtras, dato.funcionario._id, dato._id, index)"></i>
                <i class="remove link icon" @click="undoBankHour(dato._id, dato.horasExtras, index)"></i>
                <i class="money bill alternate outline link icon" @click="payOverTime(dato._id, index)"></i>
              </span>

              <i class="clock outline link icon" v-if="dato.horasFaltantes" @click="amendDelay(dato._id, dato.funcionario._id, dato.horasFaltantes, index)"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    id: {
      type: String
    },
    funcionario: {
      type: String
    },
    nombre: {
      type: String
    },
    startDate: {
      type: String
    },
    endDate: {
      type: String
    },
    detail: {
      type: Boolean
    }
  },
  data() {
    return {
      historico: [],
      totalBancoHoras: {
        totalMinutes: null,
        funcionario: null
      },
      resumenHoras: {
        totalHoraExtra: 0,
        horaExtraMinutos: null,
        horaExtraHora: null
      },
      showOptions: !this.detail
    };
  },
  methods: {
    async getHistoricAttendance() {
      var totalHoursPromise = this.$http.get(
        `/salarios/banco-hora/${this.funcionario}`
      );
      var attendanceHistoricPromise = this.$http.get(
        `/salarios/attendance-historic/${this.funcionario}?inicio=${
          this.startDate
        }&fin=${this.endDate}`
      );

      const [totalHours, attendanceHistoric] = await Promise.all([
        totalHoursPromise,
        attendanceHistoricPromise
      ]);

      this.historico = attendanceHistoric.data;
      if (totalHours.data.length > 0) {
        this.totalBancoHoras.totalMinutes = totalHours.data[0].totalMinutes;
        this.totalBancoHoras.funcionario = totalHours.data[0].funcionario;
        this.totalBancoHoras._id = totalHours.data[0]._id;
      }

      //Obtener el total de las Horas extras para desplegar
      if (this.historico.length > 0) {
        this.historico.forEach(element => {
          if (element.horasExtras && !element.pagoHoraExtra) {
            this.resumenHoras.totalHoraExtra += moment
              .duration(element.horasExtras, "HH:mm")
              .asMinutes();
          }
        });

        var h, m;
        h = Math.floor(this.resumenHoras.totalHoraExtra / 60);
        m = this.resumenHoras.totalHoraExtra % 60;
        this.resumenHoras.horaExtraHora = h;
        this.resumenHoras.horaExtraMinutos = m;
      }
    },
    getHours(value) {
      return Math.floor(value / 60);
    },
    getMinutes(value) {
      return value % 60;
    },
    amendDelay(attendanceId, funcionarioId, horasFaltantes, index) {
      this.$confirm(
        "Est accion reducira el descuento del banco de horas acumulado por el funcionario",
        "Alerta",
        {
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      ).then(() => {
        if (this.totalBancoHoras.totalMinutes > 0) {
          var descuento = moment.duration(horasFaltantes, "HH:mm").asMinutes();
          var updateAttendance = {};
          var updateBancoHora = {};
          //valor de descuento sale negativo
          var result = this.totalBancoHoras.totalMinutes + descuento;
          if (result >= 0) {
            updateAttendance.horasFaltantes = null;
            updateBancoHora.totalMinutes = descuento;
          } else if (result < 0) {
            result = result * -1;
            var h = Math.floor(result / 60),
              m = result % 60;
            updateAttendance.horasFaltantes = `-${moment
              .utc()
              .hours(h)
              .minutes(m)
              .format("HH:mm")}`;
            updateBancoHora.totalMinutes =
              this.totalBancoHoras.totalMinutes * -1;
          }
          this.$http
            .put(`/asistencias/amend-delay/${attendanceId}`, updateAttendance)
            .then(() => {
              this.$http
                .post(
                  `/salarios/add/banco-hora/${funcionarioId}`,
                  updateBancoHora
                )
                .then(response => {
                  this.totalBancoHoras.totalMinutes =
                    response.data.totalMinutes;
                  this.$set(this.historico, index, updateAttendance);
                });
            });
        } else {
          console.log("Entro en el esle");
          this.$message({
            type: "error",
            message: "Funcionario sin banco de horas disponible"
          });
        }
      });
    },
    undoBankHour(attendanceId, value, index) {
      this.$confirm(
        "Esta accion eliminara el valor de las horas acumuladas en el mes. Continuar?",
        "Alerta",
        {
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      ).then(() => {
        this.$http
          .put(`/asistencias/cancel-overtime/${attendanceId}`)
          .then(response => {
            console.log(response);
            this.resumenHoras.totalHoraExtra -= moment
              .duration(value, "HH:mm")
              .asMinutes();
            this.resumenHoras.horaExtraHora = Math.floor(
              this.resumenHoras.totalHoraExtra / 60
            );
            this.resumenHoras.horaExtraMinutos =
              this.resumenHoras.totalHoraExtra % 60;

            this.historico.splice(index, 1);
          });
      });
    },
    saveBankHours(value, funcionario, asistenciaId, index) {
      this.$confirm(
        "Las horas acumuladas seran depositadas en el Banco de Horas. Continuar?",
        "Alerta",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          var newItem = {};
          newItem.funcionario = funcionario;
          newItem.totalMinutes = moment.duration(value, "HH:mm").asMinutes();
          this.$http
            .post(`/salarios/add/banco-hora/${funcionario}`, newItem)
            .then(response => {
              this.totalBancoHoras = response.data;
              //   debugger;
              this.$http
                .put(`asistencias/update-banktime/${asistenciaId}`)
                .then(response => {
                  console.log(response);
                  //   this.resumenHoras.totalMinutes -= moment
                  //     .duration(value, "HH:mm")
                  //     .asMinutes();
                  //   this.resumenHoras.totalHoraExtra = 0;
                  //   this.resumenHoras.horaExtraMinutos = null;
                  //   this.resumenHoras.horaExtraHora = null;
                  this.$set(this.historico, index, response.data);

                  //   this.getHistoricAttendance();
                });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso cancelado"
          });
        });
    },
    payOverTime(attendanceId, index) {
      this.$confirm(
        "Esta accion va a realizar el pago de la hora extra en efectivo. Continuar?",
        "Alerta",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.$http
            .put(`/asistencias/update-overtime/${attendanceId}`)
            .then(response => {
              if (response.data.pagoHoraExtra) {
                let [hour, minutes] = this.convertOverTime(
                  response.data.horasExtras
                );
                this.resumenHoras.horaExtraHora -= hour;
                this.resumenHoras.horaExtraMinutos -= minutes;
                this.historico.splice(index, 1);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso cancelado"
          });
        });
    },
    convertOverTime(data) {
      var totalMinutes = moment.duration(data, "HH:mm").asMinutes(),
        hour = Math.floor(totalMinutes / 60),
        minutes = totalMinutes % 60;
      return [hour, minutes];
    },
    returnList() {
      this.$router.push({ name: "listadoSalarios" });
    },
    returnDetail() {
      if (this.detail) {
        this.$router.push({
          name: "detallePlanilla",
          params: {
            id: this.id,
            enableView: false,
            startDate: this.startDate,
            endDate: this.endDate,
            detail: this.detail
          }
        });
      } else {
        this.$router.push({
          name: "detallePlanilla",
          params: {
            enableView: true,
            startDate: this.startDate,
            endDate: this.endDate,
            detail: this.detail
          }
        });
      }
    },
    getObservacion(observacion, horasFaltantes) {
      if (!observacion && horasFaltantes) {
        return "Retraso";
      }
      return observacion;
    }
  },
  created() {
    this.getHistoricAttendance();
  }
};
</script>

<style>
</style>
