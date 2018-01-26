<template>
    <div class="ui twelve wide column">
    
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Adelantos</h4>
            <div class="two fields">
                <div class="ten wide field">
    
                    <div class="ui icon input">
                        <input type="text" placeholder="Buscar Feriado...">
                        <i class="inverted teal circular search link icon" @click="listar"></i>
                    </div>
    
                </div>
    
                <div class="field">
                    <div class="ui right floated main menu">
                    <a class="icon item" @click="incluirAdelanto">
                      <i class="plus icon"></i>
                    </a>
                    <a class="icon item">
                      <i class="print icon"></i>
                    </a>
                  </div>
                   
    
                </div>
            </div>
    
        </div>
    
        <div class="field">
    
            <table class="ui teal celled table">
                <thead>
                    <tr>
                     <th class="collapsing">
        <div class="ui fitted checkbox">
          <input type="checkbox" @click="selectAll"> <label></label>
        </div>
      </th>
                        <th>Fecha</th>
                        <th>Funcionario</th>
                        <th>Tipo de Adelanto</th>
                        <th>Monto</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="adelanto in adelantos" :key="adelanto['.key']">
                      <td class="collapsing">
        <div class="ui fitted checkbox">
          <input type="checkbox" id="adelantoCheck"> <label></label>
        </div>
      </td>
                        <td>{{adelanto.fecha}}</td>
                        <td>{{adelanto.nombreFuncionario}}</td>
                        <td>{{adelanto.tipoAdelanto}}</td>
                        <td>{{adelanto.monto}} {{adelanto.moneda}}</td>
                        <td>
                            <router-link :to="{name: 'editarAdelanto', params: { id: adelanto['.key']}}">
                                <i class="edit row icon"></i>
                            </router-link>
                            
                            <i class="trash icon" @click="confirm(adelanto['.key'])"></i>
                            <i class="print icon"></i>
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

let adelantosRef = db.ref("/adelantos");

export default {
  data() {
    return {
      adelantos: []
    };
  },
  methods: {
    incluirAdelanto() {
      this.$router.push({ name: "incluirAdelanto" });
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
          this.eliminarAdelanto(id);
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
    eliminarFeriado(id) {
      var index = this.sucursales.findIndex(i => i.id === id);
      db.ref("/adelantos/" + id).remove();
    },
    selectAll() {
      $(this.$el)
        .find("#adelantoCheck")
        .checkbox("set checked");
    }
  },
  created() {
    this.$bindAsArray("adelantos", adelantosRef);
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
