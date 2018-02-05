<template>
<div class="ui twelve wide column">
    <div class="ui form">
        <div class="ui dividing header">Incluir Prestamo</div>

        <div class="ten wide field">
        <label for="">Fecha:</label>
        <el-date-picker v-model="prestamo.fechaUtc" format="dd/MM/yyyy" type="date" ></el-date-picker>
    </div>

    <div class="ten wide field">
        <label for="">Seleccionar Funcionario</label>
        <select name="funcionarios" v-model="funcionarioSeleccionado" class="ui dropdown" id="funcionarioSelector" >
            <option disabled value="">Seleccionar Funcionario..</option>
            <option v-for="funcionario in funcionarios" :key="funcionario['.key']" v-bind:value="funcionario['.key']">{{funcionario.nombre}}</option>
        </select>
    </div>

    <div class="fifteen wide field">
      <div class="two fields">
        <div class="sixteen wide field">
            <div class="field">
            <label for="">Monto del Prestamo:</label>
        </div>

        <div class="inline fields">
           

          

            <div class="four wide field">
                <div class="ui input" >
                <input v-model.lazy="prestamo.monto" v-money="money"  >
            </div>
            </div>

            <div class="four wide field">
              
               <select v-model="prestamo.moneda" class="ui dropdown" id="monedaSelector"   >
                        <option disbled value="">Seleccionar Moneda..</option>
                        <option value="Gs">Guaranies - Gs.</option>
                        <option value="Us">Dolares - Us.</option>
                        <option value="Rs">Reales - Rs.</option>
              </select>

            </div> 

            
        </div>


        <div class="two fields">
          <div class="five wide field">
                <label for="">Iniciar Pago en:</label>
                <div class="field">
                    <el-date-picker
    v-model="prestamo.incioPago"
    type="month"
    placeholder="Seleccionar mes">
  </el-date-picker>
                </div>
                 
            </div>
            <div class="five wide field">
                <label for="">Fraccion de Cuotas:</label>
                <div class="field">
                    <el-input-number v-model="prestamo.nroCuotas" @change="handleChange" :min="1" :max="10"></el-input-number>
                </div>

            </div>

            
        </div>
        
        </div>


        <div class="field">
          <div class="ui card">
  <div class="content">
    <div class="header">Cuotas Generadas</div>
  </div>
  <div class="content">
    <div class="ui divided items">
      <div class="item">
        <div class="middle aligned content"> <h5> Vencimiento</h5></div>
      <div class="middle aligned content"><h5>Monto</h5></div>
      <div class="middle aligned content" ><h5>Estado</h5></div>
      </div>
      
  <div class="item" v-for="cuota in prestamo.cuotas">
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
        
    </div>

    <!-- <div class="ten wide field">
        <div class="two fields">
            <div class="five wide field">
                <label for="">Fraccion de Cuotas:</label>
                <div class="field">
                    <el-input-number v-model="prestamo.cuotas" @change="handleChange" :min="1" :max="10"></el-input-number>
                </div>

            </div>

            <div class="five wide field">
                <label for="">Iniciar Pago en:</label>
                <div class="field">
                    <el-date-picker
    v-model="prestamo.incioPago"
    type="month"
    placeholder="Seleccionar mes">
  </el-date-picker>
                </div>
                 
            </div>
        </div>
    </div> -->

    

    
</div>

<div class="field">
  <div class="ui teal button" @click="guardarPrestamo()">Guardar</div>
    <div class="ui button" @click="cancelar()">Cancelar</div>
</div>

    
</div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { VMoney } from "v-money";
import { db } from "./../.././config/firebase";
let funcionariosRef = db.ref("/funcionarios");
let prestamosRef = db.ref("/prestamos");
export default {
  data() {
    return {
      prestamo: {
        fechaUtc: new Date(),
        fecha: null,
        funcionarioId: null,
        nombreFuncionario: null,
        moneda: null,
        monto: null,
        nroCuotas: 1,
        incioPago: null,
        cuotas: []
      },
      disabledInput: true,
      funcionarioSeleccionado: null,
      setDate: new Date(),
      funcionarios: [],
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false /* doesn't work with directive */
      }
    };
  },
  methods: {
    handleChange(value) {
      this.generarCuotas(value);
    },
    generarCuotas(value) {
      this.prestamo.cuotas.length = 0;

      if (this.prestamo.monto && this.prestamo.incioPago) {
        var i = 0;
        do {
          var cuota = {};

          cuota.monto = Math.floor(
            parseInt(this.prestamo.monto.split(".").join("")) / value
          ).toLocaleString();
          cuota.moneda = this.prestamo.moneda;
          cuota.estado = "pendiente";
          i++;
          cuota.vencimiento = moment(this.prestamo.incioPago, "llll")
            .add(i, "months")
            .format("L");
          console.log(cuota.vencimiento);
          console.log(JSON.stringify(cuota, undefined, 2));

          //test.push(cuota);

          // console.log(JSON.stringify(test, undefined, 2));
          this.prestamo.cuotas.push(cuota);
        } while (i < value);
      }
    },
    obtenerPrestamo() {
      console.log(this.$route.params.id);

      if (typeof this.$route.params.id !== "undefined") {
        console.log(prestamosRef.child(this.$route.params.id));
        prestamosRef.child(this.$route.params.id).once("value", snapshot => {
          console.log(snapshot.val());
          this.prestamo.fechaUtc = snapshot.val().fechaUtc;
          this.prestamo.monto = snapshot.val().monto;
          this.prestamo.moneda = snapshot.val().moneda;
          this.prestamo.incioPago = snapshot.val().incioPago;
          this.prestamo.nroCuotas = snapshot.val().nroCuotas;
          $(this.$el)
            .find(".ui.dropdown")
            .dropdown("refresh")
            .dropdown("set selected", snapshot.val().funcionarioId);
        });
      }
    },
    guardarPrestamo() {
      console.log(this.$route.params.id);
      if (
        typeof this.$route.params.id !== "undefined" ||
        this.$route.params.id
      ) {
        console.log("entra aca");
        this.prestamo.fecha = moment(this.prestamo.fechaUtc, "DD/MM/YYYY")
          .format("L")
          .toString();
        this.prestamo.fechaUtc = this.prestamo.fechaUtc.toString();
        this.prestamo.funcionarioId = this.funcionarioSeleccionado;

        funcionariosRef
          .child(this.funcionarioSeleccionado)
          .once("value", snap => {
            this.prestamo.nombreFuncionario = snap.val().nombre;
          });

        prestamosRef
          .child(this.$route.params.id)
          .update(this.prestamo)
          .then(response => {
            this.editSuccess();
            this.cancelar();
            console.log(response);
          });
      } else {
        this.prestamo.fecha = moment(this.prestamo.fechaUtc, "DD/MM/YYYY")
          .format("L")
          .toString();
        this.prestamo.fechaUtc = this.prestamo.fechaUtc.toString();
        this.prestamo.funcionarioId = this.funcionarioSeleccionado;

        funcionariosRef
          .child(this.funcionarioSeleccionado)
          .once("value", snap => {
            this.prestamo.nombreFuncionario = snap.val().nombre;
          });

        prestamosRef.push(this.prestamo).then(res => {
          console.log(res);
          this.success();
          this.cancelar();
        });
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoPrestamo" });
    },
    success() {
      this.$notify({
        title: "Exito!",
        message: "El registro se ha creado correctamente",
        type: "success"
      });
    },
    editSuccess() {
      this.$notify({
        title: "Exito!",
        message: "El registro se ha actualizado correctamente",
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
    $(this.$el)
      .find(".ui.dropdown")
      .dropdown();
    this.obtenerPrestamo();
  },
  updated() {
    //this.obtenerAdelanto();
  },
  created() {
    // this.obtenerAdelanto();
    this.$bindAsArray("funcionarios", funcionariosRef);
  },
  watch: {
    $route: "obtenerPrestamo"
    // funcionarioSeleccionado: function() {
    //   if (this.adelanto.tipoAdelanto === "quincena") {
    //     funcionariosRef
    //       .child(this.funcionarioSeleccionado)
    //       .once("value", snap => {
    //         console.log(snap.val().salario);
    //         var quincena =
    //           snap
    //             .val()
    //             .salario.split(".")
    //             .join("") / 2;
    //         this.adelanto.monto = quincena.toLocaleString();
    //         this.adelanto.moneda = snap.val().moneda;
    //         this.adelanto.nombreFuncionario = snap.val().nombre;
    //       });
    //   }

    //   $(this.$el)
    //     .find("#monedaSelector")
    //     .dropdown("refresh")
    //     .dropdown("set selected", this.adelanto.moneda);
    // }
  },
  directives: { money: VMoney }
};
</script>

<style>

</style>


