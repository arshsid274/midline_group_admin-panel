/* Sosei mobile photo — the WebGL "ImageChangeCanvas" shader (rounded-corner box
   mask + slice-wipe reveal), ported from the source for React/Next.
   `npm i three`. Call initSoseiCanvases(root, assetBase) in an effect; it returns
   a cleanup. Falls back to the existing <img> if WebGL is unavailable. */
import * as THREE from 'three'

const VERT = `uniform vec2 u_resolution;
varying vec2 v_uv;
void main() { vec2 xy = position.xy * 2.0; v_uv = uv; gl_Position = vec4(xy, 0.0, 1.0); }`

const FRAG = `uniform sampler2D u_textures[5];
uniform float u_time;
uniform float u_visibleLerp;
uniform float u_cornerSize;
uniform int u_prevIndex;
uniform int u_index;
uniform int u_maxIndex;
uniform float u_borderWidth;
uniform vec2 u_domWH;
uniform vec2 u_textureSize[5];
varying vec2 v_uv;
float rand(float x){return fract(sin(x*12.9898)*43758.5453);}
float box(vec2 uv, vec2 center, vec2 size, float radius, float antialias){
  vec2 d = abs(uv-center)-size+radius;
  float l = length(max(d,0.))+min(max(d.x,d.y),0.);
  return smoothstep(antialias,0.0,l-radius);
}
vec2 getCoverUV(vec2 uv, vec2 textureSize, vec2 containerSize){
  float ta=textureSize.x/textureSize.y; float ca=containerSize.x/containerSize.y; vec2 n=uv;
  if(ta>ca){float s=ca/ta; n.x=(uv.x-0.5)*s+0.5;} else {float s=ta/ca; n.y=(uv.y-0.5)*s+0.5;}
  return n;
}
vec4 getTexture(int i, vec2 uv){
  if(i>u_maxIndex) return vec4(0.0);
  vec2 c=getCoverUV(uv,u_textureSize[i],u_domWH);
  if(i==0) return texture2D(u_textures[0],c);
  if(i==1) return texture2D(u_textures[1],c);
  if(i==2) return texture2D(u_textures[2],c);
  if(i==3) return texture2D(u_textures[3],c);
  if(i==4) return texture2D(u_textures[4],c);
  return vec4(0.0);
}
float easeOutCirc(float t){return sqrt(1.0-pow(t-1.0,2.0));}
void main(){
  float numSlices=u_domWH.x/1.0; float xSlice=floor(v_uv.x*numSlices);
  float offset=rand(xSlice)*0.01;
  float adjustedProgress=clamp((u_visibleLerp-offset*0.5)/(1.0-0.5),0.0,1.0);
  float bw=1.09; float bp;
  if(u_index<u_prevIndex) bp=mix(-bw,1.0+bw,easeOutCirc(adjustedProgress));
  else bp=mix(1.0+bw,-bw,easeOutCirc(adjustedProgress));
  float dfb=v_uv.y-bp;
  vec4 t0=getTexture(min(u_index,u_prevIndex),v_uv);
  vec4 t1=getTexture(max(u_index,u_prevIndex),v_uv);
  int idx=(u_index>u_prevIndex)?min(u_index,u_prevIndex):max(u_index,u_prevIndex);
  float bf=smoothstep(-bw,bw,dfb);
  vec4 bc=vec4(getTexture(idx,vec2(v_uv.x,1.0)));
  vec4 bt0=mix(t0,bc,bf); vec4 bt1=mix(bc,t1,bf);
  vec4 res=mix(bt0,bt1,bf);
  float fw=bw*0.52; float bd=abs(dfb);
  float bi=1.0-smoothstep(0.0,bw,bd);
  float bl=smoothstep(bw-fw,bw,bd);
  res=mix(bc,res,bl); res=mix(res,bc,bi*(1.0-bl));
  float mask=box(v_uv*u_domWH,u_domWH/2.0,u_domWH/2.0,u_cornerSize,2.0);
  gl_FragColor=mix(vec4(0.0),res,mask);
}`

const LERP = 0.0075
const MAX_TEX = 5

function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

interface CanvasInstance { destroy(): void }

function makeCanvas(el: HTMLElement, assetBase: string, sp: boolean): CanvasInstance | null {
  let cfg: { src?: string | string[]; cornerSize?: number; borderWidth?: number; observe?: boolean } = {}
  try { cfg = JSON.parse(el.dataset.imageCanvas || '{}') } catch { /* noop */ }
  let src = cfg.src
  if (typeof src === 'string') src = [src]
  if (!src || !src.length || !webglOk()) return null

  const dir = sp ? 'sp' : 'pc'
  const w = el.clientWidth || 1
  const h = el.clientHeight || 1
  const canvas = document.createElement('canvas')
  el.appendChild(canvas)

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: 'high-performance' })
  renderer.setSize(w, h)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  const scene = new THREE.Scene()
  const camera = new THREE.Camera()
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

  let raf = 0
  let destroyed = false
  let u: Record<string, { value: unknown }> | null = null

  const loader = new THREE.TextureLoader()
  const sizes: THREE.Vector2[] = []
  Promise.all(
    src.map((s, i) => new Promise<THREE.Texture>((res, rej) => {
      const t = loader.load(`${assetBase}/canvas-image/${dir}/${s}`, (tex) => {
        sizes[i] = new THREE.Vector2(tex.image.width, tex.image.height)
        tex.generateMipmaps = false
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        res(t)
      }, undefined, rej)
    }))
  ).then((textures) => {
    if (destroyed) return
    const texSizes = Array.from({ length: MAX_TEX }, (_, i) => sizes[i] || new THREE.Vector2(1, 1))
    u = {
      u_textures: { value: textures }, u_textureSize: { value: texSizes },
      u_resolution: { value: new THREE.Vector2(w, h) }, u_time: { value: 0 },
      u_visible: { value: 1 }, u_visibleLerp: { value: 1 },
      u_cornerSize: { value: cfg.cornerSize || 0 }, u_maxIndex: { value: (src as string[]).length - 1 },
      u_prevIndex: { value: 0 }, u_index: { value: 0 },
      u_domWH: { value: new THREE.Vector2(w, h) }, u_borderWidth: { value: cfg.borderWidth || 1 },
    }
    const mesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide, transparent: true }))
    scene.add(mesh)
    renderer.render(scene, camera)
    el.classList.add('-has-canvas')

    if (cfg.observe !== false) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting && u) { (u.u_visibleLerp.value as number) = 0; io.disconnect() } })
      }, { threshold: 0.15 })
      io.observe(el)
    }

    let last = 0
    let prev = performance.now() / 1000
    const loop = (t: number) => {
      if (destroyed) return
      raf = requestAnimationFrame(loop)
      if (t - last < 1000 / 60) return
      last = t
      const now = t / 1000
      ;(u!.u_time.value as number) += now - prev
      prev = now
      const v = u!.u_visible.value as number
      const l = u!.u_visibleLerp.value as number
      ;(u!.u_visibleLerp.value as number) = Math.abs(v - l) > 0.001 ? l + (v - l) * LERP : v
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(loop)
  }).catch(() => { /* keep the <img> fallback */ })

  const ro = new ResizeObserver(() => {
    const nw = el.clientWidth || 1
    const nh = el.clientHeight || 1
    renderer.setSize(nw * dpr, nh * dpr)
    canvas.style.width = nw + 'px'
    canvas.style.height = nh + 'px'
    if (u) {
      ;(u.u_resolution.value as THREE.Vector2).set(nw, nh)
      ;(u.u_domWH.value as THREE.Vector2).set(nw, nh)
    }
  })
  ro.observe(el)

  return {
    destroy() {
      destroyed = true
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      geometry.dispose()
      canvas.remove()
      el.classList.remove('-has-canvas')
    },
  }
}

/** Init every [data-image-canvas] inside `root` (mobile only). Returns a cleanup. */
export function initSoseiCanvases(root: HTMLElement, assetBase = '/sosei'): () => void {
  const sp = window.matchMedia('(max-width: 820.98px)').matches
  if (!sp) return () => {}
  const instances: CanvasInstance[] = []
  root.querySelectorAll<HTMLElement>('[data-image-canvas]').forEach((el) => {
    if (el.clientWidth === 0) return
    const inst = makeCanvas(el, assetBase, sp)
    if (inst) instances.push(inst)
  })
  return () => instances.forEach((i) => i.destroy())
}
