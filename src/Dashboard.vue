<template>
  <div class="ui twelve wide column">

    <div class="ui four column grid">
      <div class="column">
        <div class="ui orange inverted segment">
          <div class="ui two column grid">
            <div class="eigth wide column">
              <i class="big users inverted icon"></i>
            </div>
            <div class="column">
              <div class="ui inverted statistic">
                <div class="value">
                  5
                </div>
                <div class="label">
                  Ausencias
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui yellow inverted segment">
          <div class="ui two column grid">
            <div class="eigth wide column">
              <i class="big clock inverted icon"></i>
            </div>
            <div class="column">
              <div class="ui inverted statistic">
                <div class="value">
                  15
                </div>
                <div class="label">
                  Retrasos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui violet inverted segment">
          <div class="ui two column grid">
            <div class="eigth wide column">
              <i class="big plane inverted icon"></i>
            </div>
            <div class="column">
              <div class="ui inverted statistic">
                <div class="value">
                  7
                </div>
                <div class="label">
                  Vacaciones
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui purple inverted segment">
          <div class="ui two column grid">
            <div class="eigth wide column">
              <i class="big puzzle piece inverted icon"></i>
            </div>
            <div class="column">
              <div class="ui inverted statistic">
                <div class="value">
                  20
                </div>
                <div class="label">
                  Incompletos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ui two column grid">
      <div class="column">
        <div class="ui olive segment">

          <h3>Prestamos a Cobrar</h3>

          <div class="ui relaxed divided items">
            <div class="item">
              <div class="middle aligned content">
                <h5>Nombre</h5>
              </div>
              <div class="middle aligned content">
                <h5>Fecha</h5>
              </div>
              <div class="middle aligned content">
                <h5>Valor</h5>
              </div>
            </div>
            <div class="item">

              <div class="middle aligned content">
                <p>Fulano de Tal</p>
              </div>
              <div class="middle aligned content">
                <p>26/06/2018</p>
              </div>
              <div class="middle aligned content">
                <p>220.000 Gs</p>
              </div>
            </div>

            <div class="item">

              <div class="middle aligned content">
                <p>Fulano de Tal</p>
              </div>
              <div class="middle aligned content">
                <p>26/06/2018</p>
              </div>
              <div class="middle aligned content">
                <p>220.000 Gs</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui violet segment">
          <div class="ui column grid">
            <div class="twelve wide column">
              <h3>Monto Total para Pago de Salarios</h3>
            </div>
            <div class="four wide column">
              <a class="ui large purple label">
                <i class="calendar inverted icon"></i>
                JUNIO
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>

</template>

<script>
import moment from "moment";

export default {
  name: "dashboard",
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style>
.el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}
.ui.segment.large {
  height: 400px;
}
</style>

