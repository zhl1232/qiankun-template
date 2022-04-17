<template>
  <a-layout class="h-full">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <Menu></Menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="padding: 0; background: #fff">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <!-- 微应用容器 -->
        <div id="view-main" />
        <!-- 主应用自己的路由渲染 -->
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import Menu from "./Menu.vue"
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue"

const collapsed = ref<boolean>(false)
</script>

<style lang="scss">
.section {
  overflow-x: auto;
  overflow-y: overlay;
}
</style>
