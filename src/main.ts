import { createApp } from "vue"
import App from "./App.vue"
import "virtual:windi.css"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/antd.variable.min.css"
import "./1.css"
import router from "./router"

createApp(App).use(Antd).use(router).mount("#app")
