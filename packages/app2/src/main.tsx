import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import { renderWithQiankun, qiankunWindow } from "vite-plugin-qiankun/dist/helper"

function render(props: any) {
  const { container } = props
  if (container) {
    ReactDOM.createRoot(container.querySelector("#app")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    // 注册主，微应用全局通信
    props.onGlobalStateChange(() => {
      // useTheme().theme({ state, prevState, container })
    })
  } else {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

renderWithQiankun({
  mount(props) {
    console.log("mount")
    render(props)
  },
  bootstrap() {
    console.log("bootstrap")
  },
  unmount(props: any) {
    console.log("unmount")
    const { container } = props
    const mountRoot = container?.querySelector("#root")
    ReactDOM.unmountComponentAtNode(mountRoot || document.querySelector("#root"))
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}
