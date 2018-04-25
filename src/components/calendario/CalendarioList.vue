<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Eventos en el Calendario</h4>
      <div class="two fields">
        <div class="twelve wide field">

          <div class="inline fields">
            <div class="ten wide field">
              <div class="ui icon input">
                <input type="text" v-model="query.busqueda" @keydown="consultarEventos" placeholder="Buscar Evento...">
                <i @click="consultarEventos" class="inverted teal circular search link icon"></i>
              </div>
            </div>
            <div class="four wide field">
              <label>Tipo de Evento:</label>
            </div>

            <div class="three wide field">
              <div class="ui radio checkbox">
                <input type="radio" name="vacaciones" value="vacaciones" v-model="listado">
                <label>Vacaciones</label>
              </div>
            </div>

            <div class="two wide field">
              <div class="ui radio checkbox">
                <input type="radio" name="feriado" value="feriado" v-model="listado">
                <label>Feriados</label>
              </div>
            </div>

          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="incluirEvento">
              <i class="plus icon"></i>
            </a>

          </div>

        </div>
      </div>

    </div>

    <div class="field" v-if="listado==='feriado'">
      <table class="ui teal celled table">
        <thead>
          <tr>
            <th>Tipo de Evento</th>
            <th>Motivo del Feriado</th>
            <th>Fecha del Feriado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evento in eventos" :key="evento._id" v-if="evento.tipoEvento==='feriado'">
            <td class="capital">{{evento.tipoEvento}}</td>
            <td>{{evento.motivoFeriado}}</td>
            <td>{{moment(evento.fechaFeriado).format("L")}}</td>
            <td>
              <router-link :to="{name: 'editarEvento', params: { id: evento._id}}">
                <i class="edit row icon"></i>
              </router-link>

              <i class="trash icon" @click="confirm(evento._id)"></i>

            </td>
          </tr>

        </tbody>
        <tfoot v-show="pageOne.totalItems > 10">
          <tr>
            <th colspan="4">
              <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
              </app-pagination>
            </th>
          </tr>
        </tfoot>
      </table>

    </div>

    <div class="field" v-else>
      <table class="ui teal celled table">
        <thead>
          <tr>
            <th>Tipo de Evento</th>
            <th>Funcionario</th>
            <th>Inicio de Vacaciones</th>
            <th>Fin de Vacaciones</th>
            <th>Opciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="evento in eventos" :key="evento._id" v-if="evento.tipoEvento==='vacaciones'">
            <td class="capital">{{evento.tipoEvento}}</td>
            <td>{{evento.nombreFuncionario}}</td>
            <td>{{moment(evento.fechaInicio).format("L")}}</td>
            <td>{{moment(evento.fechaFin).format("L")}}</td>
            <td>
              <router-link :to="{name: 'editarEvento', params: { id: evento._id}}">
                <i class="edit row icon"></i>
              </router-link>

              <i class="trash icon" @click="confirm(evento._id, evento.funcionario._id)"></i>
              <i class="archive icon" @click="archivarVacaciones(evento._id, evento.funcionario._id)"></i>
            </td>
          </tr>
        </tbody>

        <tfoot v-show="pageOne.totalItems > 10">
          <tr>
            <th colspan="5">
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
  name: "calendarioList",
  data() {
    return {
      eventos: [],
      listado: "vacaciones",
      query: {
        busqueda: null
      },
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };
  },
  methods: {
    incluirEvento() {
      this.$router.push({ name: "incluirEvento" });
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.obtenerListadoEventos();
    },
    archivarVacaciones(eventokey, funcionarioId) {
      console.log(eventokey, Object.keys(funcionarioId)[0]);
      var updates = {};

      updates[
        "/funcionarios/" +
          Object.keys(funcionarioId)[0] +
          "/vacaciones/" +
          eventokey
      ] = false;
    },
    confirm(id, funcionario) {
      console.log(funcionario);
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
          this.eliminarEvento(id, funcionario);
          this.$message({
            type: "success",
            message: "Registro Eliminado"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    },
    consultarEventos(e) {
      if (e && e.keyCode === 13) {
        this.obtenerListadoEventos(true);
        return;
      } else {
        this.obtenerListadoEventos(true);
      }
    },
    eliminarEvento(id, funcionario) {
      var index = this.eventos.findIndex(i => i.id === id);
      this.eventos.splice(index, 1);
      if (funcionario) {
        this.$http
          .put(`/funcionarios/update-vacation/${funcionario}`, {
            vacaciones: "false"
          })
          .then(console.log("Elimino vacaciones de funcionario"));
      }
      this.$http.delete(`/eventos/delete/${id}`);
    },
    obtenerListadoEventos(pageReset) {
      if (pageReset) {
        this.pageOne.currentPage = 1;
      }
      this.$http
        .get(
          `/eventos?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&tipoEvento=${this.listado}&busqueda=${this.query.busqueda}`
        )
        .then(response => {
          console.log(response);
          this.eventos = response.data.docs;
          this.pageOne.totalItems = response.data.total;
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  watch: {
    listado: function() {
      return this.obtenerListadoEventos();
    }
  },
  created() {
    this.obtenerListadoEventos();
  },
  components: {
    appPagination: Pagination
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}

#app > div.pusher > div > div > div.field > table > tbody > tr > td.capital {
  text-transform: capitalize;
}
</style>
