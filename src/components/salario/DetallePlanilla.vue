<template>
  <div class="ui thirteen wide column">

    <div class="ui form">
      <div class="field">
        <div class="ui breadcrumb">
          <a class="section" @click="returnList">Listado de Planillas de Salario</a>
          <i class="right angle icon divider"></i>
          <div class=" active section">Detalle de Planilla</div>

        </div>
      </div>

      <h4 class="ui dividing header">
        Detalle de la Planilla de Salarios
      </h4>
      <div class="two fields">
        <div class="ui twelve wide field">
          <div class="ui mini steps">
            <div class="step">
              <i class="calendar alternate outline icon"></i>
              <div class="content">
                <div class="title">{{moment(this.startDate).format("DD/MM/YYYY")}}</div>
              </div>
            </div>
            <div class="step">
              <i class="calendar alternate outline icon"></i>
              <div class="content">
                <div class="title">{{moment(this.endDate).format("DD/MM/YYYY")}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="ui four wide field" v-show="enableView">

          <div class="ui right floated main menu">
            <a class="icon item">
              <i class="user plus icon"></i>
            </a>

            <a class="icon item">
              <i class="save icon" @click="saveSalaryResume(id)"></i>
            </a>

            <a class="icon item" @click="this.updatePaymentDetail">
              <i class="refresh icon"></i>
            </a>

            <a class="icon item">
              <i class="print icon"></i>
            </a>

          </div>

        </div>

      </div>

      <div class="field">

        <table class="ui teal celled table">
          <thead>
            <tr>
              <th>Funcionario</th>
              <th>Hs. Extras</th>
              <th>Retrasos</th>
              <th>Ausencias</th>
              <th>Salario Base</th>
              <th>IPS</th>
              <th>Adelantos</th>
              <th>Prestamos</th>
              <th>Descuentos Ausencias + Retrasos</th>
              <th>Hs. Extras</th>
              <th>Salario Neto</th>
              <th>Opciones</th>

            </tr>
          </thead>

          <tbody>

            <tr v-for="(resultado, index) in resultadoTotal" :key="resultado.employee">
              <td>{{resultado.name}}</td>
              <td>{{resultado.extraHourMinutes }} Min</td>
              <td>{{resultado.delay}} Min</td>
              <td>{{resultado.absence}} dias</td>
              <td>{{resultado.salary.toLocaleString()}} {{resultado.coin}}</td>
              <td>{{returnNegative(resultado.ips, resultado.coin)}} </td>
              <td>{{returnNegative(resultado.salaryAdvance, resultado.coin)}} </td>
              <td>{{returnNegative(resultado.lending, resultado.coin)}}</td>
              <td>{{formatRetrasos(resultado.discount)}} {{resultado.coin}}</td>
              <td>{{formatHoraExtra(resultado.extraHourValue)}} {{resultado.coin}}</td>
              <td>{{calcularSalarioNeto(resultado.salary, resultado.ips, resultado.salaryAdvance, resultado.lending, resultado.discount, resultado.extraHourValue, index)}} {{resultado.coin}}</td>
              <td>
                <i class="history link icon" @click="goToResumenHora(resultado.employee, resultado.name)"></i>
                <i class="icons" @click="goToResumenSalarial(resultado)">
                  <i class="file outline link icon"></i>
                  <i class="bottom left corner dollar sign icon"></i>
                </i>
              </td>

            </tr>

          </tbody>
        </table>
        <div v-show="loading" class="ui segment large">
          <div class="ui active inverted dimmer">
            <div class="ui large text loader">Loading</div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>
<script>
import moment from "moment";
import axios from "axios";
import { url } from "./../.././config/backend";

export default {
  props: {
    id: {
      type: String
    },
    enableView: {
      type: Boolean
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
      // fechaInicio: null,
      // fechaFin: null,
      feriados: [],
      marcaciones: [],
      lendingIdentifiers: [],
      empleados: [],
      prestamos: [],
      resultadoTotal: [],
      diasTrabajados: null,
      marcacionesEmpleado: [],
      adelantos: [],
      loading: true,
      sucursales: [],
      feriadoSucursal: [],
      json_fields: {
        nombre: "Funcionario",
        hmformat: "Carga Laboral ",
        horasMes: "Carga laboral en minutos",
        htformat: "Horas Trabajadas",
        horasTrabajadas: "Horas Trabajadas en minutos",
        heformat: "Horas Extras",
        salarioBase: "Salario base",
        moneda: "Moneda",
        valorHoraExtra: "Valor Hora extra",
        valorAusencias: "Valor Ausencias",
        salarioNeto: "Salario Neto"
      },
      json_data: [],
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8"
          }
        ]
      ]
    };
  },
  methods: {
    formatRetrasos(valor) {
      return Math.round(valor * -1).toLocaleString();
    },
    updatePaymentDetail() {
      this.loading = true;
      this.resultadoTotal.length = 0;
      this.getResumen().then(() => {
        this.loading = false;
      });
    },
    formatDate(month, year) {
      var date = moment()
        .set({ year: year, month: month })
        .format();
      this.fechaInicio = moment(date)
        .startOf("month")
        .format();
      this.fechaFin = moment(date)
        .endOf("month")
        .format();
    },
    returnNegative(value, coin) {
      if (value) {
        value = value * -1;
        return value.toLocaleString() + " " + coin;
      }
      return null;
    },
    goToResumenHora(funcionario, name) {
      this.$router.push({
        name: "resumenBancoHora",
        params: {
          id: this.id,
          funcionario: funcionario,
          nombre: name,
          startDate: this.startDate,
          endDate: this.endDate,
          detail: this.detail
        }
      });
    },
    goToResumenSalarial(resultado) {
      this.$router.push({
        name: "resumenSalarial",
        params: {
          id: this.id,
          resumenSalarial: resultado,
          startDate: this.startDate,
          endDate: this.endDate,
          detail: this.detail
        }
      });
    },
    formatHoraExtra(value) {
      return Math.round(value).toLocaleString();
    },
    limpiarCampos() {
      this.startDate = null;
      this.endDate = null;
      marcacionesEmpleado.length = 0;
    },
    calcularSalarioNeto(
      salary,
      ips,
      salaryAdvance,
      prestamo,
      discount,
      extraHourValue,
      index
    ) {
      console.log(salary, ips, salaryAdvance, prestamo, discount);
      console.log(
        typeof salary,
        typeof ips,
        typeof salaryAdvance,
        typeof prestamo,
        typeof discount
      );
      var salarioNeto = salary;
      if (ips) {
        salarioNeto = salarioNeto - ips;
      }

      if (salaryAdvance) {
        salarioNeto = salarioNeto - salaryAdvance;
      }

      if (prestamo) {
        salarioNeto = salarioNeto - prestamo;
      }

      if (discount) {
        salarioNeto = salarioNeto - Math.round(discount);
      }

      if (extraHourValue) {
        salarioNeto = salarioNeto + Math.round(extraHourValue);
      }

      this.resultadoTotal[index].salaryBalance = salarioNeto;

      return Math.round(salarioNeto).toLocaleString();
    },
    returnList() {
      this.$router.push({ name: "listadoSalarios" });
    },
    getDomingos(fecha) {
      moment(fecha).date(1);
      var dif = (7 + (0 - moment(fecha).weekday())) % 7 + 1;
      console.log("FirstOfMonth: " + moment(fecha).weekday() + ", dif: " + dif);
      return Math.floor((moment(fecha).daysInMonth() - dif) / 7) + 1;
    },
    getDiasMes(fecha) {
      var domingos = this.getDomingos(fecha);
      console.log("DOMINGOS" + domingos);
      console.log("Fecha" + fecha);
      console.log("Dias Mes" + moment(fecha).daysInMonth());
      return moment(fecha).daysInMonth() - domingos;
    },
    getAttendance() {
      this.$http
        .get(
          `/asistencias/full-list?inicio=${this.startDate}&fin=${this.endDate}`
        )
        .then(response => {
          this.marcaciones = response.data;
        });
    },
    async getResumen() {
      const advancePromise = this.$http.get(
        `/adelantos/monthly-advance?inicio=${this.startDate}&fin=${
          this.endDate
        }`
      );
      const loanPromise = this.$http.get(
        `/prestamos/loan-period?inicio=${this.startDate}&fin=${this.endDate}`
      );
      const attendacePromise = this.$http.get(
        `/asistencias/full-list?inicio=${this.startDate}&fin=${this.endDate}`
      );

      const [advance, loan, attendance] = await Promise.all([
        advancePromise,
        loanPromise,
        attendacePromise
      ]);
      // console.log(employee.data, event.data, attendance.data);
      // this.empleados = employee.data;
      this.prestamos = loan.data;
      this.marcaciones = attendance.data;
      this.adelantos = advance.data;

      // debugger;
      this.marcaciones.forEach(marcacion => {
        var index = -1,
          funcionarioExists;
        if (this.resultadoTotal.length > 0) {
          index = this.resultadoTotal.findIndex(element => {
            // debugger;
            if (element.employee === marcacion.funcionario._id) {
              return true;
            }
            return false;
          });
        }

        console.log("Indice", index);
        funcionarioExists = index != -1;
        var summary = {};

        if (funcionarioExists) {
          if (marcacion.estilo.ausente) {
            this.resultadoTotal[index].absence += 1;

            this.resultadoTotal[index].discount += Math.round(
              marcacion.funcionario.salario / 26
            );
            summary.date = marcacion.fecha;
            summary.description = marcacion.observacion;
            summary.amount = Math.round(marcacion.funcionario.salario / 26);
            summary.coin = marcacion.funcionario.moneda;
            this.resultadoTotal[index].salarySummary.push(summary);
          }

          // if (marcacion.estilo.incompleto) {
          //   this.resultadoTotal[index].incompleto += 1;
          // }

          if (marcacion.estilo.vacaciones) {
            this.resultadoTotal[index].totalVacaciones += 1;
          }

          if (marcacion.horasExtras) {
            console.log("HORA EXTRA", marcacion.horasExtras);
            this.resultadoTotal[index].extraHourMinutes += moment
              .duration(marcacion.horasExtras, "HH:mm")
              .asMinutes();
          }
          if (marcacion.pagoHoraExtra) {
            var horaExtra = marcacion.funcionario.salarioMinuto * 1.5;
            this.resultadoTotal[index].extraHourValue +=
              moment.duration(marcacion.horasExtras, "HH:mm").asMinutes() *
              horaExtra;
            summary.date = marcacion.fecha;
            summary.description = marcacion.observacion;
            summary.amount =
              moment.duration(marcacion.horasExtras, "HH:mm").asMinutes() *
              horaExtra;
            summary.coin = marcacion.funcionario.moneda;
            this.resultadoTotal[index].salarySummary.push(summary);
          }
          console.log("Horas Faltantes", marcacion.horasFaltantes);
          if (marcacion.horasFaltantes) {
            this.resultadoTotal[index].delay += moment
              .duration(marcacion.horasFaltantes, "HH:mm")
              .asMinutes();

            this.resultadoTotal[index].discount -= Math.round(
              moment.duration(marcacion.horasFaltantes, "HH:mm").asMinutes() *
                marcacion.funcionario.salarioMinuto
            );

            summary.date = marcacion.fecha;
            summary.description = marcacion.observacion;
            summary.amount = Math.round(
              moment.duration(marcacion.horasFaltantes, "HH:mm").asMinutes() *
                marcacion.funcionario.salarioMinuto
            );
            summary.coin = marcacion.funcionario.moneda;
            this.resultadoTotal[index].salarySummary.push(summary);
          }

          if (
            marcacion.horasTrabajadas &&
            marcacion.horasTrabajadas.localeCompare("00:00")
          ) {
            this.resultadoTotal[index].totalTrabajado += moment
              .duration(marcacion.horasTrabajadas, "HH:mm")
              .asMinutes();
            this.resultadoTotal[index].totalDiasTrabajados += 1;
          }
        } else {
          var totalMes = {};
          totalMes.discount = 0;
          totalMes.extraHourValue = 0;
          totalMes.employee = marcacion.funcionario._id;
          totalMes.salaryBalance = 0;
          totalMes.salarySummary = [];
          totalMes.name = marcacion.funcionario.nombre;
          totalMes.salary = marcacion.funcionario.salario;
          totalMes.salarioMinuto = marcacion.funcionario.salarioMinuto;
          totalMes.coin = marcacion.funcionario.moneda;

          if (marcacion.estilo.ausente) {
            totalMes.absence = 1;

            totalMes.discount += Math.round(marcacion.funcionario.salario / 26);
            summary.date = marcacion.fecha;
            summary.description = marcacion.observacion;
            summary.amount =
              Math.round(marcacion.funcionario.salario / 26) * -1;
            summary.coin = marcacion.funcionario.moneda;
            totalMes.salarySummary.push(summary);
            summary = {};
          } else {
            totalMes.absence = 0;
          }

          // if (marcacion.estilo.incompleto) {
          //   totalMes.totalIncompleto = 1;
          // } else {
          //   totalMes.totalIncompleto = 0;
          // }

          if (marcacion.estilo.vacaciones) {
            totalMes.totalVacaciones = 1;
          } else {
            totalMes.totalVacaciones = 0;
          }

          if (marcacion.horasExtras) {
            totalMes.extraHourMinutes = moment
              .duration(marcacion.horasExtras, "HH:mm")
              .asMinutes();
          } else {
            totalMes.extraHourMinutes = 0;
          }

          if (marcacion.pagoHoraExtra) {
            var horaExtra = marcacion.funcionario.salarioMinuto * 1.5;
            totalMes.extraHourValue =
              moment.duration(marcacion.horasExtras, "HH:mm").asMinutes() *
              horaExtra;
            summary.date = marcacion.fecha;
            summary.description = marcacion.observacion;
            summary.amount =
              moment.duration(marcacion.horasExtras, "HH:mm").asMinutes() *
              horaExtra;
            summary.coin = marcacion.funcionario.moneda;
            totalMes.salarySummary.push(summary);
            summary = {};
          }

          if (marcacion.horasFaltantes) {
            totalMes.delay = moment
              .duration(marcacion.horasFaltantes, "HH:mm")
              .asMinutes();
            totalMes.discount -=
              totalMes.delay * marcacion.funcionario.salarioMinuto;
            summary.date = marcacion.fecha;
            summary.description = marcacion.observacion;
            summary.amount =
              moment.duration(marcacion.horasExtras, "HH:mm").asMinutes() *
              horaExtra;
            summary.coin = marcacion.funcionario.moneda;
            totalMes.salarySummary.push(summary);
            summary = {};
          } else {
            totalMes.delay = 0;
          }

          if (
            marcacion.horasTrabajadas &&
            marcacion.horasTrabajadas.localeCompare("00:00")
          ) {
            totalMes.totalTrabajado = moment
              .duration(marcacion.horasTrabajadas, "HH:mm")
              .asMinutes();
            totalMes.totalDiasTrabajados = 1;
            console.log("Dias Trabajados", totalMes.totalDiasTrabajados);
          } else {
            totalMes.totalDiasTrabajados = 0;
            totalMes.totalTrabajado = 0;
          }

          if (marcacion.funcionario.ips === "salario") {
            totalMes.ips = Math.round(marcacion.funcionario.salario * 0.09);
            summary.date = new Date();
            summary.description = "IPS";
            summary.amount =
              Math.round(marcacion.funcionario.salario * 0.09) * -1;
            summary.coin = marcacion.funcionario.moneda;
            totalMes.salarySummary.push(summary);
            summary = {};
          }
          // agrupa los adelantos de un funcionario
          var adelantoFunc = this.adelantos.filter(
            adelanto => adelanto.funcionario === marcacion.funcionario._id
          );

          //agrega a resumen salarial los adelantos del funcionario
          adelantoFunc.forEach(adelanto => {
            summary.date = adelanto.fecha;
            summary.description = "adelanto de salario";
            summary.amount = adelanto.monto * -1;
            summary.coin = marcacion.funcionario.moneda;
            totalMes.salarySummary.push(summary);
            summary = {};
          });

          if (adelantoFunc.length > 0) {
            totalMes.salaryAdvance = adelantoFunc.reduce(function(
              valor,
              adelanto
            ) {
              return valor + adelanto.monto;
            },
            0);
          } else {
            totalMes.salaryAdvance = null;
          }
          // debugger;
          this.prestamos.find(prestamo => {
            if (prestamo.funcionario === marcacion.funcionario._id) {
              prestamo.cuotas.forEach(cuota => {
                if (
                  moment(cuota.vencimiento).isBetween(
                    this.startDate,
                    this.endDate,
                    null,
                    []
                  ) &&
                  cuota.estado === "pendiente"
                ) {
                  summary.date = cuota.vencimiento;
                  summary.description = "prestamo";
                  summary.amount = cuota.monto * -1;
                  summary.coin = marcacion.funcionario.moneda;
                  totalMes.salarySummary.push(summary);
                  summary = {};
                  console.log("Valor prestamo", cuota.monto);
                  totalMes.lending = cuota.monto;
                  this.lendingIdentifiers.push(cuota._id);
                }
              });
            }
          });

          this.resultadoTotal.push(totalMes);
          // totalMes.totalMes =
          //   this.getDiasMes() - this.getFeriados() - totalMes.totalVacaciones;
        }
      });
      this.resultadoTotal.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    },
    saveSalaryResume(idSalaryResume) {
      this.$confirm("Esta seguro que desea guardar los datos", "Alerta", {
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        type: "warning"
      }).then(() => {
        this.$http
          .put(`/prestamos/update/lending/processed`, this.lendingIdentifiers)
          .then(response => {
            console.log(response);
            this.$http
              .put(
                `/salarios/update/salary-detail/${idSalaryResume}`,
                this.resultadoTotal
              )
              .then(() => {
                this.$message({
                  type: "success",
                  message: "Resumen de Salario Guardado"
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "Proceso cancelado"
            });
          });
      });
    },
    getEmployees() {
      this.$http.get(`/funcionarios/full-list`).then(response => {
        this.funcionarios = response.data;
      });
    },
    getEvents() {
      this.$http
        .get(`/eventos/full-list?inicio=${this.startDate}&fin=${this.endDate}`)
        .then(response => {
          this.eventos = response.data;
        });
    }
  },
  created() {
    this.loading = true;
    //this.formatDate(this.monthPayment, this.yearPayment);
    if (this.detail) {
      this.$http.get(`/salarios/salary-detail/${this.id}`).then(response => {
        this.resultadoTotal = response.data.salaryDetail;
        this.loading = false;
      });
    } else {
      this.getResumen().then(() => {
        this.loading = false;
      });
    }

    // this.$http.get(`/salarios/salary-detail/${id}`).then(response => {
    //   this.resultadoTotal = response.data.salaryDetail;
    // });
  }
};
</script>

<style>
.test {
  margin-top: 2em;
}
.ui.segment.large {
  height: 400px;
}
</style>
