<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <h3 class="ui dividing header">
                Resumen Salarial
            </h3>

            <div class="ui basic segment">
                <div class="ui items">
                    <div class="item">

                        <div class="middle aligned content">
                            <div class="header">
                                <!-- <i class="olive circle outlined user icon"></i> -->
                                {{this.resumenSalarial.name}}
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
                                    {{this.resumenSalarial.salary}}
                                </div>
                                <div class="label">
                                    {{this.resumenSalarial.coin}}
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
                                    {{this.resumenSalarial.salaryBalance}}
                                </div>
                                <div class="label">
                                    {{this.resumenSalarial.coin}}
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
                    <tr v-for="item in resumenSalarial" :key="item._id">
                        <td>ips {{resumenSalarial.ips}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    resumenSalarial: {
      type: Object
    }
  },
  data() {
    return {
      details: []
    };
  },
  methods: {
    compoundDetails() {
      for (const key in this.resumenSalarial) {
        if (this.resumenSalarial.hasOwnProperty("ips")) {
          this.details = this.resumenSalarial[key];
        }
      }
    }
  },
  created() {
    this.compoundDetails();
  }
};
</script>

<style>
</style>
