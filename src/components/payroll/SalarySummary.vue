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

            <div class="ui two cards">
                <div class="teal card">
                    <div class="middle aligned content">
                        <div class="header">Salario Base:</div>
                        <div class="ui basic segment">
                            <div class="ui horizontal statistic">
                                <div class="value">
                                    {{this.payment.salary.toLocaleString()}}
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
                        <!-- <th>Opciones</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in payment.salarySummary" :key="item._id">
                        <td>{{moment(item.date).format("L")}}</td>
                        <td>{{returnDescription(item.description, item.amount)}}</td>
                        <td>{{Math.round(item.amount).toLocaleString()}} {{ item.coin}}</td>
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
    return {};
  },
  methods: {
    returnList() {
      this.$router.push({ name: "payrollList" });
    },
    returnDescription(description, amount) {
      if (!description && amount < 0) {
        return "Retraso";
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
  created() {}
};
</script>

<style>
</style>
