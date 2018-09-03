<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Usuarios</h4>
            <div class="two fields">
                <div class="inline fields">
                <div class="ten wide field">
                    <div class="ui icon input">
                    <input  type="text" placeholder="Buscar Usuario..." >
                    <i class="close link icon"></i>
                    </div>
                </div>

                <button class="ui circular teal icon button">
                    <i class="search icon"></i>
                </button>

                </div>

                <div class="field">

                <div class="ui right floated main menu">
                    <a class="icon item" >
                    <i class="plus icon" @click="newUser"></i>
                    </a>
                    
                </div>

                </div>
            </div>

        </div>

        <div class="field">

            <table class="ui teal striped celled table">
                <thead>
                <tr>
                    <th >                   
                    Nombre y Apellido
                    </th>
                    <th>Nombre de Usuario</th>
                    <th>Email</th>
                    <th class="center aligned">Opciones</th>
                </tr>
                </thead>
                <tbody>
                <!-- <tr v-for="(employee, index) in employees" :key="employee._id">
                    <td> {{employee.name}}</td>
                    <td> {{employee.subsidiary.name}}</td>
                    <td> {{employee.workingHours}}</td>
                    <td> {{formatSalary(employee.salary)}}{{employee.coin}}</td>
                    <td class="center aligned">
                    <i class="edit row link icon" @click="savePage(employee._id)"></i>
                    <i class="trash link icon" @click="deleteEmployee(employee._id, index)"></i>
                    </td>
                </tr> -->

                </tbody>

                <tfoot>
                <tr>
                    <!-- <th colspan="7">
                    <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
                    </app-pagination>
                    </th> -->
                </tr>
                </tfoot>
            </table>

        </div>
    </div>    
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    newUser() {
      this.$router.push({ name: "includeUser" });
    }
  }
};
</script>
<style>
</style>


