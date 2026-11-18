import { watch } from 'vue'
import type {
  BackgroundModule,
  BackgroundReactiveContext,
  BackgroundRequest,
} from 'vuepress-theme-synctrolling'
import {
  FRAGMENT_WEBGL1,
  FRAGMENT_WEBGL2,
  VERTEX_WEBGL1,
  VERTEX_WEBGL2,
} from './sfXyRS.frag'

/*
 * ISOMETRIC SPECIMEN — WebGL port of "Graphic Design Experiment 31" by yasuo
 * (https://www.shadertoy.com/view/sfXyRS).
 *
 * A scrolling isometric tile field of truchet arcs, half-tone grids,
 * arrows and stripes. The shader's dark base is transparent so the theme's
 * `--syn-bg` shows through; the pattern is drawn as a single ink colour.
 */

type GL = WebGL2RenderingContext | WebGLRenderingContext

// Background is decorative: prefer cheap over crisp.
const FRAME_MS = 1000 / 20
const MAX_DPR = 1.5
/** Internal buffer scale vs CSS×DPR; CSS stretches the result. */
const RENDER_SCALE = 1
const STATIC_TIME = 12.5
// Scales every iTime-driven motion in the shader (scroll, rotation, stripes, arrows).
const TIME_SCALE = 0.08
// Fixed-duration ease-in-out when crossing home ↔ non-home (seconds).
const SPEED_DURATION = 0.5
const SPEED_EPSILON = 0.002
// Clamp per-frame dt so a stalled frame cannot jump the clock.
const MAX_DT = 0.1

/** Smoothstep (ease-in-out): zero derivative at both ends — no sudden kick. */
function smootherstep(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * x * (x * (x * 6 - 15) + 10)
}

const INK = {
  light: [0.06, 0.06, 0.07],
  dark: [0.94, 0.94, 0.95],
} as const

const OPACITY = { light: 0.07, dark: 0.2 } as const

interface Program {
  gl: GL
  program: WebGLProgram
  buffer: WebGLBuffer
  uResolution: WebGLUniformLocation | null
  uTime: WebGLUniformLocation | null
  uInk: WebGLUniformLocation | null
  uOpacity: WebGLUniformLocation | null
}

function compile(gl: GL, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[background] shader compile failed:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(canvas: HTMLCanvasElement): Program | null {
  const attrs: WebGLContextAttributes = {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  }

  let gl: GL | null = canvas.getContext('webgl2', attrs)
  let vertex = VERTEX_WEBGL2
  let fragment = FRAGMENT_WEBGL2
  if (!gl) {
    gl = canvas.getContext('webgl', attrs)
    if (!gl) return null
    // AA no longer needs OES_standard_derivatives (no fwidth in the shader).
    vertex = VERTEX_WEBGL1
    fragment = FRAGMENT_WEBGL1
  }

  const vs = compile(gl, gl.VERTEX_SHADER, vertex)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment)
  const program = gl.createProgram()
  const buffer = gl.createBuffer()
  if (!vs || !fs || !program || !buffer) return null

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.bindAttribLocation(program, 0, 'aPos')
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[background] program link failed:', gl.getProgramInfoLog(program))
    return null
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.useProgram(program)
  gl.disable(gl.BLEND)
  gl.clearColor(0, 0, 0, 0)

  return {
    gl,
    program,
    buffer,
    uResolution: gl.getUniformLocation(program, 'iResolution'),
    uTime: gl.getUniformLocation(program, 'iTime'),
    uInk: gl.getUniformLocation(program, 'uInk'),
    uOpacity: gl.getUniformLocation(program, 'uOpacity'),
  }
}

function createHost(context: BackgroundReactiveContext) {
  const { element } = context
  const doc = element.ownerDocument
  const win = doc.defaultView ?? window
  const root = doc.documentElement

  // The layer must stay transparent; the page colour lives on <html> instead.
  const previousElementBg = element.style.backgroundColor
  const previousRootBg = root.style.backgroundColor
  element.style.backgroundColor = 'transparent'
  if (!previousRootBg) root.style.backgroundColor = 'var(--syn-bg)'

  const canvas = doc.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    display: 'block',
    pointerEvents: 'none',
    background: 'transparent',
  })
  element.appendChild(canvas)

  let prog = createProgram(canvas)

  let raf = 0
  let disposed = false
  let lastFrameAt = 0
  // Only home ↔ non-home eases motion; non-home ↔ non-home stays frozen.
  let home = context.contentType.value.resolved === 'home'
  const desiredSpeed = (): number => (context.reducedMotion.value || !home ? 0 : 1)
  // Clock speed multiplier, eased with smootherstep over SPEED_DURATION.
  let speed = desiredSpeed()
  let speedFrom = speed
  let speedTo = speed
  let speedBlend = 1
  // Integrated animation time in seconds (sum of dt * speed).
  let elapsed = 0
  let lastTickAt = 0

  function clock(): number {
    if (context.reducedMotion.value) return STATIC_TIME
    return elapsed * TIME_SCALE
  }

  function beginSpeedTransition(next: number): void {
    if (Math.abs(next - speedTo) < SPEED_EPSILON && speedBlend >= 1) return
    speedFrom = speed
    speedTo = next
    speedBlend = 0
  }

  function settled(): boolean {
    return speedTo === 0 && speed < SPEED_EPSILON && speedBlend >= 1
  }

  function advance(now: number): void {
    const dt = lastTickAt ? Math.min(MAX_DT, Math.max(0, (now - lastTickAt) / 1000)) : 0
    lastTickAt = now
    if (speedBlend < 1) {
      speedBlend = Math.min(1, speedBlend + dt / SPEED_DURATION)
      speed = speedFrom + (speedTo - speedFrom) * smootherstep(speedBlend)
      if (speedTo === 0 && speedBlend >= 1) speed = 0
    } else {
      speed = speedTo
    }
    elapsed += dt * speed
  }

  function resize(): boolean {
    const rect = element.getBoundingClientRect()
    const dpr = Math.min(win.devicePixelRatio || 1, MAX_DPR)
    const scale = dpr * RENDER_SCALE
    const w = Math.max(1, Math.round((rect.width || win.innerWidth) * scale))
    const h = Math.max(1, Math.round((rect.height || win.innerHeight) * scale))
    if (canvas.width === w && canvas.height === h) return false
    canvas.width = w
    canvas.height = h
    return true
  }

  function draw(): void {
    if (!prog || disposed) return
    const { gl } = prog
    if (gl.isContextLost()) return
    const mode = context.colorMode.value
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform2f(prog.uResolution, canvas.width, canvas.height)
    gl.uniform1f(prog.uTime, clock())
    gl.uniform3fv(prog.uInk, INK[mode])
    gl.uniform1f(prog.uOpacity, OPACITY[mode])
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function frame(now: number): void {
    raf = 0
    if (disposed) return
    if (now - lastFrameAt >= FRAME_MS) {
      lastFrameAt = now
      advance(now)
      draw()
    }
    if (settled()) {
      lastTickAt = 0
      return
    }
    schedule()
  }

  // Keeps the loop alive while moving or easing; idles once fully stopped.
  function schedule(): void {
    if (disposed || raf || !prog || doc.hidden || context.reducedMotion.value) return
    if (settled()) return
    raf = win.requestAnimationFrame(frame)
  }

  // Hard stop for hidden tabs; the next frame restarts dt from zero.
  function pause(): void {
    if (raf) win.cancelAnimationFrame(raf)
    raf = 0
    lastTickAt = 0
  }

  function redraw(): void {
    draw()
  }

  function onResize(): void {
    if (resize()) redraw()
  }

  function onVisibility(): void {
    if (doc.hidden) pause()
    else schedule()
  }

  function syncMotion(): void {
    if (context.reducedMotion.value) {
      pause()
      speed = 0
      speedFrom = 0
      speedTo = 0
      speedBlend = 1
      redraw()
      return
    }
    beginSpeedTransition(desiredSpeed())
    schedule()
  }

  function onContextLost(event: Event): void {
    event.preventDefault()
    if (raf) win.cancelAnimationFrame(raf)
    raf = 0
  }

  function onContextRestored(): void {
    prog = createProgram(canvas)
    redraw()
    schedule()
  }

  const observer =
    typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(onResize) : null
  observer?.observe(element)
  win.addEventListener('resize', onResize)
  doc.addEventListener('visibilitychange', onVisibility)
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)

  const stopColor = watch(context.colorMode, redraw)
  const stopMotion = watch(context.reducedMotion, syncMotion)
  const stopContentType = watch(
    () => context.contentType.value.resolved,
    (resolved) => {
      const nextHome = resolved === 'home'
      if (nextHome === home) return
      home = nextHome
      syncMotion()
    },
  )

  resize()
  // Start the loop on first paint when landing on home (request may not cross a boundary).
  schedule()

  return {
    request(snapshot: BackgroundRequest): void {
      if (disposed) return
      const nextHome = snapshot.contentType.resolved === 'home'
      const crossedHomeBoundary = nextHome !== home
      home = nextHome
      resize()
      // Ease only when crossing home ↔ non-home; ignore non-home ↔ non-home.
      if (crossedHomeBoundary || context.reducedMotion.value) syncMotion()
      else if (home && !context.reducedMotion.value) schedule()
      else redraw()
    },
    dispose(): void {
      if (disposed) return
      disposed = true
      if (raf) win.cancelAnimationFrame(raf)
      raf = 0
      stopColor()
      stopMotion()
      stopContentType()
      observer?.disconnect()
      win.removeEventListener('resize', onResize)
      doc.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      if (prog) {
        const { gl } = prog
        gl.deleteBuffer(prog.buffer)
        gl.deleteProgram(prog.program)
        gl.getExtension('WEBGL_lose_context')?.loseContext()
        prog = null
      }
      canvas.remove()
      element.style.backgroundColor = previousElementBg
      if (!previousRootBg) root.style.backgroundColor = ''
    },
  }
}

const module: BackgroundModule = {
  default(context) {
    return createHost(context)
  },
}

export default module.default
