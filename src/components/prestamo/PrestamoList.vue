<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Prestamos</h4>
      <div class="two fields">
        <div class="field">
          <div class="inline fields">

            <div class="ten wide field field">
              <div class="ui icon input">
                <input type="text" v-model="query.busqueda" @keydown="consultarPrestamos" placeholder="Buscar por nombre del funcionario...">
              </div>
            </div>

            <div class="two wide field">
              <label for="">Rango de Fechas</label>
            </div>

            <div class="four wide field">

              <div class="inline fields">
                <div class="field" :class="{error: error.fechaInicio}">
                  <el-date-picker v-model="query.fechaInicio" type="date" placeholder="Fecha inicio" format="dd/MM/yyyy">
                  </el-date-picker>
                </div>

                <div class="field" :class="{error: error.fechaFin}">
                  <el-date-picker v-model="query.fechaFin" type="date" placeholder="Fecha fin" format="dd/MM/yyyy">
                  </el-date-picker>
                </div>

                <button class="ui circular teal icon button" @click="consultarPrestamos">
                  <i class="search icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="incluirPrestamo">
              <i class="plus icon"></i>
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
            <th>Fecha</th>
            <th>Funcionario</th>
            <th>Monto del Prestamo</th>
            <th class="center aligned">Cuotas</th>
            <th class="center aligned">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="prestamo in prestamos">
            <tr :key="prestamo._id">

              <td>{{moment(prestamo.fecha).format("L")}}</td>
              <td>{{prestamo.nombreFuncionario}}</td>
              <td>{{prestamo.monto}} - {{prestamo.moneda}}</td>
              <td class="center aligned">
                <i class="browser icon" @click="prestamo.showCuotas = !prestamo.showCuotas"></i>
              </td>
              <td class="center aligned">
                <router-link :to="{name: 'editarPrestamo', params: { id: prestamo._id}}">
                  <i class="edit row icon"></i>
                </router-link>

                <i class="trash icon" @click="confirm(prestamo._id)"></i>
              </td>

            </tr>
            <tr v-show="prestamo.showCuotas" :key="prestamo.funcionario">
              <td colspan="5">
                <div class="ui padded segments">
                  <div class="ui segment">

                    <div class="content">
                      <div class="ui divided items">
                        <div class="item">
                          <div class="middle aligned content">
                            <h5> Vencimiento</h5>
                          </div>
                          <div class="middle aligned content">
                            <h5>Monto</h5>
                          </div>
                          <div class="middle aligned content">
                            <h5>Estado</h5>
                          </div>
                        </div>

                        <div class="item" :key="cuota.vencimiento" v-for="cuota in prestamo.cuotas">
                          <div class="middle aligned content">
                            <p>{{moment(cuota.vencimiento).format("L")}}</p>
                          </div>
                          <div class="middle aligned content">
                            <p>{{cuota.monto}}-{{cuota.moneda}}</p>
                          </div>

                          <div class="middle aligned content">
                            <div class="ui orange horizontal label">{{cuota.estado}}</div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                </div>
              </td>
            </tr>
          </template>

        </tbody>
        <tfoot>
          <!-- <tr v-show="showMessage">
            <th colspan="9">
              <div class="ui icon info message">
                <i class="close icon"></i>
                <i class="frown outline icon"></i>
                <div class="header">
                  No hay registros con el resultado que buscabas
                </div>

              </div>
            </th>
          </tr> -->

          <tr v-if="pageOne.totalItems > 10">
            <th colspan="5">
              <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
              </app-pagination>
            </th>
          </tr>
        </tfoot>
      </table>

    </div>

  </div>
</template>

<script>
import moment from "moment";

import Pagination from ".././shared/Pagination.vue";

export default {
  name: "prestamoList",
  data() {
    return {
      prestamos: [],
      modal: null,
      query: {
        fechaInicio: moment()
          .startOf("month")
          .format(),
        fechaFin: moment()
          .endOf("month")
          .format(),
        busqueda: null
      },
      error: {
        hasError: false,
        message: null,
        fechaInicio: false,
        fechaFin: false
      },
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };
  },
  components: {
    appPagination: Pagination
  },
  methods: {
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.obtenerPrestamos();
    },
    incluirPrestamo() {
      this.$router.push({ name: "incluirPrestamo" });
    },
    consultarPrestamos(e) {
      if (e && e.keyEvent === 13) {
        this.obtenerPrestamos(true);
        return;
      } else {
        this.obtenerPrestamos();
      }
    },
    obtenerPrestamos(pageReset) {
      if (pageReset) {
        this.currentPage.pageOne = 1;
      }
      this.$http
        .get(
          `/prestamos?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&inicio=${this.query.fechaInicio}&fin=${
            this.query.fechaFin
          }&busqueda=${this.query.busqueda}`
        )
        .then(response => {
          this.prestamos = response.data.docs.map(item => {
            item.showCuotas = false;
            return item;
          });
          this.pageOne.totalItems = response.data.total;
        });
    },
    confirm(id) {
      console.log(id);
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
          this.eliminarPrestamo(id);
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
    eliminarPrestamo(id) {
      console.log("Id recibido", id);
      var index = this.sucursales.findIndex(i => i.id === id);
      this.$http.delete(`/prestamos/delete/${id}`).then(response => {
        console.log(response);
        this.sucursales.splice(index, 1);
      });
    },
    abrirModal() {
      this.modal.modal("show");
    }
  },
  watch: {
    "query.fechaInicio": function(fecha) {
      if (moment(fecha).isAfter(this.fechaFin)) {
        this.error.hasError = true;
        this.error.fechaInicio = true;
        this.error.message =
          "La fecha inicial debe ser menor o igual a la fecha final";
      } else {
        this.error.hasError = false;
        this.error.fechaInicio = false;
      }
    },
    "query.fechaFin": function(fecha) {
      if (moment(fecha).isBefore(this.fechaInicio)) {
        this.error.hasError = true;
        this.error.fechaFin = true;
        this.error.message =
          "La fecha final debe ser mayor o igual a la fecha inicial";
      } else {
        this.error.hasError = false;
        this.error.fechaFin = false;
      }
    }
  },
  created() {
    this.obtenerPrestamos();
    // this.$bindAsArray("prestamos", prestamosRef);
  },
  mounted() {
    this.modal = $(this.$el).find(".ui.longer.modal");
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
