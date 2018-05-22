<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Adelantos</h4>
      <div class="two fields">
        <div class="field">
          <div class="inline fields">

            <div class="ten wide field">
              <div class="ui icon input">
                <input type="text" v-model="query.busqueda" @keydown="consultarAdelantos" placeholder="Buscar por nombre del funcionario...">
              </div>
            </div>

            <div class="two wide field">
              <label for="">Rango de Fechas</label>
            </div>

            <div class="four wide field">

              <div class="inline fields">
                <div class="field" :class="{error: error.fechaInicio}">
                  <el-date-picker name="fechaInicio" v-model="query.fechaInicio" type="date" placeholder="Fecha inicio" format="dd/MM/yyyy">
                  </el-date-picker>
                </div>

                <div class="field" :class="{error: error.fechaFin}">
                  <el-date-picker name="fechaFin" v-model="query.fechaFin" type="date" placeholder="Fecha fin" format="dd/MM/yyyy">
                  </el-date-picker>
                </div>

                <button :class="{disabled: error.hasError}" class="ui circular teal icon button" @click="consultarAdelantos">
                  <i class="search icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="incluirAdelanto">
              <i class="plus icon"></i>
            </a>

            <a class="icon item" @click="exportRecibo">
              <i class="print icon"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="ui error message" v-show="error.hasError">
      <i class="close icon"></i>
      <div class="header">
        {{this.error.message}}
      </div>

    </div>

    <div class="field">

      <table class="ui teal celled table">
        <thead>
          <tr>
            <th class="collapsing">
              <div class="ui fitted checkbox">
                <input type="checkbox" v-model="selectall">
                <label></label>
              </div>
            </th>
            <th>Fecha</th>
            <th>Funcionario</th>
            <th>Monto</th>
            <th class="center aligned">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="adelanto in adelantos" :key="adelanto._id">
            <td class="collapsing">
              <div class="ui fitted checkbox">
                <input type="checkbox" :value="adelanto._id" v-model="seleccionados">
                <label></label>
              </div>
            </td>
            <td>{{moment(adelanto.fecha).format("L")}}</td>
            <td>{{adelanto.nombreFuncionario}}</td>
            <td>{{adelanto.monto}} {{adelanto.moneda}}</td>
            <td class="center aligned">
              <i class="edit row link icon" @click="editarAdelanto(adelanto._id)"></i>
              <i class="trash link icon" @click="confirm(adelanto._id)"></i>
              <i class="print link icon" @click="exportRecibo(adelanto._id)"></i>
            </td>
            <div class="print">
              <div :id="'recibo'+ adelanto._id" class="ui padded segments">
                <div class="ui horizontal segments">
                  <div class="ui segment">
                    <img src="http://mdl.com.py/template/images/logomarca.png" width="60px">
                    <h4 class="ui header">Recibo de Adelanto de Salario</h4>
                  </div>
                  <div class="ui r aligned segment">
                    <p>Fecha: {{moment().format("L")}}</p>
                    <h4 class="ui header">{{adelanto.monto}} {{adelanto.moneda}}</h4>
                  </div>

                </div>
                <div class="ui segment">
                  <div class="ui small header">{{adelanto.funcionario.nombre}}</div>
                  <span class="ui sub header">CI: 4.5263.621</span>

                  <div class="ui basic segment">
                    <p>Recibi la suma de {{adelanto.monto}} {{adelanto.moneda}}, referente al adelanto de salario por los servicios prestados a la empresa</p>
                  </div>

                  <br>

                  <div class="ui basic center aligned segment">
                    <div class="ui three column grid">
                      <div class="column">
                        <div class="ui divider"></div>
                        <p>Aprobado por</p>
                      </div>
                      <div class="column">
                        <div class="ui divider"></div>
                        <p>Firma del Empleado</p>
                      </div>
                      <div class="column">
                        <div class="ui divider"></div>
                        <p>Pago por</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </tr>

        </tbody>
        <tfoot v-show="pageOne.totalItems > 10">
          <tr>
            <th colspan="5">
              <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
              </app-pagination>
            </th>
          </tr>
        </tfoot>
      </table>

    </div>
    <!-- <div class="print" v-for="adelanto in adelantos" :key="adelanto._id">
      <div class="ui padded segments">
        <div class="ui horizontal segments">
          <div class="ui segment">
            <img src="http://mdl.com.py/template/images/logomarca.png" width="60px">
            <h4 class="ui header">Recibo de Adelanto de Salario</h4>
          </div>
          <div class="ui r aligned segment">
            <p>Fecha: {{moment().format("L")}}</p>
            <h4 class="ui header">Monto: {{adelanto.monto}} {{adelanto.moneda}}</h4>
          </div>

        </div>
        <div class="ui segment">
          <div class="ui small header">{{adelanto.funcionario.nombre}}</div>
          <span class="ui sub header">CI: 4.5263.621</span>

          <div class="ui basic segment">
            <p>Recibi la suma de 540.000 Gs, referente al adelanto de salario por los servicios prestados a la empresa</p>
          </div>

          <br>

          <div class="ui basic center aligned segment">
            <div class="ui three column grid">
              <div class="column">
                <div class="ui divider"></div>
                <p>Aprobado por</p>
              </div>
              <div class="column">
                <div class="ui divider"></div>
                <p>Firma del Empleado</p>
              </div>
              <div class="column">
                <div class="ui divider"></div>
                <p>Pago por</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import moment from "moment";
import Pagination from ".././shared/Pagination.vue";

export default {
  name: "adelantoList",
  data() {
    return {
      adelantos: [],
      busquedaAvanzada: false,
      print: false,
      tipoAdelanto: "quincena",
      query: {
        fechaInicio: moment()
          .startOf("month")
          .format(),
        fechaFin: moment()
          .endOf("month")
          .format(),
        busqueda: null
      },
      checked: false,
      checkedAll: false,
      seleccionados: [],
      error: {
        hasError: false,
        message: null,
        fechaInicio: false,
        fechaFin: false
      },
      pageOne: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
      }
    };
  },
  methods: {
    incluirAdelanto() {
      this.$router.push({ name: "incluirAdelanto" });
    },
    editarAdelanto(adelantoId) {
      this.$router.push({ name: "editarAdelanto", params: { id: adelantoId } });
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.getDataAdelantos();
      // this.obtenerListadoAdelanto();
    },
    showPrint() {
      this.print = !this.print;
    },
    exportRecibo(id) {
      printJS({
        printable: "recibo" + id,
        type: "html",
        targetStyles: ["*"]
      });
    },
    consultarAdelantos(e) {
      if (e && e.keyCode === 13) {
        this.getDataAdelantos(true);
        return;
      } else {
        this.getDataAdelantos(true);
      }
    },
    getDataAdelantos(pageReset) {
      if (pageReset) {
        this.pageOne.currentPage = 1;
      }

      this.$http
        .get(
          `/adelantos/?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&inicio=${this.query.fechaInicio}&fin=${
            this.query.fechaFin
          }&busqueda=${this.query.busqueda}`
        )
        .then(response => {
          this.adelantos = response.data.docs;
          this.pageOne.totalItems = response.data.total;
        });
    },
    obtenerListadoAdelanto() {
      this.$http
        .get(
          `/adelantos/?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }`
        )
        .then(response => {
          this.adelantos = response.data.docs;
          this.pageOne.totalItems = response.data.total;
        });
    },
    confirm(id) {
      this.$confirm(
        "El registro sera eliminado permanentemente. Desea Continuar?",
        "Atencion!",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.eliminarAdelanto(id);
          this.$message({
            type: "success",
            message: "Registro Eliminado"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    },
    eliminarAdelanto(id) {
      var index = this.adelantos.findIndex(i => i.id === id);
      this.adelantos.splice(index, 1);

      this.$http.delete(`/adelantos/delete/${id}`);
    }
  },
  components: {
    appPagination: Pagination
  },
  computed: {
    selectall: {
      get: function() {
        return this.adelantos
          ? this.seleccionados.length == this.adelantos.length
          : false;
      },
      set: function(value) {
        var seleccionados = [];

        if (value) {
          this.adelantos.forEach(function(adelanto) {
            seleccionados.push(adelanto._id);
          });
        }

        this.seleccionados = seleccionados;
      }
    }
  },
  watch: {
    "query.fechaInicio": function(fecha) {
      console.log("Print from watch", fecha);
      if (moment(fecha).isAfter(this.query.fechaFin)) {
        this.error.hasError = true;
        this.error.message =
          "La fecha inicial debe ser menor o igual a la fecha final";
        this.error.fechaInicio = true;
      } else {
        this.error.hasError = false;
        this.error.fechaInicio = false;
      }
    },
    "query.fechaFin": function(fecha) {
      if (moment(fecha).isBefore(this.query.fechaInicio)) {
        this.error.hasError = true;
        this.error.message =
          "La fecha final debe ser mayor o igual a la fecha inicial";
        this.error.fechaFin = true;
      } else {
        this.error.hasError = false;
        this.error.fechaFin = false;
      }
    }
  },
  created() {
    // this.obtenerListadoAdelanto();
    this.getDataAdelantos();
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}

.print {
  display: none;
}

@media print {
  body :not(.both) {
    display: none;
  }
  .print {
    display: block !important;
  }
}
</style>
