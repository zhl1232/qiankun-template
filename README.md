# 背景
之前不是说了吗，公司准备升到 Vue3。后面又因为一些需求把项目结构改成了 qiankun 和 Monorepo，所以这篇文章就是一个建设模板的讲解。

老话说的好，~~打 BOSS 前要把 Buff 加满~~，不是，是工欲善其事，必先利其器。在其它小伙伴过来写代码之前需要把重复工作的模板搭好，开发效率才能更高。

所以我们的目标就是，`ESLint`、`Prettier`、`TypeScript`之类的工具配置好，可以用命令行启动整个项目，可以用命令行新建微应用。可以让其他人`零配置`直接上手写代码。

# 开始

本项目默认包管理器使用 [pnpm](https://pnpm.io/zh/)，IDE 使用 [VSCode](https://code.visualstudio.com/)
```
pnpm create vite
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ef71884cb934b18ac8fe4b752e9d6cd~tplv-k3u1fbpfcp-watermark.image?)

## TypeScript

看下依赖，只有 `vue-tsc` 不熟，查下文档。`（注意下图红框）`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81f022e153e24d3693b88fc577573689~tplv-k3u1fbpfcp-watermark.image?)

看起来是一个检查 `Vue SFC` 文件 TS 类型的命令行工具，比如在打包或者在 merge 代码前检查 TS 类型是否正确，而在 dev 环境下使用  [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)  插件来验证。

这样看来，需要推荐安装 Volar 插件。

在根目录新建 `.vscode` 目录，添加
```json
{
  "recommendations": ["johnsoncodehk.volar", "johnsoncodehk.vscode-typescript-vue-plugin"]
}

```
这样其他用 VSCode 打开这个项目的人就会弹出推荐安装该插件。

插件的名字可以在详情查看

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7496c7cc096e48abb2563d4ec00fcbf4~tplv-k3u1fbpfcp-watermark.image?)

这样开发时就有 TS 类型约束了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6749c4651368424ab8c787d9cb52c671~tplv-k3u1fbpfcp-watermark.image?)

而且安装这两个插件之后，也不需要原来的 `*.vue` 的类型声明了。

## ESLint
```js
pnpm install eslint eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```
- [ESLint](https://cn.eslint.org/) `JavaScript 代码检查工具`
- [eslint-plugin-vue](https://eslint.vuejs.org/) `Vue 官方的 ESLint 插件，包含 vue/* 的规则集`
- [@typescript-eslint/eslint-plugin](https://typescript-eslint.io/docs/linting/) `TS 检查的 ESLint 插件，包含 @typescript-eslint/* 的规则集`
- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser) `帮助 ESLint 解析 TypeScript 语法`
> 需要注意的 `@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin` 版本号必需一致

添加 `.eslintrc.js`，`.eslintignore` 文件
```js
pnpm install eslint-define-config -D
```

.eslintrc.js
```ts
// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  rules: {
    // rules...
  },
});
```
这样 `eslintrc` 也有类型约束了

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1fadf7bf7c34a288ef5354c68dc1d53~tplv-k3u1fbpfcp-watermark.image?)

> 同样，VSCode 的 ESLint 插件也添加到推荐 JSON 里。下面不在提示了。

## [Prettier](https://prettier.io/)

`Volar`、`ESLint` 都有格式化功能，那为什么还要选择 `Prettier` 呢? 

代码风格最不好管理的地方在哪里? 就是所有人都有自己的习惯，**无法讨论出一个让所有人都满意的方案**。

Prettier 的方案是 `opinionated`，就是给出最小的配置，要不你就用我的风格，要不你就别用。不容许随便改。(所以也不用吵了。。。)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1c6ea5064474f17807676b7148ffe08~tplv-k3u1fbpfcp-watermark.image?)

> 注意`代码风格`和`语法检查`的区别，代码风格是要不要加空格，分号，逗号等等。语法检查是是否声明变量，声明未使用等等。

```
pnpm install -D eslint-config-prettier eslint-plugin-prettier prettier
```
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier/) `关闭和 Prettier 冲突的 ESLint 规则`
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) `把 Prettier 规则嵌入到 ESLint，下面代码的 prettier/prettier": "error"`
修改 `.eslintrc.js` 配置
```ts
{
  "extends": [
    "some-other-config-you-use",
    "prettier"
  ],
  plugins: ["prettier"],
  rules: {
    "other-rules",
    "prettier/prettier": "error"
  }
}
```
在 VSCode 安装 Prettier 插件，把格式化方式改为 `Prettire`，测试格式化正常。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc5362e4f0fd44d0b6c1b587a7296b9c~tplv-k3u1fbpfcp-watermark.image?)

## [Stylelint](https://stylelint.io/user-guide/get-started)

```
pnpm install --D stylelint stylelint-config-recommended-vue stylelint-config-prettier stylelint-config-recess-order postcss-html
```
- [Stylelint](https://stylelint.io/user-guide/get-started) `强大、先进的 CSS 代码检查器，可以检查 CSS 代码中的错误和风格`
- [stylelint-config-recommended-vue](https://github.com/ota-meshi/stylelint-config-recommended-vue) `Vue 的 Stylelint 的推荐规则集`
- [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier) `关闭和 Prettier 冲突的规则`
- [stylelint-config-recess-order](https://github.com/stormwarning/stylelint-config-recess-order) `对 CSS 属性进行排序`
- [postcss-html](https://github.com/ota-meshi/postcss-html) `解析 HTML 或者类 HTML 的 PostCSS 语法，比如 PHP、 VueSFC`
新建 `.stylelintrc.json`
```json
{
  "extends": ["stylelint-config-recommended-vue", "stylelint-config-prettier", "stylelint-config-recess-order"]
}
```


需要注意几个问题  
1. 需要关闭 VSCode 自己的 css 验证，否则会有两个验证报错
settings.json
```
"css.validate": false,
"less.validate": false,
"scss.validate": false
```
2. 如果 `.stylelintrc` 配置文件是用 .json 结尾的，不要加注释。不是 JSON5，会导致拉取配置无法编译。
3. `stylelint-config-standard` 默认规则只对 css 生效，无法解析 Vue
4. 如果使用预编译器，需要替换对应的规则集
比如要使用`scss`
```
pnpm install stylelint-config-standard-scss -D
```
`.stylelintrc.json` 配置改为
```json
{
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-config-prettier",
    "stylelint-config-recess-order"
  ]
}
```
## [Windi CSS](https://cn.windicss.org/)

```
pnpm i -D vite-plugin-windicss windicss
```
然后，在你的 Vite 配置中添加插件：

vite.config.js

```ts
import WindiCSS from 'vite-plugin-windicss'

export default {
  plugins: [
    WindiCSS(),
  ],
}
```

最后，在你的 Vite 入口文件中导入 `virtual:windi.css`：

main.js

```ts
import 'virtual:windi.css'
```

安装 VSCode 插件，在 `settings.json` 里添加
```json
  "editor.quickSuggestions": {
    "strings": true
  },
```

这样就会有`代码提示`和`悬停预览`等等功能

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb8000327d374887bae506e408807906~tplv-k3u1fbpfcp-watermark.image?)

在 `windi.config.ts` 中配置

```ts
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: [
      'src/**/*.{vue,jsx,tsx,svelte}',
      'shared/**/*.{vue,ts}',
    ],
  },
})
```
然后，在 VSCode 中 `Ctrl+Shift+P` ， 运行命令：`Windi CSS: Run & Open Analysis` 可以打开 `windicss` 的可视化分析。

## 生产依赖
演示就用 antd 了
```
pnpm install @ant-design/icons-vue ant-design-vue @vueuse/core pinia vue-router
```
业务相关代码，比如布局啊，全局主题啊不是这次的关键，就不详细写了。

## monorepo
pnpm 使用 monorepo 非常简单，只需要加个文件 `pnpm-workspace.yaml`，然后新建一个`packages` 文件夹

```yaml
prefer-workspace-packages: true
packages:
  - 'packages/**'
```
这样 `packages` 里就是单独的 `repo`，而各种配置和依赖可以共用全局的。


## qiankun

为了让共享配置层级清晰，qiankun 主应用（基座）和子应用都放到 `packages` 中。
```
pnpm install -W qiankun
```
> 全局依赖需要加 -W

主应用几个需要改到的地方。  
1. 路由，需要把子应用注册路由加进来
```ts
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
  ])
})
```
2. 在 `main.ts` 入口处，添加注册信息
`microApps.ts`
```ts
type microApp = {
  name: string
  entry: string
  container: "#view-main"
  activeRule: string
  port: number | string
}

const apps: microApp[] = [
  {
    name: "app1",
    entry: "//localhost:10002",
    container: "#view-main",
    activeRule: "/app1",
    port: "10002"
  }
]
export default apps
```
```ts
import { start as startQianKun, registerMicroApps, initGlobalState, MicroAppStateActions } from "qiankun"

// 微应用的信息
import apps from "./microApps"

/**
 * 注册微应用
 * 第一个参数 - 微应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(apps, {
  // qiankun 生命周期钩子 - 微应用加载前
  beforeLoad: (app: any) => {
    // 加载微应用前，加载进度条
    // eslint-disable-next-line no-console
    console.log("before load app.name====>>>>>", app.name)
    return Promise.resolve(app)
  },
  beforeMount: (app: any) => {
    // eslint-disable-next-line no-console
    console.log("[LifeCycle] before mount %c%s", "color: green;", app.name)
    return Promise.resolve(app)
  },
  // qiankun 生命周期钩子 - 微应用挂载后
  afterMount: (app: any) => {
    // 加载微应用前，进度条加载完成
    // eslint-disable-next-line no-console
    console.log("[LifeCycle] after mount %c%s", "color: green;", app.name)
    return Promise.resolve(app)
  }
})

/**
 * qiankun 通信实例
 */
const initialState = {}
export const actions: MicroAppStateActions = initGlobalState(initialState)

// 注册 qiankun
startQianKun({ sandbox: { strictStyleIsolation: true } })
// qiankun 通信
actions.onGlobalStateChange((state, prevState) => {
  // state: 变更后的状态; prevState: 变更前的状态
  // console.log(state, prevState)
})
```
3. 布局处添加子应用挂载的入口
```html
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <Menu></Menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="padding: 0; background: #fff">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <!-- 子应用容器 -->
        <div id="view-main" />
        <!-- 主应用自己的路由渲染 -->
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
```
子应用需要注意的位置
  
1. `package.json` 中 `name` 需要和主应用注册的 `name` 一致
2. `vite.config.ts` 里 `server.port` 需要改为主应用注册的 `entry` 端口一致
3. 子应用路由
```ts
export const router: Router = createRouter({
  history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? `/${packageConfig.name}` : "/"),
})
```
4. `vite.config.ts` 添加插件
```ts
import packageConfig from "./package.json"
import qiankun from "vite-plugin-qiankun"
const useDevMode = true // 如果是在主应用中加载子应用 vite, 必须打开这个, 否则vite加载不成功, 单独运行没影响

plugins: [
  qiankun(`${packageConfig.name}`, { useDevMode })
]
```
5. `main.ts` 改为
```ts
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
```

在全局 `package.json` 添加启动命令
```
  "scripts": {
    "dev": "pnpm -r --filter ./packages --parallel run dev",
    "build": "pnpm -r --filter ./packages --parallel run build",
    "preview": "pnpm -r --filter ./packages --parallel run preview",
    "clean": "rm -rf node_modules **/*/node_modules"
  }
```
这样，整个项目就部署好了。

## 整合配置

但是，现在所有的配置还是分散的，需要整合下。

`ESLint`、`Prettierr` 和 `Stylelint` 用全局的一份配置就行。

`packages.json` 主子应用都有依赖放到全局，子应用单独用的放到自己文件内。
* 主应用全局依赖 `pnpm install xxxx -W` 其他命令和原命令一致，多添加一个 `-W`
* 子应用依赖安装 `pnpm i xxxx --filter ${微应用pwd}`  比如 `pnpm uninstall uuid --filter app1` 会在 `app1` 子应用下安装 `uuid` 依赖，当然也可以去子应用目录下直接安装

`tsconfig.json` 使用 `extends` 继承全局配置，其中 `paths` 会匹配到本应用。比如这个 `@` 就是该子应用的 `src`，不是全局的。
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "common/*": ["../../common/*"]
    }
  },
  "exclude": ["dist", "**/*.js"]
}
```

`vite.config.ts` 使用 `loadConfigFromFile` 和 `mergeConfig`，当然其实读取文件，手动合并也是可以的。
```ts
import { defineConfig, loadConfigFromFile, mergeConfig } from "vite"
import AutoImport from "unplugin-auto-import/vite"
import packageConfig from "./package.json"
import qiankun from "vite-plugin-qiankun"
import { resolve } from "path"

const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir)
}

const useDevMode = true // 如果是在主应用中加载子应用 vite, 必须打开这个, 否则vite加载不成功, 单独运行没影响
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
    server: { port: 10002 },
    plugins: [
      qiankun(`${packageConfig.name}`, { useDevMode }),
      AutoImport({
        // vue函数的自动导入
        imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
        dts: false
      })
    ]
  }
  return mergeConfig(base, config)
})
```

`windi.config.ts` 使用 `presets` 继承全局配置。
```ts
import { defineConfig } from "windicss/helpers"

export default defineConfig({
  presets: [require("../../windi.config.ts").default]
})
```

## 使用命令行生成子应用

虽然创建子应用不是一个高频操作，但还是有很多重复操作，而且，每个子应用的模板也不好统一。

所以我们要设计一个命令行可以自动生成子应用。那么大概需要几步
1. 根据 `name`，`port` 注册子应用
2. 根据 `name` 在 `packages` 下新建项目，从 `git` 仓库上拉一个模板下来，修改 `name` 和 `port` 之类的配置。
3. `pnpm install` 并提示

```
pnpm i -W -D download-git-repo fs-extra inquirer
```
- download-git-repo `从 git clone 仓库到本地`
- fs-extra `一个扩展的 fs`
- inquirer `可以根据预设收集用户输入，这里用来确认子应用的 name, port`

创建提示用户输入
```
  const apps = await readAppsFile()
  // console.log(apps)
  const meta = await inquirer.prompt([
    {
      type: "input",
      message: "请输入你要新建微应用名字（英文或者数字）：",
      name: "appName",
      validate(answer) {
        console.log(answer)
        const done = this.async()
        const validateRes = RegxMap.IS_APP_NAME.test(answer)
        if (!validateRes) {
          done("请按要求输入正确的微应用名字！")
          return
        }
        if (apps.find(item => item.name === answer)) {
          done("已存在同名微应用，请确认后更换名字再重试。")
          return
        }
        done(null, true)
      }
    },
    {
      type: "input",
      message: "请输入你要新建的微应用的端口（数字，推荐 10000 - 10010)：",
      name: "port",
      validate(answer) {
        const done = this.async()
        const validateRes = RegxMap.IS_PORT.test(answer)
        if (!validateRes) {
          done("只能输入数字！")
          return
        }
        // eslint-disable-next-line eqeqeq
        if (apps.find(item => item.port == answer)) {
          done("已存在相同微应用端口，请确认后更换再重试。")
          return
        }
        done(null, true)
      }
    }
  ])
  return meta
 ```
 用户输入成功之后，从 `git` 下载模板，正则匹配对应的关键字，替换为用户输入字段
 ```ts
module.exports = async meta => {
  await cloneRepo(meta)
  await replaceName(meta)
  const newApps = await writeAppsFile(meta)
  await writeMicroApps(newApps)
  const workerProcess = exec(`pnpm install`)
  workerProcess.stdout.on("data", data => {
    console.log("stdout: " + data)
  })

  workerProcess.stderr.on("data", data => {
    console.log("stderr: " + data)
  })
  console.log(`微服务创建成功，请在 pnpm install 完成之后，前往 packages/${meta.appName} 目录进行开发`)
}
```
下面是修改注册子应用信息的代码，其他修改大同小异
```ts
// 修改 modules/microApps.ts
const writeMicroApps = async newApps => {
  const reg = /const\sapps:\smicroApp\[\]\s=\s\[(.|\s)*export\sdefault\sapps/
  const filePath = `../../common/modules/microApps.ts`
  const microAppsFile = fs.readFileSync(resolve(__dirname, filePath), "utf-8")
  const microAppsContent = microAppsFile.replace(reg, `const apps: microApp[] = ${newApps} \r\n export default apps`)
  fs.writeFile(resolve(__dirname, filePath), microAppsContent, err => {
    if (err) console.log(err)
  })
}
```
> 我这里是用一个 JSON 记录了所有子应用信息，当然也可以用正则去匹配 fs 读取的注册信息

添加命令，测试一下。
```
"gen": "node ./scripts/genNewMicroApp/index.js"
```


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9dc97e007fe45ae9cad6877831019a3~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f561a3e8f52c46808ba7e68e094d994f~tplv-k3u1fbpfcp-watermark.image?)

因为 `Menu` 的逻辑没有写，手动改下路由看下。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/841d282047be4ed4962c7137b7113901~tplv-k3u1fbpfcp-watermark.image?)

## 其它问题

代码仓库： https://github.com/zhl1232/qiankun-template  
模板仓库：https://github.com/zhl1232/qiankun-vue-micro-template

1. 一些业务逻辑没有写，比如 `Menu` 逻辑，全局主题之类的
2. 现在子应用模板只有 `Vue`
3. 只有开发环境，没有部署配置
4. 仓库行尾是用的 `linux` 配置，`windows` 环境自行更改 `Prettier` 下的 `endOfLine`
等等吧，如果有需求的话，后面再补吧。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/687a27336c45485393befcce55d7447c~tplv-k3u1fbpfcp-watermark.image?)

## 推荐
`
VSCode` 开发的话，可以试下这个插件
[GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)

就是最近很火的那个 AI 写代码的。挺有意思的，一方面，简单的代码可以靠提示就行，另一方面，如果思路卡住了，他可能还真能给你一些提示。

[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)  
一个单词拼写检查。语法，风格都有检查的，但实际上单词拼错了也会影响项目质量。不信你装上看一下，基本每个页面都有拼错的单词。。。
