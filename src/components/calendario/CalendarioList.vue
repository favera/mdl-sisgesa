<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Eventos en el Calendario</h4>
      <div class="two fields">
        <div class="twelve wide field">

          <div class="inline fields">
            <div class="ten wide field">
              <div class="ui icon input">
                <input type="text" v-model="query.parameter" @keydown="consultarEventos" placeholder="Buscar Evento...">
                <!-- <i @click="consultarEventos" class="inverted teal circular search link icon"></i> -->
                <i class="close link icon" v-show="query.parameter" @click="cleanField()"></i>
              </div>
              <button class="ui circular teal icon button" @click="consultarEventos">
                <i class="search icon"></i>
              </button>
            </div>
            <div class="four wide field">
              <label>Tipo de Evento:</label>
            </div>

            <div class="three wide field">
              <div class="ui radio checkbox">
                <input type="radio" name="vacaciones" value="vacaciones" v-model="listType">
                <label>Vacaciones</label>
              </div>
            </div>

            <div class="two wide field">
              <div class="ui radio checkbox">
                <input type="radio" name="feriado" value="feriado" v-model="listType">
                <label>Feriados</label>
              </div>
            </div>

          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="addEvent">
              <i class="plus icon"></i>
            </a>

          </div>

        </div>
      </div>

    </div>

    <div class="field" v-if="listType==='feriado'">
      <table class="ui teal celled table">
        <thead>
          <tr>
            <th>Tipo de Evento</th>
            <th>Motivo del Feriado</th>
            <th>Fecha del Feriado</th>
            <th class="center aligned">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event._id" v-if="event.tipoEvento==='feriado'">
            <td class="capital">{{event.tipoEvento}}</td>
            <td>{{event.motivoFeriado}}</td>
            <td>{{moment(event.fechaFeriado).format("L")}}</td>
            <td class="center aligned">
              <i class="edit row link icon" @click="editEvent(event.activo, event._id)"></i>
              <i class="trash link icon" @click="confirm(event._id)"></i>
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
            <th class="center aligned">Opciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="event in events" :key="event._id" v-if="event.tipoEvento==='vacaciones'">
            <td class="capital">{{event.tipoEvento}}</td>
            <td>{{event.nombreFuncionario}}</td>
            <td>{{moment(event.fechaInicio).format("L")}}</td>
            <td>{{moment(event.fechaFin).format("L")}}</td>
            <td class="center aligned">
              <i class="edit row link icon" :class="{disabled:!event.activo}" @click="editEvent(event.activo, event._id)"></i>
              <i class="trash link icon" :class="{disabled:!event.activo}" @click="confirm(event._id, event.funcionario, event.activo)"></i>
              <i class="archive link icon" :class="{disabled:!event.activo}" @click="closeVacations(event._id, event.funcionario, event.activo)"></i>
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
      events: [],
      listType: "vacaciones",
      query: {
        parameter: null
      },
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };
  },
  methods: {
    cleanField() {
      this.query.parameter = null;
      this.getEvents();
    },
    addEvent() {
      this.$router.push({ name: "incluirEvento" });
    },
    editEvent(eventStatus, eventId) {
      if (eventStatus) {
        this.$router.push({ name: "editarEvento", params: { id: eventId } });
      }
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.getEvents();
    },
    closeVacations(eventkey, eventStatus) {
      if (eventStatus) {
      }
      console.log("key", eventkey);
      this.$http.get(`/eventos/deactivate-vacation/${eventkey}`).then(() => {
        this.$message({
          type: "info",
          message: "Registro archivado"
        });
        this.getEvents();
      });
    },
    confirm(id, funcionario, eventStatus) {
      if (eventStatus) {
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
      }
    },
    consultarEventos(e) {
      if (e && e.keyCode === 13) {
        this.getEvents(true);
        return;
      } else {
        this.getEvents(true);
      }
    },
    eliminarEvento(id, funcionario) {
      // debugger;
      var index = this.events.findIndex(i => i.id === id);
      if (funcionario) {
        this.$http
          .put(`/funcionarios/update-vacation/${funcionario}`, {
            vacaciones: id,
            activo: false
          })
          .then(response => {
            this.$http.delete(`/eventos/delete/${id}`).then(response => {
              this.events.splice(index, 1);
            });
          });
      } else {
        this.$http.delete(`/eventos/delete/${id}`).then(response => {
          this.events.splice(index, 1);
        });
      }
    },
    getEvents(pageReset) {
      if (pageReset) {
        this.pageOne.currentPage = 1;
      }
      this.$http
        .get(
          `/eventos?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&tipoEvento=${this.listType}&parameter=${this.query.parameter}`
        )
        .then(response => {
          console.log(response);
          this.events = response.data.docs;
          this.pageOne.totalItems = response.data.total;
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  watch: {
    listType: function() {
      return this.getEvents();
    }
  },
  created() {
    this.getEvents();
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
