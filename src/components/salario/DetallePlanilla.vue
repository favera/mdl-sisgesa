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
      <div class="two fields" v-show="enableView">
        <div class="ui twelve wide field">
          <label for="salaryQuery">Introducir rango de fechas:</label>
          <div class="inline fields">

            <div class="field">
              <el-date-picker v-model="startDate" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
              </el-date-picker>
            </div>

            <div class="field">
              <el-date-picker v-model="endDate" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
              </el-date-picker>
            </div>

            <div class="field" v-show="startDate != null">
              <i class="large circle remove link grey icon"></i>
            </div>

            <!-- <div class="field">
              <div class="ui vertical teal button" @click="calcularSalario(startDate, endDate)">
                Generar Salario
              </div>
            </div>
            <div class="field">
              <button class="ui button" @click="limpiarCampos()">Limpiar</button>

            </div> -->

          </div>

        </div>

        <div class="ui four wide field">

          <div class="ui right floated main menu">
            <a class="icon item">
              <i class="icons">
                <i class="file icon" @click="getResumen"></i>
                <i class="bottom left corner inverted refresh icon"></i>
              </i>
              <!-- <i class="file outline icon"></i> -->
            </a>

            <a class="icon item">
              <i class="save icon" @click="saveSalaryResume(id)"></i>
            </a>

            <a class="icon item">
              <i class="refresh icon"></i>
            </a>

            <a class="icon item" v-show="true">
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
              <th>Banco de Hs</th>
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
              <td>{{resultado.abscence}} dias</td>
              <td>{{resultado.salary}} {{resultado.coin}}</td>
              <td>{{returnNegative(resultado.ips, resultado.coin)}} </td>
              <td>{{returnNegative(resultado.salaryAdvance, resultado.coin)}} </td>
              <td>{{returnNegative(resultado.lending, resultado.coin)}}</td>
              <td>{{formatRetrasos(resultado.discount)}} {{resultado.coin}}</td>
              <td>{{formatHoraExtra(resultado.extraHourValue)}} {{resultado.coin}}</td>
              <td>{{calcularSalarioNeto(resultado.salary, resultado.ips, resultado.salaryAdvance, resultado.lending, resultado.discount, resultado.extraHourValue, index)}} {{resultado.coin}}</td>
              <td>
                <i class="history link icon" @click="goToResumenHora(resultado.employee, resultado.name)"></i>
                <i class="icons" @click="goToResumenSalarial()">
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
          funcionario: funcionario,
          nombre: name,
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
    },
    goToResumenSalarial(funcionario, name) {
      this.$router.push({
        name: "resumenSalarial"
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
      var salarioNeto = parseInt(salary.split(".").join(""));
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

        if (funcionarioExists) {
          if (marcacion.estilo.ausente) {
            this.resultadoTotal[index].abscence += 1;
            console.log(
              "Desde Array antes de la suma",
              this.resultadoTotal[index].discount
            );
            this.resultadoTotal[index].discount += Math.round(
              parseInt(marcacion.funcionario.salario.split(".").join("")) / 26
            );
            console.log(
              "Pos Array pos suma",
              this.resultadoTotal[index].discount
            );
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
          }
          console.log("Horas Faltantes", marcacion.horasFaltantes);
          if (marcacion.horasFaltantes) {
            this.resultadoTotal[index].delay += moment
              .duration(marcacion.horasFaltantes, "HH:mm")
              .asMinutes();
            console.log(
              "Descuentos pre horas faltantes",
              this.resultadoTotal[index].discount
            );
            this.resultadoTotal[index].discount -=
              moment.duration(marcacion.horasFaltantes, "HH:mm").asMinutes() *
              marcacion.funcionario.salarioMinuto;
            console.log(
              "Descuentos pos horas Faltantes",
              this.resultadoTotal[index].discount
            );
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

          if (marcacion.estilo.ausente) {
            totalMes.abscence = 1;

            totalMes.discount += Math.round(
              parseInt(marcacion.funcionario.salario.split(".").join("")) / 26
            );
          } else {
            totalMes.abscence = 0;
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
          }

          if (marcacion.horasFaltantes) {
            totalMes.delay = moment
              .duration(marcacion.horasFaltantes, "HH:mm")
              .asMinutes();
            totalMes.discount -=
              totalMes.delay * marcacion.funcionario.salarioMinuto;
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

          totalMes.name = marcacion.funcionario.nombre;
          totalMes.salary = marcacion.funcionario.salario;
          totalMes.salarioMinuto = marcacion.funcionario.salarioMinuto;
          totalMes.coin = marcacion.funcionario.moneda;

          if (marcacion.funcionario.ips === "salario") {
            totalMes.ips = Math.round(
              parseInt(marcacion.funcionario.salario.split(".").join("")) * 0.09
            );
          }

          var adelantoFunc = this.adelantos.filter(
            adelanto => adelanto.funcionario === marcacion.funcionario._id
          );

          if (adelantoFunc.length > 0) {
            totalMes.salaryAdvance = adelantoFunc.reduce(function(
              valor,
              adelanto
            ) {
              return valor + parseInt(adelanto.monto.split(".").join(""));
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
                  console.log("Valor prestamo", cuota.monto);
                  totalMes.lending = parseInt(cuota.monto.split(".").join(""));
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
      })
        .then(() => {
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
    },
    //Hacer un arrayfilter funcionario donde sera un array de los datos de un solo funcionario
    //del array resultante sumar horas trabajadas, sumar horas extras, calcular descuento u hora extra
    //calcular horas mes segun idsucursal
    calcularSalario(startDate, endDate, horasMes) {
      horasMes = this.getDiasMes(startDate);
      console.log(" Dias MES" + horasMes);
      startDate = moment(startDate, "DD/MM/YYYY").format("L");
      endDate = moment(endDate, "DD/MM/YYYY").format("L");
      console.log("FECHAS" + startDate, endDate);
      console.log("DIAS " + horasMes);
      this.getData(startDate, endDate, horasMes);
    },

    async getData(startDate, endDate, horasMes) {
      this.loading = true;
      try {
        const getMarcaciones = await axios.get(
          url +
            "/marcaciones?fecha_gte=" +
            startDate +
            "&fecha_lte=" +
            endDate +
            "&_expand=empleado"
        );

        const getEmpleados = await axios.get(url + "/empleados");

        console.log("getMarcaciones" + getMarcaciones.data);

        const [marcaciones, empleados] = await Promise.all([
          getMarcaciones,
          getEmpleados
        ]);

        for (let item of empleados.data) {
          console.log("Entro HIHI" + item.id);
          this.empleados.push(item.id);
        }

        //this.empleados = empleados.data;
        this.marcaciones = marcaciones.data;

        //console.log("Empleados" + JSON.stringify(this.empleados));
        //console.log("Marcaciones" + JSON.stringify(this.marcaciones));
      } catch (error) {}

      var resultado = [];
      for (let id of this.empleados) {
        console.log("Entro en el for");
        var empleado = this.marcaciones.filter(function(element) {
          if (element.empleadoId === id) {
            console.log("ENTRO en el filter " + element);
            return element;
          }
        });

        resultado.push(empleado);
      }

      console.log("ARRAY RESULTADO" + JSON.stringify(resultado));

      if (resultado.length > 0) {
        for (var i = 0; i < resultado.length; i++) {
          var value = resultado[i];
          var diasTrabajados = value.length;
          console.log("Dias Trabajados" + diasTrabajados);
          console.log("Value" + JSON.stringify(resultado[i]));

          var marcacionEmpleado = {
            nombre: null,
            horasMes: null,
            hmformat: null,
            horasTrabajadas: null,
            htformat: null,
            horasExtras: null,
            heformat: null,
            horasExtraAlternativa: null,
            salarioBase: null,
            moneda: null,
            valorHoraExtra: null,
            salarioNeto: null,
            salarioNetoAlternativo: null,
            valorHoraExtraAlternativa: null,
            horasExtrasNocturnas: null,
            valorAusencias: null
          };
          if (value.length > 0) {
            for (let element of value) {
              marcacionEmpleado.horasTrabajadas =
                marcacionEmpleado.horasTrabajadas +
                moment.duration(element.horasTrabajadas, "HH:mm").asMinutes();
              marcacionEmpleado.horasExtras =
                marcacionEmpleado.horasExtras +
                moment.duration(element.horasExtras, "HH:mm").asMinutes();

              if (moment.duration(element.salida, "HH:mm").asMinutes() > 1200) {
                marcacionEmpleado.horasExtrasNocturnas =
                  moment.duration(
                    moment.duration(element.salida, "HH:mm").asMinutes()
                  ) - 1200;

                console.log(
                  "Hora Extra Noctura" + marcacionEmpleado.horasExtrasNocturnas
                );
              }
            }
            //copiar hanlde para minutos para mostrar en el informe,
            //caclcular total laboral mes
            marcacionEmpleado.nombre = value[0].empleado.nombre;
            console.log("Nombre:" + marcacionEmpleado.nombre);
            marcacionEmpleado.salarioBase = value[0].empleado.salario;
            marcacionEmpleado.moneda = value[0].empleado.moneda;
            marcacionEmpleado.horasMes = horasMes * 570;

            marcacionEmpleado.horasExtraAlternativa =
              marcacionEmpleado.horasTrabajadas - marcacionEmpleado.horasMes;
            console.log(
              "HORA EXTRA ALTERNATIVA" + marcacionEmpleado.horasExtraAlternativa
            );
            marcacionEmpleado.valorHoraExtraAlternativa =
              marcacionEmpleado.horasExtraAlternativa *
              value[0].empleado.salarioMinuto;

            if (marcacionEmpleado.valorHoraExtraAlternativa < 0) {
              marcacionEmpleado.valorHoraExtraAlternativa =
                marcacionEmpleado.valorHoraExtraAlternativa * 2;
            }

            marcacionEmpleado.salarioNetoAlternativo = Math.round(
              parseInt(marcacionEmpleado.salarioBase.split(".").join("")) +
                marcacionEmpleado.valorHoraExtraAlternativa
            ).toLocaleString();

            // var minutosHA = Math.floor(
            //   (moment
            //     .duration(marcacionEmpleado.horasExtraAlternativa, "minutes")
            //     .asHours() %
            //     1) *
            //     60
            // );

            // var horasHA =
            //   moment
            //     .duration(marcacionEmpleado.horasExtraAlternativa, "minutes")
            //     .asHours() -
            //   moment
            //     .duration(marcacionEmpleado.horasExtraAlternativa, "minutes")
            //     .asHours() %
            //     1;

            // if (minutosHA > 0 && horasHA > 0) {
            //   marcacionEmpleado.heformat =
            //     horasHA + " Horas " + minutosHA + " Minutos";
            // } else {
            //   if (minutos < 0 && horas < 0) {
            //     minutosHA = minutosHA * -1;
            //     marcacionEmpleado.heformat =
            //       horasHA + " Horas " + minutosHA + " Minutos";
            //   } else {
            //     if (horasHA !== 0 && minutosHA === 0) {
            //       marcacionEmpleado.heformat = horasHA + " Horas";
            //     } else {
            //       marcacionEmpleado.heformat = minutosHA + " Minutos";
            //     }
            //   }
            // }

            marcacionEmpleado.valorHoraExtraAlternativa = Math.floor(
              marcacionEmpleado.valorHoraExtraAlternativa
            ).toLocaleString();

            //##############################

            marcacionEmpleado.valorHoraExtra =
              marcacionEmpleado.horasExtras * value[0].empleado.salarioMinuto;

            if (marcacionEmpleado.valorHoraExtra < 0) {
              marcacionEmpleado.valorHoraExtra =
                marcacionEmpleado.valorHoraExtra * 1;
            } else {
              marcacionEmpleado.valorHoraExtra =
                marcacionEmpleado.valorHoraExtra +
                marcacionEmpleado.valorHoraExtra / 2;
            }

            marcacionEmpleado.valorAusencias = Math.floor(
              (diasTrabajados - horasMes) *
                480 *
                value[0].empleado.salarioMinuto
            );

            var compensacion = Math.floor(
              value[0].empleado.salarioMinuto * 60 * 8 * (30 - horasMes)
            );

            if (marcacionEmpleado.valorAusencias < 0) {
              console.log(
                "SALARIO BASE" +
                  parseInt(marcacionEmpleado.salarioBase.split(".").join(""))
              );
              console.log(
                "VALOR HORA EXTRA" + marcacionEmpleado.valorHoraExtra
              );
              console.log(
                "VALOR AUSENCIAS " + marcacionEmpleado.valorAusencias
              );

              console.log("VALOR COMPENSACION" + compensacion);

              marcacionEmpleado.salarioNeto = Math.floor(
                parseInt(marcacionEmpleado.salarioBase.split(".").join("")) +
                  marcacionEmpleado.valorHoraExtra +
                  marcacionEmpleado.valorAusencias -
                  compensacion
              ).toLocaleString();
            } else {
              marcacionEmpleado.valorAusencias = 0;
              marcacionEmpleado.salarioNeto = Math.floor(
                parseInt(marcacionEmpleado.salarioBase.split(".").join("")) +
                  marcacionEmpleado.valorHoraExtra
              ).toLocaleString();
            }

            marcacionEmpleado.valorHoraExtra = Math.floor(
              marcacionEmpleado.valorHoraExtra
            ).toLocaleString();

            var minutos = Math.floor(
              (moment
                .duration(marcacionEmpleado.horasExtras, "minutes")
                .asHours() %
                1) *
                60
            );

            var horas =
              moment
                .duration(marcacionEmpleado.horasExtras, "minutes")
                .asHours() -
              moment
                .duration(marcacionEmpleado.horasExtras, "minutes")
                .asHours() %
                1;

            if (minutos > 0 && horas > 0) {
              marcacionEmpleado.heformat =
                horas + " Horas " + minutos + " Minutos";
            } else {
              if (minutos < 0 && horas < 0) {
                minutos = minutos * -1;
                marcacionEmpleado.heformat =
                  horas + " Horas " + minutos + " Minutos";
              } else {
                if (horas !== 0 && minutos === 0) {
                  marcacionEmpleado.heformat = horas + " Horas";
                } else {
                  marcacionEmpleado.heformat = minutos + " Minutos";
                }
              }
            }

            var minuto = Math.ceil(
              (moment
                .duration(marcacionEmpleado.horasTrabajadas, "minutes")
                .asHours() %
                1) *
                60
            );

            var hora =
              moment
                .duration(marcacionEmpleado.horasTrabajadas, "minutes")
                .asHours() -
              moment
                .duration(marcacionEmpleado.horasTrabajadas, "minutes")
                .asHours() %
                1;

            marcacionEmpleado.htformat = hora + " Horas " + minuto + " minutos";

            var minuto1 = Math.floor(
              (moment
                .duration(marcacionEmpleado.horasMes, "minutes")
                .asHours() %
                1) *
                60
            );

            var hora1 =
              moment.duration(marcacionEmpleado.horasMes, "minutes").asHours() -
              moment.duration(marcacionEmpleado.horasMes, "minutes").asHours() %
                1;

            if (minuto1 > 0) {
              marcacionEmpleado.hmformat =
                hora1 + " Horas " + minuto1 + " Minutos ";
            } else {
              marcacionEmpleado.hmformat = hora1 + " Horas ";
            }

            console.log(
              "RESULTADO POR EMPLEADO" + JSON.stringify(marcacionEmpleado)
            );
            this.marcacionesEmpleado.push(marcacionEmpleado);
            this.json_data.push(marcacionEmpleado);
          }
        }
        this.loading = false;
      }

      console.log(
        JSON.stringify("RESULTADO FINAL" + JSON.stringify(marcacionEmpleado))
      );
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
  },
  mounted() {
    // axios.get(url + "/feriados").then(response => {
    //   var feriados = response.data;
    //   console.log(feriados);
    //   this.feriados = response.data;
    // });
    // axios.get(url + "/marcaciones?_expand=empleado").then(response => {
    //   var marcaciones = response.data;
    //   console.log(marcaciones);
    //   this.marcaciones = response.data;
    // });
    // axios.get(url + "/sucursals").then(response => {
    //   var sucursals = response.data;
    //   console.log(sucursals);
    //   this.sucursales = response.data;
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
