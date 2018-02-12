<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Prestamos</h4>
      <div class="two fields">
        <div class="field">
          <div class="inline fields">

            <div class="ten wide field">
              <div class="ui icon input">
                <input type="text" placeholder="Buscar por nombre del funcionario...">
                <i class="inverted teal circular search link icon" @click="listar"></i>
              </div>
            </div>

            <div class="field">

            </div>

            <!-- <div class="field">
                     <a @click="busquedaAvanzada=true">Busqueda Avanzada</a>
                    
                  </div>
     -->

          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="incluirPrestamo">
              <i class="plus icon"></i>
            </a>
            <a class="icon item">
              <i class="find icon" @click="busquedaAvanzada=!busquedaAvanzada"></i>
            </a>

          </div>

        </div>
      </div>
      <!-- <h4 class="ui dividing header"></h4> -->
      <!-- <div class="two fields" v-show="busquedaAvanzada">
              <div class="field">
                <label for="">Rango de Fechas:</label>
                <div class="inline fields">
                <div class="field">
                            <el-date-picker v-model="fechaInicio" type="date" placeholder="Fecha inicio" format="dd/MM/yyyy">
                            </el-date-picker>
                        </div>

                        <div class="field">
                            <el-date-picker v-model="fechaFin" type="date" placeholder="Fecha fin" format="dd/MM/yyyy" >
                            </el-date-picker>
                        </div>
            </div>
                  
              </div>

              <div class="field">
                <label for="">Tipo de Adelanto:</label>
                <div class="inline fields">
                   <div class="field">
                  <div class="ui radio checkbox">
                    <input type="radio" value="salario" >
                    <label>Quincena</label>
                  </div>
                </div>

                 <div class="field">
                  <div class="ui radio checkbox">
                    <input type="radio" value="salario" >
                    <label>Monto Especificado</label>
                  </div>
                </div>

            
            </div>
                  
              </div>
            </div> -->

    </div>

    <div class="field">

      <table class="ui teal celled table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Funcionario</th>
            <th>Monto del Prestamo</th>
            <th>Cuotas</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prestamo in prestamos" :key="prestamo['.key']">

            <div class="ui longer modal">
              <div class="header"> Cuotas generadas del Prestamo </div>
              <div class="scrolling content">
                <div class="ui segment">

                  <div class="content">
                    <div class="ui divided items">
                      <div class="item">
                        <div class="middle aligned content">
                          <h5> Vencimiento</h5>
                        </div>
                        <div class="middle aligned content">
                          <h5>Monto</h5>
                        </div>
                        <div class="middle aligned content">
                          <h5>Estado</h5>
                        </div>
                      </div>

                      <div class="item" :key="cuota.vencimiento" v-for="cuota in prestamo.cuotas">
                        <div class="middle aligned content">
                          <p>{{cuota.vencimiento}}</p>
                        </div>
                        <div class="middle aligned content">
                          <p>{{cuota.monto}}-{{cuota.moneda}}</p>
                        </div>

                        <div class="middle aligned content">
                          <div class="ui orange horizontal label">{{cuota.estado}}</div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>

            <td>{{prestamo.fecha}}</td>
            <td>{{prestamo.nombreFuncionario}}</td>
            <td>{{prestamo.monto}} - {{prestamo.moneda}}</td>

            <td>
              <i class="browser icon" @click="abrirModal()"></i>
            </td>
            <td>
              <router-link :to="{name: 'editarPrestamo', params: { id: prestamo['.key']}}">
                <i class="edit row icon"></i>
              </router-link>

              <i class="trash icon" @click="confirm(prestamo['.key'])"></i>
            </td>
          </tr>

        </tbody>
      </table>

    </div>

  </div>
</template>

<script>
import axios from "axios";
import { db } from "./../.././config/firebase";

let prestamosRef = db.ref("/prestamos");

export default {
  data() {
    return {
      prestamos: [],
      modal: null,
      busquedaAvanzada: false
    };
  },
  methods: {
    incluirPrestamo() {
      this.$router.push({ name: "incluirPrestamo" });
    },
    listar() {
      /*Array.from(this.feriados).forEach(item => {
        console.log(JSON.stringify(item[".key"]));
        var test = feriadoRef.child(item[".key"]).child("sucursalesAfectadas");
        console.log("Variable Test", test);
        var sucursalesNombre = [];
        test.on("child_added", snap => {
          sucursalRef.child(snap.key).once("value", sucursal => {
            console.log("Test" + JSON.stringify(sucursal.val()));

            sucursalesNombre.push(sucursal.val().nombre);
          });
          console.log("Feriadosooo", JSON.stringify(this.sucursalesNombre));
        });
        console.log("item a guardar", JSON.stringify(item));
        this.feriados.sucursalesNombre = sucursalesNombre;
      });*/
    },
    confirm(id) {
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
          this.eliminarPrestamo(id);
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
    eliminarPrestamo(id) {
      //var index = this.sucursales.findIndex(i => i.id === id);
      prestamosRef.child(id).remove();
      //db.ref("/adelantos/" + id).remove();
    },
    abrirModal() {
      this.modal
        .modal("setting", { observeChanges: true })
        .modal("show")
        .modal("refresh");
    }
  },
  created() {
    this.$bindAsArray("prestamos", prestamosRef);
  },
  mounted() {
    this.modal = $(this.$el).find(".ui.longer.modal");
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
