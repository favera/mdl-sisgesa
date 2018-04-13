<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <h4 class="ui dividing header">Listado de Funcionarios</h4>
      <div class="two fields">
        <div class="field">

          <div class="ui icon input">
            <input v-model="search" type="text" placeholder="Buscar Funcionario..." @keydown="consultarEmpleado">
            <i @click="consultarEmpleado()" class="inverted teal circular search link icon"></i>
          </div>

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
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empleado in empleados" :key="empleado._id">
            <td> {{empleado.nombre}}</td>
            <td> {{empleado.sucursal.nombre}}</td>
            <td> {{empleado.cargaLaboral}}</td>
            <td> {{empleado.salario}}{{empleado.moneda}}</td>
            <td>
              <span class="item" @click="guardarPaginacion(empleado._id)">
                <i class="edit row icon"></i>
              </span>

              <i class="trash icon" @click="confirm(empleado._id)"></i>
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
    consultarEmpleado(e) {
      if (e.keyCode === 13) {
        this.$http
          .get(
            `/funcionarios?search=${this.search}&page=${
              this.pageOne.currentPage
            }&limit=${this.pageOne.itemsPerPage}&sort=${this.sortNameParam}`
          )
          .then(response => {
            console.log("respnose mongo Computed", response);

            this.pageOne.totalItems = response.data.total;
            this.empleados = response.data.docs;
          })
          .catch(e => {
            console.log(e);
          });
        return;
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
    confirm(id) {
      this.$confirm("Este registro sera desactivado. Continuar?", "Atencion!", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.eliminarEmpleado(id);
          this.$message({
            type: "success",
            message: "Registro Eliminado"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso cancelado"
          });
        });
    },
    eliminarEmpleado(id) {
      console.log("DESACTIVAR EMPLEADO", id);
      var index = this.empleados.findIndex(i => i.id === id);
      this.empleados.splice(index, 1);

      this.$http.put(`/funcionarios/deactivate/${id}`, { activo: false });
    },
    obtenerListadoEmpleado() {
      this.$http
        .get(
          `/funcionarios?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&sort=${this.sortNameParam}`
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
