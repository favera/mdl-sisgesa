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
                                    {{this.totalBancoHoras.hours || "00"}}
                                </div>
                                <div class="label">
                                    horas
                                </div>
                                <div class="value">
                                    {{this.totalBancoHoras.minutes || "00"}}
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
                                    {{this.resumenHoras.horaExtraHora}}
                                </div>
                                <div class="label">
                                    horas
                                </div>

                                <div class="value">
                                    {{this.resumenHoras.horaExtraMinutos}}
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
                        <th class="center aligned">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dato in historico" v-bind:key="dato._id" v-if="!dato.pagoHoraExtra">
                        <td>{{moment(dato.fecha).format("DD/MM/YYYY")}}</td>
                        <td class="center aligned">{{getObservacion(dato.observacion, dato.horasFaltantes)}}</td>
                        <td class="center aligned">{{dato.horasFaltantes || dato.horasExtras}}</td>
                        <td class="center aligned">
                            <i class="checkmark box link icon" v-if="dato.horasExtras" @click="saveBankHours(dato.horasExtras, dato.funcionario._id)"></i>
                            <i class="remove link icon" v-if="dato.horasExtras"></i>
                            <i class="money bill alternate outline link icon" v-if="dato.horasExtras"></i>
                            <i class="clock outline link icon" v-if="dato.horasFaltantes"></i>
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
    funcionario: {
      type: String
    },
    nombre: {
      type: String
    },
    dateStart: {
      type: String
    },
    dateEnd: {
      type: String
    }
  },
  data() {
    return {
      historico: [],
      totalBancoHoras: {
        hours: null,
        totalMinutes: null,
        minutes: null,
        funcionario: null
      },
      resumenHoras: {
        totalHoraExtra: 0,
        horaExtraMinutos: null,
        horaExtraHora: null
      }
    };
  },
  methods: {
    async getHistoricAttendance() {
      var totalHoursPromise = this.$http.get(
        `/salarios/banco-hora/${this.funcionario}`
      );
      var attendanceHistoricPromise = this.$http.get(
        `/salarios/attendance-historic/${this.funcionario}?inicio=${
          this.dateStart
        }&fin=${this.dateEnd}`
      );

      const [totalHours, attendanceHistoric] = await Promise.all([
        totalHoursPromise,
        attendanceHistoricPromise
      ]);

      this.historico = attendanceHistoric.data;
      if (totalHours.data > 1) {
        this.totalBancoHoras = totalHours.data;
      }

      //Obtener el total de las Horas extras para desplegar
      if (this.historico.length > 0) {
        this.historico.forEach(element => {
          if (element.horasExtras) {
            this.resumenHoras.totalHoraExtra += moment
              .duration(element.horasExtras, "HH:mm")
              .asMinutes();
          }
        });
      }

      this.getHoursAndMinutes(this.resumenHoras.totalHoraExtra);
    },
    saveBankHours(value, funcionario) {
      var minutes = moment.duration(value, "HH:mm").asMinutes();
      this.totalBancoHoras.totalMinutes = minutes;
      this.totalBancoHoras.hours = Math.floor(minutes / 60);
      this.totalBancoHoras.minutes = minutes % 60;
      this.totalBancoHoras.funcionario = funcionario;
    },
    payExtraHours() {},
    returnList() {
      this.$router.push({ name: "listadoSalarios" });
    },
    returnDetail() {
      this.$router.push({
        name: "detallePlanilla",
        params: {
          enableView: true,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd
        }
      });
    },
    getObservacion(observacion, horasFaltantes) {
      if (!observacion && horasFaltantes) {
        return "Retraso";
      }
      return observacion;
    },
    getHoursAndMinutes(mins) {
      var h, m;
      h = Math.floor(mins / 60);
      m = mins % 60;
      var numDig = this.numDigits(h);

      if (numDig > 1) {
        this.resumenHoras.horaExtraHora = h;
        this.resumenHoras.horaExtraMinutos = moment(m, "mm").format("mm");
      } else {
        this.resumenHoras.horaExtraHora = moment(h, "HH").format("HH");
        this.resumenHoras.horaExtraMinutos = moment(m, "mm").format("mm");
      }
    },
    numDigits(x) {
      return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }
  },
  created() {
    this.getHistoricAttendance();
  }
};
</script>

<style>
</style>
