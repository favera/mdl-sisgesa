<template>
  <div class="ui twelve wide column">
    <form class="ui form" @submit.prevent="guardarEvento">
      <div class="ui dividing header">Incluir Evento</div>

      <div class="ten wide field">
        <div class="required field">
          <label for="">Tipo de Evento</label>
        </div>

        <div class="inline fields">
          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="evento.tipoEvento" @click="errors.items.length=0" value="vacaciones">
              <label>Vacaciones</label>
            </div>
          </div>

          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="evento.tipoEvento" @click="errors.items.length = 0" value="feriado">
              <label>Feriado</label>
            </div>
          </div>
        </div>
      </div>

      <div class="ten wide field" v-show="evento.tipoEvento ==='vacaciones'">
        <div class="required field">
          <label for="">Seleccionar Funcionario</label>

          <div class="field" :class="{error: errors.has('funcionario')}">
            <select class="ui dropdown" name="funcionario" v-model="funcionarioSeleccionado" data-vv-as="funcionario" v-validate="'required'">
              <option disabled value="">Seleccionar Funcionario..</option>
              <option v-for="funcionario in funcionarios" :key="funcionario._id" v-bind:value="funcionario._id">{{funcionario.nombre}}</option>
            </select>
            <span class="info-error" v-show="errors.has('funcionario')">{{errors.first('funcionario')}}</span>
          </div>

        </div>

        <div class="required field">
          <label>Periodo de Vacaciones</label>
          <div class="inline fields">
            <label>Fecha Inicio</label>
            <div class="field" :class="{error: errors.has('fechaInicio')}">
              <el-date-picker name="fechaInicio" v-model="evento.fechaInicio" type="date" format="dd/MM/yyyy" v-validate="{required: true}" data-vv-as="fecha inicio" placeholder="Seleccionar Fecha"></el-date-picker>
              <div class="info-error" v-show="errors.has('fechaInicio')">{{errors.first('fechaInicio')}}</div>
            </div>

            <label>Fecha Fin</label>
            <div class="field" :class="{error: errors.has('fechaFin')}">
              <el-date-picker name="fechaFin" v-model="evento.fechaFin" type="date" format="dd/MM/yyyy" data-vv-as="fecha fin" v-validate="{required:true}" placeholder="Seleccionar Fecha"></el-date-picker>
              <div class="info-error" v-show="errors.has('fechaFin')">{{errors.first('fechaFin')}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="ten wide field" v-show="evento.tipoEvento === 'feriado'">
        <div class="ten wide required field">
          <label for="">Seleccionar Fecha del Feriado</label>
          <div class="field" :class="{error: errors.has('fechaFeriado')}">
            <el-date-picker name="fechaFeriado" v-model="evento.fechaFeriado" format="dd/MM/yyyy" data-vv-as="fecha del feriado" v-validate="'required'" placeholder="Seleccionar fecha"></el-date-picker>
            <div class="info-error" v-show="errors.has('fechaFeriado')">{{this.errors.first('fechaFeriado')}}</div>
          </div>

        </div>

        <div class="tend wide required field">
          <label for="">Motivo del Feriado</label>
          <div class="field" :class="{error: errors.has('motivoFeriado')}">
            <input type="text" name="motivoFeriado" v-model="evento.motivoFeriado" data-vv-as="motivo del feriado" v-validate="'required'">
            <span class="info-error" v-show="errors.has('motivoFeriado')">{{errors.first('motivoFeriado')}}</span>
          </div>

        </div>
      </div>

      <div class="ten wide field">
        <button class="ui teal button">Guardar</button>
        <div class="ui button" @click="cancelar()">Cancelar</div>
      </div>

    </form>

  </div>
</template>

<script>
import moment from "moment";
import { Validator } from "vee-validate";

export default {
  name: "calendario",
  data() {
    return {
      evento: {
        tipoEvento: "vacaciones",
        fechaFeriado: null,
        fechaInicio: moment()
          .startOf("week")
          .format(),
        fechaFin: moment()
          .endOf("week")
          .format(),
        funcionario: null,
        nombreFuncionario: null,
        motivoFeriado: null
      },
      funcionarios: [],
      funcionarioSeleccionado: null
    };
  },
  methods: {
    obtenerEvento() {
      // debugger;
      if (this.$route.params.id) {
        this.$http
          .get(`/eventos/edit/${this.$route.params.id}`)
          .then(response => {
            this.evento.tipoEvento = response.data.tipoEvento;

            if (response.data.tipoEvento === "vacaciones") {
              this.evento.fechaFin = response.data.fechaFin;
              this.evento.fechaInicio = response.data.fechaInicio;
              this.evento.funcionario = response.data.funcionario;
              this.funcionarioSeleccionado = response.data.funcionario;
              $(this.$el)
                .find(".ui.dropdown")
                .dropdown("refresh")
                .dropdown("set selected", response.data.funcionario);
            } else {
              this.evento.fechaFeriado = response.data.fechaFeriado;
              this.evento.motivoFeriado = response.data.motivoFeriado;
            }
          });
      }
    },
    guardarEvento() {
      console.log(this.$route.params.id);
      this.$validator.validateAll().then(() => {
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
                if (e.errmsg && e.errmsg.includes("duplicate")) {
                  this.errors.add(
                    "fechaFeriado",
                    "La fecha indicada ya existe"
                  );
                }
                this.fail();
              });
          } else {
            this.$http
              .put(`/eventos/update/${this.$route.params.id}`, {
                tipoEvento: this.evento.tipoEvento,
                fechaInicio: this.evento.fechaInicio,
                fechaFin: this.evento.fechaFin,
                funcionario: this.funcionarioSeleccionado,
                nombreFuncionario: this.getNombreFuncionario(
                  this.funcionarioSeleccionado
                )
              })
              .then(response => {
                console.log("Response from update", response);
                this.$http.put(
                  `/funcionarios/update-vacation/${
                    this.funcionarioSeleccionado
                  }`,
                  {
                    vacaciones: response.data._id
                  }
                );
                this.success();
                this.cancelar();
              })
              .catch(e => {
                console.log("Respuesta", e.response.data.errors);
                this.fail();
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
              .catch(error => {
                if (
                  error.response.data.errmsg &&
                  error.response.data.errmsg.includes("duplicate")
                ) {
                  this.errors.add(
                    "fechaFeriado",
                    "La fecha indicada ya existe"
                  );
                }
                this.fail();
              });
          } else {
            this.$http
              .post(`/eventos/add`, {
                tipoEvento: this.evento.tipoEvento,
                fechaInicio: this.evento.fechaInicio,
                fechaFin: this.evento.fechaFin,
                funcionario: this.funcionarioSeleccionado,
                nombreFuncionario: this.getNombreFuncionario(
                  this.funcionarioSeleccionado
                )
              })
              .then(response => {
                this.$http
                  .put(
                    `/funcionarios/update-vacation/${
                      this.funcionarioSeleccionado
                    }`,
                    {
                      vacaciones: response.data._id,
                      activo: true
                    }
                  )
                  .then(response => console.log(response));
                this.success();
                this.cancelar();
              })
              .catch(e => {
                if (
                  e.response.data.errors &&
                  e.response.data.errors.hasOwnProperty("fechaInicio")
                ) {
                  this.errors.add(
                    "fechaInicio",
                    e.response.data.errors["fechaInicio"].message
                  );
                }

                if (
                  e.response.data.errors &&
                  e.response.data.errors.hasOwnProperty("fechaFin")
                ) {
                  this.errors.add(
                    "fechaFin",
                    e.response.data.errors["fechaFin"].message
                  );
                }

                this.fail();
              });
          }
        }
      });
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
  updated() {
    Validator.extend("validar_fecha_before", {
      getMessage: field => `La fecha ${field} debe ser posterior a xxx`,
      validate: function(fecha, evento) {
        // debugger;
        return moment(fecha).isBefore(evento[0].evento.fechaFin);
      }
    });
    Validator.extend("validar_fecha_after", {
      getMessage: field => `La fecha ${field} debe ser posterior a xxx`,
      validate: function(fecha, evento) {
        // debugger;
        return moment(fecha).isAfter(evento[0].evento.fechaInicio);
      }
    });
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


