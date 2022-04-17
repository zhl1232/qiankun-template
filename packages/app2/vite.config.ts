import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import packageConfig from "./package.json"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 10002 },
  output: {
    // 把子应用打包成 umd 库格式
    library: `${packageConfig.name}-[name]`,
    libraryTarget: "umd",
    jsonpFunction: `webpackJsonp_${packageConfig.name}`
  }
})
