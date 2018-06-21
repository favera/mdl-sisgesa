<template>
  <div class="ui twelve wide column">
    <div class="ui four cards">
      <a class="orange card">
        <div>
          <p>prueba</p>
        </div>
      </a>
    </div>
    <!-- <div class="ui four column grid">
      <div class="column">
        <a class="orange card">
          <div>
            <p>prueba</p>
          </div>
        </a>
      </div>
      <div class="column">
        <div class="ui segment">
          <img>
        </div>
      </div>
      <div class="column">
        <div class="ui segment">
          <img>
        </div>
      </div>
      <div class="column">
        <div class="ui segment">
          <img>
        </div>
      </div>
    </div> -->

    <div class="ui two column grid">
      <div class="column">
        <div class="ui segment">
          <img>
        </div>
      </div>
      <div class="column">
        <div class="ui violet segment">
          <img>
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

