<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Eventos en el Calendario</h4>
      <div class="two fields">
        <div class="twelve wide field">

          <div class="inline fields">
            <div class="ten wide field">
              <div class="ui icon input">
                <input type="text" v-model="query.parameter" @keydown="searchEvents" placeholder="Buscar Evento...">
                <i class="close link icon" v-show="query.parameter" @click="cleanField()"></i>
              </div>
              <button class="ui circular teal icon button" @click="searchEvents">
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
          <tr v-for="event in events" :key="event._id" v-if="event.eventType==='feriado'">
            <td class="capital">{{event.eventType}}</td>
            <td>{{event.holidayDescription}}</td>
            <td>{{moment(event.holidayDate).format("L")}}</td>
            <td class="center aligned">
              <i class="edit row link icon" @click="editEvent(event.active, event._id)"></i>
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
          <tr v-for="event in events" :key="event._id" v-if="event.eventType==='vacaciones'">
            <td class="capital">{{event.eventType}}</td>
            <td>{{event.employeeName}}</td>
            <td>{{moment(event.startDate).format("L")}}</td>
            <td>{{moment(event.endDate).format("L")}}</td>
            <td class="center aligned">
              <i class="edit row link icon" :class="{disabled:!event.active}" @click="editEvent(event.active, event._id)"></i>
              <i class="trash link icon" :class="{disabled:!event.active}" @click="confirm(event._id, event.employee, event.active)"></i>
              <i class="archive link icon" :class="{disabled:!event.active}" @click="closeVacations(event._id, event.employee, event.active)"></i>
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
      this.$router.push({ name: "includeEvent" });
    },
    editEvent(eventStatus, eventId) {
      if (eventStatus) {
        this.$router.push({ name: "editEvent", params: { id: eventId } });
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
      this.$http.get(`/events/deactivate-vacation/${eventkey}`).then(() => {
        this.$message({
          type: "info",
          message: "Registro archivado"
        });
        this.getEvents();
      });
    },
    confirm(id, employee, eventStatus) {
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
            this.deleteEvent(id, employee);
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
    searchEvents(e) {
      if (e && e.keyCode === 13) {
        this.getEvents(true);
        return;
      } else {
        this.getEvents(true);
      }
    },
    deleteEvent(id, employee) {
      // debugger;
      var index = this.events.findIndex(i => i.id === id);
      if (employee) {
        this.$http
          .put(`/employees/update-vacation/${employee}`, {
            vacations: id,
            active: false
          })
          .then(response => {
            this.$http.delete(`/events/delete/${id}`).then(response => {
              this.events.splice(index, 1);
            });
          });
      } else {
        this.$http.delete(`/events/delete/${id}`).then(response => {
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
          `/events?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }&eventType=${this.listType}&parameter=${this.query.parameter}`
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
