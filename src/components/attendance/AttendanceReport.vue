<template>
    <div class="ui grid">



        <div class="four column row">
            <div class="right floated column">
                <div class="segment">
                    <button style="margin-top: 10px" class="ui teal active button" @click="testLibrarycd ">
                    <i class="print icon"></i>
                    Imprimir Informe
                </button>
                </div>
                
            </div>
        </div>

        <div class="ui row">

            <div class="ui column centered grid">
                <div id="att-report" class="twelve wide column">
                    <h4 class="ui dividing header">Listado de Asistencias</h4>
                    <!-- <div class="ui ten wide column"> -->
                            <table class="ui collapsing celled table">
                                <thead>
                                    <tr>
                                        <th>Funcionario</th>
                                        <th>Fecha</th>
                                        <th>M. Entrada</th>
                                        <th>M. Salida</th>
                                        <th>Horas Trabajadas</th>
                                        <th>Horas Faltantes</th>
                                        <th>Banco de Horas</th>
                                        <th>Observacion</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="attendance in attendances" :key="attendance._id">
                                        <td>{{attendance.employeeName}}</td>
                                        <td>{{moment(attendance.date).format("L")}}</td>
                                        <td>{{(attendance.entryTime || "--") + " hs"}}</td>
                                        <td>{{(attendance.exitTime || "--") + " hs"}}</td>
                                        <td>{{(attendance.workedHours || "--") + " hs"}}</td>
                                        <td>{{(attendance.delay || "--") + " hs"}}</td>
                                        <td>{{(attendance.extraHours || "--") + " hs"}}</td>
                                        <td>{{attendance.remark || "--"}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        <!-- </div> -->
  </div>

</div>

        </div>




    </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      attendances: []
    };
  },
  methods: {
    printReport() {
      printJS({
        printable: "att-report",
        type: "html",
        targetStyles: ["*"]
      });
    },
    testLibrary() {
      var body = [
        [
          "Empleado",
          "Fecha",
          "Hora Entrada",
          "Hora Salida",
          "Atrasos",
          "Banco de Horas",
          "Observacion"
        ]
      ];
      this.attendances.forEach(element => {
        var data = [
          element.employeeName,
          moment(element.date).format("L"),
          element.entryTime,
          element.exitTime,
          element.delay,
          element.extraHours,
          element.remark
        ];
        body.push(data);
      });
      var docDefinition = {
        content: [{ text: "Listado de Asistencia" }, { table: { body: body } }]
      };
      pdfMake.createPdf(docDefinition).open();
    }
  },
  created() {
    this.$http
      .get(`attendances/full-list?fechaPlanilla=${this.$route.query.date}`)
      .then(response => {
        this.attendances = response.data;
      });
  }
};
</script>
<style>
</style>

