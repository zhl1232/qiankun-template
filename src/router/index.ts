import { Router, createRouter, createWebHistory } from "vue-router"
import Layout from "@/views/layout/Index.vue"
import Home from "@/views/home/Index.vue"
// import Login from "common/views/Login.vue"
// import NotFound from "common/views/404.vue"

// 创建路由实例
export const router: Router = createRouter({
  history: createWebHistory(),
  // routes: filterTree(ascending(constantRoutes)).concat(...remainingRouter),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "",
          component: Home
        }
      ]
    }
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

// router.beforeEach((to, from, next) => {
//   NProgress.inc(10)
//   NProgress.configure({ easing: "ease", speed: 700, showSpinner: false })
//   NProgress.start()
//   next()
// })
// router.afterEach(() => {
//   NProgress.done()
// })

export default router
