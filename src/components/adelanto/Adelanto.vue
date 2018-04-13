<template>
  <div class="ui twelve wide column">
    <div class="ui form">
      <div class="ui dividing header">Incluir Adelanto</div>

      <div class="ten wide field">
        <label for="">Fecha:</label>
        <el-date-picker v-model="adelanto.fecha" format="dd/MM/yyyy" type="date"></el-date-picker>
      </div>
      <div class="ten wide field">
        <label for="">Seleccionar Funcionario</label>
        <select name="funcionarios" v-model="funcionarioSeleccionado" class="ui dropdown">
          <option disabled value="">Seleccionar Funcionario..</option>
          <option v-for="funcionario in funcionarios" :key="funcionario._id" v-bind:value="funcionario._id">{{funcionario.nombre}}</option>
        </select>
      </div>
      <div class="ten wide field">
        <div class="field">
          <label for="">Tipo de Adelanto:</label>
        </div>

        <div class="inline fields">
          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="adelanto.tipoAdelanto" value="quincena" @click="disabledInput = true">
              <label>Quincena</label>
            </div>
          </div>

          <div class="four wide field">
            <div class="ui radio checkbox">
              <input type="radio" v-model="adelanto.tipoAdelanto" value="especificado" @click="disabledInput = false">
              <label>Especificar Monto</label>
            </div>
          </div>

          <div class="four wide field">
            <div class="ui input">
              <input type="text" v-model="adelanto.monto" v-bind:class="{'disabled': disabledInput}">
            </div>
          </div>

          <div class="four wide field">

            <select v-model="adelanto.moneda" class="ui dropdown" id="monedaSelector">
              <option disbled value="">Seleccionar Moneda..</option>
              <option value="Gs">Guaranies - Gs.</option>
              <option value="Us">Dolares - Us.</option>
              <option value="Rs">Reales - Rs.</option>
            </select>

          </div>

        </div>
      </div>

      <div class="ui teal button" @click="guardarAdelanto()">Guardar</div>
      <div class="ui button" @click="cancelar()">Cancelar</div>
    </div>

  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      adelanto: {
        //fechaUtc: new Date(),
        fecha: new Date(),
        funcionario: null,
        tipoAdelanto: "quincena",
        moneda: null,
        monto: null
      },
      disabledInput: true,
      funcionarioSeleccionado: null,
      setDate: new Date(),
      funcionarios: []
    };
  },
  methods: {
    obtenerAdelanto() {
      console.log(this.$route.params.id);

      if (this.$route.params.id) {
        this.$http
          .get(`/adelantos/edit/${this.$route.params.id}`)
          .then(response => {
            this.adelanto.fecha = response.data.fecha;
            this.adelanto.tipoAdelanto = response.data.tipoAdelanto;
            this.adelanto.monto = response.data.monto;
            this.adelanto.moneda = response.data.moneda;
            this.adelanto.funcionario = response.data.funcionario;
            this.disabledInput = true;
            $(this.$el)
              .find(".ui.dropdown")
              .dropdown("refresh")
              .dropdown("set selected", response.data.funcionario);
            $(this.$el)
              .find("#monedaSelector")
              .dropdown("refresh")
              .dropdown("set selected", response.data.moneda);
          });
      }
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
    },
    guardarAdelanto() {
      if (this.$route.params.id) {
        this.adelanto.funcionario = this.funcionarioSeleccionado;
        this.$http
          .put(
            `/adelantos/update/${this.$route.params.id}`,
            this.adelanto
          )
          .then(response => {
            console.log(response);
            this.editSuccess();
            this.cancelar();
          })
          .catch(e => {
            console.log(e);
            this.fail();
          });
      } else {
        this.adelanto.funcionario = this.funcionarioSeleccionado;
        this.$http
          .post(`/adelantos/add`, this.adelanto)
          .then(response => {
            console.log(response);
            this.success();
            this.cancelar();
          })
          .catch(e => {
            console.log(e);
            this.fail();
          });
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoAdelanto" });
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
  },
  created() {
    this.obtenerFuncionarios();
    this.obtenerAdelanto();
  },
  watch: {
    $route: "obtenerAdelanto",
    funcionarioSeleccionado: function() {
      if (this.adelanto.tipoAdelanto === "quincena") {
        var quincena;
        var funcionario = this.funcionarios.find(funcionario => {
          if (funcionario._id === this.funcionarioSeleccionado) {
            this.adelanto.monto = (
              funcionario.salario.split(".").join("") / 2
            ).toLocaleString();
            $(this.$el)
              .find("#monedaSelector")
              .dropdown("refresh")
              .dropdown("set selected", funcionario.moneda);
          }
        });
      }

      $(this.$el)
        .find("#monedaSelector")
        .dropdown("refresh")
        .dropdown("set selected", this.adelanto.moneda);
    }
  }
};
</script>

<style>

</style>


