<template>
    <div class="ui twelve wide column">

        <div class="ui longer modal">
            <div class="header"> Incluir Periodo para Planilla de Salario </div>
            <div class="content">

                <form class="ui form">
                    <div class="required field">
                        <label>Seleccione Mes</label>
                        <div class="field">
                            <el-date-picker type="month" placeholder="Seleccionar Mes" v-model="salaryData.month" format="MMMM">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="required field">
                        <label>Seleccione Año</label>
                        <div class="field">
                            <el-date-picker type="yaer" palceholder="Seleccionar Año" v-model="salaryData.year" format="YYYY"></el-date-picker>
                        </div>
                    </div>
                </form>

            </div>
            <div class="actions">

                <button class="ui positive teal button" @click="saveSalaryData">Aceptar</button>
                <div class="ui deny button">Cancelar</div>

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

                            <i class="plus icon"></i>

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

                        <tr>
                            <td>{{payroll.month}} - {{payroll.year}}</td>
                            <td>{{payroll.status}}</td>
                            <td class="center aligned">
                                <i class="zoom link icon" @click="detallePlanilla"></i>
                                <i class="plus link  icon"></i>
                                <i class="edit link icon"></i>
                                <i class="checkmark box link icon"></i>
                                <i class="trash link icon"></i>
                            </td>
                        </tr>

                    </tbody>
                </table>

            </div>

        </div>

    </div>
</template>



<script>
import moment from "moment";
export default {
  data() {
    return {
      query: {
        month: null,
        year: null
      },
      payroll: [],
      salaryData: {
        month: null,
        year: null,
        status: "Pendiente",
        salaryDetail: []
      }
    };
  },
  methods: {
    detallePlanilla() {
      this.$router.push({
        name: "detallePlanilla",
        props: { enableView: true }
      });
    },
    listPayroll() {
      this.$http.get("/salarios").then(response => {
        console.log(response);
        this.payroll = response.data.docs;
      });
    },
    saveSalaryData() {
      this.$http
        .post("/add/period", this.saveSalaryData)
        .then(response => {
          console.log(response);
        })
        .catch(err => console.log(err));
    }
  },
  created() {}
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>


