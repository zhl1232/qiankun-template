import { defineConfig } from "vite"
import { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import AutoImport from "unplugin-auto-import/vite"

const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": pathResolve("./src"),
      common: pathResolve("./src/common")
    }
  },
  plugins: [
    vue(),
    WindiCSS(),
    AutoImport({
      // vue函数的自动导入
      imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    })
  ]
})
