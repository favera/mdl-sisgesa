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
                {{this.name}}
              </div>
              <div class="meta">Funcionario</div>
            </div>
          </div>
        </div>

      </div>

      <div class="ui three cards">
        <div class="teal card">
          <div class="middle aligned content">
            <div class="header">Banco de Horas:</div>
            <div class="ui basic segment">
              <div class="ui horizontal statistic">
                <div class="value">
                  {{getHours(this.totalBankHours.totalMinutes) || "00"}}
                </div>
                <div class="label">
                  horas
                </div>
                <div class="value">
                  {{getMinutes(this.totalBankHours.totalMinutes) || "00"}}
                </div>
                <div class="label">
                  minutos
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="red card">
          <div class="middle aligned content">
            <div class="header">Total Retrasos:</div>
            <div class="ui basic segment">
              <div class="ui horizontal statistic">
                <div class="value">
                  {{moment(this.monthlyDelay.delayHour, "HH").format("HH")}}
                </div>
                <div class="label">
                  horas
                </div>
                <div class="value">
                  {{moment(this.monthlyDelay.delayMinutes, "mm").format("mm")}}
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
            <div class="header">Horas acumuladas del mes:</div>
            <div class="ui basic segment">
              <div class="ui horizontal statistic">
                <div class="value">
                  {{ moment(this.monthlyBankHours.extraHoursInHour, "HH").format("HH")}}
                </div>
                <div class="label">
                  horas
                </div>

                <div class="value">
                  {{moment(this.monthlyBankHours.extraHoursInMinutes, "mm").format("mm")}}
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
            <th class="center aligned">Horas Faltantes</th>
            <th class="center aligned">Horas Acumuladas</th>
            <!-- <th class="center aligned" v-show="this.showOptions">Opciones</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in bankHoursData" v-bind:key="data._id" v-if="!data.payExtraHours">
            <td>{{moment(data.date).format("DD/MM/YYYY")}}</td>
            <td class="center aligned">{{getRemark(data)}}</td>
            <td class="center aligned">
              <span v-if="data.delay">
                <span>{{data.delay}} Hs.</span> |
                <span data-tooltip="Descontar de Banco de Hora"><i class="clock outline link icon" @click="amendDelay(data, index)"></i></span>
              </span>
              
            </td>
            <td class="center aligned">
              <span v-if="data.extraHours">
                <span>{{ data.extraHours}} Hs.</span> |
                <span v-show="!data.hourBank">
                  <span data-tooltip="Acumular a Banco de Hora"><i class="checkmark box link icon" @click="saveBankHours(data, index)"></i></span>
                  <span data-tooltip="Eliminar Hora extra"><i class="remove link icon" @click="undoBankHour(data._id, data.extraHours, index)"></i></span>
                  <span data-tooltip="Pagar Hora extra"><i class="money bill alternate outline link icon" @click="payOverTime(data._id, index)"></i></span>
                  
                </span>
              </span>
              
            </td>
            <!-- <td class="center aligned" v-show="!this.showOptions">
              <span v-if="data.bankHours">
                <i class="undo link icon"></i>
              </span>
              <span v-else-if="data.extraHours">
                <i class="checkmark box link icon" @click="saveBankHours(data.extraHours, data.employee._id, data._id, index)"></i>
                <i class="remove link icon" @click="undoBankHour(data._id, data.extraHours, index)"></i>
                <i class="money bill alternate outline link icon" @click="payOverTime(data._id, index)"></i>
              </span>

              <i class="clock outline link icon" v-if="data.delay" @click="amendDelay(data._id, data.employee._id, data.delay, index)"></i>
            </td> -->
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
    employee: {
      type: String
    },
    name: {
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
      bankHoursData: [],
      totalBankHours: {
        totalMinutes: null,
        employee: null
      },
      monthlyDelay: {
        totalDelay: 0,
        delayMinutes: null,
        delayHour: null
      },
      monthlyBankHours: {
        totalExtraHours: 0,
        extraHoursInMinutes: null,
        extraHoursInHour: null
      },
      showOptions: !this.detail
    };
  },
  methods: {
    async getHistoricAttendance() {
      var totalBankHoursPromise = this.$http.get(
        `/payrolls/bank-hour/${this.employee}`
      );
      var attendanceHistoricPromise = this.$http.get(
        `/payrolls/attendance-historic/${this.employee}?startDate=${
          this.startDate
        }&endDate=${this.endDate}`
      );

      const [totalBankHours, attendanceHistoric] = await Promise.all([
        totalBankHoursPromise,
        attendanceHistoricPromise
      ]);
      //se pasa los datos del historico de marcacion a bankHoursData
      this.bankHoursData = attendanceHistoric.data;
      //aca verifica el retorno de banco de hora para mostrar en el resumen
      if (totalBankHours.data.length > 0) {
        this.totalBankHours.totalMinutes = totalBankHours.data[0].totalMinutes;
        this.totalBankHours.employee = totalBankHours.data[0].employee;
        this.totalBankHours._id = totalBankHours.data[0]._id;
      }

      //Obtener el total de las Horas extras para desplegar
      if (this.bankHoursData.length > 0) {
        this.bankHoursData.forEach(attEmployee => {
          //total minutos horas extras
          if (attEmployee.extraHours && !attEmployee.payExtraHours) {
            this.monthlyBankHours.totalExtraHours += moment
              .duration(attEmployee.extraHours, "HH:mm")
              .asMinutes();
          }
          //total minutos retrasos
          if (attEmployee.delay) {
            console.log("Retraso", attEmployee.delay);
            this.monthlyDelay.totalDelay += moment
              .duration(attEmployee.delay, "HH:mm")
              .asMinutes();
          }
        });

        var h, m;
        h = Math.floor(this.monthlyBankHours.totalExtraHours / 60);
        m = this.monthlyBankHours.totalExtraHours % 60;
        this.monthlyBankHours.extraHoursInHour = Math.floor(
          this.monthlyBankHours.totalExtraHours / 60
        );
        this.monthlyBankHours.extraHoursInMinutes =
          this.monthlyBankHours.totalExtraHours % 60;
        this.monthlyDelay.delayHour = Math.ceil(
          this.monthlyDelay.totalDelay / 60
        );
        this.monthlyDelay.delayMinutes = this.getMinutes(
          this.monthlyDelay.totalDelay
        );
      }
    },
    getHours(value) {
      return Math.floor(value / 60);
    },
    getMinutes(value) {
      return value % 60;
    },
    amendDelay(attHistoric, index) {
      this.$confirm(
        "Est accion reducira el descuento del banco de horas acumulado por el funcionario",
        "Alerta",
        {
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      ).then(() => {
        if (this.totalBankHours.totalMinutes > 0) {
          var discount = moment
            .duration(attHistoric.delay, "HH:mm")
            .asMinutes();
          var updateAttendance = {};
          var updateBankHours = {};
          //valor de discount sale negativo
          var result = this.totalBankHours.totalMinutes + discount;
          if (result >= 0) {
            updateAttendance.delay = null;
            updateBankHours.totalMinutes = discount;
          } else if (result < 0) {
            result = result * -1;
            var h = Math.floor(result / 60),
              m = result % 60;
            updateAttendance.delay = `-${moment
              .utc()
              .hours(h)
              .minutes(m)
              .format("HH:mm")}`;
            updateBankHours.totalMinutes =
              this.totalBankHours.totalMinutes * -1;
          }
          this.$http
            .put(
              `/attendances/amend-delay/${attHistoric._id}`,
              updateAttendance
            )
            .then(() => {
              this.$http
                .post(
                  `/payrolls/add/bank-hour/${attHistoric.employee._id}`,
                  updateBankHours
                )
                .then(response => {
                  this.totalBankHours.totalMinutes = response.data.totalMinutes;
                  if (attHistoric.extraHours) {
                    attHistoric.delay = null;
                    this.$set(this.bankHoursData, index, attHistoric);
                  } else {
                    this.bankHoursData.splice(index, 1);
                  }
                });
            });
        } else {
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
          .put(`/attendances/cancel-overtime/${attendanceId}`)
          .then(response => {
            console.log(response);
            this.monthlyBankHours.totalExtraHours -= moment
              .duration(value, "HH:mm")
              .asMinutes();
            this.monthlyBankHours.extraHoursInHour = Math.floor(
              this.monthlyBankHours.totalExtraHours / 60
            );
            this.monthlyBankHours.extraHoursInMinutes =
              this.monthlyBankHours.totalExtraHours % 60;

            // this.bankHoursData.splice(index, 1);
            this.$set(this.bankHoursData, index, response.data);
          });
      });
    },
    saveBankHours(attHistoric, index) {
      // data.extraHours, data.employee._id, data._id;
      // value, employee, attendanceId;
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
          newItem.employee = attHistoric.employee._id;
          newItem.totalMinutes = moment
            .duration(attHistoric.extraHours, "HH:mm")
            .asMinutes();
          this.$http
            .post(
              `/payrolls/add/bank-hour/${attHistoric.employee._id}`,
              newItem
            )
            .then(response => {
              this.totalBankHours = response.data;
              //   debugger;
              this.$http
                .put(`attendances/update-banktime/${attHistoric._id}`)
                .then(response => {
                  console.log(response);
                  attHistoric.hourBank = true;
                  this.$set(this.bankHoursData, index, attHistoric);

                  // if (attHistoric.delay) {
                  //   attHistoric.hourBank = true;
                  //   this.$set(this.bankHoursData, index, attHistoric);
                  // } else {
                  //   this.bankHoursData.splice(index, 1);
                  // }
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
            .put(`/attendances/update-overtime/${attendanceId}`)
            .then(response => {
              if (response.data.payExtraHours) {
                let [hour, minutes] = this.convertOverTime(
                  response.data.extraHours
                );
                this.monthlyBankHours.extraHoursInHour -= hour;
                this.monthlyBankHours.extraHoursInMinutes -= minutes;
                this.bankHoursData.splice(index, 1);
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
      this.$router.push({ name: "payrollList" });
    },
    returnDetail() {
      if (this.detail) {
        this.$router.push({
          name: "paymentDetail",
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
          name: "paymentDetail",
          params: {
            enableView: true,
            startDate: this.startDate,
            endDate: this.endDate,
            detail: this.detail
          }
        });
      }
    },
    getRemark(attHistoric) {
      if (!attHistoric.remark && attHistoric.delay) {
        return "Retraso";
      } else if (
        (!attHistoric.remark && attHistoric.extraHours) ||
        (attHistoric.remark === "Compensacion de retraso por banco de hora" &&
          attHistoric.extraHours)
      ) {
        return "Hora extra acumulable";
      }
      return attHistoric.remark;
    }
  },
  created() {
    this.getHistoricAttendance();
  }
};
</script>

<style>
</style>
