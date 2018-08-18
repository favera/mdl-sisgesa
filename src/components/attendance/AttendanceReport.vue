<template>
    <div class="ui grid">
        <div class="fourteen centered wide column">
            <table class="ui celled table">
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
        </div>

    </div>
</template>
<script>
export default {
  data() {
    return {
      attendaces: []
    };
  }
};
</script>
<style>
</style>

