<template>
  <div class="ui twelve wide column">

    <div class="ui longer modal">
      <div class="header"> Incluir Periodo para Planilla de Salario </div>
      <div class="content">

        <form class="ui form" @submit.prevent="includePeriod">
          <div class="required field">
            <label>Seleccione Mes</label>
            <div class="field" :class="{error: errors.has('monthPeriod')}">
              <el-date-picker name="monthPeriod" data-vv-as="mes" v-validate="'required'" type="month" placeholder="Seleccionar Mes" v-model="salaryData.month" format="MMMM" value-format="yyyy-MM-dd">
              </el-date-picker>
              <div class="info-error" v-show="errors.has('monthPeriod')">{{errors.first('monthPeriod')}}</div>
            </div>
          </div>
          <div class="required field">
            <label>Seleccione Año</label>
            <div class="field" :class="{error: errors.has('yearPeriod')}">
              <el-date-picker name="yearPeriod" data-vv-as="año" v-validate="'required'" type="year" placeholder="Seleccionar Año" v-model="salaryData.year" format="yyyy" value-format="yyyy-MM-dd"></el-date-picker>
              <div class="info-error" v-show="errors.has('yearPeriod')">{{errors.first('yearPeriod')}}</div>
            </div>
          </div>

          <div class="actions">

            <button class="ui approve teal button">Aceptar</button>
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
              <el-date-picker type="month" placeholder="Seleccionar Mes" v-model="query.month" format="MMMM" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <label for="">Año:</label>

            <div class="field">
              <el-date-picker type="year" placeholder="Seleccionar Año" format="yyyy" v-model="query.year" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>

          </div>

        </div>

        <div class="ui four wide field">

          <div class="ui right floated main menu">
            <a class="icon item">

              <i class="plus icon" @click="openModal()"></i>

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

            <tr v-for="(payment, index) in payroll" :key="payment._id">
              <td>{{moment(payment.month).format("MMMM")}} - {{moment(payment.year).format("YYYY")}}</td>
              <td>{{payment.status}}</td>
              <td class="center aligned">
                <span v-if="!payment.detail">
                  <i class="plus link icon" @click="addPaymentDetail(payment._id, payment.month, payment.year)"></i>
                </span>

                <span v-else-if="payment.status === 'Pendiente'">
                  <i class="zoom link icon" @click="paymentDetail(payment._id, payment.month, payment.year)"></i>
                  <i class="edit link icon" @click="editPaymentDetail(payment._id, payment.month, payment.year)"></i>
                  <i class="checkmark box link icon" @click="approvePayroll(payment._id, index)"></i>

                </span>
                <!-- <i class="trash link icon" @click="deletePayroll(payment._id, index)"></i> -->

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
      },
      startDate: null,
      endDate: null
    };
  },
  components: {
    appPagination: Pagination
  },
  methods: {
    pageOneChanged() {},
    approvePayroll(paymentId, index) {
      this.$confirm(
        "Al aprobar la planilla de pago ya no podra ser editado. Continuar?",
        "Alerta",
        {
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      ).then(() => {
        this.$http
          .put(`/lendings/update/lending/paid`)
          .then(response => {
            console.log(response);
            this.$http
              .put(`/payrolls/update-status/${paymentId}`)
              .then(response => {
                if (response.status === 200) {
                  this.$set(this.payroll, index, response.data);
                  this.$notify({
                    title: "Exito!",
                    type: "success",
                    message: "Planilla de pago de Salarios Aprobada"
                  });
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "Proceso cancelado"
            });
          });
      });
    },
    deletePayroll(paymentId, index) {
      this.$confirm(
        "Este registro sera eliminado permanentemente. Continuar?",
        "Alerta",
        {
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.delete(`/payrolls/delete/${paymentId}`).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.payroll.splice(index, 1);
              this.$message({
                type: "success",
                message: "Registro eliminado exitosamente"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso cancelado"
          });
        });
    },
    paymentDetail(paymentId, month, year) {
      this.getDates(month, year);
      this.$router.push({
        name: "paymentDetail",
        params: {
          id: paymentId,
          enableView: false,
          detail: true,
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
    },
    //Metodo para devolver la fecha inicio y fecha fin.
    getDates(month, year) {
      var monthNumber = moment(month).get("month"),
        yearNumber = moment(year).get("year");
      var date = moment()
        .set({ year: yearNumber, month: monthNumber })
        .format();

      this.startDate = moment(date)
        .startOf("month")
        .format();
      this.endDate = moment(date)
        .endOf("month")
        .format();
    },
    editPaymentDetail(paymentId, month, year) {
      this.getDates(month, year);

      this.$router.push({
        name: "paymentDetail",
        params: {
          id: paymentId,
          enableView: true,
          detail: true,
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
    },

    addPaymentDetail(paymentId, month, year) {
      this.getDates(month, year);

      this.$router.push({
        name: "paymentDetail",
        params: {
          id: paymentId,
          enableView: true,
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
    },
    getSalaryData() {
      this.$validator.validateAll().then(() => {
        this.$http
          .get(
            `/payrolls?page=${this.pageOne.currentPage}&limit=${
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
        .post("/payrolls/add/period", this.salaryData)
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          console.log(e.response);
          if (e.response.data.code === 11000) {
            this.$notify.error({
              title: "Error",
              message:
                "Ya existe el periodo que desea agregar. Por favor modifique el registro si es necesario actualizar",
              duration: 9000
            });
          }
        });
    },
    openModal() {
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


