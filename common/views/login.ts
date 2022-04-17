// 计算圆点配置
export function calcDotNums() {
  // 基准
  const nums = {
    // 圆点最小间距
    minDistance: 80,
    // 圆点最大间距
    maxDistance: 100,
    // 生成的圆点数量
    n: 80
  }
  // 宽高基准
  const BASIC_AREA = {
    width: 960,
    height: 500
  }
  // 竖屏, 间距补充
  const HEIGHT_FIX_NUM = 100

  const { clientWidth, clientHeight } = document.body
  if (clientHeight > clientWidth) {
    nums.minDistance += HEIGHT_FIX_NUM
    nums.maxDistance += HEIGHT_FIX_NUM
  }

  const scaleW = clientWidth / BASIC_AREA.width
  const scaleH = clientHeight / BASIC_AREA.height
  // 取最小比例
  const currentScale = Math.min(scaleW, scaleH)

  const keys = Object.keys(nums)
  keys.forEach(key => {
    nums[key] = Math.floor(nums[key] * currentScale)
  })

  // 限制 dot 数量
  const N_MIN_LIMIT = 40
  const N_MAX_LIMIT = 140

  if (nums.n > N_MAX_LIMIT) {
    nums.n = N_MAX_LIMIT
  }

  if (nums.n < N_MIN_LIMIT) {
    nums.n = N_MIN_LIMIT
  }

  return nums
}
export function timer(callback: () => void, delay?: undefined, time?: undefined) {
  let frame = 0 // is an animation frame pending?
  let timeout = 0 // is a timeout pending?
  let interval = 0 // are any timers active?
  const pokeDelay = 1000 // how frequently we check for clock skew
  let taskHead: any = ''
  let taskTail: any = ''
  let clockLast = 0
  let clockNow = 0
  let clockSkew = 0
  const clock = typeof performance === "object" && performance.now ? performance : Date
  const setFrame =
    typeof window === "object" && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function (f: () => void) {
          setTimeout(f, 17)
        }
  const sleep = function (time?: number) {
    if (frame) {
      return // Soonest alarm already set, or will be.
    }
    if (timeout) {
      window.clearTimeout(timeout)
    }
    const delay = time - clockNow // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) {
        timeout = window.setTimeout(wake, time - clock.now() - clockSkew)
      }
      if (interval) {
        window.clearInterval(interval)
      }
    } else {
      if (!interval) {
        clockLast = clock.now()
        interval = window.setInterval(poke, pokeDelay)
      }
      frame = 1
      setFrame(wake)
    }
  }

  function clearNow() {
    clockNow = 0
  }

  function now() {
    if (clockNow) {
      return clockNow
    }
      setFrame(clearNow)
      clockNow = clock.now() + clockSkew
      return clockNow
    
  }

  function timerFlush() {
    now() // Get the current time, if not already set.
    frame += 1 // Pretend we’ve set an alarm, if we haven’t already.
    let t = taskHead
    let e = 0
    while (t) {
      e = clockNow - t._time
      if (e >= 0) {
        t._call.call(null, e)
      }
      t = t._next
    }
    frame -= 1
  }

  function poke() {
    const now = clock.now()
    const delay = now - clockLast
    if (delay > pokeDelay) {
      clockSkew -= delay
      clockLast = now
    }
  }

  function nap() {
    let t0: { _next: any } = { _next: '' }
    let t1 = taskHead
    let t2: any = ''
    let time = Infinity
    while (t1) {
      if (t1._call) {
        if (time > t1._time) {
          time = t1._time
        }
        t0 = t1
        t1 = t1._next
      } else {
        t2 = t1._next
        t1._next = null
        t1 = t0 ? (t0._next = t2) : (taskHead = t2)
      }
    }
    taskTail = t0
    sleep(time)
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew
    frame = 0
    timeout = 0
    try {
      timerFlush()
    } finally {
      frame = 0
      nap()
      clockNow = 0
    }
  }

  function Timer() {
    this._call = undefined
    this._time = undefined
    this._next = undefined
  }

  Timer.prototype = {
    constructor: Timer,
    restart (callback: any, delay: string | number, time: number) {
      if (typeof callback !== "function") {
        throw new TypeError("callback is not a function")
      }
      time = (time === undefined ? now() : +time) + (delay === undefined ? 0 : +delay)
      if (!this._next && taskTail !== this) {
        if (taskTail) {
          taskTail._next = this
        } else {
          taskHead = this
        }
        taskTail = this
      }
      this._call = callback
      this._time = time
      sleep()
    },
    stop () {
      if (this._call) {
        this._call = null
        this.time = Infinity
        sleep()
      }
    }
  }

  const t = new Timer()
  t.restart(callback, delay, time)
  return t
}

export function draw(canvas: HTMLCanvasElement) {
  const { minDistance, maxDistance, n } = calcDotNums()
  const minDistance2 = minDistance * minDistance
  const maxDistance2 = maxDistance * maxDistance
  const tau = 2 * Math.PI
  const radius = 3.5 // 圆点半径
  const fillStyle = "#8fa1bc" // 背景色, 圆点颜色
  const strokeStyle = "#99acc6" // 连线颜色
  const context = canvas.getContext("2d")
  const width = canvas.width
  const height = canvas.height
  context.fillStyle = fillStyle

  let i = 0
  const particles = new Array(n)
  while (i < n) {
    particles[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      vy: 0
    }
    i += 1
  }

  timer(() => {
    context.save()
    context.clearRect(0, 0, width, height)

    let i = 0
    while (i < n) {
      const p = particles[i]
      p.y += p.vy
      if (p.y < -maxDistance) {
        p.y += height + maxDistance * 2
      } else if (p.y > height + maxDistance) {
        p.y -= height + maxDistance * 2
      }
      p.vy += 0.1 * (Math.random() - 0.5) - 0.01 * p.vy
      context.beginPath()
      context.arc(p.x, p.y, radius, 0, tau)
      context.fill()
      i += 1
    }

    for (let i = 0; i < n; ++i) {
      for (let j = i + 1; j < n; ++j) {
        const pi = particles[i]
        const pj = particles[j]
        const dx = pi.x - pj.x
        const dy = pi.y - pj.y
        const d2 = dx * dx + dy * dy
        if (d2 < maxDistance2) {
          context.globalAlpha = d2 > minDistance2 ? (maxDistance2 - d2) / (maxDistance2 - minDistance2) : 1
          context.beginPath()
          context.moveTo(pi.x, pi.y)
          context.lineTo(pj.x, pj.y)
          context.strokeStyle = strokeStyle
          context.stroke()
        }
      }
    }

    context.restore()
  })
}