<template>
    <div class="ui middle aligned center aligned grid" id="login">
        <div class="ui four wide column">
            <h2 class="ui teal image header">
                <div class="content">
                    Inicie Sesion en su cuenta
                </div>
            </h2>
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
      error: ""
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
            this.loginSuccessful(response)
            
        })
        .catch(() => this.loginFailed());
    },
    loginSuccessful(req) {
        console.log(req.headers['x-auth']);
      if (!req.headers['x-auth']) {
        this.loginFailed();
        return;
      }

      localStorage.token = req.headers['x-auth'];
      this.error = false;

      this.$router.replace(this.$route.query.redirect || "/dashboard");
    },

    loginFailed() {
      this.error = "Login failed!";
      delete localStorage.token;
    }
  }
};
</script>

<style>
#login {
  margin-top: 10%;
}
</style>


