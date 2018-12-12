<template>
  <div class="ui twelve wide column">
    <div class="ui four column grid">
      <div class="column">
        <div class="ui secondary orange inverted segment">
          <div class="ui two column grid">
            <div class="eigth wide column">
              <i class="big users inverted icon"></i>
            </div>
            <div class="column">
              <div class="ui inverted statistic">
                <div class="value">
                  {{this.queryResults.absence.total}}
                </div>
                <div class="label">
                  Ausencias
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui secondary yellow inverted segment">
          <div class="ui two column grid">
            <div class="eigth wide column">
              <i class="big clock inverted icon"></i>
            </div>
            <div class="column">
              <div class="ui inverted statistic">
                <div class="value">
                  {{this.queryResults.delay.length}}
                </div>
                <div class="label">
                  Retrasos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui secondary violet inverted segment">
          <div class="ui two column grid">
            <div class="eigth wide column">
              <i class="big plane inverted icon"></i>
            </div>
            <div class="column">
              <div class="ui inverted statistic">
                <div class="value">
                  7
                </div>
                <div class="label">
                  Vacaciones
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui secondary purple inverted segment">
          <div class="ui two column grid">
            <div class="eigth wide column">
              <i class="big puzzle piece inverted icon"></i>
            </div>
            <div class="column">
              <div class="ui inverted statistic">
                <div class="value">
                  {{this.queryResults.incomplete.total}}
                </div>
                <div class="label">
                  Incompletos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ui two column grid">
      <div class="column">
        <div class="ui olive segment">

          <h3>Prestamos a Cobrar</h3>

          <div class="ui relaxed divided items">
            <div class="item" v-for="loan in lendings" :key="loan._id">
              <div class="content">
                <h5 class="ui header">{{loan.employeeName}}</h5>

                 <div class="ui relaxed divided items">
                    <div class="item">
                      <div class="middle aligned content">
                        <h5>Vencimiento</h5>
                      </div>
                      <div class="middle aligned content">
                        <h5>Valor</h5>
                      </div>
                    </div>
                    <div
                      class="item"
                    v-for="installment in loan.installments" :key="installment._key"
                    >

                    
                      <div class="middle aligned content">
                        <p>{{moment(installment.dueDate).format("DD/MM/YYYY")}}</p>
                      </div>
                      <div class="middle aligned content">
                        <p>{{installment.amount.toLocaleString()}} {{installment.coin}}</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
      <div class="column">
        <div class="ui violet segment">
          <div class="ui column grid">
            <div class="twelve wide column">
              <h3>Monto Total para Pago de Salarios</h3>
            </div>
            <div class="four wide column">
              <a class="ui large purple label">
                <i class="calendar inverted icon"></i>
                {{moment().format("MMMM").toUpperCase()}}
              </a>
            </div>
          </div>

          <div class="ui teal progress" data-value="15" data-total="20" id="salary">
            <div class="bar">
              <div class="progress"></div>
            </div>
            <div class="label">{{this.salaries[0].totalSalary.toLocaleString()}} {{this.salaries[0]._id}}</div>
          </div>
          <div class="ui blue progress">
            <div class="bar"></div>
            <div class="label">{{this.salaries[1].totalSalary.toLocaleString()}} {{this.salaries[1]._id}}</div>
          </div>

        </div>
      </div>

    </div>
  </div>

</template>

<script>
import moment from "moment";

export default {
  name: "dashboard",
  data() {
    return {
      // dateStart: moment(new Date())
      //   .startOf("month")
      //   .format(),
      // dateEnd: moment(new Date())
      //   .endOf("month")
      //   .format(),
      dateStart: "2018-08-01",
      dateEnd: "2018-08-30",
      queryResults: {
        absence: null,
        incomplete: null,
        delay: null
      },
      salaries: [],
      lendings: []
    };
  },
  methods: {
    async getDataDashboard() {
      let absencePromise = this.$http.get(
        `/attendances/query-data?page=1&limit=10&startDate=${
          this.dateStart
        }&endDate=${this.dateEnd}&status=ausentes&parameter=null`
      );
      let incompletePromise = this.$http.get(
        `/attendances/query-data?page=1&limit=10&startDate=${
          this.dateStart
        }&endDate=${this.dateEnd}&status=incompletos&parameter=null`
      );
      let delayPromise = this.$http.get(
        `/attendances/all-delays?startDate=${this.dateStart}&endDate=${
          this.dateEnd
        }`
      );

      let salariesPromise = this.$http.get(`/employees/get-salaries`);

      let loanPromise = this.$http.get(`/lendings/all-lendings/state-pendent`);

      const [absence, incomplete, delay, salaries, loans] = await Promise.all([
        absencePromise,
        incompletePromise,
        delayPromise,
        salariesPromise,
        loanPromise
      ]);

      this.queryResults.absence = absence.data;
      this.queryResults.incomplete = incomplete.data;
      this.queryResults.delay = delay.data;
      this.salaries = salaries.data;
      this.lendings = loans.data;
    }
  },

  created() {
    this.getDataDashboard();
    
  }
};
</script>

<style>
.el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}
.ui.segment.large {
  height: 400px;
}
</style>

