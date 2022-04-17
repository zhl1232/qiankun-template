import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import { renderWithQiankun, qiankunWindow, QiankunProps } from "vite-plugin-qiankun/dist/helper"
import { MicroAppStateActions } from "qiankun"

import Antd from "ant-design-vue"
import "ant-design-vue/dist/antd.variable.min.css"
import "virtual:windi.css" // windi Css

import App from "./App.vue"
let instance = null

type AppProps = Partial<MicroAppStateActions & QiankunProps>
function render(props: AppProps) {
  const { container } = props
  if (container) {
    // 渲染子应用时，根据主应用的主题渲染
    // const state = {
    //   isDark: document.documentElement.className.includes("dark")
    // }
    // useTheme().theme({ state, container })
    // 注册主，微应用全局通信
    props.onGlobalStateChange((state, prevState) => {
      // useTheme().theme({ state, prevState, container })
    })
  }
  instance = createApp(App)
  instance.use(router).use(createPinia).use(Antd)
  instance.mount(container ? container.querySelector("#app") : document.getElementById("app"))
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    // console.log('我正在作为子应用运行')
  }
}

renderWithQiankun({
  /**
   * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
   * @param props
   */
  mount(props: MicroAppStateActions & QiankunProps) {
    render(props)
  },
  /**
   * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子
   */
  bootstrap() {
    // 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
  },
  /**
   * 应用每次切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
   */
  unmount() {
    instance.unmount()
    instance._container.innerHTML = ""
    instance = null
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}
