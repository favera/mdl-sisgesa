<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <div class="ui dividing header">Incluir Feriado</div>

      <div class="ten wide field">
        <label for="">Seleccionar Fecha del Feriado</label>
        <el-date-picker v-model="feriado.fechaUtc" format="dd/MM/yyyy" type="date" placeholder="Seleccionar fecha"></el-date-picker>
      </div>

      <div class="ten wide field">
        <div class="field">
          <label for="">Tipo de Feriado:</label>
        </div>

        <div class="inline fields">
          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="feriado.tipoFeriado" value="completo">
              <label>Completo</label>
            </div>
          </div>

          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="feriado.tipoFeriado" value="parcial">
              <label>Parcial</label>
            </div>
          </div>

          <div class="eight wide field" v-show="feriado.tipoFeriado ==='parcial'">
            <el-time-picker v-model="feriado.horasUtc" format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Asignar Horas del feriado">
            </el-time-picker>
          </div>
        </div>
      </div>

      <div class="ten wide field">
        <label for="">Seleccionar Sucursales afectadas</label>
        <select name="sucursales" multiple="" class="ui fluid dropdown" v-model="feriado.sucursalesAfectadas">
          <option disabled value="">Seleccionar Sucursal..</option>
          <option v-for="sucursal in sucursales" :key="sucursal['.key']" v-bind:value="sucursal.nombre">{{sucursal.nombre}}</option>
        </select>
      </div>

      <div class="ui teal button" @click="guardarFeriado()">Guardar</div>
      <div class="ui button" @click="cancelar()">Cancelar</div>
    </div>

  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      feriado: {
        fechaUtc: "",
        fecha: "",
        tipoFeriado: "completo",
        horasUtc: "",
        sucursalesAfectadas: []
      },
      sucursales: [],
      feriados: []
    };
  },
  methods: {
    obtenerSucursales() {
      // this.$http.get(url + "/sucursals").then(response => {
      //   this.sucursales = response.data;
      //   console.log(this.sucursales);
      // });
    },
    obtenerFeriado() {
      console.log(this.$route.params.id);

      if (typeof this.$route.params.id !== "undefined") {
        console.log(feriadoRef.child(this.$route.params.id));
        feriadoRef.child(this.$route.params.id).once("value", snapshot => {
          console.log(snapshot.val());
          this.feriado.fechaUtc = snapshot.val().fechaUtc;
          this.feriado.tipoFeriado = snapshot.val().tipoFeriado;
          this.feriado.sucursalesAfectadas = snapshot.val().sucursalesAfectadas;
        });
      }
    },
    guardarFeriado() {
      if (typeof this.$route.params.id !== null) {
        var horaResult;
        var horaResultUtc;
        if (this.feriado.tipoFeriado === "parcial") {
          horaResult = moment
            .utc(this.feriado.horasUtc)
            .local()
            .format("HH:mm");
          horaResultUtc = this.feriado.horasUtc.toString();
        } else {
          horaResult = null;
          horaResultUtc = null;
        }

        this.feriado.fecha = moment(this.feriado.fechaUtc, "DD/MM/YYYY")
          .format("L")
          .toString();
        this.feriado.fechaUtc = this.feriado.fechaUtc.toString();

        feriadoRef
          .child(this.$route.params.id)
          .update(this.feriado)
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          });
      } else {
        var horaResult;
        var horaResultUtc;
        if (this.feriado.tipoFeriado === "parcial") {
          horaResult = moment
            .utc(this.feriado.horasUtc)
            .local()
            .format("HH:mm");
          horaResultUtc = this.feriado.horasUtc.toString();
        } else {
          horaResult = null;
          horaResultUtc = null;
        }

        this.feriado.fecha = moment(this.feriado.fechaUtc, "DD/MM/YYYY")
          .format("L")
          .toString();
        this.feriado.fechaUtc = this.feriado.fechaUtc.toString();
        feriadosRef.push(this.feriado).then(this.success(), this.cancelar());
        console.log(JSON.stringify(this.sucursalesAfectadas));
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoFeriado" });
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
    }
  },
  mounted() {
    this.$bindAsArray("sucursales", sucursalesRef);
    this.obtenerSucursales();
    $(this.$el)
      .find(".ui.fluid.dropdown")
      .dropdown();
  },
  created() {
    this.obtenerFeriado();
  },
  watch: {
    $route: "obtenerFeriado"
  }
};
</script>

<style>

</style>


