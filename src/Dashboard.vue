<template>
  <div class="ui twelve wide column">
    <div class="ui teal segment">
      <div class="ui form">
        <div class="two fields">
          <div class="field">
            <h3>Resumen del mes</h3>
          </div>

          <div class="field">
            <div class="ui blue inverted right floated main compact menu">
              <a class="item" @click="generateResume">
                <i class="file text outline icon"> </i> Generar Resumen
              </a>

            </div>
          </div>
        </div>
      </div>

      <div class="item">

        <div class="content">
          <table class="ui celled striped table">
            <thead>
              <tr>
                <th>Funcionario</th>
                <th>Dias del Mes</th>
                <th>Dias Trabajados</th>
                <th>Dias Incompletos</th>
                <th>Total Horas Faltantes</th>
                <th>Total Horas Extras</th>
                <th>Ausencias</th>
                <th>Vacaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in informe" :key="item['.key']">
                <td>{{item.nombre}}</td>
                <td class="center aligned">{{item.totalMes}} dias</td>
                <td class="center aligned">{{item.totalDiasTrabajados || 0}} dias </td>
                <td class="center aligned">{{item.totalIncompleto || 0}} dias</td>
                <td class="center aligned">{{item.totalFaltante}}</td>
                <td class="center aligned">{{item.totalExtras}}</td>
                <td class="center aligned">{{item.totalAusencias}}</td>
                <td class="center aligned">{{item.totalVacaciones}}</td>

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
  </div>

</template>

<script>
import axios from "axios";
import moment from "moment";
import { url } from "././config/backend";

export default {
  data() {
    return {
      marcaciones: [],
      loading: false,
      funcionarios: [],
      informe: [],
      eventos: [],
      item: {
        nombre: null,
        totalMes: null,
        totalTrabajado: null,
        totalFaltante: null,
        totalExtras: null,
        totalAusencias: null,
        totalVacaciones: null,
        totalIncompleto: null
      }
    };
  },
  methods: {
    obtenerMarcaciones() {
      var inicio, fin;
      inicio = moment()
        .startOf("month")
        .format();
      fin = moment()
        .endOf("month")
        .format();
      axios
        .get(`${url}/asistencias/full-list?inicio=${inicio}&fin=${fin}`)
        .then(response => {
          this.marcaciones = response.data;
        });
    },
    obtenerFuncionarios() {
      axios.get(`${url}/funcionarios/full-list`).then(response => {
        this.funcionarios = response.data;
      });
    },
    obtenerEventos() {
      var inicio, fin;
      inicio = moment()
        .startOf("month")
        .format();
      fin = moment()
        .endOf("month")
        .format();
      axios
        .get(`${url}/eventos/full-list?inicio=${inicio}&fin=${fin}`)
        .then(response => {
          this.eventos = response.data;
        });
    },
    generateResume(){
      //this.informe.length = 0;
      //this.item.totalMes = this.getDiasMes() - this.getFeriados();

      for (const funcionario of this.funcionarios) {

        var datosMes = this.marcaciones.filter(marcacion => {
          return marcacion.funcionario === funcionario._id
        });

        console.log(JSON.stringify(datosMes))

       

        var totalMes = datosMes.reduce((item, marcacion)=> {
          
          if (marcacion.estilo.ausente) {
              item.totalAusencias += 1;
              console.log("Entro Ausente", item.totalAusencias)
            }

             if (marcacion.estilo.incompleto) {
              item.totalIncompleto += 1;
              console.log("Entro Ausente", item.totalIncompleto)
            }


            if (marcacion.estilo.vacaciones) {
              item.totalVacaciones += 1;
              console.log("Entro vacaciones", item.totalVacaciones)
            }

            if (marcacion.horasExtras) {
              console.log("HORA EXTRA", marcacion.horasExtras);
              item.totalExtras += moment
                .duration(marcacion.horasExtras, "HH:mm")
                .asMinutes();
                console.log("Entro horas Extras", item.totalExtras)
            }
            console.log("Horas Faltantes", marcacion.horasFaltantes);
            if (marcacion.horasFaltantes) {
              item.totalFaltante += moment
                .duration(marcacion.horasFaltantes, "HH:mm")
                .asMinutes();
                console.log("Entro horas Faltantes", item.totalFaltante)
            }
            console.log("Horas Trabajadas", marcacion.horasTrabajadas);
            if (
              marcacion.horasTrabajadas &&
              marcacion.horasTrabajadas.localeCompare("00:00")
            ) {
              item.totalTrabajado += moment
                .duration(marcacion.horasTrabajadas, "HH:mm")
                .asMinutes();
              item.totalDiasTrabajados += 1;
              console.log("Dias Trabajados",  item.totalDiasTrabajados )
            }

            item.nombre = funcionario.nombre;
            item.totalMes = this.getDiasMes() - this.getFeriados() - item.totalVacaciones;

            return item;
          
        }, {
          nombre : null,
          totalMes : null,
          totalTrabajado : null,
          totalDiasTrabajados : null,
          totalFaltante : null,
          totalExtras : null,
          totalAusencias : null,
          totalVacaciones : null,
          totalIncompleto: null
        });
        console.log("Total Mes", JSON.stringify(totalMes));
        if(totalMes.totalFaltante)
        totalMes.totalFaltante = totalMes.totalFaltante + " Minutos";
        if( totalMes.totalExtras)
        totalMes.totalExtras = totalMes.totalExtras + " Minutos";
        if(totalMes.totalAusencias)
        totalMes.totalAusencias = totalMes.totalAusencias + " Dias";
        if(totalMes.totalVacaciones)
        totalMes.totalVacaciones = totalMes.totalVacaciones + " Dias";
        this.informe.push(totalMes);
        
      }

    },
    generarResumen() {
      //this.loading = true;
      this.informe.length = 0;
      this.item.totalMes = this.getDiasMes() - this.getFeriados();

      for (let funcionario of this.funcionarios) {
        console.log("Funcionario", funcionario);
        var item = {};

        item.nombre = null;
        item.totalMes = null;
        item.totalTrabajado = null;
        item.totalDiasTrabajados = null;
        item.totalFaltante = null;
        item.totalExtras = null;
        item.totalAusencias = null;
        item.totalVacaciones = null;

        this.marcaciones.map(marcacion => {
          console.log(
            "Comparacion " + funcionario._id + "=" + marcacion.funcionario
          );
          if (funcionario._id === marcacion.funcionario) {
            if (marcacion.estilo.ausente) {
              item.totalAusencias += 1;
            }

            if (marcacion.estilo.vacaciones) {
              item.totalVacaciones += 1;
            }

            if (marcacion.horasExtras) {
              item.totalExtras += moment
                .duration(marcacion.horasExtras, "HH:mm")
                .asMinutes();
            }

            if (marcacion.horasFaltantes) {
              item.totalFaltante += moment
                .duration(marcacion.horasFaltantes, "HH:mm")
                .asMinutes();
            }
            console.log("Horas Trabajadas", marcacion.horasTrabajadas);
            if (
              marcacion.horasTrabajadas &&
              marcacion.horasTrabajadas.localeCompare("00:00")
            ) {
              item.totalTrabajado += moment
                .duration(marcacion.horasTrabajadas, "HH:mm")
                .asMinutes();
              item.totalDiasTrabajados += 1;
            }
          }
        });

        item.nombre = funcionario.nombre;
        item.totalMes =
          this.getDiasMes() - this.getFeriados() - item.totalVacaciones;

        if (item.totalFaltante) {
          item.totalFaltante = item.totalFaltante + " minutos";
        }

        if (item.totalVacaciones) {
          item.totalVacaciones = item.totalVacaciones + " dias";
        }

        if (item.totalAusencias) {
          item.totalAusencias = item.totalAusencias + " dias";
        }

        if (item.totalExtras) {
          item.totalExtras = item.totalExtras + " minutos";
        }

        this.informe.push(item);
      }
    },
    getDomingos() {
      // moment(fecha).date(1);
      var fecha = moment()
        .startOf("month")
        .format();
      var dif = (7 + (0 - moment(fecha).weekday())) % 7 + 1;
      console.log("FirstOfMonth: " + moment(fecha).weekday() + ", dif: " + dif);
      return Math.floor((moment(fecha).daysInMonth() - dif) / 7) + 1;
    },
    getDiasMes() {
      var domingos = this.getDomingos();
      console.log("DOMINGOS" + domingos);
      console.log("Dias Mes" + moment().daysInMonth());
      return moment().daysInMonth() - domingos;
    },
    getFeriados() {
      var result = 0;
      this.eventos.forEach(evento => {
        if (evento.tipoEvento === "feriado") {
          result = result + 1;
        }
      });
      return result;
    }
  },
  created() {
    this.obtenerMarcaciones();
    this.obtenerFuncionarios();
    this.obtenerEventos();
  }
  
};
</script>

<style>
.el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}
.ui.segment.large {
  height: 400px;
}
</style>

