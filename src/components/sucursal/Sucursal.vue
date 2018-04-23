<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <div class="ui dividing header">Registrar Sucursal</div>

      <div class="ten wide field">
        <label for="">Nombre Sucursal:</label>
        <input type="text" v-model="sucursal.nombre">
      </div>

      <div class="ten wide field">
        <div class="inline fields">
          <div class="eight wide field">
            <label for="">Horario Entrada</label>
          </div>
          <div class="eight wide field">
            <label for="">Horario Salida</label>
          </div>
        </div>
        <div class="inline fields">
          <div class="eight wide field">
            <el-time-picker v-model="sucursal.horaEntrada" format="HH:mm" value-format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Asignar Horario Entrada">
            </el-time-picker>
          </div>

          <div class="eight wide field">
            <el-time-picker v-model="sucursal.horaSalida" format="HH:mm" value-format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Asignar Horario Entrada">
            </el-time-picker>
          </div>
        </div>
      </div>

      <div class="ten wide field">
        <label for="">Telefono:</label>
        <input type="text" v-model="sucursal.telefono">
      </div>

      <div class="ui teal button" @click="guardarSucursal">Guardar</div>
      <div class="ui button" @click="cancelar">Cancelar</div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: "sucursal",
  data() {
    return {
      sucursal: {
        nombre: null,
        horaEntrada: null,
        horaSalida: null,
        telefono: null
      }
    };
  },
  methods: {
    guardarSucursal() {
      if (this.$route.params.id) {
        this.$http
          .put("/sucursales/update/" + this.$route.params.id, {
            nombre: this.sucursal.nombre,
            horaEntrada: this.sucursal.horaEntrada,
            horaSalida: this.sucursal.horaSalida,
            telefono: this.sucursal.telefono
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          });
      } else {
        this.$http
          .post("/sucursales/add", {
            nombre: this.sucursal.nombre,
            horaEntrada: this.sucursal.horaEntrada,
            horaSalida: this.sucursal.horaSalida,
            telefono: this.sucursal.telefono
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          })
          .catch(e => console.log(e));
      }
    },
    obtenerSucursal() {
      if (this.$route.params.id) {
        this.$http
          .get("/sucursales/edit/" + this.$route.params.id)
          .then(response => {
            this.sucursal.nombre = response.data.nombre;
            this.sucursal.horaEntrada = response.data.horaEntrada;
            this.sucursal.horaSalida = response.data.horaSalida;
            this.sucursal.telefono = response.data.telefono;
          });
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoSucursal" });
    },
    success() {
      this.$notify({
        title: "Exito!",
        message: "La sucursal se ha creado correctamente",
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
  created() {
    this.obtenerSucursal();
  },
  watch: {
    $route: "obtenerSucursal"
  }
};
</script>
<style>
.el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}
</style>
