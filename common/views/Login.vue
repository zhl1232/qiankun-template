<script setup lang="ts">
import api from '../api'
import axios from 'axios'
import { storageLocal } from '../utils/storage'
import { draw } from './login'
// import _ from "lodash"
// const SM4 = require("gm-crypt").sm4
import { isChrome } from '../utils/tool/index'
// import { initRouter } from "@/router/utils"
// import { storageSession } from "@/utils/storage"
// import { addClass, removeClass } from "@/utils/operate"

const router = useRouter()
const formData = reactive({
  user: 'x@yunshan.net.cn',
  pwd: 'admin',
  type: ''
})
// const SM4_CONFIG = {
//   key: "JeF8U9wHFOMfs2Y8",
//   mode: "ecb",
//   cipherType: "base64"
// }
// const sm4 = new SM4(SM4_CONFIG)
// const hash = String(~~(Math.random() * (99999 - 10000) + 10000))

type accountType = {
  format: string
  name: string
  type: string
}
type selectOption = { value: string; label: string }
let accountTypesMap = reactive<{ [key: number]: accountType }>({})
const accountTypes = reactive<selectOption[]>([])

axios('/api/fauths/login_list').then(data => {
  accountTypesMap = data.data.DATA
  for (const [k, v] of Object.entries(accountTypesMap)) {
    accountTypes.push({
      value: k,
      label: v.name
    })
  }
  formData.type = accountTypesMap[accountTypes[0].value].type
  // accountTypesMap = data.data.DATA.flatMap((item: item, key: number) => {
  //   /* eslint-disable-next-line */
  //   // if (process_env_SaaS && item?.type === "ldap") {
  //   //   return []
  //   // }
  //   return [
  //     {
  //       label: item?.name,
  //       value: key
  //     }
  //   ]
  // })
})

const onLogin = (): void => {
  // api("/users/login", {
  //   data: {
  //     body: sm4.encrypt(
  //       JSON.stringify({
  //         account_type: this.accountTypesMap[this.accountType]?.type,
  //         grant_type: "password",
  //         email: user.value,
  //         password: pwd.value,
  //         // code: pwd.value,
  //         hash
  //       })
  //     )
  //   }
  // })
  api('/users/login', {
    data: {
      account_type: formData.type,
      grant_type: 'password',
      email: formData.user,
      password: formData.pwd
    }
  }).then((res: { DATA: { access_token: any; refresh_token: any } }) => {
    const { access_token, refresh_token } = res.DATA
    storageLocal.setItem('access_token', access_token)
    storageLocal.setItem('refresh_token', refresh_token)
    router.push('/')
  })
  // storageSession.setItem("info", {
  //   username: "admin",
  //   accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
  // })
  // initRouter("admin").then(() => {})
  // router.push("/")
}

const showBrowserWarning = !isChrome()

const redraw = useDebounceFn(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  // resize the canvas to fill browser window dynamically
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  // call draw on resize or the canvas will be cleared
  draw(canvas)
}, 300)
const loginContainer = ref(null)
useResizeObserver(loginContainer, () => {
  redraw()
})
</script>

<template>
  <!-- <img :src="bg" class="wave" /> -->
  <div ref="loginContainer" class="login-container">
    <div class="login-box">
      <div class="login-pane">
        <div class="logo">
          <img src="../assets/images/deepflow-logo.svg" />
        </div>
        <div class="login-form">
          <a-form labys-position="top" labys-width="100px" :model="formData" style="max-width: 440px">
            <a-form-item label="帐号类型">
              <a-select v-model:value="formData.type" :options="accountTypes" style="width: 100%"></ys-select>
            </ys-form-item>
            <a-form-item label="账号">
              <a-input v-model:value="formData.user"></ys-input>
            </ys-form-item>
            <a-form-item label="密码">
              <a-input v-model:value="formData.pwd"></ys-input>
            </ys-form-item>
            <a-form-item>
              <a-button type="primary" class="login-btn" @click="onLogin">登录</ys-button>
            </ys-form-item>
          </ys-form>
        </div>
      </div>
      <div class="bottom-infos-wrap">
        <div v-if="showBrowserWarning" class="browser-warning">
          <!-- <i class="ys-icon-warning"></i> -->
          <span class="browser-warning__tip">
            您当前使用非DeepFlow推荐浏览器，为保证您的正常使用，请切换到Chrome浏览器60以上版本。
          </span>
        </div>
        <div class="copy-right">Copyright &copy; 2011-2022 YUNSHAN Networks 版权所有</div>
      </div>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.login-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .login-pane {
    display: flex;
    flex-direction: row;
    height: 325px;
    box-shadow: 0 0 6px #bfbfbf;

    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 340px;
      user-select: none;
      background-color: rgb(46 49 56);
      border-right: 3px solid #ffaa23;
    }

    .login-form {
      width: 450px;
      padding: 2em 4em;
      background: #fff;

      :deep(.ys-form-item) {
        margin-bottom: 10px;
      }

      :deep(.ys-form--labys-top .ys-form-item__label) {
        padding: 0;
      }

      .login-btn {
        width: 338px;
        margin-top: 20px;
      }
    }
  }

  .bottom-infos-wrap {
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    .browser-warning {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #ffaa23;

      img {
        width: 17px;
        margin: 0 10px;
      }
    }

    .copy-right {
      margin: 20px 0 40px;
      font-size: 12px;
    }
  }
}
</style>
