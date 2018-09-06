<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <div class="ui dividing header">Cambiar Contraseña</div>
            <div class="eight wide field">
                <label for="">Contraseña anterior</label>
                <div class="ui icon input">
                    <input :type="showPassword? 'text': 'password'" v-model="userPassword.oldpassword" placeholder="Digite la contrasena anterior">
                    <i class="eye slash link icon" @click="showPassword = !showPassword"  v-if="!showPassword"></i>
                    <i  class="low vision link icon" @click="showPassword = !showPassword" v-else="showPassword"></i>
                </div>
            </div>

            <div class="eight wide field">
                <label for="">Nueva contraseña</label>
                <input type="password" v-model="userPassword.newpassword">
            </div>

            <div class="eight wide field">
                <label for="">Confirmar contraseña</label>
                <input type="password" v-model="userPassword.newpassword">
            </div>

            <div class="field">
                <button class="ui teal button">Actualizar</button>
                <div class="ui button">Cancelar</div>
            </div>
        </div>
    </div>    
</template>
<script>
export default {
  data() {
    return {
      userPassword: {
        username: null,
        oldpassword: null,
        newpassword: null
      },
      showPassword: false
    };
  },
  methods: {
    updatePassword() {
      this.userPassword.username = localStorage.username;
      this.$http
        .post(`/users/update-password`, this.userPassword)
        .then(response => {
          console.log(response);
        });
    }
  }
};
</script>
<style>
</style>


