<script setup lang="ts">
import { PieChartOutlined } from "@ant-design/icons-vue"
import { DEFAULT_MENUS } from "./menu"

const menuList = DEFAULT_MENUS
const isCollapse = ref(false) // 折叠状态
const menuIsFloat = ref(false) // 悬浮状态
const floatStateShowMenu = ref(false) // 悬浮状态是否显示
const showLineRouterPath = ["/monitor", "/platformOverview", "/report"] // 需要标识分隔线的路由
const router = useRouter()
const route = useRoute()
const selectedKeys = ref<string[]>([route.path]) // 当前选中的菜单项 key 数组

function menuFloat() {
  menuIsFloat.value = !menuIsFloat.value
}
function menuCollapse() {
  isCollapse.value = !isCollapse.value
}
function showMenu() {
  floatStateShowMenu.value = true
}
function hiddenMenu() {
  floatStateShowMenu.value = false
}

const sideWidth = computed(() => {
  if (menuIsFloat.value && !floatStateShowMenu.value) {
    return 0
  }
  return isCollapse.value ? 65 : 160
})
const menuDisplayState = computed(() => {
  return menuIsFloat.value ? floatStateShowMenu.value : true
})

const menuClick = ({ item }) => {
  router.push({ path: item.path })
}
</script>

<template>
  <a-layout-sider
    v-model:collapsed="isCollapse"
    :style="{ left: menuDisplayState ? '0px' : '-160px' }"
    :class="({ 'sider-zero-width': !sideWidth }, 'sider')"
    :trigger="null"
    collapsible
    :width="sideWidth"
    collapsed-width="64"
    style="background: #001529"
    @mouseleave="hiddenMenu">
    <div class="logo" />
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" style="background: #001529" @click="menuClick">
      <template v-for="item in menuList">
        <!-- 有二级菜单 -->
        <a-sub-menu v-if="item.children" :key="item.path">
          <template #icon>
            <PieChartOutlined />
          </template>
          <template #title>{{ item.name }}</template>
          <a-menu-item
            v-for="child in item.children"
            :key="item.path + '/' + child.path"
            :path="item.path + '/' + child.path">
            <span>{{ child.name }}</span>
          </a-menu-item>
        </a-sub-menu>
        <!-- 只有一级菜单 -->
        <a-menu-item v-else :key="item.key" :path="item.path">
          <template #icon>
            <PieChartOutlined />
          </template>
          <span>{{ item.name }}</span>
        </a-menu-item>
        <div v-if="showLineRouterPath.includes(item.path)" :key="item.path" class="border-line"></div>
      </template>
      <br />
      <div style="height: 30px"></div>
    </a-menu>
    <div class="operate">
      <div class="operate-item" @click="menuFloat">{{ menuIsFloat ? "固定" : "隐藏" }}</div>
      <div class="operate-item" @click="menuCollapse">{{ isCollapse ? "展开" : "收缩" }}</div>
    </div>
  </a-layout-sider>
  <div v-if="menuIsFloat && !floatStateShowMenu" class="hidden-icon" @mouseenter="showMenu">1</div>
</template>
<style scoped lang="scss">
.sider {
  height: 100vh;
  min-height: 500px;
}

.sider-zero-width {
  flex: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
}

.border-line {
  margin: 10px;
  border-top: 1px dashed rgb(255 255 255 / 85%);
}

.menu-is-float {
  position: absolute;
}

.hidden-icon {
  position: absolute;
  bottom: 40px;
  left: 20px;
  width: 20px;
  height: 20px;
  background-color: blueviolet;
}

.operate-item {
  flex-grow: 1;
  width: 80px;
  line-height: 35px;
  cursor: pointer;
}

.operate-item:hover {
  color: var(--text-color);
  background-color: var(--primary-color);
}

.operate {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 35px;
  color: rgb(255 255 255 / 65%);

  .operate-item {
    flex-grow: 1;
    width: 80px;
    line-height: 35px;
    cursor: pointer;
  }

  .operate-item:hover {
    color: var(--text-color);
    background-color: var(--primary-color);
  }
}

:deep(.ant-menu-dark .ant-menu-submenu-selected) {
  color: var(--primary-color);
}
</style>
