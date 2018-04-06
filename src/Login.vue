<template>
    <div class="ui middle aligned center aligned grid">
        <div class="ui five wide column">
            <h2 class="ui teal image header">
                <!-- <img src="assets/images/logo.png" class="image"> -->
                <div class="content">
                    Log-in to your account
                </div>
            </h2>
            <form class="ui large form">
                <div class="ui raised segment">
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="user icon"></i>
                            <input type="text" name="email" v-model="email" placeholder="E-mail address">
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input type="password" name="password" v-model="password" placeholder="Password">
                        </div>
                    </div>
                    <div class="ui fluid large teal submit button" @click="login">Login</div>
                </div>

                <div class="ui error message"></div>

            </form>

            <div class="ui message">
                New to us?
                <a href="#">Sign Up</a>
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
      password: ""
    };
  },
  methods: {
    login() {
      this.$router.push({ name: "Home" });
      console.log(this.email);
      console.log(this.password);
    }
  }
};
</script>

<style>

</style>


