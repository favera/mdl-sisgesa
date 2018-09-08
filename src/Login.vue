<template>
    <div class="ui middle aligned center aligned grid">
        <div class="ui four wide column">
            <div class="column">
                <div id="login" class="ui centered image">
                    <img src="./assets/coin.png" alt="" width="100">
                </div>
            </div>
            <h2 class="ui teal image header">
                <div class="content">
                    SISGESA
                </div>

            </h2>
            <!-- <p>Sistema de Gestion Salarial</p> -->
            <form class="ui large form">
                <div class="ui raised segment">
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="user icon"></i>
                            <input type="text" name="email" v-model="email" placeholder="E-mail">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input type="password" name="password" v-model="password" placeholder="Password">
                        </div>
                    </div>
                    <div class="ui fluid large teal submit button" @click="login">Iniciar Sesion</div>
                </div>

                <div class="ui error message"></div>

            </form>

            <div class="ui message">
                Si olvido la contrasena pongase en contacto con el administrador
                <p class="err" v-show="error">{{error}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      error: null
    };
  },
  methods: {
    login() {
      //   this.$router.push({ name: "Home" });
      //   console.log(this.email);
      //   console.log(this.password);
      this.$http
        .post("/users/login", { email: this.email, password: this.password })
        .then(response => {
          this.loginSuccessful(response);
        })
        .catch((err) => this.loginFailed(err));
    },
    loginSuccessful(req) {
      console.log(req);
      if (!req.headers["x-auth"]) {
        this.loginFailed();
        return;
      }

      localStorage.token = req.headers["x-auth"];
      localStorage.username = req.data.username;
      this.error = false;

      this.$router.replace(this.$route.query.redirect || "/dashboard");
    },

    loginFailed(err) {
      this.error = err;
      delete localStorage.token;
    }
  }
};
</script>

<style>
#login {
  background: #ccc;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  padding-top: 5%;
  padding-left: 6%;
  margin-top: 3%;
}
</style>


