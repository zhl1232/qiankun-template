import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import startQianKun, { actions } from "common/modules"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/antd.variable.min.css"
import "virtual:windi.css" // windi Css

import App from "./App.vue"

const app = createApp(App)
app.use(createPinia()).use(router).use(Antd).mount("#app")
// 注册 qiankun
startQianKun({ sandbox: { strictStyleIsolation: true } })
// qiankun 通信
actions.onGlobalStateChange((state, prevState) => {
  // state: 变更后的状态; prevState: 变更前的状态
  // console.log(state, prevState)
})
