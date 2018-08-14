<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Adelantos</h4>
      <div class="two fields">
        <div class="field">
          <div class="inline fields">

            <div class="ten wide field">
              <div class="ui icon input">
                <input type="text" v-model="query.parameter" @keydown="searchAdvanceSalary" placeholder="Buscar por nombre del funcionario...">
              </div>
            </div>

            <div class="two wide field">
              <label for="">Rango de Fechas</label>
            </div>

            <div class="four wide field">

              <div class="inline fields">
                <div class="field" :class="{error: error.startDate}">
                  <el-date-picker name="startDate" v-model="query.startDate" type="date" placeholder="Fecha inicio" format="dd/MM/yyyy">
                  </el-date-picker>
                </div>

                <div class="field" :class="{error: error.endDate}">
                  <el-date-picker name="endDate" v-model="query.endDate" type="date" placeholder="Fecha fin" format="dd/MM/yyyy">
                  </el-date-picker>
                </div>

                <button :class="{disabled: error.hasError}" class="ui circular teal icon button" @click="searchAdvanceSalary">
                  <i class="search icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="addAdvance">
              <i class="plus icon"></i>
            </a>

            <a class="icon item" @click="printSelectedReceipts">
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
          <tr v-for="(advance, index) in advances" :key="advance._id">
            <td class="collapsing">
              <div class="ui fitted checkbox">
                <input type="checkbox" :value="advance._id" v-model="advancesSelected">
                <label></label>
              </div>
            </td>
            <td>{{moment(advance.date).format("L")}}</td>
            <td>{{advance.employeeName}}</td>
            <td>{{advance.amount.toLocaleString()}} {{advance.coin}}</td>
            <td class="center aligned">
              <i class="edit row link icon" @click="editAdvance(advance._id)"></i>
              <i class="trash link icon" @click="deleteAdvanceSalary(advance._id, index)"></i>
              <i class="print link icon" @click="exportReceipt(advance._id)"></i>
            </td>
            <div class="print">
              <div :id="'recibo'+ advance._id" class="ui padded segments">
                <div class="ui horizontal segments">
                  <div class="ui segment">
                    <img src="http://mdl.com.py/template/images/logomarca.png" width="60px">
                    <h4 class="ui header">Recibo de Adelanto de Salario</h4>
                  </div>
                  <div class="ui r aligned segment">
                    <p>Fecha: {{moment().format("L")}}</p>
                    <h4 class="ui header">{{formatAmount(advance.amount)}} {{advance.coin}}</h4>
                  </div>

                </div>
                <div class="ui segment">
                  <div class="ui small header">{{advance.employee.name}}</div>
                  <span class="ui sub header">CI/RG: {{formatAmount(advance.employee.identityNumber)}} </span>

                  <div class="ui basic segment">
                    <p>Recibi la suma de {{formatAmount(advance.amount)}} {{advance.coin}}, referente al adelanto de salario por los servicios prestados a la empresa</p>
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
    <div id="SelectedReceipt">
      <title>Prueba</title>
      <ul v-for="advance in printAdvanceSelected" :key="advance._id">
        <li>{{advance.employee.name}}</li>
        <li>{{advance.amount}}</li>
      </ul>

    </div>

  </div>
</template>

<script>
import moment from "moment";
import Pagination from ".././shared/Pagination.vue";

export default {
  name: "advanceList",
  data() {
    return {
      advances: [],
      printAdvanceSelected: [],
      print: false,
      advanceType: "quincena",
      query: {
        startDate: moment()
          .startOf("month")
          .format(),
        endDate: moment()
          .endOf("month")
          .format(),
        parameter: null
      },
      checked: false,
      checkedAll: false,
      advancesSelected: [],
      error: {
        hasError: false,
        message: null,
        startDate: false,
        endDate: false
      },
      pageOne: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
      }
    };
  },
  methods: {
    addAdvance() {
      this.$router.push({ name: "includeAdvance" });
    },
    editAdvance(advanceId) {
      this.$router.push({ name: "editAdvance", params: { id: advanceId } });
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.getAdvances();
    },
    showPrint() {
      this.print = !this.print;
    },
    formatAmount(value) {
      return value.toLocaleString();
    },
    printSelectedReceipts() {
      // debugger;
      this.advances.forEach(advance => {
        var index = this.advancesSelected.findIndex(idAdvance => {
          return idAdvance === advance._id;
        });

        if (index !== -1) {
          this.printAdvanceSelected.push(advance);
        }
      });
      this.$router.push({
        name: "printAdvances",
        params: { advances: this.printAdvanceSelected }
      });
      // console.log(routeData);
      // window.open(routeData.href, this.printSelectedReceipts, "_blank");
    },

    exportReceipt(id) {
      printJS({
        printable: "recibo" + id,
        type: "html",
        targetStyles: ["*"]
      });
    },
    searchAdvanceSalary(e) {
      if (e && e.keyCode === 13) {
        this.getAdvances(true);
        return;
      } else {
        this.getAdvances(true);
      }
    },
    getAdvances(pageReset) {
      if (pageReset) {
        this.pageOne.currentPage = 1;
      }

      this.$http
        .get(
          `/advances/?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&startDate=${this.query.startDate}&endDate=${
            this.query.endDate
          }&parameter=${this.query.parameter}`
        )
        .then(response => {
          this.advances = response.data.docs;
          this.pageOne.totalItems = response.data.total;
        });
    },

    deleteAdvanceSalary(advanceId, index) {
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
          this.$http.delete(`/advances/delete/${advanceId}`).then(response => {
            if (response.status === 200) {
              this.advances.splice(index, 1);
              this.$message({
                type: "success",
                message: "Registro Eliminado"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    }
  },
  components: {
    appPagination: Pagination
  },
  computed: {
    selectall: {
      get: function() {
        return this.advances
          ? this.advancesSelected.length == this.advances.length
          : false;
      },
      set: function(value) {
        var advancesSelected = [];

        if (value) {
          this.advances.forEach(function(advance) {
            advancesSelected.push(advance._id);
          });
        }

        this.advancesSelected = advancesSelected;
      }
    }
  },
  watch: {
    "query.startDate": function(fecha) {
      console.log("Print from watch", fecha);
      if (moment(fecha).isAfter(this.query.endDate)) {
        this.error.hasError = true;
        this.error.message =
          "La fecha inicial debe ser menor o igual a la fecha final";
        this.error.startDate = true;
      } else {
        this.error.hasError = false;
        this.error.startDate = false;
      }
    },
    "query.endDate": function(fecha) {
      if (moment(fecha).isBefore(this.query.startDate)) {
        this.error.hasError = true;
        this.error.message =
          "La fecha final debe ser mayor o igual a la fecha inicial";
        this.error.endDate = true;
      } else {
        this.error.hasError = false;
        this.error.endDate = false;
      }
    }
  },
  created() {
    this.getAdvances();
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
