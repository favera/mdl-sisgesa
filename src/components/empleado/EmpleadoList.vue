<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Funcionarios</h4>
            <div class="two fields">
                <div class="field">

                    <div class="ui icon input">
                        <input v-model="parametro" type="text" placeholder="Buscar Funcionario...">
                        <i @click="consultarEmpleado(parametro)" class="inverted teal circular search link icon"></i>
                    </div>

                </div>


                <div class="field">

                  <div class="ui right floated main menu">
                    <a class="icon item" @click="nuevoEmpleado">
                      <i class="plus icon"></i>
                    </a>
                    <a class="icon item" @click="insertarFirebase">
                      <i class="print icon"></i>
                    </a>
                  </div>


                </div>
            </div>

        </div>

        <div class="field">

            <table class="ui teal celled table">
                <thead>
                    <tr>
                        <th>Nombre del Funcionario
                            <i class="sort content descending icon"></i>
                        </th>
                        <th>Numero Identificador</th>
                        <th>Carga Laboral</th>
                        <th>Salario Base</th>
                        <!-- <th>Sucursal</th> -->
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="empleado in empleados" :key="empleado['.key']"  >
                        <td> {{empleado.nombre}}</td>
                        <td> {{empleado.acnro}}</td>
                        <td> {{empleado.cargaLaboral}}</td>
                        <td> {{empleado.salario}}{{empleado.moneda}}</td>
                        <!-- <td> {{empleado.sucursal.nombre}}</td> -->
                        <td>
                            <span class="item" @click="guardarPaginacion(empleado['.key'])">
                                <i class="edit row icon"></i>
                            </span>

                            <i class="trash icon" @click="confirm(empleado['.key'])"></i>
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
import axios from "axios";
import Pagination from ".././shared/Pagination.vue";
import { url } from "./../.././config/backend";
import { db } from "./../.././config/firebase";
let funcionariosRef = db.ref("/funcionarios");

export default {
  name: "empleadoList",
  props: ["page"],
  data() {
    return {
      parametro: "",
      empleados: [],
      empleadosFirebase: [],
      keyPagination: [],
      clave: "-L20uHGEH_6EDbTP1d1U",
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
    insertarFirebase() {
      Array.from(this.empleadosFirebase).forEach(element => {
        funcionariosRef.push({
          activo: true,
          acnro: element.acnro,
          cargaLaboral: element.cargaLaboral,
          fechaIngreso: "04/01/2018",
          ips: "salario",
          medioTiempo: false,
          moneda: element.moneda,
          nombre: element.nombre,
          nroCedula: "1",
          salario: element.salario,
          salarioMinuto: element.salarioMinuto,
          sucursal: "",
          tipoHoraExtra: "bancoHora"
        });
      });
    },
    consultarEmpleado(parametro) {
      funcionariosRef
        .orderByChild("nombre")
        .startAt(parametro)
        .on("child_added", function(snapshot) {
          console.log(snapshot.val());
        });
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
      this.$confirm(
        "Este registro sera eliminado permanentemente. Continuar?",
        "Atencion!",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
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
      db.ref("/funcionarios/" + id).remove();
    },
    obtenerListadoEmpleado() {
      var page = JSON.parse(localStorage.getItem("page") || null);
      console.log("Pagina" + page);

      if (page !== null) {
        this.pageOne.currentPage = page.currentPage;
        this.pageOne.itemsPerPage = page.itemsPerPage;
        this.pageOne.totalItems = page.totalItems;

        this.pageOneChanged(page.currentPage);
      } else {
        axios
          .get(url + "/empleados?_expand=sucursal")
          .then(response => {
            console.log(response);
            this.empleados = response.data.slice(
              0,
              this.pageOne.itemsPerPage - 1
            );
            this.pageOne.totalItems = response.data.length;
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.$bindAsArray(
        "empleados",
        funcionariosRef
          .orderByKey()
          .limitToFirst(this.pageOne.itemsPerPage)
          .startAt(this.keyPagination[pageNum - 1])
      );
    }
  },
  created() {
    axios.get(funcionariosRef + ".json?shallow=true").then(res => {
      this.pageOne.totalItems = Object.keys(res.data).length;

      var keys = Object.keys(res.data).sort(); // Notice the .sort()!
      var pageLength = 10;
      var pageCount = keys.length / pageLength;
      var key;

      for (var i = 0; i < pageCount; i++) {
        key = keys[i * pageLength];
        this.keyPagination.push(key);
      }

      var page = JSON.parse(localStorage.getItem("page") || null);
      console.log("Pagina" + JSON.stringify(page));
      if (page !== null) {
        this.pageOne.currentPage = page.currentPage;
        this.pageOneChanged(page.currentPage);
      } else {
        this.pageOneChanged(this.pageOne.currentPage);
      }
    });
  },
  updated() {
    // var page = JSON.parse(localStorage.getItem("page") || null);
    // console.log("Pagina" + JSON.stringify(page));
    // if (page !== null) {
    //   this.pageOne.currentPage = page.currentPage;
    //   this.pageOneChanged(page.currentPage);
    // }
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
