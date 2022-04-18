const fs = require("fs-extra")
const download = require("download-git-repo")
const { resolve } = require("path")
const exec = require("child_process").exec

// 拉取微应用模板
const cloneRepo = async meta => {
  fs.mkdirpSync(`../../packages/${meta.appName}`)
  return new Promise((resolve, reject) => {
    return download(
      "direct:https://github.com/zhl1232/qiankun-vue-micro-template.git",
      `packages/${meta.appName}`,
      { clone: true, checkout: "main" },
      function (err) {
        console.log(err ? "Error" : "Success")
        if (err) {
          reject(err)
        } else {
          resolve("Success")
        }
      }
    )
  })
}

// 修改微应用 package.json 和 vite.config.ts
const replaceName = async meta => {
  const filePath = `../../packages/${meta.appName}/package.json`
  const jsonFile = fs.readFileSync(resolve(__dirname, filePath), "utf-8")
  const jsonContent = JSON.parse(jsonFile)
  console.log(jsonContent)
  jsonContent.name = meta.appName
  const newJsonContent = JSON.stringify(jsonContent, null, 2)
  fs.writeFile(resolve(__dirname, filePath), newJsonContent, err => {
    if (err) console.log(err)
  })

  const viteConfigPath = `../../packages/${meta.appName}/vite.config.ts`
  const viteConfigFile = fs.readFileSync(resolve(__dirname, viteConfigPath), "utf-8")
  const viteConfigContent = viteConfigFile.replace(/port:\s10001/g, `port: ${meta.port}`)
  fs.writeFile(resolve(__dirname, viteConfigPath), viteConfigContent, err => {
    if (err) console.log(err)
  })
}

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

// 修改 modules/list.json
const writeAppsFile = async meta => {
  const filePath = `../../common/modules/list.json`
  const jsonFile = fs.readFileSync(resolve(__dirname, filePath), "utf-8")
  const jsonContent = JSON.parse(jsonFile)
  jsonContent.push({
    name: meta.appName,
    entry: `//localhost:${meta.port}`,
    container: "#view-main",
    activeRule: `/${meta.appName}`,
    port: meta.port
  })
  const newJsonContent = JSON.stringify(jsonContent, null, 2)
  fs.writeFile(resolve(__dirname, filePath), newJsonContent, err => {
    if (err) console.log(err)
  })
  return newJsonContent
}

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
