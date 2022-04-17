import { defineConfig, loadConfigFromFile, mergeConfig } from "vite"
import AutoImport from "unplugin-auto-import/vite"
import { resolve } from "path"

const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir)
}

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const base = (await loadConfigFromFile({ command, mode }, pathResolve("../../vite.config.ts"))).config
  base.plugins.shift()
  const config = {
    resolve: {
      alias: {
        "@": pathResolve("src"),
        common: pathResolve("../../common")
      }
    },
    plugins: [
      AutoImport({
        // vue函数的自动导入
        imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
        dts: false
      })
    ]
  }
  return mergeConfig(base, config)
})
