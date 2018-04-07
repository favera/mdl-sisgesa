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
import axios from "axios";
import moment from "moment";
import { url } from "./../.././config/backend";
import { db } from "./../.././config/firebase";
let sucursalRef = db.ref("sucursales");

export default {
  data() {
    return {
      sucursal: {
        nombre: null,
        horaEntrada: null,
        horaSalida: null,
        telefono: null
      },
      firebase: {
        sucursal: sucursalRef
      }
    };
  },
  methods: {
    guardarSucursal() {
      /*if (typeof this.$route.params.id !== null) {
        sucursalRef
          .child(this.$route.params.id)
          .update({
            nombre: this.sucursal.nombre,
            horarioEntrada: moment
              .utc(this.sucursal.horarioEntradaUtc)
              .local()
              .format("HH:mm"),
            horarioSalida: moment
              .utc(this.sucursal.horarioSalidaUtc)
              .local()
              .format("HH:mm"),

            horaLaboral: moment(this.sucursal.horarioSalidaUtc).diff(
              this.sucursal.horarioEntradaUtc,
              "minutes"
            ),
            horarioEntradaUtc: this.sucursal.horarioEntradaUtc.toString(),
            horarioSalidaUtc: this.sucursal.horarioSalidaUtc.toString(),
            telefono: this.sucursal.telefono
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          });
      } else {
        db
          .ref("sucursales")
          .push({
            nombre: this.sucursal.nombre,
            horarioEntrada: moment
              .utc(this.sucursal.horarioEntradaUtc)
              .local()
              .format("HH:mm"),
            horarioSalida: moment
              .utc(this.sucursal.horarioSalidaUtc)
              .local()
              .format("HH:mm"),

            horaLaboral: moment(this.sucursal.horarioSalidaUtc).diff(
              this.sucursal.horarioEntradaUtc,
              "minutes"
            ),
            horarioEntradaUtc: this.sucursal.horarioEntradaUtc.toString(),
            horarioSalidaUtc: this.sucursal.horarioSalidaUtc.toString(),
            telefono: this.sucursal.telefono
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          });
      }*/
      if (this.$route.params.id) {
        axios
          .put(
            "http://localhost:3000/sucursales/update/" + this.$route.params.id,
            {
              nombre: this.sucursal.nombre,
              horaEntrada: this.sucursal.horaEntrada,
              horaSalida: this.sucursal.horaSalida,
              telefono: this.sucursal.telefono
            }
          )
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          });
      } else {
        axios
          .post("http://localhost:3000/sucursales/add", {
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
      // if (typeof this.$route.params.id !== "undefined") {
      //   console.log(sucursalRef.child(this.$route.params.id));
      //   sucursalRef.child(this.$route.params.id).once("value", snapshot => {
      //     console.log(snapshot.val());
      //     this.sucursal.nombre = snapshot.val().nombre;
      //     this.sucursal.horarioEntradaUtc = snapshot.val().horarioEntradaUtc;
      //     this.sucursal.horarioSalidaUtc = snapshot.val().horarioSalidaUtc;
      //     this.sucursal.telefono = snapshot.val().telefono;
      //   });
      //   /*db.ref("/sucursal/" + this.$route.params.id).on("value", snapshot => {
      //     console.log(snapshot.val());
      //     this.sucursal.nombre = snapshot.val().nombre;
      //   });*/
      // }

      if (this.$route.params.id) {
        axios
          .get("http://localhost:3000/sucursales/edit/" + this.$route.params.id)
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
