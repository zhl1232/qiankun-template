import { Router, createRouter, createWebHistory } from "vue-router"
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper"
import Index from "@/views/Index.vue"
import packageConfig from "../../package.json"
// 创建路由实例
export const router: Router = createRouter({
  history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? `/${packageConfig.name}` : "/"),
  routes: [
    {
      path: "/",
      component: Index
    }
    // { path: "/login", component: Login },
    // { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound }
  ],
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
