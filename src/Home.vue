<template>
  <!-- <div id="app"> -->
  <div>
    <div class="ui menu">

      <div class="right menu">
        <a href="#" class="item" @click="logout()">Logout</a>
        <a href="#" class="item"><i class="question circle outline icon"></i></a>
        
        <div class="item">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
            <i class="cogs icon"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><router-link :to="{name: 'userList'}">Usuarios</router-link></el-dropdown-item>
            </el-dropdown-menu>
      
    </el-dropdown>
        </div>
        
        <!-- <div id="settings" class="ui dropdown link item">
        <span><i class="cogs icon"></i></span>
          <div class="menu">
            <div class="item">Usuarios</div>
          </div>

        </div> -->
       
       
      </div>
    </div>
     <!-- <div class="ui fluid popup bottom left transition hidden">
            <div class="ui four column relaxed equal height divided grid">
              <div class="column">
                <div class="ui link list">
                  <a class="item">Usuarios</a>
                </div>
              </div>
            </div>
      </div> -->
    <div class="ui left inverted vertical menu visible sidebar">
      <div class="header item">
        <h4>
          <router-link class="item" :to="{name: 'Home'}">MDL | SISGESA</router-link>
        </h4>
        <p>sistema de Gestion Salarial</p>
      </div>
      <router-link class="item" active-class="active" :to="{name: 'attendanceList'}">Asistencia</router-link>
      <router-link class="item" active-class="active" :to="{name: 'advanceList'}">Adelantos</router-link>
      <router-link class="item" active-class="active" :to="{name: 'payrollList'}">Generar Salario</router-link>
      <router-link class="item" active-class="active" :to="{name: 'lendingList'}">Prestamos</router-link>
      <router-link class="item" active-class="active" :to="{name: 'employeeList'}">Funcionarios</router-link>
      <router-link class="item" active-class="active" :to="{name: 'subsidiaryList'}">Sucursales</router-link>
      <router-link class="item" active-class="active" :to="{name: 'eventList'}">Calendario</router-link>
      <!-- <router-link class="item" active-class="active" :to="{name: 'listadoFeriado'}">Feriados</router-link> -->

    </div>

    <div class="pusher">
      <div class="ui grid">
        <app-dash v-if="this.$route.name === 'Home'"></app-dash>
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
import Dashboard from "./Dashboard.vue";
export default {
  name: "home",
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$http.delete("/users/token").then(response => {
        console.log(response);
        localStorage.removeItem("token");
        this.$router.push({ name: "Login" });
      });
    },
    handleCommand(command) {
      if (command === "goUser") {
        this.$router.push({ name: "userList" });
      }
    }
  },

  components: {
    appDash: Dashboard
  }
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

