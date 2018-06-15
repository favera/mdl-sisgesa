<template>
  <div class="ui twelve wide column">

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
              <el-date-picker v-model="dateStart" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
              </el-date-picker>
            </div>

            <div class="field">
              <el-date-picker v-model="dateEnd" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
              </el-date-picker>
            </div>

            <div class="field" v-show="dateStart != null">
              <i class="large circle remove link grey icon"></i>
            </div>

            <!-- <div class="field">
              <div class="ui vertical teal button" @click="calcularSalario(dateStart, dateEnd)">
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
              <i class="save icon"></i>
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

            <tr v-for="resultado in resultadoTotal" :key="resultado.funcionarioId">
              <td>{{resultado.nombre}}</td>
              <td>{{resultado.totalExtras }} Min</td>
              <td>{{resultado.retrasos}} Min</td>
              <td>{{resultado.ausencias}} dias</td>
              <td>{{resultado.salario}} {{resultado.moneda}}</td>
              <td>{{returnNegative(resultado.ips, resultado.moneda)}} </td>
              <td>{{returnNegative(resultado.adelanto, resultado.moneda)}} </td>
              <td>{{returnNegative(resultado.prestamos, resultado.moneda)}}</td>
              <td>{{formatRetrasos(resultado.descuentos)}} {{resultado.moneda}}</td>
              <td></td>
              <td>{{calcularSalarioNeto(resultado.salario, resultado.ips, resultado.adelanto, resultado.prestamos, resultado.descuentos)}} {{resultado.moneda}}</td>
              <td>
                <i class="history link icon" @click="goToResumenHora(resultado.funcionarioId, resultado.nombre)"></i>
                <i class="money bill alternate outline link icon"></i>
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
    enableView: {
      type: Boolean
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
    goToResumenHora(funcionario, nombre) {
      this.$router.push({
        name: "resumenBancoHora",
        params: {
          funcionario: funcionario,
          nombre: nombre,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd
        }
      });
    },
    limpiarCampos() {
      this.dateStart = null;
      this.dateEnd = null;
      marcacionesEmpleado.length = 0;
    },
    calcularSalarioNeto(salario, ips, adelanto, prestamo, descuentos) {
      console.log(salario, ips, adelanto, prestamo, descuentos);
      console.log(
        typeof salario,
        typeof ips,
        typeof adelanto,
        typeof prestamo,
        typeof descuentos
      );
      var salarioNeto = parseInt(salario.split(".").join(""));
      if (ips) {
        salarioNeto = salarioNeto - ips;
      }

      if (adelanto) {
        salarioNeto = salarioNeto - adelanto;
      }

      if (prestamo) {
        salarioNeto = salarioNeto - prestamo;
      }

      if (descuentos) {
        salarioNeto = salarioNeto - Math.round(descuentos);
      }

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
          `/asistencias/full-list?inicio=${this.dateStart}&fin=${this.dateEnd}`
        )
        .then(response => {
          this.marcaciones = response.data;
        });
    },
    async getResumen() {
      const advancePromise = this.$http.get(
        `/adelantos/monthly-advance?inicio=${this.dateStart}&fin=${
          this.dateEnd
        }`
      );
      const loanPromise = this.$http.get(
        `/prestamos/loan-period?inicio=${this.dateStart}&fin=${this.dateEnd}`
      );
      const attendacePromise = this.$http.get(
        `/asistencias/full-list?inicio=${this.dateStart}&fin=${this.dateEnd}`
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
            if (element.funcionarioId === marcacion.funcionario._id) {
              return true;
            }
            return false;
          });
        }

        console.log("Indice", index);
        funcionarioExists = index != -1;

        if (funcionarioExists) {
          if (marcacion.estilo.ausente) {
            this.resultadoTotal[index].ausencias += 1;
            console.log(
              "Desde Array antes de la suma",
              this.resultadoTotal[index].descuentos
            );
            this.resultadoTotal[index].descuentos += Math.round(
              parseInt(marcacion.funcionario.salario.split(".").join("")) / 26
            );
            console.log(
              "Pos Array pos suma",
              this.resultadoTotal[index].descuentos
            );
          }

          if (marcacion.estilo.incompleto) {
            this.resultadoTotal[index].incompleto += 1;
          }

          if (marcacion.estilo.vacaciones) {
            this.resultadoTotal[index].totalVacaciones += 1;
          }

          if (marcacion.horasExtras) {
            console.log("HORA EXTRA", marcacion.horasExtras);
            this.resultadoTotal[index].totalExtras += moment
              .duration(marcacion.horasExtras, "HH:mm")
              .asMinutes();
          }
          console.log("Horas Faltantes", marcacion.horasFaltantes);
          if (marcacion.horasFaltantes) {
            this.resultadoTotal[index].retrasos += moment
              .duration(marcacion.horasFaltantes, "HH:mm")
              .asMinutes();
            console.log(
              "Descuentos pre horas faltantes",
              this.resultadoTotal[index].descuentos
            );
            this.resultadoTotal[index].descuentos -=
              moment.duration(marcacion.horasFaltantes, "HH:mm").asMinutes() *
              marcacion.funcionario.salarioMinuto;
            console.log(
              "Descuentos pos horas Faltantes",
              this.resultadoTotal[index].descuentos
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
          totalMes.descuentos = 0;
          totalMes.funcionarioId = marcacion.funcionario._id;

          if (marcacion.estilo.ausente) {
            totalMes.ausencias = 1;

            totalMes.descuentos += Math.round(
              parseInt(marcacion.funcionario.salario.split(".").join("")) / 26
            );
          } else {
            totalMes.ausencias = 0;
          }

          if (marcacion.estilo.incompleto) {
            totalMes.totalIncompleto = 1;
          } else {
            totalMes.totalIncompleto = 0;
          }

          if (marcacion.estilo.vacaciones) {
            totalMes.totalVacaciones = 1;
          } else {
            totalMes.totalVacaciones = 0;
          }

          if (marcacion.horasExtras) {
            totalMes.totalExtras = moment
              .duration(marcacion.horasExtras, "HH:mm")
              .asMinutes();
          } else {
            totalMes.totalExtras = 0;
          }

          if (marcacion.horasFaltantes) {
            totalMes.retrasos = moment
              .duration(marcacion.horasFaltantes, "HH:mm")
              .asMinutes();
            totalMes.descuentos -=
              totalMes.retrasos * marcacion.funcionario.salarioMinuto;
          } else {
            totalMes.retrasos = 0;
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

          totalMes.nombre = marcacion.funcionario.nombre;
          totalMes.salario = marcacion.funcionario.salario;
          totalMes.salarioMinuto = marcacion.funcionario.salarioMinuto;
          totalMes.moneda = marcacion.funcionario.moneda;

          if (marcacion.funcionario.ips === "salario") {
            totalMes.ips = Math.round(
              parseInt(marcacion.funcionario.salario.split(".").join("")) * 0.09
            );
          }

          var adelantoFunc = this.adelantos.filter(
            adelanto => adelanto.funcionario === marcacion.funcionario._id
          );

          if (adelantoFunc.length > 0) {
            totalMes.adelanto = adelantoFunc.reduce(function(valor, adelanto) {
              return valor + parseInt(adelanto.monto.split(".").join(""));
            }, 0);
          } else {
            totalMes.adelanto = null;
          }
          // debugger;
          this.prestamos.find(prestamo => {
            if (prestamo.funcionario === marcacion.funcionario._id) {
              prestamo.cuotas.forEach(cuota => {
                if (
                  moment(cuota.vencimiento).isBetween(
                    this.dateStart,
                    this.dateEnd,
                    null,
                    []
                  ) &&
                  cuota.estado === "pendiente"
                ) {
                  console.log("Valor prestamo", cuota.monto);
                  totalMes.prestamos = parseInt(
                    cuota.monto.split(".").join("")
                  );
                }
              });
            }
          });

          this.resultadoTotal.push(totalMes);
          // totalMes.totalMes =
          //   this.getDiasMes() - this.getFeriados() - totalMes.totalVacaciones;
        }
      });
    },
    getEmployees() {
      this.$http.get(`/funcionarios/full-list`).then(response => {
        this.funcionarios = response.data;
      });
    },
    getEvents() {
      this.$http
        .get(`/eventos/full-list?inicio=${this.dateStart}&fin=${this.dateEnd}`)
        .then(response => {
          this.eventos = response.data;
        });
    },
    //Hacer un arrayfilter funcionario donde sera un array de los datos de un solo funcionario
    //del array resultante sumar horas trabajadas, sumar horas extras, calcular descuento u hora extra
    //calcular horas mes segun idsucursal
    calcularSalario(dateStart, dateEnd, horasMes) {
      horasMes = this.getDiasMes(dateStart);
      console.log(" Dias MES" + horasMes);
      dateStart = moment(dateStart, "DD/MM/YYYY").format("L");
      dateEnd = moment(dateEnd, "DD/MM/YYYY").format("L");
      console.log("FECHAS" + dateStart, dateEnd);
      console.log("DIAS " + horasMes);
      this.getData(dateStart, dateEnd, horasMes);
    },

    async getData(dateStart, dateEnd, horasMes) {
      this.loading = true;
      try {
        const getMarcaciones = await axios.get(
          url +
            "/marcaciones?fecha_gte=" +
            dateStart +
            "&fecha_lte=" +
            dateEnd +
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
    this.getResumen().then(response => (this.loading = false));
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
