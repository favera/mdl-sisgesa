<template>
    <div class="ui twelve wide column">

        <div class="ui form">
            <h4 class="ui dividing header">Listado de Planilla de Salarios</h4>
            <div class="two fields">
                <div class="ui twelve wide field">
                    <div class="inline fields">

                        <label for="">Mes:</label>

                        <div class="field">
                            <el-date-picker type="month" placeholder="Seleccionar Mes" v-model="queryMonth" format="MMMM">
                            </el-date-picker>
                        </div>
                        <label for="">Año:</label>

                        <div class="field">
                            <el-date-picker type="year" placeholder="Seleccionar Año" format="yyyy" v-model="queryYear">
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
                            <th>Opciones</th>

                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Enero - 2018</td>
                            <td>Pendiente</td>
                            <td>

                                <i class="zoom icon pointer" @click="detallePlanilla"></i>
                                <i class="plus icon"></i>
                                <i class="edit icon"></i>
                                <i class="checkmark box icon"></i>
                                <i class="trash icon pointer"></i>
                            </td>
                        </tr>
                        <tr>
                            <td>Febrero - 2018</td>
                            <td>Pendiente</td>
                            <td>
                                <router-link :to="{name: 'detallePlanilla', params: {enableView: false}}">
                                    <i class="zoom icon pointer"></i>
                                </router-link>

                                <router-link :to="{name: 'detallePlanilla', params: {enableView: true}}">
                                    <i class="plus icon"></i>
                                </router-link>

                                <i class="edit icon"></i>
                                <i class="checkmark box icon"></i>
                                <i class="trash icon pointer"></i>
                            </td>
                        </tr>
                        <tr>
                            <td>Marzo - 2018</td>
                            <td>Pendiente</td>
                            <td>
                                <i class="zoom icon pointer" @click="detallePlanilla"></i>
                                <i class="plus icon"></i>
                                <i class="edit icon"></i>
                                <i class="checkmark box icon"></i>
                                <i class="trash icon pointer"></i>
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
      queryMonth: "",
      queryYear: ""
    };
  },
  methods: {
    detallePlanilla() {
      this.$router.push({
        name: "detallePlanilla",
        props: { enableView: true }
      });
    }
  }
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>


