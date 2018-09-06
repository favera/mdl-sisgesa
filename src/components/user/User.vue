<template>
    <div class="ui twelve wide column">
        <form class="ui form" @submit.prevent="saveUser">
            <div class="ui dividing header">Registrar Usuario</div>
            <div class="ui ten wide required field">
                <label for="">Nombre y Apellido</label>
                <div class="field">
                    <input type="text" v-model="user.name">
                </div>
            </div>

            <div class="ui ten wide required field">
                <label for="">Nombre de Usuario</label>
                <div class="field">
                    <input type="text" v-model="user.username">
                </div>
            </div>

            <div class="ui ten wide required field">
                <label for="">Email</label>
                <div class="field">
                    <input type="email" name="" id="user-email" v-model="user.email">
                </div>
            </div>

            <div class="ui ten wide required field">
                <label for="">Perfil del Usuario</label>
                <div class="field">
                    <select class="ui fluid selection dropdown" v-model="user.profile">
                        <option disabled value="">Seleccionar perfil</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Operador">Operardor</option>
                        <option value="Consulta">Consulta</option>
                    </select>
                </div>

            </div>

            <div class="ui five wide required field">
                <label for="">Contraseña</label>
                <div class="ui input" :class="{'action': edit}">
                    <input ref="password" class="ui input deny-focus" :class="{'disabled': edit}" type="password">
                    <div class="ui icon button" v-show="edit" @click="focus">
                        <i class="refresh icon"></i>
                    </div>
                </div>

                <!-- <div class="field">
                <input type="password" name="" id="" v-model="user.password">
            </div> -->
            </div>

            <div class="field">
                <button class="ui teal button">Guardar</button>
                <div class="ui button" @click="cancel">Cancelar</div>
            </div>

        </form>
    </div>

</template>
<script>
export default {
  data() {
    return {
      user: {
        name: null,
        username: null,
        email: null,
        profile: null,
        password: null
      },
      edit: false,
      focus: false
    };
  },
  methods: {
    getUser() {
      if (this.$route.params.id) {
        this.edit = this.$route.params.edit;
        this.$http
          .get(`/users/edit/${this.$route.params.id}`)
          .then(response => {
            console.log(response);
            this.user.name = response.data.name;
            this.user.username = response.data.username;
            this.user.email = response.data.email;
            this.user.profile = response.data.profile;
            $(this.$el)
              .find(".ui.fluid.selection.dropdown")
              .dropdown("refresh")
              .dropdown("set selected", response.data.profile);
          });
      }
    },
    cancel() {
      this.$router.push({ name: "userList" });
    },
    saveUser() {
      this.$http.post(`/users/add`, this.user).then(response => {
        console.log(response);
      });
    },
    focus() {
      this.$refs.password.focus();
    }
  },
  mounted() {
    $(this.$el)
      .find(".ui.fluid.selection.dropdown")
      .dropdown();
  },
  created() {
    this.getUser();
  }
};
</script>
<style>
.deny-focus {
  pointer-events: none;
}
</style>


