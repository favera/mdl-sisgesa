<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <div class="field">
        <div class="ui breadcrumb">
          <a class="section" @click="returnList">Listado de Planillas de Salario</a>
          <i class="right angle icon divider"></i>
          <a class="section" @click="returnDetail">Detalle de Planilla</a>
          <i class="right angle icon divider"></i>
          <div class=" active section">Resumen de Banco de Horas</div>

        </div>
      </div>

      <h3 class="ui dividing header">
        Resumen Salarial
      </h3>

      <div class="ui basic segment">
        <div class="ui items">
          <div class="item">

            <div class="middle aligned content">
              <div class="header">
                <!-- <i class="olive circle outlined user icon"></i> -->
                {{this.payment.name}}
              </div>
              <div class="meta">Funcionario</div>
            </div>
          </div>
        </div>

      </div>

      <div class="ui three cards">
        <div class="teal card">
          <div class="middle aligned content">
            <div class="header">Salario Base + Horas Extras:</div>
            <div class="ui basic segment">
              <div class="ui horizontal statistic">
                <div class="value">
                  {{this.totalIncome.toLocaleString()}}
                </div>
                <div class="label">
                  {{this.payment.coin}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="red card">
          <div class="middle aligned content">
            <div class="header">Total Descuentos:</div>
            <div class="ui basic segment">
              <div class="ui horizontal statistic">
                <div class="value">
                  {{this.totalDiscount}}
                </div>
                <div class="label">
                  {{this.payment.coin}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="blue card">
          <div class="middle aligned content">
            <div class="header">Total Neto a Recibir:</div>
            <div class="ui basic segment">
              <div class="ui horizontal statistic">
                <div class="value">
                  {{this.payment.salaryBalance.toLocaleString()}}
                </div>
                <div class="label">
                  {{this.payment.coin}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <table class="ui striped table" style="margin-top: 50px;">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Movimiento</th>
            <th>Monto</th>
            <th class="center aligned">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in payment.salarySummary" :key="item._id">
            <td>{{moment(item.date).format("L")}}</td>
            <td>{{returnDescription(item.description, item.amount)}}</td>
            <td>{{Math.round(item.amount).toLocaleString()}} {{ item.coin}}</td>
            <td class="center aligned">
              <i class="trash link icon" v-if="(payment.status === 'pendiente')" @click="deleteItem(item, index)"></i>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String
    },
    payment: {
      type: Object
    },
    startDate: {
      type: String
    },
    endDate: {
      type: String
    },
    detail: {
      type: Boolean
    }
  },
  data() {
    return {
      totalDiscount: 0,
      totalIncome: 0
    };
  },
  methods: {
    returnList() {
      this.$router.push({ name: "payrollList" });
    },
    getDiscount() {
      this.payment.salarySummary.forEach(summary => {
        if (summary.amount < 0) {
          this.totalDiscount += summary.amount;
        }
        if (summary.amount > 0) {
          this.totalIncome += summary.amount;
        }
      });

      this.totalIncome += this.payment.salary;

      this.totalDiscount = Math.floor(this.totalDiscount).toLocaleString();
    },
    deleteItem(item, index) {
      this.$confirm(
        "Esta seguro que desea eliminar la cuota de los detalles?",
        "Atencion!",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          if (item._id) {
            console.log(item);
            this.$http
              .put(
                `/payrolls/salary-summary/delete-lending?id=${
                  item._id
                }&amount=${item.amount}`
              )
              .then(() => {
                this.payment.salaryBalance += item.amount * -1;
                this.payment.salarySummary.splice(index, 1);
                this.$http.put(
                  `/lendings/salary-summary/update-lending?employee=${
                    this.payment.employee
                  }&amount=${item.amount}&date=${item.date}`
                );
              });
          } else {
            this.payment.salaryBalance += item.amount * -1;
            this.payment.salarySummary.splice(index, 1);
            this.$message({
              type: "success",
              message: "Registro Eliminado"
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    },
    returnDescription(description, amount) {
      if (!description && amount < 0) {
        return "Retraso";
      } else if (
        (description === "Trabajo en dia Domingo" ||
          description === "Trabajo en dia Feriado") &&
        amount < 0
      ) {
        return description + " (retraso)";
      }
      return description;
    },
    returnDetail() {
      if (this.detail) {
        this.$router.push({
          name: "paymentDetail",
          params: {
            id: this.id,
            enableView: false,
            startDate: this.startDate,
            endDate: this.endDate,
            detail: this.detail
          }
        });
      } else {
        this.$router.push({
          name: "paymentDetail",
          params: {
            enableView: true,
            startDate: this.startDate,
            endDate: this.endDate,
            detail: this.detail
          }
        });
      }
    }
  },
  created() {
    this.getDiscount();
  }
};
</script>

<style>
</style>
