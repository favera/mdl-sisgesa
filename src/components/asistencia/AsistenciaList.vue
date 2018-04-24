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
            <tr v-show="warningMessage">
              <td colspan="4">
                <div class="ui yellow message">
                  <h4>Los datos de la planilla actualmente ya existen en el sistema. Por favor, verifique los datos</h4>
                </div>
              </td>

            </tr>
          </tbody>
        </table>

      </div>
      <div class="actions">

        <button class="ui positive teal button" v-show="!warningMessage" @click="guardarMarcaciones">Aceptar</button>
        <div class="ui deny button" @click="cancelarArchivo">Cancelar</div>

      </div>
    </div>

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Asistencia</h4>

      <div class="two fields">

        <div class="fifteen wide field">

          <div class="inline fields">

            <div class="ten wide field">

              <div class="ui icon input">
                <input type="text" placeholder="Buscar por nombre" @keydown="consultarAsistencia" v-model="query.busqueda">
                <i class="search icon" v-if="busquedaAvanzada"></i>
                <i @click="consultarAsistencia" class="inverted teal circular search link icon" v-else></i>

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
              <button @click="consultarAsistencia" class="ui circular teal icon button">
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

          <tfoot>
            <tr v-show="showMessage">
              <th colspan="9">
                <div class="ui icon info message">
                  <i class="close icon"></i>
                  <i class="frown outline icon"></i>
                  <div class="header">
                    No hay registros con el resultado que buscabas
                  </div>

                </div>
              </th>
            </tr>

            <tr v-if="pageOne.totalItems > 10">
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
import Pagination from ".././shared/Pagination.vue";

export default {
  name: "asistenciaList",
  data() {
    return {
      busquedaAvanzada: false,
      feriadosAnuales: [],
      showMessage: false,
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
      validarPlanilla: [],
      postMarcaciones: [],
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
      warningMessage: false,
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
  computed: {},
  methods: {
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.queryData();
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
    consultarAsistencia(e) {
      if (e && e.keyEvent === 13) {
        this.queryData(true);
        return;
      } else {
        this.queryData(true);
      }
    },
    queryData(pageReset) {
      if (pageReset) {
        this.pageOne.currentPage = 1;
      }

      if (!this.query.rangoFecha.inicio && !this.query.rangoFecha.fin) {
        this.query.rangoFecha.inicio = moment()
          .startOf("month")
          .format();
        this.query.rangoFecha.fin = moment()
          .endOf("month")
          .format();
      }

      if (!this.query.rangoFecha.inicio && this.query.rangoFecha.fin) {
        this.query.rangoFecha.inicio = moment()
          .startOf("month")
          .format();
      }

      if (this.query.rangoFecha.inicio && !this.query.rangoFecha.fin) {
        this.query.rangoFecha.fin = moment()
          .endOf("month")
          .format();
      }

      if (this.query.estado === "todos") {
        this.$http
          .get(
            `/asistencias/query-data?page=${this.pageOne.currentPage}&limit=${
              this.pageOne.itemsPerPage
            }&inicio=${this.query.rangoFecha.inicio}&fin=${
              this.query.rangoFecha.fin
            }&busqueda=${this.query.busqueda}&estado=${this.query.estado}`
          )
          .then(response => {
            if (response.data.docs.length === 0) {
              this.marcaciones.length = 0;
              this.showMessage = true;
            } else {
              this.showMessage = false;
              this.marcaciones = response.data.docs;
              this.pageOne.totalItems = response.data.total;
            }
          });
      } else {
        this.$http
          .get(
            `/asistencias/query-data?page=${this.pageOne.currentPage}&limit=${
              this.pageOne.itemsPerPage
            }&inicio=${this.query.rangoFecha.inicio}&fin=${
              this.query.rangoFecha.fin
            }&estado=${this.query.estado}&busqueda=${this.query.busqueda}`
          )
          .then(response => {
            if (response.data.docs.length === 0) {
              this.marcaciones.length = 0;
              this.showMessage = true;
            } else {
              this.showMessage = false;
              this.marcaciones = response.data.docs;
              this.pageOne.totalItems = response.data.total;
            }
          });
      }
    },
    obtenerFuncionarios() {
      this.$http.get(`/funcionarios/full-list`).then(response => {
        this.funcionarios = response.data;
      });
    },
    obtenerAsistencias() {
      this.$http
        .get(
          `/asistencias?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }`,
          {
            headers: {
              "x-auth": localStorage.token
            }
          }
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
    //verifica que la fecha pasada se encuentra en el array de feriados anuales y retorna el indice
    retornarDiaFeriado(fecha) {
      return this.feriadosAnuales.findIndex(feriado => {
        console.log(
          "Fecha Recibida en retornarDiaferiado",
          fecha,
          feriado.fechaFeriado
        );
        return moment(feriado.fechaFeriado).isSame(fecha);
      });
    },
    //retorna el valor en horas de horas extras para el banco de horas
    calculoBancoH(entrada, salida, funcionarioId, fecha) {
      var sabadoMedioTiempo,
        cargaLaboral,
        funcionario,
        horasTrabajadas,
        horasExtras,
        verFecha,
        diaFeriado;
      //verifica que la fecha pasada es o no un feriado
      diaFeriado = this.retornarDiaFeriado(fecha);
      console.log("Resultado de retonar dia Feriado", diaFeriado);
      verFecha = new Date(fecha);
      funcionario = this.funcionarios.find(funcionario => {
        if (funcionario._id === funcionarioId) {
          return funcionario;
        }
        return null;
      });

      if (funcionario) {
        sabadoMedioTiempo = funcionario.medioTiempo;
        cargaLaboral = funcionario.cargaLaboral;
      }

      console.log(verFecha);

      //si isSabado es true, si el dia es sabado
      if (this.isSabado !== -1) {
        //si el funcionario tiene habilitado sabado medio tiempo
        if (sabadoMedioTiempo) {
          horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

          console.log("Resultado Horas Trabajadas", horasTrabajadas);

          if (!horasTrabajadas.localeCompare("00:00")) {
            console.log("ENTRO al COMPARE");
            return null;
          }
          horasExtras =
            moment.duration(horasTrabajadas, "HH:mm").asMinutes() - 300;
          console.log("Resultado Horas Extras", horasExtras);
          if (horasExtras > 0) {
            return this.handleNegative(horasExtras);
          }
          return null;

          //else del no tiene sabado habilitado
        } else {
          horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

          console.log("Resultado Horas Trabajadas", horasTrabajadas);

          if (!horasTrabajadas.localeCompare("00:00")) {
            return null;
          }

          console.log("Carga Laboral", cargaLaboral);

          horasExtras =
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
        if (verFecha.getDay() === 0 || diaFeriado !== -1) {
          horasExtras = this.handleHorasTrabajadas(entrada, salida);
          console.log(horasExtras);
          return horasExtras;
        } else {
          horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

          console.log("Resultado Horas Trabajadas", horasTrabajadas);

          if (!horasTrabajadas.localeCompare("00:00")) {
            return null;
          }
          horasExtras =
            moment.duration(horasTrabajadas, "HH:mm").asMinutes() -
            moment.duration(cargaLaboral, "HH:mm").asMinutes();

          console.log("Resultado Horas Extras", horasExtras);

          if (horasExtras > 0) {
            return this.handleNegative(horasExtras);
          }

          return null;
        }
      }
    },
    //Retorna el valor en horas de las horas faltantes del funcionario
    calculoHorasFaltantes(entrada, salida, funcionarioId, fecha) {
      var sabadoMedioTiempo,
        cargaLaboral,
        funcionario,
        horasTrabajadas,
        result,
        horasExtras,
        verFecha,
        diaFeriado;

      diaFeriado = this.retornarDiaFeriado(fecha);
      verFecha = new Date(fecha);

      funcionario = this.funcionarios.find(funcionario => {
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
          (horasTrabajadas = this.handleHorasTrabajadas(entrada, salida)),
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
          horasTrabajadas = this.handleHorasTrabajadas(entrada, salida);

          if (!horasTrabajadas.localeCompare("00:00")) {
            return "-" + cargaLaboral;
          }
          horasExtras =
            moment.duration(horasTrabajadas, "HH:mm").asMinutes() -
            moment.duration(cargaLaboral, "HH:mm").asMinutes();

          if (horasExtras < 0) {
            return this.handleNegative(horasExtras);
          }

          return null;
        }
      } else {
        if (verFecha.getDay() === 0 || diaFeriado !== -1) {
          horasExtras = "00:00";

          return horasExtras;
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
      }
    },
    //verifica si es domingo o no para insertar texto en observacion
    handleObservacion(fecha) {
      var domingo = new Date(fecha);
      var diaFeriado = this.retornarDiaFeriado(new Date(fecha));
      if (domingo.getDay() === 0) {
        return "Hora Extra Domingo";
      }

      if (diaFeriado !== -1) {
        return "Hora Extra por Dia Feriado";
      }

      return "";
    },

    nuevaAsistencia() {
      this.$router.push({ name: "incluirAsistencia" });
    },
    llamarFuncionarios() {
      this.$http.get("/empleados?_expand=sucursal").then(response => {
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
            message: "Registro Eliminado exitosamente"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso cancelado"
          });
        });
    },
    eliminarAsistencia(id) {
      var index = this.marcaciones.findIndex(i => i.id === id);
      this.marcaciones.splice(index, 1);
      this.$http
        .delete(`/asistencias/delete/${id}`)
        .then(response => console.log(response));
    },
    obtenerFeriados() {
      var firstDayYear = moment()
        .startOf("year")
        .format();
      var lastDayYear = moment()
        .endOf("year")
        .format();
      this.$http
        .get(`/eventos/feriados?inicio=${firstDayYear}&fin=${lastDayYear}`)
        .then(response => {
          this.feriadosAnuales = response.data;
        });
    },
    handleSelectedFile(convertedData) {
      this.datosMarcaciones.length = 0;
      this.validarPlanilla.length = 0;
      //Pasamos los datos del archivo excel a preDatos
      this.preDatos = convertedData.body;
      var fecha = moment(this.preDatos[0].Horario, "DD/MM/YYYY").format();
      console.log("Fecha Format", fecha);
      //Trae las asistencias de la fecha pasada
      this.$http
        .get(`/asistencias/full-list?fechaPlanilla=${fecha}`)
        .then(response => {
          console.log("Response Length", response.data.length);
          if (response.data.length > 0) {
            var asistenciaRetorno = response.data;
            console.log(JSON.stringify(asistenciaRetorno));

            this.preDatos.forEach(asistenciaPlanilla => {
              var noExiste = asistenciaRetorno.findIndex(asistenciaBackend => {
                return (
                  asistenciaBackend.funcionario.acnro ===
                  asistenciaPlanilla["AC-No."]
                );
              });
              console.log("Existe Funcionario", noExiste);
              if (noExiste === -1) {
                this.validarPlanilla.push(asistenciaPlanilla);
              }
            });
            if (!this.validarPlanilla.length) {
              this.warningMessage = true;
            }
          } else {
            this.validarPlanilla = convertedData.body;
          }

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
        });
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
      for (let item of this.validarPlanilla) {
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
          dato.funcionarioId,
          dato.fecha
        );

        marcacion.horasFaltantes = this.calculoHorasFaltantes(
          dato.entrada,
          dato.salida,
          dato.funcionarioId,
          dato.fecha
        );

        marcacion.observacion = this.handleObservacion(dato.fecha);
        marcacion.estilo = this.aplicarEstiloMarcacion(
          dato.entrada,
          dato.salida
        );

        this.postMarcaciones.push(marcacion);
      });

      this.verificarAusenciasVacaciones();
      // console.log(this.datosMarcaciones[0].fecha);
      // var fecha = new Date(this.datosMarcaciones[0].fecha);
      // var diaFeriado = this.retornarDiaFeriado(fecha);
      // //si no es domingo verificar si esta de vacaciones o ausente
      // if (fecha.getDay() !== 0 && diaFeriado === -1) {
      //   //nuevo loop por funcionario para poder verificar si tiene marcaciones en datos marcaciones
      //   this.funcionarios.forEach(async funcionario => {
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
      //         var fecha, fechaInicio, fechaFin, isFechaVacaciones, respuesta;
      //         respuesta = await this.$http.get(
      //           `/eventos/edit/${funcionario.vacaciones}`
      //         );
      //         console.log(respuesta);

      //         // debugger;
      //         // respuesta = await this.returnVacacionesData(
      //         //   funcionario.vacaciones
      //         // );
      //         // debugger;

      //         console.log("Respuesta del async", respuesta);
      //         fechaInicio = respuesta.data.fechaInicio;
      //         fechaFin = respuesta.data.fechaFin;

      //         fecha = moment(this.datosMarcaciones[0].fecha).format();
      //         console.log("Fecha a comparar", fecha, typeof fecha);
      //         isFechaVacaciones = moment(fecha).isBetween(
      //           fechaInicio,
      //           fechaFin,
      //           null,
      //           "[]"
      //         );
      //         console.log(
      //           "Resultado de evaluacion fecha vacaciones",
      //           isFechaVacaciones
      //         );
      //         if (isFechaVacaciones) {
      //           marcacion.fecha = this.datosMarcaciones[0].fecha;
      //           marcacion.funcionario = funcionario._id;
      //           marcacion.nombreFuncionario = funcionario.nombre;
      //           marcacion.entrada = null;
      //           marcacion.salida = null;
      //           marcacion.horasTrabajadas = null;
      //           marcacion.horasExtras = null;
      //           marcacion.horasFaltantes = null;
      //           marcacion.observacion = "Vacaciones";
      //           marcacion.estilo.ausente = false;
      //           marcacion.estilo.incompleto = false;
      //           marcacion.estilo.vacaciones = true;
      //           console.log("Persona de vacaciones", JSON.stringify(marcacion));
      //           this.ausencias.push(marcacion);
      //           console.log(JSON.stringify(this.ausencias));
      //         }
      //       } else {
      //         console.log("Entro en el Else");
      //         //si no cumplio condiciones anteriores, es una ausencia.
      //         marcacion.fecha = this.datosMarcaciones[0].fecha;
      //         marcacion.funcionario = funcionario._id;
      //         marcacion.nombreFuncionario = funcionario.nombre;
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
      //       }
      //     }
      //   });
      // }
      // console.log("Array Ausencias", JSON.stringify(this.ausencias));
      // console.log("Array Marcaciones", JSON.stringify(this.postMarcaciones));
      // if (this.ausencias.length > 0) {
      //   this.postMarcaciones = this.ausencias.concat(this.postMarcaciones);
      // }

      // console.log(
      //   "Despues de concatenar",
      //   JSON.stringify(this.postMarcaciones)
      // );

      // this.$http
      //   .post(`/asistencias/test-data`, this.postMarcaciones)
      //   .then(response => {
      //     this.$message({
      //       type: "success",
      //       message: "Registro insertado exitosamente"
      //     });
      //     this.postMarcaciones.length = 0;
      //     this.queryData();
      //     // this.obtenerAsistencias();
      //     console.log(response);
      //   });
    },
    async verificarAusenciasVacaciones() {
      console.log(this.datosMarcaciones[0].fecha);
      var fecha = new Date(this.datosMarcaciones[0].fecha);
      var diaFeriado = this.retornarDiaFeriado(fecha);
      //si no es domingo verificar si esta de vacaciones o ausente
      if (fecha.getDay() !== 0 && diaFeriado === -1) {
        //nuevo loop por funcionario para poder verificar si tiene marcaciones en datos marcaciones
        for (let funcionario of this.funcionarios) {
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
              var fecha, fechaInicio, fechaFin, isFechaVacaciones, respuesta;
              respuesta = await this.$http.get(
                `/eventos/edit/${funcionario.vacaciones}`
              );
              console.log(respuesta);

              console.log("Respuesta del async", respuesta);
              fechaInicio = respuesta.data.fechaInicio;
              fechaFin = respuesta.data.fechaFin;

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
              if (isFechaVacaciones) {
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
                console.log("Persona de vacaciones", JSON.stringify(marcacion));
                this.ausencias.push(marcacion);
                console.log(JSON.stringify(this.ausencias));
              }
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
        }
      }
      console.log("Array Ausencias", JSON.stringify(this.ausencias));
      console.log("Array Marcaciones", JSON.stringify(this.postMarcaciones));
      if (this.ausencias.length > 0) {
        this.postMarcaciones = this.ausencias.concat(this.postMarcaciones);
      }

      console.log(
        "Despues de concatenar",
        JSON.stringify(this.postMarcaciones)
      );

      this.$http
        .post(`/asistencias/test-data`, this.postMarcaciones)
        .then(response => {
          this.$message({
            type: "success",
            message: "Registro insertado exitosamente"
          });
          this.postMarcaciones.length = 0;
          this.queryData();
          // this.obtenerAsistencias();
          console.log(response);
        });
    },
    async returnVacacionesData(vacaciones) {
      let response = await this.$http.get(`/eventos/edit/${vacaciones}`);
      console.log("Response", response);
      return response;
    }
  },
  created() {
    this.queryData();
    this.obtenerFuncionarios();
    this.obtenerFeriados();
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

.not-active {
  pointer-events: none;
  cursor: default;
}
.el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}
.ui.longer.modal {
  height: 700px;
}
</style>