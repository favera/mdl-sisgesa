<template>
  <div class="ui twelve wide column">
    <form class="ui form" @submit.prevent="guardarAdelanto">
      <div class="ui dividing header">Incluir Adelanto</div>

      <div class="ten wide required field">
        <label for="">Fecha</label>
        <div class="field" :class="{'error': errors.has('fecha')}">
          <el-date-picker v-model="adelanto.fecha" format="dd/MM/yyyy" type="date" name="fecha" v-validate="'required'"></el-date-picker>
          <div v-show="errors.has('fecha')" class="info-error">{{errors.first('fecha')}}</div>
        </div>
      </div>
      <div class="ten wide required field">
        <label for="">Seleccionar Funcionario</label>
        <div class="field" :class="{'error': errors.has('funcionario')}">
          <select name="funcionario" v-model="funcionarioSeleccionado" class="ui dropdown" v-validate="'required'">
            <option disabled value="">Seleccionar Funcionario..</option>
            <option v-for="funcionario in funcionarios" :key="funcionario._id" v-bind:value="funcionario._id">{{funcionario.nombre}}</option>
          </select>
          <span v-show="errors.has('funcionario')" class="info-error">{{errors.first('funcionario')}}</span>
        </div>

      </div>
      <div class="ten wide field">
        <div class=" required field">
          <label for="">Tipo de Adelanto</label>
        </div>

        <div class="inline fields">
          <div class="three wide field">
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
          <div class="four wide field" :class="{'error': errors.has('monto')}">
            <div class="ui input">
              <input type="text" v-model.lazy="adelanto.monto" v-money="money" name="monto" v-validate="'validar_monto'" v-bind:class="{'disabled': disabledInput}">
            </div>
            <span class="info-error" v-show="errors.has('monto')">{{errors.first('monto')}}</span>

          </div>

          <div class="four wide field" :class="{'error': errors.has('moneda')}">
            <select v-model="adelanto.moneda" class="ui dropdown" id="monedaSelector" name="moneda" v-validate="'required'">
              <option disbled value="">Seleccionar Moneda..</option>
              <option value="Gs">Guaranies - Gs.</option>
              <option value="Us">Dolares - Us.</option>
              <option value="Rs">Reales - Rs.</option>
            </select>
            <span class="info-error" v-show="errors.has('moneda')">{{errors.first('moneda')}}</span>
          </div>

        </div>
      </div>

      <button class="ui teal button" :class="{disabled: errors.any()}" type="submit">Guardar</button>
      <div class="ui button" @click="cancelar()">Cancelar</div>
    </form>

  </div>
</template>

<script>
import moment from "moment";
import { VMoney } from "v-money";
import { Validator } from "vee-validate";

export default {
  name: "adelanto",
  data() {
    return {
      adelanto: {
        fecha: new Date(),
        funcionario: null,
        nombreFuncionario: null,
        tipoAdelanto: "quincena",
        moneda: null,
        monto: null
      },
      disabledInput: true,
      funcionarioSeleccionado: null,
      setDate: new Date(),
      funcionarios: [],
      totalSalario: null,
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
    getNombreFuncionario(id) {
      var nombre;
      this.funcionarios.find(funcionario => {
        if (funcionario._id === id) {
          nombre = funcionario.nombre;
        }
      });
      console.log("Nombre", nombre);
      return nombre;
    },
    guardarAdelanto() {
      this.$validator.validateAll();
      if (this.$route.params.id) {
        this.adelanto.funcionario = this.funcionarioSeleccionado;
        this.adelanto.nombreFuncionario = this.getNombreFuncionario(
          this.funcionarioSeleccionado
        );
        this.adelanto.monto = parseInt(this.adelanto.monto.split(".").join(""));
        this.$http
          .put(`/adelantos/update/${this.$route.params.id}`, this.adelanto)
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
        this.adelanto.nombreFuncionario = this.getNombreFuncionario(
          this.funcionarioSeleccionado
        );
        this.adelanto.monto = parseInt(this.adelanto.monto.split(".").join(""));
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
  directives: { money: VMoney },
  watch: {
    $route: "obtenerAdelanto",
    funcionarioSeleccionado: function() {
      var quincena;
      var funcionario = this.funcionarios.find(funcionario => {
        if (funcionario._id === this.funcionarioSeleccionado) {
          if (this.adelanto.tipoAdelanto === "quincena") {
            this.totalSalario = funcionario.salario;
            console.log(this.totalSalario);
            this.adelanto.monto = Math.floor(
              funcionario.salario / 2
            ).toLocaleString();
            $(this.$el)
              .find("#monedaSelector")
              .dropdown("refresh")
              .dropdown("set selected", funcionario.moneda);
          }
        }
      });

      $(this.$el)
        .find("#monedaSelector")
        .dropdown("refresh")
        .dropdown("set selected", this.adelanto.moneda);
    }
  }
};
</script>

<style>
.info-error {
  color: #9f3a38;
}
</style>


