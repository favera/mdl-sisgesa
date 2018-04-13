<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Eventos en el Calendario</h4>
      <div class="two fields">
        <div class="twelve wide field">

          <div class="inline fields">
            <div class="ten wide field">
              <div class="ui icon input">
                <input type="text" placeholder="Buscar Evento...">
                <i class="inverted teal circular search link icon"></i>
              </div>
            </div>

            <div class="sixteen wide field">
              <label>Listar por</label>
              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="feriado" value="feriado" v-model="listado">
                  <label>Feriados</label>
                </div>
              </div>

              <div class="field">
                <div class="ui radio checkbox">
                  <input type="radio" name="vacaciones" value="vacaciones" v-model="listado">
                  <label>Vacaciones</label>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="incluirEvento">
              <i class="plus icon"></i>
            </a>
            <a class="icon item">
              <i class="print icon"></i>
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
            <th>Fecha del Feriado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evento in eventos" :key="evento._id" v-if="evento.tipoEvento==='feriado'">
            <td class="capital">{{evento.tipoEvento}}</td>
            <td>{{moment(evento.fechaFeriado).format("L")}}</td>
            <td>
              <router-link :to="{name: 'editarEvento', params: { id: evento._id}}">
                <i class="edit row icon"></i>
              </router-link>

              <i class="trash icon" @click="confirm(evento._id)"></i>

            </td>
          </tr>

        </tbody>
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
            <td>{{evento.funcionario.nombre}}</td>
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

        <tfoot>

        </tfoot>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: "calendarioList",
  data() {
    return {
      eventos: [],
      listado: "vacaciones",
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
    obtenerListadoEventos() {
      this.$http
        .get(
          `/eventos?page=${this.pageOne.currentPage}&limit=${
            this.pageOne.itemsPerPage
          }`
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
  created() {
    this.obtenerListadoEventos();
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
