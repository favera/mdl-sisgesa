<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Sucursales</h4>
      <div class="two fields">
        <div class="inline fields">
          <div class="ui ten wide field">
            <div class="ui icon input">
              <input type="text" placeholder="Buscar Sucursal.." v-model="search">
            </div>
          </div>

          <button class="ui circular teal icon button">
            <i class="search icon"></i>
          </button>

        </div>

        <div class="field">

          <div class="ui right floated main menu">
            <a class="icon item" @click="newSubsidiary">
              <i class="plus icon"></i>
            </a>

          </div>

        </div>
      </div>

    </div>

    <div class="field">

      <table class="ui teal celled table">
        <thead>
          <tr>
            <th>Sucursal</th>
            <th>Horario Entrada</th>
            <th>Horario Salida</th>
            <th>Telefono</th>
            <th class="center aligned">Opciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(subsidiary, index) in filteredList" :key="subsidiary._id">
            <td>{{subsidiary.name }}</td>
            <td>{{subsidiary.startingTime + " hs"}}</td>
            <td>{{subsidiary.endTime + " hs"}}</td>
            <td>{{subsidiary.phone}}</td>
            <td class="center aligned">
              <i class="edit row link icon" @click="editSubsidiary(subsidiary._id)"></i>
              <i class="trash link icon" @click="deleteSubsidiary(subsidiary._id, index)"></i>
            </td>
          </tr>
        </tbody>

        <!-- <tfoot>
          <tr>
            <th colspan="5">
              <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
              </app-pagination>
            </th>
          </tr>
        </tfoot> -->

      </table>

    </div>

  </div>
</template>

<script>
import Pagination from ".././shared/Pagination.vue";

export default {
  name: "subsidiaryList",
  data() {
    return {
      subsidiaries: [],
      search: "",
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 11
      }
    };
  },
  methods: {
    newSubsidiary() {
      this.$router.push({ name: "incluirSucursal" });
    },
    editSubsidiary(subsidiaryId) {
      this.$router.push({
        name: "editarSucursal",
        params: { id: subsidiaryId }
      });
    },
    deleteSubsidiary(subsidiaryId, index) {
      this.$confirm(
        "El registro sera eliminado permanentemente. Desea Continuar?",
        "Atencion!",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.$http
            .delete(`/sucursales/delete/${subsidiaryId}`)
            .then(response => {
              if (response.status === 200) {
                this.subsidiaries.splice(index, 1);
                this.$message({
                  type: "success",
                  message: "Registro Eliminado"
                });
              }
            })
            .catch(e => {
              console.log("Response error", e.response);

              if (e.response.status === 403) {
                this.$message({
                  type: "error",
                  message: e.response.data
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    },
    getSubsidiariesList() {
      this.$http.get("/sucursales").then(response => {
        this.subsidiaries = response.data;
      });
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.$http
        .get(url + "/sucursals?_page=" + this.pageOne.currentPage)
        .then(response => {
          this.subsidiaries = response.data.slice(0, this.pageOne.itemsPerPage);
        })
        .catch(e => {
          console.log("error: from", e);
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    }
  },
  components: {
    appPagination: Pagination
  },
  computed: {
    filteredList() {
      return this.subsidiaries.filter(subsidiary => {
        return subsidiary.name
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    }
  },
  created() {
    this.getSubsidiariesList();
  },
  watch: {
    $route: "getSubsidiariesList"
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
