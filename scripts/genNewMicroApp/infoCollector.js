const inquirer = require("inquirer")
const fs = require("fs-extra")
const { resolve } = require("path")

const readAppsFile = async () => {
  const filePath = `../../common/modules/list.json`
  const jsonFile = fs.readFileSync(resolve(__dirname, filePath), "utf-8")
  const jsonContent = JSON.parse(jsonFile)
  return jsonContent
}

const RegxMap = {
  IS_APP_NAME: /^[a-z0-9]+$/i,
  IS_PORT: /^\d+$/
}

module.exports = async () => {
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
}
