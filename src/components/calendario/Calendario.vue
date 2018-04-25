<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <div class="ui dividing header">Incluir Evento</div>

      <div class="ten wide field">
        <div class="field">
          <label for="">Tipo de Evento:</label>
        </div>

        <div class="inline fields">
          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="evento.tipoEvento" value="vacaciones">
              <label>Vacaciones</label>
            </div>
          </div>

          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="evento.tipoEvento" value="feriado">
              <label>Feriado</label>
            </div>
          </div>
        </div>
      </div>

      <div class="ten wide field" v-if="evento.tipoEvento ==='vacaciones'">
        <div class="field">
          <label for="">Seleccionar Funcionario</label>

          <select class="ui dropdown" name="funcionarios" v-model="evento.funcionario">
            <option disabled value="">Seleccionar Funcionario..</option>
            <option v-for="funcionario in funcionarios" :key="funcionario._id" v-bind:value="funcionario._id">{{funcionario.nombre}}</option>
          </select>
        </div>

        <div class="field">
          <label>Periodo de Vacaciones</label>
          <div class="inline fields">
            <label>Fecha Inicio:</label>
            <div class="field">
              <el-date-picker v-model="evento.fechaInicio" type="date" format="dd/MM/yyyy" placeholder="Seleccionar Fecha"></el-date-picker>
            </div>

            <label>Fecha Fin:</label>
            <div class="field">
              <el-date-picker v-model="evento.fechaFin" type="date" format="dd/MM/yyyy" placeholder="Seleccionar Fecha"></el-date-picker>
            </div>
          </div>
        </div>
      </div>

      <div class="ten wide field" v-else-if="evento.tipoEvento === 'feriado'">
        <div class="ten wide field">
          <label for="">Seleccionar Fecha del Feriado:</label>
          <el-date-picker v-model="evento.fechaFeriado" format="dd/MM/yyyy" placeholder="Seleccionar fecha"></el-date-picker>
        </div>

        <div class="tend wide field">
          <label for="">Motivo del Feriado:</label>
          <input type="text" v-model="evento.motivoFeriado">
        </div>
      </div>

      <div class="ten wide field">
        <div class="ui teal button" @click="guardarEvento()">Guardar</div>
        <div class="ui button" @click="cancelar()">Cancelar</div>
      </div>

    </div>

  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "calendario",
  data() {
    return {
      evento: {
        tipoEvento: "vacaciones",
        fechaFeriado: null,
        fechaInicio: null,
        fechaFin: null,
        funcionario: null,
        nombreFuncionario: null,
        motivoFeriado: null
      },
      funcionarios: []
    };
  },
  methods: {
    obtenerEvento() {
      console.log(this.$route.params.id);

      if (this.$route.params.id) {
        this.$http
          .get(`/eventos/edit/${this.$route.params.id}`)
          .then(response => {
            this.evento.tipoEvento = response.data.tipoEvento;
            this.evento.fechaInicio = response.data.fechaInicio;
            this.evento.fechaFin = response.data.fechaFin;
            this.evento.fechaFeriado = response.data.fechaFeriado;
            this.evento.funcionario = response.data.funcionario;
            this.evento.motivoFeriado = response.data.motivoFeriado;
          });
      }
    },
    guardarEvento() {
      console.log(this.$route.params.id);
      if (typeof this.$route.params.id !== "undefined") {
        if (this.evento.tipoEvento === "feriado") {
          this.$http
            .put(`/eventos/update/${this.$route.params.id}`, {
              tipoEvento: this.evento.tipoEvento,
              fechaFeriado: this.evento.fechaFeriado,
              motivoFeriado: this.evento.motivoFeriado
            })
            .then(response => {
              console.log(response);
              this.success();
              this.cancelar();
            })
            .catch(e => {
              console.log(e);
              this.fail();
              this.cancelar();
            });
        } else {
          this.$http
            .put(`/eventos/update/${this.$route.params.id}`, {
              tipoEvento: this.evento.tipoEvento,
              fechaInicio: this.evento.fechaInicio,
              fechaFin: this.evento.fechaFin,
              funcionario: this.evento.funcionario,
              nombreFuncionario: this.getNombreFuncionario(
                this.evento.funcionario
              )
            })
            .then(response => {
              console.log("Response from update", response);
              this.$http.put(
                `/funcionarios/update-vacation/${this.evento.funcionario}`,
                {
                  vacaciones: response.data._id
                }
              );
              this.success();
              this.cancelar();
            })
            .catch(e => {
              console.log(e);
              this.fail();
              this.cancelar();
            });
        }
      } else {
        if (this.evento.tipoEvento === "feriado") {
          this.$http
            .post(`/eventos/add`, {
              tipoEvento: this.evento.tipoEvento,
              fechaFeriado: this.evento.fechaFeriado,
              motivoFeriado: this.evento.motivoFeriado
            })
            .then(response => {
              console.log(response);
              this.success();
              this.cancelar();
            })
            .catch(e => {
              console.log(e);
              this.fail();
              this.cancelar();
            });
        } else {
          this.$http
            .post(`/eventos/add`, {
              tipoEvento: this.evento.tipoEvento,
              fechaInicio: this.evento.fechaInicio,
              fechaFin: this.evento.fechaFin,
              funcionario: this.evento.funcionario,
              nombreFuncionario: this.getNombreFuncionario(
                this.evento.funcionario
              )
            })
            .then(response => {
              console.log(response);
              this.$http.put(
                `/funcionarios/update-vacation/${this.evento.funcionario}`,
                {
                  vacaciones: response.data._id
                }
              );
              this.success();
              this.cancelar();
            })
            .catch(e => {
              console.log(e);
              this.fail();
              this.cancelar();
            });
        }
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoCalendario" });
    },
    success() {
      this.$notify({
        title: "Exito!",
        message: "El registro se ha creado correctamente",
        type: "success"
      });
    },
    fail() {
      this.$notify.error({
        title: "Error!",
        message: "No se ha podido guardar el registro"
      });
    },
    getNombreFuncionario(id) {
      var nombre;
      this.funcionarios.find(funcionario => {
        if (funcionario._id === id) {
          nombre = funcionario.nombre;
        }
      });

      return nombre;
    },
    obtenerFuncionarios() {
      this.$http
        .get(`/funcionarios/full-list`)
        .then(response => {
          this.funcionarios = response.data;
        })
        .catch(e => {
          console.log(e);
          this.fail();
        });
    }
  },
  mounted() {
    $(this.$el)
      .find(".ui.dropdown")
      .dropdown();
  },
  created() {
    this.obtenerFuncionarios();
    this.obtenerEvento();
  },
  watch: {
    $route: "obtenerEvento"
  }
};
</script>

<style>

</style>


