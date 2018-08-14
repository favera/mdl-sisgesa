<template>
    <div class="ui grid">
        <!-- <div>
            <div class="ui button" @click="printListOfRecipes">
                print
            </div>
        </div> -->

        <div class="ten wide column row">
            <div class="left floated eleven wide column">
                <div class="ui breadcrumb">
                    <router-link :to="{name: 'advanceList'}">
                        <a class="section">Listado de Adelantos</a>

                    </router-link>
                    <i class="right angle icon divider"></i>
                    <div class=" active section">Impresion de Adelantos</div>

                </div>
            </div>
            <div class="right floated five wide column">
                <button class="ui teal active button" @click="printListOfRecipes">
                    <i class="print icon"></i>
                    Imprimir Recibos
                </button>
            </div>
        </div>

        <div id="printRecipe" class="ui ten wide column">
            <div v-for="advance in advances" :key="advance._id" class="test">
                <div class="ui segments">
                    <div class="ui horizontal segments">
                        <div class="ui segment">
                            <img src="http://mdl.com.py/template/images/logomarca.png" width="60px">
                            <h4 class="ui header">Recibo de Adelanto de Salario</h4>
                        </div>
                        <div class="ui r aligned segment">
                            <p>Fecha: {{moment().format("L")}}</p>
                            <h4 class="ui header">Monto: {{formatAmount(advance.amount)}} {{advance.coin}}</h4>
                        </div>

                    </div>
                    <div class="ui segment">
                        <div class="ui small header">{{advance.employee.name}}</div>
                        <span class="ui sub header">CI/RG: {{formatAmount(advance.employee.identityNumber)}}</span>

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
    },
    formatAmount(value) {
      return value.toLocaleString();
    }
  }
};
</script>
<style scoped>
.test {
  margin-bottom: 15px;
  line-height: 0rem;
}
</style>