<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <h4 class="ui dividing header">Listado de Funcionarios</h4>
      <div class="two fields">
        <div class="inline fields">
          <div class="ten wide field">
            <div class="ui icon input">
              <input v-model="search" type="text" placeholder="Buscar Funcionario..." @keydown="consultarEmpleado">
              <i @click="cleanField()" v-show="search" class="close link icon"></i>
            </div>
          </div>

          <button class="ui circular teal icon button" @click="consultarEmpleado">
            <i class="search icon"></i>
          </button>

        </div>

        <div class="field">

          <div class="ui right floated main menu">
            <a class="icon item" @click="nuevoEmpleado">
              <i class="plus icon"></i>
            </a>
            <a class="icon item">
              <i class="print icon"></i>
            </a>
          </div>

        </div>
      </div>

    </div>

    <div class="field">

      <table class="ui teal striped celled table">
        <thead>
          <tr>
            <th @click="sortName">
              <i class="sort up icon"></i>
              Nombre del Funcionario

            </th>
            <th>Sucursal</th>
            <th>Carga Laboral</th>
            <th>Salario Base</th>
            <th class="center aligned">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(empleado, index) in empleados" :key="empleado._id">
            <td> {{empleado.nombre}}</td>
            <td> {{empleado.sucursal.nombre}}</td>
            <td> {{empleado.cargaLaboral}}</td>
            <td> {{formatSalary(empleado.salario)}}{{empleado.moneda}}</td>
            <td class="center aligned">
              <i class="edit row link icon" @click="guardarPaginacion(empleado._id)"></i>
              <i class="trash link icon" @click="deleteEmployee(empleado._id, index)"></i>
            </td>
          </tr>

        </tbody>

        <tfoot>
          <tr>
            <th colspan="7">
              <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
              </app-pagination>
            </th>
          </tr>
        </tfoot>
      </table>

    </div>
  </div>
</template>

<script>
import Pagination from ".././shared/Pagination.vue";
export default {
  name: "empleadoList",
  props: ["page"],
  data() {
    return {
      parametro: "",
      search: null,
      sortNameParam: 1,
      empleados: [],
      empleadosFirebase: [],
      keyPagination: [],
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };
  },
  components: {
    appPagination: Pagination
  },
  methods: {
    sortName() {
      this.sortNameParam = this.sortNameParam * -1;
    },
    cleanField() {
      this.search = null;
      this.obtenerListadoEmpleado();
    },
    formatSalary(value) {
      return value.toLocaleString();
    },
    consultarEmpleado(e) {
      if (e && e.keyCode === 13) {
        this.obtenerListadoEmpleado(true);

        return;
      } else {
        this.obtenerListadoEmpleado(true);
      }
    },
    guardarPaginacion(empleadoId) {
      console.log("IDDD", empleadoId);
      var page = {};
      page.currentPage = this.pageOne.currentPage;
      page.totalItems = this.pageOne.totalItems;
      page.itemsPerPage = this.pageOne.itemsPerPage;

      localStorage.setItem("page", JSON.stringify(page));

      this.$router.push({ name: "editarEmpleado", params: { id: empleadoId } });
    },
    nuevoEmpleado() {
      this.$router.push({ name: "incluirEmpleado" });
    },
    deleteEmployee(employeeId, index) {
      this.$confirm("Este registro sera desactivado. Continuar?", "Atencion!", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.$http
            .put(`/funcionarios/deactivate/${employeeId}`, { activo: false })
            .then(response => {
              if (response.status === 200) {
                this.empleados.splice(index, 1);
                this.$message({
                  type: "success",
                  message: "Registro Eliminado"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso cancelado"
          });
        });
    },
    obtenerListadoEmpleado(pageReset) {
      if (pageReset) {
        this.pageOne.currentPage = 1;
      }
      this.$http
        .get(
          `/funcionarios?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&search=${this.search}`
        )
        .then(response => {
          console.log("respnose mongo", response);
          this.empleados = response.data.docs.slice(
            0,
            this.pageOne.itemsPerPage - 1
          );
          this.pageOne.totalItems = response.data.total;
        })
        .catch(e => {
          console.log(e);
        });
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.obtenerListadoEmpleado();
    }
  },
  created() {
    this.obtenerListadoEmpleado();
  },
  computed: {
    filteredList() {
      return this.empleados;
    }
  },
  watch: {
    $route: "obtenerListadoEmpleado"
  }
};
</script>
<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
