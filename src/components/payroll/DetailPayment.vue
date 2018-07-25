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

            <tr v-for="(payment, index) in payrollDetail" :key="payment.employee">
              <td>{{payment.name}}</td>
              <td>{{payment.extraHourMinutes }} Min</td>
              <td>{{payment.delay}} Min</td>
              <td>{{payment.absence}} dias</td>
              <td>{{payment.salary.toLocaleString()}} {{payment.coin}}</td>
              <td>{{returnNegative(payment.ips, payment.coin)}} </td>
              <td>{{returnNegative(payment.salaryAdvance, payment.coin)}} </td>
              <td>{{returnNegative(payment.lending, payment.coin)}}</td>
              <td>{{formatDelay(payment.discount)}} {{payment.coin}}</td>
              <td>{{formatExtraHours(payment.extraHourValue)}} {{payment.coin}}</td>
              <td>{{calculateNetSalary(payment.salary, payment.ips, payment.salaryAdvance, payment.lending, payment.discount, payment.extraHourValue, index)}} {{payment.coin}}</td>
              <td>
                <i class="history link icon" @click="goToBankHourSummary(payment.employee, payment.name)"></i>
                <i class="icons" @click="goToPaymentSummary(payment)">
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
      attendances: [],
      lendingIdentifiers: [],
      //empleados: [],
      lendings: [],
      payrollDetail: [],
      // marcacionesEmpleado: [],
      advances: [],
      loading: true,
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
        netSalary: "Salario Neto"
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
    formatDelay(valor) {
      return Math.round(valor * -1).toLocaleString();
    },
    updatePaymentDetail() {
      this.loading = true;
      this.payrollDetail.length = 0;
      this.getPayrollDetail().then(() => {
        this.loading = false;
      });
    },
    // formatDate(month, year) {
    //   var date = moment()
    //     .set({ year: year, month: month })
    //     .format();
    //   this.fechaInicio = moment(date)
    //     .startOf("month")
    //     .format();
    //   this.fechaFin = moment(date)
    //     .endOf("month")
    //     .format();
    // },
    returnNegative(value, coin) {
      if (value) {
        value = value * -1;
        return value.toLocaleString() + " " + coin;
      }
      return null;
    },
    goToBankHourSummary(employee, name) {
      this.$router.push({
        name: "resumenBancoHora",
        params: {
          id: this.id,
          employee: employee,
          name: name,
          startDate: this.startDate,
          endDate: this.endDate,
          detail: this.detail
        }
      });
    },
    goToPaymentSummary(payment) {
      this.$router.push({
        name: "resumenSalarial",
        params: {
          id: this.id,
          payment: payment,
          startDate: this.startDate,
          endDate: this.endDate,
          detail: this.detail
        }
      });
    },
    formatExtraHours(value) {
      return Math.round(value).toLocaleString();
    },
    // limpiarCampos() {
    //   this.startDate = null;
    //   this.endDate = null;
    //   marcacionesEmpleado.length = 0;
    // },
    calculateNetSalary(
      salary,
      ips,
      salaryAdvance,
      lending,
      discount,
      extraHourValue,
      index
    ) {
      console.log(salary, ips, salaryAdvance, lending, discount);
      console.log(
        typeof salary,
        typeof ips,
        typeof salaryAdvance,
        typeof lending,
        typeof discount
      );
      var netSalary = salary;
      if (ips) {
        netSalary = netSalary - ips;
      }

      if (salaryAdvance) {
        netSalary = netSalary - salaryAdvance;
      }

      if (lending) {
        netSalary = netSalary - lending;
      }

      if (discount) {
        netSalary = netSalary - Math.round(discount);
      }

      if (extraHourValue) {
        netSalary = netSalary + Math.round(extraHourValue);
      }

      this.payrollDetail[index].salaryBalance = netSalary;

      return Math.round(netSalary).toLocaleString();
    },
    returnList() {
      this.$router.push({ name: "listadoSalarios" });
    },
    // getDomingos(fecha) {
    //   moment(fecha).date(1);
    //   var dif = (7 + (0 - moment(fecha).weekday())) % 7 + 1;
    //   console.log("FirstOfMonth: " + moment(fecha).weekday() + ", dif: " + dif);
    //   return Math.floor((moment(fecha).daysInMonth() - dif) / 7) + 1;
    // },
    // getDiasMes(fecha) {
    //   var domingos = this.getDomingos(fecha);
    //   console.log("DOMINGOS" + domingos);
    //   console.log("Fecha" + fecha);
    //   console.log("Dias Mes" + moment(fecha).daysInMonth());
    //   return moment(fecha).daysInMonth() - domingos;
    // },
    getAttendance() {
      this.$http
        .get(
          `/attendances/full-list?startDate=${this.startDate}&endDate=${
            this.endDate
          }`
        )
        .then(response => {
          this.attendances = response.data;
        });
    },
    async getPayrollDetail() {
      const advancePromise = this.$http.get(
        `/advances/monthly-advance?startDate=${this.startDate}&endDate=${
          this.endDate
        }`
      );
      const loanPromise = this.$http.get(
        `/prestamos/loan-period?startDate=${this.startDate}&endDate=${
          this.endDate
        }`
      );
      const attendacePromise = this.$http.get(
        `/attendances/full-list?startDate=${this.startDate}&endDate=${
          this.endDate
        }`
      );

      const [advance, loan, attendance] = await Promise.all([
        advancePromise,
        loanPromise,
        attendacePromise
      ]);
      // console.log(employee.data, event.data, attendance.data);
      // this.empleados = employee.data;
      this.lendings = loan.data;
      this.attendances = attendance.data;
      this.advances = advance.data;

      // debugger;
      this.attendances.forEach(attendance => {
        var index = -1,
          employeeExists;
        //Si ya existen datos en el detalle planilla de salario, va a buscar el indice del empleado coincidente, para luego sumarle los respectivos campos
        if (this.payrollDetail.length > 0) {
          //se guarda el indice del registro si se encuentra el empleado
          index = this.payrollDetail.findIndex(element => {
            // debugger;
            if (element.employee === attendance.employee._id) {
              return true;
            }
            return false;
          });
        }

        console.log("Indice", index);
        //Se asigna el indice encontrado o el valor menos -1 en caso que no se encuentre
        employeeExists = index != -1;
        //Objeto creado para el detalle del resumen Salarial
        var salarySummary = {};

        if (employeeExists) {
          if (attendance.status.absence) {
            this.payrollDetail[index].absence += 1;

            this.payrollDetail[index].discount += Math.round(
              attendance.employee.salary / 26
            );
            salarySummary.date = attendance.date;
            salarySummary.description = attendance.remark;
            salarySummary.amount = Math.round(attendance.employee.salary / 26);
            salarySummary.coin = attendance.employee.coin;
            this.payrollDetail[index].salarySummary.push(salarySummary);
          }

          // if (attendance.status.incompleto) {
          //   this.payrollDetail[index].incompleto += 1;
          // }

          if (attendance.status.vacations) {
            this.payrollDetail[index].daysInVacations += 1;
          }

          if (attendance.extraHours) {
            console.log("HORA EXTRA", attendance.extraHours);
            this.payrollDetail[index].extraHourMinutes += moment
              .duration(attendance.extraHours, "HH:mm")
              .asMinutes();
          }
          if (attendance.payExtraHours) {
            var extraHourValuePerMinute =
              attendance.employee.salaryPerMinute * 1.5;
            this.payrollDetail[index].extraHourValue +=
              moment.duration(attendance.extraHours, "HH:mm").asMinutes() *
              extraHourValuePerMinute;
            salarySummary.date = attendance.date;
            salarySummary.description = attendance.remark;
            salarySummary.amount =
              moment.duration(attendance.extraHours, "HH:mm").asMinutes() *
              extraHourValuePerMinute;
            salarySummary.coin = attendance.employee.coin;
            this.payrollDetail[index].salarySummary.push(salarySummary);
          }
          console.log("Horas Faltantes", attendance.delay);
          if (attendance.delay) {
            this.payrollDetail[index].delay += moment
              .duration(attendance.delay, "HH:mm")
              .asMinutes();

            this.payrollDetail[index].discount -= Math.round(
              moment.duration(attendance.delay, "HH:mm").asMinutes() *
                attendance.employee.salaryPerMinute
            );

            salarySummary.date = attendance.date;
            salarySummary.description = attendance.remark;
            salarySummary.amount = Math.round(
              moment.duration(attendance.delay, "HH:mm").asMinutes() *
                attendance.employee.salaryPerMinute
            );
            salarySummary.coin = attendance.employee.coin;
            this.payrollDetail[index].salarySummary.push(salarySummary);
          }

          if (
            attendance.workedHours &&
            attendance.workedHours.localeCompare("00:00")
          ) {
            this.payrollDetail[index].totalWorkedHours += moment
              .duration(attendance.workedHours, "HH:mm")
              .asMinutes();
            this.payrollDetail[index].totalWorkedDays += 1;
          }
        } else {
          //entra al else, si el detalle es vacio, o sea aun no hay registros.
          var totalPayment = {};
          totalPayment.discount = 0;
          totalPayment.extraHourValue = 0;
          totalPayment.employee = attendance.employee._id;
          totalPayment.salaryBalance = 0;
          totalPayment.salarySummary = [];
          totalPayment.name = attendance.employee.name;
          totalPayment.salary = attendance.employee.salary;
          totalPayment.salaryPerMinute = attendance.employee.salaryPerMinute;
          totalPayment.coin = attendance.employee.coin;

          if (attendance.status.absence) {
            //Dias ausentes
            totalPayment.absence = 1;
            //calculo del descuento por dia ausente
            totalPayment.discount += Math.round(
              attendance.employee.salary / 26
            );
            //datos para el resumen salarial
            salarySummary.date = attendance.date;
            salarySummary.description = attendance.remark;
            salarySummary.amount =
              Math.round(attendance.employee.salary / 26) * -1;
            salarySummary.coin = attendance.employee.coin;
            //array que contendra los datos del detalle de los movimientos del salario
            totalPayment.salarySummary.push(salarySummary);
            salarySummary = {};
          } else {
            totalPayment.absence = 0;
          }

          // if (attendance.status.incompleto) {
          //   totalMes.totalIncompleto = 1;
          // } else {
          //   totalMes.totalIncompleto = 0;
          // }

          if (attendance.status.vacations) {
            totalPayment.daysInVacations = 1;
          } else {
            totalPayment.daysInVacations = 0;
          }

          if (attendance.extraHours) {
            totalPayment.extraHourMinutes = moment
              .duration(attendance.extraHours, "HH:mm")
              .asMinutes();
          } else {
            totalPayment.extraHourMinutes = 0;
          }

          if (attendance.payExtraHours) {
            var extraHourValuePerMinute =
              attendance.employee.salaryPerMinute * 1.5;
            totalPayment.extraHourValue =
              moment.duration(attendance.extraHours, "HH:mm").asMinutes() *
              extraHourValuePerMinute;
            // Datos para el resumen salarial
            salarySummary.date = attendance.date;
            salarySummary.description = attendance.remark;
            salarySummary.amount =
              moment.duration(attendance.extraHours, "HH:mm").asMinutes() *
              extraHourValuePerMinute;
            salarySummary.coin = attendance.employee.coin;
            //array que contiene los movimientos detallados del pago de salario
            totalPayment.salarySummary.push(salarySummary);
            salarySummary = {};
          }

          if (attendance.delay) {
            totalPayment.delay = moment
              .duration(attendance.delay, "HH:mm")
              .asMinutes();
            totalPayment.discount -=
              totalPayment.delay * attendance.employee.salaryPerMinute;
            //Datos para el resumen salarial
            salarySummary.date = attendance.date;
            salarySummary.description = attendance.remark;
            salarySummary.amount =
              moment.duration(attendance.extraHours, "HH:mm").asMinutes() *
              extraHourValuePerMinute;
            salarySummary.coin = attendance.employee.coin;
            //array que contiene los movimientos detallados del pago de salario
            totalPayment.salarySummary.push(salarySummary);
            salarySummary = {};
          } else {
            totalPayment.delay = 0;
          }

          if (
            attendance.workedHours &&
            attendance.workedHours.localeCompare("00:00")
          ) {
            totalPayment.totalWorkedHours = moment
              .duration(attendance.workedHours, "HH:mm")
              .asMinutes();
            totalPayment.totalWorkedDays = 1;
            console.log("Dias Trabajados", totalPayment.totalWorkedDays);
          } else {
            totalPayment.totalWorkedDays = 0;
            totalPayment.totalWorkedHours = 0;
          }

          if (attendance.employee.ips === "salario") {
            totalPayment.ips = Math.round(attendance.employee.salary * 0.09);
            //datos para el resumen salarial
            salarySummary.date = new Date();
            salarySummary.description = "IPS";
            salarySummary.amount =
              Math.round(attendance.employee.salary * 0.09) * -1;
            salarySummary.coin = attendance.employee.coin;
            //array que contiene los datos detallados del pago de salario
            totalPayment.salarySummary.push(salarySummary);
            salarySummary = {};
          }
          // agrupa los adelantos de un funcionario en un nuevo array
          var employeeSalaryAdvances = this.advances.filter(
            advance => advance.employee === attendance.employee._id
          );

          //agrega a resumen salarial los adelantos del funcionario
          employeeSalaryAdvances.forEach(advance => {
            salarySummary.date = advance.date;
            salarySummary.description = "adelanto de salario";
            salarySummary.amount = advance.amount * -1;
            salarySummary.coin = attendance.employee.coin;
            totalPayment.salarySummary.push(salarySummary);
            salarySummary = {};
          });
          //metodo que suma todo el valor de los adelantos que tenga el funcionario
          if (employeeSalaryAdvances.length > 0) {
            totalPayment.salaryAdvance = employeeSalaryAdvances.reduce(function(
              value,
              advance
            ) {
              return value + advance.amount;
            },
            0);
          } else {
            totalPayment.salaryAdvance = null;
          }
          // debugger;
          this.lendings.find(lending => {
            if (lending.employee === attendance.employee._id) {
              lending.installments.forEach(fee => {
                if (
                  moment(fee.dueDate).isBetween(
                    this.startDate,
                    this.endDate,
                    null,
                    []
                  ) &&
                  fee.state === "pendiente"
                ) {
                  salarySummary.date = fee.dueDate;
                  salarySummary.description = "prestamo";
                  salarySummary.amount = fee.amount * -1;
                  salarySummary.coin = attendance.employee.coin;
                  totalPayment.salarySummary.push(salarySummary);
                  salarySummary = {};
                  console.log("Valor prestamo", fee.amount);
                  totalPayment.lending = fee.amount;
                  this.lendingIdentifiers.push(fee._id);
                }
              });
            }
          });

          this.payrollDetail.push(totalPayment);
          // totalMes.totalMes =
          //   this.getDiasMes() - this.getFeriados() - totalMes.totalVacaciones;
        }
      });
      //Ordena el detalle de pago de salario por orden alfabetico del nombre.
      this.payrollDetail.sort((a, b) => {
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
                this.payrollDetail
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
      this.$http.get(`/employees/full-list`).then(response => {
        this.employees = response.data;
      });
    },
    getEvents() {
      this.$http
        .get(
          `/eventos/full-list?startDate=${this.startDate}&endDate=${
            this.endDate
          }`
        )
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
        this.payrollDetail = response.data.salaryDetail;
        this.loading = false;
      });
    } else {
      this.getPayrollDetail().then(() => {
        this.loading = false;
      });
    }

    // this.$http.get(`/salarios/salary-detail/${id}`).then(response => {
    //   this.payrollDetail = response.data.salaryDetail;
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
