<template>
  <a-layout class="min-w-full h-full">
    <Menu></Menu>
    <a-layout class="section">
      <a-layout-header class="p-0" style="color: rgb(255 255 255 / 85%); background: #001529">
        深色模式:
        <a-switch v-model:checked="checked" checked-children="开" un-checked-children="关" />
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- 微应用容器 -->
        <div id="view-main" />
        <!-- 主应用自己的路由渲染 -->
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import Menu from "./components/sidebar/Menu.vue"
import { toggleClass } from "@/common/utils/tool"

const checked = ref(false)
watch(
  () => checked.value,
  isDark => {
    if (isDark) {
      toggleClass(document.documentElement, "theme-dark")
    } else {
      toggleClass(document.documentElement, "theme-default")
    }
  }
)
</script>
<style lang="scss">
.section {
  overflow-x: auto;
  overflow-y: overlay;
}
</style>
