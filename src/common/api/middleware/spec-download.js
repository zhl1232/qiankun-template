// import Vue from 'vue'
// import { success, remove } from 'base/js/alert.js'
function downloadData(data, filename, type = "text/csv") {
  const file = new Blob(["\ufeff" + data], {
    type
  })
  const a = document.createElement("a")
  const url = URL.createObjectURL(file)
  a.href = url
  // eslint-disable-next-line no-useless-escape
  a.download = filename.replace(/\"/g, "")
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}

function downloadHandler(ctx) {
  try {
    // const notifyId = success(" csv下载中", 0, {
    //   iconClass: "el-icon-loading",
    //   customClass: "el-message--success"
    // })
    return ctx.res
      .then(res => {
        downloadData(res.data, res.headers["content-disposition"].split("filename=")[1])
      })
      .catch(res => {
        return res
      })
      .finally(() => {
        // remove(notifyId)
      })
  } catch (e) {
    return Promise.reject(e)
  }
}

export default async (ctx, next) => {
  await next()
  if (ctx.req.data?.OUTPUT_FORMAT === "csv") {
    return downloadHandler(ctx)
  }
}
