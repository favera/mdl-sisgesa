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
            <a class="icon item" @click="nuevaSucursal">
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
          <tr v-for="sucursal in filteredList" :key="sucursal._id">
            <td>{{sucursal.nombre }}</td>
            <td>{{sucursal.horaEntrada + " hs"}}</td>
            <td>{{sucursal.horaSalida + " hs"}}</td>
            <td>{{sucursal.telefono}}</td>
            <td class="center aligned">
              <i class="edit row link icon" @click="editarSucursal(sucursal._id)"></i>
              <i class="trash link icon" @click="confirm(sucursal._id)"></i>
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
  name: "sucursaslList",
  data() {
    return {
      sucursales: [],
      search: "",
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 11
      }
    };
  },
  methods: {
    nuevaSucursal() {
      this.$router.push({ name: "incluirSucursal" });
    },
    editarSucursal(sucursalId) {
      this.$router.push({ name: "editarSucursal", params: { id: sucursalId } });
    },
    confirm(id) {
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
          var index = this.sucursales.findIndex(i => i.id === id);
          this.$http
            .delete(`/sucursales/delete/${id}`)
            .then(response => {
              console.log("response from then", response);
              this.sucursales.splice(index, 1);
              this.$message({
                type: "success",
                message: "Registro Eliminado"
              });
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
    obtenerListadoSucursales(sucursal) {
      for (let key in sucursal) {
        this.sucursales.push({
          horaLaboral: sucursal[key].horaLaboral,
          horarioEntrada: sucursal[key].horarioEntrada,
          horarioSalida: sucursal[key].horarioSalida,
          nombre: sucursal[key].nombre,
          telefono: sucursal[key].telefono,
          id: key
        });
      }

      this.sucursales.reverse();
    },
    eliminarSucursal(id) {
      var index = this.sucursales.findIndex(i => i.id === id);

      this.$http
        .get(`/sucursales/delete/${id}`)
        .then(response => {
          // this.sucursales.splice(index, 1);
          console.log("Respuesta", response);
        })
        .catch(e => {
          console.log(e);
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.$http
        .get(url + "/sucursals?_page=" + this.pageOne.currentPage)
        .then(response => {
          this.sucursales = response.data.slice(0, this.pageOne.itemsPerPage);
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
      return this.sucursales.filter(sucursal => {
        return sucursal.nombre
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    }
  },
  created() {
    this.$http.get("/sucursales").then(response => {
      this.sucursales = response.data;
    });
  },
  watch: {
    $route: "obtenerListadoSucursales"
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
