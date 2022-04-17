import { Router, createRouter, createWebHistory } from "vue-router"
import microApps from "common/modules/microApps"
import Layout from "@/views/layout/Index.vue"

// 获取微服务路由
const microRoutes = []
microApps.forEach(micro => {
  microRoutes.push({
    path: `${micro.activeRule}/:morePath*`,
    component: Layout
  })
})

// 创建路由实例
export const router: Router = createRouter({
  history: createWebHistory(),
  routes: microRoutes.concat([
    {
      path: "/",
      component: Layout,
      redirect: "/app1"
    }
  ]),
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition
      }
      if (from.meta.saveSrollTop) {
        const top: number = document.documentElement.scrollTop || document.body.scrollTop
        resolve({ left: 0, top })
      }
    })
  }
})

export default router
