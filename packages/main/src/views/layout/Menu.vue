<template>
  <div>
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed">
      <a-menu-item key="app1">
        <template #icon>
          <PieChartOutlined />
        </template>
        <span>VUE app1</span>
      </a-menu-item>
      <a-menu-item key="app2">
        <template #icon>
          <DesktopOutlined />
        </template>
        <span>Option 2</span>
      </a-menu-item>
      <a-menu-item key="app3">
        <template #icon>
          <InboxOutlined />
        </template>
        <span>Option 3</span>
      </a-menu-item>
      <a-sub-menu key="main">
        <template #icon>
          <MailOutlined />
        </template>
        <template #title>Navigation One</template>
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-menu-item key="7">Option 7</a-menu-item>
        <a-menu-item key="8">Option 8</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue"
import { PieChartOutlined, MailOutlined, DesktopOutlined, InboxOutlined } from "@ant-design/icons-vue"
export default defineComponent({
  components: {
    PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined
  },
  setup() {
    const state = reactive({
      collapsed: false,
      selectedKeys: ["app1"],
      openKeys: ["main"],
      preOpenKeys: ["main"]
    })

    watch(
      () => state.openKeys,
      (_val, oldVal) => {
        state.preOpenKeys = oldVal
      }
    )

    return {
      ...toRefs(state)
    }
  }
})
</script>
