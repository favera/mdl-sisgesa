<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Prestamos</h4>
      <div class="two fields">
        <div class="field">
          <div class="inline fields">

            <div class="ten wide field field">
              <div class="ui icon input">
                <input type="text" v-model="query.parameter" @keydown="searchLending" placeholder="Buscar por nombre del funcionario...">
              </div>
            </div>

            <div class="two wide field">
              <label for="">Rango de Fechas</label>
            </div>

            <div class="four wide field">

              <div class="inline fields">
                <div class="field" :class="{error: error.startDate}">
                  <el-date-picker v-model="query.startDate" type="date" placeholder="Fecha inicio" format="dd/MM/yyyy">
                  </el-date-picker>
                </div>

                <div class="field" :class="{error: error.endDate}">
                  <el-date-picker v-model="query.endDate" type="date" placeholder="Fecha fin" format="dd/MM/yyyy">
                  </el-date-picker>
                </div>

                <button class="ui circular teal icon button" @click="searchLending">
                  <i class="search icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="addLending">
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
          <template v-for="(lending, index) in lendings">
            <tr :key="lending._id">

              <td>{{moment(lending.date).format("L")}}</td>
              <td>{{lending.employeeName}}</td>
              <td>{{lending.amount.toLocaleString()}} - {{lending.coin}}</td>
              <td class="center aligned">
                <i class="browser link icon " @click="lending.showInstallments = !lending.showInstallments"></i>
              </td>
              <td class="center aligned">
                <span>
                  <i class="edit row link icon " @click="editLending(lending._id)"></i>
                  <i class="trash link icon " @click="deleteLending(lending._id, index)"></i>
                </span>

              </td>

            </tr>
            <tr v-show="lending.showInstallments">
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

                        <div class="item" :key="installment._id" v-for="installment in lending.installments">
                          <div class="middle aligned content">
                            <p>{{moment(installment.dueDate).format("L")}}</p>
                          </div>
                          <div class="middle aligned content">
                            <p>{{installment.amount.toLocaleString()}}-{{installment.coin}}</p>
                          </div>

                          <div class="middle aligned content">
                            <div class="ui orange horizontal label" v-if="installment.status ===  'pendiente'">{{installment.status}}</div>
                            <div class="ui blue horizontal label" v-if="installment.status ===  'procesado'">{{installment.status}}</div>
                            <div class="ui olive horizontal label" v-if="installment.status ===  'pagado'">{{installment.status}}</div>
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
  name: "lendingList",
  data() {
    return {
      lendings: [],
      modal: null,
      query: {
        startDate: moment()
          .startOf("year")
          .format(),
        endDate: moment()
          .endOf("year")
          .format(),
        parameter: null
      },
      error: {
        hasError: false,
        message: null,
        startDate: false,
        endDate: false
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
      this.getLendings();
    },
    addLending() {
      this.$router.push({ name: "includeLending" });
    },
    editLending(lendingId) {
      this.$router.push({ name: "editarPrestamo", params: { id: lendingId } });
    },
    searchLending(e) {
      if (e && e.keyEvent === 13) {
        this.getLendings(true);
        return;
      } else {
        this.getLendings();
      }
    },
    getLendings(pageReset) {
      if (pageReset) {
        this.currentPage.pageOne = 1;
      }
      this.$http
        .get(
          `/lendings?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&inicio=${this.query.startDate}&fin=${
            this.query.endDate
          }&parameter=${this.query.parameter}`
        )
        .then(response => {
          this.lendings = response.data.docs.map(item => {
            item.showInstallments = false;
            return item;
          });
          this.pageOne.totalItems = response.data.total;
        });
    },
    deleteLending(lendingId, index) {
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
          this.$http.delete(`/lendings/delete/${lendingId}`).then(response => {
            if (response.status === 200) {
              this.lendings.splice(index, 1);
              this.$message({
                type: "success",
                message: "Registro Eliminado"
              });
            }
          });
        })
        .catch(e => {
          console.log(e);
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    }
  },
  watch: {
    "query.startDate": function(fecha) {
      if (moment(fecha).isAfter(this.endDate)) {
        this.error.hasError = true;
        this.error.startDate = true;
        this.error.message =
          "La fecha inicial debe ser menor o igual a la fecha final";
      } else {
        this.error.hasError = false;
        this.error.startDate = false;
      }
    },
    "query.endDate": function(fecha) {
      if (moment(fecha).isBefore(this.startDate)) {
        this.error.hasError = true;
        this.error.endDate = true;
        this.error.message =
          "La fecha final debe ser mayor o igual a la fecha inicial";
      } else {
        this.error.hasError = false;
        this.error.endDate = false;
      }
    }
  },
  created() {
    this.getLendings();
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
