<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <div class="ui dividing header">Registrar Sucursal</div>

      <div class="ten wide field">
        <label for="">Nombre Sucursal:</label>
        <input type="text" v-model="subsidiary.name">
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
            <el-time-picker v-model="subsidiary.startingTime" format="HH:mm" value-format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Asignar Horario Entrada">
            </el-time-picker>
          </div>

          <div class="eight wide field">
            <el-time-picker v-model="subsidiary.endTime" format="HH:mm" value-format="HH:mm" :picker-options="{
                    format: 'HH:mm'
                    }" placeholder="Asignar Horario Entrada">
            </el-time-picker>
          </div>
        </div>
      </div>

      <div class="ten wide field">
        <label for="">Telefono:</label>
        <input type="text" v-model="subsidiary.phone">
      </div>

      <div class="ui teal button" @click="saveSubsidiary">Guardar</div>
      <div class="ui button" @click="cancel">Cancelar</div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: "sucursal",
  data() {
    return {
      subsidiary: {
        name: null,
        startingTime: null,
        endTime: null,
        phone: null
      }
    };
  },
  methods: {
    saveSubsidiary() {
      if (this.$route.params.id) {
        this.$http
          .put("/sucursales/update/" + this.$route.params.id, {
            name: this.subsidiary.name,
            startingTime: this.subsidiary.startingTime,
            endTime: this.subsidiary.endTime,
            phone: this.subsidiary.phone
          })
          .then(response => {
            this.success();
            this.cancel();
            console.log(response);
          });
      } else {
        this.$http
          .post("/sucursales/add", {
            name: this.subsidiary.name,
            startingTime: this.subsidiary.startingTime,
            endTime: this.subsidiary.endTime,
            phone: this.subsidiary.phone
          })
          .then(response => {
            this.success();
            this.cancel();
            console.log(response);
          })
          .catch(e => console.log(e));
      }
    },
    getSubsidiary() {
      if (this.$route.params.id) {
        this.$http
          .get("/sucursales/edit/" + this.$route.params.id)
          .then(response => {
            this.subsidiary.name = response.data.name;
            this.subsidiary.startingTime = response.data.startingTime;
            this.subsidiary.endTime = response.data.endTime;
            this.subsidiary.phone = response.data.phone;
          });
      }
    },
    cancel() {
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
    this.getSubsidiary();
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
