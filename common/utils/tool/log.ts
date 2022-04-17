const stack = {
  log: [],
  warn: [],
  error: []
}

const maxLogCount = 100

export default {
  log(msg?: any, ...optionalParams: any[]) {
    // eslint-disable-next-line
    console.log(`%c ${msg}`, optionalParams)
    const logLength = stack.log.unshift([msg, ...optionalParams])
    stack.log.splice(maxLogCount, logLength)
  },
  warn(msg?: any, ...optionalParams: any[]) {
    // eslint-disable-next-line
    console.warn(msg, ...optionalParams)
    const logLength = stack.warn.unshift([msg, ...optionalParams])
    stack.warn.splice(maxLogCount, logLength)
  },
  error(msg?: any, ...optionalParams: any[]) {
    // eslint-disable-next-line
    console.error(msg, ...optionalParams)
    const logLength = stack.error.unshift([msg, ...optionalParams])
    stack.error.splice(maxLogCount, logLength)
  },
  trace(msg?: any) {
    // eslint-disable-next-line
    console.trace(msg)
  }
}

if (window) {
  window.ys_stack = stack
}
