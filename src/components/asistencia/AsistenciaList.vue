<template>
  <div class="ui twelve wide column">

    <div class="ui longer modal">
      <div class="header"> Archivo Seleccionado </div>
      <div class="scrolling content">
        <table class="ui celled  padded table">
          <thead>
            <tr>
              <th>Funcionario</th>
              <th>Fecha</th>
              <th>Marcacion Entrada</th>
              <th>Marcacion Salida</th>
            </tr>

          </thead>
          <tbody>
            <tr v-for="dato in datosMarcaciones" :key="dato.id">
              <td>{{dato.nombreFuncionario}}</td>
              <td>{{moment(dato.fecha).format("L")}}</td>
              <td>{{(dato.entrada || "--") + " hs"}}</td>
              <td>{{(dato.salida || "--") + " hs"}}</td>
            </tr>
          </tbody>
        </table>

      </div>
      <div class="actions">

        <button class="ui positive teal button" @click="guardarMarcaciones">Aceptar</button>
        <div class="ui deny button" @click="cancelarArchivo">Cancelar</div>
      </div>
    </div>

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Asistencia</h4>

      <div class="two fields">

        <div class="fifteen wide field">
          <label for="salaryQuery">Consultar por:</label>

          <div class="inline fields">

            <div class="ten wide field">

              <div class="ui icon input">
                <input type="text" placeholder="Buscar por nombre" v-model="query.busqueda">
                <i class="search icon" v-if="busquedaAvanzada"></i>
                <i @click="queryData" class="inverted teal circular search link icon" v-else></i>

              </div>

            </div>

          </div>

        </div>

        <div class="field">

          <div class="ui right floated main menu">

            <a class="icon item">
              <vue-xlsx-table @on-select-file="handleSelectedFile">

                <span data-tooltip="Subir archivo de asistencia">
                  <i class="upload icon"></i>
                </span>

              </vue-xlsx-table>
            </a>

            <a class="icon item" @click="nuevaAsistencia">
              <span data-tooltip="Crear Asistencia Manualmente">
                <i class="plus icon"></i>
              </span>
            </a>

            <a class="icon item" @click="busquedaAvanzada = !busquedaAvanzada">

              <i class="find icon"></i>

            </a>

          </div>

        </div>

      </div>

      <div class="fields" v-show="busquedaAvanzada">
        <div class="field">
          <label for="">Rango de Fechas:</label>
          <div class="inline fields">
            <div class="field">
              <el-date-picker type="date" placeholder="Fecha inicio" format="dd/MM/yyyy" v-model="query.rangoFecha.inicio">
              </el-date-picker>
            </div>

            <div class="field">
              <el-date-picker type="date" placeholder="Fecha fin" format="dd/MM/yyyy" v-model="query.rangoFecha.fin">
              </el-date-picker>
            </div>

            <div class="field" style="margin-left: 30px">
              <label for="">Estado:</label>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="todos" v-model="query.estado">
                <label>Todos</label>
              </div>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="ausentes" v-model="query.estado">
                <label>Ausentes</label>
              </div>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="incompletos" v-model="query.estado">
                <label>Incompletos</label>
              </div>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="vacaciones" v-model="query.estado">
                <label>Vacaciones</label>
              </div>
            </div>

            <div class="field" style="margin-left: 20px">
              <button @click="queryData" class="ui circular teal icon button">
                <i class="search icon"></i>
              </button>

            </div>

          </div>

        </div>

      </div>

      <div class="field">

        <table class="ui teal celled table">
          <thead>
            <tr>
              <th>Funcionario</th>
              <th>Fecha</th>
              <th>M. Entrada</th>
              <th>M. Salida</th>
              <th>Horas Trabajadas</th>
              <th>Horas Faltantes</th>
              <th>Banco de Horas</th>
              <th>Observacion</th>
              <th>Opciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="marcacion in marcaciones" :key="marcacion._id" v-bind:class="{negative: marcacion.estilo.ausente, positive: marcacion.estilo.vacaciones, warning: marcacion.estilo.incompleto}">
              <td>{{marcacion.nombreFuncionario}}</td>
              <td>{{moment(marcacion.fecha).format("L")}}</td>
              <td>{{(marcacion.entrada || "--") + " hs"}}</td>
              <td>{{(marcacion.salida || "--") + " hs"}}</td>
              <td>{{(marcacion.horasTrabajadas || "--") + " hs"}}</td>
              <td>{{(marcacion.horasFaltantes || "--") + " hs"}}</td>
              <td>{{(marcacion.horasExtras || "--") + " hs"}}</td>
              <td>{{marcacion.observacion || "--"}}</td>

              <td>
                <i @click="guardarPaginacion(marcacion._id)" class="edit row icon"></i>
                <i @click="confirm(marcacion._id)" class="trash icon"></i>

              </td>
            </tr>

          </tbody>

          <tfoot v-if="pageOne.totalItems > 0">
            <tr v-show="totalRetraso">
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th>Banco de Horas: {{totalBancoHora}} Minutos Descuentos: {{totalRetraso}} </th>
              <th></th>

            </tr>
            <tr>
              <th colspan="9">
                <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
                </app-pagination>
              </th>
            </tr>
          </tfoot>
        </table>

      </div>

    </div>

  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import Pagination from ".././shared/Pagination.vue";
import { url } from "./../.././config/backend";
import { db } from "./../.././config/firebase";

let funcionariosRef = db.ref("/funcionarios");
let calendarioRef = db.ref("/calendario");
let asistenciasRef = db.ref("/asistencias");

export default {
  data() {
    return {
      busquedaAvanzada: false,
      call: null,
      query: {
        estado: "todos",
        rangoFecha: {
          inicio: null,
          fin: null
        },
        busqueda: null
      },
      datosMarcaciones: [],
      keyPagination: [],
      listado: [],
      marcaciones: [],
      eventos: [],
      preDatos: [],
      ausente: false,
      atrasado: false,
      modal: null,
      errors: [],
      isSabado: null,
      marcacion: {
        fecha: null,
        entrada: null,
        salida: null,
        horasTrabajadas: null,
        horasFaltantes: null,
        horasExtras: null,
        observacion: null,
        estilo: {}
      },
      funcionarios: [],
      sabados: [],
      nombreBusqueda: null,
      searchDateStart: "",
      searchDateEnd: "",
      ausencias: [],
      totalBancoHora: 0,
      totalRetraso: 0,
      totalHoraExtra: 0,
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        test: 1
      },
      json_fields: {
        funcionario: "Funcionario",
        fecha: "Fecha",
        entrada: "Entrada",
        salida: "Salida",
        horasTrabajadas: "Horas Trabajadas",
        bancoHora: "Banco de Horas",
        retraso: "Horas faltantes"
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
  components: {
    appPagination: Pagination
  },
  methods: {
    pageOneChanged(pageNum, llamada) {
      this.pageOne.currentPage = pageNum;
      this.call()
      //this.obtenerAsistencias();
    },
    guardarPaginacion(marcacionId) {
      var page = {};
      page.itemsPerPage = this.pageOne.itemsPerPage;
      page.currentPage = this.pageOne.currentPage;
      page.totalItems = this.pageOne.totalItems;
      localStorage.setItem("page", JSON.stringify(page));

      this.$router.push({
        name: "editarAsistencia",
        params: { id: marcacionId }
      });
    },
    queryData(){
      var inicio, fin;
      if(!this.query.rangoFecha.incio && !this.query.rangoFecha.fin && this.query.estado === "ausentes"){
        console.log("Ausentes");
        inicio = "2018-02-01T03:00:00.000Z";
        fin = "2018-02-05T03:00:00.000Z";

        axios.get(`${url}/asistencias/query-data?page=${this.pageOne.currentPage}&limit=${this.pageOne.itemsPerPage}&inicio=${inicio}&fin=${fin}&estado=ausentes`).then(response => {
          console.log(response.data.docs);
          this.marcaciones = response.data.docs;
          this.pageOne.totalItems = parseInt(response.data.pages) * 10;
        })
      }
      if(!this.query.rangoFecha.incio && !this.query.rangoFecha.fin && this.query.busqueda){
        console.log("ENtro")
        inicio = "2018-02-01T03:00:00.000Z";
        fin = "2018-02-05T03:00:00.000Z";

        axios.get(`${url}/asistencias/query-data?page=${this.pageOne.currentPage}&limit=${this.pageOne.itemsPerPage}&inicio=${inicio}&fin=${fin}&busqueda=${this.query.busqueda}`).then(response => {
          this.marcaciones = response.data.docs;
          this.pageOne.totalItems = parseInt(response.data.pages) * 10;
        })
        
      }
      //axios.get
    },
    obtenerFuncionarios() {
      axios.get(`${url}/funcionarios/full-list`).then(response => {
        this.funcionarios = response.data;
      });
    },
    obtenerAsistencias() {
      axios
        .get(
          `${url}/asistencias?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }`
        )
        .then(response => {
          this.marcaciones = response.data.docs;
          this.pageOne.totalItems = response.data.total;
        });
       
    },
    limpiarDatos() {
      this.json_data.length = 0;
      this.nombreBusqueda = null;
      this.totalBancoHora = 0;
      this.totalRetraso = 0;
    },
    cancelarArchivo() {
      this.datosMarcaciones.length = 0;
    },
    abrirModal() {
      this.modal
        .modal("setting", { observeChanges: true })
        .modal("show")
        .modal("refresh");
    },
    //retorna las horas que trabajo en el dia horaSalida - horaEntrada
    handleHorasTrabajadas(entrada, salida) {
      var result = moment("00:00", "hh:mm").format("00:00");
      if (entrada !== null && salida !== null) {
        result =
          moment.duration(salida, "HH:mm").asMinutes() -
          moment.duration(entrada, "HH:mm").asMinutes();
        console.log("Horas trabajadas " + result);
        return moment.utc(result * 1000 * 60).format("HH:mm");
      }
      console.log("Horas trabajadas " + result);
      return result;
    },
    //retorna el valor en horas de horas extras para el banco de horas
    calculoBancoH(entrada, salida, funcionarioId) {
      var sabadoMedioTiempo;
      var cargaLaboral;

      var funcionario = this.funcionarios.find(funcionario => {
        if (funcionario._id === funcionarioId) {
          return funcionario;
        }
        return null;
      });

      if (funcionario) {
        sabadoMedioTiempo = funcionario.medioTiempo;
        cargaLaboral = funcionario.cargaLaboral;
      }

      //si isSabado es true, si el dia es sabado
      if (this.isSabado !== -1) {
        //si el funcionario tiene habilitado sabado medio tiempo
        if (sabadoMedioTiempo) {
          var horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

          console.log("Resultado Horas Trabajadas", horasTrabajadas);

          if (!horasTrabajadas.localeCompare("00:00")) {
            console.log("ENTRO al COMPARE");
            return null;
          }
          var horasExtras =
            moment.duration(horasTrabajadas, "HH:mm").asMinutes() - 300;
          console.log("Resultado Horas Extras", horasExtras);
          if (horasExtras > 0) {
            return this.handleNegative(horasExtras);
          }
          return null;

          //else del no tiene sabado habilitado
        } else {
          var horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

          console.log("Resultado Horas Trabajadas", horasTrabajadas);

          if (!horasTrabajadas.localeCompare("00:00")) {
            return null;
          }

          console.log("Carga Laboral", cargaLaboral);

          var horasExtras =
            moment.duration(horasTrabajadas, "HH:mm").asMinutes() -
            moment.duration(cargaLaboral, "HH:mm").asMinutes();
          console.log(moment.duration(cargaLaboral, "HH:mm").asMinutes());
          console.log("Resultado Horas Extras", horasExtras);

          if (horasExtras > 0) {
            return this.handleNegative(horasExtras);
          }

          return null;
        }
        //else del verificar si es dia sabado
      } else {
        var horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

        console.log("Resultado Horas Trabajadas", horasTrabajadas);

        if (!horasTrabajadas.localeCompare("00:00")) {
          return null;
        }
        var horasExtras =
          moment.duration(horasTrabajadas, "HH:mm").asMinutes() -
          moment.duration(cargaLaboral, "HH:mm").asMinutes();

        console.log("Resultado Horas Extras", horasExtras);

        if (horasExtras > 0) {
          return this.handleNegative(horasExtras);
        }

        return null;
      }
    },
    //Retorna el valor en horas de las horas faltantes del funcionario
    calculoHorasFaltantes(entrada, salida, funcionarioId) {
      var sabadoMedioTiempo;
      var cargaLaboral;

      var funcionario = this.funcionarios.find(funcionario => {
        if (funcionario._id === funcionarioId) {
          return funcionario;
        }
        return null;
      });

      if (funcionario) {
        sabadoMedioTiempo = funcionario.medioTiempo;
        cargaLaboral = funcionario.cargaLaboral;
      }

      if (this.isSabado !== -1) {
        if (sabadoMedioTiempo) {
          var horasTrabajadas = this.handleHorasTrabajadas(entrada, salida),
            result;
          console.log("Horas trabajadas " + horasTrabajadas);
          if (!horasTrabajadas.localeCompare("00:00")) {
            return "-" + moment.utc(300 * 1000 * 60).format("HH:mm");
          }
          result = moment.duration(horasTrabajadas, "HH:mm").asMinutes() - 300;

          if (result < 0) {
            return this.handleNegative(result);
          }
          return null;
        } else {
          var horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

          if (!horasTrabajadas.localeCompare("00:00")) {
            return "-" + cargaLaboral;
          }
          var horasExtras =
            moment.duration(horasTrabajadas, "HH:mm").asMinutes() -
            moment.duration(cargaLaboral, "HH:mm").asMinutes();

          if (horasExtras < 0) {
            return this.handleNegative(horasExtras);
          }

          return null;
        }
      } else {
        var horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

        if (!horasTrabajadas.localeCompare("00:00")) {
          return "-" + cargaLaboral;
        }
        var horasExtras =
          moment.duration(horasTrabajadas, "HH:mm").asMinutes() -
          moment.duration(cargaLaboral, "HH:mm").asMinutes();

        if (horasExtras < 0) {
          return this.handleNegative(horasExtras);
        }

        return null;
      }
    },
    //verifica si es domingo o no para insertar texto en observacion
    handleObservacion(fecha) {
      var domingo = new Date(fecha);
      if (domingo.getDay() === 0) {
        return "Hora Extra Domingo";
      }

      return "";
    },

    nuevaAsistencia() {
      this.$router.push({ name: "incluirAsistencia" });
    },
    llamarFuncionarios() {
      axios.get(url + "/empleados?_expand=sucursal").then(response => {
        (this.funcionarios = response.data), console.log("entro en axios");
      });
    },
    confirm(id) {
      console.log("ID desde confirm", id);
      this.$confirm(
        "Este registro sera eliminado permanentemente. Continuar?",
        "Alerta",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.eliminarAsistencia(id);
          this.$message({
            type: "success",
            message: "Delete completed"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled"
          });
        });
    },
    eliminarAsistencia(id) {

      var index = this.marcaciones.findIndex(i => i.id === id);
      this.marcaciones.splice(index, 1)
      axios
        .delete(`${url}/asistencias/delete/${id}`)
        .then(response => console.log(response));
    },
    handleSelectedFile(convertedData) {
      this.datosMarcaciones.length = 0;
      //Pasamos los datos del archivo excel a preDatos
      this.preDatos = convertedData.body;
      this.funcionarios.forEach(value => {
        console.log("Funcionario", value.acnro);
        this.orderData(
          value.acnro,
          value._id,
          value.nombre,
          value.cargaLaboral,
          value.medioTiempo,
          value.vacaciones
        );
      });
      this.abrirModal();
      console.log("Fecha Planilla", this.datosMarcaciones[0].fecha);
      this.getSabados(this.datosMarcaciones[0].fecha);
      this.isSabado = this.findSabado(this.datosMarcaciones[0].fecha);
    },
    //recibe datos de funcionarios desde el foreach de funcionarios
    orderData(
      acnro,
      funcionarioId,
      nombreFuncionario,
      cargaLaboral,
      medioTiempo,
      vacaciones
    ) {
      var modelo = {
        fecha: "",
        funcionarioId: null,
        nombreFuncionario: "",
        horasExtras: "",
        entrada: null,
        salida: null,
        horarios: []
      };

      console.log("Predatos", JSON.stringify(this.preDatos));
      //iteracion sobre el array de objetos de preDatos, preDatos contiene datos del archivo excel
      for (let item of this.preDatos) {
        //Compara si el acnro dado por el foreach de funcionario es igual al item del for de los datos del excel
        if (acnro === item["AC-No."]) {
          console.log(
            "acnro variable: " + acnro + "|" + "ACNRO array: " + item["AC-No."]
          );
          modelo.funcionarioId = funcionarioId;
          modelo.nombreFuncionario = nombreFuncionario;
          modelo.fecha = moment(item.Horario, "DD/MM/YYYY").format();
          modelo.horasExtras = moment
            .duration(cargaLaboral, "HH:mm")
            .asMinutes();
          //Se guardan todos los horarios del funcionario encontrados en la planilla en un array
          modelo.horarios.push(
            moment(item.Horario, "DD/MM/YYYY HH:mm a").format("LT")
          );
          console.log("CARGA LABORAL" + cargaLaboral);
          console.log("Horario sin formato " + item.Horario);
          console.log(
            "Horario: " +
              moment(item.Horario, "DD/MM/YYYY HH:mm a").format("LT")
          );
        }
      }
      //despues de recorrer todos los datos de la planilla, se verifica modelo, se tiene que validar los horarios
      if (modelo.funcionarioId !== null) {
        console.log("####Marcaciones####" + modelo.horarios);
        //si tiene solo una marcacion
        if (modelo.horarios.length == 1) {
          var fec = modelo.horarios[0];
          console.log(typeof fec);
          //Preguntar la hora de marcacion de Paris turno noche
          //verifica si la unica marcacion que posee es una entrada o salida
          if (
            moment.duration(fec, "HH:mm").asMinutes() <
            moment.duration("10:30", "HH:mm").asMinutes()
          ) {
            console.log(
              "Funciona la comparacion",
              modelo.horarios[0],
              modelo.horarios.length
            );
            modelo.entrada = modelo.horarios[0];
            console.log("###ENTRADA##" + modelo.entrada);
            this.datosMarcaciones.push(modelo);
          } else {
            modelo.salida = modelo.horarios[0];
            console.log("####Salida####" + modelo.salida);
            this.datosMarcaciones.push(modelo);
          }
          console.log(
            "Entrada Salida Una SOLA MARCACION" + modelo.entrada,
            modelo.salida
          );
        } else {
          var last = modelo.horarios.length - 1;
          console.log("ultimo Indice" + last);
          modelo.entrada = modelo.horarios[0];
          modelo.salida = modelo.horarios[last];
          this.datosMarcaciones.push(modelo);
        }
      }
      console.log(
        JSON.stringify("RESULTADO " + JSON.stringify(this.datosMarcaciones))
      );
    },
    //maneja los valores negativos resultante de las horas extras
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
    //Obtenien los sabados del mes
    getSabados(fec) {
      console.log("Fecha Recibidad", fec);
      //var fecha = moment(fec, "DD/MM/YYYY").toDate();
      var fecha = new Date(fec);
      console.log(fecha);
      var month = fecha.getMonth();

      fecha.setDate(1);

      // Get the first Saturday in the month
      while (fecha.getDay() !== 6) {
        fecha.setDate(fecha.getDate() + 1);
      }

      // Get all the other Saturday in the month
      while (fecha.getMonth() === month) {
        this.sabados.push(new Date(fecha.getTime()));
        fecha.setDate(fecha.getDate() + 7);
      }

      //return sabados;
    },
    findSabado(fecha) {
      //var findFecha = moment(fecha, "DD/MM/YYYY").toDate();

      var findFecha = new Date(fecha);

      var fechaSabado = this.sabados.findIndex(element => {
        console.log(findFecha);
        console.log(fechaSabado);
        return findFecha.getTime() === element.getTime();
      });
      console.log("INDICE SABADO", fechaSabado);
      return fechaSabado;
    },
    aplicarEstiloMarcacion(entrada, salida) {
      if (entrada == null || salida == null) {
        return {
          ausente: false,
          incompleto: true,
          vacaciones: false
        };
      } else {
        return {
          ausente: false,
          incompleto: false,
          vacaciones: false
        };
      }
    },
    guardarMarcaciones() {
      this.ausencias.length = 0;
      this.datosMarcaciones.forEach(dato => {
        var marcacion = {};

        marcacion.fecha = dato.fecha;
        marcacion.funcionario = dato.funcionarioId;
        marcacion.nombreFuncionario = dato.nombreFuncionario;
        marcacion.entrada = dato.entrada;
        marcacion.salida = dato.salida;
        //calculo de Horas trabajadas
        marcacion.horasTrabajadas = this.handleHorasTrabajadas(
          dato.entrada,
          dato.salida
        );

        marcacion.horasExtras = this.calculoBancoH(
          dato.entrada,
          dato.salida,
          dato.funcionarioId
        );

        marcacion.horasFaltantes = this.calculoHorasFaltantes(
          dato.entrada,
          dato.salida,
          dato.funcionarioId
        );

        marcacion.observacion = this.handleObservacion(dato.fecha);
        marcacion.estilo = this.aplicarEstiloMarcacion(
          dato.entrada,
          dato.salida
        );

        this.marcaciones.push(marcacion);
      });
      console.log(this.datosMarcaciones[0].fecha);
      var fecha = new Date(this.datosMarcaciones[0].fecha);
      //si no es domingo verificar si esta de vacaciones o ausente
      if (fecha.getDay() !== 0) {
        //nuevo loop por funcionario para poder verificar si tiene marcaciones en datos marcaciones
        this.funcionarios.forEach(funcionario => {
          var ausencia = this.datosMarcaciones.findIndex(item => {
            console.log("comparacion", item.funcionarioId, funcionario._id);
            return funcionario._id === item.funcionarioId;
          });
          console.log("Ausente:", ausencia);
          if (ausencia === -1) {
            console.log(
              "Funcionario Ausente, verificar si esta de vacaciones",
              funcionario._id
            );
            var marcacion = {};
            marcacion.estilo = {};

            //Verifica si el funcionario esta de vacaciones
            if (funcionario.vacaciones !== "false") {
              console.log("Esta de vacaciones");
              var fecha, fechaInicio, fechaFin, isFechaVacaciones;
              axios
                .get(`${url}/eventos/edit/${funcionario.vacaciones}`)
                .then(response => {
                  fechaInicio = response.data.fechaInicio;
                  console.log(
                    "Fecha Incio Vacaciones",
                    fechaInicio,
                    typeof fechaInicio
                  );
                  fechaFin = response.data.fechaFin;
                  console.log(
                    "Fecha Fin Vacaciones",
                    fechaFin,
                    typeof fechaFin
                  );
                  fecha = moment(this.datosMarcaciones[0].fecha).format();
                  console.log("Fecha a comparar", fecha, typeof fecha);
                  isFechaVacaciones = moment(fecha).isBetween(
                    fechaInicio,
                    fechaFin,
                    null,
                    "[]"
                  );
                  console.log(
                    "Resultado de evaluacion fecha vacaciones",
                    isFechaVacaciones
                  );
                  if (
                    moment(fecha).isBetween(fechaInicio, fechaFin, null, "[]")
                  ) {
                    marcacion.fecha = this.datosMarcaciones[0].fecha;
                    marcacion.funcionario = funcionario._id;
                    marcacion.nombreFuncionario = funcionario.nombre;
                    marcacion.entrada = null;
                    marcacion.salida = null;
                    marcacion.horasTrabajadas = null;
                    marcacion.horasExtras = null;
                    marcacion.horasFaltantes = null;
                    marcacion.observacion = "Vacaciones";
                    marcacion.estilo.ausente = false;
                    marcacion.estilo.incompleto = false;
                    marcacion.estilo.vacaciones = true;
                    this.ausencias.push(marcacion);
                  }
                });
            } else {
              console.log("Entro en el Else");
              //si no cumplio condiciones anteriores, es una ausencia.
              marcacion.fecha = this.datosMarcaciones[0].fecha;
              marcacion.funcionario = funcionario._id;
              marcacion.nombreFuncionario = funcionario.nombre;
              marcacion.entrada = null;
              marcacion.salida = null;
              marcacion.horasTrabajadas = null;
              marcacion.horasExtras = null;
              marcacion.horasFaltantes = null;
              marcacion.observacion = "Ausencia";
              marcacion.estilo.ausente = true;
              marcacion.estilo.incompleto = false;
              marcacion.estilo.vacaciones = false;

              this.ausencias.push(marcacion);
            }
          }
        });
      }

      if (this.ausencias.length > 0) {
        this.marcaciones = this.ausencias.concat(this.marcaciones);
      }

      axios
        .post(`${url}/asistencias/test-data`, this.marcaciones)
        .then(response => console.log(response));
    }

    //###############Comentar desde ACA #####
    // confirmarArchivo() {
    //   this.funcionarios.forEach(value => {
    //     console.log("EMPLEADO " + value.nombre + value[".key"]);

    //     var ausencia = this.datosMarcaciones.findIndex(item => {
    //       return item.funcionarioId === value.id;
    //     });

    //     if (ausencia === -1) {
    //       var funcionarioAusente = {};
    //       funcionarioAusente.fecha = this.datosMarcaciones[0].fecha;
    //       funcionarioAusente.funcionarioId = value.id;
    //       funcionarioAusente.nombre = value.nombre;
    //       funcionarioAusente.horasExtras = moment
    //         .duration(value.cargaLaboral, "HH:mm")
    //         .asMinutes();
    //       funcionarioAusente.entrada = null;
    //       funcionarioAusente.salida = null;
    //       funcionarioAusente.isConfirmed = false;
    //       console.log("AUSENTES " + value.nombre);
    //       this.ausencias.push(funcionarioAusente);
    //     }
    //   });

    //   this.marcaciones = this.datosMarcaciones.concat(this.ausencias);

    //   console.log(
    //     "Contenido de Array Marcaciones" + JSON.stringify(this.marcaciones)
    //   );
    //   this.confirmData();
    //   this.datosMarcaciones.length = 0;
    // },
    // async postFirebase() {

    //   //nuevo loop por funcionario para poder verificar si tiene marcaciones en datos marcaciones
    //   this.funcionarios.forEach(funcionario => {
    //     var ausencia = this.datosMarcaciones.findIndex(item => {
    //       console.log("comparacion", item.funcionarioId, funcionario._id);
    //       return funcionario._id === item.funcionarioId;
    //     });
    //     console.log("Ausente:", ausencia);
    //     if (ausencia === -1) {
    //       console.log(
    //         "Funcionario Ausente, verificar si esta de vacaciones",
    //         funcionario._id
    //       );
    //       var marcacion = {};
    //       marcacion.estilo = {};

    //       //Verifica si el funcionario esta de vacaciones
    //       if (funcionario.vacaciones !== "false") {
    //         console.log("Esta de vacaciones");
    //         var fecha, fechaInicio, fechaFin, isFechaVacaciones;
    //         axios
    //           .get(`${url}/eventos/edit/${funcionario.vacaciones}`)
    //           .then(response => {
    //             fechaInicio = response.data.fechaInicio;
    //             console.log(
    //               "Fecha Incio Vacaciones",
    //               fechaInicio,
    //               typeof fechaInicio
    //             );
    //             fechaFin = response.data.fechaFin;
    //             console.log("Fecha Fin Vacaciones", fechaFin, typeof fechaFin);
    //             fecha = moment(this.datosMarcaciones[0].fecha).format();
    //             console.log("Fecha a comparar", fecha, typeof fecha);
    //             isFechaVacaciones = moment(fecha).isBetween(
    //               fechaInicio,
    //               fechaFin,
    //               null,
    //               "[]"
    //             );
    //             console.log(
    //               "Resultado de evaluacion fecha vacaciones",
    //               isFechaVacaciones
    //             );
    //             if (
    //               moment(fecha).isBetween(fechaInicio, fechaFin, null, "[]")
    //             ) {
    //               marcacion.fecha = this.datosMarcaciones[0].fecha;
    //               marcacion.funcionario = funcionario._id;
    //               marcacion.entrada = null;
    //               marcacion.salida = null;
    //               marcacion.horasTrabajadas = null;
    //               marcacion.horasExtras = null;
    //               marcacion.horasFaltantes = null;
    //               marcacion.observacion = "Vacaciones";
    //               marcacion.estilo.ausente = false;
    //               marcacion.estilo.incompleto = false;
    //               marcacion.estilo.vacaciones = true;
    //               this.ausencias.push(marcacion);

    //               axios
    //                 .post(url + "/asistencias/add", marcacion)
    //                 .then(response => {
    //                   console.log(response);
    //                 });
    //             }
    //           });
    //       } else {
    //         console.log("Entro en el Else");
    //         //si no cumplio condiciones anteriores, es una ausencia.
    //         marcacion.fecha = this.datosMarcaciones[0].fecha;
    //         marcacion.funcionario = funcionario._id;
    //         marcacion.entrada = null;
    //         marcacion.salida = null;
    //         marcacion.horasTrabajadas = null;
    //         marcacion.horasExtras = null;
    //         marcacion.horasFaltantes = null;
    //         marcacion.observacion = "Ausencia";
    //         marcacion.estilo.ausente = true;
    //         marcacion.estilo.incompleto = false;
    //         marcacion.estilo.vacaciones = false;

    //         this.ausencias.push(marcacion);

    //         axios.post(`${url}/asistencias/add`, marcacion).then(response => {
    //           console.log(response);
    //         });
    //       }
    //     }
    //   });

    //   // axios
    //   //   .post(`${url}/asistencias/test-data`, this.ausencias)
    //   //   .then(response => {
    //   //     console.log(response);
    //   //   });

    //   await Promise.all(
    //     this.datosMarcaciones.map(async marcacion => {
    //       try {
    //         let response = await axios
    //           .post(`${url}/asistencias/add`, {
    //             fecha: marcacion.fecha,
    //             funcionario: marcacion.funcionarioId,
    //             entrada: marcacion.entrada,
    //             salida: marcacion.salida,
    //             //calculo de Horas trabajadas
    //             horasTrabajadas: this.handleHorasTrabajadas(
    //               marcacion.entrada,
    //               marcacion.salida
    //             ),

    //             horasExtras: this.calculoBancoH(
    //               marcacion.entrada,
    //               marcacion.salida,
    //               marcacion.funcionarioId
    //             ),

    //             horasFaltantes: this.calculoHorasFaltantes(
    //               marcacion.entrada,
    //               marcacion.salida,
    //               marcacion.funcionarioId
    //             ),

    //             observacion: "",

    //             estilo: this.aplicarEstiloMarcacion(
    //               marcacion.entrada,
    //               marcacion.salida
    //             )
    //           })
    //           .then(function(response) {
    //             console.log("from async" + response);
    //           })
    //           .catch(function(error) {
    //             console.log(error);
    //           });
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     })
    //   );
    // },
    // nombreFuncionario(funcionarioId) {
    //   var nombre;
    //   funcionariosRef.child(funcionarioId).once("value", snap => {
    //     nombre = snap.val().nombre;
    //     console.log("Usuario retornado de firebase", snap.val().nombre);
    //   });
    //   return nombre;
    // },

    // //Hace post al array marcaciones y luego llama la lista, por eso es asincronico
    // async confirmData() {
    //   await Promise.all(
    //     this.marcaciones.map(async marcacion => {
    //       try {
    //         let response = await axios
    //           .post(url + "/marcaciones", {
    //             fecha: marcacion.fecha,
    //             funcionarioId: marcacion.funcionarioId,
    //             entrada: marcacion.entrada,
    //             salida: marcacion.salida,
    //             //calculo de Horas trabajadas
    //             horasTrabajadas: this.handleHorasTrabajadas(
    //               marcacion.entrada,
    //               marcacion.salida
    //             ),

    //             //calculo de horas Extras
    //             horasExtras: this.handleHorasExtras(
    //               marcacion.entrada,
    //               marcacion.salida,
    //               marcacion.horasExtras
    //             ),
    //             //calculo de retraso
    //             retraso: this.calcularRetraso(
    //               marcacion.entrada,
    //               marcacion.horaEntrada,
    //               marcacion.salida,
    //               marcacion.horaSalida
    //             ),
    //             //calculo de Banco de Hora
    //             bancoHora: this.calculoBancoHora(
    //               marcacion.entrada,
    //               marcacion.horaEntrada,
    //               marcacion.salida,
    //               marcacion.horaSalida
    //             ),
    //             isConfirmed: true,
    //             estilo: this.aplicarEstilo(marcacion.entrada, marcacion.salida)
    //           })
    //           .then(function(response) {
    //             console.log("from async" + response);
    //           })
    //           .catch(function(error) {
    //             console.log(error);
    //           });
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     })
    //   );

    //   // this.obtenerDatos();
    //   //cambia de color en la lista
    //   this.applyCss = true;
    //   console.log("after async");
    // },
    // calculoBancoHora(entrada, horaEntrada, salida, horaSalida) {
    //   var entradaBH = moment.duration(entrada, "HH:mm").asMinutes();
    //   var horaEntradaBH = moment.duration(horaEntrada, "HH:mm").asMinutes();
    //   var salidaBH = moment.duration(salida, "HH:mm").asMinutes();
    //   var horaSalida = moment.duration(horaSalida, "HH:mm").asMinutes();

    //   var calculoEntrada = horaEntradaBH - entradaBH;
    //   var calculoSalida = salidaBH - horaSalida;

    //   var total = 0;

    //   if (calculoEntrada > 0) {
    //     total = total + calculoEntrada;
    //   }

    //   if (calculoSalida > 0) {
    //     total = total + calculoSalida;
    //   }

    //   if (total === 0) {
    //     return null;
    //   } else {
    //     return this.handleNegative(total);
    //   }
    // },
    // calcularRetraso(entrada, horaEntrada, salida, horaSalida) {
    //   var entradaBH = moment.duration(entrada, "HH:mm").asMinutes();
    //   var horaEntradaBH = moment.duration(horaEntrada, "HH:mm").asMinutes();
    //   var salidaBH = moment.duration(salida, "HH:mm").asMinutes();
    //   var horaSalida = moment.duration(horaSalida, "HH:mm").asMinutes();

    //   var calculoEntrada = horaEntradaBH - entradaBH;
    //   var calculoSalida = salidaBH - horaSalida;

    //   var total = 0;

    //   if (calculoEntrada < 0) {
    //     total = total + calculoEntrada;
    //   }

    //   if (calculoSalida < 0) {
    //     total = total + calculoSalida;
    //   }

    //   if (total === 0) {
    //     return null;
    //   } else {
    //     return this.handleNegative(total);
    //   }
    // },
    // aplicarEstilo(entrada, salida) {
    //   var estilo = {};
    //   estilo.ausente = false;
    //   estilo.incompleto = false;
    //   if (entrada == null && salida == null) {
    //     console.log("DESDE ESTILO " + entrada, salida);
    //     estilo.ausente = true;
    //     estilo.incompleto = false;
    //     return estilo;
    //   } else {
    //     if (entrada == null || salida == null) {
    //       console.log("DESDE ESTILO " + entrada, salida);
    //       estilo.ausente = false;
    //       estilo.incompleto = true;
    //       return estilo;
    //     }
    //   }
    //   return estilo;
    // },

    // handleHorasExtras(entrada, salida, horasExtras) {
    //   var horasTrabajadas = this.handleHorasTrabajadas(entrada, salida),
    //     result;
    //   console.log("Horas Extras " + horasExtras);
    //   console.log("Horas trabajadas " + horasTrabajadas);
    //   if (!horasTrabajadas.localeCompare("00:00")) {
    //     return "-" + moment.utc(horasExtras * 1000 * 60).format("HH:mm");
    //   } else {
    //     result =
    //       moment.duration(horasTrabajadas, "HH:mm").asMinutes() - horasExtras;
    //     return this.handleNegative(result);
    //   }
    // },
    // obtenerDatos() {
    //   if (this.nombreBusqueda === null) {
    //     var page = JSON.parse(localStorage.getItem("page") || null);
    //     if (page !== null) {
    //       this.pageOne.totalItems = page.totalItems;
    //       this.pageOneChanged(page.currentPage);
    //       localStorage.removeItem("page");
    //     } else {
    //       axios
    //         .get(url + "/marcaciones?_expand=empleado")
    //         .then(response => {
    //           console.log(response.data.length);
    //           this.marcaciones = response.data.slice(
    //             0,
    //             this.pageOne.itemsPerPage - 1
    //           );
    //           this.pageOne.totalItems = response.data.length;
    //         })
    //         .catch(e => {
    //           console.log(e);
    //         });
    //     }
    //   } else {
    //     var nombre = new RegExp(this.nombreBusqueda, "g");
    //     var encontrados = [];
    //     var datosInforme = [];
    //     this.funcionarios.filter(element => {
    //       console.log(element.id, element.nombre);
    //       if (element.nombre.match(nombre)) {
    //         encontrados.push(element.id);
    //       }
    //     });
    //     console.log(JSON.stringify(encontrados));
    //     var query = url + "/marcaciones?";
    //     var flag = true;
    //     for (let value of encontrados) {
    //       if (flag) {
    //         query = query + "funcionarioId=" + value;
    //         flag = false;
    //       } else {
    //         query = query + "&funcionarioId=" + value;
    //       }
    //     }
    //     console.log(query);
    //     this.totalBancoHora = 0;
    //     this.totalRetraso = 0;
    //     this.totalHoraExtra = 0;
    //     axios
    //       .get(query + "&_expand=empleado")
    //       .then(response => {
    //         this.marcaciones = response.data;
    //         Array.from(this.marcaciones).forEach(item => {
    //           console.log("Horas Negativas", JSON.stringify(item.horasExtras));
    //           if (moment.duration(item.horasExtras) < 0) {
    //             this.totalRetraso =
    //               this.totalRetraso +
    //               moment.duration(item.horasExtras, "HH:mm").asMinutes();
    //           } else {
    //             this.totalBancoHora =
    //               this.totalBancoHora +
    //               moment.duration(item.horasExtras, "HH:mm").asMinutes();
    //           }

    //           // this.totalRetraso =
    //           //   this.totalRetraso +
    //           //   moment.duration(item.retraso, "HH:mm").asMinutes();
    //           // this.totalHoraExtra =
    //           //   this.totalHoraExtra +
    //           //   moment.duration(item.horasExtras, "HH:mm").asMinutes();
    //           var informe = {
    //             funcionario: null,
    //             fecha: null,
    //             entrada: null,
    //             salida: null,
    //             horasTrabajadas: null,
    //             bancoHora: null,
    //             retraso: null
    //           };

    //           var listado = {};
    //           listado.fecha = item.fecha;
    //           listado.funcionarioId = item.funcionarioId;
    //           listado.salida = item.salida;
    //           listado.horasTrabajadas = item.horasTrabajadas;
    //           listado.horasExtras = item.horasExtras;
    //           listado.retraso = item.retraso;
    //           listado.bancoHora = item.bancoHora;
    //           listado.isConfirmed = item.isConfirmed;
    //           listado.estilo = item.estilo;
    //           listado.empleadoNombre = item.empleadoNombre;

    //           if (item.horasExtras > 0) {
    //             listado.bancoHoras = item.horasExtras;
    //             this.totalBancoHora =
    //               this.totalBancoHora +
    //               moment.duration(item.horasExtras, "HH:mm").asMinutes();
    //           } else {
    //             if (item.horasExtras < 0) {
    //               listado.descuentos = item.horasExtras;
    //               this.totalRetraso =
    //                 this.totalRetraso +
    //                 moment.duration(item.horasExtras, "HH:mm").asMinutes();
    //             }
    //           }
    //           this.listado.push(listado);

    //           console.log("item array" + JSON.stringify(item));
    //           informe.funcionario = item.empleado.nombre;
    //           informe.fecha = item.fecha;
    //           informe.entrada = item.entrada;
    //           informe.salida = item.salida;
    //           informe.horasTrabajadas = item.horasTrabajadas;
    //           informe.bancoHora = item.bancoHora || "";

    //           informe.retraso = item.retraso || "";
    //           console.log("Banco Hora ", item.bancoHora);
    //           this.json_data.push(informe);
    //           console.log(
    //             JSON.stringify("JSON DATA" + JSON.stringify(this.json_data))
    //           );
    //         });
    //         console.log(response);
    //       })
    //       .catch(e => console.log(e));
    //     console.log(JSON.stringify("Marcaciones pos get" + this.marcaciones));
    //   }
    // },

    // calcularBancoHora() {
    //   var bancoHoraNuevo = [];
    //   var marcaciones = [];
    //   var bancoHora = [];
    //   var modelo = {
    //     funcionarioId: null,
    //     mes: null,
    //     ano: null,
    //     horasCumplidas: null,
    //     horasCumplir: null
    //   };
    //   axios
    //     .get(url + "/marcaciones")
    //     .then(response => {
    //       marcaciones = response.data;
    //       console.log("####Variable Marcaciones####" + marcaciones);
    //       axios
    //         .get(url + "/bancoHora")
    //         .then(response => {
    //           bancoHora = response.data;
    //           console.log("###Variable banco hora####" + bancoHora);
    //           console.log("###Variable banco hora tam####" + bancoHora.length);
    //           if (bancoHora.length > 0) {
    //             console.log("Paso if length");
    //             Array.from(marcaciones).map(marcacion => {
    //               Array.from(bancoHora).map(banco => {
    //                 if (
    //                   marcaciones.funcionarioId === banco.funcionarioId &&
    //                   banco.mes ===
    //                     moment(marcaciones.fecha, "DD/MM/YYYY").month() &&
    //                   banco.ano ===
    //                     moment(marcaciones.fecha, "DD/MM/YYYY").year()
    //                 ) {
    //                   bancoHora.horasCumplidas =
    //                     moment.duration(marcacion.salida, "HH:mm").asMinutes() -
    //                     moment.duration(marcacion.entrada, "HH:mm").asMinutes();
    //                   console.log("paso if largo " + bancoHora.horasCumplidas);
    //                 } else {
    //                   modelo.funcionarioId = marcacion.funcionarioId;
    //                   modelo.mes = moment(
    //                     marcacion.fecha,
    //                     "DD/MM/YYYY"
    //                   ).month();
    //                   modelo.ano = moment(marcacion.fecha, "DD/MM/YYYY").year();
    //                   modelo.horasCumplidas =
    //                     moment.duration(marcacion.salida, "HH:mm").asMinutes() -
    //                     moment.duration(marcacion.entrada, "HH:mm").asMinutes();
    //                   modelo.horasCumplir = null;
    //                   bancoHoraNuevo.push(modelo);
    //                   console.log("entro en el primer else");
    //                 }
    //               });
    //             });
    //           } else {
    //             Array.from(marcaciones).map(marcacion => {
    //               modelo.funcionarioId = marcacion.funcionarioId;
    //               modelo.mes = moment(marcacion.fecha, "DD/MM/YYYY").month();
    //               modelo.ano = moment(marcacion.fecha, "DD/MM/YYYY").year();
    //               modelo.horasCumplidas =
    //                 moment.duration(marcacion.salida, "HH:mm").asMinutes() -
    //                 moment.duration(marcacion.entrada, "HH:mm").asMinutes();
    //               modelo.horasCumplir = null;
    //               bancoHoraNuevo.push(modelo);
    //             });
    //           }
    //         })
    //         .then(response => {
    //           axios
    //             .post(url + "/bancoHora", {
    //               resultado: bancoHoraNuevo
    //             })
    //             .then(response => console.log(response))
    //             .catch(e => console.log(e));
    //         });
    //     })
    //     .catch(e => conosle.log(e));
    // }
  },
  created() {
    this.obtenerAsistencias();
    this.obtenerFuncionarios();
    //this.llamarFuncionarios();
    //this.obtenerDatos();

    /* this.$bindAsArray("funcionarios", funcionariosRef);
    this.$bindAsArray("eventos", calendarioRef);
    this.$bindAsArray("marcaciones", asistenciasRef.limitToLast(51));

    axios.get(asistenciasRef + ".json?shallow=true").then(res => {
      this.pageOne.totalItems = Object.keys(res.data).length;

      var keys = Object.keys(res.data).sort(); // Notice the .sort()!
      var pageLength = 10;
      var pageCount = keys.length / pageLength;
      var key;

      for (var i = 0; i < pageCount; i++) {
        key = keys[i * pageLength];
        this.keyPagination.push(key);
      }

      var page = JSON.parse(localStorage.getItem("page") || null);
      console.log("Pagina" + JSON.stringify(page));
      if (page !== null) {
        this.pageOne.currentPage = page.currentPage;
        this.pageOneChanged(page.currentPage);
      } else {
        this.pageOneChanged(this.pageOne.currentPage);
      }
    });*/

    /*this.$bindAsArray(
      "marcaciones",
      asistenciasRef
        .orderByChild("fecha")
        .startAt("01/12/2017")
        .endAt("02/12/2017/")
        .limitToLast(10)
    );*/

    /*var funcionariosSucursalesRef = funcionariosRef
      .child("-L20uHGA7sTsMIatZmAD")
      .child("sucursalId");

    funcionariosSucursalesRef.on("child_added", function(snap) {
      sucursalesRef.child(snap.key).once("value", function(snapsuc) {
        console.log("SNAP PRINT", snap.val());
        console.log(snapsuc.val());
      });
    });*/

    /*var commentsRef = new Firebase(
      "https://awesome.firebaseio-demo.com/comments"
    );
    var linkRef = new Firebase("https://awesome.firebaseio-demo.com/links");
    var linkCommentsRef = linkRef.child(LINK_ID).child("comments");
    linkCommentsRef.on("child_added", function(snap) {
      commentsRef.child(snap.key()).once("value", function() {
        // Render the comment on the link page.
      });
    });*/
  },
  mounted() {
    this.modal = $(this.$el).find(".ui.longer.modal");
    $(this.$el)
      .find(".ui.dropdown")
      .dropdown();
  }
};
</script>

<style>
.xlsx-button {
  background-color: transparent;
  border: none;
  padding: 0;
  color: rgba(0, 0, 0, 0.87) !important;
}
.ui.right.floated.menu {
  margin-top: 1.7rem;
}
.not-active {
  pointer-events: none;
  cursor: default;
}
/* .el-date-table td.current:not(.disabled),
.el-date-table td.end-date,
.el-date-table td.start-date {
  background-color: #00b5ad !important;
}
.el-date-table td.today {
  color: #00b5ad;
}
.el-date-table td.today:before {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-top: 0.5em solid #00b5ad;
  border-left: 0.5em solid transparent;
}
.el-date-editor.el-input {
  width: 160px;
} */
.el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}
.ui.longer.modal {
  height: 700px;
}
</style>