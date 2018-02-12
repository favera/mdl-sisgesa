<template>
  <div id="app">
    <div class="ui menu">

      <div class="right menu">
        <a href="#" class="item">Login</a>
        <a href="#" class="item">Help</a>
      </div>
    </div>
    <div class="ui left inverted vertical menu visible sidebar">
      <div class="header item">
        <h4>
          <router-link class="item" :to="{name: 'Home'}">MDL | SISGESA</router-link>
        </h4>
        <p>sistema de Gestion Salarial</p>
      </div>
      <router-link class="item" active-class="active" :to="{name: 'listadoAsistencia'}">Asistencia</router-link>
      <router-link class="item" active-class="active" :to="{name: 'listadoAdelanto'}">Adelantos</router-link>
      <router-link class="item" active-class="active" :to="{name: 'listadoSalarios'}">Generar Salario</router-link>
      <router-link class="item" active-class="active" :to="{name: 'listadoPrestamo'}">Prestamos</router-link>
      <router-link class="item" active-class="active" :to="{name: 'listadoEmpleado'}">Funcionarios</router-link>
      <router-link class="item" active-class="active" :to="{name: 'listadoSucursal'}">Sucursales</router-link>
      <router-link class="item" active-class="active" :to="{name: 'listadoCalendario'}">Calendario</router-link>
      <!-- <router-link class="item" active-class="active" :to="{name: 'listadoFeriado'}">Feriados</router-link> -->

    </div>

    <div class="pusher">
      <div class="ui grid">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  components: {}
};
</script>

<style scoped>
.ui.grid {
  padding: 0 3%;
}

.ui.inverted.menu {
  background-color: #364958;
}

.ui.menu {
  background-color: #eef0f2;
}
</style>

