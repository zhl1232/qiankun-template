<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN"
</script>

<template id="app">
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<style scss>
#app {
  margin-top: 60px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
