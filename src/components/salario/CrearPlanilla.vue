<template>
    <div class="ui twelve wide column">

        <div class="ui longer modal">
            <div class="header"> Incluir Periodo para Planilla de Salario </div>
            <div class="content">

                <form class="ui form" @submit.prevent="includePeriod">
                    <div class="required field">
                        <label>Seleccione Mes</label>
                        <div class="field" :class="{error: errors.has('monthPeriod')}">
                            <el-date-picker name="monthPeriod" data-vv-as="mes" v-validate="'required'" type="month" placeholder="Seleccionar Mes" v-model="salaryData.month" format="MMMM">
                            </el-date-picker>
                            <div class="info-error" v-show="errors.has('monthPeriod')">{{errors.first('monthPeriod')}}</div>
                        </div>
                    </div>
                    <div class="required field">
                        <label>Seleccione Año</label>
                        <div class="field" :class="{error: errors.has('yearPeriod')}">
                            <el-date-picker name="yearPeriod" data-vv-as="año" v-validate="'required'" type="year" placeholder="Seleccionar Año" v-model="salaryData.year" format="yyyy"></el-date-picker>
                            <div class="info-error" v-show="errors.has('yearPeriod')">{{errors.first('yearPeriod')}}</div>
                        </div>
                    </div>

                    <div class="actions">

                        <button class="ui teal button">Aceptar</button>
                        <div class="ui deny button">Cancelar</div>

                    </div>

                </form>

            </div>

        </div>

        <div class="ui form">
            <h4 class="ui dividing header">Listado de Planilla de Salarios</h4>
            <div class="two fields">
                <div class="ui twelve wide field">
                    <div class="inline fields">

                        <label for="">Mes:</label>

                        <div class="field">
                            <el-date-picker type="month" placeholder="Seleccionar Mes" v-model="query.month" format="MMMM">
                            </el-date-picker>
                        </div>
                        <label for="">Año:</label>

                        <div class="field">
                            <el-date-picker type="year" placeholder="Seleccionar Año" format="yyyy" v-model="query.year">
                            </el-date-picker>
                        </div>

                    </div>

                </div>

                <div class="ui four wide field">

                    <div class="ui right floated main menu">
                        <a class="icon item">

                            <i class="plus icon" @click="abrirModal()"></i>

                        </a>
                    </div>

                </div>

            </div>

            <div class="field">

                <table class="ui teal celled table">
                    <thead>
                        <tr>
                            <th>Periodo</th>
                            <th>Estado</th>
                            <th class="center aligned">Opciones</th>

                        </tr>
                    </thead>

                    <tbody>

                        <tr v-for="payment in payroll" :key="payment._id">
                            <td>{{moment(payment.month).format("MMMM")}} - {{moment(payment.year).format("YYYY")}}</td>
                            <td>{{payment.status}}</td>
                            <td class="center aligned">
                                <i class="zoom link icon" @click="detallePlanilla(payment._id, payment.month, payment.year)"></i>
                                <i class="plus link  icon" @click="editarPlanilla(payment._id, payment.month, payment.year)"></i>
                                <i class="edit link icon"></i>
                                <i class="checkmark box link icon"></i>
                                <i class="trash link icon"></i>
                            </td>
                        </tr>

                    </tbody>
                    <tfoot>
                        <tr>
                            <th colspan="3">
                                <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged"></app-pagination>
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
  data() {
    return {
      query: {
        month: null,
        year: null
      },
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
      },
      payroll: [],
      modal: null,
      salaryData: {
        month: null,
        year: null,
        status: "Pendiente",
        salaryDetail: []
      }
    };
  },
  components: {
    appPagination: Pagination
  },
  methods: {
    pageOneChanged() {},
    detallePlanilla(paymentId, month, year) {
      this.$router.push({
        name: "detallePlanilla",
        params: {
          id: paymentId,
          enableView: false,
          monthPayment: moment(month).get("month"),
          yearPayment: moment(month).get("year")
        }
      });
    },
    editarPlanilla(paymentId, month, year) {
      this.$router.push({
        name: "detallePlanilla",
        params: {
          id: paymentId,
          enableView: true,
          monthPayment: moment(month).get("month"),
          yearPayment: moment(month).get("year")
        }
      });
    },
    getSalaryData() {
      this.$validator.validateAll().then(() => {
        this.$http
          .get(
            `/salarios?page=${this.pageOne.currentPage}&limit=${
              this.pageOne.itemsPerPage
            }`
          )
          .then(response => {
            console.log(response);
            this.payroll = response.data.docs;
          });
      });
    },
    includePeriod() {
      this.saveSalaryData();
      this.getSalaryData();
    },
    saveSalaryData() {
      this.$http
        .post("/salarios/add/period", this.salaryData)
        .then(response => {
          console.log(response);
        })
        .catch(err => console.log(err));
    },
    abrirModal() {
      this.modal
        .modal("setting", { observeChanges: true })
        .modal("show")
        .modal("refresh");
    }
  },
  mounted() {
    this.modal = $(this.$el).find(".ui.longer.modal");
    $(this.$el)
      .find(".ui.dropdown")
      .dropdown();
  },
  created() {
    this.getSalaryData();
  }
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>


