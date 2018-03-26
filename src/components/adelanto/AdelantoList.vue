<template>
  <div class="ui twelve wide column">

    <div class="ui form">
      <h4 class="ui dividing header">Listado de Adelantos</h4>
      <div class="two fields">
        <div class="field">
          <div class="inline fields">

            <div class="ten wide field">
              <div class="ui icon input">
                <input type="text" placeholder="Buscar por nombre del funcionario...">
                <i class="inverted teal circular search link icon" @click="listar"></i>
              </div>
            </div>


          </div>
        </div>

        <div class="field">
          <div class="ui right floated main menu">
            <a class="icon item" @click="incluirAdelanto">
              <i class="plus icon"></i>
            </a>
            <a class="icon item">
              <i class="find icon" @click="busquedaAvanzada=!busquedaAvanzada"></i>
            </a>
            <a class="icon item">
              <i class="print icon"></i>
            </a>
          </div>

        </div>
      </div>
      <!-- <h4 class="ui dividing header"></h4> -->
      <div class="two fields" v-show="busquedaAvanzada">
        <div class="field">
          <label for="">Rango de Fechas:</label>
          <div class="inline fields">
            <div class="field">
              <el-date-picker v-model="fechaInicio" type="date" placeholder="Fecha inicio" format="dd/MM/yyyy">
              </el-date-picker>
            </div>

            <div class="field">
              <el-date-picker v-model="fechaFin" type="date" placeholder="Fecha fin" format="dd/MM/yyyy">
              </el-date-picker>
            </div>
          </div>

        </div>

        <div class="field">
          <label for="">Tipo de Adelanto:</label>
          <div class="inline fields">
            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="quincena" v-model="tipoAdelanto">
                <label>Quincena</label>
              </div>
            </div>

            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" value="especificado" v-model="tipoAdelanto">
                <label>Monto Especificado</label>
              </div>
            </div>

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
                <!-- <input type="checkbox" :checked="checkedAll" @click="checkedAll=!checkedAll"> -->
                <input type="checkbox" v-model="selectall">
                <label></label>
              </div>
            </th>
            <th>Fecha</th>
            <th>Funcionario</th>
            <!-- <th>Tipo de Adelanto</th> -->
            <th>Monto</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="adelanto in adelantos" :key="adelanto._id">
            <td class="collapsing">
              <div class="ui fitted checkbox">
                <input type="checkbox" :value="adelanto._id" v-model="seleccionados" >
                <label></label>
              </div>
            </td>
            <td>{{moment(adelanto.fecha).format("L")}}</td>
            <td>{{adelanto.funcionario.nombre}}</td>
            <!-- <td>{{adelanto.tipoAdelanto}}</td> -->
            <td>{{adelanto.monto}} {{adelanto.moneda}}</td>
            <td>
              <router-link :to="{name: 'editarAdelanto', params: { id: adelanto._id}}">
                <i class="edit row icon"></i>
              </router-link>

              <i class="trash icon" @click="confirm(adelanto._id)"></i>
              <i class="print icon"></i>
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

     <div class="ui padded segments">
    <div class="ui horizontal segments">
    <div class="ui segment">
      <img src="http://mdl.com.py/template/images/logomarca.png" width="60px"></img>
      <h3>Recibo de Adelanto de Salario</h3>
    </div>
    <div class="ui r aligned segment">
      <p>Fecha: 15/03/2018</p>
    </div>
      
      
   
  </div>
    <div class="ui segment">
      <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
      <div class="ui basic segment">
        <div class="ui list">
          <div class="item">Apples</div>
          <div class="item">Pears</div>
          <div class="item">Oranges</div>
        </div>
      </div>

      <div class="ui basic center aligned segment">
        <div class="ui three column grid">
          <div class="column">test</div>
          <div class="column">test</div>
          <div class="column">test</div>
        </div>
      </div>
      
    </div>
  </div>

  </div>
</template>

<script>
import axios from "axios";
import { db } from "./../.././config/firebase";
import {url} from "./../.././config/backend";
import Pagination from ".././shared/Pagination.vue"

let adelantosRef = db.ref("/adelantos");

export default {
  data() {
    return {
      adelantos: [],
      busquedaAvanzada: false,
      tipoAdelanto: "quincena",
      fechaInicio: "",
      fechaFin: "",
      checked: false,
      checkedAll: false,
      seleccionados: [],
      pageOne: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
      }
    };
  },
  methods: {
    incluirAdelanto() {
      this.$router.push({ name: "incluirAdelanto" });
    },
    // selectall(checkedAll){
    //   if(checkedAll){
    //     $(this.$el).find('.ui.checkbox').checkbox('check');
    //   }
    //   if(!checkedAll){
    //     $(this.$el).find('.ui.checkbox').checkbox('uncheck');
    //   }
      
    // },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      this.obtenerListadoAdelanto();
     
    },
    obtenerListadoAdelanto(){
      axios.get(`${url}/adelantos/?page=${this.pageOne.currentPage}&limit=${this.pageOne.itemsPerPage}`).then(response=> {
        this.adelantos = response.data.docs;
        this.pageOne.totalItems= response.data.total;
      })
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
    eliminarAdelanto(id) {
      var index = this.adelantos.findIndex(i => i.id === id);
      this.adelantos.splice(index, 1);

      axios.delete(`${url}/adelantos/delete/${id}`)
      // db.ref("/adelantos/" + id).remove();
    }
  },
  components: {
    appPagination: Pagination
  },
  computed: {
    selectall: {
            get: function () {
                return this.adelantos ? this.seleccionados.length == this.adelantos.length : false;
            },
            set: function (value) {
                var seleccionados = [];

                if (value) {
                    this.adelantos.forEach(function (adelanto) {
                        seleccionados.push(adelanto._id);
                    });
                }

                this.seleccionados = seleccionados;
            }
        }
  },
  created() {
    // this.$bindAsArray("adelantos", adelantosRef);
    this.obtenerListadoAdelanto();
   
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
