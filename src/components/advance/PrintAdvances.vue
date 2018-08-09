<template>
    <div>
        <div>
            <div class="ui button" @click="printListOfRecipes">
                print
            </div>
        </div>

        <div id="printRecipe">
            <div v-for="adelanto in advances" :key="adelanto._id" class="test">
                <div class="ui segments">
                    <div class="ui horizontal segments">
                        <div class="ui segment">
                            <img src="http://mdl.com.py/template/images/logomarca.png" width="60px">
                            <h4 class="ui header">Recibo de Adelanto de Salario</h4>
                        </div>
                        <div class="ui r aligned segment">
                            <p>Fecha: {{moment().format("L")}}</p>
                            <h4 class="ui header">Monto: {{adelanto.amount}} {{adelanto.coin}}</h4>
                        </div>

                    </div>
                    <div class="ui segment">
                        <div class="ui small header">{{adelanto.employee.name}}</div>
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
            </div>

        </div>

    </div>

</template>
<script>
export default {
  props: {
    advances: {
      type: Array
    }
  },
  data() {
    return {};
  },
  methods: {
    printListOfRecipes() {
      printJS({
        printable: "printRecipe",
        type: "html",
        targetStyles: ["*"]
      });
    }
  }
};
</script>
<style scoped>
.test {
  margin-bottom: 20px;
  line-height: 0rem;
}
.ui.segment {
  margin: 0.7rem 0em;
}
</style>